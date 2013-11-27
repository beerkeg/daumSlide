/*global Class: true, slide: true */
(function (exports) {
    "use strict";

    /**
     * slide 를 위한 데이터소스 delegate
     * 새로운 DataSource를 생성/초기화한다.
     *
     * @class DataSource
     * @constructor
     * @param data {Array}
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
         *
         * @method setCurrentIndex
         * @param index {Number} 현재 인덱스로 세팅할 값
         */
        setCurrentIndex: function (index) {
            this.index = index;
        },
        /**
         * 현재/이전/다음 데이터셋을 불러온다.
         * 데이터가 없을 경우 해당 필드는 null 로 세팅된다.
         *
         * @method queryCurrentSet
         * @async
         * @param callback {Function} 데이터를 모두 로드 된후 해당 데이터 set을 인자로 갖고 실행될 callback 함수
         *      callback({prev, current, next});
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
         *
         * @method queryPrev
         * @async
         * @param callback {Function} 데이터를 모두 로드 된후 해당 데이터를 인자로 갖고 실행될 callback 함수
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
         *
         * @method queryCurrent
         * @async
         * @param callback {Function} 데이터를 모두 로드 된후 해당 데이터를 인자로 갖고 실행될 callback 함수
         */
        queryCurrent: function (callback) {
            callback(this.data[this.index]);
        },
        /**
         * 다음 데이터를 불러온다.
         * 데이터가 없을 경우 해당 필드는 null 로 세팅된다.
         *
         * @method queryNext
         * @async
         * @param callback {Function} 데이터를 모두 로드 된후 해당 데이터를 인자로 갖고 실행될 callback 함수
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
         *
         * @method next
         */
        next: function () {
            this.index += 1;
        },
        /**
         * 이전 데이터로 이동
         *
         * @method prev
         */
        prev: function () {
            this.index -= 1;
        },
        /**
         * 데이터 끝에 도달하였을 때 호출될 delegate를 설정한다.
         *
         * @method willQueryEndOfData
         * @param delegate {Function}
         */
        willQueryEndOfData: function (delegate) {
            this.willQueryEndOfDataDelegate = delegate;
        },
        /**
         * 현재 데이터 끝에 도달하였을 때 호출될 기본 delegate.
         * callback에 null을 넘겨 호출하여 준다.
         *
         * @method willQueryEndOfDataDelegate
         * @param callback {Function}
         */
        willQueryEndOfDataDelegate: function (callback) {
            callback(null);
        },
        /**
         * 데이터 시작에 도달하였을 때 호출될 delegate를 설정한다.
         *
         * @method willQueryFirstOfData
         * @param delegate {Function}
         */
        willQueryFirstOfData: function (delegate) {
            this.willQueryFirstOfDataDelegate = delegate;
        },
        /**
         * 현재 데이터 시작에 도달하였을 때 호출될 기본 delegate.
         * callback에 null을 넘겨 호출하여 준다.
         *
         * @method willQueryFirstOfDataDelegate
         * @param callback {Function}
         */
        willQueryFirstOfDataDelegate: function (callback) {
            callback(null);
        },
        /**
         * 기존의 데이터 뒤에 새로운 데이터를 추가한다.
         *
         * @method addNextData
         * @param addends {Array} 추가될 data Array
         */
        addNextData: function (addends) {
            this.data = this.data.concat(addends);
        },
        /**
         * 기존의 데이터 앞에 새로운 데이터를 추가한다.
         *
         * @method addPrevData
         * @param addends {Array} 추가될 data Array
         */
        addPrevData: function (addends) {
            this.setCurrentIndex(addends.length + this.index);
            this.data = addends.concat(this.data);
        },
        /**
         * 해당 클래스의 인스턴스 삭제시 할당된 오브젝트들을 destroy 시킨다.
         *
         * @method destroy
         */
        destroy: function () {
            delete this.data;
        }
    });

    /**
     * slide 를 위한 데이터소스 delegate.
     * 무한 루프 형태의 DataSource 예시
     *
     * @class InfiniteDataSource
     * @extend DataSource
     * @constructor
     * @param data {Array}
     */
    exports.InfiniteDataSource = DataSource.extend({
        init: function (data) {
            this._super(data);
        },
        /**
         * 다음 데이터로 이동, 다음 데이터가 없을 경우 맨 처음 데이터로 이동.
         *
         * @method next
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
         *
         * @method prev
         */
        prev: function () {
            if (this.index <= 0) {
                this.index = this.data.length - 1;
            } else {
                this.index -= 1;
            }
        },
        /**
         * 현재 데이터 시작에 도달하였을 때 호출될 기본 delegate.
         * callback에 맨 마지막 데이터를 넘겨 호출하여 준다.
         *
         * @method willQueryFirstOfDataDelegate
         * @param callback {Function}
         */
        willQueryFirstOfDataDelegate: function (callback) {
            var data = this.data;
            callback(data[data.length - 1]);
        },
        /**
         * 현재 데이터 끝에 도달하였을 때 호출될 기본 delegate.
         * callback에 맨처음 데이터를 넘겨 호출하여 준다.
         *
         * @method willQueryEndOfDataDelegate
         * @param callback {Function}
         */
        willQueryEndOfDataDelegate: function (callback) {
            var data = this.data;
            callback(data[0]);
        }
    });

})(window.slide = (typeof slide === 'undefined') ? {} : slide);

