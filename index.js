(function() {
  var __slice = Array.prototype.slice;
  $(function() {
    var smiley, smileyer;
    smileyer = function(options) {
      var cachedImages, calcDegree, el, emit, height, image, images, index, moving, onchange, self, width, _len;
      images = options.images, width = options.width, height = options.height, onchange = options.onchange;
      self = {};
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
      emit = self.emit;
      cachedImages = "";
      for (index = 0, _len = images.length; index < _len; index++) {
        image = images[index];
        cachedImages += "<img style=\"display: none; width:" + width + "px; height" + height + "px\" src=\"" + images[index] + "\" />";
      }
      el = $("<div class=\"smiley\">\n  <img style=\"width:" + width + "px; height" + height + "px\" src=\"" + images[0] + "\" />\n    " + cachedImages + "\n</div>");
      self.el = el;
      moving = false;
      calcDegree = function(pageX, pageY) {
        var degree, imageIndex, x, y;
        if (moving === false) {
          return;
        }
        x = pageX - el.offset().left - (width / 2);
        y = pageY - el.offset().top + (height / 2);
        y = height - y;
        degree = Math.atan(y / x);
        degree = degree / (Math.PI / 180);
        if (x < 0 && y > 0) {
          degree = degree + 180;
        } else if (x < 0 && y < 0) {
          degree = degree + 180;
        } else if (x > 0 && y < 0) {
          degree = degree + 360;
        }
        degree = 360 - degree;
        degree = degree + 90;
        if (degree < 0) {
          degree = 360 - degree;
        }
        if (degree > 360) {
          degree = degree - 360;
        }
        imageIndex = parseInt(images.length * degree / 360);
        el.find("img").attr("src", images[imageIndex + 0]);
        return emit("change", imageIndex);
      };
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
      return self;
    };
    smiley = smileyer({
      images: ['smiley/smiley-00.png', 'smiley/smiley-01.png', 'smiley/smiley-02.png', 'smiley/smiley-03.png', 'smiley/smiley-04.png', 'smiley/smiley-05.png', 'smiley/smiley-06.png', 'smiley/smiley-07.png', 'smiley/smiley-08.png', 'smiley/smiley-09.png', 'smiley/smiley-10.png'],
      width: 183,
      height: 192
    });
    $(document.body).append(smiley.el);
    return smiley.on("change", function(value) {
      return $("#value").text(value);
    });
  });
}).call(this);
