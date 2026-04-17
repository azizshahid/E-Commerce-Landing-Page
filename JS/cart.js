document.body.classList.add("loaded");

// ── Scroll reveal ───────────────────────────────────────
const obs = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    }),
  { threshold: 0.1 },
);
document.querySelectorAll(".reveal").forEach((r) => obs.observe(r));

// ── Cart state for this page ────────────────────────────
const lineData = {
  "line-1": { qty: 1, unitPrice: 89 },
  "line-2": { qty: 1, unitPrice: 64 },
};
let promoDiscount = 0;
const TAX_RATE = 0.08;

function recalc() {
  const lines = Object.values(lineData);
  const subtotal = lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const discount = subtotal * promoDiscount;
  const tax = (subtotal - discount) * TAX_RATE;
  const grand = subtotal - discount + tax;

  document.getElementById("summarySubtotal").textContent =
    `$${subtotal.toFixed(2)}`;
  document.getElementById("summaryTax").textContent = `$${tax.toFixed(2)}`;
  document.getElementById("summaryGrand").textContent = `$${grand.toFixed(2)}`;
  document.getElementById("summaryCount").textContent = count;
  document.getElementById("pageItemCount").textContent =
    `${count} item${count !== 1 ? "s" : ""}`;

  if (promoDiscount > 0) {
    document.getElementById("discountRow").style.display = "flex";
    document.getElementById("discountAmt").textContent =
      `−$${discount.toFixed(2)}`;
  }

  // Empty state
  if (Object.keys(lineData).length === 0) showEmpty();
}

// ── Qty change ──────────────────────────────────────────
function changeQty(id, delta, unit) {
  const data = lineData[id];
  if (!data) return;
  data.qty = Math.max(1, Math.min(data.qty + delta, 10));
  document.getElementById(`qty-${id}`).textContent = data.qty;
  document.getElementById(`price-${id}`).textContent =
    `$${(data.qty * unit).toFixed(2)}`;
  recalc();
}

// ── Remove line ─────────────────────────────────────────
function removeLine(id) {
  const el = document.getElementById(id);
  el.classList.add("removing");
  setTimeout(() => {
    el.remove();
    delete lineData[id];
    recalc();
  }, 320);
}

// ── Save for later ──────────────────────────────────────
function saveLater(id) {
  const btn = document.querySelector(`#${id} .save-later`);
  btn.innerHTML = '<i class="ri-heart-fill" style="color:#c0504d"></i> Saved!';
  btn.disabled = true;
}

// ── Empty state ─────────────────────────────────────────
function showEmpty() {
  document.getElementById("cartItemsCol").innerHTML = `
        <div class="cart-empty">
          <i class="ri-shopping-cart-line"></i>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet.</p>
          <a href="./shop.html" class="btn btn-primary" style="border-radius:6px; font-size:0.9rem; padding:0.75rem 2rem;">Start Shopping</a>
        </div>
        <a href="./shop.html" class="continue-shopping" style="margin-top:1rem;">
          <i class="ri-arrow-left-s-line"></i> Continue shopping
        </a>`;
  document.getElementById("summaryCount").textContent = "0";
  document.getElementById("summarySubtotal").textContent = "$0.00";
  document.getElementById("summaryTax").textContent = "$0.00";
  document.getElementById("summaryGrand").textContent = "$0.00";
}

// ── Promo code ──────────────────────────────────────────
function applyPromo() {
  const code = document.getElementById("promoField").value.trim().toUpperCase();
  const msg = document.getElementById("promoMsg");
  const valid = ["ARTISAN10", "WELCOME10", "CRAFT10"];

  if (valid.includes(code)) {
    promoDiscount = 0.1;
    msg.className = "promo-msg ok";
    msg.textContent = "✓ Code applied — 10% off your order!";
    document.getElementById("promoField").style.borderColor = "#5a9e5d";
    recalc();
  } else {
    msg.className = "promo-msg err";
    msg.textContent = "✗ Invalid code. Try ARTISAN10.";
    document.getElementById("promoField").style.borderColor = "#c0504d";
    setTimeout(
      () => (document.getElementById("promoField").style.borderColor = ""),
      1800,
    );
  }
}

// Quick-add from recommendations (shows a brief confirmation)
function quickAdd(name, price, img) {
  const btn = event.target;
  btn.textContent = "✓ Added!";
  btn.style.background = "#2d6e32";
  setTimeout(() => {
    btn.textContent = "Add to Cart";
    btn.style.background = "";
  }, 1800);
}

// Recommendation carousel — simple horizontal wheel scroll
const rec = document.getElementById("recCarousel");
rec.addEventListener(
  "wheel",
  (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      rec.scrollLeft += e.deltaY * 0.5;
    }
  },
  { passive: false },
);

// Search bar
const si = document.querySelector(".search-input");
if (si) {
  si.addEventListener("focus", () =>
    si.closest(".search-container").classList.add("active"),
  );
  document.addEventListener("click", (e) => {
    if (!si.closest(".search-container").contains(e.target))
      si.closest(".search-container").classList.remove("active");
  });
}
