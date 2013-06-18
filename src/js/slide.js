/*jshint browser: true
*/
/*global slide:true, Class: true, gesture: true*/
(function (exports) {
    'use strict';

    var preventDefault = exports.preventDefault;

    var SLIDE_TRESHOLD = 0.1; // 10%
    var Observable = slide.Observable || window.Observable;
    var BasicSlide = exports.BasicSlide = Observable.extend({
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
            var Container = this.option.containerClass || exports.Container;
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
            exports.onResized(this.frameEl, function (width, height) {
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

            this.listener.destroy();
            delete this.listener;
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
                self.container.setAriaHiddenPanels();
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
                self.container.setAriaHiddenPanels();
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

            var self = this;
            this.container.onTransitionEnd(function transitionEnd () {
                self.timeId = window.setTimeout(function disable(){
                    self.onSlideComplete();
                }, 50);
            });
        },
        slide: function (offset, callback) {
            this.onSlideStart(offset);

            var self = this;
            this.callback = callback;
            window.setTimeout(function slideEnd (){
                self.onSlideComplete();
            }, this.duration + 30);
        },
        onSlideStart: function (offset) {
            var container = this.container;
            this.enableTransition(this.duration);
            container.move(offset);
        },
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
            window.clearTimeout(this.timeId);
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

    exports.Slide = exports.isTransformEnabled ? AdvanceSlide : exports.isSwipeEnabled ? MiddleSlide : BasicSlide;
})(window.slide = (typeof slide === 'undefined') ? {} : slide);
