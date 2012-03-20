/*global describe: false, it: false, xit: false, expect: false,
  beforeEach: false, afterEach: false, jQuery: false, slide: false */
describe('slide.js', function () {
    "use strict";

    describe('slide.Slide', function () {
        var WRAPPER_ID = 'wrapper_fixture',
            wrapper,
            $j = jQuery;

        beforeEach(function () {
            wrapper = document.createElement('div');
            wrapper.id = WRAPPER_ID;
            document.body.appendChild(wrapper);
        });

        afterEach(function () {
            document.body.removeChild(wrapper);
            wrapper = null;
        });

        xit('should init with element', function () {
            var s = new slide.Slide(wrapper);
            expect(s).toBeDefined();
        });

        xit('should create three slide panels', function () {
            new slide.Slide(wrapper);
            expect($j('.slide > .panel:eq(0)', wrapper).css('left')).toBe('0%');
            expect($j('.slide > .panel:eq(1)', wrapper).css('left')).toBe('100%');
            expect($j('.slide > .panel:eq(2)', wrapper).css('left')).toBe('-100%');
        });
    });

    describe('slide.DataSource', function () {

    });

});