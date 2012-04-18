/*jshint browser: true
*/
/*global slide:true, Class: true, gesture: true*/
(function (exports) {
    'use strict';

    var userAgent = exports.userAgent = function (ua) {
        ua = (ua || window.navigator.userAgent).toString();
        return {
            ua: ua,
            isAndroid: function () {
                return ua.match(/android/i);
            },
            isIOS: function () {
                return ua.match(/like mac os x./i);
            },
            isSafari: function () {
                return !ua.match(/mobile/i) && ua.match(/safari/i);
            },
            androidVersion: function() {
                var major = 1, minor = 0, versions,
                    matches = / android ([0-9\.]+);/i.exec(ua);
                if (matches && matches.length === 2) {
                    versions = matches[1].split('.');
                    major = parseInt(versions[0], 10);
                    minor = parseInt(versions[1], 10);
                }
                return {
                    major: major,
                    minor: minor
                };
            }()
        };
    };

    /**
     * 3d gpu 가속 여부를 사용할수 있는지 판단한다.
     * @param uaString {String}
     */
    var isTransformEnabled = exports.isTransformEnabled =  (function () {
        var ua = userAgent(),
            isOverGingerBread = ua.androidVersion.major > 2 ||
                (ua.androidVersion.major === 2 && ua.androidVersion.minor >= 3);
        return !!((ua.isAndroid() && isOverGingerBread) || ua.isIOS() || ua.isSafari());
    })();
    exports.hardwareAccelStyle = isTransformEnabled ? '-webkit-transform:translate3d(0,0,0);' : '';


    exports.onResized = function (el, callback) {
        var resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize',
            width = el.clientWidth, height = el.clientHeight;

        function isSizeReallyChanged () {
            return !(width === el.clientWidth && height === el.clientHeight);
        }

        window.addEventListener(resizeEvent, function () {
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
