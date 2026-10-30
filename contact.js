document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]')?.value || 'Guest';
      showToast(`Thank you, ${name}! Your inquiry has been sent to Cuddle Cub Concierge.`);
      form.reset();
    });
  }
}

function toggleFaq(card) {
  if (!card) return;
  const wasActive = card.classList.contains('active');

  const parentGrid = card.closest('.faq-accordion-grid');
  if (parentGrid) {
    parentGrid.querySelectorAll('.faq-card').forEach((c) => {
      if (c !== card) c.classList.remove('active');
    });
  }

  if (wasActive) {
    card.classList.remove('active');
  } else {
    card.classList.add('active');
  }
}

window.toggleFaq = toggleFaq;
