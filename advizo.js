/* =========================================================================
   CONSULT ADVIZO — shared interactions, nav, footer, 3D scene
   ========================================================================= */
(function(){
  'use strict';

  const PAGES = [
    { href:'/',            label:'Home' },
    { href:'/services/',   label:'Services' },
    { href:'/industries/', label:'Industries' },
    { href:'/about/',      label:'About' },
    { href:'/insights/',   label:'Insights' },
    { href:'/contact/',    label:'Contact' },
  ];

  let here = location.pathname.replace(/index\.html$/, '');
  if (!here.endsWith('/')) here += '/';
  here = here.toLowerCase();

  /* ---- logo mark (SVG, exact brand triangles) ---- */
  function markSVG(scale){
    scale = scale || 1;
    const w = 50*scale, h = 43*scale;
    return `<svg width="${w}" height="${h}" viewBox="0 0 56 48" fill="none" aria-hidden="true" style="flex:none">
      <path d="M19 1 L19 23 L44 11 Z" fill="#d2af47"/>
      <path d="M20 22 L20 35 L33 29 Z" fill="#143a2a"/>
      <path d="M30 25 L55 25 L42 47 Z" fill="#0a2a8c"/>
    </svg>`;
  }

  /* ---- NAV ---- */
  function buildNav(){
    const MARKETS = [
      { href:'/gcc/', label:'GCC' },
      { href:'/usa/', label:'USA' }
    ];
    const inRegion = (here==='/gcc/' || here==='/usa/');
    const regionsDD = `<span class="nav-dd-wrap nav-regions"><span class="nav-dd-label${inRegion?' active':''}">Regions</span><button class="nav-caret" type="button" aria-label="Regions">▾</button><span class="nav-dd">${MARKETS.map(m=>`<a href="${m.href}">${m.label}</a>`).join('')}</span></span>`;
    const links = PAGES.map(p => {
      const a = `<a href="${p.href}" ${p.href===here?'class="active"':''}>${p.label}</a>`;
      return p.label==='Industries' ? a + regionsDD : a;
    }).join('');
    const mlinks = PAGES.map(p => {
      const a = `<a href="${p.href}" ${p.href===here?'class="active"':''}>${p.label}</a>`;
      if(p.label==='Industries'){
        return a + '<span class="m-head">Regions</span>' + MARKETS.map(m=>`<a class="m-sub" href="${m.href}">${m.label}</a>`).join('');
      }
      return a;
    }).join('');

    const nav = document.createElement('header');
    nav.className = 'nav';
    nav.innerHTML = `
      <div class="nav-inner">
        <a class="brand" href="/" aria-label="Consult Advizo home">
          <img src="/assets/advizo-logo.png" alt="Consult Advizo" class="brand-logo">
        </a>
        <nav class="nav-links" aria-label="Primary">${links}</nav>
        <div class="nav-cta">
          <a class="btn btn-primary" href="/contact/">Book a Diagnostic <span class="arr">→</span></a>
          <button class="nav-toggle" aria-label="Menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
      <div class="mobile-menu">${mlinks}
        <a class="btn btn-primary" href="/contact/">Book a Diagnostic →</a>
      </div>`;
    document.body.prepend(nav);

    const toggle = nav.querySelector('.nav-toggle');
    const menu = nav.querySelector('.mobile-menu');
    toggle.addEventListener('click', ()=>{
      const open = menu.classList.toggle('open');
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open);
    });
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      menu.classList.remove('open'); document.body.classList.remove('menu-open');
    }));

    const onScroll = ()=> nav.classList.toggle('scrolled', window.scrollY>12);
    onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
  }

  /* ---- FOOTER ---- */
  function buildFooter(){
    const f = document.createElement('footer');
    f.className = 'footer';
    f.innerHTML = `
      <div class="wrap-wide">
        <div class="foot-grid">
          <div class="foot-col foot-brand">
            <a class="brand" href="/" style="margin-bottom:18px">
              <img src="/assets/advizo-logo-light.png" alt="Consult Advizo" class="brand-logo brand-logo-foot">
            </a>
            <p style="max-width:34ch; color:#a9bfb2; font-size:.96rem; line-height:1.6; margin:.4rem 0 1.4rem">
              Big&nbsp;4-grade growth and AI consulting for companies the Big&nbsp;4 can't afford to serve.</p>
            <div style="display:flex; gap:10px; font-size:.82rem; letter-spacing:.12em; text-transform:uppercase; color:#86a193">
              <span>India</span><span style="color:var(--gold)">·</span><span>GCC</span><span style="color:var(--gold)">·</span><span>USA</span>
            </div>
          </div>
          <div class="foot-col">
            <h4>Services</h4>
            <ul>
              <li><a href="/services/#diagnostic">Growth &amp; AI Diagnostic</a></li>
              <li><a href="/services/#strategy-office">Strategy Office</a></li>
              <li><a href="/services/#transformation">Transformation Programs</a></li>
              <li><a href="/services/#ai">AI &amp; Digital Implementation</a></li>
            </ul>
          </div>
          <div class="foot-col">
            <h4>Firm</h4>
            <ul>
              <li><a href="/industries/">Industries</a></li>
              <li><a href="/gcc/">Consult Advizo in Gulf</a></li>
              <li><a href="/usa/">Consult Advizo in USA</a></li>
              <li><a href="/about/">About &amp; Team</a></li>
              <li><a href="/about/#why">Why Consult Advizo</a></li>
              <li><a href="/insights/">Insights</a></li>
              <li><a href="/contact/">Contact</a></li>
              <li><a href="/careers/">Careers</a></li>
            </ul>
          </div>
          <div class="foot-col">
            <h4>Get started</h4>
            <ul>
              <li><a href="/contact/">Book a Diagnostic</a></li>
              <li><a href="mailto:business@consultadvizo.com">business@consultadvizo.com</a></li>
              <li><a href="tel:+919110096281">+91 91100 96281</a></li>
              <li><a href="https://www.linkedin.com/company/consult-advizo/" target="_blank" rel="noopener">LinkedIn</a></li>
              <li><a href="https://consultadvizo.com" target="_blank" rel="noopener">consultadvizo.com</a></li>
            </ul>
            <p style="color:#86a193; font-size:.9rem; margin-top:18px; line-height:1.5">New Delhi &middot; Malviya Nagar 110017</p>
          </div>
        </div>
        <div class="foot-bottom">
          <span>© ${new Date().getFullYear()} Consult Advizo — A registered Private Limited consulting firm.</span>
          <span style="display:flex; gap:22px">
            <a href="/privacy/">Privacy</a><a href="/terms/">Terms</a>
          </span>
        </div>
      </div>`;
    document.body.appendChild(f);
  }

  /* ---- Scroll reveal ---- */
  var _revealIO = null;
  function initReveal(){
    if(!('IntersectionObserver' in window)){ document.querySelectorAll('.reveal').forEach(function(e){e.classList.add('in');}); return; }
    _revealIO = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); _revealIO.unobserve(en.target); } });
    }, { threshold:.12, rootMargin:'0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function(e){ if(!e.classList.contains('in')) _revealIO.observe(e); });
  }
  // re-scan for dynamically-added .reveal elements
  window.__advizoReveal = function(){
    if(!_revealIO){ document.querySelectorAll('.reveal').forEach(function(e){e.classList.add('in');}); return; }
    document.querySelectorAll('.reveal:not(.in)').forEach(function(e){ _revealIO.observe(e); });
  };

  /* ---- Count-up stats ---- */
  function initCounters(){
    const nums = document.querySelectorAll('[data-count]');
    if(!nums.length) return;
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if(!en.isIntersecting) return;
        const el = en.target; io.unobserve(el);
        const to = parseFloat(el.dataset.count);
        const suf = el.dataset.suffix || '';
        const pre = el.dataset.prefix || '';
        const dur = 1400; const t0 = performance.now();
        const dec = (to % 1 !== 0) ? 1 : 0;
        function tick(t){
          const p = Math.min(1,(t-t0)/dur);
          const e = 1-Math.pow(1-p,3);
          el.textContent = pre + (to*e).toFixed(dec) + suf;
          if(p<1) requestAnimationFrame(tick);
          else el.textContent = pre + to.toFixed(dec) + suf;
        }
        requestAnimationFrame(tick);
      });
    }, {threshold:.5});
    nums.forEach(n=>io.observe(n));
  }

  /* ---- Hero "breakthrough" chart: JS-driven reveal + parallax ---- */
  function initHero(){
    var hero = document.querySelector('[data-hero-chart]');
    if(!hero) return;
    var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    var line = hero.querySelector('.hero-line');
    var area = hero.querySelector('.hero-area');

    // initial hidden state (inline = guaranteed across renderers)
    if(area){ area.style.opacity='0'; area.style.fillOpacity='0.09'; }
    line.style.opacity='0';
    var fades = hero.querySelectorAll('.hero-ceiling,.hero-ceiling-label,.hero-ghost,.hero-ghost-label');
    fades.forEach(function(el){ el.style.opacity='0'; });
    var ends = hero.querySelectorAll('.hero-end,.hero-end-halo,.hero-end-halo2');
    ends.forEach(function(el){ el.style.transformBox='fill-box'; el.style.transformOrigin='center'; el.style.transform='scale(0)'; });
    var chips = hero.querySelectorAll('.hero-chip');
    chips.forEach(function(el){ el.style.opacity='0'; el.style.transform='translateY(10px)'; });

    function set(el, prop, val, dur, delay, ease){
      if(!el) return;
      setTimeout(function(){ el.style.transition = prop+' '+dur+' '+(ease||'ease'); el.style[prop.replace(/-([a-z])/g,function(m,c){return c.toUpperCase();})] = val; }, delay);
    }

    function reveal(){
      if(reduce){
        line.style.opacity='1'; if(area) area.style.opacity='1';
        fades.forEach(function(el){ el.style.opacity='1'; });
        ends.forEach(function(el){ el.style.transform='scale(1)'; });
        chips.forEach(function(el){ el.style.opacity='1'; el.style.transform='none'; });
        return;
      }
      var bz='cubic-bezier(.22,.61,.36,1)';
      set(hero.querySelector('.hero-ceiling'),'opacity','1','.6s',200);
      set(hero.querySelector('.hero-ceiling-label'),'opacity','1','.6s',320);
      // line draws via a translateX wipe of an overlay-free opacity + subtle slide
      setTimeout(function(){ line.style.transition='opacity 1.1s ease'; line.style.opacity='1'; }, 400);
      set(area,'opacity','1','1.1s',900);
      // endpoint pop
      setTimeout(function(){ ends.forEach(function(el){ el.style.transition='transform .55s cubic-bezier(.34,1.56,.64,1)'; el.style.transform='scale(1)'; });
        var halo=hero.querySelector('.hero-end-halo'); if(halo) halo.style.animation='haloPulse 2.8s ease-in-out 1s infinite'; }, 1300);
      set(hero.querySelector('.hero-ghost'),'opacity','1','.6s',1500);
      set(hero.querySelector('.hero-ghost-label'),'opacity','1','.6s',1650);
      var cd=[800,1700,1150];
      chips.forEach(function(el,i){ setTimeout(function(){ el.style.transition='opacity .6s ease, transform .6s '+bz; el.style.opacity='1'; el.style.transform='none'; }, cd[i]||1200); });
    }
    setTimeout(reveal, 60);

    if(reduce) return;
    // subtle pointer parallax on the floating chips (after they've appeared)
    var layers = hero.querySelectorAll('[data-depth]');
    var tx=0,ty=0,cx=0,cy=0;
    hero.addEventListener('mousemove', function(e){
      var r = hero.getBoundingClientRect();
      tx = ((e.clientX-r.left)/r.width - .5);
      ty = ((e.clientY-r.top)/r.height - .5);
    });
    hero.addEventListener('mouseleave', function(){ tx=0; ty=0; });
    setTimeout(function(){
      (function loop(){
        cx += (tx-cx)*0.06; cy += (ty-cy)*0.06;
        layers.forEach(function(el){
          var d = parseFloat(el.getAttribute('data-depth'))||0;
          el.style.transform = 'translate('+(cx*d*16)+'px,'+(cy*d*12)+'px)';
        });
        requestAnimationFrame(loop);
      })();
    }, 2600);
  }

  /* ---- Active section spy (services page sidebar) ---- */
  function initSpy(){
    const spy = document.querySelector('[data-spy]');
    if(!spy) return;
    const links = [...spy.querySelectorAll('a')];
    const map = links.map(a=>({a, sec: document.querySelector(a.getAttribute('href'))})).filter(x=>x.sec);
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if(en.isIntersecting){
          links.forEach(l=>l.classList.remove('active'));
          const m = map.find(x=>x.sec===en.target);
          if(m) m.a.classList.add('active');
        }
      });
    }, {rootMargin:'-45% 0px -50% 0px'});
    map.forEach(x=>io.observe(x.sec));
  }

  /* ---- Smooth anchor offset for fixed nav ---- */
  function initAnchors(){
    document.addEventListener('click', (e)=>{
      const a = e.target.closest('a[href^="#"]');
      if(!a) return;
      const id = a.getAttribute('href');
      if(id.length<2) return;
      const t = document.querySelector(id);
      if(!t) return;
      e.preventDefault();
      const y = t.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({top:y, behavior:'smooth'});
      history.replaceState(null,'',id);
    });
  }

  function init(){
    buildNav();
    buildFooter();
    initReveal();
    initCounters();
    initHero();
    initSpy();
    initAnchors();
    // handle deep-link to section on load
    if(location.hash){
      setTimeout(()=>{
        const t = document.querySelector(location.hash);
        if(t){ const y = t.getBoundingClientRect().top + window.scrollY - 88; window.scrollTo({top:y}); }
      }, 60);
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.ADVIZO = { markSVG };
})();
