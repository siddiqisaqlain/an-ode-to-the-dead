/* Site detail: the ground around a site's graves, so the zones sit in their real setting rather than on blank paper.
   Traced by hand from the site key plan (zone-maps/<site>/site-reference.png) and read against aerial 3D views of the
   site (Google Earth, October 2026). The imagery is only the reference; nothing from it is embedded. Positions are in
   key-plan pixels and converted with the plan's georeference, so they share the zones' placement. Heights are estimates.
   Needs MapLibre GL. */
window.SiteDetail = (function(){
  const M = 111320;
  /* a stepped roof: n tiers from scale s0 at height h0 to scale s1 at height h1, so a hipped or pyramidal roof reads in the massing */
  const steps = (s0, s1, h0, h1, n) => Array.from({ length: n }, (_, i) => [s0 + (s1 - s0) * i / (n - 1), h0 + (h1 - h0) * i / n, h0 + (h1 - h0) * (i + 1) / n]);

  /* Imambargah, Hassanabad. Key plan: centre 34.102826, 74.830186 at pixel 810,540; 0.17 m per pixel; north up. */
  const DATA = {
    'imambargah-hassanabad': {
      ref: { lat: 34.102826, lng: 74.830186, px: [810, 540], mpp: .17 },
      ground: [
        { kind: 'earth', pts: [[450,330],[600,345],[660,355],[720,345],[860,295],[1000,240],[1080,300],[1110,420],[1185,600],[1185,655],[880,705],[850,560],[820,520],[720,480],[560,520],[470,500]] },
        { kind: 'field', pts: [[875,705],[1185,655],[1185,598],[1330,590],[1345,700],[1350,900],[1290,902],[1090,905],[1090,965],[870,960],[850,800]] },
        { kind: 'water', name: 'Canal', pts: [[1258,0],[1270,100],[1282,200],[1295,300],[1315,400],[1338,500],[1350,600],[1352,700],[1360,800],[1370,900],[1390,1000],[1410,1080],
                                              [1500,1080],[1480,1000],[1460,900],[1445,800],[1440,700],[1420,600],[1400,500],[1390,400],[1380,300],[1360,200],[1345,100],[1340,0]] }
      ],
      paths: [
        [[870,505],[1000,455],[1100,415]],
        [[1225,512],[1150,420],[1080,300]]
      ],
      /* rect: centre, width, depth (pixels), turn (degrees, anticlockwise seen from above); tiers stack upwards */
      buildings: [
        { name: 'Imambargah', c: [676,614], w: 188, d: 215, turn: 17, color: 'tin', tiers: [[1, 0, 6.5], ...steps(.9, .14, 6.5, 16.5, 8)] },
        { name: 'Jamia Masjid', c: [725,226], w: 202, d: 200, turn: 20, color: 'lime', tiers: [[1, 0, 8.5]] },
        { c: [712,232], r: 35, color: 'slate', tiers: [[1, 8.5, 10.5], ...steps(.85, .2, 10.5, 15, 5)] },          // the masjid's raised centre
        { c: [776,394], w: 78, d: 80, turn: 15, color: 'grey', tiers: [[1, 0, 6], ...steps(.85, .3, 6, 8.4, 3)] },
        { c: [942,548], w: 40, d: 35, turn: 15, color: 'lime', tiers: [[1, 0, 4.2], ...steps(.8, .25, 4.2, 6, 3)] }   // the small walled building in Zone G
      ],
      rings: [ { c: [1230,535], r: 25, t: 3, h: 1.8 } ],        // the round enclosure by the canal
      walls: [
        [[875,705],[960,688],[1050,668],[1185,655],[1185,598]],
        [[1185,598],[1330,590],[1345,700],[1350,900]],
        [[1395,930],[1290,902],[1090,905],[1090,965]],
        [[875,705],[870,960]],
        [[1210,395],[1325,392],[1330,590]],
        [[900,507],[987,484],[1009,560],[922,583],[900,507]]     // round the small building in Zone G
      ],
      /* [x, y, kind]: chinars spread wide; poplars stand tall and narrow along the canal. Bare, as in the winter views. */
      trees: [
        [930,130,'chinar'],[965,175,'chinar'],[1005,140,'chinar'],[1045,185,'chinar'],[1085,120,'chinar'],[995,262,'chinar'],[1050,250,'chinar'],
        [870,150,'chinar'],[890,252,'chinar'],[525,425,'chinar'],[480,470,'chinar'],
        [1080,450,'chinar'],[1122,482,'chinar'],[1152,522,'chinar'],[1110,562,'chinar'],[1162,440,'chinar'],[1060,522,'chinar'],
        [1240,120,'poplar'],[1250,200,'poplar'],[1262,282,'poplar'],[1282,380,'poplar'],[1302,470,'poplar'],[1320,640,'poplar'],
        [1328,700,'poplar'],[1332,760,'poplar'],[1336,860,'poplar'],[1236,160,'poplar'],[1274,330,'poplar']
      ]
    }
  };

  function colors(dark){
    return dark
      ? { earth:'#26231f', earthFleck:'#3a352e', field:'#2b2822', fieldBlade:'#3d382d', water:'#1c2a31', ripple:'#2a3c44', path:'#34302a',
          tin:'#55625e', lime:'#bdb8ad', slate:'#43474b', grey:'#6d6b66', wall:'#5a5145', trunk:'#4a4038', chinar:'#4f483f', poplar:'#4b4a3c',
          roofs:['#6b5048','#4e5a50','#4f565b','#5e5d59','#6b4a46','#525b63'], walls:['#8f8b84','#86817a','#7d7a75'], label:'#8e8e93', halo:'#18191c' }
      : { earth:'#dcd3c3', earthFleck:'#c4b8a3', field:'#d9cfb2', fieldBlade:'#c3b591', water:'#bccbce', ripple:'#d3dfe1', path:'#e9e2d4',
          tin:'#8ea29b', lime:'#f2eee5', slate:'#6c7175', grey:'#c6c4be', wall:'#b9ab95', trunk:'#7a6957', chinar:'#a69a86', poplar:'#9a9878',
          roofs:['#c7a294','#a9b7aa','#a7aeb3','#c6c5bf','#c4928b','#b0b9c0'], walls:['#f3eee6','#e9e1d4','#e2dcd2'], label:'#7c7b76', halo:'#ecebe6' };
  }

  /* small tiling textures, drawn once per theme: speckled earth, dry grass, a ripple on the water */
  function pattern(size, base, draw){
    const cv = document.createElement('canvas'); cv.width = cv.height = size;
    const g = cv.getContext('2d'); g.fillStyle = base; g.fillRect(0, 0, size, size);
    let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    draw(g, rnd, size);
    return g.getImageData(0, 0, size, size);
  }
  function textures(k){
    return {
      'tex-earth': pattern(64, k.earth, (g, r, n) => {
        g.fillStyle = k.earthFleck;
        for (let i = 0; i < 90; i++) { g.globalAlpha = .3 + r() * .5; g.fillRect(r() * n, r() * n, 1 + r() * 1.6, 1 + r() * 1.2); }
      }),
      'tex-field': pattern(64, k.field, (g, r, n) => {
        g.strokeStyle = k.fieldBlade; g.lineWidth = 1;
        for (let i = 0; i < 70; i++) {
          const x = r() * n, y = r() * n, a = -Math.PI / 2 + (r() - .5) * 1.2, l = 2 + r() * 3;
          g.globalAlpha = .35 + r() * .45; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
        }
      }),
      'tex-water': pattern(64, k.water, (g, r, n) => {
        g.strokeStyle = k.ripple; g.lineWidth = 1;
        for (let y = 4; y < n; y += 9) {
          g.globalAlpha = .5 + r() * .4; g.beginPath();
          for (let x = 0; x <= n; x += 4) g.lineTo(x, y + Math.sin((x / n) * Math.PI * 4 + y) * 1.4);
          g.stroke();
        }
      })
    };
  }

  function build(d, k){
    const { ref } = d, kl = M * Math.cos(ref.lat * Math.PI / 180);
    const ll = ([x, y]) => [ref.lng + (x - ref.px[0]) * ref.mpp / kl, ref.lat - (y - ref.px[1]) * ref.mpp / M];
    const poly = (pts, props) => ({ type: 'Feature', properties: props, geometry: { type: 'Polygon', coordinates: [pts.concat([pts[0]]).map(ll)] } });
    const rect = (c, w, dd, turn) => {
      const a = -turn * Math.PI / 180, cs = Math.cos(a), sn = Math.sin(a);
      return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => { const x = u * w / 2, y = v * dd / 2; return [c[0] + x * cs - y * sn, c[1] + x * sn + y * cs]; });
    };
    const circle = (c, r, n = 20) => Array.from({ length: n }, (_, i) => [c[0] + r * Math.cos(i / n * 2 * Math.PI), c[1] + r * Math.sin(i / n * 2 * Math.PI)]);
    const px = m => m / ref.mpp;   // metres to key-plan pixels

    const ground = d.ground.map(g => poly(g.pts, { kind: g.kind }));
    const solids = [], canopy = [], labels = [];
    d.buildings.forEach(b => {
      b.tiers.forEach(([s, base, top]) => {
        const pts = b.r ? circle(b.c, b.r * s, 8) : rect(b.c, b.w * s, b.d * s, b.turn);
        solids.push(poly(pts, { base, top, color: k[b.color] }));
      });
      if (b.name) labels.push({ type: 'Feature', properties: { name: b.name, h: b.tiers[b.tiers.length - 1][2] }, geometry: { type: 'Point', coordinates: ll(b.c) } });
    });
    d.rings.forEach(r => {
      const outer = circle(r.c, r.r, 28), inner = circle(r.c, r.r - r.t, 28).reverse();
      solids.push({ type: 'Feature', properties: { base: 0, top: r.h, color: k.wall },
        geometry: { type: 'Polygon', coordinates: [outer.concat([outer[0]]).map(ll), inner.concat([inner[0]]).map(ll)] } });
    });
    const t = px(.45) / 2;   // walls: 45 cm thick, about head height
    d.walls.forEach(line => line.slice(1).forEach((q, i) => {
      const p = line[i], dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy), nx = -dy / l * t, ny = dx / l * t;
      solids.push(poly([[p[0] + nx, p[1] + ny], [q[0] + nx, q[1] + ny], [q[0] - nx, q[1] - ny], [p[0] - nx, p[1] - ny]], { base: 0, top: 1.7, color: k.wall }));
    }));
    /* trees: a trunk, then a crown of stacked, slightly offset discs, so it reads round and uneven rather than as a drum */
    d.trees.forEach(([x, y, kind], i) => {
      const v = ((i * 37) % 10) / 10, poplar = kind === 'poplar', j = n => (((i * 53 + n * 29) % 17) / 17 - .5);
      solids.push(poly(circle([x, y], px(poplar ? .25 : .4), 6), { base: 0, top: poplar ? 4 : 5, color: k.trunk }));
      const r = poplar ? 1.5 + v * .4 : 3.4 + v * 1.6, h0 = poplar ? 3 : 4, h1 = poplar ? 16 + v * 4 : 11 + v * 4;
      const shape = poplar ? [.6, .9, 1, .95, .8, .55, .3] : [.55, .85, 1, .95, .75, .45];
      shape.forEach((sc, n) => {
        const c = [x + px(j(n) * r * .35), y + px(j(n + 5) * r * .35)];
        canopy.push(poly(circle(c, px(r * sc), poplar ? 8 : 11), { base: h0 + (h1 - h0) * n / shape.length, top: h0 + (h1 - h0) * (n + 1) / shape.length, color: poplar ? k.poplar : k.chinar }));
      });
    });
    /* the neighbourhood: indicative houses (assets/detail-houses.js), plastered walls under a stepped tin roof, gabled
       (narrowing across the depth only) or hipped (narrowing both ways) */
    const houses = [];
    ((window.SiteDetailHouses || {})[d.id] || []).forEach(([e, n, w, dd, turn, h, roof, hip], i) => {
      const c = [ref.px[0] + e / ref.mpp, ref.px[1] - n / ref.mpp];
      houses.push(poly(rect(c, px(w), px(dd), turn), { base: 0, top: h, color: k.walls[i % 3] }));
      steps(1.04, .14, h, h + 2.8, 4).forEach(([sc, b, t]) => houses.push(poly(rect(c, px(w * (hip ? Math.max(sc, .45) : 1.04)), px(dd * sc), turn), { base: b, top: t, color: k.roofs[roof] })));
    });
    d.ground.filter(g => g.name).forEach(g => {
      const xs = g.pts.map(p => p[0]), ys = g.pts.map(p => p[1]);
      labels.push({ type: 'Feature', properties: { name: g.name, h: 0, water: true },
        geometry: { type: 'Point', coordinates: ll([(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2]) } });
    });
    const paths = d.paths.map(line => ({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: line.map(ll) } }));
    const fc = features => ({ type: 'FeatureCollection', features });
    return { ground: fc(ground), paths: fc(paths), houses: fc(houses), solids: fc(solids), canopy: fc(canopy), labels: fc(labels) };
  }

  /* adds the detail under the zones and graves; call before the page adds its own layers */
  function add(map, site, c){
    const d = DATA[site.id]; if (!d) return false;
    const k = colors(c.dark), g = build(Object.assign({ id: site.id }, d), k), tex = textures(k);
    Object.entries(tex).forEach(([id, img]) => { if (!map.hasImage(id)) map.addImage(id, img, { pixelRatio: 2 }); });
    ['ground', 'paths', 'houses', 'solids', 'canopy', 'labels'].forEach(s => map.addSource('detail-' + s, { type: 'geojson', data: g[s] }));
    const below = map.getLayer('buildings') ? 'buildings' : undefined;
    map.addLayer({ id: 'detail-ground', type: 'fill', source: 'detail-ground',
      paint: { 'fill-pattern': ['concat', 'tex-', ['get', 'kind']], 'fill-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0, 15.5, .95] } }, below);
    map.addLayer({ id: 'detail-water-edge', type: 'line', source: 'detail-ground', filter: ['==', ['get', 'kind'], 'water'],
      paint: { 'line-color': c.waterLine, 'line-width': ['interpolate', ['linear'], ['zoom'], 15, .4, 20, 1.5] } }, below);
    map.addLayer({ id: 'detail-paths', type: 'line', source: 'detail-paths', layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': k.path, 'line-width': ['interpolate', ['exponential', 2], ['zoom'], 16, 1, 20, 10, 22, 40], 'line-opacity': .9 } }, below);
    const rise = top => ['interpolate', ['linear'], ['zoom'], 14.5, 0, 16, top];
    map.addLayer({ id: 'detail-houses', type: 'fill-extrusion', source: 'detail-houses', minzoom: 14.5,
      paint: { 'fill-extrusion-color': ['get', 'color'], 'fill-extrusion-height': rise(['get', 'top']), 'fill-extrusion-base': rise(['get', 'base']),
               'fill-extrusion-opacity': .9, 'fill-extrusion-vertical-gradient': true } });
    map.addLayer({ id: 'detail-solids', type: 'fill-extrusion', source: 'detail-solids', minzoom: 14.5,
      paint: { 'fill-extrusion-color': ['get', 'color'], 'fill-extrusion-height': rise(['get', 'top']), 'fill-extrusion-base': rise(['get', 'base']),
               'fill-extrusion-opacity': .96, 'fill-extrusion-vertical-gradient': true } });
    map.addLayer({ id: 'detail-canopy', type: 'fill-extrusion', source: 'detail-canopy', minzoom: 14.5,
      paint: { 'fill-extrusion-color': ['get', 'color'], 'fill-extrusion-height': rise(['get', 'top']), 'fill-extrusion-base': rise(['get', 'base']),
               'fill-extrusion-opacity': .62, 'fill-extrusion-vertical-gradient': true } });
    map.addLayer({ id: 'detail-labels', type: 'symbol', source: 'detail-labels', minzoom: 16.5,
      layout: { 'text-field': ['upcase', ['get', 'name']], 'text-font': ['case', ['get', 'water'], ['literal', ['Noto Sans Italic']], ['literal', ['Noto Sans Regular']]],
                'text-size': 10, 'text-letter-spacing': .2, 'text-offset': [0, -1.2], 'text-allow-overlap': false },
      paint: { 'text-color': k.label, 'text-halo-color': k.halo, 'text-halo-width': 1.2, 'text-opacity': .9 } });
    return true;
  }

  return { add, has: id => !!DATA[id] };
})();
