(self.webpackChunk_19h47_rider404=self.webpackChunk_19h47_rider404||[]).push([[266],{1506:t=>{t.exports=function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}},9754:t=>{function e(n){return t.exports=e=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},e(n)}t.exports=e},2205:(t,e,n)=>{var r=n(9489);t.exports=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&r(t,e)}},8585:(t,e,n)=>{var r=n(8),o=n(1506);t.exports=function(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?o(t):e}},9489:t=>{function e(n,r){return t.exports=e=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},e(n,r)}t.exports=e},3595:(t,e,n)=>{"use strict";n.r(e),n.d(e,{default:()=>h}),n(2419);var r=n(4575),o=n.n(r),c=n(3913),i=n.n(c),u=n(2205),a=n.n(u),s=n(8585),f=n.n(s),l=n(9754),p=n.n(l);const h=function(t){a()(c,t);var e,n,r=(e=c,n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}(),function(){var t,r=p()(e);if(n){var o=p()(this).constructor;t=Reflect.construct(r,arguments,o)}else t=r.apply(this,arguments);return f()(this,t)});function c(){return o()(this,c),r.apply(this,arguments)}return i()(c,[{key:"init",value:function(){this.$link=document.querySelector('[data-id="'.concat(this.el.id,'"]'))}},{key:"inview",value:function(t){var e=t.way;"enter"===e&&(this.call("deactive",!1,"Faq"),this.active()),"exit"===e&&this.deactive()}},{key:"deactive",value:function(){this.$link.classList.remove("is-active")}},{key:"active",value:function(){this.$link.classList.add("is-active")}}]),c}(n(5110).b)},7065:(t,e,n)=>{"use strict";var r=n(3099),o=n(111),c=[].slice,i={},u=function(t,e,n){if(!(e in i)){for(var r=[],o=0;o<e;o++)r[o]="a["+o+"]";i[e]=Function("C,a","return new C("+r.join(",")+")")}return i[e](t,n)};t.exports=Function.bind||function(t){var e=r(this),n=c.call(arguments,1),i=function(){var r=n.concat(c.call(arguments));return this instanceof i?u(e,r.length,r):e.apply(t,r)};return o(e.prototype)&&(i.prototype=e.prototype),i}},2419:(t,e,n)=>{var r=n(2109),o=n(5005),c=n(3099),i=n(9670),u=n(111),a=n(30),s=n(7065),f=n(7293),l=o("Reflect","construct"),p=f((function(){function t(){}return!(l((function(){}),[],t)instanceof t)})),h=!f((function(){l((function(){}))})),v=p||h;r({target:"Reflect",stat:!0,forced:v,sham:v},{construct:function(t,e){c(t),i(e);var n=arguments.length<3?t:c(arguments[2]);if(h&&!p)return l(t,e,n);if(t==n){switch(e.length){case 0:return new t;case 1:return new t(e[0]);case 2:return new t(e[0],e[1]);case 3:return new t(e[0],e[1],e[2]);case 4:return new t(e[0],e[1],e[2],e[3])}var r=[null];return r.push.apply(r,e),new(s.apply(t,r))}var o=n.prototype,f=a(u(o)?o:Object.prototype),v=Function.apply.call(t,f,e);return u(v)?v:f}})}}]);