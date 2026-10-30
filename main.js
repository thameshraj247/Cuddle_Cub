
document.addEventListener('DOMContentLoaded', () => {
  initLuxuryCursor();
  initDirection();
  initTheme();
  initMobileMenu();
  initCart();
  initWishlist();
  initProductsFilter();
  initSizeCalculator();
  initContactForm();
  initHeroDressShowcase();
  initScrollCounters();
});

function initDirection() {
  const dirButtons = document.querySelectorAll('.dir-toggle-btn');
  const savedDir = localStorage.getItem('cuddlecub-dir') || 'ltr';

  applyDirection(savedDir);

  dirButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(newDir);
      localStorage.setItem('cuddlecub-dir', newDir);
    });
  });
}

function applyDirection(dir) {
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');

  const dirButtons = document.querySelectorAll('.dir-toggle-btn');
  dirButtons.forEach(btn => {
    btn.setAttribute('title', dir === 'rtl' ? 'Switch to Left-to-Right (LTR)' : 'Switch to Right-to-Left (RTL)');
    if (dir === 'rtl') {
      btn.classList.add('active-rtl');
    } else {
      btn.classList.remove('active-rtl');
    }
  });
}

function initTheme() {
  const themeTogglePills = document.querySelectorAll('.theme-switch-pill, .theme-toggle-btn');
  const savedTheme = localStorage.getItem('cuddlecub-theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  applyTheme(savedTheme);

  themeTogglePills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('cuddlecub-theme', newTheme);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  
  const indicators = document.querySelectorAll('.theme-icon-indicator');
  const labels = document.querySelectorAll('.theme-mode-text');

  indicators.forEach(ind => {
    if (theme === 'dark') {
      ind.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      ind.innerHTML = '<i class="fas fa-moon"></i>';
    }
  });

  labels.forEach(lbl => {
    lbl.textContent = theme === 'dark' ? 'Dark' : 'Light';
  });

  const oldIcons = document.querySelectorAll('.theme-icon');
  oldIcons.forEach(icon => {
    if (theme === 'dark') {
      icon.className = 'fas fa-sun theme-icon';
    } else {
      icon.className = 'fas fa-moon theme-icon';
    }
  });
}

function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      }
    });
  }
}

let cartItems = JSON.parse(localStorage.getItem('cuddlecub-cart')) || [];

function initCart() {
  const cartToggleBtns = document.querySelectorAll('.cart-toggle-btn');
  const cartOverlay = document.querySelector('.cart-drawer-overlay');
  const cartDrawer = document.querySelector('.cart-drawer');
  const closeCartBtn = document.querySelector('.close-cart-btn');

  function openCart() {
    if (cartOverlay && cartDrawer) {
      cartOverlay.classList.add('active');
      cartDrawer.classList.add('active');
      renderCart();
    }
  }

  function closeCart() {
    if (cartOverlay && cartDrawer) {
      cartOverlay.classList.remove('active');
      cartDrawer.classList.remove('active');
    }
  }

  cartToggleBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
  }));

  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  document.addEventListener('click', (e) => {
    const headerBtn = e.target.closest('.header-login-btn');
    if (headerBtn) {
      if (cartItems.length > 0 && headerBtn.classList.contains('cart-mode')) {
        e.preventDefault();
        openCart();
      }
    }
  });

  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-cart-btn');
    if (addBtn) {
      e.preventDefault();
      const productCard = addBtn.closest('.product-card');
      if (productCard) {
        const id = productCard.dataset.id || Date.now();
        const name = productCard.querySelector('.product-name')?.innerText || 'Cuddle Cub Apparel';
        const priceText = productCard.querySelector('.current-price')?.innerText || '$34.00';
        const price = parseFloat(priceText.replace('$', '')) || 34.00;
        const image = productCard.querySelector('img')?.src || '';
        const size = productCard.querySelector('.product-age-chip')?.innerText || '0-12M';

        addToCart({ id, name, price, image, size });
      }
    }
  });

  updateCartBadges();
  renderCart();
}

function addToCart(product) {
  const existing = cartItems.find(item => item.name === product.name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }
  saveCart();
  updateCartBadges();
  renderCart();
  showToast(`Added "${product.name}" to bag!`);
}

function removeFromCart(index) {
  cartItems.splice(index, 1);
  saveCart();
  updateCartBadges();
  renderCart();
  showToast('Item removed from basket.');
}

function updateItemQuantity(index, delta) {
  if (!cartItems[index]) return;
  cartItems[index].quantity += delta;
  if (cartItems[index].quantity <= 0) {
    cartItems.splice(index, 1);
    showToast('Item removed from basket.');
  }
  saveCart();
  updateCartBadges();
  renderCart();
}

function updateCartBadges() {
  const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  document.querySelectorAll('.cart-count').forEach(badge => {
    badge.innerText = count;
  });

  const headerBtns = document.querySelectorAll('.header-login-btn');
  headerBtns.forEach(btn => {
    if (count > 0) {
      btn.classList.add('cart-mode');
      btn.setAttribute('aria-label', `View Cart (${count} items)`);
      btn.innerHTML = `
        <i class="fas fa-shopping-cart"></i>
        <span>Cart</span>
        <span class="header-cart-badge">${count}</span>
      `;
    } else {
      btn.classList.remove('cart-mode');
      btn.setAttribute('aria-label', 'Shop Now');
      btn.setAttribute('href', 'products.html');
      btn.innerHTML = `
        <i class="fas fa-shopping-bag"></i>
        <span>Shop Now</span>
      `;
    }
  });
}

function saveCart() {
  localStorage.setItem('cuddlecub-cart', JSON.stringify(cartItems));
}

function renderCart() {
  const container = document.querySelector('.cart-items-container');
  const subtotalEl = document.querySelector('.cart-subtotal-val');
  if (!container) return;

  if (cartItems.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-message">
        <i class="fas fa-shopping-bag" style="font-size: 3.2rem; color: var(--color-primary-light); margin-bottom: 1rem; display:block;"></i>
        <p>Your basket is currently empty.</p>
        <a href="products.html" class="btn btn-primary btn-sm" style="margin-top: 1.2rem;">Explore Collection</a>
      </div>
    `;
    if (subtotalEl) subtotalEl.innerText = '$0.00';
    return;
  }

  let total = 0;
  container.innerHTML = cartItems.map((item, index) => {
    const itemTotal = (item.price * item.quantity).toFixed(2);
    total += item.price * item.quantity;
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
        <div class="cart-item-details" style="flex:1;">
          <h4>${item.name}</h4>
          <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom: 0.35rem;">${item.size ? 'Size: ' + item.size : ''}</p>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
            <span style="font-weight:700; color:var(--color-primary); font-family:var(--font-heading); font-size:1.05rem;">$${itemTotal}</span>
            <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#e53e3e; cursor:pointer; font-size:0.82rem; font-weight:600; display:inline-flex; align-items:center; gap:0.3rem;">
              <i class="fas fa-trash-alt"></i> Remove
            </button>
          </div>
          <!-- Quantity Stepper Controls: [-] [Quantity] [+] -->
          <div style="display:flex; align-items:center; justify-content:flex-start;">
            <div class="cart-qty-control">
              <button class="cart-qty-btn" onclick="updateItemQuantity(${index}, -1)" aria-label="Decrease quantity" title="Decrease quantity">
                <i class="fas fa-minus"></i>
              </button>
              <span class="cart-qty-val">${item.quantity}</span>
              <button class="cart-qty-btn" onclick="updateItemQuantity(${index}, 1)" aria-label="Increase quantity" title="Increase quantity">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (subtotalEl) {
    subtotalEl.innerText = `$${total.toFixed(2)}`;
  }
}

function initWishlist() {
  document.addEventListener('click', (e) => {
    const wishBtn = e.target.closest('.product-wishlist-btn');
    if (wishBtn) {
      e.preventDefault();
      wishBtn.classList.toggle('active');
      const icon = wishBtn.querySelector('i');
      if (wishBtn.classList.contains('active')) {
        icon.className = 'fas fa-heart';
        showToast('Saved to your Wishlist');
      } else {
        icon.className = 'far fa-heart';
        showToast('Removed from Wishlist');
      }
    }
  });
}

function initProductsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.products-grid .product-card');
  const searchInput = document.querySelector('#product-search');

  if (!filterBtns.length && !searchInput) return;

  function filterCards() {
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    productCards.forEach(card => {
      const category = card.dataset.category || '';
      const age = card.dataset.age || '';
      const title = card.querySelector('.product-name')?.innerText.toLowerCase() || '';

      const matchesFilter = (activeFilter === 'all') || 
                            (category === activeFilter) || 
                            (age === activeFilter) || 
                            (activeFilter === 'festive' && card.dataset.festive === 'true');

      const matchesSearch = !query || title.includes(query) || category.includes(query) || age.includes(query);

      if (matchesFilter && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }
}

function initSizeCalculator() {
  const calcBtn = document.querySelector('#calc-size-btn');
  const ageSelect = document.querySelector('#calc-age');
  const weightInput = document.querySelector('#calc-weight');
  const heightInput = document.querySelector('#calc-height');
  const resultCard = document.querySelector('#size-result-card');
  const resultDisplay = document.querySelector('#calc-result-size');
  const resultAdvice = document.querySelector('#calc-result-advice');

  if (!calcBtn || !ageSelect) return;

  calcBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const age = ageSelect.value;
    const weight = parseFloat(weightInput?.value) || 0;
    const height = parseFloat(heightInput?.value) || 0;

    let recommended = '6-12 Months (Medium)';
    let tip = 'Generous cut designed with diaper ease and soft flex bands.';

    if (age === 'newborn' || (weight > 0 && weight <= 4)) {
      recommended = 'Newborn (0-3 Months)';
      tip = 'Crafted with fold-over scratch mitts and ultra-soft kimono wrap closure.';
    } else if (age === 'infant' || (weight > 4 && weight <= 8)) {
      recommended = '3-6 Months';
      tip = 'Extra room for kicking and quick-snap bottom for easy changes.';
    } else if (age === 'baby' || (weight > 8 && weight <= 11)) {
      recommended = '6-12 Months';
      tip = 'Non-slip grip knees and stretchable neck opening for crawling babies.';
    } else if (age === 'toddler' || (weight > 11 && weight <= 15)) {
      recommended = '1-2 Years (Toddler)';
      tip = 'Reinforced stitching and relaxed fit for active little explorers.';
    } else if (age === 'preschool' || (weight > 15 && weight <= 20)) {
      recommended = '2-4 Years';
      tip = 'Tailored for self-dressing with gentle elastic waistbands.';
    } else if (age === 'kids') {
      recommended = '4-6 Years';
      tip = 'Comfort stretch fabric suitable for playful school days and parties.';
    }

    if (resultDisplay) resultDisplay.innerText = recommended;
    if (resultAdvice) resultAdvice.innerText = tip;
    if (resultCard) {
      resultCard.style.display = 'flex';
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]')?.value || 'Guest';
      showToast(`Thank you, ${name}! Your message has been sent to Cuddle Cub Concierge.`);
      form.reset();
    });
  }

  const newsletterForm = document.querySelector('#newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Welcome to the Cuddle Cub family! Thank you for subscribing.');
      newsletterForm.reset();
    });
  }
}

function initHeroDressShowcase() {
  const showcase = document.getElementById('heroDressShowcase');
  if (!showcase) return;

  const slides = showcase.querySelectorAll('.dress-slide');
  const prevBtn = showcase.querySelector('.prev-dress');
  const nextBtn = showcase.querySelector('.next-dress');
  if (!slides.length) return;

  let currentIndex = 0;
  let autoTimer = null;

  function showSlide(index) {
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    currentIndex = index;

    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoTimer = setInterval(() => {
      showSlide(currentIndex + 1);
    }, 3200);
  }

  function stopAutoPlay() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showSlide(currentIndex + 1);
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showSlide(currentIndex - 1);
      startAutoPlay();
    });
  }

  showcase.style.transform = 'none';

  startAutoPlay();
}
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="fas fa-check-circle" style="color:var(--color-primary); font-size:1.15rem;"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function handleBuyNow() {
  if (!cartItems || cartItems.length === 0) {
    showToast('Your shopping bag is empty. Please select products first!');
    return;
  }

  const cartOverlay = document.querySelector('.cart-drawer-overlay');
  const cartDrawer = document.querySelector('.cart-drawer');
  if (cartOverlay && cartDrawer) {
    cartOverlay.classList.remove('active');
    cartDrawer.classList.remove('active');
  }

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
  const orderRef = '#CC-' + Math.floor(100000 + Math.random() * 900000);

  let modalOverlay = document.querySelector('#order-success-overlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'order-success-overlay';
    modalOverlay.className = 'order-modal-overlay';
    modalOverlay.innerHTML = `
      <div class="order-modal-card" role="dialog" aria-modal="true" aria-labelledby="order-modal-title">
        <button class="order-modal-close" onclick="closeOrderModal()" aria-label="Close modal">&times;</button>
        <div class="order-modal-icon-wrap">
          <i class="fas fa-check-circle"></i>
        </div>
        <span class="order-modal-badge"><i class="fas fa-sparkles"></i> Order Confirmed</span>
        <h2 class="order-modal-title" id="order-modal-title">Your Order is Placed!</h2>
        <p class="order-modal-desc">
          Thank you for shopping with Cuddle Cub! Your handcrafted, zero-scratch organic baby apparel order has been registered and is now being packaged with love.
        </p>
        <div class="order-modal-summary">
          <div class="order-summary-row">
            <span>Order Reference</span>
            <strong id="order-modal-ref">${orderRef}</strong>
          </div>
          <div class="order-summary-row">
            <span>Items Ordered</span>
            <strong id="order-modal-qty">${totalCount} item${totalCount > 1 ? 's' : ''}</strong>
          </div>
          <div class="order-summary-row">
            <span>Total Paid</span>
            <strong id="order-modal-total" style="color:var(--color-primary); font-size:1.15rem;">$${totalAmount}</strong>
          </div>
          <div class="order-summary-row">
            <span>Estimated Delivery</span>
            <strong>2 - 4 Business Days</strong>
          </div>
        </div>
        <div class="order-modal-actions">
          <button class="btn btn-primary" onclick="closeOrderModal()" style="width: 100%;">
            <i class="fas fa-bag-shopping"></i> Continue Shopping
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeOrderModal();
      }
    });
  } else {
    const refEl = modalOverlay.querySelector('#order-modal-ref');
    const qtyEl = modalOverlay.querySelector('#order-modal-qty');
    const totalEl = modalOverlay.querySelector('#order-modal-total');
    if (refEl) refEl.innerText = orderRef;
    if (qtyEl) qtyEl.innerText = `${totalCount} item${totalCount > 1 ? 's' : ''}`;
    if (totalEl) totalEl.innerText = `$${totalAmount}`;
  }

  setTimeout(() => {
    modalOverlay.classList.add('active');
    triggerPartyPoppers();
  }, 30);

  cartItems = [];
  saveCart();
  updateCartBadges();
  renderCart();

  showToast('Your order is placed successfully!');
}

function closeOrderModal() {
  const modalOverlay = document.querySelector('#order-success-overlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    const pCanvas = document.querySelector('#party-popper-canvas'); if (pCanvas) pCanvas.remove();
  }
}

function triggerPartyPoppers() {
  const existingCanvas = document.querySelector('#party-popper-canvas');
  if (existingCanvas) existingCanvas.remove();
  document.querySelectorAll('.popper-cannon').forEach(el => el.remove());

  const leftPopper = document.createElement('div');
  leftPopper.className = 'popper-cannon popper-left';
  leftPopper.innerHTML = '🎉';
  document.body.appendChild(leftPopper);

  const rightPopper = document.createElement('div');
  rightPopper.className = 'popper-cannon popper-right';
  rightPopper.innerHTML = '🎉';
  document.body.appendChild(rightPopper);

  setTimeout(() => {
    leftPopper.remove();
    rightPopper.remove();
  }, 1200);

  const canvas = document.createElement('canvas');
  canvas.id = 'party-popper-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '3000';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    if (document.body.contains(canvas)) {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
  });

  const colors = [
    '#FFD700', '#FFA500', '#FF4757', '#2ED573', '#1E90FF',
    '#9B59B6', '#1e4635', '#52b788', '#d97736', '#ff9ff3',
    '#00d2d3', '#feca57', '#ff6b6b', '#48dbfb', '#ffffff'
  ];

  const particles = [];
  const particleCountPerSide = 85;

  for (let i = 0; i < particleCountPerSide; i++) {
    const angle = (Math.PI / 180) * (-75 + Math.random() * 50);
    const speed = 14 + Math.random() * 18;
    particles.push({
      x: width * 0.05 + (Math.random() * 40 - 20),
      y: height * 0.78 + (Math.random() * 40 - 20),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      sizeW: 8 + Math.random() * 8,
      sizeH: 5 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      wobble: Math.random() * 10,
      wobbleSpeed: 0.08 + Math.random() * 0.08,
      gravity: 0.38 + Math.random() * 0.12,
      drag: 0.985,
      shape: Math.random() > 0.3 ? 'rect' : (Math.random() > 0.5 ? 'circle' : 'streamer'),
      opacity: 1
    });
  }

  for (let i = 0; i < particleCountPerSide; i++) {
    const angle = (Math.PI / 180) * (-155 + Math.random() * 50);
    const speed = 14 + Math.random() * 18;
    particles.push({
      x: width * 0.95 + (Math.random() * 40 - 20),
      y: height * 0.78 + (Math.random() * 40 - 20),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      sizeW: 8 + Math.random() * 8,
      sizeH: 5 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      wobble: Math.random() * 10,
      wobbleSpeed: 0.08 + Math.random() * 0.08,
      gravity: 0.38 + Math.random() * 0.12,
      drag: 0.985,
      shape: Math.random() > 0.3 ? 'rect' : (Math.random() > 0.5 ? 'circle' : 'streamer'),
      opacity: 1
    });
  }

  let animationFrameId;
  const startTime = Date.now();

  function render() {
    ctx.clearRect(0, 0, width, height);
    const elapsed = Date.now() - startTime;

    let activeCount = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx + Math.sin(p.wobble) * 1.5;
      p.y += p.vy;
      p.vx *= p.drag;
      p.vy += p.gravity;
      p.vy *= p.drag;
      p.rotation += p.rotSpeed;
      p.wobble += p.wobbleSpeed;

      if (elapsed > 2800) {
        p.opacity -= 0.015;
      }

      if (p.y < height + 50 && p.opacity > 0) {
        activeCount++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        const scaleX = Math.cos(p.wobble);

        if (p.shape === 'rect') {
          ctx.fillRect(-p.sizeW / 2 * scaleX, -p.sizeH / 2, p.sizeW * scaleX, p.sizeH);
        } else if (p.shape === 'streamer') {
          ctx.fillRect(-p.sizeW / 3 * scaleX, -p.sizeH * 1.5, (p.sizeW / 1.5) * scaleX, p.sizeH * 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, (p.sizeW / 2) * Math.abs(scaleX), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    if (activeCount > 0 && elapsed < 4500) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
  }

  render();
}

function switchPillStyle(styleClass) {
  const container = document.getElementById('sizeHeroPills');
  if (!container) return;

  container.className = 'size-hero-pills ' + styleClass;
}

function initPillStyle() {
  const container = document.getElementById('sizeHeroPills');
  if (container) {
    container.className = 'size-hero-pills style-floating-cards';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initPillStyle();
});

function initScrollCounters() {
  const counterElements = document.querySelectorAll('.count-up');
  if (!counterElements.length) return;

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counterElements.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  if (isNaN(target)) return;

  const start = parseInt(el.getAttribute('data-start') || '1', 10);
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const formatComma = el.getAttribute('data-format') === 'comma';
  const duration = parseInt(el.getAttribute('data-duration') || '1800', 10);

  let startTime = null;

  function formatNumber(num) {
    if (formatComma) {
      return num.toLocaleString();
    }
    return num.toString();
  }

  el.textContent = prefix + formatNumber(start) + suffix;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.round(start + (target - start) * easeProgress);

    el.textContent = prefix + formatNumber(currentVal) + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = prefix + formatNumber(target) + suffix;

      const card = el.closest('.pledge-hero-card, .aurora-card-inner');
      if (card) {
        const progressBar = card.querySelector('.tracker-progress');
        if (progressBar) {
          progressBar.style.transition = 'width 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
          progressBar.style.width = '62.4%';
        }
      }
    }
  }

  requestAnimationFrame(step);
}

function toggleFaq(card) {
  if (!card) return;
  const wasActive = card.classList.contains('active');

  const parentGrid = card.closest('.faq-accordion-grid');
  if (parentGrid) {
    parentGrid.querySelectorAll('.faq-card').forEach(c => {
      if (c !== card) c.classList.remove('active');
    });
  }

  if (wasActive) {
    card.classList.remove('active');
  } else {
    card.classList.add('active');
  }
}

(function initProductClothingRail() {
  const track = document.getElementById("railHangerTrack");
  if (!track) return;

  const items = Array.from(track.querySelectorAll(".rail-item"));
  if (!items.length) return;

  const inspectorTitle = document.getElementById("inspectorTitle");
  const inspectorDesc = document.getElementById("inspectorDesc");
  const inspectorFeatures = document.getElementById("inspectorFeatures");
  const inspectorBuyBtn = document.getElementById("inspectorBuyBtn");
  const railFlipBtn = document.getElementById("railFlipBtn");
  const prevBtn = document.getElementById("railPrevBtn");
  const nextBtn = document.getElementById("railNextBtn");

  const garmentsData = [
    {
      id: "romper-cloud",
      name: "Organic Cloud Knit Romper",
      desc: "Ultra-soft 100% GOTS organic cotton one-piece with expandable neckline and nickel-free snaps for newborn comfort.",
      price: "$38",
      features: [
        "100% Certified GOTS Organic Cotton",
        "Grow-with-me foldover ankle cuffs",
        "Nickel-free snaps along inner leg gusset"
      ]
    },
    {
      id: "hoodie-bear",
      name: "Snuggle Bear Playsuit",
      desc: "Plush organic brushed fleece with whimsical cub ears and soft ribbing for crawling adventures.",
      price: "$44",
      features: [
        "Ultra-cozy organic brushed French terry",
        "Soft double-lined hood with playful bear ears",
        "Naturally hypoallergenic & soothing on skin"
      ]
    },
    {
      id: "frock-prairie",
      name: "Prairie Heirloom Twirl Frock",
      desc: "Breathable double-gauze linen dress featuring delicate flutter sleeves and hand-embroidered wildflower botanicals.",
      price: "$48",
      features: [
        "Pure double-weave organic cotton muslin",
        "Natural mother-of-pearl back buttons",
        "Non-restrictive twirl silhouette"
      ]
    },
    {
      id: "overalls-sage",
      name: "Sagebrush Explorer Dungarees",
      desc: "Durable organic twill overalls with reinforced double knees and brass buckles built for playground sprints and muddy puddles.",
      price: "$52",
      features: [
        "Heavyweight 280 GSM organic cotton twill",
        "Two-position adjustable shoulder straps",
        "Reinforced knee patches for crawl & climb"
      ]
    },
    {
      id: "kurta-festive",
      name: "Royal Heritage Chanderi Kurta",
      desc: "Lustrous festive kurta tailored in mulberry chanderi, lined with ultra-breathable pure cotton voile slip for zero itch.",
      price: "$64",
      features: [
        "Authentic hand-woven zari embroidery",
        "100% itch-free organic voile inner lining",
        "Relaxed mandarin band collar"
      ]
    }
  ];

  let currentIndex = 0;

  function updateInspector(index) {
    currentIndex = index;
    items.forEach((item, idx) => {
      if (idx === index) {
        item.classList.add("active");
        item.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      } else {
        item.classList.remove("active");
        item.classList.remove("flipped");
      }
    });

    const data = garmentsData[index];
    if (data && inspectorTitle && inspectorDesc && inspectorBuyBtn) {
      inspectorTitle.textContent = data.name;
      inspectorDesc.textContent = data.desc;
      inspectorBuyBtn.textContent = `View In Catalog • ${data.price}`;
      if (inspectorFeatures) {
        inspectorFeatures.innerHTML = data.features
          .map((f) => `<span><i class="fas fa-check-circle"></i> ${f}</span>`)
          .join("");
      }
    }
  }

  items.forEach((item, idx) => {
    item.addEventListener("click", () => {
      if (currentIndex === idx) {
        item.classList.toggle("flipped");
      } else {
        updateInspector(idx);
      }
    });
  });

  if (railFlipBtn) {
    railFlipBtn.addEventListener("click", () => {
      const activeItem = items[currentIndex];
      if (activeItem) {
        activeItem.classList.toggle("flipped");
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const newIdx = (currentIndex - 1 + items.length) % items.length;
      updateInspector(newIdx);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const newIdx = (currentIndex + 1) % items.length;
      updateInspector(newIdx);
    });
  }
})();

function initLuxuryCursor() {
  let dot = document.querySelector('.custom-cursor-dot');
  let ring = document.querySelector('.custom-cursor-ring');

  if (!dot || !ring) {
    dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    dot.setAttribute('aria-hidden', 'true');

    ring = document.createElement('div');
    ring.className = 'custom-cursor-ring';
    ring.setAttribute('aria-hidden', 'true');

    document.body.appendChild(dot);
    document.body.appendChild(ring);
  }

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isMoving) {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      isMoving = true;
    }

    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  window.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    isMoving = false;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('a, button, input, textarea, select, [role="button"], .card, .product-card, .moment-card, .bento-card, .interactive-card, .quick-view-btn, .fav-pill-btn, .sensory-tab-btn, .theme-icon-btn, .dir-toggle-btn');
    if (target) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('a, button, input, textarea, select, [role="button"], .card, .product-card, .moment-card, .bento-card, .interactive-card, .quick-view-btn, .fav-pill-btn, .sensory-tab-btn, .theme-icon-btn, .dir-toggle-btn');
    if (target) {
      document.body.classList.remove('cursor-hover');
    }
  });
}
