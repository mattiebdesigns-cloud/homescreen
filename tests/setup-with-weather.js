<script>localStorage.clear(); localStorage.setItem('hd_seenGuide','true'); localStorage.setItem('hd_voice','false'); localStorage.setItem('hd_key', JSON.stringify('test-not-a-key'));
localStorage.setItem('hd_place', JSON.stringify({name:'Philadelphia',lat:39.95,lon:-75.16}));
localStorage.setItem('hd_ical', JSON.stringify('https://calendar.google.com/calendar/ical/x/basic.ics'));
// A fake 16-day Open-Meteo answer, installed before the page asks for it.
(function(){
  const pad=n=>String(n).padStart(2,'0'), now=new Date(), ymd=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
  const days=[...Array(16)].map((_,i)=>{ const d=new Date(now); d.setDate(d.getDate()+i); return ymd(d); });
  const hours=[]; days.forEach(d=>{ for(let h=0;h<24;h++) hours.push(d+'T'+pad(h)+':00'); });
  const fake={ current:{time:ymd(now)+'T'+pad(now.getHours())+':15',temperature_2m:63.4,apparent_temperature:61.2,relative_humidity_2m:88,wind_speed_10m:7.6,weather_code:61,is_day:1},
    daily:{time:days,weather_code:days.map((_,i)=>[0,2,61,95][i%4]),temperature_2m_max:days.map((_,i)=>70+i),temperature_2m_min:days.map((_,i)=>50+i),
      precipitation_probability_max:days.map((_,i)=>i*6),sunrise:days.map(d=>d+'T07:12'),sunset:days.map(d=>d+'T18:31'),daylight_duration:days.map(()=>40740)},
    hourly:{time:hours,temperature_2m:hours.map((_,i)=>60+i%5),weather_code:hours.map(()=>3),is_day:hours.map(()=>1),precipitation_probability:hours.map((_,i)=>i%2?45:5)} };
  const real=window.fetch; window.__weatherUrl='';
  window.fetch=(url,opts)=>{ if (String(url).startsWith('https://api.open-meteo.com/')){ window.__weatherUrl=String(url); return Promise.resolve(new Response(JSON.stringify(fake),{status:200})); } return real(url,opts); };
})();
</script>
