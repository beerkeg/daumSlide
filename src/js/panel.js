/* jshint browser: true */
/* global slide:true, Class: true, gesture: true */
(function (exports) {
    'use strict';

    /**
     * 새로운 Panel을 생성/초기화 한다.
     *
     * @class Panel
     * @constructor Panel
     * @extends Class
     * @param slide {Object} slide Class
     * @param option {Object} option values
     */
    var Panel = exports.Panel = Class.extend({
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
         *
         * @method createPanel
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
         *
         * @method setWidth 
         * @param width {Number}
         */
        setWidth: function (width) {
            this.el.style.width = width + 'px';
        },
        /**
         * panel Element에 data를 넣는다.
         *
         * @method setData        
         * @param data {HTMLElement}
         */
        setData: function (data) {
            this.el.innerHTML = data ? data.toHTML() : '&nbsp;';
        },
        /**
         * 웹접근성을 위한 코드.
         * 스크린 리더에서 데이터를 읽을지 말지 결정한다.
         *
         * @method setAriaHidden
         * @param flag {Boolean} true면 스트린리더에서 데이터를 읽지 않는다.
         */
        setAriaHidden: function (flag) {
            this.el.setAttribute("aria-hidden", flag);
        },
        /**
         * 해당 클래스의 인스턴스 삭제시 할당된 오브젝트들을 destroy 시킨다.
         *
         * @method destroy
         */
        destroy: function () {
            this.slide = null;
            this.el = null;
        }
    });
})(window.slide = (typeof slide === 'undefined') ? {} : slide);