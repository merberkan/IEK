const btn = document.querySelector(".toggle-darkmode");
const currentTheme = localStorage.getItem("theme");
if (currentTheme == "dark") {
  document.body.classList.add("dark-mode");
}
btn.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  let theme = "light";
  if (document.body.classList.contains("dark-mode")) {
    theme = "dark";
  }
  localStorage.setItem("theme", theme);
});
