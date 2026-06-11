/* NotchNest interactive hero notch — behaviour */
(function () {
  var root = document.getElementById('nnx');
  if (!root) return;
  var wrap = root.closest('.nnx-wrap');

  /* ---------- expand / collapse ---------- */
  function open(){ root.classList.add('open'); }
  function close(){ root.classList.remove('open'); stopMirror(); }
  root.addEventListener('mouseenter', open);
  if (wrap) wrap.addEventListener('mouseleave', close);
  root.addEventListener('click', function(e){
    if (!root.classList.contains('open')) { open(); }
  });
  // keyboard a11y
  root.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); root.classList.toggle('open'); }});

  /* ---------- hero CTA opens + scrolls to notch ---------- */
  var heroBtn = document.getElementById('hero-open-btn');
  if (heroBtn) heroBtn.addEventListener('click', function(){
    if (wrap) wrap.scrollIntoView({behavior:'smooth', block:'center'});
    setTimeout(open, 300);
  });

  /* ---------- tabs ---------- */
  var tabs = root.querySelectorAll('.nnx-tab');
  var views = root.querySelectorAll('.nnx-view');
  function show(name){
    tabs.forEach(function(t){ t.classList.toggle('active', t.dataset.tab===name); });
    views.forEach(function(v){ v.classList.toggle('show', v.dataset.view===name); });
    if (name!=='home') stopMirror();
    if (name==='game') initGame();
  }
  tabs.forEach(function(t){ t.addEventListener('click', function(ev){ ev.stopPropagation(); show(t.dataset.tab); }); });
  var sysClose = root.querySelector('.nnx-close');
  if (sysClose) sysClose.addEventListener('click', function(e){ e.stopPropagation(); close(); });

  /* ---------- MUSIC (working scrubber + play) ---------- */
  var TRACKS = [
    {t:'W.T.P.', a:'Eminem', dur:238},
    {t:'Not Afraid', a:'Eminem', dur:248},
    {t:'Till I Collapse', a:'Eminem', dur:297},
    {t:'Lose Yourself', a:'Eminem', dur:326}
  ];
  var mi=0, mpos=42, mplaying=true, mtimer=null;
  var mt=root.querySelector('.nnx-mtitle'), ma=root.querySelector('.nnx-martist');
  var mfill=root.querySelector('.nnx-mfill'), mcur=root.querySelector('.nnx-mcur'), mdur=root.querySelector('.nnx-mdur');
  var mplay=root.querySelector('.nnx-mplay');
  function fmt(s){ s=Math.max(0,Math.floor(s)); return Math.floor(s/60)+':'+('0'+(s%60)).slice(-2); }
  function renderMusic(){
    var tr=TRACKS[mi];
    if(mt) mt.textContent=tr.t; if(ma) ma.textContent=tr.a;
    if(mfill) mfill.style.width=(mpos/tr.dur*100)+'%';
    if(mcur) mcur.textContent=fmt(mpos); if(mdur) mdur.textContent=fmt(tr.dur);
    if(mplay) mplay.textContent=mplaying?'⏸':'▶';
  }
  function musicTick(){
    if(!mplaying) return;
    mpos++; if(mpos>=TRACKS[mi].dur){ mi=(mi+1)%TRACKS.length; mpos=0; }
    renderMusic();
  }
  mtimer=setInterval(musicTick,1000);
  if(mplay) mplay.addEventListener('click', function(e){ e.stopPropagation(); mplaying=!mplaying; renderMusic(); });
  var mnext=root.querySelector('.nnx-mnext'), mprev=root.querySelector('.nnx-mprev');
  if(mnext) mnext.addEventListener('click', function(e){ e.stopPropagation(); mi=(mi+1)%TRACKS.length; mpos=0; renderMusic(); });
  if(mprev) mprev.addEventListener('click', function(e){ e.stopPropagation(); mpos=0; renderMusic(); });
  var scrub=root.querySelector('.nnx-scrub');
  if(scrub) scrub.addEventListener('click', function(e){ e.stopPropagation(); var r=scrub.getBoundingClientRect(); mpos=Math.round((e.clientX-r.left)/r.width*TRACKS[mi].dur); renderMusic(); });
  renderMusic();

  /* ---------- CALENDAR (today) ---------- */
  var d=new Date();
  var mon=root.querySelector('.nnx-month'); if(mon) mon.textContent=d.toLocaleDateString('en',{month:'short'});
  var days=root.querySelectorAll('.nnx-day');
  if(days.length===3){
    for(var i=0;i<3;i++){
      var dd=new Date(d); dd.setDate(d.getDate()+i-1);
      days[i].querySelector('.dn').textContent=dd.toLocaleDateString('en',{weekday:'short'});
      days[i].querySelector('b').textContent=dd.getDate();
      days[i].classList.toggle('on', i===1);
    }
  }

  /* ---------- TIMER (Focus blue / Rest green) ---------- */
  var tEl=root.querySelector('.nnx-timer'), tDisp=root.querySelector('.nnx-tdisp'), tPh=root.querySelector('.nnx-tph'), tPlay=root.querySelector('.nnx-tplay');
  var FOCUS=25*60, REST=5*60, tmode='focus', trem=FOCUS, trun=false, tint=null;
  function renderT(){
    if(tDisp) tDisp.textContent=fmt(trem);
    if(tEl){ tEl.classList.toggle('focus',tmode==='focus'); tEl.classList.toggle('rest',tmode==='rest'); }
    if(tPh) tPh.innerHTML=(tmode==='focus'?'⏱ Focus':'<span class="ic">🌱</span> Rest')+' (1/1)';
    if(tPlay) tPlay.textContent=trun?'⏸':'▶';
  }
  function tTick(){ if(!trun)return; if(trem>0){trem--;renderT();} else { tmode=tmode==='focus'?'rest':'focus'; trem=tmode==='focus'?FOCUS:REST; renderT(); } }
  if(tPlay) tPlay.addEventListener('click',function(e){ e.stopPropagation(); trun=!trun; if(!tint)tint=setInterval(tTick,1000); renderT(); });
  var tReset=root.querySelector('.nnx-treset');
  if(tReset) tReset.addEventListener('click',function(e){ e.stopPropagation(); trun=false; tmode='focus'; trem=FOCUS; renderT(); });
  var tSkip=root.querySelector('.nnx-tskip');
  if(tSkip) tSkip.addEventListener('click',function(e){ e.stopPropagation(); tmode=tmode==='focus'?'rest':'focus'; trem=tmode==='focus'?FOCUS:REST; renderT(); });
  renderT();

  /* ---------- NOTES (type + AI rephrase + save, localStorage) ---------- */
  var nTa=root.querySelector('.nnx-ntext'), nSave=root.querySelector('.nnx-nsave'), nReph=root.querySelector('.nnx-nrephrase'), nList=root.querySelector('.nnx-nlist');
  function rephrase(s){
    s=s.trim(); if(!s) return s;
    var out=s.charAt(0).toUpperCase()+s.slice(1);
    out=out.replace(/\bhey\b/i,'Hi there!').replace(/\bgonna\b/i,'going to').replace(/\bwanna\b/i,'want to').replace(/\bu\b/gi,'you');
    if(!/[.!?]$/.test(out)) out+='.';
    return out;
  }
  if(nReph) nReph.addEventListener('click',function(e){ e.stopPropagation(); if(nTa) nTa.value=rephrase(nTa.value); });
  if(nSave) nSave.addEventListener('click',function(e){ e.stopPropagation(); var v=(nTa&&nTa.value||'').trim(); if(!v)return; if(nList){var p=document.createElement('div');p.className='nnx-note-saved';p.style.cssText='font-size:10px;color:#aaa;margin-top:4px';p.textContent='“'+v+'”';nList.prepend(p);} if(nTa)nTa.value=''; });

  /* ---------- MIRROR (real webcam) ---------- */
  var mir=root.querySelector('.nnx-mirror'), mirVid=root.querySelector('.nnx-mirror video'), mstream=null;
  function stopMirror(){ if(mstream){ mstream.getTracks().forEach(function(t){t.stop();}); mstream=null; } if(mir)mir.classList.remove('live'); if(wrap)wrap.classList.remove('cam-on'); }
  if(mir) mir.addEventListener('click',function(e){
    e.stopPropagation();
    if(mir.classList.contains('live')){ stopMirror(); return; }
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia) return;
    navigator.mediaDevices.getUserMedia({video:true}).then(function(s){
      mstream=s; if(mirVid){mirVid.srcObject=s; mirVid.play();} mir.classList.add('live'); if(wrap)wrap.classList.add('cam-on');
    }).catch(function(){});
  });

  /* ---------- TRAY / AirDrop dropzone ---------- */
  var drop=root.querySelector('.nnx-drop');
  if(drop){
    ['dragenter','dragover'].forEach(function(ev){ drop.addEventListener(ev,function(e){e.preventDefault();drop.classList.add('over');}); });
    ['dragleave','drop'].forEach(function(ev){ drop.addEventListener(ev,function(e){e.preventDefault();drop.classList.remove('over'); if(ev==='drop')drop.classList.add('dropped');}); });
  }

  /* ---------- CLIPBOARD (cards, search, pin, delete) ---------- */
  var SEED=[
    {x:'On August 12, 2026, the company reported a 15.7% increase in revenue, reaching record highs.',t:11,pin:true},
    {x:"Hey! Hope you're having a great day.",t:22,pin:false},
    {x:"Water covers approximately 71% of Earth's surface.",t:30,pin:false},
    {x:'The application uses a client-server architecture where the frontend communicates with the API.',t:44,pin:false},
    {x:'The sun slowly disappeared behind the hills as birds returned to their nests. A cool breeze.',t:62,pin:false}
  ];
  var cardsWrap=root.querySelector('.nnx-cards'), clipSearch=root.querySelector('.nnx-clipsearch'), clipClear=root.querySelector('.nnx-clipclear');
  function ago(s){ if(s<60)return s+' sec ago'; var m=Math.floor(s/60); return m+' min ago'; }
  function renderClip(filter){
    if(!cardsWrap) return; cardsWrap.innerHTML='';
    SEED.filter(function(c){ return !filter || c.x.toLowerCase().indexOf(filter.toLowerCase())>=0; })
      .sort(function(a,b){ return (b.pin?1:0)-(a.pin?1:0); })
      .forEach(function(c){
        var el=document.createElement('div'); el.className='nnx-cb'+(c.pin?' pinned':'');
        el.innerHTML='<div class="txt">'+c.x.replace(/</g,'&lt;')+'</div>'+
          '<div class="meta"><span>'+ago(c.t)+'</span><span class="sp"></span>'+
          '<button class="pin'+(c.pin?' on':'')+'" title="Pin">📌</button>'+
          '<button class="cp" title="Copy">📄</button>'+
          '<button class="del" title="Delete">🗑</button></div>';
        el.querySelector('.pin').addEventListener('click',function(e){e.stopPropagation();c.pin=!c.pin;renderClip(clipSearch&&clipSearch.value);});
        el.querySelector('.del').addEventListener('click',function(e){e.stopPropagation();var k=SEED.indexOf(c);if(k>=0)SEED.splice(k,1);renderClip(clipSearch&&clipSearch.value);});
        el.querySelector('.cp').addEventListener('click',function(e){e.stopPropagation();if(navigator.clipboard)navigator.clipboard.writeText(c.x).catch(function(){});});
        cardsWrap.appendChild(el);
      });
  }
  if(clipSearch) clipSearch.addEventListener('input',function(){ renderClip(clipSearch.value); });
  if(clipClear) clipClear.addEventListener('click',function(e){ e.stopPropagation(); SEED.length=0; renderClip(); });
  renderClip();

  /* ---------- deep-link / autodemo (?nnx=home|tray|game|clip) ---------- */
  try {
    var qp = new URLSearchParams(location.search).get('nnx');
    if (qp) { open(); show(qp); }
  } catch(e){}

  /* ---------- GAME (chicken runner, canvas) ---------- */
  var gameInited=false;
  function initGame(){
    if(gameInited) return; gameInited=true;
    var cv=root.querySelector('.nnx-gcanvas'); if(!cv) return;
    var ctx=cv.getContext('2d');
    var W=cv.width=cv.offsetWidth, H=cv.height=cv.offsetHeight;
    var ground=H-22, x=40, y=ground, vy=0, run=false, score=0, obs=[], spawn=0;
    var startEl=root.querySelector('.nnx-gstart'), hintEl=root.querySelector('.nnx-ghint');
    function jump(){ if(!run){ run=true; if(startEl)startEl.style.display='none'; if(hintEl)hintEl.style.opacity='.4'; return;} if(y>=ground){ vy=-7.5; } }
    function key(e){ if(e.code==='Space'){ e.preventDefault(); jump(); } }
    root.addEventListener('keydown',key);
    cv.addEventListener('click',function(e){ e.stopPropagation(); jump(); });
    function loop(){
      if(!root.classList.contains('open') || !root.querySelector('.nnx-view[data-view="game"]').classList.contains('show')){ requestAnimationFrame(loop); return; }
      ctx.clearRect(0,0,W,H);
      // ground
      ctx.fillStyle='#1f8a3b'; ctx.fillRect(0,ground+14,W,8);
      ctx.fillStyle='#2bb14e'; ctx.fillRect(0,ground+12,W,3);
      if(run){
        vy+=0.4; y+=vy; if(y>ground){y=ground;vy=0;}
        spawn--; if(spawn<=0){ obs.push({x:W,w:8,h:10+Math.random()*14}); spawn=70+Math.random()*40; }
        for(var i=obs.length-1;i>=0;i--){ obs[i].x-=3; if(obs[i].x<-10)obs.splice(i,1); }
        score++;
      }
      // obstacles (cacti)
      ctx.fillStyle='#c0843a';
      obs.forEach(function(o){ ctx.fillRect(o.x,ground+14-o.h,o.w,o.h); });
      // chicken (simple)
      ctx.font='18px serif'; ctx.fillText('🐔',x-6,y+8);
      // collision
      obs.forEach(function(o){ if(Math.abs(o.x-x)<12 && y>ground-o.h){ run=false; if(startEl){startEl.style.display='block';startEl.textContent='GAME OVER — START';} y=ground; obs=[]; score=0; } });
      requestAnimationFrame(loop);
    }
    loop();
  }
})();
