/*jshint browser: true
*/
/*global slide:true, log:true, alert:true*/

(function (exports) {
	'use strict';

	var ua = exports.ua;
    var os = ua.os;
    var availOrientationChange = ("onorientationchange" in window && ua.platform !== "pc") ? true : false;

    /**
     * android 4.1 이하: 기본 브라우져의 경우 orientation이벤트 발생시 사이즈 변경이 제때 이루어 지지 않아 변경될때까지 체크 로직 추가.
     */
    exports.onResized = function () {
        var resizeEvent = availOrientationChange ? 'orientationchange' : 'resize';

        return function (el, callback) {
            var prevWidth = el.clientWidth;
            var prevHeight = el.clientHeight;

            function isChanged (width, height) {
                return !(prevWidth === width && prevHeight === height);
            }

            function enterResize() {
                var cnt = 0;
                function checkResize() {
                    var width = el.clientWidth;
                    var height = el.clientHeight;
                    if(isChanged(width, height)) {
                        prevWidth = width;
                        prevHeight = height;
                        callback(width, height);
                    } else if(os.android === true && cnt < 10) {
                        cnt++;
                        window.setTimeout(checkResize, 100);
                    }
                }

                checkResize();
            }
            exports.on(window, resizeEvent, enterResize);
            
            /**
             * ios webapp : 다른 탭에서 orientation 발생시 제대로 사이즈 체크 안되는 버그가 존재.
             *              현재 탭으로 복귀시 발생하는 visivlityChange 이벤트 발생(ios7 이상)시 강제로 리사이즈 체크.
             */
            if (os.ios && parseInt(os.version.major, 10) > 6) {
                var hidden, visibilityChange;
                if (typeof document.hidden !== "undefined") {
                    hidden = "hidden";
                    visibilityChange = "visibilitychange";
                } else if (typeof document.webkitHidden !== "undefined") {
                    hidden = "webkitHidden";
                    visibilityChange = "webkitvisibilitychange";
                }
                exports.on(document, visibilityChange, function handleVisibilityChange() {
                    if (!document[hidden]) {
                        enterResize();
                    }
                });
            }
        };
    }();
}(window.slide = (typeof slide === 'undefined') ? {} : slide));