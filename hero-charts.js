/* =========================================================================
   CONSULT ADVIZO — Hero multi-chart
   Three animated graphs (Revenue / Operations / Marketing) that auto-cycle.
   ========================================================================= */
(function(){
  'use strict';
  var container = document.getElementById('heroCharts');
  if(!container) return;

  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // geometry
  var L = 56, R = 566, T = 44, B = 318;
  function xAt(i,n){ return L + i*((R-L)/(n-1)); }
  function yAt(v){ return B - v*(B-T); }

  var CHARTS = {
    revenue: {
      label:'Revenue trajectory', type:'line',
      color:'#07452c', area:'#1c6a47',
      values:[0.16,0.19,0.23,0.26,0.29,0.32,0.55,0.78,0.96],
      ceiling:0.40, ceilingLabel:'Growth ceiling',
      delta:'+40%', cap:'revenue in 14 months',
      chipA:'<strong>+40%</strong> in 14 months',
      chipB:'Stuck at \u20B93.2 Cr'
    },
    operations: {
      label:'Operations throughput', type:'bars',
      color:'#16329a',
      values:[0.30,0.39,0.47,0.58,0.71,0.88],
      delta:'2.4\u00D7', cap:'output per shift',
      chipA:'On-time <strong>98%</strong>',
      chipB:'<strong>\u221232%</strong> cost-to-serve'
    },
    marketing: {
      label:'Marketing pipeline', type:'line',
      color:'#a9781a', area:'#d2af47',
      values:[0.10,0.15,0.22,0.20,0.33,0.49,0.66,0.84,0.98],
      delta:'3.1\u00D7', cap:'qualified pipeline',
      chipA:'<strong>3.1\u00D7</strong> qualified pipeline',
      chipB:'CAC <strong>\u221228%</strong>'
    }
  };

  var svgEl   = container.querySelector('[data-hc-svg]');
  var titleEl = container.querySelector('[data-hp-title]');
  var deltaEl = container.querySelector('[data-hc-delta]');
  var capEl   = container.querySelector('[data-hc-cap]');
  var chipA   = container.querySelector('[data-hc-chip="a"]');
  var chipB   = container.querySelector('[data-hc-chip="b"]');
  var prog    = container.querySelector('[data-hc-progress]');
  var ink     = container.querySelector('[data-hc-ink]');
  var tabsWrap= container.querySelector('.hc-tabs');
  var tabs    = [].slice.call(container.querySelectorAll('.hc-tab'));

  function smooth(pts){
    if(pts.length<2) return 'M0 0';
    var d = 'M'+pts[0][0]+' '+pts[0][1];
    for(var i=0;i<pts.length-1;i++){
      var p0=pts[i-1]||pts[i], p1=pts[i], p2=pts[i+1], p3=pts[i+2]||p2;
      var c1x=p1[0]+(p2[0]-p0[0])/6, c1y=p1[1]+(p2[1]-p0[1])/6;
      var c2x=p2[0]-(p3[0]-p1[0])/6, c2y=p2[1]-(p3[1]-p1[1])/6;
      d+=' C'+c1x+' '+c1y+' '+c2x+' '+c2y+' '+p2[0]+' '+p2[1];
    }
    return d;
  }

  function grid(){
    var g = '<line x1="'+L+'" y1="'+B+'" x2="'+R+'" y2="'+B+'" stroke="#cdd3cd" stroke-width="1.4"/>';
    [0.25,0.5,0.75,1].forEach(function(v){
      var y=yAt(v);
      g+='<line x1="'+L+'" y1="'+y+'" x2="'+R+'" y2="'+y+'" stroke="#eaece6" stroke-width="1"/>';
    });
    return g;
  }

  function renderLine(c){
    var n=c.values.length;
    var pts=c.values.map(function(v,i){ return [xAt(i,n), yAt(v)]; });
    var dLine=smooth(pts);
    var dArea=dLine+' L'+pts[n-1][0]+' '+B+' L'+pts[0][0]+' '+B+' Z';
    var gid='g_'+c.key, end=pts[n-1];
    var svg='<defs><linearGradient id="'+gid+'" x1="0" y1="0" x2="0" y2="1">'
      +'<stop offset="0" stop-color="'+c.area+'" stop-opacity="0.30"/>'
      +'<stop offset="1" stop-color="'+c.area+'" stop-opacity="0.02"/></linearGradient></defs>';
    svg+=grid();
    if(c.ceiling!=null){
      var cy=yAt(c.ceiling);
      svg+='<line x1="'+L+'" y1="'+cy+'" x2="'+R+'" y2="'+cy+'" stroke="#c9a23a" stroke-width="1.4" stroke-dasharray="6 6" opacity="0.85"/>';
      svg+='<text x="'+(L+4)+'" y="'+(cy-8)+'" fill="#a9781a" font-size="11" font-weight="600" font-family="Hanken Grotesk,sans-serif">'+(c.ceilingLabel||'')+'</text>';
    }
    svg+='<path class="hc-area" d="'+dArea+'" fill="url(#'+gid+')"/>';
    svg+='<path class="hc-line" d="'+dLine+'" stroke="'+c.color+'" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
    svg+='<circle class="hc-halo" cx="'+end[0]+'" cy="'+end[1]+'" r="13" fill="'+c.area+'" opacity="0.18"/>';
    svg+='<circle class="hc-end" cx="'+end[0]+'" cy="'+end[1]+'" r="6" fill="'+c.area+'" stroke="#fff" stroke-width="2"/>';
    return svg;
  }

  function renderBars(c){
    var n=c.values.length, slot=(R-L)/n, bw=slot*0.52;
    var svg=grid();
    c.values.forEach(function(v,i){
      var x=L+slot*i+(slot-bw)/2, h=v*(B-T), y=B-h;
      var fill = (i===n-1) ? '#d2af47' : c.color;
      svg+='<rect class="hc-bar" x="'+x+'" y="'+y+'" width="'+bw+'" height="'+h+'" rx="3" fill="'+fill+'"/>';
    });
    return svg;
  }

  function paint(key, doAnim){
    var c=CHARTS[key]; c.key=key;
    svgEl.innerHTML = c.type==='bars' ? renderBars(c) : renderLine(c);
    if(titleEl) titleEl.textContent=c.label;
    if(deltaEl){ deltaEl.textContent=c.delta; deltaEl.style.color = (c.type==='marketing') ? '#a9781a' : c.color; }
    if(capEl) capEl.textContent=c.cap;
    if(chipA) chipA.innerHTML=c.chipA;
    if(chipB) chipB.innerHTML=c.chipB;

    if(!doAnim || reduce) return;

    if(c.type==='bars'){
      [].slice.call(svgEl.querySelectorAll('.hc-bar')).forEach(function(r,i){
        r.style.transformBox='fill-box'; r.style.transformOrigin='50% 100%'; r.style.transform='scaleY(0.001)';
        r.getBoundingClientRect();
        setTimeout(function(){ r.style.transition='transform .6s cubic-bezier(.22,.61,.36,1)'; r.style.transform='scaleY(1)'; }, 70+i*85);
      });
    } else {
      var line=svgEl.querySelector('.hc-line'), area=svgEl.querySelector('.hc-area');
      var ends=[].slice.call(svgEl.querySelectorAll('.hc-end,.hc-halo'));
      if(line){ var len=line.getTotalLength(); line.style.strokeDasharray=len; line.style.strokeDashoffset=len; line.getBoundingClientRect(); line.style.transition='stroke-dashoffset 1.25s cubic-bezier(.33,.7,.36,1)'; line.style.strokeDashoffset='0'; }
      if(area){ area.style.opacity='0'; area.getBoundingClientRect(); area.style.transition='opacity 1s ease .25s'; area.style.opacity='1'; }
      ends.forEach(function(e){ e.style.transformBox='fill-box'; e.style.transformOrigin='center'; e.style.transform='scale(0)'; });
      setTimeout(function(){ ends.forEach(function(e){ e.style.transition='transform .5s cubic-bezier(.34,1.56,.64,1)'; e.style.transform='scale(1)'; }); }, 950);
    }
    [chipA,chipB].forEach(function(el,i){
      if(!el) return;
      el.style.opacity='0'; el.style.transform='translateY(8px)';
      setTimeout(function(){ el.style.transition='opacity .5s ease, transform .5s ease'; el.style.opacity='1'; el.style.transform='none'; }, 600+i*180);
    });
  }

  function moveInk(){
    var a=tabsWrap.querySelector('.hc-tab.active');
    if(!a||!ink) return;
    ink.style.width=a.offsetWidth+'px';
    ink.style.transform='translateX('+a.offsetLeft+'px)';
  }
  function setActive(key){
    tabs.forEach(function(t){ t.classList.toggle('active', t.dataset.chart===key); });
    moveInk();
  }

  var order=['revenue','operations','marketing'], idx=0, timer=null;
  function go(key){
    idx=order.indexOf(key);
    setActive(key); paint(key,true); restartProgress();
  }
  function next(){ idx=(idx+1)%order.length; go(order[idx]); }
  function restartProgress(){
    if(reduce) return;
    clearTimeout(timer);
    if(prog){ prog.style.transition='none'; prog.style.transform='scaleX(0)'; prog.getBoundingClientRect(); prog.style.transition='transform 5s linear'; prog.style.transform='scaleX(1)'; }
    timer=setTimeout(next, 5000);
  }

  tabs.forEach(function(t){ t.addEventListener('click', function(){ go(t.dataset.chart); }); });
  container.addEventListener('mouseenter', function(){
    clearTimeout(timer);
    if(prog && !reduce){ var cs=getComputedStyle(prog).transform; prog.style.transition='none'; prog.style.transform=(cs==='none'?'scaleX(0)':cs); }
  });
  container.addEventListener('mouseleave', function(){ if(!reduce) restartProgress(); });
  window.addEventListener('resize', moveInk, {passive:true});

  // init
  setActive('revenue');
  if(reduce){
    paint('revenue', false);
    if(prog) prog.style.display='none';
  } else {
    setTimeout(function(){ moveInk(); paint('revenue', true); restartProgress(); }, 120);
  }
})();
