(this["webpackJsonpa11y-react-select"]=this["webpackJsonpa11y-react-select"]||[]).push([[0],{13:function(e,t,n){},14:function(e,t,n){},15:function(e,t,n){},16:function(e,t,n){"use strict";n.r(t);var r=n(0),i=n(1),c=n.n(i),o=n(7),u=n.n(o),l=(n(13),n(3)),a=n(2),s=(n(14),n(15),function(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}),f={behavior:"smooth",block:"center",inline:"nearest"},d=function(e){var t,n=e.type,i=e.label,o=e.selectOptions,u=e.selection,d=void 0===u?[]:u,h=e.hasClearAll,p=void 0===h||h,v=e.hasCheckboxes,b=void 0!==v&&v,j=c.a.useState(!1),x=Object(a.a)(j,2),w=x[0],g=x[1],m=c.a.useState(o),O=Object(a.a)(m,2),k=O[0],y=O[1];c.a.useEffect((function(){y(o)}),[o]);var I=c.a.useState(o),N=Object(a.a)(I,2),V=N[0],D=N[1],S=c.a.useState(d),A=Object(a.a)(S,2),C=A[0],R=A[1],E=c.a.useState([]),L=Object(a.a)(E,2),P=L[0],T=L[1],B=c.a.useRef(-9999);c.a.useEffect((function(){var e=[];Array.from(C.entries()).forEach((function(t){e.push(c.a.createRef())})),T(e)}),[C]);var W=c.a.useRef(null),K=c.a.useRef(null),M=c.a.useRef(null),F=c.a.useState(!1),U=Object(a.a)(F,2),q=U[0],z=U[1],$=c.a.useState(0),J=Object(a.a)($,2),H=J[0],G=J[1],Q=c.a.useState(""),X=Object(a.a)(Q,2),Y=X[0],Z=X[1];c.a.useEffect((function(){w||(z(!1),Z(""),D(k),M.current&&void 0!==M.current&&M.current.setAttribute("aria-expanded","false"))}),[k,w]);var _=c.a.useCallback((function(e){if("ArrowLeft"!==e.key||Y){if("ArrowRight"===e.key&&!Y){if(-9999===B.current)return;var t=P.filter((function(e){return null!=e.current}));if(t.length>0){if(B.current===t.length-1)return void(K.current&&K.current.focus());var n;B.current=-9999!==B.current?B.current+1:t.length-1;var r=null===(n=t[B.current].current)||void 0===n?void 0:n.querySelector("button");null===r||void 0===r||r.focus()}}}else{var i=P.filter((function(e){return null!==e.current}));if(i.length>0){if(0===B.current)return;if(null!==B.current){var c;B.current=-9999!==B.current?B.current-1:i.length-1;var o=null===(c=i[B.current].current)||void 0===c?void 0:c.querySelector("button");null===o||void 0===o||o.focus()}}}}),[P,Y]),ee=c.a.useRef(null);return c.a.useEffect((function(){null!==ee.current&&K.current&&(K.current.style.width="".concat(ee.current.clientWidth+2,"px"))}),[Y,ee]),Object(r.jsxs)("div",{ref:M,className:"select-container","aria-haspopup":!0,"aria-expanded":!1,onBlur:function(){t=window.setTimeout((function(){w&&(g((function(){return!1})),Z(""),D(k))}),0)},onFocus:function(){clearTimeout(t),w||g((function(){return!0}))},children:[Object(r.jsx)("label",{htmlFor:"".concat("single"===n?"input-2":"input-1"),children:i}),Object(r.jsxs)("div",{role:"presentation",className:"input-container",onClick:function(){K.current&&K.current.focus(),z((function(e){return e?(M.current&&M.current.setAttribute("aria-expanded","false"),!1):(M.current&&M.current.setAttribute("aria-expanded","true"),!0)}))},onMouseDown:function(e){e.preventDefault()},onMouseUp:function(e){e.preventDefault()},onBlur:function(e){return e},onFocus:function(e){return e},onKeyDownCapture:_,children:["multi"===n?Object(r.jsxs)("div",{className:"input-flex",children:[0!==C.length&&C.map((function(e,t){return Object(r.jsxs)("div",{ref:P[t],className:"multiValue",children:[Object(r.jsx)("div",{className:"multiValue--inner",children:e.label}),Object(r.jsx)("button",{tabIndex:-1,"aria-label":"Remove selected item",className:"multiValue--close",onClick:function(t){t.stopPropagation(),"No Options"!==e.label&&""!==e.value&&(R((function(t){var n=Object(l.a)(t),r=n.findIndex((function(t){return t.value===e.value&&t.label===e.label}));return-1!==r?(n.splice(r,1),n):(n.push(e),n)})),Z(""),D(k),K.current&&K.current.focus())},children:Object(r.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"#000000",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"bevel",children:[Object(r.jsx)("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),Object(r.jsx)("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]},e.value)})),Object(r.jsxs)("div",{className:"input-size-wrapper",children:[Object(r.jsx)("input",{ref:K,className:"search-input",id:"input-1",type:"text",onFocus:function(e){B.current=-9999},value:Y||"",onChange:function(e){var t=s(e.target.value.trim()),n=e.target.value.trimStart();if(Z((function(e){return n})),t){z(!0),M.current&&void 0!==M.current&&M.current.setAttribute("aria-expanded","true");var r=k.reduce((function(e,n){return new RegExp(t,"gi").test("".concat(n.label))&&e.push(n),e}),[]);r=r.length?r:[{label:"No Options",value:""}],D((function(){return r}))}else D((function(){return k}))},onKeyDown:function(e){if(e.stopPropagation(),"ArrowDown"===e.key)if(e.persist(),e.preventDefault(),q){if(W.current){var t=W.current.children;if(!Y&&t[H]){var n=t[H].children[0];n.focus(),n.scrollIntoView(f)}else{var r=t[0].children[0];r.focus(),r.scrollIntoView(f)}}z((function(e){if(e){if(W.current){var t=W.current.children;if(!Y&&t[H]){var n=t[H].children[0];setTimeout((function(){n.focus(),n.scrollIntoView(f)}),0)}else{var r=t[0].children[0];setTimeout((function(){r.focus(),r.scrollIntoView(f)}),0)}}return e}return!e}))}else z((function(){return M.current&&M.current.setAttribute("aria-expanded","true"),!0}))}}),Object(r.jsx)("div",{ref:ee,style:{position:"absolute",top:0,left:0,visibility:"hidden",height:0,overflow:"scroll",whiteSpace:"pre",fontSize:"16px"},children:Y})]})]}):Object(r.jsxs)("div",{className:"input-flex",children:[0!==C.length&&C.map((function(e,t){return Object(r.jsxs)("div",{className:"singleValue",children:[Object(r.jsx)("div",{className:"singleValue--inner",children:!Y&&e.label}),p&&Object(r.jsx)("button",{tabIndex:-1,"aria-label":"Remove selected item",className:"singleValue--close",onClick:function(e){e.stopPropagation(),R((function(){return[]})),Z(""),D(k)},children:Object(r.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"#000000",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"bevel",children:[Object(r.jsx)("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),Object(r.jsx)("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]},e.value)})),Object(r.jsxs)("div",{className:"input-size-wrapper",children:[Object(r.jsx)("input",{ref:K,className:"search-input",id:"input-2",type:"text",onFocus:function(e){B.current=-9999},value:Y||"",onChange:function(e){q||z(!0);var t=s(e.target.value.trim()),n=e.target.value.trimStart();if(Z((function(e){return n})),t){var r=k.reduce((function(e,n){return new RegExp(t,"gi").test("".concat(n.label))&&e.push(n),e}),[]);r=r.length?r:[{label:"No Options",value:""}],D((function(){return r}))}else D((function(){return k}))},onKeyDown:function(e){if(e.stopPropagation(),"ArrowDown"===e.key){if(e.preventDefault(),q&&W.current){var t=W.current.children;if(t[H]){var n=t[H].children[0];n.focus(),n.scrollIntoView(f)}else if(t[0]){var r=t[0].children[0];r.focus(),r.scrollIntoView(f)}}z((function(e){if(e){if(W.current){var t=W.current.children;if(t[H]){var n=t[H].children[0];setTimeout((function(){n.focus(),n.scrollIntoView(f)}),0)}else if(t[0]){var r=t[0].children[0];setTimeout((function(){r.focus(),r.scrollIntoView(f)}),0)}}return e}return!e}))}}}),Object(r.jsx)("div",{ref:ee,style:{position:"absolute",top:0,left:0,visibility:"hidden",height:0,overflow:"scroll",whiteSpace:"pre",fontSize:"16px"},children:Y})]})]}),Object(r.jsx)("button",{"aria-label":"Toggle dropdown ".concat(q?"closed":"open"),className:"drop-btn ".concat(q?"rotate":""),tabIndex:-1,onClick:function(e){e.stopPropagation(),q?(z((function(e){return!e})),K.current&&K.current.blur()):(z((function(e){return!e})),K.current&&K.current.focus())},onMouseDown:function(e){e.stopPropagation(),e.preventDefault()},onMouseUp:function(e){e.stopPropagation(),e.preventDefault()},children:Object(r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"21",height:"21",viewBox:"0 0 24 24",fill:"none",stroke:"#000000",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"bevel",children:Object(r.jsx)("path",{d:"M6 9l6 6 6-6"})})})]}),Object(r.jsx)("div",{children:Object(r.jsx)("ul",{ref:W,className:"dropdown ".concat(q?"show-dropdown":""),role:"menu",onKeyPress:function(e){e.stopPropagation(),e.preventDefault()},onKeyUp:function(e){e.stopPropagation(),e.preventDefault()},onKeyDown:function(e){e.stopPropagation(),"ArrowDown"===e.key?(e.preventDefault(),W.current&&(0===W.current.children.length||H===W.current.children.length-1?setTimeout((function(){if(W.current){var e=W.current.children;if(e[0]){var t=e[0].children[0];t.focus(),t.scrollIntoView(f)}}G((function(e){return 0}))}),0):setTimeout((function(){if(W.current){var e=W.current.children;if(console.log(e),e.length<=H){if(e[0]){var t=e[0].children[0];t.focus(),t.scrollIntoView(f)}G((function(e){return 0}))}else{if(e[H+1]){var n=e[H+1].children[0];n.focus(),n.scrollIntoView(f)}G((function(e){return e+1}))}}}),0))):"ArrowUp"===e.key&&(e.preventDefault(),0===H&&W.current&&W.current.children.length>0?setTimeout((function(){if(W.current){var e=W.current.children[W.current.children.length-1].children[0];e.focus(),e.scrollIntoView(f),G((function(e){return W.current?W.current.children.length-1:e}))}}),0):0!==H&&W.current&&W.current.children.length>0&&setTimeout((function(){if(W.current)if(W.current.children.length<=H){var e=W.current.children[0].children[0];e.focus(),e.scrollIntoView(f),G((function(e){return 0}))}else{var t=W.current.children[H-1].children[0];t.focus(),t.scrollIntoView(f),G((function(e){return e-1}))}}),0))},children:V&&V.length>0?V.map((function(e,t){return Object(r.jsx)("li",{className:"dropdownItem","aria-label":"menuitemcheckbox",children:Object(r.jsxs)("button",{"data-value":e.value,tabIndex:-1,"aria-label":"menuitemcheckbox","aria-pressed":-1!==C.findIndex((function(t){return t.label===e.label&&t.value===e.value})),onClick:function(t){"No Options"!==e.label&&""!==e.value&&("multi"===n?(R((function(t){var n=Object(l.a)(t),r=n.findIndex((function(t){return t.value===e.value&&t.label===e.label}));return-1!==r?(n.splice(r,1),n):(n.push(e),n)})),Z(""),D(k)):(R((function(){return[e]})),Z(""),D(k),K.current&&K.current.focus(),z((function(e){return M.current&&M.current.setAttribute("aria-expanded","false"),!1}))))},onKeyUp:function(t){if("Enter"===t.key||" "===t.key){if("No Options"===e.label||""===e.value)return;"multi"===n?(R((function(t){var n=Object(l.a)(t),r=n.findIndex((function(t){return t.value===e.value&&t.label===e.label}));return-1!==r?(n.splice(r,1),n):(n.push(e),n)})),Z(""),D(k)):(R((function(){return[e]})),Z(""),D(k),K.current&&K.current.focus(),z((function(e){return M.current&&M.current.setAttribute("aria-expanded","false"),!1})))}},children:[b?-1!==C.findIndex((function(t){return t.value===e.value&&t.label===e.label}))?Object(r.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"25",height:"21",viewBox:"0 0 24 24",fill:"none",stroke:"#000000",strokeWidth:"2",strokeLinecap:"square",strokeLinejoin:"bevel",children:[Object(r.jsx)("polyline",{points:"9 11 12 14 22 4"}),Object(r.jsx)("path",{d:"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"})]}):Object(r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"25",height:"21",viewBox:"0 0 24 24",fill:"none",stroke:"#000000",strokeWidth:"2",strokeLinecap:"square",strokeLinejoin:"bevel",children:Object(r.jsx)("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"})}):null," ",Object(r.jsx)("span",{style:{pointerEvents:"none",cursor:"none"},children:e.label})]})},e.value)})):null})})]})},h=function(){var e=c.a.useState([{value:"1",label:"Option 1"},{value:"2",label:"Option 2"},{value:"3",label:"Option 3"},{value:"4",label:"Option 4"},{value:"5",label:"Option 5"},{value:"6",label:"Option 6"}]),t=Object(a.a)(e,2),n=t[0],i=t[1];return Object(r.jsxs)("div",{className:"my-grid",children:[Object(r.jsx)(d,{selectOptions:n,label:"Multi Input",type:"multi",hasCheckboxes:!0}),Object(r.jsx)(d,{selectOptions:n,label:"Single Input",type:"single"}),Object(r.jsx)("button",{style:{padding:"10px 0px",borderRadius:"3px",border:"0px",backgroundColor:"#3a83bd",color:"whitesmoke",boxShadow:"0px 2px 7px -4px black"},onClick:function(){return i((function(e){return[].concat(Object(l.a)(e),[{value:"".concat(e.length+1),label:"Option ".concat(e.length+1)}])}))},children:"Add Item"})]})};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));u.a.render(Object(r.jsx)(h,{}),document.getElementById("root")),u.a.render(Object(r.jsx)(h,{}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[16,1,2]]]);
//# sourceMappingURL=main.ce4780c4.chunk.js.map