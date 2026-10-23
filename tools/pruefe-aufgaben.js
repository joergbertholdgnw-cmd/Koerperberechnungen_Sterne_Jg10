// Prüft die Aufgabensammlung: Aufbau, Verteilung der Niveaus und eine unabhängige Zweitrechnung.
// Aufruf: node tools/pruefe-aufgaben.js
const { AUFGABEN, WIEDERHOLUNG } = require("../js/aufgaben.js");
const { zahlenAusEingabe } = require("../js/pruefen.js");

let fehler = 0;
const melde = (text) => { fehler++; console.log("FEHLER: " + text); };

// Zweitrechnung von Hand (Taschenrechnerwerte, auf 4 Stellen), unabhängig vom Code in aufgaben.js
const ERWARTET = {
  1: [11.7367, 76.8165, 94.2478],
  2: [10, 31.4159, 78.5398, 30.5398],
  3: [325.1548, 273.3186, 12.9711, 5.0289],
  4: [185.8521, 85491.96, 2574466.67, 218.5543],
  5: [75.3982, 9, 24, 14137.1669, 2827.4334],
  6: [4.8, 6, 39.2699, 9817.477],
  7: [6.6332, 10.6332, 1951.2693, 628.3185],
  8: [188.4956, 7.854, 45, 22.9610, 353.4292],
  9: [27.9258, 1977.1463, 9022.752, 33.0627, 64.7349],
  10: [15, 94.2478, 706.8583, 106.2602, 27.8203],
  11: [14.1421, 88.8577, 628.3185, 20.3961, 14.1372],
  12: [5.1962, 62.3538, 4.899, 25.4558],
  13: [16, 76.9009, 57.1485, 718.1496, 314.1905],
  14: [15, 19.822, 11.3694, 16.2372, 3138.984, 1011.1319],
  15: [27.65, 2292.7712, 40030.1736, 19.7915, 2200.70],
  16: [6.5, 0.9615, 2.3077, 36.2492, 61.6168],
  17: [13, 314.1593, 5.2, 4.8, 33.5103],
  18: [82.8192, 41.4096, 9.9216, 8.268, 2.756]
};

const anzahl = { 1: 0, 2: 0, 3: 0 };
for (const a of AUFGABEN) {
  anzahl[a.niveau]++;
  if (a.teile.length < 3) melde(`Aufgabe ${a.id}: weniger als 3 Teilaufgaben`);
  const soll = ERWARTET[a.id];
  if (!soll || soll.length !== a.teile.length) melde(`Aufgabe ${a.id}: Zweitrechnung fehlt oder Anzahl passt nicht`);
  a.teile.forEach((t, i) => {
    const name = `Aufgabe ${a.id}${t.id}`;
    if (!Number.isFinite(t.wert)) melde(`${name}: Wert ist keine Zahl`);
    if (!WIEDERHOLUNG[t.satz]) melde(`${name}: unbekannter Satz „${t.satz}“`);
    if (!t.hilfen || t.hilfen.length < 2) melde(`${name}: weniger als zwei Hilfen`);
    if (![1, 2, 3].includes(t.niveau)) melde(`${name}: Niveau fehlt`);
    if (soll && Math.abs(t.wert - soll[i]) > Math.max(1e-3 * Math.abs(soll[i]), 1e-3))
      melde(`${name}: Code ${t.wert} ≠ Zweitrechnung ${soll[i]}`);
    // Hilfen dürfen das Ergebnis nicht verraten
    const gerundet = [t.wert.toFixed(2).replace(".", ","), t.wert.toFixed(1).replace(".", ",")];
    for (const h of t.hilfen) for (const g of gerundet)
      if (Number(t.wert) >= 10 && h.includes(g)) melde(`${name}: Hilfe enthält das Ergebnis ${g}`);
  });
}
for (const n of [1, 2, 3]) if (anzahl[n] !== 6) melde(`Niveau ${n}: ${anzahl[n]} statt 6 Aufgaben`);
if (AUFGABEN.length !== 18) melde(`${AUFGABEN.length} statt 18 Aufgaben`);

// Eingabe-Erkennung
const faelle = [["12,97", 12.97], ["12.97", 12.97], ["2.574.467", 2574467], ["2 574 467", 2574467], ["85.491,96", 85491.96], ["1,5e3", 1500], ["−3,5", -3.5]];
for (const [ein, soll] of faelle) {
  const z = zahlenAusEingabe(ein);
  if (!z.some((x) => Math.abs(x - soll) < 1e-9)) melde(`Eingabe „${ein}“ wird nicht als ${soll} erkannt (${z})`);
}

console.log(fehler ? `\n${fehler} Fehler gefunden.` : `Alles in Ordnung: ${AUFGABEN.length} Aufgaben, ${AUFGABEN.reduce((s, a) => s + a.teile.length, 0)} Teilaufgaben.`);
process.exit(fehler ? 1 : 0);
