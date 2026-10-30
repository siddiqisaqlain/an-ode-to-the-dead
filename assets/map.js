/* The shared 3D map: the valley as an architectural massing model (paper, white buildings, terrain), and the
   geometry that places each zone plan on it. Needs MapLibre GL and assets/archive.js. */
window.MapKit = (function(){
  function palette(){
    const t = document.documentElement.dataset.theme;
    const dark = t === 'dark' || (t !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
    return dark
      ? { dark, land:'#18191c', green:'#1a1f1b', water:'#1c2a31', waterLine:'#33474f', road:'#2e3035', roadMajor:'#45474e', bld:'#cfccc4', bldTop:'#ecebe6',
          label:'#8e8e93', halo:'#18191c', shade:'#000000', hi:'#34363b', sky:'#0d0e10', horizon:'#26282d', mark:'#ff9f0a', stone:'#e6e3dc', ink:'#f5f5f7' }
      : { dark, land:'#ecebe6', green:'#e1e3d6', water:'#c6d2d5', waterLine:'#a9b9be', road:'#ffffff', roadMajor:'#ffffff', bld:'#f8f7f3', bldTop:'#ffffff',
          label:'#7c7b76', halo:'#ecebe6', shade:'#5d5a52', hi:'#ffffff', sky:'#dde2e5', horizon:'#f2f0ea', mark:'#ff9500', stone:'#b9b5aa', ink:'#1d1d1f' };
  }

  const DEM = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';
  function style(c, opts){
    const o = Object.assign({ exaggeration: 1.35, villagesFrom: 12.5 }, opts);
    const roads = (id, cls, w0, w1, color) => ({ id, type: 'line', source: 'omt', 'source-layer': 'transportation',
      filter: ['in', ['get', 'class'], ['literal', cls]], layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': color, 'line-width': ['interpolate', ['exponential', 1.6], ['zoom'], 9, w0, 18, w1, 22, w1 * 8] } });
    return {
      version: 8,
      glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
      sources: {
        omt: { type: 'vector', url: 'https://tiles.openfreemap.org/planet',
               attribution: '<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> © <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> Data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>' },
        dem: { type: 'raster-dem', encoding: 'terrarium', tileSize: 256, maxzoom: 14, tiles: [DEM], attribution: 'Terrain: Mapzen, AWS Open Data' },
        shade: { type: 'raster-dem', encoding: 'terrarium', tileSize: 256, maxzoom: 14, tiles: [DEM] }
      },
      terrain: { source: 'dem', exaggeration: o.exaggeration },
      sky: { 'sky-color': c.sky, 'horizon-color': c.horizon, 'fog-color': c.horizon, 'sky-horizon-blend': .6, 'horizon-fog-blend': .7, 'fog-ground-blend': .35, 'atmosphere-blend': 0 },
      layers: [
        { id: 'bg', type: 'background', paint: { 'background-color': c.land } },
        { id: 'green', type: 'fill', source: 'omt', 'source-layer': 'landcover', filter: ['in', ['get', 'class'], ['literal', ['grass', 'wood', 'farmland']]],
          paint: { 'fill-color': c.green, 'fill-opacity': .7 } },
        { id: 'hillshade', type: 'hillshade', source: 'shade',
          paint: { 'hillshade-exaggeration': .42, 'hillshade-shadow-color': c.shade, 'hillshade-highlight-color': c.hi, 'hillshade-accent-color': c.shade, 'hillshade-illumination-direction': 315 } },
        { id: 'water', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': c.water } },
        { id: 'water-edge', type: 'line', source: 'omt', 'source-layer': 'water', paint: { 'line-color': c.waterLine, 'line-width': .6 } },
        { id: 'waterway', type: 'line', source: 'omt', 'source-layer': 'waterway', paint: { 'line-color': c.water, 'line-width': ['interpolate', ['linear'], ['zoom'], 8, .6, 16, 4] } },
        roads('road-minor', ['minor', 'service', 'track', 'path'], .2, 5, c.road),
        roads('road-mid', ['tertiary', 'secondary'], .4, 9, c.roadMajor),
        roads('road-major', ['primary', 'trunk', 'motorway'], .7, 13, c.roadMajor),
        { id: 'buildings', type: 'fill-extrusion', source: 'omt', 'source-layer': 'building', minzoom: 13,
          paint: { 'fill-extrusion-color': ['interpolate', ['linear'], ['coalesce', ['get', 'render_height'], 6], 0, c.bld, 20, c.bldTop],
                   'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 13, 0, 14.5, ['coalesce', ['get', 'render_height'], 6]],
                   'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
                   'fill-extrusion-opacity': o.buildingOpacity || .92, 'fill-extrusion-vertical-gradient': true } },
        { id: 'water-names', type: 'symbol', source: 'omt', 'source-layer': 'water_name', minzoom: 10,
          layout: { 'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name']], 'text-font': ['Noto Sans Italic'], 'text-size': 11, 'text-letter-spacing': .12 },
          paint: { 'text-color': c.waterLine, 'text-halo-color': c.halo, 'text-halo-width': 1 } },
        { id: 'places', type: 'symbol', source: 'omt', 'source-layer': 'place',
          filter: ['any', ['in', ['get', 'class'], ['literal', ['city', 'town']]],
                   ['all', ['in', ['get', 'class'], ['literal', ['suburb', 'village', 'neighbourhood']]], ['>=', ['zoom'], o.villagesFrom]]],
          layout: { 'text-field': ['upcase', ['coalesce', ['get', 'name:en'], ['get', 'name']]], 'text-font': ['Noto Sans Regular'],
                    'text-size': ['match', ['get', 'class'], 'city', 12, 10], 'text-letter-spacing': .22, 'text-max-width': 12 },
          paint: { 'text-color': c.label, 'text-halo-color': c.halo, 'text-halo-width': 1.2, 'text-opacity': .85 } }
      ]
    };
  }

  /* ---------- placing zone plans on the map ----------
     If the site key plan marks where a zone lies (zone.at), the zone's centre goes there. Otherwise the zone's sheet coordinate is
     used: the sheet names the grave it was taken at (coordsFrom), and that grave's plan position is pinned to the coordinate and the plan is turned so its north matches (zone.north: degrees clockwise from the top of the plan).
     Zones without a recorded coordinate are set around the site's reference point, one beside the next. */
  const M = 111320;
  function framer(site, zone, slot, slots){
    const th = (zone.north || 0) * Math.PI / 180, cos = Math.cos(th), sin = Math.sin(th), b = zone.boundary;
    const hit = /Grave (\d+)/.exec(zone.coordsFrom || ''), g = hit && zone.graves.find(x => x.n === +hit[1] && x.plan);
    let ax, az, lat, lng, how;
    const centre = () => { const xs = b.map(p => p[0]), zs = b.map(p => p[1]); return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...zs) + Math.max(...zs)) / 2]; };
    if (zone.at) { [ax, az] = centre(); [lat, lng] = zone.at; how = 'reference'; }   // the site key plan marks where the zone lies
    else if (zone.lat && g) { ax = g.plan.x; az = g.plan.z; lat = zone.lat; lng = zone.lng; how = 'sheet'; }
    else {
      const xs = b.map(p => p[0]), zs = b.map(p => p[1]);
      ax = (Math.min(...xs) + Math.max(...xs)) / 2; az = (Math.min(...zs) + Math.max(...zs)) / 2;
      lat = site.lat; lng = site.lng + ((slot - (slots - 1) / 2) * 16) / (M * Math.cos(site.lat * Math.PI / 180));
      how = zone.template ? 'template' : 'site';
    }
    const kl = M * Math.cos(lat * Math.PI / 180), xs = b.map(p => p[0]);
    const k = zone.span ? zone.span / (Math.max(...xs) - Math.min(...xs)) : 1;   // the zone's measured ground extent, where known
    const at = (x, z) => { const dx = (x - ax) * k, dz = (z - az) * k, e = dx * cos + dz * sin, n = dx * sin - dz * cos; return [lng + e / kl, lat + n / M]; };
    return { at, how, k };
  }
  function rect(at, p, h){
    const r = (p.rot || 0) * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
    const pts = [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]].map(([u, v]) => {
      const px = u * p.w / 2, pz = v * p.d / 2;
      return at(p.x + px * c + pz * s, p.z - px * s + pz * c);   // turned anticlockwise (seen from above) by rot
    });
    return pts;
  }
  /* a tree as extrusions: the trunk, then the crown as stacked rings that swell and close like a chinar's dome.
     CROWN: [base, top, radius] as fractions of the tree's height and crown radius */
  const CROWN = [[.26, .34, .72], [.34, .46, .92], [.46, .64, 1], [.64, .78, .9], [.78, .9, .68], [.9, 1, .38]];
  function treeParts(centre, t, zone){
    const [lng, lat] = centre, kl = M * Math.cos(lat * Math.PI / 180);
    const ring = r => { const pts = []; for (let i = 0; i <= 24; i++) { const a = i / 24 * 2 * Math.PI; pts.push([lng + r * Math.cos(a) / kl, lat + r * Math.sin(a) / M]); } return [pts]; };
    const part = (kind, r, base, top) => ({ type: 'Feature', properties: { zone, part: kind, base, top, name: t.name || 'Tree' }, geometry: { type: 'Polygon', coordinates: ring(r) } });
    const h = t.height || 15, R = (t.crown || 10) / 2;
    return [part('trunk', (t.trunk || .8) / 2, 0, h * CROWN[1][0])].concat(CROWN.map(([b, tp, k]) => part('crown', R * k, h * b, h * tp)));
  }
  function geo(site){
    const free = site.zones.filter(z => !z.at && !(z.lat && /Grave \d+/.test(z.coordsFrom || '')));
    const zones = [], graves = [], labels = [], trees = [];
    let gid = 0;
    site.zones.forEach((z, i) => {
      const f = framer(site, z, free.indexOf(z), free.length);
      const ring = z.boundary.map(p => f.at(p[0], p[1])); ring.push(ring[0]);
      zones.push({ type: 'Feature', id: i, properties: { zone: z.id, template: !!z.template, how: f.how }, geometry: { type: 'Polygon', coordinates: [ring] } });
      const lngs = ring.map(p => p[0]), lats = ring.map(p => p[1]);
      const bounds = [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]];
      labels.push({ zone: z, i, how: f.how, centre: [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2], bounds, graves: [],
                    at: f.at, k: f.k });   // the zone's plan-to-map transform, for things drawn against its plan
      z.graves.forEach(g => {
        if (!g.plan) return;
        const rec = Archive.hasRecord(g), h = g.kind === 'headstone' ? (g.height || .7) : .55;
        graves.push({ type: 'Feature', id: ++gid, properties: { zone: z.id, n: g.n, rec, h },
          geometry: { type: 'Polygon', coordinates: [rect(f.at, g.plan)] } });
        labels[i].graves.push({ n: g.n, rec, at: f.at(g.plan.x, g.plan.z), id: gid, h });
      });
      labels[i].trees = (z.trees || []).map(t => { const at = f.at(t.x, t.z); trees.push(...treeParts(at, t, z.id)); return Object.assign({ at }, t); });
    });
    return { zones: { type: 'FeatureCollection', features: zones }, graves: { type: 'FeatureCollection', features: graves },
             trees: { type: 'FeatureCollection', features: trees }, labels };
  }

  /* the camera both pages agree on when you enter a site: the front page flies to it, the site page opens on it */
  function entry(site){
    const b = new maplibregl.LngLatBounds(); geo(site).labels.forEach(l => { b.extend(l.bounds[0]); b.extend(l.bounds[1]); });
    const c = b.getCenter(); return { center: [c.lng, c.lat], zoom: 15.2, pitch: 40, bearing: -22 };
  }

  return { palette, style, geo, entry };
})();
