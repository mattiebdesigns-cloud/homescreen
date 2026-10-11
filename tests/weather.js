<script>
(async () => {
const out=[], wait=ms=>new Promise(r=>setTimeout(r,ms)), q=s=>document.querySelector(s), shown=s=>getComputedStyle(q(s)).display!=='none';
for (let i=0;i<40 && !q('#weather').classList.contains('ready');i++) await wait(250);
out.push((/forecast_days=16/.test(window.__weatherUrl) && /sunrise,sunset,daylight_duration/.test(window.__weatherUrl) && /wind_speed_unit=mph/.test(window.__weatherUrl)?'PASS':'FAIL')+' asks Open-Meteo for 16 days, sun times and mph');
out.push((['#wxToday','#wxSun','#wxMoon','#wxHourly','#wxLong'].every(shown)?'PASS':'FAIL')+' five weather cards shown');
out.push((/Light rain/.test(q('#wxText').textContent) && /Feels 61° · Wind 8 mph · Humidity 88%/.test(q('#wxText').textContent) && q('#wxTemp').textContent==='63°'?'PASS':'FAIL')+' Today card: '+q('#wxText').textContent.replace(/\s+/g,' '));
out.push((/7:12/.test(q('#wxSunBody').textContent) && /6:31/.test(q('#wxSunBody').textContent) && /11 h 19 m of daylight/.test(q('#wxSunBody').textContent)?'PASS':'FAIL')+' Sun card: '+q('#wxSunBody').textContent);
out.push((document.querySelectorAll('.wxDay').length===16 && q('.wxDay b').textContent==='Today' && q('#wxLongLbl').textContent==='16 days'?'PASS':'FAIL')+' 16-day grid, starting today');
out.push((document.querySelectorAll('.wxHour').length===8?'PASS':'FAIL')+' 8 hourly entries');
const svg=q('#wxMoonBody svg'); out.push((svg && /% lit/.test(svg.getAttribute('aria-label')) && svg.querySelector('path')?'PASS':'FAIL')+' Moon picture: '+(svg&&svg.getAttribute('aria-label')));
// known phases: new moon 2026-10-10, full moon 2026-10-26
const h=window.__hd, n=h.moonPhase(new Date('2026-10-10T16:00:00Z')), f=h.moonPhase(new Date('2026-10-26T04:00:00Z')), fq=h.moonPhase(new Date('2026-10-18T16:00:00Z'));
out.push((n.lit<0.03 && f.lit>0.97 && Math.abs(fq.lit-0.5)<0.12 && /Waxing|First/.test(fq.name)?'PASS':'FAIL')+' moon phase matches known dates: new '+(n.lit*100).toFixed(1)+'%, first quarter '+(fq.lit*100).toFixed(0)+'% ('+fq.name+'), full '+(f.lit*100).toFixed(1)+'%');
q('#wxLong').click(); out.push((!shown('#wxLong') && shown('#wxHourly') && /Hid 16-day forecast/.test(q('#pill').textContent)?'PASS':'FAIL')+' clicking the 16-day card hides just that card');
q('#wxMoon').click(); out.push((!shown('#wxMoon') && shown('#wxSun') && shown('#wxToday')?'PASS':'FAIL')+' clicking the moon card hides just the moon');
out.push((JSON.parse(localStorage.getItem('hd_wxHidden')).join()==='wxLong,wxMoon'?'PASS':'FAIL')+' hidden cards remembered');
document.body.classList.add('active'); out.push((shown('#wxRestore')?'PASS':'FAIL')+' ↺ appears when the controls are showing');
document.body.classList.remove('active'); out.push((!shown('#wxRestore')?'PASS':'FAIL')+' ↺ hides with the other controls');
['#wxToday','#wxSun','#wxHourly'].forEach(s=>q(s).click());
out.push((!shown('.wxRow') && shown('#wxRestore')?'PASS':'FAIL')+' with every card hidden, ↺ stays visible so the weather can come back');
q('#wxRestore').click(); out.push((['#wxToday','#wxSun','#wxMoon','#wxHourly','#wxLong'].every(shown)?'PASS':'FAIL')+' ↺ shows every card again');
const p=document.createElement('pre'); p.id='results'; p.textContent=out.join('\n'); document.body.appendChild(p);
})();
</script>
