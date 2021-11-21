var app=function(){"use strict";function t(){}function e(t,e){for(const n in e)t[n]=e[n];return t}function n(t){return t()}function s(){return Object.create(null)}function r(t){t.forEach(n)}function o(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function l(e,...n){if(null==e)return t;const s=e.subscribe(...n);return s.unsubscribe?()=>s.unsubscribe():s}function a(t,e,n){t.$$.on_destroy.push(l(e,n))}function u(t,e,n,s){if(t){const r=i(t,e,n,s);return t[0](r)}}function i(t,n,s,r){return t[1]&&r?e(s.ctx.slice(),t[1](r(n))):s.ctx}function f(t,e,n,s,r,o,c){const l=function(t,e,n,s){if(t[2]&&s){const r=t[2](s(n));if(void 0===e.dirty)return r;if("object"==typeof r){const t=[],n=Math.max(e.dirty.length,r.length);for(let s=0;s<n;s+=1)t[s]=e.dirty[s]|r[s];return t}return e.dirty|r}return e.dirty}(e,s,r,o);if(l){const r=i(e,n,s,c);t.p(r,l)}}function p(t){const e={};for(const n in t)"$"!==n[0]&&(e[n]=t[n]);return e}function $(t,e){const n={};e=new Set(e);for(const s in t)e.has(s)||"$"===s[0]||(n[s]=t[s]);return n}function d(t,e){t.appendChild(e)}function m(t,e,n){t.insertBefore(e,n||null)}function h(t){t.parentNode.removeChild(t)}function g(t){return document.createElement(t)}function v(t){return document.createTextNode(t)}function b(){return v(" ")}function y(){return v("")}function k(t,e,n,s){return t.addEventListener(e,n,s),()=>t.removeEventListener(e,n,s)}function x(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function w(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const s in e)null==e[s]?t.removeAttribute(s):"style"===s?t.style.cssText=e[s]:"__value"===s?t.value=t[s]=e[s]:n[s]&&n[s].set?t[s]=e[s]:x(t,s,e[s])}function _(t,e){t.value=null==e?"":e}let E;function j(t){E=t}function C(){if(!E)throw new Error("Function called outside component initialization");return E}function P(){const t=C();return(e,n)=>{const s=t.$$.callbacks[e];if(s){const r=function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(e,n);s.slice().forEach((e=>{e.call(t,r)}))}}}function A(t,e){C().$$.context.set(t,e)}function L(t){return C().$$.context.get(t)}const S=[],D=[],O=[],R=[],N=Promise.resolve();let T=!1;function M(t){O.push(t)}let q=!1;const H=new Set;function U(){if(!q){q=!0;do{for(let t=0;t<S.length;t+=1){const e=S[t];j(e),B(e.$$)}for(j(null),S.length=0;D.length;)D.pop()();for(let t=0;t<O.length;t+=1){const e=O[t];H.has(e)||(H.add(e),e())}O.length=0}while(S.length);for(;R.length;)R.pop()();T=!1,q=!1,H.clear()}}function B(t){if(null!==t.fragment){t.update(),r(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(M)}}const F=new Set;let K;function z(){K={r:0,c:[],p:K}}function G(){K.r||r(K.c),K=K.p}function I(t,e){t&&t.i&&(F.delete(t),t.i(e))}function J(t,e,n,s){if(t&&t.o){if(F.has(t))return;F.add(t),K.c.push((()=>{F.delete(t),s&&(n&&t.d(1),s())})),t.o(e)}}function Q(t,e){const n={},s={},r={$$scope:1};let o=t.length;for(;o--;){const c=t[o],l=e[o];if(l){for(const t in c)t in l||(s[t]=1);for(const t in l)r[t]||(n[t]=l[t],r[t]=1);t[o]=l}else for(const t in c)r[t]=1}for(const t in s)t in n||(n[t]=void 0);return n}function V(t){return"object"==typeof t&&null!==t?t:{}}function W(t){t&&t.c()}function X(t,e,s,c){const{fragment:l,on_mount:a,on_destroy:u,after_update:i}=t.$$;l&&l.m(e,s),c||M((()=>{const e=a.map(n).filter(o);u?u.push(...e):r(e),t.$$.on_mount=[]})),i.forEach(M)}function Y(t,e){const n=t.$$;null!==n.fragment&&(r(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Z(t,e){-1===t.$$.dirty[0]&&(S.push(t),T||(T=!0,N.then(U)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function tt(e,n,o,c,l,a,u=[-1]){const i=E;j(e);const f=e.$$={fragment:null,ctx:null,props:a,update:t,not_equal:l,bound:s(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(i?i.$$.context:n.context||[]),callbacks:s(),dirty:u,skip_bound:!1};let p=!1;if(f.ctx=o?o(e,n.props||{},((t,n,...s)=>{const r=s.length?s[0]:n;return f.ctx&&l(f.ctx[t],f.ctx[t]=r)&&(!f.skip_bound&&f.bound[t]&&f.bound[t](r),p&&Z(e,t)),n})):[],f.update(),p=!0,r(f.before_update),f.fragment=!!c&&c(f.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);f.fragment&&f.fragment.l(t),t.forEach(h)}else f.fragment&&f.fragment.c();n.intro&&I(e.$$.fragment),X(e,n.target,n.anchor,n.customElement),U()}j(i)}class et{$destroy(){Y(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const nt=[];function st(e,n=t){let s;const r=[];function o(t){if(c(e,t)&&(e=t,s)){const t=!nt.length;for(let t=0;t<r.length;t+=1){const n=r[t];n[1](),nt.push(n,e)}if(t){for(let t=0;t<nt.length;t+=2)nt[t][0](nt[t+1]);nt.length=0}}}return{set:o,update:function(t){o(t(e))},subscribe:function(c,l=t){const a=[c,l];return r.push(a),1===r.length&&(s=n(o)||t),c(e),()=>{const t=r.indexOf(a);-1!==t&&r.splice(t,1),0===r.length&&(s(),s=null)}}}}function rt(e,n,s){const c=!Array.isArray(e),a=c?[e]:e,u=n.length<2;return{subscribe:st(s,(e=>{let s=!1;const i=[];let f=0,p=t;const $=()=>{if(f)return;p();const s=n(c?i[0]:i,e);u?e(s):p=o(s)?s:t},d=a.map(((t,e)=>l(t,(t=>{i[e]=t,f&=~(1<<e),s&&$()}),(()=>{f|=1<<e}))));return s=!0,$(),function(){r(d),p()}})).subscribe}}const ot={},ct={};function lt(t){return{...t.location,state:t.history.state,key:t.history.state&&t.history.state.key||"initial"}}const at=function(t,e){const n=[];let s=lt(t);return{get location(){return s},listen(e){n.push(e);const r=()=>{s=lt(t),e({location:s,action:"POP"})};return t.addEventListener("popstate",r),()=>{t.removeEventListener("popstate",r);const s=n.indexOf(e);n.splice(s,1)}},navigate(e,{state:r,replace:o=!1}={}){r={...r,key:Date.now()+""};try{o?t.history.replaceState(r,null,e):t.history.pushState(r,null,e)}catch(n){t.location[o?"replace":"assign"](e)}s=lt(t),n.forEach((t=>t({location:s,action:"PUSH"})))}}}(Boolean("undefined"!=typeof window&&window.document&&window.document.createElement)?window:function(t="/"){let e=0;const n=[{pathname:t,search:""}],s=[];return{get location(){return n[e]},addEventListener(t,e){},removeEventListener(t,e){},history:{get entries(){return n},get index(){return e},get state(){return s[e]},pushState(t,r,o){const[c,l=""]=o.split("?");e++,n.push({pathname:c,search:l}),s.push(t)},replaceState(t,r,o){const[c,l=""]=o.split("?");n[e]={pathname:c,search:l},s[e]=t}}}}()),{navigate:ut}=at,it=/^:(.+)/;function ft(t,e){return t.substr(0,e.length)===e}function pt(t){return"*"===t[0]}function $t(t){return t.replace(/(^\/+|\/+$)/g,"").split("/")}function dt(t){return t.replace(/(^\/+|\/+$)/g,"")}function mt(t,e){return{route:t,score:t.default?0:$t(t.path).reduce(((t,e)=>(t+=4,!function(t){return""===t}(e)?!function(t){return it.test(t)}(e)?pt(e)?t-=5:t+=3:t+=2:t+=1,t)),0),index:e}}function ht(t,e){let n,s;const[r]=e.split("?"),o=$t(r),c=""===o[0],l=function(t){return t.map(mt).sort(((t,e)=>t.score<e.score?1:t.score>e.score?-1:t.index-e.index))}(t);for(let t=0,r=l.length;t<r;t++){const r=l[t].route;let a=!1;if(r.default){s={route:r,params:{},uri:e};continue}const u=$t(r.path),i={},f=Math.max(o.length,u.length);let p=0;for(;p<f;p++){const t=u[p],e=o[p];if(void 0!==t&&pt(t)){i["*"===t?"*":t.slice(1)]=o.slice(p).map(decodeURIComponent).join("/");break}if(void 0===e){a=!0;break}let n=it.exec(t);if(n&&!c){const t=decodeURIComponent(e);i[n[1]]=t}else if(t!==e){a=!0;break}}if(!a){n={route:r,params:i,uri:"/"+o.slice(0,p).join("/")};break}}return n||s||null}function gt(t,e){return t+(e?`?${e}`:"")}function vt(t,e){return`${dt("/"===e?t:`${dt(t)}/${dt(e)}`)}/`}function bt(t){let e;const n=t[9].default,s=u(n,t,t[8],null);return{c(){s&&s.c()},m(t,n){s&&s.m(t,n),e=!0},p(t,[r]){s&&s.p&&(!e||256&r)&&f(s,n,t,t[8],r,null,null)},i(t){e||(I(s,t),e=!0)},o(t){J(s,t),e=!1},d(t){s&&s.d(t)}}}function yt(t,e,n){let s,r,o,{$$slots:c={},$$scope:l}=e,{basepath:u="/"}=e,{url:i=null}=e;const f=L(ot),p=L(ct),$=st([]);a(t,$,(t=>n(7,o=t)));const d=st(null);let m=!1;const h=f||st(i?{pathname:i}:at.location);a(t,h,(t=>n(6,r=t)));const g=p?p.routerBase:st({path:u,uri:u});a(t,g,(t=>n(5,s=t)));const v=rt([g,d],(([t,e])=>{if(null===e)return t;const{path:n}=t,{route:s,uri:r}=e;return{path:s.default?n:s.path.replace(/\*.*$/,""),uri:r}}));var b;return f||(b=()=>at.listen((t=>{h.set(t.location)})),C().$$.on_mount.push(b),A(ot,h)),A(ct,{activeRoute:d,base:g,routerBase:v,registerRoute:function(t){const{path:e}=s;let{path:n}=t;if(t._path=n,t.path=vt(e,n),"undefined"==typeof window){if(m)return;const e=function(t,e){return ht([t],e)}(t,r.pathname);e&&(d.set(e),m=!0)}else $.update((e=>(e.push(t),e)))},unregisterRoute:function(t){$.update((e=>{const n=e.indexOf(t);return e.splice(n,1),e}))}}),t.$$set=t=>{"basepath"in t&&n(3,u=t.basepath),"url"in t&&n(4,i=t.url),"$$scope"in t&&n(8,l=t.$$scope)},t.$$.update=()=>{if(32&t.$$.dirty){const{path:t}=s;$.update((e=>(e.forEach((e=>e.path=vt(t,e._path))),e)))}if(192&t.$$.dirty){const t=ht(o,r.pathname);d.set(t)}},[$,h,g,u,i,s,r,o,l,c]}class kt extends et{constructor(t){super(),tt(this,t,yt,bt,c,{basepath:3,url:4})}}const xt=t=>({params:4&t,location:16&t}),wt=t=>({params:t[2],location:t[4]});function _t(t){let e,n,s,r;const o=[jt,Et],c=[];function l(t,e){return null!==t[0]?0:1}return e=l(t),n=c[e]=o[e](t),{c(){n.c(),s=y()},m(t,n){c[e].m(t,n),m(t,s,n),r=!0},p(t,r){let a=e;e=l(t),e===a?c[e].p(t,r):(z(),J(c[a],1,1,(()=>{c[a]=null})),G(),n=c[e],n?n.p(t,r):(n=c[e]=o[e](t),n.c()),I(n,1),n.m(s.parentNode,s))},i(t){r||(I(n),r=!0)},o(t){J(n),r=!1},d(t){c[e].d(t),t&&h(s)}}}function Et(t){let e;const n=t[10].default,s=u(n,t,t[9],wt);return{c(){s&&s.c()},m(t,n){s&&s.m(t,n),e=!0},p(t,r){s&&s.p&&(!e||532&r)&&f(s,n,t,t[9],r,xt,wt)},i(t){e||(I(s,t),e=!0)},o(t){J(s,t),e=!1},d(t){s&&s.d(t)}}}function jt(t){let n,s,r;const o=[{location:t[4]},t[2],t[3]];var c=t[0];function l(t){let n={};for(let t=0;t<o.length;t+=1)n=e(n,o[t]);return{props:n}}return c&&(n=new c(l())),{c(){n&&W(n.$$.fragment),s=y()},m(t,e){n&&X(n,t,e),m(t,s,e),r=!0},p(t,e){const r=28&e?Q(o,[16&e&&{location:t[4]},4&e&&V(t[2]),8&e&&V(t[3])]):{};if(c!==(c=t[0])){if(n){z();const t=n;J(t.$$.fragment,1,0,(()=>{Y(t,1)})),G()}c?(n=new c(l()),W(n.$$.fragment),I(n.$$.fragment,1),X(n,s.parentNode,s)):n=null}else c&&n.$set(r)},i(t){r||(n&&I(n.$$.fragment,t),r=!0)},o(t){n&&J(n.$$.fragment,t),r=!1},d(t){t&&h(s),n&&Y(n,t)}}}function Ct(t){let e,n,s=null!==t[1]&&t[1].route===t[7]&&_t(t);return{c(){s&&s.c(),e=y()},m(t,r){s&&s.m(t,r),m(t,e,r),n=!0},p(t,[n]){null!==t[1]&&t[1].route===t[7]?s?(s.p(t,n),2&n&&I(s,1)):(s=_t(t),s.c(),I(s,1),s.m(e.parentNode,e)):s&&(z(),J(s,1,1,(()=>{s=null})),G())},i(t){n||(I(s),n=!0)},o(t){J(s),n=!1},d(t){s&&s.d(t),t&&h(e)}}}function Pt(t,n,s){let r,o,{$$slots:c={},$$scope:l}=n,{path:u=""}=n,{component:i=null}=n;const{registerRoute:f,unregisterRoute:$,activeRoute:d}=L(ct);a(t,d,(t=>s(1,r=t)));const m=L(ot);a(t,m,(t=>s(4,o=t)));const h={path:u,default:""===u};let g={},v={};var b;return f(h),"undefined"!=typeof window&&(b=()=>{$(h)},C().$$.on_destroy.push(b)),t.$$set=t=>{s(13,n=e(e({},n),p(t))),"path"in t&&s(8,u=t.path),"component"in t&&s(0,i=t.component),"$$scope"in t&&s(9,l=t.$$scope)},t.$$.update=()=>{2&t.$$.dirty&&r&&r.route===h&&s(2,g=r.params);{const{path:t,component:e,...r}=n;s(3,v=r)}},n=p(n),[i,r,g,v,o,d,m,h,u,l,c]}class At extends et{constructor(t){super(),tt(this,t,Pt,Ct,c,{path:8,component:0})}}function Lt(t){let n,s,r,o;const c=t[16].default,l=u(c,t,t[15],null);let a=[{href:t[0]},{"aria-current":t[2]},t[1],t[6]],i={};for(let t=0;t<a.length;t+=1)i=e(i,a[t]);return{c(){n=g("a"),l&&l.c(),w(n,i)},m(e,c){m(e,n,c),l&&l.m(n,null),s=!0,r||(o=k(n,"click",t[5]),r=!0)},p(t,[e]){l&&l.p&&(!s||32768&e)&&f(l,c,t,t[15],e,null,null),w(n,i=Q(a,[(!s||1&e)&&{href:t[0]},(!s||4&e)&&{"aria-current":t[2]},2&e&&t[1],64&e&&t[6]]))},i(t){s||(I(l,t),s=!0)},o(t){J(l,t),s=!1},d(t){t&&h(n),l&&l.d(t),r=!1,o()}}}function St(t,n,s){let r;const o=["to","replace","state","getProps"];let c,l,u=$(n,o),{$$slots:i={},$$scope:f}=n,{to:d="#"}=n,{replace:m=!1}=n,{state:h={}}=n,{getProps:g=(()=>({}))}=n;const{base:v}=L(ct);a(t,v,(t=>s(13,c=t)));const b=L(ot);a(t,b,(t=>s(14,l=t)));const y=P();let k,x,w,_;return t.$$set=t=>{n=e(e({},n),p(t)),s(6,u=$(n,o)),"to"in t&&s(7,d=t.to),"replace"in t&&s(8,m=t.replace),"state"in t&&s(9,h=t.state),"getProps"in t&&s(10,g=t.getProps),"$$scope"in t&&s(15,f=t.$$scope)},t.$$.update=()=>{8320&t.$$.dirty&&s(0,k="/"===d?c.uri:function(t,e){if(ft(t,"/"))return t;const[n,s]=t.split("?"),[r]=e.split("?"),o=$t(n),c=$t(r);if(""===o[0])return gt(r,s);if(!ft(o[0],"."))return gt(("/"===r?"":"/")+c.concat(o).join("/"),s);const l=c.concat(o),a=[];return l.forEach((t=>{".."===t?a.pop():"."!==t&&a.push(t)})),gt("/"+a.join("/"),s)}(d,c.uri)),16385&t.$$.dirty&&s(11,x=ft(l.pathname,k)),16385&t.$$.dirty&&s(12,w=k===l.pathname),4096&t.$$.dirty&&s(2,r=w?"page":void 0),23553&t.$$.dirty&&s(1,_=g({location:l,href:k,isPartiallyCurrent:x,isCurrent:w}))},[k,_,r,v,b,function(t){if(y("click",t),function(t){return!t.defaultPrevented&&0===t.button&&!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)}(t)){t.preventDefault();const e=l.pathname===k||m;ut(k,{state:h,replace:e})}},u,d,m,h,g,x,w,c,l,f,i]}class Dt extends et{constructor(t){super(),tt(this,t,St,Lt,c,{to:7,replace:8,state:9,getProps:10})}}function Ot(e){let n,s,o,c,l,a,u,i,f,p,$,v,y,w,_,E,j,C,P,A,L,S,D,O,R,N,T,M,q,H,U,B,F,K,z,G,I;return{c(){n=g("main"),s=g("div"),o=g("form"),c=g("h2"),c.textContent="Name",l=b(),a=g("input"),u=b(),i=g("h2"),i.textContent="Description",f=b(),p=g("input"),$=b(),v=g("h2"),v.textContent="Panel",y=b(),w=g("input"),_=b(),E=g("h2"),E.textContent="Poster",j=b(),C=g("input"),P=b(),A=g("h2"),A.textContent="Type",L=b(),S=g("select"),D=g("option"),D.textContent="g",O=b(),R=g("h2"),R.textContent="Links",N=b(),T=g("textarea"),M=b(),q=g("h2"),q.textContent="Genres",H=b(),U=g("section"),U.innerHTML='<label class="svelte-9ckf9">All <input type="checkbox" class="svelte-9ckf9"/>  <span class="radio svelte-9ckf9"></span></label> \n\t\t\t\t<label class="svelte-9ckf9">All <input type="checkbox" class="svelte-9ckf9"/>  <span class="radio svelte-9ckf9"></span></label> \n\t\t\t\t<label class="svelte-9ckf9">All <input type="checkbox" class="svelte-9ckf9"/>  <span class="radio svelte-9ckf9"></span></label> \n\t\t\t\t<label class="svelte-9ckf9">All <input type="checkbox" class="svelte-9ckf9"/>  <span class="radio svelte-9ckf9"></span></label>',B=b(),F=g("button"),F.textContent="Submit",K=b(),z=g("div"),z.innerHTML='<form class="svelte-9ckf9"><h2 class="svelte-9ckf9">Genre name</h2> \n\t\t\t<input type="text" class="svelte-9ckf9"/> \n\t\t\t<button type="submit" class="svelte-9ckf9">Submit</button></form> \n\t\t<form class="svelte-9ckf9"><h2 class="svelte-9ckf9">Delete genre</h2> \n\t\t\t<input type="text" class="svelte-9ckf9"/> \n\t\t\t<button id="red" class="svelte-9ckf9">Delete</button></form>',x(c,"class","svelte-9ckf9"),x(a,"type","text"),x(a,"class","svelte-9ckf9"),x(i,"class","svelte-9ckf9"),x(p,"type","text"),x(p,"class","svelte-9ckf9"),x(v,"class","svelte-9ckf9"),x(w,"type","text"),x(w,"class","svelte-9ckf9"),x(E,"class","svelte-9ckf9"),x(C,"type","text"),x(C,"class","svelte-9ckf9"),x(A,"class","svelte-9ckf9"),D.__value="g",D.value=D.__value,x(S,"name",""),x(S,"id",""),x(S,"class","svelte-9ckf9"),x(R,"class","svelte-9ckf9"),x(T,"name",""),x(T,"id",""),x(T,"cols","30"),x(T,"rows","10"),x(T,"class","svelte-9ckf9"),x(q,"class","svelte-9ckf9"),x(U,"class","svelte-9ckf9"),x(F,"type","submit"),x(F,"class","svelte-9ckf9"),x(o,"class","svelte-9ckf9"),x(s,"class","svelte-9ckf9"),x(z,"class","svelte-9ckf9"),x(n,"class","svelte-9ckf9")},m(t,r){m(t,n,r),d(n,s),d(s,o),d(o,c),d(o,l),d(o,a),d(o,u),d(o,i),d(o,f),d(o,p),d(o,$),d(o,v),d(o,y),d(o,w),d(o,_),d(o,E),d(o,j),d(o,C),d(o,P),d(o,A),d(o,L),d(o,S),d(S,D),d(o,O),d(o,R),d(o,N),d(o,T),d(o,M),d(o,q),d(o,H),d(o,U),d(o,B),d(o,F),d(n,K),d(n,z),G||(I=[k(s,"drop",e[1]),k(s,"dragover",Rt)],G=!0)},p:t,i:t,o:t,d(t){t&&h(n),G=!1,r(I)}}}const Rt=t=>{t.preventDefault()};function Nt(t){let e=[];function n(t){t.preventDefault();let n=t.dataTransfer.files[0];if("application/json"==n.type){let t=new FileReader;t.onload=()=>{let n=t.result;e.push(JSON.parse(atob(n.split(",")[1])))},t.readAsDataURL(n)}else alert("not the right file type")}return[n,t=>{n(t)}]}class Tt extends et{constructor(t){super(),tt(this,t,Nt,Ot,c,{})}}function Mt(e){let n,s,o,c,l,a,u;return{c(){n=g("div"),s=g("form"),o=g("input"),c=b(),l=g("button"),l.innerHTML='<img src="/images/gals.svg" alt="#" class="svelte-jvllkq"/>',x(o,"type","text"),x(o,"placeholder","Search for any show or movie"),x(o,"class","svelte-jvllkq"),x(l,"type","submit"),x(l,"class","svelte-jvllkq"),x(s,"class","svelte-jvllkq"),x(n,"class","svelte-jvllkq")},m(t,r){m(t,n,r),d(n,s),d(s,o),_(o,e[0]),d(s,c),d(s,l),a||(u=[k(o,"input",e[3]),k(s,"submit",e[1])],a=!0)},p(t,[e]){1&e&&o.value!==t[0]&&_(o,t[0])},i:t,o:t,d(t){t&&h(n),a=!1,r(u)}}}function qt(t,e,n){let s,{base:r=window.location.pathname}=e;return t.$$set=t=>{"base"in t&&n(2,r=t.base)},[s,t=>{t.preventDefault(),ut(r+`?text=${s}`)},r,function(){s=this.value,n(0,s)}]}class Ht extends et{constructor(t){super(),tt(this,t,qt,Mt,c,{base:2})}}function Ut(t){let e;return{c(){e=v("Upload")},m(t,n){m(t,e,n)},d(t){t&&h(e)}}}function Bt(t){let e;return{c(){e=v("Library")},m(t,n){m(t,e,n)},d(t){t&&h(e)}}}function Ft(t){let e,n,s,r,o,c,l,a,u,i,f,p;return n=new Ht({props:{width:"500px",base:"/library"}}),a=new Dt({props:{to:"/admin",$$slots:{default:[Ut]},$$scope:{ctx:t}}}),f=new Dt({props:{to:"/admin/library",$$slots:{default:[Bt]},$$scope:{ctx:t}}}),{c(){e=g("nav"),W(n.$$.fragment),s=b(),r=g("br"),o=b(),c=g("ul"),l=g("li"),W(a.$$.fragment),u=b(),i=g("li"),W(f.$$.fragment),x(r,"class","svelte-dwlgsw"),x(l,"class","svelte-dwlgsw"),x(i,"class","svelte-dwlgsw"),x(c,"class","svelte-dwlgsw"),x(e,"class","svelte-dwlgsw")},m(t,$){m(t,e,$),X(n,e,null),d(e,s),d(e,r),d(e,o),d(e,c),d(c,l),X(a,l,null),d(c,u),d(c,i),X(f,i,null),p=!0},p(t,[e]){const n={};1&e&&(n.$$scope={dirty:e,ctx:t}),a.$set(n);const s={};1&e&&(s.$$scope={dirty:e,ctx:t}),f.$set(s)},i(t){p||(I(n.$$.fragment,t),I(a.$$.fragment,t),I(f.$$.fragment,t),p=!0)},o(t){J(n.$$.fragment,t),J(a.$$.fragment,t),J(f.$$.fragment,t),p=!1},d(t){t&&h(e),Y(n),Y(a),Y(f)}}}class Kt extends et{constructor(t){super(),tt(this,t,null,Ft,c,{})}}function zt(e){let n;return{c(){n=g("article"),n.innerHTML='<img src="/images/FAF7.jpg" alt="" class="svelte-uis8bt"/> \n\t<h2>name</h2> \n\t<p>hello</p> \n\t<button class="svelte-uis8bt">Delete</button>',x(n,"class","svelte-uis8bt")},m(t,e){m(t,n,e)},p:t,i:t,o:t,d(t){t&&h(n)}}}class Gt extends et{constructor(t){super(),tt(this,t,null,zt,c,{})}}function It(e){let n,s,r,o,c,l,a,u,i,f,p,$,v,y,k,w,_;return s=new Gt({}),o=new Gt({}),l=new Gt({}),u=new Gt({}),f=new Gt({}),$=new Gt({}),y=new Gt({}),w=new Gt({}),{c(){n=g("main"),W(s.$$.fragment),r=b(),W(o.$$.fragment),c=b(),W(l.$$.fragment),a=b(),W(u.$$.fragment),i=b(),W(f.$$.fragment),p=b(),W($.$$.fragment),v=b(),W(y.$$.fragment),k=b(),W(w.$$.fragment),x(n,"class","svelte-1d0z9fr")},m(t,e){m(t,n,e),X(s,n,null),d(n,r),X(o,n,null),d(n,c),X(l,n,null),d(n,a),X(u,n,null),d(n,i),X(f,n,null),d(n,p),X($,n,null),d(n,v),X(y,n,null),d(n,k),X(w,n,null),_=!0},p:t,i(t){_||(I(s.$$.fragment,t),I(o.$$.fragment,t),I(l.$$.fragment,t),I(u.$$.fragment,t),I(f.$$.fragment,t),I($.$$.fragment,t),I(y.$$.fragment,t),I(w.$$.fragment,t),_=!0)},o(t){J(s.$$.fragment,t),J(o.$$.fragment,t),J(l.$$.fragment,t),J(u.$$.fragment,t),J(f.$$.fragment,t),J($.$$.fragment,t),J(y.$$.fragment,t),J(w.$$.fragment,t),_=!1},d(t){t&&h(n),Y(s),Y(o),Y(l),Y(u),Y(f),Y($),Y(y),Y(w)}}}class Jt extends et{constructor(t){super(),tt(this,t,null,It,c,{})}}function Qt(e){let n,s,r,o,c,l;return n=new Kt({}),r=new At({props:{path:"/admin",component:Tt}}),c=new At({props:{path:"/admin/library",component:Jt}}),{c(){W(n.$$.fragment),s=b(),W(r.$$.fragment),o=b(),W(c.$$.fragment)},m(t,e){X(n,t,e),m(t,s,e),X(r,t,e),m(t,o,e),X(c,t,e),l=!0},p:t,i(t){l||(I(n.$$.fragment,t),I(r.$$.fragment,t),I(c.$$.fragment,t),l=!0)},o(t){J(n.$$.fragment,t),J(r.$$.fragment,t),J(c.$$.fragment,t),l=!1},d(t){Y(n,t),t&&h(s),Y(r,t),t&&h(o),Y(c,t)}}}function Vt(t){let e,n;return e=new kt({props:{$$slots:{default:[Qt]},$$scope:{ctx:t}}}),{c(){W(e.$$.fragment)},m(t,s){X(e,t,s),n=!0},p(t,[n]){const s={};1&n&&(s.$$scope={dirty:n,ctx:t}),e.$set(s)},i(t){n||(I(e.$$.fragment,t),n=!0)},o(t){J(e.$$.fragment,t),n=!1},d(t){Y(e,t)}}}return new class extends et{constructor(t){super(),tt(this,t,null,Vt,c,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
