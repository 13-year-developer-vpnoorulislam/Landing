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

// Podcast Announcement Section: Dynamic Content Injection
// Assumes podcastData.js is loaded before this script
(function() {
  // Check if podcastData is available
  if (typeof podcastData !== 'undefined') {
    var section = document.getElementById('podcast-section');
    if (section) {
      var title = section.querySelector('.podcast-title');
      var desc = section.querySelector('.podcast-description');
      var cta = section.querySelector('.podcast-cta');
      if (title) title.textContent = podcastData.title;
      if (desc) desc.textContent = podcastData.description;
      if (cta) {
        cta.textContent = podcastData.ctaText;
        cta.href = podcastData.ctaUrl;
      }
    }
  }
})();