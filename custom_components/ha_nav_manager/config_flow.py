"""UI setup for HA Nav Manager."""
from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResult

from .const import DOMAIN


class ConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """One global frontend loader; editor settings remain per HA user."""

    VERSION = 1

    async def async_step_user(self, user_input=None) -> FlowResult:
        """Confirm setup without collecting credentials or configuration."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        if user_input is not None:
            return self.async_create_entry(title="HA Nav Manager", data={})
        return self.async_show_form(step_id="user")
