### 1. slide가 동작할  frame element를 지정한다. 

```javascript
var frameEl = document.getElementById("frameEl");
```

+ frameEl {HTMLElement}
    
    `Slide` 가 동작할 frame element

### 2. datasource에서 사용할 최초의 데이터들을 세팅한다. 
```javascript
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
```

```javascript
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
```

### 3. slide에서 보여줄 데이터를 관리하는 데이터 소스를 초기화 한다. 

```javascript
var ds = new slide.DataSource(items);

[OR]

var ds = new slide.InfiniteDataSource(items); // 데이터 반복형
```

### 4. frameEl과 datasource를 이용하여 slide를 초기화 한다. 

```javascript
var sl = new slide.Slide(frameEl, ds, option); 
```

```javascript
var option = {
        container: {
            id: String,         // default = "slide-" + Number
            className: String   // default = "slide"
        },
        panel: {
            tagName: String,    // default = div
            className: String   // default = panel
        },
        duration: Number,       // default = 500
        panelClass: PanelClass  // default = Panel
        containerClass: ContainerClass // default = Container
    };
```