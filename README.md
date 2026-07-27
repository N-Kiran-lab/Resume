# Portfolio Resume

A single-page portfolio site for N Kiran — Data Analyst. Built as plain
HTML/CSS/JS (no build step) so it deploys directly via GitHub Pages.

It combines the editorial big-type look (outlined headline text, marquee
ticker, grid background) with a warmer, playful accent system (glowing
blobs, pill badges, timeline) into one original design, styled with a
coral/violet/amber palette on a near-black background.

## Structure

- `index.html` — page markup and content
- `assets/style.css` — design tokens, layout, animations
- `assets/script.js` — nav toggle, scroll progress, reveal-on-scroll, animated stat counters
- `Portfolio_Resume.pdf` — downloadable resume (linked from the hero "Resume" button)

## Local preview

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploying to GitHub Pages

Enable Pages for this repo (Settings → Pages → Deploy from branch → this
branch, `/` root). No build step is required.
