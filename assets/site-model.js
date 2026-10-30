/* Site models: a site built in Blender (real roof forms, textured walls, trees) drawn on the site map with three.js in
   place of the plain extruded blocks. The model's origin is the site key plan's centre (ref); x east, y up, z south, metres.
   Each vertex's second UV is where it meets the ground (east, 1 - north), so buildings and trees sit rigidly on the
   terrain and walls follow it. Textures: Poly Haven (CC0). Needs MapLibre GL and three.js r128 with GLTFLoader. */
window.SiteModel = (function(){
  const M = 111320;
  const DATA = {
    'imambargah-hassanabad': { ref: { lat: 34.102826, lng: 74.830186 }, model: { url: 'assets/models/imambargah-hassanabad.glb' } }
  };

  function modelLayer(map, d, dark){
    const ref = d.ref, kl = M * Math.cos(ref.lat * Math.PI / 180), origin = [ref.lng, ref.lat];
    const lngLat = (x, y) => [ref.lng + x / kl, ref.lat + y / M];
    let scene, camera, renderer, model = null, merc = null, seatedAt = null;
    function seat(){
      const terrain = !!map.terrain, e0 = terrain ? map.queryTerrainElevation(origin) : 0;
      if (e0 == null) return;
      const probe = terrain ? [[-60, -60], [90, 60], [0, 80]].map(([x, y]) => map.queryTerrainElevation(lngLat(x, y))).join() : '';
      if (seatedAt === e0 + probe) return;   // terrain unchanged since the last seating
      seatedAt = e0 + probe;
      const step = 3, cache = new Map();
      const rise = (x, y) => {
        const gx = Math.round(x / step), gy = Math.round(y / step), key = gx + ',' + gy;
        if (!cache.has(key)) { const v = terrain ? map.queryTerrainElevation(lngLat(gx * step, gy * step)) : 0; cache.set(key, v == null ? 0 : v - e0); }
        return cache.get(key);
      };
      model.traverse(o => {
        if (!o.isMesh || !o.geometry.attributes.uv2) return;
        const p = o.geometry.attributes.position, a = o.geometry.attributes.uv2;
        const y0 = o.userData.y0 || (o.userData.y0 = Float32Array.from({ length: p.count }, (_, i) => p.getY(i)));
        for (let i = 0; i < p.count; i++) p.setY(i, y0[i] + rise(a.getX(i), 1 - a.getY(i)));
        p.needsUpdate = true; o.geometry.computeBoundingSphere();
      });
      merc = maplibregl.MercatorCoordinate.fromLngLat(origin, e0);
      map.triggerRepaint();
    }
    return {
      id: 'detail-model', type: 'custom', renderingMode: '3d',
      onAdd(m, gl){
        camera = new THREE.Camera(); scene = new THREE.Scene();
        scene.add(new THREE.HemisphereLight(dark ? 0x8a93a3 : 0xe4ecf5, dark ? 0x2a2622 : 0x6b5f4f, dark ? .55 : .9));
        const sun = new THREE.DirectionalLight(dark ? 0xb8c4d8 : 0xfff2dc, dark ? .6 : 1.5);
        sun.position.set(-.47, .74, .47); scene.add(sun);   // from the south-west, about 48 degrees up (x east, y up, z south)
        renderer = new THREE.WebGLRenderer({ canvas: m.getCanvas(), context: gl, antialias: true });
        renderer.autoClear = false; renderer.outputEncoding = THREE.sRGBEncoding;
        new THREE.GLTFLoader().load(d.model.url, gltf => {
          model = gltf.scene;
          model.traverse(o => {
            if (!o.isMesh || !o.material) return;
            /* soft Phong instead of the physical material: with no sky to reflect, physical tin and plaster turn silvery
               at grazing angles; glass and metal keep a little shine */
            const mt = o.material, shiny = mt.metalness > .5 || mt.roughness < .5;
            o.material = new THREE.MeshPhongMaterial({ map: mt.map, normalMap: mt.normalMap, normalScale: new THREE.Vector2(.6, .6),
              color: mt.color, vertexColors: !!o.geometry.attributes.color, shininess: shiny ? 30 : 4, specular: shiny ? 0x333333 : 0x0a0a0a });
            mt.dispose();
          });
          scene.add(model); seat();
        }, undefined, err => console.warn('Site model did not load', err));
        m.on('idle', () => { if (model) seat(); });
      },
      render(gl, args){
        if (!model || !merc) return;
        const z = map.getZoom(); if (z < 14.5) return;
        const grow = Math.min(1, (z - 14.5) / 1.5), s = merc.meterInMercatorCoordinateUnits();   // rises with the zoom, like the blocks
        const mm = args && args.defaultProjectionData ? args.defaultProjectionData.mainMatrix : args;
        const l = new THREE.Matrix4().makeTranslation(merc.x, merc.y, merc.z).scale(new THREE.Vector3(s, -s, s))
          .multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2)).multiply(new THREE.Matrix4().makeScale(1, grow, 1));
        camera.projectionMatrix = new THREE.Matrix4().fromArray(mm).multiply(l);
        renderer.resetState(); renderer.render(scene, camera);
      }
    };
  }


  const has = id => !!(DATA[id] && window.THREE && THREE.GLTFLoader);
  /* adds the model under the zones and graves; close in, the basemap's plain buildings give way to it */
  function add(map, site, dark, before){
    if (!has(site.id)) return false;
    map.addLayer(modelLayer(map, DATA[site.id], dark), map.getLayer(before) ? before : undefined);
    if (map.getLayer('buildings')) map.setLayerZoomRange('buildings', map.getLayer('buildings').minzoom || 0, 15);
    return true;
  }
  return { add, has };
})();
