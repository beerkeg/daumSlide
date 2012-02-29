(function(a){var d=0.2;var c=function(f,e,g){this.init(f,e,g)};c.prototype={init:function(f,e,g){this.page=0;
this.offset=0;this.el=(typeof(f)==="string")?document.getElementById(f):f;this.pageWidth=f.clientWidth;
this.pages=Array.prototype.slice.call(f.getElementsByClassName("panel"));this.slideHandlers=g;this.__bindEvent(e);
this.isScrolling=false},__bindEvent:function(f){var h="onorientationchange" in window?"orientationchange":"resize",g=gesture.GestureListener(this.el,f),e=this;
g.onGestureStart(function(i){return e.__start.call(e,i)});g.onGestureMove(function(i){return e.__move.call(e,i)
});g.onGestureEnd(function(i){return e.__end.call(e,i)});window.addEventListener(h,function(){return e.__resize.call(e)
})},__resize:function(){this.pageWidth=this.el.clientWidth;this.__pos(-this.page*this.pageWidth)},__start:function(e){this.pointX=e.startPos.x;
this.el.style.webkitTransitionDuration="0";if(this.slideHandlers.onSlideStart){this.slideHandlers.onSlideStart()
}},__move:function(e){if(e.isSwipe()&&!this.isScrolling){e.targetEvent.preventDefault();this.__pos(-this.page*this.pageWidth+e.delta.x);
if(this.slideHandlers.onSlideMove){this.slideHandlers.onSlideMove()}}else{if(e.isScroll()){this.isScrolling=true
}}},__end:function(e){this.el.style.webkitTransitionDuration="500ms";if(this.__isNextSwipe(e)){this.__next()
}else{if(this.__isPrevSwipe(e)){this.__prev()}else{this.__cancel()}}this.isScrolling=false;if(this.slideHandlers.onSlideEnd){this.slideHandlers.onSlideEnd()
}},__pos:function(e){this.el.style.webkitTransform="translate3d("+e+"px,0,0)"},__isNextSwipe:function(e){if(e.isLeft()&&(this.el.clientWidth*-1*d>e.delta.x)){return true
}else{return false}},__isPrevSwipe:function(e){if(e.isRight()&&(this.el.clientWidth*d<e.delta.x)){return true
}else{return false}},__next:function(){this.__pulsPageOffset();this.__pos(-this.page*this.pageWidth);
this.__movePageTool(this.page+1,this.__getNextOffsetOfMovingPanel());if(this.slideHandlers.onSlideNext){this.slideHandlers.onSlideNext()
}},__prev:function(){this.__minusPageOffset();this.__pos(-this.page*this.pageWidth);this.__movePageTool(this.page-1,this.__getPrevOffsetOfMovingPanel());
if(this.slideHandlers.onSlidePrev){this.slideHandlers.onSlidePrev()}},__getNextOffsetOfMovingPanel:function(){var e=this.pages.length,f=this.offset+parseInt(e/2);
if(f>=e){f=f-e}return f},__getPrevOffsetOfMovingPanel:function(){var e=this.pages.length,f=this.offset-parseInt(e/2);
if(f<0){f=f+e}return f},__pulsPageOffset:function(){this.page++;var e=this.pages.length;this.offset++;
if(this.offset>e-1){this.offset=0}},__minusPageOffset:function(){this.page--;var e=this.pages.length;
this.offset--;if(this.offset<0){this.offset=e-1}},__movePageTool:function(f,e){this.pages[e].style.left=f*100+"%"
},__cancel:function(){this.__pos(-this.page*this.pageWidth);if(this.slideHandlers.onSlideCancel){this.slideHandlers.onSlideCancel()
}}};function b(g,f){var h={onSlideStart:null,onSlideMove:null,onSlideEnd:null,onSlidePrev:null,onSlideNext:null,onSlideCancel:null};
var e=new c(g,f,h);return{setSlideTreshold:function(i){d=i},onSlideStart:function(i){h.onSlideStart=i
},onSlideMove:function(i){h.onSlideMove=i},onSlideEnd:function(i){h.onSlideEnd=i},onSlidePrev:function(i){h.onSlidePrev=i
},onSlideNext:function(i){h.onSlideNext=i},onSlideCancel:function(i){h.onSlideCancel=i}}}a.slideListener=b
})(window.slide={});