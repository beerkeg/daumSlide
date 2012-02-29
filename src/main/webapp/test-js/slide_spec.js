describe('slide.js', function () {
    var WRAPPER_ID = 'wrapper_fixture',
        wrapper;

    beforeEach(function () {
        wrapper = document.createElement('div');
        wrapper.id = WRAPPER_ID;
        document.body.appendChild('wrapper');
    });

    afterEach(function () {
        document.body.removeChild(wrapper);
        wrapper = null;
    });

    describe('initialize', function () {
//        var slide = new Slide(document.getElementById(WRAPPER_ID), 0);
//        expect(slide).toBeDefined();
    });

});