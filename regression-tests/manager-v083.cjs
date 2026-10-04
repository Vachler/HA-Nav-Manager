const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const source = fs.readFileSync(path.join(__dirname,'..','ha-nav-manager.js'),'utf8');
const toolbar = fs.readFileSync(path.join(__dirname,'toolbar-runtime.cjs'),'utf8');
eval(toolbar.slice(toolbar.indexOf('async function fixture('),toolbar.indexOf('(async () =>')));
const sidebar = fs.readFileSync(path.join(__dirname,'sidebar-dashboard.cjs'),'utf8');
eval(sidebar.slice(sidebar.indexOf('const basic ='),sidebar.indexOf('(async()=>')));
const base = {buttons:[{name:'Kept',icon:'mdi:home',targetType:'url',targetId:'/lovelace'}],sidebar:{enabled:true}};
const paths = p => p.locator('.dashboard-card').evaluateAll(cards=>cards.map(c=>c.dataset.path));
const rowWidth = (p,id='sidebar-panel-dashboard-test')=>p.evaluate(id=>sb.shadowRoot.getElementById(id).getBoundingClientRect().width,id);
async function orderSetup(p, saved) {
  await setup(p,{...base,sidebar:{enabled:true,order:['a-first','z-last'],...saved}});
  await p.evaluate(()=>{
    records=['a-first','z-last','hidden-board'].map(id=>({id,title:id,url_path:id,mode:'storage',show_in_sidebar:id!=='hidden-board'}));
    app.hass.panels=Object.fromEntries(records.slice(0,2).map(d=>[d.id,{...d,component_name:'lovelace'}]));
    sb.shadowRoot.querySelector('ha-list-nav').innerHTML=['z-last','a-first'].map(id=>`<ha-list-item-button id="sidebar-panel-${id}"><ha-icon slot="start"></ha-icon><span class="item-text" slot="headline">${id}</span></ha-list-item-button>`).join('');
    const old=app.hass.callWS;
    app.hass.callWS=async r=>r.type==='frontend/get_user_data'&&r.key==='sidebar'?{value:{panelOrder:['z-last','a-first']}}:old(r);
    sb.updated();
  });
}
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:process.env.TOOLBAR_TEST_BROWSER});let passed=0;
  async function test(name,fn){const p=await browser.newPage({viewport:{width:1100,height:800}});const errors=[];p.on('pageerror',e=>errors.push(e.message));try{await fn(p);assert.deepEqual(errors,[]);passed++;console.log('PASS '+name);}finally{await p.close();}}
  try {
    await test('legacy alphabetic order cannot override native preferences; new dashboards append',async p=>{
      await orderSetup(p);await open(p,'dashboards');assert.deepEqual(await paths(p),['z-last','a-first','hidden-board']);
      await p.waitForFunction(()=>sb.shadowRoot.querySelector('ha-list-nav').firstElementChild.id==='sidebar-panel-z-last');
      await p.locator('#new-dashboard-title').fill('AAA new');await p.locator('#new-dashboard-path').fill('aaa-new');await p.locator('#create-dashboard').click();
      await p.locator('[data-path="aaa-new"]').waitFor();assert.deepEqual(await paths(p),['z-last','a-first','hidden-board','aaa-new']);
      await p.evaluate(()=>{const e=document.createElement('ha-list-item-button');e.id='sidebar-panel-aaa-new';sb.shadowRoot.querySelector('ha-list-nav').prepend(e);sb.updated();});
      await p.waitForFunction(()=>sb.shadowRoot.querySelector('ha-list-nav').lastElementChild.id==='sidebar-panel-aaa-new');
      await p.locator('#refresh-dashboards').click();assert.deepEqual(await paths(p),['z-last','a-first','hidden-board','aaa-new']);
      await p.locator('#save').click();await p.locator('#toolbar-manager-settings-host').waitFor({state:'detached'});
      const saved=await p.evaluate(()=>savedConfig);assert.deepEqual(saved.sidebar.order,['a-first','z-last']);assert.equal(saved.sidebar.orderSource,'legacy');
      await orderSetup(p,saved.sidebar);await open(p,'dashboards');assert.deepEqual(await paths(p),['z-last','a-first','hidden-board']);
    });
    await test('new explicit order remains authoritative and survives configuration reload',async p=>{
      await orderSetup(p);await open(p);
      await p.locator('#sidebar-native-list .item').filter({hasText:'/a-first'}).locator('[data-act=up]').click();await p.locator('#save').click();await p.locator('#toolbar-manager-settings-host').waitFor({state:'detached'});
      const saved=await p.evaluate(()=>savedConfig);assert.equal(saved.sidebar.orderSource,'manager');
      await orderSetup(p,saved.sidebar);await open(p,'dashboards');assert.deepEqual((await paths(p)).slice(0,2),['a-first','z-last']);
    });
    await test('visible native order is used when saved HA preferences are unavailable',async p=>{
      await orderSetup(p);await p.evaluate(()=>{const old=app.hass.callWS;app.hass.callWS=r=>r.type==='frontend/get_user_data'&&r.key==='sidebar'?Promise.reject(Error('offline')):old(r);});
      await open(p,'dashboards');assert.deepEqual((await paths(p)).slice(0,2),['z-last','a-first']);
    });
    await test('global and individual widths apply to native/custom items on desktop/mobile and reload',async p=>{
      await setup(p,{...base,sidebar:{enabled:true,globalAppearance:{itemWidthDesktop:80,itemWidthMobile:70},itemOverrides:{'dashboard-test':{itemWidthDesktop:60,itemWidthMobile:50}},customItems:[{id:'custom',name:'Custom',targetType:'url',targetId:'/lovelace'}]}});
      await p.waitForFunction(()=>sb.shadowRoot.querySelector('.tm-sidebar-item'));
      assert.ok(Math.abs(await rowWidth(p)-150)<1);assert.ok(Math.abs(await rowWidth(p,'sidebar-panel-map')-200)<1);assert.ok(Math.abs(await rowWidth(p,'toolbar-manager-sidebar-custom')-200)<1);
      await p.setViewportSize({width:390,height:844});await p.waitForFunction(()=>sb.shadowRoot.getElementById('sidebar-panel-dashboard-test').getBoundingClientRect().width===125);
      assert.ok(Math.abs(await rowWidth(p,'toolbar-manager-sidebar-custom')-175)<1);
      await open(p);await p.locator('#sidebar-global [data-sidebar-field=itemWidthMobile]').fill('85');
      const row=p.locator('#sidebar-native-list .item').filter({hasText:'/dashboard-test'});await row.locator('[data-act=toggle]').click();await row.locator('[data-sidebar-field=itemWidthMobile]').fill('');
      await p.locator('#save').click();await p.locator('#toolbar-manager-settings-host').waitFor({state:'detached'});assert.ok(Math.abs(await rowWidth(p)-212.5)<1);
      const saved=await p.evaluate(()=>savedConfig);assert.equal(saved.sidebar.globalAppearance.itemWidthMobile,85);assert.equal(saved.sidebar.itemOverrides['dashboard-test'].itemWidthMobile,undefined);
      await setup(p,saved);await p.waitForFunction(()=>sb.shadowRoot.querySelector('.tm-sidebar-item'));assert.ok(Math.abs(await rowWidth(p)-212.5)<1);
      await open(p);await p.locator('#restore-native-sidebar').click();await p.locator('#save').click();await p.locator('#toolbar-manager-settings-host').waitFor({state:'detached'});assert.ok(Math.abs(await rowWidth(p)-250)<1);
    });
    await test('legacy width default, custom reset, validation clamping and RTL',async p=>{
      await setup(p,base);await p.waitForFunction(()=>sb.shadowRoot.querySelector('.tm-sidebar-item'));assert.equal(await rowWidth(p),250);
      await setup(p,{...base,sidebar:{enabled:true,itemOverrides:{'dashboard-test':{itemWidthDesktop:500}},customItems:[{id:'custom',name:'Custom',targetType:'url',targetId:'/lovelace',itemWidthDesktop:40}]}});await p.waitForFunction(()=>sb.shadowRoot.querySelector('.tm-sidebar-item'));assert.equal(await rowWidth(p),250);
      await p.evaluate(()=>{sb.dir='rtl';app.hass.language='he';});await open(p);
      const custom=p.locator('#sidebar-custom-list .item');await custom.locator('[data-act=toggle]').click();await custom.locator('[data-act=reset]').click();await p.locator('#save').click();await p.locator('#toolbar-manager-settings-host').waitFor({state:'detached'});
      assert.equal(await rowWidth(p,'toolbar-manager-sidebar-custom'),250);assert.equal(await p.evaluate(()=>savedConfig.sidebar.customItems[0].itemWidthDesktop),undefined);
    });
    console.log(`${passed} v0.8.3 scenarios passed (Chrome; simulated HA backend).`);
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
