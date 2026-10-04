# HA Nav Manager — regression tests

The suites execute `ha-nav-manager.js` in Chrome with Playwright, model Shadow DOM components and a simulated Home Assistant backend. They do not contact a live Home Assistant server. Native picker tests cover its property/event contract, not the upstream icon catalog or actual touch interaction.

## Requirements

Node.js, Playwright and a Chromium-based browser. If needed, set `NODE_PATH` to the directory containing Playwright and `TOOLBAR_TEST_BROWSER` to the browser executable.

## Run

```sh
node --check ha-nav-manager.js
node regression-tests/toolbar-runtime.cjs
node regression-tests/sidebar-dashboard.cjs
node regression-tests/manager-v082.cjs
node regression-tests/manager-v083.cjs
```

The 41 browser scenarios cover startup, shell replacement, placements, targets, kiosk behavior, styles, opacity, responsive sizing, persistence, icon selection/reset, dashboard CRUD payloads, ordering, item widths, language selection and RTL. The dictionaries are checked for explicit values in all 28 language variants.

## Translations

Edit `translations/manager.json` or `translations/sidebar-width.json`, then run:

```sh
node scripts/update-translations.cjs
```

The generator embeds the dictionaries into the standalone `ha-nav-manager.js`. Users install only that file.
## Integration loader

Run `python regression-tests/integration-loader.py` to check static-file registration, enable/unload/re-enable, confirmation without credentials, duplicate setup prevention and package consistency using simulated Home Assistant APIs. These tests do not replace installation testing in a running Home Assistant instance.
