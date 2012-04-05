/*global slide:true
 */
(function (exports) {
    "use strict";

    // panel 생성
    // 초기 데이터로 보여주기
    // next
    // TODO gpu accell off (no animation)

    // TODO data 끝에 왔을 때 slide cancel

    var slideInstanceNum = 0;

    function nullCallback() {
    }

    var Slide = exports.Slide = Class.extend({
        init: function (wrapper, dataSource) {
            slideInstanceNum++;

            this.wrapper = wrapper;
            this.el = null;
            this.panels = [];

            this.dataSource = dataSource;

            this.enableTransform = true;
            this.isInTransition = false;

            this.pageWidth = this.wrapper.clientWidth;

            this.initPanels();
            this.show();
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

        show: function () {
            var panels = this.panels;
            this.dataSource.queryCurrentSet(function (set) {
                panels[0].innerHTML = set.prev;
                panels[1].innerHTML = set.current;
                panels[2].innerHTML = set.next;
            });
        },

        next: function () {
            if (!this.isInTransition) {
//                this.loadedData = this.dataSource.getNextData();
//                if (this.loadedData.type === "invalid") {
//                    this.__cancel(duration);
//                } else {
                    this.enableTransition();
                    this.isInTransition = true;
//                    this.translate = false;

                    var movingOffset = -1 * this.pageWidth;
                    var self = this;
                    this.move(movingOffset, function onMoveEnd() {
                        self.isInTransition = false;
                        var firstPanel = self.el.removeChild(self.panels[0]);
                        self.setPosition(0);
                        self.el.appendChild(firstPanel);
                        // TODO 묶을 필요가 있어 보인다.
                        self.dataSource.next();
                        self.dataSource.queryNext(function (next) {
                            self.panels[2].innerHTML = next;
                        });
                    });

//                    if (!this.enableTransform) {
//                        this.__setData();
//                    }
//                }
            }
        },

        prev: function () {
            if (!this.isInTransition) {
//                this.loadedData = this.dataSource.getNextData();
//                if (this.loadedData.type === "invalid") {
//                    this.__cancel(duration);
//                } else {
            this.enableTransition();
            this.isInTransition = true;
//            this.translate = false;

            var movingOffset = this.pageWidth;
            var self = this;
            this.move(movingOffset, function () {
                self.isInTransition = false;
                var lastPanel = self.el.removeChild(self.panels[2]);
                self.setPosition(0);
                self.el.insertBefore(lastPanel, self.panels[0]);
                // TODO 묶을 필요가 있어 보인다.
                self.dataSource.prev();
                self.dataSource.queryPrev(function (next) {
                    self.panels[0].innerHTML = next;
                });
            });

//                    if (!this.enableTransform) {
//                        this.__setData();
//                    }
//                }
            }
        },

        move: function (offset, callback) {
            if (this.enableTransform) {
                this.el.style.webkitTransform = 'translate3d('+ offset +'px, 0, 0)';
                var self = this;
                this.el.addEventListener('webkitTransitionEnd', function onTransitionEnd() {
                    self.el.removeEventListener('webkitTransitionEnd', onTransitionEnd);
                    console.log('slide.move() : transition end');
                    callback();
                });
            } else {
                this.el.style.left = (offset - this.pageWidth) +'px';
                callback();
            }
        },
        setPosition: function (offset) {
            this.disableTransition();
            this.move(offset, nullCallback);
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
            }
    });

})(window.slide = (typeof slide === 'undefined') ? {} : slide);

