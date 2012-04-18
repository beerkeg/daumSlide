/*jshint browser: true
*/
/*global slide:true, Class: true, gesture: true*/
(function (exports) {
    'use strict';

    var isTransformEnabled = exports.isTransformEnabled;
    var Container = exports.Container;
    var onResized = exports.onResized;

    var SLIDE_TRESHOLD = 0.1; // 20%
    var Slide = slide.Observable.extend({
        init: function (frameEl, dataSource) {
            this.frameEl = frameEl;
            this.container = null;

            this.dataSource = dataSource;

            this.pageWidth = this.frameEl.clientWidth;

            this.initContainer();
            this.show();
            this.bindEvents();
        },
        /**
         * wrapper 내부에 들어갈 mark up 구조를 설정한다.
         */
        initContainer: function () {
            this.container = new Container(this);
            this.frameEl.innerHTML = '';
            this.frameEl.appendChild(this.container.el);
        },
        /**
         * slide 에 필요한 event를 bind 시킨다.
         */
        bindEvents: function () {
            var self = this;
            onResized(this.frameEl, function (width, height) {
                self.resize(width, height);
            });
        },
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
         * mousedown or touchstart 이벤트 발생시 동작하는 함수
         * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
         */
        startDrag: function (session) {
            this.emit("startDrag", session);
        },
        /**
         * mousemove or touchmove 이벤트 발생시 동작하는 함수
         * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
         */
        drag: function (session) {
            if (session.isSwipe()) {
                session.targetEvent.preventDefault();
                this.container.move(session.delta.x / 2);
            }
        },
        /**
         * mouseup or touchend 이벤트 발생시 동작하는 함수
         * @param session {Object} GestureSession 제스쳐 정보를 담은 객체
         */
        endDrag: function (session) {
            if (session.delta.x === 0) {
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
            }
    });

    var AdvanceSlide = Slide.extend({
        init: function (frameEl, dataSource) {
            this._super(frameEl, dataSource);
            this.isInTransition = false;
        },
        slide: function (offset, callback) {
            var container = this.container;
            this.enableTransition();
            container.move(offset);

            this.startTransitionEndTimer();

            var self = this;
            container.onTransitionEnd(function onTransitionEnd() {
                container.offTransitionEnd(onTransitionEnd);
                self.stopTransitionEndTimer();
                self.disableTransition();

                if (callback) {
                    callback();
                }
            });
        },
            /**
             * transitionEndTimer를 동작시킨다.
             * transition end event 가 정상적으로 발생되지 않는 경우를 위한 보조 수단
             */
            startTransitionEndTimer: function () {
                var self = this;
                window.clearTimeout(this.transitionEndTimer);
                this.transitionEndTimer = window.setTimeout(function () {
                    self.disableTransition();
                    self.transitionEndTimer = -1;
                }, 1500);
            },
            /**
             * transitionEndTimer를 멈춘다.
             */
            stopTransitionEndTimer: function () {
                window.clearTimeout(this.transitionEndTimer);
                this.transitionEndTimer = -1;
            },
        /**
         * Transition을 on한다.
         * @param duration {Integer} Transition Duration Value
         */
        enableTransition: function (duration) {
            this.container.setTransitionDuration(duration || 500);
            this.isInTransition = true;
        },
        /**
         * Transition을 off한다.
         */
        disableTransition: function () {
            this.container.setTransitionDuration(0);
            this.isInTransition = false;
        },
        drag: function (session) {
            if (this.isInTransition) {
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
        next: function () {
            if (this.isInTransition) {
                return;
            }

            this._super();
        },
        prev: function () {
            if (this.isInTransition) {
                return;
            }

            this._super();
        }
    });

    exports.Slide = isTransformEnabled ? AdvanceSlide : Slide;
})(window.slide = (typeof slide === 'undefined') ? {} : slide);
