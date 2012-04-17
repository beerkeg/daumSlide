/*jshint browser: true
*/
/*global slide:true, Class: true, gesture: true*/
(function (exports) {
    'use strict';

    // TODO rename `el` to `slider`
    // TODO introduce `frame` class

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
        init: function (width, enableTransform) {
            this.el = this.createPanel(width, enableTransform);
        },
        createPanel: function (width, enableTransform) {
            var panel = document.createElement("div"),
                hardwareAccelStyle = enableTransform ? '-webkit-transform:translate3d(0,0,0);' : '';

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

    exports.Slide = slide.Observable.extend({
        /**
         * 새로운 Slide를 초기화 또는 생성한다.
         * @param frameEl {HTMLElement}
         * @param dataSource {Object} slide.DataSource 객체
         */
        init: function (frameEl, dataSource) {
            slideInstanceNum++;

            this.frameEl = frameEl;
            this.el = null;
            this.panels = [];

            this.dataSource = dataSource;

            this.enableTransform = false;
            this.isInTransition = false;

            this.pageWidth = this.frameEl.clientWidth;

            this.enable3DTransform();
            this.initSlider();
            this.initPanels();
            this.show();
            this.bindEvents();
        },
        /**
         * 3d gpu 가속 여부를 사용할수 있는지 판단한다.
         * @param uaString {String}
         */
        enable3DTransform: function (uaString) {
            var ua = userAgent(uaString),
                isOverGingerBread = ua.androidVersion.major > 2 ||
                    (ua.androidVersion.major === 2 && ua.androidVersion.minor >= 3);
            this.enableTransform = ((ua.isAndroid() && isOverGingerBread) || ua.isIOS() || ua.isSafari());
            return this.enableTransform;
        },
        /**
         * wrapper 내부에 들어갈 mark up 구조를 설정한다.
         */
        initSlider: function () {
            this.frameEl.innerHTML =
                '<div class="slide" id="slide-' + slideInstanceNum + '" style="overflow:hidden;position:relative;top:0;transform:translate3d(0,0,0);' +
                    'left:' + (-this.pageWidth) + 'px;width:' + (this.pageWidth * 3) + 'px;"></div>';
            this.el = document.getElementById("slide-" + slideInstanceNum);
        },
        initPanels: function () {
            this.initPanel(PANEL_PREV);
            this.initPanel(PANEL_CURRENT);
            this.initPanel(PANEL_NEXT);
        },
            initPanel: function (index) {
                this.panels.push(new Panel(this.pageWidth, this.enableTransform));
                this.el.appendChild(this.panels[index].el);
            },
        /**
         * slide 에 필요한 event를 bind 시킨다.
         */
        bindEvents: function () {
            var GESTURE_THRESHOLD = 0,
                listener = gesture.GestureListener(this.el, GESTURE_THRESHOLD),
                self = this;

            listener.onGestureStart(function (session) {
                return self.startDrag(session);
            });
            listener.onGestureMove(function (session) {
                return self.drag(session);
            });
            listener.onGestureEnd(function (session) {
                return self.endDrag(session);
            });

            onResized(this.frameEl, function () {
                self.resize();
            });
        },
        /**
         * 데이터 소스로부터 데이터를 받아서 슬라이드에 보여준다.
         */
        show: function () {
            var panels = this.panels;
            this.dataSource.queryCurrentSet(function (set) {
                panels[PANEL_PREV].setData(set.prev);
                panels[PANEL_CURRENT].setData(set.current);
                panels[PANEL_NEXT].setData(set.next);
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
                self.rearrangePanelsAfterNext();
                self.preloadNextData();
                self.emit("next");
            });
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
             * 마지막 패널에 다음 데이터를 넣는다.
             */
            preloadNextData: function () {
                var self = this;
                this.dataSource.next();
                this.dataSource.queryNext(function (next) {
                    self.panels[PANEL_NEXT].setData(next);
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
                self.rearrangePanelsAfterPrev();
                self.preloadPrevData();
                self.emit("prev");
            });
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
             * 첫번째 패널에 이전 데이터를 넣는다.
             */
            preloadPrevData: function () {
                var self = this;
                this.dataSource.prev();
                this.dataSource.queryPrev(function (prev) {
                    self.panels[PANEL_PREV].setData(prev);
                });
            },

        /**
         * 주어진 offset 만큼 slide를 좌우 이동 시킨다.
         * css transition animation을 통하여 '스르륵' 이동
         * @param offset {Number} 이동시킬 거리 값
         * @param callback {Function} transition animation 이 끝난 이후 호출되는 callback 함수
         */
        slide: function (offset, callback) {
            if (this.enableTransform) {
                this.enableTransition();
                this.el.style.webkitTransform = 'translate3d(' + offset + 'px, 0, 0)';

                this.startTransitionEndTimer();

                var self = this;
                this.el.addEventListener('webkitTransitionEnd', function onTransitionEnd() {
                    self.el.removeEventListener('webkitTransitionEnd', onTransitionEnd);
                    self.stopTransitionEndTimer();
                    self.disableTransition();

                    if (callback) {
                        callback();
                    }
                });
            } else {
                this.el.style.left = (offset - this.pageWidth) +'px';
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
         * 주어진 offset 만큼 slide를 좌우 이동 시킨다.
         * css transition animation 없이 단순 이동
         * @param offset {Number} 이동시킬 거리 값
         */
        move: function (offset) {
            if (this.enableTransform) {
                this.el.style.webkitTransform = 'translate3d(' + offset + 'px, 0, 0)';
            } else {
                this.el.style.left = (offset - this.pageWidth) + 'px';
            }
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
                this.move(session.delta.x / 2);
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
                return this.el.clientWidth * -1 * SLIDE_TRESHOLD > session.delta.x;
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
                return this.el.clientWidth * SLIDE_TRESHOLD < session.delta.x;
            },
        /**
         * Transition을 on한다.
         * @param duration {Integer} Transition Duration Value
         */
        enableTransition: function (duration) {
            this.setTransitionDuration(duration || 500);
            this.isInTransition = true;
        },
        /**
         * Transition을 off한다.
         */
        disableTransition: function () {
            this.setTransitionDuration(0);
            this.isInTransition = false;
        },
            /**
             * Transition 시 걸릴 시간을 설정한다.
             * @param duration {Integer} Transition Duration Value
             */
            setTransitionDuration: function (duration) {
                if (this.enableTransform) {
                    this.el.style.webkitTransitionDuration = duration + 'ms';
                }
            },
        /**
         * 변경된 wrapper, slide, panels의 size 와 offset을 다시 설정한다.
         */
        resize: function () {
            this.setWrapperSize();
            this.setPanelsSize();
            this.setSlideSizeAndOffset();
            this.emit("resize");
        },
            /**
             * 변경된 wrapper 사이즈를 확인/저장 한다.
             */
            setWrapperSize: function () {
                this.pageWidth = this.frameEl.clientWidth;
            },
            /**
             * 변경된 panel들의 사이즈를 다시 설정한다.
             */
            setPanelsSize: function () {
                for (var i = 0, len = this.panels.length; i < len; i += 1) {
                    this.panels[i].setWidth(this.pageWidth);
                }
            },
            /**
             * 변경된 slide size 와 offset 을 다시 설정한다.
             */
            setSlideSizeAndOffset: function () {
                this.el.style.width = (this.pageWidth * 3) + 'px';
                this.el.style.left = (-this.pageWidth) + 'px';
            }
    });

})(window.slide = (typeof slide === 'undefined') ? {} : slide);

