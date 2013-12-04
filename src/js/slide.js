/*jshint browser: true
*/
/*global slide:true, Class: true, gesture: true*/
(function (exports) {
    'use strict';

    var preventDefault = exports.preventDefault;
    var ua = exports.ua;
    var os = ua.os;
    var isDoingCheckSize = function () {
        return os.android === true;
    }();
    var isBindingVisibilityChange = function () {
        return os.ios === true && parseInt(os.version.major, 10) > 6;
    }();
    var availOrientationChange = ("onorientationchange" in window && ua.platform !== "pc") ? true : false;
    var resizeEvent = availOrientationChange ? 'orientationchange' : 'resize';

    var SLIDE_TRESHOLD = 0.1; // 10%

    /**
     * #### Frame 내에 새로운 슬라이드를 생성/초기화 한다.
     *
     * @class BasicSlide
     * @constructor BasicSlide
     * @extends Observable
     * @use BasicContainer
     * @use gesture
     * @param frameEl {HTMLElement} slide 가 생성될 frame element
     * @param dataSource {DataSource} slide에서 보여줄 데이터가 세팅 된 DataSource Class Instance
     * @param [option] {Object} option values
     *      @param [option.duration=300] {Number} 슬라이드 애니메이션 duration 값
     *      @param [option.panelClass=slide.Panel] {Panel} slide 내에서 생성될 panel 클래스
     *      @param [option.containerClass=slide.Container] {Container} slide 내에서 생성될 container 클래스
     *      @param [option.container] {Container} slide 내에서 생성될 container 클래스에서 사용될 options
     *          @param [option.container.className=slide] {String} container element 에 부여될 className
     *          @param [option.container.id] {String} container element 에 부여될 className
     *      @param [option.panel] {Panel} slide 내에서 생성될 container 클래스에서 사용될 options
     *          @param [option.panel.className=panel] {String} panel element 에 부여될 className
     *          @param [option.panel.tagName=div] {String} panel element 의 tagName
     */
    exports.basicSlideObj = {
        init: function (frameEl, dataSource, option) {
            this.frameEl = frameEl;
            this.container = null;

            this.dataSource = dataSource;
            this.option = option || {};

            this.pageWidth = this.frameEl.clientWidth;
            this.pageHeight = this.frameEl.clientHeight;

            this.initContainer();
            this.show();
            this.bindEvents();
        },
        /**
         * wrapper 내부에 들어갈 mark up 구조를 설정한다.
         *
         * @method initContainer
         */
        initContainer: function () {
            var Container = this.option.containerClass || exports.Container;
            this.container = new Container(this, this.option);
            this.frameEl.innerHTML = '';
            this.frameEl.appendChild(this.container.el);
        },
        /**
         * slide 에 필요한 event를 bind 시킨다.
         *
         * @method bindEvents
         */
        bindEvents: function () {
            this.bindGesture();
            this.onResized();

            /**
             * ios webapp : 다른 탭에서 orientation 발생시 제대로 사이즈 체크 안되는 버그가 존재.
             *              현재 탭으로 복귀시 발생하는 visivlityChange 이벤트 발생(ios7 이상)시 강제로 리사이즈 체크.
             */
            if (isBindingVisibilityChange) {
                this.onVisibilityChange();
            }
        },
        /**
         * slide 에 gesture event(mouse or touch event)를 bind 시킨다.
         *
         * @method bindGesture
         */
        bindGesture: function () {
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
        },
        /**
         * slide 에 resize event를 bind 시킨다.
         *
         * @method onResized
         */
        onResized: function () {
            var self = this;
            exports.on(window, resizeEvent, function () {
                self.checkAndResizeSlideFrame();
            });
        },
        /**
         * slide 에 visibilitychange event를 bind 시킨다.
         *
         * @method onVisibilityChange
         */
        onVisibilityChange: function () {
            var hidden, visibilityChange;
            if (typeof document.hidden !== "undefined") {
                hidden = "hidden";
                visibilityChange = "visibilitychange";
            } else if (typeof document.webkitHidden !== "undefined") {
                hidden = "webkitHidden";
                visibilityChange = "webkitvisibilitychange";
            }

            var self = this;
            exports.on(document, visibilityChange, function handleVisibilityChange() {
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
            var cnt = 0;
            var self = this;
            function checkResize() {
                var width = self.frameEl.clientWidth;
                var height = self.frameEl.clientHeight;
                if(self.isChangedSize(width, height)) {
                    self.resize(width, height);
                } else if(isDoingCheckSize && cnt < 10) {
                    cnt++;
                    window.setTimeout(checkResize, 100);
                }
            }

            checkResize();
        },
        /**
         * slide Frame 의 사이즈가 변경되었는지 확인한다.
         *
         * @method isChangedSize
         * @return {Boolean} 사이즈 변경시 true, 사이즈 미변경시 false.
         */
        isChangedSize: function (width, height) {
            return !(this.pageWidth === width && this.pageHeight === height);
        },
        /**
         * 데이터 소스로부터 데이터를 받아서 슬라이드에 보여준다.
         *
         * @method show
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
         *
         * @method next
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
        /**
         * 다음 슬라이드를 보여준다.
         *
         * @method nextSlide
         * @private
         */
        nextSlide: function () {
            this.emit("before:next");
            this.dataSource.next();
            this.show();
            this.emit("next");
        },
        /**
         * 슬라이드를 우로 이동시킨다. 이전(prev) 슬라이드를 보여준다.
         * 만약, 이전 슬라이드에 내용이 없을 경우 이동 시키지 않는다.
         *
         * @method prev
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
        /**
         * 이전 슬라이드를 보여준다.
         *
         * @method prevSlide
         * @private
         */
        prevSlide: function () {
            this.emit("before:prev");
            this.dataSource.prev();
            this.show();
            this.emit("prev");
        },
        /**
         * slide를 원위치 시킨다.
         *
         * @method cancel
         */
        cancel: function () {
            this.emit("cancel");
        },
        /**
         * mousedown or touchstart 이벤트 발생시 동작하는 함수
         *
         * @method startDrag
         * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
         */
        startDrag: function (session) {
            this.emit("startDrag", session);
        },
        /**
         * mousemove or touchmove 이벤트 발생시 동작하는 함수
         *
         * @method drag
         * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
         */
        drag: function (session) {

        },
        /**
         * mouseup or touchend 이벤트 발생시 동작하는 함수
         *
         * @method endDrag
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
         *
         * @method resize
         * @param width {Number} frame element의 실제 width 크기
         * @param height {Number} frame element의 height 실제크기
         */
        resize: function (width, height) {
            width = width || this.frameEl.clientWidth;
            height = height || this.frameEl.clientHeight;

            this.setWrapperSize(width, height);
            this.emit("resize", width, height);
        },
        /**
         * 변경된 wrapper 사이즈를 확인/저장 한다.
         *
         * @method setWrapperSize
         * @param width {Number} frame element의 실제 width 크기
         */
        setWrapperSize: function (width, height) {
            this.pageWidth = width;
            this.pageHeight = height;
        },
        /**
         * 해당 클래스의 인스턴스 삭제시 할당된 오브젝트들을 destroy 시킨다.
         *
         * @method destroy
         */
        destroy: function () {
            this.container.destroy();
            this.container = null;

            this.frameEl.innerHTML = '';
            this.frameEl = null;

            this.listener.destroy();
            delete this.listener;
            this.dataSource = null;
        },
        /**
         * 제스처가 왼쪽으로 일정 거리이상 혹은 빠르게 움직였을 경우에 true
         *
         * @method isNextSwipe
         * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
         */
        isNextSwipe: function (session) {
            return session.isLeft() && (this.isNextThreshold(session) || session.isFlick());
        },
        /**
         * 제스처가 왼쪽으로 일정 거리이상 움직였을 경우에 true
         *
         * @method isNextThreshold
         * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
         */
        isNextThreshold: function (session) {
            return this.container.getWidth() * -1 * SLIDE_TRESHOLD > session.delta.x;
        },
        /**
         * 제스처가 오른쪽으로 일정 거리이상 혹은 빠르게 움직였을 경우에 true
         *
         * @method isPrevSwipe
         * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
         */
        isPrevSwipe: function (session) {
            return session.isRight() && (this.isPrevThreshold(session) || session.isFlick());
        },
        /**
         * 제스처가 오른쪽으로 일정 거리이상 움직였을 경우에 true
         *
         * @method isPrevThreshold
         * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
         */
        isPrevThreshold: function (session) {
            return this.container.getWidth() * SLIDE_TRESHOLD < session.delta.x;
        }
    };
    /**
     * #### Frame 내에 새로운 슬라이드를 생성/초기화 한다.
     *
     * @class MiddleSlide
     * @extends BasicSlide
     * @constructor MiddleSlide
     * @use MiddleContainer
     * @param frameEl {HTMLElement} slide 가 생성될 frame element
     * @param dataSource {DataSource} slide에서 보여줄 데이터가 세팅 된 DataSource Class Instance
     * @param [option] {Object} option values
     *      @param [option.duration=300] {Number} 슬라이드 애니메이션 duration 값
     *      @param [option.panelClass=slide.Panel] {Panel} slide 내에서 생성될 panel 클래스
     *      @param [option.containerClass=slide.Container] {Container} slide 내에서 생성될 container 클래스
     *      @param [option.container] {Container} slide 내에서 생성될 container 클래스에서 사용될 options
     *          @param [option.container.className=slide] {String} container element 에 부여될 className
     *          @param [option.container.id] {String} container element 에 부여될 className
     *      @param [option.panel] {Panel} slide 내에서 생성될 container 클래스에서 사용될 options
     *          @param [option.panel.className=panel] {String} panel element 에 부여될 className
     *          @param [option.panel.tagName=div] {String} panel element 의 tagName
     */
    exports.middleSlideObj = {
        /**
         * 데이터 소스로부터 데이터를 받아서 슬라이드에 보여준다.
         *
         * @method show
         */
        show: function () {
            var container = this.container;
            this.dataSource.queryCurrentSet(function (set) {
                container.setData(set);
            });
        },
        /**
         * 슬라이드 좌로 이동시킨 후 panel들을 재정렬 + 그 다음 데이터를 미리 로딩해둔다.
         *
         * @method nextSlide
         */
        nextSlide: function () {
            var self = this,
                movingOffset = -1 * this.pageWidth;
            self.emit("before:next");
            this.slide(movingOffset, function onMoveNextEnd() {
                self.container.rearrangePanelsAfterNext();
                self.preloadNextData();
                self.container.setAriaHiddenPanels();
                self.emit("next");
            });
        },
        /**
         * 마지막 패널에 다음 데이터를 넣는다.
         *
         * @method preloadNextData
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
         *
         * @method prevSlide
         */
        prevSlide: function () {
            var self = this,
                movingOffset = this.pageWidth;
            self.emit("before:prev");
            this.slide(movingOffset, function onMovePrevEnd() {
                self.container.rearrangePanelsAfterPrev();
                self.preloadPrevData();
                self.container.setAriaHiddenPanels();
                self.emit("prev");
            });
        },
        /**
         * 첫번째 패널에 이전 데이터를 넣는다.
         *
         * @method preloadPrevData
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
         *
         * @method slide
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
         *
         * @method cancel
         */
        cancel: function () {
            var self = this;
            this.slide(0, function onCancelEnd(){
                self.emit("cancel");
            });
        },
        /**
         * mousemove or touchmove 이벤트 발생시 동작하는 함수
         *
         * @method drag
         * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
         */
        drag: function (session) {
            if (session.isSwipe()) {
                preventDefault(session.targetEvent);
                this.container.move(session.delta.x / 2);
                this.emit("drag", session);
            }
        },
        /**
         * mouseup or touchend 이벤트 발생시 동작하는 함수
         *
         * @method endDrag
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
        }
    };
    /**
     * #### Frame 내에 새로운 슬라이드를 생성/초기화 한다.
     *
     * @class AdvanceSlide
     * @extends MiddleSlide
     * @constructor AdvanceSlide
     * @use AdvanceContainer
     * @param frameEl {HTMLElement} slide 가 생성될 frame element
     * @param dataSource {DataSource} slide에서 보여줄 데이터가 세팅 된 DataSource Class Instance
     * @param [option] {Object} option values
     *      @param [option.duration=300] {Number} 슬라이드 애니메이션 duration 값
     *      @param [option.panelClass=slide.Panel] {Panel} slide 내에서 생성될 panel 클래스
     *      @param [option.containerClass=slide.Container] {Container} slide 내에서 생성될 container 클래스
     *      @param [option.container] {Container} slide 내에서 생성될 container 클래스에서 사용될 options
     *          @param [option.container.className=slide] {String} container element 에 부여될 className
     *          @param [option.container.id] {String} container element 에 부여될 className
     *      @param [option.panel] {Panel} slide 내에서 생성될 container 클래스에서 사용될 options
     *          @param [option.panel.className=panel] {String} panel element 에 부여될 className
     *          @param [option.panel.tagName=div] {String} panel element 의 tagName
     */
    exports.advanceSlideObj = {
        init: function (frameEl, dataSource, option) {
            this._super(frameEl, dataSource, option);
            this.defaultDuration = this.option.duration || 300;
            this.isInTransition = false;

            var self = this;
            this.container.onTransitionEnd(function transitionEnd () {
                self.timeId = window.setTimeout(function disable(){
                    self.onSlideComplete();
                }, 50);
            });
        },
        /**
         * 주어진 offset 만큼 slide를 좌우 이동 시킨다.
         * css transition animation을 통하여 '스르륵' 이동
         *
         * @method slide
         * @param offset {Number} 이동시킬 거리 값
         * @param callback {Function} transition animation 이 끝난 이후 호출되는 callback 함수
         */
        slide: function (offset, callback) {
            this.onSlideStart(offset);

            var self = this;
            this.callback = callback;
            window.setTimeout(function slideEnd (){
                self.onSlideComplete();
            }, this.duration + 30);
        },
        /**
         * 슬라이드가 이동 하기 전에 필요한 값을 세팅하고 container를 이동 시킨다.
         *
         * @method onSlideStart
         * @param offset {Number} 이동시킬 거리 값
         */
        onSlideStart: function (offset) {
            var container = this.container;
            this.enableTransition(this.duration);
            container.move(offset);
        },
        /**
         * 슬라이드가 이동을 마친 후에 필요한 값을 세팅하고 callback을 실행 시킨다.
         *
         * @method onSlideComplete
         */
        onSlideComplete: function () {
            this.disableTransition();
            if (this.callback) {
                var callback = this.callback;
                this.callback = null;
                callback();
            }
        },
        /**
         * Transition을 on한다.
         *
         * @method enableTransition
         * @param duration {Integer} Transition Duration Value
         */
        enableTransition: function (duration) {
            this.container.setTransitionDuration(duration || this.defaultDuration);
            this.isInTransition = true;
        },
        /**
         * Transition을 off한다.
         *
         * @method disableTransition
         */
        disableTransition: function () {
            window.clearTimeout(this.timeId);
            this.container.setTransitionDuration(0);
            this.isInTransition = false;
        },
        /**
         * mousedown or touchstart 이벤트 발생시 동작하는 함수
         *
         * @method startDrag
         * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
         */
        startDrag: function (session) {
            if (this.isInTransition) {
                preventDefault(session.targetEvent);
                this.isDragging = false;
                return ;
            }
            this.isDragging = true;
            this._super(session);
        },
        /**
         * mousemove or touchmove 이벤트 발생시 동작하는 함수
         *
         * @method drag
         * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
         */
        drag: function (session) {
            if (this.isInTransition || !this.isDragging) {
                preventDefault(session.targetEvent);
                return ;
            }

            this._super(session);
        },
        /**
         * mouseup or touchend 이벤트 발생시 동작하는 함수
         *
         * @method endDrag
         * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
         */
        endDrag: function (session) {
            if (this.isInTransition || !this.isDragging) {
                return ;
            }

            this._super(session);
        },
        /**
         * slide를 원위치 시킨다.
         *
         * @method cancel
         */
        cancel: function () {
            if (this.isInTransition) {
                return;
            }

            this._super();
        },
        /**
         * 슬라이드를 좌로 이동시킨다. 다음(next) 슬라이드를 보여준다.
         * 만약, 다음 슬라이드에 내용이 없을 경우 이동 시키지 않는다.
         *
         * @method next
         */
        next: function (duration) {
            if (this.isInTransition) {
                return;
            }
            this.duration = duration || this.defaultDuration;
            this._super();
        },
        /**
         * 슬라이드를 우로 이동시킨다. 이전(prev) 슬라이드를 보여준다.
         * 만약, 이전 슬라이드에 내용이 없을 경우 이동 시키지 않는다.
         *
         * @method prev
         */
        prev: function (duration) {
            if (this.isInTransition) {
                return;
            }
            this.duration = duration || this.defaultDuration;
            this._super();
        }
    };
})(window.slide = (typeof slide === 'undefined') ? {} : slide);
