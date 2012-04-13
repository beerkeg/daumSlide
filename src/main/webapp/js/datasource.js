/*global Class: true, slide: true */
(function (exports) {
    "use strict";

    /**
     * slide 를 위한 데이터소스 delegate
     */
    var DataSource = exports.DataSource = Class.extend({
        /**
         * 새로운 DataSource를 생성/초기화한다.
         * @param data {Array}
         */
        init: function (data) {
            this.data = data;
            this.index = 0;
        },
        /**
         * 현재 인덱스를 설정한다.
         * @param index {Integer}
         */
        setCurrentIndex: function (index) {
            this.index = index;
        },
        /**
         * 현재/이전/다음 데이터셋을 불러온다.
         * 데이터가 없을 경우 해당 필드는 null 로 세팅된다.
         * @param callback {Function}
         */
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
        /**
         * 이전 데이터를 불러온다.
         * 데이터가 없을 경우 해당 필드는 null 로 세팅된다.
         * @param callback {Function}
         */
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
        /**
         * 현재 데이터를 불러온다.
         * @param callback {Function}
         */
        queryCurrent: function (callback) {
            callback(this.data[this.index]);
        },
        /**
         * 다음 데이터를 불러온다.
         * 데이터가 없을 경우 해당 필드는 null 로 세팅된다.
         * @param callback {Function}
         */
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
        /**
         * 다음 데이터로 이동
         */
        next: function () {
            this.index += 1;
        },
        /**
         * 이전 데이터로 이동
         */
        prev: function () {
            this.index -= 1;
        },
        /**
         * 데이터 끝에 도달하였을 때 호출될 delegate를 설정한다.
         * @param delegate {Function}
         */
        willQueryEndOfData: function (delegate) {
            this.willQueryEndOfDataDelegate = delegate;
        },
        /**
         * 현재 데이터 끝에 도달하였을 때 호출될 기본 delegate.
         * callback에 그 다음 데이터를 넘겨 호출하여 준다.
         * @param callback {Function}
         */
        willQueryEndOfDataDelegate: function (callback) {
            callback(null);
        },
        /**
         * 데이터 시작에 도달하였을 때 호출될 delegate를 설정한다.
         * @param delegate {Function}
         */
        willQueryFirstOfData: function (delegate) {
            this.willQueryFirstOfDataDelegate = delegate;
        },
        /**
         * 현재 데이터 시작에 도달하였을 때 호출될 기본 delegate.
         * callback에 그 다음 데이터를 넘겨 호출하여 준다.
         * @param callback {Function}
         */
        willQueryFirstOfDataDelegate: function (callback) {
            callback(null);
        },
        /**
         * 기존의 데이터 뒤에 새로운 데이터를 추가한다.
         * @param addends {Array}
         */
        addNextData: function (addends) {
            this.data = this.data.concat(addends);
        },
        /**
         * 기존의 데이터 앞에 새로운 데이터를 추가한다.
         * @param addends {Array}
         */
        addBeforeData: function (addends) {
            this.setCurrentIndex(addends.length + this.index);
            this.data = addends.concat(this.data);
        }
    });

    /**
     * slide 를 위한 데이터소스 delegate.
     * 무한 루프 형태의 DataSource 예시
     */
    exports.InfiniteDataSource = DataSource.extend({
        init: function (data) {
            this._super(data);
        },
        /**
         * 다음 데이터로 이동, 다음 데이터가 없을 경우 맨 처음 데이터로 이동.
         */
        next: function () {
            if (this.index + 1 >= this.data.length) {
                this.index = 0;
            } else {
                this.index += 1;
            }
        },
        /**
         * 이전 데이터로 이동, 이전 데이터가 없을 경우 맨 끝 데이터로 이동.
         */
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

