$(".change").on("click", function () {
  if ($("body").hasClass("dark")) {
    $("body").removeClass("dark");
    $(".change").text("Kapalı");
  } else {
    $("body").addClass("dark");
    $(".change").text("Açık");
  }
});
