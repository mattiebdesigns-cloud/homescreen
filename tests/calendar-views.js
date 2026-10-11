<script src="https://cdnjs.cloudflare.com/ajax/libs/ical.js/1.5.0/ical.min.js" integrity="sha512-0izBc1upGYnrS1u1MX7QR+sjFIxZWxLVdNI7cUoHHCutDr5ENjuQRZuS+v+3NFNGfwHSrPoHzBzED0rV651tGw==" crossorigin="anonymous"></script>
<script>
(async () => {
const out=[], wait=ms=>new Promise(r=>setTimeout(r,ms)), q=s=>document.querySelector(s), h=window.__hd;
const pad=n=>String(n).padStart(2,'0'), now=new Date(), ymd=d=>d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate());
const at=(days,hh)=>{ const d=new Date(now); d.setDate(d.getDate()+days); return ymd(d)+'T'+pad(hh)+'0000'; };
const ev=(uid,days,hh,title)=>['BEGIN:VEVENT','UID:'+uid,'DTSTART:'+at(days,hh),'DTEND:'+at(days,hh+1),'SUMMARY:'+title,'END:VEVENT'];
const ics=['BEGIN:VCALENDAR','VERSION:2.0',...ev('a',0,23,'Late call'),...ev('b',2,10,'Dentist'),...ev('c',5,18,'Dinner'),...ev('d',20,9,'Far meeting'),...ev('p',-2,9,'Earlier thing'),'END:VCALENDAR'].join('\r\n');
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
// tap a day in the month grid: two days ahead if it is on this grid, otherwise two days back
const dt=n=>{ const d=new Date(now); d.setHours(0,0,0,0); d.setDate(d.getDate()+n); return d; }, iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const ahead=q('#calGrid .d[data-day="'+iso(dt(2))+'"]'), pickN=ahead?2:-2, cell=ahead||q('#calGrid .d[data-day="'+iso(dt(-2))+'"]'), want=ahead?'Dentist':'Earlier thing';
cell.click();
out.push((seg('day').getAttribute('aria-pressed')==='true' && list().includes(want) && !/Late call/.test(list()) && /← Today/.test(list()) && q('#calSub').textContent===dt(pickN).toLocaleDateString([], {weekday:'long',month:'long',day:'numeric'})?'PASS':'FAIL')+' tapping a day in the month opens that day: '+q('#calSub').textContent+' / '+list());
[...document.querySelectorAll('#calList li')].find(li=>li.textContent==='← Today').click();
out.push((/Late call/.test(list()) && !/← Today/.test(list())?'PASS':'FAIL')+' ← Today goes back to today');
seg('month').click(); q('#calGrid .d[data-day="'+iso(dt(2))+'"], #calGrid .d[data-day="'+iso(dt(-2))+'"]').click(); seg('day').click();
out.push((/Late call/.test(list()) && !/← Today/.test(list())?'PASS':'FAIL')+' the Day button also goes back to today');
seg('week').click(); const head=[...document.querySelectorAll('#calList li.day[data-day]')].find(li=>li.dataset.day===iso(dt(5)));
head.click(); out.push((/Dinner/.test(list()) && !/Dentist/.test(list()) && seg('day').getAttribute('aria-pressed')==='true'?'PASS':'FAIL')+' tapping a day heading in Week view opens that day');
h.local('show my week'); out.push((cfg_v()==='week'?'PASS':'FAIL')+' voice: "show my week"');
h.local('show today'); out.push((cfg_v()==='day' && !q('#calGrid')?'PASS':'FAIL')+' voice: "show today" (grid removed)');
function cfg_v(){ return [...document.querySelectorAll('#calSeg button')].find(b=>b.getAttribute('aria-pressed')==='true').dataset.v; }
const p=document.createElement('pre'); p.id='results'; p.textContent=out.join('\n'); document.body.appendChild(p);
})();
</script>
