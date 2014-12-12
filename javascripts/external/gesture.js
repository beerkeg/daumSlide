/*
                           _                           
        _____  ____  ___ _| |_ _   _  _  __  ____      
       |  _  |/ __ \/ __|_   _| | | || |/__|/ __ \   
       | (_) |  ___/\__ \ | | | |_| ||  /  |  ___/   
        \__  |\____/|___/ | |_ \___/ |_|    \____/ 
        ___) |            |__/                         
        \____/                                         

  Version   : 2.0.0-pre14
  Copyright : 2014-12-11
  Author    : HTML5 Cell, daumkakao corp

*/
/*global daumtools:true, Class:true, gesture:true*/
(function (exports) {
    "use strict";

    var TOUCH_EVENT = {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend',
        cancel: 'touchcancel'
    };
    var MOUSE_EVENT = {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup'
    };

    exports.EVENT = !!('ontouchstart' in window) ? TOUCH_EVENT : MOUSE_EVENT;

    exports.DIRECTION = {
        left: 'left',
        right: 'right',
        up: 'up',
        down: 'down',
        origin: 'origin'
    };
    exports.TYPE = {
        swipe: 'swipe',
        scroll: 'scroll',
        tab: 'tab',
        down: 'down'
    };

    var util = exports.util = {};
    try {
        var eventUtil = window.DOMEvent;
        
        util.on = eventUtil.on;
        util.off = eventUtil.off;
        util.preventDefault = eventUtil.preventDefault;
        util.stopPropagation = eventUtil.stopPropagation;
    } catch(e) {
        throw new Error("Not found : event and extend");
    }
    exports.Class = window.Class;
    exports.Observer = window.Observer;
    if (!exports.Class || !exports.Observer) {
       new Error("Not found : Class & Observable");
    }

})(window.gesture = (typeof gesture === 'undefined') ? {} : gesture);

(function (exports) {
    "use strict";

    var DIRECTION = exports.DIRECTION,
        TYPE = exports.TYPE;

    exports.Session = Class.extend({
        init: function(e, threshold) {
            this.threshold = threshold;

            this.type = TYPE.tab;
            this.direction = DIRECTION.origin;
            this.startPos = null;
            this.delta = null;
            this.targetEvent = null;

            this._start(e);
        },
        _start: function(e) {
            this.startTime = new Date();

            this.setTargetEvent(e);
            this.startPos = this.getPoint();
        },
        update: function(e) {
            this.setTargetEvent(e);
            this.setDelta();
            this.setType();
        },
        setType: function () {
            if (this.type === TYPE.tab) {
                var absX = Math.abs(this.delta.x);
                var absY = Math.abs(this.delta.y);

                if (absX > 0 && absX >= absY) {
                    this.type = TYPE.swipe;
                } else if (absY > 0 && absY > absX) {
                    this.type = TYPE.scroll;
                }
            }
        },
        finishUpdate: function (e) {
            this.setTargetEvent(e);
            this.setDirection();
        },
        setDirection: function () {
            if (this.type === TYPE.swipe && this.delta.x !== 0) {
                this.direction = (this.delta.x < 0) ? DIRECTION.left : DIRECTION.right;
            } else if (this.type === TYPE.scroll && this.delta.y !== 0) {
                this.direction = (this.delta.y < 0) ? DIRECTION.up : DIRECTION.down;
            }
        },
        setTargetEvent: function(e) {
            this.targetEvent = e || window.event;
        },
        setDelta: function () {
            var currentPos = this.getPoint(),
                deltaX = currentPos.x - this.startPos.x,
                deltaY = currentPos.y - this.startPos.y;

            this.delta = {
                x: (Math.abs(deltaX) > this.threshold) ? deltaX : 0,
                y: (Math.abs(deltaY) > this.threshold) ? deltaY : 0
            };
        },
        getPoint: function() {
            return {
                x: this.getX(this.targetEvent),
                y: this.getY(this.targetEvent)
            };
        },
        getX: function (e) {
            var point = e.touches ? e.touches[0] : e;
            return point.pageX || point.clientX;
        },
        getY: function (e) {
            var point = e.touches ? e.touches[0] : e;
            return point.pageY || point.clientY;
        }
    });

})(window.gesture = (typeof gesture === 'undefined') ? {} : gesture);

(function (exports) {
    "use strict";

    var util = exports.util;
    var THRESHOLD = 10;

    var EVENT = exports.EVENT,
        TYPE = exports.TYPE;

    exports.Listener = exports.Observer.extend({
        init: function(el, option) {
            var _option = option || {};

            this.threshold = _option.threshold || THRESHOLD;
            this.session = null;
            this.el = el;

            this._bindEvent();
            this.start();
        },
        _bindEvent: function() {
            var self = this;
            this._onStart = function _onStart(e) {
                self._start(e);
            };
            this._onMove = function _onMove(e) {
                self._move(e);
            };
            this._onEnd = function _onEnd(e) {
                self._end(e);
            };
        },
        start: function () {
            util.on(this.el, EVENT.start, this._onStart);
        },
        stop: function () {
            util.off(this.el, EVENT.start, this._onStart);
            this._unbindExtraGesureEvent();
        },
        _start: function(e) {
            if (this.session) {
                this._end(e);
                return;
            }

            this.session = new exports.Session(e, this.threshold);
            this._fireStartEvent(this.session);
            this._bindExtraGestureEvent();
        },
        _move: function (e) {
            var session = this.session;
            if (session) {
                session.update(e);
                this._fireMoveEvent(session);
            }
        },
        _end: function (e) {
            var session = this.session;
            if (session) {
                session.finishUpdate(e);
                this._fireEndEvent(session);
            }

            this._unbindExtraGesureEvent();
            this.session = null;
        },
        _fireStartEvent: function(session) {
            this.emit('start', session);
        },
        _fireMoveEvent: function (session) {
            if(session.type === TYPE.swipe || session.type === TYPE.scroll) {
                this.emit([session.type, 'move'], session);
            }
        },
        _fireEndEvent: function(session) {
            if(session.type === TYPE.tab) {
                this.emit(TYPE.tab, session);
            }
            this.emit(session.direction, session);
            this.emit('end', session);
        },
        _bindExtraGestureEvent: function () {
            util.on(document, EVENT.move, this._onMove);
            util.on(document, EVENT.end, this._onEnd);
            if(EVENT.cancel) {
                util.on(document, EVENT.cancel, this._onEnd);
            }
        },
        _unbindExtraGesureEvent: function () {
            util.off(document, EVENT.move, this._onMove);
            util.off(document, EVENT.end, this._onEnd);
            if(EVENT.cancel) {
                util.off(document, EVENT.cancel, this._onEnd);
            }
        },
        onSwipe: function(callback) {
            this.on(TYPE.swipe, callback);
        },
        onScroll: function(callback) {
            this.on(TYPE.scroll, callback);
        },
        onStart: function(callback) {
            this.on('start', callback);
        },
        onMove: function(callback) {
            this.on('move', callback);
        },
        onEnd: function(callback) {
            this.on('end', callback);
        },
        onTab: function(callback) {
            this.on(TYPE.tab, callback);
        },
        destroy: function () {
            util.off(this.el, EVENT.start, this._onStart);
            this.session = null;
            this.el = null;

            this._super();
        }
    });

})(window.gesture = (typeof gesture === 'undefined') ? {} : gesture);
