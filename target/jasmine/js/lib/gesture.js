(function(c){var b=30;function f(h,g){this.type="unindentified";this.direction="unindentified";this.startPos=a(h,g);
this.delta=a(0,0);this.targetEvent=null}f.prototype={};f.prototype.isSwipe=function(){return this.type==="swipe"
};f.prototype.isScroll=function(){return this.type==="scroll"};f.prototype.isLeft=function(){return this.direction==="left"
};f.prototype.isRight=function(){return this.direction==="right"};f.prototype.isUp=function(){return this.direction==="up"
};f.prototype.isDown=function(){return this.direction==="down"};f.prototype.identifyWithCurrentPos=function(g,j){var h=a(g,j);
var i=this.delta=h.minus(this.startPos);if(this.type==="unindentified"){if(Math.abs(i.x)>b&&Math.abs(i.x)>=Math.abs(i.y)){this.type="swipe";
if(i.x<0){this.direction="left"}else{this.direction="right"}}else{if(Math.abs(i.y)>b&&Math.abs(i.y)>Math.abs(i.x)){this.type="scroll";
if(i.y<0){this.direction="up"}else{this.direction="down"}}}}};function a(g,h){return{x:g,y:h,minus:function(i){return a(this.x-i.x,this.y-i.y)
}}}var e=(function(){if(document.addEventListener){return function(i,h,g){i.addEventListener(h,g,false)
}}else{return function(i,h,g){i.attachEvent("on"+h,g)}}})();function d(i,g){var l=null;var k="ontouchstart" in window,j=k?"touchstart":"mousedown",h=k?"touchmove":"mousemove",n=k?"touchend":"mouseup",o=g||30;
var m={onGestureStart:null,onGestureMove:null,onGetstureEnd:null};e(i,j,function(r){var q=r||window.event;
var p=k?q.touches[0]:q;l=new f(p.pageX||p.clientX,p.pageY||p.clientY);l.targetEvent=q;if(m.onGestureStart){m.onGestureStart(l)
}},false);e(i,h,function(r){if(l){var q=r||window.event;var p=k?q.touches[0]:q;l.identifyWithCurrentPos(p.pageX||p.clientX,p.pageY||p.clientY);
l.targetEvent=q;if(m.onGestureMove){m.onGestureMove(l)}}},false);e(i,n,function(q){if(l){var p=q||window.event;
l.targetEvent=p;if(m.onGestureEnd){m.onGestureEnd(l)}l=null}},false);return{onGestureStart:function(p){m.onGestureStart=p
},onGestureMove:function(p){m.onGestureMove=p},onGestureEnd:function(p){m.onGestureEnd=p}}}c.GestureListener=d
})(window.gesture={});