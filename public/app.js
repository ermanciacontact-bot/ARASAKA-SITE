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

function setTourControlsVisible(visible) {
  if (!tourControls) return;
  tourControls.hidden = !visible;
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.hidden = true;
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
  const slide = activeTour.slides[activeTourIndex];
  if (!slide) return;
  lightboxImage.src = slide.src;
  lightboxImage.alt = slide.title || activeTour.title;
  if (lightboxTitle) lightboxTitle.textContent = slide.title || activeTour.title;
  if (tourCount) tourCount.textContent = `${activeTourIndex + 1} / ${activeTour.slides.length}`;
  lightbox.hidden = false;
  body.classList.add("lightbox-open");
  setTourControlsVisible(activeTour.slides.length > 1);
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

const villaTour = document.querySelector("[data-villa-tour]");

if (villaTour) {
  initVillaTour(villaTour).catch(() => {
    const canvas = villaTour.querySelector("[data-villa-canvas]");
    if (!canvas) return;
    const fallback = document.createElement("div");
    fallback.className = "villa-3d-fallback";
    fallback.textContent = "La visite 3D est indisponible sur ce navigateur.";
    canvas.replaceWith(fallback);
  });
}

async function initVillaTour(root) {
  const THREE = await import("/vendor/three.module.min.js");
  const canvas = root.querySelector("[data-villa-canvas]");
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf3efe6);
  scene.fog = new THREE.Fog(0xf3efe6, 22, 44);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;

  const villa = new THREE.Group();
  scene.add(villa);

  const mats = {
    wall: new THREE.MeshStandardMaterial({ color: 0xf4ead9, roughness: 0.74 }),
    floor: new THREE.MeshStandardMaterial({ color: 0xb68a5b, roughness: 0.7 }),
    roof: new THREE.MeshStandardMaterial({ color: 0x5b4634, roughness: 0.72 }),
    wood: new THREE.MeshStandardMaterial({ color: 0x7a5234, roughness: 0.68 }),
    stone: new THREE.MeshStandardMaterial({ color: 0xd8c6a9, roughness: 0.78 }),
    textile: new THREE.MeshStandardMaterial({ color: 0x315047, roughness: 0.85 }),
    linen: new THREE.MeshStandardMaterial({ color: 0xf8f2e6, roughness: 0.82 }),
    brass: new THREE.MeshStandardMaterial({ color: 0xcaa16a, metalness: 0.28, roughness: 0.38 }),
    black: new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.44 }),
    appliance: new THREE.MeshStandardMaterial({ color: 0xcfd3d1, metalness: 0.38, roughness: 0.28 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x8dd6df, transparent: true, opacity: 0.42, roughness: 0.18 }),
    pool: new THREE.MeshStandardMaterial({ color: 0x2c9caf, transparent: true, opacity: 0.72, roughness: 0.18 }),
    garden: new THREE.MeshStandardMaterial({ color: 0x516d3d, roughness: 0.86 }),
    earth: new THREE.MeshStandardMaterial({ color: 0xb48b5c, roughness: 0.88 }),
  };

  function box(size, position, material, parent = villa) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material);
    mesh.position.set(position[0], position[1], position[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function cylinder(radius, height, position, material, parent = villa) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 20), material);
    mesh.position.set(position[0], position[1], position[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  box([24, 0.12, 22], [0, -0.08, 0], mats.earth);
  box([14, 0.18, 8.8], [0, 0, -1.2], mats.floor);
  box([14, 0.16, 4.2], [0, 0.03, 5.5], mats.wood);
  box([5.6, 0.08, 3], [-5.1, 0.05, 8.2], mats.pool);
  box([5.2, 0.04, 2.6], [-5.1, 0.12, 8.2], mats.pool);

  box([14.2, 2.4, 0.18], [0, 1.2, -5.7], mats.wall);
  box([0.18, 2.4, 8.8], [-7.1, 1.2, -1.2], mats.wall);
  box([0.18, 2.4, 8.8], [7.1, 1.2, -1.2], mats.wall);
  box([14.2, 2.4, 0.14], [0, 1.2, 3.2], mats.glass);
  box([0.14, 2.2, 4.1], [-2.6, 1.1, -3.6], mats.wall);
  box([0.14, 2.2, 4.1], [2.4, 1.1, -3.6], mats.wall);
  box([4.8, 2.2, 0.12], [4.8, 1.1, -1.5], mats.wall);
  box([3.4, 0.2, 10.2], [-3.4, 2.65, -1], mats.roof).rotation.z = -0.12;
  box([3.4, 0.2, 10.2], [3.4, 2.65, -1], mats.roof).rotation.z = 0.12;

  for (const x of [-6.3, -2.1, 2.1, 6.3]) {
    cylinder(0.09, 2.6, [x, 1.25, 4.05], mats.wood);
  }
  box([14.5, 0.16, 3.8], [0, 2.6, 5.4], mats.wood);

  box([2.5, 0.55, 0.85], [-2.1, 0.45, 0.8], mats.textile);
  box([0.85, 0.52, 1.6], [-3.6, 0.45, 0.05], mats.textile);
  box([1.45, 0.22, 0.9], [-1.2, 0.28, -0.45], mats.wood);
  box([2.1, 0.08, 1.5], [-1.6, 0.1, -0.65], mats.linen);
  box([1.7, 0.95, 0.14], [1.3, 0.9, -0.75], mats.black);
  box([2, 0.18, 0.5], [1.3, 0.25, -0.72], mats.wood);

  box([3.2, 0.9, 0.65], [-5.2, 0.55, -2.4], mats.stone);
  box([2.3, 0.9, 0.85], [-4.25, 0.55, -0.75], mats.stone);
  box([2.3, 0.84, 0.9], [-4.4, 0.52, 1.2], mats.wood);
  box([0.85, 1.8, 0.72], [-6.25, 1.0, -3.85], mats.appliance);
  box([0.7, 0.65, 0.62], [-5.35, 0.52, -3.85], mats.appliance);
  box([0.75, 0.22, 0.68], [-4.45, 1.24, -3.85], mats.black);
  box([0.8, 0.7, 0.66], [-3.55, 0.5, -3.85], mats.appliance);
  box([0.36, 0.5, 0.36], [-4.4, 1.05, 1.2], mats.brass);

  box([2.05, 0.5, 2.25], [4.8, 0.35, -4.0], mats.linen);
  box([2.2, 0.75, 0.24], [4.8, 0.72, -5.15], mats.textile);
  box([0.45, 0.45, 0.45], [3.35, 0.35, -4.4], mats.wood);
  box([0.45, 0.45, 0.45], [6.25, 0.35, -4.4], mats.wood);
  box([1.55, 1.85, 0.42], [6.25, 1.0, -2.45], mats.wood);

  box([1.5, 0.45, 1.9], [-0.45, 0.34, -4.15], mats.linen);
  box([1.6, 0.6, 0.22], [-0.45, 0.66, -5.1], mats.textile);
  box([1.45, 0.45, 1.75], [2.9, 0.34, -2.95], mats.linen);
  box([1.55, 0.6, 0.22], [2.9, 0.66, -3.85], mats.textile);
  box([0.65, 1.45, 0.5], [1.65, 0.82, -1.15], mats.appliance);

  box([2.15, 0.48, 0.85], [-0.6, 0.37, 5.3], mats.linen);
  box([0.85, 0.45, 0.85], [1.0, 0.36, 5.3], mats.linen);
  box([1.4, 0.28, 0.86], [0.1, 0.32, 6.45], mats.wood);
  box([2.6, 0.08, 1.6], [0.1, 0.12, 6.45], mats.linen);
  box([1.2, 0.9, 0.16], [2.65, 0.76, 5.4], mats.black);
  box([1.55, 0.8, 1.55], [4.9, 0.45, 5.35], mats.wood);
  box([1.55, 0.12, 1.55], [4.9, 0.9, 5.35], mats.stone);

  for (const x of [-9.2, 8.9, -8.1, 7.8]) {
    const trunk = cylinder(0.08, 1.1, [x, 0.55, x > 0 ? 7.9 : -7.9], mats.wood);
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.72, 16, 12), mats.garden);
    crown.position.set(trunk.position.x, 1.35, trunk.position.z);
    crown.castShadow = true;
    villa.add(crown);
  }

  const ambient = new THREE.HemisphereLight(0xffffff, 0x6f5138, 2.3);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xfff2d0, 3.1);
  sun.position.set(-8, 12, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 1024;
  sun.shadow.mapSize.height = 1024;
  scene.add(sun);

  const views = {
    exterieur: { position: [12, 7.4, 12], target: [0, 0.7, 0.2] },
    salon: { position: [2.4, 3.2, 5.8], target: [-1.1, 0.75, 0.15] },
    cuisine: { position: [-2.1, 3.2, 4.0], target: [-4.8, 0.8, -1.8] },
    suite: { position: [7.7, 3.2, -1.2], target: [4.8, 0.75, -4.3] },
    terrasse: { position: [-2.4, 3.6, 10.5], target: [0.4, 0.7, 5.6] },
  };

  const cameraTarget = new THREE.Vector3();
  let targetPosition = new THREE.Vector3(...views.exterieur.position);
  let targetLookAt = new THREE.Vector3(...views.exterieur.target);
  camera.position.copy(targetPosition);
  cameraTarget.copy(targetLookAt);
  camera.lookAt(cameraTarget);

  root.querySelectorAll("[data-villa-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const view = views[button.dataset.villaView] || views.exterieur;
      targetPosition = new THREE.Vector3(...view.position);
      targetLookAt = new THREE.Vector3(...view.target);
      root.querySelectorAll("[data-villa-view]").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
    });
  });

  let dragging = false;
  let previousX = 0;
  canvas.addEventListener("pointerdown", (event) => {
    dragging = true;
    previousX = event.clientX;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const delta = event.clientX - previousX;
    previousX = event.clientX;
    villa.rotation.y += delta * 0.006;
  });
  canvas.addEventListener("pointerup", () => {
    dragging = false;
  });
  canvas.addEventListener("pointercancel", () => {
    dragging = false;
  });

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect.width));
    const height = Math.max(320, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  new ResizeObserver(resize).observe(root);
  resize();

  let diagnosticFrames = 0;
  function updateRenderDiagnostics() {
    const gl = renderer.getContext();
    const width = renderer.domElement.width;
    const height = renderer.domElement.height;
    if (!width || !height) return;
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    const step = Math.max(4, Math.floor(Math.sqrt(width * height) / 42));
    let samples = 0;
    let varied = 0;
    let dark = 0;
    let bright = 0;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const i = (y * width + x) * 4;
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        samples += 1;
        if (Math.abs(r - 243) > 10 || Math.abs(g - 239) > 10 || Math.abs(b - 230) > 10) varied += 1;
        if (r + g + b < 240) dark += 1;
        if (r + g + b > 680) bright += 1;
      }
    }
    root.dataset.renderPixels = JSON.stringify({ width, height, samples, varied, dark, bright });
  }

  function animate() {
    camera.position.lerp(targetPosition, 0.055);
    cameraTarget.lerp(targetLookAt, 0.07);
    if (!dragging) villa.rotation.y += 0.0018;
    camera.lookAt(cameraTarget);
    renderer.render(scene, camera);
    if (diagnosticFrames < 18) {
      diagnosticFrames += 1;
      if (diagnosticFrames === 6 || diagnosticFrames === 18) updateRenderDiagnostics();
    }
    requestAnimationFrame(animate);
  }

  animate();
  setTimeout(() => {
    camera.lookAt(cameraTarget);
    renderer.render(scene, camera);
    updateRenderDiagnostics();
    root.dataset.villaReady = "true";
  }, 900);
}

