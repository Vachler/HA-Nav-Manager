<a href="README.md"><img src="https://img.shields.io/badge/🇬🇧%20English-a3e635?style=for-the-badge" alt="English" height="34"></a>
<a href="README-CZ.md"><img src="https://img.shields.io/badge/🇨🇿%20Čeština-2563eb?style=for-the-badge" alt="Čeština" height="34"></a>

# HA Nav Manager


A visual navigation manager for **Home Assistant**. Customize the native toolbar, sidebar and dashboard metadata in one editor. Once installed, configure buttons, targets and appearance directly in the UI.

**Current version: 0.9.0** · **28 languages** · **Automatic frontend loading**

## Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Updating the file](#updates)
- [If the manager does not appear](#troubleshooting)
- [Storage and languages](#storage-languages)
- [Limitations](#limitations)
- [Development](#development)

---

<a id="features"></a>

## ⚙️ Features

### Toolbar

- Custom buttons for entities, devices, dashboards, applications/add-ons, settings and custom URLs.
- Target selection from lists and visual icon selection when the native Home Assistant picker is available.
- Icon, text and combined display styles.
- Placement beside the page title, instead of the title, or near system controls.
- Colors, background opacity, spacing and individual size corrections.
- Separate desktop and mobile dimensions.
- Optional fallback bar for kiosk setups where the native toolbar is hidden.

### Sidebar

- Edit native entries and add custom navigation items.
- Set names, icons, visibility and order.
- Global appearance with per-item overrides.
- Icon and text colors, normal/hover/active backgrounds and opacity.
- **20–100% item width**, height, icon and text sizes, padding, spacing and rounded corners.
- Separate desktop and mobile settings. Empty per-item width inherits the global value; 100% uses the full width.
- Reset an individual item, global appearance or the native sidebar.

The manager follows native user ordering. Manual ordering explicitly saved in HA Nav Manager takes priority. New entries without a saved position go at the end; remaining source order is retained without automatic alphabetical sorting. Opening or refreshing a list does not save an order.

### Dashboards

- Create dashboards and edit their title, icon, sidebar visibility and administrator-only access.
- New dashboard URLs start with the actual value `dashboard-`; append a suffix such as `living`.
- Delete dashboards with confirmation. **Deleting a dashboard also removes its Lovelace configuration.**
- YAML dashboards are read-only. Existing dashboard URLs cannot be changed through this editor.

---

<a id="requirements"></a>

## 🧩 Requirements

Home Assistant **2024.7 or newer**, HACS for the recommended installation method, and an administrator account for setup and the editor. Compatibility with every HA frontend version has not been verified.

---

<a id="installation"></a>

## 📦 Installation

### Install with HACS (recommended)

[![Open your Home Assistant instance and add HA Nav Manager to HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Vachler&repository=HA-Nav-Manager&category=integration)

1. With HACS already installed, click the button to add this **custom repository**. Alternatively, open **HACS → ⋮ → Custom repositories**, enter `https://github.com/Vachler/HA-Nav-Manager` and choose **Integration**.
2. Download **HA Nav Manager** in HACS.
3. **Restart Home Assistant**.
4. Open **Settings → Devices & services → Add integration**, search for **HA Nav Manager** and confirm setup. No configuration fields are required.
5. Refresh the browser or reopen the Companion App. Sign in as an administrator, open a dashboard and select **HA Nav Manager** in the toolbar’s **⋮** menu.

**No changes to `configuration.yaml`, dashboard resources or the `www` folder are required.** The integration automatically serves and loads its bundled JavaScript throughout the frontend. HACS installs it as an integration, so it does not add a dashboard resource. The project is not part of the default HACS catalog.

### Manual installation without HACS

Copy the complete `custom_components/ha_nav_manager` directory from this repository into `/config/custom_components/ha_nav_manager/`, including its `frontend` and `translations` subdirectories. Then follow steps 3–5 above. Installing the root JavaScript file alone is not the integration installation method.

### Open the editor

The editor has tabs for the toolbar, sidebar and dashboards. Confirm toolbar and sidebar changes with **Save**. Dashboard creation, updates and deletion use their own buttons. When the native toolbar menu is unavailable, a fallback settings button appears near the toolbar.

---

<a id="updates"></a>

## 🔄 Updating the file

Update **HA Nav Manager** in HACS, restart Home Assistant, then refresh the browser or reopen the Companion App. Existing editor settings are retained. With manual installation, replace the complete integration directory before restarting.

To disable or remove the integration, use **Settings → Devices & services**, then refresh every open HA browser or app to stop its already loaded JavaScript. This does not delete your per-user editor settings.

---

<a id="troubleshooting"></a>

## 🩺 If the manager does not appear

| Problem | What to check |
| --- | --- |
| Integration is missing | It was downloaded as **Integration** in HACS, then HA was restarted. For manual installation, check `/config/custom_components/ha_nav_manager/manifest.json`. |
| Editor is missing | Add **HA Nav Manager** under Devices & services, sign in as an administrator, refresh HA and open a dashboard. |
| Old interface remains | Restart HA after updating, then use **Ctrl+F5** or reopen the mobile app. |
| Setup fails | Check the HA logs for `ha_nav_manager` and include your HA version when reporting an issue. |

---

<a id="storage-languages"></a>

## 🌍 Storage and languages

Configuration is saved per user in Home Assistant’s frontend user data, with a backup in the browser’s `localStorage`. If only the browser fallback is available, settings are limited to that browser. Editor settings do not change user permissions.

The interface follows the Home Assistant language. It supports **28 variants**:

Czech, English, German, Slovak, Polish, French, Spanish, Italian, Hungarian, Dutch, Portuguese, Brazilian Portuguese, Romanian, Ukrainian, Russian, Turkish, Greek, Japanese, Korean, Simplified Chinese, Traditional Chinese, Vietnamese, Thai, Indonesian, Malay, Hindi, Arabic and Hebrew.

Arabic and Hebrew use RTL layout. Unsupported languages fall back to English. Reopen the editor after changing the language.

---

<a id="limitations"></a>

## ⚠️ Limitations

- HA provides the icon catalog, search and internal picker text. This project does not translate icon names or search terms. If the native component is not loaded yet, the editor displays a notice and a temporary text field.
- Appearance customization depends on the native frontend structure. Changes to HA components may affect compatibility.
- When saved ordering is unavailable, the manager cannot reconstruct the earlier order of hidden dashboards if the source changes it; the available source order is retained.
- Editing dashboard metadata does not change individual Lovelace cards. Deleting a dashboard does remove its entire configuration.

---

<a id="development"></a>

## 🛠️ Development

The integration bundles `custom_components/ha_nav_manager/frontend/ha-nav-manager.js`. The root JS file is retained for development and browser tests; synchronize both copies before publishing. Run `node scripts/update-translations.cjs` to embed the dictionaries from `translations/`. Regression tests use Playwright with model components and a simulated backend; passing them does not guarantee compatibility with every HA release. See the [test instructions](regression-tests/README.md).
