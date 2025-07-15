const menu = document.getElementById('menu');
const navbar = document.getElementsByClassName('nav_items')[0]
let isOpen = false;
menu.addEventListener('click', ()=>{
    if(isOpen){
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

// --- Podcasts page interactivity ---
// Play button interactivity: swap central video on click
if (document.querySelectorAll('.podcast-card .play-btn').length) {
  document.querySelectorAll('.podcast-card .play-btn').forEach(function(btn, idx) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const titles = [
        'Episode 1: Understanding Trauma',
        'Episode 2: Building Resilience',
        'Episode 3: Multilingual Support'
      ];
      const descs = [
        'An introduction to trauma, its effects, and the first steps toward healing. Featuring expert advice and real-life stories.',
        'Explore practical strategies for building resilience in families and individuals. Includes actionable tips and inspiring interviews.',
        'How language and culture shape the healing process. Insights from multilingual therapists and clients.'
      ];
      const videos = [
        'https://www.youtube.com/embed/5qap5aO4i9A',
        'https://www.youtube.com/embed/2Vv-BfVoq4g',
        'https://www.youtube.com/embed/3JZ_D3ELwOQ'
      ];
      document.querySelector('.central-video-title').textContent = titles[idx];
      document.querySelector('.central-video-desc').textContent = descs[idx];
      // Replace central video player content with an iframe
      const player = document.querySelector('.central-video-player');
      player.innerHTML = `<iframe width="100%" height="100%" src="${videos[idx]}" frameborder="0" allowfullscreen></iframe>`;
      window.scrollTo({ top: document.querySelector('.central-video-section').offsetTop - 80, behavior: 'smooth' });
    });
  });
}

// Slide-in animation stagger
window.addEventListener('DOMContentLoaded', function() {
  const slideEls = document.querySelectorAll('.slide-in');
  slideEls.forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      el.classList.add('animated');
    }, 200 + i * 200);
  });
});