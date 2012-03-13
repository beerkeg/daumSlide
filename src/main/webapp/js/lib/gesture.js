(function(c){var b=200;function f(j,i,h){this.type="unindentified";this.direction="unindentified";this.startPos=a(j,i);
this.delta=a(0,0);this.targetEvent=null;this.term=0;this.startTime=new Date();if(typeof h==="number"){this.gestureThreshold=h
}else{this.gestureThreshold=30}}f.prototype={};f.prototype.isSwipe=function(){return this.type==="swipe"
};f.prototype.isScroll=function(){return this.type==="scroll"};f.prototype.isLeft=function(){return this.direction==="left"
};f.prototype.isRight=function(){return this.direction==="right"};f.prototype.isUp=function(){return this.direction==="up"
};f.prototype.isDown=function(){return this.direction==="down"};f.prototype.isFlick=function(){return this.term<200?true:false
};f.prototype.getTerm=function(){return this.term};f.prototype.identifyWithCurrentPos=function(h,k){var i=a(h,k);
var j=this.delta=i.minus(this.startPos);if(this.type==="unindentified"){if(Math.abs(j.x)>this.gestureThreshold&&Math.abs(j.x)>=Math.abs(j.y)){this.type="swipe";
if(j.x<0){this.direction="left"}else{this.direction="right"}}else{if(Math.abs(j.y)>this.gestureThreshold&&Math.abs(j.y)>Math.abs(j.x)){this.type="scroll";
if(j.y<0){this.direction="up"}else{this.direction="down"}}}}};f.prototype.checkFlick=function(){this.term=new Date-this.startTime
};function a(h,i){return{x:h,y:i,minus:function(j){return a(this.x-j.x,this.y-j.y)}}}function d(h){return(document.addEventListener)?h:"on"+h
}var g={START:function(){return("ontouchstart" in window)?"touchstart":d("mousedown")}(),MOVE:function(){return("ontouchstart" in window)?"touchmove":d("mousemove")
}(),END:function(){return("ontouchstart" in window)?"touchend":d("mouseup")}(),listen:function(){if(document.addEventListener){return function(j,i,h){j.addEventListener(i,function(k){h.call(j,k)
},false)}}else{return function(j,i,h){j.attachEvent(i,function(){h.call(j,window.event)})}}}(),getX:function(i){var h=i.touches?i.touches[0]:i;
return h.pageX||h.clientX},getY:function(i){var h=i.touches?i.touches[0]:i;return h.pageY||h.clientY}};
function e(j,h,l){var k=null;if(h){if(typeof h!=="number"){throw new Error("gestureThreshold must be a number")
}}if(l){if(typeof l==="number"){b=l}else{throw new Error("flickThreshold must be a number")}}var i={onGestureStart:null,onGestureMove:null,onGetstureEnd:null};
g.listen(j,g.START,function(m){k=new f(g.getX(m),g.getY(m),h);k.targetEvent=m;if(i.onGestureStart){i.onGestureStart(k)
}});g.listen(j,g.MOVE,function(m){if(k){k.identifyWithCurrentPos(g.getX(m),g.getY(m));k.targetEvent=m;
if(i.onGestureMove){i.onGestureMove(k)}}});g.listen(j,g.END,function(m){if(k){k.checkFlick();k.targetEvent=m;
if(i.onGestureEnd){i.onGestureEnd(k)}k=null}});return{onGestureStart:function(m){i.onGestureStart=m},onGestureMove:function(m){i.onGestureMove=m
},onGestureEnd:function(m){i.onGestureEnd=m}}}c.GestureListener=e;c.GestureSession=f;c.EventUtil=g})(window.gesture={});