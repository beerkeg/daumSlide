/*jshint browser: true
*/
/*global daumtools:true, slide:true, Class: true, gesture: true*/
(function (exports) {
    'use strict';

    var ua = exports.ua;
    var preventDefault = exports.preventDefault;
    var isPCSlideEnabled = exports.isPCSlideEnabled = (ua.platform === "pc");

    var pcSlideObj = {
        init: function (frameEl, dataSource, option) {
            this.frameEl = frameEl;
            this.container = null;

            this.dataSource = dataSource;
            this.option = option || {};

            this.pageWidth = this.frameEl.clientWidth;

            this.initContainer();
            this.show();
            this.bindEvents();

            this.defaultDuration = this.option.duration || 300;
            this.fx = new daumtools.Animaition(this.container.el, {
                duration: this.defaultDuration
            });
        },
        slide: function (offset, callback) {
            var self = this;
            var current = parseInt(self.container.el.style.left, 10);
            var end = offset - this.pageWidth;
            this.fx.setOptions({
                duration: this.duration || this.defaultDuration
            }).onStart(function (){
                self.isInTransition = true;
            }).onEnd(function slideEnd(){
                self.isInTransition = false;
                callback();
            }).start({left: [current, end]});
        }
    };


    // progressive Slide setting
    exports.Slide = (function () {
        var BasicSlide = exports.BasicSlide = exports.Observable.extend(exports.basicSlideObj);
        var MiddleSlide = exports.MiddleSlide = BasicSlide.extend(exports.middleSlideObj);
        
        var AdvanceSlide = exports.AdvanceSlide = MiddleSlide.extend(exports.advanceSlideObj);
        var PCSlide = exports.PCSlide = AdvanceSlide.extend(pcSlideObj);

        if (exports.isTransformEnabled) {
            return AdvanceSlide;
        } else if(exports.isSwipeEnabled) {
            return isPCSlideEnabled ? PCSlide : MiddleSlide;
        } else {
            return BasicSlide;
        }
    })();
})(window.slide = (typeof slide === 'undefined') ? {} : slide);