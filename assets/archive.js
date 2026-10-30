/* The archive, laid out the same way as the project folders:
   site → zones (lettered) → graves (numbered) → five folders (cad, pdfs + revisions, photos, sketches, photographer).
   Files for a grave live in archive/<site>/zone-<letter>/grave-<n>/, under folders of the same names.
   Plans are in metres: x runs east, z runs south, origin at the north-west corner of the zone's bounding box.
   They are traced from the zone maps in zone-maps/ at an approximate scale (the maps carry no scale of their own);
   a grave's plan may have rot (degrees, anticlockwise from above) and a zone may list features (structures, enclosures). */
window.ARCHIVE = {
  project: 'Documentation and Conservation of Three Historical Graveyards of Kashmir',
  institution: 'Islamic University of Science and Technology, Awantipora',
  funder: 'The Barakat Trust, UK',
  sites: [
    {
      id: 'imambargah-hassanabad', name: 'Imambargah, Hassanabad', place: 'Rainawari, Srinagar', lat: 34.102778, lng: 74.830606,
      /* context: the site survey drawn under the zones (buildings with eave heights, trees, grass, bare earth, the canal, walls,
         paths, the precinct outline). Traced and classified in QGIS from satellite imagery, building footprints and OpenStreetMap,
         and shifted 3.5 m W / 1.5 m S into the base map's OpenStreetMap frame. Heights are estimates, not measured.
         survey: the figures from the same survey, shown in the panel; each zone's survey describes its enclosure on the ground. */
      context: 'assets/context/imambargah-hassanabad.geojson?v=5',
      survey: {
        precinct: 10842, ground: 1586.5, date: 'October 2026',
        landmarks: [
          { name: 'Jamia Masjid Hassanabad', footprint: 989, height: '9 m eaves · 13 m ridge (est.)', note: 'pitched metal roof with a central octagon' },
          { name: 'Imambargah Hassanabad', footprint: 868, height: '8 m eaves · 18 m apex (est.)', note: 'three-tier pyramidal roof' },
          { name: 'Shrine enclosure, Zone G', footprint: 39, height: 'walls about 2.2 m (est.)', note: 'whitewashed brick walls with a dark coping, open to the sky, on a paved platform' }
        ],
        setting: 'The precinct lies between Hassan Abad Road and the canal, about 80 m to the east; an open ground lies to the south-east.'
      },
      /* at: where the zone lies (its centre), from the site key plan zone-maps/imambargah-hassanabad/site-reference.png, which was
         georeferenced against satellite imagery (centre 34.102826, 74.830186; 0.17 m per pixel; north up). This places the zones;
         span: the zone's east–west extent on the ground in metres, measured on the same key plan; each zone map was drawn at its
         own scale to fit the sheet, so its plan is scaled to this. The sheet coordinates below are kept as recorded. */
      /* count: number of graves, from each zone's map. lat/lng: the coordinates written on the zone's documented sheet
         (coordsFrom names that grave). Zone G's sheet repeats Zone F's coordinates, so they are marked for checking. */
      zones: [
        {
          /* at: moved 20 m toward Zone B (19.5 m E, 4.5 m S) from the key plan's [34.10302, 74.829712]; maximum push —
             1.2 m from Zone B, touching the Imambargah entrance on the south */
          id: 'A', source: 'the zone map on the Grave 1 sheet', map: 'zone-maps/imambargah-hassanabad/zone-A.png', at: [34.10298, 74.829924], span: 22, north: 15, view: { bearing: 160 },   // the Imambargah stands south of the zone: open on it from the north-west
          count: 1, lat: 34.102989, lng: 74.829878, coordsFrom: 'Grave 1',
          survey: { area: 698, confidence: 'medium', cover: 'bare earth 76% · hard ground 11% · trees 7% · grass 6%', near: 'Jamia Masjid 7 m · Imambargah 11 m',
            setting: 'Open graveyard plot between the lane west of the Jamia Masjid and the Masjid Sajadia houses, north of the path to the Imambargah.', sheet: 'The sheet coordinate falls inside the surveyed plot.' },
          boundary: [[0.0,0.0], [10.16,0.0], [10.16,8.78], [0.0,8.78]],
          graves: [
            { n: 1, plan: { x: 4.95, z: 7.07, w: 0.37, d: 0.97 } }
          ]
        },
        {
          id: 'B', source: 'the zone map on the Grave 2 sheet', map: 'zone-maps/imambargah-hassanabad/zone-B.png', at: [34.10293, 74.830186], span: 24, north: 15,
          count: 11, lat: 34.102911, lng: 74.830243, coordsFrom: 'Grave 2',
          survey: { area: 256, confidence: 'medium', cover: 'trees 48% · bare earth 26% · hard ground 13% · building 12%', near: 'Grey-roofed building, adjoining · Imambargah 2 m',
            setting: 'Below the grey-roofed building north of the Imambargah, edged on the south-west by the curved earth path (the curve on the zone map).', sheet: 'The sheet coordinate falls inside the surveyed area.' },
          /* fits: survey buildings drawn squared against this zone's plan instead of at their surveyed angle. corner: the plan point
             of the building's south-west corner (a boundary vertex); w runs east and d north from it, in metres on the ground. */
          fits: [{ id: 'B05', corner: [1.56, 1.9], w: 12.0, d: 14.4 }],
          boundary: [[0.0,0.0], [1.56,0.0], [1.56,1.9], [9.97,1.9], [9.97,3.12], [8.7,3.12], [8.63,7.96], [6.84,8.04], [5.51,7.81], [3.87,7.11], [2.38,6.18], [1.26,5.06], [0.52,3.94], [0.07,2.83]],
          graves: [
            { n: 1, plan: { x: 8.65, z: 2.34, w: 0.26, d: 0.89 } },
            { n: 2, plan: { x: 7.5, z: 4.02, w: 0.33, d: 1.0 } },
            { n: 3, plan: { x: 7.96, z: 4.24, w: 0.45, d: 0.82 } },
            { n: 4, plan: { x: 7.72, z: 7.42, w: 0.33, d: 0.71 } },
            { n: 5, plan: { x: 6.51, z: 7.42, w: 0.89, d: 0.41 } },
            { n: 6, plan: { x: 5.62, z: 7.07, w: 0.3, d: 0.82 } },
            { n: 7, plan: { x: 5.13, z: 4.11, w: 0.37, d: 0.93 } },
            { n: 8, plan: { x: 2.64, z: 5.1, w: 0.37, d: 0.82 } },
            { n: 9, plan: { x: 2.19, z: 4.98, w: 0.37, d: 0.93 } },
            { n: 10, plan: { x: 0.5, z: 2.38, w: 0.26, d: 0.82 } },
            { n: 11, plan: { x: 0.41, z: 1.3, w: 0.3, d: 0.89 } }
          ]
        },
        {
          id: 'C', source: 'the zone map on the Grave 1 sheet', map: 'zone-maps/imambargah-hassanabad/zone-C.png', at: [34.102974, 74.830383], span: 18, north: 15,
          count: 21, lat: 34.102952, lng: 74.830341, coordsFrom: 'Grave 1',
          survey: { area: 162, confidence: 'low', cover: 'bare earth 41% · grass 41% · trees 18%', near: 'Grey-roofed building 6 m · shrine 11 m',
            setting: 'Walled enclosure south of the tree grove (Zone E) and north of the paved walkway; its walls are hard to read under the trees.', sheet: 'The sheet coordinate falls 1 m outside the surveyed enclosure.' },
          boundary: [[0.0,0.09], [8.52,0.0], [8.65,2.53], [10.34,2.47], [10.34,6.94], [0.0,7.03]],
          graves: [
            { n: 1, plan: { x: 2.16, z: 1.08, w: 0.22, d: 1.12 } },
            { n: 2, plan: { x: 2.73, z: 0.71, w: 0.3, d: 0.89 } },
            { n: 3, plan: { x: 5.23, z: 0.71, w: 0.26, d: 0.89 } },
            { n: 4, plan: { x: 0.61, z: 3.09, w: 0.41, d: 1.04 } },
            { n: 5, plan: { x: 1.23, z: 3.18, w: 0.56, d: 1.26 } },
            { n: 6, plan: { x: 0.65, z: 6.29, w: 0.22, d: 0.93 } },
            { n: 7, plan: { x: 1.41, z: 5.02, w: 0.37, d: 0.67 } },
            { n: 8, plan: { x: 1.73, z: 6.32, w: 0.48, d: 1.04 } },
            { n: 9, plan: { x: 2.72, z: 6.44, w: 0.52, d: 1.04 } },
            { n: 10, plan: { x: 2.46, z: 4.89, w: 0.37, d: 1.19 } },
            { n: 11, plan: { x: 2.44, z: 3.92, w: 0.33, d: 0.11 } },
            { n: 12, plan: { x: 4.09, z: 4.56, w: 0.26, d: 0.78 } },
            { n: 13, plan: { x: 3.48, z: 6.51, w: 0.19, d: 0.82 } },
            { n: 14, plan: { x: 3.91, z: 6.44, w: 0.22, d: 0.93 } },
            { n: 15, plan: { x: 4.98, z: 6.44, w: 0.3, d: 0.89 } },
            { n: 16, plan: { x: 6.81, z: 6.47, w: 0.19, d: 0.97 } },
            { n: 17, plan: { x: 6.58, z: 5.1, w: 0.22, d: 0.52 } },
            { n: 18, plan: { x: 7.27, z: 4.95, w: 0.3, d: 0.71 } },
            { n: 19, plan: { x: 8.76, z: 5.49, w: 0.37, d: 1.23 } },
            { n: 20, plan: { x: 8.7, z: 4.09, w: 0.22, d: 0.52 } },
            { n: 21, plan: { x: 9.73, z: 5.45, w: 0.3, d: 1.23 } }
          ]
        },
        {
          id: 'D', source: 'the zone map on the Grave 1 sheet', map: 'zone-maps/imambargah-hassanabad/zone-D.png', at: [34.103046, 74.830503], span: 7, north: 15,
          count: 1, lat: 34.102970, lng: 74.830365, coordsFrom: 'Grave 1',
          survey: { area: 49, confidence: 'low', cover: 'trees 79% · bare earth 19%', near: 'Shrine 18 m',
            setting: 'Small enclosure between Zones C and F, under tree cover.', sheet: 'The sheet coordinate falls about 16 m south-west, near Zone C.' },
          boundary: [[0.0,0.0], [7.37,0.0], [7.37,8.48], [0.0,8.48]],
          graves: [
            { n: 1, plan: { x: 2.23, z: 4.45, w: 0.97, d: 3.39 } }
          ]
        },
        {
          id: 'E', source: 'the zone map on the Grave 2 sheet', map: 'zone-maps/imambargah-hassanabad/zone-E.png', at: [34.10326, 74.830474], span: 26, north: 15,
          count: 15, lat: 34.103101, lng: 74.830395, coordsFrom: 'Grave 2',
          survey: { area: 947, confidence: 'medium', cover: 'trees 69% · hard ground 29%', near: 'Jamia Masjid, adjoining',
            setting: 'Tree grove (chinar) along the east wall of the Jamia Masjid, bounded on the north-east by the curving lane.', sheet: 'The sheet coordinate falls about 8 m south of the grove.' },
          boundary: [[1.97,0.0], [12.07,0.0], [12.07,5.0], [3.52,5.51], [3.52,7.4], [0.0,7.4], [0.0,4.46], [1.97,4.46]], features: [{ label: 'Tree enclosure', x: 6.88, z: 2.79, w: 3.2, d: 3.2 }],          graves: [
            { n: 1, plan: { x: 1.79, z: 5.95, w: 0.33, d: 0.67 } },
            { n: 2, plan: { x: 3.14, z: 4.39, w: 0.3, d: 0.63 } },
            { n: 3, plan: { x: 4.46, z: 4.43, w: 0.3, d: 0.56 } },
            { n: 4, plan: { x: 4.09, z: 2.81, w: 0.37, d: 0.93 } },
            { n: 5, plan: { x: 3.16, z: 2.9, w: 0.37, d: 0.82 } },
            { n: 6, plan: { x: 5.52, z: 3.39, w: 0.26, d: 0.48 } },
            { n: 7, plan: { x: 5.71, z: 2.25, w: 0.6, d: 1.23 } },
            { n: 8, plan: { x: 5.91, z: 4.33, w: 1.15, d: 0.22 } },
            { n: 9, plan: { x: 6.58, z: 3.59, w: 0.52, d: 1.15 } },
            { n: 10, plan: { x: 7.85, z: 3.52, w: 0.74, d: 1.19 } },
            { n: 11, plan: { x: 7.85, z: 2.16, w: 0.52, d: 1.26 } },
            { n: 12, plan: { x: 8.82, z: 2.01, w: 0.26, d: 0.52 } },
            { n: 13, plan: { x: 9.9, z: 1.75, w: 0.33, d: 0.78 } },
            { n: 14, plan: { x: 9.32, z: 0.63, w: 1.23, d: 0.19, rot: 24 } },
            { n: 15, plan: { x: 10.49, z: 0.41, w: 0.41, d: 0.11 } }
          ]
        },
        {
          id: 'F', source: 'the zone map on the Grave 2 (Sheet 56) sheet', map: 'zone-maps/imambargah-hassanabad/zone-F.png', at: [34.103109, 74.830625], span: 11, north: 15,
          count: 3, lat: 34.102778, lng: 74.830606, coordsFrom: 'Grave 2 (Sheet 56)',
          survey: { area: 90, confidence: 'low', cover: 'trees 67% · hard ground 18% · bare earth 14%', near: 'Shrine 26 m · Jamia Masjid 29 m',
            setting: 'Square enclosure at the north-east of the precinct, beside the curving lane.', sheet: 'The sheet coordinate falls about 36 m south, inside Zone G, so it is Zone G\'s; Zone F\'s own coordinate is still to be recorded.' },
          boundary: [[0.0,0.0], [4.95,0.0], [4.95,5.39], [0.0,5.39]],
          graves: [
            { n: 1, plan: { x: 0.86, z: 0.45, w: 0.52, d: 0.52 } },
            { n: 2, plan: { x: 3.18, z: 0.48, w: 0.33, d: 0.6 } },
            { n: 3, plan: { x: 3.78, z: 0.48, w: 0.19, d: 0.52 } }
          ]
        },
        {
          id: 'G', source: 'the zone map on Sheet 61', map: 'zone-maps/imambargah-hassanabad/zone-G.png', at: [34.1028, 74.830623], span: 24, count: 7,
          lat: 34.102778, lng: 74.830606, coordsFrom: 'Grave 2 (Sheet 61)', coordsCheck: 'Same as Zone F on Sheet 56',
          survey: { area: 976, confidence: 'medium', cover: 'grass 40% · trees 36% · bare earth 20%', near: 'Square shrine, adjoining',
            setting: 'Enclosure east of the square shrine, walled on the south (the kinked wall on the zone map) and east; the paved walkway runs along its north side.', sheet: 'The sheet coordinate falls inside this zone, so it is right for G.' },
          north: 15,   // degrees clockwise from the top of the plan; every Hassanabad zone shares this site north
          boundary: [[3.8, 0], [11.12, 0], [11.38, 8.12], [0, 8.32], [0.1, 5.05], [2.81, 4.98], [2.87, 5.64],
                     [3.73, 5.64], [3.73, 3.66], [3.3, 3.66], [3.3, 3], [3.8, 3]],
          graves: [
            { n: 1, plan: { x: 4.19, z: 4.39, w: 0.46, d: 1.19 } },
            {
              n: 2, plan: { x: 4.16, z: 5.51, w: 0.49, d: 0.11 }, kind: 'headstone', height: 0.73,
              sheet: '61', scale: '1:10', lat: 34.102778, lng: 74.830606,
              scan: { src: 'scan/scan.json', parts: ['scan/scan.bin', 'scan/scan-texture.jpg'], groundNormal: [0.1142, 0.9896, -0.0875] },   // levels the 8° tilt in the scan's ground
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
    /* Madeen Sahab: one zone; 37 graves numbered on its zone map */
    { id: 'madeen-sahab', name: 'Madeen Sahab', place: 'Srinagar', lat: 34.116972, lng: 74.810094, approx: 'Madin Sahib mosque (Wikipedia); to confirm against the survey', zones: [{
        id: 'A', count: 37, source: 'the Madeen Sahab zone map', map: 'zone-maps/madeen-sahab/zone-map.png',
        boundary: [[0.0,0.0], [34.78,0.0], [34.78,14.82], [24.16,14.59], [20.64,13.86], [14.88,13.28], [11.68,13.22], [4.64,12.74], [0.0,12.74]], features: [{ label: 'Building', x: 3.01, z: 7.5, w: 3.78, d: 4.26 }],
        graves: [
          { n: 1, plan: { x: 4.74, z: 11.78, w: 0.32, d: 0.7 } },
          { n: 2, plan: { x: 5.98, z: 11.68, w: 0.7, d: 0.83 } },
          { n: 3, plan: { x: 5.98, z: 12.51, w: 0.32, d: 0.45 } },
          { n: 4, plan: { x: 7.14, z: 11.49, w: 0.7, d: 1.22 } },
          { n: 5, plan: { x: 6.94, z: 9.28, w: 0.38, d: 0.9 } },
          { n: 6, plan: { x: 6.94, z: 8.1, w: 0.38, d: 1.28 } },
          { n: 7, plan: { x: 9.44, z: 8.74, w: 0.45, d: 0.77 } },
          { n: 8, plan: { x: 10.21, z: 8.99, w: 0.45, d: 0.96 } },
          { n: 9, plan: { x: 6.37, z: 5.44, w: 0.26, d: 0.26 } },
          { n: 10, plan: { x: 6.82, z: 5.63, w: 0.26, d: 0.26 } },
          { n: 11, plan: { x: 6.05, z: 4.77, w: 0.38, d: 0.7 } },
          { n: 12, plan: { x: 5.12, z: 2.72, w: 0.45, d: 0.38 } },
          { n: 13, plan: { x: 7.26, z: 2.5, w: 0.38, d: 1.02 } },
          { n: 14, plan: { x: 7.46, z: 4.26, w: 0.38, d: 0.58 } },
          { n: 15, plan: { x: 9.44, z: 4.32, w: 2.4, d: 2.08 } },
          { n: 16, plan: { x: 12.06, z: 4.77, w: 0.7, d: 1.34 } },
          { n: 17, plan: { x: 13.98, z: 4.58, w: 2.11, d: 2.08 } },
          { n: 18, plan: { x: 11.33, z: 6.37, w: 1.15, d: 1.28 } },
          { n: 19, plan: { x: 12.13, z: 7.84, w: 0.83, d: 1.02 } },
          { n: 20, plan: { x: 14.88, z: 8.42, w: 0.58, d: 1.98 } },
          { n: 21, plan: { x: 16.35, z: 6.24, w: 0.58, d: 1.66 } },
          { n: 22, plan: { x: 19.94, z: 4.1, w: 0.64, d: 1.92 } },
          { n: 23, plan: { x: 19.9, z: 5.47, w: 0.38, d: 0.9 } },
          { n: 24, plan: { x: 18.98, z: 7.07, w: 0.7, d: 1.6 } },
          { n: 25, plan: { x: 19.81, z: 6.98, w: 0.9, d: 1.6 } },
          { n: 26, plan: { x: 21.12, z: 6.98, w: 1.09, d: 2.24 } },
          { n: 27, plan: { x: 17.38, z: 11.04, w: 0.96, d: 2.05 } },
          { n: 28, plan: { x: 18.91, z: 11.07, w: 0.96, d: 2.05 } },
          { n: 29, plan: { x: 19.97, z: 11.04, w: 0.7, d: 2.05 } },
          { n: 30, plan: { x: 21.18, z: 10.82, w: 0.64, d: 1.28 } },
          { n: 31, plan: { x: 22.66, z: 13.12, w: 0.64, d: 1.28 } },
          { n: 32, plan: { x: 23.2, z: 9.06, w: 1.6, d: 1.6 } },
          { n: 33, plan: { x: 28.26, z: 9.57, w: 3.84, d: 2.75 } },
          { n: 34, plan: { x: 28.45, z: 12.99, w: 2.05, d: 2.56 } },
          { n: 35, plan: { x: 31.46, z: 8.1, w: 0.7, d: 1.09 } },
          { n: 36, plan: { x: 31.39, z: 9.12, w: 0.38, d: 0.51 } },
          { n: 37, plan: { x: 33.34, z: 10.02, w: 0.64, d: 1.66 } }
        ]
      }] },
    { id: 'anderkote-sumbal', name: 'Anderkote, Sumbal', place: 'Ganderbal', lat: 34.230705, lng: 74.647308, approx: 'Sumbal town; to replace with the graveyard\'s surveyed coordinates', zones: [{ id: 'A', graves: [] }, { id: 'B', graves: [] }, { id: 'C', graves: [] }] }
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
  // a scan's files (the glTF, its binary buffer and texture), so pages can fetch them ahead of time
  scanFiles: (site, zone, g) => !(g && g.scan) ? [] : [g.scan.src].concat(g.scan.parts || []).map(f => ({ url: Archive.dir(site, zone, g) + f })),
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
