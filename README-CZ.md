<a href="https://github.com/Vachler/HA-Nav-Manager/blob/main/README.md"><img src="https://img.shields.io/badge/🇬🇧%20English-a3e635?style=for-the-badge" alt="English" height="34"></a>
<a href="https://github.com/Vachler/HA-Nav-Manager/blob/main/README-CZ.md"><img src="https://img.shields.io/badge/🇨🇿%20Čeština-2563eb?style=for-the-badge" alt="Čeština" height="34"></a>

# HA Nav Manager


Vizuální správce navigace pro **Home Assistant**. Upravujte horní lištu, boční panel a dashboardy v jednom rozhraní. Po instalaci nastavujete tlačítka, cíle a vzhled přímo v editoru.

**Aktuální verze: 0.9.1** · **28 jazyků** · **Automatické načítání rozhraní**

## Obsah

- [Funkce](https://github.com/Vachler/HA-Nav-Manager/blob/main/README-CZ.md#features)
- [Požadavky](https://github.com/Vachler/HA-Nav-Manager/blob/main/README-CZ.md#requirements)
- [Instalace](https://github.com/Vachler/HA-Nav-Manager/blob/main/README-CZ.md#installation)
- [Aktualizace souboru](https://github.com/Vachler/HA-Nav-Manager/blob/main/README-CZ.md#updates)
- [Když se správce nezobrazuje](https://github.com/Vachler/HA-Nav-Manager/blob/main/README-CZ.md#troubleshooting)
- [Ukládání a jazyky](https://github.com/Vachler/HA-Nav-Manager/blob/main/README-CZ.md#storage-languages)
- [Obrázky](https://github.com/Vachler/HA-Nav-Manager/blob/main/README-CZ.md#screenshots)
- [Omezení](https://github.com/Vachler/HA-Nav-Manager/blob/main/README-CZ.md#limitations)
- [Vývoj](https://github.com/Vachler/HA-Nav-Manager/blob/main/README-CZ.md#development)

---

<a id="features"></a>

## ⚙️ Funkce

### Horní lišta

- Vlastní tlačítka pro entity, zařízení, dashboardy, aplikace/doplňky, nastavení a vlastní URL.
- Výběr cíle ze seznamu a vizuální výběr ikon, pokud je dostupný nativní picker Home Assistantu.
- Zobrazení ikony, textu nebo jejich kombinace.
- Umístění vedle názvu stránky, místo názvu nebo u systémových ovládacích prvků.
- Barvy, pozadí a jeho krytí, rozestupy a individuální korekce velikosti.
- Samostatné rozměry pro počítač a mobil.
- Volitelná náhradní lišta pro kiosk režim při skryté nativní liště.

### Boční panel

- Úpravy nativních položek a přidávání vlastních odkazů.
- Nastavení názvu, ikony, viditelnosti a pořadí.
- Globální vzhled a individuální výjimky.
- Barvy ikon, textu a pozadí v běžném stavu, při najetí ukazatelem a při aktivní položce, včetně krytí pozadí.
- Šířka položky **20–100 %**, výška, velikost ikon a textu, odsazení, rozestupy a zaoblení.
- Samostatná nastavení pro počítač a mobil. Prázdná individuální šířka dědí globální hodnotu; 100 % znamená plnou šířku.
- Obnovení jednotlivé položky, globálního vzhledu nebo nativního panelu.

Správce přebírá nativní uživatelské pořadí. Ruční pořadí výslovně uložené v HA Nav Manageru má přednost. Nové položky bez uložené pozice přidává na konec; dostupné pořadí zdroje zachovává bez vlastního abecedního řazení. Samotné otevření ani obnovení seznamu pořadí neukládá.

### Dashboardy

- Vytváření dashboardů a úpravy názvu, ikony, zobrazení v sidebaru a přístupu pouze pro správce.
- URL nového dashboardu obsahuje předvyplněné `dashboard-`; stačí doplnit například `obyvak`.
- Mazání dashboardů s potvrzením. **Smazání odstraní také jejich Lovelace konfiguraci.**
- YAML dashboardy jsou pouze pro čtení. URL existujícího dashboardu nelze tímto editorem změnit.

---

<a id="requirements"></a>

## 🧩 Požadavky

Home Assistant **2024.7 nebo novější**, HACS pro doporučený způsob instalace a účet správce pro přidání integrace i editor. Kompatibilita se všemi verzemi rozhraní HA nebyla ověřena.

---

<a id="installation"></a>

## 📦 Instalace

### Instalace přes HACS (doporučeno)

[![Otevřít Home Assistant a přidat HA Nav Manager do HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Vachler&repository=HA-Nav-Manager&category=integration)

1. S již nainstalovaným HACS klikněte na tlačítko a přidejte tento **vlastní repozitář**. Případně otevřete **HACS → ⋮ → Vlastní repozitáře**, zadejte `https://github.com/Vachler/HA-Nav-Manager` a zvolte **Integrace**.
2. V HACS stáhněte **HA Nav Manager**.
3. **Restartujte Home Assistant**.
4. Otevřete **Nastavení → Zařízení a služby → Přidat integraci**, vyhledejte **HA Nav Manager** a potvrďte přidání. Žádná konfigurační pole se nevyplňují.
5. Obnovte prohlížeč nebo znovu otevřete Companion App. Přihlaste se jako správce, otevřete dashboard a v menu horní lišty **⋮** vyberte **HA Nav Manager**.

**Není potřeba upravovat `configuration.yaml`, zdroje dashboardů ani složku `www`.** Integrace sama zpřístupní a globálně načte přibalený JavaScript. HACS ji instaluje jako integraci, takže nepřidává zdroj dashboardu. Projekt není součástí výchozího katalogu HACS.

### Ruční instalace bez HACS

Z tohoto repozitáře zkopírujte celou složku `custom_components/ha_nav_manager` do `/config/custom_components/ha_nav_manager/`, včetně podsložek `frontend` a `translations`. Poté pokračujte kroky 3–5 výše. Samotný JavaScript v kořeni repozitáře není instalací integrace.

### Otevření editoru

Editor má záložky pro horní lištu, boční panel a dashboardy. Změny lišty a sidebaru potvrďte tlačítkem **Uložit**. Vytváření, aktualizace a mazání dashboardů mají vlastní tlačítka. Pokud není dostupné nativní menu, u lišty se zobrazí náhradní tlačítko nastavení.

---

<a id="updates"></a>

## 🔄 Aktualizace souboru

Aktualizujte **HA Nav Manager** v HACS, restartujte Home Assistant a obnovte prohlížeč nebo znovu otevřete Companion App. Uložená nastavení editoru zůstávají zachovaná. Při ruční instalaci před restartem nahraďte celou složku integrace.

Integraci lze vypnout nebo odstranit v **Nastavení → Zařízení a služby**. Poté obnovte všechna otevřená okna HA nebo aplikace, aby přestaly používat již načtený JavaScript. Uživatelská nastavení editoru se tím nemažou.

---

<a id="troubleshooting"></a>

## 🩺 Když se správce nezobrazuje

| Problém | Co zkontrolovat |
| --- | --- |
| Integrace není v seznamu | V HACS byla stažena jako **Integrace** a následoval restart HA. Při ruční instalaci ověřte `/config/custom_components/ha_nav_manager/manifest.json`. |
| Editor chybí | Přidejte **HA Nav Manager** v Zařízení a služby, přihlaste se jako správce, obnovte HA a otevřete dashboard. |
| Zobrazuje se staré rozhraní | Po aktualizaci restartujte HA a použijte **Ctrl+F5** nebo znovu otevřete mobilní aplikaci. |
| Přidání integrace selže | Zkontrolujte protokoly HA pro `ha_nav_manager` a při hlášení chyby uveďte verzi HA. |

---

<a id="storage-languages"></a>

## 🌍 Ukládání a jazyky

Konfigurace se ukládá pro aktuálního uživatele do frontendových uživatelských dat Home Assistantu. Prohlížeč uchovává také záložní kopii v `localStorage`. Pokud je dostupná jen tato záloha, nastavení je omezené na daný prohlížeč. Nastavení editoru nemění oprávnění uživatelů.

Jazyk se přebírá z Home Assistantu. Podporovaných je **28 variant**:

čeština, angličtina, němčina, slovenština, polština, francouzština, španělština, italština, maďarština, nizozemština, portugalština, brazilská portugalština, rumunština, ukrajinština, ruština, turečtina, řečtina, japonština, korejština, zjednodušená čínština, tradiční čínština, vietnamština, thajština, indonéština, malajština, hindština, arabština a hebrejština.

Arabština a hebrejština používají RTL rozložení. Pro nepodporovaný jazyk se použije angličtina. Po změně jazyka znovu otevřete editor.

---

<a id="screenshots"></a>

## 🖼️ Obrázky

Kliknutím otevřete celý obrázek. Prohlížeč jej přizpůsobí oknu; dalším kliknutím zobrazíte původní velikost.

**Horní a boční lišta**

<a href="https://raw.githubusercontent.com/Vachler/HA-Nav-Manager/main/screenshots/toolbar-sidebar.png"><img src="https://raw.githubusercontent.com/Vachler/HA-Nav-Manager/main/screenshots/toolbar-sidebar.png" alt="Horní a boční lišta" width="100%"></a>

<table>
  <tr><th width="50%">Toolbar</th><th width="50%">Nastavení toolbaru</th></tr>
  <tr><td valign="top"><a href="https://raw.githubusercontent.com/Vachler/HA-Nav-Manager/main/screenshots/toolbar.png"><img src="https://raw.githubusercontent.com/Vachler/HA-Nav-Manager/main/screenshots/toolbar.png" alt="Toolbar" width="100%"></a></td><td valign="top"><a href="https://raw.githubusercontent.com/Vachler/HA-Nav-Manager/main/screenshots/toolbar-settings.png"><img src="https://raw.githubusercontent.com/Vachler/HA-Nav-Manager/main/screenshots/toolbar-settings.png" alt="Nastavení toolbaru" width="100%"></a></td></tr>
</table>

<table>
  <tr><th width="50%">Boční panel</th><th width="50%">Dashboardy</th></tr>
  <tr><td valign="top"><a href="https://raw.githubusercontent.com/Vachler/HA-Nav-Manager/main/screenshots/sidebar.png"><img src="https://raw.githubusercontent.com/Vachler/HA-Nav-Manager/main/screenshots/sidebar.png" alt="Boční panel" width="100%"></a></td><td valign="top"><a href="https://raw.githubusercontent.com/Vachler/HA-Nav-Manager/main/screenshots/dashboards.png"><img src="https://raw.githubusercontent.com/Vachler/HA-Nav-Manager/main/screenshots/dashboards.png" alt="Dashboardy" width="100%"></a></td></tr>
</table>

---

<a id="limitations"></a>

## ⚠️ Omezení

- Katalog ikon, vyhledávání a interní texty pickeru poskytuje HA. Názvy ikon a hledané výrazy nejsou překládány tímto projektem. Pokud nativní komponenta ještě není načtená, editor zobrazí upozornění a dočasné textové pole.
- Přizpůsobení vzhledu využívá strukturu nativního frontendu. Změny komponent HA mohou ovlivnit kompatibilitu.
- Při nedostupném uloženém pořadí nelze rekonstruovat pořadí skrytých dashboardů, pokud zdroj změnil jejich pořadí; zachová se dostupný zdroj.
- Úpravy metadat dashboardu nemění jednotlivé Lovelace karty. Smazání dashboardu však odstraní celou jeho konfiguraci.

---

<a id="development"></a>

## 🛠️ Vývoj

Integrace obsahuje `custom_components/ha_nav_manager/frontend/ha-nav-manager.js`. Kořenový JS soubor zůstává pro vývoj a prohlížečové testy; před vydáním synchronizujte obě kopie. Překlady v `translations/` se do něj vkládají příkazem `node scripts/update-translations.cjs`. Regresní testy používají Playwright a modelové komponenty se simulovaným backendem; jejich úspěch není zárukou kompatibility se všemi verzemi HA. [Postup spuštění testů](https://github.com/Vachler/HA-Nav-Manager/blob/main/regression-tests/README.md)

Zobrazení vlastní ikony integrace vyžaduje Home Assistant 2026.3 nebo novější.
