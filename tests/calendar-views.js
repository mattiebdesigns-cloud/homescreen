<script src="https://cdnjs.cloudflare.com/ajax/libs/ical.js/1.5.0/ical.min.js" integrity="sha512-0izBc1upGYnrS1u1MX7QR+sjFIxZWxLVdNI7cUoHHCutDr5ENjuQRZuS+v+3NFNGfwHSrPoHzBzED0rV651tGw==" crossorigin="anonymous"></script>
<script>
(async () => {
const out=[], wait=ms=>new Promise(r=>setTimeout(r,ms)), q=s=>document.querySelector(s), h=window.__hd;
const pad=n=>String(n).padStart(2,'0'), now=new Date(), ymd=d=>d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate());
const at=(days,hh)=>{ const d=new Date(now); d.setDate(d.getDate()+days); return ymd(d)+'T'+pad(hh)+'0000'; };
const ev=(uid,days,hh,title)=>['BEGIN:VEVENT','UID:'+uid,'DTSTART:'+at(days,hh),'DTEND:'+at(days,hh+1),'SUMMARY:'+title,'END:VEVENT'];
const ics=['BEGIN:VCALENDAR','VERSION:2.0',...ev('a',0,23,'Late call'),...ev('b',2,10,'Dentist'),...ev('c',5,18,'Dinner'),...ev('d',20,9,'Far meeting'),'END:VCALENDAR'].join('\r\n');
await h.calendarText(ics);
const seg=v=>q('#calSeg button[data-v="'+v+'"]'), list=()=>q('#calList').textContent;
out.push((seg('day').getAttribute('aria-pressed')==='true' && /Late call/.test(list()) && !/Dinner/.test(list())?'PASS':'FAIL')+' Day view: today only (plus tomorrow if room)');
seg('week').click();
out.push((/Late call/.test(list()) && /Dentist/.test(list()) && /Dinner/.test(list()) && !/Far meeting/.test(list()) && seg('week').getAttribute('aria-pressed')==='true'?'PASS':'FAIL')+' Week view: next 7 days grouped by day');
out.push((localStorage.getItem('hd_calView')==='"week"'?'PASS':'FAIL')+' view remembered');
seg('month').click();
const cells=[...document.querySelectorAll('#calGrid .d')], today=document.querySelector('#calGrid .d.today');
out.push((cells.length%7===0 && cells.length>=28 && today && today.textContent.startsWith(String(now.getDate())) && today.querySelector('.dots')?'PASS':'FAIL')+' Month view: grid of '+cells.length+' days, today marked with a dot');
out.push((/Coming up/.test(list()) && /Dentist/.test(list())?'PASS':'FAIL')+' Month view lists what is coming up');
out.push((q('#calSub').textContent===now.toLocaleDateString([], {month:'long',year:'numeric'})?'PASS':'FAIL')+' Month view title: '+q('#calSub').textContent);
h.local('show my week'); out.push((cfg_v()==='week'?'PASS':'FAIL')+' voice: "show my week"');
h.local('show today'); out.push((cfg_v()==='day' && !q('#calGrid')?'PASS':'FAIL')+' voice: "show today" (grid removed)');
function cfg_v(){ return [...document.querySelectorAll('#calSeg button')].find(b=>b.getAttribute('aria-pressed')==='true').dataset.v; }
const p=document.createElement('pre'); p.id='results'; p.textContent=out.join('\n'); document.body.appendChild(p);
})();
</script>
