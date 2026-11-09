/* ===== Mapbox: paste your public token (starts with "pk.") here ===== */
var MAPBOX_TOKEN = 'pk.eyJ1IjoiaHJpdGVzaC1zYWluaSIsImEiOiJjbXZ4Z2Z0bncwZmV2NGRzOTh1MzkwMXh6In0.wic7uCrsrA5tnJ4Jl0PqRA';

/* ---------- countdown: Sunday 22 Nov 2026, 6:00 PM IST ----------
   More than a day away: days, hours, minutes, seconds.
   On the day: hours, minutes, seconds (no "00 days").
   In the last hour: minutes and seconds. */
(function(){
  var t = new Date('2026-11-22T18:00:00+05:30');
  var clock = document.getElementById('clock'), sec = clock.closest('section'), until = document.getElementById('until');
  var units = {}, seps = clock.querySelectorAll('.sep');
  clock.querySelectorAll('.unit').forEach(function(u){ units[u.dataset.u] = u; });
  function show(list){
    ['days','hours','minutes','seconds'].forEach(function(k, i){
      units[k].hidden = list.indexOf(k) < 0;
      if (i) seps[i-1].hidden = units[k].hidden || list.indexOf(k) === 0;
    });
  }
  function put(k, n){
    var b = units[k].querySelector('b'), v = String(n).padStart(2,'0');
    if (b.textContent !== v){ b.textContent = v; b.classList.remove('flip'); void b.offsetWidth; b.classList.add('flip'); }
    units[k].querySelector('span').textContent = (n === 1 ? k.slice(0,-1) : k);
  }
  function tick(){
    var d = Math.max(0, t - new Date());
    var D = Math.floor(d/864e5), H = Math.floor(d/36e5)%24, M = Math.floor(d/6e4)%60, S = Math.floor(d/1e3)%60;
    if (d === 0){
      show([]); sec.classList.add('is-today'); until.textContent = 'The Lagan & Tikka has begun. Join us!'; return;
    }
    var list = D > 0 ? ['days','hours','minutes','seconds'] : (H > 0 ? ['hours','minutes','seconds'] : ['minutes','seconds']);
    show(list);
    clock.classList.toggle('today', D === 0);
    sec.classList.toggle('is-today', D === 0);
    if (D > 0) put('days', D);
    put('hours', D > 0 ? H : H); put('minutes', M); put('seconds', S);
  }
  tick(); setInterval(tick, 1000);
})();


/* ---------- phones: fit the first page to the full screen height ---------- */
(function(){
  var st = document.querySelector('.stage'); if (!st) return;
  function fit(){
    var wide = matchMedia('(min-width:900px) and (min-height:560px) and (min-aspect-ratio:1/1)').matches;
    st.classList.remove('roomy');
    if (wide){ st.style.removeProperty('--cs'); st.style.removeProperty('--ts'); st.style.removeProperty('--ty'); return; }
    var W = st.clientWidth, H = st.clientHeight, u = W / 512, extra = H - 722 * u;
    if (extra <= 2){ st.style.setProperty('--cs',1); st.style.setProperty('--ts',1); st.style.setProperty('--ty','0px'); return; }
    var cs = Math.min(1.42, 1 + (extra * 0.55) / (323 * u));
    var ts = Math.min(1.2, 1 + (extra * 0.3) / (255 * u));
    var gap = H - 323 * u * cs - 86 * u - 290 * u * ts - 14 * u;   /* free space between text and couple */
    var ty = Math.max(0, gap * 0.35);
    st.classList.toggle('roomy', gap > 60 * u);
    st.style.setProperty('--cs', cs.toFixed(3)); st.style.setProperty('--ts', ts.toFixed(3)); st.style.setProperty('--ty', ty.toFixed(1) + 'px');
  }
  fit(); addEventListener('resize', fit); addEventListener('orientationchange', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();

/* ---------- reveal on scroll ---------- */
(function(){
  var els = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window)) { els.forEach(function(e){e.classList.add('in')}); return; }
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
  els.forEach(function(e){ io.observe(e) });
})();

/* ---------- falling petals over the hero ---------- */
(function(){
  var c = document.getElementById('petals');
  if (!c || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ctx = c.getContext('2d'), P = [], W = 0, H = 0, run = false, dpr = Math.min(2, window.devicePixelRatio||1);
  var cols = ['#f1a99a','#e85d75','#f59e0b','#ea580c','#ffc2b3','#c81e3c'];
  function size(){ W = c.clientWidth; H = c.clientHeight; c.width = W*dpr; c.height = H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); }
  function make(top){ return {x:Math.random()*W, y:top?Math.random()*-H:Math.random()*H, r:4+Math.random()*6, vy:.35+Math.random()*.7, vx:-.3+Math.random()*.6, a:Math.random()*6.28, va:-.02+Math.random()*.04, sw:Math.random()*6.28, c:cols[Math.random()*cols.length|0]}; }
  function frame(){
    if (!run) return;
    ctx.clearRect(0,0,W,H);
    P.forEach(function(p){
      p.sw += .02; p.y += p.vy; p.x += p.vx + Math.sin(p.sw)*.4; p.a += p.va;
      if (p.y > H+20) { Object.assign(p, make(true)); p.y = -20; }
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.a); ctx.scale(1, Math.abs(Math.cos(p.sw))*.6+.4);
      ctx.fillStyle = p.c; ctx.globalAlpha = .8;
      ctx.beginPath(); ctx.moveTo(0,-p.r); ctx.quadraticCurveTo(p.r*.9,0,0,p.r); ctx.quadraticCurveTo(-p.r*.9,0,0,-p.r); ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(frame);
  }
  size(); addEventListener('resize', size);
  var n = W > 900 ? 46 : 24; for (var i=0;i<n;i++) P.push(make(false));
  window.startPetals = function(){
    new IntersectionObserver(function(es){ var v = es[0].isIntersecting; if (v && !run){ run = true; frame(); } else if (!v) run = false; }).observe(c);
  };
})();

/* ---------- RSVP via WhatsApp ---------- */
(function(){
  var f = document.getElementById('rsvpForm');
  f.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('rsvpName').value.trim(), msg = document.getElementById('rsvpMsg');
    if (!name){ msg.textContent = 'Please enter your name first.'; return; }
    msg.textContent = '';
    var evs = [].slice.call(f.querySelectorAll('input[name=events]:checked')).map(function(c){return c.value});
    var text = encodeURIComponent("RSVP for Hritesh & Chetna's wedding") + '%0A' +
      'Name: ' + encodeURIComponent(name) + '%0A' +
      'Guests: ' + encodeURIComponent(document.getElementById('rsvpGuests').value) + '%0A' +
      'Attending: ' + encodeURIComponent(evs.length ? evs.join(', ') : 'Not yet decided');
    window.open('https://wa.me/918504971728?text=' + text, '_blank', 'noopener');
  });
})();

/* ---------- background music ---------- */
(function(){
  var audio = document.getElementById('bgm'), btn = document.getElementById('musicBtn'), label = document.getElementById('musicLabel');
  audio.volume = .6;
  function set(on){ btn.classList.toggle('on',on); btn.setAttribute('aria-pressed',on); label.textContent = on ? 'Music on' : 'Music off'; }
  window.startMusic = function(){ var p = audio.play(); if (p && p.then) p.then(function(){set(true)}).catch(function(){ set(false); label.textContent = 'Tap to play music'; }); };
  btn.addEventListener('click', function(e){ e.stopPropagation(); if (audio.paused){ btn.dataset.off=''; window.startMusic(); } else { audio.pause(); btn.dataset.off='1'; } });
  audio.addEventListener('pause', function(){set(false)});
  audio.addEventListener('play', function(){set(true)});
})();


/* ---------- mobile UX: calendar, swipe dots, guest stepper, quick-action bar ---------- */
(function(){
  /* add to calendar: Google Calendar on Android, an .ics file everywhere else */
  var LOC = 'Function Place, Dhani Sillar, Bansur, Kotputli-Behror, Rajasthan 301402';
  var MAP = 'https://www.google.com/maps/search/?api=1&query=27.697652%2C76.365031';
  document.querySelectorAll('.cal').forEach(function(b){
    b.addEventListener('click', function(){
      var t = b.dataset.title, s = b.dataset.start, e = b.dataset.end;
      if (/Android/i.test(navigator.userAgent)) {
        window.open('https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(t) + '&dates=' + s + '/' + e +
          '&location=' + encodeURIComponent(LOC) + '&details=' + encodeURIComponent('Directions: ' + MAP), '_blank', 'noopener');
        return;
      }
      var ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Hritesh and Chetna//Wedding//EN','BEGIN:VEVENT',
        'UID:' + s + '-hritesh-chetna@invite','DTSTAMP:' + new Date().toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z',
        'DTSTART:' + s,'DTEND:' + e,'SUMMARY:' + t,'LOCATION:' + LOC.replace(/,/g,'\\,'),'DESCRIPTION:Directions: ' + MAP,
        'BEGIN:VALARM','TRIGGER:-PT3H','ACTION:DISPLAY','DESCRIPTION:' + t,'END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
      var url = URL.createObjectURL(new Blob([ics], {type:'text/calendar;charset=utf-8'}));
      var a = document.createElement('a'); a.href = url; a.download = t.split(' · ')[0].replace(/[^a-z]+/gi,'-') + '.ics';
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(url); }, 4000);
    });
  });

  /* event carousel: dots follow the centred card, tap a dot to jump to it */
  var row = document.querySelector('.events'), dots = document.querySelectorAll('#evDots button');
  if (row && dots.length){
    var cards = row.querySelectorAll('.event');
    function cur(){
      var mid = row.scrollLeft + row.clientWidth / 2, best = 0, d = 1e9;
      cards.forEach(function(c, i){ var m = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (m < d){ d = m; best = i; } });
      dots.forEach(function(x, i){ x.classList.toggle('on', i === best); x.setAttribute('aria-selected', i === best); });
      cards.forEach(function(c, i){ c.classList.toggle('cur', i === best); });
    }
    row.addEventListener('scroll', function(){ requestAnimationFrame(cur); }, {passive:true});
    dots.forEach(function(x, i){ x.addEventListener('click', function(){
      var c = cards[i]; row.scrollTo({left: c.offsetLeft - (row.clientWidth - c.offsetWidth) / 2, behavior:'smooth'});
    }); });
    cur(); addEventListener('resize', cur);
  }

  /* guest stepper */
  var out = document.getElementById('rsvpGuests');
  document.querySelectorAll('.stepper button').forEach(function(b){
    b.addEventListener('click', function(){
      var n = Math.min(25, Math.max(1, (parseInt(out.textContent, 10) || 1) + Number(b.dataset.d)));
      out.textContent = n; out.value = String(n);
    });
  });

  /* quick-action bar: appears after the first screen, highlights the section you are in */
  var nav = document.getElementById('mnav'), hero = document.getElementById('invitation');
  if (!nav) return;
  new IntersectionObserver(function(es){
    var away = !es[0].isIntersecting;
    nav.classList.toggle('show', away); document.body.classList.toggle('nav-on', away);
  }, {threshold:.15}).observe(hero.querySelector('.stage'));
  var links = {}; nav.querySelectorAll('a[data-s]').forEach(function(a){ links[a.dataset.s] = a; });
  /* the highlighted tab follows the section the guest is reading */
  var ids = ['celebrations','venue','rsvp','contacts'], ticking = false;
  function activeSection(){
    ticking = false;
    var line = window.innerHeight * 0.45, cur = null;
    ids.forEach(function(id){ var el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= line) cur = id; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = 'contacts';
    Object.keys(links).forEach(function(k){ links[k].classList.toggle('on', k === cur); });
  }
  window.addEventListener('scroll', function(){ if (!ticking){ ticking = true; requestAnimationFrame(activeSection); } }, {passive:true});
  window.addEventListener('resize', activeSection);
  activeSection();

  /* music toggle in the bar mirrors the floating button */
  var mb = document.getElementById('mnavMusic'), main = document.getElementById('musicBtn'), audio = document.getElementById('bgm');
  mb.addEventListener('click', function(){ main.click(); });
  function sync(){ var on = !audio.paused; mb.classList.toggle('on', on); mb.setAttribute('aria-pressed', on); mb.querySelector('.lbl').textContent = on ? 'Music on' : 'Music off'; }
  audio.addEventListener('play', sync); audio.addEventListener('pause', sync);
})();

/* ---------- envelope: tap to open, then play the hero entrance ---------- */
(function(){
  var gate = document.getElementById('gate'), hero = document.getElementById('invitation'), opened = false;
  var cols = ['#f59e0b','#f1a99a','#ffd9ca','#d99a2b','#b8432f','#ffffff','#e85d75'];
  function burst(){
    for (var i=0;i<40;i++){
      var c = document.createElement('span'); c.className = 'confetti'; c.style.background = cols[i%cols.length]; gate.appendChild(c);
      var ang = Math.random()*6.28, dist = 140+Math.random()*240, dx = Math.cos(ang)*dist, dy = Math.sin(ang)*dist-80, rot = Math.random()*720-360;
      var a = c.animate([{transform:'translate(-50%,-50%) rotate(0)',opacity:1},{transform:'translate(calc(-50% + '+dx+'px),calc(-50% + '+dy+'px)) rotate('+rot+'deg)',opacity:0}],{duration:1400+Math.random()*700,easing:'cubic-bezier(.2,.7,.3,1)',fill:'forwards'});
      a.onfinish = (function(el){return function(){el.remove()}})(c);
    }
  }
  function open(){
    if (opened) return; opened = true;
    gate.classList.add('opening');
    if (window.startMusic) window.startMusic();
    setTimeout(burst, 1100);
    setTimeout(function(){
      gate.classList.add('hide'); document.body.classList.remove('locked');
      requestAnimationFrame(function(){ hero.classList.add('live'); if (window.startPetals) window.startPetals(); });
    }, 2400);
  }
  gate.addEventListener('click', open);
  gate.addEventListener('keydown', function(e){ if (e.key==='Enter'||e.key===' '){ e.preventDefault(); open(); } });
})();

/* ---------- Mapbox map: venue, road routes from nearby cities, satellite view ---------- */
window.addEventListener('load', function(){
  var el = document.getElementById('map'), chips = document.getElementById('routes');
  var VENUE = [76.365031, 27.697652];
  var gdir = function(o){ return 'https://www.google.com/maps/dir/?api=1' + (o ? '&origin=' + encodeURIComponent(o + ', India') : '') + '&destination=27.697652,76.365031'; };
  var CITIES = [
    {name:'Delhi',    at:[77.2090, 28.6139], color:'#8b0f14'},
    {name:'Jaipur',   at:[75.7873, 26.9124], color:'#d97706'},
    {name:'Alwar',    at:[76.6346, 27.5530], color:'#2f7d32'},
    {name:'Kotputli', at:[76.1994, 27.7022], color:'#7c3aed'}
  ];
  if (!window.mapboxgl || !/^pk\./.test(MAPBOX_TOKEN)) {
    var fb = document.createElement('div'); fb.className = 'map-fallback';
    fb.innerHTML = '<span>The map needs a Mapbox token to load.</span><a class="btn" href="' + gdir() + '" target="_blank" rel="noopener">Open in Google Maps</a>';
    el.appendChild(fb); el.querySelector('.map-toggle').style.display = 'none';
    return;
  }
  mapboxgl.accessToken = MAPBOX_TOKEN;
  var STYLES = {streets:'mapbox://styles/mapbox/streets-v12', satellite:'mapbox://styles/mapbox/satellite-streets-v12'};
  var map = new mapboxgl.Map({container:el, style:STYLES.streets, center:VENUE, zoom:8, cooperativeGestures:true});
  map.addControl(new mapboxgl.NavigationControl({showCompass:false}), 'top-right');
  map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

  /* fetch real road routes (falls back to a straight line if a request fails) */
  var features = CITIES.map(function(c){
    return {type:'Feature', properties:{name:c.name, color:c.color}, geometry:{type:'LineString', coordinates:[c.at, VENUE]}};
  });
  var ready = Promise.all(CITIES.map(function(c, i){
    var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + c.at.join(',') + ';' + VENUE.join(',') +
              '?geometries=geojson&overview=full&access_token=' + MAPBOX_TOKEN;
    return fetch(url).then(function(r){ return r.json(); }).then(function(j){
      var rt = j.routes && j.routes[0]; if (!rt) return;
      features[i].geometry = rt.geometry;
      c.km = Math.round(rt.distance/1000);
      var m = Math.round(rt.duration/60); c.time = (m >= 60 ? Math.floor(m/60) + ' h ' : '') + (m%60) + ' min';
    }).catch(function(){});
  }));

  function bounds(list){
    var b = new mapboxgl.LngLatBounds(VENUE, VENUE);
    list.forEach(function(f){ f.geometry.coordinates.forEach(function(p){ b.extend(p); }); });
    return b;
  }
  var pad = function(){ return el.clientWidth < 600 ? 40 : 70; };

  /* layers have to be re-added whenever the style changes (map ⇄ satellite) */
  var dashStep = 0, dashSeq = [[0,4,3],[0.5,4,2.5],[1,4,2],[1.5,4,1.5],[2,4,1],[2.5,4,0.5],[3,4,0],[0,0.5,3,3.5],[0,1,3,3],[0,1.5,3,2.5],[0,2,3,2],[0,2.5,3,1.5],[0,3,3,1],[0,3.5,3,0.5]];
  function addLayers(){
    if (map.getSource('routes')) return;
    map.addSource('routes', {type:'geojson', data:{type:'FeatureCollection', features:features}});
    map.addLayer({id:'route-casing', type:'line', source:'routes', layout:{'line-join':'round','line-cap':'round'}, paint:{'line-color':'#ffffff','line-width':['interpolate',['linear'],['zoom'],6,5,12,10],'line-opacity':.9}});
    map.addLayer({id:'route-line', type:'line', source:'routes', layout:{'line-join':'round','line-cap':'round'}, paint:{'line-color':['get','color'],'line-width':['interpolate',['linear'],['zoom'],6,3,12,6]}});
    map.addLayer({id:'route-dash', type:'line', source:'routes', layout:{'line-join':'round','line-cap':'round'}, paint:{'line-color':'#fde68a','line-width':['interpolate',['linear'],['zoom'],6,1.5,12,3],'line-dasharray':dashSeq[0]}});
    if (active) highlight(active, false);
  }
  setInterval(function(){
    if (!map.getLayer('route-dash')) return;
    dashStep = (dashStep + 1) % dashSeq.length;
    map.setPaintProperty('route-dash', 'line-dasharray', dashSeq[dashStep]);
  }, 70);
  map.on('style.load', addLayers);

  /* venue pin */
  var pin = document.createElement('div'); pin.className = 'venue-pin';
  pin.innerHTML = '<svg viewBox="0 0 46 58" width="46" height="58"><circle class="ring" cx="23" cy="22" r="14" fill="none" stroke="#f59e0b" stroke-width="3"/><path d="M23 2C12 2 4 10 4 21c0 14 19 34 19 34s19-20 19-34C42 10 34 2 23 2z" fill="#8b0f14" stroke="#fffbea" stroke-width="2.5"/><circle cx="23" cy="21" r="8" fill="#f8e0a8"/></svg>';
  var popup = new mapboxgl.Popup({offset:34, closeButton:false}).setHTML('<strong>Hritesh &amp; Chetna</strong>Dhani Sillar, Bansur<br><a href="' + gdir() + '" target="_blank" rel="noopener">Directions</a>');
  new mapboxgl.Marker({element:pin, anchor:'bottom'}).setLngLat(VENUE).setPopup(popup).addTo(map);

  /* city labels + route chips */
  var active = null, chipEls = {};
  function highlight(name, fly){
    active = name;
    var on = name ? ['case',['==',['get','name'],name],1,.25] : 1;
    if (map.getLayer('route-line')) { map.setPaintProperty('route-line','line-opacity',on); map.setPaintProperty('route-dash','line-opacity',on); }
    Object.keys(chipEls).forEach(function(k){ chipEls[k].setAttribute('aria-pressed', String(k === (name || 'all'))); });
    Object.keys(tags || {}).forEach(function(k){ tags[k].classList.toggle('dim', !!name && k !== name); });
    if (fly !== false) map.fitBounds(bounds(name ? features.filter(function(f){return f.properties.name === name}) : features), {padding:pad(), duration:1400});
  }
  function chip(key, label, color, extra){
    var b = document.createElement('button'); b.type = 'button'; b.className = 'route-chip'; b.setAttribute('aria-pressed', key === 'all');
    if (color) b.style.setProperty('--c', color);
    b.innerHTML = '<span>' + label + '</span><b>' + (extra || '&nbsp;') + '</b>';
    b.addEventListener('click', function(){ highlight(key === 'all' ? null : key); });
    chips.appendChild(b); chipEls[key] = b;
  }
  /* route tags: a pill on a stem above each starting city (Kotputli sits left, it is close to the venue) */
  var tags = {};
  CITIES.forEach(function(c){
    var left = c.name === 'Kotputli';
    var tag = document.createElement('div'); tag.className = 'rtag' + (left ? ' left' : ''); tag.style.setProperty('--c', c.color);
    tag.innerHTML = '<div class="pill"><span>' + c.name + '</span><small></small></div><div class="stem"></div><div class="dot"></div>';
    tag.title = 'Route from ' + c.name;
    tag.addEventListener('click', function(e){ e.stopPropagation(); highlight(c.name); });
    new mapboxgl.Marker({element:tag, anchor: left ? 'right' : 'bottom', offset: left ? [6,0] : [0,6]}).setLngLat(c.at).addTo(map);
    tags[c.name] = tag;
  });
  var vt = document.createElement('div'); vt.className = 'venue-tag'; vt.textContent = 'Function Place'; pin.appendChild(vt);

  ready.then(function(){
    chip('all', 'All routes', '#d99a2b', 'Overview');
    CITIES.forEach(function(c){
      var info = c.km ? c.km + ' km · ' + c.time : 'Route';
      chip(c.name, 'From ' + c.name, c.color, info);
      if (c.km) tags[c.name].querySelector('small').textContent = c.km + ' km · ' + c.time;
    });
    var put = function(){ if (map.getSource('routes')) map.getSource('routes').setData({type:'FeatureCollection', features:features}); else addLayers(); map.fitBounds(bounds(features), {padding:pad(), duration:1600}); };
    if (map.isStyleLoaded()) put(); else map.once('load', put);
  });

  /* Map / Satellite toggle */
  el.querySelectorAll('.map-toggle button').forEach(function(b){
    b.addEventListener('click', function(){
      el.querySelectorAll('.map-toggle button').forEach(function(x){ x.setAttribute('aria-pressed', String(x === b)); });
      map.setStyle(STYLES[b.dataset.style]);
    });
  });
});
