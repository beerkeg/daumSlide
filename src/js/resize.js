/*jshint browser: true
*/
/*global slide:true*/

(function (exports) {
	'use strict';

	var ua = exports.ua;
    var os = ua.os;
    var availOrientationChange = ("onorientationchange" in window && ua.platform !== "pc") ? true : false;

    /**
     * android: orientation > resize
     * ios    : resize > orientation 순으로 이벤트가 발생된다.
     * ios의 경우, resize eventHandler가 많을 경우
     * orientation event가 지연(200ms 이상)되기 때문에,
     * orientation 이벤트로만 리사이즈를 체크한다.
     */
    exports.onResized = function () {
        var prevWidth = 0, prevHeight = 0;
        var resizeEvent = availOrientationChange ? 'orientationchange' : 'resize';

        return function (el, callback) {
            function isChanged (width, height) {
                return !(prevWidth === width && prevHeight === height);
            }

            exports.on(window, resizeEvent, function() {
                var cnt = 0;
                function checkResize() {
                    var width = el.clientWidth;
                    var height = el.clientHeight;

                    if(isChanged(width, height)) {
                        prevWidth = width;
                        prevHeight = height;
                        callback(width, height);

                    } else if(cnt < 10) {
                        cnt++;
                        setTimeout(checkResize, 100);
                    }
                }

                checkResize();
            });
        };
    }();
}(window.slide = (typeof slide === 'undefined') ? {} : slide));