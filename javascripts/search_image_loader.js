(function(exports) {
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
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.src = url;
            s.charset = "utf-8";
            this.pool.appendChild(s);
        },
        load: function (callback) {
            var self = this;
            this.pageNum += 1;
            this.simpleSearchAPIJsonp(function(data) {
                var datasource = self.build(data);
                callback(datasource);
            });
        },
        build: function(data) {
            var items = data.channel.item, arr = [];
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                arr.push({
                    thumbnail: item.thumbnail,
                    width: item.width,
                    height: item.height,
                    title: item.title,
                    link: item.link,
                    toHTML: function (panel, slide) {
                        var img = new Image();
                        img.className = 'image';
                        img.src = this.thumbnail;
                        img.onload = function() {
                            panel.draw('');
                            panel.el.appendChild(img);
                        };
                        img.ondragstart = function(e) {
                            DOMEvent.preventDefault(e);
                        };

                        return '<div class="spinner"></div>';
                    }
                });
            }
            return arr;
        }
    });
}(window));