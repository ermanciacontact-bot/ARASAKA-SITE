const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const tls = require("node:tls");
const { URL } = require("node:url");
const site = require("./data/site-data");

const PORT = Number(process.env.PORT || 4321);
const SITE_AUTH_ENABLED = process.env.SITE_AUTH === "1" || process.env.SITE_AUTH === "true";
const SITE_USERNAME = process.env.SITE_USERNAME || "arasaka";
const SITE_PASSWORD = process.env.SITE_PASSWORD || "test123";
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || "";
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const LEADS_FILE = path.join(ROOT, "data", "leads.jsonl");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function jsonScript(value) {
  return JSON.stringify(value)
    .replaceAll("&", "\\u0026")
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e");
}

function secureEqual(value, expected) {
  const valueBuffer = Buffer.from(String(value));
  const expectedBuffer = Buffer.from(String(expected));

  return (
    valueBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(valueBuffer, expectedBuffer)
  );
}

function isAuthorized(req) {
  if (!SITE_AUTH_ENABLED) {
    return true;
  }

  const authorization = req.headers.authorization || "";

  if (!authorization.startsWith("Basic ")) {
    return false;
  }

  try {
    const credentials = Buffer.from(authorization.slice(6), "base64").toString("utf8");
    const separatorIndex = credentials.indexOf(":");

    if (separatorIndex === -1) {
      return false;
    }

    const username = credentials.slice(0, separatorIndex);
    const password = credentials.slice(separatorIndex + 1);

    return secureEqual(username, SITE_USERNAME) && secureEqual(password, SITE_PASSWORD);
  } catch {
    return false;
  }
}

function requestAuthentication(res) {
  res.writeHead(401, {
    "Cache-Control": "no-store",
    "Content-Type": "text/plain; charset=utf-8",
    "WWW-Authenticate": 'Basic realm="ARASAKA", charset="UTF-8"',
  });
  res.end(res.omitBody ? undefined : "Authentification requise.");
}

function imageUrl(key) {
  return site.images[key] || "";
}

const transparentPixel =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

function whatsappLink(message) {
  const encoded = encodeURIComponent(message);
  return `${site.company.whatsappHref}?text=${encoded}`;
}

function gmailLink(subject, message) {
  return `${site.company.gmailHref}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

function smtpConfigured() {
  return Boolean(SMTP_USER && SMTP_PASS);
}

function smtpResponse(socket) {
  return new Promise((resolve, reject) => {
    let response = "";

    const cleanup = () => {
      socket.off("data", onData);
      socket.off("error", onError);
      socket.off("timeout", onTimeout);
    };
    const onError = (error) => {
      cleanup();
      reject(error);
    };
    const onTimeout = () => {
      cleanup();
      reject(new Error("SMTP timeout"));
    };
    const onData = (chunk) => {
      response += chunk.toString("utf8");
      const lines = response.split(/\r?\n/).filter(Boolean);
      const lastLine = lines.at(-1) || "";

      if (/^\d{3} /.test(lastLine)) {
        cleanup();
        resolve({ code: Number(lastLine.slice(0, 3)), response });
      }
    };

    socket.on("data", onData);
    socket.on("error", onError);
    socket.on("timeout", onTimeout);
  });
}

async function smtpCommand(socket, command, expectedCodes) {
  const responsePromise = smtpResponse(socket);
  socket.write(`${command}\r\n`);
  const result = await responsePromise;

  if (!expectedCodes.includes(result.code)) {
    throw new Error(`SMTP ${result.code}`);
  }

  return result;
}

function safeHeader(value) {
  return String(value || "").replace(/[\r\n]+/g, " ").trim();
}

function encodeHeader(value) {
  return `=?UTF-8?B?${Buffer.from(safeHeader(value), "utf8").toString("base64")}?=`;
}

async function sendContactEmail(lead, contactText) {
  if (!smtpConfigured()) {
    return { sent: false, reason: "SMTP_NOT_CONFIGURED" };
  }

  const socket = tls.connect({
    host: SMTP_HOST,
    port: SMTP_PORT,
    servername: SMTP_HOST,
  });
  socket.setTimeout(15_000);

  try {
    const greeting = await smtpResponse(socket);
    if (greeting.code !== 220) throw new Error(`SMTP ${greeting.code}`);

    await smtpCommand(socket, "EHLO arasaka.local", [250]);
    await smtpCommand(socket, "AUTH LOGIN", [334]);
    await smtpCommand(socket, Buffer.from(SMTP_USER).toString("base64"), [334]);
    await smtpCommand(socket, Buffer.from(SMTP_PASS).toString("base64"), [235]);
    await smtpCommand(socket, `MAIL FROM:<${safeHeader(SMTP_USER)}>`, [250]);
    await smtpCommand(socket, `RCPT TO:<${safeHeader(site.company.email)}>`, [250, 251]);
    await smtpCommand(socket, "DATA", [354]);

    const headers = [
      `From: ARASAKA Site <${safeHeader(SMTP_USER)}>`,
      `To: ${safeHeader(site.company.email)}`,
      lead.email ? `Reply-To: ${safeHeader(lead.email)}` : "",
      `Subject: ${encodeHeader(`Nouvelle demande ARASAKA - ${lead.name}`)}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: 8bit",
    ].filter(Boolean);
    const body = contactText
      .replace(/\r?\n/g, "\r\n")
      .split("\r\n")
      .map((line) => (line.startsWith(".") ? `.${line}` : line))
      .join("\r\n");

    const responsePromise = smtpResponse(socket);
    socket.write(`${headers.join("\r\n")}\r\n\r\n${body}\r\n.\r\n`);
    const result = await responsePromise;
    if (result.code !== 250) throw new Error(`SMTP ${result.code}`);
    await smtpCommand(socket, "QUIT", [221]);

    return { sent: true };
  } catch (error) {
    console.error(`Envoi email impossible: ${error.message}`);
    return { sent: false, reason: "SMTP_SEND_FAILED" };
  } finally {
    socket.destroy();
  }
}

function sectionIntro(kicker, title, text) {
  return `
    <div class="section-intro">
      <p class="kicker">${escapeHtml(kicker)}</p>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(text)}</p>
    </div>
  `;
}

function serviceCards(limit) {
  return site.services
    .slice(0, limit || site.services.length)
    .map(
      (service) => `
        <article class="service-card">
          <span class="service-mark" aria-hidden="true">${escapeHtml(service.title.slice(0, 2))}</span>
          <h3>${escapeHtml(service.title)}</h3>
          <p>${escapeHtml(service.short)}</p>
        </article>
      `,
    )
    .join("");
}

function materialCards() {
  return site.materials
    .map(
      (material) => `
        <article class="material-card">
          <img src="${imageUrl(material.imageKey)}" alt="${escapeHtml(material.title)} - ${escapeHtml(material.subtitle)}" loading="lazy">
          <div>
            <p class="card-eyebrow">${escapeHtml(material.subtitle)}</p>
            <h3>${escapeHtml(material.title)}</h3>
            <p>${escapeHtml(material.text)}</p>
            <dl class="material-benefits">
              <dt>Thermique</dt>
              <dd>${escapeHtml(material.thermal || "")}</dd>
              <dt>Écologique</dt>
              <dd>${escapeHtml(material.eco || "")}</dd>
            </dl>
          </div>
        </article>
      `,
    )
    .join("");
}

function planSvg(slug) {
  const specialLayout = {
    "premium-pool": `
      <image href="${imageUrl("premiumVillaPlan")}" x="8" y="8" width="314" height="194" preserveAspectRatio="xMidYMid slice"/>
      <path d="M50 112 C88 112, 112 100, 148 102 S204 116, 260 104" class="circulation-line" marker-end="url(#circulation-${escapeHtml(slug)})"/>
      <path d="M50 150 C92 142, 128 142, 168 146 S226 154, 280 146" class="circulation-line" marker-end="url(#circulation-${escapeHtml(slug)})"/>
      <path d="M70 42 C78 74, 78 104, 76 136" class="airflow-line" marker-end="url(#air-${escapeHtml(slug)})"/>
      <path d="M162 34 C158 70, 158 106, 160 142" class="airflow-line" marker-end="url(#air-${escapeHtml(slug)})"/>
      <path d="M256 40 C246 74, 246 106, 250 138" class="airflow-line" marker-end="url(#air-${escapeHtml(slug)})"/>
    `,
    compact: `
      <rect x="18" y="18" width="294" height="174" class="plan-bg"/>
      <rect x="30" y="48" width="270" height="86" class="room"/>
      <path d="M92 48 V134 M154 48 V134 M230 48 V134" class="wall"/>
      <path d="M52 134 q12 -12 24 0 M114 134 q12 -12 24 0 M184 134 q12 -12 24 0 M252 134 q12 -12 24 0" class="door"/>
      <text x="61" y="92" class="tiny">Chambre</text>
      <text x="123" y="92" class="tiny">Chambre</text>
      <text x="192" y="92" class="tiny">Séjour traversant</text>
      <text x="265" y="92" class="tiny">Suite</text>
      <rect x="30" y="134" width="270" height="26" class="veranda"/>
      <text x="165" y="151" class="tiny">Véranda linéaire sur jardin</text>
      <path d="M38 147 C94 147, 144 147, 194 147 S252 147, 290 147" class="circulation-line" marker-end="url(#circulation-${escapeHtml(slug)})"/>
      <path d="M61 34 V126" class="airflow-line" marker-end="url(#air-${escapeHtml(slug)})"/>
      <path d="M123 34 V126" class="airflow-line" marker-end="url(#air-${escapeHtml(slug)})"/>
      <path d="M192 34 V126" class="airflow-line" marker-end="url(#air-${escapeHtml(slug)})"/>
      <path d="M265 34 V126" class="airflow-line" marker-end="url(#air-${escapeHtml(slug)})"/>
      <path d="M40 178 C86 164, 126 184, 170 172 S250 164, 292 178" class="landscape"/>
    `,
  }[slug];

  const extra = {
    compact: `
      <rect x="236" y="66" width="62" height="76" class="pool"/>
      <text x="267" y="108" class="tiny">Bassin</text>
      <rect x="42" y="146" width="170" height="28" class="veranda"/>
      <text x="127" y="164" class="tiny">Véranda</text>
    `,
    patio: `
      <rect x="132" y="84" width="66" height="62" class="garden"/>
      <text x="165" y="119" class="tiny">Patio</text>
      <rect x="230" y="66" width="68" height="74" class="pool"/>
      <text x="264" y="106" class="tiny">Lagon</text>
    `,
    veranda: `
      <rect x="36" y="146" width="224" height="32" class="veranda"/>
      <text x="148" y="165" class="tiny">Grande véranda</text>
      <rect x="264" y="92" width="42" height="82" class="garden"/>
      <text x="285" y="136" class="tiny vertical">Jardin</text>
    `,
    diaspora: `
      <rect x="226" y="72" width="78" height="72" class="pool"/>
      <text x="265" y="111" class="tiny">Piscine</text>
      <rect x="48" y="36" width="204" height="22" class="veranda"/>
      <text x="150" y="51" class="tiny">Suivi étapes</text>
    `,
  }[slug] || "";

  return `
    <svg viewBox="0 0 330 210" role="img" aria-label="Plan de circulation et ventilation croisée ${escapeHtml(slug)}">
      <defs>
        <marker id="circulation-${escapeHtml(slug)}" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" class="circulation-marker"/>
        </marker>
        <marker id="air-${escapeHtml(slug)}" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" class="air-marker"/>
        </marker>
      </defs>
      ${
        specialLayout ||
        `
          <rect x="18" y="18" width="294" height="174" class="plan-bg"/>
          <rect x="36" y="36" width="86" height="62" class="room"/>
          <rect x="122" y="36" width="86" height="62" class="room"/>
          <rect x="36" y="98" width="106" height="48" class="room living"/>
          <rect x="142" y="98" width="66" height="48" class="room"/>
          <rect x="208" y="36" width="46" height="110" class="room service"/>
          <path d="M36 98 H208 M122 36 V98 M142 98 V146 M208 36 V146" class="wall"/>
          <path d="M74 98 q12 12 24 0 M166 98 q12 12 24 0 M208 84 q12 12 0 24" class="door"/>
          <text x="79" y="72" class="tiny">Chambre</text>
          <text x="164" y="72" class="tiny">Suite</text>
          <text x="89" y="126" class="tiny">Séjour</text>
          <text x="176" y="126" class="tiny">Cuisine</text>
          <text x="231" y="91" class="tiny vertical">Services</text>
          ${extra}
          <path d="M26 122 C62 122, 86 118, 112 118 S162 118, 198 92 S244 76, 282 76" class="circulation-line" marker-end="url(#circulation-${escapeHtml(slug)})"/>
          <path d="M26 58 C84 42, 134 52, 188 60 S254 72, 300 54" class="airflow-line" marker-end="url(#air-${escapeHtml(slug)})"/>
          <path d="M28 144 C88 158, 138 150, 190 138 S252 122, 300 140" class="airflow-line" marker-end="url(#air-${escapeHtml(slug)})"/>
          <path d="M48 184 C92 166, 126 200, 168 180 S246 162, 292 184" class="landscape"/>
        `
      }
    </svg>
  `;
}

function planCards() {
  return site.plans
    .map(
      (plan) => `
        <article class="plan-card">
          <div class="plan-art">${plan.imageKey ? `<img src="${imageUrl(plan.imageKey)}" alt="${escapeHtml(plan.title)}" loading="lazy">` : planSvg(plan.slug)}</div>
          <div class="plan-analysis">
            <h4>Plan de circulation et ventilation croisée</h4>
            ${planSvg(plan.slug)}
            <div class="plan-legend">
              <span class="circulation-key">Circulation fluide</span>
              <span class="airflow-key">Ventilation croisée</span>
            </div>
          </div>
          <div class="plan-body">
            <p class="card-eyebrow">${escapeHtml(plan.surface)}</p>
            <h3>${escapeHtml(plan.title)}</h3>
            <ul>
              ${plan.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}
            </ul>
            <a class="link-arrow" href="/contact?plan=${encodeURIComponent(plan.title)}">Demander ce plan</a>
          </div>
        </article>
      `,
    )
    .join("");
}

function galleryCards() {
  return site.gallery
    .map(
      (item, index) => `
        <article class="gallery-card" data-category="${escapeHtml(item.category)}">
          <button class="gallery-open" type="button" data-lightbox-src="${imageUrl(item.imageKey)}" data-lightbox-title="${escapeHtml(item.title)}" aria-label="Agrandir la photo: ${escapeHtml(item.title)}">
            <img src="${imageUrl(item.imageKey)}" alt="${escapeHtml(item.title)}" loading="${index === 0 ? "eager" : "lazy"}" fetchpriority="${index === 0 ? "high" : "auto"}" decoding="async">
            <span class="gallery-zoom">Agrandir</span>
          </button>
          <div class="gallery-caption">
            <p>${escapeHtml(item.title)}</p>
            <span>${escapeHtml(item.category.replaceAll("-", " "))}</span>
          </div>
        </article>
      `,
    )
    .join("");
}

function portfolioCards(items = site.portfolioItems) {
  return items
    .map(
      (item, index) => `
        <article class="portfolio-card" data-category="${escapeHtml(item.category)}">
          <button class="portfolio-open" type="button" data-lightbox-src="${escapeHtml(item.src)}" data-lightbox-title="${escapeHtml(`${item.title} — ${item.caption}`)}" aria-label="Agrandir: ${escapeHtml(item.title)}">
            <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.title)}" loading="${index < 4 ? "eager" : "lazy"}" fetchpriority="${index === 0 ? "high" : "auto"}" decoding="async">
            <span class="gallery-zoom">Agrandir</span>
          </button>
          <div class="portfolio-card-body">
            <p class="card-eyebrow">${escapeHtml(item.label)}</p>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.caption)}</p>
            <span>${escapeHtml(item.usage)}</span>
          </div>
        </article>
      `,
    )
    .join("");
}

function partnerRealisationPhotoSections() {
  return (site.partnerRealisationPhotoGroups || [])
    .map(
      (group) => `
        <section class="partner-photo-group" aria-label="${escapeHtml(group.title)}">
          <div class="partner-photo-heading">
            <div>
              <p class="kicker">${escapeHtml(group.partner)}</p>
              <h3>${escapeHtml(group.title)}</h3>
              <p>${escapeHtml(group.intro)}</p>
            </div>
            <span>${escapeHtml(group.source)}</span>
          </div>
          <div class="partner-photo-grid">
            ${(group.items || [])
              .map(
                (item) => `
                  <article class="partner-photo-card">
                    <button class="partner-photo-open" type="button" data-lightbox-src="${escapeHtml(item.src)}" data-lightbox-title="${escapeHtml(`${item.title} - ${group.partner}`)}" aria-label="Agrandir: ${escapeHtml(item.title)}">
                      <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async">
                      <span>Agrandir</span>
                    </button>
                    <div class="partner-photo-body">
                      <p class="card-eyebrow">${escapeHtml(item.category)}</p>
                      <h4>${escapeHtml(item.title)}</h4>
                      <p>${escapeHtml(item.location)}</p>
                    </div>
                  </article>
                `,
              )
              .join("")}
          </div>
        </section>
      `,
    )
    .join("");
}

function xgoneReferenceCards() {
  return (site.xgoneInternationalProjects || [])
    .map((project) => {
      const meta = [
        ["Lieu", project.location],
        ["Client", project.client],
        ["Montant", project.amount],
        ["Période", project.period],
      ].filter(([, value]) => Boolean(value));

      return `
        <article class="xgone-reference-card">
          <div class="xgone-reference-topline">
            <span>${escapeHtml(project.type)}</span>
            <strong>${escapeHtml(project.status)}</strong>
          </div>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.summary)}</p>
          <dl class="xgone-reference-meta">
            ${meta
              .map(
                ([label, value]) => `
                  <div>
                    <dt>${escapeHtml(label)}</dt>
                    <dd>${escapeHtml(value)}</dd>
                  </div>
                `,
              )
              .join("")}
          </dl>
          <ul>
            ${(project.highlights || [])
              .map((highlight) => `<li>${escapeHtml(highlight)}</li>`)
              .join("")}
          </ul>
        </article>
      `;
    })
    .join("");
}

function xgoneAdditionalReferenceList() {
  return (site.xgoneAdditionalReferences || [])
    .map((reference) => `<li>${escapeHtml(reference)}</li>`)
    .join("");
}

function portfolioVirtualTourCards() {
  return site.portfolioVirtualTours
    .map(
      (tour, index) => `
        <article class="virtual-tour-card">
          <button class="virtual-tour-open" type="button" data-tour-index="${index}" aria-label="Lancer le diaporama: ${escapeHtml(tour.title)}">
            <img src="${escapeHtml(tour.cover)}" alt="${escapeHtml(tour.title)}" loading="lazy" decoding="async">
            <span>Diaporama</span>
          </button>
          <div class="virtual-tour-body">
            <p class="card-eyebrow">Visite virtuelle photo</p>
            <h3>${escapeHtml(tour.title)}</h3>
            <p>${escapeHtml(tour.subtitle)}</p>
          </div>
        </article>
      `,
    )
    .join("");
}

function portfolioCapabilityCards() {
  return site.portfolioCapabilities
    .map((capability) => `<span>${escapeHtml(capability)}</span>`)
    .join("");
}

function villaGalleryVideoSection() {
  const video = site.homeVillaVideo;
  const detailGroups = (video.detailGroups || [])
    .map(
      (group) => `
            <article>
              <h3>${escapeHtml(group.title)}</h3>
              <ul>
                ${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </article>
      `,
    )
    .join("");

  return `
      <section class="villa-video-section" id="visite-video-villa">
        <div class="villa-video-inner">
          <div class="villa-video-copy">
            <p class="kicker">${escapeHtml(video.label || "Visite guidée")}</p>
            <h2>${escapeHtml(video.title)}.</h2>
            <p>${escapeHtml(video.description)}</p>
            ${video.commercialCopy ? `<p class="villa-video-sales-copy">${escapeHtml(video.commercialCopy)}</p>` : ""}
            <div class="villa-video-price">
              <span>Prix proposé</span>
              <strong>${escapeHtml(video.price)}</strong>
            </div>
            <ul class="villa-video-features">
              ${video.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}
            </ul>
            ${detailGroups ? `<div class="villa-video-details">${detailGroups}</div>` : ""}
          </div>
          <figure class="villa-video-player">
            <img src="${escapeHtml(video.video)}" alt="Visite guidée animée de ${escapeHtml(video.title)}" loading="eager" decoding="async">
            <figcaption>Villa basse premium 3 chambres, chacune avec salle de bain, cuisine meublée et équipée, cuisine africaine, buanderie, cellier et véranda bois.</figcaption>
          </figure>
        </div>
      </section>
  `;
}

function processCards() {
  return site.process
    .map(
      (item) => `
        <article class="process-card">
          <span>${escapeHtml(item.step)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </article>
      `,
    )
    .join("");
}

function targetMarketCards() {
  return site.targetMarkets
    .map(
      (market) => `
        <article class="market-card">
          <p class="card-eyebrow">${escapeHtml(market.scope)}</p>
          <h3>${escapeHtml(market.title)}</h3>
          <p>${escapeHtml(market.text)}</p>
        </article>
      `,
    )
    .join("");
}

function advantageCards() {
  return site.advantages
    .map(
      (advantage) => `
        <article class="advantage-card">
          <h3>${escapeHtml(advantage.title)}</h3>
          <p>${escapeHtml(advantage.text)}</p>
        </article>
      `,
    )
    .join("");
}

function offerCards() {
  return site.offers
    .map(
      (offer) => `
        <article class="offer-card">
          <p class="card-eyebrow">${escapeHtml(offer.audience)}</p>
          <h3>${escapeHtml(offer.title)}</h3>
          <p>${escapeHtml(offer.text)}</p>
          <a class="link-arrow" href="${offer.href || `/contact?offre=${encodeURIComponent(offer.title)}`}">${escapeHtml(offer.cta)}</a>
        </article>
      `,
    )
    .join("");
}

function remoteBuildOfferCards() {
  return site.remoteBuildOffers
    .map(
      (offer) => `
        <article class="remote-offer-card">
          <p class="card-eyebrow">${escapeHtml(offer.subtitle)}</p>
          <h3>${escapeHtml(offer.title)}</h3>
          <p>${escapeHtml(offer.text)}</p>
          <ul>
            ${offer.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}
          </ul>
          <a class="link-arrow" href="/contact?offre=${encodeURIComponent(offer.title)}">${escapeHtml(offer.cta)}</a>
        </article>
      `,
    )
    .join("");
}

function remotePhotoCards() {
  return site.remoteBuildPhotos
    .map(
      (photo) => `
        <article class="remote-photo-card">
          <img src="${imageUrl(photo.imageKey)}" alt="${escapeHtml(photo.title)}" loading="lazy">
          <div>
            <h3>${escapeHtml(photo.title)}</h3>
            <p>${escapeHtml(photo.text)}</p>
          </div>
        </article>
      `,
    )
    .join("");
}

function layout({ active, title, description, body, bodyClass = "" }) {
  const nav = site.nav
    .map(
      (item) => `
        <a class="${item.key === active ? "active" : ""}" href="${item.href}">${escapeHtml(item.label)}</a>
      `,
    )
    .join("");

  const schema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: site.company.name,
    description,
    address: site.company.location,
    telephone: site.company.phone,
    email: site.company.email,
    areaServed: ["Côte d'Ivoire", "Abidjan", "France", "Diaspora ivoirienne"],
    founder: site.company.director,
  };

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)} | ${site.company.name}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="theme-color" content="#123923">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/styles.css?v=20260704-2">
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
  </head>
  <body class="${escapeHtml(bodyClass)}">
    <header class="site-header">
      <a class="brand" href="/" aria-label="Accueil ARASAKA">
        <strong>ARASAKA</strong>
        <span>${escapeHtml(site.company.baseline)}</span>
      </a>
      <button class="menu-toggle" type="button" data-menu-toggle aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="main-nav">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav class="main-nav" id="main-nav" data-main-nav aria-label="Navigation principale">
        ${nav}
      </nav>
      <a class="phone-link" href="${site.company.telHref}">
        <span aria-hidden="true">Tel</span>
        ${escapeHtml(site.company.phone)}
      </a>
    </header>
    <main>
      ${body}
    </main>
    <a class="floating-contact" href="${site.company.whatsappHref}" target="_blank" rel="noreferrer">
      WhatsApp
    </a>
    <footer class="site-footer">
      <div>
        <strong>ARASAKA</strong>
        <p>${escapeHtml(site.company.baseline)}</p>
      </div>
      <div>
        <span>Côte d'Ivoire</span>
        <p>${escapeHtml(site.company.location)}</p>
      </div>
      <div>
        <span>France</span>
        <p>${escapeHtml(site.company.ermanciaLocation)}</p>
      </div>
      <div>
        <span>Direction</span>
        <p>${escapeHtml(site.company.director)}</p>
      </div>
      <div>
        <span>Contact</span>
        <p><a href="${site.company.telHref}">${escapeHtml(site.company.phone)}</a><br><a href="${site.company.gmailHref}" target="_blank" rel="noreferrer">${escapeHtml(site.company.email)}</a></p>
      </div>
    </footer>
    <div class="lightbox" data-lightbox hidden aria-modal="true" role="dialog" aria-label="Photo agrandie">
      <button class="lightbox-close" type="button" data-lightbox-close aria-label="Fermer la photo">Fermer</button>
      <img class="lightbox-image" data-lightbox-image src="${transparentPixel}" alt="Photo agrandie">
      <p class="lightbox-title" data-lightbox-title></p>
      <div class="lightbox-controls" data-tour-controls hidden>
        <button type="button" data-tour-prev>Précédent</button>
        <span data-tour-count></span>
        <button type="button" data-tour-next>Suivant</button>
      </div>
    </div>
    <script src="/app.js?v=20260704-2" defer></script>
  </body>
</html>`;
}

function renderHome() {
  const message =
    "Bonjour ARASAKA, je souhaite demander une étude pour un projet de villa ou rénovation en Côte d'Ivoire.";

  return layout({
    active: "home",
    title: "Accueil",
    description:
      "ARASAKA accompagne les projets de construction, rénovation, agrandissement, finitions et aménagements extérieurs en Côte d'Ivoire.",
    bodyClass: "page-home",
    body: `
      <section class="hero hero-home" style="--hero-image: url('${imageUrl("hero")}')">
        <div class="hero-content">
          <p class="kicker">Construction & rénovation premium</p>
          <h1>Construire en harmonie avec le climat tropical.</h1>
          <div class="hero-actions">
            <a class="button primary" href="/contact">Demander une étude</a>
            <a class="button ghost" href="/realisations">Voir nos réalisations</a>
          </div>
        </div>
      </section>

      ${villaGalleryVideoSection()}

      <section class="content-band compact-band">
        ${sectionIntro("Ambiances premium", "Plus de matières, plus de lumière, plus d'espaces extérieurs", "Villas blanches, BTC, terrasses en teck, piscines lagon, jardins et intérieurs ouverts donnent une lecture concrète du niveau recherché.")}
        <div class="home-photo-grid">
          ${["hero", "premiumVillaConcept", "bricks", "whiteDuplexPool02", "tropicalPool", "teakTerrace", "interiorWood", "coveredTerrace"].map((key) => `<img src="${imageUrl(key)}" alt="Ambiance premium ARASAKA" loading="lazy">`).join("")}
        </div>
      </section>

      <section class="content-band">
        ${sectionIntro("Offres commerciales", "Un accompagnement adapté à chaque projet", "Construction, rénovation, finalisation d'un appartement en promotion immobilière, investissement ou création d'un art de vivre tropical : chaque offre est cadrée selon le bien, le budget et le niveau de finition attendu.")}
        <div class="offer-grid">${offerCards()}</div>
      </section>

      <section class="content-band muted-band">
        ${sectionIntro("Services", "Des prestations complètes pour villas, rénovations et investissements locatifs", "Construction, rénovation, architecture tropicale, piscines lagon, pergolas, jardins, petits immeubles et accompagnement à distance.")}
        <div class="service-grid">${serviceCards(8)}</div>
        <div class="center-action"><a class="button secondary" href="/services">Explorer tous les services</a></div>
      </section>

      <section class="content-band">
        ${sectionIntro("Entité architecturale", "ARASAKA et GE Architectes & Partenaires (GEAP) forment une même entité", "Cette entité réunit bâtiment, architecture, urbanisme, ingénierie, maîtrise d'oeuvre complète et coordination de projets d'envergure.")}
        <div class="geap-showcase">
          <a class="geap-preview" href="/assets/geap-architectes-pressbook.pdf" target="_blank" rel="noreferrer" aria-label="Ouvrir le pressbook GE Architectes & Partenaires">
            <img src="/assets/geap-architectes-pressbook-apercu.png" alt="Extrait du pressbook GE Architectes & Partenaires">
          </a>
          <div class="geap-copy">
            <p class="kicker">Cabinet partenaire</p>
            <h3>GE Architectes & Partenaires constitue le pôle architecture, urbanisme et ingénierie de l'entité ARASAKA.</h3>
            <p>Le pressbook présente une expertise en architecture, urbanisme, ingénierie, études préalables, programmes, planification et assistance à maîtrise d'ouvrage. Pour les projets ARASAKA, cela signifie des projets mieux cadrés, des choix architecturaux plus solides et une coordination renforcée entre conception et réalisation.</p>
            <div class="geap-proof-grid">
              <div><span>Architecture</span><strong>Equipements urbains, bureaux, logements, rénovation, réhabilitation et habitat planifié.</strong></div>
              <div><span>Urbanisme</span><strong>Schémas directeurs, restructuration, projets littoraux, réseaux et équipements urbains.</strong></div>
              <div><span>Références</span><strong>Togo, Bénin, Gabon, Côte d'Ivoire, Sénégal et Burkina Faso.</strong></div>
              <div><span>Maîtrise d'oeuvre</span><strong>Missions complètes, conduite d'opération et suivi structuré de projets.</strong></div>
            </div>
            <div class="hero-actions">
              <a class="button secondary" href="/assets/geap-architectes-pressbook.pdf" target="_blank" rel="noreferrer">Consulter la fiche GEAP</a>
              <a class="button ghost-dark" href="/qui-sommes-nous">Comprendre l'entité</a>
            </div>
          </div>
        </div>
      </section>

      <section class="dark-cta">
        <div>
          <p class="kicker">Confort thermique</p>
          <h2>Moins de climatisation en journée, plus d'air, plus d'ombre, plus de calme.</h2>
          <p>Les matériaux naturels, les baies vitrées bien protégées, les vérandas et la ventilation croisée permettent de créer des maisons respirantes, adaptées aux usages tropicaux.</p>
        </div>
        <a class="button light" href="${whatsappLink(message)}" target="_blank" rel="noreferrer">Parler du projet</a>
      </section>
    `,
  });
}

function renderFicheArasaka() {
  return layout({
    active: "fiche",
    title: "Fiche complète",
    description:
      "Fiche commerciale complète ARASAKA: bâtiment, rénovation, matériaux naturels, plans de villas, galerie et engagements qualité.",
    bodyClass: "page-fiche",
    body: `
      <section class="hero hero-fiche" style="--hero-image: url('${imageUrl("hero")}')">
        <div class="hero-content">
          <p class="kicker">Fiche complète</p>
          <h1>ARASAKA, bâtiment, rénovation et architecture tropicale premium.</h1>
          <p class="hero-copy">Une approche commerciale claire, haut de gamme et structurée: villas, rénovations, matériaux naturels, piscines lagon, pergolas, jardins et suivi à distance.</p>
          <div class="hero-actions">
            <a class="button primary" href="/contact">Demander une étude</a>
            <a class="button ghost" href="/realisations">Voir les réalisations</a>
          </div>
        </div>
      </section>

      <section class="proof-band">
        ${site.proofPoints.map((point) => `<span>${escapeHtml(point)}</span>`).join("")}
      </section>

      <section class="split-feature">
        <img src="${imageUrl("premiumVillaConcept")}" alt="Villa blanche premium avec terrasse et piscine naturelle">
        <div>
          <p class="kicker">Excellence constructive</p>
          <h2>Du cadrage du projet aux finitions, chaque détail doit être maîtrisé.</h2>
          <p>${escapeHtml(site.company.standards)}</p>
          <p>${escapeHtml(site.company.finishPromise)}</p>
          <div class="fact-grid">
            <div><span>Base</span><strong>Abidjan, Angre 7e Tranche</strong></div>
            <div><span>Direction</span><strong>${escapeHtml(site.company.director)}</strong></div>
            <div><span>France</span><strong>${escapeHtml(site.company.ermanciaLocation)}</strong></div>
            <div><span>Études</span><strong>GE Architectes & Partenaires (GEAP)</strong></div>
          </div>
        </div>
      </section>

      <section class="content-band muted-band">
        ${sectionIntro("Nos services", "Des prestations lisibles pour décider vite", "Construction de villas, rénovation, architecture tropicale, aménagements extérieurs, piscines lagon, pergolas, petits immeubles et suivi diaspora.")}
        <div class="service-grid">${serviceCards(8)}</div>
      </section>

      <section class="content-band">
        ${sectionIntro("Matériaux, performance et confort", "Béton, BTC, bois africain, bambou, pisé et végétalisation", "Les matériaux sont choisis pour leur rendu, leur durabilité, leur confort thermique et leur cohérence avec le climat tropical.")}
        <div class="materials-grid">${materialCards()}</div>
      </section>

      <section class="content-band muted-band">
        ${sectionIntro("Plans de villas & concepts", "Des bases premium à adapter au terrain", "Villa blanche avec terrasse et piscine, villa patio, grande véranda, résidence suivie à distance: chaque concept sert à cadrer un projet précis.")}
        <div class="plans-grid">${planCards()}</div>
      </section>

      <section class="content-band">
        ${sectionIntro("Galerie réalisations", "Villas blanches, BTC, jardins, piscines et terrasses", "Une sélection d'ambiances pour visualiser le niveau de finition, les matériaux et les espaces extérieurs.")}
        <div class="gallery-grid">${galleryCards()}</div>
        <div class="center-action"><a class="button ghost-dark" href="/realisations">Voir toute la galerie</a></div>
      </section>

      <section class="dark-cta">
        <div>
          <p class="kicker">Engagement qualité</p>
          <h2>Délais, normes internationales, finitions soignées et définition précise du projet.</h2>
          <p>ARASAKA met en avant un chantier documenté, des décisions claires et une finition alignée avec les standards internationaux les plus exigeants.</p>
        </div>
        <a class="button light" href="/contact">Planifier une étude</a>
      </section>
    `,
  });
}

function renderDiaspora() {
  const message =
    "Bonjour ARASAKA, je souhaite étudier un projet de construction, rénovation ou extension en Côte d'Ivoire depuis l'étranger.";

  return layout({
    active: "diaspora",
    title: "Diaspora",
    description:
      "Offre diaspora ARASAKA pour construire, rénover, agrandir ou aménager un bien en Côte d'Ivoire avec un suivi clair depuis l'étranger.",
    bodyClass: "page-diaspora",
    body: `
      <section class="page-hero remote-hero diaspora-hero" style="--hero-image: url('${imageUrl("diasporaClients")}')">
        <div>
          <p class="kicker">Offre diaspora</p>
          <h1>Construire, rénover ou agrandir en Côte d'Ivoire depuis l'étranger.</h1>
          <p class="page-hero-copy">ARASAKA transforme votre projet en un cadre de vie moderne africain, avec un interlocuteur unique, un budget cadré et un suivi documenté jusqu'à la livraison.</p>
          <div class="hero-actions">
            <a class="button primary" href="/contact?offre=Projet%20diaspora">Présenter mon projet</a>
            <a class="button ghost" href="${whatsappLink(message)}" target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
      </section>

      <section class="content-band">
        ${sectionIntro("Offre diaspora", "Quatre façons de concrétiser votre projet", "Choisissez votre besoin principal. ARASAKA définit ensuite le programme, les études, le budget, le planning et le niveau de finition.")}
        <div class="offer-grid">
          <article class="offer-card"><p class="card-eyebrow">Construction</p><h3>Villa ou maison familiale clé en main</h3><p>Conception, estimation, études, chantier, finitions et livraison d'un bien adapté au climat tropical.</p><a class="link-arrow" href="/contact?offre=Construction%20diaspora">Étudier une construction</a></article>
          <article class="offer-card"><p class="card-eyebrow">Transformation</p><h3>Rénovation et extension</h3><p>Modernisation d'un bien, agrandissement, reprise des finitions et amélioration du confort intérieur et extérieur.</p><a class="link-arrow" href="/contact?offre=Renovation%20et%20extension%20diaspora">Étudier une transformation</a></article>
          <article class="offer-card"><p class="card-eyebrow">Cadre de vie</p><h3>Un art de vivre moderne africain</h3><p>Jardin tropical, terrasse couverte, pergola, piscine lagon, cuisine ouverte et espaces pensés pour vivre dedans comme dehors.</p><a class="link-arrow" href="/contact?offre=Art%20de%20vivre%20moderne%20africain">Composer mon cadre de vie</a></article>
          <article class="offer-card"><p class="card-eyebrow">Pilotage</p><h3>Suivi et réception à distance</h3><p>Planning, points de validation, photos, vidéos, réunions visio, contrôle qualité et réception documentée.</p><a class="link-arrow" href="/contact?offre=Suivi%20et%20reception%20a%20distance">Organiser le suivi</a></article>
        </div>
      </section>

      <section class="content-band muted-band">
        ${sectionIntro("Parcours projet", "Une méthode simple, de la première discussion à la réception", "Chaque étape produit des décisions et documents clairs avant de passer à la suivante.")}
        <div class="fact-grid">
          <div><span>01. Cadrage</span><strong>Terrain, besoins, style, budget indicatif et niveau de finition.</strong></div>
          <div><span>02. Études</span><strong>Programme, conception, estimation, devis et planning prévisionnel.</strong></div>
          <div><span>03. Réalisation</span><strong>Chantier coordonné, validations par étapes et contrôle qualité.</strong></div>
          <div><span>04. Livraison</span><strong>Réception documentée, réserves suivies et remise du bien.</strong></div>
        </div>
      </section>

      <section class="split-feature">
        <img src="${imageUrl("diasporaSite")}" alt="Techniciens et suivi de chantier premium">
        <div>
          <p class="kicker">Pilotage à distance</p>
          <h2>Vous gardez une vision claire du projet et des décisions à prendre.</h2>
          <p>Le suivi rassemble les informations utiles au même endroit et distingue l'avancement, les arbitrages, le budget et les prochaines étapes.</p>
          <ul class="check-list">
            <li>Interlocuteur projet et fil WhatsApp dédié</li>
            <li>Comptes rendus avec photos et vidéos</li>
            <li>Validations et appels de fonds par étapes</li>
            <li>Coordination des études et du chantier</li>
            <li>Contrôle des finitions avant réception</li>
          </ul>
        </div>
      </section>

      <section class="split-feature reverse">
        <img src="${imageUrl("diasporaClients")}" alt="Échange avec des clients de la diaspora">
        <div>
          <p class="kicker">Une expérience partagée</p>
          <h2>Comprendre les attentes de la diaspora pour construire avec confiance.</h2>
          <p>Étant moi-même issu de la diaspora et professionnel du bâtiment, je comprends les attentes de ceux qui souhaitent construire en Côte d'Ivoire avec confiance. Mon ambition avec ARASAKA est de proposer une approche équilibrée : valoriser les matériaux locaux, respecter le climat tropical, affirmer une architecture africaine contemporaine et apporter une méthode de travail rigoureuse, transparente et soignée.</p>
          <p>ARASAKA est un pont entre l'identité architecturale africaine et les exigences contemporaines du bâtiment. Nous concevons et réalisons des villas, rénovations et espaces extérieurs qui valorisent les matériaux locaux, le confort tropical et les finitions haut de gamme.</p>
        </div>
      </section>

      <section class="content-band muted-band">
        ${sectionIntro("Inspirations", "Villas, piscines, jardins et finitions premium", "Quelques ambiances pour cadrer le projet avant les études détaillées.")}
        <div class="home-photo-grid">
          ${["premiumVillaConcept", "poolSun01", "poolCourtyard02", "interiorCourtyardLiving", "suiteCourtyard", "vegetalFence02", "bambooWall", "teakTerrace"].map((key) => `<img src="${imageUrl(key)}" alt="Inspiration diaspora ARASAKA" loading="lazy">`).join("")}
        </div>
      </section>

      <section class="dark-cta">
        <div>
          <p class="kicker">Première étude</p>
          <h2>Présentez votre terrain, votre bien ou votre projet.</h2>
          <p>Indiquez la localisation, les documents disponibles, le budget indicatif et le résultat recherché pour recevoir une première orientation.</p>
        </div>
        <a class="button light" href="/contact?offre=Projet%20diaspora">Demander une étude diaspora</a>
      </section>
    `,
  });
}

function renderAbout() {
  return layout({
    active: "about",
    title: "Qui sommes-nous",
    description:
      "ARASAKA, un pont entre architecture africaine contemporaine et exigences modernes en Côte d'Ivoire.",
    body: `
      <section class="page-hero compact" style="--hero-image: url('${imageUrl("materialsHeroNatural")}')">
        <div>
          <p class="kicker">Qui sommes-nous</p>
          <h1>ARASAKA — Un pont entre architecture africaine contemporaine et exigences modernes.</h1>
        </div>
      </section>

      <section class="two-column">
        <div>
          ${sectionIntro("Notre conviction", "Construire avec identité, confort et exigence", "ARASAKA est née d'une conviction simple : il est possible de construire en Côte d'Ivoire des maisons élégantes, durables et confortables, en respectant le climat tropical, les matériaux locaux et l'identité architecturale africaine.")}
          <p>Notre approche ne consiste pas à importer un modèle extérieur, mais à créer un équilibre entre tradition, modernité et exigence. Nous valorisons les matériaux naturels disponibles sur le sol ivoirien — BTC, terre, bois, bambou, pierre, végétation tropicale — tout en intégrant les standards actuels de confort, de fonctionnalité, de rigueur et de finition.</p>
          <p>ARASAKA s'adresse particulièrement à la diaspora ivoirienne, parce que nous comprenons ses attentes : construire à distance, sécuriser son investissement, suivre les travaux avec transparence et obtenir un résultat à la hauteur de ses ambitions.</p>
          <p>Notre vision est celle d'une architecture africaine moderne, enracinée dans son environnement, ouverte sur le monde, mais profondément adaptée au mode de vie ivoirien : maisons ventilées, espaces fluides, grandes terrasses, jardins tropicaux, pergolas, patios, piscines lagon et finitions soignées.</p>
          <p><strong>Avec ARASAKA, construire en Côte d'Ivoire devient un projet clair, maîtrisé et élégant.</strong></p>
        </div>
        <aside class="identity-panel">
          <h2>ARASAKA en bref</h2>
          <dl>
            <dt>Société</dt>
            <dd>ARASAKA</dd>
            <dt>Implantation</dt>
            <dd>${escapeHtml(site.company.location)}</dd>
            <dt>Direction</dt>
            <dd>${escapeHtml(site.company.director)}</dd>
            <dt>Architecture</dt>
            <dd>${escapeHtml(site.company.architectPartner)}</dd>
            <dt>International</dt>
            <dd>${escapeHtml(site.company.internationalPartner)}</dd>
            <dt>Régularité des opérations</dt>
            <dd>${escapeHtml(site.company.legalOperationsPartner)}</dd>
            <dt>Approche</dt>
            <dd>Architecture africaine contemporaine, confort tropical et finitions haut de gamme.</dd>
          </dl>
        </aside>
      </section>

      <section class="content-band">
        ${sectionIntro("Notre méthode", "Une exigence moderne au service d'une architecture enracinée", "Chaque projet associe une définition précise du besoin, des études cohérentes, un suivi transparent et une attention constante portée aux finitions.")}
        <div class="commitment-grid">
          <article><h3>Respect des délais</h3><p>Planning par étapes, points d'avancement et priorisation des decisions critiques.</p></article>
          <article><h3>Normes internationales</h3><p>Culture de chantier structurée, standards techniques et contrôle qualité.</p></article>
          <article><h3>Finitions soignées</h3><p>Attention portee aux matériaux, raccords, détails visibles et confort quotidien.</p></article>
          <article><h3>Projet précis</h3><p>Plans, programme, budget et choix matériaux clarifiés avant exécution.</p></article>
          <article><h3>Entité ARASAKA - GEAP</h3><p>GE Architectes & Partenaires constitue le pôle architecture, urbanisme et ingénierie de la même entité, pour renforcer la cohérence des études, la coordination du projet, la qualité architecturale et la maîtrise des délais.</p></article>
          <article><h3>Partenaire international X-GONE BTP</h3><p>Basée à Lomé au Togo, X-GONE BTP apporte une expérience d'entreprise générale sur projets publics et privés, construction neuve, rénovation lourde, génie civil et bâtiments de prestige.</p></article>
          <article><h3>Cabinet GR CONSULTING</h3><p>GROUPE ROYAL CONSULTING accompagne la régularité des opérations: management juridique, création, gestion, formation, assistance juridique, recouvrement et renforcement des capacités.</p></article>
        </div>
      </section>
    `,
  });
}

function renderServices() {
  return layout({
    active: "services",
    title: "Nos offres de prestations",
    description:
      "Services ARASAKA: construction de villas, rénovation haut de gamme, architecture tropicale, piscines lagon, pergolas et accompagnement diaspora.",
    body: `
      <section class="page-hero compact" style="--hero-image: url('${imageUrl("tropicalPool")}')">
        <div>
          <p class="kicker">ARASAKA</p>
          <h1>Nos offres de prestations</h1>
          <p class="page-hero-copy">Construire, rénover et aménager avec une vision complète du cadre de vie.</p>
        </div>
      </section>

      <section class="content-band">
        ${sectionIntro("Prestations", "Des services pour chaque étape du projet", "Du cadrage initial aux finitions, chaque prestation peut être mobilisée seule ou dans une mission complète.")}
        <div class="service-grid expanded">${serviceCards()}</div>
      </section>

      <section class="process-section">
        ${sectionIntro("Méthode", "Un parcours de projet lisible", "Chaque projet est structuré pour réduire les approximations et protéger la qualité finale.")}
        <div class="process-grid">${processCards()}</div>
      </section>
    `,
  });
}

function renderRemoteBuild() {
  const message =
    "Bonjour ARASAKA, je souhaite construire ou rénover depuis l'extérieur avec un suivi à distance.";

  return layout({
    active: "remote",
    title: "Construire depuis l'extérieur",
    description:
      "Construire depuis l'extérieur avec ARASAKA: rénovation, villa clé en main et suivi diaspora pour projets en Côte d'Ivoire.",
    bodyClass: "page-remote-build",
    body: `
      <section class="page-hero remote-hero" style="--hero-image: url('${imageUrl("remoteHero")}')">
        <div>
          <p class="kicker">Clients locaux et projets suivis à distance</p>
          <h1>Construire avec méthode, même lorsque le projet se pilote à distance.</h1>
          <p class="page-hero-copy">ARASAKA accompagne les clients en Côte d'Ivoire et à l'extérieur avec un cadre clair: études, budget, planning, photos, vidéos et validations par étapes.</p>
          <div class="hero-actions">
            <a class="button primary" href="/contact?offre=Suivi%20diaspora">Demander un suivi diaspora</a>
            <a class="button ghost" href="/plans">Voir les concepts de villas</a>
          </div>
        </div>
      </section>

      <section class="content-band">
        ${sectionIntro("3 offres", "Rénovation, villa clé en main, suivi diaspora", "Choisissez une entrée simple, puis ARASAKA affine le programme, les matériaux, le budget et les étapes avec vous.")}
        <div class="remote-offer-grid">${remoteBuildOfferCards()}</div>
      </section>

      <section class="remote-trust">
        <div>
          <p class="kicker">Ce qui est sécurisé</p>
          <h2>Un projet visible, documenté et validé à distance.</h2>
          <p>Le suivi à distance doit rassurer: devis détaillé, calendrier, compte rendu, photos, vidéos WhatsApp, réunions visio et appels de fonds par étapes. L'entité ARASAKA - GE Architectes & Partenaires (GEAP) aide à garder des études cohérentes et des délais mieux maîtrisés.</p>
        </div>
        <div class="trust-list">
          <span>Devis détaillé</span>
          <span>Photos et vidéos</span>
          <span>Réunions visio</span>
          <span>Planning travaux</span>
          <span>Contrôle qualité</span>
          <span>Livraison cadrée</span>
        </div>
      </section>

      <section class="content-band muted-band">
        ${sectionIntro("Photos d'inspiration", "Villas tropicales, matériaux locaux et vie extérieure", "Bois, bambou, BTC, pisé, jardins tropicaux, pergolas et terrasses couvertes composent une architecture adaptée au climat tropical.")}
        <div class="remote-photo-grid">${remotePhotoCards()}</div>
      </section>

      <section class="dark-cta">
        <div>
          <p class="kicker">Premier échange</p>
          <h2>Vous êtes à l'extérieur et vous avez un terrain ou une maison à rénover ?</h2>
          <p>Envoyez la localisation, les photos disponibles, le budget indicatif et le type de projet. ARASAKA vous aide à cadrer la suite.</p>
        </div>
        <a class="button light" href="${whatsappLink(message)}" target="_blank" rel="noreferrer">Écrire sur WhatsApp</a>
      </section>
    `,
  });
}

function renderMaterials() {
  return layout({
    active: "materials",
    title: "Matériaux",
    description:
      "Matériaux pour architecture tropicale: béton, BTC, bois, bambou, enduits en pisé et toitures végétalisées.",
    body: `
      <section class="page-hero compact" style="--hero-image: url('${imageUrl("materialsHeroNatural")}')">
        <div>
          <p class="kicker">Matériaux de construction</p>
          <h1>Béton, BTC, bois, bambou, enduits en pisé et toitures végétalisées.</h1>
        </div>
      </section>

      <section class="content-band">
        ${sectionIntro("Performance et confort", "Des choix constructifs adaptés au climat tropical", "L'objectif est de réduire la surchauffe, favoriser la ventilation naturelle et créer un confort quotidien sans dépendance excessive à la climatisation.")}
        <div class="materials-grid">${materialCards()}</div>
      </section>

      <section class="comfort-panel">
        <img src="${imageUrl("interiorWood")}" alt="Intérieur en bois avec baies vitrées et ventilation naturelle">
        <div>
          <p class="kicker">Confort intérieur</p>
          <h2>Ventilation croisée, ombrage et fluidité des pièces.</h2>
          <p>ARASAKA travaille les volumes, les ouvertures, les baies vitrées protégées, les patios et les vérandas pour organiser la circulation de l'air. Le résultat attendu: une maison plus fraîche, agréable en journée et confortable le soir.</p>
          <ul class="check-list">
            <li>Pièces orientées pour capter les vents dominants</li>
            <li>Protections solaires: pergolas, débords, végétation</li>
            <li>Matériaux à inertie thermique pour stabiliser la température</li>
            <li>Liens directs entre intérieur, véranda, jardin et piscine</li>
          </ul>
        </div>
      </section>
    `,
  });
}

function renderPlans() {
  return layout({
    active: "plans",
    title: "Inspirations",
    description:
      "Inspirations, plans et galerie ARASAKA: circulation fluide, ventilation croisée, matériaux naturels, jardins et piscines.",
    body: `
      <section class="page-hero compact" style="--hero-image: url('${imageUrl("premiumVillaConcept")}')">
        <div>
          <p class="kicker">Architecture tropicale</p>
          <h1>Inspirations</h1>
          <p class="page-hero-copy">Des concepts de villas premium adaptés au terrain, au climat tropical et au niveau de finition attendu.</p>
        </div>
      </section>

      <section class="content-band">
        ${sectionIntro("Concepts", "Choisir une base, puis l'adapter précisément", "Ces plans servent de point de départ pour discuter surfaces, circulation, ventilation, jardin, véranda, piscine, budget et finitions premium.")}
        <div class="plans-grid">${planCards()}</div>
      </section>

      <section class="content-band muted-band" id="galerie">
        ${sectionIntro("Galerie", "Réalisations et inspirations pour votre villa", "Explorez les ambiances, matériaux et espaces extérieurs réunis avec les concepts de villas.")}
        <div class="filter-tabs" role="tablist" aria-label="Filtres galerie">
          <button class="active" type="button" data-filter="all">Tout</button>
          <button type="button" data-filter="villas-blanches">Villas blanches</button>
          <button type="button" data-filter="materiaux-naturels">Matériaux naturels</button>
          <button type="button" data-filter="jardins">Jardins</button>
          <button type="button" data-filter="interieurs">Intérieurs</button>
          <button type="button" data-filter="terrasses">Terrasses</button>
          <button type="button" data-filter="piscines">Piscines lagon</button>
        </div>
        <div class="gallery-grid" data-gallery-grid>${galleryCards()}</div>
      </section>

      <section class="dark-cta">
        <div>
          <p class="kicker">Du concept au projet</p>
          <h2>Chaque villa est étudiée selon le terrain, le climat et les habitudes de vie.</h2>
          <p>Choisissez une inspiration pour engager la discussion sur les surfaces, la circulation, les matériaux, les espaces extérieurs et le niveau de finition.</p>
        </div>
        <a class="button light" href="/contact">Demander un rendez-vous</a>
      </section>
    `,
  });
}

function renderPortfolio() {
  return layout({
    active: "portfolio",
    title: "Nos réalisations",
    description:
      "Portfolio ARASAKA: conception, visualisation, cuisines, décoration, appartements prêts pour Airbnb, valorisation immobilière et références partenaires internationales.",
    bodyClass: "page-portfolio",
    body: `
      <section class="page-hero portfolio-hero" style="--hero-image: url('${site.images.portfolioHero}')">
        <div>
          <p class="kicker">Nos réalisations</p>
          <h1>Des espaces conçus, décorés et prêts à vivre.</h1>
          <p class="page-hero-copy">Une sélection resserrée autour des études, cuisines, ambiances décoratives, logements prêts à exploiter et références partenaires internationales.</p>
          <div class="hero-actions">
            <a class="button primary" href="#portfolio">Explorer les réalisations</a>
            <a class="button ghost" href="/contact">Parler d'un projet</a>
          </div>
        </div>
      </section>

      <section class="turnkey-panel">
        <div>
          <p class="kicker">Livraison clé en main</p>
          <h2>Un logement immédiatement habitable ou prêt à exploiter.</h2>
          <p>Après les travaux, nous pouvons accompagner l'aménagement, la décoration et la mise en valeur du logement afin qu'il soit immédiatement habitable ou prêt à exploiter en location courte durée.</p>
        </div>
        <div class="turnkey-steps">
          <span>Travaux</span>
          <span>Finitions</span>
          <span>Ameublement</span>
          <span>Décoration</span>
          <span>Photos</span>
          <span>Exploitation</span>
        </div>
      </section>

      <section class="content-band xgone-reference-section" id="references-xgone">
        ${sectionIntro(
          "Références partenaires",
          "X-GONE BTP, force d'exécution internationale",
          "Partenaire international d'ARASAKA basé à Lomé, X-GONE BTP intervient sur des opérations publiques, privées, tertiaires, industrielles et résidentielles de haut niveau.",
        )}
        <div class="xgone-reference-lead">
          <div>
            <p class="kicker">Partenaire international</p>
            <h2>Des références solides pour renforcer la capacité d'exécution du groupe.</h2>
            <p>Ces réalisations partenaires illustrent une expérience de chantier confirmée : rénovation institutionnelle, bâtiments commerciaux, showrooms, entrepôts, sites industriels et résidences privées de standing.</p>
          </div>
          <div class="xgone-reference-stats" aria-label="Repères X-GONE BTP">
            <span><strong>10 ans</strong> d'expérience environ</span>
            <span><strong>Public & privé</strong> projets institutionnels, tertiaires et résidentiels</span>
            <span><strong>Lomé</strong> base opérationnelle au Togo</span>
          </div>
        </div>
        <div class="xgone-reference-grid">
          ${xgoneReferenceCards()}
        </div>
        <div class="xgone-reference-list">
          <h3>Autres références citées dans la plaquette</h3>
          <ul>
            ${xgoneAdditionalReferenceList()}
          </ul>
        </div>
      </section>

      <section class="content-band muted-band" id="portfolio">
        ${sectionIntro("Galerie", "Exemples d'appartements réalisés pour Airbnb", "Ces réalisations sélectionnées présentent des appartements aménagés, décorés et mis en valeur pour la location courte durée, notamment Airbnb.")}
        <div class="portfolio-grid" data-gallery-grid>${portfolioCards()}</div>
      </section>

      <section class="content-band partner-photo-section" id="realisations-partenaires">
        ${partnerRealisationPhotoSections()}
      </section>
    `,
  });
}

function renderGallery() {
  return layout({
    active: "gallery",
    title: "Galerie",
    description:
      "Galerie d'inspiration ARASAKA: villas blanches, matériaux naturels, jardins, piscines lagon et intérieurs ventilés.",
    body: `
      <section class="page-hero compact" style="--hero-image: url('${imageUrl("whiteVilla")}')">
        <div>
          <p class="kicker">Galerie</p>
          <h1>Villas blanches, matériaux naturels, jardins, intérieurs et piscines lagon.</h1>
        </div>
      </section>

      <section class="content-band">
        ${sectionIntro("Réalisations et inspirations", "Filtrer la galerie par ambiance", "Les images servent d'illustrations pour cadrer le style, les matériaux et les espaces a developper avec ARASAKA.")}
        <div class="filter-tabs" role="tablist" aria-label="Filtres galerie">
          <button class="active" type="button" data-filter="all">Tout</button>
          <button type="button" data-filter="villas-blanches">Villas blanches</button>
          <button type="button" data-filter="materiaux-naturels">Matériaux naturels</button>
          <button type="button" data-filter="jardins">Jardins</button>
          <button type="button" data-filter="interieurs">Intérieurs</button>
          <button type="button" data-filter="terrasses">Terrasses</button>
          <button type="button" data-filter="piscines">Piscines lagon</button>
        </div>
        <div class="gallery-grid" data-gallery-grid>${galleryCards()}</div>
      </section>
    `,
  });
}

function renderContact() {
  return layout({
    active: "contact",
    title: "Contact",
    description:
      "Contact ARASAKA pour une étude de projet de construction, rénovation ou amenagement extérieur en Côte d'Ivoire.",
    body: `
      <section class="page-hero compact contact-hero" style="--hero-image: url('${imageUrl("contactParcel")}')">
        <div>
          <p class="kicker">Contact</p>
          <h1>Parlez-nous de votre terrain, de votre villa ou de votre rénovation.</h1>
        </div>
      </section>

      <section class="contact-layout">
        <div class="contact-panel">
          <div class="contact-tabs" role="tablist" aria-label="Types de demande">
            <button class="active" type="button" data-contact-tab="etude">Demande d'étude</button>
            <button type="button" data-contact-tab="rdv">Rendez-vous</button>
          </div>
          <div class="tab-copy active" data-tab-copy="etude">
            <h2>Étude personnalisée</h2>
            <p>Envoyez les informations principales. Si le serveur Gmail est connecté, la demande part par email; sinon elle est enregistrée et un message Gmail prêt à envoyer s'affiche.</p>
          </div>
          <div class="tab-copy" data-tab-copy="rdv">
            <h2>Rendez-vous à Abidjan</h2>
            <p>Indiquez vos disponibilités et le type de visite souhaitée: terrain, rénovation, villa existante ou première discussion.</p>
          </div>

          <form class="contact-form" data-contact-form data-contact-email="${escapeHtml(site.company.email)}" method="post" action="/api/contact">
            <input type="hidden" name="requestType" value="Demande d'étude" data-request-type>
            <label>
              Nom complet
              <input name="name" type="text" autocomplete="name" required placeholder="Votre nom">
            </label>
            <label>
              Téléphone
              <input name="phone" type="tel" autocomplete="tel" required placeholder="+225 ou +33">
            </label>
            <label>
              Email
              <input name="email" type="email" autocomplete="email" placeholder="votre@email.com">
            </label>
            <label>
              Adresse du projet
              <input name="projectAddress" type="text" autocomplete="street-address" placeholder="Ville, quartier, pays">
            </label>
            <label>
              Messagerie
              <input name="messaging" type="text" placeholder="WhatsApp, email, lien ou préférence">
            </label>
            <label>
              Type de projet
              <select name="projectType">
                <option>Construction de villa</option>
                <option>Rénovation haut de gamme</option>
                <option>Finalisation d'appartement en promotion immobilière</option>
                <option>Villa clé en main</option>
                <option>Projet diaspora</option>
                <option>Aménagement extérieur</option>
                <option>Piscine lagon</option>
                <option>Petit immeuble locatif clé en main</option>
              </select>
            </label>
            <label>
              Budget indicatif
              <select name="budget">
                <option>À définir</option>
                <option>Moins de 50 M FCFA</option>
                <option>50 - 100 M FCFA</option>
                <option>100 - 200 M FCFA</option>
                <option>Plus de 200 M FCFA</option>
              </select>
            </label>
            <label class="wide">
              Message
              <textarea name="message" rows="5" placeholder="Terrain, localisation, délai souhaité, inspirations, matériaux..."></textarea>
            </label>
            <button class="button primary wide" type="submit">Envoyer la demande</button>
            <p class="form-status" data-form-status aria-live="polite"></p>
          </form>
        </div>

        <aside class="contact-aside">
          <h2>Contact direct</h2>
          <p>Pour un premier échange rapide, appelez ou écrivez-nous par Gmail ou WhatsApp.</p>
          <a class="button secondary full" href="${site.company.telHref}">Appeler ${escapeHtml(site.company.phone)}</a>
          <a class="button ghost-dark full" href="${site.company.whatsappHref}" target="_blank" rel="noreferrer">Écrire sur WhatsApp</a>
          <a class="button ghost-dark full" href="${site.company.gmailHref}" target="_blank" rel="noreferrer">Écrire par Gmail</a>
          <div class="contact-details">
            <span>Adresse</span>
            <strong>${escapeHtml(site.company.location)}</strong>
            <span>France</span>
            <strong>${escapeHtml(site.company.franceLocation)}</strong>
            <span>Direction</span>
            <strong>${escapeHtml(site.company.director)}</strong>
            <span>Ermancia</span>
            <strong>${escapeHtml(site.company.ermanciaLocation)}</strong>
            <span>Email</span>
            <strong><a href="${site.company.gmailHref}" target="_blank" rel="noreferrer">${escapeHtml(site.company.email)}</a></strong>
          </div>
        </aside>
      </section>
    `,
  });
}

const routes = new Map([
  ["/", renderHome],
  ["/diaspora", renderDiaspora],
  ["/qui-sommes-nous", renderAbout],
  ["/a-propos", renderAbout],
  ["/services", renderServices],
  ["/materiaux", renderMaterials],
  ["/realisations", renderPortfolio],
  ["/plans", renderPlans],
  ["/galerie", renderPortfolio],
  ["/contact", renderContact],
]);

function send(res, status, body, type = "text/html; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type });
  res.end(res.omitBody ? undefined : body);
}

function sendJson(res, status, payload) {
  send(res, status, JSON.stringify(payload), "application/json; charset=utf-8");
}

async function serveStatic(req, res, pathname) {
  const requested = path.normalize(path.join(PUBLIC_DIR, pathname.replace(/^\/+/, "")));
  if (!requested.startsWith(PUBLIC_DIR)) {
    send(res, 403, "Forbidden", "text/plain; charset=utf-8");
    return true;
  }

  try {
    const stats = await fs.promises.stat(requested);
    if (!stats.isFile()) return false;
    const ext = path.extname(requested).toLowerCase();
    const body = await fs.promises.readFile(requested);
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(res.omitBody ? undefined : body);
    return true;
  } catch {
    return false;
  }
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(raw));
    req.on("error", reject);
  });
}

async function handleContact(req, res) {
  try {
    const raw = await readRequestBody(req);
    const contentType = req.headers["content-type"] || "";
    const fields = contentType.includes("application/json")
      ? JSON.parse(raw || "{}")
      : Object.fromEntries(new URLSearchParams(raw));

    const lead = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      requestType: String(fields.requestType || "Demande d'étude").slice(0, 80),
      name: String(fields.name || "").trim().slice(0, 120),
      phone: String(fields.phone || "").trim().slice(0, 80),
      email: String(fields.email || "").trim().slice(0, 120),
      projectAddress: String(fields.projectAddress || "").trim().slice(0, 180),
      messaging: String(fields.messaging || "").trim().slice(0, 180),
      projectType: String(fields.projectType || "").trim().slice(0, 120),
      budget: String(fields.budget || "").trim().slice(0, 80),
      message: String(fields.message || "").trim().slice(0, 1500),
    };

    if (!lead.name || !lead.phone) {
      sendJson(res, 400, { ok: false, message: "Le nom et le telephone sont obligatoires." });
      return;
    }

    await fs.promises.mkdir(path.dirname(LEADS_FILE), { recursive: true });
    await fs.promises.appendFile(LEADS_FILE, `${JSON.stringify(lead)}\n`, "utf8");

    const waText = [
      "Bonjour ARASAKA, je souhaite être contacté pour un projet.",
      `Nom: ${lead.name}`,
      `Téléphone: ${lead.phone}`,
      lead.email ? `Email: ${lead.email}` : "",
      lead.projectAddress ? `Adresse du projet: ${lead.projectAddress}` : "",
      lead.messaging ? `Messagerie: ${lead.messaging}` : "",
      lead.projectType ? `Projet: ${lead.projectType}` : "",
      lead.budget ? `Budget: ${lead.budget}` : "",
      lead.message ? `Message: ${lead.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const subject = `Nouvelle demande ARASAKA - ${lead.name}`;
    const emailResult = await sendContactEmail(lead, waText);

    sendJson(res, 200, {
      ok: true,
      message: emailResult.sent
        ? "Demande enregistrée et transmise par email. Les messages Gmail et WhatsApp restent prêts à envoyer."
        : "Email automatique non configuré sur ce serveur. La demande est enregistrée localement; ouvrez Gmail puis cliquez sur Envoyer pour la transmettre à ARASAKA CI.",
      emailSent: emailResult.sent,
      emailStatus: emailResult.reason || "SENT",
      gmailUrl: gmailLink(subject, waText),
      whatsappUrl: whatsappLink(waText),
    });
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      message: "Impossible d'enregistrer la demande pour le moment.",
    });
  }
}

const server = http.createServer(async (req, res) => {
  res.omitBody = req.method === "HEAD";

  if (!isAuthorized(req)) {
    requestAuthentication(res);
    return;
  }

  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname.endsWith("/") && url.pathname !== "/" ? url.pathname.slice(0, -1) : url.pathname;

  if (req.method === "POST" && pathname === "/api/contact") {
    await handleContact(req, res);
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, "Method not allowed", "text/plain; charset=utf-8");
    return;
  }

  if (pathname !== "/" && (await serveStatic(req, res, pathname))) {
    return;
  }

  const render = routes.get(pathname);
  if (render) {
    send(res, 200, render());
    return;
  }

  send(
    res,
    404,
    layout({
      active: "",
      title: "Page introuvable",
      description: "Page introuvable sur le site ARASAKA.",
      body: `
        <section class="not-found">
          <p class="kicker">404</p>
          <h1>Cette page n'existe pas encore.</h1>
          <p>Retournez à l'accueil ou contactez ARASAKA pour votre projet.</p>
          <a class="button primary" href="/">Retour accueil</a>
        </section>
      `,
    }),
  );
});

server.listen(PORT, () => {
  console.log(`ARASAKA site dynamique: http://localhost:${PORT}`);
});

module.exports = server;
