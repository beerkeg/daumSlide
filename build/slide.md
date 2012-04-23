<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="sh.css">
</head>
<body>

# Slide Library

## usage
~~~~~~~
window.slide = {
        userAgent,
        Panel,
        Container,
        Slide,
        DataSource,
        InfiniteDataSource
    };
~~~~~~~

### init 순서

#### 1. slide가 동작할  frame element를 지정한다.

~~~~~~~
var frameEl = document.getElementById("frameEl");
~~~~~~~

+ frameEl {HTMLElement}
    
    slide가 동작할 frame element

#### 2. datasource에서 사용할 최초의 데이터들을 세팅한다.

+ datas {Array}

    DataSource 초기화시 최초 데이터로 사용할 값들.

    + item {Object}

        datas array에 들어갈 데이터의 형태 오브젝트.

        + veriable {Veriable}

            item 오브젝트 내부의 변수들.

        + toHTML {Function} : return {HTMLString}

            item 오브젝트 내부에 필수적으로 있어야 하는 함수.

~~~~~~~
var datas = [ itme1, item2, item3 ... ];

var item = {
        veriable1: veriable1,
        veriable2: veriable2,
        ...
        toHTML: function () {   
            // 필수 함수 요소 : itme의 veriable들의 값을 가지고, panel에 보여줄 html String 값을 리턴하는 함수.
            return <HTMLString>;
        }
    };
~~~~~~~

###### example
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

var datas = [ 
   createItem("first Image", "http://cubiq.org/dropbox/SwipeView/demo/gallery/images/pic01.jpg", 100, 100),
   createItem("second Image", "http://cubiq.org/dropbox/SwipeView/demo/gallery/images/pic02.jpg", 100, 100),
   createItem("third Image", "http://cubiq.org/dropbox/SwipeView/demo/gallery/images/pic03.jpg", 100, 100),
   createItem("fourth Image", "http://cubiq.org/dropbox/SwipeView/demo/gallery/images/pic04.jpg", 100, 100),
   createItem("fifth Image", "http://cubiq.org/dropbox/SwipeView/demo/gallery/images/pic05.jpg", 100, 100)
];
~~~~~~~

##### 3. slide에서 보여줄 데이터를 관리하는 데이터 소스를 초기화 한다.

~~~~~~~
var ds = new slide.DataSource(datas);

[OR]

var ds = new slide.InfiniteDataSource(datas); // 데이터 반복형
~~~~~~~

+ datas {Array}

    DataSource 초기화시 최초 데이터로 사용할 값들.

~~~~~~~
var datas = [ itme1, item2, item3 ... ];

var item = {
        veriable1: veriable1,
        veriable2: veriable2,
        ...
        toHTML: function () {   
            // 필수 함수 요소 : itme의 veriable들의 값을 가지고, panel에 보여줄 html String 값을 리턴하는 함수.
            return <HTMLString>;
        }
    };
~~~~~~~


##### 4. frameEl과 datasource를 이용하여 slide를 초기화 한다.

~~~~~~~
var sl = new slide.Slide(frameEl, ds); 
~~~~~~~





<script src="sh_main.js"></script>
<script src="sh_javascript.min.js"></script>
<script>highlight(undefined, undefined, 'pre');</script>
</body>
</html>