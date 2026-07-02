# Light Overcomes

Light Overcomes is a public ministry website for Christian resources, witness card videos, book previews, and store links.

The site is built with React, Vite, and React Router. It is intentionally simple: content lives mostly in data files, pages are static/public, and external services are linked rather than embedded unless a feature calls for it.

## Local Development

```bash
npm install
npm run dev
```

For phone testing on the same Wi-Fi network:

```bash
npm run dev -- --host 0.0.0.0
```

Vite will print a `Network` URL that can be opened from a phone on the same LAN.

## Quality Checks

```bash
npm run lint
npm run build
```

Run both before handing off meaningful changes.

## Main Routes

- `/` - home page
- `/resources` - resources hub
- `/witness-cards` - witness card video visitor page
- `/witness-card-library` - witness card image gallery
- `/christian-values` - Christian values gallery
- `/attributes-of-god` - Daily Encounters book preview
- `/exchange` - EXCHANGE book preview
- `/store` - external store entry point
- `/about` - mission/about page
- `/terms` - Terms of Service
- `/privacy` - Privacy Policy

Several legacy or QR-friendly paths redirect to these routes in `src/App.jsx`.

## Key Files

- `src/App.jsx` - route table
- `src/components/layout/Navbar.jsx` - header navigation
- `src/components/layout/Footer.jsx` - footer legal links
- `src/data/siteContent.js` - main copy, navigation, store, book preview, and about content
- `src/data/witnessCards.js` - witness card images, video paths, and video CTA data
- `src/styles/globals.css` - global visual system and responsive styles

## Assets

Public assets live under `public/`.

- `public/brand/` - logo, nav logo, favicon
- `public/images/books/` - book preview covers
- `public/images/witness-cards/` - card thumbnails and full images
- `public/videos/witness-cards/` - witness card MP4 videos

Witness videos should be exported with MP4 faststart metadata so Safari and Chrome can seek/scrub reliably before the full file loads.

## Feature Notes

- Giving is expected to use Subsplash later.
- Newsletter or email capture should stay hidden until the backend/privacy flow is ready.
- Future giving/newsletter work should be feature-gated and not linked in the public nav until approved.
- Keep the design ministry-focused: calm, readable, image-led, and grounded.
