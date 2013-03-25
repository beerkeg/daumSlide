/*jshint browser: true
*/
/*global slide, Class, gesture, clay, util*/
(function (exports) {
    'use strict';

    exports.on = clay.event.on;
    exports.preventDefault = clay.event.preventDefault;
    exports.stopPropagation = clay.event.stopPropagation;
    /**
     * 3d gpu 가속 여부를 사용할수 있는지 판단한다.
     */
    var ua = window.ua_result || util.userAgent();
    var os = ua.os;
    var browser = ua.browser;
    var version = browser.version;

    var isTransformEnabled = exports.isTransformEnabled =  (function () {
        var isOverIcs = (function () {
            if (browser.android) {
                return version.major > 3;
            }
            return false;
        })();
        return !!(isOverIcs || os.ios || browser.safari || browser.chrome);
    })();
    exports.hardwareAccelStyle = isTransformEnabled ? '-webkit-transform:translate3d(0,0,0);' : '';

    var isSwipeEnabled = exports.isSwipeEnabled =  (function () {
        return (os.android || os.ios || browser.safari || browser.firefox || browser.dolfin || browser.opera ||
                (ua.platform === "pc" && browser.ie && version.major >= 8)) && !browser.polaris;
    })();


    /**
     * ics 4.0.3 이상 버젼 대응.
     */
    var isUsingClone = exports.isUsingClone =  (function () {
        var isOverIcs4_0_3 = browser.android &&
                (version.major > 4 ||
                (version.major === 4 && version.minor > 0) ||
                (version.major === 4 && version.minor === 0 && version.patch >= 3));
        return isOverIcs4_0_3;
    })();

    exports.onResized = function (el, callback) {
        exports.on(window, 'resize', function () {
            setTimeout(function checkResize() {
                var width = el.clientWidth,
                    height = el.clientHeight;
                callback(width, height);
            }, 50);
        });
    };
})(window.slide = (typeof slide === 'undefined') ? {} : slide);
