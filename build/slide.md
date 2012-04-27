<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="sh.css">
<title>Slide Library</title>
</head>
<body>
<header>

# Slide Library

</header>
<div id="toc">
    
+ [Usage - Quick Start](#usage---quick-start-init-순서)
+ [Api](#api)
    + [slide.datasource](#slide.datasource)
        + [willQueryFirstOfData](#willqueryfirstofdata)
        + [willQueryEndOfData](#willqueryendofdata)
        + [setCurrentIndex](#setcurrentindex)
        + [addNextData](#addnextdata)
        + [addPrevData](#addprevdata)
        + [queryCurrentSet](#querycurrentset)
        + [queryPrev](#queryprev)
        + [queryCurrent](#querycurrent)
        + [queryNext](#querynext)
        + [destroy](#destroy)
    + [slide.slide](#slide.slide)
        + [destroy](#destroy-1)
        + [on](#on)
        + [off](#off)
        + [Event:resize](#eventresize)
        + [Event:startDrag](#eventstartdrag)
        + [Event:enddrag](#eventenddrag)
        + [Event:click](#eventclick)
        + [Event:next](#eventnext)
        + [Event:prev](#eventprev)
        + [Event:cancel](#eventcancel)
+ [Example 따라하기 - Image search](#example-따라하기---image-search)
    + [1. slide가 동작할 HTML 작성 (해당 슬라이드 js 호출)](#slide가-동작할-html-작성-해당-슬라이드-js-호출)
    + [2. slide가 동작할 frame element를 지정](#slide가-동작할-frame-element를-지정)
    + [3. DataSource에서 사용할 init 데이터를 수신](#datasource에서-사용할-init-데이터를-수신)
        + [3.1. init데이터를 받아오기 위한 jsonp 방식 api](#init데이터를-받아오기-위한-jsonp-방식-api)
    + [4 slide.Datasource 와 slide.Slide를 생성/초기화](#slide.datasource-와-slide.slide를-생성초기화)
        + [4.1. init 데이터를 파싱하는 함수](#init-데이터를-파싱하는-함수)
        + [4.2. Slide의 좌우 버튼 기능을 추가하는 함수](#slide의-좌우-버튼-기능을-추가하는-함수)
        + [4.3. Slide의 하단 설명 레이어를 보여주는 기능을 추가하는 함수](#slide의-하단-설명-레이어를-보여주는-기능을-추가하는-함수)
        + [4.4. Slide click시 버튼과 하단 레이어를 토글할 수 있는 기능을 추가하는 함수](#slide-click시-버튼과-하단-레이어를-토글할-수-있는-기능을-추가하는-함수)
+ [추가 Example](#추가-example)

<hr class="end">

</div>
<div id="apicontent">

# Usage - Quick Start (init 순서) <span><a href="#" class="mark">#</a></span>

### 1. slide가 동작할  frame element를 지정한다. <span><a href="#" class="mark">#</a></span>

~~~~~~~
var frameEl = document.getElementById("frameEl");
~~~~~~~

+ frameEl {HTMLElement}
    
    `Slide` 가 동작할 frame element

### 2. datasource에서 사용할 최초의 데이터들을 세팅한다. <span><a href="#" class="mark">#</a></span>
~~~~~~~
function createItem(title, image, width, height) {
    var item = {
            title: title,
            image: image,
            width: width,
            height: height,
            toHTML: function () {   
                var str = '<img alt="' + this.title + 
                            '" src="' + this.image + 
                            '" width="' + this.width + 
                            '" height="' + this.height + '">';
                return str;
            }
        };
    return item;
}

var items = [ 
   createItem("first Image", "http://cubiq.org/dropbox/SwipeView/demo/gallery/images/pic01.jpg", 100, 100),
   createItem("second Image", "http://cubiq.org/dropbox/SwipeView/demo/gallery/images/pic02.jpg", 100, 100),
   createItem("third Image", "http://cubiq.org/dropbox/SwipeView/demo/gallery/images/pic03.jpg", 100, 100),
   createItem("fourth Image", "http://cubiq.org/dropbox/SwipeView/demo/gallery/images/pic04.jpg", 100, 100),
   createItem("fifth Image", "http://cubiq.org/dropbox/SwipeView/demo/gallery/images/pic05.jpg", 100, 100)
];
~~~~~~~

~~~~~~~
var items = [ itme1, item2, item3 ... ];

var item = {
        variable1: variable1,
        variable2: variable2,
        ...
        toHTML: function () {   
            // 필수 함수 요소 : itme의 variable들의 값을 가지고, panel에 보여줄 html String 값을 리턴하는 함수.
            return <HTMLString>;
        }
    };
~~~~~~~

### 3. slide에서 보여줄 데이터를 관리하는 데이터 소스를 초기화 한다. <span><a href="#" class="mark">#</a></span>

~~~~~~~
var ds = new slide.DataSource(items);

[OR]

var ds = new slide.InfiniteDataSource(items); // 데이터 반복형
~~~~~~~

### 4. frameEl과 datasource를 이용하여 slide를 초기화 한다. <span><a href="#" class="mark">#</a></span>

~~~~~~~
var sl = new slide.Slide(frameEl, ds, option); 
~~~~~~~

~~~~~~~
var option = {
        containerId: String,    // default = "slide-" + Number
        duration: Number,       // default = 500
        PanelClass: PanelClass  // default = Panel
    };
~~~~~~~

# Api <span><a href="#" class="mark">#</a></span>

## slide.Datasource <span><a href="#" class="mark">#</a></span>

slide에서 보여줄 데이터를 관리하는 Class.

~~~~~~~
var ds = new slide.DataSource(items);
~~~~~~~

~~~~~~~
var items = [ itme1, item2, item3 ... ];

var item = {
        variable1: variable1,
        variable2: variable2,
        ...
        toHTML: function () {   
            // 필수 함수 요소 : itme의 variable들의 값을 가지고, panel에 보여줄 html String 값을 리턴하는 함수.
            return <HTMLString>;
        }
    };
~~~~~~~

### items {Array}

`DataSource` 초기화시 최초 데이터로 사용할 값들.

#### item {Object}

`items` array에 들어갈 데이터의 형태 오브젝트.

+ variable {Variable}

    `item` 오브젝트 내부의 변수들.

+ toHTML {Function} : return {HTMLString}

    `item` 오브젝트 내부에 필수적으로 있어야 하는 함수.


### willQueryFirstOfData <span><a href="#" class="mark">#</a></span>

`DataSource` 내의 데이터가 가장 처음일 경우에 실행되는 함수를 지정한다.

데이터 소스에 저장된 데이터의 이전 데이터가 존재 할 경우, 이 함수를 이용하여 이전 데이터를 추가 할 수 있다.

~~~~~~~
ds.willQueryFirstOfData(function loadPrevData () {
   // 이전 데이터를 불러오는 작업 수행. 
});
~~~~~~~


### willQueryEndOfData <span><a href="#" class="mark">#</a></span>

`DataSource` 내의 데이터가 가장 끝일 경우에 실행되는 함수를 지정한다.

데이터 소스에 저장된 데이터의 이후 데이터가 존재 할 경우, 이 함수를 이용하여 이후 데이터를 추가 할 수 있다.

~~~~~~~
ds.willQueryEndOfData(function loadNextData () {
   // 이후 데이터를 불러오는 작업 수행. 
});
~~~~~~~

### setCurrentIndex <span><a href="#" class="mark">#</a></span>

datasource 의 현재 index를 설정한다.

~~~~~~~
ds.setCurrentIndex(index);
~~~~~~~

### addNextData <span><a href="#" class="mark">#</a></span>

`DataSource` 의 `data` 뒤에 데이터를 추가한다.

데이터 추가와 상관없이 현재 보여지는 데이터 index 값은 유지된다.

~~~~~~~
var items = [ itme1, item2, item3 ... ];
ds.addNextData(items);
~~~~~~~


### addPrevData <span><a href="#" class="mark">#</a></span>

`DataSource` 의 `data` 앞에 데이터를 추가한다.

데이터 추가와 상관없이 현재 보여지는 데이터는 유지된다.

(data index의 값은 추가되는 items의 길이만큼 증가한다.)

~~~~~~~
var items = [ itme1, item2, item3 ... ];
ds.addPrevData(items);
~~~~~~~


### queryCurrentSet <span><a href="#" class="mark">#</a></span>

datasource의 현재 인덱스를 기준으로 이전, 현재, 다음 데이터 set을 받아온다.

~~~~~~~
ds.queryCurrentSet(function (set) {
    console.log(set.prev);      // 현재 index 의 바로 이전 데이터
    console.log(set.current);   // 현재 index 의 데이터 
    console.log(set.next);      // 현재 index 의 바로 다음 데이터
});
~~~~~~~


### queryPrev <span><a href="#" class="mark">#</a></span>

datasource의 현재 인덱스를 기준으로 바로 이전 데이터를 받아온다.

~~~~~~~
ds.queryPrev(function (prev) {
    console.log(prev);      // 현재 index 의 바로 이전 데이터
});
~~~~~~~

### queryCurrent <span><a href="#" class="mark">#</a></span>

datasource의 현재 인덱스의 데이터를 받아온다.

~~~~~~~
ds.queryCurrent(function (current) {
    console.log(current);      // 현재 index 의 데이터 
});
~~~~~~~

### queryNext <span><a href="#" class="mark">#</a></span>

datasource의 현재 인덱스를 기준으로 바로 이전 데이터를 받아온다.

~~~~~~~
ds.queryNext(function (next) {
    console.log(next);      // 현재 index 의 바로 다음 데이터
});
~~~~~~~


### destroy <span><a href="#" class="mark">#</a></span>

datasource를 제거한다.

~~~~~~~
ds.destroy();
delete ds;
~~~~~~~

## slide.Slide <span><a href="#" class="mark">#</a></span>

`DataSource` 로부터 데이터를 가져와 화면상에 보이는 것을 관리하는 Class.

~~~~~~~
var sl = new slide.Slide(frameEl, ds, option);
~~~~~~~

~~~~~~~
var frameEl = document.getElementById("frameEl");
var ds = new slide.DataSource(items);
var option = {
        containerId: String,    // default = "slide-" + Number
        duration: Number,       // default = 500
        PanelClass: PanelClass  // default = Panel
    };
~~~~~~~


### frameEl {HTML Element}

`Slide` 가 동작할 frame element

### ds {Class DataSource}

`Slide` 에서 보여줄 데이터를 관리하는 Class.

### option {Object}

`Slide` 초기화시 사용할 옵션값들. 미지정된 옵션값은 디폴트 값으로 대체 사용.

#### containerId {String}

+ 생성되는 `Container` Element 의 id를 지정.

+ 디폴트로 slide-{Number} 숫자값이 증가 1부터 차례대로 증가하며 생성.

    + (ex) slide-1, slide-2 ...

        
#### duration {Number}

+ Slide의 트랜지션시 적용되는 duration값을 지정.

+ 디폴트로 500 값이 적용.


#### PanelClass {Class `Panel`}

+ 생성되는 Panel Class를 지정.

+ 디폴트로 Panel Class로 지정. 

    + 다른 값으로 `UlPanal` 이 있으며, 임의로 Panel Class를 상속받는 클래스를 작성하여 지정 가능.



### destroy <span><a href="#" class="mark">#</a></span>

`Slide` 를 제거한다.

~~~~~~~
sl.destroy();
delete sl;
~~~~~~~



### on <span><a href="#" class="mark">#</a></span>

Slide 동작시 발생하는 이벤트 등록 함수.

+ EventType {String}

    Slide 동작시 발생하는 Event type

+ callback {Function}

    해당 Event 발생시 동작하는 함수.
    

~~~~~~~
sl.on(EventType, callback);
~~~~~~~

### off <span><a href="#" class="mark">#</a></span>
Slide 동작시 발생하는 이벤트 제거 함수.

~~~~~~~
sl.off(EventType, callback);
~~~~~~~

### Event:resize <span><a href="#" class="mark">#</a></span>

브라우져 화면의 resize 이벤트 발생시 발생하는 이벤트.

~~~~~~~
sl.on("resize", function onResize() {
    console.log("브라우져 화면의 resize 이벤트 발생시 동작하는 함수");
});
sl.off("resize", onResize);
~~~~~~~

### Event:startDrag <span><a href="#" class="mark">#</a></span>

frameEl내에서 mouse down or touchstart 이벤트 발생 시 발생하는 이벤트.

~~~~~~~
sl.on("startDrag", function onStartDrag() {
    console.log("frameEl내에서 mouse down or touchstart 이벤트 발생 시 동작하는 함수.");
});
sl.off("startDrag", onStartDrag);
~~~~~~~

### Event:endDrag <span><a href="#" class="mark">#</a></span>

frameEl내에서 mouse up or touchend 이벤트 발생 시 발생하는 이벤트.

~~~~~~~
sl.on("endDrag", function onEndDrag() {
    console.log("frameEl내에서 mouse up or touchend 이벤트 발생 시 동작하는 함수.");
});
sl.off("endDrag", onEndDrag);
~~~~~~~

### Event:click <span><a href="#" class="mark">#</a></span>

frameEl내에서 클릭 동작시 (mousemove 혹은 touchmove 이벤트가 발생안한 상태) 발생하는 이벤트.

~~~~~~~
sl.on("click", function onClick() {
    console.log("frameEl내에서 클릭 동작시 동작하는 함수.");
});
sl.off("click", onClick);
~~~~~~~

### Event:next <span><a href="#" class="mark">#</a></span>

slide가 다음 화면으로 넘어갔을 때 발생하는 이벤트.

~~~~~~~
sl.on("next", function onNext() {
    console.log("slide가 다음 화면으로 넘어갔을 때 동작하는 함수.");
});
sl.off("next", onNext);
~~~~~~~

### Event:prev <span><a href="#" class="mark">#</a></span>

slide가 이전 화면으로 넘어갔을 때 발생하는 이벤트.

~~~~~~~
sl.on("prev", function onPrev() {
    console.log("slide가 이전 화면으로 넘어갔을 때 동작하는 함수.");
});
sl.off("prev", onPrev);
~~~~~~~

### Event:cancel <span><a href="#" class="mark">#</a></span>

slide가 다음 혹은 이전으로 가지 못하고 다시 원래의 화면으로 돌아올 때 발생하는 이벤트.

~~~~~~~
sl.on("cancel", function onCancel() {
    console.log("slide가 다음 혹은 이전으로 가지 못하고 다시 원래의 화면으로 돌아올 때 동작하는 함수.");
});
sl.off("cancel", onCancel);
~~~~~~~



# Example 따라하기 - Image search <span><a href="#" class="mark">#</a></span>

## 1. slide가 동작할 HTML 작성 (해당 슬라이드 js 호출) <span><a href="#" class="mark">#</a></span>

+ \#frameEl, .slide 에 높이 값 지정 필수
    + \#frameEl 고정값, .slide 에 100%
    + \#frameEl 미지정, .slide에 고정값

[slide_simpleSearch.html](http://east.ftdev.daum.net/sl/slide_simpleSearch.html)

~~~~~~~
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" 
    content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=EDGE" />
<title>slide example</title>
<style>
html, body {height: 100%; width: 100%; margin: 0; padding: 0; overflow:hidden; background-color: #333;}
#frameEl {width: 100%; height:100%; overflow:hidden; background-color: #333; position: relative;}
.slide {height:100%;}
.panel img {position: absolute; top: 0; width: 100%; height: 100%;}
.prevBtn, .nextBtn {position: absolute; top: 45%; z-index: 30; width: 40px; height: 45px; padding: 0px;}
.prevBtn {left: 10px;}
.nextBtn {right: 10px;}
#footer {width: 100%; z-index: 999; position: absolute; bottom:0; background-color: #000; color: #fff;}
</style>
<script type="text/javascript" src="http://east.ftdev.daum.net/work/slide/build/slide.min.js"></script>
</head>
<body>
<div id="frameEl"></div>
<button type="button" class="prevBtn">prev</button>
<button type="button" class="nextBtn">next</button>
<div id="footer"></div>
</body>
</html>
~~~~~~~


## 2. slide가 동작할  frame element를 지정 <span><a href="#" class="mark">#</a></span>

~~~~~~~
var headTag = document.getElementsByTagName("head")[0],         // head Element
    click = "ontouchstart" in window ? "touchstart" : "click",
    prevBtn = document.getElementsByClassName("prevBtn")[0],    // prev Button Element
    nextBtn = document.getElementsByClassName("nextBtn")[0],    // next Button Element
    footer = document.getElementById("footer"),                 // footer Element
    pageNum = 1;                                                // api page number

var frameEl = document.getElementById("frameEl");               // slide가 동작할 frame Element
~~~~~~~


## 3. DataSource에서 사용할 init 데이터를 수신 <span><a href="#" class="mark">#</a></span>

+ jsonp 방식, DAUM 이미지 검색 opne API 이용

~~~~~~~
// 최초 로딩 함수.
function loadInitialData(callback) {
    simpleSearchAPIJsonp(function (data) {
        initSlide(data); // 최초 데이터를 받았을 때 슬라이드를 초기화하는 함수.
    });
}
(function main() {
    window.addEventListener("load", function(e){
        loadInitialData(); // 데이터 호출 함수.
    });
})();
~~~~~~~

### 3.1. init데이터를 받아오기 위한 jsonp 방식 api <span><a href="#" class="mark">#</a></span>

~~~~~~~
// jsonp 방식으로 데이터를 받았을 때 호출될 함수.
var simpleSearchAPICallback = null;

// jsonp data요청 함수.
function simpleSearchAPIJsonp(callback) {
    simpleSearchAPICallback = callback;
    var url = 'http://apis.daum.net/search/image' + 
            '?apikey=080a78bc84cc6b814fb365591b1d7d7fc26575b3' + 
            '&output=json&callback=simpleJsonpCallback&q=소녀시대&pageno=' + pageNum;
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = url;
    s.charset = "utf-8";
    headTag.appendChild(s);
}

// data를 받았을 때 요청 시 지정한 함수를 실행하게 해주는 함수.
function simpleJsonpCallback(data) {
    headTag.removeChild(headTag.lastChild);
    simpleSearchAPICallback(data); // 실제로 data를 받아서 실행되는 함수.
}
~~~~~~~

## 4 slide.Datasource 와 slide.Slide를 생성/초기화 <span><a href="#" class="mark">#</a></span>
~~~~~~~
// slide.Datasource 와 slide.Slide를 생성/초기화 하는 함수.
function initSlide(data) {
    // init data를 파싱한다.
    var items = buildSlides(data);
    // 파싱한 init data를 가지고 DataSource를 생성.
    var ds = new slide.DataSource(items);
    
    // DataSource내의 data의 끝에 도달 했을 시 추가 데이터를 불러온다.
    ds.willQueryEndOfData(function (callback) {
        var self = this;
        loadMoreData(function (data) {
            var items = buildSlides(data);
            self.addNextData(items); 
            callback(items[0]); // (ds.queryNext에서 넘겨 받은 callback 함수)
        });
    });

    // frameEl과, 생성한 DataSource를 이용하여 Slide를 초기화 한다.
    var sl = new slide.Slide(frameEl, ds);

    // Slide의 좌우 버튼 기능을 추가한다.
    setButton(sl);

    // Slide의 하단 설명 레이어를 보여주는 기능을 추가한다.
    setFooter(sl, ds);

    // Slide click시 버튼과 하단 설명레이어를 토글할 수 있는 기능을 추가한다.
    setToggle(sl);
}
~~~~~~~

### 4.1. init 데이터를 파싱하는 함수 <span><a href="#" class="mark">#</a></span>

~~~~~~~
function buildSlides(data) {
    var items = data.channel.item,
        arr = [];
    for (var i = 0, len = items.length; i < len; i++) {
        var item = items[i];
        arr.push({
            image: item.image,
            title: item.title,
            link: item.link,
            toHTML: function () {
                return "<img alt=\"" + this.title + "\" src=\"" + this.image + "\" />";
            }
        });
    }
    return arr;
}
~~~~~~~

### 4.2. Slide의 좌우 버튼 기능을 추가하는 함수 <span><a href="#" class="mark">#</a></span>

~~~~~~~
function setButton(sl) {
    prevBtn.addEventListener(click, function(){
        sl.prev();
    }, false);
    nextBtn.addEventListener(click, function(){
        sl.next();
    }, false);
}
~~~~~~~

### 4.3. Slide의 하단 설명 레이어를 보여주는 기능을 추가하는 함수 <span><a href="#" class="mark">#</a></span>

~~~~~~~
function setFooter(sl, ds) {
    function setDesc () {
        ds.queryCurrent(function (data) {
            footer.innerHTML = '<div>data Title : ' + data.title + '</div>' +
                                '<div>data Link : ' + data.link + '</div>';
        });
    }
    sl.on("startDrag", function (session) {
        session.targetEvent.preventDefault();
    });
    sl.on("next", setDesc);
    sl.on("prev", setDesc);
    setDesc();
}
~~~~~~~

### 4.4. Slide click시 버튼과 하단 레이어를 토글할 수 있는 기능을 추가하는 함수 <span><a href="#" class="mark">#</a></span>

~~~~~~~
function setToggle(sl) {
    var viewState = "block";
    function setDisplay (state) {
        footer.style.display = state;
        prevBtn.style.display = state;
        nextBtn.style.display = state;
        viewState = state;
    }

    sl.on("click", function() {
        if (viewState === "none") {
            setDisplay("block");
        } else {
            setDisplay("none");
        }
    });
}
~~~~~~~

# 추가 Example <span><a href="#" class="mark">#</a></span>

1. [slide_search.html](http://east.ftdev.daum.net/sl/slide_search.html)
2. [slide_search2.html](http://east.ftdev.daum.net/sl/slide_search2.html)
3. [slide_media.html](http://east.ftdev.daum.net/sl/slide_media.html)
4. [new_top.html](http://east.ftdev.daum.net/sl/new_top.html)



</div>
<script src="sh_main.js"></script>
<script src="sh_javascript.min.js"></script>
<script>highlight(undefined, undefined, 'pre');</script>
</body>
</html>