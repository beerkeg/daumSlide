/*jshint browser: true
*/
/*global slide:true*/

(function (exports) {
	'use strict';

	var ua = exports.ua;
    var os = ua.os;
    var availOrientationChange = ("onorientationchange" in window && ua.platform !== "pc") ? true : false;

    exports.onResized = function () {
        var width = 0, height = 0;

        return function (el, callback) {
            function isChanged () {
                return !(width === el.clientWidth && height === el.clientHeight);
            }

            var isOrientationChange = false, isResize = false;
            function checkResize() {
                if ((isOrientationChange || !availOrientationChange) &&
                    isResize && isChanged()) {
                    width = el.clientWidth;
                    height = el.clientHeight;
                    callback(width, height);
                }
            }

            exports.on(window, 'orientationchange', function() {
                isOrientationChange = true;
                checkResize();
            });

            exports.on(window, 'resize', function() {
                isResize = true;
                checkResize();
                window.setTimeout(function() {
                    checkResize();
                    isOrientationChange = false;
                    isResize = false;
                }, 200);
            });
        };
    }();
}(window.slide = (typeof slide === 'undefined') ? {} : slide));