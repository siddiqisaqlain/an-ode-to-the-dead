/* The archive, laid out the same way as the project folders:
   site → zones (lettered) → graves (numbered) → five folders (cad, pdfs + revisions, photos, sketches, photographer).
   Files for a grave live in archive/<site>/zone-<letter>/grave-<n>/, under folders of the same names.
   Plans are in metres: x runs east, z runs south, origin at the north-west corner of the zone's bounding box. */
window.ARCHIVE = {
  project: 'Documentation and Conservation of Three Historical Graveyards of Kashmir',
  institution: 'Islamic University of Science and Technology, Awantipora',
  funder: 'The Barakat Trust, UK',
  sites: [
    {
      id: 'imambargah-hassanabad', name: 'Imambargah, Hassanabad', place: 'Rainawari, Srinagar', lat: 34.102778, lng: 74.830606,
      zones: [
        { id: 'A', graves: [] }, { id: 'B', graves: [] }, { id: 'C', graves: [] }, { id: 'D', graves: [] },
        { id: 'E', graves: [] }, { id: 'F', graves: [] },
        {
          id: 'G', source: 'the zone map on Sheet 61',
          north: 15,   // degrees clockwise from the top of the plan
          boundary: [[3.8, 0], [11.12, 0], [11.38, 8.12], [0, 8.32], [0.1, 5.05], [2.81, 4.98], [2.87, 5.64],
                     [3.73, 5.64], [3.73, 3.66], [3.3, 3.66], [3.3, 3], [3.8, 3]],
          graves: [
            { n: 1, plan: { x: 4.19, z: 4.39, w: 0.46, d: 1.19 } },
            {
              n: 2, plan: { x: 4.16, z: 5.51, w: 0.49, d: 0.11 }, kind: 'headstone', height: 0.73,
              sheet: '61', scale: '1:10', lat: 34.102778, lng: 74.830606,
              scan: { src: 'scan/scan.json', groundNormal: [0.1142, 0.9896, -0.0875] },   // levels the 8° tilt in the scan's ground
              files: {
                cad: [],
                pdfs: { final: { src: 'pdfs/sheet-61-final.png', title: 'Sheet 61 · final' }, revisions: [] },
                photos: [{ src: 'photos/photo-1.jpg', title: 'Reference photograph' }],
                sketches: [],
                photographer: []
              },
              /* where each photograph was taken, in the scan's own coordinates (SIFT features + PnP against renders of the scan) */
              poses: [
                { src: 'photos/photo-1.jpg', title: 'Reference photograph · Sheet 61',
                  pos: [-0.37932, 0.61808, 0.8621], quat: [0.04461, -0.187617, -0.205886, 0.959386], vfov: 58.109, aspect: 0.67483,
                  frame: [[-0.34671, 0.69835, 0.74652], [-0.27069, 0.6613, 0.77725], [-0.32113, 0.5398, 0.75554], [-0.39715, 0.57685, 0.7248]],
                  fit: { points: 884, medianPx: 1.99 } }
              ],
              /* guided tour: targets in the scan's own coordinates, distances in scan units */
              tour: [
                { title: 'Grave 2, Zone G', secs: 8, local: [0, .35, 0], dir: [1.1, .75, 1.25], dist: 3.6,
                  text: 'This grave lies in Zone G of the graveyard at the Imambargah, Hassanabad, Srinagar. The scan records the stone in its setting.' },
                { title: 'The stone, first face', secs: 8, local: [.05, .78, -.09], dir: [.43, .28, -.9], dist: 1.9,
                  text: 'The headstone rises to a pointed arch. Its face is carved with an inscription, recorded here as it stands today.' },
                { title: 'The stone, second face', secs: 8, local: [.05, .78, -.09], dir: [-.43, .28, .9], dist: 1.9,
                  text: 'One section of the epitaph has been displaced diagonally from the main stone. The sheet also records the stone\'s existing tilt on site.' },
                { title: 'The reference photograph', secs: 8, photo: 0,
                  text: 'The camera stands where the reference photograph on Sheet 61 was taken, and the photograph fades in over the scan.' },
                { title: 'From above', secs: 7, local: [0, .35, 0], dir: [0, 1, .02], dist: 3.2,
                  text: 'Seen from above, the stone sits within its ground. The top view on Sheet 61 records it at 1:10.' },
                { title: 'Sheet 61', secs: 10, local: [0, .35, 0], dir: [1.1, .75, 1.25], dist: 3.6, sheet: true,
                  text: 'The measured drawing rises from behind the grave: elevations, section, top view, tilt and details, with coordinates 34.102778, 74.830606.' }
              ]
            },
            { n: 3, plan: { x: 6.63, z: 5.81, w: 0.4, d: 0.59 } },
            { n: 4, plan: { x: 7.06, z: 3.96, w: 0.26, d: 0.53 } },
            { n: 5, plan: { x: 7.85, z: 4.39, w: 0.26, d: 0.73 } },
            { n: 6, plan: { x: 8.94, z: 2.24, w: 0.33, d: 0.79 } },
            { n: 7, plan: { x: 8.84, z: 4.32, w: 0.26, d: 0.53 } }
          ]
        }
      ]
    },
    { id: 'madeen-sahab', name: 'Madeen Sahab', place: 'Srinagar', zones: [{ id: 'A', graves: [] }] },
    { id: 'anderkote-sumbal', name: 'Anderkote, Sumbal', place: 'Ganderbal', zones: [{ id: 'A', graves: [] }, { id: 'B', graves: [] }, { id: 'C', graves: [] }] }
  ]
};

/* lookups and links shared by the pages */
window.Archive = {
  site: id => ARCHIVE.sites.find(s => s.id === id),
  zone: (site, id) => site && site.zones.find(z => z.id === id),
  grave: (zone, n) => zone && zone.graves.find(g => String(g.n) === String(n)),
  dir: (site, zone, g) => `archive/${site.id}/zone-${zone.id}/grave-${g.n}/`,
  siteURL: (site, zone) => `site.html?site=${site.id}` + (zone ? `&zone=${zone.id}` : ''),
  graveURL: (site, zone, g) => `grave.html?site=${site.id}&zone=${zone.id}&grave=${g.n}`,
  hasRecord: g => !!(g.scan || g.files),
  params: () => Object.fromEntries(new URLSearchParams(location.search))
};

/* Zones without a traced plan get the default template: a plain rectangular zone. If the zone has a `count`
   (number of graves) but no grave entries yet, numbered graves are laid out in rows on the template.
   To update a zone later: add `count: N` for numbered graves, then replace with `boundary` + grave `plan`
   positions once the site plan arrives. Real grave entries always win over generated ones. */
(function(){
  const W = 12, D = 9, gap = { x: 1.4, z: 2.2 }, margin = 1.2;
  ARCHIVE.sites.forEach(site => site.zones.forEach(z => {
    if (z.boundary) return;
    z.template = true; z.north = z.north || 0;
    z.boundary = [[0, 0], [W, 0], [W, D], [0, D]];
    const perRow = Math.floor((W - margin * 2) / gap.x) + 1, have = new Set(z.graves.map(g => g.n));
    for (let n = 1; n <= (z.count || 0); n++) if (!have.has(n)) z.graves.push({ n });
    z.graves.sort((a, b) => a.n - b.n);
    z.graves.forEach((g, i) => {
      if (g.plan) return;
      g.plan = { x: margin + (i % perRow) * gap.x, z: margin + Math.floor(i / perRow) * gap.z, w: .45, d: 1.1 };
      g.templated = true;
    });
  }));
})();
