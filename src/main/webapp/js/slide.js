(function (exports) {
	var SLIDE_TRESHOLD = 0.2;
	var SLIDE_DATA_LIST = [];

	var __slideIndex = 0;
	
	var Slide = function(el, gestureTreshold, slideHandlers) {
		this.init(el, gestureTreshold, slideHandlers);
	};
	
	Slide.prototype = {
		init: function (el, gestureTreshold, slideHandlers) {
			this.page = 0;
			this.loof = false;
			this.offset = 0;
			this.slideHandlers = slideHandlers;
			this.isScrolling = false;
			
			this.__createSlide(el);
			this.__setData();
			
			this.__resize();
			this.__bindEvent(gestureTreshold);
		},
		__setData: function () {
			var dataListLen = SLIDE_DATA_LIST.length;
			this.panels[0].innerHTML = SLIDE_DATA_LIST[this.page] || '';
			this.panels[1].innerHTML = SLIDE_DATA_LIST[this.page+1] || '';
			if (this.loof) {
				this.panels[2].innerHTML = SLIDE_DATA_LIST[(this.page-1 >= 0)? this.page-1 : dataListLen-1] || '';
			} else {
				this.panels[2].innerHTML = '';
			}
		},
		__createSlide: function (el) {
			var wrapper = (typeof(el) === "string")? document.getElementById(el) : el;
			wrapper.innerHTML = '<div class="slide" id="slider-'+__slideIndex+'" style="width:100%;height: 100%;position: relative;top:0;"><div class="panel" style="left:0%;"></div><div class="panel" style="left:100%;"></div><div class="panel" style="left:-100%;"></div></div>';
			
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
			this.pointX = session.startPos.x;
			this.el.style.webkitTransitionDuration = '0';
			if (this.slideHandlers.onSlideStart) {
				this.slideHandlers.onSlideStart();
			}
		},
		__move: function (session) {
			if (session.isSwipe() && !this.isScrolling) {
				session.targetEvent.preventDefault();
				this.__pos(-this.page*this.pageWidth + session.delta.x);
				if (this.slideHandlers.onSlideMove) {
					this.slideHandlers.onSlideMove();
				}
			} else if (session.isScroll()) {
				this.isScrolling = true; 
			}
		},
		__end: function (session) {
			this.el.style.webkitTransitionDuration = '500ms';
	
			if (this.__isNextSwipe(session) && (this.loof || this.page < SLIDE_DATA_LIST.length-1)) {
				this.__next();
			} else if (this.__isPrevSwipe(session) && (this.loof || this.page > 0)) {
				this.__prev();
			} else {
				this.__cancel();
			}
			this.isScrolling = false;
			if (this.slideHandlers.onSlideEnd) {
				this.slideHandlers.onSlideEnd();
			}
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
			this.__plusPageOffset();
			this.__pos(-this.page * this.pageWidth);
			this.__movePanel(this.page+1, this.__getNextOffsetOfMovingPanel());
			this.__loadData();
			if (this.slideHandlers.onSlideNext) {
				this.slideHandlers.onSlideNext();
			}
		},
		__prev: function () {
			this.__minusPageOffset();
			this.__pos(-this.page * this.pageWidth);
			this.__movePanel(this.page-1, this.__getPrevOffsetOfMovingPanel());
			this.__loadData();
			if (this.slideHandlers.onSlidePrev) {
				this.slideHandlers.onSlidePrev();
			}
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
			this.movingPage = movingPage;
			this.movingOffset = movingOffset;
		},
		__loadData: function () {
			if (typeof this.movingOffset !== 'undefined') {
				var dataOffset;
				var dataListLen = SLIDE_DATA_LIST.length;
	
				if (this.loof && this.movingPage < 0) {
					dataOffset = this.movingPage % dataListLen;
					if (dataOffset !== 0) {
						dataOffset = dataListLen + dataOffset;
					}
				} else if (this.loof && this.movingPage >= dataListLen) {
					dataOffset = this.movingPage % dataListLen;
				} else {
					dataOffset = this.movingPage;
				}
				this.panels[this.movingOffset].innerHTML = SLIDE_DATA_LIST[dataOffset] || "";
			}
		},
		__cancel: function () {
			this.__pos(-this.page * this.pageWidth);
			if (this.slideHandlers.onSlideCancel) {
				this.slideHandlers.onSlideCancel();
			}
		}
	};
	
	function slideListener (el, gestureTreshold) {
		var slideHandlers = {
	            'onSlideStart': null,
	            'onSlideMove': null,
	            'onSlideEnd': null,
	            'onSlidePrev': null,
	            'onSlideNext': null,
	            'onSlideCancel': null
	        };
		var slide = new Slide(el, gestureTreshold, slideHandlers);
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
            }
		};
	}
	
	exports.slideListener = slideListener;
    exports.Slide = Slide;
})(window.slide = {});