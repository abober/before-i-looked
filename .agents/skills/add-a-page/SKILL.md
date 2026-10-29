---
name: add-a-page
description: Add a server-rendered page or route in this repo using the existing layout. Use when creating or editing a file in src/views/, a route in src/app.tsx, or any HTML this service returns.
---

# add-a-page

Pages are read, not used. Follow `docs/vision.md`, `docs/adr/0001-server-rendered-jsx-no-client-js.md`, `docs/styleguide.md`, and `src/views/layout.tsx`. Do not restate them.

## Steps

1. Reuse `Layout`. Keep the one stylesheet that already lives in the layout.
2. Put logic in `src/<feature>/` and the view in `src/views/`. Register the route in `src/app.tsx`.
3. HTML and JSON for the same data call one function. Do not assemble the rows twice.
4. Missing data renders as `—`. Keep the time offset from the source. Do not convert it for display.
5. Prove the route with `app.request()` in vitest, the way `test/status.test.tsx` does. A browser does not decide that the page is done.

## Don'ts

- No `<script>`, no client JS, no second stylesheet, no build step for the front end.
- No animation, no truncation, no control that only makes sense live.
- A page that needs interaction is the wrong page.
