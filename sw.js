const V='v202611160646';
const FILES=["index.html", "kelime.html", "gramer.html", "manifest.webmanifest", "sw.js", "icon-180.png", "icon-192.png", "icon-512.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES.map(f=>'./'+f))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
function timeout(ms){return new Promise((_,r)=>setTimeout(()=>r(new Error('t')),ms))}
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
  const isPage=req.mode==='navigate'||req.url.endsWith('.html');
  if(isPage){
    e.respondWith(Promise.race([fetch(req),timeout(3500)]).then(r=>{if(r&&r.ok){const c=r.clone();caches.open(V).then(x=>x.put(req,c))}return r})
      .catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));
  }else{
    e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req)));
  }
});
