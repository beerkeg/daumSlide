# Example 따라하기 - Image search 

## 1. slide가 동작할 HTML 작성 (해당 슬라이드 js 호출) 

+ \#frameEl, .slide 에 높이 값 지정 필수
    + \#frameEl 고정값, .slide 에 100%
    + \#frameEl 미지정, .slide에 고정값

[slide_simpleSearch.html](http://slide.dev.daum.net/src/example/slide_simpleSearch.html)

```html
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
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
    <script type="text/javascript" src="http://m1.daumcdn.net/svc/original/U03/cssjs/slide/slide-1.2.12.standalone.min.js"></script>
</head>
<body>
    <div id="frameEl"></div>
    <button type="button" class="prevBtn" id="prevBtn">prev</button>
    <button type="button" class="nextBtn" id="nextBtn">next</button>
    <div id="footer"></div>
</body>
</html>
```


## 2. slide가 동작할  frame element를 지정 

```javascript
var headTag = document.getElementsByTagName("head")[0],         // head Element
    click = "ontouchstart" in window ? "touchstart" : "click",
    prevBtn = document.getElementById("prevBtn"),    // prev Button Element
    nextBtn = document.getElementById("nextBtn"),    // next Button Element
    footer = document.getElementById("footer"),                 // footer Element
    pageNum = 1;                                                // api page number

var frameEl = document.getElementById("frameEl");               // slide가 동작할 frame Element
```


## 3. DataSource에서 사용할 init 데이터를 수신 

+ jsonp 방식, [Daum 이미지 검색 open API](http://dna.daum.net/apis/search/ref#image) 이용

```javascript
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
```

### 3.1. init데이터를 받아오기 위한 jsonp 방식 api 

```javascript
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
```

## 4 slide.Datasource 와 slide.Slide를 생성/초기화 
```javascript
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
```

### 4.1. init 데이터를 파싱하는 함수 

```javascript
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
```

### 4.2. Slide의 좌우 버튼 기능을 추가하는 함수 

```javascript
function setButton(sl) {
    var addEvent = function () {
        if (document.addEventListener) {
            return function (el, type, fn) {
                el.addEventListener(type, fn, false);
            };
        } else {
            return function (el, type, fn) {
                el.attachEvent('on' + type, fn);
            };
        }
    }();
    addEvent(prevBtn, "click", function () {
        sl.prev();
    });
    addEvent(nextBtn, "click", function () {
        sl.next();
    });
}
```

### 4.3. Slide의 하단 설명 레이어를 보여주는 기능을 추가하는 함수 

```javascript
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
```

### 4.4. Slide click시 버튼과 하단 레이어를 토글할 수 있는 기능을 추가하는 함수 

```javascript
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
```