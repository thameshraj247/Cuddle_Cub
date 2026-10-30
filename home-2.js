

document.addEventListener('DOMContentLoaded', () => {
  initSensoryStudio();
  initScrollRevealCards();
  initSubtleHeroParallax();
  initEverydayFavoritesFilter();
});

function initEverydayFavoritesFilter() {
  const pillBtns = document.querySelectorAll('.fav-pill-btn');
  const cards = document.querySelectorAll('.fav-product-card');
  if (!pillBtns.length || !cards.length) return;

  pillBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-fav-filter');
      pillBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
          card.style.animation = 'heroEditorialFadeUp 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  const wishlistBtns = document.querySelectorAll('.fav-wishlist-btn');
  wishlistBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('active');
      const icon = btn.querySelector('i');
      if (icon) {
        if (btn.classList.contains('active')) {
          icon.classList.remove('far');
          icon.classList.add('fas');
        } else {
          icon.classList.remove('fas');
          icon.classList.add('far');
        }
      }
    });
  });

  const swatches = document.querySelectorAll('.fav-color-swatches');
  swatches.forEach((swatchGroup) => {
    const swatchList = swatchGroup.querySelectorAll('.color-swatch');
    const label = swatchGroup.querySelector('.swatch-label');
    swatchList.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        swatchList.forEach((s) => s.classList.remove('active'));
        swatch.classList.add('active');
        if (label && swatch.getAttribute('title')) {
          label.textContent = swatch.getAttribute('title');
        }
      });
    });
  });
}

function initSubtleHeroParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 992) return;

  const heroSection = document.getElementById('hero-section');
  const heroImg = document.querySelector('.home2-hero-full-img');
  if (!heroSection || !heroImg) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let isHovering = false;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX = x * 18;
    mouseY = y * 14;
    isHovering = true;
  });

  heroSection.addEventListener('mouseleave', () => {
    mouseX = 0;
    mouseY = 0;
    isHovering = false;
  });

  function updateParallax() {
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    heroImg.style.translate = `${currentX.toFixed(2)}px ${currentY.toFixed(2)}px`;

    requestAnimationFrame(updateParallax);
  }
  requestAnimationFrame(updateParallax);
}

function initScrollRevealCards() {
  const cards = document.querySelectorAll('.philosophy-card');
  if (!cards.length) return;

  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const delay = parseInt(card.getAttribute('data-reveal-delay') || '0', 10);

        setTimeout(() => {
          card.classList.add('revealed');
        }, delay);

        obs.unobserve(card);
      }
    });
  }, observerOptions);

  cards.forEach((card) => observer.observe(card));
}



function initSensoryStudio() {
  const tabBtns = document.querySelectorAll('.sensory-tab-btn');
  const stageImg = document.getElementById('sensory-stage-img');
  const stageTitle = document.getElementById('sensory-stage-title');
  const stageDesc = document.getElementById('sensory-stage-desc');

  if (!tabBtns.length || !stageImg || !stageTitle || !stageDesc) return;

  const sensoryData = {
    bamboo: {
      title: 'Thermal-Regulating Organic Bamboo',
      desc: 'Silky micro-pores maintain ideal 68°F infant body temperature throughout dreamland, naturally resisting odor and moisture.',
      image: 'cta-newborn-sleep.jpg'
    },
    waffle: {
      title: 'Textured Waffle Weave Cotton',
      desc: 'Honeycomb cellular architecture traps comforting warmth without weight, offering soothing tactile feedback for exploring tiny hands.',
      image: 'festive-dress-3.jpg'
    },
    linen: {
      title: 'Heirloom Pre-Washed Belgian Linen',
      desc: 'Softened with pure rainwater, our breathable linen grows softer with every wash—pure, effortless elegance for celebration milestones.',
      image: 'prod-cream-dress.jpg'
    },
    knit: {
      title: 'Superfine Merino & Cotton Knit',
      desc: 'Ultra-gentle against reactive baby cheeks, knitted seamlessly with non-scratchy borders for timeless, snug heirloom snuggles.',
      image: 'festive-dress-9.jpg'
    }
  };

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabKey = btn.getAttribute('data-sensory');
      if (!sensoryData[tabKey]) return;

      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      stageImg.style.opacity = '0';
      stageImg.style.transform = 'scale(1.05)';

      setTimeout(() => {
        stageImg.src = sensoryData[tabKey].image;
        stageTitle.textContent = sensoryData[tabKey].title;
        stageDesc.textContent = sensoryData[tabKey].desc;

        stageImg.style.opacity = '1';
        stageImg.style.transform = 'scale(1)';
      }, 250);
    });
  });
}

(function initHome2InteractiveExperience() {
  const loader = document.getElementById('atelierLoader');
  if (!loader) return;

  function openCurtains() {
    if (loader.classList.contains('loaded')) return;
    loader.classList.add('loaded');
  }

  window.addEventListener('load', () => {
    setTimeout(openCurtains, 950);
  });

  setTimeout(() => {
    openCurtains();
  }, 2000);

  loader.addEventListener('click', () => {
    openCurtains();
  });
})();