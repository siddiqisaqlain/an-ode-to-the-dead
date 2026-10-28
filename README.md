# An Ode to the Dead

An interactive 3D record of three historic graveyards, built as part of *Documentation and Conservation of Three Historical Graveyards of Kashmir* (Islamic University of Science and Technology, Awantipora; funded by The Barakat Trust, UK).

## How it is organised
The site follows the project's folder structure: **site → zone → grave**.

1. `index.html`: the three sites (Imambargah, Hassanabad · Madeen Sahab · Anderkote, Sumbal).
2. `site.html?site=…&zone=…`: zone tabs. Each zone shows a 3D map built from its zone plan, with its graves numbered in plan order and a list beside the map.
3. `grave.html?site=…&zone=…&grave=…`: one grave. It shows the 3D scan if there is one, or a default model sized from the zone plan. It has the measured sheet, photographs placed where they were taken, a guided tour, and a **Files** drawer with the grave's five folders: CAD drawing, PDFs (final + revisions), photos, sketches, photographer's photos.

**Test record:** Grave 2, Zone G, Imambargah, Hassanabad. Measured drawing: Sheet 61 (1:10). Zone G's map is traced from the zone map on that sheet, so its scale is approximate.

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
- `assets/models.js`: the default 3D grave
- `assets/site.css`: shared styles
- `archive/…`: the record files (scan as glTF from KIRI Engine, sheet, photographs)

## Confidential: all rights reserved

This repository is private and shared only with invited people. Access does not grant permission to copy, download for reuse, publish or share any of its contents, including the code, scan, drawing and photographs. See [LICENSE](LICENSE).

Author: Saqlain Siddiqi · © 2026 Saqlain Siddiqi. All rights reserved.
