/*jshint browser: true
*/

(function (exports) {
    "use strict";

    exports.event = {
        on: function () {
            if (document.addEventListener) {
                return function (el, type, fn) {
                    if (!el) {
                        throw 'failed to add event. Element: "' + el + '", Event: "' + type + '", handler: ' + fn.toString();
                    }
                    el.addEventListener(type, fn, false);
                };
            } else {
                return function (el, type, fn) {
                    el.attachEvent('on' + type, fn);
                };
            }
        }(),
        off: function () {
            if (document.removeEventListener) {
                return function (el, type, fn) {
                    el.removeEventListener(type, fn, false);
                };
            } else {
                return function (el, type, fn) {
                    el.detachEvent("on" + type, fn);
                };
            }
        }(),
        preventDefault: function (e) {
            var ev = e || window.event;
            if (ev.preventDefault) {
                ev.preventDefault();
            } else {
                ev.returnValue = false;
            }
        },
        stopPropagation: function (e) {
            var ev = e || window.event;
            if (ev.stopPropagation) {
                ev.stopPropagation();
            } else {
                ev.cancelBubble = true;
            }
        },
        getTarget: function (e) {
            var ev = e || window.event;
            return ev.target || ev.srcElement;
        }
    };
})(window.daumtools = (typeof window.daumtools === 'undefined') ? {} : window.daumtools);

/*jshint browser: true
*/

(function (exports) {
    "use strict";
    
    exports.extend = function (dest, src, overwrite) {
        dest = dest || {};
        
        for(var key in src) {
            if (src.hasOwnProperty(key)) {
                if (!dest[key] || overwrite) {
                    dest[key] = src[key];
                }
            }
        }

        return dest;
    };
        
})(window.daumtools = (typeof window.daumtools === 'undefined') ? {} : window.daumtools);