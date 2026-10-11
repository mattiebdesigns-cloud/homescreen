<script>
(async () => {
const out=[], h=window.__hd, wait=ms=>new Promise(r=>setTimeout(r,ms)), q=s=>document.querySelector(s), w=q('#weather');
for (let i=0;i<40 && !w.classList.contains('ready');i++) await wait(250);
const sent=[]; const realFetch=window.fetch;
window.fetch=async (url,opts)=>{ url=String(url);
  if (url.startsWith('https://api.anthropic.com')){
    const b=JSON.parse(opts.body); sent.push(b);
    const r = sent.length===1 ? {stop_reason:'tool_use',content:[{type:'tool_use',id:'t1',name:'control_display',input:{action:'weather_hide_16_day'}}]}
                              : {stop_reason:'end_turn',content:[{type:'text',text:'Done, the 16-day forecast is hidden.'}]};
    return new Response(JSON.stringify(r),{status:200});
  }
  return realFetch(url,opts); };
const tool=sent=>sent.length ? sent[0].tools.find(t=>t.name==='control_display') : null;
h.run('clear the 16 day calendar please'); await wait(800);
out.push((sent.length===2?'PASS':'FAIL')+' "clear the 16 day calendar" went to Claude ('+sent.length+' calls)');
out.push((tool(sent) && tool(sent).input_schema.properties.action.enum.includes('calendar_month')?'PASS':'FAIL')+' Claude has the control_display tool');
out.push((/change what the display shows/.test(sent[0].system) && /nothing is deleted/.test(sent[0].system)?'PASS':'FAIL')+' Claude is told it can change the display');
out.push((/On screen: weather cards Today, Sun, Moon, Next hours, 16-day forecast; calendar day view/.test(sent[0].system)?'PASS':'FAIL')+' Claude sees what is on screen');
out.push((q('#wxLong').classList.contains('off') && sent[1].messages.at(-1).content[0].content==='Hid the 16-day forecast.'?'PASS':'FAIL')+' the tool hid the 16-day card and reported it');
out.push((h.lastReply()==='Done, the 16-day forecast is hidden.'?'PASS':'FAIL')+' Claude confirms instead of saying it cannot');
h.local('show the full forecast'); out.push((!document.querySelector('#weather .wxCard.off')?'PASS':'FAIL')+' voice: "show the full forecast"');
h.local('just today\'s weather'); out.push((q('#wxLong').classList.contains('off') && q('#wxHourly').classList.contains('off') && !q('#wxToday').classList.contains('off')?'PASS':'FAIL')+' voice: "just today\'s weather"');
h.local('show the full forecast'); h.local('hide the sixteen day forecast'); out.push((q('#wxLong').classList.contains('off') && !q('#wxHourly').classList.contains('off')?'PASS':'FAIL')+' voice: "hide the sixteen day forecast"');
out.push((h.controlDisplay('weather_hide_moon')==='Hid the moon card.' && q('#wxMoon').classList.contains('off')?'PASS':'FAIL')+' weather_hide_moon');
out.push((h.controlDisplay('calendar_month')==='Calendar switched to the month view.' && q('#calSeg button[data-v="month"]').getAttribute('aria-pressed')==='true'?'PASS':'FAIL')+' calendar_month');
out.push((h.controlDisplay('calendar_hide')==='Hid the calendar.' && !q('#cal').classList.contains('show')?'PASS':'FAIL')+' calendar_hide');
out.push((h.controlDisplay('news_show')==='Showing the news.' && q('#news').classList.contains('show')?'PASS':'FAIL')+' news_show');
out.push((h.controlDisplay('photos_pause')==='Slideshow paused.'?'PASS':'FAIL')+' photos_pause');
const p=document.createElement('pre'); p.id='results'; p.textContent=out.join('\n'); document.body.appendChild(p);
})();
</script>
