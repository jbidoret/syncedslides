# Slidesystem — Rencontres de Lure 2022

A raw HTML slideshow system with synced text and slides on one screen and slides on another.

Aka, reinvent the wheel or be bored.

This script has been procuced for the 70’s Rencontres internationales de Lure. It can be viewed online at [radicalweb.design/lure](https://radicalweb.design/lure) but might better be read in an updated textual version here: [radicalweb.design/fr/notes/rencontres-de-lure](https://radicalweb.design/fr/notes/rencontres-de-lure).


## Start

Opening index.html through localhost server automatically opens two pages:

- the frameset: `index.html` wich contains both `slides.html` and `text.html`;
- the popup: `slides.html` (double-click to make it fullscreen).

Navigation events are broadcasted to both `slides.html` and `text.html` via `frames.js`, throught the old school postMessage.

Navigation logic lies in `js/pechakucha.js`.


## Text

Text has been written in plain markdown via Zettler and exported to HTML through Pandoc (basic Zettlr export).

Pilcrows (¶) are put in the text to “markup” slides changes. 

In `js/text.js`, pilcrows are wrapped in html elements, so that their scroll can be synced with slides.

A timer bar is injected within the text frame (its duration can be customised in `css/text.css`).

A navbar with two buttons (prev and next) is injected in the text frame, to allow mouse nav, but keyboard shortcuts allow toi navigate through the slides:
- enter key: starts the timer
- prev arrow: prev slide
- next arrow: next slide
- esc key: look to all slides (click to change current slide)

## Content (slides)

Every slide is an article, typically: 
```html
<article>
  <header>
    <em class="source">Author — <a href="#">Source</a></em>
  </header>
  <!-- content -->
</article>
```

### Running title

A running title is injected in each `<header>`. Its value is set in a `<script>` in `slides.html`.

### Contents types

Content can be an image, a video, a text or an iframe:

- Images are wrapped in `<div class="media">`.
- Videos are wrapped in `<div class="video">` (autpolayed when containing slide is reached).
- Iframes are wrapped in `<div class="embed">` (autoloaded when containing slide is reached).
- Texts can be `<p>`, `<h2>` or `<blockquote>`.

Iframes can be full absolute URLs or local copies ([Single file](https://github.com/gildas-lormeau/SingleFile) extension is really good at this job).

### CSS helpers :

- `.bigtext`, obviously, makes text big; `.smalltext`, small; and `.hugetext`, huge!
- `.contain` makes media be contained; with `.cover`, media covers the space.
- `.white` sets the slide background to white.
- If a `--bg:#ACCABB` cutom property is passed through a style attribute, its value is set as the slide background-color.
- `.scroll` makes media scrollable

## Credits

Based on [Pecha Kucha](https://github.com/esadpyrenees/pechakucha) template.

Typeset in [Source serif](https://adobe-fonts.github.io/source-serif/) by Frank Grießhammer and friends.

The javascript code and logic is freely available throungh the wonderful terms of UNLICENSE.

The content of `text.html` is available throught [CC BY-SA](https://creativecommons.org/licenses/by-sa/2.0/), but might better be read online at [radicalweb.design](https://radicalweb.design/fr/notes/rencontres-de-lure).

