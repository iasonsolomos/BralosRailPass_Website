/* ==========================================================================
   xartes-mikotomi.js  —  ΒΗΜΑ 3: «Μηκοτομή» (διαδραστικό διάγραμμα, χωρίς εξωτερικές βιβλιοθήκες)
   • Ζουμ: ροδέλα / pinch / κουμπιά +,− / διπλό κλικ.  Μετακίνηση: σύρσιμο.  Επαναφορά: κουμπί ⟲ ή πλήκτρο 0.
   • Πλαίσιο «Επίπεδα»: σταθμοί, γέφυρες, σήραγγες, στοές, κλίση, σημεία μέτρησης.
   • Πάτημα σε σταθμό/γέφυρα/σήραγγα/στοά: ανοίγει η περιγραφή με φωτογραφίες (από το xartes-geo.js).
   • Η μηκοτομή (χιλιομετρική θέση – υψόμετρο) βρίσκεται παρακάτω, στο PROFILE.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- ΔΕΔΟΜΕΝΑ: Χιλιομετρική θέση (km)  Υψόμετρο (m) ---------- */
  const PROFILE_TEXT = `
166,300 153,261
166,430 153,365
167,915 158,117
170,047 170,012
170,733 178,593
171,597 188,925
172,339 200,801
173,037 212,024
173,127 212,758
173,596 217,030
173,668 218,013
174,194 226,267
175,014 239,355
175,514 246,570
175,993 253,453
176,229 256,875
176,944 262,681
177,122 265,230
177,364 268,908
178,484 284,950
178,797 289,600
179,554 300,324
179,834 301,590
180,014 302,785
180,639 312,903
180,839 316,303
180,939 317,530
181,239 317,530
181,324 317,270
181,456 315,780
181,736 310,233
182,030 304,245
182,544 294,114
182,644 292,510
182,794 290,785
183,312 282,032
183,434 280,121
183,642 278,241
184,024 277,922
184,194 278,459
184,544 280,310
184,836 284,303
185,028 284,220
185,394 283,551
185,717 284,492
185,817 285,204
186,808 295,643
186,994 295,560
187,209 293,980
187,309 293,620
187,449 294,000
187,709 296,330
187,753 296,430
187,977 296,513
188,297 298,828
188,644 302,160
189,220 303,938
190,053 309,816
190,117 310,610
190,352 313,835
190,791 320,520
190,836 320,550
191,187 320,550
191,337 322,245
192,087 332,000
192,591 335,597
193,616 352,473
193,956 358,588
194,026 359,540
194,175 360,610
194,389 361,300
194,589 362,990
195,499 381,240
195,799 386,900
195,969 390,180
196,422 398,700
196,632 402,600
196,969 409,230
197,607 409,750
197,777 407,150
198,247 399,530
199,052 386,810
199,438 379,450
199,648 375,640
199,849 371,820
199,958 369,850
200,303 363,040
200,388 361,430
200,553 358,140
200,958 351,070
201,000 350,630
201,108 349,800
201,296 346,750
201,640 339,960
202,147 329,980
202,304 327,150
202,449 324,690
202,766 319,310
202,829 318,320
202,966 315,790
203,185 312,000
203,581 303,990
204,204 293,000
204,441 288,500
204,763 282,160
204,917 279,040
204,983 277,803
205,167 273,988
205,259 272,274
205,407 269,305
205,737 263,585
205,845 261,445
206,155 256,610
206,350 253,916
206,410 252,662
206,560 249,863
206,685 247,708
206,755 246,616
207,016 241,712
207,167 239,452
207,287 237,460
207,337 236,810
207,604 232,341
207,835 227,780
207,964 225,810
208,146 222,250
208,188 221,492
208,262 220,062
208,322 218,981
208,398 217,805
208,549 215,610
208,649 213,920
208,924 208,541
208,980 207,516
209,069 205,997
209,201 203,292
209,305 201,412
209,372 200,510
209,535 197,320
209,591 196,299
209,715 194,488
209,819 192,649
209,921 190,584
209,994 189,206
210,089 187,250
210,255 184,342
210,396 181,749
210,464 180,392
210,634 177,365
210,763 175,224
211,114 170,170
211,148 169,570
211,226 168,242
211,316 167,070
211,603 161,899
211,916 155,515
212,016 153,704
212,180 150,867
212,418 146,440
212,531 144,234
212,616 142,648
212,777 139,763
212,897 137,628
213,144 133,137
213,387 128,643
213,572 125,106
213,675 123,264
213,776 121,367
214,231 112,257
214,410 108,639
214,592 105,000
214,805 101,209
215,005 98,016
215,121 95,865
215,224 93,850
215,451 89,926
215,554 88,051
215,831 82,526
216,131 76,712
216,645 66,354
217,105 57,838
217,237 55,631
217,381 52,860
217,660 47,980
217,730 46,620
217,890 43,998
218,603 31,290
218,703 29,283
218,899 25,264
219,095 21,792
219,175 21,120
219,499 21,210
219,911 21,170
220,767 21,270
221,065 21,350
222,124 24,396
222,204 24,480
222,541 24,480`;

  const PROFILE = PROFILE_TEXT.trim().split("\n").map(l => l.trim().split(/\s+/).map(v => parseFloat(v.replace(",", "."))));

  // Σταθμοί / Στάσεις: km και υψόμετρο από τον πίνακά σου· geo = το όνομα στο xartes-geo.js (για κείμενα/φωτογραφίες)
  const STATIONS = [
    { geo: "Τιθορέα",       el: "Τιθορέα",        en: "Tithorea",       km: 166.300, z: 153.3,  kind: "station" },
    { geo: "Παρνασσός",     el: "Παρνασσός",      en: "Parnassos",      km: 173.052, z: 211.7,  kind: "halt" },
    { geo: "Αμφίκλεια",     el: "Αμφίκλεια",      en: "Amfikleia",      km: 181.172, z: 317.4,  kind: "station" },
    { geo: "Λιλαία",        el: "Λιλαία",         en: "Lilaia",         km: 185.725, z: 284.3,  kind: "station" },
    { geo: "Μπράλος",       el: "Μπράλος",        en: "Bralos",         km: 194.305, z: 360.7,  kind: "station" },
    { geo: "Ελευθεροχώρι",  el: "Ελευθεροχώρι",   en: "Eleftherochori", km: 201.043, z: 350.8,  kind: "station" },
    { geo: "Ασωπός",        el: "Ασωπός",         en: "Asopos",         km: 204.934, z: 277.6,  kind: "station" },
    { geo: "Τραχίνα",       el: "Τραχίνα",        en: "Trachina",       km: 210.300, z: 183.7,  kind: "halt" },
    { geo: "Αρπίνη",        el: "Αρπίνη",         en: "Arpini",         km: 212.583, z: 143.5,  kind: "station" },
    { geo: "Γοργοπόταμος",  el: "Γοργοπόταμος",   en: "Gorgopotamos",   km: 214.192, z: 112.25, kind: "halt" },
    { geo: "Στουντνιτς",    el: "Φον Στούντνιτς", en: "Von Stoudnitz",  km: 217.000, z: 59.8,   kind: "halt" },
    { geo: "Σπερχειός",     el: "Σπερχειός",      en: "Sperchios",      km: 219.283, z: 21.2,   kind: "halt" },
    { geo: "Λειανοκλάδι",   el: "Λειανοκλάδι",    en: "Lianokladi",     km: 222.541, z: 24.4,   kind: "station" }
  ];

  /* ---------- Ρυθμίσεις που μπορείς να αλλάξεις ---------- */
  const LAYERS = [
    { id: "stations",  on: true,  color: "#174c3d", label: { el: "Σταθμοί & Στάσεις",     en: "Stations & Halts" } },
    { id: "tunnels",   on: false,  color: "#6b4226", label: { el: "Σήραγγες",              en: "Tunnels" } },
    { id: "bridges",   on: false, color: "#1c7ed6", label: { el: "Γέφυρες",               en: "Bridges" } },
    { id: "galleries", on: false, color: "#d6336c", label: { el: "Στοές",                 en: "Galleries" } },
    { id: "slope",     on: false, color: "#e8590c", label: { el: "Κλίση (‰)",             en: "Gradient (‰)" } },
    { id: "points",    on: false, color: "#868e96", label: { el: "Σημεία μέτρησης",       en: "Survey points" } }
  ];
  // Πού βρίσκεται η Χ.Θ. των σηράγγων/στοών σε σχέση με το έργο: "start" = στην είσοδο (το έργο εκτείνεται προς τα εμπρός), "center" = στο μέσο.
  const SPAN_MODE = { tunnels: "start", galleries: "start", bridges: "center" };

  const UI = {
    el: { layers: "Επίπεδα", km: "Χιλιομετρική θέση (km)", elev: "Υψόμετρο (m)", slope: "Κλίση", slopeAxis: "Κλίση ‰",
          kmShort: "Χ.Θ.", elevShort: "Υψόμετρο", gradient: "Κλίση", up: "ανηφόρα προς Λειανοκλάδι", down: "κατηφόρα προς Λειανοκλάδι", flat: "οριζόντια",
          hint: "Ροδέλα: ζουμ · σύρσιμο: μετακίνηση · διπλό κλικ: ζουμ", click: "Πάτησε για λεπτομέρειες",
          zin: "Μεγέθυνση", zout: "Σμίκρυνση", reset: "Επαναφορά προβολής", close: "Κλείσιμο",
          lineElev: "Υψόμετρο γραμμής", len: "Μήκος",
          t_stations: "Σταθμός", t_halts: "Στάση", t_bridges: "Γέφυρα", t_tunnels: "Σήραγγα", t_galleries: "Στοά",
          m: "μ.", nodata: "Δεν φορτώθηκαν τα δεδομένα της μηκοτομής." },
    en: { layers: "Layers", km: "Chainage (km)", elev: "Elevation (m)", slope: "Gradient", slopeAxis: "Gradient ‰",
          kmShort: "Ch.", elevShort: "Elevation", gradient: "Gradient", up: "uphill towards Lianokladi", down: "downhill towards Lianokladi", flat: "level",
          hint: "Wheel: zoom · drag: pan · double-click: zoom", click: "Click for details",
          zin: "Zoom in", zout: "Zoom out", reset: "Reset view", close: "Close",
          lineElev: "Track elevation", len: "Length",
          t_stations: "Station", t_halts: "Halt", t_bridges: "Bridge", t_tunnels: "Tunnel", t_galleries: "Gallery",
          m: "m", nodata: "The profile data could not be loaded." }
  };
  const lang = () => (typeof language !== "undefined" && language === "en") ? "en" : "el";
  const pick = o => o ? (o[lang()] || o.el || "") : "";
  const ui = k => UI[lang()][k];
  const num = (v, d) => { const s = v.toFixed(d); return lang() === "el" ? s.replace(".", ",") : s; };
  const fmtKm = k => { const m = Math.round(k * 1000); return Math.floor(m / 1000) + "+" + String(m % 1000).padStart(3, "0"); };
  const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- Υπολογισμοί πάνω στη μηκοτομή ---------- */
  const DX0 = PROFILE[0][0], DX1 = PROFILE[PROFILE.length - 1][0], DSPAN = DX1 - DX0, MINSPAN = 0.25;

  function elevAt(km) {
    if (km <= DX0) return PROFILE[0][1];
    if (km >= DX1) return PROFILE[PROFILE.length - 1][1];
    let lo = 0, hi = PROFILE.length - 1;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (PROFILE[mid][0] <= km) lo = mid; else hi = mid; }
    const a = PROFILE[lo], b = PROFILE[hi];
    return a[1] + (b[1] - a[1]) * (km - a[0]) / (b[0] - a[0]);
  }
  function gradeAt(km) {            // ‰ (m ανά km) του τμήματος που περιέχει το km
    let i = 0;
    while (i < PROFILE.length - 2 && PROFILE[i + 1][0] <= km) i++;
    const a = PROFILE[i], b = PROFILE[i + 1];
    return (b[1] - a[1]) / (b[0] - a[0]);
  }
  const SEGS = PROFILE.slice(1).map((b, i) => ({ k0: PROFILE[i][0], k1: b[0], g: (b[1] - PROFILE[i][1]) / (b[0] - PROFILE[i][0]) }));
  const SMAX = Math.max(10, Math.ceil(Math.max.apply(null, SEGS.filter(s => s.k1 - s.k0 >= 0.05).map(s => Math.abs(s.g))) / 5) * 5);

  /* ---------- Στοιχεία από το xartes-geo.js ---------- */
  function parseKm(s) {
    const m = String(s || "").match(/(\d{3})\s*\+\s*\(?\s*(\d{1,3})\s*\)?/);
    return m ? parseInt(m[1], 10) + parseInt(m[2], 10) / 1000 : null;
  }
  function parseLenM(f) {
    const x = (f.facts || []).find(a => /Μήκος/.test(a[0]));
    if (!x) return 0;
    const m = String(x[1]).match(/[\d.,]+/);
    return m ? parseFloat(m[0].replace(",", ".")) : 0;
  }
  function kmOf(f) {
    let k = parseKm(f.name);
    if (k == null) (f.facts || []).forEach(a => { if (k == null && /Χ\.?Θ|Χιλιομετρ/.test(a[0])) k = parseKm(a[1]); });
    return k;
  }

  function buildFeatures(geo) {
    const out = [];
    STATIONS.forEach((s, i) => {
      const g = (geo.stations || []).find(x => x.name === s.geo) || {};
      const facts = [["Χιλιομετρική Θέση", fmtKm(s.km)], ["Υψόμετρο", s.z.toString().replace(".", ",") + " μ."]]
        .concat((g.facts || []).filter(a => !/Χιλιομετρ|Υψόμετρ/.test(a[0])));
      out.push({ id: "stations:" + i, type: "stations", sub: s.kind === "station" ? "t_stations" : "t_halts",
                 name: { el: s.el, en: s.en }, km: s.km, a: s.km, b: s.km, z: s.z, color: s.kind === "station" ? "#174c3d" : "#b18b46",
                 facts, text: g.text || [], photos: g.photos || [], fixedFacts: true });
    });
    [["tunnels", "t_tunnels"], ["bridges", "t_bridges"], ["galleries", "t_galleries"]].forEach(([type, sub]) => {
      (geo[type] || []).forEach((f, i) => {
        const km = kmOf(f); if (km == null) return;
        const len = parseLenM(f) / 1000, mode = SPAN_MODE[type];
        const a = mode === "center" ? km - len / 2 : km, b = mode === "center" ? km + len / 2 : km + len;
        const color = LAYERS.find(l => l.id === type).color;
        out.push({ id: type + ":" + i, type, sub, name: { el: f.name, en: f.name }, km, a, b, z: elevAt(km), color,
                   facts: f.facts || [], text: f.text || [], photos: f.photos || [] });
      });
    });
    return out;
  }

  /* ---------- Ο χάρτης... pardon, το διάγραμμα ---------- */
  function build(stage, geo) {
    const features = buildFeatures(geo);
    const byId = {}; features.forEach(f => { byId[f.id] = f; });
    const state = {}; LAYERS.forEach(l => { state[l.id] = l.on; });
    let x0 = DX0 - 0.2, x1 = DX1 + 0.2;
    let W = 0, H = 0, plot = { x: 0, y: 0, w: 1, h: 1 }, y0 = 0, y1 = 1, stripY = 0, stripH = 0;
    let selected = null, collapsed = stage.clientWidth < 600, hover = null;

    stage.innerHTML = `
      <div class="xp-wrap" tabindex="0">
        <svg class="xp-svg" role="img"></svg>
        <div class="xp-tools">
          <button type="button" data-act="zin" aria-label="">+</button>
          <button type="button" data-act="zout" aria-label="">−</button>
          <button type="button" data-act="reset" aria-label="">⟲</button>
          <span class="xp-hint"></span>
        </div>
        <div class="xp-layers"></div>
        <div class="xp-tip" hidden></div>
        <div class="xp-info" hidden></div>
      </div>`;
    const wrap = stage.firstElementChild, svg = wrap.querySelector(".xp-svg"), tools = wrap.querySelector(".xp-tools"),
          layersEl = wrap.querySelector(".xp-layers"), tip = wrap.querySelector(".xp-tip"), info = wrap.querySelector(".xp-info");

    /* --- κλίμακες --- */
    const sx = k => plot.x + (k - x0) / (x1 - x0) * plot.w;
    const sy = z => plot.y + plot.h - (z - y0) / (y1 - y0) * plot.h;
    const kmAtPx = px => x0 + (px - plot.x) / plot.w * (x1 - x0);

    function niceStep(range, target) {
      const raw = range / target, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p;
      return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * p;
    }
    function layout() {
      W = wrap.clientWidth; H = wrap.clientHeight;
      stripH = state.slope ? 70 : 0;
      plot = { x: 56, y: 16, w: Math.max(50, W - 56 - 18), h: Math.max(60, H - 16 - 36 - stripH) };
      stripY = plot.y + plot.h + 36;
      // κατακόρυφο εύρος ανάλογα με το ορατό τμήμα
      let lo = Infinity, hi = -Infinity;
      const upd = z => { if (z < lo) lo = z; if (z > hi) hi = z; };
      upd(elevAt(x0)); upd(elevAt(x1));
      PROFILE.forEach(p => { if (p[0] >= x0 && p[0] <= x1) upd(p[1]); });
      const pad = Math.max(4, (hi - lo) * 0.14);
      y0 = lo - pad; y1 = hi + pad * 1.6;
    }

    /* --- ζωγραφική --- */
    function pathOf(a, b) {          // σημεία της μηκοτομής από a έως b
      let d = "M" + sx(a).toFixed(1) + " " + sy(elevAt(a)).toFixed(1);
      PROFILE.forEach(p => { if (p[0] > a && p[0] < b) d += "L" + sx(p[0]).toFixed(1) + " " + sy(p[1]).toFixed(1); });
      return d + "L" + sx(b).toFixed(1) + " " + sy(elevAt(b)).toFixed(1);
    }

    function draw() {
      if (!wrap.clientWidth || !wrap.clientHeight) return;
      layout();
      const out = [];
      const bottom = plot.y + plot.h;
      out.push(`<defs><clipPath id="xp-clip"><rect x="${plot.x}" y="${plot.y - 2}" width="${plot.w}" height="${plot.h + 4}"/></clipPath></defs>`);

      // πλέγμα
      const ys = niceStep(y1 - y0, Math.max(3, plot.h / 55));
      for (let v = Math.ceil(y0 / ys) * ys; v < y1; v += ys) {
        const y = sy(v).toFixed(1);
        out.push(`<line class="xp-grid" x1="${plot.x}" x2="${plot.x + plot.w}" y1="${y}" y2="${y}"/><text class="xp-tick" x="${plot.x - 8}" y="${(+y + 4)}" text-anchor="end">${Math.round(v)}</text>`);
      }
      const xs = niceStep(x1 - x0, Math.max(3, plot.w / 90));
      for (let v = Math.ceil(x0 / xs) * xs; v <= x1 + 1e-9; v += xs) {
        const x = sx(v).toFixed(1), dec = xs < 1 ? (xs < 0.1 ? 2 : 1) : 0;
        out.push(`<line class="xp-grid xp-grid-v" x1="${x}" x2="${x}" y1="${plot.y}" y2="${bottom}"/><text class="xp-tick" x="${x}" y="${bottom + 16}" text-anchor="middle">${num(v, dec)}</text>`);
      }
      out.push(`<text class="xp-axis-title" x="${plot.x + plot.w / 2}" y="${bottom + 32}" text-anchor="middle">${esc(ui("km"))}</text>`);
      out.push(`<text class="xp-axis-title" transform="translate(13 ${plot.y + plot.h / 2}) rotate(-90)" text-anchor="middle">${esc(ui("elev"))}</text>`);

      // προφίλ
      const full = pathOf(DX0, DX1);
      out.push(`<g clip-path="url(#xp-clip)">`);
      out.push(`<path class="xp-area" d="${full}L${sx(DX1).toFixed(1)} ${bottom}L${sx(DX0).toFixed(1)} ${bottom}Z"/>`);
      out.push(`<path class="xp-line" d="${full}"/>`);
      if (state.points) PROFILE.forEach(p => out.push(`<circle class="xp-pt" cx="${sx(p[0]).toFixed(1)}" cy="${sy(p[1]).toFixed(1)}" r="2.4"/>`));

      // εκτάσεις έργων (σήραγγες, στοές, γέφυρες) – κάτω από τους δείκτες
      const vis = features.filter(f => state[f.type]);
      vis.filter(f => f.type !== "stations").forEach(f => {
        const w = (f.b - f.a) * plot.w / (x1 - x0), sw = f.type === "bridges" ? 7 : 9;
        if (w > 1 && f.b > x0 && f.a < x1) {
          out.push(`<path class="xp-span" d="${pathOf(f.a, f.b)}" stroke="${f.color}" stroke-width="${sw}" data-id="${f.id}"/>`);
          out.push(`<path d="${pathOf(f.a, f.b)}" stroke="transparent" stroke-width="18" fill="none" data-id="${f.id}"/>`);
        }
      });
      // στήλες σταθμών
      if (state.stations) features.filter(f => f.type === "stations").forEach(f => {
        const x = sx(f.km).toFixed(1);
        out.push(`<line class="xp-stem" x1="${x}" x2="${x}" y1="${sy(f.z).toFixed(1)}" y2="${bottom}"/>`);
      });
      // δείκτες
      vis.forEach(f => {
        const x = sx(f.km); if (x < plot.x - 12 || x > plot.x + plot.w + 12) return;
        const r = f.type === "stations" ? 7.5 : 4.8, sel = selected === f.id;
        if (sel) out.push(`<circle class="xp-ring" cx="${x.toFixed(1)}" cy="${sy(f.z).toFixed(1)}" r="${r + 5}"/>`);
        out.push(`<circle class="xp-mark" cx="${x.toFixed(1)}" cy="${sy(f.z).toFixed(1)}" r="${r}" fill="${f.color}" data-id="${f.id}"/>`);
        out.push(`<circle cx="${x.toFixed(1)}" cy="${sy(f.z).toFixed(1)}" r="${r + 7}" fill="transparent" data-id="${f.id}"/>`);
      });
      out.push(`</g>`);

      // ετικέτες (οι σταθμοί έχουν προτεραιότητα, μετά ό,τι χωράει)
      const taken = [];
      const place = (f, dy) => {
        const x = sx(f.km); if (x < plot.x + 4 || x > plot.x + plot.w - 4) return;
        const t = pick(f.name), w = t.length * 6.4 + 10;
        if (taken.some(a => x - w / 2 < a[1] && x + w / 2 > a[0])) return;
        taken.push([x - w / 2, x + w / 2]);
        out.push(`<text class="xp-label${f.type === "stations" ? " xp-label-st" : ""}" x="${x.toFixed(1)}" y="${(sy(f.z) - dy).toFixed(1)}" text-anchor="middle">${esc(t)}</text>`);
      };
      vis.filter(f => f.type === "stations").forEach(f => place(f, 15));
      vis.filter(f => f.type !== "stations").sort((a, b) => (b.b - b.a) - (a.b - a.a)).forEach(f => place(f, 12));

      // κλίση
      if (state.slope) {
        const mid = stripY + stripH / 2 - 4, amp = stripH / 2 - 9;
        out.push(`<text class="xp-axis-title" x="${plot.x - 8}" y="${stripY - 6}" text-anchor="end">${esc(ui("slopeAxis"))}</text>`);
        out.push(`<line class="xp-grid" x1="${plot.x}" x2="${plot.x + plot.w}" y1="${mid}" y2="${mid}"/>`);
        [[SMAX, mid - amp], [-SMAX, mid + amp]].forEach(([v, y]) => out.push(`<text class="xp-tick" x="${plot.x - 8}" y="${y + 4}" text-anchor="end">${v > 0 ? "+" : "−"}${Math.abs(v)}</text>`));
        out.push(`<g clip-path="url(#xp-clip2)"><clipPath id="xp-clip2"><rect x="${plot.x}" y="${stripY - 4}" width="${plot.w}" height="${stripH}"/></clipPath>`);
        SEGS.forEach(s => {
          if (s.k1 < x0 || s.k0 > x1) return;
          const xa = sx(s.k0), xb = sx(s.k1), h = clamp(s.g / SMAX, -1, 1) * amp;
          out.push(`<rect class="${s.g >= 0 ? "xp-up" : "xp-down"}" x="${xa.toFixed(1)}" y="${(h >= 0 ? mid - h : mid).toFixed(1)}" width="${Math.max(0.8, xb - xa).toFixed(1)}" height="${Math.max(0.6, Math.abs(h)).toFixed(1)}"/>`);
        });
        out.push(`</g>`);
      }

      out.push(`<line class="xp-axis" x1="${plot.x}" x2="${plot.x + plot.w}" y1="${bottom}" y2="${bottom}"/><line class="xp-axis" x1="${plot.x}" x2="${plot.x}" y1="${plot.y}" y2="${bottom}"/>`);
      out.push(`<g class="xp-cross" style="display:none"><line class="xp-crossline" y1="${plot.y}" y2="${bottom + (state.slope ? 36 + stripH : 0)}"/><circle class="xp-crossdot" r="5"/></g>`);

      svg.setAttribute("width", W); svg.setAttribute("height", H); svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.innerHTML = out.join("");
    }

    let raf = 0;
    const redraw = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; draw(); }); };

    /* --- προβολή: ζουμ / μετακίνηση --- */
    function setView(a, b) {
      let span = clamp(b - a, MINSPAN, DSPAN + 0.4);
      const c = (a + b) / 2;
      a = c - span / 2; b = c + span / 2;
      if (a < DX0 - 0.2) { b += DX0 - 0.2 - a; a = DX0 - 0.2; }
      if (b > DX1 + 0.2) { a -= b - (DX1 + 0.2); b = DX1 + 0.2; }
      x0 = a; x1 = b; redraw();
    }
    function zoomAt(px, factor) {
      const k = kmAtPx(px);
      setView(k - (k - x0) / factor, k + (x1 - k) / factor);
    }
    const reset = () => setView(DX0 - 0.2, DX1 + 0.2);

    tools.addEventListener("click", e => {
      const act = e.target.dataset && e.target.dataset.act; if (!act) return;
      if (act === "reset") reset(); else zoomAt(plot.x + plot.w / 2, act === "zin" ? 1.6 : 1 / 1.6);
    });
    wrap.addEventListener("wheel", e => {
      e.preventDefault();
      const dy = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY;
      zoomAt(e.clientX - wrap.getBoundingClientRect().left, Math.exp(-dy * 0.0016));
    }, { passive: false });
    wrap.addEventListener("dblclick", e => {
      if (e.target.closest(".xp-tools,.xp-layers,.xp-info")) return;
      zoomAt(e.clientX - wrap.getBoundingClientRect().left, 2);
    });
    wrap.addEventListener("keydown", e => {
      const span = x1 - x0;
      if (e.key === "+" || e.key === "=") zoomAt(plot.x + plot.w / 2, 1.5);
      else if (e.key === "-") zoomAt(plot.x + plot.w / 2, 1 / 1.5);
      else if (e.key === "0") reset();
      else if (e.key === "ArrowLeft") setView(x0 - span * 0.15, x1 - span * 0.15);
      else if (e.key === "ArrowRight") setView(x0 + span * 0.15, x1 + span * 0.15);
      else if (e.key === "Escape") closeInfo();
      else return;
      e.preventDefault();
    });

    // δείκτες δαχτύλων / ποντικιού
    const ptrs = new Map(); let downId = null, moved = 0, lastPinch = 0;
    svg.addEventListener("pointerdown", e => {
      svg.setPointerCapture(e.pointerId);
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const t = e.target.closest && e.target.closest("[data-id]");
      downId = ptrs.size === 1 && t ? t.dataset.id : null;
      moved = 0; lastPinch = 0; wrap.classList.add("xp-grab"); hideTip();
    });
    svg.addEventListener("pointermove", e => {
      const p = ptrs.get(e.pointerId);
      if (!p) { if (e.pointerType === "mouse") showHover(e); return; }
      if (ptrs.size === 1) {
        const dx = e.clientX - p.x; moved += Math.abs(dx) + Math.abs(e.clientY - p.y);
        if (moved > 5) { const dk = -dx / plot.w * (x1 - x0); setView(x0 + dk, x1 + dk); }
        p.x = e.clientX; p.y = e.clientY;
      } else if (ptrs.size === 2) {
        p.x = e.clientX; p.y = e.clientY; moved = 99;
        const [a, b] = Array.from(ptrs.values()), d = Math.hypot(a.x - b.x, a.y - b.y);
        if (lastPinch) zoomAt((a.x + b.x) / 2 - wrap.getBoundingClientRect().left, d / lastPinch);
        lastPinch = d;
      }
    });
    const up = e => {
      if (!ptrs.has(e.pointerId)) return;
      ptrs.delete(e.pointerId); lastPinch = 0;
      if (!ptrs.size) {
        wrap.classList.remove("xp-grab");
        if (e.type === "pointerup" && moved <= 5 && downId && byId[downId]) select(downId);
        downId = null;
      }
    };
    svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up);
    svg.addEventListener("pointerleave", e => { if (e.pointerType === "mouse" && !ptrs.size) hideTip(); });

    /* --- ένδειξη τιμών κάτω από το ποντίκι --- */
    function hideTip() {
      tip.hidden = true;
      const c = svg.querySelector(".xp-cross"); if (c) c.style.display = "none";
    }
    function showHover(e) {
      const r = wrap.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
      if (px < plot.x || px > plot.x + plot.w || py < plot.y || py > plot.y + plot.h + 60) return hideTip();
      const km = clamp(kmAtPx(px), DX0, DX1), z = elevAt(km), g = gradeAt(km);
      const c = svg.querySelector(".xp-cross");
      if (c) {
        c.style.display = "";
        const l = c.querySelector("line"), d = c.querySelector("circle");
        l.setAttribute("x1", sx(km)); l.setAttribute("x2", sx(km));
        d.setAttribute("cx", sx(km)); d.setAttribute("cy", sy(z));
      }
      let near = null;
      features.forEach(f => {
        if (!state[f.type]) return;
        const inside = km >= f.a && km <= f.b, close = Math.abs(sx(f.km) - px) < 10;
        if (inside || close) near = f;
      });
      const gtxt = Math.abs(g) < 0.5 ? ui("flat") : (g > 0 ? "↗ " : "↘ ") + (g > 0 ? "+" : "−") + num(Math.abs(g), 1) + " ‰";
      tip.innerHTML = `<b>${esc(ui("kmShort"))} ${fmtKm(km)}</b><br>${esc(ui("elevShort"))}: ${num(z, 1)} ${esc(ui("m"))}<br>${esc(ui("gradient"))}: ${gtxt}` +
        (near ? `<hr><b>${esc(pick(near.name))}</b><br><i>${esc(ui(near.sub))} · ${esc(ui("click"))}</i>` : "");
      tip.hidden = false;
      const tw = tip.offsetWidth, th = tip.offsetHeight;
      tip.style.left = clamp(px + 14 + tw > W ? px - 14 - tw : px + 14, 4, Math.max(4, W - tw - 4)) + "px";
      tip.style.top = clamp(py - th - 10 < 4 ? py + 16 : py - th - 10, 4, Math.max(4, H - th - 4)) + "px";
    }

    /* --- κάρτα πληροφοριών --- */
    function infoHtml(f) {
      let facts = f.facts.slice();
      if (!f.fixedFacts) {
        if (!facts.some(a => /Χ\.?Θ|Χιλιομετρ/.test(a[0]))) facts.unshift(["Χ.Θ.", fmtKm(f.km)]);
        facts.push([ui("lineElev"), num(f.z, 1) + " " + ui("m")]);
      }
      const dl = facts.length ? `<dl class="xm-facts">${facts.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>` : "";
      const text = (f.text || []).map(p => `<p>${esc(p).replace(/&lt;br&gt;/g, "<br>")}</p>`).join("");
      const photos = (f.photos || []).map(src => `<img class="xm-photo" src="${esc(src)}" alt="${esc(pick(f.name))}" loading="lazy" onerror="this.remove()">`).join("");
      return `<button type="button" class="xp-close" aria-label="${esc(ui("close"))}">×</button>
        <div class="xm-pop"><div class="xp-type" style="color:${f.color}">${esc(ui(f.sub))}</div><h3>${esc(pick(f.name))}</h3>${dl}${text}${photos}</div>`;
    }
    function select(id) { selected = id; info.innerHTML = infoHtml(byId[id]); info.hidden = false; info.scrollTop = 0; redraw(); }
    function closeInfo() { selected = null; info.hidden = true; redraw(); }
    info.addEventListener("click", e => { if (e.target.closest(".xp-close")) closeInfo(); });
    ["wheel", "pointerdown", "dblclick"].forEach(ev => info.addEventListener(ev, e => e.stopPropagation()));

    /* --- πλαίσιο «Επίπεδα» και κουμπιά (ξαναφτιάχνονται όταν αλλάζει η γλώσσα) --- */
    function renderUi() {
      tools.querySelector('[data-act="zin"]').setAttribute("aria-label", ui("zin")); tools.querySelector('[data-act="zin"]').title = ui("zin");
      tools.querySelector('[data-act="zout"]').setAttribute("aria-label", ui("zout")); tools.querySelector('[data-act="zout"]').title = ui("zout");
      tools.querySelector('[data-act="reset"]').setAttribute("aria-label", ui("reset")); tools.querySelector('[data-act="reset"]').title = ui("reset");
      tools.querySelector(".xp-hint").textContent = ui("hint");
      svg.setAttribute("aria-label", pick({ el: "Μηκοτομή της γραμμής", en: "Longitudinal profile of the line" }));
      layersEl.classList.toggle("collapsed", collapsed);
      layersEl.innerHTML = `
        <button type="button" class="xp-layers-toggle" aria-expanded="${!collapsed}">${esc(ui("layers"))} <span aria-hidden="true">${collapsed ? "▸" : "▾"}</span></button>
        <div class="xp-layers-body">${LAYERS.map(l => `
          <label><input type="checkbox" data-layer="${l.id}"${state[l.id] ? " checked" : ""}> <i class="xp-sw" style="background:${l.color}"></i> ${esc(pick(l.label))}</label>`).join("")}</div>`;
      if (selected) info.innerHTML = infoHtml(byId[selected]);
    }
    layersEl.addEventListener("change", e => {
      const id = e.target.dataset && e.target.dataset.layer; if (!id) return;
      state[id] = e.target.checked;
      if (selected && byId[selected] && !state[byId[selected].type]) closeInfo();
      redraw();
    });
    layersEl.addEventListener("click", e => { if (e.target.closest(".xp-layers-toggle")) { collapsed = !collapsed; renderUi(); } });
    ["pointerdown", "wheel", "dblclick"].forEach(ev => layersEl.addEventListener(ev, e => e.stopPropagation()));
    tools.addEventListener("pointerdown", e => e.stopPropagation());
    tools.addEventListener("dblclick", e => e.stopPropagation());

    document.addEventListener("bralos-languagechange", () => { renderUi(); redraw(); });
    if (window.ResizeObserver) new ResizeObserver(redraw).observe(wrap); else window.addEventListener("resize", redraw);

    renderUi();
    draw();
    return { redraw };
  }

  /* ---------- Σύνδεση με τη σελίδα ---------- */
  let api = null;
  window.MAP_RENDERERS.mikotomi = function (stage) {
    api = build(stage, (typeof bralosGeo !== "undefined") ? bralosGeo : {});
  };
  window.MAP_ON_SHOW.mikotomi = function () { if (api) setTimeout(api.redraw, 0); };
})();
