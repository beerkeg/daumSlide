/*
 * @overview Jigu Javascript Framework for Mobile, v0.1
 * Copyright (c) 2009 Front-end Technology Center, Daum Communications.
 
* 
 * $Version : 0.1 $
 * $Date : 2011-06-10 16:52 $
 * $Revision : 20 $
 * $Build : 37 $
 
* 
 * Project site: http://play.daumcorp.com/display/ftst/Jigu+Javascript+Framework
 * Licensed under Daum Common License : http://dna.daumcorp.com/forge/docs/daum-license-1.0.txt
 */

(function(){if(!window.daum||!window.daum.extend){var a=window.daum={};a.extend=function(d,e,c){var b=c!==undefined?c:true,f;for(f in e){if(!d[f]||b){d[f]=e[f]}}return d}}else{return}a.extend(a,{version:"0.1m_r20",Array:{},Browser:{ua:navigator.userAgent.toLowerCase(),init:function(){this.iemobile=this.ua_contains(["msie","!opera"]);this.polaris=this.ua_contains("polaris")||this.ua_contains("natebrowser")||/([010|011|016|017|018|019]{3}\d{3,4}\d{4}$)/.test(this.ua);this.chrome=this.ua_contains("chrome");this.webkit=this.ua_contains("applewebkit");this.opera=this.ua_contains("opera");this.android=this.ua_contains("android");this.safari=this.ua_contains("safari");this.iphone=this.ua_contains(["iphone","!ipod"]);this.ipad=this.ua_contains("ipad");this.ipod=this.ua_contains("ipod");this.webviewer=this.ua_contains(["wv","lg"])||this.ua_contains("uzard")||this.ua_contains("opera mini");this.dolfin=this.ua_contains("dolfin");this.xperiax1=this.ua_contains("sonyerricssonx1i");this.uiwebview=(this.iphone||this.ipad||this.ipod)&&this.webkit&&this.ua_contains("!safari");this.osversion=this.getOsVersion();return},ua_contains:function(d){var b=(typeof d=="string")?new Array(d):d,c=0;b.each(function(e){c+=(e.substr(0,1)=="!")?a.Browser.ua.indexOf(e.substr(1))===-1:a.Browser.ua.indexOf(e)>-1});return b.length===c},getOsVersion:function(){var b=0;try{if(this.iphone||this.ipad||this.ipod){b=this.ua.match(/os ([\w|\.|-|_]+) like/g)[0].replace(/^os /,"").replace(/ like$/,"")}else{if(this.android){b=this.ua.match(/android ([\w|\.|-]+);/g)[0].replace(/^android /,"").replace(/;$/,"")}}}catch(c){}return b}},Element:{},Event:{},Function:{},Fx:{},Number:{},Object:{isArray:function(b){return(a.Object.getType(b)==="Array")},isBoolean:function(b){return(a.Object.getType(b)==="Boolean")},isFunction:function(b){return(a.Object.getType(b)==="Function")},isString:function(b){return(a.Object.getType(b)==="String")},isNumber:function(b){return(a.Object.getType(b)==="Number")},isObject:function(b){return(a.Object.getType(b)==="Object")},getType:function(b){return Object.prototype.toString.call(b).toString().match(/\[object\s(\w*)\]$/)[1]},toJSON:function(b){return a.toJSON(b)}},String:{},createElement:function(j,h){var n,b="",l=a.HTMLStack,g,c,k,m,d;if(!h){n=a.String.startsWith(j,"<")?j:("<"+j+"></"+j+">")}else{for(d in h){b+=d+'="'+h[d]+'" '}n="<"+j+" "+b+"></"+j+">"}try{l.innerHTML=n;g=l.removeChild(l.firstChild);if(g.nodeType!==1){throw ({message:"shit browser!"})}else{return g}}catch(f){c=n.match(/\w+/).toString().toLowerCase();k={tbody:["<table>","</table>"],tr:["<table><tbody>","</tbody></table>"],td:["<table><tbody><tr>","</tr></tbody></table>"],option:["<select>","</select>"]};if(k[c]){l.innerHTML=k[c][0]+n+k[c][1];m=l.removeChild(l.firstChild);return m.getElementsByTagName(c)[0]}else{return document.createElement(c)}}},loadedScripts:{},loadTimer:{},load:function(f,b,c){if(a.loadedScripts[f]){if(b){b()}return false}var d,e;d=document.createElement("script");d.type="text/javascript";for(e in c){if(c.hasOwnProperty(e)){d.setAttribute(e,c[e])}}d.src=f;a.$T("head")[0].appendChild(d);if(!b){return false}d.onreadystatechange=function(){if(this.readyState=="loaded"||this.readyState=="complete"){if(!a.loadedScripts[f]){a.loadedScripts[f]=true;b()}}return};d.onload=function(){if(!a.loadedScripts[f]){a.loadedScripts[f]=true;b()}return};if(a.Browser.opera){a.loadTimer[f]=window.setInterval(function(){if(/loaded|complete/.test(document.readyState)){window.clearInterval(a.loadTimer[f]);if(!a.loadedScripts[f]){b()}}},10)}return true},urlParameter:function(){for(var f={},e=[],c=location.search.substr(1).split("&"),d=0,b=c.length;d<b;d+=1){e=c[d].split("=");f[e[0]]=e[1]}return f}(),getParam:function(b){return this.urlParameter[b]||null},useHTMLPrototype:function(){a.HTMLFragment=(document.createDocumentFragment)?document.createDocumentFragment():document.createElement("div");a.HTMLPrototype=document.createElement("div");a.HTMLStack=document.createElement("div");a.HTMLPrototype.id="daum_html_prototype";a.HTMLStack.id="daum_html_stack";a.HTMLFragment.appendChild(a.HTMLPrototype);a.HTMLFragment.appendChild(a.HTMLStack);a.HTMLPrototype.style.position=a.HTMLStack.style.position="absolute";a.HTMLPrototype.style.left=a.HTMLStack.style.left=a.HTMLPrototype.style.top=a.HTMLStack.style.top="-10000px";return true}(),toJSON:function(b){return JSON.stringify(b)},xmlToObject:function(d){var b=d.documentElement,c=function(k){for(var n={},o=a.getChildElements(k),g,m,h=0,e=o.length;h<e;h+=1){g=o[h].nodeName;m=(a.getChildElements(o[h]).length>0)?c(o[h]):(o[h].firstChild==null)?"":o[h].firstChild.nodeValue;if(n[g]!=undefined||k.getElementsByTagName(g).length>1){if(n[g]==undefined){n[g]=[]}n[g].push(m)}else{n[g]=m}for(var f=0;f<o[h].attributes.length;f+=1){n[g+"@"+o[h].attributes[f].nodeName]=(o[h].attributes[f].nodeValue||"").toString()}}return n};return c(b)},jsonToObject:function(b){return JSON.parse(b)},$:function(b){return typeof b=="string"?document.getElementById(b):b},$A:function(d){if(!d){return[]}if(d instanceof Array&&!a.Browser.op){return d}var f=(typeof d=="string"&&(a.ie||a.op))?d.split(""):d,b;try{b=Array.prototype.slice.call(f)}catch(h){for(var g=0,b=[],c=d.length;g<c;g+=1){b.push(d[g])}}return b},$C:function(b,d){var c=a.$(b);return(c!==null)?a.Element.getElementsByClassName(c,d):null},$E:function(c){var b=a.$(c);if(b){a.extendMethods(b,a.Element,false);b.addEvent=a.methodize(a.Event.addEvent);b.removeEvent=a.methodize(a.Event.removeEvent)}return b},$F:function(d){var f=a.$(d)||document.getElementsByName(d)[0],c,g,b;if(!f||(f.tagName!=="INPUT"&&f.tagName!=="SELECT"&&f.tagName!=="TEXTAREA")){return""}if(f.type=="radio"||f.type=="checkbox"){for(c=0,g=document.getElementsByName(f.name),b=new Array();c<g.length;c+=1){if(g[c].checked){b.push(g[c].value)}}b=(f.type=="radio")?b[0]:b}else{if(f.type=="select-multiple"){for(c=0,g=a.Element.getChildElements(f),b=new Array();c<g.length;c+=1){if(g[c].selected){b.push(g[c].value)}}}else{if(f.value){b=f.value}}}return b},$T:function(b,c){return(c||document).getElementsByTagName(b)},documentLoaded:false,extendMethods:function(d,e,c){var b=c!==undefined?c:true,f;for(f in e){if(!d[f]||b){if(typeof(e[f])=="function"){d[f]=a.methodize(e[f])}}}return d},methodize:function(c){if(navigator.userAgent.toLowerCase().indexOf("opera")>-1){var b=a.$A(arguments);return function(d){return c.apply(null,[this].concat(d))}}else{return function(){return c.apply(null,[this].concat(a.$A(arguments)))}}},nativeExtend:function(){var c=[[a.Object,Object],[a.String,String.prototype],[a.Number,Number.prototype],[a.Array,Array.prototype],[a.Function,Function.prototype]],d,b=c.length;for(d=0;d<b;d+=1){a.extendMethods(c[d][1],c[d][0],false)}},random:function(c,b){return Math.floor(Math.random()*(b-c+1)+c)}})})();daum.extend(daum.Array,{compact:function(c){if(!c){return[]}for(var e=0,d=[],b=c.length;e<b;e+=1){if(!(c[e]===null||typeof(c[e])==="undefined")){d.push(c[e])}}return d},each:function(c,e){if(Array.prototype.forEach){return c.forEach(e)}for(var d=0,b=c.length;d<b;d+=1){e(c[d],d)}},indexOf:function(){if([].indexOf){return function(b,c){return b.indexOf(c)}}else{return function(c,e){for(var d=0,b=c.length;d<b;d+=1){if(c[d]===e){return d}}return -1}}}(),contains:function(b,c){return b.indexOf(c)>-1},copy:function(c){for(var d=0,f=[],e,b=c.length;d<b;d+=1){if(c[d].constructor==c.constructor){f[d]=daum.Array.copy(c[d])}else{if(typeof(c[d])=="object"){if(typeof(c[d].valueOf())=="object"){f[d]=c[d].constructor();for(e in c[d]){f[d][e]=c[d][e]}}else{f[d]=c[d].constructor(c[d].valueOf())}}else{f[d]=c[d]}}}return f},map:function(e,h){if(typeof Array.prototype.map==="function"&&Array.prototype.map.toString().indexOf("native")>0){return e.map(h)}for(var c=[],g=0,d=e.length;g<d;g+=1){c[g]=h(e[g],g)}return c},size:function(b){return daum.Array.compact(b).length},uniq:function(c){var d=[],e;for(var e=0,d=[],b=c.length;e<b;e+=1){daum.Array.contains(d,c[e])||d.push(c[e])}return d},getFirst:function(b){return b[0]},getLast:function(b){return b[b.length-1]}});daum.extend(daum.Browser,{getWindowSize:function(){var a=(document.documentElement.clientWidth||document.body.clientWidth||1003)-2,b=(document.documentElement.clientHeight||document.body.clientHeight||650)-2;return{width:a,height:b}},getScrollOffsets:function(){return{left:window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft,top:window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop}},setCookie:function(c,e,a){var f=new Date(),b="";if(a){f.setDate(f.getDate()+a);b="expires="+f.toGMTString()+";"}document.cookie=c+"="+escape(e)+"; path=/;"+b},getCookie:function(d){var c,a,e,b;c=";"+document.cookie.replace(/ /g,"")+";";a=";"+d+"=";e=c.indexOf(a);if(e!=-1){e+=a.length;b=c.indexOf(";",e);return unescape(c.substr(e,b-e))}return},delCookie:function(a){document.cookie=a+"=;expires=Fri, 31 Dec 1987 23:59:59 GMT;"}});daum.extend(daum.Element,{cleanBlankNodes:function(b){var c=daum.$(b),a=c.firstChild;try{do{if(a.nodeType===3&&!/\S/.test(a.nodeValue)){c.removeChild(a)}}while(a=a.nextSibling)}catch(c){}return c},getChildElements:function(d){var c=daum.$(d).firstChild,b=[];try{do{if(c.nodeType===1){b.push(c)}}while(c=c.nextSibling)}catch(f){}return b},getElementsByClassName:function(f,c){if(document.getElementsByClassName.toString().indexOf("native")>0){return daum.$A(f.getElementsByClassName(c))}var g=f==document||f==document.body||f==window;if(g||f.id){return daum.$$((g?"":"#"+f.id+" ")+"."+daum.String.trim(c).replace(/\s+/g,"."))}for(var b=daum.$(f).getElementsByTagName("*"),e=[],d=0,a=b.length;d<a;d+=1){if(daum.Element.hasClassName(b[d],c)){e.push(b[d])}}return(e.length>0)?e:[]},getFirstChild:function(a){var b=daum.$(a).firstChild;while(b&&b.nodeType!==1){b=b.nextSibling}return b},getLastChild:function(b){var a=daum.$(b).lastChild;while(a&&a.nodeType!==1){a=a.previousSibling}return a},getNext:function(b){var a=daum.$(b).nextSibling;while(a&&a.nodeType!==1){a=a.nextSibling}return a},getPrev:function(a){var b=daum.$(a).previousSibling;while(b&&b.nodeType!==1){b=b.previousSibling}return b},getParent:function(a){return daum.$(a).parentNode},getCoords:function(b,c,j){var f=c||false,k=daum.$(j)||false,g=daum.$(b),l=g.offsetWidth,d=g.offsetHeight,i={left:0,top:0,right:0,bottom:0},a;while(g){i.left+=g.offsetLeft||0;i.top+=g.offsetTop||0;g=g.offsetParent;if(f){if(g){if(g.tagName=="BODY"){break}a=daum.Element.getStyle(g,"position");if(a!=="static"){break}}}if(k&&k==g){break}}i.right=i.left+l;i.bottom=i.top+d;return i},getCoordsTarget:function(b,a){return daum.Element.getCoords(b,false,a)},getStyle:function(d,f,c){var h=daum.$(d),a,g,b,i=c||f;if(f.toLowerCase()=="float"){b=(daum.Browser.ie)?"styleFloat":"cssFloat"}else{b=f}if(h.currentStyle){g=(b.indexOf("-")!==-1)?b.replace(/[\-](.)/g,function(j,e){return e.toUpperCase()}):b;a=h.currentStyle[g]}else{g=(/[A-Z]/.test(i))?i.replace(/([A-Z])/g,function(j,e){return"-"+e.toLowerCase()}):i;a=document.defaultView.getComputedStyle(h,null).getPropertyValue(g)}return a},hasClassName:function(c,b){var e=daum.String.trim(daum.$(c).className).replace(/\s+/g," ").split(" "),d=daum.String.trim(b).replace(/\s+/g," ").split(" "),a=true;daum.Array.each(d,function(f){a=daum.Array.contains(e,f)&&a});return a},visible:function(a){var b=daum.$(a);return !(b.offsetWidth===0&&b.offsetHeight===0)},show:function(a,c){var b=daum.$(a);b.style.display=c||"block";return b},hide:function(a){var b=daum.$(a);b.style.display="none";return b},toggle:function(a,c){var b=daum.$(a);return(daum.Element.visible(b))?daum.Element.hide(b):daum.Element.show(b,c||"block")},addClassName:function(b,a){var c=daum.$(b);if(daum.Element.hasClassName(c,a)){return c}c.className=(daum.String.trim(c.className)==="")?a:c.className+" "+a;return c},removeClassName:function(b,a){return daum.Element.replaceClassName(b,a,"")},replaceClassName:function(b,d,g){var c=daum.$(b),a=[],f=daum.String.trim(daum.$(b).className).replace(/\s+/g," ").split(" ");daum.Array.each(f,function(e){e===d?g&&a.push(g):a.push(e)});c.className=a.join(" ");return c},setOpacity:function(a,c){var b=daum.$(a);b.style.filter="alpha(opacity="+c*100+")";b.style.opacity=b.style.MozOpacity=b.style.KhtmlOpacity=c;return b},setLeft:function(a,c,b){return daum.Element.setStyleProperty(a,"left",c,b)},setTop:function(a,c,b){return daum.Element.setStyleProperty(a,"top",c,b)},setWidth:function(b,a,c){return daum.Element.setStyleProperty(b,"width",a,c)},setHeight:function(b,a,c){return daum.Element.setStyleProperty(b,"height",a,c)},setPosition:function(a,c,d,b){daum.Element.setStyleProperty(a,"left",c,b);return daum.Element.setStyleProperty(a,"top",d,b)},setSize:function(c,a,b,d){daum.Element.setStyleProperty(c,"width",a,d);return daum.Element.setStyleProperty(c,"height",b,d)},setStyleProperty:function(b,a,g,d){var f=daum.$(b),c;if(d||false){c=(isNaN(parseInt(f.style[a])))?parseInt(f["offset"+(a.replace(/^(.)/g,function(h,e){return e.toUpperCase()}))])+g:parseInt(f.style[a])+g}else{c=g}f.style[a]=daum.String.px(c);return f},setLeftByOffset:function(a,b){return daum.Element.setLeft(a,b,true)},setTopByOffset:function(a,b){return daum.Element.setTop(a,b,true)},setWidthByOffset:function(a,b){return daum.Element.setWidth(a,b,true)},setHeightByOffset:function(a,b){return daum.Element.setHeight(a,b,true)},setPositionByOffset:function(b,a,c){return daum.Element.setPosition(b,a,c,true)},setSizeByOffset:function(b,a,c){return daum.Element.setSize(b,a,c,true)},posHide:function(a){var b=daum.$(a);daum.Element.setPosition(b,-10000,-10000);return b},setCssText:function(){return(daum.Browser.ie)?function(b,a){b.style.cssText=a}:function(b,a){b.setAttribute("style",a)}}(),setStyle:function(c,d,b){if(b){return daum.Element.setStyleProperty(c,d,b,false)}var g=daum.$(c),a=g.style,f;if(d.length<1){return g}if(daum.Object.isString(d)){a.cssText+=";"+d}else{if(daum.Object.isObject(d)){for(f in d){a[(f=="float"||f=="cssFloat")?(undefined==a.styleFloat?"cssFloat":"styleFloat"):f]=d[f]}}}return g},destroy:function(b){var a="__daumGB",d=daum.$(a),c=daum.$(b);if(c.id===a){return}if(!d){d=daum.createElement("div",{id:a,style:"display:none;"});document.body.appendChild(d)}d.appendChild(c);d.innerHTML="";c=null}});daum.extend(daum.Event,{observer:[],EVENTID:0,crossEvent:function(){var a={};if(!!document.addEventListener){a.add=function(c){var b=c.type;if(b.toLowerCase()=="mousewheel"&&daum.Browser.ff){b="DOMMouseScroll"}c.src.addEventListener(b,c.handler,c.isCapture)};a.remove=function(c){var b=c.type;if(b.toLowerCase()=="mousewheel"&&daum.Browser.ff){b="DOMMouseScroll"}c.src.removeEventListener(b,c.handler,c.isCapture)}}else{a.add=function(c){var b=c.type;if(b.toLowerCase()=="dommousescroll"){b="mousewheel"}c.src.attachEvent("on"+b,c.handler)};a.remove=function(c){var b=c.type;if(b.toLowerCase()=="dommousescroll"){b="mousewheel"}c.src.detachEvent("on"+b,c.handler)}}return a}(),addEvent:function(g,f,e,d){var h=daum.$(g),a=false,c=daum.Event.EVENTID++,b={src:h,type:f,handler:e,isCapture:d||false};daum.Event.observer[c]=b;daum.Event.crossEvent.add(b);return c},removeEvent:function(e,d,c,b){var a=daum.Event.observer;if(!!e&&!d&&!c){daum.Event.crossEvent.remove(a[e]);delete daum.Event.observer[e]}else{var g=daum.$(e);daum.Event.crossEvent.remove({src:g,type:d,handler:c,isCapture:b||false});for(var f in a){if(a[f].src===g&&a[f].type===d&&a[f].handler===c&&a[f].isCapture===(b||false)){delete daum.Event.observer[f];break}}}},stopObserving:function(a){if(daum.Event.observer[a]){daum.Event.removeEvent(a)}},hasObserver:function(e,c){if(typeof e==="number"){return !!daum.Event.observer[e]}else{var b=false,a=daum.Event.observer;for(var d in a){if(a[d].src===e&&a[d].type===c){b=true;break}}return b}},stopEvent:function(a){daum.Event.stopPropagation(a);daum.Event.preventDefault(a);return false},preventDefault:function(b){var a=b||window.event;if(a.preventDefault){a.preventDefault()}else{a.returnValue=false}return false},stopPropagation:function(b){var a=b||window.event;if(a.stopPropagation){a.stopPropagation()}else{a.cancelBubble=true}},GC:function(){if(daum.Browser.ie){return function(){for(var a in daum.Event.observer){var b=daum.Event.observer[a].src;if(b&&b.ownerDocument){try{!b.offsetParent&&daum.Event.stopObserving(a)}catch(b){daum.Event.stopObserving(a)}}}}}else{return function(){for(var a in daum.Event.observer){var c=daum.Event.observer[a].src,b=false;if(c&&c.ownerDocument){if(!c.offsetParent){do{if(c===document.body){b=true;break}}while(c=c.parentNode);!b&&daum.Event.stopObserving(a)}}}}}},getElement:function(a){var b=a||window.event;return b.srcElement||b.target}});daum.extend(daum.Function,{bind:function(d){var e=d,b=daum.$A(arguments),a,c;b.shift();a=b.shift();c=function(){return e.apply(a,b.concat(daum.$A(arguments)))};c.__Binded=true;return c},bindAsEventListener:function(d){var e=d,b=daum.$A(arguments),a,c;b.shift();a=b.shift();c=function(f){return e.apply(a,[f||window.event].concat(b))};c.__Binded=true;return c},interval:function(d,a,c){var b=(c)?daum.Function.bind(d,c):d;return window.setInterval(b,a)},timeout:function(d,a,c){var b=(c)?daum.Function.bind(d,c):d;return window.setTimeout(b,a)},callBack:function(e){var d=e,b=daum.$A(arguments),c,a;b.shift();c=b.shift();return function(){b=b.concat(daum.$A(arguments));a=d.apply(null,b);c.apply(null,b);return a}},callFore:function(d){var c=d,a=daum.$A(arguments),b;a.shift();b=a.shift();return function(){a=a.concat(daum.$A(arguments));b(a);return c(a)}},inherit:function(e,d,a){var b=function(){},g;b.prototype=d.prototype;e.prototype=new b(),e.prototype.constructor=e;e.prototype.parent=(d.prototype.parent||[]).concat(d);e._parent=d;g=e.prototype.parent.length;e.prototype.$super=function(){this.constructor.prototype.parent[--g].apply(this,arguments);g=g==0?this.constructor.prototype.parent.length:g};if(a){daum.Function.members(e,a)}return e},members:function(c,d){var b,a=c._parent||c;for(var b in d){c.prototype[b]=(typeof(d[b])=="function")?(a.prototype[b])?(function(e,f){if(f.toString().indexOf("this.$super(")>-1){return function(){this.$prev_super=this.$super;this.$super=function(){this.$super=this.$prev_super;return a.prototype[e].apply(this,arguments)};return f.apply(this,arguments)}}return function(){return f.apply(this,arguments)}})(b,d[b]):(function(e,f){if(f.toString().indexOf("this.$super(")>-1){throw new Error(e+" function is not defined in "+c)}return function(){return f.apply(this,arguments)}})(b,d[b]):d[b]}return c},method:function(d,c,a){var b=d._parent||d;d.prototype[c]=(typeof(a)=="function")?(b.prototype[c])?(function(e,f){return function(){this.$super=function(){return b.prototype[e].apply(this,arguments)};return f.apply(this,arguments)}})(c,a):(function(e,f){return function(){this.$super=function(){return true};return f.apply(this,arguments)}})(c,a):a;return d}});daum.createFunction=function(d,a){var c="return function(",b;for(b=0;b<d.length;b++){c+=""+d[b]+","}c=c.replace(/,$/,"");c=c+"){"+a+"}";return(new Function(c))()};daum.extend(daum.Fx,{running:{},parse:function(e,c,d){if(c==="opacity"&&daum.ie){e=e===undefined?1:e}else{if(e==="transparent"||e.startsWith("rgba")){e="rgb(255,255,255)"}else{if(e==="auto"){e=daum.String.px(d["scroll"+c.charAt(0).toUpperCase()+c.substr(1)])}}}var a=parseFloat(e),b=e.toString().replace(/^\-?[\d\.]+/,"");return{value:isNaN(a)?b:a,unit:isNaN(a)?b.startsWith("rgb")||b.startsWith("#")?"color":"":b}},normalize:function(a){var h={},g,j=(typeof a==="object")?"":a,c,f=document.createElement("div"),e=("borderStyle backgroundColor borderBottomColor borderBottomWidth borderLeftColor borderLeftWidth borderRightColor borderRightWidth borderSpacing borderTopColor borderTopWidth bottom color fontSize fontWeight height left letterSpacing lineHeight marginBottom marginLeft marginRight marginTop maxHeight maxWidth minHeight minWidth opacity outlineColor outlineOffset outlineWidth paddingBottom paddingLeft paddingRight paddingTop right textIndent top width wordSpacing zIndex").split(" "),d=e.length,b;f.innerHTML='<div style="'+j+'"></div>';c=f.childNodes[0];if(""===j){for(b in a){c.style[b]=a[b].toString()}}while(d--){if(g=c.style[e[d]]){h[e[d]]=this.parse(g,e[d])}}return h},s:function(b,a,d){return b.substr(a,d||1)},stop:function(a,b){clearInterval(this.running[a.id]);delete daum.Fx.running[a.id];b&&b(a);a.id=a.id.toString().startsWith("__t")?"":a.id},color:function(b,g,k){var e=2,d,h,f,l=[],a=[];while(d=3,h=arguments[e-1],e--){if(this.s(h,0)==="r"){h=h.match(/\d+/g);while(d--){l.push(~~h[d])}}else{if(h.length===4){h="#"+this.s(h,1)+this.s(h,1)+this.s(h,2)+this.s(h,2)+this.s(h,3)+this.s(h,3)}while(d--){l.push(parseInt(this.s(h,1+d*2,2),16))}}}while(d--){f=~~(l[d+3]+(l[d]-l[d+3])*k);a.push(f<0?0:f>255?255:f)}return"rgb("+a.join(",")+")"},animate:function(g,m,n){var f=daum.$(g),a=n||{},j=this.normalize(m),h=f.currentStyle?f.currentStyle:getComputedStyle(f,null),c,i={},d=+new Date,b=(a.duration&&a.duration<=10?a.duration*1000:a.duration)||700,l=d+b,e,k=a.easing||function(p,o,r,q){return -r*(p/=q)*(p-2)+o};f.id=(!f.id)?"__t"+ +new Date+daum.random(1,10000):f.id;if(daum.ie6){f.style.zoom="1"}if(this.running[f.id]){clearInterval(this.running[f.id]);delete daum.Fx.running[f.id]}for(c in j){i[c]=this.parse(h[c],c,f)}if(daum.toJSON(i)===daum.toJSON(j)){this.stop(f,a.callback);return}e=setInterval(function(){var p=+new Date;for(c in j){try{f.style[c]=j[c].unit==="color"?daum.Fx.color(i[c].value,j[c].value,k(p-d,0,1,b)):k(p-d,i[c].value,j[c].value-i[c].value,b).toFixed(3)+j[c].unit}catch(o){f.style[c]=j[c].value;delete j[c]}if(c==="opacity"&&daum.ie){f.style.filter="alpha(opacity="+f.style[c]*100+")"}}if(p>l){for(c in j){f.style[c]=j[c].unit==="color"?daum.Fx.color(i[c].value,j[c].value,1):j[c].value+j[c].unit}this.stop(f,a.callback)}}.bind(this),13);this.running[f.id]=e},scrollTo:function(e,k){var d=daum.$E(e),a=k||{},f=(daum.ie)?document.documentElement.scrollTop:window.pageYOffset,c=+new Date,h=d.getCoords()["top"]+((a.offset)?a.offset:0),b=a.duration||700,i=c+b,g=a.easing||function(m,l,o,n){return -o*(m/=n)*(m-2)+l},j=setInterval(function(){var l=+new Date;window.scrollTo(0,g(l-c,f,h-f,b));if(l>i){window.scrollTo(0,h);clearInterval(j)}},13)}});daum.extend(daum.Number,{px:function(a){return daum.String.px(a)},fillZero:function(e,a){var d=a||0,b=e.toString();if(d<b.length){return b}while(b.length<d){b="0"+b}return b},toInt:function(b,a){return daum.String.toInt(b,a)},toFloat:function(a){return daum.String.toFloat(a)}});daum.extend(daum.String,{trim:function(a){return a.replace(/^\s\s*/,"").replace(/\s\s*$/,"")},replaceAll:function(){return function(b,a,c){if(a.constructor==RegExp){return b.replace(new RegExp(a.toString().replace(/^\/|\/$/gi,""),"gi"),c)}return b.split(a).join(c)}}(),byteLength:function(b){var a=0;daum.$A(b.toString()).each(function(c){a+=(escape(c).length>3)?2:1});return a},cutString:function(d,a,c){var f=c||"",e=a-f.length,h=0,g="",b;daum.$A(d.toString()).each(function(i){b=(escape(i).length>3)?2:1;h+=b;e-=b;if(e>=0){g+=i}});return(a>=h)?d:g+=f},isEmpty:function(a){return(!a||a.length===0)},px:function(b){var a=parseInt(b);return(!isNaN(a))?a+"px":b},removeCR:function(a){return(a)?daum.String.replaceAll(a,/\n|\r/,""):null},toInt:function(b,a){return parseInt(b,a||10)},toFloat:function(a){return parseFloat(a)},startsWith:function(b,a){return b.indexOf(a)===0},endsWith:function(b,c){var a;return(a=b.length-c.length)>=0&&b.lastIndexOf(c)===a},escapeHTML:function(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")},unescapeHTML:function(a){return daum.String.stripTags(a).replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'")},stripTags:function(a){return a.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi,"")}});daum.Ajax=function(a){this.options={url:"",method:"get",async:true,timeout:5000,paramString:"",encoding:"utf-8",onsuccess:function(){},onfailure:function(){},onloading:function(){},ontimeout:function(){},onabort:function(){},headers:{},link:"ignore"};daum.extend(this.options,a||{});this.init()};daum.Ajax.prototype={init:function(){if(window.XMLHttpRequest){this.XHR=new XMLHttpRequest()}else{if(window.ActiveXObject){try{this.XHR=new ActiveXObject("Msxml2.XMLHTTP")}catch(a){try{this.XHR=new ActiveXObject("Microsoft.XMLHTTP")}catch(a){this.XHR=null}}}}if(!this.XHR){return false}this.running=false},request:function(c,b){if(this.running){if(this.options.link==="cancel"){this.abort()}else{return}}this.setOptions(b);var a=c||this.options.url;if(this.options.paramString.length>0&&this.options.method=="get"){a=a+((a.indexOf("?")>0)?"&":"?")+this.options.paramString}this.open(a)},open:function(b){this.running=true;if(this.options.async){this.XHR.onreadystatechange=daum.Function.bindAsEventListener(this.stateHandle,this)}this.options.timer=daum.Function.timeout(this.abort,this.options.timeout,this);this.XHR.open(this.options.method,b,this.options.async);var c=this.options.headers;for(var a in c){this.XHR.setRequestHeader(a,c[a])}this.XHR.send(this.options.paramString);if(!this.options.async){this.stateHandle()}},abort:function(){if(this.XHR){this.XHR.abort();this.callAbort();this.running=false}},stateHandle:function(a){switch(this.XHR.readyState){case 4:window.clearTimeout(this.options.timer);this.options.timer=null;if(this.XHR.status==200||this.XHR.status==304){this.callSuccess()}else{if(this.XHR.status>=400){this.callFailure(this.XHR.status)}}this.running=false;break;case 1:this.callLoading();break}},callSuccess:function(){this.options.onsuccess(this.XHR)},callFailure:function(){this.options.onfailure(this.XHR)},callLoading:function(){this.options.onloading(this.XHR)},callTimeout:function(){this.options.ontimeout(this.XHR)},callAbort:function(){this.options.onabort(this.XHR)},setOptions:function(a){daum.extend(this.options,a||{});this.options.method=this.options.method.toLowerCase();this.setHeader("charset",this.options.encoding);if(this.options.method=="post"){this.setHeader("Content-Type","application/x-www-form-urlencoded")}},setHeader:function(a,b){if(typeof a==="object"){daum.extend(this.options.headers,a||{},true)}else{this.options.headers[a]=b}return this},getHeader:function(a){return this.XHR.getResponseHeader(a)}};daum.Ajax.xmlToObject=function(a){return daum.xmlToObject(a)};daum.Ajax.jsonToObject=function(a){return daum.jsonToObject(a)};daum.Template=function(a){this.template=a};daum.Template.prototype={evaluate:function(a){return this.template.replace(/#\{([A-Z_][\dA-Z_]*(?:\.[A-Z_][\dA-Z_]*)*)?\}/ig,function(d,e){var b=e?e.split("."):"";var c=a||"";while(b.length){c=c[b.shift()];if(c===undefined||c===null){return""}}return c})},toElement:function(a){return daum.createElement(this.evaluate(a))}};
/*
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){var p=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g,i=0,d=Object.prototype.toString,n=false;var b=function(D,t,A,v){A=A||[];var e=t=t||document;if(t.nodeType!==1&&t.nodeType!==9){return[]}if(!D||typeof D!=="string"){return A}var B=[],C,y,G,F,z,s,r=true,w=o(t);p.lastIndex=0;while((C=p.exec(D))!==null){B.push(C[1]);if(C[2]){s=RegExp.rightContext;break}}if(B.length>1&&j.exec(D)){if(B.length===2&&f.relative[B[0]]){y=g(B[0]+B[1],t)}else{y=f.relative[B[0]]?[t]:b(B.shift(),t);while(B.length){D=B.shift();if(f.relative[D]){D+=B.shift()}y=g(D,y)}}}else{if(!v&&B.length>1&&t.nodeType===9&&!w&&f.match.ID.test(B[0])&&!f.match.ID.test(B[B.length-1])){var H=b.find(B.shift(),t,w);t=H.expr?b.filter(H.expr,H.set)[0]:H.set[0]}if(t){var H=v?{expr:B.pop(),set:a(v)}:b.find(B.pop(),B.length===1&&(B[0]==="~"||B[0]==="+")&&t.parentNode?t.parentNode:t,w);y=H.expr?b.filter(H.expr,H.set):H.set;if(B.length>0){G=a(y)}else{r=false}while(B.length){var u=B.pop(),x=u;if(!f.relative[u]){u=""}else{x=B.pop()}if(x==null){x=t}f.relative[u](G,x,w)}}else{G=B=[]}}if(!G){G=y}if(!G){throw"Syntax error, unrecognized expression: "+(u||D)}if(d.call(G)==="[object Array]"){if(!r){A.push.apply(A,G)}else{if(t&&t.nodeType===1){for(var E=0;G[E]!=null;E++){if(G[E]&&(G[E]===true||G[E].nodeType===1&&h(t,G[E]))){A.push(y[E])}}}else{for(var E=0;G[E]!=null;E++){if(G[E]&&G[E].nodeType===1){A.push(y[E])}}}}}else{a(G,A)}if(s){b(s,e,A,v);b.uniqueSort(A)}return A};b.uniqueSort=function(r){if(c){n=false;r.sort(c);if(n){for(var e=1;e<r.length;e++){if(r[e]===r[e-1]){r.splice(e--,1)}}}}return r};b.matches=function(e,r){return b(e,null,null,r)};b.find=function(x,e,y){var w,u;if(!x){return[]}for(var t=0,s=f.order.length;t<s;t++){var v=f.order[t],u;if((u=f.match[v].exec(x))){var r=RegExp.leftContext;if(r.substr(r.length-1)!=="\\"){u[1]=(u[1]||"").replace(/\\/g,"");w=f.find[v](u,e,y);if(w!=null){x=x.replace(f.match[v],"");break}}}}if(!w){w=e.getElementsByTagName("*")}return{set:w,expr:x}};b.filter=function(A,z,D,t){var s=A,F=[],x=z,v,e,w=z&&z[0]&&o(z[0]);while(A&&z.length){for(var y in f.filter){if((v=f.match[y].exec(A))!=null){var r=f.filter[y],E,C;e=false;if(x==F){F=[]}if(f.preFilter[y]){v=f.preFilter[y](v,x,D,F,t,w);if(!v){e=E=true}else{if(v===true){continue}}}if(v){for(var u=0;(C=x[u])!=null;u++){if(C){E=r(C,v,u,x);var B=t^!!E;if(D&&E!=null){if(B){e=true}else{x[u]=false}}else{if(B){F.push(C);e=true}}}}}if(E!==undefined){if(!D){x=F}A=A.replace(f.match[y],"");if(!e){return[]}break}}}if(A==s){if(e==null){throw"Syntax error, unrecognized expression: "+A}else{break}}s=A}return x};var f=b.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(e){return e.getAttribute("href")}},relative:{"+":function(x,e,w){var u=typeof e==="string",y=u&&!/\W/.test(e),v=u&&!y;if(y&&!w){e=e.toUpperCase()}for(var t=0,s=x.length,r;t<s;t++){if((r=x[t])){while((r=r.previousSibling)&&r.nodeType!==1){}x[t]=v||r&&r.nodeName===e?r||false:r===e}}if(v){b.filter(e,x,true)}},">":function(w,r,x){var u=typeof r==="string";if(u&&!/\W/.test(r)){r=x?r:r.toUpperCase();for(var s=0,e=w.length;s<e;s++){var v=w[s];if(v){var t=v.parentNode;w[s]=t.nodeName===r?t:false}}}else{for(var s=0,e=w.length;s<e;s++){var v=w[s];if(v){w[s]=u?v.parentNode:v.parentNode===r}}if(u){b.filter(r,w,true)}}},"":function(t,r,v){var s=i++,e=q;if(!/\W/.test(r)){var u=r=v?r:r.toUpperCase();e=m}e("parentNode",r,s,t,u,v)},"~":function(t,r,v){var s=i++,e=q;if(typeof r==="string"&&!/\W/.test(r)){var u=r=v?r:r.toUpperCase();e=m}e("previousSibling",r,s,t,u,v)}},find:{ID:function(r,s,t){if(typeof s.getElementById!=="undefined"&&!t){var e=s.getElementById(r[1]);return e?[e]:[]}},NAME:function(s,v,w){if(typeof v.getElementsByName!=="undefined"){var r=[],u=v.getElementsByName(s[1]);for(var t=0,e=u.length;t<e;t++){if(u[t].getAttribute("name")===s[1]){r.push(u[t])}}return r.length===0?null:r}},TAG:function(e,r){return r.getElementsByTagName(e[1])}},preFilter:{CLASS:function(t,r,s,e,w,x){t=" "+t[1].replace(/\\/g,"")+" ";if(x){return t}for(var u=0,v;(v=r[u])!=null;u++){if(v){if(w^(v.className&&(" "+v.className+" ").indexOf(t)>=0)){if(!s){e.push(v)}}else{if(s){r[u]=false}}}}return false},ID:function(e){return e[1].replace(/\\/g,"")},TAG:function(r,e){for(var s=0;e[s]===false;s++){}return e[s]&&o(e[s])?r[1]:r[1].toUpperCase()},CHILD:function(e){if(e[1]=="nth"){var r=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(e[2]=="even"&&"2n"||e[2]=="odd"&&"2n+1"||!/\D/.test(e[2])&&"0n+"+e[2]||e[2]);e[2]=(r[1]+(r[2]||1))-0;e[3]=r[3]-0}e[0]=i++;return e},ATTR:function(u,r,s,e,v,w){var t=u[1].replace(/\\/g,"");if(!w&&f.attrMap[t]){u[1]=f.attrMap[t]}if(u[2]==="~="){u[4]=" "+u[4]+" "}return u},PSEUDO:function(u,r,s,e,v){if(u[1]==="not"){if(p.exec(u[3]).length>1||/^\w/.test(u[3])){u[3]=b(u[3],null,null,r)}else{var t=b.filter(u[3],r,s,true^v);if(!s){e.push.apply(e,t)}return false}}else{if(f.match.POS.test(u[0])||f.match.CHILD.test(u[0])){return true}}return u},POS:function(e){e.unshift(true);return e}},filters:{enabled:function(e){return e.disabled===false&&e.type!=="hidden"},disabled:function(e){return e.disabled===true},checked:function(e){return e.checked===true},selected:function(e){e.parentNode.selectedIndex;return e.selected===true},parent:function(e){return !!e.firstChild},empty:function(e){return !e.firstChild},has:function(s,r,e){return !!b(e[3],s).length},header:function(e){return/h\d/i.test(e.nodeName)},text:function(e){return"text"===e.type},radio:function(e){return"radio"===e.type},checkbox:function(e){return"checkbox"===e.type},file:function(e){return"file"===e.type},password:function(e){return"password"===e.type},submit:function(e){return"submit"===e.type},image:function(e){return"image"===e.type},reset:function(e){return"reset"===e.type},button:function(e){return"button"===e.type||e.nodeName.toUpperCase()==="BUTTON"},input:function(e){return/input|select|textarea|button/i.test(e.nodeName)}},setFilters:{first:function(r,e){return e===0},last:function(s,r,e,t){return r===t.length-1},even:function(r,e){return e%2===0},odd:function(r,e){return e%2===1},lt:function(s,r,e){return r<e[3]-0},gt:function(s,r,e){return r>e[3]-0},nth:function(s,r,e){return e[3]-0==r},eq:function(s,r,e){return e[3]-0==r}},filter:{PSEUDO:function(w,s,t,x){var r=s[1],u=f.filters[r];if(u){return u(w,t,s,x)}else{if(r==="contains"){return(w.textContent||w.innerText||"").indexOf(s[3])>=0}else{if(r==="not"){var v=s[3];for(var t=0,e=v.length;t<e;t++){if(v[t]===w){return false}}return true}}}},CHILD:function(e,t){var w=t[1],r=e;switch(w){case"only":case"first":while((r=r.previousSibling)){if(r.nodeType===1){return false}}if(w=="first"){return true}r=e;case"last":while((r=r.nextSibling)){if(r.nodeType===1){return false}}return true;case"nth":var s=t[2],z=t[3];if(s==1&&z==0){return true}var v=t[0],y=e.parentNode;if(y&&(y.sizcache!==v||!e.nodeIndex)){var u=0;for(r=y.firstChild;r;r=r.nextSibling){if(r.nodeType===1){r.nodeIndex=++u}}y.sizcache=v}var x=e.nodeIndex-z;if(s==0){return x==0}else{return(x%s==0&&x/s>=0)}}},ID:function(r,e){return r.nodeType===1&&r.getAttribute("id")===e},TAG:function(r,e){return(e==="*"&&r.nodeType===1)||r.nodeName===e},CLASS:function(r,e){return(" "+(r.className||r.getAttribute("class"))+" ").indexOf(e)>-1},ATTR:function(v,t){var s=t[1],e=f.attrHandle[s]?f.attrHandle[s](v):v[s]!=null?v[s]:v.getAttribute(s),w=e+"",u=t[2],r=t[4];return e==null?u==="!=":u==="="?w===r:u==="*="?w.indexOf(r)>=0:u==="~="?(" "+w+" ").indexOf(r)>=0:!r?w&&e!==false:u==="!="?w!=r:u==="^="?w.indexOf(r)===0:u==="$="?w.substr(w.length-r.length)===r:u==="|="?w===r||w.substr(0,r.length+1)===r+"-":false},POS:function(u,r,s,v){var e=r[2],t=f.setFilters[e];if(t){return t(u,s,r,v)}}}};var j=f.match.POS;for(var l in f.match){f.match[l]=new RegExp(f.match[l].source+/(?![^\[]*\])(?![^\(]*\))/.source)}var a=function(r,e){r=Array.prototype.slice.call(r,0);if(e){e.push.apply(e,r);return e}return r};try{Array.prototype.slice.call(document.documentElement.childNodes,0)}catch(k){a=function(u,t){var r=t||[];if(d.call(u)==="[object Array]"){Array.prototype.push.apply(r,u)}else{if(typeof u.length==="number"){for(var s=0,e=u.length;s<e;s++){r.push(u[s])}}else{for(var s=0;u[s];s++){r.push(u[s])}}}return r}}var c;if(document.documentElement.compareDocumentPosition){c=function(r,e){if(!r.compareDocumentPosition||!e.compareDocumentPosition){if(r==e){n=true}return 0}var s=r.compareDocumentPosition(e)&4?-1:r===e?0:1;if(s===0){n=true}return s}}else{if("sourceIndex" in document.documentElement){c=function(r,e){if(!r.sourceIndex||!e.sourceIndex){if(r==e){n=true}return 0}var s=r.sourceIndex-e.sourceIndex;if(s===0){n=true}return s}}else{if(document.createRange){c=function(t,r){if(!t.ownerDocument||!r.ownerDocument){if(t==r){n=true}return 0}var s=t.ownerDocument.createRange(),e=r.ownerDocument.createRange();s.selectNode(t);s.collapse(true);e.selectNode(r);e.collapse(true);var u=s.compareBoundaryPoints(Range.START_TO_END,e);if(u===0){n=true}return u}}}}(function(){var r=document.createElement("div"),s="script"+(new Date).getTime();r.innerHTML="<a name='"+s+"'/>";var e=document.documentElement;e.insertBefore(r,e.firstChild);if(!!document.getElementById(s)){f.find.ID=function(u,v,w){if(typeof v.getElementById!=="undefined"&&!w){var t=v.getElementById(u[1]);return t?t.id===u[1]||typeof t.getAttributeNode!=="undefined"&&t.getAttributeNode("id").nodeValue===u[1]?[t]:undefined:[]}};f.filter.ID=function(v,t){var u=typeof v.getAttributeNode!=="undefined"&&v.getAttributeNode("id");return v.nodeType===1&&u&&u.nodeValue===t}}e.removeChild(r);e=r=null})();if(document.querySelectorAll){(function(){var e=b,s=document.createElement("div");s.innerHTML="<p class='TEST'></p>";if(s.querySelectorAll&&s.querySelectorAll(".TEST").length===0){return}b=function(w,v,t,u){v=v||document;if(!u&&v.nodeType===9&&!o(v)){try{return a(v.querySelectorAll(w),t)}catch(x){}}return e(w,v,t,u)};for(var r in e){b[r]=e[r]}s=null})()}if(document.getElementsByClassName&&document.documentElement.getElementsByClassName){(function(){var e=document.createElement("div");e.innerHTML="<div class='test e'></div><div class='test'></div>";if(e.getElementsByClassName("e").length===0){return}e.lastChild.className="e";if(e.getElementsByClassName("e").length===1){return}f.order.splice(1,0,"CLASS");f.find.CLASS=function(r,s,t){if(typeof s.getElementsByClassName!=="undefined"&&!t){return s.getElementsByClassName(r[1])}};e=null})()}function m(r,w,v,A,x,z){var y=r=="previousSibling"&&!z;for(var t=0,s=A.length;t<s;t++){var e=A[t];if(e){if(y&&e.nodeType===1){e.sizcache=v;e.sizset=t}e=e[r];var u=false;while(e){if(e.sizcache===v){u=A[e.sizset];break}if(e.nodeType===1&&!z){e.sizcache=v;e.sizset=t}if(e.nodeName===w){u=e;break}e=e[r]}A[t]=u}}}function q(r,w,v,A,x,z){var y=r=="previousSibling"&&!z;for(var t=0,s=A.length;t<s;t++){var e=A[t];if(e){if(y&&e.nodeType===1){e.sizcache=v;e.sizset=t}e=e[r];var u=false;while(e){if(e.sizcache===v){u=A[e.sizset];break}if(e.nodeType===1){if(!z){e.sizcache=v;e.sizset=t}if(typeof w!=="string"){if(e===w){u=true;break}}else{if(b.filter(w,[e]).length>0){u=e;break}}}e=e[r]}A[t]=u}}}var h=document.compareDocumentPosition?function(r,e){return r.compareDocumentPosition(e)&16}:function(r,e){return r!==e&&(r.contains?r.contains(e):true)};var o=function(e){return e.nodeType===9&&e.documentElement.nodeName!=="HTML"||!!e.ownerDocument&&e.ownerDocument.documentElement.nodeName!=="HTML"};var g=function(e,x){var t=[],u="",v,s=x.nodeType?[x]:x;while((v=f.match.PSEUDO.exec(e))){u+=v[0];e=e.replace(f.match.PSEUDO,"")}e=f.relative[e]?e+"*":e;for(var w=0,r=s.length;w<r;w++){b(e,s[w],t)}return b.filter(u,t)};window.Sizzle=b})();if(!daum.Browser.webkit){JSON=undefined}if(!this.JSON){this.JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());// jigu default initialization


/*!
 * Jigu Initialization
 *  more information: http://play.daumcorp.com/display/ftst/Jigu+Initialization
 */
/* @ cc_on _d = document; eval(‘var document = _d’) @*/
(function(){
    if(!document.getElementsByClassName){document.getElementsByClassName = daum.methodize(daum.Element.getElementsByClassName);}
    if(String.prototype.trim){daum.String.trim = function(s){return s.trim();};}
    if(!window.$) window.$ = daum.$;    
    if(!window.$A) window.$A = daum.$A;
    if(!window.$E) window.$E = daum.$E;
    if(!window.$T) window.$T = daum.$T;
    if(!window.$C) window.$C = daum.$C;
    if(window.Sizzle) window.$$ = daum.$$ = window.Sizzle;
    daum.extend(daum, daum.Event);
    daum.extend(daum, daum.Browser);
    daum.extend(daum, daum.Element);
    if(daum.Event.GC!=undefined){window.JiguEventGC = daum.Function.interval(daum.Event.GC, 60000, daum.Event);}
    daum.Event.addEvent(window, "load", function(){ daum.documentLoaded = true; });
    daum.nativeExtend();
    daum.Browser.init();
    if(!window.console){window.console={debug:function(){},log:function(){}}}else{if(!window.console.log){window.console.debug=window.console.log=function(){}}else{if(!window.console.debug){window.console.debug=function(){for(var b=0,a=arguments.length;b<a;b++){window.console.log(arguments[b])}}}}};
    return true;
})();
/*
 * @overview Daum Suggest, v@VERSION
 * Copyright (c) 2010 Front-end Technology Center, Daum Communications.
 * 
 * $Version : @VERSION $
 * $Date : 2012-02-08 20:51 $
 * $Revision : 276 $
 * 
 * Project site: http://play.daumcorp.com/pages/viewpage.action?pageId=15013351
 * Licensed under Daum Common License : http://dna.daumcorp.com/forge/docs/daum-license-1.0.txt
 */
(function(){if(window.daum){window.jigu=window.daum}else{if(window.daumSF){window.jigu=window.daumSF;window.daum={}}}daum.suggest={version:"@VERSION",message:{},define:{},model:{},module:{},view:{},template:{},sparrow:{}}})();if(!window.daum){window.daum={}}if(window.$ssf){window._$ssf=window.$ssf}window._development=true;window.$ssf=daum.suggest.sparrow=(function(){var f=[];var d={_loadingfn:"",run:function(m,l,h,o,j){for(var k=0;k<m.length;k++){var n=m[k];this._loadingfn=n.desc;if(n.desc){}n(l,h,o,j)}this._loadingfn=""},install:function(i,h){try{h.desc=i;f.push(h)}catch(j){}},installX:function(i,h){try{}catch(j){}},installModule:function(j,h,k,i){this.run(f,j,h,k,i)
}};d.win=window;d.doc=window.document;d.tmp=d.doc.createElement("div");d.html=d.doc.documentElement;d.services={};var b=[],c=[];var g=d.EventDispatcher=function(){};g.addBeforeCallback=function(h){b.push(h)};g.addAfterCallback=function(h){c.push(h)};d.EventDispatcher.prototype={addListener:function(j){for(var h in j){var i=j[h];this.addAdaptor(h,i)}},addAdaptor:function(h,i){if(!this.listeners){this.listeners={}}i._module=$ssf._loadingfn;if(!this.listeners[h]){this.listeners[h]=[]}this.listeners[h].push(i)},dispatchEvent:function(k,r){if(!this.listeners){return}var n=true;r=r||{target:this};var j=this.listeners[k];if(j){var q=true;for(var o=0,m=b.length;o<m;o++){var q=b[o](k,this,r)}if(!q){return}for(var o=0,m=j.length;o<m;o++){var s=j[o];try{if(s.call(this,r)===false){n=false}}catch(p){var h=["listener_error_",p.fileName,"/",p.lineNumber,"/",jigu.getCookie("D_sid"),"/",p.message.replace(/ /g,"_"),"/",p.stack].join("");if(window._development==true){throw p}}}for(var o=0,m=c.length;o<m;o++){c[o](k,this,r)
}}return n},init:function(){this.dispatchEvent("onPreinitialized",{target:this});if(this.initialize){this.initialize()}this.dispatchEvent("onInitialized",{target:this})}};function e(i,h){if(!h.getContainer){h.getContainer=function(){return h.container||h.el}}if(h.release&&h.getContainer()){jigu.addEvent(h.getContainer(),"mousedown",function(j){i.currentView=h})}}var a=[];d.Runner=function(){this.$super();var o=this;var q=this.models=new _registry({added:function(i){}}),k=this.views=new _registry({added:function(i){}}),h=this.commands=new _registry(),m=this.config=window.daumProperties||{};var p=k.add;k.add=function(l,i){i.getApplicationContext=function(){return o};e(o,i);p.call(k,l,i)};this.getViewStack=function(){return a};if(window._development){d.trimpath()}d.installModule(this,k,q,this.config);for(var n=0,j=k.length;n<j;n++){k.get(k[n]).init()}this.dispatchEvent("onContextLoad",{});jigu.addEvent($ssf.win,"unload",function(){o.dispatchEvent("onContextUnload",{})});d.win.onerror=function(r,l,i){o.dispatchEvent("errorCatched",{message:r,exception:{message:r,fileName:l,lineNumber:i,stack:""}});
return true}};jigu.Function.inherit(d.Runner,g);return d})();(function(b){try{b.doc.execCommand("BackgroundImageCache",false,true)}catch(a){}})(daum.suggest.sparrow);(function(){jigu.extend(daum.suggest.message,{ERROR_NO_PROXY_FRAME:"Proxy Frame \uc774 \uc0dd\uc131\ub418\uc9c0 \uc54a\uc558\uc2b5\ub2c8\ub2e4.\n\uc11c\uc81c\uc2a4\ud2b8\ub97c \uc2dc\uc791\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.",ERROR_NO_REQUEST_URL:"Request URL\uc774 \uc120\uc5b8\ub418\uc9c0 \uc54a\uc558\uc2b5\ub2c8\ub2e4.\n\uc11c\uc81c\uc2a4\ud2b8\ub97c \uc2dc\uc791\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.",ERROR_NO_INPUTBOX:"\uac80\uc0c9\uc5b4 \uc785\ub825\ub780\uc774 \uc874\uc7ac\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.\n\uc11c\uc81c\uc2a4\ud2b8\ub97c \uc2dc\uc791\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.",ERROR_NO_PARENT_CONTAINER:"\uac80\uc0c9\uc5b4 \uc785\ub825\ub780 \uc0c1\uc704 \ucee8\ud14c\uc774\ub108\uac00 \uc874\uc7ac\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.\n\uc11c\uc81c\uc2a4\ud2b8\ub97c \uc2dc\uc791\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.",CONFIRM_DEL_RECENT:"\uac80\uc0c9 \uae30\ub85d\uc744 \ubaa8\ub450\n\uc0ad\uc81c \ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c?",CONFIRM_HIDE_RECENT:"\ucd5c\uadfc\uac80\uc0c9\uc5b4 \uc0ac\uc6a9\uc744\n\uc911\ub2e8\ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c?"})
})();(function(){jigu.extend(daum.suggest.define,{Keyboard:{BACKSPACE:8,TAB:9,ENTER:13,SHIFT:16,CTRL:17,ALT:18,CAPSLOOK:20,NAK:21,ESC:27,SPACEBAR:32,PAGEUP:33,PAGEDOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,SELECT:41,V:86,SQUARE:91,BASH:92,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,MAC_COMMAND:224}})})();(function(){jigu.extend(daum.suggest.template,{RequestString:"?q=KEYWORD&mod=json&code=CHARSET",Base:new jigu.Template(["<ul>#{list_high}</ul>","<ul>#{list_low}</ul>"].join("")),BlankImage:'<img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="blankImage" />',Image:new jigu.Template('<img src="#{url}">'),IsNonImage:new jigu.Template('<div class="empty"></div>'),BtnAdd:'<button class="btn_add">\ucd94\uac00</button>',Item:new jigu.Template('<li class="idx_#{idx}"><a class="keyword item#{first}" href="javascript:;">#{item}#{blankImage}</a>#{btnAdd}</li>'),Footer:new jigu.Template(['<a class="btn_close" href="#">','<span class="txt_close"><span>\ub2eb\uae30</span></span>','<img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="bg_shield">',"</a>"].join("")),MyKeywordFooter:new jigu.Template(['<a class="btn_my" href="http://p.search.daum.net/m/keyword?smenu=keyword"><span class="ico_comm ico_star"></span>My\uac80\uc0c9\uc5b4','<img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="bg_shield"></a>','<a class="btn_close" href="#"><span class="txt_close"><span>\ub2eb\uae30</span></span>','<img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="bg_shield"></a>'].join("")),RecentFooter:new jigu.Template(['<span id="sug_recentArea" class="sug_recent_footer">','<a href="#" style="display:#{display}" class="deleteRecent">\uae30\ub85d\uc0ad\uc81c</a><span class="bar" style="display:#{display}">|</span>','<a href="#" style="display:inline" class="toggleRecent #{toggleClass}">#{toggleMent}</a>',"</span>",'<a class="btn_close" href="#">','<span class="txt_close"><span>\ub2eb\uae30</span></span>','<img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="bg_shield">',"</a>"].join("")),TailMore:new jigu.Template(""),HeadMore:new jigu.Template(""),UsingSuggest:new jigu.Template("\uc11c\uc81c\uc2a4\ud2b8 \uae30\ub2a5\uc744 \uc0ac\uc6a9\ud558\uace0 \uc788\uc2b5\ub2c8\ub2e4."),UseSuggest:new jigu.Template("\uc11c\uc81c\uc2a4\ud2b8 \uae30\ub2a5\uc774 \ud65c\uc131\ud654 \ub418\uc5c8\uc2b5\ub2c8\ub2e4.")})
})();(function(){jigu.extend(daum.suggest.define,{FocusPointType:{LOAD:"load",WRITE:"write",DEFAULT:"user"},KeywordCompareType:{HEAD:"head",TAIL:"tail",FULL:"full"},ListPositionType:{TRANS:"tail",DEFAULT:"head"},ActivationCookieName:"suggest",ActivationType:{ON:"on",OFF:"off"},RecentCookieName:"recentSuggest",RecentCookieType:{ON:"on",OFF:"off"},KeywordMaxLength:20,KeywordMaxByte:40,ListMaxSize:13,EncodeType:{UTF_IN_OUT:"utf_in_out",UTF_IN:"utf_in"},DynamicScript:{SUGGEST:"dynamic_script_suggest"},FrameOrientation:{"90":"wide_frame","-90":"wide_frame","0":"default_frame","180":"default_frame"},Separator:{RAWDATA_ITEM:"|",AREACODE_ITEM:","},YellowClip:{ON:"expand",OFF:"off"},FirstKeyword:null,RecentKeyword:null,EnableRecentKeyword:false,RecentKeywordKeyname:"DaumSuggestRecentKeyword",CrossDomainStorageURL:"http://m.search.daum.net/xDomainStorage.html?q=KEYWORD&callback=CALLBACK_NAME",CrossDomainStorageURLCallBack:"parent.INSTANCE_NAME._forceRecentKeywordData",CrossDomainStorageURLCallBackDataOnly:"parent.INSTANCE_NAME._forceRecentKeywordDataOnly",CrossDomainStorageIframeId:null,EnableMyKeyword:false})
})();(function(c){var b=c.model.DataModel=function(e){this.suggestDomain=e.suggestDomain;this.requestUrl=e.requestUrl;this.requestString=e.requestString;this.encode=e.encode||"";this.defaultKeyword=e.keyword;if(e.proxyUrl){this.createFrame(e.suggestDomain+e.proxyUrl)}this.callbackName=e.callbackName;this.loadVisible="visible";this.initialize(e)};jigu.Function.inherit(b,$ssf.EventDispatcher,{initialize:function(e){},setEncode:function(e){this.encode=e},setCallbackName:function(e){this.callbackName=e},setRequestUrl:function(e){this.requestUrl=e},setRequestString:function(e){this.requestString=e},getRequestFullUrl:function(){var e;if(this.requestString){e=this.requestString}else{e=c.template.RequestString}return this.suggestDomain+this.requestUrl+e.replace("CHARSET",this.encode)},get:function(e,g){this.loadVisible=g||"visible";var f=c.model.Raw.getByKeyword(e,this.suggestDomain+this.requestUrl+this.requestString)||null;if(!!e&&!f){this.callSuggestData(e)}else{if(!!f){this.dispatchEvent("onReloadCache",{data:f})
}else{this.dispatchEvent("onEmptyKeyword")}}},callSuggestData:function(e){if(jigu.String.byteLength(e)>c.define.KeywordMaxByte){this.dispatchEvent("onOverKeyword");return false}var g=e;if(this.encode==c.define.EncodeType.UTF_IN_OUT||this.encode==c.define.EncodeType.UTF_IN){g=encodeURIComponent(e)}if(this.callbackName){var f=[this.getRequestFullUrl().replace("KEYWORD",g),"&callback=",this.callbackName].join("");c.module.ScriptCall.load(f,c.define.DynamicScript.SUGGEST)}else{this.proxyCall()}},proxyCall:function(){var f=this;var e=this.getProxyData(requestKeyword,this.getRequestFullUrl(),function(h){var g=a(h);f.forceLoadComplete(g)});if(e){this.dispatchEvent("onSendData",{keyword:keyword,url:this.getRequestFullUrl()})}},forceLoadComplete:function(e){this.dispatchEvent("onLoadComplete",{data:e,route:this.suggestDomain+this.requestUrl+this.requestString,visible:this.loadVisible})},getProxyData:function(f,h,i){if(this.proxyFrame){try{this.proxyFrame.contentWindow.getData(f,h,i);return true}catch(g){}}else{return false
}},createFrame:function(f){var e=this;daum.suggest.DOMReady(function(){e.proxyFrame=d(f);document.body.appendChild(e.proxyFrame)})}});var a=function(e){return(new Function("","return "+e+";"))()};var d=function(e){var f=document.createElement("iframe");f.name="proxyIframe";f.src=e;f.style.display="none";f.title="Suggest Proxy Frame";return f}})(daum.suggest);(function(a){var b=a.model.DataModelRecent=function(c){this.useCrossDomainStorage=c.useCrossDomainStorage;this.recentKeywordData=c.recentKeywordData;this.proxyUrlOrCallbackName=c.proxyUrlOrCallbackName;this.boxView=c.boxView;this.areadyCall=false};jigu.Function.inherit(b,$ssf.EventDispatcher,{showList:function(){var c=this.getData();if(c){this.boxView.renderBase("list");this.boxView.dispatchEvent("onShowList",{data:this.getData(),more:false,isRecent:true})}},deleteData:function(){if(a.define.CrossDomainStorageIframeId){var c=jigu.$(a.define.CrossDomainStorageIframeId);if(c){c.src=this.getStorageURL("","remove")}}},request:function(c){if(!this.areadyCall){if((typeof(DMT)!="undefined")&&DMT.sendTiara!==true){return
}var d=this;daum.suggest.DOMReady(function(){d.areadyCall=true;d.createIframe(d.getStorageURL(d.getQuery(),d.getCallBackName(c)))})}else{if(this.getData()&&!c){this.showList(this.recentKeywordData)}}},getCallBackName:function(d){var c;if(d){c=a.define.CrossDomainStorageURLCallBackDataOnly}else{c=a.define.CrossDomainStorageURLCallBack}return c.replace("INSTANCE_NAME",this.proxyUrlOrCallbackName.split(".")[0])},getQuery:function(){if(!a.define.RecentKeyword){return""}return encodeURIComponent(a.define.RecentKeyword)},getStorageURL:function(c,e){var d=a.define.CrossDomainStorageURL.replace("KEYWORD",c).replace("CALLBACK_NAME",e);return(d+"&t="+new Date().getTime())},setEmptyData:function(){this.recentKeywordData=null},setData:function(g){if(!g){return}var f=g.trim().split("||");var d=[];for(var e=0,c;c=f[e];e++){var h=decodeURIComponent(c);d.push({string:h,index:e,item:new Array(h)})}this.recentKeywordData={keyword:"",head:d,tail:[],all:d.concat([])}},getData:function(){return this.recentKeywordData
},createIframe:function(f){try{var c=null;if(a.define.CrossDomainStorageIframeId){c=jigu.$(a.define.CrossDomainStorageIframeId);c.src=f}else{a.define.CrossDomainStorageIframeId="dynamic_recent_suggest";c=document.createElement("iframe");c.style.display="none";c.src=f;c.id=a.define.CrossDomainStorageIframeId;document.body.appendChild(c)}}catch(d){}}})})(daum.suggest);(function(a){var b=a.model.ListModel=function(c){this.limit=c.limit;this.data={};this.type=c.type;this.customGetStringFunc=c.customGetStringFunc;this.subwayAreacode=c.subwayAreacode};jigu.Function.inherit(b,$ssf.EventDispatcher,{set:function(c){this.reset();if(!!c){this.data.keyword=c.rq;if(this.subwayAreacode){this.data.keyword=this.data.keyword.replace(this.subwayAreacode,"")}this.setList(c.items,"head");this.setList(c.r_items,"tail");var d=this.rebuildLimit(this.data.head.length,this.data.tail.length);this.pushAllData("head",d.head);this.pushAllData("tail",d.tail)}},rebuildLimit:function(c,f){var e=Math.min(c,this.limit[0]),d=(this.limit[0]+this.limit[1])-e;
return{head:e,tail:d}},get:function(){return this.data},getString:function(c){if(this.customGetStringFunc){return this.customGetStringFunc(c)}return c[0]},setList:function(h,g){_setData=this.data[g];for(var f=0,c=h.length;f<c;f++){var e=h[f].split(a.define.Separator.RAWDATA_ITEM);var d={string:this.stringConvert(this.getString(e)),image:e[1],index:f,item:e};_setData.push(d)}},reset:function(){this.data={keyword:"",head:[],tail:[],all:[]}},getSelectedItem:function(c){if(c==null||c<0||c>=this.data.all.length){return false}return this.data.all[c]},pushAllData:function(g,d){var f=(g=="tail")?this.data.tail:this.data.head;if(f){var c=Math.min(d,f.length);for(var e=0;e<c;e++){this.data.all.push(f[e])}}},getChangeSort:function(c){this.data.all=[];var d;if(!!this.data.head==false&&!!this.data.tail==false){return this.data}if(c=="tail"){d=this.rebuildLimit(this.data.tail.length,this.data.head.length);this.pushAllData("tail",d.head);this.pushAllData("head",d.tail)}else{d=this.rebuildLimit(this.data.head.length,this.data.tail.length);
this.pushAllData("head",d.head);this.pushAllData("tail",d.tail)}return this.data},stringConvert:function(c){if(this.subwayAreacode){c=c.split(a.define.Separator.AREACODE_ITEM)[0]}return c.replace(/\&amp;/g,"&").replace(/\&lt;/g,"<").replace(/\&gt;/g,">").replace(/\&quot;/g,'"')}})})(daum.suggest);(function(){daum.suggest.model.Raw=function(){var b={};var a=0;var c={set:function(e,d){if(a>100){a=0;b={}}if(!b[d]){b[d]={}}b[d][e.rq]={rq:e.rq||"",items:e.items||[],r_items:e.r_items||[]};a++;return b[d][e.rq]},get:function(){return b},getByKeyword:function(e,d){if(!!b[d]==false){return false}if(b[d][e]){return b[d][e]}return false},empty:function(){b={}}};return c}()})();(function(){jigu.extend(daum.suggest.module,{AvailableKeyCode:function(d){var a=daum.suggest.define.Keyboard;var b=[a.CTRL,a.ALT,a.LEFT,a.RIGHT];for(var c=b.length-1;c>=0;--c){if(b[c]==d){return false}}return true}})})();(function(){jigu.extend(daum.suggest.module,{KeywordHighlight:function(g,f,e){var d;if(e=="head"){d=a(g,f)
}else{if(e=="tail"){d=c(g,f)}else{d=b(g,f)}}if(d==""){d=g}return d}});var a=function(d,o,n,p){var r="";if(!(n&&p)){n=d.replace(/ /g,"");p=o.replace(/ /g,"")}var q=n.toLowerCase().indexOf(p.toLowerCase());if(q>-1){for(var m=0,h=0;h<q;m++){var g=d.substring(m,m+1);if(g!=" "){h++}r+=g}r+="<strong>";for(var f=m,e=0;e<p.length;f++){var g=d.substring(f,f+1);if(g!=" "){e++}r+=g}r+="</strong>"+d.substr(f)}return r};var c=function(d,o,n,p){var q="";if(!(n&&p)){n=d.replace(/ /g,"");p=o.replace(/ /g,"")}if(p==n.substring(n.length-p.length)){for(var m=0,h=0;h<n.length-p.length;m++){var g=d.substring(m,m+1);if(g!=" "){h++}q+=g}q+="<strong>";for(var f=m,e=0;e<p.length;f++){var g=d.substring(f,f+1);if(g!=" "){e++}q+=g}q+="</strong>"}return q};var b=function(i,h){var f="",e=i.replace(/ /g,""),g=h.replace(/ /g,"");var d=e.toLowerCase().indexOf(g.toLowerCase());if(d==0){return a(i,h,e,g)}else{return c(i,h,e,g)}}})();(function(){jigu.extend(daum.suggest.module,{RequestKeyword:function(){}})})();(function(a){jigu.extend(a.module,{ScriptCall:function(){var b=document.getElementsByTagName("head")[0];
var c={load:function(f,g){var d=jigu.$(g);if(d){b.removeChild(d)}var e=document.createElement("script");e.type="text/javascript";e.id=g;e.src=f;b.appendChild(e)}};return c}()})})(daum.suggest);(function(c){var a=true;var e=c.define.ActivationCookieName,d=c.define.ActivationType.ON,b=c.define.ActivationType.OFF;jigu.extend(c.module,{ActivationFlag:function(){a=(jigu.getCookie(e)==b)?false:true;var f={set:function(g){a=(g==b)?false:true;jigu.setCookie(e,g,365000)},get:function(){return a}};return f}()})})(daum.suggest);(function(c){var b=false;var a=c.view.BoxView=function(d){this.container=d.container;this.type=d.type;this.listModel=d.listModel;this._isVisible=false};jigu.Function.inherit(a,$ssf.EventDispatcher,{getDataModelRecent:function(){return this.dataModelRecent},renderBase:function(d){if(jigu.hasClassName(this.container,"thumbType")){jigu.removeClassName(this.container,"thumbType")}if(d=="guide"){b=true}else{b=false}this.container.style.display="block";this._isVisible=true},renderType:function(){if(this.type=="thumb"){if(!jigu.hasClassName(this.container,"thumbType")){jigu.addClassName(this.container,"thumbType")
}}},getDataList:function(){return(!!this.keywordDataList==false)?this.listModel.get():this.keywordDataList},visible:function(f){var g=this.getDataList();var e=g.keyword;if(!!e==false){if(f=="toUse"){this.renderBase("guide");this.dispatchEvent("onShowGuide",{type:"UseSuggest"})}else{if(f=="Used"){this.renderBase("guide");this.dispatchEvent("onShowGuide",{type:"UsingSuggest"})}}}else{if(jigu.Array.size(g.all)<=0){this.dispatchEvent("onShowGuide",{type:"NoResult"})}else{this.renderBase("list");var d=true;if(g.head.length==0||g.tail.length==0){d=false}this.dispatchEvent("onShowList",{data:g,more:d})}}},hidden:function(){this.container.style.display="none";this._isVisible=false;this.dispatchEvent("onHiddenBox")},isVisible:function(){return this._isVisible}})})(daum.suggest);(function(b){var a=b.view.FooterView=function(c){this.index=null;this.container=c.container;this.offUsable=c.yellowClip;this.footerContainer=null;this.initialize()};jigu.Function.inherit(a,$ssf.EventDispatcher,{initialize:function(){},addMouseEvent:function(d){var c=this;
jigu.addEvent(jigu.getElementsByClassName(this.container,"txt_close")[0],"mousedown",function(f){c.dispatchEvent("onCloseSuggest");jigu.stopEvent(f)});if(d){jigu.addEvent(jigu.getElementsByClassName(this.container,"deleteRecent")[0],"mousedown",function(f){c.dispatchEvent("onDeleteRecent");jigu.stopEvent(f)});jigu.addEvent(jigu.getElementsByClassName(this.container,"toggleRecent")[0],"mousedown",function(f){c.dispatchEvent("onToggleRecent",f);jigu.stopEvent(f)})}if(b.define.EnableMyKeyword){var e=jigu.getElementsByClassName(this.container,"btn_my")[0];if(!!e){jigu.addEvent(e,"mousedown",function(i){var g=(typeof(EnQuery)=="undefined")?"":"&q="+EnQuery;var h=jigu.getParam("w");var o=jigu.getParam("m_f");var f=(h==null)?"":"&w="+h;var p=(o==null)?"":"&m_f="+o;this.href="http://p.search.daum.net/m/keyword?smenu=keyword"+g+f+p;jigu.stopEvent(i)})}}},setFooterHtml:function(c){if(!!this.container==false){return false}if(!!this.footerContainer==false){this.footerContainer=document.createElement("DIV");
this.footerContainer.className="footer";this.container.appendChild(this.footerContainer)}this.footerContainer.innerHTML=c},render:function(f,e){var d;var g={};if(e){if(jigu.$("sug_recentArea")){return}var c=b.define;if(jigu.getCookie(c.RecentCookieName)==c.RecentCookieType.OFF){g.toggleClass=c.RecentCookieType.ON;g.toggleMent="\ucd5c\uadfc\uac80\uc0c9\uc5b4 \ubcf4\uae30";g.display="none"}else{g.toggleClass=c.RecentCookieType.OFF;g.toggleMent="\ucd5c\uadfc\uac80\uc0c9\uc5b4 \uc228\uae30\uae30";g.display="inline"}d=b.template.RecentFooter}else{if(b.define.EnableMyKeyword){d=b.template.MyKeywordFooter}else{d=b.template.Footer}}this.setFooterHtml(d.evaluate(g));this.addMouseEvent(e)}})})(daum.suggest);(function(b){var a=b.view.GuideView=function(c){this.container=c.container;this.customUsingGuide=c.customUsingGuide;this.guideContainer=null;this.initialize()};jigu.Function.inherit(a,$ssf.EventDispatcher,{initialize:function(){this.render()},setGuideHtml:function(c){if(!!this.container==false){return false
}var d=jigu.getElementsByClassName(this.container,"list");if(d.length>0){jigu.replaceClassName(d[0],"list","guide");this.guideContainer=d[0]}if(!!this.guideContainer==false){this.guideContainer=document.createElement("DIV");jigu.addClassName(this.guideContainer,"guide");this.container.appendChild(this.guideContainer)}this.guideContainer.innerHTML=c},render:function(c){switch(c){case"USING":if(this.customUsingGuide&&typeof this.customUsingGuide=="function"){this.setGuideHtml(b.template.UsingExternalGuide.evaluate());this.customUsingGuide(Sizzle(".guide",this.container)[0])}else{this.setGuideHtml(b.template.UsingSuggest.evaluate())}break;case"USE":this.setGuideHtml(b.template.UseSuggest.evaluate());break}}})})(daum.suggest);(function(a){var i=0,g=0;var e=130;var b=true;var j=true;var c=a.define.Keyboard;var k=false;var f=false;var h=false;var d=a.view.KeywordInputView=function(l){this._defaultKeyword="";this._keywordBox=l;this._previousKeyword=l.value;this._currentKeyword=null;this._intervalId=null;
this.setSmartWatchingTarget();this._bindEvents()};jigu.Function.inherit(d,$ssf.EventDispatcher,{_bindEvents:function(){var l=this;jigu.addEvent(this._keywordBox,"focus",function(m){if(b){l.start()}l.dispatchEvent("onFocusKeywordBox",{event:m,keyword:l._currentKeyword||""})});jigu.addEvent(this._keywordBox,"mousedown",function(m){l.dispatchEvent("onClickKeywordBox",{event:m,keyword:l._keywordBox.value});jigu.stopPropagation(m)});jigu.addEvent(this._keywordBox,"keydown",function(n){var m=n.keyCode;if(m==c.SHIFT){k=true}else{if(m==c.ALT){f=true}else{if(m==c.CTRL){h=true}else{if(m==c.ENTER){l.dispatchEvent("onEnterKeywordBox",{event:n})}else{if(m==c.ESC){l.dispatchEvent("onAltTabKeywordBox",{event:n})}else{if(f&&m==c.TAB){l.dispatchEvent("onEscKeywordBox",{event:n})}else{if(m==c.UP||(k&&m==c.TAB)){l.dispatchEvent("onUpKeywordBox",{event:n,keyCode:m,isShift:k})}else{if(m==c.DOWN||(!k&&m==c.TAB)){l.dispatchEvent("onDownKeywordBox",{event:n,keyCode:m,isShift:k})}else{if(b&&a.module.ActivationFlag.get()==true&&l._intervalId==null){l.start()
}}}}}}}}}});jigu.addEvent(this._keywordBox,"keyup",function(n){var m=n.keyCode;if(m==c.SHIFT){k=false}else{if(m==c.ALT){f=false}else{if(m==c.CTRL){h=false}else{if(m==c.BACKSPACE){l.dispatchEvent("onBackspaceKeywordBox",{event:n})}}}}if(!!l.getValue()==false&&!!a.define.EnableRecentKeyword==false){l.dispatchEvent("onEmptyKeyword")}});jigu.addEvent(this._keywordBox,"blur",function(m){l.dispatchEvent("onBlurKeywordBox",{event:m})})},start:function(){if(this._intervalId){return}this._previousKeyword=this._currentKeyword=this._keywordBox.value;this._intervalId=jigu.Function.interval(this.watching,e,this)},watching:function(){this._currentKeyword=this._keywordBox.value;if(this._previousKeyword!=this._currentKeyword){this._previousKeyword=this._currentKeyword;this.dispatch(this._currentKeyword)}},dispatch:function(l){this.dispatchEvent("onChangeKeyword",{keyword:l})},setSmartWatchingTarget:function(){if(navigator.userAgent.indexOf("SHW")!=-1){return(j=false)}},clear:function(){},setAlwaysWatching:function(){b=true;
this.start()},setSmartWatching:function(){b=true},getWatchType:function(){return b},setDefaultKeyword:function(l){this._defaultKeyword=l},getDefaultKeyword:function(){return this._defaultKeyword},initDefaultKeyword:function(){if(!!this._keywordBox.value==true){this._keywordBox.value=this._previousKeyword=this._currentKeyword=this._defaultKeyword}},setFocus:function(){this._keywordBox.focus()},getValue:function(){return this._keywordBox.value},setValue:function(l){this._keywordBox.value=l;this._previousKeyword=l},clearValue:function(){this._keywordBox.value=""},setSelect:function(){this._keywordBox.select()},getBoxId:function(){return this._keywordBox.id},blur:function(){this._keywordBox.blur()}})})(daum.suggest);(function(b){var a=b.view.ListView=function(c){this.index=null;this.keyword=null;this.positionType=b.define.ListPositionType.DEFAULT;this.itemArr=null;this.container=c.container;this.limit=c.limit;this.isLimitMatch=c.isLimitMatch;this.customItemValueFunc=c.customItemValueFunc;this.maxSize=this.limit[0]+this.limit[1];
this.listContainer=null;this.listModel=null;this.eventFlag=false;this.isRecent=false;this.minIndex=0;this.maxIndex=0;this.initialize()};jigu.Function.inherit(a,$ssf.EventDispatcher,{initialize:function(){},move:function(d){if(this.maxIndex==0){return false}var c=this.index;switch(d){case"UP":c--;if(c<this.minIndex){this.dispatchEvent("onHideHighlight");return false}break;case"DOWN":c++;if(c>=this.maxIndex){return false}break}this.select(c)},moveUp:function(){this.move("UP")},moveDown:function(){this.move("DOWN")},select:function(d,e){var c=e||"";if(d==null){return false}this.blur();this.index=d;this.setClassNameOnSelectedItem();this.dispatchEvent("onSelectItem",{index:this.index,action:c})},blur:function(){if(this.index!=null&&this.index>=0){jigu.removeClassName(this.getItemEl()[this.index],"on")}},getIndex:function(){return this.index},getSelectedItem:function(){if(this.index==null||this.index<0){return null}var c=this.listModel.all[this.index];if(c){return c}else{return null}},getItemEl:function(){return(!!this.itemArr==false)?(this.itemArr=this.listContainer.getElementsByTagName("LI")):this.itemArr
},setClassNameOnSelectedItem:function(){var c=this.getItemEl()[this.index];if(c){jigu.addClassName(c,"on")}},getItemIndex:function(g){var f=g;for(var e=0;e<5;++e){if(jigu.String.startsWith(f.className,"idx_")){var d=f.className.match(/idx_([0-9]+).*/);var c=d[1];return c}f=jigu.getParent(f)}},bindEvent:function(){if(!!this.eventFlag==false){var c=this;jigu.addEvent(this.listContainer,"mouseover",function(f){var e=jigu.getElement(f);var d=c.getItemIndex(e);c.select(d,"over")});jigu.addEvent(this.listContainer,"click",function(f){var e=jigu.getElement(f);var d=c.getItemIndex(e);var g=c.listModel.all[d].string;if(e.tagName=="BUTTON"){c.dispatchEvent("onAddSelectedItem",{event:f,string:g})}else{c.dispatchEvent("onSelectedItemClick",{event:f,string:g})}});jigu.addEvent(this.listContainer,"mousedown",function(d){jigu.stopEvent(d)});this.eventFlag=true}},setListHtml:function(e){if(!!this.container==false){return false}var d=jigu.getElementsByClassName(this.container,"guide");if(d.length>0){d[0].className="list";
this.listContainer=d[0]}if(!!this.listContainer==false){this.listContainer=document.createElement("DIV");jigu.addClassName(this.listContainer,"list");this.container.appendChild(this.listContainer)}var c=b.define;if(c.EnableRecentKeyword&&(jigu.getCookie(c.RecentCookieName)==c.RecentCookieType.OFF)){this.listContainer.style.display="none"}this.listContainer.innerHTML=e;this.bindEvent()},itemEvaluate:function(n,k,h,p){var q=p||0;var m=null;var f=[];var e=n.length;var l=(e>=h)?h:e;var g;if(!this.isRecent){g=b.template.BtnAdd}else{g=""}var d=jigu.Browser.android?b.template.BlankImage:"";var c=jigu.Browser.android?'style="position:relative;"':"";for(var j=0;j<l;j++){var o;if(this.customItemValueFunc){o=this.customItemValueFunc(n[j])}else{o=n[j].string}f.push(b.template.Item.evaluate({first:(j%2==0)?" first":"",item:b.module.KeywordHighlight(o,this.keyword,k),idx:q+j,blankImage:d,style:c,btnAdd:g}))}return f.join("")},render:function(f,g){this.listModel=f;this.keyword=f.keyword;this.isRecent=g;
this.resetIndex();var k=b.define.ListPositionType;if(this.positionType==k.DEFAULT){var m=f.head,d=f.tail;var e=f.head.length,c=f.tail.length;if(e==0&&c>e){m=f.tail,d=f.head}}else{var m=f.tail,d=f.head}var l=Math.min(m.length,this.limit[0]);var j=this.limit[1];if(this.isLimitMatch===true){j=this.maxSize-l}var h=Math.min(d.length,j);this.maxIndex=l+h;var i=(this.limit[1]>0)?this.positionType:b.define.KeywordCompareType.FULL;this.setListHtml(b.template.Base.evaluate({list_high:this.itemEvaluate(m,i,l),list_low:(h>0)?this.itemEvaluate(d,(i==k.DEFAULT)?k.TRANS:k.DEFAULT,h,l):"",line:(l>0&&h>0)?"block":"none"}))},changePositionType:function(d){var c=b.define.ListPositionType;this.positionType=(this.positionType==c.DEFAULT)?c.TRANS:c.DEFAULT;this.render(d)},resetIndex:function(){this.index=-1},resetPositionType:function(){this.positionType=b.define.ListPositionType.DEFAULT},show:function(){if(this.listContainer){jigu.Element.show(this.listContainer)}},hide:function(){if(this.listContainer){jigu.Element.hide(this.listContainer)
}}})})(daum.suggest);(function(){var f=false;function d(){if(f){return}f=true;if(document.readyState&&document.readyState==="complete"){return b()}if(document&&document.getElementsByTagName&&document.getElementById&&document.body){return b()}if(document.addEventListener){document.addEventListener("DOMContentLoaded",function(){document.removeEventListener("DOMContentLoaded",arguments.callee,false);b()},false)}else{if(document.attachEvent){document.attachEvent("onreadystatechange",function(){if(document.readyState==="complete"){document.detachEvent("onreadystatechange",arguments.callee);b()}});if(document.documentElement.doScroll&&window==window.top){(function(){if(c){return}try{document.documentElement.doScroll("left")}catch(g){setTimeout(arguments.callee,0);return}b()})()}}}jigu.addEvent(window,"load",b)}var c=false;var e=[];function b(){if(!c){c=true;if(e){jigu.Array.each(e,function(g){g.call(document,null)});e=null}}}function a(g){d();if(c){g.call(document,null)}else{e.push(g)}return this
}daum.suggest.DOMReady=a})();(function($ds){var _defaultBox=null;var SuggestInstance=$ds.Instance=function(inputElementId,parentWrapperId,suggestDomain,suggestRequestUrl,proxyUrlOrCallbackName,isCallback){this.inputBox=jigu.$(inputElementId);if(!!this.inputBox===false){alert($ds.message.ERROR_NO_INPUTBOX);return false}this.wrapper=jigu.$(parentWrapperId);if(!!this.wrapper===false){alert($ds.message.ERROR_NO_PARENT_CONTAINER);return false}this.suggestDomain=suggestDomain;this.requestUrl=suggestRequestUrl;this.proxyUrlOrCallbackName=proxyUrlOrCallbackName;if(isCallback===true){this.callbackName=proxyUrlOrCallbackName}else{this.proxyUrl=proxyUrlOrCallbackName}this.initialize()};SuggestInstance.prototype={initialize:function(){this.isActivate=null;this.orientation=null;this.currentKeyword="";this.option={type:"base",limit:[10,3],isLimitMatch:true,customItemValueFunc:null,customGetStringFunc:null,requestString:"",focus:$ds.define.FocusPointType.DEFAULT,encode:$ds.define.EncodeType.UTF_IN_OUT,useCrossDomainStorage:false,EnableMySearchKeyword:false};
this.containerBox=null;this.inputBox.setAttribute("autocomplete","off");this.inputBox.setAttribute("spellcheck","false");this.keywordInputView=new $ds.view.KeywordInputView(this.inputBox);this.keywordInputView.setAlwaysWatching();this.dataModel=new $ds.model.DataModel({suggestDomain:this.suggestDomain,requestUrl:this.requestUrl,proxyUrl:this.proxyUrl,callbackName:this.callbackName,encode:this.option.encode,keyword:this.inputBox.value,requestString:this.option.requestString});if(jigu.Browser.iphone==true&&jigu.Browser.osversion.charAt(0)==="3"){jigu.addClassName(this.inputBox,"q_iphone")}$ds.define.FirstKeyword=this.inputBox.value||"";this._bindEvents()},ready:function(){if(!!this.containerBox==false){this._containerRender();this._createInstance();this._bindEvents()}},_containerRender:function(){this.containerBox=createContainer(this.wrapper,"suggestBox box_sub");this.baseBox=createContainer(this.containerBox,"baseBox bg")},_createInstance:function(){this.listModel=new $ds.model.ListModel({limit:this.option.limit,customGetStringFunc:this.option.customGetStringFunc});
this.boxView=new $ds.view.BoxView({container:this.containerBox,type:this.option.type,listModel:this.listModel,useCrossDomainStorage:this.useCrossDomainStorage,recentKeywordData:this.recentKeywordData,proxyUrlOrCallbackName:this.proxyUrlOrCallbackName});this.listView=new $ds.view.ListView({container:this.baseBox,limit:this.option.limit,isLimitMatch:this.option.isLimitMatch,customItemValueFunc:this.option.customItemValueFunc});this.footerView=new $ds.view.FooterView({container:this.baseBox,yellowClip:null});this.guideView=new $ds.view.GuideView({container:this.baseBox});if(this.option.type=="thumb"){this.imageView=new $ds.view.ImageView({container:this.containerBox,listModel:this.listModel})}},_bindEvents:function(){var self=this;this.keywordInputView.addListener({onFocusKeywordBox:function(ev){var isRecent=(self.option.type=="recent");var defaultValue=self.keywordInputView.getDefaultKeyword(),currentValue=self.keywordInputView.getValue();if(currentValue==""){if(isRecent){return self.requestRecent()
}else{self.dataModel.dispatchEvent("onEmptyKeyword")}}$ds.Service.hiddenAll();if(!!currentValue&&currentValue!=defaultValue){setTimeout(function(){self.request(ev.keyword)},50)}else{if($ds.Service.isEqual(self)==false){$ds.Service.setCurrentInstance(self)}else{self.visible()}}},onChangeKeyword:function(ev){self.request(ev.keyword);self.listView.positionType=$ds.define.ListPositionType.DEFAULT;self.keywordInputView.setDefaultKeyword(ev.keyword)},onEmptyKeyword:function(){self.dataModel.dispatchEvent("onEmptyKeyword")}});this._bindEvents=function(){var self=this;this.keywordInputView.addListener({onClickKeywordBox:function(ev){if($ds.Service.getCurrentInstance()==self){self.toggle()}else{$ds.Service.hiddenAll();$ds.Service.setCurrentInstance(self)}},onBlurKeywordBox:function(ev){},onBlankKeywordValue:function(){self.hidden()}});this.boxView.addListener({onShowList:function(ev){if(!ev.data){return}self.listView.render(ev.data,ev.isRecent);if(!ev.isRecent){self.listView.show()}if(self.option.limit[0]==0||self.option.limit[1]==0||!ev.more){self.footerView.render("nomore",ev.isRecent)
}else{self.footerView.render(null,ev.isRecent)}},onShowGuide:function(ev){switch(ev.type){case"UsingSuggest":self.guideView.render("USING");break;case"UseSuggest":self.guideView.render("USE");break;case"NoResult":self.listModel.set(null);self.hidden();return false;break}self.footerView.render("nomore")},onHiddenBox:function(ev){self.listModel.getChangeSort();self.listView.resetIndex();self.listView.resetPositionType()},onDifferntKeyword:function(ev){self.request(ev.keyword)}});this.listView.addListener({onShowListView:function(ev){},onHideHighlight:function(ev){self.keywordInputView.initDefaultKeyword();self.hidden()},onSelectItem:function(ev){self.boxView.renderType();if(self.option.type=="thumb"&&self.imageView){self.imageView.render(ev.index)}if(ev.action=="over"){self.keywordInputView.clear()}else{var selectedItem=self.listModel.getSelectedItem(ev.index);if(selectedItem){self.keywordInputView.setValue(selectedItem.string)}}},onSelectedItemClick:function(ev){self.keywordInputView.setValue(ev.string);
self.hidden();if(typeof self.option.beforeSubmit=="function"){self.option.beforeSubmit(self.option.form)}else{var func=eval(self.option.beforeSubmit);if(func){func(self.option.form)}}},onAddSelectedItem:function(ev){window.scrollTo(0,1);self.keywordInputView._keywordBox.value=ev.string}});this.footerView.addListener({onCloseSuggest:function(ev){window.scrollTo(0,1);self.hidden()},onDeleteRecent:function(ev){self.keywordInputView.blur();if(window.confirm($ds.message.CONFIRM_DEL_RECENT)){if(self.dataModelRecent){self.dataModelRecent.deleteData();self.dataModelRecent.setEmptyData();self.hidden()}}},onToggleRecent:function(ev){var _define=$ds.define;var value="";var el=jigu.Event.getElement(ev);var area=el.parentNode;var curValue=jigu.getCookie(_define.RecentCookieName)||_define.RecentCookieType.ON;if(curValue&&(curValue==_define.RecentCookieType.OFF)){value=_define.RecentCookieType.ON;el.innerHTML="\ucd5c\uadfc\uac80\uc0c9\uc5b4 \uc228\uae30\uae30";jigu.Element.show(jigu.getElementsByClassName(area,"deleteRecent")[0],"inline");
jigu.Element.show(jigu.getElementsByClassName(area,"bar")[0],"inline");self.listView.show();jigu.Element.show(self.listView.listContainer)}else{if(window.confirm($ds.message.CONFIRM_HIDE_RECENT)){value=_define.RecentCookieType.OFF;el.innerHTML="\ucd5c\uadfc\uac80\uc0c9\uc5b4 \ubcf4\uae30";jigu.Element.hide(jigu.getElementsByClassName(area,"deleteRecent")[0]);jigu.Element.hide(jigu.getElementsByClassName(area,"bar")[0]);jigu.Element.hide(self.listView.listContainer);jigu.Element.hide(self.boxView.container);self.listModel.set(null)}}if(curValue!=value){jigu.Element.addClassName(el,value);jigu.setCookie(_define.RecentCookieName,value,365000)}self.keywordInputView.blur()}});this.dataModel.addListener({onLoadComplete:function(ev){if(self.listView.isRecent&&self.keywordInputView.getValue()==""){return}var setData=$ds.model.Raw.set(ev.data,ev.route);self.listModel.set(setData);setData=null;if(ev.visible!="hidden"){self.visible()}},onReloadCache:function(ev){self.listModel.set(ev.data);self.visible()
},onSendData:function(ev){},onEmptyKeyword:function(ev){self.listModel.set(null);self.hidden();if(self.option.type=="recent"){self.requestRecent()}},onOverKeyword:function(ev){self.listModel.set(null);self.hidden()}});if(jigu.Browser.iphone){jigu.addEvent(window,"orientationchange",jigu.Function.bind(self.setOrientation,self))}}},setDefaultBox:function(){_defaultBox=this},setOption:function(key,value){this.option[key]=value;return this},setUseThumbnail:function(){this.option.type="thumb";return this},setUseCustomGetString:function(customGetStringFunc){this.option.customGetStringFunc=customGetStringFunc;return this},setUseCustomItemValue:function(customItemValueFunc){this.option.customItemValueFunc=customItemValueFunc;return this},setRequestString:function(requestString){if(!!this.dataModel){this.dataModel.setRequestString(requestString)}else{this.option.requestString=requestString}return this},setInputFocus:function(when){switch(when){case"load":this.option.focus=$ds.define.FocusPointType.LOAD;
break;case"write":this.option.focus=$ds.define.FocusPointType.WRITE;break;default:this.option.focus=$ds.define.FocusPointType.DEFAULT;break}return this},setRequestUrl:function(url){if(!!this.dataModel){this.dataModel.setRequestUrl(url)}else{this.requestUrl=url}return this},setBeforeSubmitFunc:function(funcName){this.option.beforeSubmit=funcName;return this},setForm:function(value){this.option.form=value;return this},setKeywordMaxByte:function(maxByte){$ds.define.KeywordMaxByte=maxByte;return this},setLimit:function(value){this.option.limit=value;return this},setLimitMatch:function(limitMatch){this.option.isLimitMatch=limitMatch;return this},getKeyword:function(){return this.inputBox.value},setEncodeKeyword:function(encode){if(this.dataModel){this.dataModel.setEncode(encode)}else{this.setOption("encode",encode)}return this},setEnableRecentKeyword:function(){$ds.define.EnableRecentKeyword=true;this.option.type="recent";return this},setRecentKeyword:function(keyword){$ds.define.RecentKeyword=keyword;
this.requestRecent(true);return this},setRecentKeywordData:function(data){this.dataModelRecent.setData(data);return this},_forceRecentKeywordData:function(data){if(data!=""){this._forceRecentKeywordDataOnly(data);this.dataModelRecent.showList()}},_forceRecentKeywordDataOnly:function(data){this.dataModelRecent.setData(data)},setDefineRecentKeywordKeyname:function(name){$ds.define.RecentKeywordKeyname=name;return this},getRecentKeywordKeyname:function(){return $ds.define.RecentKeywordKeyname},setDefineCrossDomainStorageIframeId:function(id){$ds.define.setDefineCrossDomainStorageIframeId=id;return this},setUseCrossDomainStorage:function(){this.useCrossDomainStorage=true;return this},setEnableMyKeyword:function(bool){$ds.define.EnableMyKeyword=bool;return this},_instanceReady:function(){if(!!this.containerBox==false){this.ready()}},requestRecent:function(isShow){if(!this.dataModelRecent){this.ready();this.dataModelRecent=new $ds.model.DataModelRecent({useCrossDomainStorage:this.useCrossDomainStorage,recentKeywordData:this.recentKeywordData,proxyUrlOrCallbackName:this.proxyUrlOrCallbackName,boxView:this.boxView})
}this.dataModelRecent.request(isShow)},request:function(keyword,visible){this._instanceReady();this.dataModel.get(keyword,visible)},reRequest:function(){this.request(this.getKeyword())},hidden:function(){if(!!this.containerBox){this.keywordInputView.clear();this.boxView.hidden();if(jigu.Browser.android){jigu.removeClassName(document.body,"noanchor");jigu.removeClassName(this.containerBox,"anchor")}}},visible:function(yellowClipState){this._instanceReady();this.boxView.visible(yellowClipState);if(jigu.Browser.android){jigu.addClassName(document.body,"noanchor");jigu.addClassName(this.containerBox,"anchor")}if(this.getOrientation()=="wide_frame"){jigu.addClassName(this.wrapper,"wide")}else{if(jigu.hasClassName(this.wrapper,"wide")){jigu.removeClassName(this.wrapper,"wide")}}},getOrientation:function(){return this.orientation||$ds.define.FrameOrientation[window.orientation]},setOrientation:function(){this.orientation=$ds.define.FrameOrientation[window.orientation];if(this.boxView.isVisible()){this.visible()
}},toggle:function(){if(this.boxView.isVisible()){this.hidden()}else{this.visible()}}};var createContainer=function(parentContainer,className){var container=document.createElement("div");container.className=className;parentContainer.appendChild(container);return container}})(daum.suggest);(function(b){var a=b.Service=function(){var e=[],g=null;var i=null,d=null;var c=(jigu.getCookie("suggest")=="off")?false:true;var f=null;var h={init:function(){jigu.addEvent(document,"keydown",jigu.Function.bind(this.keydown,this));jigu.addEvent(document,"mousedown",jigu.Function.bind(this.mousedown,this));return this},add:function(k,m,p,o,l,n){if(!!o===false){alert(b.message.ERROR_NO_REQUEST_URL);return false}var j=new b.Instance(k,m,p,o,l,n);e.push(j);return j},remove:function(){},hiddenAll:function(){for(var j=e.length-1;j>=0;--j){e[j].hidden()}},hiddenOther:function(j){for(var k=e.length-1;k>=0;--k){if(j!=e[k]){e[k].hidden()}}},setCurrentInstance:function(j){g=j},getCurrentInstance:function(){return g
},isEqual:function(k){var j;if(g!=null&&g!=k){j=false}else{j=true}return j},getInstanceList:function(){return e},findInputBox:function(k){for(var j=e.length-1;j>=0;--j){if(e[j].inputBox==k){return true}}return false},keydown:function(o){var n=jigu.getElement(o);var q=n.nodeName;var m=o.keyCode;var k=b.define.Keyboard;var p=this.findInputBox(n);var j=["BACKSPACE","TAB","ENTER","SHIFT","CTRL","ALT","SPACEBAR","HOME","END","PAGEDOWN","PAGEUP","CAPSLOOK","LEFT","RIGHT","UP","DOWN","MAC_COMMAND"];for(var l=j.length-1;l>=0;--l){if(k[j[l]]==m){return true}}if(o.ctrlKey||o.metaKey){return true}if(n&&(q=="INPUT"||q=="SELECT"||q=="TEXTAREA")){return true}if(f==null){for(var l=e.length-1;l>=0;--l){if(e[l].option.focus==b.define.FocusPointType.LOAD||e[l].option.focus==b.define.FocusPointType.WRITE){f=e[l];break}}}if(f){f.keywordInputView.clearValue();f.keywordInputView.setFocus()}},mousedown:function(j){this.hiddenAll()}};return h}()})(daum.suggest);
function getDummy() {
    return new Date().getTime() + Math.ceil(Math.random() * 2147483647);
}

// bug 2012/01/04
daum.Browser.ie = daum.Browser.iemobile;
if (daum.Browser.iemobile) {
    daum.Element.getElementsByClassName = function(el, cname) {
        // native code 가 있을 경우
        //if(document.getElementsByClassName.toString().indexOf('native')>0){
        //  return daum.$A(el.getElementsByClassName(cname));
        //}
        /*
         * typeof document.getElementsByClassName value
         * function : ie6, ie7, ie8, ie9
         * object : windows phone OS7.5
         */
        if (typeof document.getElementsByClassName == 'object') {
            return daum.$A(el.getElementsByClassName(cname));
        }
        // sizzle selector를 이용
        var is = el == document || el == document.body || el == window;
        if (is || el.id) {
            return daum.$$((is ? '' : '#' + el.id + ' ') + '.' + daum.String.trim(cname).replace(/\s+/g, '.'));
        }
        // 많이 힘든 경우
        for (var nodes = daum.$(el).getElementsByTagName("*"), element = [], i = 0, l = nodes.length; i < l; i += 1) {
            if (daum.Element.hasClassName(nodes[i], cname)) {
                element.push(nodes[i]);
            }
        }
        return (element.length > 0) ? element : [];
    }
}

(function() {
    var sRankEl = $('searchRankArea');
    var sRankContainer = sRankEl.getElementsByTagName('UL')[0];
    var sRankTab = $('searchRankTab');
    var sRankTitle = $('searchRankTitle').getElementsByTagName('A')[0];
    var sRankJson = ['issueRank', 'socialRank, twitterRank'];
    var current = 0;
    var nilTag = 't__nil_searchrank=';
    
    var curTab = (sRankContainer.className) ? sRankContainer.className + 'Rank' : 'issueRank';
    
    var tabList = {
        'issueRank': '실시간이슈',
        'socialRank': '소셜픽',
        'twitterRank': '트위터인물'
    };
    var sRankDisplay = function(mode, idx) {
        var item = sRankContainer.getElementsByTagName('LI');
        for (var i = 0, il = item.length; i < il; i++) {
            if (mode == 'open') {
                item[i].style.display = 'block';
            } else {
                if (current == i) {
                    item[i].style.display = 'block';
                } else {
                    item[i].style.display = 'none';
                }
            }
        }
        sRankTitle.innerHTML = tabList[curTab];
    };
    
    sRankContainer.innerHTML = DMT.json[curTab][0];
    
    window.setInterval(function() {
        if (sRankEl.className == 'open')
            return false;
        sRankDisplay('close', current);
        current = (current == 9) ? 0 : current + 1;
    }, 3000);
    daum.addEvent($('rankOpen'), 'click', function(e) {
        var onOff = 'open';
        if (sRankEl.className == 'close') {
            sRankDisplay('open', current);
            sRankEl.className = 'open';
        } else {
            current = (current == 0) ? 9 : current - 1;
            sRankDisplay('close', current);
            sRankEl.className = 'close';
            onOff = 'close';
        }
        this.sendAnalURL = (typeof tiaraManager === 'object' && typeof tiaraManager.sendAnalURL === 'function') ? tiaraManager.sendAnalURL : function() {
        };
        this.sendAnalURL(nilTag + onOff);
        daum.Event.stopEvent(e);
        return false;
    });
    daum.addEvent($('rankClose'), 'click', function(e) {
        current = (current == 0) ? 9 : current - 1;
        sRankDisplay('close', current);
        sRankEl.className = 'close';
        window.scrollTo(0, 1);
        this.sendAnalURL = (typeof tiaraManager === 'object' && typeof tiaraManager.sendAnalURL === 'function') ? tiaraManager.sendAnalURL : function() {
        };
        this.sendAnalURL(nilTag + 'close');
        daum.Event.stopEvent(e);
        return false;
    });
    daum.addEvent($('issueTab'), 'click', function(e) {
        if (sRankContainer.className == 'issue')
            return false;
        this.sendAnalURL = (typeof tiaraManager === 'object' && typeof tiaraManager.sendAnalURL === 'function') ? tiaraManager.sendAnalURL : function() {
        };
        this.sendAnalURL(nilTag + 'issue_tab');
        sRankContainer.innerHTML = DMT.json['issueRank'][0];
        current = 1;
        curTab = 'issueRank';
        sRankContainer.className = 'issue';
        sRankTab.className = 'issue';
        sRankTitle.innerHTML = tabList[curTab];
        daum.Event.preventDefault(e);
        daum.Event.stopPropagation(e);
    });
    daum.addEvent($('socialTab'), 'click', function(e) {
        if (sRankContainer.className == 'social')
            return false;
        this.sendAnalURL = (typeof tiaraManager === 'object' && typeof tiaraManager.sendAnalURL === 'function') ? tiaraManager.sendAnalURL : function() {
        };
        this.sendAnalURL(nilTag + 'social_tab');
        sRankContainer.innerHTML = DMT.json['socialRank'][0];
        current = 1;
        curTab = 'socialRank';
        sRankContainer.className = 'social';
        sRankTab.className = 'social';
        sRankTitle.innerHTML = tabList[curTab];
        daum.Event.preventDefault(e);
        daum.Event.stopPropagation(e);
    });
    daum.addEvent($('twitterTab'), 'click', function(e) {
        if (sRankContainer.className == 'twitter')
            return false;
        this.sendAnalURL = (typeof tiaraManager === 'object' && typeof tiaraManager.sendAnalURL === 'function') ? tiaraManager.sendAnalURL : function() {
        };
        this.sendAnalURL(nilTag + 'twitter_tab');
        sRankContainer.innerHTML = DMT.json['twitterRank'][0];
        current = 1;
        curTab = 'twitterRank';
        sRankContainer.className = 'twitter';
        sRankTab.className = 'twitter';
        sRankTitle.innerHTML = tabList[curTab];
        daum.Event.preventDefault(e);
        daum.Event.stopPropagation(e);
    });
})();

/*--- search/suggest ---*/
if (!DMT.isApp) { // app이 아닌 경우
    (function() {
        var evtAction;
        var chkKeyValue = function() {
            $('daumBtnClear').style.display = ($('q').value == '') ? 'none' : 'block';
        };
        var submitSearch = function(nilTag, formObj, eAction) {
            var nil = (typeof nilTag == 'string') ? nilTag : 'btn';
            $('nilSearch').value = nil;
            if (daum.Browser.iphone || daum.Browser.ipad || daum.Browser.ipod || daum.Browser.android) {
                if (($('q').value == '') && ($('q').style.backgroundImage) && (eAction)) {
                    document.location.href = eAction;
                } else {
                    $('search').submit();
                }
            } else {
                $('search').submit();
            }
        };
        window.clearKeyValue = function(e) {
            $('daumBtnClear').style.display = 'none';
            $('q').value = '';
            if ($('header').className == 'search')
                $('q').focus();
        };
        daum.suggest.Service.init();
        window.suggestInstance = daum.suggest.Service.add(
        "q", 
        "daumSuggestWrap", 
        "http://sug.m.search.daum.net", 
        "/top_mbsuggest", 
        "suggestInstance.dataModel.forceLoadComplete", 
        true).
        setEncodeKeyword("utf_in_out").
        setBeforeSubmitFunc(function(form) {
            if (window.suggestInstance.listView.isRecent) {
                submitSearch('reckwd', form);
            } else {
                submitSearch('suggest', form);
            }
        }).
        setLimit([10, 0]).
        setForm(document.search).
        setEnableMyKeyword(true).
        setDefineCrossDomainStorageIframeId('tiara_anal').
        setUseCrossDomainStorage();
        //init 시점 이후 호출도 가능
        if (DMT.isRecentKeyword)
            window.suggestInstance.setEnableRecentKeyword(true);
        
        daum.addEvent(window.suggestInstance.inputBox, 'focus', function() {
            setTimeout(function() {
                if (window.pageYOffset == 0) {
                    window.scrollTo(0, 1);
                }
            }, 100);
            chkKeyValue();
        });
        daum.addEvent(window.suggestInstance.inputBox, 'keyup', function() {
            chkKeyValue();
        });
        daum.addEvent($("search"), 'submit', function(e) {
            submitSearch('btn', this, evtAction);
            daum.Event.stopEvent(e);
        });
    })();
}

(function() {
    /**
     * dongtl > mobile > 사이트 전체 보기 모듈
     *      dependency : jigu-mobile
     */
    // TODO logging
    var SiteMap = function() {
        var relatedServices = [], 
        //     daumHead = Sizzle('#daumHead')[0],
        daumHead = Sizzle('#svcNavi')[0], 
        daumHead2 = Sizzle('#sitemap_wrap')[0], 
        CATEGORIES_URL = 'http://m1.daumcdn.net/top-sc/script/sitequicklink_v2.js', 
        OPEN_CLASS = 'sitemap_open', 
        $E = daum.Element;
        
        
        var SiteMapView = {
            didRenderComplete: false,
            
            show: function() {
                $E.addClassName(daumHead, OPEN_CLASS);
                $E.addClassName(daumHead2, OPEN_CLASS);
            },
            hide: function() {
                $E.removeClassName(daumHead, OPEN_CLASS);
                $E.removeClassName(daumHead2, OPEN_CLASS);
            },
            visible: function() {
                return $E.hasClassName(daumHead, OPEN_CLASS);
            },
            /**
             * 서버로부터 넘겨 받은 데이터를 이용하여 화면을 그린다.
             */
            render: function() {
                if (this.didRenderComplete) {
                    return;
                }
                var self = this;
                queryData(function(data) {
                    self.renderFrame();
                    self.renderRelatedService(relatedServices);
                    self.renderCategories(data.categories);
                    self.renderMobileSpecial(data.mobile);
                    self.didRenderComplete = true;
                });
            },
            renderFrame: function() {
                var siteMapElem = Sizzle("#sitemap_wrap")[0]; //
                siteMapElem.innerHTML = TMPL_FRAME;
                
                var closeBtn = Sizzle(".close_links button")[0]
                daum.Event.addEvent(closeBtn, 'click', function(e) {
                    SiteMapView.hide();
                    window.scrollTo(0, 1);
                    daum.Event.preventDefault(e);
                });
            },
            // TODO 관련 서비스가 없는 경우가 생길 수 있나?
            renderRelatedService: function(items) {
                var elem = Sizzle(".related_links")[0], 
                listElem = Sizzle(".list_related")[0], 
                sbuf = [];
                
                if (items.length > 0) {
                    for (var i = 0; i < items.length; i++) {
                        sbuf.push(sprintf(TMPL_RELATED_SERVICE, items[i].url, items[i].name));
                    }
                    listElem.innerHTML = sbuf.join('');
                    $E.show(elem);
                } else {
                    $E.hide(elem);
                }
            },
            renderCategories: function(categories) {
                var elem = Sizzle(".inner_links")[0], 
                sbuf = [];
                
                var frag = document.createDocumentFragment();
                for (var i = 0; i < categories.length; i++) {
                    var categoryName = categories[i].categoryName, 
                    items = categories[i].item;
                    var div = document.createElement('div');
                    div.innerHTML = sprintf(TMPL_CATEGORY, categoryName);
                    frag.appendChild(div);
                    
                    sbuf = [];
                    var listElem = Sizzle(".list_sitemap", div)[0];
                    for (var j = 0; j < items.length; j++) {
                        var item = items[j];
                        var tmpl = (item.isMain) ? TMPL_MAIN_ITEM : TMPL_ITEM;
                        sbuf.push(sprintf(tmpl, item.type, item.url, item.name, 
                        item.isNew ? TMPL_NEW_ICON : ''));
                    }
                    listElem.innerHTML = sbuf.join('');
                }
                elem.appendChild(frag);
                
                var site_list = $$('.sort_ganada li a');
                var string = daum.Browser.getCookie("DMT_recent") || "";
                var arr = [];
                if (string) {
                    arr = string.split('|');
                }
                
                site_list.each(function(item) {
                    var sName = item.parentNode.className;
                    daum.Event.addEvent(item, 'click', function(e) {
                        var len = arr.length;
                        for (var i = 0; i != len; i++) {
                            if (arr[i] == sName) {
                                arr = arr.slice(0, i).concat(arr.slice(i + 1, len + 1));
                                len = arr.length;
                                break;
                            }
                        }
                        if (len >= 4) {
                            arr = arr.slice(0, arr.length - 1);
                        }
                        arr.splice(0, 0, sName)
                        var d = new Date();
                        d.setDate(d.getDate() + 365);
                        document.cookie = "DMT_recent=" + escape(arr.join('|')) + "; path=/; domain=" + window.location.hostname + "; expires=" + d.toGMTString() + ";";
                    });
                });
            },
            renderMobileSpecial: function(mobileData) {
                var listElem = Sizzle(".list_etc")[0], 
                items = mobileData.item, 
                sbuf = [];
                for (var i = 0; i < items.length; i++) {
                    sbuf.push(sprintf(TMPL_MOBILE_ITEM, items[i].type, items[i].url, items[i].name));
                }
                listElem.innerHTML = sbuf.join('');
            }
        };
        // http://www.nczonline.net/blog/2011/10/11/simple-maintainable-templating-with-javascript/
        function sprintf(text) {
            var i = 1, args = arguments;
            return text.replace(/%s/g, function(pattern) {
                return (i < args.length) ? args[i++] : "";
            });
        }
        
        function bindEvents() {
            //    var siteMapBtn = Sizzle(".total_view")[0];
            var siteMapBtn = Sizzle(".sitemap")[0]; //
            daum.Event.addEvent(siteMapBtn, 'click', function(e) {
                onSiteMapButtonPressed();
                daum.Event.preventDefault(e);
            });
            siteMapBtn.onclick = null; // DELETEME testing code
        }
        function onSiteMapButtonPressed() {
            if (SiteMapView.visible()) {
                SiteMapView.hide();
            } else {
                siteMapButtonClickLogging();
                SiteMapView.render();
                SiteMapView.show();
            }
        }
        function siteMapButtonClickLogging() {
            var beacon = new Image();
            beacon.src = 'http://tiara.daum.net/tiara.front/front/click/?referer=http%3A%2F%2Fdummy.daum.net%2F&url=http://dummy.daum.net/?t__nil_mob_minidaum=servicemap';
        }

        // transports ...
        
        var onDataLoaded = function() {
        };
        var cachedData = null;
        /**
         * 서버로부터 사이트 전체보기 데이터를 요청한다.
         * JSONP 방식 이용. 일정 시간안에 응답이 없을 경우 retry 한다.
         */
        function queryData(callback) {
            onDataLoaded = function(categories) {
                if (!cachedData) {
                    cachedData = organizeData(categories);
                }
                callback(cachedData);
            };
            daum.load(CATEGORIES_URL, null, {charset: "utf-8"});
            // fast retry
            setTimeout(function() {
                if (!cachedData) {
                    queryData(callback);
                }
            }, 1000);
        }
        function organizeData(categories) {
            var result = {
                categories: [],
                mobile: null,
                ad: null
            };
            for (var i = 0; i < categories.length; i++) {
                if (categories[i].categoryName === 'Mobile') {
                    result.mobile = categories[i];
                } else if (categories[i].categoryName === 'Ad') {
                    result.ad = categories[i];
                } else {
                    result.categories.push(categories[i]);
                }
            }
            return result;
        }


        // public interfaces ...
        return {
            /**
             * SiteMap 모듈의 초기화
             */
            
            init: function() {
                bindEvents();
            },

            /**
             * 관련서비스 등록 API
             * SiteMap.addRelatedService(name, url)
             * usage :
             *      SiteMap.addRelatedService('부동산', 'http://m.realestate.daum.net/');
             *      SiteMap.addRelatedService('환율', 'http://m.xxx.daum.net/');
             */
            addRelatedService: function(name, url) {
                relatedServices.push({'name': name,'url': url});
            },

            /**
             * 서버로부터 사이트맵 데이터(JSONP)를 불러온 이후 호출되는 callback function
             */
            onDataLoaded: function(data) {
                onDataLoaded(data);
            }
        };
    }();

    // exports
    window.SiteMap = SiteMap;

    // will be hoisted
    var TMPL_FRAME = '' + 
    '<h2 class="screen_out">서비스 전체보기</h2>' + 
    '<div class="inner">' + 
    '    <div class="related_links">' + 
    '        <h3 class="tit_related">최근 이용한 서비스</h3>' + 
    '        <ul class="list_related">' + 
    '            <!-- TMPL_RELATED_SERVICE -->' + 
    '        </ul>' + 
    '    </div>' + 
    '    <div class="sitemap_links">' + 
    '        <h3 class="screen_out">가나다순 정렬</h3>' + 
    '        <!-- 주요서비스일 경우, 링크 안이 span대신 strong태그 사용 -->' + 
    '        <div class="inner_links">' + 
    '            <!-- TMPL_CATEGORY -->' + 
    '        </div>' + 
    '    </div>' + 
    '    <div class="etc_links">' + 
    '        <h3 class="screen_out">기타 서비스</h3>' + 
    '        <ul class="list_etc">' + 
    '        </ul>' + 
    '    </div>' + 
    '    <div class="close_links">' + 
    '        <button type="button" class="btn_close">' + 
    '            <span class="ico_gnbcomm ico_close"></span><span class="txt">닫기</span>' + 
    '        </button>' + 
    '    </div>' + 
    '</div>' /* +
            '<span class="blank"></span>'*/, 
    TMPL_RELATED_SERVICE = '<li><a href="%s" class="link">%s</a></li>', 
    TMPL_CATEGORY = '' + 
    '<div class="sort_ganada">' + 
    '    <strong class="tit">%s</strong>' + 
    '    <ul class="list_sitemap">' + 
    '        <!-- TMPL_ITEM -->' + 
    '    </ul>' + 
    '</div>', 
    TMPL_ITEM = '<li class="%s"><a href="%s" class="link"><span class="txt">%s</span>%s</a></li>', 
    // 주요서비스 강조시에 사용할 template
    TMPL_MAIN_ITEM = '<li class="%s"><a href="%s" class="link"><strong class="txt">%s</strong>%s</a></li>', 
    TMPL_NEW_ICON = '<span class="ico_gnbcomm ico_new">(신규)</span>', 
    TMPL_MOBILE_ITEM = '<li class="%s"><a href="%s" class="link"><span class="txt">%s</span></a></li>';
})();

function setSlidePanels () {
    var homeBtn = {};
    homeBtn.news = {
        news: {title:'뉴스홈', url:'http://m.media.daum.net/media/?t__nil_mnews=home'},
        sports: {title:'스포츠홈', url:'http://m.sports.daum.net/sports/?t__nil_msports=home'},
        enter: {title:'연예홈', url:'http://m.media.daum.net/media/entertain/?t__nil_menter=home'}
    };
    homeBtn.contents = {
        story: {title:'검색홈', url:'http://issue.search.daum.net/issue?t__nil_live=story_home'},
        agora: {title:'아고라홈', url:'http://m.agora.daum.net/?t__nil_live=agora_home'},
        miznet: {title:'미즈넷홈', url:'http://m.miznet.daum.net/?t__nil_live=miznet_home'},
        view: {title:'view홈', url:'http://m.view.daum.net/?t__nil_live=view_home'}  
    };
    homeBtn.fun = {
        game: {title:'게임홈', url:'http://m.sgame.daum.net/?t__nil_fun=game_home'},
        cartoon: {title:'만화홈', url:'http://m.cartoon.media.daum.net/?t__nil_fun=cartoon_home'},
        movie: {title:'영화홈', url:'http://m.movie.daum.net/?t__nil_fun=movie_home'},
        music: {title:'뮤직홈', url:'http://m.music.daum.net/?t__nil_fun=music_home'},
        tvpot: {title:'tv팟홈', url:'http://m.tvpot.daum.net/?t__nil_fun=tvpot_home'},
        telzone:{title:'텔존홈', url:'http://m.telzone.daum.net/?t__nil_fun=telzone_home'}
    };
    homeBtn.issue = {
        shop: {title: '쇼핑하우홈',url: 'http://m.shopping.daum.net/?t__nil_shopping=shop_home'},
        Msale: {title:'쇼핑하우홈', url:'http://m.shopping.daum.net/?t__nil_shopping=Msale_home'},
        coupon: {title:'소셜쇼핑홈', url:'http://m.social.daum.net/?t__nil_shopping=coupon_home'}
    };

    function setPageNumber (el, index, length) {
        if (slide.isTransformEnabled || slide.isSwipeEnabled) {
            for (var i = 0; i < length; i++) {
                if (el.childNodes[i].tagName == 'STRONG') {
                    var nEl = document.createElement('SPAN');
                    el.replaceChild(nEl, el.childNodes[i]);
                }
            }
            var cEl = document.createElement('STRONG');
            el.replaceChild(cEl, el.childNodes[index]);
        } else {
            el.innerHTML = ''+ (index + 1);
        }
    }
    
    function setCurrentTab (area, home, btn, type) {
        area.className = type;
        home.href = btn[type].url;
        home.innerHTML = btn[type].title;
    }

    function changeData (data) {
        var st = data.replaceAll("</a>","</div></a>"),
            temps = st.split('>');

        for (var i=0,len=temps.length;i<len;i++) {
            if(temps[i].indexOf('<a') > -1) {
                temps[i+1] = '<div>' + temps[i+1];
            }
        }
        return temps.join('>');
    }

    function buildSlides (data) {
        var arr = [],
            dataList = '';
        for (var item in data) {
            for (var i=0, len=data[item].length; i< len; i++) {
                if (slide.isTransformEnabled) {
                    dataList = changeData(data[item][i][0]);
                } else {
                    dataList = data[item][i][0];
                }
                arr.push({
                    type: item, 
                    dataList: dataList,
                    index: arr.length,
                    toHTML: function () {
                        return this.dataList;
                    }
                });
            }
        }
        return arr;
    }

    function createSwipe(elStr, data, slideName, tabs) {
        var wrapper = $(elStr);
        var ds = new slide.InfiniteDataSource(buildSlides(data));
        var sl = new slide.Slide(wrapper, ds, {
            containerId: slideName,
            duration: 300,
            PanelClass: slide.UlPanel
        });
        if (slide.isTransformEnabled || slide.isSwipeEnabled) {
            var pagenum = $$("#"+slideName+"Paging .paging_swipe")[0]; 
        } else {
        	var pagenum = $$("#"+slideName+"Paging .page_no")[0]; 
        }
        var area = $(slideName+"Area");
        var home = $(slideName+"Home");

        function setPagingAndTap () {
            ds.queryCurrent(function (data) {
            	setPageNumber(pagenum, data.index, ds.data.length);
                setCurrentTab(area, home, homeBtn[slideName], data.type);
            });
        }
        setPagingAndTap();

        if (tabs && tabs.length > 0) {
            for(var i=0,len = tabs.length;i<len;i++) { 
                (function (id, index) {
                    daum.addEvent(id, "click", function(e){
			            ds.setCurrentIndex(index);
                        sl.show();
                        setPagingAndTap();
                        daum.Event.stopEvent(e);
			        });
                })(tabs[i].id, tabs[i].index);
            }
        }

        daum.addEvent(slideName + "_prev", "click", function(){
            sl.prev();
        });
        daum.addEvent(slideName + "_next", "click", function(){
            sl.next();
        });

        var ob = null;
        sl.on("endDrag", function(session){
            if (session.isSwipe() || session.isFlick()) {
                daum.Event.stopObserving(ob);
                ob = daum.addEvent(wrapper, 'click', function preventClick(e) {
                    daum.Event.stopEvent(e);
                });
            }
        });
        sl.on("next",function(){setPagingAndTap();daum.Event.stopObserving(ob);});
        sl.on("prev",function(){setPagingAndTap();daum.Event.stopObserving(ob);});
        sl.on("cancel",function(){daum.Event.stopObserving(ob);});

        return sl;
    }

    var mediaData = {};
    mediaData.news = DMT.json.news;
    mediaData.sports = DMT.json.sports;
    mediaData.enter = DMT.json.enter;
    var test = createSwipe("newsContents", mediaData, "news", [
        {id:"newsTitle", index: 0},
        {id:"sportsTitle", index: 4},
        {id:"enterTitle", index: 5}
    ]);

    var contentData = {};
    contentData.story = DMT.json.story;
    contentData.agora = DMT.json.agora;
    contentData.miznet = DMT.json.miznet;
    contentData.view = DMT.json.view;
    createSwipe("contentsWrap", contentData, "contents", [
        {id:"hotTitle", index: 0},
        {id:"agoraTitle", index: 2},
        {id:"miznetTitle", index: 3},
        {id:"viewTitle", index: 4}
    ]);

    var funData = {};
    funData.game = DMT.json.game;
    funData.cartoon = DMT.json.cartoon;
    funData.movie = DMT.json.movie;
    funData.music = DMT.json.music;
    funData.tvpot = DMT.json.tvpot;
    funData.telzone = DMT.json.telzone;
    var funDataArr = [];
    if($("gameTitle")) {
    	funDataArr.push({id:"gameTitle", index: 0});
	}
    funDataArr.push({id:"comicTitle", index: 1});
    funDataArr.push({id:"movieTitle", index: 2});
    funDataArr.push({id:"musicTitle", index: 3});
    funDataArr.push({id:"tvpotTitle", index: 4});
    funDataArr.push({id:"telzoneTitle", index: 5});
    createSwipe("funContents", funData, "fun", funDataArr);

    var issueData = {};
    issueData.shop = DMT.json.shop;
    issueData.Msale = DMT.json.Msale;
    issueData.coupon = DMT.json.coupon;
    createSwipe("issueContents", issueData, "issue", [
        {id:"shopTitle", index: 0},
        {id:"saleTitle", index: 2},
        {id:"couponTitle", index: 4}
    ]);

    return test;
}