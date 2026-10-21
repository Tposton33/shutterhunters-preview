/* ShutterHunters V13 app install worker. Privacy-first: cache only public offline page. */
'use strict';
const CACHE='sh-pwa-v13-1';
const OFFLINE='./offline.html';
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.add(OFFLINE)));
 self.skipWaiting();
});
self.addEventListener('activate',event=>{
 event.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('sh-pwa-')&&key!==CACHE).map(key=>caches.delete(key)))),
  self.clients.claim()
 ]));
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 // Never intercept Supabase, Stripe, cross-origin images, POSTs, session or password URLs.
 if(request.method!=='GET'||request.mode!=='navigate')return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin||!url.pathname.startsWith(new URL('./',self.registration.scope).pathname))return;
 if(url.searchParams.has('sh_reset')||url.searchParams.has('code')||url.searchParams.has('token')||url.searchParams.has('type')||url.hash.includes('access_token'))return;
 event.respondWith(fetch(request).catch(()=>caches.match(OFFLINE)));
});