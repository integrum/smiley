(function() {
  $(function() {
    var smiley, smileyer;
    smileyer = function(options) {
      var calcDegree, el, height, images, moving, self, width;
      images = options.images, width = options.width, height = options.height;
      self = {};
      el = $("<div class=\"smiley\">\n  <img style=\"width:" + width + "px; height" + height + "px\" src=\"" + images[0] + "\" />\n</div>");
      self.el = el;
      moving = false;
      calcDegree = function(pageX, pageY) {
        var degree, x, y;
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
        return console.log(degree);
      };
      el.bind("mousedown", function(e) {
        e.preventDefault();
        calcDegree(e.pageX, e.pageY);
        return moving = true;
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
      images: ['smiley/smiley-00.png', 'smiley/smiley-01.png', 'smiley/smiley-02.png', 'smiley/smiley-03.png', 'smiley/smiley-04.png', 'smiley/smiley-05.png', 'smiley/smiley-06.png', 'smiley/smiley-07.png', 'smiley/smiley-08.png'],
      width: 183,
      height: 192
    });
    return $(document.body).append(smiley.el);
  });
}).call(this);
