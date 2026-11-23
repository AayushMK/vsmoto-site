# Project notes for Claude Code

Portfolio site for VS Moto: Vivek Shahi (Aayush's brother), who designs, prints and fits
custom graphics kits, number plates and livery on bikes. Instagram: @vs.moto_2046 (brand),
@vivek.shahi_ (personal). Plain static HTML/CSS/JS, no build step, deployed to GitHub Pages
by .github/workflows/deploy.yml.

## Structure
- index.html: all copy and sections.
- styles.css: tokens at the top.
- app.js: POSTS list (Instagram links shown in the Work section), and the kit builder
  (flat-lay SVG of a dirt bike kit, pieces in PIECES, right side mirrored from left).

## Design rules
- Asphalt-purple ground, hot magenta + electric violet (from his avatar), plate yellow for numbers only.
- Big Shoulders Display for display type, Archivo (width axis) for everything else.
- Signature: the headline peels off like a decal on load; the kit builder is the centrepiece.
- Respect reduced motion. Copy is short and plain, no invented facts (no fake reviews, prices, or history).
