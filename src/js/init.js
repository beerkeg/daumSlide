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
    var isTransformEnabled = exports.isTransformEnabled =  (function () {
        var isOverGingerBread = (function () {
            if (ua.os.android) {
                return ua.os.version.major > 2 || (ua.os.version.major === 2 && ua.os.version.minor >= 3);
            }
            return false;
        })();
        return !!(isOverGingerBread || ua.os.ios || ua.browser.safari || ua.browser.chrome);
    })();
    exports.hardwareAccelStyle = isTransformEnabled ? '-webkit-transform:translate3d(0,0,0);' : '';

    var isSwipeEnabled = exports.isSwipeEnabled =  (function () {
        return (ua.os.android || ua.os.ios || ua.browser.safari || ua.browser.firefox || ua.browser.dolfin || ua.browser.opera ||
                (ua.platform === "pc" && ua.browser.ie && ua.browser.version.major >= 8)) && !ua.browser.polaris;
    })();


    /**
     * ics 4.0.3 이상 버젼 대응.
     */
    var isUsingClone = exports.isUsingClone =  (function () {
        var isOverIcs4_0_3 = ua.os.android &&
                (ua.os.version.major > 4 ||
                (ua.os.version.major === 4 && ua.os.version.minor > 0) ||
                (ua.os.version.major === 4 && ua.os.version.minor === 0 && ua.os.version.patch >= 3));
        return !!(isOverIcs4_0_3 || ua.isDolfin);
    })();

    exports.onResized = function (el, callback) {
        var resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize',
            width = el.clientWidth, height = el.clientHeight;

        function isSizeReallyChanged () {
            return !(width === el.clientWidth && height === el.clientHeight);
        }

        exports.on(window, resizeEvent, function () {
            var cnt = 0;
            setTimeout(function checkResize() {
                if (isSizeReallyChanged()) {
                    width = el.clientWidth;
                    height = el.clientHeight;
                    callback(width, height);
                } else {
                    if (cnt++ < 20) {
                        setTimeout(checkResize, 50);
                    }
                }
            }, 50);
        });
    };
})(window.slide = (typeof slide === 'undefined') ? {} : slide);
