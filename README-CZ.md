<a href="README.md"><img src="https://img.shields.io/badge/🇬🇧%20English-a3e635?style=for-the-badge" alt="English" height="34"></a>
<a href="README-CZ.md"><img src="https://img.shields.io/badge/🇨🇿%20Čeština-2563eb?style=for-the-badge" alt="Čeština" height="34"></a>

# HA Nav Manager


Vizuální správce navigace pro **Home Assistant**. Upravujte horní lištu, boční panel a dashboardy v jednom rozhraní. Po instalaci nastavujete tlačítka, cíle a vzhled přímo v editoru.

**Aktuální verze: 0.8.3** · **28 jazyků** · **Jediný JavaScript soubor**

## Obsah

- [Funkce](#features)
- [Požadavky](#requirements)
- [Instalace](#installation)
- [Aktualizace souboru](#updates)
- [Když se správce nezobrazuje](#troubleshooting)
- [Ukládání a jazyky](#storage-languages)
- [Omezení](#limitations)
- [Vývoj](#development)

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

Home Assistant s přístupem ke konfigurační složce a účet správce pro editor a správu dashboardů.

Instaluje se pouze **[ha-nav-manager.js](ha-nav-manager.js)**. Není potřeba sestavení projektu ani instalace Python integrace.

---

<a id="installation"></a>

## 📦 Instalace

### 1. Nahrajte soubor

Stáhněte `ha-nav-manager.js` tlačítkem **Download raw file** na GitHubu a uložte ho do složky `www` vedle používaného `configuration.yaml`:

```text
/config/www/ha-nav-manager.js
```

Některé editory zobrazují tuto konfigurační složku jako `/homeassistant`. V takovém případě je cesta:

```text
/homeassistant/www/ha-nav-manager.js
```

Pokud složka `www` chybí, vytvořte ji. Soubor musí mít příponu `.js`, nikoli `.js.txt`. Obsah `www` je dostupný přes `/local/`. [Dokumentace HA](https://www.home-assistant.io/integrations/http/#hosting-files)

### 2. Upravte configuration.yaml

Do **existující** sekce `frontend` přidejte modul:

```yaml
frontend:
  extra_module_url:
    - /local/ha-nav-manager.js
```

Pokud už používáte motivy, může sekce vypadat takto:

```yaml
frontend:
  themes: !include_dir_merge_named themes
  extra_module_url:
    - /local/ha-nav-manager.js
```

Řádek `themes` přidávejte jen tehdy, pokud máte odpovídající složku s motivy. Zachovejte ostatní nastavení i moduly a nevytvářejte druhou sekci `frontend`. Je-li sekce načítaná přes `!include`, upravte příslušný zahrnutý soubor.

`extra_module_url` zajistí globální načtení při otevření frontendu. [Dokumentace HA](https://www.home-assistant.io/integrations/frontend/#loading-extra-javascript)

Skript se načítá pouze přes `configuration.yaml`. Do zdrojů dashboardů jej nepřidávejte. Pokud tam už jeho registraci máte, odeberte pouze tento záznam; soubor ve `www` a zápis v YAML ponechte.

### 3. Restartujte Home Assistant

Uložte YAML a zkontrolujte konfiguraci. V **Nastavení → Systém** otevřete nabídku restartování a zvolte **Restartovat Home Assistant**.

**Je nutný restart služby Home Assistant. Zavření okna prohlížeče, obnovení stránky ani samotné načtení motivů změnu neaktivuje. Restart celého hostitelského počítače není potřeba.**

Po dokončení restartu obnovte stránku pomocí **Ctrl+F5**, případně znovu načtěte frontend v Companion App.

### 4. Otevřete editor

Přihlaste se jako správce a otevřete dashboard. V menu horní lišty **⋮** vyberte **HA Nav Manager**. Pokud nativní menu není dostupné, správce používá náhradní tlačítko nastavení u lišty.

Editor má záložky pro horní lištu, boční panel a dashboardy. Změny tlačítek a sidebaru potvrďte tlačítkem **Uložit**. Vytvoření, aktualizace a smazání dashboardu se provedou samostatnými tlačítky přímo v jeho formuláři.

---

<a id="updates"></a>

## 🔄 Aktualizace souboru

1. Stáhněte aktuální `ha-nav-manager.js` a nahraďte jím soubor ve složce `www`.
2. Zachovejte stejný název souboru. Odkaz `/local/ha-nav-manager.js` v `configuration.yaml` pod `frontend` → `extra_module_url` pak nemusíte měnit.
3. V prohlížeči obnovte stránku Home Assistantu klávesou **F5**. Na mobilním telefonu ukončete aplikaci Home Assistant a znovu ji otevřete.

Při pouhé výměně JS souboru není potřeba restartovat Home Assistant. Pokud změníte název souboru nebo jeho cestu, upravte také odkaz v `configuration.yaml` a restartujte službu Home Assistant. Nastavení správce zůstává zachované.

---

<a id="troubleshooting"></a>

## 🩺 Když se správce nezobrazuje

1. V editoru souborů otevřete používaný `configuration.yaml` (například `/homeassistant/configuration.yaml`). V sekci `frontend` → `extra_module_url` zkontrolujte odkaz `/local/ha-nav-manager.js`. Název musí přesně odpovídat souboru `ha-nav-manager.js` ve složce `www`, včetně velikosti písmen.
2. Do adresního řádku prohlížeče zadejte adresu svého HA a připojte `/local/ha-nav-manager.js`, například `http://193.165.1.10:8123/local/ha-nav-manager.js`. Použijte svůj protokol, adresu a port. Musí se zobrazit JavaScript, nikoli chyba 404 nebo stránka GitHubu.
3. Po změně YAML restartujte **službu Home Assistant**.
4. **Počítač – načtení bez mezipaměti (Chrome/Edge):** na stránce HA stiskněte **F12**, otevřete kartu **Network (Síť)**, zaškrtněte **Disable cache (Zakázat mezipaměť)** a stiskněte **Ctrl+Shift+R**. Vývojářské nástroje během obnovení ponechte otevřené. Tento postup obejde mezipaměť při načítání stránky; nemaže všechna uložená data prohlížeče.
5. **Telefon s Androidem:** ukončete aplikaci Home Assistant. V nastavení telefonu otevřete **Aplikace → Home Assistant → Informace o aplikaci → Úložiště → Vymazat mezipaměť** a aplikaci znovu spusťte. Názvy položek se mohou podle telefonu lišit. Vyberte **mezipaměť (cache)**, nikoli **Vymazat data / Vymazat úložiště**, které resetuje data aplikace. Tento postup se týká Androidu, nikoli iPhonu.

---

<a id="storage-languages"></a>

## 🌍 Ukládání a jazyky

Konfigurace se ukládá pro aktuálního uživatele do frontendových uživatelských dat Home Assistantu. Prohlížeč uchovává také záložní kopii v `localStorage`. Pokud je dostupná jen tato záloha, nastavení je omezené na daný prohlížeč. Nastavení editoru nemění oprávnění uživatelů.

Jazyk se přebírá z Home Assistantu. Podporovaných je **28 variant**:

čeština, angličtina, němčina, slovenština, polština, francouzština, španělština, italština, maďarština, nizozemština, portugalština, brazilská portugalština, rumunština, ukrajinština, ruština, turečtina, řečtina, japonština, korejština, zjednodušená čínština, tradiční čínština, vietnamština, thajština, indonéština, malajština, hindština, arabština a hebrejština.

Arabština a hebrejština používají RTL rozložení. Pro nepodporovaný jazyk se použije angličtina. Po změně jazyka znovu otevřete editor.

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

Distribuce je jediný JS soubor. Překlady v `translations/` se do něj vkládají příkazem `node scripts/update-translations.cjs`. Regresní testy používají Playwright a modelové komponenty se simulovaným backendem; jejich úspěch není zárukou kompatibility se všemi verzemi HA. [Postup spuštění testů](regression-tests/README.md)
