(()=>{var e={};e.id=89,e.ids=[89],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},13758:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>i.a,__next_app__:()=>m,originalPathname:()=>u,pages:()=>o,routeModule:()=>x,tree:()=>c}),s(69633),s(23593),s(90996);var r=s(30170),n=s(45002),a=s(83876),i=s.n(a),l=s(66299),d={};for(let e in l)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>l[e]);s.d(t,d);let c=["",{children:["friends",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,69633)),"C:\\repos\\sledge\\Sletcher Systems\\Products\\Green-hub\\cannabis-community-hub\\app\\friends\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,23593)),"C:\\repos\\sledge\\Sletcher Systems\\Products\\Green-hub\\cannabis-community-hub\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,90996,23)),"next/dist/client/components/not-found-error"]}],o=["C:\\repos\\sledge\\Sletcher Systems\\Products\\Green-hub\\cannabis-community-hub\\app\\friends\\page.tsx"],u="/friends/page",m={require:s,loadChunk:()=>Promise.resolve()},x=new r.AppPageRouteModule({definition:{kind:n.x.APP_PAGE,page:"/friends/page",pathname:"/friends",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},86262:(e,t,s)=>{Promise.resolve().then(s.bind(s,15990))},15990:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>o});var r=s(97247),n=s(28964),a=s(5271),i=s(90526);let l=(0,s(26323).Z)("UserMinus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]]);var d=s(35921),c=s(79906);function o(){let[e,t]=(0,n.useState)([]),[s,o]=(0,n.useState)([]),[u,m]=(0,n.useState)(!0),[x,h]=(0,n.useState)(null),p=async r=>{m(!0),h(null);try{await new Promise(e=>setTimeout(e,500));let n=s.find(e=>e.id===r);n&&(t([...e,{...n,status:"online"}]),o(s.filter(e=>e.id!==r)))}catch(e){h("Failed to accept friend request. Please try again.")}finally{m(!1)}},g=async e=>{m(!0),h(null);try{await new Promise(e=>setTimeout(e,500)),o(s.filter(t=>t.id!==e))}catch(e){h("Failed to reject friend request. Please try again.")}finally{m(!1)}},y=async s=>{m(!0),h(null);try{await new Promise(e=>setTimeout(e,500)),t(e.filter(e=>e.id!==s))}catch(e){h("Failed to unfriend. Please try again.")}finally{m(!1)}},f=async s=>{m(!0),h(null);try{await new Promise(e=>setTimeout(e,500)),t(e.filter(e=>e.id!==s))}catch(e){h("Failed to block user. Please try again.")}finally{m(!1)}},b=async e=>{m(!0),h(null);try{await new Promise(e=>setTimeout(e,500)),alert("User reported. We'll review this case.")}catch(e){h("Failed to report user. Please try again.")}finally{m(!1)}};return u&&0===e.length&&0===s.length?r.jsx("div",{className:"flex justify-center items-center h-screen",children:"Loading..."}):x&&0===e.length&&0===s.length?r.jsx("div",{className:"text-destructive text-center",children:x}):(0,r.jsxs)("div",{className:"max-w-4xl mx-auto p-6",children:[r.jsx("h1",{className:"text-3xl font-bold mb-6",children:"Friends"}),(0,r.jsxs)("div",{className:"mb-8 bg-card text-card-foreground rounded-lg shadow-lg p-6",children:[r.jsx("h2",{className:"text-2xl font-semibold mb-4",children:"Friend Requests"}),0===s.length?r.jsx("p",{children:"No pending friend requests."}):r.jsx("ul",{className:"space-y-4",children:s.map(e=>(0,r.jsxs)("li",{className:"flex items-center justify-between bg-secondary p-4 rounded-lg",children:[(0,r.jsxs)("div",{className:"flex items-center",children:[r.jsx(a.Z,{className:"mr-2"}),r.jsx("span",{children:e.name})]}),(0,r.jsxs)("div",{children:[r.jsx("button",{onClick:()=>p(e.id),className:"bg-primary text-primary-foreground px-3 py-1 rounded mr-2",disabled:u,children:"Accept"}),r.jsx("button",{onClick:()=>g(e.id),className:"bg-destructive text-destructive-foreground px-3 py-1 rounded hover:bg-destructive/90",disabled:u,children:"Reject"})]})]},e.id))})]}),(0,r.jsxs)("div",{className:"mb-8 bg-card text-card-foreground rounded-lg shadow-lg p-6",children:[r.jsx("h2",{className:"text-2xl font-semibold mb-4",children:"Your Friends"}),r.jsx("ul",{className:"space-y-4",children:e.map(e=>(0,r.jsxs)("li",{className:"flex items-center justify-between bg-secondary p-4 rounded-lg",children:[(0,r.jsxs)("div",{className:"flex items-center",children:[r.jsx(a.Z,{className:"mr-2"}),r.jsx("span",{children:e.name}),r.jsx("span",{className:`ml-2 px-2 py-1 rounded text-xs ${"online"===e.status?"bg-green-500 text-white":"bg-gray-300 text-gray-800"}`,children:e.status})]}),(0,r.jsxs)("div",{children:[r.jsx(c.default,{href:`/messages?friend=${e.id}`,className:"text-blue-500 hover:text-blue-700 mr-2",children:r.jsx(i.Z,{size:20})}),r.jsx("button",{onClick:()=>y(e.id),className:"text-destructive hover:text-destructive/90 mr-2",disabled:u,children:r.jsx(l,{size:20})}),r.jsx("button",{onClick:()=>f(e.id),className:"text-muted-foreground hover:text-foreground mr-2",disabled:u,children:"Block"}),r.jsx("button",{onClick:()=>b(e.id),className:"text-yellow-500 hover:text-yellow-600",disabled:u,children:r.jsx(d.Z,{size:20})})]})]},e.id))})]}),x&&r.jsx("p",{className:"text-destructive mt-2",children:x})]})}},69633:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>r});let r=(0,s(45347).createProxy)(String.raw`C:\repos\sledge\Sletcher Systems\Products\Green-hub\cannabis-community-hub\app\friends\page.tsx#default`)}};var t=require("../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[787,492,417],()=>s(13758));module.exports=r})();