# Zo Hotel — Journal

A single-article page for the Zo Hotel monsoon story, *The Smell of Wet Earth*.

Plain HTML, CSS and JavaScript. No build step, no framework, no dependencies
beyond two webfonts and the photographs.

```
index.html      the article
css/style.css   layout, type scale, monochrome tokens
js/main.js      masthead state, reading progress, contents rail
```

## Running it

Open `index.html` directly, or serve the folder:

```
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Notes

- **Theme.** Monochrome: white paper, black ink, a grey scale in between.
  Every value is a custom property on `:root`, so the whole page re-skins from
  one block at the top of `style.css`. The photographs are the only colour.

- **Cover.** A full-viewport plate with the title over it and a dateline rule
  along the foot. The masthead sits on top of it, transparent, and turns solid
  once the cover has scrolled past.

- **Layout.** The article is one CSS grid with three named tracks — `text`,
  `wide` and `full`. Each `<section>` is a `subgrid`, so a figure nested inside
  one can still break out of the measure by changing grid column. The text
  track is sized before the side tracks, so it never collapses on narrow
  screens.

- **Blocks.** Beyond the essay itself the page carries a seasonal figures
  strip under the standfirst, a three-up *Notes for the season* aside, a dark
  contact-sheet band of six small frames between the article and the booking
  panel, and a three-card row of related entries. They exist to give a short
  article enough substance to fill a wide screen.

- **Figures** are numbered with a CSS counter (`Fig. 01`, `Fig. 02`, …) and sit
  in a clipping `.frame`, so the photograph can scale slightly on hover without
  nudging the layout.

- **Images.** Hotlinked from the Unsplash CDN with `srcset`/`sizes`, explicit
  `width`/`height` (no layout shift), and `loading="lazy"` on everything below
  the cover. Swap the URLs for the hotel's own photography when it is ready —
  keep the ratios (3:2 cover, 16:9 and 5:2 wide, 1:1 pair, 3:2 cards, 1:1
  contact sheet) and nothing else has to move.

- **Motion.** The scroll reveal is a CSS scroll-driven animation behind
  `@supports (animation-timeline: view())`, so content is visible by default
  and can never get stranded at `opacity: 0`. It and smooth scrolling are off
  under `prefers-reduced-motion`.

- **JavaScript is optional.** Every behaviour in `main.js` is an enhancement
  with a safe resting state: the masthead defaults to solid, the contents rail
  defaults to hidden, the progress bar defaults to empty. The scroll handler
  measures geometry once (and again on resize, or when the page height
  changes) so that scrolling only reads `window.scrollY` and never forces a
  layout — and it deliberately avoids `requestAnimationFrame`, which can stay
  throttled in a background tab and leave a naive handler latched dead.

- **Photography credits** are in the footer and on each caption.

## Placeholder content

Replace before this stands in for the real hotel:

- The three cards under **More from the Journal** are sample entries. Their
  headlines and dates are invented and their links point back into this page.
- The seasonal figures under the standfirst (rainfall, temperature, beach
  flags, crowds) are rounded, indicative values for the Goan monsoon, not
  measurements. Check them against a current source before publishing.
- The three items under **Notes for the season** describe this fictional
  house — the umbrella rack, the kitchen staying open.
- The phone number, email and address in the footer.
- The room count and what's included in the **Monsoon at Zo Hotel** panel.

## Replacing the photographs

Each `<img>` has one `src` and one `srcset`. Point all of them at the new file
and drop the Unsplash query string:

```html
<img src="assets/veranda.jpg" width="1600" height="800" loading="lazy" alt="…">
```

## Deployment

Served as a static site from GitHub Pages off the `main` branch. Any push to
`main` republishes it; there is nothing to build.
