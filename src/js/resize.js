/*jshint browser: true
*/
/*global slide:true*/

(function (exports) {
	'use strict';

	var ua = exports.ua;
    var os = ua.os;
    var osVersion = os.version;
    var browser = ua.browser;
    var browserVersion = browser.version;

	function isOverAndroidHoneycomb() {
        return !!(os.android && parseInt(osVersion.major, 10) > 3);
    }
    
    var availMatchMedia = (typeof window.matchMedia === "function" && isOverAndroidHoneycomb()) ? true : false,
        availOrientationChange = ("onorientationchange" in window && !os.android && ua.platform !== "pc") ? true : false;

    function fixbugOnMatchMedia() {
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
            fixbugOnMatchMedia();
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
}(window.slide = (typeof slide === 'undefined') ? {} : slide));