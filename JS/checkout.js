// ── State ──────────────────────────────────────────────────
let shippingCost = 0;
let discountPct = 0;
const subtotal = 153.0;
const taxRate = 0.08;

// ── Step progression ───────────────────────────────────────

function continueToShipping() {
  const fn = document.getElementById("firstName").value.trim();
  const em = document.getElementById("email").value.trim();
  if (!fn || !em) {
    shakeCard("contactCard");
    return;
  }

  // Mark contact as done
  const contactCard = document.getElementById("contactCard");
  contactCard.classList.add("done-card");
  contactCard.querySelector(".card-step-badge").classList.add("green");
  contactCard.querySelector(".card-step-badge").innerHTML =
    '<i class="ri-check-line" style="font-size:0.75rem;"></i>';

  // Collapse contact, expand shipping
  collapseCard("contactCard");
  expandCard("shippingCard", "shippingForm", "shippingEdit");
  updateStepBar(2);
  document
    .getElementById("shippingCard")
    .scrollIntoView({ behavior: "smooth", block: "start" });
}

function continueToPayment() {
  const addr = document.getElementById("address1").value.trim();
  const city = document.getElementById("city").value.trim();
  const zip = document.getElementById("zip").value.trim();
  if (!addr || !city || !zip) {
    shakeCard("shippingCard");
    return;
  }

  // Build address summary
  const state = document.getElementById("state").value;
  const country =
    document.getElementById("country").options[
      document.getElementById("country").selectedIndex
    ].text;
  const addr2 = document.getElementById("address2").value.trim();
  const summary = `${addr}${addr2 ? ", " + addr2 : ""}, ${city}, ${state} ${zip}, ${country}`;
  document.getElementById("shippingSummaryText").textContent = summary;

  // Mark shipping done
  const shCard = document.getElementById("shippingCard");
  shCard.classList.add("done-card");
  shCard.querySelector(".card-step-badge").classList.add("green");
  shCard.querySelector(".card-step-badge").innerHTML =
    '<i class="ri-check-line" style="font-size:0.75rem;"></i>';

  collapseCard(
    "shippingCard",
    "shippingForm",
    "shippingEdit",
    "shippingSummary",
  );
  expandCard("paymentCard", "paymentForm", "paymentEdit");
  updateStepBar(3);

  // Enable the side CTA
  document.getElementById("placeOrderBtnSide").disabled = false;
  document.getElementById("placeOrderBtnSide").style.opacity = "1";

  document
    .getElementById("paymentCard")
    .scrollIntoView({ behavior: "smooth", block: "start" });
}

function editStep(step) {
  if (step === "shipping") {
    collapseCard("paymentCard");
    expandCard("shippingCard", "shippingForm", "shippingEdit");
    updateStepBar(2);
  }
  if (step === "payment") {
    expandCard("paymentCard", "paymentForm", "paymentEdit");
    updateStepBar(3);
  }
}

function collapseCard(id, formId, editId, summaryId) {
  const card = document.getElementById(id);
  card.classList.add("collapsed");
  card.classList.remove("done-card");
  if (formId) document.getElementById(formId).style.display = "none";
  if (editId) document.getElementById(editId).style.display = "inline";
  if (summaryId) document.getElementById(summaryId).style.display = "block";
}

function expandCard(id, formId, editId) {
  const card = document.getElementById(id);
  card.classList.remove("collapsed");
  if (formId) document.getElementById(formId).style.display = "block";
  if (editId) document.getElementById(editId).style.display = "none";
}

function updateStepBar(active) {
  const steps = ["stepCart", "stepShipping", "stepPayment", "stepConfirm"];
  const order = {
    stepCart: 1,
    stepShipping: 2,
    stepPayment: 3,
    stepConfirm: 4,
  };
  steps.forEach((id) => {
    const el = document.getElementById(id);
    el.classList.remove("active", "done");
    if (order[id] < active) el.classList.add("done");
    if (order[id] === active) el.classList.add("active");
  });
}

function shakeCard(id) {
  const card = document.getElementById(id);
  card.style.animation = "shake 0.4s ease";
  setTimeout(() => (card.style.animation = ""), 400);
}

// ── Delivery options ───────────────────────────────────────

function selectDelivery(label, cost) {
  document
    .querySelectorAll(".delivery-option")
    .forEach((o) => o.classList.remove("selected"));
  label.classList.add("selected");
  shippingCost = cost;
  recalcTotals();
}

function updateDeliveryOptions(country) {
  const stdPrice = document.getElementById("stdPrice");
  if (country === "us" || country === "ca") {
    stdPrice.textContent = "Free";
    stdPrice.className = "delivery-option-price free";
    shippingCost = 0;
  } else {
    stdPrice.textContent = "$14.00";
    stdPrice.className = "delivery-option-price";
    shippingCost = 14;
  }
  recalcTotals();
}

// ── Totals calculation ─────────────────────────────────────

function recalcTotals() {
  const discount = subtotal * (discountPct / 100);
  const taxable = subtotal - discount + shippingCost;
  const tax = taxable * taxRate;
  const grand = taxable + tax;

  document.getElementById("shippingVal").textContent =
    shippingCost === 0 ? "Free" : "$" + shippingCost.toFixed(2);
  document.getElementById("discountVal").textContent =
    "−$" + discount.toFixed(2);
  document.getElementById("taxVal").textContent = "$" + tax.toFixed(2);
  document.getElementById("grandTotal").textContent = "$" + grand.toFixed(2);
  document.getElementById("btnTotal").textContent = "$" + grand.toFixed(2);
  document.getElementById("btnTotalSide").textContent = "$" + grand.toFixed(2);

  document.getElementById("savingRow").style.display =
    discountPct > 0 ? "flex" : "none";
}

// ── Promo code ─────────────────────────────────────────────

function applyPromo() {
  const code = document.getElementById("promoInput").value.trim().toUpperCase();
  const valid = ["ARTISAN10", "WELCOME10", "CRAFT10"];
  if (valid.includes(code)) {
    discountPct = 10;
    document.getElementById("promoSuccess").style.display = "block";
    document.getElementById("promoInput").style.borderColor = "#5a9e5d";
    recalcTotals();
  } else {
    document.getElementById("promoInput").style.borderColor = "#c0504d";
    document.getElementById("promoSuccess").style.display = "none";
    setTimeout(
      () => (document.getElementById("promoInput").style.borderColor = ""),
      1500,
    );
  }
}

// ── Payment tab switch ─────────────────────────────────────

function switchPayTab(btn, type) {
  document
    .querySelectorAll(".pay-tab")
    .forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");

  document.getElementById("cardPanel").style.display =
    type === "card" ? "block" : "none";
  document
    .getElementById("paypalPanel")
    .classList.toggle("visible", type === "paypal");
  document
    .getElementById("applePanel")
    .classList.toggle("visible", type === "apple");
}

// ── Card formatting ────────────────────────────────────────

function formatCard(input) {
  let v = input.value.replace(/\D/g, "").slice(0, 16);
  input.value = v.replace(/(\d{4})(?=\d)/g, "$1 ");

  // Update preview
  const padded = v.padEnd(16, "•");
  const preview = padded.match(/.{1,4}/g).join(" ");
  document.getElementById("previewNum").textContent = preview;

  // Detect network
  const icon = document.getElementById("cardNetworkIcon");
  const previewIcon = document.getElementById("previewNetwork");
  if (/^4/.test(v)) {
    icon.className = "ri-visa-fill card-network-icon";
    icon.style.color = "#1a1f71";
    previewIcon.className = "ri-visa-fill";
    previewIcon.style.opacity = "0.8";
  } else if (/^5[1-5]/.test(v) || /^2[2-7]/.test(v)) {
    icon.className = "ri-mastercard-fill card-network-icon";
    icon.style.color = "#eb001b";
    previewIcon.className = "ri-mastercard-fill";
    previewIcon.style.opacity = "0.8";
  } else {
    icon.className = "ri-bank-card-line card-network-icon";
    icon.style.color = "";
    previewIcon.className = "ri-visa-fill";
    previewIcon.style.opacity = "0.2";
  }
}

function formatExp(input) {
  let v = input.value.replace(/\D/g, "");
  if (v.length >= 2) v = v.slice(0, 2) + " / " + v.slice(2, 4);
  input.value = v;
  document.getElementById("previewExp").textContent = v || "MM / YY";
}

// ── Place order ────────────────────────────────────────────

function placeOrder() {
  const btn = document.getElementById("placeOrderBtn");
  btn.classList.add("loading");

  setTimeout(() => {
    btn.classList.remove("loading");
    const orderNum = "AC-" + Math.floor(10000 + Math.random() * 90000);
    document.getElementById("orderNumDisplay").textContent =
      "Order #" + orderNum;
    const email = document.getElementById("email").value || "your inbox";
    document.getElementById("confirmEmail").textContent = email;
    document.getElementById("successOverlay").classList.add("show");
  }, 2200);
}

// ── Init ───────────────────────────────────────────────────

recalcTotals();

// Shake keyframe
const style = document.createElement("style");
style.textContent = `@keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-6px)}
      40%{transform:translateX(6px)}
      60%{transform:translateX(-4px)}
      80%{transform:translateX(4px)}
    }`;
document.head.appendChild(style);

// Fade in
document.body.classList.add("loaded");
