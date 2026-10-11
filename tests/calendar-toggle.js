<script>
(async () => {
const out=[], card=document.querySelector('#cal'), b=document.querySelector('#bCal'), shown=()=>card.classList.contains('show');
await new Promise(r=>setTimeout(r,1500));
out.push((shown() && b.getAttribute('aria-pressed')==='true'?'PASS':'FAIL')+' calendar shown by default, button on');
b.click(); out.push((!shown() && b.getAttribute('aria-pressed')==='false'?'PASS':'FAIL')+' button hides it');
out.push((localStorage.getItem('hd_calHidden')==='true'?'PASS':'FAIL')+' remembered');
b.click(); out.push((shown()?'PASS':'FAIL')+' button shows it again');
window.__hd.local('hide the calendar'); out.push((!shown()?'PASS':'FAIL')+' voice: hide the calendar');
window.__hd.local('show my calendar'); out.push((shown()?'PASS':'FAIL')+' voice: show my calendar');
const p=document.createElement('pre'); p.id='results'; p.textContent=out.join('\n'); document.body.appendChild(p);
})();
</script>
