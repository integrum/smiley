var Smiley;
var __slice = Array.prototype.slice;
Smiley = window.Smiley = function(options) {
  var calcDegree, canvas, canvasEl, ctx, currentMarkerImage, date, day, degree, el, emit, formattedDate, height, images, imagesDiv, initializeMarkers, loadedMarkers, markerDiv, markerHeight, markerImageEls, markerImages, markerIndex, markerLength, markerRatioHeight, markerRatioWidth, markerRawHeight, markerRawWidth, markerScaleHeight, markerScaleWidth, markerWidth, month, mood, moving, nullMarkerEl, nullMarkerId, padding, render, renderMarkerImage, renderedMarkerOnce, self, setMood, smileHeight, smileOffsetLeft, smileOffsetTop, smileRatioHeight, smileRatioWidth, smileRawHeight, smileRawWidth, smileWidth, useNullMarkerImage, width, year;
  if (options == null) {
    options = {};
  }
  images = options.images, width = options.width, height = options.height, mood = options.mood, imagesDiv = options.imagesDiv, markerDiv = options.markerDiv, date = options.date, markerRawHeight = options.markerRawHeight, markerRawWidth = options.markerRawWidth, smileRawHeight = options.smileRawHeight, smileRawWidth = options.smileRawWidth, padding = options.padding, nullMarkerId = options.nullMarkerId;
  degree = 0;
  padding = 20;
  markerRawWidth || (markerRawWidth = 47);
  markerRawHeight || (markerRawHeight = 47);
  smileRawWidth || (smileRawWidth = 183);
  smileRawHeight || (smileRawHeight = 192);
  markerRatioWidth = markerRawWidth / smileRawWidth;
  markerRatioHeight = markerRawHeight / smileRawHeight;
  smileRatioWidth = smileRawWidth / (markerRawWidth * 2 + smileRawWidth);
  smileRatioHeight = smileRawHeight / (markerRawHeight * 2 + smileRawHeight);
  width || (width = 183 + (47 * 2));
  height || (height = 192 + (47 * 2));
  padding = width * .05;
  width -= padding;
  height -= padding;
  smileWidth = width * smileRatioWidth;
  smileHeight = height * smileRatioHeight;
  markerWidth = smileWidth * markerRatioWidth;
  markerHeight = smileHeight * markerRatioWidth;
  markerScaleWidth = markerWidth / markerRawWidth;
  markerScaleHeight = markerHeight / markerRawHeight;
  width += padding;
  height += padding;
  smileOffsetLeft = (width - smileWidth) / 2;
  smileOffsetTop = (height - smileHeight) / 2;
  images || (images = []);
  mood || (mood = 0);
  markerIndex = 0;
  markerImages = [];
  markerImageEls = [];
  nullMarkerEl = null;
  date || (date = new Date());
  year = date.getUTCFullYear();
  month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
  day = ("0" + (date.getUTCDate())).slice(-2);
  formattedDate = "" + year + "-" + month + "-" + day;
  imagesDiv || (imagesDiv = '#smiley-images');
  markerDiv || (markerDiv = "#marker-images");
  nullMarkerId || (nullMarkerId = "#marker-image-null");
  renderedMarkerOnce = false;
  self = {};
  el = $("<div class=\"smiley\" id=\"smiley-" + formattedDate + "\" style=\"position: relative; width: " + width + "px; height: " + height + "px; border: 1px solid black\">\n</div>");
  self.el = el;
  moving = false;
  self.useImagesFromDiv = function(div) {
    images = [];
    $(div).find('img').each(function() {
      return images.push($(this).attr('src'));
    });
    return el.append($("<img style=\"position: absolute; left: " + smileOffsetLeft + "px; top:" + smileOffsetTop + "px; width:" + smileWidth + "px; height" + smileHeight + "px\" src=\"" + images[0] + "\" />"));
  };
  canvasEl = document.createElement('canvas');
  canvas = $(canvasEl);
  $(document.body).append(canvas);
  canvas.attr("width", width);
  canvas.attr("height", height);
  canvasEl = canvas[0];
  if (!canvasEl.getContext) {
    G_vmlCanvasManager.initElement(canvasEl);
  }
  ctx = canvasEl.getContext('2d');
  ctx.translate(width / 2, height / 2);
  ctx.save();
  loadedMarkers = 0;
  markerLength = 0;
  currentMarkerImage = null;
  initializeMarkers = function() {
    var _oldMood;
    _oldMood = mood;
    return _.eachSeries(markerImages, function(markerimage, index, callback) {
      return setTimeout((function() {
        mood = index;
        renderMarkerImage();
        return callback();
      }), 0);
    }, function() {
      mood = _oldMood;
      renderedMarkerOnce = false;
      return renderMarkerImage();
    });
  };
  self.useMarkerImagesFromDiv = function(div) {
    markerImages = [];
    markerLength = $(div).find('img').length + 1;
    return $(div).find('img').each(function() {
      var markerEl, src;
      src = $(this).attr('src');
      markerImages.push(src);
      markerEl = new Image();
      markerImageEls.push(markerEl);
      markerEl.onload = function() {
        loadedMarkers += 1;
        if (loadedMarkers === markerLength) {
          return initializeMarkers();
        }
      };
      return markerEl.src = src;
    });
  };
  useNullMarkerImage = self.useNullMarkerImage = function(nullMarkerId) {
    var nullMarkerSrc;
    nullMarkerSrc = $(nullMarkerId).attr('src');
    nullMarkerEl = new Image();
    nullMarkerEl.onload = function() {
      loadedMarkers += 1;
      if (loadedMarkers === markerLength) {
        return initializeMarkers();
      }
    };
    return nullMarkerEl.src = nullMarkerSrc;
  };
  renderMarkerImage = function() {
    var markerX, markerY, radians;
    if (!renderedMarkerOnce && currentMarkerImage) {
      currentMarkerImage = nullMarkerEl;
      renderedMarkerOnce = true;
    } else {
      currentMarkerImage = markerImageEls[mood];
    }
    if (currentMarkerImage) {
      ctx.clearRect(-width / 2, -height / 2, width, height);
      ctx.save();
      radians = degree * 0.0174532925;
      ctx.scale(markerScaleWidth, markerScaleHeight);
      ctx.rotate(radians);
      markerX = (-markerWidth / 2) / markerScaleWidth;
      markerY = (-(smileHeight / 2) - markerHeight) / markerScaleHeight;
      ctx.drawImage(currentMarkerImage, markerX, markerY);
      return ctx.restore();
    }
  };
  if (imagesDiv) {
    self.useImagesFromDiv(imagesDiv);
  }
  if (markerDiv) {
    self.useMarkerImagesFromDiv(markerDiv);
  }
  if (nullMarkerId) {
    self.useNullMarkerImage(nullMarkerId);
  }
  el.append(canvas);
  self.on = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return events.on.apply(events, [self].concat(__slice.call(args)));
  };
  self.emit = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return events.emit.apply(events, [self].concat(__slice.call(args)));
  };
  self.removeListener = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return events.removeListener.apply(events, [self].concat(__slice.call(args)));
  };
  emit = self.emit;
  calcDegree = function(pageX, pageY) {
    var x, y;
    if (moving === false) {
      return;
    }
    x = pageX - el.offset().left - (width / 2);
    y = pageY - el.offset().top + (height / 2);
    y = height - y;
    degree = Math.atan(y / x) / (Math.PI / 180);
    if (x <= 0 && y > 0) {
      degree = degree + 180;
    } else if (x <= 0 && y <= 0) {
      degree = degree + 180;
    } else if (x > 0 && y <= 0) {
      degree = degree + 360;
    }
    degree = (360 - degree) + 90;
    if (degree < 0) {
      degree = 360 - degree;
    }
    if (degree > 360) {
      degree = degree - 360;
    }
    mood = parseInt(images.length * degree / 360);
    render();
    return emit("change", mood);
  };
  self.getMood = function() {
    return mood;
  };
  setMood = function(_index) {
    mood = _index;
    return render();
  };
  self.setMood = setMood;
  render = function() {
    renderMarkerImage();
    return el.find("img").attr("src", images[mood + 0]);
  };
  self.render = render;
  el.bind("mousedown", function(e) {
    e.preventDefault();
    moving = true;
    return calcDegree(e.pageX, e.pageY);
  });
  el.bind("mousemove", function(e) {
    e.preventDefault();
    return calcDegree(e.pageX, e.pageY);
  });
  el.bind("mouseup", function(e) {
    return moving = false;
  });
  render();
  return self;
};