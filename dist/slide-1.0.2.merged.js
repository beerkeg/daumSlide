/*! slide - v1.0.2 - 2012-08-03
* http://digit.daumcorp.com/eastkiki/slide
* Copyright (c) 2012 Dong-il Kim; Licensed  */


/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */// Inspired by base2 and Prototype
(function(){var a=!1,b=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;this.Class=function(){},Class.extend=function(c){function g(){!a&&this.init&&this.init.apply(this,arguments)}var d=this.prototype;a=!0;var e=new this;a=!1;for(var f in c)e[f]=typeof c[f]=="function"&&typeof d[f]=="function"&&b.test(c[f])?function(a,b){return function(){var c=this._super;this._super=d[a];var e=b.apply(this,arguments);return this._super=c,e}}(f,c[f]):c[f];return g.prototype=e,g.prototype.constructor=g,g.extend=arguments.callee,g}})();

(function (exports) {
    "use strict";

    var DEFAULT_FLICK_THRESHOLD = 30,
        DEFAULT_GESTURE_THRESHOLD = 30,
        EventUtil;

    function point(x, y) {
        return {
            'x': x,
            'y': y,
            'minus': function (aPoint) {
                return point(this.x - aPoint.x, this.y - aPoint.y);
            }
        };
    }

    function GestureSession(startPosX, startPosY, gestureThreshold, flickThreshold) {
        this.type = 'unindentified';
        this.direction = 'unindentified';
        this.startPos = point(startPosX, startPosY);
        this.delta = point(0, 0);
        this.targetEvent = null;
        this.term = 0;
        this.startTime = new Date();
        this.gestureThreshold = gestureThreshold;
        this.flickThreshold = flickThreshold;
    }

    GestureSession.prototype = {};
    GestureSession.prototype.isSwipe = function () {
        return this.type === 'swipe';
    };
    GestureSession.prototype.isScroll = function () {
        return this.type === 'scroll';
    };
    GestureSession.prototype.isLeft = function () {
        return this.direction === 'left';
    };
    GestureSession.prototype.isRight = function () {
        return this.direction === 'right';
    };
    GestureSession.prototype.isUp = function () {
        return this.direction === 'up';
    };
    GestureSession.prototype.isDown = function () {
        return this.direction === 'down';
    };
    GestureSession.prototype.isFlick = function () {
        return this.term < 200;
    };
    GestureSession.prototype.getTerm = function () {
        return this.term;
    };

    GestureSession.prototype.recognizeGesture = function (x, y) {
        var currentPos = point(x, y),
            delta = currentPos.minus(this.startPos);

        this.delta = delta;

        if (this.type === 'unindentified') {
            if (Math.abs(delta.x) > this.gestureThreshold && Math.abs(delta.x) >= Math.abs(delta.y)) {
                this.type = 'swipe';
                if (delta.x < 0) {
                    this.direction = 'left';
                } else {
                    this.direction = 'right';
                }
            } else if (Math.abs(delta.y) > this.gestureThreshold && Math.abs(delta.y) > Math.abs(delta.x)) {
                this.type = 'scroll';
                if (delta.y < 0) {
                    this.direction = 'up';
                } else {
                    this.direction = 'down';
                }
            }
        }
    };
    
    GestureSession.prototype.checkFlick = function () {
        this.term = new Date().getTime() - this.startTime;
    };

    EventUtil = {
        START: function () {
            return ('ontouchstart' in window) ? 'touchstart' : 'mousedown';
        }(),
        MOVE: function () {
            return ('ontouchstart' in window) ? 'touchmove' : 'mousemove';
        }(),
        END: function () {
            return ('ontouchstart' in window) ? 'touchend' : 'mouseup';
        }(),
        listen: function () {
            if (document.addEventListener) {
                return function (el, type, fn) {
                    el.addEventListener(type, fn, false);
                };
            } else {
                return function (el, type, fn) {
                    el.attachEvent('on' + type, fn);
                };
            }
        }(),
        unListen: function () {
            if (document.removeEventListener) {
                return function (el, type, fn) {
                    el.removeEventListener(type, fn);
                };
            } else {
                return function (el, type, fn) {
                    el.detachEvent("on" + type, fn);
                };
            }
        }(),
        getX: function (e) {
            var point = e.touches ? e.touches[0] : e;
            return point.pageX || point.clientX;
        },
        getY: function (e) {
            var point = e.touches ? e.touches[0] : e;
            return point.pageY || point.clientY;
        }
    };


    function GestureListener(elem, gestureThreshold, flickThreshold) {
        var session = null,
            gestureHandlers = {
            'onGestureStart': null,
            'onGestureMove': null,
            'onGetstureEnd': null
        };

        if (typeof gestureThreshold === 'undefined') {
            gestureThreshold = DEFAULT_GESTURE_THRESHOLD;
        } else if (typeof gestureThreshold !== "number") {
           throw new Error('gestureThreshold must be a number');
        }
        if (typeof flickThreshold === 'undefined') {
            flickThreshold = DEFAULT_FLICK_THRESHOLD;
        } else if (typeof flickThreshold !== "number") {
            throw new Error('flickThreshold must be a number');
        }

        function onMoveGesture(e) {
            if (session) {
                session.recognizeGesture(EventUtil.getX(e), EventUtil.getY(e));
                session.targetEvent = e || window.event;
                if (gestureHandlers.onGestureMove) {
                    gestureHandlers.onGestureMove(session);
                }
            }
        }
        function onEndGesture(e) {
            if (session) {
                session.checkFlick();
                session.targetEvent = e || window.event;
                if (gestureHandlers.onGestureEnd) {
                    gestureHandlers.onGestureEnd(session);
                }
                session = null;
            }
            EventUtil.unListen(document, EventUtil.MOVE, onMoveGesture);
            EventUtil.unListen(document, EventUtil.END, onEndGesture);
            if ('ontouchstart' in window) {
                EventUtil.unListen(document, "touchcancel", onEndGesture);
            }
        }

        EventUtil.listen(elem, EventUtil.START, function onStartGesture(e) {
            session = new GestureSession(EventUtil.getX(e), EventUtil.getY(e), gestureThreshold, flickThreshold);
            session.targetEvent = e || window.event;

            if (gestureHandlers.onGestureStart) {
                gestureHandlers.onGestureStart(session);
            }
            
            EventUtil.listen(document, EventUtil.MOVE, onMoveGesture);
            EventUtil.listen(document, EventUtil.END, onEndGesture);
            if ('ontouchstart' in window) {
                EventUtil.listen(document, "touchcancel", onEndGesture);
            }
        });

        return {
            onGestureStart: function (fn) {
                gestureHandlers.onGestureStart = fn;
            },
            onGestureMove: function (fn) {
                gestureHandlers.onGestureMove = fn;
            },
            onGestureEnd: function (fn) {
                gestureHandlers.onGestureEnd = fn;
            }
        };
    }

    exports.GestureListener = GestureListener;
    exports.GestureSession = GestureSession;
    exports.EventUtil = EventUtil;
})(window.gesture = {});


/*global Class: true, slide: true */
(function (exports) {
    "use strict";

    /**
     * slide 를 위한 데이터소스 delegate
     */
    var DataSource = exports.DataSource = Class.extend({
        /**
         * 새로운 DataSource를 생성/초기화한다.
         * @param data {Array}
         */
        init: function (data) {
            this.data = data;
            this.index = 0;
        },
        /**
         * 현재 인덱스를 설정한다.
         * @param index {Integer}
         */
        setCurrentIndex: function (index) {
            this.index = index;
        },
        /**
         * 현재/이전/다음 데이터셋을 불러온다.
         * 데이터가 없을 경우 해당 필드는 null 로 세팅된다.
         * @param callback {Function}
         */
        queryCurrentSet: function (callback) {
            var self = this;
            this.queryPrev(function (prev) {
                self.queryCurrent(function (current) {
                    self.queryNext(function (next) {
                        callback({
                            prev: prev,
                            current: current,
                            next: next
                        });
                    });
                });
            });
        },
        /**
         * 이전 데이터를 불러온다.
         * 데이터가 없을 경우 해당 필드는 null 로 세팅된다.
         * @param callback {Function}
         */
        queryPrev: function (callback) {
            if (this.index - 1 < 0) { // reaches at first
                if (typeof this.willQueryFirstOfDataDelegate === 'function') {
                    this.willQueryFirstOfDataDelegate(function (prev) {
                        callback(prev);
                    });
                } else {
                    callback(null);
                }
            } else {
                callback(this.data[this.index - 1]);
            }
        },
        /**
         * 현재 데이터를 불러온다.
         * @param callback {Function}
         */
        queryCurrent: function (callback) {
            callback(this.data[this.index]);
        },
        /**
         * 다음 데이터를 불러온다.
         * 데이터가 없을 경우 해당 필드는 null 로 세팅된다.
         * @param callback {Function}
         */
        queryNext: function (callback) {
            if (this.index + 1 >= this.data.length) { // reaches end
                if (typeof this.willQueryEndOfDataDelegate === 'function') {
                    this.willQueryEndOfDataDelegate(function (next) {
                        callback(next);
                    });
                } else {
                    callback(null);
                }
            } else {
                callback(this.data[this.index + 1]);
            }
        },
        /**
         * 다음 데이터로 이동
         */
        next: function () {
            this.index += 1;
        },
        /**
         * 이전 데이터로 이동
         */
        prev: function () {
            this.index -= 1;
        },
        /**
         * 데이터 끝에 도달하였을 때 호출될 delegate를 설정한다.
         * @param delegate {Function}
         */
        willQueryEndOfData: function (delegate) {
            this.willQueryEndOfDataDelegate = delegate;
        },
        /**
         * 현재 데이터 끝에 도달하였을 때 호출될 기본 delegate.
         * callback에 그 다음 데이터를 넘겨 호출하여 준다.
         * @param callback {Function}
         */
        willQueryEndOfDataDelegate: function (callback) {
            callback(null);
        },
        /**
         * 데이터 시작에 도달하였을 때 호출될 delegate를 설정한다.
         * @param delegate {Function}
         */
        willQueryFirstOfData: function (delegate) {
            this.willQueryFirstOfDataDelegate = delegate;
        },
        /**
         * 현재 데이터 시작에 도달하였을 때 호출될 기본 delegate.
         * callback에 그 다음 데이터를 넘겨 호출하여 준다.
         * @param callback {Function}
         */
        willQueryFirstOfDataDelegate: function (callback) {
            callback(null);
        },
        /**
         * 기존의 데이터 뒤에 새로운 데이터를 추가한다.
         * @param addends {Array}
         */
        addNextData: function (addends) {
            this.data = this.data.concat(addends);
        },
        /**
         * 기존의 데이터 앞에 새로운 데이터를 추가한다.
         * @param addends {Array}
         */
        addPrevData: function (addends) {
            this.setCurrentIndex(addends.length + this.index);
            this.data = addends.concat(this.data);
        },
        destroy: function () {
            delete this.data;
        }
    });

    /**
     * slide 를 위한 데이터소스 delegate.
     * 무한 루프 형태의 DataSource 예시
     */
    exports.InfiniteDataSource = DataSource.extend({
        init: function (data) {
            this._super(data);
        },
        /**
         * 다음 데이터로 이동, 다음 데이터가 없을 경우 맨 처음 데이터로 이동.
         */
        next: function () {
            if (this.index + 1 >= this.data.length) {
                this.index = 0;
            } else {
                this.index += 1;
            }
        },
        /**
         * 이전 데이터로 이동, 이전 데이터가 없을 경우 맨 끝 데이터로 이동.
         */
        prev: function () {
            if (this.index <= 0) {
                this.index = this.data.length - 1;
            } else {
                this.index -= 1;
            }
        },
        willQueryFirstOfDataDelegate: function (callback) {
            var data = this.data;
            callback(data[data.length - 1]);
        },
        willQueryEndOfDataDelegate: function (callback) {
            var data = this.data;
            callback(data[0]);
        }
    });

})(window.slide = (typeof slide === 'undefined') ? {} : slide);



/*jshint browser: true
*/
/*global slide:true, Class: true, gesture: true*/
(function (exports) {
    'use strict';

    var userAgent = exports.userAgent = function (ua) {
        ua = (ua || window.navigator.userAgent).toString();
        return {
            ua: ua,
            isIe8: !!(ua.match(/msie 8/i)),
            isIe9: !!(ua.match(/msie 9/i)),
            isPolaris: !!(ua.match(/polaris/i)),
            isOpera: !!(ua.match(/opera/i)),
            isWinMobile: !!(ua.match(/windows ce/i) || ua.match(/windows mobile/i)),
            isFirefox: !!(ua.match(/firefox/i)),
            isAndroid: !!(ua.match(/android/i)),
            isDolfin: !!(ua.match(/dolfin/i)),
            isIOS: !!(ua.match(/like mac os x./i)),
            isSafari: !!(!ua.match(/mobile/i) && ua.match(/safari/i)),
            androidVersion: function() {
                var major = 1, minor = 0, patch = 0, versions,
                    matches = / android ([0-9\.]+);/i.exec(ua);
                if (matches && matches.length === 2) {
                    versions = matches[1].split('.');
                    major = parseInt(versions[0], 10);
                    minor = parseInt(versions[1], 10);
                    patch = parseInt(versions[2], 10);
                }
                return {
                    major: major,
                    minor: minor,
                    patch: patch
                };
            }()
        };
    };

    /**
     * 3d gpu 가속 여부를 사용할수 있는지 판단한다.
     */
    var isTransformEnabled = exports.isTransformEnabled =  (function () {
        var ua = userAgent(),
            isOverGingerBread = ua.androidVersion.major > 2 ||
                (ua.androidVersion.major === 2 && ua.androidVersion.minor >= 3);
        return !!((ua.isAndroid && isOverGingerBread) || ua.isIOS || ua.isSafari || ua.isDolfin);
    })();
    exports.hardwareAccelStyle = isTransformEnabled ? '-webkit-transform:translate3d(0,0,0);' : '';

    var isSwipeEnabled = exports.isSwipeEnabled =  (function () {
        var ua = userAgent();
        return (ua.isAndroid || ua.isIOS || ua.isSafari || ua.isFirefox || ua.isDolfin || ua.isIe9 || ua.isIe8 || ua.isOpera) &&
            !(ua.isPolaris || ua.isWinMobile);
    })();

    exports.onResized = function (el, callback) {
        var resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize',
            width = el.clientWidth, height = el.clientHeight;

        function isSizeReallyChanged () {
            return !(width === el.clientWidth && height === el.clientHeight);
        }

        window.gesture.EventUtil.listen(window, resizeEvent, function () {
            var cnt = 0;
            setTimeout(function checkResize() {
                if (isSizeReallyChanged()) {
                    width = el.clientWidth;
                    height = el.clientHeight;
                    callback(width, height);
                } else {
                    if (cnt++ < 20) {
                        setTimeout(checkResize, 50);
                    }
                }
            }, 50);
        });
    };
    
    exports.preventDefault = function (e) {
        var ev = e || window.event;
        if (ev.preventDefault) {
            ev.preventDefault();
        } else {
            ev.returnValue = false;
        }
    };
    
    exports.stopPropagation = function (e) {
        var ev = e || window.event;
        if (ev.stopPropagation) {
            ev.stopPropagation();
        } else {
            ev.cancelBubble = true;
        }
    };
})(window.slide = (typeof slide === 'undefined') ? {} : slide);


/*jshint browser: true
*/
/*global slide:true, Class: true, gesture: true*/
(function (exports) {
    'use strict';

    var Panel = exports.Panel = Class.extend({
        /*!
         * 새로운 Panel을 생성/초기화 한다.
         * @param slide {Slide Class}
         */
        init: function (slide) {
            this.slide = slide;
            this.el = this.createPanel(slide.pageWidth);

            var self = this;
            this.slide.on('resize', function (width) {
                self.setWidth(width);
            });
        },
        /**
         * panel Element를 생성/초기화 한다.
         * @param width {Number}
         */
        createPanel: function (width) {
            var panel = document.createElement("div");

            panel.className = "panel";
            panel.style.cssText = 'height:100%;overflow:hidden;display:inline-block;' +
                                    exports.hardwareAccelStyle + 'width:' + width + 'px;';
            return panel;
        },
        /**
         * panel Element의 넓이를 바꾼다.
         * @param width {Number}
         */
        setWidth: function (width) {
            this.el.style.width = width + 'px';
        },
        /**
         * panel Element에 data를 넣는다.
         * @param data {HTMLElement}
         */
        setData: function (data) {
            this.el.innerHTML = data ? data.toHTML() : '&nbsp;';
        },
        destroy: function () {
            this.slide = null;
            this.el = null;
        }
    });
    var UlPanel = exports.UlPanel = Panel.extend({
        createPanel: function (width) {
            var panel = document.createElement("ul");

            panel.className = "panel";
            panel.style.cssText = 'height:100%;overflow:hidden;display:inline-block;' +
                                    exports.hardwareAccelStyle + 'width:' + width + 'px;';
            return panel;
        }
    });
})(window.slide = (typeof slide === 'undefined') ? {} : slide);

/*jshint browser: true
*/
/*global slide:true, Class: true, gesture: true*/
(function (exports) {
    'use strict';

    var isTransformEnabled = exports.isTransformEnabled;
    var isSwipeEnabled = exports.isSwipeEnabled;
    var Panel = exports.Panel;

    /**
     * ics 4.0.3 이상 버젼 대응.
     */
    var isUsingClone = exports.isUsingClone =  (function () {
        var ua = exports.userAgent(),
            isOverIcs4_0_3 = ua.androidVersion.major > 4 ||
                (ua.androidVersion.major === 4 && ua.androidVersion.minor > 0) ||
                (ua.androidVersion.major === 4 && ua.androidVersion.minor === 0 && ua.androidVersion.patch >= 3);
        return !!((ua.isAndroid && isOverIcs4_0_3) || ua.isDolfin);
    })();

    var slideInstanceNum = 0;
    var PANEL_PREV = 0, PANEL_CURRENT = 1, PANEL_NEXT = 2;
    var BasicContainer= exports.BasicContainer = Class.extend({
        init: function (slide, option) {
            this.slide = slide;
            this.option = option || {};

            this.el = this.createContainer(slide.pageWidth);

            this.panel = this.initPanel(this.option.PanelClass || Panel);
            this.bindEvents();
        },
        createContainer: function (width) {
            var container = document.createElement("div");

            container.className = "slide";
            if (this.option.containerId) {
                container.id = this.option.containerId;
            } else {
                slideInstanceNum += 1;
                container.id = "slide-" + slideInstanceNum;
            }
            container.style.cssText = this.setContainerStyle(width);
            return container;
        },
            setContainerStyle: function (width) {
                return "overflow:hidden;position:relative;top:0;left:0;" +
                        "width:" + width + "px;";
            },
        initPanel: function (PanelClass) {
            var panel = new PanelClass(this.slide);
            this.el.appendChild(panel.el);
            return panel;
        },
        bindEvents: function () {
            var self = this;
            this.slide.on('resize', function (width) {
                self.setSlideSize(width);
            });
        },
        setSlideSize: function (width) {
            this.el.style.width = width + 'px';
        },
        getWidth: function () {
            return this.el.clientWidth;
        },
        destroy: function () {
            this.slide = null;
            this.el = null;

            this.panel.destroy();
            this.panel = null;
        }
    });
    var MiddleContainer = exports.MiddleContainer = BasicContainer.extend({
        /**
         * 새로운 Container를 생성/초기화 한다.
         * @param slide {Slide Class}
         */
        init: function (slide, option) {
            this.slide = slide;
            this.option = option || {};

            this.el = this.createContainer(slide.pageWidth);

            this.panels = [];
            this.initPanels(this.option.PanelClass || Panel);
            this.bindEvents();
        },
        setContainerStyle: function (width) {
            return "overflow:hidden;position:relative;top:0;" + exports.hardwareAccelStyle +
                    "left:" + (-width) + "px;width:" + (width * 3) + "px;";
        },
        /**
         * slide내에 존재하는 패널들을 생성/초기화 한다.
         */
        initPanels: function (PanelClass) {
            this.panels[PANEL_PREV] = this.initPanel(PanelClass);
            this.panels[PANEL_CURRENT] = this.initPanel(PanelClass);
            this.panels[PANEL_NEXT] = this.initPanel(PanelClass);
        },
        /**
         * slide에 있는 패널들에 현재 인덱스 기준의 데이터 셋을 넣는다.
         * @param set {Object} HTMLElement 데이터 셋
         */
        setData: function (set) {
            var panels = this.panels;
            panels[PANEL_PREV].setData(set.prev);
            panels[PANEL_CURRENT].setData(set.current);
            panels[PANEL_NEXT].setData(set.next);
        },
        /**
         * 마지막 패널에 next 데이터를 넣는다.
         * @param next {HTMLElement} 다음 데이터
         */
        setNextData: function (next) {
            this.panels[PANEL_NEXT].setData(next);
        },
        /**
         * 첫번째 패널에 prev 데이터를 넣는다.
         * @param prev {HTMLElement} 이전 데이터
         */
        setPrevData: function (prev) {
            this.panels[PANEL_PREV].setData(prev);
        },
        /**
         * next 이후 패널들을 재정렬한다.
         * 첫번째 패널을 마지막으로 옮긴다.
         */
        rearrangePanelsAfterNext: function (next) {
            var panel = this.panels.shift(),
                firstPanelEl = panel.el;
            this.el.removeChild(firstPanelEl);
            this.move(0);
            this.el.appendChild(firstPanelEl);
            this.panels.push(panel);
        },
        /**
         * prev 이후 패널들을 재정렬한다.
         * 마지막 패널을 첫번째로 옮긴다.
         */
        rearrangePanelsAfterPrev: function (prev) {
            var panel = this.panels.pop(),
                lastPanelEl = panel.el,
                firstPanelEl = this.panels[0].el;
            this.el.removeChild(lastPanelEl);
            this.move(0);
            this.el.insertBefore(lastPanelEl, firstPanelEl);
            this.panels.unshift(panel);
        },
        /**
         * 주어진 offset 만큼 slide를 좌우 이동 시킨다.
         * css transition animation 없이 단순 이동
         * @param offset {Number} 이동시킬 거리 값
         */
        move: function (offset) {
            this.el.style.left = (offset - this.slide.pageWidth) + 'px';
        },
        /**
         * 변경된 slide size 와 offset 을 다시 설정한다.
         * @param width {Number}
         */
        setSlideSize: function (width) {
            this.el.style.width = (width * 3) + 'px';
            this.el.style.left = (-width) + 'px';
        },
        destroy: function () {
            this.slide = null;
            this.el = null;

            this.panels[0].destroy();
            this.panels[1].destroy();
            this.panels[2].destroy();
            delete this.panels;
        }
    });
    var AdvanceContainer = exports.AdvanceContainer = MiddleContainer.extend({
        /**
         * 주어진 offset 만큼 slide를 좌우 이동 시킨다.
         * @param offset {Number} 이동시킬 거리 값
         */
        move: function (offset) {
            this.el.style.webkitTransform = 'translate3d(' + offset + 'px, 0, 0)';
        },
        /**
         * 해당 slide(컨테이너 Element) 의 transitionDuration을 설정한다.
         * @param duration {Number}
         */
        setTransitionDuration: function (duration) {
            this.el.style.webkitTransitionDuration = duration + 'ms';
        },
        /**
         * 해당 콜백을 onwebkitTransitionEnd 에 등록한다.
         * @param callback {function}
         */
        onTransitionEnd: function (callback) {
            this.el.addEventListener('webkitTransitionEnd', callback);
        },
        /**
         * 해당 콜백을 onwebkitTransitionEnd 에서 제거한다.
         * @param callback {function}
         */
        offTransitionEnd: function (callback) {
            this.el.removeEventListener('webkitTransitionEnd', callback);
        }
    });
    
    var CloneAdvanceContainer = exports.CloneAdvanceContainer = AdvanceContainer.extend({
        rearrangePanels: function (callback) {
            var cloneEl = this.el.cloneNode(true),
                parent = this.el.parentNode;
            parent.replaceChild(cloneEl, this.el);
            
            if (callback) {
                callback();
            }

            parent.replaceChild(this.el, cloneEl);
            cloneEl = null;
        },
        rearrangePanelsAfterNext: function (next) {
            var self = this;
            this.rearrangePanels(function () {
                self._super(next);
            });
        },
        rearrangePanelsAfterPrev: function (prev) {
            var self = this;
            this.rearrangePanels(function () {
                self._super(prev);
            });
        }
    });

    exports.Container = isUsingClone ? CloneAdvanceContainer : isTransformEnabled ? AdvanceContainer : isSwipeEnabled ? MiddleContainer : BasicContainer;
})(window.slide = (typeof slide === 'undefined') ? {} : slide);


/*jshint browser: true
 */
/*global Class: true, slide: true */
(function (exports) {
    'use strict';

    exports.Observable = Class.extend({
        addListener: function (event, listener) {
            var listeners = this.getListeners(event);
            listeners.push(listener);
            return this;
        },
        on: function () {
            return this.addListener.apply(this, arguments);
        },

        emit: function (event) {
            var listeners = this.getListeners(event),
                args = [].slice.call(arguments, 1);
            if (typeof listeners !== 'undefined') {
                for (var i = 0, len = listeners.length; i < len; i++) {
                    listeners[i].apply(this, args);
                }
            }
            return this;
        },

        removeListener: function (event, listener) {
            var listeners = this.getListeners(event);
            if (typeof listeners !== 'undefined') {
                for (var i = 0, len = listeners.length; i < len; i++) {
                    if (listeners[i] === listener) {
                        listeners.splice(i, 1);
                        break;
                    }
                }
            }
            return this;
        },
        off: function () {
            return this.removeListener.apply(this, arguments);
        },

        getListeners: function (event) {
            this.listeners = this.listeners || {};
            this.listeners[event] = this.listeners[event] || [];
            return this.listeners[event];
        }
    });
})(window.slide = (typeof slide === 'undefined') ? {} : slide);

/*jshint browser: true
*/
/*global slide:true, Class: true, gesture: true*/
(function (exports) {
    'use strict';

    var isTransformEnabled = exports.isTransformEnabled;
    var isSwipeEnabled = exports.isSwipeEnabled;
    var Container = exports.Container;
    var onResized = exports.onResized;
    var preventDefault = exports.preventDefault;

    var SLIDE_TRESHOLD = 0.1; // 10%
    
    var BasicSlide = exports.BasicSlide = slide.Observable.extend({
        init: function (frameEl, dataSource, option) {
            this.frameEl = frameEl;
            this.container = null;

            this.dataSource = dataSource;
            this.option = option || {};

            this.pageWidth = this.frameEl.clientWidth;

            this.initContainer();
            this.show();
            this.bindEvents();
        },
        /**
         * wrapper 내부에 들어갈 mark up 구조를 설정한다.
         */
        initContainer: function () {
            this.container = new Container(this, this.option);
            this.frameEl.innerHTML = '';
            this.frameEl.appendChild(this.container.el);
        },
        /**
         * slide 에 필요한 event를 bind 시킨다.
         */
        bindEvents: function () {
            var GESTURE_THRESHOLD = 0,
                self = this;

            var listener = this.listener = gesture.GestureListener(this.frameEl, GESTURE_THRESHOLD);
            listener.onGestureStart(function (session) {
                return self.startDrag(session);
            });
            listener.onGestureMove(function (session) {
                return self.drag(session);
            });
            listener.onGestureEnd(function (session) {
                return self.endDrag(session);
            });
            onResized(this.frameEl, function (width, height) {
                self.resize(width, height);
            });
        },
        /**
         * 데이터 소스로부터 데이터를 받아서 슬라이드에 보여준다.
         */
        show: function () {
            var container = this.container;
            this.dataSource.queryCurrent(function (current) {
                container.panel.setData(current);
            });
        },

        /**
         * 슬라이드를 좌로 이동시킨다. 다음(next) 슬라이드를 보여준다.
         * 만약, 다음 슬라이드에 내용이 없을 경우 이동 시키지 않는다.
         */
        next: function () {
            var self = this;
            this.dataSource.queryNext(function (next) {
                if (next === null) {
                    self.cancel();
                } else {
                    self.nextSlide();
                }
            });
        },
            nextSlide: function () {
                this.dataSource.next();
                this.show();
                this.emit("next");
            },
        /**
         * 슬라이드를 우로 이동시킨다. 이전(prev) 슬라이드를 보여준다.
         * 만약, 이전 슬라이드에 내용이 없을 경우 이동 시키지 않는다.
         */
        prev: function () {
            var self = this;
            this.dataSource.queryPrev(function (prev) {
                if (prev === null) {
                    self.cancel();
                } else {
                    self.prevSlide();
                }
            });
        },
            prevSlide: function () {
                this.dataSource.prev();
                this.show();
                this.emit("prev");
            },
        /**
         * slide를 원위치 시킨다.
         */
        cancel: function () {
            this.emit("cancel");
        },
        /**
         * mousedown or touchstart 이벤트 발생시 동작하는 함수
         * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
         */
        startDrag: function (session) {
            this.emit("startDrag", session);
        },
        drag: function () {

        },
        /**
         * mouseup or touchend 이벤트 발생시 동작하는 함수
         * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
         */
        endDrag: function (session) {
            if (session.isScroll()) {
                return;
            }
            
            if (session.delta.x === 0 && session.delta.y === 0) {
                this.emit("click");
                return;
            }
            this.emit("endDrag", session);
        },
        /**
         * 변경된 wrapper, slide, panels의 size 와 offset을 다시 설정한다.
         */
        resize: function (width, height) {
            this.setWrapperSize(width, height);
            this.emit("resize", width, height);
        },
            /**
             * 변경된 wrapper 사이즈를 확인/저장 한다.
             */
            setWrapperSize: function (width) {
                this.pageWidth = width;
            },
        destroy: function () {
            this.container.destroy();
            this.container = null;

            this.frameEl.innerHTML = '';
            this.frameEl = null;

            delete this.listeners;
            this.dataSource = null;
        }
    });
    var MiddleSlide = exports.MiddleSlide = BasicSlide.extend({
        /**
         * 데이터 소스로부터 데이터를 받아서 슬라이드에 보여준다.
         */
        show: function () {
            var container = this.container;
            this.dataSource.queryCurrentSet(function (set) {
                container.setData(set);
            });
        },
        /**
         * 슬라이드 좌로 이동시킨 후 panel들을 재정렬 + 그 다음 데이터를 미리 로딩해둔다.
         */
        nextSlide: function () {
            var self = this,
                movingOffset = -1 * this.pageWidth;

            this.slide(movingOffset, function onMoveNextEnd() {
                self.container.rearrangePanelsAfterNext();
                self.preloadNextData();
                self.emit("next");
            });
        },
            /**
             * 마지막 패널에 다음 데이터를 넣는다.
             */
            preloadNextData: function () {
                var container = this.container;
                this.dataSource.next();
                this.dataSource.queryNext(function (next) {
                    container.setNextData(next);
                });
            },
        /**
         * 슬라이드 우로 이동시킨 후 panel들을 재정렬 + 그 이전 데이터를 미리 로딩해둔다.
         */
        prevSlide: function () {
            var self = this,
                movingOffset = this.pageWidth;
            this.slide(movingOffset, function onMovePrevEnd() {
                self.container.rearrangePanelsAfterPrev();
                self.preloadPrevData();
                self.emit("prev");
            });
        },
            /**
             * 첫번째 패널에 이전 데이터를 넣는다.
             */
            preloadPrevData: function () {
                var container = this.container;
                this.dataSource.prev();
                this.dataSource.queryPrev(function (prev) {
                    container.setPrevData(prev);
                });
            },
        /**
         * 주어진 offset 만큼 slide를 좌우 이동 시킨다.
         * css transition animation을 통하여 '스르륵' 이동
         * @param offset {Number} 이동시킬 거리 값
         * @param callback {Function} transition animation 이 끝난 이후 호출되는 callback 함수
         */
        slide: function (offset, callback) {
            this.container.move(offset);
            if (callback) {
                callback();
            }
        },
        /**
         * slide를 원위치 시킨다.
         */
        cancel: function () {
            var self = this;
            this.slide(0, function onCancelEnd(){
                self.emit("cancel");
            });
        },
        /**
         * mousemove or touchmove 이벤트 발생시 동작하는 함수
         * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
         */
        drag: function (session) {
            if (session.isSwipe()) {
                preventDefault(session.targetEvent);
                this.container.move(session.delta.x / 2);
            }
        },
        /**
         * mouseup or touchend 이벤트 발생시 동작하는 함수
         * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
         */
        endDrag: function (session) {
            if (session.isScroll()) {
                return;
            }
            
            if (session.delta.x === 0 && session.delta.y === 0) {
                this.emit("click");
                return;
            }

            if (this.isNextSwipe(session)) {
                this.next();
            } else if (this.isPrevSwipe(session)) {
                this.prev();
            } else {
                this.cancel();
            }
            this.emit("endDrag", session);
        },
            /**
             * 제스처가 왼쪽으로 일정 거리이상 혹은 빠르게 움직였을 경우에 true
             * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
             */
            isNextSwipe: function (session) {
                return session.isLeft() && (this.isNextThreshold(session) || session.isFlick());
            },
            /**
             * 제스처가 왼쪽으로 일정 거리이상 움직였을 경우에 true
             * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
             */
            isNextThreshold: function (session) {
                return this.container.getWidth() * -1 * SLIDE_TRESHOLD > session.delta.x;
            },
            /**
             * 제스처가 오른쪽으로 일정 거리이상 혹은 빠르게 움직였을 경우에 true
             * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
             */
            isPrevSwipe: function (session) {
                return session.isRight() && (this.isPrevThreshold(session) || session.isFlick());
            },
            /**
             * 제스처가 오른쪽으로 일정 거리이상 움직였을 경우에 true
             * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
             */
            isPrevThreshold: function (session) {
                return this.container.getWidth() * SLIDE_TRESHOLD < session.delta.x;
            }
    });

    var AdvanceSlide = exports.AdvanceSlide = MiddleSlide.extend({
        init: function (frameEl, dataSource, option) {
            this._super(frameEl, dataSource, option);
            this.defaultDuration = this.option.duration || 300;
            this.isInTransition = false;
        },
        slide: function (offset, callback) {
            var container = this.container;
            this.enableTransition(this.duration);
            container.move(offset);
            
            var self = this;
            window.setTimeout(function slideEnd (){
                self.disableTransition();
                if (callback) {
                    callback();
                }
            }, this.duration + 30);
        },
        /**
         * Transition을 on한다.
         * @param duration {Integer} Transition Duration Value
         */
        enableTransition: function (duration) {
            this.container.setTransitionDuration(duration || this.defaultDuration);
            this.isInTransition = true;
        },
        /**
         * Transition을 off한다.
         */
        disableTransition: function () {
            this.container.setTransitionDuration(0);
            this.isInTransition = false;
        },
        startDrag: function (session) {
            if (this.isInTransition) {
                preventDefault(session.targetEvent);
                this.isDragging = false;
                return ;
            }
            this.isDragging = true;
            this._super(session);
        },
        drag: function (session) {
            if (this.isInTransition || !this.isDragging) {
                preventDefault(session.targetEvent);
                return ;
            }

            this._super(session);
        },
        endDrag: function (session) {
            if (this.isInTransition || !this.isDragging) {
                return ;
            }

            this._super(session);
        },
        cancel: function () {
            if (this.isInTransition) {
                return;
            }

            this._super();
        },
        next: function (duration) {
            if (this.isInTransition) {
                return;
            }
            this.duration = duration || this.defaultDuration;
            this._super();
        },
        prev: function (duration) {
            if (this.isInTransition) {
                return;
            }
            this.duration = duration || this.defaultDuration;
            this._super();
        }
    });

    exports.Slide = isTransformEnabled ? AdvanceSlide : isSwipeEnabled ? MiddleSlide : BasicSlide;
})(window.slide = (typeof slide === 'undefined') ? {} : slide);
