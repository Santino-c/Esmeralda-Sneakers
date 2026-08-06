const WHATSAPP_NUMBER = "5492983660188";
// Reemplazá el número de arriba por el WhatsApp real, sin +, espacios ni guiones.

const models = [
  {
    id: "adidas-f50",
    brand: "ADIDAS",
    name: "Adidas F50",
    folder: "Adidas F50",
    filePrefix: "Adidas F50",
    maxPhotos: 30,
    heroPhotos: [1, 3, 6, 10],
    coverPhoto: 3,
    productPhoto: 6,
    badge: "NUEVO",
    description: "Ligereza, velocidad y una silueta pensada para atacar cada espacio."
  },
  {
    id: "adidas-predator",
    brand: "ADIDAS",
    name: "Adidas Predator",
    folder: "Adidas Predator",
    filePrefix: "Adidas Predator",
    maxPhotos: 100,
    heroPhotos: [4, 16, 25, 39],
    coverPhoto: 16,
    productPhoto: 25,
    badge: "TOP VENTAS",
    description: "Control, precisión y presencia para dominar cada pelota."
  },
  {
    id: "adidas-ultimo-tango",
    brand: "ADIDAS",
    name: "Adidas Último Tango",
    folder: "Adidas Último Tango",
    filePrefix: "Adidas Último Tango",
    maxPhotos: 30,
    heroPhotos: [1, 5, 8, 12],
    coverPhoto: 7,
    productPhoto: 8,
    badge: "EXCLUSIVO",
    description: "Un diseño clásico y diferente, ideal para quienes buscan destacar."
  },
  {
    id: "nike-air-zoom-mercurial",
    brand: "NIKE",
    name: "Nike Air Zoom Mercurial",
    folder: "Nike Air Zoom Mercurial",
    filePrefix: "mercurial-superfly",
    maxPhotos: 53,
    heroPhotos: [1,16,34,45],
    coverPhoto: 16,
    productPhoto: 34,
    badge: "MÁS ELEGIDO",
    description: "Velocidad explosiva, ajuste firme y respuesta en cada cambio de ritmo."
  },
  {
    id: "nike-phantom",
    brand: "NIKE",
    name: "Nike Phantom",
    folder: "Nike Phantom",
    filePrefix: "Nike Phantom",
    maxPhotos: 120,
    heroPhotos: [1, 18, 36, 45],
    coverPhoto: 18,
    productPhoto: 36,
    badge: "PREMIUM",
    description: "Toque preciso y estabilidad para jugadores que manejan el partido."
  },
  {
    id: "puma-future",
    brand: "PUMA",
    name: "Puma Future",
    folder: "Puma Future",
    filePrefix: "Puma Future",
    maxPhotos: 20,
    heroPhotos: [1, 2, 3, 5],
    coverPhoto: 3,
    productPhoto: 4,
    badge: "DESTACADO",
    description: "Comodidad dinámica y diseño moderno para jugar con libertad."
  }
];

const modelGrid = document.getElementById("modelGrid");
const heroImage = document.getElementById("heroImage");
const heroCurrent = document.getElementById("heroCurrent");
const heroTotal = document.getElementById("heroTotal");
const heroEyebrow = document.getElementById("heroEyebrow");
const heroTitle = document.getElementById("heroTitle");
const heroDescription = document.getElementById("heroDescription");
const productBrand = document.getElementById("productBrand");
const productTitle = document.getElementById("productTitle");
const productImage = document.getElementById("productImage");
const productDescription = document.getElementById("productDescription");
const productBadge = document.getElementById("productBadge");
const galleryTitle = document.getElementById("galleryTitle");
const photoCounter = document.getElementById("photoCounter");
const gallery = document.getElementById("gallery");
const loadMoreButton = document.getElementById("loadMoreButton");
const clientsTrack = document.getElementById("clientsTrack");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");
const backToTop = document.getElementById("backToTop");

let currentModel = models[3];
let heroIndex = 0;
let heroTimer;
let validGalleryPhotos = [];
let visiblePhotos = 12;
let lightboxIndex = 0;

function imagePath(model, number) {
  return `img/${encodeURIComponent(model.folder)}/${encodeURIComponent(model.filePrefix)}%20(${number}).jpg`;
}

function setImageWithFallback(image, primaryPath, fallbackPath = "") {
  image.onerror = () => {
    if (fallbackPath && image.src !== new URL(fallbackPath, window.location.href).href) {
      image.src = fallbackPath;
    } else {
      image.closest(".gallery-item, .client-photo, .model-card")?.remove();
    }
  };
  image.src = primaryPath;
}

function buildModelCards() {
  modelGrid.innerHTML = "";

  models.forEach((model) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `model-card${model.id === currentModel.id ? " active" : ""}`;
    card.dataset.id = model.id;

    const image = document.createElement("img");
    image.loading = "lazy";
    image.alt = model.name;
    image.src = imagePath(model, model.coverPhoto);

    const info = document.createElement("div");
    info.className = "model-info";
    info.innerHTML = `<p>${model.brand}</p><h3>${model.name}</h3>`;

    card.append(image, info);
    card.addEventListener("click", () => selectModel(model));
    modelGrid.appendChild(card);
  });
}

function selectModel(model) {
  currentModel = model;
  heroIndex = 0;
  visiblePhotos = 12;

  document.querySelectorAll(".model-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.id === model.id);
  });

  heroEyebrow.textContent = `${model.brand} · COLECCIÓN DESTACADA`;
  heroTitle.innerHTML = splitTitle(model.name);
  heroDescription.textContent = model.description;

  productBrand.textContent = model.brand;
  productTitle.textContent = model.name;
  productDescription.textContent = model.description;
  productBadge.textContent = model.badge;
  productImage.src = imagePath(model, model.productPhoto);
  productImage.alt = model.name;

  galleryTitle.textContent = model.name;
  updateWhatsAppLinks();
  buildGallery();
  restartHeroSlider();

  document.getElementById("galeria").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function splitTitle(name) {
  const words = name.split(" ");
  if (words.length <= 2) return name;
  const last = words.pop();
  return `${words.join(" ")} <span>${last}</span>`;
}

function restartHeroSlider() {
  clearInterval(heroTimer);
  updateHero();
  heroTimer = setInterval(updateHero, 3200);
}

function updateHero() {
  const photos = currentModel.heroPhotos;
  const number = photos[heroIndex];

  heroImage.classList.add("changing");

  setTimeout(() => {
    heroImage.src = imagePath(currentModel, number);
    heroImage.alt = `${currentModel.name} - foto ${number}`;
    heroCurrent.textContent = String(heroIndex + 1).padStart(2, "0");
    heroTotal.textContent = String(photos.length).padStart(2, "0");
    heroImage.classList.remove("changing");
    heroIndex = (heroIndex + 1) % photos.length;
  }, 180);
}

function buildGallery() {
  gallery.innerHTML = "";
  validGalleryPhotos = [];
  photoCounter.textContent = "0";
  loadMoreButton.hidden = true;

  let loadedCount = 0;
  let finishedCount = 0;

  for (let number = 1; number <= currentModel.maxPhotos; number++) {
    const image = new Image();
    const source = imagePath(currentModel, number);

    image.onload = () => {
      loadedCount++;
      validGalleryPhotos.push({ number, source });
      validGalleryPhotos.sort((a, b) => a.number - b.number);
      photoCounter.textContent = String(loadedCount);
      renderGallery();
    };

    image.onerror = () => {
      finishedCount++;
      if (finishedCount >= currentModel.maxPhotos) renderGallery();
    };

    image.src = source;
  }
}

function renderGallery() {
  gallery.innerHTML = "";
  const photosToShow = validGalleryPhotos.slice(0, visiblePhotos);

  photosToShow.forEach((photo, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `gallery-item ${galleryItemClass(index)}`;

    const image = document.createElement("img");
    image.loading = "lazy";
    image.src = photo.source;
    image.alt = `${currentModel.name} - foto ${photo.number}`;

    const label = document.createElement("span");
    label.textContent = `VISTA ${String(photo.number).padStart(2, "0")}`;

    button.append(image, label);
    button.addEventListener("click", () => openLightbox(index));
    gallery.appendChild(button);
  });

  loadMoreButton.hidden = validGalleryPhotos.length <= visiblePhotos;
}

function galleryItemClass(index) {
  if (index % 11 === 0) return "wide";
  if (index % 7 === 0) return "tall";
  return "";
}

function loadMorePhotos() {
  visiblePhotos += 12;
  renderGallery();
}

function buildClients() {
  clientsTrack.innerHTML = "";

  for (let i = 1; i <= 10; i++) {
    const card = document.createElement("div");
    card.className = "client-photo";

    const image = document.createElement("img");
    image.loading = "lazy";
    image.src = `img/Clientes/Cliente%20(${i}).jpg`;
    image.alt = `Cliente ${i}`;

    card.appendChild(image);
    clientsTrack.appendChild(card);
  }
}

function updateWhatsAppLinks() {
  const message = `Hola! Quiero consultar por ${currentModel.name}. ¿Qué talles tienen disponibles?`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  document.querySelectorAll(".whatsapp-link").forEach((link) => {
    link.href = url;
  });
}

function openLightbox(index) {
  lightboxIndex = index;
  updateLightbox();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function updateLightbox() {
  const photo = validGalleryPhotos[lightboxIndex];
  if (!photo) return;

  lightboxImage.src = photo.source;
  lightboxImage.alt = `${currentModel.name} - foto ${photo.number}`;
  lightboxCaption.textContent = `${currentModel.name} · Foto ${photo.number} de ${validGalleryPhotos.length}`;
}

function changeLightbox(direction) {
  lightboxIndex =
    (lightboxIndex + direction + validGalleryPhotos.length) %
    validGalleryPhotos.length;
  updateLightbox();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

loadMoreButton.addEventListener("click", loadMorePhotos);
lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => changeLightbox(-1));
lightboxNext.addEventListener("click", () => changeLightbox(1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") changeLightbox(-1);
  if (event.key === "ArrowRight") changeLightbox(1);
});

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 600);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("currentYear").textContent = new Date().getFullYear();

buildModelCards();
buildClients();

selectModel(models[0]);

document.getElementById("currentYear").textContent = new Date().getFullYear();
