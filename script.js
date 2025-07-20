const menu = document.getElementById("menu");
const navbar = document.getElementsByClassName("nav_items")[0];
let isOpen = false;
menu.addEventListener("click", () => {
  if (isOpen) {
    menu.innerHTML = '<i class="fa-sharp fa-solid fa-bars"></i>';
    navbar.style.width = "0px";
    navbar.style.paddingRight = "0px";
    isOpen = false;
  } else {
    menu.innerHTML = '<i class="fa fa-close"></i>';
    navbar.style.width = "auto";
    navbar.style.paddingRight = "25px";
    isOpen = true;
  }
});

// === Podcast Carousel Logic ===
(function() {
  const track = document.querySelector('.podcast-carousel-track');
  const slides = Array.from(track.children);
  const leftArrow = document.querySelector('.carousel-arrow-left');
  const rightArrow = document.querySelector('.carousel-arrow-right');
  const indicators = document.querySelectorAll('.carousel-indicator');
  let currentIndex = 0;
  let autoSwitchInterval = null;
  let autoSwitchTimeout = null;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    indicators.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }

  function startAutoSwitch() {
    if (autoSwitchInterval) clearInterval(autoSwitchInterval);
    autoSwitchInterval = setInterval(nextSlide, 5000);
  }

  function pauseAutoSwitch() {
    if (autoSwitchInterval) clearInterval(autoSwitchInterval);
    if (autoSwitchTimeout) clearTimeout(autoSwitchTimeout);
    autoSwitchTimeout = setTimeout(startAutoSwitch, 8000); // resume after 8s
  }

  leftArrow.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
    pauseAutoSwitch();
  });
  rightArrow.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
    pauseAutoSwitch();
  });
  indicators.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      currentIndex = idx;
      updateCarousel();
      pauseAutoSwitch();
    });
  });

  // Optional: swipe support for mobile
  let startX = null;
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  track.addEventListener('touchend', (e) => {
    if (startX === null) return;
    let endX = e.changedTouches[0].clientX;
    if (endX - startX > 50) {
      // swipe right
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
      pauseAutoSwitch();
    } else if (startX - endX > 50) {
      // swipe left
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
      pauseAutoSwitch();
    }
    startX = null;
  });

  // Initialize
  updateCarousel();
  startAutoSwitch();
})();

// === Dynamic Podcast List Rendering ===
(function() {
  // Only run on podcasts.html
  if (!window.location.pathname.endsWith('podcasts.html')) return;

  // Where to inject: try to find the carousel track, else fallback to a new section
  const carouselTrack = document.querySelector('.podcast-carousel-track');
  let injectTarget = carouselTrack;
  if (!injectTarget) {
    // fallback: create a new section at the end of .podcast-section
    const section = document.querySelector('.podcast-section');
    injectTarget = document.createElement('div');
    injectTarget.className = 'podcast-list-dynamic';
    section.appendChild(injectTarget);
  }

  fetch('podcasts.json')
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(data => {
      if (!data.podcasts || !Array.isArray(data.podcasts) || data.podcasts.length === 0) {
        injectTarget.innerHTML = '<div class="no-podcasts">No podcasts available.</div>';
        return;
      }
      // Clear any existing content (if carousel, keep structure)
      if (injectTarget.classList.contains('podcast-carousel-track')) {
        injectTarget.innerHTML = '';
      }
      data.podcasts.forEach(podcast => {
        // Create card
        const card = document.createElement('div');
        card.className = 'podcast-card';
        // Image
        const imgDiv = document.createElement('div');
        imgDiv.className = 'podcast-card-image';
        const img = document.createElement('img');
        img.src = podcast.imageUrl || 'assets/img/img1.png';
        img.alt = podcast.title || 'Podcast Episode';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        imgDiv.appendChild(img);
        // Tag
        if (podcast.tag) {
          const tag = document.createElement('span');
          tag.className = 'podcast-card-tag';
          tag.textContent = podcast.tag;
          imgDiv.appendChild(tag);
        }
        // Play button
        const playBtn = document.createElement('button');
        playBtn.className = 'podcast-card-play';
        playBtn.setAttribute('aria-label', 'Play podcast');
        playBtn.innerHTML = '<i class="fa fa-play"></i>';
        if (podcast.videoUrl) {
          playBtn.onclick = () => window.open(podcast.videoUrl, '_blank');
        }
        imgDiv.appendChild(playBtn);
        card.appendChild(imgDiv);
        // Content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'podcast-card-content';
        // Meta
        const metaDiv = document.createElement('div');
        metaDiv.className = 'podcast-card-meta';
        if (podcast.duration) {
          const duration = document.createElement('span');
          duration.innerHTML = '<i class="fa fa-clock"></i> ' + podcast.duration;
          metaDiv.appendChild(duration);
        }
        if (podcast.releaseDate) {
          const date = document.createElement('span');
          date.innerHTML = '<i class="fa fa-calendar"></i> ' + podcast.releaseDate;
          metaDiv.appendChild(date);
        }
        contentDiv.appendChild(metaDiv);
        // Title
        const titleDiv = document.createElement('div');
        titleDiv.className = 'podcast-card-title';
        titleDiv.textContent = podcast.title || 'Untitled Podcast';
        contentDiv.appendChild(titleDiv);
        // Description
        const descDiv = document.createElement('div');
        descDiv.className = 'podcast-card-desc';
        descDiv.textContent = podcast.description || '';
        contentDiv.appendChild(descDiv);
        card.appendChild(contentDiv);
        injectTarget.appendChild(card);
      });
    })
    .catch(err => {
      injectTarget.innerHTML = '<div class="no-podcasts">No podcasts available.</div>';
    });
})();

// === Dynamic Featured Episode Rendering ===
(function() {
  if (!window.location.pathname.endsWith('podcasts.html')) return;

  const featuredCard = document.querySelector('.featured-episode-modern-card');
  if (!featuredCard) return;

  fetch('podcasts.json')
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => {
      if (!data.podcasts || !Array.isArray(data.podcasts) || data.podcasts.length === 0) {
        featuredCard.innerHTML = '<div class="no-podcasts">No featured episode available.</div>';
        return;
      }
      const podcast = data.podcasts[0];
      // Update image
      const img = featuredCard.querySelector('.featured-episode-modern-img');
      if (img) {
        img.src = podcast.imageUrl || 'assets/img/img1.png';
        img.alt = podcast.title || 'Podcast Episode';
      }
      // Update tag
      const tag = featuredCard.querySelector('.tag');
      if (tag) tag.textContent = podcast.tag || '';
      // Update meta
      const meta = featuredCard.querySelector('.featured-episode-modern-meta');
      if (meta) {
        meta.innerHTML = '';
        if (podcast.tag) {
          const tagSpan = document.createElement('span');
          tagSpan.className = 'tag';
          tagSpan.textContent = podcast.tag;
          meta.appendChild(tagSpan);
        }
        if (podcast.duration) {
          const duration = document.createElement('span');
          duration.innerHTML = '<i class="fa fa-clock"></i> ' + podcast.duration;
          meta.appendChild(duration);
        }
        if (podcast.releaseDate) {
          const date = document.createElement('span');
          date.innerHTML = '<i class="fa fa-calendar"></i> ' + podcast.releaseDate;
          meta.appendChild(date);
        }
      }
      // Update title
      const title = featuredCard.querySelector('.featured-episode-modern-title2');
      if (title) title.textContent = podcast.title || 'Untitled Podcast';
      // Update description
      const desc = featuredCard.querySelector('.featured-episode-modern-desc2');
      if (desc) desc.textContent = podcast.description || '';
      // Update play button
      const playBtn = featuredCard.querySelector('.play-btn, .featured-episode-modern-play');
      if (playBtn && podcast.videoUrl) {
        playBtn.onclick = () => window.open(podcast.videoUrl, '_blank');
      }
    })
    .catch(() => {
      featuredCard.innerHTML = '<div class="no-podcasts">No featured episode available.</div>';
    });
})();

document.addEventListener('DOMContentLoaded', function() {
  // Scroll-triggered animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  // Observe all scroll-triggered elements
  const scrollElements = document.querySelectorAll('.slide-in-on-scroll-left, .slide-in-on-scroll-right');
  scrollElements.forEach(el => {
    observer.observe(el);
  });
});