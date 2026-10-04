
/*
 * HA Nav Manager for Home Assistant
 * Lifecycle-driven runtime 0.9.1
 * Visual editor for the native Home Assistant toolbar, sidebar and dashboards.
 *
 * Configuration is stored per HA user through frontend user_data when available.
 * If that API is unavailable, localStorage is used as a fallback.
 */
(() => {
  "use strict";

  const VERSION = "0.9.1";
  if (window.toolbarManager?.version) {
    console.warn("[HA Nav Manager] Resource already loaded; keep only one resource entry.");
    return;
  }
  const TRANSLATIONS = {"en":{"title":"HA Nav Manager","close":"Close","save":"Save","saved":"Saved.","saving":"Saving…","intro":"Buttons are shown directly in the native Home Assistant toolbar. Devices, dashboards and applications with a web interface can be selected from a list — no URL typing is required.","placement":"Custom button placement","place_after_title":"Left – next to page title","place_replace_title":"Left – instead of page title","place_before_actions":"Right – before system icons","place_inside_actions":"Right – among system icons","hide_title":"Hide page title (e.g. Overview / Home)","no_buttons":"You do not have any custom buttons yet.","add_button":"+ Add button","delete_all":"Delete all buttons","confirm_delete_all":"Really remove all custom buttons?","new_button":"New button","edit":"Edit","hide":"Hide","remove":"Remove","up":"Up","down":"Down","name":"Name","icon":"Icon","target_type":"Target type","display_style":"Display style","target":"Target","search_list":"Search the list…","search_inside":"Search inside selection…","select":"Select…","nothing_found":"Nothing found","entity":"Entity","device":"Device","addon":"Application / add-on","dashboard":"Dashboard","settings":"Settings","custom_url":"Custom URL","icon_only":"Icon only","icon_text":"Icon + text","text_only":"Text only","compact":"Compact","wide":"Wide","icon_text_color":"Icon / text color","theme_default":"Theme default","custom_color":"Custom color","background":"Button background","bg_none":"No background","bg_theme":"Theme color","bg_custom":"Custom color","opacity":"Transparency","opacity_hint":"0% = invisible background, 100% = solid background","url":"URL","load_error":"Error while saving: ","manager":"HA Nav Manager","settings_devices_services":"Devices & services","settings_devices":"Devices","settings_entities":"Entities","settings_automations":"Automations","settings_helpers":"Helpers","settings_dashboards":"Dashboards","settings_apps":"Applications / add-ons","overview":"Overview"},"cs":{"title":"HA Nav Manager","close":"Zavřít","save":"Uložit","saved":"Uloženo.","saving":"Ukládám…","intro":"Tlačítka se zobrazují přímo v nativní horní liště Home Assistantu. Zařízení, dashboardy a aplikace s webovým rozhraním vybíráš ze seznamu — není nutné psát jejich URL.","placement":"Umístění vlastních tlačítek","place_after_title":"Vlevo – vedle názvu stránky","place_replace_title":"Vlevo – místo názvu stránky","place_before_actions":"Vpravo – před systémovými ikonami","place_inside_actions":"Vpravo – mezi systémovými ikonami","hide_title":"Skrýt název stránky (např. Přehled / Home)","no_buttons":"Zatím nemáš žádné vlastní tlačítko.","add_button":"+ Přidat tlačítko","delete_all":"Smazat všechna tlačítka","confirm_delete_all":"Opravdu odstranit všechna vlastní tlačítka?","new_button":"Nové tlačítko","edit":"Upravit","hide":"Skrýt","remove":"Odstranit","up":"Nahoru","down":"Dolů","name":"Název","icon":"Ikona","target_type":"Typ cíle","display_style":"Styl zobrazení","target":"Cíl","search_list":"Hledat v seznamu…","search_inside":"Hledat přímo ve výběru…","select":"Vyber…","nothing_found":"Nic nenalezeno","entity":"Entita","device":"Zařízení","addon":"Aplikace / add-on","dashboard":"Dashboard","settings":"Nastavení","custom_url":"Vlastní URL","icon_only":"Jen ikona","icon_text":"Ikona + text","text_only":"Jen text","compact":"Kompaktní","wide":"Široké tlačítko","icon_text_color":"Barva ikony / textu","theme_default":"Výchozí barva motivu","custom_color":"Vlastní barva","background":"Pozadí tlačítka","bg_none":"Bez pozadí","bg_theme":"Barva motivu","bg_custom":"Vlastní barva","opacity":"Průhlednost","opacity_hint":"0 % = neviditelné pozadí, 100 % = plné pozadí","url":"URL","load_error":"Chyba při ukládání: ","manager":"HA Nav Manager","settings_devices_services":"Zařízení a služby","settings_devices":"Zařízení","settings_entities":"Entity","settings_automations":"Automatizace","settings_helpers":"Pomocníci","settings_dashboards":"Dashboardy","settings_apps":"Aplikace / doplňky","overview":"Přehled"},"de":{"title":"HA Nav Manager","close":"Schließen","save":"Speichern","saved":"Gespeichert.","saving":"Speichern…","intro":"Schaltflächen werden direkt in der nativen Home-Assistant-Symbolleiste angezeigt. Geräte, Dashboards und Anwendungen mit Weboberfläche können aus einer Liste ausgewählt werden — URLs müssen nicht eingegeben werden.","placement":"Position eigener Schaltflächen","place_after_title":"Links – neben dem Seitentitel","place_replace_title":"Links – anstelle des Seitentitels","place_before_actions":"Rechts – vor den Systemsymbolen","place_inside_actions":"Rechts – zwischen den Systemsymbolen","hide_title":"Seitentitel ausblenden (z. B. Übersicht / Home)","no_buttons":"Noch keine eigenen Schaltflächen vorhanden.","add_button":"+ Schaltfläche hinzufügen","delete_all":"Alle Schaltflächen löschen","confirm_delete_all":"Wirklich alle eigenen Schaltflächen entfernen?","new_button":"Neue Schaltfläche","edit":"Bearbeiten","hide":"Ausblenden","remove":"Entfernen","up":"Nach oben","down":"Nach unten","name":"Name","icon":"Symbol","target_type":"Zieltyp","display_style":"Anzeigestil","target":"Ziel","search_list":"Liste durchsuchen…","search_inside":"In der Auswahl suchen…","select":"Auswählen…","nothing_found":"Nichts gefunden","entity":"Entität","device":"Gerät","addon":"Anwendung / Add-on","dashboard":"Dashboard","settings":"Einstellungen","custom_url":"Eigene URL","icon_only":"Nur Symbol","icon_text":"Symbol + Text","text_only":"Nur Text","compact":"Kompakt","wide":"Breit","icon_text_color":"Symbol-/Textfarbe","theme_default":"Standard des Themes","custom_color":"Eigene Farbe","background":"Schaltflächenhintergrund","bg_none":"Kein Hintergrund","bg_theme":"Theme-Farbe","bg_custom":"Eigene Farbe","opacity":"Transparenz","opacity_hint":"0 % = unsichtbarer Hintergrund, 100 % = deckender Hintergrund","url":"URL","load_error":"Fehler beim Speichern: ","manager":"HA Nav Manager","settings_devices_services":"Geräte & Dienste","settings_devices":"Geräte","settings_entities":"Entitäten","settings_automations":"Automatisierungen","settings_helpers":"Helfer","settings_dashboards":"Dashboards","settings_apps":"Anwendungen / Add-ons","overview":"Übersicht"},"sk":{"title":"HA Nav Manager","close":"Zavrieť","save":"Uložiť","saved":"Uložené.","saving":"Ukladám…","intro":"Tlačidlá sa zobrazujú priamo v natívnej hornej lište Home Assistantu. Zariadenia, dashboardy a aplikácie s webovým rozhraním vyberáš zo zoznamu — URL netreba písať.","placement":"Umiestnenie vlastných tlačidiel","place_after_title":"Vľavo – vedľa názvu stránky","place_replace_title":"Vľavo – namiesto názvu stránky","place_before_actions":"Vpravo – pred systémovými ikonami","place_inside_actions":"Vpravo – medzi systémovými ikonami","hide_title":"Skryť názov stránky (napr. Prehľad / Home)","no_buttons":"Zatiaľ nemáš žiadne vlastné tlačidlo.","add_button":"+ Pridať tlačidlo","delete_all":"Zmazať všetky tlačidlá","confirm_delete_all":"Naozaj odstrániť všetky vlastné tlačidlá?","new_button":"Nové tlačidlo","edit":"Upraviť","hide":"Skryť","remove":"Odstrániť","up":"Nahor","down":"Nadol","name":"Názov","icon":"Ikona","target_type":"Typ cieľa","display_style":"Štýl zobrazenia","target":"Cieľ","search_list":"Hľadať v zozname…","search_inside":"Hľadať priamo vo výbere…","select":"Vybrať…","nothing_found":"Nič sa nenašlo","entity":"Entita","device":"Zariadenie","addon":"Aplikácia / add-on","dashboard":"Dashboard","settings":"Nastavenia","custom_url":"Vlastná URL","icon_only":"Len ikona","icon_text":"Ikona + text","text_only":"Len text","compact":"Kompaktné","wide":"Široké","icon_text_color":"Farba ikony / textu","theme_default":"Predvolená farba motívu","custom_color":"Vlastná farba","background":"Pozadie tlačidla","bg_none":"Bez pozadia","bg_theme":"Farba motívu","bg_custom":"Vlastná farba","opacity":"Priehľadnosť","opacity_hint":"0 % = neviditeľné pozadie, 100 % = plné pozadie","url":"URL","load_error":"Chyba pri ukladaní: ","manager":"HA Nav Manager","settings_devices_services":"Zariadenia a služby","settings_devices":"Zariadenia","settings_entities":"Entity","settings_automations":"Automatizácie","settings_helpers":"Pomocníci","settings_dashboards":"Dashboardy","settings_apps":"Aplikácie / doplnky","overview":"Prehľad"},"pl":{"title":"HA Nav Manager","close":"Zamknij","save":"Zapisz","saved":"Zapisano.","saving":"Zapisywanie…","intro":"Przyciski są wyświetlane bezpośrednio na natywnym pasku narzędzi Home Assistant. Urządzenia, pulpity i aplikacje z interfejsem WWW można wybrać z listy — bez wpisywania adresów URL.","placement":"Położenie własnych przycisków","place_after_title":"Po lewej – obok tytułu strony","place_replace_title":"Po lewej – zamiast tytułu strony","place_before_actions":"Po prawej – przed ikonami systemowymi","place_inside_actions":"Po prawej – między ikonami systemowymi","hide_title":"Ukryj tytuł strony (np. Przegląd / Home)","no_buttons":"Nie masz jeszcze własnych przycisków.","add_button":"+ Dodaj przycisk","delete_all":"Usuń wszystkie przyciski","confirm_delete_all":"Na pewno usunąć wszystkie własne przyciski?","new_button":"Nowy przycisk","edit":"Edytuj","hide":"Ukryj","remove":"Usuń","up":"W górę","down":"W dół","name":"Nazwa","icon":"Ikona","target_type":"Typ celu","display_style":"Styl wyświetlania","target":"Cel","search_list":"Szukaj na liście…","search_inside":"Szukaj w wyborze…","select":"Wybierz…","nothing_found":"Nic nie znaleziono","entity":"Encja","device":"Urządzenie","addon":"Aplikacja / dodatek","dashboard":"Pulpit","settings":"Ustawienia","custom_url":"Własny URL","icon_only":"Tylko ikona","icon_text":"Ikona + tekst","text_only":"Tylko tekst","compact":"Kompaktowy","wide":"Szeroki","icon_text_color":"Kolor ikony / tekstu","theme_default":"Domyślny kolor motywu","custom_color":"Własny kolor","background":"Tło przycisku","bg_none":"Bez tła","bg_theme":"Kolor motywu","bg_custom":"Własny kolor","opacity":"Przezroczystość","opacity_hint":"0% = niewidoczne tło, 100% = pełne tło","url":"URL","load_error":"Błąd zapisu: ","manager":"HA Nav Manager","settings_devices_services":"Urządzenia i usługi","settings_devices":"Urządzenia","settings_entities":"Encje","settings_automations":"Automatyzacje","settings_helpers":"Pomocnicy","settings_dashboards":"Pulpity","settings_apps":"Aplikacje / dodatki","overview":"Przegląd"},"fr":{"title":"HA Nav Manager","close":"Fermer","save":"Enregistrer","saved":"Enregistré.","saving":"Enregistrement…","intro":"Les boutons s’affichent directement dans la barre d’outils native de Home Assistant. Les appareils, tableaux de bord et applications avec interface Web peuvent être choisis dans une liste — aucune URL à saisir.","placement":"Position des boutons personnalisés","place_after_title":"À gauche – à côté du titre de la page","place_replace_title":"À gauche – à la place du titre de la page","place_before_actions":"À droite – avant les icônes système","place_inside_actions":"À droite – parmi les icônes système","hide_title":"Masquer le titre de la page (ex. Vue d’ensemble / Home)","no_buttons":"Vous n’avez encore aucun bouton personnalisé.","add_button":"+ Ajouter un bouton","delete_all":"Supprimer tous les boutons","confirm_delete_all":"Supprimer vraiment tous les boutons personnalisés ?","new_button":"Nouveau bouton","edit":"Modifier","hide":"Masquer","remove":"Supprimer","up":"Monter","down":"Descendre","name":"Nom","icon":"Icône","target_type":"Type de cible","display_style":"Style d’affichage","target":"Cible","search_list":"Rechercher dans la liste…","search_inside":"Rechercher dans la sélection…","select":"Sélectionner…","nothing_found":"Aucun résultat","entity":"Entité","device":"Appareil","addon":"Application / module","dashboard":"Tableau de bord","settings":"Paramètres","custom_url":"URL personnalisée","icon_only":"Icône uniquement","icon_text":"Icône + texte","text_only":"Texte uniquement","compact":"Compact","wide":"Large","icon_text_color":"Couleur icône / texte","theme_default":"Couleur du thème","custom_color":"Couleur personnalisée","background":"Arrière-plan du bouton","bg_none":"Sans arrière-plan","bg_theme":"Couleur du thème","bg_custom":"Couleur personnalisée","opacity":"Transparence","opacity_hint":"0 % = arrière-plan invisible, 100 % = arrière-plan opaque","url":"URL","load_error":"Erreur lors de l’enregistrement : ","manager":"HA Nav Manager","settings_devices_services":"Appareils et services","settings_devices":"Appareils","settings_entities":"Entités","settings_automations":"Automatisations","settings_helpers":"Assistants","settings_dashboards":"Tableaux de bord","settings_apps":"Applications / modules","overview":"Vue d’ensemble"},"es":{"title":"HA Nav Manager","close":"Cerrar","save":"Guardar","saved":"Guardado.","saving":"Guardando…","intro":"Los botones se muestran directamente en la barra nativa de Home Assistant. Los dispositivos, paneles y aplicaciones con interfaz web se pueden elegir de una lista, sin escribir URLs.","placement":"Ubicación de botones personalizados","place_after_title":"Izquierda – junto al título","place_replace_title":"Izquierda – en lugar del título","place_before_actions":"Derecha – antes de los iconos del sistema","place_inside_actions":"Derecha – entre los iconos del sistema","hide_title":"Ocultar título de la página (p. ej. Resumen / Home)","no_buttons":"Aún no tienes botones personalizados.","add_button":"+ Añadir botón","delete_all":"Eliminar todos los botones","confirm_delete_all":"¿Eliminar realmente todos los botones personalizados?","new_button":"Nuevo botón","edit":"Editar","hide":"Ocultar","remove":"Eliminar","up":"Subir","down":"Bajar","name":"Nombre","icon":"Icono","target_type":"Tipo de destino","display_style":"Estilo de visualización","target":"Destino","search_list":"Buscar en la lista…","search_inside":"Buscar dentro de la selección…","select":"Seleccionar…","nothing_found":"No se encontró nada","entity":"Entidad","device":"Dispositivo","addon":"Aplicación / add-on","dashboard":"Panel","settings":"Ajustes","custom_url":"URL personalizada","icon_only":"Solo icono","icon_text":"Icono + texto","text_only":"Solo texto","compact":"Compacto","wide":"Ancho","icon_text_color":"Color de icono / texto","theme_default":"Color del tema","custom_color":"Color personalizado","background":"Fondo del botón","bg_none":"Sin fondo","bg_theme":"Color del tema","bg_custom":"Color personalizado","opacity":"Transparencia","opacity_hint":"0 % = fondo invisible, 100 % = fondo sólido","url":"URL","load_error":"Error al guardar: ","manager":"HA Nav Manager","settings_devices_services":"Dispositivos y servicios","settings_devices":"Dispositivos","settings_entities":"Entidades","settings_automations":"Automatizaciones","settings_helpers":"Ayudantes","settings_dashboards":"Paneles","settings_apps":"Aplicaciones / add-ons","overview":"Resumen"},"it":{"title":"HA Nav Manager","close":"Chiudi","save":"Salva","saved":"Salvato.","saving":"Salvataggio…","intro":"I pulsanti vengono mostrati direttamente nella barra nativa di Home Assistant. Dispositivi, dashboard e applicazioni con interfaccia web possono essere scelti da un elenco, senza digitare URL.","placement":"Posizione dei pulsanti personalizzati","place_after_title":"Sinistra – accanto al titolo","place_replace_title":"Sinistra – al posto del titolo","place_before_actions":"Destra – prima delle icone di sistema","place_inside_actions":"Destra – tra le icone di sistema","hide_title":"Nascondi titolo pagina (es. Panoramica / Home)","no_buttons":"Non hai ancora pulsanti personalizzati.","add_button":"+ Aggiungi pulsante","delete_all":"Elimina tutti i pulsanti","confirm_delete_all":"Eliminare davvero tutti i pulsanti personalizzati?","new_button":"Nuovo pulsante","edit":"Modifica","hide":"Nascondi","remove":"Rimuovi","up":"Su","down":"Giù","name":"Nome","icon":"Icona","target_type":"Tipo destinazione","display_style":"Stile di visualizzazione","target":"Destinazione","search_list":"Cerca nell’elenco…","search_inside":"Cerca nella selezione…","select":"Seleziona…","nothing_found":"Nessun risultato","entity":"Entità","device":"Dispositivo","addon":"Applicazione / add-on","dashboard":"Dashboard","settings":"Impostazioni","custom_url":"URL personalizzato","icon_only":"Solo icona","icon_text":"Icona + testo","text_only":"Solo testo","compact":"Compatto","wide":"Largo","icon_text_color":"Colore icona / testo","theme_default":"Colore tema","custom_color":"Colore personalizzato","background":"Sfondo pulsante","bg_none":"Nessuno sfondo","bg_theme":"Colore tema","bg_custom":"Colore personalizzato","opacity":"Trasparenza","opacity_hint":"0% = sfondo invisibile, 100% = sfondo pieno","url":"URL","load_error":"Errore durante il salvataggio: ","manager":"HA Nav Manager","settings_devices_services":"Dispositivi e servizi","settings_devices":"Dispositivi","settings_entities":"Entità","settings_automations":"Automazioni","settings_helpers":"Helper","settings_dashboards":"Dashboard","settings_apps":"Applicazioni / add-on","overview":"Panoramica"},"hu":{"title":"HA Nav Manager","close":"Bezárás","save":"Mentés","saved":"Mentve.","saving":"Mentés…","intro":"A gombok közvetlenül a Home Assistant natív eszköztárában jelennek meg. Az eszközök, irányítópultok és webes felülettel rendelkező alkalmazások listából választhatók — URL beírása nélkül.","placement":"Egyéni gombok helye","place_after_title":"Balra – az oldal címe mellett","place_replace_title":"Balra – az oldal címe helyett","place_before_actions":"Jobbra – a rendszerikonok előtt","place_inside_actions":"Jobbra – a rendszerikonok között","hide_title":"Oldalcím elrejtése (pl. Áttekintés / Home)","no_buttons":"Még nincsenek egyéni gombok.","add_button":"+ Gomb hozzáadása","delete_all":"Összes gomb törlése","confirm_delete_all":"Biztosan törlöd az összes egyéni gombot?","new_button":"Új gomb","edit":"Szerkesztés","hide":"Elrejtés","remove":"Eltávolítás","up":"Fel","down":"Le","name":"Név","icon":"Ikon","target_type":"Cél típusa","display_style":"Megjelenési stílus","target":"Cél","search_list":"Keresés a listában…","search_inside":"Keresés a kiválasztásban…","select":"Válassz…","nothing_found":"Nincs találat","entity":"Entitás","device":"Eszköz","addon":"Alkalmazás / add-on","dashboard":"Irányítópult","settings":"Beállítások","custom_url":"Egyéni URL","icon_only":"Csak ikon","icon_text":"Ikon + szöveg","text_only":"Csak szöveg","compact":"Kompakt","wide":"Széles","icon_text_color":"Ikon / szöveg színe","theme_default":"Téma alapértelmezett","custom_color":"Egyéni szín","background":"Gomb háttere","bg_none":"Nincs háttér","bg_theme":"Téma színe","bg_custom":"Egyéni szín","opacity":"Átlátszóság","opacity_hint":"0% = láthatatlan háttér, 100% = tömör háttér","url":"URL","load_error":"Mentési hiba: ","manager":"HA Nav Manager","settings_devices_services":"Eszközök és szolgáltatások","settings_devices":"Eszközök","settings_entities":"Entitások","settings_automations":"Automatizálások","settings_helpers":"Segédek","settings_dashboards":"Irányítópultok","settings_apps":"Alkalmazások / add-onok","overview":"Áttekintés"},"nl":{"title":"HA Nav Manager","close":"Sluiten","save":"Opslaan","saved":"Opgeslagen.","saving":"Opslaan…","intro":"Knoppen worden rechtstreeks in de native Home Assistant-werkbalk weergegeven. Apparaten, dashboards en toepassingen met webinterface kunnen uit een lijst worden gekozen — URL’s typen is niet nodig.","placement":"Plaatsing aangepaste knoppen","place_after_title":"Links – naast paginatitel","place_replace_title":"Links – in plaats van paginatitel","place_before_actions":"Rechts – vóór systeemiconen","place_inside_actions":"Rechts – tussen systeemiconen","hide_title":"Paginatitel verbergen (bijv. Overzicht / Home)","no_buttons":"Je hebt nog geen aangepaste knoppen.","add_button":"+ Knop toevoegen","delete_all":"Alle knoppen verwijderen","confirm_delete_all":"Alle aangepaste knoppen echt verwijderen?","new_button":"Nieuwe knop","edit":"Bewerken","hide":"Verbergen","remove":"Verwijderen","up":"Omhoog","down":"Omlaag","name":"Naam","icon":"Icoon","target_type":"Doeltype","display_style":"Weergavestijl","target":"Doel","search_list":"Zoeken in lijst…","search_inside":"Zoeken in selectie…","select":"Selecteren…","nothing_found":"Niets gevonden","entity":"Entiteit","device":"Apparaat","addon":"Toepassing / add-on","dashboard":"Dashboard","settings":"Instellingen","custom_url":"Aangepaste URL","icon_only":"Alleen icoon","icon_text":"Icoon + tekst","text_only":"Alleen tekst","compact":"Compact","wide":"Breed","icon_text_color":"Icoon-/tekstkleur","theme_default":"Standaard themakleur","custom_color":"Aangepaste kleur","background":"Knopachtergrond","bg_none":"Geen achtergrond","bg_theme":"Themakleur","bg_custom":"Aangepaste kleur","opacity":"Transparantie","opacity_hint":"0% = onzichtbare achtergrond, 100% = volle achtergrond","url":"URL","load_error":"Fout bij opslaan: ","manager":"HA Nav Manager","settings_devices_services":"Apparaten & diensten","settings_devices":"Apparaten","settings_entities":"Entiteiten","settings_automations":"Automatiseringen","settings_helpers":"Helpers","settings_dashboards":"Dashboards","settings_apps":"Toepassingen / add-ons","overview":"Overzicht"},"pt":{"title":"HA Nav Manager","close":"Fechar","save":"Guardar","saved":"Guardado.","saving":"A guardar…","intro":"Os botões aparecem diretamente na barra nativa do Home Assistant. Dispositivos, painéis e aplicações com interface Web podem ser escolhidos numa lista — sem escrever URLs.","placement":"Posição dos botões personalizados","place_after_title":"Esquerda – ao lado do título","place_replace_title":"Esquerda – em vez do título","place_before_actions":"Direita – antes dos ícones do sistema","place_inside_actions":"Direita – entre os ícones do sistema","hide_title":"Ocultar título da página (ex. Visão geral / Home)","no_buttons":"Ainda não existem botões personalizados.","add_button":"+ Adicionar botão","delete_all":"Eliminar todos os botões","confirm_delete_all":"Remover realmente todos os botões personalizados?","new_button":"Novo botão","edit":"Editar","hide":"Ocultar","remove":"Remover","up":"Subir","down":"Descer","name":"Nome","icon":"Ícone","target_type":"Tipo de destino","display_style":"Estilo de apresentação","target":"Destino","search_list":"Pesquisar na lista…","search_inside":"Pesquisar na seleção…","select":"Selecionar…","nothing_found":"Nada encontrado","entity":"Entidade","device":"Dispositivo","addon":"Aplicação / add-on","dashboard":"Painel","settings":"Definições","custom_url":"URL personalizado","icon_only":"Só ícone","icon_text":"Ícone + texto","text_only":"Só texto","compact":"Compacto","wide":"Largo","icon_text_color":"Cor do ícone / texto","theme_default":"Cor predefinida do tema","custom_color":"Cor personalizada","background":"Fundo do botão","bg_none":"Sem fundo","bg_theme":"Cor do tema","bg_custom":"Cor personalizada","opacity":"Transparência","opacity_hint":"0% = fundo invisível, 100% = fundo sólido","url":"URL","load_error":"Erro ao guardar: ","manager":"HA Nav Manager","settings_devices_services":"Dispositivos e serviços","settings_devices":"Dispositivos","settings_entities":"Entidades","settings_automations":"Automações","settings_helpers":"Ajudantes","settings_dashboards":"Painéis","settings_apps":"Aplicações / add-ons","overview":"Visão geral"},"pt-BR":{"title":"HA Nav Manager","close":"Fechar","save":"Salvar","saved":"Salvo.","saving":"Salvando…","intro":"Os botões aparecem diretamente na barra nativa do Home Assistant. Dispositivos, painéis e aplicativos com interface web podem ser escolhidos em uma lista — sem digitar URLs.","placement":"Posição dos botões personalizados","place_after_title":"Esquerda – ao lado do título","place_replace_title":"Esquerda – no lugar do título","place_before_actions":"Direita – antes dos ícones do sistema","place_inside_actions":"Direita – entre os ícones do sistema","hide_title":"Ocultar título da página (ex.: Visão geral / Home)","no_buttons":"Você ainda não tem botões personalizados.","add_button":"+ Adicionar botão","delete_all":"Excluir todos os botões","confirm_delete_all":"Remover todos os botões personalizados?","new_button":"Novo botão","edit":"Editar","hide":"Ocultar","remove":"Remover","up":"Subir","down":"Descer","name":"Nome","icon":"Ícone","target_type":"Tipo de destino","display_style":"Estilo de exibição","target":"Destino","search_list":"Pesquisar na lista…","search_inside":"Pesquisar na seleção…","select":"Selecionar…","nothing_found":"Nada encontrado","entity":"Entidade","device":"Dispositivo","addon":"Aplicativo / add-on","dashboard":"Painel","settings":"Configurações","custom_url":"URL personalizada","icon_only":"Só ícone","icon_text":"Ícone + texto","text_only":"Só texto","compact":"Compacto","wide":"Largo","icon_text_color":"Cor do ícone / texto","theme_default":"Cor padrão do tema","custom_color":"Cor personalizada","background":"Fundo do botão","bg_none":"Sem fundo","bg_theme":"Cor do tema","bg_custom":"Cor personalizada","opacity":"Transparência","opacity_hint":"0% = fundo invisível, 100% = fundo sólido","url":"URL","load_error":"Erro ao salvar: ","manager":"HA Nav Manager","settings_devices_services":"Dispositivos e serviços","settings_devices":"Dispositivos","settings_entities":"Entidades","settings_automations":"Automações","settings_helpers":"Ajudantes","settings_dashboards":"Painéis","settings_apps":"Aplicativos / add-ons","overview":"Visão geral"},"ro":{"title":"HA Nav Manager","close":"Închide","save":"Salvează","saved":"Salvat.","saving":"Se salvează…","intro":"Butoanele sunt afișate direct în bara nativă Home Assistant. Dispozitivele, tablourile de bord și aplicațiile cu interfață web pot fi selectate dintr-o listă — fără introducerea URL-urilor.","placement":"Poziția butoanelor personalizate","place_after_title":"Stânga – lângă titlul paginii","place_replace_title":"Stânga – în locul titlului","place_before_actions":"Dreapta – înaintea pictogramelor de sistem","place_inside_actions":"Dreapta – între pictogramele de sistem","hide_title":"Ascunde titlul paginii (ex. Prezentare generală / Home)","no_buttons":"Nu ai încă butoane personalizate.","add_button":"+ Adaugă buton","delete_all":"Șterge toate butoanele","confirm_delete_all":"Ștergi toate butoanele personalizate?","new_button":"Buton nou","edit":"Editează","hide":"Ascunde","remove":"Elimină","up":"Sus","down":"Jos","name":"Nume","icon":"Pictogramă","target_type":"Tip țintă","display_style":"Stil afișare","target":"Țintă","search_list":"Caută în listă…","search_inside":"Caută în selecție…","select":"Selectează…","nothing_found":"Nimic găsit","entity":"Entitate","device":"Dispozitiv","addon":"Aplicație / add-on","dashboard":"Tablou de bord","settings":"Setări","custom_url":"URL personalizat","icon_only":"Doar pictogramă","icon_text":"Pictogramă + text","text_only":"Doar text","compact":"Compact","wide":"Lat","icon_text_color":"Culoare pictogramă / text","theme_default":"Culoarea temei","custom_color":"Culoare personalizată","background":"Fundal buton","bg_none":"Fără fundal","bg_theme":"Culoarea temei","bg_custom":"Culoare personalizată","opacity":"Transparență","opacity_hint":"0% = fundal invizibil, 100% = fundal opac","url":"URL","load_error":"Eroare la salvare: ","manager":"HA Nav Manager","settings_devices_services":"Dispozitive și servicii","settings_devices":"Dispozitive","settings_entities":"Entități","settings_automations":"Automatizări","settings_helpers":"Ajutoare","settings_dashboards":"Tablouri de bord","settings_apps":"Aplicații / add-on-uri","overview":"Prezentare generală"},"uk":{"title":"HA Nav Manager","close":"Закрити","save":"Зберегти","saved":"Збережено.","saving":"Збереження…","intro":"Кнопки відображаються безпосередньо на стандартній панелі Home Assistant. Пристрої, панелі та застосунки з веб-інтерфейсом можна вибрати зі списку — без введення URL.","placement":"Розміщення власних кнопок","place_after_title":"Ліворуч – поруч із назвою сторінки","place_replace_title":"Ліворуч – замість назви сторінки","place_before_actions":"Праворуч – перед системними іконками","place_inside_actions":"Праворуч – серед системних іконок","hide_title":"Приховати назву сторінки (напр. Огляд / Home)","no_buttons":"Власних кнопок ще немає.","add_button":"+ Додати кнопку","delete_all":"Видалити всі кнопки","confirm_delete_all":"Справді видалити всі власні кнопки?","new_button":"Нова кнопка","edit":"Редагувати","hide":"Приховати","remove":"Видалити","up":"Вгору","down":"Вниз","name":"Назва","icon":"Іконка","target_type":"Тип цілі","display_style":"Стиль відображення","target":"Ціль","search_list":"Пошук у списку…","search_inside":"Пошук у виборі…","select":"Вибрати…","nothing_found":"Нічого не знайдено","entity":"Сутність","device":"Пристрій","addon":"Застосунок / add-on","dashboard":"Панель","settings":"Налаштування","custom_url":"Власний URL","icon_only":"Лише іконка","icon_text":"Іконка + текст","text_only":"Лише текст","compact":"Компактно","wide":"Широко","icon_text_color":"Колір іконки / тексту","theme_default":"Колір теми","custom_color":"Власний колір","background":"Фон кнопки","bg_none":"Без фону","bg_theme":"Колір теми","bg_custom":"Власний колір","opacity":"Прозорість","opacity_hint":"0% = невидимий фон, 100% = суцільний фон","url":"URL","load_error":"Помилка збереження: ","manager":"HA Nav Manager","settings_devices_services":"Пристрої та служби","settings_devices":"Пристрої","settings_entities":"Сутності","settings_automations":"Автоматизації","settings_helpers":"Помічники","settings_dashboards":"Панелі","settings_apps":"Застосунки / add-on","overview":"Огляд"},"ru":{"title":"HA Nav Manager","close":"Закрыть","save":"Сохранить","saved":"Сохранено.","saving":"Сохранение…","intro":"Кнопки отображаются прямо на стандартной панели Home Assistant. Устройства, панели и приложения с веб-интерфейсом можно выбирать из списка — вводить URL не нужно.","placement":"Расположение пользовательских кнопок","place_after_title":"Слева – рядом с названием страницы","place_replace_title":"Слева – вместо названия страницы","place_before_actions":"Справа – перед системными значками","place_inside_actions":"Справа – среди системных значков","hide_title":"Скрыть название страницы (например, Обзор / Home)","no_buttons":"Пользовательских кнопок пока нет.","add_button":"+ Добавить кнопку","delete_all":"Удалить все кнопки","confirm_delete_all":"Удалить все пользовательские кнопки?","new_button":"Новая кнопка","edit":"Изменить","hide":"Скрыть","remove":"Удалить","up":"Вверх","down":"Вниз","name":"Название","icon":"Значок","target_type":"Тип цели","display_style":"Стиль отображения","target":"Цель","search_list":"Поиск в списке…","search_inside":"Поиск в выборе…","select":"Выбрать…","nothing_found":"Ничего не найдено","entity":"Сущность","device":"Устройство","addon":"Приложение / add-on","dashboard":"Панель","settings":"Настройки","custom_url":"Свой URL","icon_only":"Только значок","icon_text":"Значок + текст","text_only":"Только текст","compact":"Компактный","wide":"Широкий","icon_text_color":"Цвет значка / текста","theme_default":"Цвет темы","custom_color":"Свой цвет","background":"Фон кнопки","bg_none":"Без фона","bg_theme":"Цвет темы","bg_custom":"Свой цвет","opacity":"Прозрачность","opacity_hint":"0% = невидимый фон, 100% = сплошной фон","url":"URL","load_error":"Ошибка сохранения: ","manager":"HA Nav Manager","settings_devices_services":"Устройства и службы","settings_devices":"Устройства","settings_entities":"Сущности","settings_automations":"Автоматизации","settings_helpers":"Помощники","settings_dashboards":"Панели","settings_apps":"Приложения / add-on","overview":"Обзор"},"tr":{"title":"HA Nav Manager","close":"Kapat","save":"Kaydet","saved":"Kaydedildi.","saving":"Kaydediliyor…","intro":"Düğmeler doğrudan Home Assistant’ın yerel araç çubuğunda gösterilir. Cihazlar, panolar ve web arayüzlü uygulamalar listeden seçilebilir — URL yazmak gerekmez.","placement":"Özel düğmelerin konumu","place_after_title":"Sol – sayfa başlığının yanında","place_replace_title":"Sol – sayfa başlığı yerine","place_before_actions":"Sağ – sistem simgelerinden önce","place_inside_actions":"Sağ – sistem simgeleri arasında","hide_title":"Sayfa başlığını gizle (örn. Genel Bakış / Home)","no_buttons":"Henüz özel düğme yok.","add_button":"+ Düğme ekle","delete_all":"Tüm düğmeleri sil","confirm_delete_all":"Tüm özel düğmeler silinsin mi?","new_button":"Yeni düğme","edit":"Düzenle","hide":"Gizle","remove":"Kaldır","up":"Yukarı","down":"Aşağı","name":"Ad","icon":"Simge","target_type":"Hedef türü","display_style":"Görünüm stili","target":"Hedef","search_list":"Listede ara…","search_inside":"Seçimde ara…","select":"Seç…","nothing_found":"Sonuç yok","entity":"Varlık","device":"Cihaz","addon":"Uygulama / add-on","dashboard":"Pano","settings":"Ayarlar","custom_url":"Özel URL","icon_only":"Yalnızca simge","icon_text":"Simge + metin","text_only":"Yalnızca metin","compact":"Kompakt","wide":"Geniş","icon_text_color":"Simge / metin rengi","theme_default":"Tema varsayılanı","custom_color":"Özel renk","background":"Düğme arka planı","bg_none":"Arka plan yok","bg_theme":"Tema rengi","bg_custom":"Özel renk","opacity":"Şeffaflık","opacity_hint":"0% = görünmez arka plan, 100% = opak arka plan","url":"URL","load_error":"Kaydetme hatası: ","manager":"HA Nav Manager","settings_devices_services":"Cihazlar ve hizmetler","settings_devices":"Cihazlar","settings_entities":"Varlıklar","settings_automations":"Otomasyonlar","settings_helpers":"Yardımcılar","settings_dashboards":"Panolar","settings_apps":"Uygulamalar / add-onlar","overview":"Genel Bakış"},"el":{"title":"HA Nav Manager","close":"Κλείσιμο","save":"Αποθήκευση","saved":"Αποθηκεύτηκε.","saving":"Αποθήκευση…","intro":"Τα κουμπιά εμφανίζονται απευθείας στη φυσική γραμμή εργαλείων του Home Assistant. Συσκευές, πίνακες και εφαρμογές με web interface επιλέγονται από λίστα — χωρίς πληκτρολόγηση URL.","placement":"Θέση προσαρμοσμένων κουμπιών","place_after_title":"Αριστερά – δίπλα στον τίτλο","place_replace_title":"Αριστερά – αντί για τον τίτλο","place_before_actions":"Δεξιά – πριν από τα εικονίδια συστήματος","place_inside_actions":"Δεξιά – ανάμεσα στα εικονίδια συστήματος","hide_title":"Απόκρυψη τίτλου σελίδας (π.χ. Επισκόπηση / Home)","no_buttons":"Δεν υπάρχουν ακόμη προσαρμοσμένα κουμπιά.","add_button":"+ Προσθήκη κουμπιού","delete_all":"Διαγραφή όλων των κουμπιών","confirm_delete_all":"Να διαγραφούν όλα τα προσαρμοσμένα κουμπιά;","new_button":"Νέο κουμπί","edit":"Επεξεργασία","hide":"Απόκρυψη","remove":"Αφαίρεση","up":"Πάνω","down":"Κάτω","name":"Όνομα","icon":"Εικονίδιο","target_type":"Τύπος στόχου","display_style":"Στυλ εμφάνισης","target":"Στόχος","search_list":"Αναζήτηση στη λίστα…","search_inside":"Αναζήτηση στην επιλογή…","select":"Επιλογή…","nothing_found":"Δεν βρέθηκε τίποτα","entity":"Οντότητα","device":"Συσκευή","addon":"Εφαρμογή / add-on","dashboard":"Πίνακας","settings":"Ρυθμίσεις","custom_url":"Προσαρμοσμένο URL","icon_only":"Μόνο εικονίδιο","icon_text":"Εικονίδιο + κείμενο","text_only":"Μόνο κείμενο","compact":"Συμπαγές","wide":"Ευρύ","icon_text_color":"Χρώμα εικονιδίου / κειμένου","theme_default":"Προεπιλογή θέματος","custom_color":"Προσαρμοσμένο χρώμα","background":"Φόντο κουμπιού","bg_none":"Χωρίς φόντο","bg_theme":"Χρώμα θέματος","bg_custom":"Προσαρμοσμένο χρώμα","opacity":"Διαφάνεια","opacity_hint":"0% = αόρατο φόντο, 100% = αδιαφανές φόντο","url":"URL","load_error":"Σφάλμα αποθήκευσης: ","manager":"HA Nav Manager","settings_devices_services":"Συσκευές και υπηρεσίες","settings_devices":"Συσκευές","settings_entities":"Οντότητες","settings_automations":"Αυτοματισμοί","settings_helpers":"Βοηθοί","settings_dashboards":"Πίνακες","settings_apps":"Εφαρμογές / add-ons","overview":"Επισκόπηση"},"ja":{"title":"HA Nav Manager","close":"閉じる","save":"保存","saved":"保存しました。","saving":"保存中…","intro":"ボタンは Home Assistant の標準ツールバーに直接表示されます。デバイス、ダッシュボード、Web UI を持つアプリは一覧から選択でき、URL入力は不要です。","placement":"カスタムボタンの位置","place_after_title":"左 – ページタイトルの横","place_replace_title":"左 – ページタイトルの代わり","place_before_actions":"右 – システムアイコンの前","place_inside_actions":"右 – システムアイコンの間","hide_title":"ページタイトルを非表示（例: 概要 / Home）","no_buttons":"カスタムボタンはまだありません。","add_button":"+ ボタンを追加","delete_all":"すべてのボタンを削除","confirm_delete_all":"すべてのカスタムボタンを削除しますか？","new_button":"新しいボタン","edit":"編集","hide":"隠す","remove":"削除","up":"上へ","down":"下へ","name":"名前","icon":"アイコン","target_type":"対象の種類","display_style":"表示スタイル","target":"対象","search_list":"一覧を検索…","search_inside":"選択肢内を検索…","select":"選択…","nothing_found":"見つかりません","entity":"エンティティ","device":"デバイス","addon":"アプリ / アドオン","dashboard":"ダッシュボード","settings":"設定","custom_url":"カスタムURL","icon_only":"アイコンのみ","icon_text":"アイコン + テキスト","text_only":"テキストのみ","compact":"コンパクト","wide":"ワイド","icon_text_color":"アイコン / テキスト色","theme_default":"テーマ既定色","custom_color":"カスタム色","background":"ボタン背景","bg_none":"背景なし","bg_theme":"テーマ色","bg_custom":"カスタム色","opacity":"透明度","opacity_hint":"0% = 背景なし、100% = 不透明","url":"URL","load_error":"保存エラー: ","manager":"HA Nav Manager","settings_devices_services":"デバイスとサービス","settings_devices":"デバイス","settings_entities":"エンティティ","settings_automations":"オートメーション","settings_helpers":"ヘルパー","settings_dashboards":"ダッシュボード","settings_apps":"アプリ / アドオン","overview":"概要"},"ko":{"title":"HA Nav Manager","close":"닫기","save":"저장","saved":"저장됨.","saving":"저장 중…","intro":"버튼은 Home Assistant의 기본 툴바에 직접 표시됩니다. 장치, 대시보드 및 웹 UI가 있는 앱을 목록에서 선택할 수 있어 URL을 입력할 필요가 없습니다.","placement":"사용자 버튼 위치","place_after_title":"왼쪽 – 페이지 제목 옆","place_replace_title":"왼쪽 – 페이지 제목 대신","place_before_actions":"오른쪽 – 시스템 아이콘 앞","place_inside_actions":"오른쪽 – 시스템 아이콘 사이","hide_title":"페이지 제목 숨기기 (예: 개요 / Home)","no_buttons":"아직 사용자 버튼이 없습니다.","add_button":"+ 버튼 추가","delete_all":"모든 버튼 삭제","confirm_delete_all":"모든 사용자 버튼을 삭제할까요?","new_button":"새 버튼","edit":"편집","hide":"숨기기","remove":"삭제","up":"위로","down":"아래로","name":"이름","icon":"아이콘","target_type":"대상 유형","display_style":"표시 스타일","target":"대상","search_list":"목록 검색…","search_inside":"선택 항목 검색…","select":"선택…","nothing_found":"결과 없음","entity":"엔티티","device":"장치","addon":"앱 / 애드온","dashboard":"대시보드","settings":"설정","custom_url":"사용자 URL","icon_only":"아이콘만","icon_text":"아이콘 + 텍스트","text_only":"텍스트만","compact":"컴팩트","wide":"넓게","icon_text_color":"아이콘 / 텍스트 색상","theme_default":"테마 기본값","custom_color":"사용자 색상","background":"버튼 배경","bg_none":"배경 없음","bg_theme":"테마 색상","bg_custom":"사용자 색상","opacity":"투명도","opacity_hint":"0% = 배경 없음, 100% = 불투명","url":"URL","load_error":"저장 오류: ","manager":"HA Nav Manager","settings_devices_services":"장치 및 서비스","settings_devices":"장치","settings_entities":"엔티티","settings_automations":"자동화","settings_helpers":"도우미","settings_dashboards":"대시보드","settings_apps":"앱 / 애드온","overview":"개요"},"zh-CN":{"title":"HA Nav Manager","close":"关闭","save":"保存","saved":"已保存。","saving":"正在保存…","intro":"按钮会直接显示在 Home Assistant 原生工具栏中。设备、仪表板和带 Web 界面的应用都可从列表选择，无需输入 URL。","placement":"自定义按钮位置","place_after_title":"左侧 – 页面标题旁","place_replace_title":"左侧 – 替代页面标题","place_before_actions":"右侧 – 系统图标之前","place_inside_actions":"右侧 – 系统图标之间","hide_title":"隐藏页面标题（例如 概览 / Home）","no_buttons":"还没有自定义按钮。","add_button":"+ 添加按钮","delete_all":"删除所有按钮","confirm_delete_all":"确定删除所有自定义按钮吗？","new_button":"新建按钮","edit":"编辑","hide":"隐藏","remove":"删除","up":"上移","down":"下移","name":"名称","icon":"图标","target_type":"目标类型","display_style":"显示样式","target":"目标","search_list":"搜索列表…","search_inside":"在选择中搜索…","select":"选择…","nothing_found":"未找到","entity":"实体","device":"设备","addon":"应用 / 插件","dashboard":"仪表板","settings":"设置","custom_url":"自定义 URL","icon_only":"仅图标","icon_text":"图标 + 文本","text_only":"仅文本","compact":"紧凑","wide":"宽","icon_text_color":"图标 / 文本颜色","theme_default":"主题默认","custom_color":"自定义颜色","background":"按钮背景","bg_none":"无背景","bg_theme":"主题颜色","bg_custom":"自定义颜色","opacity":"透明度","opacity_hint":"0% = 背景不可见，100% = 完全不透明","url":"URL","load_error":"保存错误：","manager":"HA Nav Manager","settings_devices_services":"设备与服务","settings_devices":"设备","settings_entities":"实体","settings_automations":"自动化","settings_helpers":"辅助项","settings_dashboards":"仪表板","settings_apps":"应用 / 插件","overview":"概览"},"zh-TW":{"title":"HA Nav Manager","close":"關閉","save":"儲存","saved":"已儲存。","saving":"正在儲存…","intro":"按鈕會直接顯示在 Home Assistant 原生工具列中。裝置、儀表板和具有 Web 介面的應用程式可從清單選擇，不必輸入 URL。","placement":"自訂按鈕位置","place_after_title":"左側 – 頁面標題旁","place_replace_title":"左側 – 取代頁面標題","place_before_actions":"右側 – 系統圖示之前","place_inside_actions":"右側 – 系統圖示之間","hide_title":"隱藏頁面標題（例如 概覽 / Home）","no_buttons":"目前沒有自訂按鈕。","add_button":"+ 新增按鈕","delete_all":"刪除所有按鈕","confirm_delete_all":"確定刪除所有自訂按鈕嗎？","new_button":"新增按鈕","edit":"編輯","hide":"隱藏","remove":"刪除","up":"上移","down":"下移","name":"名稱","icon":"圖示","target_type":"目標類型","display_style":"顯示樣式","target":"目標","search_list":"搜尋清單…","search_inside":"在選擇中搜尋…","select":"選擇…","nothing_found":"找不到結果","entity":"實體","device":"裝置","addon":"應用程式 / 附加元件","dashboard":"儀表板","settings":"設定","custom_url":"自訂 URL","icon_only":"僅圖示","icon_text":"圖示 + 文字","text_only":"僅文字","compact":"精簡","wide":"寬","icon_text_color":"圖示 / 文字顏色","theme_default":"主題預設","custom_color":"自訂顏色","background":"按鈕背景","bg_none":"無背景","bg_theme":"主題顏色","bg_custom":"自訂顏色","opacity":"透明度","opacity_hint":"0% = 背景不可見，100% = 完全不透明","url":"URL","load_error":"儲存錯誤：","manager":"HA Nav Manager","settings_devices_services":"裝置與服務","settings_devices":"裝置","settings_entities":"實體","settings_automations":"自動化","settings_helpers":"輔助項","settings_dashboards":"儀表板","settings_apps":"應用程式 / 附加元件","overview":"概覽"},"vi":{"title":"HA Nav Manager","close":"Đóng","save":"Lưu","saved":"Đã lưu.","saving":"Đang lưu…","intro":"Các nút hiển thị trực tiếp trên thanh công cụ gốc của Home Assistant. Thiết bị, bảng điều khiển và ứng dụng có giao diện web có thể chọn từ danh sách — không cần nhập URL.","placement":"Vị trí nút tùy chỉnh","place_after_title":"Trái – cạnh tiêu đề trang","place_replace_title":"Trái – thay tiêu đề trang","place_before_actions":"Phải – trước biểu tượng hệ thống","place_inside_actions":"Phải – giữa các biểu tượng hệ thống","hide_title":"Ẩn tiêu đề trang (ví dụ Tổng quan / Home)","no_buttons":"Chưa có nút tùy chỉnh.","add_button":"+ Thêm nút","delete_all":"Xóa tất cả nút","confirm_delete_all":"Xóa tất cả nút tùy chỉnh?","new_button":"Nút mới","edit":"Sửa","hide":"Ẩn","remove":"Xóa","up":"Lên","down":"Xuống","name":"Tên","icon":"Biểu tượng","target_type":"Loại đích","display_style":"Kiểu hiển thị","target":"Đích","search_list":"Tìm trong danh sách…","search_inside":"Tìm trong lựa chọn…","select":"Chọn…","nothing_found":"Không tìm thấy","entity":"Thực thể","device":"Thiết bị","addon":"Ứng dụng / add-on","dashboard":"Bảng điều khiển","settings":"Cài đặt","custom_url":"URL tùy chỉnh","icon_only":"Chỉ biểu tượng","icon_text":"Biểu tượng + chữ","text_only":"Chỉ chữ","compact":"Gọn","wide":"Rộng","icon_text_color":"Màu biểu tượng / chữ","theme_default":"Mặc định theo giao diện","custom_color":"Màu tùy chỉnh","background":"Nền nút","bg_none":"Không nền","bg_theme":"Màu giao diện","bg_custom":"Màu tùy chỉnh","opacity":"Độ trong suốt","opacity_hint":"0% = nền vô hình, 100% = nền đặc","url":"URL","load_error":"Lỗi khi lưu: ","manager":"HA Nav Manager","settings_devices_services":"Thiết bị & dịch vụ","settings_devices":"Thiết bị","settings_entities":"Thực thể","settings_automations":"Tự động hóa","settings_helpers":"Trợ giúp","settings_dashboards":"Bảng điều khiển","settings_apps":"Ứng dụng / add-on","overview":"Tổng quan"},"th":{"title":"HA Nav Manager","close":"ปิด","save":"บันทึก","saved":"บันทึกแล้ว","saving":"กำลังบันทึก…","intro":"ปุ่มจะแสดงโดยตรงบนแถบเครื่องมือดั้งเดิมของ Home Assistant สามารถเลือกอุปกรณ์ แดชบอร์ด และแอปที่มีเว็บอินเทอร์เฟซจากรายการได้โดยไม่ต้องพิมพ์ URL","placement":"ตำแหน่งปุ่มกำหนดเอง","place_after_title":"ซ้าย – ข้างชื่อหน้า","place_replace_title":"ซ้าย – แทนชื่อหน้า","place_before_actions":"ขวา – ก่อนไอคอนระบบ","place_inside_actions":"ขวา – ระหว่างไอคอนระบบ","hide_title":"ซ่อนชื่อหน้า (เช่น ภาพรวม / Home)","no_buttons":"ยังไม่มีปุ่มกำหนดเอง","add_button":"+ เพิ่มปุ่ม","delete_all":"ลบปุ่มทั้งหมด","confirm_delete_all":"ลบปุ่มกำหนดเองทั้งหมดหรือไม่?","new_button":"ปุ่มใหม่","edit":"แก้ไข","hide":"ซ่อน","remove":"ลบ","up":"ขึ้น","down":"ลง","name":"ชื่อ","icon":"ไอคอน","target_type":"ประเภทเป้าหมาย","display_style":"รูปแบบการแสดง","target":"เป้าหมาย","search_list":"ค้นหาในรายการ…","search_inside":"ค้นหาในตัวเลือก…","select":"เลือก…","nothing_found":"ไม่พบข้อมูล","entity":"เอนทิตี","device":"อุปกรณ์","addon":"แอป / แอดออน","dashboard":"แดชบอร์ด","settings":"การตั้งค่า","custom_url":"URL กำหนดเอง","icon_only":"ไอคอนเท่านั้น","icon_text":"ไอคอน + ข้อความ","text_only":"ข้อความเท่านั้น","compact":"กะทัดรัด","wide":"กว้าง","icon_text_color":"สีไอคอน / ข้อความ","theme_default":"ค่าเริ่มต้นของธีม","custom_color":"สีกำหนดเอง","background":"พื้นหลังปุ่ม","bg_none":"ไม่มีพื้นหลัง","bg_theme":"สีธีม","bg_custom":"สีกำหนดเอง","opacity":"ความโปร่งใส","opacity_hint":"0% = มองไม่เห็นพื้นหลัง, 100% = ทึบ","url":"URL","load_error":"เกิดข้อผิดพลาดขณะบันทึก: ","manager":"HA Nav Manager","settings_devices_services":"อุปกรณ์และบริการ","settings_devices":"อุปกรณ์","settings_entities":"เอนทิตี","settings_automations":"ระบบอัตโนมัติ","settings_helpers":"ตัวช่วย","settings_dashboards":"แดชบอร์ด","settings_apps":"แอป / แอดออน","overview":"ภาพรวม"},"id":{"title":"HA Nav Manager","close":"Tutup","save":"Simpan","saved":"Tersimpan.","saving":"Menyimpan…","intro":"Tombol ditampilkan langsung di toolbar bawaan Home Assistant. Perangkat, dasbor, dan aplikasi dengan antarmuka web dapat dipilih dari daftar — tanpa mengetik URL.","placement":"Posisi tombol khusus","place_after_title":"Kiri – di samping judul halaman","place_replace_title":"Kiri – menggantikan judul halaman","place_before_actions":"Kanan – sebelum ikon sistem","place_inside_actions":"Kanan – di antara ikon sistem","hide_title":"Sembunyikan judul halaman (mis. Ringkasan / Home)","no_buttons":"Belum ada tombol khusus.","add_button":"+ Tambah tombol","delete_all":"Hapus semua tombol","confirm_delete_all":"Hapus semua tombol khusus?","new_button":"Tombol baru","edit":"Edit","hide":"Sembunyikan","remove":"Hapus","up":"Naik","down":"Turun","name":"Nama","icon":"Ikon","target_type":"Jenis target","display_style":"Gaya tampilan","target":"Target","search_list":"Cari dalam daftar…","search_inside":"Cari dalam pilihan…","select":"Pilih…","nothing_found":"Tidak ditemukan","entity":"Entitas","device":"Perangkat","addon":"Aplikasi / add-on","dashboard":"Dasbor","settings":"Pengaturan","custom_url":"URL khusus","icon_only":"Ikon saja","icon_text":"Ikon + teks","text_only":"Teks saja","compact":"Ringkas","wide":"Lebar","icon_text_color":"Warna ikon / teks","theme_default":"Default tema","custom_color":"Warna khusus","background":"Latar tombol","bg_none":"Tanpa latar","bg_theme":"Warna tema","bg_custom":"Warna khusus","opacity":"Transparansi","opacity_hint":"0% = latar tidak terlihat, 100% = latar penuh","url":"URL","load_error":"Kesalahan saat menyimpan: ","manager":"HA Nav Manager","settings_devices_services":"Perangkat & layanan","settings_devices":"Perangkat","settings_entities":"Entitas","settings_automations":"Otomatisasi","settings_helpers":"Helper","settings_dashboards":"Dasbor","settings_apps":"Aplikasi / add-on","overview":"Ringkasan"},"ms":{"title":"HA Nav Manager","close":"Tutup","save":"Simpan","saved":"Disimpan.","saving":"Menyimpan…","intro":"Butang dipaparkan terus pada bar alat asli Home Assistant. Peranti, papan pemuka dan aplikasi dengan antara muka web boleh dipilih daripada senarai — tanpa menaip URL.","placement":"Kedudukan butang tersuai","place_after_title":"Kiri – di sebelah tajuk halaman","place_replace_title":"Kiri – menggantikan tajuk halaman","place_before_actions":"Kanan – sebelum ikon sistem","place_inside_actions":"Kanan – antara ikon sistem","hide_title":"Sembunyikan tajuk halaman (cth. Gambaran keseluruhan / Home)","no_buttons":"Belum ada butang tersuai.","add_button":"+ Tambah butang","delete_all":"Padam semua butang","confirm_delete_all":"Padam semua butang tersuai?","new_button":"Butang baharu","edit":"Edit","hide":"Sembunyi","remove":"Padam","up":"Naik","down":"Turun","name":"Nama","icon":"Ikon","target_type":"Jenis sasaran","display_style":"Gaya paparan","target":"Sasaran","search_list":"Cari dalam senarai…","search_inside":"Cari dalam pilihan…","select":"Pilih…","nothing_found":"Tiada hasil","entity":"Entiti","device":"Peranti","addon":"Aplikasi / add-on","dashboard":"Papan pemuka","settings":"Tetapan","custom_url":"URL tersuai","icon_only":"Ikon sahaja","icon_text":"Ikon + teks","text_only":"Teks sahaja","compact":"Padat","wide":"Lebar","icon_text_color":"Warna ikon / teks","theme_default":"Lalai tema","custom_color":"Warna tersuai","background":"Latar butang","bg_none":"Tiada latar","bg_theme":"Warna tema","bg_custom":"Warna tersuai","opacity":"Ketelusan","opacity_hint":"0% = latar tidak kelihatan, 100% = latar penuh","url":"URL","load_error":"Ralat semasa menyimpan: ","manager":"HA Nav Manager","settings_devices_services":"Peranti & perkhidmatan","settings_devices":"Peranti","settings_entities":"Entiti","settings_automations":"Automasi","settings_helpers":"Pembantu","settings_dashboards":"Papan pemuka","settings_apps":"Aplikasi / add-on","overview":"Gambaran keseluruhan"},"hi":{"title":"HA Nav Manager","close":"बंद करें","save":"सहेजें","saved":"सहेजा गया।","saving":"सहेजा जा रहा है…","intro":"बटन सीधे Home Assistant की मूल टूलबार में दिखाई देते हैं। डिवाइस, डैशबोर्ड और वेब इंटरफ़ेस वाले ऐप सूची से चुने जा सकते हैं — URL टाइप करने की ज़रूरत नहीं।","placement":"कस्टम बटन की स्थिति","place_after_title":"बाएँ – पेज शीर्षक के पास","place_replace_title":"बाएँ – पेज शीर्षक की जगह","place_before_actions":"दाएँ – सिस्टम आइकन से पहले","place_inside_actions":"दाएँ – सिस्टम आइकन के बीच","hide_title":"पेज शीर्षक छिपाएँ (जैसे अवलोकन / Home)","no_buttons":"अभी कोई कस्टम बटन नहीं है।","add_button":"+ बटन जोड़ें","delete_all":"सभी बटन हटाएँ","confirm_delete_all":"सभी कस्टम बटन हटाएँ?","new_button":"नया बटन","edit":"संपादित करें","hide":"छिपाएँ","remove":"हटाएँ","up":"ऊपर","down":"नीचे","name":"नाम","icon":"आइकन","target_type":"लक्ष्य प्रकार","display_style":"डिस्प्ले शैली","target":"लक्ष्य","search_list":"सूची में खोजें…","search_inside":"चयन में खोजें…","select":"चुनें…","nothing_found":"कुछ नहीं मिला","entity":"एंटिटी","device":"डिवाइस","addon":"ऐप / ऐड-ऑन","dashboard":"डैशबोर्ड","settings":"सेटिंग्स","custom_url":"कस्टम URL","icon_only":"केवल आइकन","icon_text":"आइकन + टेक्स्ट","text_only":"केवल टेक्स्ट","compact":"कॉम्पैक्ट","wide":"चौड़ा","icon_text_color":"आइकन / टेक्स्ट रंग","theme_default":"थीम डिफ़ॉल्ट","custom_color":"कस्टम रंग","background":"बटन बैकग्राउंड","bg_none":"कोई बैकग्राउंड नहीं","bg_theme":"थीम रंग","bg_custom":"कस्टम रंग","opacity":"पारदर्शिता","opacity_hint":"0% = अदृश्य बैकग्राउंड, 100% = ठोस बैकग्राउंड","url":"URL","load_error":"सहेजने में त्रुटि: ","manager":"HA Nav Manager","settings_devices_services":"डिवाइस और सेवाएँ","settings_devices":"डिवाइस","settings_entities":"एंटिटीज़","settings_automations":"ऑटोमेशन","settings_helpers":"हेल्पर","settings_dashboards":"डैशबोर्ड","settings_apps":"ऐप / ऐड-ऑन","overview":"अवलोकन"},"ar":{"title":"HA Nav Manager","close":"إغلاق","save":"حفظ","saved":"تم الحفظ.","saving":"جارٍ الحفظ…","intro":"تظهر الأزرار مباشرة في شريط أدوات Home Assistant الأصلي. يمكن اختيار الأجهزة ولوحات المعلومات والتطبيقات ذات واجهة الويب من قائمة — دون كتابة عناوين URL.","placement":"موضع الأزرار المخصصة","place_after_title":"يسار – بجوار عنوان الصفحة","place_replace_title":"يسار – بدلاً من عنوان الصفحة","place_before_actions":"يمين – قبل أيقونات النظام","place_inside_actions":"يمين – بين أيقونات النظام","hide_title":"إخفاء عنوان الصفحة (مثل نظرة عامة / Home)","no_buttons":"لا توجد أزرار مخصصة بعد.","add_button":"+ إضافة زر","delete_all":"حذف كل الأزرار","confirm_delete_all":"هل تريد حذف كل الأزرار المخصصة؟","new_button":"زر جديد","edit":"تعديل","hide":"إخفاء","remove":"إزالة","up":"أعلى","down":"أسفل","name":"الاسم","icon":"الأيقونة","target_type":"نوع الهدف","display_style":"نمط العرض","target":"الهدف","search_list":"بحث في القائمة…","search_inside":"بحث داخل الاختيار…","select":"اختيار…","nothing_found":"لم يتم العثور على شيء","entity":"كيان","device":"جهاز","addon":"تطبيق / إضافة","dashboard":"لوحة معلومات","settings":"الإعدادات","custom_url":"URL مخصص","icon_only":"أيقونة فقط","icon_text":"أيقونة + نص","text_only":"نص فقط","compact":"مضغوط","wide":"عريض","icon_text_color":"لون الأيقونة / النص","theme_default":"الافتراضي حسب السمة","custom_color":"لون مخصص","background":"خلفية الزر","bg_none":"بدون خلفية","bg_theme":"لون السمة","bg_custom":"لون مخصص","opacity":"الشفافية","opacity_hint":"0% = خلفية غير مرئية، 100% = خلفية كاملة","url":"URL","load_error":"خطأ أثناء الحفظ: ","manager":"HA Nav Manager","settings_devices_services":"الأجهزة والخدمات","settings_devices":"الأجهزة","settings_entities":"الكيانات","settings_automations":"الأتمتة","settings_helpers":"المساعدات","settings_dashboards":"لوحات المعلومات","settings_apps":"التطبيقات / الإضافات","overview":"نظرة عامة"},"he":{"title":"HA Nav Manager","close":"סגירה","save":"שמירה","saved":"נשמר.","saving":"שומר…","intro":"הכפתורים מוצגים ישירות בסרגל הכלים המקורי של Home Assistant. ניתן לבחור מכשירים, לוחות מחוונים ואפליקציות עם ממשק Web מתוך רשימה — ללא הקלדת URL.","placement":"מיקום כפתורים מותאמים","place_after_title":"שמאל – ליד כותרת הדף","place_replace_title":"שמאל – במקום כותרת הדף","place_before_actions":"ימין – לפני סמלי המערכת","place_inside_actions":"ימין – בין סמלי המערכת","hide_title":"הסתר כותרת דף (למשל סקירה / Home)","no_buttons":"עדיין אין כפתורים מותאמים.","add_button":"+ הוסף כפתור","delete_all":"מחק את כל הכפתורים","confirm_delete_all":"למחוק את כל הכפתורים המותאמים?","new_button":"כפתור חדש","edit":"עריכה","hide":"הסתר","remove":"הסר","up":"למעלה","down":"למטה","name":"שם","icon":"סמל","target_type":"סוג יעד","display_style":"סגנון תצוגה","target":"יעד","search_list":"חיפוש ברשימה…","search_inside":"חיפוש בתוך הבחירה…","select":"בחירה…","nothing_found":"לא נמצא","entity":"ישות","device":"מכשיר","addon":"אפליקציה / תוסף","dashboard":"לוח מחוונים","settings":"הגדרות","custom_url":"URL מותאם","icon_only":"סמל בלבד","icon_text":"סמל + טקסט","text_only":"טקסט בלבד","compact":"קומפקטי","wide":"רחב","icon_text_color":"צבע סמל / טקסט","theme_default":"ברירת מחדל של ערכת הנושא","custom_color":"צבע מותאם","background":"רקע הכפתור","bg_none":"ללא רקע","bg_theme":"צבע ערכת נושא","bg_custom":"צבע מותאם","opacity":"שקיפות","opacity_hint":"0% = רקע בלתי נראה, 100% = רקע אטום","url":"URL","load_error":"שגיאה בשמירה: ","manager":"HA Nav Manager","settings_devices_services":"מכשירים ושירותים","settings_devices":"מכשירים","settings_entities":"ישויות","settings_automations":"אוטומציות","settings_helpers":"עוזרים","settings_dashboards":"לוחות מחוונים","settings_apps":"אפליקציות / תוספים","overview":"סקירה"}};


  Object.assign(TRANSLATIONS.en, {
    appearance: "Toolbar size & spacing",
    desktop: "Desktop",
    mobile: "Mobile",
    icon_size: "Icon size",
    button_gap: "Space between buttons",
    button_height: "Button height",
    horizontal_padding: "Horizontal padding",
    kiosk_fallback: "Kiosk fallback",
    kiosk_fallback_hint: "If the native Home Assistant toolbar is hidden, show a small HA Nav Manager bar instead.",
    kiosk_bar: "Kiosk toolbar"
  });

  Object.assign(TRANSLATIONS.cs, {
    appearance: "Velikost a rozestupy toolbaru",
    desktop: "Počítač",
    mobile: "Mobil",
    icon_size: "Velikost ikon",
    button_gap: "Rozestup tlačítek",
    button_height: "Výška tlačítek",
    horizontal_padding: "Vodorovné odsazení",
    kiosk_fallback: "Kiosk fallback",
    kiosk_fallback_hint: "Když kiosk skryje nativní horní lištu Home Assistantu, zobrazí se místo ní malá vlastní lišta HA Nav Manageru.",
    kiosk_bar: "Kiosk lišta"
  });

  Object.assign(TRANSLATIONS.en, {
    tab_toolbar: "Toolbar", tab_sidebar: "Sidebar", tab_dashboards: "Dashboards",
    sidebar_intro: "Customize the existing Home Assistant sidebar without changing dashboard contents.",
    sidebar_enabled: "Enable sidebar customization", global_appearance: "Global appearance",
    native_items: "Native items and dashboards", custom_items: "Custom sidebar items",
    add_sidebar_item: "+ Add sidebar item", no_sidebar_items: "No sidebar items found.",
    visible: "Visible", reset_item: "Reset item", reset_sidebar_global: "Reset global appearance",
    remove_overrides: "Remove all item overrides", restore_native: "Restore native sidebar appearance",
    icon_color: "Icon color", text_color: "Text color", hover_background: "Hover background",
    hover_color: "Hover text / icon", active_background: "Active background",
    active_text_color: "Active text color", active_icon_color: "Active icon color",
    border_radius: "Border radius", item_height: "Item height", spacing: "Item spacing", text_size: "Text size",
    inherit: "Use global default", filter_items: "Filter sidebar items…", native_item: "Native item",
    dashboard_manager_intro: "Create and edit dashboard metadata. Lovelace cards are never changed.",
    existing_dashboards: "Existing dashboards", create_dashboard: "Create dashboard",
    dashboard_title: "Dashboard title", dashboard_path: "URL path", show_sidebar: "Show in sidebar",
    admin_only: "Admin only", create: "Create", update: "Update", delete: "Delete",
    confirm_delete_dashboard: "Delete this dashboard? Its Lovelace configuration will also be removed.",
    storage_dashboard: "Storage dashboard", yaml_dashboard: "YAML dashboard (read-only)",
    dashboard_created: "Dashboard created.", dashboard_updated: "Dashboard updated.",
    dashboard_deleted: "Dashboard deleted.", dashboard_api_error: "Dashboard operation failed: ",
    path_hint: "Lowercase letters, numbers, hyphens and underscores; no leading slash.",
    native_sidebar_restored: "Native sidebar appearance restored.",
    sidebar_global_reset: "Global sidebar appearance reset.", overrides_removed: "All sidebar item overrides removed."
  });
  Object.assign(TRANSLATIONS.cs, {
    tab_toolbar: "Toolbar", tab_sidebar: "Boční panel", tab_dashboards: "Dashboardy",
    sidebar_intro: "Přizpůsobení existujícího bočního panelu Home Assistantu bez změny obsahu dashboardů.",
    sidebar_enabled: "Zapnout přizpůsobení bočního panelu", global_appearance: "Globální vzhled",
    native_items: "Nativní položky a dashboardy", custom_items: "Vlastní položky bočního panelu",
    add_sidebar_item: "+ Přidat položku", no_sidebar_items: "Nebyly nalezeny žádné položky.",
    visible: "Viditelná", reset_item: "Obnovit položku", reset_sidebar_global: "Obnovit globální vzhled",
    remove_overrides: "Odstranit všechna nastavení položek", restore_native: "Obnovit nativní vzhled panelu",
    icon_color: "Barva ikony", text_color: "Barva textu", hover_background: "Pozadí při najetí",
    hover_color: "Text / ikona při najetí", active_background: "Aktivní pozadí",
    active_text_color: "Aktivní text", active_icon_color: "Aktivní ikona",
    border_radius: "Zaoblení rohů", item_height: "Výška položky", spacing: "Rozestup položek", text_size: "Velikost textu",
    inherit: "Použít globální hodnotu", filter_items: "Filtrovat položky…", native_item: "Nativní položka",
    dashboard_manager_intro: "Vytváření a úprava metadat dashboardů. Lovelace karty se nikdy nemění.",
    existing_dashboards: "Existující dashboardy", create_dashboard: "Vytvořit dashboard",
    dashboard_title: "Název dashboardu", dashboard_path: "URL cesta", show_sidebar: "Zobrazit v bočním panelu",
    admin_only: "Pouze správce", create: "Vytvořit", update: "Aktualizovat", delete: "Smazat",
    confirm_delete_dashboard: "Smazat tento dashboard? Odstraní se také jeho Lovelace konfigurace.",
    storage_dashboard: "Úložišťový dashboard", yaml_dashboard: "YAML dashboard (jen pro čtení)",
    dashboard_created: "Dashboard byl vytvořen.", dashboard_updated: "Dashboard byl aktualizován.",
    dashboard_deleted: "Dashboard byl smazán.", dashboard_api_error: "Operace s dashboardem selhala: ",
    path_hint: "Malá písmena, čísla, pomlčky a podtržítka; bez úvodního lomítka.",
    native_sidebar_restored: "Nativní vzhled bočního panelu byl obnoven.",
    sidebar_global_reset: "Globální vzhled bočního panelu byl obnoven.", overrides_removed: "Všechna nastavení položek byla odstraněna."
  });


  Object.assign(TRANSLATIONS.en, {
    reset_appearance: "Reset size & spacing",
    reset_appearance_done: "Size and spacing reset to defaults."
  });
  Object.assign(TRANSLATIONS.cs, {
    reset_appearance: "Obnovit výchozí velikosti a rozestupy",
    reset_appearance_done: "Velikosti a rozestupy byly obnoveny."
  });


  Object.assign(TRANSLATIONS.en, {
    fine_spacing: "Fine spacing",
    spacing_step_hint: "You can use 0.5 px steps.",
    color_palette: "Color palette",
    hue: "Hue",
    saturation: "Saturation",
    brightness: "Brightness"
  });
  Object.assign(TRANSLATIONS.cs, {
    fine_spacing: "Jemné odsazení",
    spacing_step_hint: "Lze použít kroky po 0,5 px.",
    color_palette: "Barevná paleta",
    hue: "Odstín",
    saturation: "Sytost",
    brightness: "Jas"
  });


  Object.assign(TRANSLATIONS.en, {
    mobile_palette: "Quick colors",
    more_colors: "More colors"
  });
  Object.assign(TRANSLATIONS.cs, {
    mobile_palette: "Rychlé barvy",
    more_colors: "Další barvy"
  });


  Object.assign(TRANSLATIONS.en, {
    custom_picker_title: "Choose color",
    apply: "Apply",
    cancel: "Cancel"
  });
  Object.assign(TRANSLATIONS.cs, {
    custom_picker_title: "Výběr barvy",
    apply: "Nastavit",
    cancel: "Zrušit"
  });


  Object.assign(TRANSLATIONS.en, {
    icon_correction: "Icon size correction",
    button_correction: "Button / background size correction",
    correction_hint: "0% = global size, negative = smaller, positive = larger"
  });
  Object.assign(TRANSLATIONS.cs, {
    icon_correction: "Korekce velikosti ikony",
    button_correction: "Korekce velikosti tlačítka / pozadí",
    correction_hint: "0 % = globální velikost, mínus = menší, plus = větší"
  });


  Object.assign(TRANSLATIONS.en, {
    colors: "Colors", basic: "Basic", size_appearance: "Size / appearance",
    background_opacity: "Background opacity", hover_opacity: "Hover opacity", active_opacity: "Active opacity",
    path_hint: "Complete the prefilled dashboard- prefix, e.g. dashboard-living (lowercase letters, digits, _ and -). The prefix alone is incomplete; the path must contain a hyphen.",
    dashboard_path_fixed: "Home Assistant does not support changing an existing dashboard URL through this API.",
    dashboard_admin_required: "Dashboard management requires an administrator.",
    dashboard_title_required: "Enter a dashboard title."
  });
  Object.assign(TRANSLATIONS.cs, {
    colors: "Barvy", basic: "Základní", size_appearance: "Velikost / vzhled",
    background_opacity: "Krytí pozadí", hover_opacity: "Krytí při najetí", active_opacity: "Krytí aktivní položky",
    path_hint: "Doplňte předvyplněný prefix dashboard-, např. dashboard-obyvak (malá písmena, číslice, _ a -). Samotný prefix nestačí.",
    dashboard_path_fixed: "Home Assistant přes toto API nepodporuje změnu URL existujícího dashboardu.",
    dashboard_admin_required: "Správa dashboardů vyžaduje správce.",
    dashboard_title_required: "Zadejte název dashboardu."
  });

  // BEGIN GENERATED MANAGER TRANSLATIONS (scripts/update-translations.cjs)
  Object.assign(TRANSLATIONS["en"], {"item_width":"Item width (%)","item_width_hint":"100% = full width; 20–100% shortens the background and click area. Empty item value inherits the global setting.","reset_icon":"Restore default icon","icon_picker_unavailable":"The visual icon picker is not loaded by this Home Assistant frontend yet. It will appear automatically when available.","ordering_hint":"Saved Sidebar Manager order takes priority, followed by your native sidebar order. Other dashboards retain source order at the end. Opening or refreshing does not save an order.","no_dashboards":"No dashboards found."});
  Object.assign(TRANSLATIONS["cs"], {"item_width":"Šířka položky (%)","item_width_hint":"100 % = plná šířka; 20–100 % zkrátí pozadí i klikací plochu. Prázdná hodnota položky přebírá globální nastavení.","reset_icon":"Obnovit výchozí ikonu","icon_picker_unavailable":"Tento frontend Home Assistantu zatím nenačetl vizuální výběr ikon. Jakmile bude dostupný, zobrazí se automaticky.","ordering_hint":"Přednost má uložené pořadí Sidebar Manageru, poté vaše nativní pořadí panelu. Ostatní dashboardy zůstávají na konci v pořadí zdroje. Otevření ani obnovení pořadí neukládá.","no_dashboards":"Nebyly nalezeny žádné dashboardy."});
  Object.assign(TRANSLATIONS["de"], {"item_width":"Eintragsbreite (%)","item_width_hint":"100% = volle Breite; 20–100% verkürzt Hintergrund und Klickfläche. Ein leerer Einzelwert übernimmt die globale Einstellung.","appearance":"Größe und Abstände der Symbolleiste","desktop":"Desktop","mobile":"Mobilgerät","icon_size":"Symbolgröße","button_gap":"Abstand zwischen Schaltflächen","button_height":"Schaltflächenhöhe","horizontal_padding":"Horizontaler Innenabstand","kiosk_fallback":"Kiosk-Ersatzleiste","kiosk_fallback_hint":"Wenn die native HA-Symbolleiste ausgeblendet ist, eine kleine Toolbar-Manager-Leiste anzeigen.","kiosk_bar":"Kiosk-Symbolleiste","tab_toolbar":"Symbolleiste","tab_sidebar":"Seitenleiste","tab_dashboards":"Dashboards","sidebar_intro":"Die native HA-Seitenleiste anpassen, ohne Dashboard-Inhalte zu ändern.","sidebar_enabled":"Seitenleistenanpassung aktivieren","global_appearance":"Allgemeines Aussehen","native_items":"Native Einträge und Dashboards","custom_items":"Eigene Seitenleisteneinträge","add_sidebar_item":"+ Seitenleisteneintrag hinzufügen","no_sidebar_items":"Keine Seitenleisteneinträge gefunden.","visible":"Sichtbar","reset_item":"Eintrag zurücksetzen","reset_sidebar_global":"Allgemeines Aussehen zurücksetzen","remove_overrides":"Alle Eintragsanpassungen entfernen","restore_native":"Natives Aussehen wiederherstellen","icon_color":"Symbolfarbe","text_color":"Textfarbe","hover_background":"Hintergrund beim Überfahren","hover_color":"Text / Symbol beim Überfahren","active_background":"Aktiver Hintergrund","active_text_color":"Aktive Textfarbe","active_icon_color":"Aktive Symbolfarbe","border_radius":"Eckenradius","item_height":"Eintragshöhe","spacing":"Eintragsabstand","text_size":"Textgröße","inherit":"Allgemeinen Standard verwenden","filter_items":"Seitenleisteneinträge filtern…","native_item":"Nativer Eintrag","dashboard_manager_intro":"Dashboard-Metadaten erstellen und bearbeiten. Lovelace-Karten werden nicht verändert.","existing_dashboards":"Vorhandene Dashboards","create_dashboard":"Dashboard erstellen","dashboard_title":"Dashboard-Titel","dashboard_path":"URL-Pfad","show_sidebar":"In Seitenleiste anzeigen","admin_only":"Nur Administratoren","create":"Erstellen","update":"Aktualisieren","delete":"Löschen","confirm_delete_dashboard":"Dieses Dashboard löschen? Seine Lovelace-Konfiguration wird ebenfalls entfernt.","storage_dashboard":"Gespeichertes Dashboard","yaml_dashboard":"YAML-Dashboard (schreibgeschützt)","dashboard_created":"Dashboard erstellt.","dashboard_updated":"Dashboard aktualisiert.","dashboard_deleted":"Dashboard gelöscht.","dashboard_api_error":"Dashboard-Vorgang fehlgeschlagen: ","path_hint":"Das vorgegebene Präfix dashboard- ergänzen, z. B. dashboard-wohnzimmer (Kleinbuchstaben, Ziffern, _ und -). Das Präfix allein reicht nicht.","native_sidebar_restored":"Natives Aussehen wiederhergestellt.","sidebar_global_reset":"Allgemeines Aussehen zurückgesetzt.","overrides_removed":"Alle Eintragsanpassungen entfernt.","reset_appearance":"Größe und Abstände zurücksetzen","reset_appearance_done":"Größe und Abstände zurückgesetzt.","fine_spacing":"Feinabstand","spacing_step_hint":"Schritte von 0,5 px sind möglich.","color_palette":"Farbpalette","hue":"Farbton","saturation":"Sättigung","brightness":"Helligkeit","mobile_palette":"Schnellfarben","more_colors":"Weitere Farben","custom_picker_title":"Farbe wählen","apply":"Anwenden","cancel":"Abbrechen","icon_correction":"Symbolgrößenkorrektur","button_correction":"Korrektur der Schaltflächen- / Hintergrundgröße","correction_hint":"0 % = allgemeine Größe, negativ = kleiner, positiv = größer","colors":"Farben","basic":"Grundlagen","size_appearance":"Größe / Aussehen","background_opacity":"Hintergrunddeckkraft","hover_opacity":"Deckkraft beim Überfahren","active_opacity":"Deckkraft des aktiven Eintrags","dashboard_path_fixed":"HA unterstützt über diese API keine Änderung bestehender Dashboard-URLs.","dashboard_admin_required":"Dashboard-Verwaltung erfordert Administratorrechte.","dashboard_title_required":"Dashboard-Titel eingeben.","reset_icon":"Standardsymbol wiederherstellen","icon_picker_unavailable":"Dieser HA-Frontend hat die visuelle Symbolauswahl noch nicht geladen. Sie erscheint automatisch, sobald verfügbar.","ordering_hint":"Gespeicherte Sidebar-Manager-Reihenfolge hat Vorrang, danach die native Benutzerreihenfolge. Weitere Dashboards bleiben am Ende in Quellreihenfolge. Öffnen und Aktualisieren speichern keine Reihenfolge.","no_dashboards":"Keine Dashboards gefunden."});
  Object.assign(TRANSLATIONS["sk"], {"item_width":"Šírka položky (%)","item_width_hint":"100 % = plná šírka; 20–100 % skráti pozadie aj klikaciu plochu. Prázdna hodnota položky preberá globálne nastavenie.","appearance":"Veľkosť a rozostupy panela","desktop":"Počítač","mobile":"Mobil","icon_size":"Veľkosť ikon","button_gap":"Rozostup tlačidiel","button_height":"Výška tlačidiel","horizontal_padding":"Vodorovné odsadenie","kiosk_fallback":"Náhradný kiosk panel","kiosk_fallback_hint":"Ak je natívny panel HA skrytý, zobrazí sa malý panel HA Nav Managera.","kiosk_bar":"Kiosk panel","tab_toolbar":"Horný panel","tab_sidebar":"Bočný panel","tab_dashboards":"Dashboardy","sidebar_intro":"Prispôsobenie natívneho bočného panela HA bez zmeny obsahu dashboardov.","sidebar_enabled":"Zapnúť prispôsobenie bočného panela","global_appearance":"Globálny vzhľad","native_items":"Natívne položky a dashboardy","custom_items":"Vlastné položky bočného panela","add_sidebar_item":"+ Pridať položku","no_sidebar_items":"Nenašli sa žiadne položky.","visible":"Viditeľná","reset_item":"Obnoviť položku","reset_sidebar_global":"Obnoviť globálny vzhľad","remove_overrides":"Odstrániť všetky úpravy položiek","restore_native":"Obnoviť natívny vzhľad panela","icon_color":"Farba ikony","text_color":"Farba textu","hover_background":"Pozadie pri prejdení","hover_color":"Text / ikona pri prejdení","active_background":"Aktívne pozadie","active_text_color":"Aktívny text","active_icon_color":"Aktívna ikona","border_radius":"Zaoblenie rohov","item_height":"Výška položky","spacing":"Rozostup položiek","text_size":"Veľkosť textu","inherit":"Použiť globálnu hodnotu","filter_items":"Filtrovať položky…","native_item":"Natívna položka","dashboard_manager_intro":"Vytváranie a úprava metadát dashboardov. Lovelace karty sa nemenia.","existing_dashboards":"Existujúce dashboardy","create_dashboard":"Vytvoriť dashboard","dashboard_title":"Názov dashboardu","dashboard_path":"URL cesta","show_sidebar":"Zobraziť v bočnom paneli","admin_only":"Iba správca","create":"Vytvoriť","update":"Aktualizovať","delete":"Zmazať","confirm_delete_dashboard":"Zmazať tento dashboard? Odstráni sa aj jeho Lovelace konfigurácia.","storage_dashboard":"Úložiskový dashboard","yaml_dashboard":"YAML dashboard (iba na čítanie)","dashboard_created":"Dashboard bol vytvorený.","dashboard_updated":"Dashboard bol aktualizovaný.","dashboard_deleted":"Dashboard bol zmazaný.","dashboard_api_error":"Operácia s dashboardom zlyhala: ","path_hint":"Doplňte predvyplnený prefix dashboard-, napr. dashboard-obyvacka (malé písmená, číslice, _ a -). Samotný prefix nestačí.","native_sidebar_restored":"Natívny vzhľad panela bol obnovený.","sidebar_global_reset":"Globálny vzhľad bol obnovený.","overrides_removed":"Všetky úpravy položiek boli odstránené.","reset_appearance":"Obnoviť veľkosti a rozostupy","reset_appearance_done":"Veľkosti a rozostupy boli obnovené.","fine_spacing":"Jemné odsadenie","spacing_step_hint":"Možno použiť kroky po 0,5 px.","color_palette":"Farebná paleta","hue":"Odtieň","saturation":"Sýtosť","brightness":"Jas","mobile_palette":"Rýchle farby","more_colors":"Ďalšie farby","custom_picker_title":"Výber farby","apply":"Použiť","cancel":"Zrušiť","icon_correction":"Korekcia veľkosti ikony","button_correction":"Korekcia veľkosti tlačidla / pozadia","correction_hint":"0 % = globálna veľkosť, mínus = menšie, plus = väčšie","colors":"Farby","basic":"Základné","size_appearance":"Veľkosť / vzhľad","background_opacity":"Krytie pozadia","hover_opacity":"Krytie pri prejdení","active_opacity":"Krytie aktívnej položky","dashboard_path_fixed":"HA cez toto API nepodporuje zmenu URL existujúceho dashboardu.","dashboard_admin_required":"Správa dashboardov vyžaduje správcu.","dashboard_title_required":"Zadajte názov dashboardu.","reset_icon":"Obnoviť predvolenú ikonu","icon_picker_unavailable":"Tento frontend HA ešte nenačítal vizuálny výber ikon. Zobrazí sa automaticky, keď bude dostupný.","ordering_hint":"Prednosť má uložené poradie Sidebar Managera, potom natívne poradie používateľa. Ostatné dashboardy zostávajú na konci v poradí zdroja. Otvorenie ani obnovenie poradie neukladá.","no_dashboards":"Nenašli sa žiadne dashboardy."});
  Object.assign(TRANSLATIONS["pl"], {"item_width":"Szerokość elementu (%)","item_width_hint":"100% = pełna szerokość; 20–100% skraca tło i obszar kliknięcia. Pusta wartość elementu dziedziczy ustawienie globalne.","appearance":"Rozmiar i odstępy paska","desktop":"Komputer","mobile":"Telefon","icon_size":"Rozmiar ikon","button_gap":"Odstęp między przyciskami","button_height":"Wysokość przycisków","horizontal_padding":"Odstęp wewnętrzny w poziomie","kiosk_fallback":"Zastępczy pasek kiosku","kiosk_fallback_hint":"Gdy natywny pasek HA jest ukryty, pokaż mały pasek HA Nav Manager.","kiosk_bar":"Pasek kiosku","tab_toolbar":"Pasek narzędzi","tab_sidebar":"Panel boczny","tab_dashboards":"Pulpity","sidebar_intro":"Dostosuj natywny panel boczny HA bez zmieniania zawartości pulpitów.","sidebar_enabled":"Włącz dostosowanie panelu bocznego","global_appearance":"Wygląd globalny","native_items":"Natywne elementy i pulpity","custom_items":"Własne elementy panelu","add_sidebar_item":"+ Dodaj element panelu","no_sidebar_items":"Nie znaleziono elementów panelu.","visible":"Widoczny","reset_item":"Przywróć element","reset_sidebar_global":"Przywróć wygląd globalny","remove_overrides":"Usuń wszystkie ustawienia elementów","restore_native":"Przywróć natywny wygląd panelu","icon_color":"Kolor ikony","text_color":"Kolor tekstu","hover_background":"Tło po najechaniu","hover_color":"Tekst / ikona po najechaniu","active_background":"Aktywne tło","active_text_color":"Kolor aktywnego tekstu","active_icon_color":"Kolor aktywnej ikony","border_radius":"Promień narożników","item_height":"Wysokość elementu","spacing":"Odstęp elementów","text_size":"Rozmiar tekstu","inherit":"Użyj ustawienia globalnego","filter_items":"Filtruj elementy panelu…","native_item":"Element natywny","dashboard_manager_intro":"Twórz i edytuj metadane pulpitów. Karty Lovelace nie są zmieniane.","existing_dashboards":"Istniejące pulpity","create_dashboard":"Utwórz pulpit","dashboard_title":"Tytuł pulpitu","dashboard_path":"Ścieżka URL","show_sidebar":"Pokaż w panelu bocznym","admin_only":"Tylko administrator","create":"Utwórz","update":"Aktualizuj","delete":"Usuń","confirm_delete_dashboard":"Usunąć ten pulpit? Jego konfiguracja Lovelace również zostanie usunięta.","storage_dashboard":"Pulpit w pamięci","yaml_dashboard":"Pulpit YAML (tylko do odczytu)","dashboard_created":"Utworzono pulpit.","dashboard_updated":"Zaktualizowano pulpit.","dashboard_deleted":"Usunięto pulpit.","dashboard_api_error":"Operacja pulpitu nie powiodła się: ","path_hint":"Uzupełnij prefiks dashboard-, np. dashboard-salon (małe litery, cyfry, _ i -). Sam prefiks nie wystarczy.","native_sidebar_restored":"Przywrócono natywny wygląd panelu.","sidebar_global_reset":"Przywrócono wygląd globalny.","overrides_removed":"Usunięto wszystkie ustawienia elementów.","reset_appearance":"Przywróć rozmiary i odstępy","reset_appearance_done":"Przywrócono rozmiary i odstępy.","fine_spacing":"Dokładny odstęp","spacing_step_hint":"Można używać kroków co 0,5 px.","color_palette":"Paleta kolorów","hue":"Odcień","saturation":"Nasycenie","brightness":"Jasność","mobile_palette":"Szybkie kolory","more_colors":"Więcej kolorów","custom_picker_title":"Wybierz kolor","apply":"Zastosuj","cancel":"Anuluj","icon_correction":"Korekta rozmiaru ikony","button_correction":"Korekta rozmiaru przycisku / tła","correction_hint":"0% = rozmiar globalny, minus = mniejszy, plus = większy","colors":"Kolory","basic":"Podstawowe","size_appearance":"Rozmiar / wygląd","background_opacity":"Krycie tła","hover_opacity":"Krycie po najechaniu","active_opacity":"Krycie aktywnego elementu","dashboard_path_fixed":"HA nie obsługuje zmiany istniejącego URL pulpitu przez to API.","dashboard_admin_required":"Zarządzanie pulpitami wymaga administratora.","dashboard_title_required":"Wpisz tytuł pulpitu.","reset_icon":"Przywróć domyślną ikonę","icon_picker_unavailable":"Ten interfejs HA jeszcze nie załadował wizualnego wyboru ikon. Pojawi się automatycznie, gdy będzie dostępny.","ordering_hint":"Najpierw zapisana kolejność Sidebar Manager, potem natywna kolejność użytkownika. Pozostałe pulpity zachowują kolejność źródła na końcu. Otwarcie i odświeżenie nie zapisuje kolejności.","no_dashboards":"Nie znaleziono pulpitów."});
  Object.assign(TRANSLATIONS["fr"], {"item_width":"Largeur de l’élément (%)","item_width_hint":"100 % = pleine largeur ; 20–100 % réduit le fond et la zone cliquable. Une valeur vide reprend le réglage global.","appearance":"Taille et espacement de la barre","desktop":"Ordinateur","mobile":"Mobile","icon_size":"Taille des icônes","button_gap":"Espacement des boutons","button_height":"Hauteur des boutons","horizontal_padding":"Marge intérieure horizontale","kiosk_fallback":"Barre de secours kiosque","kiosk_fallback_hint":"Si la barre native HA est masquée, afficher une petite barre HA Nav Manager.","kiosk_bar":"Barre kiosque","tab_toolbar":"Barre d’outils","tab_sidebar":"Barre latérale","tab_dashboards":"Tableaux de bord","sidebar_intro":"Personnalisez la barre latérale native HA sans changer le contenu des tableaux de bord.","sidebar_enabled":"Activer la personnalisation latérale","global_appearance":"Apparence globale","native_items":"Éléments natifs et tableaux de bord","custom_items":"Éléments latéraux personnalisés","add_sidebar_item":"+ Ajouter un élément latéral","no_sidebar_items":"Aucun élément latéral trouvé.","visible":"Visible","reset_item":"Réinitialiser l’élément","reset_sidebar_global":"Réinitialiser l’apparence globale","remove_overrides":"Supprimer tous les réglages individuels","restore_native":"Rétablir l’apparence native","icon_color":"Couleur de l’icône","text_color":"Couleur du texte","hover_background":"Fond au survol","hover_color":"Texte / icône au survol","active_background":"Fond actif","active_text_color":"Couleur du texte actif","active_icon_color":"Couleur de l’icône active","border_radius":"Rayon des coins","item_height":"Hauteur de l’élément","spacing":"Espacement des éléments","text_size":"Taille du texte","inherit":"Utiliser le réglage global","filter_items":"Filtrer les éléments…","native_item":"Élément natif","dashboard_manager_intro":"Créez et modifiez les métadonnées des tableaux de bord. Les cartes Lovelace restent inchangées.","existing_dashboards":"Tableaux de bord existants","create_dashboard":"Créer un tableau de bord","dashboard_title":"Titre du tableau de bord","dashboard_path":"Chemin URL","show_sidebar":"Afficher dans la barre latérale","admin_only":"Administrateurs uniquement","create":"Créer","update":"Mettre à jour","delete":"Supprimer","confirm_delete_dashboard":"Supprimer ce tableau de bord ? Sa configuration Lovelace sera aussi supprimée.","storage_dashboard":"Tableau de bord stocké","yaml_dashboard":"Tableau de bord YAML (lecture seule)","dashboard_created":"Tableau de bord créé.","dashboard_updated":"Tableau de bord mis à jour.","dashboard_deleted":"Tableau de bord supprimé.","dashboard_api_error":"Échec de l’opération : ","path_hint":"Complétez le préfixe dashboard-, par exemple dashboard-salon (minuscules, chiffres, _ et -). Le préfixe seul ne suffit pas.","native_sidebar_restored":"Apparence native rétablie.","sidebar_global_reset":"Apparence globale réinitialisée.","overrides_removed":"Tous les réglages individuels supprimés.","reset_appearance":"Réinitialiser tailles et espacements","reset_appearance_done":"Tailles et espacements réinitialisés.","fine_spacing":"Espacement fin","spacing_step_hint":"Des pas de 0,5 px sont possibles.","color_palette":"Palette de couleurs","hue":"Teinte","saturation":"Saturation","brightness":"Luminosité","mobile_palette":"Couleurs rapides","more_colors":"Plus de couleurs","custom_picker_title":"Choisir une couleur","apply":"Appliquer","cancel":"Annuler","icon_correction":"Correction de taille de l’icône","button_correction":"Correction de taille du bouton / fond","correction_hint":"0 % = taille globale, négatif = plus petit, positif = plus grand","colors":"Couleurs","basic":"Général","size_appearance":"Taille / apparence","background_opacity":"Opacité du fond","hover_opacity":"Opacité au survol","active_opacity":"Opacité active","dashboard_path_fixed":"HA ne permet pas de changer l’URL d’un tableau de bord existant via cette API.","dashboard_admin_required":"La gestion des tableaux de bord nécessite un administrateur.","dashboard_title_required":"Saisissez un titre de tableau de bord.","reset_icon":"Rétablir l’icône par défaut","icon_picker_unavailable":"Cette interface HA n’a pas encore chargé le sélecteur visuel d’icônes. Il apparaîtra automatiquement dès sa disponibilité.","ordering_hint":"L’ordre enregistré dans Sidebar Manager est prioritaire, puis l’ordre natif de l’utilisateur. Les autres tableaux restent à la fin dans l’ordre source. Ouvrir ou actualiser n’enregistre aucun ordre.","no_dashboards":"Aucun tableau de bord trouvé."});
  Object.assign(TRANSLATIONS["es"], {"item_width":"Ancho del elemento (%)","item_width_hint":"100% = ancho completo; 20–100% reduce el fondo y la zona pulsable. Un valor vacío hereda el ajuste global.","appearance":"Tamaño y espaciado de la barra","desktop":"Escritorio","mobile":"Móvil","icon_size":"Tamaño de iconos","button_gap":"Espacio entre botones","button_height":"Altura de botones","horizontal_padding":"Relleno horizontal","kiosk_fallback":"Barra alternativa de quiosco","kiosk_fallback_hint":"Si la barra nativa de HA está oculta, mostrar una barra pequeña de HA Nav Manager.","kiosk_bar":"Barra de quiosco","tab_toolbar":"Barra de herramientas","tab_sidebar":"Barra lateral","tab_dashboards":"Paneles","sidebar_intro":"Personaliza la barra lateral nativa de HA sin cambiar el contenido de los paneles.","sidebar_enabled":"Activar personalización lateral","global_appearance":"Apariencia global","native_items":"Elementos nativos y paneles","custom_items":"Elementos laterales personalizados","add_sidebar_item":"+ Añadir elemento lateral","no_sidebar_items":"No se encontraron elementos laterales.","visible":"Visible","reset_item":"Restablecer elemento","reset_sidebar_global":"Restablecer apariencia global","remove_overrides":"Eliminar todos los ajustes individuales","restore_native":"Restaurar apariencia nativa","icon_color":"Color del icono","text_color":"Color del texto","hover_background":"Fondo al pasar el cursor","hover_color":"Texto / icono al pasar el cursor","active_background":"Fondo activo","active_text_color":"Color del texto activo","active_icon_color":"Color del icono activo","border_radius":"Radio de las esquinas","item_height":"Altura del elemento","spacing":"Espacio entre elementos","text_size":"Tamaño del texto","inherit":"Usar valor global","filter_items":"Filtrar elementos…","native_item":"Elemento nativo","dashboard_manager_intro":"Crea y edita los metadatos de los paneles. Las tarjetas Lovelace no cambian.","existing_dashboards":"Paneles existentes","create_dashboard":"Crear panel","dashboard_title":"Título del panel","dashboard_path":"Ruta URL","show_sidebar":"Mostrar en barra lateral","admin_only":"Solo administradores","create":"Crear","update":"Actualizar","delete":"Eliminar","confirm_delete_dashboard":"¿Eliminar este panel? También se eliminará su configuración Lovelace.","storage_dashboard":"Panel almacenado","yaml_dashboard":"Panel YAML (solo lectura)","dashboard_created":"Panel creado.","dashboard_updated":"Panel actualizado.","dashboard_deleted":"Panel eliminado.","dashboard_api_error":"La operación del panel falló: ","path_hint":"Completa el prefijo dashboard-, p. ej. dashboard-salon (minúsculas, cifras, _ y -). El prefijo solo no basta.","native_sidebar_restored":"Apariencia nativa restaurada.","sidebar_global_reset":"Apariencia global restablecida.","overrides_removed":"Todos los ajustes individuales eliminados.","reset_appearance":"Restablecer tamaños y espacios","reset_appearance_done":"Tamaños y espacios restablecidos.","fine_spacing":"Espaciado fino","spacing_step_hint":"Puedes usar pasos de 0,5 px.","color_palette":"Paleta de colores","hue":"Tono","saturation":"Saturación","brightness":"Brillo","mobile_palette":"Colores rápidos","more_colors":"Más colores","custom_picker_title":"Elegir color","apply":"Aplicar","cancel":"Cancelar","icon_correction":"Corrección del tamaño del icono","button_correction":"Corrección del tamaño del botón / fondo","correction_hint":"0 % = tamaño global, negativo = menor, positivo = mayor","colors":"Colores","basic":"Básico","size_appearance":"Tamaño / apariencia","background_opacity":"Opacidad del fondo","hover_opacity":"Opacidad al pasar el cursor","active_opacity":"Opacidad activa","dashboard_path_fixed":"HA no permite cambiar la URL de un panel existente mediante esta API.","dashboard_admin_required":"La gestión de paneles requiere un administrador.","dashboard_title_required":"Introduce el título del panel.","reset_icon":"Restaurar icono predeterminado","icon_picker_unavailable":"Esta interfaz de HA aún no ha cargado el selector visual de iconos. Aparecerá automáticamente cuando esté disponible.","ordering_hint":"Tiene prioridad el orden guardado de Sidebar Manager, seguido del orden nativo del usuario. Los demás paneles conservan el orden de origen al final. Abrir o actualizar no guarda el orden.","no_dashboards":"No se encontraron paneles."});
  Object.assign(TRANSLATIONS["hu"], {"item_width":"Elem szélessége (%)","item_width_hint":"100% = teljes szélesség; 20–100% rövidíti a hátteret és a kattintható területet. Az üres érték az általános beállítást örökli.","appearance":"Eszköztár mérete és térközei","desktop":"Asztali gép","mobile":"Mobil","icon_size":"Ikonméret","button_gap":"Gombok közötti térköz","button_height":"Gombmagasság","horizontal_padding":"Vízszintes belső margó","kiosk_fallback":"Tartalék kioszksáv","kiosk_fallback_hint":"Ha a HA natív eszköztára rejtett, jelenjen meg egy kis HA Nav Manager sáv.","kiosk_bar":"Kioszk eszköztár","tab_toolbar":"Eszköztár","tab_sidebar":"Oldalsáv","tab_dashboards":"Irányítópultok","sidebar_intro":"A HA natív oldalsávjának testreszabása az irányítópultok tartalmának módosítása nélkül.","sidebar_enabled":"Oldalsáv testreszabásának engedélyezése","global_appearance":"Általános megjelenés","native_items":"Natív elemek és irányítópultok","custom_items":"Egyéni oldalsávelemek","add_sidebar_item":"+ Oldalsávelem hozzáadása","no_sidebar_items":"Nem találhatók oldalsávelemek.","visible":"Látható","reset_item":"Elem visszaállítása","reset_sidebar_global":"Általános megjelenés visszaállítása","remove_overrides":"Minden egyéni elembeállítás törlése","restore_native":"Natív megjelenés visszaállítása","icon_color":"Ikonszín","text_color":"Szövegszín","hover_background":"Háttér rámutatáskor","hover_color":"Szöveg / ikon rámutatáskor","active_background":"Aktív háttér","active_text_color":"Aktív szövegszín","active_icon_color":"Aktív ikonszín","border_radius":"Saroksugár","item_height":"Elem magassága","spacing":"Elemek térköze","text_size":"Szövegméret","inherit":"Általános alapérték használata","filter_items":"Oldalsávelemek szűrése…","native_item":"Natív elem","dashboard_manager_intro":"Irányítópultok metaadatainak létrehozása és szerkesztése. A Lovelace-kártyák nem változnak.","existing_dashboards":"Meglévő irányítópultok","create_dashboard":"Irányítópult létrehozása","dashboard_title":"Irányítópult címe","dashboard_path":"URL-útvonal","show_sidebar":"Megjelenítés az oldalsávon","admin_only":"Csak rendszergazdáknak","create":"Létrehozás","update":"Frissítés","delete":"Törlés","confirm_delete_dashboard":"Törli ezt az irányítópultot? A Lovelace-konfigurációja is törlődik.","storage_dashboard":"Tárolt irányítópult","yaml_dashboard":"YAML-irányítópult (csak olvasható)","dashboard_created":"Irányítópult létrehozva.","dashboard_updated":"Irányítópult frissítve.","dashboard_deleted":"Irányítópult törölve.","dashboard_api_error":"Az irányítópult művelete sikertelen: ","path_hint":"Egészítse ki a dashboard- előtagot, pl. dashboard-nappali (kisbetűk, számok, _ és -). Az előtag önmagában nem elég.","native_sidebar_restored":"Natív megjelenés visszaállítva.","sidebar_global_reset":"Általános megjelenés visszaállítva.","overrides_removed":"Minden egyéni elembeállítás törölve.","reset_appearance":"Méretek és térközök visszaállítása","reset_appearance_done":"Méretek és térközök visszaállítva.","fine_spacing":"Finom térköz","spacing_step_hint":"0,5 px-es lépések használhatók.","color_palette":"Színpaletta","hue":"Színárnyalat","saturation":"Telítettség","brightness":"Fényerő","mobile_palette":"Gyors színek","more_colors":"További színek","custom_picker_title":"Szín kiválasztása","apply":"Alkalmazás","cancel":"Mégse","icon_correction":"Ikonméret korrekciója","button_correction":"Gomb / háttér méretkorrekciója","correction_hint":"0% = általános méret, negatív = kisebb, pozitív = nagyobb","colors":"Színek","basic":"Alapok","size_appearance":"Méret / megjelenés","background_opacity":"Háttér fedettsége","hover_opacity":"Fedettség rámutatáskor","active_opacity":"Aktív fedettség","dashboard_path_fixed":"A HA ezen az API-n nem támogatja a meglévő irányítópult URL-jének módosítását.","dashboard_admin_required":"Az irányítópultok kezeléséhez rendszergazda szükséges.","dashboard_title_required":"Adja meg az irányítópult címét.","reset_icon":"Alapértelmezett ikon visszaállítása","icon_picker_unavailable":"A HA felülete még nem töltötte be a vizuális ikonválasztót. Automatikusan megjelenik, amint elérhető.","ordering_hint":"Elsőbbséget élvez a Sidebar Manager mentett sorrendje, majd a felhasználó natív sorrendje. A többi irányítópult a végén forrássorrendben marad. A megnyitás és frissítés nem ment sorrendet.","no_dashboards":"Nem találhatók irányítópultok."});
  Object.assign(TRANSLATIONS["nl"], {"item_width":"Itembreedte (%)","item_width_hint":"100% = volledige breedte; 20–100% verkleint achtergrond en klikgebied. Een lege itemwaarde gebruikt de algemene instelling.","appearance":"Grootte en afstanden van de werkbalk","desktop":"Desktop","mobile":"Mobiel","icon_size":"Pictogramgrootte","button_gap":"Afstand tussen knoppen","button_height":"Knophoogte","horizontal_padding":"Horizontale binnenruimte","kiosk_fallback":"Kiosk-reservebalk","kiosk_fallback_hint":"Toon een kleine HA Nav Manager-balk als de native HA-werkbalk verborgen is.","kiosk_bar":"Kioskwerkbalk","tab_toolbar":"Werkbalk","tab_sidebar":"Zijbalk","tab_dashboards":"Dashboards","sidebar_intro":"Pas de native HA-zijbalk aan zonder dashboardinhoud te veranderen.","sidebar_enabled":"Zijbalkaanpassingen inschakelen","global_appearance":"Algemene weergave","native_items":"Native items en dashboards","custom_items":"Eigen zijbalkitems","add_sidebar_item":"+ Zijbalkitem toevoegen","no_sidebar_items":"Geen zijbalkitems gevonden.","visible":"Zichtbaar","reset_item":"Item herstellen","reset_sidebar_global":"Algemene weergave herstellen","remove_overrides":"Alle itemaanpassingen verwijderen","restore_native":"Native weergave herstellen","icon_color":"Pictogramkleur","text_color":"Tekstkleur","hover_background":"Achtergrond bij aanwijzen","hover_color":"Tekst / pictogram bij aanwijzen","active_background":"Actieve achtergrond","active_text_color":"Actieve tekstkleur","active_icon_color":"Actieve pictogramkleur","border_radius":"Hoekradius","item_height":"Itemhoogte","spacing":"Itemafstand","text_size":"Tekstgrootte","inherit":"Algemene standaard gebruiken","filter_items":"Zijbalkitems filteren…","native_item":"Native item","dashboard_manager_intro":"Maak en bewerk dashboardmetadata. Lovelace-kaarten blijven ongewijzigd.","existing_dashboards":"Bestaande dashboards","create_dashboard":"Dashboard maken","dashboard_title":"Dashboardtitel","dashboard_path":"URL-pad","show_sidebar":"In zijbalk tonen","admin_only":"Alleen beheerders","create":"Maken","update":"Bijwerken","delete":"Verwijderen","confirm_delete_dashboard":"Dit dashboard verwijderen? De Lovelace-configuratie wordt ook verwijderd.","storage_dashboard":"Opgeslagen dashboard","yaml_dashboard":"YAML-dashboard (alleen-lezen)","dashboard_created":"Dashboard gemaakt.","dashboard_updated":"Dashboard bijgewerkt.","dashboard_deleted":"Dashboard verwijderd.","dashboard_api_error":"Dashboardbewerking mislukt: ","path_hint":"Vul het voorvoegsel dashboard- aan, bijv. dashboard-woonkamer (kleine letters, cijfers, _ en -). Alleen het voorvoegsel is onvolledig.","native_sidebar_restored":"Native weergave hersteld.","sidebar_global_reset":"Algemene weergave hersteld.","overrides_removed":"Alle itemaanpassingen verwijderd.","reset_appearance":"Grootte en afstanden herstellen","reset_appearance_done":"Grootte en afstanden hersteld.","fine_spacing":"Fijne afstand","spacing_step_hint":"Stappen van 0,5 px zijn mogelijk.","color_palette":"Kleurenpalet","hue":"Tint","saturation":"Verzadiging","brightness":"Helderheid","mobile_palette":"Snelle kleuren","more_colors":"Meer kleuren","custom_picker_title":"Kleur kiezen","apply":"Toepassen","cancel":"Annuleren","icon_correction":"Correctie pictogramgrootte","button_correction":"Correctie knop- / achtergrondgrootte","correction_hint":"0% = algemene grootte, negatief = kleiner, positief = groter","colors":"Kleuren","basic":"Basis","size_appearance":"Grootte / weergave","background_opacity":"Achtergronddekking","hover_opacity":"Dekking bij aanwijzen","active_opacity":"Actieve dekking","dashboard_path_fixed":"HA ondersteunt geen wijziging van bestaande dashboard-URL’s via deze API.","dashboard_admin_required":"Dashboardbeheer vereist een beheerder.","dashboard_title_required":"Voer een dashboardtitel in.","reset_icon":"Standaardpictogram herstellen","icon_picker_unavailable":"Deze HA-interface heeft de visuele pictogramkiezer nog niet geladen. Deze verschijnt automatisch zodra beschikbaar.","ordering_hint":"De opgeslagen Sidebar Manager-volgorde gaat voor, daarna de native gebruikersvolgorde. Overige dashboards blijven achteraan in bronvolgorde. Openen of vernieuwen slaat geen volgorde op.","no_dashboards":"Geen dashboards gevonden."});
  Object.assign(TRANSLATIONS["pt"], {"item_width":"Largura do item (%)","item_width_hint":"100% = largura total; 20–100% reduz o fundo e a área clicável. Um valor vazio herda a definição global.","appearance":"Tamanho e espaçamento da barra","desktop":"Computador","mobile":"Telemóvel","icon_size":"Tamanho dos ícones","button_gap":"Espaço entre botões","button_height":"Altura dos botões","horizontal_padding":"Espaçamento interno horizontal","kiosk_fallback":"Barra alternativa de quiosque","kiosk_fallback_hint":"Se a barra nativa do HA estiver oculta, mostrar uma pequena barra do HA Nav Manager.","kiosk_bar":"Barra de quiosque","tab_toolbar":"Barra de ferramentas","tab_sidebar":"Barra lateral","tab_dashboards":"Painéis","sidebar_intro":"Personalize a barra lateral nativa do HA sem alterar o conteúdo dos painéis.","sidebar_enabled":"Ativar personalização lateral","global_appearance":"Aspeto global","native_items":"Itens nativos e painéis","custom_items":"Itens laterais personalizados","add_sidebar_item":"+ Adicionar item lateral","no_sidebar_items":"Não foram encontrados itens laterais.","visible":"Visível","reset_item":"Repor item","reset_sidebar_global":"Repor aspeto global","remove_overrides":"Remover todas as personalizações dos itens","restore_native":"Restaurar aspeto nativo","icon_color":"Cor do ícone","text_color":"Cor do texto","hover_background":"Fundo ao passar o rato","hover_color":"Texto / ícone ao passar o rato","active_background":"Fundo ativo","active_text_color":"Cor do texto ativo","active_icon_color":"Cor do ícone ativo","border_radius":"Raio dos cantos","item_height":"Altura do item","spacing":"Espaçamento dos itens","text_size":"Tamanho do texto","inherit":"Usar predefinição global","filter_items":"Filtrar itens…","native_item":"Item nativo","dashboard_manager_intro":"Crie e edite metadados dos painéis. Os cartões Lovelace não são alterados.","existing_dashboards":"Painéis existentes","create_dashboard":"Criar painel","dashboard_title":"Título do painel","dashboard_path":"Caminho URL","show_sidebar":"Mostrar na barra lateral","admin_only":"Apenas administradores","create":"Criar","update":"Atualizar","delete":"Eliminar","confirm_delete_dashboard":"Eliminar este painel? A configuração Lovelace também será removida.","storage_dashboard":"Painel armazenado","yaml_dashboard":"Painel YAML (só de leitura)","dashboard_created":"Painel criado.","dashboard_updated":"Painel atualizado.","dashboard_deleted":"Painel eliminado.","dashboard_api_error":"A operação do painel falhou: ","path_hint":"Complete o prefixo dashboard-, por exemplo dashboard-sala (minúsculas, algarismos, _ e -). O prefixo sozinho não chega.","native_sidebar_restored":"Aspeto nativo restaurado.","sidebar_global_reset":"Aspeto global reposto.","overrides_removed":"Todas as personalizações dos itens removidas.","reset_appearance":"Repor tamanhos e espaçamentos","reset_appearance_done":"Tamanhos e espaçamentos repostos.","fine_spacing":"Espaçamento fino","spacing_step_hint":"Pode usar passos de 0,5 px.","color_palette":"Paleta de cores","hue":"Matiz","saturation":"Saturação","brightness":"Brilho","mobile_palette":"Cores rápidas","more_colors":"Mais cores","custom_picker_title":"Escolher cor","apply":"Aplicar","cancel":"Cancelar","icon_correction":"Correção do tamanho do ícone","button_correction":"Correção do tamanho do botão / fundo","correction_hint":"0% = tamanho global, negativo = menor, positivo = maior","colors":"Cores","basic":"Básico","size_appearance":"Tamanho / aspeto","background_opacity":"Opacidade do fundo","hover_opacity":"Opacidade ao passar o rato","active_opacity":"Opacidade ativa","dashboard_path_fixed":"O HA não permite alterar o URL de um painel existente através desta API.","dashboard_admin_required":"A gestão de painéis requer um administrador.","dashboard_title_required":"Introduza o título do painel.","reset_icon":"Restaurar ícone predefinido","icon_picker_unavailable":"Esta interface do HA ainda não carregou o seletor visual de ícones. Aparecerá automaticamente quando estiver disponível.","ordering_hint":"A ordem guardada no Sidebar Manager tem prioridade, seguida da ordem nativa do utilizador. Os restantes painéis ficam no fim pela ordem de origem. Abrir ou atualizar não guarda a ordem.","no_dashboards":"Não foram encontrados painéis."});
  Object.assign(TRANSLATIONS["pt-BR"], {"item_width":"Largura do item (%)","item_width_hint":"100% = largura total; 20–100% reduz o fundo e a área clicável. Um valor vazio herda a configuração global.","appearance":"Tamanho e espaçamento da barra","desktop":"Computador","mobile":"Celular","icon_size":"Tamanho dos ícones","button_gap":"Espaço entre botões","button_height":"Altura dos botões","horizontal_padding":"Preenchimento horizontal","kiosk_fallback":"Barra alternativa de quiosque","kiosk_fallback_hint":"Se a barra nativa do HA estiver oculta, mostrar uma pequena barra do HA Nav Manager.","kiosk_bar":"Barra de quiosque","tab_toolbar":"Barra de ferramentas","tab_sidebar":"Barra lateral","tab_dashboards":"Painéis","sidebar_intro":"Personalize a barra lateral nativa do HA sem alterar o conteúdo dos painéis.","sidebar_enabled":"Ativar personalização lateral","global_appearance":"Aparência global","native_items":"Itens nativos e painéis","custom_items":"Itens laterais personalizados","add_sidebar_item":"+ Adicionar item lateral","no_sidebar_items":"Nenhum item lateral encontrado.","visible":"Visível","reset_item":"Redefinir item","reset_sidebar_global":"Redefinir aparência global","remove_overrides":"Remover todas as personalizações dos itens","restore_native":"Restaurar aparência nativa","icon_color":"Cor do ícone","text_color":"Cor do texto","hover_background":"Fundo ao passar o mouse","hover_color":"Texto / ícone ao passar o mouse","active_background":"Fundo ativo","active_text_color":"Cor do texto ativo","active_icon_color":"Cor do ícone ativo","border_radius":"Raio dos cantos","item_height":"Altura do item","spacing":"Espaçamento dos itens","text_size":"Tamanho do texto","inherit":"Usar padrão global","filter_items":"Filtrar itens…","native_item":"Item nativo","dashboard_manager_intro":"Crie e edite metadados dos painéis. Os cartões Lovelace não são alterados.","existing_dashboards":"Painéis existentes","create_dashboard":"Criar painel","dashboard_title":"Título do painel","dashboard_path":"Caminho URL","show_sidebar":"Mostrar na barra lateral","admin_only":"Somente administradores","create":"Criar","update":"Atualizar","delete":"Excluir","confirm_delete_dashboard":"Excluir este painel? A configuração Lovelace também será removida.","storage_dashboard":"Painel armazenado","yaml_dashboard":"Painel YAML (somente leitura)","dashboard_created":"Painel criado.","dashboard_updated":"Painel atualizado.","dashboard_deleted":"Painel excluído.","dashboard_api_error":"A operação do painel falhou: ","path_hint":"Complete o prefixo dashboard-, por exemplo dashboard-sala (minúsculas, números, _ e -). Apenas o prefixo não basta.","native_sidebar_restored":"Aparência nativa restaurada.","sidebar_global_reset":"Aparência global redefinida.","overrides_removed":"Todas as personalizações dos itens removidas.","reset_appearance":"Redefinir tamanhos e espaçamentos","reset_appearance_done":"Tamanhos e espaçamentos redefinidos.","fine_spacing":"Espaçamento fino","spacing_step_hint":"Você pode usar incrementos de 0,5 px.","color_palette":"Paleta de cores","hue":"Matiz","saturation":"Saturação","brightness":"Brilho","mobile_palette":"Cores rápidas","more_colors":"Mais cores","custom_picker_title":"Escolher cor","apply":"Aplicar","cancel":"Cancelar","icon_correction":"Correção do tamanho do ícone","button_correction":"Correção do tamanho do botão / fundo","correction_hint":"0% = tamanho global, negativo = menor, positivo = maior","colors":"Cores","basic":"Básico","size_appearance":"Tamanho / aparência","background_opacity":"Opacidade do fundo","hover_opacity":"Opacidade ao passar o mouse","active_opacity":"Opacidade ativa","dashboard_path_fixed":"O HA não permite alterar a URL de um painel existente por esta API.","dashboard_admin_required":"O gerenciamento de painéis exige um administrador.","dashboard_title_required":"Digite o título do painel.","reset_icon":"Restaurar ícone padrão","icon_picker_unavailable":"Esta interface do HA ainda não carregou o seletor visual de ícones. Ele aparecerá automaticamente quando estiver disponível.","ordering_hint":"A ordem salva no Sidebar Manager tem prioridade, seguida da ordem nativa do usuário. Os demais painéis ficam no fim na ordem de origem. Abrir ou atualizar não salva a ordem.","no_dashboards":"Nenhum painel encontrado."});
  Object.assign(TRANSLATIONS["ro"], {"item_width":"Lățimea elementului (%)","item_width_hint":"100% = lățime completă; 20–100% reduce fundalul și zona de clic. Valoarea goală moștenește setarea globală.","appearance":"Dimensiunea și spațierea barei","desktop":"Calculator","mobile":"Mobil","icon_size":"Dimensiunea pictogramelor","button_gap":"Spațiu între butoane","button_height":"Înălțimea butoanelor","horizontal_padding":"Spațiere interioară orizontală","kiosk_fallback":"Bară alternativă chioșc","kiosk_fallback_hint":"Dacă bara nativă HA este ascunsă, afișează o bară mică HA Nav Manager.","kiosk_bar":"Bară chioșc","tab_toolbar":"Bară de instrumente","tab_sidebar":"Bară laterală","tab_dashboards":"Panouri","sidebar_intro":"Personalizează bara laterală nativă HA fără a modifica conținutul panourilor.","sidebar_enabled":"Activează personalizarea laterală","global_appearance":"Aspect global","native_items":"Elemente native și panouri","custom_items":"Elemente laterale personalizate","add_sidebar_item":"+ Adaugă element lateral","no_sidebar_items":"Nu s-au găsit elemente laterale.","visible":"Vizibil","reset_item":"Resetează elementul","reset_sidebar_global":"Resetează aspectul global","remove_overrides":"Elimină toate setările individuale","restore_native":"Restabilește aspectul nativ","icon_color":"Culoarea pictogramei","text_color":"Culoarea textului","hover_background":"Fundal la survolare","hover_color":"Text / pictogramă la survolare","active_background":"Fundal activ","active_text_color":"Culoarea textului activ","active_icon_color":"Culoarea pictogramei active","border_radius":"Raza colțurilor","item_height":"Înălțimea elementului","spacing":"Spațierea elementelor","text_size":"Dimensiunea textului","inherit":"Folosește valoarea globală","filter_items":"Filtrează elementele…","native_item":"Element nativ","dashboard_manager_intro":"Creează și editează metadatele panourilor. Cardurile Lovelace nu se modifică.","existing_dashboards":"Panouri existente","create_dashboard":"Creează panou","dashboard_title":"Titlul panoului","dashboard_path":"Cale URL","show_sidebar":"Afișează în bara laterală","admin_only":"Doar administratori","create":"Creează","update":"Actualizează","delete":"Șterge","confirm_delete_dashboard":"Ștergi acest panou? Configurația sa Lovelace va fi de asemenea eliminată.","storage_dashboard":"Panou stocat","yaml_dashboard":"Panou YAML (doar citire)","dashboard_created":"Panou creat.","dashboard_updated":"Panou actualizat.","dashboard_deleted":"Panou șters.","dashboard_api_error":"Operația panoului a eșuat: ","path_hint":"Completează prefixul dashboard-, de exemplu dashboard-salon (litere mici, cifre, _ și -). Prefixul singur nu este suficient.","native_sidebar_restored":"Aspectul nativ a fost restabilit.","sidebar_global_reset":"Aspectul global a fost resetat.","overrides_removed":"Toate setările individuale au fost eliminate.","reset_appearance":"Resetează dimensiunile și spațierea","reset_appearance_done":"Dimensiunile și spațierea au fost resetate.","fine_spacing":"Spațiere fină","spacing_step_hint":"Poți folosi pași de 0,5 px.","color_palette":"Paletă de culori","hue":"Nuanță","saturation":"Saturație","brightness":"Luminozitate","mobile_palette":"Culori rapide","more_colors":"Mai multe culori","custom_picker_title":"Alege culoarea","apply":"Aplică","cancel":"Anulează","icon_correction":"Corecția dimensiunii pictogramei","button_correction":"Corecția dimensiunii butonului / fundalului","correction_hint":"0% = dimensiune globală, negativ = mai mic, pozitiv = mai mare","colors":"Culori","basic":"De bază","size_appearance":"Dimensiune / aspect","background_opacity":"Opacitatea fundalului","hover_opacity":"Opacitate la survolare","active_opacity":"Opacitate activă","dashboard_path_fixed":"HA nu permite schimbarea URL-ului unui panou existent prin acest API.","dashboard_admin_required":"Gestionarea panourilor necesită un administrator.","dashboard_title_required":"Introdu titlul panoului.","reset_icon":"Restabilește pictograma implicită","icon_picker_unavailable":"Această interfață HA nu a încărcat încă selectorul vizual de pictograme. Va apărea automat când este disponibil.","ordering_hint":"Ordinea salvată în Sidebar Manager are prioritate, apoi ordinea nativă a utilizatorului. Celelalte panouri rămân la final în ordinea sursei. Deschiderea și reîmprospătarea nu salvează ordinea.","no_dashboards":"Nu s-au găsit panouri."});
  Object.assign(TRANSLATIONS["uk"], {"item_width":"Ширина елемента (%)","item_width_hint":"100% = повна ширина; 20–100% зменшує тло й область натискання. Порожнє значення успадковує загальне налаштування.","appearance":"Розмір та відступи панелі","desktop":"Комп’ютер","mobile":"Мобільний","icon_size":"Розмір піктограм","button_gap":"Відстань між кнопками","button_height":"Висота кнопок","horizontal_padding":"Горизонтальні внутрішні відступи","kiosk_fallback":"Резервна панель кіоску","kiosk_fallback_hint":"Якщо рідну панель HA приховано, показати невелику панель HA Nav Manager.","kiosk_bar":"Панель кіоску","tab_toolbar":"Панель інструментів","tab_sidebar":"Бічна панель","tab_dashboards":"Панелі огляду","sidebar_intro":"Налаштування рідної бічної панелі HA без зміни вмісту панелей огляду.","sidebar_enabled":"Увімкнути налаштування бічної панелі","global_appearance":"Загальний вигляд","native_items":"Рідні елементи та панелі огляду","custom_items":"Власні елементи бічної панелі","add_sidebar_item":"+ Додати елемент","no_sidebar_items":"Елементів бічної панелі не знайдено.","visible":"Видимий","reset_item":"Скинути елемент","reset_sidebar_global":"Скинути загальний вигляд","remove_overrides":"Видалити всі індивідуальні налаштування","restore_native":"Відновити рідний вигляд","icon_color":"Колір піктограми","text_color":"Колір тексту","hover_background":"Тло при наведенні","hover_color":"Текст / піктограма при наведенні","active_background":"Активне тло","active_text_color":"Колір активного тексту","active_icon_color":"Колір активної піктограми","border_radius":"Радіус кутів","item_height":"Висота елемента","spacing":"Відстань між елементами","text_size":"Розмір тексту","inherit":"Використовувати загальне значення","filter_items":"Фільтрувати елементи…","native_item":"Рідний елемент","dashboard_manager_intro":"Створення та редагування метаданих панелей огляду. Картки Lovelace не змінюються.","existing_dashboards":"Наявні панелі огляду","create_dashboard":"Створити панель огляду","dashboard_title":"Назва панелі огляду","dashboard_path":"Шлях URL","show_sidebar":"Показувати в бічній панелі","admin_only":"Лише адміністратори","create":"Створити","update":"Оновити","delete":"Видалити","confirm_delete_dashboard":"Видалити цю панель огляду? Її конфігурацію Lovelace також буде видалено.","storage_dashboard":"Панель у сховищі","yaml_dashboard":"Панель YAML (лише читання)","dashboard_created":"Панель створено.","dashboard_updated":"Панель оновлено.","dashboard_deleted":"Панель видалено.","dashboard_api_error":"Операція з панеллю не вдалася: ","path_hint":"Доповніть префікс dashboard-, наприклад dashboard-vitalnia (малі латинські літери, цифри, _ та -). Самого префікса недостатньо.","native_sidebar_restored":"Рідний вигляд відновлено.","sidebar_global_reset":"Загальний вигляд скинуто.","overrides_removed":"Усі індивідуальні налаштування видалено.","reset_appearance":"Скинути розміри та відступи","reset_appearance_done":"Розміри та відступи скинуто.","fine_spacing":"Точні відступи","spacing_step_hint":"Можна використовувати крок 0,5 px.","color_palette":"Палітра кольорів","hue":"Відтінок","saturation":"Насиченість","brightness":"Яскравість","mobile_palette":"Швидкі кольори","more_colors":"Інші кольори","custom_picker_title":"Вибрати колір","apply":"Застосувати","cancel":"Скасувати","icon_correction":"Корекція розміру піктограми","button_correction":"Корекція розміру кнопки / тла","correction_hint":"0% = загальний розмір, від’ємне = менше, додатне = більше","colors":"Кольори","basic":"Основне","size_appearance":"Розмір / вигляд","background_opacity":"Непрозорість тла","hover_opacity":"Непрозорість при наведенні","active_opacity":"Непрозорість активного елемента","dashboard_path_fixed":"HA не підтримує зміну URL наявної панелі через цей API.","dashboard_admin_required":"Керування панелями потребує прав адміністратора.","dashboard_title_required":"Введіть назву панелі.","reset_icon":"Відновити типову піктограму","icon_picker_unavailable":"Цей інтерфейс HA ще не завантажив візуальний вибір піктограм. Він з’явиться автоматично, коли стане доступним.","ordering_hint":"Перевагу має збережений порядок Sidebar Manager, потім рідний порядок користувача. Інші панелі залишаються в кінці в порядку джерела. Відкриття й оновлення не зберігають порядок.","no_dashboards":"Панелей огляду не знайдено."});
  Object.assign(TRANSLATIONS["ru"], {"item_width":"Ширина элемента (%)","item_width_hint":"100% = полная ширина; 20–100% уменьшает фон и область нажатия. Пустое значение наследует общую настройку.","appearance":"Размер и отступы панели","desktop":"Компьютер","mobile":"Мобильный","icon_size":"Размер значков","button_gap":"Расстояние между кнопками","button_height":"Высота кнопок","horizontal_padding":"Горизонтальные внутренние отступы","kiosk_fallback":"Резервная панель киоска","kiosk_fallback_hint":"Если родная панель HA скрыта, показать небольшую панель HA Nav Manager.","kiosk_bar":"Панель киоска","tab_toolbar":"Панель инструментов","tab_sidebar":"Боковая панель","tab_dashboards":"Панели обзора","sidebar_intro":"Настройка родной боковой панели HA без изменения содержимого панелей обзора.","sidebar_enabled":"Включить настройку боковой панели","global_appearance":"Общий вид","native_items":"Родные элементы и панели обзора","custom_items":"Свои элементы боковой панели","add_sidebar_item":"+ Добавить элемент","no_sidebar_items":"Элементы боковой панели не найдены.","visible":"Видимый","reset_item":"Сбросить элемент","reset_sidebar_global":"Сбросить общий вид","remove_overrides":"Удалить все индивидуальные настройки","restore_native":"Восстановить родной вид","icon_color":"Цвет значка","text_color":"Цвет текста","hover_background":"Фон при наведении","hover_color":"Текст / значок при наведении","active_background":"Активный фон","active_text_color":"Цвет активного текста","active_icon_color":"Цвет активного значка","border_radius":"Радиус углов","item_height":"Высота элемента","spacing":"Расстояние между элементами","text_size":"Размер текста","inherit":"Использовать общее значение","filter_items":"Фильтровать элементы…","native_item":"Родной элемент","dashboard_manager_intro":"Создание и изменение метаданных панелей обзора. Карточки Lovelace не меняются.","existing_dashboards":"Существующие панели обзора","create_dashboard":"Создать панель обзора","dashboard_title":"Название панели обзора","dashboard_path":"Путь URL","show_sidebar":"Показывать в боковой панели","admin_only":"Только администраторы","create":"Создать","update":"Обновить","delete":"Удалить","confirm_delete_dashboard":"Удалить эту панель обзора? Её конфигурация Lovelace также будет удалена.","storage_dashboard":"Панель в хранилище","yaml_dashboard":"Панель YAML (только чтение)","dashboard_created":"Панель создана.","dashboard_updated":"Панель обновлена.","dashboard_deleted":"Панель удалена.","dashboard_api_error":"Операция с панелью не удалась: ","path_hint":"Дополните префикс dashboard-, например dashboard-gostinaya (строчные латинские буквы, цифры, _ и -). Одного префикса недостаточно.","native_sidebar_restored":"Родной вид восстановлен.","sidebar_global_reset":"Общий вид сброшен.","overrides_removed":"Все индивидуальные настройки удалены.","reset_appearance":"Сбросить размеры и отступы","reset_appearance_done":"Размеры и отступы сброшены.","fine_spacing":"Точные отступы","spacing_step_hint":"Можно использовать шаг 0,5 px.","color_palette":"Палитра цветов","hue":"Оттенок","saturation":"Насыщенность","brightness":"Яркость","mobile_palette":"Быстрые цвета","more_colors":"Другие цвета","custom_picker_title":"Выбрать цвет","apply":"Применить","cancel":"Отмена","icon_correction":"Коррекция размера значка","button_correction":"Коррекция размера кнопки / фона","correction_hint":"0% = общий размер, отрицательное = меньше, положительное = больше","colors":"Цвета","basic":"Основное","size_appearance":"Размер / вид","background_opacity":"Непрозрачность фона","hover_opacity":"Непрозрачность при наведении","active_opacity":"Непрозрачность активного элемента","dashboard_path_fixed":"HA не поддерживает изменение URL существующей панели через этот API.","dashboard_admin_required":"Управление панелями требует прав администратора.","dashboard_title_required":"Введите название панели.","reset_icon":"Восстановить значок по умолчанию","icon_picker_unavailable":"Этот интерфейс HA ещё не загрузил визуальный выбор значков. Он появится автоматически, когда станет доступен.","ordering_hint":"Приоритет имеет сохранённый порядок Sidebar Manager, затем родной порядок пользователя. Остальные панели остаются в конце в порядке источника. Открытие и обновление не сохраняют порядок.","no_dashboards":"Панели обзора не найдены."});
  Object.assign(TRANSLATIONS["tr"], {"item_width":"Öğe genişliği (%)","item_width_hint":"%100 = tam genişlik; %20–100 arka planı ve tıklama alanını kısaltır. Boş öğe değeri genel ayarı kullanır.","appearance":"Araç çubuğu boyutu ve aralıkları","desktop":"Masaüstü","mobile":"Mobil","icon_size":"Simge boyutu","button_gap":"Düğmeler arası boşluk","button_height":"Düğme yüksekliği","horizontal_padding":"Yatay iç boşluk","kiosk_fallback":"Yedek kiosk çubuğu","kiosk_fallback_hint":"HA'nın yerel araç çubuğu gizliyse küçük bir HA Nav Manager çubuğu göster.","kiosk_bar":"Kiosk araç çubuğu","tab_toolbar":"Araç çubuğu","tab_sidebar":"Kenar çubuğu","tab_dashboards":"Panolar","sidebar_intro":"Pano içeriğini değiştirmeden HA'nın yerel kenar çubuğunu özelleştirin.","sidebar_enabled":"Kenar çubuğu özelleştirmesini etkinleştir","global_appearance":"Genel görünüm","native_items":"Yerel öğeler ve panolar","custom_items":"Özel kenar çubuğu öğeleri","add_sidebar_item":"+ Kenar çubuğu öğesi ekle","no_sidebar_items":"Kenar çubuğu öğesi bulunamadı.","visible":"Görünür","reset_item":"Öğeyi sıfırla","reset_sidebar_global":"Genel görünümü sıfırla","remove_overrides":"Tüm öğe özelleştirmelerini kaldır","restore_native":"Yerel görünümü geri yükle","icon_color":"Simge rengi","text_color":"Metin rengi","hover_background":"Üzerine gelindiğinde arka plan","hover_color":"Üzerine gelindiğinde metin / simge","active_background":"Etkin arka plan","active_text_color":"Etkin metin rengi","active_icon_color":"Etkin simge rengi","border_radius":"Köşe yarıçapı","item_height":"Öğe yüksekliği","spacing":"Öğe aralığı","text_size":"Metin boyutu","inherit":"Genel varsayılanı kullan","filter_items":"Öğeleri filtrele…","native_item":"Yerel öğe","dashboard_manager_intro":"Pano meta verilerini oluşturun ve düzenleyin. Lovelace kartları değiştirilmez.","existing_dashboards":"Mevcut panolar","create_dashboard":"Pano oluştur","dashboard_title":"Pano başlığı","dashboard_path":"URL yolu","show_sidebar":"Kenar çubuğunda göster","admin_only":"Yalnızca yöneticiler","create":"Oluştur","update":"Güncelle","delete":"Sil","confirm_delete_dashboard":"Bu pano silinsin mi? Lovelace yapılandırması da kaldırılacak.","storage_dashboard":"Depolanan pano","yaml_dashboard":"YAML panosu (salt okunur)","dashboard_created":"Pano oluşturuldu.","dashboard_updated":"Pano güncellendi.","dashboard_deleted":"Pano silindi.","dashboard_api_error":"Pano işlemi başarısız: ","path_hint":"dashboard- önekini tamamlayın, ör. dashboard-salon (küçük Latin harfleri, rakamlar, _ ve -). Yalnızca önek yeterli değildir.","native_sidebar_restored":"Yerel görünüm geri yüklendi.","sidebar_global_reset":"Genel görünüm sıfırlandı.","overrides_removed":"Tüm öğe özelleştirmeleri kaldırıldı.","reset_appearance":"Boyut ve aralıkları sıfırla","reset_appearance_done":"Boyut ve aralıklar sıfırlandı.","fine_spacing":"Hassas aralık","spacing_step_hint":"0,5 px adımlar kullanılabilir.","color_palette":"Renk paleti","hue":"Ton","saturation":"Doygunluk","brightness":"Parlaklık","mobile_palette":"Hızlı renkler","more_colors":"Diğer renkler","custom_picker_title":"Renk seç","apply":"Uygula","cancel":"İptal","icon_correction":"Simge boyutu düzeltmesi","button_correction":"Düğme / arka plan boyutu düzeltmesi","correction_hint":"%0 = genel boyut, negatif = küçük, pozitif = büyük","colors":"Renkler","basic":"Temel","size_appearance":"Boyut / görünüm","background_opacity":"Arka plan opaklığı","hover_opacity":"Üzerine gelindiğinde opaklık","active_opacity":"Etkin opaklık","dashboard_path_fixed":"HA bu API üzerinden mevcut pano URL'sini değiştirmeyi desteklemez.","dashboard_admin_required":"Pano yönetimi yönetici yetkisi gerektirir.","dashboard_title_required":"Bir pano başlığı girin.","reset_icon":"Varsayılan simgeyi geri yükle","icon_picker_unavailable":"Bu HA arayüzü görsel simge seçicisini henüz yüklemedi. Kullanılabilir olduğunda otomatik görünecek.","ordering_hint":"Önce Sidebar Manager'da kaydedilen sıra, ardından kullanıcının yerel sırası uygulanır. Diğer panolar sonda kaynak sırasını korur. Açmak veya yenilemek sırayı kaydetmez.","no_dashboards":"Pano bulunamadı."});
  Object.assign(TRANSLATIONS["el"], {"item_width":"Πλάτος στοιχείου (%)","item_width_hint":"100% = πλήρες πλάτος· 20–100% μειώνει το φόντο και την περιοχή κλικ. Η κενή τιμή κληρονομεί τη γενική ρύθμιση.","appearance":"Μέγεθος και αποστάσεις γραμμής","desktop":"Υπολογιστής","mobile":"Κινητό","icon_size":"Μέγεθος εικονιδίων","button_gap":"Απόσταση κουμπιών","button_height":"Ύψος κουμπιών","horizontal_padding":"Οριζόντιο εσωτερικό περιθώριο","kiosk_fallback":"Εφεδρική γραμμή περιπτέρου","kiosk_fallback_hint":"Αν η εγγενής γραμμή HA είναι κρυφή, εμφάνιση μικρής γραμμής HA Nav Manager.","kiosk_bar":"Γραμμή περιπτέρου","tab_toolbar":"Γραμμή εργαλείων","tab_sidebar":"Πλευρική γραμμή","tab_dashboards":"Πίνακες ελέγχου","sidebar_intro":"Προσαρμόστε την εγγενή πλευρική γραμμή HA χωρίς αλλαγές στο περιεχόμενο των πινάκων.","sidebar_enabled":"Ενεργοποίηση προσαρμογής πλευρικής γραμμής","global_appearance":"Γενική εμφάνιση","native_items":"Εγγενή στοιχεία και πίνακες","custom_items":"Προσαρμοσμένα πλευρικά στοιχεία","add_sidebar_item":"+ Προσθήκη πλευρικού στοιχείου","no_sidebar_items":"Δεν βρέθηκαν πλευρικά στοιχεία.","visible":"Ορατό","reset_item":"Επαναφορά στοιχείου","reset_sidebar_global":"Επαναφορά γενικής εμφάνισης","remove_overrides":"Αφαίρεση όλων των ατομικών ρυθμίσεων","restore_native":"Επαναφορά εγγενούς εμφάνισης","icon_color":"Χρώμα εικονιδίου","text_color":"Χρώμα κειμένου","hover_background":"Φόντο κατά την αιώρηση","hover_color":"Κείμενο / εικονίδιο κατά την αιώρηση","active_background":"Ενεργό φόντο","active_text_color":"Χρώμα ενεργού κειμένου","active_icon_color":"Χρώμα ενεργού εικονιδίου","border_radius":"Ακτίνα γωνιών","item_height":"Ύψος στοιχείου","spacing":"Απόσταση στοιχείων","text_size":"Μέγεθος κειμένου","inherit":"Χρήση γενικής προεπιλογής","filter_items":"Φιλτράρισμα στοιχείων…","native_item":"Εγγενές στοιχείο","dashboard_manager_intro":"Δημιουργία και επεξεργασία μεταδεδομένων πινάκων. Οι κάρτες Lovelace δεν αλλάζουν.","existing_dashboards":"Υπάρχοντες πίνακες","create_dashboard":"Δημιουργία πίνακα","dashboard_title":"Τίτλος πίνακα","dashboard_path":"Διαδρομή URL","show_sidebar":"Εμφάνιση στην πλευρική γραμμή","admin_only":"Μόνο διαχειριστές","create":"Δημιουργία","update":"Ενημέρωση","delete":"Διαγραφή","confirm_delete_dashboard":"Διαγραφή αυτού του πίνακα; Θα αφαιρεθεί και η διαμόρφωση Lovelace.","storage_dashboard":"Αποθηκευμένος πίνακας","yaml_dashboard":"Πίνακας YAML (μόνο ανάγνωση)","dashboard_created":"Ο πίνακας δημιουργήθηκε.","dashboard_updated":"Ο πίνακας ενημερώθηκε.","dashboard_deleted":"Ο πίνακας διαγράφηκε.","dashboard_api_error":"Η ενέργεια πίνακα απέτυχε: ","path_hint":"Συμπληρώστε το πρόθεμα dashboard-, π.χ. dashboard-saloni (πεζά λατινικά, ψηφία, _ και -). Το πρόθεμα μόνο δεν αρκεί.","native_sidebar_restored":"Η εγγενής εμφάνιση επανήλθε.","sidebar_global_reset":"Η γενική εμφάνιση επανήλθε.","overrides_removed":"Όλες οι ατομικές ρυθμίσεις αφαιρέθηκαν.","reset_appearance":"Επαναφορά μεγεθών και αποστάσεων","reset_appearance_done":"Τα μεγέθη και οι αποστάσεις επανήλθαν.","fine_spacing":"Λεπτή απόσταση","spacing_step_hint":"Επιτρέπονται βήματα 0,5 px.","color_palette":"Παλέτα χρωμάτων","hue":"Απόχρωση","saturation":"Κορεσμός","brightness":"Φωτεινότητα","mobile_palette":"Γρήγορα χρώματα","more_colors":"Περισσότερα χρώματα","custom_picker_title":"Επιλογή χρώματος","apply":"Εφαρμογή","cancel":"Ακύρωση","icon_correction":"Διόρθωση μεγέθους εικονιδίου","button_correction":"Διόρθωση μεγέθους κουμπιού / φόντου","correction_hint":"0% = γενικό μέγεθος, αρνητικό = μικρότερο, θετικό = μεγαλύτερο","colors":"Χρώματα","basic":"Βασικά","size_appearance":"Μέγεθος / εμφάνιση","background_opacity":"Αδιαφάνεια φόντου","hover_opacity":"Αδιαφάνεια κατά την αιώρηση","active_opacity":"Ενεργή αδιαφάνεια","dashboard_path_fixed":"Το HA δεν υποστηρίζει αλλαγή υπάρχοντος URL πίνακα μέσω αυτού του API.","dashboard_admin_required":"Η διαχείριση πινάκων απαιτεί διαχειριστή.","dashboard_title_required":"Εισαγάγετε τίτλο πίνακα.","reset_icon":"Επαναφορά προεπιλεγμένου εικονιδίου","icon_picker_unavailable":"Αυτό το περιβάλλον HA δεν έχει φορτώσει ακόμη τον οπτικό επιλογέα εικονιδίων. Θα εμφανιστεί αυτόματα όταν είναι διαθέσιμος.","ordering_hint":"Προηγείται η αποθηκευμένη σειρά Sidebar Manager και μετά η εγγενής σειρά χρήστη. Οι άλλοι πίνακες μένουν στο τέλος με τη σειρά της πηγής. Το άνοιγμα και η ανανέωση δεν αποθηκεύουν σειρά.","no_dashboards":"Δεν βρέθηκαν πίνακες."});
  Object.assign(TRANSLATIONS["ja"], {"item_width":"項目の幅 (%)","item_width_hint":"100%は全幅、20～100%で背景とクリック領域を短くします。空欄の項目は全体設定を継承します。","appearance":"ツールバーのサイズと間隔","desktop":"デスクトップ","mobile":"モバイル","icon_size":"アイコンのサイズ","button_gap":"ボタン間の間隔","button_height":"ボタンの高さ","horizontal_padding":"左右の内側余白","kiosk_fallback":"キオスク代替バー","kiosk_fallback_hint":"HAの標準ツールバーが非表示の場合、小さなHA Nav Managerバーを表示します。","kiosk_bar":"キオスクツールバー","tab_toolbar":"ツールバー","tab_sidebar":"サイドバー","tab_dashboards":"ダッシュボード","sidebar_intro":"ダッシュボードの内容を変えずにHAの標準サイドバーを設定します。","sidebar_enabled":"サイドバーのカスタマイズを有効化","global_appearance":"全体の外観","native_items":"標準項目とダッシュボード","custom_items":"カスタムサイドバー項目","add_sidebar_item":"+ サイドバー項目を追加","no_sidebar_items":"サイドバー項目が見つかりません。","visible":"表示","reset_item":"項目をリセット","reset_sidebar_global":"全体の外観をリセット","remove_overrides":"すべての個別設定を削除","restore_native":"標準の外観に戻す","icon_color":"アイコンの色","text_color":"文字の色","hover_background":"ホバー時の背景","hover_color":"ホバー時の文字 / アイコン","active_background":"選択中の背景","active_text_color":"選択中の文字色","active_icon_color":"選択中のアイコン色","border_radius":"角の丸み","item_height":"項目の高さ","spacing":"項目の間隔","text_size":"文字サイズ","inherit":"全体の既定値を使用","filter_items":"項目を絞り込み…","native_item":"標準項目","dashboard_manager_intro":"ダッシュボードのメタデータを作成・編集します。Lovelaceカードは変更しません。","existing_dashboards":"既存のダッシュボード","create_dashboard":"ダッシュボードを作成","dashboard_title":"ダッシュボードのタイトル","dashboard_path":"URLパス","show_sidebar":"サイドバーに表示","admin_only":"管理者のみ","create":"作成","update":"更新","delete":"削除","confirm_delete_dashboard":"このダッシュボードを削除しますか？Lovelace設定も削除されます。","storage_dashboard":"ストレージダッシュボード","yaml_dashboard":"YAMLダッシュボード（読み取り専用）","dashboard_created":"ダッシュボードを作成しました。","dashboard_updated":"ダッシュボードを更新しました。","dashboard_deleted":"ダッシュボードを削除しました。","dashboard_api_error":"ダッシュボードの操作に失敗しました: ","path_hint":"入力済みのdashboard-に続けて入力してください。例: dashboard-living（半角英小文字、数字、_、-）。接頭辞だけでは作成できません。","native_sidebar_restored":"標準の外観に戻しました。","sidebar_global_reset":"全体の外観をリセットしました。","overrides_removed":"すべての個別設定を削除しました。","reset_appearance":"サイズと間隔をリセット","reset_appearance_done":"サイズと間隔をリセットしました。","fine_spacing":"間隔の微調整","spacing_step_hint":"0.5 px単位で設定できます。","color_palette":"カラーパレット","hue":"色相","saturation":"彩度","brightness":"明るさ","mobile_palette":"クイックカラー","more_colors":"その他の色","custom_picker_title":"色を選択","apply":"適用","cancel":"キャンセル","icon_correction":"アイコンサイズの補正","button_correction":"ボタン / 背景サイズの補正","correction_hint":"0% = 全体のサイズ、負 = 縮小、正 = 拡大","colors":"色","basic":"基本","size_appearance":"サイズ / 外観","background_opacity":"背景の不透明度","hover_opacity":"ホバー時の不透明度","active_opacity":"選択中の不透明度","dashboard_path_fixed":"HAのこのAPIでは既存のダッシュボードのURLは変更できません。","dashboard_admin_required":"ダッシュボードの管理には管理者権限が必要です。","dashboard_title_required":"ダッシュボードのタイトルを入力してください。","reset_icon":"既定のアイコンに戻す","icon_picker_unavailable":"このHAフロントエンドはアイコン選択画面をまだ読み込んでいません。利用可能になると自動的に表示されます。","ordering_hint":"Sidebar Managerの保存済み順序を優先し、次にユーザーの標準サイドバー順序を使用します。その他は元の順序で末尾に置きます。開いたり再読み込みしたりしても順序を保存しません。","no_dashboards":"ダッシュボードが見つかりません。"});
  Object.assign(TRANSLATIONS["ko"], {"item_width":"항목 너비 (%)","item_width_hint":"100%는 전체 너비이며 20–100%로 배경과 클릭 영역을 줄입니다. 빈 항목 값은 전체 설정을 따릅니다.","appearance":"도구 모음 크기 및 간격","desktop":"데스크톱","mobile":"모바일","icon_size":"아이콘 크기","button_gap":"버튼 간격","button_height":"버튼 높이","horizontal_padding":"가로 안쪽 여백","kiosk_fallback":"키오스크 대체 도구 모음","kiosk_fallback_hint":"HA 기본 도구 모음이 숨겨져 있으면 작은 HA Nav Manager 도구 모음을 표시합니다.","kiosk_bar":"키오스크 도구 모음","tab_toolbar":"도구 모음","tab_sidebar":"사이드바","tab_dashboards":"대시보드","sidebar_intro":"대시보드 내용을 변경하지 않고 HA 기본 사이드바를 설정합니다.","sidebar_enabled":"사이드바 사용자 지정 활성화","global_appearance":"전체 모양","native_items":"기본 항목 및 대시보드","custom_items":"사용자 지정 사이드바 항목","add_sidebar_item":"+ 사이드바 항목 추가","no_sidebar_items":"사이드바 항목이 없습니다.","visible":"표시","reset_item":"항목 초기화","reset_sidebar_global":"전체 모양 초기화","remove_overrides":"모든 개별 설정 제거","restore_native":"기본 모양 복원","icon_color":"아이콘 색상","text_color":"텍스트 색상","hover_background":"마우스를 올렸을 때 배경","hover_color":"마우스를 올렸을 때 텍스트 / 아이콘","active_background":"활성 배경","active_text_color":"활성 텍스트 색상","active_icon_color":"활성 아이콘 색상","border_radius":"모서리 반경","item_height":"항목 높이","spacing":"항목 간격","text_size":"텍스트 크기","inherit":"전체 기본값 사용","filter_items":"항목 필터링…","native_item":"기본 항목","dashboard_manager_intro":"대시보드 메타데이터를 만들고 편집합니다. Lovelace 카드는 변경되지 않습니다.","existing_dashboards":"기존 대시보드","create_dashboard":"대시보드 만들기","dashboard_title":"대시보드 제목","dashboard_path":"URL 경로","show_sidebar":"사이드바에 표시","admin_only":"관리자만","create":"만들기","update":"업데이트","delete":"삭제","confirm_delete_dashboard":"이 대시보드를 삭제하시겠습니까? Lovelace 설정도 삭제됩니다.","storage_dashboard":"저장소 대시보드","yaml_dashboard":"YAML 대시보드 (읽기 전용)","dashboard_created":"대시보드를 만들었습니다.","dashboard_updated":"대시보드를 업데이트했습니다.","dashboard_deleted":"대시보드를 삭제했습니다.","dashboard_api_error":"대시보드 작업 실패: ","path_hint":"입력된 dashboard- 뒤에 이름을 붙이세요. 예: dashboard-living (영문 소문자, 숫자, _, -). 접두사만으로는 만들 수 없습니다.","native_sidebar_restored":"기본 모양을 복원했습니다.","sidebar_global_reset":"전체 모양을 초기화했습니다.","overrides_removed":"모든 개별 설정을 제거했습니다.","reset_appearance":"크기 및 간격 초기화","reset_appearance_done":"크기 및 간격을 초기화했습니다.","fine_spacing":"미세 간격","spacing_step_hint":"0.5 px 단위로 설정할 수 있습니다.","color_palette":"색상 팔레트","hue":"색조","saturation":"채도","brightness":"밝기","mobile_palette":"빠른 색상","more_colors":"다른 색상","custom_picker_title":"색상 선택","apply":"적용","cancel":"취소","icon_correction":"아이콘 크기 보정","button_correction":"버튼 / 배경 크기 보정","correction_hint":"0% = 전체 크기, 음수 = 작게, 양수 = 크게","colors":"색상","basic":"기본","size_appearance":"크기 / 모양","background_opacity":"배경 불투명도","hover_opacity":"마우스를 올렸을 때 불투명도","active_opacity":"활성 불투명도","dashboard_path_fixed":"HA는 이 API로 기존 대시보드 URL을 변경하는 기능을 지원하지 않습니다.","dashboard_admin_required":"대시보드 관리에는 관리자 권한이 필요합니다.","dashboard_title_required":"대시보드 제목을 입력하세요.","reset_icon":"기본 아이콘 복원","icon_picker_unavailable":"이 HA 프런트엔드가 시각적 아이콘 선택기를 아직 불러오지 않았습니다. 사용 가능해지면 자동으로 표시됩니다.","ordering_hint":"저장된 Sidebar Manager 순서가 우선이며 그다음은 사용자의 기본 사이드바 순서입니다. 나머지는 원본 순서대로 끝에 배치됩니다. 열거나 새로 고쳐도 순서를 저장하지 않습니다.","no_dashboards":"대시보드가 없습니다."});
  Object.assign(TRANSLATIONS["zh-CN"], {"item_width":"项目宽度 (%)","item_width_hint":"100%为全宽；20–100%可缩短背景和点击区域。项目值留空时继承全局设置。","appearance":"工具栏大小与间距","desktop":"桌面","mobile":"移动端","icon_size":"图标大小","button_gap":"按钮间距","button_height":"按钮高度","horizontal_padding":"水平内边距","kiosk_fallback":"备用自助模式工具栏","kiosk_fallback_hint":"当HA原生工具栏隐藏时，显示一个小型HA Nav Manager工具栏。","kiosk_bar":"自助模式工具栏","tab_toolbar":"工具栏","tab_sidebar":"侧边栏","tab_dashboards":"仪表盘","sidebar_intro":"自定义HA原生侧边栏，不改变仪表盘内容。","sidebar_enabled":"启用侧边栏自定义","global_appearance":"全局外观","native_items":"原生项目与仪表盘","custom_items":"自定义侧边栏项目","add_sidebar_item":"+ 添加侧边栏项目","no_sidebar_items":"未找到侧边栏项目。","visible":"显示","reset_item":"重置项目","reset_sidebar_global":"重置全局外观","remove_overrides":"删除所有项目自定义设置","restore_native":"恢复原生外观","icon_color":"图标颜色","text_color":"文字颜色","hover_background":"悬停背景","hover_color":"悬停文字 / 图标","active_background":"选中背景","active_text_color":"选中文字颜色","active_icon_color":"选中图标颜色","border_radius":"圆角半径","item_height":"项目高度","spacing":"项目间距","text_size":"文字大小","inherit":"使用全局默认值","filter_items":"筛选项目…","native_item":"原生项目","dashboard_manager_intro":"创建和编辑仪表盘元数据，不更改Lovelace卡片。","existing_dashboards":"现有仪表盘","create_dashboard":"创建仪表盘","dashboard_title":"仪表盘标题","dashboard_path":"URL路径","show_sidebar":"在侧边栏显示","admin_only":"仅限管理员","create":"创建","update":"更新","delete":"删除","confirm_delete_dashboard":"删除此仪表盘？其Lovelace配置也将被删除。","storage_dashboard":"存储型仪表盘","yaml_dashboard":"YAML仪表盘（只读）","dashboard_created":"仪表盘已创建。","dashboard_updated":"仪表盘已更新。","dashboard_deleted":"仪表盘已删除。","dashboard_api_error":"仪表盘操作失败：","path_hint":"请补全预填的dashboard-前缀，例如dashboard-living（小写英文字母、数字、_和-）。仅有前缀是不完整的。","native_sidebar_restored":"已恢复原生外观。","sidebar_global_reset":"已重置全局外观。","overrides_removed":"已删除所有项目自定义设置。","reset_appearance":"重置大小与间距","reset_appearance_done":"已重置大小与间距。","fine_spacing":"精细间距","spacing_step_hint":"可使用0.5 px步长。","color_palette":"调色板","hue":"色相","saturation":"饱和度","brightness":"亮度","mobile_palette":"快捷颜色","more_colors":"更多颜色","custom_picker_title":"选择颜色","apply":"应用","cancel":"取消","icon_correction":"图标大小修正","button_correction":"按钮 / 背景大小修正","correction_hint":"0% = 全局大小，负值 = 缩小，正值 = 放大","colors":"颜色","basic":"基本","size_appearance":"大小 / 外观","background_opacity":"背景不透明度","hover_opacity":"悬停不透明度","active_opacity":"选中不透明度","dashboard_path_fixed":"HA不支持通过此API更改现有仪表盘的URL。","dashboard_admin_required":"管理仪表盘需要管理员权限。","dashboard_title_required":"请输入仪表盘标题。","reset_icon":"恢复默认图标","icon_picker_unavailable":"此HA前端尚未加载可视化图标选择器。可用时将自动显示。","ordering_hint":"优先使用Sidebar Manager保存的顺序，其次使用用户的原生侧边栏顺序。其他仪表盘按来源顺序放在末尾。打开或刷新不会保存顺序。","no_dashboards":"未找到仪表盘。"});
  Object.assign(TRANSLATIONS["zh-TW"], {"item_width":"項目寬度 (%)","item_width_hint":"100%為全寬；20–100%可縮短背景與點擊區域。項目值留空時繼承全域設定。","appearance":"工具列大小與間距","desktop":"桌面","mobile":"行動裝置","icon_size":"圖示大小","button_gap":"按鈕間距","button_height":"按鈕高度","horizontal_padding":"水平內距","kiosk_fallback":"備用自助模式工具列","kiosk_fallback_hint":"當HA原生工具列隱藏時，顯示小型HA Nav Manager工具列。","kiosk_bar":"自助模式工具列","tab_toolbar":"工具列","tab_sidebar":"側邊欄","tab_dashboards":"儀表板","sidebar_intro":"自訂HA原生側邊欄，不變更儀表板內容。","sidebar_enabled":"啟用側邊欄自訂","global_appearance":"全域外觀","native_items":"原生項目與儀表板","custom_items":"自訂側邊欄項目","add_sidebar_item":"+ 新增側邊欄項目","no_sidebar_items":"找不到側邊欄項目。","visible":"顯示","reset_item":"重設項目","reset_sidebar_global":"重設全域外觀","remove_overrides":"移除所有項目自訂設定","restore_native":"還原原生外觀","icon_color":"圖示色彩","text_color":"文字色彩","hover_background":"游標停留背景","hover_color":"游標停留文字 / 圖示","active_background":"選取背景","active_text_color":"選取文字色彩","active_icon_color":"選取圖示色彩","border_radius":"圓角半徑","item_height":"項目高度","spacing":"項目間距","text_size":"文字大小","inherit":"使用全域預設值","filter_items":"篩選項目…","native_item":"原生項目","dashboard_manager_intro":"建立和編輯儀表板中繼資料，不變更Lovelace卡片。","existing_dashboards":"現有儀表板","create_dashboard":"建立儀表板","dashboard_title":"儀表板標題","dashboard_path":"URL路徑","show_sidebar":"顯示於側邊欄","admin_only":"僅限管理員","create":"建立","update":"更新","delete":"刪除","confirm_delete_dashboard":"刪除此儀表板？其Lovelace設定也將被刪除。","storage_dashboard":"儲存型儀表板","yaml_dashboard":"YAML儀表板（唯讀）","dashboard_created":"儀表板已建立。","dashboard_updated":"儀表板已更新。","dashboard_deleted":"儀表板已刪除。","dashboard_api_error":"儀表板操作失敗：","path_hint":"請補全預填的dashboard-前綴，例如dashboard-living（小寫英文字母、數字、_和-）。只有前綴並不完整。","native_sidebar_restored":"已還原原生外觀。","sidebar_global_reset":"已重設全域外觀。","overrides_removed":"已移除所有項目自訂設定。","reset_appearance":"重設大小與間距","reset_appearance_done":"已重設大小與間距。","fine_spacing":"精細間距","spacing_step_hint":"可使用0.5 px間隔。","color_palette":"調色盤","hue":"色相","saturation":"飽和度","brightness":"亮度","mobile_palette":"快速色彩","more_colors":"更多色彩","custom_picker_title":"選擇色彩","apply":"套用","cancel":"取消","icon_correction":"圖示大小修正","button_correction":"按鈕 / 背景大小修正","correction_hint":"0% = 全域大小，負值 = 縮小，正值 = 放大","colors":"色彩","basic":"基本","size_appearance":"大小 / 外觀","background_opacity":"背景不透明度","hover_opacity":"游標停留不透明度","active_opacity":"選取不透明度","dashboard_path_fixed":"HA不支援透過此API變更現有儀表板的URL。","dashboard_admin_required":"管理儀表板需要管理員權限。","dashboard_title_required":"請輸入儀表板標題。","reset_icon":"還原預設圖示","icon_picker_unavailable":"此HA前端尚未載入視覺化圖示選擇器。可用時將自動顯示。","ordering_hint":"優先使用Sidebar Manager儲存的順序，其次使用使用者的原生側邊欄順序。其他儀表板依來源順序放在末尾。開啟或重新整理不會儲存順序。","no_dashboards":"找不到儀表板。"});
  Object.assign(TRANSLATIONS["vi"], {"item_width":"Chiều rộng mục (%)","item_width_hint":"100% = toàn chiều rộng; 20–100% thu ngắn nền và vùng nhấp. Giá trị trống kế thừa cài đặt chung.","appearance":"Kích thước và khoảng cách thanh công cụ","desktop":"Máy tính","mobile":"Di động","icon_size":"Kích thước biểu tượng","button_gap":"Khoảng cách giữa các nút","button_height":"Chiều cao nút","horizontal_padding":"Đệm ngang","kiosk_fallback":"Thanh kiosk dự phòng","kiosk_fallback_hint":"Nếu thanh công cụ gốc của HA bị ẩn, hiển thị thanh HA Nav Manager nhỏ.","kiosk_bar":"Thanh công cụ kiosk","tab_toolbar":"Thanh công cụ","tab_sidebar":"Thanh bên","tab_dashboards":"Bảng điều khiển","sidebar_intro":"Tùy chỉnh thanh bên gốc của HA mà không thay đổi nội dung bảng điều khiển.","sidebar_enabled":"Bật tùy chỉnh thanh bên","global_appearance":"Giao diện chung","native_items":"Mục gốc và bảng điều khiển","custom_items":"Mục thanh bên tùy chỉnh","add_sidebar_item":"+ Thêm mục thanh bên","no_sidebar_items":"Không tìm thấy mục thanh bên.","visible":"Hiển thị","reset_item":"Đặt lại mục","reset_sidebar_global":"Đặt lại giao diện chung","remove_overrides":"Xóa mọi tùy chỉnh từng mục","restore_native":"Khôi phục giao diện gốc","icon_color":"Màu biểu tượng","text_color":"Màu chữ","hover_background":"Nền khi di chuột","hover_color":"Chữ / biểu tượng khi di chuột","active_background":"Nền đang chọn","active_text_color":"Màu chữ đang chọn","active_icon_color":"Màu biểu tượng đang chọn","border_radius":"Bán kính góc","item_height":"Chiều cao mục","spacing":"Khoảng cách mục","text_size":"Cỡ chữ","inherit":"Dùng mặc định chung","filter_items":"Lọc các mục…","native_item":"Mục gốc","dashboard_manager_intro":"Tạo và chỉnh sửa siêu dữ liệu bảng điều khiển. Các thẻ Lovelace không bị thay đổi.","existing_dashboards":"Bảng điều khiển hiện có","create_dashboard":"Tạo bảng điều khiển","dashboard_title":"Tiêu đề bảng điều khiển","dashboard_path":"Đường dẫn URL","show_sidebar":"Hiển thị trên thanh bên","admin_only":"Chỉ quản trị viên","create":"Tạo","update":"Cập nhật","delete":"Xóa","confirm_delete_dashboard":"Xóa bảng điều khiển này? Cấu hình Lovelace của nó cũng sẽ bị xóa.","storage_dashboard":"Bảng điều khiển lưu trữ","yaml_dashboard":"Bảng điều khiển YAML (chỉ đọc)","dashboard_created":"Đã tạo bảng điều khiển.","dashboard_updated":"Đã cập nhật bảng điều khiển.","dashboard_deleted":"Đã xóa bảng điều khiển.","dashboard_api_error":"Thao tác bảng điều khiển thất bại: ","path_hint":"Điền tiếp tiền tố dashboard-, ví dụ dashboard-phongkhach (chữ thường không dấu, số, _ và -). Chỉ tiền tố là chưa đủ.","native_sidebar_restored":"Đã khôi phục giao diện gốc.","sidebar_global_reset":"Đã đặt lại giao diện chung.","overrides_removed":"Đã xóa mọi tùy chỉnh từng mục.","reset_appearance":"Đặt lại kích thước và khoảng cách","reset_appearance_done":"Đã đặt lại kích thước và khoảng cách.","fine_spacing":"Tinh chỉnh khoảng cách","spacing_step_hint":"Có thể dùng bước 0,5 px.","color_palette":"Bảng màu","hue":"Sắc độ","saturation":"Độ bão hòa","brightness":"Độ sáng","mobile_palette":"Màu nhanh","more_colors":"Màu khác","custom_picker_title":"Chọn màu","apply":"Áp dụng","cancel":"Hủy","icon_correction":"Hiệu chỉnh kích thước biểu tượng","button_correction":"Hiệu chỉnh kích thước nút / nền","correction_hint":"0% = kích thước chung, âm = nhỏ hơn, dương = lớn hơn","colors":"Màu sắc","basic":"Cơ bản","size_appearance":"Kích thước / giao diện","background_opacity":"Độ đục của nền","hover_opacity":"Độ đục khi di chuột","active_opacity":"Độ đục khi chọn","dashboard_path_fixed":"HA không hỗ trợ đổi URL bảng điều khiển hiện có qua API này.","dashboard_admin_required":"Quản lý bảng điều khiển cần quyền quản trị viên.","dashboard_title_required":"Nhập tiêu đề bảng điều khiển.","reset_icon":"Khôi phục biểu tượng mặc định","icon_picker_unavailable":"Giao diện HA này chưa tải bộ chọn biểu tượng trực quan. Nó sẽ tự xuất hiện khi khả dụng.","ordering_hint":"Ưu tiên thứ tự đã lưu trong Sidebar Manager, rồi đến thứ tự gốc của người dùng. Các bảng khác nằm cuối theo thứ tự nguồn. Mở hoặc làm mới không lưu thứ tự.","no_dashboards":"Không tìm thấy bảng điều khiển."});
  Object.assign(TRANSLATIONS["th"], {"item_width":"ความกว้างรายการ (%)","item_width_hint":"100% = เต็มความกว้าง; 20–100% ลดพื้นหลังและพื้นที่คลิก ค่าว่างของรายการใช้การตั้งค่าส่วนกลาง","appearance":"ขนาดและระยะห่างแถบเครื่องมือ","desktop":"เดสก์ท็อป","mobile":"มือถือ","icon_size":"ขนาดไอคอน","button_gap":"ระยะห่างระหว่างปุ่ม","button_height":"ความสูงปุ่ม","horizontal_padding":"ระยะขอบภายในแนวนอน","kiosk_fallback":"แถบสำรองโหมดคีออสก์","kiosk_fallback_hint":"หากแถบเครื่องมือเดิมของ HA ถูกซ่อน ให้แสดงแถบ HA Nav Manager ขนาดเล็ก","kiosk_bar":"แถบเครื่องมือคีออสก์","tab_toolbar":"แถบเครื่องมือ","tab_sidebar":"แถบด้านข้าง","tab_dashboards":"แดชบอร์ด","sidebar_intro":"ปรับแต่งแถบด้านข้างเดิมของ HA โดยไม่เปลี่ยนเนื้อหาแดชบอร์ด","sidebar_enabled":"เปิดใช้การปรับแต่งแถบด้านข้าง","global_appearance":"ลักษณะส่วนกลาง","native_items":"รายการเดิมและแดชบอร์ด","custom_items":"รายการแถบด้านข้างที่กำหนดเอง","add_sidebar_item":"+ เพิ่มรายการแถบด้านข้าง","no_sidebar_items":"ไม่พบรายการแถบด้านข้าง","visible":"แสดง","reset_item":"รีเซ็ตรายการ","reset_sidebar_global":"รีเซ็ตลักษณะส่วนกลาง","remove_overrides":"ลบการตั้งค่าเฉพาะรายการทั้งหมด","restore_native":"คืนค่าลักษณะเดิม","icon_color":"สีไอคอน","text_color":"สีข้อความ","hover_background":"พื้นหลังเมื่อชี้เมาส์","hover_color":"ข้อความ / ไอคอนเมื่อชี้เมาส์","active_background":"พื้นหลังที่เลือก","active_text_color":"สีข้อความที่เลือก","active_icon_color":"สีไอคอนที่เลือก","border_radius":"รัศมีมุม","item_height":"ความสูงรายการ","spacing":"ระยะห่างรายการ","text_size":"ขนาดข้อความ","inherit":"ใช้ค่าเริ่มต้นส่วนกลาง","filter_items":"กรองรายการ…","native_item":"รายการเดิม","dashboard_manager_intro":"สร้างและแก้ไขข้อมูลเมตาของแดชบอร์ด โดยไม่เปลี่ยนการ์ด Lovelace","existing_dashboards":"แดชบอร์ดที่มีอยู่","create_dashboard":"สร้างแดชบอร์ด","dashboard_title":"ชื่อแดชบอร์ด","dashboard_path":"เส้นทาง URL","show_sidebar":"แสดงในแถบด้านข้าง","admin_only":"ผู้ดูแลระบบเท่านั้น","create":"สร้าง","update":"อัปเดต","delete":"ลบ","confirm_delete_dashboard":"ลบแดชบอร์ดนี้หรือไม่? การตั้งค่า Lovelace ของแดชบอร์ดจะถูกลบด้วย","storage_dashboard":"แดชบอร์ดแบบจัดเก็บ","yaml_dashboard":"แดชบอร์ด YAML (อ่านอย่างเดียว)","dashboard_created":"สร้างแดชบอร์ดแล้ว","dashboard_updated":"อัปเดตแดชบอร์ดแล้ว","dashboard_deleted":"ลบแดชบอร์ดแล้ว","dashboard_api_error":"การดำเนินการแดชบอร์ดล้มเหลว: ","path_hint":"เติมต่อจากคำนำหน้า dashboard- เช่น dashboard-living (อักษรอังกฤษตัวเล็ก ตัวเลข _ และ -) ใช้เพียงคำนำหน้าไม่ได้","native_sidebar_restored":"คืนค่าลักษณะเดิมแล้ว","sidebar_global_reset":"รีเซ็ตลักษณะส่วนกลางแล้ว","overrides_removed":"ลบการตั้งค่าเฉพาะรายการทั้งหมดแล้ว","reset_appearance":"รีเซ็ตขนาดและระยะห่าง","reset_appearance_done":"รีเซ็ตขนาดและระยะห่างแล้ว","fine_spacing":"ปรับระยะห่างละเอียด","spacing_step_hint":"ปรับได้ครั้งละ 0.5 px","color_palette":"จานสี","hue":"เฉดสี","saturation":"ความอิ่มตัว","brightness":"ความสว่าง","mobile_palette":"สีด่วน","more_colors":"สีเพิ่มเติม","custom_picker_title":"เลือกสี","apply":"ใช้","cancel":"ยกเลิก","icon_correction":"ปรับแก้ขนาดไอคอน","button_correction":"ปรับแก้ขนาดปุ่ม / พื้นหลัง","correction_hint":"0% = ขนาดส่วนกลาง ค่าลบ = เล็กลง ค่าบวก = ใหญ่ขึ้น","colors":"สี","basic":"พื้นฐาน","size_appearance":"ขนาด / ลักษณะ","background_opacity":"ความทึบพื้นหลัง","hover_opacity":"ความทึบเมื่อชี้เมาส์","active_opacity":"ความทึบรายการที่เลือก","dashboard_path_fixed":"HA ไม่รองรับการเปลี่ยน URL ของแดชบอร์ดเดิมผ่าน API นี้","dashboard_admin_required":"การจัดการแดชบอร์ดต้องใช้สิทธิ์ผู้ดูแลระบบ","dashboard_title_required":"กรุณาระบุชื่อแดชบอร์ด","reset_icon":"คืนค่าไอคอนเริ่มต้น","icon_picker_unavailable":"ส่วนติดต่อ HA นี้ยังไม่ได้โหลดตัวเลือกไอคอนแบบภาพ ซึ่งจะแสดงอัตโนมัติเมื่อพร้อมใช้งาน","ordering_hint":"ใช้ลำดับที่บันทึกใน Sidebar Manager ก่อน แล้วจึงใช้ลำดับเดิมของผู้ใช้ แดชบอร์ดอื่นจะอยู่ท้ายตามลำดับต้นทาง การเปิดหรือรีเฟรชจะไม่บันทึกลำดับ","no_dashboards":"ไม่พบแดชบอร์ด"});
  Object.assign(TRANSLATIONS["id"], {"item_width":"Lebar item (%)","item_width_hint":"100% = lebar penuh; 20–100% memperpendek latar dan area klik. Nilai kosong mengikuti pengaturan global.","appearance":"Ukuran dan jarak bilah alat","desktop":"Desktop","mobile":"Seluler","icon_size":"Ukuran ikon","button_gap":"Jarak antar tombol","button_height":"Tinggi tombol","horizontal_padding":"Jarak dalam horizontal","kiosk_fallback":"Bilah kios cadangan","kiosk_fallback_hint":"Jika bilah alat bawaan HA tersembunyi, tampilkan bilah kecil HA Nav Manager.","kiosk_bar":"Bilah alat kios","tab_toolbar":"Bilah alat","tab_sidebar":"Bilah samping","tab_dashboards":"Dasbor","sidebar_intro":"Sesuaikan bilah samping bawaan HA tanpa mengubah isi dasbor.","sidebar_enabled":"Aktifkan penyesuaian bilah samping","global_appearance":"Tampilan global","native_items":"Item bawaan dan dasbor","custom_items":"Item bilah samping khusus","add_sidebar_item":"+ Tambah item bilah samping","no_sidebar_items":"Tidak ada item bilah samping.","visible":"Terlihat","reset_item":"Atur ulang item","reset_sidebar_global":"Atur ulang tampilan global","remove_overrides":"Hapus semua penyesuaian item","restore_native":"Pulihkan tampilan bawaan","icon_color":"Warna ikon","text_color":"Warna teks","hover_background":"Latar saat disorot","hover_color":"Teks / ikon saat disorot","active_background":"Latar aktif","active_text_color":"Warna teks aktif","active_icon_color":"Warna ikon aktif","border_radius":"Radius sudut","item_height":"Tinggi item","spacing":"Jarak antar item","text_size":"Ukuran teks","inherit":"Gunakan nilai bawaan global","filter_items":"Filter item…","native_item":"Item bawaan","dashboard_manager_intro":"Buat dan edit metadata dasbor. Kartu Lovelace tidak diubah.","existing_dashboards":"Dasbor yang ada","create_dashboard":"Buat dasbor","dashboard_title":"Judul dasbor","dashboard_path":"Jalur URL","show_sidebar":"Tampilkan di bilah samping","admin_only":"Hanya administrator","create":"Buat","update":"Perbarui","delete":"Hapus","confirm_delete_dashboard":"Hapus dasbor ini? Konfigurasi Lovelace-nya juga akan dihapus.","storage_dashboard":"Dasbor penyimpanan","yaml_dashboard":"Dasbor YAML (hanya baca)","dashboard_created":"Dasbor dibuat.","dashboard_updated":"Dasbor diperbarui.","dashboard_deleted":"Dasbor dihapus.","dashboard_api_error":"Operasi dasbor gagal: ","path_hint":"Lengkapi awalan dashboard-, misalnya dashboard-ruangtamu (huruf kecil, angka, _ dan -). Awalan saja belum lengkap.","native_sidebar_restored":"Tampilan bawaan dipulihkan.","sidebar_global_reset":"Tampilan global diatur ulang.","overrides_removed":"Semua penyesuaian item dihapus.","reset_appearance":"Atur ulang ukuran dan jarak","reset_appearance_done":"Ukuran dan jarak diatur ulang.","fine_spacing":"Jarak presisi","spacing_step_hint":"Dapat menggunakan langkah 0,5 px.","color_palette":"Palet warna","hue":"Rona","saturation":"Saturasi","brightness":"Kecerahan","mobile_palette":"Warna cepat","more_colors":"Warna lainnya","custom_picker_title":"Pilih warna","apply":"Terapkan","cancel":"Batal","icon_correction":"Koreksi ukuran ikon","button_correction":"Koreksi ukuran tombol / latar","correction_hint":"0% = ukuran global, negatif = lebih kecil, positif = lebih besar","colors":"Warna","basic":"Dasar","size_appearance":"Ukuran / tampilan","background_opacity":"Opasitas latar","hover_opacity":"Opasitas saat disorot","active_opacity":"Opasitas aktif","dashboard_path_fixed":"HA tidak mendukung perubahan URL dasbor yang ada melalui API ini.","dashboard_admin_required":"Pengelolaan dasbor memerlukan administrator.","dashboard_title_required":"Masukkan judul dasbor.","reset_icon":"Pulihkan ikon bawaan","icon_picker_unavailable":"Antarmuka HA ini belum memuat pemilih ikon visual. Pemilih akan muncul otomatis saat tersedia.","ordering_hint":"Urutan tersimpan Sidebar Manager didahulukan, lalu urutan bawaan pengguna. Dasbor lain tetap di akhir dalam urutan sumber. Membuka atau menyegarkan tidak menyimpan urutan.","no_dashboards":"Tidak ada dasbor."});
  Object.assign(TRANSLATIONS["ms"], {"item_width":"Lebar item (%)","item_width_hint":"100% = lebar penuh; 20–100% memendekkan latar dan kawasan klik. Nilai kosong mengikut tetapan global.","appearance":"Saiz dan jarak bar alat","desktop":"Desktop","mobile":"Mudah alih","icon_size":"Saiz ikon","button_gap":"Jarak antara butang","button_height":"Ketinggian butang","horizontal_padding":"Ruang dalaman mendatar","kiosk_fallback":"Bar kios sandaran","kiosk_fallback_hint":"Jika bar alat asal HA tersembunyi, paparkan bar kecil HA Nav Manager.","kiosk_bar":"Bar alat kios","tab_toolbar":"Bar alat","tab_sidebar":"Bar sisi","tab_dashboards":"Papan pemuka","sidebar_intro":"Sesuaikan bar sisi asal HA tanpa mengubah kandungan papan pemuka.","sidebar_enabled":"Dayakan penyesuaian bar sisi","global_appearance":"Rupa global","native_items":"Item asal dan papan pemuka","custom_items":"Item bar sisi tersuai","add_sidebar_item":"+ Tambah item bar sisi","no_sidebar_items":"Tiada item bar sisi ditemui.","visible":"Kelihatan","reset_item":"Tetapkan semula item","reset_sidebar_global":"Tetapkan semula rupa global","remove_overrides":"Buang semua penyesuaian item","restore_native":"Pulihkan rupa asal","icon_color":"Warna ikon","text_color":"Warna teks","hover_background":"Latar semasa dituding","hover_color":"Teks / ikon semasa dituding","active_background":"Latar aktif","active_text_color":"Warna teks aktif","active_icon_color":"Warna ikon aktif","border_radius":"Jejari sudut","item_height":"Ketinggian item","spacing":"Jarak antara item","text_size":"Saiz teks","inherit":"Gunakan lalai global","filter_items":"Tapis item…","native_item":"Item asal","dashboard_manager_intro":"Cipta dan sunting metadata papan pemuka. Kad Lovelace tidak diubah.","existing_dashboards":"Papan pemuka sedia ada","create_dashboard":"Cipta papan pemuka","dashboard_title":"Tajuk papan pemuka","dashboard_path":"Laluan URL","show_sidebar":"Paparkan dalam bar sisi","admin_only":"Pentadbir sahaja","create":"Cipta","update":"Kemas kini","delete":"Padam","confirm_delete_dashboard":"Padam papan pemuka ini? Konfigurasi Lovelace juga akan dibuang.","storage_dashboard":"Papan pemuka storan","yaml_dashboard":"Papan pemuka YAML (baca sahaja)","dashboard_created":"Papan pemuka dicipta.","dashboard_updated":"Papan pemuka dikemas kini.","dashboard_deleted":"Papan pemuka dipadam.","dashboard_api_error":"Operasi papan pemuka gagal: ","path_hint":"Lengkapkan awalan dashboard-, contohnya dashboard-ruangtamu (huruf kecil, angka, _ dan -). Awalan sahaja tidak mencukupi.","native_sidebar_restored":"Rupa asal dipulihkan.","sidebar_global_reset":"Rupa global ditetapkan semula.","overrides_removed":"Semua penyesuaian item dibuang.","reset_appearance":"Tetapkan semula saiz dan jarak","reset_appearance_done":"Saiz dan jarak ditetapkan semula.","fine_spacing":"Jarak halus","spacing_step_hint":"Boleh menggunakan langkah 0.5 px.","color_palette":"Palet warna","hue":"Rona","saturation":"Ketepuan","brightness":"Kecerahan","mobile_palette":"Warna pantas","more_colors":"Warna lain","custom_picker_title":"Pilih warna","apply":"Gunakan","cancel":"Batal","icon_correction":"Pembetulan saiz ikon","button_correction":"Pembetulan saiz butang / latar","correction_hint":"0% = saiz global, negatif = lebih kecil, positif = lebih besar","colors":"Warna","basic":"Asas","size_appearance":"Saiz / rupa","background_opacity":"Kelegapan latar","hover_opacity":"Kelegapan semasa dituding","active_opacity":"Kelegapan aktif","dashboard_path_fixed":"HA tidak menyokong perubahan URL papan pemuka sedia ada melalui API ini.","dashboard_admin_required":"Pengurusan papan pemuka memerlukan pentadbir.","dashboard_title_required":"Masukkan tajuk papan pemuka.","reset_icon":"Pulihkan ikon lalai","icon_picker_unavailable":"Antara muka HA ini belum memuatkan pemilih ikon visual. Ia akan muncul secara automatik apabila tersedia.","ordering_hint":"Susunan tersimpan Sidebar Manager diutamakan, kemudian susunan asal pengguna. Papan pemuka lain kekal di hujung mengikut susunan sumber. Membuka atau menyegarkan tidak menyimpan susunan.","no_dashboards":"Tiada papan pemuka ditemui."});
  Object.assign(TRANSLATIONS["hi"], {"item_width":"आइटम की चौड़ाई (%)","item_width_hint":"100% = पूरी चौड़ाई; 20–100% पृष्ठभूमि और क्लिक क्षेत्र छोटा करता है। खाली मान वैश्विक सेटिंग अपनाता है।","appearance":"टूलबार का आकार और अंतर","desktop":"डेस्कटॉप","mobile":"मोबाइल","icon_size":"आइकन का आकार","button_gap":"बटनों के बीच अंतर","button_height":"बटन की ऊँचाई","horizontal_padding":"क्षैतिज अंदरूनी अंतर","kiosk_fallback":"वैकल्पिक कियोस्क बार","kiosk_fallback_hint":"HA का मूल टूलबार छिपा होने पर छोटा HA Nav Manager बार दिखाएँ।","kiosk_bar":"कियोस्क टूलबार","tab_toolbar":"टूलबार","tab_sidebar":"साइडबार","tab_dashboards":"डैशबोर्ड","sidebar_intro":"डैशबोर्ड की सामग्री बदले बिना HA के मूल साइडबार को अनुकूलित करें।","sidebar_enabled":"साइडबार अनुकूलन चालू करें","global_appearance":"वैश्विक रूप","native_items":"मूल आइटम और डैशबोर्ड","custom_items":"कस्टम साइडबार आइटम","add_sidebar_item":"+ साइडबार आइटम जोड़ें","no_sidebar_items":"कोई साइडबार आइटम नहीं मिला।","visible":"दिखाएँ","reset_item":"आइटम रीसेट करें","reset_sidebar_global":"वैश्विक रूप रीसेट करें","remove_overrides":"सभी व्यक्तिगत सेटिंग हटाएँ","restore_native":"मूल रूप बहाल करें","icon_color":"आइकन का रंग","text_color":"टेक्स्ट का रंग","hover_background":"होवर पर पृष्ठभूमि","hover_color":"होवर पर टेक्स्ट / आइकन","active_background":"सक्रिय पृष्ठभूमि","active_text_color":"सक्रिय टेक्स्ट का रंग","active_icon_color":"सक्रिय आइकन का रंग","border_radius":"कोने की त्रिज्या","item_height":"आइटम की ऊँचाई","spacing":"आइटम का अंतर","text_size":"टेक्स्ट का आकार","inherit":"वैश्विक डिफ़ॉल्ट उपयोग करें","filter_items":"आइटम फ़िल्टर करें…","native_item":"मूल आइटम","dashboard_manager_intro":"डैशबोर्ड मेटाडेटा बनाएँ और संपादित करें। Lovelace कार्ड नहीं बदले जाते।","existing_dashboards":"मौजूदा डैशबोर्ड","create_dashboard":"डैशबोर्ड बनाएँ","dashboard_title":"डैशबोर्ड का शीर्षक","dashboard_path":"URL पथ","show_sidebar":"साइडबार में दिखाएँ","admin_only":"केवल प्रशासक","create":"बनाएँ","update":"अपडेट करें","delete":"हटाएँ","confirm_delete_dashboard":"यह डैशबोर्ड हटाएँ? इसका Lovelace कॉन्फ़िगरेशन भी हट जाएगा।","storage_dashboard":"संग्रहीत डैशबोर्ड","yaml_dashboard":"YAML डैशबोर्ड (केवल पढ़ने के लिए)","dashboard_created":"डैशबोर्ड बनाया गया।","dashboard_updated":"डैशबोर्ड अपडेट किया गया।","dashboard_deleted":"डैशबोर्ड हटाया गया।","dashboard_api_error":"डैशबोर्ड कार्रवाई विफल: ","path_hint":"पहले से भरे dashboard- के बाद नाम जोड़ें, जैसे dashboard-living (छोटे अंग्रेज़ी अक्षर, अंक, _ और -)। केवल उपसर्ग पर्याप्त नहीं है।","native_sidebar_restored":"मूल रूप बहाल किया गया।","sidebar_global_reset":"वैश्विक रूप रीसेट किया गया।","overrides_removed":"सभी व्यक्तिगत सेटिंग हटाई गईं।","reset_appearance":"आकार और अंतर रीसेट करें","reset_appearance_done":"आकार और अंतर रीसेट किए गए।","fine_spacing":"सूक्ष्म अंतर","spacing_step_hint":"0.5 px के चरण उपयोग कर सकते हैं।","color_palette":"रंग पैलेट","hue":"रंगत","saturation":"संतृप्ति","brightness":"चमक","mobile_palette":"त्वरित रंग","more_colors":"अन्य रंग","custom_picker_title":"रंग चुनें","apply":"लागू करें","cancel":"रद्द करें","icon_correction":"आइकन आकार सुधार","button_correction":"बटन / पृष्ठभूमि आकार सुधार","correction_hint":"0% = वैश्विक आकार, ऋणात्मक = छोटा, धनात्मक = बड़ा","colors":"रंग","basic":"मूल","size_appearance":"आकार / रूप","background_opacity":"पृष्ठभूमि की अपारदर्शिता","hover_opacity":"होवर पर अपारदर्शिता","active_opacity":"सक्रिय अपारदर्शिता","dashboard_path_fixed":"HA इस API से मौजूदा डैशबोर्ड का URL बदलने की सुविधा नहीं देता।","dashboard_admin_required":"डैशबोर्ड प्रबंधन के लिए प्रशासक आवश्यक है।","dashboard_title_required":"डैशबोर्ड का शीर्षक दर्ज करें।","reset_icon":"डिफ़ॉल्ट आइकन बहाल करें","icon_picker_unavailable":"इस HA इंटरफ़ेस ने दृश्य आइकन चयनकर्ता अभी लोड नहीं किया है। उपलब्ध होने पर यह अपने आप दिखाई देगा।","ordering_hint":"पहले Sidebar Manager का सहेजा क्रम, फिर उपयोगकर्ता का मूल क्रम लागू होता है। अन्य डैशबोर्ड स्रोत क्रम में अंत में रहते हैं। खोलने या रीफ़्रेश करने से क्रम सहेजा नहीं जाता।","no_dashboards":"कोई डैशबोर्ड नहीं मिला।"});
  Object.assign(TRANSLATIONS["ar"], {"item_width":"عرض العنصر (%)","item_width_hint":"100% = العرض الكامل؛ 20–100% يقلل الخلفية ومنطقة النقر. القيمة الفارغة تستخدم الإعداد العام.","appearance":"حجم شريط الأدوات وتباعده","desktop":"سطح المكتب","mobile":"الهاتف","icon_size":"حجم الأيقونة","button_gap":"المسافة بين الأزرار","button_height":"ارتفاع الزر","horizontal_padding":"الحشو الأفقي","kiosk_fallback":"شريط كشك بديل","kiosk_fallback_hint":"إذا كان شريط HA الأصلي مخفيًا، اعرض شريط HA Nav Manager صغيرًا.","kiosk_bar":"شريط أدوات الكشك","tab_toolbar":"شريط الأدوات","tab_sidebar":"الشريط الجانبي","tab_dashboards":"لوحات المعلومات","sidebar_intro":"خصص الشريط الجانبي الأصلي في HA دون تغيير محتوى لوحات المعلومات.","sidebar_enabled":"تفعيل تخصيص الشريط الجانبي","global_appearance":"المظهر العام","native_items":"العناصر الأصلية ولوحات المعلومات","custom_items":"عناصر الشريط الجانبي المخصصة","add_sidebar_item":"+ إضافة عنصر جانبي","no_sidebar_items":"لم يتم العثور على عناصر جانبية.","visible":"مرئي","reset_item":"إعادة ضبط العنصر","reset_sidebar_global":"إعادة ضبط المظهر العام","remove_overrides":"إزالة جميع تخصيصات العناصر","restore_native":"استعادة المظهر الأصلي","icon_color":"لون الأيقونة","text_color":"لون النص","hover_background":"الخلفية عند التحويم","hover_color":"النص / الأيقونة عند التحويم","active_background":"الخلفية النشطة","active_text_color":"لون النص النشط","active_icon_color":"لون الأيقونة النشطة","border_radius":"نصف قطر الزوايا","item_height":"ارتفاع العنصر","spacing":"تباعد العناصر","text_size":"حجم النص","inherit":"استخدام الإعداد العام","filter_items":"تصفية العناصر…","native_item":"عنصر أصلي","dashboard_manager_intro":"إنشاء بيانات لوحات المعلومات الوصفية وتعديلها. لا تتغير بطاقات Lovelace.","existing_dashboards":"لوحات المعلومات الموجودة","create_dashboard":"إنشاء لوحة معلومات","dashboard_title":"عنوان لوحة المعلومات","dashboard_path":"مسار URL","show_sidebar":"إظهار في الشريط الجانبي","admin_only":"للمشرفين فقط","create":"إنشاء","update":"تحديث","delete":"حذف","confirm_delete_dashboard":"هل تريد حذف هذه اللوحة؟ سيُحذف إعداد Lovelace الخاص بها أيضًا.","storage_dashboard":"لوحة مخزنة","yaml_dashboard":"لوحة YAML (للقراءة فقط)","dashboard_created":"تم إنشاء اللوحة.","dashboard_updated":"تم تحديث اللوحة.","dashboard_deleted":"تم حذف اللوحة.","dashboard_api_error":"فشلت عملية اللوحة: ","path_hint":"أكمل البادئة dashboard-، مثل dashboard-living (أحرف إنجليزية صغيرة وأرقام و _ و -). البادئة وحدها غير كافية.","native_sidebar_restored":"تمت استعادة المظهر الأصلي.","sidebar_global_reset":"تمت إعادة ضبط المظهر العام.","overrides_removed":"تمت إزالة جميع تخصيصات العناصر.","reset_appearance":"إعادة ضبط الأحجام والتباعد","reset_appearance_done":"تمت إعادة ضبط الأحجام والتباعد.","fine_spacing":"تباعد دقيق","spacing_step_hint":"يمكن استخدام خطوات 0.5 بكسل.","color_palette":"لوحة الألوان","hue":"درجة اللون","saturation":"التشبع","brightness":"السطوع","mobile_palette":"ألوان سريعة","more_colors":"ألوان أخرى","custom_picker_title":"اختيار لون","apply":"تطبيق","cancel":"إلغاء","icon_correction":"تصحيح حجم الأيقونة","button_correction":"تصحيح حجم الزر / الخلفية","correction_hint":"0% = الحجم العام، سالب = أصغر، موجب = أكبر","colors":"الألوان","basic":"أساسي","size_appearance":"الحجم / المظهر","background_opacity":"عتامة الخلفية","hover_opacity":"العتامة عند التحويم","active_opacity":"العتامة النشطة","dashboard_path_fixed":"لا يدعم HA تغيير URL لوحة موجودة عبر هذه الواجهة البرمجية.","dashboard_admin_required":"تتطلب إدارة اللوحات صلاحيات مشرف.","dashboard_title_required":"أدخل عنوان لوحة المعلومات.","reset_icon":"استعادة الأيقونة الافتراضية","icon_picker_unavailable":"لم تحمل واجهة HA هذه منتقي الأيقونات المرئي بعد. سيظهر تلقائيًا عند توفره.","ordering_hint":"الأولوية لترتيب Sidebar Manager المحفوظ ثم ترتيب المستخدم الأصلي. تبقى اللوحات الأخرى في النهاية بترتيب المصدر. الفتح أو التحديث لا يحفظ الترتيب.","no_dashboards":"لم يتم العثور على لوحات معلومات."});
  Object.assign(TRANSLATIONS["he"], {"item_width":"רוחב הפריט (%)","item_width_hint":"100% = רוחב מלא; 20–100% מקצר את הרקע ואת אזור הלחיצה. ערך ריק יורש את ההגדרה הכללית.","appearance":"גודל וריווח סרגל הכלים","desktop":"מחשב","mobile":"נייד","icon_size":"גודל סמלים","button_gap":"רווח בין כפתורים","button_height":"גובה כפתור","horizontal_padding":"ריפוד אופקי","kiosk_fallback":"סרגל קיוסק חלופי","kiosk_fallback_hint":"כאשר סרגל HA המקורי מוסתר, הצג סרגל HA Nav Manager קטן.","kiosk_bar":"סרגל כלי קיוסק","tab_toolbar":"סרגל כלים","tab_sidebar":"סרגל צד","tab_dashboards":"לוחות מחוונים","sidebar_intro":"התאמת סרגל הצד המקורי של HA בלי לשנות את תוכן לוחות המחוונים.","sidebar_enabled":"הפעל התאמת סרגל צד","global_appearance":"מראה כללי","native_items":"פריטים מקוריים ולוחות מחוונים","custom_items":"פריטי צד מותאמים אישית","add_sidebar_item":"+ הוסף פריט צד","no_sidebar_items":"לא נמצאו פריטי צד.","visible":"גלוי","reset_item":"אפס פריט","reset_sidebar_global":"אפס מראה כללי","remove_overrides":"הסר את כל התאמות הפריטים","restore_native":"שחזר מראה מקורי","icon_color":"צבע סמל","text_color":"צבע טקסט","hover_background":"רקע בריחוף","hover_color":"טקסט / סמל בריחוף","active_background":"רקע פעיל","active_text_color":"צבע טקסט פעיל","active_icon_color":"צבע סמל פעיל","border_radius":"רדיוס פינות","item_height":"גובה פריט","spacing":"ריווח פריטים","text_size":"גודל טקסט","inherit":"השתמש בברירת המחדל הכללית","filter_items":"סנן פריטים…","native_item":"פריט מקורי","dashboard_manager_intro":"יצירה ועריכה של מטא־נתונים ללוחות. כרטיסי Lovelace אינם משתנים.","existing_dashboards":"לוחות קיימים","create_dashboard":"צור לוח מחוונים","dashboard_title":"כותרת הלוח","dashboard_path":"נתיב URL","show_sidebar":"הצג בסרגל הצד","admin_only":"מנהלים בלבד","create":"צור","update":"עדכן","delete":"מחק","confirm_delete_dashboard":"למחוק את הלוח הזה? גם תצורת Lovelace שלו תימחק.","storage_dashboard":"לוח באחסון","yaml_dashboard":"לוח YAML (לקריאה בלבד)","dashboard_created":"הלוח נוצר.","dashboard_updated":"הלוח עודכן.","dashboard_deleted":"הלוח נמחק.","dashboard_api_error":"פעולת הלוח נכשלה: ","path_hint":"השלם את הקידומת dashboard-, למשל dashboard-living (אותיות לטיניות קטנות, ספרות, _ ו-). הקידומת לבדה אינה מספיקה.","native_sidebar_restored":"המראה המקורי שוחזר.","sidebar_global_reset":"המראה הכללי אופס.","overrides_removed":"כל התאמות הפריטים הוסרו.","reset_appearance":"אפס גדלים וריווח","reset_appearance_done":"הגדלים והריווח אופסו.","fine_spacing":"ריווח עדין","spacing_step_hint":"ניתן להשתמש בצעדים של 0.5 פיקסל.","color_palette":"לוח צבעים","hue":"גוון","saturation":"רוויה","brightness":"בהירות","mobile_palette":"צבעים מהירים","more_colors":"צבעים נוספים","custom_picker_title":"בחר צבע","apply":"החל","cancel":"ביטול","icon_correction":"תיקון גודל סמל","button_correction":"תיקון גודל כפתור / רקע","correction_hint":"0% = גודל כללי, שלילי = קטן יותר, חיובי = גדול יותר","colors":"צבעים","basic":"בסיסי","size_appearance":"גודל / מראה","background_opacity":"אטימות רקע","hover_opacity":"אטימות בריחוף","active_opacity":"אטימות פעילה","dashboard_path_fixed":"HA אינו תומך בשינוי URL של לוח קיים דרך API זה.","dashboard_admin_required":"ניהול לוחות דורש הרשאות מנהל.","dashboard_title_required":"הזן כותרת ללוח.","reset_icon":"שחזר סמל ברירת מחדל","icon_picker_unavailable":"ממשק HA זה עדיין לא טען את בורר הסמלים החזותי. הוא יופיע אוטומטית כשיהיה זמין.","ordering_hint":"הסדר השמור של Sidebar Manager קודם, ואחריו הסדר המקורי של המשתמש. שאר הלוחות נשארים בסוף לפי סדר המקור. פתיחה ורענון אינם שומרים סדר.","no_dashboards":"לא נמצאו לוחות מחוונים."});
  Object.assign(TRANSLATIONS["it"], {"item_width":"Larghezza elemento (%)","item_width_hint":"100% = larghezza piena; 20–100% riduce sfondo e area cliccabile. Un valore vuoto eredita l’impostazione globale.","appearance":"Dimensioni e spaziatura della barra","desktop":"Computer","mobile":"Mobile","icon_size":"Dimensioni icone","button_gap":"Spazio tra pulsanti","button_height":"Altezza pulsanti","horizontal_padding":"Spaziatura interna orizzontale","kiosk_fallback":"Barra di riserva kiosk","kiosk_fallback_hint":"Se la barra nativa HA è nascosta, mostra una piccola barra HA Nav Manager.","kiosk_bar":"Barra kiosk","tab_toolbar":"Barra degli strumenti","tab_sidebar":"Barra laterale","tab_dashboards":"Dashboard","sidebar_intro":"Personalizza la barra laterale nativa HA senza modificare il contenuto delle dashboard.","sidebar_enabled":"Attiva personalizzazione laterale","global_appearance":"Aspetto globale","native_items":"Elementi nativi e dashboard","custom_items":"Elementi laterali personalizzati","add_sidebar_item":"+ Aggiungi elemento laterale","no_sidebar_items":"Nessun elemento laterale trovato.","visible":"Visibile","reset_item":"Ripristina elemento","reset_sidebar_global":"Ripristina aspetto globale","remove_overrides":"Rimuovi tutte le impostazioni individuali","restore_native":"Ripristina aspetto nativo","icon_color":"Colore icona","text_color":"Colore testo","hover_background":"Sfondo al passaggio","hover_color":"Testo / icona al passaggio","active_background":"Sfondo attivo","active_text_color":"Colore testo attivo","active_icon_color":"Colore icona attiva","border_radius":"Raggio degli angoli","item_height":"Altezza elemento","spacing":"Spazio tra elementi","text_size":"Dimensioni testo","inherit":"Usa valore globale","filter_items":"Filtra elementi…","native_item":"Elemento nativo","dashboard_manager_intro":"Crea e modifica i metadati delle dashboard. Le schede Lovelace non vengono modificate.","existing_dashboards":"Dashboard esistenti","create_dashboard":"Crea dashboard","dashboard_title":"Titolo dashboard","dashboard_path":"Percorso URL","show_sidebar":"Mostra nella barra laterale","admin_only":"Solo amministratori","create":"Crea","update":"Aggiorna","delete":"Elimina","confirm_delete_dashboard":"Eliminare questa dashboard? Verrà rimossa anche la configurazione Lovelace.","storage_dashboard":"Dashboard archiviata","yaml_dashboard":"Dashboard YAML (sola lettura)","dashboard_created":"Dashboard creata.","dashboard_updated":"Dashboard aggiornata.","dashboard_deleted":"Dashboard eliminata.","dashboard_api_error":"Operazione dashboard non riuscita: ","path_hint":"Completa il prefisso dashboard-, ad es. dashboard-salotto (minuscole, cifre, _ e -). Il solo prefisso non basta.","native_sidebar_restored":"Aspetto nativo ripristinato.","sidebar_global_reset":"Aspetto globale ripristinato.","overrides_removed":"Tutte le impostazioni individuali rimosse.","reset_appearance":"Ripristina dimensioni e spaziatura","reset_appearance_done":"Dimensioni e spaziatura ripristinate.","fine_spacing":"Spaziatura fine","spacing_step_hint":"Sono consentiti incrementi di 0,5 px.","color_palette":"Tavolozza colori","hue":"Tonalità","saturation":"Saturazione","brightness":"Luminosità","mobile_palette":"Colori rapidi","more_colors":"Altri colori","custom_picker_title":"Scegli colore","apply":"Applica","cancel":"Annulla","icon_correction":"Correzione dimensioni icona","button_correction":"Correzione dimensioni pulsante / sfondo","correction_hint":"0% = dimensione globale, negativo = minore, positivo = maggiore","colors":"Colori","basic":"Base","size_appearance":"Dimensioni / aspetto","background_opacity":"Opacità sfondo","hover_opacity":"Opacità al passaggio","active_opacity":"Opacità attiva","dashboard_path_fixed":"HA non supporta la modifica dell’URL di una dashboard esistente tramite questa API.","dashboard_admin_required":"La gestione delle dashboard richiede un amministratore.","dashboard_title_required":"Inserisci un titolo per la dashboard.","reset_icon":"Ripristina icona predefinita","icon_picker_unavailable":"Questa interfaccia HA non ha ancora caricato il selettore visivo delle icone. Comparirà automaticamente quando disponibile.","ordering_hint":"Prevale l’ordine salvato in Sidebar Manager, poi l’ordine nativo dell’utente. Le altre dashboard restano in fondo nell’ordine della fonte. Apertura e aggiornamento non salvano un ordine.","no_dashboards":"Nessuna dashboard trovata."});
  // END GENERATED MANAGER TRANSLATIONS

  const RTL_LANGS = new Set(["ar", "he"]);

  function currentLang() {
    const raw = (hass?.language || document.documentElement.lang || navigator.language || "en").replace("_", "-");
    if (TRANSLATIONS[raw]) return raw;
    const lower = raw.toLowerCase();
    if (lower === "pt-br" && TRANSLATIONS["pt-BR"]) return "pt-BR";
    if ((lower === "zh-tw" || lower === "zh-hk") && TRANSLATIONS["zh-TW"]) return "zh-TW";
    if (lower.startsWith("zh") && TRANSLATIONS["zh-CN"]) return "zh-CN";
    const base = lower.split("-")[0];
    return TRANSLATIONS[base] ? base : "en";
  }

  function t(key) {
    const lang = currentLang();
    return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  }

  function trLabel(type) {
    return ({
      entity: t("entity"),
      device: t("device"),
      addon: t("addon"),
      dashboard: t("dashboard"),
      settings: t("settings"),
      url: t("custom_url")
    })[type] || t("target");
  }


  function isMobileViewport() {
    return window.matchMedia("(max-width: 600px)").matches;
  }

  function metric(desktopKey, mobileKey, fallback) {
    const value = isMobileViewport() ? config?.[mobileKey] : config?.[desktopKey];
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function toolbarButtonGap() {
    return metric("buttonGapDesktop", "buttonGapMobile", 4);
  }

  function backgroundCss(item) {
    const mode = item.backgroundMode || (!item.background ? "none" : "custom");
    if (mode === "none") return "transparent";
    const opacity = Math.max(0, Math.min(100, Number(item.backgroundOpacity ?? 100)));
    const source = mode === "theme" ? "var(--primary-color)" : (item.background || "#303030");
    return `color-mix(in srgb, ${source} ${opacity}%, transparent)`;
  }

  const STORAGE_KEY = "toolbar_manager_config_v1";
  const HOST_ID = "toolbar-manager-settings-host";
  const TOOLBAR_CLASS = "toolbar-manager-item";
  const MANAGER_BUTTON_ID = "toolbar-manager-settings-button";

  const SIDEBAR_GLOBAL_DEFAULTS = Object.freeze({
    iconColor: "", textColor: "", backgroundMode: "none", background: "", backgroundOpacity: 100,
    hoverBackground: "", hoverBackgroundOpacity: 100, hoverColor: "", activeBackground: "", activeBackgroundOpacity: 100,
    activeTextColor: "", activeIconColor: "", borderRadius: 8,
    spacingDesktop: 4, spacingMobile: 4, itemHeightDesktop: 40,
    itemHeightMobile: 40, iconSizeDesktop: 24, iconSizeMobile: 24,
    textSizeDesktop: 14, textSizeMobile: 14, horizontalPaddingDesktop: 12,
    horizontalPaddingMobile: 12, itemWidthDesktop: 100, itemWidthMobile: 100
  });

  function defaultSidebarConfig() {
    return {
      enabled: false,
      globalAppearance: { ...SIDEBAR_GLOBAL_DEFAULTS },
      itemOverrides: {},
      customItems: [],
      order: []
    };
  }

  function normalizeSidebarConfig(value) {
    const input = value && typeof value === "object" ? value : {};
    return {
      enabled: !!input.enabled,
      globalAppearance: { ...SIDEBAR_GLOBAL_DEFAULTS, ...(input.globalAppearance || {}) },
      itemOverrides: input.itemOverrides && typeof input.itemOverrides === "object" ? input.itemOverrides : {},
      customItems: Array.isArray(input.customItems) ? input.customItems : [],
      order: Array.isArray(input.order) ? input.order : [],
      orderSource: input.orderSource === "manager" ? "manager" : "legacy"
    };
  }

  function normalizeConfig(value = {}) {
    return {
      ...value,
      buttons: Array.isArray(value.buttons) ? value.buttons : [],
      placement: value.placement || "after_title",
      hideTitle: !!value.hideTitle,
      iconSizeDesktop: Number(value.iconSizeDesktop ?? 22),
      iconSizeMobile: Number(value.iconSizeMobile ?? 20),
      buttonGapDesktop: Number(value.buttonGapDesktop ?? 4),
      buttonGapMobile: Number(value.buttonGapMobile ?? 2),
      buttonHeightDesktop: Number(value.buttonHeightDesktop ?? 40),
      buttonHeightMobile: Number(value.buttonHeightMobile ?? 38),
      buttonPaddingDesktop: Number(value.buttonPaddingDesktop ?? 8),
      buttonPaddingMobile: Number(value.buttonPaddingMobile ?? 5),
      kioskFallback: !!value.kioskFallback,
      sidebar: normalizeSidebarConfig(value.sidebar),
      dashboards: value.dashboards && typeof value.dashboards === "object" ? value.dashboards : {}
    };
  }

  let config = {
    buttons: [],
    placement: "after_title",
    hideTitle: false,
    iconSizeDesktop: 22,
    iconSizeMobile: 20,
    buttonGapDesktop: 4,
    buttonGapMobile: 2,
    buttonHeightDesktop: 40,
    buttonHeightMobile: 38,
    buttonPaddingDesktop: 8,
    buttonPaddingMobile: 5,
    kioskFallback: false,
    sidebar: defaultSidebarConfig(),
    dashboards: {}
  };
  let hass = null;
  let resolveHass;
  const hassReady = new Promise(resolve => { resolveHass = resolve; });

  function getHass() {
    const ha = document.querySelector("home-assistant");
    return ha?.hass || ha?.shadowRoot?.querySelector("home-assistant-main")?.hass || null;
  }

  function navigateInternal(path) {
    if (!path) return;
    if (/^https?:\/\//i.test(path)) {
      window.location.assign(path);
      return;
    }
    history.pushState(null, "", path);
    window.dispatchEvent(new Event("location-changed", { bubbles: true, composed: true }));
  }

  async function waitForHass() {
    return getHass() || hass || await hassReady;
  }

  async function loadConfig() {
    hass = hass || await waitForHass();
    try {
      const response = await hass.callWS({
        type: "frontend/get_user_data",
        key: STORAGE_KEY
      });

      // Home Assistant returns: { value: <stored data> }.
      // Older HA Nav Manager versions incorrectly treated the wrapper object
      // itself as the saved configuration, which made the editor appear empty
      // after restarting/reopening the app.
      const value = response && typeof response === "object" && "value" in response
        ? response.value
        : response;

      if (value && typeof value === "object") {
        config = normalizeConfig(value);

        // Keep a browser copy as an extra safety fallback.
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        } catch (_) {}

        return;
      }
    } catch (e) {
      console.info("[HA Nav Manager] frontend/get_user_data není dostupné, používám localStorage.");
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        config = normalizeConfig(parsed);
      }
    } catch (e) {
      console.warn("[HA Nav Manager] Nelze načíst localStorage:", e);
    }
  }

  async function saveConfig() {
    hass = hass || await waitForHass();
    let saved = false;
    const failures = [];
    try {
      await hass.callWS({
        type: "frontend/set_user_data",
        key: STORAGE_KEY,
        value: config
      });
      saved = true;
    } catch (e) {
      failures.push(`frontend user_data: ${errorDetail(e)}`);
      console.info("[HA Nav Manager] frontend/set_user_data není dostupné, ukládám do localStorage.");
    }

    // Always keep a local browser copy as a secondary fallback.
    // The primary persistent store remains Home Assistant frontend user data.
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      saved = true;
    } catch (e) {
      failures.push(`localStorage: ${errorDetail(e)}`);
      console.warn("[HA Nav Manager] Nelze uložit záložní localStorage:", e);
    }

    if (!saved) throw new Error(failures.join("; "));
    scheduleInject(true);
    sidebarRuntime?.schedule();
  }

  function createToolbarButton(item, index) {
    const btn = document.createElement("button");
    btn.className = `${TOOLBAR_CLASS} toolbar-manager-user-button`;
    btn.dataset.toolbarManagerIndex = String(index);
    btn.type = "button";
    btn.title = item.name || "Tlačítko";
    btn.setAttribute("aria-label", item.name || "Tlačítko");

    const style = item.display || "icon";
    const compact = style === "compact";
    const wide = style === "wide";
    const showIcon = style !== "text";
    const showText = ["icon_text", "text", "compact", "wide"].includes(style);

    const globalIconSize = metric("iconSizeDesktop", "iconSizeMobile", 22);
    const globalButtonHeight = metric("buttonHeightDesktop", "buttonHeightMobile", 40);
    const horizontalPadding = metric("buttonPaddingDesktop", "buttonPaddingMobile", 8);

    const iconCorrection = Math.max(-30, Math.min(30, Number(item.iconSizeCorrection ?? 0)));
    const buttonCorrection = Math.max(-30, Math.min(30, Number(item.buttonSizeCorrection ?? 0)));

    const iconSize = globalIconSize * (1 + iconCorrection / 100);
    const buttonHeight = globalButtonHeight * (1 + buttonCorrection / 100);
    const iconButtonWidth = Math.max(24, buttonHeight);

    Object.assign(btn.style, {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: compact ? "4px" : "6px",
      minWidth: style === "icon" ? `${iconButtonWidth}px` : (wide ? `${96 * (1 + buttonCorrection / 100)}px` : "auto"),
      height: `${buttonHeight}px`,
      padding: style === "icon" ? "0" : (compact
        ? `0 ${Math.max(2, (horizontalPadding - 1) * (1 + buttonCorrection / 100))}px`
        : `0 ${Math.max(2, (horizontalPadding + 2) * (1 + buttonCorrection / 100))}px`),
      border: "0",
      borderRadius: wide ? "12px" : "999px",
      background: backgroundCss(item),
      color: item.colorMode === "theme" ? "var(--app-header-text-color, var(--primary-text-color))"
        : (item.color || "var(--app-header-text-color, var(--primary-text-color))"),
      cursor: "pointer",
      font: "inherit",
      fontSize: compact ? "12px" : "14px",
      fontWeight: "500",
      whiteSpace: "nowrap"
    });

    if (showIcon && item.icon) {
      const icon = document.createElement("ha-icon");
      icon.setAttribute("icon", item.icon);
      icon.style.setProperty("--mdc-icon-size", compact ? `${Math.max(10, iconSize - 2)}px` : `${Math.max(10, iconSize)}px`);
      btn.appendChild(icon);
    }

    if (showText && item.name) {
      const span = document.createElement("span");
      span.textContent = item.name;
      btn.appendChild(span);
    }

    btn.addEventListener("mouseenter", () => {
      if ((item.backgroundMode || (!item.background ? "none" : "custom")) === "none") {
        btn.style.background = "rgba(255,255,255,.10)";
      }
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.background = backgroundCss(item);
    });

    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();

      if (item.targetType === "entity" && item.targetId) {
        const target =
          document.querySelector("home-assistant") ||
          document.querySelector("hc-main");
        const event = new CustomEvent("hass-more-info", {
          detail: { entityId: item.targetId },
          bubbles: true,
          composed: true
        });
        (target || window).dispatchEvent(event);
        return;
      }

      navigateInternal(resolveItemPath(item));
    });

    return btn;
  }

  function createManagerButton() {
    const btn = document.createElement("ha-icon-button");
    btn.id = MANAGER_BUTTON_ID;
    btn.className = TOOLBAR_CLASS;
    btn.setAttribute("label", t("manager"));
    btn.setAttribute("title", t("manager"));
    const icon = document.createElement("ha-icon");
    icon.setAttribute("icon", "mdi:dots-horizontal-circle-outline");
    btn.appendChild(icon);
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      openEditor();
    });
    return btn;
  }

  function restoreTitle(toolbar) {
    if (!toolbar) return;
    const title =
      toolbar.querySelector(".main-title") ||
      toolbar.querySelector(".title");
    if (title && title.dataset.toolbarManagerHidden === "1") {
      title.style.display = title.dataset.toolbarManagerOldDisplay || "";
      delete title.dataset.toolbarManagerHidden;
      delete title.dataset.toolbarManagerOldDisplay;
    }
  }

  function applyTitleVisibility(toolbar) {
    if (!toolbar) return;
    const title =
      toolbar.querySelector(".main-title") ||
      toolbar.querySelector(".title");
    if (!title) return;

    if (config.hideTitle || config.placement === "replace_title") {
      if (title.dataset.toolbarManagerHidden !== "1") {
        title.dataset.toolbarManagerOldDisplay = title.style.display || "";
        title.dataset.toolbarManagerHidden = "1";
      }
      title.style.display = "none";
    } else {
      restoreTitle(toolbar);
    }
  }


  function pinSystemActionsRight(ctx) {
    const el = ctx?.actionItems;
    if (!el) return;
    if (el.dataset.toolbarManagerPinned !== "1") {
      el.dataset.toolbarManagerPinned = "1";
      el.dataset.toolbarManagerOldMarginInlineStart = el.style.marginInlineStart || "";
      el.dataset.toolbarManagerOldFlexShrink = el.style.flexShrink || "";
      el.dataset.toolbarManagerOldMarginLeft = el.style.marginLeft || "";
    }
    el.style.marginInlineStart = "auto";
    el.style.marginLeft = "auto";
    el.style.flexShrink = "0";
  }

  function restoreSystemActions(ctx) {
    const el = ctx?.actionItems;
    if (!el || el.dataset.toolbarManagerPinned !== "1") return;
    el.style.marginInlineStart = el.dataset.toolbarManagerOldMarginInlineStart || "";
    el.style.marginLeft = el.dataset.toolbarManagerOldMarginLeft || "";
    el.style.flexShrink = el.dataset.toolbarManagerOldFlexShrink || "";
    delete el.dataset.toolbarManagerPinned;
    delete el.dataset.toolbarManagerOldMarginInlineStart;
    delete el.dataset.toolbarManagerOldMarginLeft;
    delete el.dataset.toolbarManagerOldFlexShrink;
  }


  function findOverflowDropdown(ctx) {
    const actionItems = ctx?.actionItems;
    if (!actionItems) return null;

    for (const dropdown of actionItems.querySelectorAll("ha-dropdown")) {
      if (dropdown.querySelector("#dashboardmenu")) return dropdown;
    }
    return null;
  }

  function restoreLeftTitleLayout(toolbar) {
    if (!toolbar) return;
    const title =
      toolbar.querySelector(".main-title") ||
      toolbar.querySelector(".title");

    if (!title || title.dataset.toolbarManagerLeftLayout !== "1") return;

    title.style.flex = title.dataset.toolbarManagerOldFlex || "";
    title.style.flexGrow = title.dataset.toolbarManagerOldFlexGrow || "";
    title.style.flexShrink = title.dataset.toolbarManagerOldFlexShrink || "";
    title.style.flexBasis = title.dataset.toolbarManagerOldFlexBasis || "";
    title.style.width = title.dataset.toolbarManagerOldWidth || "";
    title.style.minWidth = title.dataset.toolbarManagerOldMinWidth || "";
    title.style.maxWidth = title.dataset.toolbarManagerOldMaxWidth || "";

    delete title.dataset.toolbarManagerLeftLayout;
    delete title.dataset.toolbarManagerOldFlex;
    delete title.dataset.toolbarManagerOldFlexGrow;
    delete title.dataset.toolbarManagerOldFlexShrink;
    delete title.dataset.toolbarManagerOldFlexBasis;
    delete title.dataset.toolbarManagerOldWidth;
    delete title.dataset.toolbarManagerOldMinWidth;
    delete title.dataset.toolbarManagerOldMaxWidth;
  }

  function prepareLeftTitleLayout(toolbar) {
    if (!toolbar) return null;
    const title =
      toolbar.querySelector(".main-title") ||
      toolbar.querySelector(".title");

    if (!title) return null;

    if (title.dataset.toolbarManagerLeftLayout !== "1") {
      title.dataset.toolbarManagerLeftLayout = "1";
      title.dataset.toolbarManagerOldFlex = title.style.flex || "";
      title.dataset.toolbarManagerOldFlexGrow = title.style.flexGrow || "";
      title.dataset.toolbarManagerOldFlexShrink = title.style.flexShrink || "";
      title.dataset.toolbarManagerOldFlexBasis = title.style.flexBasis || "";
      title.dataset.toolbarManagerOldWidth = title.style.width || "";
      title.dataset.toolbarManagerOldMinWidth = title.style.minWidth || "";
      title.dataset.toolbarManagerOldMaxWidth = title.style.maxWidth || "";
    }

    // Home Assistant dává titulku pružnou šířku a tím odsouvá další prvky doprava.
    // Inline styl titulku stáhne jen na šířku obsahu a nechá ho v případě potřeby zmenšit.
    title.style.flex = "0 1 auto";
    title.style.flexGrow = "0";
    title.style.flexShrink = "1";
    title.style.flexBasis = "auto";
    title.style.width = "auto";
    title.style.minWidth = "0";
    title.style.maxWidth = isMobileViewport() ? "48vw" : "55vw";

    return title;
  }

  function injectManagerIntoOverflow(ctx) {
    if (!hass?.user?.is_admin) return false;

    const dropdown = findOverflowDropdown(ctx);
    if (!dropdown) return false;

    dropdown.querySelector("#toolbar-manager-overflow-item")?.remove();

    const item = document.createElement("ha-dropdown-item");
    item.id = "toolbar-manager-overflow-item";
    item.className = TOOLBAR_CLASS;
    item.value = "__toolbar_manager__";
    item.setAttribute("value", "__toolbar_manager__");

    const icon = document.createElement("ha-icon");
    icon.setAttribute("slot", "icon");
    icon.setAttribute("icon", "mdi:tune-variant");
    item.appendChild(icon);

    const label = document.createElement("span");
    label.textContent = t("manager");
    item.appendChild(label);

    let opened = false;
    const launch = (ev) => {
      if (opened) return;
      opened = true;
      ev?.preventDefault?.();
      ev?.stopPropagation?.();
      ev?.stopImmediatePropagation?.();
      try { dropdown.open = false; } catch (_) {}
      Promise.resolve().then(() => openEditor()).catch(error => {
        console.error("[HA Nav Manager] Editor:", error);
      }).finally(() => { opened = false; });
    };

    // Klik je hlavní cesta.
    item.addEventListener("click", launch, true);

    // Ochrana proti předání na nativní _handleOverflowItemSelect HA.
    if (!dropdown.__toolbarManagerSelectHandler) {
      dropdown.__toolbarManagerSelectHandler = (ev) => {
        const selected = ev?.detail?.item;
        const value =
          selected?.value ??
          selected?.getAttribute?.("value") ??
          ev?.detail?.value;

        if (value === "__toolbar_manager__") {
          ev.preventDefault?.();
          ev.stopPropagation?.();
          ev.stopImmediatePropagation?.();
        }
      };
      dropdown.addEventListener("wa-select", dropdown.__toolbarManagerSelectHandler, true);
    }

    dropdown.appendChild(item);
    return true;
  }

  // Home Assistant does not expose per-item sidebar styling through an API.
  // Keep the unavoidable Shadow DOM integration isolated and fully reversible.
  class SidebarRuntime {
    constructor() {
      this.host = null;
      this.controller = null;
      this.frame = null;
      this.nativeState = new Map();
      this.observedOrder = [];
      this.nativeOrder = [];
      this.orderRequested = false;
      window.addEventListener("resize", () => this.schedule(), { passive: true });
      window.addEventListener("location-changed", () => this.schedule());
      window.addEventListener("popstate", () => this.schedule());
    }

    attach(host) {
      if (!host) return;
      if (this.host === host && this.controller) return;
      if (!customElements.get(host.localName)) {
        customElements.whenDefined(host.localName).then(() => this.attach(host));
        return;
      }
      this.detach();
      this.host = host;
      if (typeof host.addController === "function") {
        this.controller = {
          hostConnected: () => this.schedule(),
          hostUpdated: () => this.schedule(),
          hostDisconnected: () => this.schedule()
        };
        host.addController(this.controller);
      }
      this.schedule();
    }

    detach() {
      if (this.host && this.controller) this.host.removeController?.(this.controller);
      this.restore();
      this.host = null;
      this.controller = null;
    }

    schedule() {
      if (this.frame !== null) return;
      this.frame = requestAnimationFrame(() => {
        this.frame = null;
        try { this.reconcile(); }
        catch (error) { console.warn("[HA Nav Manager] Sidebar:", error); }
      });
    }

    remember(element) {
      if (this.nativeState.has(element)) return;
      const text = element.querySelector(".item-text, [slot='headline']");
      const icon = element.querySelector("ha-icon[slot='start']");
      this.nativeState.set(element, {
        style: element.getAttribute("style"), className: element.className,
        hidden: element.hidden, text: text?.textContent, iconNode: element.querySelector("ha-icon[slot='start'], ha-svg-icon[slot='start']"), icon: icon?.getAttribute("icon"), parent: element.parentNode, next: element.nextSibling
      });
    }

    restore() {
      const root = this.host?.shadowRoot;
      root?.getElementById("toolbar-manager-sidebar-style")?.remove();
      root?.querySelectorAll("[data-toolbar-manager-custom='1']").forEach(node => node.remove());
      for (const [element, state] of this.nativeState) {
        if (!element?.isConnected) continue;
        if (state.style == null) element.removeAttribute("style"); else element.setAttribute("style", state.style);
        element.classList.remove("tm-sidebar-item");
        element.removeAttribute("data-tm-active-background");
        element.removeAttribute("data-tm-hover-background");
        if (state.parent?.isConnected) state.parent.insertBefore(element, state.next?.parentNode === state.parent ? state.next : null);
        element.hidden = state.hidden;
        const text = element.querySelector(".item-text, [slot='headline']");
        if (text && state.text != null) text.textContent = state.text;
        const icon = element.querySelector("ha-icon[slot='start']");
        if (state.iconNode && state.iconNode !== icon) icon?.replaceWith(state.iconNode);
        if (state.iconNode && state.icon != null) state.iconNode.setAttribute("icon", state.icon);
      }
      this.nativeState = new Map();
    }

    css() {
      return `
        .tm-sidebar-item {
          box-sizing: border-box !important;
          width: var(--tm-width, 100%) !important;
          max-width: 100% !important;
          min-width: 0 !important;
          margin-inline-end: auto !important;
          overflow: hidden;
          min-height: var(--tm-height, 40px) !important;
          --ha-row-item-min-height: var(--tm-height, 40px);
          --ha-row-item-padding-inline: var(--tm-padding, 12px);
          margin-bottom: var(--tm-spacing, 4px) !important;
          border-radius: var(--tm-radius, 8px) !important;
          background: var(--tm-background, transparent) !important;
        }
        .tm-sidebar-item::part(headline) { color: var(--tm-text, var(--sidebar-text-color)) !important; }
        .tm-sidebar-item .item-text { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size: var(--tm-text-size, 14px) !important; color: var(--tm-text, var(--sidebar-text-color)) !important; }
        .tm-sidebar-item ha-icon[slot="start"], .tm-sidebar-item ha-svg-icon[slot="start"] {
          width: var(--tm-icon-size, 24px) !important; height: var(--tm-icon-size, 24px) !important;
          color: var(--tm-icon, var(--sidebar-icon-color)) !important;
          --mdc-icon-size: var(--tm-icon-size, 24px);
        }
        .tm-sidebar-item:hover { background: var(--tm-hover-background, var(--tm-background, transparent)) !important; }
        .tm-sidebar-item:hover::part(headline), .tm-sidebar-item:hover .item-text {
          color: var(--tm-hover-color, var(--tm-text, var(--sidebar-text-color))) !important;
        }
        .tm-sidebar-item:hover ha-icon[slot="start"], .tm-sidebar-item:hover ha-svg-icon[slot="start"] {
          color: var(--tm-hover-color, var(--tm-icon, var(--sidebar-icon-color))) !important;
        }
        .tm-sidebar-item[data-tm-active-background].selected::before { background: transparent !important; }
        .tm-sidebar-item[data-tm-hover-background]::part(ripple),
        .tm-sidebar-item[data-tm-active-background].selected::part(ripple),
        .tm-sidebar-item[data-tm-active-background][data-toolbar-manager-active="1"]::part(ripple) { display: none; }
        .tm-sidebar-item[hidden] { display: none !important; }
        .tm-sidebar-item.selected, .tm-sidebar-item[data-toolbar-manager-active="1"] {
          background: var(--tm-active-background, var(--tm-background, transparent)) !important;
        }
        .tm-sidebar-item.selected::part(headline), .tm-sidebar-item[data-toolbar-manager-active="1"]::part(headline),
        .tm-sidebar-item.selected .item-text, .tm-sidebar-item[data-toolbar-manager-active="1"] .item-text {
          color: var(--tm-active-text, var(--sidebar-selected-icon-color)) !important;
        }
        .tm-sidebar-item.selected ha-icon[slot="start"], .tm-sidebar-item[data-toolbar-manager-active="1"] ha-icon[slot="start"],
        .tm-sidebar-item.selected ha-svg-icon[slot="start"], .tm-sidebar-item[data-toolbar-manager-active="1"] ha-svg-icon[slot="start"] {
          color: var(--tm-active-icon, var(--sidebar-selected-icon-color)) !important;
        }
      `;
    }

    value(override, global, key, fallback = "") {
      const value = override?.[key];
      const resolved = value !== undefined && value !== null && value !== "" ? value : (global?.[key] ?? fallback);
      // Explicit theme/default removes custom color without inheriting a global override.
      return ["theme", "default"].includes(resolved) && key !== "backgroundMode" ? "" : resolved;
    }

    applyStyle(element, override = {}) {
      const global = config.sidebar.globalAppearance;
      const mobile = isMobileViewport();
      const rawWidth = Number(this.value(override, global, mobile ? "itemWidthMobile" : "itemWidthDesktop", 100));
      const width = Number.isFinite(rawWidth) ? Math.max(20, Math.min(100, rawWidth)) : 100;
      const backgroundMode = this.value(override, global, "backgroundMode", "none");
      const background = backgroundMode === "theme" ? "var(--sidebar-background-color, var(--primary-color))" : this.value(override, global, "background");
      const opacity = Number(this.value(override, global, "backgroundOpacity", 100));
      const mixed = backgroundMode === "none" ? "transparent" : (background ? `color-mix(in srgb, ${background} ${Math.max(0, Math.min(100, opacity))}%, transparent)` : "transparent");
      const mix = (colorKey, opacityKey) => {
        const color = this.value(override, global, colorKey);
        const raw = Number(this.value(override, global, opacityKey, 100));
        const alpha = Number.isFinite(raw) ? Math.max(0, Math.min(100, raw)) : 100;
        return color ? `color-mix(in srgb, ${color} ${alpha}%, transparent)` : "";
      };
      element.toggleAttribute("data-tm-active-background", !!this.value(override, global, "activeBackground"));
      element.toggleAttribute("data-tm-hover-background", !!this.value(override, global, "hoverBackground"));
      const values = {
        "--tm-width": `${width}%`,
        "--tm-icon": this.value(override, global, "iconColor"),
        "--tm-text": this.value(override, global, "textColor"),
        "--tm-background": mixed,
        "--tm-hover-background": mix("hoverBackground", "hoverBackgroundOpacity"),
        "--tm-hover-color": this.value(override, global, "hoverColor"),
        "--tm-active-background": mix("activeBackground", "activeBackgroundOpacity"),
        "--tm-active-text": this.value(override, global, "activeTextColor"),
        "--tm-active-icon": this.value(override, global, "activeIconColor"),
        "--tm-radius": `${Number(this.value(override, global, "borderRadius", 8))}px`,
        "--tm-spacing": `${Number(this.value(override, global, mobile ? "spacingMobile" : "spacingDesktop", 4))}px`,
        "--tm-height": `${Number(this.value(override, global, mobile ? "itemHeightMobile" : "itemHeightDesktop", 40))}px`,
        "--tm-icon-size": `${Number(this.value(override, global, mobile ? "iconSizeMobile" : "iconSizeDesktop", 24))}px`,
        "--tm-text-size": `${Number(this.value(override, global, mobile ? "textSizeMobile" : "textSizeDesktop", 14))}px`,
        "--tm-padding": `${Number(this.value(override, global, mobile ? "horizontalPaddingMobile" : "horizontalPaddingDesktop", 12))}px`
      };
      element.classList.add("tm-sidebar-item");
      for (const [key, value] of Object.entries(values)) {
        if (value !== "") element.style.setProperty(key, value);
        else element.style.removeProperty(key);
      }
    }

    createCustom(item) {
      const element = document.createElement("ha-list-item-button");
      element.id = `toolbar-manager-sidebar-${item.id}`;
      element.dataset.toolbarManagerCustom = "1";
      const icon = document.createElement("ha-icon");
      icon.slot = "start";
      icon.setAttribute("icon", item.icon || "mdi:link-variant");
      const text = document.createElement("span");
      text.className = "item-text";
      text.slot = "headline";
      text.textContent = item.name || t("new_button");
      element.append(icon, text);
      element.addEventListener("click", () => {
        if (item.targetType === "entity" && item.targetId) {
          (document.querySelector("home-assistant") || window).dispatchEvent(new CustomEvent("hass-more-info", {
            detail: { entityId: item.targetId }, bubbles: true, composed: true
          }));
        } else navigateInternal(resolveItemPath(item));
        if (this.host?.narrow) {
          this.host.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true }));
        }
      });
      return element;
    }

    reconcile() {
      const root = this.host?.shadowRoot;
      if (!root) return;
      if (!config.sidebar?.enabled) { this.restore(); return; }
      let style = root.getElementById("toolbar-manager-sidebar-style");
      if (!style) {
        style = document.createElement("style");
        style.id = "toolbar-manager-sidebar-style";
        root.appendChild(style);
      }
      style.textContent = this.css();
      const nav = root.querySelector("ha-list-nav.before-spacer") || root.querySelector("ha-list-nav");
      if (!nav) return;
      if (!this.orderRequested) {
        this.orderRequested = true;
        void loadNativeSidebarOrder().then(order => { this.nativeOrder = order; this.schedule(); });
      }
      root.querySelectorAll("[data-toolbar-manager-custom='1']").forEach(node => node.remove());
      const native = new Map();
      root.querySelectorAll("ha-list-item-button[id^='sidebar-']").forEach(element => {
        const id = element.id.replace(/^sidebar-(?:panel-)?/, "");
        native.set(id, element);
        this.remember(element);
        const override = config.sidebar.itemOverrides[id] || {};
        element.hidden = override.visible === false;
        const text = element.querySelector(".item-text, [slot='headline']");
        if (text) text.textContent = override.name || this.nativeState.get(element).text;
        let icon = element.querySelector("ha-icon[slot='start']");
        if (override.icon) {
          if (!icon) {
            element.querySelector("ha-svg-icon[slot='start']")?.remove();
            icon = document.createElement("ha-icon"); icon.slot = "start"; element.prepend(icon);
          }
          icon.setAttribute("icon", override.icon);
        }
        else {
          const original = this.nativeState.get(element);
          if (original.iconNode && icon !== original.iconNode) icon?.replaceWith(original.iconNode);
          if (original.iconNode && original.icon != null) original.iconNode.setAttribute("icon", original.icon);
        }
        this.applyStyle(element, override);
      });
      const custom = new Map();
      for (const item of config.sidebar.customItems) {
        if (!item || item.enabled === false) continue;
        const element = this.createCustom(item);
        this.applyStyle(element, item);
        const targetPath = resolveItemPath(item);
        element.dataset.toolbarManagerActive = targetPath && location.pathname.startsWith(targetPath) ? "1" : "0";
        custom.set(`custom:${item.id}`, element);
      }
      this.observedOrder = [...new Set([...this.observedOrder, ...native.keys()])];
      const nativeOrder = [...new Set([...this.nativeOrder, ...this.observedOrder])];
      const orderedIds = [...managerSidebarOrder(config.sidebar, nativeOrder), ...nativeOrder, ...native.keys(), ...custom.keys()];
      const used = new Set();
      for (const id of orderedIds) {
        if (used.has(id)) continue;
        const element = native.get(id) || custom.get(id);
        if (element) { (native.has(id) ? this.nativeState.get(element).parent : nav).appendChild(element); used.add(id); }
      }
    }
  }

  let sidebarRuntime = null;

  // A controller is attached to shell components, never to dashboard cards.
  // Lit notifies it after every render, including the very first render.
  class ToolbarRuntime {
    constructor() {
      this.controllers = new Map();
      this.definitions = new Set();
      this.frame = null;
      this.loaded = false;
      this.loading = false;
      this.mount = null;
      this.candidates = [];
      this.events = [];
      this.phase = "starting";
      this.resizeTargets = new Set();
      this.resizeObserver = new ResizeObserver(() => this.schedule());
      this.onRoute = () => this.schedule();
      this.onResize = () => this.schedule();
      this.readyObserver = new MutationObserver(() => {
        if (document.querySelector("home-assistant")) this.schedule();
      });
    }

    record(event, detail = {}) {
      this.events.push({ time: new Date().toISOString(), event, ...detail });
      if (this.events.length > 100) this.events.shift();
    }

    start() {
      window.addEventListener("location-changed", this.onRoute);
      window.addEventListener("popstate", this.onRoute);
      window.addEventListener("resize", this.onResize, { passive: true });
      this.record("start", { version: VERSION });
      this.schedule();
    }

    schedule() {
      if (this.frame !== null) return;
      this.frame = requestAnimationFrame(() => {
        this.frame = null;
        try {
          this.reconcile();
        } catch (error) {
          this.record("error", { phase: this.phase, message: String(error), stack: error?.stack });
          console.error(`[HA Nav Manager] ${this.phase}:`, error);
        }
      });
    }

    bind(host) {
      if (this.controllers.has(host)) return;
      if (typeof host.addController === "function") {
        const controller = {
          hostConnected: () => this.schedule(),
          hostUpdated: () => this.schedule(),
          hostDisconnected: () => this.schedule()
        };
        this.controllers.set(host, controller);
        host.addController(controller);
      } else if (host.localName.includes("-") && !customElements.get(host.localName) &&
                 !this.definitions.has(host.localName)) {
        const name = host.localName;
        this.definitions.add(name);
        customElements.whenDefined(name).then(() => this.schedule());
      }
    }

    discover(app) {
      const contexts = [];
      const seen = new Set();
      const visit = (element) => {
        if (element.localName === "ha-sidebar") {
          sidebarRuntime?.attach(element);
          return;
        }
        // The view content and primitive controls cannot own the app toolbar.
        if (element.id === HOST_ID || element.classList.contains(TOOLBAR_CLASS) ||
            /^(hui-view|ha-sidebar|ha-icon|ha-svg-icon|ha-icon-button.*|ha-dropdown.*|ha-tab-group.*)$/.test(element.localName)) return;
        this.bind(element);
        if (element.classList.contains("action-items")) {
          const toolbar = element.closest(".toolbar, div.header") || element.parentElement;
          if (toolbar && !seen.has(element)) {
            seen.add(element);
            contexts.push({ root: toolbar.getRootNode(), toolbar, actionItems: element });
          }
        }
        for (const child of element.children) visit(child);
        if (element.shadowRoot) {
          for (const child of element.shadowRoot.children) visit(child);
        }
      };
      visit(app);
      for (const [host, controller] of this.controllers) {
        if (!host.isConnected) {
          host.removeController?.(controller);
          this.controllers.delete(host);
        }
      }
      const targets = new Set(contexts.map(ctx => ctx.toolbar));
      for (const target of this.resizeTargets) {
        if (!targets.has(target)) this.resizeObserver.unobserve(target);
      }
      for (const target of targets) {
        if (!this.resizeTargets.has(target)) this.resizeObserver.observe(target);
      }
      this.resizeTargets = targets;
      return contexts;
    }

    visible(element) {
      if (!element.isConnected) return false;
      const rect = element.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return false;
      for (let node = element; node; node = node.parentElement || node.getRootNode()?.host) {
        const style = getComputedStyle(node);
        if (node.hidden || style.display === "none" || style.visibility === "hidden") return false;
      }
      return true;
    }

    async load() {
      this.loading = true;
      try {
        await loadConfig();
        this.loaded = true;
        sidebarRuntime?.schedule();
        this.record("configuration-loaded", { buttons: config.buttons.length, placement: config.placement });
        this.schedule();
      } catch (error) {
        this.record("configuration-error", { message: String(error), stack: error?.stack });
        console.error("[HA Nav Manager] Configuration:", error);
      }
    }

    destination(ctx) {
      const title = ctx.toolbar.querySelector(".main-title, .title");
      if (config.placement === "inside_actions") {
        let anchor = findOverflowDropdown(ctx);
        // insertBefore requires an immediate child, not a nested descendant.
        while (anchor && anchor.parentNode !== ctx.actionItems) anchor = anchor.parentElement;
        return { parent: ctx.actionItems, anchor, title };
      }
      if (["after_title", "replace_title"].includes(config.placement) && title) {
        return { parent: title.parentNode, anchor: title.nextSibling, title };
      }
      return { parent: ctx.actionItems.parentNode, anchor: ctx.actionItems, title };
    }

    createZone() {
      this.phase = "create-buttons";
      const zone = document.createElement("div");
      zone.id = "toolbar-manager-zone";
      zone.className = TOOLBAR_CLASS;
      zone.setAttribute("role", "toolbar");
      zone.setAttribute("aria-label", t("title"));
      Object.assign(zone.style, {
        display: "inline-flex", alignItems: "center", gap: `${toolbarButtonGap()}px`,
        minWidth: "0", flexShrink: "0", marginInlineStart: "0", marginInlineEnd: "0"
      });
      config.buttons.forEach((item, index) => {
        if (!item || typeof item !== "object" || item.enabled === false) return;
        try {
          zone.appendChild(createToolbarButton(item, index));
        } catch (error) {
          this.record("button-error", { index, message: String(error), stack: error?.stack });
          console.error(`[HA Nav Manager] Button ${index}:`, error);
        }
      });
      return zone;
    }

    unmount() {
      const previous = this.mount;
      if (!previous) return;
      previous.zone.remove();
      previous.manager?.remove();
      previous.bar?.remove();
      if (previous.ctx) {
        restoreLeftTitleLayout(previous.ctx.toolbar);
        restoreTitle(previous.ctx.toolbar);
        restoreSystemActions(previous.ctx);
      }
      this.mount = null;
    }

    syncManager(ctx) {
      this.phase = "manager-menu";
      const mount = this.mount;
      const dropdown = ctx ? findOverflowDropdown(ctx) : null;
      const parent = dropdown || ctx?.actionItems || mount.bar;
      if (!hass?.user?.is_admin) {
        mount.manager?.remove();
        mount.manager = null;
        return;
      }
      if (mount.manager?.parentNode === parent) return;
      mount.manager?.remove();
      if (dropdown && injectManagerIntoOverflow(ctx)) {
        mount.manager = dropdown.querySelector("#toolbar-manager-overflow-item");
      } else {
        mount.manager = createManagerButton();
        parent.appendChild(mount.manager);
      }
    }

    reconcile() {
      this.phase = "discover-shell";
      const app = document.querySelector("home-assistant");
      if (!app) {
        this.readyObserver.observe(document.documentElement, { childList: true, subtree: true });
        this.unmount();
        return;
      }
      this.readyObserver.disconnect();
      const contexts = this.discover(app);
      this.candidates = contexts.map(ctx => {
        const rect = ctx.toolbar.getBoundingClientRect();
        return { owner: ctx.root.host?.localName, connected: ctx.toolbar.isConnected,
          visible: this.visible(ctx.toolbar), width: rect.width, height: rect.height };
      });
      hass = getHass() || hass;
      if (!hass) return;
      resolveHass(hass);
      if (!this.loading) void this.load();
      if (!this.loaded) return;

      const visible = contexts.filter(ctx => this.visible(ctx.toolbar));
      visible.sort((a, b) => Math.abs(a.toolbar.getBoundingClientRect().top) - Math.abs(b.toolbar.getBoundingClientRect().top));
      const ctx = visible[0] || null;
      const signature = JSON.stringify([config, isMobileViewport(), !!hass.user?.is_admin, currentLang()]);
      if (!ctx && !config.kioskFallback) {
        if (this.mount) this.record("toolbar-unavailable");
        this.unmount();
        this.phase = "waiting-for-toolbar";
        return;
      }

      const destination = ctx ? this.destination(ctx) : null;
      const old = this.mount;
      const intact = old && old.signature === signature && old.zone.isConnected &&
        old.ctx?.actionItems === ctx?.actionItems && old.title === destination?.title &&
        (ctx ? old.zone.parentNode === destination.parent : old.bar?.isConnected) &&
        old.buttons.every(button => button.parentNode === old.zone);
      if (intact) {
        this.syncManager(ctx);
        this.phase = "mounted";
        return;
      }

      // Build off-DOM before removing the previous working toolbar.
      const zone = this.createZone();
      this.phase = "mount-toolbar";
      this.unmount();
      const mount = { ctx, zone, signature, title: destination?.title, buttons: [...zone.children] };
      this.mount = mount;
      if (ctx) {
        pinSystemActionsRight(ctx);
        applyTitleVisibility(ctx.toolbar);
        if (config.placement === "after_title") prepareLeftTitleLayout(ctx.toolbar);
        if (config.placement === "before_actions") zone.style.marginInlineStart = "auto";
        // Recompute after unmount: an old zone may have been title.nextSibling.
        const target = this.destination(ctx);
        target.parent.insertBefore(zone, target.anchor);
      } else {
        const bar = document.createElement("div");
        bar.id = "toolbar-manager-kiosk-bar";
        bar.className = TOOLBAR_CLASS;
        Object.assign(bar.style, {
          position: "fixed", top: "0", left: "0", right: "0", zIndex: "2147483000",
          minHeight: `${metric("buttonHeightDesktop", "buttonHeightMobile", 40) + 8}px`,
          display: "flex", alignItems: "center", gap: `${toolbarButtonGap()}px`, padding: "4px 8px",
          background: "var(--app-header-background-color, var(--primary-color, #202124))",
          color: "var(--app-header-text-color, var(--text-primary-color, #fff))",
          boxShadow: "0 1px 4px rgba(0,0,0,.24)", overflowX: "auto", boxSizing: "border-box"
        });
        zone.style.marginInlineEnd = "auto";
        bar.appendChild(zone);
        document.body.appendChild(bar);
        mount.bar = bar;
      }
      this.syncManager(ctx);
      this.phase = "mounted";
      this.record("mounted", {
        owner: ctx?.root.host?.localName || "kiosk", placement: config.placement,
        buttons: zone.children.length, connected: zone.isConnected
      });
    }

    diagnostics() {
      const zone = this.mount?.zone;
      const rect = zone?.getBoundingClientRect();
      const ancestors = [];
      for (let node = zone; node; node = node.parentElement || node.getRootNode()?.host) {
        const style = getComputedStyle(node);
        const bounds = node.getBoundingClientRect();
        ancestors.push({ tag: node.localName, className: node.className,
          display: style.display, visibility: style.visibility, opacity: style.opacity,
          overflowX: style.overflowX, overflowY: style.overflowY,
          x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height });
      }
      return {
        version: VERSION, phase: this.phase, configuredButtons: config.buttons.length,
        enabledButtons: config.buttons.filter(item => item && item.enabled !== false).length,
        sidebar: {
          enabled: !!config.sidebar?.enabled,
          overrides: Object.keys(config.sidebar?.itemOverrides || {}).length,
          customItems: config.sidebar?.customItems?.length || 0,
          connected: !!sidebarRuntime?.host?.isConnected
        },
        placement: config.placement, loaded: this.loaded, loading: this.loading,
        hassAvailable: !!getHass(), readyState: document.readyState,
        visibilityState: document.visibilityState,
        candidates: this.candidates,
        hosts: [...this.controllers.keys()].map(host => host.localName),
        zone: zone ? { connected: zone.isConnected, buttons: zone.children.length,
          x: rect.x, y: rect.y, width: rect.width, height: rect.height,
          parent: zone.parentElement?.localName, ancestors } : null,
        events: [...this.events]
      };
    }
  }

  function scheduleInject() {
    runtime.schedule();
  }

  function resolveItemPath(item) {
    switch (item.targetType) {
      case "entity":
        return item.targetId || "";
      case "device":
        return item.targetId ? `/config/devices/device/${item.targetId}` : "";
      case "addon":
        return item.targetId ? `/app/${item.targetId}` : "";
      case "dashboard":
        if (!item.targetId) return "";
        return item.targetId.startsWith("/") ? item.targetId : `/${item.targetId}`;
      case "settings":
        return item.targetId || "";
      case "url":
        return item.targetId || "";
      default:
        return item.targetId || "";
    }
  }

  async function loadEntities() {
    hass = getHass() || hass;
    const items = Object.values(hass?.states || {}).map(state => {
      const name = state?.attributes?.friendly_name || state.entity_id;
      return {
        id: state.entity_id,
        name: `${name} (${state.entity_id})`
      };
    });
    return items.sort((a, b) => a.name.localeCompare(b.name, "cs"));
  }

  async function loadDevices() {
    try {
      const devices = await hass.callWS({ type: "config/device_registry/list" });
      return (devices || [])
        .map(d => ({
          id: d.id,
          name: d.name_by_user || d.name || d.model || d.id
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "cs"));
    } catch (e) {
      console.warn("[HA Nav Manager] Device registry:", e);
      return [];
    }
  }

  async function loadDashboards() {
    const result = [{ id: "/lovelace", name: t("overview") }];
    try {
      const dashboards = await hass.callWS({ type: "lovelace/dashboards/list" });
      for (const d of dashboards || []) {
        const path = d.url_path ? `/${d.url_path}` : "/lovelace";
        if (!result.some(x => x.id === path)) {
          result.push({ id: path, name: d.title || d.url_path || "Dashboard" });
        }
      }
    } catch (e) {
      console.warn("[HA Nav Manager] Dashboard list:", e);
    }
    return result;
  }

  async function loadDashboardRecords(strict = false) {
    try {
      return await hass.callWS({ type: "lovelace/dashboards/list" }) || [];
    } catch (e) {
      console.warn("[HA Nav Manager] Dashboard metadata list:", e);
      if (strict) throw e;
      return [];
    }
  }

  // HA's per-user sidebar preferences, separate from our saved configuration.
  function errorDetail(error) {
    return [error?.code, error?.message || (typeof error === "string" ? error : JSON.stringify(error))].filter(Boolean).join(": ");
  }

  async function loadNativeSidebarOrder() {
    try {
      const result = await hass.callWS({ type: "frontend/get_user_data", key: "sidebar" });
      if (Array.isArray(result?.value?.panelOrder)) return result.value.panelOrder.filter(id => typeof id === "string");
    } catch (error) {
      console.warn("[HA Nav Manager] Native sidebar order unavailable:", error);
    }
    // Same legacy fallback as HA's ha-sidebar; never write or migrate it here.
    try {
      const legacy = JSON.parse(localStorage.getItem("sidebarPanelOrder") || "null");
      return Array.isArray(legacy) ? legacy.filter(id => typeof id === "string") : [];
    } catch { return []; }
  }

  function orderedItems(items, explicitOrder, nativeOrder, key) {
    const order = [...new Set([...(explicitOrder || []), ...(nativeOrder || [])])];
    const rank = new Map(order.map((id, index) => [id, index]));
    // Stable sort: unpositioned entries keep their API/source order at the end.
    return [...items].sort((a, b) => (rank.get(key(a)) ?? Infinity) - (rank.get(key(b)) ?? Infinity));
  }

  function managerSidebarOrder(sidebar, nativeOrder) {
    // v0.8.0/1 wrote alphabetic order even without a user move. Keep that data,
    // but let the real HA order win unless a move was explicitly saved by us.
    return sidebar.orderSource === "manager" || !nativeOrder.length ? sidebar.order : [];
  }

  function availableNativeOrder(saved) {
    if (saved.length) return saved;
    const visible = [...(sidebarRuntime?.host?.shadowRoot?.querySelectorAll("ha-list-item-button[id^='sidebar-']") || [])].map(item => item.id.replace(/^sidebar-(?:panel-)?/, ""));
    return [...new Set([...saved, ...(sidebarRuntime?.observedOrder || []), ...visible])];
  }

  async function createDashboard(values) {
    const payload = { ...values };
    if (!payload.title?.trim()) throw new Error(t("dashboard_title_required"));
    if (!/^[a-z0-9_-]+$/.test(payload.url_path || "") || !payload.url_path.includes("-") || payload.url_path === "dashboard-") throw new Error(t("path_hint"));
    if (!payload.icon) delete payload.icon;
    return hass.callWS({ type: "lovelace/dashboards/create", mode: "storage", ...payload });
  }

  async function updateDashboard(id, values) {
    if ("title" in values && !values.title.trim()) throw new Error(t("dashboard_title_required"));
    return hass.callWS({ type: "lovelace/dashboards/update", dashboard_id: id, ...values, ...("icon" in values ? { icon: values.icon?.trim() || null } : {}) });
  }

  async function deleteDashboard(id) {
    return hass.callWS({ type: "lovelace/dashboards/delete", dashboard_id: id });
  }

  function panelTitle(panel, key) {
    const localized = panel?.title && hass?.localize?.(panel.title);
    return localized || panel?.title || key;
  }

  async function loadSidebarItems(dashboardRecords) {
    const items = new Map();
    for (const [key, panel] of Object.entries(hass?.panels || {})) {
      const path = String(panel?.url_path || key).replace(/^\//, "");
      if (!path) continue;
      items.set(path, {
        id: path, name: panelTitle(panel, path), icon: panel?.icon || "mdi:view-dashboard-outline",
        path: `/${path}`, native: true, dashboard: panel?.component_name === "lovelace",
        showInSidebar: panel?.show_in_sidebar !== false
      });
    }
    for (const dashboard of dashboardRecords ?? await loadDashboardRecords()) {
      const path = String(dashboard.url_path || "lovelace").replace(/^\//, "");
      {
        items.set(path, {
          id: path, name: dashboard.title || path, icon: dashboard.icon || "mdi:view-dashboard-outline",
          path: `/${path}`, native: true, dashboard: true, showInSidebar: dashboard.show_in_sidebar !== false
        });
      }
    }
    return [...items.values()];
  }

  async function loadAddons() {
    const output = new Map();

    // 1) Nejspolehlivější zdroj: skutečně povolené Ingress panely.
    try {
      const response = await hass.callWS({
        type: "supervisor/api",
        endpoint: "/ingress/panels",
        method: "get"
      });
      const panels = response?.panels || {};
      for (const [slug, panel] of Object.entries(panels)) {
        if (panel?.enable === false) continue;
        output.set(slug, {
          id: slug,
          name: panel?.title || slug,
          icon: panel?.icon || ""
        });
      }
    } catch (e) {
      console.info("[HA Nav Manager] /ingress/panels nebylo dostupné:", e);
    }

    // 2) Doplň všechny nainstalované aplikace, které podporují Ingress,
    // i když zrovna nejsou připnuté v bočním panelu.
    try {
      const response = await hass.callWS({
        type: "supervisor/api",
        endpoint: "/addons",
        method: "get"
      });
      const addons = response?.addons || [];
      for (const addon of addons) {
        const slug = addon?.slug;
        if (!slug || !addon?.version) continue;

        try {
          const info = await hass.callWS({
            type: "supervisor/api",
            endpoint: `/addons/${slug}/info`,
            method: "get"
          });

          if (info?.ingress) {
            output.set(slug, {
              id: slug,
              name: info?.name || addon?.name || slug,
              icon: info?.panel_icon || ""
            });
          }
        } catch (e) {
          console.info(`[HA Nav Manager] Nelze načíst info aplikace ${slug}:`, e);
        }
      }
    } catch (e) {
      console.warn("[HA Nav Manager] Seznam aplikací/add-onů:", e);
    }

    return [...output.values()].sort((a, b) => a.name.localeCompare(b.name, "cs"));
  }

  function settingsTargets() {
    return [
      { id: "/config/integrations", name: t("settings_devices_services") },
      { id: "/config/devices/dashboard", name: t("settings_devices") },
      { id: "/config/entities", name: t("settings_entities") },
      { id: "/config/automation/dashboard", name: t("settings_automations") },
      { id: "/config/helpers", name: t("settings_helpers") },
      { id: "/config/dashboard", name: t("settings_dashboards") },
      { id: "/hassio/dashboard", name: t("settings_apps") }
    ];
  }

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }


  function hexToRgb(hex) {
    const clean = String(hex || "").trim().replace("#", "");
    if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16)
    };
  }

  function rgbToHex(r, g, b) {
    return "#" + [r, g, b]
      .map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
      .join("");
  }

  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
      if (max === r) h = 60 * (((g - b) / d) % 6);
      else if (max === g) h = 60 * (((b - r) / d) + 2);
      else h = 60 * (((r - g) / d) + 4);
    }
    if (h < 0) h += 360;
    const s = max === 0 ? 0 : d / max;
    return { h, s, v: max };
  }

  function hsvToRgb(h, s, v) {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let rp = 0, gp = 0, bp = 0;
    if (h < 60) [rp, gp, bp] = [c, x, 0];
    else if (h < 120) [rp, gp, bp] = [x, c, 0];
    else if (h < 180) [rp, gp, bp] = [0, c, x];
    else if (h < 240) [rp, gp, bp] = [0, x, c];
    else if (h < 300) [rp, gp, bp] = [x, 0, c];
    else [rp, gp, bp] = [c, 0, x];
    return {
      r: (rp + m) * 255,
      g: (gp + m) * 255,
      b: (bp + m) * 255
    };
  }


  function cssColorToHex(value, fallback = "#ffffff") {
    if (!value) return fallback;
    const raw = String(value).trim();

    if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw;
    if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
      return "#" + raw.slice(1).split("").map(ch => ch + ch).join("");
    }

    const temp = document.createElement("span");
    temp.style.color = raw;
    temp.style.display = "none";
    document.body.appendChild(temp);

    let computed = getComputedStyle(temp).color;
    temp.remove();

    const m = computed.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
    if (!m) return fallback;

    return rgbToHex(Number(m[1]), Number(m[2]), Number(m[3]));
  }

  function themeColorHex(fallback = "#ffffff") {
    const rootStyle = getComputedStyle(document.documentElement);
    const candidates = [
      rootStyle.getPropertyValue("--primary-color"),
      rootStyle.getPropertyValue("--accent-color"),
      rootStyle.getPropertyValue("--app-header-text-color")
    ];
    for (const value of candidates) {
      const hex = cssColorToHex(value, "");
      if (hex) return hex;
    }
    return fallback;
  }

  function initialColorForItem(item, key) {
    const value = item?.[key];

    if (key === "color") {
      if (item?.colorMode === "theme" || !value) {
        return themeColorHex("#ffffff");
      }
      return cssColorToHex(value, "#ffffff");
    }

    if (key === "background") {
      if (item?.backgroundMode === "theme") {
        return themeColorHex("#808080");
      }
      if (!value) return "#303030";
      return cssColorToHex(value, "#303030");
    }

    return value ? cssColorToHex(value, "#ffffff") : "#ffffff";
  }


  const MOBILE_SWATCHES = [
    "#ffffff", "#d9d9d9", "#8f96a3", "#303030",
    "#000000", "#e53935", "#ff6f00", "#f9a825",
    "#fdd835", "#7cb342", "#43a047", "#00897b",
    "#00acc1", "#1e88e5", "#3949ab", "#5e35b1",
    "#8e24aa", "#d81b60", "#b51f43", "#e3ae0e",
    "#03a9f4", "#00bcd4", "#4caf50", "#9c27b0"
  ];


  function openMobileCustomPicker(wrap, item, key) {
    const root = wrap.getRootNode();
    if (!root) return;

    root.querySelector(".mobile-color-picker-overlay")?.remove();

    const startHex = initialColorForItem(item, key);
    const startRgb = hexToRgb(startHex) || { r:255, g:255, b:255 };
    let hsv = rgbToHsv(startRgb.r, startRgb.g, startRgb.b);

    const overlay = document.createElement("div");
    overlay.className = "mobile-color-picker-overlay";
    overlay.innerHTML = `
      <div class="mobile-color-picker" role="dialog" aria-modal="true">
        <h3>${esc(t("custom_picker_title"))}</h3>
        <div class="mobile-picker-main">
          <div class="mobile-picker-sv">
            <div class="mobile-picker-cursor"></div>
          </div>
          <div class="mobile-picker-hue-wrap">
            <div class="mobile-picker-hue-thumb"></div>
          </div>
        </div>
        <div class="mobile-picker-preview">
          <div class="mobile-picker-preview-box"></div>
          <input class="mobile-picker-hex" value="${esc(startHex)}">
        </div>
        <div class="mobile-picker-actions">
          <button type="button" data-act="cancel">${esc(t("cancel"))}</button>
          <button type="button" class="primary" data-act="apply">${esc(t("apply"))}</button>
        </div>
      </div>
    `;
    root.appendChild(overlay);

    const dialog = overlay.querySelector(".mobile-color-picker");
    const sv = overlay.querySelector(".mobile-picker-sv");
    const cursor = overlay.querySelector(".mobile-picker-cursor");
    const hueWrap = overlay.querySelector(".mobile-picker-hue-wrap");
    const hueThumb = overlay.querySelector(".mobile-picker-hue-thumb");
    const preview = overlay.querySelector(".mobile-picker-preview-box");
    const hexInput = overlay.querySelector(".mobile-picker-hex");

    const currentHex = () => {
      const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
      return rgbToHex(rgb.r, rgb.g, rgb.b);
    };

    const redraw = () => {
      sv.style.background = `hsl(${hsv.h} 100% 50%)`;
      cursor.style.left = `${hsv.s * 100}%`;
      cursor.style.top = `${(1 - hsv.v) * 100}%`;

      // Hue 0 is at bottom, 360 at top.
      hueThumb.style.top = `${(1 - (hsv.h / 360)) * 100}%`;

      const hex = currentHex();
      preview.style.background = hex;
      hexInput.value = hex;
    };

    const updateSV = (clientX, clientY) => {
      const rect = sv.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
      hsv.s = rect.width ? x / rect.width : 0;
      hsv.v = rect.height ? 1 - (y / rect.height) : 1;
      redraw();
    };

    const updateHue = (clientY) => {
      const rect = hueWrap.getBoundingClientRect();
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
      hsv.h = (1 - (rect.height ? y / rect.height : 0)) * 360;
      if (hsv.h >= 360) hsv.h = 0;
      redraw();
    };

    sv.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      sv.setPointerCapture?.(ev.pointerId);
      updateSV(ev.clientX, ev.clientY);
    });
    sv.addEventListener("pointermove", (ev) => {
      if (ev.buttons || ev.pointerType === "touch") updateSV(ev.clientX, ev.clientY);
    });

    hueWrap.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      hueWrap.setPointerCapture?.(ev.pointerId);
      updateHue(ev.clientY);
    });
    hueWrap.addEventListener("pointermove", (ev) => {
      if (ev.buttons || ev.pointerType === "touch") updateHue(ev.clientY);
    });

    hexInput.addEventListener("change", () => {
      const rgb = hexToRgb(hexInput.value);
      if (!rgb) {
        hexInput.value = currentHex();
        return;
      }
      hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      redraw();
    });

    overlay.addEventListener("click", (ev) => {
      if (ev.target === overlay) overlay.remove();
    });
    dialog.addEventListener("click", (ev) => ev.stopPropagation());

    overlay.querySelector('[data-act="cancel"]').addEventListener("click", () => overlay.remove());
    overlay.querySelector('[data-act="apply"]').addEventListener("click", () => {
      const hex = currentHex();
      item[key] = hex;

      if (key === "color") item.colorMode = "custom";
      if (key === "background") item.backgroundMode = "custom";

      const textInput = wrap.querySelector(`[data-field="${key}"]`) || wrap.querySelector(`[data-sidebar-field="${key}"]`);
      const nativeInput = wrap.querySelector(`[data-color-picker="${key}"]`) || wrap.querySelector(`[data-sidebar-color="${key}"]`);
      if (textInput) { textInput.value = hex; if (textInput.dataset.sidebarField) textInput.dispatchEvent(new Event("input", { bubbles: true })); }
      if (nativeInput) nativeInput.value = hex;

      const host = wrap.querySelector(`[data-swatches-for="${key}"]`);
      host?.querySelectorAll(".mobile-swatch").forEach(el => el.classList.remove("selected"));

      const palette = wrap.querySelector(`[data-palette-for="${key}"]`);
      const desktopSV = palette?.querySelector(`[data-sv-for="${key}"]`);
      const desktopCursor = desktopSV?.querySelector(".sv-cursor");
      const desktopHue = palette?.querySelector(`[data-hue-for="${key}"]`);
      if (desktopSV && desktopCursor && desktopHue) {
        desktopSV.style.background = `hsl(${hsv.h} 100% 50%)`;
        desktopCursor.style.left = `${hsv.s * 100}%`;
        desktopCursor.style.top = `${(1 - hsv.v) * 100}%`;
        desktopHue.value = String(Math.round(hsv.h));
      }

      overlay.remove();
    });

    redraw();
  }

  function setupMobileSwatches(wrap, item, key) {
    const host = wrap.querySelector(`[data-swatches-for="${key}"]`);
    if (!host) return;

    host.innerHTML = "";
    const current = cssColorToHex(item?.[key], "").toLowerCase();

    for (const hex of MOBILE_SWATCHES) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mobile-swatch" + (current === hex ? " selected" : "");
      btn.style.background = hex;
      btn.title = hex;
      btn.setAttribute("aria-label", hex);

      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        item[key] = hex;
        if (key === "color") item.colorMode = "custom";
        if (key === "background") item.backgroundMode = "custom";

        const textInput = wrap.querySelector(`[data-field="${key}"]`);
        const colorInput = wrap.querySelector(`[data-color-picker="${key}"]`);

        if (textInput) textInput.value = hex;
        if (colorInput) colorInput.value = hex;

        host.querySelectorAll(".mobile-swatch").forEach(el => el.classList.remove("selected"));
        btn.classList.add("selected");

        // Synchronizuj i desktopovou paletu, pokud je ve stejném DOM.
        const sv = wrap.querySelector(`[data-sv-for="${key}"]`);
        const hue = wrap.querySelector(`[data-hue-for="${key}"]`);
        if (sv && hue) {
          const rgb = hexToRgb(hex);
          const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
          sv.style.background = `hsl(${hsv.h} 100% 50%)`;
          const cursor = sv.querySelector(".sv-cursor");
          if (cursor) {
            cursor.style.left = `${hsv.s * 100}%`;
            cursor.style.top = `${(1 - hsv.v) * 100}%`;
          }
          hue.value = String(Math.round(hsv.h));
        }
      });

      host.appendChild(btn);
    }

    const more = document.createElement("button");
    more.type = "button";
    more.className = "mobile-more-colors";
    more.textContent = t("more_colors");
    more.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      openMobileCustomPicker(wrap, item, key);
    });
    host.appendChild(more);
  }

  function setupPalette(wrap, item, key) {
    const palette = wrap.querySelector(`[data-palette-for="${key}"]`);
    if (!palette) return;

    const sv = palette.querySelector(`[data-sv-for="${key}"]`);
    const cursor = sv?.querySelector(".sv-cursor");
    const hue = palette.querySelector(`[data-hue-for="${key}"]`);
    const colorInput = palette.querySelector(`[data-color-picker="${key}"]`);
    const textInput = palette.querySelector(`[data-field="${key}"]`);

    let hex = initialColorForItem(item, key);
    let rgb = hexToRgb(hex);
    let hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

    // Na mobilu se používá hlavně nativní systémový picker.
    // Proto mu vždy před otevřením nastav reálnou aktuální barvu místo černé/defaultní.
    if (colorInput) colorInput.value = hex;

    const applyVisuals = (userChange = false) => {
      sv.style.background = `hsl(${hsv.h} 100% 50%)`;
      cursor.style.left = `${hsv.s * 100}%`;
      cursor.style.top = `${(1 - hsv.v) * 100}%`;
      hue.value = String(Math.round(hsv.h));
      const out = hsvToRgb(hsv.h, hsv.s, hsv.v);
      hex = rgbToHex(out.r, out.g, out.b);
      colorInput.value = hex;
      textInput.value = hex;

      // Initial render only synchronizes controls.
      // Switch to custom mode only after an actual user color change.
      if (userChange) {
        item[key] = hex;
        if (key === "color") item.colorMode = "custom";
        if (key === "background") item.backgroundMode = "custom";
      }
    };

    const updateSV = (ev) => {
      const rect = sv.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, ev.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, ev.clientY - rect.top));
      hsv.s = rect.width ? x / rect.width : 0;
      hsv.v = rect.height ? 1 - (y / rect.height) : 1;
      applyVisuals(true);
    };

    sv.addEventListener("pointerdown", (ev) => {
      sv.setPointerCapture?.(ev.pointerId);
      updateSV(ev);
    });
    sv.addEventListener("pointermove", (ev) => {
      if (ev.buttons) updateSV(ev);
    });

    hue.addEventListener("input", () => {
      hsv.h = Number(hue.value);
      applyVisuals();
    });

    const refreshNativePicker = () => {
      const startHex = initialColorForItem(item, key);
      const rgbStart = hexToRgb(startHex);
      if (rgbStart) {
        hsv = rgbToHsv(rgbStart.r, rgbStart.g, rgbStart.b);
        colorInput.value = startHex;
      }
    };

    if (!isMobileViewport()) {
      colorInput.addEventListener("pointerdown", refreshNativePicker, true);
      colorInput.addEventListener("focus", refreshNativePicker, true);
    }

    colorInput.addEventListener("input", () => {
      const rgb2 = hexToRgb(colorInput.value);
      if (!rgb2) return;
      hsv = rgbToHsv(rgb2.r, rgb2.g, rgb2.b);
      applyVisuals(true);
    });

    textInput.addEventListener("change", () => {
      const rgb2 = hexToRgb(textInput.value);
      if (!rgb2) return;
      hsv = rgbToHsv(rgb2.r, rgb2.g, rgb2.b);
      applyVisuals(true);
    });

    applyVisuals(false);
  }

  // Same HA selector contract as the toolbar; no private import URLs or icon list.
  function installIconPicker(input, onChange, defaultIcon = "", resetValue = "") {
    const host = document.createElement("div");
    host.className = "icon-selector-host";
    input.after(host);
    const preview = document.createElement("ha-icon");
    const reset = document.createElement("button");
    reset.type = "button";
    reset.dataset.resetIcon = "";
    reset.textContent = t("reset_icon");
    reset.disabled = input.disabled;
    const notice = document.createElement("small");
    notice.textContent = t("icon_picker_unavailable");
    let selector;
    const sync = () => {
      preview.setAttribute("icon", input.value || defaultIcon);
      if (selector) selector.value = input.value;
      onChange(input.value);
    };
    input.addEventListener("change", sync);
    reset.addEventListener("click", () => { input.value = resetValue; sync(); });
    host.append(preview, notice, reset);
    preview.setAttribute("icon", input.value || defaultIcon);
    const install = () => {
      if (!host.isConnected || selector) return;
      const tag = customElements.get("ha-selector") ? "ha-selector" : "ha-icon-picker";
      selector = document.createElement(tag);
      selector.hass = hass;
      selector.selector = { icon: { placeholder: defaultIcon } };
      selector.placeholder = defaultIcon;
      selector.value = input.value;
      selector.label = t("icon");
      selector.required = false;
      selector.disabled = input.disabled;
      selector.addEventListener("value-changed", event => {
        event.stopPropagation();
        if (input.disabled) return;
        input.value = event.detail?.value || "";
        sync();
      });
      input.hidden = true;
      notice.remove();
      host.insertBefore(selector, reset);
    };
    if (customElements.get("ha-selector") || customElements.get("ha-icon-picker")) install();
    else {
      customElements.whenDefined("ha-selector").then(install);
      customElements.whenDefined("ha-icon-picker").then(install);
    }
    return () => { input.value = resetValue; sync(); };
  }

  function editorCss() {
    return `
      :host { all: initial; }
      * { box-sizing: border-box; }
      .overlay {
        position: fixed; inset: 0; z-index: 2147483646;
        background: rgba(0,0,0,.48);
        display: flex; align-items: center; justify-content: center;
        padding: 12px;
        font-family: Roboto, Arial, sans-serif;
        color: var(--primary-text-color, #fff);
      }
      .dialog {
        width: min(780px, 100%);
        max-height: 92vh;
        overflow: auto;
        background: var(--card-background-color, #202124);
        border: 1px solid var(--divider-color, rgba(255,255,255,.15));
        border-radius: 18px;
        box-shadow: 0 18px 50px rgba(0,0,0,.45);
      }
      .header {
        position: sticky; top: 0; z-index: 2;
        display:flex; align-items:center; gap:10px;
        padding: 14px 16px;
        background: var(--card-background-color, #202124);
        border-bottom: 1px solid var(--divider-color, rgba(255,255,255,.12));
      }
      .header h2 { margin:0; flex:1; font-size:20px; font-weight:500; }
      button {
        border: 0; border-radius: 10px; cursor: pointer;
        background: var(--secondary-background-color, #34383d);
        color: var(--primary-text-color, #fff);
        padding: 9px 12px;
      }
      button.primary {
        background: var(--primary-color, #03a9f4);
        color: var(--text-primary-color, #fff);
      }
      button.danger { color: #ff8a80; }
      .body { padding: 14px 16px 18px; }
      .tabs {
        position: sticky; top: 69px; z-index: 2; display:flex; gap:6px;
        padding:10px 16px; background:var(--card-background-color,#202124);
        border-bottom:1px solid var(--divider-color,rgba(255,255,255,.12));
      }
      .tab-button[aria-selected="true"] { background:var(--primary-color,#03a9f4); color:var(--text-primary-color,#fff); }
      .tab-panel { display:none; }
      .tab-panel.active { display:block; }
      .section-title { margin:18px 0 10px; font-size:16px; }
      .section-actions { display:flex; flex-wrap:wrap; gap:8px; margin:10px 0; }
      .search { margin-bottom:10px; }
      .dashboard-form { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
      .icon-selector-host, ha-selector, ha-icon-picker { display:block; min-width:0; max-width:100%; }
      input[hidden] { display:none !important; }
      .dashboard-card { padding:12px; border:1px solid var(--divider-color,rgba(255,255,255,.14)); border-radius:14px; }
      .dashboard-card + .dashboard-card { margin-top:10px; }
      .dashboard-card .actions { margin-top:10px; justify-content:flex-end; }
      .sidebar-section { min-width:0; margin:12px 0; padding:14px; border:1px solid var(--divider-color,#888); border-radius:12px; }
      .sidebar-section legend { font-weight:600; padding:0 6px; }
      .sidebar-color-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; }
      .sidebar-color-grid input[type="color"] { height:40px; padding:2px; }
      .compact-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px; }
      .hint {
        color: var(--secondary-text-color, #aaa);
        font-size: 13px; line-height:1.4; margin-bottom:14px;
      }
      .global-settings {
        display:grid;
        grid-template-columns: 1fr;
        gap:10px;
        margin: 0 0 14px;
        padding:12px;
        border:1px solid var(--divider-color, rgba(255,255,255,.14));
        border-radius:14px;
        background: rgba(255,255,255,.025);
      }
      .check-row {
        display:flex;
        flex-direction:row;
        align-items:center;
        gap:10px;
        color:var(--primary-text-color,#fff);
      }
      .check-row input { width:auto; min-height:0; }
      .metric-columns {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:12px;
      }
      .metric-columns > div {
        display:flex;
        flex-direction:column;
        gap:8px;
        padding:10px;
        border:1px solid var(--divider-color,rgba(255,255,255,.12));
        border-radius:10px;
      }
      .metric-columns b {
        font-size:13px;
      }
      .appearance-actions {
        display:flex;
        justify-content:flex-end;
      }

      .combo {
        position: relative;
      }
      .combo-trigger {
        width:100%;
        min-height:40px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        text-align:left;
        border-radius:9px;
        border:1px solid var(--divider-color,rgba(255,255,255,.18));
        background:var(--secondary-background-color,#303238);
        color:var(--primary-text-color,#fff);
        padding:8px 10px;
      }
      .combo-panel {
        display:none;
        position:absolute;
        left:0;
        right:0;
        z-index:50;
        margin-top:4px;
        padding:8px;
        border-radius:10px;
        border:1px solid var(--divider-color,rgba(255,255,255,.20));
        background:var(--card-background-color,#202124);
        box-shadow:0 12px 30px rgba(0,0,0,.35);
      }
      .combo.open .combo-panel { display:block; }
      .combo-panel input[type="search"] {
        margin-bottom:7px;
      }
      .combo-options {
        max-height:260px;
        overflow:auto;
        display:flex;
        flex-direction:column;
        gap:2px;
      }
      .combo-option {
        width:100%;
        text-align:left;
        border-radius:7px;
        padding:8px 9px;
        background:transparent;
      }
      .combo-option:hover,
      .combo-option.selected {
        background:rgba(255,255,255,.09);
      }
      .combo-empty {
        padding:10px;
        color:var(--secondary-text-color,#aaa);
        font-size:13px;
      }


      .palette {
        display:grid;
        grid-template-columns: 1fr 28px;
        grid-template-areas:
          "sv hue"
          "row row";
        gap:8px;
        align-items:stretch;
      }
      .sv-box {
        grid-area:sv;
        position:relative;
        height:120px;
        border-radius:10px;
        overflow:hidden;
        cursor:crosshair;
        background:hsl(0 100% 50%);
      }
      .sv-white,
      .sv-black {
        position:absolute;
        inset:0;
        pointer-events:none;
      }
      .sv-white {
        background:linear-gradient(to right,#fff,rgba(255,255,255,0));
      }
      .sv-black {
        background:linear-gradient(to top,#000,rgba(0,0,0,0));
      }
      .sv-cursor {
        position:absolute;
        width:14px;
        height:14px;
        border:2px solid #fff;
        border-radius:50%;
        box-shadow:0 0 0 1px rgba(0,0,0,.8);
        transform:translate(-7px,-7px);
        pointer-events:none;
        left:100%;
        top:0%;
      }
      .hue-slider {
        grid-area:hue;
        appearance:none;
        -webkit-appearance:none;
        writing-mode:bt-lr;
        width:28px;
        min-height:120px;
        padding:0;
        border:0;
        border-radius:10px;
        background:linear-gradient(to top,
          hsl(0 100% 50%),
          hsl(60 100% 50%),
          hsl(120 100% 50%),
          hsl(180 100% 50%),
          hsl(240 100% 50%),
          hsl(300 100% 50%),
          hsl(360 100% 50%)
        );
      }
      .hue-slider::-webkit-slider-runnable-track {
        background:transparent;
      }
      .hue-slider::-webkit-slider-thumb {
        -webkit-appearance:none;
        width:30px;
        height:5px;
        border-radius:3px;
        background:#fff;
        box-shadow:0 0 0 1px rgba(0,0,0,.7);
      }
      .hue-slider::-moz-range-track { background:transparent; }
      .hue-slider::-moz-range-thumb {
        width:30px;
        height:5px;
        border:0;
        border-radius:3px;
        background:#fff;
        box-shadow:0 0 0 1px rgba(0,0,0,.7);
      }
      .palette .color-row {
        grid-area:row;
      }
      .mobile-swatches {
        display:none;
      }


      .mobile-color-picker-overlay {
        position:fixed;
        inset:0;
        z-index:2147483647;
        background:rgba(0,0,0,.56);
        display:flex;
        align-items:center;
        justify-content:center;
        padding:14px;
      }
      .mobile-color-picker {
        width:min(420px, 100%);
        background:var(--card-background-color,#303030);
        color:var(--primary-text-color,#fff);
        border-radius:16px;
        border:1px solid var(--divider-color,rgba(255,255,255,.16));
        box-shadow:0 18px 50px rgba(0,0,0,.5);
        padding:16px;
      }
      .mobile-color-picker h3 {
        margin:0 0 14px;
        font-size:20px;
        font-weight:500;
      }
      .mobile-picker-main {
        display:grid;
        grid-template-columns:1fr 34px;
        gap:10px;
        align-items:stretch;
      }
      .mobile-picker-sv {
        position:relative;
        height:230px;
        border-radius:12px;
        overflow:hidden;
        cursor:crosshair;
        touch-action:none;
        background:hsl(0 100% 50%);
      }
      .mobile-picker-sv::before,
      .mobile-picker-sv::after {
        content:"";
        position:absolute;
        inset:0;
        pointer-events:none;
      }
      .mobile-picker-sv::before {
        background:linear-gradient(to right,#fff,rgba(255,255,255,0));
      }
      .mobile-picker-sv::after {
        background:linear-gradient(to top,#000,rgba(0,0,0,0));
      }
      .mobile-picker-cursor {
        position:absolute;
        width:18px;
        height:18px;
        border:2px solid #fff;
        border-radius:50%;
        box-shadow:0 0 0 1px rgba(0,0,0,.85);
        transform:translate(-9px,-9px);
        z-index:2;
        pointer-events:none;
      }
      .mobile-picker-hue-wrap {
        position:relative;
        height:230px;
        border-radius:12px;
        background:linear-gradient(to top,
          hsl(0 100% 50%),
          hsl(60 100% 50%),
          hsl(120 100% 50%),
          hsl(180 100% 50%),
          hsl(240 100% 50%),
          hsl(300 100% 50%),
          hsl(360 100% 50%)
        );
        overflow:visible;
        touch-action:none;
      }
      .mobile-picker-hue-thumb {
        position:absolute;
        left:-3px;
        right:-3px;
        height:6px;
        border-radius:4px;
        background:#fff;
        box-shadow:0 0 0 1px rgba(0,0,0,.8);
        transform:translateY(-3px);
        pointer-events:none;
      }
      .mobile-picker-preview {
        display:flex;
        align-items:center;
        gap:10px;
        margin-top:12px;
      }
      .mobile-picker-preview-box {
        width:50px;
        height:38px;
        border-radius:9px;
        border:1px solid rgba(255,255,255,.35);
        flex:0 0 auto;
      }
      .mobile-picker-hex {
        flex:1;
        min-height:40px;
      }
      .mobile-picker-actions {
        display:flex;
        justify-content:flex-end;
        gap:8px;
        margin-top:14px;
      }
      .mobile-more-colors {
        width:100%;
        margin-top:8px;
      }


      .correction-row {
        display:grid;
        grid-template-columns:1fr 54px;
        gap:8px;
        align-items:center;
      }
      .correction-row input[type="range"] {
        min-height:0;
        padding:0;
      }
      .correction-row output {
        text-align:right;
        font-size:13px;
        color:var(--primary-text-color,#fff);
      }

      .opacity-row {
        display:grid;
        grid-template-columns:1fr 54px;
        gap:8px;
        align-items:center;
      }
      .opacity-row input[type="range"] {
        min-height:0;
        padding:0;
      }
      .opacity-row output {
        text-align:right;
        font-size:13px;
        color:var(--primary-text-color,#fff);
      }
      .color-row {
        display:grid;
        grid-template-columns: 48px 1fr;
        gap:8px;
        align-items:center;
      }
      .color-row input[type="color"] {
        width:48px;
        height:40px;
        padding:2px;
        cursor:pointer;
      }
      .icon-selector-host {
        min-height:40px;
      }
      .list { display:flex; flex-direction:column; gap:10px; }
      .item {
        border:1px solid var(--divider-color, rgba(255,255,255,.14));
        border-radius:14px;
        overflow:hidden;
        background: rgba(255,255,255,.025);
      }
      .item-head {
        display:flex; align-items:center; gap:10px;
        padding:10px 12px;
      }
      .item-title { flex:1; min-width:0; }
      .item-title b { display:block; font-size:14px; }
      .item-title small { color:var(--secondary-text-color,#aaa); }
      .preview-icon { width:32px; display:flex; justify-content:center; }
      .details {
        display:none;
        border-top:1px solid var(--divider-color,rgba(255,255,255,.12));
        padding:12px;
      }
      .item.open .details { display:block; }
      .grid {
        display:grid;
        grid-template-columns: repeat(2, minmax(0,1fr));
        gap:12px;
      }
      .full { grid-column: 1 / -1; }
      label {
        display:flex; flex-direction:column; gap:5px;
        font-size:12px; color:var(--secondary-text-color,#aaa);
      }
      input, select {
        width:100%; min-height:40px;
        padding:8px 10px;
        border-radius:9px;
        border:1px solid var(--divider-color,rgba(255,255,255,.18));
        background:var(--secondary-background-color,#303238);
        color:var(--primary-text-color,#fff);
        font:inherit;
      }
      .actions { display:flex; gap:6px; align-items:center; }
      .footer { margin-top:14px; display:flex; justify-content:space-between; gap:10px; }
      .status { font-size:12px; color:var(--secondary-text-color,#aaa); margin-top:10px; }
      @media (max-width:600px) {
        .grid { grid-template-columns:1fr; }
        .metric-columns { grid-template-columns:1fr; }

        /* Na mobilu použij systémový výběr barvy.
           Velká desktopová paleta je zbytečně vysoká a špatně se ovládá prstem. */
        .palette {
          display:block;
        }
        .palette .sv-box,
        .palette .hue-slider {
          display:none;
        }
        .palette .color-row {
          display:grid;
          grid-template-columns:1fr;
          gap:10px;
          align-items:center;
        }
        .palette .color-row input[type="color"] {
          display:none;
        }
        .mobile-swatches {
          display:grid;
          grid-template-columns:repeat(8, minmax(28px, 1fr));
          gap:7px;
          margin-top:8px;
        }
        .mobile-swatch {
          aspect-ratio:1;
          min-width:28px;
          border-radius:9px;
          border:2px solid rgba(255,255,255,.28);
          padding:0;
          box-shadow:0 1px 3px rgba(0,0,0,.28);
        }
        .mobile-swatch.selected {
          border-color:#fff;
          box-shadow:0 0 0 2px rgba(0,0,0,.55), 0 1px 3px rgba(0,0,0,.28);
        }
        .mobile-more-colors {
          grid-column:1 / -1;
          min-height:42px;
        }
        .full { grid-column:auto; }
        .dialog { max-height:96vh; border-radius:14px; }
        .header h2 { font-size:18px; }
        .tabs { top:65px; overflow-x:auto; }
        .dashboard-form, .sidebar-color-grid, .compact-grid { grid-template-columns:1fr; }
      }
    `;
  }

  async function openEditor() {
    hass = getHass() || hass || await waitForHass();

    document.getElementById(HOST_ID)?.remove();

    const host = document.createElement("div");
    host.id = HOST_ID;
    document.body.appendChild(host);
    const root = host.attachShadow({ mode: "open" });

    root.innerHTML = `
      <style>${editorCss()}</style>
      <div class="overlay">
        <div class="dialog">
          <div class="header">
            <h2>${esc(t("title"))}</h2>
            <button id="close">${esc(t("close"))}</button>
            <button id="save" class="primary">${esc(t("save"))}</button>
          </div>
          <nav class="tabs" role="tablist">
            <button class="tab-button" data-tab="toolbar" aria-selected="true">${esc(t("tab_toolbar"))}</button>
            <button class="tab-button" data-tab="sidebar" aria-selected="false">${esc(t("tab_sidebar"))}</button>
            <button class="tab-button" data-tab="dashboards" aria-selected="false">${esc(t("tab_dashboards"))}</button>
          </nav>
          <div class="body">
            <section id="panel-toolbar" class="tab-panel active">
            <div class="hint">
${esc(t("intro"))}
            </div>

            <div class="global-settings">
              <label>${esc(t("placement"))}
                <select id="placement">
                  <option value="after_title">${esc(t("place_after_title"))}</option>
                  <option value="replace_title">${esc(t("place_replace_title"))}</option>
                  <option value="before_actions">${esc(t("place_before_actions"))}</option>
                  <option value="inside_actions">${esc(t("place_inside_actions"))}</option>
                </select>
              </label>
              <label class="check-row">
                <input id="hide-title" type="checkbox">
                <span>${esc(t("hide_title"))}</span>
              </label>
            </div>

            <div class="global-settings">
              <strong>${esc(t("appearance"))}</strong>
              <div class="metric-columns">
                <div>
                  <b>${esc(t("desktop"))}</b>
                  <label>${esc(t("icon_size"))}
                    <input id="icon-size-desktop" type="number" min="12" max="40" step="0.5">
                  </label>
                  <label>${esc(t("button_gap"))}
                    <input id="button-gap-desktop" type="number" min="0" max="24" step="0.5">
                  </label>
                  <label>${esc(t("button_height"))}
                    <input id="button-height-desktop" type="number" min="24" max="64" step="0.5">
                  </label>
                  <label>${esc(t("horizontal_padding"))}
                    <input id="button-padding-desktop" type="number" min="0" max="24" step="0.5">
                  </label>
                </div>
                <div>
                  <b>${esc(t("mobile"))}</b>
                  <label>${esc(t("icon_size"))}
                    <input id="icon-size-mobile" type="number" min="12" max="40" step="0.5">
                  </label>
                  <label>${esc(t("button_gap"))}
                    <input id="button-gap-mobile" type="number" min="0" max="24" step="0.5">
                  </label>
                  <label>${esc(t("button_height"))}
                    <input id="button-height-mobile" type="number" min="24" max="64" step="0.5">
                  </label>
                  <label>${esc(t("horizontal_padding"))}
                    <input id="button-padding-mobile" type="number" min="0" max="24" step="0.5">
                  </label>
                </div>
              </div>
              <label class="check-row">
                <input id="kiosk-fallback" type="checkbox">
                <span>
                  ${esc(t("kiosk_fallback"))}<br>
                  <small>${esc(t("kiosk_fallback_hint"))}</small>
                </span>
              </label>
              <small>${esc(t("spacing_step_hint"))}</small>
              <div class="appearance-actions">
                <button id="reset-appearance" type="button">${esc(t("reset_appearance"))}</button>
              </div>
            </div>

            <div id="list" class="list"></div>
            <div class="footer">
              <button id="add">${esc(t("add_button"))}</button>
              <button id="reset" class="danger">${esc(t("delete_all"))}</button>
            </div>
            </section>

            <section id="panel-sidebar" class="tab-panel">
              <div class="hint">${esc(t("sidebar_intro"))}</div>
              <div class="global-settings">
                <label class="check-row"><input id="sidebar-enabled" type="checkbox"><span>${esc(t("sidebar_enabled"))}</span></label>
                <strong>${esc(t("global_appearance"))}</strong>
                <div id="sidebar-global"></div>
                <div class="section-actions">
                  <button id="reset-sidebar-global" type="button">${esc(t("reset_sidebar_global"))}</button>
                  <button id="remove-sidebar-overrides" type="button">${esc(t("remove_overrides"))}</button>
                  <button id="restore-native-sidebar" type="button">${esc(t("restore_native"))}</button>
                </div>
              </div>
              <h3 class="section-title">${esc(t("native_items"))}</h3>
              <input id="sidebar-search" class="search" type="search" placeholder="${esc(t("filter_items"))}">
              <div id="sidebar-native-list" class="list"></div>
              <h3 class="section-title">${esc(t("custom_items"))}</h3>
              <div id="sidebar-custom-list" class="list"></div>
              <div class="section-actions"><button id="add-sidebar-item">${esc(t("add_sidebar_item"))}</button></div>
            </section>

            <section id="panel-dashboards" class="tab-panel">
              <div class="hint">${esc(t("dashboard_manager_intro"))}</div>
              <h3 class="section-title">${esc(t("create_dashboard"))}</h3>
              <div class="global-settings dashboard-form">
                <label>${esc(t("dashboard_title"))}<input id="new-dashboard-title"></label>
                <label>${esc(t("dashboard_path"))}<input id="new-dashboard-path" value="dashboard-" placeholder="dashboard-obyvak"><small>${esc(t("path_hint"))}</small></label>
                <label>${esc(t("icon"))}<input id="new-dashboard-icon" placeholder="mdi:view-dashboard"></label>
                <label class="check-row"><input id="new-dashboard-sidebar" type="checkbox" checked><span>${esc(t("show_sidebar"))}</span></label>
                <label class="check-row"><input id="new-dashboard-admin" type="checkbox"><span>${esc(t("admin_only"))}</span></label>
                <div><button id="create-dashboard" class="primary">${esc(t("create"))}</button></div>
              </div>
              <h3 class="section-title">${esc(t("existing_dashboards"))}</h3>
              <button id="refresh-dashboards">${esc(t("update"))}</button>
              <div class="hint">${esc(t("ordering_hint"))}</div>
              <div id="dashboard-status" class="status" role="status" aria-live="polite"></div>
              <div id="dashboard-list"></div>
            </section>
            <div id="status" class="status"></div>
          </div>
        </div>
      </div>
    `;

    const lang = currentLang();
    const rtl = RTL_LANGS.has(lang);
    const dialog = root.querySelector(".dialog");
    if (dialog) dialog.dir = rtl ? "rtl" : "ltr";

    const state = JSON.parse(JSON.stringify(config.buttons || []));
    let placementState = config.placement || "after_title";
    let hideTitleState = !!config.hideTitle;
    let iconSizeDesktopState = Number(config.iconSizeDesktop ?? 22);
    let iconSizeMobileState = Number(config.iconSizeMobile ?? 20);
    let buttonGapDesktopState = Number(config.buttonGapDesktop ?? 4);
    let buttonGapMobileState = Number(config.buttonGapMobile ?? 2);
    let buttonHeightDesktopState = Number(config.buttonHeightDesktop ?? 40);
    let buttonHeightMobileState = Number(config.buttonHeightMobile ?? 38);
    let buttonPaddingDesktopState = Number(config.buttonPaddingDesktop ?? 8);
    let buttonPaddingMobileState = Number(config.buttonPaddingMobile ?? 5);
    let kioskFallbackState = !!config.kioskFallback;
    const sidebarState = JSON.parse(JSON.stringify(normalizeSidebarConfig(config.sidebar)));
    let nativeSidebarItems = [];
    let dashboardRecords = [];
    const nativeFallbackOrder = availableNativeOrder([]);
    const savedNativeOrder = await loadNativeSidebarOrder();
    let nativeOrder = savedNativeOrder.length ? savedNativeOrder : nativeFallbackOrder;
    if (sidebarRuntime) { sidebarRuntime.nativeOrder = nativeOrder; sidebarRuntime.schedule(); }
    let dashboardSourceOrder = [];
    const removedDashboardPaths = new Set();
    const resetNewDashboardIcon = installIconPicker(root.getElementById("new-dashboard-icon"), () => {}, "mdi:view-dashboard");

    const listEl = root.getElementById("list");
    const status = root.getElementById("status");
    const placementEl = root.getElementById("placement");
    const hideTitleEl = root.getElementById("hide-title");
    const iconSizeDesktopEl = root.getElementById("icon-size-desktop");
    const iconSizeMobileEl = root.getElementById("icon-size-mobile");
    const buttonGapDesktopEl = root.getElementById("button-gap-desktop");
    const buttonGapMobileEl = root.getElementById("button-gap-mobile");
    const buttonHeightDesktopEl = root.getElementById("button-height-desktop");
    const buttonHeightMobileEl = root.getElementById("button-height-mobile");
    const buttonPaddingDesktopEl = root.getElementById("button-padding-desktop");
    const buttonPaddingMobileEl = root.getElementById("button-padding-mobile");
    const kioskFallbackEl = root.getElementById("kiosk-fallback");
    const resetAppearanceEl = root.getElementById("reset-appearance");

    root.querySelectorAll(".tab-button").forEach(button => button.addEventListener("click", () => {
      root.querySelectorAll(".tab-button").forEach(other => other.setAttribute("aria-selected", String(other === button)));
      root.querySelectorAll(".tab-panel").forEach(panel => panel.classList.toggle("active", panel.id === `panel-${button.dataset.tab}`));
      if (button.dataset.tab === "dashboards") {
        const list = root.getElementById("dashboard-list");
        // Reorder existing forms so unsaved field edits are preserved across tabs.
        orderedItems([...list.querySelectorAll(".dashboard-card")], managerSidebarOrder(sidebarState, nativeOrder), [...nativeOrder, ...dashboardSourceOrder], card => card.dataset.path).forEach(card => list.append(card));
      }
    }));

    placementEl.value = placementState;
    hideTitleEl.checked = hideTitleState;
    iconSizeDesktopEl.value = iconSizeDesktopState;
    iconSizeMobileEl.value = iconSizeMobileState;
    buttonGapDesktopEl.value = buttonGapDesktopState;
    buttonGapMobileEl.value = buttonGapMobileState;
    buttonHeightDesktopEl.value = buttonHeightDesktopState;
    buttonHeightMobileEl.value = buttonHeightMobileState;
    buttonPaddingDesktopEl.value = buttonPaddingDesktopState;
    buttonPaddingMobileEl.value = buttonPaddingMobileState;
    kioskFallbackEl.checked = kioskFallbackState;
    placementEl.addEventListener("change", () => {
      placementState = placementEl.value;
    });
    hideTitleEl.addEventListener("change", () => {
      hideTitleState = hideTitleEl.checked;
    });
    iconSizeDesktopEl.addEventListener("input", () => iconSizeDesktopState = Number(iconSizeDesktopEl.value));
    iconSizeMobileEl.addEventListener("input", () => iconSizeMobileState = Number(iconSizeMobileEl.value));
    buttonGapDesktopEl.addEventListener("input", () => buttonGapDesktopState = Number(buttonGapDesktopEl.value));
    buttonGapMobileEl.addEventListener("input", () => buttonGapMobileState = Number(buttonGapMobileEl.value));
    buttonHeightDesktopEl.addEventListener("input", () => buttonHeightDesktopState = Number(buttonHeightDesktopEl.value));
    buttonHeightMobileEl.addEventListener("input", () => buttonHeightMobileState = Number(buttonHeightMobileEl.value));
    buttonPaddingDesktopEl.addEventListener("input", () => buttonPaddingDesktopState = Number(buttonPaddingDesktopEl.value));
    buttonPaddingMobileEl.addEventListener("input", () => buttonPaddingMobileState = Number(buttonPaddingMobileEl.value));
    kioskFallbackEl.addEventListener("change", () => kioskFallbackState = kioskFallbackEl.checked);

    resetAppearanceEl.addEventListener("click", () => {
      iconSizeDesktopState = 22;
      iconSizeMobileState = 20;
      buttonGapDesktopState = 4;
      buttonGapMobileState = 2;
      buttonHeightDesktopState = 40;
      buttonHeightMobileState = 38;
      buttonPaddingDesktopState = 8;
      buttonPaddingMobileState = 5;

      iconSizeDesktopEl.value = iconSizeDesktopState;
      iconSizeMobileEl.value = iconSizeMobileState;
      buttonGapDesktopEl.value = buttonGapDesktopState;
      buttonGapMobileEl.value = buttonGapMobileState;
      buttonHeightDesktopEl.value = buttonHeightDesktopState;
      buttonHeightMobileEl.value = buttonHeightMobileState;
      buttonPaddingDesktopEl.value = buttonPaddingDesktopState;
      buttonPaddingMobileEl.value = buttonPaddingMobileState;

      status.textContent = t("reset_appearance_done");
    });


    let entities = null;
    let devices = null;
    let dashboards = null;
    let addons = null;

    async function optionsFor(item) {
      if (item.targetType === "entity") {
        entities ??= await loadEntities();
        return entities;
      }
      if (item.targetType === "device") {
        devices ??= await loadDevices();
        return devices;
      }
      if (item.targetType === "addon") {
        addons ??= await loadAddons();
        return addons;
      }
      if (item.targetType === "dashboard") {
        dashboards ??= await loadDashboards();
        return dashboards;
      }
      if (item.targetType === "settings") return settingsTargets();
      return [];
    }

    function sidebarColorField(key, label, value = "", global = false) {
      const hex = cssColorToHex(value, "#808080");
      return `<label>${esc(label)}
        <select data-sidebar-color-mode="${esc(key)}">
          <option value="" ${!value ? "selected" : ""}>${esc(t(global ? "theme_default" : "inherit"))}</option>
          ${global ? "" : `<option value="theme" ${["theme", "default"].includes(value) ? "selected" : ""}>${esc(t("theme_default"))}</option>`}
          <option value="custom" ${value && !["theme", "default"].includes(value) ? "selected" : ""}>${esc(t("custom_color"))}</option>
        </select>
        <div class="color-row">
          <input type="color" data-sidebar-color="${esc(key)}" value="${esc(hex)}">
          <input data-sidebar-field="${esc(key)}" value="${esc(value)}" placeholder="${esc(t("inherit"))}">
        </div>
      </label>`;
    }

    function sidebarAppearanceMarkup(value, global = false) {
      const prefix = global ? "" : t("inherit");
      const number = (key, label, fallback, min, max) => `<label>${esc(label)}
        <input type="number" data-sidebar-field="${key}" value="${value[key] ?? (global ? fallback : "")}" min="${min}" max="${max}" step="0.5" placeholder="${esc(prefix)}">
      </label>`;
      const opacity = (key, label) => {
        const inherited = !global && (value[key] == null || value[key] === "");
        const amount = value[key] ?? sidebarState.globalAppearance[key] ?? 100;
        return `<label>${esc(t(label))}<div class="opacity-row"><input type="range" data-sidebar-field="${key}" min="0" max="100" step="1" value="${amount}" ${inherited ? "disabled" : ""}><output data-opacity-output="${key}">${amount}%</output></div>${global ? "" : `<span class="check-row"><input type="checkbox" data-opacity-inherit="${key}" ${inherited ? "checked" : ""}>${esc(t("inherit"))}</span>`}<small>${esc(t("opacity_hint"))}</small></label>`;
      };
      return `
        <fieldset class="sidebar-section"><legend>${esc(t("colors"))}</legend>
        <label>${esc(t("background"))}
          <select data-sidebar-field="backgroundMode">
            ${global ? "" : `<option value="" ${!value.backgroundMode ? "selected" : ""}>${esc(t("inherit"))}</option>`}
            <option value="none" ${value.backgroundMode === "none" ? "selected" : ""}>${esc(t("bg_none"))}</option>
            <option value="theme" ${value.backgroundMode === "theme" ? "selected" : ""}>${esc(t("bg_theme"))}</option>
            <option value="custom" ${value.backgroundMode === "custom" ? "selected" : ""}>${esc(t("bg_custom"))}</option>
          </select>
        </label>
        <div class="sidebar-color-grid">
          ${sidebarColorField("iconColor", t("icon_color"), value.iconColor, global)}
          ${sidebarColorField("textColor", t("text_color"), value.textColor, global)}
          ${sidebarColorField("background", t("background"), value.background, global)}
          ${sidebarColorField("hoverBackground", t("hover_background"), value.hoverBackground, global)}
          ${sidebarColorField("hoverColor", t("hover_color"), value.hoverColor, global)}
          ${sidebarColorField("activeBackground", t("active_background"), value.activeBackground, global)}
          ${sidebarColorField("activeTextColor", t("active_text_color"), value.activeTextColor, global)}
          ${sidebarColorField("activeIconColor", t("active_icon_color"), value.activeIconColor, global)}
          ${opacity("backgroundOpacity", "background_opacity")}
          ${opacity("hoverBackgroundOpacity", "hover_opacity")}
          ${opacity("activeBackgroundOpacity", "active_opacity")}
        </div>
        </fieldset>
        <fieldset class="sidebar-section"><legend>${esc(t("size_appearance"))}</legend>
          ${number("borderRadius", t("border_radius"), 8, 0, 40)}
        </fieldset>
        ${["Desktop", "Mobile"].map(platform => `<fieldset class="sidebar-section" data-platform="${platform}"><legend>${esc(t(platform.toLowerCase()))}</legend><div class="compact-grid">
          ${number("iconSize" + platform, t("icon_size"), 24, 12, 48)}
          ${number("textSize" + platform, t("text_size"), 14, 8, 28)}
          ${number("itemHeight" + platform, t("item_height"), 40, 24, 72)}
          ${number("itemWidth" + platform, t("item_width"), 100, 20, 100)}
          <small class="full">${esc(t("item_width_hint"))}</small>
          ${number("spacing" + platform, t("spacing"), 4, 0, 24)}
          ${number("horizontalPadding" + platform, t("horizontal_padding"), 12, 0, 32)}
        </div></fieldset>`).join("")}`;
    }

    function bindSidebarFields(container, target) {
      const syncColor = key => {
        const mode = container.querySelector(`[data-sidebar-color-mode="${key}"]`);
        if (mode) mode.value = ["theme", "default"].includes(target[key]) ? "theme" : target[key] ? "custom" : "";
        if (key === "background") {
          const backgroundMode = container.querySelector('[data-sidebar-field="backgroundMode"]');
          if (backgroundMode) backgroundMode.value = target.backgroundMode || "";
        }
      };
      container.querySelectorAll("[data-sidebar-color-mode]").forEach(select => select.addEventListener("change", () => {
        const key = select.dataset.sidebarColorMode;
        target[key] = select.value === "custom" ? container.querySelector(`[data-sidebar-color="${key}"]`).value : select.value;
        if (key === "background") target.backgroundMode = select.value === "custom" ? "custom" : select.value === "theme" ? "theme" : "";
        container.querySelector(`[data-sidebar-field="${key}"]`).value = target[key];
        syncColor(key);
      }));
      container.querySelectorAll("[data-opacity-inherit]").forEach(check => check.addEventListener("change", () => {
        const key = check.dataset.opacityInherit;
        const slider = container.querySelector(`[data-sidebar-field="${key}"]`);
        slider.disabled = check.checked;
        if (check.checked) { delete target[key]; slider.value = sidebarState.globalAppearance[key] ?? 100; }
        else target[key] = Number(slider.value);
        container.querySelector(`[data-opacity-output="${key}"]`).textContent = slider.value + "%";
      }));
      container.querySelectorAll("[data-sidebar-field]").forEach(input => {
        input.addEventListener("input", () => {
          const key = input.dataset.sidebarField;
          if (input.value === "") delete target[key];
          else target[key] = ["number", "range"].includes(input.type) ? Number(input.value) : input.value;
          if (key === "background") target.backgroundMode = ["theme", "default"].includes(input.value) ? "theme" : input.value ? "custom" : "";
          const output = container.querySelector(`[data-opacity-output="${key}"]`);
          if (output) output.textContent = input.value + "%";
          syncColor(key);
          const picker = container.querySelector(`[data-sidebar-color="${key}"]`);
          if (picker && input.value) picker.value = cssColorToHex(input.value, picker.value);
        });
      });
      container.querySelectorAll("[data-sidebar-color]").forEach(picker => {
        picker.addEventListener("pointerdown", event => {
          if (!isMobileViewport()) return;
          event.preventDefault();
          openMobileCustomPicker(container, target, picker.dataset.sidebarColor);
        });
        picker.addEventListener("input", () => {
          const key = picker.dataset.sidebarColor;
          target[key] = picker.value;
          if (key === "background") target.backgroundMode = "custom";
          const text = container.querySelector(`[data-sidebar-field="${key}"]`);
          if (text) text.value = picker.value;
          syncColor(key);
        });
      });
    }

    function rebuildSidebarOrder() {
      const known = [
        ...orderedItems(nativeSidebarItems, managerSidebarOrder(sidebarState, nativeOrder), nativeOrder, item => item.id).map(item => item.id),
        ...sidebarState.customItems.map(item => `custom:${item.id}`)
      ];
      const explicit = managerSidebarOrder(sidebarState, nativeOrder);
      sidebarState.order = [...explicit.filter(id => known.includes(id)), ...known.filter(id => !explicit.includes(id))];
    }

    function moveSidebarOrder(id, direction, groupIds) {
      const groupIndex = groupIds.indexOf(id);
      const otherId = groupIds[groupIndex + direction];
      if (!otherId) return;
      rebuildSidebarOrder();
      sidebarState.orderSource = "manager";
      const index = sidebarState.order.indexOf(id);
      const otherIndex = sidebarState.order.indexOf(otherId);
      [sidebarState.order[index], sidebarState.order[otherIndex]] = [sidebarState.order[otherIndex], sidebarState.order[index]];
    }

    async function renderSidebarEditor() {
      const globalHost = root.getElementById("sidebar-global");
      globalHost.innerHTML = sidebarAppearanceMarkup(sidebarState.globalAppearance, true);
      bindSidebarFields(globalHost, sidebarState.globalAppearance);
      root.getElementById("sidebar-enabled").checked = sidebarState.enabled;
      const query = root.getElementById("sidebar-search").value.trim().toLocaleLowerCase(currentLang());
      const nativeList = root.getElementById("sidebar-native-list");
      nativeList.innerHTML = "";
      const orderedNative = orderedItems(nativeSidebarItems, managerSidebarOrder(sidebarState, nativeOrder), nativeOrder, item => item.id);
      for (const item of orderedNative.filter(entry => !query || `${entry.name} ${entry.id}`.toLocaleLowerCase(currentLang()).includes(query))) {
        const override = sidebarState.itemOverrides[item.id] || (sidebarState.itemOverrides[item.id] = {});
        const wrap = document.createElement("div");
        wrap.className = `item${override._open ? " open" : ""}`;
        wrap.innerHTML = `<div class="item-head">
          <div class="preview-icon"><ha-icon icon="${esc(override.icon || item.icon)}"></ha-icon></div>
          <div class="item-title"><b>${esc(override.name || item.name)}</b><small>${esc(item.dashboard ? t("dashboard") : t("native_item"))} · /${esc(item.id)}</small></div>
          <div class="actions"><button data-act="up">↑</button><button data-act="down">↓</button><button data-act="toggle">${esc(override._open ? t("hide") : t("edit"))}</button></div>
        </div><div class="details"><div class="grid">
          <h4 class="full">${esc(t("basic"))}</h4>
          <label>${esc(t("name"))}<input data-native-field="name" value="${esc(override.name || "")}" placeholder="${esc(item.name)}"></label>
          <label>${esc(t("icon"))}<input data-native-field="icon" value="${esc(override.icon || "")}" placeholder="${esc(item.icon)}"></label>
          <label class="check-row"><input data-native-visible type="checkbox" ${override.visible !== false ? "checked" : ""}><span>${esc(t("visible"))}</span></label>
          <div class="full">${sidebarAppearanceMarkup(override, false)}</div>
          <div class="full section-actions"><button data-act="reset">${esc(t("reset_item"))}</button></div>
        </div></div>`;
        nativeList.appendChild(wrap);
        installIconPicker(wrap.querySelector('[data-native-field="icon"]'), value => {
          if (value) override.icon = value; else delete override.icon;
          wrap.querySelector('.preview-icon ha-icon').setAttribute('icon', value || item.icon);
        }, item.icon);
        bindSidebarFields(wrap, override);
        wrap.querySelectorAll("[data-native-field]").forEach(input => input.addEventListener("change", () => {
          if (input.value) override[input.dataset.nativeField] = input.value; else delete override[input.dataset.nativeField];
        }));
        wrap.querySelector("[data-native-visible]").addEventListener("change", event => override.visible = event.target.checked);
        wrap.addEventListener("click", async event => {
          const act = event.target.dataset.act;
          if (!act) return;
          if (act === "toggle") override._open = !override._open;
          if (act === "reset") sidebarState.itemOverrides[item.id] = {};
          if (act === "up") moveSidebarOrder(item.id, -1, orderedNative.map(entry => entry.id));
          if (act === "down") moveSidebarOrder(item.id, 1, orderedNative.map(entry => entry.id));
          await renderSidebarEditor();
        });
      }
      if (!nativeList.children.length) nativeList.innerHTML = `<div class="hint">${esc(t("no_sidebar_items"))}</div>`;

      const customList = root.getElementById("sidebar-custom-list");
      customList.innerHTML = "";
      const orderedCustom = orderedItems(sidebarState.customItems, sidebarState.order, [], item => `custom:${item.id}`);
      for (const item of orderedCustom) {
        const orderId = `custom:${item.id}`;
        const wrap = document.createElement("div");
        wrap.className = `item${item._open ? " open" : ""}`;
        wrap.innerHTML = `<div class="item-head">
          <div class="preview-icon"><ha-icon icon="${esc(item.icon || "mdi:link-variant")}"></ha-icon></div>
          <div class="item-title"><b>${esc(item.name || t("new_button"))}</b><small>${esc(trLabel(item.targetType))}</small></div>
          <div class="actions"><button data-act="up">↑</button><button data-act="down">↓</button><button data-act="toggle">${esc(item._open ? t("hide") : t("edit"))}</button><button data-act="delete" class="danger">✕</button></div>
        </div><div class="details"><div class="grid">
          <h4 class="full">${esc(t("basic"))}</h4>
          <label>${esc(t("name"))}<input data-custom-field="name" value="${esc(item.name || "")}"></label>
          <label>${esc(t("icon"))}<input data-custom-field="icon" value="${esc(item.icon || "")}" placeholder="mdi:link-variant"></label>
          <h4 class="full">${esc(t("target"))}</h4>
          <label>${esc(t("target_type"))}<select data-custom-field="targetType">${["dashboard","entity","device","addon","settings","url"].map(type => `<option value="${type}" ${item.targetType === type ? "selected" : ""}>${esc(trLabel(type))}</option>`).join("")}</select></label>
          <label>${esc(t("target"))}<select data-custom-target></select></label>
          <label class="check-row"><input data-custom-enabled type="checkbox" ${item.enabled !== false ? "checked" : ""}><span>${esc(t("visible"))}</span></label>
          <div class="full">${sidebarAppearanceMarkup(item, false)}</div>
          <div class="full section-actions"><button data-act="reset">${esc(t("reset_item"))}</button></div>
        </div></div>`;
        customList.appendChild(wrap);
        installIconPicker(wrap.querySelector('[data-custom-field="icon"]'), value => {
          item.icon = value;
          wrap.querySelector('.preview-icon ha-icon').setAttribute('icon', value || 'mdi:link-variant');
        }, "mdi:link-variant", "mdi:link-variant");
        bindSidebarFields(wrap, item);
        const target = wrap.querySelector("[data-custom-target]");
        if (item.targetType === "url") {
          target.outerHTML = `<input data-custom-field="targetId" value="${esc(item.targetId || "")}" placeholder="/lovelace · https://…">`;
        } else {
          const options = await optionsFor(item);
          target.innerHTML = `<option value="">${esc(t("select"))}</option>${options.map(option => `<option value="${esc(option.id)}" ${option.id === item.targetId ? "selected" : ""}>${esc(option.name)}</option>`).join("")}`;
          target.addEventListener("change", () => item.targetId = target.value);
        }
        wrap.querySelectorAll("[data-custom-field]").forEach(input => input.addEventListener("change", async () => {
          const key = input.dataset.customField;
          item[key] = input.value;
          if (key === "targetType") { item.targetId = ""; await renderSidebarEditor(); }
        }));
        wrap.querySelector("[data-custom-enabled]").addEventListener("change", event => item.enabled = event.target.checked);
        wrap.addEventListener("click", async event => {
          const act = event.target.dataset.act;
          if (!act) return;
          if (act === "toggle") item._open = !item._open;
          if (act === "delete") sidebarState.customItems.splice(sidebarState.customItems.indexOf(item), 1);
          if (act === "reset") {
            for (const key of ["hoverBackgroundOpacity","activeBackgroundOpacity","iconColor","textColor","backgroundMode","background","backgroundOpacity","hoverBackground","hoverColor","activeBackground","activeTextColor","activeIconColor","borderRadius","spacingDesktop","spacingMobile","itemWidthDesktop","itemWidthMobile","itemHeightDesktop","itemHeightMobile","iconSizeDesktop","iconSizeMobile","textSizeDesktop","textSizeMobile","horizontalPaddingDesktop","horizontalPaddingMobile"]) delete item[key];
          }
          if (act === "up") moveSidebarOrder(orderId, -1, orderedCustom.map(entry => `custom:${entry.id}`));
          if (act === "down") moveSidebarOrder(orderId, 1, orderedCustom.map(entry => `custom:${entry.id}`));
          await renderSidebarEditor();
        });
      }
    }

    function dashboardError(error) {
      const detail = errorDetail(error);
      status.textContent = t("dashboard_api_error") + detail;
      const feedback = root.getElementById("dashboard-status");
      feedback.textContent = status.textContent;
      feedback.setAttribute("role", "alert");
      feedback.scrollIntoView({ block: "nearest" });
    }

    async function refreshDashboardLists() {
      const savedNativeOrder = await loadNativeSidebarOrder();
      nativeOrder = savedNativeOrder.length ? savedNativeOrder : nativeFallbackOrder;
      if (sidebarRuntime) sidebarRuntime.nativeOrder = nativeOrder;
      dashboards = null;
      root.getElementById("dashboard-status").textContent = status.textContent;
      const previous = dashboardRecords;
      if (!await renderDashboardEditor()) return;
      previous.filter(old => !dashboardRecords.some(current => current.id === old.id)).forEach(old => removedDashboardPaths.add(old.url_path));
      dashboardRecords.forEach(current => removedDashboardPaths.delete(current.url_path));
      nativeSidebarItems = orderedItems((await loadSidebarItems(dashboardRecords)).filter(item => !removedDashboardPaths.has(item.id)), nativeSidebarItems.map(item => item.id), [], item => item.id);
      await renderSidebarEditor();
      sidebarRuntime?.schedule();
    }

    async function renderDashboardEditor() {
      try { dashboardRecords = await loadDashboardRecords(true); }
      catch (error) { dashboardError(error); return false; }
      const list = root.getElementById("dashboard-list");
      dashboardRecords = orderedItems(dashboardRecords, managerSidebarOrder(sidebarState, nativeOrder), [...nativeOrder, ...dashboardSourceOrder], item => item.url_path || "lovelace");
      dashboardSourceOrder = dashboardRecords.map(item => item.url_path || "lovelace");
      list.innerHTML = "";
      if (!dashboardRecords.length) list.innerHTML = `<div class="hint">${esc(t("no_dashboards"))}</div>`;
      for (const dashboard of dashboardRecords) {
        const editable = dashboard.mode === "storage" && hass?.user?.is_admin;
        const card = document.createElement("div");
        card.className = "dashboard-card";
        card.dataset.path = dashboard.url_path || "lovelace";
        card.innerHTML = `<div class="dashboard-form">
          <label>${esc(t("dashboard_title"))}<input data-dashboard-field="title" value="${esc(dashboard.title || "")}" ${editable ? "" : "disabled"}></label>
          <label>${esc(t("dashboard_path"))}<input value="${esc(dashboard.url_path || "")}" disabled><small>${esc(t("dashboard_path_fixed"))}</small></label>
          <label>${esc(t("icon"))}<input data-dashboard-field="icon" value="${esc(dashboard.icon || "")}" ${editable ? "" : "disabled"}></label>
          <label class="check-row"><input data-dashboard-field="show_in_sidebar" type="checkbox" ${dashboard.show_in_sidebar !== false ? "checked" : ""} ${editable ? "" : "disabled"}><span>${esc(t("show_sidebar"))}</span></label>
          <label class="check-row"><input data-dashboard-field="require_admin" type="checkbox" ${dashboard.require_admin ? "checked" : ""} ${editable ? "" : "disabled"}><span>${esc(t("admin_only"))}</span></label>
        </div><small>${esc(dashboard.mode === "yaml" ? t("yaml_dashboard") : t("storage_dashboard"))}${!editable && dashboard.mode !== "yaml" ? ` · ${esc(t("dashboard_admin_required"))}` : ""}</small>
        ${editable ? `<div class="actions"><button data-act="update" class="primary">${esc(t("update"))}</button><button data-act="delete" class="danger">${esc(t("delete"))}</button></div>` : ""}`;
        list.appendChild(card);
        installIconPicker(card.querySelector('[data-dashboard-field="icon"]'), () => {}, "mdi:view-dashboard");
        card.addEventListener("click", async event => {
          const act = event.target.dataset.act;
          if (!act) return;
          if (!editable) return;
          try {
            if (act === "update") {
              const values = {};
              card.querySelectorAll("[data-dashboard-field]").forEach(input => values[input.dataset.dashboardField] = input.type === "checkbox" ? input.checked : input.value);
              await updateDashboard(dashboard.id, values);
              status.textContent = t("dashboard_updated");
            }
            if (act === "delete") {
              if (!confirm(t("confirm_delete_dashboard"))) return;
              await deleteDashboard(dashboard.id);
              status.textContent = t("dashboard_deleted");
            }
            await refreshDashboardLists();
          } catch (error) { dashboardError(error); }
        });
      }
      return true;
    }

    async function render() {
      listEl.innerHTML = "";
      if (!state.length) {
        const empty = document.createElement("div");
        empty.className = "hint";
        empty.textContent = t("no_buttons");
        listEl.appendChild(empty);
        return;
      }

      for (let index = 0; index < state.length; index++) {
        const item = state[index];
        const wrap = document.createElement("div");
        wrap.className = "item" + (item._open ? " open" : "");
        wrap.innerHTML = `
          <div class="item-head">
            <div class="preview-icon">${item.icon ? `<ha-icon icon="${esc(item.icon)}"></ha-icon>` : ""}</div>
            <div class="item-title">
              <b>${esc(item.name || t("new_button"))}</b>
              <small>${esc(labelTarget(item.targetType))}</small>
            </div>
            <div class="actions">
              <button data-act="up" title="${esc(t("up"))}">↑</button>
              <button data-act="down" title="${esc(t("down"))}">↓</button>
              <button data-act="toggle">${item._open ? esc(t("hide")) : esc(t("edit"))}</button>
              <button data-act="delete" class="danger" title="${esc(t("remove"))}">✕</button>
            </div>
          </div>
          <div class="details">
            <div class="grid">
              <label>${esc(t("name"))}
                <input data-field="name" value="${esc(item.name || "")}">
              </label>
              <label>${esc(t("icon"))}
                <div class="icon-selector-host" data-icon-index="${index}"></div>
              </label>
              <label>${esc(t("target_type"))}
                <select data-field="targetType">
                  ${[
                    ["entity",t("entity")],
                    ["device",t("device")],
                    ["addon",t("addon")],
                    ["dashboard",t("dashboard")],
                    ["settings",t("settings")],
                    ["url",t("custom_url")]
                  ].map(([v,n]) => `<option value="${v}" ${item.targetType===v?"selected":""}>${n}</option>`).join("")}
                </select>
              </label>
              <label>${esc(t("display_style"))}
                <select data-field="display">
                  ${[
                    ["icon",t("icon_only")],
                    ["icon_text",t("icon_text")],
                    ["text",t("text_only")],
                    ["compact",t("compact")],
                    ["wide",t("wide")]
                  ].map(([v,n]) => `<option value="${v}" ${item.display===v?"selected":""}>${n}</option>`).join("")}
                </select>
              </label>
              <label>${esc(t("icon_correction"))}
                <div class="correction-row">
                  <input type="range" min="-30" max="30" step="1" data-field="iconSizeCorrection" value="${Number(item.iconSizeCorrection ?? 0)}">
                  <output class="icon-correction-value">${Number(item.iconSizeCorrection ?? 0)}%</output>
                </div>
                <small>${esc(t("correction_hint"))}</small>
              </label>
              <label>${esc(t("button_correction"))}
                <div class="correction-row">
                  <input type="range" min="-30" max="30" step="1" data-field="buttonSizeCorrection" value="${Number(item.buttonSizeCorrection ?? 0)}">
                  <output class="button-correction-value">${Number(item.buttonSizeCorrection ?? 0)}%</output>
                </div>
                <small>${esc(t("correction_hint"))}</small>
              </label>
              <label class="full target-holder">${esc(t("target"))}
                <div class="combo target-combo">
                  <button type="button" class="combo-trigger">
                    <span class="combo-value">Načítám…</span>
                    <span>⌄</span>
                  </button>
                  <div class="combo-panel">
                    <input class="combo-search" type="search" placeholder="${esc(t("search_inside"))}">
                    <div class="combo-options"></div>
                  </div>
                </div>
              </label>
              <label>${esc(t("icon_text_color"))}
                <select data-field="colorMode">
                  <option value="theme" ${!item.color || item.colorMode==="theme" ? "selected":""}>${esc(t("theme_default"))}</option>
                  <option value="custom" ${item.color && item.colorMode!=="theme" ? "selected":""}>${esc(t("custom_color"))}</option>
                </select>
                <div class="palette" data-palette-for="color">
                  <div class="sv-box" data-sv-for="color">
                    <div class="sv-white"></div>
                    <div class="sv-black"></div>
                    <div class="sv-cursor"></div>
                  </div>
                  <input class="hue-slider" type="range" min="0" max="360" step="1" data-hue-for="color">
                  <div class="color-row">
                    <input type="color" data-color-picker="color" value="${esc(item.color && item.color.startsWith("#") ? item.color : "#ffffff")}">
                    <input data-field="color" value="${esc(item.color || "")}" placeholder="#ffffff">
                  </div>
                  <div class="mobile-swatches" data-swatches-for="color"></div>
                </div>
              </label>

              <label>${esc(t("background"))}
                <select data-field="backgroundMode">
                  <option value="none" ${(item.backgroundMode || (!item.background ? "none" : "custom"))==="none" ? "selected":""}>${esc(t("bg_none"))}</option>
                  <option value="theme" ${item.backgroundMode==="theme" ? "selected":""}>${esc(t("bg_theme"))}</option>
                  <option value="custom" ${item.background && item.backgroundMode!=="theme" && item.backgroundMode!=="none" ? "selected":""}>${esc(t("custom_color"))}</option>
                </select>
                <div class="palette" data-palette-for="background">
                  <div class="sv-box" data-sv-for="background">
                    <div class="sv-white"></div>
                    <div class="sv-black"></div>
                    <div class="sv-cursor"></div>
                  </div>
                  <input class="hue-slider" type="range" min="0" max="360" step="1" data-hue-for="background">
                  <div class="color-row">
                    <input type="color" data-color-picker="background" value="${esc(item.background && item.background.startsWith("#") ? item.background : "#303030")}">
                    <input data-field="background" value="${esc(item.background || "")}" placeholder="#303030">
                  </div>
                  <div class="mobile-swatches" data-swatches-for="background"></div>
                </div>
              </label>
              <label>${esc(t("opacity"))}
                <div class="opacity-row">
                  <input type="range" min="0" max="100" step="1" data-field="backgroundOpacity" value="${Number(item.backgroundOpacity ?? 100)}">
                  <output class="opacity-value">${Number(item.backgroundOpacity ?? 100)}%</output>
                </div>
                <small>${esc(t("opacity_hint"))}</small>
              </label>
            </div>
          </div>
        `;

        listEl.appendChild(wrap);

        // Share the native picker with sidebar and dashboard editors.
        const iconHost = wrap.querySelector(".icon-selector-host");
        if (iconHost) {
          const input = document.createElement("input");
          input.value = item.icon || "";
          input.setAttribute("aria-label", t("icon"));
          iconHost.append(input);
          installIconPicker(input, value => {
            item.icon = value;
            const preview = wrap.querySelector(".preview-icon");
            preview.innerHTML = value ? `<ha-icon icon="${esc(value)}"></ha-icon>` : "";
          }, "mdi:home", "mdi:home");
        }

        const targetHolder = wrap.querySelector(".target-holder");

        if (item.targetType === "url") {
          targetHolder.innerHTML = `${esc(t("url"))}
            <input data-field="targetId" value="${esc(item.targetId || "")}" placeholder="https://… · /config/…">`;
        } else {
          const opts = await optionsFor(item);
          const combo = wrap.querySelector(".target-combo");
          const trigger = combo?.querySelector(".combo-trigger");
          const valueEl = combo?.querySelector(".combo-value");
          const comboSearch = combo?.querySelector(".combo-search");
          const optionsEl = combo?.querySelector(".combo-options");

          const selected = opts.find(o => o.id === item.targetId);
          if (valueEl) valueEl.textContent = selected?.name || t("select");

          const renderComboOptions = (query = "") => {
            if (!optionsEl) return;
            const q = query.trim().toLocaleLowerCase("cs");
            const filtered = !q
              ? opts
              : opts.filter(o =>
                  String(o.name).toLocaleLowerCase("cs").includes(q) ||
                  String(o.id).toLocaleLowerCase("cs").includes(q)
                );

            optionsEl.innerHTML = "";
            if (!filtered.length) {
              const empty = document.createElement("div");
              empty.className = "combo-empty";
              empty.textContent = t("nothing_found");
              optionsEl.appendChild(empty);
              return;
            }

            for (const option of filtered) {
              const btn = document.createElement("button");
              btn.type = "button";
              btn.className = "combo-option" + (option.id === item.targetId ? " selected" : "");
              btn.textContent = option.name;
              btn.title = option.id;
              btn.addEventListener("click", async (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                item.targetId = option.id;
                if (valueEl) valueEl.textContent = option.name;
                combo?.classList.remove("open");
                await render();
              });
              optionsEl.appendChild(btn);
            }
          };

          renderComboOptions();

          trigger?.addEventListener("click", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            combo?.classList.toggle("open");
            if (combo?.classList.contains("open")) {
              comboSearch?.focus();
              renderComboOptions(comboSearch?.value || "");
            }
          });

          comboSearch?.addEventListener("input", () => {
            renderComboOptions(comboSearch.value);
          });

          document.addEventListener("click", (ev) => {
            if (combo && !combo.contains(ev.target)) combo.classList.remove("open");
          }, { once: true });
        }

        wrap.addEventListener("click", async (ev) => {
          const act = ev.target?.dataset?.act;
          if (!act) return;
          if (act === "toggle") item._open = !item._open;
          if (act === "delete") state.splice(index, 1);
          if (act === "up" && index > 0) [state[index-1], state[index]] = [state[index], state[index-1]];
          if (act === "down" && index < state.length - 1) [state[index+1], state[index]] = [state[index], state[index+1]];
          await render();
        });

        wrap.querySelectorAll("[data-field]").forEach(field => {
          field.addEventListener("change", async (ev) => {
            const key = ev.target.dataset.field;
            item[key] = ev.target.value;

            if (key === "targetType") {
              item.targetId = "";
              await render();
              return;
            }

            if (key === "colorMode") {
              if (item.colorMode === "theme") item.color = "";
              await render();
              return;
            }

            if (key === "backgroundMode") {
              // Do not erase the previously selected custom color.
              // "none" is controlled only by backgroundMode and backgroundCss().
              if (item.backgroundMode === "theme") {
                // Keep custom color untouched for later use.
              }
              await render();
              return;
            }

            if (["name"].includes(key)) await render();
          });
        });

        const iconCorrectionInput = wrap.querySelector('[data-field="iconSizeCorrection"]');
        const iconCorrectionValue = wrap.querySelector(".icon-correction-value");
        iconCorrectionInput?.addEventListener("input", () => {
          item.iconSizeCorrection = Number(iconCorrectionInput.value);
          if (iconCorrectionValue) iconCorrectionValue.textContent = `${iconCorrectionInput.value}%`;
        });

        const buttonCorrectionInput = wrap.querySelector('[data-field="buttonSizeCorrection"]');
        const buttonCorrectionValue = wrap.querySelector(".button-correction-value");
        buttonCorrectionInput?.addEventListener("input", () => {
          item.buttonSizeCorrection = Number(buttonCorrectionInput.value);
          if (buttonCorrectionValue) buttonCorrectionValue.textContent = `${buttonCorrectionInput.value}%`;
        });

        const opacityInput = wrap.querySelector('[data-field="backgroundOpacity"]');
        const opacityValue = wrap.querySelector(".opacity-value");
        opacityInput?.addEventListener("input", () => {
          item.backgroundOpacity = Number(opacityInput.value);
          if (opacityValue) opacityValue.textContent = `${opacityInput.value}%`;
        });

        setupPalette(wrap, item, "color");
        setupPalette(wrap, item, "background");
        setupMobileSwatches(wrap, item, "color");
        setupMobileSwatches(wrap, item, "background");
      }
    }

    function labelTarget(type) {
      return trLabel(type);
    }

    root.getElementById("close").addEventListener("click", () => host.remove());
    root.querySelector(".overlay").addEventListener("click", (e) => {
      if (e.target.classList.contains("overlay")) host.remove();
    });
    root.getElementById("add").addEventListener("click", async () => {
      state.push({
        name: t("new_button"),
        icon: "mdi:home",
        targetType: "device",
        targetId: "",
        display: "icon",
        iconSizeCorrection: 0,
        buttonSizeCorrection: 0,
        colorMode: "theme",
        color: "",
        backgroundMode: "none",
        background: "",
        backgroundOpacity: 100,
        enabled: true,
        _open: true
      });
      await render();
    });
    root.getElementById("reset").addEventListener("click", async () => {
      if (!confirm(t("confirm_delete_all"))) return;
      state.splice(0, state.length);
      await render();
    });
    root.getElementById("sidebar-enabled").addEventListener("change", event => sidebarState.enabled = event.target.checked);
    root.getElementById("sidebar-search").addEventListener("input", () => void renderSidebarEditor());
    root.getElementById("add-sidebar-item").addEventListener("click", async () => {
      const id = `item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      sidebarState.customItems.push({
        id, name: t("new_button"), icon: "mdi:link-variant", targetType: "dashboard",
        targetId: "", enabled: true, backgroundOpacity: 100, _open: true
      });
      await renderSidebarEditor();
    });
    root.getElementById("reset-sidebar-global").addEventListener("click", async () => {
      sidebarState.globalAppearance = { ...SIDEBAR_GLOBAL_DEFAULTS };
      status.textContent = t("sidebar_global_reset");
      await renderSidebarEditor();
    });
    root.getElementById("remove-sidebar-overrides").addEventListener("click", async () => {
      sidebarState.itemOverrides = {};
      status.textContent = t("overrides_removed");
      await renderSidebarEditor();
    });
    root.getElementById("restore-native-sidebar").addEventListener("click", async () => {
      sidebarState.enabled = false;
      sidebarState.globalAppearance = { ...SIDEBAR_GLOBAL_DEFAULTS };
      sidebarState.itemOverrides = {};
      sidebarState.customItems = [];
      sidebarState.order = [];
      sidebarState.orderSource = "legacy";
      status.textContent = t("native_sidebar_restored");
      await renderSidebarEditor();
    });
    root.getElementById("create-dashboard").disabled = !hass?.user?.is_admin;
    root.getElementById("refresh-dashboards").addEventListener("click", () => void refreshDashboardLists());
    root.getElementById("create-dashboard").title = hass?.user?.is_admin ? "" : t("dashboard_admin_required");
    root.getElementById("create-dashboard").addEventListener("click", async () => {
      const title = root.getElementById("new-dashboard-title").value.trim();
      const urlPath = root.getElementById("new-dashboard-path").value.trim().replace(/^\/+/, "");
      if (!title || !/^[a-z0-9_-]+$/.test(urlPath) || !urlPath.includes("-") || urlPath === "dashboard-") {
        dashboardError(new Error(!title ? t("dashboard_title_required") : t("path_hint")));
        return;
      }
      const createButton = root.getElementById("create-dashboard");
      createButton.disabled = true;
      try {
        await createDashboard({
          title, url_path: urlPath,
          icon: root.getElementById("new-dashboard-icon").value.trim() || undefined,
          show_in_sidebar: root.getElementById("new-dashboard-sidebar").checked,
          require_admin: root.getElementById("new-dashboard-admin").checked
        });
        root.getElementById("new-dashboard-title").value = "";
        root.getElementById("new-dashboard-path").value = "dashboard-";
        resetNewDashboardIcon();
        status.textContent = t("dashboard_created");
        await refreshDashboardLists();
      } catch (error) { dashboardError(error); }
      finally { createButton.disabled = !hass?.user?.is_admin; }
    });
    root.getElementById("save").addEventListener("click", async () => {
      status.textContent = t("saving");
      config.buttons = state.map(({_open, ...x}) => x);
      config.placement = placementState;
      config.hideTitle = hideTitleState;
      config.iconSizeDesktop = iconSizeDesktopState;
      config.iconSizeMobile = iconSizeMobileState;
      config.buttonGapDesktop = buttonGapDesktopState;
      config.buttonGapMobile = buttonGapMobileState;
      config.buttonHeightDesktop = buttonHeightDesktopState;
      config.buttonHeightMobile = buttonHeightMobileState;
      config.buttonPaddingDesktop = buttonPaddingDesktopState;
      config.buttonPaddingMobile = buttonPaddingMobileState;
      config.kioskFallback = kioskFallbackState;
      config.sidebar = JSON.parse(JSON.stringify(sidebarState, (key, value) => key === "_open" ? undefined : value));
      try {
        await saveConfig();
        status.textContent = t("saved");
        setTimeout(() => host.remove(), 500);
      } catch (e) {
        status.textContent = t("load_error") + (e?.message || e);
      }
    });

    [nativeSidebarItems, dashboardRecords] = await Promise.all([loadSidebarItems(), loadDashboardRecords()]);
    await Promise.all([render(), renderSidebarEditor(), renderDashboardEditor()]);
  }

  sidebarRuntime = new SidebarRuntime();
  const runtime = new ToolbarRuntime();
  window.toolbarManager = Object.freeze({
    version: VERSION,
    open: () => openEditor(),
    diagnostics: () => runtime.diagnostics()
  });
  window.haNavManager = window.toolbarManager;
  runtime.start();
  console.info(`[HA Nav Manager] v${VERSION} loaded.`);
})();
