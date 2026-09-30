/* Wren Hale — visit + click counting with GoatCounter (no cookies, no personal data).
   Amazon clicks are counted as events "amazon-<product id>" so HQ can show clicks per product. */
(function(){
  function send(path,title){try{if(window.goatcounter&&window.goatcounter.count)window.goatcounter.count({path:path,title:title||path,event:true});}catch(e){}}
  document.addEventListener('click',function(e){
    var a=e.target&&e.target.closest?e.target.closest('a[href]'):null; if(!a)return;
    var h=a.href||'', card=a.closest('[data-id]'), t=(a.textContent||'').replace(/\s+/g,' ').trim().slice(0,80);
    if(/amazon\.[a-z.]+\//.test(h)){
      var m=h.match(/[?&]k=([^&]+)/), q=m?decodeURIComponent(m[1].replace(/\+/g,' ')):'link';
      send('amazon-'+(card&&card.dataset.id?card.dataset.id:q.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,40)),t||q);
    } else if(/instagram\.com/.test(h)) send('out-instagram',t);
    else if(/pinterest\./.test(h)) send('out-pinterest',t);
  },true);
})();
