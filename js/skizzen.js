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


  // ───────────── Schnittskizzen zu einzelnen Teilaufgaben (★★ und ★★★) ─────────────
  // Sie zeigen das Dreieck, in dem gerechnet wird, mit den bekannten Größen. Das Ergebnis steht nie darin.
  function dreieck(o) {
    const P = o.punkte;
    const sx = (P[0][0] + P[1][0] + P[2][0]) / 3, sy = (P[0][1] + P[1][1] + P[2][1]) / 3;
    const weg = (x, y, d) => { const dx = x - sx, dy = y - sy, l = Math.hypot(dx, dy) || 1; return [x + (dx / l) * d, y + (dy / l) * d]; };
    let g = `<path d="M${P[0]}L${P[1]}L${P[2]}Z" class="flaeche-hell"/>`;
    (o.seiten || []).forEach((text, i) => {
      const a = P[i], b = P[(i + 1) % 3];
      if ((o.hervor || []).includes(i)) g += L(a[0], a[1], b[0], b[1], "akzent");
      if (!text) return;
      // Beschriftung senkrecht zur Seite nach außen schieben
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      let nx = -(b[1] - a[1]) / l, ny = (b[0] - a[0]) / l;
      if (nx * (mx - sx) + ny * (my - sy) < 0) { nx = -nx; ny = -ny; }
      const x = mx + nx * (8 + Math.abs(nx) * text.length * 3.2), y = my + ny * 14;
      g += T(x.toFixed(0), (y + 5).toFixed(0), text, 'text-anchor="middle"');
    });
    (o.namen || []).forEach((n, i) => { if (!n) return; const [x, y] = weg(P[i][0], P[i][1], 14); g += T(x.toFixed(0), (y + 5).toFixed(0), n, 'text-anchor="middle" class="name"'); });
    (o.winkel || []).forEach((w, i) => {
      if (!w) return;
      const [x, y] = weg(P[i][0], P[i][1], -30);
      g += T(x.toFixed(0), (y + 5).toFixed(0), w, 'text-anchor="middle" class="winkel"');
    });
    if (o.rechts !== undefined) {
      const v = P[o.rechts], a = P[(o.rechts + 1) % 3], b = P[(o.rechts + 2) % 3];
      const e = (q) => { const l = Math.hypot(q[0] - v[0], q[1] - v[1]); return [(q[0] - v[0]) / l * 12, (q[1] - v[1]) / l * 12]; };
      const [ax, ay] = e(a), [bx, by] = e(b);
      g += `<path d="M${v[0] + ax} ${v[1] + ay} L${v[0] + ax + bx} ${v[1] + ay + by} L${v[0] + bx} ${v[1] + by}" class="duenn"/>`;
    }
    return svg(g + (o.extra || ""), o.hoehe || 220);
  }

  const TEILSKIZZEN = {
    "7a": dreieck({ punkte: [[70, 30], [70, 180], [260, 180]], namen: ["Spitze", "", "Rand"], seiten: ["h = ?", "r = 10 m", "s = 12 m"], hervor: [0], rechts: 1 }),
    "8d": dreieck({ punkte: [[160, 195], [160, 45], [266, 89]], namen: ["M", "Gondel 1", "Gondel 4"], seiten: ["30 m", "?", "30 m"], winkel: ["aus c"], hervor: [1] }),
    "9a": dreieck({ punkte: [[110, 30], [110, 185], [270, 185]], namen: ["Spitze", "Fußpunkt", "Kantenmitte"], seiten: ["h = 21,6 m", "17,7 m", "hₛ = ?"], hervor: [2], rechts: 1 }),
    "9d": dreieck({ punkte: [[110, 30], [110, 185], [240, 185]], namen: ["Spitze", "Kantenmitte", "Ecke"], seiten: ["hₛ (aus a)", "17,7 m", "s = ?"], hervor: [2], rechts: 1 }),
    "9e": dreieck({ punkte: [[160, 35], [50, 190], [270, 190]], namen: ["Spitze", "", ""], seiten: ["s", "35,4 m", "s"], winkel: ["γ = ?"] }),
    "10a": dreieck({ punkte: [[160, 205], [160, 85], [290, 85]], namen: ["M", "", "Ende"], seiten: ["r − 6", "12 cm", "r"], hervor: [2], rechts: 1, hoehe: 225,
      extra: `<path d="M30 85 A160 160 0 0 1 290 85" class="dick"/>` + L(160, 85, 160, 45, "gestrichelt") + T(166, 66, "6 cm") }),
    "11a": kugelschnitt(10, "10 cm", "20 cm"),
    "11d": kugelschnitt(26, "26 cm", "4 cm"),
    "12a": dreieck({ punkte: [[60, 190], [260, 190], [160, 17]], seiten: ["", "6 cm", "6 cm"], hoehe: 215,
      extra: L(160, 17, 160, 190, "akzent") + T(166, 120, "h = ?") + T(105, 207, "3 cm") + T(200, 207, "3 cm") }),
    "12c": dreieck({ punkte: [[50, 190], [170, 190], [170, 33]], namen: ["Ecke", "S", "Spitze"], seiten: ["⅔ · h (aus a)", "h = ?", "Kante 6 cm"], hervor: [1], rechts: 1 }),
    "13b": dreieck({ punkte: [[20, 190], [140, 190], [295, 30]], namen: ["A", "B", "S"], seiten: ["40 m", "? ", ""], winkel: ["32°", "", "aus a"], hervor: [1] }),
    "13c": dreieck({ punkte: [[50, 190], [250, 190], [250, 30]], namen: ["B", "F", "S"], seiten: ["", "h = ?", "BS (aus b)"], winkel: ["48°"], hervor: [1], rechts: 1 }),
    "14b": dreieck({ punkte: [[20, 190], [150, 190], [295, 55]], namen: ["L", "R", "T"], seiten: ["15 m", "s = ?", ""], winkel: ["20°", "", "aus a"], hervor: [1] }),
    "14c": dreieck({ punkte: [[40, 190], [260, 190], [260, 45]], namen: ["R", "Mitte", "T"], seiten: ["r", "h", "s (aus b)"], winkel: ["35°"], rechts: 1 }),
    "15a": dreieck({ punkte: [[110, 205], [110, 30], [190, 144]], namen: ["Erdmittelpunkt", "Auge", "Horizont"], seiten: ["R + Höhe", "d = ?", "R"], hervor: [1], rechts: 2, hoehe: 225 }),
    "15d": dreieck({ punkte: [[110, 205], [110, 30], [190, 144]], namen: ["Erdmittelpunkt", "ISS", "Horizont"], seiten: ["6771 km", "d (aus b)", "6371 km"], winkel: ["α = ?"], rechts: 2, hoehe: 225 }),
    "16b": dreieck({ punkte: [[160, 20], [245, 80], [160, 200]], namen: ["Spitze oben", "Rand", "Spitze unten"], seiten: ["s₁ = 2,5 cm", "s₂ = 6 cm", ""], rechts: 1,
      extra: L(160, 80, 245, 80, "gestrichelt akzent") + T(196, 96, "r") + T(146, 55, "p") + T(146, 145, "q") + T(120, 110, "c") + L(160, 20, 160, 200, "gestrichelt") }),
    "17c": svg(`<path d="M89 30 L160 200 L231 30" class="linie"/>` + L(89, 30, 231, 30) +
      `<circle cx="160" cy="126" r="28" class="flaeche-wasser"/>` + L(160, 30, 160, 200, "gestrichelt") +
      `<path d="M160 200 L160 126 L186 137 Z" class="flaeche-hell"/>` + L(160, 126, 186, 137, "akzent") + L(160, 126, 160, 200, "akzent") +
      `<path d="M181 135 L184 128 L191 131" class="duenn"/>` +
      T(118, 24, "5 cm") + T(206, 110, "s (aus a)") + T(132, 172, "?") + T(196, 150, "2 cm") + T(146, 122, "M") + T(166, 214, "Spitze"), 225),
    "18a": dreieck({ punkte: [[40, 180], [280, 180], [190, 48]], namen: ["A", "B", "C"], seiten: ["c = 6 m", "a = 4 m", "b = 5 m"], winkel: ["α", "", "γ"] })
  };

  function kugelschnitt(hoehe, unten, oben) {
    const y = 205 - (hoehe / 30) * 180, rx = Math.sqrt(90 * 90 - (y - 115) ** 2);
    const px = 160 - rx;
    return svg(`<circle cx="160" cy="115" r="90" class="linie"/>` +
      `<path d="M160 25 L${px.toFixed(1)} ${y.toFixed(1)} L160 205 Z" class="flaeche-hell"/>` +
      L(160, 25, 160, 205, "gestrichelt") + L(px, y, 160, y, "akzent") +
      T(px - 16, y + 5, "P") + T(((px + 160) / 2 - 16).toFixed(0), (y + 20).toFixed(0), "ρ = ?") +
      T(168, (y + 205) / 2 + 5, unten) + T(168, (y + 25) / 2 + 5, oben) + T(212, 24, "d = 30 cm"), 225);
  }

  window.TEILSKIZZEN = TEILSKIZZEN;
  window.SKIZZEN = SKIZZEN;
})();
