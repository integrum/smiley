(function() {
  var Smiley;
  var __slice = Array.prototype.slice;
  Smiley = window.Smiley = function(options) {
    var calcDegree, canvas, canvasEl, ctx, date, day, el, emit, formattedDate, height, images, imagesDiv, markerDiv, markerImages, markerIndex, month, mood, moving, render, self, setMood, width, year;
    if (options == null) {
      options = {};
    }
    images = options.images, width = options.width, height = options.height, mood = options.mood, imagesDiv = options.imagesDiv, markerDiv = options.markerDiv, date = options.date;
    images || (images = []);
    width || (width = 183);
    height || (height = 192);
    mood || (mood = 0);
    markerIndex = 0;
    markerImages = [];
    date || (date = new Date());
    year = date.getUTCFullYear();
    month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
    day = ("0" + (date.getUTCDate())).slice(-2);
    formattedDate = "" + year + "-" + month + "-" + day;
    imagesDiv || (imagesDiv = '#smiley-images');
    markerDiv || (markerDiv = "#marker-images");
    self = {};
    el = $("<div class=\"smiley\" id=\"smiley-" + formattedDate + "\">\n</div>");
    self.el = el;
    moving = false;
    self.useImagesFromDiv = function(div) {
      images = [];
      $(div).find('img').each(function() {
        return images.push($(this).attr('src'));
      });
      return el.append($("<img style=\"width:" + width + "px; height" + height + "px\" src=\"" + images[0] + "\" />"));
    };
    self.useMarkerImagesFromDiv = function(div) {
      markerImages = [];
      return $(div).find('img').each(function() {
        return markerImages.push($(this).attr('src'));
      });
    };
    if (imagesDiv) {
      self.useImagesFromDiv(imagesDiv);
    }
    if (markerDiv) {
      self.useMarkerImagesFromDiv(markerDiv);
    }
    canvas = $('<canvas style="position:absolute;top:0;left:0;" width="#{width}" height="#{height}"></canvas>');
    canvasEl = canvas[0];
    ctx = canvasEl.getContext('2d');
    ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect(10, 10, 55, 50);
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
      var degree, x, y;
      if (moving === false) {
        return;
      }
      x = pageX - el.offset().left - (width / 2);
      y = pageY - el.offset().top + (height / 2);
      y = height - y;
      degree = Math.atan(y / x) / (Math.PI / 180);
      if (x < 0 && y > 0) {
        degree = degree + 180;
      } else if (x < 0 && y < 0) {
        degree = degree + 180;
      } else if (x > 0 && y < 0) {
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
      return el.find("img").attr("src", images[mood + 0]);
    };
    self.render = render;
    el.bind("mousedown", function(e) {
      e.preventDefault();
      moving = true;
      return calcDegree(e.pageX, e.pageY);
    });
    el.bind("mousemove", function(e) {
      return calcDegree(e.pageX, e.pageY);
    });
    el.bind("mouseup", function(e) {
      return moving = false;
    });
    render();
    return self;
  };
}).call(this);
