<script>
(async () => {
const out=[], h=window.__hd, wait=ms=>new Promise(r=>setTimeout(r,ms)), M=()=>h.state().music, card=document.querySelector('#player');
// Fake playback so no real audio is fetched or played.
Object.defineProperty(HTMLMediaElement.prototype,'paused',{configurable:true,get(){ return !this._on; }});
HTMLMediaElement.prototype.play=function(){ this._on=true; this.dispatchEvent(new Event('play')); return Promise.resolve(); };
HTMLMediaElement.prototype.pause=function(){ this._on=false; this.dispatchEvent(new Event('pause')); };
HTMLMediaElement.prototype.load=function(){};
const realFetch=window.fetch; let n=0, radioCalls=0;
window.fetch=async (url,opts)=>{ url=String(url);
  if (url.includes('endless-jam.onrender.com')){ radioCalls++; n++; return new Response(JSON.stringify({display_name:'rec 2018 Evening Primrose '+n,date_hint:'2018',stream_url:'/api/stream/track'+n}),{status:200}); }
  if (url.startsWith('https://www.googleapis.com/youtube/v3/search')) return new Response(JSON.stringify({items:[{id:{videoId:'vid1'},snippet:{title:'Song',channelTitle:'Artist'}}]}),{status:200});
  return realFetch(url,opts); };
window.open=()=>{ out.push('FAIL a pop-up was opened'); return {}; };
h.run('play khruangbin'); await wait(500);
out.push((M().open?'PASS':'FAIL')+' YouTube playing first');
h.run('put on some jams'); await wait(800);
out.push((M().radio && !M().open && card.classList.contains('show') && card.classList.contains('radio')?'PASS':'FAIL')+' jams replaces YouTube in the same card, no pop-up');
out.push((M().radioSrc==='https://endless-jam.onrender.com/api/stream/track1' && /Evening Primrose 1/.test(document.querySelector('#ytTitle').textContent) && document.querySelector('#ytBy').textContent==='Recorded 2018'?'PASS':'FAIL')+' shows the track and plays its stream');
out.push((document.querySelector('#player h2').textContent==='Endless Jam'?'PASS':'FAIL')+' card heading: '+document.querySelector('#player h2').textContent);
h.local('pause'); out.push((document.querySelector('#player h2').textContent==='Endless Jam · Paused' && document.querySelector('#ytPlay').textContent==='▶'?'PASS':'FAIL')+' "pause" pauses the radio');
h.local('resume'); await wait(100); out.push((document.querySelector('#player h2').textContent==='Endless Jam'?'PASS':'FAIL')+' "resume"');
h.local('next song'); await wait(500); out.push((M().radioSrc.endsWith('/track2')?'PASS':'FAIL')+' "next song" loads the next radio track');
h.local('turn it down'); out.push((Math.abs(M().radioVolume-0.8)<1e-9?'PASS':'FAIL')+' volume down -> '+M().radioVolume);
h.local('set a timer for 1 second'); await wait(1800);
out.push((Math.abs(M().radioVolume-0.24)<1e-9?'PASS':'FAIL')+' radio ducks while the timer rings -> '+M().radioVolume);
h.heard('stop'); out.push((Math.abs(M().radioVolume-0.8)<1e-9?'PASS':'FAIL')+' volume back after dismissing');
document.querySelector('#ytPlay').click(); out.push((document.querySelector('#player h2').textContent==='Endless Jam · Paused'?'PASS':'FAIL')+' ⏯ button pauses');
h.run('play khruangbin'); await wait(500);
out.push((M().open && !M().radio && !card.classList.contains('radio')?'PASS':'FAIL')+' a song replaces the radio');
h.run('put on some jams'); await wait(500);
h.local('stop the music'); out.push((!M().radio && !card.classList.contains('show')?'PASS':'FAIL')+' "stop the music" closes the radio card');
const p=document.createElement('pre'); p.id='results'; p.textContent=out.join('\n'); document.body.appendChild(p);
})();
</script>
