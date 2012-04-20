/*jshint browser: true
 */
/*global Class: true, slide: true */
(function (exports) {
    'use strict';

    exports.Observable = Class.extend({
        addListener: function (event, listener) {
            var listeners = this.getListeners(event);
            listeners.push(listener);
            return this;
        },
        on: function () {
            return this.addListener.apply(this, arguments);
        },

        emit: function (event) {
            var listeners = this.getListeners(event),
                args = [].slice.call(arguments, 1);
            if (typeof listeners !== 'undefined') {
                for (var i = 0, len = listeners.length; i < len; i++) {
                    listeners[i].apply(this, args);
                }
            }
            return this;
        },

        removeListener: function (event, listener) {
            var listeners = this.getListeners(event);
            if (typeof listeners !== 'undefined') {
                for (var i = 0, len = listeners.length; i < len; i++) {
                    if (listeners[i] === listener) {
                        listeners.splice(i, 1);
                        break;
                    }
                }
            }
            return this;
        },
        off: function () {
            return this.removeListener.apply(this, arguments);
        },

        getListeners: function (event) {
            this.listeners = this.listeners || {};
            this.listeners[event] = this.listeners[event] || [];
            return this.listeners[event];
        },
        removeAllListener: function () {
            delete this.listeners;
        }
    });
})(window.slide = (typeof slide === 'undefined') ? {} : slide);