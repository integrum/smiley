Smiley = window.Smiley = (options={}) ->
  {images, width, height, mood, imagesDiv, markerDiv, date
  markerRawHeight, markerRawWidth, smileRawHeight, smileRawWidth} = options

  degree = 0
  padding = 20
  markerRawWidth ||= 47
  markerRawHeight ||= 47

  smileRawWidth ||= 183
  smileRawHeight ||= 192

  markerRatioWidth = markerRawWidth/smileRawWidth
  markerRatioHeight = markerRawHeight/smileRawHeight

  smileRatioWidth = smileRawWidth  / (markerRawWidth * 2 + smileRawWidth)
  smileRatioHeight = smileRawHeight  / (markerRawHeight * 2 + smileRawHeight)
  

  width    ||= 100 #183 + (47*2)
  height   ||= 100 #192 + (47*2)

  smileWidth = width * smileRatioWidth
  smileHeight = height * smileRatioHeight
  
  markerWidth = smileWidth * markerRatioWidth
  markerHeight = smileHeight * markerRatioWidth

  markerScaleWidth = markerWidth / markerRawWidth
  markerScaleHeight = markerHeight / markerRawHeight


  smileOffsetLeft = (width - smileWidth) / 2
  smileOffsetTop = (height - smileHeight) / 2

  images   ||= []
  mood     ||= 0
  markerIndex = 0
  markerImages = []
  markerImageEls = []
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

  false and canvas = $ """
    <canvas 
      width="#{width}"
      height="#{height}"
      style="position:absolute;top:0;left:0;">
    </canvas>
  """
  canvas = $("#canvas")
  canvas.attr "width", width
  canvas.attr "height", height
  

  canvasEl = canvas[0]
  if not canvasEl.getContext  
    G_vmlCanvasManager.initElement(canvasEl)

  ctx = canvasEl.getContext '2d'
  ctx.translate width/2, height/2
  ctx.save()

  ctx.fillStyle = "rgb(200,0,0)"
  ctx.fillRect 0, 0, 100, 100

    
  loadedMarkers = 0
  markerLength = 0
  currentMarkerImage = null

  initializeMarkers = () ->
    currentMarkerImage = markerImageEls[0]
    renderMarkerImage()

  self.useMarkerImagesFromDiv = (div) ->
    markerImages = []
    markerLength = $(div).find('img').length
    $(div).find('img').each () ->
      src = $(this).attr('src')
      markerImages.push src 
      #markerImageEls.push this
      markerEl = new Image()
      markerImageEls.push markerEl
      markerEl.onload = () ->
        loadedMarkers += 1
        if loadedMarkers == markerLength
          initializeMarkers()
      markerEl.src = src

  renderMarkerImage = () ->
    if currentMarkerImage
      ctx.clearRect(-width/2,-height/2,width,height)
      ctx.save()
      radians = degree * 0.0174532925
      ctx.scale(markerScaleWidth, markerScaleHeight)
      ctx.rotate(radians)
      markerX =  (-markerWidth/2) / markerScaleWidth
      markerY =  (- (smileHeight / 2) - markerHeight) / markerScaleHeight

      ctx.drawImage currentMarkerImage, markerX, markerY
      ctx.restore()


  if imagesDiv
    self.useImagesFromDiv imagesDiv

  if markerDiv
    self.useMarkerImagesFromDiv markerDiv


  #ctx.drawImage markerImageEls[0], 0, 0, markerHeight, markerWidth
  

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
    renderMarkerImage()
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
