/*
 * Aufgabensammlung „Kreis und Körper im Alltag“ (Klasse 10, Doppelstunde 4)
 *
 * Jede Aufgabe gehört zu einer Station; pflicht: true markiert die sechs Pflichtaufgaben.
 * Jede Teilaufgabe hat einen Anforderungsbereich (afb 1–3), angezeigt als ★ / ★★ / ★★★.
 * thema: Welches Wissen die Teilaufgabe hauptsächlich prüft. Daraus entstehen die
 * Wiederholungskarten (siehe WIEDERHOLUNG unten).
 *
 * typ "zahl" (Standard): wert = exakter Sollwert (aus den Angaben berechnet, nicht gerundet),
 *   abs = feste Toleranz, wenn ±1 % nicht passt (z. B. „runde auf ganze Hundert“).
 * typ "auswahl": schritte = Fragen mit Antwortmöglichkeiten, richtig = Index der richtigen.
 *   freitext = Aufforderung für eine freiwillige eigene Begründung (geht an die Lehrkraft).
 * weg: Rechenweg für die Lehrkraft. Er wird in der App nicht angezeigt.
 */
(function () {
  const PI = Math.PI;
  const wurzel = Math.sqrt;
  const kubikwurzel = Math.cbrt;

  // Zwischengrößen, die in mehreren Teilaufgaben gebraucht werden
  const t1_u = PI * 71;
  const t3_A26 = PI * 13 ** 2, t3_A32 = PI * 16 ** 2;
  const t4_A = (120 / 360) * PI * 8 ** 2;
  const t5_A = (110 / 360) * PI * (50 ** 2 - 10 ** 2), t5_Aneu = (110 / 360) * PI * (55 ** 2 - 10 ** 2);
  const t6_l = PI * 7.3 + 1;
  const t7_V = PI * 30 ** 2 * 90;
  const t8_weg = PI * (3.5 ** 2 - 2 ** 2);
  const t9_hs = wurzel(1.8 ** 2 + 1.2 ** 2), t9_hsXL = wurzel(3.6 ** 2 + 1.2 ** 2);
  const t9_stoff = 4 * 0.5 * 2.4 * t9_hs + 2.4 ** 2;
  const t11_V = (PI * 2.5 ** 2 * 12) / 3, t11_eis = (PI * 1.25 ** 2 * 6) / 3;
  const t12_V = (35 ** 2 * 21.6) / 3, t12_hs = wurzel(21.6 ** 2 + 17.5 ** 2);
  const t13_V = (4 / 3) * PI * 5.5 ** 3;
  const t14_O = 4 * PI * 15 ** 2;
  const t15_Vz = PI * 0.6 ** 2 * 2.8, t15_V = t15_Vz + (4 / 3) * PI * 0.6 ** 3;
  const t15_rK = kubikwurzel((3 * t15_V) / (4 * PI));

  const AUFGABEN = [
    {
      id: 1, titel: "Fahrradreifen", station: 1, pflicht: true, koerper: ["Kreisumfang"],
      einleitung: "Ein Trekkingrad hat Reifen mit einem Außendurchmesser von 71 cm.",
      skizze: "fahrrad",
      teile: [
        { id: "a", afb: 1, thema: "kreis", einheit: "cm",
          text: "Berechne, wie weit das Fahrrad bei einer Radumdrehung fährt. Runde auf ganze Zentimeter.",
          wert: t1_u,
          hilfen: ["Bei einer Umdrehung rollt der Reifen einmal mit seinem ganzen Rand auf der Straße ab.", "Gesucht ist der Umfang des Kreises. Du kennst den Durchmesser."],
          weg: "u = π · 71 cm ≈ 223 cm" },
        { id: "b", afb: 2, thema: "kreis", einheit: "Umdrehungen",
          text: "Lenas Schulweg ist 3,5 km lang. Berechne, wie oft sich ein Rad auf dem Schulweg dreht. Runde auf ganze Umdrehungen.",
          wert: 350000 / t1_u,
          hilfen: ["Rechne den Schulweg zuerst in Zentimeter um.", "Wie oft passt die Strecke einer Umdrehung in den ganzen Schulweg?"],
          weg: "350 000 cm : 223,05 cm ≈ 1569 Umdrehungen" },
        { id: "c1", marke: "c)", afb: 2, thema: "kreis", typ: "auswahl",
          text: "Lenas Fahrradcomputer ist versehentlich auf einen Raddurchmesser von 66 cm eingestellt. Er zählt die Umdrehungen und rechnet mit diesem Durchmesser. Zeigt er zu viel oder zu wenig an?",
          schritte: [
            { frage: "Der Fahrradcomputer zeigt …", optionen: ["… zu viel an.", "… zu wenig an.", "… genau richtig an, weil er die Umdrehungen zählt."], richtig: 1 },
            { frage: "Begründung:", optionen: ["Er zählt bei einem kleineren Rad mehr Umdrehungen.", "Er rechnet pro Umdrehung mit einem kleineren Umfang, als das Rad wirklich zurücklegt.", "Der Durchmesser spielt für die Strecke keine Rolle."], richtig: 1 }
          ],
          hilfen: ["Die Zahl der Umdrehungen ist richtig. Falsch ist nur, welche Strecke der Computer pro Umdrehung annimmt.", "Vergleiche den Umfang bei 66 cm mit dem Umfang bei 71 cm."],
          weg: "π · 66 cm ≈ 207,3 cm < 223,1 cm, also zu wenig" },
        { id: "c2", marke: "c)", afb: 2, thema: "prozent", einheit: "%",
          text: "Gib die Abweichung in Prozent an, bezogen auf die tatsächlich gefahrene Strecke. Runde auf eine Dezimalstelle.",
          wert: ((71 - 66) / 71) * 100,
          hilfen: ["Der Grundwert ist die tatsächliche Strecke, also die mit 71 cm Durchmesser.", "Der Umfang ist proportional zum Durchmesser. Du kannst deshalb auch direkt die Durchmesser vergleichen."],
          weg: "(71 − 66) : 71 ≈ 7,0 %" }
      ]
    },
    {
      id: 2, titel: "Ein Seil um die Erde", station: 1, pflicht: false, koerper: ["Kreisumfang"],
      einleitung: "Die Erde ist näherungsweise eine Kugel mit dem Radius 6371 km.",
      skizze: "seil",
      teile: [
        { id: "a", afb: 1, thema: "kreis", einheit: "km",
          text: "Berechne die Länge des Äquators. Runde auf ganze Kilometer.",
          wert: 2 * PI * 6371,
          hilfen: ["Der Äquator ist ein Kreis um die Erde mit dem Erdradius.", "Achte darauf, ob du den Radius oder den Durchmesser einsetzt."],
          weg: "u = 2π · 6371 km ≈ 40 030 km" },
        { id: "b", afb: 2, thema: "kreis", einheit: "cm",
          text: "Ein Seil liegt straff um den Äquator. Es wird um genau 1 m verlängert und überall gleich weit vom Boden angehoben. Berechne, wie hoch das Seil nun über dem Boden liegt. Runde auf eine Dezimalstelle in cm.",
          wert: 100 / (2 * PI),
          hilfen: ["Das Seil bildet einen größeren Kreis mit dem Radius r + x. Stelle eine Gleichung für den neuen Umfang auf.", "2π(r + x) = 2πr + 1 m. Was bleibt übrig, wenn du auf beiden Seiten 2πr abziehst?"],
          weg: "2π(r + x) = 2πr + 1 m ⇒ x = 1 m : (2π) ≈ 15,9 cm" },
        { id: "c", afb: 3, thema: "wachstum", typ: "auswahl",
          text: "Begründe oder widerlege: „Bei einem Tennisball wäre der Abstand nach dem Verlängern um 1 m viel größer als bei der Erde.“",
          schritte: [
            { frage: "Die Aussage …", optionen: ["… stimmt.", "… stimmt nicht."], richtig: 1 },
            { frage: "Begründung:", optionen: ["Beim kleinen Ball ist 1 m im Verhältnis viel mehr Seil, deshalb steht es weiter ab.", "Der Abstand x = 1 m : (2π) hängt gar nicht vom Radius ab. Er ist bei jedem Kreis gleich groß.", "Beim Tennisball ist der Abstand kleiner, weil sein Umfang kleiner ist."], richtig: 1 }
          ],
          freitext: "Erkläre in eigenen Worten, warum das Ergebnis überrascht.",
          hilfen: ["Schau dir deine Rechnung aus b) an: Kommt der Erdradius im Ergebnis überhaupt noch vor?", "Rechne dieselbe Gleichung für einen Ball mit dem Radius 3,3 cm."],
          weg: "Widerlegt: x = 1 m : (2π) ≈ 15,9 cm, unabhängig vom Radius" }
      ]
    },
    {
      id: 3, titel: "Pizza-Vergleich", station: 2, pflicht: true, koerper: ["Kreisfläche"],
      einleitung: "Die Pizzeria „Bella“ bietet eine Pizza Margherita mit 26 cm Durchmesser für 7,50 € und mit 32 cm Durchmesser für 10,50 € an.",
      skizze: "pizza",
      teile: [
        { id: "a1", marke: "a)", afb: 1, thema: "kreisflaeche", einheit: "cm²",
          text: "Berechne den Flächeninhalt der 26-cm-Pizza. Runde auf ganze cm².",
          wert: t3_A26,
          hilfen: ["Die Formel für die Kreisfläche braucht den Radius.", "A = π · r²"],
          weg: "A₂₆ = π · 13² ≈ 531 cm²" },
        { id: "a2", marke: "a)", afb: 1, thema: "kreisflaeche", einheit: "cm²",
          text: "Berechne den Flächeninhalt der 32-cm-Pizza. Runde auf ganze cm².",
          wert: t3_A32,
          hilfen: ["Halbiere zuerst den Durchmesser.", "A = π · r²"],
          weg: "A₃₂ = π · 16² ≈ 804 cm²" },
        { id: "b1", marke: "b)", afb: 2, thema: "prozent", einheit: "€",
          text: "Berechne für die 26-cm-Pizza den Preis pro 100 cm². Runde auf ganze Cent.",
          wert: (7.5 / t3_A26) * 100,
          hilfen: ["Wie viele 100-cm²-Stücke hat die Pizza?", "Teile den Preis durch die Anzahl der 100-cm²-Stücke."],
          weg: "7,50 € : 5,309 ≈ 1,41 €" },
        { id: "b2", marke: "b)", afb: 2, thema: "prozent", einheit: "€",
          text: "Berechne für die 32-cm-Pizza den Preis pro 100 cm². Runde auf ganze Cent.",
          wert: (10.5 / t3_A32) * 100,
          hilfen: ["Gehe genauso vor wie bei der kleinen Pizza.", "Fläche in cm² geteilt durch 100 ergibt die Anzahl der 100-cm²-Stücke."],
          weg: "10,50 € : 8,042 ≈ 1,31 €" },
        { id: "b3", marke: "b)", afb: 2, thema: "prozent", typ: "auswahl",
          text: "Entscheide, welches Angebot günstiger ist.",
          schritte: [{ frage: "Günstiger ist …", optionen: ["… die 26-cm-Pizza.", "… die 32-cm-Pizza.", "Beide sind gleich günstig."], richtig: 1 }],
          hilfen: ["Vergleiche die Preise pro 100 cm², nicht die Gesamtpreise.", "Weniger Geld für dieselbe Fläche ist günstiger."],
          weg: "1,31 € < 1,41 €: die große Pizza" },
        { id: "c1", marke: "c)", afb: 3, thema: "wachstum", einheit: "%",
          text: "Tim meint: „Der Durchmesser ist nur etwa 23 % größer, also bekomme ich auch nur etwa 23 % mehr Pizza.“ Gib an, um wie viel Prozent die Fläche wirklich größer ist. Runde auf eine Dezimalstelle.",
          wert: (t3_A32 / t3_A26 - 1) * 100,
          hilfen: ["Teile die große Fläche durch die kleine.", "Ein Faktor von 1,4 bedeutet 40 % mehr."],
          weg: "16² : 13² ≈ 1,515 ⇒ etwa 51,5 % mehr" },
        { id: "c2", marke: "c)", afb: 3, thema: "wachstum", typ: "auswahl",
          text: "Beurteile Tims Aussage.",
          schritte: [
            { frage: "Tims Aussage …", optionen: ["… stimmt.", "… stimmt nicht."], richtig: 1 },
            { frage: "Begründung:", optionen: ["Die Fläche wächst mit dem Quadrat des Durchmessers: (32 : 26)² ≈ 1,5.", "Die Fläche wächst genauso wie der Durchmesser.", "Der Durchmesser ist 6 cm größer, also gibt es 6 % mehr Pizza."], richtig: 0 }
          ],
          freitext: "Erkläre Tim in eigenen Worten, was er übersehen hat.",
          hilfen: ["Wie verändert sich die Fläche eines Quadrats, wenn die Seite doppelt so lang wird?", "In A = π · r² steht der Radius im Quadrat."],
          weg: "Tim irrt, die Fläche wächst quadratisch" }
      ]
    },
    {
      id: 4, titel: "Rasensprenger", station: 3, pflicht: false, koerper: ["Kreisausschnitt"],
      einleitung: "Ein Rasensprenger dreht sich hin und her und bewässert einen Kreisausschnitt mit dem Radius 8 m und dem Mittelpunktswinkel 120°.",
      skizze: "sprenger",
      teile: [
        { id: "a", afb: 1, thema: "kreisteil", einheit: "m²",
          text: "Berechne die bewässerte Fläche. Runde auf eine Dezimalstelle.",
          wert: t4_A,
          hilfen: ["Welcher Anteil des ganzen Kreises sind 120°?", "A = α : 360° · π · r²"],
          weg: "A = 120°/360° · π · 8² ≈ 67,0 m²" },
        { id: "b", afb: 1, thema: "kreisteil", einheit: "m",
          text: "Berechne die Länge des Bogens, den der äußerste Wasserstrahl überstreicht. Runde auf zwei Dezimalstellen.",
          wert: (120 / 360) * 2 * PI * 8,
          hilfen: ["Der Bogen ist ein Teil des Kreisumfangs.", "b = α : 360° · 2π · r"],
          weg: "b = 120°/360° · 2π · 8 ≈ 16,76 m" },
        { id: "c", afb: 2, thema: "kreisteil", einheit: "m",
          text: "Der Sprenger wird auf einen Halbkreis (180°) umgestellt. Die bewässerte Fläche soll gleich bleiben. Berechne, auf welche Reichweite er eingestellt werden muss. Runde auf zwei Dezimalstellen.",
          wert: wurzel(t4_A / (PI / 2)),
          hilfen: ["Setze die Fläche aus a) mit der Formel für einen Halbkreis gleich.", "½ · π · r² = Fläche aus a). Stelle nach r um und ziehe am Ende die Wurzel."],
          weg: "½ · π · r² = 67,02 ⇒ r² ≈ 42,67 ⇒ r ≈ 6,53 m" }
      ]
    },
    {
      id: 5, titel: "Scheibenwischer", station: 3, pflicht: false, koerper: ["Kreisausschnitt", "Kreisring"],
      einleitung: "Der Wischerarm eines Autos ist 50 cm lang. Das Wischgummi beginnt 10 cm vom Drehpunkt entfernt und reicht bis zum Ende des Arms. Der Arm schwenkt um 110°.",
      skizze: "wischer",
      teile: [
        { id: "a", afb: 1, thema: "kreisteil", typ: "auswahl",
          text: "Beschreibe, welche Form die gewischte Fläche hat.",
          schritte: [{ frage: "Die gewischte Fläche ist …", optionen: ["… ein Kreisausschnitt mit dem Radius 50 cm.", "… ein Halbkreis.", "… ein Ausschnitt aus einem Kreisring: großer Kreisausschnitt (50 cm) minus kleiner Kreisausschnitt (10 cm).", "… ein Rechteck, das gedreht wird."], richtig: 2 }],
          freitext: "Beschreibe die Form in eigenen Worten.",
          hilfen: ["Zeichne den Arm in Anfangs- und Endstellung. Welche Fläche überstreicht nur das Gummi?", "Ganz nah am Drehpunkt wird nicht gewischt."],
          weg: "Ausschnitt eines Kreisrings (110°, Radien 10 cm und 50 cm)" },
        { id: "b", afb: 2, thema: "kreisteil", einheit: "cm²",
          text: "Berechne den Inhalt der gewischten Fläche. Runde auf ganze cm².",
          wert: t5_A,
          hilfen: ["Berechne den großen und den kleinen Kreisausschnitt mit je 110° und ziehe sie voneinander ab.", "A = 110° : 360° · π · (R² − r²)"],
          weg: "A = 110°/360° · π · (50² − 10²) ≈ 2304 cm²" },
        { id: "c1", marke: "c)", afb: 3, thema: "wachstum", einheit: "%",
          text: "Ein neuer Wischer hat einen 5 cm längeren Arm (also 10 % länger), das Gummi beginnt weiterhin 10 cm vom Drehpunkt. Berechne, um wie viel Prozent die gewischte Fläche größer wird. Runde auf eine Dezimalstelle.",
          wert: (t5_Aneu / t5_A - 1) * 100,
          hilfen: ["Berechne die neue Fläche mit R = 55 cm und vergleiche sie mit b).", "Neue Fläche geteilt durch alte Fläche ergibt den Wachstumsfaktor."],
          weg: "(55² − 10²) : (50² − 10²) ≈ 1,219 ⇒ etwa 21,9 % mehr" },
        { id: "c2", marke: "c)", afb: 3, thema: "wachstum", typ: "auswahl",
          text: "Erkläre, warum der Zuwachs mehr als 10 % beträgt, obwohl der Arm nur 10 % länger wird.",
          schritte: [{ frage: "Der wichtigste Grund ist:", optionen: ["Das Gummi wird 12,5 % länger, deshalb wächst die Fläche um genau 12,5 %.", "Der Schwenkwinkel wird beim längeren Arm größer.", "Der neue Streifen liegt ganz außen, wo die Bögen am längsten sind. Die Fläche hängt vom Quadrat der Radien ab."], richtig: 2 }],
          freitext: "Erkläre den Zuwachs in eigenen Worten.",
          hilfen: ["Vergleiche, wie viel Fläche ein 5 cm breiter Streifen innen und ganz außen hat.", "In der Formel steht R², nicht R."],
          weg: "Fläche wächst mit R², der Zuwachs liegt außen" }
      ]
    },
    {
      id: 6, titel: "Konservendose", station: 4, pflicht: false, koerper: ["Zylinder"],
      einleitung: "Eine Konservendose hat den Durchmesser 7,3 cm und die Höhe 10,5 cm.",
      skizze: "dose",
      teile: [
        { id: "a", afb: 1, thema: "zylinder", einheit: "cm²",
          text: "Berechne, wie viel Blech für die Dose mindestens benötigt wird. Runde auf eine Dezimalstelle.",
          wert: 2 * PI * 3.65 ** 2 + 2 * PI * 3.65 * 10.5,
          hilfen: ["Das Blech bildet Boden, Deckel und Mantel, also die ganze Oberfläche.", "O = 2πr² + 2πrh"],
          weg: "O = 2π · 3,65² + 2π · 3,65 · 10,5 ≈ 324,5 cm²" },
        { id: "b1", marke: "b)", afb: 2, thema: "kreis", einheit: "cm",
          text: "Das Papieretikett ist 9 cm hoch und umschließt die Dose vollständig mit 1 cm Klebeüberlappung. Bestimme die Länge des Etiketts. Runde auf eine Dezimalstelle.",
          wert: t6_l,
          hilfen: ["Das Etikett muss einmal ganz um die Dose herumreichen.", "Länge = Umfang der Dose + Überlappung"],
          weg: "π · 7,3 + 1 ≈ 23,9 cm" },
        { id: "b2", marke: "b)", afb: 2, thema: "zylinder", einheit: "cm²",
          text: "Bestimme den Flächeninhalt des Etiketts. Runde auf eine Dezimalstelle.",
          wert: t6_l * 9,
          hilfen: ["Abgewickelt ist das Etikett ein Rechteck.", "Fläche = Länge · Höhe des Etiketts"],
          weg: "23,93 · 9 ≈ 215,4 cm²" },
        { id: "c1", marke: "c)", afb: 2, thema: "zylinder", einheit: "cm²",
          text: "Eine zweite Dose hat den doppelten Radius und die halbe Höhe. Berechne ihre Oberfläche. Runde auf eine Dezimalstelle.",
          wert: 2 * PI * 7.3 ** 2 + 2 * PI * 7.3 * 5.25,
          hilfen: ["Neuer Radius 7,3 cm, neue Höhe 5,25 cm.", "Benutze dieselbe Formel wie in a)."],
          weg: "2π · 7,3² + 2π · 7,3 · 5,25 ≈ 575,6 cm²" },
        { id: "c2", marke: "c)", afb: 3, thema: "wachstum", typ: "auswahl",
          text: "Begründe oder widerlege: „Verdoppelt man den Radius einer Dose und halbiert die Höhe, bleibt die Oberfläche gleich.“",
          schritte: [
            { frage: "Die Aussage …", optionen: ["… stimmt.", "… stimmt nicht."], richtig: 1 },
            { frage: "Begründung:", optionen: ["Doppelt und halb gleichen sich aus, weil 2 · ½ = 1 ist.", "Der Mantel bleibt gleich, aber Boden und Deckel werden viermal so groß.", "Die Oberfläche verdoppelt sich genau."], richtig: 1 }
          ],
          freitext: "Begründe mit der Formel, welcher Teil der Oberfläche sich ändert.",
          hilfen: ["Untersuche Mantel und Kreisflächen getrennt.", "Setze 2r und h/2 in 2πrh und in 2πr² ein."],
          weg: "Mantel 2π · 2r · h/2 = 2πrh bleibt, Kreisflächen 8πr² statt 2πr²" }
      ]
    },
    {
      id: 7, titel: "Regentonne", station: 5, pflicht: true, koerper: ["Zylinder"],
      einleitung: "Eine zylinderförmige Regentonne hat innen den Durchmesser 60 cm und die Höhe 90 cm.",
      skizze: "tonne",
      teile: [
        { id: "a", afb: 1, thema: "zylinder", einheit: "l",
          text: "Berechne, wie viele Liter Wasser die volle Tonne fasst. Runde auf eine Dezimalstelle.",
          wert: t7_V / 1000,
          hilfen: ["V = πr² · h. Rechne in cm, dann erhältst du cm³.", "1 Liter = 1 dm³ = 1000 cm³"],
          weg: "V = π · 30² · 90 ≈ 254 469 cm³ ≈ 254,5 l" },
        { id: "b", afb: 2, thema: "zylinder", einheit: "cm",
          text: "Aus der vollen Tonne werden 10 Gießkannen mit je 10 Litern entnommen. Berechne, wie hoch das Wasser danach noch steht. Runde auf eine Dezimalstelle in cm.",
          wert: 90 - 100000 / (PI * 30 ** 2),
          hilfen: ["Die entnommenen 100 Liter bilden selbst einen Zylinder mit derselben Grundfläche.", "Höhe dieses Zylinders = Volumen : Grundfläche. Ziehe sie von 90 cm ab."],
          weg: "100 000 : (π · 30²) ≈ 35,4 cm ⇒ 90 − 35,4 = 54,6 cm" },
        { id: "c", afb: 2, thema: "zylinder", einheit: "cm",
          text: "Unter das Fallrohr passt nur eine Tonne mit 70 cm Höhe. Sie soll genauso viel fassen. Berechne den nötigen Innendurchmesser. Runde auf eine Dezimalstelle in cm.",
          wert: 2 * wurzel(t7_V / (70 * PI)),
          hilfen: ["Setze das Volumen aus a) in V = πr² · h mit h = 70 cm ein und stelle nach r um.", "Am Ende ist nach dem Durchmesser gefragt, nicht nach dem Radius."],
          weg: "π · r² · 70 = 254 469 ⇒ r ≈ 34,0 cm ⇒ d ≈ 68,0 cm" }
      ]
    },
    {
      id: 8, titel: "Springbrunnen", station: 2, pflicht: false, koerper: ["Kreisfläche", "Kreisring"],
      einleitung: "Ein runder Springbrunnen hat den Durchmesser 4 m. Um ihn herum führt ein 1,5 m breiter gepflasterter Weg.",
      skizze: "brunnen",
      teile: [
        { id: "a", afb: 1, thema: "kreisflaeche", einheit: "m²",
          text: "Berechne die Wasserfläche. Runde auf zwei Dezimalstellen.",
          wert: PI * 2 ** 2,
          hilfen: ["Der Brunnen ist ein Kreis. Welchen Radius hat er?", "A = π · r²"],
          weg: "A = π · 2² ≈ 12,57 m²" },
        { id: "b1", marke: "b)", afb: 2, thema: "kreisteil", einheit: "m²",
          text: "Berechne die Fläche des Weges. Runde auf zwei Dezimalstellen.",
          wert: t8_weg,
          hilfen: ["Der Weg ist ein Kreisring. Der äußere Radius ist Brunnenradius plus Wegbreite.", "Ringfläche = großer Kreis minus kleiner Kreis"],
          weg: "π · (3,5² − 2²) ≈ 25,92 m²" },
        { id: "b2", marke: "b)", afb: 2, thema: "kreisteil", einheit: "€",
          text: "Berechne die Kosten für das Pflaster, wenn ein m² 45 € kostet. Runde auf ganze Euro.",
          wert: t8_weg * 45,
          hilfen: ["Du brauchst die Wegfläche aus dem vorigen Teil.", "Kosten = Fläche · Preis pro m²"],
          weg: "25,92 · 45 € ≈ 1166 €" },
        { id: "c1", marke: "c)", afb: 2, thema: "kreisteil", einheit: "m²",
          text: "Der Weg wird doppelt so breit (3 m). Berechne die neue Wegfläche. Runde auf zwei Dezimalstellen.",
          wert: PI * (5 ** 2 - 2 ** 2),
          hilfen: ["Der äußere Radius ändert sich, der innere bleibt 2 m.", "Ringfläche = π · (R² − r²)"],
          weg: "π · (5² − 2²) = 21π ≈ 65,97 m²" },
        { id: "c2", marke: "c)", afb: 3, thema: "wachstum", typ: "auswahl",
          text: "Begründe oder widerlege: „Wenn man den Weg doppelt so breit macht, braucht man doppelt so viel Pflaster.“",
          schritte: [
            { frage: "Die Aussage …", optionen: ["… stimmt.", "… stimmt nicht."], richtig: 1 },
            { frage: "Begründung:", optionen: ["Man braucht etwa das 2,5-Fache, weil der äußere Rand länger wird und die Fläche stärker wächst als die Breite.", "Man braucht genau das Doppelte, weil die Breite doppelt so groß ist.", "Man braucht genau das Vierfache, weil Flächen immer quadratisch wachsen."], richtig: 0 }
          ],
          freitext: "Begründe in eigenen Worten.",
          hilfen: ["Vergleiche deine Ergebnisse aus b) und c).", "Teile die neue Wegfläche durch die alte."],
          weg: "65,97 : 25,92 ≈ 2,5 ⇒ widerlegt" }
      ]
    },
    {
      id: 9, titel: "Pyramidenzelt", station: 6, pflicht: false, koerper: ["Pyramide"],
      einleitung: "Ein Zelt hat die Form einer quadratischen Pyramide mit der Grundkante 2,4 m und der Höhe 1,8 m.",
      skizze: "zelt",
      teile: [
        { id: "a", afb: 1, thema: "pythagoras", einheit: "m",
          text: "Berechne die Höhe einer dreieckigen Seitenfläche. Runde auf zwei Dezimalstellen.",
          wert: t9_hs,
          hilfen: ["Zeichne das Dreieck aus Pyramidenhöhe, halber Grundkante und Seitenhöhe.", "Die Seitenhöhe ist in diesem Dreieck die Hypotenuse."],
          weg: "hₛ = √(1,8² + 1,2²) ≈ 2,16 m" },
        { id: "b1", marke: "b)", afb: 2, thema: "pyramide", einheit: "m²",
          text: "Berechne die Fläche der vier Seitenwände und des Zeltbodens zusammen (noch ohne Zuschlag). Runde auf zwei Dezimalstellen.",
          wert: t9_stoff,
          hilfen: ["Jede Seitenwand ist ein Dreieck mit der Grundseite 2,4 m und der Höhe aus a).", "Der Boden ist ein Quadrat."],
          weg: "4 · ½ · 2,4 · 2,163 + 2,4² ≈ 10,38 + 5,76 = 16,14 m²" },
        { id: "b2", marke: "b)", afb: 2, thema: "prozent", einheit: "m²",
          text: "Für Nähte und Verschnitt kommen 10 % dazu. Berechne, wie viel Stoff nötig ist. Runde auf eine Dezimalstelle.",
          wert: t9_stoff * 1.1,
          hilfen: ["10 % mehr bedeutet: 110 % des Grundwerts.", "Multipliziere mit 1,1."],
          weg: "16,14 · 1,1 ≈ 17,8 m²" },
        { id: "c1", marke: "c)", afb: 2, thema: "pythagoras", einheit: "m",
          text: "Ein Hersteller wirbt: „Unser Modell XL ist bei gleicher Grundfläche doppelt so hoch, braucht für die Seitenwände aber nicht doppelt so viel Stoff.“ Berechne die Seitenhöhe des Modells XL. Runde auf zwei Dezimalstellen.",
          wert: t9_hsXL,
          hilfen: ["Die Grundkante bleibt 2,4 m, die Höhe ist jetzt 3,6 m.", "Gleiches Dreieck wie in a), nur mit der neuen Höhe."],
          weg: "hₛ,XL = √(3,6² + 1,2²) ≈ 3,79 m" },
        { id: "c2", marke: "c)", afb: 3, thema: "wachstum", typ: "auswahl",
          text: "Überprüfe die Werbeaussage.",
          schritte: [
            { frage: "Die Werbeaussage …", optionen: ["… stimmt.", "… stimmt nicht."], richtig: 0 },
            { frage: "Begründung:", optionen: ["Die Seitenhöhe wächst nur auf etwa das 1,75-Fache, weil die halbe Grundkante gleich bleibt. Die Seitenwände wachsen im selben Verhältnis.", "Die Seitenwände hängen nur von der Grundkante ab, nicht von der Höhe.", "Bei doppelter Höhe verdoppelt sich auch die Seitenhöhe genau."], richtig: 0 }
          ],
          freitext: "Begründe mit deinen Rechenergebnissen.",
          hilfen: ["Teile die Seitenhöhe aus c) durch die aus a).", "Die Fläche einer Seitenwand ist proportional zu ihrer Höhe."],
          weg: "3,79 : 2,16 ≈ 1,75 < 2 ⇒ Aussage stimmt" }
      ]
    },
    {
      id: 10, titel: "Schultüte", station: 6, pflicht: true, koerper: ["Kegel"],
      einleitung: "Eine Schultüte ist ein Kegel mit dem Öffnungsdurchmesser 20 cm und der Mantellinie s = 70 cm.",
      skizze: "schultuete",
      teile: [
        { id: "a", afb: 1, thema: "kegel", einheit: "cm²",
          text: "Berechne, wie viel Pappe für den Mantel benötigt wird. Runde auf ganze cm².",
          wert: PI * 10 * 70,
          hilfen: ["Die Mantelfläche eines Kegels hängt vom Radius und der Mantellinie ab.", "M = π · r · s"],
          weg: "M = π · 10 · 70 ≈ 2199 cm²" },
        { id: "b", afb: 2, thema: "kreisteil", einheit: "°",
          text: "Der Mantel wird aus einem Kreisausschnitt mit dem Radius 70 cm geschnitten. Berechne den Mittelpunktswinkel. Runde auf eine Dezimalstelle.",
          wert: (360 * 10) / 70,
          hilfen: ["Der Bogen des Kreisausschnitts wird zum Rand der Öffnung.", "Setze die Bogenlänge α : 360° · 2π · 70 gleich dem Umfang der Öffnung."],
          weg: "α/360° · 2π · 70 = 2π · 10 ⇒ α ≈ 51,4°" },
        { id: "c1", marke: "c)", afb: 2, thema: "pythagoras", einheit: "cm",
          text: "Berechne die Höhe der Schultüte. Runde auf eine Dezimalstelle.",
          wert: wurzel(70 ** 2 - 10 ** 2),
          hilfen: ["Höhe, Radius und Mantellinie bilden ein rechtwinkliges Dreieck.", "Die Mantellinie ist die Hypotenuse."],
          weg: "h = √(70² − 10²) ≈ 69,3 cm" },
        { id: "c2", marke: "c)", afb: 2, thema: "pythagoras", typ: "auswahl",
          text: "Erkläre, warum die Höhe nur wenig kleiner ist als s.",
          schritte: [{ frage: "Der Grund ist:", optionen: ["Die Höhe eines Kegels ist immer fast so lang wie die Mantellinie.", "Der Radius ist im Vergleich zu s sehr klein. Die Mantellinie steht fast senkrecht, und s² − r² ist kaum kleiner als s².", "Die Schultüte hat keinen Boden."], richtig: 1 }],
          freitext: "Erkläre in eigenen Worten.",
          hilfen: ["Stell dir eine sehr breite, flache Tüte vor. Wie wäre es dann?", "Vergleiche 70² mit 10²."],
          weg: "r ≪ s ⇒ h ≈ s" }
      ]
    },
    {
      id: 11, titel: "Eiswaffel", station: 7, pflicht: false, koerper: ["Kegel"],
      einleitung: "Eine Eiswaffel ist innen ein Kegel mit dem Durchmesser 5 cm und der Höhe 12 cm.",
      skizze: "waffel",
      teile: [
        { id: "a", afb: 1, thema: "kegel", einheit: "cm³",
          text: "Berechne das Volumen der Waffel. Runde auf eine Dezimalstelle.",
          wert: t11_V,
          hilfen: ["Ein Kegel hat ein Drittel des Volumens eines Zylinders mit gleicher Grundfläche und Höhe.", "V = ⅓ · π · r² · h"],
          weg: "V = ⅓ · π · 2,5² · 12 ≈ 78,5 cm³" },
        { id: "b1", marke: "b)", afb: 2, thema: "kegel", einheit: "cm³",
          text: "Die Waffel ist nur bis zur halben Höhe mit Eis gefüllt. Berechne die Eismenge. Runde auf zwei Dezimalstellen.",
          wert: t11_eis,
          hilfen: ["Das Eis bildet selbst einen kleinen Kegel mit der Spitze unten.", "Bei halber Höhe ist auch der Radius nur halb so groß."],
          weg: "V = ⅓ · π · 1,25² · 6 ≈ 9,82 cm³" },
        { id: "b2", marke: "b)", afb: 2, thema: "wachstum", einheit: "%",
          text: "Gib an, welcher Anteil der Waffel gefüllt ist. Gib den Anteil in Prozent an und runde auf eine Dezimalstelle.",
          wert: (t11_eis / t11_V) * 100,
          hilfen: ["Anteil = Eismenge : Volumen der ganzen Waffel.", "Multipliziere mit 100, um Prozent zu erhalten."],
          weg: "(½)³ = ⅛ = 12,5 %" },
        { id: "c1", marke: "c)", afb: 3, thema: "wachstum", typ: "auswahl",
          text: "Mia sagt: „Halbe Höhe heißt halb voll.“ Beurteile die Aussage.",
          schritte: [
            { frage: "Mias Aussage …", optionen: ["… stimmt.", "… stimmt nicht."], richtig: 1 },
            { frage: "Begründung:", optionen: ["Das Volumen ist proportional zur Höhe, also ist halbe Höhe halb voll.", "Mit der Höhe schrumpft auch der Radius. Das Volumen wächst deshalb mit der dritten Potenz der Füllhöhe.", "Der obere Teil der Waffel ist schmaler als der untere."], richtig: 1 }
          ],
          freitext: "Erkläre Mia in eigenen Worten, warum das nicht stimmt.",
          hilfen: ["Vergleiche mit deinem Ergebnis aus b).", "Wo ist die Waffel breiter: unten an der Spitze oder oben am Rand?"],
          weg: "Mia irrt, V ~ x³" },
        { id: "c2", marke: "c)", afb: 3, thema: "wachstum", einheit: "cm",
          text: "Bestimme, bis zu welcher Höhe die Waffel gefüllt sein muss, damit sie wirklich halb voll ist. Runde auf eine Dezimalstelle.",
          wert: 12 * kubikwurzel(0.5),
          hilfen: ["Bei der Füllhöhe x ist das Volumen (x : 12)³ · V.", "Setze (x : 12)³ = ½ und ziehe die dritte Wurzel."],
          weg: "x = 12 · ∛0,5 ≈ 9,5 cm" }
      ]
    },
    {
      id: 12, titel: "Louvre-Pyramide", station: 7, pflicht: false, koerper: ["Pyramide"],
      einleitung: "Die Glaspyramide vor dem Louvre in Paris hat eine quadratische Grundfläche mit etwa 35 m Seitenlänge und ist 21,6 m hoch.",
      skizze: "louvre",
      teile: [
        { id: "a", afb: 1, thema: "pyramide", einheit: "m³",
          text: "Berechne das Volumen der Pyramide. Runde auf ganze m³.",
          wert: t12_V,
          hilfen: ["V = ⅓ · G · h", "Die Grundfläche ist ein Quadrat."],
          weg: "V = ⅓ · 35² · 21,6 = 8820 m³" },
        { id: "b1", marke: "b)", afb: 2, thema: "pythagoras", einheit: "m",
          text: "Berechne zuerst die Höhe einer Seitenfläche. Runde auf zwei Dezimalstellen.",
          wert: t12_hs,
          hilfen: ["Pyramidenhöhe, halbe Grundkante und Seitenhöhe bilden ein rechtwinkliges Dreieck.", "Die Seitenhöhe ist die Hypotenuse."],
          weg: "hₛ = √(21,6² + 17,5²) ≈ 27,80 m" },
        { id: "b2", marke: "b)", afb: 2, thema: "pyramide", einheit: "m²",
          text: "Berechne die Glasfläche der vier Seitenwände. Runde auf ganze m².",
          wert: 4 * 0.5 * 35 * t12_hs,
          hilfen: ["Jede Seitenwand ist ein Dreieck.", "M = 4 · ½ · a · hₛ"],
          weg: "M = 4 · ½ · 35 · 27,80 ≈ 1946 m²" },
        { id: "c", afb: 2, thema: "pyramide", einheit: "m",
          text: "Bestimme die Kantenlänge eines Würfels mit demselben Volumen. Runde auf eine Dezimalstelle.",
          wert: kubikwurzel(t12_V),
          hilfen: ["Ein Würfel hat das Volumen a³.", "Ziehe aus dem Volumen die dritte Wurzel."],
          weg: "a = ∛8820 ≈ 20,7 m" }
      ]
    },
    {
      id: 13, titel: "Kugelstoßen", station: 8, pflicht: true, koerper: ["Kugel"],
      einleitung: "Beim Kugelstoßen der Frauen wird eine Kugel mit 4 kg Masse benutzt. Eine Trainingskugel aus Gusseisen (1 cm³ wiegt 7,2 g) hat den Durchmesser 11 cm.",
      skizze: "kugel",
      teile: [
        { id: "a", afb: 1, thema: "kugel", einheit: "cm³",
          text: "Berechne das Volumen der Trainingskugel. Runde auf eine Dezimalstelle.",
          wert: t13_V,
          hilfen: ["V = 4⁄3 · π · r³", "Nimm den Radius, nicht den Durchmesser."],
          weg: "V = 4/3 · π · 5,5³ ≈ 696,9 cm³" },
        { id: "b", afb: 2, thema: "einheiten", einheit: "kg",
          text: "Berechne die Masse der Trainingskugel. Runde auf zwei Dezimalstellen in kg.",
          wert: (t13_V * 7.2) / 1000,
          hilfen: ["Jeder cm³ wiegt 7,2 g.", "1 kg = 1000 g"],
          weg: "696,9 · 7,2 g ≈ 5018 g ≈ 5,02 kg" },
        { id: "c", afb: 2, thema: "kugel", einheit: "cm",
          text: "Bestimme den Durchmesser, den eine Gusseisenkugel mit genau 4 kg haben muss. Runde auf eine Dezimalstelle in cm.",
          wert: 2 * kubikwurzel((3 * (4000 / 7.2)) / (4 * PI)),
          hilfen: ["Rechne zuerst aus, welches Volumen 4000 g Gusseisen haben.", "Stelle V = 4⁄3 · π · r³ nach r um. Am Ende brauchst du den Durchmesser."],
          weg: "V = 4000 : 7,2 ≈ 555,6 cm³; r = ∛(3V : 4π) ≈ 5,10 cm; d ≈ 10,2 cm" }
      ]
    },
    {
      id: 14, titel: "Discokugel", station: 9, pflicht: false, koerper: ["Kugel"],
      einleitung: "Eine Discokugel hat den Durchmesser 30 cm. Sie wird mit quadratischen Spiegelplättchen mit 1 cm Seitenlänge beklebt. Etwa 10 % der Oberfläche bleiben als Fugen frei.",
      skizze: "disco",
      teile: [
        { id: "a", afb: 1, thema: "kugel", einheit: "cm²",
          text: "Berechne den Oberflächeninhalt der Kugel. Runde auf eine Dezimalstelle.",
          wert: t14_O,
          hilfen: ["O = 4πr²", "Der Radius ist halb so groß wie der Durchmesser."],
          weg: "O = 4π · 15² ≈ 2827,4 cm²" },
        { id: "b", afb: 2, thema: "prozent", einheit: "Plättchen", abs: 50,
          text: "Berechne, wie viele Plättchen man ungefähr braucht. Runde auf ganze Hundert.",
          wert: t14_O * 0.9,
          hilfen: ["Nur 90 % der Oberfläche werden beklebt.", "Ein Plättchen bedeckt genau 1 cm²."],
          weg: "0,9 · 2827,4 ≈ 2545 ⇒ etwa 2500 Plättchen" },
        { id: "c1", marke: "c)", afb: 2, thema: "kugel", einheit: "Plättchen", abs: 250,
          text: "Berechne, wie viele Plättchen man ungefähr für eine Discokugel mit doppeltem Durchmesser (60 cm) braucht. Runde auf ganze Hundert.",
          wert: 4 * PI * 30 ** 2 * 0.9,
          hilfen: ["Rechne wie in a) und b), jetzt mit r = 30 cm.", "Ziehe wieder 10 % für die Fugen ab."],
          weg: "0,9 · 4π · 30² ≈ 10 179 ⇒ etwa 10 200 (≈ 4 · 2500)" },
        { id: "c2", marke: "c)", afb: 3, thema: "wachstum", typ: "auswahl",
          text: "Begründe oder widerlege: „Für eine Discokugel mit doppeltem Durchmesser braucht man doppelt so viele Plättchen.“",
          schritte: [
            { frage: "Die Aussage …", optionen: ["… stimmt.", "… stimmt nicht."], richtig: 1 },
            { frage: "Begründung:", optionen: ["Man braucht achtmal so viele, weil das Volumen achtmal so groß wird.", "Man braucht doppelt so viele, weil der Durchmesser doppelt so groß ist.", "Man braucht viermal so viele, weil die Oberfläche mit dem Quadrat des Radius wächst."], richtig: 2 }
          ],
          freitext: "Begründe mit der Formel für die Oberfläche.",
          hilfen: ["Vergleiche deine Ergebnisse aus b) und c).", "Setze 2r in O = 4πr² ein."],
          weg: "O ~ r² ⇒ viermal so viele" }
      ]
    },
    {
      id: 15, titel: "Flüssiggastank", station: 10, pflicht: true, koerper: ["Zylinder", "Kugel"],
      einleitung: "Ein Flüssiggastank besteht aus einem Zylinder mit zwei angesetzten Halbkugeln. Er ist insgesamt 4,0 m lang und hat den Durchmesser 1,2 m.",
      skizze: "tank",
      teile: [
        { id: "a1", marke: "a)", afb: 1, thema: "zylinder", einheit: "m³",
          text: "Berechne das Volumen des zylinderförmigen Mittelteils. Runde auf zwei Dezimalstellen.",
          wert: t15_Vz,
          hilfen: ["Die beiden Halbkugeln stecken in der Gesamtlänge. Wie lang ist der Zylinder allein?", "Jede Halbkugel ist so lang wie der Radius."],
          weg: "Länge 4,0 − 1,2 = 2,8 m; π · 0,6² · 2,8 ≈ 3,17 m³" },
        { id: "a2", marke: "a)", afb: 2, thema: "kugel", einheit: "m³",
          text: "Berechne das Volumen des ganzen Tanks. Runde auf zwei Dezimalstellen.",
          wert: t15_V,
          hilfen: ["Zwei Halbkugeln ergeben zusammen eine ganze Kugel.", "V = 4⁄3 · π · r³, dazu das Zylindervolumen."],
          weg: "3,167 + 0,905 ≈ 4,07 m³" },
        { id: "b", afb: 1, thema: "einheiten", einheit: "l",
          text: "Aus Sicherheitsgründen darf der Tank nur zu 85 % gefüllt werden. Berechne, wie viele Liter höchstens eingefüllt werden dürfen. Runde auf ganze Liter.",
          wert: t15_V * 0.85 * 1000,
          hilfen: ["1 m³ = 1000 Liter", "85 % von einem Wert: mit 0,85 multiplizieren."],
          weg: "0,85 · 4071,5 l ≈ 3461 l" },
        { id: "c1", marke: "c)", afb: 2, thema: "zylinder", einheit: "m²",
          text: "Berechne die Oberfläche des Zylindertanks. Runde auf zwei Dezimalstellen.",
          wert: 2 * PI * 0.6 * 2.8 + 4 * PI * 0.6 ** 2,
          hilfen: ["Die Hülle besteht aus dem Zylindermantel und den zwei Halbkugeln. Boden und Deckel gibt es nicht.", "Mantel 2πrh, die beiden Halbkugeln zusammen 4πr²."],
          weg: "2π · 0,6 · 2,8 + 4π · 0,6² ≈ 15,08 m²" },
        { id: "c2", marke: "c)", afb: 3, thema: "kugel", einheit: "m",
          text: "Ein Hersteller bietet einen kugelförmigen Tank mit gleichem Volumen an. Berechne seinen Radius. Runde auf zwei Dezimalstellen.",
          wert: t15_rK,
          hilfen: ["Setze das Volumen aus a) in V = 4⁄3 · π · r³ ein.", "Stelle nach r³ um und ziehe die dritte Wurzel."],
          weg: "r = ∛(3 · 4,07 : 4π) ≈ 0,99 m" },
        { id: "c3", marke: "c)", afb: 3, thema: "kugel", einheit: "m²",
          text: "Berechne die Oberfläche des Kugeltanks. Runde auf zwei Dezimalstellen.",
          wert: 4 * PI * t15_rK ** 2,
          hilfen: ["O = 4πr²", "Rechne mit dem ungerundeten Radius weiter."],
          weg: "O = 4π · 0,99² ≈ 12,33 m²" },
        { id: "c4", marke: "c)", afb: 3, thema: "kugel", typ: "auswahl",
          text: "Untersuche, welcher Tank weniger Material für die Außenhülle braucht, und nenne einen Grund, warum trotzdem oft liegende Zylindertanks verwendet werden.",
          schritte: [
            { frage: "Weniger Material braucht …", optionen: ["… der Zylindertank.", "… der Kugeltank.", "Beide brauchen gleich viel."], richtig: 1 },
            { frage: "Ein Grund für den Zylindertank:", optionen: ["Er fasst bei gleicher Außenhülle mehr Gas.", "Er ist flacher, passt besser auf ein Grundstück und lässt sich leichter transportieren und lagern.", "Er braucht weniger Material als die Kugel."], richtig: 1 }
          ],
          freitext: "Nenne weitere Gründe aus deiner Sicht.",
          hilfen: ["Vergleiche deine Ergebnisse aus c).", "Denke an den Lkw, der den Tank anliefert, und an den Platz im Garten."],
          weg: "Kugel ≈ 12,33 m² < 15,08 m²; Zylinder flacher, leichter zu transportieren" }
      ]
    }
  ];

  // Wiederholungskarten: Nach zwei verfehlten Teilaufgaben zum selben Thema erscheint die Karte.
  const WIEDERHOLUNG = {
    kreis: {
      name: "Kreisumfang", formel: true,
      merke: "u = 2πr = πd",
      tipps: ["Achte darauf, ob der Radius oder der Durchmesser gegeben ist.", "Strecke pro Umdrehung eines Rades = Umfang.", "Einheiten zuerst angleichen, z. B. km in cm."],
      buch: "Wiederhole den Kreisumfang und rechne zwei Aufgaben zur Station 1."
    },
    kreisflaeche: {
      name: "Kreisfläche", formel: true,
      merke: "A = πr²",
      tipps: ["In der Formel steht der Radius, nicht der Durchmesser.", "Erst quadrieren, dann mit π multiplizieren.", "Kreisring: großer Kreis minus kleiner Kreis."],
      buch: "Wiederhole die Kreisfläche und rechne zwei Aufgaben zur Station 2."
    },
    kreisteil: {
      name: "Kreisausschnitt, Bogen und Kreisring", formel: true,
      merke: "Bogen b = α : 360° · 2πr · Ausschnitt A = α : 360° · πr² · Ring A = π(R² − r²)",
      tipps: ["α : 360° ist der Anteil am ganzen Kreis.", "Beim Kreisring zuerst quadrieren, dann subtrahieren: R² − r² ist nicht (R − r)².", "Mantel eines Kegels: Der Bogen wird zum Umfang der Öffnung."],
      buch: "Wiederhole Kreisausschnitt und Kreisbogen und rechne zwei Aufgaben zur Station 3."
    },
    zylinder: {
      name: "Zylinder", formel: true,
      merke: "V = πr² · h · M = 2πr · h · O = 2πr² + 2πrh",
      tipps: ["1 l = 1 dm³ = 1000 cm³", "Ist nach der Höhe oder dem Radius gefragt, stelle V = πr²h um.", "Oberfläche = zwei Kreise und ein Rechteck als Mantel."],
      buch: "Wiederhole Oberfläche und Volumen des Zylinders (Stationen 4 und 5)."
    },
    kegel: {
      name: "Kegel", formel: true,
      merke: "V = ⅓πr² · h · M = πr · s · O = πr² + πrs · s² = r² + h²",
      tipps: ["Das Drittel beim Volumen nicht vergessen.", "Mantelfläche braucht s, Volumen braucht h.", "Halbe Höhe eines Kegels: auch der Radius halbiert sich."],
      buch: "Wiederhole Mantel und Volumen des Kegels (Stationen 6 und 7)."
    },
    pyramide: {
      name: "Pyramide", formel: true,
      merke: "V = ⅓ · G · h · M = Summe der Seitendreiecke · quadratische Grundfläche: M = 2 · a · hₛ",
      tipps: ["Für die Seitenflächen brauchst du die Seitenhöhe hₛ, nicht die Pyramidenhöhe h.", "hₛ² = h² + (a/2)²", "Das Drittel beim Volumen nicht vergessen."],
      buch: "Wiederhole Oberfläche und Volumen der Pyramide (Stationen 6 und 7)."
    },
    kugel: {
      name: "Kugel", formel: true,
      merke: "V = 4⁄3 · πr³ · O = 4πr²",
      tipps: ["Zuerst den Radius bestimmen.", "Radius aus dem Volumen: r = ∛(3V : 4π)", "Zwei Halbkugeln ergeben eine ganze Kugel."],
      buch: "Wiederhole Volumen und Oberfläche der Kugel (Stationen 8 und 9)."
    },
    pythagoras: {
      name: "Satz des Pythagoras", formel: false,
      merke: "Im rechtwinkligen Dreieck gilt a² + b² = c². c ist die Hypotenuse gegenüber dem rechten Winkel.",
      tipps: ["In Pyramide und Kegel steckt der rechte Winkel zwischen Höhe und Grundfläche.", "Kathete gesucht? Dann c² − a² rechnen.", "Zeichne das Dreieck einzeln heraus."],
      buch: "Wiederhole den Satz des Pythagoras (Kl. 9) und rechne zwei Übungsaufgaben."
    },
    wachstum: {
      name: "Vergrößern: Längen, Flächen, Volumen", formel: false,
      merke: "Werden alle Längen mit k multipliziert, wachsen Flächen mit k² und Volumen mit k³.",
      tipps: ["Doppelter Radius: viermal so viel Fläche, achtmal so viel Volumen.", "Ändert sich nur eine Länge, rechne lieber beide Fälle konkret aus.", "Prozentvergleich: neu : alt − 1"],
      buch: "Rechne ein Beispiel: Quadrat mit Seite 1 und 2, Würfel mit Kante 1 und 2. Vergleiche Fläche und Volumen."
    },
    prozent: {
      name: "Prozent und Vergleiche", formel: false,
      merke: "Prozentsatz = Prozentwert : Grundwert · 100 · 10 % mehr = mal 1,1",
      tipps: ["Überlege zuerst, was der Grundwert (100 %) ist.", "Preise vergleicht man pro gleicher Menge, z. B. pro 100 cm².", "Ungerundet weiterrechnen, erst am Ende runden."],
      buch: "Wiederhole die Prozentrechnung (Grundwert, Prozentwert, Prozentsatz)."
    },
    einheiten: {
      name: "Einheiten und Masse", formel: false,
      merke: "1 m³ = 1000 dm³ = 1000 l · 1 dm³ = 1000 cm³ · Masse = Volumen · Dichte",
      tipps: ["Rechne alle Längen in dieselbe Einheit um, bevor du einsetzt.", "1 kg = 1000 g", "Bei Volumen ist der Umrechnungsfaktor 1000, nicht 10."],
      buch: "Wiederhole die Umrechnung von Volumeneinheiten."
    }
  };

  const AFB = { 1: "AFB I", 2: "AFB II", 3: "AFB III" };
  const AFB_TEXT = { 1: "Grundwissen anwenden", 2: "Zusammenhänge herstellen", 3: "Begründen, beurteilen, verallgemeinern" };
  for (const a of AUFGABEN) for (const t of a.teile) { t.typ = t.typ || "zahl"; t.marke = t.marke || t.id + ")"; }

  const ziel = typeof window !== "undefined" ? window : globalThis;
  ziel.AUFGABEN = AUFGABEN;
  ziel.WIEDERHOLUNG = WIEDERHOLUNG;
  ziel.AFB = AFB;
  ziel.AFB_TEXT = AFB_TEXT;
  if (typeof module !== "undefined") module.exports = { AUFGABEN, WIEDERHOLUNG, AFB, AFB_TEXT };
})();
