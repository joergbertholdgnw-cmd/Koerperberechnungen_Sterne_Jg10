// Schematische Skizzen zu den Aufgaben (nicht maßstabsgetreu).
(function () {
  const svg = (inhalt, hoehe = 220) =>
    `<svg viewBox="0 0 320 ${hoehe}" class="skizze-svg" role="img" aria-label="Skizze zur Aufgabe">` +
    `<defs><marker id="pfeil" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>` +
    inhalt + `</svg>`;
  const T = (x, y, text, extra = "") => `<text x="${x}" y="${y}" ${extra}>${text}</text>`;
  const L = (x1, y1, x2, y2, klasse = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${klasse}"/>`;
  const rechterWinkel = (x, y, dx, dy) => `<path d="M${x + dx} ${y} L${x + dx} ${y + dy} L${x} ${y + dy}" class="duenn"/>`;
  const rad = (g) => (g * Math.PI) / 180;
  const punkt = (cx, cy, r, g) => [(cx + r * Math.cos(rad(g))).toFixed(1), (cy - r * Math.sin(rad(g))).toFixed(1)];

  // Kreisausschnitt mit Mittelpunkt (cx, cy), Radius r, von Winkel g1 bis g2 (mathematisch positiv)
  function ausschnitt(cx, cy, r, g1, g2, klasse) {
    const [x1, y1] = punkt(cx, cy, r, g1), [x2, y2] = punkt(cx, cy, r, g2);
    return `<path d="M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${g2 - g1 > 180 ? 1 : 0} 0 ${x2} ${y2} Z" class="${klasse}"/>`;
  }
  // Ausschnitt aus einem Kreisring zwischen den Radien ri und ra
  function ringausschnitt(cx, cy, ri, ra, g1, g2, klasse) {
    const [a1, b1] = punkt(cx, cy, ra, g1), [a2, b2] = punkt(cx, cy, ra, g2);
    const [i1, j1] = punkt(cx, cy, ri, g1), [i2, j2] = punkt(cx, cy, ri, g2);
    const gross = g2 - g1 > 180 ? 1 : 0;
    return `<path d="M${i1} ${j1} L${a1} ${b1} A${ra} ${ra} 0 ${gross} 0 ${a2} ${b2} L${i2} ${j2} A${ri} ${ri} 0 ${gross} 1 ${i1} ${j1} Z" class="${klasse}"/>`;
  }

  function quadratPyramide(kante, hoehe) {
    return svg(
      `<path d="M50 180 L210 180 L270 140 L110 140 Z" class="flaeche"/>` +
      L(50, 180, 160, 30) + L(210, 180, 160, 30) + L(270, 140, 160, 30) + L(110, 140, 160, 30, "gestrichelt") +
      L(160, 30, 160, 160, "gestrichelt") + L(160, 160, 240, 160, "gestrichelt") + L(160, 30, 240, 160, "akzent") +
      rechterWinkel(160, 150, 10, 10) +
      T(166, 110, "h") + T(205, 92, "hₛ") + T(60, 206, kante + ", " + hoehe), 215);
  }

  const SKIZZEN = {
    fahrrad: svg(
      `<circle cx="160" cy="105" r="85" class="linie"/><circle cx="160" cy="105" r="70" class="duenn"/><circle cx="160" cy="105" r="5" class="punkt"/>` +
      L(75, 105, 245, 105, "akzent") + L(40, 195, 280, 195, "duenn") +
      T(130, 98, "d = 71 cm") + `<path d="M120 200 L200 200" class="duenn" marker-end="url(#pfeil)"/>` + T(118, 215, "eine Umdrehung = ?"), 222),
    seil: svg(
      `<circle cx="160" cy="110" r="70" class="flaeche"/><circle cx="160" cy="110" r="88" class="akzent gestrichelt"/>` +
      L(160, 110, 230, 110, "duenn") + L(230, 110, 248, 110, "akzent") +
      T(175, 104, "r") + T(250, 100, "x = ?") + T(10, 18, "Seil: u + 1 m") + T(135, 115, "Erde")),
    pizza: svg(
      `<circle cx="95" cy="110" r="65" class="flaeche-hell"/><circle cx="230" cy="110" r="80" class="flaeche-hell"/>` +
      L(30, 110, 160, 110, "gestrichelt") + L(150, 110, 310, 110, "gestrichelt") +
      T(65, 100, "26 cm") + T(205, 100, "32 cm") + T(70, 205, "7,50 €") + T(205, 205, "10,50 €")),
    sprenger: svg(
      ausschnitt(160, 170, 140, 30, 150, "flaeche-gruen") + `<circle cx="160" cy="170" r="5" class="punkt"/>` +
      `<path d="M190 155 A34 34 0 0 0 130 155" class="duenn"/>` + T(146, 145, "120°") + T(236, 140, "r = 8 m") + T(140, 22, "Bogen b")),
    wischer: svg(
      ringausschnitt(160, 190, 26, 130, 35, 145, "flaeche-wasser") +
      L(160, 190, ...punkt(160, 190, 130, 90), "dick") + `<circle cx="160" cy="190" r="5" class="punkt"/>` +
      `<path d="M181 175 A26 26 0 0 0 139 175" class="duenn"/>` +
      T(166, 75, "50 cm") + T(166, 178, "10 cm") + T(60, 108, "110°") + T(146, 212, "Drehpunkt"), 222),
    dose: svg(
      `<ellipse cx="160" cy="40" rx="55" ry="13" class="flaeche"/>` +
      L(105, 40, 105, 185) + L(215, 40, 215, 185) +
      `<path d="M105 185 A55 13 0 0 0 215 185" class="linie"/>` +
      `<path d="M105 70 L105 160 A55 13 0 0 0 215 160 L215 70 A55 13 0 0 1 105 70 Z" class="flaeche-hell"/>` +
      T(140, 210, "d = 7,3 cm") + T(222, 115, "h = 10,5 cm") + T(128, 120, "Etikett") + T(60, 115, "9 cm")),
    tonne: svg(
      `<ellipse cx="160" cy="35" rx="70" ry="15" class="linie"/>` + L(90, 35, 90, 190) + L(230, 35, 230, 190) +
      `<path d="M90 110 L90 190 A70 15 0 0 0 230 190 L230 110 A70 15 0 0 1 90 110 Z" class="flaeche-wasser"/>` +
      `<ellipse cx="160" cy="110" rx="70" ry="15" class="duenn"/>` +
      L(90, 35, 230, 35, "gestrichelt") + T(130, 14, "d = 60 cm") + T(238, 115, "h = 90 cm"), 215),
    brunnen: svg(
      `<circle cx="160" cy="110" r="95" class="flaeche"/><circle cx="160" cy="110" r="54" class="flaeche-wasser"/>` +
      L(106, 110, 214, 110, "gestrichelt") + L(214, 110, 255, 110, "akzent") +
      T(140, 104, "4 m") + T(218, 102, "1,5 m") + T(130, 190, "Weg")),
    zelt: quadratPyramide("a = 2,4 m", "h = 1,8 m"),
    schultuete: svg(
      `<ellipse cx="160" cy="35" rx="45" ry="11" class="flaeche"/>` + L(115, 35, 160, 205) + L(205, 35, 160, 205) +
      L(160, 35, 160, 205, "gestrichelt") + L(160, 35, 205, 35, "gestrichelt") + rechterWinkel(160, 35, 8, 8) +
      T(170, 28, "r") + T(195, 125, "s = 70 cm") + T(140, 125, "h") + T(120, 18, "d = 20 cm"), 220),
    waffel: svg(
      `<path d="M115 40 L160 200 L205 40 Z" class="flaeche"/>` + `<path d="M137.5 120 L160 200 L182.5 120 Z" class="flaeche-hell"/>` +
      `<ellipse cx="160" cy="40" rx="45" ry="10" class="linie"/>` + L(137.5, 120, 182.5, 120, "akzent") +
      L(160, 40, 160, 200, "gestrichelt") + T(130, 26, "d = 5 cm") + T(212, 80, "h = 12 cm") + T(166, 165, "Eis") + T(190, 116, "halbe Höhe", 'class="klein"'), 215),
    louvre: quadratPyramide("a ≈ 35 m", "h = 21,6 m"),
    kugel: svg(
      `<circle cx="160" cy="110" r="85" class="flaeche"/><ellipse cx="160" cy="110" rx="85" ry="22" class="gestrichelt"/>` +
      L(75, 110, 245, 110, "akzent") + `<circle cx="160" cy="110" r="4" class="punkt"/>` + T(128, 100, "d = 11 cm") + T(110, 212, "Gusseisen: 7,2 g pro cm³"), 220),
    disco: (() => {
      let g = `<circle cx="160" cy="110" r="85" class="flaeche-hell"/>`;
      for (let y = 40; y <= 180; y += 14) {
        const rx = Math.sqrt(Math.max(0, 85 ** 2 - (y - 110) ** 2));
        g += L((160 - rx).toFixed(1), y, (160 + rx).toFixed(1), y, "duenn");
      }
      for (const rx of [30, 60]) g += `<ellipse cx="160" cy="110" rx="${rx}" ry="85" class="duenn"/>`;
      return svg(g + L(160, 25, 160, 5, "duenn") + T(205, 210, "d = 30 cm"), 220);
    })(),
    tank: svg(
      `<path d="M90 70 L230 70 A40 40 0 0 1 230 150 L90 150 A40 40 0 0 1 90 70 Z" class="flaeche"/>` +
      L(90, 70, 90, 150, "gestrichelt") + L(230, 70, 230, 150, "gestrichelt") +
      `<path d="M50 175 L270 175" class="duenn" marker-start="url(#pfeil)" marker-end="url(#pfeil)"/>` + T(118, 195, "Länge 4,0 m") +
      `<path d="M285 70 L285 150" class="duenn" marker-start="url(#pfeil)" marker-end="url(#pfeil)"/>` + T(250, 60, "d = 1,2 m") +
      T(125, 115, "Zylinder"), 210)
  };

  window.SKIZZEN = SKIZZEN;
})();
