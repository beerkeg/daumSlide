/*jshint browser: true
*/
/*global slide:true, Class: true, gesture: true*/
(function (exports) {
    'use strict';

    var isTransformEnabled = exports.isTransformEnabled;
    var isSwipeEnabled = exports.isSwipeEnabled;
    var Panel = exports.Panel;

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
            this.panels.push(panel);
        //    this.setNextData(next);

            this.el.appendChild(firstPanelEl);
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
            this.panels.unshift(panel);
        //    this.setPrevData(prev);

            this.el.insertBefore(lastPanelEl, firstPanelEl);
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
        },
        rearrangePanels: function (callback) {
            var cloneEl = this.el.cloneNode(true),
                parent = this.el.parentNode;
            parent.replaceChild(cloneEl, this.el);
            
            if (callback) {
                callback();
            }

            parent.replaceChild(this.el, cloneEl);
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
    
    exports.Container = isTransformEnabled ? AdvanceContainer : isSwipeEnabled ? MiddleContainer : BasicContainer;
})(window.slide = (typeof slide === 'undefined') ? {} : slide);