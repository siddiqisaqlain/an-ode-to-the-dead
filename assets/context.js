/* The context page's data, all from this project's own records: the funder, the measured sheet's conventions
   (Sheet 61), a typology of grave outlines read from the traced zone plans, and field notes on what is still to be confirmed.
   Counts are worked out from assets/archive.js, so they stay current as zones and graves are added. Needs archive.js first. */
window.CONTEXT = {
  funder: {
    name: 'The Barakat Trust',
    country: 'UK',
    url: 'https://www.barakat.org/',
    role: 'The Barakat Trust funds the documentation and conservation of the three graveyards recorded here. Every measured sheet carries its credit.',
    logo: 'assets/barakat-logo.svg'   // the Trust's own mark, from barakat.org
  },

  /* where the About page's feedback form sends messages. Set one: formspree is a form ID from formspree.io (the xxxx in
     formspree.io/f/xxxx), and the message is posted there; email opens the visitor's mail app instead. With neither, the
     form shows but cannot be sent yet */
  feedback: {
    formspree: '',
    email: '',
    kinds: ['Comment', 'Correction', 'Information about a grave', 'Question'],
    asks: [
      ['Corrections', 'A name, a date, a coordinate or a zone that the records have wrong.'],
      ['Family knowledge', 'Who is buried where, and what you know of them, if you are willing to share it.'],
      ['Photographs', 'Older photographs of the graveyards or of particular stones, before they changed.'],
      ['Condition', 'A stone that has moved, cracked or been repaired since it was recorded.']
    ]
  },

  /* the people. Fill in name (and photo, a path to a square image, if wanted); an empty name shows as "to be added" */
  team: {
    pi: { role: 'Principal Investigator', name: '', affiliation: 'Islamic University of Science and Technology, Awantipora', photo: '' },
    associate: { role: 'Associate', name: '', affiliation: 'Islamic University of Science and Technology, Awantipora', photo: '' },
    members: [
      // { name: '', role: 'Survey and measured drawing', photo: '' },
    ]
  },


  /* grave typology by outline, from the zone plans. Shape is the grave's width as a share of its length; it does not depend
     on the plans' scale, which is approximate. kind is the schematic drawn on the page */
  types: [
    { id: 'narrow', name: 'Narrow', test: a => a < .3, kind: 'narrow',
      text: 'Width under a third of the length. Narrow graves, and standing stones drawn in plan. The documented headstone, Grave 2 in Zone G, is one of these.' },
    { id: 'oblong', name: 'Oblong', test: a => a >= .3 && a < .75, kind: 'oblong',
      text: 'Width a third to three-quarters of the length. The usual grave outline at both surveyed sites.' },
    { id: 'square', name: 'Square', test: a => a >= .75, kind: 'square',
      text: 'Near-square outlines. Square plots, platforms or small markers, to be told apart on site. Most common at Madeen Sahab.' }
  ],

  /* the measured sheet's conventions, as set out on Sheet 61 */
  sheet: {
    id: '61', site: 'imambargah-hassanabad', zone: 'G', grave: 2, scale: '1:10', details: '1:3',
    materials: ['Stone', 'PCC (plain cement concrete)', 'Brick', 'Engraving', 'Embossing', 'Chiselling', 'Soil', 'Below ground level, inferred', 'Below ground level, in section', 'Inferred profile'],
    condition: [['Major crack', 'crack', ['south', 'west']], ['Minor crack', 'crack2', []], ['Spalling', 'spall', []], ['Missing', 'missing', ['south', 'east', 'top']],
                ['Inscription', 'ins', ['south']], ['Illegible inscription', 'ins2', []]],
    /* where each part sits on the sheet, as [left, top, width, height] in % of the sheet image */
    regions: {
      details: [2.4, 3.5, 71.4, 18], south: [7, 22.3, 19.3, 38.2], east: [27.8, 22.3, 9.5, 38.2], west: [42.5, 22.3, 9.5, 38.2],
      section: [55.8, 22.3, 11.8, 38.2], top: [5.3, 76, 17.5, 19], tilt: [30.8, 61.9, 12.8, 33.3], ref: [52.5, 63.3, 14.3, 31.8],
      zone: [73.9, 43.1, 23.6, 22.3], legend: [73.9, 3.4, 23.6, 23.5], cond: [73.9, 28.6, 23.6, 14.5], title: [73.9, 65.4, 23.6, 31.1]
    },
    /* the drawing set, each with the part of the sheet it occupies */
    views: [['South elevation', 'south'], ['East elevation', 'east'], ['West elevation', 'west'], ['Section AA\'', 'section'], ['Top view', 'top'],
            ['Existing on-site tilt', 'tilt'], ['Details W–Z, 1:3', 'details'], ['Reference image', 'ref'], ['Zone map', 'zone'], ['Title block', 'title']],
    facts: [['Form', 'Headstone, pointed arch'], ['Width', '490 mm'], ['Height', '728 mm'], ['Thickness', '105 mm'],
            ['Stands at', '75° to the ground'], ['Coordinates', '34.102778, 74.830606']],
    findings: [
      'A major crack runs diagonally across the lower part of the south face.',
      'One section of the epitaph has come apart from the main stone and sits displaced diagonally.',
      'Pieces are missing at the apex and along the edges.',
      'The inscription is carved in framed panels across the south face.'
    ]
  },

  /* field notes: what the records show is still open */
  notes: [
    { k: 'Imambargah, Hassanabad · Zone G', site: 'imambargah-hassanabad', zone: 'G', text: 'Sheet 61 gives the same coordinate as Zone F on Sheet 56. The site key plan puts G south of F, so one of the two needs correcting. The map places G from the key plan.' },
    { k: 'All zone maps', text: 'The zone maps carry no scale of their own. Each sheet\'s scale is the scale of its grave drawings, so grave sizes on the 3D plans are approximate.' },
    { k: 'Imambargah, Hassanabad · Zone E', site: 'imambargah-hassanabad', zone: 'E', text: 'A tree enclosure stands among the graves in the middle of the zone.' },
    { k: 'Imambargah, Hassanabad · Zone D', site: 'imambargah-hassanabad', zone: 'D', text: 'One grave, the largest outline at the site, alone in its zone.' },
    { k: 'Madeen Sahab · Zone A', site: 'madeen-sahab', zone: 'A', text: 'A building stands at the west end of the zone. The site\'s coordinate is still approximate and needs confirming against the survey.' },
    { k: 'Anderkote, Sumbal', site: 'anderkote-sumbal', text: 'Three zones are set up; their zone maps, grave counts and surveyed coordinate are still to come.' }
  ]
};

/* a grave's outline type, or null for a grave with no traced plan */
CONTEXT.typeOf = g => {
  if (g.templated || !g.plan) return null;
  const a = Math.min(g.plan.w, g.plan.d) / Math.max(g.plan.w, g.plan.d);
  return CONTEXT.types.find(x => x.test(a)) || null;
};
/* a site's traced graves sorted into the outline types; templated graves (no plan yet) are left out */
CONTEXT.typesFor = site => {
  const out = Object.fromEntries(CONTEXT.types.map(t => [t.id, 0]));
  site.zones.forEach(z => z.graves.forEach(g => { const t = CONTEXT.typeOf(g); if (t) out[t.id]++; }));
  return out;
};
