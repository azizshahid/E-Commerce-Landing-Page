// Fade in
document.body.classList.add("loaded");

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.12 },
);
reveals.forEach((r) => revealObserver.observe(r));

// Gallery image switch
function switchImage(thumb, src) {
  document.getElementById("mainImg").src = src;
  document
    .querySelectorAll(".gallery-thumb")
    .forEach((t) => t.classList.remove("active"));
  thumb.classList.add("active");
}

// Variant / swatch selectors
function selectVariant(btn) {
  document
    .querySelectorAll(".variant-pill")
    .forEach((p) => p.classList.remove("active"));
  btn.classList.add("active");
}

function selectSwatch(swatch, name) {
  document
    .querySelectorAll(".swatch")
    .forEach((s) => s.classList.remove("active"));
  swatch.classList.add("active");
  document.getElementById("selectedColour").textContent = "— " + name;
}

// Quantity
let qty = 1;
function changeQty(delta) {
  qty = Math.max(1, Math.min(qty + delta, 6));
  document.getElementById("qtyDisplay").textContent = qty;
}

// Add to cart with confirmation animation
function handleAddToCart() {
  const btn = document.getElementById("atcBtn");
  const size =
    document.querySelector(".variant-pill.active")?.textContent || "4-piece";
  const colour = document
    .getElementById("selectedColour")
    .textContent.replace("— ", "");
  const name = `Ceramic Tea Set (${size}, ${colour})`;

  addToCart(
    name,
    89 * qty,
    "./images/featured-products/Hand-painted Ceramic Tea Set.jpg",
  );

  btn.innerHTML = '<i class="ri-check-line"></i> Added!';
  btn.classList.add("added");
  setTimeout(() => {
    btn.innerHTML = '<i class="ri-shopping-cart-line"></i> Add to Cart';
    btn.classList.remove("added");
  }, 2200);
}

// Wishlist toggle
function toggleWishlist(btn) {
  btn.classList.toggle("active");
  const icon = btn.querySelector("i");
  icon.className = btn.classList.contains("active")
    ? "ri-heart-fill"
    : "ri-heart-line";
}

// Simple related carousel (no infinite loop — too few cards)
const rel = document.getElementById("relatedCarousel");
rel.addEventListener(
  "wheel",
  (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      rel.scrollLeft += e.deltaY * 0.5;
    }
  },
  { passive: false },
);
