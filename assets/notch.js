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
  var hoverSwitchTimer=null;
  tabs.forEach(function(t){
    t.addEventListener('click', function(ev){ ev.stopPropagation(); show(t.dataset.tab); });
    t.addEventListener('mouseenter', function(){
      if(!root.classList.contains('open')) return;
      clearTimeout(hoverSwitchTimer);
      hoverSwitchTimer=setTimeout(function(){ show(t.dataset.tab); }, 80);
    });
    t.addEventListener('mouseleave', function(){ clearTimeout(hoverSwitchTimer); });
  });
  var sysClose = root.querySelector('.nnx-close');
  if (sysClose) sysClose.addEventListener('click', function(e){ e.stopPropagation(); close(); });

  /* ---------- MUSIC (working scrubber + play) ---------- */
  var TRACKS = [
    {t:'Lose Yourself', a:'Eminem', dur:322, art:'assets/music/lose-yourself.jpg'},
    {t:'Without Me', a:'Eminem', dur:290, art:'assets/music/without-me.jpg'},
    {t:'The Real Slim Shady', a:'Eminem', dur:284, art:'assets/music/real-slim-shady.jpg'},
    {t:'Not Afraid', a:'Eminem', dur:248, art:'assets/music/not-afraid.jpg'},
    {t:'Mockingbird', a:'Eminem', dur:251, art:'assets/music/mockingbird.jpg'},
    {t:'Godzilla', a:'Eminem feat. Juice WRLD', dur:211, art:'assets/music/godzilla.jpg'}
  ];
  var mi=0, mpos=72, mplaying=true, mtimer=null;
  var mt=root.querySelector('.nnx-mtitle'), ma=root.querySelector('.nnx-martist');
  var mfill=root.querySelector('.nnx-mfill'), mcur=root.querySelector('.nnx-mcur'), mdur=root.querySelector('.nnx-mdur');
  var mplay=root.querySelector('.nnx-mplay');
  var mcover=root.querySelector('.nnx-cover'), mpillart=root.querySelector('.nnx-pill-art');
  function fmt(s){ s=Math.max(0,Math.floor(s)); return Math.floor(s/60)+':'+('0'+(s%60)).slice(-2); }
  function renderMusic(){
    var tr=TRACKS[mi];
    if(mt) mt.textContent=tr.t; if(ma) ma.textContent=tr.a;
    if(mfill) mfill.style.width=(mpos/tr.dur*100)+'%';
    if(mcur) mcur.textContent=fmt(mpos); if(mdur) mdur.textContent=fmt(tr.dur);
    if(mcover) mcover.style.backgroundImage="url('"+tr.art+"')";
    if(mpillart) mpillart.style.backgroundImage="url('"+tr.art+"')";
    if(mplay) mplay.innerHTML = mplaying
      ? '<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zm6 0h4v14h-4z"/></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M7 5l12 7-12 7z"/></svg>';
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

  /* ---------- TIMER (Focus blue / Rest green; space-between layout) ---------- */
  var tEl=root.querySelector('.nnx-timer'), tDisp=root.querySelector('.nnx-tdisp'),
      tLbl=root.querySelector('.nnx-tph .lbl'), tPlay=root.querySelector('.nnx-tplay'),
      tIc=root.querySelector('.nnx-tic'),
      tFill=root.querySelector('.nnx-timer .ul i');
  var FOCUS=25*60, REST=5*60, tmode='focus', tmax=FOCUS, trem=FOCUS, trun=false, tint=null;
  var SF_BRAIN='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 2.4c-1.2 0-2.3.7-2.8 1.8a2.5 2.5 0 0 0-2.8 2.5c0 .5.1 1 .4 1.4a2.5 2.5 0 0 0-.5 4.1 2.4 2.4 0 0 0 .8 3.6 2.6 2.6 0 0 0 .9 3 3 3 0 0 0 5.6-1.5V4.4c0-1.1-.9-2-2-2h-.6zm5.2 0c-1.1 0-2 .9-2 2v13c0 1.7 1.4 3 3 3a3 3 0 0 0 2.6-1.6 2.6 2.6 0 0 0 .9-3 2.4 2.4 0 0 0 .8-3.6 2.5 2.5 0 0 0-.5-4.1c.3-.4.4-.9.4-1.4a2.5 2.5 0 0 0-2.8-2.5 3 3 0 0 0-2.8-1.8h-.6z"/></svg>';
  var SF_LEAF='<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="4.6" r="2.2"/><path d="M12 8c-2.4 0-4.4 2-4.4 4.4v.5l3 1.1v2.6c0 .3.2.5.5.6l.7.2-3.5 1.2c-1.6.5-3 1.2-3 1.9 0 .9 3.9 1.5 8.7 1.5s8.7-.6 8.7-1.5c0-.7-1.4-1.4-3-1.9l-3.5-1.2.7-.2c.3-.1.5-.3.5-.6V14l3-1.1v-.5c0-2.4-2-4.4-4.4-4.4z"/></svg>';
  function renderT(){
    if(tDisp) tDisp.textContent=fmt(trem);
    if(tEl){ tEl.classList.toggle('focus',tmode==='focus'); tEl.classList.toggle('rest',tmode==='rest'); tEl.classList.toggle('running',trun); }
    if(tLbl) tLbl.textContent=tmode==='focus'?'Focus':'Rest';
    if(tIc) tIc.innerHTML=tmode==='focus'?SF_BRAIN:SF_LEAF;
    if(tFill) tFill.style.width=(100*(1-trem/tmax))+'%';
    if(tPlay) tPlay.innerHTML = trun
      ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zm6 0h4v14h-4z"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7z"/></svg>';
  }
  function setMode(m){ tmode=m; tmax=m==='focus'?FOCUS:REST; trem=tmax; }
  function tTick(){ if(!trun)return; if(trem>0){trem--;renderT();} else { setMode(tmode==='focus'?'rest':'focus'); renderT(); } }
  if(tPlay) tPlay.addEventListener('click',function(e){ e.stopPropagation(); trun=!trun; if(!tint)tint=setInterval(tTick,1000); renderT(); });
  var tReset=root.querySelector('.nnx-treset');
  if(tReset) tReset.addEventListener('click',function(e){ e.stopPropagation(); trun=false; setMode('focus'); renderT(); });
  var tSkip=root.querySelector('.nnx-tskip');
  if(tSkip) tSkip.addEventListener('click',function(e){ e.stopPropagation(); setMode(tmode==='focus'?'rest':'focus'); renderT(); });
  renderT();

  /* ---------- NOTES (default list + tap-to-edit, color, AI rephrase) ---------- */
  var notesMod=document.getElementById('nnx-notes');
  if(notesMod){
    var nPrompt=notesMod.querySelector('.nnx-nprompt'),
        nTa=notesMod.querySelector('.nnx-ntext'),
        nSave=notesMod.querySelector('.nnx-nsave'),
        nCancel=notesMod.querySelector('.nnx-ncancel'),
        nReph=notesMod.querySelector('.nnx-nreph'),
        nList=notesMod.querySelector('.nnx-notes-list'),
        nColors=notesMod.querySelectorAll('.nnx-colors button'),
        nColor='b';
    function rephrase(s){ s=s.trim(); if(!s)return s; var o=s.charAt(0).toUpperCase()+s.slice(1);
      o=o.replace(/\bhey\b/i,'Hi there!').replace(/\bgonna\b/i,'going to').replace(/\bwanna\b/i,'want to').replace(/\bu\b/gi,'you');
      if(!/[.!?]$/.test(o)) o+='.'; return o; }
    function openEdit(){ notesMod.classList.add('editing'); if(nTa){nTa.value='';setTimeout(function(){nTa.focus();},60);} }
    function closeEdit(){ notesMod.classList.remove('editing'); }
    if(nPrompt) nPrompt.addEventListener('click',function(e){ e.stopPropagation(); openEdit(); });
    if(nCancel) nCancel.addEventListener('click',function(e){ e.stopPropagation(); closeEdit(); });
    if(nReph) nReph.addEventListener('click',function(e){ e.stopPropagation(); if(nTa) nTa.value=rephrase(nTa.value); });
    nColors.forEach(function(b){ b.addEventListener('click',function(e){ e.stopPropagation(); nColor=b.dataset.c; nColors.forEach(function(x){x.classList.toggle('on',x===b);}); }); });
    if(nSave) nSave.addEventListener('click',function(e){ e.stopPropagation();
      var v=(nTa&&nTa.value||'').trim(); if(!v){ closeEdit(); return; }
      var note=document.createElement('div'); note.className='nnx-note';
      note.innerHTML='<div class="nbody"><div class="ntext"></div><span class="nts">now</span><div class="nbar '+nColor+'"></div></div>'+
        '<button class="nchk" aria-label="Mark complete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg></button>';
      note.querySelector('.ntext').textContent=v;
      var firstNote=nList.querySelector('.nnx-note');
      if(firstNote) nList.insertBefore(note,firstNote); else nList.appendChild(note);
      closeEdit();
    });
    // check toggles
    notesMod.addEventListener('click',function(e){ var b=e.target.closest('.nchk'); if(b){ e.stopPropagation(); b.classList.toggle('done'); b.querySelector('svg').setAttribute('fill', b.classList.contains('done')?'currentColor':'none'); } });
  }

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
        var pinSvg='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2l8 8-1.5 1.5-1-1-3.5 3.5v4L14 20l-2-2-3 3-1.5-1.5 3-3-2-2 2-2.5h4L19.5 11l-1-1z"/></svg>';
        var cpSvg='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 2h7l5 5v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm6 1.5V8h4.5z"/><path d="M5 6v14a2 2 0 0 0 2 2h9v-2H7V6z" opacity=".5"/></svg>';
        var delSvg='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3h6l1 2h4v2H4V5h4zM6 8h12l-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z"/></svg>';
        el.innerHTML='<div class="txt">'+c.x.replace(/</g,'&lt;')+'</div>'+
          '<div class="meta"><span>'+ago(c.t)+'</span><span class="sp"></span>'+
          '<button class="pin'+(c.pin?' on':'')+'" title="Pin" aria-label="Pin">'+pinSvg+'</button>'+
          '<button class="cp" title="Copy" aria-label="Copy">'+cpSvg+'</button>'+
          '<button class="del" title="Delete" aria-label="Delete">'+delSvg+'</button></div>';
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
