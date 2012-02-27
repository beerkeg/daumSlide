var Slide = function(el, gestureTreshold) {
	this.init(el, gestureTreshold);
};

Slide.prototype = {
	init: function (el, gestureTreshold) {
		this.x = 0;
		var listener = gesture.GestureListener(document.getElementById(el), gestureTreshold);
		
		var self = this;
		listener.onGestureStart(function(session){return this.__start.call(self, session)});
		listener.onGestureMove(function(session){return this.__move.call(self, session)});
		listener.onGestureEnd(function(session){return this.__end.call(self, session)});
	},
	__start: function (session) {
		
	},
	__move: function (session) {
		var newX = this.x + session.delta.x;
		this.__pos(newX);
	},
	__end: function (session) {
		
	},
	__pos: function (x) {
		this.x = x;
		this.el.style.webkitTransform = 'translate3d(' + x + 'px,0,0)';
	}
		
		
		
};