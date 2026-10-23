// Erkennt Zahleneingaben in deutscher und englischer Schreibweise und vergleicht sie mit dem Sollwert.
(function () {
  const TOLERANZ = 0.01; // ±1 % wegen gerundeter Zwischenergebnisse

  // Gibt alle plausiblen Lesarten einer Eingabe zurück, z. B. „2.574“ als 2574 und als 2,574.
  function zahlenAusEingabe(eingabe) {
    let s = String(eingabe).trim().replace(/[−–]/g, "-").replace(/\s+/g, "").replace(/['’]/g, "");
    s = s.replace(/[a-zA-Z²³°%]+$/g, "").replace(/(e)(?=-?\d)/i, "e");
    if (!s) return [];
    const lesarten = new Set();
    const versuche = (t) => { const z = Number(t); if (t !== "" && Number.isFinite(z)) lesarten.add(z); };
    if (s.includes(",") && s.includes(".")) {
      // Das letzte Zeichen von beiden ist das Dezimaltrennzeichen
      if (s.lastIndexOf(",") > s.lastIndexOf(".")) versuche(s.replace(/\./g, "").replace(",", "."));
      else versuche(s.replace(/,/g, ""));
    } else if (s.includes(",")) {
      if ((s.match(/,/g) || []).length > 1) versuche(s.replace(/,/g, ""));
      else versuche(s.replace(",", "."));
    } else if ((s.match(/\./g) || []).length > 1) {
      versuche(s.replace(/\./g, ""));
    } else {
      versuche(s);
      if (/^-?\d{1,3}\.\d{3}$/.test(s)) versuche(s.replace(".", "")); // Tausenderpunkt
    }
    return [...lesarten];
  }

  function istRichtig(eingabe, sollwert) {
    const grenze = Math.max(Math.abs(sollwert) * TOLERANZ, 0.005);
    return zahlenAusEingabe(eingabe).some((z) => Math.abs(z - sollwert) <= grenze);
  }

  const ziel = typeof window !== "undefined" ? window : globalThis;
  ziel.zahlenAusEingabe = zahlenAusEingabe;
  ziel.istRichtig = istRichtig;
  if (typeof module !== "undefined") module.exports = { zahlenAusEingabe, istRichtig, TOLERANZ };
})();
