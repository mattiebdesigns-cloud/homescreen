<script>
(async () => {
const out=[], h=window.__hd, wait=ms=>new Promise(r=>setTimeout(r,ms)), q=s=>document.querySelector(s), open=()=>q('#claude').classList.contains('open');
// Headless Chrome never finishes speaking aloud; make speech end at once so the follow-up window opens as it would.
try{ speechSynthesis.speak = u => setTimeout(() => u.onend && u.onend(), 20); }catch(e){}
const calls=[]; let hold=null; const realFetch=window.fetch;
window.fetch=async (url,opts)=>{ url=String(url);
  if (url.startsWith('https://api.anthropic.com')){
    const b=JSON.parse(opts.body); calls.push(b);
    if (calls.length===1) await new Promise(r=>{ hold=r; });     // keep the first answer pending so "Thinking…" can be seen
    const text = calls.length===1 ? 'Which album do you mean, the studio one or the live one?' : 'Playing the studio album.';
    return new Response(JSON.stringify({stop_reason:'end_turn',content:[{type:'text',text}]}),{status:200});
  }
  return realFetch(url,opts); };
h.heardInterim('yo claude');
out.push((open() && /Listening/.test(q('#cLive').textContent) && q('#bClaude').getAttribute('aria-pressed')==='true'?'PASS':'FAIL')+' "Yo Claude" opens the chat card right away');
h.heardInterim('yo claude play the whole');
out.push((q('#cLive').textContent==='“play the whole”'?'PASS':'FAIL')+' shows the words as they are said: '+q('#cLive').textContent);
h.heard('Yo Claude play the whole album with Walking Is Still Honest');
await wait(300);
out.push((h.chatLog()[0]==='me: play the whole album with Walking Is Still Honest' && q('#cLive').textContent===''?'PASS':'FAIL')+' the finished phrase is recorded as said: '+h.chatLog()[0]);
const w1=q('#cWork').textContent; await wait(2000); const w2=q('#cWork').textContent;
out.push((/^[·✢✳✶✻✽]Thinking…$/.test(w1) && /…$/.test(w2) && w2!==w1?'PASS':'FAIL')+' while working: "'+w1+'" then "'+w2+'"');
hold(); await wait(800);
out.push((h.lastReply()==='Which album do you mean, the studio one or the live one?' && q('#cWork').textContent===''?'PASS':'FAIL')+' Claude\'s question is recorded and the working words stop');
out.push((open()?'PASS':'FAIL')+' the chat stays open');
h.heard('the studio one'); await wait(300);
out.push((calls.length===2 && calls[1].messages.length===3 && calls[1].messages[2].content==='the studio one'?'PASS':'FAIL')+' a reply within 20 seconds needs no wake word and continues the conversation');
out.push((h.chatLog().join(' | ')==='me: play the whole album with Walking Is Still Honest | ai: Which album do you mean, the studio one or the live one? | me: the studio one | ai: Playing the studio album.'?'PASS':'FAIL')+' full chat recorded');
q('#cLog').click(); out.push((!open() && h.chatLog().length===0 && q('#bClaude').getAttribute('aria-pressed')==='false'?'PASS':'FAIL')+' clicking the card closes it and clears the chat');
await wait(4200);
h.heard('claude set a timer for 3 minutes');
out.push((open() && h.chatLog().join(' | ')==='me: set a timer for 3 minutes | note: Timer set for 3 minutes'?'PASS':'FAIL')+' "Claude" alone works as the first word; actions show as notes: '+h.chatLog().join(' | '));
q('#bClaude').click(); out.push((!open()?'PASS':'FAIL')+' the Claude button closes it');
h.heard('i asked claude about it yesterday'); h.heard('cloudy today'); h.heard('cloud set a timer for 4 minutes');
out.push((!open()?'PASS':'FAIL')+' talking about Claude or clouds does not open the chat');
q('#bClaude').click(); out.push((open() && document.activeElement===q('#cInput')?'PASS':'FAIL')+' the Claude button opens the chat ready to type');
q('#cInput').value='add oat milk to my shopping list'; q('#cForm').requestSubmit();
out.push((h.chatLog().join(' | ')==='me: add oat milk to my shopping list | note: Added to Shopping: oat milk' && open()?'PASS':'FAIL')+' typing in the box works and the chat stays open');
q('#cInput').dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); out.push((!open()?'PASS':'FAIL')+' Esc closes the chat');
const p=document.createElement('pre'); p.id='results'; p.textContent=out.join('\n'); document.body.appendChild(p);
})();
</script>
