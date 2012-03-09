(function (exports) {
	var SLIDE_TRESHOLD = 0.2;
	var SLIDE_DATA_LIST = [];

	var __slideIndex = 0;
	
	var Slide = function(slideHandlers, el, dataSource, gestureTreshold) {
		this.init(slideHandlers, el, dataSource, gestureTreshold);
	};
	
	Slide.prototype = {
		init: function (slideHandlers, el, dataSource, gestureTreshold) {
			this.slideHandlers = slideHandlers;
			this.dataSource = dataSource;
			this.__initPaging();

			this.__createSlide(el);
			this.__setInitData();
			
			this.__resize();
			this.__bindEvent(gestureTreshold);
		},
		__initPaging: function () {
			this.page = 0;
			this.offset = 0;
		},
		__setInitData: function () {
			var loadedInitData = this.dataSource.getInitData(0);
			
			for (var i=0; i< 3; i++) {
				if (loadedInitData[i].type !== "invalid") {
					this.__setDataItem(i, loadedInitData[i].data);
				}
			}
		},
		__createSlide: function (el) {
			var wrapper = (typeof(el) === "string")? document.getElementById(el) : el;
			wrapper.innerHTML = '<div class="slide" id="slider-'+__slideIndex+'" style="width:100%;height: 100%;position: relative;top:0;"><div class="panel" style="left:0%"></div><div class="panel" style="left:100%"></div><div class="panel" style="left:-100%"></div></div>' + 
								'<button type="button" class="prevBtn">prev</button>' +
								'<button type="button" class="nextBtn">next</button>';
			
			this.el = document.getElementById("slider-"+__slideIndex);
			this.panels = this.el.getElementsByClassName("panel");
		},
		__bindEvent: function (gestureTreshold) {
			var resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize',
				listener = gesture.GestureListener(this.el, gestureTreshold),
				self = this;
	
			listener.onGestureStart(function(session){return self.__start.call(self, session)});
			listener.onGestureMove(function(session){return self.__move.call(self, session)});
			listener.onGestureEnd(function(session){return self.__end.call(self, session)});
			
			window.addEventListener(resizeEvent, function(){return self.__resize.call(self);});
		},
		__resize: function () {
			this.pageWidth = this.el.clientWidth;
			this.__pos(-this.page * this.pageWidth);
		},
		__start: function (session) {
			this.el.style.webkitTransitionDuration = '0';
			this.isScrolling = false;
			this.__addExternalFunction(this.slideHandlers.onSlideStart);
		},
		__move: function (session) {
			if (session.isSwipe() && !this.isScrolling) {
				session.targetEvent.preventDefault();
				this.__pos(-this.page*this.pageWidth + session.delta.x);
				this.__addExternalFunction(this.slideHandlers.onSlideMove);
			} else if (session.isScroll()) {
				this.isScrolling = true; 
			}
		},
		__end: function (session) {
			if (this.__isNextSwipe(session)) {
				this.__next();
			} else if (this.__isPrevSwipe(session)) {
				this.__prev();
			} else {
				this.__cancel();
			}
			this.__addExternalFunction(this.slideHandlers.onSlideEnd);
		},
		__pos: function (x) {
			this.el.style.webkitTransform = 'translate3d('+ x +'px,0,0)';
		},
		__isNextSwipe: function (session) {
			if (session.isLeft() && (this.el.clientWidth * -1 * SLIDE_TRESHOLD > session.delta.x)) {
				return true;
			} else {
				return false;
			}
		},
		__isPrevSwipe: function (session) {
			if (session.isRight() && (this.el.clientWidth * SLIDE_TRESHOLD < session.delta.x)) {
				return true;
			} else {
				return false;
			}
		},
		__next: function () {
			var loadedData = this.dataSource.getNextData();
			if (loadedData.type === "invalid") {
				this.__cancel();
			} else {
				this.el.style.webkitTransitionDuration = '500ms';
				this.__plusPageOffset();
				this.__pos(-this.page * this.pageWidth);
				var movingOffset = this.__getNextOffsetOfMovingPanel();
				this.__movePanel(this.page+1, movingOffset);
				this.__setDataItem(movingOffset, loadedData.data);
				this.__addExternalFunction(this.slideHandlers.onSlideNext);
			}
		},
		__prev: function () {
			var loadedData = this.dataSource.getPrevData();
			if (loadedData.type === "invalid") {
				this.__cancel();
			} else {
				this.el.style.webkitTransitionDuration = '500ms';
				this.__minusPageOffset();
				this.__pos(-this.page * this.pageWidth);
				var movingOffset = this.__getPrevOffsetOfMovingPanel();
				this.__movePanel(this.page-1, movingOffset);
				this.__setDataItem(movingOffset, loadedData.data);
				this.__addExternalFunction(this.slideHandlers.onSlidePrev);
			}
		},
		__setDataItem: function (movingOffset, loadedData) {
			this.panels[movingOffset].innerHTML = loadedData;
		},
		__getNextOffsetOfMovingPanel: function () {
			var len =  this.panels.length,
				value = this.offset + parseInt(len/2);
	
			if (value >= len) {
				value = value - len;
			}
			return value;
		},
		__getPrevOffsetOfMovingPanel: function () {
			var len =  this.panels.length,
				value = this.offset - parseInt(len/2);
	
			if (value < 0) {
				value = value + len;
			}
			return value;
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
		__movePanel: function (movingPage, movingOffset) {
			this.panels[movingOffset].style.left = movingPage * 100 + "%";
		},
		__cancel: function () {
			this.el.style.webkitTransitionDuration = '500ms';
			this.__pos(-this.page * this.pageWidth);
			this.__addExternalFunction(this.slideHandlers.onSlideCancel);
		},
		__addExternalFunction: function (fn) {
			if (fn) {
				fn();
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
	            'onSlideCancel': null
	        };
		var slide = new Slide(slideHandlers, el, dataSourece, gestureTreshold);
		__slideIndex++;
	
		return {
			setSlideDataList: function (dataList) {
				SLIDE_DATA_LIST = dataList;
				slide.__setData();
			},
			addSlideData: function (data) {
				SLIDE_DATA_LIST.push(data);
				slide.__loadData();
			},
			initSlidePaging: function () {
				slide.__initPaging();
			},
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
            nextSlide: function () {
            	slide.__next();
            },
            prevSlide: function () {
            	slide.__prev();
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
			dataArr.push(this.getDataByIndex(index));
			dataArr.push(this.getDataByIndex(index + 1));
			dataArr.push(this.getDataByIndex(index - 1));
			
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
			}
		}
	}
	
	exports.listener = dataSourceListener;
})(window.slideDataSource = {});
