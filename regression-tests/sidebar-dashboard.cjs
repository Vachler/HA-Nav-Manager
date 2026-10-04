const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const project = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(project, 'ha-nav-manager.js'), 'utf8');
const existing = fs.readFileSync(path.join(__dirname, 'toolbar-runtime.cjs'),'utf8');
eval(existing.slice(existing.indexOf('async function fixture('), existing.indexOf('(async () =>')));
const basic = { buttons: [{name:'Keep toolbar',icon:'mdi:home',targetType:'url',targetId:'/lovelace'}] };
async function setup(page, config) {
  await fixture(page, config || basic); await mounted(page, (config || basic).buttons.length);
  await page.evaluate(() => {
    const old = app.hass.callWS;
    window.records=[{id:'test',url_path:'dashboard-test',title:'Test',mode:'storage',show_in_sidebar:true}];
    app.hass.panels={'dashboard-test':{title:'Test',url_path:'dashboard-test',component_name:'lovelace'}};
    app.hass.callWS=async r => {
      if(!r.type.startsWith('lovelace/dashboards/')) return old(r);
      wsCalls.push(r);
      if(window.failApi) throw {code:'test_error',message:'Actual backend error'};
      if(r.type.endsWith('/list')) return structuredClone(records);
      if(r.type.endsWith('/create')) {
        if(!r.url_path.includes('-')) throw {code:'invalid_format',message:'Url path needs to contain a hyphen (-)'};
        if('icon' in r && !r.icon) throw {code:'invalid_format',message:'invalid icon'};
        if(records.some(d=>d.url_path===r.url_path)) throw {code:'already_exists',message:'URL already exists'};
        const d={...r,id:'created'}; delete d.type; records.push(d); return d;
      }
      if(r.type.endsWith('/update')) { if(r.icon==='') throw {code:'invalid_format',message:'empty icon'}; Object.assign(records.find(d=>d.id===r.dashboard_id),r); return {}; }
      if(r.type.endsWith('/delete')) {records=records.filter(d=>d.id!==r.dashboard_id);return {};}
    };
    class Sidebar extends HTMLElement {
      constructor(){ super();this.controllers=new Set();this.attachShadow({mode:'open'}); }
      addController(c){this.controllers.add(c);c.hostConnected?.();}
      removeController(c){this.controllers.delete(c);}
      updated(){this.controllers.forEach(c=>c.hostUpdated?.());}
    }
    customElements.define('ha-sidebar',Sidebar);
    customElements.define('ha-list-item-button',class extends HTMLElement {
      constructor(){super();this.attachShadow({mode:'open'}).innerHTML='<style>:host{display:block}.base{min-height:var(--ha-row-item-min-height,40px);padding-inline:var(--ha-row-item-padding-inline,12px)}</style><a class="base" part="base"><slot name="start"></slot><span part="headline"><slot name="headline"></slot></span><span part="ripple"></span></a>';}
    });
    window.sb=document.createElement('ha-sidebar');
    sb.style.cssText='display:block;width:250px;--sidebar-text-color:rgb(10,20,30);--sidebar-icon-color:rgb(30,20,10);--sidebar-selected-icon-color:rgb(20,40,60);--sidebar-background-color:rgb(255,255,255)';
    sb.shadowRoot.innerHTML='<style>ha-list-item-button{position:relative}ha-list-item-button.selected::before{content:"";position:absolute;inset:0;background:rgb(255,0,0);opacity:.12}</style><ha-list-nav class="before-spacer"><ha-list-item-button id="sidebar-panel-dashboard-test"><ha-svg-icon slot="start"></ha-svg-icon><span slot="headline" class="item-text">Test</span></ha-list-item-button><ha-list-item-button id="sidebar-panel-map"><ha-icon slot="start"></ha-icon><span slot="headline" class="item-text">Map</span></ha-list-item-button></ha-list-nav>';
    app.shadowRoot.prepend(sb);app.updated();
  });
  await page.waitForFunction(()=>sb.shadowRoot.querySelector('#sidebar-panel-dashboard-test'));
}
const appearance={iconColor:'#112233',textColor:'#223344',backgroundMode:'custom',background:'#ff0000',backgroundOpacity:50,hoverBackground:'#00ff00',hoverBackgroundOpacity:25,hoverColor:'#334455',activeBackground:'#0000ff',activeBackgroundOpacity:75,activeTextColor:'#445566',activeIconColor:'#556677',iconSizeDesktop:30,iconSizeMobile:18,itemHeightDesktop:52,itemHeightMobile:36,textSizeDesktop:17,textSizeMobile:12,spacingDesktop:8,spacingMobile:2,horizontalPaddingDesktop:16,horizontalPaddingMobile:6};
const conf={...basic,sidebar:{enabled:true,globalAppearance:appearance,itemOverrides:{'dashboard-test':{iconColor:'#abcdef',textColor:'#fedcba'}},customItems:[]}};
async function open(page,tab='sidebar'){await page.evaluate(()=>toolbarManager.open());await page.locator(`[data-tab="${tab}"]`).click();await page.locator('#sidebar-global [data-sidebar-field="iconColor"]').waitFor({state:'attached'});}
async function colors(page,id='sidebar-panel-dashboard-test'){return page.evaluate(id=>{const e=sb.shadowRoot.getElementById(id);return {text:getComputedStyle(e.querySelector('.item-text')).color,icon:getComputedStyle(e.querySelector('[slot=start]')).color,bg:getComputedStyle(e).backgroundColor,before:getComputedStyle(e,'::before').backgroundColor,size:getComputedStyle(e.querySelector('[slot=start]')).width,spacing:getComputedStyle(e).marginBottom,height:getComputedStyle(e).minHeight};},id);}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.TOOLBAR_TEST_BROWSER});let passed=0;
 async function test(name,fn){const page=await browser.newPage({viewport:{width:1100,height:800}});const errors=[];page.on('pageerror',e=>errors.push(e.message));try{await fn(page);assert.deepEqual(errors,[]);console.log('PASS '+name);passed++;}finally{await page.close();}}
 try {
 await test('native rendered global/per-item colors, hover, active, opacity and responsive resize',async p=>{
  await setup(p,conf);await p.waitForFunction(()=>sb.shadowRoot.querySelector('.tm-sidebar-item'));
  let c=await colors(p);assert.equal(c.icon,'rgb(171, 205, 239)');assert.equal(c.text,'rgb(254, 220, 186)');assert.match(c.bg,/0\.5\)/);assert.equal(c.size,'30px');
  assert.equal((await colors(p,'sidebar-panel-map')).icon,'rgb(17, 34, 51)');
  await p.locator('#sidebar-panel-dashboard-test').hover();c=await colors(p);assert.equal(c.icon,'rgb(51, 68, 85)');assert.equal(c.text,c.icon);assert.match(c.bg,/0\.25\)/);
  await p.evaluate(()=>{sb.shadowRoot.querySelector('ha-list-item-button').classList.add('selected');sb.updated();});c=await colors(p);assert.equal(c.icon,'rgb(85, 102, 119)');assert.equal(c.text,'rgb(68, 85, 102)');assert.match(c.bg,/0\.75\)/);assert.equal(c.before,'rgba(0, 0, 0, 0)');
  await p.setViewportSize({width:390,height:800});await p.waitForFunction(()=>getComputedStyle(sb.shadowRoot.querySelector('[slot=start]')).width==='18px');c=await colors(p);assert.equal(c.spacing,'2px');assert.equal(c.height,'36px');
 });
 await test('editor sliders, platform groups, theme reset, save and reload v0.8 config',async p=>{
  await setup(p,conf);await open(p);
  assert.equal(await p.locator('#sidebar-global input[type=range]').count(),3);
  assert.deepEqual(await p.locator('#sidebar-global [data-platform]').evaluateAll(es=>es.map(e=>[e.dataset.platform,...Array.from(e.querySelectorAll('input')).map(i=>i.dataset.sidebarField)])),[['Desktop','iconSizeDesktop','textSizeDesktop','itemHeightDesktop','itemWidthDesktop','spacingDesktop','horizontalPaddingDesktop'],['Mobile','iconSizeMobile','textSizeMobile','itemHeightMobile','itemWidthMobile','spacingMobile','horizontalPaddingMobile']]);
  await p.locator('#sidebar-native-list .item').filter({hasText:'Test'}).locator('[data-act=toggle]').click();
  const item=p.locator('#sidebar-native-list .item').filter({hasText:'Test'});
  await item.locator('[data-sidebar-color-mode=iconColor]').selectOption('theme');
  await p.locator('#sidebar-global [data-sidebar-field=hoverBackgroundOpacity]').fill('0');
  await p.locator('#save').click();await p.waitForFunction(()=>window.savedConfig);
  const saved=await p.evaluate(()=>savedConfig);assert.equal(saved.sidebar.globalAppearance.hoverBackgroundOpacity,0);assert.equal(saved.sidebar.itemOverrides['dashboard-test'].iconColor,'theme');assert.deepEqual(saved.buttons,basic.buttons);
  await p.locator('#toolbar-manager-settings-host').waitFor({state:'detached'});await p.mouse.move(1000,790);assert.equal((await colors(p)).icon,'rgb(30, 20, 10)');
  await setup(p,saved);await p.waitForFunction(()=>sb.shadowRoot.querySelector('.tm-sidebar-item'));assert.equal((await colors(p)).icon,'rgb(30, 20, 10)');
 });
 await test('dashboard create refresh, edit empty icon to null, deletion and backend errors',async p=>{
  await setup(p,conf);await open(p,'dashboards');
  await p.locator('#new-dashboard-title').fill('New');await p.locator('#new-dashboard-path').fill('singleword');await p.locator('#create-dashboard').click();assert.match(await p.locator('#dashboard-status').innerText(),/hyphen/);
  await p.locator('#new-dashboard-path').fill('new-dashboard');await p.locator('#new-dashboard-admin').check();await p.locator('#create-dashboard').click();await p.locator('#dashboard-list .dashboard-card').filter({has:p.locator('input[value="new-dashboard"]')}).waitFor();
  const create=await p.evaluate(()=>wsCalls.find(r=>r.type==='lovelace/dashboards/create'));assert.equal(create.mode,'storage');assert.equal(create.require_admin,true);assert.equal(create.show_in_sidebar,true);assert.ok(!('icon' in create));assert.match(await p.locator('#sidebar-native-list').innerText(),/new-dashboard/);
  const card=p.locator('#dashboard-list .dashboard-card').filter({has:p.locator('input[value="new-dashboard"]')});await card.locator('[data-dashboard-field=title]').fill('Renamed');await card.locator('[data-dashboard-field=show_in_sidebar]').uncheck();await card.locator('[data-act=update]').click();await p.waitForFunction(()=>records.find(r=>r.id==='created')?.title==='Renamed');assert.equal(await p.evaluate(()=>wsCalls.find(r=>r.type==='lovelace/dashboards/update').icon),null);
  p.on('dialog',d=>d.accept());await card.locator('[data-act=delete]').click();await p.waitForFunction(()=>!records.some(r=>r.id==='created'));
  await p.evaluate(()=>window.failApi=true);await p.locator('#new-dashboard-title').fill('Fail');await p.locator('#new-dashboard-path').fill('fail-dashboard');await p.locator('#create-dashboard').click();assert.match(await p.locator('#dashboard-status').innerText(),/test_error: Actual backend error/);
 });
 await test('all per-item state overrides, zero alpha, reset to global and native restore',async p=>{
  const item={iconColor:'#123456',textColor:'#654321',backgroundMode:'custom',background:'#123456',backgroundOpacity:0,hoverBackground:'#abcdef',hoverBackgroundOpacity:40,hoverColor:'#abcdef',activeBackground:'#fedcba',activeBackgroundOpacity:60,activeTextColor:'#010203',activeIconColor:'#040506',icon:'mdi:star',name:'Override'};
  await setup(p,{...conf,sidebar:{...conf.sidebar,itemOverrides:{'dashboard-test':item}}});await p.waitForFunction(()=>sb.shadowRoot.querySelector('.tm-sidebar-item'));
  let c=await colors(p);assert.equal(c.icon,'rgb(18, 52, 86)');assert.equal(c.text,'rgb(101, 67, 33)');assert.match(c.bg,/\/ 0\)/);
  await p.locator('#sidebar-panel-dashboard-test').hover();c=await colors(p);assert.equal(c.icon,'rgb(171, 205, 239)');assert.match(c.bg,/0\.4\)/);
  await p.evaluate(()=>sb.shadowRoot.querySelector('ha-list-item-button').classList.add('selected'));c=await colors(p);assert.equal(c.text,'rgb(1, 2, 3)');assert.equal(c.icon,'rgb(4, 5, 6)');assert.match(c.bg,/0\.6\)/);
  await open(p);const row=p.locator('#sidebar-native-list .item').filter({hasText:'Override'});await row.locator('[data-act=toggle]').click();await row.locator('[data-act=reset]').click();await p.locator('#save').click();await p.locator('#toolbar-manager-settings-host').waitFor({state:'detached'});
  await p.evaluate(()=>sb.shadowRoot.querySelector('ha-list-item-button').classList.remove('selected'));await p.mouse.move(1000,790);c=await colors(p);assert.equal(c.icon,'rgb(17, 34, 51)');assert.equal(await p.locator('#sidebar-panel-dashboard-test .item-text').innerText(),'Test');assert.equal(await p.locator('#sidebar-panel-dashboard-test ha-svg-icon').count(),1);
  await open(p);await p.locator('#restore-native-sidebar').click();await p.locator('#save').click();await p.waitForFunction(()=>!sb.shadowRoot.querySelector('.tm-sidebar-item'));assert.equal(await p.locator('#sidebar-panel-dashboard-test').getAttribute('style'),null);
 });
 await test('global theme removes stale color variables and selecting a background synchronizes mode',async p=>{
  await setup(p,conf);await open(p);
  await p.locator('#sidebar-global [data-sidebar-color-mode=textColor]').selectOption('');
  const bg=p.locator('#sidebar-global [data-sidebar-color=background]');await bg.fill('#abcdef');
  assert.equal(await p.locator('#sidebar-global [data-sidebar-field=backgroundMode]').inputValue(),'custom');
  await p.locator('#sidebar-global [data-sidebar-field=activeBackgroundOpacity]').fill('0');
  await p.locator('#save').click();await p.locator('#toolbar-manager-settings-host').waitFor({state:'detached'});
  assert.equal(await p.evaluate(()=>sb.shadowRoot.getElementById('sidebar-panel-map').style.getPropertyValue('--tm-text')),'');
  assert.equal((await colors(p,'sidebar-panel-map')).text,'rgb(10, 20, 30)');
 });
 await test('custom items inherit colors and target selection, persistence failure is visible',async p=>{
  const config={...conf,sidebar:{...conf.sidebar,customItems:[{id:'custom-test',name:'Custom',icon:'mdi:home',targetType:'dashboard',targetId:'/dashboard-test',textColor:'#abcdef'}]}};
  await setup(p,config);await p.waitForFunction(()=>sb.shadowRoot.querySelector('[data-toolbar-manager-custom]'));
  assert.equal((await colors(p,'toolbar-manager-sidebar-custom-test')).text,'rgb(171, 205, 239)');
  await open(p);await p.locator('#sidebar-custom-list [data-act=toggle]').click();assert.equal(await p.locator('[data-custom-target]').inputValue(),'/dashboard-test');
  await p.evaluate(()=>{const original=app.hass.callWS;app.hass.callWS=r=>r.type==='frontend/set_user_data'?Promise.reject(Error('storage offline')):original(r);Storage.prototype.setItem=()=>{throw Error('quota');};});
  await p.locator('#save').click();await p.waitForFunction(()=>document.getElementById('toolbar-manager-settings-host').shadowRoot.getElementById('status').textContent.includes('localStorage'));
  assert.equal(await p.locator('#toolbar-manager-settings-host').count(),1);
  assert.match(await p.locator('#status').innerText(),/storage offline/);
  assert.match(await p.locator('#status').innerText(),/quota/);
 });
 console.log(passed+' sidebar/dashboard browser scenarios passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
