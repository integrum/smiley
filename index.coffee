$ -> 
  smiley = Smiley()
  $(document.body).append smiley.el
  smiley.on "change", (value) ->
    $("#value").text value
