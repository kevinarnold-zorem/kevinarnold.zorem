(self.webpackChunk_19h47_rider404=self.webpackChunk_19h47_rider404||[]).push([[313],{1506:t=>{t.exports=function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}},9754:t=>{function e(n){return t.exports=e=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},e(n)}t.exports=e},2205:(t,e,n)=>{var r=n(9489);t.exports=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&r(t,e)}},8585:(t,e,n)=>{var r=n(8),o=n(1506);t.exports=function(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?o(t):e}},9489:t=>{function e(n,r){return t.exports=e=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},e(n,r)}t.exports=e},9494:(t,e,n)=>{"use strict";n.r(e),n.d(e,{default:()=>w}),n(2419);var r=n(319),o=n.n(r),i=n(4575),s=n.n(i),u=n(3913),c=n.n(u),a=n(1506),l=n.n(a),p=n(2205),f=n.n(p),h=n(8585),v=n.n(h),y=n(9754),d=n.n(y),m=(n(1249),n(4747),n(5069),n(5110)),g=n(6358),b=n(4818);var w=function(t){f()(i,t);var e,n,r=(e=i,n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}(),function(){var t,r=d()(e);if(n){var o=d()(this).constructor;t=Reflect.construct(r,arguments,o)}else t=r.apply(this,arguments);return v()(this,t)});function i(t){var e;return s()(this,i),(e=r.call(this,t)).isOpen=b.Rm.body.classList.contains("Navigation--is-open"),e.timeline=g.p8.timeline({paused:!0,onReverseComplete:function(){document.dispatchEvent(new Event("Navigation.close")),b.Rm.body.classList.remove("Navigation--is-open"),e.call("start",!1,"Scroll","main")}}),e.close=e.close.bind(l()(e)),e}return c()(i,[{key:"init",value:function(){this.items=o()(this.el.querySelectorAll(".js-item")),this.$footer=this.el.querySelector(".js-footer"),this.$video=this.el.querySelector(".js-video"),this.timeline.fromTo(this.$video,{autoAlpha:0,ease:"power4.inOut",duration:.5},{autoAlpha:1}),this.timeline.fromTo(this.items.map((function(t){return t.children})),{autoAlpha:0,y:100,duration:.01},{autoAlpha:1,y:0,stagger:.05},"-=0.5"),this.timeline.fromTo(this.$footer,{autoAlpha:0,ease:"power4.inOut",duration:.1},{autoAlpha:1},"-=0.5"),this.buttons=document.querySelectorAll(".js-menu-button")||[],this.initEvents()}},{key:"initEvents",value:function(){var t=this;o()(this.buttons).forEach((function(e){e.addEventListener("click",(function(){return t.toggle()}))})),document.onkeydown=function(e){27===e.keyCode&&t.close()}}},{key:"toggle",value:function(){return this.isOpen?this.close():this.open()}},{key:"open",value:function(){var t=this;return!this.isOpen&&(this.isOpen=!0,document.dispatchEvent(new Event("Navigation.open")),b.Rm.body.classList.add("Navigation--is-open"),this.call("stop",!1,"Scroll","main"),setTimeout((function(){return t.timeline.play()}),500),!0)}},{key:"close",value:function(){return!!this.isOpen&&(this.isOpen=!1,this.timeline.reverse(),!0)}}]),i}(m.b)},7065:(t,e,n)=>{"use strict";var r=n(3099),o=n(111),i=[].slice,s={},u=function(t,e,n){if(!(e in s)){for(var r=[],o=0;o<e;o++)r[o]="a["+o+"]";s[e]=Function("C,a","return new C("+r.join(",")+")")}return s[e](t,n)};t.exports=Function.bind||function(t){var e=r(this),n=i.call(arguments,1),s=function(){var r=n.concat(i.call(arguments));return this instanceof s?u(e,r.length,r):e.apply(t,r)};return o(e.prototype)&&(s.prototype=e.prototype),s}},1249:(t,e,n)=>{"use strict";var r=n(2109),o=n(2092).map;r({target:"Array",proto:!0,forced:!n(1194)("map")},{map:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}})},5069:(t,e,n)=>{"use strict";var r=n(2109),o=n(1349),i=[].reverse,s=[1,2];r({target:"Array",proto:!0,forced:String(s)===String(s.reverse())},{reverse:function(){return o(this)&&(this.length=this.length),i.call(this)}})},2419:(t,e,n)=>{var r=n(2109),o=n(5005),i=n(3099),s=n(9670),u=n(111),c=n(30),a=n(7065),l=n(7293),p=o("Reflect","construct"),f=l((function(){function t(){}return!(p((function(){}),[],t)instanceof t)})),h=!l((function(){p((function(){}))})),v=f||h;r({target:"Reflect",stat:!0,forced:v,sham:v},{construct:function(t,e){i(t),s(e);var n=arguments.length<3?t:i(arguments[2]);if(h&&!f)return p(t,e,n);if(t==n){switch(e.length){case 0:return new t;case 1:return new t(e[0]);case 2:return new t(e[0],e[1]);case 3:return new t(e[0],e[1],e[2]);case 4:return new t(e[0],e[1],e[2],e[3])}var r=[null];return r.push.apply(r,e),new(a.apply(t,r))}var o=n.prototype,l=c(u(o)?o:Object.prototype),v=Function.apply.call(t,l,e);return u(v)?v:l}})}}]);