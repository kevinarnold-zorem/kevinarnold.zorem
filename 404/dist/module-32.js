(self.webpackChunk_19h47_rider404=self.webpackChunk_19h47_rider404||[]).push([[191],{1506:t=>{t.exports=function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}},9754:t=>{function e(n){return t.exports=e=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},e(n)}t.exports=e},2205:(t,e,n)=>{var r=n(9489);t.exports=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&r(t,e)}},8585:(t,e,n)=>{var r=n(8),o=n(1506);t.exports=function(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?o(t):e}},9489:t=>{function e(n,r){return t.exports=e=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},e(n,r)}t.exports=e},8905:(t,e,n)=>{"use strict";n.r(e),n.d(e,{default:()=>d}),n(2419);var r=n(4575),o=n.n(r),i=n(3913),c=n.n(i),u=n(2205),a=n.n(u),s=n(8585),l=n.n(s),p=n(9754),f=n.n(p);const d=function(t){a()(i,t);var e,n,r=(e=i,n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}(),function(){var t,r=f()(e);if(n){var o=f()(this).constructor;t=Reflect.construct(r,arguments,o)}else t=r.apply(this,arguments);return l()(this,t)});function i(t){var e;return o()(this,i),(e=r.call(this,t)).tag=null,e.player=null,e.events={click:{button:"close"}},e}return c()(i,[{key:"init",value:function(){var t,e;this.videoId=this.el.getAttribute("data-video-id"),this.control=this.el.getAttribute("data-video-control"),t=document.createElement("script"),e=document.getElementsByTagName("script")[0],t.src="https://www.youtube.com/iframe_api",e.parentNode.insertBefore(t,e),this.initEvents()}},{key:"initEvents",value:function(){var t=this;window.onYouTubeIframeAPIReady=function(){t.player=new YT.Player(t.$("player")[0],{height:"360",width:"640",videoId:t.videoId})},document.addEventListener("Video.open",(function(e){var n=e.detail;t.control===n.id&&t.open()}))}},{key:"close",value:function(){this.el.classList.remove("is-active"),this.player.stopVideo(),this.call("start",!1,"Scroll","main"),document.dispatchEvent(new Event("Modal.close"))}},{key:"open",value:function(){this.el.classList.add("is-active"),this.player.playVideo(),this.call("stop",!1,"Scroll","main"),document.dispatchEvent(new Event("Modal.open"))}}]),i}(n(5110).b)},7065:(t,e,n)=>{"use strict";var r=n(3099),o=n(111),i=[].slice,c={},u=function(t,e,n){if(!(e in c)){for(var r=[],o=0;o<e;o++)r[o]="a["+o+"]";c[e]=Function("C,a","return new C("+r.join(",")+")")}return c[e](t,n)};t.exports=Function.bind||function(t){var e=r(this),n=i.call(arguments,1),c=function(){var r=n.concat(i.call(arguments));return this instanceof c?u(e,r.length,r):e.apply(t,r)};return o(e.prototype)&&(c.prototype=e.prototype),c}},2419:(t,e,n)=>{var r=n(2109),o=n(5005),i=n(3099),c=n(9670),u=n(111),a=n(30),s=n(7065),l=n(7293),p=o("Reflect","construct"),f=l((function(){function t(){}return!(p((function(){}),[],t)instanceof t)})),d=!l((function(){p((function(){}))})),h=f||d;r({target:"Reflect",stat:!0,forced:h,sham:h},{construct:function(t,e){i(t),c(e);var n=arguments.length<3?t:i(arguments[2]);if(d&&!f)return p(t,e,n);if(t==n){switch(e.length){case 0:return new t;case 1:return new t(e[0]);case 2:return new t(e[0],e[1]);case 3:return new t(e[0],e[1],e[2]);case 4:return new t(e[0],e[1],e[2],e[3])}var r=[null];return r.push.apply(r,e),new(s.apply(t,r))}var o=n.prototype,l=a(u(o)?o:Object.prototype),h=Function.apply.call(t,l,e);return u(h)?h:l}})}}]);