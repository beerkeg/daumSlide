(function(c){var b=30;function f(i,h){this.type="unindentified";this.direction="unindentified";this.startPos=a(i,h);
this.delta=a(0,0);this.targetEvent=null}f.prototype={};f.prototype.isSwipe=function(){return this.type==="swipe"
};f.prototype.isScroll=function(){return this.type==="scroll"};f.prototype.isLeft=function(){return this.direction==="left"
};f.prototype.isRight=function(){return this.direction==="right"};f.prototype.isUp=function(){return this.direction==="up"
};f.prototype.isDown=function(){return this.direction==="down"};f.prototype.identifyWithCurrentPos=function(h,k){var i=a(h,k);
var j=this.delta=i.minus(this.startPos);if(this.type==="unindentified"){if(Math.abs(j.x)>b&&Math.abs(j.x)>=Math.abs(j.y)){this.type="swipe";
if(j.x<0){this.direction="left"}else{this.direction="right"}}else{if(Math.abs(j.y)>b&&Math.abs(j.y)>Math.abs(j.x)){this.type="scroll";
if(j.y<0){this.direction="up"}else{this.direction="down"}}}}};function a(h,i){return{x:h,y:i,minus:function(j){return a(this.x-j.x,this.y-j.y)
}}}function d(h){return(document.addEventListener)?h:"on"+h}var g={START:function(){return("ontouchstart" in window)?"touchstart":d("mousedown")
}(),MOVE:function(){return("ontouchstart" in window)?"touchmove":d("mousemove")}(),END:function(){return("ontouchstart" in window)?"touchend":d("mouseup")
}(),listen:function(){if(document.addEventListener){return function(j,i,h){j.addEventListener(i,function(k){h.call(j,k)
},false)}}else{return function(j,i,h){j.attachEvent(i,function(){h.call(j,window.event)})}}}(),getX:function(i){var h=i.touches?i.touches[0]:i;
return h.pageX||h.clientX},getY:function(i){var h=i.touches?i.touches[0]:i;return h.pageY||h.clientY}};
function e(j,h){var k=null;if(typeof h==="number"){b=h}var i={onGestureStart:null,onGestureMove:null,onGetstureEnd:null};
g.listen(j,g.START,function(l){k=new f(g.getX(l),g.getY(l));k.targetEvent=l;if(i.onGestureStart){i.onGestureStart(k)
}});g.listen(j,g.MOVE,function(l){if(k){k.identifyWithCurrentPos(g.getX(l),g.getY(l));k.targetEvent=l;
if(i.onGestureMove){i.onGestureMove(k)}}});g.listen(j,g.END,function(l){if(k){k.targetEvent=l;if(i.onGestureEnd){i.onGestureEnd(k)
}k=null}});return{onGestureStart:function(l){i.onGestureStart=l},onGestureMove:function(l){i.onGestureMove=l
},onGestureEnd:function(l){i.onGestureEnd=l}}}c.GestureListener=e;c.GestureSession=f;c.EventUtil=g})(window.gesture={});