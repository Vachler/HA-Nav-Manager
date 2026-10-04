const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { chromium } = require('playwright');
const source = fs.readFileSync(path.join(__dirname, '..', 'ha-nav-manager.js'), 'utf8');
const toolbar = fs.readFileSync(path.join(__dirname, 'toolbar-runtime.cjs'), 'utf8');
eval(toolbar.slice(toolbar.indexOf('async function fixture('), toolbar.indexOf('(async () =>')));
const sidebar = fs.readFileSync(path.join(__dirname, 'sidebar-dashboard.cjs'), 'utf8');
eval(sidebar.slice(sidebar.indexOf('const basic ='), sidebar.indexOf('(async()=>')));
const dictionaries = vm.runInNewContext(source.slice(source.indexOf('const TRANSLATIONS'), source.indexOf('const RTL_LANGS')) + ';TRANSLATIONS');
assert.equal(Object.keys(dictionaries).length, 28);
for (const [lang, dictionary] of Object.entries(dictionaries)) {
  for (const key of Object.keys(dictionaries.en)) assert.ok(dictionary[key]?.trim(), `${lang}.${key} missing`);
}
for (const [, key] of source.matchAll(/\bt\("([a-z_]+)"\)/g)) assert.ok(dictionaries.en[key], `Unknown UI key ${key}`);
console.log('PASS all translation keys explicitly present in 28 languages');
const config = {buttons:[{name:'Kept', icon:'mdi:home', targetType:'url', targetId:'/lovelace'}], sidebar:{enabled:true}};
async function definePicker(page, tag = 'ha-selector') {
  // Contract fixture only: this does not simulate HA's actual icon catalog/search.
  await page.evaluate(tag => customElements.define(tag, class extends HTMLElement {}), tag);
}
async function choose(locator, value) {
  await locator.evaluate((el, value) => el.dispatchEvent(new CustomEvent('value-changed', {detail:{value}})), value);
}
async function listPaths(page) { return page.locator('#dashboard-list .dashboard-card').evaluateAll(cards => cards.map(c => c.querySelector('input[disabled]').value)); }
async function installOrder(page, order, explicit, fail = false) {
  await setup(page, {...config, sidebar:{enabled:true, order:explicit || [], orderSource:'manager'}});
  await page.evaluate(({order, fail}) => {
    records = ['z-last','a-first','h-hidden'].map((id, i) => ({id, url_path:id, title:id, mode:'storage', show_in_sidebar:i!==2}));
    app.hass.panels = Object.fromEntries(records.filter(r=>r.show_in_sidebar).map(r=>[r.url_path,{...r,component_name:'lovelace'}]));
    const old = app.hass.callWS;
    app.hass.callWS = async r => {
      if (r.type==='frontend/get_user_data' && r.key==='sidebar') {
        wsCalls.push(r);
        if(fail) throw Error('preferences unavailable');
        return {value:order === null ? null : {panelOrder:order}};
      }
      return old(r);
    };
  }, {order, fail});
}
(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.TOOLBAR_TEST_BROWSER});
  let passed = 0;
  async function test(name, fn) {
    const p = await browser.newPage({viewport:{width:1100,height:800}});
    const errors=[]; p.on('pageerror', e=>errors.push(e.message));
    try { await fn(p); assert.deepEqual(errors, []); console.log('PASS '+name); passed++; }
    finally { await p.close(); }
  }
  try {
    await test('native/custom visual selection, reset, persistence and rendered sidebar icons', async p => {
      await setup(p, {...config,sidebar:{enabled:true,customItems:[{id:'mine',name:'Mine',icon:'mdi:home',targetType:'url',targetId:'/lovelace'}]}});
      await definePicker(p); await open(p);
      const native = p.locator('#sidebar-native-list .item').filter({hasText:'/dashboard-test'});
      await native.locator('[data-act=toggle]').click();
      await choose(native.locator('ha-selector'), 'mdi:star');
      assert.equal(await native.locator('.preview-icon ha-icon').getAttribute('icon'),'mdi:star');
      await native.locator('[data-reset-icon]').click();
      assert.equal(await native.locator('[data-native-field=icon]').inputValue(),'');
      await choose(native.locator('ha-selector'), 'mdi:lamp');
      const custom = p.locator('#sidebar-custom-list .item');
      await custom.locator('[data-act=toggle]').click();
      await choose(custom.locator('ha-selector'), 'mdi:star');await custom.locator('[data-reset-icon]').click();
      assert.equal(await custom.locator('[data-custom-field=icon]').inputValue(),'mdi:link-variant');
      await choose(custom.locator('ha-selector'), 'mdi:door');
      await p.locator('#save').click(); await p.locator('#toolbar-manager-settings-host').waitFor({state:'detached'});
      const saved=await p.evaluate(()=>savedConfig);
      assert.equal(saved.sidebar.itemOverrides['dashboard-test'].icon,'mdi:lamp');
      assert.equal(saved.sidebar.customItems[0].icon,'mdi:door');assert.deepEqual(saved.buttons,config.buttons);
      assert.equal(await p.locator('#sidebar-panel-dashboard-test ha-icon').getAttribute('icon'),'mdi:lamp');
      await setup(p,saved); await p.waitForFunction(()=>sb.shadowRoot.querySelector('#sidebar-panel-dashboard-test ha-icon')?.getAttribute('icon')==='mdi:lamp');
      await definePicker(p); await open(p);
      const row=p.locator('#sidebar-native-list .item').filter({hasText:'/dashboard-test'});
      await row.locator('[data-act=toggle]').click();await row.locator('[data-reset-icon]').click();await p.locator('#save').click();
      await p.locator('#toolbar-manager-settings-host').waitFor({state:'detached'});
      assert.equal(await p.locator('#sidebar-panel-dashboard-test ha-svg-icon').count(),1);
    });
    await test('dashboard visual create/update payloads, reset to null and YAML read-only', async p => {
      await setup(p,config); await definePicker(p);
      await p.evaluate(()=>records.push({id:'yaml',url_path:'yaml-board',title:'YAML',mode:'yaml',icon:'mdi:home'}));
      await open(p,'dashboards');
      await p.locator('#new-dashboard-title').fill('Visual');await p.locator('#new-dashboard-path').fill('dashboard-visual');
      await choose(p.locator('#new-dashboard-icon + .icon-selector-host ha-selector'),'mdi:star');await p.locator('#create-dashboard').click();
      const card=p.locator('.dashboard-card').filter({has:p.locator('input[value="dashboard-visual"]')});await card.waitFor();
      assert.equal(await p.evaluate(()=>wsCalls.find(r=>r.type.endsWith('/create')).icon),'mdi:star');
      await choose(card.locator('ha-selector'),'mdi:lamp');await card.locator('[data-act=update]').click();
      await p.waitForFunction(()=>records.find(r=>r.id==='created').icon==='mdi:lamp');
      await card.locator('[data-reset-icon]').click();await card.locator('[data-act=update]').click();
      await p.waitForFunction(()=>records.find(r=>r.id==='created').icon===null);
      const yaml=p.locator('.dashboard-card').filter({has:p.locator('input[value="yaml-board"]')});
      assert.equal(await yaml.locator('ha-selector').evaluate(e=>e.disabled),true);assert.equal(await yaml.locator('[data-act]').count(),0);
      await choose(yaml.locator('ha-selector'),'mdi:star');assert.equal(await yaml.locator('[data-dashboard-field=icon]').inputValue(),'mdi:home');
    });
    await test('Czech URL prefix initialization, validation, manual path, failure and reset', async p => {
      await setup(p,config);await p.evaluate(()=>app.hass.language='cs');await open(p,'dashboards');
      assert.equal(await p.locator('#new-dashboard-path').inputValue(),'dashboard-');
      await p.locator('#new-dashboard-title').fill('Obývák');await p.locator('#create-dashboard').click();
      assert.equal(await p.evaluate(()=>wsCalls.filter(r=>r.type.endsWith('/create')).length),0);
      assert.match(await p.locator('#dashboard-status').innerText(),/Samotný prefix nestačí/);
      await p.locator('#new-dashboard-path').fill('custom-url');await p.locator('#new-dashboard-title').fill('Nový název');
      assert.equal(await p.locator('#new-dashboard-path').inputValue(),'custom-url');
      await p.evaluate(()=>window.failApi=true);await p.locator('#create-dashboard').click();
      assert.match(await p.locator('#dashboard-status').innerText(),/test_error: Actual backend error/);
      assert.equal(await p.locator('#new-dashboard-path').inputValue(),'custom-url');assert.equal(await p.locator('#new-dashboard-title').inputValue(),'Nový název');
      await p.evaluate(()=>window.failApi=false);await p.locator('#create-dashboard').click();
      await p.waitForFunction(()=>records.some(r=>r.url_path==='custom-url'));
      assert.equal(await p.locator('#new-dashboard-path').inputValue(),'dashboard-');assert.equal(await p.locator('#new-dashboard-title').inputValue(),'');
      assert.ok(await p.evaluate(()=>!('icon' in wsCalls.find(r=>r.type.endsWith('/create')))));
    });
    for(const explicit of [[], ['h-hidden','a-first']]) await test('ordering refresh/edit/create/delete/reopen; explicit='+explicit.length, async p => {
      await installOrder(p,['a-first','z-last'],explicit); await open(p,'dashboards');
      const expected=explicit.length ? ['h-hidden','a-first','z-last'] : ['a-first','z-last','h-hidden'];
      assert.deepEqual(await listPaths(p),expected);
      await p.evaluate(()=>records.reverse());await p.locator('#refresh-dashboards').click();assert.deepEqual(await listPaths(p),expected);
      const first=p.locator('.dashboard-card').first();await first.locator('[data-dashboard-field=title]').fill('Renamed');await first.locator('[data-act=update]').click();
      await p.waitForFunction(()=>records.some(r=>r.title==='Renamed'));assert.deepEqual(await listPaths(p),expected);
      await p.locator('#new-dashboard-title').fill('New');await p.locator('#new-dashboard-path').fill('new-board');await p.locator('#create-dashboard').click();
      await p.locator('input[value="new-board"]').first().waitFor();assert.deepEqual(await listPaths(p),[...expected,'new-board']);
      p.on('dialog',d=>d.accept());await p.locator('.dashboard-card').last().locator('[data-act=delete]').click();await p.waitForFunction(()=>!records.some(r=>r.url_path==='new-board'));assert.deepEqual(await listPaths(p),expected);
      assert.equal(await p.evaluate(()=>wsCalls.filter(r=>r.type==='frontend/set_user_data').length),0);
      await p.locator('#save').click();await p.locator('#toolbar-manager-settings-host').waitFor({state:'detached'});
      assert.deepEqual(await p.evaluate(()=>savedConfig.sidebar.order),explicit);
      await open(p,'dashboards');assert.deepEqual(await listPaths(p),expected);
      assert.ok(await p.evaluate(()=>wsCalls.filter(r=>r.type==='frontend/set_user_data').every(r=>r.key!=='sidebar')));
    });
    await test('unavailable preferences keep API order; legacy storage is read only', async p => {
      await installOrder(p,null,[],true);await open(p,'dashboards');assert.deepEqual(await listPaths(p),['z-last','a-first','h-hidden']);
      await p.locator('#close').click();await p.evaluate(()=>localStorage.setItem('sidebarPanelOrder',JSON.stringify(['h-hidden','z-last'])));
      await open(p,'dashboards');assert.deepEqual(await listPaths(p),['h-hidden','z-last','a-first']);
      assert.equal(await p.evaluate(()=>localStorage.getItem('sidebarPanelOrder')),'["h-hidden","z-last"]');
    });
    await test('explicit move starts from native order and persists only on Save', async p => {
      await installOrder(p,['a-first','z-last'],[]);await open(p);
      await p.locator('[data-tab=dashboards]').click();
      await p.locator('.dashboard-card').first().locator('[data-dashboard-field=title]').fill('Unsaved title');
      await p.locator('[data-tab=sidebar]').click();
      await p.locator('#sidebar-native-list .item').filter({hasText:'/a-first'}).locator('[data-act=down]').click();
      await p.locator('[data-tab=dashboards]').click();assert.deepEqual(await listPaths(p),['z-last','a-first','h-hidden']);
      assert.equal(await p.locator('.dashboard-card').nth(1).locator('[data-dashboard-field=title]').inputValue(),'Unsaved title');
      await p.locator('#save').click();
      await p.locator('#toolbar-manager-settings-host').waitFor({state:'detached'});
      assert.deepEqual(await p.evaluate(()=>savedConfig.sidebar.order),['z-last','a-first','h-hidden']);
      await open(p,'dashboards');assert.deepEqual(await listPaths(p),['z-last','a-first','h-hidden']);
      p.on('dialog',d=>d.accept());await p.locator('.dashboard-card').first().locator('[data-act=delete]').click();
      await p.waitForFunction(()=>!records.some(r=>r.id==='z-last'));
      await p.locator('#refresh-dashboards').click();
      await p.locator('#refresh-dashboards').click();
      assert.equal(await p.locator('#sidebar-native-list .item').filter({hasText:'/z-last'}).count(),0);
    });
    await test('mobile direct native picker and late registration preserve values', async p => {
      await p.setViewportSize({width:390,height:844});await setup(p,config);await open(p,'dashboards');
      await p.locator('#new-dashboard-icon').fill('mdi:lamp');await p.locator('#new-dashboard-icon').dispatchEvent('change');await definePicker(p,'ha-icon-picker');
      const picker=p.locator('#new-dashboard-icon + .icon-selector-host ha-icon-picker');assert.equal(await picker.evaluate(e=>e.value),'mdi:lamp');
      await choose(picker,'mdi:star');assert.equal(await p.locator('#new-dashboard-icon').inputValue(),'mdi:star');
      const grid=await p.locator('#panel-dashboards .dashboard-form').first().evaluate(e=>getComputedStyle(e).gridTemplateColumns);assert.equal(grid.split(' ').length,1);
      assert.ok(await p.locator('.dialog').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
    });
    await test('28 language selections render translations, picker labels and RTL', async p => {
      await setup(p,config);await definePicker(p);
      for(const [language,d] of Object.entries(dictionaries)) {
        await p.evaluate(language=>app.hass.language=language,language);await open(p,'dashboards');
        assert.equal(await p.locator('[data-tab=sidebar]').innerText(),d.tab_sidebar);
        assert.equal(await p.locator('#panel-dashboards .hint').first().innerText(),d.dashboard_manager_intro);
        assert.equal(await p.locator('#new-dashboard-icon + .icon-selector-host [data-reset-icon]').innerText(),d.reset_icon);
        assert.equal(await p.locator('.dialog').getAttribute('dir'),['ar','he'].includes(language)?'rtl':'ltr');await p.locator('#close').click();
      }
      await p.evaluate(()=>app.hass.language='xx-unknown');await open(p,'dashboards');assert.equal(await p.locator('[data-tab=sidebar]').innerText(),dictionaries.en.tab_sidebar);
    });
    console.log(`${passed} v0.8.2 browser scenarios passed (simulated backend and picker contract).`);
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
