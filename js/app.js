// Lernapp für Schülerinnen und Schüler: Name, Aufgabenübersicht, Aufgaben bearbeiten, Ergebnisse senden.
(function () {
  const STAND = "kb_stand";
  const K = window.KONFIG;
  const app = document.getElementById("app");

  const sterne = (n) => "★".repeat(n) + '<span class="stern-leer">' + "★".repeat(3 - n) + "</span>";
  const esc = (s) => String(s).replace(/[&<>"']/g, (z) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[z]));
  const zahl = (x) => x.toLocaleString("de-DE", { maximumFractionDigits: 2 });
  const zufall = (liste) => liste[Math.floor(Math.random() * liste.length)];

  const LOB = ["Stark gerechnet!", "Richtig, weiter so!", "Genau!", "Sauber gelöst!", "Treffer!", "Das sitzt!"];
  const NOCHMAL = ["Noch nicht ganz. Prüfe deinen Ansatz und deine Einheiten.", "Fast? Kontrolliere, ob du Radius und Durchmesser verwechselt hast.", "Noch nicht richtig. Ein Blick in die Hilfe kann sich lohnen.", "Hast du ungerundet weitergerechnet? Versuch es noch einmal."];

  // ───────────── Zustand ─────────────
  let stand = Speicher.lies(STAND, null);
  const speichern = () => Speicher.schreib(STAND, stand);

  function neuerStand(name) {
    const id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()).slice(0, 8);
    return { name, id, aufgaben: {}, satzFehler: {}, karten: [], meilensteine: [] };
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

  // Lernstand je Satz aus allen bearbeiteten Teilaufgaben
  function lernstand() {
    const s = {};
    for (const a of AUFGABEN) for (const t of a.teile) {
      const ts = stand.aufgaben[a.id]?.teile[t.id];
      if (!ts || !ts.fertig || !WIEDERHOLUNG[t.satz].istSatz) continue;
      s[t.satz] = s[t.satz] || { richtig: 0, gesamt: 0 };
      s[t.satz].gesamt++;
      if (ts.richtig) s[t.satz].richtig++;
    }
    return s;
  }

  function vorschlag() {
    const offen = AUFGABEN.filter((a) => !stand.aufgaben[a.id]?.abgeschlossen);
    if (!offen.length) return null;
    const fertig = erledigt();
    if (!fertig.length) return offen.find((a) => a.niveau === 1) || offen[0];
    const letzte = fertig.reduce((m, a) => ((stand.aufgaben[a.id].zeit || 0) > (stand.aufgaben[m.id].zeit || 0) ? a : m));
    const p = auswertung(letzte).prozent;
    const ziel = p >= 80 ? Math.min(3, letzte.niveau + 1) : p < 50 ? Math.max(1, letzte.niveau - 1) : letzte.niveau;
    return offen.find((a) => a.niveau === ziel) || offen.find((a) => a.niveau === letzte.niveau) || offen[0];
  }

  // ───────────── Ansichten ─────────────
  function zeigeStart() {
    app.innerHTML = `
      <section class="karte start">
        <h1>Körperberechnungen <span class="sterne-gross">★★★</span></h1>
        <p class="lead">18 Anwendungsaufgaben zu Kreis, Zylinder, Kegel, Pyramide und Kugel. Unterwegs brauchst du den Satz des Pythagoras, Höhen- und Kathetensatz sowie Sinus- und Kosinussatz.</p>
        <ul class="legende">
          <li><b>★</b> Basis: Einstieg, ein Rechenschritt nach dem anderen</li>
          <li><b>★★</b> Standard: mehrere Schritte kombinieren</li>
          <li><b>★★★</b> Expert: knifflige Zusammenhänge selbst entdecken</li>
        </ul>
        <form id="nameForm" class="formular" autocomplete="off">
          <label>Vorname <input id="vorname" required maxlength="30" placeholder="z. B. Lena"></label>
          <label>Erster Buchstabe deines Nachnamens <input id="kuerzel" required maxlength="2" placeholder="z. B. M" class="kurz"></label>
          <p class="klein">Deine Ergebnisse werden unter diesem Namen für deine Lehrkraft gespeichert. Bitte trage dich jedes Mal genau gleich ein.</p>
          <button class="knopf haupt" type="submit">Los geht's</button>
        </form>
      </section>`;
    document.getElementById("nameForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const v = document.getElementById("vorname").value.trim().replace(/\s+/g, " ");
      const k = document.getElementById("kuerzel").value.trim().replace(/\.$/, "").toUpperCase();
      if (!v || !k) return;
      const name = `${v.charAt(0).toUpperCase() + v.slice(1)} ${k}.`;
      if (!stand || stand.name !== name) stand = neuerStand(name);
      speichern();
      zeigeUebersicht();
    });
  }

  function zeigeUebersicht() {
    const fertig = erledigt().length;
    const ls = lernstand();
    const tipp = vorschlag();
    const schwach = Object.entries(stand.satzFehler).filter(([, n]) => n >= K.WIEDERHOLUNG_AB).map(([s]) => s);
    const offeneSendungen = Speicher.offen();

    let html = `
      <header class="kopf">
        <div><span class="klein">Angemeldet als</span><br><b>${esc(stand.name)}</b> <button class="link" id="abmelden">Abmelden</button></div>
        <button class="knopf leise" id="formeln">📐 Formeln</button>
      </header>
      ${Speicher.istDemo() ? '<p class="hinweis-demo">Demo-Modus: Die Ergebnisse werden nur auf diesem Gerät gespeichert.</p>' : ""}
      ${offeneSendungen ? `<p class="hinweis-demo">${offeneSendungen} Ergebnis(se) warten noch auf Internet und werden automatisch nachgeschickt.</p>` : ""}
      <section class="karte fortschritt">
        <div class="ring" style="--p:${(fertig / 18) * 100}"><span>${fertig}<small>/18</small></span></div>
        <div>
          <h2>${fertig === 0 ? "Willkommen!" : fertig === 18 ? "Alle Aufgaben geschafft!" : "Dein Fortschritt"}</h2>
          <p>${motivation(fertig)}</p>
          ${tipp ? `<button class="knopf haupt" data-aufgabe="${tipp.id}">Vorschlag: ${esc(tipp.titel)} ${"★".repeat(tipp.niveau)}</button>` : ""}
        </div>
      </section>`;

    if (schwach.length) {
      html += `<section class="karte wiederholen"><h3>🔁 Wiederholen lohnt sich</h3><p>Bei diesen Sätzen hat es mehrmals gehakt. Schau dir die Karte an, bevor du weitermachst:</p>
        <div class="chips">${schwach.map((s) => `<button class="chip" data-karte="${s}">${WIEDERHOLUNG[s].name}</button>`).join("")}</div></section>`;
    }

    for (const n of [1, 2, 3]) {
      html += `<h2 class="niveau-titel"><span class="sterne">${sterne(n)}</span> ${NIVEAUS[n]}</h2><div class="raster">`;
      for (const a of AUFGABEN.filter((x) => x.niveau === n)) {
        const st = stand.aufgaben[a.id];
        const ausw = st ? auswertung(a) : null;
        const status = st?.abgeschlossen ? `<span class="status ${ausw.prozent >= 50 ? "fertig" : "begonnen"}">${ausw.prozent >= 50 ? "✓" : "erledigt ·"} ${ausw.prozent} %</span>` : st && Object.keys(st.teile).length ? '<span class="status begonnen">begonnen</span>' : '<span class="status">neu</span>';
        html += `<button class="aufgabe-kachel ${st?.abgeschlossen ? "ist-fertig" : ""}" data-aufgabe="${a.id}">
          <span class="nr">${a.id}</span><span class="titel">${esc(a.titel)}</span>
          <span class="tags">${a.koerper.join(" · ")}</span>${status}</button>`;
      }
      html += `</div>`;
    }

    const eintraege = Object.entries(ls);
    if (eintraege.length) {
      html += `<section class="karte"><h3>Dein Lernstand bei den Sätzen</h3><div class="balken-liste">` +
        eintraege.map(([s, w]) => {
          const p = Math.round((100 * w.richtig) / w.gesamt);
          return `<button class="balken-zeile" data-karte="${s}"><span>${WIEDERHOLUNG[s].name}</span><span class="balken"><span style="width:${p}%" class="${p >= 75 ? "gut" : p >= 50 ? "mittel" : "schwach"}"></span></span><span class="klein">${w.richtig}/${w.gesamt}</span></button>`;
        }).join("") + `</div><p class="klein">Tippe auf einen Satz, um die Merkkarte zu öffnen.</p></section>`;
    }

    app.innerHTML = html;
    app.querySelectorAll("[data-aufgabe]").forEach((b) => b.addEventListener("click", () => zeigeAufgabe(+b.dataset.aufgabe)));
    app.querySelectorAll("[data-karte]").forEach((b) => b.addEventListener("click", () => zeigeKarte(b.dataset.karte)));
    document.getElementById("formeln").addEventListener("click", zeigeFormeln);
    document.getElementById("abmelden").addEventListener("click", abmelden);
    window.scrollTo(0, 0);
  }

  function motivation(fertig) {
    if (fertig === 0) return "Wähle eine Aufgabe. Starte ruhig mit einer ★-Aufgabe und steigere dich.";
    if (fertig < 6) return `Schon ${fertig} geschafft. Jede Aufgabe trainiert einen anderen Satz.`;
    if (fertig < 12) return "Du bist richtig im Flow! Trau dich an ein höheres Niveau.";
    if (fertig < 18) return `Nur noch ${18 - fertig} Aufgaben bis zum Ziel. Die Expert-Aufgaben warten!`;
    return "Du hast alle 18 Aufgaben bearbeitet. Wiederhole gern die, bei denen noch Punkte fehlen.";
  }

  function zeigeAufgabe(aid) {
    const a = AUFGABEN.find((x) => x.id === aid);
    const st = aufgabenStand(aid);
    speichern();

    let html = `
      <header class="kopf">
        <button class="knopf leise" id="zurueck">← Übersicht</button>
        <button class="knopf leise" id="formeln">📐 Formeln</button>
      </header>
      <article class="karte aufgabe">
        <p class="sterne gross">${sterne(a.niveau)} <span class="klein">${NIVEAUS[a.niveau]}</span></p>
        <h1>${a.id}. ${esc(a.titel)}</h1>
        <div class="aufgabe-kopf">
          <p class="einleitung">${a.einleitung}</p>
          <figure class="skizze">${SKIZZEN[a.skizze] || ""}<figcaption>Skizze (nicht maßstabsgetreu)</figcaption></figure>
        </div>
        <p class="klein">Gib Zahlen ohne Einheit ein und runde auf zwei Nachkommastellen. Rechne mit ungerundeten Zwischenergebnissen weiter. Pro Teilaufgabe hast du zwei Versuche.</p>
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

  function teilHtml(a, t) {
    const ts = teilStand(a.id, t.id);
    let rueck = "";
    if (ts.fertig && ts.richtig) rueck = `<p class="rueck gut">✓ Richtig${ts.versuche === 1 ? " im ersten Versuch" : ""}: ${esc(ts.eingaben[ts.eingaben.length - 1])} ${t.einheit}</p>`;
    else if (ts.fertig) rueck = `<p class="rueck schlecht">✗ Leider nicht richtig.${K.KONTROLLWERT_ZEIGEN ? ` Zum Weiterrechnen: Kontrollwert ≈ ${zahl(t.wert)} ${t.einheit}. Überlege, wo dein Fehler lag.` : ""}</p>`;
    else if (ts.versuche === 1) rueck = `<p class="rueck mittel">${zufall(NOCHMAL)} Du hast noch einen Versuch.</p>`;

    const hilfen = t.hilfen.slice(0, ts.hilfen).map((h, i) => `<p class="hilfe"><b>Hilfe ${i + 1}:</b> ${h}</p>`).join("");
    return `
      <div class="teil-kopf"><b>${t.id})</b> <span class="sterne klein-sterne">${sterne(t.niveau)}</span></div>
      ${TEILSKIZZEN[a.id + t.id] ? `<figure class="teil-skizze">${TEILSKIZZEN[a.id + t.id]}<figcaption>Schnittskizze</figcaption></figure>` : ""}
      <p>${t.text}</p>
      ${hilfen}
      ${ts.fertig ? "" : `
        <form class="eingabe">
          <input inputmode="decimal" autocomplete="off" aria-label="Ergebnis Teilaufgabe ${t.id}" placeholder="Ergebnis">
          <span class="einheit">${t.einheit}</span>
          <button class="knopf haupt" type="submit">Prüfen</button>
          ${ts.hilfen < t.hilfen.length ? `<button class="knopf leise hilfe-knopf" type="button">💡 Hilfe ${ts.hilfen + 1}</button>` : ""}
        </form>`}
      ${rueck}`;
  }

  function verdrahteTeil(a, t) {
    const li = document.getElementById("teil-" + t.id);
    const form = li.querySelector("form");
    if (!form) return;
    const feld = form.querySelector("input");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const wert = feld.value.trim();
      if (!wert) return;
      if (!zahlenAusEingabe(wert).length) { feld.setCustomValidity("Bitte eine Zahl eingeben, z. B. 12,97"); feld.reportValidity(); return; }
      const ts = teilStand(a.id, t.id);
      ts.versuche++;
      ts.eingaben.push(wert);
      if (istRichtig(wert, t.wert)) {
        ts.richtig = true; ts.fertig = true;
        toast(zufall(LOB));
      } else if (ts.versuche >= 2) {
        ts.fertig = true;
        satzFehler(t.satz);
      }
      speichern();
      neuZeichnen(a, t);
    });
    feld.addEventListener("input", () => feld.setCustomValidity(""));
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

  function satzFehler(satz) {
    if (!WIEDERHOLUNG[satz].istSatz) return;
    stand.satzFehler[satz] = (stand.satzFehler[satz] || 0) + 1;
    if (stand.satzFehler[satz] % K.WIEDERHOLUNG_AB === 0) setTimeout(() => zeigeKarte(satz, true), 400);
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
          ${naechste ? `<button class="knopf haupt" data-weiter="${naechste.id}">Weiter: ${esc(naechste.titel)} ${"★".repeat(naechste.niveau)}</button>` : ""}
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
      name: stand.name, schuelerId: stand.id, aufgabe: a.id, titel: a.titel, niveau: a.niveau,
      durchgang: st.durchgang || 1, punkte: ausw.punkte, max: ausw.max,
      teile: a.teile.map((t) => { const ts = st.teile[t.id]; return { id: t.id, satz: t.satz, richtig: ts.richtig, versuche: ts.versuche, hilfen: ts.hilfen, eingaben: ts.eingaben }; }),
      wiederholen: Object.entries(stand.satzFehler).filter(([, n]) => n >= K.WIEDERHOLUNG_AB).map(([s]) => s)
    };
    const r = await Speicher.senden(ergebnis);
    const el = document.getElementById("sendestatus");
    if (r.ok) { st.gesendet = true; speichern(); if (el) el.textContent = r.demo ? "✓ Ergebnis gespeichert (Demo-Modus, nur auf diesem Gerät)." : "✓ Ergebnis wurde eingetragen."; }
    else if (el) el.textContent = "Keine Verbindung. Das Ergebnis ist gemerkt und wird automatisch nachgeschickt.";
  }

  function meilensteinePruefen() {
    const fertig = erledigt();
    const ziele = [
      ["erste", fertig.length >= 1, "Erste Aufgabe geschafft! 🎉"],
      ["basis", AUFGABEN.filter((a) => a.niveau === 1).every((a) => stand.aufgaben[a.id]?.abgeschlossen), "Alle Basis-Aufgaben erledigt! Zeit für ★★."],
      ["expert", fertig.some((a) => a.niveau === 3), "Deine erste Expert-Aufgabe! 💪"],
      ["halb", fertig.length >= 9, "Halbzeit: 9 von 18 Aufgaben!"],
      ["alle", fertig.length === 18, "Alle 18 Aufgaben geschafft! Großartig! 🏆"]
    ];
    for (const [id, erreicht, text] of ziele) {
      if (erreicht && !stand.meilensteine.includes(id)) { stand.meilensteine.push(id); speichern(); toast(text, 4000); }
    }
  }

  // ───────────── Overlays ─────────────
  function zeigeKarte(satz, automatisch) {
    const w = WIEDERHOLUNG[satz];
    overlay(`
      ${automatisch ? `<p class="klein">Bei diesem Satz hat es jetzt ${stand.satzFehler[satz]}-mal nicht geklappt. Eine kurze Wiederholung hilft!</p>` : ""}
      <h2>🔁 ${w.name}</h2>
      <p class="merke">${w.merke}</p>
      ${w.tipps.length ? `<h3>Typische Stolperstellen</h3><ul>${w.tipps.map((t) => `<li>${t}</li>`).join("")}</ul>` : ""}
      ${w.buch ? `<p><b>Auftrag:</b> ${w.buch}</p>` : ""}`);
  }

  function zeigeFormeln() {
    overlay(`<h2>📐 Formeln</h2>` +
      ["kreis", "zylinder", "kegel", "pyramide", "kugel"].map((k) => `<h3>${WIEDERHOLUNG[k].name}</h3><p class="merke">${WIEDERHOLUNG[k].merke.split(" · ").join("<br>")}</p>`).join("") +
      `<h3>Sätze</h3><div class="chips">${Object.entries(WIEDERHOLUNG).filter(([, w]) => w.istSatz).map(([s, w]) => `<button class="chip" data-karte="${s}">${w.name}</button>`).join("")}</div>`);
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
