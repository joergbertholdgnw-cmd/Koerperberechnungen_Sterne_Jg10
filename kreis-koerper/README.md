# Kreis und Körper im Alltag (Klasse 10)

Lernapp zum Aufgabenblatt „Kreis und Körper im Alltag“ (Abschluss der Reihe, Doppelstunde 4) mit 15 Aufgaben zu Kreis, Zylinder, Kegel, Pyramide und Kugel. Sie funktioniert wie die Sterne-App im Hauptordner, ist aber vollständig getrennt: eigene Google-Tabelle, eigenes Skript, eigenes Admin-Passwort, eigener Speicher im Browser.

- **Pflichtaufgaben** 1, 3, 7, 10, 13 und 15 tragen das Etikett „Pflicht“ und stehen in der Übersicht oben. Die übrigen Aufgaben sind nach Stationen sortiert.
- **Sterne = Anforderungsbereich** jeder Teilaufgabe: ★ AFB I, ★★ AFB II, ★★★ AFB III.
- **Zahlen-Teilaufgaben** werden sofort geprüft (±1 % Toleranz, bei „runde auf ganze Hundert“ eine feste Toleranz), zwei Versuche, zwei Hilfen ohne Lösung.
- **Begründungs-Teilaufgaben** sind Auswahlaufgaben („stimmt / stimmt nicht“ und die passende Begründung), automatisch geprüft. Dazu gibt es ein freiwilliges Textfeld für eine eigene Begründung, das die Lehrkraft im Adminbereich liest.
- Nach zwei verfehlten Teilaufgaben zum selben Thema erscheint eine **Wiederholungskarte**.
- Name ohne Klasse, Bindung an das Gerät, Abmelden, Fortschritt laden, Adminbereich mit CSV-Export und Neustart wie in der Sterne-App.

## Änderungen gegenüber dem Papierblatt

- 1c: Bezugswert ergänzt („bezogen auf die tatsächlich gefahrene Strecke“), AFB II.
- 5c: Hinweis „also 10 % länger“; die Erklärung fragt ausdrücklich nach dem Vergleich mit der Armlänge.
- 6c, 8c, 9c, 14c: vor der Beurteilung eine Rechen-Teilaufgabe als Stütze.
- 9c: „bei gleicher Grundfläche“ ergänzt.
- 11b: Anteil in Prozent (eine Dezimalstelle).
- 13c: AFB II.
- 15a: in Zylinderteil (AFB I) und Gesamtvolumen (AFB II) geteilt; 15c in Einzelschritte.

## Einrichtung (einmalig, etwa 10 Minuten)

1. Neue Google-Tabelle anlegen, z. B. „Ergebnisse Kreis und Körper“. **Nicht** die Tabelle der Sterne-App verwenden.
2. **Erweiterungen → Apps Script**, den Inhalt von [`apps-script/Code.gs`](apps-script/Code.gs) vollständig in `Code.gs` kopieren und speichern.
3. **Projekteinstellungen** (Zahnrad) → **Skripteigenschaft hinzufügen**: Eigenschaft `ADMIN_PASSWORT`, Wert = das Passwort für diese App.
4. **Bereitstellen → Neue Bereitstellung**, Typ **Web-App**, Ausführen als **Ich**, Zugriff **Jeder**. Zugriff bestätigen und die Web-App-URL (endet auf `/exec`) kopieren.
5. Die URL in [`js/config.js`](js/config.js) bei `SKRIPT_URL` eintragen.

Ohne URL läuft die App im Demo-Modus, die Ergebnisse bleiben dann nur auf dem Gerät.

Adressen nach dem Veröffentlichen mit GitHub Pages:
- App: `https://joergbertholdgnw-cmd.github.io/Koerperberechnungen_Sterne_Jg10/kreis-koerper/`
- Lehrkräfte: `…/kreis-koerper/admin.html`

## Aufgaben ändern und prüfen

Alle Aufgaben stehen in [`js/aufgaben.js`](js/aufgaben.js). Nach jeder Änderung:

```
node kreis-koerper/tools/pruefe-aufgaben.js
```

Das Skript prüft den Aufbau und ob die gerundeten Werte vom Lösungsblatt als richtig erkannt werden. Das Lösungsblatt selbst gehört nicht in dieses öffentliche Repository.
