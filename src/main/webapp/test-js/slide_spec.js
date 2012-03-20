describe('slide.js', function () {
    "use strict";

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

    describe('slide.Slide', function () {
        it('should init with element', function () {
            var s = new slide.Slide(wrapper);
            expect(s).toBeDefined();
        });

        it('should create three slide panels', function () {
            new slide.Slide(wrapper);
            expect($j('.slide > .panel:eq(0)', wrapper).css('left')).toBe('0%');
            expect($j('.slide > .panel:eq(1)', wrapper).css('left')).toBe('100%');
            expect($j('.slide > .panel:eq(2)', wrapper).css('left')).toBe('-100%');
        });

    });

});