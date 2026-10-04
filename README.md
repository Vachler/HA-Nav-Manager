<a href="README.md"><img src="https://img.shields.io/badge/🇬🇧%20English-a3e635?style=for-the-badge" alt="English" height="34"></a>
<a href="README-CZ.md"><img src="https://img.shields.io/badge/🇨🇿%20Čeština-2563eb?style=for-the-badge" alt="Čeština" height="34"></a>

# HA Nav Manager


A visual navigation manager for **Home Assistant**. Customize the native toolbar, sidebar and dashboard metadata in one editor. Once installed, configure buttons, targets and appearance directly in the UI.

**Current version: 0.8.3** · **28 languages** · **Single JavaScript file**

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

Home Assistant with access to its configuration directory and an administrator account for the editor and dashboard management.

Install only **[ha-nav-manager.js](ha-nav-manager.js)**. No build step or Python integration is required.

---

<a id="installation"></a>

## 📦 Installation

### 1. Upload the file

Download `ha-nav-manager.js` using GitHub’s **Download raw file** button. Put it in the `www` directory next to the active `configuration.yaml`:

```text
/config/www/ha-nav-manager.js
```

Some editors expose that configuration directory as `/homeassistant`. In that case the path is:

```text
/homeassistant/www/ha-nav-manager.js
```

Create `www` if it does not exist. Keep the `.js` extension; the file must not be named `.js.txt`. HA serves `www` files through `/local/`. [HA documentation](https://www.home-assistant.io/integrations/http/#hosting-files)

### 2. Edit configuration.yaml

Add the module to the **existing** `frontend` section:

```yaml
frontend:
  extra_module_url:
    - /local/ha-nav-manager.js
```

If you already use themes, the section may look like this:

```yaml
frontend:
  themes: !include_dir_merge_named themes
  extra_module_url:
    - /local/ha-nav-manager.js
```

Include the `themes` line only if you have the corresponding themes directory. Preserve your other settings and modules. Do not create a second `frontend` section. If that section uses `!include`, edit the referenced file instead.

`extra_module_url` loads the module globally when the frontend opens. [HA documentation](https://www.home-assistant.io/integrations/frontend/#loading-extra-javascript)

Load the script only through `configuration.yaml`. Do not add it to dashboard resources. If it is already registered there, remove only that entry; keep the file in `www` and its YAML entry.

### 3. Restart Home Assistant

Save the YAML and check your configuration. Under **Settings → System**, open the restart menu and choose **Restart Home Assistant**.

**Restart the Home Assistant service itself. Closing the browser, refreshing a page or reloading themes does not activate the change. Rebooting the host computer is not required.**

Once the restart completes, refresh the browser with **Ctrl+F5**, or reload the frontend in the Companion App.

### 4. Open the editor

Sign in as an administrator and open a dashboard. Select **HA Nav Manager** from the toolbar’s **⋮** menu. Where that native menu is unavailable, the manager uses a fallback settings button near the toolbar.

The editor has tabs for the toolbar, sidebar and dashboards. Confirm toolbar and sidebar changes with **Save**. Dashboard creation, updates and deletion use their own action buttons in the dashboard forms.

---

<a id="updates"></a>

## 🔄 Updating the file

1. Download the current `ha-nav-manager.js` and replace the file in the `www` directory.
2. Keep the same filename. You then do not need to change `/local/ha-nav-manager.js` under `frontend` → `extra_module_url` in `configuration.yaml`.
3. In your browser, refresh the Home Assistant page with **F5**. On your phone, close the Home Assistant app and reopen it.

Replacing only the JS file does not require a Home Assistant restart. If you change its filename or path, update the URL in `configuration.yaml` and restart the Home Assistant service. The manager’s saved settings are retained.

---

<a id="troubleshooting"></a>

## 🩺 If the manager does not appear

1. In your file editor, open the active `configuration.yaml` (for example `/homeassistant/configuration.yaml`). Under `frontend` → `extra_module_url`, check the URL `/local/ha-nav-manager.js`. Its filename must exactly match `ha-nav-manager.js` in the `www` directory, including letter case.
2. In your browser’s address bar, enter your HA address followed by `/local/ha-nav-manager.js`, for example `http://193.165.1.10:8123/local/ha-nav-manager.js`. Use your own protocol, address and port. It should display JavaScript, not a 404 error or a GitHub page.
3. After editing YAML, restart the **Home Assistant service**.
4. **Computer – reload without cache (Chrome/Edge):** on the HA page, press **F12**, open **Network**, select **Disable cache**, then press **Ctrl+Shift+R**. Keep developer tools open during the reload. This bypasses the cache when loading the page; it does not delete all stored browser data.
5. **Android phone:** close the Home Assistant app. In the phone settings, open **Apps → Home Assistant → App info → Storage → Clear cache**, then reopen the app. Menu names vary by device. Choose **Clear cache**, not **Clear data / Clear storage**, which resets app data. These instructions apply to Android, not iPhone.

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

Distribution consists of one JS file. Run `node scripts/update-translations.cjs` to embed the dictionaries from `translations/`. Regression tests use Playwright with model components and a simulated backend; passing them does not guarantee compatibility with every HA release. See the [test instructions](regression-tests/README.md).
