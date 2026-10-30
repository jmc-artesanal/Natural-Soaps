/* =========================================================
   JMC · Jabones Artesanales
   script.js
   ---------------------------------------------------------
   Contenido:
   0. DATOS DE WHATSAPP  ← tu número y el mensaje del pedido
   1. CONFIGURACIÓN      ← nombres, precios, imágenes, redes,
                           frases, misión y visión
   2. Utilidades
   3. Generación del catálogo (con botón de WhatsApp)
   4. Misión y visión
   5. Redes sociales
   6. Logo y frases de la portada
   7. Transición suave portada ⇄ catálogo al hacer scroll
   8. Animación de aparición de tarjetas
   ========================================================= */

/* =========================================================
   0. DATOS DE WHATSAPP
   ========================================================= */

/* Tu número: código de país + número, SOLO dígitos (sin +, espacios ni guiones). */
const WHATSAPP_NUMBER = "573157761229";

/* Mensaje del pedido. {name} y {price} se reemplazan solos por el jabón elegido. */
const ORDER_MESSAGE = "Hola JMC, quiero pedir el jabón: {name} ({price})";

/* Texto del botón de cada tarjeta */
const ORDER_BUTTON_TEXT = "Pedir por WhatsApp";

/* =========================================================
   1. CONFIGURACIÓN (edita solo esta sección)
   ========================================================= */
const CONFIG = {

  /* Ruta de tu logo */
  logo: "images/logo.png",

  /* Frases de la portada */
  heroTagline: "Jabones Artesanales hechos a mano",
  heroHint: "Descubre nuestros jabones",

  /* Los 4 jabones. Cambia name, price e image.
     Cuidado: mantén las comillas y la coma al final de cada línea
     (menos en la última). */
  products: [
    { name: "Jabón de Manzanilla", price: "$9.000", image: "images/jabon-1.jpg" },
    { name: "Jabón de Avena", price: "$9.000", image: "images/jabon-2.jpg" },
    { name: "Jabón de Romero", price: "$9.000", image: "images/jabon-3.jpg" },
    { name: "Jabón de Coco", price: "$9.000", image: "images/jabon-4.jpg" }
  ],

  /* Redes sociales. WhatsApp usa automáticamente el número de arriba. */
  social: [
    { name: "WhatsApp",  icon: "i-whatsapp",  url: "https://wa.me/" + WHATSAPP_NUMBER },
    { name: "Instagram", icon: "i-instagram", url: "https://www.instagram.com/jmc.artesanal" },
    { name: "TikTok",    icon: "i-tiktok",    url: "https://www.tiktok.com/@jmc.artesanal" }
  ],

  /* Frase de cierre */
  closingPhrase: "Cuida tu piel, disfruta lo natural!!",

  /* Misión y Visión (aparecen debajo de los productos) */
  mission: "Elaborar y ofrecer jabones artesanales de buena calidad, utilizando ingredientes que ayuden al cuidado de la piel y brindando productos agradables y accesibles para nuestros clientes.",
  vision: "Ser un emprendimiento reconocido en Sabanagrande por la calidad, presentación y variedad de nuestros jabones artesanales, creciendo hasta llegar a más clientes."
};

/* =========================================================
   2. UTILIDADES
   ========================================================= */

/* Crear elementos SVG con <use href="#id"> */
const SVG_NS = "http://www.w3.org/2000/svg";
function svgIcon(id, className) {
  const svg = document.createElementNS(SVG_NS, "svg");
  if (className) svg.setAttribute("class", className);
  svg.setAttribute("aria-hidden", "true");
  const use = document.createElementNS(SVG_NS, "use");
  use.setAttribute("href", "#" + id);
  svg.appendChild(use);
  return svg;
}

/* Crea el enlace de WhatsApp con el mensaje del jabón elegido */
function buildOrderLink(product) {
  const text = ORDER_MESSAGE
    .replace("{name}", product.name)
    .replace("{price}", product.price);
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
}

/* =========================================================
   3. GENERACIÓN DEL CATÁLOGO
   ========================================================= */
function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  CONFIG.products.forEach((product, index) => {
    const card = document.createElement("article");
    card.className = "card reveal";
    card.style.setProperty("--delay", (index % 4) * 0.1 + "s"); // aparición escalonada

    /* Flor decorativa en la esquina */
    card.appendChild(svgIcon("flower", "card__badge"));

    /* Zona de imagen */
    const media = document.createElement("div");
    media.className = "card__media";

    /* Espacio reservado: queda detrás de la imagen */
    const placeholder = document.createElement("div");
    placeholder.className = "card__placeholder";
    placeholder.appendChild(svgIcon("leaf"));
    const phText = document.createElement("span");
    phText.textContent = "Agrega tu imagen";
    const phCode = document.createElement("code");
    phCode.textContent = product.image;
    placeholder.append(phText, phCode);
    media.appendChild(placeholder);

    /* Imagen real: si no existe, se oculta y se ve el espacio reservado */
    const img = document.createElement("img");
    img.className = "card__img";
    img.src = product.image;
    img.alt = product.name;
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("error", () => { img.style.display = "none"; });
    media.appendChild(img);

    /* Nombre y precio */
    const name = document.createElement("h3");
    name.className = "card__name";
    name.textContent = product.name;

    const price = document.createElement("span");
    price.className = "card__price";
    price.textContent = product.price;

    /* Botón de pedido: abre WhatsApp con el jabón elegido.
       Toda la tarjeta es clicable gracias al CSS (.card__order::after) */
    const order = document.createElement("a");
    order.className = "card__order";
    order.href = buildOrderLink(product);
    order.target = "_blank";
    order.rel = "noopener noreferrer";
    order.setAttribute("aria-label", ORDER_BUTTON_TEXT + ": " + product.name);
    order.appendChild(svgIcon("i-whatsapp"));
    order.append(" " + ORDER_BUTTON_TEXT);

    card.append(media, name, price, order);
    grid.appendChild(card);
  });
}

/* =========================================================
   4. MISIÓN Y VISIÓN
   ========================================================= */
function renderAbout() {
  const mission = document.getElementById("missionText");
  const vision = document.getElementById("visionText");
  if (mission) mission.textContent = CONFIG.mission;
  if (vision) vision.textContent = CONFIG.vision;
}

/* =========================================================
   5. REDES SOCIALES
   ========================================================= */
function renderSocial() {
  const list = document.getElementById("socialList");
  if (!list) return;

  CONFIG.social.forEach(network => {
    const li = document.createElement("li");

    const a = document.createElement("a");
    a.className = "social__link";
    a.href = network.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("aria-label", network.name + " de JMC");

    const iconWrap = document.createElement("span");
    iconWrap.className = "social__icon";
    iconWrap.appendChild(svgIcon(network.icon));

    const label = document.createElement("span");
    label.textContent = network.name;

    a.append(iconWrap, label);
    li.appendChild(a);
    list.appendChild(li);
  });

  document.getElementById("closingPhrase").textContent = CONFIG.closingPhrase;
  document.getElementById("year").textContent = new Date().getFullYear();
}

/* =========================================================
   6. LOGO Y FRASES DE LA PORTADA
   ========================================================= */
function setupLogo() {
  const img = document.getElementById("logoImg");
  const fallback = document.getElementById("logoFallback");
  img.src = CONFIG.logo;

  /* Si no existe el logo, se muestra un aviso con la ruta esperada */
  img.addEventListener("error", () => {
    img.hidden = true;
    fallback.hidden = false;
    fallback.querySelector("small").textContent = CONFIG.logo;
  });

  /* Frases de la portada */
  document.getElementById("heroTagline").textContent = CONFIG.heroTagline;
  document.getElementById("heroHint").textContent = CONFIG.heroHint;
}

/* =========================================================
   7. TRANSICIÓN PORTADA ⇄ CATÁLOGO
   ---------------------------------------------------------
   Se calcula el progreso del scroll (0 a 1) y se asigna la
   opacidad directamente. Al ser proporcional a la posición,
   funciona igual hacia abajo y hacia arriba, sin saltos.
   El logo NO es fijo: se desplaza con la página, por lo que
   nunca tapa los productos.
   ========================================================= */
function setupScrollFade() {
  const heroInner = document.getElementById("heroInner");
  const hero = document.getElementById("inicio");
  const catalogWrap = document.getElementById("catalogWrap");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  let ticking = false;

  function update() {
    const heroH = hero.offsetHeight;
    const y = window.scrollY || window.pageYOffset;

    /* Portada: se desvanece durante el primer 60 % de su altura */
    const heroProgress = clamp(y / (heroH * 0.6));
    heroInner.style.opacity = (1 - heroProgress).toFixed(3);
    heroInner.style.transform = reduceMotion.matches
      ? "none"
      : `translateY(${(heroProgress * -20).toFixed(1)}px) scale(${(1 - heroProgress * 0.04).toFixed(3)})`;

    /* Catálogo: aparece entre el 25 % y el 75 % de la altura de la portada */
    const catalogProgress = clamp((y - heroH * 0.25) / (heroH * 0.5));
    catalogWrap.style.opacity = catalogProgress.toFixed(3);

    ticking = false;
  }

  /* requestAnimationFrame evita trabajo extra y mantiene la fluidez */
  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("load", update);
  update(); // estado inicial (también si la página se recarga ya desplazada)
}

/* =========================================================
   8. APARICIÓN DE TARJETAS (IntersectionObserver)
   ========================================================= */
function setupReveal() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // se anima una sola vez
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  items.forEach(el => observer.observe(el));
}

/* =========================================================
   INICIO
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  setupLogo();
  renderProducts();
  renderAbout();
  renderSocial();
  setupScrollFade();
  setupReveal();
});