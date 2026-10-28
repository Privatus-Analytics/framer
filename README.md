# Privatus Analytics for Framer

**Real visitor numbers for your Framer site. No cookies, no cookie pop-up, no bots.**

You want to know if people visit your Framer site. But Google Analytics uses
cookies, so in many countries you must show a cookie pop-up first (the box that
asks visitors to say yes to cookies). Many people click no, so they never show
up in your numbers. Bots add fake visits on top.

This Framer plugin builds your Privatus Analytics snippet. Paste your site ID,
pick what to count, and click Copy snippet. Then paste it in Site Settings,
Custom Code, and publish. The plugin does not change your project or send any
data. The script sets no cookies and keeps no IP addresses. Bots are filtered out before they are
counted.

So you see how many real people came, which pages they looked at and where they
came from, on one simple dashboard. A report comes to your inbox each week, and
you can set alerts for when traffic jumps or drops. And you don't need a cookie
pop-up for your analytics.

**Free plan, no card:** 10,000 events a month (an event is a page view or an action you track) on up to 3 sites. [Start free at privatusanalytics.com](https://privatusanalytics.com).

- **No cookies.** No cookies and no hidden IDs on your visitors' devices, and no IP
  addresses are kept. Laws differ by country, so check your own legal advice.
- **Real people, not bots.** Known bots, data centers and spam visits are left
  out on every plan.
- **Small and fast.** The script is about 3 KB when compressed.

## About this repo

A client-only Framer plugin. It builds the Privatus Analytics tracker tag and
copies it to the clipboard. It never calls `framer.setCustomCode`, never
changes the project and makes no network requests. The user pastes the tag in
Site Settings, General, Custom Code ("End of <head> tag") themselves. This
follows Framer's Marketplace review (2026-10-28): a plugin may not add a
script that sends visitor data outside Framer.

The tag it builds:

```html
<script defer src="https://privatusstats.com/js/pa.js" data-site="pa_YOURSITEID" data-modules="engage,auto,vitals,clicks,ask"></script>
```

Events only come from the tracker script. Nothing is sent from a server.

## Develop

```sh
npm install        # .npmrc sets legacy-peer-deps, npm 10 crashes on the peer tree without it
npm test           # vitest, the tag builder, parser and site ID validation
npm run typecheck
npm run build
npm run dev        # local HTTPS dev server for Framer's development plugin (mkcert asks for your password once)
npm run pack       # build + plugin.zip for the Marketplace (framer-plugin-tools 1.2.2)
```

## Files

- `src/tracker.ts` pure helpers (build, parse, validate), unit tested
- `src/App.tsx` the plugin window (320 x 560), snippet builder with a copy button and paste steps
- `framer.json` plugin manifest, `public/icon.svg` icon, `assets/` PNG icons
- `SUBMISSION.md` listing copy and the steps only a person can do
