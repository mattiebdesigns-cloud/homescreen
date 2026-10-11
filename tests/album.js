<script>
(async () => {
const out=[], h=window.__hd, wait=ms=>new Promise(r=>setTimeout(r,ms)), M=()=>h.state().music, q=s=>document.querySelector(s);
const albums=h.ytmAlbums(window.__ytmFixture), axl=albums.find(a=>a.title==='Reinventing Axl Rose');
out.push((axl && axl.type==='Album' && axl.artist==='Against Me!' && axl.id==='OLAK5uy_kNOKpTV004gNfXW8DeQhYT0z66k_-Ruqs'?'PASS':'FAIL')+' reads albums from a real YouTube Music search page: '+JSON.stringify(axl));
const claude=[], lookups=[]; const realFetch=window.fetch;
window.fetch=async (url,opts)=>{ url=String(url);
  if (url.includes('music.youtube.com') && url.includes('search')){ lookups.push(decodeURIComponent(url)); return new Response(window.__ytmFixture,{status:200}); }
  if (url.startsWith('https://www.googleapis.com/youtube/v3/playlistItems')) return new Response(JSON.stringify({items:[
    {snippet:{position:2,title:'Walking is Still Honest',resourceId:{videoId:'t3'}}},{snippet:{position:0,title:'Pints of Guinness Make You Strong',resourceId:{videoId:'t1'}}},
    {snippet:{position:1,title:'Baby, I&#39;m an Anarchist!',resourceId:{videoId:'t2'}}},{snippet:{position:3,title:'Deleted video',resourceId:{videoId:'gone'}}}]}),{status:200});
  if (url.startsWith('https://www.googleapis.com/youtube/v3/search')) return new Response(JSON.stringify({items:[{id:{videoId:'song1'},snippet:{title:'Song',channelTitle:'Artist - Topic'}}]}),{status:200});
  if (url.startsWith('https://api.anthropic.com')){
    const b=JSON.parse(opts.body); claude.push(b);
    const r = claude.length===1 ? {stop_reason:'tool_use',content:[{type:'tool_use',id:'t1',name:'play_music',input:{query:'Reinventing Axl Rose Against Me!',kind:'album'}}]}
                                : {stop_reason:'end_turn',content:[{type:'text',text:'Playing Reinventing Axl Rose from the top.'}]};
    return new Response(JSON.stringify(r),{status:200});
  }
  return realFetch(url,opts); };
h.run('play the whole album that includes the track walking is still honest'); await wait(1200);
out.push((claude.length===2?'PASS':'FAIL')+' an album request goes to Claude first ('+claude.length+' calls)');
const tool=claude[0] && claude[0].tools.find(t=>t.name==='play_music');
out.push((tool && tool.input_schema.properties.kind.enum.join()==='song,album' && /album .* from the first track/.test(claude[0].system)?'PASS':'FAIL')+' Claude has an album option and is told to work out the album first');
out.push((/\/embed\/t1\?/.test(M().src) && /playlist=t2,t3(&|$)/.test(M().src)?'PASS':'FAIL')+' plays from track 1 in album order, skipping deleted tracks: '+(M().src.match(/embed\/(\w+)/)||[])[1]+' then '+(M().src.match(/playlist=([\w,]+)/)||[])[1]);
out.push((/Reinventing Axl Rose/.test(q('#player h2').textContent) && q('#ytTitle').textContent==='Pints of Guinness Make You Strong'?'PASS':'FAIL')+' card: "'+q('#player h2').textContent+'" / '+q('#ytTitle').textContent);
out.push((claude[1] && /Playing the album "Reinventing Axl Rose" by Against Me! from track 1 \(3 tracks\)/.test(claude[1].messages.at(-1).content[0].content)?'PASS':'FAIL')+' Claude is told exactly what started');
const n=claude.length; h.run('play the album reinventing axl rose'); await wait(800);
out.push((claude.length===n && /search\?q=reinventing(%20| )axl(%20| )rose$/i.test(lookups.at(-1)) && /\/embed\/t1\?/.test(M().src)?'PASS':'FAIL')+' "play the album …" works directly, without Claude');
h.run('play khruangbin'); await wait(800);
out.push((claude.length===n && /\/embed\/song1\?/.test(M().src) && !/·/.test(q('#player h2').textContent)?'PASS':'FAIL')+' a plain "play …" still skips Claude and plays a song');
const p=document.createElement('pre'); p.id='results'; p.textContent=out.join('\n'); document.body.appendChild(p);
})();
</script>
