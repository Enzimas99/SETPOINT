/* SETPOINT service worker v3
   - Instala guardando os arquivos essenciais.
   - Busca na rede com limite de 3 s (Wi-Fi ruim na quadra não trava) e cai no cache.
   - Remove caches de versões antigas. Os dados das partidas ficam no localStorage, fora do cache, e não são tocados.
   Ao publicar uma versão nova, aumente o número em CACHE. */
const CACHE='setpoint-v3',FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const fresh=req=>new Promise((ok,no)=>{const t=setTimeout(()=>no('timeout'),3000);fetch(req).then(r=>{clearTimeout(t);ok(r)},e=>{clearTimeout(t);no(e)})});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const same=new URL(e.request.url).origin===location.origin;
  e.respondWith(fresh(e.request).then(r=>{if(r.ok&&same){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return r})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));
});
