# Privatus Analytics for Framer

**Real visitor numbers for your Framer site. No cookies, no cookie pop-up, no bots.**

You want to know if people visit your Framer site. But Google Analytics uses
cookies, so in many countries you must show a cookie pop-up first (the box that
asks visitors to say yes to cookies). Many people click no, so they never show
up in your numbers. Bots add fake visits on top.

This Framer plugin adds the Privatus Analytics script to your published Framer
site. Paste your site id, pick what to count, and click Install. The script sets
no cookies and keeps no IP addresses. Bots are filtered out before they are
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

A client-only Framer plugin. It adds the Privatus Analytics tracker tag to the
end of the `<head>` of a published Framer site with `framer.setCustomCode`.
There is no backend and no account connection. The user pastes a site ID
(`pa_...`), picks which modules to load, and clicks Install.

The tag it installs (one per site, `headEnd`):

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
- `src/App.tsx` the plugin window (320 x 460), live state from `framer.subscribeToCustomCode`
- `framer.json` plugin manifest, `public/icon.svg` icon, `assets/` PNG icons
- `SUBMISSION.md` listing copy and the steps only a person can do
