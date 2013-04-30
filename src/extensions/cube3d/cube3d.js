/*jshint browser: true
 */
/*global slide, Class, gesture*/
(function(exports) {
    'use strict';

    var Panel3D = exports.Panel.extend({
        createPanel: function (width) {
            var option = this.option;
            /* width/2 + 0.1 for ios(non click issue) */
            var transform = ['rotateY(', option.angle, 'deg) translateZ(', width/2 + 0.1, 'px)'];
            var panel = document.createElement(option.tagName || "div");
            panel.className = option.className || "panel";
            panel.style.cssText = 'position:absolute;width:100%;height:100%;' +
                '-webkit-backface-visibility:hidden;' +
                '-webkit-transform:' + transform.join('');

            this.transform = transform;

            return panel;
        },
        setWidth: function (width) {
            this.transform[3] = width/2 + 0.1;
            this.el.style.webkitTransform = this.transform.join('');
            this.repaint();
        },
        repaint: function () {
            var style = this.el.style;
            style.display = 'none';
            window.setTimeout(function () {
                style.display = '';
            }, 50);
        }
    });

    var AdvanceContainer3D = exports.AdvanceContainer.extend({
        initAngle: function () {
            this.CURRENT = 1;
            /* this.deg = 45 for chrome ver18(non click issue) */
            this.deg = 45;
            this.move(0);
        },
        repaint: function() {
            var panels = this.panels;
            for (var i = 0; i < panels.length; i++) {
                panels[i].repaint();
            }
        },
        move: function (offset) {
            this.transform[3] = this.deg + offset;
            this.el.style.webkitTransform = this.transform.join('');
        },
        setContainerStyle: function (width) {
            this.transform = ['translateZ(-', width/2, 'px) rotateY(', 0, 'deg)'];

            return "position:relative;width:" + width + "px;height:100%;" +
                "-webkit-transform-style:preserve-3d;" +
                "-webkit-transform:" + this.transform.join("");
        },
        initPanels: function (panelOption) {
            this.panels = [];

            /* 기본 축이 45도 틀어져 있으므로 var angle = [-90, 0, 90, 180] */
            var angle = [-135, -45, 45, 135];
            for (var i = 0; i < angle.length; i++) {
                panelOption.angle = angle[i];
                this.panels.push(this.initPanel(panelOption));
            }

            this.initAngle();
            this.setAriaHiddenPanels();
        },
        setSlideSize: function (width) {
            this.transform[1] = width/2;

            var containerStyle = this.el.style;
            containerStyle.width = width + 'px';
            containerStyle.webkitTransform = this.transform.join('');
        },
        rearrangePanelsAfterNext: function (next) {
            this.CURRENT = (this.CURRENT+1)%4;
            this.setAriaHiddenPanels();
        },
        rearrangePanelsAfterPrev: function (prev) {
            this.CURRENT = (this.CURRENT+3)%4;
            this.setAriaHiddenPanels();
        },
        setNextData: function (next) {
            var nextIndex = (this.CURRENT+1)%4;
            this.panels[nextIndex].setData(next);
        },
        setPrevData: function (prev) {
            var prevIndex = (this.CURRENT+3)%4;
            this.panels[prevIndex].setData(prev);
        },
        setAriaHiddenPanels: function () {
            var panels = this.panels;
            for (var i = 0, len = panels.length; i < len; i += 1) {
                if (this.CURRENT !== i) {
                    panels[i].setAriaHidden(true);
                } else {
                    panels[i].setAriaHidden(false);
                }
            }
        }
    });

    var AdvanceSlide3D = exports.AdvanceSlide.extend({
        init: function (frameEl, dataSource, option) {
            this._super(frameEl, dataSource, option);
            this.frameEl.style.cssText = '-webkit-user-select:none;' +
                '-webkit-perspective:' + this.pageWidth * 2;
        },
        onSlideStart: function (offset) {
            var container = this.container;
            this.enableTransition(this.duration);
            container.deg += offset;
            container.move(0);
        },
        resize: function (width, height) {
            this.frameEl.style.webkitPerspective = width * 2;
            this._super(width, height);
        },
        show: function () {
            var container = this.container;
            this.dataSource.queryCurrentSet(function (set) {
                container.initAngle();
                container.setData(set);
            });
        },
        nextSlide: function () {
            var self = this,
                movingOffset = -90;

            this.slide(movingOffset, function onMoveNextEnd() {
                self.container.rearrangePanelsAfterNext();
                self.preloadNextData();
                self.emit("next");
            });
        },
        prevSlide: function () {
            var self = this,
                movingOffset = 90;

            this.slide(movingOffset, function onMovePrevEnd() {
                self.container.rearrangePanelsAfterPrev();
                self.preloadPrevData();
                self.emit("prev");
            });
        }
    });

    function supportCSS3D(container) {
        var ret = false;

        // CSS 3D 지원여부 판단용 미디어 쿼리
        var styleEl = document.createElement('style');
        styleEl.innerHTML = '@media (transform-3d),(-webkit-transform-3d){#checkSupport3D{left:9px;position:absolute;height:5px;margin:0;padding:0;border:0}}';
        container.appendChild(styleEl);

        var el = document.createElement('div');
        el.id = 'checkSupport3D';
        container.appendChild(el);

        // check support CSS3D
        ret = ('webkitPerspective' in el.style) && (el.offsetLeft === 9 && el.offsetHeight === 5);

        // remove Test Element
        container.removeChild(el);
        container.removeChild(styleEl);

        return ret;
    }

    var isSupportCube3D = null;
    exports.Cube3D = function Cube3D(frameEl, ds, opt) {
        if(isSupportCube3D === null) {
            isSupportCube3D = supportCSS3D(frameEl);
        }

        var slideModule = exports.Slide;
        var option = opt || {};
        if(isSupportCube3D) {
            option.containerClass = AdvanceContainer3D;
            option.panelClass = Panel3D;
            slideModule = AdvanceSlide3D;
        }

        return new slideModule(frameEl, ds, option);
    };
})(window.slide = (typeof slide === 'undefined') ? {} : slide);