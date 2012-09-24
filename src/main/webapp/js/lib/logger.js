(function(){if(document.documentElement.getAttribute("debug")==="true"){document.body.style.marginTop="150px";
var a=document.createElement("div");a.style.cssText="position:absolute;top:10px;left:10px; width: 300px; height: 100px; border: solid 1px red; background: #000; color: #0f0; z-index: 100; overflow: hidden; font-size: 10px;";
document.body.appendChild(a);var b=1;function c(d){a.innerHTML=b+"> "+d+"<br>"+a.innerHTML;b++}window.log=c
}else{window.log=function(){}}})();