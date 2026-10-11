<script>
(async () => {
const out=[], h=window.__hd, wait=ms=>new Promise(r=>setTimeout(r,ms)), M=()=>h.state().music;
const searches=[], opened=[], claude=[]; const realFetch=window.fetch;
window.open=(u)=>{ opened.push(u); return {}; };
window.fetch=async (url, opts)=>{
  url=String(url);
  if (url.startsWith('https://www.googleapis.com/youtube/v3/search')){
    searches.push(url);
    if (/q=topictest/.test(url)) return new Response(JSON.stringify({items:[
      {id:{videoId:'mv1'},snippet:{title:'Song (Official Video)',channelTitle:'ArtistVEVO'}},
      {id:{videoId:'tp1'},snippet:{title:'Song',channelTitle:'Artist - Topic'}},
      {id:{videoId:'live1'},snippet:{title:'Song (Live)',channelTitle:'KEXP'}},
      {id:{videoId:'tp2'},snippet:{title:'Other Song',channelTitle:'Artist - Topic'}}]}),{status:200});
    if (/q=broken/.test(url)) return new Response(JSON.stringify({error:{message:'API key not valid. Please pass a valid API key.',errors:[{reason:'badRequest'}]}}),{status:400});
    return new Response(JSON.stringify({items:[
      {id:{videoId:'vid1'},snippet:{title:'Khruangbin &amp; Leon Bridges - Texas Sun',channelTitle:'Khruangbin - Topic'}},
      {id:{videoId:'vid2'},snippet:{title:'August 10',channelTitle:'Khruangbin - Topic'}},
      {id:{videoId:'vid3'},snippet:{title:'Maria Tambi&#39;en',channelTitle:'Khruangbin - Topic'}}]}),{status:200});
  }
  if (url.startsWith('https://api.anthropic.com')){
    const body=JSON.parse(opts.body); claude.push(body);
    const r = claude.length===1 ? {stop_reason:'tool_use',content:[{type:'tool_use',id:'t1',name:'music_control',input:{action:'next'}}]}
                                : {stop_reason:'end_turn',content:[{type:'text',text:'Skipped.'}]};
    return new Response(JSON.stringify(r),{status:200});
  }
  return realFetch(url, opts);
};
h.run('play khruangbin'); await wait(800);
const s=searches[0]||'';
out.push((/videoEmbeddable=true/.test(s) && /videoCategoryId=10/.test(s) && /q=khruangbin/.test(s) && /key=AIzaTestNotARealKey_123/.test(s)?'PASS':'FAIL')+' searches embeddable music with the key');
out.push((M().open && /\/embed\/vid1\?/.test(M().src) && /playlist=vid2,vid3/.test(M().src) && /enablejsapi=1/.test(M().src) && /autoplay=1/.test(M().src)?'PASS':'FAIL')+' player opens with first result and the rest queued: '+M().src.slice(0,90));
out.push((document.querySelector('#player').classList.contains('show') && document.querySelector('#ytTitle').textContent==='Khruangbin & Leon Bridges - Texas Sun' && document.querySelector('#ytBy').textContent==='Khruangbin'?'PASS':'FAIL')+' card shows decoded title and artist without " - Topic"');
out.push((!/www-widgetapi|iframe_api/.test([...document.scripts].map(x=>x.src).join(' '))?'PASS':'FAIL')+' no YouTube script loaded into the page');
h.local('pause'); out.push((M().sent.at(-1)==='pauseVideo'?'PASS':'FAIL')+' "pause" pauses music while it is open');
h.local('resume the music'); out.push((M().sent.at(-1)==='playVideo'?'PASS':'FAIL')+' "resume the music"');
h.local('next song'); out.push((M().sent.at(-1)==='nextVideo'?'PASS':'FAIL')+' "next song"');
h.local('turn it down'); out.push((M().sent.at(-1)==='setVolume 80' && M().vol===80?'PASS':'FAIL')+' "turn it down" -> 80%');
h.local('set a timer for 1 second'); await wait(1800);
out.push((M().ducked && M().sent.at(-1)==='setVolume 24'?'PASS':'FAIL')+' music ducks while the timer rings ('+M().sent.at(-1)+')');
h.heard('stop'); out.push((!M().ducked && M().sent.at(-1)==='setVolume 80'?'PASS':'FAIL')+' volume restored after dismissing');
h.run('skip this one please'); await wait(800);
out.push((claude.length===2 && claude[1].messages.at(-1).content[0].content==='Done: next.'?'PASS':'FAIL')+' Claude can control the player (music_control tool)');
out.push((/Music player: .*Texas Sun/.test(claude[0].system)?'PASS':'FAIL')+' Claude sees what is playing');
h.local('stop the music'); out.push((!M().open && !document.querySelector('#player').classList.contains('show')?'PASS':'FAIL')+' "stop the music" closes the player');
const before=M().sent.length; h.local('next'); out.push((M().sent.length===before?'PASS':'FAIL')+' "next" goes back to photos once music is closed');
h.run('play topictest'); await wait(800);
out.push((/\/embed\/tp1\?/.test(M().src) && /playlist=tp2,mv1,live1/.test(M().src) && document.querySelector('#ytBy').textContent==='Artist'?'PASS':'FAIL')+' YouTube Music album tracks (Topic) play first, others after in order: '+(M().src.match(/embed\/(\w+)/)||[])[1]+' then '+(M().src.match(/playlist=([\w,]+)/)||[])[1]);
h.local('stop the music');
h.run('play broken'); await wait(800);
out.push((/not accepted/.test(document.querySelector('#toast').textContent) && opened.some(u=>/music\.youtube\.com\/search\?q=broken/.test(u))?'PASS':'FAIL')+' bad key: explains and falls back to a YouTube Music window');
localStorage.setItem('hd_ytKey','""');
const p=document.createElement('pre'); p.id='results'; p.textContent=out.join('\n'); document.body.appendChild(p);
})();
</script>
