// Reemplazá este número de ejemplo por el WhatsApp comercial antes de publicar.
const WHATSAPP_PHONE = "5491100000000";

const vehicles = [
  { brand: "Peugeot", model: "208", year: "2025", category: "Hatchback", condition: "0km", image: "assets/208.jpg", alt: "Peugeot 208 azul" },
  { brand: "Peugeot", model: "2008", year: "2025", category: "SUV", condition: "0km", image: "assets/2008.jpg", alt: "Peugeot 2008 blanco" },
  { brand: "Peugeot", model: "3008", year: "2022", category: "SUV", condition: "usado", image: "assets/3008.jpg", alt: "Peugeot 3008 gris" },
  { brand: "Peugeot", model: "Partner", year: "2025", category: "Utilitario", condition: "0km", image: "assets/partner.jpg", alt: "Peugeot Partner gris" },
  { brand: "Renault", model: "Kardian", year: "2025", category: "SUV", condition: "0km", image: "assets/kardian.jpg", alt: "Renault Kardian azul" },
  { brand: "Renault", model: "Duster", year: "2025", category: "SUV", condition: "0km", image: "assets/duster.jpg", alt: "Renault Duster gris" },
  { brand: "Renault", model: "Kangoo", year: "2021", category: "Utilitario", condition: "usado", image: "assets/kangoo.jpg", alt: "Renault Kangoo blanco" },
  { brand: "Renault", model: "Logan", year: "2022", category: "Sedán", condition: "usado", image: "assets/logan.jpg", alt: "Renault Logan gris" }
];

const usedVehicles = [
  { brand: "Peugeot", model: "208 Allure", year: "2022", km: "32.000 km", transmission: "Manual", fuel: "Nafta", image: "assets/208 allure.jpg", alt: "Peugeot 208 Allure gris" },
  { brand: "Renault", model: "Duster Intens", year: "2021", km: "48.500 km", transmission: "Manual", fuel: "Nafta", image: "assets/duster intens.jpg", alt: "Renault Duster Intens blanco" },
  { brand: "Peugeot", model: "Partner Confort", year: "2020", km: "61.000 km", transmission: "Manual", fuel: "Diésel", image: "assets/partner confort.jpg", alt: "Peugeot Partner Confort gris" },
  { brand: "Renault", model: "Logan Life", year: "2022", km: "27.000 km", transmission: "Manual", fuel: "Nafta", image: "assets/logan life.jpg", alt: "Renault Logan Life azul" }
];

const assetUrl = (path) => encodeURI(path);
const vehicleGrid = document.querySelector("#vehicle-grid");
const usedGrid = document.querySelector("#used-grid");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const catalogCount = document.querySelector(".catalog-count");

function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

function addWhatsAppLinks(root = document) {
  root.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = whatsappUrl(link.dataset.whatsapp);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

function renderVehicles(filter = "all") {
  const visibleVehicles = vehicles.filter((vehicle) => {
    if (filter === "peugeot" || filter === "renault") return vehicle.brand.toLowerCase() === filter;
    if (filter === "0km") return vehicle.condition === "0km";
    if (filter === "usados") return vehicle.condition === "usado";
    return true;
  });

  catalogCount.textContent = `${visibleVehicles.length} ${visibleVehicles.length === 1 ? "vehículo" : "vehículos"}`;
  if (visibleVehicles.length === 0) {
    vehicleGrid.innerHTML = '<p class="empty-state">No encontramos vehículos para este filtro.</p>';
    return;
  }

  vehicleGrid.innerHTML = visibleVehicles.map((vehicle) => {
    const isUsed = vehicle.condition === "usado";
    const message = `Hola, quisiera consultar por el ${vehicle.brand} ${vehicle.model} ${vehicle.year} que vi en Dual Motors.`;
    return `
      <article class="vehicle-card">
        <div class="vehicle-photo">
          <img src="${assetUrl(vehicle.image)}" alt="${vehicle.alt}" loading="lazy">
          <span class="vehicle-status${isUsed ? " used" : ""}">${isUsed ? "USADO" : "0 KM"}</span>
        </div>
        <div class="vehicle-info">
          <span class="vehicle-brand"><i class="brand-dot ${vehicle.brand.toLowerCase()}"></i>${vehicle.brand}</span>
          <div class="vehicle-title-line"><h3>${vehicle.model}</h3><span class="vehicle-year">${vehicle.year}</span></div>
          <p class="vehicle-category">${vehicle.category}</p>
          <p class="vehicle-price">Consultar precio</p>
          <a class="button button-dark" data-whatsapp="${message}" href="#">CONSULTAR POR ESTE VEHÍCULO <span aria-hidden="true">↗</span></a>
        </div>
      </article>`;
  }).join("");
  addWhatsAppLinks(vehicleGrid);
}

function renderUsedVehicles() {
  usedGrid.innerHTML = usedVehicles.map((vehicle) => {
    const message = `Hola, quisiera consultar disponibilidad del ${vehicle.brand} ${vehicle.model} ${vehicle.year}.`;
    return `
      <article class="used-card reveal">
        <div class="used-photo"><img src="${assetUrl(vehicle.image)}" alt="${vehicle.alt}" loading="lazy"></div>
        <div class="used-info">
          <div class="used-model"><h3>${vehicle.model}</h3><span>${vehicle.year}</span></div>
          <div class="used-specs"><span>${vehicle.km}</span><span>${vehicle.transmission}</span><span>${vehicle.fuel}</span><span>${vehicle.brand}</span></div>
          <p class="used-price">Precio de demostración · consultar</p>
          <a class="button button-outline-light" data-whatsapp="${message}" href="#">CONSULTAR DISPONIBILIDAD <span aria-hidden="true">↗</span></a>
        </div>
      </article>`;
  }).join("");
  addWhatsAppLinks(usedGrid);
  observeReveals(usedGrid.querySelectorAll(".reveal"));
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    renderVehicles(button.dataset.filter);
  });
});

document.querySelectorAll("[data-brand-link]").forEach((link) => {
  link.addEventListener("click", () => {
    const brandButton = document.querySelector(`.filter-button[data-filter="${link.dataset.brandLink}"]`);
    brandButton.click();
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
  primaryNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
  primaryNav.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formFeedback.classList.remove("is-error");

  const phone = contactForm.elements.phone;
  const phoneDigits = phone.value.replace(/\D/g, "");
  if (phoneDigits.length < 8) {
    phone.setCustomValidity("Ingresá un teléfono válido con al menos 8 dígitos.");
  } else {
    phone.setCustomValidity("");
  }

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    formFeedback.textContent = "Revisá los campos indicados para continuar.";
    formFeedback.classList.add("is-error");
    return;
  }

  formFeedback.textContent = "Consulta validada. Esta demostración no envía tus datos: conectá un servicio de recepción para habilitar el envío.";
  contactForm.reset();
});

const backToTop = document.querySelector(".back-to-top");
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("is-visible", window.scrollY > 500);
}, { passive: true });

let revealObserver;
function observeReveals(elements = document.querySelectorAll(".reveal")) {
  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  }
  elements.forEach((element) => revealObserver.observe(element));
}

renderVehicles();
renderUsedVehicles();
addWhatsAppLinks();
observeReveals();
document.querySelector("#current-year").textContent = new Date().getFullYear();
