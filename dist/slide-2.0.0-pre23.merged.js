/*
       _  _     _          
      | |(_)   | |         
   ___| | _  __| | ____    
  / __| || |/ _  |/ __ \   
  \__ \ || | (_| |  ___/   
  |___/_||_|\____|\____/   

  Version   : 2.0.0-pre23
  Copyright : 2014-12-18
  Author    : HTML5 Cell, daumkakao corp

*/
/**
 * @module slide
 * @main
 */
/**
 * @class slide
 * @static
 */
(function (exports) {
    'use strict';

    var util = exports.util = {};
    // event & extend library
    try {
        var eventUtil = window.DOMEvent;
        /**
         * dom event 등록 함수
         *
         * @method on
         * @param el {HTMLElement} 이벤트가 발생하는 엘리먼트
         * @param eventName {String} 이벤트 이름
         * @param callback {Function} 이벤트 발생시 동작할 콜백 함수
         */
        util.on = eventUtil.on;
        /**
         * dom event 제거 함수
         *
         * @method off
         * @param el {HTMLElement} 이벤트가 발생하는 엘리먼트
         * @param eventName {String} 이벤트 이름
         * @param callback {Function} 이벤트 발생시 동작 하지 않게 제거할 콜백 함수
         */
        util.off = eventUtil.off;
        /**
         * 해당 event에 의한 browser 의 기본 동작을 막는 함수.
         *
         * @method preventDefault
         * @param e {Event} dom event object
         */
        util.preventDefault = eventUtil.preventDefault;
        /**
         * 해당 event에 의한 browser 버블링 현상을 막는 함수.
         *
         * @method stopPropagation
         * @param e {Event} dom event object
         */
        util.stopPropagation = eventUtil.stopPropagation;

        util.toNumber = function(n, defaultN) {
            var _n = parseInt(n, 10);
            return isNaN(_n) ? defaultN :_n;
        };
        util.isObject = function(o) {
            return o !== exports.EMPTY && typeof o === 'object';
        };
        util.isFunction = function(f) {
            return typeof f === 'function';
        };
        util.isString = function(s) {
            return typeof s === 'string';
        };
        util.isNumber = function(n) {
            return typeof n === 'number';
        };
        util.isDOMElement = function(e) {
            return util.isObject(e) && (e.nodeType === 1 || e.nodeType === 11);
        };
        //util.isArray = function(o) {
        //    return Object.prototype.toString.call(o) === '[object Array]';
        //};

        util.setDelegates = function(scope, delegate) {
            if(!util.isObject(delegate)) {
                return;
            }

            for(var name in delegate) {
                if(delegate.hasOwnProperty(name) &&
                    util.isFunction(scope[name]) &&
                    util.isFunction(delegate[name])) {
                    scope[name] = delegate[name].bind(scope);
                }
            }
        };

        util.promise = function promise(fn) {
            var _value, _isResovled = false;
            var _handlers  = [];
            var _self = {
                resolve: function _resolve(value) {
                    if(value && typeof value.then === 'function') {
                        value.then(_doFulfill);

                    } else {
                        _doFulfill(value);
                    }

                    return _self;
                },
                then: function _then(callback) {
                    return promise(function _nextPromise(fulfill) {
                        _handlers.push(function _insertPromiseHandlers() {
                            fulfill(callback(_value));
                        });

                        if(_isResovled) {
                            _doFulfill(_value);
                        }
                    });
                }
            };

            function _doFulfill(value) {
                var _launchHandler = function _launchHandler(handler) {
                    handler(value);
                };

                _isResovled = true;
                _value = value;
                _handlers.forEach(_launchHandler);
                _handlers = [];
            }

            if(!!fn && typeof fn === 'function') {
                fn(_self.resolve);
            }

            return _self;
        };

    } catch(e) {
        throw new Error('Not found : DOMEvent');
    }

    // class & observable library
    /**
     * 상속기능을 제공하는 Class library
     *
     * @class Class
     * @static
     */
    /**
     * 상속 기능을 갖는 클래스를 생성한다.
     *
     * @method extend
     * @param object {Object} 클래스로 생성할 객체
     * @return {Class} 상속을 받아 새롭게 생성된 Class 객체
     */
    exports.Class = window.Class;
    /**
     * custom event emitter Class.
     *
     * @class Observable
     * @extends Class
     * @static
     */
    /**
     * Add custom event.
     *
     * @method on
     * @chainable
     * @param eventName {String} 등록할 커스텀 이벤트
     * @param callback {Function} 등록한 이벤트 발생시 호출될 콜백 함수
     */
    /**
     * Remove custom event.
     *
     * @method off
     * @chainable
     * @param eventName {String} 제거할 커스텀 이벤트
     * @param callback {Function} 제거할 콜백 함수
     */
    /**
     * Emit custom event.
     *
     * @method emit
     * @chainable
     * @param eventName {String} 호출할 커스텀 이벤트
     * @param [args]* {mixed} 호출될 콜백 함수에게 넘겨줄 인자 값
     */
    exports.Observer = window.Observer;
    if (!exports.Class || !exports.Observer) {
        new Error('Not found : Class & Observable');
    }

    /**
     * ua_parser library parsing result
     *
     * @property ua
     * @type Object
     * @for slide
     */
    exports.ua = window.ua_result;
    if (!exports.ua) {
        new Error('Not found : ua_parser');
    }

    /**
     * gesture library
     *
     * @class gesture
     * @static
     */
    /**
     * @method GestureListener
     * @param frameEl {HTMLElement} gesture 를 감지할 영역에 해당하는 엘리먼트
     * @param threshold {Number} gesture 를 감지를 시작하기 위한 최소값
     * @return {GestureListenerObj}
     */
    exports.gesture = window.gesture;
    if (!exports.gesture) {
        new Error('Not found : gesture');
    }

    var _prefix = ['', '-webkit-'];
    var _style = (document.body || document.documentElement).style;
    function getPrefixStyle(exp) {
        var _filterPrefix = function _filterPrefix(prefix) {
            return (prefix + exp) in _style;
        };
        return _prefix.filter(_filterPrefix)[0] + exp;
    }

    // slide mode for animation
    exports.MODE_SIMPLE = 1;
    exports.MODE_INTERVAL = 2;
    exports.MODE_TRANSFORM = 3;

    // style preset
    exports.TRANSFORM = getPrefixStyle('transform');
    exports.TRANSFORM_STYLE = getPrefixStyle('transform-style');
    exports.PERSPECTIVE = getPrefixStyle('perspective');
    exports.BACKFACE_VISIBILITY = getPrefixStyle('backface-visibility');
    exports.TRANSITION_DURATION = getPrefixStyle('transition-duration');

    // slide status
    exports.EMPTY = null;

    exports.DIVIDED = 1;
    exports.FIXED = 2;

    exports.LEFT = 1;
    exports.RIGHT = 2;
    exports.CENTER = 3;

    exports.CANCEL = 'cancel';
    exports.NEXT = 'next';
    exports.PREV = 'prev';

    /**
     * 3d gpu 가속 여부를 사용할수 있는지 판단한다.
     */
    var ua = exports.ua;
    var os = ua.os;
    var browser = ua.browser;
    var browserVersion = browser.version;
    var isTransformEnabled = (function _isTransformEnabled() {
        var isOverIcs = browser.android &&
            (parseInt(browserVersion.major, 10) > 3);
        var isModernBrowser = isOverIcs || os.ios ||
                browser.safari || browser.chrome ||
                (browser.msie && browserVersion.major >= 10);

        return !!exports.TRANSFORM && isModernBrowser;
    })();
    var isOldIE = (ua.platform === 'pc') &&
        browser.msie && (parseInt(browserVersion.major, 10) <= 9);

    exports.config = {
        mode: isTransformEnabled ?
            exports.MODE_TRANSFORM :
            (isOldIE ? exports.MODE_INTERVAL : exports.MODE_SIMPLE),
        isOldIE: isOldIE,
        isTransformEnabled: isTransformEnabled,
        isBindingVisibilityChange:
            !!(os.ios && parseInt(os.version.major, 10) > 6)
    };
})(window.slide = (typeof slide === 'undefined') ? {} : slide);

/*global Class: true, slide: true */
(function (exports) {
    "use strict";

    var util = exports.util;

    /**
     * slide 를 위한 데이터소스 delegate
     * 새로운 DataSource를 생성/초기화한다.
     *
     * @class DataSource
     * @constructor
     * @param data {Array}
     */
    exports.DataSource = Class.extend({
        /**
         * 새로운 DataSource를 생성/초기화한다.
         * @param data {Array}
         */
        init: function (data, option) {
            var _option = option || {};

            this.data = data || [];
            this.index = _option.index || 0;
            this._setDelegate(_option);
        },
        _setDelegate: function(option) {
            util.setDelegates(this, option.delegate);
        },

        /**
         * 현재 인덱스를 설정한다.
         *
         * @method setIndex
         * @param index {Number} 현재 인덱스로 세팅할 값
         */
        setIndex: function (index) {
            this.index = index;
        },
        getIndex: function () {
            return this.index;
        },
        setIndexByOffset: function(offset) {
            this.index = this.getIndexByOffset(offset);
        },
        getIndexByOffset: function(offset) {
            return this.index + offset;
        },
        /**
         * 이전 데이터를 불러온다.
         * 데이터가 없을 경우 해당 필드는 null 로 세팅된다.
         *
         * @method queryPrev
         * @async
         * @param callback {Function} 데이터를 모두 로드 된후 해당 데이터를 인자로 갖고 실행될 callback 함수
         */
        queryPrev: function () {
            var index = this.getIndexByOffset(-1);
            return this.queryData(index);
        },
        /**
         * 현재 데이터를 불러온다.
         *
         * @method queryCurrent
         * @async
         * @param callback {Function} 데이터를 모두 로드 된후 해당 데이터를 인자로 갖고 실행될 callback 함수
         */
        queryCurrent: function () {
            return this.queryData(this.index);
        },
        /**
         * 다음 데이터를 불러온다.
         * 데이터가 없을 경우 해당 필드는 null 로 세팅된다.
         *
         * @method queryNext
         * @async
         * @param callback {Function} 데이터를 모두 로드 된후 해당 데이터를 인자로 갖고 실행될 callback 함수
         */
        queryNext: function () {
            var index = this.getIndexByOffset(1);
            return this.queryData(index);
        },
        /**
         * 다음 데이터로 이동
         *
         * @method next
         */
        next: function (movedCount) {
            this.index = this.getIndexByOffset(movedCount || 1);
        },
        /**
         * 이전 데이터로 이동
         *
         * @method prev
         */
        prev: function (movedCount) {
            this.index = this.getIndexByOffset(-(movedCount || 1));
        },
        willQueryEndOfDataDelegate: function (callback) {
            callback(false);
        },
        willQueryFirstOfDataDelegate: function (callback) {
            callback(false);
        },
        /**
         * 기존의 데이터 뒤에 새로운 데이터를 추가한다.
         *
         * @method addNextData
         * @param addends {Array} 추가될 data Array
         */
        addNextData: function (addends) {
            this.data = this.data.concat(addends);
        },
        /**
         * 기존의 데이터 앞에 새로운 데이터를 추가한다.
         *
         * @method addPrevData
         * @param addends {Array} 추가될 data Array
         */
        addPrevData: function (addends) {
            this.setIndex(addends.length + this.index);
            this.data = addends.concat(this.data);
        },

        queryData: function(index) {
            var _returnFirstData = function _returnFirstData(datalist) {
                return datalist[0];
            };
            return this.queryDataList(index, 1).then(_returnFirstData);
        },
        queryDataList: function(index, n) {
            var self = this;
            var _resolveQuery = function _resolveQuery(hasExtraData) {
                return !!hasExtraData ?
                    self.queryDataList(index, n) :
                    self._resolveQueryDataList(index, n);
            };

            if ((index+n-1) > (this.data.length-1)) { // reaches end
                return this._callNextData().then(_resolveQuery);

            } else if (index < 0) { // reaches at first
                return this._callPrevData().then(_resolveQuery);

            } else {
                return _resolveQuery();
            }
        },
        _callNextData: function() {
            var promise = util.promise();
            this.willQueryEndOfDataDelegate(promise.resolve);

            return promise;
        },
        _callPrevData: function() {
            var promise = util.promise();
            this.willQueryFirstOfDataDelegate(promise.resolve);

            return promise;
        },
        _resolveQueryDataList: function(index, n) {
            var dataset = [];
            for(var i=0;i<n;i+=1) {
                dataset.push(this.data[index + i] || exports.EMPTY);
            }
            return util.promise().resolve(dataset);
        },
        /**
         * 해당 클래스의 인스턴스 삭제시 할당된 오브젝트들을 destroy 시킨다.
         *
         * @method destroy
         */
        destroy: function () {
            delete this.data;
        }
    });
})(window.slide = (typeof slide === 'undefined') ? {} : slide);


/*global Class: true, slide: true */
(function (exports) {
    "use strict";

    var util = exports.util;

    /**
     * slide 를 위한 데이터소스 delegate.
     * 무한 루프 형태의 DataSource 예시
     *
     * @class InfiniteDataSource
     * @extend DataSource
     * @constructor
     * @param data {Array}
     */
    exports.InfiniteDataSource = exports.DataSource.extend({
        convertRegularIndex: function(index) {
            var length = this.data.length;
            while(index < 0) {
                index += length;
            }
            return index % length;
        },
        getIndexByOffset: function(offset) {
            return this.convertRegularIndex(this.index + offset);
        },
        _resolveQueryDataList: function(index, n) {
            var dataset = [];
            for(var i=0;i<n;i+=1) {
                var _index = this.convertRegularIndex(index + i);
                var data = this.data[_index] || exports.EMPTY;
                dataset.push(data);
            }
            return util.promise().resolve(dataset);
        }
    });

})(window.slide = (typeof slide === 'undefined') ? {} : slide);


/* jshint browser: true */
/* global slide:true, Class: true, gesture: true */
(function (exports) {
    'use strict';

    var EMPTY = '&nbsp;';

    var util = exports.util;

    /**
     * @class Element
     * @constructor Panel
     * @extends Class
     * @param slide {Object} slide Class
     * @param option {Object} option values
     */
    exports.Element = Class.extend({
        init: function() {
            this.el = null;
        },
        destroy: function () {
            this.el = null;
        },
        setStyle: function (key, value) {
            this.el.style[key] = value;
        },
        setTransitionDuration: function (duration) {
            this.setStyle(exports.TRANSITION_DURATION, duration);
        },
        setTransform: function (transform) {
            this.setStyle(exports.TRANSFORM, transform);
        },
        setLeft: function (left) {
            this.setStyle('left', left);
        },
        draw: function(data) {
            var el = this.el;
            if(util.isDOMElement(data)) {
                el.innerHTML = '';
                el.appendChild(data);

            } else {
                el.innerHTML = util.isString(data) ? data : EMPTY;
            }
        },
        show: function() {
            this.setStyle('display', 'inline-block');
        },
        hide: function() {
            this.setStyle('display', 'none');
        }
    });
})(window.slide = (typeof slide === 'undefined') ? {} : slide);
/* jshint browser: true */
/* global slide:true, Class: true, gesture: true */
(function (exports) {
    'use strict';

    var util = exports.util;

    /**
     * 새로운 Panel을 생성/초기화 한다.
     *
     * @class Panel
     * @constructor Panel
     * @extends Class
     * @param slide {Object} slide Class
     * @param option {Object} option values
     */
    var Panel = exports.Panel = exports.Element.extend({
        init: function (slide, option) {
            this.slide = slide;
            this.el = this.createPanel(option || {});
        },
        /**
         * panel Element를 생성/초기화 한다.
         *
         * @method createPanel
         * @param width {Number}
         */
        createPanel: function (option) {
            var panel = document.createElement(option.tagName || "div");
            panel.className = option.className || "panel";
            panel.style.cssText = 'position:absolute;top:0;left:0;' +
                'width:100%;height:100%;overflow:hidden;display:inline-block;';
            return panel;
        },
        /**
         * panel Element에 data를 넣는다.
         *
         * @method setData        
         * @param data {HTMLElement}
         */
        render: function (data) {
            var content;
            if(util.isObject(data)) {
                content = util.isFunction(data.toHTML) ?
                    data.toHTML(this, this.slide) : data.content;
            }

            this.draw(content || data);
        },
        /**
         * 웹접근성을 위한 코드.
         * 스크린 리더에서 데이터를 읽을지 말지 결정한다.
         *
         * @method setAccessibility
         * @param flag {Boolean} true면 스트린리더에서 데이터를 읽지 않는다.
         */
        setAccessibility: function (flag) {
            this.el.setAttribute("aria-hidden", flag);
        },
        destroy: function () {
            this.el = null;
            this.slide = null;
        }
    });
})(window.slide = (typeof slide === 'undefined') ? {} : slide);
/*jshint browser: true
*/
/*global slide:true, Class, gesture, clay*/
(function (exports) {
    'use strict';

    var slideInstanceNum = 0;

    var util = exports.util;

    /**
     * #### 새로운 Container를 생성/초기화 한다.
     *
     * @class Container
     * @extends Class
     * @constructor Container
     * @param slide {Object} slide Class
     * @param option {Object} option values
     */
    var Container = exports.Container = exports.Element.extend({
        init: function (slide, option) {
            this.slide = slide;
            this.config = [];
            this.panels = [];

            var _option = option || {};
            this.option = _option.container || {};
            this.panelOption = _option.panel || {};
            this.panelClass = _option.panelClass || exports.Panel;

            this.createElement();
        },
        createElement: function () {
            var container = this.el = document.createElement("div");
            container.className = this.option.className || "slide";
            container.style.cssText = this.setContainerStyle();
            if (this.option.id) {
                container.id = this.option.id;

            } else {
                slideInstanceNum += 1;
                container.id = "slide-" + slideInstanceNum;
            }

            var frameEl = this.slide.frameEl;
            frameEl.innerHTML = '';
            frameEl.appendChild(container);
        },
        /**
         * 새로운 Container를 생성/초기화 한다.
         *
         * @method createContainer
         * @param width {String | Number} Slide Frame의 width 값
         * @return container {HTMLElement} container element
         */
        setContainerStyle: function () {
            return 'position:absolute;top:0;left:0;width:100%;height:100%;';
        },
        /**
         * 컨테이너에서 조절할 패널을 설정한다.
         *
         * @method setPanel
         * @param panelOption {Object} panel을 설정할때 필요한 panel 옵션 값
         */
        createPanels: function (config) {
            var self = this;
            var _initializePanel = function _initializePanel() {
                return self.initPanel();
            };

            this.panels = [];
            this.config = config;

            this.hide();
            this.draw('');
            this.panels = config.map(_initializePanel);
            this.setAccessibility();
            this.show();
        },
        /**
         * 하나의 패널을 생성/초기화 한다.
         *
         * @method initPanel
         * @param panelOption {Object} panel을 설정할때 필요한 panel 옵션 값
         * @return panel {PanelClass} 생성/초기화한 PanelClass Instance
         */
        initPanel: function () {
            var PanelClass = this.panelClass;
            var panel = new PanelClass(this.slide, this.panelOption);

            this.el.appendChild(panel.el);

            return panel;
        },
        /**
         * 웹접근성을 위한 코드.
         * 현재 패널만 스크린 리더에서 읽도록 한다.
         * 이전 패널과 이후 패널의 데이터를 스크린 리더에서 읽지 못하도록 막는다.
         *
         * @method setAriaHiddenPanels
         */
        setAccessibility: function () {
            var config = this.config;
            var _setPanelAccessibility = function _setPanelAccessibility(panel, i) {
                panel.setAccessibility(config[i].accessibility || false);
            };
            this.panels.forEach(_setPanelAccessibility);
        },
        updateAll: function (dataSet) {
            var _renderPanel = function _renderPanel(panel, i) {
                panel.render(dataSet[i]);
            };
            this.panels.forEach(_renderPanel);
        },

        getPanel: function(index) {
            return this.panels[index];
        },
        updatePanel: function(index, data) {
            this.getPanel(index).render(data);
        },
        arrangePanel: function(movedOffset) {
            var panels = this.panels;
            var panelCount = (movedOffset > 0) ?
                movedOffset : (panels.length + movedOffset);
            var backPanels = panels.splice(0, panelCount);
            this.panels = panels.concat(backPanels);

            this.setAccessibility();
        },
        setPanelStyle: function(name, style) {
            var _setPanelStyle = function _setPanelStyle(panel) {
                panel.setStyle(name, style);
            };
            this.panels.forEach(_setPanelStyle);
        },

        /**
         * 해당 클래스의 인스턴스 삭제시 할당된 오브젝트들을 destroy 시킨다.
         *
         * @method destroy
         */
        destroy: function () {
            var _destroyPanel = function _destroyPanel(panel) {
                panel.destroy();
            };

            this.panels.forEach(_destroyPanel);
            this.panels = [];

            this.el = null;
            this.slide = null;
        }
    });
})(window.slide = (typeof slide === 'undefined') ? {} : slide);

(function(exports) {
    'use strict';

    var util = exports.util;

    exports.BasicController = Class.extend({
        init: function(slide, option) {
            this.slide = slide;

            this.animator = new exports.Animator(slide, option);
            this.updater = new exports.Updater(slide, option);

            this._bindAnimateCallbacks();
        },
        _bindAnimateCallbacks: function() {
            this._onBeforeSlide = this.onBeforeSlide.bind(this);
            this._onAnimateSlide = this.onAnimateSlide.bind(this);
            this._onAnimateComplete = this.onAnimateComplete.bind(this);
            this._onAfterSlide = this.onAfterSlide.bind(this);
        },
        _getSparePanelsCount: function() {
            var slide = this.slide;
            var leastSparePanels = Math.ceil(slide.panelsToShow * slide.gestureRatio);
            return Math.max(leastSparePanels, slide.panelsToSlide);
        },
        _getPanelsLength: function(sparePanelCount) {
            var slide = this.slide;
            var panelsLength = slide.panelsToShow + (sparePanelCount * 2);
            var isUnbalanced = (slide.isCenterAligned && !(panelsLength%2));
            return panelsLength + (isUnbalanced ? 1 : 0);
        },
        createPanelsConfig: function() {
            var slide = this.slide;
            var sparePanelCount = this._getSparePanelsCount();
            var panelsLength = this._getPanelsLength(sparePanelCount);

            slide.basePanelIndex = slide.isCenterAligned ?
                Math.floor(panelsLength/2) : sparePanelCount;

            var panelsConfig = [];
            for(var i=0;i<panelsLength;i+=1) {
                panelsConfig.push({
                    accessibility: i<sparePanelCount || i>=(panelsLength-sparePanelCount)
                });
            }

            return panelsConfig;
        },
        createPanels: function() {
            var panelsConfig = this.createPanelsConfig();
            this.slide.container.createPanels(panelsConfig);
        },
        resizePanels: function() {
            var slide = this.slide;
            slide.container.setPanelStyle('width', slide.panelWidth + 'px');

            this.animator.setDefaultSlidePosition();
        },
        refresh: function() {
            this.resizePanels();
            this.updater.updateAll();
        },
        resetPanels: function() {
            this.createPanels();
            this.refresh();
        },
        resize: function(width, height) {
            if(this.slide.panelType === exports.FIXED) {
                this._resizeFixedPanels(width, height);

            } else {
                this._resizeDividedPanels(width, height);
            }
        },
        _resizeDividedPanels: function(width, height) {
            var slide = this.slide;
            slide.panelWidth = width/slide.panelsToShow;
            this.resizePanels();
        },
        _resizeFixedPanels: function(width, height) {
            var slide = this.slide;
            var panelsToShow = Math.ceil(width / slide.panelWidth);
            if(slide.panelsToShow !== panelsToShow) {
                this._adjustDataIndexToPanelsToShow(panelsToShow);

                slide.panelsToShow = panelsToShow;
                this.resetPanels();

            } else {
                this.resizePanels();
            }
        },
        _adjustDataIndexToPanelsToShow: function(panelsToShow) {
            var slide = this.slide;
            if(!slide.isAutoAligned) {
                return;
            }

            var datasource = slide.datasource;
            var index = datasource.getIndexByOffset(panelsToShow);
            if(index > datasource.data.length ) {
                datasource.setIndexByOffset(slide.panelsToShow - panelsToShow);
            }
        },

        getMovedCountByGesture: function(deltaX, deltaY) {
            if(!this.isOverThreshold(deltaX, deltaY)) {
                return 0;
            }

            return this.animator.getMovedCountByGesture(deltaX, deltaY);
        },
        getNextPanelStartOffset: function() {
            var slide = this.slide;
            return slide.isCenterAligned ? 1 : slide.panelsToShow;
        },
        getPrevPanelStartOffset: function(movedCount) {
            return -movedCount;
        },
        getChangedDataStartIndex: function(type, movedCount) {
            var changedPanelStartOffset = (type === exports.NEXT) ?
                this.getNextPanelStartOffset() : this.getPrevPanelStartOffset(movedCount);
            return this.slide.datasource.getIndexByOffset(changedPanelStartOffset);
        },
        _filterEmptyData: function (data) {
            return (data !== exports.EMPTY);
        },
        createAnimationStatus: function(type, datalist) {
            var isNext = (type === exports.NEXT);
            var movedCount = datalist.filter(this._filterEmptyData).length;

            return {
                type: (movedCount > 0) ? type : exports.CANCEL,
                movedOffset: movedCount * (isNext ? 1 : -1),
                isLastData: (movedCount === 0) && isNext
            };
        },
        queryAnimationStatus: function(type, movedCount) {
            var slide = this.slide;
            var _movedCount = util.isNumber(movedCount) ?
                movedCount : slide.panelsToSlide;

            if(type === exports.CANCEL || _movedCount === 0) {
                var cancel = this.createAnimationStatus(exports.CANCEL, []);
                return util.promise().resolve(cancel);
            }

            var self = this;
            var changedStartIndex = this.getChangedDataStartIndex(type, _movedCount);
            return slide.datasource.queryDataList(changedStartIndex, _movedCount)
                .then(function _getChangedData(datalist) {
                    return self.createAnimationStatus(type, datalist);
                });
        },

        moveSlide: function(deltaX, deltaY) {
            var animator = this.animator;
            var position = animator.getPositionByGesture(deltaX, deltaY);
            animator.moveSlidePosition(position);
        },
        animateSlide: function(type, movedCount) {
            this.queryAnimationStatus(type, movedCount)
                .then(this._onBeforeSlide)
                .then(this._onAnimateSlide)
                .then(this._onAnimateComplete)
                .then(this._onAfterSlide);
        },

        onStart: function() {
            this.resetPanels();
        },
        onBeforeSlide: function(status) {
            var slide = this.slide;

            slide.onBeforeSlide(status.type);
            if(slide.isAutoAligned) {
                var alignedType = status.isLastData ?
                    exports.RIGHT : exports.LEFT;
                this.animator.setAlignedType(alignedType);
            }

            return status;
        },
        onAnimateSlide: function(status) {
            var movedOffset = status.movedOffset;
            return this.animator.animateSlideByOffset(movedOffset)
                .then(function _animateSlideComplete() {
                    return status;
                });
        },
        onAnimateComplete: function(status) {
            var movedOffset = status.movedOffset;

            this.slide.container.arrangePanel(movedOffset);
            this.animator.arrangePanelPosition(movedOffset);
            return this.updater.updatePanelsByOffset(movedOffset)
                .then(function _updatePanelsComplete() {
                    return status;
                });
        },
        onAfterSlide: function(status) {
            this.slide.onAfterSlide(status.type);
        },

        isOverThreshold: function(deltaX, deltaY) {
            return this.slide.threshold < Math.abs(deltaX);
        },
        destroy: function() {
            this.animator.destroy();
            this.updater.destroy();

            this.slide = null;
        }
    });
}(window.slide = (typeof slide === 'undefined') ? {} : slide));

(function(exports) {
    exports.SimpleController = exports.BasicController.extend({
        _getSparePanelsCount: function() {
            return 0;
        }
    });
}(window.slide = (typeof slide === 'undefined') ? {} : slide));

(function(exports) {
    exports.BasicUpdater = Class.extend({
        init: function(slide, option) {
            this.slide = slide;
        },
        updateAll: function() {
            var slide = this.slide;
            var datasource = slide.datasource;
            var container = slide.container;
            var firstDataIndex = datasource.index - slide.basePanelIndex;

            return datasource.queryDataList(firstDataIndex, container.panels.length)
                .then(function _updateAll(datalist) {
                    container.updateAll(datalist);
                });
        },
        updatePanelsByOffset: function(movedOffset) {
            var self = this;
            var slide = this.slide;
            var datasource = slide.datasource;
            var firstPanelIndex = (movedOffset < 0) ?
                0 : (slide.container.panels.length - movedOffset);
            var firstPanelOffset = firstPanelIndex - slide.basePanelIndex;

            datasource.setIndexByOffset(movedOffset);

            var firstDataIndex = datasource.getIndexByOffset(firstPanelOffset);
            return datasource.queryDataList(firstDataIndex, Math.abs(movedOffset))
                .then(function _updatePanels(datalist) {
                    self.updatePanels(firstPanelIndex, datalist);
                });
        },
        updatePanels: function(startIndex, datalist) {
            var container = this.slide.container;
            var _updatePanel = function _updatePanel(data, index) {
                container.updatePanel(startIndex + index, data);
            };
            datalist.map(_updatePanel);
        },
        destroy: function() {
            this.slide = null;
        }
    });
}(window.slide = (typeof slide === 'undefined') ? {} : slide));
(function(exports) {
    'use strict';

    var DURATION = 200;

    var util = exports.util;

    exports.TransformAnimator = Class.extend({
        init: function(slide, option) {
            this.slide = slide;

            this.duration = util.toNumber(option.duration, DURATION);

            this.basePosition = {};
            this.prevPosition = {};
            this.aligned = 0;
            this.timeId = 0;
            this.slideTimeId = 0;

            this.bindTransitionEvent();
        },

        bindTransitionEvent: function () {
            var self = this;
            this._onTransitionEnd = function _onTransitionEnd() {
                self.timeId = window.setTimeout(function _forceComplete(){
                    self.animateComplete(self.slideTimeId);
                }, 50);
            };

            util.on(this.slide.container.el, 'webkitTransitionEnd',
                this._onTransitionEnd);
        },
        setTransitionDuration: function(duration) {
            this.slide.container.setTransitionDuration(duration + 'ms');
        },

        setDefaultSlidePosition: function() {
            var slide = this.slide;
            var panelsLength = slide.container.panels.length;
            var basePanelIndex = slide.basePanelIndex;
            var alignedType = slide.isCenterAligned ?
                exports.CENTER : exports.LEFT;

            this.basePosition = this.getPositionByGesture(0, 0);
            this.setAlignedType(alignedType);

            for(var i=0,len=panelsLength; i<len; i++) {
                this.movePanelByOffset(i, i-basePanelIndex);
            }

            var position = this.getPositionByGesture(0, 0);
            this.moveSlidePosition(position);
        },
        setAlignedType: function(type) {
            var slide = this.slide;
            if(type === exports.CENTER) {
                this.aligned =
                    (slide.frameWidth - slide.panelWidth)/2;

            } else if (type === exports.RIGHT) {
                this.aligned =
                    slide.frameWidth - (slide.panelWidth * slide.panelsToShow);

            } else {// Maybe LEFT
                this.aligned = 0;
            }
        },

        getPositionByOffset: function(movedOffset) {
            return {
                x: movedOffset * this.slide.panelWidth,
                y: 0
            };
        },
        getPositionByGesture: function(deltaX, deltaY) {
            var gestureRatio = this.slide.gestureRatio;
            return {
                x: deltaX * gestureRatio,
                y: 0
            };
        },
        getMovedCountByGesture: function(deltaX, deltaY) {
            var position = this.getPositionByGesture(deltaX, deltaY);
            return position.x ?
                Math.ceil(Math.abs(position.x)/this.slide.panelWidth) : 1;
        },

        arrangePanelPosition: function(movedOffset) {
            var slide = this.slide;
            var basePanelIndex = slide.basePanelIndex;
            var targetIndex = (movedOffset > 0) ?
                (slide.container.panels.length - movedOffset) : 0;

            this.updateBasePosition(movedOffset);
            for(var i=0,len=Math.abs(movedOffset);i<len;i+=1) {
                var index = targetIndex + i;
                this.movePanelByOffset(index, index - basePanelIndex);
            }
        },

        updateBasePosition: function(movedOffset) {
            var position = this.getPositionByOffset(movedOffset);
            this.basePosition.x -= position.x;
        },
        movePanelPosition: function (panelIndex, position) {
            var panel = this.slide.container.getPanel(panelIndex);
            var _x = position.x - this.basePosition.x;

            panel.setTransform('translate3d(' + _x + 'px, 0, 0)');
        },
        moveSlidePosition: function (position) {
            var _x = position.x + this.basePosition.x + this.aligned;
            if(this.prevPosition.x !== _x) {
                this.slide.container.setTransform('translate3d(' + _x + 'px, 0, 0)');
                this.prevPosition.x = _x;
            }
        },

        movePanelByOffset: function (panelIndex, offset) {
            var position = this.getPositionByOffset(offset);
            this.movePanelPosition(panelIndex, position);
        },
        animateSlideByOffset: function(movedOffset) {
            var position = this.getPositionByOffset(-movedOffset);
            return this.animateSlidePosition(position);
        },

        animateSlidePosition: function(position) {
            this.promise = util.promise();

            this.setTransitionDuration(this.duration);
            this.moveSlidePosition(position);

            var self = this;
            this.slideTimeId = window.setTimeout(function _transitionEnd (){
                self.animateComplete(self.timeId);
            }, this.duration + 30);

            return this.promise;
        },
        animateComplete: function(clearTimeId) {
            window.clearTimeout(clearTimeId);
            this.setTransitionDuration(0);

            this.promise.resolve();
        },
        destroy: function() {
            util.off(this.slide.container.el, 'webkitTransitionEnd',
                this._onTransitionEnd);

            this.slide = null;
        }
    });
}(window.slide = (typeof slide === 'undefined') ? {} : slide));
(function(exports) {
    'use strict';

    var util = exports.util;

    exports.SimpleAnimator = exports.TransformAnimator.extend({
        bindTransitionEvent: function () {

        },
        getPositionByGesture: function(deltaX, deltaY) {
            return {
                x: 0,
                y: 0
            };
        },

        movePanelPosition: function  (panelIndex, position) {
            var panel = this.slide.container.getPanel(panelIndex);
            var _x = position.x - this.basePosition.x;
            panel.setLeft(_x + 'px');
        },
        moveSlidePosition: function (position) {
            var _x = position.x + this.basePosition.x + this.aligned;
            if(this.prevPosition.x !== _x) {
                this.slide.container.setLeft(_x + 'px');
                this.prevPosition.x = _x;
            }
        },
        animateSlidePosition: function(position) {
            this.promise = util.promise();
            this.moveSlidePosition(position);
            this.animateComplete();

            return this.promise;
        },
        animateComplete: function() {
            this.promise.resolve();
        }
    });
}(window.slide = (typeof slide === 'undefined') ? {} : slide));
(function(exports) {
    'use strict';

    var SLIDE_RESIZE_DELAY_TIME = 200; //200ms

    var util = exports.util;

    exports.Screen = Class.extend({
        init: function(el) {
            this.el = el;

            this.width = el.clientWidth;
            this.height = el.clientHeight;

            this.bindEvents();
        },
        bindEvents: function () {
            this.bindResize();

            /**
             * ios webapp : 다른 탭에서 orientation 발생시 제대로
             * 사이즈 체크 안되는 버그가 존재.
             * 현재 탭으로 복귀시 발생하는 visivlityChange
             * 이벤트 발생(ios7 이상)시 강제로 리사이즈 체크.
             */
            if (exports.config.isBindingVisibilityChange) {
                this.bindVisibilityChange();
            }
        },
        bindResize: function() {
            this.resizeTimeId = null;
            this._onResizeEvent = this.onResizeEvent.bind(this);
            util.on(window, 'resize', this._onResizeEvent);
        },
        onResizeEvent: function () {
            window.clearTimeout(this.resizeTimeId);

            var self = this;
            this.resizeTimeId = window.setTimeout(function checkResized() {
                self.checkAndResizeSlideFrame();
            }, SLIDE_RESIZE_DELAY_TIME);
        },
        /**
         * slide 에 visibilitychange event를 bind 시킨다.
         *
         * @method onVisibilityChange
         */
        bindVisibilityChange: function () {
            var hidden, visibilityChange;
            if (typeof document.hidden !== 'undefined') {
                hidden = 'hidden';
                visibilityChange = 'visibilitychange';
            } else if (typeof document.webkitHidden !== 'undefined') {
                hidden = 'webkitHidden';
                visibilityChange = 'webkitvisibilitychange';
            }

            var self = this;
            util.on(document, visibilityChange, function handleVisibilityChange() {
                if (!document[hidden]) {
                    self.checkAndResizeSlideFrame();
                }
            });
        },
        /**
         * slide Frame 의 사이즈를 확인해서 변경시에는 리사이즈 시킨다.
         *
         * @method checkAndResizeSlideFrame
         */
        checkAndResizeSlideFrame: function () {
            var width = this.el.clientWidth;
            var height = this.el.clientHeight;
            if(this.isChangedSize(width, height)) {
                this.resize(width, height);
            }
        },
        /**
         * slide Frame 의 사이즈가 변경되었는지 확인한다.
         *
         * @method isChangedSize
         * @return {Boolean} 사이즈 변경시 true, 사이즈 미변경시 false.
         */
        isChangedSize: function (width, height) {
            return !(this.width === width && this.height === height);
        },
        /**
         * 변경된 wrapper, slide, panels의 size 와 offset을 다시 설정한다.
         *
         * @method resize
         * @param width {Number} frame element의 실제 width 크기
         * @param height {Number} frame element의 height 실제크기
         */
        resize: function (width, height) {
            var el = this.el;
            var pageWidth = width || el.clientWidth;
            var pageHeight = height || el.clientHeight;

            this.setWrapperSize(pageWidth, pageHeight);
            this.onResizeDelegate(pageWidth, pageHeight);

        },
        setWrapperSize: function (width, height) {
            this.width = width;
            this.height = height;
        },
        onResizeDelegate: function (width, height) {
        },
        onResize: function (delegate) {
            this.onResizeDelegate = delegate;
        },

        destroy: function() {
            util.off(window, 'resize', this._onResizeEvent);
            this.el = null;
        }
    });
}(window.slide = (typeof slide === 'undefined') ? {} : slide));
/*jshint browser: true
*/
/*global slide:true, Class: true, gesture: true*/
(function (exports) {
    'use strict';

    var SLIDE_THRESHOLD = 50;
    var GESTURE_RATIO = 0.5;
    var PANELS_TO_SLIDE = 1;
    var PANELS_TO_SHOW = 1;
    var PANEL_WIDTH = 300;
    var GESTURE_THRESHOLD = 10;

    var util = exports.util;

    exports.Slide = exports.Observer.extend({
        init: function (frameEl, dataSource, option) {
            this.frameEl = frameEl;
            this.datasource = dataSource;
            this.screen = new exports.Screen(frameEl);

            var _option = option || {};
            this._setOption(_option);
            this._createModules(_option);

            this._bindResizeEvent(_option);
            this._bindGestureEvent(_option);
            this._setDelegate(_option);

            this.onStart();
        },
        _setOption: function(option) {
            this.panelType = option.panelType || exports.DIVIDED;
            this.isCenterAligned = option.isCenterAligned || false;
            this.isAutoAligned = !this.isCenterAligned && (this.panelType === exports.FIXED);

            this.threshold = util.toNumber(option.threshold, SLIDE_THRESHOLD);
            this.gestureRatio = util.toNumber(option.gestureRatio, GESTURE_RATIO);
            this.panelsToSlide = util.toNumber(option.panelsToSlide, PANELS_TO_SLIDE);

            this.frameWidth = this.screen.width;
            this.frameHeight = this.screen.height;

            if(this.panelType === exports.DIVIDED) {
                var panelsToShow = util.toNumber(option.panelsToShow, PANELS_TO_SHOW);
                this._setDividedPanelWidth(panelsToShow);

            } else {
                var panelWidth = util.toNumber(option.panelWidth, PANEL_WIDTH);
                this._setFixedPanelWidth(panelWidth);
            }

            this.isInTransition = false;
            if (!option.disableOverflow) {
                this.setOverflowHidden();
            }
        },
        _setDividedPanelWidth: function(panelsToShow) {
            this.panelsToShow = panelsToShow;
            this.panelWidth = this.frameWidth/panelsToShow;
        },
        _setFixedPanelWidth: function(panelWidth) {
            this.panelsToShow = Math.ceil(this.frameWidth / panelWidth);
            this.panelWidth = panelWidth;
        },
        _createModules: function(option) {
            this.container = new exports.Container(this, option);
            this.controller = new exports.Controller(this, option);
        },

        _setDelegate: function(option) {
            var controller = this.controller;
            var scopes = [controller, controller.animator, controller.updater];
            var delegate = option.delegate;
            var _setDelegates = function _setDelegates(scope) {
                util.setDelegates(scope, delegate);
            };
            scopes.map(_setDelegates);
        },

        _bindResizeEvent: function (option) {
            this.screen.onResize(this.resize.bind(this));
        },
        _bindGestureEvent: function (option) {
            var threshold = util.toNumber(option.gestureThreshold, GESTURE_THRESHOLD);
            var listener = this.listener = new gesture.Listener(this.frameEl, {
                threshold: threshold
            });

            var self = this;
            listener.on('start', function _startListener(session) {
                self.emit('startDrag', session);
            });
            listener.on('end', function _endListener(session) {
                self.emit('endDrag', session);
            });
            listener.on('tab', function _tabListener(session) {
                self.emit('click', session);
            });

            listener.on('swipe', function _swipeListener(session) {
                self.onSwipe(session);
            });
            listener.on('left', function _leftListener(session) {
                self.onLeft(session);
            });
            listener.on('right', function _rightListener(session) {
                self.onRight(session);
            });
        },

        onStart: function() {
            this.controller.onStart();
        },
        onBeforeSlide: function (type) {
            this.isInTransition = true;
            this.listener.stop();
            this.emit(['slide:before', type + ':before'], type);
        },
        onAfterSlide: function (type) {
            this.isInTransition = false;
            this.listener.start();
            this.emit(['slide:after', type], type);
        },
        onSwipe: function(session) {
            util.preventDefault(session.targetEvent);

            var delta = session.delta;
            this.controller.moveSlide(delta.x, delta.y);
            this.emit('drag', session);
        },
        onLeft: function(session) {
            var delta = session.delta;
            var movedCount = this.controller.getMovedCountByGesture(delta.x, delta.y);
            this.controller.animateSlide(exports.NEXT, movedCount);
        },
        onRight: function(session) {
            var delta = session.delta;
            var movedCount = this.controller.getMovedCountByGesture(delta.x, delta.y);
            this.controller.animateSlide(exports.PREV, movedCount);
        },

        resize: function (width, height) {
            this.frameWidth = width;
            this.frameHeight = height;
            this.controller.resize(width, height);

            this.emit('resize', width, height);
        },
        next: function (movedCount) {
            this.controller.animateSlide(exports.NEXT, movedCount);
        },
        prev: function (movedCount) {
            this.controller.animateSlide(exports.PREV, movedCount);
        },
        cancel: function () {
            this.controller.animateSlide(exports.CANCEL);
        },
        refresh: function  () {
            this.controller.refresh();
        },

        getDataSource: function() {
            return this.datasource;
        },
        setDataSource: function(datasource) {
            this.datasource = datasource;
            this.refresh();
        },
        setOverflowHidden: function () {
            this.frameEl.style.overflow = 'hidden';
        },
        destroy: function () {
            this.listener.destroy();
            this.screen.destroy();
            this.controller.destroy();
            this.container.destroy();

            this.listener = null;
            this.screen = null;
            this.controller = null;
            this.container = null;
            this.datasource = null;

            this.frameEl.innerHTML = '';
            this.frameEl = null;

            this._super();
        }
    });
})(window.slide = (typeof slide === 'undefined') ? {} : slide);

(function(exports){
    'use strict';

    var config = exports.config;
    if (config.mode === exports.MODE_SIMPLE) {
        exports.Controller = exports.SimpleController;
        exports.Animator = exports.SimpleAnimator;

    } else {
        exports.Controller = exports.BasicController;
        exports.Animator = exports.TransformAnimator;
    }

    exports.Updater = exports.BasicUpdater;
} (window.slide = (typeof slide === 'undefined') ? {} : slide));