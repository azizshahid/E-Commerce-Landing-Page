// Cart State
let cart = [];

// Add to Cart Function
function addToCart(name, price, image) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }

  updateCart();
  toggleCart();
}

// Remove from Cart Function
function removeFromCart(name) {
  cart = cart.filter((item) => item.name !== name);
  updateCart();
}

// Update Cart Display
function updateCart() {
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartFooter = document.getElementById("cartFooter");

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    cartFooter.style.display = "none";
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${
          item.name
        }" class="cart-item-image">
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(
                              2
                            )} × ${item.quantity}</div>
                            <button class="remove-item" onclick="removeFromCart('${
                              item.name
                            }')">Remove</button>
                        </div>
                    </div>
                `
      )
      .join("");

    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    cartFooter.style.display = "block";
  }
}

// Toggle Cart Modal
function toggleCart() {
  const cartModal = document.getElementById("cartModal");
  cartModal.classList.toggle("active");
}

// Toggle FAQ
function toggleFAQ(button) {
  const faqItem = button.parentElement;
  const isActive = faqItem.classList.contains("active");

  // Close all FAQs
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Open clicked FAQ if it wasn't active
  if (!isActive) {
    faqItem.classList.add("active");
  }
}

// Close cart when clicking outside
document.addEventListener("click", function (event) {
  const cartModal = document.getElementById("cartModal");
  const cartIcon = document.querySelector(".cart-icon");

  if (
    !cartModal.contains(event.target) &&
    !cartIcon.contains(event.target) &&
    cartModal.classList.contains("active")
  ) {
    toggleCart();
  }
});

// Function to add items to cart (placeholder)
//function addToCart(name, price, image) {
//console.log(`Added to cart: ${name} - $${price}`);
// In a real app, you would add logic here to update cart
//}

// Initialize scroll reveal when DOM is fully loaded

document.addEventListener("DOMContentLoaded", () => {
  // Define placeholder addToCart function to prevent errors
  window.addToCart = (name, price, image) => {
    console.log(`Added to cart: ${name} - $${price}`);
    alert(`Added ${name} to cart!`);
  };

  const reveals = document.querySelectorAll(".product-card, .testimonial");

  if (reveals.length === 0) {
    console.warn("No elements found for scroll reveal");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  reveals.forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });
});

document.querySelectorAll('.nav-item > .nav-link').forEach(link => {
  link.addEventListener('click', e => {
    const parent = link.parentElement;

    document.querySelectorAll('.nav-item.open').forEach(item => {
      if (item !== parent) item.classList.remove('open');
    });

    if (parent.querySelector('.dropdown')) {
      e.preventDefault();
      parent.classList.toggle('open');
    }
  });
});

document.addEventListener('click', e => {
  if (!e.target.closest('.nav-item')) {
    document.querySelectorAll('.nav-item.open').forEach(item =>
      item.classList.remove('open')
    );
  }
});

//   Search Bar Function

const searchContainer = document.querySelector('.search-container');
const searchInput = document.querySelector('.search-input');

// Expand on focus or click
searchInput.addEventListener('focus', () => {
  searchContainer.classList.add('active');
});

// Collapse on outside click
document.addEventListener('click', e => {
  if (!searchContainer.contains(e.target)) {
    searchContainer.classList.remove('active');
    searchInput.blur();
  }
});

// Collapse on ESC
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    searchContainer.classList.remove('active');
    searchInput.blur();
  }
});

// Product Card Scroll

const carousel = document.getElementById('bestSellerCarousel');
const track = carousel.querySelector('.carousel-track');
const cards = Array.from(track.children);

const CLONE_COUNT = 3;

/* ===== CLONE CARDS ===== */

// Clone last → prepend
cards.slice(-CLONE_COUNT).forEach(card => {
  const clone = card.cloneNode(true);
  clone.classList.add('clone');
  track.prepend(clone);
});

// Clone first → append
cards.slice(0, CLONE_COUNT).forEach(card => {
  const clone = card.cloneNode(true);
  clone.classList.add('clone');
  track.append(clone);
});

/* ===== INITIAL OFFSET ===== */

requestAnimationFrame(() => {
  const cardWidth = cards[0].offsetWidth;
  carousel.scrollLeft = cardWidth * CLONE_COUNT;
});

/* ===== INFINITE LOOP (NO JUMP) ===== */

carousel.addEventListener('scroll', () => {
  const cardWidth = cards[0].offsetWidth;
  const maxScroll = track.scrollWidth - carousel.clientWidth;

  // Jump to end (left boundary)
  if (carousel.scrollLeft <= cardWidth) {
    carousel.scrollLeft =
      maxScroll - cardWidth * CLONE_COUNT;
  }

  // Jump to start (right boundary)
  if (carousel.scrollLeft >= maxScroll - cardWidth) {
    carousel.scrollLeft =
      cardWidth * CLONE_COUNT;
  }
});

/* ===== WHEEL → HORIZONTAL SCROLL ===== */

let velocity = 0;
let isAnimating = false;

function animateScroll() {
  if (Math.abs(velocity) < 0.1) {
    isAnimating = false;
    velocity = 0;
    return;
  }

  carousel.scrollLeft += velocity;
  velocity *= 0.92; // friction (lower = smoother, higher = snappier)

  requestAnimationFrame(animateScroll);
}

carousel.addEventListener(
  'wheel',
  e => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();

      velocity += e.deltaY * 0.15; // sensitivity

      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(animateScroll);
      }
    }
  },
  { passive: false }
);




// Init
//startAutoScroll();





