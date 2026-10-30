if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm);
} else {
  initContactForm();
}

function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', handleContactSubmit);
  }
}

function handleContactSubmit(e) {
  if (e && e.preventDefault) {
    e.preventDefault();
  }

  const form = document.querySelector('#contact-form');
  const successMsg = document.querySelector('#contact-success-msg');
  const name = form ? (form.querySelector('[name="name"]')?.value || 'Guest') : 'Guest';

  if (typeof showToast === 'function') {
    showToast(`Thank you, ${name}! Your inquiry has been sent to Cuddle Cub Concierge.`);
  }

  if (successMsg) {
    successMsg.innerHTML = `<i class="fas fa-check-circle"></i> Thank you, ${name}! Your message has been sent successfully. We will reply within 24 hours.`;
    successMsg.classList.add('show');
    successMsg.style.display = 'flex';
    setTimeout(() => {
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
  }

  if (form) {
    form.reset();
  }

  return false;
}

window.handleContactSubmit = handleContactSubmit;

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
