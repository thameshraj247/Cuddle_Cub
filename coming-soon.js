document.addEventListener('DOMContentLoaded', () => {
  initComingSoonPage();
});

function initComingSoonPage() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  initNotifyForm();
  initSubtleInteractiveMotion();
}

function initNotifyForm() {
  const form = document.getElementById('csNotifyForm');
  const emailInput = document.getElementById('csEmailInput');
  const successMsg = document.getElementById('csSuccessMsg');

  if (!form || !emailInput) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email) return;

    if (successMsg) {
      successMsg.classList.add('show');
    }

    if (typeof showToast === 'function') {
      showToast(`Welcome to the VIP Cradle List! 20% launch code sent to ${email}`);
    }

    spawnCelebrationParticles(form);
    form.reset();
  });
}

function spawnCelebrationParticles(container) {
  const rect = container.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const icons = ['fa-leaf', 'fa-sparkles', 'fa-heart', 'fa-paw'];

  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      particle.className = 'floating-paw-particle';
      const iconClass = icons[i % icons.length];
      particle.innerHTML = `<i class="fas ${iconClass}"></i>`;

      const angle = (Math.PI * 2 * i) / 6;
      const radius = 25;
      const posX = centerX + Math.cos(angle) * radius;
      const posY = centerY + Math.sin(angle) * radius;

      particle.style.left = `${posX}px`;
      particle.style.top = `${posY}px`;

      document.body.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 850);
    }, i * 70);
  }
}

function initSubtleInteractiveMotion() {
  const card = document.querySelector('.cs-center-card');
  if (!card) return;

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 8;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    card.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
}