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

        it('should disable 3d transform by default', function () {
            var enable3D = slide.Slide.prototype.enable3DTransform,
                mockSlide = {};
            enable3D.call(mockSlide, 'unknown UA');
            expect(mockSlide.enableTransform).toBeFalsy();
        });

        it('should enable 3d transform if over android gingerbread', function () {
            var enable3D = slide.Slide.prototype.enable3DTransform,
                ANDROID_2_3_1 = 'Mozilla/5.0 (Linux; U; Android 2.3.1; ko-kr; SHW-M250S Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
                mockSlide = {};
            enable3D.call(mockSlide, ANDROID_2_3_1);
            expect(mockSlide.enableTransform).toBeTruthy();
        });

        it('should disable 3d transform if under android gingerbread', function () {
            var enable3D = slide.Slide.prototype.enable3DTransform,
                ANDROID_2_2_1 = 'Mozilla/5.0 (Linux; U; Android 2.2.1; ko-kr; SHW-M250S Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
                mockSlide = {};
            enable3D.call(mockSlide, ANDROID_2_2_1);
            expect(mockSlide.enableTransform).toBeFalsy();
        });

        it('should enable 3d transform if it is non-android webkit', function () {
            var enable3D = slide.Slide.prototype.enable3DTransform,
                IPHONE_5_1 = 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B179 Safari/7534.48.3',
                mockSlide = {};
            enable3D.call(mockSlide, IPHONE_5_1);
            expect(mockSlide.enableTransform).toBeTruthy();
        });
    });

    describe('slide.UserAgentDetector', function () {
        var dummyUAString = 'i am user agent string',
            android_2_3_1 = 'Mozilla/5.0 (Linux; U; Android 2.3.1; ko-kr; SHW-M250S Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1';

        it('should receive first parameter as UA string', function () {
            var detector = slide.userAgent(dummyUAString);
            expect(detector.ua).toBe(dummyUAString);
        });

        it('should use navigator.userAgent if no argument provided', function () {
            var detector = slide.userAgent();
            expect(detector.ua).toBe(window.navigator.userAgent);
        });

        it('should detect Android', function () {
            var detector = slide.userAgent(android_2_3_1);
            expect(detector.isAndroid()).toBeTruthy();
        });

        it('should detect webkit', function () {
            var detector = slide.userAgent(android_2_3_1);
            expect(detector.isWebkit()).toBeTruthy();
        });

        it('should detect Android Versions', function () {
            var detector = slide.userAgent(android_2_3_1);
            expect(detector.androidVersion.major).toBe(2);
            expect(detector.androidVersion.minor).toBe(3);
        });
    });

    describe('slide.DataSource', function () {

    });

});