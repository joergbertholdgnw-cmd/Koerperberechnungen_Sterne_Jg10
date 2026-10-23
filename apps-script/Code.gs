/**
 * Google-Apps-Script für die Lernapp „Körperberechnungen mit Sternen“.
 * Speichert die Ergebnisse in der Tabelle, an die dieses Skript gebunden ist.
 *
 * Das Admin-Passwort steht NICHT in diesem Code, sondern in den Skripteigenschaften:
 * Projekteinstellungen → Skripteigenschaften → Eigenschaft „ADMIN_PASSWORT“.
 */
const BLATT = "Ergebnisse";
const KOPF = ["Zeit", "Name", "Geraet", "Aufgabe", "Titel", "Niveau", "Durchgang", "Punkte", "Max", "Prozent", "Teilaufgaben", "Wiederholen"];
const GERAETE = "Geraete"; // Bindung Name ↔ Gerät, damit niemand unter fremdem Namen einträgt
const GERAETE_KOPF = ["NameSchluessel", "Name", "Geraet", "Seit"];
const MAX_FEHLVERSUCHE = 5; // danach 10 Minuten Sperre für Passworteingaben

function doGet() {
  return ContentService.createTextOutput("Das Skript für die Lernapp läuft.");
}

function doPost(e) {
  let antwort;
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.aktion === "speichern") antwort = speichern(d.ergebnis, d.geraet);
    else if (d.aktion === "anmelden") antwort = anmelden(d.name, d.geraet);
    else if (d.aktion === "freigeben") antwort = mitPasswort(d.passwort, () => freigeben(d.name));
    else if (d.aktion === "liste") antwort = mitPasswort(d.passwort, liste);
    else if (d.aktion === "zuruecksetzen") antwort = mitPasswort(d.passwort, () => zuruecksetzen(d.archivieren !== false));
    else antwort = { ok: false, fehler: "Unbekannte Aktion" };
  } catch (err) {
    antwort = { ok: false, fehler: "Fehler im Skript: " + err.message };
  }
  return ContentService.createTextOutput(JSON.stringify(antwort)).setMimeType(ContentService.MimeType.JSON);
}

function geraeteBlatt() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let b = ss.getSheetByName(GERAETE);
  if (!b) {
    b = ss.insertSheet(GERAETE);
    b.appendRow(GERAETE_KOPF);
    b.setFrozenRows(1);
  }
  return b;
}

const GEBUNDEN = "Dieser Name ist schon auf einem anderen Gerät angemeldet. Bitte wende dich an deine Lehrkraft.";

// "frei" wird beim ersten Mal an dieses Gerät gebunden; liefert true, wenn Name und Gerät zusammenpassen
function geraetPasst(name, geraet) {
  const k = namensSchluessel(name);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const b = geraeteBlatt();
    const werte = b.getDataRange().getValues().slice(1);
    const zeile = werte.find(function (z) { return String(z[0]) === k; });
    if (zeile) return String(zeile[2]) === geraet;
    b.appendRow([k, sauber(name, 40), geraet, new Date()]);
    return true;
  } finally {
    lock.releaseLock();
  }
}
const geraetGueltig = (g) => typeof g === "string" && /^[a-z0-9-]{20,64}$/i.test(g);

function blatt() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let b = ss.getSheetByName(BLATT);
  if (!b) {
    b = ss.insertSheet(BLATT, 0);
    b.appendRow(KOPF);
    b.setFrozenRows(1);
  }
  return b;
}

// Texte von Schülerinnen und Schülern nie als Formel in die Tabelle schreiben
function sauber(wert, laenge) {
  const s = String(wert == null ? "" : wert).slice(0, laenge || 100);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
const ganz = (x, min, max) => Math.min(max, Math.max(min, Math.round(Number(x) || 0)));

function speichern(e, geraet) {
  if (!e || !e.name) return { ok: false, fehler: "Kein Name" };
  if (!geraetGueltig(geraet)) return { ok: false, fehler: "Keine Gerätekennung" };
  if (!geraetPasst(e.name, geraet)) return { ok: false, gebunden: true, fehler: GEBUNDEN };
  const teile = (Array.isArray(e.teile) ? e.teile : []).slice(0, 10).map(function (t) {
    return { id: sauber(t.id, 2), satz: sauber(t.satz, 20), richtig: !!t.richtig, versuche: ganz(t.versuche, 0, 9), hilfen: ganz(t.hilfen, 0, 9),
      eingaben: (Array.isArray(t.eingaben) ? t.eingaben : []).slice(0, 3).map(function (x) { return String(x).slice(0, 30); }) };
  });
  const punkte = ganz(e.punkte, 0, 40), max = ganz(e.max, 1, 40);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    blatt().appendRow([new Date(), sauber(e.name, 40), sauber(e.schuelerId, 12), ganz(e.aufgabe, 1, 18), sauber(e.titel, 60), ganz(e.niveau, 1, 3),
      ganz(e.durchgang, 1, 99), punkte, max, Math.round(100 * punkte / max), JSON.stringify(teile),
      (Array.isArray(e.wiederholen) ? e.wiederholen : []).slice(0, 10).map(function (s) { return sauber(s, 20); }).join(" ")]);
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

function mitPasswort(passwort, aktion) {
  const soll = PropertiesService.getScriptProperties().getProperty("ADMIN_PASSWORT");
  if (!soll) return { ok: false, fehler: "Im Skript ist noch kein ADMIN_PASSWORT eingetragen." };
  const cache = CacheService.getScriptCache();
  const fehlversuche = Number(cache.get("fehlversuche") || 0);
  if (fehlversuche >= MAX_FEHLVERSUCHE) return { ok: false, fehler: "Zu viele falsche Versuche. Bitte in 10 Minuten erneut probieren." };
  if (passwort !== soll) {
    cache.put("fehlversuche", String(fehlversuche + 1), 600);
    Utilities.sleep(1000);
    return { ok: false, fehler: "Falsches Passwort." };
  }
  cache.remove("fehlversuche");
  return aktion();
}

function zeilen() {
  const werte = blatt().getDataRange().getValues().slice(1);
  return werte.filter(function (z) { return z[1] !== ""; }).map(function (z) {
    let teile = [];
    try { teile = JSON.parse(z[10]); } catch (err) { /* Zeile von Hand verändert */ }
    return { zeit: z[0] instanceof Date ? z[0].toISOString() : String(z[0]), name: String(z[1]).replace(/^'/, ""), schuelerId: String(z[2]).replace(/^'/, ""),
      aufgabe: Number(z[3]), titel: String(z[4]), niveau: Number(z[5]), durchgang: Number(z[6]), punkte: Number(z[7]), max: Number(z[8]),
      teile: teile, wiederholen: String(z[11] || "").split(" ").filter(String) };
  });
}

function liste() {
  const bindungen = geraeteBlatt().getDataRange().getValues().slice(1).map(function (z) {
    return { schluessel: String(z[0]), seit: z[3] instanceof Date ? z[3].toISOString() : String(z[3]) };
  });
  return { ok: true, ergebnisse: zeilen(), bindungen: bindungen };
}

function freigeben(name) {
  const k = namensSchluessel(name);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const b = geraeteBlatt();
    const werte = b.getDataRange().getValues();
    for (let i = werte.length - 1; i >= 1; i--) if (String(werte[i][0]) === k) b.deleteRow(i + 1);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

// Ohne Passwort, aber nur vom gebundenen Gerät: die eigenen Ergebnisse, damit man nach dem Abmelden weiterarbeiten kann
const namensSchluessel = (n) => String(n || "").replace(/^'/, "").trim().replace(/\s+/g, " ").toLowerCase();
function anmelden(name, geraet) {
  const gesucht = namensSchluessel(name);
  if (!gesucht) return { ok: false, fehler: "Kein Name" };
  if (!geraetGueltig(geraet)) return { ok: false, fehler: "Keine Gerätekennung" };
  if (!geraetPasst(name, geraet)) return { ok: false, gebunden: true, fehler: GEBUNDEN };
  const eigene = zeilen().filter(function (e) { return namensSchluessel(e.name) === gesucht; }).map(function (e) {
    return { aufgabe: e.aufgabe, durchgang: e.durchgang, schuelerId: e.schuelerId, teile: e.teile };
  });
  return { ok: true, ergebnisse: eigene };
}

function zuruecksetzen(archivieren) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const b = blatt();
    let archiv = null;
    if (archivieren && b.getLastRow() > 1) {
      archiv = "Archiv " + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH-mm");
      b.copyTo(SpreadsheetApp.getActiveSpreadsheet()).setName(archiv);
    }
    if (b.getLastRow() > 1) b.deleteRows(2, b.getLastRow() - 1);
    const g = geraeteBlatt();
    if (g.getLastRow() > 1) g.deleteRows(2, g.getLastRow() - 1);
    return { ok: true, archiv: archiv };
  } finally {
    lock.releaseLock();
  }
}
