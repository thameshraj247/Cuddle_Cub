document.addEventListener('DOMContentLoaded', () => {
  initProductsFilter();
  initProductClothingRail();
});

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

function initProductClothingRail() {
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
}
