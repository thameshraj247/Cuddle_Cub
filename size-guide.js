document.addEventListener('DOMContentLoaded', () => {
  initSizeCalculator();
  initPillStyle();
});

function initPillStyle() {
  const container = document.getElementById('sizeHeroPills');
  if (container) {
    container.className = 'size-hero-pills style-floating-cards';
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

  if (!calcBtn || !ageSelect || !resultCard) return;

  const sizeAdviceMap = {
    newborn: {
      size: "0 - 3 Months",
      advice: "Cloud-soft wrap cut with expandable scratch cuffs and gentle belly comfort."
    },
    infant: {
      size: "3 - 6 Months",
      advice: "Roomy tummy ease with nickel-free expandable shoulder gussets."
    },
    baby: {
      size: "6 - 12 Months",
      advice: "Generous cut designed with cloth-diaper ease and foldover ankle bands."
    },
    toddler: {
      size: "1 - 2 Years",
      advice: "Reinforced crawl knees and stretch-friendly twill for playground sprints."
    },
    preschool: {
      size: "2 - 4 Years",
      advice: "Relaxed silhouette with flexible elastic waistbands for self-dressing ease."
    },
    kids: {
      size: "4 - 6 Years",
      advice: "Tailored heirloom drape with grow-with-me hems for active explorers."
    }
  };

  calcBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const selectedAge = ageSelect.value || 'baby';
    const recommendation = sizeAdviceMap[selectedAge] || sizeAdviceMap.baby;

    if (resultDisplay) {
      resultDisplay.textContent = recommendation.size;
    }
    if (resultAdvice) {
      resultAdvice.textContent = recommendation.advice;
    }

    resultCard.style.display = 'flex';
    resultCard.style.animation = 'heroEditorialFadeUp 0.4s ease forwards';
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
