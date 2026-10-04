const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const source = fs.readFileSync(path.join(__dirname, '..', 'ha-nav-manager.js'), 'utf8');
const basic = {
  placement: 'after_title',
  buttons: [
    { name: 'Device', icon: 'mdi:home', targetType: 'device', targetId: 'device-1', display: 'icon' },
    { name: 'Dashboard', icon: 'mdi:view-dashboard', targetType: 'dashboard', targetId: '/lovelace/test', display: 'icon_text' }
  ]
};

// These shell elements implement the documented Lit controller callbacks.
// This is a deterministic lifecycle fixture, not a copy of the HA frontend.
async function fixture(page, config = basic, options = {}) {
  await page.route('http://toolbar.test/**', route => route.fulfill({
    contentType: 'text/html', body: '<!doctype html><html lang="en"><body></body></html>'
  }));
  await page.goto('http://toolbar.test/');
  await page.evaluate(({ config, options }) => {
    window.fixtureConfig = config;
    window.wsCalls = [];
    window.fixtureOptions = options;
    window.installShell = () => {
      class Shell extends HTMLElement {
        constructor() { super(); this.controllers = new Set(); this.attachShadow({ mode: 'open' }); }
        addController(controller) { this.controllers.add(controller); if (this.isConnected) controller.hostConnected?.(); }
        removeController(controller) { this.controllers.delete(controller); }
        connectedCallback() { this.controllers.forEach(c => c.hostConnected?.()); }
        disconnectedCallback() { this.controllers.forEach(c => c.hostDisconnected?.()); }
        updated() { this.controllers.forEach(c => c.hostUpdated?.()); }
        render(markup) { this.shadowRoot.innerHTML = markup; this.updated(); }
      }
      for (const tag of ['home-assistant', 'home-assistant-main', 'partial-panel-resolver', 'ha-panel-lovelace', 'hui-root']) {
        customElements.define(tag, class extends Shell {});
      }
      const app = document.querySelector('home-assistant') || document.createElement('home-assistant');
      if (!app.isConnected) document.body.appendChild(app);
      window.app = app;
      window.provideHass = () => {
        app.hass = {
          language: options.language || 'en', user: { is_admin: options.admin !== false },
          states: { 'light.test': { entity_id: 'light.test', attributes: { friendly_name: 'Lamp' } } },
          callWS: async request => {
            window.wsCalls.push(request);
            if (request.type === 'frontend/get_user_data') {
              if (options.storageFailure) throw Error('User data unavailable');
              if (options.deferConfig) await new Promise(resolve => { window.releaseConfig = resolve; });
              return { value: window.fixtureConfig };
            }
            if (request.type === 'frontend/set_user_data') { window.savedConfig = request.value; return {}; }
            if (request.type === 'config/device_registry/list') return [{ id: 'device-1', name: 'Device' }];
            if (request.type === 'lovelace/dashboards/list') return [{ url_path: 'dashboard-test', title: 'Test' }];
            return {};
          }
        };
        app.updated();
      };
      if (!options.deferHass) window.provideHass();
      let host = app;
      for (const tag of ['home-assistant-main', 'partial-panel-resolver', 'ha-panel-lovelace', 'hui-root']) {
        host.render(`<${tag}></${tag}>`);
        host = host.shadowRoot.firstElementChild;
      }
      window.root = host;
      root.render('<style>.toolbar{display:flex;align-items:center;height:56px;width:800px}.main-title{flex:1}.action-items{display:flex;align-items:center}ha-dropdown{display:block;width:40px;height:40px}</style><hui-view></hui-view>');
      window.showToolbar = ({ title = true, overflow = true, nested = false } = {}) => {
        root.shadowRoot.querySelector('.toolbar')?.remove();
        const toolbar = document.createElement('div');
        toolbar.className = 'toolbar';
        toolbar.innerHTML = `${title ? '<div class="main-title">Home</div>' : '<div class="tabs">Tabs</div>'}${nested ? '<div class="actions-wrapper">' : ''}<div class="action-items">${overflow ? '<ha-dropdown><ha-icon-button id="dashboardmenu"></ha-icon-button></ha-dropdown>' : ''}</div>${nested ? '</div>' : ''}`;
        root.shadowRoot.prepend(toolbar);
        root.updated();
      };
      if (!options.deferToolbar) window.showToolbar(options);
      if (options.hidden) root.style.display = 'none';
      if (options.storageFailure) localStorage.setItem('toolbar_manager_config_v1', JSON.stringify(config));
    };
    if (options.lateDefinition) document.body.appendChild(document.createElement('home-assistant'));
    else window.installShell();
  }, { config, options });
  await page.addScriptTag({ content: source });
}

async function mounted(page, count = 2) {
  await page.waitForFunction(count => {
    const d = window.toolbarManager?.diagnostics();
    return d?.phase === 'mounted' && d.zone?.connected && d.zone.buttons === count && d.zone.width > 0;
  }, count);
  const errors = await page.evaluate(() => toolbarManager.diagnostics().events.filter(e => e.event.endsWith('error')));
  assert.deepEqual(errors, []);
}

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.TOOLBAR_TEST_BROWSER ? { executablePath: process.env.TOOLBAR_TEST_BROWSER } : {}) });
  let passed = 0;
  async function test(name, run) {
    const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try { await run(page); assert.deepEqual(errors, []); passed++; console.log(`PASS ${name}`); }
    finally { await page.close(); }
  }
  try {
    await test('cold start before HA definitions, hass and toolbar', async page => {
      await fixture(page, basic, { lateDefinition: true, deferHass: true, deferToolbar: true });
      await page.evaluate(() => installShell());
      await page.evaluate(() => provideHass());
      await page.waitForFunction(() => toolbarManager.diagnostics().loaded);
      await page.evaluate(() => showToolbar());
      await mounted(page);
    });
    await test('configuration resolves after first toolbar render', async page => {
      await fixture(page, basic, { deferConfig: true });
      await page.waitForFunction(() => typeof releaseConfig === 'function');
      await page.evaluate(() => releaseConfig());
      await mounted(page);
    });
    await test('toolbar replacement keeps the same hui-view', async page => {
      await fixture(page); await mounted(page);
      await page.evaluate(() => { window.sameView = root.shadowRoot.querySelector('hui-view'); showToolbar(); });
      await mounted(page);
      assert.equal(await page.evaluate(() => sameView === root.shadowRoot.querySelector('hui-view')), true);
    });
    await test('entire hui-root replacement inside Shadow DOM', async page => {
      await fixture(page); await mounted(page);
      await page.evaluate(() => {
        const parent = root.getRootNode().host;
        const markup = root.shadowRoot.innerHTML.replace(/<div id="toolbar-manager-zone"[\s\S]*?<\/div>/, '');
        parent.render('<hui-root></hui-root>');
        window.root = parent.shadowRoot.firstElementChild;
        root.render(markup);
        showToolbar();
      });
      await mounted(page);
    });
    for (const placement of ['after_title', 'replace_title', 'before_actions', 'inside_actions']) {
      await test(`placement ${placement}, hidden buttons and stable updates`, async page => {
        await fixture(page, { ...basic, placement, buttons: [...basic.buttons, { enabled: false, name: 'Disabled' }] });
        await mounted(page);
        assert.equal(await page.evaluate(() => {
          const zone = root.shadowRoot.querySelector('#toolbar-manager-zone');
          window.firstZone = zone;
          if (fixtureConfig.placement === 'inside_actions') return zone.parentElement.className === 'action-items';
          if (fixtureConfig.placement === 'before_actions') return zone.nextElementSibling.className === 'action-items';
          return zone.previousElementSibling.className === 'main-title';
        }), true);
        await page.evaluate(() => { for (let i = 0; i < 20; i++) root.updated(); });
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        assert.equal(await page.evaluate(() => firstZone === root.shadowRoot.querySelector('#toolbar-manager-zone')), true);
        assert.equal(await page.evaluate(() => root.shadowRoot.querySelector('.main-title').style.display === 'none'), placement === 'replace_title');
      });
    }
    await test('missing title and nested actions use the actual insertion parent', async page => {
      await fixture(page, basic, { title: false, nested: true }); await mounted(page);
    });
    await test('hidden shell becomes visible through ResizeObserver', async page => {
      await fixture(page, basic, { hidden: true });
      await page.waitForFunction(() => toolbarManager.diagnostics().phase === 'waiting-for-toolbar');
      await page.evaluate(() => { root.style.display = ''; });
      await mounted(page);
    });
    await test('kiosk fallback and return to native toolbar', async page => {
      await fixture(page, { ...basic, kioskFallback: true }, { deferToolbar: true });
      await mounted(page);
      assert.equal(await page.locator('#toolbar-manager-kiosk-bar').count(), 1);
      await page.evaluate(() => showToolbar()); await mounted(page);
      await page.locator('#toolbar-manager-kiosk-bar').waitFor({ state: 'detached' });
    });
    await test('overflow menu rebuilt without recreating buttons', async page => {
      await fixture(page); await mounted(page);
      await page.evaluate(() => { window.firstZone = root.shadowRoot.querySelector('#toolbar-manager-zone'); root.shadowRoot.querySelector('#toolbar-manager-overflow-item').remove(); root.updated(); });
      await page.waitForFunction(() => root.shadowRoot.querySelector('#toolbar-manager-overflow-item'));
      assert.equal(await page.evaluate(() => firstZone === root.shadowRoot.querySelector('#toolbar-manager-zone')), true);
    });
    await test('all six target types preserve navigation and entity events', async page => {
      const targets = [ ['entity', 'light.test'], ['device', 'device-1'], ['addon', 'addon-1'], ['dashboard', 'dashboard-test'], ['settings', '/config/entities'], ['url', '/custom/page'] ];
      await fixture(page, { ...basic, buttons: targets.map(([targetType, targetId]) => ({ targetType, targetId, name: targetType, display: 'text' })) });
      await mounted(page, 6);
      await page.evaluate(() => app.addEventListener('hass-more-info', event => { window.entityOpened = event.detail.entityId; }));
      await page.locator('[data-toolbar-manager-index="0"]').click();
      assert.equal(await page.evaluate(() => entityOpened), 'light.test');
      const expected = ['/config/devices/device/device-1', '/app/addon-1', '/dashboard-test', '/config/entities', '/custom/page'];
      for (let i = 1; i < targets.length; i++) {
        await page.locator(`[data-toolbar-manager-index="${i}"]`).click();
        assert.equal(new URL(page.url()).pathname, expected[i - 1]);
      }
    });
    await test('mobile metrics, corrections, theme color and background opacity', async page => {
      await fixture(page, { ...basic, iconSizeMobile: 20, buttonHeightMobile: 40, buttonHeightDesktop: 50,
        buttons: [{ ...basic.buttons[0], iconSizeCorrection: 10, buttonSizeCorrection: -10,
          colorMode: 'theme', color: '#ff0000', backgroundMode: 'theme', backgroundOpacity: 50 }] });
      await mounted(page, 1);
      await page.setViewportSize({ width: 390, height: 800 });
      await page.waitForFunction(() => root.shadowRoot.querySelector('.toolbar-manager-user-button').style.height === '36px');
      assert.equal(await page.evaluate(() => root.shadowRoot.querySelector('.toolbar-manager-user-button ha-icon').style.getPropertyValue('--mdc-icon-size')), '22px');
      assert.ok((await page.locator('.toolbar-manager-user-button').getAttribute('style')).includes('50%'));
    });
    await test('configuration fallback, Czech editor and save', async page => {
      await fixture(page, basic, { storageFailure: true, language: 'cs' }); await mounted(page);
      await page.evaluate(() => toolbarManager.open());
      assert.equal(await page.evaluate(() => window.haNavManager === window.toolbarManager), true);
      assert.match(await page.locator('#toolbar-manager-settings-host .dialog').innerText(), /HA Nav Manager/);
      await page.locator('#placement').selectOption('inside_actions');
      await page.locator('#hide-title').check();
      await page.locator('#save').click();
      await page.waitForFunction(() => window.savedConfig?.placement === 'inside_actions');
      assert.equal(await page.evaluate(() => savedConfig.buttons.length), 2);
      assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('toolbar_manager_config_v1')).hideTitle), true);
      assert.equal(await page.locator('#diagnostics, #floating-diagnostics').count(), 0);
    });
    await test('non-admin users keep buttons without manager controls', async page => {
      await fixture(page, basic, { admin: false }); await mounted(page);
      assert.equal(await page.locator('#toolbar-manager-overflow-item, #toolbar-manager-settings-button').count(), 0);
    });
    await test('fallback manager opens editor and late native icon picker upgrades', async page => {
      await fixture(page, basic, { overflow: false }); await mounted(page);
      await page.locator('#toolbar-manager-settings-button').dispatchEvent('click');
      await page.locator('.icon-selector-host input').first().waitFor({ state: 'attached' });
      assert.equal(await page.locator('#panel-toolbar .item').count(), 2);
      await page.evaluate(() => customElements.define('ha-selector', class extends HTMLElement {}));
      await page.locator('ha-selector').first().waitFor({ state: 'attached' });
      assert.equal(await page.locator('#panel-toolbar ha-selector').count(), 2);
    });
    await test('all display modes render their expected icon and text', async page => {
      const displays = ['icon', 'icon_text', 'text', 'compact', 'wide'];
      await fixture(page, { ...basic, buttons: displays.map(display => ({ ...basic.buttons[0], display })) });
      await mounted(page, 5);
      const result = await page.evaluate(() => [...root.shadowRoot.querySelectorAll('.toolbar-manager-user-button')].map(button => ({
        icon: !!button.querySelector('ha-icon'), text: !!button.querySelector('span')
      })));
      assert.deepEqual(result, [{ icon: true, text: false }, { icon: true, text: true }, { icon: false, text: true }, { icon: true, text: true }, { icon: true, text: true }]);
    });
    await test('startup opacity animation does not postpone mounting', async page => {
      await fixture(page, basic, { deferToolbar: true });
      await page.evaluate(() => { root.style.opacity = '0'; showToolbar(); });
      await mounted(page);
    });
    await test('native overflow entry opens repeatedly without reinjection', async page => {
      await fixture(page); await mounted(page);
      for (let i = 0; i < 2; i++) {
        await page.locator('#toolbar-manager-overflow-item').dispatchEvent('click');
        await page.locator('#placement').waitFor();
        await page.locator('#close').click();
      }
      assert.equal(await page.evaluate(() => toolbarManager.diagnostics().events.filter(event => event.event === 'mounted').length), 1);
    });
    await test('clean release ignores old diagnostic preference and exposes no diagnostic controls', async page => {
      await fixture(page); await mounted(page);
      await page.evaluate(() => localStorage.setItem('toolbar_manager_floating_diagnostics', '1'));
      await fixture(page); await mounted(page);
      await page.evaluate(() => toolbarManager.open());
      assert.equal(await page.locator('#diagnostics, #floating-diagnostics, #toolbar-manager-diagnostics-launcher, #toolbar-manager-boot-probe').count(), 0);
      assert.equal(await page.evaluate(() => typeof toolbarManager.downloadDiagnostics), 'undefined');
      assert.equal(await page.evaluate(() => typeof toolbarManager.setFloatingDiagnostics), 'undefined');
    });
    console.log(`${passed} browser scenarios passed.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
