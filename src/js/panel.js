/*jshint browser: true
*/
/*global slide:true, Class: true, gesture: true*/
(function (exports) {
    'use strict';

    var Panel = exports.Panel = Class.extend({
        /*!
         * 새로운 Panel을 생성/초기화 한다.
         * @param slide {Slide Class}
         */
        init: function (slide, option) {
            this.slide = slide;
            this.option = option || {};
            this.el = this.createPanel(slide.pageWidth);

            var self = this;
            this.slide.on('resize', function (width) {
                self.setWidth(width);
            });
        },
        /**
         * panel Element를 생성/초기화 한다.
         * @param width {Number}
         */
        createPanel: function (width) {
            var panel = document.createElement(this.option.tagName || "div");

            panel.className = this.option.className || "panel";
            panel.style.cssText = 'height:100%;overflow:hidden;display:inline-block;' +
                                    exports.hardwareAccelStyle + 'width:' + width + 'px;';
            return panel;
        },
        /**
         * panel Element의 넓이를 바꾼다.
         * @param width {Number}
         */
        setWidth: function (width) {
            this.el.style.width = width + 'px';
        },
        /**
         * panel Element에 data를 넣는다.
         * @param data {HTMLElement}
         */
        setData: function (data) {
            this.el.innerHTML = data ? data.toHTML() : '&nbsp;';
        },
        /**
         * 웹접근성을 위한 코드.
         * 스크린 리더에서 데이터를 읽을지 말지 결정한다.
         * @param flag {Boolean} true면 스트린리더에서 데이터를 읽지 않는다.
         */
        setAriaHidden: function (flag) {
            this.el.setAttribute("aria-hidden", flag);
        },
        destroy: function () {
            this.slide = null;
            this.el = null;
        }
    });
})(window.slide = (typeof slide === 'undefined') ? {} : slide);