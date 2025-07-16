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