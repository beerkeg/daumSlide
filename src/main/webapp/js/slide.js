(function (exports) {
    "use strict";

    var SLIDE_TRESHOLD = 0.2;
    var __slideIndex = 0;
    
    var Slide = function(slideHandlers, el, dataSource, gestureTreshold) {
        this.init(slideHandlers, el, dataSource, gestureTreshold);
    };
    
    Slide.prototype = {
        init: function (slideHandlers, el, dataSource, gestureTreshold) {
            this.slideHandlers = slideHandlers;
            this.dataSource = dataSource;
            this.__initPaging(el);
            this.__checkEnable3D();
            this.__createSlide();
            this.__resize();
            this.__bindEvent(gestureTreshold);
        },
        __checkEnable3D: function () {
            var ua = navigator.userAgent.toLowerCase();
            
            if (ua.indexOf('android') > -1) {
                var tempUa = ua.split(" android ")[1];
                var version = tempUa.substring(0, tempUa.indexOf(";")).split(".");
                if (parseInt(version[0]) > 2 || (parseInt(version[0]) === 2 && parseInt(version[1]) >= 3)) {
                    this.enableTransform = true;
                } else {
                    this.enableTransform = false;
                }
            } else if (ua.indexOf('applewebkit') > -1 ) {
                this.enableTransform = true;
            } else {
                this.enableTransform = false;
            }
        },
        __initPaging: function (el) {
            this.page = 0;
            this.offset = 0;
            this.dataDirect = "";
            this.translate = true;
            this.wrapper = (typeof(el) === "string")? document.getElementById(el) : el;
        },
        __setInitData: function (num) {
            var loadedInitData = this.dataSource.getInitData(num);
            var data = '';
            for (var i=0; i< 3; i++) {
                if (loadedInitData[i].type !== "invalid") {
                    data = loadedInitData[i].data;
                    if (this.slideHandlers.onSetDataItem) {
                        data = this.slideHandlers.onSetDataItem(data);
                    }
                    this.panels[i].innerHTML = data;
                }
            }
        },
        __createPanelStyle: function () {
            var enableStr = this.enableTransform ? '-webkit-transform:translate3d(0,0,0);' : '';
            return 'height: 100%;overflow:hidden;display:inline-block;'+ enableStr + 'width:'+this.pageWidth +'px;';
        },
        __createSlide: function () {
            this.pageWidth = this.wrapper.clientWidth;
            var panelString = '<div class="panel" style="' + this.__createPanelStyle() + '"></div>';
            this.wrapper.innerHTML = '<div class="slide" id="slide-'+__slideIndex+'" style="overflow:hidden;position:relative;top:0;transform:translate3d(0,0,0);'
                                    + 'left:'+(-this.pageWidth)+'px;width:'+(this.pageWidth * 3)+'px;">' 
                                    + panelString + panelString + panelString + '</div>'; 
            this.el = document.getElementById("slide-"+__slideIndex);
            this.panels = this.el.getElementsByClassName("panel");
        },
        __bindEvent: function (gestureTreshold) {
            var resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize',
                listener = gesture.GestureListener(this.el, gestureTreshold),
                self = this;
    
            listener.onGestureStart(function(session){return self.__start.call(self, session)});
            listener.onGestureMove(function(session){return self.__move.call(self, session)});
            listener.onGestureEnd(function(session){return self.__end.call(self, session)});
            
            window.addEventListener(resizeEvent, function(){return self.__checkChangeValueByResize.call(self);});
            if (this.enableTransform) {
                this.el.addEventListener("webkitTransitionEnd", function(){return self.__setData.call(self);});
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
            this.pageWidth = this.wrapper.clientWidth;
            this.pageHeight = this.wrapper.clientHeight;
            for (var i=0;i<3;i++) {
                this.panels[i].style.width = '' + this.pageWidth + 'px';
            }
            this.el.style.width = '' + (this.pageWidth*3) + 'px';
            this.el.style.left = '' + (-this.pageWidth) + 'px';
            this.__addExternalFunction(this.slideHandlers.onResize);
        },
        __start: function (session) {
            this.__setTransitionDuration('0ms');
            this.isScrolling = false;
            this.__addExternalFunction(this.slideHandlers.onSlideStart, session);
        },
        __move: function (session) {
            if (this.translate) {
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
            var duration = Math.abs(parseInt(session.getTerm()*this.pageWidth/session.delta.x));
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
            if (session.isLeft() && (this.__isNextThreshold(session) || session.isFlick())) {
                return true;
            } else {
                return false;
            }
        },
        __isNextThreshold: function (session) {
            if (this.el.clientWidth * -1 * SLIDE_TRESHOLD > session.delta.x) {
                return true;
            } else {
                return false;
            }
        },
        __isPrevSwipe: function (session) {
            if (session.isRight() && (this.__isPrevThreshold(session) || session.isFlick())) {
                return true;
            } else {
                return false;
            }
        },
        __isPrevThreshold: function (session) {
            if (this.el.clientWidth * SLIDE_TRESHOLD < session.delta.x) {
                return true;
            } else {
                return false;
            }
        },
        __next: function (duration) {
            this.loadedData = this.dataSource.getNextData();
            if (this.loadedData.type === "invalid") {
                this.__cancel(duration);
            } else {
                this.__setTransitionDuration(duration);
                this.__plusPageOffset();
                this.dataDirect = "next";
                this.translate = false;
                this.__pos(-this.pageWidth);
                if (!this.enableTransform) {
                    this.__setData();
                }
            }
        },
        __setData: function () {
            if (this.dataDirect === "next") {
                this.el.removeChild(this.panels[0]);
                this.__setTransitionDuration(0);
                this.__pos(0);
                this.el.appendChild(this.__setDataItem(this.loadedData.data));
                this.__addExternalFunction(this.slideHandlers.onSlideNext);
            } else if (this.dataDirect === "prev") {
                this.el.removeChild(this.panels[2]);
                this.__setTransitionDuration(0);
                this.__pos(0);
                this.el.insertBefore(this.__setDataItem(this.loadedData.data), this.panels[0]);
                this.__addExternalFunction(this.slideHandlers.onSlidePrev);
            }
            this.dataDirect = "";
            this.translate = true; 
        },
        __prev: function (duration) {
            this.loadedData = this.dataSource.getPrevData();
            if (this.loadedData.type === "invalid") {
                this.__cancel(duration);
            } else {
                this.__setTransitionDuration(duration);
                this.__minusPageOffset();
                this.dataDirect = "prev";
                this.translate = false;
                this.__pos(this.pageWidth);
                if (!this.enableTransform) {
                    this.__setData();
                }
            }
        },
        __setDataItem: function (loadedData) {
            if (this.slideHandlers.onSetDataItem) {
                loadedData = this.slideHandlers.onSetDataItem(loadedData);
            }
            var panel = document.createElement("div");
            panel.className = "panel";
            panel.style.cssText = this.__createPanelStyle();
            panel.innerHTML = loadedData;
            
            return panel
        },
        __plusPageOffset: function () {
            this.page++;
            var len = this.panels.length;
            this.offset++;
            if (this.offset > len - 1) {
                this.offset = 0;
            }
        },
        __minusPageOffset: function () {
            this.page--;
            var len = this.panels.length;
            this.offset--;
            if (this.offset < 0) {
                this.offset = len - 1;
            }
        },
        __cancel: function (duration) {
            this.__setTransitionDuration(duration);
            this.__pos(0);
            this.__addExternalFunction(this.slideHandlers.onSlideCancel);
        },
        __addExternalFunction: function (fn, session) {
            if (fn) {
                fn(session);
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
            };
        var slide = new Slide(slideHandlers, el, dataSourece, gestureTreshold);
        __slideIndex++;
    
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
    
    exports.slideListener = slideListener;
})(window.slide = {});

(function (exports) {
    var DataSource = function (dataHandlers, isIterating, loadIndex) {
        this.init(dataHandlers, isIterating, loadIndex);
    };
    DataSource.prototype = {
        init: function (dataHandlers, isIterating, loadIndex) {
            this.dataHandlers = dataHandlers;
            this.isIterating = isIterating || false;
            this.loadIndex = loadIndex || 0;
            this.dataList = [];
        },
        addData: function (data) {
            this.dataList.push(data);
        },
        addDataList: function (dataList) {
            this.dataList = this.dataList.concat(dataList);
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
                } while (index < 0)
            } else if (index >= len) {
                do {
                    index = index - len;
                } while (index >= len)
            } 
            return index;
        },
        getCurrentData: function () {
            return this.getDataByIndex(this.currentIndex);
        },
        getPrevData: function () {
            var dataInfo = this.getDataByIndex(this.getPrevIndex());
            
            if (dataInfo.type !== "invalid") {
                this.currentIndex--;    
            } 
            return dataInfo;    
        },
        getNextData: function () {
            var dataInfo = this.getDataByIndex(this.getNextIndex());
            if (dataInfo.type !== "invalid") {
                this.currentIndex++;    
                if (this.checkLoadingData()) {
                    this.requestData();
                }
            } 
            return dataInfo;
        },
        checkLoadingData: function () {
            if (this.loadIndex !== 0 && this.loadIndex === this.getDataListLength() - this.currentIndex) {
                return true;
            } else {
                return false;
            }
        },
        getPrevIndex: function () {
            return this.currentIndex - 2;
        },
        getNextIndex: function () {
            return this.currentIndex + 2;
        },
        getInitData: function (index) {
            var dataArr = [];
            this.currentIndex = index;
            dataArr.push(this.getDataByIndex(index - 1));
            dataArr.push(this.getDataByIndex(index));
            dataArr.push(this.getDataByIndex(index + 1));
            
            return dataArr;
        },
        requestData: function (options) {
            if (this.dataHandlers.requestDataHandler) {
                this.dataHandlers.requestDataHandler(options);
            } else {
                this.responseData(options.data);
            }
        },
        responseData: function (data) {
            var dataList = this.parseData(data);
            this.addDataList(dataList);
            if (this.dataHandlers.dataLoadEndHandler) {
                this.dataHandlers.dataLoadEndHandler();
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
    
    function dataSourceListener (isIterating, loadIndex) {
        var dataHandlers = {
                parseDataHandler : null,
                requestDataHandler : null,
                dataLoadEndHandler : null
        };
        var dataSource = new DataSource(dataHandlers, isIterating, loadIndex);
        
        return {
            addDataList: function (dataArr) {
                dataSource.addDataList(dataArr);
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
            onParseData: function (fn) {
                dataHandlers.parseDataHandler = fn;
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
            getCurrentIndex: function () {
                return dataSource.__iterationIndexing(dataSource.currentIndex);
            }
        }
    }
    
    exports.listener = dataSourceListener;
})(window.slideDataSource = {});
