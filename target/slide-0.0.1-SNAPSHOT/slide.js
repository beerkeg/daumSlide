var Slide=function(b,a){this.init(b,a)};Slide.prototype={init:function(b,a){this.page=0;this.offset=0;
this.el=(typeof(b)==="string")?document.getElementById(b):b;this.el.style.webkitTransitionTimingFunction="ease-out";
this.pageWidth=b.clientWidth;this.pages=Array.prototype.slice.call(b.getElementsByClassName("panel"));
this.__bindEvent(a)},__bindEvent:function(b){var d="onorientationchange" in window?"orientationchange":"resize",c=gesture.GestureListener(this.el,b),a=this;
c.onGestureStart(function(e){return a.__start.call(a,e)});c.onGestureMove(function(e){return a.__move.call(a,e)
});c.onGestureEnd(function(e){return a.__end.call(a,e)});window.addEventListener(d,function(){return a.__resize.call(a)
})},__resize:function(){this.pageWidth=this.el.clientWidth;this.__pos(-this.page*this.pageWidth)},__start:function(a){a.targetEvent.preventDefault();
this.pointX=a.startPos.x;this.el.style.webkitTransitionDuration="0"},__move:function(a){if(a.isSwipe()){a.targetEvent.preventDefault();
this.__pos(-this.page*this.pageWidth+a.delta.x)}},__end:function(a){this.el.style.webkitTransitionDuration="500ms";
if(this.__isNextSwipe(a)){this.__next()}else{if(this.__isPrevSwipe(a)){this.__prev()}else{this.__cancel()
}}},__pos:function(a){this.el.style.webkitTransform="translate3d("+a+"px,0,0)"},__isNextSwipe:function(a){if(a.isLeft()&&(this.el.clientWidth*-0.2>a.delta.x)){return true
}else{return false}},__isPrevSwipe:function(a){if(a.isRight()&&(this.el.clientWidth*0.2<a.delta.x)){return true
}else{return false}},__next:function(){this.__pulsPageOffset();this.__pos(-this.page*this.pageWidth);
this.__movePageTool(this.page+1,this.__getNextOffsetOfMovingPanel())},__prev:function(){this.__minusPageOffset();
this.__pos(-this.page*this.pageWidth);this.__movePageTool(this.page-1,this.__getPrevOffsetOfMovingPanel())
},__getNextOffsetOfMovingPanel:function(){var a=this.pages.length,b=this.offset+parseInt(a/2);if(b>=a){b=b-a
}return b},__getPrevOffsetOfMovingPanel:function(){var a=this.pages.length,b=this.offset-parseInt(a/2);
if(b<0){b=b+a}return b},__pulsPageOffset:function(){this.page++;var a=this.pages.length;this.offset++;
if(this.offset>a-1){this.offset=0}},__minusPageOffset:function(){this.page--;var a=this.pages.length;
this.offset--;if(this.offset<0){this.offset=a-1}},__movePageTool:function(b,a){this.pages[a].style.left=b*100+"%"
},__cancel:function(){this.__pos(-this.page*this.pageWidth)}};