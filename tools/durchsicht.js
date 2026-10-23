// Erzeugt die Aufgabenübersicht mit Lösungen für die Durchsicht durch die Lehrkraft (Markdown).
// Aufruf: node tools/durchsicht.js [niveau]
const { AUFGABEN, WIEDERHOLUNG, NIVEAUS } = require("../js/aufgaben.js");
const nur = Number(process.argv[2]) || 0;
const zahl = (x) => x.toLocaleString("de-DE", { maximumFractionDigits: 2 });
const text = (s) => s.replace(/<sub>(.*?)<\/sub>/g, "_$1").replace(/<[^>]+>/g, "");
let md = "";
for (const a of AUFGABEN.filter((x) => !nur || x.niveau === nur)) {
  md += `### ${a.id}. ${a.titel} ${"★".repeat(a.niveau)}\n\n${text(a.einleitung)}\n\n`;
  for (const t of a.teile) {
    md += `**${t.id}) ${"★".repeat(t.niveau)}** ${text(t.text)}\n\n`;
    md += `- Lösung: **${zahl(t.wert)} ${t.einheit}** (${WIEDERHOLUNG[t.satz].name})\n`;
    md += `- Rechenweg: ${text(t.weg)}\n`;
    md += `- Hilfe 1: ${text(t.hilfen[0])}\n- Hilfe 2: ${text(t.hilfen[1])}\n\n`;
  }
}
process.stdout.write(md);
