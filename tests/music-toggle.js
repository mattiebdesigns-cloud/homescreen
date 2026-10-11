<script>
(async () => {
const out=[], h=window.__hd, wait=ms=>new Promise(r=>setTimeout(r,ms)), M=()=>h.state().music, card=document.querySelector('#player'), btn=document.querySelector('#bMusic');
const visible=()=>{ const r=card.getBoundingClientRect(); return getComputedStyle(card).display!=='none' && getComputedStyle(card).opacity!=='0' && r.right>0 && r.width>0; };
Object.defineProperty(HTMLMediaElement.prototype,'paused',{configurable:true,get(){ return !this._on; }});
HTMLMediaElement.prototype.play=function(){ this._on=true; this.dispatchEvent(new Event('play')); return Promise.resolve(); };
HTMLMediaElement.prototype.pause=function(){ this._on=false; this.dispatchEvent(new Event('pause')); };
HTMLMediaElement.prototype.load=function(){};
const realFetch=window.fetch;
window.fetch=async (url,opts)=>{ url=String(url);
  if (url.includes('endless-jam.onrender.com')) return new Response(JSON.stringify({display_name:'rec 2018',date_hint:'2018',stream_url:'/api/stream/t1'}),{status:200});
  if (url.startsWith('https://www.googleapis.com/youtube/v3/search')) return new Response(JSON.stringify({items:[{id:{videoId:'vid1'},snippet:{title:'Song',channelTitle:'Artist'}}]}),{status:200});
  return realFetch(url,opts); };
btn.click(); out.push((/Nothing is playing/.test(document.querySelector('#toast').textContent)?'PASS':'FAIL')+' Music button with nothing playing explains');
h.run('play khruangbin'); await wait(500);
out.push((visible() && btn.getAttribute('aria-pressed')==='true'?'PASS':'FAIL')+' card shows, button on');
const src=M().src; btn.click();
out.push((!visible() && M().open && M().src===src && btn.getAttribute('aria-pressed')==='false'?'PASS':'FAIL')+' Music button hides the card; YouTube player stays loaded');
out.push((localStorage.getItem('hd_musicHidden')==='true'?'PASS':'FAIL')+' remembered');
h.run('put on some jams'); await wait(500);
out.push((!visible() && M().radio?'PASS':'FAIL')+' radio starts with the card still hidden');
out.push((h.state().music.radioSrc.endsWith('/t1') && document.querySelector('#ytPlay').textContent==='⏸'?'PASS':'FAIL')+' radio playing while hidden');
h.local('next song'); await wait(300); out.push((M().radio?'PASS':'FAIL')+' voice controls still work while hidden');
h.local('show the music'); out.push((visible()?'PASS':'FAIL')+' "show the music"');
h.local('hide the player'); out.push((!visible() && M().radio?'PASS':'FAIL')+' "hide the player" keeps the radio on');
btn.click(); out.push((visible()?'PASS':'FAIL')+' Music button shows it again');
h.local('stop the music'); out.push((!M().radio && btn.getAttribute('aria-pressed')==='false'?'PASS':'FAIL')+' stopping turns the button off');
const p=document.createElement('pre'); p.id='results'; p.textContent=out.join('\n'); document.body.appendChild(p);
})();
</script>
