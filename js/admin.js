// Adminbereich: Ergebnisse aller Schülerinnen und Schüler ansehen, exportieren und für eine neue Klasse zurücksetzen.
// Das Passwort wird nicht hier, sondern vom Google-Skript geprüft.
(function () {
  const wurzel = document.getElementById("admin");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (z) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[z]));
  const klasse = (p) => (p >= 75 ? "gut" : p >= 50 ? "mittel" : "schlecht");
  const schluessel = (name) => String(name).trim().toLowerCase().replace(/\s+/g, " ");
  let passwort = "";
  let daten = [];
  let bindungen = {}; // Namensschlüssel → seit wann an ein Gerät gebunden

  function zeigeAnmeldung(meldung) {
    wurzel.innerHTML = `
      <section class="karte">
        <h1>Bereich für Lehrkräfte</h1>
        ${Speicher.istDemo() ? '<p class="hinweis-demo">Demo-Modus: Es ist noch kein Google-Skript eingetragen. Angezeigt werden nur Ergebnisse, die auf diesem Gerät entstanden sind. Das Passwort wird erst mit dem Google-Skript geprüft.</p>' : ""}
        <form id="login" class="formular">
          <label>Passwort <input type="password" id="pw" required autocomplete="current-password"></label>
          <button class="knopf haupt">Anmelden</button>
          ${meldung ? `<p class="fehler">${esc(meldung)}</p>` : ""}
        </form>
      </section>`;
    document.getElementById("login").addEventListener("submit", async (e) => {
      e.preventDefault();
      passwort = document.getElementById("pw").value;
      await laden();
    });
    document.getElementById("pw").focus();
  }

  async function laden() {
    wurzel.innerHTML = '<p>Ergebnisse werden geladen …</p>';
    try {
      const a = await Speicher.holen(passwort);
      if (!a.ok) { passwort = ""; return zeigeAnmeldung(a.fehler || "Anmeldung fehlgeschlagen."); }
      daten = a.ergebnisse || [];
      bindungen = Object.fromEntries((a.bindungen || []).map((b) => [b.schluessel, b.seit]));
      zeigeUebersicht();
    } catch (e) {
      zeigeAnmeldung("Keine Verbindung zum Google-Skript (" + e.message + "). Häufigste Ursache: Bei der Bereitstellung ist nicht „Zugriff: Jeder“ eingestellt.");
    }
  }

  // Pro Person und Aufgabe zählt das beste Ergebnis
  function auswerten() {
    const personen = new Map();
    for (const e of daten) {
      const k = schluessel(e.name);
      if (!personen.has(k)) personen.set(k, { name: e.name, geraete: new Set(), aufgaben: {}, wiederholen: new Set(), letzte: "", eintraege: [] });
      const p = personen.get(k);
      p.geraete.add(e.schuelerId);
      p.eintraege.push(e);
      (e.wiederholen || []).forEach((s) => p.wiederholen.add(s));
      if (String(e.zeit) > p.letzte) p.letzte = String(e.zeit);
      const prozent = Math.round((100 * e.punkte) / e.max);
      const alt = p.aufgaben[e.aufgabe];
      p.aufgaben[e.aufgabe] = { prozent: Math.max(prozent, alt?.prozent ?? -1), versuche: (alt?.versuche || 0) + 1 };
    }
    return [...personen.values()].sort((a, b) => a.name.localeCompare(b.name, "de"));
  }

  function satzStatistik() {
    const s = {};
    for (const e of daten) for (const t of e.teile || []) {
      if (!WIEDERHOLUNG[t.satz]?.istSatz) continue;
      s[t.satz] = s[t.satz] || { richtig: 0, gesamt: 0 };
      s[t.satz].gesamt++;
      if (t.richtig) s[t.satz].richtig++;
    }
    return s;
  }

  function zeigeUebersicht() {
    const personen = auswerten();
    const stat = satzStatistik();
    const bearbeitet = personen.reduce((n, p) => n + Object.keys(p.aufgaben).length, 0);
    let html = `
      <header class="kopf"><h1>Ergebnisse</h1>
        <div class="knopfreihe"><button class="knopf leise" id="neu">↻ Aktualisieren</button><button class="knopf leise" id="csv">⬇ CSV-Export</button><button class="knopf leise" id="abmelden">Abmelden</button></div>
      </header>
      ${Speicher.istDemo() ? '<p class="hinweis-demo">Demo-Modus: nur Ergebnisse dieses Geräts.</p>' : ""}
      <section class="karte kennzahlen">
        <div class="kennzahl"><b>${personen.length}</b>Schülerinnen und Schüler</div>
        <div class="kennzahl"><b>${bearbeitet}</b>bearbeitete Aufgaben</div>
        <div class="kennzahl"><b>${daten.length}</b>Einträge insgesamt</div>
      </section>`;

    if (!personen.length) html += '<section class="karte"><p>Noch keine Ergebnisse eingegangen.</p></section>';
    else {
      html += `<section class="karte"><h2>Übersicht (bestes Ergebnis je Aufgabe in %)</h2><p class="klein">Klick auf einen Namen zeigt alle Einzelheiten und erlaubt, die Gerätebindung zu lösen. 🔒 = Name ist an ein Gerät gebunden. ⚠ = Ergebnisse stammen von mehreren Geräten.</p>
        <div class="tabelle-huelle"><table><thead><tr><th>Name</th>${AUFGABEN.map((a) => `<th title="${esc(a.titel)}">${a.id}<br><span class="sterne klein-sterne">${"★".repeat(a.niveau)}</span></th>`).join("")}<th>Erledigt</th><th>Wiederholen</th></tr></thead><tbody>`;
      personen.forEach((p, i) => {
        html += `<tr class="klickbar" data-person="${i}"><td>${esc(p.name)} ${bindungen[schluessel(p.name)] ? '<span title="an ein Gerät gebunden">🔒</span>' : ""} ${p.geraete.size > 1 ? `<span title="${p.geraete.size} Geräte">⚠</span>` : ""}</td>`;
        for (const a of AUFGABEN) {
          const e = p.aufgaben[a.id];
          html += e ? `<td class="zelle ${klasse(e.prozent)}" title="${e.versuche} Durchgang/Durchgänge">${e.prozent}</td>` : '<td class="zelle"></td>';
        }
        html += `<td>${Object.keys(p.aufgaben).length}/18</td><td>${[...p.wiederholen].map((s) => esc(WIEDERHOLUNG[s]?.name || s)).join(", ")}</td></tr>`;
      });
      html += `</tbody></table></div></section>`;

      html += `<section class="karte"><h2>Die Sätze in der Lerngruppe</h2><div class="balken-liste">` +
        Object.entries(stat).map(([s, w]) => {
          const p = Math.round((100 * w.richtig) / w.gesamt);
          return `<div class="balken-zeile"><span>${WIEDERHOLUNG[s].name}</span><span class="balken"><span style="width:${p}%" class="${klasse(p)}"></span></span><span class="klein">${p} % richtig (${w.gesamt})</span></div>`;
        }).join("") + `</div></section>`;
    }

    html += `
      <section class="karte">
        <h2>Neu starten für eine neue Klasse</h2>
        <p>Löscht alle Ergebnisse aus der Übersicht. Lade vorher am besten den CSV-Export herunter.</p>
        <label class="klein"><input type="checkbox" id="archiv" checked style="display:inline;width:auto;margin-right:6px"> Alte Ergebnisse als Archivblatt in der Google-Tabelle behalten</label>
        <div class="knopfreihe"><button class="knopf gefahr" id="reset">Alle Ergebnisse zurücksetzen</button></div>
      </section>`;

    wurzel.innerHTML = html;
    wurzel.querySelectorAll("[data-person]").forEach((tr) => tr.addEventListener("click", () => zeigePerson(personen[+tr.dataset.person])));
    document.getElementById("neu").addEventListener("click", laden);
    document.getElementById("csv").addEventListener("click", csvExport);
    document.getElementById("abmelden").addEventListener("click", () => { passwort = ""; daten = []; zeigeAnmeldung(); });
    document.getElementById("reset").addEventListener("click", zuruecksetzen);
  }

  function zeigePerson(p) {
    const eintraege = [...p.eintraege].sort((a, b) => String(b.zeit).localeCompare(String(a.zeit)));
    let html = `<header class="kopf"><button class="knopf leise" id="zurueck">← Übersicht</button></header>
      <section class="karte"><h1>${esc(p.name)}</h1>
      <p>${Object.keys(p.aufgaben).length} von 18 Aufgaben bearbeitet · ${p.geraete.size} Gerät(e)</p>
      ${bindungen[schluessel(p.name)]
        ? `<p>🔒 An ein Gerät gebunden seit ${new Date(bindungen[schluessel(p.name)]).toLocaleString("de-DE")}.</p>
           <p class="klein">Nur dieses Gerät kann unter dem Namen Ergebnisse eintragen. Muss die Person das Gerät wechseln (neues Gerät, gelöschte Browserdaten, privates Fenster), hier die Bindung lösen. Die nächste Anmeldung verbindet den Namen mit dem neuen Gerät; alle Ergebnisse bleiben erhalten.</p>
           <div class="knopfreihe"><button class="knopf leise" id="freigeben">Gerätebindung lösen</button></div>`
        : "<p>Nicht an ein Gerät gebunden. Die nächste Anmeldung mit diesem Namen verbindet ihn mit dem Gerät.</p>"}
      ${p.wiederholen.size ? `<p><b>Empfohlene Wiederholung:</b> ${[...p.wiederholen].map((s) => esc(WIEDERHOLUNG[s]?.name || s)).join(", ")}</p>` : ""}</section>`;
    for (const e of eintraege) {
      const prozent = Math.round((100 * e.punkte) / e.max);
      html += `<section class="karte"><h3>${e.aufgabe}. ${esc(e.titel)} <span class="sterne">${"★".repeat(e.niveau)}</span> · ${e.punkte}/${e.max} Punkte (${prozent} %)${e.durchgang > 1 ? ` · ${e.durchgang}. Durchgang` : ""}</h3>
        <p class="klein">${new Date(e.zeit).toLocaleString("de-DE")}</p>
        <div class="tabelle-huelle"><table><thead><tr><th>Teil</th><th>Satz / Thema</th><th>Ergebnis</th><th>Versuche</th><th>Hilfen</th><th>Eingaben</th></tr></thead><tbody>` +
        (e.teile || []).map((t) => `<tr><td>${esc(t.id)})</td><td>${esc(WIEDERHOLUNG[t.satz]?.name || t.satz)}</td><td class="zelle ${t.richtig ? "gut" : "schlecht"}">${t.richtig ? "richtig" : "falsch"}</td><td>${t.versuche}</td><td>${t.hilfen}</td><td>${(t.eingaben || []).map(esc).join(" → ")}</td></tr>`).join("") +
        `</tbody></table></div></section>`;
    }
    wurzel.innerHTML = html;
    document.getElementById("zurueck").addEventListener("click", zeigeUebersicht);
    document.getElementById("freigeben")?.addEventListener("click", async (ev) => {
      if (!confirm(`Gerätebindung für ${p.name} lösen? Danach kann sich ${p.name} auf einem anderen Gerät anmelden.`)) return;
      ev.target.disabled = true;
      try {
        const a = await Speicher.freigeben(passwort, p.name);
        if (!a.ok) throw new Error(a.fehler || "unbekannt");
        delete bindungen[schluessel(p.name)];
        zeigePerson(p);
      } catch (e) {
        ev.target.disabled = false;
        alert("Lösen hat nicht geklappt: " + e.message);
      }
    });
    window.scrollTo(0, 0);
  }

  function csvExport() {
    const zeilen = [["Zeit", "Name", "Geraet", "Aufgabe", "Titel", "Niveau", "Durchgang", "Punkte", "Max", "Prozent", "Teilaufgaben (richtig/Versuche/Hilfen)", "Wiederholen"]];
    for (const e of daten) zeilen.push([e.zeit, e.name, e.schuelerId, e.aufgabe, e.titel, e.niveau, e.durchgang, e.punkte, e.max, Math.round((100 * e.punkte) / e.max),
      (e.teile || []).map((t) => `${t.id}:${t.richtig ? "r" : "f"}/${t.versuche}/${t.hilfen}`).join(" "), (e.wiederholen || []).join(" ")]);
    const csv = "﻿" + zeilen.map((z) => z.map((f) => `"${String(f ?? "").replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = `ergebnisse-koerperberechnungen-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  async function zuruecksetzen() {
    const archivieren = document.getElementById("archiv").checked;
    const eingabe = prompt(`Wirklich alle ${daten.length} Einträge zurücksetzen?${archivieren ? "" : " Sie werden endgültig gelöscht!"}\nZur Bestätigung NEUSTART eintippen:`);
    if (eingabe !== "NEUSTART") return;
    try {
      const a = await Speicher.zuruecksetzen(passwort, archivieren);
      if (!a.ok) return alert(a.fehler || "Zurücksetzen fehlgeschlagen.");
      alert(a.archiv ? `Erledigt. Die alten Ergebnisse liegen im Blatt „${a.archiv}“.` : "Erledigt. Alle Ergebnisse wurden gelöscht.");
      await laden();
    } catch { alert("Keine Verbindung zum Google-Skript."); }
  }

  zeigeAnmeldung();
})();
