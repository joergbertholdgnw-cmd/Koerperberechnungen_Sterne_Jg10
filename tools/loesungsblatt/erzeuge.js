// Erzeugt das Lösungsblatt als Word-Datei im GNW-Hausstil.
// Aufruf: node tools/loesungsblatt/erzeuge.js <Bilderordner> <Ausgabe.docx>
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, Header, Footer,
  AlignmentType, HeadingLevel, ShadingType, WidthType, BorderStyle, PageNumber, TabStopType, PageBreak, LineRuleType
} = require("docx");
const { AUFGABEN, WIEDERHOLUNG, NIVEAUS } = require("../../js/aufgaben.js");
const { LOESUNGEN } = require("./loesungen.js");

const [bilder, ausgabe] = process.argv.slice(2);
const NAVY = "1F3864", GRAU = "EDEFF3", SCHRIFT = "Cambria";
const SEITE = 9638; // nutzbare Breite in DXA bei 2 cm Rändern

// Texte aus der App können <sub> enthalten
function laeufe(text, extra = {}) {
  const teile = String(text).split(/(<sub>.*?<\/sub>)/g).filter(Boolean);
  return teile.map((t) => {
    const m = t.match(/^<sub>(.*)<\/sub>$/);
    return new TextRun({ text: (m ? m[1] : t).replace(/<[^>]+>/g, ""), subScript: !!m, ...extra });
  });
}

function bild(name, breiteCm) {
  const datei = path.join(bilder, name + ".png");
  const puffer = fs.readFileSync(datei);
  const w = puffer.readUInt32BE(16), h = puffer.readUInt32BE(20);
  const breite = breiteCm * 37.8; // Pixel bei 96 dpi
  return new ImageRun({ type: "png", data: puffer, transformation: { width: Math.round(breite), height: Math.round((breite * h) / w) } });
}

const kasten = (absaetze, farbe = GRAU) => new Table({
  width: { size: SEITE, type: WidthType.DXA }, columnWidths: [SEITE],
  borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
  rows: [new TableRow({ cantSplit: true, children: [new TableCell({
    width: { size: SEITE, type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill: farbe, color: "auto" },
    margins: { top: 100, bottom: 100, left: 160, right: 160 },
    borders: { left: { style: BorderStyle.SINGLE, size: 18, color: NAVY }, top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
    children: absaetze
  })] })]
});

const absatz = (kinder, opt = {}) => new Paragraph({ children: kinder, spacing: { after: 80 }, ...opt });
const sterne = (n) => "★".repeat(n) + "☆".repeat(3 - n);

const inhalt = [];

// Titel
inhalt.push(new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("Lösungsblatt: Körperberechnungen mit Sternen")] }));
inhalt.push(absatz([new TextRun({ text: "Ausführliche Lösungen zu allen 18 Aufgaben der Lernapp, mit Skizzen und vollständigen Rechenwegen", italics: true, color: "444444" })], { spacing: { after: 200 } }));
inhalt.push(kasten([
  absatz([new TextRun({ text: "Hinweise", bold: true, color: NAVY })]),
  absatz([new TextRun("Zwischenergebnisse sind hier auf zwei Nachkommastellen gerundet notiert. Gerechnet wird aber mit den ungerundeten Werten; deshalb kann die letzte Stelle leicht abweichen, wenn man mit gerundeten Zwischenwerten rechnet. Die App akzeptiert Ergebnisse mit bis zu 1 % Abweichung.")]),
  absatz([new TextRun("Taschenrechner bei Winkelaufgaben auf DEG (Gradmaß) stellen. Die Skizzen sind nicht maßstabsgetreu.")]),
  absatz([new TextRun("Sterne: ★ Basis · ★★ Standard · ★★★ Expert. Jede Teilaufgabe hat zusätzlich ihr eigenes Niveau.")])
]));

// Übersicht
const sp = [900, 3600, 2338, 2800];
const zelle = (text, breite, kopf) => new TableCell({
  width: { size: breite, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
  shading: kopf ? { type: ShadingType.CLEAR, fill: NAVY, color: "auto" } : undefined,
  children: [new Paragraph({ children: [new TextRun({ text, bold: kopf, color: kopf ? "FFFFFF" : undefined, size: 21 })] })]
});
inhalt.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Übersicht")], spacing: { before: 300 } }));
inhalt.push(new Table({
  width: { size: SEITE, type: WidthType.DXA }, columnWidths: sp,
  rows: [new TableRow({ tableHeader: true, children: ["Nr.", "Aufgabe", "Niveau", "Körper"].map((t, i) => zelle(t, sp[i], true)) }),
    ...AUFGABEN.map((a) => new TableRow({ children: [String(a.id), a.titel, `${sterne(a.niveau)} ${NIVEAUS[a.niveau]}`, a.koerper.join(", ")].map((t, i) => zelle(t, sp[i])) }))]
}));

for (const n of [1, 2, 3]) {
  inhalt.push(new Paragraph({ children: [new PageBreak()] }));
  const nr = AUFGABEN.filter((a) => a.niveau === n).map((a) => a.id);
  inhalt.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(`${"★".repeat(n)} ${NIVEAUS[n]}: Aufgaben ${nr[0]}–${nr[nr.length - 1]}`)] }));

  AUFGABEN.filter((a) => a.niveau === n).forEach((a, i) => {
    inhalt.push(new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, pageBreakBefore: i > 0, children: [new TextRun(`Aufgabe ${a.id}: ${a.titel}  `), new TextRun({ text: "★".repeat(a.niveau), color: "C99700" })] }));
    inhalt.push(kasten([absatz(laeufe(a.einleitung))]));
    inhalt.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 120 }, children: [bild("haupt_" + a.skizze, 7.5)] }));

    for (const t of a.teile) {
      const l = LOESUNGEN[a.id + t.id];
      if (!l) throw new Error("Lösung fehlt: " + a.id + t.id);
      inhalt.push(new Paragraph({ keepNext: true, spacing: { before: 200, after: 60 }, children: [
        new TextRun({ text: `${t.id}) `, bold: true, color: NAVY }), new TextRun({ text: "★".repeat(t.niveau) + "  ", color: "C99700" }), ...laeufe(t.text, { bold: true })] }));
      const teilbild = path.join(bilder, `teil_${a.id}${t.id}.png`);
      if (fs.existsSync(teilbild)) inhalt.push(new Paragraph({ keepNext: true, alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [bild(`teil_${a.id}${t.id}`, 7)] }));
      inhalt.push(absatz([new TextRun({ text: "Ansatz: ", bold: true }), new TextRun(l.ansatz)], { keepNext: true }));
      for (const zeile of l.rechnung) inhalt.push(absatz([new TextRun(zeile)], { keepNext: true, indent: { left: 567 }, spacing: { after: 40 } }));
      inhalt.push(absatz([new TextRun({ text: "Antwort: ", bold: true, color: NAVY }), new TextRun(l.antwort)], { spacing: { before: 60, after: 40 }, keepNext: true }));
      inhalt.push(absatz([new TextRun({ text: `Benötigt: ${WIEDERHOLUNG[t.satz].name}`, italics: true, size: 19, color: "666666" })], { spacing: { after: 120 } }));
    }
  });
}

const doc = new Document({
  creator: "Gymnasium Neu Wulmstorf, Fachgruppe Mathematik",
  title: "Lösungsblatt Körperberechnungen mit Sternen",
  styles: {
    default: { document: { run: { font: SCHRIFT, size: 22 }, paragraph: { spacing: { line: 276, lineRule: LineRuleType.AUTO } } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal", run: { font: SCHRIFT, size: 40, bold: true, color: NAVY }, paragraph: { spacing: { after: 80 } } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: SCHRIFT, size: 32, bold: true, color: NAVY }, paragraph: { spacing: { before: 120, after: 200 }, outlineLevel: 0, border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: NAVY, space: 4 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: SCHRIFT, size: 27, bold: true, color: NAVY }, paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 1 } }
    ]
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134, header: 567, footer: 567 } } },
    headers: { default: new Header({ children: [new Paragraph({
      tabStops: [{ type: TabStopType.RIGHT, position: SEITE }],
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: NAVY, space: 4 } },
      children: [new TextRun({ text: "Gymnasium Neu Wulmstorf · Mathematik · Jahrgang 10", size: 18, color: NAVY }), new TextRun({ text: "\tLösungsblatt Körperberechnungen", size: 18, color: NAVY })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Seite ", size: 18, color: "666666" }), new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "666666" }), new TextRun({ text: " von ", size: 18, color: "666666" }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: "666666" })] })] }) },
    children: inhalt
  }]
});

Packer.toBuffer(doc).then((b) => { fs.writeFileSync(ausgabe, b); console.log("geschrieben:", ausgabe); });
