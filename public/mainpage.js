window.onload = function () {
  var div = document.getElementById("textsliderjss");
  var slideImage = document.getElementById("slide-image");
  var h1 = document.getElementById("tet");
  var images = ["/images/etkinlik.png", "/images/main.jfif"];
  var text = ["#SeninAilen", "#SeninAilen"];

  var counter = 1;
  div.innerHTML = "";
  slideImage.src = images[0];
  div.innerHTML += `<h1 id="tet" class="tett">${text[0]}<span></span></h1>
  `;
  window.setInterval(changeImages, 10000);

  function changeImages() {
    if (counter === images.length) {
      counter = 0;
    }
    slideImage.src = images[counter];
    div.innerHTML = "";
    div.innerHTML += `<h1 id="tet" class="tett">${text[counter]}<span></span></h1>
    `;
    counter++;
  }
};
