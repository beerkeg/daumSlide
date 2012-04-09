(function (exports) {
    "use strict";

    var Observable = exports.Observable = Class.extend({
        addListener: function (event, listener) {
            this.listeners = this.listeners || {};
            this.listeners[event] = this.listeners[event] || [];
            this.listeners[event].push(listener);
            return this;
        },
        on: function (event, listener) {
            this.addListener(event, listener);
            return this;
        },
        emit: function (event) {
            this.listeners = this.listeners || {};
            var listeners = this.listeners[event],
                args = [].slice.call(arguments, 1);
            if (typeof listeners !== 'undefined') {
                for (var i = 0, len = listeners.length; i < len; i++) {
                    listeners[i].apply(this, args);
                }        
            }
            return this;
        },
        removeListener: function (event, listener) {
            this.listeners = this.listeners || {};
            var listeners = this.listeners[event];
            if (typeof listeners !== 'undefined') {
                for (var i = 0, len = listeners.length; i < len; i++) {
                    if ( listeners[i] === listener ) {
                        listeners.splice(i,1);
                        break;
                    }
                }
            }
            return this;
        },
        off: function () {
            this.removeListener(event, listener);
            return this;
        }
    });
})(window.slide = (typeof slide === 'undefined') ? {} : slide);