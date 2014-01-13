/*jshint browser: true
*/
/*global slide, Class, gesture, clay*/
(function (exports) {
    'use strict';

    var slideInstanceNum = 0;
    var PANEL_PREV = 0, PANEL_CURRENT = 1, PANEL_NEXT = 2;
    /**
     * #### 새로운 Container를 생성/초기화 한다.
     *
     * @class BasicContainer
     * @extends Class
     * @constructor BasicContainer
     * @param slide {Object} slide Class
     * @param option {Object} option values
     */
    exports.basicContainerObj = {
        init: function (slide, option) {
            this.slide = slide;
            this.option = option && option.container ? option.container : {};

            this.el = this.createContainer(slide.pageWidth);

            var panelOption = option && option.panel ? option.panel : {};
            this.panelClass = option.panelClass;
            this.setPanel(panelOption);
            this.bindEvents();
        },
        /**
         * 새로운 Container를 생성/초기화 한다.
         *
         * @method createContainer
         * @param width {String | Number} Slide Frame의 width 값
         * @return container {HTMLElement} container element
         */
        createContainer: function (width) {
            var container = document.createElement("div");

            container.className = this.option.className || "slide";
            if (this.option.id) {
                container.id = this.option.id;
            } else {
                slideInstanceNum += 1;
                container.id = "slide-" + slideInstanceNum;
            }
            container.style.cssText = this.setContainerStyle(width);
            return container;
        },
        /**
         * 새로운 Container를 생성/초기화 한다.
         *
         * @method createContainer
         * @param width {String | Number} Slide Frame의 width 값
         * @return container {HTMLElement} container element
         */
        setContainerStyle: function (width) {
            return "position:relative;top:0;left:0;" +
                    "width:" + width + "px;";
        },
        /**
         * 컨테이너에서 조절할 하나의 패널을 설정한다.
         *
         * @method setPanel
         * @param panelOption {Object} panel을 설정할때 필요한 panel 옵션 값
         */
        setPanel: function (panelOption) {
            this.panel = this.initPanel(panelOption);
        },
        /**
         * 하나의 패널을 생성/초기화 한다.
         *
         * @method initPanel
         * @param panelOption {Object} panel을 설정할때 필요한 panel 옵션 값
         * @return panel {PanelClass} 생성/초기화한 PanelClass Instance
         */
        initPanel: function (panelOption) {
            var PanelClass = this.panelClass || exports.Panel;
            var panel = new PanelClass(this.slide, panelOption);
            this.el.appendChild(panel.el);
            return panel;
        },
        /**
         * 이벤트를 설정한다.
         * 슬라이드의 frame 크기가 resize 될 경우에 대한 콜백함수 추가.
         *
         * @method bindEvents
         */
        bindEvents: function () {
            var self = this;
            this.slide.on('resize', function (width) {
                self.setSlideSize(width);
            });
        },
        /**
         * 슬라이드의 frame 크기가 resize 될 경우에 컨테이너의 사이즈를 frame 사이즈와 같게 변경해준다.
         *
         * @method setSlideSize
         * @param width {String | Number} frame width size
         */
        setSlideSize: function (width) {
            this.el.style.width = width + 'px';
        },
        /**
         * 현재 container의 width 사이즈를 얻어온다.
         *
         * @method getWidth
         * @return width {Number} container element width size
         */
        getWidth: function () {
            return this.el.clientWidth;
        },
        /**
         * 해당 클래스의 인스턴스 삭제시 할당된 오브젝트들을 destroy 시킨다.
         *
         * @method destroy
         */
        destroy: function () {
            this.slide = null;
            this.el = null;

            this.panel.destroy();
            this.panel = null;
        }
    };
    /**
     * #### 새로운 Container를 생성/초기화 한다.
     *
     * @class MiddleContainer
     * @extends BasicContainer
     * @constructor MiddleContainer
     * @param slide {Object} slide Class
     * @param option {Object} option values
     */
    exports.middleContainerObj = {
        setContainerStyle: function (width) {
            return "position:relative;top:0;" + exports.hardwareAccelStyle +
                    "left:" + (-width) + "px;width:" + (width * 3) + "px;";
        },
        setPanel: function (panelOption) {
            this.panels = [];
            this.initPanels(panelOption);
        },
        /**
         * slide내에 존재하는 패널들을 생성/초기화 한다.
         *
         * @method initPanels
         * @param panelOption {Object} panel들을 생성하는데 필요한 옵션 값
         */
        initPanels: function (panelOption) {
            var panels = this.panels;
            panels[PANEL_PREV] = this.initPanel(panelOption);
            panels[PANEL_CURRENT] = this.initPanel(panelOption);
            panels[PANEL_NEXT] = this.initPanel(panelOption);

            this.setAriaHiddenPanels();
        },
        /**
         * 웹접근성을 위한 코드.
         * 현재 패널만 스크린 리더에서 읽도록 한다.
         * 이전 패널과 이후 패널의 데이터를 스크린 리더에서 읽지 못하도록 막는다.
         *
         * @method setAriaHiddenPanels
         */
        setAriaHiddenPanels: function () {
            var panels = this.panels;
            panels[PANEL_PREV].setAriaHidden(true);
            panels[PANEL_CURRENT].setAriaHidden(false);
            panels[PANEL_NEXT].setAriaHidden(true);
        },
        /**
         * slide에 있는 패널들에 현재 인덱스 기준의 데이터 셋을 넣는다.
         *
         * @method setData
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
         *
         * @method setNextData
         * @param next {HTMLElement} 다음 데이터
         */
        setNextData: function (next) {
            this.panels[PANEL_NEXT].setData(next);
        },
        /**
         * 첫번째 패널에 prev 데이터를 넣는다.
         *
         * @method setPrevData
         * @param prev {HTMLElement} 이전 데이터
         */
        setPrevData: function (prev) {
            this.panels[PANEL_PREV].setData(prev);
        },
        /**
         * next 이후 패널들을 재정렬한다.
         * 첫번째 패널을 마지막으로 옮긴다.
         *
         * @method rearrangePanelsAfterNext
         */
        rearrangePanelsAfterNext: function () {
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
         *
         * @method rearrangePanelsAfterPrev
         */
        rearrangePanelsAfterPrev: function () {
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
         *
         * @method move
         * @param offset {Number} 이동시킬 거리 값
         */
        move: function (offset) {
            this.el.style.left = (offset - this.slide.pageWidth) + 'px';
        },
        /**
         * 변경된 slide size 와 offset 을 다시 설정한다.
         *
         * @method setSlideSize
         * @param width {String | Number}
         */
        setSlideSize: function (width) {
            this.el.style.width = (width * 3) + 'px';
            this.el.style.left = (-width) + 'px';
        },
        /**
         * 해당 클래스의 인스턴스 삭제시 할당된 오브젝트들을 destroy 시킨다.
         *
         * @method destroy
         */
        destroy: function () {
            this.slide = null;
            this.el = null;

            this.panels[0].destroy();
            this.panels[1].destroy();
            this.panels[2].destroy();
            delete this.panels;
        }
    };
    /**
     * #### 새로운 Container를 생성/초기화 한다.
     *
     * @class AdvanceContainer
     * @extends MiddleContainer
     * @constructor AdvanceContainer
     * @param slide {Object} slide Class
     * @param option {Object} option values
     */
    exports.advanceContainerObj = {
        /**
         * 주어진 offset 만큼 slide를 좌우 이동 시킨다.
         *
         * @method move
         * @param offset {Number} 이동시킬 거리 값
         */
        move: function (offset) {
            this.el.style.webkitTransform = 'translate3d(' + offset + 'px, 0, 0)';
        },
        /**
         * 해당 slide(컨테이너 Element) 의 transitionDuration을 설정한다.
         *
         * @method setTransitionDuration
         * @param duration {Number}
         */
        setTransitionDuration: function (duration) {
            this.el.style.webkitTransitionDuration = duration + 'ms';
        },
        /**
         * 해당 콜백을 onwebkitTransitionEnd 에 등록한다.
         *
         * @method onTransitionEnd
         * @param callback {function} TransitionEnd 이벤트 발생시 동작할 callback 함수 
         */
        onTransitionEnd: function (callback) {
            this.el.addEventListener('webkitTransitionEnd', callback);
        },
        /**
         * 해당 콜백을 onwebkitTransitionEnd 에서 제거한다.
         *
         * @method offTransitionEnd
         * @param callback {function} 제거할 callback function
         */
        offTransitionEnd: function (callback) {
            this.el.removeEventListener('webkitTransitionEnd', callback);
        }
    };
    /**
     * #### 새로운 Container를 생성/초기화 한다.
     * AdvanceContainer를 상속받아 기본적으로 비슷하게 동작하나,
     * 패널 재배열시 임시적으로 컨테이너의 클론을 보여주었다가
     * 패널이 재배열 된 후에 클론을 삭제하는 동작이 추가됨.
     *
     * @class CloneAdvanceContainer
     * @extends AdvanceContainer
     * @constructor CloneAdvanceContainer
     * @param slide {Object} slide Class
     * @param option {Object} option values
     */
    exports.cloneAdvanceContainerObj = {
        /**
         * panel을 재배치 하기 전에 해당 컨테이너의 클론을 만들어 보여주었다가 패널이 재배치 된 이후에 클론을 제거 한다.
         *
         * @method showTemporaryClone
         * @param callback {Function} 클론이 보여지는 동안 동작할 callback 함수
         */
        showTemporaryClone: function (callback) {
            var cloneEl = this.el.cloneNode(true),
                parent = this.el.parentNode;
            parent.replaceChild(cloneEl, this.el);

            if (callback) {
                callback();
            }

            parent.replaceChild(this.el, cloneEl);
            cloneEl = null;
        },
        /**
         * next 이후 패널들을 재정렬한다.
         * 첫번째 패널을 마지막으로 옮긴다.
         *
         * @method rearrangePanelsAfterNext
         */
        rearrangePanelsAfterNext: function () {
            var self = this;
            this.showTemporaryClone(function () {
                self._super();
            });
        },
        /**
         * prev 이후 패널들을 재정렬한다.
         * 마지막 패널을 첫번째로 옮긴다.
         *
         * @method rearrangePanelsAfterPrev
         */
        rearrangePanelsAfterPrev: function () {
            var self = this;
            this.showTemporaryClone(function () {
                self._super();
            });
        }
    };
})(window.slide = (typeof slide === 'undefined') ? {} : slide);
