/* Qwik Service Worker */
const appBundles=[["q--EX3XXH2.js",[16],["A1QfM6TreV0","FyGByNt6bKA","jVe0yq4jnrs","KAaisFCOabM","LKNHd16CLs4","VdaBkPxdsiI"]],["q-3IswhAcK.js",[16,32,37],["0L2Ols1MWZg","Fs4zcws11H4","HStHQxBkqD8","na1LHLsZC0k"]],["q-4dRgb9Q_.js",[16]],["q-4N0WA-2l.js",[16,26,41,45],["dIQDXeso2eQ"]],["q-7ByuyKXE.js",[16,32,38,41,43,45],["7mcVMPrHITM","rNdVjxqrDkg"]],["q-9lEtB9U9.js",[16]],["q-9tpozuj3.js",[16,24],["nNj3u1nbduI"]],["q-__igjWbX.js",[16],["YIgCG0FJZqE"]],["q-_aXzuKKJ.js",[16,45]],["q-_Sh5mGMV.js",[16],["kmdqv9AtAM8"]],["q-cJw6J7mV.js",[16,24],["eBQ0vFsFKsk"]],["q-cOV8D5Dm.js",[16,32,38,45],["eETJ3K4b1Ic","W9A2LxJAvBA","zFoQIsznerA"]],["q-dGSRUw9y.js",[5,16,29,45],["I1UBmbgXvvQ"]],["q-DjrAIgw7.js",[16,24],["e0ssiDXoeAM"]],["q-dVGkQs6G.js",[16,24],["wOIPfiQ04l4"]],["q-EoLAf2n0.js",[],["DyVc0YBIqQU"]],["q-FK3COJ7G.js",[]],["q-fS2hP4GT.js",[16,32,38],["0zw0hE71q0c","UAEv0ohO0iE"]],["q-Hf4dFk-k.js",[5,16,32,37,38,43,45],["olXsqQ4Z0Og","rZSk0lf3lj8"]],["q-hOKh9PXe.js",[16],["DWmsNP6KmQo","klyPXLlMqRE"]],["q-k6W7R1UN.js",[16,29,38,45],["7yeNbGrji0g","8TrXj0QDWf8","k4IF0fbY8d8","XG0dWn0wsYI"]],["q-KeMRet6w.js",[16,26,43,45],["yA0M2KvAFKs"]],["q-KqvJPyze.js",[16,43],["vsrSZDN0qgo"]],["q-mIV8c5MS.js",[16,43,45],["hzTWmy0kM8Y","SFoO0yJoKVc"]],["q-NFtEbpFJ.js",[16]],["q-nmxLGzue.js",[16,24],["BUbtvTyvVRE","WmYC5H00wtI"]],["q-O1P-C2nU.js",[16]],["q-obkSSLHi.js",[16],["0Qn7kl3Mrpw"]],["q-oozz0YR6.js",[16],["t4QjIrWSSes"]],["q-p__OWYkH.js",[45]],["q-PeQz9Fn8.js",[16],["A5bZC7WO00A"]],["q-pjbxWitr.js",[16,24]],["q-qydBu2t9.js",[]],["q-R-I7EQWu.js",[16,24],["8gdLBszqbaM","i1Cv0pYJNR0"]],["q-RXfJR19z.js",[16],["t84snADalI0"]],["q-skPJGx45.js",[16,24],["nFhOKysd3k8"]],["q-SKxFtx68.js",[16],["diX0oGkH4xk"]],["q-Sl40aQb2.js",[]],["q-sNz3MGS_.js",[16]],["q-SSZWAtDZ.js",[16]],["q-swvvXF0c.js",[16],["0mVez1B0jsY"]],["q-U_3qvcaZ.js",[45]],["q-uKLmZePC.js",[16,24],["Nk9PlpjQm9Y","p9MSze0ojs4"]],["q-VNMkpxoK.js",[16]],["q-vTq5evZ5.js",[]],["q-w40geAFS.js",[]],["q-wiHbkgZQ.js",[16,24],["02wMImzEAbk","fX0bDjeJa0E","RPDJAz33WLA","TxCFOy819ag"]],["q-YVllXrNX.js",[16],["0oLDNBdQ88w"]]];
const libraryBundleIds=[46];
const linkBundles=[[/^\/$/,[31,47,8,40]]];
const m="QwikBuild",k=new Set,g=new Map,u=[],L=(e,n)=>n.filter(s=>!e.some(i=>s.endsWith(i[0]))),q=(e,n)=>!!n&&!E(n),E=e=>{const n=e.headers.get("Cache-Control")||"";return n.includes("no-cache")||n.includes("max-age=0")},C=(e,n)=>e.some(s=>n.endsWith("/"+s[0])),U=(e,n)=>e.find(s=>s[0]===n),b=(e,n)=>n.map(s=>e[s]?e[s][0]:null),W=(e,n)=>n.map(s=>e.get(s)).filter(s=>s!=null),p=e=>{const n=new Map;for(const s of e){const i=s[2];if(i)for(const c of i)n.set(c,s[0])}return n},v=(e,n,s,i)=>new Promise((c,h)=>{const t=i.url,r=s.get(t);if(r)r.push([c,h]);else{const o=l=>{const a=s.get(t);if(a){s.delete(t);for(const[d]of a)d(l.clone())}else c(l.clone())},f=l=>{const a=s.get(t);if(a){s.delete(t);for(const[d,A]of a)A(l)}else h(l)};s.set(t,[[c,h]]),e.match(t).then(l=>{if(q(i,l))o(l);else return n(i).then(async a=>{a.ok&&await e.put(t,a.clone()),o(a)})}).catch(l=>e.match(t).then(a=>{a?o(a):f(l)}))}}),y=(e,n,s,i,c,h=!1)=>{const t=()=>{for(;u.length>0&&g.size<6;){const o=u.shift(),f=new Request(o);k.has(o)?t():(k.add(o),v(n,s,g,f).finally(t))}},r=o=>{try{const f=U(e,o);if(f){const l=b(e,f[1]),a=new URL(o,i).href,d=u.indexOf(a);d>-1?h&&(u.splice(d,1),u.unshift(a)):h?u.unshift(a):u.push(a),l.forEach(r)}}catch(f){console.error(f)}};Array.isArray(c)&&c.forEach(r),t()},w=(e,n,s,i,c,h,t)=>{try{y(e,i,c,h,b(e,n))}catch(r){console.error(r)}for(const r of t)try{for(const o of s){const[f,l]=o;if(f.test(r)){y(e,i,c,h,b(e,l));break}}}catch(o){console.error(o)}},B=(e,n,s,i)=>{try{const c=i.href.split("/"),h=c[c.length-1];c[c.length-1]="";const t=new URL(c.join("/"));y(e,n,s,t,[h],!0)}catch(c){console.error(c)}},N=(e,n,s,i)=>{const c=e.fetch.bind(e),h=p(n);e.addEventListener("fetch",t=>{const r=t.request;if(r.method==="GET"){const o=new URL(r.url);C(n,o.pathname)&&t.respondWith(e.caches.open(m).then(f=>(B(n,f,c,o),v(f,c,g,r))))}}),e.addEventListener("message",async({data:t})=>{if(t.type==="qprefetch"&&typeof t.base=="string"){const r=await e.caches.open(m),o=new URL(t.base,e.origin);Array.isArray(t.links)&&w(n,s,i,r,c,o,t.links),Array.isArray(t.bundles)&&y(n,r,c,o,t.bundles),Array.isArray(t.symbols)&&y(n,r,c,o,W(h,t.symbols))}}),e.addEventListener("activate",()=>{(async()=>{try{const t=await e.caches.open(m),o=(await t.keys()).map(l=>l.url),f=L(n,o);await Promise.all(f.map(l=>t.delete(l)))}catch(t){console.error(t)}})()})},x=()=>{typeof self<"u"&&typeof appBundles<"u"&&N(self,appBundles,libraryBundleIds,linkBundles)};x();addEventListener("install",()=>self.skipWaiting());addEventListener("activate",()=>self.clients.claim());
