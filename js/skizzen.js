// Schematische Skizzen zu den Aufgaben (nicht maßstabsgetreu).
(function () {
  const svg = (inhalt, hoehe = 220) =>
    `<svg viewBox="0 0 320 ${hoehe}" class="skizze-svg" role="img" aria-label="Skizze zur Aufgabe">` +
    `<defs><marker id="pfeil" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>` +
    inhalt + `</svg>`;
  const T = (x, y, text, extra = "") => `<text x="${x}" y="${y}" ${extra}>${text}</text>`;
  const L = (x1, y1, x2, y2, klasse = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${klasse}"/>`;
  const rechterWinkel = (x, y, dx, dy) => `<path d="M${x + dx} ${y} L${x + dx} ${y + dy} L${x} ${y + dy}" class="duenn"/>`;

  const SKIZZEN = {
    eistuete: svg(
      `<ellipse cx="160" cy="40" rx="60" ry="14" class="flaeche"/>` +
      L(100, 40, 160, 200) + L(220, 40, 160, 200) +
      L(160, 40, 160, 200, "gestrichelt") + L(160, 40, 220, 40, "gestrichelt") +
      rechterWinkel(160, 40, 10, 10) +
      T(185, 33, "r") + T(198, 130, "s = 12 cm") + T(140, 130, "h") + T(116, 20, "d = 5 cm")),
    terrasse: svg(
      `<circle cx="160" cy="110" r="95" class="flaeche-gruen"/>` +
      `<rect x="84" y="53" width="152" height="114" class="flaeche-hell"/>` +
      L(84, 167, 236, 53, "gestrichelt") +
      T(145, 185, "8 m") + T(206, 115, "6 m") + T(150, 100, "d"), 220),
    dose: svg(
      `<ellipse cx="160" cy="40" rx="50" ry="12" class="flaeche"/>` +
      L(110, 40, 110, 185) + L(210, 40, 210, 185) +
      `<path d="M110 185 A50 12 0 0 0 210 185" class="linie"/>` +
      L(110, 185, 210, 40, "akzent") + L(210, 40, 232, 8, "akzent gestrichelt") +
      T(150, 210, "d = 6 cm") + T(218, 120, "h = 11,5 cm") + T(236, 18, "?")),
    pyramide_cheops: pyramide("230 m", "146 m"),
    pyramide_louvre: pyramide("35,4 m", "21,6 m"),
    medizinball: svg(
      `<circle cx="160" cy="80" r="66" class="flaeche"/>` +
      `<path d="M106 118 L118 205 L202 205 L214 118" class="linie"/>` +
      L(100, 118, 220, 118, "dick") +
      L(160, 80, 214, 118, "gestrichelt") + L(160, 80, 160, 118, "gestrichelt") +
      T(165, 105, "?") + T(190, 92, "15") + T(176, 135, "12") + T(150, 76, "M"), 220),
    tunnel: svg(
      `<path d="M40 190 A120 120 0 0 1 280 190 Z" class="flaeche"/>` +
      L(126, 190, 126, 82, "gestrichelt") + L(40, 190, 126, 82, "akzent") + L(126, 82, 280, 190, "duenn") +
      rechterWinkel(126, 180, 10, 10).replace("M136 180 L136 190 L126 190", "M126 180 L136 180 L136 190") +
      T(30, 208, "A") + T(278, 208, "B") + T(120, 208, "M") + T(122, 74, "D") +
      T(70, 205, "3,6 m") + T(190, 205, "6,4 m") + T(132, 140, "h") + T(150, 30, "Breite 10 m")),
    zirkus: svg(
      `<ellipse cx="160" cy="185" rx="100" ry="16" class="flaeche"/>` +
      `<path d="M60 120 L60 185 M260 120 L260 185" class="linie"/>` +
      `<path d="M60 120 L160 30 L260 120" class="flaeche"/>` +
      `<ellipse cx="160" cy="120" rx="100" ry="16" class="linie"/>` +
      L(160, 30, 160, 120, "gestrichelt") + L(160, 120, 260, 120, "gestrichelt") +
      T(205, 70, "s = 12 m") + T(195, 138, "r = 10 m") + T(266, 158, "4 m") + T(140, 82, "h")),
    riesenrad: (() => {
      let g = `<circle cx="160" cy="110" r="90" class="linie"/>`;
      for (let i = 0; i < 24; i++) {
        const w = (i * 15 - 90) * Math.PI / 180, x = 160 + 90 * Math.cos(w), y = 110 + 90 * Math.sin(w);
        g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i === 0 || i === 3 ? 5 : 3}" class="${i === 0 || i === 3 ? "punkt-akzent" : "punkt"}"/>`;
      }
      const x4 = 160 + 90 * Math.cos(-45 * Math.PI / 180), y4 = 110 + 90 * Math.sin(-45 * Math.PI / 180);
      g += L(160, 110, 160, 20, "gestrichelt") + L(160, 110, x4.toFixed(1), y4.toFixed(1), "gestrichelt") + L(160, 20, x4.toFixed(1), y4.toFixed(1), "akzent");
      g += T(150, 14, "1") + T(x4 + 8, y4 - 4, "4") + T(130, 120, "M") + T(60, 214, "d = 60 m, 24 Gondeln");
      return svg(g, 222);
    })(),
    teller: svg(
      `<path d="M40 150 A150 150 0 0 1 280 150" class="dick"/>` +
      L(40, 150, 280, 150, "akzent") + L(160, 150, 160, 90, "gestrichelt") +
      `<circle cx="160" cy="240" r="3" class="punkt"/>` + L(160, 240, 40, 150, "duenn gestrichelt") + L(160, 240, 160, 150, "duenn gestrichelt") +
      T(100, 168, "24 cm") + T(166, 128, "6 cm") + T(168, 246, "M") + T(84, 206, "r"), 255),
    goldfisch: svg(
      `<path d="M117 35 A90 90 0 1 0 203 35" class="linie"/>` +
      `<path d="M74 150 A90 90 0 0 0 246 150 Z" class="flaeche-wasser"/>` +
      L(117, 35, 203, 35, "gestrichelt") + L(160, 25, 160, 205, "gestrichelt") +
      T(254, 154, "10 cm") + T(212, 30, "26 cm") + T(110, 145, "ρ = ?") + T(166, 120, "d = 30 cm")),
    tetraeder: svg(
      `<path d="M60 180 L250 180 L180 130 Z" class="flaeche-hell"/>` +
      `<path d="M60 180 L160 30 L250 180 M160 30 L180 130" class="linie"/>` +
      L(60, 180, 180, 130, "gestrichelt") + L(160, 30, 163, 163, "gestrichelt akzent") +
      T(140, 200, "a = 6 cm") + T(168, 110, "h") + T(166, 172, "S")),
    schornstein: svg(
      `<rect x="262" y="30" width="24" height="170" class="flaeche"/>` +
      L(20, 200, 300, 200) + L(40, 200, 274, 30, "duenn") + L(150, 200, 274, 30, "duenn") +
      `<path d="M78 200 A38 38 0 0 0 72 178" class="duenn"/><path d="M185 200 A35 35 0 0 0 173 175" class="duenn"/>` +
      T(36, 216, "A") + T(146, 216, "B") + T(270, 216, "F") + T(272, 22, "S") +
      T(84, 192, "32°") + T(190, 192, "48°") + T(80, 214, "40 m")),
    streusalz: svg(
      `<path d="M150 190 L230 110 L310 190 Z" class="flaeche-hell"/>` +
      L(10, 190, 315, 190) + L(30, 190, 230, 110, "duenn") + L(230, 110, 230, 190, "gestrichelt") +
      `<path d="M66 190 A36 36 0 0 0 64 178" class="duenn"/><path d="M175 190 A25 25 0 0 0 168 172" class="duenn"/>` +
      T(24, 208, "L") + T(144, 208, "R") + T(226, 102, "T") + T(70, 186, "20°") + T(178, 186, "35°") + T(80, 208, "15 m") + T(180, 140, "s")),
    horizont: svg(
      `<circle cx="100" cy="400" r="220" class="flaeche-gruen"/>` +
      L(100, 400, 100, 90, "gestrichelt") + L(100, 90, 255, 244, "akzent") + L(100, 400, 255, 244, "gestrichelt") +
      `<circle cx="100" cy="90" r="5" class="punkt-akzent"/><circle cx="255" cy="244" r="4" class="punkt"/>` +
      `<path d="M243 232 L232 243 L244 255" class="duenn"/>` +
      T(108, 86, "Auge") + T(230, 228, "Horizont", 'text-anchor="end"') + T(180, 160, "d") + T(106, 140, "Höhe") + T(106, 250, "R") + T(170, 330, "R") + T(10, 30, "Erdmittelpunkt liegt weit unten", 'class="klein"'), 260),
    kreisel: svg(
      `<path d="M160 20 L96 47 L160 200 L224 47 Z" class="flaeche"/>` +
      `<ellipse cx="160" cy="47" rx="64" ry="10" class="linie"/>` +
      L(160, 20, 160, 200, "gestrichelt") + L(160, 47, 224, 47, "gestrichelt") +
      `<path d="M217 44 L213 54 L220 57" class="duenn"/>` +
      T(196, 26, "s₁ = 2,5 cm") + T(200, 130, "s₂ = 6 cm") + T(186, 64, "r") + T(140, 120, "c")),
    cocktail: svg(
      `<path d="M60 30 L160 200 L260 30" class="linie"/>` + `<ellipse cx="160" cy="30" rx="100" ry="10" class="linie"/>` +
      `<circle cx="160" cy="139" r="22" class="flaeche-wasser"/>` +
      L(160, 30, 160, 200, "gestrichelt") + L(160, 139, 179, 128, "duenn") +
      T(184, 22, "r = 5 cm") + T(166, 100, "12 cm") + T(140, 144, "M") + T(180, 146, "2 cm")),
    zelt: svg(
      `<path d="M40 190 L240 190 L290 140 Z" class="flaeche-hell"/>` +
      `<path d="M40 190 L180 30 L240 190 M180 30 L290 140" class="linie"/>` +
      L(40, 190, 290, 140, "gestrichelt") + L(180, 30, 190, 170, "gestrichelt akzent") +
      T(130, 208, "6 m") + T(266, 178, "4 m") + T(150, 160, "5 m") + T(192, 110, "2,5 m"))
  };

  function pyramide(grund, hoehe) {
    return svg(
      `<path d="M50 180 L210 180 L270 140 L110 140 Z" class="flaeche-hell"/>` +
      `<path d="M50 180 L160 30 L210 180 M160 30 L270 140" class="linie"/>` +
      L(160, 30, 110, 140, "gestrichelt") + L(160, 30, 160, 160, "gestrichelt") + L(160, 160, 240, 160, "gestrichelt") + L(160, 30, 240, 160, "akzent") +
      T(110, 200, "a = " + grund) + T(166, 130, "h = " + hoehe) + T(214, 84, "h") + `<text x="223" y="88" class="klein">s</text>`);
  }

  window.SKIZZEN = SKIZZEN;
})();
