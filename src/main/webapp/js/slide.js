(function (exports) {
	var SLIDE_TRESHOLD = 0.2;
	
	var Slide = function(el, gestureTreshold, gestureHandlers) {
		this.init(el, gestureTreshold, gestureHandlers);
	};
	
	Slide.prototype = {
		init: function (el, gestureTreshold, gestureHandlers) {
			this.page = 0;
			this.offset = 0;
			this.el = (typeof(el) === "string")? document.getElementById(el) : el;
	
			this.pageWidth = el.clientWidth;
			this.pages = Array.prototype.slice.call(el.getElementsByClassName("panel"));
			this.gestureHandlers = gestureHandlers;
			this.__bindEvent(gestureTreshold);
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
			session.targetEvent.preventDefault();
			this.pointX = session.startPos.x;
			this.el.style.webkitTransitionDuration = '0';
			if (this.gestureHandlers.onSlideStart) {
				this.gestureHandlers.onSlideStart();
			}
		},
		__move: function (session) {
			if (session.isSwipe()) {
				session.targetEvent.preventDefault();
				this.__pos(-this.page*this.pageWidth + session.delta.x);
				if (this.gestureHandlers.onSlideMove) {
					this.gestureHandlers.onSlideMove();
				}
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
			if (this.gestureHandlers.onSlideEnd) {
				this.gestureHandlers.onSlideEnd();
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
			if (this.gestureHandlers.onSlideNext) {
				this.gestureHandlers.onSlideNext();
			}
		},
		__prev: function () {
			this.__minusPageOffset();
			this.__pos(-this.page * this.pageWidth);
			this.__movePageTool(this.page-1, this.__getPrevOffsetOfMovingPanel());
			if (this.gestureHandlers.onSlidePrev) {
				this.gestureHandlers.onSlidePrev();
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
			if (this.gestureHandlers.onSlideCancel) {
				this.gestureHandlers.onSlideCancel();
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