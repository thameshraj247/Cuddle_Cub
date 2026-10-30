document.addEventListener('DOMContentLoaded', () => {
  initHeroDressShowcase();
});

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

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showSlide(currentIndex - 1);
      startAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showSlide(currentIndex + 1);
      startAutoPlay();
    });
  }

  showcase.addEventListener('mouseenter', stopAutoPlay);
  showcase.addEventListener('mouseleave', startAutoPlay);

  let touchStartX = 0;
  let touchEndX = 0;

  showcase.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  }, { passive: true });

  showcase.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 40) {
      showSlide(currentIndex + 1);
    } else if (touchEndX > touchStartX + 40) {
      showSlide(currentIndex - 1);
    }
    startAutoPlay();
  }, { passive: true });

  startAutoPlay();
}
