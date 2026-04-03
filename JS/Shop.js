document.body.classList.add("loaded");

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.1 },
);
reveals.forEach((r) => obs.observe(r));

// Active filters state
const activeFilters = {};

// Apply category / origin / rating filter
function applyFilter(type, value, btn) {
  // Update button styles within same group
  const group = btn.closest(".filter-list, .sidebar-block");
  if (group) {
    group
      .querySelectorAll(".filter-btn, .rating-row")
      .forEach((b) => b.classList.remove("active"));
  }
  btn.classList.add("active");

  if (value === "all") {
    delete activeFilters[type];
  } else {
    activeFilters[type] = value;
  }
  renderChips();
  filterCards();
}

// Price filter
function applyPriceFilter() {
  const min = parseFloat(document.getElementById("priceMin").value) || 0;
  const max = parseFloat(document.getElementById("priceMax").value) || Infinity;
  if (min > 0 || max < Infinity) {
    activeFilters.price = { min, max };
  } else {
    delete activeFilters.price;
  }
  // Update visual fill (rough approximation)
  const fill = document.getElementById("priceRangeFill");
  const pct = Math.min(100, (max / 500) * 100);
  fill.style.right = 100 - pct + "%";
  renderChips();
  filterCards();
}

// Sort
function applySort(value) {
  const cards = Array.from(
    document.querySelectorAll("#productsGrid .product-card"),
  );
  cards.sort((a, b) => {
    const pa = parseFloat(a.dataset.price),
      pb = parseFloat(b.dataset.price);
    const ra = parseFloat(a.dataset.rating),
      rb = parseFloat(b.dataset.rating);
    if (value === "price-asc") return pa - pb;
    if (value === "price-desc") return pb - pa;
    if (value === "rating") return rb - ra;
    return 0;
  });
  const grid = document.getElementById("productsGrid");
  cards.forEach((c) => grid.appendChild(c));
}

// Filter product cards
function filterCards() {
  const cards = document.querySelectorAll("#productsGrid .product-card");
  let visible = 0;
  cards.forEach((card) => {
    let show = true;
    if (activeFilters.cat && card.dataset.cat !== activeFilters.cat)
      show = false;
    if (activeFilters.origin && card.dataset.origin !== activeFilters.origin)
      show = false;
    if (
      activeFilters.rating &&
      parseFloat(card.dataset.rating) < parseFloat(activeFilters.rating)
    )
      show = false;
    if (activeFilters.price) {
      const p = parseFloat(card.dataset.price);
      if (p < activeFilters.price.min || p > activeFilters.price.max)
        show = false;
    }
    card.style.display = show ? "" : "none";
    if (show) visible++;
  });
  document.getElementById("resultCount").textContent = visible;

  // No results message
  let noRes = document.getElementById("noResults");
  if (visible === 0) {
    if (!noRes) {
      noRes = document.createElement("div");
      noRes.id = "noResults";
      noRes.className = "no-results";
      noRes.innerHTML =
        '<i class="ri-search-eye-line"></i><strong>No products match your filters</strong><p style="margin-top:0.5rem;">Try adjusting or clearing your filters</p>';
      document.getElementById("productsGrid").appendChild(noRes);
    }
  } else if (noRes) {
    noRes.remove();
  }
}

// Render active filter chips
function renderChips() {
  const container = document.getElementById("activeFilters");
  container.innerHTML = "";
  const labels = {
    cat: {
      ceramics: "Ceramics",
      textiles: "Textiles",
      jewelry: "Jewellery",
      clothing: "Clothing",
      accessories: "Accessories",
    },
    origin: {
      europe: "Europe",
      asia: "Asia",
      americas: "Americas",
      africa: "Africa & ME",
    },
    rating: { 5: "5 stars", 4: "4+ stars", 3: "3+ stars" },
  };
  Object.entries(activeFilters).forEach(([type, val]) => {
    if (type === "price") {
      const chip = makeChip(
        `$${val.min} – $${val.max === Infinity ? "∞" : val.max}`,
        () => {
          delete activeFilters.price;
          document.getElementById("priceMin").value = "";
          document.getElementById("priceMax").value = "";
          renderChips();
          filterCards();
        },
      );
      container.appendChild(chip);
    } else {
      const label = labels[type]?.[val] || val;
      const chip = makeChip(label, () => {
        delete activeFilters[type];
        document
          .querySelectorAll(`[data-filter="${type}"]`)
          .forEach((b) => b.classList.remove("active"));
        if (type === "cat") {
          document
            .querySelector('[data-filter="cat"][data-value="all"]')
            .classList.add("active");
        }
        renderChips();
        filterCards();
      });
      container.appendChild(chip);
    }
  });
}

function makeChip(label, removeFn) {
  const chip = document.createElement("span");
  chip.className = "filter-chip";
  chip.innerHTML = `${label}<button class="chip-remove" title="Remove">×</button>`;
  chip.querySelector(".chip-remove").addEventListener("click", removeFn);
  return chip;
}

function clearAllFilters() {
  Object.keys(activeFilters).forEach((k) => delete activeFilters[k]);
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelector('[data-filter="cat"][data-value="all"]')
    .classList.add("active");
  document.getElementById("priceMin").value = "";
  document.getElementById("priceMax").value = "";
  document.getElementById("sortSelect").value = "featured";
  renderChips();
  filterCards();
}

// View toggle
function setView(mode) {
  const grid = document.getElementById("productsGrid");
  document
    .getElementById("gridBtn")
    .classList.toggle("active", mode === "grid");
  document
    .getElementById("listBtn")
    .classList.toggle("active", mode === "list");
  grid.classList.toggle("two-col", mode === "list");
}

// Wishlist on cards
function toggleCardWishlist(btn) {
  btn.classList.toggle("active");
  const icon = btn.querySelector("i");
  icon.className = btn.classList.contains("active")
    ? "ri-heart-fill"
    : "ri-heart-line";
}

// Mobile sidebar
function openSidebar() {
  document.getElementById("shopSidebar").classList.add("open");
  document.getElementById("sidebarOverlay").classList.add("open");
  document.getElementById("closeSidebarBtn").style.display = "flex";
}

function closeSidebar() {
  document.getElementById("shopSidebar").classList.remove("open");
  document.getElementById("sidebarOverlay").classList.remove("open");
}

// Read URL params on load (so nav dropdown links like ?cat=ceramics work)
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("cat");
  if (cat) {
    const btn = document.querySelector(
      `[data-filter="cat"][data-value="${cat}"]`,
    );
    if (btn) applyFilter("cat", cat, btn);
  }
});

// Search box — filter cards by name
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase().trim();
    document.querySelectorAll("#productsGrid .product-card").forEach((card) => {
      const name =
        card.querySelector(".product-name")?.textContent.toLowerCase() || "";
      card.style.display = !q || name.includes(q) ? "" : "none";
    });
  });
  searchInput.addEventListener("focus", () =>
    searchInput.closest(".search-container")?.classList.add("active"),
  );
  document.addEventListener("click", (e) => {
    if (!searchInput.closest(".search-container")?.contains(e.target)) {
      searchInput.closest(".search-container")?.classList.remove("active");
    }
  });
}
