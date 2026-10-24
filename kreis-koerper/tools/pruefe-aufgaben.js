// Prüft die Aufgabensammlung: Aufbau, Hilfen, Auswahl-Teile und ob die gerundeten Werte
// vom Lösungsblatt der Lehrkraft als richtig erkannt werden.
// Aufruf: node tools/pruefe-aufgaben.js
const { AUFGABEN, WIEDERHOLUNG } = require("../js/aufgaben.js");
const { zahlenAusEingabe, istRichtig } = require("../js/pruefen.js");

let fehler = 0;
const melde = (text) => { fehler++; console.log("FEHLER: " + text); };

// Gerundete Ergebnisse so, wie Schülerinnen und Schüler sie nach Rundungsvorgabe eintippen (Lösungsblatt).
// Ergänzte Zwischenschritte der App-Fassung sind von Hand nachgerechnet.
const LOESUNGSBLATT = {
  1: { a: "223", b: "1569", c2: "7,0" },
  2: { a: "40030", b: "15,9" },
  3: { a1: "531", a2: "804", b1: "1,41", b2: "1,31", c1: "51,5" },
  4: { a: "67,0", b: "16,76", c: "6,53" },
  5: { b: "2304", c1: "21,9" },
  6: { a: "324,5", b1: "23,9", b2: "215,4", c1: "575,6" },
  7: { a: "254,5", b: "54,6", c: "68,0" },
  8: { a: "12,57", b1: "25,92", b2: "1166", c1: "65,97" },
  9: { a: "2,16", b1: "16,14", b2: "17,8", c1: "3,79" },
  10: { a: "2199", b: "51,4", c1: "69,3" },
  11: { a: "78,5", b1: "9,82", b2: "12,5", c2: "9,5" },
  12: { a: "8820", b1: "27,80", b2: "1946", c: "20,7" },
  13: { a: "696,9", b: "5,02", c: "10,2" },
  14: { a: "2827,4", b: "2500", c1: "10200" },
  15: { a1: "3,17", a2: "4,07", b: "3461", c1: "15,08", c2: "0,99", c3: "12,33" }
};
// Typische falsche Antworten, die NICHT als richtig gelten dürfen
const FALSCH = { 1: { c2: "7,6" }, 3: { c1: "23,1" }, 5: { c1: "12,5" }, 11: { c2: "6" }, 14: { b: "2800", c1: "5100" } };

for (const a of AUFGABEN) {
  if (a.teile.length < 3) melde(`Aufgabe ${a.id}: weniger als 3 Teilaufgaben`);
  if (a.teile.length > 12) melde(`Aufgabe ${a.id}: mehr als 12 Teilaufgaben (Grenze im Google-Skript)`);
  const ids = new Set();
  for (const t of a.teile) {
    const name = `Aufgabe ${a.id}${t.id}`;
    if (ids.has(t.id)) melde(`${name}: doppelte Kennung`);
    ids.add(t.id);
    if (!WIEDERHOLUNG[t.thema]) melde(`${name}: unbekanntes Thema „${t.thema}“`);
    if (!t.hilfen || t.hilfen.length < 2) melde(`${name}: weniger als zwei Hilfen`);
    if (![1, 2, 3].includes(t.afb)) melde(`${name}: AFB fehlt`);
    if (t.typ === "zahl") {
      if (!Number.isFinite(t.wert)) melde(`${name}: Wert ist keine Zahl`);
      const soll = LOESUNGSBLATT[a.id]?.[t.id];
      if (soll === undefined) melde(`${name}: Wert vom Lösungsblatt fehlt in der Prüfung`);
      else if (!istRichtig(soll, t.wert, t.abs)) melde(`${name}: „${soll}“ wird nicht als richtig erkannt (Sollwert ${t.wert})`);
      const falsch = FALSCH[a.id]?.[t.id];
      if (falsch && istRichtig(falsch, t.wert, t.abs)) melde(`${name}: falsche Antwort „${falsch}“ gilt als richtig`);
      // Hilfen dürfen das Ergebnis nicht verraten
      for (const h of t.hilfen) for (const g of [t.wert.toFixed(2), t.wert.toFixed(1), String(Math.round(t.wert))].map((x) => x.replace(".", ",")))
        if (Math.abs(t.wert) >= 10 && h.includes(g)) melde(`${name}: Hilfe enthält das Ergebnis ${g}`);
    } else if (t.typ === "auswahl") {
      if (!t.schritte?.length) melde(`${name}: Auswahl ohne Schritte`);
      for (const s of t.schritte || []) {
        if (!(s.optionen?.length >= 2)) melde(`${name}: weniger als zwei Möglichkeiten`);
        if (!(s.richtig >= 0 && s.richtig < s.optionen.length)) melde(`${name}: richtige Möglichkeit fehlt`);
      }
    } else melde(`${name}: unbekannter Typ ${t.typ}`);
  }
}
if (AUFGABEN.filter((a) => a.pflicht).map((a) => a.id).join() !== "1,3,7,10,13,15") melde("Pflichtaufgaben passen nicht zum Aufgabenblatt");

// Eingabe-Erkennung
const faelle = [["12,97", 12.97], ["12.97", 12.97], ["40.030", 40030], ["40 030", 40030], ["1,5e3", 1500], ["−3,5", -3.5]];
for (const [ein, soll] of faelle) {
  const z = zahlenAusEingabe(ein);
  if (!z.some((x) => Math.abs(x - soll) < 1e-9)) melde(`Eingabe „${ein}“ wird nicht als ${soll} erkannt (${z})`);
}

const teile = AUFGABEN.flatMap((a) => a.teile);
console.log(fehler ? `\n${fehler} Fehler gefunden.` : `Alles in Ordnung: ${AUFGABEN.length} Aufgaben, ${teile.length} Teilaufgaben (${teile.filter((t) => t.typ === "auswahl").length} mit Auswahl).`);
process.exit(fehler ? 1 : 0);
