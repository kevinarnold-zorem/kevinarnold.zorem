history.scrollRestoration = "manual";
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : (global = global || self, factory(global.window = global.window || {}))
}(this, (function (exports) {
  'use strict';

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    }
    return self
  }
  /*!
   * GSAP 3.1.1
   * https://greensock.com
   *
   * @license Copyright 2008-2020, GreenSock. All rights reserved.
   * Subject to the terms at https://greensock.com/standard-license or for
   * Club GreenSock members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
   */
  var _config = {
      autoSleep: 120,
      force3D: "auto",
      nullTargetWarn: 1,
      units: {
        lineHeight: ""
      }
    },
    _defaults = {
      duration: .5,
      overwrite: !1,
      delay: 0
    },
    _bigNum = 1e8,
    _tinyNum = 1 / _bigNum,
    _2PI = Math.PI * 2,
    _HALF_PI = _2PI / 4,
    _gsID = 0,
    _sqrt = Math.sqrt,
    _cos = Math.cos,
    _sin = Math.sin,
    _isString = function _isString(value) {
      return typeof value === "string"
    },
    _isFunction = function _isFunction(value) {
      return typeof value === "function"
    },
    _isNumber = function _isNumber(value) {
      return typeof value === "number"
    },
    _isUndefined = function _isUndefined(value) {
      return typeof value === "undefined"
    },
    _isObject = function _isObject(value) {
      return typeof value === "object"
    },
    _isNotFalse = function _isNotFalse(value) {
      return value !== !1
    },
    _windowExists = function _windowExists() {
      return typeof window !== "undefined"
    },
    _isFuncOrString = function _isFuncOrString(value) {
      return _isFunction(value) || _isString(value)
    },
    _isArray = Array.isArray,
    _strictNumExp = /(?:-?\.?\d|\.)+/gi,
    _numExp = /[-+=\.]*\d+[\.e\-\+]*\d*[e\-\+]*\d*/g,
    _complexStringNumExp = /[-+=\.]*\d+(?:\.|e-|e)*\d*/gi,
    _parenthesesExp = /\(([^()]+)\)/i,
    _relExp = /[\+-]=-?[\.\d]+/,
    _delimitedValueExp = /[#\-+\.]*\b[a-z\d-=+%.]+/gi,
    _globalTimeline, _win, _coreInitted, _doc, _globals = {},
    _installScope = {},
    _coreReady, _install = function _install(scope) {
      return (_installScope = _merge(scope, _globals)) && gsap
    },
    _missingPlugin = function _missingPlugin(property, value) {
      return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()")
    },
    _warn = function _warn(message, suppress) {
      return !suppress && console.warn(message)
    },
    _addGlobal = function _addGlobal(name, obj) {
      return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals
    },
    _emptyFunc = function _emptyFunc() {
      return 0
    },
    _reservedProps = {},
    _lazyTweens = [],
    _lazyLookup = {},
    _lastRenderedFrame, _plugins = {},
    _effects = {},
    _nextGCFrame = 30,
    _harnessPlugins = [],
    _callbackNames = "onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",
    _harness = function _harness(targets) {
      var target = targets[0],
        harnessPlugin, i;
      if (!_isObject(target) && !_isFunction(target)) {
        targets = [targets]
      }
      if (!(harnessPlugin = (target._gsap || {}).harness)) {
        i = _harnessPlugins.length;
        while (i-- && !_harnessPlugins[i].targetTest(target)) {}
        harnessPlugin = _harnessPlugins[i]
      }
      i = targets.length;
      while (i--) {
        targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1)
      }
      return targets
    },
    _getCache = function _getCache(target) {
      return target._gsap || _harness(toArray(target))[0]._gsap
    },
    _getProperty = function _getProperty(target, property) {
      var currentValue = target[property];
      return _isFunction(currentValue) ? target[property]() : _isUndefined(currentValue) && target.getAttribute(property) || currentValue
    },
    _forEachName = function _forEachName(names, func) {
      return (names = names.split(",")).forEach(func) || names
    },
    _round = function _round(value) {
      return Math.round(value * 10000) / 10000
    },
    _arrayContainsAny = function _arrayContainsAny(toSearch, toFind) {
      var l = toFind.length,
        i = 0;
      for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l;) {}
      return i < l
    },
    _parseVars = function _parseVars(params, type, parent) {
      var isLegacy = _isNumber(params[1]),
        varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1),
        vars = params[varsIndex],
        irVars;
      if (isLegacy) {
        vars.duration = params[1]
      }
      vars.parent = parent;
      if (type) {
        irVars = vars;
        while (parent && !("immediateRender" in irVars)) {
          irVars = parent.vars.defaults || {};
          parent = _isNotFalse(parent.vars.inherit) && parent.parent
        }
        vars.immediateRender = _isNotFalse(irVars.immediateRender);
        if (type < 2) {
          vars.runBackwards = 1
        } else {
          vars.startAt = params[varsIndex - 1]
        }
      }
      return vars
    },
    _lazyRender = function _lazyRender() {
      var l = _lazyTweens.length,
        a = _lazyTweens.slice(0),
        i, tween;
      _lazyLookup = {};
      _lazyTweens.length = 0;
      for (i = 0; i < l; i++) {
        tween = a[i];
        if (tween && tween._lazy) {
          tween.render(tween._lazy[0], tween._lazy[1], !0)._lazy = 0
        }
      }
    },
    _lazySafeRender = function _lazySafeRender(animation, time, suppressEvents, force) {
      if (_lazyTweens.length) {
        _lazyRender()
      }
      animation.render(time, suppressEvents, force);
      if (_lazyTweens.length) {
        _lazyRender()
      }
    },
    _numericIfPossible = function _numericIfPossible(value) {
      var n = parseFloat(value);
      return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : value
    },
    _passThrough = function _passThrough(p) {
      return p
    },
    _setDefaults = function _setDefaults(obj, defaults) {
      for (var p in defaults) {
        if (!(p in obj)) {
          obj[p] = defaults[p]
        }
      }
      return obj
    },
    _setKeyframeDefaults = function _setKeyframeDefaults(obj, defaults) {
      for (var p in defaults) {
        if (!(p in obj) && p !== "duration" && p !== "ease") {
          obj[p] = defaults[p]
        }
      }
    },
    _merge = function _merge(base, toMerge) {
      for (var p in toMerge) {
        base[p] = toMerge[p]
      }
      return base
    },
    _mergeDeep = function _mergeDeep(base, toMerge) {
      for (var p in toMerge) {
        base[p] = _isObject(toMerge[p]) ? _mergeDeep(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p]
      }
      return base
    },
    _copyExcluding = function _copyExcluding(obj, excluding) {
      var copy = {},
        p;
      for (p in obj) {
        if (!(p in excluding)) {
          copy[p] = obj[p]
        }
      }
      return copy
    },
    _inheritDefaults = function _inheritDefaults(vars) {
      var parent = vars.parent || _globalTimeline,
        func = vars.keyframes ? _setKeyframeDefaults : _setDefaults;
      if (_isNotFalse(vars.inherit)) {
        while (parent) {
          func(vars, parent.vars.defaults);
          parent = parent.parent
        }
      }
      return vars
    },
    _arraysMatch = function _arraysMatch(a1, a2) {
      var i = a1.length,
        match = i === a2.length;
      while (match && i-- && a1[i] === a2[i]) {}
      return i < 0
    },
    _addLinkedListItem = function _addLinkedListItem(parent, child, firstProp, lastProp, sortBy) {
      if (firstProp === void 0) {
        firstProp = "_first"
      }
      if (lastProp === void 0) {
        lastProp = "_last"
      }
      var prev = parent[lastProp],
        t;
      if (sortBy) {
        t = child[sortBy];
        while (prev && prev[sortBy] > t) {
          prev = prev._prev
        }
      }
      if (prev) {
        child._next = prev._next;
        prev._next = child
      } else {
        child._next = parent[firstProp];
        parent[firstProp] = child
      }
      if (child._next) {
        child._next._prev = child
      } else {
        parent[lastProp] = child
      }
      child._prev = prev;
      child.parent = parent;
      return child
    },
    _removeLinkedListItem = function _removeLinkedListItem(parent, child, firstProp, lastProp) {
      if (firstProp === void 0) {
        firstProp = "_first"
      }
      if (lastProp === void 0) {
        lastProp = "_last"
      }
      var prev = child._prev,
        next = child._next;
      if (prev) {
        prev._next = next
      } else if (parent[firstProp] === child) {
        parent[firstProp] = next
      }
      if (next) {
        next._prev = prev
      } else if (parent[lastProp] === child) {
        parent[lastProp] = prev
      }
      child._dp = parent;
      child._next = child._prev = child.parent = null
    },
    _removeFromParent = function _removeFromParent(child, onlyIfParentHasAutoRemove) {
      if (child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren)) {
        child.parent.remove(child)
      }
      child._act = 0
    },
    _uncache = function _uncache(animation) {
      var a = animation;
      while (a) {
        a._dirty = 1;
        a = a.parent
      }
      return animation
    },
    _recacheAncestors = function _recacheAncestors(animation) {
      var parent = animation.parent;
      while (parent && parent.parent) {
        parent._dirty = 1;
        parent.totalDuration();
        parent = parent.parent
      }
      return animation
    },
    _hasNoPausedAncestors = function _hasNoPausedAncestors(animation) {
      return !animation || animation._ts && _hasNoPausedAncestors(animation.parent)
    },
    _elapsedCycleDuration = function _elapsedCycleDuration(animation) {
      return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0
    },
    _animationCycle = function _animationCycle(tTime, cycleDuration) {
      return (tTime /= cycleDuration) && ~~tTime === tTime ? ~~tTime - 1 : ~~tTime
    },
    _parentToChildTotalTime = function _parentToChildTotalTime(parentTime, child) {
      return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur)
    },
    _addToTimeline = function _addToTimeline(timeline, child, position) {
      child.parent && _removeFromParent(child);
      child._start = position + child._delay;
      child._end = child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0);
      _addLinkedListItem(timeline, child, "_first", "_last", timeline._sort ? "_start" : 0);
      timeline._recent = child;
      if (child._time || !child._dur && child._initted) {
        var curTime = (timeline.rawTime() - child._start) * child._ts;
        if (!child._dur || _clamp(0, child.totalDuration(), curTime) - child._tTime > _tinyNum) {
          child.render(curTime, !0)
        }
      }
      _uncache(timeline);
      if (timeline._dp && timeline._time >= timeline._dur && timeline._ts && timeline._dur < timeline.duration()) {
        var tl = timeline;
        while (tl._dp) {
          tl.totalTime(tl._tTime, !0);
          tl = tl._dp
        }
      }
      return timeline
    },
    _attemptInitTween = function _attemptInitTween(tween, totalTime, force, suppressEvents) {
      _initTween(tween, totalTime);
      if (!tween._initted) {
        return 1
      }
      if (!force && tween._pt && (tween._dur && tween.vars.lazy !== !1 || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
        _lazyTweens.push(tween);
        tween._lazy = [totalTime, suppressEvents];
        return 1
      }
    },
    _renderZeroDurationTween = function _renderZeroDurationTween(tween, totalTime, suppressEvents, force) {
      var prevRatio = tween._zTime < 0 ? 0 : 1,
        ratio = totalTime < 0 ? 0 : 1,
        repeatDelay = tween._rDelay,
        tTime = 0,
        pt, iteration, prevIteration;
      if (repeatDelay && tween._repeat) {
        tTime = _clamp(0, tween._tDur, totalTime);
        iteration = _animationCycle(tTime, repeatDelay);
        prevIteration = _animationCycle(tween._tTime, repeatDelay);
        if (iteration !== prevIteration) {
          prevRatio = 1 - ratio;
          if (tween.vars.repeatRefresh && tween._initted) {
            tween.invalidate()
          }
        }
      }
      if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents)) {
        return
      }
      if (ratio !== prevRatio || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
        tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0);
        tween.ratio = ratio;
        if (tween._from) {
          ratio = 1 - ratio
        }
        tween._time = 0;
        tween._tTime = tTime;
        if (!suppressEvents) {
          _callback(tween, "onStart")
        }
        pt = tween._pt;
        while (pt) {
          pt.r(ratio, pt.d);
          pt = pt._next
        }
        if (!ratio && tween._startAt && !tween._onUpdate && tween._start) {
          tween._startAt.render(totalTime, !0, force)
        }
        if (tween._onUpdate && !suppressEvents) {
          _callback(tween, "onUpdate")
        }
        if (tTime && tween._repeat && !suppressEvents && tween.parent) {
          _callback(tween, "onRepeat")
        }
        if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
          tween.ratio && _removeFromParent(tween, 1);
          if (!suppressEvents) {
            _callback(tween, tween.ratio ? "onComplete" : "onReverseComplete", !0);
            tween._prom && tween._prom()
          }
        }
      }
    },
    _findNextPauseTween = function _findNextPauseTween(animation, prevTime, time) {
      var child;
      if (time > prevTime) {
        child = animation._first;
        while (child && child._start <= time) {
          if (!child._dur && child.data === "isPause" && child._start > prevTime) {
            return child
          }
          child = child._next
        }
      } else {
        child = animation._last;
        while (child && child._start >= time) {
          if (!child._dur && child.data === "isPause" && child._start < prevTime) {
            return child
          }
          child = child._prev
        }
      }
    },
    _onUpdateTotalDuration = function _onUpdateTotalDuration(animation) {
      if (animation instanceof Timeline) {
        return _uncache(animation)
      }
      var repeat = animation._repeat;
      animation._tDur = !repeat ? animation._dur : repeat < 0 ? 1e12 : _round(animation._dur * (repeat + 1) + animation._rDelay * repeat);
      _uncache(animation.parent);
      return animation
    },
    _zeroPosition = {
      _start: 0,
      endTime: _emptyFunc
    },
    _parsePosition = function _parsePosition(animation, position, useBuildFrom) {
      var labels = animation.labels,
        recent = animation._recent || _zeroPosition,
        clippedDuration = animation.duration() >= _bigNum ? recent.endTime(!1) : animation._dur,
        i, offset;
      if (_isString(position) && (isNaN(position) || position in labels)) {
        i = position.charAt(0);
        if (i === "<" || i === ">") {
          return (i === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0)
        }
        i = position.indexOf("=");
        if (i < 0) {
          if (!(position in labels)) {
            labels[position] = clippedDuration
          }
          return labels[position]
        }
        offset = +(position.charAt(i - 1) + position.substr(i + 1));
        return i > 1 ? _parsePosition(animation, position.substr(0, i - 1)) + offset : clippedDuration + offset
      }
      return position == null ? clippedDuration : +position
    },
    _conditionalReturn = function _conditionalReturn(value, func) {
      return value || value === 0 ? func(value) : func
    },
    _clamp = function _clamp(min, max, value) {
      return value < min ? min : value > max ? max : value
    },
    getUnit = function getUnit(value) {
      return (value + "").substr((parseFloat(value) + "").length)
    },
    clamp = function clamp(min, max, value) {
      return _conditionalReturn(value, function (v) {
        return _clamp(min, max, v)
      })
    },
    _slice = [].slice,
    _isArrayLike = function _isArrayLike(value, nonEmpty) {
      return value && _isObject(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject(value[0])) && !value.nodeType && value !== _win
    },
    _flatten = function _flatten(ar, leaveStrings, accumulator) {
      if (accumulator === void 0) {
        accumulator = []
      }
      return ar.forEach(function (value) {
        var _accumulator;
        return _isString(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value)
      }) || accumulator
    },
    toArray = function toArray(value, leaveStrings) {
      return _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call(_doc.querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : []
    },
    shuffle = function shuffle(a) {
      return a.sort(function () {
        return .5 - Math.random()
      })
    },
    distribute = function distribute(v) {
      if (_isFunction(v)) {
        return v
      }
      var vars = _isObject(v) ? v : {
          each: v
        },
        ease = _parseEase(vars.ease),
        from = vars.from || 0,
        base = parseFloat(vars.base) || 0,
        cache = {},
        isDecimal = from > 0 && from < 1,
        ratios = isNaN(from) || isDecimal,
        axis = vars.axis,
        ratioX = from,
        ratioY = from;
      if (_isString(from)) {
        ratioX = ratioY = {
          center: .5,
          edges: .5,
          end: 1
        } [from] || 0
      } else if (!isDecimal && ratios) {
        ratioX = from[0];
        ratioY = from[1]
      }
      return function (i, target, a) {
        var l = (a || vars).length,
          distances = cache[l],
          originX, originY, x, y, d, j, max, min, wrapAt;
        if (!distances) {
          wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum])[1];
          if (!wrapAt) {
            max = -_bigNum;
            while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {}
            wrapAt--
          }
          distances = cache[l] = [];
          originX = ratios ? Math.min(wrapAt, l) * ratioX - .5 : from % wrapAt;
          originY = ratios ? l * ratioY / wrapAt - .5 : from / wrapAt | 0;
          max = 0;
          min = _bigNum;
          for (j = 0; j < l; j++) {
            x = j % wrapAt - originX;
            y = originY - (j / wrapAt | 0);
            distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
            if (d > max) {
              max = d
            }
            if (d < min) {
              min = d
            }
          }
          from === "random" && shuffle(distances);
          distances.max = max - min;
          distances.min = min;
          distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
          distances.b = l < 0 ? base - l : base;
          distances.u = getUnit(vars.amount || vars.each) || 0;
          ease = ease && l < 0 ? _invertEase(ease) : ease
        }
        l = (distances[i] - distances.min) / distances.max || 0;
        return _round(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u
      }
    },
    _roundModifier = function _roundModifier(v) {
      var p = v < 1 ? Math.pow(10, (v + "").length - 2) : 1;
      return function (raw) {
        return ~~(Math.round(parseFloat(raw) / v) * v * p) / p + (_isNumber(raw) ? 0 : getUnit(raw))
      }
    },
    snap = function snap(snapTo, value) {
      var isArray = _isArray(snapTo),
        radius, is2D;
      if (!isArray && _isObject(snapTo)) {
        radius = isArray = snapTo.radius || _bigNum;
        if (snapTo.values) {
          snapTo = toArray(snapTo.values);
          if (is2D = !_isNumber(snapTo[0])) {
            radius *= radius
          }
        } else {
          snapTo = _roundModifier(snapTo.increment)
        }
      }
      return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction(snapTo) ? function (raw) {
        is2D = snapTo(raw);
        return Math.abs(is2D - raw) <= radius ? is2D : raw
      } : function (raw) {
        var x = parseFloat(is2D ? raw.x : raw),
          y = parseFloat(is2D ? raw.y : 0),
          min = _bigNum,
          closest = 0,
          i = snapTo.length,
          dx, dy;
        while (i--) {
          if (is2D) {
            dx = snapTo[i].x - x;
            dy = snapTo[i].y - y;
            dx = dx * dx + dy * dy
          } else {
            dx = Math.abs(snapTo[i] - x)
          }
          if (dx < min) {
            min = dx;
            closest = i
          }
        }
        closest = !radius || min <= radius ? snapTo[closest] : raw;
        return is2D || closest === raw || _isNumber(raw) ? closest : closest + getUnit(raw)
      })
    },
    random = function random(min, max, roundingIncrement, returnFunction) {
      return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === !0 ? !!(roundingIncrement = 0) : !returnFunction, function () {
        return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && ~~(Math.round((min + Math.random() * (max - min)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction
      })
    },
    pipe = function pipe() {
      for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
        functions[_key] = arguments[_key]
      }
      return function (value) {
        return functions.reduce(function (v, f) {
          return f(v)
        }, value)
      }
    },
    unitize = function unitize(func, unit) {
      return function (value) {
        return func(parseFloat(value)) + (unit || getUnit(value))
      }
    },
    normalize = function normalize(min, max, value) {
      return mapRange(min, max, 0, 1, value)
    },
    _wrapArray = function _wrapArray(a, wrapper, value) {
      return _conditionalReturn(value, function (index) {
        return a[~~wrapper(index)]
      })
    },
    wrap = function wrap(min, max, value) {
      var range = max - min;
      return _isArray(min) ? _wrapArray(min, wrap(0, min.length), max) : _conditionalReturn(value, function (value) {
        return (range + (value - min) % range) % range + min
      })
    },
    wrapYoyo = function wrapYoyo(min, max, value) {
      var range = max - min,
        total = range * 2;
      return _isArray(min) ? _wrapArray(min, wrapYoyo(0, min.length - 1), max) : _conditionalReturn(value, function (value) {
        value = (total + (value - min) % total) % total;
        return min + (value > range ? total - value : value)
      })
    },
    _replaceRandom = function _replaceRandom(value) {
      var prev = 0,
        s = "",
        i, nums, end, isArray;
      while (~(i = value.indexOf("random(", prev))) {
        end = value.indexOf(")", i);
        isArray = value.charAt(i + 7) === "[";
        nums = value.substr(i + 7, end - i - 7).match(isArray ? _delimitedValueExp : _strictNumExp);
        s += value.substr(prev, i - prev) + random(isArray ? nums : +nums[0], +nums[1], +nums[2] || 1e-5);
        prev = end + 1
      }
      return s + value.substr(prev, value.length - prev)
    },
    mapRange = function mapRange(inMin, inMax, outMin, outMax, value) {
      var inRange = inMax - inMin,
        outRange = outMax - outMin;
      return _conditionalReturn(value, function (value) {
        return outMin + (value - inMin) / inRange * outRange
      })
    },
    interpolate = function interpolate(start, end, progress, mutate) {
      var func = isNaN(start + end) ? 0 : function (p) {
        return (1 - p) * start + p * end
      };
      if (!func) {
        var isString = _isString(start),
          master = {},
          p, i, interpolators, l, il;
        progress === !0 && (mutate = 1) && (progress = null);
        if (isString) {
          start = {
            p: start
          };
          end = {
            p: end
          }
        } else if (_isArray(start) && !_isArray(end)) {
          interpolators = [];
          l = start.length;
          il = l - 2;
          for (i = 1; i < l; i++) {
            interpolators.push(interpolate(start[i - 1], start[i]))
          }
          l--;
          func = function func(p) {
            p *= l;
            var i = Math.min(il, ~~p);
            return interpolators[i](p - i)
          };
          progress = end
        } else if (!mutate) {
          start = _merge(_isArray(start) ? [] : {}, start)
        }
        if (!interpolators) {
          for (p in end) {
            _addPropTween.call(master, start, p, "get", end[p])
          }
          func = function func(p) {
            return _renderPropTweens(p, master) || (isString ? start.p : start)
          }
        }
      }
      return _conditionalReturn(progress, func)
    },
    _getLabelInDirection = function _getLabelInDirection(timeline, fromTime, backward) {
      var labels = timeline.labels,
        min = _bigNum,
        p, distance, label;
      for (p in labels) {
        distance = labels[p] - fromTime;
        if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
          label = p;
          min = distance
        }
      }
      return label
    },
    _callback = function _callback(animation, type, executeLazyFirst) {
      var v = animation.vars,
        callback = v[type],
        params, scope;
      if (!callback) {
        return
      }
      params = v[type + "Params"];
      scope = v.callbackScope || animation;
      if (executeLazyFirst && _lazyTweens.length) {
        _lazyRender()
      }
      return params ? callback.apply(scope, params) : callback.call(scope)
    },
    _interrupt = function _interrupt(animation) {
      _removeFromParent(animation);
      if (animation.progress() < 1) {
        _callback(animation, "onInterrupt")
      }
      return animation
    },
    _quickTween, _createPlugin = function _createPlugin(config) {
      config = !config.name && config["default"] || config;
      var name = config.name,
        isFunc = _isFunction(config),
        Plugin = name && !isFunc && config.init ? function () {
          this._props = []
        } : config,
        instanceDefaults = {
          init: _emptyFunc,
          render: _renderPropTweens,
          add: _addPropTween,
          kill: _killPropTweensOf,
          modifier: _addPluginModifier,
          rawVars: 0
        },
        statics = {
          targetTest: 0,
          get: 0,
          getSetter: _getSetter,
          aliases: {},
          register: 0
        };
      _wake();
      if (config !== Plugin) {
        if (_plugins[name]) {
          return
        }
        _setDefaults(Plugin, _setDefaults(_copyExcluding(config, instanceDefaults), statics));
        _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config, statics)));
        _plugins[Plugin.prop = name] = Plugin;
        if (config.targetTest) {
          _harnessPlugins.push(Plugin);
          _reservedProps[name] = 1
        }
        name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin"
      }
      _addGlobal(name, Plugin);
      if (config.register) {
        config.register(gsap, Plugin, PropTween)
      }
    },
    _255 = 255,
    _colorLookup = {
      aqua: [0, _255, _255],
      lime: [0, _255, 0],
      silver: [192, 192, 192],
      black: [0, 0, 0],
      maroon: [128, 0, 0],
      teal: [0, 128, 128],
      blue: [0, 0, _255],
      navy: [0, 0, 128],
      white: [_255, _255, _255],
      olive: [128, 128, 0],
      yellow: [_255, _255, 0],
      orange: [_255, 165, 0],
      gray: [128, 128, 128],
      purple: [128, 0, 128],
      green: [0, 128, 0],
      red: [_255, 0, 0],
      pink: [_255, 192, 203],
      cyan: [0, _255, _255],
      transparent: [_255, _255, _255, 0]
    },
    _hue = function _hue(h, m1, m2) {
      h = h < 0 ? h + 1 : h > 1 ? h - 1 : h;
      return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < .5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + .5 | 0
    },
    splitColor = function splitColor(v, toHSL) {
      var a = !v ? _colorLookup.black : _isNumber(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0,
        r, g, b, h, s, l, max, min, d, wasHSL;
      if (!a) {
        if (v.substr(-1) === ",") {
          v = v.substr(0, v.length - 1)
        }
        if (_colorLookup[v]) {
          a = _colorLookup[v]
        } else if (v.charAt(0) === "#") {
          if (v.length === 4) {
            r = v.charAt(1);
            g = v.charAt(2);
            b = v.charAt(3);
            v = "#" + r + r + g + g + b + b
          }
          v = parseInt(v.substr(1), 16);
          a = [v >> 16, v >> 8 & _255, v & _255]
        } else if (v.substr(0, 3) === "hsl") {
          a = wasHSL = v.match(_strictNumExp);
          if (!toHSL) {
            h = +a[0] % 360 / 360;
            s = +a[1] / 100;
            l = +a[2] / 100;
            g = l <= .5 ? l * (s + 1) : l + s - l * s;
            r = l * 2 - g;
            if (a.length > 3) {
              a[3] *= 1
            }
            a[0] = _hue(h + 1 / 3, r, g);
            a[1] = _hue(h, r, g);
            a[2] = _hue(h - 1 / 3, r, g)
          } else if (~v.indexOf("=")) {
            return v.match(_numExp)
          }
        } else {
          a = v.match(_strictNumExp) || _colorLookup.transparent
        }
        a = a.map(Number)
      }
      if (toHSL && !wasHSL) {
        r = a[0] / _255;
        g = a[1] / _255;
        b = a[2] / _255;
        max = Math.max(r, g, b);
        min = Math.min(r, g, b);
        l = (max + min) / 2;
        if (max === min) {
          h = s = 0
        } else {
          d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
          h *= 60
        }
        a[0] = h + .5 | 0;
        a[1] = s * 100 + .5 | 0;
        a[2] = l * 100 + .5 | 0
      }
      return a
    },
    _formatColors = function _formatColors(s, toHSL) {
      var colors = (s + "").match(_colorExp),
        charIndex = 0,
        parsed = "",
        i, color, temp;
      if (!colors) {
        return s
      }
      for (i = 0; i < colors.length; i++) {
        color = colors[i];
        temp = s.substr(charIndex, s.indexOf(color, charIndex) - charIndex);
        charIndex += temp.length + color.length;
        color = splitColor(color, toHSL);
        if (color.length === 3) {
          color.push(1)
        }
        parsed += temp + (toHSL ? "hsla(" + color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : "rgba(" + color.join(",")) + ")"
      }
      return parsed + s.substr(charIndex)
    },
    _colorExp = function () {
      var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b",
        p;
      for (p in _colorLookup) {
        s += "|" + p + "\\b"
      }
      return new RegExp(s + ")", "gi")
    }(),
    _hslExp = /hsl[a]?\(/,
    _colorStringFilter = function _colorStringFilter(a) {
      var combined = a.join(" "),
        toHSL;
      _colorExp.lastIndex = 0;
      if (_colorExp.test(combined)) {
        toHSL = _hslExp.test(combined);
        a[0] = _formatColors(a[0], toHSL);
        a[1] = _formatColors(a[1], toHSL)
      }
    },
    _tickerActive, _ticker = function () {
      var _getTime = Date.now,
        _lagThreshold = 500,
        _adjustedLag = 33,
        _startTime = _getTime(),
        _lastUpdate = _startTime,
        _gap = 1 / 60,
        _nextTime = _gap,
        _listeners = [],
        _id, _req, _raf, _self, _tick = function _tick(v) {
          var elapsed = _getTime() - _lastUpdate,
            manual = v === !0,
            overlap, dispatch;
          if (elapsed > _lagThreshold) {
            _startTime += elapsed - _adjustedLag
          }
          _lastUpdate += elapsed;
          _self.time = (_lastUpdate - _startTime) / 1000;
          overlap = _self.time - _nextTime;
          if (overlap > 0 || manual) {
            _self.frame++;
            _nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
            dispatch = 1
          }
          if (!manual) {
            _id = _req(_tick)
          }
          if (dispatch) {
            _listeners.forEach(function (l) {
              return l(_self.time, elapsed, _self.frame, v)
            })
          }
        };
      _self = {
        time: 0,
        frame: 0,
        tick: function tick() {
          _tick(!0)
        },
        wake: function wake() {
          if (_coreReady) {
            if (!_coreInitted && _windowExists()) {
              _win = _coreInitted = window;
              _doc = _win.document || {};
              _globals.gsap = gsap;
              (_win.gsapVersions || (_win.gsapVersions = [])).push(gsap.version);
              _install(_installScope || _win.GreenSockGlobals || !_win.gsap && _win || {});
              _raf = _win.requestAnimationFrame
            }
            _id && _self.sleep();
            _req = _raf || function (f) {
              return setTimeout(f, (_nextTime - _self.time) * 1000 + 1 | 0)
            };
            _tickerActive = 1;
            _tick(2)
          }
        },
        sleep: function sleep() {
          (_raf ? _win.cancelAnimationFrame : clearTimeout)(_id);
          _tickerActive = 0;
          _req = _emptyFunc
        },
        lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
          _lagThreshold = threshold || 1 / _tinyNum;
          _adjustedLag = Math.min(adjustedLag, _lagThreshold, 0)
        },
        fps: function fps(_fps) {
          _gap = 1 / (_fps || 60);
          _nextTime = _self.time + _gap
        },
        add: function add(callback) {
          _listeners.indexOf(callback) < 0 && _listeners.push(callback);
          _wake()
        },
        remove: function remove(callback) {
          var i;
          ~(i = _listeners.indexOf(callback)) && _listeners.splice(i, 1)
        },
        _listeners: _listeners
      };
      return _self
    }(),
    _wake = function _wake() {
      return !_tickerActive && _ticker.wake()
    },
    _easeMap = {},
    _customEaseExp = /^[\d.\-M][\d.\-,\s]/,
    _quotesExp = /["']/g,
    _parseObjectInString = function _parseObjectInString(value) {
      var obj = {},
        split = value.substr(1, value.length - 3).split(":"),
        key = split[0],
        i = 1,
        l = split.length,
        index, val, parsedVal;
      for (; i < l; i++) {
        val = split[i];
        index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
        parsedVal = val.substr(0, index);
        obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
        key = val.substr(index + 1).trim()
      }
      return obj
    },
    _configEaseFromString = function _configEaseFromString(name) {
      var split = (name + "").split("("),
        ease = _easeMap[split[0]];
      return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _parenthesesExp.exec(name)[1].split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease
    },
    _invertEase = function _invertEase(ease) {
      return function (p) {
        return 1 - ease(1 - p)
      }
    },
    _parseEase = function _parseEase(ease, defaultEase) {
      return !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase
    },
    _insertEase = function _insertEase(names, easeIn, easeOut, easeInOut) {
      if (easeOut === void 0) {
        easeOut = function easeOut(p) {
          return 1 - easeIn(1 - p)
        }
      }
      if (easeInOut === void 0) {
        easeInOut = function easeInOut(p) {
          return p < .5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2
        }
      }
      var ease = {
          easeIn: easeIn,
          easeOut: easeOut,
          easeInOut: easeInOut
        },
        lowercaseName;
      _forEachName(names, function (name) {
        _easeMap[name] = _globals[name] = ease;
        _easeMap[lowercaseName = name.toLowerCase()] = easeOut;
        for (var p in ease) {
          _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p]
        }
      });
      return ease
    },
    _easeInOutFromOut = function _easeInOutFromOut(easeOut) {
      return function (p) {
        return p < .5 ? (1 - easeOut(1 - p * 2)) / 2 : .5 + easeOut((p - .5) * 2) / 2
      }
    },
    _configElastic = function _configElastic(type, amplitude, period) {
      var p1 = amplitude >= 1 ? amplitude : 1,
        p2 = (period || (type ? .3 : .45)) / (amplitude < 1 ? amplitude : 1),
        p3 = p2 / _2PI * (Math.asin(1 / p1) || 0),
        easeOut = function easeOut(p) {
          return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1
        },
        ease = type === "out" ? easeOut : type === "in" ? function (p) {
          return 1 - easeOut(1 - p)
        } : _easeInOutFromOut(easeOut);
      p2 = _2PI / p2;
      ease.config = function (amplitude, period) {
        return _configElastic(type, amplitude, period)
      };
      return ease
    },
    _configBack = function _configBack(type, overshoot) {
      if (overshoot === void 0) {
        overshoot = 1.70158
      }
      var easeOut = function easeOut(p) {
          return --p * p * ((overshoot + 1) * p + overshoot) + 1
        },
        ease = type === "out" ? easeOut : type === "in" ? function (p) {
          return 1 - easeOut(1 - p)
        } : _easeInOutFromOut(easeOut);
      ease.config = function (overshoot) {
        return _configBack(type, overshoot)
      };
      return ease
    };
  _forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function (name, i) {
    var power = i < 5 ? i + 1 : i;
    _insertEase(name + ",Power" + (power - 1), i ? function (p) {
      return Math.pow(p, power)
    } : function (p) {
      return p
    }, function (p) {
      return 1 - Math.pow(1 - p, power)
    }, function (p) {
      return p < .5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2
    })
  });
  _easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;
  _insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());
  (function (n, c) {
    var n1 = 1 / c,
      n2 = 2 * n1,
      n3 = 2.5 * n1,
      easeOut = function easeOut(p) {
        return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + .75 : p < n3 ? n * (p -= 2.25 / c) * p + .9375 : n * Math.pow(p - 2.625 / c, 2) + .984375
      };
    _insertEase("Bounce", function (p) {
      return 1 - easeOut(1 - p)
    }, easeOut)
  })(7.5625, 2.75);
  _insertEase("Expo", function (p) {
    return p ? Math.pow(2, 10 * (p - 1)) : 0
  });
  _insertEase("Circ", function (p) {
    return -(_sqrt(1 - p * p) - 1)
  });
  _insertEase("Sine", function (p) {
    return -_cos(p * _HALF_PI) + 1
  });
  _insertEase("Back", _configBack("in"), _configBack("out"), _configBack());
  _easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
    config: function config(steps, immediateStart) {
      if (steps === void 0) {
        steps = 1
      }
      var p1 = 1 / steps,
        p2 = steps + (immediateStart ? 0 : 1),
        p3 = immediateStart ? 1 : 0,
        max = 1 - _tinyNum;
      return function (p) {
        return ((p2 * _clamp(0, max, p) | 0) + p3) * p1
      }
    }
  };
  _defaults.ease = _easeMap["quad.out"];
  var GSCache = function GSCache(target, harness) {
    this.id = _gsID++;
    target._gsap = this;
    this.target = target;
    this.harness = harness;
    this.get = harness ? harness.get : _getProperty;
    this.set = harness ? harness.getSetter : _getSetter
  };
  var Animation = function () {
    function Animation(vars, time) {
      var parent = vars.parent || _globalTimeline;
      this.vars = vars;
      this._dur = this._tDur = +vars.duration || 0;
      this._delay = +vars.delay || 0;
      if (this._repeat = vars.repeat || 0) {
        this._rDelay = vars.repeatDelay || 0;
        this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
        _onUpdateTotalDuration(this)
      }
      this._ts = 1;
      this.data = vars.data;
      if (!_tickerActive) {
        _ticker.wake()
      }
      if (parent) {
        _addToTimeline(parent, this, time || time === 0 ? time : parent._time)
      }
      if (vars.reversed) {
        this.reversed(!0)
      }
      if (vars.paused) {
        this.paused(!0)
      }
    }
    var _proto = Animation.prototype;
    _proto.delay = function delay(value) {
      if (value || value === 0) {
        this._delay = value;
        return this
      }
      return this._delay
    };
    _proto.duration = function duration(value) {
      var isSetter = arguments.length,
        repeat = this._repeat,
        repeatCycles = repeat > 0 ? repeat * ((isSetter ? value : this._dur) + this._rDelay) : 0;
      return isSetter ? this.totalDuration(repeat < 0 ? value : value + repeatCycles) : this.totalDuration() && this._dur
    };
    _proto.totalDuration = function totalDuration(value) {
      if (!arguments.length) {
        return this._tDur
      }
      var repeat = this._repeat,
        isInfinite = (value || this._rDelay) && repeat < 0;
      this._tDur = isInfinite ? 1e12 : value;
      this._dur = isInfinite ? value : (value - repeat * this._rDelay) / (repeat + 1);
      this._dirty = 0;
      _uncache(this.parent);
      return this
    };
    _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
      _wake();
      if (!arguments.length) {
        return this._tTime
      }
      var parent = this.parent || this._dp,
        start;
      if (parent && parent.smoothChildTiming && this._ts) {
        start = this._start;
        this._start = parent._time - (this._ts > 0 ? _totalTime / this._ts : ((this._dirty ? this.totalDuration() : this._tDur) - _totalTime) / -this._ts);
        this._end += this._start - start;
        if (!parent._dirty) {
          _uncache(parent)
        }
        while (parent.parent) {
          if (parent.parent._time !== parent._start + (parent._ts > 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
            parent.totalTime(parent._tTime, !0)
          }
          parent = parent.parent
        }
        if (!this.parent && parent.autoRemoveChildren) {
          _addToTimeline(parent, this, this._start - this._delay)
        }
      }
      if (this._tTime !== _totalTime || !this._dur && !suppressEvents) {
        this._ts || (this._pTime = _totalTime);
        _lazySafeRender(this, _totalTime, suppressEvents)
      }
      return this
    };
    _proto.time = function time(value, suppressEvents) {
      return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % this._dur || (value ? this._dur : 0), suppressEvents) : this._time
    };
    _proto.totalProgress = function totalProgress(value, suppressEvents) {
      return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this._tTime / this.totalDuration()
    };
    _proto.progress = function progress(value, suppressEvents) {
      return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? this._time / this._dur : this.ratio
    };
    _proto.iteration = function iteration(value, suppressEvents) {
      var cycleDuration = this.duration() + this._rDelay;
      return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1
    };
    _proto.timeScale = function timeScale(value) {
      if (!arguments.length) {
        return this._ts || this._pauseTS || 0
      }
      if (this._pauseTS !== null) {
        this._pauseTS = value;
        return this
      }
      var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime;
      this._ts = value;
      return _recacheAncestors(this.totalTime(tTime, !0))
    };
    _proto.paused = function paused(value) {
      var isPaused = !this._ts;
      if (!arguments.length) {
        return isPaused
      }
      if (isPaused !== value) {
        if (value) {
          this._pauseTS = this._ts;
          this._pTime = this._tTime || Math.max(-this._delay, this.rawTime());
          this._ts = this._act = 0
        } else {
          this._ts = this._pauseTS || 1;
          this._pauseTS = null;
          value = this._tTime || this._pTime;
          if (this.progress() === 1) {
            this._tTime -= _tinyNum
          }
          this.totalTime(value, !0)
        }
      }
      return this
    };
    _proto.startTime = function startTime(value) {
      if (arguments.length) {
        if (this.parent && this.parent._sort) {
          _addToTimeline(this.parent, this, value - this._delay)
        }
        return this
      }
      return this._start
    };
    _proto.endTime = function endTime(includeRepeats) {
      return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts)
    };
    _proto.rawTime = function rawTime(wrapRepeats) {
      var parent = this.parent || this._dp;
      return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this)
    };
    _proto.repeat = function repeat(value) {
      if (arguments.length) {
        this._repeat = value;
        return _onUpdateTotalDuration(this)
      }
      return this._repeat
    };
    _proto.repeatDelay = function repeatDelay(value) {
      if (arguments.length) {
        this._rDelay = value;
        return _onUpdateTotalDuration(this)
      }
      return this._rDelay
    };
    _proto.yoyo = function yoyo(value) {
      if (arguments.length) {
        this._yoyo = value;
        return this
      }
      return this._yoyo
    };
    _proto.seek = function seek(position, suppressEvents) {
      return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents))
    };
    _proto.restart = function restart(includeDelay, suppressEvents) {
      return this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents))
    };
    _proto.play = function play(from, suppressEvents) {
      if (from != null) {
        this.seek(from, suppressEvents)
      }
      return this.reversed(!1).paused(!1)
    };
    _proto.reverse = function reverse(from, suppressEvents) {
      if (from != null) {
        this.seek(from || this.totalDuration(), suppressEvents)
      }
      return this.reversed(!0).paused(!1)
    };
    _proto.pause = function pause(atTime, suppressEvents) {
      if (atTime != null) {
        this.seek(atTime, suppressEvents)
      }
      return this.paused(!0)
    };
    _proto.resume = function resume() {
      return this.paused(!1)
    };
    _proto.reversed = function reversed(value) {
      var ts = this._ts || this._pauseTS || 0;
      if (arguments.length) {
        if (value !== this.reversed()) {
          this[this._pauseTS === null ? "_ts" : "_pauseTS"] = Math.abs(ts) * (value ? -1 : 1);
          this.totalTime(this._tTime, !0)
        }
        return this
      }
      return ts < 0
    };
    _proto.invalidate = function invalidate() {
      this._initted = 0;
      return this
    };
    _proto.isActive = function isActive(hasStarted) {
      var parent = this.parent || this._dp,
        start = this._start,
        rawTime;
      return !!(!parent || this._ts && (this._initted || !hasStarted) && parent.isActive(hasStarted) && (rawTime = parent.rawTime(!0)) >= start && rawTime < this.endTime(!0) - _tinyNum)
    };
    _proto.eventCallback = function eventCallback(type, callback, params) {
      var vars = this.vars;
      if (arguments.length > 1) {
        if (!callback) {
          delete vars[type]
        } else {
          vars[type] = callback;
          if (params) {
            vars[type + "Params"] = params
          }
          if (type === "onUpdate") {
            this._onUpdate = callback
          }
        }
        return this
      }
      return vars[type]
    };
    _proto.then = function then(onFulfilled) {
      var self = this;
      return new Promise(function (resolve) {
        var f = _isFunction(onFulfilled) ? onFulfilled : _passThrough,
          _resolve = function _resolve() {
            var _then = self.then;
            self.then = null;
            f = f(self);
            if (f) {
              if (f.then || f === self) {
                self.then = _then
              } else if (!_isFunction(f)) {
                f = _passThrough
              }
            }
            resolve(f);
            self.then = _then
          };
        if (self._initted && self.totalProgress() === 1 && self._ts >= 0 || !self._tTime && self._ts < 0) {
          _resolve()
        } else {
          self._prom = _resolve
        }
      })
    };
    _proto.kill = function kill() {
      _interrupt(this)
    };
    return Animation
  }();
  _setDefaults(Animation.prototype, {
    _time: 0,
    _start: 0,
    _end: 0,
    _tTime: 0,
    _tDur: 0,
    _dirty: 0,
    _repeat: 0,
    _yoyo: !1,
    parent: 0,
    _initted: !1,
    _rDelay: 0,
    _ts: 1,
    _dp: 0,
    ratio: 0,
    _zTime: -_tinyNum,
    _prom: 0,
    _pauseTS: null
  });
  var Timeline = function (_Animation) {
    _inheritsLoose(Timeline, _Animation);

    function Timeline(vars, time) {
      var _this;
      if (vars === void 0) {
        vars = {}
      }
      _this = _Animation.call(this, vars, time) || this;
      _this.labels = {};
      _this.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);
      _this.autoRemoveChildren = !!vars.autoRemoveChildren;
      _this._sort = _isNotFalse(vars.sortChildren);
      return _this
    }
    var _proto2 = Timeline.prototype;
    _proto2.to = function to(targets, vars, position) {
      new Tween(targets, _parseVars(arguments, 0, this), _parsePosition(this, _isNumber(vars) ? arguments[3] : position));
      return this
    };
    _proto2.from = function from(targets, vars, position) {
      new Tween(targets, _parseVars(arguments, 1, this), _parsePosition(this, _isNumber(vars) ? arguments[3] : position));
      return this
    };
    _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
      new Tween(targets, _parseVars(arguments, 2, this), _parsePosition(this, _isNumber(fromVars) ? arguments[4] : position));
      return this
    };
    _proto2.set = function set(targets, vars, position) {
      vars.duration = 0;
      vars.parent = this;
      if (!vars.repeatDelay) {
        vars.repeat = 0
      }
      vars.immediateRender = !!vars.immediateRender;
      new Tween(targets, vars, _parsePosition(this, position));
      return this
    };
    _proto2.call = function call(callback, params, position) {
      return _addToTimeline(this, Tween.delayedCall(0, callback, params), _parsePosition(this, position))
    };
    _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
      vars.duration = duration;
      vars.stagger = vars.stagger || stagger;
      vars.onComplete = onCompleteAll;
      vars.onCompleteParams = onCompleteAllParams;
      vars.parent = this;
      new Tween(targets, vars, _parsePosition(this, position));
      return this
    };
    _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
      vars.runBackwards = 1;
      vars.immediateRender = _isNotFalse(vars.immediateRender);
      return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams)
    };
    _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
      toVars.startAt = fromVars;
      toVars.immediateRender = _isNotFalse(toVars.immediateRender);
      return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams)
    };
    _proto2.render = function render(totalTime, suppressEvents, force) {
      var prevTime = this._time,
        tDur = this._dirty ? this.totalDuration() : this._tDur,
        dur = this._dur,
        tTime = totalTime > tDur - _tinyNum && totalTime >= 0 && this !== _globalTimeline ? tDur : totalTime < _tinyNum ? 0 : totalTime,
        crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur),
        time, child, next, iteration, cycleDuration, prevPaused, pauseTween, timeScale, prevStart, prevIteration, yoyo, isYoyo;
      if (tTime !== this._tTime || force || crossingStart) {
        if (crossingStart) {
          if (!dur) {
            prevTime = this._zTime
          }
          if (totalTime || !suppressEvents) {
            this._zTime = totalTime
          }
        }
        time = tTime;
        prevStart = this._start;
        timeScale = this._ts;
        prevPaused = timeScale === 0;
        if (prevTime !== this._time && dur) {
          time += this._time - prevTime
        }
        if (this._repeat) {
          yoyo = this._yoyo;
          cycleDuration = dur + this._rDelay;
          time = _round(tTime % cycleDuration);
          if (time > dur || tDur === tTime) {
            time = dur
          }
          iteration = ~~(tTime / cycleDuration);
          if (iteration && iteration === tTime / cycleDuration) {
            time = dur;
            iteration--
          }
          prevIteration = _animationCycle(this._tTime, cycleDuration);
          if (yoyo && iteration & 1) {
            time = dur - time;
            isYoyo = 1
          }
          if (iteration !== prevIteration && !this._lock) {
            var rewinding = yoyo && prevIteration & 1,
              doesWrap = rewinding === (yoyo && iteration & 1);
            if (iteration < prevIteration) {
              rewinding = !rewinding
            }
            prevTime = rewinding ? 0 : dur;
            this._lock = 1;
            this.render(prevTime, suppressEvents, !dur)._lock = 0;
            if (!suppressEvents && this.parent) {
              _callback(this, "onRepeat")
            }
            this.vars.repeatRefresh && !isYoyo && this.getChildren().forEach(function (child) {
              return child.invalidate()
            });
            if (prevTime !== this._time || prevPaused !== !this._ts) {
              return this
            }
            if (doesWrap) {
              this._lock = 2;
              prevTime = rewinding ? dur + 0.0001 : -0.0001;
              this.render(prevTime, !0)
            }
            this._lock = 0;
            if (!this._ts && !prevPaused) {
              return this
            }
          }
        }
        if (this._hasPause && !this._forcing && this._lock < 2) {
          pauseTween = _findNextPauseTween(this, _round(prevTime), _round(time));
          if (pauseTween) {
            tTime -= time - (time = pauseTween._start)
          }
        }
        this._tTime = tTime;
        this._time = time;
        this._act = !timeScale;
        if (!this._initted) {
          this._onUpdate = this.vars.onUpdate;
          this._initted = 1
        }
        if (!prevTime && time && !suppressEvents) {
          _callback(this, "onStart")
        }
        if (time >= prevTime && totalTime >= 0) {
          child = this._first;
          while (child) {
            next = child._next;
            if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
              if (child.parent !== this) {
                return this.render(totalTime, suppressEvents, force)
              }
              child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);
              if (time !== this._time || !this._ts && !prevPaused) {
                pauseTween = 0;
                break
              }
            }
            child = next
          }
        } else {
          child = this._last;
          var adjustedTime = totalTime < 0 ? totalTime : time;
          while (child) {
            next = child._prev;
            if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
              if (child.parent !== this) {
                return this.render(totalTime, suppressEvents, force)
              }
              child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force);
              if (time !== this._time || !this._ts && !prevPaused) {
                pauseTween = 0;
                break
              }
            }
            child = next
          }
        }
        if (pauseTween && !suppressEvents) {
          this.pause();
          pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;
          if (this._ts) {
            this._start = prevStart;
            return this.render(totalTime, suppressEvents, force)
          }
        }
        if (this._onUpdate && !suppressEvents) {
          _callback(this, "onUpdate", !0)
        }
        if (tTime === tDur && tDur >= this.totalDuration() || !tTime && this._ts < 0)
          if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) {
            (totalTime || !dur) && (totalTime && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
            if (!suppressEvents && !(totalTime < 0 && !prevTime)) {
              _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", !0);
              this._prom && this._prom()
            }
          }
      }
      return this
    };
    _proto2.add = function add(child, position) {
      var _this2 = this;
      if (!_isNumber(position)) {
        position = _parsePosition(this, position)
      }
      if (!(child instanceof Animation)) {
        if (_isArray(child)) {
          child.forEach(function (obj) {
            return _this2.add(obj, position)
          });
          return _uncache(this)
        }
        if (_isString(child)) {
          return this.addLabel(child, position)
        }
        if (_isFunction(child)) {
          child = Tween.delayedCall(0, child)
        } else {
          return this
        }
      }
      return this !== child ? _addToTimeline(this, child, position) : this
    };
    _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
      if (nested === void 0) {
        nested = !0
      }
      if (tweens === void 0) {
        tweens = !0
      }
      if (timelines === void 0) {
        timelines = !0
      }
      if (ignoreBeforeTime === void 0) {
        ignoreBeforeTime = -_bigNum
      }
      var a = [],
        child = this._first;
      while (child) {
        if (child._start >= ignoreBeforeTime) {
          if (child instanceof Tween) {
            if (tweens) {
              a.push(child)
            }
          } else {
            if (timelines) {
              a.push(child)
            }
            if (nested) {
              a.push.apply(a, child.getChildren(!0, tweens, timelines))
            }
          }
        }
        child = child._next
      }
      return a
    };
    _proto2.getById = function getById(id) {
      var animations = this.getChildren(1, 1, 1),
        i = animations.length;
      while (i--) {
        if (animations[i].vars.id === id) {
          return animations[i]
        }
      }
    };
    _proto2.remove = function remove(child) {
      if (_isString(child)) {
        return this.removeLabel(child)
      }
      if (_isFunction(child)) {
        return this.killTweensOf(child)
      }
      _removeLinkedListItem(this, child);
      if (child === this._recent) {
        this._recent = this._last
      }
      return _uncache(this)
    };
    _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
      if (!arguments.length) {
        return this._tTime
      }
      this._forcing = 1;
      if (!this.parent && !this._dp && this._ts) {
        this._start = _ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts)
      }
      _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);
      this._forcing = 0;
      return this
    };
    _proto2.addLabel = function addLabel(label, position) {
      this.labels[label] = _parsePosition(this, position);
      return this
    };
    _proto2.removeLabel = function removeLabel(label) {
      delete this.labels[label];
      return this
    };
    _proto2.addPause = function addPause(position, callback, params) {
      var t = Tween.delayedCall(0, callback || _emptyFunc, params);
      t.data = "isPause";
      this._hasPause = 1;
      return _addToTimeline(this, t, _parsePosition(this, position))
    };
    _proto2.removePause = function removePause(position) {
      var child = this._first;
      position = _parsePosition(this, position);
      while (child) {
        if (child._start === position && child.data === "isPause") {
          _removeFromParent(child)
        }
        child = child._next
      }
    };
    _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
      var tweens = this.getTweensOf(targets, onlyActive),
        i = tweens.length;
      while (i--) {
        _overwritingTween !== tweens[i] && tweens[i].kill(targets, props)
      }
      return this
    };
    _proto2.getTweensOf = function getTweensOf(targets, onlyActive) {
      var a = [],
        parsedTargets = toArray(targets),
        child = this._first,
        children;
      while (child) {
        if (child instanceof Tween) {
          if (_arrayContainsAny(child._targets, parsedTargets) && (!onlyActive || child.isActive(onlyActive === "started"))) {
            a.push(child)
          }
        } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
          a.push.apply(a, children)
        }
        child = child._next
      }
      return a
    };
    _proto2.tweenTo = function tweenTo(position, vars) {
      var tl = this,
        endTime = _parsePosition(tl, position),
        startAt = vars && vars.startAt,
        tween = Tween.to(tl, _setDefaults({
          ease: "none",
          lazy: !1,
          time: endTime,
          duration: Math.abs(endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale() || _tinyNum,
          onStart: function onStart() {
            tl.pause();
            var duration = Math.abs(endTime - tl._time) / tl.timeScale();
            if (tween._dur !== duration) {
              tween._dur = duration;
              tween.render(tween._time, !0, !0)
            }
            if (vars && vars.onStart) {
              vars.onStart.apply(tween, vars.onStartParams || [])
            }
          }
        }, vars));
      return tween
    };
    _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
      return this.tweenTo(toPosition, _setDefaults({
        startAt: {
          time: _parsePosition(this, fromPosition)
        }
      }, vars))
    };
    _proto2.recent = function recent() {
      return this._recent
    };
    _proto2.nextLabel = function nextLabel(afterTime) {
      if (afterTime === void 0) {
        afterTime = this._time
      }
      return _getLabelInDirection(this, _parsePosition(this, afterTime))
    };
    _proto2.previousLabel = function previousLabel(beforeTime) {
      if (beforeTime === void 0) {
        beforeTime = this._time
      }
      return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1)
    };
    _proto2.currentLabel = function currentLabel(value) {
      return arguments.length ? this.seek(value, !0) : this.previousLabel(this._time + _tinyNum)
    };
    _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
      if (ignoreBeforeTime === void 0) {
        ignoreBeforeTime = 0
      }
      var child = this._first,
        labels = this.labels,
        p;
      while (child) {
        if (child._start >= ignoreBeforeTime) {
          child._start += amount
        }
        child = child._next
      }
      if (adjustLabels) {
        for (p in labels) {
          if (labels[p] >= ignoreBeforeTime) {
            labels[p] += amount
          }
        }
      }
      return _uncache(this)
    };
    _proto2.invalidate = function invalidate() {
      var child = this._first;
      this._lock = 0;
      while (child) {
        child.invalidate();
        child = child._next
      }
      return _Animation.prototype.invalidate.call(this)
    };
    _proto2.clear = function clear(includeLabels) {
      if (includeLabels === void 0) {
        includeLabels = !0
      }
      var child = this._first,
        next;
      while (child) {
        next = child._next;
        this.remove(child);
        child = next
      }
      this._time = this._tTime = 0;
      if (includeLabels) {
        this.labels = {}
      }
      return _uncache(this)
    };
    _proto2.totalDuration = function totalDuration(value) {
      var max = 0,
        self = this,
        child = self._last,
        prevStart = _bigNum,
        repeat = self._repeat,
        repeatCycles = repeat * self._rDelay || 0,
        isInfinite = repeat < 0,
        prev, end;
      if (!arguments.length) {
        if (self._dirty) {
          while (child) {
            prev = child._prev;
            if (child._dirty) {
              child.totalDuration()
            }
            if (child._start > prevStart && self._sort && child._ts && !self._lock) {
              self._lock = 1;
              _addToTimeline(self, child, child._start - child._delay);
              self._lock = 0
            } else {
              prevStart = child._start
            }
            if (child._start < 0 && child._ts) {
              max -= child._start;
              if (!self.parent && !self._dp || self.parent && self.parent.smoothChildTiming) {
                self._start += child._start / self._ts;
                self._time -= child._start;
                self._tTime -= child._start
              }
              self.shiftChildren(-child._start, !1, -1e20);
              prevStart = 0
            }
            end = child._end = child._start + child._tDur / Math.abs(child._ts || child._pauseTS || _tinyNum);
            if (end > max && child._ts) {
              max = _round(end)
            }
            child = prev
          }
          self._dur = self === _globalTimeline && self._time > max ? self._time : Math.min(_bigNum, max);
          self._tDur = isInfinite && (self._dur || repeatCycles) ? 1e12 : Math.min(_bigNum, max * (repeat + 1) + repeatCycles);
          self._end = self._start + (self._tDur / Math.abs(self._ts || self._pauseTS || _tinyNum) || 0);
          self._dirty = 0
        }
        return self._tDur
      }
      return isInfinite ? self : self.timeScale(self.totalDuration() / value)
    };
    Timeline.updateRoot = function updateRoot(time) {
      if (_globalTimeline._ts) {
        _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));
        _lastRenderedFrame = _ticker.frame
      }
      if (_ticker.frame >= _nextGCFrame) {
        _nextGCFrame += _config.autoSleep || 120;
        var child = _globalTimeline._first;
        if (!child || !child._ts)
          if (_config.autoSleep && _ticker._listeners.length < 2) {
            while (child && !child._ts) {
              child = child._next
            }
            if (!child) {
              _ticker.sleep()
            }
          }
      }
    };
    return Timeline
  }(Animation);
  _setDefaults(Timeline.prototype, {
    _lock: 0,
    _hasPause: 0,
    _forcing: 0
  });
  var _addComplexStringPropTween = function _addComplexStringPropTween(target, prop, start, end, setter, stringFilter, funcParam) {
      var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter),
        index = 0,
        matchIndex = 0,
        result, startNums, color, endNum, chunk, startNum, hasRandom, a;
      pt.b = start;
      pt.e = end;
      start += "";
      end += "";
      if (hasRandom = ~end.indexOf("random(")) {
        end = _replaceRandom(end)
      }
      if (stringFilter) {
        a = [start, end];
        stringFilter(a, target, prop);
        start = a[0];
        end = a[1]
      }
      startNums = start.match(_complexStringNumExp) || [];
      while (result = _complexStringNumExp.exec(end)) {
        endNum = result[0];
        chunk = end.substring(index, result.index);
        if (color) {
          color = (color + 1) % 5
        } else if (chunk.substr(-5) === "rgba(") {
          color = 1
        }
        if (endNum !== startNums[matchIndex++]) {
          startNum = parseFloat(startNums[matchIndex - 1]) || 0;
          pt._pt = {
            _next: pt._pt,
            p: chunk || matchIndex === 1 ? chunk : ",",
            s: startNum,
            c: endNum.charAt(1) === "=" ? parseFloat(endNum.substr(2)) * (endNum.charAt(0) === "-" ? -1 : 1) : parseFloat(endNum) - startNum,
            m: color && color < 4 ? Math.round : 0
          };
          index = _complexStringNumExp.lastIndex
        }
      }
      pt.c = index < end.length ? end.substring(index, end.length) : "";
      pt.fp = funcParam;
      if (_relExp.test(end) || hasRandom) {
        pt.e = 0
      }
      this._pt = pt;
      return pt
    },
    _addPropTween = function _addPropTween(target, prop, start, end, index, targets, modifier, stringFilter, funcParam) {
      if (_isFunction(end)) {
        end = end(index || 0, target, targets)
      }
      var currentValue = target[prop],
        parsedStart = start !== "get" ? start : !_isFunction(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](),
        setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc,
        pt;
      if (_isString(end)) {
        if (~end.indexOf("random(")) {
          end = _replaceRandom(end)
        }
        if (end.charAt(1) === "=") {
          end = parseFloat(parsedStart) + parseFloat(end.substr(2)) * (end.charAt(0) === "-" ? -1 : 1) + (getUnit(parsedStart) || 0)
        }
      }
      if (parsedStart !== end) {
        if (!isNaN(parsedStart + end)) {
          pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
          if (funcParam) {
            pt.fp = funcParam
          }
          if (modifier) {
            pt.modifier(modifier, this, target)
          }
          return this._pt = pt
        }!currentValue && !(prop in target) && _missingPlugin(prop, end);
        return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam)
      }
    },
    _processVars = function _processVars(vars, index, target, targets, tween) {
      if (_isFunction(vars)) {
        vars = _parseFuncOrString(vars, tween, index, target, targets)
      }
      if (!_isObject(vars) || vars.style && vars.nodeType || _isArray(vars)) {
        return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars
      }
      var copy = {},
        p;
      for (p in vars) {
        copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets)
      }
      return copy
    },
    _checkPlugin = function _checkPlugin(property, vars, tween, index, target, targets) {
      var plugin, pt, ptLookup, i;
      if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== !1) {
        tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);
        if (tween !== _quickTween) {
          ptLookup = tween._ptLookup[tween._targets.indexOf(target)];
          i = plugin._props.length;
          while (i--) {
            ptLookup[plugin._props[i]] = pt
          }
        }
      }
      return plugin
    },
    _overwritingTween, _initTween = function _initTween(tween, time) {
      var vars = tween.vars,
        ease = vars.ease,
        startAt = vars.startAt,
        immediateRender = vars.immediateRender,
        lazy = vars.lazy,
        onUpdate = vars.onUpdate,
        onUpdateParams = vars.onUpdateParams,
        callbackScope = vars.callbackScope,
        runBackwards = vars.runBackwards,
        yoyoEase = vars.yoyoEase,
        keyframes = vars.keyframes,
        autoRevert = vars.autoRevert,
        dur = tween._dur,
        prevStartAt = tween._startAt,
        targets = tween._targets,
        parent = tween.parent,
        fullTargets = parent && parent.data === "nested" ? parent.parent._targets : targets,
        autoOverwrite = tween._overwrite === "auto",
        tl = tween.timeline,
        cleanVars, i, p, pt, target, hasPriority, gsData, harness, plugin, ptLookup, index, harnessVars;
      if (tl && (!keyframes || !ease)) {
        ease = "none"
      }
      tween._ease = _parseEase(ease, _defaults.ease);
      tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === !0 ? ease : yoyoEase, _defaults.ease)) : 0;
      if (yoyoEase && tween._yoyo && !tween._repeat) {
        yoyoEase = tween._yEase;
        tween._yEase = tween._ease;
        tween._ease = yoyoEase
      }
      if (!tl) {
        if (prevStartAt) {
          prevStartAt.render(-1, !0).kill()
        }
        if (startAt) {
          _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({
            data: "isStart",
            overwrite: !1,
            parent: parent,
            immediateRender: !0,
            lazy: _isNotFalse(lazy),
            startAt: null,
            delay: 0,
            onUpdate: onUpdate,
            onUpdateParams: onUpdateParams,
            callbackScope: callbackScope,
            stagger: 0
          }, startAt)));
          if (immediateRender) {
            if (time > 0) {
              !autoRevert && (tween._startAt = 0)
            } else if (dur) {
              return
            }
          }
        } else if (runBackwards && dur) {
          if (prevStartAt) {
            !autoRevert && (tween._startAt = 0)
          } else {
            if (time) {
              immediateRender = !1
            }
            _removeFromParent(tween._startAt = Tween.set(targets, _merge(_copyExcluding(vars, _reservedProps), {
              overwrite: !1,
              data: "isFromStart",
              lazy: immediateRender && _isNotFalse(lazy),
              immediateRender: immediateRender,
              stagger: 0,
              parent: parent
            })));
            if (!immediateRender) {
              _initTween(tween._startAt, _tinyNum)
            } else if (!time) {
              return
            }
          }
        }
        cleanVars = _copyExcluding(vars, _reservedProps);
        tween._pt = 0;
        harness = targets[0] ? _getCache(targets[0]).harness : 0;
        harnessVars = harness && vars[harness.prop];
        lazy = dur && _isNotFalse(lazy) || lazy && !dur;
        for (i = 0; i < targets.length; i++) {
          target = targets[i];
          gsData = target._gsap || _harness(targets)[i]._gsap;
          tween._ptLookup[i] = ptLookup = {};
          if (_lazyLookup[gsData.id]) {
            _lazyRender()
          }
          index = fullTargets === targets ? i : fullTargets.indexOf(target);
          if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== !1) {
            tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);
            plugin._props.forEach(function (name) {
              ptLookup[name] = pt
            });
            if (plugin.priority) {
              hasPriority = 1
            }
          }
          if (!harness || harnessVars) {
            for (p in cleanVars) {
              if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
                if (plugin.priority) {
                  hasPriority = 1
                }
              } else {
                ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter)
              }
            }
          }
          if (tween._op && tween._op[i]) {
            tween.kill(target, tween._op[i])
          }
          if (autoOverwrite && tween._pt) {
            _overwritingTween = tween;
            _globalTimeline.killTweensOf(target, ptLookup, "started");
            _overwritingTween = 0
          }
          if (tween._pt && lazy) {
            _lazyLookup[gsData.id] = 1
          }
        }
        if (hasPriority) {
          _sortPropTweensByPriority(tween)
        }
        if (tween._onInit) {
          tween._onInit(tween)
        }
      }
      tween._from = !tl && !!vars.runBackwards;
      tween._onUpdate = onUpdate;
      tween._initted = 1
    },
    _addAliasesToVars = function _addAliasesToVars(targets, vars) {
      var harness = targets[0] ? _getCache(targets[0]).harness : 0,
        propertyAliases = harness && harness.aliases,
        copy, p, i, aliases;
      if (!propertyAliases) {
        return vars
      }
      copy = _merge({}, vars);
      for (p in propertyAliases) {
        if (p in copy) {
          aliases = propertyAliases[p].split(",");
          i = aliases.length;
          while (i--) {
            copy[aliases[i]] = copy[p]
          }
        }
      }
      return copy
    },
    _parseFuncOrString = function _parseFuncOrString(value, tween, i, target, targets) {
      return _isFunction(value) ? value.call(tween, i, target, targets) : _isString(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value
    },
    _staggerTweenProps = _callbackNames + ",repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase",
    _staggerPropsToSkip = (_staggerTweenProps + ",id,stagger,delay,duration,paused").split(",");
  var Tween = function (_Animation2) {
    _inheritsLoose(Tween, _Animation2);

    function Tween(targets, vars, time) {
      var _this3;
      if (typeof vars === "number") {
        time.duration = vars;
        vars = time;
        time = null
      }
      _this3 = _Animation2.call(this, _inheritDefaults(vars), time) || this;
      var _this3$vars = _this3.vars,
        duration = _this3$vars.duration,
        delay = _this3$vars.delay,
        immediateRender = _this3$vars.immediateRender,
        stagger = _this3$vars.stagger,
        overwrite = _this3$vars.overwrite,
        keyframes = _this3$vars.keyframes,
        defaults = _this3$vars.defaults,
        parsedTargets = _isArray(targets) && _isNumber(targets[0]) ? [targets] : toArray(targets),
        tl, i, copy, l, p, curTarget, staggerFunc, staggerVarsToMerge;
      _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://greensock.com", !_config.nullTargetWarn) || [];
      _this3._ptLookup = [];
      _this3._overwrite = overwrite;
      if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
        vars = _this3.vars;
        tl = _this3.timeline = new Timeline({
          data: "nested",
          defaults: defaults || {}
        });
        tl.kill();
        tl.parent = _assertThisInitialized(_this3);
        if (keyframes) {
          _setDefaults(tl.vars.defaults, {
            ease: "none"
          });
          keyframes.forEach(function (frame) {
            return tl.to(parsedTargets, frame, ">")
          })
        } else {
          l = parsedTargets.length;
          staggerFunc = stagger ? distribute(stagger) : _emptyFunc;
          if (_isObject(stagger)) {
            for (p in stagger) {
              if (~_staggerTweenProps.indexOf(p)) {
                if (!staggerVarsToMerge) {
                  staggerVarsToMerge = {}
                }
                staggerVarsToMerge[p] = stagger[p]
              }
            }
          }
          for (i = 0; i < l; i++) {
            copy = {};
            for (p in vars) {
              if (_staggerPropsToSkip.indexOf(p) < 0) {
                copy[p] = vars[p]
              }
            }
            copy.stagger = 0;
            if (staggerVarsToMerge) {
              _merge(copy, staggerVarsToMerge)
            }
            if (vars.yoyoEase && !vars.repeat) {
              copy.yoyoEase = vars.yoyoEase
            }
            curTarget = parsedTargets[i];
            copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets);
            copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;
            if (!stagger && l === 1 && copy.delay) {
              _this3._delay = delay = copy.delay;
              _this3._start += delay;
              copy.delay = 0
            }
            tl.to(curTarget, copy, staggerFunc(i, curTarget, parsedTargets))
          }
          duration = delay = 0
        }
        duration || _this3.duration(duration = tl.duration())
      } else {
        _this3.timeline = 0
      }
      if (overwrite === !0) {
        _overwritingTween = _assertThisInitialized(_this3);
        _globalTimeline.killTweensOf(parsedTargets);
        _overwritingTween = 0
      }
      if (immediateRender || !duration && !keyframes && _this3._start === _this3.parent._time && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && _this3.parent.data !== "nested") {
        _this3._tTime = -_tinyNum;
        _this3.render(Math.max(0, -delay))
      }
      return _this3
    }
    var _proto3 = Tween.prototype;
    _proto3.render = function render(totalTime, suppressEvents, force) {
      var prevTime = this._time,
        tDur = this._tDur,
        dur = this._dur,
        tTime = totalTime > tDur - _tinyNum && totalTime >= 0 ? tDur : totalTime < _tinyNum ? 0 : totalTime,
        time, pt, iteration, cycleDuration, prevIteration, isYoyo, ratio, timeline, yoyoEase;
      if (!dur) {
        _renderZeroDurationTween(this, totalTime, suppressEvents, force)
      } else if (tTime !== this._tTime || !totalTime || force || this._startAt && this._zTime < 0 !== totalTime < 0) {
        time = tTime;
        timeline = this.timeline;
        if (this._repeat) {
          cycleDuration = dur + this._rDelay;
          time = _round(tTime % cycleDuration);
          if (time > dur) {
            time = dur
          }
          iteration = ~~(tTime / cycleDuration);
          if (iteration && iteration === tTime / cycleDuration) {
            time = dur;
            iteration--
          }
          isYoyo = this._yoyo && iteration & 1;
          if (isYoyo) {
            yoyoEase = this._yEase;
            time = dur - time
          }
          prevIteration = _animationCycle(this._tTime, cycleDuration);
          if (time === prevTime && !force && this._initted) {
            return this
          }
          if (iteration !== prevIteration) {
            if (this.vars.repeatRefresh && !isYoyo && !this._lock) {
              this._lock = force = 1;
              this.render(cycleDuration * iteration, !0).invalidate()._lock = 0
            }
          }
        }
        if (!this._initted && _attemptInitTween(this, time, force, suppressEvents)) {
          this._tTime = 0;
          return this
        }
        this._tTime = tTime;
        this._time = time;
        if (!this._act && this._ts) {
          this._act = 1;
          this._lazy = 0
        }
        this.ratio = ratio = (yoyoEase || this._ease)(time / dur);
        if (this._from) {
          this.ratio = ratio = 1 - ratio
        }
        if (!prevTime && time && !suppressEvents) {
          _callback(this, "onStart")
        }
        pt = this._pt;
        while (pt) {
          pt.r(ratio, pt.d);
          pt = pt._next
        }
        timeline && timeline.render(totalTime < 0 ? totalTime : !time && isYoyo ? -_tinyNum : timeline._dur * ratio, suppressEvents, force) || this._startAt && (this._zTime = totalTime);
        if (this._onUpdate && !suppressEvents) {
          if (totalTime < 0 && this._startAt) {
            this._startAt.render(totalTime, !0, force)
          }
          _callback(this, "onUpdate")
        }
        if (this._repeat)
          if (iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent) {
            _callback(this, "onRepeat")
          }
        if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
          if (totalTime < 0 && this._startAt && !this._onUpdate) {
            this._startAt.render(totalTime, !0, force)
          }(totalTime || !dur) && (totalTime && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
          if (!suppressEvents && !(totalTime < 0 && !prevTime)) {
            _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", !0);
            this._prom && this._prom()
          }
        }
      }
      return this
    };
    _proto3.targets = function targets() {
      return this._targets
    };
    _proto3.invalidate = function invalidate() {
      this._pt = this._op = this._startAt = this._onUpdate = this._act = this._lazy = 0;
      this._ptLookup = [];
      if (this.timeline) {
        this.timeline.invalidate()
      }
      return _Animation2.prototype.invalidate.call(this)
    };
    _proto3.kill = function kill(targets, vars) {
      if (vars === void 0) {
        vars = "all"
      }
      if (!targets && (!vars || vars === "all")) {
        this._lazy = 0;
        if (this.parent) {
          return _interrupt(this)
        }
      }
      if (this.timeline) {
        this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== !0);
        return this
      }
      var parsedTargets = this._targets,
        killingTargets = targets ? toArray(targets) : parsedTargets,
        propTweenLookup = this._ptLookup,
        firstPT = this._pt,
        overwrittenProps, curLookup, curOverwriteProps, props, p, pt, i;
      if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
        return _interrupt(this)
      }
      overwrittenProps = this._op = this._op || [];
      if (vars !== "all") {
        if (_isString(vars)) {
          p = {};
          _forEachName(vars, function (name) {
            return p[name] = 1
          });
          vars = p
        }
        vars = _addAliasesToVars(parsedTargets, vars)
      }
      i = parsedTargets.length;
      while (i--) {
        if (~killingTargets.indexOf(parsedTargets[i])) {
          curLookup = propTweenLookup[i];
          if (vars === "all") {
            overwrittenProps[i] = vars;
            props = curLookup;
            curOverwriteProps = {}
          } else {
            curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
            props = vars
          }
          for (p in props) {
            pt = curLookup && curLookup[p];
            if (pt) {
              if (!("kill" in pt.d) || pt.d.kill(p) === !0) {
                _removeLinkedListItem(this, pt, "_pt")
              }
              delete curLookup[p]
            }
            if (curOverwriteProps !== "all") {
              curOverwriteProps[p] = 1
            }
          }
        }
      }
      if (this._initted && !this._pt && firstPT) {
        _interrupt(this)
      }
      return this
    };
    Tween.to = function to(targets, vars) {
      return new Tween(targets, vars, arguments[2])
    };
    Tween.from = function from(targets, vars) {
      return new Tween(targets, _parseVars(arguments, 1))
    };
    Tween.delayedCall = function delayedCall(delay, callback, params, scope) {
      return new Tween(callback, 0, {
        immediateRender: !1,
        lazy: !1,
        overwrite: !1,
        delay: delay,
        onComplete: callback,
        onReverseComplete: callback,
        onCompleteParams: params,
        onReverseCompleteParams: params,
        callbackScope: scope
      })
    };
    Tween.fromTo = function fromTo(targets, fromVars, toVars) {
      return new Tween(targets, _parseVars(arguments, 2))
    };
    Tween.set = function set(targets, vars) {
      vars.duration = 0;
      if (!vars.repeatDelay) {
        vars.repeat = 0
      }
      return new Tween(targets, vars)
    };
    Tween.killTweensOf = function killTweensOf(targets, props, onlyActive) {
      return _globalTimeline.killTweensOf(targets, props, onlyActive)
    };
    return Tween
  }(Animation);
  _setDefaults(Tween.prototype, {
    _targets: [],
    _lazy: 0,
    _startAt: 0,
    _op: 0,
    _onInit: 0
  });
  _forEachName("staggerTo,staggerFrom,staggerFromTo", function (name) {
    Tween[name] = function () {
      var tl = new Timeline(),
        params = _slice.call(arguments, 0);
      params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
      return tl[name].apply(tl, params)
    }
  });
  var _setterPlain = function _setterPlain(target, property, value) {
      return target[property] = value
    },
    _setterFunc = function _setterFunc(target, property, value) {
      return target[property](value)
    },
    _setterFuncWithParam = function _setterFuncWithParam(target, property, value, data) {
      return target[property](data.fp, value)
    },
    _setterAttribute = function _setterAttribute(target, property, value) {
      return target.setAttribute(property, value)
    },
    _getSetter = function _getSetter(target, property) {
      return _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain
    },
    _renderPlain = function _renderPlain(ratio, data) {
      return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 10000) / 10000, data)
    },
    _renderBoolean = function _renderBoolean(ratio, data) {
      return data.set(data.t, data.p, !!(data.s + data.c * ratio), data)
    },
    _renderComplexString = function _renderComplexString(ratio, data) {
      var pt = data._pt,
        s = "";
      if (!ratio && data.b) {
        s = data.b
      } else if (ratio === 1 && data.e) {
        s = data.e
      } else {
        while (pt) {
          s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 10000) / 10000) + s;
          pt = pt._next
        }
        s += data.c
      }
      data.set(data.t, data.p, s, data)
    },
    _renderPropTweens = function _renderPropTweens(ratio, data) {
      var pt = data._pt;
      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next
      }
    },
    _addPluginModifier = function _addPluginModifier(modifier, tween, target, property) {
      var pt = this._pt,
        next;
      while (pt) {
        next = pt._next;
        if (pt.p === property) {
          pt.modifier(modifier, tween, target)
        }
        pt = next
      }
    },
    _killPropTweensOf = function _killPropTweensOf(property) {
      var pt = this._pt,
        hasNonDependentRemaining, next;
      while (pt) {
        next = pt._next;
        if (pt.p === property && !pt.op || pt.op === property) {
          _removeLinkedListItem(this, pt, "_pt")
        } else if (!pt.dep) {
          hasNonDependentRemaining = 1
        }
        pt = next
      }
      return !hasNonDependentRemaining
    },
    _setterWithModifier = function _setterWithModifier(target, property, value, data) {
      data.mSet(target, property, data.m.call(data.tween, value, data.mt), data)
    },
    _sortPropTweensByPriority = function _sortPropTweensByPriority(parent) {
      var pt = parent._pt,
        next, pt2, first, last;
      while (pt) {
        next = pt._next;
        pt2 = first;
        while (pt2 && pt2.pr > pt.pr) {
          pt2 = pt2._next
        }
        if (pt._prev = pt2 ? pt2._prev : last) {
          pt._prev._next = pt
        } else {
          first = pt
        }
        if (pt._next = pt2) {
          pt2._prev = pt
        } else {
          last = pt
        }
        pt = next
      }
      parent._pt = first
    };
  var PropTween = function () {
    function PropTween(next, target, prop, start, change, renderer, data, setter, priority) {
      this.t = target;
      this.s = start;
      this.c = change;
      this.p = prop;
      this.r = renderer || _renderPlain;
      this.d = data || this;
      this.set = setter || _setterPlain;
      this.pr = priority || 0;
      this._next = next;
      if (next) {
        next._prev = this
      }
    }
    var _proto4 = PropTween.prototype;
    _proto4.modifier = function modifier(func, tween, target) {
      this.mSet = this.mSet || this.set;
      this.set = _setterWithModifier;
      this.m = func;
      this.mt = target;
      this.tween = tween
    };
    return PropTween
  }();
  _forEachName(_callbackNames + ",parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert", function (name) {
    _reservedProps[name] = 1;
    if (name.substr(0, 2) === "on") _reservedProps[name + "Params"] = 1
  });
  _globals.TweenMax = _globals.TweenLite = Tween;
  _globals.TimelineLite = _globals.TimelineMax = Timeline;
  _globalTimeline = new Timeline({
    sortChildren: !1,
    defaults: _defaults,
    autoRemoveChildren: !0,
    id: "root"
  });
  _config.stringFilter = _colorStringFilter;
  var _gsap = {
    registerPlugin: function registerPlugin() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2]
      }
      args.forEach(function (config) {
        return _createPlugin(config)
      })
    },
    timeline: function timeline(vars) {
      return new Timeline(vars)
    },
    getTweensOf: function getTweensOf(targets, onlyActive) {
      return _globalTimeline.getTweensOf(targets, onlyActive)
    },
    getProperty: function getProperty(target, property, unit, uncache) {
      if (_isString(target)) {
        target = toArray(target)[0]
      }
      var getter = _getCache(target || {}).get,
        format = unit ? _passThrough : _numericIfPossible;
      if (unit === "native") {
        unit = ""
      }
      return !target ? target : !property ? function (property, unit, uncache) {
        return format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache))
      } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache))
    },
    quickSetter: function quickSetter(target, property, unit) {
      target = toArray(target);
      if (target.length > 1) {
        var setters = target.map(function (t) {
            return gsap.quickSetter(t, property, unit)
          }),
          l = setters.length;
        return function (value) {
          var i = l;
          while (i--) {
            setters[i](value)
          }
        }
      }
      target = target[0] || {};
      var Plugin = _plugins[property],
        cache = _getCache(target),
        setter = Plugin ? function (value) {
          var p = new Plugin();
          _quickTween._pt = 0;
          p.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
          p.render(1, p);
          _quickTween._pt && _renderPropTweens(1, _quickTween)
        } : cache.set(target, property);
      return Plugin ? setter : function (value) {
        return setter(target, property, unit ? value + unit : value, cache, 1)
      }
    },
    isTweening: function isTweening(targets) {
      return _globalTimeline.getTweensOf(targets, !0).length > 0
    },
    defaults: function defaults(value) {
      if (value && value.ease) {
        value.ease = _parseEase(value.ease, _defaults.ease)
      }
      return _mergeDeep(_defaults, value || {})
    },
    config: function config(value) {
      return _mergeDeep(_config, value || {})
    },
    registerEffect: function registerEffect(_ref) {
      var name = _ref.name,
        effect = _ref.effect,
        plugins = _ref.plugins,
        defaults = _ref.defaults,
        extendTimeline = _ref.extendTimeline;
      (plugins || "").split(",").forEach(function (pluginName) {
        return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.")
      });
      _effects[name] = function (targets, vars) {
        return effect(toArray(targets), _setDefaults(vars || {}, defaults))
      };
      if (extendTimeline) {
        Timeline.prototype[name] = function (targets, vars, position) {
          return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}), position)
        }
      }
    },
    registerEase: function registerEase(name, ease) {
      _easeMap[name] = _parseEase(ease)
    },
    parseEase: function parseEase(ease, defaultEase) {
      return arguments.length ? _parseEase(ease, defaultEase) : _easeMap
    },
    getById: function getById(id) {
      return _globalTimeline.getById(id)
    },
    exportRoot: function exportRoot(vars, includeDelayedCalls) {
      if (vars === void 0) {
        vars = {}
      }
      var tl = new Timeline(vars),
        child, next;
      tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);
      _globalTimeline.remove(tl);
      tl._dp = 0;
      tl._time = tl._tTime = _globalTimeline._time;
      child = _globalTimeline._first;
      while (child) {
        next = child._next;
        if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
          _addToTimeline(tl, child, child._start - child._delay)
        }
        child = next
      }
      _addToTimeline(_globalTimeline, tl, 0);
      return tl
    },
    utils: {
      wrap: wrap,
      wrapYoyo: wrapYoyo,
      distribute: distribute,
      random: random,
      snap: snap,
      normalize: normalize,
      getUnit: getUnit,
      clamp: clamp,
      splitColor: splitColor,
      toArray: toArray,
      mapRange: mapRange,
      pipe: pipe,
      unitize: unitize,
      interpolate: interpolate,
      shuffle: shuffle
    },
    install: _install,
    effects: _effects,
    ticker: _ticker,
    updateRoot: Timeline.updateRoot,
    plugins: _plugins,
    globalTimeline: _globalTimeline,
    core: {
      PropTween: PropTween,
      globals: _addGlobal,
      Tween: Tween,
      Timeline: Timeline,
      Animation: Animation,
      getCache: _getCache
    }
  };
  _forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function (name) {
    return _gsap[name] = Tween[name]
  });
  _ticker.add(Timeline.updateRoot);
  _quickTween = _gsap.to({}, {
    duration: 0
  });
  var _getPluginPropTween = function _getPluginPropTween(plugin, prop) {
      var pt = plugin._pt;
      while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
        pt = pt._next
      }
      return pt
    },
    _addModifiers = function _addModifiers(tween, modifiers) {
      var targets = tween._targets,
        p, i, pt;
      for (p in modifiers) {
        i = targets.length;
        while (i--) {
          pt = tween._ptLookup[i][p];
          if (pt && (pt = pt.d)) {
            if (pt._pt) {
              pt = _getPluginPropTween(pt, p)
            }
            pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p)
          }
        }
      }
    },
    _buildModifierPlugin = function _buildModifierPlugin(name, modifier) {
      return {
        name: name,
        rawVars: 1,
        init: function init(target, vars, tween) {
          tween._onInit = function (tween) {
            var temp, p;
            if (_isString(vars)) {
              temp = {};
              _forEachName(vars, function (name) {
                return temp[name] = 1
              });
              vars = temp
            }
            if (modifier) {
              temp = {};
              for (p in vars) {
                temp[p] = modifier(vars[p])
              }
              vars = temp
            }
            _addModifiers(tween, vars)
          }
        }
      }
    };
  var gsap = _gsap.registerPlugin({
    name: "attr",
    init: function init(target, vars, tween, index, targets) {
      for (var p in vars) {
        this.add(target, "setAttribute", (target.getAttribute(p) || 0) + "", vars[p], index, targets, 0, 0, p);
        this._props.push(p)
      }
    }
  }, {
    name: "endArray",
    init: function init(target, value) {
      var i = value.length;
      while (i--) {
        this.add(target, i, target[i] || 0, value[i])
      }
    }
  }, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap;
  Tween.version = Timeline.version = gsap.version = "3.1.1";
  _coreReady = 1;
  if (_windowExists()) {
    _wake()
  }
  var Power0 = _easeMap.Power0,
    Power1 = _easeMap.Power1,
    Power2 = _easeMap.Power2,
    Power3 = _easeMap.Power3,
    Power4 = _easeMap.Power4,
    Linear = _easeMap.Linear,
    Quad = _easeMap.Quad,
    Cubic = _easeMap.Cubic,
    Quart = _easeMap.Quart,
    Quint = _easeMap.Quint,
    Strong = _easeMap.Strong,
    Elastic = _easeMap.Elastic,
    Back = _easeMap.Back,
    SteppedEase = _easeMap.SteppedEase,
    Bounce = _easeMap.Bounce,
    Sine = _easeMap.Sine,
    Expo = _easeMap.Expo,
    Circ = _easeMap.Circ;
  var _win$1, _doc$1, _docElement, _pluginInitted, _tempDiv, _tempDivStyler, _recentSetterPlugin, _windowExists$1 = function _windowExists() {
      return typeof window !== "undefined"
    },
    _transformProps = {},
    _RAD2DEG = 180 / Math.PI,
    _DEG2RAD = Math.PI / 180,
    _atan2 = Math.atan2,
    _bigNum$1 = 1e8,
    _capsExp = /([A-Z])/g,
    _numWithUnitExp = /[-+=\.]*\d+[\.e-]*\d*[a-z%]*/g,
    _horizontalExp = /(?:left|right|width|margin|padding|x)/i,
    _complexExp = /[\s,\(]\S/,
    _propertyAliases = {
      autoAlpha: "opacity,visibility",
      scale: "scaleX,scaleY",
      alpha: "opacity"
    },
    _renderCSSProp = function _renderCSSProp(ratio, data) {
      return data.set(data.t, data.p, ~~((data.s + data.c * ratio) * 1000) / 1000 + data.u, data)
    },
    _renderPropWithEnd = function _renderPropWithEnd(ratio, data) {
      return data.set(data.t, data.p, ratio === 1 ? data.e : ~~((data.s + data.c * ratio) * 1000) / 1000 + data.u, data)
    },
    _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning(ratio, data) {
      return data.set(data.t, data.p, ratio ? ~~((data.s + data.c * ratio) * 1000) / 1000 + data.u : data.b, data)
    },
    _renderRoundedCSSProp = function _renderRoundedCSSProp(ratio, data) {
      var value = data.s + data.c * ratio;
      data.set(data.t, data.p, ~~(value + (value < 0 ? -.5 : .5)) + data.u, data)
    },
    _renderNonTweeningValue = function _renderNonTweeningValue(ratio, data) {
      return data.set(data.t, data.p, ratio ? data.e : data.b, data)
    },
    _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd(ratio, data) {
      return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data)
    },
    _setterCSSStyle = function _setterCSSStyle(target, property, value) {
      return target.style[property] = value
    },
    _setterCSSProp = function _setterCSSProp(target, property, value) {
      return target.style.setProperty(property, value)
    },
    _setterTransform = function _setterTransform(target, property, value) {
      return target._gsap[property] = value
    },
    _setterScale = function _setterScale(target, property, value) {
      return target._gsap.scaleX = target._gsap.scaleY = value
    },
    _setterScaleWithRender = function _setterScaleWithRender(target, property, value, data, ratio) {
      var cache = target._gsap;
      cache.scaleX = cache.scaleY = value;
      cache.renderTransform(ratio, cache)
    },
    _setterTransformWithRender = function _setterTransformWithRender(target, property, value, data, ratio) {
      var cache = target._gsap;
      cache[property] = value;
      cache.renderTransform(ratio, cache)
    },
    _transformProp = "transform",
    _transformOriginProp = _transformProp + "Origin",
    _supports3D, _createElement = function _createElement(type, ns) {
      var e = _doc$1.createElementNS ? _doc$1.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc$1.createElement(type);
      return e.style ? e : _doc$1.createElement(type)
    },
    _getComputedProperty = function _getComputedProperty(target, property, skipPrefixFallback) {
      var cs = getComputedStyle(target);
      return cs[property] || cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty(target, _checkPropPrefix(property) || property, 1) || ""
    },
    _prefixes = "O,Moz,ms,Ms,Webkit".split(","),
    _checkPropPrefix = function _checkPropPrefix(property, element) {
      var e = element || _tempDiv,
        s = e.style,
        i = 5;
      if (property in s) {
        return property
      }
      property = property.charAt(0).toUpperCase() + property.substr(1);
      while (i-- && !(_prefixes[i] + property in s)) {}
      return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property
    },
    _initCore = function _initCore() {
      if (_windowExists$1()) {
        _win$1 = window;
        _doc$1 = _win$1.document;
        _docElement = _doc$1.documentElement;
        _tempDiv = _createElement("div") || {
          style: {}
        };
        _tempDivStyler = _createElement("div");
        _transformProp = _checkPropPrefix(_transformProp);
        _transformOriginProp = _checkPropPrefix(_transformOriginProp);
        _tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0";
        _supports3D = !!_checkPropPrefix("perspective");
        _pluginInitted = 1
      }
    },
    _getBBoxHack = function _getBBoxHack(swapIfPossible) {
      var svg = _createElement("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
        oldParent = this.parentNode,
        oldSibling = this.nextSibling,
        oldCSS = this.style.cssText,
        bbox;
      _docElement.appendChild(svg);
      svg.appendChild(this);
      this.style.display = "block";
      if (swapIfPossible) {
        try {
          bbox = this.getBBox();
          this._gsapBBox = this.getBBox;
          this.getBBox = _getBBoxHack
        } catch (e) {}
      } else if (this._gsapBBox) {
        bbox = this._gsapBBox()
      }
      if (oldSibling) {
        oldParent.insertBefore(this, oldSibling)
      } else {
        oldParent.appendChild(this)
      }
      _docElement.removeChild(svg);
      this.style.cssText = oldCSS;
      return bbox
    },
    _getAttributeFallbacks = function _getAttributeFallbacks(target, attributesArray) {
      var i = attributesArray.length;
      while (i--) {
        if (target.hasAttribute(attributesArray[i])) {
          return target.getAttribute(attributesArray[i])
        }
      }
    },
    _getBBox = function _getBBox(target) {
      var bounds;
      try {
        bounds = target.getBBox()
      } catch (error) {
        bounds = _getBBoxHack.call(target, !0)
      }
      return bounds && !bounds.width && !bounds.x && !bounds.y ? {
        x: +_getAttributeFallbacks(target, ["x", "cx", "x1"]) || 0,
        y: +_getAttributeFallbacks(target, ["y", "cy", "y1"]) || 0,
        width: 0,
        height: 0
      } : bounds
    },
    _isSVG = function _isSVG(e) {
      return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e))
    },
    _removeProperty = function _removeProperty(target, property) {
      if (property) {
        var style = target.style;
        if (property in _transformProps) {
          property = _transformProp
        }
        if (style.removeProperty) {
          if (property.substr(0, 2) === "ms" || property.substr(0, 6) === "webkit") {
            property = "-" + property
          }
          style.removeProperty(property.replace(_capsExp, "-$1").toLowerCase())
        } else {
          style.removeAttribute(property)
        }
      }
    },
    _addNonTweeningPT = function _addNonTweeningPT(plugin, target, property, beginning, end, onlySetAtEnd) {
      var pt = new PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
      plugin._pt = pt;
      pt.b = beginning;
      pt.e = end;
      plugin._props.push(property);
      return pt
    },
    _nonConvertibleUnits = {
      deg: 1,
      rad: 1,
      turn: 1
    },
    _convertToUnit = function _convertToUnit(target, property, value, unit) {
      var curValue = parseFloat(value) || 0,
        curUnit = (value + "").trim().substr((curValue + "").length) || "px",
        style = _tempDiv.style,
        horizontal = _horizontalExp.test(property),
        isRootSVG = target.tagName.toLowerCase() === "svg",
        measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"),
        amount = 100,
        toPixels = unit === "px",
        px, parent, cache, isSVG;
      if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) {
        return curValue
      }
      isSVG = target.getCTM && _isSVG(target);
      if (unit === "%" && (_transformProps[property] || ~property.indexOf("adius"))) {
        return _round(curValue / (isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty]) * amount)
      }
      style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
      parent = ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;
      if (isSVG) {
        parent = (target.ownerSVGElement || {}).parentNode
      }
      if (!parent || parent === _doc$1 || !parent.appendChild) {
        parent = _doc$1.body
      }
      cache = parent._gsap;
      if (cache && unit === "%" && cache.width && horizontal && cache.time === _ticker.time) {
        return _round(curValue / cache.width * amount)
      } else {
        parent === target && (style.position = "static");
        parent.appendChild(_tempDiv);
        px = _tempDiv[measureProperty];
        parent.removeChild(_tempDiv);
        style.position = "absolute";
        if (horizontal && unit === "%") {
          cache = _getCache(parent);
          cache.time = _ticker.time;
          cache.width = parent[measureProperty]
        }
      }
      return _round(toPixels ? px * curValue / amount : amount / px * curValue)
    },
    _get = function _get(target, property, unit, uncache) {
      var value;
      if (!_pluginInitted) {
        _initCore()
      }
      if (property in _propertyAliases && property !== "transform") {
        property = _propertyAliases[property];
        if (~property.indexOf(",")) {
          property = property.split(",")[0]
        }
      }
      if (_transformProps[property] && property !== "transform") {
        value = _parseTransform(target, uncache);
        value = property !== "transformOrigin" ? value[property] : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + value.zOrigin + "px"
      } else {
        value = target.style[property];
        if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) {
          value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || _getProperty(target, property) || (property === "opacity" ? 1 : 0)
        }
      }
      return unit && !~(value + "").indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value
    },
    _tweenComplexCSSString = function _tweenComplexCSSString(target, prop, start, end) {
      var pt = new PropTween(this._pt, target.style, prop, 0, 1, _renderComplexString),
        index = 0,
        matchIndex = 0,
        a, result, startValues, startNum, color, startValue, endValue, endNum, chunk, endUnit, startUnit, relative, endValues;
      pt.b = start;
      pt.e = end;
      start += "";
      end += "";
      if (end === "auto") {
        target.style[prop] = end;
        end = _getComputedProperty(target, prop) || end;
        target.style[prop] = start
      }
      a = [start, end];
      _colorStringFilter(a);
      start = a[0];
      end = a[1];
      startValue = start.indexOf("rgba(");
      endValue = end.indexOf("rgba(");
      if (!!startValue !== !!endValue) {
        if (startValue) {
          start = start.substr(startValue) + " " + start.substr(0, startValue - 1)
        } else {
          end = end.substr(endValue) + " " + end.substr(0, endValue - 1)
        }
      }
      startValues = start.match(_numWithUnitExp) || [];
      endValues = end.match(_numWithUnitExp) || [];
      if (endValues.length) {
        while (result = _numWithUnitExp.exec(end)) {
          endValue = result[0];
          chunk = end.substring(index, result.index);
          if (color) {
            color = (color + 1) % 5
          } else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") {
            color = 1
          }
          if (endValue !== (startValue = startValues[matchIndex++] || "")) {
            startNum = parseFloat(startValue) || 0;
            startUnit = startValue.substr((startNum + "").length);
            relative = endValue.charAt(1) === "=" ? +(endValue.charAt(0) + "1") : 0;
            if (relative) {
              endValue = endValue.substr(2)
            }
            endNum = parseFloat(endValue);
            endUnit = endValue.substr((endNum + "").length);
            index = _numWithUnitExp.lastIndex - endUnit.length;
            if (!endUnit) {
              endUnit = endUnit || _config.units[prop] || startUnit;
              if (index === end.length) {
                end += endUnit;
                pt.e += endUnit
              }
            }
            if (startUnit !== endUnit) {
              startNum = _convertToUnit(target, prop, startValue, endUnit) || 0
            }
            pt._pt = {
              _next: pt._pt,
              p: chunk || matchIndex === 1 ? chunk : ",",
              s: startNum,
              c: relative ? relative * endNum : endNum - startNum,
              m: color && color < 4 ? Math.round : 0
            }
          }
        }
        pt.c = index < end.length ? end.substring(index, end.length) : ""
      } else {
        pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue
      }
      if (_relExp.test(end)) {
        pt.e = 0
      }
      this._pt = pt;
      return pt
    },
    _keywordToPercent = {
      top: "0%",
      bottom: "100%",
      left: "0%",
      right: "100%",
      center: "50%"
    },
    _convertKeywordsToPercentages = function _convertKeywordsToPercentages(value) {
      var split = value.split(" "),
        x = split[0],
        y = split[1] || "50%";
      if (x === "top" || x === "bottom" || y === "left" || y === "right") {
        value = x;
        x = y;
        y = value
      }
      split[0] = _keywordToPercent[x] || x;
      split[1] = _keywordToPercent[y] || y;
      return split.join(" ")
    },
    _renderClearProps = function _renderClearProps(ratio, data) {
      if (data.tween && data.tween._time === data.tween._dur) {
        var target = data.t,
          style = target.style,
          props = data.u,
          prop, clearTransforms, i;
        if (props === "all" || props === !0) {
          style.cssText = "";
          clearTransforms = 1
        } else {
          props = props.split(",");
          i = props.length;
          while (--i > -1) {
            prop = props[i];
            if (_transformProps[prop]) {
              clearTransforms = 1;
              prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp
            }
            _removeProperty(target, prop)
          }
        }
        if (clearTransforms) {
          _removeProperty(target, _transformProp);
          clearTransforms = target._gsap;
          if (clearTransforms) {
            if (clearTransforms.svg) {
              target.removeAttribute("transform")
            }
            _parseTransform(target, 1)
          }
        }
      }
    },
    _specialProps = {
      clearProps: function clearProps(plugin, target, property, endValue, tween) {
        if (tween.data !== "isFromStart") {
          var pt = plugin._pt = new PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
          pt.u = endValue;
          pt.pr = -10;
          pt.tween = tween;
          plugin._props.push(property);
          return 1
        }
      }
    },
    _identity2DMatrix = [1, 0, 0, 1, 0, 0],
    _rotationalProperties = {},
    _isNullTransform = function _isNullTransform(value) {
      return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value
    },
    _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray(target) {
      var matrixString = _getComputedProperty(target, _transformProp);
      return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_numExp).map(_round)
    },
    _getMatrix = function _getMatrix(target, force2D) {
      var cache = target._gsap,
        style = target.style,
        matrix = _getComputedTransformMatrixAsArray(target),
        parent, nextSibling, temp, addedToDOM;
      if (cache.svg && target.getAttribute("transform")) {
        temp = target.transform.baseVal.consolidate().matrix;
        matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
        return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix
      } else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
        temp = style.display;
        style.display = "block";
        parent = target.parentNode;
        if (!parent || !target.offsetParent) {
          addedToDOM = 1;
          nextSibling = target.nextSibling;
          _docElement.appendChild(target)
        }
        matrix = _getComputedTransformMatrixAsArray(target);
        if (temp) {
          style.display = temp
        } else {
          _removeProperty(target, "display")
        }
        if (addedToDOM) {
          if (nextSibling) {
            parent.insertBefore(target, nextSibling)
          } else if (parent) {
            parent.appendChild(target)
          } else {
            _docElement.removeChild(target)
          }
        }
      }
      return force2D && matrix.length > 6 ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]] : matrix
    },
    _applySVGOrigin = function _applySVGOrigin(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
      var cache = target._gsap,
        matrix = matrixArray || _getMatrix(target, !0),
        xOriginOld = cache.xOrigin || 0,
        yOriginOld = cache.yOrigin || 0,
        xOffsetOld = cache.xOffset || 0,
        yOffsetOld = cache.yOffset || 0,
        a = matrix[0],
        b = matrix[1],
        c = matrix[2],
        d = matrix[3],
        tx = matrix[4],
        ty = matrix[5],
        originSplit = origin.split(" "),
        xOrigin = parseFloat(originSplit[0]) || 0,
        yOrigin = parseFloat(originSplit[1]) || 0,
        bounds, determinant, x, y;
      if (!originIsAbsolute) {
        bounds = _getBBox(target);
        xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
        yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin)
      } else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
        x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
        y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
        xOrigin = x;
        yOrigin = y
      }
      if (smooth || smooth !== !1 && cache.smooth) {
        tx = xOrigin - xOriginOld;
        ty = yOrigin - yOriginOld;
        cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
        cache.yOffset = yOffsetOld + (tx * b + ty * d) - ty
      } else {
        cache.xOffset = cache.yOffset = 0
      }
      cache.xOrigin = xOrigin;
      cache.yOrigin = yOrigin;
      cache.smooth = !!smooth;
      cache.origin = origin;
      cache.originIsAbsolute = !!originIsAbsolute;
      target.style[_transformOriginProp] = "0px 0px";
      if (pluginToAddPropTweensTo) {
        _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);
        _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);
        _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);
        _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset)
      }
    },
    _parseTransform = function _parseTransform(target, uncache) {
      var cache = target._gsap || new GSCache(target);
      if ("x" in cache && !uncache && !cache.uncache) {
        return cache
      }
      var style = target.style,
        invertedScaleX = cache.scaleX < 0,
        xOrigin = cache.xOrigin || 0,
        yOrigin = cache.yOrigin || 0,
        px = "px",
        deg = "deg",
        origin = _getComputedProperty(target, _transformOriginProp) || "0",
        x, y, z, scaleX, scaleY, rotation, rotationX, rotationY, skewX, skewY, perspective, matrix, angle, cos, sin, a, b, c, d, a12, a22, t1, t2, t3, a13, a23, a33, a42, a43, a32;
      x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0;
      scaleX = scaleY = 1;
      cache.svg = !!(target.getCTM && _isSVG(target));
      matrix = _getMatrix(target, cache.svg);
      if (cache.svg) {
        _applySVGOrigin(target, origin, cache.originIsAbsolute, cache.smooth !== !1, matrix)
      }
      if (matrix !== _identity2DMatrix) {
        a = matrix[0];
        b = matrix[1];
        c = matrix[2];
        d = matrix[3];
        x = a12 = matrix[4];
        y = a22 = matrix[5];
        if (matrix.length === 6) {
          scaleX = Math.sqrt(a * a + b * b);
          scaleY = Math.sqrt(d * d + c * c);
          rotation = a || b ? _atan2(b, a) * _RAD2DEG : 0;
          skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0;
          if (cache.svg) {
            x -= xOrigin - (xOrigin * a + yOrigin * c);
            y -= yOrigin - (xOrigin * b + yOrigin * d)
          }
        } else {
          a32 = matrix[6];
          a42 = matrix[7];
          a13 = matrix[8];
          a23 = matrix[9];
          a33 = matrix[10];
          a43 = matrix[11];
          x = matrix[12];
          y = matrix[13];
          z = matrix[14];
          angle = _atan2(a32, a33);
          rotationX = angle * _RAD2DEG;
          if (angle) {
            cos = Math.cos(-angle);
            sin = Math.sin(-angle);
            t1 = a12 * cos + a13 * sin;
            t2 = a22 * cos + a23 * sin;
            t3 = a32 * cos + a33 * sin;
            a13 = a12 * -sin + a13 * cos;
            a23 = a22 * -sin + a23 * cos;
            a33 = a32 * -sin + a33 * cos;
            a43 = a42 * -sin + a43 * cos;
            a12 = t1;
            a22 = t2;
            a32 = t3
          }
          angle = _atan2(-c, a33);
          rotationY = angle * _RAD2DEG;
          if (angle) {
            cos = Math.cos(-angle);
            sin = Math.sin(-angle);
            t1 = a * cos - a13 * sin;
            t2 = b * cos - a23 * sin;
            t3 = c * cos - a33 * sin;
            a43 = d * sin + a43 * cos;
            a = t1;
            b = t2;
            c = t3
          }
          angle = _atan2(b, a);
          rotation = angle * _RAD2DEG;
          if (angle) {
            cos = Math.cos(angle);
            sin = Math.sin(angle);
            t1 = a * cos + b * sin;
            t2 = a12 * cos + a22 * sin;
            b = b * cos - a * sin;
            a22 = a22 * cos - a12 * sin;
            a = t1;
            a12 = t2
          }
          if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
            rotationX = rotation = 0;
            rotationY = 180 - rotationY
          }
          scaleX = _round(Math.sqrt(a * a + b * b + c * c));
          scaleY = _round(Math.sqrt(a22 * a22 + a32 * a32));
          angle = _atan2(a12, a22);
          skewX = Math.abs(angle) > 0.0002 ? angle * _RAD2DEG : 0;
          perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0
        }
        if (cache.svg) {
          matrix = target.getAttribute("transform");
          cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp));
          matrix && target.setAttribute("transform", matrix)
        }
      }
      if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
        if (invertedScaleX) {
          scaleX *= -1;
          skewX += rotation <= 0 ? 180 : -180;
          rotation += rotation <= 0 ? 180 : -180
        } else {
          scaleY *= -1;
          skewX += skewX <= 0 ? 180 : -180
        }
      }
      cache.x = ((cache.xPercent = x && Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0) ? 0 : x) + px;
      cache.y = ((cache.yPercent = y && Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0) ? 0 : y) + px;
      cache.z = z + px;
      cache.scaleX = _round(scaleX);
      cache.scaleY = _round(scaleY);
      cache.rotation = _round(rotation) + deg;
      cache.rotationX = _round(rotationX) + deg;
      cache.rotationY = _round(rotationY) + deg;
      cache.skewX = skewX + deg;
      cache.skewY = skewY + deg;
      cache.transformPerspective = perspective + px;
      if (cache.zOrigin = parseFloat(origin.split(" ")[2]) || 0) {
        style[_transformOriginProp] = _firstTwoOnly(origin)
      }
      cache.xOffset = cache.yOffset = 0;
      cache.force3D = _config.force3D;
      cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
      cache.uncache = 0;
      return cache
    },
    _firstTwoOnly = function _firstTwoOnly(value) {
      return (value = value.split(" "))[0] + " " + value[1]
    },
    _addPxTranslate = function _addPxTranslate(target, start, value) {
      var unit = getUnit(start);
      return _round(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit
    },
    _renderNon3DTransforms = function _renderNon3DTransforms(ratio, cache) {
      cache.z = "0px";
      cache.rotationY = cache.rotationX = "0deg";
      cache.force3D = 0;
      _renderCSSTransforms(ratio, cache)
    },
    _zeroDeg = "0deg",
    _zeroPx = "0px",
    _endParenthesis = ") ",
    _renderCSSTransforms = function _renderCSSTransforms(ratio, cache) {
      var _ref = cache || this,
        xPercent = _ref.xPercent,
        yPercent = _ref.yPercent,
        x = _ref.x,
        y = _ref.y,
        z = _ref.z,
        rotation = _ref.rotation,
        rotationY = _ref.rotationY,
        rotationX = _ref.rotationX,
        skewX = _ref.skewX,
        skewY = _ref.skewY,
        scaleX = _ref.scaleX,
        scaleY = _ref.scaleY,
        transformPerspective = _ref.transformPerspective,
        force3D = _ref.force3D,
        target = _ref.target,
        zOrigin = _ref.zOrigin,
        transforms = "",
        use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === !0;
      if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
        var angle = parseFloat(rotationY) * _DEG2RAD,
          a13 = Math.sin(angle),
          a33 = Math.cos(angle),
          cos;
        angle = parseFloat(rotationX) * _DEG2RAD;
        cos = Math.cos(angle);
        x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
        y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
        z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin)
      }
      if (transformPerspective !== _zeroPx) {
        transforms += "perspective(" + transformPerspective + _endParenthesis
      }
      if (xPercent || yPercent) {
        transforms += "translate(" + xPercent + "%, " + yPercent + "%) "
      }
      if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) {
        transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis
      }
      if (rotation !== _zeroDeg) {
        transforms += "rotate(" + rotation + _endParenthesis
      }
      if (rotationY !== _zeroDeg) {
        transforms += "rotateY(" + rotationY + _endParenthesis
      }
      if (rotationX !== _zeroDeg) {
        transforms += "rotateX(" + rotationX + _endParenthesis
      }
      if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
        transforms += "skew(" + skewX + ", " + skewY + _endParenthesis
      }
      if (scaleX !== 1 || scaleY !== 1) {
        transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis
      }
      target.style[_transformProp] = transforms || "translate(0, 0)"
    },
    _renderSVGTransforms = function _renderSVGTransforms(ratio, cache) {
      var _ref2 = cache || this,
        xPercent = _ref2.xPercent,
        yPercent = _ref2.yPercent,
        x = _ref2.x,
        y = _ref2.y,
        rotation = _ref2.rotation,
        skewX = _ref2.skewX,
        skewY = _ref2.skewY,
        scaleX = _ref2.scaleX,
        scaleY = _ref2.scaleY,
        target = _ref2.target,
        xOrigin = _ref2.xOrigin,
        yOrigin = _ref2.yOrigin,
        xOffset = _ref2.xOffset,
        yOffset = _ref2.yOffset,
        forceCSS = _ref2.forceCSS,
        tx = parseFloat(x),
        ty = parseFloat(y),
        a11, a21, a12, a22, temp;
      rotation = parseFloat(rotation);
      skewX = parseFloat(skewX);
      skewY = parseFloat(skewY);
      if (skewY) {
        skewY = parseFloat(skewY);
        skewX += skewY;
        rotation += skewY
      }
      if (rotation || skewX) {
        rotation *= _DEG2RAD;
        skewX *= _DEG2RAD;
        a11 = Math.cos(rotation) * scaleX;
        a21 = Math.sin(rotation) * scaleX;
        a12 = Math.sin(rotation - skewX) * -scaleY;
        a22 = Math.cos(rotation - skewX) * scaleY;
        if (skewX) {
          skewY *= _DEG2RAD;
          temp = Math.tan(skewX - skewY);
          temp = Math.sqrt(1 + temp * temp);
          a12 *= temp;
          a22 *= temp;
          if (skewY) {
            temp = Math.tan(skewY);
            temp = Math.sqrt(1 + temp * temp);
            a11 *= temp;
            a21 *= temp
          }
        }
        a11 = _round(a11);
        a21 = _round(a21);
        a12 = _round(a12);
        a22 = _round(a22)
      } else {
        a11 = scaleX;
        a22 = scaleY;
        a21 = a12 = 0
      }
      if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
        tx = _convertToUnit(target, "x", x, "px");
        ty = _convertToUnit(target, "y", y, "px")
      }
      if (xOrigin || yOrigin || xOffset || yOffset) {
        tx = _round(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
        ty = _round(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset)
      }
      if (xPercent || yPercent) {
        temp = target.getBBox();
        tx = _round(tx + xPercent / 100 * temp.width);
        ty = _round(ty + yPercent / 100 * temp.height)
      }
      temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
      target.setAttribute("transform", temp);
      if (forceCSS) {
        target.style[_transformProp] = temp
      }
    },
    _addRotationalPropTween = function _addRotationalPropTween(plugin, target, property, startNum, endValue, relative) {
      var cap = 360,
        isString = _isString(endValue),
        endNum = parseFloat(endValue) * (isString && ~endValue.indexOf("rad") ? _RAD2DEG : 1),
        change = relative ? endNum * relative : endNum - startNum,
        finalValue = startNum + change + "deg",
        direction, pt;
      if (isString) {
        direction = endValue.split("_")[1];
        if (direction === "short") {
          change %= cap;
          if (change !== change % (cap / 2)) {
            change += change < 0 ? cap : -cap
          }
        }
        if (direction === "cw" && change < 0) {
          change = (change + cap * _bigNum$1) % cap - ~~(change / cap) * cap
        } else if (direction === "ccw" && change > 0) {
          change = (change - cap * _bigNum$1) % cap - ~~(change / cap) * cap
        }
      }
      plugin._pt = pt = new PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
      pt.e = finalValue;
      pt.u = "deg";
      plugin._props.push(property);
      return pt
    },
    _addRawTransformPTs = function _addRawTransformPTs(plugin, transforms, target) {
      var style = _tempDivStyler.style,
        startCache = target._gsap,
        exclude = "perspective,force3D,transformOrigin,svgOrigin",
        endCache, p, startValue, endValue, startNum, endNum, startUnit, endUnit;
      style.cssText = getComputedStyle(target).cssText + ";position:absolute;display:block;";
      style[_transformProp] = transforms;
      _doc$1.body.appendChild(_tempDivStyler);
      endCache = _parseTransform(_tempDivStyler, 1);
      for (p in _transformProps) {
        startValue = startCache[p];
        endValue = endCache[p];
        if (startValue !== endValue && exclude.indexOf(p) < 0) {
          startUnit = getUnit(startValue);
          endUnit = getUnit(endValue);
          startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
          endNum = parseFloat(endValue);
          plugin._pt = new PropTween(plugin._pt, startCache, p, startNum, endNum - startNum, _renderCSSProp);
          plugin._pt.u = endUnit || 0;
          plugin._props.push(p)
        }
      }
      _doc$1.body.removeChild(_tempDivStyler)
    };
  _forEachName("padding,margin,Width,Radius", function (name, index) {
    var t = "Top",
      r = "Right",
      b = "Bottom",
      l = "Left",
      props = (index < 3 ? [t, r, b, l] : [t + l, t + r, b + r, b + l]).map(function (side) {
        return index < 2 ? name + side : "border" + side + name
      });
    _specialProps[index > 1 ? "border" + name : name] = function (plugin, target, property, endValue, tween) {
      var a, vars;
      if (arguments.length < 4) {
        a = props.map(function (prop) {
          return _get(plugin, prop, property)
        });
        vars = a.join(" ");
        return vars.split(a[0]).length === 5 ? a[0] : vars
      }
      a = (endValue + "").split(" ");
      vars = {};
      props.forEach(function (prop, i) {
        return vars[prop] = a[i] = a[i] || a[(i - 1) / 2 | 0]
      });
      plugin.init(target, vars, tween)
    }
  });
  var CSSPlugin = {
    name: "css",
    register: _initCore,
    targetTest: function targetTest(target) {
      return target.style && target.nodeType
    },
    init: function init(target, vars, tween, index, targets) {
      var props = this._props,
        style = target.style,
        startValue, endValue, endNum, startNum, type, specialProp, p, startUnit, endUnit, relative, isTransformRelated, transformPropTween, cache, smooth, hasPriority;
      if (!_pluginInitted) {
        _initCore()
      }
      for (p in vars) {
        if (p === "autoRound") {
          continue
        }
        endValue = vars[p];
        if (_plugins[p] && _checkPlugin(p, vars, tween, index, target, targets)) {
          continue
        }
        type = typeof endValue;
        specialProp = _specialProps[p];
        if (type === "function") {
          endValue = endValue.call(tween, index, target, targets);
          type = typeof endValue
        }
        if (type === "string" && ~endValue.indexOf("random(")) {
          endValue = _replaceRandom(endValue)
        }
        if (specialProp) {
          if (specialProp(this, target, p, endValue, tween)) {
            hasPriority = 1
          }
        } else if (p.substr(0, 2) === "--") {
          this.add(style, "setProperty", getComputedStyle(target).getPropertyValue(p) + "", endValue + "", index, targets, 0, 0, p)
        } else {
          startValue = _get(target, p);
          startNum = parseFloat(startValue);
          relative = type === "string" && endValue.charAt(1) === "=" ? +(endValue.charAt(0) + "1") : 0;
          if (relative) {
            endValue = endValue.substr(2)
          }
          endNum = parseFloat(endValue);
          if (p in _propertyAliases) {
            if (p === "autoAlpha") {
              if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) {
                startNum = 0
              }
              _addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum)
            }
            if (p !== "scale" && p !== "transform") {
              p = _propertyAliases[p];
              if (~p.indexOf(",")) {
                p = p.split(",")[0]
              }
            }
          }
          isTransformRelated = p in _transformProps;
          if (isTransformRelated) {
            if (!transformPropTween) {
              cache = target._gsap;
              cache.renderTransform || _parseTransform(target);
              smooth = vars.smoothOrigin !== !1 && cache.smooth;
              transformPropTween = this._pt = new PropTween(this._pt, style, _transformProp, 0, 1, cache.renderTransform, cache, 0, -1);
              transformPropTween.dep = 1
            }
            if (p === "scale") {
              this._pt = new PropTween(this._pt, cache, "scaleY", cache.scaleY, relative ? relative * endNum : endNum - cache.scaleY);
              props.push("scaleY", p);
              p += "X"
            } else if (p === "transformOrigin") {
              endValue = _convertKeywordsToPercentages(endValue);
              if (cache.svg) {
                _applySVGOrigin(target, endValue, 0, smooth, 0, this)
              } else {
                endUnit = parseFloat(endValue.split(" ")[2]);
                if (endUnit !== cache.zOrigin) {
                  _addNonTweeningPT(this, cache, "zOrigin", cache.zOrigin, endUnit)
                }
                _addNonTweeningPT(this, style, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue))
              }
              continue
            } else if (p === "svgOrigin") {
              _applySVGOrigin(target, endValue, 1, smooth, 0, this);
              continue
            } else if (p in _rotationalProperties) {
              _addRotationalPropTween(this, cache, p, startNum, endValue, relative);
              continue
            } else if (p === "smoothOrigin") {
              _addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);
              continue
            } else if (p === "force3D") {
              cache[p] = endValue;
              continue
            } else if (p === "transform") {
              _addRawTransformPTs(this, endValue, target);
              continue
            }
          } else if (!(p in style)) {
            p = _checkPropPrefix(p) || p
          }
          if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style) {
            startUnit = (startValue + "").substr((startNum + "").length);
            endUnit = (endValue + "").substr((endNum + "").length) || (p in _config.units ? _config.units[p] : startUnit);
            if (startUnit !== endUnit) {
              startNum = _convertToUnit(target, p, startValue, endUnit)
            }
            this._pt = new PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, relative ? relative * endNum : endNum - startNum, endUnit === "px" && vars.autoRound !== !1 && !isTransformRelated ? _renderRoundedCSSProp : _renderCSSProp);
            this._pt.u = endUnit || 0;
            if (startUnit !== endUnit) {
              this._pt.b = startValue;
              this._pt.r = _renderCSSPropWithBeginning
            }
          } else if (!(p in style)) {
            if (p in target) {
              this.add(target, p, target[p], endValue, index, targets)
            } else {
              _missingPlugin(p, endValue);
              continue
            }
          } else {
            _tweenComplexCSSString.call(this, target, p, startValue, endValue)
          }
          props.push(p)
        }
      }
      if (hasPriority) {
        _sortPropTweensByPriority(this)
      }
    },
    get: _get,
    aliases: _propertyAliases,
    getSetter: function getSetter(target, property, plugin) {
      property = _propertyAliases[property] || property;
      return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !_isUndefined(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : _getSetter(target, property)
    }
  };
  gsap.utils.checkPrefix = _checkPropPrefix;
  (function (positionAndScale, rotation, others, aliases) {
    var all = _forEachName(positionAndScale + "," + rotation + "," + others, function (name) {
      _transformProps[name] = 1
    });
    _forEachName(rotation, function (name) {
      _config.units[name] = "deg";
      _rotationalProperties[name] = 1
    });
    _propertyAliases[all[13]] = positionAndScale + "," + rotation;
    _forEachName(aliases, function (name) {
      var split = name.split(":");
      _propertyAliases[split[1]] = all[split[0]]
    })
  })("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
  _forEachName("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function (name) {
    _config.units[name] = "px"
  });
  gsap.registerPlugin(CSSPlugin);
  var gsapWithCSS = gsap.registerPlugin(CSSPlugin) || gsap,
    TweenMaxWithCSS = gsapWithCSS.core.Tween;
  exports.Back = Back;
  exports.Bounce = Bounce;
  exports.CSSPlugin = CSSPlugin;
  exports.Circ = Circ;
  exports.Cubic = Cubic;
  exports.Elastic = Elastic;
  exports.Expo = Expo;
  exports.Linear = Linear;
  exports.Power0 = Power0;
  exports.Power1 = Power1;
  exports.Power2 = Power2;
  exports.Power3 = Power3;
  exports.Power4 = Power4;
  exports.Quad = Quad;
  exports.Quart = Quart;
  exports.Quint = Quint;
  exports.Sine = Sine;
  exports.SteppedEase = SteppedEase;
  exports.Strong = Strong;
  exports.TimelineLite = Timeline;
  exports.TimelineMax = Timeline;
  exports.TweenLite = Tween;
  exports.TweenMax = TweenMaxWithCSS;
  exports.default = gsapWithCSS;
  exports.gsap = gsapWithCSS;
  if (typeof (window) === 'undefined' || window !== exports) {
    Object.defineProperty(exports, '__esModule', {
      value: !0
    })
  } else {
    delete window.default
  }
})));
"use strict";

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable
    });
    keys.push.apply(keys, symbols)
  }
  return keys
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key])
      })
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key))
      })
    }
  }
  return target
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    })
  } else {
    obj[key] = value
  }
  return obj
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function")
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || !1;
    descriptor.configurable = !0;
    if ("value" in descriptor) descriptor.writable = !0;
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor
}
var FFSlider = function () {
  function FFSlider(ele, param) {
    _classCallCheck(this, FFSlider);
    this.init(ele, param)
  }
  _createClass(FFSlider, [{
    key: "init",
    value: function init(ele, param) {
      var _this = this;
      if (!ele.length) {
        return !1
      }
      _this.param = {};
      _this.param.default_element_index = 0;
      _this.param.default_slide_index = 0;
      _this.param.slides_to_show = 1;
      _this.param.elements_by_slide = 1;
      _this.param.anim_type = "slide";
      _this.param.auto_play = 0;
      _this.param.stop_on_click = !0;
      _this.param.loop = !0;
      _this.param.fill = !1;
      _this.param.speed = 1e3;
      _this.param.easing = Power0.easeNone;
      _this.param.show_thumbnails = !1;
      _this.param = _objectSpread({}, _this.param, {}, param);
      if (_this.param.slides_to_show % 2 == 0) {
        console.log('FFSlider: Le paramètre "slides_to_show" dois être un nombre impair, il a été ajusté de "' + _this.param.slides_to_show + '" à "' + (_this.param.slides_to_show + 1) + '"');
        _this.param.slides_to_show++
      }
      if (_this.param.fill && (_this.param.show_thumbnails || !_this.param.loop || _this.param.elements_by_slide == 1)) {
        _this.param.fill = !1;
        console.log('FFSlider: Le paramètre "fill=true" ne peut être combiné avec "show_thumbnails=true", "loop=false" ou "elements_by_slide=1". Celui-ci a été désactivé.')
      }
      _this.current_element_index = _this.param.default_element_index;
      _this.current_slide_index = _this.param.default_slide_index;
      _this.slider = ele;
      _this.slides = !1;
      _this.total_slides = 0;
      _this.elements = _this.slider.find(".slides > *");
      _this.total_elements = _this.elements.length;
      _this.nav = {};
      _this.nav.next = _this.slider.find(".nav.next");
      _this.nav.prev = _this.slider.find(".nav.prev");
      _this.nav_is_locked = !1;
      _this.slider.find(".slides").empty().show();
      _this.nav.next.click(function () {
        _this.next()
      });
      _this.nav.prev.click(function () {
        _this.prev()
      });
      var index_center = parseInt(_this.param.slides_to_show / 2);
      if (_this.param.fill) {
        for (var index_slide = 0; index_slide < _this.param.slides_to_show; index_slide++) {
          var html_element = "";
          for (var index_element = 0; index_element < _this.param.elements_by_slide; index_element++) {
            var mathemagic = index_slide * _this.param.elements_by_slide + index_element - index_center * _this.param.elements_by_slide;
            var element_index = _this.getElementIndex(mathemagic);
            var element = _this.elements.eq(element_index);
            html_element += element.wrap("<div></div>").parent().html()
          }
          _this.slider.find(".slides").append('<div class="slide ' + (index_center == index_slide ? "active" : "") + '" >' + html_element + "</div>")
        }
      } else {
        _this.slides = new Array;
        _this.elements.each(function (index_element, e) {
          var index_slide = parseInt(index_element / _this.param.elements_by_slide);
          if (_this.slides[index_slide] == null) {
            _this.slides[index_slide] = new Array
          }
          _this.slides[index_slide].push(index_element)
        });
        _this.total_slides = _this.slides.length;
        for (var index_slide = index_center * -1; index_slide < _this.param.slides_to_show - index_center; index_slide++) {
          _this.slider.find(".slides").append('<div class="slide ' + (index_slide == 0 ? "active" : "") + ' " >' + _this.getSlideHtml(_this.getSlideIndex(index_slide)) + "</div>")
        }
      }
      if (_this.param.show_thumbnails) {
        _this.slider.append('<div class="thumbnails" ></div>');
        $.each(_this.slides, function (i) {
          _this.slider.find(".thumbnails").append('<a class="' + (i == 0 ? "active" : "") + '" ></a>')
        });
        _this.slider.find(".thumbnails > a").click(function () {
          if (!_this.nav_is_locked) {
            _this.slider.find(".thumbnails > a").removeClass("active");
            $(this).addClass("active");
            _this.goToSlide($(this).index())
          }
        })
      }
      $(_this.slider).on("click", ".slide", function () {
        if (!_this.nav_is_locked && !$(this).hasClass("active")) {
          var current_index = $(this).index();
          var active_index = $(_this.slider).find(".slide.active").index();
          var offset = current_index - active_index;
          _this.goToSlide(offset.toString())
        }
      });
      if (_this.param.after_init != null) {
        _this.param.after_init({
          slider: _this,
          current_active_slide: _this.slider.find(".slide.active")
        })
      }
    }
  }, {
    key: "lockNav",
    value: function lockNav() {
      var _this = this;
      _this.nav.next.css("pointer-events", "none");
      _this.nav.prev.css("pointer-events", "none");
      _this.nav_is_locked = !0
    }
  }, {
    key: "unlockNav",
    value: function unlockNav() {
      var _this = this;
      _this.nav.next.css("pointer-events", "");
      _this.nav.prev.css("pointer-events", "");
      _this.nav_is_locked = !1
    }
  }, {
    key: "resize",
    value: function resize() {
      var _this = this
    }
  }, {
    key: "isMobile",
    value: function isMobile() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        is_mobile = !0
      } else {
        is_mobile = !1
      }
      return is_mobile
    }
  }, {
    key: "getElementIndex",
    value: function getElementIndex(element_index) {
      var _this = this;
      element_index = element_index - parseInt(element_index / _this.total_elements) * _this.total_elements;
      return element_index
    }
  }, {
    key: "getSlideIndex",
    value: function getSlideIndex(slide_index) {
      var _this = this;
      var mathemagic = slide_index - parseInt(slide_index / _this.total_slides) * _this.total_slides;
      if (mathemagic < 0) {
        mathemagic = _this.total_slides + mathemagic
      }
      return mathemagic
    }
  }, {
    key: "next",
    value: function next() {
      this.goToSlide("+1")
    }
  }, {
    key: "prev",
    value: function prev() {
      this.goToSlide("-1")
    }
  }, {
    key: "getSlideHtml",
    value: function getSlideHtml(index_slide) {
      var _this = this;
      var html_elements = "";
      for (var element_index = 0; element_index < _this.slides[index_slide].length; element_index++) {
        var element_id = _this.slides[index_slide][element_index];
        var element = _this.elements.eq(element_id);
        var element_html = element.wrap("<div></div>").parent().html();
        html_elements += element_html
      }
      return html_elements
    }
  }, {
    key: "getNextSlideHtml",
    value: function getNextSlideHtml(options) {
      var _this = this;
      var default_options = {};
      default_options.empty = !1;
      options = _objectSpread({}, default_options, {}, options);
      var html = "";
      if (!options.empty) {
        if (_this.param.fill) {
          for (var index_element = 0; index_element < _this.param.elements_by_slide; index_element++) {
            var center = _this.param.elements_by_slide * _this.param.slides_to_show / 2;
            var offset = center % _this.param.elements_by_slide;
            var mathemagic = _this.current_element_index + index_element + center + offset;
            var element_index = _this.getElementIndex(mathemagic);
            var element = _this.elements.eq(element_index);
            html += element.wrap("<div></div>").parent().html()
          }
        } else {
          var center = Math.ceil(_this.param.slides_to_show / 2);
          var slide_index = _this.getSlideIndex(_this.current_slide_index + center);
          html += _this.getSlideHtml(slide_index)
        }
      }
      html = '<div class="slide ' + (options.empty ? "empty" : "") + '" >' + html + "</div>";
      return html
    }
  }, {
    key: "getPrevSlideHtml",
    value: function getPrevSlideHtml(options) {
      var _this = this;
      var default_options = {};
      default_options.empty = !1;
      options = _objectSpread({}, default_options, {}, options);
      var html = "";
      if (!options.empty) {
        if (_this.param.fill) {
          for (var index_element = 0; index_element < _this.param.elements_by_slide; index_element++) {
            var center = _this.param.elements_by_slide * _this.param.slides_to_show / 2;
            var offset = center % _this.param.elements_by_slide;
            var mathemagic = _this.current_element_index + index_element - center - offset;
            var element_index = _this.getElementIndex(mathemagic);
            var element = _this.elements.eq(element_index);
            html += element.wrap("<div></div>").parent().html()
          }
        } else {
          var center = Math.ceil(_this.param.slides_to_show / 2);
          var slide_index = _this.getSlideIndex(_this.current_slide_index - center);
          html += _this.getSlideHtml(slide_index)
        }
      }
      html = '<div class="slide ' + (options.empty ? "empty" : "") + '" >' + html + "</div>";
      return html
    }
  }, {
    key: "goToSlide",
    value: function goToSlide(slide_index) {
      var _this = this;
      var slide_index_type = typeof slide_index == "string" ? "relative" : "absolute";
      slide_index = parseInt(slide_index);
      if (slide_index_type == "absolute") {
        var current_index = slide_index;
        var active_index = _this.current_slide_index;
        var offset = current_index - active_index
      } else {
        var offset = slide_index
      }
      var direction_value = offset > 0 ? 1 : -1;
      var direction = direction_value == 1 ? "next" : "prev";
      for (var index = 0; index < Math.abs(offset); index++) {
        if (!(_this.param.slides_to_show == 1 && index != Math.abs(offset) - 1)) {
          var prev_slide_html = _this.getPrevSlideHtml({
            empty: direction == "next" ? true : !1
          });
          _this.slider.find(".slides").prepend(prev_slide_html);
          var next_slide_html = _this.getNextSlideHtml({
            empty: direction == "prev" ? true : !1
          });
          _this.slider.find(".slides").append(next_slide_html)
        }
        if (_this.param.fill) {
          _this.current_element_index = _this.getElementIndex(_this.current_element_index + _this.param.elements_by_slide * direction_value)
        } else {
          _this.current_slide_index = _this.getSlideIndex(_this.current_slide_index + direction_value)
        }
        if (_this.param.after_slide_added != null) {
          _this.param.after_slide_added({
            slider: _this,
            slide_added: direction == "next" ? _this.slider.find(".slides > .slide").last() : _this.slider.find(".slides > .slide").eq(0),
            direction: direction
          })
        }
      }
      var prev_active_slide = _this.slider.find(".slide.active");
      if (_this.param.slides_to_show == 1) {
        var next_active_slide = _this.slider.find('.slide:not(".active"):not(".empty")')
      } else {
        var next_active_slide = _this.slider.find(".slide").eq(parseInt(_this.slider.find(".slide").length / 2) + offset)
      }
      if (_this.param.before_slide_anim != null) {
        _this.param.before_slide_anim({
          slider: _this,
          current_active_slide: prev_active_slide,
          next_active_slide: next_active_slide,
          direction: direction
        })
      }
      _this.slider.find(".slide").removeClass("active");
      next_active_slide.addClass("active");
      if (_this.param.show_thumbnails) {
        _this.slider.find(".thumbnails > a").removeClass("active");
        _this.slider.find(".thumbnails > a").eq(_this.current_slide_index).addClass("active")
      }
      _this.lockNav();
      if (_this.param.anim_type == "slide") {
        var slide = _this.slider.find(".slide").eq(0);
        var slide_width = slide.outerWidth(!0);
        gsap.to(_this.slider.find(".slides"), _this.param.speed / 1e3, {
          ease: _this.param.easing,
          x: slide_width * ((_this.param.slides_to_show == 1 ? direction_value : offset) * -1),
          onComplete: function onComplete() {
            for (var _index = 0; _index < Math.abs(_this.param.slides_to_show == 1 ? direction_value : offset) * 2; _index++) {
              if (_this.param.before_slide_removed != null) {
                if (direction == "next") {
                  var ele_to_remove = _this.slider.find(".slide").eq(0)
                } else {
                  var ele_to_remove = _this.slider.find(".slide").last()
                }
                if (!ele_to_remove.hasClass("empty")) {
                  _this.param.before_slide_removed({
                    slider: _this,
                    slide_removed: direction == "next" ? _this.slider.find(".slide").eq(0) : _this.slider.find(".slide").last(),
                    direction: direction
                  })
                }
              }
              if (direction == "next") {
                _this.slider.find(".slide").eq(0).remove()
              } else {
                _this.slider.find(".slide").last().remove()
              }
            }
            gsap.set(_this.slider.find(".slides"), {
              x: "0"
            });
            _this.unlockNav();
            if (_this.param.after_slide_anim != null) {
              _this.param.after_slide_anim({
                slider: _this,
                current_active_slide: next_active_slide,
                prev_active_slide: prev_active_slide,
                direction: direction
              })
            }
          }
        })
      } else if (_this.param.anim_type == "fade") {
        _this.slider.find(".slide.empty").remove();
        prev_active_slide.css("position", "absolute");
        prev_active_slide.css("top", 0);
        prev_active_slide.css("left", 0);
        prev_active_slide.css("right", 0);
        prev_active_slide.css("bottom", 0);
        prev_active_slide.css("z-index", 0);
        next_active_slide.css("position", "absolute");
        next_active_slide.css("top", 0);
        next_active_slide.css("left", 0);
        next_active_slide.css("right", 0);
        next_active_slide.css("bottom", 0);
        next_active_slide.css("z-index", 1);
        next_active_slide.css("display", "none");
        next_active_slide.fadeIn(_this.param.speed, function () {
          prev_active_slide.remove();
          $(this).removeAttr("style");
          _this.unlockNav();
          if (_this.param.after_slide_anim != null) {
            _this.param.after_slide_anim({
              slider: _this,
              current_active_slide: next_active_slide,
              direction: direction
            })
          }
        })
      }
    }
  }]);
  return FFSlider
}(); /*! ScrollMagic v2.0.7 | (c) 2019 Jan Paepke (@janpaepke) | license & info: http://scrollmagic.io */
! function (e, t) {
  "function" == typeof define && define.amd ? define(t) : "object" == typeof exports ? module.exports = t() : e.ScrollMagic = t()
}(this, function () {
  "use strict";
  var _ = function () {};
  _.version = "2.0.7", window.addEventListener("mousewheel", function () {});
  var P = "data-scrollmagic-pin-spacer";
  _.Controller = function (e) {
    var n, r, i = "REVERSE",
      t = "PAUSED",
      o = z.defaults,
      s = this,
      a = R.extend({}, o, e),
      l = [],
      c = !1,
      f = 0,
      u = t,
      d = !0,
      h = 0,
      p = !0,
      g = function () {
        0 < a.refreshInterval && (r = window.setTimeout(E, a.refreshInterval))
      },
      v = function () {
        return a.vertical ? R.get.scrollTop(a.container) : R.get.scrollLeft(a.container)
      },
      m = function () {
        return a.vertical ? R.get.height(a.container) : R.get.width(a.container)
      },
      w = this._setScrollPos = function (e) {
        a.vertical ? d ? window.scrollTo(R.get.scrollLeft(), e) : a.container.scrollTop = e : d ? window.scrollTo(e, R.get.scrollTop()) : a.container.scrollLeft = e
      },
      y = function () {
        if (p && c) {
          var e = R.type.Array(c) ? c : l.slice(0);
          c = !1;
          var t = f,
            n = (f = s.scrollPos()) - t;
          0 !== n && (u = 0 < n ? "FORWARD" : i), u === i && e.reverse(), e.forEach(function (e, t) {
            e.update(!0)
          })
        }
      },
      S = function () {
        n = R.rAF(y)
      },
      b = function (e) {
        "resize" == e.type && (h = m(), u = t), !0 !== c && (c = !0, S())
      },
      E = function () {
        if (!d && h != m()) {
          var t;
          try {
            t = new Event("resize", {
              bubbles: !1,
              cancelable: !1
            })
          } catch (e) {
            (t = document.createEvent("Event")).initEvent("resize", !1, !1)
          }
          a.container.dispatchEvent(t)
        }
        l.forEach(function (e, t) {
          e.refresh()
        }), g()
      };
    this._options = a;
    var x = function (e) {
      if (e.length <= 1) return e;
      var t = e.slice(0);
      return t.sort(function (e, t) {
        return e.scrollOffset() > t.scrollOffset() ? 1 : -1
      }), t
    };
    return this.addScene = function (e) {
        if (R.type.Array(e)) e.forEach(function (e, t) {
          s.addScene(e)
        });
        else if (e instanceof _.Scene)
          if (e.controller() !== s) e.addTo(s);
          else if (l.indexOf(e) < 0)
          for (var t in l.push(e), l = x(l), e.on("shift.controller_sort", function () {
              l = x(l)
            }), a.globalSceneOptions) e[t] && e[t].call(e, a.globalSceneOptions[t]);
        return s
      }, this.removeScene = function (e) {
        if (R.type.Array(e)) e.forEach(function (e, t) {
          s.removeScene(e)
        });
        else {
          var t = l.indexOf(e); - 1 < t && (e.off("shift.controller_sort"), l.splice(t, 1), e.remove())
        }
        return s
      }, this.updateScene = function (e, n) {
        return R.type.Array(e) ? e.forEach(function (e, t) {
          s.updateScene(e, n)
        }) : n ? e.update(!0) : !0 !== c && e instanceof _.Scene && (-1 == (c = c || []).indexOf(e) && c.push(e), c = x(c), S()), s
      }, this.update = function (e) {
        return b({
          type: "resize"
        }), e && y(), s
      }, this.scrollTo = function (e, t) {
        if (R.type.Number(e)) w.call(a.container, e, t);
        else if (e instanceof _.Scene) e.controller() === s && s.scrollTo(e.scrollOffset(), t);
        else if (R.type.Function(e)) w = e;
        else {
          var n = R.get.elements(e)[0];
          if (n) {
            for (; n.parentNode.hasAttribute(P);) n = n.parentNode;
            var r = a.vertical ? "top" : "left",
              i = R.get.offset(a.container),
              o = R.get.offset(n);
            d || (i[r] -= s.scrollPos()), s.scrollTo(o[r] - i[r], t)
          }
        }
        return s
      }, this.scrollPos = function (e) {
        return arguments.length ? (R.type.Function(e) && (v = e), s) : v.call(s)
      }, this.info = function (e) {
        var t = {
          size: h,
          vertical: a.vertical,
          scrollPos: f,
          scrollDirection: u,
          container: a.container,
          isDocument: d
        };
        return arguments.length ? void 0 !== t[e] ? t[e] : void 0 : t
      }, this.loglevel = function (e) {
        return s
      }, this.enabled = function (e) {
        return arguments.length ? (p != e && (p = !!e, s.updateScene(l, !0)), s) : p
      }, this.destroy = function (e) {
        window.clearTimeout(r);
        for (var t = l.length; t--;) l[t].destroy(e);
        return a.container.removeEventListener("resize", b), a.container.removeEventListener("scroll", b), R.cAF(n), null
      },
      function () {
        for (var e in a) o.hasOwnProperty(e) || delete a[e];
        if (a.container = R.get.elements(a.container)[0], !a.container) throw "ScrollMagic.Controller init failed.";
        (d = a.container === window || a.container === document.body || !document.body.contains(a.container)) && (a.container = window), h = m(), a.container.addEventListener("resize", b), a.container.addEventListener("scroll", b);
        var t = parseInt(a.refreshInterval, 10);
        a.refreshInterval = R.type.Number(t) ? t : o.refreshInterval, g()
      }(), s
  };
  var z = {
    defaults: {
      container: window,
      vertical: !0,
      globalSceneOptions: {},
      loglevel: 2,
      refreshInterval: 100
    }
  };
  _.Controller.addOption = function (e, t) {
    z.defaults[e] = t
  }, _.Controller.extend = function (e) {
    var t = this;
    _.Controller = function () {
      return t.apply(this, arguments), this.$super = R.extend({}, this), e.apply(this, arguments) || this
    }, R.extend(_.Controller, t), _.Controller.prototype = t.prototype, _.Controller.prototype.constructor = _.Controller
  }, _.Scene = function (e) {
    var n, l, c = "BEFORE",
      f = "DURING",
      u = "AFTER",
      r = D.defaults,
      d = this,
      h = R.extend({}, r, e),
      p = c,
      g = 0,
      a = {
        start: 0,
        end: 0
      },
      v = 0,
      i = !0,
      s = {};
    this.on = function (e, i) {
      return R.type.Function(i) && (e = e.trim().split(" ")).forEach(function (e) {
        var t = e.split("."),
          n = t[0],
          r = t[1];
        "*" != n && (s[n] || (s[n] = []), s[n].push({
          namespace: r || "",
          callback: i
        }))
      }), d
    }, this.off = function (e, o) {
      return e && (e = e.trim().split(" ")).forEach(function (e, t) {
        var n = e.split("."),
          r = n[0],
          i = n[1] || "";
        ("*" === r ? Object.keys(s) : [r]).forEach(function (e) {
          for (var t = s[e] || [], n = t.length; n--;) {
            var r = t[n];
            !r || i !== r.namespace && "*" !== i || o && o != r.callback || t.splice(n, 1)
          }
          t.length || delete s[e]
        })
      }), d
    }, this.trigger = function (e, n) {
      if (e) {
        var t = e.trim().split("."),
          r = t[0],
          i = t[1],
          o = s[r];
        o && o.forEach(function (e, t) {
          i && i !== e.namespace || e.callback.call(d, new _.Event(r, e.namespace, d, n))
        })
      }
      return d
    }, d.on("change.internal", function (e) {
      "loglevel" !== e.what && "tweenChanges" !== e.what && ("triggerElement" === e.what ? y() : "reverse" === e.what && d.update())
    }).on("shift.internal", function (e) {
      t(), d.update()
    }), this.addTo = function (e) {
      return e instanceof _.Controller && l != e && (l && l.removeScene(d), l = e, E(), o(!0), y(!0), t(), l.info("container").addEventListener("resize", S), e.addScene(d), d.trigger("add", {
        controller: l
      }), d.update()), d
    }, this.enabled = function (e) {
      return arguments.length ? (i != e && (i = !!e, d.update(!0)), d) : i
    }, this.remove = function () {
      if (l) {
        l.info("container").removeEventListener("resize", S);
        var e = l;
        l = void 0, e.removeScene(d), d.trigger("remove")
      }
      return d
    }, this.destroy = function (e) {
      return d.trigger("destroy", {
        reset: e
      }), d.remove(), d.off("*.*"), null
    }, this.update = function (e) {
      if (l)
        if (e)
          if (l.enabled() && i) {
            var t, n = l.info("scrollPos");
            t = 0 < h.duration ? (n - a.start) / (a.end - a.start) : n >= a.start ? 1 : 0, d.trigger("update", {
              startPos: a.start,
              endPos: a.end,
              scrollPos: n
            }), d.progress(t)
          } else m && p === f && C(!0);
      else l.updateScene(d, !1);
      return d
    }, this.refresh = function () {
      return o(), y(), d
    }, this.progress = function (e) {
      if (arguments.length) {
        var t = !1,
          n = p,
          r = l ? l.info("scrollDirection") : "PAUSED",
          i = h.reverse || g <= e;
        if (0 === h.duration ? (t = g != e, p = 0 === (g = e < 1 && i ? 0 : 1) ? c : f) : e < 0 && p !== c && i ? (p = c, t = !(g = 0)) : 0 <= e && e < 1 && i ? (g = e, p = f, t = !0) : 1 <= e && p !== u ? (g = 1, p = u, t = !0) : p !== f || i || C(), t) {
          var o = {
              progress: g,
              state: p,
              scrollDirection: r
            },
            s = p != n,
            a = function (e) {
              d.trigger(e, o)
            };
          s && n !== f && (a("enter"), a(n === c ? "start" : "end")), a("progress"), s && p !== f && (a(p === c ? "start" : "end"), a("leave"))
        }
        return d
      }
      return g
    };
    var m, w, t = function () {
        a = {
          start: v + h.offset
        }, l && h.triggerElement && (a.start -= l.info("size") * h.triggerHook), a.end = a.start + h.duration
      },
      o = function (e) {
        if (n) {
          var t = "duration";
          x(t, n.call(d)) && !e && (d.trigger("change", {
            what: t,
            newval: h[t]
          }), d.trigger("shift", {
            reason: t
          }))
        }
      },
      y = function (e) {
        var t = 0,
          n = h.triggerElement;
        if (l && (n || 0 < v)) {
          if (n)
            if (n.parentNode) {
              for (var r = l.info(), i = R.get.offset(r.container), o = r.vertical ? "top" : "left"; n.parentNode.hasAttribute(P);) n = n.parentNode;
              var s = R.get.offset(n);
              r.isDocument || (i[o] -= l.scrollPos()), t = s[o] - i[o]
            } else d.triggerElement(void 0);
          var a = t != v;
          v = t, a && !e && d.trigger("shift", {
            reason: "triggerElementPosition"
          })
        }
      },
      S = function (e) {
        0 < h.triggerHook && d.trigger("shift", {
          reason: "containerResize"
        })
      },
      b = R.extend(D.validate, {
        duration: function (t) {
          if (R.type.String(t) && t.match(/^(\.|\d)*\d+%$/)) {
            var e = parseFloat(t) / 100;
            t = function () {
              return l ? l.info("size") * e : 0
            }
          }
          if (R.type.Function(t)) {
            n = t;
            try {
              t = parseFloat(n.call(d))
            } catch (e) {
              t = -1
            }
          }
          if (t = parseFloat(t), !R.type.Number(t) || t < 0) throw n && (n = void 0), 0;
          return t
        }
      }),
      E = function (e) {
        (e = arguments.length ? [e] : Object.keys(b)).forEach(function (t, e) {
          var n;
          if (b[t]) try {
            n = b[t](h[t])
          } catch (e) {
            n = r[t]
          } finally {
            h[t] = n
          }
        })
      },
      x = function (e, t) {
        var n = !1,
          r = h[e];
        return h[e] != t && (h[e] = t, E(e), n = r != h[e]), n
      },
      z = function (t) {
        d[t] || (d[t] = function (e) {
          return arguments.length ? ("duration" === t && (n = void 0), x(t, e) && (d.trigger("change", {
            what: t,
            newval: h[t]
          }), -1 < D.shifts.indexOf(t) && d.trigger("shift", {
            reason: t
          })), d) : h[t]
        })
      };
    this.controller = function () {
      return l
    }, this.state = function () {
      return p
    }, this.scrollOffset = function () {
      return a.start
    }, this.triggerPosition = function () {
      var e = h.offset;
      return l && (h.triggerElement ? e += v : e += l.info("size") * d.triggerHook()), e
    }, d.on("shift.internal", function (e) {
      var t = "duration" === e.reason;
      (p === u && t || p === f && 0 === h.duration) && C(), t && F()
    }).on("progress.internal", function (e) {
      C()
    }).on("add.internal", function (e) {
      F()
    }).on("destroy.internal", function (e) {
      d.removePin(e.reset)
    });
    var C = function (e) {
        if (m && l) {
          var t = l.info(),
            n = w.spacer.firstChild;
          if (e || p !== f) {
            var r = {
                position: w.inFlow ? "relative" : "absolute",
                top: 0,
                left: 0
              },
              i = R.css(n, "position") != r.position;
            w.pushFollowers ? 0 < h.duration && (p === u && 0 === parseFloat(R.css(w.spacer, "padding-top")) ? i = !0 : p === c && 0 === parseFloat(R.css(w.spacer, "padding-bottom")) && (i = !0)) : r[t.vertical ? "top" : "left"] = h.duration * g, R.css(n, r), i && F()
          } else {
            "fixed" != R.css(n, "position") && (R.css(n, {
              position: "fixed"
            }), F());
            var o = R.get.offset(w.spacer, !0),
              s = h.reverse || 0 === h.duration ? t.scrollPos - a.start : Math.round(g * h.duration * 10) / 10;
            o[t.vertical ? "top" : "left"] += s, R.css(w.spacer.firstChild, {
              top: o.top,
              left: o.left
            })
          }
        }
      },
      F = function () {
        if (m && l && w.inFlow) {
          var e = p === f,
            t = l.info("vertical"),
            n = w.spacer.firstChild,
            r = R.isMarginCollapseType(R.css(w.spacer, "display")),
            i = {};
          w.relSize.width || w.relSize.autoFullWidth ? e ? R.css(m, {
            width: R.get.width(w.spacer)
          }) : R.css(m, {
            width: "100%"
          }) : (i["min-width"] = R.get.width(t ? m : n, !0, !0), i.width = e ? i["min-width"] : "auto"), w.relSize.height ? e ? R.css(m, {
            height: R.get.height(w.spacer) - (w.pushFollowers ? h.duration : 0)
          }) : R.css(m, {
            height: "100%"
          }) : (i["min-height"] = R.get.height(t ? n : m, !0, !r), i.height = e ? i["min-height"] : "auto"), w.pushFollowers && (i["padding" + (t ? "Top" : "Left")] = h.duration * g, i["padding" + (t ? "Bottom" : "Right")] = h.duration * (1 - g)), R.css(w.spacer, i)
        }
      },
      L = function () {
        l && m && p === f && !l.info("isDocument") && C()
      },
      T = function () {
        l && m && p === f && ((w.relSize.width || w.relSize.autoFullWidth) && R.get.width(window) != R.get.width(w.spacer.parentNode) || w.relSize.height && R.get.height(window) != R.get.height(w.spacer.parentNode)) && F()
      },
      A = function (e) {
        l && m && p === f && !l.info("isDocument") && (e.preventDefault(), l._setScrollPos(l.info("scrollPos") - ((e.wheelDelta || e[l.info("vertical") ? "wheelDeltaY" : "wheelDeltaX"]) / 3 || 30 * -e.detail)))
      };
    this.setPin = function (e, t) {
      if (t = R.extend({}, {
          pushFollowers: !0,
          spacerClass: "scrollmagic-pin-spacer"
        }, t), !(e = R.get.elements(e)[0])) return d;
      if ("fixed" === R.css(e, "position")) return d;
      if (m) {
        if (m === e) return d;
        d.removePin()
      }
      var n = (m = e).parentNode.style.display,
        r = ["top", "left", "bottom", "right", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];
      m.parentNode.style.display = "none";
      var i = "absolute" != R.css(m, "position"),
        o = R.css(m, r.concat(["display"])),
        s = R.css(m, ["width", "height"]);
      m.parentNode.style.display = n, !i && t.pushFollowers && (t.pushFollowers = !1);
      var a = m.parentNode.insertBefore(document.createElement("div"), m),
        l = R.extend(o, {
          position: i ? "relative" : "absolute",
          boxSizing: "content-box",
          mozBoxSizing: "content-box",
          webkitBoxSizing: "content-box"
        });
      if (i || R.extend(l, R.css(m, ["width", "height"])), R.css(a, l), a.setAttribute(P, ""), R.addClass(a, t.spacerClass), w = {
          spacer: a,
          relSize: {
            width: "%" === s.width.slice(-1),
            height: "%" === s.height.slice(-1),
            autoFullWidth: "auto" === s.width && i && R.isMarginCollapseType(o.display)
          },
          pushFollowers: t.pushFollowers,
          inFlow: i
        }, !m.___origStyle) {
        m.___origStyle = {};
        var c = m.style;
        r.concat(["width", "height", "position", "boxSizing", "mozBoxSizing", "webkitBoxSizing"]).forEach(function (e) {
          m.___origStyle[e] = c[e] || ""
        })
      }
      return w.relSize.width && R.css(a, {
        width: s.width
      }), w.relSize.height && R.css(a, {
        height: s.height
      }), a.appendChild(m), R.css(m, {
        position: i ? "relative" : "absolute",
        margin: "auto",
        top: "auto",
        left: "auto",
        bottom: "auto",
        right: "auto"
      }), (w.relSize.width || w.relSize.autoFullWidth) && R.css(m, {
        boxSizing: "border-box",
        mozBoxSizing: "border-box",
        webkitBoxSizing: "border-box"
      }), window.addEventListener("scroll", L), window.addEventListener("resize", L), window.addEventListener("resize", T), m.addEventListener("mousewheel", A), m.addEventListener("DOMMouseScroll", A), C(), d
    }, this.removePin = function (e) {
      if (m) {
        if (p === f && C(!0), e || !l) {
          var t = w.spacer.firstChild;
          if (t.hasAttribute(P)) {
            var n = w.spacer.style,
              r = {};
            ["margin", "marginLeft", "marginRight", "marginTop", "marginBottom"].forEach(function (e) {
              r[e] = n[e] || ""
            }), R.css(t, r)
          }
          w.spacer.parentNode.insertBefore(t, w.spacer), w.spacer.parentNode.removeChild(w.spacer), m.parentNode.hasAttribute(P) || (R.css(m, m.___origStyle), delete m.___origStyle)
        }
        window.removeEventListener("scroll", L), window.removeEventListener("resize", L), window.removeEventListener("resize", T), m.removeEventListener("mousewheel", A), m.removeEventListener("DOMMouseScroll", A), m = void 0
      }
      return d
    };
    var N, O = [];
    return d.on("destroy.internal", function (e) {
        d.removeClassToggle(e.reset)
      }), this.setClassToggle = function (e, t) {
        var n = R.get.elements(e);
        return 0 !== n.length && R.type.String(t) && (0 < O.length && d.removeClassToggle(), N = t, O = n, d.on("enter.internal_class leave.internal_class", function (e) {
          var n = "enter" === e.type ? R.addClass : R.removeClass;
          O.forEach(function (e, t) {
            n(e, N)
          })
        })), d
      }, this.removeClassToggle = function (e) {
        return e && O.forEach(function (e, t) {
          R.removeClass(e, N)
        }), d.off("start.internal_class end.internal_class"), N = void 0, O = [], d
      },
      function () {
        for (var e in h) r.hasOwnProperty(e) || delete h[e];
        for (var t in r) z(t);
        E()
      }(), d
  };
  var D = {
    defaults: {
      duration: 0,
      offset: 0,
      triggerElement: void 0,
      triggerHook: .5,
      reverse: !0,
      loglevel: 2
    },
    validate: {
      offset: function (e) {
        if (e = parseFloat(e), !R.type.Number(e)) throw 0;
        return e
      },
      triggerElement: function (e) {
        if (e = e || void 0) {
          var t = R.get.elements(e)[0];
          if (!t || !t.parentNode) throw 0;
          e = t
        }
        return e
      },
      triggerHook: function (e) {
        var t = {
          onCenter: .5,
          onEnter: 1,
          onLeave: 0
        };
        if (R.type.Number(e)) e = Math.max(0, Math.min(parseFloat(e), 1));
        else {
          if (!(e in t)) throw 0;
          e = t[e]
        }
        return e
      },
      reverse: function (e) {
        return !!e
      }
    },
    shifts: ["duration", "offset", "triggerHook"]
  };
  _.Scene.addOption = function (e, t, n, r) {
    e in D.defaults || (D.defaults[e] = t, D.validate[e] = n, r && D.shifts.push(e))
  }, _.Scene.extend = function (e) {
    var t = this;
    _.Scene = function () {
      return t.apply(this, arguments), this.$super = R.extend({}, this), e.apply(this, arguments) || this
    }, R.extend(_.Scene, t), _.Scene.prototype = t.prototype, _.Scene.prototype.constructor = _.Scene
  }, _.Event = function (e, t, n, r) {
    for (var i in r = r || {}) this[i] = r[i];
    return this.type = e, this.target = this.currentTarget = n, this.namespace = t || "", this.timeStamp = this.timestamp = Date.now(), this
  };
  var R = _._util = function (s) {
    var n, e = {},
      a = function (e) {
        return parseFloat(e) || 0
      },
      l = function (e) {
        return e.currentStyle ? e.currentStyle : s.getComputedStyle(e)
      },
      r = function (e, t, n, r) {
        if ((t = t === document ? s : t) === s) r = !1;
        else if (!u.DomElement(t)) return 0;
        e = e.charAt(0).toUpperCase() + e.substr(1).toLowerCase();
        var i = (n ? t["offset" + e] || t["outer" + e] : t["client" + e] || t["inner" + e]) || 0;
        if (n && r) {
          var o = l(t);
          i += "Height" === e ? a(o.marginTop) + a(o.marginBottom) : a(o.marginLeft) + a(o.marginRight)
        }
        return i
      },
      c = function (e) {
        return e.replace(/^[^a-z]+([a-z])/g, "$1").replace(/-([a-z])/g, function (e) {
          return e[1].toUpperCase()
        })
      };
    e.extend = function (e) {
      for (e = e || {}, n = 1; n < arguments.length; n++)
        if (arguments[n])
          for (var t in arguments[n]) arguments[n].hasOwnProperty(t) && (e[t] = arguments[n][t]);
      return e
    }, e.isMarginCollapseType = function (e) {
      return -1 < ["block", "flex", "list-item", "table", "-webkit-box"].indexOf(e)
    };
    var i = 0,
      t = ["ms", "moz", "webkit", "o"],
      o = s.requestAnimationFrame,
      f = s.cancelAnimationFrame;
    for (n = 0; !o && n < 4; ++n) o = s[t[n] + "RequestAnimationFrame"], f = s[t[n] + "CancelAnimationFrame"] || s[t[n] + "CancelRequestAnimationFrame"];
    o || (o = function (e) {
      var t = (new Date).getTime(),
        n = Math.max(0, 16 - (t - i)),
        r = s.setTimeout(function () {
          e(t + n)
        }, n);
      return i = t + n, r
    }), f || (f = function (e) {
      s.clearTimeout(e)
    }), e.rAF = o.bind(s), e.cAF = f.bind(s);
    var u = e.type = function (e) {
      return Object.prototype.toString.call(e).replace(/^\[object (.+)\]$/, "$1").toLowerCase()
    };
    u.String = function (e) {
      return "string" === u(e)
    }, u.Function = function (e) {
      return "function" === u(e)
    }, u.Array = function (e) {
      return Array.isArray(e)
    }, u.Number = function (e) {
      return !u.Array(e) && 0 <= e - parseFloat(e) + 1
    }, u.DomElement = function (e) {
      return "object" == typeof HTMLElement || "function" == typeof HTMLElement ? e instanceof HTMLElement || e instanceof SVGElement : e && "object" == typeof e && null !== e && 1 === e.nodeType && "string" == typeof e.nodeName
    };
    var d = e.get = {};
    return d.elements = function (e) {
      var t = [];
      if (u.String(e)) try {
        e = document.querySelectorAll(e)
      } catch (e) {
        return t
      }
      if ("nodelist" === u(e) || u.Array(e) || e instanceof NodeList)
        for (var n = 0, r = t.length = e.length; n < r; n++) {
          var i = e[n];
          t[n] = u.DomElement(i) ? i : d.elements(i)
        } else(u.DomElement(e) || e === document || e === s) && (t = [e]);
      return t
    }, d.scrollTop = function (e) {
      return e && "number" == typeof e.scrollTop ? e.scrollTop : s.pageYOffset || 0
    }, d.scrollLeft = function (e) {
      return e && "number" == typeof e.scrollLeft ? e.scrollLeft : s.pageXOffset || 0
    }, d.width = function (e, t, n) {
      return r("width", e, t, n)
    }, d.height = function (e, t, n) {
      return r("height", e, t, n)
    }, d.offset = function (e, t) {
      var n = {
        top: 0,
        left: 0
      };
      if (e && e.getBoundingClientRect) {
        var r = e.getBoundingClientRect();
        n.top = r.top, n.left = r.left, t || (n.top += d.scrollTop(), n.left += d.scrollLeft())
      }
      return n
    }, e.addClass = function (e, t) {
      t && (e.classList ? e.classList.add(t) : e.className += " " + t)
    }, e.removeClass = function (e, t) {
      t && (e.classList ? e.classList.remove(t) : e.className = e.className.replace(RegExp("(^|\\b)" + t.split(" ").join("|") + "(\\b|$)", "gi"), " "))
    }, e.css = function (e, t) {
      if (u.String(t)) return l(e)[c(t)];
      if (u.Array(t)) {
        var n = {},
          r = l(e);
        return t.forEach(function (e, t) {
          n[e] = r[c(e)]
        }), n
      }
      for (var i in t) {
        var o = t[i];
        o == parseFloat(o) && (o += "px"), e.style[c(i)] = o
      }
    }, e
  }(window || {});
  return _
});

function scrollToFF(e, t, n, i) {
  peut_defiler = !1;
  var r = $(e);
  if (null == n && (n = 0), null == t && (t = 1e3), null == i && (i = !1), r.length) {
    var o;
    return o = i ? isMobile || vw <= 1150 ? $(window).scrollTop() - $(window).innerHeight() : $(window).scrollTop() - vh : r.offset().top + n, $("html,body").stop().animate({
      scrollTop: o
    }, t, function () {
      if (peut_defiler = !0, isMobile || vw <= 1150) {
        var e = section_courante == sections.length - 1;
        update_nav_intra($(sections[section_courante]), e, !0)
      }
    }), !1
  }
}

function creationSlider(e, t, n, i, r, o, a, s, l, u, c, d) {
  var h = e;
  if (tabGlobal[h] = new Array, tabGlobal[h].id = e, tabGlobal[h].vitesseSlider = t, tabGlobal[h].maxContenuSlider = $(e + " .contenu").children().length, tabGlobal[h].indexSlider = u, tabGlobal[h].easingSlider = i, tabGlobal[h].stopSurPlay = o, tabGlobal[h].ciblefctDebut = a, tabGlobal[h].ciblefctFin = s, tabGlobal[h].setCss = l, tabGlobal[h].typeAnim = c, tabGlobal[h].duree = n, tabGlobal[h].animationEnCours = !1, tabGlobal[h].swipeMobile = "swipeMobile" == d, tabGlobal[h].maxContenuSlider <= 1) r = !1;
  1 == r && (tabGlobal[h].intervalSlider = setInterval(function () {
    "#slider-lookbook" == h && 0 != $("#slider-lookbook a.hover").length || (desactiverFleche(h), tabGlobal[h].indexSlider++, tabGlobal[h].indexSlider >= tabGlobal[h].maxContenuSlider && (tabGlobal[h].indexSlider = 0), imageSuivante(h))
  }, n)), $(tabGlobal[h].id + " .contenu").hide(), $(tabGlobal[h].id + " .mask").css("overflow", "hidden"), $(tabGlobal[h].id + " .mask").css("height", "100%"), $(tabGlobal[h].id + " .conteneur").css("position", "absolute"), $(tabGlobal[h].id + " .conteneur").css("top", "0"), $(tabGlobal[h].id + " .conteneur").css("left", "0"), tabGlobal[h].maxContenuSlider <= 1 ? $(tabGlobal[h].id + " .thumbs").css("display", "none") : ($(tabGlobal[h].id + " .thumbs").css("-moz-user-select", "none"), $(tabGlobal[h].id + " .thumbs").css("-khtml-user-select", "none"), $(tabGlobal[h].id + " .thumbs").css("-webkit-user-select", "none")), resizeSlider(h), $(document).ready(function () {
    $(window).resize(function () {
      resizeSlider(h)
    }), $(window).on("load", function () {
      resizeSlider(h)
    })
  }), chargerContenuSlider(h)
}

function activerFleche(e) {
  var t = e;
  $(tabGlobal[t].id + " .flecheGauche").click(function () {
    fleche = "gauche", tabGlobal[t].stopSurPlay ? clearInterval(tabGlobal[t].intervalSlider) : (clearInterval(tabGlobal[t].intervalSlider), tabGlobal[t].intervalSlider = 0, tabGlobal[t].intervalSlider = "", tabGlobal[t].intervalSlider = setInterval(function () {
      desactiverFleche(t), tabGlobal[t].indexSlider++, tabGlobal[t].indexSlider >= tabGlobal[t].maxContenuSlider && (tabGlobal[t].indexSlider = 0), imageSuivante(t)
    }, tabGlobal[t].duree)), desactiverFleche(t), tabGlobal[t].indexSlider--, tabGlobal[t].indexSlider < 0 && (tabGlobal[t].indexSlider = tabGlobal[t].maxContenuSlider - 1), imagePrecedante(t)
  }), $(tabGlobal[t].id + " .flecheDroite").click(function () {
    fleche = "droite", tabGlobal[t].stopSurPlay ? clearInterval(tabGlobal[t].intervalSlider) : (clearInterval(tabGlobal[t].intervalSlider), tabGlobal[t].intervalSlider = 0, tabGlobal[t].intervalSlider = "", tabGlobal[t].intervalSlider = setInterval(function () {
      desactiverFleche(t), tabGlobal[t].indexSlider++, tabGlobal[t].indexSlider >= tabGlobal[t].maxContenuSlider && (tabGlobal[t].indexSlider = 0), imageSuivante(t)
    }, tabGlobal[t].duree)), desactiverFleche(t), tabGlobal[t].indexSlider++, tabGlobal[t].indexSlider >= tabGlobal[t].maxContenuSlider && (tabGlobal[t].indexSlider = 0), imageSuivante(t)
  }), $(tabGlobal[t].id + " .thumbs a").click(function () {
    tabGlobal[t].stopSurPlay ? clearInterval(tabGlobal[t].intervalSlider) : (clearInterval(tabGlobal[t].intervalSlider), tabGlobal[t].intervalSlider = 0, tabGlobal[t].intervalSlider = "", tabGlobal[t].intervalSlider = setInterval(function () {
      desactiverFleche(t), tabGlobal[t].indexSlider++, tabGlobal[t].indexSlider >= tabGlobal[t].maxContenuSlider && (tabGlobal[t].indexSlider = 0), imageSuivante(t)
    }, tabGlobal[t].duree));
    var e = $(this).index();
    e == tabGlobal[t].indexSlider || (e < tabGlobal[t].indexSlider ? (desactiverFleche(t), tabGlobal[t].indexSlider = e, imagePrecedante(t)) : e > tabGlobal[t].indexSlider && (desactiverFleche(t), tabGlobal[t].indexSlider = e, imageSuivante(t)))
  }), tabGlobal[t].swipeMobile && isMobile && $(tabGlobal[t].id).swipe({
    swipeLeft: function (e, n, i, r, o) {
      tabGlobal[t].animationEnCours || $(window).width() < 1200 && ("left" == n ? (tabGlobal[t].stopSurPlay ? clearInterval(tabGlobal[t].intervalSlider) : (clearInterval(tabGlobal[t].intervalSlider), tabGlobal[t].intervalSlider = 0, tabGlobal[t].intervalSlider = "", tabGlobal[t].intervalSlider = setInterval(function () {
        desactiverFleche(t), tabGlobal[t].indexSlider++, tabGlobal[t].indexSlider >= tabGlobal[t].maxContenuSlider && (tabGlobal[t].indexSlider = 0), imageSuivante(t)
      }, tabGlobal[t].duree)), desactiverFleche(t), tabGlobal[t].indexSlider++, tabGlobal[t].indexSlider >= tabGlobal[t].maxContenuSlider && (tabGlobal[t].indexSlider = 0), imageSuivante(t)) : "right" == n && (tabGlobal[t].stopSurPlay ? clearInterval(tabGlobal[t].intervalSlider) : (clearInterval(tabGlobal[t].intervalSlider), tabGlobal[t].intervalSlider = 0, tabGlobal[t].intervalSlider = "", tabGlobal[t].intervalSlider = setInterval(function () {
        desactiverFleche(t), tabGlobal[t].indexSlider++, tabGlobal[t].indexSlider >= tabGlobal[t].maxContenuSlider && (tabGlobal[t].indexSlider = 0), imageSuivante(t)
      }, tabGlobal[t].duree)), desactiverFleche(t), tabGlobal[t].indexSlider--, tabGlobal[t].indexSlider < 0 && (tabGlobal[t].indexSlider = tabGlobal[t].maxContenuSlider - 1), imagePrecedante(t)))
    },
    swipeRight: function (e, n, i, r, o) {
      tabGlobal[t].animationEnCours || $(window).width() < 1200 && ("left" == n ? (tabGlobal[t].stopSurPlay ? clearInterval(tabGlobal[t].intervalSlider) : (clearInterval(tabGlobal[t].intervalSlider), tabGlobal[t].intervalSlider = 0, tabGlobal[t].intervalSlider = "", tabGlobal[t].intervalSlider = setInterval(function () {
        desactiverFleche(t), tabGlobal[t].indexSlider++, tabGlobal[t].indexSlider >= tabGlobal[t].maxContenuSlider && (tabGlobal[t].indexSlider = 0), imageSuivante(t)
      }, tabGlobal[t].duree)), desactiverFleche(t), tabGlobal[t].indexSlider++, tabGlobal[t].indexSlider >= tabGlobal[t].maxContenuSlider && (tabGlobal[t].indexSlider = 0), imageSuivante(t)) : "right" == n && (tabGlobal[t].stopSurPlay ? clearInterval(tabGlobal[t].intervalSlider) : (clearInterval(tabGlobal[t].intervalSlider), tabGlobal[t].intervalSlider = 0, tabGlobal[t].intervalSlider = "", tabGlobal[t].intervalSlider = setInterval(function () {
        desactiverFleche(t), tabGlobal[t].indexSlider++, tabGlobal[t].indexSlider >= tabGlobal[t].maxContenuSlider && (tabGlobal[t].indexSlider = 0), imageSuivante(t)
      }, tabGlobal[t].duree)), desactiverFleche(t), tabGlobal[t].indexSlider--, tabGlobal[t].indexSlider < 0 && (tabGlobal[t].indexSlider = tabGlobal[t].maxContenuSlider - 1), imagePrecedante(t)))
    }
  })
}

function desactiverFleche(e) {
  var t = e;
  tabGlobal[t].animationEnCours = !0, $(tabGlobal[t].id + " .flecheDroite").unbind("click"), $(tabGlobal[t].id + " .flecheGauche").unbind("click"), $(tabGlobal[t].id + " .thumbs a").unbind("click")
}

function resizeSlider(e) {
  var t = e,
    n = $(tabGlobal[t].id).width(),
    i = $(tabGlobal[t].id).height();
  $(tabGlobal[t].id + " .conteneur").css("width", n + "px"), $(tabGlobal[t].id + " .conteneur").css("height", i + "px"), $(tabGlobal[t].id + " .temp").css("width", n + "px"), $(tabGlobal[t].id + " .temp").css("height", i + "px")
}

function imagePrecedante(pSid) {
  var sID = pSid;
  $(tabGlobal[sID].id + " .thumbs a").removeClass("actif"), $(tabGlobal[sID].id + " .thumbs a").eq(tabGlobal[sID].indexSlider).addClass("actif"), $(document).ready(function () {
    eval(tabGlobal[sID].ciblefctDebut)
  }), "fade" == tabGlobal[sID].typeAnim ? $(tabGlobal[sID].id).find(".mask").append('<div class="temp conteneurCSS" style="z-index:100; position:absolute; left:0px; top:0;opacity:0" >' + $(tabGlobal[sID].id + " .contenu > div").eq(tabGlobal[sID].indexSlider).html() + "</div>") : "crossFade" == tabGlobal[sID].typeAnim ? $(tabGlobal[sID].id).find(".mask").append('<div class="temp conteneurCSS" style="z-index:100; position:absolute; left:0px; top:0;opacity:0" >' + $(tabGlobal[sID].id + " .contenu > div").eq(tabGlobal[sID].indexSlider).html() + "</div>") : "swipeLeft" == tabGlobal[sID].typeAnim || "swipeRight" == tabGlobal[sID].typeAnim ? $(tabGlobal[sID].id).find(".mask").prepend('<div class="temp conteneurCSS" style="position:absolute; left:0px; top:0;" >' + $(tabGlobal[sID].id + " .contenu > div").eq(tabGlobal[sID].indexSlider).html() + "</div>") : "custom" == tabGlobal[sID].typeAnim ? $(tabGlobal[sID].id).find(".mask").append('<div class="temp conteneurCSS" style="z-index:100; position:absolute; left:0px; top:0;opacity:0" >' + $(tabGlobal[sID].id + " .contenu > div").eq(tabGlobal[sID].indexSlider).html() + "</div>") : $(tabGlobal[sID].id).find(".mask").prepend('<div class="temp conteneurCSS" style="position:absolute; left:-' + $(tabGlobal[sID].id).width() + 'px; top:0;" >' + $(tabGlobal[sID].id + " .contenu > div").eq(tabGlobal[sID].indexSlider).html() + "</div>"), $(document).ready(function () {
    eval(tabGlobal[sID].setCss)
  }), "fade" == tabGlobal[sID].typeAnim ? $(tabGlobal[sID].id + " .temp").animate({
    opacity: "1"
  }, tabGlobal[sID].vitesseSlider, tabGlobal[sID].easingSlider, function () {
    chargerContenuSlider(sID)
  }) : "crossFade" == tabGlobal[sID].typeAnim ? ($(tabGlobal[sID].id + " .conteneur").animate({
    opacity: "0"
  }, tabGlobal[sID].vitesseSlider, tabGlobal[sID].easingSlider), $(tabGlobal[sID].id + " .temp").animate({
    opacity: "1"
  }, tabGlobal[sID].vitesseSlider, tabGlobal[sID].easingSlider, function () {
    chargerContenuSlider(sID)
  })) : "swipeRight" == tabGlobal[sID].typeAnim ? ($(tabGlobal[sID].id + " .conteneur").animate({
    left: $(tabGlobal[sID].id).width() + "px"
  }, tabGlobal[sID].vitesseSlider, tabGlobal[sID].easingSlider), $(tabGlobal[sID].id + " .temp").animate({
    left: "0px"
  }, tabGlobal[sID].vitesseSlider, tabGlobal[sID].easingSlider, function () {
    chargerContenuSlider(sID)
  })) : "swipeLeft" == tabGlobal[sID].typeAnim ? ($(tabGlobal[sID].id + " .conteneur").animate({
    left: "-" + $(tabGlobal[sID].id).width() + "px"
  }, tabGlobal[sID].vitesseSlider, tabGlobal[sID].easingSlider), $(tabGlobal[sID].id + " .temp").animate({
    left: "0px"
  }, tabGlobal[sID].vitesseSlider, tabGlobal[sID].easingSlider, function () {
    chargerContenuSlider(sID)
  })) : "custom" == tabGlobal[sID].typeAnim ? setTimeout(function () {
    $(tabGlobal[sID].id + " .conteneur").css("left", "-" + $(tabGlobal[sID].id).width() + "px"), $(tabGlobal[sID].id + " .temp").css("left", "0px"), $(tabGlobal[sID].id + " .temp").css("opacity", "1"), chargerContenuSlider(sID)
  }, tabGlobal[sID].vitesseSlider) : ($(tabGlobal[sID].id + " .conteneur").animate({
    left: $(tabGlobal[sID].id).width() + "px"
  }, tabGlobal[sID].vitesseSlider, tabGlobal[sID].easingSlider), $(tabGlobal[sID].id + " .temp").animate({
    left: "0px"
  }, tabGlobal[sID].vitesseSlider, tabGlobal[sID].easingSlider, function () {
    chargerContenuSlider(sID)
  })), resizeSlider(pSid)
}

function imageSuivante(pSid) {
  var sID = pSid;
  $(tabGlobal[sID].id + " .thumbs a").removeClass("actif"), $(tabGlobal[sID].id + " .thumbs a").eq(tabGlobal[sID].indexSlider).addClass("actif"), $(document).ready(function () {
    eval(tabGlobal[sID].ciblefctDebut)
  }), "fade" == tabGlobal[sID].typeAnim ? $(tabGlobal[sID].id).find(".mask").append('<div class="temp conteneurCSS" style="z-index:100; position:absolute; left:0px; top:0; opacity: 0; " >' + $(tabGlobal[sID].id + " .contenu > div").eq(tabGlobal[sID].indexSlider).html() + "</div>") : "crossFade" == tabGlobal[sID].typeAnim ? $(tabGlobal[sID].id).find(".mask").append('<div class="temp conteneurCSS" style="z-index:100; position:absolute; left:0px; top:0;opacity:0" >' + $(tabGlobal[sID].id + " .contenu > div").eq(tabGlobal[sID].indexSlider).html() + "</div>") : "swipeLeft" == tabGlobal[sID].typeAnim || "swipeRight" == tabGlobal[sID].typeAnim ? $(tabGlobal[sID].id).find(".mask").prepend('<div class="temp conteneurCSS" style="position:absolute; left:0px; top:0;" >' + $(tabGlobal[sID].id + " .contenu > div").eq(tabGlobal[sID].indexSlider).html() + "</div>") : "custom" == tabGlobal[sID].typeAnim ? $(tabGlobal[sID].id).find(".mask").append('<div class="temp conteneurCSS" style="z-index:100; position:absolute; left:0px; top:0;opacity:0" >' + $(tabGlobal[sID].id + " .contenu > div").eq(tabGlobal[sID].indexSlider).html() + "</div>") : $(tabGlobal[sID].id).find(".mask").append('<div class="temp conteneurCSS" style="position:absolute; left:' + $(tabGlobal[sID].id).width() + 'px; top:0;" >' + $(tabGlobal[sID].id + " .contenu > div").eq(tabGlobal[sID].indexSlider).html() + "</div>"), $(document).ready(function () {
    eval(tabGlobal[sID].setCss)
  }), "fade" == tabGlobal[sID].typeAnim ? $(tabGlobal[sID].id + " .temp").animate({
    opacity: "1"
  }, tabGlobal[sID].vitesseSlider, tabGlobal[sID].easingSlider, function () {
    chargerContenuSlider(sID)
  }) : "crossFade" == tabGlobal[sID].typeAnim ? ($(tabGlobal[sID].id + " .conteneur").animate({
    opacity: "0"
  }, tabGlobal[sID].vitesseSlider, tabGlobal[sID].easingSlider), $(tabGlobal[sID].id + " .temp").animate({
    opacity: "1"
  }, tabGlobal[sID].vitesseSlider, tabGlobal[sID].easingSlider, function () {
    chargerContenuSlider(sID)
  })) : "swipeRight" == tabGlobal[sID].typeAnim ? ($(tabGlobal[sID].id + " .conteneur").animate({
    left: $(tabGlobal[sID].id).width() + "px"
  }, tabGlobal[sID].vitesseSlider, tabGlobal[sID].easingSlider), $(tabGlobal[sID].id + " .temp").animate({
    left: "0px"
  }, tabGlobal[sID].vitesseSlider, tabGlobal[sID].easingSlider, function () {
    chargerContenuSlider(sID)
  })) : "swipeLeft" == tabGlobal[sID].typeAnim ? ($(tabGlobal[sID].id + " .conteneur").animate({
    left: "-" + $(tabGlobal[sID].id).width() + "px"
  }, tabGlobal[sID].vitesseSlider, tabGlobal[sID].easingSlider), $(tabGlobal[sID].id + " .temp").animate({
    left: "0px"
  }, tabGlobal[sID].vitesseSlider, tabGlobal[sID].easingSlider, function () {
    chargerContenuSlider(sID)
  })) : "custom" == tabGlobal[sID].typeAnim ? setTimeout(function () {
    $(tabGlobal[sID].id + " .conteneur").css("left", "-" + $(tabGlobal[sID].id).width() + "px"), $(tabGlobal[sID].id + " .temp").css("left", "0px"), $(tabGlobal[sID].id + " .temp").css("opacity", "1"), chargerContenuSlider(sID)
  }, tabGlobal[sID].vitesseSlider) : ($(tabGlobal[sID].id + " .conteneur").animate({
    left: "-" + $(tabGlobal[sID].id).width() + "px"
  }, tabGlobal[sID].vitesseSlider, tabGlobal[sID].easingSlider), $(tabGlobal[sID].id + " .temp").animate({
    left: "0px"
  }, tabGlobal[sID].vitesseSlider, tabGlobal[sID].easingSlider, function () {
    chargerContenuSlider(sID)
  })), resizeSlider(sID)
}

function chargerContenuSlider(pSid) {
  var sID = pSid;
  $(tabGlobal[sID].id + " .thumbs a").eq(tabGlobal[sID].indexSlider).addClass("actif"), 0 == $(tabGlobal[sID].id + " .temp").length ? $(tabGlobal[sID].id + " .conteneur").html($(tabGlobal[sID].id + " .contenu > div").eq(tabGlobal[sID].indexSlider).html()) : ($(tabGlobal[sID].id + " .temp").addClass("conteneurTemp").removeClass("temp"), $(tabGlobal[sID].id + " .conteneur").remove(), $(tabGlobal[sID].id + " .conteneurTemp").addClass("conteneur").removeClass("conteneurTemp")), tabGlobal[sID].animationEnCours = !1, activerFleche(sID), $(document).ready(function () {
    eval(tabGlobal[sID].ciblefctFin)
  })
}

function deplacerSlider(e, t) {
  var n = e;
  tabGlobal[n].stopSurPlay ? clearInterval(tabGlobal[n].intervalSlider) : (clearInterval(tabGlobal[n].intervalSlider), tabGlobal[n].intervalSlider = 0, tabGlobal[n].intervalSlider = "", tabGlobal[n].intervalSlider = setInterval(function () {
    desactiverFleche(n), tabGlobal[n].indexSlider++, tabGlobal[n].indexSlider >= tabGlobal[n].maxContenuSlider && (tabGlobal[n].indexSlider = 0), imageSuivante(n)
  }, tabGlobal[n].duree));
  var i = t;
  i == tabGlobal[n].indexSlider || (i < tabGlobal[n].indexSlider ? (desactiverFleche(n), tabGlobal[n].indexSlider = i, imagePrecedante(n)) : i > tabGlobal[n].indexSlider && (desactiverFleche(n), tabGlobal[n].indexSlider = i, imageSuivante(n)))
}

function _typeof(e) {
  return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
    return typeof e
  } : function (e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
  })(e)
}

function _possibleConstructorReturn(e, t) {
  return !t || "object" !== _typeof(t) && "function" != typeof t ? _assertThisInitialized(e) : t
}

function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e
}

function _getPrototypeOf(e) {
  return (_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
    return e.__proto__ || Object.getPrototypeOf(e)
  })(e)
}

function _inherits(e, t) {
  if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, {
    constructor: {
      value: e,
      writable: !0,
      configurable: !0
    }
  }), t && _setPrototypeOf(e, t)
}

function _setPrototypeOf(e, t) {
  return (_setPrototypeOf = Object.setPrototypeOf || function (e, t) {
    return e.__proto__ = t, e
  })(e, t)
}

function _classCallCheck(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
}

function _defineProperties(e, t) {
  for (var n = 0; n < t.length; n++) {
    var i = t[n];
    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
  }
}

function _createClass(e, t, n) {
  return t && _defineProperties(e.prototype, t), n && _defineProperties(e, n), e
}! function (e, t) {
  "use strict";
  "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function (e) {
    if (!e.document) throw new Error("jQuery requires a window with a document");
    return t(e)
  } : t(e)
}("undefined" != typeof window ? window : this, function (e, t) {
  "use strict";

  function n(e, t, n) {
    var i, r = (t = t || Z).createElement("script");
    if (r.text = e, n)
      for (i in pe) n[i] && (r[i] = n[i]);
    t.head.appendChild(r).parentNode.removeChild(r)
  }

  function i(e) {
    return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? oe[ae.call(e)] || "object" : typeof e
  }

  function r(e) {
    var t = !!e && "length" in e && e.length,
      n = i(e);
    return !de(e) && !he(e) && ("array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e)
  }

  function o(e, t) {
    return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
  }

  function a(e, t, n) {
    return de(t) ? fe.grep(e, function (e, i) {
      return !!t.call(e, i, e) !== n
    }) : t.nodeType ? fe.grep(e, function (e) {
      return e === t !== n
    }) : "string" != typeof t ? fe.grep(e, function (e) {
      return re.call(t, e) > -1 !== n
    }) : fe.filter(t, e, n)
  }

  function s(e, t) {
    for (;
      (e = e[t]) && 1 !== e.nodeType;);
    return e
  }

  function l(e) {
    return e
  }

  function u(e) {
    throw e
  }

  function c(e, t, n, i) {
    var r;
    try {
      e && de(r = e.promise) ? r.call(e).done(t).fail(n) : e && de(r = e.then) ? r.call(e, t, n) : t.apply(void 0, [e].slice(i))
    } catch (e) {
      n.apply(void 0, [e])
    }
  }

  function d() {
    Z.removeEventListener("DOMContentLoaded", d), e.removeEventListener("load", d), fe.ready()
  }

  function h(e, t) {
    return t.toUpperCase()
  }

  function p(e) {
    return e.replace(Ie, "ms-").replace(De, h)
  }

  function f() {
    this.expando = fe.expando + f.uid++
  }

  function m(e, t, n) {
    var i;
    if (void 0 === n && 1 === e.nodeType)
      if (i = "data-" + t.replace(Me, "-$&").toLowerCase(), "string" == typeof (n = e.getAttribute(i))) {
        try {
          n = function (e) {
            return "true" === e || "false" !== e && ("null" === e ? null : e === +e + "" ? +e : _e.test(e) ? JSON.parse(e) : e)
          }(n)
        } catch (e) {}
        Ge.set(e, t, n)
      } else n = void 0;
    return n
  }

  function g(e, t, n, i) {
    var r, o, a = 20,
      s = i ? function () {
        return i.cur()
      } : function () {
        return fe.css(e, t, "")
      },
      l = s(),
      u = n && n[3] || (fe.cssNumber[t] ? "" : "px"),
      c = (fe.cssNumber[t] || "px" !== u && +l) && Fe.exec(fe.css(e, t));
    if (c && c[3] !== u) {
      for (l /= 2, u = u || c[3], c = +l || 1; a--;) fe.style(e, t, c + u), (1 - o) * (1 - (o = s() / l || .5)) <= 0 && (a = 0), c /= o;
      c *= 2, fe.style(e, t, c + u), n = n || []
    }
    return n && (c = +c || +l || 0, r = n[1] ? c + (n[1] + 1) * n[2] : +n[2], i && (i.unit = u, i.start = c, i.end = r)), r
  }

  function v(e) {
    var t, n = e.ownerDocument,
      i = e.nodeName,
      r = He[i];
    return r || (t = n.body.appendChild(n.createElement(i)), r = fe.css(t, "display"), t.parentNode.removeChild(t), "none" === r && (r = "block"), He[i] = r, r)
  }

  function b(e, t) {
    for (var n, i, r = [], o = 0, a = e.length; o < a; o++)(i = e[o]).style && (n = i.style.display, t ? ("none" === n && (r[o] = Ne.get(i, "display") || null, r[o] || (i.style.display = "")), "" === i.style.display && Re(i) && (r[o] = v(i))) : "none" !== n && (r[o] = "none", Ne.set(i, "display", n)));
    for (o = 0; o < a; o++) null != r[o] && (e[o].style.display = r[o]);
    return e
  }

  function y(e, t) {
    var n;
    return n = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || "*") : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || "*") : [], void 0 === t || t && o(e, t) ? fe.merge([e], n) : n
  }

  function w(e, t) {
    for (var n = 0, i = e.length; n < i; n++) Ne.set(e[n], "globalEval", !t || Ne.get(t[n], "globalEval"))
  }

  function k(e, t, n, r, o) {
    for (var a, s, l, u, c, d, h = t.createDocumentFragment(), p = [], f = 0, m = e.length; f < m; f++)
      if ((a = e[f]) || 0 === a)
        if ("object" === i(a)) fe.merge(p, a.nodeType ? [a] : a);
        else if (Ue.test(a)) {
      for (s = s || h.appendChild(t.createElement("div")), l = (Be.exec(a) || ["", ""])[1].toLowerCase(), u = We[l] || We._default, s.innerHTML = u[1] + fe.htmlPrefilter(a) + u[2], d = u[0]; d--;) s = s.lastChild;
      fe.merge(p, s.childNodes), (s = h.firstChild).textContent = ""
    } else p.push(t.createTextNode(a));
    for (h.textContent = "", f = 0; a = p[f++];)
      if (r && fe.inArray(a, r) > -1) o && o.push(a);
      else if (c = fe.contains(a.ownerDocument, a), s = y(h.appendChild(a), "script"), c && w(s), n)
      for (d = 0; a = s[d++];) Ve.test(a.type || "") && n.push(a);
    return h
  }

  function T() {
    return !0
  }

  function x() {
    return !1
  }

  function S() {
    try {
      return Z.activeElement
    } catch (e) {}
  }

  function C(e, t, n, i, r, o) {
    var a, s;
    if ("object" == typeof t) {
      "string" != typeof n && (i = i || n, n = void 0);
      for (s in t) C(e, s, n, i, t[s], o);
      return e
    }
    if (null == i && null == r ? (r = n, i = n = void 0) : null == r && ("string" == typeof n ? (r = i, i = void 0) : (r = i, i = n, n = void 0)), !1 === r) r = x;
    else if (!r) return e;
    return 1 === o && (a = r, (r = function (e) {
      return fe().off(e), a.apply(this, arguments)
    }).guid = a.guid || (a.guid = fe.guid++)), e.each(function () {
      fe.event.add(this, t, r, i, n)
    })
  }

  function P(e, t) {
    return o(e, "table") && o(11 !== t.nodeType ? t : t.firstChild, "tr") ? fe(e).children("tbody")[0] || e : e
  }

  function E(e) {
    return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e
  }

  function A(e) {
    return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"), e
  }

  function I(e, t) {
    var n, i, r, o, a, s, l, u;
    if (1 === t.nodeType) {
      if (Ne.hasData(e) && (o = Ne.access(e), a = Ne.set(t, o), u = o.events)) {
        delete a.handle, a.events = {};
        for (r in u)
          for (n = 0, i = u[r].length; n < i; n++) fe.event.add(t, r, u[r][n])
      }
      Ge.hasData(e) && (s = Ge.access(e), l = fe.extend({}, s), Ge.set(t, l))
    }
  }

  function D(e, t) {
    var n = t.nodeName.toLowerCase();
    "input" === n && $e.test(e.type) ? t.checked = e.checked : "input" !== n && "textarea" !== n || (t.defaultValue = e.defaultValue)
  }

  function L(e, t, i, r) {
    t = ne.apply([], t);
    var o, a, s, l, u, c, d = 0,
      h = e.length,
      p = h - 1,
      f = t[0],
      m = de(f);
    if (m || h > 1 && "string" == typeof f && !ce.checkClone && Ze.test(f)) return e.each(function (n) {
      var o = e.eq(n);
      m && (t[0] = f.call(this, n, o.html())), L(o, t, i, r)
    });
    if (h && (o = k(t, e[0].ownerDocument, !1, e, r), a = o.firstChild, 1 === o.childNodes.length && (o = a), a || r)) {
      for (l = (s = fe.map(y(o, "script"), E)).length; d < h; d++) u = o, d !== p && (u = fe.clone(u, !0, !0), l && fe.merge(s, y(u, "script"))), i.call(e[d], u, d);
      if (l)
        for (c = s[s.length - 1].ownerDocument, fe.map(s, A), d = 0; d < l; d++) u = s[d], Ve.test(u.type || "") && !Ne.access(u, "globalEval") && fe.contains(c, u) && (u.src && "module" !== (u.type || "").toLowerCase() ? fe._evalUrl && fe._evalUrl(u.src) : n(u.textContent.replace(et, ""), c, u))
    }
    return e
  }

  function N(e, t, n) {
    for (var i, r = t ? fe.filter(t, e) : e, o = 0; null != (i = r[o]); o++) n || 1 !== i.nodeType || fe.cleanData(y(i)), i.parentNode && (n && fe.contains(i.ownerDocument, i) && w(y(i, "script")), i.parentNode.removeChild(i));
    return e
  }

  function G(e, t, n) {
    var i, r, o, a, s = e.style;
    return (n = n || nt(e)) && ("" !== (a = n.getPropertyValue(t) || n[t]) || fe.contains(e.ownerDocument, e) || (a = fe.style(e, t)), !ce.pixelBoxStyles() && tt.test(a) && it.test(t) && (i = s.width, r = s.minWidth, o = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = n.width, s.width = i, s.minWidth = r, s.maxWidth = o)), void 0 !== a ? a + "" : a
  }

  function _(e, t) {
    return {
      get: function () {
        if (!e()) return (this.get = t).apply(this, arguments);
        delete this.get
      }
    }
  }

  function M(e) {
    var t = fe.cssProps[e];
    return t || (t = fe.cssProps[e] = function (e) {
      if (e in ut) return e;
      for (var t = e[0].toUpperCase() + e.slice(1), n = lt.length; n--;)
        if ((e = lt[n] + t) in ut) return e
    }(e) || e), t
  }

  function O(e, t, n) {
    var i = Fe.exec(t);
    return i ? Math.max(0, i[2] - (n || 0)) + (i[3] || "px") : t
  }

  function F(e, t, n, i, r, o) {
    var a = "width" === t ? 1 : 0,
      s = 0,
      l = 0;
    if (n === (i ? "border" : "content")) return 0;
    for (; a < 4; a += 2) "margin" === n && (l += fe.css(e, n + je[a], !0, r)), i ? ("content" === n && (l -= fe.css(e, "padding" + je[a], !0, r)), "margin" !== n && (l -= fe.css(e, "border" + je[a] + "Width", !0, r))) : (l += fe.css(e, "padding" + je[a], !0, r), "padding" !== n ? l += fe.css(e, "border" + je[a] + "Width", !0, r) : s += fe.css(e, "border" + je[a] + "Width", !0, r));
    return !i && o >= 0 && (l += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - o - l - s - .5))), l
  }

  function j(e, t, n) {
    var i = nt(e),
      r = G(e, t, i),
      o = "border-box" === fe.css(e, "boxSizing", !1, i),
      a = o;
    if (tt.test(r)) {
      if (!n) return r;
      r = "auto"
    }
    return a = a && (ce.boxSizingReliable() || r === e.style[t]), ("auto" === r || !parseFloat(r) && "inline" === fe.css(e, "display", !1, i)) && (r = e["offset" + t[0].toUpperCase() + t.slice(1)], a = !0), (r = parseFloat(r) || 0) + F(e, t, n || (o ? "border" : "content"), a, i, r) + "px"
  }

  function R(e, t, n, i, r) {
    return new R.prototype.init(e, t, n, i, r)
  }

  function q() {
    dt && (!1 === Z.hidden && e.requestAnimationFrame ? e.requestAnimationFrame(q) : e.setTimeout(q, fe.fx.interval), fe.fx.tick())
  }

  function H() {
    return e.setTimeout(function () {
      ct = void 0
    }), ct = Date.now()
  }

  function $(e, t) {
    var n, i = 0,
      r = {
        height: e
      };
    for (t = t ? 1 : 0; i < 4; i += 2 - t) r["margin" + (n = je[i])] = r["padding" + n] = e;
    return t && (r.opacity = r.width = e), r
  }

  function B(e, t, n) {
    for (var i, r = (V.tweeners[t] || []).concat(V.tweeners["*"]), o = 0, a = r.length; o < a; o++)
      if (i = r[o].call(n, t, e)) return i
  }

  function V(e, t, n) {
    var i, r, o = 0,
      a = V.prefilters.length,
      s = fe.Deferred().always(function () {
        delete l.elem
      }),
      l = function () {
        if (r) return !1;
        for (var t = ct || H(), n = Math.max(0, u.startTime + u.duration - t), i = 1 - (n / u.duration || 0), o = 0, a = u.tweens.length; o < a; o++) u.tweens[o].run(i);
        return s.notifyWith(e, [u, i, n]), i < 1 && a ? n : (a || s.notifyWith(e, [u, 1, 0]), s.resolveWith(e, [u]), !1)
      },
      u = s.promise({
        elem: e,
        props: fe.extend({}, t),
        opts: fe.extend(!0, {
          specialEasing: {},
          easing: fe.easing._default
        }, n),
        originalProperties: t,
        originalOptions: n,
        startTime: ct || H(),
        duration: n.duration,
        tweens: [],
        createTween: function (t, n) {
          var i = fe.Tween(e, u.opts, t, n, u.opts.specialEasing[t] || u.opts.easing);
          return u.tweens.push(i), i
        },
        stop: function (t) {
          var n = 0,
            i = t ? u.tweens.length : 0;
          if (r) return this;
          for (r = !0; n < i; n++) u.tweens[n].run(1);
          return t ? (s.notifyWith(e, [u, 1, 0]), s.resolveWith(e, [u, t])) : s.rejectWith(e, [u, t]), this
        }
      }),
      c = u.props;
    for (function (e, t) {
        var n, i, r, o, a;
        for (n in e)
          if (i = p(n), r = t[i], o = e[n], Array.isArray(o) && (r = o[1], o = e[n] = o[0]), n !== i && (e[i] = o, delete e[n]), (a = fe.cssHooks[i]) && "expand" in a) {
            o = a.expand(o), delete e[i];
            for (n in o) n in e || (e[n] = o[n], t[n] = r)
          } else t[i] = r
      }(c, u.opts.specialEasing); o < a; o++)
      if (i = V.prefilters[o].call(u, e, c, u.opts)) return de(i.stop) && (fe._queueHooks(u.elem, u.opts.queue).stop = i.stop.bind(i)), i;
    return fe.map(c, B, u), de(u.opts.start) && u.opts.start.call(e, u), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always), fe.fx.timer(fe.extend(l, {
      elem: e,
      anim: u,
      queue: u.opts.queue
    })), u
  }

  function W(e) {
    return (e.match(Ce) || []).join(" ")
  }

  function U(e) {
    return e.getAttribute && e.getAttribute("class") || ""
  }

  function X(e) {
    return Array.isArray(e) ? e : "string" == typeof e ? e.match(Ce) || [] : []
  }

  function z(e, t, n, r) {
    var o;
    if (Array.isArray(t)) fe.each(t, function (t, i) {
      n || St.test(e) ? r(e, i) : z(e + "[" + ("object" == typeof i && null != i ? t : "") + "]", i, n, r)
    });
    else if (n || "object" !== i(t)) r(e, t);
    else
      for (o in t) z(e + "[" + o + "]", t[o], n, r)
  }

  function Y(e) {
    return function (t, n) {
      "string" != typeof t && (n = t, t = "*");
      var i, r = 0,
        o = t.toLowerCase().match(Ce) || [];
      if (de(n))
        for (; i = o[r++];) "+" === i[0] ? (i = i.slice(1) || "*", (e[i] = e[i] || []).unshift(n)) : (e[i] = e[i] || []).push(n)
    }
  }

  function K(e, t, n, i) {
    function r(s) {
      var l;
      return o[s] = !0, fe.each(e[s] || [], function (e, s) {
        var u = s(t, n, i);
        return "string" != typeof u || a || o[u] ? a ? !(l = u) : void 0 : (t.dataTypes.unshift(u), r(u), !1)
      }), l
    }
    var o = {},
      a = e === Mt;
    return r(t.dataTypes[0]) || !o["*"] && r("*")
  }

  function Q(e, t) {
    var n, i, r = fe.ajaxSettings.flatOptions || {};
    for (n in t) void 0 !== t[n] && ((r[n] ? e : i || (i = {}))[n] = t[n]);
    return i && fe.extend(!0, e, i), e
  }
  var J = [],
    Z = e.document,
    ee = Object.getPrototypeOf,
    te = J.slice,
    ne = J.concat,
    ie = J.push,
    re = J.indexOf,
    oe = {},
    ae = oe.toString,
    se = oe.hasOwnProperty,
    le = se.toString,
    ue = le.call(Object),
    ce = {},
    de = function (e) {
      return "function" == typeof e && "number" != typeof e.nodeType
    },
    he = function (e) {
      return null != e && e === e.window
    },
    pe = {
      type: !0,
      src: !0,
      noModule: !0
    },
    fe = function (e, t) {
      return new fe.fn.init(e, t)
    },
    me = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
  fe.fn = fe.prototype = {
    jquery: "3.3.1",
    constructor: fe,
    length: 0,
    toArray: function () {
      return te.call(this)
    },
    get: function (e) {
      return null == e ? te.call(this) : e < 0 ? this[e + this.length] : this[e]
    },
    pushStack: function (e) {
      var t = fe.merge(this.constructor(), e);
      return t.prevObject = this, t
    },
    each: function (e) {
      return fe.each(this, e)
    },
    map: function (e) {
      return this.pushStack(fe.map(this, function (t, n) {
        return e.call(t, n, t)
      }))
    },
    slice: function () {
      return this.pushStack(te.apply(this, arguments))
    },
    first: function () {
      return this.eq(0)
    },
    last: function () {
      return this.eq(-1)
    },
    eq: function (e) {
      var t = this.length,
        n = +e + (e < 0 ? t : 0);
      return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
    },
    end: function () {
      return this.prevObject || this.constructor()
    },
    push: ie,
    sort: J.sort,
    splice: J.splice
  }, fe.extend = fe.fn.extend = function () {
    var e, t, n, i, r, o, a = arguments[0] || {},
      s = 1,
      l = arguments.length,
      u = !1;
    for ("boolean" == typeof a && (u = a, a = arguments[s] || {}, s++), "object" == typeof a || de(a) || (a = {}), s === l && (a = this, s--); s < l; s++)
      if (null != (e = arguments[s]))
        for (t in e) n = a[t], a !== (i = e[t]) && (u && i && (fe.isPlainObject(i) || (r = Array.isArray(i))) ? (r ? (r = !1, o = n && Array.isArray(n) ? n : []) : o = n && fe.isPlainObject(n) ? n : {}, a[t] = fe.extend(u, o, i)) : void 0 !== i && (a[t] = i));
    return a
  }, fe.extend({
    expando: "jQuery" + ("3.3.1" + Math.random()).replace(/\D/g, ""),
    isReady: !0,
    error: function (e) {
      throw new Error(e)
    },
    noop: function () {},
    isPlainObject: function (e) {
      var t, n;
      return !(!e || "[object Object]" !== ae.call(e) || (t = ee(e)) && ("function" != typeof (n = se.call(t, "constructor") && t.constructor) || le.call(n) !== ue))
    },
    isEmptyObject: function (e) {
      var t;
      for (t in e) return !1;
      return !0
    },
    globalEval: function (e) {
      n(e)
    },
    each: function (e, t) {
      var n, i = 0;
      if (r(e))
        for (n = e.length; i < n && !1 !== t.call(e[i], i, e[i]); i++);
      else
        for (i in e)
          if (!1 === t.call(e[i], i, e[i])) break;
      return e
    },
    trim: function (e) {
      return null == e ? "" : (e + "").replace(me, "")
    },
    makeArray: function (e, t) {
      var n = t || [];
      return null != e && (r(Object(e)) ? fe.merge(n, "string" == typeof e ? [e] : e) : ie.call(n, e)), n
    },
    inArray: function (e, t, n) {
      return null == t ? -1 : re.call(t, e, n)
    },
    merge: function (e, t) {
      for (var n = +t.length, i = 0, r = e.length; i < n; i++) e[r++] = t[i];
      return e.length = r, e
    },
    grep: function (e, t, n) {
      for (var i = [], r = 0, o = e.length, a = !n; r < o; r++) !t(e[r], r) !== a && i.push(e[r]);
      return i
    },
    map: function (e, t, n) {
      var i, o, a = 0,
        s = [];
      if (r(e))
        for (i = e.length; a < i; a++) null != (o = t(e[a], a, n)) && s.push(o);
      else
        for (a in e) null != (o = t(e[a], a, n)) && s.push(o);
      return ne.apply([], s)
    },
    guid: 1,
    support: ce
  }), "function" == typeof Symbol && (fe.fn[Symbol.iterator] = J[Symbol.iterator]), fe.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (e, t) {
    oe["[object " + t + "]"] = t.toLowerCase()
  });
  var ge = function (e) {
    function t(e, t, n, i) {
      var r, o, a, s, l, u, c, h = t && t.ownerDocument,
        f = t ? t.nodeType : 9;
      if (n = n || [], "string" != typeof e || !e || 1 !== f && 9 !== f && 11 !== f) return n;
      if (!i && ((t ? t.ownerDocument || t : q) !== N && L(t), t = t || N, _)) {
        if (11 !== f && (l = ge.exec(e)))
          if (r = l[1]) {
            if (9 === f) {
              if (!(a = t.getElementById(r))) return n;
              if (a.id === r) return n.push(a), n
            } else if (h && (a = h.getElementById(r)) && j(t, a) && a.id === r) return n.push(a), n
          } else {
            if (l[2]) return Q.apply(n, t.getElementsByTagName(e)), n;
            if ((r = l[3]) && k.getElementsByClassName && t.getElementsByClassName) return Q.apply(n, t.getElementsByClassName(r)), n
          } if (k.qsa && !W[e + " "] && (!M || !M.test(e))) {
          if (1 !== f) h = t, c = e;
          else if ("object" !== t.nodeName.toLowerCase()) {
            for ((s = t.getAttribute("id")) ? s = s.replace(we, ke) : t.setAttribute("id", s = R), o = (u = C(e)).length; o--;) u[o] = "#" + s + " " + p(u[o]);
            c = u.join(","), h = ve.test(e) && d(t.parentNode) || t
          }
          if (c) try {
            return Q.apply(n, h.querySelectorAll(c)), n
          } catch (e) {} finally {
            s === R && t.removeAttribute("id")
          }
        }
      }
      return E(e.replace(ae, "$1"), t, n, i)
    }

    function n() {
      function e(n, i) {
        return t.push(n + " ") > T.cacheLength && delete e[t.shift()], e[n + " "] = i
      }
      var t = [];
      return e
    }

    function i(e) {
      return e[R] = !0, e
    }

    function r(e) {
      var t = N.createElement("fieldset");
      try {
        return !!e(t)
      } catch (e) {
        return !1
      } finally {
        t.parentNode && t.parentNode.removeChild(t), t = null
      }
    }

    function o(e, t) {
      for (var n = e.split("|"), i = n.length; i--;) T.attrHandle[n[i]] = t
    }

    function a(e, t) {
      var n = t && e,
        i = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
      if (i) return i;
      if (n)
        for (; n = n.nextSibling;)
          if (n === t) return -1;
      return e ? 1 : -1
    }

    function s(e) {
      return function (t) {
        return "input" === t.nodeName.toLowerCase() && t.type === e
      }
    }

    function l(e) {
      return function (t) {
        var n = t.nodeName.toLowerCase();
        return ("input" === n || "button" === n) && t.type === e
      }
    }

    function u(e) {
      return function (t) {
        return "form" in t ? t.parentNode && !1 === t.disabled ? "label" in t ? "label" in t.parentNode ? t.parentNode.disabled === e : t.disabled === e : t.isDisabled === e || t.isDisabled !== !e && xe(t) === e : t.disabled === e : "label" in t && t.disabled === e
      }
    }

    function c(e) {
      return i(function (t) {
        return t = +t, i(function (n, i) {
          for (var r, o = e([], n.length, t), a = o.length; a--;) n[r = o[a]] && (n[r] = !(i[r] = n[r]))
        })
      })
    }

    function d(e) {
      return e && void 0 !== e.getElementsByTagName && e
    }

    function h() {}

    function p(e) {
      for (var t = 0, n = e.length, i = ""; t < n; t++) i += e[t].value;
      return i
    }

    function f(e, t, n) {
      var i = t.dir,
        r = t.next,
        o = r || i,
        a = n && "parentNode" === o,
        s = $++;
      return t.first ? function (t, n, r) {
        for (; t = t[i];)
          if (1 === t.nodeType || a) return e(t, n, r);
        return !1
      } : function (t, n, l) {
        var u, c, d, h = [H, s];
        if (l) {
          for (; t = t[i];)
            if ((1 === t.nodeType || a) && e(t, n, l)) return !0
        } else
          for (; t = t[i];)
            if (1 === t.nodeType || a)
              if (d = t[R] || (t[R] = {}), c = d[t.uniqueID] || (d[t.uniqueID] = {}), r && r === t.nodeName.toLowerCase()) t = t[i] || t;
              else {
                if ((u = c[o]) && u[0] === H && u[1] === s) return h[2] = u[2];
                if (c[o] = h, h[2] = e(t, n, l)) return !0
              } return !1
      }
    }

    function m(e) {
      return e.length > 1 ? function (t, n, i) {
        for (var r = e.length; r--;)
          if (!e[r](t, n, i)) return !1;
        return !0
      } : e[0]
    }

    function g(e, t, n, i, r) {
      for (var o, a = [], s = 0, l = e.length, u = null != t; s < l; s++)(o = e[s]) && (n && !n(o, i, r) || (a.push(o), u && t.push(s)));
      return a
    }

    function v(e, n, r, o, a, s) {
      return o && !o[R] && (o = v(o)), a && !a[R] && (a = v(a, s)), i(function (i, s, l, u) {
        var c, d, h, p = [],
          f = [],
          m = s.length,
          v = i || function (e, n, i) {
            for (var r = 0, o = n.length; r < o; r++) t(e, n[r], i);
            return i
          }(n || "*", l.nodeType ? [l] : l, []),
          b = !e || !i && n ? v : g(v, p, e, l, u),
          y = r ? a || (i ? e : m || o) ? [] : s : b;
        if (r && r(b, y, l, u), o)
          for (c = g(y, f), o(c, [], l, u), d = c.length; d--;)(h = c[d]) && (y[f[d]] = !(b[f[d]] = h));
        if (i) {
          if (a || e) {
            if (a) {
              for (c = [], d = y.length; d--;)(h = y[d]) && c.push(b[d] = h);
              a(null, y = [], c, u)
            }
            for (d = y.length; d--;)(h = y[d]) && (c = a ? Z(i, h) : p[d]) > -1 && (i[c] = !(s[c] = h))
          }
        } else y = g(y === s ? y.splice(m, y.length) : y), a ? a(null, s, y, u) : Q.apply(s, y)
      })
    }

    function b(e) {
      for (var t, n, i, r = e.length, o = T.relative[e[0].type], a = o || T.relative[" "], s = o ? 1 : 0, l = f(function (e) {
          return e === t
        }, a, !0), u = f(function (e) {
          return Z(t, e) > -1
        }, a, !0), c = [function (e, n, i) {
          var r = !o && (i || n !== A) || ((t = n).nodeType ? l(e, n, i) : u(e, n, i));
          return t = null, r
        }]; s < r; s++)
        if (n = T.relative[e[s].type]) c = [f(m(c), n)];
        else {
          if ((n = T.filter[e[s].type].apply(null, e[s].matches))[R]) {
            for (i = ++s; i < r && !T.relative[e[i].type]; i++);
            return v(s > 1 && m(c), s > 1 && p(e.slice(0, s - 1).concat({
              value: " " === e[s - 2].type ? "*" : ""
            })).replace(ae, "$1"), n, s < i && b(e.slice(s, i)), i < r && b(e = e.slice(i)), i < r && p(e))
          }
          c.push(n)
        } return m(c)
    }

    function y(e, n) {
      var r = n.length > 0,
        o = e.length > 0,
        a = function (i, a, s, l, u) {
          var c, d, h, p = 0,
            f = "0",
            m = i && [],
            v = [],
            b = A,
            y = i || o && T.find.TAG("*", u),
            w = H += null == b ? 1 : Math.random() || .1,
            k = y.length;
          for (u && (A = a === N || a || u); f !== k && null != (c = y[f]); f++) {
            if (o && c) {
              for (d = 0, a || c.ownerDocument === N || (L(c), s = !_); h = e[d++];)
                if (h(c, a || N, s)) {
                  l.push(c);
                  break
                } u && (H = w)
            }
            r && ((c = !h && c) && p--, i && m.push(c))
          }
          if (p += f, r && f !== p) {
            for (d = 0; h = n[d++];) h(m, v, a, s);
            if (i) {
              if (p > 0)
                for (; f--;) m[f] || v[f] || (v[f] = Y.call(l));
              v = g(v)
            }
            Q.apply(l, v), u && !i && v.length > 0 && p + n.length > 1 && t.uniqueSort(l)
          }
          return u && (H = w, A = b), m
        };
      return r ? i(a) : a
    }
    var w, k, T, x, S, C, P, E, A, I, D, L, N, G, _, M, O, F, j, R = "sizzle" + 1 * new Date,
      q = e.document,
      H = 0,
      $ = 0,
      B = n(),
      V = n(),
      W = n(),
      U = function (e, t) {
        return e === t && (D = !0), 0
      },
      X = {}.hasOwnProperty,
      z = [],
      Y = z.pop,
      K = z.push,
      Q = z.push,
      J = z.slice,
      Z = function (e, t) {
        for (var n = 0, i = e.length; n < i; n++)
          if (e[n] === t) return n;
        return -1
      },
      ee = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
      te = "[\\x20\\t\\r\\n\\f]",
      ne = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
      ie = "\\[" + te + "*(" + ne + ")(?:" + te + "*([*^$|!~]?=)" + te + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + ne + "))|)" + te + "*\\]",
      re = ":(" + ne + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + ie + ")*)|.*)\\)|)",
      oe = new RegExp(te + "+", "g"),
      ae = new RegExp("^" + te + "+|((?:^|[^\\\\])(?:\\\\.)*)" + te + "+$", "g"),
      se = new RegExp("^" + te + "*," + te + "*"),
      le = new RegExp("^" + te + "*([>+~]|" + te + ")" + te + "*"),
      ue = new RegExp("=" + te + "*([^\\]'\"]*?)" + te + "*\\]", "g"),
      ce = new RegExp(re),
      de = new RegExp("^" + ne + "$"),
      he = {
        ID: new RegExp("^#(" + ne + ")"),
        CLASS: new RegExp("^\\.(" + ne + ")"),
        TAG: new RegExp("^(" + ne + "|[*])"),
        ATTR: new RegExp("^" + ie),
        PSEUDO: new RegExp("^" + re),
        CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + te + "*(even|odd|(([+-]|)(\\d*)n|)" + te + "*(?:([+-]|)" + te + "*(\\d+)|))" + te + "*\\)|)", "i"),
        bool: new RegExp("^(?:" + ee + ")$", "i"),
        needsContext: new RegExp("^" + te + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + te + "*((?:-\\d)?\\d*)" + te + "*\\)|)(?=[^-]|$)", "i")
      },
      pe = /^(?:input|select|textarea|button)$/i,
      fe = /^h\d$/i,
      me = /^[^{]+\{\s*\[native \w/,
      ge = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
      ve = /[+~]/,
      be = new RegExp("\\\\([\\da-f]{1,6}" + te + "?|(" + te + ")|.)", "ig"),
      ye = function (e, t, n) {
        var i = "0x" + t - 65536;
        return i != i || n ? t : i < 0 ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
      },
      we = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
      ke = function (e, t) {
        return t ? "\0" === e ? "�" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
      },
      Te = function () {
        L()
      },
      xe = f(function (e) {
        return !0 === e.disabled && ("form" in e || "label" in e)
      }, {
        dir: "parentNode",
        next: "legend"
      });
    try {
      Q.apply(z = J.call(q.childNodes), q.childNodes), z[q.childNodes.length].nodeType
    } catch (e) {
      Q = {
        apply: z.length ? function (e, t) {
          K.apply(e, J.call(t))
        } : function (e, t) {
          for (var n = e.length, i = 0; e[n++] = t[i++];);
          e.length = n - 1
        }
      }
    }
    k = t.support = {}, S = t.isXML = function (e) {
      var t = e && (e.ownerDocument || e).documentElement;
      return !!t && "HTML" !== t.nodeName
    }, L = t.setDocument = function (e) {
      var t, n, i = e ? e.ownerDocument || e : q;
      return i !== N && 9 === i.nodeType && i.documentElement ? (N = i, G = N.documentElement, _ = !S(N), q !== N && (n = N.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", Te, !1) : n.attachEvent && n.attachEvent("onunload", Te)), k.attributes = r(function (e) {
        return e.className = "i", !e.getAttribute("className")
      }), k.getElementsByTagName = r(function (e) {
        return e.appendChild(N.createComment("")), !e.getElementsByTagName("*").length
      }), k.getElementsByClassName = me.test(N.getElementsByClassName), k.getById = r(function (e) {
        return G.appendChild(e).id = R, !N.getElementsByName || !N.getElementsByName(R).length
      }), k.getById ? (T.filter.ID = function (e) {
        var t = e.replace(be, ye);
        return function (e) {
          return e.getAttribute("id") === t
        }
      }, T.find.ID = function (e, t) {
        if (void 0 !== t.getElementById && _) {
          var n = t.getElementById(e);
          return n ? [n] : []
        }
      }) : (T.filter.ID = function (e) {
        var t = e.replace(be, ye);
        return function (e) {
          var n = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
          return n && n.value === t
        }
      }, T.find.ID = function (e, t) {
        if (void 0 !== t.getElementById && _) {
          var n, i, r, o = t.getElementById(e);
          if (o) {
            if ((n = o.getAttributeNode("id")) && n.value === e) return [o];
            for (r = t.getElementsByName(e), i = 0; o = r[i++];)
              if ((n = o.getAttributeNode("id")) && n.value === e) return [o]
          }
          return []
        }
      }), T.find.TAG = k.getElementsByTagName ? function (e, t) {
        return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : k.qsa ? t.querySelectorAll(e) : void 0
      } : function (e, t) {
        var n, i = [],
          r = 0,
          o = t.getElementsByTagName(e);
        if ("*" === e) {
          for (; n = o[r++];) 1 === n.nodeType && i.push(n);
          return i
        }
        return o
      }, T.find.CLASS = k.getElementsByClassName && function (e, t) {
        if (void 0 !== t.getElementsByClassName && _) return t.getElementsByClassName(e)
      }, O = [], M = [], (k.qsa = me.test(N.querySelectorAll)) && (r(function (e) {
        G.appendChild(e).innerHTML = "<a id='" + R + "'></a><select id='" + R + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && M.push("[*^$]=" + te + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || M.push("\\[" + te + "*(?:value|" + ee + ")"), e.querySelectorAll("[id~=" + R + "-]").length || M.push("~="), e.querySelectorAll(":checked").length || M.push(":checked"), e.querySelectorAll("a#" + R + "+*").length || M.push(".#.+[+~]")
      }), r(function (e) {
        e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
        var t = N.createElement("input");
        t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && M.push("name" + te + "*[*^$|!~]?="), 2 !== e.querySelectorAll(":enabled").length && M.push(":enabled", ":disabled"), G.appendChild(e).disabled = !0, 2 !== e.querySelectorAll(":disabled").length && M.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), M.push(",.*:")
      })), (k.matchesSelector = me.test(F = G.matches || G.webkitMatchesSelector || G.mozMatchesSelector || G.oMatchesSelector || G.msMatchesSelector)) && r(function (e) {
        k.disconnectedMatch = F.call(e, "*"), F.call(e, "[s!='']:x"), O.push("!=", re)
      }), M = M.length && new RegExp(M.join("|")), O = O.length && new RegExp(O.join("|")), t = me.test(G.compareDocumentPosition), j = t || me.test(G.contains) ? function (e, t) {
        var n = 9 === e.nodeType ? e.documentElement : e,
          i = t && t.parentNode;
        return e === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(i)))
      } : function (e, t) {
        if (t)
          for (; t = t.parentNode;)
            if (t === e) return !0;
        return !1
      }, U = t ? function (e, t) {
        if (e === t) return D = !0, 0;
        var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
        return n || (1 & (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !k.sortDetached && t.compareDocumentPosition(e) === n ? e === N || e.ownerDocument === q && j(q, e) ? -1 : t === N || t.ownerDocument === q && j(q, t) ? 1 : I ? Z(I, e) - Z(I, t) : 0 : 4 & n ? -1 : 1)
      } : function (e, t) {
        if (e === t) return D = !0, 0;
        var n, i = 0,
          r = e.parentNode,
          o = t.parentNode,
          s = [e],
          l = [t];
        if (!r || !o) return e === N ? -1 : t === N ? 1 : r ? -1 : o ? 1 : I ? Z(I, e) - Z(I, t) : 0;
        if (r === o) return a(e, t);
        for (n = e; n = n.parentNode;) s.unshift(n);
        for (n = t; n = n.parentNode;) l.unshift(n);
        for (; s[i] === l[i];) i++;
        return i ? a(s[i], l[i]) : s[i] === q ? -1 : l[i] === q ? 1 : 0
      }, N) : N
    }, t.matches = function (e, n) {
      return t(e, null, null, n)
    }, t.matchesSelector = function (e, n) {
      if ((e.ownerDocument || e) !== N && L(e), n = n.replace(ue, "='$1']"), k.matchesSelector && _ && !W[n + " "] && (!O || !O.test(n)) && (!M || !M.test(n))) try {
        var i = F.call(e, n);
        if (i || k.disconnectedMatch || e.document && 11 !== e.document.nodeType) return i
      } catch (e) {}
      return t(n, N, null, [e]).length > 0
    }, t.contains = function (e, t) {
      return (e.ownerDocument || e) !== N && L(e), j(e, t)
    }, t.attr = function (e, t) {
      (e.ownerDocument || e) !== N && L(e);
      var n = T.attrHandle[t.toLowerCase()],
        i = n && X.call(T.attrHandle, t.toLowerCase()) ? n(e, t, !_) : void 0;
      return void 0 !== i ? i : k.attributes || !_ ? e.getAttribute(t) : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
    }, t.escape = function (e) {
      return (e + "").replace(we, ke)
    }, t.error = function (e) {
      throw new Error("Syntax error, unrecognized expression: " + e)
    }, t.uniqueSort = function (e) {
      var t, n = [],
        i = 0,
        r = 0;
      if (D = !k.detectDuplicates, I = !k.sortStable && e.slice(0), e.sort(U), D) {
        for (; t = e[r++];) t === e[r] && (i = n.push(r));
        for (; i--;) e.splice(n[i], 1)
      }
      return I = null, e
    }, x = t.getText = function (e) {
      var t, n = "",
        i = 0,
        r = e.nodeType;
      if (r) {
        if (1 === r || 9 === r || 11 === r) {
          if ("string" == typeof e.textContent) return e.textContent;
          for (e = e.firstChild; e; e = e.nextSibling) n += x(e)
        } else if (3 === r || 4 === r) return e.nodeValue
      } else
        for (; t = e[i++];) n += x(t);
      return n
    }, (T = t.selectors = {
      cacheLength: 50,
      createPseudo: i,
      match: he,
      attrHandle: {},
      find: {},
      relative: {
        ">": {
          dir: "parentNode",
          first: !0
        },
        " ": {
          dir: "parentNode"
        },
        "+": {
          dir: "previousSibling",
          first: !0
        },
        "~": {
          dir: "previousSibling"
        }
      },
      preFilter: {
        ATTR: function (e) {
          return e[1] = e[1].replace(be, ye), e[3] = (e[3] || e[4] || e[5] || "").replace(be, ye), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
        },
        CHILD: function (e) {
          return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
        },
        PSEUDO: function (e) {
          var t, n = !e[6] && e[2];
          return he.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && ce.test(n) && (t = C(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
        }
      },
      filter: {
        TAG: function (e) {
          var t = e.replace(be, ye).toLowerCase();
          return "*" === e ? function () {
            return !0
          } : function (e) {
            return e.nodeName && e.nodeName.toLowerCase() === t
          }
        },
        CLASS: function (e) {
          var t = B[e + " "];
          return t || (t = new RegExp("(^|" + te + ")" + e + "(" + te + "|$)")) && B(e, function (e) {
            return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "")
          })
        },
        ATTR: function (e, n, i) {
          return function (r) {
            var o = t.attr(r, e);
            return null == o ? "!=" === n : !n || (o += "", "=" === n ? o === i : "!=" === n ? o !== i : "^=" === n ? i && 0 === o.indexOf(i) : "*=" === n ? i && o.indexOf(i) > -1 : "$=" === n ? i && o.slice(-i.length) === i : "~=" === n ? (" " + o.replace(oe, " ") + " ").indexOf(i) > -1 : "|=" === n && (o === i || o.slice(0, i.length + 1) === i + "-"))
          }
        },
        CHILD: function (e, t, n, i, r) {
          var o = "nth" !== e.slice(0, 3),
            a = "last" !== e.slice(-4),
            s = "of-type" === t;
          return 1 === i && 0 === r ? function (e) {
            return !!e.parentNode
          } : function (t, n, l) {
            var u, c, d, h, p, f, m = o !== a ? "nextSibling" : "previousSibling",
              g = t.parentNode,
              v = s && t.nodeName.toLowerCase(),
              b = !l && !s,
              y = !1;
            if (g) {
              if (o) {
                for (; m;) {
                  for (h = t; h = h[m];)
                    if (s ? h.nodeName.toLowerCase() === v : 1 === h.nodeType) return !1;
                  f = m = "only" === e && !f && "nextSibling"
                }
                return !0
              }
              if (f = [a ? g.firstChild : g.lastChild], a && b) {
                for (y = (p = (u = (c = (d = (h = g)[R] || (h[R] = {}))[h.uniqueID] || (d[h.uniqueID] = {}))[e] || [])[0] === H && u[1]) && u[2], h = p && g.childNodes[p]; h = ++p && h && h[m] || (y = p = 0) || f.pop();)
                  if (1 === h.nodeType && ++y && h === t) {
                    c[e] = [H, p, y];
                    break
                  }
              } else if (b && (y = p = (u = (c = (d = (h = t)[R] || (h[R] = {}))[h.uniqueID] || (d[h.uniqueID] = {}))[e] || [])[0] === H && u[1]), !1 === y)
                for (;
                  (h = ++p && h && h[m] || (y = p = 0) || f.pop()) && ((s ? h.nodeName.toLowerCase() !== v : 1 !== h.nodeType) || !++y || (b && ((c = (d = h[R] || (h[R] = {}))[h.uniqueID] || (d[h.uniqueID] = {}))[e] = [H, y]), h !== t)););
              return (y -= r) === i || y % i == 0 && y / i >= 0
            }
          }
        },
        PSEUDO: function (e, n) {
          var r, o = T.pseudos[e] || T.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
          return o[R] ? o(n) : o.length > 1 ? (r = [e, e, "", n], T.setFilters.hasOwnProperty(e.toLowerCase()) ? i(function (e, t) {
            for (var i, r = o(e, n), a = r.length; a--;) e[i = Z(e, r[a])] = !(t[i] = r[a])
          }) : function (e) {
            return o(e, 0, r)
          }) : o
        }
      },
      pseudos: {
        not: i(function (e) {
          var t = [],
            n = [],
            r = P(e.replace(ae, "$1"));
          return r[R] ? i(function (e, t, n, i) {
            for (var o, a = r(e, null, i, []), s = e.length; s--;)(o = a[s]) && (e[s] = !(t[s] = o))
          }) : function (e, i, o) {
            return t[0] = e, r(t, null, o, n), t[0] = null, !n.pop()
          }
        }),
        has: i(function (e) {
          return function (n) {
            return t(e, n).length > 0
          }
        }),
        contains: i(function (e) {
          return e = e.replace(be, ye),
            function (t) {
              return (t.textContent || t.innerText || x(t)).indexOf(e) > -1
            }
        }),
        lang: i(function (e) {
          return de.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(be, ye).toLowerCase(),
            function (t) {
              var n;
              do {
                if (n = _ ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return (n = n.toLowerCase()) === e || 0 === n.indexOf(e + "-")
              } while ((t = t.parentNode) && 1 === t.nodeType);
              return !1
            }
        }),
        target: function (t) {
          var n = e.location && e.location.hash;
          return n && n.slice(1) === t.id
        },
        root: function (e) {
          return e === G
        },
        focus: function (e) {
          return e === N.activeElement && (!N.hasFocus || N.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
        },
        enabled: u(!1),
        disabled: u(!0),
        checked: function (e) {
          var t = e.nodeName.toLowerCase();
          return "input" === t && !!e.checked || "option" === t && !!e.selected
        },
        selected: function (e) {
          return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
        },
        empty: function (e) {
          for (e = e.firstChild; e; e = e.nextSibling)
            if (e.nodeType < 6) return !1;
          return !0
        },
        parent: function (e) {
          return !T.pseudos.empty(e)
        },
        header: function (e) {
          return fe.test(e.nodeName)
        },
        input: function (e) {
          return pe.test(e.nodeName)
        },
        button: function (e) {
          var t = e.nodeName.toLowerCase();
          return "input" === t && "button" === e.type || "button" === t
        },
        text: function (e) {
          var t;
          return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
        },
        first: c(function () {
          return [0]
        }),
        last: c(function (e, t) {
          return [t - 1]
        }),
        eq: c(function (e, t, n) {
          return [n < 0 ? n + t : n]
        }),
        even: c(function (e, t) {
          for (var n = 0; n < t; n += 2) e.push(n);
          return e
        }),
        odd: c(function (e, t) {
          for (var n = 1; n < t; n += 2) e.push(n);
          return e
        }),
        lt: c(function (e, t, n) {
          for (var i = n < 0 ? n + t : n; --i >= 0;) e.push(i);
          return e
        }),
        gt: c(function (e, t, n) {
          for (var i = n < 0 ? n + t : n; ++i < t;) e.push(i);
          return e
        })
      }
    }).pseudos.nth = T.pseudos.eq;
    for (w in {
        radio: !0,
        checkbox: !0,
        file: !0,
        password: !0,
        image: !0
      }) T.pseudos[w] = s(w);
    for (w in {
        submit: !0,
        reset: !0
      }) T.pseudos[w] = l(w);
    return h.prototype = T.filters = T.pseudos, T.setFilters = new h, C = t.tokenize = function (e, n) {
      var i, r, o, a, s, l, u, c = V[e + " "];
      if (c) return n ? 0 : c.slice(0);
      for (s = e, l = [], u = T.preFilter; s;) {
        i && !(r = se.exec(s)) || (r && (s = s.slice(r[0].length) || s), l.push(o = [])), i = !1, (r = le.exec(s)) && (i = r.shift(), o.push({
          value: i,
          type: r[0].replace(ae, " ")
        }), s = s.slice(i.length));
        for (a in T.filter) !(r = he[a].exec(s)) || u[a] && !(r = u[a](r)) || (i = r.shift(), o.push({
          value: i,
          type: a,
          matches: r
        }), s = s.slice(i.length));
        if (!i) break
      }
      return n ? s.length : s ? t.error(e) : V(e, l).slice(0)
    }, P = t.compile = function (e, t) {
      var n, i = [],
        r = [],
        o = W[e + " "];
      if (!o) {
        for (t || (t = C(e)), n = t.length; n--;)(o = b(t[n]))[R] ? i.push(o) : r.push(o);
        (o = W(e, y(r, i))).selector = e
      }
      return o
    }, E = t.select = function (e, t, n, i) {
      var r, o, a, s, l, u = "function" == typeof e && e,
        c = !i && C(e = u.selector || e);
      if (n = n || [], 1 === c.length) {
        if ((o = c[0] = c[0].slice(0)).length > 2 && "ID" === (a = o[0]).type && 9 === t.nodeType && _ && T.relative[o[1].type]) {
          if (!(t = (T.find.ID(a.matches[0].replace(be, ye), t) || [])[0])) return n;
          u && (t = t.parentNode), e = e.slice(o.shift().value.length)
        }
        for (r = he.needsContext.test(e) ? 0 : o.length; r-- && (a = o[r], !T.relative[s = a.type]);)
          if ((l = T.find[s]) && (i = l(a.matches[0].replace(be, ye), ve.test(o[0].type) && d(t.parentNode) || t))) {
            if (o.splice(r, 1), !(e = i.length && p(o))) return Q.apply(n, i), n;
            break
          }
      }
      return (u || P(e, c))(i, t, !_, n, !t || ve.test(e) && d(t.parentNode) || t), n
    }, k.sortStable = R.split("").sort(U).join("") === R, k.detectDuplicates = !!D, L(), k.sortDetached = r(function (e) {
      return 1 & e.compareDocumentPosition(N.createElement("fieldset"))
    }), r(function (e) {
      return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
    }) || o("type|href|height|width", function (e, t, n) {
      if (!n) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
    }), k.attributes && r(function (e) {
      return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
    }) || o("value", function (e, t, n) {
      if (!n && "input" === e.nodeName.toLowerCase()) return e.defaultValue
    }), r(function (e) {
      return null == e.getAttribute("disabled")
    }) || o(ee, function (e, t, n) {
      var i;
      if (!n) return !0 === e[t] ? t.toLowerCase() : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
    }), t
  }(e);
  fe.find = ge, fe.expr = ge.selectors, fe.expr[":"] = fe.expr.pseudos, fe.uniqueSort = fe.unique = ge.uniqueSort, fe.text = ge.getText, fe.isXMLDoc = ge.isXML, fe.contains = ge.contains, fe.escapeSelector = ge.escape;
  var ve = function (e, t, n) {
      for (var i = [], r = void 0 !== n;
        (e = e[t]) && 9 !== e.nodeType;)
        if (1 === e.nodeType) {
          if (r && fe(e).is(n)) break;
          i.push(e)
        } return i
    },
    be = function (e, t) {
      for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
      return n
    },
    ye = fe.expr.match.needsContext,
    we = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
  fe.filter = function (e, t, n) {
    var i = t[0];
    return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === i.nodeType ? fe.find.matchesSelector(i, e) ? [i] : [] : fe.find.matches(e, fe.grep(t, function (e) {
      return 1 === e.nodeType
    }))
  }, fe.fn.extend({
    find: function (e) {
      var t, n, i = this.length,
        r = this;
      if ("string" != typeof e) return this.pushStack(fe(e).filter(function () {
        for (t = 0; t < i; t++)
          if (fe.contains(r[t], this)) return !0
      }));
      for (n = this.pushStack([]), t = 0; t < i; t++) fe.find(e, r[t], n);
      return i > 1 ? fe.uniqueSort(n) : n
    },
    filter: function (e) {
      return this.pushStack(a(this, e || [], !1))
    },
    not: function (e) {
      return this.pushStack(a(this, e || [], !0))
    },
    is: function (e) {
      return !!a(this, "string" == typeof e && ye.test(e) ? fe(e) : e || [], !1).length
    }
  });
  var ke, Te = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
  (fe.fn.init = function (e, t, n) {
    var i, r;
    if (!e) return this;
    if (n = n || ke, "string" == typeof e) {
      if (!(i = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : Te.exec(e)) || !i[1] && t) return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
      if (i[1]) {
        if (t = t instanceof fe ? t[0] : t, fe.merge(this, fe.parseHTML(i[1], t && t.nodeType ? t.ownerDocument || t : Z, !0)), we.test(i[1]) && fe.isPlainObject(t))
          for (i in t) de(this[i]) ? this[i](t[i]) : this.attr(i, t[i]);
        return this
      }
      return (r = Z.getElementById(i[2])) && (this[0] = r, this.length = 1), this
    }
    return e.nodeType ? (this[0] = e, this.length = 1, this) : de(e) ? void 0 !== n.ready ? n.ready(e) : e(fe) : fe.makeArray(e, this)
  }).prototype = fe.fn, ke = fe(Z);
  var xe = /^(?:parents|prev(?:Until|All))/,
    Se = {
      children: !0,
      contents: !0,
      next: !0,
      prev: !0
    };
  fe.fn.extend({
    has: function (e) {
      var t = fe(e, this),
        n = t.length;
      return this.filter(function () {
        for (var e = 0; e < n; e++)
          if (fe.contains(this, t[e])) return !0
      })
    },
    closest: function (e, t) {
      var n, i = 0,
        r = this.length,
        o = [],
        a = "string" != typeof e && fe(e);
      if (!ye.test(e))
        for (; i < r; i++)
          for (n = this[i]; n && n !== t; n = n.parentNode)
            if (n.nodeType < 11 && (a ? a.index(n) > -1 : 1 === n.nodeType && fe.find.matchesSelector(n, e))) {
              o.push(n);
              break
            } return this.pushStack(o.length > 1 ? fe.uniqueSort(o) : o)
    },
    index: function (e) {
      return e ? "string" == typeof e ? re.call(fe(e), this[0]) : re.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
    },
    add: function (e, t) {
      return this.pushStack(fe.uniqueSort(fe.merge(this.get(), fe(e, t))))
    },
    addBack: function (e) {
      return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
    }
  }), fe.each({
    parent: function (e) {
      var t = e.parentNode;
      return t && 11 !== t.nodeType ? t : null
    },
    parents: function (e) {
      return ve(e, "parentNode")
    },
    parentsUntil: function (e, t, n) {
      return ve(e, "parentNode", n)
    },
    next: function (e) {
      return s(e, "nextSibling")
    },
    prev: function (e) {
      return s(e, "previousSibling")
    },
    nextAll: function (e) {
      return ve(e, "nextSibling")
    },
    prevAll: function (e) {
      return ve(e, "previousSibling")
    },
    nextUntil: function (e, t, n) {
      return ve(e, "nextSibling", n)
    },
    prevUntil: function (e, t, n) {
      return ve(e, "previousSibling", n)
    },
    siblings: function (e) {
      return be((e.parentNode || {}).firstChild, e)
    },
    children: function (e) {
      return be(e.firstChild)
    },
    contents: function (e) {
      return o(e, "iframe") ? e.contentDocument : (o(e, "template") && (e = e.content || e), fe.merge([], e.childNodes))
    }
  }, function (e, t) {
    fe.fn[e] = function (n, i) {
      var r = fe.map(this, t, n);
      return "Until" !== e.slice(-5) && (i = n), i && "string" == typeof i && (r = fe.filter(i, r)), this.length > 1 && (Se[e] || fe.uniqueSort(r), xe.test(e) && r.reverse()), this.pushStack(r)
    }
  });
  var Ce = /[^\x20\t\r\n\f]+/g;
  fe.Callbacks = function (e) {
    e = "string" == typeof e ? function (e) {
      var t = {};
      return fe.each(e.match(Ce) || [], function (e, n) {
        t[n] = !0
      }), t
    }(e) : fe.extend({}, e);
    var t, n, r, o, a = [],
      s = [],
      l = -1,
      u = function () {
        for (o = o || e.once, r = t = !0; s.length; l = -1)
          for (n = s.shift(); ++l < a.length;) !1 === a[l].apply(n[0], n[1]) && e.stopOnFalse && (l = a.length, n = !1);
        e.memory || (n = !1), t = !1, o && (a = n ? [] : "")
      },
      c = {
        add: function () {
          return a && (n && !t && (l = a.length - 1, s.push(n)), function t(n) {
            fe.each(n, function (n, r) {
              de(r) ? e.unique && c.has(r) || a.push(r) : r && r.length && "string" !== i(r) && t(r)
            })
          }(arguments), n && !t && u()), this
        },
        remove: function () {
          return fe.each(arguments, function (e, t) {
            for (var n;
              (n = fe.inArray(t, a, n)) > -1;) a.splice(n, 1), n <= l && l--
          }), this
        },
        has: function (e) {
          return e ? fe.inArray(e, a) > -1 : a.length > 0
        },
        empty: function () {
          return a && (a = []), this
        },
        disable: function () {
          return o = s = [], a = n = "", this
        },
        disabled: function () {
          return !a
        },
        lock: function () {
          return o = s = [], n || t || (a = n = ""), this
        },
        locked: function () {
          return !!o
        },
        fireWith: function (e, n) {
          return o || (n = [e, (n = n || []).slice ? n.slice() : n], s.push(n), t || u()), this
        },
        fire: function () {
          return c.fireWith(this, arguments), this
        },
        fired: function () {
          return !!r
        }
      };
    return c
  }, fe.extend({
    Deferred: function (t) {
      var n = [
          ["notify", "progress", fe.Callbacks("memory"), fe.Callbacks("memory"), 2],
          ["resolve", "done", fe.Callbacks("once memory"), fe.Callbacks("once memory"), 0, "resolved"],
          ["reject", "fail", fe.Callbacks("once memory"), fe.Callbacks("once memory"), 1, "rejected"]
        ],
        i = "pending",
        r = {
          state: function () {
            return i
          },
          always: function () {
            return o.done(arguments).fail(arguments), this
          },
          catch: function (e) {
            return r.then(null, e)
          },
          pipe: function () {
            var e = arguments;
            return fe.Deferred(function (t) {
              fe.each(n, function (n, i) {
                var r = de(e[i[4]]) && e[i[4]];
                o[i[1]](function () {
                  var e = r && r.apply(this, arguments);
                  e && de(e.promise) ? e.promise().progress(t.notify).done(t.resolve).fail(t.reject) : t[i[0] + "With"](this, r ? [e] : arguments)
                })
              }), e = null
            }).promise()
          },
          then: function (t, i, r) {
            function o(t, n, i, r) {
              return function () {
                var s = this,
                  c = arguments,
                  d = function () {
                    var e, d;
                    if (!(t < a)) {
                      if ((e = i.apply(s, c)) === n.promise()) throw new TypeError("Thenable self-resolution");
                      d = e && ("object" == typeof e || "function" == typeof e) && e.then, de(d) ? r ? d.call(e, o(a, n, l, r), o(a, n, u, r)) : (a++, d.call(e, o(a, n, l, r), o(a, n, u, r), o(a, n, l, n.notifyWith))) : (i !== l && (s = void 0, c = [e]), (r || n.resolveWith)(s, c))
                    }
                  },
                  h = r ? d : function () {
                    try {
                      d()
                    } catch (e) {
                      fe.Deferred.exceptionHook && fe.Deferred.exceptionHook(e, h.stackTrace), t + 1 >= a && (i !== u && (s = void 0, c = [e]), n.rejectWith(s, c))
                    }
                  };
                t ? h() : (fe.Deferred.getStackHook && (h.stackTrace = fe.Deferred.getStackHook()), e.setTimeout(h))
              }
            }
            var a = 0;
            return fe.Deferred(function (e) {
              n[0][3].add(o(0, e, de(r) ? r : l, e.notifyWith)), n[1][3].add(o(0, e, de(t) ? t : l)), n[2][3].add(o(0, e, de(i) ? i : u))
            }).promise()
          },
          promise: function (e) {
            return null != e ? fe.extend(e, r) : r
          }
        },
        o = {};
      return fe.each(n, function (e, t) {
        var a = t[2],
          s = t[5];
        r[t[1]] = a.add, s && a.add(function () {
          i = s
        }, n[3 - e][2].disable, n[3 - e][3].disable, n[0][2].lock, n[0][3].lock), a.add(t[3].fire), o[t[0]] = function () {
          return o[t[0] + "With"](this === o ? void 0 : this, arguments), this
        }, o[t[0] + "With"] = a.fireWith
      }), r.promise(o), t && t.call(o, o), o
    },
    when: function (e) {
      var t = arguments.length,
        n = t,
        i = Array(n),
        r = te.call(arguments),
        o = fe.Deferred(),
        a = function (e) {
          return function (n) {
            i[e] = this, r[e] = arguments.length > 1 ? te.call(arguments) : n, --t || o.resolveWith(i, r)
          }
        };
      if (t <= 1 && (c(e, o.done(a(n)).resolve, o.reject, !t), "pending" === o.state() || de(r[n] && r[n].then))) return o.then();
      for (; n--;) c(r[n], a(n), o.reject);
      return o.promise()
    }
  });
  var Pe = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
  fe.Deferred.exceptionHook = function (t, n) {
    e.console && e.console.warn && t && Pe.test(t.name) && e.console.warn("jQuery.Deferred exception: " + t.message, t.stack, n)
  }, fe.readyException = function (t) {
    e.setTimeout(function () {
      throw t
    })
  };
  var Ee = fe.Deferred();
  fe.fn.ready = function (e) {
    return Ee.then(e).catch(function (e) {
      fe.readyException(e)
    }), this
  }, fe.extend({
    isReady: !1,
    readyWait: 1,
    ready: function (e) {
      (!0 === e ? --fe.readyWait : fe.isReady) || (fe.isReady = !0, !0 !== e && --fe.readyWait > 0 || Ee.resolveWith(Z, [fe]))
    }
  }), fe.ready.then = Ee.then, "complete" === Z.readyState || "loading" !== Z.readyState && !Z.documentElement.doScroll ? e.setTimeout(fe.ready) : (Z.addEventListener("DOMContentLoaded", d), e.addEventListener("load", d));
  var Ae = function (e, t, n, r, o, a, s) {
      var l = 0,
        u = e.length,
        c = null == n;
      if ("object" === i(n)) {
        o = !0;
        for (l in n) Ae(e, t, l, n[l], !0, a, s)
      } else if (void 0 !== r && (o = !0, de(r) || (s = !0), c && (s ? (t.call(e, r), t = null) : (c = t, t = function (e, t, n) {
          return c.call(fe(e), n)
        })), t))
        for (; l < u; l++) t(e[l], n, s ? r : r.call(e[l], l, t(e[l], n)));
      return o ? e : c ? t.call(e) : u ? t(e[0], n) : a
    },
    Ie = /^-ms-/,
    De = /-([a-z])/g,
    Le = function (e) {
      return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
    };
  f.uid = 1, f.prototype = {
    cache: function (e) {
      var t = e[this.expando];
      return t || (t = {}, Le(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
        value: t,
        configurable: !0
      }))), t
    },
    set: function (e, t, n) {
      var i, r = this.cache(e);
      if ("string" == typeof t) r[p(t)] = n;
      else
        for (i in t) r[p(i)] = t[i];
      return r
    },
    get: function (e, t) {
      return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][p(t)]
    },
    access: function (e, t, n) {
      return void 0 === t || t && "string" == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n), void 0 !== n ? n : t)
    },
    remove: function (e, t) {
      var n, i = e[this.expando];
      if (void 0 !== i) {
        if (void 0 !== t) {
          n = (t = Array.isArray(t) ? t.map(p) : (t = p(t)) in i ? [t] : t.match(Ce) || []).length;
          for (; n--;) delete i[t[n]]
        }(void 0 === t || fe.isEmptyObject(i)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
      }
    },
    hasData: function (e) {
      var t = e[this.expando];
      return void 0 !== t && !fe.isEmptyObject(t)
    }
  };
  var Ne = new f,
    Ge = new f,
    _e = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    Me = /[A-Z]/g;
  fe.extend({
    hasData: function (e) {
      return Ge.hasData(e) || Ne.hasData(e)
    },
    data: function (e, t, n) {
      return Ge.access(e, t, n)
    },
    removeData: function (e, t) {
      Ge.remove(e, t)
    },
    _data: function (e, t, n) {
      return Ne.access(e, t, n)
    },
    _removeData: function (e, t) {
      Ne.remove(e, t)
    }
  }), fe.fn.extend({
    data: function (e, t) {
      var n, i, r, o = this[0],
        a = o && o.attributes;
      if (void 0 === e) {
        if (this.length && (r = Ge.get(o), 1 === o.nodeType && !Ne.get(o, "hasDataAttrs"))) {
          for (n = a.length; n--;) a[n] && 0 === (i = a[n].name).indexOf("data-") && (i = p(i.slice(5)), m(o, i, r[i]));
          Ne.set(o, "hasDataAttrs", !0)
        }
        return r
      }
      return "object" == typeof e ? this.each(function () {
        Ge.set(this, e)
      }) : Ae(this, function (t) {
        var n;
        if (o && void 0 === t) {
          if (void 0 !== (n = Ge.get(o, e))) return n;
          if (void 0 !== (n = m(o, e))) return n
        } else this.each(function () {
          Ge.set(this, e, t)
        })
      }, null, t, arguments.length > 1, null, !0)
    },
    removeData: function (e) {
      return this.each(function () {
        Ge.remove(this, e)
      })
    }
  }), fe.extend({
    queue: function (e, t, n) {
      var i;
      if (e) return t = (t || "fx") + "queue", i = Ne.get(e, t), n && (!i || Array.isArray(n) ? i = Ne.access(e, t, fe.makeArray(n)) : i.push(n)), i || []
    },
    dequeue: function (e, t) {
      t = t || "fx";
      var n = fe.queue(e, t),
        i = n.length,
        r = n.shift(),
        o = fe._queueHooks(e, t);
      "inprogress" === r && (r = n.shift(), i--), r && ("fx" === t && n.unshift("inprogress"), delete o.stop, r.call(e, function () {
        fe.dequeue(e, t)
      }, o)), !i && o && o.empty.fire()
    },
    _queueHooks: function (e, t) {
      var n = t + "queueHooks";
      return Ne.get(e, n) || Ne.access(e, n, {
        empty: fe.Callbacks("once memory").add(function () {
          Ne.remove(e, [t + "queue", n])
        })
      })
    }
  }), fe.fn.extend({
    queue: function (e, t) {
      var n = 2;
      return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? fe.queue(this[0], e) : void 0 === t ? this : this.each(function () {
        var n = fe.queue(this, e, t);
        fe._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && fe.dequeue(this, e)
      })
    },
    dequeue: function (e) {
      return this.each(function () {
        fe.dequeue(this, e)
      })
    },
    clearQueue: function (e) {
      return this.queue(e || "fx", [])
    },
    promise: function (e, t) {
      var n, i = 1,
        r = fe.Deferred(),
        o = this,
        a = this.length,
        s = function () {
          --i || r.resolveWith(o, [o])
        };
      for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; a--;)(n = Ne.get(o[a], e + "queueHooks")) && n.empty && (i++, n.empty.add(s));
      return s(), r.promise(t)
    }
  });
  var Oe = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
    Fe = new RegExp("^(?:([+-])=|)(" + Oe + ")([a-z%]*)$", "i"),
    je = ["Top", "Right", "Bottom", "Left"],
    Re = function (e, t) {
      return "none" === (e = t || e).style.display || "" === e.style.display && fe.contains(e.ownerDocument, e) && "none" === fe.css(e, "display")
    },
    qe = function (e, t, n, i) {
      var r, o, a = {};
      for (o in t) a[o] = e.style[o], e.style[o] = t[o];
      r = n.apply(e, i || []);
      for (o in t) e.style[o] = a[o];
      return r
    },
    He = {};
  fe.fn.extend({
    show: function () {
      return b(this, !0)
    },
    hide: function () {
      return b(this)
    },
    toggle: function (e) {
      return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function () {
        Re(this) ? fe(this).show() : fe(this).hide()
      })
    }
  });
  var $e = /^(?:checkbox|radio)$/i,
    Be = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i,
    Ve = /^$|^module$|\/(?:java|ecma)script/i,
    We = {
      option: [1, "<select multiple='multiple'>", "</select>"],
      thead: [1, "<table>", "</table>"],
      col: [2, "<table><colgroup>", "</colgroup></table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      _default: [0, "", ""]
    };
  We.optgroup = We.option, We.tbody = We.tfoot = We.colgroup = We.caption = We.thead, We.th = We.td;
  var Ue = /<|&#?\w+;/;
  ! function () {
    var e = Z.createDocumentFragment().appendChild(Z.createElement("div")),
      t = Z.createElement("input");
    t.setAttribute("type", "radio"), t.setAttribute("checked", "checked"), t.setAttribute("name", "t"), e.appendChild(t), ce.checkClone = e.cloneNode(!0).cloneNode(!0).lastChild.checked, e.innerHTML = "<textarea>x</textarea>", ce.noCloneChecked = !!e.cloneNode(!0).lastChild.defaultValue
  }();
  var Xe = Z.documentElement,
    ze = /^key/,
    Ye = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
    Ke = /^([^.]*)(?:\.(.+)|)/;
  fe.event = {
    global: {},
    add: function (e, t, n, i, r) {
      var o, a, s, l, u, c, d, h, p, f, m, g = Ne.get(e);
      if (g)
        for (n.handler && (n = (o = n).handler, r = o.selector), r && fe.find.matchesSelector(Xe, r), n.guid || (n.guid = fe.guid++), (l = g.events) || (l = g.events = {}), (a = g.handle) || (a = g.handle = function (t) {
            return void 0 !== fe && fe.event.triggered !== t.type ? fe.event.dispatch.apply(e, arguments) : void 0
          }), u = (t = (t || "").match(Ce) || [""]).length; u--;) p = m = (s = Ke.exec(t[u]) || [])[1], f = (s[2] || "").split(".").sort(), p && (d = fe.event.special[p] || {}, p = (r ? d.delegateType : d.bindType) || p, d = fe.event.special[p] || {}, c = fe.extend({
          type: p,
          origType: m,
          data: i,
          handler: n,
          guid: n.guid,
          selector: r,
          needsContext: r && fe.expr.match.needsContext.test(r),
          namespace: f.join(".")
        }, o), (h = l[p]) || ((h = l[p] = []).delegateCount = 0, d.setup && !1 !== d.setup.call(e, i, f, a) || e.addEventListener && e.addEventListener(p, a)), d.add && (d.add.call(e, c), c.handler.guid || (c.handler.guid = n.guid)), r ? h.splice(h.delegateCount++, 0, c) : h.push(c), fe.event.global[p] = !0)
    },
    remove: function (e, t, n, i, r) {
      var o, a, s, l, u, c, d, h, p, f, m, g = Ne.hasData(e) && Ne.get(e);
      if (g && (l = g.events)) {
        for (u = (t = (t || "").match(Ce) || [""]).length; u--;)
          if (s = Ke.exec(t[u]) || [], p = m = s[1], f = (s[2] || "").split(".").sort(), p) {
            for (d = fe.event.special[p] || {}, h = l[p = (i ? d.delegateType : d.bindType) || p] || [], s = s[2] && new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)"), a = o = h.length; o--;) c = h[o], !r && m !== c.origType || n && n.guid !== c.guid || s && !s.test(c.namespace) || i && i !== c.selector && ("**" !== i || !c.selector) || (h.splice(o, 1), c.selector && h.delegateCount--, d.remove && d.remove.call(e, c));
            a && !h.length && (d.teardown && !1 !== d.teardown.call(e, f, g.handle) || fe.removeEvent(e, p, g.handle), delete l[p])
          } else
            for (p in l) fe.event.remove(e, p + t[u], n, i, !0);
        fe.isEmptyObject(l) && Ne.remove(e, "handle events")
      }
    },
    dispatch: function (e) {
      var t, n, i, r, o, a, s = fe.event.fix(e),
        l = new Array(arguments.length),
        u = (Ne.get(this, "events") || {})[s.type] || [],
        c = fe.event.special[s.type] || {};
      for (l[0] = s, t = 1; t < arguments.length; t++) l[t] = arguments[t];
      if (s.delegateTarget = this, !c.preDispatch || !1 !== c.preDispatch.call(this, s)) {
        for (a = fe.event.handlers.call(this, s, u), t = 0;
          (r = a[t++]) && !s.isPropagationStopped();)
          for (s.currentTarget = r.elem, n = 0;
            (o = r.handlers[n++]) && !s.isImmediatePropagationStopped();) s.rnamespace && !s.rnamespace.test(o.namespace) || (s.handleObj = o, s.data = o.data, void 0 !== (i = ((fe.event.special[o.origType] || {}).handle || o.handler).apply(r.elem, l)) && !1 === (s.result = i) && (s.preventDefault(), s.stopPropagation()));
        return c.postDispatch && c.postDispatch.call(this, s), s.result
      }
    },
    handlers: function (e, t) {
      var n, i, r, o, a, s = [],
        l = t.delegateCount,
        u = e.target;
      if (l && u.nodeType && !("click" === e.type && e.button >= 1))
        for (; u !== this; u = u.parentNode || this)
          if (1 === u.nodeType && ("click" !== e.type || !0 !== u.disabled)) {
            for (o = [], a = {}, n = 0; n < l; n++) void 0 === a[r = (i = t[n]).selector + " "] && (a[r] = i.needsContext ? fe(r, this).index(u) > -1 : fe.find(r, this, null, [u]).length), a[r] && o.push(i);
            o.length && s.push({
              elem: u,
              handlers: o
            })
          } return u = this, l < t.length && s.push({
        elem: u,
        handlers: t.slice(l)
      }), s
    },
    addProp: function (e, t) {
      Object.defineProperty(fe.Event.prototype, e, {
        enumerable: !0,
        configurable: !0,
        get: de(t) ? function () {
          if (this.originalEvent) return t(this.originalEvent)
        } : function () {
          if (this.originalEvent) return this.originalEvent[e]
        },
        set: function (t) {
          Object.defineProperty(this, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: t
          })
        }
      })
    },
    fix: function (e) {
      return e[fe.expando] ? e : new fe.Event(e)
    },
    special: {
      load: {
        noBubble: !0
      },
      focus: {
        trigger: function () {
          if (this !== S() && this.focus) return this.focus(), !1
        },
        delegateType: "focusin"
      },
      blur: {
        trigger: function () {
          if (this === S() && this.blur) return this.blur(), !1
        },
        delegateType: "focusout"
      },
      click: {
        trigger: function () {
          if ("checkbox" === this.type && this.click && o(this, "input")) return this.click(), !1
        },
        _default: function (e) {
          return o(e.target, "a")
        }
      },
      beforeunload: {
        postDispatch: function (e) {
          void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
        }
      }
    }
  }, fe.removeEvent = function (e, t, n) {
    e.removeEventListener && e.removeEventListener(t, n)
  }, fe.Event = function (e, t) {
    if (!(this instanceof fe.Event)) return new fe.Event(e, t);
    e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? T : x, this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target, this.currentTarget = e.currentTarget, this.relatedTarget = e.relatedTarget) : this.type = e, t && fe.extend(this, t), this.timeStamp = e && e.timeStamp || Date.now(), this[fe.expando] = !0
  }, fe.Event.prototype = {
    constructor: fe.Event,
    isDefaultPrevented: x,
    isPropagationStopped: x,
    isImmediatePropagationStopped: x,
    isSimulated: !1,
    preventDefault: function () {
      var e = this.originalEvent;
      this.isDefaultPrevented = T, e && !this.isSimulated && e.preventDefault()
    },
    stopPropagation: function () {
      var e = this.originalEvent;
      this.isPropagationStopped = T, e && !this.isSimulated && e.stopPropagation()
    },
    stopImmediatePropagation: function () {
      var e = this.originalEvent;
      this.isImmediatePropagationStopped = T, e && !this.isSimulated && e.stopImmediatePropagation(), this.stopPropagation()
    }
  }, fe.each({
    altKey: !0,
    bubbles: !0,
    cancelable: !0,
    changedTouches: !0,
    ctrlKey: !0,
    detail: !0,
    eventPhase: !0,
    metaKey: !0,
    pageX: !0,
    pageY: !0,
    shiftKey: !0,
    view: !0,
    char: !0,
    charCode: !0,
    key: !0,
    keyCode: !0,
    button: !0,
    buttons: !0,
    clientX: !0,
    clientY: !0,
    offsetX: !0,
    offsetY: !0,
    pointerId: !0,
    pointerType: !0,
    screenX: !0,
    screenY: !0,
    targetTouches: !0,
    toElement: !0,
    touches: !0,
    which: function (e) {
      var t = e.button;
      return null == e.which && ze.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && void 0 !== t && Ye.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which
    }
  }, fe.event.addProp), fe.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout",
    pointerenter: "pointerover",
    pointerleave: "pointerout"
  }, function (e, t) {
    fe.event.special[e] = {
      delegateType: t,
      bindType: t,
      handle: function (e) {
        var n, i = e.relatedTarget,
          r = e.handleObj;
        return i && (i === this || fe.contains(this, i)) || (e.type = r.origType, n = r.handler.apply(this, arguments), e.type = t), n
      }
    }
  }), fe.fn.extend({
    on: function (e, t, n, i) {
      return C(this, e, t, n, i)
    },
    one: function (e, t, n, i) {
      return C(this, e, t, n, i, 1)
    },
    off: function (e, t, n) {
      var i, r;
      if (e && e.preventDefault && e.handleObj) return i = e.handleObj, fe(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
      if ("object" == typeof e) {
        for (r in e) this.off(r, t, e[r]);
        return this
      }
      return !1 !== t && "function" != typeof t || (n = t, t = void 0), !1 === n && (n = x), this.each(function () {
        fe.event.remove(this, e, n, t)
      })
    }
  });
  var Qe = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
    Je = /<script|<style|<link/i,
    Ze = /checked\s*(?:[^=]|=\s*.checked.)/i,
    et = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
  fe.extend({
    htmlPrefilter: function (e) {
      return e.replace(Qe, "<$1></$2>")
    },
    clone: function (e, t, n) {
      var i, r, o, a, s = e.cloneNode(!0),
        l = fe.contains(e.ownerDocument, e);
      if (!(ce.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || fe.isXMLDoc(e)))
        for (a = y(s), i = 0, r = (o = y(e)).length; i < r; i++) D(o[i], a[i]);
      if (t)
        if (n)
          for (o = o || y(e), a = a || y(s), i = 0, r = o.length; i < r; i++) I(o[i], a[i]);
        else I(e, s);
      return (a = y(s, "script")).length > 0 && w(a, !l && y(e, "script")), s
    },
    cleanData: function (e) {
      for (var t, n, i, r = fe.event.special, o = 0; void 0 !== (n = e[o]); o++)
        if (Le(n)) {
          if (t = n[Ne.expando]) {
            if (t.events)
              for (i in t.events) r[i] ? fe.event.remove(n, i) : fe.removeEvent(n, i, t.handle);
            n[Ne.expando] = void 0
          }
          n[Ge.expando] && (n[Ge.expando] = void 0)
        }
    }
  }), fe.fn.extend({
    detach: function (e) {
      return N(this, e, !0)
    },
    remove: function (e) {
      return N(this, e)
    },
    text: function (e) {
      return Ae(this, function (e) {
        return void 0 === e ? fe.text(this) : this.empty().each(function () {
          1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
        })
      }, null, e, arguments.length)
    },
    append: function () {
      return L(this, arguments, function (e) {
        1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || P(this, e).appendChild(e)
      })
    },
    prepend: function () {
      return L(this, arguments, function (e) {
        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
          var t = P(this, e);
          t.insertBefore(e, t.firstChild)
        }
      })
    },
    before: function () {
      return L(this, arguments, function (e) {
        this.parentNode && this.parentNode.insertBefore(e, this)
      })
    },
    after: function () {
      return L(this, arguments, function (e) {
        this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
      })
    },
    empty: function () {
      for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (fe.cleanData(y(e, !1)), e.textContent = "");
      return this
    },
    clone: function (e, t) {
      return e = null != e && e, t = null == t ? e : t, this.map(function () {
        return fe.clone(this, e, t)
      })
    },
    html: function (e) {
      return Ae(this, function (e) {
        var t = this[0] || {},
          n = 0,
          i = this.length;
        if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
        if ("string" == typeof e && !Je.test(e) && !We[(Be.exec(e) || ["", ""])[1].toLowerCase()]) {
          e = fe.htmlPrefilter(e);
          try {
            for (; n < i; n++) 1 === (t = this[n] || {}).nodeType && (fe.cleanData(y(t, !1)), t.innerHTML = e);
            t = 0
          } catch (e) {}
        }
        t && this.empty().append(e)
      }, null, e, arguments.length)
    },
    replaceWith: function () {
      var e = [];
      return L(this, arguments, function (t) {
        var n = this.parentNode;
        fe.inArray(this, e) < 0 && (fe.cleanData(y(this)), n && n.replaceChild(t, this))
      }, e)
    }
  }), fe.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
  }, function (e, t) {
    fe.fn[e] = function (e) {
      for (var n, i = [], r = fe(e), o = r.length - 1, a = 0; a <= o; a++) n = a === o ? this : this.clone(!0), fe(r[a])[t](n), ie.apply(i, n.get());
      return this.pushStack(i)
    }
  });
  var tt = new RegExp("^(" + Oe + ")(?!px)[a-z%]+$", "i"),
    nt = function (t) {
      var n = t.ownerDocument.defaultView;
      return n && n.opener || (n = e), n.getComputedStyle(t)
    },
    it = new RegExp(je.join("|"), "i");
  ! function () {
    function t() {
      if (u) {
        l.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", u.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", Xe.appendChild(l).appendChild(u);
        var t = e.getComputedStyle(u);
        i = "1%" !== t.top, s = 12 === n(t.marginLeft), u.style.right = "60%", a = 36 === n(t.right), r = 36 === n(t.width), u.style.position = "absolute", o = 36 === u.offsetWidth || "absolute", Xe.removeChild(l), u = null
      }
    }

    function n(e) {
      return Math.round(parseFloat(e))
    }
    var i, r, o, a, s, l = Z.createElement("div"),
      u = Z.createElement("div");
    u.style && (u.style.backgroundClip = "content-box", u.cloneNode(!0).style.backgroundClip = "", ce.clearCloneStyle = "content-box" === u.style.backgroundClip, fe.extend(ce, {
      boxSizingReliable: function () {
        return t(), r
      },
      pixelBoxStyles: function () {
        return t(), a
      },
      pixelPosition: function () {
        return t(), i
      },
      reliableMarginLeft: function () {
        return t(), s
      },
      scrollboxSize: function () {
        return t(), o
      }
    }))
  }();
  var rt = /^(none|table(?!-c[ea]).+)/,
    ot = /^--/,
    at = {
      position: "absolute",
      visibility: "hidden",
      display: "block"
    },
    st = {
      letterSpacing: "0",
      fontWeight: "400"
    },
    lt = ["Webkit", "Moz", "ms"],
    ut = Z.createElement("div").style;
  fe.extend({
    cssHooks: {
      opacity: {
        get: function (e, t) {
          if (t) {
            var n = G(e, "opacity");
            return "" === n ? "1" : n
          }
        }
      }
    },
    cssNumber: {
      animationIterationCount: !0,
      columnCount: !0,
      fillOpacity: !0,
      flexGrow: !0,
      flexShrink: !0,
      fontWeight: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0
    },
    cssProps: {},
    style: function (e, t, n, i) {
      if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
        var r, o, a, s = p(t),
          l = ot.test(t),
          u = e.style;
        if (l || (t = M(s)), a = fe.cssHooks[t] || fe.cssHooks[s], void 0 === n) return a && "get" in a && void 0 !== (r = a.get(e, !1, i)) ? r : u[t];
        "string" == (o = typeof n) && (r = Fe.exec(n)) && r[1] && (n = g(e, t, r), o = "number"), null != n && n == n && ("number" === o && (n += r && r[3] || (fe.cssNumber[s] ? "" : "px")), ce.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (u[t] = "inherit"), a && "set" in a && void 0 === (n = a.set(e, n, i)) || (l ? u.setProperty(t, n) : u[t] = n))
      }
    },
    css: function (e, t, n, i) {
      var r, o, a, s = p(t);
      return ot.test(t) || (t = M(s)), (a = fe.cssHooks[t] || fe.cssHooks[s]) && "get" in a && (r = a.get(e, !0, n)), void 0 === r && (r = G(e, t, i)), "normal" === r && t in st && (r = st[t]), "" === n || n ? (o = parseFloat(r), !0 === n || isFinite(o) ? o || 0 : r) : r
    }
  }), fe.each(["height", "width"], function (e, t) {
    fe.cssHooks[t] = {
      get: function (e, n, i) {
        if (n) return !rt.test(fe.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? j(e, t, i) : qe(e, at, function () {
          return j(e, t, i)
        })
      },
      set: function (e, n, i) {
        var r, o = nt(e),
          a = "border-box" === fe.css(e, "boxSizing", !1, o),
          s = i && F(e, t, i, a, o);
        return a && ce.scrollboxSize() === o.position && (s -= Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - parseFloat(o[t]) - F(e, t, "border", !1, o) - .5)), s && (r = Fe.exec(n)) && "px" !== (r[3] || "px") && (e.style[t] = n, n = fe.css(e, t)), O(0, n, s)
      }
    }
  }), fe.cssHooks.marginLeft = _(ce.reliableMarginLeft, function (e, t) {
    if (t) return (parseFloat(G(e, "marginLeft")) || e.getBoundingClientRect().left - qe(e, {
      marginLeft: 0
    }, function () {
      return e.getBoundingClientRect().left
    })) + "px"
  }), fe.each({
    margin: "",
    padding: "",
    border: "Width"
  }, function (e, t) {
    fe.cssHooks[e + t] = {
      expand: function (n) {
        for (var i = 0, r = {}, o = "string" == typeof n ? n.split(" ") : [n]; i < 4; i++) r[e + je[i] + t] = o[i] || o[i - 2] || o[0];
        return r
      }
    }, "margin" !== e && (fe.cssHooks[e + t].set = O)
  }), fe.fn.extend({
    css: function (e, t) {
      return Ae(this, function (e, t, n) {
        var i, r, o = {},
          a = 0;
        if (Array.isArray(t)) {
          for (i = nt(e), r = t.length; a < r; a++) o[t[a]] = fe.css(e, t[a], !1, i);
          return o
        }
        return void 0 !== n ? fe.style(e, t, n) : fe.css(e, t)
      }, e, t, arguments.length > 1)
    }
  }), fe.Tween = R, (R.prototype = {
    constructor: R,
    init: function (e, t, n, i, r, o) {
      this.elem = e, this.prop = n, this.easing = r || fe.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = i, this.unit = o || (fe.cssNumber[n] ? "" : "px")
    },
    cur: function () {
      var e = R.propHooks[this.prop];
      return e && e.get ? e.get(this) : R.propHooks._default.get(this)
    },
    run: function (e) {
      var t, n = R.propHooks[this.prop];
      return this.options.duration ? this.pos = t = fe.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : R.propHooks._default.set(this), this
    }
  }).init.prototype = R.prototype, (R.propHooks = {
    _default: {
      get: function (e) {
        var t;
        return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = fe.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
      },
      set: function (e) {
        fe.fx.step[e.prop] ? fe.fx.step[e.prop](e) : 1 !== e.elem.nodeType || null == e.elem.style[fe.cssProps[e.prop]] && !fe.cssHooks[e.prop] ? e.elem[e.prop] = e.now : fe.style(e.elem, e.prop, e.now + e.unit)
      }
    }
  }).scrollTop = R.propHooks.scrollLeft = {
    set: function (e) {
      e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
    }
  }, fe.easing = {
    linear: function (e) {
      return e
    },
    swing: function (e) {
      return .5 - Math.cos(e * Math.PI) / 2
    },
    _default: "swing"
  }, fe.fx = R.prototype.init, fe.fx.step = {};
  var ct, dt, ht = /^(?:toggle|show|hide)$/,
    pt = /queueHooks$/;
  fe.Animation = fe.extend(V, {
      tweeners: {
        "*": [function (e, t) {
          var n = this.createTween(e, t);
          return g(n.elem, e, Fe.exec(t), n), n
        }]
      },
      tweener: function (e, t) {
        de(e) ? (t = e, e = ["*"]) : e = e.match(Ce);
        for (var n, i = 0, r = e.length; i < r; i++) n = e[i], V.tweeners[n] = V.tweeners[n] || [], V.tweeners[n].unshift(t)
      },
      prefilters: [function (e, t, n) {
        var i, r, o, a, s, l, u, c, d = "width" in t || "height" in t,
          h = this,
          p = {},
          f = e.style,
          m = e.nodeType && Re(e),
          g = Ne.get(e, "fxshow");
        n.queue || (null == (a = fe._queueHooks(e, "fx")).unqueued && (a.unqueued = 0, s = a.empty.fire, a.empty.fire = function () {
          a.unqueued || s()
        }), a.unqueued++, h.always(function () {
          h.always(function () {
            a.unqueued--, fe.queue(e, "fx").length || a.empty.fire()
          })
        }));
        for (i in t)
          if (r = t[i], ht.test(r)) {
            if (delete t[i], o = o || "toggle" === r, r === (m ? "hide" : "show")) {
              if ("show" !== r || !g || void 0 === g[i]) continue;
              m = !0
            }
            p[i] = g && g[i] || fe.style(e, i)
          } if ((l = !fe.isEmptyObject(t)) || !fe.isEmptyObject(p)) {
          d && 1 === e.nodeType && (n.overflow = [f.overflow, f.overflowX, f.overflowY], null == (u = g && g.display) && (u = Ne.get(e, "display")), "none" === (c = fe.css(e, "display")) && (u ? c = u : (b([e], !0), u = e.style.display || u, c = fe.css(e, "display"), b([e]))), ("inline" === c || "inline-block" === c && null != u) && "none" === fe.css(e, "float") && (l || (h.done(function () {
            f.display = u
          }), null == u && (c = f.display, u = "none" === c ? "" : c)), f.display = "inline-block")), n.overflow && (f.overflow = "hidden", h.always(function () {
            f.overflow = n.overflow[0], f.overflowX = n.overflow[1], f.overflowY = n.overflow[2]
          })), l = !1;
          for (i in p) l || (g ? "hidden" in g && (m = g.hidden) : g = Ne.access(e, "fxshow", {
            display: u
          }), o && (g.hidden = !m), m && b([e], !0), h.done(function () {
            m || b([e]), Ne.remove(e, "fxshow");
            for (i in p) fe.style(e, i, p[i])
          })), l = B(m ? g[i] : 0, i, h), i in g || (g[i] = l.start, m && (l.end = l.start, l.start = 0))
        }
      }],
      prefilter: function (e, t) {
        t ? V.prefilters.unshift(e) : V.prefilters.push(e)
      }
    }), fe.speed = function (e, t, n) {
      var i = e && "object" == typeof e ? fe.extend({}, e) : {
        complete: n || !n && t || de(e) && e,
        duration: e,
        easing: n && t || t && !de(t) && t
      };
      return fe.fx.off ? i.duration = 0 : "number" != typeof i.duration && (i.duration in fe.fx.speeds ? i.duration = fe.fx.speeds[i.duration] : i.duration = fe.fx.speeds._default), null != i.queue && !0 !== i.queue || (i.queue = "fx"), i.old = i.complete, i.complete = function () {
        de(i.old) && i.old.call(this), i.queue && fe.dequeue(this, i.queue)
      }, i
    }, fe.fn.extend({
      fadeTo: function (e, t, n, i) {
        return this.filter(Re).css("opacity", 0).show().end().animate({
          opacity: t
        }, e, n, i)
      },
      animate: function (e, t, n, i) {
        var r = fe.isEmptyObject(e),
          o = fe.speed(t, n, i),
          a = function () {
            var t = V(this, fe.extend({}, e), o);
            (r || Ne.get(this, "finish")) && t.stop(!0)
          };
        return a.finish = a, r || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
      },
      stop: function (e, t, n) {
        var i = function (e) {
          var t = e.stop;
          delete e.stop, t(n)
        };
        return "string" != typeof e && (n = t, t = e, e = void 0), t && !1 !== e && this.queue(e || "fx", []), this.each(function () {
          var t = !0,
            r = null != e && e + "queueHooks",
            o = fe.timers,
            a = Ne.get(this);
          if (r) a[r] && a[r].stop && i(a[r]);
          else
            for (r in a) a[r] && a[r].stop && pt.test(r) && i(a[r]);
          for (r = o.length; r--;) o[r].elem !== this || null != e && o[r].queue !== e || (o[r].anim.stop(n), t = !1, o.splice(r, 1));
          !t && n || fe.dequeue(this, e)
        })
      },
      finish: function (e) {
        return !1 !== e && (e = e || "fx"), this.each(function () {
          var t, n = Ne.get(this),
            i = n[e + "queue"],
            r = n[e + "queueHooks"],
            o = fe.timers,
            a = i ? i.length : 0;
          for (n.finish = !0, fe.queue(this, e, []), r && r.stop && r.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
          for (t = 0; t < a; t++) i[t] && i[t].finish && i[t].finish.call(this);
          delete n.finish
        })
      }
    }), fe.each(["toggle", "show", "hide"], function (e, t) {
      var n = fe.fn[t];
      fe.fn[t] = function (e, i, r) {
        return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate($(t, !0), e, i, r)
      }
    }), fe.each({
      slideDown: $("show"),
      slideUp: $("hide"),
      slideToggle: $("toggle"),
      fadeIn: {
        opacity: "show"
      },
      fadeOut: {
        opacity: "hide"
      },
      fadeToggle: {
        opacity: "toggle"
      }
    }, function (e, t) {
      fe.fn[e] = function (e, n, i) {
        return this.animate(t, e, n, i)
      }
    }), fe.timers = [], fe.fx.tick = function () {
      var e, t = 0,
        n = fe.timers;
      for (ct = Date.now(); t < n.length; t++)(e = n[t])() || n[t] !== e || n.splice(t--, 1);
      n.length || fe.fx.stop(), ct = void 0
    }, fe.fx.timer = function (e) {
      fe.timers.push(e), fe.fx.start()
    }, fe.fx.interval = 13, fe.fx.start = function () {
      dt || (dt = !0, q())
    }, fe.fx.stop = function () {
      dt = null
    }, fe.fx.speeds = {
      slow: 600,
      fast: 200,
      _default: 400
    }, fe.fn.delay = function (t, n) {
      return t = fe.fx ? fe.fx.speeds[t] || t : t, n = n || "fx", this.queue(n, function (n, i) {
        var r = e.setTimeout(n, t);
        i.stop = function () {
          e.clearTimeout(r)
        }
      })
    },
    function () {
      var e = Z.createElement("input"),
        t = Z.createElement("select").appendChild(Z.createElement("option"));
      e.type = "checkbox", ce.checkOn = "" !== e.value, ce.optSelected = t.selected, (e = Z.createElement("input")).value = "t", e.type = "radio", ce.radioValue = "t" === e.value
    }();
  var ft, mt = fe.expr.attrHandle;
  fe.fn.extend({
    attr: function (e, t) {
      return Ae(this, fe.attr, e, t, arguments.length > 1)
    },
    removeAttr: function (e) {
      return this.each(function () {
        fe.removeAttr(this, e)
      })
    }
  }), fe.extend({
    attr: function (e, t, n) {
      var i, r, o = e.nodeType;
      if (3 !== o && 8 !== o && 2 !== o) return void 0 === e.getAttribute ? fe.prop(e, t, n) : (1 === o && fe.isXMLDoc(e) || (r = fe.attrHooks[t.toLowerCase()] || (fe.expr.match.bool.test(t) ? ft : void 0)), void 0 !== n ? null === n ? void fe.removeAttr(e, t) : r && "set" in r && void 0 !== (i = r.set(e, n, t)) ? i : (e.setAttribute(t, n + ""), n) : r && "get" in r && null !== (i = r.get(e, t)) ? i : null == (i = fe.find.attr(e, t)) ? void 0 : i)
    },
    attrHooks: {
      type: {
        set: function (e, t) {
          if (!ce.radioValue && "radio" === t && o(e, "input")) {
            var n = e.value;
            return e.setAttribute("type", t), n && (e.value = n), t
          }
        }
      }
    },
    removeAttr: function (e, t) {
      var n, i = 0,
        r = t && t.match(Ce);
      if (r && 1 === e.nodeType)
        for (; n = r[i++];) e.removeAttribute(n)
    }
  }), ft = {
    set: function (e, t, n) {
      return !1 === t ? fe.removeAttr(e, n) : e.setAttribute(n, n), n
    }
  }, fe.each(fe.expr.match.bool.source.match(/\w+/g), function (e, t) {
    var n = mt[t] || fe.find.attr;
    mt[t] = function (e, t, i) {
      var r, o, a = t.toLowerCase();
      return i || (o = mt[a], mt[a] = r, r = null != n(e, t, i) ? a : null, mt[a] = o), r
    }
  });
  var gt = /^(?:input|select|textarea|button)$/i,
    vt = /^(?:a|area)$/i;
  fe.fn.extend({
    prop: function (e, t) {
      return Ae(this, fe.prop, e, t, arguments.length > 1)
    },
    removeProp: function (e) {
      return this.each(function () {
        delete this[fe.propFix[e] || e]
      })
    }
  }), fe.extend({
    prop: function (e, t, n) {
      var i, r, o = e.nodeType;
      if (3 !== o && 8 !== o && 2 !== o) return 1 === o && fe.isXMLDoc(e) || (t = fe.propFix[t] || t, r = fe.propHooks[t]), void 0 !== n ? r && "set" in r && void 0 !== (i = r.set(e, n, t)) ? i : e[t] = n : r && "get" in r && null !== (i = r.get(e, t)) ? i : e[t]
    },
    propHooks: {
      tabIndex: {
        get: function (e) {
          var t = fe.find.attr(e, "tabindex");
          return t ? parseInt(t, 10) : gt.test(e.nodeName) || vt.test(e.nodeName) && e.href ? 0 : -1
        }
      }
    },
    propFix: {
      for: "htmlFor",
      class: "className"
    }
  }), ce.optSelected || (fe.propHooks.selected = {
    get: function (e) {
      var t = e.parentNode;
      return t && t.parentNode && t.parentNode.selectedIndex, null
    },
    set: function (e) {
      var t = e.parentNode;
      t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex)
    }
  }), fe.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
    fe.propFix[this.toLowerCase()] = this
  }), fe.fn.extend({
    addClass: function (e) {
      var t, n, i, r, o, a, s, l = 0;
      if (de(e)) return this.each(function (t) {
        fe(this).addClass(e.call(this, t, U(this)))
      });
      if ((t = X(e)).length)
        for (; n = this[l++];)
          if (r = U(n), i = 1 === n.nodeType && " " + W(r) + " ") {
            for (a = 0; o = t[a++];) i.indexOf(" " + o + " ") < 0 && (i += o + " ");
            r !== (s = W(i)) && n.setAttribute("class", s)
          } return this
    },
    removeClass: function (e) {
      var t, n, i, r, o, a, s, l = 0;
      if (de(e)) return this.each(function (t) {
        fe(this).removeClass(e.call(this, t, U(this)))
      });
      if (!arguments.length) return this.attr("class", "");
      if ((t = X(e)).length)
        for (; n = this[l++];)
          if (r = U(n), i = 1 === n.nodeType && " " + W(r) + " ") {
            for (a = 0; o = t[a++];)
              for (; i.indexOf(" " + o + " ") > -1;) i = i.replace(" " + o + " ", " ");
            r !== (s = W(i)) && n.setAttribute("class", s)
          } return this
    },
    toggleClass: function (e, t) {
      var n = typeof e,
        i = "string" === n || Array.isArray(e);
      return "boolean" == typeof t && i ? t ? this.addClass(e) : this.removeClass(e) : de(e) ? this.each(function (n) {
        fe(this).toggleClass(e.call(this, n, U(this), t), t)
      }) : this.each(function () {
        var t, r, o, a;
        if (i)
          for (r = 0, o = fe(this), a = X(e); t = a[r++];) o.hasClass(t) ? o.removeClass(t) : o.addClass(t);
        else void 0 !== e && "boolean" !== n || ((t = U(this)) && Ne.set(this, "__className__", t), this.setAttribute && this.setAttribute("class", t || !1 === e ? "" : Ne.get(this, "__className__") || ""))
      })
    },
    hasClass: function (e) {
      var t, n, i = 0;
      for (t = " " + e + " "; n = this[i++];)
        if (1 === n.nodeType && (" " + W(U(n)) + " ").indexOf(t) > -1) return !0;
      return !1
    }
  });
  var bt = /\r/g;
  fe.fn.extend({
    val: function (e) {
      var t, n, i, r = this[0];
      return arguments.length ? (i = de(e), this.each(function (n) {
        var r;
        1 === this.nodeType && (null == (r = i ? e.call(this, n, fe(this).val()) : e) ? r = "" : "number" == typeof r ? r += "" : Array.isArray(r) && (r = fe.map(r, function (e) {
          return null == e ? "" : e + ""
        })), (t = fe.valHooks[this.type] || fe.valHooks[this.nodeName.toLowerCase()]) && "set" in t && void 0 !== t.set(this, r, "value") || (this.value = r))
      })) : r ? (t = fe.valHooks[r.type] || fe.valHooks[r.nodeName.toLowerCase()]) && "get" in t && void 0 !== (n = t.get(r, "value")) ? n : "string" == typeof (n = r.value) ? n.replace(bt, "") : null == n ? "" : n : void 0
    }
  }), fe.extend({
    valHooks: {
      option: {
        get: function (e) {
          var t = fe.find.attr(e, "value");
          return null != t ? t : W(fe.text(e))
        }
      },
      select: {
        get: function (e) {
          var t, n, i, r = e.options,
            a = e.selectedIndex,
            s = "select-one" === e.type,
            l = s ? null : [],
            u = s ? a + 1 : r.length;
          for (i = a < 0 ? u : s ? a : 0; i < u; i++)
            if (((n = r[i]).selected || i === a) && !n.disabled && (!n.parentNode.disabled || !o(n.parentNode, "optgroup"))) {
              if (t = fe(n).val(), s) return t;
              l.push(t)
            } return l
        },
        set: function (e, t) {
          for (var n, i, r = e.options, o = fe.makeArray(t), a = r.length; a--;)((i = r[a]).selected = fe.inArray(fe.valHooks.option.get(i), o) > -1) && (n = !0);
          return n || (e.selectedIndex = -1), o
        }
      }
    }
  }), fe.each(["radio", "checkbox"], function () {
    fe.valHooks[this] = {
      set: function (e, t) {
        if (Array.isArray(t)) return e.checked = fe.inArray(fe(e).val(), t) > -1
      }
    }, ce.checkOn || (fe.valHooks[this].get = function (e) {
      return null === e.getAttribute("value") ? "on" : e.value
    })
  }), ce.focusin = "onfocusin" in e;
  var yt = /^(?:focusinfocus|focusoutblur)$/,
    wt = function (e) {
      e.stopPropagation()
    };
  fe.extend(fe.event, {
    trigger: function (t, n, i, r) {
      var o, a, s, l, u, c, d, h, p = [i || Z],
        f = se.call(t, "type") ? t.type : t,
        m = se.call(t, "namespace") ? t.namespace.split(".") : [];
      if (a = h = s = i = i || Z, 3 !== i.nodeType && 8 !== i.nodeType && !yt.test(f + fe.event.triggered) && (f.indexOf(".") > -1 && (f = (m = f.split(".")).shift(), m.sort()), u = f.indexOf(":") < 0 && "on" + f, t = t[fe.expando] ? t : new fe.Event(f, "object" == typeof t && t), t.isTrigger = r ? 2 : 3, t.namespace = m.join("."), t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = i), n = null == n ? [t] : fe.makeArray(n, [t]), d = fe.event.special[f] || {}, r || !d.trigger || !1 !== d.trigger.apply(i, n))) {
        if (!r && !d.noBubble && !he(i)) {
          for (l = d.delegateType || f, yt.test(l + f) || (a = a.parentNode); a; a = a.parentNode) p.push(a), s = a;
          s === (i.ownerDocument || Z) && p.push(s.defaultView || s.parentWindow || e)
        }
        for (o = 0;
          (a = p[o++]) && !t.isPropagationStopped();) h = a, t.type = o > 1 ? l : d.bindType || f, (c = (Ne.get(a, "events") || {})[t.type] && Ne.get(a, "handle")) && c.apply(a, n), (c = u && a[u]) && c.apply && Le(a) && (t.result = c.apply(a, n), !1 === t.result && t.preventDefault());
        return t.type = f, r || t.isDefaultPrevented() || d._default && !1 !== d._default.apply(p.pop(), n) || !Le(i) || u && de(i[f]) && !he(i) && ((s = i[u]) && (i[u] = null), fe.event.triggered = f, t.isPropagationStopped() && h.addEventListener(f, wt), i[f](), t.isPropagationStopped() && h.removeEventListener(f, wt), fe.event.triggered = void 0, s && (i[u] = s)), t.result
      }
    },
    simulate: function (e, t, n) {
      var i = fe.extend(new fe.Event, n, {
        type: e,
        isSimulated: !0
      });
      fe.event.trigger(i, null, t)
    }
  }), fe.fn.extend({
    trigger: function (e, t) {
      return this.each(function () {
        fe.event.trigger(e, t, this)
      })
    },
    triggerHandler: function (e, t) {
      var n = this[0];
      if (n) return fe.event.trigger(e, t, n, !0)
    }
  }), ce.focusin || fe.each({
    focus: "focusin",
    blur: "focusout"
  }, function (e, t) {
    var n = function (e) {
      fe.event.simulate(t, e.target, fe.event.fix(e))
    };
    fe.event.special[t] = {
      setup: function () {
        var i = this.ownerDocument || this,
          r = Ne.access(i, t);
        r || i.addEventListener(e, n, !0), Ne.access(i, t, (r || 0) + 1)
      },
      teardown: function () {
        var i = this.ownerDocument || this,
          r = Ne.access(i, t) - 1;
        r ? Ne.access(i, t, r) : (i.removeEventListener(e, n, !0), Ne.remove(i, t))
      }
    }
  });
  var kt = e.location,
    Tt = Date.now(),
    xt = /\?/;
  fe.parseXML = function (t) {
    var n;
    if (!t || "string" != typeof t) return null;
    try {
      n = (new e.DOMParser).parseFromString(t, "text/xml")
    } catch (e) {
      n = void 0
    }
    return n && !n.getElementsByTagName("parsererror").length || fe.error("Invalid XML: " + t), n
  };
  var St = /\[\]$/,
    Ct = /\r?\n/g,
    Pt = /^(?:submit|button|image|reset|file)$/i,
    Et = /^(?:input|select|textarea|keygen)/i;
  fe.param = function (e, t) {
    var n, i = [],
      r = function (e, t) {
        var n = de(t) ? t() : t;
        i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n)
      };
    if (Array.isArray(e) || e.jquery && !fe.isPlainObject(e)) fe.each(e, function () {
      r(this.name, this.value)
    });
    else
      for (n in e) z(n, e[n], t, r);
    return i.join("&")
  }, fe.fn.extend({
    serialize: function () {
      return fe.param(this.serializeArray())
    },
    serializeArray: function () {
      return this.map(function () {
        var e = fe.prop(this, "elements");
        return e ? fe.makeArray(e) : this
      }).filter(function () {
        var e = this.type;
        return this.name && !fe(this).is(":disabled") && Et.test(this.nodeName) && !Pt.test(e) && (this.checked || !$e.test(e))
      }).map(function (e, t) {
        var n = fe(this).val();
        return null == n ? null : Array.isArray(n) ? fe.map(n, function (e) {
          return {
            name: t.name,
            value: e.replace(Ct, "\r\n")
          }
        }) : {
          name: t.name,
          value: n.replace(Ct, "\r\n")
        }
      }).get()
    }
  });
  var At = /%20/g,
    It = /#.*$/,
    Dt = /([?&])_=[^&]*/,
    Lt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
    Nt = /^(?:GET|HEAD)$/,
    Gt = /^\/\//,
    _t = {},
    Mt = {},
    Ot = "*/".concat("*"),
    Ft = Z.createElement("a");
  Ft.href = kt.href, fe.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
      url: kt.href,
      type: "GET",
      isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(kt.protocol),
      global: !0,
      processData: !0,
      async: !0,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      accepts: {
        "*": Ot,
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript"
      },
      contents: {
        xml: /\bxml\b/,
        html: /\bhtml/,
        json: /\bjson\b/
      },
      responseFields: {
        xml: "responseXML",
        text: "responseText",
        json: "responseJSON"
      },
      converters: {
        "* text": String,
        "text html": !0,
        "text json": JSON.parse,
        "text xml": fe.parseXML
      },
      flatOptions: {
        url: !0,
        context: !0
      }
    },
    ajaxSetup: function (e, t) {
      return t ? Q(Q(e, fe.ajaxSettings), t) : Q(fe.ajaxSettings, e)
    },
    ajaxPrefilter: Y(_t),
    ajaxTransport: Y(Mt),
    ajax: function (t, n) {
      function i(t, n, i, s) {
        var u, h, p, w, k, T = n;
        c || (c = !0, l && e.clearTimeout(l), r = void 0, a = s || "", x.readyState = t > 0 ? 4 : 0, u = t >= 200 && t < 300 || 304 === t, i && (w = function (e, t, n) {
          for (var i, r, o, a, s = e.contents, l = e.dataTypes;
            "*" === l[0];) l.shift(), void 0 === i && (i = e.mimeType || t.getResponseHeader("Content-Type"));
          if (i)
            for (r in s)
              if (s[r] && s[r].test(i)) {
                l.unshift(r);
                break
              } if (l[0] in n) o = l[0];
          else {
            for (r in n) {
              if (!l[0] || e.converters[r + " " + l[0]]) {
                o = r;
                break
              }
              a || (a = r)
            }
            o = o || a
          }
          if (o) return o !== l[0] && l.unshift(o), n[o]
        }(f, x, i)), w = function (e, t, n, i) {
          var r, o, a, s, l, u = {},
            c = e.dataTypes.slice();
          if (c[1])
            for (a in e.converters) u[a.toLowerCase()] = e.converters[a];
          for (o = c.shift(); o;)
            if (e.responseFields[o] && (n[e.responseFields[o]] = t), !l && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = o, o = c.shift())
              if ("*" === o) o = l;
              else if ("*" !== l && l !== o) {
            if (!(a = u[l + " " + o] || u["* " + o]))
              for (r in u)
                if ((s = r.split(" "))[1] === o && (a = u[l + " " + s[0]] || u["* " + s[0]])) {
                  !0 === a ? a = u[r] : !0 !== u[r] && (o = s[0], c.unshift(s[1]));
                  break
                } if (!0 !== a)
              if (a && e.throws) t = a(t);
              else try {
                t = a(t)
              } catch (e) {
                return {
                  state: "parsererror",
                  error: a ? e : "No conversion from " + l + " to " + o
                }
              }
          }
          return {
            state: "success",
            data: t
          }
        }(f, w, x, u), u ? (f.ifModified && ((k = x.getResponseHeader("Last-Modified")) && (fe.lastModified[o] = k), (k = x.getResponseHeader("etag")) && (fe.etag[o] = k)), 204 === t || "HEAD" === f.type ? T = "nocontent" : 304 === t ? T = "notmodified" : (T = w.state, h = w.data, u = !(p = w.error))) : (p = T, !t && T || (T = "error", t < 0 && (t = 0))), x.status = t, x.statusText = (n || T) + "", u ? v.resolveWith(m, [h, T, x]) : v.rejectWith(m, [x, T, p]), x.statusCode(y), y = void 0, d && g.trigger(u ? "ajaxSuccess" : "ajaxError", [x, f, u ? h : p]), b.fireWith(m, [x, T]), d && (g.trigger("ajaxComplete", [x, f]), --fe.active || fe.event.trigger("ajaxStop")))
      }
      "object" == typeof t && (n = t, t = void 0), n = n || {};
      var r, o, a, s, l, u, c, d, h, p, f = fe.ajaxSetup({}, n),
        m = f.context || f,
        g = f.context && (m.nodeType || m.jquery) ? fe(m) : fe.event,
        v = fe.Deferred(),
        b = fe.Callbacks("once memory"),
        y = f.statusCode || {},
        w = {},
        k = {},
        T = "canceled",
        x = {
          readyState: 0,
          getResponseHeader: function (e) {
            var t;
            if (c) {
              if (!s)
                for (s = {}; t = Lt.exec(a);) s[t[1].toLowerCase()] = t[2];
              t = s[e.toLowerCase()]
            }
            return null == t ? null : t
          },
          getAllResponseHeaders: function () {
            return c ? a : null
          },
          setRequestHeader: function (e, t) {
            return null == c && (e = k[e.toLowerCase()] = k[e.toLowerCase()] || e, w[e] = t), this
          },
          overrideMimeType: function (e) {
            return null == c && (f.mimeType = e), this
          },
          statusCode: function (e) {
            var t;
            if (e)
              if (c) x.always(e[x.status]);
              else
                for (t in e) y[t] = [y[t], e[t]];
            return this
          },
          abort: function (e) {
            var t = e || T;
            return r && r.abort(t), i(0, t), this
          }
        };
      if (v.promise(x), f.url = ((t || f.url || kt.href) + "").replace(Gt, kt.protocol + "//"), f.type = n.method || n.type || f.method || f.type, f.dataTypes = (f.dataType || "*").toLowerCase().match(Ce) || [""], null == f.crossDomain) {
        u = Z.createElement("a");
        try {
          u.href = f.url, u.href = u.href, f.crossDomain = Ft.protocol + "//" + Ft.host != u.protocol + "//" + u.host
        } catch (e) {
          f.crossDomain = !0
        }
      }
      if (f.data && f.processData && "string" != typeof f.data && (f.data = fe.param(f.data, f.traditional)), K(_t, f, n, x), c) return x;
      (d = fe.event && f.global) && 0 == fe.active++ && fe.event.trigger("ajaxStart"), f.type = f.type.toUpperCase(), f.hasContent = !Nt.test(f.type), o = f.url.replace(It, ""), f.hasContent ? f.data && f.processData && 0 === (f.contentType || "").indexOf("application/x-www-form-urlencoded") && (f.data = f.data.replace(At, "+")) : (p = f.url.slice(o.length), f.data && (f.processData || "string" == typeof f.data) && (o += (xt.test(o) ? "&" : "?") + f.data, delete f.data), !1 === f.cache && (o = o.replace(Dt, "$1"), p = (xt.test(o) ? "&" : "?") + "_=" + Tt++ + p), f.url = o + p), f.ifModified && (fe.lastModified[o] && x.setRequestHeader("If-Modified-Since", fe.lastModified[o]), fe.etag[o] && x.setRequestHeader("If-None-Match", fe.etag[o])), (f.data && f.hasContent && !1 !== f.contentType || n.contentType) && x.setRequestHeader("Content-Type", f.contentType), x.setRequestHeader("Accept", f.dataTypes[0] && f.accepts[f.dataTypes[0]] ? f.accepts[f.dataTypes[0]] + ("*" !== f.dataTypes[0] ? ", " + Ot + "; q=0.01" : "") : f.accepts["*"]);
      for (h in f.headers) x.setRequestHeader(h, f.headers[h]);
      if (f.beforeSend && (!1 === f.beforeSend.call(m, x, f) || c)) return x.abort();
      if (T = "abort", b.add(f.complete), x.done(f.success), x.fail(f.error), r = K(Mt, f, n, x)) {
        if (x.readyState = 1, d && g.trigger("ajaxSend", [x, f]), c) return x;
        f.async && f.timeout > 0 && (l = e.setTimeout(function () {
          x.abort("timeout")
        }, f.timeout));
        try {
          c = !1, r.send(w, i)
        } catch (e) {
          if (c) throw e;
          i(-1, e)
        }
      } else i(-1, "No Transport");
      return x
    },
    getJSON: function (e, t, n) {
      return fe.get(e, t, n, "json")
    },
    getScript: function (e, t) {
      return fe.get(e, void 0, t, "script")
    }
  }), fe.each(["get", "post"], function (e, t) {
    fe[t] = function (e, n, i, r) {
      return de(n) && (r = r || i, i = n, n = void 0), fe.ajax(fe.extend({
        url: e,
        type: t,
        dataType: r,
        data: n,
        success: i
      }, fe.isPlainObject(e) && e))
    }
  }), fe._evalUrl = function (e) {
    return fe.ajax({
      url: e,
      type: "GET",
      dataType: "script",
      cache: !0,
      async: !1,
      global: !1,
      throws: !0
    })
  }, fe.fn.extend({
    wrapAll: function (e) {
      var t;
      return this[0] && (de(e) && (e = e.call(this[0])), t = fe(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function () {
        for (var e = this; e.firstElementChild;) e = e.firstElementChild;
        return e
      }).append(this)), this
    },
    wrapInner: function (e) {
      return de(e) ? this.each(function (t) {
        fe(this).wrapInner(e.call(this, t))
      }) : this.each(function () {
        var t = fe(this),
          n = t.contents();
        n.length ? n.wrapAll(e) : t.append(e)
      })
    },
    wrap: function (e) {
      var t = de(e);
      return this.each(function (n) {
        fe(this).wrapAll(t ? e.call(this, n) : e)
      })
    },
    unwrap: function (e) {
      return this.parent(e).not("body").each(function () {
        fe(this).replaceWith(this.childNodes)
      }), this
    }
  }), fe.expr.pseudos.hidden = function (e) {
    return !fe.expr.pseudos.visible(e)
  }, fe.expr.pseudos.visible = function (e) {
    return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
  }, fe.ajaxSettings.xhr = function () {
    try {
      return new e.XMLHttpRequest
    } catch (e) {}
  };
  var jt = {
      0: 200,
      1223: 204
    },
    Rt = fe.ajaxSettings.xhr();
  ce.cors = !!Rt && "withCredentials" in Rt, ce.ajax = Rt = !!Rt, fe.ajaxTransport(function (t) {
    var n, i;
    if (ce.cors || Rt && !t.crossDomain) return {
      send: function (r, o) {
        var a, s = t.xhr();
        if (s.open(t.type, t.url, t.async, t.username, t.password), t.xhrFields)
          for (a in t.xhrFields) s[a] = t.xhrFields[a];
        t.mimeType && s.overrideMimeType && s.overrideMimeType(t.mimeType), t.crossDomain || r["X-Requested-With"] || (r["X-Requested-With"] = "XMLHttpRequest");
        for (a in r) s.setRequestHeader(a, r[a]);
        n = function (e) {
          return function () {
            n && (n = i = s.onload = s.onerror = s.onabort = s.ontimeout = s.onreadystatechange = null, "abort" === e ? s.abort() : "error" === e ? "number" != typeof s.status ? o(0, "error") : o(s.status, s.statusText) : o(jt[s.status] || s.status, s.statusText, "text" !== (s.responseType || "text") || "string" != typeof s.responseText ? {
              binary: s.response
            } : {
              text: s.responseText
            }, s.getAllResponseHeaders()))
          }
        }, s.onload = n(), i = s.onerror = s.ontimeout = n("error"), void 0 !== s.onabort ? s.onabort = i : s.onreadystatechange = function () {
          4 === s.readyState && e.setTimeout(function () {
            n && i()
          })
        }, n = n("abort");
        try {
          s.send(t.hasContent && t.data || null)
        } catch (e) {
          if (n) throw e
        }
      },
      abort: function () {
        n && n()
      }
    }
  }), fe.ajaxPrefilter(function (e) {
    e.crossDomain && (e.contents.script = !1)
  }), fe.ajaxSetup({
    accepts: {
      script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents: {
      script: /\b(?:java|ecma)script\b/
    },
    converters: {
      "text script": function (e) {
        return fe.globalEval(e), e
      }
    }
  }), fe.ajaxPrefilter("script", function (e) {
    void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET")
  }), fe.ajaxTransport("script", function (e) {
    if (e.crossDomain) {
      var t, n;
      return {
        send: function (i, r) {
          t = fe("<script>").prop({
            charset: e.scriptCharset,
            src: e.url
          }).on("load error", n = function (e) {
            t.remove(), n = null, e && r("error" === e.type ? 404 : 200, e.type)
          }), Z.head.appendChild(t[0])
        },
        abort: function () {
          n && n()
        }
      }
    }
  });
  var qt = [],
    Ht = /(=)\?(?=&|$)|\?\?/;
  fe.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function () {
      var e = qt.pop() || fe.expando + "_" + Tt++;
      return this[e] = !0, e
    }
  }), fe.ajaxPrefilter("json jsonp", function (t, n, i) {
    var r, o, a, s = !1 !== t.jsonp && (Ht.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && Ht.test(t.data) && "data");
    if (s || "jsonp" === t.dataTypes[0]) return r = t.jsonpCallback = de(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, s ? t[s] = t[s].replace(Ht, "$1" + r) : !1 !== t.jsonp && (t.url += (xt.test(t.url) ? "&" : "?") + t.jsonp + "=" + r), t.converters["script json"] = function () {
      return a || fe.error(r + " was not called"), a[0]
    }, t.dataTypes[0] = "json", o = e[r], e[r] = function () {
      a = arguments
    }, i.always(function () {
      void 0 === o ? fe(e).removeProp(r) : e[r] = o, t[r] && (t.jsonpCallback = n.jsonpCallback, qt.push(r)), a && de(o) && o(a[0]), a = o = void 0
    }), "script"
  }), ce.createHTMLDocument = function () {
    var e = Z.implementation.createHTMLDocument("").body;
    return e.innerHTML = "<form></form><form></form>", 2 === e.childNodes.length
  }(), fe.parseHTML = function (e, t, n) {
    if ("string" != typeof e) return [];
    "boolean" == typeof t && (n = t, t = !1);
    var i, r, o;
    return t || (ce.createHTMLDocument ? ((i = (t = Z.implementation.createHTMLDocument("")).createElement("base")).href = Z.location.href, t.head.appendChild(i)) : t = Z), r = we.exec(e), o = !n && [], r ? [t.createElement(r[1])] : (r = k([e], t, o), o && o.length && fe(o).remove(), fe.merge([], r.childNodes))
  }, fe.fn.load = function (e, t, n) {
    var i, r, o, a = this,
      s = e.indexOf(" ");
    return s > -1 && (i = W(e.slice(s)), e = e.slice(0, s)), de(t) ? (n = t, t = void 0) : t && "object" == typeof t && (r = "POST"), a.length > 0 && fe.ajax({
      url: e,
      type: r || "GET",
      dataType: "html",
      data: t
    }).done(function (e) {
      o = arguments, a.html(i ? fe("<div>").append(fe.parseHTML(e)).find(i) : e)
    }).always(n && function (e, t) {
      a.each(function () {
        n.apply(this, o || [e.responseText, t, e])
      })
    }), this
  }, fe.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t) {
    fe.fn[t] = function (e) {
      return this.on(t, e)
    }
  }), fe.expr.pseudos.animated = function (e) {
    return fe.grep(fe.timers, function (t) {
      return e === t.elem
    }).length
  }, fe.offset = {
    setOffset: function (e, t, n) {
      var i, r, o, a, s, l, u = fe.css(e, "position"),
        c = fe(e),
        d = {};
      "static" === u && (e.style.position = "relative"), s = c.offset(), o = fe.css(e, "top"), l = fe.css(e, "left"), ("absolute" === u || "fixed" === u) && (o + l).indexOf("auto") > -1 ? (a = (i = c.position()).top, r = i.left) : (a = parseFloat(o) || 0, r = parseFloat(l) || 0), de(t) && (t = t.call(e, n, fe.extend({}, s))), null != t.top && (d.top = t.top - s.top + a), null != t.left && (d.left = t.left - s.left + r), "using" in t ? t.using.call(e, d) : c.css(d)
    }
  }, fe.fn.extend({
    offset: function (e) {
      if (arguments.length) return void 0 === e ? this : this.each(function (t) {
        fe.offset.setOffset(this, e, t)
      });
      var t, n, i = this[0];
      return i ? i.getClientRects().length ? (t = i.getBoundingClientRect(), n = i.ownerDocument.defaultView, {
        top: t.top + n.pageYOffset,
        left: t.left + n.pageXOffset
      }) : {
        top: 0,
        left: 0
      } : void 0
    },
    position: function () {
      if (this[0]) {
        var e, t, n, i = this[0],
          r = {
            top: 0,
            left: 0
          };
        if ("fixed" === fe.css(i, "position")) t = i.getBoundingClientRect();
        else {
          for (t = this.offset(), n = i.ownerDocument, e = i.offsetParent || n.documentElement; e && (e === n.body || e === n.documentElement) && "static" === fe.css(e, "position");) e = e.parentNode;
          e && e !== i && 1 === e.nodeType && ((r = fe(e).offset()).top += fe.css(e, "borderTopWidth", !0), r.left += fe.css(e, "borderLeftWidth", !0))
        }
        return {
          top: t.top - r.top - fe.css(i, "marginTop", !0),
          left: t.left - r.left - fe.css(i, "marginLeft", !0)
        }
      }
    },
    offsetParent: function () {
      return this.map(function () {
        for (var e = this.offsetParent; e && "static" === fe.css(e, "position");) e = e.offsetParent;
        return e || Xe
      })
    }
  }), fe.each({
    scrollLeft: "pageXOffset",
    scrollTop: "pageYOffset"
  }, function (e, t) {
    var n = "pageYOffset" === t;
    fe.fn[e] = function (i) {
      return Ae(this, function (e, i, r) {
        var o;
        if (he(e) ? o = e : 9 === e.nodeType && (o = e.defaultView), void 0 === r) return o ? o[t] : e[i];
        o ? o.scrollTo(n ? o.pageXOffset : r, n ? r : o.pageYOffset) : e[i] = r
      }, e, i, arguments.length)
    }
  }), fe.each(["top", "left"], function (e, t) {
    fe.cssHooks[t] = _(ce.pixelPosition, function (e, n) {
      if (n) return n = G(e, t), tt.test(n) ? fe(e).position()[t] + "px" : n
    })
  }), fe.each({
    Height: "height",
    Width: "width"
  }, function (e, t) {
    fe.each({
      padding: "inner" + e,
      content: t,
      "": "outer" + e
    }, function (n, i) {
      fe.fn[i] = function (r, o) {
        var a = arguments.length && (n || "boolean" != typeof r),
          s = n || (!0 === r || !0 === o ? "margin" : "border");
        return Ae(this, function (t, n, r) {
          var o;
          return he(t) ? 0 === i.indexOf("outer") ? t["inner" + e] : t.document.documentElement["client" + e] : 9 === t.nodeType ? (o = t.documentElement, Math.max(t.body["scroll" + e], o["scroll" + e], t.body["offset" + e], o["offset" + e], o["client" + e])) : void 0 === r ? fe.css(t, n, s) : fe.style(t, n, r, s)
        }, t, a ? r : void 0, a)
      }
    })
  }), fe.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function (e, t) {
    fe.fn[t] = function (e, n) {
      return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
    }
  }), fe.fn.extend({
    hover: function (e, t) {
      return this.mouseenter(e).mouseleave(t || e)
    }
  }), fe.fn.extend({
    bind: function (e, t, n) {
      return this.on(e, null, t, n)
    },
    unbind: function (e, t) {
      return this.off(e, null, t)
    },
    delegate: function (e, t, n, i) {
      return this.on(t, e, n, i)
    },
    undelegate: function (e, t, n) {
      return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
    }
  }), fe.proxy = function (e, t) {
    var n, i, r;
    if ("string" == typeof t && (n = e[t], t = e, e = n), de(e)) return i = te.call(arguments, 2), r = function () {
      return e.apply(t || this, i.concat(te.call(arguments)))
    }, r.guid = e.guid = e.guid || fe.guid++, r
  }, fe.holdReady = function (e) {
    e ? fe.readyWait++ : fe.ready(!0)
  }, fe.isArray = Array.isArray, fe.parseJSON = JSON.parse, fe.nodeName = o, fe.isFunction = de, fe.isWindow = he, fe.camelCase = p, fe.type = i, fe.now = Date.now, fe.isNumeric = function (e) {
    var t = fe.type(e);
    return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
  }, "function" == typeof define && define.amd && define("jquery", [], function () {
    return fe
  });
  var $t = e.jQuery,
    Bt = e.$;
  return fe.noConflict = function (t) {
    return e.$ === fe && (e.$ = Bt), t && e.jQuery === fe && (e.jQuery = $t), fe
  }, t || (e.jQuery = e.$ = fe), fe
}),
function (e, t) {
  var n, i = e.jQuery || e.Cowboy || (e.Cowboy = {});
  i.throttle = n = function (e, n, r, o) {
    function a() {
      function i() {
        l = +new Date, r.apply(a, c)
      }
      var a = this,
        u = +new Date - l,
        c = arguments;
      o && !s && i(), s && clearTimeout(s), o === t && u > e ? i() : !0 !== n && (s = setTimeout(o ? function () {
        s = t
      } : i, o === t ? e - u : e))
    }
    var s, l = 0;
    return "boolean" != typeof n && (o = r, r = n, n = t), i.guid && (a.guid = r.guid = r.guid || i.guid++), a
  }, i.debounce = function (e, i, r) {
    return r === t ? n(e, i, !1) : n(e, r, !1 !== i)
  }
}(this),
function (e) {
  "function" == typeof define && define.amd ? define(["jquery"], function (t) {
    return e(t)
  }) : "object" == typeof module && "object" == typeof module.exports ? exports = e(require("jquery")) : e(jQuery)
}(function (e) {
  function t(e) {
    var t = 7.5625,
      n = 2.75;
    return e < 1 / n ? t * e * e : e < 2 / n ? t * (e -= 1.5 / n) * e + .75 : e < 2.5 / n ? t * (e -= 2.25 / n) * e + .9375 : t * (e -= 2.625 / n) * e + .984375
  }
  e.easing.jswing = e.easing.swing;
  var n = Math.pow,
    i = Math.sqrt,
    r = Math.sin,
    o = Math.cos,
    a = Math.PI,
    s = 1.70158,
    l = 1.525 * s,
    u = 2 * a / 3,
    c = 2 * a / 4.5;
  e.extend(e.easing, {
    def: "easeOutQuad",
    swing: function (t) {
      return e.easing[e.easing.def](t)
    },
    easeInQuad: function (e) {
      return e * e
    },
    easeOutQuad: function (e) {
      return 1 - (1 - e) * (1 - e)
    },
    easeInOutQuad: function (e) {
      return e < .5 ? 2 * e * e : 1 - n(-2 * e + 2, 2) / 2
    },
    easeInCubic: function (e) {
      return e * e * e
    },
    easeOutCubic: function (e) {
      return 1 - n(1 - e, 3)
    },
    easeInOutCubic: function (e) {
      return e < .5 ? 4 * e * e * e : 1 - n(-2 * e + 2, 3) / 2
    },
    easeInQuart: function (e) {
      return e * e * e * e
    },
    easeOutQuart: function (e) {
      return 1 - n(1 - e, 4)
    },
    easeInOutQuart: function (e) {
      return e < .5 ? 8 * e * e * e * e : 1 - n(-2 * e + 2, 4) / 2
    },
    easeInQuint: function (e) {
      return e * e * e * e * e
    },
    easeOutQuint: function (e) {
      return 1 - n(1 - e, 5)
    },
    easeInOutQuint: function (e) {
      return e < .5 ? 16 * e * e * e * e * e : 1 - n(-2 * e + 2, 5) / 2
    },
    easeInSine: function (e) {
      return 1 - o(e * a / 2)
    },
    easeOutSine: function (e) {
      return r(e * a / 2)
    },
    easeInOutSine: function (e) {
      return -(o(a * e) - 1) / 2
    },
    easeInExpo: function (e) {
      return 0 === e ? 0 : n(2, 10 * e - 10)
    },
    easeOutExpo: function (e) {
      return 1 === e ? 1 : 1 - n(2, -10 * e)
    },
    easeInOutExpo: function (e) {
      return 0 === e ? 0 : 1 === e ? 1 : e < .5 ? n(2, 20 * e - 10) / 2 : (2 - n(2, -20 * e + 10)) / 2
    },
    easeInCirc: function (e) {
      return 1 - i(1 - n(e, 2))
    },
    easeOutCirc: function (e) {
      return i(1 - n(e - 1, 2))
    },
    easeInOutCirc: function (e) {
      return e < .5 ? (1 - i(1 - n(2 * e, 2))) / 2 : (i(1 - n(-2 * e + 2, 2)) + 1) / 2
    },
    easeInElastic: function (e) {
      return 0 === e ? 0 : 1 === e ? 1 : -n(2, 10 * e - 10) * r((10 * e - 10.75) * u)
    },
    easeOutElastic: function (e) {
      return 0 === e ? 0 : 1 === e ? 1 : n(2, -10 * e) * r((10 * e - .75) * u) + 1
    },
    easeInOutElastic: function (e) {
      return 0 === e ? 0 : 1 === e ? 1 : e < .5 ? -n(2, 20 * e - 10) * r((20 * e - 11.125) * c) / 2 : n(2, -20 * e + 10) * r((20 * e - 11.125) * c) / 2 + 1
    },
    easeInBack: function (e) {
      return 2.70158 * e * e * e - s * e * e
    },
    easeOutBack: function (e) {
      return 1 + 2.70158 * n(e - 1, 3) + s * n(e - 1, 2)
    },
    easeInOutBack: function (e) {
      return e < .5 ? n(2 * e, 2) * (7.189819 * e - l) / 2 : (n(2 * e - 2, 2) * ((l + 1) * (2 * e - 2) + l) + 2) / 2
    },
    easeInBounce: function (e) {
      return 1 - t(1 - e)
    },
    easeOutBounce: t,
    easeInOutBounce: function (e) {
      return e < .5 ? (1 - t(1 - 2 * e)) / 2 : (1 + t(2 * e - 1)) / 2
    }
  })
}),
function (e, t, n) {
  "function" == typeof define && define.amd ? define(["jquery"], function (i) {
    return n(i, e, t), i.mobile
  }) : n(e.jQuery, e, t)
}(this, document, function (e, t, n, i) {
  (function (t) {
    "function" == typeof define && define.amd ? define("vmouse", ["jquery"], t) : t(e)
  })(function (e) {
    function t(e) {
      for (; e && void 0 !== e.originalEvent;) e = e.originalEvent;
      return e
    }

    function r(n, r) {
      var o, a, s, l, u, c, d, h, p, f = n.type;
      if (n = e.Event(n), n.type = r, o = n.originalEvent, a = E, f.search(/^(mouse|click)/) > -1 && (a = I), o)
        for (d = a.length; d;) l = a[--d], n[l] = o[l];
      if (f.search(/mouse(down|up)|click/) > -1 && !n.which && (n.which = 1), -1 !== f.search(/^touch/) && (s = t(o), f = s.touches, u = s.changedTouches, c = f && f.length ? f[0] : u && u.length ? u[0] : i))
        for (h = 0, p = C.length; h < p; h++) l = C[h], n[l] = c[l];
      return n
    }

    function o(t) {
      for (var n, i, r = {}; t;) {
        n = e.data(t, x);
        for (i in n) n[i] && (r[i] = r.hasVirtualBinding = !0);
        t = t.parentNode
      }
      return r
    }

    function a(t, n) {
      for (var i; t;) {
        if ((i = e.data(t, x)) && (!n || i[n])) return t;
        t = t.parentNode
      }
      return null
    }

    function s() {
      F = !0
    }

    function l() {
      H = 0, M.length = 0, O = !1, s()
    }

    function u() {
      F = !1
    }

    function c() {
      L && (clearTimeout(L), L = 0)
    }

    function d() {
      c(), L = setTimeout(function () {
        L = 0, l()
      }, e.vmouse.resetTimerDuration)
    }

    function h(t, n, i) {
      var o;
      return (i && i[t] || !i && a(n.target, t)) && (o = r(n, t), e(n.target).trigger(o)), o
    }

    function p(t) {
      var n, i = e.data(t.target, S);
      "click" === t.type && "touchstart" === e.data(t.target, "lastTouchType") && setTimeout(function () {
        "touchstart" === e.data(t.target, "lastTouchType") && (l(), delete e.data(t.target).lastTouchType, p(t))
      }, e.vmouse.maximumTimeBetweenTouches), !O && (!H || H !== i) && (n = h("v" + t.type, t)) && (n.isDefaultPrevented() && t.preventDefault(), n.isPropagationStopped() && t.stopPropagation(), n.isImmediatePropagationStopped() && t.stopImmediatePropagation())
    }

    function f(n) {
      var i, r, a, s = t(n).touches;
      s && 1 === s.length && (i = n.target, r = o(i), e.data(n.target, "lastTouchType", n.type), r.hasVirtualBinding && (H = q++, e.data(i, S, H), c(), u(), _ = !1, a = t(n).touches[0], N = a.pageX, G = a.pageY, h("vmouseover", n, r), h("vmousedown", n, r)))
    }

    function m(t) {
      F || (_ || h("vmousecancel", t, o(t.target)), e.data(t.target, "lastTouchType", t.type), _ = !0, d())
    }

    function g(n) {
      if (!F) {
        var i = t(n).touches[0],
          r = _,
          a = e.vmouse.moveDistanceThreshold,
          s = o(n.target);
        e.data(n.target, "lastTouchType", n.type), (_ = _ || Math.abs(i.pageX - N) > a || Math.abs(i.pageY - G) > a) && !r && h("vmousecancel", n, s), h("vmousemove", n, s), d()
      }
    }

    function v(n) {
      if (!F && e.data(n.target, "lastTouchType") !== i) {
        s(), delete e.data(n.target).lastTouchType;
        var r, a, l = o(n.target);
        h("vmouseup", n, l), _ || (r = h("vclick", n, l)) && r.isDefaultPrevented() && (a = t(n).changedTouches[0], M.push({
          touchID: H,
          x: a.clientX,
          y: a.clientY
        }), O = !0), h("vmouseout", n, l), _ = !1, d()
      }
    }

    function b(t) {
      var n, i = e.data(t, x);
      if (i)
        for (n in i)
          if (i[n]) return !0;
      return !1
    }

    function y() {}

    function w(t) {
      var n = t.substr(1);
      return {
        setup: function () {
          b(this) || e.data(this, x, {});
          e.data(this, x)[t] = !0, D[t] = (D[t] || 0) + 1, 1 === D[t] && R.bind(n, p), e(this).bind(n, y), j && (D.touchstart = (D.touchstart || 0) + 1, 1 === D.touchstart && R.bind("touchstart", f).bind("touchend", v).bind("touchmove", g).bind("scroll", m))
        },
        teardown: function () {
          --D[t], D[t] || R.unbind(n, p), j && (--D.touchstart, D.touchstart || R.unbind("touchstart", f).unbind("touchmove", g).unbind("touchend", v).unbind("scroll", m));
          var i = e(this),
            r = e.data(this, x);
          r && (r[t] = !1), i.unbind(n, y), b(this) || i.removeData(x)
        }
      }
    }
    var k, T, x = "virtualMouseBindings",
      S = "virtualTouchID",
      C = "clientX clientY pageX pageY screenX screenY".split(" "),
      P = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),
      E = "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
      A = e.event.mouseHooks ? e.event.mouseHooks.props : [],
      I = E.concat(A),
      D = {},
      L = 0,
      N = 0,
      G = 0,
      _ = !1,
      M = [],
      O = !1,
      F = !1,
      j = "addEventListener" in n,
      R = e(n),
      q = 1,
      H = 0;
    for (e.vmouse = {
        moveDistanceThreshold: 10,
        clickDistanceThreshold: 10,
        resetTimerDuration: 1500,
        maximumTimeBetweenTouches: 100
      }, T = 0; T < P.length; T++) e.event.special[P[T]] = w(P[T]);
    j && n.addEventListener("click", function (t) {
      var n, i, r, o, a, s = M.length,
        l = t.target;
      if (s)
        for (n = t.clientX, i = t.clientY, k = e.vmouse.clickDistanceThreshold, r = l; r;) {
          for (o = 0; o < s; o++)
            if (a = M[o], 0, r === l && Math.abs(a.x - n) < k && Math.abs(a.y - i) < k || e.data(r, S) === a.touchID) return t.preventDefault(), void t.stopPropagation();
          r = r.parentNode
        }
    }, !0)
  }),
  function (t) {
    "function" == typeof define && define.amd ? define("ns", ["jquery"], t) : t(e)
  }(function (e) {
    return e.mobile = {
      version: "@VERSION"
    }, e.mobile
  }),
  function (t) {
    "function" == typeof define && define.amd ? define("support/touch", ["jquery", "../ns"], t) : t(e)
  }(function (e) {
    var t = {
      touch: "ontouchend" in n
    };
    return e.mobile.support = e.mobile.support || {}, e.extend(e.support, t), e.extend(e.mobile.support, t), e.support
  }),
  function (t) {
    "function" == typeof define && define.amd ? define("events/touch", ["jquery", "../vmouse", "../support/touch"], t) : t(e)
  }(function (e) {
    function r(t, n, r, o) {
      var a = r.type;
      r.type = n, o ? e.event.trigger(r, i, t) : e.event.dispatch.call(t, r), r.type = a
    }
    var o = e(n),
      a = e.mobile.support.touch,
      s = a ? "touchstart" : "mousedown",
      l = a ? "touchend" : "mouseup",
      u = a ? "touchmove" : "mousemove";
    return e.each("touchstart touchmove touchend tap taphold swipe swipeleft swiperight".split(" "), function (t, n) {
      e.fn[n] = function (e) {
        return e ? this.bind(n, e) : this.trigger(n)
      }, e.attrFn && (e.attrFn[n] = !0)
    }), e.event.special.tap = {
      tapholdThreshold: 750,
      emitTapOnTaphold: !0,
      setup: function () {
        var t = this,
          n = e(t),
          i = !1;
        n.bind("vmousedown", function (a) {
          function s() {
            u && (n.bind("vclick", c), clearTimeout(u))
          }

          function l() {
            s(), n.unbind("vclick", c).unbind("vmouseup", s), o.unbind("vmousecancel", l)
          }
          if (i = !1, a.which && 1 !== a.which) return !0;
          var u, c, d = a.target;
          c = function (e) {
            l(), i || d !== e.target ? i && e.preventDefault() : r(t, "tap", e)
          }, n.bind("vmouseup", s), o.bind("vmousecancel", l), u = setTimeout(function () {
            e.event.special.tap.emitTapOnTaphold || (i = !0), u = 0, r(t, "taphold", e.Event("taphold", {
              target: d
            }))
          }, e.event.special.tap.tapholdThreshold)
        })
      },
      teardown: function () {
        e(this).unbind("vmousedown").unbind("vclick").unbind("vmouseup"), o.unbind("vmousecancel")
      }
    }, e.event.special.swipe = {
      scrollSupressionThreshold: 30,
      durationThreshold: 1e3,
      horizontalDistanceThreshold: t.devicePixelRatio >= 2 ? 15 : 30,
      verticalDistanceThreshold: t.devicePixelRatio >= 2 ? 15 : 30,
      getLocation: function (e) {
        var n = t.pageXOffset,
          i = t.pageYOffset,
          r = e.clientX,
          o = e.clientY;
        return 0 === e.pageY && Math.floor(o) > Math.floor(e.pageY) || 0 === e.pageX && Math.floor(r) > Math.floor(e.pageX) ? (r -= n, o -= i) : (o < e.pageY - i || r < e.pageX - n) && (r = e.pageX - n, o = e.pageY - i), {
          x: r,
          y: o
        }
      },
      start: function (t) {
        var n = t.originalEvent.touches ? t.originalEvent.touches[0] : t,
          i = e.event.special.swipe.getLocation(n);
        return {
          time: (new Date).getTime(),
          coords: [i.x, i.y],
          origin: e(t.target)
        }
      },
      stop: function (t) {
        var n = t.originalEvent.touches ? t.originalEvent.touches[0] : t,
          i = e.event.special.swipe.getLocation(n);
        return {
          time: (new Date).getTime(),
          coords: [i.x, i.y]
        }
      },
      handleSwipe: function (t, n, i, o) {
        if (n.time - t.time < e.event.special.swipe.durationThreshold && Math.abs(t.coords[0] - n.coords[0]) > e.event.special.swipe.horizontalDistanceThreshold && Math.abs(t.coords[1] - n.coords[1]) < e.event.special.swipe.verticalDistanceThreshold) {
          var a = t.coords[0] > n.coords[0] ? "swipeleft" : "swiperight";
          return r(i, "swipe", e.Event("swipe", {
            target: o,
            swipestart: t,
            swipestop: n
          }), !0), r(i, a, e.Event(a, {
            target: o,
            swipestart: t,
            swipestop: n
          }), !0), !0
        }
        return !1
      },
      eventInProgress: !1,
      setup: function () {
        var t, n = this,
          i = e(n),
          r = {};
        (t = e.data(this, "mobile-events")) || (t = {
          length: 0
        }, e.data(this, "mobile-events", t)), t.length++, t.swipe = r, r.start = function (t) {
          if (!e.event.special.swipe.eventInProgress) {
            e.event.special.swipe.eventInProgress = !0;
            var i, a = e.event.special.swipe.start(t),
              s = t.target,
              c = !1;
            r.move = function (t) {
              a && !t.isDefaultPrevented() && (i = e.event.special.swipe.stop(t), c || (c = e.event.special.swipe.handleSwipe(a, i, n, s)) && (e.event.special.swipe.eventInProgress = !1), Math.abs(a.coords[0] - i.coords[0]) > e.event.special.swipe.scrollSupressionThreshold && t.preventDefault())
            }, r.stop = function () {
              c = !0, e.event.special.swipe.eventInProgress = !1, o.off(u, r.move), r.move = null
            }, o.on(u, r.move).one(l, r.stop)
          }
        }, i.on(s, r.start)
      },
      teardown: function () {
        var t, n;
        (t = e.data(this, "mobile-events")) && (n = t.swipe, delete t.swipe, t.length--, 0 === t.length && e.removeData(this, "mobile-events")), n && (n.start && e(this).off(s, n.start), n.move && o.off(u, n.move), n.stop && o.off(l, n.stop))
      }
    }, e.each({
      taphold: "tap",
      swipeleft: "swipe.left",
      swiperight: "swipe.right"
    }, function (t, n) {
      e.event.special[t] = {
        setup: function () {
          e(this).bind(n, e.noop)
        },
        teardown: function () {
          e(this).unbind(n)
        }
      }
    }), e.event.special
  })
}),
function () {
  var e = $.support.touch,
    t = e ? "touchstart" : "mousedown",
    n = e ? "touchend" : "mouseup",
    i = e ? "touchmove" : "mousemove";
  $.event.special.swipeupdown = {
    setup: function () {
      var e = $(this);
      e.bind(t, function (t) {
        function r(e) {
          if (s) {
            var t = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
            o = {
              time: (new Date).getTime(),
              coords: [t.pageX, t.pageY]
            }, Math.abs(s.coords[1] - o.coords[1]) > 10 && e.preventDefault()
          }
        }
        var o, a = t.originalEvent.touches ? t.originalEvent.touches[0] : t,
          s = {
            time: (new Date).getTime(),
            coords: [a.pageX, a.pageY],
            origin: $(t.target)
          };
        e.bind(i, r).one(n, function (t) {
          e.unbind(i, r), s && o && o.time - s.time < 1e3 && Math.abs(s.coords[1] - o.coords[1]) > 30 && Math.abs(s.coords[0] - o.coords[0]) < 75 && s.origin.trigger("swipeupdown").trigger(s.coords[1] > o.coords[1] ? "swipeup" : "swipedown"), s = o = void 0
        })
      })
    }
  }, $.each({
    swipedown: "swipeupdown",
    swipeup: "swipeupdown"
  }, function (e, t) {
    $.event.special[e] = {
      setup: function () {
        $(this).bind(t, $.noop)
      }
    }
  })
}(), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || "MacIntel" === navigator.platform && navigator.maxTouchPoints > 1 && !window.MSStream ? (isMobile = !0, $("html").addClass("isMobile")) : (isMobile = !1, $("html").removeClass("isMobile")),
  function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.barba = t()
  }(this, function () {
    function e(t, n, i) {
      if (!t.s) {
        if (i instanceof l) {
          if (!i.s) return void(i.o = e.bind(null, t, n));
          1 & n && (n = i.s), i = i.v
        }
        if (i && i.then) return void i.then(e.bind(null, t, n), e.bind(null, t, 2));
        t.s = n, t.v = i;
        var r = t.o;
        r && r(t)
      }
    }

    function t(e, t) {
      try {
        var n = e()
      } catch (e) {
        return t(e)
      }
      return n && n.then ? n.then(void 0, t) : n
    }

    function n(e, t) {
      for (var n, i = [], o = 0, a = 0, s = "", l = t && t.delimiter || k, u = t && t.whitelist || void 0, c = !1; null !== (n = T.exec(e));) {
        var d = n[0],
          h = n[1],
          p = n.index;
        if (s += e.slice(a, p), a = p + d.length, h) s += h[1], c = !0;
        else {
          var f = "",
            m = n[2],
            g = n[3],
            v = n[4],
            b = n[5];
          if (!c && s.length) {
            var y = s.length - 1,
              w = s[y];
            (!u || u.indexOf(w) > -1) && (f = w, s = s.slice(0, y))
          }
          s && (i.push(s), s = "", c = !1);
          var x = g || v,
            S = f || l;
          i.push({
            name: m || o++,
            prefix: f,
            delimiter: S,
            optional: "?" === b || "*" === b,
            repeat: "+" === b || "*" === b,
            pattern: x ? function (e) {
              return e.replace(/([=!:$\/()])/g, "\\$1")
            }(x) : "[^" + r(S === l ? S : S + l) + "]+?"
          })
        }
      }
      return (s || a < e.length) && i.push(s + e.substr(a)), i
    }

    function i(e) {
      for (var t = new Array(e.length), n = 0; n < e.length; n++) "object" == typeof e[n] && (t[n] = new RegExp("^(?:" + e[n].pattern + ")$"));
      return function (n, i) {
        for (var r = "", o = i && i.encode || encodeURIComponent, a = 0; a < e.length; a++) {
          var s = e[a];
          if ("string" != typeof s) {
            var l, u = n ? n[s.name] : void 0;
            if (Array.isArray(u)) {
              if (!s.repeat) throw new TypeError('Expected "' + s.name + '" to not repeat, but got array');
              if (0 === u.length) {
                if (s.optional) continue;
                throw new TypeError('Expected "' + s.name + '" to not be empty')
              }
              for (var c = 0; c < u.length; c++) {
                if (l = o(u[c], s), !t[a].test(l)) throw new TypeError('Expected all "' + s.name + '" to match "' + s.pattern + '"');
                r += (0 === c ? s.prefix : s.delimiter) + l
              }
            } else if ("string" != typeof u && "number" != typeof u && "boolean" != typeof u) {
              if (!s.optional) throw new TypeError('Expected "' + s.name + '" to be ' + (s.repeat ? "an array" : "a string"))
            } else {
              if (l = o(String(u), s), !t[a].test(l)) throw new TypeError('Expected "' + s.name + '" to match "' + s.pattern + '", but got "' + l + '"');
              r += s.prefix + l
            }
          } else r += s
        }
        return r
      }
    }

    function r(e) {
      return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g, "\\$1")
    }

    function o(e) {
      return e && e.sensitive ? "" : "i"
    }

    function a(e, t, n) {
      for (var i = (n = n || {}).strict, a = !1 !== n.start, s = !1 !== n.end, l = n.delimiter || k, u = [].concat(n.endsWith || []).map(r).concat("$").join("|"), c = a ? "^" : "", d = 0; d < e.length; d++) {
        var h = e[d];
        if ("string" == typeof h) c += r(h);
        else {
          var p = h.repeat ? "(?:" + h.pattern + ")(?:" + r(h.delimiter) + "(?:" + h.pattern + "))*" : h.pattern;
          t && t.push(h), c += h.optional ? h.prefix ? "(?:" + r(h.prefix) + "(" + p + "))?" : "(" + p + ")?" : r(h.prefix) + "(" + p + ")"
        }
      }
      if (s) i || (c += "(?:" + r(l) + ")?"), c += "$" === u ? "$" : "(?=" + u + ")";
      else {
        var f = e[e.length - 1],
          m = "string" == typeof f ? f[f.length - 1] === l : void 0 === f;
        i || (c += "(?:" + r(l) + "(?=" + u + "))?"), m || (c += "(?=" + r(l) + "|" + u + ")")
      }
      return new RegExp(c, o(n))
    }

    function s(e, t, n) {
      return void 0 === t && (t = 2e3), new Promise(function (i, r) {
        var o = new XMLHttpRequest;
        o.onreadystatechange = function () {
          if (o.readyState === XMLHttpRequest.DONE)
            if (200 === o.status) i(o.responseText);
            else if (o.status) {
            var t = {
              status: o.status,
              statusText: o.statusText
            };
            n(e, t), r(t)
          }
        }, o.ontimeout = function () {
          var i = new Error("Timeout error [" + t + "]");
          n(e, i), r(i)
        }, o.onerror = function () {
          var t = new Error("Fetch error");
          n(e, t), r(t)
        }, o.open("GET", e), o.timeout = t, o.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml"), o.setRequestHeader("x-barba", "yes"), o.send()
      })
    }
    var l = function () {
        function t() {}
        return t.prototype.then = function (n, i) {
          var r = new t,
            o = this.s;
          if (o) {
            var a = 1 & o ? n : i;
            if (a) {
              try {
                e(r, 1, a(this.v))
              } catch (t) {
                e(r, 2, t)
              }
              return r
            }
            return this
          }
          return this.o = function (t) {
            try {
              var o = t.v;
              1 & t.s ? e(r, 1, n ? n(o) : o) : i ? e(r, 1, i(o)) : e(r, 2, o)
            } catch (t) {
              e(r, 2, t)
            }
          }, r
        }, t
      }(),
      u = {};
    ! function () {
      function t(e) {
        this.t = e, this.i = null, this.u = null, this.h = null, this.l = null
      }

      function n(e) {
        return {
          value: e,
          done: !0
        }
      }

      function i(e) {
        return {
          value: e,
          done: !1
        }
      }
      t.prototype[Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))] = function () {
        return this
      }, t.prototype.p = function (e) {
        return this.u(e && e.then ? e.then(i) : i(e)), this.i = new l
      }, t.prototype.next = function (t) {
        var i = this;
        return i.l = new Promise(function (r) {
          var o = i.i;
          if (null === o) {
            var a = i.t;
            if (null === a) return r(i.l);

            function s(e) {
              i.u(e && e.then ? e.then(n) : n(e)), i.i = null, i.u = null
            }
            i.t = null, i.u = r, a(i).then(s, function (e) {
              if (e === u) s(i.h);
              else {
                var t = new l;
                i.u(t), i.i = null, i.u = null, _resolve(t, 2, e)
              }
            })
          } else i.i = null, i.u = r, e(o, 1, t)
        })
      }, t.prototype.return = function (t) {
        var i = this;
        return i.l = new Promise(function (r) {
          var o = i.i;
          if (null === o) return null === i.t ? r(i.l) : (i.t = null, r(t && t.then ? t.then(n) : n(t)));
          i.h = t, i.u = r, i.i = null, e(o, 2, u)
        })
      }, t.prototype.throw = function (t) {
        var n = this;
        return n.l = new Promise(function (i, r) {
          var o = n.i;
          if (null === o) return null === n.t ? i(n.l) : (n.t = null, r(t));
          n.u = i, n.i = null, e(o, 2, t)
        })
      }
    }();
    var c, d, h = (function (e) {
      var t = (c = {
        exports: {}
      }).exports = function (e, t) {
        return t = t || function () {},
          function () {
            var n = !1,
              i = arguments,
              r = new Promise(function (t, r) {
                var o, a = e.apply({
                  async: function () {
                    return n = !0,
                      function (e, n) {
                        e ? r(e) : t(n)
                      }
                  }
                }, Array.prototype.slice.call(i));
                n || (!(o = a) || "object" != typeof o && "function" != typeof o || "function" != typeof o.then ? t(a) : a.then(t, r))
              });
            return r.then(t.bind(null, null), t), r
          }
      };
      t.cb = function (e, n) {
        return t(function () {
          var t = Array.prototype.slice.call(arguments);
          return t.length === e.length - 1 && t.push(this.async()), e.apply(this, t)
        }, n)
      }
    }(), c.exports);
    ! function (e) {
      e[e.off = 0] = "off", e[e.error = 1] = "error", e[e.warning = 2] = "warning", e[e.info = 3] = "info", e[e.debug = 4] = "debug"
    }(d || (d = {}));
    var p = d.off,
      f = function (e) {
        this.m = e
      };
    f.getLevel = function () {
      return p
    }, f.setLevel = function (e) {
      return p = d[e]
    }, f.prototype.print = function () {
      for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
      this.P(console.info, d.off, e)
    }, f.prototype.error = function () {
      for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
      this.P(console.error, d.error, e)
    }, f.prototype.warn = function () {
      for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
      this.P(console.warn, d.warning, e)
    }, f.prototype.info = function () {
      for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
      this.P(console.info, d.info, e)
    }, f.prototype.debug = function () {
      for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
      this.P(console.log, d.debug, e)
    }, f.prototype.P = function (e, t, n) {
      t <= f.getLevel() && e.apply(console, ["[" + this.m + "] "].concat(n))
    };
    var m = function () {
      this.logger = new f("@kevinarnold.zorem"), this.all = ["ready", "page", "reset", "currentAdded", "currentRemoved", "nextAdded", "nextRemoved", "beforeAppear", "appear", "afterAppear", "appearCanceled", "before", "beforeLeave", "leave", "afterLeave", "leaveCanceled", "beforeEnter", "enter", "afterEnter", "enterCanceled", "after"], this.registered = new Map, this.init()
    };
    m.prototype.init = function () {
      var e = this;
      this.registered.clear(), this.all.forEach(function (t) {
        e[t] || (e[t] = function (n, i) {
          void 0 === i && (i = null), e.registered.has(t) || e.registered.set(t, new Set), e.registered.get(t).add({
            ctx: i,
            fn: n
          })
        })
      })
    }, m.prototype.do = function (e) {
      for (var t = [], n = arguments.length - 1; n-- > 0;) t[n] = arguments[n + 1];
      if (this.registered.has(e)) {
        var i = Promise.resolve();
        return this.registered.get(e).forEach(function (e) {
          var n = e.ctx ? e.fn.bind(e.ctx) : e.fn;
          i = i.then(function () {
            return h(n).apply(void 0, t)
          })
        }), i
      }
      return Promise.resolve()
    }, m.prototype.clear = function () {
      var e = this;
      this.all.forEach(function (t) {
        delete e[t]
      }), this.init()
    }, m.prototype.help = function () {
      this.logger.info("Available hooks: " + this.all.join(","));
      var e = [];
      this.registered.forEach(function (t, n) {
        return e.push(n)
      }), this.logger.info("Registered hooks: " + e.join(","))
    };
    var g = new m,
      v = function e(t, i, r) {
        return t instanceof RegExp ? function (e, t) {
          if (!t) return e;
          var n = e.source.match(/\((?!\?)/g);
          if (n)
            for (var i = 0; i < n.length; i++) t.push({
              name: i,
              prefix: null,
              delimiter: null,
              optional: !1,
              repeat: !1,
              pattern: null
            });
          return e
        }(t, i) : Array.isArray(t) ? function (t, n, i) {
          for (var r = [], a = 0; a < t.length; a++) r.push(e(t[a], n, i).source);
          return new RegExp("(?:" + r.join("|") + ")", o(i))
        }(t, i, r) : function (e, t, i) {
          return a(n(e, i), t, i)
        }(t, i, r)
      },
      b = n,
      y = i,
      w = a,
      k = "/",
      T = new RegExp(["(\\\\.)", "(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?"].join("|"), "g");
    v.parse = b, v.compile = function (e, t) {
      return i(n(e, t))
    }, v.tokensToFunction = y, v.tokensToRegExp = w;
    var x = {
        container: "container",
        namespace: "namespace",
        prefix: "data-barba",
        prevent: "prevent",
        wrapper: "wrapper"
      },
      S = function () {
        this.g = x, this.A = new DOMParser
      };
    S.prototype.toString = function (e) {
      return e.outerHTML
    }, S.prototype.toDocument = function (e) {
      return this.A.parseFromString(e, "text/html")
    }, S.prototype.toElement = function (e) {
      var t = document.createElement("div");
      return t.innerHTML = e, t
    }, S.prototype.getHtml = function (e) {
      return void 0 === e && (e = document), this.toString(e.documentElement)
    }, S.prototype.getWrapper = function (e) {
      return void 0 === e && (e = document), e.querySelector("[" + this.g.prefix + '="' + this.g.wrapper + '"]')
    }, S.prototype.getContainer = function (e) {
      return void 0 === e && (e = document), e.querySelector("[" + this.g.prefix + '="' + this.g.container + '"]')
    }, S.prototype.getNamespace = function (e) {
      void 0 === e && (e = document);
      var t = e.querySelector("[" + this.g.prefix + "-" + this.g.namespace + "]");
      return t ? t.getAttribute(this.g.prefix + "-" + this.g.namespace) : null
    }, S.prototype.getHref = function (e) {
      return e.getAttribute && e.getAttribute("href") ? e.href : null
    };
    var C = new S,
      P = function () {
        this.T = []
      },
      E = {
        current: {
          configurable: !0
        },
        previous: {
          configurable: !0
        }
      };
    P.prototype.add = function (e, t) {
      this.T.push({
        url: e,
        ns: t
      })
    }, P.prototype.remove = function () {
      this.T.pop()
    }, P.prototype.push = function (e, t) {
      this.add(e, t), window.history && window.history.pushState(null, "", e)
    }, P.prototype.cancel = function () {
      this.remove(), window.history && window.history.back()
    }, E.current.get = function () {
      return this.T[this.T.length - 1]
    }, E.previous.get = function () {
      return this.T.length < 2 ? null : this.T[this.T.length - 2]
    }, Object.defineProperties(P.prototype, E);
    var A = new P,
      I = function (e, t) {
        try {
          var n = function () {
            if (!t.next.html) return Promise.resolve(e).then(function (e) {
              var n = t.next,
                i = t.trigger;
              if (e) {
                var r = C.toElement(e);
                n.namespace = C.getNamespace(r), n.container = C.getContainer(r), n.html = e, "popstate" === i ? A.add(n.url.href, n.namespace) : A.push(n.url.href, n.namespace);
                var o = C.toDocument(e);
                document.title = o.title
              }
            })
          }();
          return Promise.resolve(n && n.then ? n.then(function () {}) : void 0)
        } catch (e) {
          return Promise.reject(e)
        }
      },
      D = function () {
        return new Promise(function (e) {
          window.requestAnimationFrame(e)
        })
      },
      L = v,
      N = {
        update: I,
        nextTick: D,
        pathToRegexp: L
      },
      G = function () {
        return window.location.origin
      },
      _ = function (e) {
        var t = e || window.location.port,
          n = window.location.protocol;
        return "" !== t ? parseInt(t, 10) : "https:" === n ? 443 : 80
      },
      M = function (e) {
        var t, n = e.replace(G(), ""),
          i = {},
          r = n.indexOf("#");
        r >= 0 && (t = n.slice(r + 1), n = n.slice(0, r));
        var o = n.indexOf("?");
        return o >= 0 && (i = O(n.slice(o + 1)), n = n.slice(0, o)), {
          hash: t,
          path: n,
          query: i
        }
      },
      O = function (e) {
        return e.split("&").reduce(function (e, t) {
          var n = t.split("=");
          return e[n[0]] = n[1], e
        }, {})
      },
      F = function (e) {
        return e.replace(/#.*/, "")
      },
      j = {
        getHref: function () {
          return window.location.href
        },
        getOrigin: G,
        getPort: _,
        getPath: function (e) {
          return M(e).path
        },
        parse: M,
        parseQuery: O,
        clean: F
      },
      R = function (e) {
        if (this.j = [], "boolean" == typeof e) this.R = e;
        else {
          var t = Array.isArray(e) ? e : [e];
          this.j = t.map(function (e) {
            return L(e)
          })
        }
      };
    R.prototype.checkUrl = function (e) {
      if ("boolean" == typeof this.R) return this.R;
      var t = M(e).path;
      return this.j.some(function (e) {
        return null !== e.exec(t)
      })
    };
    var q = function (e) {
        function t(t) {
          e.call(this, t), this.T = new Map
        }
        return e && (t.__proto__ = e), (t.prototype = Object.create(e && e.prototype)).constructor = t, t.prototype.set = function (e, t, n) {
          return this.checkUrl(e) || this.T.set(e, {
            action: n,
            request: t
          }), {
            action: n,
            request: t
          }
        }, t.prototype.get = function (e) {
          return this.T.get(e)
        }, t.prototype.getRequest = function (e) {
          return this.T.get(e).request
        }, t.prototype.getAction = function (e) {
          return this.T.get(e).action
        }, t.prototype.has = function (e) {
          return this.T.has(e)
        }, t.prototype.delete = function (e) {
          return this.T.delete(e)
        }, t.prototype.update = function (e, t) {
          var n = Object.assign({}, this.T.get(e), t);
          return this.T.set(e, n), n
        }, t
      }(R),
      H = function () {
        return !window.history.pushState
      },
      $ = function (e) {
        return !e.el || !e.href
      },
      B = function (e) {
        var t = e.event;
        return t.which > 1 || t.metaKey || t.ctrlKey || t.shiftKey || t.altKey
      },
      V = function (e) {
        var t = e.el;
        return t.hasAttribute("target") && "_blank" === t.target
      },
      W = function (e) {
        var t = e.el;
        return window.location.protocol !== t.protocol || window.location.hostname !== t.hostname
      },
      U = function (e) {
        var t = e.el;
        return _() !== _(t.port)
      },
      X = function (e) {
        var t = e.el;
        return t.getAttribute && "string" == typeof t.getAttribute("download")
      },
      z = function (e) {
        return e.el.hasAttribute(x.prefix + "-" + x.prevent)
      },
      Y = function (e) {
        return Boolean(e.el.closest("[" + x.prefix + "-" + x.prevent + '="all"]'))
      },
      K = function (e) {
        return F(e.href) === F(window.location.href)
      },
      Q = function (e) {
        function t(t) {
          e.call(this, t), this.suite = [], this.tests = new Map, this.init()
        }
        return e && (t.__proto__ = e), (t.prototype = Object.create(e && e.prototype)).constructor = t, t.prototype.init = function () {
          this.add("pushState", H), this.add("exists", $), this.add("newTab", B), this.add("blank", V), this.add("corsDomain", W), this.add("corsPort", U), this.add("download", X), this.add("preventSelf", z), this.add("preventAll", Y), this.add("sameUrl", K, !1)
        }, t.prototype.add = function (e, t, n) {
          void 0 === n && (n = !0), this.tests.set(e, t), n && this.suite.push(e)
        }, t.prototype.run = function (e, t, n, i) {
          return this.tests.get(e)({
            el: t,
            event: n,
            href: i
          })
        }, t.prototype.checkLink = function (e, t, n) {
          var i = this;
          return this.suite.some(function (r) {
            return i.run(r, e, t, n)
          })
        }, t
      }(R),
      J = function (e) {
        void 0 === e && (e = []), this.logger = new f("@kevinarnold.zorem"), this.all = [], this.appear = [], this.k = [{
          name: "namespace",
          type: "strings"
        }, {
          name: "custom",
          type: "function"
        }], e && (this.all = this.all.concat(e)), this.update()
      };
    J.prototype.add = function (e, t) {
      switch (e) {
        case "rule":
          this.k.splice(t.position || 0, 0, t.value);
          break;
        case "transition":
        default:
          this.all.push(t)
      }
      this.update()
    }, J.prototype.resolve = function (e, t) {
      var n, i = this;
      void 0 === t && (t = {});
      var r = t.appear ? this.appear : this.all;
      r = r.filter(t.self ? function (e) {
        return e.name && "self" === e.name
      } : function (e) {
        return !e.name || "self" !== e.name
      });
      var o = new Map,
        a = r.find(function (n) {
          var r = !0,
            a = {};
          return !(!t.self || "self" !== n.name) || (i.k.reverse().forEach(function (o) {
            r && (r = i.O(n, o, e, a), t.appear || (n.from && n.to && (r = i.O(n, o, e, a, "from") && i.O(n, o, e, a, "to")), n.from && !n.to && (r = i.O(n, o, e, a, "from")), !n.from && n.to && (r = i.O(n, o, e, a, "to"))))
          }), o.set(n, a), r)
        }),
        s = o.get(a),
        l = [];
      if (l.push(t.appear ? "appear" : "page"), t.self && l.push("self"), s) {
        var u = [a];
        Object.keys(s).length > 0 && u.push(s), (n = this.logger).info.apply(n, ["Transition found [" + l.join(",") + "]"].concat(u))
      } else this.logger.info("No transition found [" + l.join(",") + "]");
      return a
    }, J.prototype.update = function () {
      var e = this;
      this.all = this.all.map(function (t) {
        return e.L(t)
      }).sort(function (e, t) {
        return e.priority - t.priority
      }).reverse().map(function (e) {
        return delete e.priority, e
      }), this.appear = this.all.filter(function (e) {
        return void 0 !== e.appear
      })
    }, J.prototype.O = function (e, t, n, i, r) {
      var o = !0,
        a = !1,
        s = e,
        l = t.name,
        u = l,
        c = l,
        d = l,
        h = r ? s[r] : s,
        p = "to" === r ? n.next : n.current;
      if (r ? h && h[l] : h[l]) {
        switch (t.type) {
          case "strings":
          default:
            var f = Array.isArray(h[u]) ? h[u] : [h[u]];
            p[u] && -1 !== f.indexOf(p[u]) && (a = !0), -1 === f.indexOf(p[u]) && (o = !1);
            break;
          case "object":
            var m = Array.isArray(h[c]) ? h[c] : [h[c]];
            p[c] && (p[c].name && -1 !== m.indexOf(p[c].name) && (a = !0), -1 === m.indexOf(p[c].name) && (o = !1));
            break;
          case "function":
            h[d](n) ? a = !0 : o = !1
        }
        a && (r ? (i[r] = i[r] || {}, i[r][l] = s[r][l]) : i[l] = s[l])
      }
      return o
    }, J.prototype.M = function (e, t, n) {
      var i = 0;
      return (e[t] || e.from && e.from[t] || e.to && e.to[t]) && (i += Math.pow(10, n), e.from && e.from[t] && (i += 1), e.to && e.to[t] && (i += 2)), i
    }, J.prototype.L = function (e) {
      var t = this;
      e.priority = 0;
      var n = 0;
      return this.k.forEach(function (i, r) {
        n += t.M(e, i.name, r + 1)
      }), e.priority = n, e
    };
    var Z = function (e) {
        void 0 === e && (e = []), this.logger = new f("@barbas/core"), this.S = !1, this.store = new J(e)
      },
      ee = {
        isRunning: {
          configurable: !0
        },
        hasAppear: {
          configurable: !0
        },
        hasSelf: {
          configurable: !0
        },
        shouldWait: {
          configurable: !0
        }
      };
    Z.prototype.get = function (e, t) {
      return this.store.resolve(e, t)
    }, ee.isRunning.get = function () {
      return this.S
    }, ee.isRunning.set = function (e) {
      this.S = e
    }, ee.hasAppear.get = function () {
      return this.store.appear.length > 0
    }, ee.hasSelf.get = function () {
      return this.store.all.some(function (e) {
        return "self" === e.name
      })
    }, ee.shouldWait.get = function () {
      return this.store.all.some(function (e) {
        return e.to && !e.to.route || e.sync
      })
    }, Z.prototype.doAppear = function (e) {
      var n = e.data,
        i = e.transition;
      try {
        var r = this;

        function o(e) {
          r.S = !1
        }
        var a = i || {};
        r.S = !0;
        var s = t(function () {
          return Promise.resolve(r.$("beforeAppear", n, a)).then(function () {
            return Promise.resolve(r.appear(n, a)).then(function () {
              return Promise.resolve(r.$("afterAppear", n, a)).then(function () {})
            })
          })
        }, function (e) {
          throw r.S = !1, r.logger.error(e), new Error("Transition error [appear]")
        });
        return s && s.then ? s.then(o) : o()
      } catch (e) {
        return Promise.reject(e)
      }
    }, Z.prototype.doPage = function (e) {
      var n = e.data,
        i = e.transition,
        r = e.page,
        o = e.wrapper;
      try {
        var a = this;

        function s(e) {
          a.S = !1
        }
        var l = i || {},
          u = !0 === l.sync || !1;
        a.S = !0;
        var c = t(function () {
          function e() {
            return Promise.resolve(a.$("before", n, l)).then(function () {
              function e(e) {
                return Promise.resolve(a.$("after", n, l)).then(function () {
                  return Promise.resolve(a.remove(n)).then(function () {})
                })
              }
              var i = function () {
                if (u) return t(function () {
                  return Promise.resolve(a.add(n, o)).then(function () {
                    return Promise.resolve(a.$("beforeLeave", n, l)).then(function () {
                      return Promise.resolve(a.$("beforeEnter", n, l)).then(function () {
                        return Promise.resolve(Promise.all([a.leave(n, l), a.enter(n, l)])).then(function () {
                          return Promise.resolve(a.$("afterLeave", n, l)).then(function () {
                            return Promise.resolve(a.$("afterEnter", n, l)).then(function () {})
                          })
                        })
                      })
                    })
                  })
                }, function () {
                  throw new Error("Transition error [page][sync]")
                }); {
                  function e(e) {
                    return t(function () {
                      var e = function () {
                        if (!1 !== i) return Promise.resolve(a.add(n, o)).then(function () {
                          return Promise.resolve(a.$("beforeEnter", n, l)).then(function () {
                            return Promise.resolve(a.enter(n, l, i)).then(function () {
                              return Promise.resolve(a.$("afterEnter", n, l)).then(function () {})
                            })
                          })
                        })
                      }();
                      if (e && e.then) return e.then(function () {})
                    }, function () {
                      throw new Error("Transition error [page][enter]")
                    })
                  }
                  var i = !1,
                    s = t(function () {
                      return Promise.resolve(a.$("beforeLeave", n, l)).then(function () {
                        return Promise.resolve(Promise.all([a.leave(n, l), I(r, n)]).then(function (e) {
                          return e[0]
                        })).then(function (e) {
                          return i = e, Promise.resolve(a.$("afterLeave", n, l)).then(function () {})
                        })
                      })
                    }, function () {
                      throw new Error("Transition error [page][leave]")
                    });
                  return s && s.then ? s.then(e) : e()
                }
              }();
              return i && i.then ? i.then(e) : e()
            })
          }
          var i = function () {
            if (u) return Promise.resolve(I(r, n)).then(function () {})
          }();
          return i && i.then ? i.then(e) : e()
        }, function (e) {
          throw a.S = !1, a.logger.error(e), new Error("Transition error")
        });
        return c && c.then ? c.then(s) : s()
      } catch (e) {
        return Promise.reject(e)
      }
    }, Z.prototype.appear = function (e, t) {
      try {
        return Promise.resolve(g.do("appear", e, t)).then(function () {
          return t.appear ? h(t.appear)(e) : Promise.resolve()
        })
      } catch (e) {
        return Promise.reject(e)
      }
    }, Z.prototype.leave = function (e, t) {
      try {
        return Promise.resolve(g.do("leave", e, t)).then(function () {
          return t.leave ? h(t.leave)(e) : Promise.resolve()
        })
      } catch (e) {
        return Promise.reject(e)
      }
    }, Z.prototype.enter = function (e, t, n) {
      try {
        return Promise.resolve(g.do("enter", e, t)).then(function () {
          return t.enter ? h(t.enter)(e, n) : Promise.resolve()
        })
      } catch (e) {
        return Promise.reject(e)
      }
    }, Z.prototype.add = function (e, t) {
      try {
        return t.appendChild(e.next.container), Promise.resolve(D()).then(function () {
          g.do("nextAdded", e)
        })
      } catch (e) {
        return Promise.reject(e)
      }
    }, Z.prototype.remove = function (e) {
      try {
        var t = e.current.container,
          n = function () {
            if (document.body.contains(t)) return Promise.resolve(D()).then(function () {
              return t.parentNode.removeChild(t), Promise.resolve(D()).then(function () {
                g.do("currentRemoved", e)
              })
            })
          }();
        return n && n.then ? n.then(function () {}) : void 0
      } catch (e) {
        return Promise.reject(e)
      }
    }, Z.prototype.$ = function (e, t, n) {
      try {
        return Promise.resolve(g.do(e, t, n)).then(function () {
          return n[e] ? h(n[e])(t) : Promise.resolve()
        })
      } catch (e) {
        return Promise.reject(e)
      }
    }, Object.defineProperties(Z.prototype, ee);
    var te = function (e) {
      var t = this;
      this.names = ["beforeAppear", "afterAppear", "beforeLeave", "afterLeave", "beforeEnter", "afterEnter"], this.byNamespace = new Map, 0 !== e.length && (e.forEach(function (e) {
        t.byNamespace.set(e.namespace, e)
      }), this.names.forEach(function (e) {
        g[e](t.q(e), t)
      }), g.ready(this.q("beforeEnter"), this))
    };
    te.prototype.q = function (e) {
      var t = this;
      return function (n) {
        var i = e.match(/enter/i) ? n.next : n.current,
          r = t.byNamespace.get(i.namespace);
        r && r[e] && r[e](n)
      }
    }, Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector), Element.prototype.closest || (Element.prototype.closest = function (e) {
      var t = this;
      do {
        if (t.matches(e)) return t;
        t = t.parentElement || t.parentNode
      } while (null !== t && 1 === t.nodeType);
      return null
    });
    var ne = {
        container: void 0,
        html: void 0,
        namespace: void 0,
        url: {
          hash: void 0,
          href: void 0,
          path: void 0,
          query: {}
        }
      },
      ie = function () {
        this.version = "2.3.9", this.schemaPage = ne, this.Logger = f, this.logger = new f("@kevinarnold.zorem"), this.plugins = [], this.hooks = g, this.dom = C, this.helpers = N, this.history = A, this.request = s, this.url = j
      },
      re = {
        data: {
          configurable: !0
        },
        wrapper: {
          configurable: !0
        }
      };
    return ie.prototype.use = function (e, t) {
      var n = this.plugins;
      n.indexOf(e) > -1 ? this.logger.warn("Plugin [" + e.name + "] already installed.") : "function" == typeof e.install ? (e.install(this, t), n.push(e)) : this.logger.warn("Plugin [" + e.name + '] has no "install" method.')
    }, ie.prototype.init = function (e) {
      void 0 === e && (e = {});
      var t = e.transitions;
      void 0 === t && (t = []);
      var n = e.views;
      void 0 === n && (n = []);
      var i = e.prevent;
      void 0 === i && (i = null);
      var r = e.timeout;
      void 0 === r && (r = 2e3);
      var o = e.requestError,
        a = e.cacheIgnore;
      void 0 === a && (a = !1);
      var s = e.prefetchIgnore;
      void 0 === s && (s = !1);
      var l = e.schema;
      void 0 === l && (l = x);
      var u = e.debug;
      void 0 === u && (u = !1);
      var c = e.logLevel;
      if (void 0 === c && (c = "off"), f.setLevel(!0 === u ? "debug" : c), this.logger.print(this.version), Object.keys(l).forEach(function (e) {
          x[e] && (x[e] = l[e])
        }), this.C = o, this.timeout = r, this.cacheIgnore = a, this.prefetchIgnore = s, this.B = this.dom.getWrapper(), !this.B) throw new Error("[@kevinarnold.zorem] No Barba wrapper found");
      this.B.setAttribute("aria-live", "polite"), this.H();
      var d = this.data.current;
      if (!d.container) throw new Error("[@kevinarnold.zorem] No Barba container found");
      if (this.cache = new q(a), this.prevent = new Q(s), this.transitions = new Z(t), this.views = new te(n), null !== i) {
        if ("function" != typeof i) throw new Error("[@kevinarnold.zorem] Prevent should be a function");
        this.prevent.add("preventCustom", i)
      }
      this.history.add(d.url.href, d.namespace), this.I = this.I.bind(this), this.N = this.N.bind(this), this.U = this.U.bind(this), this.D(), this.plugins.forEach(function (e) {
        return e.init()
      });
      var h = this.data;
      h.trigger = "barba", h.next = h.current, this.hooks.do("ready", h), this.appear(), this.H()
    }, ie.prototype.destroy = function () {
      this.H(), this.X(), this.hooks.clear(), this.plugins = []
    }, re.data.get = function () {
      return this._
    }, re.wrapper.get = function () {
      return this.B
    }, ie.prototype.force = function (e) {
      window.location.assign(e)
    }, ie.prototype.go = function (e, t, n) {
      var i;
      if (void 0 === t && (t = "barba"), !(i = "popstate" === t ? this.history.current && this.url.getPath(this.history.current.url) === this.url.getPath(e) : this.prevent.run("sameUrl", null, null, e)) || this.transitions.hasSelf) return n && (n.stopPropagation(), n.preventDefault()), this.page(e, t, i)
    }, ie.prototype.appear = function () {
      try {
        var e = this,
          n = function () {
            if (e.transitions.hasAppear) {
              var n = t(function () {
                var t = e._,
                  n = e.transitions.get(t, {
                    appear: !0
                  });
                return Promise.resolve(e.transitions.doAppear({
                  transition: n,
                  data: t
                })).then(function () {})
              }, function (t) {
                e.logger.error(t)
              });
              if (n && n.then) return n.then(function () {})
            }
          }();
        return n && n.then ? n.then(function () {}) : void 0
      } catch (e) {
        return Promise.reject(e)
      }
    }, ie.prototype.page = function (e, n, i) {
      try {
        var r = this;

        function o() {
          var e = r.data;
          r.hooks.do("page", e);
          var n = t(function () {
            var t = r.transitions.get(e, {
              appear: !1,
              self: i
            });
            return Promise.resolve(r.transitions.doPage({
              data: e,
              page: a,
              transition: t,
              wrapper: r.B
            })).then(function () {
              r.H()
            })
          }, function (e) {
            r.logger.error(e)
          });
          if (n && n.then) return n.then(function () {})
        }
        if (r.transitions.isRunning) return void r.force(e);
        r.data.next.url = Object.assign({}, {
          href: e
        }, r.url.parse(e)), r.data.trigger = n;
        var a = r.cache.has(e) ? r.cache.update(e, {
            action: "click"
          }).request : r.cache.set(e, r.request(e, r.timeout, r.onRequestError.bind(r, n)), "click").request,
          s = function () {
            if (r.transitions.shouldWait) return Promise.resolve(I(a, r.data)).then(function () {})
          }();
        return s && s.then ? s.then(o) : o()
      } catch (e) {
        return Promise.reject(e)
      }
    }, ie.prototype.onRequestError = function (e) {
      for (var t = [], n = arguments.length - 1; n-- > 0;) t[n] = arguments[n + 1];
      this.transitions.isRunning = !1;
      var i = t[0],
        r = t[1],
        o = this.cache.getAction(i);
      return this.cache.delete(i), !(this.C && !1 === this.C(e, o, i, r) || ("click" === o && this.force(i), 1))
    }, ie.prototype.prefetch = function (e) {
      var t = this;
      this.cache.has(e) || this.cache.set(e, this.request(e, this.timeout, this.onRequestError.bind(this, "barba")).catch(function (e) {
        t.logger.error(e)
      }), "prefetch")
    }, ie.prototype.D = function () {
      !0 !== this.prefetchIgnore && (document.addEventListener("mouseover", this.I), document.addEventListener("touchstart", this.I)), document.addEventListener("click", this.N), window.addEventListener("popstate", this.U)
    }, ie.prototype.X = function () {
      !0 !== this.prefetchIgnore && (document.removeEventListener("mouseover", this.I), document.removeEventListener("touchstart", this.I)), document.removeEventListener("click", this.N), window.removeEventListener("popstate", this.U)
    }, ie.prototype.I = function (e) {
      var t = this,
        n = this.F(e);
      if (n) {
        var i = this.dom.getHref(n);
        this.prevent.checkUrl(i) || this.cache.has(i) || this.cache.set(i, this.request(i, this.timeout, this.onRequestError.bind(this, n)).catch(function (e) {
          t.logger.error(e)
        }), "enter")
      }
    }, ie.prototype.N = function (e) {
      var t = this.F(e);
      t && this.go(this.dom.getHref(t), t, e)
    }, ie.prototype.U = function () {
      this.go(this.url.getHref(), "popstate")
    }, ie.prototype.F = function (e) {
      for (var t = e.target; t && !this.dom.getHref(t);) t = t.parentNode;
      if (t && !this.prevent.checkLink(t, e, t.href)) return t
    }, ie.prototype.H = function () {
      var e = this.url.getHref(),
        t = {
          container: this.dom.getContainer(),
          html: this.dom.getHtml(),
          namespace: this.dom.getNamespace(),
          url: Object.assign({}, {
            href: e
          }, this.url.parse(e))
        };
      this._ = {
        current: t,
        next: Object.assign({}, this.schemaPage),
        trigger: void 0
      }, this.hooks.do("reset", this.data)
    }, Object.defineProperties(ie.prototype, re), new ie
  }),
  function (e, t, n, i) {
    var r = function () {
        if (n.documentMode) return n.documentMode;
        for (var e = 7; e > 0; e--) {
          var t = n.createElement("div");
          if (t.innerHTML = "\x3c!--[if IE " + e + "]><span></span><![endif]--\x3e", t.getElementsByTagName("span").length) return t = null, e;
          t = null
        }
        return i
      }(),
      o = t.console || {
        log: function () {},
        time: function () {}
      },
      a = "blast",
      s = {
        latinPunctuation: "–—′’'“″„\"(«.…¡¿′’'”″“\")».…!?",
        latinLetters: "\\u0041-\\u005A\\u0061-\\u007A\\u00C0-\\u017F\\u0100-\\u01FF\\u0180-\\u027F"
      },
      l = {
        abbreviations: new RegExp("[^" + s.latinLetters + "](e\\.g\\.)|(i\\.e\\.)|(mr\\.)|(mrs\\.)|(ms\\.)|(dr\\.)|(prof\\.)|(esq\\.)|(sr\\.)|(jr\\.)[^" + s.latinLetters + "]", "ig"),
        innerWordPeriod: new RegExp("[" + s.latinLetters + "].[" + s.latinLetters + "]", "ig"),
        onlyContainsPunctuation: new RegExp("[^" + s.latinPunctuation + "]"),
        adjoinedPunctuation: new RegExp("^[" + s.latinPunctuation + "]+|[" + s.latinPunctuation + "]+$", "g"),
        skippedElements: /(script|style|select|textarea)/i,
        hasPluginClass: new RegExp("(^| )" + a + "( |$)", "gi")
      };
    e.fn[a] = function (u) {
      function c(e) {
        return e.replace(/{{(\d{1,3})}}/g, function (e, t) {
          return String.fromCharCode(t)
        })
      }

      function d(e, t) {
        var i = n.createElement(t.tag);
        if (i.className = a, t.customClass && (i.className += " " + t.customClass, t.generateIndexID && (i.id = t.customClass + "-" + g.blastedIndex)), "all" === t.delimiter && /\s/.test(e.data) && (i.style.whiteSpace = "pre-line"), !0 === t.generateValueClass && !t.search && ("character" === t.delimiter || "word" === t.delimiter)) {
          var r, o = e.data;
          "word" === t.delimiter && l.onlyContainsPunctuation.test(o) && (o = o.replace(l.adjoinedPunctuation, "")), r = a + "-" + t.delimiter.toLowerCase() + "-" + o.toLowerCase(), i.className += " " + r
        }
        return t.aria && i.setAttribute("aria-hidden", "true"), i.appendChild(e.cloneNode(!1)), i
      }

      function h(e, t) {
        var n = -1,
          i = 0;
        if (3 === e.nodeType && e.data.length) {
          if (g.nodeBeginning && (e.data = t.search || "sentence" !== t.delimiter ? c(e.data) : function (e) {
              return e.replace(l.abbreviations, function (e) {
                return e.replace(/\./g, "{{46}}")
              }).replace(l.innerWordPeriod, function (e) {
                return e.replace(/\./g, "{{46}}")
              })
            }(e.data), g.nodeBeginning = !1), -1 !== (n = e.data.search(f))) {
            var r = e.data.match(f),
              o = r[0],
              a = r[1] || !1;
            "" === o ? n++ : a && a !== o && (n += o.indexOf(a), o = a);
            var s = e.splitText(n);
            s.splitText(o.length), i = 1, t.search || "sentence" !== t.delimiter || (s.data = c(s.data));
            var u = d(s, t, g.blastedIndex);
            s.parentNode.replaceChild(u, s), g.wrappers.push(u), g.blastedIndex++
          }
        } else if (1 === e.nodeType && e.hasChildNodes() && !l.skippedElements.test(e.tagName) && !l.hasPluginClass.test(e.className))
          for (var p = 0; p < e.childNodes.length; p++) g.nodeBeginning = !0, p += h(e.childNodes[p], t);
        return i
      }

      function p(n, s) {
        s.debug && o.time("blast reversal");
        var l = !1;
        n.removeClass(a + "-root").removeAttr("aria-label").find("." + a).each(function () {
          if (e(this).closest("." + a + "-root").length) l = !0;
          else {
            var t = this.parentNode;
            7 >= r && t.firstChild.nodeName, t.replaceChild(this.firstChild, this), t.normalize()
          }
        }), t.Zepto ? n.data(a, i) : n.removeData(a), s.debug && (o.log(a + ": Reversed Blast" + (n.attr("id") ? " on #" + n.attr("id") + "." : ".") + (l ? " Skipped reversal on the children of one or more descendant root elements." : "")), o.timeEnd("blast reversal"))
      }
      var f, m = e.extend({}, e.fn[a].defaults, u),
        g = {};
      if (m.search.length && ("string" == typeof m.search || /^\d/.test(parseFloat(m.search)))) m.delimiter = m.search.toString().replace(/[-[\]{,}(.)*+?|^$\\\/]/g, "\\$&"), f = new RegExp("(?:^|[^-" + s.latinLetters + "])(" + m.delimiter + "('s)?)(?![-" + s.latinLetters + "])", "i");
      else switch ("string" == typeof m.delimiter && (m.delimiter = m.delimiter.toLowerCase()), m.delimiter) {
        case "all":
          f = /(.)/;
          break;
        case "letter":
        case "char":
        case "character":
          f = /(\S)/;
          break;
        case "word":
          f = /\s*(\S+)\s*/;
          break;
        case "sentence":
          f = /(?=\S)(([.]{2,})?[^!?]+?([.…!?]+|(?=\s+$)|$)(\s*[′’'”″“")»]+)*)/;
          break;
        case "element":
          f = /(?=\S)([\S\s]*\S)/;
          break;
        default:
          if (!(m.delimiter instanceof RegExp)) return o.log(a + ": Unrecognized delimiter, empty search string, or invalid custom Regex. Aborting."), !0;
          f = m.delimiter
      }
      if (this.each(function () {
          var t = e(this),
            r = t.text();
          if (!1 !== u) {
            g = {
              blastedIndex: 0,
              nodeBeginning: !1,
              wrappers: g.wrappers || []
            }, t.data(a) === i || "search" === t.data(a) && !1 !== m.search || (p(t, m), m.debug && o.log(a + ": Removed element's existing Blast call.")), t.data(a, !1 !== m.search ? "search" : m.delimiter), m.aria && t.attr("aria-label", r), m.stripHTMLTags && t.html(r);
            try {
              n.createElement(m.tag)
            } catch (e) {
              m.tag = "span", m.debug && o.log(a + ": Invalid tag supplied. Defaulting to span.")
            }
            t.addClass(a + "-root"), m.debug && o.time(a), h(this, m), m.debug && o.timeEnd(a)
          } else !1 === u && t.data(a) !== i && p(t, m);
          m.debug && e.each(g.wrappers, function (e, t) {
            o.log(a + " [" + m.delimiter + "] " + this.outerHTML), this.style.backgroundColor = e % 2 ? "#f12185" : "#075d9a"
          })
        }), !1 !== u && !0 === m.returnGenerated) {
        var v = e().add(g.wrappers);
        return v.prevObject = this, v.context = this.context, v
      }
      return this
    }, e.fn.blast.defaults = {
      returnGenerated: !0,
      delimiter: "word",
      tag: "span",
      search: !1,
      customClass: "",
      generateIndexID: !1,
      generateValueClass: !1,
      stripHTMLTags: !1,
      aria: !0,
      debug: !1
    }
  }(window.jQuery || window.Zepto, window, document), String.prototype.replaceAll = function (e, t) {
    return this.split(e).join(t)
  },
  function (e, t) {
    if ("function" == typeof define && define.amd) define(["exports"], t);
    else if ("undefined" != typeof exports) t(exports);
    else {
      var n = {};
      t(n), e.bodyScrollLock = n
    }
  }(this, function (e) {
    "use strict";

    function t(e) {
      if (Array.isArray(e)) {
        for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
        return n
      }
      return Array.from(e)
    }
    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var n = !1;
    if ("undefined" != typeof window) {
      var i = {
        get passive() {
          n = !0
        }
      };
      window.addEventListener("testPassive", null, i), window.removeEventListener("testPassive", null, i)
    }
    var r = "undefined" != typeof window && window.navigator && window.navigator.platform && /iP(ad|hone|od)/.test(window.navigator.platform),
      o = [],
      a = !1,
      s = -1,
      l = void 0,
      u = void 0,
      c = function (e) {
        return o.some(function (t) {
          return !(!t.options.allowTouchMove || !t.options.allowTouchMove(e))
        })
      },
      d = function (e) {
        var t = e || window.event;
        return !!c(t.target) || 1 < t.touches.length || (t.preventDefault && t.preventDefault(), !1)
      },
      h = function () {
        setTimeout(function () {
          void 0 !== u && (document.body.style.paddingRight = u, u = void 0), void 0 !== l && (document.body.style.overflow = l, l = void 0)
        })
      };
    e.disableBodyScroll = function (e, i) {
      if (r) {
        if (!e) return void console.error("disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.");
        if (e && !o.some(function (t) {
            return t.targetElement === e
          })) {
          var h = {
            targetElement: e,
            options: i || {}
          };
          o = [].concat(t(o), [h]), e.ontouchstart = function (e) {
            1 === e.targetTouches.length && (s = e.targetTouches[0].clientY)
          }, e.ontouchmove = function (t) {
            var n, i, r, o;
            1 === t.targetTouches.length && (i = e, o = (n = t).targetTouches[0].clientY - s, !c(n.target) && (i && 0 === i.scrollTop && 0 < o ? d(n) : (r = i) && r.scrollHeight - r.scrollTop <= r.clientHeight && o < 0 ? d(n) : n.stopPropagation()))
          }, a || (document.addEventListener("touchmove", d, n ? {
            passive: !1
          } : void 0), a = !0)
        }
      } else {
        f = i, setTimeout(function () {
          if (void 0 === u) {
            var e = !!f && !0 === f.reserveScrollBarGap,
              t = window.innerWidth - document.documentElement.clientWidth;
            e && 0 < t && (u = document.body.style.paddingRight, document.body.style.paddingRight = t + "px")
          }
          void 0 === l && (l = document.body.style.overflow, document.body.style.overflow = "hidden")
        });
        var p = {
          targetElement: e,
          options: i || {}
        };
        o = [].concat(t(o), [p])
      }
      var f
    }, e.clearAllBodyScrollLocks = function () {
      r ? (o.forEach(function (e) {
        e.targetElement.ontouchstart = null, e.targetElement.ontouchmove = null
      }), a && (document.removeEventListener("touchmove", d, n ? {
        passive: !1
      } : void 0), a = !1), o = [], s = -1) : (h(), o = [])
    }, e.enableBodyScroll = function (e) {
      if (r) {
        if (!e) return void console.error("enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.");
        e.ontouchstart = null, e.ontouchmove = null, o = o.filter(function (t) {
          return t.targetElement !== e
        }), a && 0 === o.length && (document.removeEventListener("touchmove", d, n ? {
          passive: !1
        } : void 0), a = !1)
      } else 1 === o.length && o[0].targetElement === e ? (h(), o = []) : o = o.filter(function (t) {
        return t.targetElement !== e
      })
    }
  }), "object" == typeof navigator && function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define("Plyr", t) : (e = e || self, e.Plyr = t())
  }(this, function () {
    "use strict";

    function e(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function t(e, t) {
      for (var n = 0; n < t.length; n++) {
        var i = t[n];
        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
      }
    }

    function n(e, n, i) {
      return n && t(e.prototype, n), i && t(e, i), e
    }

    function i(e, t, n) {
      return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }) : e[t] = n, e
    }

    function r(e, t) {
      return function (e) {
        if (Array.isArray(e)) return e
      }(e) || function (e, t) {
        var n = [],
          i = !0,
          r = !1,
          o = void 0;
        try {
          for (var a, s = e[Symbol.iterator](); !(i = (a = s.next()).done) && (n.push(a.value), !t || n.length !== t); i = !0);
        } catch (e) {
          r = !0, o = e
        } finally {
          try {
            i || null == s.return || s.return()
          } finally {
            if (r) throw o
          }
        }
        return n
      }(e, t) || function () {
        throw new TypeError("Invalid attempt to destructure non-iterable instance")
      }()
    }

    function o(e) {
      return function (e) {
        if (Array.isArray(e)) {
          for (var t = 0, n = new Array(e.length); t < e.length; t++) n[t] = e[t];
          return n
        }
      }(e) || function (e) {
        if (Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)) return Array.from(e)
      }(e) || function () {
        throw new TypeError("Invalid attempt to spread non-iterable instance")
      }()
    }

    function a(e, t) {
      if (t < 1) {
        var n = function (e) {
          var t = "".concat(e).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
          return t ? Math.max(0, (t[1] ? t[1].length : 0) - (t[2] ? +t[2] : 0)) : 0
        }(t);
        return parseFloat(e.toFixed(n))
      }
      return Math.round(e / t) * t
    }

    function s(e, t) {
      setTimeout(function () {
        try {
          e.hidden = !0, e.offsetHeight, e.hidden = !1
        } catch (e) {}
      }, t)
    }

    function l(e, t, n) {
      var i = this,
        r = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
        o = !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4],
        a = arguments.length > 5 && void 0 !== arguments[5] && arguments[5];
      if (e && "addEventListener" in e && !ge.empty(t) && ge.function(n)) {
        var s = t.split(" "),
          l = a;
        ye && (l = {
          passive: o,
          capture: a
        }), s.forEach(function (t) {
          i && i.eventListeners && r && i.eventListeners.push({
            element: e,
            type: t,
            callback: n,
            options: l
          }), e[r ? "addEventListener" : "removeEventListener"](t, n, l)
        })
      }
    }

    function u(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
        n = arguments.length > 2 ? arguments[2] : void 0,
        i = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3],
        r = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
      l.call(this, e, t, n, !0, i, r)
    }

    function c(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
        n = arguments.length > 2 ? arguments[2] : void 0,
        i = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3],
        r = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
      l.call(this, e, t, n, !1, i, r)
    }

    function d(e) {
      var t = this,
        n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
        i = arguments.length > 2 ? arguments[2] : void 0,
        r = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3],
        o = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
      l.call(this, e, n, function a() {
        c(e, n, a, r, o);
        for (var s = arguments.length, l = new Array(s), u = 0; u < s; u++) l[u] = arguments[u];
        i.apply(t, l)
      }, !0, r, o)
    }

    function h(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
        n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
        i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
      if (ge.element(e) && !ge.empty(t)) {
        var r = new CustomEvent(t, {
          bubbles: n,
          detail: Object.assign({}, i, {
            plyr: this
          })
        });
        e.dispatchEvent(r)
      }
    }

    function p(e, t) {
      return t.split(".").reduce(function (e, t) {
        return e && e[t]
      }, e)
    }

    function f() {
      for (var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) n[r - 1] = arguments[r];
      if (!n.length) return e;
      var o = n.shift();
      return ge.object(o) ? (Object.keys(o).forEach(function (t) {
        ge.object(o[t]) ? (Object.keys(e).includes(t) || Object.assign(e, i({}, t, {})), f(e[t], o[t])) : Object.assign(e, i({}, t, o[t]))
      }), f.apply(void 0, [e].concat(n))) : e
    }

    function m(e, t) {
      var n = e.length ? e : [e];
      Array.from(n).reverse().forEach(function (e, n) {
        var i = n > 0 ? t.cloneNode(!0) : t,
          r = e.parentNode,
          o = e.nextSibling;
        i.appendChild(e), o ? r.insertBefore(i, o) : r.appendChild(i)
      })
    }

    function g(e, t) {
      ge.element(e) && !ge.empty(t) && Object.entries(t).filter(function (e) {
        var t = r(e, 2)[1];
        return !ge.nullOrUndefined(t)
      }).forEach(function (t) {
        var n = r(t, 2),
          i = n[0],
          o = n[1];
        return e.setAttribute(i, o)
      })
    }

    function v(e, t, n) {
      var i = document.createElement(e);
      return ge.object(t) && g(i, t), ge.string(n) && (i.innerText = n), i
    }

    function b(e, t, n, i) {
      ge.element(t) && t.appendChild(v(e, n, i))
    }

    function y(e) {
      ge.nodeList(e) || ge.array(e) ? Array.from(e).forEach(y) : ge.element(e) && ge.element(e.parentNode) && e.parentNode.removeChild(e)
    }

    function w(e) {
      if (ge.element(e))
        for (var t = e.childNodes.length; t > 0;) e.removeChild(e.lastChild), t -= 1
    }

    function k(e, t) {
      return ge.element(t) && ge.element(t.parentNode) && ge.element(e) ? (t.parentNode.replaceChild(e, t), e) : null
    }

    function T(e, t) {
      if (!ge.string(e) || ge.empty(e)) return {};
      var n = {},
        i = f({}, t);
      return e.split(",").forEach(function (e) {
        var t = e.trim(),
          o = t.replace(".", ""),
          a = t.replace(/[[\]]/g, "").split("="),
          s = r(a, 1)[0],
          l = a.length > 1 ? a[1].replace(/["']/g, "") : "";
        switch (t.charAt(0)) {
          case ".":
            ge.string(i.class) ? n.class = "".concat(i.class, " ").concat(o) : n.class = o;
            break;
          case "#":
            n.id = t.replace("#", "");
            break;
          case "[":
            n[s] = l
        }
      }), f(i, n)
    }

    function x(e, t) {
      if (ge.element(e)) {
        var n = t;
        ge.boolean(n) || (n = !e.hidden), e.hidden = n
      }
    }

    function S(e, t, n) {
      if (ge.nodeList(e)) return Array.from(e).map(function (e) {
        return S(e, t, n)
      });
      if (ge.element(e)) {
        var i = "toggle";
        return void 0 !== n && (i = n ? "add" : "remove"), e.classList[i](t), e.classList.contains(t)
      }
      return !1
    }

    function C(e, t) {
      return ge.element(e) && e.classList.contains(t)
    }

    function P(e, t) {
      return function () {
        return Array.from(document.querySelectorAll(t)).includes(this)
      }.call(e, t)
    }

    function E(e) {
      return this.elements.container.querySelectorAll(e)
    }

    function A(e) {
      return this.elements.container.querySelector(e)
    }

    function I() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
        t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
      ge.element(e) && (e.focus({
        preventScroll: !0
      }), t && S(e, this.config.classNames.tabFocus))
    }

    function D(e) {
      if (!(ge.array(e) || ge.string(e) && e.includes(":"))) return !1;
      return (ge.array(e) ? e : e.split(":")).map(Number).every(ge.number)
    }

    function L(e) {
      if (!ge.array(e) || !e.every(ge.number)) return null;
      var t = r(e, 2),
        n = t[0],
        i = t[1],
        o = function e(t, n) {
          return 0 === n ? t : e(n, t % n)
        }(n, i);
      return [n / o, i / o]
    }

    function N(e) {
      var t = function (e) {
          return D(e) ? e.split(":").map(Number) : null
        },
        n = t(e);
      if (null === n && (n = t(this.config.ratio)), null === n && !ge.empty(this.embed) && ge.array(this.embed.ratio) && (n = this.embed.ratio), null === n && this.isHTML5) {
        var i = this.media;
        n = L([i.videoWidth, i.videoHeight])
      }
      return n
    }

    function G(e) {
      if (!this.isVideo) return {};
      var t = N.call(this, e),
        n = r(ge.array(t) ? t : [0, 0], 2),
        i = 100 / n[0] * n[1];
      if (this.elements.wrapper.style.paddingBottom = "".concat(i, "%"), this.isVimeo && this.supported.ui) {
        var o = (240 - i) / 4.8;
        this.media.style.transform = "translateY(-".concat(o, "%)")
      } else this.isHTML5 && this.elements.wrapper.classList.toggle(this.config.classNames.videoFixedRatio, null !== t);
      return {
        padding: i,
        ratio: t
      }
    }

    function _(e) {
      return ge.array(e) ? e.filter(function (t, n) {
        return e.indexOf(t) === n
      }) : e
    }

    function M(e) {
      for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
      return ge.empty(e) ? e : e.toString().replace(/{(\d+)}/g, function (e, t) {
        return n[t].toString()
      })
    }

    function O() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
        t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
        n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "";
      return e.replace(new RegExp(t.toString().replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1"), "g"), n.toString())
    }

    function F() {
      return (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "").toString().replace(/\w\S*/g, function (e) {
        return e.charAt(0).toUpperCase() + e.substr(1).toLowerCase()
      })
    }

    function j() {
      var e = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "").toString();
      return (e = function () {
        var e = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "").toString();
        return e = O(e, "-", " "), e = O(e, "_", " "), e = F(e), O(e, " ", "")
      }(e)).charAt(0).toLowerCase() + e.slice(1)
    }

    function R(e) {
      var t = document.createElement("div");
      return t.appendChild(e), t.innerHTML
    }

    function q(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "text";
      return new Promise(function (n, i) {
        try {
          var r = new XMLHttpRequest;
          if (!("withCredentials" in r)) return;
          r.addEventListener("load", function () {
            if ("text" === t) try {
              n(JSON.parse(r.responseText))
            } catch (e) {
              n(r.responseText)
            } else n(r.response)
          }), r.addEventListener("error", function () {
            throw new Error(r.status)
          }), r.open("GET", e, !0), r.responseType = t, r.send()
        } catch (e) {
          i(e)
        }
      })
    }

    function H(e, t) {
      if (ge.string(e)) {
        var n = ge.string(t),
          i = function () {
            return null !== document.getElementById(t)
          },
          r = function (e, t) {
            e.innerHTML = t, n && i() || document.body.insertAdjacentElement("afterbegin", e)
          };
        if (!n || !i()) {
          var o = Ce.supported,
            a = document.createElement("div");
          if (a.setAttribute("hidden", ""), n && a.setAttribute("id", t), o) {
            var s = window.localStorage.getItem("".concat("cache", "-").concat(t));
            if (null !== s) {
              var l = JSON.parse(s);
              r(a, l.content)
            }
          }
          q(e).then(function (e) {
            ge.empty(e) || (o && window.localStorage.setItem("".concat("cache", "-").concat(t), JSON.stringify({
              content: e
            })), r(a, e))
          }).catch(function () {})
        }
      }
    }

    function B() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
        t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
        n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
      if (!ge.number(e)) return B(null, t, n);
      var i = function (e) {
          return "0".concat(e).slice(-2)
        },
        r = Pe(e),
        o = Ee(e),
        a = Ae(e);
      return r = t || r > 0 ? "".concat(r, ":") : "", "".concat(n && e > 0 ? "-" : "").concat(r).concat(i(o), ":").concat(i(a))
    }

    function V(e) {
      var t = e;
      if (!(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]) {
        var n = document.createElement("a");
        n.href = t, t = n.href
      }
      try {
        return new URL(t)
      } catch (e) {
        return null
      }
    }

    function W(e) {
      var t = new URLSearchParams;
      return ge.object(e) && Object.entries(e).forEach(function (e) {
        var n = r(e, 2),
          i = n[0],
          o = n[1];
        t.set(i, o)
      }), t
    }

    function U() {
      if (this.enabled) {
        var e = this.player.elements.buttons.fullscreen;
        ge.element(e) && (e.pressed = this.active), h.call(this.player, this.target, this.active ? "enterfullscreen" : "exitfullscreen", !0), be.isIos || function () {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
            t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
          if (ge.element(e)) {
            var n = E.call(this, "button:not(:disabled), input:not(:disabled), [tabindex]"),
              i = n[0],
              r = n[n.length - 1];
            l.call(this, this.elements.container, "keydown", function (e) {
              if ("Tab" === e.key && 9 === e.keyCode) {
                var t = document.activeElement;
                t !== r || e.shiftKey ? t === i && e.shiftKey && (r.focus(), e.preventDefault()) : (i.focus(), e.preventDefault())
              }
            }, t, !1)
          }
        }.call(this.player, this.target, this.active)
      }
    }

    function X() {
      var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      if (e ? this.scrollPosition = {
          x: window.scrollX || 0,
          y: window.scrollY || 0
        } : window.scrollTo(this.scrollPosition.x, this.scrollPosition.y), document.body.style.overflow = e ? "hidden" : "", S(this.target, this.player.config.classNames.fullscreen.fallback, e), be.isIos) {
        var t = document.head.querySelector('meta[name="viewport"]'),
          n = "viewport-fit=cover";
        t || (t = document.createElement("meta")).setAttribute("name", "viewport");
        var i = ge.string(t.content) && t.content.includes(n);
        e ? (this.cleanupViewport = !i, i || (t.content += ",".concat(n))) : this.cleanupViewport && (t.content = t.content.split(",").filter(function (e) {
          return e.trim() !== n
        }).join(","))
      }
      U.call(this)
    }

    function z(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
      return new Promise(function (n, i) {
        var r = new Image,
          o = function () {
            delete r.onload, delete r.onerror, (r.naturalWidth >= t ? n : i)(r)
          };
        Object.assign(r, {
          onload: o,
          onerror: o,
          src: e
        })
      })
    }

    function Y(e) {
      return new Promise(function (t, n) {
        qe(e, {
          success: t,
          error: n
        })
      })
    }

    function K(e) {
      e && !this.embed.hasPlayed && (this.embed.hasPlayed = !0), this.media.paused === e && (this.media.paused = !e, h.call(this, this.media, e ? "play" : "pause"))
    }

    function Q(e) {
      e && !this.embed.hasPlayed && (this.embed.hasPlayed = !0), this.media.paused === e && (this.media.paused = !e, h.call(this, this.media, e ? "play" : "pause"))
    }
    var J = {
        addCSS: !0,
        thumbWidth: 15,
        watch: !0
      },
      Z = function (e) {
        return null !== e && void 0 !== e ? e.constructor : null
      },
      ee = function (e, t) {
        return Boolean(e && t && e instanceof t)
      },
      te = function (e) {
        return null === e || void 0 === e
      },
      ne = function (e) {
        return Z(e) === Object
      },
      ie = function (e) {
        return Z(e) === String
      },
      re = function (e) {
        return Array.isArray(e)
      },
      oe = function (e) {
        return ee(e, NodeList)
      },
      ae = {
        nullOrUndefined: te,
        object: ne,
        number: function (e) {
          return Z(e) === Number && !Number.isNaN(e)
        },
        string: ie,
        boolean: function (e) {
          return Z(e) === Boolean
        },
        function: function (e) {
          return Z(e) === Function
        },
        array: re,
        nodeList: oe,
        element: function (e) {
          return ee(e, Element)
        },
        event: function (e) {
          return ee(e, Event)
        },
        empty: function (e) {
          return te(e) || (ie(e) || re(e) || oe(e)) && !e.length || ne(e) && !Object.keys(e).length
        }
      },
      se = function () {
        function t(n, i) {
          e(this, t), ae.element(n) ? this.element = n : ae.string(n) && (this.element = document.querySelector(n)), ae.element(this.element) && ae.empty(this.element.rangeTouch) && (this.config = Object.assign({}, J, i), this.init())
        }
        return n(t, [{
          key: "init",
          value: function () {
            t.enabled && (this.config.addCSS && (this.element.style.userSelect = "none", this.element.style.webKitUserSelect = "none", this.element.style.touchAction = "manipulation"), this.listeners(!0), this.element.rangeTouch = this)
          }
        }, {
          key: "destroy",
          value: function () {
            t.enabled && (this.listeners(!1), this.element.rangeTouch = null)
          }
        }, {
          key: "listeners",
          value: function (e) {
            var t = this,
              n = e ? "addEventListener" : "removeEventListener";
            ["touchstart", "touchmove", "touchend"].forEach(function (e) {
              t.element[n](e, function (e) {
                return t.set(e)
              }, !1)
            })
          }
        }, {
          key: "get",
          value: function (e) {
            if (!t.enabled || !ae.event(e)) return null;
            var n, i = e.target,
              r = e.changedTouches[0],
              o = parseFloat(i.getAttribute("min")) || 0,
              s = parseFloat(i.getAttribute("max")) || 100,
              l = parseFloat(i.getAttribute("step")) || 1,
              u = s - o,
              c = i.getBoundingClientRect(),
              d = 100 / c.width * (this.config.thumbWidth / 2) / 100;
            return (n = 100 / c.width * (r.clientX - c.left)) < 0 ? n = 0 : n > 100 && (n = 100), n < 50 ? n -= (100 - 2 * n) * d : n > 50 && (n += 2 * (n - 50) * d), o + a(u * (n / 100), l)
          }
        }, {
          key: "set",
          value: function (e) {
            t.enabled && ae.event(e) && !e.target.disabled && (e.preventDefault(), e.target.value = this.get(e), function (e, t) {
              if (e && t) {
                var n = new Event(t);
                e.dispatchEvent(n)
              }
            }(e.target, "touchend" === e.type ? "change" : "input"))
          }
        }], [{
          key: "setup",
          value: function (e) {
            var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
              i = null;
            if (ae.empty(e) || ae.string(e) ? i = Array.from(document.querySelectorAll(ae.string(e) ? e : 'input[type="range"]')) : ae.element(e) ? i = [e] : ae.nodeList(e) ? i = Array.from(e) : ae.array(e) && (i = e.filter(ae.element)), ae.empty(i)) return null;
            var r = Object.assign({}, J, n);
            if (ae.string(e) && r.watch) {
              new MutationObserver(function (n) {
                Array.from(n).forEach(function (n) {
                  Array.from(n.addedNodes).forEach(function (n) {
                    if (ae.element(n) && function (e, t) {
                        return function () {
                          return Array.from(document.querySelectorAll(t)).includes(this)
                        }.call(e, t)
                      }(n, e)) new t(n, r)
                  })
                })
              }).observe(document.body, {
                childList: !0,
                subtree: !0
              })
            }
            return i.map(function (e) {
              return new t(e, n)
            })
          }
        }, {
          key: "enabled",
          get: function () {
            return "ontouchstart" in document.documentElement
          }
        }]), t
      }(),
      le = function (e) {
        return null !== e && void 0 !== e ? e.constructor : null
      },
      ue = function (e, t) {
        return Boolean(e && t && e instanceof t)
      },
      ce = function (e) {
        return null === e || void 0 === e
      },
      de = function (e) {
        return le(e) === Object
      },
      he = function (e) {
        return le(e) === String
      },
      pe = function (e) {
        return Array.isArray(e)
      },
      fe = function (e) {
        return ue(e, NodeList)
      },
      me = function (e) {
        return ce(e) || (he(e) || pe(e) || fe(e)) && !e.length || de(e) && !Object.keys(e).length
      },
      ge = {
        nullOrUndefined: ce,
        object: de,
        number: function (e) {
          return le(e) === Number && !Number.isNaN(e)
        },
        string: he,
        boolean: function (e) {
          return le(e) === Boolean
        },
        function: function (e) {
          return le(e) === Function
        },
        array: pe,
        weakMap: function (e) {
          return ue(e, WeakMap)
        },
        nodeList: fe,
        element: function (e) {
          return ue(e, Element)
        },
        textNode: function (e) {
          return le(e) === Text
        },
        event: function (e) {
          return ue(e, Event)
        },
        keyboardEvent: function (e) {
          return ue(e, KeyboardEvent)
        },
        cue: function (e) {
          return ue(e, window.TextTrackCue) || ue(e, window.VTTCue)
        },
        track: function (e) {
          return ue(e, TextTrack) || !ce(e) && he(e.kind)
        },
        promise: function (e) {
          return ue(e, Promise)
        },
        url: function (e) {
          if (ue(e, window.URL)) return !0;
          if (!he(e)) return !1;
          var t = e;
          e.startsWith("http://") && e.startsWith("https://") || (t = "http://".concat(e));
          try {
            return !me(new URL(t).hostname)
          } catch (e) {
            return !1
          }
        },
        empty: me
      },
      ve = function () {
        var e = document.createElement("span"),
          t = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
          },
          n = Object.keys(t).find(function (t) {
            return void 0 !== e.style[t]
          });
        return !!ge.string(n) && t[n]
      }(),
      be = {
        isIE: !!document.documentMode,
        isEdge: window.navigator.userAgent.includes("Edge"),
        isWebkit: "WebkitAppearance" in document.documentElement.style && !/Edge/.test(navigator.userAgent),
        isIPhone: /(iPhone|iPod)/gi.test(navigator.platform),
        isIos: /(iPad|iPhone|iPod)/gi.test(navigator.platform)
      },
      ye = function () {
        var e = !1;
        try {
          var t = Object.defineProperty({}, "passive", {
            get: function () {
              return e = !0, null
            }
          });
          window.addEventListener("test", null, t), window.removeEventListener("test", null, t)
        } catch (e) {}
        return e
      }(),
      we = {
        "audio/ogg": "vorbis",
        "audio/wav": "1",
        "video/webm": "vp8, vorbis",
        "video/mp4": "avc1.42E01E, mp4a.40.2",
        "video/ogg": "theora"
      },
      ke = {
        audio: "canPlayType" in document.createElement("audio"),
        video: "canPlayType" in document.createElement("video"),
        check: function (e, t, n) {
          var i = be.isIPhone && n && ke.playsinline,
            r = ke[e] || "html5" !== t;
          return {
            api: r,
            ui: r && ke.rangeInput && ("video" !== e || !be.isIPhone || i)
          }
        },
        pip: !be.isIPhone && (!!ge.function(v("video").webkitSetPresentationMode) || !(!document.pictureInPictureEnabled || v("video").disablePictureInPicture)),
        airplay: ge.function(window.WebKitPlaybackTargetAvailabilityEvent),
        playsinline: "playsInline" in document.createElement("video"),
        mime: function (e) {
          if (ge.empty(e)) return !1;
          var t = r(e.split("/"), 1)[0],
            n = e;
          if (!this.isHTML5 || t !== this.type) return !1;
          Object.keys(we).includes(n) && (n += '; codecs="'.concat(we[e], '"'));
          try {
            return Boolean(n && this.media.canPlayType(n).replace(/no/, ""))
          } catch (e) {
            return !1
          }
        },
        textTracks: "textTracks" in document.createElement("video"),
        rangeInput: function () {
          var e = document.createElement("input");
          return e.type = "range", "range" === e.type
        }(),
        touch: "ontouchstart" in document.documentElement,
        transitions: !1 !== ve,
        reducedMotion: "matchMedia" in window && window.matchMedia("(prefers-reduced-motion)").matches
      },
      Te = {
        getSources: function () {
          var e = this;
          if (!this.isHTML5) return [];
          return Array.from(this.media.querySelectorAll("source")).filter(function (t) {
            var n = t.getAttribute("type");
            return !!ge.empty(n) || ke.mime.call(e, n)
          })
        },
        getQualityOptions: function () {
          return Te.getSources.call(this).map(function (e) {
            return Number(e.getAttribute("size"))
          }).filter(Boolean)
        },
        extend: function () {
          if (this.isHTML5) {
            var e = this;
            ge.empty(this.config.ratio) || G.call(e), Object.defineProperty(e.media, "quality", {
              get: function () {
                var t = Te.getSources.call(e).find(function (t) {
                  return t.getAttribute("src") === e.source
                });
                return t && Number(t.getAttribute("size"))
              },
              set: function (t) {
                var n = Te.getSources.call(e).find(function (e) {
                  return Number(e.getAttribute("size")) === t
                });
                if (n) {
                  var i = e.media,
                    r = i.currentTime,
                    o = i.paused,
                    a = i.preload,
                    s = i.readyState;
                  e.media.src = n.getAttribute("src"), ("none" !== a || s) && (e.once("loadedmetadata", function () {
                    e.currentTime = r, o || e.play()
                  }), e.media.load()), h.call(e, e.media, "qualitychange", !1, {
                    quality: t
                  })
                }
              }
            })
          }
        },
        cancelRequests: function () {
          this.isHTML5 && (y(Te.getSources.call(this)), this.media.setAttribute("src", this.config.blankVideo), this.media.load(), this.debug.log("Cancelled network requests"))
        }
      },
      xe = {
        pip: "PIP",
        airplay: "AirPlay",
        html5: "HTML5",
        vimeo: "Vimeo",
        youtube: "YouTube"
      },
      Se = {
        get: function () {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
            t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          if (ge.empty(e) || ge.empty(t)) return "";
          var n = p(t.i18n, e);
          if (ge.empty(n)) return Object.keys(xe).includes(e) ? xe[e] : "";
          var i = {
            "{seektime}": t.seekTime,
            "{title}": t.title
          };
          return Object.entries(i).forEach(function (e) {
            var t = r(e, 2),
              i = t[0],
              o = t[1];
            n = O(n, i, o)
          }), n
        }
      },
      Ce = function () {
        function t(n) {
          e(this, t), this.enabled = n.config.storage.enabled, this.key = n.config.storage.key
        }
        return n(t, [{
          key: "get",
          value: function (e) {
            if (!t.supported || !this.enabled) return null;
            var n = window.localStorage.getItem(this.key);
            if (ge.empty(n)) return null;
            var i = JSON.parse(n);
            return ge.string(e) && e.length ? i[e] : i
          }
        }, {
          key: "set",
          value: function (e) {
            if (t.supported && this.enabled && ge.object(e)) {
              var n = this.get();
              ge.empty(n) && (n = {}), f(n, e), window.localStorage.setItem(this.key, JSON.stringify(n))
            }
          }
        }], [{
          key: "supported",
          get: function () {
            try {
              if (!("localStorage" in window)) return !1;
              return window.localStorage.setItem("___test", "___test"), window.localStorage.removeItem("___test"), !0
            } catch (e) {
              return !1
            }
          }
        }]), t
      }(),
      Pe = function (e) {
        return Math.trunc(e / 60 / 60 % 60, 10)
      },
      Ee = function (e) {
        return Math.trunc(e / 60 % 60, 10)
      },
      Ae = function (e) {
        return Math.trunc(e % 60, 10)
      },
      Ie = {
        getIconUrl: function () {
          var e = new URL(this.config.iconUrl, window.location).host !== window.location.host || be.isIE && !window.svg4everybody;
          return {
            url: this.config.iconUrl,
            cors: e
          }
        },
        findElements: function () {
          try {
            return this.elements.controls = A.call(this, this.config.selectors.controls.wrapper), this.elements.buttons = {
              play: E.call(this, this.config.selectors.buttons.play),
              pause: A.call(this, this.config.selectors.buttons.pause),
              restart: A.call(this, this.config.selectors.buttons.restart),
              rewind: A.call(this, this.config.selectors.buttons.rewind),
              fastForward: A.call(this, this.config.selectors.buttons.fastForward),
              mute: A.call(this, this.config.selectors.buttons.mute),
              pip: A.call(this, this.config.selectors.buttons.pip),
              airplay: A.call(this, this.config.selectors.buttons.airplay),
              settings: A.call(this, this.config.selectors.buttons.settings),
              captions: A.call(this, this.config.selectors.buttons.captions),
              fullscreen: A.call(this, this.config.selectors.buttons.fullscreen)
            }, this.elements.progress = A.call(this, this.config.selectors.progress), this.elements.inputs = {
              seek: A.call(this, this.config.selectors.inputs.seek),
              volume: A.call(this, this.config.selectors.inputs.volume)
            }, this.elements.display = {
              buffer: A.call(this, this.config.selectors.display.buffer),
              currentTime: A.call(this, this.config.selectors.display.currentTime),
              duration: A.call(this, this.config.selectors.display.duration)
            }, ge.element(this.elements.progress) && (this.elements.display.seekTooltip = this.elements.progress.querySelector(".".concat(this.config.classNames.tooltip))), !0
          } catch (e) {
            return this.debug.warn("It looks like there is a problem with your custom controls HTML", e), this.toggleNativeControls(!0), !1
          }
        },
        createIcon: function (e, t) {
          var n = Ie.getIconUrl.call(this),
            i = "".concat(n.cors ? "" : n.url, "#").concat(this.config.iconPrefix),
            r = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          g(r, f(t, {
            role: "presentation",
            focusable: "false"
          }));
          var o = document.createElementNS("http://www.w3.org/2000/svg", "use"),
            a = "".concat(i, "-").concat(e);
          return "href" in o && o.setAttributeNS("http://www.w3.org/1999/xlink", "href", a), o.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", a), r.appendChild(o), r
        },
        createLabel: function (e) {
          var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            n = Se.get(e, this.config);
          return v("span", Object.assign({}, t, {
            class: [t.class, this.config.classNames.hidden].filter(Boolean).join(" ")
          }), n)
        },
        createBadge: function (e) {
          if (ge.empty(e)) return null;
          var t = v("span", {
            class: this.config.classNames.menu.value
          });
          return t.appendChild(v("span", {
            class: this.config.classNames.menu.badge
          }, e)), t
        },
        createButton: function (e, t) {
          var n = this,
            i = f({}, t),
            r = j(e),
            o = {
              element: "button",
              toggle: !1,
              label: null,
              icon: null,
              labelPressed: null,
              iconPressed: null
            };
          switch (["element", "icon", "label"].forEach(function (e) {
            Object.keys(i).includes(e) && (o[e] = i[e], delete i[e])
          }), "button" !== o.element || Object.keys(i).includes("type") || (i.type = "button"), Object.keys(i).includes("class") ? i.class.split(" ").some(function (e) {
            return e === n.config.classNames.control
          }) || f(i, {
            class: "".concat(i.class, " ").concat(this.config.classNames.control)
          }) : i.class = this.config.classNames.control, e) {
            case "play":
              o.toggle = !0, o.label = "play", o.labelPressed = "pause", o.icon = "play", o.iconPressed = "pause";
              break;
            case "mute":
              o.toggle = !0, o.label = "mute", o.labelPressed = "unmute", o.icon = "volume", o.iconPressed = "muted";
              break;
            case "captions":
              o.toggle = !0, o.label = "enableCaptions", o.labelPressed = "disableCaptions", o.icon = "captions-off", o.iconPressed = "captions-on";
              break;
            case "fullscreen":
              o.toggle = !0, o.label = "enterFullscreen", o.labelPressed = "exitFullscreen", o.icon = "enter-fullscreen", o.iconPressed = "exit-fullscreen";
              break;
            case "play-large":
              i.class += " ".concat(this.config.classNames.control, "--overlaid"), r = "play", o.label = "play", o.icon = "play";
              break;
            default:
              ge.empty(o.label) && (o.label = r), ge.empty(o.icon) && (o.icon = e)
          }
          var a = v(o.element);
          return o.toggle ? (a.appendChild(Ie.createIcon.call(this, o.iconPressed, {
            class: "icon--pressed"
          })), a.appendChild(Ie.createIcon.call(this, o.icon, {
            class: "icon--not-pressed"
          })), a.appendChild(Ie.createLabel.call(this, o.labelPressed, {
            class: "label--pressed"
          })), a.appendChild(Ie.createLabel.call(this, o.label, {
            class: "label--not-pressed"
          }))) : (a.appendChild(Ie.createIcon.call(this, o.icon)), a.appendChild(Ie.createLabel.call(this, o.label))), f(i, T(this.config.selectors.buttons[r], i)), g(a, i), "play" === r ? (ge.array(this.elements.buttons[r]) || (this.elements.buttons[r] = []), this.elements.buttons[r].push(a)) : this.elements.buttons[r] = a, a
        },
        createRange: function (e, t) {
          var n = v("input", f(T(this.config.selectors.inputs[e]), {
            type: "range",
            min: 0,
            max: 100,
            step: .01,
            value: 0,
            autocomplete: "off",
            role: "slider",
            "aria-label": Se.get(e, this.config),
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            "aria-valuenow": 0
          }, t));
          return this.elements.inputs[e] = n, Ie.updateRangeFill.call(this, n), se.setup(n), n
        },
        createProgress: function (e, t) {
          var n = v("progress", f(T(this.config.selectors.display[e]), {
            min: 0,
            max: 100,
            value: 0,
            role: "progressbar",
            "aria-hidden": !0
          }, t));
          if ("volume" !== e) {
            n.appendChild(v("span", null, "0"));
            var i = {
                played: "played",
                buffer: "buffered"
              } [e],
              r = i ? Se.get(i, this.config) : "";
            n.innerText = "% ".concat(r.toLowerCase())
          }
          return this.elements.display[e] = n, n
        },
        createTime: function (e, t) {
          var n = T(this.config.selectors.display[e], t),
            i = v("div", f(n, {
              class: "".concat(n.class ? n.class : "", " ").concat(this.config.classNames.display.time, " ").trim(),
              "aria-label": Se.get(e, this.config)
            }), "00:00");
          return this.elements.display[e] = i, i
        },
        bindMenuItemShortcuts: function (e, t) {
          var n = this;
          u(e, "keydown keyup", function (i) {
            if ([32, 38, 39, 40].includes(i.which) && (i.preventDefault(), i.stopPropagation(), "keydown" !== i.type)) {
              var r = P(e, '[role="menuitemradio"]');
              if (!r && [32, 39].includes(i.which)) Ie.showMenuPanel.call(n, t, !0);
              else {
                var o;
                32 !== i.which && (40 === i.which || r && 39 === i.which ? (o = e.nextElementSibling, ge.element(o) || (o = e.parentNode.firstElementChild)) : (o = e.previousElementSibling, ge.element(o) || (o = e.parentNode.lastElementChild)), I.call(n, o, !0))
              }
            }
          }, !1), u(e, "keyup", function (e) {
            13 === e.which && Ie.focusFirstMenuItem.call(n, null, !0)
          })
        },
        createMenuItem: function (e) {
          var t = this,
            n = e.value,
            i = e.list,
            r = e.type,
            o = e.title,
            a = e.badge,
            s = void 0 === a ? null : a,
            l = e.checked,
            u = void 0 !== l && l,
            c = T(this.config.selectors.inputs[r]),
            d = v("button", f(c, {
              type: "button",
              role: "menuitemradio",
              class: "".concat(this.config.classNames.control, " ").concat(c.class ? c.class : "").trim(),
              "aria-checked": u,
              value: n
            })),
            h = v("span");
          h.innerHTML = o, ge.element(s) && h.appendChild(s), d.appendChild(h), Object.defineProperty(d, "checked", {
            enumerable: !0,
            get: function () {
              return "true" === d.getAttribute("aria-checked")
            },
            set: function (e) {
              e && Array.from(d.parentNode.children).filter(function (e) {
                return P(e, '[role="menuitemradio"]')
              }).forEach(function (e) {
                return e.setAttribute("aria-checked", "false")
              }), d.setAttribute("aria-checked", e ? "true" : "false")
            }
          }), this.listeners.bind(d, "click keyup", function (e) {
            if (!ge.keyboardEvent(e) || 32 === e.which) {
              switch (e.preventDefault(), e.stopPropagation(), d.checked = !0, r) {
                case "language":
                  t.currentTrack = Number(n);
                  break;
                case "quality":
                  t.quality = n;
                  break;
                case "speed":
                  t.speed = parseFloat(n)
              }
              Ie.showMenuPanel.call(t, "home", ge.keyboardEvent(e))
            }
          }, r, !1), Ie.bindMenuItemShortcuts.call(this, d, r), i.appendChild(d)
        },
        formatTime: function () {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
            t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
          if (!ge.number(e)) return e;
          return B(e, Pe(this.duration) > 0, t)
        },
        updateTimeDisplay: function () {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
            t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
            n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
          ge.element(e) && ge.number(t) && (e.innerText = Ie.formatTime(t, n))
        },
        updateVolume: function () {
          this.supported.ui && (ge.element(this.elements.inputs.volume) && Ie.setRange.call(this, this.elements.inputs.volume, this.muted ? 0 : this.volume), ge.element(this.elements.buttons.mute) && (this.elements.buttons.mute.pressed = this.muted || 0 === this.volume))
        },
        setRange: function (e) {
          var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
          ge.element(e) && (e.value = t, Ie.updateRangeFill.call(this, e))
        },
        updateProgress: function (e) {
          var t = this;
          if (this.supported.ui && ge.event(e)) {
            var n = 0;
            if (e) switch (e.type) {
              case "timeupdate":
              case "seeking":
              case "seeked":
                n = function (e, t) {
                  return 0 === e || 0 === t || Number.isNaN(e) || Number.isNaN(t) ? 0 : (e / t * 100).toFixed(2)
                }(this.currentTime, this.duration), "timeupdate" === e.type && Ie.setRange.call(this, this.elements.inputs.seek, n);
                break;
              case "playing":
              case "progress":
                ! function (e, n) {
                  var i = ge.number(n) ? n : 0,
                    r = ge.element(e) ? e : t.elements.display.buffer;
                  if (ge.element(r)) {
                    r.value = i;
                    var o = r.getElementsByTagName("span")[0];
                    ge.element(o) && (o.childNodes[0].nodeValue = i)
                  }
                }(this.elements.display.buffer, 100 * this.buffered)
            }
          }
        },
        updateRangeFill: function (e) {
          var t = ge.event(e) ? e.target : e;
          if (ge.element(t) && "range" === t.getAttribute("type")) {
            if (P(t, this.config.selectors.inputs.seek)) {
              t.setAttribute("aria-valuenow", this.currentTime);
              var n = Ie.formatTime(this.currentTime),
                i = Ie.formatTime(this.duration),
                r = Se.get("seekLabel", this.config);
              t.setAttribute("aria-valuetext", r.replace("{currentTime}", n).replace("{duration}", i))
            } else if (P(t, this.config.selectors.inputs.volume)) {
              var o = 100 * t.value;
              t.setAttribute("aria-valuenow", o), t.setAttribute("aria-valuetext", "".concat(o.toFixed(1), "%"))
            } else t.setAttribute("aria-valuenow", t.value);
            be.isWebkit && t.style.setProperty("--value", "".concat(t.value / t.max * 100, "%"))
          }
        },
        updateSeekTooltip: function (e) {
          var t = this;
          if (this.config.tooltips.seek && ge.element(this.elements.inputs.seek) && ge.element(this.elements.display.seekTooltip) && 0 !== this.duration) {
            var n = "".concat(this.config.classNames.tooltip, "--visible"),
              i = function (e) {
                return S(t.elements.display.seekTooltip, n, e)
              };
            if (this.touch) i(!1);
            else {
              var r = 0,
                o = this.elements.progress.getBoundingClientRect();
              if (ge.event(e)) r = 100 / o.width * (e.pageX - o.left);
              else {
                if (!C(this.elements.display.seekTooltip, n)) return;
                r = parseFloat(this.elements.display.seekTooltip.style.left, 10)
              }
              r < 0 ? r = 0 : r > 100 && (r = 100), Ie.updateTimeDisplay.call(this, this.elements.display.seekTooltip, this.duration / 100 * r), this.elements.display.seekTooltip.style.left = "".concat(r, "%"), ge.event(e) && ["mouseenter", "mouseleave"].includes(e.type) && i("mouseenter" === e.type)
            }
          }
        },
        timeUpdate: function (e) {
          var t = !ge.element(this.elements.display.duration) && this.config.invertTime;
          Ie.updateTimeDisplay.call(this, this.elements.display.currentTime, t ? this.duration - this.currentTime : this.currentTime, t), e && "timeupdate" === e.type && this.media.seeking || Ie.updateProgress.call(this, e)
        },
        durationUpdate: function () {
          if (this.supported.ui && (this.config.invertTime || !this.currentTime)) {
            if (this.duration >= Math.pow(2, 32)) return x(this.elements.display.currentTime, !0), void x(this.elements.progress, !0);
            ge.element(this.elements.inputs.seek) && this.elements.inputs.seek.setAttribute("aria-valuemax", this.duration);
            var e = ge.element(this.elements.display.duration);
            !e && this.config.displayDuration && this.paused && Ie.updateTimeDisplay.call(this, this.elements.display.currentTime, this.duration), e && Ie.updateTimeDisplay.call(this, this.elements.display.duration, this.duration), Ie.updateSeekTooltip.call(this)
          }
        },
        toggleMenuButton: function (e, t) {
          x(this.elements.settings.buttons[e], !t)
        },
        updateSetting: function (e, t, n) {
          var i = this.elements.settings.panels[e],
            r = null,
            o = t;
          if ("captions" === e) r = this.currentTrack;
          else {
            if (r = ge.empty(n) ? this[e] : n, ge.empty(r) && (r = this.config[e].default), !ge.empty(this.options[e]) && !this.options[e].includes(r)) return void this.debug.warn("Unsupported value of '".concat(r, "' for ").concat(e));
            if (!this.config[e].options.includes(r)) return void this.debug.warn("Disabled value of '".concat(r, "' for ").concat(e))
          }
          if (ge.element(o) || (o = i && i.querySelector('[role="menu"]')), ge.element(o)) {
            this.elements.settings.buttons[e].querySelector(".".concat(this.config.classNames.menu.value)).innerHTML = Ie.getLabel.call(this, e, r);
            var a = o && o.querySelector('[value="'.concat(r, '"]'));
            ge.element(a) && (a.checked = !0)
          }
        },
        getLabel: function (e, t) {
          switch (e) {
            case "speed":
              return 1 === t ? Se.get("normal", this.config) : "".concat(t, "&times;");
            case "quality":
              if (ge.number(t)) {
                var n = Se.get("qualityLabel.".concat(t), this.config);
                return n.length ? n : "".concat(t, "p")
              }
              return F(t);
            case "captions":
              return De.getLabel.call(this);
            default:
              return null
          }
        },
        setQualityMenu: function (e) {
          var t = this;
          if (ge.element(this.elements.settings.panels.quality)) {
            var n = this.elements.settings.panels.quality.querySelector('[role="menu"]');
            ge.array(e) && (this.options.quality = _(e).filter(function (e) {
              return t.config.quality.options.includes(e)
            }));
            var i = !ge.empty(this.options.quality) && this.options.quality.length > 1;
            if (Ie.toggleMenuButton.call(this, "quality", i), w(n), Ie.checkMenu.call(this), i) {
              this.options.quality.sort(function (e, n) {
                var i = t.config.quality.options;
                return i.indexOf(e) > i.indexOf(n) ? 1 : -1
              }).forEach(function (e) {
                Ie.createMenuItem.call(t, {
                  value: e,
                  list: n,
                  type: "quality",
                  title: Ie.getLabel.call(t, "quality", e),
                  badge: function (e) {
                    var n = Se.get("qualityBadge.".concat(e), t.config);
                    return n.length ? Ie.createBadge.call(t, n) : null
                  }(e)
                })
              }), Ie.updateSetting.call(this, "quality", n)
            }
          }
        },
        setCaptionsMenu: function () {
          var e = this;
          if (ge.element(this.elements.settings.panels.captions)) {
            var t = this.elements.settings.panels.captions.querySelector('[role="menu"]'),
              n = De.getTracks.call(this),
              i = Boolean(n.length);
            if (Ie.toggleMenuButton.call(this, "captions", i), w(t), Ie.checkMenu.call(this), i) {
              var r = n.map(function (n, i) {
                return {
                  value: i,
                  checked: e.captions.toggled && e.currentTrack === i,
                  title: De.getLabel.call(e, n),
                  badge: n.language && Ie.createBadge.call(e, n.language.toUpperCase()),
                  list: t,
                  type: "language"
                }
              });
              r.unshift({
                value: -1,
                checked: !this.captions.toggled,
                title: Se.get("disabled", this.config),
                list: t,
                type: "language"
              }), r.forEach(Ie.createMenuItem.bind(this)), Ie.updateSetting.call(this, "captions", t)
            }
          }
        },
        setSpeedMenu: function (e) {
          var t = this;
          if (ge.element(this.elements.settings.panels.speed)) {
            var n = this.elements.settings.panels.speed.querySelector('[role="menu"]');
            ge.array(e) ? this.options.speed = e : (this.isHTML5 || this.isVimeo) && (this.options.speed = [.5, .75, 1, 1.25, 1.5, 1.75, 2]), this.options.speed = this.options.speed.filter(function (e) {
              return t.config.speed.options.includes(e)
            });
            var i = !ge.empty(this.options.speed) && this.options.speed.length > 1;
            Ie.toggleMenuButton.call(this, "speed", i), w(n), Ie.checkMenu.call(this), i && (this.options.speed.forEach(function (e) {
              Ie.createMenuItem.call(t, {
                value: e,
                list: n,
                type: "speed",
                title: Ie.getLabel.call(t, "speed", e)
              })
            }), Ie.updateSetting.call(this, "speed", n))
          }
        },
        checkMenu: function () {
          var e = this.elements.settings.buttons,
            t = !ge.empty(e) && Object.values(e).some(function (e) {
              return !e.hidden
            });
          x(this.elements.settings.menu, !t)
        },
        focusFirstMenuItem: function (e) {
          var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
          if (!this.elements.settings.popup.hidden) {
            var n = e;
            ge.element(n) || (n = Object.values(this.elements.settings.panels).find(function (e) {
              return !e.hidden
            }));
            var i = n.querySelector('[role^="menuitem"]');
            I.call(this, i, t)
          }
        },
        toggleMenu: function (e) {
          var t = this.elements.settings.popup,
            n = this.elements.buttons.settings;
          if (ge.element(t) && ge.element(n)) {
            var i = t.hidden,
              r = i;
            if (ge.boolean(e)) r = e;
            else if (ge.keyboardEvent(e) && 27 === e.which) r = !1;
            else if (ge.event(e)) {
              var o = ge.function(e.composedPath) ? e.composedPath()[0] : e.target,
                a = t.contains(o);
              if (a || !a && e.target !== n && r) return
            }
            n.setAttribute("aria-expanded", r), x(t, !r), S(this.elements.container, this.config.classNames.menu.open, r), r && ge.keyboardEvent(e) ? Ie.focusFirstMenuItem.call(this, null, !0) : r || i || I.call(this, n, ge.keyboardEvent(e))
          }
        },
        getMenuSize: function (e) {
          var t = e.cloneNode(!0);
          t.style.position = "absolute", t.style.opacity = 0, t.removeAttribute("hidden"), e.parentNode.appendChild(t);
          var n = t.scrollWidth,
            i = t.scrollHeight;
          return y(t), {
            width: n,
            height: i
          }
        },
        showMenuPanel: function () {
          var e = this,
            t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
            n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
            i = this.elements.container.querySelector("#plyr-settings-".concat(this.id, "-").concat(t));
          if (ge.element(i)) {
            var r = i.parentNode,
              o = Array.from(r.children).find(function (e) {
                return !e.hidden
              });
            if (ke.transitions && !ke.reducedMotion) {
              r.style.width = "".concat(o.scrollWidth, "px"), r.style.height = "".concat(o.scrollHeight, "px");
              var a = Ie.getMenuSize.call(this, i),
                s = function t(n) {
                  n.target === r && ["width", "height"].includes(n.propertyName) && (r.style.width = "", r.style.height = "", c.call(e, r, ve, t))
                };
              u.call(this, r, ve, s), r.style.width = "".concat(a.width, "px"), r.style.height = "".concat(a.height, "px")
            }
            x(o, !0), x(i, !1), Ie.focusFirstMenuItem.call(this, i, n)
          }
        },
        setDownloadUrl: function () {
          var e = this.elements.buttons.download;
          ge.element(e) && e.setAttribute("href", this.download)
        },
        create: function (e) {
          var t = this,
            n = Ie.bindMenuItemShortcuts,
            i = Ie.createButton,
            r = Ie.createProgress,
            o = Ie.createRange,
            a = Ie.createTime,
            s = Ie.setQualityMenu,
            l = Ie.setSpeedMenu,
            c = Ie.showMenuPanel;
          this.elements.controls = null, this.config.controls.includes("play-large") && this.elements.container.appendChild(i.call(this, "play-large"));
          var d = v("div", T(this.config.selectors.controls.wrapper));
          this.elements.controls = d;
          var h = {
            class: "plyr__controls__item"
          };
          return _(this.config.controls).forEach(function (s) {
            if ("restart" === s && d.appendChild(i.call(t, "restart", h)), "rewind" === s && d.appendChild(i.call(t, "rewind", h)), "play" === s && d.appendChild(i.call(t, "play", h)), "fast-forward" === s && d.appendChild(i.call(t, "fast-forward", h)), "progress" === s) {
              var l = v("div", {
                  class: "".concat(h.class, " plyr__progress__container")
                }),
                p = v("div", T(t.config.selectors.progress));
              if (p.appendChild(o.call(t, "seek", {
                  id: "plyr-seek-".concat(e.id)
                })), p.appendChild(r.call(t, "buffer")), t.config.tooltips.seek) {
                var m = v("span", {
                  class: t.config.classNames.tooltip
                }, "00:00");
                p.appendChild(m), t.elements.display.seekTooltip = m
              }
              t.elements.progress = p, l.appendChild(t.elements.progress), d.appendChild(l)
            }
            if ("current-time" === s && d.appendChild(a.call(t, "currentTime", h)), "duration" === s && d.appendChild(a.call(t, "duration", h)), "mute" === s || "volume" === s) {
              var g = t.elements.volume;
              if (ge.element(g) && d.contains(g) || (g = v("div", f({}, h, {
                  class: "".concat(h.class, " plyr__volume").trim()
                })), t.elements.volume = g, d.appendChild(g)), "mute" === s && g.appendChild(i.call(t, "mute")), "volume" === s) {
                var b = {
                  max: 1,
                  step: .05,
                  value: t.config.volume
                };
                g.appendChild(o.call(t, "volume", f(b, {
                  id: "plyr-volume-".concat(e.id)
                })))
              }
            }
            if ("captions" === s && d.appendChild(i.call(t, "captions", h)), "settings" === s && !ge.empty(t.config.settings)) {
              var y = v("div", f({}, h, {
                class: "".concat(h.class, " plyr__menu").trim(),
                hidden: ""
              }));
              y.appendChild(i.call(t, "settings", {
                "aria-haspopup": !0,
                "aria-controls": "plyr-settings-".concat(e.id),
                "aria-expanded": !1
              }));
              var w = v("div", {
                  class: "plyr__menu__container",
                  id: "plyr-settings-".concat(e.id),
                  hidden: ""
                }),
                k = v("div"),
                x = v("div", {
                  id: "plyr-settings-".concat(e.id, "-home")
                }),
                S = v("div", {
                  role: "menu"
                });
              x.appendChild(S), k.appendChild(x), t.elements.settings.panels.home = x, t.config.settings.forEach(function (i) {
                var r = v("button", f(T(t.config.selectors.buttons.settings), {
                  type: "button",
                  class: "".concat(t.config.classNames.control, " ").concat(t.config.classNames.control, "--forward"),
                  role: "menuitem",
                  "aria-haspopup": !0,
                  hidden: ""
                }));
                n.call(t, r, i), u(r, "click", function () {
                  c.call(t, i, !1)
                });
                var o = v("span", null, Se.get(i, t.config)),
                  a = v("span", {
                    class: t.config.classNames.menu.value
                  });
                a.innerHTML = e[i], o.appendChild(a), r.appendChild(o), S.appendChild(r);
                var s = v("div", {
                    id: "plyr-settings-".concat(e.id, "-").concat(i),
                    hidden: ""
                  }),
                  l = v("button", {
                    type: "button",
                    class: "".concat(t.config.classNames.control, " ").concat(t.config.classNames.control, "--back")
                  });
                l.appendChild(v("span", {
                  "aria-hidden": !0
                }, Se.get(i, t.config))), l.appendChild(v("span", {
                  class: t.config.classNames.hidden
                }, Se.get("menuBack", t.config))), u(s, "keydown", function (e) {
                  37 === e.which && (e.preventDefault(), e.stopPropagation(), c.call(t, "home", !0))
                }, !1), u(l, "click", function () {
                  c.call(t, "home", !1)
                }), s.appendChild(l), s.appendChild(v("div", {
                  role: "menu"
                })), k.appendChild(s), t.elements.settings.buttons[i] = r, t.elements.settings.panels[i] = s
              }), w.appendChild(k), y.appendChild(w), d.appendChild(y), t.elements.settings.popup = w, t.elements.settings.menu = y
            }
            if ("pip" === s && ke.pip && d.appendChild(i.call(t, "pip", h)), "airplay" === s && ke.airplay && d.appendChild(i.call(t, "airplay", h)), "download" === s) {
              var C = f({}, h, {
                  element: "a",
                  href: t.download,
                  target: "_blank"
                }),
                P = t.config.urls.download;
              !ge.url(P) && t.isEmbed && f(C, {
                icon: "logo-".concat(t.provider),
                label: t.provider
              }), d.appendChild(i.call(t, "download", C))
            }
            "fullscreen" === s && d.appendChild(i.call(t, "fullscreen", h))
          }), this.isHTML5 && s.call(this, Te.getQualityOptions.call(this)), l.call(this), d
        },
        inject: function () {
          var e = this;
          if (this.config.loadSprite) {
            var t = Ie.getIconUrl.call(this);
            t.cors && H(t.url, "sprite-plyr")
          }
          this.id = Math.floor(1e4 * Math.random());
          var n = null;
          this.elements.controls = null;
          var i = {
              id: this.id,
              seektime: this.config.seekTime,
              title: this.config.title
            },
            o = !0;
          ge.function(this.config.controls) && (this.config.controls = this.config.controls.call(this, i)), this.config.controls || (this.config.controls = []), ge.element(this.config.controls) || ge.string(this.config.controls) ? n = this.config.controls : (n = Ie.create.call(this, {
            id: this.id,
            seektime: this.config.seekTime,
            speed: this.speed,
            quality: this.quality,
            captions: De.getLabel.call(this)
          }), o = !1);
          var a = function (e) {
            var t = e;
            return Object.entries(i).forEach(function (e) {
              var n = r(e, 2),
                i = n[0],
                o = n[1];
              t = O(t, "{".concat(i, "}"), o)
            }), t
          };
          o && (ge.string(this.config.controls) ? n = a(n) : ge.element(n) && (n.innerHTML = a(n.innerHTML)));
          var l;
          ge.string(this.config.selectors.controls.container) && (l = document.querySelector(this.config.selectors.controls.container)), ge.element(l) || (l = this.elements.container);
          if (l[ge.element(n) ? "insertAdjacentElement" : "insertAdjacentHTML"]("afterbegin", n), ge.element(this.elements.controls) || Ie.findElements.call(this), !ge.empty(this.elements.buttons)) {
            var u = function (t) {
              var n = e.config.classNames.controlPressed;
              Object.defineProperty(t, "pressed", {
                enumerable: !0,
                get: function () {
                  return C(t, n)
                },
                set: function () {
                  var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                  S(t, n, e)
                }
              })
            };
            Object.values(this.elements.buttons).filter(Boolean).forEach(function (e) {
              ge.array(e) || ge.nodeList(e) ? Array.from(e).filter(Boolean).forEach(u) : u(e)
            })
          }
          if (be.isEdge && s(l), this.config.tooltips.controls) {
            var c = this.config,
              d = c.classNames,
              h = c.selectors,
              p = "".concat(h.controls.wrapper, " ").concat(h.labels, " .").concat(d.hidden),
              f = E.call(this, p);
            Array.from(f).forEach(function (t) {
              S(t, e.config.classNames.hidden, !1), S(t, e.config.classNames.tooltip, !0)
            })
          }
        }
      },
      De = {
        setup: function () {
          if (this.supported.ui)
            if (!this.isVideo || this.isYouTube || this.isHTML5 && !ke.textTracks) ge.array(this.config.controls) && this.config.controls.includes("settings") && this.config.settings.includes("captions") && Ie.setCaptionsMenu.call(this);
            else {
              if (ge.element(this.elements.captions) || (this.elements.captions = v("div", T(this.config.selectors.captions)), function (e, t) {
                  ge.element(e) && ge.element(t) && t.parentNode.insertBefore(e, t.nextSibling)
                }(this.elements.captions, this.elements.wrapper)), be.isIE && window.URL) {
                var e = this.media.querySelectorAll("track");
                Array.from(e).forEach(function (e) {
                  var t = e.getAttribute("src"),
                    n = V(t);
                  null !== n && n.hostname !== window.location.href.hostname && ["http:", "https:"].includes(n.protocol) && q(t, "blob").then(function (t) {
                    e.setAttribute("src", window.URL.createObjectURL(t))
                  }).catch(function () {
                    y(e)
                  })
                })
              }
              var t = _((navigator.languages || [navigator.language || navigator.userLanguage || "en"]).map(function (e) {
                  return e.split("-")[0]
                })),
                n = (this.storage.get("language") || this.config.captions.language || "auto").toLowerCase();
              if ("auto" === n) {
                n = r(t, 1)[0]
              }
              var i = this.storage.get("captions");
              if (ge.boolean(i) || (i = this.config.captions.active), Object.assign(this.captions, {
                  toggled: !1,
                  active: i,
                  language: n,
                  languages: t
                }), this.isHTML5) {
                var o = this.config.captions.update ? "addtrack removetrack" : "removetrack";
                u.call(this, this.media.textTracks, o, De.update.bind(this))
              }
              setTimeout(De.update.bind(this), 0)
            }
        },
        update: function () {
          var e = this,
            t = De.getTracks.call(this, !0),
            n = this.captions,
            i = n.active,
            r = n.language,
            o = n.meta,
            a = n.currentTrackNode,
            s = Boolean(t.find(function (e) {
              return e.language === r
            }));
          this.isHTML5 && this.isVideo && t.filter(function (e) {
            return !o.get(e)
          }).forEach(function (t) {
            e.debug.log("Track added", t), o.set(t, {
              default: "showing" === t.mode
            }), t.mode = "hidden", u.call(e, t, "cuechange", function () {
              return De.updateCues.call(e)
            })
          }), (s && this.language !== r || !t.includes(a)) && (De.setLanguage.call(this, r), De.toggle.call(this, i && s)), S(this.elements.container, this.config.classNames.captions.enabled, !ge.empty(t)), (this.config.controls || []).includes("settings") && this.config.settings.includes("captions") && Ie.setCaptionsMenu.call(this)
        },
        toggle: function (e) {
          var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
          if (this.supported.ui) {
            var n = this.captions.toggled,
              i = this.config.classNames.captions.active,
              r = ge.nullOrUndefined(e) ? !n : e;
            if (r !== n) {
              if (t || (this.captions.active = r, this.storage.set({
                  captions: r
                })), !this.language && r && !t) {
                var a = De.getTracks.call(this),
                  s = De.findTrack.call(this, [this.captions.language].concat(o(this.captions.languages)), !0);
                return this.captions.language = s.language, void De.set.call(this, a.indexOf(s))
              }
              this.elements.buttons.captions && (this.elements.buttons.captions.pressed = r), S(this.elements.container, i, r), this.captions.toggled = r, Ie.updateSetting.call(this, "captions"), h.call(this, this.media, r ? "captionsenabled" : "captionsdisabled")
            }
          }
        },
        set: function (e) {
          var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
            n = De.getTracks.call(this);
          if (-1 !== e)
            if (ge.number(e))
              if (e in n) {
                if (this.captions.currentTrack !== e) {
                  this.captions.currentTrack = e;
                  var i = n[e],
                    r = (i || {}).language;
                  this.captions.currentTrackNode = i, Ie.updateSetting.call(this, "captions"), t || (this.captions.language = r, this.storage.set({
                    language: r
                  })), this.isVimeo && this.embed.enableTextTrack(r), h.call(this, this.media, "languagechange")
                }
                De.toggle.call(this, !0, t), this.isHTML5 && this.isVideo && De.updateCues.call(this)
              } else this.debug.warn("Track not found", e);
          else this.debug.warn("Invalid caption argument", e);
          else De.toggle.call(this, !1, t)
        },
        setLanguage: function (e) {
          var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
          if (ge.string(e)) {
            var n = e.toLowerCase();
            this.captions.language = n;
            var i = De.getTracks.call(this),
              r = De.findTrack.call(this, [n]);
            De.set.call(this, i.indexOf(r), t)
          } else this.debug.warn("Invalid language argument", e)
        },
        getTracks: function () {
          var e = this,
            t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
          return Array.from((this.media || {}).textTracks || []).filter(function (n) {
            return !e.isHTML5 || t || e.captions.meta.has(n)
          }).filter(function (e) {
            return ["captions", "subtitles"].includes(e.kind)
          })
        },
        findTrack: function (e) {
          var t, n = this,
            i = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
            r = De.getTracks.call(this),
            o = function (e) {
              return Number((n.captions.meta.get(e) || {}).default)
            },
            a = Array.from(r).sort(function (e, t) {
              return o(t) - o(e)
            });
          return e.every(function (e) {
            return !(t = a.find(function (t) {
              return t.language === e
            }))
          }), t || (i ? a[0] : void 0)
        },
        getCurrentTrack: function () {
          return De.getTracks.call(this)[this.currentTrack]
        },
        getLabel: function (e) {
          var t = e;
          return !ge.track(t) && ke.textTracks && this.captions.toggled && (t = De.getCurrentTrack.call(this)), ge.track(t) ? ge.empty(t.label) ? ge.empty(t.language) ? Se.get("enabled", this.config) : e.language.toUpperCase() : t.label : Se.get("disabled", this.config)
        },
        updateCues: function (e) {
          if (this.supported.ui)
            if (ge.element(this.elements.captions))
              if (ge.nullOrUndefined(e) || Array.isArray(e)) {
                var t = e;
                if (!t) {
                  var n = De.getCurrentTrack.call(this);
                  t = Array.from((n || {}).activeCues || []).map(function (e) {
                    return e.getCueAsHTML()
                  }).map(R)
                }
                var i = t.map(function (e) {
                  return e.trim()
                }).join("\n");
                if (i !== this.elements.captions.innerHTML) {
                  w(this.elements.captions);
                  var r = v("span", T(this.config.selectors.caption));
                  r.innerHTML = i, this.elements.captions.appendChild(r), h.call(this, this.media, "cuechange")
                }
              } else this.debug.warn("updateCues: Invalid input", e);
          else this.debug.warn("No captions element to render to")
        }
      },
      Le = {
        enabled: !0,
        title: "",
        debug: !1,
        autoplay: !1,
        autopause: !0,
        playsinline: !0,
        seekTime: 10,
        volume: 1,
        muted: !1,
        duration: null,
        displayDuration: !0,
        invertTime: !0,
        toggleInvert: !0,
        ratio: null,
        clickToPlay: !0,
        hideControls: !0,
        resetOnEnd: !1,
        disableContextMenu: !0,
        loadSprite: !0,
        iconPrefix: "plyr",
        iconUrl: "https://cdn.plyr.io/3.5.6/plyr.svg",
        blankVideo: "https://cdn.plyr.io/static/blank.mp4",
        quality: {
          default: 576,
          options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240]
        },
        loop: {
          active: !1
        },
        speed: {
          selected: 1,
          options: [.5, .75, 1, 1.25, 1.5, 1.75, 2]
        },
        keyboard: {
          focused: !0,
          global: !1
        },
        tooltips: {
          controls: !1,
          seek: !0
        },
        captions: {
          active: !1,
          language: "auto",
          update: !1
        },
        fullscreen: {
          enabled: !0,
          fallback: !0,
          iosNative: !1
        },
        storage: {
          enabled: !0,
          key: "plyr"
        },
        controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "captions", "settings", "pip", "airplay", "fullscreen"],
        settings: ["captions", "quality", "speed"],
        i18n: {
          restart: "Restart",
          rewind: "Rewind {seektime}s",
          play: "Play",
          pause: "Pause",
          fastForward: "Forward {seektime}s",
          seek: "Seek",
          seekLabel: "{currentTime} of {duration}",
          played: "Played",
          buffered: "Buffered",
          currentTime: "Current time",
          duration: "Duration",
          volume: "Volume",
          mute: "Mute",
          unmute: "Unmute",
          enableCaptions: "Enable captions",
          disableCaptions: "Disable captions",
          download: "Download",
          enterFullscreen: "Enter fullscreen",
          exitFullscreen: "Exit fullscreen",
          frameTitle: "Player for {title}",
          captions: "Captions",
          settings: "Settings",
          menuBack: "Go back to previous menu",
          speed: "Speed",
          normal: "Normal",
          quality: "Quality",
          loop: "Loop",
          start: "Start",
          end: "End",
          all: "All",
          reset: "Reset",
          disabled: "Disabled",
          enabled: "Enabled",
          advertisement: "Ad",
          qualityBadge: {
            2160: "4K",
            1440: "HD",
            1080: "HD",
            720: "HD",
            576: "SD",
            480: "SD"
          }
        },
        urls: {
          download: null,
          vimeo: {
            sdk: "https://player.vimeo.com/api/player.js",
            iframe: "https://player.vimeo.com/video/{0}?{1}",
            api: "https://vimeo.com/api/v2/video/{0}.json"
          },
          youtube: {
            sdk: "https://www.youtube.com/iframe_api",
            api: "https://noembed.com/embed?url=https://www.youtube.com/watch?v={0}"
          },
          googleIMA: {
            sdk: "https://imasdk.googleapis.com/js/sdkloader/ima3.js"
          }
        },
        listeners: {
          seek: null,
          play: null,
          pause: null,
          restart: null,
          rewind: null,
          fastForward: null,
          mute: null,
          volume: null,
          captions: null,
          download: null,
          fullscreen: null,
          pip: null,
          airplay: null,
          speed: null,
          quality: null,
          loop: null,
          language: null
        },
        events: ["ended", "progress", "stalled", "playing", "waiting", "canplay", "canplaythrough", "loadstart", "loadeddata", "loadedmetadata", "timeupdate", "volumechange", "play", "pause", "error", "seeking", "seeked", "emptied", "ratechange", "cuechange", "download", "enterfullscreen", "exitfullscreen", "captionsenabled", "captionsdisabled", "languagechange", "controlshidden", "controlsshown", "ready", "statechange", "qualitychange", "adsloaded", "adscontentpause", "adscontentresume", "adstarted", "adsmidpoint", "adscomplete", "adsallcomplete", "adsimpression", "adsclick"],
        selectors: {
          editable: "input, textarea, select, [contenteditable]",
          container: ".plyr",
          controls: {
            container: null,
            wrapper: ".plyr__controls"
          },
          labels: "[data-plyr]",
          buttons: {
            play: '[data-plyr="play"]',
            pause: '[data-plyr="pause"]',
            restart: '[data-plyr="restart"]',
            rewind: '[data-plyr="rewind"]',
            fastForward: '[data-plyr="fast-forward"]',
            mute: '[data-plyr="mute"]',
            captions: '[data-plyr="captions"]',
            download: '[data-plyr="download"]',
            fullscreen: '[data-plyr="fullscreen"]',
            pip: '[data-plyr="pip"]',
            airplay: '[data-plyr="airplay"]',
            settings: '[data-plyr="settings"]',
            loop: '[data-plyr="loop"]'
          },
          inputs: {
            seek: '[data-plyr="seek"]',
            volume: '[data-plyr="volume"]',
            speed: '[data-plyr="speed"]',
            language: '[data-plyr="language"]',
            quality: '[data-plyr="quality"]'
          },
          display: {
            currentTime: ".plyr__time--current",
            duration: ".plyr__time--duration",
            buffer: ".plyr__progress__buffer",
            loop: ".plyr__progress__loop",
            volume: ".plyr__volume--display"
          },
          progress: ".plyr__progress",
          captions: ".plyr__captions",
          caption: ".plyr__caption"
        },
        classNames: {
          type: "plyr--{0}",
          provider: "plyr--{0}",
          video: "plyr__video-wrapper",
          embed: "plyr__video-embed",
          videoFixedRatio: "plyr__video-wrapper--fixed-ratio",
          embedContainer: "plyr__video-embed__container",
          poster: "plyr__poster",
          posterEnabled: "plyr__poster-enabled",
          ads: "plyr__ads",
          control: "plyr__control",
          controlPressed: "plyr__control--pressed",
          playing: "plyr--playing",
          paused: "plyr--paused",
          stopped: "plyr--stopped",
          loading: "plyr--loading",
          hover: "plyr--hover",
          tooltip: "plyr__tooltip",
          cues: "plyr__cues",
          hidden: "plyr__sr-only",
          hideControls: "plyr--hide-controls",
          isIos: "plyr--is-ios",
          isTouch: "plyr--is-touch",
          uiSupported: "plyr--full-ui",
          noTransition: "plyr--no-transition",
          display: {
            time: "plyr__time"
          },
          menu: {
            value: "plyr__menu__value",
            badge: "plyr__badge",
            open: "plyr--menu-open"
          },
          captions: {
            enabled: "plyr--captions-enabled",
            active: "plyr--captions-active"
          },
          fullscreen: {
            enabled: "plyr--fullscreen-enabled",
            fallback: "plyr--fullscreen-fallback"
          },
          pip: {
            supported: "plyr--pip-supported",
            active: "plyr--pip-active"
          },
          airplay: {
            supported: "plyr--airplay-supported",
            active: "plyr--airplay-active"
          },
          tabFocus: "plyr__tab-focus",
          previewThumbnails: {
            thumbContainer: "plyr__preview-thumb",
            thumbContainerShown: "plyr__preview-thumb--is-shown",
            imageContainer: "plyr__preview-thumb__image-container",
            timeContainer: "plyr__preview-thumb__time-container",
            scrubbingContainer: "plyr__preview-scrubbing",
            scrubbingContainerShown: "plyr__preview-scrubbing--is-shown"
          }
        },
        attributes: {
          embed: {
            provider: "data-plyr-provider",
            id: "data-plyr-embed-id"
          }
        },
        ads: {
          enabled: !1,
          publisherId: "",
          tagUrl: ""
        },
        previewThumbnails: {
          enabled: !1,
          src: ""
        },
        vimeo: {
          byline: !1,
          portrait: !1,
          title: !1,
          speed: !0,
          transparent: !1
        },
        youtube: {
          noCookie: !1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          modestbranding: 1
        }
      },
      Ne = {
        active: "picture-in-picture",
        inactive: "inline"
      },
      Ge = {
        html5: "html5",
        youtube: "youtube",
        vimeo: "vimeo"
      },
      _e = {
        audio: "audio",
        video: "video"
      },
      Me = function () {},
      Oe = function () {
        function t() {
          var n = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
          e(this, t), this.enabled = window.console && n, this.enabled && this.log("Debugging enabled")
        }
        return n(t, [{
          key: "log",
          get: function () {
            return this.enabled ? Function.prototype.bind.call(console.log, console) : Me
          }
        }, {
          key: "warn",
          get: function () {
            return this.enabled ? Function.prototype.bind.call(console.warn, console) : Me
          }
        }, {
          key: "error",
          get: function () {
            return this.enabled ? Function.prototype.bind.call(console.error, console) : Me
          }
        }]), t
      }(),
      Fe = function () {
        function t(n) {
          var i = this;
          e(this, t), this.player = n, this.prefix = t.prefix, this.property = t.property, this.scrollPosition = {
            x: 0,
            y: 0
          }, this.forceFallback = "force" === n.config.fullscreen.fallback, u.call(this.player, document, "ms" === this.prefix ? "MSFullscreenChange" : "".concat(this.prefix, "fullscreenchange"), function () {
            U.call(i)
          }), u.call(this.player, this.player.elements.container, "dblclick", function (e) {
            ge.element(i.player.elements.controls) && i.player.elements.controls.contains(e.target) || i.toggle()
          }), this.update()
        }
        return n(t, [{
          key: "update",
          value: function () {
            if (this.enabled) {
              var e;
              e = this.forceFallback ? "Fallback (forced)" : t.native ? "Native" : "Fallback", this.player.debug.log("".concat(e, " fullscreen enabled"))
            } else this.player.debug.log("Fullscreen not supported and fallback disabled");
            S(this.player.elements.container, this.player.config.classNames.fullscreen.enabled, this.enabled)
          }
        }, {
          key: "enter",
          value: function () {
            this.enabled && (be.isIos && this.player.config.fullscreen.iosNative ? this.target.webkitEnterFullscreen() : !t.native || this.forceFallback ? X.call(this, !0) : this.prefix ? ge.empty(this.prefix) || this.target["".concat(this.prefix, "Request").concat(this.property)]() : this.target.requestFullscreen())
          }
        }, {
          key: "exit",
          value: function () {
            if (this.enabled)
              if (be.isIos && this.player.config.fullscreen.iosNative) this.target.webkitExitFullscreen(), this.player.play();
              else if (!t.native || this.forceFallback) X.call(this, !1);
            else if (this.prefix) {
              if (!ge.empty(this.prefix)) {
                var e = "moz" === this.prefix ? "Cancel" : "Exit";
                document["".concat(this.prefix).concat(e).concat(this.property)]()
              }
            } else(document.cancelFullScreen || document.exitFullscreen).call(document)
          }
        }, {
          key: "toggle",
          value: function () {
            this.active ? this.exit() : this.enter()
          }
        }, {
          key: "usingNative",
          get: function () {
            return t.native && !this.forceFallback
          }
        }, {
          key: "enabled",
          get: function () {
            return (t.native || this.player.config.fullscreen.fallback) && this.player.config.fullscreen.enabled && this.player.supported.ui && this.player.isVideo
          }
        }, {
          key: "active",
          get: function () {
            if (!this.enabled) return !1;
            if (!t.native || this.forceFallback) return C(this.target, this.player.config.classNames.fullscreen.fallback);
            return (this.prefix ? document["".concat(this.prefix).concat(this.property, "Element")] : document.fullscreenElement) === this.target
          }
        }, {
          key: "target",
          get: function () {
            return be.isIos && this.player.config.fullscreen.iosNative ? this.player.media : this.player.elements.container
          }
        }], [{
          key: "native",
          get: function () {
            return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled)
          }
        }, {
          key: "prefix",
          get: function () {
            if (ge.function(document.exitFullscreen)) return "";
            var e = "";
            return ["webkit", "moz", "ms"].some(function (t) {
              return !(!ge.function(document["".concat(t, "ExitFullscreen")]) && !ge.function(document["".concat(t, "CancelFullScreen")])) && (e = t, !0)
            }), e
          }
        }, {
          key: "property",
          get: function () {
            return "moz" === this.prefix ? "FullScreen" : "Fullscreen"
          }
        }]), t
      }(),
      je = {
        addStyleHook: function () {
          S(this.elements.container, this.config.selectors.container.replace(".", ""), !0), S(this.elements.container, this.config.classNames.uiSupported, this.supported.ui)
        },
        toggleNativeControls: function () {
          arguments.length > 0 && void 0 !== arguments[0] && arguments[0] && this.isHTML5 ? this.media.setAttribute("controls", "") : this.media.removeAttribute("controls")
        },
        build: function () {
          var e = this;
          if (this.listeners.media(), !this.supported.ui) return this.debug.warn("Basic support only for ".concat(this.provider, " ").concat(this.type)), void je.toggleNativeControls.call(this, !0);
          ge.element(this.elements.controls) || (Ie.inject.call(this), this.listeners.controls()), je.toggleNativeControls.call(this), this.isHTML5 && De.setup.call(this), this.volume = null, this.muted = null, this.loop = null, this.quality = null, this.speed = null, Ie.updateVolume.call(this), Ie.timeUpdate.call(this), je.checkPlaying.call(this), S(this.elements.container, this.config.classNames.pip.supported, ke.pip && this.isHTML5 && this.isVideo), S(this.elements.container, this.config.classNames.airplay.supported, ke.airplay && this.isHTML5), S(this.elements.container, this.config.classNames.isIos, be.isIos), S(this.elements.container, this.config.classNames.isTouch, this.touch), this.ready = !0, setTimeout(function () {
            h.call(e, e.media, "ready")
          }, 0), je.setTitle.call(this), this.poster && je.setPoster.call(this, this.poster, !1).catch(function () {}), this.config.duration && Ie.durationUpdate.call(this)
        },
        setTitle: function () {
          var e = Se.get("play", this.config);
          if (ge.string(this.config.title) && !ge.empty(this.config.title) && (e += ", ".concat(this.config.title)), Array.from(this.elements.buttons.play || []).forEach(function (t) {
              t.setAttribute("aria-label", e)
            }), this.isEmbed) {
            var t = A.call(this, "iframe");
            if (!ge.element(t)) return;
            var n = ge.empty(this.config.title) ? "video" : this.config.title,
              i = Se.get("frameTitle", this.config);
            t.setAttribute("title", i.replace("{title}", n))
          }
        },
        togglePoster: function (e) {
          S(this.elements.container, this.config.classNames.posterEnabled, e)
        },
        setPoster: function (e) {
          var t = this;
          return arguments.length > 1 && void 0 !== arguments[1] && !arguments[1] || !this.poster ? (this.media.setAttribute("poster", e), function () {
            var e = this;
            return new Promise(function (t) {
              return e.ready ? setTimeout(t, 0) : u.call(e, e.elements.container, "ready", t)
            }).then(function () {})
          }.call(this).then(function () {
            return z(e)
          }).catch(function (n) {
            throw e === t.poster && je.togglePoster.call(t, !1), n
          }).then(function () {
            if (e !== t.poster) throw new Error("setPoster cancelled by later call to setPoster")
          }).then(function () {
            return Object.assign(t.elements.poster.style, {
              backgroundImage: "url('".concat(e, "')"),
              backgroundSize: ""
            }), je.togglePoster.call(t, !0), e
          })) : Promise.reject(new Error("Poster already set"))
        },
        checkPlaying: function (e) {
          var t = this;
          S(this.elements.container, this.config.classNames.playing, this.playing), S(this.elements.container, this.config.classNames.paused, this.paused), S(this.elements.container, this.config.classNames.stopped, this.stopped), Array.from(this.elements.buttons.play || []).forEach(function (e) {
            Object.assign(e, {
              pressed: t.playing
            })
          }), ge.event(e) && "timeupdate" === e.type || je.toggleControls.call(this)
        },
        checkLoading: function (e) {
          var t = this;
          this.loading = ["stalled", "waiting"].includes(e.type), clearTimeout(this.timers.loading), this.timers.loading = setTimeout(function () {
            S(t.elements.container, t.config.classNames.loading, t.loading), je.toggleControls.call(t)
          }, this.loading ? 250 : 0)
        },
        toggleControls: function (e) {
          var t = this.elements.controls;
          if (t && this.config.hideControls) {
            var n = this.touch && this.lastSeekTime + 2e3 > Date.now();
            this.toggleControls(Boolean(e || this.loading || this.paused || t.pressed || t.hover || n))
          }
        }
      },
      Re = function () {
        function t(n) {
          e(this, t), this.player = n, this.lastKey = null, this.focusTimer = null, this.lastKeyDown = null, this.handleKey = this.handleKey.bind(this), this.toggleMenu = this.toggleMenu.bind(this), this.setTabFocus = this.setTabFocus.bind(this), this.firstTouch = this.firstTouch.bind(this)
        }
        return n(t, [{
          key: "handleKey",
          value: function (e) {
            var t = this.player,
              n = t.elements,
              i = e.keyCode ? e.keyCode : e.which,
              r = "keydown" === e.type,
              o = r && i === this.lastKey;
            if (!(e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) && ge.number(i)) {
              if (r) {
                var a = document.activeElement;
                if (ge.element(a)) {
                  var s = t.config.selectors.editable;
                  if (a !== n.inputs.seek && P(a, s)) return;
                  if (32 === e.which && P(a, 'button, [role^="menuitem"]')) return
                }
                switch ([32, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 54, 56, 57, 67, 70, 73, 75, 76, 77, 79].includes(i) && (e.preventDefault(), e.stopPropagation()), i) {
                  case 48:
                  case 49:
                  case 50:
                  case 51:
                  case 52:
                  case 53:
                  case 54:
                  case 55:
                  case 56:
                  case 57:
                    o || (t.currentTime = t.duration / 10 * (i - 48));
                    break;
                  case 32:
                  case 75:
                    o || t.togglePlay();
                    break;
                  case 38:
                    t.increaseVolume(.1);
                    break;
                  case 40:
                    t.decreaseVolume(.1);
                    break;
                  case 77:
                    o || (t.muted = !t.muted);
                    break;
                  case 39:
                    t.forward();
                    break;
                  case 37:
                    t.rewind();
                    break;
                  case 70:
                    t.fullscreen.toggle();
                    break;
                  case 67:
                    o || t.toggleCaptions();
                    break;
                  case 76:
                    t.loop = !t.loop
                }
                27 === i && !t.fullscreen.usingNative && t.fullscreen.active && t.fullscreen.toggle(), this.lastKey = i
              } else this.lastKey = null
            }
          }
        }, {
          key: "toggleMenu",
          value: function (e) {
            Ie.toggleMenu.call(this.player, e)
          }
        }, {
          key: "firstTouch",
          value: function () {
            var e = this.player,
              t = e.elements;
            e.touch = !0, S(t.container, e.config.classNames.isTouch, !0)
          }
        }, {
          key: "setTabFocus",
          value: function (e) {
            var t = this.player,
              n = t.elements;
            if (clearTimeout(this.focusTimer), "keydown" !== e.type || 9 === e.which) {
              "keydown" === e.type && (this.lastKeyDown = e.timeStamp);
              var i = e.timeStamp - this.lastKeyDown <= 20;
              ("focus" !== e.type || i) && (! function () {
                var e = t.config.classNames.tabFocus;
                S(E.call(t, ".".concat(e)), e, !1)
              }(), this.focusTimer = setTimeout(function () {
                var e = document.activeElement;
                n.container.contains(e) && S(document.activeElement, t.config.classNames.tabFocus, !0)
              }, 10))
            }
          }
        }, {
          key: "global",
          value: function () {
            var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0],
              t = this.player;
            t.config.keyboard.global && l.call(t, window, "keydown keyup", this.handleKey, e, !1), l.call(t, document.body, "click", this.toggleMenu, e), d.call(t, document.body, "touchstart", this.firstTouch), l.call(t, document.body, "keydown focus blur", this.setTabFocus, e, !1, !0)
          }
        }, {
          key: "container",
          value: function () {
            var e = this.player,
              t = e.config,
              n = e.elements,
              i = e.timers;
            !t.keyboard.global && t.keyboard.focused && u.call(e, n.container, "keydown keyup", this.handleKey, !1), u.call(e, n.container, "mousemove mouseleave touchstart touchmove enterfullscreen exitfullscreen", function (t) {
              var r = n.controls;
              r && "enterfullscreen" === t.type && (r.pressed = !1, r.hover = !1);
              var o = 0;
              ["touchstart", "touchmove", "mousemove"].includes(t.type) && (je.toggleControls.call(e, !0), o = e.touch ? 3e3 : 2e3), clearTimeout(i.controls), i.controls = setTimeout(function () {
                return je.toggleControls.call(e, !1)
              }, o)
            });
            var o = function (t) {
                if (!t) return G.call(e);
                var i = n.container.getBoundingClientRect(),
                  r = i.width,
                  o = i.height;
                return G.call(e, "".concat(r, ":").concat(o))
              },
              a = function () {
                clearTimeout(i.resized), i.resized = setTimeout(o, 50)
              };
            u.call(e, n.container, "enterfullscreen exitfullscreen", function (t) {
              var i = e.fullscreen,
                s = i.target,
                l = i.usingNative;
              if (s === n.container && (e.isEmbed || !ge.empty(e.config.ratio))) {
                var d = "enterfullscreen" === t.type,
                  h = o(d);
                h.padding;
                ! function (t, n, i) {
                  if (e.isVimeo) {
                    var o = e.elements.wrapper.firstChild,
                      a = r(t, 2)[1],
                      s = r(N.call(e), 2),
                      l = s[0],
                      u = s[1];
                    o.style.maxWidth = i ? "".concat(a / u * l, "px") : null, o.style.margin = i ? "0 auto" : null
                  }
                }(h.ratio, 0, d), l || (d ? u.call(e, window, "resize", a) : c.call(e, window, "resize", a))
              }
            })
          }
        }, {
          key: "media",
          value: function () {
            var e = this,
              t = this.player,
              n = t.elements;
            if (u.call(t, t.media, "timeupdate seeking seeked", function (e) {
                return Ie.timeUpdate.call(t, e)
              }), u.call(t, t.media, "durationchange loadeddata loadedmetadata", function (e) {
                return Ie.durationUpdate.call(t, e)
              }), u.call(t, t.media, "canplay loadeddata", function () {
                x(n.volume, !t.hasAudio), x(n.buttons.mute, !t.hasAudio)
              }), u.call(t, t.media, "ended", function () {
                t.isHTML5 && t.isVideo && t.config.resetOnEnd && t.restart()
              }), u.call(t, t.media, "progress playing seeking seeked", function (e) {
                return Ie.updateProgress.call(t, e)
              }), u.call(t, t.media, "volumechange", function (e) {
                return Ie.updateVolume.call(t, e)
              }), u.call(t, t.media, "playing play pause ended emptied timeupdate", function (e) {
                return je.checkPlaying.call(t, e)
              }), u.call(t, t.media, "waiting canplay seeked playing", function (e) {
                return je.checkLoading.call(t, e)
              }), t.supported.ui && t.config.clickToPlay && !t.isAudio) {
              var i = A.call(t, ".".concat(t.config.classNames.video));
              if (!ge.element(i)) return;
              u.call(t, n.container, "click", function (r) {
                ([n.container, i].includes(r.target) || i.contains(r.target)) && (t.touch && t.config.hideControls || (t.ended ? (e.proxy(r, t.restart, "restart"), e.proxy(r, t.play, "play")) : e.proxy(r, t.togglePlay, "play")))
              })
            }
            t.supported.ui && t.config.disableContextMenu && u.call(t, n.wrapper, "contextmenu", function (e) {
              e.preventDefault()
            }, !1), u.call(t, t.media, "volumechange", function () {
              t.storage.set({
                volume: t.volume,
                muted: t.muted
              })
            }), u.call(t, t.media, "ratechange", function () {
              Ie.updateSetting.call(t, "speed"), t.storage.set({
                speed: t.speed
              })
            }), u.call(t, t.media, "qualitychange", function (e) {
              Ie.updateSetting.call(t, "quality", null, e.detail.quality)
            }), u.call(t, t.media, "ready qualitychange", function () {
              Ie.setDownloadUrl.call(t)
            });
            var r = t.config.events.concat(["keyup", "keydown"]).join(" ");
            u.call(t, t.media, r, function (e) {
              var i = e.detail,
                r = void 0 === i ? {} : i;
              "error" === e.type && (r = t.media.error), h.call(t, n.container, e.type, !0, r)
            })
          }
        }, {
          key: "proxy",
          value: function (e, t, n) {
            var i = this.player,
              r = i.config.listeners[n],
              o = !0;
            ge.function(r) && (o = r.call(i, e)), o && ge.function(t) && t.call(i, e)
          }
        }, {
          key: "bind",
          value: function (e, t, n, i) {
            var r = this,
              o = !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4],
              a = this.player,
              s = a.config.listeners[i],
              l = ge.function(s);
            u.call(a, e, t, function (e) {
              return r.proxy(e, n, i)
            }, o && !l)
          }
        }, {
          key: "controls",
          value: function () {
            var e = this,
              t = this.player,
              n = t.elements,
              i = be.isIE ? "change" : "input";
            if (n.buttons.play && Array.from(n.buttons.play).forEach(function (n) {
                e.bind(n, "click", t.togglePlay, "play")
              }), this.bind(n.buttons.restart, "click", t.restart, "restart"), this.bind(n.buttons.rewind, "click", t.rewind, "rewind"), this.bind(n.buttons.fastForward, "click", t.forward, "fastForward"), this.bind(n.buttons.mute, "click", function () {
                t.muted = !t.muted
              }, "mute"), this.bind(n.buttons.captions, "click", function () {
                return t.toggleCaptions()
              }), this.bind(n.buttons.download, "click", function () {
                h.call(t, t.media, "download")
              }, "download"), this.bind(n.buttons.fullscreen, "click", function () {
                t.fullscreen.toggle()
              }, "fullscreen"), this.bind(n.buttons.pip, "click", function () {
                t.pip = "toggle"
              }, "pip"), this.bind(n.buttons.airplay, "click", t.airplay, "airplay"), this.bind(n.buttons.settings, "click", function (e) {
                e.stopPropagation(), Ie.toggleMenu.call(t, e)
              }), this.bind(n.buttons.settings, "keyup", function (e) {
                var n = e.which;
                [13, 32].includes(n) && (13 !== n ? (e.preventDefault(), e.stopPropagation(), Ie.toggleMenu.call(t, e)) : Ie.focusFirstMenuItem.call(t, null, !0))
              }, null, !1), this.bind(n.settings.menu, "keydown", function (e) {
                27 === e.which && Ie.toggleMenu.call(t, e)
              }), this.bind(n.inputs.seek, "mousedown mousemove", function (e) {
                var t = n.progress.getBoundingClientRect(),
                  i = 100 / t.width * (e.pageX - t.left);
                e.currentTarget.setAttribute("seek-value", i)
              }), this.bind(n.inputs.seek, "mousedown mouseup keydown keyup touchstart touchend", function (e) {
                var n = e.currentTarget,
                  i = e.keyCode ? e.keyCode : e.which;
                if (!ge.keyboardEvent(e) || 39 === i || 37 === i) {
                  t.lastSeekTime = Date.now();
                  var r = n.hasAttribute("play-on-seeked"),
                    o = ["mouseup", "touchend", "keyup"].includes(e.type);
                  r && o ? (n.removeAttribute("play-on-seeked"), t.play()) : !o && t.playing && (n.setAttribute("play-on-seeked", ""), t.pause())
                }
              }), be.isIos) {
              var o = E.call(t, 'input[type="range"]');
              Array.from(o).forEach(function (t) {
                return e.bind(t, i, function (e) {
                  return s(e.target)
                })
              })
            }
            this.bind(n.inputs.seek, i, function (e) {
              var n = e.currentTarget,
                i = n.getAttribute("seek-value");
              ge.empty(i) && (i = n.value), n.removeAttribute("seek-value"), t.currentTime = i / n.max * t.duration
            }, "seek"), this.bind(n.progress, "mouseenter mouseleave mousemove", function (e) {
              return Ie.updateSeekTooltip.call(t, e)
            }), this.bind(n.progress, "mousemove touchmove", function (e) {
              var n = t.previewThumbnails;
              n && n.loaded && n.startMove(e)
            }), this.bind(n.progress, "mouseleave click", function () {
              var e = t.previewThumbnails;
              e && e.loaded && e.endMove(!1, !0)
            }), this.bind(n.progress, "mousedown touchstart", function (e) {
              var n = t.previewThumbnails;
              n && n.loaded && n.startScrubbing(e)
            }), this.bind(n.progress, "mouseup touchend", function (e) {
              var n = t.previewThumbnails;
              n && n.loaded && n.endScrubbing(e)
            }), be.isWebkit && Array.from(E.call(t, 'input[type="range"]')).forEach(function (n) {
              e.bind(n, "input", function (e) {
                return Ie.updateRangeFill.call(t, e.target)
              })
            }), t.config.toggleInvert && !ge.element(n.display.duration) && this.bind(n.display.currentTime, "click", function () {
              0 !== t.currentTime && (t.config.invertTime = !t.config.invertTime, Ie.timeUpdate.call(t))
            }), this.bind(n.inputs.volume, i, function (e) {
              t.volume = e.target.value
            }, "volume"), this.bind(n.controls, "mouseenter mouseleave", function (e) {
              n.controls.hover = !t.touch && "mouseenter" === e.type
            }), this.bind(n.controls, "mousedown mouseup touchstart touchend touchcancel", function (e) {
              n.controls.pressed = ["mousedown", "touchstart"].includes(e.type)
            }), this.bind(n.controls, "focusin", function () {
              var i = t.config,
                r = t.timers;
              S(n.controls, i.classNames.noTransition, !0), je.toggleControls.call(t, !0), setTimeout(function () {
                S(n.controls, i.classNames.noTransition, !1)
              }, 0);
              var o = e.touch ? 3e3 : 4e3;
              clearTimeout(r.controls), r.controls = setTimeout(function () {
                return je.toggleControls.call(t, !1)
              }, o)
            }), this.bind(n.inputs.volume, "wheel", function (e) {
              var n = e.webkitDirectionInvertedFromDevice,
                i = r([e.deltaX, -e.deltaY].map(function (e) {
                  return n ? -e : e
                }), 2),
                o = i[0],
                a = i[1],
                s = Math.sign(Math.abs(o) > Math.abs(a) ? o : a);
              t.increaseVolume(s / 50);
              var l = t.media.volume;
              (1 === s && l < 1 || -1 === s && l > 0) && e.preventDefault()
            }, "volume", !1)
          }
        }]), t
      }(),
      qe = ("undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self && self, function (e, t) {
        return t = {
          exports: {}
        }, e(t, t.exports), t.exports
      }(function (e, t) {
        e.exports = function () {
          function e(e, t) {
            if (e) {
              var n = s[e];
              if (a[e] = t, n)
                for (; n.length;) n[0](e, t), n.splice(0, 1)
            }
          }

          function t(e, t) {
            e.call && (e = {
              success: e
            }), t.length ? (e.error || r)(t) : (e.success || r)(e)
          }

          function n(e, t, i, o) {
            var a, s, l = document,
              u = i.async,
              c = (i.numRetries || 0) + 1,
              d = i.before || r,
              h = e.replace(/^(css|img)!/, "");
            o = o || 0, /(^css!|\.css$)/.test(e) ? ((s = l.createElement("link")).rel = "stylesheet", s.href = h, (a = "hideFocus" in s) && s.relList && (a = 0, s.rel = "preload", s.as = "style")) : /(^img!|\.(png|gif|jpg|svg)$)/.test(e) ? (s = l.createElement("img")).src = h : ((s = l.createElement("script")).src = e, s.async = void 0 === u || u), s.onload = s.onerror = s.onbeforeload = function (r) {
              var l = r.type[0];
              if (a) try {
                s.sheet.cssText.length || (l = "e")
              } catch (e) {
                18 != e.code && (l = "e")
              }
              if ("e" == l) {
                if ((o += 1) < c) return n(e, t, i, o)
              } else if ("preload" == s.rel && "style" == s.as) return s.rel = "stylesheet";
              t(e, l, r.defaultPrevented)
            }, !1 !== d(e, s) && l.head.appendChild(s)
          }

          function i(i, r, a) {
            function s(r, o) {
              ! function (e, t, i) {
                var r, o, a = (e = e.push ? e : [e]).length,
                  s = a,
                  l = [];
                for (r = function (e, n, i) {
                    if ("e" == n && l.push(e), "b" == n) {
                      if (!i) return;
                      l.push(e)
                    }--a || t(l)
                  }, o = 0; o < s; o++) n(e[o], r, i)
              }(i, function (n) {
                t(u, n), r && t({
                  success: r,
                  error: o
                }, n), e(l, n)
              }, u)
            }
            var l, u;
            if (r && r.trim && (l = r), u = (l ? a : r) || {}, l) {
              if (l in o) throw "LoadJS";
              o[l] = !0
            }
            if (u.returnPromise) return new Promise(s);
            s()
          }
          var r = function () {},
            o = {},
            a = {},
            s = {};
          return i.ready = function (e, n) {
            return function (e, t) {
              var n, i, r, o = [],
                l = (e = e.push ? e : [e]).length,
                u = l;
              for (n = function (e, n) {
                  n.length && o.push(e), --u || t(o)
                }; l--;) i = e[l], (r = a[i]) ? n(i, r) : (s[i] = s[i] || []).push(n)
            }(e, function (e) {
              t(n, e)
            }), i
          }, i.done = function (t) {
            e(t, [])
          }, i.reset = function () {
            o = {}, a = {}, s = {}
          }, i.isDefined = function (e) {
            return e in o
          }, i
        }()
      })),
      He = {
        setup: function () {
          var e = this;
          S(this.elements.wrapper, this.config.classNames.embed, !0), G.call(this), ge.object(window.Vimeo) ? He.ready.call(this) : Y(this.config.urls.vimeo.sdk).then(function () {
            He.ready.call(e)
          }).catch(function (t) {
            e.debug.warn("Vimeo SDK (player.js) failed to load", t)
          })
        },
        ready: function () {
          var e = this,
            t = this,
            n = t.config.vimeo,
            i = W(f({}, {
              loop: t.config.loop.active,
              autoplay: t.autoplay,
              muted: t.muted,
              quality: t.config.quality.default,
              gesture: "media",
              playsinline: !this.config.fullscreen.iosNative
            }, n)),
            o = t.media.getAttribute("src");
          ge.empty(o) && (o = t.media.getAttribute(t.config.attributes.embed.id));
          var a = function (e) {
              return ge.empty(e) ? null : ge.number(Number(e)) ? e : e.match(/^.*(vimeo.com\/|video\/)(\d+).*/) ? RegExp.$2 : e
            }(o),
            s = v("iframe"),
            l = M(t.config.urls.vimeo.iframe, a, i);
          s.setAttribute("src", l), s.setAttribute("allowfullscreen", ""), s.setAttribute("allowtransparency", ""), s.setAttribute("allow", "autoplay");
          var u = v("div", {
            poster: t.poster,
            class: t.config.classNames.embedContainer
          });
          u.appendChild(s), t.media = k(u, t.media), t.embed = new window.Vimeo.Player(s, {
            autopause: t.config.autopause,
            muted: t.muted
          }), t.media.paused = !0, t.media.currentTime = 0, t.supported.ui && t.embed.disableTextTrack(), t.media.play = function () {
            return K.call(t, !0), t.embed.play()
          }, t.media.pause = function () {
            return K.call(t, !1), t.embed.pause()
          }, t.media.stop = function () {
            t.pause(), t.currentTime = 0
          };
          var c = t.media.currentTime;
          Object.defineProperty(t.media, "currentTime", {
            get: function () {
              return c
            },
            set: function (e) {
              var n = t.embed,
                i = t.media,
                r = t.paused,
                o = t.volume,
                a = r && !n.hasPlayed;
              i.seeking = !0, h.call(t, i, "seeking"), Promise.resolve(a && n.setVolume(0)).then(function () {
                return n.setCurrentTime(e)
              }).then(function () {
                return a && n.pause()
              }).then(function () {
                return a && n.setVolume(o)
              }).catch(function () {})
            }
          });
          var d = t.config.speed.selected;
          Object.defineProperty(t.media, "playbackRate", {
            get: function () {
              return d
            },
            set: function (e) {
              t.embed.setPlaybackRate(e).then(function () {
                d = e, h.call(t, t.media, "ratechange")
              }).catch(function (e) {
                "Error" === e.name && Ie.setSpeedMenu.call(t, [])
              })
            }
          });
          var p = t.config.volume;
          Object.defineProperty(t.media, "volume", {
            get: function () {
              return p
            },
            set: function (e) {
              t.embed.setVolume(e).then(function () {
                p = e, h.call(t, t.media, "volumechange")
              })
            }
          });
          var m = t.config.muted;
          Object.defineProperty(t.media, "muted", {
            get: function () {
              return m
            },
            set: function (e) {
              var n = !!ge.boolean(e) && e;
              t.embed.setVolume(n ? 0 : t.config.volume).then(function () {
                m = n, h.call(t, t.media, "volumechange")
              })
            }
          });
          var g = t.config.loop;
          Object.defineProperty(t.media, "loop", {
            get: function () {
              return g
            },
            set: function (e) {
              var n = ge.boolean(e) ? e : t.config.loop.active;
              t.embed.setLoop(n).then(function () {
                g = n
              })
            }
          });
          var b;
          t.embed.getVideoUrl().then(function (e) {
            b = e, Ie.setDownloadUrl.call(t)
          }).catch(function (t) {
            e.debug.warn(t)
          }), Object.defineProperty(t.media, "currentSrc", {
            get: function () {
              return b
            }
          }), Object.defineProperty(t.media, "ended", {
            get: function () {
              return t.currentTime === t.duration
            }
          }), Promise.all([t.embed.getVideoWidth(), t.embed.getVideoHeight()]).then(function (n) {
            var i = r(n, 2),
              o = i[0],
              a = i[1];
            t.embed.ratio = [o, a], G.call(e)
          }), t.embed.setAutopause(t.config.autopause).then(function (e) {
            t.config.autopause = e
          }), t.embed.getVideoTitle().then(function (n) {
            t.config.title = n, je.setTitle.call(e)
          }), t.embed.getCurrentTime().then(function (e) {
            c = e, h.call(t, t.media, "timeupdate")
          }), t.embed.getDuration().then(function (e) {
            t.media.duration = e, h.call(t, t.media, "durationchange")
          }), t.embed.getTextTracks().then(function (e) {
            t.media.textTracks = e, De.setup.call(t), t.config.captions.active || setTimeout(function () {
              t.embed.disableTextTrack(), $(e).each(function (t) {
                e[t].mode = "disabled"
              })
            }, 100)
          }), t.embed.on("cuechange", function (e) {
            var n = e.cues,
              i = (void 0 === n ? [] : n).map(function (e) {
                return function (e) {
                  var t = document.createDocumentFragment(),
                    n = document.createElement("div");
                  return t.appendChild(n), n.innerHTML = e, t.firstChild.innerText
                }(e.text)
              });
            De.updateCues.call(t, i)
          }), t.embed.on("loaded", function () {
            if (t.embed.getPaused().then(function (e) {
                K.call(t, !e), e || h.call(t, t.media, "playing")
              }), ge.element(t.embed.element) && t.supported.ui) {
              t.embed.element.setAttribute("tabindex", -1)
            }
          }), t.embed.on("play", function () {
            K.call(t, !0), h.call(t, t.media, "playing")
          }), t.embed.on("pause", function () {
            K.call(t, !1)
          }), t.embed.on("timeupdate", function (e) {
            t.media.seeking = !1, c = e.seconds, h.call(t, t.media, "timeupdate")
          }), t.embed.on("progress", function (e) {
            t.media.buffered = e.percent, h.call(t, t.media, "progress"), 1 === parseInt(e.percent, 10) && h.call(t, t.media, "canplaythrough"), t.embed.getDuration().then(function (e) {
              e !== t.media.duration && (t.media.duration = e, h.call(t, t.media, "durationchange"))
            })
          }), t.embed.on("seeked", function () {
            t.media.seeking = !1, h.call(t, t.media, "seeked")
          }), t.embed.on("ended", function () {
            t.media.paused = !0, h.call(t, t.media, "ended")
          }), t.embed.on("error", function (e) {
            t.media.error = e, h.call(t, t.media, "error")
          }), setTimeout(function () {
            return je.build.call(t)
          }, 0)
        }
      },
      $e = {
        setup: function () {
          var e = this;
          if (S(this.elements.wrapper, this.config.classNames.embed, !0), ge.object(window.YT) && ge.function(window.YT.Player)) $e.ready.call(this);
          else {
            var t = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = function () {
              ge.function(t) && t(), $e.ready.call(e)
            }, Y(this.config.urls.youtube.sdk).catch(function (t) {
              e.debug.warn("YouTube API failed to load", t)
            })
          }
        },
        getTitle: function (e) {
          var t = this;
          q(M(this.config.urls.youtube.api, e)).then(function (e) {
            if (ge.object(e)) {
              var n = e.title,
                i = e.height,
                r = e.width;
              t.config.title = n, je.setTitle.call(t), t.embed.ratio = [r, i]
            }
            G.call(t)
          }).catch(function () {
            G.call(t)
          })
        },
        ready: function () {
          var e = this,
            t = e.media && e.media.getAttribute("id");
          if (ge.empty(t) || !t.startsWith("youtube-")) {
            var n = e.media.getAttribute("src");
            ge.empty(n) && (n = e.media.getAttribute(this.config.attributes.embed.id));
            var i = function (e) {
                return ge.empty(e) ? null : e.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/) ? RegExp.$2 : e
              }(n),
              r = function (e) {
                return "".concat(e, "-").concat(Math.floor(1e4 * Math.random()))
              }(e.provider),
              o = v("div", {
                id: r,
                poster: e.poster
              });
            e.media = k(o, e.media);
            var a = function (e) {
              return "https://i.ytimg.com/vi/".concat(i, "/").concat(e, "default.jpg")
            };
            z(a("maxres"), 121).catch(function () {
              return z(a("sd"), 121)
            }).catch(function () {
              return z(a("hq"))
            }).then(function (t) {
              return je.setPoster.call(e, t.src)
            }).then(function (t) {
              t.includes("maxres") || (e.elements.poster.style.backgroundSize = "cover")
            }).catch(function () {});
            var s = e.config.youtube;
            e.embed = new window.YT.Player(r, {
              videoId: i,
              host: function (e) {
                return e.noCookie ? "https://www.youtube-nocookie.com" : "http:" === window.location.protocol ? "http://www.youtube.com" : void 0
              }(s),
              playerVars: f({}, {
                autoplay: e.config.autoplay ? 1 : 0,
                hl: e.config.hl,
                controls: e.supported.ui ? 0 : 1,
                disablekb: 1,
                playsinline: e.config.fullscreen.iosNative ? 0 : 1,
                cc_load_policy: e.captions.active ? 1 : 0,
                cc_lang_pref: e.config.captions.language,
                widget_referrer: window ? window.location.href : null
              }, s),
              events: {
                onError: function (t) {
                  if (!e.media.error) {
                    var n = t.data,
                      i = {
                        2: "The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.",
                        5: "The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.",
                        100: "The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.",
                        101: "The owner of the requested video does not allow it to be played in embedded players.",
                        150: "The owner of the requested video does not allow it to be played in embedded players."
                      } [n] || "An unknown error occured";
                    e.media.error = {
                      code: n,
                      message: i
                    }, h.call(e, e.media, "error")
                  }
                },
                onPlaybackRateChange: function (t) {
                  var n = t.target;
                  e.media.playbackRate = n.getPlaybackRate(), h.call(e, e.media, "ratechange")
                },
                onReady: function (t) {
                  if (!ge.function(e.media.play)) {
                    var n = t.target;
                    $e.getTitle.call(e, i), e.media.play = function () {
                      Q.call(e, !0), n.playVideo()
                    }, e.media.pause = function () {
                      Q.call(e, !1), n.pauseVideo()
                    }, e.media.stop = function () {
                      n.stopVideo()
                    }, e.media.duration = n.getDuration(), e.media.paused = !0, e.media.currentTime = 0, Object.defineProperty(e.media, "currentTime", {
                      get: function () {
                        return Number(n.getCurrentTime())
                      },
                      set: function (t) {
                        e.paused && !e.embed.hasPlayed && e.embed.mute(), e.media.seeking = !0, h.call(e, e.media, "seeking"), n.seekTo(t)
                      }
                    }), Object.defineProperty(e.media, "playbackRate", {
                      get: function () {
                        return n.getPlaybackRate()
                      },
                      set: function (e) {
                        n.setPlaybackRate(e)
                      }
                    });
                    var r = e.config.volume;
                    Object.defineProperty(e.media, "volume", {
                      get: function () {
                        return r
                      },
                      set: function (t) {
                        r = t, n.setVolume(100 * r), h.call(e, e.media, "volumechange")
                      }
                    });
                    var o = e.config.muted;
                    Object.defineProperty(e.media, "muted", {
                      get: function () {
                        return o
                      },
                      set: function (t) {
                        var i = ge.boolean(t) ? t : o;
                        o = i, n[i ? "mute" : "unMute"](), h.call(e, e.media, "volumechange")
                      }
                    }), Object.defineProperty(e.media, "currentSrc", {
                      get: function () {
                        return n.getVideoUrl()
                      }
                    }), Object.defineProperty(e.media, "ended", {
                      get: function () {
                        return e.currentTime === e.duration
                      }
                    }), e.options.speed = n.getAvailablePlaybackRates(), e.supported.ui && e.media.setAttribute("tabindex", -1), h.call(e, e.media, "timeupdate"), h.call(e, e.media, "durationchange"), clearInterval(e.timers.buffering), e.timers.buffering = setInterval(function () {
                      e.media.buffered = n.getVideoLoadedFraction(), (null === e.media.lastBuffered || e.media.lastBuffered < e.media.buffered) && h.call(e, e.media, "progress"), e.media.lastBuffered = e.media.buffered, 1 === e.media.buffered && (clearInterval(e.timers.buffering), h.call(e, e.media, "canplaythrough"))
                    }, 200), setTimeout(function () {
                      return je.build.call(e)
                    }, 50)
                  }
                },
                onStateChange: function (t) {
                  var n = t.target;
                  clearInterval(e.timers.playing);
                  switch (e.media.seeking && [1, 2].includes(t.data) && (e.media.seeking = !1, h.call(e, e.media, "seeked")), t.data) {
                    case -1:
                      h.call(e, e.media, "timeupdate"), e.media.buffered = n.getVideoLoadedFraction(), h.call(e, e.media, "progress");
                      break;
                    case 0:
                      Q.call(e, !1), e.media.loop ? (n.stopVideo(), n.playVideo()) : h.call(e, e.media, "ended");
                      break;
                    case 1:
                      e.config.autoplay || !e.media.paused || e.embed.hasPlayed ? (Q.call(e, !0), h.call(e, e.media, "playing"), e.timers.playing = setInterval(function () {
                        h.call(e, e.media, "timeupdate")
                      }, 50), e.media.duration !== n.getDuration() && (e.media.duration = n.getDuration(), h.call(e, e.media, "durationchange"))) : e.media.pause();
                      break;
                    case 2:
                      e.muted || e.embed.unMute(), Q.call(e, !1)
                  }
                  h.call(e, e.elements.container, "statechange", !1, {
                    code: t.data
                  })
                }
              }
            })
          }
        }
      },
      Be = {
        setup: function () {
          this.media ? (S(this.elements.container, this.config.classNames.type.replace("{0}", this.type), !0), S(this.elements.container, this.config.classNames.provider.replace("{0}", this.provider), !0), this.isEmbed && S(this.elements.container, this.config.classNames.type.replace("{0}", "video"), !0), this.isVideo && (this.elements.wrapper = v("div", {
            class: this.config.classNames.video
          }), m(this.media, this.elements.wrapper), this.elements.poster = v("div", {
            class: this.config.classNames.poster
          }), this.elements.wrapper.appendChild(this.elements.poster)), this.isHTML5 ? Te.extend.call(this) : this.isYouTube ? $e.setup.call(this) : this.isVimeo && He.setup.call(this)) : this.debug.warn("No media element found!")
        }
      },
      Ve = function () {
        function t(n) {
          var i = this;
          e(this, t), this.player = n, this.config = n.config.ads, this.playing = !1, this.initialized = !1, this.elements = {
            container: null,
            displayContainer: null
          }, this.manager = null, this.loader = null, this.cuePoints = null, this.events = {}, this.safetyTimer = null, this.countdownTimer = null, this.managerPromise = new Promise(function (e, t) {
            i.on("loaded", e), i.on("error", t)
          }), this.load()
        }
        return n(t, [{
          key: "load",
          value: function () {
            var e = this;
            this.enabled && (ge.object(window.google) && ge.object(window.google.ima) ? this.ready() : Y(this.player.config.urls.googleIMA.sdk).then(function () {
              e.ready()
            }).catch(function () {
              e.trigger("error", new Error("Google IMA SDK failed to load"))
            }))
          }
        }, {
          key: "ready",
          value: function () {
            var e = this;
            this.enabled || function (e) {
              e.manager && e.manager.destroy(), e.elements.displayContainer && e.elements.displayContainer.destroy(), e.elements.container.remove()
            }(this), this.startSafetyTimer(12e3, "ready()"), this.managerPromise.then(function () {
              e.clearSafetyTimer("onAdsManagerLoaded()")
            }), this.listeners(), this.setupIMA()
          }
        }, {
          key: "setupIMA",
          value: function () {
            this.elements.container = v("div", {
              class: this.player.config.classNames.ads
            }), this.player.elements.container.appendChild(this.elements.container), google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED), google.ima.settings.setLocale(this.player.config.ads.language), google.ima.settings.setDisableCustomPlaybackForIOS10Plus(this.player.config.playsinline), this.elements.displayContainer = new google.ima.AdDisplayContainer(this.elements.container, this.player.media), this.requestAds()
          }
        }, {
          key: "requestAds",
          value: function () {
            var e = this,
              t = this.player.elements.container;
            try {
              this.loader = new google.ima.AdsLoader(this.elements.displayContainer), this.loader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, function (t) {
                return e.onAdsManagerLoaded(t)
              }, !1), this.loader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (t) {
                return e.onAdError(t)
              }, !1);
              var n = new google.ima.AdsRequest;
              n.adTagUrl = this.tagUrl, n.linearAdSlotWidth = t.offsetWidth, n.linearAdSlotHeight = t.offsetHeight, n.nonLinearAdSlotWidth = t.offsetWidth, n.nonLinearAdSlotHeight = t.offsetHeight, n.forceNonLinearFullSlot = !1, n.setAdWillPlayMuted(!this.player.muted), this.loader.requestAds(n)
            } catch (e) {
              this.onAdError(e)
            }
          }
        }, {
          key: "pollCountdown",
          value: function () {
            var e = this;
            if (!(arguments.length > 0 && void 0 !== arguments[0] && arguments[0])) return clearInterval(this.countdownTimer), void this.elements.container.removeAttribute("data-badge-text");
            this.countdownTimer = setInterval(function () {
              var t = B(Math.max(e.manager.getRemainingTime(), 0)),
                n = "".concat(Se.get("advertisement", e.player.config), " - ").concat(t);
              e.elements.container.setAttribute("data-badge-text", n)
            }, 100)
          }
        }, {
          key: "onAdsManagerLoaded",
          value: function (e) {
            var t = this;
            if (this.enabled) {
              var n = new google.ima.AdsRenderingSettings;
              n.restoreCustomPlaybackStateOnAdBreakComplete = !0, n.enablePreloading = !0, this.manager = e.getAdsManager(this.player, n), this.cuePoints = this.manager.getCuePoints(), this.manager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (e) {
                return t.onAdError(e)
              }), Object.keys(google.ima.AdEvent.Type).forEach(function (e) {
                t.manager.addEventListener(google.ima.AdEvent.Type[e], function (e) {
                  return t.onAdEvent(e)
                })
              }), this.trigger("loaded")
            }
          }
        }, {
          key: "addCuePoints",
          value: function () {
            var e = this;
            ge.empty(this.cuePoints) || this.cuePoints.forEach(function (t) {
              if (0 !== t && -1 !== t && t < e.player.duration) {
                var n = e.player.elements.progress;
                if (ge.element(n)) {
                  var i = 100 / e.player.duration * t,
                    r = v("span", {
                      class: e.player.config.classNames.cues
                    });
                  r.style.left = "".concat(i.toString(), "%"), n.appendChild(r)
                }
              }
            })
          }
        }, {
          key: "onAdEvent",
          value: function (e) {
            var t = this,
              n = this.player.elements.container,
              i = e.getAd(),
              r = e.getAdData();
            switch (function (e) {
              h.call(t.player, t.player.media, "ads".concat(e.replace(/_/g, "").toLowerCase()))
            }(e.type), e.type) {
              case google.ima.AdEvent.Type.LOADED:
                this.trigger("loaded"), this.pollCountdown(!0), i.isLinear() || (i.width = n.offsetWidth, i.height = n.offsetHeight);
                break;
              case google.ima.AdEvent.Type.STARTED:
                this.manager.setVolume(this.player.volume);
                break;
              case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                this.loadAds();
                break;
              case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
                this.pauseContent();
                break;
              case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
                this.pollCountdown(), this.resumeContent();
                break;
              case google.ima.AdEvent.Type.LOG:
                r.adError && this.player.debug.warn("Non-fatal ad error: ".concat(r.adError.getMessage()))
            }
          }
        }, {
          key: "onAdError",
          value: function (e) {
            this.cancel(), this.player.debug.warn("Ads error", e)
          }
        }, {
          key: "listeners",
          value: function () {
            var e, t = this,
              n = this.player.elements.container;
            this.player.on("canplay", function () {
              t.addCuePoints()
            }), this.player.on("ended", function () {
              t.loader.contentComplete()
            }), this.player.on("timeupdate", function () {
              e = t.player.currentTime
            }), this.player.on("seeked", function () {
              var n = t.player.currentTime;
              ge.empty(t.cuePoints) || t.cuePoints.forEach(function (i, r) {
                e < i && i < n && (t.manager.discardAdBreak(), t.cuePoints.splice(r, 1))
              })
            }), window.addEventListener("resize", function () {
              t.manager && t.manager.resize(n.offsetWidth, n.offsetHeight, google.ima.ViewMode.NORMAL)
            })
          }
        }, {
          key: "play",
          value: function () {
            var e = this,
              t = this.player.elements.container;
            this.managerPromise || this.resumeContent(), this.managerPromise.then(function () {
              e.manager.setVolume(e.player.volume), e.elements.displayContainer.initialize();
              try {
                e.initialized || (e.manager.init(t.offsetWidth, t.offsetHeight, google.ima.ViewMode.NORMAL), e.manager.start()), e.initialized = !0
              } catch (t) {
                e.onAdError(t)
              }
            }).catch(function () {})
          }
        }, {
          key: "resumeContent",
          value: function () {
            this.elements.container.style.zIndex = "", this.playing = !1, this.player.media.play()
          }
        }, {
          key: "pauseContent",
          value: function () {
            this.elements.container.style.zIndex = 3, this.playing = !0, this.player.media.pause()
          }
        }, {
          key: "cancel",
          value: function () {
            this.initialized && this.resumeContent(), this.trigger("error"), this.loadAds()
          }
        }, {
          key: "loadAds",
          value: function () {
            var e = this;
            this.managerPromise.then(function () {
              e.manager && e.manager.destroy(), e.managerPromise = new Promise(function (t) {
                e.on("loaded", t), e.player.debug.log(e.manager)
              }), e.requestAds()
            }).catch(function () {})
          }
        }, {
          key: "trigger",
          value: function (e) {
            for (var t = this, n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++) i[r - 1] = arguments[r];
            var o = this.events[e];
            ge.array(o) && o.forEach(function (e) {
              ge.function(e) && e.apply(t, i)
            })
          }
        }, {
          key: "on",
          value: function (e, t) {
            return ge.array(this.events[e]) || (this.events[e] = []), this.events[e].push(t), this
          }
        }, {
          key: "startSafetyTimer",
          value: function (e, t) {
            var n = this;
            this.player.debug.log("Safety timer invoked from: ".concat(t)), this.safetyTimer = setTimeout(function () {
              n.cancel(), n.clearSafetyTimer("startSafetyTimer()")
            }, e)
          }
        }, {
          key: "clearSafetyTimer",
          value: function (e) {
            ge.nullOrUndefined(this.safetyTimer) || (this.player.debug.log("Safety timer cleared from: ".concat(e)), clearTimeout(this.safetyTimer), this.safetyTimer = null)
          }
        }, {
          key: "enabled",
          get: function () {
            var e = this.config;
            return this.player.isHTML5 && this.player.isVideo && e.enabled && (!ge.empty(e.publisherId) || ge.url(e.tagUrl))
          }
        }, {
          key: "tagUrl",
          get: function () {
            var e = this.config;
            if (ge.url(e.tagUrl)) return e.tagUrl;
            var t = {
              AV_PUBLISHERID: "58c25bb0073ef448b1087ad6",
              AV_CHANNELID: "5a0458dc28a06145e4519d21",
              AV_URL: window.location.hostname,
              cb: Date.now(),
              AV_WIDTH: 640,
              AV_HEIGHT: 480,
              AV_CDIM2: this.publisherId
            };
            return "".concat("https://go.aniview.com/api/adserver6/vast/", "?").concat(W(t))
          }
        }]), t
      }(),
      We = function () {
        function t(n) {
          e(this, t), this.player = n, this.thumbnails = [], this.loaded = !1, this.lastMouseMoveTime = Date.now(), this.mouseDown = !1, this.loadedImages = [], this.elements = {
            thumb: {},
            scrubbing: {}
          }, this.load()
        }
        return n(t, [{
          key: "load",
          value: function () {
            var e = this;
            this.player.elements.display.seekTooltip && (this.player.elements.display.seekTooltip.hidden = this.enabled), this.enabled && this.getThumbnails().then(function () {
              e.enabled && (e.render(), e.determineContainerAutoSizing(), e.loaded = !0)
            })
          }
        }, {
          key: "getThumbnails",
          value: function () {
            var e = this;
            return new Promise(function (t) {
              var n = e.player.config.previewThumbnails.src;
              if (ge.empty(n)) throw new Error("Missing previewThumbnails.src config attribute");
              var i = (ge.string(n) ? [n] : n).map(function (t) {
                return e.getThumbnail(t)
              });
              Promise.all(i).then(function () {
                e.thumbnails.sort(function (e, t) {
                  return e.height - t.height
                }), e.player.debug.log("Preview thumbnails", e.thumbnails), t()
              })
            })
          }
        }, {
          key: "getThumbnail",
          value: function (e) {
            var t = this;
            return new Promise(function (n) {
              q(e).then(function (i) {
                var o = {
                  frames: function (e) {
                    var t = [];
                    return e.split(/\r\n\r\n|\n\n|\r\r/).forEach(function (e) {
                      var n = {};
                      e.split(/\r\n|\n|\r/).forEach(function (e) {
                        if (ge.number(n.startTime)) {
                          if (!ge.empty(e.trim()) && ge.empty(n.text)) {
                            var t = e.trim().split("#xywh="),
                              i = r(t, 1);
                            if (n.text = i[0], t[1]) {
                              var o = r(t[1].split(","), 4);
                              n.x = o[0], n.y = o[1], n.w = o[2], n.h = o[3]
                            }
                          }
                        } else {
                          var a = e.match(/([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})( ?--> ?)([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})/);
                          a && (n.startTime = 60 * Number(a[1] || 0) * 60 + 60 * Number(a[2]) + Number(a[3]) + Number("0.".concat(a[4])), n.endTime = 60 * Number(a[6] || 0) * 60 + 60 * Number(a[7]) + Number(a[8]) + Number("0.".concat(a[9])))
                        }
                      }), n.text && t.push(n)
                    }), t
                  }(i),
                  height: null,
                  urlPrefix: ""
                };
                o.frames[0].text.startsWith("/") || o.frames[0].text.startsWith("http://") || o.frames[0].text.startsWith("https://") || (o.urlPrefix = e.substring(0, e.lastIndexOf("/") + 1));
                var a = new Image;
                a.onload = function () {
                  o.height = a.naturalHeight, o.width = a.naturalWidth, t.thumbnails.push(o), n()
                }, a.src = o.urlPrefix + o.frames[0].text
              })
            })
          }
        }, {
          key: "startMove",
          value: function (e) {
            if (this.loaded && ge.event(e) && ["touchmove", "mousemove"].includes(e.type) && this.player.media.duration) {
              if ("touchmove" === e.type) this.seekTime = this.player.media.duration * (this.player.elements.inputs.seek.value / 100);
              else {
                var t = this.player.elements.progress.getBoundingClientRect(),
                  n = 100 / t.width * (e.pageX - t.left);
                this.seekTime = this.player.media.duration * (n / 100), this.seekTime < 0 && (this.seekTime = 0), this.seekTime > this.player.media.duration - 1 && (this.seekTime = this.player.media.duration - 1), this.mousePosX = e.pageX, this.elements.thumb.time.innerText = B(this.seekTime)
              }
              this.showImageAtCurrentTime()
            }
          }
        }, {
          key: "endMove",
          value: function () {
            this.toggleThumbContainer(!1, !0)
          }
        }, {
          key: "startScrubbing",
          value: function (e) {
            !1 !== e.button && 0 !== e.button || (this.mouseDown = !0, this.player.media.duration && (this.toggleScrubbingContainer(!0), this.toggleThumbContainer(!1, !0), this.showImageAtCurrentTime()))
          }
        }, {
          key: "endScrubbing",
          value: function () {
            var e = this;
            this.mouseDown = !1, Math.ceil(this.lastTime) === Math.ceil(this.player.media.currentTime) ? this.toggleScrubbingContainer(!1) : d.call(this.player, this.player.media, "timeupdate", function () {
              e.mouseDown || e.toggleScrubbingContainer(!1)
            })
          }
        }, {
          key: "listeners",
          value: function () {
            var e = this;
            this.player.on("play", function () {
              e.toggleThumbContainer(!1, !0)
            }), this.player.on("seeked", function () {
              e.toggleThumbContainer(!1)
            }), this.player.on("timeupdate", function () {
              e.lastTime = e.player.media.currentTime
            })
          }
        }, {
          key: "render",
          value: function () {
            this.elements.thumb.container = v("div", {
              class: this.player.config.classNames.previewThumbnails.thumbContainer
            }), this.elements.thumb.imageContainer = v("div", {
              class: this.player.config.classNames.previewThumbnails.imageContainer
            }), this.elements.thumb.container.appendChild(this.elements.thumb.imageContainer);
            var e = v("div", {
              class: this.player.config.classNames.previewThumbnails.timeContainer
            });
            this.elements.thumb.time = v("span", {}, "00:00"), e.appendChild(this.elements.thumb.time), this.elements.thumb.container.appendChild(e), ge.element(this.player.elements.progress) && this.player.elements.progress.appendChild(this.elements.thumb.container), this.elements.scrubbing.container = v("div", {
              class: this.player.config.classNames.previewThumbnails.scrubbingContainer
            }), this.player.elements.wrapper.appendChild(this.elements.scrubbing.container)
          }
        }, {
          key: "showImageAtCurrentTime",
          value: function () {
            var e = this;
            this.mouseDown ? this.setScrubbingContainerSize() : this.setThumbContainerSizeAndPos();
            var t = this.thumbnails[0].frames.findIndex(function (t) {
                return e.seekTime >= t.startTime && e.seekTime <= t.endTime
              }),
              n = t >= 0,
              i = 0;
            this.mouseDown || this.toggleThumbContainer(n), n && (this.thumbnails.forEach(function (n, r) {
              e.loadedImages.includes(n.frames[t].text) && (i = r)
            }), t !== this.showingThumb && (this.showingThumb = t, this.loadImage(i)))
          }
        }, {
          key: "loadImage",
          value: function () {
            var e = this,
              t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
              n = this.showingThumb,
              i = this.thumbnails[t],
              r = i.urlPrefix,
              o = i.frames[n],
              a = i.frames[n].text,
              s = r + a;
            if (this.currentImageElement && this.currentImageElement.dataset.filename === a) this.showImage(this.currentImageElement, o, t, n, a, !1), this.currentImageElement.dataset.index = n, this.removeOldImages(this.currentImageElement);
            else {
              this.loadingImage && this.usingSprites && (this.loadingImage.onload = null);
              var l = new Image;
              l.src = s, l.dataset.index = n, l.dataset.filename = a, this.showingThumbFilename = a, this.player.debug.log("Loading image: ".concat(s)), l.onload = function () {
                return e.showImage(l, o, t, n, a, !0)
              }, this.loadingImage = l, this.removeOldImages(l)
            }
          }
        }, {
          key: "showImage",
          value: function (e, t, n, i, r) {
            var o = !(arguments.length > 5 && void 0 !== arguments[5]) || arguments[5];
            this.player.debug.log("Showing thumb: ".concat(r, ". num: ").concat(i, ". qual: ").concat(n, ". newimg: ").concat(o)), this.setImageSizeAndOffset(e, t), o && (this.currentImageContainer.appendChild(e), this.currentImageElement = e, this.loadedImages.includes(r) || this.loadedImages.push(r)), this.preloadNearby(i, !0).then(this.preloadNearby(i, !1)).then(this.getHigherQuality(n, e, t, r))
          }
        }, {
          key: "removeOldImages",
          value: function (e) {
            var t = this;
            Array.from(this.currentImageContainer.children).forEach(function (n) {
              if ("img" === n.tagName.toLowerCase()) {
                var i = t.usingSprites ? 500 : 1e3;
                if (n.dataset.index !== e.dataset.index && !n.dataset.deleting) {
                  n.dataset.deleting = !0;
                  var r = t.currentImageContainer;
                  setTimeout(function () {
                    r.removeChild(n), t.player.debug.log("Removing thumb: ".concat(n.dataset.filename))
                  }, i)
                }
              }
            })
          }
        }, {
          key: "preloadNearby",
          value: function (e) {
            var t = this,
              n = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
            return new Promise(function (i) {
              setTimeout(function () {
                var r = t.thumbnails[0].frames[e].text;
                if (t.showingThumbFilename === r) {
                  var o = !1;
                  (n ? t.thumbnails[0].frames.slice(e) : t.thumbnails[0].frames.slice(0, e).reverse()).forEach(function (e) {
                    var n = e.text;
                    if (n !== r && !t.loadedImages.includes(n)) {
                      o = !0, t.player.debug.log("Preloading thumb filename: ".concat(n));
                      var a = t.thumbnails[0].urlPrefix + n,
                        s = new Image;
                      s.src = a, s.onload = function () {
                        t.player.debug.log("Preloaded thumb filename: ".concat(n)), t.loadedImages.includes(n) || t.loadedImages.push(n), i()
                      }
                    }
                  }), o || i()
                }
              }, 300)
            })
          }
        }, {
          key: "getHigherQuality",
          value: function (e, t, n, i) {
            var r = this;
            if (e < this.thumbnails.length - 1) {
              var o = t.naturalHeight;
              this.usingSprites && (o = n.h), o < this.thumbContainerHeight && setTimeout(function () {
                r.showingThumbFilename === i && (r.player.debug.log("Showing higher quality thumb for: ".concat(i)), r.loadImage(e + 1))
              }, 300)
            }
          }
        }, {
          key: "toggleThumbContainer",
          value: function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
              t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
              n = this.player.config.classNames.previewThumbnails.thumbContainerShown;
            this.elements.thumb.container.classList.toggle(n, e), !e && t && (this.showingThumb = null, this.showingThumbFilename = null)
          }
        }, {
          key: "toggleScrubbingContainer",
          value: function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
              t = this.player.config.classNames.previewThumbnails.scrubbingContainerShown;
            this.elements.scrubbing.container.classList.toggle(t, e), e || (this.showingThumb = null, this.showingThumbFilename = null)
          }
        }, {
          key: "determineContainerAutoSizing",
          value: function () {
            this.elements.thumb.imageContainer.clientHeight > 20 && (this.sizeSpecifiedInCSS = !0)
          }
        }, {
          key: "setThumbContainerSizeAndPos",
          value: function () {
            if (!this.sizeSpecifiedInCSS) {
              var e = Math.floor(this.thumbContainerHeight * this.thumbAspectRatio);
              this.elements.thumb.imageContainer.style.height = "".concat(this.thumbContainerHeight, "px"), this.elements.thumb.imageContainer.style.width = "".concat(e, "px")
            }
            this.setThumbContainerPos()
          }
        }, {
          key: "setThumbContainerPos",
          value: function () {
            var e = this.player.elements.progress.getBoundingClientRect(),
              t = this.player.elements.container.getBoundingClientRect(),
              n = this.elements.thumb.container,
              i = t.left - e.left + 10,
              r = t.right - e.left - n.clientWidth - 10,
              o = this.mousePosX - e.left - n.clientWidth / 2;
            o < i && (o = i), o > r && (o = r), n.style.left = "".concat(o, "px")
          }
        }, {
          key: "setScrubbingContainerSize",
          value: function () {
            this.elements.scrubbing.container.style.width = "".concat(this.player.media.clientWidth, "px"), this.elements.scrubbing.container.style.height = "".concat(this.player.media.clientWidth / this.thumbAspectRatio, "px")
          }
        }, {
          key: "setImageSizeAndOffset",
          value: function (e, t) {
            if (this.usingSprites) {
              var n = this.thumbContainerHeight / t.h;
              e.style.height = "".concat(Math.floor(e.naturalHeight * n), "px"), e.style.width = "".concat(Math.floor(e.naturalWidth * n), "px"), e.style.left = "-".concat(t.x * n, "px"), e.style.top = "-".concat(t.y * n, "px")
            }
          }
        }, {
          key: "enabled",
          get: function () {
            return this.player.isHTML5 && this.player.isVideo && this.player.config.previewThumbnails.enabled
          }
        }, {
          key: "currentImageContainer",
          get: function () {
            return this.mouseDown ? this.elements.scrubbing.container : this.elements.thumb.imageContainer
          }
        }, {
          key: "usingSprites",
          get: function () {
            return Object.keys(this.thumbnails[0].frames[0]).includes("w")
          }
        }, {
          key: "thumbAspectRatio",
          get: function () {
            return this.usingSprites ? this.thumbnails[0].frames[0].w / this.thumbnails[0].frames[0].h : this.thumbnails[0].width / this.thumbnails[0].height
          }
        }, {
          key: "thumbContainerHeight",
          get: function () {
            return this.mouseDown ? Math.floor(this.player.media.clientWidth / this.thumbAspectRatio) : Math.floor(this.player.media.clientWidth / this.thumbAspectRatio / 4)
          }
        }, {
          key: "currentImageElement",
          get: function () {
            return this.mouseDown ? this.currentScrubbingImageElement : this.currentThumbnailImageElement
          },
          set: function (e) {
            this.mouseDown ? this.currentScrubbingImageElement = e : this.currentThumbnailImageElement = e
          }
        }]), t
      }(),
      Ue = {
        insertElements: function (e, t) {
          var n = this;
          ge.string(t) ? b(e, this.media, {
            src: t
          }) : ge.array(t) && t.forEach(function (t) {
            b(e, n.media, t)
          })
        },
        change: function (e) {
          var t = this;
          p(e, "sources.length") ? (Te.cancelRequests.call(this), this.destroy.call(this, function () {
            t.options.quality = [], y(t.media), t.media = null, ge.element(t.elements.container) && t.elements.container.removeAttribute("class");
            var n = e.sources,
              i = e.type,
              o = r(n, 1)[0],
              a = o.provider,
              s = void 0 === a ? Ge.html5 : a,
              l = o.src,
              u = "html5" === s ? i : "div",
              c = "html5" === s ? {} : {
                src: l
              };
            Object.assign(t, {
              provider: s,
              type: i,
              supported: ke.check(i, s, t.config.playsinline),
              media: v(u, c)
            }), t.elements.container.appendChild(t.media), ge.boolean(e.autoplay) && (t.config.autoplay = e.autoplay), t.isHTML5 && (t.config.crossorigin && t.media.setAttribute("crossorigin", ""), t.config.autoplay && t.media.setAttribute("autoplay", ""), ge.empty(e.poster) || (t.poster = e.poster), t.config.loop.active && t.media.setAttribute("loop", ""), t.config.muted && t.media.setAttribute("muted", ""), t.config.playsinline && t.media.setAttribute("playsinline", "")), je.addStyleHook.call(t), t.isHTML5 && Ue.insertElements.call(t, "source", n), t.config.title = e.title, Be.setup.call(t), t.isHTML5 && Object.keys(e).includes("tracks") && Ue.insertElements.call(t, "track", e.tracks), (t.isHTML5 || t.isEmbed && !t.supported.ui) && je.build.call(t), t.isHTML5 && t.media.load(), t.previewThumbnails && t.previewThumbnails.load(), t.fullscreen.update()
          }, !0)) : this.debug.warn("Invalid source format")
        }
      },
      Xe = function () {
        function t(n, i) {
          var r = this;
          if (e(this, t), this.timers = {}, this.ready = !1, this.loading = !1, this.failed = !1, this.touch = ke.touch, this.media = n, ge.string(this.media) && (this.media = document.querySelectorAll(this.media)), (window.jQuery && this.media instanceof jQuery || ge.nodeList(this.media) || ge.array(this.media)) && (this.media = this.media[0]), this.config = f({}, Le, t.defaults, i || {}, function () {
              try {
                return JSON.parse(r.media.getAttribute("data-plyr-config"))
              } catch (e) {
                return {}
              }
            }()), this.elements = {
              container: null,
              captions: null,
              buttons: {},
              display: {},
              progress: {},
              inputs: {},
              settings: {
                popup: null,
                menu: null,
                panels: {},
                buttons: {}
              }
            }, this.captions = {
              active: null,
              currentTrack: -1,
              meta: new WeakMap
            }, this.fullscreen = {
              active: !1
            }, this.options = {
              speed: [],
              quality: []
            }, this.debug = new Oe(this.config.debug), this.debug.log("Config", this.config), this.debug.log("Support", ke), !ge.nullOrUndefined(this.media) && ge.element(this.media))
            if (this.media.plyr) this.debug.warn("Target already setup");
            else if (this.config.enabled)
            if (ke.check().api) {
              var o = this.media.cloneNode(!0);
              o.autoplay = !1, this.elements.original = o;
              var a = this.media.tagName.toLowerCase(),
                s = null,
                l = null;
              switch (a) {
                case "div":
                  if (s = this.media.querySelector("iframe"), ge.element(s)) {
                    if (l = V(s.getAttribute("src")), this.provider = function (e) {
                        return /^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(e) ? Ge.youtube : /^https?:\/\/player.vimeo.com\/video\/\d{0,9}(?=\b|\/)/.test(e) ? Ge.vimeo : null
                      }(l.toString()), this.elements.container = this.media, this.media = s, this.elements.container.className = "", l.search.length) {
                      var c = ["1", "true"];
                      c.includes(l.searchParams.get("autoplay")) && (this.config.autoplay = !0), c.includes(l.searchParams.get("loop")) && (this.config.loop.active = !0), this.isYouTube ? (this.config.playsinline = c.includes(l.searchParams.get("playsinline")), this.config.youtube.hl = l.searchParams.get("hl")) : this.config.playsinline = !0
                    }
                  } else this.provider = this.media.getAttribute(this.config.attributes.embed.provider), this.media.removeAttribute(this.config.attributes.embed.provider);
                  if (ge.empty(this.provider) || !Object.keys(Ge).includes(this.provider)) return void this.debug.error("Setup failed: Invalid provider");
                  this.type = _e.video;
                  break;
                case "video":
                case "audio":
                  this.type = a, this.provider = Ge.html5, this.media.hasAttribute("crossorigin") && (this.config.crossorigin = !0), this.media.hasAttribute("autoplay") && (this.config.autoplay = !0), (this.media.hasAttribute("playsinline") || this.media.hasAttribute("webkit-playsinline")) && (this.config.playsinline = !0), this.media.hasAttribute("muted") && (this.config.muted = !0), this.media.hasAttribute("loop") && (this.config.loop.active = !0);
                  break;
                default:
                  return void this.debug.error("Setup failed: unsupported type")
              }
              this.supported = ke.check(this.type, this.provider, this.config.playsinline), this.supported.api ? (this.eventListeners = [], this.listeners = new Re(this), this.storage = new Ce(this), this.media.plyr = this, ge.element(this.elements.container) || (this.elements.container = v("div", {
                tabindex: 0
              }), m(this.media, this.elements.container)), je.addStyleHook.call(this), Be.setup.call(this), this.config.debug && u.call(this, this.elements.container, this.config.events.join(" "), function (e) {
                r.debug.log("event: ".concat(e.type))
              }), (this.isHTML5 || this.isEmbed && !this.supported.ui) && je.build.call(this), this.listeners.container(), this.listeners.global(), this.fullscreen = new Fe(this), this.config.ads.enabled && (this.ads = new Ve(this)), this.isHTML5 && this.config.autoplay && setTimeout(function () {
                return r.play()
              }, 10), this.lastSeekTime = 0, this.config.previewThumbnails.enabled && (this.previewThumbnails = new We(this))) : this.debug.error("Setup failed: no support")
            } else this.debug.error("Setup failed: no support");
          else this.debug.error("Setup failed: disabled by config");
          else this.debug.error("Setup failed: no suitable element passed")
        }
        return n(t, [{
          key: "play",
          value: function () {
            var e = this;
            return ge.function(this.media.play) ? (this.ads && this.ads.enabled && this.ads.managerPromise.then(function () {
              return e.ads.play()
            }).catch(function () {
              return e.media.play()
            }), this.media.play()) : null
          }
        }, {
          key: "pause",
          value: function () {
            this.playing && ge.function(this.media.pause) && this.media.pause()
          }
        }, {
          key: "togglePlay",
          value: function (e) {
            (ge.boolean(e) ? e : !this.playing) ? this.play(): this.pause()
          }
        }, {
          key: "stop",
          value: function () {
            this.isHTML5 ? (this.pause(), this.restart()) : ge.function(this.media.stop) && this.media.stop()
          }
        }, {
          key: "restart",
          value: function () {
            this.currentTime = 0
          }
        }, {
          key: "rewind",
          value: function (e) {
            this.currentTime = this.currentTime - (ge.number(e) ? e : this.config.seekTime)
          }
        }, {
          key: "forward",
          value: function (e) {
            this.currentTime = this.currentTime + (ge.number(e) ? e : this.config.seekTime)
          }
        }, {
          key: "increaseVolume",
          value: function (e) {
            var t = this.media.muted ? 0 : this.volume;
            this.volume = t + (ge.number(e) ? e : 0)
          }
        }, {
          key: "decreaseVolume",
          value: function (e) {
            this.increaseVolume(-e)
          }
        }, {
          key: "toggleCaptions",
          value: function (e) {
            De.toggle.call(this, e, !1)
          }
        }, {
          key: "airplay",
          value: function () {
            ke.airplay && this.media.webkitShowPlaybackTargetPicker()
          }
        }, {
          key: "toggleControls",
          value: function (e) {
            if (this.supported.ui && !this.isAudio) {
              var t = C(this.elements.container, this.config.classNames.hideControls),
                n = void 0 === e ? void 0 : !e,
                i = S(this.elements.container, this.config.classNames.hideControls, n);
              if (i && this.config.controls.includes("settings") && !ge.empty(this.config.settings) && Ie.toggleMenu.call(this, !1), i !== t) {
                var r = i ? "controlshidden" : "controlsshown";
                h.call(this, this.media, r)
              }
              return !i
            }
            return !1
          }
        }, {
          key: "on",
          value: function (e, t) {
            u.call(this, this.elements.container, e, t)
          }
        }, {
          key: "once",
          value: function (e, t) {
            d.call(this, this.elements.container, e, t)
          }
        }, {
          key: "off",
          value: function (e, t) {
            c(this.elements.container, e, t)
          }
        }, {
          key: "destroy",
          value: function (e) {
            var t = this,
              n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            if (this.ready) {
              var i = function () {
                document.body.style.overflow = "", t.embed = null, n ? (Object.keys(t.elements).length && (y(t.elements.buttons.play), y(t.elements.captions), y(t.elements.controls), y(t.elements.wrapper), t.elements.buttons.play = null, t.elements.captions = null, t.elements.controls = null, t.elements.wrapper = null), ge.function(e) && e()) : (function () {
                  this && this.eventListeners && (this.eventListeners.forEach(function (e) {
                    var t = e.element,
                      n = e.type,
                      i = e.callback,
                      r = e.options;
                    t.removeEventListener(n, i, r)
                  }), this.eventListeners = [])
                }.call(t), k(t.elements.original, t.elements.container), h.call(t, t.elements.original, "destroyed", !0), ge.function(e) && e.call(t.elements.original), t.ready = !1, setTimeout(function () {
                  t.elements = null, t.media = null
                }, 200))
              };
              this.stop(), clearTimeout(this.timers.loading), clearTimeout(this.timers.controls), clearTimeout(this.timers.resized), this.isHTML5 ? (je.toggleNativeControls.call(this, !0), i()) : this.isYouTube ? (clearInterval(this.timers.buffering), clearInterval(this.timers.playing), null !== this.embed && ge.function(this.embed.destroy) && this.embed.destroy(), i()) : this.isVimeo && (null !== this.embed && this.embed.unload().then(i), setTimeout(i, 200))
            }
          }
        }, {
          key: "supports",
          value: function (e) {
            return ke.mime.call(this, e)
          }
        }, {
          key: "isHTML5",
          get: function () {
            return this.provider === Ge.html5
          }
        }, {
          key: "isEmbed",
          get: function () {
            return this.isYouTube || this.isVimeo
          }
        }, {
          key: "isYouTube",
          get: function () {
            return this.provider === Ge.youtube
          }
        }, {
          key: "isVimeo",
          get: function () {
            return this.provider === Ge.vimeo
          }
        }, {
          key: "isVideo",
          get: function () {
            return this.type === _e.video
          }
        }, {
          key: "isAudio",
          get: function () {
            return this.type === _e.audio
          }
        }, {
          key: "playing",
          get: function () {
            return Boolean(this.ready && !this.paused && !this.ended)
          }
        }, {
          key: "paused",
          get: function () {
            return Boolean(this.media.paused)
          }
        }, {
          key: "stopped",
          get: function () {
            return Boolean(this.paused && 0 === this.currentTime)
          }
        }, {
          key: "ended",
          get: function () {
            return Boolean(this.media.ended)
          }
        }, {
          key: "currentTime",
          set: function (e) {
            if (this.duration) {
              var t = ge.number(e) && e > 0;
              this.media.currentTime = t ? Math.min(e, this.duration) : 0, this.debug.log("Seeking to ".concat(this.currentTime, " seconds"))
            }
          },
          get: function () {
            return Number(this.media.currentTime)
          }
        }, {
          key: "buffered",
          get: function () {
            var e = this.media.buffered;
            return ge.number(e) ? e : e && e.length && this.duration > 0 ? e.end(0) / this.duration : 0
          }
        }, {
          key: "seeking",
          get: function () {
            return Boolean(this.media.seeking)
          }
        }, {
          key: "duration",
          get: function () {
            var e = parseFloat(this.config.duration),
              t = (this.media || {}).duration,
              n = ge.number(t) && t !== 1 / 0 ? t : 0;
            return e || n
          }
        }, {
          key: "volume",
          set: function (e) {
            var t = e;
            ge.string(t) && (t = Number(t)), ge.number(t) || (t = this.storage.get("volume")), ge.number(t) || (t = this.config.volume), t > 1 && (t = 1), t < 0 && (t = 0), this.config.volume = t, this.media.volume = t, !ge.empty(e) && this.muted && t > 0 && (this.muted = !1)
          },
          get: function () {
            return Number(this.media.volume)
          }
        }, {
          key: "muted",
          set: function (e) {
            var t = e;
            ge.boolean(t) || (t = this.storage.get("muted")), ge.boolean(t) || (t = this.config.muted), this.config.muted = t, this.media.muted = t
          },
          get: function () {
            return Boolean(this.media.muted)
          }
        }, {
          key: "hasAudio",
          get: function () {
            return !this.isHTML5 || (!!this.isAudio || (Boolean(this.media.mozHasAudio) || Boolean(this.media.webkitAudioDecodedByteCount) || Boolean(this.media.audioTracks && this.media.audioTracks.length)))
          }
        }, {
          key: "speed",
          set: function (e) {
            var t = this,
              n = null;
            ge.number(e) && (n = e), ge.number(n) || (n = this.storage.get("speed")), ge.number(n) || (n = this.config.speed.selected);
            var i = this.minimumSpeed,
              r = this.maximumSpeed;
            n = function () {
              var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
                t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
                n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 255;
              return Math.min(Math.max(e, t), n)
            }(n, i, r), this.config.speed.selected = n, setTimeout(function () {
              t.media.playbackRate = n
            }, 0)
          },
          get: function () {
            return Number(this.media.playbackRate)
          }
        }, {
          key: "minimumSpeed",
          get: function () {
            return this.isYouTube ? Math.min.apply(Math, o(this.options.speed)) : this.isVimeo ? .5 : .0625
          }
        }, {
          key: "maximumSpeed",
          get: function () {
            return this.isYouTube ? Math.max.apply(Math, o(this.options.speed)) : this.isVimeo ? 2 : 16
          }
        }, {
          key: "quality",
          set: function (e) {
            var t = this.config.quality,
              n = this.options.quality;
            if (n.length) {
              var i = [!ge.empty(e) && Number(e), this.storage.get("quality"), t.selected, t.default].find(ge.number),
                r = !0;
              if (!n.includes(i)) {
                var o = function (e, t) {
                  return ge.array(e) && e.length ? e.reduce(function (e, n) {
                    return Math.abs(n - t) < Math.abs(e - t) ? n : e
                  }) : null
                }(n, i);
                this.debug.warn("Unsupported quality option: ".concat(i, ", using ").concat(o, " instead")), i = o, r = !1
              }
              t.selected = i, this.media.quality = i, r && this.storage.set({
                quality: i
              })
            }
          },
          get: function () {
            return this.media.quality
          }
        }, {
          key: "loop",
          set: function (e) {
            var t = ge.boolean(e) ? e : this.config.loop.active;
            this.config.loop.active = t, this.media.loop = t
          },
          get: function () {
            return Boolean(this.media.loop)
          }
        }, {
          key: "source",
          set: function (e) {
            Ue.change.call(this, e)
          },
          get: function () {
            return this.media.currentSrc
          }
        }, {
          key: "download",
          get: function () {
            var e = this.config.urls.download;
            return ge.url(e) ? e : this.source
          },
          set: function (e) {
            ge.url(e) && (this.config.urls.download = e, Ie.setDownloadUrl.call(this))
          }
        }, {
          key: "poster",
          set: function (e) {
            this.isVideo ? je.setPoster.call(this, e, !1).catch(function () {}) : this.debug.warn("Poster can only be set for video")
          },
          get: function () {
            return this.isVideo ? this.media.getAttribute("poster") : null
          }
        }, {
          key: "ratio",
          get: function () {
            if (!this.isVideo) return null;
            var e = L(N.call(this));
            return ge.array(e) ? e.join(":") : e
          },
          set: function (e) {
            this.isVideo ? ge.string(e) && D(e) ? (this.config.ratio = e, G.call(this)) : this.debug.error("Invalid aspect ratio specified (".concat(e, ")")) : this.debug.warn("Aspect ratio can only be set for video")
          }
        }, {
          key: "autoplay",
          set: function (e) {
            var t = ge.boolean(e) ? e : this.config.autoplay;
            this.config.autoplay = t
          },
          get: function () {
            return Boolean(this.config.autoplay)
          }
        }, {
          key: "currentTrack",
          set: function (e) {
            De.set.call(this, e, !1)
          },
          get: function () {
            var e = this.captions,
              t = e.toggled,
              n = e.currentTrack;
            return t ? n : -1
          }
        }, {
          key: "language",
          set: function (e) {
            De.setLanguage.call(this, e, !1)
          },
          get: function () {
            return (De.getCurrentTrack.call(this) || {}).language
          }
        }, {
          key: "pip",
          set: function (e) {
            if (ke.pip) {
              var t = ge.boolean(e) ? e : !this.pip;
              ge.function(this.media.webkitSetPresentationMode) && this.media.webkitSetPresentationMode(t ? Ne.active : Ne.inactive), ge.function(this.media.requestPictureInPicture) && (!this.pip && t ? this.media.requestPictureInPicture() : this.pip && !t && document.exitPictureInPicture())
            }
          },
          get: function () {
            return ke.pip ? ge.empty(this.media.webkitPresentationMode) ? this.media === document.pictureInPictureElement : this.media.webkitPresentationMode === Ne.active : null
          }
        }], [{
          key: "supported",
          value: function (e, t, n) {
            return ke.check(e, t, n)
          }
        }, {
          key: "loadSprite",
          value: function (e, t) {
            return H(e, t)
          }
        }, {
          key: "setup",
          value: function (e) {
            var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
              i = null;
            return ge.string(e) ? i = Array.from(document.querySelectorAll(e)) : ge.nodeList(e) ? i = Array.from(e) : ge.array(e) && (i = e.filter(ge.element)), ge.empty(i) ? null : i.map(function (e) {
              return new t(e, n)
            })
          }
        }]), t
      }();
    return Xe.defaults = function (e) {
      return JSON.parse(JSON.stringify(e))
    }(Le), Xe
  });
var tabGlobal = new Array,
  FF_SVGObservable = function () {
    function e() {
      _classCallCheck(this, e), this.observers = []
    }
    return _createClass(e, [{
      key: "addObserver",
      value: function (e) {
        this.observers.push(e)
      }
    }, {
      key: "removeObserver",
      value: function (e) {
        var t = this.observers.indexOf(e);
        t > -1 && this.observers.splice(t, 1)
      }
    }, {
      key: "notifyObservers",
      value: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        this.observers.forEach(function (t) {
          return t.update(e)
        })
      }
    }]), e
  }(),
  FF_SVGPoint = function () {
    function e() {
      var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      _classCallCheck(this, e);
      var n = {
        x: 0,
        y: 0,
        drawCommand: e.DRAW_COMMANDS.MOVE_TO,
        lineAnimBP: !1
      };
      t = Object.assign(n, t), this.x = t.x, this.y = t.y, this.drawCommand = t.drawCommand, this.lineAnimBP = t.lineAnimBP, this.onCoordinatesChangeObservable = new FF_SVGObservable, this.computedX = 0, this.computedY = 0, window.addEventListener("resize", this.update.bind(this)), this.beforeInitialPositionCompute(t), this.computePointPosition()
    }
    return _createClass(e, null, [{
      key: "DRAW_COMMANDS",
      get: function () {
        return {
          MOVE_TO: "M",
          LINE_TO: "L",
          HORIZONTAL_LINE: "H",
          VERTICAL_LINE: "V",
          CLOSE_PATH: "Z"
        }
      }
    }]), _createClass(e, [{
      key: "beforeInitialPositionCompute",
      value: function (e) {}
    }, {
      key: "update",
      value: function () {
        this.computePointPosition()
      }
    }, {
      key: "computePointPosition",
      value: function () {
        this.computedX = this.x, this.computedY = this.y, this.onCoordinatesChangeObservable.notifyObservers()
      }
    }, {
      key: "getX",
      value: function () {
        return this.x
      }
    }, {
      key: "getY",
      value: function () {
        return this.y
      }
    }, {
      key: "getComputedX",
      value: function () {
        return this.computedX
      }
    }, {
      key: "getComputedY",
      value: function () {
        return this.computedY
      }
    }, {
      key: "getDrawCmd",
      value: function () {
        return this.drawCommand
      }
    }, {
      key: "setX",
      value: function (e) {
        this.x = e, this.computePointPosition()
      }
    }, {
      key: "setY",
      value: function (e) {
        this.y = e, this.computePointPosition()
      }
    }]), e
  }(),
  FF_SVGPointRelativeToHTMLElement = function (e) {
    function t() {
      var e, n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      return _classCallCheck(this, t), (e = _possibleConstructorReturn(this, _getPrototypeOf(t).call(this, n))).attachPositionChangeObservers(), e
    }
    return _inherits(t, FF_SVGPoint), _createClass(t, [{
      key: "beforeInitialPositionCompute",
      value: function (e) {
        this.htmlElement = e.parentElement ? e.parentElement : document.querySelector("body")
      }
    }, {
      key: "attachPositionChangeObservers",
      value: function () {
        var e = this;
        this.positionObserver = new MutationObserver(function (t, n) {
          e.computePointPosition()
        }), this.positionObserver.observe(this.htmlElement, {
          attributes: !0,
          attributeFilter: ["class", "style"]
        }), this.htmlElement.addEventListener("transitionend", this.computePointPosition.bind(this))
      }
    }, {
      key: "getParentPosition",
      value: function () {
        var e = this.htmlElement.getBoundingClientRect(),
          t = window.pageXOffset || document.documentElement.scrollLeft,
          n = window.pageYOffset || document.documentElement.scrollTop;
        return {
          top: e.top + n,
          left: e.left + t
        }
      }
    }, {
      key: "computePointPosition",
      value: function () {
        var e = this.getParentPosition();
        this.computedX = e.left + this.x, this.computedY = e.top + this.y, this.onCoordinatesChangeObservable.notifyObservers()
      }
    }]), t
  }(),
  FF_SVGPointRelativeToHTMLElemPercent = function (e) {
    function t() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      return _classCallCheck(this, t), _possibleConstructorReturn(this, _getPrototypeOf(t).call(this, e))
    }
    return _inherits(t, FF_SVGPointRelativeToHTMLElement), _createClass(t, [{
      key: "computePointPosition",
      value: function () {
        var e = this.htmlElement.getBoundingClientRect(),
          t = this.getParentPosition();
        this.computedX = t.left + e.width * this.x / 100, this.computedY = t.top + e.height * this.y / 100, this.onCoordinatesChangeObservable.notifyObservers()
      }
    }]), t
  }(),
  FF_SVGSectionsAnchorsMerge = function (e) {
    function t() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      return _classCallCheck(this, t), _possibleConstructorReturn(this, _getPrototypeOf(t).call(this, e))
    }
    return _inherits(t, FF_SVGPointRelativeToHTMLElemPercent), _createClass(t, [{
      key: "beforeInitialPositionCompute",
      value: function (e) {
        var t = e.topSection.getBottomAnchorX(),
          n = e.bottomSection.getTopAnchorX();
        this.x = (t + n) / 2, this.y = 0, this.htmlElement = e.bottomSection.getHTMLElement(), this.drawCommand = FF_SVGPoint.DRAW_COMMANDS.LINE_TO
      }
    }]), t
  }(),
  FF_SVGPointRelativeToOtherPoint = function (e) {
    function t() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      return _classCallCheck(this, t), _possibleConstructorReturn(this, _getPrototypeOf(t).call(this, e))
    }
    return _inherits(t, FF_SVGPoint), _createClass(t, [{
      key: "beforeInitialPositionCompute",
      value: function (e) {
        this.parentPoint = e.parentPoint ? e.parentPoint : new FF_SVGPoint(0, 0), this.parentPoint.onCoordinatesChangeObservable.addObserver(this)
      }
    }, {
      key: "computePointPosition",
      value: function () {
        this.computedX = this.parentPoint.getComputedX() + this.x, this.computedY = this.parentPoint.getComputedY() + this.y, this.onCoordinatesChangeObservable.notifyObservers()
      }
    }]), t
  }(),
  FF_SVGPointRelativeToTwoPoints = function (e) {
    function t() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      return _classCallCheck(this, t), _possibleConstructorReturn(this, _getPrototypeOf(t).call(this, e))
    }
    return _inherits(t, FF_SVGPoint), _createClass(t, [{
      key: "beforeInitialPositionCompute",
      value: function (e) {
        this.parentPointX = e.parentPointX, this.parentPointY = e.parentPointY, this.parentPointX.onCoordinatesChangeObservable.addObserver(this), this.parentPointY.onCoordinatesChangeObservable.addObserver(this)
      }
    }, {
      key: "computePointPosition",
      value: function () {
        this.computedX = this.parentPointX.getComputedX(), this.computedY = this.parentPointY.getComputedY(), this.onCoordinatesChangeObservable.notifyObservers()
      }
    }, {
      key: "update",
      value: function () {
        this.computePointPosition()
      }
    }]), t
  }(),
  FF_SVGAbstractPointsCollection = function () {
    function e() {
      _classCallCheck(this, e), this.childs = [], this.onPointsChangeObservable = new FF_SVGObservable
    }
    return _createClass(e, [{
      key: "computePointsPosition",
      value: function () {}
    }, {
      key: "getPoints",
      value: function () {
        return this.childs
      }
    }]), e
  }(),
  FF_SVGLineModel = function (e) {
    function t() {
      var e, n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1500;
      return _classCallCheck(this, t), e = _possibleConstructorReturn(this, _getPrototypeOf(t).call(this)), e.recomputeInterval = n, e.secondaryLinesPoints = [], e.attachRecomputeInterval(), e
    }
    return _inherits(t, FF_SVGAbstractPointsCollection), _createClass(t, [{
      key: "attachRecomputeInterval",
      value: function () {
        var e = this;
        setInterval(function () {
          e.needsToRecompute && (e.needsToRecompute = !1, e.computeLineData())
        }, this.recomputeInterval)
      }
    }, {
      key: "addLineComponent",
      value: function (e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : -1;
        t > -1 && t < this.childs.length ? this.childs.splice(t, 0, e) : this.childs.push(e), this.watchNewLineComponent(e), this.onPointsChangeObservable.notifyObservers()
      }
    }, {
      key: "addLineComponentBeforePoint",
      value: function (e, t) {
        this.iterateThroughPointsTree(function (n, i) {
          var r = i.indexOf(t);
          r > -1 && (i.splice(r, 0, e), t = null)
        }), this.watchNewLineComponent(e), this.onPointsChangeObservable.notifyObservers()
      }
    }, {
      key: "watchNewLineComponent",
      value: function (e) {
        var t = this;
        if (e instanceof FF_SVGAbstractPointsCollection) {
          e.getPoints().forEach(function (e) {
            return t.watchNewLineComponent(e)
          })
        } else e.onCoordinatesChangeObservable.addObserver(this)
      }
    }, {
      key: "addSecondaryLinePoints",
      value: function (e, t) {
        this.secondaryLinesPoints.push([e, t])
      }
    }, {
      key: "getFlatListPoints",
      value: function () {
        var e = [];
        return this.iterateThroughPointsTree(function (t) {
          return e.push(t)
        }), e
      }
    }, {
      key: "iterateThroughPointsTree",
      value: function (e) {
        function t(n, i) {
          if (n instanceof FF_SVGAbstractPointsCollection) {
            var r = n.getPoints();
            r.forEach(function (e) {
              return t(e, r)
            })
          } else n instanceof FF_SVGPoint && e(n, i)
        }
        var n = this;
        this.childs.forEach(function (e) {
          return t(e, n.childs)
        })
      }
    }, {
      key: "computeLineData",
      value: function () {
        var e = this.getFlatListPoints();
        e[0].positionInLine = 0;
        for (var n = 1; n < e.length; n++) {
          var i = e[n - 1],
            r = e[n],
            o = Math.round(t.pythagore(i.getComputedX(), r.getComputedX(), i.getComputedY(), r.getComputedY())),
            a = i.positionInLine + o;
          r.distanceFromPrevious = o, r.positionInLine = a
        }
        this.onPointsChangeObservable.notifyObservers()
      }
    }, {
      key: "update",
      value: function () {
        this.needsToRecompute = !0
      }
    }, {
      key: "getPointsTree",
      value: function () {
        return this.childs
      }
    }, {
      key: "getPoints",
      value: function () {
        return this.getFlatListPoints()
      }
    }, {
      key: "getLineAnimationStopPoints",
      value: function () {
        var e = {};
        return this.getFlatListPoints().forEach(function (t) {
          t.lineAnimBP && (e[t.lineAnimBP] = t)
        }), e
      }
    }, {
      key: "getSecondaryLinesPoints",
      value: function () {
        return this.secondaryLinesPoints
      }
    }], [{
      key: "pythagore",
      value: function (e, t, n, i) {
        return Math.sqrt(Math.pow(t - e, 2) + Math.pow(i - n, 2))
      }
    }]), t
  }(),
  FF_SVGLineSection = function (e) {
    function t(e, n, i) {
      var r;
      return _classCallCheck(this, t), r = _possibleConstructorReturn(this, _getPrototypeOf(t).call(this)), r.htmlElement = e, r.topAnchorX = n, r.bottomAnchorX = i, r
    }
    return _inherits(t, FF_SVGAbstractPointsCollection), _createClass(t, [{
      key: "getPoints",
      value: function () {
        return this.childs
      }
    }, {
      key: "addChildComponent",
      value: function (e) {
        this.childs.push(e), this.onPointsChangeObservable.notifyObservers()
      }
    }, {
      key: "getHTMLElement",
      value: function () {
        return this.htmlElement
      }
    }, {
      key: "getTopAnchorX",
      value: function () {
        return this.topAnchorX
      }
    }, {
      key: "getBottomAnchorX",
      value: function () {
        return this.bottomAnchorX
      }
    }]), t
  }(),
  FF_SVGLineAutoGeneratedSection = function (e) {
    function t(e, n) {
      var i, r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : .5,
        o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : t.DIRECTION.VERTICAL;
      return _classCallCheck(this, t), i = _possibleConstructorReturn(this, _getPrototypeOf(t).call(this)), i.startPoint = e, i.endPoint = n, i.firstLineLength = r, i.direction = o, i.instantiatePoints(), i.computePointsPosition(), window.addEventListener("resize", function (e) {
        i.computePointsPosition()
      }), i
    }
    return _inherits(t, FF_SVGAbstractPointsCollection), _createClass(t, null, [{
      key: "DIRECTION",
      get: function () {
        return {
          VERTICAL: 0,
          HORIZONTAL: 1
        }
      }
    }]), _createClass(t, [{
      key: "instantiatePoints",
      value: function () {
        this.point1 = new FF_SVGPointRelativeToOtherPoint({
          parentPoint: this.startPoint,
          drawCommand: "L"
        }), this.point2 = new FF_SVGPointRelativeToOtherPoint({
          parentPoint: this.endPoint,
          drawCommand: "L"
        }), this.childs[0] = this.point1, this.childs[1] = this.point2
      }
    }, {
      key: "computePointsPosition",
      value: function () {
        var e = this.endPoint.getComputedX() - this.startPoint.getComputedX(),
          n = this.endPoint.getComputedY() - this.startPoint.getComputedY();
        this.direction === t.DIRECTION.VERTICAL ? (this.point1.setX(0), this.point2.setX(0), this.point1.setY(n * this.firstLineLength), this.point2.setY(-1 * n * (1 - this.firstLineLength))) : this.direction === t.DIRECTION.HORIZONTAL && (this.point1.setX(e * this.firstLineLength), this.point2.setX(-1 * e * (1 - this.firstLineLength)), this.point1.setY(0), this.point2.setY(0)), this.point1.computePointPosition(), this.point2.computePointPosition(), this.onPointsChangeObservable.notifyObservers()
      }
    }, {
      key: "getPoints",
      value: function () {
        return this.point1 && this.point2 ? this.childs : null
      }
    }]), t
  }(),
  FF_SVGLineModelBuilder = function () {
    function e() {
      _classCallCheck(this, e), this.product = null
    }
    return _createClass(e, null, [{
      key: "DEFAULT_DATA_SECTION_ATTRIBUTE",
      get: function () {
        return "data-line-section"
      }
    }, {
      key: "DEFAULT_LINE_CHILD_ATTRIBUTE",
      get: function () {
        return "data-line-points"
      }
    }]), _createClass(e, [{
      key: "startNewProduct",
      value: function () {
        this.product = new FF_SVGLineModel
      }
    }, {
      key: "createLineSectionsFromHTML",
      value: function () {
        var t = this,
          n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
        n || (n = e.DEFAULT_DATA_SECTION_ATTRIBUTE);
        document.querySelectorAll("[" + n + "]").forEach(function (e) {
          var i = JSON.parse(e.getAttribute(n)),
            r = new FF_SVGLineSection(e, parseFloat(i.top), parseFloat(i.bottom));
          t.product.addLineComponent(r), t.createSectionChildPointsFromHTML(r)
        })
      }
    }, {
      key: "createSectionChildPointsFromHTML",
      value: function (t) {
        function n(e, n) {
          t.addChildComponent(new FF_SVGPointRelativeToHTMLElemPercent({
            x: parseFloat(e.x),
            y: parseFloat(e.y),
            parentElement: n,
            drawCommand: e.draw_cmd,
            lineAnimBP: e.line_anim_bp
          }))
        }
        var i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
        i || (i = e.DEFAULT_LINE_CHILD_ATTRIBUTE);
        var r = t.getHTMLElement().getAttribute(i);
        if (r) {
          JSON.parse(r).points.forEach(function (e) {
            return n(e, t.getHTMLElement())
          })
        }
        var o = t.getHTMLElement().querySelectorAll("[" + i + "]");
        o && o.forEach(function (e) {
          var t = JSON.parse(e.getAttribute(i));
          void 0 !== t.points && t.points.length > 0 && t.points.forEach(function (t) {
            return n(t, e)
          })
        })
      }
    }, {
      key: "createSectionsAnchors",
      value: function () {
        var e = this.product.getPointsTree(),
          t = e[0].getTopAnchorX();
        if (t) {
          var n = new FF_SVGPointRelativeToHTMLElemPercent({
            drawCommand: "M",
            x: t,
            y: 0,
            parentElement: e[0].getHTMLElement()
          });
          this.product.addLineComponent(n, 0)
        }
        for (var i = 2; i < e.length; i += 2) {
          var r = e[i - 1],
            o = e[i];
          r.getBottomAnchorX() && o.getTopAnchorX() && this.product.addLineComponent(new FF_SVGSectionsAnchorsMerge({
            topSection: r,
            bottomSection: o
          }), i)
        }
        var a = e[e.length - 1],
          s = a.getBottomAnchorX();
        s && this.product.addLineComponent(new FF_SVGPointRelativeToHTMLElemPercent({
          x: s,
          y: 100,
          parentElement: a.getHTMLElement(),
          drawCommand: "L"
        }))
      }
    }, {
      key: "createDynamicallyGeneratedLines",
      value: function () {
        for (var e = this.product.getPoints(), t = 1; t < e.length; t++) {
          var n = e[t - 1],
            i = e[t];
          if (n.getComputedX() !== i.getComputedX() && n.getComputedY() !== i.getComputedY()) {
            var r = new FF_SVGLineAutoGeneratedSection(n, i);
            this.product.addLineComponentBeforePoint(r, i)
          }
        }
      }
    }, {
      key: "addSecondaryLines",
      value: function () {
        var t = this,
          n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
        n || (n = e.DEFAULT_LINE_CHILD_ATTRIBUTE);
        document.querySelectorAll("[" + n + "]").forEach(function (e) {
          var i = JSON.parse(e.getAttribute(n));
          i.additional_connections && i.additional_connections.forEach(function (n) {
            for (var i = new FF_SVGPointRelativeToHTMLElemPercent({
                parentElement: e,
                x: parseFloat(n.x),
                y: parseFloat(n.y),
                drawCommand: FF_SVGPoint.DRAW_COMMANDS.LINE_TO
              }), r = t.product.getPoints(), o = 1; o < r.length; o++) {
              var a = r[o - 1],
                s = r[o],
                l = i.getComputedY() >= a.getComputedY() && i.getComputedY() <= s.getComputedY(),
                u = a.getComputedX() == s.getComputedX();
              if (l && u) {
                var c = new FF_SVGPointRelativeToTwoPoints({
                  parentPointX: s,
                  parentPointY: i,
                  drawCommand: FF_SVGPoint.DRAW_COMMANDS.LINE_TO
                });
                t.product.addSecondaryLinePoints(c, i), t.product.addLineComponentBeforePoint(c, s);
                break
              }
            }
          })
        })
      }
    }, {
      key: "getFinishedProduct",
      value: function () {
        return this.product.computeLineData(), this.product
      }
    }]), e
  }(),
  FF_SVGRoot = function () {
    function e(t) {
      _classCallCheck(this, e), this.svgElement = t, this.resize(), window.addEventListener("resize", this.resize.bind(this))
    }
    return _createClass(e, null, [{
      key: "SVG_NAMESPACE",
      get: function () {
        return "http://www.w3.org/2000/svg"
      }
    }]), _createClass(e, [{
      key: "resize",
      value: function () {
        var e = document.querySelector("body").getBoundingClientRect();
        this.svgElement.setAttribute("width", "".concat(e.width, "px")), this.svgElement.setAttribute("height", "".concat(e.height, "px")), this.svgElement.setAttribute("viewBox", "0 0 ".concat(e.width, " ").concat(e.height)), this.height = e.height
      }
    }, {
      key: "addNode",
      value: function (e) {
        this.svgElement.appendChild(e)
      }
    }, {
      key: "getSvgHeight",
      value: function () {
        return this.height
      }
    }, {
      key: "deleteAllChildNodes",
      value: function () {
        for (; this.svgElement.firstChild;) this.svgElement.removeChild(this.svgElement.firstChild)
      }
    }]), e
  }(),
  FF_SVGPointTestDisplay = function () {
    function e(t) {
      var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : FF_SVGRoot.SVG_NAMESPACE;
      _classCallCheck(this, e), this.point = t, this.svgNameSpace = n, this.point.onCoordinatesChangeObservable.addObserver(this), this.createPoint()
    }
    return _createClass(e, [{
      key: "createPoint",
      value: function () {
        this.svgNode = document.createElementNS(this.svgNameSpace, "rect"), this.setPointPosition(), this.svgNode.setAttribute("fill", "rgba(255,255,255,1)"), this.svgNode.setAttribute("height", "6"), this.svgNode.setAttribute("width", "6")
      }
    }, {
      key: "setPointPosition",
      value: function () {
        this.svgNode.setAttribute("x", this.point.getComputedX() - 3), this.svgNode.setAttribute("y", this.point.getComputedY() - 3)
      }
    }, {
      key: "update",
      value: function () {
        this.setPointPosition()
      }
    }, {
      key: "getNode",
      value: function () {
        return this.svgNode
      }
    }]), e
  }(),
  FF_SVGLineDisplay = function () {
    function e(t, n) {
      var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1500,
        r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : FF_SVGRoot.SVG_NAMESPACE;
      _classCallCheck(this, e), this.lineModel = t, this.svgRoot = n, this.svgNameSpace = r, this.points = t.getPoints(), this.secondaryLines = [], this.refreshRate = i, this.onLineRedrawObservable = new FF_SVGObservable, this.lineModel.onPointsChangeObservable.addObserver(this), this.createLine(), this.setPathData(), this.attachEvents()
    }
    return _createClass(e, [{
      key: "attachEvents",
      value: function () {
        var e = this;
        this.points.forEach(function (t) {
          return t.onCoordinatesChangeObservable.addObserver(e)
        }), window.addEventListener("resize", this.calculateLineHeight.bind(this)), setInterval(function () {
          e.needsRedraw && (e.needsRedraw = !1, e.setPathData())
        }, this.refreshRate)
      }
    }, {
      key: "createLine",
      value: function () {
        this.pathNode = document.createElementNS(this.svgNameSpace, "path"), this.mainLineMaskNode = document.createElementNS(this.svgNameSpace, "g"), this.mainLineMaskNode.setAttribute("id", "line-path"), this.mainLineMaskNode.appendChild(this.pathNode), this.pathNode.setAttribute("fill", "transparent"), this.setStrokeWidth(), this.setStrokeColor(), this.svgRoot.addNode(this.mainLineMaskNode)
      }
    }, {
      key: "update",
      value: function () {
        this.needsRedraw = !0
      }
    }, {
      key: "calculateLineHeight",
      value: function () {
        this.lineHeight = this.pathNode.getBoundingClientRect().height
      }
    }, {
      key: "computePathData",
      value: function () {
        var e = "";
        return this.points.forEach(function (t, n) {
          var i = 0 == n ? FF_SVGPoint.DRAW_COMMANDS.MOVE_TO : t.getDrawCmd();
          e += " " + i + " " + t.getComputedX() + "," + t.getComputedY()
        }), e
      }
    }, {
      key: "setPathData",
      value: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
        e || (e = this.computePathData()), this.pathNode.setAttribute("d", e), this.onLineRedrawObservable.notifyObservers()
      }
    }, {
      key: "setStrokeWidth",
      value: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
        this.pathNode.setAttribute("stroke-width", e)
      }
    }, {
      key: "setStrokeColor",
      value: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "#000";
        this.pathNode.setAttribute("stroke", e)
      }
    }, {
      key: "getLineHeight",
      value: function () {
        return 0 !== this.lineHeight && this.lineHeight || this.calculateLineHeight(), this.lineHeight
      }
    }, {
      key: "getNode",
      value: function () {
        return this.mainLineMaskNode
      }
    }]), e
  }(),
  FF_SVGSecondaryLineDisplay = function () {
    function e(t, n) {
      var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
        r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : FF_SVGRoot.SVG_NAMESPACE;
      _classCallCheck(this, e), this.point1 = t, this.point2 = n, this.svgNameSpace = r, this.point1.onCoordinatesChangeObservable.addObserver(this), this.point2.onCoordinatesChangeObservable.addObserver(this), this.createLine(i)
    }
    return _createClass(e, [{
      key: "createLine",
      value: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        this.lineNode = document.createElementNS(this.svgNameSpace, "line"), this.setLineCoordinates();
        e = Object.assign({
          strokeWidth: 0,
          strokeColor: "#fff"
        }, e), this.setStrokeWidth(e.strokeWidth), this.setStrokeColor(e.strokeColor)
      }
    }, {
      key: "setStrokeColor",
      value: function (e) {
        this.lineNode.setAttribute("stroke", e)
      }
    }, {
      key: "setStrokeWidth",
      value: function (e) {
        this.lineNode.setAttribute("stroke-width", e)
      }
    }, {
      key: "setLineCoordinates",
      value: function () {
        this.lineNode.setAttribute("x1", this.point1.getComputedX()), this.lineNode.setAttribute("x2", this.point2.getComputedX()), this.lineNode.setAttribute("y1", this.point1.getComputedY()), this.lineNode.setAttribute("y2", this.point2.getComputedY())
      }
    }, {
      key: "update",
      value: function () {
        this.setLineCoordinates()
      }
    }, {
      key: "getLineLength",
      value: function () {
        return FF_SVGLineModel.pythagore(this.point1.getComputedX(), this.point2.getComputedX(), this.point1.getComputedY(), this.point2.getComputedY())
      }
    }, {
      key: "getPositionOnMainLine",
      value: function () {
        return this.point1.positionInLine ? this.point1.positionInLine : this.point2.positionInLine ? this.point2.positionInLine : null
      }
    }, {
      key: "getNode",
      value: function () {
        return this.lineNode
      }
    }]), e
  }(),
  FF_SVGLineMask = function () {
    function e(t, n) {
      var i = this,
        r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : FF_SVGRoot.SVG_NAMESPACE;
      _classCallCheck(this, e), this.svgRoot = t, this.lineDisplay = n, this.points = n.points, this.svgNameSpace = r, this.lastAnimationBreakpoint = null, this.lineDisplay.onLineRedrawObservable.addObserver(this), this.onLineAnimationObservable = new FF_SVGObservable, this.tl = new TimelineLite({
        onComplete: function () {
          i.tl.clear()
        }
      }), this.createMask()
    }
    return _createClass(e, null, [{
      key: "MASK_ID",
      get: function () {
        return "line-animation-mask"
      }
    }]), _createClass(e, [{
      key: "createMask",
      value: function () {
        this.maskWrapper = document.createElementNS(this.svgNameSpace, "mask"), this.maskWrapper.setAttribute("id", e.MASK_ID), this.mask = document.createElementNS(this.svgNameSpace, "path"), this.computeMaskData(), this.mask.setAttribute("fill", "transparent"), this.mask.setAttribute("stroke", "#fff"), this.mask.setAttribute("stroke-width", 10), this.maskWrapper.appendChild(this.mask), this.attachMaskToLine(), this.setMaskDrawingPercentage(0, 0)
      }
    }, {
      key: "attachMaskToLine",
      value: function () {
        this.svgRoot.addNode(this.maskWrapper);
        this.lineDisplay.getNode().setAttribute("mask", "url(#" + e.MASK_ID + ")")
      }
    }, {
      key: "computeMaskData",
      value: function () {
        var e = "";
        this.points.forEach(function (t, n) {
          var i = 0 === n ? FF_SVGPoint.DRAW_COMMANDS.MOVE_TO : FF_SVGPoint.DRAW_COMMANDS.LINE_TO;
          e += " " + i + " " + t.getComputedX() + "," + t.getComputedY()
        }), this.mask.setAttribute("d", e), this.maskPathLength = this.mask.getTotalLength(), this.mask.setAttribute("stroke-dasharray", this.maskPathLength)
      }
    }, {
      key: "getNode",
      value: function () {
        return this.maskWrapper
      }
    }, {
      key: "update",
      value: function () {
        this.points = this.lineDisplay.points, this.computeMaskData(), this.lastAnimationBreakpoint instanceof FF_SVGPoint ? this.drawLineToPoint(this.lastAnimationBreakpoint) : this.lastAnimationBreakpoint > 0 ? this.setMaskDrawingPercentage(this.lastAnimationBreakpoint) : this.setMaskDrawingPercentage(0)
      }
    }, {
      key: "setMaskDrawingPercentage",
      value: function () {
        var e = this,
          t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
          n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1,
          i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
        this.lastAnimationBreakpoint = t, i || (i = Power1.easeOut);
        var r = TweenLite.to(this.mask, n, {
          "stroke-dashoffset": this.maskPathLength * (1 - t),
          ease: i,
          onUpdateParams: ["{self}"],
          onUpdate: function (t) {
            var n = e.maskPathLength - parseFloat(this._targets[0].style.strokeDashoffset);
            e.onLineAnimationObservable.notifyObservers({
              drawPosition: n
            })
          }
        });
        this.tl.add(r)
      }
    }, {
      key: "drawLineToPoint",
      value: function (e) {
        var t = this,
          n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1,
          i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
        this.lastAnimationBreakpoint = e, i || (i = Power1.easeOut);
        var r = this.maskPathLength - e.positionInLine,
          o = TweenLite.to(this.mask, n, {
            "stroke-dashoffset": r,
            ease: i,
            onUpdateParams: ["{self}"],
            onUpdate: function (e) {
              var n = t.maskPathLength - parseFloat(this._targets[0].style.strokeDashoffset);
              t.onLineAnimationObservable.notifyObservers({
                drawPosition: n
              })
            }
          });
        this.tl.add(o)
      }
    }, {
      key: "killActiveTweens",
      value: function () {
        this.tl.isActive() && (this.tl.kill(), this.tl.clear())
      }
    }]), e
  }(),
  FF_SVGLineMaskDebug = function (e) {
    function t(e, n) {
      var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : FF_SVGRoot.SVG_NAMESPACE;
      return _classCallCheck(this, t), _possibleConstructorReturn(this, _getPrototypeOf(t).call(this, e, n, i))
    }
    return _inherits(t, FF_SVGLineMask), _createClass(t, [{
      key: "createMask",
      value: function () {
        this.maskWrapper = document.createElementNS(this.svgNameSpace, "g"), this.maskWrapper.setAttribute("id", "masque-debug"), this.mask = document.createElementNS(this.svgNameSpace, "path"), this.computeMaskData(), this.mask.setAttribute("fill", "transparent"), this.mask.setAttribute("stroke", "blue"), this.mask.setAttribute("stroke-width", 10), this.maskWrapper.appendChild(this.mask), this.attachMaskToLine(), this.setMaskDrawingPercentage(0, 0)
      }
    }, {
      key: "attachMaskToLine",
      value: function () {
        this.svgRoot.addNode(this.maskWrapper)
      }
    }]), t
  }(),
  FF_SVGSecondaryLineAnimation = function () {
    function e(t) {
      var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : .5;
      _classCallCheck(this, e), this.lineDisplay = t, this.animationDuration = n, this.lineNode = this.lineDisplay.getNode(), this.lineLength = this.lineDisplay.getLineLength() + 10, this.lineIsVisible = !1, this.setupStrokeDash()
    }
    return _createClass(e, [{
      key: "setupStrokeDash",
      value: function () {
        this.lineNode.setAttribute("stroke-dasharray", this.lineLength), this.lineNode.setAttribute("stroke-dashoffset", this.lineLength)
      }
    }, {
      key: "setInitialLineVisibility",
      value: function () {
        (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0) > this.lineDisplay.getPositionOnMainLine() && (this.lineNode.setAttribute("stroke-dashoffset", 0), this.lineIsVisible = !0)
      }
    }, {
      key: "update",
      value: function (e) {
        var t = this.lineDisplay.getPositionOnMainLine() - 3;
        e.drawPosition >= t ? this.animateInLine() : e.drawPosition < t && this.animateOutLine(.1)
      }
    }, {
      key: "animateInLine",
      value: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
        this.lineIsVisible || (e || (e = this.animationDuration), TweenLite.to(this.lineDisplay.getNode(), e, {
          "stroke-dashoffset": 0,
          ease: Power1.easeOut
        }), this.lineIsVisible = !0)
      }
    }, {
      key: "animateOutLine",
      value: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
        this.lineIsVisible && (e || (e = this.animationDuration), TweenLite.to(this.lineDisplay.getNode(), e, {
          "stroke-dashoffset": this.lineLength + 5,
          ease: Power1.easeOut
        }), this.lineIsVisible = !1)
      }
    }]), e
  }(),
  FF_LineAnimationControl = function () {
    function e(t, n) {
      var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
        r = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
      _classCallCheck(this, e), this.lineMask = t, this.lineAnimationBreakPoints = n, this.triggersDataAttribute = i || e.DEFAULT_TRIGGER_DATA_ATTRIBUTE, this.debug = r, this.setup()
    }
    return _createClass(e, null, [{
      key: "DEFAULT_TRIGGER_DATA_ATTRIBUTE",
      get: function () {
        return "data-line-trigger"
      }
    }]), _createClass(e, [{
      key: "setup",
      value: function () {
        var e = this;
        this.smController = new ScrollMagic.Controller;
        var t = this.parseLineTriggers();
        t.forEach(function (n, i) {
          var r = new ScrollMagic.Scene({
            triggerElement: n.elem,
            triggerHook: n.trigger_hook,
            reverse: !0
          }).addTo(e.smController);
          e.debug && r.addIndicators();
          var o, a, s;
          if (s = e.lineAnimationBreakPoints[n.stop_pt], o = s ? function () {
              e.lineMask.drawLineToPoint(s, n.tween_length)
            } : function () {
              e.lineMask.setMaskDrawingPercentage(n.draw_percentage, n.tween_length)
            }, i > 0) {
            var l = t[i - 1],
              u = e.lineAnimationBreakPoints[l.stop_pt];
            a = u ? function (t) {
              e.lineMask.drawLineToPoint(u, .6, Power1.easeOut)
            } : function (t) {
              e.lineMask.setMaskDrawingPercentage(l.draw_percentage, .6, Power1.easeOut)
            }
          } else a = function (t) {
            e.lineMask.setMaskDrawingPercentage(0)
          };
          r.on("enter", function () {
            e.lineMask.killActiveTweens(), o()
          }), r.on("leave", function () {
            e.lineMask.killActiveTweens(), a()
          })
        })
      }
    }, {
      key: "parseLineTriggers",
      value: function () {
        var e, t = this;
        return Array.from(document.querySelectorAll("[" + this.triggersDataAttribute + "]")).map(function (n) {
          return e = JSON.parse(n.getAttribute(t.triggersDataAttribute)), Object.assign({
            elem: n,
            draw_percentage: 0,
            trigger_hook: .5,
            tween_length: 1,
            stop_pt: null
          }, e)
        })
      }
    }]), e
  }();
_linkedin_partner_id = "2852289";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
(function () {
  var s = document.getElementsByTagName("script")[0];
  var b = document.createElement("script");
  b.type = "text/javascript";
  b.async = !0;
  b.src = "";
  s.parentNode.insertBefore(b, s)
})();
(function (h, o, t, j, a, r) {
  h.hj = h.hj || function () {
    (h.hj.q = h.hj.q || []).push(arguments)
  };
  h._hjSettings = {
    hjid: 1924873,
    hjsv: 5
  };
  a = o.getElementsByTagName('head')[0];
  r = o.createElement('script');
  r.async = 1;
  r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
  a.appendChild(r)
})(window, document, '', '');
var chemin = ' ./themes/fatfish/';
var langue = 'es';
var root = ' ';
var locale = 'es-PE';
(function () {
  var n = this || self,
    p = function (a, b) {
      a = a.split(".");
      var c = n;
      a[0] in c || "undefined" == typeof c.execScript || c.execScript("var " + a[0]);
      for (var d; a.length && (d = a.shift());) a.length || void 0 === b ? c = c[d] && c[d] !== Object.prototype[d] ? c[d] : c[d] = {} : c[d] = b
    };
  var q = {},
    r = function () {
      q.TAGGING = q.TAGGING || [];
      q.TAGGING[1] = !0
    };
  var t = function (a, b) {
      for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c])
    },
    v = function (a) {
      for (var b in a)
        if (a.hasOwnProperty(b)) return !0;
      return !1
    };
  var x = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;
  var y = window,
    z = document,
    A = function (a, b) {
      z.addEventListener ? z.addEventListener(a, b, !1) : z.attachEvent && z.attachEvent("on" + a, b)
    };
  var B = /:[0-9]+$/,
    C = function (a, b, c) {
      a = a.split("&");
      for (var d = 0; d < a.length; d++) {
        var e = a[d].split("=");
        if (decodeURIComponent(e[0]).replace(/\+/g, " ") === b) return b = e.slice(1).join("="), c ? b : decodeURIComponent(b).replace(/\+/g, " ")
      }
    },
    F = function (a, b) {
      b && (b = String(b).toLowerCase());
      if ("protocol" === b || "port" === b) a.protocol = D(a.protocol) || D(y.location.protocol);
      "port" === b ? a.port = String(Number(a.hostname ? a.port : y.location.port) || ("http" == a.protocol ? 80 : "https" == a.protocol ? 443 : "")) : "host" === b && (a.hostname = (a.hostname || y.location.hostname).replace(B, "").toLowerCase());
      return E(a, b, void 0, void 0, void 0)
    },
    E = function (a, b, c, d, e) {
      var f = D(a.protocol);
      b && (b = String(b).toLowerCase());
      switch (b) {
        case "url_no_fragment":
          d = "";
          a && a.href && (d = a.href.indexOf("#"), d = 0 > d ? a.href : a.href.substr(0, d));
          a = d;
          break;
        case "protocol":
          a = f;
          break;
        case "host":
          a = a.hostname.replace(B, "").toLowerCase();
          c && (d = /^www\d*\./.exec(a)) && d[0] && (a = a.substr(d[0].length));
          break;
        case "port":
          a = String(Number(a.port) || ("http" == f ? 80 : "https" == f ? 443 : ""));
          break;
        case "path":
          a.pathname || a.hostname || r();
          a = "/" == a.pathname.substr(0, 1) ? a.pathname : "/" + a.pathname;
          a = a.split("/");
          a: if (d = d || [], c = a[a.length - 1], Array.prototype.indexOf) d = d.indexOf(c), d = "number" == typeof d ? d : -1;
            else {
              for (e = 0; e < d.length; e++)
                if (d[e] === c) {
                  d = e;
                  break a
                } d = -1
            } 0 <= d && (a[a.length - 1] = "");
          a = a.join("/");
          break;
        case "query":
          a = a.search.replace("?", "");
          e && (a = C(a, e, void 0));
          break;
        case "extension":
          a = a.pathname.split(".");
          a = 1 < a.length ? a[a.length - 1] : "";
          a = a.split("/")[0];
          break;
        case "fragment":
          a = a.hash.replace("#", "");
          break;
        default:
          a = a && a.href
      }
      return a
    },
    D = function (a) {
      return a ? a.replace(":", "").toLowerCase() : ""
    },
    G = function (a) {
      var b = z.createElement("a");
      a && (b.href = a);
      var c = b.pathname;
      "/" !== c[0] && (a || r(), c = "/" + c);
      a = b.hostname.replace(B, "");
      return {
        href: b.href,
        protocol: b.protocol,
        host: b.host,
        hostname: a,
        pathname: c,
        search: b.search,
        hash: b.hash,
        port: b.port
      }
    };

  function H() {
    for (var a = I, b = {}, c = 0; c < a.length; ++c) b[a[c]] = c;
    return b
  }

  function J() {
    var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    a += a.toLowerCase() + "0123456789-_";
    return a + "."
  }
  var I, K;

  function aa(a) {
    function b(k) {
      for (; d < a.length;) {
        var m = a.charAt(d++),
          l = K[m];
        if (null != l) return l;
        if (!/^[\s\xa0]*$/.test(m)) throw Error("Unknown base64 encoding at char: " + m)
      }
      return k
    }
    I = I || J();
    K = K || H();
    for (var c = "", d = 0;;) {
      var e = b(-1),
        f = b(0),
        g = b(64),
        h = b(64);
      if (64 === h && -1 === e) return c;
      c += String.fromCharCode(e << 2 | f >> 4);
      64 != g && (c += String.fromCharCode(f << 4 & 240 | g >> 2), 64 != h && (c += String.fromCharCode(g << 6 & 192 | h)))
    }
  };
  var L;
  var N = function () {
      var a = ba,
        b = ca,
        c = M(),
        d = function (g) {
          a(g.target || g.srcElement || {})
        },
        e = function (g) {
          b(g.target || g.srcElement || {})
        };
      if (!c.init) {
        A("mousedown", d);
        A("keyup", d);
        A("submit", e);
        var f = HTMLFormElement.prototype.submit;
        HTMLFormElement.prototype.submit = function () {
          b(this);
          f.call(this)
        };
        c.init = !0
      }
    },
    O = function (a, b, c, d, e) {
      a = {
        callback: a,
        domains: b,
        fragment: 2 === c,
        placement: c,
        forms: d,
        sameHost: e
      };
      M().decorators.push(a)
    },
    P = function (a, b, c) {
      for (var d = M().decorators, e = {}, f = 0; f < d.length; ++f) {
        var g = d[f],
          h;
        if (h = !c || g.forms) a: {
          h = g.domains;
          var k = a,
            m = !!g.sameHost;
          if (h && (m || k !== z.location.hostname))
            for (var l = 0; l < h.length; l++)
              if (h[l] instanceof RegExp) {
                if (h[l].test(k)) {
                  h = !0;
                  break a
                }
              } else if (0 <= k.indexOf(h[l]) || m && 0 <= h[l].indexOf(k)) {
            h = !0;
            break a
          }
          h = !1
        }
        h && (h = g.placement, void 0 == h && (h = g.fragment ? 2 : 1), h === b && t(e, g.callback()))
      }
      return e
    },
    M = function () {
      var a = {};
      var b = y.google_tag_data;
      y.google_tag_data = void 0 === b ? a : b;
      a = y.google_tag_data;
      b = a.gl;
      b && b.decorators || (b = {
        decorators: []
      }, a.gl = b);
      return b
    };
  var da = /(.*?)\*(.*?)\*(.*)/,
    ea = /([^?#]+)(\?[^#]*)?(#.*)?/;

  function Q(a) {
    return new RegExp("(.*?)(^|&)" + a + "=([^&]*)&?(.*)")
  }
  var S = function (a) {
      var b = [],
        c;
      for (c in a)
        if (a.hasOwnProperty(c)) {
          var d = a[c];
          if (void 0 !== d && d === d && null !== d && "[object Object]" !== d.toString()) {
            b.push(c);
            var e = b,
              f = e.push;
            d = String(d);
            I = I || J();
            K = K || H();
            for (var g = [], h = 0; h < d.length; h += 3) {
              var k = h + 1 < d.length,
                m = h + 2 < d.length,
                l = d.charCodeAt(h),
                u = k ? d.charCodeAt(h + 1) : 0,
                w = m ? d.charCodeAt(h + 2) : 0,
                fa = l >> 2;
              l = (l & 3) << 4 | u >> 4;
              u = (u & 15) << 2 | w >> 6;
              w &= 63;
              m || (w = 64, k || (u = 64));
              g.push(I[fa], I[l], I[u], I[w])
            }
            f.call(e, g.join(""))
          }
        } a = b.join("*");
      return ["1", R(a), a].join("*")
    },
    R = function (a, b) {
      a = [window.navigator.userAgent, (new Date).getTimezoneOffset(), window.navigator.userLanguage || window.navigator.language, Math.floor((new Date).getTime() / 60 / 1E3) - (void 0 === b ? 0 : b), a].join("*");
      if (!(b = L)) {
        b = Array(256);
        for (var c = 0; 256 > c; c++) {
          for (var d = c, e = 0; 8 > e; e++) d = d & 1 ? d >>> 1 ^ 3988292384 : d >>> 1;
          b[c] = d
        }
      }
      L = b;
      b = 4294967295;
      for (c = 0; c < a.length; c++) b = b >>> 8 ^ L[(b ^ a.charCodeAt(c)) & 255];
      return ((b ^ -1) >>> 0).toString(36)
    },
    ia = function (a) {
      return function (b) {
        var c = G(y.location.href),
          d = c.search.replace("?", "");
        var e = C(d, "_gl", !0);
        b.query = T(e || "") || {};
        e = F(c, "fragment");
        var f = e.match(Q("_gl"));
        b.fragment = T(f && f[3] || "") || {};
        a && ha(c, d, e)
      }
    };

  function U(a, b) {
    if (a = Q(a).exec(b)) {
      var c = a[2],
        d = a[4];
      b = a[1];
      d && (b = b + c + d)
    }
    return b
  }
  var ha = function (a, b, c) {
      function d(f, g) {
        f = U("_gl", f);
        f.length && (f = g + f);
        return f
      }
      if (y.history && y.history.replaceState) {
        var e = Q("_gl");
        if (e.test(b) || e.test(c)) a = F(a, "path"), b = d(b, "?"), c = d(c, "#"), y.history.replaceState({}, void 0, "" + a + b + c)
      }
    },
    T = function (a) {
      var b = void 0 === b ? 3 : b;
      try {
        if (a) {
          a: {
            for (var c = 0; 3 > c; ++c) {
              var d = da.exec(a);
              if (d) {
                var e = d;
                break a
              }
              a = decodeURIComponent(a)
            }
            e = void 0
          }
          if (e && "1" === e[1]) {
            var f = e[2],
              g = e[3];
            a: {
              for (e = 0; e < b; ++e)
                if (f === R(g, e)) {
                  var h = !0;
                  break a
                } h = !1
            }
            if (h) {
              b = {};
              var k = g ? g.split("*") : [];
              for (g = 0; g < k.length; g += 2) b[k[g]] = aa(k[g + 1]);
              return b
            }
          }
        }
      } catch (m) {}
    };

  function V(a, b, c, d) {
    function e(k) {
      k = U(a, k);
      var m = k.charAt(k.length - 1);
      k && "&" !== m && (k += "&");
      return k + h
    }
    d = void 0 === d ? !1 : d;
    var f = ea.exec(c);
    if (!f) return "";
    c = f[1];
    var g = f[2] || "";
    f = f[3] || "";
    var h = a + "=" + b;
    d ? f = "#" + e(f.substring(1)) : g = "?" + e(g.substring(1));
    return "" + c + g + f
  }

  function W(a, b) {
    var c = "FORM" === (a.tagName || "").toUpperCase(),
      d = P(b, 1, c),
      e = P(b, 2, c);
    b = P(b, 3, c);
    v(d) && (d = S(d), c ? X("_gl", d, a) : Y("_gl", d, a, !1));
    !c && v(e) && (c = S(e), Y("_gl", c, a, !0));
    for (var f in b) b.hasOwnProperty(f) && Z(f, b[f], a)
  }

  function Z(a, b, c, d) {
    if (c.tagName) {
      if ("a" === c.tagName.toLowerCase()) return Y(a, b, c, d);
      if ("form" === c.tagName.toLowerCase()) return X(a, b, c)
    }
    if ("string" == typeof c) return V(a, b, c, d)
  }

  function Y(a, b, c, d) {
    c.href && (a = V(a, b, c.href, void 0 === d ? !1 : d), x.test(a) && (c.href = a))
  }

  function X(a, b, c) {
    if (c && c.action) {
      var d = (c.method || "").toLowerCase();
      if ("get" === d) {
        d = c.childNodes || [];
        for (var e = !1, f = 0; f < d.length; f++) {
          var g = d[f];
          if (g.name === a) {
            g.setAttribute("value", b);
            e = !0;
            break
          }
        }
        e || (d = z.createElement("input"), d.setAttribute("type", "hidden"), d.setAttribute("name", a), d.setAttribute("value", b), c.appendChild(d))
      } else "post" === d && (a = V(a, b, c.action), x.test(a) && (c.action = a))
    }
  }
  var ba = function (a) {
      try {
        a: {
          for (var b = 100; a && 0 < b;) {
            if (a.href && a.nodeName.match(/^a(?:rea)?$/i)) {
              var c = a;
              break a
            }
            a = a.parentNode;
            b--
          }
          c = null
        }
        if (c) {
          var d = c.protocol;
          "http:" !== d && "https:" !== d || W(c, c.hostname)
        }
      }
      catch (e) {}
    },
    ca = function (a) {
      try {
        if (a.action) {
          var b = F(G(a.action), "host");
          W(a, b)
        }
      } catch (c) {}
    };
  p("google_tag_data.glBridge.auto", function (a, b, c, d) {
    N();
    O(a, b, "fragment" === c ? 2 : 1, !!d, !1)
  });
  p("google_tag_data.glBridge.passthrough", function (a, b, c) {
    N();
    O(a, [E(y.location, "host", !0)], b, !!c, !0)
  });
  p("google_tag_data.glBridge.decorate", function (a, b, c) {
    a = S(a);
    return Z("_gl", a, b, !!c)
  });
  p("google_tag_data.glBridge.generate", S);
  p("google_tag_data.glBridge.get", function (a, b) {
    var c = ia(!!b);
    b = M();
    b.data || (b.data = {
      query: {},
      fragment: {}
    }, c(b.data));
    c = {};
    if (b = b.data) t(c, b.query), a && t(c, b.fragment);
    return c
  })
})(window);
(function () {
  function La(a) {
    var b = 1,
      c;
    if (a)
      for (b = 0, c = a.length - 1; 0 <= c; c--) {
        var d = a.charCodeAt(c);
        b = (b << 6 & 268435455) + d + (d << 14);
        d = b & 266338304;
        b = 0 != d ? b ^ d >> 21 : b
      }
    return b
  };
  var $c = function (a) {
    this.C = a || []
  };
  $c.prototype.set = function (a) {
    this.C[a] = !0
  };
  $c.prototype.encode = function () {
    for (var a = [], b = 0; b < this.C.length; b++) this.C[b] && (a[Math.floor(b / 6)] ^= 1 << b % 6);
    for (b = 0; b < a.length; b++) a[b] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(a[b] || 0);
    return a.join("") + "~"
  };
  var ha = window.GoogleAnalyticsObject,
    wa;
  if (wa = void 0 != ha) wa = -1 < (ha.constructor + "").indexOf("String");
  var ya;
  if (ya = wa) {
    var fc = window.GoogleAnalyticsObject;
    ya = fc ? fc.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "") : ""
  }
  var gb = ya || "ga",
    jd = /^(?:utma\.)?\d+\.\d+$/,
    kd = /^amp-[\w.-]{22,64}$/,
    Ba = !1;
  var vd = new $c;

  function J(a) {
    vd.set(a)
  }
  var Td = function (a) {
      a = Dd(a);
      a = new $c(a);
      for (var b = vd.C.slice(), c = 0; c < a.C.length; c++) b[c] = b[c] || a.C[c];
      return (new $c(b)).encode()
    },
    Dd = function (a) {
      a = a.get(Gd);
      ka(a) || (a = []);
      return a
    };
  var ea = function (a) {
      return "function" == typeof a
    },
    ka = function (a) {
      return "[object Array]" == Object.prototype.toString.call(Object(a))
    },
    qa = function (a) {
      return void 0 != a && -1 < (a.constructor + "").indexOf("String")
    },
    D = function (a, b) {
      return 0 == a.indexOf(b)
    },
    sa = function (a) {
      return a ? a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "") : ""
    },
    ra = function () {
      for (var a = O.navigator.userAgent + (M.cookie ? M.cookie : "") + (M.referrer ? M.referrer : ""), b = a.length, c = O.history.length; 0 < c;) a += c-- ^ b++;
      return [hd() ^ La(a) & 2147483647, Math.round((new Date).getTime() / 1E3)].join(".")
    },
    ta = function (a) {
      var b = M.createElement("img");
      b.width = 1;
      b.height = 1;
      b.src = a;
      return b
    },
    ua = function () {},
    K = function (a) {
      if (encodeURIComponent instanceof Function) return encodeURIComponent(a);
      J(28);
      return a
    },
    L = function (a, b, c, d) {
      try {
        a.addEventListener ? a.addEventListener(b, c, !!d) : a.attachEvent && a.attachEvent("on" + b, c)
      } catch (e) {
        J(27)
      }
    },
    f = /^[\w\-:/.?=&%!\[\]]+$/,
    Nd = /^[\w+/_-]+[=]{0,2}$/,
    Id = function (a, b, c, d, e) {
      if (a) {
        var g = M.querySelector && M.querySelector("script[nonce]") || null;
        g = g ? g.nonce || g.getAttribute && g.getAttribute("nonce") || "" : "";
        c ? (e = d = "", b && f.test(b) && (d = ' id="' + b + '"'), g && Nd.test(g) && (e = ' nonce="' + g + '"'), f.test(a) && M.write("<script" + d + e + ' src="' + a + '">\x3c/script>')) : (c = M.createElement("script"), c.type = "text/javascript", c.async = !0, c.src = a, d && (c.onload = d), e && (c.onerror = e), b && (c.id = b), g && c.setAttribute("nonce", g), a = M.getElementsByTagName("script")[0], a.parentNode.insertBefore(c, a))
      }
    },
    be = function (a, b) {
      return E(M.location[b ? "href" : "search"], a)
    },
    E = function (a, b) {
      return (a = a.match("(?:&|#|\\?)" + K(b).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1") + "=([^&#]*)")) && 2 == a.length ? a[1] : ""
    },
    xa = function () {
      var a = "" + M.location.hostname;
      return 0 == a.indexOf("www.") ? a.substring(4) : a
    },
    de = function (a, b) {
      var c = a.indexOf(b);
      if (5 == c || 6 == c)
        if (a = a.charAt(c + b.length), "/" == a || "?" == a || "" == a || ":" == a) return !0;
      return !1
    },
    za = function (a, b) {
      if (1 == b.length && null != b[0] && "object" === typeof b[0]) return b[0];
      for (var c = {}, d = Math.min(a.length + 1, b.length), e = 0; e < d; e++)
        if ("object" === typeof b[e]) {
          for (var g in b[e]) b[e].hasOwnProperty(g) && (c[g] = b[e][g]);
          break
        } else e < a.length && (c[a[e]] = b[e]);
      return c
    },
    Ee = function (a, b) {
      for (var c = 0; c < a.length; c++)
        if (b == a[c]) return !0;
      return !1
    };
  var ee = function () {
    this.oa = [];
    this.ea = {};
    this.m = {}
  };
  ee.prototype.set = function (a, b, c) {
    this.oa.push(a);
    c ? this.m[":" + a] = b : this.ea[":" + a] = b
  };
  ee.prototype.get = function (a) {
    return this.m.hasOwnProperty(":" + a) ? this.m[":" + a] : this.ea[":" + a]
  };
  ee.prototype.map = function (a) {
    for (var b = 0; b < this.oa.length; b++) {
      var c = this.oa[b],
        d = this.get(c);
      d && a(c, d)
    }
  };
  var O = window,
    M = document,
    va = function (a, b) {
      return setTimeout(a, b)
    };
  var Qa = window,
    Za = document,
    G = function (a) {
      var b = Qa._gaUserPrefs;
      if (b && b.ioo && b.ioo() || a && !0 === Qa["ga-disable-" + a]) return !0;
      try {
        var c = Qa.external;
        if (c && c._gaUserPrefs && "oo" == c._gaUserPrefs) return !0
      } catch (g) {}
      a = [];
      b = String(Za.cookie).split(";");
      for (c = 0; c < b.length; c++) {
        var d = b[c].split("="),
          e = d[0].replace(/^\s*|\s*$/g, "");
        e && "AMP_TOKEN" == e && ((d = d.slice(1).join("=").replace(/^\s*|\s*$/g, "")) && (d = decodeURIComponent(d)), a.push(d))
      }
      for (b = 0; b < a.length; b++)
        if ("$OPT_OUT" == a[b]) return !0;
      return Za.getElementById("__gaOptOutExtension") ? !0 : !1
    };
  var Ca = function (a) {
      var b = [],
        c = M.cookie.split(";");
      a = new RegExp("^\\s*" + a + "=\\s*(.*?)\\s*$");
      for (var d = 0; d < c.length; d++) {
        var e = c[d].match(a);
        e && b.push(e[1])
      }
      return b
    },
    zc = function (a, b, c, d, e, g, ca) {
      e = G(e) ? !1 : eb.test(M.location.hostname) || "/" == c && vc.test(d) ? !1 : !0;
      if (!e) return !1;
      b && 1200 < b.length && (b = b.substring(0, 1200));
      c = a + "=" + b + "; path=" + c + "; ";
      g && (c += "expires=" + (new Date((new Date).getTime() + g)).toGMTString() + "; ");
      d && "none" !== d && (c += "domain=" + d + ";");
      ca && (c += ca + ";");
      d = M.cookie;
      M.cookie = c;
      if (!(d = d != M.cookie)) a: {
        a = Ca(a);
        for (d = 0; d < a.length; d++)
          if (b == a[d]) {
            d = !0;
            break a
          } d = !1
      }
      return d
    },
    Cc = function (a) {
      return encodeURIComponent ? encodeURIComponent(a).replace(/\(/g, "%28").replace(/\)/g, "%29") : a
    },
    vc = /^(www\.)?google(\.com?)?(\.[a-z]{2})?$/,
    eb = /(^|\.)doubleclick\.net$/i;
  var Oe = function () {
    for (var a = [], b = M.cookie.split(";"), c = /^\s*_gac_(UA-\d+-\d+)=\s*(.+?)\s*$/, d = 0; d < b.length; d++) {
      var e = b[d].match(c);
      e && a.push({
        ja: e[1],
        value: e[2],
        timestamp: Number(e[2].split(".")[1]) || 0
      })
    }
    a.sort(function (g, ca) {
      return ca.timestamp - g.timestamp
    });
    return a
  };
  var Fa, Ga, fb, Ab, ja = /^https?:\/\/[^/]*cdn\.ampproject\.org\//,
    Ue = /^(?:www\.|m\.|amp\.)+/,
    Ub = [],
    da = function (a) {
      if (ye(a[Kd])) {
        if (void 0 === Ab) {
          var b;
          if (b = (b = De.get()) && b._ga || void 0) Ab = b, J(81)
        }
        if (void 0 !== Ab) return a[Q] || (a[Q] = Ab), !1
      }
      if (a[Kd]) {
        J(67);
        if (a[ac] && "cookie" != a[ac]) return !1;
        if (void 0 !== Ab) a[Q] || (a[Q] = Ab);
        else {
          a: {
            b = String(a[W] || xa());
            var c = String(a[Yb] || "/"),
              d = Ca(String(a[U] || "_ga"));b = na(d, b, c);
            if (!b || jd.test(b)) b = !0;
            else if (b = Ca("AMP_TOKEN"), 0 == b.length) b = !0;
            else {
              if (1 == b.length && (b = decodeURIComponent(b[0]), "$RETRIEVING" == b || "$OPT_OUT" == b || "$ERROR" == b || "$NOT_FOUND" == b)) {
                b = !0;
                break a
              }
              b = !1
            }
          }
          if (b && tc(ic, String(a[Na]))) return !0
        }
      }
      return !1
    },
    ic = function () {
      Z.D([ua])
    },
    tc = function (a, b) {
      var c = Ca("AMP_TOKEN");
      if (1 < c.length) return J(55), !1;
      c = decodeURIComponent(c[0] || "");
      if ("$OPT_OUT" == c || "$ERROR" == c || G(b)) return J(62), !1;
      if (!ja.test(M.referrer) && "$NOT_FOUND" == c) return J(68), !1;
      if (void 0 !== Ab) return J(56), va(function () {
        a(Ab)
      }, 0), !0;
      if (Fa) return Ub.push(a), !0;
      if ("$RETRIEVING" == c) return J(57), va(function () {
        tc(a, b)
      }, 1E4), !0;
      Fa = !0;
      c && "$" != c[0] || (xc("$RETRIEVING", 3E4), setTimeout(Mc, 3E4), c = "");
      return Pc(c, b) ? (Ub.push(a), !0) : !1
    },
    Pc = function (a, b, c) {
      if (!window.JSON) return J(58), !1;
      var d = O.XMLHttpRequest;
      if (!d) return J(59), !1;
      var e = new d;
      if (!("withCredentials" in e)) return J(60), !1;
      e.open("POST", (c || "https://ampcid.google.com/v1/publisher:getClientId") + "?key=AIzaSyA65lEHUEizIsNtlbNo-l2K18dT680nsaM", !0);
      e.withCredentials = !0;
      e.setRequestHeader("Content-Type", "text/plain");
      e.onload = function () {
        Fa = !1;
        if (4 == e.readyState) {
          try {
            200 != e.status && (J(61), Qc("", "$ERROR", 3E4));
            var g = JSON.parse(e.responseText);
            g.optOut ? (J(63), Qc("", "$OPT_OUT", 31536E6)) : g.clientId ? Qc(g.clientId, g.securityToken, 31536E6) : !c && g.alternateUrl ? (Ga && clearTimeout(Ga), Fa = !0, Pc(a, b, g.alternateUrl)) : (J(64), Qc("", "$NOT_FOUND", 36E5))
          } catch (ca) {
            J(65), Qc("", "$ERROR", 3E4)
          }
          e = null
        }
      };
      d = {
        originScope: "AMP_ECID_GOOGLE"
      };
      a && (d.securityToken = a);
      e.send(JSON.stringify(d));
      Ga = va(function () {
        J(66);
        Qc("", "$ERROR", 3E4)
      }, 1E4);
      return !0
    },
    Mc = function () {
      Fa = !1
    },
    xc = function (a, b) {
      if (void 0 === fb) {
        fb = "";
        for (var c = id(), d = 0; d < c.length; d++) {
          var e = c[d];
          if (zc("AMP_TOKEN", encodeURIComponent(a), "/", e, "", b)) {
            fb = e;
            return
          }
        }
      }
      zc("AMP_TOKEN", encodeURIComponent(a), "/", fb, "", b)
    },
    Qc = function (a, b, c) {
      Ga && clearTimeout(Ga);
      b && xc(b, c);
      Ab = a;
      b = Ub;
      Ub = [];
      for (c = 0; c < b.length; c++) b[c](a)
    },
    ye = function (a) {
      a: {
        if (ja.test(M.referrer)) {
          var b = M.location.hostname.replace(Ue, "");
          b: {
            var c = M.referrer;c = c.replace(/^https?:\/\//, "");
            var d = c.replace(/^[^/]+/, "").split("/"),
              e = d[2];d = (d = "s" == e ? d[3] : e) ? decodeURIComponent(d) : d;
            if (!d) {
              if (0 == c.indexOf("xn--")) {
                c = "";
                break b
              }(c = c.match(/(.*)\.cdn\.ampproject\.org\/?$/)) && 2 == c.length && (d = c[1].replace(/-/g, ".").replace(/\.\./g, "-"))
            }
            c = d ? d.replace(Ue, "") : ""
          }(d = b === c) || (c = "." + c, d = b.substring(b.length - c.length, b.length) === c);
          if (d) {
            b = !0;
            break a
          } else J(78)
        }
        b = !1
      }
      return b && !1 !== a
    };
  var bd = function (a) {
      return (a ? "https:" : Ba || "https:" == M.location.protocol ? "https:" : "http:") + "// "
    },
    Ge = function (a) {
      switch (a) {
        default:
        case 1:
          return "https:// /gtm/js?id=";
        case 2:
          return "https://www.googletagmanager.com/gtag/js?id="
      }
    },
    Da = function (a) {
      this.name = "len";
      this.message = a + "-8192"
    },
    ba = function (a, b, c) {
      c = c || ua;
      if (2036 >= b.length) wc(a, b, c);
      else if (8192 >= b.length) x(a, b, c) || wd(a, b, c) || wc(a, b, c);
      else throw ge("len", b.length), new Da(b.length)
    },
    pe = function (a, b, c, d) {
      d = d || ua;
      wd(a + "?" + b, "", d, c)
    },
    wc = function (a, b, c) {
      var d = ta(a + "?" + b);
      d.onload = d.onerror = function () {
        d.onload = null;
        d.onerror = null;
        c()
      }
    },
    wd = function (a, b, c, d) {
      var e = O.XMLHttpRequest;
      if (!e) return !1;
      var g = new e;
      if (!("withCredentials" in g)) return !1;
      a = a.replace(/^http:/, "https:");
      g.open("POST", a, !0);
      g.withCredentials = !0;
      g.setRequestHeader("Content-Type", "text/plain");
      g.onreadystatechange = function () {
        if (4 == g.readyState) {
          if (d && "text/plain" === g.getResponseHeader("Content-Type")) try {
            Ea(d, g.responseText, c)
          } catch (ca) {
            ge("xhr", "rsp"), c()
          } else c();
          g = null
        }
      };
      g.send(b);
      return !0
    },
    Ea = function (a, b, c) {
      if (1 > b.length) ge("xhr", "ver", "0"), c();
      else if (3 < a.count++) ge("xhr", "tmr", "" + a.count), c();
      else {
        var d = b.charAt(0);
        if ("1" === d) oc(a, b.substring(1), c);
        else if (a.V && "2" === d) {
          var e = b.substring(1).split(","),
            g = 0;
          b = function () {
            ++g === e.length && c()
          };
          for (d = 0; d < e.length; d++) oc(a, e[d], b)
        } else ge("xhr", "ver", String(b.length)), c()
      }
    },
    oc = function (a, b, c) {
      if (0 === b.length) c();
      else {
        var d = b.charAt(0);
        switch (d) {
          case "d":
            //pe("https://stats.g.doubleclick.net/j/collect", a.U, a, c);
            break;
          case "g":
           // wc("https://www.google.%/ads/ga-audiences".replace("%", "com"), a.google, c);
            //(b = b.substring(1)) && (/^[a-z.]{1,6}$/.test(b) ? wc("https://www.google.%/ads/ga-audiences".replace("%", b), a.google, ua) : ge("tld", "bcc", b));
            break;
          case "G":
            if (a.V) {
              a.V("G-" + b.substring(1));
              c();
              break
            }
            case "x":
              if (a.V) {
                a.V();
                c();
                break
              }
              default:
                ge("xhr", "brc", d), c()
        }
      }
    },
    x = function (a, b, c) {
      return O.navigator.sendBeacon ? O.navigator.sendBeacon(a, b) ? (c(), !0) : !1 : !1
    },
    ge = function (a, b, c) {
      1 <= 100 * Math.random() || G("?") || (a = ["t=error", "_e=" + a, "_v=j89", "sr=1"], b && a.push("_f=" + b), c && a.push("_m=" + K(c.substring(0, 100))), a.push("aip=1"), a.push("z=" + hd()), wc(bd(!0) + "/u/d", a.join("&"), ua))
    };
  var qc = function () {
      return O.gaData = O.gaData || {}
    },
    h = function (a) {
      var b = qc();
      return b[a] = b[a] || {}
    };
  var Ha = function () {
    this.M = []
  };
  Ha.prototype.add = function (a) {
    this.M.push(a)
  };
  Ha.prototype.D = function (a) {
    try {
      for (var b = 0; b < this.M.length; b++) {
        var c = a.get(this.M[b]);
        c && ea(c) && c.call(O, a)
      }
    } catch (d) {}
    b = a.get(Ia);
    b != ua && ea(b) && (a.set(Ia, ua, !0), setTimeout(b, 10))
  };

  function Ja(a) {
    if (100 != a.get(Ka) && La(P(a, Q)) % 1E4 >= 100 * R(a, Ka)) throw "abort"
  }

  function Ma(a) {
    if (G(P(a, Na))) throw "abort"
  }

  function Oa() {
    var a = M.location.protocol;
    if ("http:" != a && "https:" != a) throw "abort"
  }

  function Pa(a) {
    try {
      O.navigator.sendBeacon ? J(42) : O.XMLHttpRequest && "withCredentials" in new O.XMLHttpRequest && J(40)
    } catch (c) {}
    a.set(ld, Td(a), !0);
    a.set(Ac, R(a, Ac) + 1);
    var b = [];
    ue.map(function (c, d) {
      d.F && (c = a.get(c), void 0 != c && c != d.defaultValue && ("boolean" == typeof c && (c *= 1), b.push(d.F + "=" + K("" + c))))
    });
    !1 === a.get(xe) && b.push("npa=1");
    b.push("z=" + Bd());
    a.set(Ra, b.join("&"), !0)
  }

  function Sa(a) {
    var b = P(a, fa);
    !b && a.get(Vd) && (b = "beacon");
    var c = P(a, gd),
      d = P(a, oe),
      e = c || (d || bd(!1) + "") + "/collect";
    switch (P(a, ad)) {
      case "d":
        e = c || (d || bd(!1) + "") + "/j/collect";
        b = a.get(qe) || void 0;
        pe(e, P(a, Ra), b, a.Z(Ia));
        break;
      default:
        b ? (c = P(a, Ra), d = (d = a.Z(Ia)) || ua, "image" == b ? wc(e, c, d) : "xhr" == b && wd(e, c, d) || "beacon" == b && x(e, c, d) || ba(e, c, d)) : ba(e, P(a, Ra), a.Z(Ia))
    }
    e = P(a, Na);
    e = h(e);
    b = e.hitcount;
    e.hitcount = b ? b + 1 : 1;
    e.first_hit || (e.first_hit = (new Date).getTime());
    e = P(a, Na);
    delete h(e).pending_experiments;
    a.set(Ia, ua, !0)
  }

  function Hc(a) {
    qc().expId && a.set(Nc, qc().expId);
    qc().expVar && a.set(Oc, qc().expVar);
    var b = P(a, Na);
    if (b = h(b).pending_experiments) {
      var c = [];
      for (d in b) b.hasOwnProperty(d) && b[d] && c.push(encodeURIComponent(d) + "." + encodeURIComponent(b[d]));
      var d = c.join("!")
    } else d = void 0;
    d && ((b = a.get(m)) && (d = b + "!" + d), a.set(m, d, !0))
  }

  function cd() {
    if (O.navigator && "preview" == O.navigator.loadPurpose) throw "abort"
  }

  function yd(a) {
    var b = O.gaDevIds || [];
    if (ka(b)) {
      var c = a.get("&did");
      qa(c) && 0 < c.length && (b = b.concat(c.split(",")));
      c = [];
      for (var d = 0; d < b.length; d++) Ee(c, b[d]) || c.push(b[d]);
      0 != c.length && a.set("&did", c.join(","), !0)
    }
  }

  function vb(a) {
    if (!a.get(Na)) throw "abort"
  }

  function Pe(a) {
    try {
      if (!a.get(Qe) && (a.set(Qe, !0), !a.get("&gtm"))) {
        var b = !1,
          c = O.location.search.split("?")[1];
        c && Ee(c.split("&"), "gtm_debug=x") && (b = !0);
        !b && D(M.referrer, "https://tagassistant.google.com/") && (b = !0);
        !b && Ee(M.cookie.split("; "), "__TAG_ASSISTANT=x") && (b = !0);
        !b && O.__TAG_ASSISTANT_API && (b = !0);
        if (b) {
          O["google.tagmanager.debugui2.queue"] || (O["google.tagmanager.debugui2.queue"] = [], Id("https:// /debug/bootstrap"));
          var d = M.currentScript;
          O["google.tagmanager.debugui2.queue"].push({
            messageType: "LEGACY_CONTAINER_STARTING",
            data: {
              id: a.get(Na),
              scriptSource: d && d.src || ""
            }
          })
        }
      }
    } catch (e) {}
  };
  var hd = function () {
      return Math.round(2147483647 * Math.random())
    },
    Bd = function () {
      try {
        var a = new Uint32Array(1);
        O.crypto.getRandomValues(a);
        return a[0] & 2147483647
      } catch (b) {
        return hd()
      }
    };

  function Ta(a) {
    var b = R(a, Ua);
    500 <= b && J(15);
    var c = P(a, Va);
    if ("transaction" != c && "item" != c) {
      c = R(a, Wa);
      var d = (new Date).getTime(),
        e = R(a, Xa);
      0 == e && a.set(Xa, d);
      e = Math.round(2 * (d - e) / 1E3);
      0 < e && (c = Math.min(c + e, 20), a.set(Xa, d));
      if (0 >= c) throw "abort";
      a.set(Wa, --c)
    }
    a.set(Ua, ++b)
  };
  var Ya = function () {
    this.data = new ee
  };
  Ya.prototype.get = function (a) {
    var b = $a(a),
      c = this.data.get(a);
    b && void 0 == c && (c = ea(b.defaultValue) ? b.defaultValue() : b.defaultValue);
    return b && b.Z ? b.Z(this, a, c) : c
  };
  var P = function (a, b) {
      a = a.get(b);
      return void 0 == a ? "" : "" + a
    },
    R = function (a, b) {
      a = a.get(b);
      return void 0 == a || "" === a ? 0 : Number(a)
    };
  Ya.prototype.Z = function (a) {
    return (a = this.get(a)) && ea(a) ? a : ua
  };
  Ya.prototype.set = function (a, b, c) {
    if (a)
      if ("object" == typeof a)
        for (var d in a) a.hasOwnProperty(d) && ab(this, d, a[d], c);
      else ab(this, a, b, c)
  };
  var ab = function (a, b, c, d) {
    if (void 0 != c) switch (b) {
      case Na:
        wb.test(c)
    }
    var e = $a(b);
    e && e.o ? e.o(a, b, c, d) : a.data.set(b, c, d)
  };
  var ue = new ee,
    ve = [],
    bb = function (a, b, c, d, e) {
      this.name = a;
      this.F = b;
      this.Z = d;
      this.o = e;
      this.defaultValue = c
    },
    $a = function (a) {
      var b = ue.get(a);
      if (!b)
        for (var c = 0; c < ve.length; c++) {
          var d = ve[c],
            e = d[0].exec(a);
          if (e) {
            b = d[1](e);
            ue.set(b.name, b);
            break
          }
        }
      return b
    },
    yc = function (a) {
      var b;
      ue.map(function (c, d) {
        d.F == a && (b = d)
      });
      return b && b.name
    },
    S = function (a, b, c, d, e) {
      a = new bb(a, b, c, d, e);
      ue.set(a.name, a);
      return a.name
    },
    cb = function (a, b) {
      ve.push([new RegExp("^" + a + "$"), b])
    },
    T = function (a, b, c) {
      return S(a, b, c, void 0, db)
    },
    db = function () {};
  var hb = T("apiVersion", "v"),
    ib = T("clientVersion", "_v");
  S("anonymizeIp", "aip");
  var jb = S("adSenseId", "a"),
    Va = S("hitType", "t"),
    Ia = S("hitCallback"),
    Ra = S("hitPayload");
  S("nonInteraction", "ni");
  S("currencyCode", "cu");
  S("dataSource", "ds");
  var Vd = S("useBeacon", void 0, !1),
    fa = S("transport");
  S("sessionControl", "sc", "");
  S("sessionGroup", "sg");
  S("queueTime", "qt");
  var Ac = S("_s", "_s");
  S("screenName", "cd");
  var kb = S("location", "dl", ""),
    lb = S("referrer", "dr"),
    mb = S("page", "dp", "");
  S("hostname", "dh");
  var nb = S("language", "ul"),
    ob = S("encoding", "de");
  S("title", "dt", function () {
    return M.title || void 0
  });
  cb("contentGroup([0-9]+)", function (a) {
    return new bb(a[0], "cg" + a[1])
  });
  var pb = S("screenColors", "sd"),
    qb = S("screenResolution", "sr"),
    rb = S("viewportSize", "vp"),
    sb = S("javaEnabled", "je"),
    tb = S("flashVersion", "fl");
  S("campaignId", "ci");
  S("campaignName", "cn");
  S("campaignSource", "cs");
  S("campaignMedium", "cm");
  S("campaignKeyword", "ck");
  S("campaignContent", "cc");
  var ub = S("eventCategory", "ec"),
    xb = S("eventAction", "ea"),
    yb = S("eventLabel", "el"),
    zb = S("eventValue", "ev"),
    Bb = S("socialNetwork", "sn"),
    Cb = S("socialAction", "sa"),
    Db = S("socialTarget", "st"),
    Eb = S("l1", "plt"),
    Fb = S("l2", "pdt"),
    Gb = S("l3", "dns"),
    Hb = S("l4", "rrt"),
    Ib = S("l5", "srt"),
    Jb = S("l6", "tcp"),
    Kb = S("l7", "dit"),
    Lb = S("l8", "clt"),
    Ve = S("l9", "_gst"),
    We = S("l10", "_gbt"),
    Xe = S("l11", "_cst"),
    Ye = S("l12", "_cbt"),
    Mb = S("timingCategory", "utc"),
    Nb = S("timingVar", "utv"),
    Ob = S("timingLabel", "utl"),
    Pb = S("timingValue", "utt");
  S("appName", "an");
  S("appVersion", "av", "");
  S("appId", "aid", "");
  S("appInstallerId", "aiid", "");
  S("exDescription", "exd");
  S("exFatal", "exf");
  var Nc = S("expId", "xid"),
    Oc = S("expVar", "xvar"),
    m = S("exp", "exp"),
    Rc = S("_utma", "_utma"),
    Sc = S("_utmz", "_utmz"),
    Tc = S("_utmht", "_utmht"),
    Ua = S("_hc", void 0, 0),
    Xa = S("_ti", void 0, 0),
    Wa = S("_to", void 0, 20);
  cb("dimension([0-9]+)", function (a) {
    return new bb(a[0], "cd" + a[1])
  });
  cb("metric([0-9]+)", function (a) {
    return new bb(a[0], "cm" + a[1])
  });
  S("linkerParam", void 0, void 0, Bc, db);
  var Ze = T("_cd2l", void 0, !1),
    ld = S("usage", "_u"),
    Gd = S("_um");
  S("forceSSL", void 0, void 0, function () {
    return Ba
  }, function (a, b, c) {
    J(34);
    Ba = !!c
  });
  var ed = S("_j1", "jid"),
    ia = S("_j2", "gjid");
  cb("\\&(.*)", function (a) {
    var b = new bb(a[0], a[1]),
      c = yc(a[0].substring(1));
    c && (b.Z = function (d) {
      return d.get(c)
    }, b.o = function (d, e, g, ca) {
      d.set(c, g, ca)
    }, b.F = void 0);
    return b
  });
  var Qb = T("_oot"),
    dd = S("previewTask"),
    Rb = S("checkProtocolTask"),
    md = S("validationTask"),
    Sb = S("checkStorageTask"),
    Uc = S("historyImportTask"),
    Tb = S("samplerTask"),
    Vb = S("_rlt"),
    Wb = S("buildHitTask"),
    Xb = S("sendHitTask"),
    Vc = S("ceTask"),
    zd = S("devIdTask"),
    Cd = S("timingTask"),
    Ld = S("displayFeaturesTask"),
    oa = S("customTask"),
    ze = S("fpsCrossDomainTask"),
    Re = T("_cta"),
    V = T("name"),
    Q = T("clientId", "cid"),
    n = T("clientIdTime"),
    xd = T("storedClientId"),
    Ad = S("userId", "uid"),
    Na = T("trackingId", "tid"),
    U = T("cookieName", void 0, "_ga"),
    W = T("cookieDomain"),
    Yb = T("cookiePath", void 0, "/"),
    Zb = T("cookieExpires", void 0, 63072E3),
    Hd = T("cookieUpdate", void 0, !0),
    Be = T("cookieFlags", void 0, ""),
    $b = T("legacyCookieDomain"),
    Wc = T("legacyHistoryImport", void 0, !0),
    ac = T("storage", void 0, "cookie"),
    bc = T("allowLinker", void 0, !1),
    cc = T("allowAnchor", void 0, !0),
    Ka = T("sampleRate", "sf", 100),
    dc = T("siteSpeedSampleRate", void 0, 1),
    ec = T("alwaysSendReferrer", void 0, !1),
    I = T("_gid", "_gid"),
    la = T("_gcn"),
    Kd = T("useAmpClientId"),
    ce = T("_gclid"),
    fe = T("_gt"),
    he = T("_ge", void 0, 7776E6),
    ie = T("_gclsrc"),
    je = T("storeGac", void 0, !0),
    oe = S("_x_19"),
    Ae = S("_fplc", "_fplc"),
    F = T("_cs"),
    Je = T("_useUp", void 0, !1),
    Le = S("up", "up"),
    Qe = S("_tac", void 0, !1),
    Se = T("_gbraid"),
    Te = T("_gbt"),
    bf = T("_gbe", void 0, 7776E6),
    gd = S("transportUrl"),
    Md = S("_r", "_r"),
    Od = S("_slc", "_slc"),
    qe = S("_dp"),
    ad = S("_jt", void 0, "n"),
    Ud = S("allowAdFeatures", void 0, !0),
    xe = S("allowAdPersonalizationSignals", void 0, !0);

  function X(a, b, c, d) {
    b[a] = function () {
      try {
        return d && J(d), c.apply(this, arguments)
      } catch (e) {
        throw ge("exc", a, e && e.name), e
      }
    }
  };
  var Ed = function (a) {
      if ("cookie" == a.get(ac)) return a = Ca("FPLC"), 0 < a.length ? a[0] : void 0
    },
    Fe = function (a) {
      var b;
      if (b = P(a, oe) && a.get(Ze)) b = De.get(a.get(cc)), b = !(b && b._fplc);
      b && a.set(Ae, Ed(a) || "0")
    };
  var aa = function (a) {
      var b = Math.min(R(a, dc), 100);
      return La(P(a, Q)) % 100 >= b ? !1 : !0
    },
    gc = function (a) {
      var b = {};
      if (Ec(b) || Fc(b)) {
        var c = b[Eb];
        void 0 == c || Infinity == c || isNaN(c) || (0 < c ? (Y(b, Gb), Y(b, Jb), Y(b, Ib), Y(b, Fb), Y(b, Hb), Y(b, Kb), Y(b, Lb), Y(b, Ve), Y(b, We), Y(b, Xe), Y(b, Ye), va(function () {
          a(b)
        }, 10)) : L(O, "load", function () {
          gc(a)
        }, !1))
      }
    },
    Ec = function (a) {
      var b = O.performance || O.webkitPerformance;
      b = b && b.timing;
      if (!b) return !1;
      var c = b.navigationStart;
      if (0 == c) return !1;
      a[Eb] = b.loadEventStart - c;
      a[Gb] = b.domainLookupEnd - b.domainLookupStart;
      a[Jb] = b.connectEnd - b.connectStart;
      a[Ib] = b.responseStart - b.requestStart;
      a[Fb] = b.responseEnd - b.responseStart;
      a[Hb] = b.fetchStart - c;
      a[Kb] = b.domInteractive - c;
      a[Lb] = b.domContentLoadedEventStart - c;
      a[Ve] = N.L - c;
      a[We] = N.ya - c;
      O.google_tag_manager && O.google_tag_manager._li && (b = O.google_tag_manager._li, a[Xe] = b.cst, a[Ye] = b.cbt);
      return !0
    },
    Fc = function (a) {
      if (O.top != O) return !1;
      var b = O.external,
        c = b && b.onloadT;
      b && !b.isValidLoadTime && (c = void 0);
      2147483648 < c && (c = void 0);
      0 < c && b.setPageReadyTime();
      if (void 0 == c) return !1;
      a[Eb] = c;
      return !0
    },
    Y = function (a, b) {
      var c = a[b];
      if (isNaN(c) || Infinity == c || 0 > c) a[b] = void 0
    },
    Fd = function (a) {
      return function (b) {
        if ("pageview" == b.get(Va) && !a.I) {
          a.I = !0;
          var c = aa(b),
            d = 0 < E(P(b, kb), "gclid").length,
            e = 0 < E(P(b, kb), "wbraid").length;
          (c || d || e) && gc(function (g) {
            c && a.send("timing", g);
            (d || e) && a.send("adtiming", g)
          })
        }
      }
    };
  var hc = !1,
    mc = function (a) {
      if ("cookie" == P(a, ac)) {
        if (a.get(Hd) || P(a, xd) != P(a, Q)) {
          var b = 1E3 * R(a, Zb);
          ma(a, Q, U, b);
          a.data.set(xd, P(a, Q))
        }(a.get(Hd) || uc(a) != P(a, I)) && ma(a, I, la, 864E5);
        if (a.get(je)) {
          var c = P(a, ce);
          if (c) {
            var d = Math.min(R(a, he), 1E3 * R(a, Zb));
            d = Math.min(d, 1E3 * R(a, fe) + d - (new Date).getTime());
            a.data.set(he, d);
            b = {};
            var e = P(a, fe),
              g = P(a, ie),
              ca = kc(P(a, Yb)),
              l = lc(P(a, W)),
              k = P(a, Na),
              w = P(a, Be);
            g && "aw.ds" != g ? b && (b.ua = !0) : (c = ["1", e, Cc(c)].join("."), 0 < d && (b && (b.ta = !0), zc("_gac_" + Cc(k), c, ca, l, k, d, w)));
            le(b)
          }
        } else J(75);
        a.get(je) && (c = P(a, Se)) && (g = Math.min(R(a, bf), 1E3 * R(a, Zb)), g = Math.min(g, 1E3 * R(a, Te) + g - (new Date).getTime()), a.data.set(bf, g), b = {}, e = P(a, Te), ca = kc(P(a, Yb)), l = lc(P(a, W)), d = P(a, Na), a = P(a, Be), c = ["1", e, Cc(c)].join("."), 0 < g && (b && (b.ta = !0), zc("_gac_gb_" + Cc(d), c, ca, l, d, g, a)), b.ta && J(85), b.na && J(86), b.pa && J(87))
      }
    },
    ma = function (a, b, c, d) {
      var e = nd(a, b);
      if (e) {
        c = P(a, c);
        var g = kc(P(a, Yb)),
          ca = lc(P(a, W)),
          l = P(a, Be),
          k = P(a, Na);
        if ("auto" != ca) zc(c, e, g, ca, k, d, l) && (hc = !0);
        else {
          J(32);
          for (var w = id(), Ce = 0; Ce < w.length; Ce++)
            if (ca = w[Ce], a.data.set(W, ca), e = nd(a, b), zc(c, e, g, ca, k, d, l)) {
              hc = !0;
              return
            } a.data.set(W, "auto")
        }
      }
    },
    uc = function (a) {
      var b = Ca(P(a, la));
      return Xd(a, b)
    },
    nc = function (a) {
      if ("cookie" == P(a, ac) && !hc && (mc(a), !hc)) throw "abort"
    },
    Yc = function (a) {
      if (a.get(Wc)) {
        var b = P(a, W),
          c = P(a, $b) || xa(),
          d = Xc("__utma", c, b);
        d && (J(19), a.set(Tc, (new Date).getTime(), !0), a.set(Rc, d.R), (b = Xc("__utmz", c, b)) && d.hash == b.hash && a.set(Sc, b.R))
      }
    },
    nd = function (a, b) {
      b = Cc(P(a, b));
      var c = lc(P(a, W)).split(".").length;
      a = jc(P(a, Yb));
      1 < a && (c += "-" + a);
      return b ? ["GA1", c, b].join(".") : ""
    },
    Xd = function (a, b) {
      return na(b, P(a, W), P(a, Yb))
    },
    na = function (a, b, c) {
      if (!a || 1 > a.length) J(12);
      else {
        for (var d = [], e = 0; e < a.length; e++) {
          var g = a[e];
          var ca = g.split(".");
          var l = ca.shift();
          ("GA1" == l || "1" == l) && 1 < ca.length ? (g = ca.shift().split("-"), 1 == g.length && (g[1] = "1"), g[0] *= 1, g[1] *= 1, ca = {
            H: g,
            s: ca.join(".")
          }) : ca = kd.test(g) ? {
            H: [0, 0],
            s: g
          } : void 0;
          ca && d.push(ca)
        }
        if (1 == d.length) return J(13), d[0].s;
        if (0 == d.length) J(12);
        else {
          J(14);
          d = Gc(d, lc(b).split(".").length, 0);
          if (1 == d.length) return d[0].s;
          d = Gc(d, jc(c), 1);
          1 < d.length && J(41);
          return d[0] && d[0].s
        }
      }
    },
    Gc = function (a, b, c) {
      for (var d = [], e = [], g, ca = 0; ca < a.length; ca++) {
        var l = a[ca];
        l.H[c] == b ? d.push(l) : void 0 == g || l.H[c] < g ? (e = [l], g = l.H[c]) : l.H[c] == g && e.push(l)
      }
      return 0 < d.length ? d : e
    },
    lc = function (a) {
      return 0 == a.indexOf(".") ? a.substr(1) : a
    },
    id = function () {
      var a = [],
        b = xa().split(".");
      if (4 == b.length) {
        var c = b[b.length - 1];
        if (parseInt(c, 10) == c) return ["none"]
      }
      for (c = b.length - 2; 0 <= c; c--) a.push(b.slice(c).join("."));
      b = M.location.hostname;
      eb.test(b) || vc.test(b) || a.push("none");
      return a
    },
    kc = function (a) {
      if (!a) return "/";
      1 < a.length && a.lastIndexOf("/") == a.length - 1 && (a = a.substr(0, a.length - 1));
      0 != a.indexOf("/") && (a = "/" + a);
      return a
    },
    jc = function (a) {
      a = kc(a);
      return "/" == a ? 1 : a.split("/").length
    },
    le = function (a) {
      a.ta && J(77);
      a.na && J(74);
      a.pa && J(73);
      a.ua && J(69)
    };

  function Xc(a, b, c) {
    "none" == b && (b = "");
    var d = [],
      e = Ca(a);
    a = "__utma" == a ? 6 : 2;
    for (var g = 0; g < e.length; g++) {
      var ca = ("" + e[g]).split(".");
      ca.length >= a && d.push({
        hash: ca[0],
        R: e[g],
        O: ca
      })
    }
    if (0 != d.length) return 1 == d.length ? d[0] : Zc(b, d) || Zc(c, d) || Zc(null, d) || d[0]
  }

  function Zc(a, b) {
    if (null == a) var c = a = 1;
    else c = La(a), a = La(D(a, ".") ? a.substring(1) : "." + a);
    for (var d = 0; d < b.length; d++)
      if (b[d].hash == c || b[d].hash == a) return b[d]
  };
  var Jc = new RegExp(/^https?:\/\/([^\/:]+)/),
    De = O.google_tag_data.glBridge,
    Kc = /(.*)([?&#])(?:_ga=[^&#]*)(?:&?)(.*)/,
    od = /(.*)([?&#])(?:_gac=[^&#]*)(?:&?)(.*)/;

  function Bc(a) {
    if (a.get(Ze)) return J(35), De.generate($e(a));
    var b = P(a, Q),
      c = P(a, I) || "";
    b = "_ga=2." + K(pa(c + b, 0) + "." + c + "-" + b);
    (a = af(a)) ? (J(44), a = "&_gac=1." + K([pa(a.qa, 0), a.timestamp, a.qa].join("."))) : a = "";
    return b + a
  }

  function Ic(a, b) {
    var c = new Date,
      d = O.navigator,
      e = d.plugins || [];
    a = [a, d.userAgent, c.getTimezoneOffset(), c.getYear(), c.getDate(), c.getHours(), c.getMinutes() + b];
    for (b = 0; b < e.length; ++b) a.push(e[b].description);
    return La(a.join("."))
  }

  function pa(a, b) {
    var c = new Date,
      d = O.navigator,
      e = c.getHours() + Math.floor((c.getMinutes() + b) / 60);
    return La([a, d.userAgent, d.language || "", c.getTimezoneOffset(), c.getYear(), c.getDate() + Math.floor(e / 24), (24 + e) % 24, (60 + c.getMinutes() + b) % 60].join("."))
  }
  var Dc = function (a) {
    J(48);
    this.target = a;
    this.T = !1
  };
  Dc.prototype.ca = function (a, b) {
    if (a) {
      if (this.target.get(Ze)) return De.decorate($e(this.target), a, b);
      if (a.tagName) {
        if ("a" == a.tagName.toLowerCase()) {
          a.href && (a.href = qd(this, a.href, b));
          return
        }
        if ("form" == a.tagName.toLowerCase()) return rd(this, a)
      }
      if ("string" == typeof a) return qd(this, a, b)
    }
  };
  var qd = function (a, b, c) {
      var d = Kc.exec(b);
      d && 3 <= d.length && (b = d[1] + (d[3] ? d[2] + d[3] : ""));
      (d = od.exec(b)) && 3 <= d.length && (b = d[1] + (d[3] ? d[2] + d[3] : ""));
      a = a.target.get("linkerParam");
      var e = b.indexOf("?");
      d = b.indexOf("#");
      c ? b += (-1 == d ? "#" : "&") + a : (c = -1 == e ? "?" : "&", b = -1 == d ? b + (c + a) : b.substring(0, d) + c + a + b.substring(d));
      b = b.replace(/&+_ga=/, "&_ga=");
      return b = b.replace(/&+_gac=/, "&_gac=")
    },
    rd = function (a, b) {
      if (b && b.action)
        if ("get" == b.method.toLowerCase()) {
          a = a.target.get("linkerParam").split("&");
          for (var c = 0; c < a.length; c++) {
            var d = a[c].split("="),
              e = d[1];
            d = d[0];
            for (var g = b.childNodes || [], ca = !1, l = 0; l < g.length; l++)
              if (g[l].name == d) {
                g[l].setAttribute("value", e);
                ca = !0;
                break
              } ca || (g = M.createElement("input"), g.setAttribute("type", "hidden"), g.setAttribute("name", d), g.setAttribute("value", e), b.appendChild(g))
          }
        } else "post" == b.method.toLowerCase() && (b.action = qd(a, b.action))
    };
  Dc.prototype.S = function (a, b, c) {
    function d(g) {
      try {
        g = g || O.event;
        a: {
          var ca = g.target || g.srcElement;
          for (g = 100; ca && 0 < g;) {
            if (ca.href && ca.nodeName.match(/^a(?:rea)?$/i)) {
              var l = ca;
              break a
            }
            ca = ca.parentNode;
            g--
          }
          l = {}
        }("http:" == l.protocol || "https:" == l.protocol) && sd(a, l.hostname || "") && l.href && (l.href = qd(e, l.href, b))
      } catch (k) {
        J(26)
      }
    }
    var e = this;
    this.target.get(Ze) ? De.auto(function () {
      return $e(e.target)
    }, a, b ? "fragment" : "", c) : (this.T || (this.T = !0, L(M, "mousedown", d, !1), L(M, "keyup", d, !1)), c && L(M, "submit", function (g) {
      g = g || O.event;
      if ((g = g.target || g.srcElement) && g.action) {
        var ca = g.action.match(Jc);
        ca && sd(a, ca[1]) && rd(e, g)
      }
    }))
  };
  Dc.prototype.$ = function (a) {
    if (a) {
      var b = this,
        c = b.target.get(F);
      void 0 !== c && De.passthrough(function () {
        if (c("analytics_storage")) return {};
        var d = {};
        return d._ga = b.target.get(Q), d._up = "1", d
      }, 1, !0)
    }
  };

  function sd(a, b) {
    if (b == M.location.hostname) return !1;
    for (var c = 0; c < a.length; c++)
      if (a[c] instanceof RegExp) {
        if (a[c].test(b)) return !0
      } else if (0 <= b.indexOf(a[c])) return !0;
    return !1
  }

  function ke(a, b) {
    return b != Ic(a, 0) && b != Ic(a, -1) && b != Ic(a, -2) && b != pa(a, 0) && b != pa(a, -1) && b != pa(a, -2)
  }

  function $e(a) {
    var b = af(a),
      c = {};
    c._ga = a.get(Q);
    c._gid = a.get(I) || void 0;
    c._gac = b ? [b.qa, b.timestamp].join(".") : void 0;
    b = a.get(Ae);
    a = Ed(a);
    return c._fplc = b && "0" !== b ? b : a, c
  }

  function af(a) {
    function b(e) {
      return void 0 == e || "" === e ? 0 : Number(e)
    }
    var c = a.get(ce);
    if (c && a.get(je)) {
      var d = b(a.get(fe));
      if (1E3 * d + b(a.get(he)) <= (new Date).getTime()) J(76);
      else return {
        timestamp: d,
        qa: c
      }
    }
  };
  var p = /^(GTM|OPT)-[A-Z0-9]+$/,
    Ie = /^G-[A-Z0-9]+$/,
    q = /;_gaexp=[^;]*/g,
    r = /;((__utma=)|([^;=]+=GAX?\d+\.))[^;]*/g,
    Aa = /^https?:\/\/[\w\-.]+\.google.com(:\d+)?\/optimize\/opt-launch\.html\?.*$/,
    t = function (a) {
      function b(d, e) {
        e && (c += "&" + d + "=" + K(e))
      }
      var c = Ge(a.type) + K(a.id);
      "dataLayer" != a.B && b("l", a.B);
      b("cx", a.context);
      b("t", a.target);
      b("cid", a.clientId);
      b("cidt", a.ka);
      b("gac", a.la);
      b("aip", a.ia);
      a.sync && b("m", "sync");
      b("cycle", a.G);
      a.qa && b("gclid", a.qa);
      Aa.test(M.referrer) && b("cb", String(hd()));
      return c
    },
    He = function (a, b) {
      var c = (new Date).getTime();
      O[a.B] = O[a.B] || [];
      c = {
        "gtm.start": c
      };
      a.sync || (c.event = "gtm.js");
      O[a.B].push(c);
      2 === a.type && function (d, e, g) {
        O[a.B].push(arguments)
      }("config", a.id, b)
    },
    Ke = function (a, b, c, d) {
      c = c || {};
      var e = 1;
      Ie.test(b) && (e = 2);
      var g = {
          id: b,
          type: e,
          B: c.dataLayer || "dataLayer",
          G: !1
        },
        ca = void 0;
      a.get("&gtm") == b && (g.G = !0);
      1 === e ? (g.ia = !!a.get("anonymizeIp"), g.sync = d, b = String(a.get("name")), "t0" != b && (g.target = b), G(String(a.get("trackingId"))) || (g.clientId = String(a.get(Q)), g.ka = Number(a.get(n)), c = c.palindrome ? r : q, c = (c = M.cookie.replace(/^|(; +)/g, ";").match(c)) ? c.sort().join("").substring(1) : void 0, g.la = c, g.qa = E(P(a, kb), "gclid"))) : 2 === e && (g.context = "c", ca = {
        allow_google_signals: a.get(Ud),
        allow_ad_personalization_signals: a.get(xe)
      });
      He(g, ca);
      return t(g)
    };
  var H = {},
    Jd = function (a, b) {
      b || (b = (b = P(a, V)) && "t0" != b ? Wd.test(b) ? "_gat_" + Cc(P(a, Na)) : "_gat_" + Cc(b) : "_gat");
      this.Y = b
    },
    Rd = function (a, b) {
      var c = b.get(Wb);
      b.set(Wb, function (e) {
        Pd(a, e, ed);
        Pd(a, e, ia);
        var g = c(e);
        Qd(a, e);
        return g
      });
      var d = b.get(Xb);
      b.set(Xb, function (e) {
        var g = d(e);
        if (se(e)) {
          J(80);
          var ca = {
            U: re(e, 1),
            google: re(e, 2),
            count: 0
          };
          pe("https://stats.g.doubleclick.net/j/collect", ca.U, ca);
          e.set(ed, "", !0)
        }
        return g
      })
    },
    Pd = function (a, b, c) {
      !1 === b.get(Ud) || b.get(c) || ("1" == Ca(a.Y)[0] ? b.set(c, "", !0) : b.set(c, "" + hd(), !0))
    },
    Qd = function (a, b) {
      se(b) && zc(a.Y, "1", P(b, Yb), P(b, W), P(b, Na), 6E4, P(b, Be))
    },
    se = function (a) {
      return !!a.get(ed) && !1 !== a.get(Ud)
    },
    Ne = function (a) {
      return !H[P(a, Na)] && void 0 === a.get("&gtm") && void 0 === a.get(fa) && void 0 === a.get(gd) && void 0 === a.get(oe)
    },
    re = function (a, b) {
      var c = new ee,
        d = function (g) {
          $a(g).F && c.set($a(g).F, a.get(g))
        };
      d(hb);
      d(ib);
      d(Na);
      d(Q);
      d(ed);
      1 == b && (d(Ad), d(ia), d(I));
      !1 === a.get(xe) && c.set("npa", "1");
      c.set($a(ld).F, Td(a));
      var e = "";
      c.map(function (g, ca) {
        e += K(g) + "=";
        e += K("" + ca) + "&"
      });
      e += "z=" + hd();
      1 == b ? e = "t=dc&aip=1&_r=3&" + e : 2 == b && (e = "t=sr&aip=1&_r=4&slf_rd=1&" + e);
      return e
    },
    Me = function (a) {
      if (Ne(a)) return H[P(a, Na)] = !0,
        function (b) {
          if (b && !H[b]) {
            var c = Ke(a, b);
            Id(c);
            H[b] = !0
          }
        }
    },
    Wd = /^gtm\d+$/;
  var fd = function (a, b) {
    a = a.model;
    if (!a.get("dcLoaded")) {
      var c = new $c(Dd(a));
      c.set(29);
      a.set(Gd, c.C);
      b = b || {};
      var d;
      b[U] && (d = Cc(b[U]));
      b = new Jd(a, d);
      Rd(b, a);
      a.set("dcLoaded", !0)
    }
  };
  var Sd = function (a) {
    if (!a.get("dcLoaded") && "cookie" == a.get(ac)) {
      var b = new Jd(a);
      Pd(b, a, ed);
      Pd(b, a, ia);
      Qd(b, a);
      b = se(a);
      var c = Ne(a);
      b && a.set(Md, 1, !0);
      c && a.set(Od, 1, !0);
      if (b || c) a.set(ad, "d", !0), J(79), a.set(qe, {
        U: re(a, 1),
        google: re(a, 2),
        V: Me(a),
        count: 0
      }, !0)
    }
  };
  var Lc = function () {
    var a = O.gaGlobal = O.gaGlobal || {};
    return a.hid = a.hid || hd()
  };
  var wb = /^(UA|YT|MO|GP)-(\d+)-(\d+)$/,
    pc = function (a) {
      function b(e, g) {
        d.model.data.set(e, g)
      }

      function c(e, g) {
        b(e, g);
        d.filters.add(e)
      }
      var d = this;
      this.model = new Ya;
      this.filters = new Ha;
      b(V, a[V]);
      b(Na, sa(a[Na]));
      b(U, a[U]);
      b(W, a[W] || xa());
      b(Yb, a[Yb]);
      b(Zb, a[Zb]);
      b(Hd, a[Hd]);
      b(Be, a[Be]);
      b($b, a[$b]);
      b(Wc, a[Wc]);
      b(bc, a[bc]);
      b(cc, a[cc]);
      b(Ka, a[Ka]);
      b(dc, a[dc]);
      b(ec, a[ec]);
      b(ac, a[ac]);
      b(Ad, a[Ad]);
      b(n, a[n]);
      b(Kd, a[Kd]);
      b(je, a[je]);
      b(Ze, a[Ze]);
      b(oe, a[oe]);
      b(Je, a[Je]);
      b(F, a[F]);
      b(hb, 1);
      b(ib, "j89");
      c(Re, Pe);
      c(Qb, Ma);
      c(oa, ua);
      c(dd, cd);
      c(Rb, Oa);
      c(md, vb);
      c(Sb, nc);
      c(Uc, Yc);
      c(Tb, Ja);
      c(Vb, Ta);
      c(Vc, Hc);
      c(zd, yd);
      c(Ld, Sd);
      c(ze, Fe);
      c(Wb, Pa);
      c(Xb, Sa);
      c(Cd, Fd(this));
      pd(this.model);
      td(this.model, a[Q]);
      this.model.set(jb, Lc())
    };
  pc.prototype.get = function (a) {
    return this.model.get(a)
  };
  pc.prototype.set = function (a, b) {
    this.model.set(a, b)
  };
  pc.prototype.send = function (a) {
    if (!(1 > arguments.length)) {
      if ("string" === typeof arguments[0]) {
        var b = arguments[0];
        var c = [].slice.call(arguments, 1)
      } else b = arguments[0] && arguments[0][Va], c = arguments;
      b && (c = za(me[b] || [], c), c[Va] = b, this.model.set(c, void 0, !0), this.filters.D(this.model), this.model.data.m = {})
    }
  };
  pc.prototype.ma = function (a, b) {
    var c = this;
    u(a, c, b) || (v(a, function () {
      u(a, c, b)
    }), y(String(c.get(V)), a, void 0, b, !0))
  };
  var td = function (a, b) {
      var c = P(a, U);
      a.data.set(la, "_ga" == c ? "_gid" : c + "_gid");
      if ("cookie" == P(a, ac)) {
        hc = !1;
        c = Ca(P(a, U));
        c = Xd(a, c);
        if (!c) {
          c = P(a, W);
          var d = P(a, $b) || xa();
          c = Xc("__utma", d, c);
          void 0 != c ? (J(10), c = c.O[1] + "." + c.O[2]) : c = void 0
        }
        c && (hc = !0);
        if (d = c && !a.get(Hd))
          if (d = c.split("."), 2 != d.length) d = !1;
          else if (d = Number(d[1])) {
          var e = R(a, Zb);
          d = d + e < (new Date).getTime() / 1E3
        } else d = !1;
        d && (c = void 0);
        c && (a.data.set(xd, c), a.data.set(Q, c), (c = uc(a)) && a.data.set(I, c));
        if (a.get(je) && (c = a.get(ce), d = a.get(ie), !c || d && "aw.ds" != d)) {
          c = {};
          if (M) {
            d = Oe();
            e = {};
            if (d && d.length)
              for (var g = 0; g < d.length; g++) {
                var ca = d[g].value.split(".");
                "1" != ca[0] || 3 !== ca.length ? c && (c.na = !0) : Number(ca[1]) && (e[d[g].ja] ? c && (c.pa = !0) : e[d[g].ja] = [], e[d[g].ja].push({
                  version: ca[0],
                  timestamp: 1E3 * Number(ca[1]),
                  qa: ca[2]
                }))
              }
            d = e
          } else d = {};
          d = d[P(a, Na)];
          le(c);
          d && 0 != d.length && (c = d[0], a.data.set(fe, c.timestamp / 1E3), a.data.set(ce, c.qa))
        }
      }
      if (a.get(Hd)) {
        c = be("_ga", !!a.get(cc));
        g = be("_gl", !!a.get(cc));
        d = De.get(a.get(cc));
        e = d._ga;
        g && 0 < g.indexOf("_ga*") && !e && J(30);
        if (b || !a.get(Je)) g = !1;
        else if (g = a.get(F), void 0 === g || g("analytics_storage")) g = !1;
        else {
          J(84);
          a.data.set(Le, 1);
          if (g = d._up)(g = Jc.exec(M.referrer)) ? (g = g[1], ca = M.location.hostname, g = ca === g || 0 <= ca.indexOf("." + g) || 0 <= g.indexOf("." + ca) ? !0 : !1) : g = !1;
          g = g ? !0 : !1
        }
        ca = d.gclid;
        var l = d._gac;
        if (c || e || ca || l)
          if (c && e && J(36), a.get(bc) || ye(a.get(Kd)) || g) {
            e && (J(38), a.data.set(Q, e), d._gid && (J(51), a.data.set(I, d._gid)));
            ca ? (J(82), a.data.set(ce, ca), d.gclsrc && a.data.set(ie, d.gclsrc)) : l && (e = l.split(".")) && 2 === e.length && (J(37), a.data.set(ce, e[0]), a.data.set(fe, e[1]));
            if (d = d._fplc) J(83), a.data.set(Ae, d);
            if (c) b: if (d = c.indexOf("."), -1 == d) J(22);
              else {
                e = c.substring(0, d);
                g = c.substring(d + 1);
                d = g.indexOf(".");
                c = g.substring(0, d);
                g = g.substring(d + 1);
                if ("1" == e) {
                  if (d = g, ke(d, c)) {
                    J(23);
                    break b
                  }
                } else if ("2" == e) {
                  d = g.indexOf("-");
                  e = "";
                  0 < d ? (e = g.substring(0, d), d = g.substring(d + 1)) : d = g.substring(1);
                  if (ke(e + d, c)) {
                    J(53);
                    break b
                  }
                  e && (J(2), a.data.set(I, e))
                } else {
                  J(22);
                  break b
                }
                J(11);
                a.data.set(Q, d);
                if (c = be("_gac", !!a.get(cc))) c = c.split("."), "1" != c[0] || 4 != c.length ? J(72) : ke(c[3], c[1]) ? J(71) : (a.data.set(ce, c[3]), a.data.set(fe, c[2]), J(70))
              }
          } else J(21)
      }
      b && (J(9), a.data.set(Q, K(b)));
      a.get(Q) || (b = (b = O.gaGlobal) && b.from_cookie && "cookie" !== P(a, ac) ? void 0 : (b = b && b.vid) && -1 !== b.search(jd) ? b : void 0, b ? (J(17), a.data.set(Q, b)) : (J(8), a.data.set(Q, ra())));
      a.get(I) || (J(3), a.data.set(I, ra()));
      mc(a);
      b = O.gaGlobal = O.gaGlobal || {};
      c = P(a, Q);
      a = c === P(a, xd);
      if (void 0 == b.vid || a && !b.from_cookie) b.vid = c, b.from_cookie = a
    },
    pd = function (a) {
      var b = O.navigator,
        c = O.screen,
        d = M.location,
        e = a.set;
      a: {
        var g = !!a.get(ec),
          ca = !!a.get(Kd);
        var l = M.referrer;
        if (/^(https?|android-app):\/\//i.test(l)) {
          if (g) break a;
          g = "//" + M.location.hostname;
          if (!de(l, g)) {
            if (ca && (ca = g.replace(/\./g, "-") + ".cdn.ampproject.org", de(l, ca))) {
              l = void 0;
              break a
            }
            break a
          }
        }
        l = void 0
      }
      e.call(a, lb, l);
      d && (e = d.pathname || "", "/" != e.charAt(0) && (J(31), e = "/" + e), a.set(kb, d.protocol + "//" + d.hostname + e + d.search));
      c && a.set(qb, c.width + "x" + c.height);
      c && a.set(pb, c.colorDepth + "-bit");
      c = M.documentElement;
      l = (e = M.body) && e.clientWidth && e.clientHeight;
      ca = [];
      c && c.clientWidth && c.clientHeight && ("CSS1Compat" === M.compatMode || !l) ? ca = [c.clientWidth, c.clientHeight] : l && (ca = [e.clientWidth, e.clientHeight]);
      c = 0 >= ca[0] || 0 >= ca[1] ? "" : ca.join("x");
      a.set(rb, c);
      c = a.set;
      var k;
      if ((e = (e = O.navigator) ? e.plugins : null) && e.length)
        for (l = 0; l < e.length && !k; l++) ca = e[l], -1 < ca.name.indexOf("Shockwave Flash") && (k = ca.description);
      if (!k) try {
        var w = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
        k = w.GetVariable("$version")
      } catch (Ce) {}
      if (!k) try {
        w = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), k = "WIN 6,0,21,0", w.AllowScriptAccess = "always", k = w.GetVariable("$version")
      } catch (Ce) {}
      if (!k) try {
        w = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), k = w.GetVariable("$version")
      } catch (Ce) {}
      k && (w = k.match(/[\d]+/g)) && 3 <= w.length && (k = w[0] + "." + w[1] + " r" + w[2]);
      c.call(a, tb, k || void 0);
      a.set(ob, M.characterSet || M.charset);
      a.set(sb, b && "function" === typeof b.javaEnabled && b.javaEnabled() || !1);
      a.set(nb, (b && (b.language || b.browserLanguage) || "").toLowerCase());
      a.data.set(ce, be("gclid", !0));
      a.data.set(ie, be("gclsrc", !0));
      a.data.set(fe, Math.round((new Date).getTime() / 1E3));
      a.get(ce) || (a.data.set(Se, be("wbraid", !0)), a.data.set(Te, Math.round((new Date).getTime() / 1E3)));
      if (d && a.get(cc) && (b = M.location.hash)) {
        b = b.split(/[?&#]+/);
        d = [];
        for (k = 0; k < b.length; ++k)(D(b[k], "utm_id") || D(b[k], "utm_campaign") || D(b[k], "utm_source") || D(b[k], "utm_medium") || D(b[k], "utm_term") || D(b[k], "utm_content") || D(b[k], "gclid") || D(b[k], "dclid") || D(b[k], "gclsrc") || D(b[k], "wbraid")) && d.push(b[k]);
        0 < d.length && (b = "#" + d.join("&"), a.set(kb, a.get(kb) + b))
      }
    },
    me = {
      pageview: [mb],
      event: [ub, xb, yb, zb],
      social: [Bb, Cb, Db],
      timing: [Mb, Nb, Pb, Ob]
    };
  var rc = function (a) {
      if ("prerender" == M.visibilityState) return !1;
      a();
      return !0
    },
    z = function (a) {
      if (!rc(a)) {
        J(16);
        var b = !1,
          c = function () {
            if (!b && rc(a)) {
              b = !0;
              var d = c,
                e = M;
              e.removeEventListener ? e.removeEventListener("visibilitychange", d, !1) : e.detachEvent && e.detachEvent("onvisibilitychange", d)
            }
          };
        L(M, "visibilitychange", c)
      }
    };
  var te = /^(?:(\w+)\.)?(?:(\w+):)?(\w+)$/,
    sc = function (a) {
      if (ea(a[0])) this.u = a[0];
      else {
        var b = te.exec(a[0]);
        null != b && 4 == b.length && (this.da = b[1] || "t0", this.K = b[2] || "", this.methodName = b[3], this.aa = [].slice.call(a, 1), this.K || (this.A = "create" == this.methodName, this.i = "require" == this.methodName, this.g = "provide" == this.methodName, this.ba = "remove" == this.methodName), this.i && (3 <= this.aa.length ? (this.X = this.aa[1], this.W = this.aa[2]) : this.aa[1] && (qa(this.aa[1]) ? this.X = this.aa[1] : this.W = this.aa[1])));
        b = a[1];
        a = a[2];
        if (!this.methodName) throw "abort";
        if (this.i && (!qa(b) || "" == b)) throw "abort";
        if (this.g && (!qa(b) || "" == b || !ea(a))) throw "abort";
        if (ud(this.da) || ud(this.K)) throw "abort";
        if (this.g && "t0" != this.da) throw "abort"
      }
    };

  function ud(a) {
    return 0 <= a.indexOf(".") || 0 <= a.indexOf(":")
  };
  var Yd, Zd, $d, A;
  Yd = new ee;
  $d = new ee;
  A = new ee;
  Zd = {
    ec: 45,
    ecommerce: 46,
    linkid: 47
  };
  var u = function (a, b, c) {
      b == N || b.get(V);
      var d = Yd.get(a);
      if (!ea(d)) return !1;
      b.plugins_ = b.plugins_ || new ee;
      if (b.plugins_.get(a)) return !0;
      b.plugins_.set(a, new d(b, c || {}));
      return !0
    },
    y = function (a, b, c, d, e) {
      if (!ea(Yd.get(b)) && !$d.get(b)) {
        Zd.hasOwnProperty(b) && J(Zd[b]);
        a = N.j(a);
        var g = void 0;
        if (p.test(b)) {
          J(52);
          if (!a) return !0;
          c = Ke(a.model, b, d, e);
          g = function () {
            Z.D(["provide", b, function () {}]);
            var l = O[d && d.dataLayer || "dataLayer"];
            l && l.hide && ea(l.hide.end) && l.hide[b] && (l.hide.end(), l.hide.end = void 0)
          }
        }!c && Zd.hasOwnProperty(b) ? (J(39), c = b + ".js") : J(43);
        if (c) {
          if (a) {
            var ca = a.get(oe);
            qa(ca) || (ca = void 0)
          }
          a = ae(cf(c, ca));
          a = !ca || ne(a.protocol) && B(a) ? a : ae(cf(c));
          ne(a.protocol) && B(a) && (Id(a.url, void 0, e, void 0, g), $d.set(b, !0))
        }
      }
    },
    v = function (a, b) {
      var c = A.get(a) || [];
      c.push(b);
      A.set(a, c)
    },
    C = function (a, b) {
      Yd.set(a, b);
      b = A.get(a) || [];
      for (var c = 0; c < b.length; c++) b[c]();
      A.set(a, [])
    },
    B = function (a) {
      var b = ae(M.location.href);
      if (D(a.url, Ge(1)) || D(a.url, Ge(2))) return !0;
      if (a.query || 0 <= a.url.indexOf("?") || 0 <= a.path.indexOf("://")) return !1;
      if (a.host == b.host && a.port == b.port) return !0;
      b = "http:" == a.protocol ? 80 : 443;
      return " " == a.host && (a.port || b) == b && D(a.path, "/plugins/") ? !0 : !1
    },
    ne = function (a) {
      var b = M.location.protocol;
      return "https:" == a || a == b ? !0 : "http:" != a ? !1 : "http:" == b
    },
    ae = function (a) {
      function b(l) {
        var k = l.hostname || "",
          w = 0 <= k.indexOf("]");
        k = k.split(w ? "]" : ":")[0].toLowerCase();
        w && (k += "]");
        w = (l.protocol || "").toLowerCase();
        w = 1 * l.port || ("http:" == w ? 80 : "https:" == w ? 443 : "");
        l = l.pathname || "";
        D(l, "/") || (l = "/" + l);
        return [k, "" + w, l]
      }
      var c = M.createElement("a");
      c.href = M.location.href;
      var d = (c.protocol || "").toLowerCase(),
        e = b(c),
        g = c.search || "",
        ca = d + "//" + e[0] + (e[1] ? ":" + e[1] : "");
      D(a, "//") ? a = d + a : D(a, "/") ? a = ca + a : !a || D(a, "?") ? a = ca + e[2] + (a || g) : 0 > a.split("/")[0].indexOf(":") && (a = ca + e[2].substring(0, e[2].lastIndexOf("/")) + "/" + a);
      c.href = a;
      d = b(c);
      return {
        protocol: (c.protocol || "").toLowerCase(),
        host: d[0],
        port: d[1],
        path: d[2],
        query: c.search || "",
        url: a || ""
      }
    },
    cf = function (a, b) {
      return a && 0 <= a.indexOf("/") ? a : (b || bd(!1)) + "/plugins/ua/" + a
    };
  var Z = {
    ga: function () {
      Z.fa = []
    }
  };
  Z.ga();
  Z.D = function (a) {
    var b = Z.J.apply(Z, arguments);
    b = Z.fa.concat(b);
    for (Z.fa = []; 0 < b.length && !Z.v(b[0]) && !(b.shift(), 0 < Z.fa.length););
    Z.fa = Z.fa.concat(b)
  };
  Z.J = function (a) {
    for (var b = [], c = 0; c < arguments.length; c++) try {
      var d = new sc(arguments[c]);
      d.g ? C(d.aa[0], d.aa[1]) : (d.i && (d.ha = y(d.da, d.aa[0], d.X, d.W)), b.push(d))
    } catch (e) {}
    return b
  };
  Z.v = function (a) {
    try {
      if (a.u) a.u.call(O, N.j("t0"));
      else {
        var b = a.da == gb ? N : N.j(a.da);
        if (a.A) {
          if ("t0" == a.da && (b = N.create.apply(N, a.aa), null === b)) return !0
        } else if (a.ba) N.remove(a.da);
        else if (b)
          if (a.i) {
            if (a.ha && (a.ha = y(a.da, a.aa[0], a.X, a.W)), !u(a.aa[0], b, a.W)) return !0
          } else if (a.K) {
          var c = a.methodName,
            d = a.aa,
            e = b.plugins_.get(a.K);
          e[c].apply(e, d)
        } else b[a.methodName].apply(b, a.aa)
      }
    } catch (g) {}
  };
  var N = function (a) {
    J(1);
    Z.D.apply(Z, [arguments])
  };
  N.h = {};
  N.P = [];
  N.L = 0;
  N.ya = 0;
  N.answer = 42;
  var we = [Na, W, V];
  N.create = function (a) {
    var b = za(we, [].slice.call(arguments));
    b[V] || (b[V] = "t0");
    var c = "" + b[V];
    if (N.h[c]) return N.h[c];
    if (da(b)) return null;
    b = new pc(b);
    N.h[c] = b;
    N.P.push(b);
    c = qc().tracker_created;
    if (ea(c)) try {
      c(b)
    } catch (d) {}
    return b
  };
  N.remove = function (a) {
    for (var b = 0; b < N.P.length; b++)
      if (N.P[b].get(V) == a) {
        N.P.splice(b, 1);
        N.h[a] = null;
        break
      }
  };
  N.j = function (a) {
    return N.h[a]
  };
  N.getAll = function () {
    return N.P.slice(0)
  };
  N.N = function () {
    "ga" != gb && J(49);
    var a = O[gb];
    if (!a || 42 != a.answer) {
      N.L = a && a.l;
      N.ya = 1 * new Date;
      N.loaded = !0;
      var b = O[gb] = N;
      X("create", b, b.create);
      X("remove", b, b.remove);
      X("getByName", b, b.j, 5);
      X("getAll", b, b.getAll, 6);
      b = pc.prototype;
      X("get", b, b.get, 7);
      X("set", b, b.set, 4);
      X("send", b, b.send);
      X("requireSync", b, b.ma);
      b = Ya.prototype;
      X("get", b, b.get);
      X("set", b, b.set);
      if ("https:" != M.location.protocol && !Ba) {
        a: {
          b = M.getElementsByTagName("script");
          for (var c = 0; c < b.length && 100 > c; c++) {
            var d = b[c].src;
            if (d && 0 == d.indexOf(bd(!0) + "/analytics")) {
              b = !0;
              break a
            }
          }
          b = !1
        }
        b && (Ba = !0)
      }(O.gaplugins = O.gaplugins || {}).Linker = Dc;
      b = Dc.prototype;
      C("linker", Dc);
      X("decorate", b, b.ca, 20);
      X("autoLink", b, b.S, 25);
      X("passthrough", b, b.$, 25);
      C("displayfeatures", fd);
      C("adfeatures", fd);
      a = a && a.q;
      ka(a) ? Z.D.apply(N, a) : J(50)
    }
  };
  var df = N.N,
    ef = O[gb];
  ef && ef.r ? df() : z(df);
  z(function () {
    Z.D(["provide", "render", ua])
  })
})(window);
window.ga = window.ga || function () {
  (ga.q = ga.q || []).push(arguments)
};
ga.l = +new Date;
ga('create', 'UA-158737805-1', 'auto');
ga('send', 'pageview');
document.oncontextmenu = function () {
  return !1
};
document.onselectstart = function () {
  if (event.srcElement.type != "text" && event.srcElement.type != "textarea" && event.srcElement.type != "password") {
    return !1
  } else {
    return !0
  }
};
if (window.sidebar) {
  document.onmousedown = function (e) {
    var obj = e.target;
    if (obj.tagName.toUpperCase() == 'SELECT' || obj.tagName.toUpperCase() == "INPUT" || obj.tagName.toUpperCase() == "TEXTAREA" || obj.tagName.toUpperCase() == "PASSWORD") {
      return !0
    } else {
      return !1
    }
  }
}
document.ondragstart = function () {
  return !1
};

function separationContenu() {
  $(".contenu-typewriter").each(function () {
    var e = $(this).find("h1,h2,h4").length ? $(this).find("h1,h2,h4") : $(this);
    e.hasClass("wysiwyg") || e.blast({
      delimiter: "character",
      search: !1,
      tag: "span",
      customClass: "",
      generateIndexID: !1,
      generateValueClass: !1,
      stripHTMLTags: !1,
      returnGenerated: !0,
      aria: !0
    })
  })
}

function update_nav_intra(e = !1, t = !1, n = !1) {
  function i(e) {
    var t = "addClass" == e ? 225 : 0;
    $(".nav-intra li").each(function (n) {
      var i = $(this);
      setTimeout(function () {
        i[e]("animated")
      }, t + 40 * n)
    }), "removeClass" == e && ($(".nav-intra").addClass("animation-en-cours"), setTimeout(function () {
      $(".nav-intra").removeClass("animated animation-en-cours")
    }, 40 * $(".nav-intra li").length))
  }
  if ((!(isMobile || vw <= 1150) || n) && $(".nav-intra").length && e) {
    var a = t ? "removeClass" : "addClass";
    if ($(".nav-intra").hasClass("animated") || section_courante == sections.length - 1) {
      if ($(".nav-intra").hasClass("animated") && "removeClass" == a && !$(".nav-intra").hasClass("animation-en-cours")) return i(a), !1
    } else $(".nav-intra").addClass("animated"), i(a);
    $(".nav-intra ul li.actif").removeClass("actif");
    var o = e.hasClass("fixed-wrapper") ? e.find("[data-scroll-identifiant]").attr("data-scroll-identifiant") : e.attr("data-scroll-identifiant");
    void 0 !== o && 0 != section_courante && $(".nav-intra").find('[data-scroll-anchor="' + o + '"]').length > 0 ? ($(".nav-intra").find('[data-scroll-anchor="' + o + '"]').closest("li").addClass("actif"), history.replaceState(null, "", window.location.pathname + "#" + $(".nav-intra li.actif a").attr("data-scroll-anchor"))) : history.replaceState(null, "", window.location.pathname)
  }
}

function rendre_sections_fixed(e, t) {
  e = "undefined" != typeof barba && e, t = void 0 !== t && t, e && ($(".fixed-wrapper").length && $(".fixed-wrapper").find("footer").unwrap(), sections = $("main[data-transition=container] > section, body > footer"), section_courante = 0, ancienne_section_courante = 0, $("body").addClass("premier-chargement"), $(".animated, .actif:not(.image)").removeClass("animated actif"));
  var n = !1,
    i = $("[data-transition=wrapper]").hasClass("fixed_scroll");
  if (i)
    if (sections || (sections = $("main[data-transition=container] > section, body > footer")), 0 == $(".fixed-wrapper").length && !isMobile && vw > 1150) {
      if (sections.each(function () {
          $(this).removeClass("animated actif").wrap('<div class="fixed-wrapper"></div>')
        }), n = !0, sections = $(".fixed-wrapper"), t) {
        determiner_section_courante(), changer_section(), $("main .animated").removeClass("animated");
        new FF_Section_Animations(sections.eq(section_courante), !1, !0).callAnims(), sections.eq(section_courante).addClass("actif"), playPauseVideo()
      }
    } else(isMobile || vw <= 1150) && sections.hasClass("fixed-wrapper") && (sections.each(function () {
      $(this).find("section, footer").unwrap()
    }), sections = $("main[data-transition=container] > section, body > footer"));
  if (sections || (sections = $("main[data-transition=container] > section, body > footer")), window.location.href.indexOf("#") > 0) {
    var a = window.location.href.slice(window.location.href.indexOf("#") + 1),
      o = i && vw > 1150 ? $('[data-scroll-identifiant="' + a + '"]').parent() : $('[data-scroll-identifiant="' + a + '"]');
    o.length > 0 ? changer_section(sections.index(o)) : i ? n && changer_section() : changer_section()
  } else t || (i && !isMobile && vw > 1150 ? n && changer_section() : changer_section())
}

function section_precedente() {
  section_courante > 0 && (section_courante--, changer_section())
}

function section_suivante() {
  section_courante < sections.length - 1 && (section_courante++, changer_section())
}

function changer_section(e, t) {
  e = void 0 !== e ? e : "", t = void 0 !== t ? t : "";
  if ($("body").hasClass("animation-en-cours")) return !1;
  "" == e && 0 !== e || (ancienne_section_courante = section_courante, section_courante = e);
  var n = $("body").hasClass("premier-chargement"),
    i = sections.eq(section_courante),
    a = sections.eq(ancienne_section_courante);
  if (section_courante != ancienne_section_courante || n) {
    if ($("body").addClass("animation-en-cours").removeClass("premier-chargement"), n) {
      (o = new FF_Section_Animations(i, !1, !0)).animPremierChargement()
    } else var o = new FF_Section_Animations(i, a, !0);
    o.callAnims();
    var r = 0;
    (isMobile || vw <= 1150) && (r = calculer_offset_scroll($(i))), n ? scrollToFF(i, 0, r) : scrollToFF(i, 1e3, r, t)
  }
  section_courante != ancienne_section_courante && changer_texte_bottom_right(section_courante == sections.length - 1 ? "add" : "remove")
}

function determiner_section_courante(e) {
  null == e && (e = ""), ancienne_section_courante = section_courante;
  var t = -1e5;
  Math.floor($(window).scrollTop() + $(window).height()) == Math.floor($(document).height()) || Math.floor($(window).scrollTop() + $(window).height()) >= Math.floor($(document).height()) - $("footer").innerHeight() / 2 ? section_courante = sections.length - 1 : sections.each(function (e, n) {
    var i = $(this).offset().top - $(window).scrollTop() - vh / 2;
    i > t && i <= 0 && (t = i, section_courante = e)
  })
}

function actions_lors_du_defilement(e) {
  if (!sections) return !0;
  if (isMobile || vw <= 1150) return determiner_section_courante(), changer_texte_bottom_right(section_courante == sections.length - 1 ? "add" : "remove"), !0;
  var t = (e = e || window.event).wheelDelta || -e.deltaY || -e.detail,
    n = Math.max(-1, Math.min(1, t));
  defilements.length > 149 && defilements.shift(), defilements.push(Math.abs(t));
  var i = (new Date).getTime(),
    a = i - ts_defilement_precedant;
  ts_defilement_precedant = i, a > 250 && (defilements = []);
  var o = obtenir_moyenne(defilements, 10) >= obtenir_moyenne(defilements, 70);
  if (o || !$("body").hasClass("animation-en-cours") || $("body").hasClass("defilement-en-deceleration") || $("body").addClass("defilement-en-deceleration"), o || (clearTimeout(defilement_en_deceleration_timeout), defilement_en_deceleration_timeout = setTimeout(function () {
      return $("body").removeClass("defilement-en-deceleration"), $("body,html").css("overflow", "auto"), e.preventDefault(), !1
    }, 200)), !o && $("body").hasClass("defilement-en-deceleration")) return e.preventDefault(), !1;
  if ($("body").hasClass("animation-en-cours")) return e.preventDefault(), $("body,html").css("overflow", "hidden"), bodyScrollLock.disableBodyScroll(), !1;
  if (peut_defiler && o) {
    $("body").removeClass("defilement-en-deceleration");
    var r = sections.eq(section_courante),
      s = "";
    0 != section_courante && (s = sections.eq(section_courante - 1)), determiner_section_courante(l);
    var l = "haut";
    if (n < 0 && (l = "bas"), section_courante == sections.length - 1 && "" != s && Math.ceil(vh) < Math.ceil(s.innerHeight()) && "haut" == l) return changer_section(sections.length - 2, !0), $("body,html").css("overflow", "hidden"), e.preventDefault(), !1;
    if (vh < r.innerHeight()) return "bas" == l ? Math.round($(window).scrollTop()) >= Math.round(r.innerHeight()) + Math.round(r.offset().top) - vh ? (section_suivante(), $("[data-transition=wrapper] > .gradient").addClass("hidden"), $("body,html").css("overflow", "hidden"), e.preventDefault(), !1) : ($("[data-transition=wrapper] > .gradient").removeClass("hidden"), $("body,html").css("overflow", "auto"), !0) : r.offset().top >= $(window).scrollTop() && "haut" == l ? (changer_section(section_courante - 1), $("[data-transition=wrapper] > .gradient").addClass("hidden"), $("body,html").css("overflow", "hidden"), e.preventDefault(), !1) : ($("[data-transition=wrapper] > .gradient").removeClass("hidden"), $("body,html").css("overflow", "auto"), !0);
    if (e.preventDefault(), $("body,html").css("overflow", "hidden"), "bas" == l) section_suivante();
    else if ("haut" == l) {
      if ($(sections[section_courante - 1]).innerHeight() > vh) return changer_section(section_courante - 1, !0), e.preventDefault(), !1;
      section_precedente()
    }
  }
  return $("body,html").css("overflow", ""), bodyScrollLock.disableBodyScroll(), e.preventDefault(), !1
}

function obtenir_moyenne(e, t) {
  for (var n = 0, i = e.slice(Math.max(e.length - t, 1)), a = 0; a < i.length; a++) n += i[a];
  return Math.ceil(n / t)
}

function ajouter_ecouteur_defilement() {
  var e, t = "";
  window.addEventListener ? e = "addEventListener" : (e = "attachEvent", t = "on");
  var n = !1;
  try {
    window.addEventListener("test", null, Object.defineProperty({}, "passive", {
      get: function () {
        n = !0
      }
    }))
  } catch (e) {}
  var i = "onwheel" in document.createElement("div") ? "wheel" : void 0 !== document.onmousewheel ? "mousewheel" : "DOMMouseScroll";
  "DOMMouseScroll" == i ? document[e](t + "MozMousePixelScroll", actions_lors_du_defilement, !!n && {
    passive: !1
  }) : document[e](t + i, actions_lors_du_defilement, !!n && {
    passive: !1
  })
}

function changer_texte_bottom_right(e) {
  var t, n = $("#bottom-right .visible");
  "add" != e || n.hasClass("retour") ? "remove" == e && n.hasClass("retour") && (t = $("#bottom-right .scrollToNext").text(), n.removeClass("retour")) : (t = $("#bottom-right .returnToTop").text(), n.addClass("retour")), t && (gsap.set(n, {
    transition: "none",
    transitionDelay: "initial"
  }), gsap.to(n, {
    opacity: 0,
    duration: .5,
    ease: "power1.out",
    onComplete: function () {
      n.text(t), gsap.to(n, {
        opacity: 1,
        duration: .5,
        ease: "power1.out",
        onComplete: function () {
          gsap.set(n, {
            transition: "",
            transitionDelay: ""
          })
        }
      })
    }
  }))
}

function charger_lecteur_video(e) {
  if ($(e).closest(".apps-st").length > 0 && (isMobile || vw <= 1150)) return !1;
  var t = !1,
    n = !1;
  $(e).closest(".showreel").length > 0 && (t = !0), $(e).closest(".apps-st").length > 0 && (!isMobile && vw > 1150 && (n = !0), $(e).closest(".slide").hasClass("to-be-activated") || (t = !1));
  var i = "auto";
  $(e).closest(".showreel").length > 0 && (i = "540p"), $(e).closest(".apps-st").length > 0 && (i = "240p");
  var a = !0;
  $("body").hasClass("device-ipad-ios13") && (a = !1);
  var o = new Plyr($(e), {
    autopause: n,
    autoplay: t,
    loop: {
      active: !0
    },
    muted: !0,
    debug: !1,
    fullscreen: {
      enabled: a,
      iosNative: !t
    },
    vimeo: {
      textrack: "none",
      quality: i
    },
    controls: ["play", "progress", "current-time", "mute", "volume", a ? "fullscreen" : ""]
  });
  return plyr_players[plyr_players_index] = o, $(o.elements.container).attr("data-plyr-player-index", plyr_players_index), plyr_players_index++, (o.loop = !0) && o.on("timeupdate", function (e) {
    clearTimeout(plyrTimeOut_timeupdate), plyrTimeOut_timeupdate = setTimeout(function () {
      e.detail.plyr.playing && !e.detail.plyr.paused && !e.detail.plyr.stopped && 1 == e.detail.plyr.buffered && document.body.contains($(e.detail.plyr.elements.container)[0]) && reinitialiser_lecteur_video(o)
    }, 1e3)
  }), $(e).closest(".showreel").length > 0 && o.once("progress", function () {
    $(o.elements.container.parentNode).addClass("animated")
  }), o.on("ready", function () {
    o.muted = !0, o.currentTime = 0, o.toggleCaptions(!1)
  }), o.on("enterfullscreen", function () {
    $(o.elements.container).find(".plyr__video-embed__container").css("max-width", "100vw")
  }), o.on("exitfullscreen", function () {
    $(o.elements.container).find(".plyr__video-embed__container").css("max-width", "")
  }), o
}

function reinitialiser_lecteur_video(e) {
  if (!e.elements.container) return !1;
  var t = e.elements.original,
    n = $(e.elements.container).attr("data-plyr-player-index");
  e.provider;
  plyr_players[n] = "";
  var i;
  e.destroy(function () {
    i || (i = charger_lecteur_video($(t)[0]), $(i.elements.container).closest(".apps-st").length > 0 && $(i.elements.container).closest(".slide").hasClass("active") && i.on("ready", function () {
      i.play()
    }))
  })
}

function charger_ff_slider(e) {
  slider = new FFSlider($(e), {
    slides_to_show: 5,
    speed: 600,
    easing: Power3.easeOut,
    elements_by_slide: 1,
    show_thumbnails: !0,
    before_slide_anim: function (e) {
      if (e.slider.slider.closest(".apps-st").length > 0 && (vw > 750 && (e.current_active_slide.find(".elems-dynam").removeClass("active"), e.next_active_slide.find(".elems-dynam").slideDown(600), e.current_active_slide.find(".elems-dynam").slideUp(600)), !isMobile && e.next_active_slide.find(".plyr").length > 0)) {
        plyr_players[e.next_active_slide.find(".plyr").attr("data-plyr-player-index")].play(), $("body").addClass("animation-en-cours")
      }
    },
    after_slide_anim: function (e) {
      if (e.slider.slider.closest(".apps-st").length > 0 && (vw > 750 && e.current_active_slide.find(".elems-dynam").addClass("active"), !isMobile && e.prev_active_slide.find(".plyr").length > 0)) {
        plyr_players[e.prev_active_slide.find(".plyr").attr("data-plyr-player-index")].pause(), $("body").removeClass("animation-en-cours")
      }
    },
    after_init: function (e) {
      e.slider.slider.closest(".apps-st").length > 0 && e.slider.slider && ($(e.slider.elements).find(".contenu-typewriter").children().not(".elems-dynam").css("opacity", 1), $(e.slider.slider).find(".slide.active").addClass("to-be-activated").removeClass("active"), vw > 750 ? ($(e.slider.slider).find(".slide .elems-dynam").slideUp(0), $(e.slider.elements).find(".elems-dynam").slideUp(0), $(e.slider.slider).find(".slide .elems-dynam").each(function () {
        $(this).css("max-height", $(this).innerHeight())
      })) : $(e.slider.slider).find(".slide .elems-dynam").add($(e.slider.elements).find(".elems-dynam")).addClass("active"))
    },
    after_slide_added: function (e) {
      isMobile || e.slider.slider.closest(".apps-st").length > 0 && charger_lecteur_video(e.slide_added.find(".lecteur-video")[0]), vw > 750 && e.slider.slider.closest(".apps-st").length > 0 && $(e.slide_added).find(".elems-dynam").css("max-height", $(e.slide_added).find(".elems-dynam").innerHeight())
    },
    before_slide_removed: function (e) {
      if (!isMobile && e.slider.slider.closest(".apps-st").length > 0 && $(e.slide_removed).find(".plyr").length > 0) {
        var t = $(e.slide_removed).find(".plyr").attr("data-plyr-player-index");
        plyr_players[t].destroy(), plyr_players[t] = ""
      }
    }
  }), ff_sliders.push(slider)
}

function resize_page() {
  vw = window.innerWidth, vh = window.innerHeight, vw >= 1200 ? (rem = vw / (1920 / 17)) < 14 && (rem = 14) : vw < 1200 && vw >= 750 ? (rem = vw / (1024 / 14)) < 14 && (rem = 14) : (rem = vw / (375 / 14)) < 14 && (rem = 14), $("html").css("font-size", rem + "px")
}

function fix_vh() {
  isMobile || vw <= 1150 ? ($(".intro, footer").css("min-height", $(window).innerHeight()), $(".back-btn-container").css("height", vh), $(".nav-intra").css("top", $(window).innerHeight() / 100 * 87), plyrTimeOut = clearTimeout(plyrTimeOut), plyrTimeOut = setTimeout(function () {
    $(".bloc-video").css("height", vh), $(".plyr__video-embed__container").css("height", vh), $(".plyr__poster").css("min-height", vh), $(".plyr__poster").css("min-width", 1.7777 * screen.height), $(".plyr iframe").css("min-width", 1.7777 * screen.height)
  }, 200)) : ($(".intro, footer").css("min-height", ""), $(".back-btn-container").css("height", ""), $(".nav-intra").css("top", ""), plyrTimeOut = clearTimeout(plyrTimeOut), plyrTimeOut = setTimeout(function () {
    $(".showreel").css("height", ""), $(".bloc-video").css("height", ""), $(".plyr__video-embed__container").css("height", ""), $(".plyr__poster").css("min-height", ""), $(".plyr__poster").css("min-width", ""), $(".plyr iframe").css("min-width", "")
  }, 200))
}

function placer_nav_intra_mobile() {
  var e = $("main section:first-of-type").innerHeight(),
    t = 2 * rem;
  !isMobile && vw > 1150 || vw <= 750 ? $(".nav-intra").css("top", "") : e <= vh ? $(".nav-intra").css("top", "") : $(".nav-intra").css("top", e - t - $(".nav-intra").innerHeight() / 2 + "px")
}

function calculer_tiroir() {
  $("#tiroir-nav").css("left", -$("#tiroir-nav").innerWidth() - 6 * rem + "px")
}

function calculer_offset_scroll(e) {
  var t = 0,
    n = e.innerHeight();
  return t -= n < vh - 0 ? -n / 2 + vh / 2 : 0
}

function adapter_bloc_html_iframes_ratio() {
  /*$(".bloc-html iframe").each(function (e, t) {
    var n, i = $(t).innerWidth(),
      a = $(t).attr("width"),
      o = $(t).attr("height");
    n = a && o ? a / o : 1.7777, $(t).css("height", i / n + "px")
  })*/
}

function detection_viewport() {
  (isMobile || vw <= 1150) && sections.each(function (e) {
    if ($(this).isOnScreen() && !$(this).hasClass("animated")) {
      $(this).addClass("animated");
      new FF_Section_Animations($(this)).callAnims()
    }
  })
}

function playPauseVideo() {
  if (0 == plyr_players.length) return !1;
  var e = $(sections[section_courante]).find(".plyr").parent();
  $(e).closest(".apps-st").length > 0 && (e = $(sections[section_courante]).find(".slide.active .plyr").parent()), $.each(plyr_players, function (t, n) {
    n && "" != n && (e.find(n.elements.container).length ? (n.paused && n.play(), $(n.elements.container).closest(".bloc-video").length > 0 && !$(n.elements.container).hasClass("muted-set") && (n.muted = !1, $(n.elements.container).addClass("muted-set"))) : n.playing && n.pause())
  })
}

function valider_formulaire(e) {
  console.log("valider_formulaire");
  var t = $(e);
  champs_requis = t.find("*[required]");
  var n = t.find("input[type=email]"),
    i = !0;
  return champs_requis.removeClass("erreur"), t.find(".message.erreur").remove(), champs_requis.each(function () {
    "" != $(this).val() && null != $(this).val() || ($(this).addClass("erreur"), i = !1)
  }), $("textarea.tinymce-enabled.erreur").prev().addClass("erreur"), n.each(function () {
    "" != $(this).val() && (valider_courriel($(this).val()) || ($(this).addClass("erreur"), i = !1))
  }), i && t.hasClass("formulaire-utilisateurs") && (i = !1, t.addClass("chargement-en-cours"), t.find("input[type=submit]").after('<span class="icone-chargement fas fa-spinner"></span>'), $.ajax({
    async: !0,
    url: chemin + "ajax.php",
    type: "POST",
    data: t.serializeArray(),
    success: function (e) {
      t.removeClass("chargement-en-cours"), t.find(".icone-chargement").remove(), "SUCCES" == e ? (t.removeAttr("onsubmit"), t.submit()) : t.prepend(e)
    }
  })), console.log("valide_form --\x3e " + i), i && t.hasClass("ajax") && (i = !1, console.log("PRE envoi_du_formulaire_ajax"), envoi_du_formulaire_ajax(e)), i
}

function valider_courriel(e) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e)
}

function envoi_du_formulaire_ajax(e) {
  console.log("envoi_du_formulaire_ajax");
  var t = $(e),
    n = new FormData(t[0]);
  n.append("langue", langue), t.addClass("chargement-en-cours"), t.find(".cta").after('<span class="icone-chargement fas fa-spinner"></span>'), t.hasClass("formulaire-carriere") && n.append("formulaire-carriere", "true"), $.ajax({
    url: chemin + "ajax.php",
    type: "POST",
    processData: !1,
    contentType: !1,
    data: n,
    success: function (e) {
      t.removeClass("chargement-en-cours"), t.find(".icone-chargement").remove(), $("#overlay .message").html(e), $("#overlay").removeClass("hidden");
      var n = $("#overlay > div").innerWidth(),
        i = $("#overlay > div").innerHeight();
      gsap.fromTo("#overlay .dots", {
        width: 0
      }, {
        width: n,
        ease: "power3.out",
        duration: .3,
        delay: .4,
        clearProps: "width"
      }), gsap.fromTo("#overlay .dots", {
        height: 0
      }, {
        height: i,
        ease: "power3.out",
        duration: .3,
        delay: .6
      }), gsap.fromTo("#overlay .message", {
        y: "-1.5rem",
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: .2,
        delay: .9,
        ease: "power3.out"
      }), gsap.fromTo("#overlay .fermer-overlay", {
        opacity: 0
      }, {
        opacity: 1,
        duration: .5,
        delay: 1.1,
        ease: "power1.out"
      }), t.find("*[name][type!='hidden']").each(function () {
        $(this).val("")
      }), t.find("select option").removeAttr("selected"), t.find("select option:first-child").attr("selected", !0), t.find("*[type='checkbox']").removeAttr("checked"), t.find("*[type='radio']").removeAttr("checked"), t.find("*[type='radio']:first-child").attr("checked", !0)
    }
  })
}

function barbaAfterLeave(e) {
  return new Promise(t => {
    if ($("#wpadminbar").length > 0) {
      var n = $(e.next.container).attr("data-admin-bar-page-url").replace("&amp;", "&"),
        i = $(e.next.container).attr("data-admin-bar-page-label");
      $("#wp-admin-bar-edit a").attr("href", n).text(i)
    }
    var a = $(e.next.container.parentNode).find("header")[0];
    if ($("body").hasClass("bandeau-actif") && 0 !== $(".bandeau").length) {
      var o = $(".bandeau").innerHeight();
      $(a).css("top", o + "px")
    }
    $("header").replaceWith(a);
    if ("carriere" == ("carriere" == $(e.next.container).attr("data-transition-namespace") ? "carriere" : $(e.current.container).attr("data-transition-namespace")) || $(e.trigger).hasClass("langue")) {
      var r = $(e.next.container.parentNode.parentNode).find("footer")[0];
      $("footer").replaceWith(r)
    } else if ($("#lecteur-video-99").length > 0) {
      var s = plyr_players[$("#lecteur-video-99").attr("data-plyr-player-index")].elements.original;
      $("footer .plyr").replaceWith(s)
    }
    plyr_players = [], $("body").removeClass("page-carriere"), "carriere" == $(e.next.container).attr("data-transition-namespace") && $("body").addClass("page-carriere"), $(".overlay-header").fadeOut(0), calculer_tiroir();
    var l = e.next.container.parentNode.classList.value;
    $("[data-transition=wrapper]").removeClass().addClass(l), t()
  })
}

function barbaAnimationOut() {
  return new Promise(e => {
    $("body").hasClass("tiroir-navigation-ouvert") && ($("body").removeClass("tiroir-navigation-ouvert"), $(".overlay-header").fadeToggle(400), TweenMax.to("#tiroir-nav", .4, {
      x: 0
    }));
    var t = new FF_Section_Animations(!1, sections.eq(section_courante), !0);
    t.allowAnimOut(), update_nav_intra(sections.eq(section_courante), !0), $("body").addClass("animation-en-cours"), t.callAnims().then(e)
  })
}

function barbaBeforeEnter(e) {
  return new Promise(e => {
    var t = $("#bottom-left .active");
    $("#bottom-left .active").remove(".active"), $("#bottom-left").prepend(t), interval = setInterval(detection_viewport, 100), $(".liste-postes .description").slideUp(), changer_texte_bottom_right("remove"), $(".slider-galerie").each(function (e) {
      charger_ff_slider(this)
    }), $(".bloc-texte-images").each(function (e) {
      creationSlider("#slider-texte-images-" + e, 1e3, 8e3, "", !0, !0, "", "", "", 0, "fade")
    }), $(".lecteur-video").each(function (e) {
      $(this).hasClass("prevent-plyr-on-load") || charger_lecteur_video(this)
    }), separationContenu(), placer_nav_intra_mobile(), fix_vh(), setTimeout(svg_line_events_page, 10), adapter_bloc_html_iframes_ratio(), e()
  })
}

function barbaEnter(e) {
  return new Promise(e => {
    rendre_sections_fixed(!0), (isMobile || vw <= 1150) && (determiner_section_courante(), update_nav_intra($(sections[section_courante]), !1, !0)), e()
  })
}

function barba_routing() {
  barba.hooks.after(function (e) {
    -1 == window.location.href.indexOf("fatfishweb") && ("undefined" != typeof gtag ? gtag("config", "UA-158737805-1", {
      page_path: e.next.url.path
    }) : "undefined" != typeof ga && (ga("set", "page", e.next.url.path), ga("send", "pageview")))
  }), barba.init({
    timeout: 1e4,
    debug: !1,
    schema: {
      prefix: "data-transition"
    },
    transitions: [{
      name: "default",
      before: function (e) {
        return new Promise(function (e) {
          $("html").addClass("barba-transitioning"), e()
        })
      },
      leave: function (e) {
        return new Promise(function (e) {
          barbaAnimationOut().then(e)
        })
      },
      afterLeave: function (e) {
        return new Promise(function (t) {
          barbaAfterLeave(e).then(t)
        })
      },
      beforeEnter: function (e) {
        return new Promise(function (t) {
          $(e.current.container).remove(), barbaBeforeEnter(e).then(t)
        })
      },
      enter: function (e) {
        return new Promise(function (t) {
          barbaEnter(e).then(t)
        })
      },
      after: function (e) {
        return new Promise(function (e) {
          $("html").removeClass("barba-transitioning"), e()
        })
      }
    }],
    prevent: function (e) {
      var t = "click" === e.event.type,
        n = window.location.href;
      (n.indexOf("#") || n.indexOf("?")) && (n = n.slice(0, n.lastIndexOf("/") + 1));
      var i = n === e.href;
      if (t && i && (e.event.preventDefault(), $("body").hasClass("tiroir-navigation-ouvert") && controlTiroirs.toggleNav(), changer_texte_bottom_right("remove"), isMobile || vw <= 1150 ? scrollToFF($("main section:first-of-type"), 1e3) : changer_section(0)), $(e.el).hasClass("ab-item") || $(e.el).closest(".user_switching").length > 0) return !0
    }
  })
}

function rebuild_svg_line_events_page() {
  vw < 950 && $("#conteneur-ligne").hasClass("desktop") ? ($("#conteneur-ligne").empty(), svg_line_events_page()) : vw > 950 && $("#conteneur-ligne").hasClass("mobile") && ($("#conteneur-ligne").empty(), svg_line_events_page())
}

function svg_line_events_page() {
  var e = document.querySelector("main").classList.contains("evenements"),
    t = document.querySelector("main").classList.contains("experiences");
  if (e || t) {
    var n = document.getElementById("conteneur-ligne"),
      i = new FF_SVGRoot(n),
      a = window.innerWidth > 950 ? svg_evenements_desktop_line_model() : svg_evenements_mobile_line_model(),
      o = new FF_SVGLineDisplay(a, i, 250);
    o.setStrokeColor("rgba(255,255,255,0.3)"), o.setStrokeWidth(1);
    var r = a.getSecondaryLinesPoints(),
      s = [];
    if (r.length > 0) {
      var l = document.createElementNS(FF_SVGRoot.SVG_NAMESPACE, "g");
      l.setAttribute("id", "secondary-lines-group"), r.forEach(function (e, t) {
        s[t] = new FF_SVGSecondaryLineDisplay(e[0], e[1]), l.appendChild(s[t].getNode()), s[t].setStrokeColor("rgba(255,255,255,0.3)"), s[t].setStrokeWidth(1)
      }), i.addNode(l)
    }
    var c = new FF_SVGLineMask(i, o);
    i.addNode(c.getNode()), s.forEach(function (e) {
      var t = new FF_SVGSecondaryLineAnimation(e, .5);
      c.onLineAnimationObservable.addObserver(t), t.setInitialLineVisibility(0)
    });
    new FF_LineAnimationControl(c, a.getLineAnimationStopPoints(), "data-line-trigger", !1);
    a.getPoints().forEach(function (e) {
      if (e instanceof FF_SVGPointRelativeToTwoPoints) {
        var t = new FF_SVGPointTestDisplay(e);
        i.addNode(t.getNode()), TweenMax.set(t.getNode(), {
          transformOrigin: "50% 50%",
          scale: 0
        }), c.onLineAnimationObservable.addObserver({
          update: function (n) {
            n.drawPosition >= e.positionInLine - 2 && !e.isVisible ? (TweenMax.fromTo(t.getNode(), .15, {
              scale: 0
            }, {
              scale: 1
            }), e.isVisible = !0) : n.drawPosition < e.positionInLine - 2 && e.isVisible && (TweenMax.fromTo(t.getNode(), .15, {
              scale: 1
            }, {
              scale: 0
            }), e.isVisible = !1)
          }
        }), window.addEventListener("resize", function () {
          TweenMax.set(t.getNode(), {
            transformOrigin: "50% 50%"
          })
        })
      }
    })
  }
}

function svg_evenements_desktop_line_model() {
  var e = new FF_SVGLineModel;
  $("#conteneur-ligne").addClass("desktop");
  var t = document.querySelector('[data-line="evenements-header"]'),
    n = document.querySelectorAll('[data-line="evenement"]'),
    i = new Map;
  return i.set("evenement-top", new FF_SVGPointRelativeToHTMLElemPercent({
    x: 49.99,
    y: 140,
    parentElement: t,
    drawCommand: FF_SVGPoint.DRAW_COMMANDS.LINE_TO
  })), e.addLineComponent(i.get("evenement-top")), n.forEach(function (t, a) {
    var o = t.querySelector('[data-line="image"]'),
      r = a % 2 == 0;
    i.set("evenement-image-" + a, new FF_SVGPointRelativeToHTMLElemPercent({
      x: r ? 102.5 : -2.5,
      y: 50,
      parentElement: o,
      drawCommand: FF_SVGPoint.DRAW_COMMANDS.LINE_TO
    })), i.set("evenement-connexion-" + a, new FF_SVGPointRelativeToTwoPoints({
      parentPointX: i.get("evenement-top"),
      parentPointY: i.get("evenement-image-" + a),
      drawCommand: FF_SVGPoint.DRAW_COMMANDS.LINE_TO,
      lineAnimBP: "evenement_" + a
    })), e.addLineComponent(i.get("evenement-connexion-" + a)), e.addSecondaryLinePoints(i.get("evenement-connexion-" + a), i.get("evenement-image-" + a)), a === n.length - 1 && (i.set("evenement-bottom", new FF_SVGPointRelativeToOtherPoint({
      x: 1,
      y: 0,
      parentPoint: i.get("evenement-connexion-" + a),
      drawCommand: FF_SVGPoint.DRAW_COMMANDS.LINE_TO,
      lineAnimBP: "evenement_footer"
    })), e.addLineComponent(i.get("evenement-bottom")))
  }), e.computeLineData(), e
}

function svg_evenements_mobile_line_model() {
  var e = new FF_SVGLineModel;
  $("#conteneur-ligne").addClass("mobile");
  var t = document.querySelectorAll('[data-line="evenement"]'),
    n = new Map;
  return t.forEach(function (i, a) {
    0 === a && (n.set("evenement-top", new FF_SVGPointRelativeToHTMLElemPercent({
      x: 3,
      y: -10,
      parentElement: i,
      drawCommand: FF_SVGPoint.DRAW_COMMANDS.LINE_TO
    })), e.addLineComponent(n.get("evenement-top")));
    var o = i.querySelector('[data-line="image"]');
    n.set("evenement-image-" + a, new FF_SVGPointRelativeToHTMLElemPercent({
      x: -2.5,
      y: 50,
      parentElement: o,
      drawCommand: FF_SVGPoint.DRAW_COMMANDS.LINE_TO
    })), n.set("evenement-connexion-" + a, new FF_SVGPointRelativeToTwoPoints({
      parentPointX: n.get("evenement-top"),
      parentPointY: n.get("evenement-image-" + a),
      drawCommand: FF_SVGPoint.DRAW_COMMANDS.LINE_TO,
      lineAnimBP: "evenement_" + a
    })), e.addLineComponent(n.get("evenement-connexion-" + a)), e.addSecondaryLinePoints(n.get("evenement-connexion-" + a), n.get("evenement-image-" + a)), a === t.length - 1 && (n.set("evenement-bottom", new FF_SVGPointRelativeToOtherPoint({
      x: 1,
      y: 0,
      parentPoint: n.get("evenement-connexion-" + a),
      drawCommand: FF_SVGPoint.DRAW_COMMANDS.LINE_TO,
      lineAnimBP: "evenement_footer"
    })), e.addLineComponent(n.get("evenement-bottom")))
  }), e.computeLineData(), e
}
var rem, vh, vw, interval, ancienne_section_courante, sections, defilement_en_deceleration_timeout, controlTiroirs, plyrTimeOut, plyrTimeOut_timeupdate, plyr_players = [],
  plyr_players_index = 0,
  ff_sliders = [],
  section_courante = 0,
  peut_defiler = !1,
  defilements = [],
  ts_defilement_precedant = (new Date).getTime(),
  cachedWidth = window.innerWidth;
$(window).on("load", function () {
  resize_page(), calculer_tiroir(), fix_vh(), $("body").addClass("premier-chargement"), "carriere" == $("main").attr("data-transition-namespace") && $("body").addClass("page-carriere"), rendre_sections_fixed(), peut_defiler = !0, barbaBeforeEnter(), $("body").addClass("header-animated"), (isMobile || vw <= 1150) && update_nav_intra($(sections[section_courante]), !1, !0)
}), $(document).ready(function () {
  $(".overlay-header").fadeOut(), (navigator.userAgent.match(/(iPad|iPhone|iPod)/i) || "MacIntel" === navigator.platform && navigator.maxTouchPoints > 1 && !window.MSStream) && $("body").addClass("device-ios"), "MacIntel" === navigator.platform && navigator.maxTouchPoints > 1 && !window.MSStream && $("body").addClass("device-ipad-ios13"), navigator.userAgent.indexOf("Edge") >= 0 && $("body").addClass("browser-edge"), navigator.userAgent.indexOf("Chrome") >= 0 && $("body").addClass("browser-chrome"), navigator.userAgent.indexOf("Silk") >= 0 && $("body").addClass("browser-silk"), barba_routing(), resize_page(), calculer_tiroir(), $(window).on("resize", function () {
    var e = window.innerWidth;
    if (e !== cachedWidth) {
      if (resize_page(), calculer_tiroir(), placer_nav_intra_mobile(), fix_vh(), rendre_sections_fixed(!1, !0), rebuild_svg_line_events_page(), adapter_bloc_html_iframes_ratio(), $("body").hasClass("tiroir-navigation-ouvert")) {
        var t = Math.abs(parseFloat($("#tiroir-nav").css("left"))) + "px";
        TweenMax.to("#tiroir-nav", .4, {
          x: t
        })
      }
      cachedWidth = e
    }
  }), $(window).on("resize", $.debounce(50, function (e) {
    if (isMobile || vw <= 1150) return !0;
    scrollToFF(sections[section_courante], 500)
  })), ajouter_ecouteur_defilement(), $("a").not('[href*="' + window.location.host + '"], [href*="javascript:void(0)"]').click(function () {
    this.target = "_blank"
  }), $("a[href$='pdf'], a[href$='html']").click(function () {
    this.target = "_blank"
  }), $("#overlay").click(function () {
    setTimeout(function () {
      $("#overlay").addClass("hidden")
    }, 900), gsap.to("#overlay .message", {
      y: "1.25rem",
      opacity: 0,
      duration: .2,
      ease: "power1.in"
    }), gsap.to("#overlay .fermer-overlay", {
      opacity: 0,
      duration: .4,
      ease: "power1.out"
    }), gsap.to("#overlay .dots", {
      width: 0,
      ease: "power3.out",
      duration: .3,
      delay: .6
    }), gsap.to("#overlay .dots", {
      height: 0,
      ease: "power3.out",
      duration: .3,
      delay: .4
    })
  }), controlTiroirs = {
    ouvrirNav: function () {
      $("body").addClass("tiroir-navigation-ouvert");
      var e = Math.abs(parseFloat($("#tiroir-nav").css("left"))) + "px";
      TweenMax.to("#tiroir-nav", .4, {
        x: e
      })
    },
    fermerNav: function () {
      $("body").hasClass("tiroir-navigation-ouvert") && ($("body").removeClass("tiroir-navigation-ouvert"), TweenMax.to("#tiroir-nav", .4, {
        x: 0
      }))
    },
    toggleNav: function () {
      $("body").hasClass("tiroir-navigation-ouvert") ? this.fermerNav() : this.ouvrirNav(), this.toggleOverlay()
    },
    toggleOverlay: function () {
      if ($("body").hasClass("tiroir-navigation-ouvert") && !$(".overlay-header").hasClass("hidden")) return !1;
      $(".overlay-header").fadeToggle(400).toggleClass("hidden")
    }
  }, $("body").on("click", ".burger", function () {
    controlTiroirs.toggleNav()
  }), $("body").on("click", ".btn-contact", function () {
    controlTiroirs.fermerNav(), changer_section(sections.length - 1)
  }), $("body").on("click", '[href*="#contact"]', function (e) {
    var t = $(this).attr("href").substr(0, $(this).attr("href").indexOf("#contact"));
    $(this).attr("href") != window.location.href && t != window.location.href || (controlTiroirs.fermerNav(), changer_section(sections.length - 1))
  }), $("body").on("click", '[href*="#next"]', function (e) {
    e.preventDefault(), changer_section(section_courante + 1)
  }), $("body").on("click", "#menu-mobile-contact", function () {
    controlTiroirs.fermerNav(), controlTiroirs.toggleOverlay(), changer_section(sections.length - 1)
  }), $("body").on("click", ".overlay-header", function () {
    controlTiroirs.fermerNav(), controlTiroirs.toggleOverlay()
  }), $("body").on("click", ".cta-postuler", function () {
    var e = $(this).attr("data-id"),
      t = $(this).attr("data-departement");
    t && $("#departement").val(t).change(), $("#poste").val(e).change(), changer_section(sections.length - 1)
  }), $("body").on("click", "#bottom-right", function () {
    $("body").hasClass("animation-en-cours") || changer_section(section_courante < sections.length - 1 ? section_courante + 1 : 0)
  }), $("body").on("click", "#btn-defilez", function (e) {
    e.preventDefault(), changer_section(section_courante < sections.length - 1 ? section_courante + 1 : 0)
  });
  var e = function () {
    $(".langue").each(function () {
      $(this).toggleClass("show")
    })
  };
  $("body").hasClass("device-ios") ? ($("#bottom-left").on("click", e), barba.hooks.beforeEnter(function () {
    $("#bottom-left").on("click", e)
  })) : $("body").on("click", "#bottom-left", function () {
    $(".langue").each(function () {
      $(this).toggleClass("show")
    })
  });
  var t = function () {
    if ($("body").hasClass("bandeau-actif") && 0 != $(".bandeau").length) {
      var e = $(".bandeau").innerHeight();
      $("header").css("top", e + "px")
    }
  };
  t(), $(window).on("resize", t), $("body").on("click", ".bandeau-fermeture", function () {
    $("body").removeClass("bandeau-actif"), $("header").css("top", "")
  }), $("body").on("click", ".cta-introduction", function (e) {
    e.preventDefault(), changer_section(1)
  }), $("body").on("click", ".nav-intra a", function (e) {
    e.preventDefault();
    var t = $(this).attr("data-scroll-anchor"),
      n = $('[data-scroll-identifiant="' + t + '"]');
    changer_section(!$('[data-transition="wrapper"]').hasClass("fixed_scroll") && n.length > 0 ? n.index("section") : $(this).parent().index() + 1)
  }), $("body").on("click", ".cta-accordeon", function () {
    var e = $(this).closest(".postes-row");
    $(".postes-row").not(e).find(".description").slideUp(300), e.find(".description").slideToggle(300)
  }), !isMobile && vw > 1150 && bodyScrollLock.disableBodyScroll(), isMobile && $(document).on("scroll", $.throttle(200, function () {
    if (!sections) return !0;
    determiner_section_courante(), changer_texte_bottom_right(section_courante == sections.length - 1 ? "add" : "remove")
  })), $(window).on("keydown", function (e) {
    if (vw <= 1150) return !0;
    $("[data-transition=wrapper]").hasClass("full_scroll") && ("38" != e.keyCode && "33" != e.keyCode || 0 == section_courante ? "40" != e.keyCode && "34" != e.keyCode && "32" != e.keyCode || section_courante == sections.length - 1 || (e.preventDefault(), changer_section(section_courante + 1)) : (e.preventDefault(), changer_section(section_courante - 1)))
  })
});
class FF_Section_Animations {
  constructor(e, t = !1, n = !1) {
    this.objIn = e, this.objOut = t, this.locked = n, this.delay = 0, this.typewriterVitesse = 40, this.vitesseFullScroll = 1e3 / this.typewriterVitesse, this.blockAnims = !1, this.premierChargement = !1, this.allowOut = !1, $("[data-transition=wrapper]").hasClass("full_scroll") && !isMobile && vw > 1150 ? (this.scrollType = "full", this.delay = this.vitesseFullScroll) : $("[data-transition=wrapper]").hasClass("fixed_scroll") && !isMobile && vw > 1150 ? this.scrollType = "fixed" : this.scrollType = "default"
  }
  animPremierChargement() {
    this.delay = 0, this.premierChargement = !0
  }
  allowAnimOut() {
    this.allowOut = !0, this.typewriterVitesse = 15, interval = clearInterval(interval)
  }
  preventAnims() {
    this.blockAnims = !0, setTimeout(function () {
      $("body").removeClass("animation-en-cours")
    }, this.vitesseFullScroll * this.typewriterVitesse)
  }
  detectAnims(e) {
    if (!e) return !1;
    this.tabElements = [], this.tabElements.push(["h1:not(.blast-root)", "h2:not(.blast-root)", "h3", "h4:not(.blast-root):not(.no-anim)", "p", "li", ".cta"]);
    var t = $.map(sections, function (t, n) {
      if (t == e[0]) return n
    });
    e.hasClass("bloc-equipe") ? this.tabElements[0].push(".membre") : e.hasClass("bloc-liste-logos") ? this.tabElements[0].push(".logos>a") : e.hasClass("bloc-liste-elements") ? this.tabElements[0].push(".elements>div") : e.find(".archive-element").length ? this.tabElements[0].push(".archive-element") : e.find(".postes").length ? this.tabElements[0].push(".postes-header", ".postes-row") : t == sections.length - 1 && (!isMobile && vw > 1150 ? (this.tabElements[0].push("form>div>div", "#copyright"), this.tabElements.push([".succursale"])) : $("body").hasClass("page-carriere") && vw <= 950 ? (this.tabElements[0].push(".info-contact", "form>div>div", "#copyright"), this.tabElements.push([".succursale"])) : this.tabElements[0].push("form>div>div", ".succursale", "#copyright")), this.generalAnims(e)
  }
  generalAnims(e) {
    var t = e == this.objIn ? "addClass" : "removeClass",
      n = this.typewriterVitesse,
      i = 0,
      a = 300 / n,
      o = section_courante == sections.length - 1 && this.objIn != e,
      r = ancienne_section_courante == sections.length - 1 && this.objOut != e;
    (this.premierChargement || this.allowOut || o || r) && $(".back-btn-container")[t]("animated"), jQuery.fn.reverse = [].reverse;
    var s = 0;
    $.each(this.tabElements, (a, o) => {
      (e == this.objIn ? e.find(o.toString()) : e.find(o.toString()).reverse()).each(function (e) {
        $(this).closest(".skip-children-general-anims").length > 0 || (s++, setTimeout(() => {
          $(this)[t]("animated")
        }, s * n + 200), i < s && (i = s))
      })
    }), this.delay < i + a && (this.delay = i + a), "full" != this.scrollType || this.allowOut || (this.delay = 0)
  }
  callAnims() {
    return !this.blockAnims && new Promise(e => {
      if (("fixed" == this.scrollType || this.allowOut) && this.objOut && (this.typewriterAnim(this.objOut), this.detectAnims(this.objOut), this.objOut.find(".image.translateY").length > 0 && (this.objIn && (this.objIn.index() > this.objOut.index() || section_courante == sections.length - 1) ? TweenMax.fromTo(this.objOut.find(".image.translateY"), .45, {
          y: "0%"
        }, {
          y: "-60%",
          opacity: 0,
          ease: Power1.easeIn
        }) : TweenMax.fromTo(this.objOut.find(".image.translateY"), .45, {
          y: "0%"
        }, {
          y: "60%",
          opacity: 0,
          ease: Power1.easeIn
        })), this.objOut.hasClass("apps-st") && TweenMax.to(this.objOut.find(".slider-galerie"), .4, {
          opacity: 0,
          ease: Power2.easeIn
        }), $(".conteneur-ligne").length > 0 && gsap.to(".conteneur-ligne", {
          opacity: 0,
          duration: .4,
          ease: "power1.out"
        })), ("fixed" == this.scrollType || this.allowOut) && $("section, .fixed-wrapper").removeClass("animated"), section_courante == sections.length - 1 || this.allowOut ? update_nav_intra(this.objIn, !0) : update_nav_intra(this.objIn), "default" == this.scrollType && this.objIn && (this.objIn.is("footer") || this.objIn.find("footer").length) && (this.delay = 750 / this.typewriterVitesse), !isMobile && vw > 1150 && playPauseVideo(), this.objIn && this.objIn.hasClass("apps-st") && !isMobile && vw > 1150) {
        var t = this.objIn.find(".slide.to-be-activated .lecteur-video");
        t.length > 0 && charger_lecteur_video(t)
      }
      setTimeout(() => {
        if ("fixed" == this.scrollType && $("section, .fixed-wrapper").removeClass("actif"), !isMobile && vw > 1150 && playPauseVideo(), this.objIn) {
          if (update_nav_intra(this.objIn), this.objOut) var t = this.objOut,
            n = $.map(sections, function (e, n) {
              if (e == t[0]) return n
            });
          if (this.objIn.find(".image.translateY").length > 0 && (!isMobile && vw > 1150 ? this.objOut && this.objIn.index() > this.objOut.index() && n != sections.length - 1 || this.premierChargement ? TweenMax.fromTo(this.objIn.find(".image.translateY"), .45, {
              y: "60%",
              opacity: 0
            }, {
              y: "0%",
              opacity: 1,
              ease: Power1.easeOut,
              clearProps: "y"
            }) : TweenMax.fromTo(this.objIn.find(".image.translateY"), .45, {
              y: "-60%",
              opacity: 0
            }, {
              y: "0%",
              opacity: 1,
              ease: Power1.easeOut,
              clearProps: "y"
            }) : this.objIn.find(".image.translateY").hasClass("animated") || (this.objIn.find(".image.translateY").addClass("animated"), TweenMax.fromTo(this.objIn.find(".image.translateY"), .45, {
              x: "100%",
              opacity: 0
            }, {
              x: "0%",
              opacity: 1,
              ease: Power1.easeOut,
              clearProps: "x"
            }))), this.objIn && this.objIn.hasClass("apps-st")) {
            var i = this;
            TweenMax.to(this.objIn.find(".slider-galerie"), 1, {
              x: "0%",
              ease: Power2.easeOut,
              onComplete: function () {
                !isMobile && vw > 1150 && (i.objIn.find(".slider-galerie .lecteur-video").each(function () {
                  charger_lecteur_video(this)
                }), i.objIn.find(".slide.to-be-activated .plyr").length > 0 && plyr_players[i.objIn.find(".slide.to-be-activated .plyr").attr("data-plyr-player-index")].play()), i.objIn.find(".slide.to-be-activated").addClass("active").removeClass("to-be-activated").find(".elems-dynam").slideDown(600, function () {
                  $(this).addClass("active")
                })
              }
            })
          }
          this.objIn.addClass("animated actif"), this.typewriterAnim(this.objIn), this.detectAnims(this.objIn)
        } else this.delay = 0;
        setTimeout(() => {
          $("body").removeClass("animation-en-cours"), e()
        }, this.delay * this.typewriterVitesse)
      }, this.delay * this.typewriterVitesse)
    })
  }
  typewriterAnim(e, t = !1) {
    if (!e) return !1;
    var n = t ? e : e.find(".contenu-typewriter");
    if (!n.length) return !1;
    this.delay = 0, this.typewriterObjectList = [], this.typewriterObject = [], this.typewriterElement = [];
    var i = e == this.objIn || t ? "push" : "unshift",
      a = e == this.objIn || t ? 1 : 0;
    n.each((e, t) => {
      var n = $(t).hasClass("blast-root") ? $(t) : $(t).find(".blast-root");
      this.typewriterObject = [], n.each((e, t) => {
        this.typewriterElement = [], $(t).find(".blast").each((e, t) => {
          this.typewriterElement[i]($(t))
        }), this.typewriterObject.push(this.typewriterElement)
      }), this.typewriterObjectList.push(this.typewriterObject)
    });
    var o = 0;
    e.hasClass("bloc-equipe") && (o = this.typewriterVitesse + 200), $.each(this.typewriterObjectList, (e, t) => {
      $.each(t, (t, n) => {
        $.each(n, (t, n) => {
          setTimeout(function () {
            n.css("opacity", a)
          }, this.typewriterVitesse * t + e * o), t > this.delay && (this.delay = t)
        })
      })
    })
  }
}
$.fn.isOnScreen = function () {
  var e = $(window),
    t = this.offset(),
    n = {
      top: e.scrollTop(),
      left: e.scrollLeft()
    };
  return n.right = n.left + e.width(), n.bottom = vw < 750 ? n.top + e.height() - 100 : n.top + e.height() - 200, t.right = t.left + this.outerWidth(), t.bottom = t.top + this.outerHeight(), !(n.right < t.left || n.left > t.right || n.bottom < t.top || n.top > t.bottom)
};
