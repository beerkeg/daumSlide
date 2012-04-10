/*jshint browser: true
*/
/*global slide:true, Class: true, gesture: true*/
(function (exports) {
    'use strict';

    // TODO rename 'el'
    // TODO panel DOM -> panel view
    // TODO external handler

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


    exports.Slide = slide.Observable.extend({
        init: function (wrapper, dataSource) {
            slideInstanceNum++;

            this.wrapper = wrapper;
            this.el = null;
            this.panels = [];

            this.dataSource = dataSource;

            this.enableTransform = false;
            this.isInTransition = false;

            this.pageWidth = this.wrapper.clientWidth;
            this.pageHeight = this.wrapper.clientHeight;

            this.enable3DTransform();
            this.initPanels();
            this.show();
            this.bindEvents();
        },

        enable3DTransform: function (uaString) {
            var ua = userAgent(uaString),
                isOverGingerBread = ua.androidVersion.major > 2 ||
                    (ua.androidVersion.major === 2 && ua.androidVersion.minor >= 3);
            this.enableTransform = ((ua.isAndroid() && isOverGingerBread) || ua.isIOS() || ua.isSafari());
            return this.enableTransform;
        },

        initPanels: function () {
            var panelString = this.buildPanelHTML();
            this.wrapper.innerHTML =
                '<div class="slide" id="slide-' + slideInstanceNum + '" style="overflow:hidden;position:relative;top:0;transform:translate3d(0,0,0);' +
                    'left:' + (-this.pageWidth) + 'px;width:' + (this.pageWidth * 3) + 'px;">' +
                    panelString + panelString + panelString + '</div>';
            this.el = document.getElementById("slide-" + slideInstanceNum);

            // TODO should avoid HTMLCollection!
            // this.panels = Array.prototype.slice.call(this.el.getElementsByClassName("panel"));
            this.panels = this.el.getElementsByClassName("panel");
        },
            buildPanelHTML: function () {
                var hardwareAccelStyle = this.enableTransform ? '-webkit-transform:translate3d(0,0,0);' : '';
                return '<div class="panel" style="height: 100%;overflow:hidden;display:inline-block;' + hardwareAccelStyle + 'width:' + this.pageWidth + 'px;"></div>';
            },

        bindEvents: function () {
            var resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize',
                GESTURE_THRESHOLD = 0,
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

            // TODO 1초 동안 x 번 확인해서 값이 정말 바뀌었을 때 resize 를 호출
            window.addEventListener(resizeEvent, function () {
                var cnt = 0;
                setTimeout(function checkResize() {
                    if (self.isSizeChanged()) {
                        self.resize();
                    } else {
                        if (cnt++ < 20) {
                            setTimeout(checkResize, 50);
                        }
                    }
                }, 50);
            });
        },
            isSizeChanged: function () {
                return !(this.pageWidth === this.wrapper.clientWidth && this.pageHeight === this.wrapper.clientHeight);
            },

        show: function () {
            var panels = this.panels;
            this.dataSource.queryCurrentSet(function (set) {
                panels[0].innerHTML = set.prev ? set.prev.toHTML() : '&nbsp;';
                panels[1].innerHTML = set.current ? set.current.toHTML() : '&nbsp;';
                panels[2].innerHTML = set.next ? set.next.toHTML() : '&nbsp;';
            });
        },

        // TODO refactoring extract class
        next: function () {
            var self = this;
            if (!this.isInTransition) {
                this.dataSource.queryNext(function (next) {
                    if (next === null) {
                        self.cancel();
                    } else {
                        self.isInTransition = true;

                        var movingOffset = -1 * self.pageWidth;
                        self.slide(movingOffset, function onMoveEnd() {
                            self.isInTransition = false;
                            var firstPanel = self.el.removeChild(self.panels[0]);
                            self.move(0);
                            self.el.appendChild(firstPanel);
                            // TODO 묶을 필요가 있어 보인다.
                            self.dataSource.next();
                            self.dataSource.queryNext(function (next) {
                                self.panels[2].innerHTML = next ? next.toHTML() : '&nbsp;';
                            });
                            self.emit("next");
                        });
                    }
                });

            }
        },
        prev: function () {
            var self = this;
            if (!this.isInTransition) {
                this.dataSource.queryPrev(function (prev) {
                    if (prev === null) {
                        self.cancel();
                    } else {
                        self.isInTransition = true;

                        var movingOffset = self.pageWidth;
                        self.slide(movingOffset, function onMoveEnd() {
                            self.isInTransition = false;
                            var lastPanel = self.el.removeChild(self.panels[2]);
                            self.move(0);
                            self.el.insertBefore(lastPanel, self.panels[0]);
                            // TODO 묶을 필요가 있어 보인다.
                            self.dataSource.prev();
                            self.dataSource.queryPrev(function (prev) {
                                self.panels[0].innerHTML = prev ? prev.toHTML() : '&nbsp;';
                            });
                            self.emit("prev");
                        });
                    }
                });
            }
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
                this.el.style.webkitTransform = 'translate3d('+ offset +'px, 0, 0)';
                var self = this;
                this.el.addEventListener('webkitTransitionEnd', function onTransitionEnd() {
                    self.el.removeEventListener('webkitTransitionEnd', onTransitionEnd);
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
            if (!this.isInTransition) {
                this.enableTransition();
                this.slide(0);
            }
        },

        startDrag: function (session) {
            this.emit("startDrag", session);
        },
        drag: function (session) {
            if (this.isInTransition) {
                return ;
            }

            if (session.isSwipe()) {
                session.targetEvent.preventDefault();
                this.move(session.delta.x / 2);
            }
        },
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
        },
            isNextSwipe: function (session) {
                return session.isLeft() && (this.isNextThreshold(session) || session.isFlick());
            },
            isNextThreshold: function (session) {
                return this.el.clientWidth * -1 * SLIDE_TRESHOLD > session.delta.x;
            },
            isPrevSwipe: function (session) {
                return session.isRight() && (this.isPrevThreshold(session) || session.isFlick());
            },
            isPrevThreshold: function (session) {
                return this.el.clientWidth * SLIDE_TRESHOLD < session.delta.x;
            },

        enableTransition: function (duration) {
            this.setTransitionDuration(duration || 500);
        },
        disableTransition: function () {
            this.setTransitionDuration(0);
        },
            setTransitionDuration: function (duration) {
                if (this.enableTransform) {
                    this.el.style.webkitTransitionDuration = duration + 'ms';
                }
            },

        resize: function () {
            this.setWrapperSize();
            this.setPanelsSize();
            this.setSlideSizeAndOffset();
            this.emit("resize");
        },
            setWrapperSize: function () {
                this.pageWidth = this.wrapper.clientWidth;
                this.pageHeight = this.wrapper.clientHeight;
            },
            setPanelsSize: function () {
                for (var i = 0; i < this.panels.length; i += 1) {
                    this.panels[i].style.width = this.pageWidth + 'px';
                }
            },
            setSlideSizeAndOffset: function () {
                this.el.style.width = (this.pageWidth * 3) + 'px';
                this.el.style.left = (-this.pageWidth) + 'px';
            }
    });

})(window.slide = (typeof slide === 'undefined') ? {} : slide);

