"""Load HA Nav Manager globally without YAML or dashboard resources."""
from pathlib import Path

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

from .const import FRONTEND_PATH, MODULE_URL


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the bundled file once for the lifetime of the HA process."""
    await hass.http.async_register_static_paths([
        StaticPathConfig(
            FRONTEND_PATH,
            str(Path(__file__).parent / "frontend" / "ha-nav-manager.js"),
            False,
        )
    ])
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Enable automatic loading for all frontend pages."""
    frontend.add_extra_js_url(hass, MODULE_URL)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Stop loading the module in new frontend sessions."""
    frontend.remove_extra_js_url(hass, MODULE_URL)
    return True
