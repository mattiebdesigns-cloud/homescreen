<script>
(async () => {
const out=[], W=document.querySelector('#welcome'), open=()=>!W.classList.contains('hide');
const fake=document.createElement('canvas'); fake.width=8; fake.height=8; const url=fake.toDataURL();
// pretend photos are loaded by using the folder path code: feed a file list through the hidden input
const blob=await (await fetch(url)).blob(); const file=new File([blob],'a.png',{type:'image/png'});
const dt=new DataTransfer(); dt.items.add(file); const fb=document.querySelector('#fallback'); fb.files=dt.files; fb.dispatchEvent(new Event('change'));
await new Promise(r=>setTimeout(r,500));
out.push((window.__hd.state().photos===1 && !open()?'PASS':'FAIL')+' photos loaded, screen hidden');
const bp=document.querySelector('#bPhotos');
bp.click(); out.push((open() && W.classList.contains('closable')?'PASS':'FAIL')+' Photos… opens with close button');
bp.click(); out.push((!open()?'PASS':'FAIL')+' Photos… again closes');
bp.click(); document.querySelector('#wClose').click(); out.push((!open()?'PASS':'FAIL')+' × closes');
bp.click(); document.querySelector('#wAlbum').focus(); window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'})); 
// dispatch on the input so target is the input
bp.click(); if(!open()) bp.click(); const inp=document.querySelector('#wAlbum'); inp.focus(); inp.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
out.push((!open()?'PASS':'FAIL')+' Esc closes, even while typing in the box');
bp.click(); W.dispatchEvent(new MouseEvent('click',{bubbles:true})); out.push((!open()?'PASS':'FAIL')+' click outside closes');
const p=document.createElement('pre'); p.id='results'; p.textContent=out.join('\n'); document.body.appendChild(p);
})();
</script>
