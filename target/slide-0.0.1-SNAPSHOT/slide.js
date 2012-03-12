(function(b){var e=0.2;var a=0;var d=function(i,g,h,f){this.init(i,g,h,f)};d.prototype={init:function(i,g,h,f){this.slideHandlers=i;
this.dataSource=h;this.__initPaging();this.__createSlide(g);this.__setInitData();this.__resize();this.__bindEvent(f)
},__initPaging:function(){this.page=0;this.offset=0},__setInitData:function(){var f=this.dataSource.getInitData(0);
for(var g=0;g<3;g++){if(f[g].type!=="invalid"){this.__setDataItem(g,f[g].data)}}},__createSlide:function(f){var g=(typeof(f)==="string")?document.getElementById(f):f;
g.innerHTML='<div class="slide" id="slider-'+a+'" style="width:100%;height: 100%;position: relative;top:0;"><div class="panel" style="left:0%"></div><div class="panel" style="left:100%"></div><div class="panel" style="left:-100%"></div></div><button type="button" class="prevBtn">prev</button><button type="button" class="nextBtn">next</button>';
this.el=document.getElementById("slider-"+a);this.panels=this.el.getElementsByClassName("panel")},__bindEvent:function(g){var i="onorientationchange" in window?"orientationchange":"resize",h=gesture.GestureListener(this.el,g),f=this;
h.onGestureStart(function(j){return f.__start.call(f,j)});h.onGestureMove(function(j){return f.__move.call(f,j)
});h.onGestureEnd(function(j){return f.__end.call(f,j)});window.addEventListener(i,function(){return f.__resize.call(f)
})},__resize:function(){this.pageWidth=this.el.clientWidth;this.__pos(-this.page*this.pageWidth);this.__addExternalFunction(this.slideHandlers.onResize)
},__isLandScape:function(){if(window.innerHeight>window.innerWidth){return true}else{return false}},__start:function(f){this.el.style.webkitTransitionDuration="0";
this.isScrolling=false;this.__addExternalFunction(this.slideHandlers.onSlideStart,f)},__move:function(f){if(f.isSwipe()&&!this.isScrolling){f.targetEvent.preventDefault();
this.__pos(-this.page*this.pageWidth+f.delta.x/2);this.__addExternalFunction(this.slideHandlers.onSlideMove,f)
}else{if(f.isScroll()){this.isScrolling=true}}},__end:function(f){if(this.__isNextSwipe(f)){this.__next(this.__setDurationTime(f))
}else{if(this.__isPrevSwipe(f)){this.__prev(this.__setDurationTime(f))}else{this.__cancel("500ms")}}this.__addExternalFunction(this.slideHandlers.onSlideEnd,f)
},__setDurationTime:function(g){if(g.isFlick()){return"500ms"}else{var f=Math.abs(parseInt(g.getTerm()*this.pageWidth/g.delta.x));
if(f>500){return"500ms"}else{return""+f+"ms"}}},__pos:function(f){this.el.style.webkitTransform="translate3d("+f+"px,0,0)"
},__isNextSwipe:function(f){if(f.isLeft()&&(this.__isNextThreshold(f)||f.isFlick())){return true}else{return false
}},__isNextThreshold:function(f){if(this.el.clientWidth*-1*e>f.delta.x){return true}else{return false
}},__isPrevSwipe:function(f){if(f.isRight()&&(this.__isPrevThreshold(f)||f.isFlick())){return true}else{return false
}},__isPrevThreshold:function(f){if(this.el.clientWidth*e<f.delta.x){return true}else{return false}},__next:function(h){var g=this.dataSource.getNextData();
if(g.type==="invalid"){this.__cancel(h)}else{this.el.style.webkitTransitionDuration=h;this.__plusPageOffset();
this.__pos(-this.page*this.pageWidth);var f=this.__getNextOffsetOfMovingPanel();this.__movePanel(this.page+1,f);
this.__setDataItem(f,g.data);this.__addExternalFunction(this.slideHandlers.onSlideNext)}},__prev:function(h){var g=this.dataSource.getPrevData();
if(g.type==="invalid"){this.__cancel(h)}else{this.el.style.webkitTransitionDuration=h;this.__minusPageOffset();
this.__pos(-this.page*this.pageWidth);var f=this.__getPrevOffsetOfMovingPanel();this.__movePanel(this.page-1,f);
this.__setDataItem(f,g.data);this.__addExternalFunction(this.slideHandlers.onSlidePrev)}},__setDataItem:function(f,g){if(this.slideHandlers.onSetDataItem){g=this.slideHandlers.onSetDataItem(g)
}this.panels[f].innerHTML=g},__getNextOffsetOfMovingPanel:function(){var f=this.panels.length,g=this.offset+parseInt(f/2);
if(g>=f){g=g-f}return g},__getPrevOffsetOfMovingPanel:function(){var f=this.panels.length,g=this.offset-parseInt(f/2);
if(g<0){g=g+f}return g},__plusPageOffset:function(){this.page++;var f=this.panels.length;this.offset++;
if(this.offset>f-1){this.offset=0}},__minusPageOffset:function(){this.page--;var f=this.panels.length;
this.offset--;if(this.offset<0){this.offset=f-1}},__movePanel:function(g,f){this.panels[f].style.left=g*100+"%"
},__cancel:function(f){this.el.style.webkitTransitionDuration=f;this.__pos(-this.page*this.pageWidth);
this.__addExternalFunction(this.slideHandlers.onSlideCancel)},__addExternalFunction:function(f,g){if(f){f(g)
}}};function c(i,g,h){var j={onSlideStart:null,onSlideMove:null,onSlideEnd:null,onSlidePrev:null,onSlideNext:null,onSlideCancel:null,onResize:null,onSetDataItem:null};
var f=new d(j,i,g,h);a++;return{setSlideDataList:function(k){SLIDE_DATA_LIST=k;f.__setData()},addSlideData:function(k){SLIDE_DATA_LIST.push(k);
f.__loadData()},initSlidePaging:function(){f.__initPaging()},setSlideTreshold:function(k){e=k},onSlideStart:function(k){j.onSlideStart=k
},onSlideMove:function(k){j.onSlideMove=k},onSlideEnd:function(k){j.onSlideEnd=k},onSlidePrev:function(k){j.onSlidePrev=k
},onSlideNext:function(k){j.onSlideNext=k},onSlideCancel:function(k){j.onSlideCancel=k},onResize:function(k){j.onResize=k
},onSetDataItem:function(k){j.onSetDataItem=k},nextSlide:function(k){f.__next(k)},prevSlide:function(k){f.__prev(k)
},isLandScape:function(){return f.__isLandScape()},setInitData:function(){f.__setInitData()}}}b.slideListener=c
})(window.slide={});(function(a){var b=function(f,d,e){this.init(f,d,e)};b.prototype={init:function(f,d,e){this.dataHandlers=f;
this.isIterating=d||false;this.loadIndex=e||0;this.dataList=[]},addData:function(d){this.dataList.push(d)
},addDataList:function(d){this.dataList=this.dataList.concat(d)},setDataTotalLength:function(d){this.totalLen=d
},getDataTotalLength:function(){return this.totalLen||this.getDataListLength()},getDataListLength:function(){return this.dataList.length
},getDataByIndex:function(d){if(this.isIterating){d=this.__iterationIndexing(d)}return this.__checkData(d)
},__checkData:function(d){var e={};if(d===0){e.type="start";e.data=this.dataList[d]}else{if(d===this.getDataTotalLength()-1){e.type="end";
e.data=this.dataList[d]}else{if(d===-1){e.type="startPrev";e.data=""}else{if(d===this.getDataTotalLength()){e.type="endNext";
e.data=""}else{if(d>0&&d<this.getDataTotalLength()-1){e.type="valid";e.data=this.dataList[d]}else{e.type="invalid";
e.data=""}}}}}return e},__iterationIndexing:function(e){var d=this.getDataTotalLength();if(e<0){do{e=d+e
}while(e<0)}else{if(e>=d){do{e=e-d}while(e>=d)}}return e},getPrevData:function(){var d=this.getDataByIndex(this.getPrevIndex());
if(d.type!=="invalid"){this.currentIndex--}return d},getNextData:function(){var d=this.getDataByIndex(this.getNextIndex());
if(d.type!=="invalid"){this.currentIndex++;if(this.checkLoadingData()){this.requestData()}}return d},checkLoadingData:function(){if(this.loadIndex!==0&&this.loadIndex===this.getDataListLength()-this.currentIndex){return true
}else{return false}},getPrevIndex:function(){return this.currentIndex-2},getNextIndex:function(){return this.currentIndex+2
},getInitData:function(d){var e=[];this.currentIndex=d;e.push(this.getDataByIndex(d));e.push(this.getDataByIndex(d+1));
e.push(this.getDataByIndex(d-1));return e},requestData:function(d){if(this.dataHandlers.requestDataHandler){this.dataHandlers.requestDataHandler(d)
}else{this.responseData(d.data)}},responseData:function(e){var d=this.parseData(e);this.addDataList(d);
if(this.dataHandlers.dataLoadEndHandler){this.dataHandlers.dataLoadEndHandler()}},parseData:function(d){if(this.dataHandlers.parseDataHandler){return this.dataHandlers.parseDataHandler(d)
}else{return d}}};function c(d,e){var f={parseDataHandler:null,requestDataHandler:null,dataLoadEndHandler:null};
var g=new b(f,d,e);return{addDataList:function(h){g.addDataList(h)},addData:function(h){h.addData(h)},getDataByIndex:function(h){return g.getDataByIndex(h)
},getDataSourceLength:function(){return g.getDataListLength()},getPrevData:function(){return g.getPrevData()
},getNextData:function(){return g.getNextData()},getInitData:function(h){return g.getInitData(h)},setDataTotalLength:function(h){g.setDataTotalLength(h)
},onParseData:function(h){f.parseDataHandler=h},onRequestData:function(h){f.requestDataHandler=h},onDataLoadEnd:function(h){f.dataLoadEndHandler=h
},sendRequestData:function(h){g.requestData(h)},responseData:function(h){g.responseData(h)}}}a.listener=c
})(window.slideDataSource={});