# Light Overcomes Project Context

Last updated: 2026-07-02

Use this file as the clean handoff context for future Light Overcomes work. Do not mix this project with LockIn Stack. Light Overcomes is a ministry / Gospel resource website, not a SaaS dashboard.

## Product Purpose

Light Overcomes is a simple public website for Christian resources, witness cards, short witness videos, book previews, and eventually a store.

The site should help a visitor quickly understand:

- who Light Overcomes is
- what resources are available
- how to watch witness-card videos
- how to read book previews
- how to get witness cards for themselves

The site should feel calm, faithful, clear, and welcoming. It should not feel like a tech startup, AI app, or generic church template.

## Tech Context

- React with Vite.
- Main route composition lives in `src/App.jsx`.
- Main layout: `src/components/layout/MainLayout.jsx`.
- Navbar: `src/components/layout/Navbar.jsx`.
- Global styles: `src/styles/globals.css`.
- Core copy and nav data: `src/data/siteContent.js`.
- Witness card/video data: `src/data/witnessCards.js`.

Important public assets:

- Logo:
  - `public/brand/light-overcomes-logo.png`
  - `public/brand/light-overcomes-logo-nav.png`
  - `public/brand/light-overcomes-favicon.png`
- Book covers:
  - `public/images/books/daily-encounters-attributes.png`
  - `public/images/books/exchange-lies-of-the-enemy.png`
- Witness card images:
  - `public/images/witness-cards/full/*`
  - `public/images/witness-cards/thumbs/*`
- Witness videos:
  - `public/videos/witness-cards/*`

## Current Pages

- `/` home / landing page.
- `/about` about page.
- `/resources` resources hub.
- `/christian-values` Christian values gallery.
- `/witness-cards`, `/witness`, `/visitor-center`, `/qr`, `/gospel-cards` route to the witness video visitor page.
- `/witness-card-library` witness card image gallery.
- `/store`, `/shop` store placeholder page.
- `/attributes-of-god`, `/daily-encounters-with-god` book preview page for Daily Encounters with God and His Attributes.
- `/exchange`, `/lies-of-the-enemy-for-gods-truth` book preview page for EXCHANGE.

## Design Direction

The design should feel:

- clean
- ministry-focused
- warm
- readable
- spacious
- image-led where appropriate
- serious without being heavy
- inviting without being cheesy

The visual language is not ultra-modern SaaS minimalism. It can use modern spacing and clean UI, but it should still feel human, devotional, and grounded.

Good design moves:

- large readable hero text
- simple centered page introductions
- strong image cards
- book covers displayed in their real book-cover shape
- witness cards displayed in their real card aspect ratio
- soft shadows
- restrained borders
- calm cream / green / natural tones
- clear route hierarchy
- simple hover states like `Click me`

Avoid:

- abstract gradients replacing real content
- fake app-dashboard visuals
- overcomplicated animations
- cards that crop book covers into landscape shapes
- AI-looking generic blocks
- overly polished startup copy
- cluttered nav
- hiding the actual witness cards behind generic placeholders

## Resource Page Rules

The Resources page has two different kinds of cards:

1. Resource category cards.
   - The Witness Cards category should use the original `gospelcards_flipped.jpeg` image.
   - Do not replace that tile with a single witness card. The old flipped-card image is the right design.

2. Book preview cards.
   - These should literally be the book covers.
   - Do not make them landscape.
   - Do not add text blocks beside them.
   - Hover should simply reveal `Click me`.
   - Clicking opens the matching book preview page.

Any route change should start at the top of the page.

## Witness Cards / Videos

Witness video cards should use the actual witness card images as covers. The visitor clicks the card, then the video opens in an elevated modal/fullscreen-style view with the rest of the page blurred.

Current witness card/video pairings:

- `How Much Does God Love You and Me?`
  - video: `how-much-does-god-love-you-and-me.mp4`
- `Everyone Needs Lasting Hope. Don't Miss Out!`
  - video: `everyone-needs-lasting-hope-dont-miss-out.mp4`
- `Hope Is Not Lost`
  - video: `hope-is-not-lost.mp4`
- `Do You Know the One Who Holds Tomorrow?`
  - video: `do-you-know-the-one-who-holds-tomorrow.mp4`
- `Eternal Life Is a Gift. Will You Receive It?`
  - video: `eternal-life-is-a-gift-will-you-receive-it.mp4`
- `Tired of a World Full of Hurt?`
  - video: `tired-of-a-world-full-of-hurt.mp4`

If new witness cards are added, update `src/data/witnessCards.js` first.

## Voice And Diction

The copy should sound clear, faithful, and direct. It should feel like a Christian resource site for real people, not a marketing funnel.

Good voice:

- plainspoken
- hopeful
- reverent
- personal
- Scripture-aware
- gentle but confident
- simple enough for a first-time visitor

Good phrases:

- Gospel conversations
- lasting hope
- God’s truth
- witness cards
- daily encounters with God
- holy awe
- joyful worship
- walk in freedom
- Jesus Christ
- truth of God’s Word
- find out more
- read a preview
- watch the message

Avoid:

- hype language
- startup language
- “unlock your potential”
- “optimize your spiritual journey”
- corporate phrases
- vague inspiration without Gospel substance
- sarcastic or edgy copy
- AI-sounding paragraphs

## Page Copy Style

Prefer short paragraphs and strong headings.

Headlines can be bold and simple:

- `Choose the card you received`
- `Simple tools for Gospel conversations`
- `Read a piece of what is being built`
- `Daily Encounters with God and His Attributes`
- `Exchange lies for God’s truth`

Body copy should explain enough, then get out of the way.

For theological/devotional content, preserve reverence. Do not rewrite Scripture references casually.

## Store Direction

The Store page is currently a simple placeholder for witness cards. The intended direction:

- show available witness cards
- invite users to get cards for themselves
- eventually link to an external print/store provider
- no internal checkout yet

Store copy should feel practical and ministry-minded, not salesy.

## Implementation Rules

- Inspect existing files before changing.
- Keep changes small and scoped.
- Use existing data files for content lists.
- Use public paths for assets in `public/`.
- Avoid new dependencies unless clearly needed.
- Run `npm run build` and `npm run lint` after meaningful changes.
- Preserve user-added dirty files unless specifically told to remove them.

## Known Preferences From Recent Work

- User strongly disliked replacing the Resources witness-card category image with a single card image. Keep the old flipped-card image there.
- User wants actual book covers on Resources, not stylized placeholder cards.
- User wants the browser tab title to be `Light Overcomes`.
- User wants the new logo used for favicon and navbar.
- User wants witness card images updated everywhere the witness cards themselves are shown.

