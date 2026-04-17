document.body.classList.add("loaded");

// ── Scroll reveal ───────────────────────────────────────
const obs = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    }),
  { threshold: 0.1 },
);
document.querySelectorAll(".reveal").forEach((r) => obs.observe(r));

// ── Panel switching ─────────────────────────────────────
function showPanel(id, navBtn) {
  document
    .querySelectorAll(".account-panel")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".account-nav-item")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById(`panel-${id}`).classList.add("active");
  if (navBtn) navBtn.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Order filter ────────────────────────────────────────
function filterOrders(status, btn) {
  document
    .querySelectorAll(".order-tab")
    .forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".order-card").forEach((card) => {
    card.style.display =
      status === "all" || card.dataset.status === status ? "" : "none";
  });
}

// ── Track order ─────────────────────────────────────────
function trackOrder(num) {
  alert(
    `Tracking info for order #${num}:\n\nStatus: In preparation\nEst. ship: Apr 17, 2024\nCarrier: USPS`,
  );
}

// ── Reorder ─────────────────────────────────────────────
function reorder() {
  addToCart(
    "Ceramic Tea Set",
    89,
    "./images/featured-products/Hand-painted Ceramic Tea Set.jpg",
  );
}

// ── Inline field edit ───────────────────────────────────
function editField(id) {
  const span = document.getElementById(id);
  const current = span.textContent;
  const input = document.createElement("input");
  input.type = "text";
  input.value = current;
  input.className = "form-input";
  input.style.maxWidth = "220px";
  input.style.fontSize = "0.85rem";
  input.style.padding = "6px 10px";

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.className = "settings-edit-btn";
  saveBtn.style.color = "#5a9e5d";

  saveBtn.onclick = () => {
    span.textContent = input.value || current;
    input.replaceWith(span);
    saveBtn.replaceWith(createEditBtn(id));
  };

  input.onkeydown = (e) => {
    if (e.key === "Enter") saveBtn.click();
    if (e.key === "Escape") {
      span.textContent = current;
      input.replaceWith(span);
      saveBtn.replaceWith(createEditBtn(id));
    }
  };

  span.replaceWith(input);
  const oldBtn =
    span.parentElement?.querySelector(".settings-edit-btn") ||
    document.querySelector(`[onclick="editField('${id}')"]`);
  if (oldBtn) oldBtn.replaceWith(saveBtn);
  input.focus();
}

function createEditBtn(id) {
  const btn = document.createElement("button");
  btn.className = "settings-edit-btn";
  btn.textContent = "Edit";
  btn.onclick = () => editField(id);
  return btn;
}

// ── Remove wishlist item ────────────────────────────────
function removeWishlist(btn) {
  const card = btn.closest(".wishlist-card");
  card.style.transition = "opacity 0.3s, transform 0.3s";
  card.style.opacity = "0";
  card.style.transform = "scale(0.95)";
  setTimeout(() => card.remove(), 300);
}

// ── Sign out ────────────────────────────────────────────
function signOut() {
  if (confirm("Sign out of your account?")) location.href = "./login.html";
}

// ── Read URL param: ?tab=orders ──────────────────────────
const tab = new URLSearchParams(window.location.search).get("tab");
if (tab) {
  const btn = document.querySelector(`[onclick*="${tab}"]`);
  if (btn) showPanel(tab, btn);
}

// Search bar guard
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
