(self.webpackChunk_19h47_rider404=self.webpackChunk_19h47_rider404||[]).push([[798],{241:(t,e,n)=>{"use strict";n.d(e,{Z:()=>y}),n(2419);var o=n(4575),r=n.n(o),a=n(3913),i=n.n(a),s=n(2205),u=n.n(s),c=n(8585),l=n.n(c),f=n(9754),h=n.n(f),v=(n(8674),n(1539),n(8783),n(6992),n(3948),n(1449)),d=n(1248),p=n.n(d);var y=function(t){u()(s,t);var e,o,a=(e=s,o=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}(),function(){var t,n=h()(e);if(o){var r=h()(this).constructor;t=Reflect.construct(n,arguments,r)}else t=n.apply(this,arguments);return l()(this,t)});function s(t){var e;return r()(this,s),(e=a.call(this,t)).animation=null,e}return i()(s,[{key:"init",value:function(){var t=this;this.params={renderer:"svg",loop:JSON.parse(this.el.getAttribute("data-lottie-loop"))||!1,autoplay:JSON.parse(this.el.getAttribute("data-lottie-autoplay"))||!1,name:"".concat(this.el.getAttribute("id"),"_animation"),container:this.el,rendererSettings:{preserveAspectRatio:this.el.getAttribute("data-lottie-preserveaspectratio")||"xMinYMin slice"}},this.delay=JSON.parse(this.el.getAttribute("data-lottie-delay"))||!1,this.json=n(264)("./".concat(this.el.getAttribute("data-lottie-json"),".json")),this.json.then((function(e){t.params.animationData=e,t.animation=p().loadAnimation(t.params),t.duration=t.animation.getDuration(!0)}))}},{key:"goToAndPlay",value:function(){return this.animation.goToAndPlay(0)}}]),s}(v.b)},485:(t,e,n)=>{"use strict";n.r(e),n.d(e,{default:()=>v}),n(2419);var o=n(4575),r=n.n(o),a=n(3913),i=n.n(a),s=n(2205),u=n.n(s),c=n(8585),l=n.n(c),f=n(9754),h=n.n(f);var v=function(t){u()(a,t);var e,n,o=(e=a,n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}(),function(){var t,o=h()(e);if(n){var r=h()(this).constructor;t=Reflect.construct(o,arguments,r)}else t=o.apply(this,arguments);return l()(this,t)});function a(t){var e;return r()(this,a),(e=o.call(this,t)).events={mouseenter:{button:"activate"},mouseleave:{button:"deactivate"},focus:{button:"activate"},blur:{button:"deactivate"}},e}return i()(a,[{key:"activate",value:function(){this.animation.setDirection(1),this.animation.play()}},{key:"deactivate",value:function(){this.animation.setDirection(-1),this.animation.play()}}]),a}(n(241).Z)},264:(t,e,n)=>{var o={"./about-map.json":[4160,160],"./add-to-cart-hover.json":[5107,107],"./add-to-cart.json":[112,112],"./arrow-down.json":[6950,950],"./arrow-up.json":[2881,40],"./bars.json":[8175,175],"./cart.json":[2646,646],"./globe.json":[3318,318],"./logo.json":[4665,665],"./love-two-ride-four-love.json":[7211,211],"./menu.json":[7872,872],"./oval.json":[7906,906],"./rider-404.json":[4027,27],"./star-circle.json":[3970,970]};function r(t){if(!n.o(o,t))return Promise.resolve().then((()=>{var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}));var e=o[t],r=e[0];return n.e(e[1]).then((()=>n.t(r,3)))}r.keys=()=>Object.keys(o),r.id=264,t.exports=r}}]);