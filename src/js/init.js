/*jshint browser: true
*/
/*global slide:true, Class, gesture, clay, util, daumtools, dongtl*/
(function (exports) {
    'use strict';

    // event library
    try {
        var eventUtil = window.daumtools.event;
        exports.on = eventUtil.on;
        exports.off = eventUtil.off;
        exports.preventDefault = eventUtil.preventDefault;
        exports.stopPropagation = eventUtil.stopPropagation;

    } catch(e) {
        throw new Error("Not found : daumtools event");
    }

    // class & observable library
    exports.Class = window.Class || (window.daumtools && window.daumtools.Class);
    exports.Observable = window.Observable || (window.daumtools && window.daumtools.Observable);
    if (!exports.Class || !exports.Observable) {
       new Error("Not found : Class & Observable");
    }
    
    // ua_parser library
    exports.ua = window.ua_result;
    if (!exports.ua) {
       new Error("Not found : ua_parser");
    }

    // gesture library
    exports.gesture = window.gesture;
    if (!exports.gesture) {
       new Error("Not found : gesture");
    }

})(window.slide = (typeof slide === 'undefined') ? {} : slide);
