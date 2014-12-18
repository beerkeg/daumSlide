(function(exports) {
    function createDesc (data, width) {
        var title = unescapeHTML(data.title);
        return '<div class="wrap_desc" style="width:' + width + 'px" id="desc_field">' +
            '<a href="'+data.link+'" class="tit" id="desc_title">'+ title +'</a>' +
            '<a href="'+data.link+'" id="desc_url" class="link_src">'+ data.link +'</a>' +
            '</div>';
    }

    function unescapeHTML (text) {
        return text.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,"\"").replace(/&#39;/g,"'");
    }

    function createImage(src) {
        var img = new Image();
        img.className = 'image';
        img.src = src;

        return img;
    }

    function lazyLoad(id, src) {
        var _img = createImage(src);
        function _clear() {
            DOMEvent.off(_img, 'load', _load);
            DOMEvent.off(_img, 'error', _clear);
            DOMEvent.off(_img, 'abort', _clear);
            DOMEvent.off(_img, 'dragstart', _dragstart);
            _img = null;
        }

        function _load(e) {
            var frame = document.querySelector('#_img' + id);
            if(!frame) {
                return _clear();
            }

            frame.appendChild(_img);
            frame.classList.remove('spinner');
        }

        function _dragstart(e) {
            DOMEvent.preventDefault(e);
        }

        DOMEvent.on(_img, 'load', _load);
        DOMEvent.on(_img, 'error', _clear);
        DOMEvent.on(_img, 'abort', _clear);
        DOMEvent.on(_img, 'dragstart', _dragstart);
    }

    exports.SearchImageLoader = Class.extend({
        init: function(query) {
            this.pool = document.getElementsByTagName("head")[0];
            this.query = encodeURIComponent(query);
            this.pageNum = 0;
            this.callbackId = 0;
        },
        simpleSearchAPIJsonp: function(callback) {
            var callbackId = '_simpleJsonpCallback' + (this.callbackId += 1);
            exports[callbackId] = callback;

            var url = 'https://apis.daum.net/search/image?q='+ this.query +
                '&output=json&callback=' + callbackId + '&pageno=' + this.pageNum +
                '&apikey=0bdf91fedab0c293962cd90855358777e15944d8';
            var elScript = document.createElement("script");
            elScript.type = "text/javascript";
            elScript.src = url;
            elScript.charset = "utf-8";

            this.pool.appendChild(elScript);
        },
        load: function (callback) {
            var self = this;
            this.pageNum += 1;
            this.simpleSearchAPIJsonp(function(data) {
                var datasource = self.build(data);
                callback(datasource);

                self.pool.removeChild(self.pool.lastChild);
            });
        },
        build: function(data) {
            var items = data.channel.item, arr = [];
            var date = Date.now();
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                arr.push({
                    thumbnail: item.thumbnail,
                    src: item.image,
                    width: item.width,
                    height: item.height,
                    title: item.title,
                    link: item.link,
                    id: date + i,
                    toHTML: function _toHTML(panel, slide) {
                        lazyLoad(this.id, this.src);
                        return '<div id="_img' + this.id + '" class="spinner"></div>';
                    }
                });
            }
            return arr;
        }
    });
}(window));