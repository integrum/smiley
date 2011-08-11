$ ->
  smileyer = (options) ->
    {images, width, height} = options
    self = {}
    el = $ """
      <div class="smiley">
        <img style="width:#{width}px; height#{height}px" src="#{images[0]}" />
      </div>
    """
    self.el = el
    moving = false
    calcDegree = (pageX, pageY) ->
      if moving == false then return
      x = pageX - el.offset().left - (width/2)
      y = pageY - el.offset().top + (height/2)
      y = height - y
      degree = Math.atan(y/x)
      degree = degree / (Math.PI / 180)
      if x < 0 and y > 0
        degree = degree + 180
      else if x < 0 and y < 0
        degree = degree + 180
      else if x > 0 and y < 0
        degree = degree + 360
      #offset the degree for the smiley
      # turn it into a clock
      degree = 360 - degree
      degree = degree + 90
      if degree < 0
        degree = 360 - degree
      if degree > 360
        degree = degree - 360
      console.log degree

    el.bind "mousedown", (e) ->
      e.preventDefault()
      calcDegree e.pageX, e.pageY
      moving = true

    el.bind "mousemove", (e) ->
      calcDegree e.pageX, e.pageY

    el.bind "mouseup", (e) ->
      moving = false

      
    self

  smiley = smileyer
    images: [
      'smiley/smiley-00.png'
      'smiley/smiley-01.png'
      'smiley/smiley-02.png'
      'smiley/smiley-03.png'
      'smiley/smiley-04.png'
      'smiley/smiley-05.png'
      'smiley/smiley-06.png'
      'smiley/smiley-07.png'
      'smiley/smiley-08.png'
    ]
    width: 183
    height: 192
  $(document.body).append smiley.el
