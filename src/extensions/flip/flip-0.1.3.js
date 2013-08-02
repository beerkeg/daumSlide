(function (exports){

    clay.flip = {};
    var FlipPanel = clay.flip.FlipPanel = slide.Panel.extend({
        createPanel: function (width) {
            var isFront = this.option.isFront;
            var panel = document.createElement(this.option.tagName || "div");
            var transform  = this.transform = ['rotateY(', (isFront ? '0' : '180'), 'deg) translateZ(', (isFront ? '1' : '-1'), 'px)'];
            panel.className = this.option.className || "panel";
            panel.style.cssText = 'height:100%;overflow:hidden;display:inline-block;position:absolute;top:0;left:0;' +
                                    'width:' + width + 'px;' +
                                    '-webkit-backface-visibility:hidden;' +
                                    '-webkit-transform:' + transform.join('');
            return panel;
        },
        repaint: function () {
            var style = this.el.style;
            style.display = 'none';
            window.setTimeout(function () {
                style.display = '';
            }, 50);
        }
    });
    var PANEL_FRONT = 0,
        PANEL_BACK = 1;

    var FlipContainer = clay.flip.FlipContainer = slide.AdvanceContainer.extend({
        init: function (slide, option) {
            this.deg = 0;
            this._super(slide, option);
        },
        move: function (offset) {
            this.transform[3] = offset;
            this.el.style.webkitTransform = this.transform.join('');
        },
        setContainerStyle: function (width) {
            this.transform = ['translateZ(', 0, 'px) rotateY(', 0, 'deg)'];

            return "position:relative;width:" + width + "px;height:100%;" +
                "-webkit-transform-style:preserve-3d;" +
                "-webkit-transform:" + this.transform.join("");
        },
        initPanels: function (panelOption) {
            var panels = this.panels;
            panelOption.isFront = true;
            panels[PANEL_FRONT] = this.initPanel(panelOption);
            panelOption.isFront = false;
            panels[PANEL_BACK] = this.initPanel(panelOption);

            this.setAriaHiddenPanels();
        },
        setData: function (set) {
            this.panels[PANEL_FRONT].setData(set.current);
            this.panels[PANEL_BACK].setData(set.current);
        },
        setBackData: function (data) {
            this.panels[this.getNextState()].setData(data);
        },
        setNextData: function (next) {
            this.setBackData(next);
        },
        setPrevData: function (prev) {
            this.setBackData(prev);
        },
        getCurrentState: function () {
            if (this.deg%360 === 0) {
                return PANEL_FRONT;
            } else {
                return PANEL_BACK;
            }
        },
        getNextState: function () {
            if (this.deg%360 !== 0) {
                return PANEL_FRONT;
            } else {
                return PANEL_BACK;
            }
        },
        setAriaHiddenPanels: function () {
            this.panels[this.getCurrentState()].setAriaHidden(false);
            this.panels[this.getNextState()].setAriaHidden(true);
        },
        setSlideSize: function (width) {
            this.el.style.width = width + 'px';
        }
    });

    var FlipSlide = clay.flip.FlipSlide = slide.AdvanceSlide.extend({
        init: function (frameEl, dataSource, option) {
            this._super(frameEl, dataSource, option);
            this.frameEl.style.cssText = '-webkit-user-select:none;' +
                '-webkit-perspective:' + this.pageWidth * 2;
            this.offset = 0;
        },
        bindEvents: function () {
            if (ua_result.platform !== "pc") {
                this._super();
            } else {
                var self = this;
                slide.onResized(this.frameEl, function (width, height) {
                    self.resize(width, height);
                });
            }
        },
        show: function () {
            var container = this.container;
            this.dataSource.queryCurrentSet(function (set) {
                container.setData(set);
            });
        },
        onSlideStart: function (offset) {
            var container = this.container;
            this.enableTransition(this.duration);
            container.move(offset);
        },
        onSlideComplete: function () {
            this.container.deg = this.offset;
            this.disableTransition();
            if (this.callback) {
                var callback = this.callback;
                this.callback = null;
                callback();
            }
        },
        nextSlide: function () {
            this.offset -= 180;
            var self = this;
            self.preloadNextData();
            this.slide(this.offset, function onMoveNextEnd() {
                //self.preloadNextData();
                self.emit("next");
            });
        },
            preloadNextData: function () {
                var container = this.container,
                    self = this;
                this.dataSource.queryNext(function (next) {
                    container.setNextData(next);
                    self.dataSource.next();
                });
            },
        prevSlide: function () {
            this.offset += 180;
            var self = this;
            self.preloadPrevData();
            this.slide(this.offset, function onMovePrevEnd() {
                //self.preloadPrevData();
                self.emit("prev");
            });
        },
            preloadPrevData: function () {
                var container = this.container,
                    self = this;
                this.dataSource.queryPrev(function (prev) {
                    container.setPrevData(prev);
                    self.dataSource.prev();
                });
            },
        drag: function (session) {
            if (this.isInTransition || !this.isDragging) {
                clay.event.preventDefault(session.targetEvent);
                return;
            }

            if (session.isSwipe()) {
                var offset = session.delta.x / 2;
                if (offset > 60) {
                    offset = 60;
                } else if (offset < -60) {
                    offset = -60;
                }
                clay.event.preventDefault(session.targetEvent);
                this.container.move(this.offset + offset);
            }
        },
        cancel: function () {
            if (this.isInTransition) {
                return;
            }

            var self = this;
            this.slide(this.offset, function onCancelEnd(){
                self.emit("cancel");
            });
        }
    });

    exports.extension = exports.extension || {};
    exports.extension.Panel = FlipPanel;
    exports.extension.Container = FlipContainer;
    exports.extension.Slide = FlipSlide;
})(window.slide = typeof window.slide === "undefined" ? {} : window.slide);