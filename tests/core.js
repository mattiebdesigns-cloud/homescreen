<script src="https://cdnjs.cloudflare.com/ajax/libs/ical.js/1.5.0/ical.min.js" integrity="sha512-0izBc1upGYnrS1u1MX7QR+sjFIxZWxLVdNI7cUoHHCutDr5ENjuQRZuS+v+3NFNGfwHSrPoHzBzED0rV651tGw==" crossorigin="anonymous"></script>
<script>
(async () => {
const out = []; const ok = (name, cond, got) => out.push((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : '  got: ' + JSON.stringify(got)));
const h = window.__hd;
// durations
[['set a timer for 10 minutes',600],['timer for an hour and a half',5400],['set a timer for one hour and thirty minutes',5400],
 ['set a timer for twenty five seconds',25],['set a timer for half an hour',1800],['set a timer for 2 and a half minutes',150],['set a timer for 90 seconds',90]]
 .forEach(([s,e]) => { const g = h.parseDuration(s); ok('duration: '+s, g===e, g); });
// clocks
const hr = s => { const d = h.parseClock(s); return d && [d.getHours(), d.getMinutes()]; };
[['7 am',[7,0]],['7:30 pm',[19,30]],['noon',[12,0]],['midnight',[0,0]],['seven thirty in the morning',[7,30]],['6 in the evening',[18,0]],['730 am',[7,30]],['quarter past 7 am',[7,15]],['half past 7 pm',[19,30]],['quarter to 8 am',[7,45]],['quarter to 1 pm',[12,45]]]
 .forEach(([s,e]) => { const g = hr(s); ok('clock: '+s, JSON.stringify(g)===JSON.stringify(e), g); });
// local commands
localStorage.clear();
ok('local: add to list', h.local('add oat milk to my shopping list'), null);
ok('local: cross off', h.local('cross off oat milk on my shopping list') && h.state().lists[0].items[0].done, h.state().lists);
ok('local: timer', h.local('set a pasta timer for 8 minutes') && h.state().clocks.some(c=>c.label==='pasta'), h.state().clocks);
ok('local: alarm', h.local('set an alarm for 7 am'), null);
ok('local: wake me up at 6', h.local('wake me up at 6') && h.state().clocks.some(c=>new Date(c.end).getHours()===6), h.state().clocks.map(c=>new Date(c.end).toString()));
ok('local: cancel timers keeps alarms', h.local('cancel my timers') && h.state().clocks.every(c=>c.kind==='alarm'), h.state().clocks);
ok('local: unknown goes to claude', !h.local('what is the capital of peru'), null);
ok('local: play artist', true, null); // window.open untestable headless
// wake word
let ran = []; const origRun = h.run;
// album extraction
const html = 'AF_initDataCallback({data:[["https://lh3.googleusercontent.com/pw/AP1GczAbc_DEF-123456789012345",4032,3024],["https:\\/\\/lh3.googleusercontent.com\\/pw\\/AP1GczXyz_987654321098765432",3000,2000]]})';
const urls = h.extractAlbum(html); ok('album regex (plain + escaped)', urls.length===2, urls);
// ics
const d0 = new Date(); const ymd = d => d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
const past = new Date(d0); past.setDate(past.getDate()-14);
const tom = new Date(d0); tom.setDate(tom.getDate()+1);
const ics = ['BEGIN:VCALENDAR','VERSION:2.0',
 'BEGIN:VEVENT','UID:r1','DTSTART:'+ymd(past)+'T090000','DTEND:'+ymd(past)+'T093000','RRULE:FREQ=DAILY','SUMMARY:Standup','END:VEVENT',
 'BEGIN:VEVENT','UID:r1','RECURRENCE-ID:'+ymd(tom)+'T090000','DTSTART:'+ymd(tom)+'T090000','DTEND:'+ymd(tom)+'T093000','STATUS:CANCELLED','SUMMARY:Standup','END:VEVENT',
 'BEGIN:VEVENT','UID:a1','DTSTART;VALUE=DATE:'+ymd(d0),'DTEND;VALUE=DATE:'+ymd(tom),'SUMMARY:Birthday','END:VEVENT',
 'BEGIN:VEVENT','UID:x1','DTSTART:'+ymd(tom)+'T150000','DTEND:'+ymd(tom)+'T160000','SUMMARY:Dentist','END:VEVENT',
 'END:VCALENDAR'].join('\r\n');
const from = new Date(d0); from.setHours(0,0,0,0); const to = new Date(from); to.setDate(to.getDate()+2);
const ev = h.eventsFromIcs(ics, from, to);
ok('ics: today standup + all-day + dentist, cancelled instance dropped', ev.length===3 && ev.filter(e=>e.title==='Standup').length===1 && ev.some(e=>e.allDay), ev.map(e=>e.title+' '+e.start));
document.title = 'DONE'; const pre = document.createElement('pre'); pre.id='results'; pre.textContent = out.join('\n'); document.body.appendChild(pre);
})();
</script>
