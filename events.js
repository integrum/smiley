(function() {
  var exports, trigger;
  var __slice = Array.prototype.slice;
  exports = {};
  window.events = exports;
  exports.on = function(obj, ev, callback) {
    var calls, list;
    calls = obj._callbacks || (obj._callbacks = {});
    list = calls[ev] || (calls[ev] = []);
    list.push(callback);
    obj._events = obj._callbacks;
    return obj;
  };
  exports.removeListener = function(obj, ev, callback) {
    var calls, i, item, list, _len;
    if (!ev) {
      obj._callbacks = {};
      obj._events = obj._callbacks;
    } else if (calls = obj._callbacks) {
      if (!callback) {
        calls[ev] = [];
      } else {
        list = calls[ev];
        if (!list) {
          return obj;
        }
        for (i = 0, _len = list.length; i < _len; i++) {
          item = list[i];
          if (callback === list[i]) {
            list.splice(i, 1);
            break;
          }
        }
      }
    }
    return obj;
  };
  trigger = function() {
    var args, both, callback, calls, ev, eventName, i, id, item, list, obj, _results;
    obj = arguments[0], eventName = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    both = 2;
    id = _.uniqueId();
    if (!(calls = obj._callbacks)) {
      return obj;
    }
    _results = [];
    while (both--) {
      ev = both ? eventName : "all";
      list = calls[ev];
      _results.push((function() {
        var _len, _results2;
        if (list = calls[ev]) {
          list = list.slice();
          _results2 = [];
          for (i = 0, _len = list.length; i < _len; i++) {
            item = list[i];
            callback = list[i];
            _results2.push(!callback ? void 0 : (args = both ? args : args.unshift(eventName), callback.apply(obj, args)));
          }
          return _results2;
        }
      })());
    }
    return _results;
  };
  exports.trigger = trigger;
  exports.emit = exports.trigger;
  exports.addListener = exports.on;
  exports.unbind = exports.removeListener;
  exports.once = function(obj, ev, callback) {
    var g;
    g = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _.removeListener(obj, ev, g);
      return callback.apply(obj, args);
    };
    return _.addListener(obj, ev, g);
  };
}).call(this);
