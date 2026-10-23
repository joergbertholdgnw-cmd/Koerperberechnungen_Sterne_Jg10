/*
 * Aufgabensammlung „Körperberechnungen mit Sternen“ (Klasse 10)
 *
 * Jede Aufgabe hat ein Niveau (1 = ★ Basis, 2 = ★★ Standard, 3 = ★★★ Expert),
 * jede Teilaufgabe zusätzlich ein eigenes Niveau.
 * satz: Welches Wissen die Teilaufgabe hauptsächlich prüft. Daraus entstehen
 * die Wiederholungshinweise (siehe WIEDERHOLUNG unten).
 * wert: exakter Sollwert (aus den Angaben berechnet, nicht gerundet).
 * weg: Rechenweg für die Lehrkraft. Er wird in der App nicht angezeigt.
 */
(function () {
  const PI = Math.PI;
  const wurzel = Math.sqrt;
  const rad = (g) => (g * PI) / 180;
  const grad = (b) => (b * 180) / PI;
  const sin = (g) => Math.sin(rad(g));
  const cos = (g) => Math.cos(rad(g));

  // Zwischengrößen, die in mehreren Teilaufgaben gebraucht werden
  const t4_hs = wurzel(146 ** 2 + 115 ** 2);
  const t7_hk = wurzel(12 ** 2 - 10 ** 2);
  const t9_hs = wurzel(21.6 ** 2 + 17.7 ** 2);
  const t9_k = wurzel(t9_hs ** 2 + 17.7 ** 2);
  const t10_r = (12 ** 2 + 6 ** 2) / (2 * 6);
  const t10_phi = grad(Math.acos((2 * t10_r ** 2 - 24 ** 2) / (2 * t10_r ** 2)));
  const t12_hd = wurzel(6 ** 2 - 3 ** 2);
  const t12_A = 0.5 * 6 * t12_hd;
  const t12_hk = wurzel(6 ** 2 - (2 / 3 * t12_hd) ** 2);
  const t13_d = (40 * sin(32)) / sin(16);
  const t13_h = t13_d * sin(48);
  const t14_s = (15 * sin(20)) / sin(15);
  const t14_h = t14_s * sin(35);
  const t14_r = t14_s * cos(35);
  const t16_p = 2.5 ** 2 / 6.5;
  const t16_r = wurzel(t16_p * (6.5 - t16_p));
  const t18_g = grad(Math.acos((4 ** 2 + 5 ** 2 - 6 ** 2) / (2 * 4 * 5)));
  const t18_A = 0.5 * 4 * 5 * sin(t18_g);

  const AUFGABEN = [
    // ───────────── ★ Basis ─────────────
    {
      id: 1, niveau: 1, titel: "Die Eistüte", koerper: ["Kegel"],
      einleitung: "Eine Eiswaffel hat die Form eines Kegels. Die Öffnung hat einen Durchmesser von 5 cm, die Mantellinie (vom Rand bis zur Spitze) ist 12 cm lang.",
      skizze: "eistuete",
      teile: [
        { id: "a", niveau: 1, satz: "pythagoras", einheit: "cm",
          text: "Wie tief ist die Waffel? Berechne die Höhe h des Kegels.",
          wert: wurzel(12 ** 2 - 2.5 ** 2),
          hilfen: ["Zeichne einen Schnitt durch die Spitze und die Mitte der Öffnung. Wo entsteht ein rechtwinkliges Dreieck?", "Die Seiten des Dreiecks sind der Radius, die Höhe und die Mantellinie. Welche davon ist die Hypotenuse?"],
          weg: "r = 2,5 cm; h = √(12² − 2,5²) = √137,75 ≈ 11,74 cm" },
        { id: "b", niveau: 1, satz: "kegel", einheit: "cm³",
          text: "Wie viel Eis passt in die Waffel, wenn sie bis zum Rand gefüllt ist? Berechne das Volumen.",
          wert: (PI * 2.5 ** 2 * wurzel(12 ** 2 - 2.5 ** 2)) / 3,
          hilfen: ["Ein Kegel hat ein Drittel des Volumens eines Zylinders mit gleicher Grundfläche und Höhe.", "V = ⅓ · π · r² · h. Nimm den Radius, nicht den Durchmesser."],
          weg: "V = ⅓ · π · 2,5² · 11,74 ≈ 76,82 cm³" },
        { id: "c", niveau: 1, satz: "kegel", einheit: "cm²",
          text: "Wie viel Waffelteig braucht man für den Mantel? Berechne die Mantelfläche.",
          wert: PI * 2.5 * 12,
          hilfen: ["Die Mantelfläche eines Kegels hängt vom Radius und der Mantellinie ab, nicht von der Höhe.", "M = π · r · s"],
          weg: "M = π · 2,5 · 12 ≈ 94,25 cm²" }
      ]
    },
    {
      id: 2, niveau: 1, titel: "Die Terrasse im Rasenkreis", koerper: ["Kreis"],
      einleitung: "Eine rechteckige Terrasse ist 8 m lang und 6 m breit. Um die Terrasse herum soll ein kreisrunder Rasen angelegt werden, sodass alle vier Ecken der Terrasse genau auf dem Kreisrand liegen.",
      skizze: "terrasse",
      teile: [
        { id: "a", niveau: 1, satz: "pythagoras", einheit: "m",
          text: "Berechne die Länge der Diagonale der Terrasse.",
          wert: 10,
          hilfen: ["Die Diagonale teilt das Rechteck in zwei rechtwinklige Dreiecke.", "Die Diagonale ist die Hypotenuse, die Seiten der Terrasse sind die Katheten."],
          weg: "d = √(8² + 6²) = √100 = 10 m" },
        { id: "b", niveau: 1, satz: "kreis", einheit: "m",
          text: "Um den Rasen soll eine Beeteinfassung gelegt werden. Wie lang ist sie (Umfang des Kreises)?",
          wert: 10 * PI,
          hilfen: ["Überlege, warum die Diagonale der Terrasse ein Durchmesser des Kreises ist.", "u = π · d"],
          weg: "Diagonale = Durchmesser = 10 m; u = π · 10 ≈ 31,42 m" },
        { id: "c", niveau: 1, satz: "kreis", einheit: "m²",
          text: "Berechne den Flächeninhalt des ganzen Kreises.",
          wert: 25 * PI,
          hilfen: ["Für die Kreisfläche brauchst du den Radius.", "A = π · r²"],
          weg: "A = π · 5² ≈ 78,54 m²" },
        { id: "d", niveau: 2, satz: "kreis", einheit: "m²",
          text: "Wie viel Quadratmeter Rasen müssen ausgesät werden (Kreisfläche ohne Terrasse)?",
          wert: 25 * PI - 48,
          hilfen: ["Die Rasenfläche ist das, was vom Kreis übrig bleibt.", "Ziehe die Rechteckfläche von der Kreisfläche ab."],
          weg: "78,54 − 8 · 6 ≈ 30,54 m²" }
      ]
    },
    {
      id: 3, niveau: 1, titel: "Die Getränkedose", koerper: ["Zylinder"],
      einleitung: "Eine zylinderförmige Getränkedose hat einen Durchmesser von 6 cm und eine Höhe von 11,5 cm. Vereinfachung: Die Dose ist ein exakter Zylinder.",
      skizze: "dose",
      teile: [
        { id: "a", niveau: 1, satz: "zylinder", einheit: "cm³",
          text: "Berechne das Volumen der Dose.",
          wert: PI * 3 ** 2 * 11.5,
          hilfen: ["Volumen eines Zylinders: Grundfläche mal Höhe.", "V = π · r² · h mit r = 3 cm."],
          weg: "V = π · 3² · 11,5 ≈ 325,15 cm³" },
        { id: "b", niveau: 1, satz: "zylinder", einheit: "cm²",
          text: "Wie viel Blech braucht man für die Dose? Berechne die Oberfläche.",
          wert: 2 * PI * 3 ** 2 + 2 * PI * 3 * 11.5,
          hilfen: ["Die Oberfläche besteht aus Boden, Deckel und dem Mantel. Stell dir den Mantel abgerollt als Rechteck vor.", "O = 2 · π · r² + 2 · π · r · h"],
          weg: "O = 2π · 9 + 2π · 3 · 11,5 ≈ 56,55 + 216,77 = 273,32 cm²" },
        { id: "c", niveau: 1, satz: "pythagoras", einheit: "cm",
          text: "Wie lang darf ein Strohhalm höchstens sein, damit er schräg vollständig in die Dose passt (vom Bodenrand bis zum gegenüberliegenden oberen Rand)?",
          wert: wurzel(6 ** 2 + 11.5 ** 2),
          hilfen: ["Schneide die Dose längs durch die Mitte auf. Welche Form hat die Schnittfläche?", "Der Strohhalm ist die Diagonale eines Rechtecks mit den Seiten Durchmesser und Höhe."],
          weg: "√(6² + 11,5²) = √168,25 ≈ 12,97 cm" },
        { id: "d", niveau: 1, satz: "pythagoras", einheit: "cm",
          text: "Ein 18 cm langer Strohhalm wird schräg bis zum gegenüberliegenden Bodenrand in die Dose gesteckt und liegt am oberen Rand an. Wie weit ragt er heraus?",
          wert: 18 - wurzel(6 ** 2 + 11.5 ** 2),
          hilfen: ["Der Teil in der Dose ist genau so lang wie in Teilaufgabe c.", "Ziehe die Länge in der Dose von der Gesamtlänge ab."],
          weg: "18 − 12,97 ≈ 5,03 cm" }
      ]
    },
    {
      id: 4, niveau: 1, titel: "Die Cheops-Pyramide", koerper: ["Pyramide"],
      einleitung: "Die Cheops-Pyramide in Gizeh ist eine quadratische Pyramide. Ursprünglich war ihre Grundseite etwa 230 m lang und sie war etwa 146 m hoch.",
      skizze: "pyramide_cheops",
      teile: [
        { id: "a", niveau: 1, satz: "pythagoras", einheit: "m",
          text: "Berechne die Höhe h<sub>s</sub> einer Seitenfläche (vom Mittelpunkt einer Grundkante bis zur Spitze).",
          wert: t4_hs,
          hilfen: ["Betrachte das Dreieck aus Pyramidenhöhe, halber Grundseite und h<sub>s</sub>.", "Die halbe Grundseite ist 115 m. Wo liegt der rechte Winkel?"],
          weg: "h_s = √(146² + 115²) = √34541 ≈ 185,85 m" },
        { id: "b", niveau: 1, satz: "pyramide", einheit: "m²",
          text: "Die Pyramide war früher mit hellem Kalkstein verkleidet. Wie groß war die verkleidete Fläche (Mantelfläche)?",
          wert: 4 * 0.5 * 230 * t4_hs,
          hilfen: ["Der Mantel besteht aus vier gleichen Dreiecken.", "Ein Dreieck: ½ · Grundseite · h<sub>s</sub>."],
          weg: "M = 4 · ½ · 230 · 185,85 ≈ 85 492 m²" },
        { id: "c", niveau: 1, satz: "pyramide", einheit: "m³",
          text: "Berechne das Volumen der Pyramide.",
          wert: (230 ** 2 * 146) / 3,
          hilfen: ["Eine Pyramide hat ein Drittel des Volumens eines Prismas mit gleicher Grundfläche und Höhe.", "V = ⅓ · a² · h"],
          weg: "V = ⅓ · 230² · 146 ≈ 2 574 467 m³" },
        { id: "d", niveau: 2, satz: "pythagoras", einheit: "m",
          text: "Wie lang ist eine Seitenkante (von einer Ecke der Grundfläche bis zur Spitze)?",
          wert: wurzel(t4_hs ** 2 + 115 ** 2),
          hilfen: ["Die Seitenkante ist die Hypotenuse in einem Dreieck in der Seitenfläche.", "Nutze h<sub>s</sub> aus Teilaufgabe a und die halbe Grundseite."],
          weg: "s = √(185,85² + 115²) ≈ 218,55 m" }
      ]
    },
    {
      id: 5, niveau: 1, titel: "Der Medizinball auf dem Eimer", koerper: ["Kugel", "Kreis"],
      einleitung: "Ein Medizinball (Kugel) mit 30 cm Durchmesser liegt auf der kreisrunden Öffnung eines Eimers. Die Öffnung hat einen Innendurchmesser von 24 cm.",
      skizze: "medizinball",
      teile: [
        { id: "a", niveau: 1, satz: "kreis", einheit: "cm",
          text: "Berechne den Umfang der Eimeröffnung.",
          wert: 24 * PI,
          hilfen: ["Gegeben ist der Durchmesser.", "u = π · d"],
          weg: "u = π · 24 ≈ 75,40 cm" },
        { id: "b", niveau: 1, satz: "pythagoras", einheit: "cm",
          text: "Wie hoch liegt der Mittelpunkt des Balls über der Ebene des Eimerrands?",
          wert: 9,
          hilfen: ["Zeichne einen Schnitt durch die Mitte: Kreis (Ball) und eine waagerechte Strecke (Eimerrand). Verbinde den Ballmittelpunkt mit einem Berührpunkt am Rand.", "Die Verbindung Mittelpunkt–Berührpunkt ist der Ballradius. Der Eimerradius ist eine Kathete."],
          weg: "√(15² − 12²) = √81 = 9 cm" },
        { id: "c", niveau: 1, satz: "pythagoras", einheit: "cm",
          text: "Wie weit ragt der Ball über den Eimerrand hinaus (höchster Punkt des Balls über der Randebene)?",
          wert: 24,
          hilfen: ["Vom Mittelpunkt bis zum höchsten Punkt ist es genau ein Radius.", "Addiere den Radius zum Ergebnis aus b."],
          weg: "9 + 15 = 24 cm" },
        { id: "d", niveau: 1, satz: "kugel", einheit: "cm³",
          text: "Berechne das Volumen des Balls.",
          wert: (4 / 3) * PI * 15 ** 3,
          hilfen: ["Achte auf den Radius.", "V = 4⁄3 · π · r³"],
          weg: "V = 4⁄3 · π · 15³ ≈ 14 137,17 cm³" },
        { id: "e", niveau: 1, satz: "kugel", einheit: "cm²",
          text: "Der Ball wird neu bezogen. Wie groß ist seine Oberfläche?",
          wert: 4 * PI * 15 ** 2,
          hilfen: ["Die Kugeloberfläche ist so groß wie vier Großkreisflächen.", "O = 4 · π · r²"],
          weg: "O = 4π · 225 ≈ 2827,43 cm²" }
      ]
    },
    {
      id: 6, niveau: 1, titel: "Der Tunnel", koerper: ["Kreis", "Zylinder"],
      einleitung: "Ein 250 m langer Fußgängertunnel hat einen halbkreisförmigen Querschnitt. Am Boden ist er 10 m breit. Eine Messstelle M liegt auf dem Boden 3,6 m von der linken Tunnelwand entfernt.",
      skizze: "tunnel",
      teile: [
        { id: "a", niveau: 1, satz: "hoehensatz", einheit: "m",
          text: "Wie hoch ist der Tunnel senkrecht über der Messstelle M?",
          wert: wurzel(3.6 * 6.4),
          hilfen: ["Verbinde den Deckenpunkt D über M mit den beiden unteren Ecken. Nach dem Satz des Thales ist das Dreieck rechtwinklig.", "Die gesuchte Höhe ist die Höhe dieses Dreiecks. Sie teilt den Boden in 3,6 m und 6,4 m. Welcher Satz verbindet diese drei Größen?"],
          weg: "Thales: Dreieck ABD rechtwinklig bei D. Höhensatz: h² = 3,6 · 6,4 = 23,04 → h = 4,8 m" },
        { id: "b", niveau: 2, satz: "kathetensatz", einheit: "m",
          text: "Von der linken unteren Ecke A wird ein Seil straff zum Deckenpunkt D über der Messstelle gespannt. Wie lang ist das Seil?",
          wert: wurzel(10 * 3.6),
          hilfen: ["Das Seil ist eine Kathete im rechtwinkligen Dreieck aus Teilaufgabe a.", "Die Kathete hängt mit der Hypotenuse (10 m) und ihrem anliegenden Hypotenusenabschnitt zusammen."],
          weg: "Kathetensatz: AD² = 10 · 3,6 = 36 → AD = 6 m" },
        { id: "c", niveau: 1, satz: "kreis", einheit: "m²",
          text: "Berechne den Flächeninhalt des Tunnelquerschnitts.",
          wert: (PI * 5 ** 2) / 2,
          hilfen: ["Der Querschnitt ist ein halber Kreis.", "A = ½ · π · r²"],
          weg: "A = ½ · π · 5² ≈ 39,27 m²" },
        { id: "d", niveau: 1, satz: "zylinder", einheit: "m³",
          text: "Wie viel Kubikmeter Erde mussten für den Tunnel ausgehoben werden (Volumen des Tunnelinnenraums)?",
          wert: ((PI * 5 ** 2) / 2) * 250,
          hilfen: ["Der Tunnel ist ein halber Zylinder.", "Volumen = Querschnittsfläche · Länge."],
          weg: "V = 39,27 · 250 ≈ 9817,48 m³" }
      ]
    },

    // ───────────── ★★ Standard ─────────────
    {
      id: 7, niveau: 2, titel: "Das Zirkuszelt", koerper: ["Zylinder", "Kegel"],
      einleitung: "Ein Zirkuszelt besteht aus einem zylinderförmigen Unterteil (Radius 10 m, Wandhöhe 4 m) und einem kegelförmigen Dach. Die Dachplane ist vom Rand bis zur Spitze 12 m lang.",
      skizze: "zirkus",
      teile: [
        { id: "a", niveau: 1, satz: "pythagoras", einheit: "m",
          text: "Berechne die Höhe des Kegeldachs.",
          wert: t7_hk,
          hilfen: ["Schneide das Dach senkrecht durch die Spitze: Es entsteht ein rechtwinkliges Dreieck.", "Die 12 m lange Dachplane ist die Hypotenuse."],
          weg: "h = √(12² − 10²) = √44 ≈ 6,63 m" },
        { id: "b", niveau: 1, satz: "pythagoras", einheit: "m",
          text: "Wie hoch ist das Zelt insgesamt (Boden bis Spitze)?",
          wert: 4 + t7_hk,
          hilfen: ["Das Zelt besteht aus zwei Teilen übereinander.", "Wandhöhe + Dachhöhe."],
          weg: "4 + 6,63 ≈ 10,63 m" },
        { id: "c", niveau: 2, satz: "kegel", einheit: "m³",
          text: "Für die Belüftung muss man das Luftvolumen kennen. Berechne das Volumen des ganzen Zeltes.",
          wert: PI * 10 ** 2 * 4 + (PI * 10 ** 2 * t7_hk) / 3,
          hilfen: ["Berechne Zylinder und Kegel einzeln und addiere.", "V = π r² · h<sub>Z</sub> + ⅓ π r² · h<sub>K</sub>"],
          weg: "V = π · 100 · 4 + ⅓ · π · 100 · 6,63 ≈ 1256,64 + 694,63 = 1951,27 m³" },
        { id: "d", niveau: 2, satz: "kegel", einheit: "m²",
          text: "Wie viel Zeltplane braucht man für Wand und Dach zusammen (ohne Boden)?",
          wert: 2 * PI * 10 * 4 + PI * 10 * 12,
          hilfen: ["Gesucht sind die Mantelfläche des Zylinders und die Mantelfläche des Kegels.", "M<sub>Z</sub> = 2πrh, M<sub>K</sub> = πrs"],
          weg: "2π · 10 · 4 + π · 10 · 12 ≈ 251,33 + 376,99 = 628,32 m²" }
      ]
    },
    {
      id: 8, niveau: 2, titel: "Das Riesenrad", koerper: ["Kreis"],
      einleitung: "Ein Riesenrad hat einen Durchmesser von 60 m. An seinem Rand hängen 24 Gondeln in gleichen Abständen. Die Aufhängepunkte liegen genau auf dem Kreis.",
      skizze: "riesenrad",
      teile: [
        { id: "a", niveau: 1, satz: "kreis", einheit: "m",
          text: "Welche Strecke legt eine Gondel bei einer vollen Umdrehung zurück?",
          wert: 60 * PI,
          hilfen: ["Gesucht ist der Umfang.", "u = π · d"],
          weg: "u = 60π ≈ 188,50 m" },
        { id: "b", niveau: 1, satz: "kreis", einheit: "m",
          text: "Wie lang ist der Kreisbogen zwischen zwei benachbarten Gondeln?",
          wert: (60 * PI) / 24,
          hilfen: ["Die 24 Gondeln teilen den Umfang in gleich lange Bögen.", "Teile den Umfang durch die Anzahl der Abstände."],
          weg: "188,50 : 24 ≈ 7,85 m" },
        { id: "c", niveau: 2, satz: "kreis", einheit: "°",
          text: "Wie groß ist der Mittelpunktswinkel zwischen Gondel 1 und Gondel 4?",
          wert: 45,
          hilfen: ["Zwischen zwei benachbarten Gondeln liegt ein 24stel des Vollwinkels.", "Zwischen Gondel 1 und 4 liegen drei Abstände."],
          weg: "3 · 360° : 24 = 45°" },
        { id: "d", niveau: 2, satz: "kosinussatz", einheit: "m",
          text: "Ein Techniker will eine gerade Stahlstrebe von Gondel 1 zu Gondel 4 einbauen. Wie lang muss sie sein?",
          wert: wurzel(30 ** 2 + 30 ** 2 - 2 * 30 * 30 * cos(45)),
          hilfen: ["Betrachte das Dreieck aus Mittelpunkt, Gondel 1 und Gondel 4. Zwei Seiten und der eingeschlossene Winkel sind bekannt.", "Wenn zwei Seiten und der eingeschlossene Winkel gegeben sind, hilft der Kosinussatz: c² = a² + b² − 2ab · cos γ."],
          weg: "c² = 30² + 30² − 2 · 30 · 30 · cos 45° ≈ 527,18 → c ≈ 22,96 m" },
        { id: "e", niveau: 2, satz: "kreis", einheit: "m²",
          text: "Das Kreisstück (Kreisausschnitt) zwischen Mittelpunkt, Gondel 1 und Gondel 4 wird mit einer Werbeplane bespannt. Wie groß ist die Fläche?",
          wert: (PI * 30 ** 2 * 45) / 360,
          hilfen: ["Ein Kreisausschnitt ist ein Bruchteil der ganzen Kreisfläche.", "A = π r² · α : 360°"],
          weg: "A = π · 900 · 45 : 360 ≈ 353,43 m²" }
      ]
    },
    {
      id: 9, niveau: 2, titel: "Die Glaspyramide des Louvre", koerper: ["Pyramide"],
      einleitung: "Vor dem Louvre in Paris steht eine quadratische Glaspyramide. Ihre Grundseite ist 35,4 m lang, ihre Höhe beträgt 21,6 m.",
      skizze: "pyramide_louvre",
      teile: [
        { id: "a", niveau: 1, satz: "pythagoras", einheit: "m",
          text: "Berechne die Höhe h<sub>s</sub> einer dreieckigen Seitenfläche.",
          wert: t9_hs,
          hilfen: ["Das Dreieck aus Pyramidenhöhe, halber Grundseite und h<sub>s</sub> ist rechtwinklig.", "Die halbe Grundseite beträgt 17,7 m."],
          weg: "h_s = √(21,6² + 17,7²) ≈ 27,93 m" },
        { id: "b", niveau: 2, satz: "pyramide", einheit: "m²",
          text: "Wie viel Quadratmeter Glas wurden verbaut (Mantelfläche, Rahmen vernachlässigt)?",
          wert: 2 * 35.4 * t9_hs,
          hilfen: ["Vier gleiche Dreiecke bilden den Mantel.", "M = 4 · ½ · a · h<sub>s</sub>"],
          weg: "M = 2 · 35,4 · 27,93 ≈ 1977,15 m²" },
        { id: "c", niveau: 1, satz: "pyramide", einheit: "m³",
          text: "Berechne den umbauten Raum (Volumen).",
          wert: (35.4 ** 2 * 21.6) / 3,
          hilfen: ["V = ⅓ · G · h", "Die Grundfläche ist ein Quadrat."],
          weg: "V = ⅓ · 35,4² · 21,6 ≈ 9022,75 m³" },
        { id: "d", niveau: 2, satz: "pythagoras", einheit: "m",
          text: "Wie lang ist eine Seitenkante der Pyramide?",
          wert: t9_k,
          hilfen: ["Die Seitenkante ist die Hypotenuse in einer halben Seitenfläche.", "Kathete 1: h<sub>s</sub>, Kathete 2: halbe Grundseite."],
          weg: "s = √(27,93² + 17,7²) ≈ 33,06 m" },
        { id: "e", niveau: 3, satz: "kosinussatz", einheit: "°",
          text: "Wie groß ist der Winkel an der Spitze einer Seitenfläche (zwischen zwei Seitenkanten)?",
          wert: grad(Math.acos((2 * t9_k ** 2 - 35.4 ** 2) / (2 * t9_k ** 2))),
          hilfen: ["Eine Seitenfläche ist ein Dreieck, von dem du alle drei Seiten kennst.", "Kosinussatz nach dem Winkel umgestellt: cos γ = (a² + b² − c²) : (2ab)."],
          weg: "cos γ = (2 · 33,06² − 35,4²) : (2 · 33,06²) ≈ 0,4266 → γ ≈ 64,73°" }
      ]
    },
    {
      id: 10, niveau: 2, titel: "Die römische Tellerscherbe", koerper: ["Kreis"],
      einleitung: "Bei einer Ausgrabung wird die Randscherbe eines runden römischen Tellers gefunden. Die Archäologin misst: Die gerade Verbindung zwischen den beiden Enden der Scherbe (Sehne) ist 24 cm lang. Der Rand wölbt sich in der Mitte 6 cm über diese Sehne hinaus.",
      skizze: "teller",
      teile: [
        { id: "a", niveau: 3, satz: "pythagoras", einheit: "cm",
          text: "Welchen Radius hatte der Teller?",
          wert: t10_r,
          hilfen: ["Zeichne den Mittelpunkt M, ein Ende der Sehne und die Mitte der Sehne. Das Dreieck ist rechtwinklig. Der Abstand von M zur Sehne ist r − 6.", "Stelle die Gleichung r² = 12² + (r − 6)² auf und löse sie nach r auf."],
          weg: "r² = 144 + r² − 12r + 36 → 12r = 180 → r = 15 cm" },
        { id: "b", niveau: 1, satz: "kreis", einheit: "cm",
          text: "Wie groß war der Umfang des Tellers?",
          wert: 2 * PI * t10_r,
          hilfen: ["u = 2 · π · r", "Nutze den Radius aus a."],
          weg: "u = 2π · 15 ≈ 94,25 cm" },
        { id: "c", niveau: 1, satz: "kreis", einheit: "cm²",
          text: "Wie groß war die Fläche des Tellers?",
          wert: PI * t10_r ** 2,
          hilfen: ["A = π · r²", "Nutze den Radius aus a."],
          weg: "A = π · 225 ≈ 706,86 cm²" },
        { id: "d", niveau: 2, satz: "kosinussatz", einheit: "°",
          text: "Unter welchem Mittelpunktswinkel erscheint die Scherbe vom Tellermittelpunkt aus?",
          wert: t10_phi,
          hilfen: ["Betrachte das Dreieck aus Mittelpunkt und den beiden Scherbenenden. Alle drei Seiten sind bekannt.", "cos φ = (r² + r² − s²) : (2 · r · r) mit s = 24 cm. Ein negativer Kosinus bedeutet: stumpfer Winkel."],
          weg: "cos φ = (225 + 225 − 576) : 450 = −0,28 → φ ≈ 106,26°" },
        { id: "e", niveau: 2, satz: "kreis", einheit: "cm",
          text: "Wie lang ist der gebogene Rand der Scherbe?",
          wert: (2 * PI * t10_r * t10_phi) / 360,
          hilfen: ["Der Rand ist ein Kreisbogen. Er ist ein Bruchteil des Umfangs.", "b = 2πr · φ : 360°"],
          weg: "b = 94,25 · 106,26 : 360 ≈ 27,82 cm" }
      ]
    },
    {
      id: 11, niveau: 2, titel: "Das Goldfischglas", koerper: ["Kugel", "Kreis"],
      einleitung: "Ein kugelförmiges Goldfischglas hat innen einen Durchmesser von 30 cm. Das Wasser steht 10 cm hoch (gemessen vom tiefsten Punkt). Oben ist das Glas in 26 cm Höhe waagerecht abgeschnitten und offen.",
      skizze: "goldfisch",
      teile: [
        { id: "a", niveau: 2, satz: "hoehensatz", einheit: "cm",
          text: "Welchen Radius hat die kreisförmige Wasseroberfläche?",
          wert: wurzel(10 * 20),
          hilfen: ["Zeichne den senkrechten Durchmesser (30 cm) und einen Randpunkt P der Wasseroberfläche. Nach Thales ist das Dreieck aus P und den Enden des Durchmessers rechtwinklig.", "Der gesuchte Radius ist die Höhe dieses Dreiecks. Sie teilt den Durchmesser in 10 cm und 20 cm."],
          weg: "Höhensatz: ρ² = 10 · 20 = 200 → ρ ≈ 14,14 cm (alternativ Pythagoras: √(15² − 5²))" },
        { id: "b", niveau: 1, satz: "kreis", einheit: "cm",
          text: "Wie lang ist der Wasserrand am Glas (Umfang der Wasseroberfläche)?",
          wert: 2 * PI * wurzel(200),
          hilfen: ["u = 2 · π · r", "Nimm den Radius aus a."],
          weg: "u = 2π · 14,14 ≈ 88,86 cm" },
        { id: "c", niveau: 1, satz: "kreis", einheit: "cm²",
          text: "Wie groß ist die Wasseroberfläche?",
          wert: PI * 200,
          hilfen: ["A = π · r²", "r² kennst du schon aus a."],
          weg: "A = π · 200 ≈ 628,32 cm²" },
        { id: "d", niveau: 2, satz: "hoehensatz", einheit: "cm",
          text: "Welchen Durchmesser hat die runde Öffnung oben (in 26 cm Höhe)?",
          wert: 2 * wurzel(26 * 4),
          hilfen: ["Gehe vor wie in a. Die Öffnung teilt den Durchmesser in zwei Abschnitte.", "Die Abschnitte sind 26 cm und 4 cm. Achtung: Gesucht ist der Durchmesser."],
          weg: "ρ² = 26 · 4 = 104 → ρ ≈ 10,20 cm → d ≈ 20,40 cm" },
        { id: "e", niveau: 1, satz: "kugel", einheit: "l",
          text: "Wie viel Liter würde eine vollständige Kugel mit diesem Innendurchmesser fassen? (1 l = 1000 cm³)",
          wert: ((4 / 3) * PI * 15 ** 3) / 1000,
          hilfen: ["V = 4⁄3 · π · r³", "Rechne cm³ am Ende in Liter um."],
          weg: "V = 4⁄3 · π · 15³ ≈ 14 137 cm³ ≈ 14,14 l" }
      ]
    },
    {
      id: 12, niveau: 2, titel: "Der Pyramiden-Teebeutel", koerper: ["Pyramide"],
      einleitung: "Moderne Teebeutel haben oft die Form eines regelmäßigen Tetraeders: eine dreieckige Pyramide, deren vier Flächen gleichseitige Dreiecke sind. Jede Kante ist 6 cm lang.",
      skizze: "tetraeder",
      teile: [
        { id: "a", niveau: 1, satz: "pythagoras", einheit: "cm",
          text: "Berechne die Höhe eines der gleichseitigen Dreiecke.",
          wert: t12_hd,
          hilfen: ["Die Höhe halbiert die Grundseite des Dreiecks.", "h² + 3² = 6²"],
          weg: "h = √(36 − 9) = √27 ≈ 5,20 cm" },
        { id: "b", niveau: 1, satz: "pyramide", einheit: "cm²",
          text: "Wie viel Stoff braucht man für den Beutel (Oberfläche)?",
          wert: 4 * t12_A,
          hilfen: ["Die Oberfläche besteht aus vier gleichen Dreiecken.", "Ein Dreieck: ½ · 6 · h aus a."],
          weg: "O = 4 · ½ · 6 · 5,20 ≈ 62,35 cm²" },
        { id: "c", niveau: 3, satz: "pythagoras", einheit: "cm",
          text: "Die Spitze liegt genau über dem Schwerpunkt S der Grundfläche. S liegt auf jeder Dreieckshöhe und ist 2⁄3 der Höhe von der Ecke entfernt. Berechne die Körperhöhe des Tetraeders.",
          wert: t12_hk,
          hilfen: ["Bilde ein rechtwinkliges Dreieck aus Körperhöhe, Strecke Ecke–S und einer Kante.", "Ecke–S = 2⁄3 · (Ergebnis aus a). Die Kante (6 cm) ist die Hypotenuse."],
          weg: "ES = 2⁄3 · 5,196 ≈ 3,46 cm; h_K = √(36 − 12) = √24 ≈ 4,90 cm" },
        { id: "d", niveau: 2, satz: "pyramide", einheit: "cm³",
          text: "Wie viel Tee passt höchstens hinein (Volumen)?",
          wert: (t12_A * t12_hk) / 3,
          hilfen: ["V = ⅓ · G · h", "G ist ein gleichseitiges Dreieck, h die Körperhöhe aus c."],
          weg: "V = ⅓ · 15,59 · 4,90 ≈ 25,46 cm³" }
      ]
    },

    // ───────────── ★★★ Expert ─────────────
    {
      id: 13, niveau: 3, titel: "Der Fabrikschornstein", koerper: ["Zylinder"],
      einleitung: "Die Höhe eines alten Fabrikschornsteins soll ohne Klettern bestimmt werden. Von Punkt A aus sieht man die Schornsteinspitze unter einem Höhenwinkel von 32°. Man geht 40 m geradeaus auf den Schornstein zu bis Punkt B und misst dort 48°. Der Schornstein ist ein Hohlzylinder: außen 4 m, innen 3 m Durchmesser. (Die Augenhöhe wird vernachlässigt.)",
      skizze: "schornstein",
      teile: [
        { id: "a", niveau: 1, satz: "sinussatz", einheit: "°",
          text: "Betrachte das Dreieck aus A, B und der Spitze S. Wie groß ist der Winkel bei S?",
          wert: 16,
          hilfen: ["Bestimme zuerst den Innenwinkel bei B im Dreieck ABS (Nebenwinkel von 48°).", "Winkelsumme im Dreieck: 180°."],
          weg: "∠ABS = 180° − 48° = 132°; ∠ASB = 180° − 32° − 132° = 16°" },
        { id: "b", niveau: 3, satz: "sinussatz", einheit: "m",
          text: "Wie weit ist die Spitze S von Punkt B entfernt?",
          wert: t13_d,
          hilfen: ["Im Dreieck ABS kennst du eine Seite und alle Winkel. Das ist ein Fall für den Sinussatz.", "BS : sin(32°) = AB : sin(16°)"],
          weg: "BS = 40 · sin 32° : sin 16° ≈ 76,90 m" },
        { id: "c", niveau: 2, satz: "trigonometrie", einheit: "m",
          text: "Wie hoch ist der Schornstein?",
          wert: t13_h,
          hilfen: ["Vom Fußpunkt F des Schornsteins, B und S entsteht ein rechtwinkliges Dreieck.", "Die Höhe ist die Gegenkathete zum Winkel 48°: h = BS · sin 48°."],
          weg: "h = 76,90 · sin 48° ≈ 57,15 m" },
        { id: "d", niveau: 2, satz: "zylinder", einheit: "m²",
          text: "Der Schornstein soll außen neu verputzt werden. Wie groß ist die Fläche?",
          wert: PI * 4 * t13_h,
          hilfen: ["Gesucht ist die äußere Mantelfläche.", "M = π · d · h"],
          weg: "M = π · 4 · 57,15 ≈ 718,15 m²" },
        { id: "e", niveau: 3, satz: "zylinder", einheit: "m³",
          text: "Wie viel Kubikmeter Mauerwerk stecken im Schornstein?",
          wert: PI * (2 ** 2 - 1.5 ** 2) * t13_h,
          hilfen: ["Mauerwerk = äußerer Zylinder minus innerer Zylinder.", "V = π · (R² − r²) · h mit R = 2 m und r = 1,5 m."],
          weg: "V = π · (4 − 2,25) · 57,15 ≈ 314,19 m³" }
      ]
    },
    {
      id: 14, niveau: 3, titel: "Der Streusalz-Kegel", koerper: ["Kegel"],
      einleitung: "In der Straßenmeisterei liegt ein kegelförmiger Haufen Streusalz. Die Böschung ist überall 35° gegen den Boden geneigt. Lea steht 15 m vom unteren Rand R des Haufens entfernt. Ihr Standpunkt L, der Rand R und die Mitte des Haufens liegen auf einer Geraden. Von L aus sieht sie die Spitze T unter einem Höhenwinkel von 20°.",
      skizze: "streusalz",
      teile: [
        { id: "a", niveau: 2, satz: "sinussatz", einheit: "°",
          text: "Betrachte das Dreieck aus Leas Standpunkt L, dem Fußpunkt R der Böschung und der Spitze T. Wie groß ist der Winkel bei T?",
          wert: 15,
          hilfen: ["Der Winkel bei R im Dreieck LRT ist der Nebenwinkel des Böschungswinkels.", "∠R = 180° − 35°; dann Winkelsumme."],
          weg: "∠LRT = 145°; ∠LTR = 180° − 20° − 145° = 15°" },
        { id: "b", niveau: 3, satz: "sinussatz", einheit: "m",
          text: "Wie lang ist die Mantellinie s des Kegels (Strecke RT)?",
          wert: t14_s,
          hilfen: ["Eine Seite (LR = 15 m) und alle Winkel sind bekannt.", "Sinussatz: RT : sin(20°) = LR : sin(15°)"],
          weg: "s = 15 · sin 20° : sin 15° ≈ 19,82 m" },
        { id: "c", niveau: 2, satz: "trigonometrie", einheit: "m",
          text: "Wie hoch ist der Streusalz-Haufen?",
          wert: t14_h,
          hilfen: ["Im Kegelschnitt liegt ein rechtwinkliges Dreieck mit der Hypotenuse s und dem Winkel 35° bei R.", "h = s · sin 35°"],
          weg: "h = 19,82 · sin 35° ≈ 11,37 m" },
        { id: "d", niveau: 2, satz: "trigonometrie", einheit: "m",
          text: "Berechne den Radius r der Grundfläche.",
          wert: t14_r,
          hilfen: ["Gleiches Dreieck wie in c.", "r = s · cos 35° (oder Pythagoras mit s und h)"],
          weg: "r = 19,82 · cos 35° ≈ 16,24 m" },
        { id: "e", niveau: 2, satz: "kegel", einheit: "m³",
          text: "Wie viel Kubikmeter Streusalz liegen auf dem Haufen?",
          wert: (PI * t14_r ** 2 * t14_h) / 3,
          hilfen: ["V = ⅓ · π · r² · h", "Rechne mit möglichst ungerundeten Zwischenergebnissen."],
          weg: "V = ⅓ · π · 16,24² · 11,37 ≈ 3139 m³" },
        { id: "f", niveau: 2, satz: "kegel", einheit: "m²",
          text: "Gegen Regen wird der Haufen mit einer Plane abgedeckt. Wie groß muss die Plane mindestens sein (Mantelfläche)?",
          wert: PI * t14_r * t14_s,
          hilfen: ["M = π · r · s", "s aus b, r aus d."],
          weg: "M = π · 16,24 · 19,82 ≈ 1011,13 m²" }
      ]
    },
    {
      id: 15, niveau: 3, titel: "Wie weit kann man sehen?", koerper: ["Kugel", "Kreis"],
      einleitung: "Die Erde ist näherungsweise eine Kugel mit dem Radius R = 6371 km. Von einem erhöhten Punkt aus reicht der Blick bis zum Horizont: Die Sichtlinie berührt die Erdoberfläche dort, sie steht also senkrecht auf dem Erdradius.",
      skizze: "horizont",
      teile: [
        { id: "a", niveau: 2, satz: "pythagoras", einheit: "km",
          text: "Ein Leuchtturmwärter schaut aus 60 m Höhe aufs Meer. Wie weit kann er bis zum Horizont sehen?",
          wert: wurzel((6371 + 0.06) ** 2 - 6371 ** 2),
          hilfen: ["Rechtwinkliges Dreieck: Erdmittelpunkt, Horizontpunkt, Auge. Der rechte Winkel liegt am Horizontpunkt.", "Hypotenuse = R + Höhe. Achtung: 60 m = 0,06 km."],
          weg: "d = √(6371,06² − 6371²) ≈ 27,65 km" },
        { id: "b", niveau: 2, satz: "pythagoras", einheit: "km",
          text: "Die Raumstation ISS fliegt in etwa 400 km Höhe. Wie weit reicht der Blick der Astronauten bis zum Horizont?",
          wert: wurzel(6771 ** 2 - 6371 ** 2),
          hilfen: ["Gleiches Vorgehen wie in a.", "Hypotenuse: 6371 km + 400 km."],
          weg: "d = √(6771² − 6371²) ≈ 2292,77 km" },
        { id: "c", niveau: 1, satz: "kreis", einheit: "km",
          text: "Wie lang ist der Äquator (Erdumfang)?",
          wert: 2 * PI * 6371,
          hilfen: ["Der Äquator ist ein Großkreis.", "u = 2 · π · R"],
          weg: "u = 2π · 6371 ≈ 40 030 km" },
        { id: "d", niveau: 2, satz: "kosinussatz", einheit: "°",
          text: "Wie groß ist der Winkel am Erdmittelpunkt zwischen der Richtung zur ISS und der Richtung zu ihrem Horizontpunkt?",
          wert: grad(Math.acos((6771 ** 2 + 6371 ** 2 - (6771 ** 2 - 6371 ** 2)) / (2 * 6771 * 6371))),
          hilfen: ["Du kennst im Dreieck Erdmittelpunkt–ISS–Horizontpunkt alle drei Seiten.", "Kosinussatz nach dem Winkel umstellen (oder: cos α = R : (R + 400))."],
          weg: "cos α = (6771² + 6371² − 2292,77²) : (2 · 6771 · 6371) = 6371 : 6771 ≈ 0,9409 → α ≈ 19,79°" },
        { id: "e", niveau: 2, satz: "kreis", einheit: "km",
          text: "Wie lang ist der Weg auf der Erdoberfläche vom Punkt direkt unter der ISS bis zu ihrem Horizontpunkt (Bogenlänge)?",
          wert: (2 * PI * 6371 * grad(Math.acos(6371 / 6771))) / 360,
          hilfen: ["Die Strecke ist ein Kreisbogen auf einem Großkreis.", "b = 2πR · α : 360° mit α aus d."],
          weg: "b = 40 030 · 19,79 : 360 ≈ 2200,8 km" }
      ]
    },
    {
      id: 16, niveau: 3, titel: "Der Holzkreisel", koerper: ["Kegel"],
      einleitung: "Ein Holzkreisel ist ein Doppelkegel: Zwei Kegel mit gemeinsamer Grundfläche sind aneinandergesetzt. Im Längsschnitt sieht man ein Dreieck aus den Mantellinien s₁ = 2,5 cm (oberer Kegel) und s₂ = 6 cm (unterer Kegel). Beide Mantellinien stehen am Rand senkrecht aufeinander.",
      skizze: "kreisel",
      teile: [
        { id: "a", niveau: 1, satz: "pythagoras", einheit: "cm",
          text: "Wie lang ist der Kreisel von Spitze zu Spitze?",
          wert: 6.5,
          hilfen: ["Die Kreiselachse ist die Hypotenuse des Längsschnitt-Dreiecks.", "Die beiden Mantellinien sind die Katheten."],
          weg: "c = √(2,5² + 6²) = √42,25 = 6,5 cm" },
        { id: "b", niveau: 2, satz: "kathetensatz", einheit: "cm",
          text: "Wie hoch ist der obere (kleine) Kegel?",
          wert: t16_p,
          hilfen: ["Die Höhe des oberen Kegels ist der Hypotenusenabschnitt, der an s₁ anliegt.", "Kathetensatz: s₁² = c · p"],
          weg: "p = 2,5² : 6,5 ≈ 0,96 cm" },
        { id: "c", niveau: 2, satz: "hoehensatz", einheit: "cm",
          text: "Welchen Radius hat der Kreisel an seiner breitesten Stelle?",
          wert: t16_r,
          hilfen: ["Der Radius ist die Höhe des rechtwinkligen Längsschnitt-Dreiecks.", "Höhensatz: r² = p · q mit q = c − p (oder r = s₁ · s₂ : c)."],
          weg: "q = 6,5 − 0,96 ≈ 5,54 cm; r² = 0,96 · 5,54 ≈ 5,33 → r ≈ 2,31 cm" },
        { id: "d", niveau: 2, satz: "kegel", einheit: "cm³",
          text: "Berechne das Volumen des Kreisels.",
          wert: (PI * t16_r ** 2 * 6.5) / 3,
          hilfen: ["Beide Kegel haben dieselbe Grundfläche. Ihre Höhen ergeben zusammen die Länge c.", "V = ⅓ · π · r² · (p + q)"],
          weg: "V = ⅓ · π · 2,31² · 6,5 ≈ 36,25 cm³" },
        { id: "e", niveau: 2, satz: "kegel", einheit: "cm²",
          text: "Der Kreisel wird lackiert. Wie groß ist seine Oberfläche?",
          wert: PI * t16_r * (2.5 + 6),
          hilfen: ["Die Oberfläche besteht nur aus zwei Kegelmänteln.", "O = π · r · s₁ + π · r · s₂"],
          weg: "O = π · 2,31 · 8,5 ≈ 61,62 cm²" }
      ]
    },
    {
      id: 17, niveau: 3, titel: "Die Eiskugel im Cocktailglas", koerper: ["Kegel", "Kugel"],
      einleitung: "Ein Cocktailglas ist innen ein auf der Spitze stehender Kegel: Die Öffnung hat einen Radius von 5 cm, die Glastiefe ist 12 cm. In das Glas wird eine Eiskugel mit 2 cm Radius gelegt. Sie rutscht so weit hinunter, bis sie die Glaswand ringsum berührt.",
      skizze: "cocktail",
      teile: [
        { id: "a", niveau: 1, satz: "pythagoras", einheit: "cm",
          text: "Wie lang ist die Glaswand im Längsschnitt (Mantellinie)?",
          wert: 13,
          hilfen: ["Rechtwinkliges Dreieck aus Radius, Höhe und Mantellinie.", "s² = 5² + 12²"],
          weg: "s = √(25 + 144) = 13 cm" },
        { id: "b", niveau: 1, satz: "kegel", einheit: "cm³",
          text: "Wie viel passt in das leere Glas?",
          wert: (PI * 5 ** 2 * 12) / 3,
          hilfen: ["V = ⅓ · π · r² · h", "Radius 5 cm, Höhe 12 cm"],
          weg: "V = ⅓ · π · 25 · 12 ≈ 314,16 cm³" },
        { id: "c", niveau: 3, satz: "trigonometrie", einheit: "cm",
          text: "Wie weit ist der Mittelpunkt der Eiskugel von der Glasspitze entfernt?",
          wert: (2 * 13) / 5,
          hilfen: ["Zeichne im Längsschnitt den Radius vom Kugelmittelpunkt M zum Berührpunkt an der Wand: Er steht senkrecht auf der Wand. So entsteht ein kleines rechtwinkliges Dreieck mit der Spitze.", "Das kleine Dreieck (Kugelradius, Abstand Spitze–M) ist ähnlich zum großen (Glasradius 5, Mantellinie 13). Also: Abstand : 2 = 13 : 5."],
          weg: "Ähnlichkeit: d : 2 = 13 : 5 → d = 5,2 cm (oder sin α = 5/13 = 2/d)" },
        { id: "d", niveau: 2, satz: "pythagoras", einheit: "cm",
          text: "Wie weit liegt der oberste Punkt der Eiskugel unter dem Glasrand?",
          wert: 12 - (2 * 13) / 5 - 2,
          hilfen: ["Der oberste Punkt liegt einen Kugelradius über dem Mittelpunkt.", "Glastiefe − (Abstand aus c + Kugelradius)"],
          weg: "12 − (5,2 + 2) = 4,8 cm" },
        { id: "e", niveau: 1, satz: "kugel", einheit: "cm³",
          text: "Welches Volumen hat die Eiskugel?",
          wert: (4 / 3) * PI * 2 ** 3,
          hilfen: ["V = 4⁄3 · π · r³", "r = 2 cm"],
          weg: "V = 4⁄3 · π · 8 ≈ 33,51 cm³" }
      ]
    },
    {
      id: 18, niveau: 3, titel: "Das Expeditionszelt", koerper: ["Pyramide"],
      einleitung: "Ein Expeditionszelt hat die Form einer Pyramide mit dreieckiger Grundfläche. Die Seiten des Bodendreiecks sind 4 m, 5 m und 6 m lang. Eine senkrechte Mittelstange von 2,5 m Länge trägt die Zeltspitze.",
      skizze: "zelt",
      teile: [
        { id: "a", niveau: 2, satz: "kosinussatz", einheit: "°",
          text: "Berechne den größten Winkel des Bodendreiecks.",
          wert: t18_g,
          hilfen: ["Der größte Winkel liegt der längsten Seite gegenüber.", "cos γ = (a² + b² − c²) : (2ab) mit c = 6 m."],
          weg: "cos γ = (16 + 25 − 36) : 40 = 0,125 → γ ≈ 82,82°" },
        { id: "b", niveau: 3, satz: "sinussatz", einheit: "°",
          text: "Berechne den Winkel, der der 4-m-Seite gegenüberliegt.",
          wert: grad(Math.asin((4 * sin(t18_g)) / 6)),
          hilfen: ["Du kennst jetzt ein Paar aus Seite und gegenüberliegendem Winkel (6 m und γ).", "Sinussatz: sin α : 4 = sin γ : 6"],
          weg: "sin α = 4 · sin 82,82° : 6 ≈ 0,6614 → α ≈ 41,41° (spitz, da kleinster Winkel)" },
        { id: "c", niveau: 2, satz: "trigonometrie", einheit: "m²",
          text: "Wie groß ist die Bodenfläche des Zeltes?",
          wert: t18_A,
          hilfen: ["Fläche eines Dreiecks aus zwei Seiten und dem eingeschlossenen Winkel.", "A = ½ · a · b · sin γ"],
          weg: "A = ½ · 4 · 5 · sin 82,82° ≈ 9,92 m²" },
        { id: "d", niveau: 2, satz: "pyramide", einheit: "m³",
          text: "Wie viel Luft ist im Zelt (Volumen)?",
          wert: (t18_A * 2.5) / 3,
          hilfen: ["V = ⅓ · G · h", "Die Höhe ist die Länge der Mittelstange."],
          weg: "V = ⅓ · 9,92 · 2,5 ≈ 8,27 m³" },
        { id: "e", niveau: 1, satz: "pyramide", einheit: "m³",
          text: "Drei Personen schlafen im Zelt. Wie viel Luftvolumen hat jede Person?",
          wert: (t18_A * 2.5) / 9,
          hilfen: ["Teile das Volumen gerecht auf.", "Ergebnis aus d geteilt durch 3."],
          weg: "8,27 : 3 ≈ 2,76 m³" }
      ]
    }
  ];

  // Wiederholungskarten. Die fünf Sätze lösen nach zwei verfehlten Teilaufgaben einen Hinweis aus,
  // die Körperformeln stehen jederzeit als Merkzettel zur Verfügung.
  const WIEDERHOLUNG = {
    pythagoras: {
      name: "Satz des Pythagoras", istSatz: true,
      merke: "In jedem rechtwinkligen Dreieck gilt: a² + b² = c². Dabei ist c die Hypotenuse, also die Seite gegenüber dem rechten Winkel (die längste Seite).",
      tipps: ["Suche zuerst den rechten Winkel. In Körpern steckt er meist zwischen Höhe und Grundfläche.", "Kathete gesucht? Dann c² − a² rechnen, nicht addieren.", "Zeichne das Dreieck einzeln heraus und beschrifte die drei Seiten."],
      buch: "Wiederhole im Buch das Kapitel zum Satz des Pythagoras (Kl. 9) und rechne dort zwei Übungsaufgaben."
    },
    hoehensatz: {
      name: "Höhensatz", istSatz: true,
      merke: "Im rechtwinkligen Dreieck teilt die Höhe h die Hypotenuse in die Abschnitte p und q. Es gilt: h² = p · q.",
      tipps: ["Prüfe, ob das Dreieck rechtwinklig ist. Bei einem Halbkreis hilft der Satz des Thales.", "p und q liegen beide auf der Hypotenuse und ergeben zusammen c.", "Nicht vergessen: Am Ende die Wurzel ziehen."],
      buch: "Wiederhole die Satzgruppe des Pythagoras (Höhensatz, Kathetensatz) und zeichne dir eine Musterfigur mit h, p und q."
    },
    kathetensatz: {
      name: "Kathetensatz", istSatz: true,
      merke: "Im rechtwinkligen Dreieck gilt: a² = c · p und b² = c · q. Dabei ist p der Hypotenusenabschnitt, der an der Kathete a anliegt.",
      tipps: ["Wichtig ist, welcher Abschnitt zu welcher Kathete gehört: Er liegt direkt unter ihr.", "Der Kathetensatz verbindet eine Kathete mit der ganzen Hypotenuse c.", "Gesucht ist p? Dann p = a² : c."],
      buch: "Wiederhole die Satzgruppe des Pythagoras und markiere in einer Skizze farbig, welcher Abschnitt zu welcher Kathete gehört."
    },
    sinussatz: {
      name: "Sinussatz", istSatz: true,
      merke: "In jedem Dreieck gilt: a : sin α = b : sin β = c : sin γ. Jede Seite gehört zu dem Winkel, der ihr gegenüberliegt.",
      tipps: ["Du brauchst ein vollständiges Paar: eine Seite und ihren Gegenwinkel.", "Fehlt ein Winkel? Die Winkelsumme 180° hilft oft weiter.", "Taschenrechner auf DEG (Grad) stellen!"],
      buch: "Wiederhole den Sinussatz (Kl. 9) und löse ein allgemeines Dreieck mit WSW-Angaben."
    },
    kosinussatz: {
      name: "Kosinussatz", istSatz: true,
      merke: "In jedem Dreieck gilt: c² = a² + b² − 2ab · cos γ. Umgestellt nach dem Winkel: cos γ = (a² + b² − c²) : (2ab).",
      tipps: ["Der Kosinussatz passt, wenn zwei Seiten und der eingeschlossene Winkel (SWS) oder alle drei Seiten (SSS) gegeben sind.", "γ liegt immer der Seite c gegenüber.", "Ein negativer Kosinuswert bedeutet einen stumpfen Winkel. Das ist kein Fehler!"],
      buch: "Wiederhole den Kosinussatz (Kl. 9) und rechne je ein Beispiel für SWS und SSS."
    },
    trigonometrie: {
      name: "Sinus, Kosinus und Tangens im rechtwinkligen Dreieck", istSatz: true,
      merke: "Im rechtwinkligen Dreieck gilt: sin α = Gegenkathete : Hypotenuse, cos α = Ankathete : Hypotenuse, tan α = Gegenkathete : Ankathete.",
      tipps: ["Markiere den Winkel und benenne von ihm aus Gegenkathete und Ankathete.", "Für die Dreiecksfläche aus zwei Seiten und Winkel: A = ½ · a · b · sin γ.", "Taschenrechner auf DEG (Grad) stellen!"],
      buch: "Wiederhole Sinus, Kosinus und Tangens am rechtwinkligen Dreieck (Kl. 9)."
    },
    kreis: { name: "Kreis", istSatz: false,
      merke: "u = 2πr = πd · A = πr² · Bogen b = 2πr · α : 360° · Ausschnitt A = πr² · α : 360°", tipps: [], buch: "" },
    zylinder: { name: "Zylinder", istSatz: false,
      merke: "V = πr² · h · M = 2πr · h · O = 2πr² + 2πrh", tipps: [], buch: "" },
    kegel: { name: "Kegel", istSatz: false,
      merke: "V = ⅓πr² · h · M = πr · s · O = πr² + πrs · s² = r² + h²", tipps: [], buch: "" },
    pyramide: { name: "Pyramide", istSatz: false,
      merke: "V = ⅓ · G · h · M = Summe der Seitendreiecke · bei quadratischer Grundfläche: M = 2 · a · h<sub>s</sub>", tipps: [], buch: "" },
    kugel: { name: "Kugel", istSatz: false,
      merke: "V = 4⁄3 · πr³ · O = 4πr²", tipps: [], buch: "" }
  };

  const NIVEAUS = { 1: "Basis", 2: "Standard", 3: "Expert" };

  const ziel = typeof window !== "undefined" ? window : globalThis;
  ziel.AUFGABEN = AUFGABEN;
  ziel.WIEDERHOLUNG = WIEDERHOLUNG;
  ziel.NIVEAUS = NIVEAUS;
  if (typeof module !== "undefined") module.exports = { AUFGABEN, WIEDERHOLUNG, NIVEAUS };
})();
