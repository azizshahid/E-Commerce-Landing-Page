document.body.classList.add("loaded");

// Populate dates
const today = new Date();
const fmt = (d) =>
  d.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

document.getElementById("placedDate").textContent = fmt(today);

const shipDate = new Date(today);
shipDate.setDate(today.getDate() + 2);
const deliverStart = new Date(today);
deliverStart.setDate(today.getDate() + 5);
const deliverEnd = new Date(today);
deliverEnd.setDate(today.getDate() + 7);

document.getElementById("shipDate").textContent = fmt(shipDate);
document.getElementById("deliverDate").textContent = fmt(deliverEnd);
document.getElementById("deliveryWindow").textContent =
  `${fmt(deliverStart)} – ${fmt(deliverEnd)}`;

// Animate tracker fill to ~25% (after "order placed" step)
setTimeout(() => {
  document.getElementById("trackerFill").style.width = "30%";
}, 600);

// Populate from URL params if passed from checkout
const p = new URLSearchParams(window.location.search);
if (p.get("name")) {
  document.getElementById("heroName").textContent = p.get("name");
  document.getElementById("shipName").textContent = p.get("name");
}
if (p.get("email")) {
  document.getElementById("confirmEmail").textContent = p.get("email");
  document.getElementById("billingEmail").textContent = p.get("email");
}
if (p.get("order")) {
  document.getElementById("orderNum").textContent = p.get("order");
}

// Scroll reveals
const reveals = document.querySelectorAll(".reveal");
const obs = new IntersectionObserver(
  (e) =>
    e.forEach((en) => {
      if (en.isIntersecting) en.target.classList.add("visible");
    }),
  { threshold: 0.1 },
);
reveals.forEach((r) => obs.observe(r));
