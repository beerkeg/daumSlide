/*jshint browser: true
*/
/*global slide:true*/

(function (exports) {
	'use strict';

	var ua = exports.ua;
    var os = ua.os;
    var availOrientationChange = ("onorientationchange" in window && !os.android && ua.platform !== "pc") ? true : false;

    exports.onResized = function () {
        var resizeEvent = availOrientationChange ? "orientationchange" : "resize";
        var width = 0, height = 0;

        return function (el, callback) {
            function isSizeReallyChanged () {
                return !(width === el.clientWidth && height === el.clientHeight);
            }

            window.gesture.EventUtil.listen(window, resizeEvent, function () {
                var cnt = 0;
                setTimeout(function _checkResize() {
                    if (isSizeReallyChanged()) {
                        width = el.clientWidth;
                        height = el.clientHeight;

                        if(width > 0 && height > 0) {
                            callback(width, height);
                        }
                    } else {
                        if (cnt++ < 20) {
                            setTimeout(_checkResize, 50);
                        }
                    }
                }, 50);
            });
        };
    }();
}(window.slide = (typeof slide === 'undefined') ? {} : slide));