document.addEventListener('DOMContentLoaded', () => {
  init404Page();
});

function init404Page() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  const searchForm = document.getElementById('errorSearchForm');
  const searchInput = document.getElementById('errorSearchInput');

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
      } else {
        window.location.href = 'products.html';
      }
    });
  }

  const mascotBox = document.getElementById('errorMascotBox');
  if (mascotBox) {
    mascotBox.addEventListener('click', () => {
      mascotBox.classList.remove('wobble');
      void mascotBox.offsetWidth;
      mascotBox.classList.add('wobble');
      spawnPawParticles(mascotBox);
    });
  }
}

function spawnPawParticles(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const offsets = [
    { x: -14, y: -10 },
    { x: 12, y: -16 },
    { x: 0, y: -24 }
  ];

  offsets.forEach((offset, idx) => {
    setTimeout(() => {
      const particle = document.createElement('div');
      particle.className = 'floating-paw-particle';
      particle.innerHTML = '<i class="fas fa-paw"></i>';
      particle.style.left = `${centerX + offset.x}px`;
      particle.style.top = `${centerY + offset.y}px`;
      document.body.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 900);
    }, idx * 100);
  });
}