exports = {}
window.events = exports
exports.on = (obj, ev, callback) ->
  calls = obj._callbacks || obj._callbacks = {}
  list = calls[ev] || (calls[ev] = [])
  list.push callback
  obj._events = obj._callbacks
  obj
exports.removeListener = (obj, ev, callback) ->
  if (!ev)
    obj._callbacks = {}
    obj._events = obj._callbacks
  else if calls = obj._callbacks
    if !callback
      calls[ev] = []
    else
      list = calls[ev]
      if !list then return obj
      for item, i in list
        if callback == list[i]
          list.splice i, 1 #spine.js
          #list[i] = null #backbone.js
          # then backbone clearns the nulls later
          # node.js copies the array when triggering 
          # so the once isn't a problem
          break
  obj
#TODO async events? wait 0, ->
trigger = (obj, eventName, args...) ->
  both = 2
  id = _.uniqueId()
  if !(calls = obj._callbacks) then return obj
  while both--
    ev = if both then eventName else  "all"
    list = calls[ev]
    
    if list=calls[ev]
      # then next line coppies the array
      # so it doesn't get shrinked by a once
      # backbone.js has maybe a more efficient way
      # where unbind sets it to null, and here it slices them
      # if they are null
      list = list.slice() #stole this from node.js events
      for item, i in list
        callback = list[i]
        if not callback

        else
          args = if both then args else args.unshift(eventName)
          # maby have obj as the first param?
          callback.apply obj, args
exports.trigger = trigger
exports.emit = exports.trigger

exports.addListener = exports.on
exports.unbind = exports.removeListener
exports.once = (obj, ev, callback) ->
  g = (args...) ->
    _.removeListener obj, ev, g
    callback.apply obj, args 
  _.addListener obj, ev, g
