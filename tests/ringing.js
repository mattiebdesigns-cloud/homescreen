<script>
(async () => {
const out=[]; const h=window.__hd; localStorage.clear();
h.local('set a pasta timer for 1 second'); h.local('set an egg timer for 1 second');
await new Promise(r=>setTimeout(r,2500));
const t=document.querySelector('#ringTitle').textContent, s=document.querySelector('#ringSub').textContent;
out.push((/2 timers done/.test(t) && /pasta/.test(s) && /egg/.test(s) ? 'PASS':'FAIL')+' two due timers both ring: "'+t+'" / "'+s+'"');
h.local('set a tea timer for 1 second'); await new Promise(r=>setTimeout(r,2000));
out.push((/3 timers done/.test(document.querySelector('#ringTitle').textContent) ? 'PASS':'FAIL')+' timer due while ringing joins: "'+document.querySelector('#ringTitle').textContent+'"');
h.heard('stop'); out.push((!document.querySelector('#ring').classList.contains('show') ? 'PASS':'FAIL')+' "stop" dismisses all');
h.local('set a timer for 1 second'); await new Promise(r=>setTimeout(r,2000));
out.push((document.querySelector('#ringTitle').textContent==='Timer done' ? 'PASS':'FAIL')+' single timer title: "'+document.querySelector('#ringTitle').textContent+'"');
// bad hash must be refused
const bad = await new Promise(r=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/ical.js/1.5.0/ical.min.js?x';s.integrity='sha512-AAAA';s.crossOrigin='anonymous';s.onload=()=>r('loaded');s.onerror=()=>r('blocked');document.head.appendChild(s);});
out.push((bad==='blocked'?'PASS':'FAIL')+' wrong checksum is refused ('+bad+')');
const p=document.createElement('pre'); p.id='results'; p.textContent=out.join('\n'); document.body.appendChild(p);
})();
</script>
