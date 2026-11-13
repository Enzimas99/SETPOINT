/* SETPOINT service worker v16
   - Prefixo proprio nos caches ("setpoint-"): ao atualizar, apaga SOMENTE caches antigos do SETPOINT e preserva os de outros apps da mesma origem.
   - Instalacao: arquivos essenciais (precisam entrar) e opcionais (se faltarem, a instalacao continua).
   - So trata pedidos do proprio site: chamadas a nuvem (Supabase) passam direto, sem cache e sem limite de tempo.
   - Rede com limite de 3 s (cancela a requisicao) e depois cache: Wi-Fi ruim na quadra nao trava.
   - Dados das partidas ficam no localStorage, fora do cache, e nao sao tocados.
   Ao publicar uma versao nova, aumente o numero em CACHE. */
const PREFIX='setpoint-',CACHE=PREFIX+'v16';
const ESSENCIAIS=['./','./index.html','./manifest.webmanifest'];
const OPCIONAIS=['./logo.jpg','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png','./favicon-32.png','./favicon-48.png','./config.js'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(async c=>{await c.addAll(ESSENCIAIS);await Promise.allSettled(OPCIONAIS.map(f=>c.add(f)))}));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
const fresh=(req,ms)=>{const ac=new AbortController(),t=setTimeout(()=>ac.abort(),ms||3000);return fetch(req,{signal:ac.signal}).finally(()=>clearTimeout(t))};
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(fresh(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return r})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));
});
