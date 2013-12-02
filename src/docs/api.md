<div id="toc">
    <h2>Table of Contents</h2>
    <ul>
        <li>
            <a href="#slide.datasource">slide.datasource</a>
            <ul>
                <li><a href="#willqueryfirstofdata">willQueryFirstOfData</a></li>
                <li><a href="#willqueryendofdata">willQueryEndOfData</a></li>
                <li><a href="#setcurrentindex">setCurrentIndex</a></li>
                <li><a href="#addnextdata">addNextData</a></li>
                <li><a href="#addprevdata">addPrevData</a></li>
                <li><a href="#querycurrentset">queryCurrentSet</a></li>
                <li><a href="#queryprev">queryPrev</a></li>
                <li><a href="#querycurrent">queryCurrent</a></li>
                <li><a href="#querynext">queryNext</a></li>
                <li><a href="#destroy">destroy</a></li>
            </ul>
        </li>
        <li><a href="#slide.slide">slide.slide</a>
            <ul>
                <li><a href="#destroy-1">destroy</a></li>
                <li><a href="#on">on</a></li>
                <li><a href="#off">off</a></li>
                <li><a href="#event-resize">Event:resize</a></li>
                <li><a href="#event-startdrag">Event:startDrag</a></li>
                <li><a href="#event-enddrag">Event:enddrag</a></li>
                <li><a href="#event-click">Event:click</a></li>
                <li><a href="#event-next">Event:next</a></li>
                <li><a href="#event-prev">Event:prev</a></li>
                <li><a href="#event-cancel">Event:cancel</a></li>
            </ul>
        </li>
    </ul>
</div>

# Api

## slide.Datasource

slide에서 보여줄 데이터를 관리하는 Class.

```javascript
var ds = new slide.DataSource(items);
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

### items {Array}

`DataSource` 초기화시 최초 데이터로 사용할 값들.

#### item {Object}

`items` array에 들어갈 데이터의 형태 오브젝트.

+ variable {Variable}

    `item` 오브젝트 내부의 변수들.

+ toHTML {Function} : return {HTMLString}

    `item` 오브젝트 내부에 필수적으로 있어야 하는 함수.


### willQueryFirstOfData

`DataSource` 내의 데이터가 가장 처음일 경우에 실행되는 함수를 지정한다.

데이터 소스에 저장된 데이터의 이전 데이터가 존재 할 경우, 이 함수를 이용하여 이전 데이터를 추가 할 수 있다.

```javascript
ds.willQueryFirstOfData(function loadPrevData () {
   // 이전 데이터를 불러오는 작업 수행. 
});
```


### willQueryEndOfData

`DataSource` 내의 데이터가 가장 끝일 경우에 실행되는 함수를 지정한다.

데이터 소스에 저장된 데이터의 이후 데이터가 존재 할 경우, 이 함수를 이용하여 이후 데이터를 추가 할 수 있다.

```javascript
ds.willQueryEndOfData(function loadNextData () {
   // 이후 데이터를 불러오는 작업 수행. 
});
```

### setCurrentIndex

datasource 의 현재 index를 설정한다.

```javascript
ds.setCurrentIndex(index);
```

### addNextData

`DataSource` 의 `data` 뒤에 데이터를 추가한다.

데이터 추가와 상관없이 현재 보여지는 데이터 index 값은 유지된다.

```javascript
var items = [ itme1, item2, item3 ... ];
ds.addNextData(items);
```


### addPrevData

`DataSource` 의 `data` 앞에 데이터를 추가한다.

데이터 추가와 상관없이 현재 보여지는 데이터는 유지된다.

(data index의 값은 추가되는 items의 길이만큼 증가한다.)

```javascript
var items = [ itme1, item2, item3 ... ];
ds.addPrevData(items);
```


### queryCurrentSet

datasource의 현재 인덱스를 기준으로 이전, 현재, 다음 데이터 set을 받아온다.

```javascript
ds.queryCurrentSet(function (set) {
    console.log(set.prev);      // 현재 index 의 바로 이전 데이터
    console.log(set.current);   // 현재 index 의 데이터 
    console.log(set.next);      // 현재 index 의 바로 다음 데이터
});
```


### queryPrev

datasource의 현재 인덱스를 기준으로 바로 이전 데이터를 받아온다.

```javascript
ds.queryPrev(function (prev) {
    console.log(prev);      // 현재 index 의 바로 이전 데이터
});
```

### queryCurrent

datasource의 현재 인덱스의 데이터를 받아온다.

```javascript
ds.queryCurrent(function (current) {
    console.log(current);      // 현재 index 의 데이터 
});
```

### queryNext

datasource의 현재 인덱스를 기준으로 바로 이전 데이터를 받아온다.

```javascript
ds.queryNext(function (next) {
    console.log(next);      // 현재 index 의 바로 다음 데이터
});
```


### destroy

datasource를 제거한다.

```javascript
ds.destroy();
delete ds;
```

## slide.Slide

`DataSource` 로부터 데이터를 가져와 화면상에 보이는 것을 관리하는 Class.

```javascript
var sl = new slide.Slide(frameEl, ds, option);
```

```javascript
var frameEl = document.getElementById("frameEl");
var ds = new slide.DataSource(items);
var option = {
        container: {
            id: String,         // default = "slide-" + Number
            className: String   // default = slide
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


### frameEl {HTML Element}

`Slide` 가 동작할 frame element

### ds {Class DataSource}

`Slide` 에서 보여줄 데이터를 관리하는 `DataSource` Class의 Instance.

### option {Object}

`Slide` 초기화 시 사용할 옵션 값들. 미지정된 옵션 값은 디폴트 값으로 대체 사용.

+ container 
    + id {String}
        + 생성되는 `Container` Element 의 id를 지정.
        + 디폴트로 slide-{Number} 숫자값이 증가 1부터 차례대로 증가하며 생성.
            + (ex) slide-1, slide-2 ...
    + className {String} default=slide
        + 생성되는 `Container` Element 의 class를 지정.
+ panel 
    + tagName {String} default=div
        + 생성되는 `Panel` Element 의 tagName을 지정.
    + className {String} default=panel
        + 생성되는 `Panel` Element 의 class를 지정.
+ duration {Number} default=300(ms)
    + Slide의 트랜지션시 적용되는 duration값을 지정.
+ panelClass {Class `Panel`} default=`slide.Panel`
    + 생성되는 Panel Class를 지정.
+ containerClass {Class `Container`} default=`slide.Container`
    + 생성되는 Container Class를 지정.

### destroy

`Slide` 를 제거한다.

```javascript
sl.destroy();
delete sl;
```



### on

Slide 동작시 발생하는 이벤트 등록 함수.

+ EventType {String}

    Slide 동작시 발생하는 Event type

+ callback {Function}

    해당 Event 발생시 동작하는 함수.
    

```javascript
sl.on(EventType, callback);
```

### off
Slide 동작시 발생하는 이벤트 제거 함수.

```javascript
sl.off(EventType, callback);
```

### Event:resize

브라우져 화면의 resize 이벤트 발생시 발생하는 이벤트.

```javascript
sl.on("resize", function onResize() {
    console.log("브라우져 화면의 resize 이벤트 발생시 동작하는 함수");
});
sl.off("resize", onResize);
```

### Event:startDrag

frameEl내에서 mouse down or touchstart 이벤트 발생 시 발생하는 이벤트.

```javascript
sl.on("startDrag", function onStartDrag() {
    console.log("frameEl내에서 mouse down or touchstart 이벤트 발생 시 동작하는 함수.");
});
sl.off("startDrag", onStartDrag);
```

### Event:endDrag

frameEl내에서 mouse up or touchend 이벤트 발생 시 발생하는 이벤트.

```javascript
sl.on("endDrag", function onEndDrag() {
    console.log("frameEl내에서 mouse up or touchend 이벤트 발생 시 동작하는 함수.");
});
sl.off("endDrag", onEndDrag);
```

### Event:click

frameEl내에서 클릭 동작시 (mousemove 혹은 touchmove 이벤트가 발생안한 상태) 발생하는 이벤트.

```javascript
sl.on("click", function onClick() {
    console.log("frameEl내에서 클릭 동작시 동작하는 함수.");
});
sl.off("click", onClick);
```

### Event:next

slide가 다음 화면으로 넘어갔을 때 발생하는 이벤트.

```javascript
sl.on("next", function onNext() {
    console.log("slide가 다음 화면으로 넘어갔을 때 동작하는 함수.");
});
sl.off("next", onNext);
```

### Event:prev

slide가 이전 화면으로 넘어갔을 때 발생하는 이벤트.

```javascript
sl.on("prev", function onPrev() {
    console.log("slide가 이전 화면으로 넘어갔을 때 동작하는 함수.");
});
sl.off("prev", onPrev);
```

### Event:cancel

slide가 다음 혹은 이전으로 가지 못하고 다시 원래의 화면으로 돌아올 때 발생하는 이벤트.

```javascript
sl.on("cancel", function onCancel() {
    console.log("slide가 다음 혹은 이전으로 가지 못하고 다시 원래의 화면으로 돌아올 때 동작하는 함수.");
});
sl.off("cancel", onCancel);
```
