var headTag = document.getElementsByTagName("head")[0],
    wrapper = document.getElementById("wrapper"),
    click = "ontouchstart" in window ? "touchstart" : "click",
    header = document.getElementById("header"),
    psTitle = header.getElementsByClassName("ps-title")[0],
    psCount = header.getElementsByClassName("count")[0],
    footer = document.getElementById("footer"),
    prevBtn = document.getElementById("prev-button"),
    nextBtn = document.getElementById("next-button"),
    closeBtn = document.getElementById("close-button"),
    totalCount = 0;

var simpleSearchAPICallback = null;
function simpleSearchAPIJsonp(page, callback) {
    simpleSearchAPICallback = callback;
    var url = pageInfo.getApiUrl(page, "simpleSearchAPICallback");
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = url;
    s.charset = "utf-8";
    headTag.appendChild(s);
}
function simpleJsonpCallback(data) {
    headTag.removeChild(headTag.lastChild);
    simpleSearchAPICallback(data);
}

function loadInitialData(callback) {
    simpleSearchAPIJsonp(pageInfo.initPage, function (data) {
        psTitle.innerHTML = data.title;
        initSlide(data);
    });
}
function loadMoreData(page, callback) {
    simpleSearchAPIJsonp(page, function (data) {
        callback(data);
    });
}

var ImageSearchDataSource = slide.DataSource.extend({
    willQueryEndOfDataDelegate: function (callback) {
        var self = this;
        if (totalCount/pageInfo.numPerPage + 1 > pageInfo.nextPage) {
            loadMoreData(pageInfo.nextPage, function (data) {
                var newSlides = buildSlides(data);
                self.addNextData(newSlides);
                callback(newSlides[0]);
                pageInfo.nextPage++;
            });
        } else {
            callback(null);
        }
    },
    willQueryFirstOfDataDelegate: function (callback) {
        var self = this;
        if (pageInfo.prevPage > 0) {
            loadMoreData(pageInfo.prevPage, function (data) {
                var newSlides = buildSlides(data);
                self.addBeforeData(newSlides);
                callback(newSlides[newSlides.length-1]);
                pageInfo.prevPage--;
                console.log(self.data);
            });
        } else {
            callback(null);
        }
    }
});

function initSlide(data) {
    wrapper.style.display = "block";
    ImgManager.setClientSize(wrapper);

    var ds = new ImageSearchDataSource(buildSlides(data));
    ds.setCurrentIndex(pageInfo.initIndex);
    var sl = new slide.Slide(wrapper, ds);

    prevBtn.addEventListener(click, function(){
        sl.prev();
    }, false);
    nextBtn.addEventListener(click, function(){
        sl.next();
    }, false);
    sl.on("resize", function () {
        ImgManager.setClientSize(wrapper);
        sl.show();
    });

    setDesc();
    sl.on("startDrag", function (session) {
        session.targetEvent.preventDefault();
    });
    sl.on("next", setDesc);
    sl.on("prev", setDesc);
        function setDesc () {
            ds.queryCurrent(function (data) {
                psCount.innerHTML = '(<em>'+((pageInfo.prevPage*pageInfo.numPerPage)+ds.index+1)+'</em>/'+totalCount+')';
                footer.innerHTML = createDesc(data);
            });
        }

    var viewState = "block";
    sl.on("click", function() {
        if (viewState === "none") {
            setDisplay("block");
        } else {
            setDisplay("none");
        }
    });
        function setDisplay (state) {
            header.style.display = state;
            footer.style.display = state;
            prevBtn.style.display = state;
            nextBtn.style.display = state;
            viewState = state;
        }
}

function onImgLoad (el) {
    var imgSize = ImgManager.resizeImg(el.naturalWidth, el.naturalHeight);
    var imgOffset = ImgManager.getImgOffset(imgSize.width, imgSize.height);
    
    el.style.cssText = 'width:'+imgSize.width+'px;height:'+imgSize.height+'px;top:'+imgOffset.top+'px;left:'+imgOffset.left+'px;position:absolute;';
};
function onImgLoadError (el) {
    el.parentNode.style.background = "none";
};

function buildSlides(data) {
    totalCount = data.count;
    var items = data.list.data,
        arr = [];
    for (var i = 0, len = items.length; i < len; i++) {
        var item = items[i];
        arr.push({
            id : item.id,
            image: item.image,
            summary: item.summary,
            title: item.title,
            toHTML: function () {
                var cdnImgUrl = this.image.replace("http://photo-media.daum-img.net","http://m1.daumcdn.net/photo-media");
                return '<img alt="'+escape(this.title)+'" src="'+cdnImgUrl+'" style="position:absolute;width:1px;height:1px;" onload="onImgLoad(this);" onerror="onImgLoadError(this);" onabort="onImgLoadError(this);">';
            }
        });
    }
    return arr;
}


function createDesc (data) {
    return '<div id="title-wrap" style="opacity: 0.8; display: block;">'
            + '<div class="inner">'
                + '<a href="http://newslink.media.daum.net/mobile/'+data.id+'" class="title">'+data.title+'</a>'
                + '<span class="bar">|</span>'
                + '<a href="http://newslink.media.daum.net/mobile/'+data.id+'" class="link">기사보기</a>'
                + '<span class="ico"><span></span></span>'
            + '</div>'
          + '</div>';
}

(function main() {
    window.addEventListener("load", function(e){
        loadInitialData();
        closeBtn.addEventListener("click", function () {
            history.back();
        });
    });
})();

var ImgManager = {
    clientWidth: 0,
    clientHeight: 0,
    setClientSize: function (el) {
        this.clientHeight = el.clientHeight - 10;
        this.clientWidth = el.clientWidth - 10;
    },
    resizeImg: function (width, height) {
        if (this.clientHeight > this.clientWidth) {
            return this.potraitResizeImg(width, height);
        } else {
            return this.landscapeResizeImg(width, height);
        }
    },
    potraitResizeImg: function (width, height) {
        if (this.clientWidth * height > this.clientHeight * width) {
            return this.resizeByHeight(width, height);
        } else {
            return this.resizeByWidth(width, height);
        }
    },
    landscapeResizeImg: function (width, height) {
        if (this.clientWidth * height < this.clientHeight * width) {
            return this.resizeByWidth(width, height);
        } else {
            return this.resizeByHeight(width, height);
        }
    },
    resizeByHeight: function (width, height) {
        return {width: parseInt(this.clientHeight * width / height), height: this.clientHeight};
    },
    resizeByWidth: function (width, height) {
        return {width: this.clientWidth, height: parseInt(this.clientWidth * height / width)};
    },
    getImgOffset: function (width, height) {
        return {left: parseInt((this.clientWidth + 10 - width) / 2), top: parseInt((this.clientHeight + 10 - height) / 2)};
    }
};