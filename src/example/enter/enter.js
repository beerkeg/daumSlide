
(function() {
    var u = "0.4.5",
        k = window.jQuery || window.$ || (window.$ = {}),
        f = {
            parse: window.JSON && (window.JSON.parse || window.JSON.decode) || String.prototype.evalJSON && function(G) {
                return String(G).evalJSON()
            } || k.parseJSON || k.evalJSON,
            stringify: Object.toJSON || window.JSON && (window.JSON.stringify || window.JSON.encode) || k.toJSON
        };
    if (!("parse" in f) || !("stringify" in f)) {
        throw new Error("No JSON support found, include //cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js to page")
    }
    var n = {
        __jstorage_meta: {
            CRC32: {}
        }
    }, c = {
        jStorage: "{}"
    }, z = null,
        p = 0,
        j = false,
        l = {}, D = false,
        A = 0,
        t = {}, y = +new Date(),
        B, C = {
            isXML: function(H) {
                var G = (H ? H.ownerDocument || H : 0).documentElement;
                return G ? G.nodeName !== "HTML" : false
            },
            encode: function(H) {
                if (!this.isXML(H)) {
                    return false
                }
                try {
                    return new XMLSerializer().serializeToString(H)
                } catch (G) {
                    try {
                        return H.xml
                    } catch (I) {}
                }
                return false
            },
            decode: function(H) {
                var G = ("DOMParser" in window && (new DOMParser()).parseFromString) || (window.ActiveXObject && function(J) {
                    var K = new ActiveXObject("Microsoft.XMLDOM");
                    K.async = "false";
                    K.loadXML(J);
                    return K
                }),
                    I;
                if (!G) {
                    return false
                }
                I = G.call("DOMParser" in window && (new DOMParser()) || window, H, "text/xml");
                return this.isXML(I) ? I : false
            }
        };

    function r() {
        var G = false;
        if ("localStorage" in window) {
            try {
                window.localStorage.setItem("_tmptest", "tmpval");
                G = true;
                window.localStorage.removeItem("_tmptest")
            } catch (H) {}
        }
        if (G) {
            try {
                if (window.localStorage) {
                    c = window.localStorage;
                    j = "localStorage";
                    A = c.jStorage_update
                }
            } catch (J) {}
        } else {
            if ("globalStorage" in window) {
                try {
                    if (window.globalStorage) {
                        if (window.location.hostname == "localhost") {
                            c = window.globalStorage["localhost.localdomain"]
                        } else {
                            c = window.globalStorage[window.location.hostname]
                        }
                        j = "globalStorage";
                        A = c.jStorage_update
                    }
                } catch (I) {}
            } else {
                z = null;
                return
            }
        }
        m();
        b();
        x();
        v();
        if ("addEventListener" in window) {
            window.addEventListener("pageshow", function(K) {
                if (K.persisted) {
                    q()
                }
            }, false)
        }
    }
    function e() {
        var I = "{}";
        if (j == "userDataBehavior") {
            z.load("jStorage");
            try {
                I = z.getAttribute("jStorage")
            } catch (H) {}
            try {
                A = z.getAttribute("jStorage_update")
            } catch (G) {}
            c.jStorage = I
        }
        m();
        b();
        v()
    }
    function x() {
        if (j == "localStorage" || j == "globalStorage") {
            if ("addEventListener" in window) {
                window.addEventListener("storage", q, false)
            } else {
                document.attachEvent("onstorage", q)
            }
        } else {
            if (j == "userDataBehavior") {
                setInterval(q, 1000)
            }
        }
    }
    function q() {
        var G;
        clearTimeout(D);
        D = setTimeout(function() {
            if (j == "localStorage" || j == "globalStorage") {
                G = c.jStorage_update
            } else {
                if (j == "userDataBehavior") {
                    z.load("jStorage");
                    try {
                        G = z.getAttribute("jStorage_update")
                    } catch (H) {}
                }
            }
            if (G && G != A) {
                A = G;
                i()
            }
        }, 25)
    }
    function i() {
        var G = f.parse(f.stringify(n.__jstorage_meta.CRC32)),
            K;
        e();
        K = f.parse(f.stringify(n.__jstorage_meta.CRC32));
        var I, H = [],
            J = [];
        for (I in G) {
            if (G.hasOwnProperty(I)) {
                if (!K[I]) {
                    J.push(I);
                    continue
                }
                if (G[I] != K[I] && String(G[I]).substr(0, 2) == "2.") {
                    H.push(I)
                }
            }
        }
        for (I in K) {
            if (K.hasOwnProperty(I)) {
                if (!G[I]) {
                    H.push(I)
                }
            }
        }
        F(H, "updated");
        F(J, "deleted")
    }
    function F(L, M) {
        L = [].concat(L || []);
        if (M == "flushed") {
            L = [];
            for (var K in l) {
                if (l.hasOwnProperty(K)) {
                    L.push(K)
                }
            }
            M = "deleted"
        }
        for (var J = 0, G = L.length; J < G; J++) {
            if (l[L[J]]) {
                for (var I = 0, H = l[L[J]].length; I < H; I++) {
                    l[L[J]][I](L[J], M)
                }
            }
            if (l["*"]) {
                for (var I = 0, H = l["*"].length; I < H; I++) {
                    l["*"][I](L[J], M)
                }
            }
        }
    }
    function o() {
        var H = (+new Date()).toString();
        if (j == "localStorage" || j == "globalStorage") {
            try {
                c.jStorage_update = H
            } catch (G) {
                j = false
            }
        } else {
            if (j == "userDataBehavior") {
                z.setAttribute("jStorage_update", H);
                z.save("jStorage")
            }
        }
        q()
    }
    function m() {
        if (c.jStorage) {
            try {
                n = f.parse(String(c.jStorage))
            } catch (G) {
                c.jStorage = "{}"
            }
        } else {
            c.jStorage = "{}"
        }
        p = c.jStorage ? String(c.jStorage).length : 0;
        if (!n.__jstorage_meta) {
            n.__jstorage_meta = {}
        }
        if (!n.__jstorage_meta.CRC32) {
            n.__jstorage_meta.CRC32 = {}
        }
    }
    function s() {
        a();
        try {
            c.jStorage = f.stringify(n);
            if (z) {
                z.setAttribute("jStorage", c.jStorage);
                z.save("jStorage")
            }
            p = c.jStorage ? String(c.jStorage).length : 0
        } catch (G) {}
    }
    function w(G) {
        if (!G || (typeof G != "string" && typeof G != "number")) {
            throw new TypeError("Key name must be string or numeric")
        }
        if (G == "__jstorage_meta") {
            throw new TypeError("Reserved key name")
        }
        return true
    }
    function b() {
        var M, H, K, I, J = Infinity,
            L = false,
            G = [];
        clearTimeout(B);
        if (!n.__jstorage_meta || typeof n.__jstorage_meta.TTL != "object") {
            return
        }
        M = +new Date();
        K = n.__jstorage_meta.TTL;
        I = n.__jstorage_meta.CRC32;
        for (H in K) {
            if (K.hasOwnProperty(H)) {
                if (K[H] <= M) {
                    delete K[H];
                    delete I[H];
                    delete n[H];
                    L = true;
                    G.push(H)
                } else {
                    if (K[H] < J) {
                        J = K[H]
                    }
                }
            }
        }
        if (J != Infinity) {
            B = setTimeout(b, J - M)
        }
        if (L) {
            s();
            o();
            F(G, "deleted")
        }
    }
    function v() {
        var J, H;
        if (!n.__jstorage_meta.PubSub) {
            return
        }
        var G, I = y;
        for (J = H = n.__jstorage_meta.PubSub.length - 1; J >= 0; J--) {
            G = n.__jstorage_meta.PubSub[J];
            if (G[0] > y) {
                I = G[0];
                d(G[1], G[2])
            }
        }
        y = I
    }
    function d(I, K) {
        if (t[I]) {
            for (var H = 0, G = t[I].length; H < G; H++) {
                try {
                    t[I][H](I, f.parse(f.stringify(K)))
                } catch (J) {}
            }
        }
    }
    function a() {
        if (!n.__jstorage_meta.PubSub) {
            return
        }
        var I = +new Date() - 2000;
        for (var H = 0, G = n.__jstorage_meta.PubSub.length; H < G; H++) {
            if (n.__jstorage_meta.PubSub[H][0] <= I) {
                n.__jstorage_meta.PubSub.splice(H, n.__jstorage_meta.PubSub.length - H);
                break
            }
        }
        if (!n.__jstorage_meta.PubSub.length) {
            delete n.__jstorage_meta.PubSub
        }
    }
    function g(G, H) {
        if (!n.__jstorage_meta) {
            n.__jstorage_meta = {}
        }
        if (!n.__jstorage_meta.PubSub) {
            n.__jstorage_meta.PubSub = []
        }
        n.__jstorage_meta.PubSub.unshift([+new Date, G, H]);
        s();
        o()
    }
    function E(L, H) {
        var G = L.length,
            K = H ^ G,
            J = 0,
            I;
        while (G >= 4) {
            I = ((L.charCodeAt(J) & 255)) | ((L.charCodeAt(++J) & 255) << 8) | ((L.charCodeAt(++J) & 255) << 16) | ((L.charCodeAt(++J) & 255) << 24);
            I = (((I & 65535) * 1540483477) + ((((I >>> 16) * 1540483477) & 65535) << 16));
            I ^= I >>> 24;
            I = (((I & 65535) * 1540483477) + ((((I >>> 16) * 1540483477) & 65535) << 16));
            K = (((K & 65535) * 1540483477) + ((((K >>> 16) * 1540483477) & 65535) << 16)) ^ I;
            G -= 4;
            ++J
        }
        switch (G) {
            case 3:
                K ^= (L.charCodeAt(J + 2) & 255) << 16;
            case 2:
                K ^= (L.charCodeAt(J + 1) & 255) << 8;
            case 1:
                K ^= (L.charCodeAt(J) & 255);
                K = (((K & 65535) * 1540483477) + ((((K >>> 16) * 1540483477) & 65535) << 16))
        }
        K ^= K >>> 13;
        K = (((K & 65535) * 1540483477) + ((((K >>> 16) * 1540483477) & 65535) << 16));
        K ^= K >>> 15;
        return K >>> 0
    }
    k.jStorage = {
        version: u,
        set: function(H, I, G) {
            w(H);
            G = G || {};
            if (typeof I == "undefined") {
                this.deleteKey(H);
                return I
            }
            if (C.isXML(I)) {
                I = {
                    _is_xml: true,
                    xml: C.encode(I)
                }
            } else {
                if (typeof I == "function") {
                    return undefined
                } else {
                    if (I && typeof I == "object") {
                        I = f.parse(f.stringify(I))
                    }
                }
            }
            n[H] = I;
            n.__jstorage_meta.CRC32[H] = "2." + E(f.stringify(I), 2538058380);
            this.setTTL(H, G.TTL || 0);
            F(H, "updated");
            return I
        },
        get: function(G, H) {
            w(G);
            if (G in n) {
                if (n[G] && typeof n[G] == "object" && n[G]._is_xml) {
                    return C.decode(n[G].xml)
                } else {
                    return n[G]
                }
            }
            return typeof(H) == "undefined" ? null : H
        },
        deleteKey: function(G) {
            w(G);
            if (G in n) {
                delete n[G];
                if (typeof n.__jstorage_meta.TTL == "object" && G in n.__jstorage_meta.TTL) {
                    delete n.__jstorage_meta.TTL[G]
                }
                delete n.__jstorage_meta.CRC32[G];
                s();
                o();
                F(G, "deleted");
                return true
            }
            return false
        },
        setTTL: function(H, G) {
            var I = +new Date();
            w(H);
            G = Number(G) || 0;
            if (H in n) {
                if (!n.__jstorage_meta.TTL) {
                    n.__jstorage_meta.TTL = {}
                }
                if (G > 0) {
                    n.__jstorage_meta.TTL[H] = I + G
                } else {
                    delete n.__jstorage_meta.TTL[H]
                }
                s();
                b();
                o();
                return true
            }
            return false
        },
        getTTL: function(H) {
            var I = +new Date(),
                G;
            w(H);
            if (H in n && n.__jstorage_meta.TTL && n.__jstorage_meta.TTL[H]) {
                G = n.__jstorage_meta.TTL[H] - I;
                return G || 0
            }
            return 0
        },
        flush: function() {
            n = {
                __jstorage_meta: {
                    CRC32: {}
                }
            };
            s();
            o();
            F(null, "flushed");
            return true
        },
        storageObj: function() {
            function G() {}
            G.prototype = n;
            return new G()
        },
        index: function() {
            var G = [],
                H;
            for (H in n) {
                if (n.hasOwnProperty(H) && H != "__jstorage_meta") {
                    G.push(H)
                }
            }
            return G
        },
        storageSize: function() {
            return p
        },
        currentBackend: function() {
            return j
        },
        storageAvailable: function() {
            return !!j
        },
        listenKeyChange: function(G, H) {
            w(G);
            if (!l[G]) {
                l[G] = []
            }
            l[G].push(H)
        },
        stopListening: function(H, I) {
            w(H);
            if (!l[H]) {
                return
            }
            if (!I) {
                delete l[H];
                return
            }
            for (var G = l[H].length - 1; G >= 0; G--) {
                if (l[H][G] == I) {
                    l[H].splice(G, 1)
                }
            }
        },
        subscribe: function(G, H) {
            G = (G || "").toString();
            if (!G) {
                throw new TypeError("Channel not defined")
            }
            if (!t[G]) {
                t[G] = []
            }
            t[G].push(H)
        },
        publish: function(G, H) {
            G = (G || "").toString();
            if (!G) {
                throw new TypeError("Channel not defined")
            }
            g(G, H)
        },
        reInit: function() {
            e()
        }
    };
    r()
})();
/*!
 * jQuery Cookie Plugin v1.3
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */ (function(f, b, g) {
    var a = /\+/g;

    function e(i) {
        return i
    }
    function c(i) {
        return decodeURIComponent(i.replace(a, " "))
    }
    var d = f.cookie = function(q, p, v) {
        if (p !== g) {
            v = f.extend({}, d.defaults, v);
            if (p === null) {
                v.expires = -1
            }
            if (typeof v.expires === "number") {
                var r = v.expires,
                    u = v.expires = new Date();
                u.setDate(u.getDate() + r)
            }
            p = d.json ? JSON.stringify(p) : String(p);
            return (b.cookie = [encodeURIComponent(q), "=", d.raw ? p : encodeURIComponent(p), v.expires ? "; expires=" + v.expires.toUTCString() : "", v.path ? "; path=" + v.path : "", v.domain ? "; domain=" + v.domain : "", v.secure ? "; secure" : ""].join(""))
        }
        var j = d.raw ? e : c;
        var s = b.cookie.split("; ");
        for (var o = 0, m = s.length; o < m; o++) {
            var n = s[o].split("=");
            if (j(n.shift()) === q) {
                var k = j(n.join("="));
                return d.json ? JSON.parse(k) : k
            }
        }
        return null
    };
    d.defaults = {};
    f.removeCookie = function(j, i) {
        if (f.cookie(j) !== null) {
            f.cookie(j, null, i);
            return true
        }
        return false
    }
})(jQuery, document);
/*!
 * jQuery Lazy - v0.1.5
 * http://jquery.eisbehr.de/lazy/
 *
 * Copyright 2013, Daniel 'Eisbehr' Kern
 *
 * Dual licensed under the MIT and GPL v2 licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 * jQuery("img.lazy").lazy();
 */ (function(c, b, a, d) {
    c.fn.lazy = function(j) {
        var m = {
            bind: "load",
            threshold: 500,
            fallbackHeight: 2000,
            visibleOnly: true,
            delay: -1,
            combined: false,
            attribute: "data-src",
            removeAttribute: true,
            effect: "show",
            effectTime: 0,
            enableThrottle: false,
            throttle: 250,
            beforeLoad: null,
            onLoad: null,
            afterLoad: null,
            onError: null
        };
        if (j) {
            c.extend(m, j)
        }
        var i = this;
        if (m.bind == "load") {
            c(b).load(k)
        } else {
            if (m.bind == "event") {
                k()
            }
        }
        if (m.onError) {
            i.bind("error", function() {
                m.onError(c(this))
            })
        }
        function f(n) {
            if (typeof n != "boolean") {
                n = false
            }
            i.each(function() {
                var o = c(this);
                if (o.attr(m.attribute) && o.attr(m.attribute) != o.attr("src") && !o.data("loaded") && (o.is(":visible") || !m.visibleOnly)) {
                    if (e(o) || n) {
                        if (m.afterLoad) {
                            o.bind("load", function() {
                                m.afterLoad(o);
                                o.unbind("load")
                            })
                        }
                        if (m.beforeLoad) {
                            m.beforeLoad(o)
                        }
                        o.hide().attr("src", o.attr(m.attribute))[m.effect](m.effectTime);
                        o.data("loaded", true);
                        if (m.onLoad) {
                            m.onLoad(o)
                        }
                        if (m.removeAttribute) {
                            o.removeAttr(m.attribute)
                        }
                    }
                }
            });
            i = c(i).filter(function() {
                return !c(this).data("loaded")
            })
        }
        function k() {
            if (m.delay >= 0) {
                setTimeout(function() {
                    f(true)
                }, m.delay)
            }
            if (m.delay < 0 || m.combined) {
                f();
                c(b).bind("scroll", l(m.throttle, f));
                c(b).bind("resize", l(m.throttle, f))
            }
        }
        function e(n) {
            var o = a.documentElement.scrollTop ? a.documentElement.scrollTop : a.body.scrollTop;
            if ((o + g() + m.threshold) > (n.offset().top + n.height())) {
                return true
            }
            return false
        }
        function g() {
            if (b.innerHeight) {
                return b.innerHeight
            }
            if (a.documentElement && a.documentElement.clientHeight) {
                return a.documentElement.clientHeight
            }
            if (a.body && a.body.clientHeight) {
                return a.body.clientHeight
            }
            if (a.body && a.body.offsetHeight) {
                return a.body.offsetHeight
            }
            return m.fallbackHeight
        }
        function l(o, q) {
            var p;
            var r = 0;

            function n() {
                var s = +new Date() - r;

                function t() {
                    r = +new Date();
                    q.apply()
                }
                p && clearTimeout(p);
                if (s > o || !m.enableThrottle) {
                    t()
                } else {
                    p = setTimeout(t, o - s)
                }
            }
            return n
        }
        return this
    };
    c.fn.Lazy = c.fn.lazy
})(jQuery, window, document);
(function() {
    var x = this;
    var l = x._;
    var E = {};
    var D = Array.prototype,
        f = Object.prototype,
        s = Function.prototype;
    var H = D.push,
        p = D.slice,
        z = D.concat,
        d = f.toString,
        k = f.hasOwnProperty;
    var L = D.forEach,
        r = D.map,
        F = D.reduce,
        c = D.reduceRight,
        b = D.filter,
        C = D.every,
        q = D.some,
        o = D.indexOf,
        m = D.lastIndexOf,
        v = Array.isArray,
        e = Object.keys,
        G = s.bind;
    var M = function(N) {
        if (N instanceof M) {
            return N
        }
        if (!(this instanceof M)) {
            return new M(N)
        }
        this._wrapped = N
    };
    if (typeof exports !== "undefined") {
        if (typeof module !== "undefined" && module.exports) {
            exports = module.exports = M
        }
        exports._ = M
    } else {
        x._ = M
    }
    M.VERSION = "1.4.4";
    var I = M.each = M.forEach = function(S, R, Q) {
        if (S == null) {
            return
        }
        if (L && S.forEach === L) {
            S.forEach(R, Q)
        } else {
            if (S.length === +S.length) {
                for (var P = 0, N = S.length; P < N; P++) {
                    if (R.call(Q, S[P], P, S) === E) {
                        return
                    }
                }
            } else {
                for (var O in S) {
                    if (M.has(S, O)) {
                        if (R.call(Q, S[O], O, S) === E) {
                            return
                        }
                    }
                }
            }
        }
    };
    M.map = M.collect = function(Q, P, O) {
        var N = [];
        if (Q == null) {
            return N
        }
        if (r && Q.map === r) {
            return Q.map(P, O)
        }
        I(Q, function(T, R, S) {
            N[N.length] = P.call(O, T, R, S)
        });
        return N
    };
    var g = "Reduce of empty array with no initial value";
    M.reduce = M.foldl = M.inject = function(R, Q, N, P) {
        var O = arguments.length > 2;
        if (R == null) {
            R = []
        }
        if (F && R.reduce === F) {
            if (P) {
                Q = M.bind(Q, P)
            }
            return O ? R.reduce(Q, N) : R.reduce(Q)
        }
        I(R, function(U, S, T) {
            if (!O) {
                N = U;
                O = true
            } else {
                N = Q.call(P, N, U, S, T)
            }
        });
        if (!O) {
            throw new TypeError(g)
        }
        return N
    };
    M.reduceRight = M.foldr = function(T, Q, N, P) {
        var O = arguments.length > 2;
        if (T == null) {
            T = []
        }
        if (c && T.reduceRight === c) {
            if (P) {
                Q = M.bind(Q, P)
            }
            return O ? T.reduceRight(Q, N) : T.reduceRight(Q)
        }
        var S = T.length;
        if (S !== +S) {
            var R = M.keys(T);
            S = R.length
        }
        I(T, function(W, U, V) {
            U = R ? R[--S] : --S;
            if (!O) {
                N = T[U];
                O = true
            } else {
                N = Q.call(P, N, T[U], U, V)
            }
        });
        if (!O) {
            throw new TypeError(g)
        }
        return N
    };
    M.find = M.detect = function(Q, P, O) {
        var N;
        B(Q, function(T, R, S) {
            if (P.call(O, T, R, S)) {
                N = T;
                return true
            }
        });
        return N
    };
    M.filter = M.select = function(Q, P, O) {
        var N = [];
        if (Q == null) {
            return N
        }
        if (b && Q.filter === b) {
            return Q.filter(P, O)
        }
        I(Q, function(T, R, S) {
            if (P.call(O, T, R, S)) {
                N[N.length] = T
            }
        });
        return N
    };
    M.reject = function(P, O, N) {
        return M.filter(P, function(S, Q, R) {
            return !O.call(N, S, Q, R)
        }, N)
    };
    M.every = M.all = function(Q, P, O) {
        P || (P = M.identity);
        var N = true;
        if (Q == null) {
            return N
        }
        if (C && Q.every === C) {
            return Q.every(P, O)
        }
        I(Q, function(T, R, S) {
            if (!(N = N && P.call(O, T, R, S))) {
                return E
            }
        });
        return !!N
    };
    var B = M.some = M.any = function(Q, P, O) {
        P || (P = M.identity);
        var N = false;
        if (Q == null) {
            return N
        }
        if (q && Q.some === q) {
            return Q.some(P, O)
        }
        I(Q, function(T, R, S) {
            if (N || (N = P.call(O, T, R, S))) {
                return E
            }
        });
        return !!N
    };
    M.contains = M.include = function(O, N) {
        if (O == null) {
            return false
        }
        if (o && O.indexOf === o) {
            return O.indexOf(N) != -1
        }
        return B(O, function(P) {
            return P === N
        })
    };
    M.invoke = function(P, Q) {
        var N = p.call(arguments, 2);
        var O = M.isFunction(Q);
        return M.map(P, function(R) {
            return (O ? Q : R[Q]).apply(R, N)
        })
    };
    M.pluck = function(O, N) {
        return M.map(O, function(P) {
            return P[N]
        })
    };
    M.where = function(O, N, P) {
        if (M.isEmpty(N)) {
            return P ? null : []
        }
        return M[P ? "find" : "filter"](O, function(R) {
            for (var Q in N) {
                if (N[Q] !== R[Q]) {
                    return false
                }
            }
            return true
        })
    };
    M.findWhere = function(O, N) {
        return M.where(O, N, true)
    };
    M.max = function(Q, P, O) {
        if (!P && M.isArray(Q) && Q[0] === +Q[0] && Q.length < 65535) {
            return Math.max.apply(Math, Q)
        }
        if (!P && M.isEmpty(Q)) {
            return -Infinity
        }
        var N = {
            computed: -Infinity,
            value: -Infinity
        };
        I(Q, function(U, R, T) {
            var S = P ? P.call(O, U, R, T) : U;
            S >= N.computed && (N = {
                value: U,
                computed: S
            })
        });
        return N.value
    };
    M.min = function(Q, P, O) {
        if (!P && M.isArray(Q) && Q[0] === +Q[0] && Q.length < 65535) {
            return Math.min.apply(Math, Q)
        }
        if (!P && M.isEmpty(Q)) {
            return Infinity
        }
        var N = {
            computed: Infinity,
            value: Infinity
        };
        I(Q, function(U, R, T) {
            var S = P ? P.call(O, U, R, T) : U;
            S < N.computed && (N = {
                value: U,
                computed: S
            })
        });
        return N.value
    };
    M.shuffle = function(Q) {
        var P;
        var O = 0;
        var N = [];
        I(Q, function(R) {
            P = M.random(O++);
            N[O - 1] = N[P];
            N[P] = R
        });
        return N
    };
    var a = function(N) {
        return M.isFunction(N) ? N : function(O) {
            return O[N]
        }
    };
    M.sortBy = function(Q, P, N) {
        var O = a(P);
        return M.pluck(M.map(Q, function(T, R, S) {
            return {
                value: T,
                index: R,
                criteria: O.call(N, T, R, S)
            }
        }).sort(function(U, T) {
            var S = U.criteria;
            var R = T.criteria;
            if (S !== R) {
                if (S > R || S === void 0) {
                    return 1
                }
                if (S < R || R === void 0) {
                    return -1
                }
            }
            return U.index < T.index ? -1 : 1
        }), "value")
    };
    var u = function(S, R, O, Q) {
        var N = {};
        var P = a(R || M.identity);
        I(S, function(V, T) {
            var U = P.call(O, V, T, S);
            Q(N, U, V)
        });
        return N
    };
    M.groupBy = function(P, O, N) {
        return u(P, O, N, function(Q, R, S) {
            (M.has(Q, R) ? Q[R] : (Q[R] = [])).push(S)
        })
    };
    M.countBy = function(P, O, N) {
        return u(P, O, N, function(Q, R) {
            if (!M.has(Q, R)) {
                Q[R] = 0
            }
            Q[R]++
        })
    };
    M.sortedIndex = function(U, T, Q, P) {
        Q = Q == null ? M.identity : a(Q);
        var S = Q.call(P, T);
        var N = 0,
            R = U.length;
        while (N < R) {
            var O = (N + R) >>> 1;
            Q.call(P, U[O]) < S ? N = O + 1 : R = O
        }
        return N
    };
    M.toArray = function(N) {
        if (!N) {
            return []
        }
        if (M.isArray(N)) {
            return p.call(N)
        }
        if (N.length === +N.length) {
            return M.map(N, M.identity)
        }
        return M.values(N)
    };
    M.size = function(N) {
        if (N == null) {
            return 0
        }
        return (N.length === +N.length) ? N.length : M.keys(N).length
    };
    M.first = M.head = M.take = function(P, O, N) {
        if (P == null) {
            return void 0
        }
        return (O != null) && !N ? p.call(P, 0, O) : P[0]
    };
    M.initial = function(P, O, N) {
        return p.call(P, 0, P.length - ((O == null) || N ? 1 : O))
    };
    M.last = function(P, O, N) {
        if (P == null) {
            return void 0
        }
        if ((O != null) && !N) {
            return p.call(P, Math.max(P.length - O, 0))
        } else {
            return P[P.length - 1]
        }
    };
    M.rest = M.tail = M.drop = function(P, O, N) {
        return p.call(P, (O == null) || N ? 1 : O)
    };
    M.compact = function(N) {
        return M.filter(N, M.identity)
    };
    var y = function(O, P, N) {
        I(O, function(Q) {
            if (M.isArray(Q)) {
                P ? H.apply(N, Q) : y(Q, P, N)
            } else {
                N.push(Q)
            }
        });
        return N
    };
    M.flatten = function(O, N) {
        return y(O, N, [])
    };
    M.without = function(N) {
        return M.difference(N, p.call(arguments, 1))
    };
    M.uniq = M.unique = function(T, S, R, Q) {
        if (M.isFunction(S)) {
            Q = R;
            R = S;
            S = false
        }
        var O = R ? M.map(T, R, Q) : T;
        var P = [];
        var N = [];
        I(O, function(V, U) {
            if (S ? (!U || N[N.length - 1] !== V) : !M.contains(N, V)) {
                N.push(V);
                P.push(T[U])
            }
        });
        return P
    };
    M.union = function() {
        return M.uniq(z.apply(D, arguments))
    };
    M.intersection = function(O) {
        var N = p.call(arguments, 1);
        return M.filter(M.uniq(O), function(P) {
            return M.every(N, function(Q) {
                return M.indexOf(Q, P) >= 0
            })
        })
    };
    M.difference = function(O) {
        var N = z.apply(D, p.call(arguments, 1));
        return M.filter(O, function(P) {
            return !M.contains(N, P)
        })
    };
    M.zip = function() {
        var N = p.call(arguments);
        var Q = M.max(M.pluck(N, "length"));
        var P = new Array(Q);
        for (var O = 0; O < Q; O++) {
            P[O] = M.pluck(N, "" + O)
        }
        return P
    };
    M.object = function(R, P) {
        if (R == null) {
            return {}
        }
        var N = {};
        for (var Q = 0, O = R.length; Q < O; Q++) {
            if (P) {
                N[R[Q]] = P[Q]
            } else {
                N[R[Q][0]] = R[Q][1]
            }
        }
        return N
    };
    M.indexOf = function(R, P, Q) {
        if (R == null) {
            return -1
        }
        var O = 0,
            N = R.length;
        if (Q) {
            if (typeof Q == "number") {
                O = (Q < 0 ? Math.max(0, N + Q) : Q)
            } else {
                O = M.sortedIndex(R, P);
                return R[O] === P ? O : -1
            }
        }
        if (o && R.indexOf === o) {
            return R.indexOf(P, Q)
        }
        for (; O < N; O++) {
            if (R[O] === P) {
                return O
            }
        }
        return -1
    };
    M.lastIndexOf = function(R, P, Q) {
        if (R == null) {
            return -1
        }
        var N = Q != null;
        if (m && R.lastIndexOf === m) {
            return N ? R.lastIndexOf(P, Q) : R.lastIndexOf(P)
        }
        var O = (N ? Q : R.length);
        while (O--) {
            if (R[O] === P) {
                return O
            }
        }
        return -1
    };
    M.range = function(S, Q, R) {
        if (arguments.length <= 1) {
            Q = S || 0;
            S = 0
        }
        R = arguments[2] || 1;
        var O = Math.max(Math.ceil((Q - S) / R), 0);
        var N = 0;
        var P = new Array(O);
        while (N < O) {
            P[N++] = S;
            S += R
        }
        return P
    };
    M.bind = function(P, O) {
        if (P.bind === G && G) {
            return G.apply(P, p.call(arguments, 1))
        }
        var N = p.call(arguments, 2);
        return function() {
            return P.apply(O, N.concat(p.call(arguments)))
        }
    };
    M.partial = function(O) {
        var N = p.call(arguments, 1);
        return function() {
            return O.apply(this, N.concat(p.call(arguments)))
        }
    };
    M.bindAll = function(O) {
        var N = p.call(arguments, 1);
        if (N.length === 0) {
            N = M.functions(O)
        }
        I(N, function(P) {
            O[P] = M.bind(O[P], O)
        });
        return O
    };
    M.memoize = function(P, O) {
        var N = {};
        O || (O = M.identity);
        return function() {
            var Q = O.apply(this, arguments);
            return M.has(N, Q) ? N[Q] : (N[Q] = P.apply(this, arguments))
        }
    };
    M.delay = function(O, P) {
        var N = p.call(arguments, 2);
        return setTimeout(function() {
            return O.apply(null, N)
        }, P)
    };
    M.defer = function(N) {
        return M.delay.apply(M, [N, 1].concat(p.call(arguments, 1)))
    };
    M.throttle = function(S, U) {
        var Q, P, T, N;
        var R = 0;
        var O = function() {
            R = new Date;
            T = null;
            N = S.apply(Q, P)
        };
        return function() {
            var V = new Date;
            var W = U - (V - R);
            Q = this;
            P = arguments;
            if (W <= 0) {
                clearTimeout(T);
                T = null;
                R = V;
                N = S.apply(Q, P)
            } else {
                if (!T) {
                    T = setTimeout(O, W)
                }
            }
            return N
        }
    };
    M.debounce = function(P, R, O) {
        var Q, N;
        return function() {
            var V = this,
                U = arguments;
            var T = function() {
                Q = null;
                if (!O) {
                    N = P.apply(V, U)
                }
            };
            var S = O && !Q;
            clearTimeout(Q);
            Q = setTimeout(T, R);
            if (S) {
                N = P.apply(V, U)
            }
            return N
        }
    };
    M.once = function(P) {
        var N = false,
            O;
        return function() {
            if (N) {
                return O
            }
            N = true;
            O = P.apply(this, arguments);
            P = null;
            return O
        }
    };
    M.wrap = function(N, O) {
        return function() {
            var P = [N];
            H.apply(P, arguments);
            return O.apply(this, P)
        }
    };
    M.compose = function() {
        var N = arguments;
        return function() {
            var O = arguments;
            for (var P = N.length - 1; P >= 0; P--) {
                O = [N[P].apply(this, O)]
            }
            return O[0]
        }
    };
    M.after = function(O, N) {
        if (O <= 0) {
            return N()
        }
        return function() {
            if (--O < 1) {
                return N.apply(this, arguments)
            }
        }
    };
    M.keys = e || function(P) {
        if (P !== Object(P)) {
            throw new TypeError("Invalid object")
        }
        var O = [];
        for (var N in P) {
            if (M.has(P, N)) {
                O[O.length] = N
            }
        }
        return O
    };
    M.values = function(P) {
        var N = [];
        for (var O in P) {
            if (M.has(P, O)) {
                N.push(P[O])
            }
        }
        return N
    };
    M.pairs = function(P) {
        var O = [];
        for (var N in P) {
            if (M.has(P, N)) {
                O.push([N, P[N]])
            }
        }
        return O
    };
    M.invert = function(P) {
        var N = {};
        for (var O in P) {
            if (M.has(P, O)) {
                N[P[O]] = O
            }
        }
        return N
    };
    M.functions = M.methods = function(P) {
        var O = [];
        for (var N in P) {
            if (M.isFunction(P[N])) {
                O.push(N)
            }
        }
        return O.sort()
    };
    M.extend = function(N) {
        I(p.call(arguments, 1), function(O) {
            if (O) {
                for (var P in O) {
                    N[P] = O[P]
                }
            }
        });
        return N
    };
    M.pick = function(O) {
        var P = {};
        var N = z.apply(D, p.call(arguments, 1));
        I(N, function(Q) {
            if (Q in O) {
                P[Q] = O[Q]
            }
        });
        return P
    };
    M.omit = function(P) {
        var Q = {};
        var O = z.apply(D, p.call(arguments, 1));
        for (var N in P) {
            if (!M.contains(O, N)) {
                Q[N] = P[N]
            }
        }
        return Q
    };
    M.defaults = function(N) {
        I(p.call(arguments, 1), function(O) {
            if (O) {
                for (var P in O) {
                    if (N[P] == null) {
                        N[P] = O[P]
                    }
                }
            }
        });
        return N
    };
    M.clone = function(N) {
        if (!M.isObject(N)) {
            return N
        }
        return M.isArray(N) ? N.slice() : M.extend({}, N)
    };
    M.tap = function(O, N) {
        N(O);
        return O
    };
    var J = function(U, T, O, P) {
        if (U === T) {
            return U !== 0 || 1 / U == 1 / T
        }
        if (U == null || T == null) {
            return U === T
        }
        if (U instanceof M) {
            U = U._wrapped
        }
        if (T instanceof M) {
            T = T._wrapped
        }
        var R = d.call(U);
        if (R != d.call(T)) {
            return false
        }
        switch (R) {
            case "[object String]":
                return U == String(T);
            case "[object Number]":
                return U != +U ? T != +T : (U == 0 ? 1 / U == 1 / T : U == +T);
            case "[object Date]":
            case "[object Boolean]":
                return +U == +T;
            case "[object RegExp]":
                return U.source == T.source && U.global == T.global && U.multiline == T.multiline && U.ignoreCase == T.ignoreCase
        }
        if (typeof U != "object" || typeof T != "object") {
            return false
        }
        var N = O.length;
        while (N--) {
            if (O[N] == U) {
                return P[N] == T
            }
        }
        O.push(U);
        P.push(T);
        var W = 0,
            X = true;
        if (R == "[object Array]") {
            W = U.length;
            X = W == T.length;
            if (X) {
                while (W--) {
                    if (!(X = J(U[W], T[W], O, P))) {
                        break
                    }
                }
            }
        } else {
            var S = U.constructor,
                Q = T.constructor;
            if (S !== Q && !(M.isFunction(S) && (S instanceof S) && M.isFunction(Q) && (Q instanceof Q))) {
                return false
            }
            for (var V in U) {
                if (M.has(U, V)) {
                    W++;
                    if (!(X = M.has(T, V) && J(U[V], T[V], O, P))) {
                        break
                    }
                }
            }
            if (X) {
                for (V in T) {
                    if (M.has(T, V) && !(W--)) {
                        break
                    }
                }
                X = !W
            }
        }
        O.pop();
        P.pop();
        return X
    };
    M.isEqual = function(O, N) {
        return J(O, N, [], [])
    };
    M.isEmpty = function(O) {
        if (O == null) {
            return true
        }
        if (M.isArray(O) || M.isString(O)) {
            return O.length === 0
        }
        for (var N in O) {
            if (M.has(O, N)) {
                return false
            }
        }
        return true
    };
    M.isElement = function(N) {
        return !!(N && N.nodeType === 1)
    };
    M.isArray = v || function(N) {
        return d.call(N) == "[object Array]"
    };
    M.isObject = function(N) {
        return N === Object(N)
    };
    I(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(N) {
        M["is" + N] = function(O) {
            return d.call(O) == "[object " + N + "]"
        }
    });
    if (!M.isArguments(arguments)) {
        M.isArguments = function(N) {
            return !!(N && M.has(N, "callee"))
        }
    }
    if (typeof(/./) !== "function") {
        M.isFunction = function(N) {
            return typeof N === "function"
        }
    }
    M.isFinite = function(N) {
        return isFinite(N) && !isNaN(parseFloat(N))
    };
    M.isNaN = function(N) {
        return M.isNumber(N) && N != +N
    };
    M.isBoolean = function(N) {
        return N === true || N === false || d.call(N) == "[object Boolean]"
    };
    M.isNull = function(N) {
        return N === null
    };
    M.isUndefined = function(N) {
        return N === void 0
    };
    M.has = function(O, N) {
        return k.call(O, N)
    };
    M.noConflict = function() {
        x._ = l;
        return this
    };
    M.identity = function(N) {
        return N
    };
    M.times = function(R, Q, P) {
        var N = Array(R);
        for (var O = 0; O < R; O++) {
            N[O] = Q.call(P, O)
        }
        return N
    };
    M.random = function(O, N) {
        if (N == null) {
            N = O;
            O = 0
        }
        return O + Math.floor(Math.random() * (N - O + 1))
    };
    var n = {
        escape: {
            "&": "&",
            "<": "<",
            ">": ">",
            '"': '"',
            "'": "'",
            "/": "/"
        }
    };
    n.unescape = M.invert(n.escape);
    var K = {
        escape: new RegExp("[" + M.keys(n.escape).join("") + "]", "g"),
        unescape: new RegExp("(" + M.keys(n.unescape).join("|") + ")", "g")
    };
    M.each(["escape", "unescape"], function(N) {
        M[N] = function(O) {
            if (O == null) {
                return ""
            }
            return ("" + O).replace(K[N], function(P) {
                return n[N][P]
            })
        }
    });
    M.result = function(N, P) {
        if (N == null) {
            return null
        }
        var O = N[P];
        return M.isFunction(O) ? O.call(N) : O
    };
    M.mixin = function(N) {
        I(M.functions(N), function(O) {
            var P = M[O] = N[O];
            M.prototype[O] = function() {
                var Q = [this._wrapped];
                H.apply(Q, arguments);
                return t.call(this, P.apply(M, Q))
            }
        })
    };
    var A = 0;
    M.uniqueId = function(N) {
        var O = ++A + "";
        return N ? N + O : O
    };
    M.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    var w = /(.)^/;
    var i = {
        "'": "'",
        "\\": "\\",
        "\r": "r",
        "\n": "n",
        "\t": "t",
        "\u2028": "u2028",
        "\u2029": "u2029"
    };
    var j = /\\|'|\r|\n|\t|\u2028|\u2029/g;
    M.template = function(V, Q, P) {
        var O;
        P = M.defaults({}, P, M.templateSettings);
        var R = new RegExp([(P.escape || w).source, (P.interpolate || w).source, (P.evaluate || w).source].join("|") + "|$", "g");
        var S = 0;
        var N = "__p+='";
        V.replace(R, function(X, Y, W, aa, Z) {
            N += V.slice(S, Z).replace(j, function(ab) {
                return "\\" + i[ab]
            });
            if (Y) {
                N += "'+\n((__t=(" + Y + "))==null?'':_.escape(__t))+\n'"
            }
            if (W) {
                N += "'+\n((__t=(" + W + "))==null?'':__t)+\n'"
            }
            if (aa) {
                N += "';\n" + aa + "\n__p+='"
            }
            S = Z + X.length;
            return X
        });
        N += "';\n";
        if (!P.variable) {
            N = "with(obj||{}){\n" + N + "}\n"
        }
        N = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + N + "return __p;\n";
        try {
            O = new Function(P.variable || "obj", "_", N)
        } catch (T) {
            T.source = N;
            throw T
        }
        if (Q) {
            return O(Q, M)
        }
        var U = function(W) {
            return O.call(this, W, M)
        };
        U.source = "function(" + (P.variable || "obj") + "){\n" + N + "}";
        return U
    };
    M.chain = function(N) {
        return M(N).chain()
    };
    var t = function(N) {
        return this._chain ? M(N).chain() : N
    };
    M.mixin(M);
    I(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(N) {
        var O = D[N];
        M.prototype[N] = function() {
            var P = this._wrapped;
            O.apply(P, arguments);
            if ((N == "shift" || N == "splice") && P.length === 0) {
                delete P[0]
            }
            return t.call(this, P)
        }
    });
    I(["concat", "join", "slice"], function(N) {
        var O = D[N];
        M.prototype[N] = function() {
            return t.call(this, O.apply(this._wrapped, arguments))
        }
    });
    M.extend(M.prototype, {
        chain: function() {
            this._chain = true;
            return this
        },
        value: function() {
            return this._wrapped
        }
    })
}).call(this);
(function() {
    var v = this;
    var C = v.Backbone;
    var g = [];
    var E = g.push;
    var o = g.slice;
    var u = g.splice;
    var A;
    if (typeof exports !== "undefined") {
        A = exports
    } else {
        A = v.Backbone = {}
    }
    A.VERSION = "1.0.0";
    var M = v._;
    if (!M && (typeof require !== "undefined")) {
        M = require("underscore")
    }
    A.$ = v.jQuery || v.Zepto || v.ender || v.$;
    A.noConflict = function() {
        v.Backbone = C;
        return this
    };
    A.emulateHTTP = false;
    A.emulateJSON = false;
    var K = A.Events = {
        on: function(N, Q, P) {
            if (!y(this, "on", N, [Q, P]) || !Q) {
                return this
            }
            this._events || (this._events = {});
            var O = this._events[N] || (this._events[N] = []);
            O.push({
                callback: Q,
                context: P,
                ctx: P || this
            });
            return this
        },
        once: function(O, R, P) {
            if (!y(this, "once", O, [R, P]) || !R) {
                return this
            }
            var N = this;
            var Q = M.once(function() {
                N.off(O, Q);
                R.apply(this, arguments)
            });
            Q._callback = R;
            return this.on(O, Q, P)
        },
        off: function(N, W, O) {
            var U, V, X, T, S, P, R, Q;
            if (!this._events || !y(this, "off", N, [W, O])) {
                return this
            }
            if (!N && !W && !O) {
                this._events = {};
                return this
            }
            T = N ? [N] : M.keys(this._events);
            for (S = 0, P = T.length; S < P; S++) {
                N = T[S];
                if (X = this._events[N]) {
                    this._events[N] = U = [];
                    if (W || O) {
                        for (R = 0, Q = X.length; R < Q; R++) {
                            V = X[R];
                            if ((W && W !== V.callback && W !== V.callback._callback) || (O && O !== V.context)) {
                                U.push(V)
                            }
                        }
                    }
                    if (!U.length) {
                        delete this._events[N]
                    }
                }
            }
            return this
        },
        trigger: function(P) {
            if (!this._events) {
                return this
            }
            var O = o.call(arguments, 1);
            if (!y(this, "trigger", P, O)) {
                return this
            }
            var Q = this._events[P];
            var N = this._events.all;
            if (Q) {
                b(Q, O)
            }
            if (N) {
                b(N, arguments)
            }
            return this
        },
        stopListening: function(Q, N, S) {
            var O = this._listeners;
            if (!O) {
                return this
            }
            var P = !N && !S;
            if (typeof N === "object") {
                S = this
            }
            if (Q) {
                (O = {})[Q._listenerId] = Q
            }
            for (var R in O) {
                O[R].off(N, S, this);
                if (P) {
                    delete this._listeners[R]
                }
            }
            return this
        }
    };
    var x = /\s+/;
    var y = function(U, S, O, R) {
        if (!O) {
            return true
        }
        if (typeof O === "object") {
            for (var Q in O) {
                U[S].apply(U, [Q, O[Q]].concat(R))
            }
            return false
        }
        if (x.test(O)) {
            var T = O.split(x);
            for (var P = 0, N = T.length; P < N; P++) {
                U[S].apply(U, [T[P]].concat(R))
            }
            return false
        }
        return true
    };
    var b = function(S, Q) {
        var T, R = -1,
            P = S.length,
            O = Q[0],
            N = Q[1],
            U = Q[2];
        switch (Q.length) {
            case 0:
                while (++R < P) {
                    (T = S[R]).callback.call(T.ctx)
                }
                return;
            case 1:
                while (++R < P) {
                    (T = S[R]).callback.call(T.ctx, O)
                }
                return;
            case 2:
                while (++R < P) {
                    (T = S[R]).callback.call(T.ctx, O, N)
                }
                return;
            case 3:
                while (++R < P) {
                    (T = S[R]).callback.call(T.ctx, O, N, U)
                }
                return;
            default:
                while (++R < P) {
                    (T = S[R]).callback.apply(T.ctx, Q)
                }
        }
    };
    var D = {
        listenTo: "on",
        listenToOnce: "once"
    };
    M.each(D, function(N, O) {
        K[O] = function(R, P, T) {
            var Q = this._listeners || (this._listeners = {});
            var S = R._listenerId || (R._listenerId = M.uniqueId("l"));
            Q[S] = R;
            if (typeof P === "object") {
                T = this
            }
            R[N](P, T, this);
            return this
        }
    });
    K.bind = K.on;
    K.unbind = K.off;
    M.extend(A, K);
    var F = A.Model = function(N, P) {
        var Q;
        var O = N || {};
        P || (P = {});
        this.cid = M.uniqueId("c");
        this.attributes = {};
        M.extend(this, M.pick(P, G));
        if (P.parse) {
            O = this.parse(O, P) || {}
        }
        if (Q = M.result(this, "defaults")) {
            O = M.defaults({}, O, Q)
        }
        this.set(O, P);
        this.changed = {};
        this.initialize.apply(this, arguments)
    };
    var G = ["url", "urlRoot", "collection"];
    M.extend(F.prototype, K, {
        changed: null,
        validationError: null,
        idAttribute: "id",
        initialize: function() {},
        toJSON: function(N) {
            return M.clone(this.attributes)
        },
        sync: function() {
            return A.sync.apply(this, arguments)
        },
        get: function(N) {
            return this.attributes[N]
        },
        escape: function(N) {
            return M.escape(this.get(N))
        },
        has: function(N) {
            return this.get(N) != null
        },
        set: function(V, N, Z) {
            var T, W, X, U, S, Y, P, R;
            if (V == null) {
                return this
            }
            if (typeof V === "object") {
                W = V;
                Z = N
            } else {
                (W = {})[V] = N
            }
            Z || (Z = {});
            if (!this._validate(W, Z)) {
                return false
            }
            X = Z.unset;
            S = Z.silent;
            U = [];
            Y = this._changing;
            this._changing = true;
            if (!Y) {
                this._previousAttributes = M.clone(this.attributes);
                this.changed = {}
            }
            R = this.attributes, P = this._previousAttributes;
            if (this.idAttribute in W) {
                this.id = W[this.idAttribute]
            }
            for (T in W) {
                N = W[T];
                if (!M.isEqual(R[T], N)) {
                    U.push(T)
                }
                if (!M.isEqual(P[T], N)) {
                    this.changed[T] = N
                } else {
                    delete this.changed[T]
                }
                X ? delete R[T] : R[T] = N
            }
            if (!S) {
                if (U.length) {
                    this._pending = true
                }
                for (var Q = 0, O = U.length; Q < O; Q++) {
                    this.trigger("change:" + U[Q], this, R[U[Q]], Z)
                }
            }
            if (Y) {
                return this
            }
            if (!S) {
                while (this._pending) {
                    this._pending = false;
                    this.trigger("change", this, Z)
                }
            }
            this._pending = false;
            this._changing = false;
            return this
        },
        unset: function(N, O) {
            return this.set(N, void 0, M.extend({}, O, {
                unset: true
            }))
        },
        clear: function(O) {
            var N = {};
            for (var P in this.attributes) {
                N[P] = void 0
            }
            return this.set(N, M.extend({}, O, {
                unset: true
            }))
        },
        hasChanged: function(N) {
            if (N == null) {
                return !M.isEmpty(this.changed)
            }
            return M.has(this.changed, N)
        },
        changedAttributes: function(P) {
            if (!P) {
                return this.hasChanged() ? M.clone(this.changed) : false
            }
            var R, Q = false;
            var O = this._changing ? this._previousAttributes : this.attributes;
            for (var N in P) {
                if (M.isEqual(O[N], (R = P[N]))) {
                    continue
                }(Q || (Q = {}))[N] = R
            }
            return Q
        },
        previous: function(N) {
            if (N == null || !this._previousAttributes) {
                return null
            }
            return this._previousAttributes[N]
        },
        previousAttributes: function() {
            return M.clone(this._previousAttributes)
        },
        fetch: function(O) {
            O = O ? M.clone(O) : {};
            if (O.parse === void 0) {
                O.parse = true
            }
            var N = this;
            var P = O.success;
            O.success = function(Q) {
                if (!N.set(N.parse(Q, O), O)) {
                    return false
                }
                if (P) {
                    P(N, Q, O)
                }
                N.trigger("sync", N, Q, O)
            };
            I(this, O);
            return this.sync("read", this, O)
        },
        save: function(R, O, V) {
            var S, N, U, P = this.attributes;
            if (R == null || typeof R === "object") {
                S = R;
                V = O
            } else {
                (S = {})[R] = O
            }
            if (S && (!V || !V.wait) && !this.set(S, V)) {
                return false
            }
            V = M.extend({
                validate: true
            }, V);
            if (!this._validate(S, V)) {
                return false
            }
            if (S && V.wait) {
                this.attributes = M.extend({}, P, S)
            }
            if (V.parse === void 0) {
                V.parse = true
            }
            var Q = this;
            var T = V.success;
            V.success = function(X) {
                Q.attributes = P;
                var W = Q.parse(X, V);
                if (V.wait) {
                    W = M.extend(S || {}, W)
                }
                if (M.isObject(W) && !Q.set(W, V)) {
                    return false
                }
                if (T) {
                    T(Q, X, V)
                }
                Q.trigger("sync", Q, X, V)
            };
            I(this, V);
            N = this.isNew() ? "create" : (V.patch ? "patch" : "update");
            if (N === "patch") {
                V.attrs = S
            }
            U = this.sync(N, this, V);
            if (S && V.wait) {
                this.attributes = P
            }
            return U
        },
        destroy: function(O) {
            O = O ? M.clone(O) : {};
            var N = this;
            var R = O.success;
            var P = function() {
                N.trigger("destroy", N, N.collection, O)
            };
            O.success = function(S) {
                if (O.wait || N.isNew()) {
                    P()
                }
                if (R) {
                    R(N, S, O)
                }
                if (!N.isNew()) {
                    N.trigger("sync", N, S, O)
                }
            };
            if (this.isNew()) {
                O.success();
                return false
            }
            I(this, O);
            var Q = this.sync("delete", this, O);
            if (!O.wait) {
                P()
            }
            return Q
        },
        url: function() {
            var N = M.result(this, "urlRoot") || M.result(this.collection, "url") || s();
            if (this.isNew()) {
                return N
            }
            return N + (N.charAt(N.length - 1) === "/" ? "" : "/") + encodeURIComponent(this.id)
        },
        parse: function(O, N) {
            return O
        },
        clone: function() {
            return new this.constructor(this.attributes)
        },
        isNew: function() {
            return this.id == null
        },
        isValid: function(N) {
            return this._validate({}, M.extend(N || {}, {
                validate: true
            }))
        },
        _validate: function(P, O) {
            if (!O.validate || !this.validate) {
                return true
            }
            P = M.extend({}, this.attributes, P);
            var N = this.validationError = this.validate(P, O) || null;
            if (!N) {
                return true
            }
            this.trigger("invalid", this, N, M.extend(O || {}, {
                validationError: N
            }));
            return false
        }
    });
    var a = ["keys", "values", "pairs", "invert", "pick", "omit"];
    M.each(a, function(N) {
        F.prototype[N] = function() {
            var O = o.call(arguments);
            O.unshift(this.attributes);
            return M[N].apply(M, O)
        }
    });
    var c = A.Collection = function(O, N) {
        N || (N = {});
        if (N.url) {
            this.url = N.url
        }
        if (N.model) {
            this.model = N.model
        }
        if (N.comparator !== void 0) {
            this.comparator = N.comparator
        }
        this._reset();
        this.initialize.apply(this, arguments);
        if (O) {
            this.reset(O, M.extend({
                silent: true
            }, N))
        }
    };
    var p = {
        add: true,
        remove: true,
        merge: true
    };
    var L = {
        add: true,
        merge: false,
        remove: false
    };
    M.extend(c.prototype, K, {
        model: F,
        initialize: function() {},
        toJSON: function(N) {
            return this.map(function(O) {
                return O.toJSON(N)
            })
        },
        sync: function() {
            return A.sync.apply(this, arguments)
        },
        add: function(O, N) {
            return this.set(O, M.defaults(N || {}, L))
        },
        remove: function(S, Q) {
            S = M.isArray(S) ? S.slice() : [S];
            Q || (Q = {});
            var R, N, P, O;
            for (R = 0, N = S.length; R < N; R++) {
                O = this.get(S[R]);
                if (!O) {
                    continue
                }
                delete this._byId[O.id];
                delete this._byId[O.cid];
                P = this.indexOf(O);
                this.models.splice(P, 1);
                this.length--;
                if (!Q.silent) {
                    Q.index = P;
                    O.trigger("remove", O, this, Q)
                }
                this._removeReference(O)
            }
            return this
        },
        set: function(O, aa) {
            aa = M.defaults(aa || {}, p);
            if (aa.parse) {
                O = this.parse(O, aa)
            }
            if (!M.isArray(O)) {
                O = O ? [O] : []
            }
            var V, R, X, Y, P, W;
            var Q = aa.at;
            var U = this.comparator && (Q == null) && aa.sort !== false;
            var S = M.isString(this.comparator) ? this.comparator : null;
            var Z = [],
                N = [],
                T = {};
            for (V = 0, R = O.length; V < R; V++) {
                if (!(X = this._prepareModel(O[V], aa))) {
                    continue
                }
                if (P = this.get(X)) {
                    if (aa.remove) {
                        T[P.cid] = true
                    }
                    if (aa.merge) {
                        P.set(X.attributes, aa);
                        if (U && !W && P.hasChanged(S)) {
                            W = true
                        }
                    }
                } else {
                    if (aa.add) {
                        Z.push(X);
                        X.on("all", this._onModelEvent, this);
                        this._byId[X.cid] = X;
                        if (X.id != null) {
                            this._byId[X.id] = X
                        }
                    }
                }
            }
            if (aa.remove) {
                for (V = 0, R = this.length; V < R; ++V) {
                    if (!T[(X = this.models[V]).cid]) {
                        N.push(X)
                    }
                }
                if (N.length) {
                    this.remove(N, aa)
                }
            }
            if (Z.length) {
                if (U) {
                    W = true
                }
                this.length += Z.length;
                if (Q != null) {
                    u.apply(this.models, [Q, 0].concat(Z))
                } else {
                    E.apply(this.models, Z)
                }
            }
            if (W) {
                this.sort({
                    silent: true
                })
            }
            if (aa.silent) {
                return this
            }
            for (V = 0, R = Z.length; V < R; V++) {
                (X = Z[V]).trigger("add", X, this, aa)
            }
            if (W) {
                this.trigger("sort", this, aa)
            }
            return this
        },
        reset: function(Q, O) {
            O || (O = {});
            for (var P = 0, N = this.models.length; P < N; P++) {
                this._removeReference(this.models[P])
            }
            O.previousModels = this.models;
            this._reset();
            this.add(Q, M.extend({
                silent: true
            }, O));
            if (!O.silent) {
                this.trigger("reset", this, O)
            }
            return this
        },
        push: function(O, N) {
            O = this._prepareModel(O, N);
            this.add(O, M.extend({
                at: this.length
            }, N));
            return O
        },
        pop: function(O) {
            var N = this.at(this.length - 1);
            this.remove(N, O);
            return N
        },
        unshift: function(O, N) {
            O = this._prepareModel(O, N);
            this.add(O, M.extend({
                at: 0
            }, N));
            return O
        },
        shift: function(O) {
            var N = this.at(0);
            this.remove(N, O);
            return N
        },
        slice: function(O, N) {
            return this.models.slice(O, N)
        },
        get: function(N) {
            if (N == null) {
                return void 0
            }
            return this._byId[N.id != null ? N.id : N.cid || N]
        },
        at: function(N) {
            return this.models[N]
        },
        where: function(N, O) {
            if (M.isEmpty(N)) {
                return O ? void 0 : []
            }
            return this[O ? "find" : "filter"](function(P) {
                for (var Q in N) {
                    if (N[Q] !== P.get(Q)) {
                        return false
                    }
                }
                return true
            })
        },
        findWhere: function(N) {
            return this.where(N, true)
        },
        sort: function(N) {
            if (!this.comparator) {
                throw new Error("Cannot sort a set without a comparator")
            }
            N || (N = {});
            if (M.isString(this.comparator) || this.comparator.length === 1) {
                this.models = this.sortBy(this.comparator, this)
            } else {
                this.models.sort(M.bind(this.comparator, this))
            }
            if (!N.silent) {
                this.trigger("sort", this, N)
            }
            return this
        },
        sortedIndex: function(N, Q, O) {
            Q || (Q = this.comparator);
            var P = M.isFunction(Q) ? Q : function(R) {
                    return R.get(Q)
                };
            return M.sortedIndex(this.models, N, P, O)
        },
        pluck: function(N) {
            return M.invoke(this.models, "get", N)
        },
        fetch: function(N) {
            N = N ? M.clone(N) : {};
            if (N.parse === void 0) {
                N.parse = true
            }
            var P = N.success;
            var O = this;
            N.success = function(Q) {
                var R = N.reset ? "reset" : "set";
                O[R](Q, N);
                if (P) {
                    P(O, Q, N)
                }
                O.trigger("sync", O, Q, N)
            };
            I(this, N);
            return this.sync("read", this, N)
        },
        create: function(O, N) {
            N = N ? M.clone(N) : {};
            if (!(O = this._prepareModel(O, N))) {
                return false
            }
            if (!N.wait) {
                this.add(O, N)
            }
            var Q = this;
            var P = N.success;
            N.success = function(R) {
                if (N.wait) {
                    Q.add(O, N)
                }
                if (P) {
                    P(O, R, N)
                }
            };
            O.save(null, N);
            return O
        },
        parse: function(O, N) {
            return O
        },
        clone: function() {
            return new this.constructor(this.models)
        },
        _reset: function() {
            this.length = 0;
            this.models = [];
            this._byId = {}
        },
        _prepareModel: function(P, O) {
            if (P instanceof F) {
                if (!P.collection) {
                    P.collection = this
                }
                return P
            }
            O || (O = {});
            O.collection = this;
            var N = new this.model(P, O);
            if (!N._validate(P, O)) {
                this.trigger("invalid", this, P, O);
                return false
            }
            return N
        },
        _removeReference: function(N) {
            if (this === N.collection) {
                delete N.collection
            }
            N.off("all", this._onModelEvent, this)
        },
        _onModelEvent: function(P, O, Q, N) {
            if ((P === "add" || P === "remove") && Q !== this) {
                return
            }
            if (P === "destroy") {
                this.remove(O, N)
            }
            if (O && P === "change:" + O.idAttribute) {
                delete this._byId[O.previous(O.idAttribute)];
                if (O.id != null) {
                    this._byId[O.id] = O
                }
            }
            this.trigger.apply(this, arguments)
        }
    });
    var z = ["forEach", "each", "map", "collect", "reduce", "foldl", "inject", "reduceRight", "foldr", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "toArray", "size", "first", "head", "take", "initial", "rest", "tail", "drop", "last", "without", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "chain"];
    M.each(z, function(N) {
        c.prototype[N] = function() {
            var O = o.call(arguments);
            O.unshift(this.models);
            return M[N].apply(M, O)
        }
    });
    var l = ["groupBy", "countBy", "sortBy"];
    M.each(l, function(N) {
        c.prototype[N] = function(Q, O) {
            var P = M.isFunction(Q) ? Q : function(R) {
                    return R.get(Q)
                };
            return M[N](this.models, P, O)
        }
    });
    var H = A.View = function(N) {
        this.cid = M.uniqueId("view");
        this._configure(N || {});
        this._ensureElement();
        this.initialize.apply(this, arguments);
        this.delegateEvents()
    };
    var w = /^(\S+)\s*(.*)$/;
    var e = ["model", "collection", "el", "id", "attributes", "className", "tagName", "events"];
    M.extend(H.prototype, K, {
        tagName: "div",
        $: function(N) {
            return this.$el.find(N)
        },
        initialize: function() {},
        render: function() {
            return this
        },
        remove: function() {
            this.$el.remove();
            this.stopListening();
            return this
        },
        setElement: function(N, O) {
            if (this.$el) {
                this.undelegateEvents()
            }
            this.$el = N instanceof A.$ ? N : A.$(N);
            this.el = this.$el[0];
            if (O !== false) {
                this.delegateEvents()
            }
            return this
        },
        delegateEvents: function(R) {
            if (!(R || (R = M.result(this, "events")))) {
                return this
            }
            this.undelegateEvents();
            for (var Q in R) {
                var S = R[Q];
                if (!M.isFunction(S)) {
                    S = this[R[Q]]
                }
                if (!S) {
                    continue
                }
                var P = Q.match(w);
                var O = P[1],
                    N = P[2];
                S = M.bind(S, this);
                O += ".delegateEvents" + this.cid;
                if (N === "") {
                    this.$el.on(O, S)
                } else {
                    this.$el.on(O, N, S)
                }
            }
            return this
        },
        undelegateEvents: function() {
            this.$el.off(".delegateEvents" + this.cid);
            return this
        },
        _configure: function(N) {
            if (this.options) {
                N = M.extend({}, M.result(this, "options"), N)
            }
            M.extend(this, M.pick(N, e));
            this.options = N
        },
        _ensureElement: function() {
            if (!this.el) {
                var N = M.extend({}, M.result(this, "attributes"));
                if (this.id) {
                    N.id = M.result(this, "id")
                }
                if (this.className) {
                    N["class"] = M.result(this, "className")
                }
                var O = A.$("<" + M.result(this, "tagName") + ">").attr(N);
                this.setElement(O, false)
            } else {
                this.setElement(M.result(this, "el"), false)
            }
        }
    });
    A.sync = function(T, O, N) {
        var Q = k[T];
        M.defaults(N || (N = {}), {
            emulateHTTP: A.emulateHTTP,
            emulateJSON: A.emulateJSON
        });
        var S = {
            type: Q,
            dataType: "json"
        };
        if (!N.url) {
            S.url = M.result(O, "url") || s()
        }
        if (N.data == null && O && (T === "create" || T === "update" || T === "patch")) {
            S.contentType = "application/json";
            S.data = JSON.stringify(N.attrs || O.toJSON(N))
        }
        if (N.emulateJSON) {
            S.contentType = "application/x-www-form-urlencoded";
            S.data = S.data ? {
                model: S.data
            } : {}
        }
        if (N.emulateHTTP && (Q === "PUT" || Q === "DELETE" || Q === "PATCH")) {
            S.type = "POST";
            if (N.emulateJSON) {
                S.data._method = Q
            }
            var P = N.beforeSend;
            N.beforeSend = function(U) {
                U.setRequestHeader("X-HTTP-Method-Override", Q);
                if (P) {
                    return P.apply(this, arguments)
                }
            }
        }
        if (S.type !== "GET" && !N.emulateJSON) {
            S.processData = false
        }
        if (S.type === "PATCH" && window.ActiveXObject && !(window.external && window.external.msActiveXFilteringEnabled)) {
            S.xhr = function() {
                return new ActiveXObject("Microsoft.XMLHTTP")
            }
        }
        var R = N.xhr = A.ajax(M.extend(S, N));
        O.trigger("request", O, R, N);
        return R
    };
    var k = {
        create: "POST",
        update: "PUT",
        patch: "PATCH",
        "delete": "DELETE",
        read: "GET"
    };
    A.ajax = function() {
        return A.$.ajax.apply(A.$, arguments)
    };
    var q = A.Router = function(N) {
        N || (N = {});
        if (N.routes) {
            this.routes = N.routes
        }
        this._bindRoutes();
        this.initialize.apply(this, arguments)
    };
    var r = /\((.*?)\)/g;
    var t = /(\(\?)?:\w+/g;
    var d = /\*\w+/g;
    var i = /[\-{}\[\]+?.,\\\^$|#\s]/g;
    M.extend(q.prototype, K, {
        initialize: function() {},
        route: function(O, P, Q) {
            if (!M.isRegExp(O)) {
                O = this._routeToRegExp(O)
            }
            if (M.isFunction(P)) {
                Q = P;
                P = ""
            }
            if (!Q) {
                Q = this[P]
            }
            var N = this;
            A.history.route(O, function(S) {
                var R = N._extractParameters(O, S);
                Q && Q.apply(N, R);
                N.trigger.apply(N, ["route:" + P].concat(R));
                N.trigger("route", P, R);
                A.history.trigger("route", N, P, R)
            });
            return this
        },
        navigate: function(O, N) {
            A.history.navigate(O, N);
            return this
        },
        _bindRoutes: function() {
            if (!this.routes) {
                return
            }
            this.routes = M.result(this, "routes");
            var O, N = M.keys(this.routes);
            while ((O = N.pop()) != null) {
                this.route(O, this.routes[O])
            }
        },
        _routeToRegExp: function(N) {
            N = N.replace(i, "\\$&").replace(r, "(?:$1)?").replace(t, function(P, O) {
                return O ? P : "([^/]+)"
            }).replace(d, "(.*?)");
            return new RegExp("^" + N + "$")
        },
        _extractParameters: function(N, O) {
            var P = N.exec(O).slice(1);
            return M.map(P, function(Q) {
                return Q ? decodeURIComponent(Q) : null
            })
        }
    });
    var j = A.History = function() {
        this.handlers = [];
        M.bindAll(this, "checkUrl");
        if (typeof window !== "undefined") {
            this.location = window.location;
            this.history = window.history
        }
    };
    var B = /^[#\/]|\s+$/g;
    var f = /^\/+|\/+$/g;
    var J = /msie [\w.]+/;
    var n = /\/$/;
    j.started = false;
    M.extend(j.prototype, K, {
        interval: 50,
        getHash: function(O) {
            var N = (O || this).location.href.match(/#(.*)$/);
            return N ? N[1] : ""
        },
        getFragment: function(P, O) {
            if (P == null) {
                if (this._hasPushState || !this._wantsHashChange || O) {
                    P = this.location.pathname;
                    var N = this.root.replace(n, "");
                    if (!P.indexOf(N)) {
                        P = P.substr(N.length)
                    }
                } else {
                    P = this.getHash()
                }
            }
            return P.replace(B, "")
        },
        start: function(P) {
            if (j.started) {
                throw new Error("Backbone.history has already been started")
            }
            j.started = true;
            this.options = M.extend({}, {
                root: "/"
            }, this.options, P);
            this.root = this.options.root;
            this._wantsHashChange = this.options.hashChange !== false;
            this._wantsPushState = !! this.options.pushState;
            this._hasPushState = !! (this.options.pushState && this.history && this.history.pushState);
            var O = this.getFragment();
            var N = document.documentMode;
            var R = (J.exec(navigator.userAgent.toLowerCase()) && (!N || N <= 7));
            this.root = ("/" + this.root + "/").replace(f, "/");
            if (R && this._wantsHashChange) {
                this.iframe = A.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow;
                this.navigate(O)
            }
            if (this._hasPushState) {
                A.$(window).on("popstate", this.checkUrl)
            } else {
                if (this._wantsHashChange && ("onhashchange" in window) && !R) {
                    A.$(window).on("hashchange", this.checkUrl)
                } else {
                    if (this._wantsHashChange) {
                        this._checkUrlInterval = setInterval(this.checkUrl, this.interval)
                    }
                }
            }
            this.fragment = O;
            var S = this.location;
            var Q = S.pathname.replace(/[^\/]$/, "$&/") === this.root;
            if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !Q) {
                this.fragment = this.getFragment(null, true);
                this.location.replace(this.root + this.location.search + "#" + this.fragment);
                return true
            } else {
                if (this._wantsPushState && this._hasPushState && Q && S.hash) {
                    this.fragment = this.getHash().replace(B, "");
                    this.history.replaceState({}, document.title, this.root + this.fragment + S.search)
                }
            }
            if (!this.options.silent) {
                return this.loadUrl()
            }
        },
        stop: function() {
            A.$(window).off("popstate", this.checkUrl).off("hashchange", this.checkUrl);
            clearInterval(this._checkUrlInterval);
            j.started = false
        },
        route: function(N, O) {
            this.handlers.unshift({
                route: N,
                callback: O
            })
        },
        checkUrl: function(O) {
            var N = this.getFragment();
            if (N === this.fragment && this.iframe) {
                N = this.getFragment(this.getHash(this.iframe))
            }
            if (N === this.fragment) {
                return false
            }
            if (this.iframe) {
                this.navigate(N)
            }
            this.loadUrl() || this.loadUrl(this.getHash())
        },
        loadUrl: function(P) {
            var O = this.fragment = this.getFragment(P);
            var N = M.any(this.handlers, function(Q) {
                if (Q.route.test(O)) {
                    Q.callback(O);
                    return true
                }
            });
            return N
        },
        navigate: function(P, O) {
            if (!j.started) {
                return false
            }
            if (!O || O === true) {
                O = {
                    trigger: O
                }
            }
            P = this.getFragment(P || "");
            if (this.fragment === P) {
                return
            }
            this.fragment = P;
            var N = this.root + P;
            if (this._hasPushState) {
                this.history[O.replace ? "replaceState" : "pushState"]({}, document.title, N)
            } else {
                if (this._wantsHashChange) {
                    this._updateHash(this.location, P, O.replace);
                    if (this.iframe && (P !== this.getFragment(this.getHash(this.iframe)))) {
                        if (!O.replace) {
                            this.iframe.document.open().close()
                        }
                        this._updateHash(this.iframe.location, P, O.replace)
                    }
                } else {
                    return this.location.assign(N)
                }
            }
            if (O.trigger) {
                this.loadUrl(P)
            }
        },
        _updateHash: function(N, P, Q) {
            if (Q) {
                var O = N.href.replace(/(javascript:|#).*$/, "");
                N.replace(O + "#" + P)
            } else {
                N.hash = "#" + P
            }
        }
    });
    A.history = new j;
    var m = function(N, P) {
        var O = this;
        var R;
        if (N && M.has(N, "constructor")) {
            R = N.constructor
        } else {
            R = function() {
                return O.apply(this, arguments)
            }
        }
        M.extend(R, O, P);
        var Q = function() {
            this.constructor = R
        };
        Q.prototype = O.prototype;
        R.prototype = new Q;
        if (N) {
            M.extend(R.prototype, N)
        }
        R.__super__ = O.prototype;
        return R
    };
    F.extend = c.extend = q.extend = H.extend = j.extend = m;
    var s = function() {
        throw new Error('A "url" property or function must be specified')
    };
    var I = function(P, O) {
        var N = O.error;
        O.error = function(Q) {
            if (N) {
                N(P, Q, O)
            }
            P.trigger("error", P, Q, O)
        }
    }
}).call(this);
(function(c) {
    function b(f, g) {
        this._superCallObjects || (this._superCallObjects = {});
        var e = this._superCallObjects[f] || this,
            i = a(f, e);
        this._superCallObjects[f] = i;
        var d = i[f].apply(this, g || []);
        delete this._superCallObjects[f];
        return d
    }
    function a(d, f) {
        var e = f;
        while (e[d] === f[d]) {
            e = e.constructor.__super__
        }
        return e
    }
    _.each(["Model", "Collection", "View", "Router"], function(d) {
        c[d].prototype._super = b
    })
})(Backbone);
(function(b) {
    var j, i, c;
    if (typeof window === "undefined") {
        j = require("underscore");
        i = require("backbone");
        c = module.exports = i
    } else {
        j = window._;
        i = window.Backbone;
        c = window
    }
    i.Relational = {
        showWarnings: true
    };
    i.Semaphore = {
        _permitsAvailable: null,
        _permitsUsed: 0,
        acquire: function() {
            if (this._permitsAvailable && this._permitsUsed >= this._permitsAvailable) {
                throw new Error("Max permits acquired")
            } else {
                this._permitsUsed++
            }
        },
        release: function() {
            if (this._permitsUsed === 0) {
                throw new Error("All permits released")
            } else {
                this._permitsUsed--
            }
        },
        isLocked: function() {
            return this._permitsUsed > 0
        },
        setAvailablePermits: function(k) {
            if (this._permitsUsed > k) {
                throw new Error("Available permits cannot be less than used permits")
            }
            this._permitsAvailable = k
        }
    };
    i.BlockingQueue = function() {
        this._queue = []
    };
    j.extend(i.BlockingQueue.prototype, i.Semaphore, {
        _queue: null,
        add: function(k) {
            if (this.isBlocked()) {
                this._queue.push(k)
            } else {
                k()
            }
        },
        process: function() {
            while (this._queue && this._queue.length) {
                this._queue.shift()()
            }
        },
        block: function() {
            this.acquire()
        },
        unblock: function() {
            this.release();
            if (!this.isBlocked()) {
                this.process()
            }
        },
        isBlocked: function() {
            return this.isLocked()
        }
    });
    i.Relational.eventQueue = new i.BlockingQueue();
    i.Store = function() {
        this._collections = [];
        this._reverseRelations = [];
        this._orphanRelations = [];
        this._subModels = [];
        this._modelScopes = [c]
    };
    j.extend(i.Store.prototype, i.Events, {
        initializeRelation: function(l, n, k) {
            var m = !j.isString(n.type) ? n.type : i[n.type] || this.getObjectByName(n.type);
            if (m && m.prototype instanceof i.Relation) {
                new m(l, n, k)
            } else {
                i.Relational.showWarnings && typeof console !== "undefined" && console.warn("Relation=%o; missing or invalid relation type!", n)
            }
        },
        addModelScope: function(k) {
            this._modelScopes.push(k)
        },
        removeModelScope: function(k) {
            this._modelScopes = j.without(this._modelScopes, k)
        },
        addSubModels: function(k, l) {
            this._subModels.push({
                superModelType: l,
                subModels: k
            })
        },
        setupSuperModel: function(k) {
            j.find(this._subModels, function(l) {
                return j.find(l.subModels || [], function(n, o) {
                    var m = this.getObjectByName(n);
                    if (k === m) {
                        l.superModelType._subModels[o] = k;
                        k._superModel = l.superModelType;
                        k._subModelTypeValue = o;
                        k._subModelTypeAttribute = l.superModelType.prototype.subModelTypeAttribute;
                        return true
                    }
                }, this)
            }, this)
        },
        addReverseRelation: function(l) {
            var k = j.any(this._reverseRelations, function(m) {
                return j.all(l || [], function(o, n) {
                    return o === m[n]
                })
            });
            if (!k && l.model && l.type) {
                this._reverseRelations.push(l);
                this._addRelation(l.model, l);
                this.retroFitRelation(l)
            }
        },
        addOrphanRelation: function(l) {
            var k = j.any(this._orphanRelations, function(m) {
                return j.all(l || [], function(o, n) {
                    return o === m[n]
                })
            });
            if (!k && l.model && l.type) {
                this._orphanRelations.push(l)
            }
        },
        processOrphanRelations: function() {
            j.each(this._orphanRelations.slice(0), function(k) {
                var l = i.Relational.store.getObjectByName(k.relatedModel);
                if (l) {
                    this.initializeRelation(null, k);
                    this._orphanRelations = j.without(this._orphanRelations, k)
                }
            }, this)
        },
        _addRelation: function(k, l) {
            if (!k.prototype.relations) {
                k.prototype.relations = []
            }
            k.prototype.relations.push(l);
            j.each(k._subModels || [], function(m) {
                this._addRelation(m, l)
            }, this)
        },
        retroFitRelation: function(l) {
            var k = this.getCollection(l.model, false);
            k && k.each(function(m) {
                if (!(m instanceof l.model)) {
                    return
                }
                new l.type(m, l)
            }, this)
        },
        getCollection: function(n, m) {
            if (n instanceof i.RelationalModel) {
                n = n.constructor
            }
            var k = n;
            while (k._superModel) {
                k = k._superModel
            }
            var l = j.findWhere(this._collections, {
                model: k
            });
            if (!l && m !== false) {
                l = this._createCollection(k)
            }
            return l
        },
        getObjectByName: function(k) {
            var m = k.split("."),
                l = null;
            j.find(this._modelScopes, function(n) {
                l = j.reduce(m || [], function(o, p) {
                    return o ? o[p] : b
                }, n);
                if (l && l !== n) {
                    return true
                }
            }, this);
            return l
        },
        _createCollection: function(l) {
            var k;
            if (l instanceof i.RelationalModel) {
                l = l.constructor
            }
            if (l.prototype instanceof i.RelationalModel) {
                k = new i.Collection();
                k.model = l;
                this._collections.push(k)
            }
            return k
        },
        resolveIdForItem: function(k, l) {
            var m = j.isString(l) || j.isNumber(l) ? l : null;
            if (m === null) {
                if (l instanceof i.RelationalModel) {
                    m = l.id
                } else {
                    if (j.isObject(l)) {
                        m = l[k.prototype.idAttribute]
                    }
                }
            }
            if (!m && m !== 0) {
                m = null
            }
            return m
        },
        find: function(l, m) {
            var o = this.resolveIdForItem(l, m);
            var k = this.getCollection(l);
            if (k) {
                var n = k.get(o);
                if (n instanceof l) {
                    return n
                }
            }
            return null
        },
        register: function(l) {
            var m = this.getCollection(l);
            if (m) {
                var k = l.collection;
                m.add(l);
                this.listenTo(l, "destroy", this.unregister, this);
                l.collection = k
            }
        },
        checkId: function(k, n) {
            var l = this.getCollection(k),
                m = l && l.get(n);
            if (m && k !== m) {
                if (i.Relational.showWarnings && typeof console !== "undefined") {
                    console.warn("Duplicate id! Old RelationalModel=%o, new RelationalModel=%o", m, k)
                }
                throw new Error("Cannot instantiate more than one Backbone.RelationalModel with the same id per type!")
            }
        },
        update: function(k) {
            var l = this.getCollection(k);
            l._onModelEvent("change:" + k.idAttribute, k, l);
            k.trigger("relational:change:id", k, l)
        },
        unregister: function(k) {
            this.stopListening(k, "destroy", this.unregister);
            var l = this.getCollection(k);
            l && l.remove(k)
        },
        reset: function() {
            this.stopListening();
            this._collections = [];
            this._subModels = [];
            this._modelScopes = [c]
        }
    });
    i.Relational.store = new i.Store();
    i.Relation = function(k, l, m) {
        this.instance = k;
        l = j.isObject(l) ? l : {};
        this.reverseRelation = j.defaults(l.reverseRelation || {}, this.options.reverseRelation);
        this.options = j.defaults(l, this.options, i.Relation.prototype.options);
        this.reverseRelation.type = !j.isString(this.reverseRelation.type) ? this.reverseRelation.type : i[this.reverseRelation.type] || i.Relational.store.getObjectByName(this.reverseRelation.type);
        this.key = this.options.key;
        this.keySource = this.options.keySource || this.key;
        this.keyDestination = this.options.keyDestination || this.keySource || this.key;
        this.model = this.options.model || this.instance.constructor;
        this.relatedModel = this.options.relatedModel;
        if (j.isString(this.relatedModel)) {
            this.relatedModel = i.Relational.store.getObjectByName(this.relatedModel)
        }
        if (!this.checkPreconditions()) {
            return
        }
        if (!this.options.isAutoRelation && this.reverseRelation.type && this.reverseRelation.key) {
            i.Relational.store.addReverseRelation(j.defaults({
                isAutoRelation: true,
                model: this.relatedModel,
                relatedModel: this.model,
                reverseRelation: this.options
            }, this.reverseRelation))
        }
        if (k) {
            var n = this.keySource;
            if (n !== this.key && typeof this.instance.get(this.key) === "object") {
                n = this.key
            }
            this.setKeyContents(this.instance.get(n));
            this.relatedCollection = i.Relational.store.getCollection(this.relatedModel);
            if (this.keySource !== this.key) {
                this.instance.unset(this.keySource, {
                    silent: true
                })
            }
            this.instance._relations[this.key] = this;
            this.initialize(m);
            if (this.options.autoFetch) {
                this.instance.fetchRelated(this.key, j.isObject(this.options.autoFetch) ? this.options.autoFetch : {})
            }
            this.listenTo(this.instance, "destroy", this.destroy).listenTo(this.relatedCollection, "relational:add relational:change:id", this.tryAddRelated).listenTo(this.relatedCollection, "relational:remove", this.removeRelated)
        }
    };
    i.Relation.extend = i.Model.extend;
    j.extend(i.Relation.prototype, i.Events, i.Semaphore, {
        options: {
            createModels: true,
            includeInJSON: true,
            isAutoRelation: false,
            autoFetch: false,
            parse: false
        },
        instance: null,
        key: null,
        keyContents: null,
        relatedModel: null,
        relatedCollection: null,
        reverseRelation: null,
        related: null,
        checkPreconditions: function() {
            var o = this.instance,
                n = this.key,
                l = this.model,
                q = this.relatedModel,
                r = i.Relational.showWarnings && typeof console !== "undefined";
            if (!l || !n || !q) {
                r && console.warn("Relation=%o: missing model, key or relatedModel (%o, %o, %o).", this, l, n, q);
                return false
            }
            if (!(l.prototype instanceof i.RelationalModel)) {
                r && console.warn("Relation=%o: model does not inherit from Backbone.RelationalModel (%o).", this, o);
                return false
            }
            if (!(q.prototype instanceof i.RelationalModel)) {
                r && console.warn("Relation=%o: relatedModel does not inherit from Backbone.RelationalModel (%o).", this, q);
                return false
            }
            if (this instanceof i.HasMany && this.reverseRelation.type === i.HasMany) {
                r && console.warn("Relation=%o: relation is a HasMany, and the reverseRelation is HasMany as well.", this);
                return false
            }
            if (o && j.keys(o._relations).length) {
                var p = j.find(o._relations, function(k) {
                    return k.key === n
                }, this);
                if (p) {
                    r && console.warn("Cannot create relation=%o on %o for model=%o: already taken by relation=%o.", this, n, o, p);
                    return false
                }
            }
            return true
        },
        setRelated: function(k) {
            this.related = k;
            this.instance.acquire();
            this.instance.attributes[this.key] = k;
            this.instance.release()
        },
        _isReverseRelation: function(k) {
            return k.instance instanceof this.relatedModel && this.reverseRelation.key === k.key && this.key === k.reverseRelation.key
        },
        getReverseRelations: function(k) {
            var l = [];
            var m = !j.isUndefined(k) ? [k] : this.related && (this.related.models || [this.related]);
            j.each(m || [], function(n) {
                j.each(n.getRelations() || [], function(o) {
                    if (this._isReverseRelation(o)) {
                        l.push(o)
                    }
                }, this)
            }, this);
            return l
        },
        destroy: function() {
            this.stopListening();
            if (this instanceof i.HasOne) {
                this.setRelated(null)
            } else {
                if (this instanceof i.HasMany) {
                    this.setRelated(this._prepareCollection())
                }
            }
            j.each(this.getReverseRelations(), function(k) {
                k.removeRelated(this.instance)
            }, this)
        }
    });
    i.HasOne = i.Relation.extend({
        options: {
            reverseRelation: {
                type: "HasMany"
            }
        },
        initialize: function(k) {
            this.listenTo(this.instance, "relational:change:" + this.key, this.onChange);
            var l = this.findRelated(k);
            this.setRelated(l);
            j.each(this.getReverseRelations(), function(m) {
                m.addRelated(this.instance, k)
            }, this)
        },
        findRelated: function(k) {
            var m = null;
            k = j.defaults({
                parse: this.options.parse
            }, k);
            if (this.keyContents instanceof this.relatedModel) {
                m = this.keyContents
            } else {
                if (this.keyContents || this.keyContents === 0) {
                    var l = j.defaults({
                        create: this.options.createModels
                    }, k);
                    m = this.relatedModel.findOrCreate(this.keyContents, l)
                }
            }
            if (this.related) {
                this.keyId = null
            }
            return m
        },
        setKeyContents: function(k) {
            this.keyContents = k;
            this.keyId = i.Relational.store.resolveIdForItem(this.relatedModel, this.keyContents)
        },
        onChange: function(n, k, m) {
            if (this.isLocked()) {
                return
            }
            this.acquire();
            m = m ? j.clone(m) : {};
            var q = j.isUndefined(m.__related),
                o = q ? this.related : m.__related;
            if (q) {
                this.setKeyContents(k);
                var p = this.findRelated(m);
                this.setRelated(p)
            }
            if (o && this.related !== o) {
                j.each(this.getReverseRelations(o), function(r) {
                    r.removeRelated(this.instance, null, m)
                }, this)
            }
            j.each(this.getReverseRelations(), function(r) {
                r.addRelated(this.instance, m)
            }, this);
            if (!m.silent && this.related !== o) {
                var l = this;
                this.changed = true;
                i.Relational.eventQueue.add(function() {
                    l.instance.trigger("change:" + l.key, l.instance, l.related, m, true);
                    l.changed = false
                })
            }
            this.release()
        },
        tryAddRelated: function(l, m, k) {
            if ((this.keyId || this.keyId === 0) && l.id === this.keyId) {
                this.addRelated(l, k);
                this.keyId = null
            }
        },
        addRelated: function(m, l) {
            var k = this;
            m.queue(function() {
                if (m !== k.related) {
                    var n = k.related || null;
                    k.setRelated(m);
                    k.onChange(k.instance, m, j.defaults({
                        __related: n
                    }, l))
                }
            })
        },
        removeRelated: function(l, m, k) {
            if (!this.related) {
                return
            }
            if (l === this.related) {
                var n = this.related || null;
                this.setRelated(null);
                this.onChange(this.instance, l, j.defaults({
                    __related: n
                }, k))
            }
        }
    });
    i.HasMany = i.Relation.extend({
        collectionType: null,
        options: {
            reverseRelation: {
                type: "HasOne"
            },
            collectionType: i.Collection,
            collectionKey: true,
            collectionOptions: {}
        },
        initialize: function(k) {
            this.listenTo(this.instance, "relational:change:" + this.key, this.onChange);
            this.collectionType = this.options.collectionType;
            if (j.isString(this.collectionType)) {
                this.collectionType = i.Relational.store.getObjectByName(this.collectionType)
            }
            if (this.collectionType !== i.Collection && !(this.collectionType.prototype instanceof i.Collection)) {
                throw new Error("`collectionType` must inherit from Backbone.Collection")
            }
            var l = this.findRelated(k);
            this.setRelated(l)
        },
        _prepareCollection: function(m) {
            if (this.related) {
                this.stopListening(this.related)
            }
            if (!m || !(m instanceof i.Collection)) {
                var k = j.isFunction(this.options.collectionOptions) ? this.options.collectionOptions(this.instance) : this.options.collectionOptions;
                m = new this.collectionType(null, k)
            }
            m.model = this.relatedModel;
            if (this.options.collectionKey) {
                var l = this.options.collectionKey === true ? this.options.reverseRelation.key : this.options.collectionKey;
                if (m[l] && m[l] !== this.instance) {
                    if (i.Relational.showWarnings && typeof console !== "undefined") {
                        console.warn("Relation=%o; collectionKey=%s already exists on collection=%o", this, l, this.options.collectionKey)
                    }
                } else {
                    if (l) {
                        m[l] = this.instance
                    }
                }
            }
            this.listenTo(m, "relational:add", this.handleAddition).listenTo(m, "relational:remove", this.handleRemoval).listenTo(m, "relational:reset", this.handleReset);
            return m
        },
        findRelated: function(k) {
            var m = null;
            k = j.defaults({
                parse: this.options.parse
            }, k);
            if (this.keyContents instanceof i.Collection) {
                this._prepareCollection(this.keyContents);
                m = this.keyContents
            } else {
                var l = [];
                j.each(this.keyContents, function(n) {
                    if (n instanceof this.relatedModel) {
                        var o = n
                    } else {
                        o = this.relatedModel.findOrCreate(n, j.extend({
                            merge: true
                        }, k, {
                            create: this.options.createModels
                        }))
                    }
                    o && l.push(o)
                }, this);
                if (this.related instanceof i.Collection) {
                    m = this.related
                } else {
                    m = this._prepareCollection()
                }
                m.set(l, j.defaults({
                    merge: false,
                    parse: false
                }, k))
            }
            this.keyIds = j.difference(this.keyIds, j.pluck(m.models, "id"));
            return m
        },
        setKeyContents: function(k) {
            this.keyContents = k instanceof i.Collection ? k : null;
            this.keyIds = [];
            if (!this.keyContents && (k || k === 0)) {
                this.keyContents = j.isArray(k) ? k : [k];
                j.each(this.keyContents, function(l) {
                    var m = i.Relational.store.resolveIdForItem(this.relatedModel, l);
                    if (m || m === 0) {
                        this.keyIds.push(m)
                    }
                }, this)
            }
        },
        onChange: function(n, k, m) {
            m = m ? j.clone(m) : {};
            this.setKeyContents(k);
            this.changed = false;
            var o = this.findRelated(m);
            this.setRelated(o);
            if (!m.silent) {
                var l = this;
                i.Relational.eventQueue.add(function() {
                    if (l.changed) {
                        l.instance.trigger("change:" + l.key, l.instance, l.related, m, true);
                        l.changed = false
                    }
                })
            }
        },
        handleAddition: function(m, n, l) {
            l = l ? j.clone(l) : {};
            this.changed = true;
            j.each(this.getReverseRelations(m), function(o) {
                o.addRelated(this.instance, l)
            }, this);
            var k = this;
            !l.silent && i.Relational.eventQueue.add(function() {
                k.instance.trigger("add:" + k.key, m, k.related, l)
            })
        },
        handleRemoval: function(m, n, l) {
            l = l ? j.clone(l) : {};
            this.changed = true;
            j.each(this.getReverseRelations(m), function(o) {
                o.removeRelated(this.instance, null, l)
            }, this);
            var k = this;
            !l.silent && i.Relational.eventQueue.add(function() {
                k.instance.trigger("remove:" + k.key, m, k.related, l)
            })
        },
        handleReset: function(m, l) {
            var k = this;
            l = l ? j.clone(l) : {};
            !l.silent && i.Relational.eventQueue.add(function() {
                k.instance.trigger("reset:" + k.key, k.related, l)
            })
        },
        tryAddRelated: function(l, m, k) {
            var n = j.contains(this.keyIds, l.id);
            if (n) {
                this.addRelated(l, k);
                this.keyIds = j.without(this.keyIds, l.id)
            }
        },
        addRelated: function(m, l) {
            var k = this;
            m.queue(function() {
                if (k.related && !k.related.get(m)) {
                    k.related.add(m, j.defaults({
                        parse: false
                    }, l))
                }
            })
        },
        removeRelated: function(l, m, k) {
            if (this.related.get(l)) {
                this.related.remove(l, k)
            }
        }
    });
    i.RelationalModel = i.Model.extend({
        relations: null,
        _relations: null,
        _isInitialized: false,
        _deferProcessing: false,
        _queue: null,
        subModelTypeAttribute: "type",
        subModelTypes: null,
        constructor: function(l, m) {
            if (m && m.collection) {
                var k = this,
                    o = this.collection = m.collection;
                delete m.collection;
                this._deferProcessing = true;
                var n = function(p) {
                    if (p === k) {
                        k._deferProcessing = false;
                        k.processQueue();
                        o.off("relational:add", n)
                    }
                };
                o.on("relational:add", n);
                j.defer(function() {
                    n(k)
                })
            }
            i.Relational.store.processOrphanRelations();
            this._queue = new i.BlockingQueue();
            this._queue.block();
            i.Relational.eventQueue.block();
            try {
                i.Model.apply(this, arguments)
            } finally {
                i.Relational.eventQueue.unblock()
            }
        },
        trigger: function(l) {
            if (l.length > 5 && l.indexOf("change") === 0) {
                var k = this,
                    m = arguments;
                i.Relational.eventQueue.add(function() {
                    if (!k._isInitialized) {
                        return
                    }
                    var p = true;
                    if (l === "change") {
                        p = k.hasChanged()
                    } else {
                        var o = l.slice(7),
                            n = k.getRelation(o);
                        if (n) {
                            p = (m[4] === true);
                            if (p) {
                                k.changed[o] = m[2]
                            } else {
                                if (!n.changed) {
                                    delete k.changed[o]
                                }
                            }
                        }
                    }
                    p && i.Model.prototype.trigger.apply(k, m)
                })
            } else {
                i.Model.prototype.trigger.apply(this, arguments)
            }
            return this
        },
        initializeRelations: function(k) {
            this.acquire();
            this._relations = {};
            j.each(this.relations || [], function(l) {
                i.Relational.store.initializeRelation(this, l, k)
            }, this);
            this._isInitialized = true;
            this.release();
            this.processQueue()
        },
        updateRelations: function(k) {
            if (this._isInitialized && !this.isLocked()) {
                j.each(this._relations, function(l) {
                    var m = this.attributes[l.keySource] || this.attributes[l.key];
                    if (l.related !== m) {
                        this.trigger("relational:change:" + l.key, this, m, k || {})
                    }
                }, this)
            }
        },
        queue: function(k) {
            this._queue.add(k)
        },
        processQueue: function() {
            if (this._isInitialized && !this._deferProcessing && this._queue.isBlocked()) {
                this._queue.unblock()
            }
        },
        getRelation: function(k) {
            return this._relations[k]
        },
        getRelations: function() {
            return j.values(this._relations)
        },
        fetchRelated: function(r, t, q) {
            t = j.extend({
                update: true,
                remove: false
            }, t);
            var p, l = [],
                s = this.getRelation(r),
                n = s && (s.keyIds || ((s.keyId || s.keyId === 0) ? [s.keyId] : []));
            if (q) {
                var m = s.related instanceof i.Collection ? s.related.models : [s.related];
                j.each(m, function(u) {
                    if (u.id || u.id === 0) {
                        n.push(u.id)
                    }
                })
            }
            if (n && n.length) {
                var o = [],
                    m = j.map(n, function(w) {
                        var v = i.Relational.store.find(s.relatedModel, w);
                        if (!v) {
                            var u = {};
                            u[s.relatedModel.prototype.idAttribute] = w;
                            v = s.relatedModel.findOrCreate(u, t);
                            o.push(v)
                        }
                        return v
                    }, this);
                if (s.related instanceof i.Collection && j.isFunction(s.related.url)) {
                    p = s.related.url(m)
                }
                if (p && p !== s.related.url()) {
                    var k = j.defaults({
                        error: function() {
                            var u = arguments;
                            j.each(o, function(v) {
                                v.trigger("destroy", v, v.collection, t);
                                t.error && t.error.apply(v, u)
                            })
                        },
                        url: p
                    }, t);
                    l = [s.related.fetch(k)]
                } else {
                    l = j.map(m, function(u) {
                        var v = j.defaults({
                            error: function() {
                                if (j.contains(o, u)) {
                                    u.trigger("destroy", u, u.collection, t);
                                    t.error && t.error.apply(u, arguments)
                                }
                            }
                        }, t);
                        return u.fetch(v)
                    }, this)
                }
            }
            return l
        },
        get: function(l) {
            var m = i.Model.prototype.get.call(this, l);
            if (!this.dotNotation || l.indexOf(".") === -1) {
                return m
            }
            var n = l.split(".");
            var k = j.reduce(n, function(o, p) {
                if (!(o instanceof i.Model)) {
                    throw new Error("Attribute must be an instanceof Backbone.Model. Is: " + o + ", currentSplit: " + p)
                }
                return i.Model.prototype.get.call(o, p)
            }, this);
            if (m !== b && k !== b) {
                throw new Error("Ambiguous result for '" + l + "'. direct result: " + m + ", dotNotation: " + k)
            }
            return m || k
        },
        set: function(o, p, n) {
            i.Relational.eventQueue.block();
            var l;
            if (j.isObject(o) || o == null) {
                l = o;
                n = p
            } else {
                l = {};
                l[o] = p
            }
            try {
                var q = this.id,
                    m = l && this.idAttribute in l && l[this.idAttribute];
                i.Relational.store.checkId(this, m);
                var k = i.Model.prototype.set.apply(this, arguments);
                if (!this._isInitialized && !this.isLocked()) {
                    this.constructor.initializeModelHierarchy();
                    i.Relational.store.register(this);
                    this.initializeRelations(n)
                } else {
                    if (m && m !== q) {
                        i.Relational.store.update(this)
                    }
                }
                if (l) {
                    this.updateRelations(n)
                }
            } finally {
                i.Relational.eventQueue.unblock()
            }
            return k
        },
        unset: function(m, l) {
            i.Relational.eventQueue.block();
            var k = i.Model.prototype.unset.apply(this, arguments);
            this.updateRelations(l);
            i.Relational.eventQueue.unblock();
            return k
        },
        clear: function(l) {
            i.Relational.eventQueue.block();
            var k = i.Model.prototype.clear.apply(this, arguments);
            this.updateRelations(l);
            i.Relational.eventQueue.unblock();
            return k
        },
        clone: function() {
            var k = j.clone(this.attributes);
            if (!j.isUndefined(k[this.idAttribute])) {
                k[this.idAttribute] = null
            }
            j.each(this.getRelations(), function(l) {
                delete k[l.key]
            });
            return new this.constructor(k)
        },
        toJSON: function(k) {
            if (this.isLocked()) {
                return this.id
            }
            this.acquire();
            var l = i.Model.prototype.toJSON.call(this, k);
            if (this.constructor._superModel && !(this.constructor._subModelTypeAttribute in l)) {
                l[this.constructor._subModelTypeAttribute] = this.constructor._subModelTypeValue
            }
            j.each(this._relations, function(m) {
                var o = l[m.key],
                    p = m.options.includeInJSON,
                    n = null;
                if (p === true) {
                    if (o && j.isFunction(o.toJSON)) {
                        n = o.toJSON(k)
                    }
                } else {
                    if (j.isString(p)) {
                        if (o instanceof i.Collection) {
                            n = o.pluck(p)
                        } else {
                            if (o instanceof i.Model) {
                                n = o.get(p)
                            }
                        }
                        if (p === m.relatedModel.prototype.idAttribute) {
                            if (m instanceof i.HasMany) {
                                n = n.concat(m.keyIds)
                            } else {
                                if (m instanceof i.HasOne) {
                                    n = n || m.keyId
                                }
                            }
                        }
                    } else {
                        if (j.isArray(p)) {
                            if (o instanceof i.Collection) {
                                n = [];
                                o.each(function(r) {
                                    var q = {};
                                    j.each(p, function(s) {
                                        q[s] = r.get(s)
                                    });
                                    n.push(q)
                                })
                            } else {
                                if (o instanceof i.Model) {
                                    n = {};
                                    j.each(p, function(q) {
                                        n[q] = o.get(q)
                                    })
                                }
                            }
                        } else {
                            delete l[m.key]
                        }
                    }
                }
                if (p) {
                    l[m.keyDestination] = n
                }
                if (m.keyDestination !== m.key) {
                    delete l[m.key]
                }
            });
            this.release();
            return l
        }
    }, {
        setup: function(k) {
            this.prototype.relations = (this.prototype.relations || []).slice(0);
            this._subModels = {};
            this._superModel = null;
            if (this.prototype.hasOwnProperty("subModelTypes")) {
                i.Relational.store.addSubModels(this.prototype.subModelTypes, this)
            } else {
                this.prototype.subModelTypes = null
            }
            j.each(this.prototype.relations || [], function(l) {
                if (!l.model) {
                    l.model = this
                }
                if (l.reverseRelation && l.model === this) {
                    var n = true;
                    if (j.isString(l.relatedModel)) {
                        var m = i.Relational.store.getObjectByName(l.relatedModel);
                        n = m && (m.prototype instanceof i.RelationalModel)
                    }
                    if (n) {
                        i.Relational.store.initializeRelation(null, l)
                    } else {
                        if (j.isString(l.relatedModel)) {
                            i.Relational.store.addOrphanRelation(l)
                        }
                    }
                }
            }, this);
            return this
        },
        build: function(m, o) {
            var n = this;
            this.initializeModelHierarchy();
            if (this._subModels && this.prototype.subModelTypeAttribute in m) {
                var l = m[this.prototype.subModelTypeAttribute];
                var k = this._subModels[l];
                if (k) {
                    n = k
                }
            }
            return new n(m, o)
        },
        initializeModelHierarchy: function() {
            if (j.isUndefined(this._superModel) || j.isNull(this._superModel)) {
                i.Relational.store.setupSuperModel(this);
                if (this._superModel && this._superModel.prototype.relations) {
                    var k = j.select(this._superModel.prototype.relations || [], function(l) {
                        return !j.any(this.prototype.relations || [], function(m) {
                            return l.relatedModel === m.relatedModel && l.key === m.key
                        }, this)
                    }, this);
                    this.prototype.relations = k.concat(this.prototype.relations)
                } else {
                    this._superModel = false
                }
            }
            if (this.prototype.subModelTypes && j.keys(this.prototype.subModelTypes).length !== j.keys(this._subModels).length) {
                j.each(this.prototype.subModelTypes || [], function(m) {
                    var l = i.Relational.store.getObjectByName(m);
                    l && l.initializeModelHierarchy()
                })
            }
        },
        findOrCreate: function(k, m) {
            m || (m = {});
            var n = (j.isObject(k) && m.parse && this.prototype.parse) ? this.prototype.parse(k) : k;
            var l = i.Relational.store.find(this, n);
            if (j.isObject(k)) {
                if (l && m.merge !== false) {
                    delete m.collection;
                    l.set(n, m)
                } else {
                    if (!l && m.create !== false) {
                        l = this.build(k, m)
                    }
                }
            }
            return l
        }
    });
    j.extend(i.RelationalModel.prototype, i.Semaphore);
    i.Collection.prototype.__prepareModel = i.Collection.prototype._prepareModel;
    i.Collection.prototype._prepareModel = function(m, l) {
        var k;
        if (m instanceof i.Model) {
            if (!m.collection) {
                m.collection = this
            }
            k = m
        } else {
            l || (l = {});
            l.collection = this;
            if (typeof this.model.findOrCreate !== "undefined") {
                k = this.model.findOrCreate(m, l)
            } else {
                k = new this.model(m, l)
            }
            if (k && k.isNew() && !k._validate(m, l)) {
                this.trigger("invalid", this, m, l);
                k = false
            }
        }
        return k
    };
    var g = i.Collection.prototype.__set = i.Collection.prototype.set;
    i.Collection.prototype.set = function(n, l) {
        if (!(this.model.prototype instanceof i.RelationalModel)) {
            return g.apply(this, arguments)
        }
        if (l && l.parse) {
            n = this.parse(n, l)
        }
        if (!j.isArray(n)) {
            n = n ? [n] : []
        }
        var k = [],
            m = [];
        j.each(n, function(o) {
            if (!(o instanceof i.Model)) {
                o = i.Collection.prototype._prepareModel.call(this, o, l)
            }
            if (o) {
                m.push(o);
                if (!(this.get(o) || this.get(o.cid))) {
                    k.push(o)
                } else {
                    if (o.id != null) {
                        this._byId[o.id] = o
                    }
                }
            }
        }, this);
        g.call(this, m, j.defaults({
            parse: false
        }, l));
        j.each(k, function(o) {
            if (this.get(o) || this.get(o.cid)) {
                this.trigger("relational:add", o, this, l)
            }
        }, this);
        return this
    };
    var e = i.Collection.prototype.__remove = i.Collection.prototype.remove;
    i.Collection.prototype.remove = function(m, k) {
        if (!(this.model.prototype instanceof i.RelationalModel)) {
            return e.apply(this, arguments)
        }
        m = j.isArray(m) ? m.slice() : [m];
        k || (k = {});
        var l = [];
        j.each(m, function(n) {
            n = this.get(n) || this.get(n.cid);
            n && l.push(n)
        }, this);
        if (l.length) {
            e.call(this, l, k);
            j.each(l, function(n) {
                this.trigger("relational:remove", n, this, k)
            }, this)
        }
        return this
    };
    var f = i.Collection.prototype.__reset = i.Collection.prototype.reset;
    i.Collection.prototype.reset = function(l, k) {
        k = j.extend({
            merge: true
        }, k);
        f.call(this, l, k);
        if (this.model.prototype instanceof i.RelationalModel) {
            this.trigger("relational:reset", this, k)
        }
        return this
    };
    var d = i.Collection.prototype.__sort = i.Collection.prototype.sort;
    i.Collection.prototype.sort = function(k) {
        d.call(this, k);
        if (this.model.prototype instanceof i.RelationalModel) {
            this.trigger("relational:reset", this, k)
        }
        return this
    };
    var a = i.Collection.prototype.__trigger = i.Collection.prototype.trigger;
    i.Collection.prototype.trigger = function(l) {
        if (!(this.model.prototype instanceof i.RelationalModel)) {
            return a.apply(this, arguments)
        }
        if (l === "add" || l === "remove" || l === "reset") {
            var k = this,
                m = arguments;
            if (j.isObject(m[3])) {
                m = j.toArray(m);
                m[3] = j.clone(m[3])
            }
            i.Relational.eventQueue.add(function() {
                a.apply(k, m)
            })
        } else {
            a.apply(this, arguments)
        }
        return this
    };
    i.RelationalModel.extend = function(k, l) {
        var m = i.Model.extend.apply(this, arguments);
        m.setup(this);
        return m
    }
})();
(function($) {
    if (window.ENV === undefined) {
        window.ENV = {}
    }
    var DEV_MODE_STRING = "replace_version_by_deploy_shell";
    var devMode = !! (ENV.VERSION === DEV_MODE_STRING);
    var storageAvailable = $.jStorage.storageAvailable();
    (function() {
        if (storageAvailable) {
            if (devMode) {
                $.jStorage.flush()
            } else {
                if (ENV.VERSION !== $.jStorage.get("TEMPLATE_VERSION")) {
                    $.jStorage.flush();
                    $.jStorage.set("TEMPLATE_VERSION", ENV.VERSION)
                }
            }
        }
    })();
    var ns = {};
    var TemplateCache = {};
    var Namespace = function Namespace(ns_string, klass) {
        var parts = ns_string.split("."),
            parent = ns,
            i;
        if (parts[0] === "race") {
            parts = parts.slice(1)
        }
        for (i = 0; i < parts.length; i += 1) {
            if (typeof parent[parts[i]] === "undefined") {
                if (parts.length - 1 === i && typeof klass === "function") {
                    parent[parts[i]] = klass
                } else {
                    parent[parts[i]] = {}
                }
            }
            parent = parent[parts[i]]
        }
        switch (typeof klass) {
            case "object":
                _.extend(parent, klass);
                break;
            default:
                break
        }
        return parent
    };
    var Template = function Template(templateName, templateFullPath, requestOptions) {
        this.templateName = templateName;
        this.templateFullPath = templateFullPath;
        this.templatePrefix = ENV.TEMPLATE_PREFIX || location.host.replace(/\./g, "");
        this.templatePath = ENV.TEMPLATE_PATH || "/resources/template/";
        this.templateExtention = ENV.TEMPLATE_EXTENTION || "jst";
        this.storageAvailable = storageAvailable;
        this.requestOptions = $.extend({
            async: false,
            dataType: "html"
        }, requestOptions || {});
        devMode && $.extend(this.requestOptions, {
            cache: false
        });
        this.templateName && this.load()
    };
    Template.prototype = {
        load: function() {
            var template = this.storageAvailable ? $.jStorage.get(this.templatePrefix + "_" + this.templateName) : TemplateCache[this.templateName];
            if (template) {
                this.template = template
            } else {
                $.ajax($.extend(this.requestOptions, {
                    url: this.templateFullPath ? this.templateFullPath : this.getTemplateFilePath(this.templateName)
                })).done($.proxy(this.storedCache, this))
            }
        },
        storedCache: function(response) {
            var templateName = this.templateName;
            this.template = response.replace(/#\{([0-9a-zA-Z_.\(\)'"]*)?\}/ig, function(_, s) {
                return "<%=" + s + "%>"
            });
            if (this.storageAvailable) {
                $.jStorage.set(this.templatePrefix + "_" + templateName, this.template)
            } else {
                TemplateCache[templateName] = this.template
            }
        },
        getTemplateFilePath: function(templateName) {
            return this.templatePath + templateName + "." + this.templateExtention
        },
        getTemplate: function() {
            return _.template(this.template)
        },
        getTemplateString: function() {
            return this.template
        },
        parse: function(json) {
            if (typeof json === "string") {
                json = $.parseJSON(json)
            }
            return $((this.getTemplate())(json || {}).replace(/\n/g, ""))
        }
    };
    var JST = {
        get: function(templateName, templateFullPath) {
            return new Template(templateName, templateFullPath).getTemplateString()
        },
        getWithScriptType: function(templateName, templateFullPath) {
            var template = new Template(templateName, templateFullPath).getTemplateString(),
                scriptTag = document.createElement("script");
            scriptTag.setAttribute("type", "text/html");
            scriptTag.text = template;
            return $(scriptTag)
        }
    };
    var Util = {
        randomString: function(length) {
            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".split("");
            if (!length) {
                length = Math.floor(Math.random() * chars.length)
            }
            var str = "";
            for (var i = 0; i < length; i++) {
                str += chars[Math.floor(Math.random() * chars.length)]
            }
            return str
        },
        getPhotourl: function(url, size) {
            if (!/^http/.test(url)) {
                return url
            }
            var PHOTO_MEDIA_DOMAIN1 = "photo-media.daum-img.net";
            var PHOTO_MEDIA_DOMAIN2 = "photo-media.hanmail.net";
            var PHOTO_DAUMCDN_DOMAIN = "i2.media.daumcdn.net/photo-media";
            var THUMBNAIL_FRAM_DOMAIN = "daumcdn.net";
            var PREFIX_OLD_CROP = "C";
            var PREFIX_NEW_CROP = "F";
            var PREFIX_TOP_CROP = "T";
            var mobile = !! (((/^\/m\//).test(location.pathname)));
            if (mobile) {
                THUMBNAIL_FRAM_DOMAIN = "http://m1." + THUMBNAIL_FRAM_DOMAIN
            } else {
                THUMBNAIL_FRAM_DOMAIN = "http://i2.media." + THUMBNAIL_FRAM_DOMAIN
            }
            url = url.replace(PHOTO_MEDIA_DOMAIN1, PHOTO_DAUMCDN_DOMAIN);
            url = url.replace(PHOTO_MEDIA_DOMAIN2, PHOTO_DAUMCDN_DOMAIN);
            size = size.replace(/_/g, "");
            size = size.replace(PREFIX_OLD_CROP, PREFIX_NEW_CROP);
            if ((/^\d/).test(size)) {
                size = PREFIX_TOP_CROP + size
            }
            if (url.indexOf("/photo-media/20") > -1) {
                url = url.replace("photo-media", "svc/image/U03/news")
            }
            return THUMBNAIL_FRAM_DOMAIN + "/thumb/" + size + "ht.u/?fname=" + encodeURIComponent(url)
        },
        getPhotoUrl: function(s, size) {
            return this.getPhotourl(s, size)
        },
        commafyNumber: function(input) {
            var input = String(input);
            var reg = /(\-?\d+)(\d{3})($|\.\d+)/;
            if (reg.test(input)) {
                return input.replace(reg, $.proxy(function(str, p1, p2, p3) {
                    return this.commafyNumber(p1) + "," + p2 + "" + p3
                }, this))
            } else {
                return input
            }
        },
        getNewsId: function(url) {
            var regexResult = /(?:news(?:i|I)d=|\/|#)(\d{17})/.exec(url);
            if (regexResult && regexResult.length > 0) {
                return regexResult[1]
            } else {
                return ""
            }
        },
        getGalleryId: function(url) {
            var regexResult = /(?:photo\/)(\d+)/.exec(url);
            if (regexResult && regexResult.length > 0) {
                return regexResult[1]
            } else {
                return ""
            }
        },
        getPollId: function(url) {
            var regexResult = /\w{32}/.exec(url);
            if (regexResult && regexResult.length > 0) {
                return regexResult[0]
            } else {
                return ""
            }
        },
        isVLink: function(url) {
            return /^(http:\S+)?\/v\/[0-9]{17}((?=\?)|$)/.test(url)
        },
        cutString: function(s, limit, suff) {
            var suffix = suff || "",
                _limit = limit - suffix.length,
                _byte = 0,
                _str = "",
                temp, i, chr;
            for (i = 0; i < s.length; i++) {
                chr = s.charAt(i);
                temp = (escape(chr).length > 3) ? 2 : 1;
                _byte += temp;
                _limit -= temp;
                if (_limit >= 0) {
                    _str += chr
                }
            }
            return (limit >= _byte) ? s : _str += suffix
        },
        subString: function(str, num) {
            if (str.length > num) {
                return str.substring(0, num) + ".."
            } else {
                return str
            }
        },
        jsonPath: function(obj, expr, arg) {
            var P = {
                resultType: arg && arg.resultType || "VALUE",
                result: [],
                normalize: function(expr) {
                    var subx = [];
                    return expr.replace(/[\['](\??\(.*?\))[\]']/g, function($0, $1) {
                        return "[#" + (subx.push($1) - 1) + "]"
                    }).replace(/'?\.'?|\['?/g, ";").replace(/;;;|;;/g, ";..;").replace(/;$|'?\]|'$/g, "").replace(/#([0-9]+)/g, function($0, $1) {
                        return subx[$1]
                    })
                },
                asPath: function(path) {
                    var x = path.split(";"),
                        p = "$";
                    for (var i = 1, n = x.length; i < n; i++) {
                        p += /^[0-9*]+$/.test(x[i]) ? ("[" + x[i] + "]") : ("['" + x[i] + "']")
                    }
                    return p
                },
                store: function(p, v) {
                    if (p) {
                        P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v
                    }
                    return !!p
                },
                trace: function(expr, val, path) {
                    if (expr) {
                        var x = expr.split(";"),
                            loc = x.shift();
                        x = x.join(";");
                        if (val && val.hasOwnProperty(loc)) {
                            P.trace(x, val[loc], path + ";" + loc)
                        } else {
                            if (loc === "*") {
                                P.walk(loc, x, val, path, function(m, l, x, v, p) {
                                    P.trace(m + ";" + x, v, p)
                                })
                            } else {
                                if (loc === "..") {
                                    P.trace(x, val, path);
                                    P.walk(loc, x, val, path, function(m, l, x, v, p) {
                                        typeof v[m] === "object" && P.trace("..;" + x, v[m], p + ";" + m)
                                    })
                                } else {
                                    if (/,/.test(loc)) {
                                        for (var s = loc.split(/'?,'?/), i = 0, n = s.length; i < n; i++) {
                                            P.trace(s[i] + ";" + x, val, path)
                                        }
                                    } else {
                                        if (/^\(.*?\)$/.test(loc)) {
                                            P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";") + 1)) + ";" + x, val, path)
                                        } else {
                                            if (/^\?\(.*?\)$/.test(loc)) {
                                                P.walk(loc, x, val, path, function(m, l, x, v, p) {
                                                    if (P.eval(l.replace(/^\?\((.*?)\)$/, "$1"), v[m], m)) {
                                                        P.trace(m + ";" + x, v, p)
                                                    }
                                                })
                                            } else {
                                                if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) {
                                                    P.slice(loc, x, val, path)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        P.store(path, val)
                    }
                },
                walk: function(loc, expr, val, path, f) {
                    if (val instanceof Array) {
                        for (var i = 0, n = val.length; i < n; i++) {
                            if (i in val) {
                                f(i, loc, expr, val, path)
                            }
                        }
                    } else {
                        if (typeof val === "object") {
                            for (var m in val) {
                                if (val.hasOwnProperty(m)) {
                                    f(m, loc, expr, val, path)
                                }
                            }
                        }
                    }
                },
                slice: function(loc, expr, val, path) {
                    if (val instanceof Array) {
                        var len = val.length,
                            start = 0,
                            end = len,
                            step = 1;
                        loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function($0, $1, $2, $3) {
                            start = parseInt($1 || start);
                            end = parseInt($2 || end);
                            step = parseInt($3 || step)
                        });
                        start = (start < 0) ? Math.max(0, start + len) : Math.min(len, start);
                        end = (end < 0) ? Math.max(0, end + len) : Math.min(len, end);
                        for (var i = start; i < end; i += step) {
                            P.trace(i + ";" + expr, val, path)
                        }
                    }
                },
                eval: function(x, _v, _vname) {
                    try {
                        return $ && _v && eval(x.replace(/@/g, "_v"))
                    } catch (e) {
                        throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a"))
                    }
                }
            };
            var $ = obj;
            if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
                P.trace(P.normalize(expr).replace(/^\$;/, ""), obj, "$");
                return P.result.length ? P.result : false
            }
        },
        removeBrackets: function(str) {
            return str.replace(/(<.*>)/, "").replace(/(\[.*\])/, "")
        },
        stripTags: function(s) {
            return this.unescapeHTML(s).replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>|<\\\/\w+>/gi, "")
        },
        escapeHTML: function(s) {
            return s.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, '"').replace(/'/g, "'")
        },
        unescapeHTML: function(s) {
            return s.replace(/</g, "<").replace(/>/g, ">").replace(/&/g, "&").replace(/"/g, '"').replace(/'/g, "'")
        },
        urlParam: function(name) {
            var results = new RegExp("[\\?&]" + name + "=([^&#]*)").exec(window.location.search);
            if (results) {
                return results[1] || 0
            } else {
                return false
            }
        },
        queryStringToObject: function(string) {
            var hashParams = {};
            var e, a = /\+/g,
                r = /([^&;=]+)=?([^&;]*)/g,
                d = function(s) {
                    return decodeURIComponent(s.replace(a, " "))
                }, q = string || location.search.replace(/\?/g, "");
            while (e = r.exec(q)) {
                hashParams[d(e[1])] = d(e[2])
            }
            return hashParams
        },
        getPagingData: function(data, _limit) {
            var limit = (_limit) ? _limit : 10;
            var number = parseInt(data.number, 10);
            var startPage = 1;
            var totalPages = parseInt(data.totalPages, 10);
            if (number > limit) {
                startPage = parseInt(number / limit, 10) * limit + 1;
                if (number % limit == 0) {
                    startPage = startPage - limit
                }
            }
            var endPage = startPage + limit - 1;
            endPage = (endPage >= totalPages) ? totalPages : endPage;
            var prevPage = startPage - 1;
            var nextPage = endPage + 1;
            var prevBtnStatus = (startPage != 1);
            var nextBtnStatus = (endPage != totalPages);
            return {
                firstPage: data.firstPage,
                lastPage: data.lastPage,
                totalElements: data.totalElements,
                prevBtnStatus: prevBtnStatus,
                nextBtnStatus: nextBtnStatus,
                totalPages: totalPages,
                number: number,
                startPage: startPage,
                endPage: endPage,
                prevPage: prevPage,
                nextPage: nextPage
            }
        },
        getEndDateForDateNavigation: function(_inputDate, _setSize) {
            var _now = new Date();
            var _now_yyyymmdd = new Date(_now.getFullYear(), _now.getMonth(), _now.getDate());
            var _date = new Date(_now_yyyymmdd.getFullYear(), _now_yyyymmdd.getMonth(), _now_yyyymmdd.getDate());
            if (_inputDate && _inputDate.length == 8) {
                var year = _inputDate.substring(0, 4);
                var month = _inputDate.substring(4, 6) - 1;
                var day = _inputDate.substring(6, 8);
                var temp = new Date(year, month, day);
                if (temp < _now_yyyymmdd) {
                    _date = temp
                }
            }
            var currentAndEndDateInterval = Math.floor(_setSize / 2);
            var oneDayMilliseconds = 1000 * 60 * 60 * 24;
            var nowAndInputDateInterval = (_now_yyyymmdd.getTime() - _date.getTime()) / oneDayMilliseconds;
            if (nowAndInputDateInterval < currentAndEndDateInterval) {
                currentAndEndDateInterval = (_setSize - _setSize % 2) - nowAndInputDateInterval
            }
            var endDate = new Date(_date.getFullYear(), _date.getMonth(), _date.getDate());
            if (_date.getDate() - currentAndEndDateInterval == 0) {
                endDate.setDate(0)
            } else {
                if (_date.getDate() - currentAndEndDateInterval < 0) {
                    endDate.setDate(0);
                    endDate.setDate(endDate.getDate() - currentAndEndDateInterval + _date.getDate())
                } else {
                    endDate.setDate(endDate.getDate() - currentAndEndDateInterval)
                }
            }
            return endDate
        },
        fillZero: function(number, width) {
            width -= number.toString().length;
            if (width > 0) {
                return new Array(width + (/\./.test(number) ? 2 : 1)).join("0") + number
            }
            return number + ""
        },
        objectToParamString: function(object) {
            var _params = Array();
            for (var key in object) {
                if (key) {
                    _params.push(key + "=" + object[key])
                }
            }
            return _params.join("&")
        },
        objectToEncodeParamString: function(object) {
            var _params = Array();
            for (var key in object) {
                if (key) {
                    _params.push(key + "=" + encodeURIComponent(object[key]))
                }
            }
            return _params.join("&")
        },
        convertDomToObjectForSimpleSlide: function(dom, domSize) {
            var group = [];
            _.each($(dom).children(), function(dom, idx) {
                var subGroupIdx = Math.floor(idx / domSize);
                if (!group[subGroupIdx]) {
                    group[subGroupIdx] = []
                }
                var subGroup = group[subGroupIdx];
                subGroup.push({
                    dom: dom,
                    html: dom.outerHTML
                })
            });
            return group
        },
        decodeDecimal: function(orgStr) {
            return orgStr.replace(/&#\d+;/g, function(m, p) {
                var len = m.length;
                return (String.fromCharCode(m.substring(2, len - 1)))
            })
        },
        windowOpen: function(url, name, width, height, x, y) {
            var xPos = x || (window.screen.width) ? (window.screen.width - width) / 2 : 0;
            var yPos = y || (window.screen.height) ? (window.screen.height - height) / 2 : 0;
            var options = "toolbar=0,directories=0,history=0,status=1,menubar=0,scrollbars=0,resizable=0,titlebar=no,location=no,width=" + width + ",height=" + height + ",left=" + xPos + ",top=" + yPos;
            window.open(url, name, options)
        },
        stopEvent: function(event) {
            if (event.preventDefault) {
                event.preventDefault()
            } else {
                event.returnValue = false
            }
            return event
        }
    };
    var DateUtil = {
        getDateObject: function(str) {
            str = (str.length == 14) ? str : str + "000000";
            str = str.toString().match(/[0-9]/gi).join("");
            var date = new Date(str.substring(0, 4), parseInt(str.substring(4, 6), 10) - 1, str.substring(6, 8), str.substring(8, 10), str.substring(10, 12), str.substring(12, 14));
            if (str.length < 14) {
                return str
            }
            return date
        },
        dateFormat: function(date, f) {
            if (typeof date == "object") {
                var dateObj = date
            } else {
                if (typeof date == "string" || typeof date == "number") {
                    var dateObj = this.getDateObject(date)
                } else {
                    if (date == undefined) {
                        return ""
                    }
                }
            }
            var d = dateObj;
            return (f || "yyyy.mm.dd HH:mi").replace(/(yyyy|yy|mm|dd|hh|HH|mi|ss|am|pm)/gi, function($1) {
                switch ($1) {
                    case "yyyy":
                        return d.getFullYear();
                    case "yy":
                        return d.getFullYear().toString().substr(2);
                    case "mm":
                        return Util.fillZero(parseInt(d.getMonth()) + 1, 2);
                    case "dd":
                        return Util.fillZero(d.getDate(), 2);
                    case "hh":
                        return Util.fillZero((h = d.getHours() % 12) ? h : 12, 2);
                    case "HH":
                        return Util.fillZero(d.getHours(), 2);
                    case "mi":
                        return Util.fillZero(d.getMinutes(), 2);
                    case "ss":
                        return Util.fillZero(d.getSeconds(), 2);
                    case "am":
                        return d.getHours() < 12 ? "am" : "pm";
                    case "pm":
                        return d.getHours() < 12 ? "am" : "pm"
                }
            })
        },
        getToday: function() {
            var date = new Date();
            return (date.getFullYear() + Util.fillZero(parseInt(date.getMonth()) + 1, 2) + Util.fillZero(date.getDate(), 2))
        },
        getWantedDay: function(date, amount) {
            var calculatedDayToHour = amount ? 24 * amount : 0;
            var d = new Date(date.valueOf() + (calculatedDayToHour * 60 * 60 * 1000));
            return (d.getFullYear() + Util.fillZero(d.getMonth() + 1, 2) + Util.fillZero(d.getDate(), 2))
        },
        whenWritten: function(timeString, dayOption, format) {
            var now = new Date();
            var nowUTC = parseInt(Date.parse(now));
            var tempDate = this.getDateObject(timeString);
            var tmpUTC = parseInt(Date.parse(tempDate));
            var utcTime = (nowUTC - tmpUTC) / 1000;
            var hour = Math.floor(utcTime / 3600);
            var min = Math.floor(utcTime % 3600 / 60);
            var sec = Math.floor(utcTime % 3600 % 60);
            var dateFormat = format || "yyyy.mm.dd";
            var result = this.dateFormat(timeString, dateFormat);
            if (hour < 24) {
                result = ((hour == "0") ? "" : hour + "시간") + ((min != "0" && hour == "0") ? min + "분" : "") + ((hour == "0" && min == "0") ? sec + "초" : "") + "전"
            }
            if (dayOption && hour >= 24) {
                result = parseInt((hour / 24)) + "일전"
            }
            return result
        }
    };
    var MoreBack = {
        KEY_PREFIX: "More_",
        URL_TIMESTAMP_PARAM_NAME: "More_TS",
        pageId: "",
        deleteTime: 10 * 60 * 1000,
        save: false,
        completeInit: false,
        init: function(url, queryString) {
            if (_.isNull(url) || _.isUndefined(url) || _.isEmpty(url)) {
                return
            }
            var currentTime = new Date().format("yyyymmddHHMMss");
            if (parseInt(currentTime.substr(12)) < 30) {
                currentTime = currentTime.substr(0, 12) + "00"
            } else {
                currentTime = currentTime.substr(0, 12) + "30"
            }
            if (_.isNull(queryString) || _.isUndefined(queryString) || _.isEmpty(queryString)) {
                queryString = this.URL_TIMESTAMP_PARAM_NAME + "=" + currentTime
            } else {
                if (queryString && queryString.indexOf(this.URL_TIMESTAMP_PARAM_NAME) < 0) {
                    queryString = queryString + "&" + this.URL_TIMESTAMP_PARAM_NAME + "=" + currentTime
                } else {
                    if (queryString) {
                        var paramTimestamp = queryString.substr(queryString.lastIndexOf(this.URL_TIMESTAMP_PARAM_NAME + "=") + 8, 15);
                        if (DateUtil.getDateObject(currentTime).getTime() - DateUtil.getDateObject(paramTimestamp).getTime() > this.deleteTime) {
                            queryString = queryString.replace(paramTimestamp, currentTime)
                        }
                    }
                }
            }
            this.pageId = url + "?" + queryString;
            var size = localStorage.length;
            var removeKey = [];
            for (var i = 0; i < size; i++) {
                var key = localStorage.key(i);
                if (key && key.indexOf(this.KEY_PREFIX) == 0) {
                    var keyTimestamp = key.substr(key.lastIndexOf(this.URL_TIMESTAMP_PARAM_NAME + "=") + 8, 15);
                    if (_.isNaN(keyTimestamp) || DateUtil.getDateObject(currentTime).getTime() - DateUtil.getDateObject(keyTimestamp).getTime() > this.deleteTime) {
                        removeKey.push(key)
                    }
                }
            }
            _.each(removeKey, function(key) {
                localStorage.removeItem(key)
            });
            var data = localStorage.getItem(this.KEY_PREFIX + this.pageId + "_Data");
            if (!_.isNull(data) && !_.isUndefined(data) && !_.isEmpty(data)) {
                this.save = true
            }
            this.completeInit = true;
            window.onbeforeunload = function() {
                if (MoreBack.save) {
                    MoreBack.set(MoreBack.KEY_PREFIX + MoreBack.pageId + "_ScrollY", $(document).scrollTop())
                }
            };
            window.onunload = function() {
                if (MoreBack.save) {
                    MoreBack.set(MoreBack.KEY_PREFIX + MoreBack.pageId + "_ScrollY", $(document).scrollTop())
                }
            }
        },
        set: function(key, value) {
            try {
                localStorage.setItem(key, value)
            } catch (e) {}
        },
        setData: function(data) {
            if (!this.completeInit) {
                return
            }
            if (typeof data != "string") {
                data = JSON.stringify(data)
            }
            this.set(MoreBack.KEY_PREFIX + this.pageId + "_Data", data);
            this.save = true;
            window.history.replaceState(null, null, this.pageId)
        },
        setPageInfo: function(pageInfo) {
            if (!this.completeInit) {
                return
            }
            if (typeof pageInfo != "string") {
                pageInfo = JSON.stringify(pageInfo)
            }
            this.set(MoreBack.KEY_PREFIX + this.pageId + "_Page", pageInfo)
        },
        getData: function() {
            if (!this.completeInit) {
                return null
            }
            return localStorage.getItem(this.KEY_PREFIX + this.pageId + "_Data")
        },
        getDataObject: function() {
            if (!this.completeInit) {
                return null
            }
            var data = localStorage.getItem(this.KEY_PREFIX + this.pageId + "_Data");
            if (_.isNull(data) || _.isUndefined(data)) {
                return data
            }
            return $.parseJSON(data)
        },
        getPageInfo: function() {
            if (!this.completeInit) {
                return null
            }
            return localStorage.getItem(this.KEY_PREFIX + this.pageId + "_Page")
        },
        getPageInfoObject: function() {
            if (!this.completeInit) {
                return null
            }
            var pageInfo = localStorage.getItem(this.KEY_PREFIX + this.pageId + "_Page");
            if (_.isNull(pageInfo) || _.isUndefined(pageInfo)) {
                return pageInfo
            }
            return $.parseJSON(pageInfo)
        },
        getScrollY: function() {
            if (!this.completeInit) {
                return 0
            }
            return localStorage.getItem(this.KEY_PREFIX + this.pageId + "_ScrollY")
        }
    };
    var MediPot = (function() {
        var PLAYER_URL = "http://videofarm.daum.net/controller/video/viewer/Video.html";
        var LIST_PLAYER_URL = "http://videofarm.daum.net/controller/video/viewer/VideoForList.html";
        var DEFAULT_WIDTH = 640;
        var DEFAULT_HEIGHT = 360;
        var MediPot = function(wrapper, vid, options) {
            var wrap = typeof wrapper === "string" ? document.getElementById(wrapper) : wrapper;
            var regexResult = /vid=([\w\$]+)/.exec(vid);
            var vid = (regexResult && regexResult.length > 1) ? regexResult[1] : vid;
            if (!wrap || !vid) {
                console.log("wrap or vid is required.", wrap, vid);
                return
            }
            this.options = $.extend({
                vid: vid,
                play_loc: "daum_news",
                width: DEFAULT_WIDTH,
                height: DEFAULT_HEIGHT,
                wmode: "transparent",
                autoplay: true,
                list_play: false
            }, options || {});
            var iframe = document.createElement("iframe");
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("scrolling", "no");
            if (this.options.list_play === true) {
                iframe.width = 1;
                iframe.height = 1;
                iframe.style.position = "absolute";
                iframe.style.top = "-100px";
                iframe.style.height = "-100px";
                iframe.src = LIST_PLAYER_URL + "?play_loc=" + this.options.play_loc
            } else {
                iframe.width = this.options.width;
                iframe.height = this.options.height;
                iframe.src = PLAYER_URL + "?" + Util.objectToParamString(this.options)
            }
            wrap.appendChild(iframe);
            this.iframe = iframe
        };
        MediPot.prototype = {
            getPlayer: function() {
                return this.iframe
            },
            getPlayerWindow: function() {
                return this.getPlayer().contentWindow
            },
            play: function(vid) {
                return this.getPlayerWindow().play(vid || this.options.vid)
            }
        };
        return MediPot
    })();
    var DimmedLayer = (function() {
        var getScrollOffsets = function() {
            return {
                left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
                top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            }
        };
        var getWindowSize = function() {
            var w = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 1003) - 2,
                h = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 650) - 2;
            return {
                width: w,
                height: h
            }
        };
        var setOpacity = function(el, op) {
            el.css("filter", "alpha(opacity=" + op * 100 + ")");
            el.css("opacity", op);
            el.css("MozOpacity", op);
            el.css("KhtmlOpacity", op)
        };
        var DimmedLayer = function(options) {
            this.callbackFunc = function() {};
            this.options = _.extend({
                bg: jQuery(document.createElement("div")),
                layer: jQuery(document.createElement("div")).html('<a href="#" class="btn_close">닫기</a>'),
                bgStyle: {},
                layerStyle: {},
                closeClassName: "btn_close",
                scroll: true,
                overWrite: false,
                target: document.body
            }, options || {});
            this.bgStyle = _.extend({
                position: "absolute",
                top: 0,
                left: 0,
                backgroundImage: "url(http://i1.daumcdn.net/img-section/sports09/common/dim.png)",
                width: "100%",
                display: "none",
                zIndex: 100000
            }, this.options.bgStyle || {});
            this.layerStyle = _.extend({
                position: "absolute",
                display: "none",
                top: "50%",
                left: "50%",
                marginTop: "0",
                marginLeft: "0",
                zIndex: 100001
            }, this.options.layerStyle || {});
            this.callFunc = function() {};
            this.closeFunc = function() {};
            this.initialize()
        };
        DimmedLayer.prototype = {
            initialize: function() {
                this.bg = jQuery(this.options.bg);
                this.layer = jQuery(this.options.layer);
                this.bg.css(this.bgStyle);
                this.layer.css(this.layerStyle);
                this.bg.attr("id", "_dimmed_bg");
                this.layer.attr("id", "_dimmed_layer");
                setOpacity(this.bg, 0);
                setOpacity(this.layer, 0);
                if (this.options.overWrite) {
                    this.destroy()
                }
                if (!jQuery(this.options.target).has("#_dimmed_bg").size() || !jQuery(this.options.target).has("#_dimmed_layer").size()) {
                    this.options.target.appendChild(this.bg.get(0));
                    this.options.target.appendChild(this.layer.get(0))
                }
                if (typeof this.options.closeClassName === "string") {
                    var dl = this;
                    this.layer.find("." + this.options.closeClassName).click(function(e) {
                        dl.close()
                    })
                } else {
                    _.each(this.options.closeClassName, jQuery.proxy(function(data, idx) {
                        var dl = this;
                        this.layer.find("." + data).click(function(e) {
                            dl.close()
                        })
                    }, this))
                }
            },
            resizeBg: function() {
                this.bg.css("height", Math.max(window.document.compatMode === "CSS1Compat" && window.document.documentElement.clientWidth && window.document.documentElement.clientHeight ? window.document.documentElement.clientHeight : document.documentElement.clientHeight, document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight))
            },
            scrollBg: function() {
                var m = Math.abs(parseInt(this.layerStyle.marginTop, 10));
                var t1 = getScrollOffsets().top + m;
                var t2 = getScrollOffsets().top + Math.ceil(getWindowSize().height / 2);
                var top = t1 > t2 ? t1 : t2;
                this.layer.css("top", top + "px")
            },
            showBg: function() {
                this.resizeBg();
                if (this.options.scroll) {
                    this.scrollBg()
                }
                this.bg.show();
                setOpacity(this.bg, 0.9)
            },
            hideBg: function() {
                setOpacity(this.bg, 0);
                this.bg.hide();
                this.closeFunc()
            },
            show: function() {
                this.showBg();
                this.layer.show();
                setOpacity(this.layer, 1);
                this.callFunc()
            },
            hide: function() {
                setOpacity(this.layer, 0);
                this.layer.hide();
                this.hideBg()
            },
            call: function(callfunc, closefunc) {
                if (typeof(callfunc) == "function") {
                    this.callFunc = callfunc
                }
                if (typeof(closefunc) == "function") {
                    this.closeFunc = closefunc
                }
                this.show();
                jQuery(window).on("resize", jQuery.proxy(this.resizeBg, this));
                if (this.options.scroll) {
                    jQuery(window).on("scroll", jQuery.proxy(this.scrollBg, this))
                }
            },
            close: function() {
                this.hide();
                jQuery(window).off("resize", jQuery.proxy(this.resizeBg, this));
                if (this.options.scroll) {
                    jQuery(window).off("scroll", jQuery.proxy(this.scrollBg, this))
                }
            },
            destroy: function() {
                $("#_dimmed_bg").remove();
                $("#_dimmed_layer").remove()
            }
        };
        return DimmedLayer
    })();
    var MediaPassiveTiara = {
        isInitialized: false,
        pageDomain: "http://media.daum.net",
        initialize: function() {
            window.__pageTracker = {};
            if (typeof __Tiara !== "undefined" && typeof __Tiara.__getTracker !== "undefined") {
                __pageTracker = __Tiara.__getTracker()
            } else {
                __pageTracker.__setTitle = function() {};
                __pageTracker.__setReferer = function() {};
                __pageTracker.__trackPageview = function() {}
            }
            this.isInitialized = true
        },
        callTiara: function(title, domain) {
            var pageTitle = (!_.isUndefined(title) && !_.isEmpty(title)) ? title : document.title;
            var pageDomain = (!_.isUndefined(domain) && !_.isEmpty(domain)) ? domain : this.pageDomain;
            try {
                if (this.isInitialized === false) {
                    this.initialize()
                }
                if (location.search == "") {
                    var differ = "?"
                } else {
                    var differ = "&"
                }
                var _pageurl = pageDomain + location.pathname + location.search + location.hash;
                var _pagetitle = pageTitle;
                if (typeof __pageTracker !== "undefined") {
                    __pageTracker.__setTitle(_pagetitle);
                    __pageTracker.__setReferer(document.referrer);
                    __pageTracker.__setAllowHash(true);
                    window.setTimeout(function() {
                        try {
                            window.__pageTracker.__trackPageview(_pageurl)
                        } catch (e) {}
                    }, 100)
                }
            } catch (e) {}
            if (typeof __Tiara == "undefined") {
                (function(d) {
                    var se = d.createElement("script");
                    se.type = "text/javascript";
                    se.id = "__tiara__script";
                    se.async = true;
                    se.src = location.protocol + "//m1.daumcdn.net/tiara/js/td.min.js";
                    var s = d.getElementsByTagName("head")[0];
                    s.appendChild(se)
                })(document);
                window.setTimeout($.proxy(function() {
                    this.isInitialized = false;
                    this.callTiara(pageTitle, pageDomain)
                }, this), 500)
            }
        }
    };
    $.extend(window, Namespace("Common", {
        namespace: Namespace,
        Template: Template,
        JST: JST,
        Util: Util,
        DateUtil: DateUtil,
        MediPot: MediPot,
        DimmedLayer: DimmedLayer,
        MoreBack: MoreBack,
        MediaPassiveTiara: MediaPassiveTiara
    }))
})(window.jQuery);
var dateFormat = function() {
    var a = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        b = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        d = /[^-+\dA-Z]/g,
        c = function(f, e) {
            f = String(f);
            e = e || 2;
            while (f.length < e) {
                f = "0" + f
            }
            return f
        };
    return function(l, z, u) {
        var i = dateFormat;
        if (arguments.length == 1 && Object.prototype.toString.call(l) == "[object String]" && !/\d/.test(l)) {
            z = l;
            l = undefined
        }
        l = l ? new Date(l) : new Date;
        try {
            if (isNaN(l)) {
                throw SyntaxError("invalid date")
            }
        } catch (n) {}
        z = String(i.masks[z] || z || i.masks["default"]);
        if (z.slice(0, 4) == "UTC:") {
            z = z.slice(4);
            u = true
        }
        var w = u ? "getUTC" : "get",
            q = l[w + "Date"](),
            f = l[w + "Day"](),
            k = l[w + "Month"](),
            t = l[w + "FullYear"](),
            v = l[w + "Hours"](),
            p = l[w + "Minutes"](),
            x = l[w + "Seconds"](),
            r = l[w + "Milliseconds"](),
            g = u ? 0 : l.getTimezoneOffset(),
            j = {
                d: q,
                dd: c(q),
                ddd: i.i18n.dayNames[f],
                dddd: i.i18n.dayNames[f + 7],
                m: k + 1,
                mm: c(k + 1),
                mmm: i.i18n.monthNames[k],
                mmmm: i.i18n.monthNames[k + 12],
                yy: String(t).slice(2),
                yyyy: t,
                h: v % 12 || 12,
                hh: c(v % 12 || 12),
                H: v,
                HH: c(v),
                M: p,
                MM: c(p),
                s: x,
                ss: c(x),
                l: c(r, 3),
                L: c(r > 99 ? Math.round(r / 10) : r),
                t: v < 12 ? "a" : "p",
                tt: v < 12 ? "am" : "pm",
                T: v < 12 ? "A" : "P",
                TT: v < 12 ? "AM" : "PM",
                Z: u ? "UTC" : (String(l).match(b) || [""]).pop().replace(d, ""),
                o: (g > 0 ? "-" : "+") + c(Math.floor(Math.abs(g) / 60) * 100 + Math.abs(g) % 60, 4),
                S: ["th", "st", "nd", "rd"][q % 10 > 3 ? 0 : (q % 100 - q % 10 != 10) * q % 10]
            };
        return z.replace(a, function(e) {
            return e in j ? j[e] : e.slice(1, e.length - 1)
        })
    }
}();
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    newsDate: "yyyy.mm.dd HH:MM",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};
dateFormat.i18n = {
    dayNames: ["일", "월", "화", "수", "목", "금", "토", "일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
    monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};
Date.prototype.format = function(a, b) {
    return dateFormat(this, a, b)
};
(function(c) {
    var b = function(e) {
        this.initialize(e)
    };
    b.prototype = {
        idx: 0,
        data: {},
        template: _.template("<div>template</div>"),
        initialize: function(e) {
            _.extend(this, e)
        },
        setData: function(e) {
            this.data = e
        },
        getData: function(e) {
            return this.data
        },
        toHTML: function() {
            return this.template(this.data)
        },
        getIdx: function() {
            return this.idx
        }
    };
    var a = function(k, g, f) {
        var n = _.template('<span class="num_page" data-page="<%=index%>"><%=index%></span>');
        var l = _.template('<em class="num_page"><%=index%></em>');
        var m = _.template('<span class="screen_out">현재 페이지</span>');
        var e = (f) ? f : 0;
        c(k).html("");
        for (var j = 0; j <= g.length - 1; j++) {
            if (e == j) {
                c(k).append(m({}));
                c(k).append(l({
                    index: j
                }))
            } else {
                c(k).append(n({
                    index: j
                }))
            }
        }
    };
    var d = function(u) {
        var t = jQuery("<div>");
        var f = {
            framewrap: t,
            pagingwrap: t,
            btnwrap: t,
            data: [],
            template: _.template("<div></div>"),
            options: {
                index: 0,
                type: "infinity",
                duration: 500,
                slideCss: {},
                panelCss: {
                    "float": "left"
                }
            },
            callback: function() {}
        };
        var q = _.extend(f, u);
        var w = q.options;
        var o = _.first(q.framewrap),
            v = q.pagingwrap,
            l = q.btnwrap;
        var e = q.data || [];
        var s = e.length;
        var r = q.template;
        var n = [];
        for (var k = 0; k < s; k++) {
            var p = new b({
                template: r,
                data: e[k],
                idx: k
            });
            n.push(p)
        }
        if (w.type == "infinity") {
            var g = new slide.InfiniteDataSource(n)
        } else {
            var g = new slide.DataSource(n)
        }
        if (w.index) {
            g.setCurrentIndex(w.index)
        }
        var j = new slide.Slide(o, g, {
            duration: w.duration
        });
        if (w.slideCss) {
            c(j.container.el).css(w.slideCss)
        }
        if (w.panelCss) {
            _.each(j.container.panels, function(x, y) {
                c(x.el).css(w.panelCss)
            })
        }
        if (l) {
            l.click(function(i) {
                i.preventDefault();
                var x = c(i.currentTarget).data("direction") || "next";
                switch (x) {
                    case "prev":
                        j.prev();
                        break;
                    case "next":
                        j.next();
                        break;
                    default:
                        break
                }
            })
        }
        if (v) {
            var m = function(i) {
                a(v, n, g.index);
                q.callback(i)
            };
            g.queryCurrent(m);
            j.on("next", function(i) {
                g.queryCurrent(m);
            });
            j.on("prev", function(i) {
                g.queryCurrent(m);
            })
        }
        return {
            sl: j,
            ds: g
        }
    };
    namespace("SimpleSlide", d)
})(jQuery);
(function(b) {
    var a = {
        initialize: function(c) {
            var d = {
                androidMinVersion: 4,
                iosMinVersion: 5
            };
            _.extend(this, c);
            this.parseUserAgent()
        },
        parseUserAgent: function() {
            var f = navigator.userAgent.toLowerCase();
            var g = {
                isAndroid: /android/.test(f),
                isIphone: /iphone/.test(f),
                isIpad: /ipad/.test(f),
                isChrome: /chrome/.test(f),
                isDaumApp: /DaumApps/.test(b.cookie("daumGlueApp") || ""),
                isTablet: false,
                isMobile: false,
                isIos: false,
                embedPlaySupport: false,
                support: false,
                version: {
                    full: "unknown",
                    major: 0,
                    minor: 0
                }
            };
            if (g.isAndroid) {
                var d = f.match(/android\s+([\d\.]+)/) || [];
                var c = (d.length >= 2) ? d[1] : "";
                var e = c.split(".");
                g.version = {
                    full: parseFloat(c),
                    major: parseInt(e[0]),
                    minor: parseInt(e[1])
                };
                if (g.version.major >= this.androidMinVersion) {
                    g.support = true
                }
            }
            if (g.isIphone || g.isIpad) {
                var c = f.substr(f.indexOf("os ") + 3, 3).replace("_", ".");
                var e = c.split(".");
                g.version = {
                    full: c,
                    major: parseInt(e[0]),
                    minor: parseInt(e[1])
                };
                if (g.version.major >= this.iosMinVersion) {
                    g.support = true
                }
                g.isIos = true
            }
            if (g.isChrome) {
                g.support = true
            }
            if (g.isIpad || (g.isAndroid && g.version.major >= 4)) {
                g.embedPlaySupport = true
            }
            if (g.isIpad || g.isAndroid || g.isIphone) {
                g.isMobile = true
            }
            if (g.isIpad || (g.isAndroid && !/mobi|mini|fennec/.test(f))) {
                g.isTablet = true
            }
            _.extend(this, g)
        },
        getInfo: function() {
            if (!this.info) {
                this.info = this.parseUserAgent()
            }
            return this
        }
    };
    namespace("MobileUserAgent", a)
})(jQuery);
(function(b) {
    document.domain = "daum.net";
    window.MiniDaum = {
        tracker: "on"
    };
    var a = {
        viewport: undefined,
        init: function() {
            _.extend(this, Backbone.Events);
            this.checkViewport();
            if ("matchMedia" in window) {
                var d = window.matchMedia("(min-width: 640px)");
                var c = window.matchMedia("(min-width: 1024px)");
                d.addListener(b.proxy(function(e) {
                    this.checkViewport(true)
                }, this));
                c.addListener(b.proxy(function(e) {
                    this.checkViewport(true)
                }, this))
            } else {
                window.addEventListener("resize", b.proxy(function() {
                    this.checkViewport(true)
                }, this), false)
            }
        },
        checkViewport: function(c) {
            if (window.document.width < 640) {
                this._setViewport("enter-portrait", c)
            } else {
                if (window.document.width >= 1024) {
                    this._setViewport("enter-tablet-landscape", c)
                } else {
                    this._setViewport("enter-landscape", c)
                }
            }
        },
        which: function(d, c, e) {
            return (this.viewport == "enter-portrait") ? d : (((e !== undefined) && (this.viewport == "enter-tablet-landscape")) ? e : c)
        },
        _setViewport: function(e, c) {
            if (this.viewport !== e) {
                var d = this.viewport;
                this.viewport = e;
                if (c) {
                    this.trigger("enter-change-mediainfo", {
                        newValue: e,
                        oldValue: d
                    })
                }
            }
        }
    };
    a.init();
    namespace("M_ENTERTAIN", {
        MEDIA_INFO: a
    })
})(jQuery);
(function(b) {
    var a = Backbone.View.extend({
        el: undefined,
        itemEl: undefined,
        interval: 3000,
        itemPerPage: 1,
        tid: undefined,
        numItems: 0,
        curPage: 0,
        numPages: 0,
        initialize: function(c) {
            _.extend(this, c)
        },
        start: function(c) {
            this.numItems = this.$el.find(this.itemEl).size();
            this.numPages = Math.ceil(this.numItems / this.itemPerPage);
            this.curPage = 0;
            this.tid = setInterval(jQuery.proxy(this.rolling, this), this.interval);
            if (c) {
                this.itemOperate(0, true)
            }
        },
        stop: function() {
            if (this.tid) {
                clearInterval(this.tid);
                this.tid = undefined
            }
        },
        rolling: function() {
            this.itemOperate(this.curPage, false);
            if (++this.curPage >= this.numPages) {
                this.curPage = 0
            }
            this.itemOperate(this.curPage, true)
        },
        itemOperate: function(f, d) {
            var c = this.$el.find(this.itemEl);
            for (var e = 0; e < this.itemPerPage; e++) {
                if (d) {
                    b(c.get(this.itemPerPage * f + e)).show()
                } else {
                    b(c.get(this.itemPerPage * f + e)).hide()
                }
            }
        }
    });
    namespace("M_ENTERTAIN", {
        ROLLING_VIEW: a
    })
})(jQuery);
(function(c) {
    var a = "/proxy/photokock";
    var b = {
        NEWS_LIST: "/entertain/api/news/list.jsonp",
        MORE_NEWS_LIST: "/entertain/api/news/morelist.jsonp",
        POLL: "http://sports.media.daum.net/pollproxy/poll/resultpoll.daum",
        BESTREPLY_NEWS_LIST: "/api/service/bestreply.jsonp",
        POPULAR_NEWS_LIST: "/api/service/popular.jsonp",
        RHEA_COMMENT_LIST: "http://news.rhea.media.daum.net/rhea/do/social/json/simpleCommentList",
        CONSOL_LIST: "/proxy/api/consol/v2/consol_list.js",
        CONSOL_INFO: "/proxy/api/consol/v2/consol_info.js",
        NEWS_LIST: "/m/entertain/api/news/list.jsonp",
        GALLERY_LIST: "/proxy/api/gallery/gallery_list.js",
        GALLERY_NEWS_LIST: "/proxy/api/gallery/news_list.js",
        GALLERY_SLIDE_NEWS_LIST: "/proxy/api/gallery/slide/news_list.js",
        GALLERY_RELATED_NEWS_LIST: "/proxy/api/gallery/slide/related_gallery_info.js",
        GALLERY_RECENT_NEWS_LIST: "/proxy/api/gallery/recent_news_list.js",
        CIA_MOVIEPOINT: "http://cia.daum.net/view/movie/tv/@{daum_key}.js",
        CIA_WRITE_MOVIEPOINT: "http://movie.daum.net/tv/detail/point/writeByLiveTalk.do",
        RECOMMENDED_LIST: "/entertain/api/recommend/news/list.json",
        LIVE_TALK: "/entertain/api/consol/livetalk_info.json",
        CLUSTER_ARTICLE_LIST: "/cluster/api/article_list.js",
        PHOTO_GALLERY: "http://gallery.media.daum.net/gallery_list.js",
        PHOTOKOCK_TOKEN: a + "/token",
        PHOTOKOCK_PHOTO: a + "/photo/",
        PHOTOKOCK_KOCK: a + "/kock/",
        PHOTOKOCK_KOCK_RECENT_LIST: a + "/kock/recentList/",
        PHOTOKOCK_KOCK_LIST: a + "/kock/list/",
        PHOTOKOCK_GALLERY_LIST: a + "/gallery/list/",
        PHOTOKOCK_GALLERY_LIST_MY: a + "/gallery/list/my/",
        PHOTOKOCK_GALLERY: a + "/gallery/",
        PHOTOKOCK_GALLERY_LIST_RELATED: a + "/gallery/list/related/",
        MY: "http://news.rhea.media.daum.net/rhea/do/social/json/commentMyList"
    };
    namespace("M_ENTERTAIN_API", b)
})(window.jQuery);
(function(f) {
    var b = 0;
    var g = Backbone.Model.extend({
        load: function(i) {
            this.apiType = "jsonp";
            Backbone.Model.prototype.fetch.call(this, _.extend({
                reset: true,
                dataType: "jsonp",
                cache: true,
                jsonpCallback: "BaseApp" + b++
            }, i))
        },
    });
    var c = Backbone.View.extend({
        tagName: "li",
        template: _.template("<div><%=obj%></div>"),
        initialize: function(i) {
            _.bindAll(this, "render");
            _.extend(this, i);
            this.on("preRender", this.preRender);
            this.on("postRender", this.postRender);
            this.postInitialize()
        },
        postInitialize: function() {},
        render: function() {
            this.trigger("preRender");
            this.$el.html(this.template(this.model.toJSON()));
            this.trigger("postRender");
            return this
        },
        preRender: function() {},
        postRender: function() {}
    });
    var d = Backbone.Collection.extend({
        params: {},
        API: "",
        url: function() {
            return this.API + "?" + f.param(this.params)
        },
        model: g,
        fetch: function(i) {
            Backbone.Collection.prototype.fetch.call(this, _.extend({
                reset: true
            }, i))
        },
        load: function(i) {
            this.apiType = "jsonp";
            Backbone.Collection.prototype.fetch.call(this, _.extend({
                reset: true,
                dataType: "jsonp",
                cache: true,
                jsonpCallback: "BaseApp" + b++
            }, i))
        },
        next: function(i) {
            this.params[i] = parseInt(this.params[i]) + 1;
            if (this.apiType == "jsonp") {
                this.load()
            } else {
                this.fetch()
            }
        }
    });
    var e = Backbone.View.extend({
        views: [],
        Item: c,
        Collection: d,
        initialize: function(i) {
            _.extend(this, i);
            _.bindAll(this, "render", "append");
            this.on("preRender", this.preRender);
            this.on("postRender", this.postRender);
            this.collection = new this.Collection();
            this.collection.on("reset", this.render);
            this.firstRender = true;
            this.postInitialize()
        },
        postInitialize: function() {},
        render: function() {
            this.trigger("preRender");
            this.collection.each(this.append);
            if (this.firstRender) {
                this.firstRender = false;
                this.trigger("firstRender")
            }
            this.trigger("postRender")
        },
        append: function(k, i) {
            var j = new this.Item({
                model: k.set("idx", i)
            });
            this.$el.append(j.render().el);
            this.views.push[j]
        },
        preRender: function() {},
        postRender: function() {}
    });
    var a = c.extend({
        events: {
            click: "next"
        },
        template: _.template(JST.get("baseapp/m.news.count.info")),
        render: function() {
            if (!this.model.get("lastPage") || this.model.get("totalPage") != this.model.get("page")) {
                this.$el.html(this.template(this.model.toJSON()))
            } else {
                this.$el.html("")
            }
        },
        setModel: function(i) {
            this.model = i;
            this.render()
        },
        next: function(i) {
            i.preventDefault();
            var j = this.options.callback;
            if (this.model.get("lastPage") || (this.model.get("totalPage") && this.model.get("page") && this.model.get("totalPage") == this.model.get("page"))) {
                return
            }
            if (f.isFunction(j)) {
                j()
            }
        }
    });
    namespace("BaseApp", {
        Model: g,
        Item: c,
        Collection: d,
        AppView: e,
        MoreItem: a
    })
})(jQuery); 