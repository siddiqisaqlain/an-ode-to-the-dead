/* Live weather over the map: the current conditions in Srinagar from Open-Meteo (no key, nothing about the visitor is sent),
   drawn as a quiet layer above the map: rain or snow falling with the wind, drifting cloud and fog, lightning in a storm, and the
   sky itself: a warm sun where the sun stands by day, and by night stars and the moon at its real phase and place, or no moon
   when it is new or below the horizon. Preview with ?weather=clear|cloudy|fog|drizzle|rain|snow|storm, &night=1 or 0, and
   &moon=full|half|crescent|none. With reduced motion, nothing moves; the sky and the reading still change. */
window.Weather = (function(){
  const API = 'https://api.open-meteo.com/v1/forecast';

  /* WMO weather codes, folded into the few looks the layer can draw */
  function kind(code){
    if (code === 0 || code === 1) return 'clear';
    if (code === 2 || code === 3) return 'cloudy';
    if (code === 45 || code === 48) return 'fog';
    if (code >= 51 && code <= 57) return 'drizzle';
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
    if (code >= 95) return 'storm';
    return 'clear';
  }
  const LABEL = { 0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Fog', 48: 'Freezing fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
    56: 'Freezing drizzle', 57: 'Freezing drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain', 67: 'Freezing rain', 71: 'Light snow', 73: 'Snow',
    75: 'Heavy snow', 77: 'Snow grains', 80: 'Rain showers', 81: 'Rain showers', 82: 'Heavy showers', 85: 'Snow showers', 86: 'Heavy snow showers', 95: 'Thunderstorm',
    96: 'Thunderstorm, hail', 99: 'Thunderstorm, hail' };
  const PREVIEW = { clear: 0, cloudy: 2, fog: 45, drizzle: 53, rain: 63, snow: 73, storm: 95 };
  const ICON = {
    clear: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>',
    night: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z"/>',
    cloudy: '<path d="M7 18.5h10a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.6 1.6A3.3 3.3 0 0 0 7 18.5Z"/>',
    fog: '<path d="M4 9h16M3 13h18M5 17h14"/>',
    drizzle: '<path d="M7 14.5h10a3.6 3.6 0 0 0 .3-7.2 5 5 0 0 0-9.6 1.4A3 3 0 0 0 7 14.5Z"/><path d="M9 18v1.5M13 18v1.5M17 18v1.5"/>',
    rain: '<path d="M7 13.5h10a3.6 3.6 0 0 0 .3-7.2 5 5 0 0 0-9.6 1.4A3 3 0 0 0 7 13.5Z"/><path d="m9 16.5-1 3M13 16.5l-1 3M17 16.5l-1 3"/>',
    snow: '<path d="M7 13.5h10a3.6 3.6 0 0 0 .3-7.2 5 5 0 0 0-9.6 1.4A3 3 0 0 0 7 13.5Z"/><path d="M9 17.5h.01M13 19h.01M17 17.5h.01M11 21h.01M15 21.5h.01"/>',
    storm: '<path d="M7 13.5h10a3.6 3.6 0 0 0 .3-7.2 5 5 0 0 0-9.6 1.4A3 3 0 0 0 7 13.5Z"/><path d="m12.5 14.5-2 4h3l-2 4"/>'
  };
  const icon = (k, day) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k === 'clear' && !day ? 'night' : k]}</svg>`;

  /* ---------- where the sun and moon are (after SunCalc, V. Agafonkin; accurate to a degree or so, plenty for a sky) ---------- */
  const R = Math.PI / 180, E = R * 23.4397;
  const days = t => t / 864e5 - .5 + 2440588 - 2451545;
  const ra = (l, b) => Math.atan2(Math.sin(l) * Math.cos(E) - Math.tan(b) * Math.sin(E), Math.cos(l));
  const dec = (l, b) => Math.asin(Math.sin(b) * Math.cos(E) + Math.cos(b) * Math.sin(E) * Math.sin(l));
  function sunAt(d){
    const M = R * (357.5291 + .98560028 * d), C = R * (1.9148 * Math.sin(M) + .02 * Math.sin(2 * M) + .0003 * Math.sin(3 * M)), L = M + C + R * 102.9372 + Math.PI;
    return { ra: ra(L, 0), dec: dec(L, 0) };
  }
  function moonAt(d){
    const L = R * (218.316 + 13.176396 * d), M = R * (134.963 + 13.064993 * d), F = R * (93.272 + 13.22935 * d);
    const l = L + R * 6.289 * Math.sin(M), b = R * 5.128 * Math.sin(F);
    return { ra: ra(l, b), dec: dec(l, b), dist: 385001 - 20905 * Math.cos(M) };
  }
  function place(c, d, lat, lng){   // azimuth from north, clockwise; altitude above the horizon; both radians
    const H = R * (280.16 + 360.9856235 * d) - R * -lng - c.ra, p = R * lat;
    const az = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(p) - Math.tan(c.dec) * Math.cos(p)) + Math.PI;
    return { az, alt: Math.asin(Math.sin(p) * Math.sin(c.dec) + Math.cos(p) * Math.cos(c.dec) * Math.cos(H)) };
  }
  function sky(t, lat, lng){
    const d = days(t), s = sunAt(d), m = moonAt(d), S = 149598000;
    const phi = Math.acos(Math.sin(s.dec) * Math.sin(m.dec) + Math.cos(s.dec) * Math.cos(m.dec) * Math.cos(s.ra - m.ra));
    const inc = Math.atan2(S * Math.sin(phi), m.dist - S * Math.cos(phi));
    const ang = Math.atan2(Math.cos(s.dec) * Math.sin(s.ra - m.ra), Math.sin(s.dec) * Math.cos(m.dec) - Math.cos(s.dec) * Math.sin(m.dec) * Math.cos(s.ra - m.ra));
    return { sun: place(s, d, lat, lng), moon: Object.assign(place(m, d, lat, lng), { lit: (1 + Math.cos(inc)) / 2, phase: .5 + .5 * inc * (ang < 0 ? -1 : 1) / Math.PI }) };
  }
  function phaseName(p){
    if (p < .03 || p > .97) return 'New moon';
    if (Math.abs(p - .25) < .03) return 'First quarter moon';
    if (Math.abs(p - .5) < .03) return 'Full moon';
    if (Math.abs(p - .75) < .03) return 'Last quarter moon';
    return p < .25 ? 'Waxing crescent' : p < .5 ? 'Waxing gibbous' : p < .75 ? 'Waning gibbous' : 'Waning crescent';
  }

  async function fetchNow(lat, lng){
    const q = new URLSearchParams({ latitude: lat, longitude: lng, timezone: 'Asia/Kolkata',
      current: 'temperature_2m,weather_code,is_day,cloud_cover,wind_speed_10m,wind_direction_10m,precipitation,relative_humidity_2m' });
    const r = await fetch(`${API}?${q}`); if (!r.ok) throw new Error(r.status);
    return (await r.json()).current;
  }

  /* small images drawn once and stamped many times: far cheaper than blurring every flake and star on every frame */
  function sprite(size, paint){ const c = document.createElement('canvas'); c.width = c.height = size; paint(c.getContext('2d'), size / 2); return c; }
  const FLAKE = { light: sprite(32, (g, h) => { let r = g.createRadialGradient(h, h, 0, h, h, h);
      r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.45, 'rgba(255,255,255,.95)'); r.addColorStop(.62, 'rgba(70,82,104,.35)'); r.addColorStop(1, 'rgba(70,82,104,0)'); g.fillStyle = r; g.fillRect(0, 0, 2 * h, 2 * h); }),
    dark: sprite(32, (g, h) => { let r = g.createRadialGradient(h, h, 0, h, h, h);
      r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.4, 'rgba(255,255,255,.85)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 2 * h, 2 * h); }) };
  const STAR = sprite(24, (g, h) => { let r = g.createRadialGradient(h, h, 0, h, h, h);
    r.addColorStop(0, 'rgba(255,252,235,1)'); r.addColorStop(.18, 'rgba(255,250,225,.9)'); r.addColorStop(.45, 'rgba(255,245,210,.18)'); r.addColorStop(1, 'rgba(255,245,210,0)'); g.fillStyle = r; g.fillRect(0, 0, 2 * h, 2 * h); });

  /* the moon at its phase: the limb on the lit side and the terminator as a half-ellipse; waxing is lit on the right, as seen from Kashmir */
  function moonSprite(phase, lit, r){
    const pad = r * 3.2, size = Math.ceil(2 * pad);
    return sprite(size, (g, h) => {
      const glow = g.createRadialGradient(h, h, r * .8, h, h, pad);
      glow.addColorStop(0, `rgba(255,248,225,${.18 + .32 * lit})`); glow.addColorStop(1, 'rgba(255,248,225,0)');
      g.fillStyle = glow; g.fillRect(0, 0, size, size);
      g.fillStyle = 'rgba(190,200,220,.16)'; g.beginPath(); g.arc(h, h, r, 0, 2 * Math.PI); g.fill();   // the unlit disc, just visible
      const waxing = phase < .5, k = Math.cos(2 * Math.PI * phase), rx = Math.max(.01, r * Math.abs(k)), crescent = k > 0;
      g.beginPath();
      g.arc(h, h, r, -Math.PI / 2, Math.PI / 2, !waxing);
      if (waxing) g.ellipse(h, h, rx, r, 0, Math.PI / 2, crescent ? -Math.PI / 2 : 3 * Math.PI / 2, crescent);
      else g.ellipse(h, h, rx, r, 0, Math.PI / 2, crescent ? 3 * Math.PI / 2 : -Math.PI / 2, !crescent);
      g.closePath();
      const face = g.createRadialGradient(h - r * .3, h - r * .3, 0, h, h, r);
      face.addColorStop(0, '#fffdf2'); face.addColorStop(1, '#efe6cc'); g.fillStyle = face; g.fill();
      g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(160,150,125,.18)';   // a few faint maria
      [[-.25, -.2, .28], [.2, .15, .22], [-.05, .35, .16]].forEach(([x, y, s]) => { g.beginPath(); g.arc(h + x * r, h + y * r, s * r, 0, 2 * Math.PI); g.fill(); });
    });
  }

  /* o: { lat, lng, place, layer (element the effects go in), readout (element for the reading), map (MapLibre map, optional),
          spots ([{ lng, lat }]: places the moonlight falls on; Weather.current.focus(i) picks one out, focus(null) lights them all) } */
  function start(o){
    const P = new URLSearchParams(location.search), reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const layer = o.layer, cv = document.createElement('canvas'), cx = cv.getContext('2d');
    layer.classList.add('wx');
    layer.innerHTML = '<div class="wx-tint"></div><div class="wx-sun"></div><div class="wx-clouds"><i></i><i></i><i></i><i></i></div><div class="wx-fog"><i></i><i></i><i></i></div><div class="wx-haze"></div><div class="wx-flash"></div>';
    layer.appendChild(cv);
    let now = null, drops = [], stars = [], moon = null, raf = 0, last = 0, W = 0, H = 0, picked = null;
    const spotK = (o.spots || []).map(() => ({ k: 0 }));   // each spot's share of the light, eased towards its target
    const isDark = () => document.documentElement.dataset.theme === 'dark' || (document.documentElement.dataset.theme !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);

    function size(){
      W = layer.clientWidth; H = layer.clientHeight; cv.width = W; cv.height = H;   // drawn at 1x: soft weather needs no retina detail
      seed();
    }
    function seed(){
      drops = []; stars = []; moon = null;
      if (!now) return;
      const k = now.kind, area = Math.min(W * H / 1e6, 2.4);
      if (!now.day) {
        const open = k === 'clear' ? 1 : k === 'cloudy' && now.clouds < 85 ? .4 : 0;
        // moonlight washes out the fainter stars
        const n = Math.round(190 * area * open * (1 - .55 * (now.moon && now.moon.up ? now.moon.lit : 0)));
        // stars across the whole sky, thinning towards the horizon; with a map they are placed through its camera, so they turn with it
        for (let i = 0; i < n * 4; i++) { const alt = R * (2 + 70 * Math.pow(Math.random(), 1.3));
          stars.push({ az: Math.random() * 2 * Math.PI, alt, s: Math.random() < .07 ? 10 + Math.random() * 6 : 4 + Math.random() * 5,
            a: (.45 + Math.random() * .55) * Math.min(1, alt / (R * 12)), p: Math.random() * 6.28, f: .5 + Math.random() * 1.6 }); }
        if (now.moon && now.moon.up && open) {
          const m = now.moon, r = Math.max(13, Math.min(W, H) * .024);
          moon = { img: moonSprite(m.phase, m.lit, r), az: m.az, alt: m.alt, a: k === 'clear' ? 1 : .6 };
        }
      }
      if (reduced) return;
      const n = k === 'rain' ? 560 : k === 'storm' ? 760 : k === 'drizzle' ? 300 : k === 'snow' ? 300 : 0;
      for (let i = 0; i < Math.round(n * area); i++) drops.push(drop(true));
    }
    function drop(anywhere){
      const snow = now.kind === 'snow';
      return { x: Math.random() * (W + 200) - 100, y: anywhere ? Math.random() * H : -20 - Math.random() * 80,
        v: snow ? 40 + Math.random() * 70 : 700 + Math.random() * 500,           // pixels per second
        l: snow ? 5 + Math.random() * 9 : 14 + Math.random() * 18,               // flake size, or streak length
        a: snow ? .7 + Math.random() * .3 : .35 + Math.random() * .4, w: .9 + Math.random() * .9, p: Math.random() * 6.28 };
    }
    /* the map's camera: where the horizon falls on screen, which way it faces, and how wide it sees. MapLibre puts the
       horizon at tan(90° − pitch) of the half-height beyond the centre, scaled by the field of view */
    function view(){
      if (!o.map) return null;
      try {
        const pitch = o.map.getPitch() * R, fv = (o.map.getVerticalFieldOfView ? o.map.getVerticalFieldOfView() : 36.87) * R;
        const fh = 2 * Math.atan(Math.tan(fv / 2) * W / H);
        return { pitch, fv, fh, bearing: o.map.getBearing() * R, hy: H / 2 - (H / 2) * Math.tan(Math.PI / 2 - pitch) / Math.tan(fv / 2) };
      } catch (_) { return null; }
    }
    const wrap = a => Math.atan2(Math.sin(a), Math.cos(a));
    function project(az, alt, v){
      if (!v) return { x: W * (.5 + .42 * Math.sin(az)), y: H * (.5 - .42 * Math.min(1, Math.max(.08, alt / (Math.PI / 2.4)))), fade: 1 };   // no map: a flat sky
      // across: the true bearing, as the camera sees it. Up: the band of sky above the horizon holds the whole sky, from the
      // horizon to overhead, so a high moon is near the top rather than off the screen
      const rel = wrap(az - v.bearing);
      if (Math.abs(rel) > v.fh / 2 + .2 || v.hy < 24) return null;   // behind the camera, or no sky in view
      const x = W / 2 + (W / 2) * Math.tan(rel) / Math.tan(v.fh / 2), top = Math.min(22, v.hy * .2);
      const y = v.hy - 6 - (v.hy - 6 - top) * Math.pow(Math.min(1, Math.max(0, alt) / (Math.PI / 2)), .75);
      return { x, y, fade: Math.min(1, alt / (R * 6)) };   // things fade as they near the horizon, where the hills are
    }
    function frame(t){
      raf = reduced ? 0 : requestAnimationFrame(frame);
      const dt = Math.min(.05, last ? (t - last) / 1000 : 0); last = t;   // seconds since the last frame, so a slow machine falls at the same pace
      cx.clearRect(0, 0, W, H);
      const v = view();
      if (moon) moonlight(v, dt);
      if (v && v.hy <= 0 && !drops.length) return;   // the camera looks down at the ground: no sky in view
      for (const s of stars) { const q = project(s.az, s.alt, v); if (!q || q.x < -10 || q.x > W + 10) continue;
        cx.globalAlpha = q.fade * s.a * (reduced ? 1 : .5 + .5 * Math.sin(s.p + t * .001 * s.f)); cx.drawImage(STAR, q.x - s.s / 2, q.y - s.s / 2, s.s, s.s); }
      if (moon) { const q = project(moon.az, moon.alt, v);
        if (q) { cx.globalAlpha = moon.a * q.fade; cx.drawImage(moon.img, q.x - moon.img.width / 2, q.y - moon.img.height / 2); } }
      cx.globalAlpha = 1;
      if (!drops.length) return;
      const snow = now.kind === 'snow', dark = isDark();
      // wind pushes the fall sideways; its direction is where it blows from, so a west wind drifts things east (right)
      const wind = Math.min(now.wind, 40) / 40, sx = Math.sin((now.dir + 180) * R) * wind * (snow ? 60 : 260);
      if (snow) {
        const img = dark ? FLAKE.dark : FLAKE.light;
        for (const d of drops) { d.p += dt * 1.4; d.x += (sx + Math.sin(d.p) * 22) * dt; d.y += d.v * dt;
          cx.globalAlpha = d.a; cx.drawImage(img, d.x - d.l / 2, d.y - d.l / 2, d.l, d.l);
          if (d.y > H + 20 || d.x < -120 || d.x > W + 120) Object.assign(d, drop(false)); }
      } else {
        cx.strokeStyle = dark ? '#d6dfea' : '#3f4f61'; cx.lineCap = 'round';
        for (const d of drops) { d.x += sx * dt; d.y += d.v * dt;
          cx.globalAlpha = d.a; cx.lineWidth = d.w; cx.beginPath(); cx.moveTo(d.x, d.y); cx.lineTo(d.x - sx * d.l / d.v, d.y - d.l); cx.stroke();
          if (d.y > H + 20 || d.x < -120 || d.x > W + 120) Object.assign(d, drop(false)); }
      }
      cx.globalAlpha = 1;
    }
    /* moonlight on the graveyards: a pale pool of light on the ground at each spot, flattened by the camera's tilt and as bright
       as the moon is full. All three share the light; the one picked takes most of it */
    function moonlight(v, dt){
      if (!o.spots || !o.map || !o.spots.length) return;
      const lit = (.35 + .65 * now.moon.lit) * moon.a;
      const squash = v ? Math.max(.28, Math.cos(v.pitch)) : 1;
      cx.save(); cx.globalCompositeOperation = 'screen'; cx.globalAlpha = 1;
      o.spots.forEach((p, i) => {
        const s = spotK[i], target = picked === null ? .62 : picked === i ? 1 : .14;
        s.k += (target - s.k) * Math.min(1, (reduced ? 1 : dt * 3.5) || .2);
        let S; try { S = o.map.project([p.lng, p.lat]); } catch (_) { return; }
        if (S.x < -300 || S.x > W + 300 || S.y < -300 || S.y > H + 300) return;
        const a = lit * s.k, wS = 30 + 60 * s.k;
        cx.save(); cx.translate(S.x, S.y); cx.scale(1, squash);
        const r = wS * 1.2, pg = cx.createRadialGradient(0, 0, 0, 0, 0, r);
        pg.addColorStop(0, `rgba(238,244,255,${(a * .6).toFixed(3)})`); pg.addColorStop(.45, `rgba(222,233,255,${(a * .25).toFixed(3)})`); pg.addColorStop(1, 'rgba(222,233,255,0)');
        cx.fillStyle = pg; cx.beginPath(); cx.arc(0, 0, r, 0, 2 * Math.PI); cx.fill(); cx.restore();
      });
      cx.restore();
    }
    function draw(){ cancelAnimationFrame(raf); raf = 0; last = 0; cx.clearRect(0, 0, W, H); if (drops.length || stars.length || moon) frame(performance.now()); }

    let flashT = 0;
    function lightning(){
      clearTimeout(flashT);
      if (!now || now.kind !== 'storm' || reduced) return;
      flashT = setTimeout(() => { layer.classList.add('flash'); setTimeout(() => layer.classList.remove('flash'), 120);
        setTimeout(() => { layer.classList.add('flash'); setTimeout(() => layer.classList.remove('flash'), 90); }, 220); lightning(); }, 5000 + Math.random() * 9000);
    }
    /* the map's own sky and fog thicken with cloud and fog */
    /* the map's own sky takes the weather's colours: navy at night, blue when clear, grey under cloud and rain; fog thickens with it */
    let base = null;
    function mapSky(){
      if (!o.map || !o.map.getSky || !now) return;
      try {
        base = base || Object.assign({}, o.map.getSky() || {});
        const s = Object.assign({}, base), k = now.kind, dark = isDark(), warm = now.sun.alt > 0 && now.sun.alt < R * 10;
        const heavy = { fog: .95, storm: .75, rain: .65, snow: .7, drizzle: .55, cloudy: .45 }[k];
        let top, hor;
        if (!now.day) { top = '#060c20'; hor = now.moon.up ? '#2b3c66' : '#16203f'; }
        else if (k === 'clear') { top = dark ? '#21456e' : '#86b4e2'; hor = warm ? '#f1bf86' : dark ? '#4c6788' : '#e6eef4'; }
        else if (k === 'cloudy') { top = dark ? '#384250' : '#a7b2be'; hor = dark ? '#57606c' : '#dde2e6'; }
        else { top = dark ? '#2d333b' : '#959fa8'; hor = dark ? '#4a5159' : '#d2d7da'; }
        Object.assign(s, { 'sky-color': top, 'horizon-color': hor, 'fog-color': hor, 'sky-horizon-blend': .55 });
        if (heavy) { s['fog-ground-blend'] = Math.max(base['fog-ground-blend'] || 0, heavy * .8); s['horizon-fog-blend'] = Math.max(base['horizon-fog-blend'] || 0, heavy); }
        o.map.setSky(s);
      } catch (_) {}
    }
    function sunGlow(){
      if (!now) return;
      const v = view(), q = v && now.sun.alt > 0 ? project(now.sun.az, now.sun.alt, v) : null;
      if (q) { layer.style.setProperty('--sx', (q.x / W * 100).toFixed(1) + '%'); layer.style.setProperty('--sy', (q.y / H * 100).toFixed(1) + '%'); }
      else if (v) { const rel = wrap(now.sun.az - v.bearing);   // out of view: the glow comes from the side it is on
        layer.style.setProperty('--sx', (rel > 0 ? 112 : -12) + '%'); layer.style.setProperty('--sy', Math.max(-15, v.hy / H * 100 - 8).toFixed(1) + '%'); }
    }
    function apply(c){
      const code = P.get('weather') in PREVIEW ? PREVIEW[P.get('weather')] : c.weather_code;
      const sk = sky(Date.now(), o.lat, o.lng);
      const day = P.has('night') ? P.get('night') !== '1' : !!c.is_day;
      let m = sk.moon;
      const MOONS = { full: .5, half: .25, crescent: .12 };
      if (P.get('moon') in MOONS) m = { phase: MOONS[P.get('moon')], lit: (1 - Math.cos(2 * Math.PI * MOONS[P.get('moon')])) / 2, az: 2.4, alt: .7 };
      const moonUp = P.get('moon') === 'none' ? false : m.alt > .02 && m.lit > .03;
      now = { kind: kind(code), code, label: LABEL[code] || 'Weather', day, t: c.temperature_2m, wind: c.wind_speed_10m || 0, dir: c.wind_direction_10m || 0,
              clouds: P.get('weather') === 'cloudy' ? 70 : c.cloud_cover || 0, hum: c.relative_humidity_2m, moon: Object.assign({}, m, { up: moonUp }), sun: sk.sun };
      layer.dataset.wx = now.kind; layer.dataset.day = day ? 'day' : 'night';
      layer.style.setProperty('--cloud', (now.kind === 'clear' ? Math.min(now.clouds, 30) : Math.max(now.clouds, 55)) / 100);
      layer.style.setProperty('--drift', Math.max(16, 34 - Math.min(now.wind, 40) * .45) + 's');
      layer.style.setProperty('--moon', !day && moonUp ? m.lit.toFixed(2) : 0);
      // the sun's glow stands where the sun is: east to the right, higher in the sky nearer the top, warmer when it is low
      const sa = Math.max(0, sk.sun.alt);
      layer.style.setProperty('--sx', (50 + 44 * Math.sin(sk.sun.az)).toFixed(1) + '%');
      layer.style.setProperty('--sy', (40 - 38 * Math.min(1, sa / (Math.PI / 3))).toFixed(1) + '%');
      layer.style.setProperty('--warm', (1 - Math.min(1, sa / (Math.PI / 6))).toFixed(2));
      const sky2 = day ? '' : moonUp ? `${phaseName(m.phase)}, ${Math.round(m.lit * 100)}% lit` : P.get('moon') === 'none' || m.lit <= .03 ? 'New moon, no moonlight' : 'Moon below the horizon';
      if (o.readout) {
        o.readout.innerHTML = `<span class="wx-ico">${icon(now.kind, day)}</span><span><small>${o.place} · now</small><b>${Math.round(now.t)}° · ${now.label}</b>${sky2 ? `<em>${sky2}</em>` : ''}</span>`;
        o.readout.title = `${now.label}, ${Math.round(now.t)}°C, wind ${Math.round(now.wind)} km/h, humidity ${now.hum}%${sky2 ? '. ' + sky2 : ''} · Open-Meteo`;
      }
      seed(); lightning(); mapSky(); sunGlow(); draw();
    }
    let real = null;
    async function load(){
      try { real = await fetchNow(o.lat, o.lng); apply(real); }
      catch (_) { if (!real && preview) apply(stand); }
    }
    // a previewed condition shows at once, on stand-in figures, and takes the real temperature and wind when they arrive
    const preview = P.get('weather') in PREVIEW || P.has('night') || P.has('moon');
    const stand = { weather_code: 0, is_day: 1, temperature_2m: 14, wind_speed_10m: 12, wind_direction_10m: 270, cloud_cover: 50, relative_humidity_2m: 60 };
    size(); addEventListener('resize', () => { size(); draw(); });
    if (preview) apply(stand);
    document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else draw(); });
    if (o.map) { o.map.on('style.load', mapSky); o.map.on('move', sunGlow); }
    load(); setInterval(load, 15 * 60 * 1000);   // conditions update every 15 minutes
    setInterval(() => { if (real || preview) apply(real || stand); }, 5 * 60 * 1000);   // and the sun and moon move on between them
    // with motion reduced the canvas is drawn once, so a change of focus redraws it
    const focus = i => { picked = i == null ? null : i; if (reduced) draw(); };
    return (Weather.current = { get: () => now, view, project, focus, moon: () => moon, stars: () => stars.length });   // Weather.current: for checking the sky from the console
  }
  return { start, sky };
})();
