(function(d){var c=30;var b=200;function g(j,i){this.type="unindentified";this.direction="unindentified";
this.startPos=a(j,i);this.delta=a(0,0);this.targetEvent=null;this.flickState=false;this.startTime=new Date()
}g.prototype={};g.prototype.isSwipe=function(){return this.type==="swipe"};g.prototype.isScroll=function(){return this.type==="scroll"
};g.prototype.isLeft=function(){return this.direction==="left"};g.prototype.isRight=function(){return this.direction==="right"
};g.prototype.isUp=function(){return this.direction==="up"};g.prototype.isDown=function(){return this.direction==="down"
};g.prototype.isFlick=function(){return this.flickState};g.prototype.identifyWithCurrentPos=function(i,l){var j=a(i,l);
var k=this.delta=j.minus(this.startPos);if(this.type==="unindentified"){if(Math.abs(k.x)>c&&Math.abs(k.x)>=Math.abs(k.y)){this.type="swipe";
if(k.x<0){this.direction="left"}else{this.direction="right"}}else{if(Math.abs(k.y)>c&&Math.abs(k.y)>Math.abs(k.x)){this.type="scroll";
if(k.y<0){this.direction="up"}else{this.direction="down"}}}}};g.prototype.checkFlick=function(){var i=new Date-this.startTime;
if(i<b){this.flickState=true}else{this.flickState=false}};function a(i,j){return{x:i,y:j,minus:function(k){return a(this.x-k.x,this.y-k.y)
}}}function e(i){return(document.addEventListener)?i:"on"+i}var h={START:function(){return("ontouchstart" in window)?"touchstart":e("mousedown")
}(),MOVE:function(){return("ontouchstart" in window)?"touchmove":e("mousemove")}(),END:function(){return("ontouchstart" in window)?"touchend":e("mouseup")
}(),listen:function(){if(document.addEventListener){return function(k,j,i){k.addEventListener(j,function(l){i.call(k,l)
},false)}}else{return function(k,j,i){k.attachEvent(j,function(){i.call(k,window.event)})}}}(),getX:function(j){var i=j.touches?j.touches[0]:j;
return i.pageX||i.clientX},getY:function(j){var i=j.touches?j.touches[0]:j;return i.pageY||i.clientY}};
function f(k,i,m){var l=null;if(i){if(typeof i==="number"){c=i}else{throw new Error("gestureThreshold must be a number")
}}if(m){if(typeof m==="number"){b=m}else{throw new Error("flickThreshold must be a number")}}var j={onGestureStart:null,onGestureMove:null,onGetstureEnd:null};
h.listen(k,h.START,function(n){l=new g(h.getX(n),h.getY(n));l.targetEvent=n;if(j.onGestureStart){j.onGestureStart(l)
}});h.listen(k,h.MOVE,function(n){if(l){l.identifyWithCurrentPos(h.getX(n),h.getY(n));l.targetEvent=n;
if(j.onGestureMove){j.onGestureMove(l)}}});h.listen(k,h.END,function(n){if(l){l.checkFlick();l.targetEvent=n;
if(j.onGestureEnd){j.onGestureEnd(l)}l=null}});return{onGestureStart:function(n){j.onGestureStart=n},onGestureMove:function(n){j.onGestureMove=n
},onGestureEnd:function(n){j.onGestureEnd=n}}}d.GestureListener=f;d.GestureSession=g;d.EventUtil=h})(window.gesture={});