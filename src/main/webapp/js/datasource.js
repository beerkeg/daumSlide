/*global slide:false
 */
(function (exports) {
    "use strict";

    var DataSource, InfiniteDataSource;

    if (typeof Object.create === 'undefined') {
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }
    function extend(obj, props) {
        var prop;
        for (prop in props) {
            if (props.hasOwnProperty(prop)) {
                obj[prop] = props[prop];
            }
        }
    }

    exports.DataSource = DataSource = {
        init: function (data) {
            var obj = Object.create(this);
            obj.data = data;
            obj.index = 0;
            return obj;
        },
        queryCurrentSet: function (callback) {
            var self = this;
            this.queryPrev(function (prev) {
                self.queryCurrent(function (current) {
                    self.queryNext(function (next) {
                        callback({
                            prev: prev,
                            current: current,
                            next: next
                        });
                    });
                });
            });
        },
        queryPrev: function (callback) {
            if (this.index - 1 < 0) { // reaches at first
                if (typeof this.willQueryFirstOfDataDelegate === 'function') {
                    this.willQueryFirstOfDataDelegate(function (prev) {
                        callback(prev);
                    });
                } else {
                    callback(null);
                }
            } else {
                callback(this.data[this.index - 1]);
            }
        },
        queryCurrent: function (callback) {
            callback(this.data[this.index]);
        },
        queryNext: function (callback) {
            if (this.index + 1 >= this.data.length) { // reaches end
                if (typeof this.willQueryEndOfDataDelegate === 'function') {
                    this.willQueryEndOfDataDelegate(function (next) {
                        callback(next);
                    });
                } else {
                    callback(null);
                }
            } else {
                callback(this.data[this.index + 1]);
            }
        },
        next: function () {
            this.index += 1;
        },
        prev: function () {
            this.index -= 1;
        },
        willQueryEndOfData: function (delegate) {
            this.willQueryEndOfDataDelegate = delegate;
        },
        willQueryEndOfDataDelegate: function (callback) {
            callback(null);
        },
        willQueryFirstOfData: function (delegate) {
            this.willQueryFirstOfDataDelegate = delegate;
        },
        willQueryFirstOfDataDelegate: function (callback) {
            callback(null);
        },
        concatData: function (addends) {
            this.data = this.data.concat(addends);
        }
    };

    exports.InfiniteDataSource = InfiniteDataSource = Object.create(DataSource);
    extend(InfiniteDataSource, {
        next: function () {
            if (this.index + 1 >= this.data.length) {
                this.index = 0;
            } else {
                this.index += 1;
            }
        },
        prev: function () {
            if (this.index <= 0) {
                this.index = this.data.length - 1;
            } else {
                this.index -= 1;
            }
        },
        willQueryFirstOfDataDelegate: function (callback) {
            var data = this.data;
            callback(data[data.length - 1]);
        },
        willQueryEndOfDataDelegate: function (callback) {
            var data = this.data;
            callback(data[0]);
        }
    });

})(window.slide = (typeof slide === 'undefined') ? {} : slide);

