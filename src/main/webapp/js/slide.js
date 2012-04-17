/*jshint browser: true
*/
/*global slide:true, Class: true, gesture: true*/
(function (exports) {
    'use strict';

    // TODO introduce `container` class

    var SLIDE_TRESHOLD = 0.1; // 20%

    var slideInstanceNum = 0;

    var userAgent = exports.userAgent = function (ua) {
        ua = (ua || window.navigator.userAgent).toString();
        return {
            ua: ua,
            isAndroid: function () {
                return ua.match(/android/i);
            },
            isIOS: function () {
                return ua.match(/like mac os x./i);
            },
            isSafari: function () {
                return !ua.match(/mobile/i) && ua.match(/safari/i);
            },
            androidVersion: function() {
                var major = 1, minor = 0, versions,
                    matches = / android ([0-9\.]+);/i.exec(ua);
                if (matches && matches.length === 2) {
                    versions = matches[1].split('.');
                    major = parseInt(versions[0], 10);
                    minor = parseInt(versions[1], 10);
                }
                return {
                    major: major,
                    minor: minor
                };
            }()
        };
    };

    /**
     * 3d gpu 가속 여부를 사용할수 있는지 판단한다.
     * @param uaString {String}
     */
    var isTransformEnabled =  (function () {
        var ua = userAgent(),
            isOverGingerBread = ua.androidVersion.major > 2 ||
                (ua.androidVersion.major === 2 && ua.androidVersion.minor >= 3);
        return !!((ua.isAndroid() && isOverGingerBread) || ua.isIOS() || ua.isSafari());
    })();
    var hardwareAccelStyle = isTransformEnabled ? '-webkit-transform:translate3d(0,0,0);' : '';


    /**
     * resize, orientation change 이벤트가 발생하여도 coordniation 값이 바로 바뀌지 경우가 있어 (android)
     * 이를 보정하기 위하여 실제 coordination 값이 바뀌었을 때 resize 를 호출하여준다.
     * @param el
     * @param callback
     */
    function onResized(el, callback) {
        var resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize',
            width = el.clientWidth, height = el.clientHeight;

        function isSizeReallyChanged () {
            return !(width === el.clientWidth && height === el.clientHeight);
        }

        window.addEventListener(resizeEvent, function () {
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
    }

    var PANEL_PREV = 0, PANEL_CURRENT = 1, PANEL_NEXT = 2;
    var Panel = Class.extend({
        init: function (slide) {
            this.slide = slide;
            this.el = this.createPanel(slide.pageWidth);

            var self = this;
            this.slide.on('resize', function (width) {
                self.setWidth(width);
            });
        },
        createPanel: function (width) {
            var panel = document.createElement("div");

            panel.className = "panel";
            panel.style.cssText = 'height:100%;overflow:hidden;display:inline-block;' + 
                                    hardwareAccelStyle + 'width:' + width + 'px;';
            return panel;
        },
        setWidth: function (width) {
            this.el.style.width = width + 'px';
        },
        setData: function (data) {
            this.el.innerHTML = data ? data.toHTML() : '&nbsp;';
        }
    });

    var Container = Class.extend({
        init: function (slide) {
            slideInstanceNum+=1;
            this.slide = slide;

            this.el = this.createContainer(slide.pageWidth);

            this.panels = [];
            this.initPanels();
            this.bindEvents();
        },
        createContainer: function (width, enableTransform) {
            var container = document.createElement("div");

            container.className = "slide";
            container.id = "slide-" + slideInstanceNum;
            container.style.cssText = "overflow:hidden;position:relative;top:0;" + hardwareAccelStyle +
                                        "left:" + (-width) + "px;width:" + (width * 3) + "px;";
            return container;
        },
        initPanels: function () {
            this.initPanel(PANEL_PREV);
            this.initPanel(PANEL_CURRENT);
            this.initPanel(PANEL_NEXT);
        },
            initPanel: function (index) {
                var panel = new Panel(this.slide);
                this.panels[index] = panel;
                this.el.appendChild(panel.el);
            },

        bindEvents: function () {
            var GESTURE_THRESHOLD = 0,
                listener = gesture.GestureListener(this.el, GESTURE_THRESHOLD),
                self = this;

            listener.onGestureStart(function (session) {
                return self.slide.startDrag(session);
            });
            listener.onGestureMove(function (session) {
                return self.slide.drag(session);
            });
            listener.onGestureEnd(function (session) {
                return self.slide.endDrag(session);
            });

            this.slide.on('resize', function (width) {
                self.setSlideSizeAndOffset(width);
            });
        },
        setData: function (set) {
            var panels = this.panels;
            panels[PANEL_PREV].setData(set.prev);
            panels[PANEL_CURRENT].setData(set.current);
            panels[PANEL_NEXT].setData(set.next);
        },
        setNextData: function (next) {
            this.panels[PANEL_NEXT].setData(next);
        },
        setPrevData: function (prev) {
            this.panels[PANEL_PREV].setData(prev);
        },
        /**
         * next 이후 패널들을 재정렬한다.
         * 첫번째 패널을 마지막으로 옮긴다.
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
         * @param offset {Number} 이동시킬 거리 값
         */
        move: function (offset) {
            if (isTransformEnabled) {
                this.moveByTranslate3d(offset);
            } else {
                this.moveByLeft(offset);
            }
        },
        moveByTranslate3d: function (offset) {
            this.el.style.webkitTransform = 'translate3d(' + offset + 'px, 0, 0)';
        },
        moveByLeft: function (offset) {
            this.el.style.left = (offset - slide.pageWidth) + 'px';
        },
        setTransitionDuration: function (duration) {
            if (isTransformEnabled) {
                this.el.style.webkitTransitionDuration = duration + 'ms';
            }
        },
        /**
         * 변경된 slide size 와 offset 을 다시 설정한다.
         */
        setSlideSizeAndOffset: function (width) {
            this.el.style.width = (width * 3) + 'px';
            this.el.style.left = (-width) + 'px';
        },
        getWidth : function () {
            return this.el.clientWidth;
        },
        onTransitionEnd: function (callback) {
            this.el.addEventListener('webkitTransitionEnd', callback);
        },
        offTransitionEnd: function (callback) {
            this.el.removeEventListener('webkitTransitionEnd', callback);
        }
    });

    exports.Slide = slide.Observable.extend({
        /**
         * 새로운 Slide를 초기화 또는 생성한다.
         * @param frameEl {HTMLElement}
         * @param dataSource {Object} slide.DataSource 객체
         */
        init: function (frameEl, dataSource) {
            this.frameEl = frameEl;
            this.container = null;

            this.dataSource = dataSource;

            this.isInTransition = false;
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
            if (this.isInTransition) {
                return;
            }

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
            if (this.isInTransition) {
                return;
            }

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
            if (isTransformEnabled) {
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
            } else {
                this.container.move(offset);
                if (callback) {
                    callback();
                }
            }
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
         * slide를 원위치 시킨다.
         */
        cancel: function () {
            if (this.isInTransition) {
                return;
            }

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
            if (this.isInTransition) {
                return ;
            }

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

})(window.slide = (typeof slide === 'undefined') ? {} : slide);

