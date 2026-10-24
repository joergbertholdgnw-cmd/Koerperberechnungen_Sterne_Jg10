// Lernapp für Schülerinnen und Schüler: Name, Aufgabenübersicht, Aufgaben bearbeiten, Ergebnisse senden.
(function () {
  const STAND = "kk_stand";
  const K = window.KONFIG;
  const app = document.getElementById("app");
  const ANZAHL = AUFGABEN.length;

  const sterne = (n) => "★".repeat(n) + '<span class="stern-leer">' + "★".repeat(3 - n) + "</span>";
  const esc = (s) => String(s).replace(/[&<>"']/g, (z) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[z]));
  const zahl = (x) => x.toLocaleString("de-DE", { maximumFractionDigits: Math.abs(x) >= 100 ? 0 : 2 });
  const zufall = (liste) => liste[Math.floor(Math.random() * liste.length)];
  const BUCHSTABE = "ABCDE";
  const pflichtEtikett = '<span class="etikett-pflicht">Pflicht</span>';

  const LOB = ["Stark gerechnet!", "Richtig, weiter so!", "Genau!", "Sauber gelöst!", "Treffer!", "Das sitzt!"];
  const NOCHMAL = ["Noch nicht ganz. Prüfe deinen Ansatz und deine Einheiten.", "Fast? Kontrolliere, ob du Radius und Durchmesser verwechselt hast.", "Noch nicht richtig. Ein Blick in die Hilfe kann sich lohnen.", "Hast du ungerundet weitergerechnet und wie verlangt gerundet? Versuch es noch einmal."];
  const NOCHMAL_AUSWAHL = ["Noch nicht ganz. Lies die Möglichkeiten noch einmal genau.", "Noch nicht richtig. Vergleiche mit deinen Rechenergebnissen.", "Nicht ganz. Ein Blick in die Hilfe kann sich lohnen."];

  // ───────────── Zustand ─────────────
  let stand = Speicher.lies(STAND, null);
  const speichern = () => Speicher.schreib(STAND, stand);

  function neuerStand(name) {
    const id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()).slice(0, 8);
    return { name, id, aufgaben: {}, themaFehler: {}, meilensteine: [] };
  }

  function aufgabenStand(aid) {
    if (!stand.aufgaben[aid]) stand.aufgaben[aid] = { teile: {}, abgeschlossen: false, durchgang: 1 };
    return stand.aufgaben[aid];
  }
  function teilStand(aid, tid) {
    const a = aufgabenStand(aid);
    if (!a.teile[tid]) a.teile[tid] = { versuche: 0, richtig: false, fertig: false, hilfen: 0, eingaben: [] };
    return a.teile[tid];
  }

  const punkteVon = (t) => (t.richtig ? (t.versuche === 1 ? 2 : 1) : 0);
  function auswertung(aufgabe) {
    const a = stand.aufgaben[aufgabe.id];
    let punkte = 0;
    for (const t of aufgabe.teile) if (a && a.teile[t.id]) punkte += punkteVon(a.teile[t.id]);
    return { punkte, max: aufgabe.teile.length * 2, prozent: Math.round((100 * punkte) / (aufgabe.teile.length * 2)) };
  }
  const erledigt = () => AUFGABEN.filter((a) => stand.aufgaben[a.id]?.abgeschlossen);
  const offen = () => AUFGABEN.filter((a) => !stand.aufgaben[a.id]?.abgeschlossen);

  // Lernstand je Thema aus allen bearbeiteten Teilaufgaben
  function lernstand() {
    const s = {};
    for (const a of AUFGABEN) for (const t of a.teile) {
      const ts = stand.aufgaben[a.id]?.teile[t.id];
      if (!ts || !ts.fertig) continue;
      s[t.thema] = s[t.thema] || { richtig: 0, gesamt: 0 };
      s[t.thema].gesamt++;
      if (ts.richtig) s[t.thema].richtig++;
    }
    return s;
  }

  // Erst die Pflichtaufgaben der Reihe nach, danach eine Wahlaufgabe zum schwächsten Thema
  function vorschlag() {
    const rest = offen();
    if (!rest.length) return null;
    const pflicht = rest.find((a) => a.pflicht);
    if (pflicht) return pflicht;
    const ls = lernstand();
    const schwaechste = Object.entries(ls).sort(([, x], [, y]) => x.richtig / x.gesamt - y.richtig / y.gesamt).map(([t]) => t);
    for (const thema of schwaechste) {
      const passend = rest.find((a) => a.teile.some((t) => t.thema === thema));
      if (passend && ls[thema].richtig < ls[thema].gesamt) return passend;
    }
    return rest[0];
  }

  // ───────────── Ansichten ─────────────
  function zeigeStart() {
    app.innerHTML = `
      <section class="karte start">
        <p class="klein">Abschluss der Reihe · Doppelstunde 4</p>
        <h1>Kreis und Körper im Alltag</h1>
        <p class="lead">${ANZAHL} Aufgaben zu Kreis, Zylinder, Kegel, Pyramide und Kugel. Bearbeite zuerst die sechs ${pflichtEtikett}-Aufgaben. Danach wählst du weitere, vor allem zu den Stationen, bei denen du in deinem Lerntagebuch „teilweise“ oder „noch nicht“ angekreuzt hast.</p>
        <ul class="legende">
          <li><b>★</b> AFB I: ${AFB_TEXT[1]}</li>
          <li><b>★★</b> AFB II: ${AFB_TEXT[2]}</li>
          <li><b>★★★</b> AFB III: ${AFB_TEXT[3]}</li>
        </ul>
        <form id="nameForm" class="formular" autocomplete="off">
          <label>Vorname <input id="vorname" required maxlength="30" placeholder="z. B. Lena"></label>
          <label>Erster Buchstabe deines Nachnamens <input id="kuerzel" required maxlength="2" placeholder="z. B. M" class="kurz"></label>
          <p class="klein">Deine Ergebnisse werden unter diesem Namen für deine Lehrkraft gespeichert. Bitte trage dich jedes Mal genau gleich ein. Dein Name wird beim ersten Mal mit diesem Gerät verbunden; arbeite deshalb immer am selben Gerät und im selben Browser.</p>
          <p class="fehler" id="anmeldeFehler" role="alert"></p>
          <button class="knopf haupt" type="submit">Los geht's</button>
        </form>
      </section>`;
    document.getElementById("nameForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const v = document.getElementById("vorname").value.trim().replace(/\s+/g, " ");
      const k = document.getElementById("kuerzel").value.trim().replace(/\.$/, "").toUpperCase();
      if (!v || !k) return;
      const name = `${v.charAt(0).toUpperCase() + v.slice(1)} ${k}.`;
      if (stand && stand.name === name) { zeigeUebersicht(); return; }
      const knopf = e.target.querySelector("button[type=submit]");
      knopf.disabled = true;
      knopf.textContent = "Anmelden …";
      anmelden(name).then((ok) => {
        if (ok) return zeigeUebersicht();
        knopf.disabled = false;
        knopf.textContent = "Los geht's";
      });
    });
  }

  // Name prüfen bzw. an dieses Gerät binden und bisherige Ergebnisse übernehmen
  async function anmelden(name) {
    const fehlerFeld = document.getElementById("anmeldeFehler");
    let liste;
    try {
      const a = await Speicher.anmelden(name);
      if (a.gebunden) { fehlerFeld.textContent = a.fehler; return false; }
      liste = a.ergebnisse || [];
    } catch {
      // Ohne Verbindung trotzdem rechnen lassen; beim Senden prüft das Skript Name und Gerät
      stand = neuerStand(name);
      speichern();
      toast("Keine Verbindung: Dein bisheriger Stand konnte nicht geladen werden. Du kannst trotzdem rechnen.", 4000);
      return true;
    }
    stand = neuerStand(name);
    if (!liste.length) { speichern(); return true; }
    const neueste = {};
    for (const e of liste) {
      const a = AUFGABEN.find((x) => x.id === Number(e.aufgabe));
      if (!a) continue;
      for (const t of e.teile || []) {
        const thema = a.teile.find((x) => x.id === t.id)?.thema;
        if (!t.richtig && thema) stand.themaFehler[thema] = (stand.themaFehler[thema] || 0) + 1;
      }
      if (!neueste[a.id] || (Number(e.durchgang) || 1) >= neueste[a.id].durchgang) neueste[a.id] = { durchgang: Number(e.durchgang) || 1, teile: e.teile || [] };
      if (e.schuelerId) stand.id = String(e.schuelerId);
    }
    for (const [aid, n] of Object.entries(neueste)) {
      const teile = {};
      for (const t of n.teile) teile[t.id] = { versuche: t.versuche, richtig: !!t.richtig, fertig: true, hilfen: t.hilfen || 0, eingaben: t.eingaben || [], freitext: t.freitext || "" };
      stand.aufgaben[aid] = { teile, abgeschlossen: true, durchgang: n.durchgang, gesendet: true };
    }
    meilensteinePruefen(true);
    speichern();
    toast(`Willkommen zurück! ${Object.keys(neueste).length} Aufgabe(n) hast du schon gelöst.`, 3500);
    return true;
  }

  function kachel(a) {
    const st = stand.aufgaben[a.id];
    const ausw = st ? auswertung(a) : null;
    const status = st?.abgeschlossen ? `<span class="status ${ausw.prozent >= 50 ? "fertig" : "begonnen"}">✓ gelöst · ${ausw.prozent} %</span>` : st && Object.keys(st.teile).length ? '<span class="status begonnen">begonnen</span>' : '<span class="status">neu</span>';
    const afbs = [...new Set(a.teile.map((t) => t.afb))].sort();
    return `<button class="aufgabe-kachel ${st?.abgeschlossen ? "ist-fertig" : ""}" data-aufgabe="${a.id}">
      <span class="nr">Aufgabe ${a.id} · Station ${a.station} ${a.pflicht ? pflichtEtikett : ""}</span><span class="titel">${esc(a.titel)}</span>
      <span class="tags">${a.koerper.join(" · ")} · <span class="sterne klein-sterne">${afbs.map((n) => "★".repeat(n)).join(" ")}</span></span>${status}</button>`;
  }

  function zeigeUebersicht() {
    const fertig = erledigt().length;
    const pflichtOffen = AUFGABEN.filter((a) => a.pflicht && !stand.aufgaben[a.id]?.abgeschlossen).length;
    const ls = lernstand();
    const tipp = vorschlag();
    const schwach = Object.entries(stand.themaFehler).filter(([, n]) => n >= K.WIEDERHOLUNG_AB).map(([s]) => s);
    const offeneSendungen = Speicher.offen();

    let html = `
      <header class="kopf">
        <div><span class="klein">Angemeldet als</span><br><b>${esc(stand.name)}</b> <button class="link" id="abmelden">Abmelden</button></div>
        <button class="knopf leise" id="formeln">📐 Formeln</button>
      </header>
      ${Speicher.istDemo() ? '<p class="hinweis-demo">Demo-Modus: Die Ergebnisse werden nur auf diesem Gerät gespeichert.</p>' : ""}
      ${offeneSendungen ? `<p class="hinweis-demo">${offeneSendungen} Ergebnis(se) warten noch auf Internet und werden automatisch nachgeschickt.</p>` : ""}
      <section class="karte fortschritt">
        <div class="ring" style="--p:${(fertig / ANZAHL) * 100}"><span>${fertig}<small>/${ANZAHL}</small></span></div>
        <div>
          <h2>${fertig === 0 ? "Willkommen!" : fertig === ANZAHL ? "Alle Aufgaben geschafft!" : "Dein Fortschritt"}</h2>
          <p>${motivation(fertig, pflichtOffen)}</p>
          ${fertig ? `<p class="klein"><b>Schon gelöst:</b> Aufgabe ${erledigt().map((a) => a.id).sort((x, y) => x - y).join(", ")}</p>` : ""}
          ${tipp ? `<button class="knopf haupt" data-aufgabe="${tipp.id}">Vorschlag: ${esc(tipp.titel)}${tipp.pflicht ? " (Pflicht)" : ""}</button>` : ""}
        </div>
      </section>`;

    if (schwach.length) {
      html += `<section class="karte wiederholen"><h3>🔁 Wiederholen lohnt sich</h3><p>Bei diesen Themen hat es mehrmals gehakt. Schau dir die Karte an, bevor du weitermachst:</p>
        <div class="chips">${schwach.map((s) => `<button class="chip" data-karte="${s}">${WIEDERHOLUNG[s].name}</button>`).join("")}</div></section>`;
    }

    html += `<h2 class="niveau-titel">${pflichtEtikett} Pflichtaufgaben</h2><div class="raster">${AUFGABEN.filter((a) => a.pflicht).map(kachel).join("")}</div>`;
    html += `<h2 class="niveau-titel">Wahlaufgaben</h2><p class="klein">Sortiert nach Stationen. Wähle vor allem Stationen, die du im Lerntagebuch mit „teilweise“ oder „noch nicht“ markiert hast.</p>
      <div class="raster">${AUFGABEN.filter((a) => !a.pflicht).sort((x, y) => x.station - y.station || x.id - y.id).map(kachel).join("")}</div>`;

    const eintraege = Object.entries(ls);
    if (eintraege.length) {
      html += `<section class="karte"><h3>Dein Lernstand bei den Themen</h3><div class="balken-liste">` +
        eintraege.map(([s, w]) => {
          const p = Math.round((100 * w.richtig) / w.gesamt);
          return `<button class="balken-zeile" data-karte="${s}"><span>${WIEDERHOLUNG[s].name}</span><span class="balken"><span style="width:${p}%" class="${p >= 75 ? "gut" : p >= 50 ? "mittel" : "schwach"}"></span></span><span class="klein">${w.richtig}/${w.gesamt}</span></button>`;
        }).join("") + `</div><p class="klein">Tippe auf ein Thema, um die Merkkarte zu öffnen.</p></section>`;
    }

    app.innerHTML = html;
    app.querySelectorAll("[data-aufgabe]").forEach((b) => b.addEventListener("click", () => zeigeAufgabe(+b.dataset.aufgabe)));
    app.querySelectorAll("[data-karte]").forEach((b) => b.addEventListener("click", () => zeigeKarte(b.dataset.karte)));
    document.getElementById("formeln").addEventListener("click", zeigeFormeln);
    document.getElementById("abmelden").addEventListener("click", abmelden);
    window.scrollTo(0, 0);
  }

  function motivation(fertig, pflichtOffen) {
    if (fertig === 0) return "Starte mit der ersten Pflichtaufgabe. Die Sterne zeigen dir bei jeder Teilaufgabe, wie anspruchsvoll sie ist.";
    if (pflichtOffen) return `Schon ${fertig} geschafft. Noch ${pflichtOffen} Pflichtaufgabe(n), dann darfst du frei wählen.`;
    if (fertig < ANZAHL) return "Alle Pflichtaufgaben erledigt! Wähle jetzt Aufgaben zu den Stationen, die dir noch schwerfallen.";
    return `Du hast alle ${ANZAHL} Aufgaben bearbeitet. Wiederhole gern die, bei denen noch Punkte fehlen.`;
  }

  function zeigeAufgabe(aid) {
    const a = AUFGABEN.find((x) => x.id === aid);
    aufgabenStand(aid);
    speichern();

    let html = `
      <header class="kopf">
        <button class="knopf leise" id="zurueck">← Übersicht</button>
        <button class="knopf leise" id="formeln">📐 Formeln</button>
      </header>
      <article class="karte aufgabe">
        <p class="klein">Station ${a.station} ${a.pflicht ? pflichtEtikett : ""}</p>
        <h1>${a.id}. ${esc(a.titel)}</h1>
        <div class="aufgabe-kopf">
          <p class="einleitung">${a.einleitung}</p>
          <figure class="skizze">${SKIZZEN[a.skizze] || ""}<figcaption>Skizze (nicht maßstabsgetreu)</figcaption></figure>
        </div>
        <p class="klein">Rechne mit der π-Taste und runde erst das Endergebnis, so wie es in der Teilaufgabe steht. Gib Zahlen ohne Einheit ein. Pro Teilaufgabe hast du zwei Versuche.</p>
        <ol class="teile">`;
    for (const t of a.teile) html += `<li class="teil" id="teil-${t.id}">${teilHtml(a, t)}</li>`;
    html += `</ol><div id="abschluss"></div></article>`;
    app.innerHTML = html;
    document.getElementById("zurueck").addEventListener("click", zeigeUebersicht);
    document.getElementById("formeln").addEventListener("click", zeigeFormeln);
    for (const t of a.teile) verdrahteTeil(a, t);
    abschlussPruefen(a);
    window.scrollTo(0, 0);
  }

  // Auswahl als Text, z. B. „B / B“ für die Lehrkraft
  const auswahlText = (wahl) => wahl.map((i) => BUCHSTABE[i]).join(" / ");
  const richtigeAuswahl = (t) => t.schritte.map((s) => s.optionen[s.richtig]).join(" ");

  function teilHtml(a, t) {
    const ts = teilStand(a.id, t.id);
    const istZahl = t.typ === "zahl";
    let rueck = "";
    if (ts.fertig && ts.richtig) rueck = `<p class="rueck gut">✓ Richtig${ts.versuche === 1 ? " im ersten Versuch" : ""}${istZahl ? `: ${esc(ts.eingaben[ts.eingaben.length - 1])} ${t.einheit}` : "."}</p>`;
    else if (ts.fertig) rueck = `<p class="rueck schlecht">✗ Leider nicht richtig.${K.KONTROLLWERT_ZEIGEN ? (istZahl ? ` Zum Weiterrechnen: Kontrollwert ≈ ${zahl(t.wert)} ${t.einheit}. Überlege, wo dein Fehler lag.` : ` Richtig wäre: ${esc(richtigeAuswahl(t))}`) : ""}</p>`;
    else if (ts.versuche === 1) rueck = `<p class="rueck mittel">${zufall(istZahl ? NOCHMAL : NOCHMAL_AUSWAHL)} Du hast noch einen Versuch.</p>`;

    const hilfen = t.hilfen.slice(0, ts.hilfen).map((h, i) => `<p class="hilfe"><b>Hilfe ${i + 1}:</b> ${h}</p>`).join("");
    const hilfeKnopf = ts.hilfen < t.hilfen.length ? `<button class="knopf leise hilfe-knopf" type="button">💡 Hilfe ${ts.hilfen + 1}</button>` : "";
    let form = "";
    if (!ts.fertig && istZahl) form = `
        <form class="eingabe">
          <input inputmode="decimal" autocomplete="off" aria-label="Ergebnis Teilaufgabe ${t.marke}" placeholder="Ergebnis">
          <span class="einheit">${t.einheit}</span>
          <button class="knopf haupt" type="submit">Prüfen</button>
          ${hilfeKnopf}
        </form>`;
    else if (!ts.fertig) form = `
        <form class="auswahl">
          ${t.freitext ? `<label class="freitext">${t.freitext} <span class="klein">(freiwillig, geht an deine Lehrkraft)</span>
            <textarea maxlength="600" rows="3" placeholder="Deine Begründung …">${esc(ts.freitext || "")}</textarea></label>` : ""}
          ${t.schritte.map((s, si) => `<fieldset><legend>${s.frage}</legend>${s.optionen.map((o, oi) => `
            <label class="option"><input type="radio" name="s${si}" value="${oi}"> <span>${o}</span></label>`).join("")}</fieldset>`).join("")}
          <div class="knopfreihe"><button class="knopf haupt" type="submit">Prüfen</button>${hilfeKnopf}</div>
        </form>`;
    const eigene = ts.fertig && ts.freitext ? `<p class="klein"><b>Deine Begründung:</b> ${esc(ts.freitext)}</p>` : "";
    const gewaehlt = ts.fertig && !istZahl && ts.eingaben.length ? `<p class="klein"><b>Deine Wahl:</b> ${t.schritte.map((s, si) => esc(s.optionen[BUCHSTABE.indexOf(ts.eingaben[ts.eingaben.length - 1].split(" / ")[si])] || "")).join(" ")}</p>` : "";
    return `
      <div class="teil-kopf"><b>${t.marke}</b> <span class="sterne klein-sterne" title="${AFB[t.afb]}: ${AFB_TEXT[t.afb]}">${sterne(t.afb)}</span> <span class="klein">${AFB[t.afb]}</span></div>
      <p>${t.text}</p>
      ${hilfen}
      ${form}
      ${gewaehlt}${eigene}
      ${rueck}`;
  }

  function verdrahteTeil(a, t) {
    const li = document.getElementById("teil-" + t.id);
    const form = li.querySelector("form");
    if (!form) return;
    const auswerten = (eingabe, richtig) => {
      const ts = teilStand(a.id, t.id);
      ts.versuche++;
      ts.eingaben.push(eingabe);
      if (richtig) {
        ts.richtig = true; ts.fertig = true;
        toast(zufall(LOB));
      } else if (ts.versuche >= 2) {
        ts.fertig = true;
        themaFehler(t.thema);
      }
      speichern();
      neuZeichnen(a, t);
    };
    if (t.typ === "zahl") {
      const feld = form.querySelector("input");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const wert = feld.value.trim();
        if (!wert) return;
        if (!zahlenAusEingabe(wert).length) { feld.setCustomValidity("Bitte eine Zahl eingeben, z. B. 12,97"); feld.reportValidity(); return; }
        auswerten(wert, istRichtig(wert, t.wert, t.abs));
      });
      feld.addEventListener("input", () => feld.setCustomValidity(""));
    } else {
      const text = form.querySelector("textarea");
      if (text) text.addEventListener("input", () => { teilStand(a.id, t.id).freitext = text.value.slice(0, 600); speichern(); });
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const wahl = t.schritte.map((s, si) => form.querySelector(`input[name="s${si}"]:checked`));
        if (wahl.some((w) => !w)) { toast("Bitte wähle in jedem Feld eine Antwort aus.", 2200); return; }
        const zahlen = wahl.map((w) => +w.value);
        auswerten(auswahlText(zahlen), zahlen.every((z, si) => z === t.schritte[si].richtig));
      });
    }
    const hk = form.querySelector(".hilfe-knopf");
    if (hk) hk.addEventListener("click", () => { teilStand(a.id, t.id).hilfen++; speichern(); neuZeichnen(a, t, true); });
  }

  function neuZeichnen(a, t, fokus) {
    const li = document.getElementById("teil-" + t.id);
    li.innerHTML = teilHtml(a, t);
    verdrahteTeil(a, t);
    const ts = teilStand(a.id, t.id);
    if (ts.fertig) {
      const naechster = a.teile.find((x) => !teilStand(a.id, x.id).fertig);
      if (naechster) document.querySelector(`#teil-${naechster.id} input`)?.focus();
    } else if (fokus) li.querySelector("input")?.focus();
    abschlussPruefen(a);
  }

  function themaFehler(thema) {
    stand.themaFehler[thema] = (stand.themaFehler[thema] || 0) + 1;
    if (stand.themaFehler[thema] % K.WIEDERHOLUNG_AB === 0) setTimeout(() => zeigeKarte(thema, true), 400);
  }

  function abschlussPruefen(a) {
    const st = aufgabenStand(a.id);
    const alleFertig = a.teile.every((t) => teilStand(a.id, t.id).fertig);
    const box = document.getElementById("abschluss");
    if (!alleFertig) { box.innerHTML = ""; return; }
    const ausw = auswertung(a);
    if (!st.abgeschlossen) {
      st.abgeschlossen = true;
      st.zeit = Date.now();
      speichern();
      ergebnisSenden(a, ausw);
      meilensteinePruefen();
    }
    const naechste = vorschlag();
    const satz = ausw.prozent === 100 ? "Perfekt! Alle Teilaufgaben richtig." : ausw.prozent >= 75 ? "Sehr gut gemacht!" : ausw.prozent >= 50 ? "Gute Arbeit, du bist auf dem richtigen Weg." : "Dranbleiben lohnt sich! Wiederhole die Merkkarten und versuch die Aufgabe später noch einmal.";
    box.innerHTML = `
      <section class="karte ergebnis ${ausw.prozent >= 75 ? "feiern" : ""}">
        <h2>Aufgabe abgeschlossen: ${ausw.punkte} von ${ausw.max} Punkten (${ausw.prozent} %)</h2>
        <p>${satz}</p>
        <p class="klein" id="sendestatus">${st.gesendet ? "✓ Ergebnis wurde eingetragen." : "Ergebnis wird eingetragen …"}</p>
        <div class="knopfreihe">
          ${naechste ? `<button class="knopf haupt" data-weiter="${naechste.id}">Weiter: ${esc(naechste.titel)}${naechste.pflicht ? " (Pflicht)" : ""}</button>` : ""}
          <button class="knopf leise" id="nochmal">Aufgabe neu rechnen</button>
          <button class="knopf leise" id="zurUebersicht">Zur Übersicht</button>
        </div>
      </section>`;
    box.querySelector("[data-weiter]")?.addEventListener("click", (e) => zeigeAufgabe(+e.currentTarget.dataset.weiter));
    document.getElementById("zurUebersicht").addEventListener("click", zeigeUebersicht);
    document.getElementById("nochmal").addEventListener("click", () => {
      if (!confirm("Aufgabe noch einmal von vorn rechnen? Dein bisheriges Ergebnis bleibt bei deiner Lehrkraft gespeichert.")) return;
      const durchgang = (st.durchgang || 1) + 1;
      stand.aufgaben[a.id] = { teile: {}, abgeschlossen: false, durchgang };
      speichern();
      zeigeAufgabe(a.id);
    });
  }

  async function ergebnisSenden(a, ausw) {
    const st = stand.aufgaben[a.id];
    const ergebnis = {
      name: stand.name, schuelerId: stand.id, aufgabe: a.id, titel: a.titel, pflicht: !!a.pflicht,
      durchgang: st.durchgang || 1, punkte: ausw.punkte, max: ausw.max,
      teile: a.teile.map((t) => {
        const ts = st.teile[t.id];
        return { id: t.id, thema: t.thema, afb: t.afb, typ: t.typ, richtig: ts.richtig, versuche: ts.versuche, hilfen: ts.hilfen, eingaben: ts.eingaben, freitext: ts.freitext || "" };
      }),
      wiederholen: Object.entries(stand.themaFehler).filter(([, n]) => n >= K.WIEDERHOLUNG_AB).map(([s]) => s)
    };
    const r = await Speicher.senden(ergebnis);
    const el = document.getElementById("sendestatus");
    if (r.ok) { st.gesendet = true; speichern(); if (el) el.textContent = r.demo ? "✓ Ergebnis gespeichert (Demo-Modus, nur auf diesem Gerät)." : "✓ Ergebnis wurde eingetragen."; }
    else if (r.gebunden) { if (el) el.textContent = "⚠ " + r.fehler + " Das Ergebnis wurde nicht eingetragen."; }
    else if (el) el.textContent = "Keine Verbindung. Das Ergebnis ist gemerkt und wird automatisch nachgeschickt.";
  }

  function meilensteinePruefen(still) {
    const fertig = erledigt();
    const ziele = [
      ["erste", fertig.length >= 1, "Erste Aufgabe geschafft! 🎉"],
      ["pflicht", AUFGABEN.filter((a) => a.pflicht).every((a) => stand.aufgaben[a.id]?.abgeschlossen), "Alle Pflichtaufgaben erledigt! Jetzt hast du freie Wahl."],
      ["afb3", AUFGABEN.some((a) => a.teile.some((t) => t.afb === 3 && stand.aufgaben[a.id]?.teile[t.id]?.richtig)), "Deine erste ★★★-Teilaufgabe gelöst! 💪"],
      ["zehn", fertig.length >= 10, "Schon 10 Aufgaben!"],
      ["alle", fertig.length === ANZAHL, `Alle ${ANZAHL} Aufgaben geschafft! Großartig! 🏆`]
    ];
    for (const [id, erreicht, text] of ziele) {
      if (erreicht && !stand.meilensteine.includes(id)) { stand.meilensteine.push(id); speichern(); if (!still) toast(text, 4000); }
    }
  }

  // ───────────── Overlays ─────────────
  function zeigeKarte(thema, automatisch) {
    const w = WIEDERHOLUNG[thema];
    overlay(`
      ${automatisch ? `<p class="klein">Bei diesem Thema hat es jetzt ${stand.themaFehler[thema]}-mal nicht geklappt. Eine kurze Wiederholung hilft!</p>` : ""}
      <h2>🔁 ${w.name}</h2>
      <p class="merke">${w.merke.split(" · ").join("<br>")}</p>
      ${w.tipps.length ? `<h3>Typische Stolperstellen</h3><ul>${w.tipps.map((t) => `<li>${t}</li>`).join("")}</ul>` : ""}
      ${w.buch ? `<p><b>Auftrag:</b> ${w.buch}</p>` : ""}`);
  }

  function zeigeFormeln() {
    overlay(`<h2>📐 Formeln</h2>` +
      Object.values(WIEDERHOLUNG).filter((w) => w.formel).map((w) => `<h3>${w.name}</h3><p class="merke">${w.merke.split(" · ").join("<br>")}</p>`).join("") +
      `<h3>Weitere Merkkarten</h3><div class="chips">${Object.entries(WIEDERHOLUNG).filter(([, w]) => !w.formel).map(([s, w]) => `<button class="chip" data-karte="${s}">${w.name}</button>`).join("")}</div>`);
    document.querySelectorAll(".overlay [data-karte]").forEach((b) => b.addEventListener("click", () => zeigeKarte(b.dataset.karte)));
  }

  // Leert das Gerät für die nächste Person; gesendete Ergebnisse bleiben bei der Lehrkraft.
  function abmelden() {
    document.querySelector(".overlay")?.remove();
    const wartend = Speicher.offen();
    const o = document.createElement("div");
    o.className = "overlay";
    o.innerHTML = `<div class="overlay-box" role="dialog" aria-modal="true">
      <h2>Abmelden?</h2>
      <p>Deine abgeschlossenen Aufgaben sind bei deiner Lehrkraft gespeichert. Auf diesem Gerät wird dein Fortschritt gelöscht, damit die nächste Person neu beginnen kann.</p>
      ${wartend ? `<p class="hinweis-demo">${wartend} Ergebnis(se) warten noch auf Internet. Sie bleiben auf diesem Gerät und werden automatisch nachgeschickt.</p>` : ""}
      <button class="knopf haupt" id="abmeldenJa">Ja, abmelden</button>
      <button class="knopf leise schliessen">Abbrechen</button></div>`;
    document.body.appendChild(o);
    const zu = () => o.remove();
    o.querySelector(".schliessen").addEventListener("click", zu);
    o.addEventListener("click", (e) => { if (e.target === o) zu(); });
    o.querySelector("#abmeldenJa").addEventListener("click", () => {
      stand = null;
      Speicher.schreib(STAND, null);
      zu();
      zeigeStart();
      window.scrollTo(0, 0);
      toast("Abgemeldet. Das Gerät ist frei für die nächste Person.", 2600);
    });
    o.querySelector("#abmeldenJa").focus();
  }

  function overlay(inhalt) {
    document.querySelector(".overlay")?.remove();
    const o = document.createElement("div");
    o.className = "overlay";
    o.innerHTML = `<div class="overlay-box" role="dialog" aria-modal="true">${inhalt}<button class="knopf haupt schliessen">Verstanden</button></div>`;
    document.body.appendChild(o);
    const zu = () => o.remove();
    o.querySelector(".schliessen").addEventListener("click", zu);
    o.addEventListener("click", (e) => { if (e.target === o) zu(); });
    o.querySelector(".schliessen").focus();
  }

  function toast(text, dauer = 1800) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add("weg"), dauer);
    setTimeout(() => t.remove(), dauer + 500);
  }

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") document.querySelector(".overlay")?.remove(); });

  // ───────────── Start ─────────────
  Speicher.nachsenden().then((n) => { if (n) toast(`${n} gemerkte(s) Ergebnis(se) nachgeschickt.`); });
  if (stand && stand.name) zeigeUebersicht(); else zeigeStart();
})();
