<script>
(async () => {
const out=[]; const h=window.__hd; localStorage.clear();
const before = () => h.state().clocks.length;
[['hey cloud set a timer for 5 minutes',1],['okay claude set a timer for 1 minute',1],['hey clyde, set a timer for 2 minutes',1],['set a timer for 3 minutes',0],['hey claudia set a timer for 4 minutes',1]]
 .forEach(([s,n]) => { const b=before(); h.heard(s); const got=before()-b; out.push((got===n?'PASS ':'FAIL ')+'wake: '+s+' -> '+got); });
const wait=ms=>new Promise(r=>setTimeout(r,ms)), timers=()=>h.state().clocks.length;
await wait(4200); let c0=h.chimes(), n0=timers(); h.heard('yo claude set a timer for 6 minutes');
out.push((timers()===n0+1 && h.chimes()===c0+1?'PASS':'FAIL')+' "yo claude" + command: runs it and chimes once');
await wait(4200); c0=h.chimes(); h.heard('yo claude');
out.push((h.chimes()===c0+1 && /Listening/.test(document.querySelector('#cLive').textContent) && document.querySelector('#claude').classList.contains('open')?'PASS':'FAIL')+' "yo claude" alone: chime and "Listening…"');
n0=timers(); h.heard('set a timer for 7 minutes'); out.push((timers()===n0+1?'PASS':'FAIL')+' the next phrase is taken as the command');
await wait(4200); c0=h.chimes(); h.heardInterim('yo cl'); out.push((h.chimes()===c0?'PASS':'FAIL')+' half a wake word does not chime');
h.heardInterim('yo claude'); out.push((h.chimes()===c0+1?'PASS':'FAIL')+' chimes while the words are still coming in');
n0=timers(); h.heard('yo claude set a timer for 8 minutes'); out.push((h.chimes()===c0+1 && timers()===n0+1?'PASS':'FAIL')+' no second chime when the phrase finishes; command runs');
await wait(4200); c0=h.chimes(); h.heard('you know what i mean'); out.push((h.chimes()===c0?'PASS':'FAIL')+' ordinary talk does not chime');
const half=h.parseClock('half past 7'); out.push('half past 7 -> '+half.getHours()+':'+half.getMinutes());
const qt=h.parseClock('quarter to 8'); out.push('quarter to 8 -> '+qt.getHours()+':'+qt.getMinutes());
const p=document.createElement('pre'); p.id='results'; p.textContent=out.join('\n'); document.body.appendChild(p);
})();
</script>
