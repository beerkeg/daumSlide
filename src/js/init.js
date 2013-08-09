/*jshint browser: true
*/
/*global slide:true, Class, gesture, clay, util, daumtools*/
(function (exports) {
    'use strict';

    var event = window.clay ? clay.event : daumtools.event;
    exports.on = event.on;
    exports.preventDefault = event.preventDefault;
    exports.stopPropagation = event.stopPropagation;

    exports.Observable = window.Observable || window.daumtools.Observable;

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

    function isOverAndroidHoneycomb() {
        return !!(ua.os.android && parseInt(ua.os.version.major, 10) > 3);
    }
    function isAndroidIcs() {
        return !!(ua.os.android && ua.os.version.major === "4" && ua.os.version.minor === "0");
    }

    var availMatchMedia = (typeof window.matchMedia === "function" && isOverAndroidHoneycomb()) ? true : false,
        availOrientationChange = ("onorientationchange" in window && !ua.os.android && ua.platform !== "pc") ? true : false;

    function fixbugOnMediaMatch() {
        var style = document.createElement("style");
        style.innerHTML = "@media all and (orientation:portrait){.f{}}@media all and (orientation:landscape){.f{}}";
        document.getElementsByTagName("head")[0].appendChild(style);
    }

    exports.checkResize = function(el, callback) {
        setTimeout(function(){
            var width = el.clientWidth,
                height = el.clientHeight;
            if (width > 0 && height > 0) {
                callback(width, height);
            }
        }, 50);
    };
    exports.onResized = function () {
        if (availMatchMedia) {
            if (isAndroidIcs()) {
                fixbugOnMediaMatch();
            }
            var mql = window.matchMedia("(orientation: landscape)");

            return function (el, callback) {
                mql.addListener(function(){
                    exports.checkResize(el, callback);
                });
            };
        } else {
            var resizeEvent = availOrientationChange ? "orientationchange" : "resize";

            return function (el, callback) {
                window.gesture.EventUtil.listen(window, resizeEvent, function () {
                    exports.checkResize(el, callback);
                });
            };
        }
    }();

})(window.slide = (typeof slide === 'undefined') ? {} : slide);
