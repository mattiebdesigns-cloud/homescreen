<script>
(async () => {
const out=[]; const h=window.__hd;
const sent=[]; const realFetch=window.fetch;
window.fetch = async (url, opts) => {
  if (String(url).startsWith('https://api.anthropic.com')){
    const body=JSON.parse(opts.body); sent.push(body);
    const r = sent.length===1
      ? {stop_reason:'tool_use', content:[{type:'tool_use',id:'t1',name:'add_to_list',input:{list:'Shopping',items:['milk']}}]}
      : {stop_reason:'end_turn', content:[{type:'text',text:'Added milk.'}]};
    return new Response(JSON.stringify(r),{status:200,headers:{'content-type':'application/json'}});
  }
  return realFetch(url, opts);
};
h.run('add milk to my shopping list and set a 5 minute timer');
await new Promise(r=>setTimeout(r,1500));
out.push((sent.length===2?'PASS':'FAIL')+' two API rounds ('+sent.length+')');
out.push((sent.length===2 && sent[0].system===sent[1].system?'PASS':'FAIL')+' same snapshot in both rounds');
out.push((sent[1] && !/milk/i.test(sent[1].system.split('Lists:')[1]||'')?'PASS':'FAIL')+' round 2 snapshot does not show the just-added milk');
out.push((h.state().lists.some(l=>l.items.some(i=>i.t==='Milk'))?'PASS':'FAIL')+' milk actually added');
out.push((sent[0] && sent[0].model==='claude-sonnet-5' && sent[0].output_config.effort==='low'?'PASS':'FAIL')+' model + effort: '+(sent[0]&&sent[0].model));
out.push((window.__hd.lastReply()==='Added milk.'?'PASS':'FAIL')+' reply shown');
// short link message
const toast=document.querySelector('#toast');
document.querySelector('#wAlbum').value='https://photos.app.goo.gl/abcdefg12345';
document.querySelector('#albumRow').requestSubmit();
await new Promise(r=>setTimeout(r,6000));
out.push((/short album links no longer work/.test(toast.textContent)?'PASS':'FAIL')+' short-link message: '+toast.textContent.slice(0,60));
out.push((document.querySelector('#sVoice') ? 'PASS':'FAIL')+' voice picker present; voices visible headless: '+speechSynthesis.getVoices().length);
const p=document.createElement('pre'); p.id='results'; p.textContent=out.join('\n'); document.body.appendChild(p);
})();
</script>
