// Embed complete, reviewable manager dictionaries in the single distributable JS.
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const groups = {
  layout: 'appearance desktop mobile icon_size button_gap button_height horizontal_padding kiosk_fallback kiosk_fallback_hint kiosk_bar',
  sidebar: 'tab_toolbar tab_sidebar tab_dashboards sidebar_intro sidebar_enabled global_appearance native_items custom_items add_sidebar_item no_sidebar_items visible reset_item reset_sidebar_global remove_overrides restore_native icon_color text_color hover_background hover_color active_background active_text_color active_icon_color border_radius item_height spacing text_size inherit filter_items native_item',
  dashboard: 'dashboard_manager_intro existing_dashboards create_dashboard dashboard_title dashboard_path show_sidebar admin_only create update delete confirm_delete_dashboard storage_dashboard yaml_dashboard dashboard_created dashboard_updated dashboard_deleted dashboard_api_error path_hint native_sidebar_restored sidebar_global_reset overrides_removed',
  extras: 'reset_appearance reset_appearance_done fine_spacing spacing_step_hint color_palette hue saturation brightness mobile_palette more_colors custom_picker_title apply cancel icon_correction button_correction correction_hint colors basic size_appearance background_opacity hover_opacity active_opacity dashboard_path_fixed dashboard_admin_required dashboard_title_required',
  new: 'reset_icon icon_picker_unavailable ordering_hint no_dashboards'
};
const data = JSON.parse(fs.readFileSync(path.join(root, 'translations/manager.json'), 'utf8'));
const widths = JSON.parse(fs.readFileSync(path.join(root, 'translations/sidebar-width.json'), 'utf8'));
let output = '  // BEGIN GENERATED MANAGER TRANSLATIONS (scripts/update-translations.cjs)\n';
for (const [lang, dictionary] of Object.entries(data)) {
  if (!widths[lang]?.every(value => value.trim()) || widths[lang].length !== 2) throw Error(`Missing width translation: ${lang}`);
  const entries = { item_width: widths[lang][0], item_width_hint: widths[lang][1] };
  for (const [group, text] of Object.entries(dictionary)) {
    const keys = groups[group].split(' '), values = text.split('|');
    if (keys.length !== values.length) throw Error(`${lang}.${group}: expected ${keys.length}, received ${values.length}`);
    keys.forEach((key, i) => { if (!values[i].trim()) throw Error(`${lang}.${key} empty`); entries[key] = values[i]; });
  }
  output += `  Object.assign(TRANSLATIONS[${JSON.stringify(lang)}], ${JSON.stringify(entries)});\n`;
}
output += '  // END GENERATED MANAGER TRANSLATIONS';
const file = path.join(root, 'ha-nav-manager.js');
let source = fs.readFileSync(file, 'utf8');
const pattern = /  \/\/ BEGIN GENERATED MANAGER TRANSLATIONS[\s\S]*?  \/\/ END GENERATED MANAGER TRANSLATIONS/;
source = pattern.test(source) ? source.replace(pattern, () => output) : source.replace('  const RTL_LANGS', output + '\n\n  const RTL_LANGS');
fs.writeFileSync(file, source);

// Keep the integration bundle synchronized with the development distribution.
fs.copyFileSync(file, path.join(root, "custom_components/ha_nav_manager/frontend/ha-nav-manager.js"));
