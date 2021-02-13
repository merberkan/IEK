const hb = document.querySelector(".header .navbar .navlist .hb");
const mobile = document.querySelector(".header .navbar .navlist ul");
const mobile2 = document.querySelector(".Welcome");
const header = document.querySelector(".header.container");

hb.addEventListener("click", () => {
  hb.classList.toggle("active");
  mobile.classList.toggle("active");
  mobile2.classList.toggle("spanwelcome");
});
document.addEventListener("scroll", () => {
  var sp = window.scrollY;
  if (sp > 250) {
    header.style.backgroundColor = "#2c6d60";
  } else {
    header.style.backgroundColor = "";
  }
});
