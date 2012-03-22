/*global describe: false, it: false, xit: false, expect: false,
  beforeEach: false, afterEach: false, jQuery: false, slide: false,
  waitsFor: false, runs: false, spyOn: false, jasmine: false */
describe('slide.js', function () {
    "use strict";

    describe('slide.Slide', function () {
        var WRAPPER_ID = 'wrapper_fixture',
            wrapper,
            $j = jQuery;

        beforeEach(function () {
            wrapper = document.createElement('div');
            wrapper.id = WRAPPER_ID;
            document.body.appendChild(wrapper);
        });

        afterEach(function () {
            document.body.removeChild(wrapper);
            wrapper = null;
        });

        xit('should init with element', function () {
            var s = new slide.Slide(wrapper);
            expect(s).toBeDefined();
        });

        xit('should create three slide panels', function () {
            new slide.Slide(wrapper);
            expect($j('.slide > .panel:eq(0)', wrapper).css('left')).toBe('0%');
            expect($j('.slide > .panel:eq(1)', wrapper).css('left')).toBe('100%');
            expect($j('.slide > .panel:eq(2)', wrapper).css('left')).toBe('-100%');
        });

        it('should disable 3d transform by default', function () {
            var enable3D = slide.Slide.prototype.enable3DTransform,
                mockSlide = {};
            enable3D.call(mockSlide, 'unknown UA');
            expect(mockSlide.enableTransform).toBeFalsy();
        });

        it('should enable 3d transform if over android gingerbread', function () {
            var enable3D = slide.Slide.prototype.enable3DTransform,
                ANDROID_2_3_1 = 'Mozilla/5.0 (Linux; U; Android 2.3.1; ko-kr; SHW-M250S Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
                mockSlide = {};
            enable3D.call(mockSlide, ANDROID_2_3_1);
            expect(mockSlide.enableTransform).toBeTruthy();
        });

        it('should disable 3d transform if under android gingerbread', function () {
            var enable3D = slide.Slide.prototype.enable3DTransform,
                ANDROID_2_2_1 = 'Mozilla/5.0 (Linux; U; Android 2.2.1; ko-kr; SHW-M250S Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
                mockSlide = {};
            enable3D.call(mockSlide, ANDROID_2_2_1);
            expect(mockSlide.enableTransform).toBeFalsy();
        });

        it('should enable 3d transform if it is non-android webkit', function () {
            var enable3D = slide.Slide.prototype.enable3DTransform,
                IPHONE_5_1 = 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B179 Safari/7534.48.3',
                mockSlide = {};
            enable3D.call(mockSlide, IPHONE_5_1);
            expect(mockSlide.enableTransform).toBeTruthy();
        });
    });

    describe('slide.UserAgentDetector', function () {
        var dummyUAString = 'i am user agent string',
            android_2_3_1 = 'Mozilla/5.0 (Linux; U; Android 2.3.1; ko-kr; SHW-M250S Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1';

        it('should receive first parameter as UA string', function () {
            var detector = slide.userAgent(dummyUAString);
            expect(detector.ua).toBe(dummyUAString);
        });

        it('should use navigator.userAgent if no argument provided', function () {
            var detector = slide.userAgent();
            expect(detector.ua).toBe(window.navigator.userAgent);
        });

        it('should detect Android', function () {
            var detector = slide.userAgent(android_2_3_1);
            expect(detector.isAndroid()).toBeTruthy();
        });

        it('should detect webkit', function () {
            var detector = slide.userAgent(android_2_3_1);
            expect(detector.isWebkit()).toBeTruthy();
        });

        it('should detect Android Versions', function () {
            var detector = slide.userAgent(android_2_3_1);
            expect(detector.androidVersion.major).toBe(2);
            expect(detector.androidVersion.minor).toBe(3);
        });
    });


    describe('slide.DataSource', function () {
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

        var DataSource = {
            init: function (data) {
                var obj = Object.create(this);
                obj.data = data;
                obj.index = 0;
                return obj;
            },
            getCurrentSet: function (callback) {
                var self = this;
                this.queryPrev(function (prev) {
                    self.queryNext(function (next) {
                        callback( {
                            prev: prev,
                            current: self.getCurrent(),
                            next: next
                        });
                    });
                });
            },
                queryPrev: function (callback) {
                    if (this.index - 1 < 0) { // reaches at first
                        this.willQueryFirstOfData(function (prev) {
                            callback(prev);
                        });
                    } else {
                        callback(this.data[this.index - 1]);
                    }
                },
                getCurrent: function () {
                    return this.data[this.index];
                },
                queryNext: function (callback) {
                    if (this.index + 1 >= this.data.length) { // reaches end
                        this.willQueryEndOfData(function (next) {
                            callback(next);
                        });
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
            willQueryEndOfData: function (callback) {
                callback(null);
            },
            willQueryFirstOfData: function (callback) {
                callback(null);
            },
            concatData: function (addends) {
                this.data = this.data.concat(addends);
            }
        };

        it('should serve current data set', function () {
            var ds = DataSource.init([1, 2, 3, 4, 5]),
                currentSet;
            ds.getCurrentSet(function (set) {
                currentSet = set;
            });
            waitsFor(function () {
                return currentSet;
            });
            runs(function () {
                expect(currentSet).toEqual({
                    prev: null,
                    current: 1,
                    next: 2
                });
            });
        });

        it('should call proper handler when reaching end of data', function () {
            var ds = DataSource.init([1, 2, 3, 4, 5]),
                currentSet;

            ds.index = 4;

            ds.willQueryEndOfData = function (callback) {
                var newData = [6, 7, 8];
                ds.concatData(newData);
                callback(newData[0]);
            };
            ds.getCurrentSet(function (set) {
                currentSet = set;
            });

            waitsFor(function () {
                return currentSet;
            });
            runs(function () {
                expect(currentSet).toEqual({
                    prev: 4,
                    current: 5,
                    next: 6
                });
            });
        });

        it('should call proper handler when reaching first of data', function () {
            var ds = DataSource.init([1, 2, 3, 4, 5]),
                currentSet;

            ds.index = 0;

            ds.willQueryFirstOfData = function (callback) {
                var data = ds.data;
                callback(data[data.length - 1]);
            };
            ds.getCurrentSet(function (set) {
                currentSet = set;
            });

            waitsFor(function () {
                return currentSet;
            });
            runs(function () {
                expect(currentSet).toEqual({
                    prev: 5,
                    current: 1,
                    next: 2
                });
            });
        });

        describe('infinite datasource', function () {

            var InfiniteDataSource = Object.create(DataSource);
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
                willQueryFirstOfData: function (callback) {
                    var data = this.data;
                    callback(data[data.length - 1]);
                },
                willQueryEndOfData: function (callback) {
                    var data = this.data;
                    callback(data[0]);
                }
            });

            it('should loop infinitly', function () {
                var ids = InfiniteDataSource.init([1, 2, 3]),
                    currentSet;
                function queryCurrentSet() {
                    currentSet = null;
                    ids.getCurrentSet(function (set) {
                        currentSet = set;
                    });
                }

                runs(function () {
                    queryCurrentSet();
                });
                waitsFor(function () {
                    return currentSet;
                });
                runs(function () {
                    expect(currentSet).toEqual({ prev: 3, current: 1, next: 2 });
                });

                runs(function () {
                    ids.next();
                    queryCurrentSet();
                });
                waitsFor(function () {
                    return currentSet;
                });
                runs(function () {
                    expect(currentSet).toEqual({ prev: 1, current: 2, next: 3 });
                });

                runs(function () {
                    ids.next();
                    queryCurrentSet();
                });
                waitsFor(function () {
                    return currentSet;
                });
                runs(function () {
                    expect(currentSet).toEqual({ prev: 2, current: 3, next: 1 });
                });
            });
        });
    });

});

