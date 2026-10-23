// Verbindung zum Google-Skript. Ohne SKRIPT_URL läuft alles im Demo-Modus auf diesem Gerät.
(function () {
  const WARTESCHLANGE = "kb_warteschlange";
  const DEMO = "kb_demo_ergebnisse";

  const lies = (schluessel, ersatz) => { try { return JSON.parse(localStorage.getItem(schluessel)) ?? ersatz; } catch { return ersatz; } };
  const schreib = (schluessel, wert) => { try { localStorage.setItem(schluessel, JSON.stringify(wert)); } catch { /* Speicher voll oder gesperrt */ } };
  const url = () => (window.KONFIG && window.KONFIG.SKRIPT_URL) || "";

  // Fester Geräteschlüssel; bleibt beim Abmelden erhalten, damit Name und Gerät verbunden bleiben
  const GERAET = "kb_geraet";
  function geraet() {
    let g = lies(GERAET, "");
    if (!/^[a-z0-9-]{20,64}$/i.test(g)) {
      const zufall = () => (crypto.randomUUID ? crypto.randomUUID() : Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join(""));
      g = zufall().replace(/-/g, "") + zufall().replace(/-/g, "").slice(0, 8);
      schreib(GERAET, g);
    }
    return g;
  }

  async function anfrage(daten) {
    // text/plain vermeidet die CORS-Vorabanfrage, die Google Apps Script nicht beantwortet
    const antwort = await fetch(url(), { method: "POST", body: JSON.stringify(daten), headers: { "Content-Type": "text/plain;charset=utf-8" } });
    if (!antwort.ok) throw new Error("HTTP " + antwort.status);
    const text = await antwort.text();
    try { return JSON.parse(text); }
    catch { throw new Error("Das Skript antwortet mit einer Webseite statt mit Daten. Meist verlangt es eine Google-Anmeldung: Bei der Bereitstellung muss „Zugriff: Jeder“ eingestellt sein."); }
  }

  async function senden(ergebnis) {
    if (!url()) {
      const liste = lies(DEMO, []);
      liste.push({ ...ergebnis, zeit: new Date().toISOString() });
      schreib(DEMO, liste);
      return { ok: true, demo: true };
    }
    try {
      const a = await anfrage({ aktion: "speichern", ergebnis, geraet: geraet() });
      if (a.gebunden) return { ok: false, gebunden: true, fehler: a.fehler };
      if (!a.ok) throw new Error(a.fehler || "unbekannt");
      return { ok: true };
    } catch (e) {
      const schlange = lies(WARTESCHLANGE, []);
      schlange.push(ergebnis);
      schreib(WARTESCHLANGE, schlange);
      return { ok: false, gemerkt: true };
    }
  }

  // Ergebnisse, die offline entstanden sind, später nachschicken
  async function nachsenden() {
    if (!url()) return 0;
    const schlange = lies(WARTESCHLANGE, []);
    const rest = [];
    for (const ergebnis of schlange) {
      // Abgelehnt wegen fremdem Gerät: nicht endlos neu versuchen
      try { const a = await anfrage({ aktion: "speichern", ergebnis, geraet: geraet() }); if (!a.ok && !a.gebunden) rest.push(ergebnis); }
      catch { rest.push(ergebnis); }
    }
    schreib(WARTESCHLANGE, rest);
    return schlange.length - rest.length;
  }

  const offen = () => lies(WARTESCHLANGE, []).length;

  async function holen(passwort) {
    if (!url()) return { ok: true, demo: true, ergebnisse: lies(DEMO, []) };
    return anfrage({ aktion: "liste", passwort });
  }

  // Name an dieses Gerät binden (oder prüfen) und die eigenen Ergebnisse holen, auch noch nicht gesendete
  async function anmelden(name) {
    const gleich = (e) => e.name.trim().toLowerCase() === name.trim().toLowerCase();
    const wartend = lies(WARTESCHLANGE, []).filter(gleich);
    if (!url()) return { ok: true, demo: true, ergebnisse: lies(DEMO, []).filter(gleich) };
    const a = await anfrage({ aktion: "anmelden", name, geraet: geraet() });
    if (a.gebunden) return { ok: false, gebunden: true, fehler: a.fehler };
    if (!a.ok) throw new Error(a.fehler || "unbekannt");
    return { ok: true, ergebnisse: a.ergebnisse.concat(wartend) };
  }

  async function freigeben(passwort, name) {
    if (!url()) return { ok: true, demo: true };
    return anfrage({ aktion: "freigeben", passwort, name });
  }

  async function zuruecksetzen(passwort, archivieren) {
    if (!url()) { schreib(DEMO, []); return { ok: true, demo: true }; }
    return anfrage({ aktion: "zuruecksetzen", passwort, archivieren });
  }

  window.Speicher = { senden, nachsenden, offen, holen, anmelden, freigeben, zuruecksetzen, lies, schreib, istDemo: () => !url() };
})();
