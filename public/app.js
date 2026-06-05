const body = document.body;
const menuToggle = document.querySelector("[data-menu-toggle]");
const mainNav = document.querySelector("[data-main-nav]");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const open = body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-label", "Ouvrir le menu");
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

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.hidden = true;
  body.classList.remove("lightbox-open");
  lightboxImage.removeAttribute("src");
  lightboxImage.alt = "";
  if (lightboxTitle) lightboxTitle.textContent = "";
}

document.querySelectorAll("[data-lightbox-src]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;
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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox && !lightbox.hidden) {
    closeLightbox();
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

function formToObject(formElement) {
  return Object.fromEntries(new FormData(formElement).entries());
}

function buildWhatsappUrl(fields) {
  const parts = [
    "Bonjour ARASAKA, je souhaite être contacté pour un projet.",
    fields.name ? `Nom: ${fields.name}` : "",
    fields.phone ? `Téléphone: ${fields.phone}` : "",
    fields.email ? `Email: ${fields.email}` : "",
    fields.projectAddress ? `Adresse du projet: ${fields.projectAddress}` : "",
    fields.messaging ? `Messagerie: ${fields.messaging}` : "",
    fields.projectType ? `Projet: ${fields.projectType}` : "",
    fields.budget ? `Budget: ${fields.budget}` : "",
    fields.message ? `Message: ${fields.message}` : "",
  ].filter(Boolean);

  return `https://wa.me/33652831160?text=${encodeURIComponent(parts.join("\n"))}`;
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

      statusBox.innerHTML = `Demande enregistrée. <a href="${result.whatsappUrl}" target="_blank" rel="noreferrer">Envoyer aussi sur WhatsApp</a>.`;
      form.reset();
      if (requestTypeInput) requestTypeInput.value = "Demande d'étude";
    } catch (error) {
      const fallback = buildWhatsappUrl(fields);
      statusBox.innerHTML = `Le serveur n'a pas pu confirmer l'envoi. <a href="${fallback}" target="_blank" rel="noreferrer">Envoyer par WhatsApp</a>.`;
    }
  });
}

