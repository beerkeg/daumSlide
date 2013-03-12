/*jshint browser: true
*/
/*global slide:true, Class: true, gesture: true*/
(function (exports) {
    'use strict';

    var userAgent = exports.userAgent = function (ua) {
        ua = (ua || window.navigator.userAgent).toString();
        return {
            ua: ua,
            isIe8: !!(ua.match(/msie 8/i)),
            isIe9: !!(ua.match(/msie 9/i)),
            isPolaris: !!(ua.match(/polaris/i)),
            isOpera: !!(ua.match(/opera/i)),
            isWinMobile: !!(ua.match(/windows ce/i) || ua.match(/windows mobile/i)),
            isFirefox: !!(ua.match(/firefox/i)),
            isAndroid: !!(ua.match(/android/i)),
            isDolfin: !!(ua.match(/dolfin/i)),
            isIOS: !!(ua.match(/like mac os x./i)),
            isSafari: !!(!ua.match(/mobile/i) && ua.match(/safari/i)),
            androidVersion: function() {
                var major = 1, minor = 0, patch = 0, versions,
                    matches = / android ([0-9\.]+);/i.exec(ua);
                if (matches && matches.length === 2) {
                    versions = matches[1].split('.');
                    major = parseInt(versions[0], 10);
                    minor = parseInt(versions[1], 10);
                    patch = parseInt(versions[2], 10);
                }
                return {
                    major: major,
                    minor: minor,
                    patch: patch
                };
            }()
        };
    };

    /**
     * 3d gpu 가속 여부를 사용할수 있는지 판단한다.
     */
    var isTransformEnabled = exports.isTransformEnabled =  (function () {
        var ua = userAgent(),
            isOverIcs = ua.androidVersion.major > 3;
        return !!((ua.isAndroid && isOverIcs) || ua.isIOS || ua.isSafari);
    })();
    exports.hardwareAccelStyle = isTransformEnabled ? '-webkit-transform:translate3d(0,0,0);' : '';

    var isSwipeEnabled = exports.isSwipeEnabled =  (function () {
        var ua = userAgent();
        return (ua.isAndroid || ua.isIOS || ua.isSafari || ua.isFirefox || ua.isDolfin || ua.isIe9 || ua.isIe8 || ua.isOpera) &&
            !(ua.isPolaris || ua.isWinMobile);
    })();

    /**
     * ics 4.0.3 이상 버젼 대응.
     */
    var isUsingClone = exports.isUsingClone =  (function () {
        var ua = exports.userAgent(),
            isOverIcs4_0_3 = ua.androidVersion.major > 4 ||
                (ua.androidVersion.major === 4 && ua.androidVersion.minor > 0) ||
                (ua.androidVersion.major === 4 && ua.androidVersion.minor === 0 && ua.androidVersion.patch >= 3);
        return !!((ua.isAndroid && isOverIcs4_0_3));
    })();

    exports.onResized = function (el, callback) {
        var resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize',
            width = el.clientWidth, height = el.clientHeight;

        function isSizeReallyChanged () {
            return !(width === el.clientWidth && height === el.clientHeight);
        }

        window.gesture.EventUtil.listen(window, resizeEvent, function () {
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

    exports.preventDefault = function (e) {
        var ev = e || window.event;
        if (ev.preventDefault) {
            ev.preventDefault();
        } else {
            ev.returnValue = false;
        }
    };

    exports.stopPropagation = function (e) {
        var ev = e || window.event;
        if (ev.stopPropagation) {
            ev.stopPropagation();
        } else {
            ev.cancelBubble = true;
        }
    };
})(window.slide = (typeof slide === 'undefined') ? {} : slide);
