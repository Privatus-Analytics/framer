# Privatus Analytics for Framer

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
