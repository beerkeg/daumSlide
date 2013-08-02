/*jshint browser: true
*/
/*global slide:true, Class: true, gesture: true, daumtools*/
(function (exports) {
    'use strict';

    exports.Observable = window.Observable || window.daumtools.Observable;

    var userAgent = exports.userAgent = function (ua) {
        ua = (ua || window.navigator.userAgent).toLowerCase();
        return {
            ua: ua,
            isIe8: /msie 8/.test(ua),
            isIe9: /msie 9/.test(ua),
            isIe10: /msie 10/.test(ua),
            isIe11: /trident\/7.0/.test(ua),
            isPolaris: /polaris/.test(ua),
            isOpera: /opera/.test(ua),
            isWinMobile: /windows (ce||mobile)/.test(ua),
            isFirefox: /firefox/.test(ua),
            isAndroid: /android/.test(ua),
            isDolfin: /dolfin/.test(ua),
            isIOS: /like mac os x./.test(ua),
            isSafari: (!/mobile/.test(ua) && /safari/.test(ua)),
            isPc: function () {
                if (ua.match(/linux|windows (nt|98)|macintosh/) && !ua.match(/android|mobile|polaris|lgtelecom|uzard|natebrowser|ktf;|skt;/)) {
                    return true;
                }
                return false;
            }(),
            androidVersion: function() {
                var major = 1, minor = 0, patch = 0, versions,
                    matches = /android ([0-9\.]+);/i.exec(ua);
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

    var ua = userAgent();
    /**
     * 3d gpu 가속 여부를 사용할수 있는지 판단한다.
     */
    var isTransformEnabled = exports.isTransformEnabled =  (function () {
        var isOverIcs = ua.androidVersion.major > 3;
        return !!((ua.isAndroid && isOverIcs) || ua.isIOS || ua.isSafari);
    })();
    exports.hardwareAccelStyle = isTransformEnabled ? '-webkit-transform:translate3d(0,0,0);' : '';

    var isSwipeEnabled = exports.isSwipeEnabled =  (function () {
        return (ua.isAndroid || ua.isIOS || ua.isSafari || ua.isFirefox || ua.isDolfin || ua.isIe11 || ua.isIe10 || ua.isIe9 || ua.isIe8 || ua.isOpera) &&
            !(ua.isPolaris || ua.isWinMobile);
    })();

    /**
     * ics 4.0.3 이상 버젼 대응.
     */
    var isUsingClone = exports.isUsingClone =  (function () {
        var isOverIcs4_0_3 = ua.androidVersion.major > 4 ||
                (ua.androidVersion.major === 4 && ua.androidVersion.minor > 0) ||
                (ua.androidVersion.major === 4 && ua.androidVersion.minor === 0 && ua.androidVersion.patch >= 3);
        return !!((ua.isAndroid && isOverIcs4_0_3));
    })();

    exports.onResized = function () {
        if ("onorientationchange" in window && !ua.isPc) {
            return function (el, callback) {
                var width = el.clientWidth, height = el.clientHeight;

                function isSizeReallyChanged () {
                    return !(width === el.clientWidth && height === el.clientHeight);
                }
                window.gesture.EventUtil.listen(window, "orientationchange", function () {
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
        } else {
            return function (el, callback) {
                window.gesture.EventUtil.listen(window, "resize", function () {
                    setTimeout(function checkResize() {
                        var width = el.clientWidth,
                            height = el.clientHeight;
                        callback(width, height);
                    }, 50);
                });
            };
        }
    }();

    function isOverAndroidHoneycomb() {
        return !!(ua.isAndroid && ua.androidVersion.major > 3);
    }
    function isAndroidIcs() {
        return !!(ua.isAndroid && ua.androidVersion.major === 4 && ua.androidVersion.minor === 0);
    }

    var availMatchMedia = (typeof window.matchMedia === "function" && isOverAndroidHoneycomb()) ? true : false,
        availOrientationChange = ("onorientationchange" in window && !ua.isAndroid && !ua.isPc) ? true : false;

    function fixbugOnMediaMatch() {
        var style = document.createElement("style");
        style.innerHTML = "@media all and (orientation:portrait){.f{}}@media all and (orientation:landscape){.f{}}";
        document.getElementsByTagName("head")[0].appendChild(style);
    }

    function checkResize(el, callback) {
        setTimeout(function(){
            var width = el.clientWidth,
                height = el.clientHeight;
            if (width > 0 && height > 0) {
                callback(width, height);
            }
        }, 50);
    }
    exports.onResized = function () {
        if (availMatchMedia) {
            if (isAndroidIcs()) {
                fixbugOnMediaMatch();
            }
            var mql = window.matchMedia("(orientation: landscape)");

            return function (el, callback) {
                mql.addListener(function(){
                    checkResize(el, callback);
                });
            };
        } else {
            var resizeEvent = availOrientationChange ? "orientationchange" : "resize";

            return function (el, callback) {
                window.gesture.EventUtil.listen(window, resizeEvent, function () {
                    checkResize(el, callback);
                });
            };
        }
    }();

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
