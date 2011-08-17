Smiley = window.Smiley = (options={}) ->
  {images, width, height, mood, imagesDiv, markerDiv, date} = options
  width    ||= 183 + (47*2)
  height   ||= 192 + (47*2)
  markerRatioWidth = 47/183
  markerRatioHeight = 47/192

  smileRatioWidth = 183  / (47 * 2 + 183)
  smileRatioHeight = 192  / (47 * 2 + 192)

  smileWidth = width * smileRatioWidth
  smileHeight = height * smileRatioHeight

  smileOffsetLeft = (width - smileWidth) / 2
  smileOffsetTop = (height - smileHeight) / 2

  images   ||= []
  mood     ||= 0
  markerIndex = 0
  markerImages = []
  date     ||= new Date()
  year  = date.getUTCFullYear()
  month = "0#{date.getUTCMonth() + 1}".slice(-2)
  day   = "0#{date.getUTCDate()}".slice(-2)
  formattedDate = "#{year}-#{month}-#{day}"

  imagesDiv ||= '#smiley-images'
  markerDiv ||= "#marker-images"



  self = {}

  el = $ """
    <div class="smiley" id="smiley-#{formattedDate}" style="position: relative; width: #{width}px; height: #{height}px; border: 1px solid black">
    </div>
  """

  self.el = el
  moving = false

  self.useImagesFromDiv = (div) ->
    images = []
    $(div).find('img').each () ->
      images.push $(this).attr('src')

    
    el.append $ """
      <img style="position: absolute; left: #{smileOffsetLeft}px; top:#{smileOffsetTop}px; width:#{smileWidth}px; height#{smileHeight}px" src="#{images[0]}" />
    """

  self.useMarkerImagesFromDiv = (div) ->
    markerImages = []
    $(div).find('img').each () ->
      markerImages.push $(this).attr('src')


  if imagesDiv
    self.useImagesFromDiv imagesDiv

  if markerDiv
    self.useMarkerImagesFromDiv markerDiv
  canvas = $ '<canvas style="position:absolute;top:0;left:0;" width="#{width}" height="#{height}"></canvas>'
  canvasEl = canvas[0]
  ctx = canvasEl.getContext '2d'

  ctx.translate width/2, height/2

  ctx.fillStyle = "rgb(200,0,0)"
  ctx.fillRect 10,10, 55, 50

  el.append canvas

  self.on = (args...) ->
    events.on self, args...
  self.emit = (args...) ->
    events.emit self, args...
  self.removeListener = (args...) ->
    events.removeListener self, args...
  emit = self.emit

 


  calcDegree = (pageX, pageY) ->
    if moving == false then return

    x = pageX - el.offset().left - (width/2)
    y = pageY - el.offset().top + (height/2)
    y = height - y

    degree = Math.atan(y/x) / (Math.PI / 180)

    if x < 0 and y > 0
      degree = degree + 180
    else if x < 0 and y < 0
      degree = degree + 180
    else if x > 0 and y < 0
      degree = degree + 360

    #offset the degree for the smiley
    # turn it into a clock
    degree = ( 360 - degree ) + 90

    if degree < 0
      degree = 360 - degree
    if degree > 360
      degree = degree - 360

    mood = parseInt(images.length * degree/360)
    #markerIndex = parseInt(markerImages.length * deg)
    render()
    emit "change", mood

  self.getMood = () -> mood
  setMood = (_index) ->
    mood = _index
    render()
  self.setMood = setMood

  render = () ->
    el.find("img").attr "src", images[mood + 0]

  self.render = render

  el.bind "mousedown", (e) ->
    e.preventDefault()
    moving = true
    calcDegree e.pageX, e.pageY

  el.bind "mousemove", (e) ->
    calcDegree e.pageX, e.pageY

  el.bind "mouseup", (e) ->
    moving = false
  render()

  self
