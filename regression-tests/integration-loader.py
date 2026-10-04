"""Loader contract tests with simulated HA APIs; no running HA required."""
import asyncio
import importlib.util
import json
from pathlib import Path
import sys
import types
import unittest

ROOT = Path(__file__).resolve().parents[1]
COMPONENT = ROOT / 'custom_components/ha_nav_manager'

def module(name):
    result = types.ModuleType(name)
    sys.modules[name] = result
    return result

for name in ['homeassistant','homeassistant.components','homeassistant.components.frontend',
             'homeassistant.components.http','homeassistant.config_entries','homeassistant.core',
             'homeassistant.helpers','homeassistant.helpers.typing','homeassistant.data_entry_flow']:
    module(name)
frontend = sys.modules['homeassistant.components.frontend']
frontend.add_extra_js_url = lambda hass, url: hass.urls.add(url)
frontend.remove_extra_js_url = lambda hass, url: hass.urls.remove(url)

class StaticPathConfig:
    def __init__(self, url_path, path, cache_headers):
        self.url_path, self.path, self.cache_headers = url_path, path, cache_headers

sys.modules['homeassistant.components.http'].StaticPathConfig = StaticPathConfig
sys.modules['homeassistant.config_entries'].ConfigEntry = object
sys.modules['homeassistant.core'].HomeAssistant = object
sys.modules['homeassistant.helpers.typing'].ConfigType = dict
sys.modules['homeassistant.data_entry_flow'].FlowResult = dict

class Abort(Exception):
    pass

class BaseFlow:
    def __init_subclass__(cls, **kwargs):
        pass
    async def async_set_unique_id(self, unique_id):
        self.unique_id = unique_id
    def _abort_if_unique_id_configured(self):
        if getattr(self, 'existing', False):
            raise Abort('already_configured')
    def async_create_entry(self, **kwargs):
        return {'type':'create_entry', **kwargs}
    def async_show_form(self, **kwargs):
        return {'type':'form', **kwargs}

sys.modules['homeassistant.config_entries'].ConfigFlow = BaseFlow
spec = importlib.util.spec_from_file_location('ha_nav_manager', COMPONENT / '__init__.py', submodule_search_locations=[str(COMPONENT)])
loader = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = loader
spec.loader.exec_module(loader)
from ha_nav_manager.config_flow import ConfigFlow
from ha_nav_manager.const import MODULE_URL

class HTTP:
    def __init__(self):
        self.paths=[]
    async def async_register_static_paths(self, paths):
        self.paths.extend(paths)

class Tests(unittest.IsolatedAsyncioTestCase):
    async def test_setup_enable_unload_reenable(self):
        hass=types.SimpleNamespace(http=HTTP(), urls=set())
        self.assertTrue(await loader.async_setup(hass, {}))
        self.assertEqual(len(hass.http.paths), 1)
        self.assertTrue(Path(hass.http.paths[0].path).is_file())
        self.assertFalse(hass.http.paths[0].cache_headers)
        self.assertEqual(hass.urls, set())
        self.assertTrue(await loader.async_setup_entry(hass, object()))
        self.assertEqual(hass.urls, {MODULE_URL})
        self.assertTrue(await loader.async_unload_entry(hass, object()))
        self.assertEqual(hass.urls, set())
        self.assertTrue(await loader.async_setup_entry(hass, object()))
        self.assertEqual(len(hass.http.paths), 1)

    async def test_confirmation_and_empty_entry(self):
        flow=ConfigFlow()
        self.assertEqual((await flow.async_step_user())['type'], 'form')
        result=await flow.async_step_user({})
        self.assertEqual(result['type'], 'create_entry')
        self.assertEqual(result['data'], {})

    async def test_single_instance(self):
        flow=ConfigFlow()
        flow.existing=True
        with self.assertRaisesRegex(Abort, 'already_configured'):
            await flow.async_step_user({})

    async def test_package_and_documentation(self):
        manifest=json.loads((COMPONENT/'manifest.json').read_text())
        self.assertTrue(manifest['config_flow'])
        self.assertIn('frontend', manifest['dependencies'])
        self.assertEqual((ROOT/'ha-nav-manager.js').read_bytes(), (COMPONENT/'frontend/ha-nav-manager.js').read_bytes())
        self.assertIn(manifest['version'], MODULE_URL)
        hacs=json.loads((ROOT/'hacs.json').read_text())
        self.assertNotIn('filename', hacs)
        self.assertFalse(hacs.get('content_in_root', False))
        for filename in ['README.md','README-CZ.md']:
            readme=(ROOT/filename).read_text(encoding='utf-8')
            self.assertIn('category=integration', readme)
            self.assertNotIn('category=plugin', readme)
            self.assertNotIn('extra_module_url', readme)

if __name__ == '__main__':
    unittest.main()
