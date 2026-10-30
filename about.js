document.addEventListener('DOMContentLoaded', () => {
  initAboutPage();
});

function initAboutPage() {
  const cards = document.querySelectorAll('.mission-card, .value-card, .story-block');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach((card) => observer.observe(card));
}
