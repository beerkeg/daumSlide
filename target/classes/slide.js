(function (exports) {
	var SLIDE_TRESHOLD = 0.2;
	
	var Slide = function(el, gestureTreshold, slideHandlers) {
		this.init(el, gestureTreshold, slideHandlers);
	};
	
	Slide.prototype = {
		init: function (el, gestureTreshold, slideHandlers) {
			this.page = 0;
			this.offset = 0;
			this.el = (typeof(el) === "string")? document.getElementById(el) : el;
	
			this.pageWidth = el.clientWidth;
			this.pages = Array.prototype.slice.call(el.getElementsByClassName("panel"));
			this.slideHandlers = slideHandlers;
			this.__bindEvent(gestureTreshold);
			this.isScrolling = false;

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
	
			if (this.__isNextSwipe(session)) {
				this.__next();
			} else if (this.__isPrevSwipe(session)) {
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
			this.__pulsPageOffset();
			this.__pos(-this.page * this.pageWidth);
			this.__movePageTool(this.page+1, this.__getNextOffsetOfMovingPanel());
			if (this.slideHandlers.onSlideNext) {
				this.slideHandlers.onSlideNext();
			}
		},
		__prev: function () {
			this.__minusPageOffset();
			this.__pos(-this.page * this.pageWidth);
			this.__movePageTool(this.page-1, this.__getPrevOffsetOfMovingPanel());
			if (this.slideHandlers.onSlidePrev) {
				this.slideHandlers.onSlidePrev();
			}
		},
		__getNextOffsetOfMovingPanel: function () {
			var len =  this.pages.length,
				value = this.offset + parseInt(len/2);
	
			if (value >= len) {
				value = value - len;
			}
			return value;
		},
		__getPrevOffsetOfMovingPanel: function () {
			var len =  this.pages.length,
				value = this.offset - parseInt(len/2);
	
			if (value < 0) {
				value = value + len;
			}
			return value;
		},
		__pulsPageOffset: function () {
			this.page++;
			var len = this.pages.length;
			this.offset++;
			if (this.offset > len - 1) {
				this.offset = 0;
			}
		},
		__minusPageOffset: function () {
			this.page--;
			var len = this.pages.length;
			this.offset--;
			if (this.offset < 0) {
				this.offset = len - 1;
			}
		},
		__movePageTool: function (movingPage, movingOffset) {
			this.pages[movingOffset].style.left = movingPage * 100 + "%";
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
            }
		};
	}
	
	exports.slideListener = slideListener;
})(window.slide = {});