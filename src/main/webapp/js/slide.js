/*global gesture: false */
(function (exports) {
    "use strict";

    var SLIDE_TRESHOLD = 0.2,
        __slideIndex = 0,

        Slide,
        userAgent;
    
    Slide = function(slideHandlers, el, dataSource, gestureTreshold) {
        this.init(slideHandlers, el, dataSource, gestureTreshold);
    };
    
    Slide.prototype = {
        init: function (slideHandlers, el, dataSource, gestureTreshold) {
            this.__initPaging(slideHandlers, el, dataSource);
            this.enableTransform = false;
            this.enable3DTransform();
            this.__initSlide();
            this.__bindEvent(gestureTreshold);
        },
        __initPaging: function (slideHandlers, el, dataSource) {
            this.page = 0;
            this.offset = 0;
            this.__initTransitionState();
            this.wrapper = (typeof(el) === "string")? document.getElementById(el) : el;
            this.slideHandlers = slideHandlers;
            this.dataSource = dataSource;
        },
        enable3DTransform: function (uaString) {
            var ua = userAgent(uaString),
                isOverGingerBread = ua.androidVersion.major > 2 ||
                                    (ua.androidVersion.major === 2 && ua.androidVersion.minor >= 3);
            if (ua.isAndroid() && isOverGingerBread) {
                this.enableTransform = true;
            } else if (!ua.isAndroid() && ua.isWebkit()) {
                this.enableTransform = true;
            }
        },
        __setInitData: function (num) {
            var loadedInitData = this.dataSource.getInitData(num),
                data = '', i;
            for (i=0; i< 3; i += 1) {
                if (loadedInitData[i].type !== "invalid") {
                    this.panels[i].innerHTML = this.__addExternalFunction(this.slideHandlers.onSetDataItem, loadedInitData[i].data);
                }
            }
        },
        __initSlide: function () {
             this.__setWrapperSize();
             this.__createSlide();
             this.__setPanelsSize();
             this.__setSlideSizeAndOffset();
        },
        __createPanelStyle: function () {
            var enableStr = this.enableTransform ? '-webkit-transform:translate3d(0,0,0);' : '';
            return 'height: 100%;overflow:hidden;display:inline-block;'+ enableStr + 'width:'+this.pageWidth +'px;';
        },
        __createSlide: function () {
            var panelString = '<div class="panel" style="' + this.__createPanelStyle() + '"></div>';
            this.wrapper.innerHTML = '<div class="slide" id="slide-'+__slideIndex+'" style="overflow:hidden;position:relative;top:0;transform:translate3d(0,0,0);' +
                                    'left:'+(-this.pageWidth)+'px;width:'+(this.pageWidth * 3)+'px;">' +
                                    panelString + panelString + panelString + '</div>';
            this.el = document.getElementById("slide-"+__slideIndex);
            this.panels = this.el.getElementsByClassName("panel");
        },
        __bindEvent: function (gestureTreshold) {
            var resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize',
                listener = gesture.GestureListener(this.el, gestureTreshold),
                self = this;
    
            listener.onGestureStart(function(session){return self.__start.call(self, session);});
            listener.onGestureMove(function(session){return self.__move.call(self, session);});
            listener.onGestureEnd(function(session){return self.__end.call(self, session);});
            
            window.addEventListener(resizeEvent, function(){return self.__checkChangeValueByResize.call(self);});
            if (this.enableTransform) {
                this.el.addEventListener("webkitTransitionEnd", function(){return self.__onTransitionEnd.call(self);});
            }
        },
        __checkChangeValueByResize: function () {
            if (this.pageWidth === this.wrapper.clientWidth && this.pageHeight === this.wrapper.clientHeight) {
                var self = this;
                window.setTimeout(function(){return self.__checkChangeValueByResize.call(self);}, 50);
            } else {
                this.__resize();
            }
        },
        __resize: function () {
            this.__resizeElement();
            this.__addExternalFunction(this.slideHandlers.onResize);
        },
        __resizeElement: function () {
            this.__setWrapperSize();
            this.__setPanelsSize();
            this.__setSlideSizeAndOffset();
        },
        __setWrapperSize: function () {
            this.pageWidth = this.wrapper.clientWidth;
            this.pageHeight = this.wrapper.clientHeight;
        },
        __setPanelsSize: function () {
            for (var i=0;i<3;i += 1) {
                this.panels[i].style.width = '' + this.pageWidth + 'px';
            }
        },
        __setSlideSizeAndOffset: function () {
            this.el.style.width = '' + (this.pageWidth*3) + 'px';
            this.el.style.left = '' + (-this.pageWidth) + 'px';
        },
        __start: function (session) {
            this.isScrolling = false;
            this.__addExternalFunction(this.slideHandlers.onSlideStart, session);
        },
        __move: function (session) {
            if (!this.isTransitioning) {
                if (session.isSwipe() && !this.isScrolling) {
                    session.targetEvent.preventDefault();
                    this.__pos(session.delta.x/2);
                    this.__addExternalFunction(this.slideHandlers.onSlideMove, session);
                } else if (session.isScroll()) {
                    this.isScrolling = true; 
                }
            }
        },
        __end: function (session) {
            if (this.__isNextSwipe(session)) {
                this.__next(this.__setDurationTime(session));
            } else if (this.__isPrevSwipe(session)) {
                this.__prev(this.__setDurationTime(session));
            } else {
                this.__cancel('500ms');
            }
            this.__addExternalFunction(this.slideHandlers.onSlideEnd, session);
        },
        __setDurationTime: function (session) {
            var duration = Math.abs(parseInt(session.getTerm() * this.pageWidth / session.delta.x, 10));
            if (duration > 500) {
                return '500ms';
            } else {
                return '' + duration + 'ms';
            }
        },
        __pos: function (x) {
            if (this.enableTransform) {
                this.el.style.webkitTransform = 'translate3d('+ x +'px,0,0)';
            } else {
                this.el.style.left = ''+ (x-this.pageWidth) +'px';
            }
        },
        __setTransitionDuration: function (duration) {
            if (this.enableTransform) {
                this.el.style.webkitTransitionDuration = duration;
            }
        },
        __isNextSwipe: function (session) {
            return session.isLeft() && (this.__isNextThreshold(session) || session.isFlick());
        },
        __isNextThreshold: function (session) {
            return this.el.clientWidth * -1 * SLIDE_TRESHOLD > session.delta.x;
        },
        __isPrevSwipe: function (session) {
            return session.isRight() && (this.__isPrevThreshold(session) || session.isFlick());
        },
        __isPrevThreshold: function (session) {
            return this.el.clientWidth * SLIDE_TRESHOLD < session.delta.x;
        },
        __next: function (duration) {
            if (!this.isTransitioning) {
                this.loadedData = this.dataSource.getNextData();
                if (this.loadedData.type === "invalid") {
                    this.__cancel(duration);
                } else {
                    this.__setTransitionState(duration, "next");
                    this.__plusPageOffset();
                    this.__pos(-this.pageWidth);
                    if (!this.enableTransform) {
                        this.__setData();
                    }
                }
            }
        },
        __prev: function (duration) {
            if (!this.isTransitioning) {
                this.loadedData = this.dataSource.getPrevData();
                if (this.loadedData.type === "invalid") {
                    this.__cancel(duration);
                } else {
                    this.__setTransitionState(duration, "prev");
                    this.__minusPageOffset();
                    this.__pos(this.pageWidth);
                    if (!this.enableTransform) {
                        this.__setData();
                    }
                }
            }
        },
        __onTransitionEnd: function () {
            this.__setData();
            this.__addExternalFunction(this.slideHandlers.onTransitionEnd);
        },
        __setData: function () {
            if (this.dataDirect === "next") {
                this.__setNextData();
            } else if (this.dataDirect === "prev") {
                this.__setPrevData();
            }
            this.__initTransitionState();
            this.__pos(0);
        },
        __initTransitionState: function () {
            this.dataDirect = "";
            this.isTransitioning = false;
            this.__setTransitionDuration('0ms');
        },
        __setTransitionState: function (duration, direct) {
            this.__setTransitionDuration(duration);
            this.dataDirect = direct;
            this.isTransitioning = true;
        },
        __setNextData: function () {
            this.el.removeChild(this.panels[0]);
            this.el.appendChild(this.__setDataItem(this.loadedData.data));
            this.__addExternalFunction(this.slideHandlers.onSlideNext);
        },
        __setPrevData: function () {
            this.el.removeChild(this.panels[2]);
            this.el.insertBefore(this.__setDataItem(this.loadedData.data), this.panels[0]);
            this.__addExternalFunction(this.slideHandlers.onSlidePrev);
        },
        __setDataItem: function (loadedData) {
            var panel = document.createElement("div");
            panel.className = "panel";
            panel.style.cssText = this.__createPanelStyle();
            panel.innerHTML = this.__addExternalFunction(this.slideHandlers.onSetDataItem, loadedData);
            
            return panel;
        },
        __plusPageOffset: function () {
            this.page += 1;
            this.offset += 1;
            if (this.offset > 2) {
                this.offset = 0;
            }
        },
        __minusPageOffset: function () {
            this.page -= 1;
            this.offset -= 1;
            if (this.offset < 0) {
                this.offset = 2;
            }
        },
        __cancel: function (duration) {
            if (!this.isTransitioning) {
                this.__setTransitionDuration(duration);
                this.__pos(0);
                this.__addExternalFunction(this.slideHandlers.onSlideCancel);
            }
        },
        __addExternalFunction: function (fn, info) {
            if (fn) {
                return fn(info);
            } else {
                return info;
            }
        }
    };
            
    function slideListener (el, dataSourece, gestureTreshold) {
        var slideHandlers = {
                'onSlideStart': null,
                'onSlideMove': null,
                'onSlideEnd': null,
                'onSlidePrev': null,
                'onSlideNext': null,
                'onSlideCancel': null,
                'onResize': null,
                'onSetDataItem': null
            },
            slide = new Slide(slideHandlers, el, dataSourece, gestureTreshold);

        __slideIndex += 1;

        return {
            setSlideTreshold: function (slideTreshold) {
                SLIDE_TRESHOLD = slideTreshold;
            },
            onSlideStart: function (fn) {
                slideHandlers.onSlideStart = fn;
            },
            onSlideMove: function (fn) {
                slideHandlers.onSlideMove = fn;
            },
            onSlideEnd: function (fn) {
                slideHandlers.onSlideEnd = fn;
            },
            onSlidePrev: function (fn) {
                slideHandlers.onSlidePrev = fn;
            },
            onSlideNext: function (fn) {
                slideHandlers.onSlideNext = fn;
            },
            onSlideCancel: function (fn) {
                slideHandlers.onSlideCancel = fn;
            },
            onResize: function (fn) {
                slideHandlers.onResize = fn;
            },
            onSetDataItem: function (fn) {
                slideHandlers.onSetDataItem = fn;
            },
            onTransitionEnd: function (fn) {
                slideHandlers.onTransitionEnd = fn;
            },
            nextSlide: function (time) {
                slide.__next(time);
            },
            prevSlide: function (time) {
                slide.__prev(time);
            },
            setInitData: function (num) {
                slide.__setInitData(num);
            }
        };
    }

    userAgent = function (ua) {
        ua = (ua || window.navigator.userAgent).toString();
        return {
            ua: ua,
            isAndroid: function () {
                return ua.match(/android/i);
            },
            isWebkit: function () {
                return ua.match(/applewebkit/i);
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


    exports.Slide = Slide;
    exports.slideListener = slideListener;
    exports.userAgent = userAgent;
})(window.slide = {});


(function (exports) {
    "use strict";

    var DataSource = function (dataHandlers, isIterating, nextLoadIndex, prevLoadIndex) {
        this.init(dataHandlers, isIterating, nextLoadIndex, prevLoadIndex);
    };
    DataSource.prototype = {
        init: function (dataHandlers, isIterating, nextLoadIndex, prevLoadIndex) {
            this.dataHandlers = dataHandlers;
            this.isIterating = isIterating || false;
            this.nextLoadIndex = nextLoadIndex || 0;
            this.prevLoadIndex = prevLoadIndex || 0;
            this.dataList = [];
            this.currentIndex = 0;
            this.loadPrevData = false;
            this.loadNextData = false;
            this.isInitLoadData = false;
        },
        addData: function (data) {
            this.dataList.push(data);
        },
        addDataList: function (dataArr) {
            this.dataList = this.dataList.concat(dataArr);
        },
        addPrevDataList: function (dataArr) {
            this.currentIndex = this.currentIndex + dataArr.length;
            this.dataList = dataArr.concat(this.dataList);
        },
        setDataTotalLength: function (length) {
            this.totalLen = length;
        },
        getDataTotalLength: function () {
            return this.totalLen || this.getDataListLength();
        },
        getDataListLength: function () {
            return this.dataList.length;
        },
        getDataByIndex: function (index) {
            if (this.isIterating) {
                index = this.__iterationIndexing(index);
            }
            return this.__checkData(index);
        },
        __checkData: function (index) {
            var dataInfo = {};
            if (index === 0) {
                dataInfo.type = "start";
                dataInfo.data = this.dataList[index];
            } else if (index === this.getDataTotalLength() - 1) {
                dataInfo.type = "end";
                dataInfo.data = this.dataList[index];
            } else if (index === -1) {
                dataInfo.type = "startPrev";
                dataInfo.data = "";
            } else if (index === this.getDataTotalLength()) {
                dataInfo.type = "endNext";
                dataInfo.data = "";
            } else if (index > 0 && index < this.getDataTotalLength() - 1){
                dataInfo.type = "valid";
                dataInfo.data = this.dataList[index];
            } else {
                dataInfo.type = "invalid";
                dataInfo.data = "";
            }
            return dataInfo;
        },
        __iterationIndexing: function (index){
            var len = this.getDataTotalLength();
            
            if ( index < 0 ) {
                do{
                    index = len + index;
                } while (index < 0);
            } else if (index >= len) {
                do {
                    index = index - len;
                } while (index >= len);
            } 
            return index;
        },
        getCurrentData: function () {
            return this.getDataByIndex(this.currentIndex);
        },
        getPrevData: function () {
            var dataInfo = this.getDataByIndex(this.getPrevIndex());
            
            if (dataInfo.type !== "invalid") {
                this.currentIndex -= 1;
                if (this.checkPrevLoadingData(this.currentIndex)) {
                    this.requestPrevData();
                }
            } 
            return dataInfo;    
        },
        getNextData: function () {
            var dataInfo = this.getDataByIndex(this.getNextIndex());
            if (dataInfo.type !== "invalid") {
                this.currentIndex += 1;
                if (this.checkNextLoadingData(this.currentIndex)) {
                    this.requestData();
                }
            } 
            return dataInfo;
        },
        checkNextLoadingData: function (index) {
            return this.nextLoadIndex !== 0 && this.nextLoadIndex >= this.getDataListLength() - index;
        },
        checkPrevLoadingData: function (index) {
            return this.prevLoadIndex !== 0 && this.prevLoadIndex >= index;
        },
        getPrevIndex: function () {
            return this.currentIndex - 2;
        },
        getNextIndex: function () {
            return this.currentIndex + 2;
        },
        setInitData: function (index, options) {
            this.currentIndex = index;
            this.requestData(options);
        },
        getInitData: function (index) {
            var dataArr = [];
            if (typeof index === "number") {
                this.currentIndex = index;
            }
            dataArr.push(this.getDataByIndex(this.currentIndex - 1));
            dataArr.push(this.getDataByIndex(this.currentIndex));
            dataArr.push(this.getDataByIndex(this.currentIndex + 1));
            
            return dataArr;
        },
        requestData: function (options) {
            if (this.dataHandlers.requestDataHandler) {
                this.dataHandlers.requestDataHandler(options);
            } else {
                this.responseData(options.data);
            }
        },
        requestPrevData: function (options) {
            if (this.dataHandlers.requestDataHandler) {
                this.dataHandlers.requestPrevDataHandler(options);
            } else {
                this.responsePrevData(options.data);
            }
        },
        responseData: function (data) {
            var dataList = this.parseData(data);
            this.addDataList(dataList);
            this.checkInitLoadData();
        },
        responsePrevData: function (data) {
            var dataList = this.parseData(data);
            this.addPrevDataList(dataList);
            this.checkInitLoadData();
        },
        checkInitLoadData: function () {
            if (this.isInitLoadData) {
                this.addExternalFunction(this.dataHandlers.dataLoadEndHandler);
            } else {
                this.setInitLoadData();
            }
        },
        setInitLoadData: function () {
            this.setInitNextData();
            this.setInitPrevData();
            this.checkCompleteInitData();
        },
        setInitNextData: function () {
            if (this.checkNextLoadingData(this.currentIndex)) {
                this.requestData();
            } else {
                this.loadNextData = true;
            }
        },
        setInitPrevData: function () {
            if (this.checkPrevLoadingData(this.currentIndex)) {
                this.requestPrevData();
            } else {
                this.loadPrevData = true;
            }
        },
        checkCompleteInitData: function () {
            if (this.loadPrevData && this.loadNextData) {
                this.isInitLoadData = true;
                this.addExternalFunction(this.dataHandlers.onInitDataLoadHandler);
            }
        },
        addExternalFunction: function (fn) {
            if (fn) {
                fn();
            }
        },
        parseData: function (data) {
            if (this.dataHandlers.parseDataHandler) {
                return this.dataHandlers.parseDataHandler(data);
            } else {
                return data;
            }
        }
    };
    
    function dataSourceListener (isIterating, nextLoadIndex, prevLoadIndex) {
        var dataHandlers = {
                parseDataHandler : null,
                requestDataHandler : null,
                requestPrevDataHandler : null,
                dataLoadEndHandler : null,
                onInitDataLoadHandler : null
            },
            dataSource = new DataSource(dataHandlers, isIterating, nextLoadIndex, prevLoadIndex);
        
        return {
            addDataList: function (dataArr) {
                dataSource.addDataList(dataArr);
            },
            addPrevDataList: function (dataArr) {
                dataSource.addPrevDataList(dataArr);
            },
            addData: function (data) {
                data.addData(data);
            },
            getDataByIndex: function (index) {
                return dataSource.getDataByIndex(index);
            },
            getDataSourceLength: function () {
                return dataSource.getDataListLength();
            },
            getCurrentData: function () {
                return dataSource.getCurrentData();
            },
            getPrevData: function () {
                return dataSource.getPrevData();
            },
            getNextData: function () {
                return dataSource.getNextData();
            },
            getInitData: function (index) {
                return dataSource.getInitData(index);
            },
            setDataTotalLength: function (len) {
                dataSource.setDataTotalLength(len);
            },
            getDataTotalLength: function () {
                return dataSource.getDataTotalLength();
            },
            onParseData: function (fn) {
                dataHandlers.parseDataHandler = fn;
            },
            onRequestPrevData: function (fn) {
                dataHandlers.requestPrevDataHandler = fn;
            },
            onRequestData: function (fn) {
                dataHandlers.requestDataHandler = fn;
            },
            onDataLoadEnd: function (fn) {
                dataHandlers.dataLoadEndHandler = fn;
            },
            sendRequestData: function (options) {
                dataSource.requestData(options);
            },
            responseData: function (data) {
                dataSource.responseData(data);
            },
            responsePrevData: function (data) {
                dataSource.responsePrevData(data);
            },
            getCurrentIndex: function () {
                return dataSource.__iterationIndexing(dataSource.currentIndex);
            },
            stopLoadData: function () {
                dataSource.nextLoadIndex = 0;
                dataSource.prevLoadIndex = 0;
            },
            setInitData: function (index, fn, options) {
                if (fn) {
                    dataHandlers.onInitDataLoadHandler = fn;
                }
                dataSource.setInitData(index, options);
            }
        };
    }
    
    exports.listener = dataSourceListener;
})(window.slideDataSource = {});
