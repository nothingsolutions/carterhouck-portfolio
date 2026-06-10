# Carter Houck Portfolio

A minimal static portfolio: white background, sans-serif nav, and a 3-column masonry image grid on the homepage.

## Run it

No build step. For best results (so `data/categories.json` loads), serve the folder:

```bash
npx serve .
```

You can also double-click `index.html` — an inline fallback in `js/data.js` keeps it working from the filesystem.

## Current pages

- `index.html` — homepage with image grid
- `bio.html` — bio page

All other nav items (Client Work, Graphics, Videos, clients) are listed in the sidebar but not yet linked to individual pages.

## Edit the nav

Edit `data/categories.json`:

- `home` — site title link (Carter Houck ? homepage)
- `categories` — main sections (Client Work, Graphics, Videos)
- `bio` — bio page link
- `clients.featured` — always-visible client list
- `clients.more` — clients hidden under "+ Show More"
- `gallery.images` — homepage image grid

If you open the site without a server, mirror changes in `SITE_DATA_FALLBACK` in `js/data.js`.

## Enable a section page (later)

When you're ready to build out a category or client:

1. Add `"ready": true` to that item in JSON
2. Add an `"images": [...]` array with your work
3. Create `{slug}.html` from `index.html` (change `data-category` to the slug)
4. The nav will automatically render it as a live link

## Files

- `index.html`, `bio.html` — pages
- `css/style.css` — all styling
- `js/data.js` — data loader + inline fallback
- `js/nav.js` — sidebar + mobile nav
- `js/gallery.js` — homepage image grid
- `data/categories.json` — nav structure + homepage images
- `images/` — your image files (when ready)
