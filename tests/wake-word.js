<script>
(async () => {
const out=[]; const h=window.__hd; localStorage.clear();
const before = () => h.state().clocks.length;
[['hey cloud set a timer for 5 minutes',1],['okay claude set a timer for 1 minute',1],['hey clyde, set a timer for 2 minutes',1],['set a timer for 3 minutes',0],['hey claudia set a timer for 4 minutes',1]]
 .forEach(([s,n]) => { const b=before(); h.heard(s); const got=before()-b; out.push((got===n?'PASS ':'FAIL ')+'wake: '+s+' -> '+got); });
const half=h.parseClock('half past 7'); out.push('half past 7 -> '+half.getHours()+':'+half.getMinutes());
const qt=h.parseClock('quarter to 8'); out.push('quarter to 8 -> '+qt.getHours()+':'+qt.getMinutes());
const p=document.createElement('pre'); p.id='results'; p.textContent=out.join('\n'); document.body.appendChild(p);
})();
</script>
