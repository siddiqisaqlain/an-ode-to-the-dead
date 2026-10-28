/* The default 3D grave, used wherever a grave has no scan yet. It is sized from the grave's footprint on the zone plan.
   Needs three.js. x is the stone's width (east–west), z its depth (north–south), y up; origin at the centre of its base. */
window.GraveModels = (function(){
  const stone = () => new THREE.MeshStandardMaterial({ color: 0x77756a, roughness: .95 });
  const stone2 = () => new THREE.MeshStandardMaterial({ color: 0x66695d, roughness: .9 });

  // an upright stone with a pointed-arch head, like the headstones in the survey
  function arch(w, h, t, mat){
    const s = new THREE.Shape(), r = Math.min(h * .35, w * .75);
    s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h - r);
    s.quadraticCurveTo(w / 2, h - r * .25, 0, h); s.quadraticCurveTo(-w / 2, h - r * .25, -w / 2, h - r); s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false }); geo.translate(0, 0, -t / 2);
    return new THREE.Mesh(geo, mat || stone2());
  }

  function build(g){
    const p = g.plan || { w: .45, d: 1.1 }, grp = new THREE.Group();
    if (g.kind === 'headstone') { grp.add(arch(p.w, g.height || .7, p.d)); }
    else {
      // a low plinth over the footprint with an upright at its north end
      const plinthH = .2, plinth = new THREE.Mesh(new THREE.BoxGeometry(p.w, plinthH, p.d), stone());
      plinth.position.y = plinthH / 2; grp.add(plinth);
      const t = Math.min(.08, p.d * .15), up = arch(p.w * .85, Math.max(.35, p.w * 1.3), t);
      up.position.set(0, plinthH, -p.d / 2 + t / 2 + .02); grp.add(up);
    }
    grp.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });
    return grp;
  }

  return { build };
})();
