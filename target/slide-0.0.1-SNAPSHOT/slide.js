var Slide=function(b,a){this.init(b,a)};Slide.prototype={init:function(c,b){this.x=0;var d=gesture.GestureListener(document.getElementById(c),b);
var a=this;d.onGestureStart(function(e){return this.__start.call(a,e)});d.onGestureMove(function(e){return this.__move.call(a,e)
});d.onGestureEnd(function(e){return this.__end.call(a,e)})},__start:function(a){},__move:function(a){var b=this.x+a.delta.x;
this.__pos(b)},__end:function(a){},__pos:function(a){this.x=a;this.el.style.webkitTransform="translate3d("+a+"px,0,0)"
}};