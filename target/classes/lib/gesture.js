(function(c){var b=30;function e(g,f){this.type="unindentified";this.direction="unindentified";this.startPos=a(g,f);
this.delta=a(0,0);this.targetEvent=null}e.prototype={};e.prototype.isSwipe=function(){return this.type==="swipe"
};e.prototype.isScroll=function(){return this.type==="scroll"};e.prototype.isLeft=function(){return this.direction==="left"
};e.prototype.isRight=function(){return this.direction==="right"};e.prototype.isUp=function(){return this.direction==="up"
};e.prototype.isDown=function(){return this.direction==="down"};e.prototype.identifyWithCurrentPos=function(f,i){var g=a(f,i);
var h=this.delta=g.minus(this.startPos);if(this.type==="unindentified"){if(Math.abs(h.x)>b&&Math.abs(h.x)>=Math.abs(h.y)){this.type="swipe";
if(h.x<0){this.direction="left"}else{this.direction="right"}}else{if(Math.abs(h.y)>b&&Math.abs(h.y)>Math.abs(h.x)){this.type="scroll";
if(h.y<0){this.direction="up"}else{this.direction="down"}}}}};function a(f,g){return{x:f,y:g,minus:function(h){return a(this.x-h.x,this.y-h.y)
}}}function d(h,f){var k=null;var j="ontouchstart" in window,i=j?"touchstart":"mousedown",g=j?"touchmove":"mousemove",m=j?"touchend":"mouseup",n=f||30;
var l={onGestureStart:null,onGestureMove:null,onGetstureEnd:null};h.addEventListener(i,function(p){var o=j?p.touches[0]:p;
k=new e(o.pageX,o.pageY);k.targetEvent=p;if(l.onGestureStart){l.onGestureStart(k)}},false);h.addEventListener(g,function(p){if(k){var o=j?p.touches[0]:p;
k.identifyWithCurrentPos(o.pageX,o.pageY);k.targetEvent=p;if(l.onGestureMove){l.onGestureMove(k)}}},false);
h.addEventListener(m,function(o){if(k){k.targetEvent=o;if(l.onGestureEnd){l.onGestureEnd(k)}k=null}},false);
return{onGestureStart:function(o){l.onGestureStart=o},onGestureMove:function(o){l.onGestureMove=o},onGestureEnd:function(o){l.onGestureEnd=o
}}}c.GestureListener=d})(window.gesture={});