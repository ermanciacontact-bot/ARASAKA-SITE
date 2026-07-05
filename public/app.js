const body = document.body;
const menuToggle = document.querySelector("[data-menu-toggle]");
const mainNav = document.querySelector("[data-main-nav]");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const open = body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-label", "Ouvrir le menu");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", () => {
    img.classList.add("image-failed");
    img.removeAttribute("src");
  });
});

const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const tourControls = document.querySelector("[data-tour-controls]");
const tourPrev = document.querySelector("[data-tour-prev]");
const tourNext = document.querySelector("[data-tour-next]");
const tourCount = document.querySelector("[data-tour-count]");
const toursData = document.querySelector("#portfolio-tours-data");
const lightboxPlaceholder =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
let activeTour = null;
let activeTourIndex = 0;
let activeTourTimer = null;

function clearTourTimer() {
  if (!activeTourTimer) return;
  window.clearTimeout(activeTourTimer);
  activeTourTimer = null;
}

function setTourControlsVisible(visible) {
  if (!tourControls) return;
  tourControls.hidden = !visible;
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  clearTourTimer();
  lightbox.hidden = true;
  delete lightbox.dataset.tourMode;
  body.classList.remove("lightbox-open");
  lightboxImage.src = lightboxPlaceholder;
  lightboxImage.alt = "Photo agrandie";
  if (lightboxTitle) lightboxTitle.textContent = "";
  activeTour = null;
  activeTourIndex = 0;
  setTourControlsVisible(false);
}

function renderTourSlide() {
  if (!activeTour || !lightbox || !lightboxImage) return;
  clearTourTimer();
  const slide = activeTour.slides[activeTourIndex];
  if (!slide) return;
  lightboxImage.src = slide.src;
  lightboxImage.alt = slide.title || activeTour.title;
  if (lightboxTitle) {
    lightboxTitle.textContent = slide.caption
      ? `${slide.title || activeTour.title} — ${slide.caption}`
      : slide.title || activeTour.title;
  }
  if (tourCount) tourCount.textContent = `${activeTourIndex + 1} / ${activeTour.slides.length}`;
  lightbox.dataset.tourMode = activeTour.mode || "photo";
  if (activeTour.mode === "video") {
    lightboxImage.style.animation = "none";
    lightboxImage.offsetWidth;
    lightboxImage.style.animation = "";
  } else {
    lightboxImage.style.animation = "";
  }
  lightbox.hidden = false;
  body.classList.add("lightbox-open");
  setTourControlsVisible(activeTour.slides.length > 1);

  if (activeTour.autoplayMs && activeTour.slides.length > 1) {
    activeTourTimer = window.setTimeout(() => {
      activeTourIndex = (activeTourIndex + 1) % activeTour.slides.length;
      renderTourSlide();
    }, activeTour.autoplayMs);
  }
}

document.querySelectorAll("[data-lightbox-src]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;
    activeTour = null;
    activeTourIndex = 0;
    setTourControlsVisible(false);
    const title = button.dataset.lightboxTitle || "";
    lightboxImage.src = button.dataset.lightboxSrc;
    lightboxImage.alt = title;
    if (lightboxTitle) lightboxTitle.textContent = title;
    lightbox.hidden = false;
    body.classList.add("lightbox-open");
    if (lightboxClose) lightboxClose.focus();
  });
});

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (tourPrev) {
  tourPrev.addEventListener("click", () => {
    if (!activeTour) return;
    activeTourIndex = (activeTourIndex - 1 + activeTour.slides.length) % activeTour.slides.length;
    renderTourSlide();
  });
}

if (tourNext) {
  tourNext.addEventListener("click", () => {
    if (!activeTour) return;
    activeTourIndex = (activeTourIndex + 1) % activeTour.slides.length;
    renderTourSlide();
  });
}

if (toursData) {
  try {
    const virtualTours = JSON.parse(toursData.textContent || "[]");
    document.querySelectorAll("[data-tour-index]").forEach((button) => {
      button.addEventListener("click", () => {
        activeTour = virtualTours[Number(button.dataset.tourIndex)];
        if (!activeTour) return;
        activeTourIndex = 0;
        renderTourSlide();
        if (lightboxClose) lightboxClose.focus();
      });
    });
  } catch {
    document.querySelectorAll("[data-tour-index]").forEach((button) => {
      button.hidden = true;
    });
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox && !lightbox.hidden) {
    closeLightbox();
  }
  if (event.key === "ArrowLeft" && activeTour) {
    activeTourIndex = (activeTourIndex - 1 + activeTour.slides.length) % activeTour.slides.length;
    renderTourSlide();
  }
  if (event.key === "ArrowRight" && activeTour) {
    activeTourIndex = (activeTourIndex + 1) % activeTour.slides.length;
    renderTourSlide();
  }
});

const filterButtons = document.querySelectorAll("[data-filter]");
const galleryCards = document.querySelectorAll("[data-gallery-grid] [data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    galleryCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

const contactTabs = document.querySelectorAll("[data-contact-tab]");
const contactCopies = document.querySelectorAll("[data-tab-copy]");
const requestTypeInput = document.querySelector("[data-request-type]");

const labelsByTab = {
  etude: "Demande d'étude",
  diaspora: "Projet diaspora",
  rdv: "Rendez-vous",
};

contactTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const key = tab.dataset.contactTab;
    contactTabs.forEach((item) => item.classList.toggle("active", item === tab));
    contactCopies.forEach((copy) => copy.classList.toggle("active", copy.dataset.tabCopy === key));
    if (requestTypeInput) requestTypeInput.value = labelsByTab[key] || "Demande d'étude";
  });
});

const searchParams = new URLSearchParams(window.location.search);
const selectedPlan = searchParams.get("plan");
const selectedOffer = searchParams.get("offre");
const messageField = document.querySelector('textarea[name="message"]');
const projectTypeField = document.querySelector('select[name="projectType"]');

if (selectedPlan && messageField && !messageField.value) {
  messageField.value = `Bonjour ARASAKA, je souhaite recevoir une étude pour le plan: ${selectedPlan}.`;
}

if (selectedOffer && messageField && !messageField.value) {
  messageField.value = `Bonjour ARASAKA, je souhaite recevoir une étude pour l'offre: ${selectedOffer}.`;
}

if (selectedOffer && projectTypeField) {
  const matchingOption = Array.from(projectTypeField.options).find((option) =>
    selectedOffer.toLowerCase().includes(option.textContent.toLowerCase()) ||
    option.textContent.toLowerCase().includes(selectedOffer.toLowerCase()),
  );
  if (matchingOption) projectTypeField.value = matchingOption.value;
}

const form = document.querySelector("[data-contact-form]");
const statusBox = document.querySelector("[data-form-status]");
const contactEmail = form?.dataset.contactEmail || "arasakaci.contact@gmail.com";

function formToObject(formElement) {
  return Object.fromEntries(new FormData(formElement).entries());
}

function buildContactText(fields) {
  return [
    "Bonjour ARASAKA, je souhaite être contacté pour un projet.",
    fields.name ? `Nom: ${fields.name}` : "",
    fields.phone ? `Téléphone: ${fields.phone}` : "",
    fields.email ? `Email: ${fields.email}` : "",
    fields.projectAddress ? `Adresse du projet: ${fields.projectAddress}` : "",
    fields.messaging ? `Messagerie: ${fields.messaging}` : "",
    fields.projectType ? `Projet: ${fields.projectType}` : "",
    fields.budget ? `Budget: ${fields.budget}` : "",
    fields.message ? `Message: ${fields.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildWhatsappUrl(fields) {
  return `https://wa.me/33652831160?text=${encodeURIComponent(buildContactText(fields))}`;
}

function buildGmailUrl(fields) {
  const subject = fields.name ? `Demande ARASAKA - ${fields.name}` : "Demande ARASAKA";
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildContactText(fields))}`;
}

function renderStatus(message, links) {
  statusBox.textContent = message;
  links.forEach(({ href, label }) => {
    if (!href) return;
    statusBox.append(" ");
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = label;
    statusBox.append(link, ".");
  });
}

if (form && statusBox) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fields = formToObject(form);
    statusBox.textContent = "Envoi de la demande...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Erreur d'envoi");
      }

      if (result.emailSent) {
        renderStatus(result.message || "Demande transmise par email.", [
          { href: result.gmailUrl, label: "Ouvrir une copie Gmail" },
          { href: result.whatsappUrl, label: "Envoyer aussi sur WhatsApp" },
        ]);
      } else {
        renderStatus(result.message || "Email automatique non configuré sur ce serveur. La demande est enregistrée localement; ouvrez Gmail puis cliquez sur Envoyer pour la transmettre à ARASAKA CI.", [
          { href: result.gmailUrl, label: "Ouvrir Gmail" },
          { href: result.whatsappUrl, label: "Envoyer par WhatsApp" },
        ]);
      }
      form.reset();
      if (requestTypeInput) requestTypeInput.value = "Demande d'étude";
    } catch (error) {
      renderStatus("Le serveur n'a pas pu confirmer l'envoi.", [
        { href: buildGmailUrl(fields), label: "Ouvrir Gmail" },
        { href: buildWhatsappUrl(fields), label: "Envoyer par WhatsApp" },
      ]);
    }
  });
}
