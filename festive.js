document.addEventListener('DOMContentLoaded', () => {
  initFestiveSlider();
});

function initFestiveSlider() {
  const track = document.getElementById('festive-slider-track');
  const prevBtn = document.getElementById('festive-prev-btn');
  const nextBtn = document.getElementById('festive-next-btn');
  const counterEl = document.getElementById('festive-carousel-counter');

  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.product-card');
  const totalCards = cards.length;
  let currentIndex = 0;

  function getVisibleCount() {
    const width = window.innerWidth;
    if (width <= 640) return 1;
    if (width <= 1024) return 2;
    return 4;
  }

  function updateSlider() {
    const visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, totalCards - visibleCount);

    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const firstCard = cards[0];
    if (!firstCard) return;

    const cardRect = firstCard.getBoundingClientRect();
    const trackStyles = window.getComputedStyle(track);
    const gap = parseFloat(trackStyles.gap) || 24;
    const stepWidth = cardRect.width + gap;

    const translateX = -(currentIndex * stepWidth);
    track.style.transform = 'translateX(' + translateX + 'px)';

    prevBtn.disabled = (currentIndex === 0);
    nextBtn.disabled = (currentIndex >= maxIndex);
  }

  prevBtn.addEventListener('click', () => {
    const visibleCount = getVisibleCount();
    currentIndex = Math.max(0, currentIndex - visibleCount);
    updateSlider();
  });

  nextBtn.addEventListener('click', () => {
    const visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, totalCards - visibleCount);
    currentIndex = Math.min(maxIndex, currentIndex + visibleCount);
    updateSlider();
  });

  window.addEventListener('resize', () => {
    updateSlider();
  });

  setTimeout(updateSlider, 120);
}
