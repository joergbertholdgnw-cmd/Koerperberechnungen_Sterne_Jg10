# Körperberechnungen mit Sternen (Klasse 10)

Lernapp mit 18 Anwendungsaufgaben zu Kreis, Zylinder, Kegel, Pyramide und Kugel. Benötigte Größen werden mit dem Satz des Pythagoras, dem Höhen- und Kathetensatz sowie dem Sinus- und Kosinussatz bestimmt.

- **★ Basis** (Aufgaben 1–6), **★★ Standard** (7–12), **★★★ Expert** (13–18). Jede Teilaufgabe hat zusätzlich ein eigenes Niveau.
- Jede Aufgabe hat 3 bis 6 Teilaufgaben mit je zwei Hilfen ohne Lösung.
- Die App prüft jede Eingabe sofort (±1 % Toleranz, zwei Versuche) und schickt das Ergebnis nach jeder Aufgabe an die Lehrkraft.
- Wer zweimal bei demselben Satz scheitert, bekommt eine Wiederholungskarte.
- Mit „Abmelden“ wird das Gerät für die nächste Person geleert. Wer sich später mit demselben Namen anmeldet, bekommt seinen bisherigen Stand aus der Tabelle zurück, auch auf einem anderen Gerät.
- Der Bereich für Lehrkräfte (`admin.html`) zeigt alle Ergebnisse, bietet einen CSV-Export und einen Neustart für eine neue Klasse.

## Einrichtung (einmalig, etwa 10 Minuten)

Die App selbst ist eine statische Webseite. Die Ergebnisse speichert ein kleines Google-Apps-Script in einer Google-Tabelle der Lehrkraft. Das Admin-Passwort liegt nur in diesem Skript und nie in diesem öffentlichen Repository.

### 1. Google-Tabelle und Skript anlegen

1. Neue Google-Tabelle anlegen, z. B. „Ergebnisse Körperberechnungen“.
2. Menü **Erweiterungen → Apps Script** öffnen.
3. Den Inhalt von [`apps-script/Code.gs`](apps-script/Code.gs) vollständig in die Datei `Code.gs` kopieren und speichern.
4. Links auf das Zahnrad **Projekteinstellungen** klicken, ganz unten **Skripteigenschaft hinzufügen**:
   - Eigenschaft: `ADMIN_PASSWORT`
   - Wert: das gewünschte Admin-Passwort
5. Oben rechts **Bereitstellen → Neue Bereitstellung**, Typ **Web-App**:
   - Ausführen als: **Ich**
   - Zugriff: **Jeder** (nötig, damit Schülergeräte ohne Google-Konto Ergebnisse senden können)
6. Die Zugriffsanfrage bestätigen und die **Web-App-URL** kopieren (endet auf `/exec`).

### 2. URL in die App eintragen

In [`js/config.js`](js/config.js) die URL bei `SKRIPT_URL` eintragen und speichern (auf GitHub: Datei öffnen, Stift-Symbol, „Commit changes“).

Ohne eingetragene URL läuft die App im Demo-Modus: Ergebnisse bleiben dann nur auf dem jeweiligen Gerät.

### 3. Veröffentlichen mit GitHub Pages

Im Repository **Settings → Pages**: Quelle „Deploy from a branch“, den Branch mit der App und den Ordner `/ (root)` wählen. Nach ein bis zwei Minuten ist die App unter `https://<benutzername>.github.io/<repository>/` erreichbar, der Adminbereich unter `…/admin.html`.

## Datenschutz

- Den eigenen Stand kann jede Person ohne Passwort über ihren Namen abrufen. Wer einen fremden Namen eintippt, sieht also dessen erledigte Aufgaben und Eingaben, aber nie die Liste der Klasse.

- Gespeichert werden Vorname, erster Buchstabe des Nachnamens, eine zufällige Geräte-Kennung und die Ergebnisse. Keine E-Mail, keine Klasse.
- Die Daten liegen in der Google-Tabelle der Lehrkraft. Bitte vor dem Einsatz klären, ob die Schule das erlaubt.
- „Alle Ergebnisse zurücksetzen“ im Adminbereich löscht die Daten. Wahlweise bleibt ein Archivblatt in der Tabelle, das man dort auch von Hand löschen kann.
- Nach fünf falschen Passwörtern sperrt das Skript den Adminzugang für 10 Minuten.

## Aufgaben ändern und prüfen

Alle Aufgaben stehen in [`js/aufgaben.js`](js/aufgaben.js). Die Sollwerte werden dort aus den Angaben berechnet. Nach jeder Änderung prüfen:

```
node tools/pruefe-aufgaben.js   # Aufbau, Niveaus, unabhängige Zweitrechnung
node tools/durchsicht.js        # Aufgaben mit Lösungen als Markdown für die Durchsicht
```

Weitere Einstellungen (Kontrollwert nach zwei Fehlversuchen, Schwelle für Wiederholungskarten) stehen in `js/config.js`.
