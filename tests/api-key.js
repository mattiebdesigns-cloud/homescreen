<script>
(async () => {
const out=[]; const sent=[]; const realFetch=window.fetch;
window.fetch = async (url, opts) => {
  if (String(url).startsWith('https://api.anthropic.com')){
    new Headers(opts.headers);  // throws exactly like the phone did if a header has a bad character
    sent.push(opts.headers['x-api-key']);
    return new Response(JSON.stringify({stop_reason:'end_turn',content:[{type:'text',text:'ok'}]}),{status:200});
  }
  return realFetch(url, opts);
};
const S=document.querySelector('#sKey'), save=document.querySelector('#sSave');
async function trySave(k){ document.querySelector('#bSet').click(); S.value=k; save.click(); await new Promise(r=>setTimeout(r,400)); window.__hd.run('go to my shopping list'); await new Promise(r=>setTimeout(r,400)); return window.__hd.lastReply(); }
let r=await trySave(' sk-ant-api03-ABC–def_123​\n');
out.push((sent.at(-1)==='sk-ant-api03-ABC-def_123' && r==='ok'?'PASS':'FAIL')+' long dash + invisible chars cleaned -> sent "'+sent.at(-1)+'"');
r=await trySave('sk-ant-api03-AB…CD');
out.push((/shortened version/.test(r) && sent.length===1?'PASS':'FAIL')+' shortened key from the Console list is explained: '+r.slice(0,60));
out.push((/Claude key: .*shortened/.test(document.querySelector('#toast').textContent)?'PASS':'FAIL')+' warned on save');
r=await trySave('key: "sk-ant-api03-Quoted_456"');
out.push((sent.at(-1)==='sk-ant-api03-Quoted_456' && r==='ok'?'PASS':'FAIL')+' label and quotes removed -> sent "'+sent.at(-1)+'"');
r=await trySave('ｓｋ-ａｎｔ-api03-Wide789');
out.push((sent.at(-1)==='sk-ant-api03-Wide789' && r==='ok'?'PASS':'FAIL')+' full-width letters fixed -> sent "'+sent.at(-1)+'"');
r=await trySave('sk-ant-api03-Bad#Char');
out.push((/"#" \(U\+0023\) at character 17 of 21/.test(r) && !/Bad|Char/.test(r)?'PASS':'FAIL')+' names the bad character and its position without showing the key: '+r.slice(0,80));
const p=document.createElement('pre'); p.id='results'; p.textContent=out.join('\n'); document.body.appendChild(p);
})();
</script>
