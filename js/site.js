/* Wren Hale — site.js: nav, shop-the-reel, filters, grid, hotspots, forms, reveal */
(function(){
  var D = window.WREN || null;
  var $ = function(s,c){return (c||document).querySelector(s);};
  var $$ = function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));};
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- nav ---- */
  var nav=$('#nav'); if(nav){window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>8);},{passive:true});}
  var bg=$('#burger'),menu=$('#menu');
  if(bg&&menu){bg.addEventListener('click',function(){var o=menu.classList.toggle('open');bg.setAttribute('aria-expanded',o?'true':'false');});
    $$('a',menu).forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open');bg.setAttribute('aria-expanded','false');});});}

  /* ---- reveal on scroll (visible at rest, animates in) ---- */
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('rv');io.unobserve(e.target);}});},{rootMargin:'0px 0px -6% 0px'});
    window.__observe=function(els){els.forEach(function(el,i){el.style.animationDelay=(i%4)*60+'ms';io.observe(el);});};
  } else { window.__observe=function(){}; }

  if(!D) return; /* pages without data (guides/about) stop here */

  var byId={}; D.products.forEach(function(p){byId[p.id]=p;});
  var amz=function(q){return 'https://www.amazon.com/s?k='+encodeURIComponent(q).replace(/%20/g,'+')+'&tag='+D.tag;};
  var kindLabel={DIY:'DIY',Find:'Find',Dupe:'Dupe'};
  var roomLabel={bedroom:'Bedroom',kitchen:'Kitchen',living:'Living room',bath:'Bathroom',entry:'Entry & closet'};

  /* ---- shop the reel ---- */
  var video=$('#reelVideo'),rlab=$('#reelLabel'),rprod=$('#reelProducts'),rnav=$('#reelNav');
  var cur=0;
  function showReel(i){
    cur=i; var r=D.reels[i];
    if(video){ video.pause(); video.setAttribute('poster',r.poster); video.src=r.video; video.load(); if(!reduce){video.play().catch(function(){});} }
    rlab.innerHTML='<b>'+r.hook+'</b><small>'+r.day+' · '+kindLabel[r.kind]+' · '+r.title+'</small>';
    rprod.innerHTML=r.products.map(function(id){var p=byId[id]; if(!p) return '';
      return '<a class="rp" href="'+amz(p.q)+'" target="_blank" rel="noopener sponsored">'+
        '<img src="'+p.img+'" alt="" loading="lazy"><div>'+(p.flag==='new'?'<span class="badge">New this week</span>':'')+
        '<b>'+p.name+'</b><span class="pr">About $'+p.price+'</span> <small>as of '+D.asOf+' · on Amazon</small>'+
        (p.dupe?'<small class="dupe" data-q="'+p.dupe+'">Out of stock? See the dupe</small>':'')+'</div></a>';}).join('');
    $$('.rp .dupe',rprod).forEach(function(d){d.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();window.open(amz(d.dataset.q),'_blank','noopener');});});
    $$('button',rnav).forEach(function(b,j){b.setAttribute('aria-pressed',j===i?'true':'false');});
  }
  if(rnav){
    rnav.innerHTML=D.reels.map(function(r,i){return '<button type="button" aria-pressed="false"><img src="'+r.poster+'" alt="">'+r.day+' · '+r.kind+'</button>';}).join('');
    $$('button',rnav).forEach(function(b,i){b.addEventListener('click',function(){showReel(i);});});
    showReel(0);
    if(video){video.addEventListener('ended',function(){showReel((cur+1)%D.reels.length);});}
    var prev=$('#reelPrev'),next=$('#reelNext');
    if(prev)prev.addEventListener('click',function(){showReel((cur-1+D.reels.length)%D.reels.length);});
    if(next)next.addEventListener('click',function(){showReel((cur+1)%D.reels.length);});
  }

  /* ---- filters + grid ---- */
  var state={room:'all',budget:'all',kind:'all',q:''};
  var grid=$('#grid'),count=$('#gridCount');
  function card(p){
    var reel=D.reels.filter(function(r){return r.products.indexOf(p.id)>-1;})[0];
    return '<div class="pc" data-id="'+p.id+'"><a class="main" href="'+amz(p.q)+'" target="_blank" rel="noopener sponsored">'+
      '<div class="pic"><img src="'+p.img+'" alt="'+p.name+'" loading="lazy">'+
      (p.flag==='new'?'<span class="flag">New this week</span>':p.flag==='restock'?'<span class="flag restock">Back in stock</span>':'')+
      '<span class="kind '+p.kind.toLowerCase()+'">'+kindLabel[p.kind]+'</span>'+(reel?'<span class="vid">▶ '+reel.day+' Reel</span>':'')+'</div>'+
      '<div class="body"><b>'+p.name+'</b><span class="why">'+p.why+'</span>'+
      '<div class="row"><span class="pr">About $'+p.price+'</span><span class="asof">as of '+D.asOf+'</span></div>'+
      '<span class="ret">On Amazon · '+roomLabel[p.room]+'</span></div></a>'+
      (p.dupe?'<div class="dupe">Sold out? <a href="'+amz(p.dupe)+'" target="_blank" rel="noopener sponsored">Similar one →</a></div>':'')+
      '</div>';
  }
  function render(){
    if(!grid) return;
    var q=state.q.trim().toLowerCase();
    var list=D.products.filter(function(p){
      if(state.room!=='all'&&p.room!==state.room) return false;
      if(state.kind!=='all'&&p.kind!==state.kind) return false;
      if(state.budget!=='all'&&p.price>parseInt(state.budget,10)) return false;
      if(q&&(p.name+' '+p.why+' '+roomLabel[p.room]).toLowerCase().indexOf(q)<0) return false;
      return true;});
    grid.innerHTML=list.length?list.map(card).join(''):'<div class="empty">Nothing under that filter yet. Try a bigger budget or another room.</div>';
    if(count) count.textContent=list.length+' of '+D.products.length+' finds';
    window.__observe($$('.pc',grid));
  }
  $$('.fgroup').forEach(function(g){var key=g.dataset.key;
    $$('button',g).forEach(function(b){b.addEventListener('click',function(){state[key]=b.dataset.v;$$('button',g).forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false');});render();});});});
  var search=$('#search'); if(search){search.addEventListener('input',function(){state.q=search.value;render();});}
  var clear=$('#clear'); if(clear){clear.addEventListener('click',function(){state={room:'all',budget:'all',kind:'all',q:''};if(search)search.value='';
    $$('.fgroup').forEach(function(g){$$('button',g).forEach(function(x){x.setAttribute('aria-pressed',x.dataset.v==='all'?'true':'false');});});render();});}
  /* deep link: #room-kitchen etc. */
  var h=(location.hash||'').replace('#','');
  if(/^room-/.test(h)){state.room=h.slice(5);$$('.fgroup[data-key="room"] button').forEach(function(x){x.setAttribute('aria-pressed',x.dataset.v===state.room?'true':'false');});}
  render();

  /* ---- hotspot rooms ---- */
  $$('.room').forEach(function(room){
    var links=$$('.legend a',room);
    $$('.hs',room).forEach(function(hs){
      var n=parseInt(hs.textContent,10)-1;
      hs.addEventListener('mouseenter',function(){links.forEach(function(l,i){l.classList.toggle('hi',i===n);});});
      hs.addEventListener('mouseleave',function(){links.forEach(function(l){l.classList.remove('hi');});});
      hs.addEventListener('click',function(){var l=links[n]; if(l){window.open(l.href,'_blank','noopener');}});
    });
  });

  /* ---- lead form (swap action for Mailchimp/Beehiiv) ---- */
  var lf=$('#leadForm'); if(lf){lf.addEventListener('submit',function(e){e.preventDefault();lf.hidden=true;$('#leadOk').hidden=false;});}

  window.__observe($$('.gcard,.room,.trust div,.about'));
})();
