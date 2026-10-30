# An Ode to the Dead

An interactive 3D record of three historic graveyards, built as part of *Documentation and Conservation of Three Historical Graveyards of Kashmir* (Islamic University of Science and Technology, Awantipora; funded by The Barakat Trust, UK).

## How it is organised
The site follows the project's folder structure: **site → zone → grave**.

1. `index.html`: the three sites (Imambargah, Hassanabad · Madeen Sahab · Anderkote, Sumbal).
2. `site.html?site=…&zone=…`: zone tabs. Each zone shows a 3D map built from its zone plan, with its graves numbered in plan order and a list beside the map.
3. `grave.html?site=…&zone=…&grave=…`: one grave. It shows the 3D scan if there is one, or a default model sized from the zone plan. It has the measured sheet, photographs placed where they were taken, a guided tour, and a **Files** drawer with the grave's five folders: CAD drawing, PDFs (final + revisions), photos, sketches, photographer's photos.
4. `context.html`: about the archive. The project and its funder, the Barakat Trust; the method; an inventory of every site and zone; a typology of grave outlines read from the zone plans; the measured sheet's conventions with Sheet 61 as the worked example; and field notes on what is still to confirm. Each site page links to its own typology.

**Test record:** Grave 2, Zone G, Imambargah, Hassanabad. Measured drawing: Sheet 61 (1:10). Each zone's 3D map is traced from its zone map in `zone-maps/`. The maps carry no scale, so sizes are approximate.

## Adding to the archive
All content is listed in `assets/archive.js`. To add a grave, put its files under
`archive/<site>/zone-<letter>/grave-<n>/{cad,pdfs,pdfs/revisions,photos,sketches,photographer,scan}/`
and add the grave's entry (plan position, files) to its zone in `archive.js`.

Zones fill in over time:
1. **No plan yet:** the zone shows a default template plan (a plain rectangle).
2. **Number of graves known:** add `count: N` to the zone. Numbered graves are set out in rows on the template, and each gets a grave page with the default model.
3. **Site plan traced:** add the zone's `boundary` and each grave's `plan` position, in metres. The template is replaced by the real layout.

## Files
- `assets/archive.js`: the data (sites, zones, graves, files, photo poses, tours)
- `assets/context.js`: the about page's data (funder, method, outline types, Sheet 61 conventions, field notes), from the project's own records; counts are worked out from `archive.js`
- `assets/models.js`: the default 3D grave
- `assets/detail.js`: the setting around a site on its zones page: canal, open ground, compound walls, trees, and landmark buildings (Imambargah with its stepped roof, Jamia Masjid), traced from the site key plan and read against aerial views. Heights are estimates
- `assets/detail-houses.js`: indicative house massing round Hassanabad, generated (not surveyed) in the blocks between OpenStreetMap roads, clear of the canal, graveyard and open ground
- `assets/weather.js`: live weather over the front page's map, Srinagar's current conditions from [Open-Meteo](https://open-meteo.com/) (no key; nothing about the visitor is sent), refreshed every 15 minutes. Preview a condition with `?weather=clear|cloudy|fog|drizzle|rain|snow|storm` and `&night=1`
- `assets/site.css`: shared styles
- `assets/nav.js`: the top bar (segmented trail, slide back)

When you change a file in `assets/`, raise the `?v=` number on its `<script>`/`<link>` tags in the pages, so browsers don't mix a cached old file with a new page.
- `archive/…`: the record files (scan as glTF from KIRI Engine, sheet, photographs)

## Confidential: all rights reserved

This repository is private and shared only with invited people. Access does not grant permission to copy, download for reuse, publish or share any of its contents, including the code, scan, drawing and photographs. See [LICENSE](LICENSE).

Author: Saqlain Siddiqi · © 2026 Saqlain Siddiqi. All rights reserved.
