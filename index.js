$(function() {
  var smiley;
  smiley = Smiley();
  $(document.body).append(smiley.el);
  return smiley.on("change", function(value) {
    return $("#value").text(value);
  });
});