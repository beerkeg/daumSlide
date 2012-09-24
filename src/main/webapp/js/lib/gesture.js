(function(b){var h=30,c=30;function f(k,j,i,l){this.type="unindentified";this.direction="unindentified";
this.startPos=a(k,j);this.delta=a(0,0);this.targetEvent=null;this.term=0;this.startTime=new Date();this.gestureThreshold=i;
this.flickThreshold=l}f.prototype={};f.prototype.isSwipe=function(){return this.type==="swipe"};f.prototype.isScroll=function(){return this.type==="scroll"
};f.prototype.isLeft=function(){return this.direction==="left"};f.prototype.isRight=function(){return this.direction==="right"
};f.prototype.isUp=function(){return this.direction==="up"};f.prototype.isDown=function(){return this.direction==="down"
};f.prototype.isFlick=function(){return this.term<200};f.prototype.getTerm=function(){return this.term
};f.prototype.recognizeGesture=function(i,l){var j=a(i,l);var k=this.delta=j.minus(this.startPos);if(this.type==="unindentified"){if(Math.abs(k.x)>this.gestureThreshold&&Math.abs(k.x)>=Math.abs(k.y)){this.type="swipe";
if(k.x<0){this.direction="left"}else{this.direction="right"}}else{if(Math.abs(k.y)>this.gestureThreshold&&Math.abs(k.y)>Math.abs(k.x)){this.type="scroll";
if(k.y<0){this.direction="up"}else{this.direction="down"}}}}};f.prototype.checkFlick=function(){this.term=new Date-this.startTime
};function a(i,j){return{x:i,y:j,minus:function(k){return a(this.x-k.x,this.y-k.y)}}}function d(i){return(document.addEventListener)?i:"on"+i
}var g={START:function(){return("ontouchstart" in window)?"touchstart":d("mousedown")}(),MOVE:function(){return("ontouchstart" in window)?"touchmove":d("mousemove")
}(),END:function(){return("ontouchstart" in window)?"touchend":d("mouseup")}(),listen:function(){if(document.addEventListener){return function(k,j,i){k.addEventListener(j,function(l){i.call(k,l)
},false)}}else{return function(k,j,i){k.attachEvent(j,function(){i.call(k,window.event)})}}}(),getX:function(j){var i=j.touches?j.touches[0]:j;
return i.pageX||i.clientX},getY:function(j){var i=j.touches?j.touches[0]:j;return i.pageY||i.clientY}};
function e(k,i,n){var l=null,j={onGestureStart:null,onGestureMove:null,onGetstureEnd:null};if(typeof i==="undefined"){i=c
}else{if(typeof i!=="number"){throw new Error("gestureThreshold must be a number")}}if(typeof n==="undefined"){n=h
}else{if(typeof n!=="number"){throw new Error("flickThreshold must be a number")}}g.listen(k,g.START,function(o){l=new f(g.getX(o),g.getY(o),i,n);
l.targetEvent=o;if(j.onGestureStart){j.onGestureStart(l)}});g.listen(k,g.MOVE,function(o){if(l){l.recognizeGesture(g.getX(o),g.getY(o));
l.targetEvent=o;if(j.onGestureMove){j.onGestureMove(l)}}});function m(o){if(l){l.checkFlick();l.targetEvent=o;
if(j.onGestureEnd){j.onGestureEnd(l)}l=null}}g.listen(k,g.END,m);if("ontouchstart" in window){g.listen(k,"touchcancel",m)
}return{onGestureStart:function(o){j.onGestureStart=o},onGestureMove:function(o){j.onGestureMove=o},onGestureEnd:function(o){j.onGestureEnd=o
}}}b.GestureListener=e;b.GestureSession=f;b.EventUtil=g})(window.gesture={});