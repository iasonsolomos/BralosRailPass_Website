/* ==========================================================================
   xartes-enas.js  —  ΒΗΜΑ 2: «Ένας Ενιαίος Χάρτης»  (Leaflet + OpenStreetMap)
   Τα δεδομένα (διαδρομή, σταθμοί, γέφυρες, σήραγγες...) έρχονται από το
   xartes-geo.js, που παράγεται από το KML με το build_geo.py.
   Εδώ ορίζεται μόνο ο τρόπος εμφάνισης.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Ρυθμίσεις που μπορείς να αλλάξεις ---------- */

  // Επίπεδα του χάρτη: on = εμφανίζεται από την αρχή. Η σειρά είναι η σειρά στο πλαίσιο «Επίπεδα».
  const LAYERS = [
    { id: "route",     on: true,  color: "#e8590c", label: { el: "Διαδρομή",                       en: "Route" } },
    { id: "stations",  on: true,  color: "#174c3d", label: { el: "Σταθμοί & Στάσεις",              en: "Stations & Halts" } },
    { id: "bridges",   on: false, color: "#1c7ed6", label: { el: "Γέφυρες",                        en: "Bridges" } },
    { id: "tunnels",   on: false, color: "#6b4226", label: { el: "Σήραγγες",                       en: "Tunnels" } },
    { id: "galleries", on: false, color: "#d6336c", label: { el: "Στοές",                          en: "Galleries" } },
    { id: "kmposts",   on: false, color: "#868e96", label: { el: "Χιλιομετρικές θέσεις",           en: "Kilometre posts" } },
    { id: "trail",     on: false, color: "#2f9e44", label: { el: "Μονοπάτι",                       en: "Trail" } },
    { id: "newline",   on: false, color: "#3b5bdb", label: { el: "Νέα χάραξη & γειτονικές γραμμές", en: "New alignment & neighbouring lines" } },
    { id: "more",      on: false, color: "#9775fa", label: { el: "Φυλάκια, οικήματα, φωτοσήματα",   en: "Guardhouses, houses, signals" } }
  ];

  // Υπόβαθρα χάρτη
  const BASES = [
    { id: "osm",  label: { el: "Χάρτης",       en: "Map" },
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      opt: { maxZoom: 19, attribution: "© <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>" } },
    { id: "topo", label: { el: "Τοπογραφικός", en: "Topographic" },
      url: "https://tile.opentopomap.org/{z}/{x}/{y}.png",
      opt: { maxZoom: 17, attribution: "© <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>, © <a href=\"https://opentopomap.org\">OpenTopoMap</a> (CC-BY-SA)" } }
  ];

  const LEAFLET_JS  = ["https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",  "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js"];
  const LEAFLET_CSS = ["https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css"];

  const UI = {
    el: { layers: "Επίπεδα", loading: "Φόρτωση χάρτη…",
          fail: "Δεν μπόρεσε να φορτωθεί ο χάρτης. Ελέγξτε τη σύνδεσή σας στο internet και ανανεώστε τη σελίδα.",
          nodata: "Λείπει το αρχείο xartes-geo.js. Βάλτε το στον ίδιο φάκελο με το xartes.html.",
          guardhouse: "Φυλάκιο", house: "Οίκημα", signal: "Φωτόσημα", culvert: "Οχετός" },
    en: { layers: "Layers", loading: "Loading map…",
          fail: "The map could not be loaded. Please check your internet connection and reload the page.",
          nodata: "The file xartes-geo.js is missing. Put it in the same folder as xartes.html.",
          guardhouse: "Guardhouse", house: "House", signal: "Signal", culvert: "Culvert" }
  };
  const lang = () => (typeof language !== "undefined" && language === "en") ? "en" : "el";
  const pick = o => o ? (o[lang()] || o.el || "") : "";
  const ui = k => UI[lang()][k];

  /* ---------- Φόρτωση του Leaflet (μόνο όταν χρειαστεί) ---------- */
  function loadScript(urls) {
    return new Promise((resolve, reject) => {
      let i = 0;
      (function next() {
        if (i >= urls.length) return reject(new Error("leaflet script"));
        const s = document.createElement("script");
        s.src = urls[i++];
        s.onload = resolve;
        s.onerror = () => { s.remove(); next(); };
        document.head.appendChild(s);
      })();
    });
  }
  function loadCss(urls) {
    let i = 0;
    (function next() {
      if (i >= urls.length) return;
      const l = document.createElement("link");
      l.rel = "stylesheet"; l.href = urls[i++];
      l.onerror = () => { l.remove(); next(); };
      document.head.appendChild(l);
    })();
  }
  function ensureLeaflet() {
    if (window.L && window.L.map) return Promise.resolve();
    loadCss(LEAFLET_CSS);
    return loadScript(LEAFLET_JS);
  }

  /* ---------- Βοηθητικά ---------- */
  const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

  function popupHtml(f) {
    const facts = (f.facts && f.facts.length)
      ? `<dl class="xm-facts">${f.facts.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>` : "";
    const text = (f.text || []).map(p => `<p>${esc(p).replace(/&lt;br&gt;/g, "<br>")}</p>`).join("");
    const photos = (f.photos || []).map(src =>
      `<img class="xm-photo" src="${esc(src)}" alt="${esc(f.name)}" loading="lazy" onerror="this.remove()">`).join("");
    return `<div class="xm-pop"><h3>${esc(f.name)}</h3>${facts}${text}${photos}</div>`;
  }
  const POPUP_OPT = { maxWidth: 440, minWidth: 250, maxHeight: 460, className: "xm-popup", autoPanPadding: [24, 80] };

  /* ---------- Ο χάρτης ---------- */
  let map = null, fitted = false, routeBounds = null;

  function build(stage, geo) {
    stage.innerHTML = '<div class="xm-map"></div>';
    const el = stage.firstChild;

    map = L.map(el, { zoomControl: true, scrollWheelZoom: true, minZoom: 8, zoomSnap: 0.5 });
    routeBounds = L.latLngBounds(geo.route.reduce((a, s) => a.concat(s.coords), []));

    // υπόβαθρα
    const baseLayers = {};
    BASES.forEach(b => { baseLayers[b.id] = L.tileLayer(b.url, b.opt); });
    let baseId = "osm";
    baseLayers[baseId].addTo(map);

    // κάθε επίπεδο φτιάχνεται την πρώτη φορά που ανοίγει
    const groups = {};
    const state = {};
    LAYERS.forEach(l => { state[l.id] = l.on; });

    const circle = (lat, lng, o) => L.circleMarker([lat, lng], Object.assign({ weight: 2, color: "#fff", fillOpacity: 1 }, o));

    const builders = {
      route() {
        const g = L.layerGroup();
        geo.route.forEach(seg => {
          L.polyline(seg.coords, { color: "#fff", weight: 9, opacity: 0.9, interactive: false }).addTo(g);
          L.polyline(seg.coords, { color: "#e8590c", weight: 5, opacity: 1, lineJoin: "round", interactive: false }).addTo(g);
          // αόρατη, φαρδιά γραμμή, για να πατιέται εύκολα (και στο κινητό)
          L.polyline(seg.coords, { color: "#000", weight: 20, opacity: 0 })
            .bindPopup(popupHtml(seg), POPUP_OPT).bindTooltip(seg.name, { sticky: true }).addTo(g);
        });
        return g;
      },
      stations() {
        const g = L.layerGroup();
        (geo.sidings || []).forEach(s => L.polyline(s.coords, { color: "#7a1f1f", weight: 3, opacity: 0.9, interactive: false }).addTo(g));
        geo.stations.forEach(s => {
          const isStation = s.kind === "station";
          circle(s.lat, s.lng, { radius: isStation ? 9 : 7, fillColor: isStation ? "#174c3d" : "#b18b46" })
            .bindPopup(popupHtml(s), POPUP_OPT)
            .bindTooltip(esc(s.name), { permanent: true, direction: "right", offset: [9, 0], className: "xm-label" })
            .addTo(g);
        });
        return g;
      },
      bridges() {
        const g = L.layerGroup();
        (geo.bridges || []).forEach(f => circle(f.lat, f.lng, { radius: 6, fillColor: "#1c7ed6" })
          .bindPopup(popupHtml(f), POPUP_OPT).bindTooltip(esc(f.name), { className: "xm-label" }).addTo(g));
        return g;
      },
      tunnels() {
        const g = L.layerGroup();
        (geo.tunnels || []).forEach(f => circle(f.lat, f.lng, { radius: 6, fillColor: "#6b4226" })
          .bindPopup(popupHtml(f), POPUP_OPT).bindTooltip(esc(f.name), { className: "xm-label" }).addTo(g));
        return g;
      },
      galleries() {
        const g = L.layerGroup();
        (geo.galleries || []).forEach(f => circle(f.lat, f.lng, { radius: 5, fillColor: "#d6336c" })
          .bindPopup(popupHtml(f), POPUP_OPT).bindTooltip(esc(f.name), { className: "xm-label" }).addTo(g));
        return g;
      },
      kmposts() {
        const g = L.layerGroup();
        (geo.kmposts || []).forEach(f => circle(f.lat, f.lng, { radius: 4, weight: 1, fillColor: "#868e96" })
          .bindTooltip(esc(f.name) + " χλμ.", { permanent: true, direction: "top", offset: [0, -4], className: "xm-label xm-km" }).addTo(g));
        return g;
      },
      trail() {
        const g = L.layerGroup();
        L.polyline(geo.trail.coords.map(c => [c[0], c[1]]), { color: "#2f9e44", weight: 4, dashArray: "7 7", opacity: 0.95 })
          .bindTooltip(esc(geo.trail.name), { sticky: true }).addTo(g);
        (geo.trailPoints || []).forEach(f => circle(f.lat, f.lng, { radius: 5, fillColor: "#2f9e44" })
          .bindPopup(popupHtml(f), POPUP_OPT).bindTooltip(esc(f.name), { className: "xm-label" }).addTo(g));
        return g;
      },
      newline() {
        const g = L.layerGroup();
        (geo.newLine || []).forEach(s => L.polyline(s.coords, { color: "#3b5bdb", weight: 3, opacity: 0.85 })
          .bindTooltip(esc(s.name), { sticky: true }).addTo(g));
        (geo.otherLines || []).forEach(s => L.polyline(s.coords, { color: "#74c0fc", weight: 3, opacity: 0.9, dashArray: "4 6" })
          .bindTooltip(esc(s.name), { sticky: true }).addTo(g));
        (geo.towns || []).forEach(t => circle(t.lat, t.lng, { radius: 5, fillColor: "#3b5bdb" })
          .bindTooltip(esc(t.name), { permanent: true, direction: "right", offset: [7, 0], className: "xm-label" }).addTo(g));
        return g;
      },
      more() {
        const g = L.layerGroup();
        const add = (arr, key, color) => (arr || []).forEach(f => circle(f.lat, f.lng, { radius: 4, weight: 1, fillColor: color })
          .bindTooltip(esc(f.name || ui(key)), { className: "xm-label" }).addTo(g));
        add(geo.guardhouses, "guardhouse", "#9775fa");
        add(geo.houses,      "house",      "#f08c00");
        add(geo.signals,     "signal",     "#e03131");
        add(geo.culverts,    "culvert",    "#12b886");
        return g;
      }
    };

    // Σειρά στοίβαξης (από κάτω προς τα πάνω), ώστε οι σταθμοί να μένουν πάντα πάνω από όλα
    const STACK = ["newline", "trail", "route", "kmposts", "more", "galleries", "tunnels", "bridges", "stations"];
    function restack() {
      STACK.forEach(id => {
        if (groups[id] && map.hasLayer(groups[id])) {
          groups[id].eachLayer(l => { if (l.bringToFront) l.bringToFront(); });
        }
      });
    }
    function setLayer(id, on) {
      state[id] = on;
      if (on) {
        if (!groups[id]) groups[id] = builders[id]();
        groups[id].addTo(map);
        restack();
      } else if (groups[id]) {
        map.removeLayer(groups[id]);
      }
    }
    LAYERS.forEach(l => { if (l.on) setLayer(l.id, true); });

    // τα νούμερα των χιλιομετρικών εμφανίζονται μόνο όταν κάνεις αρκετό zoom
    function kmLabels() { el.classList.toggle("xm-km-on", map.getZoom() >= 13); }
    map.on("zoomend", kmLabels); kmLabels();

    // οι φωτογραφίες φορτώνουν αργότερα· ξαναϋπολογίζουμε το μέγεθος του popup
    map.on("popupopen", e => {
      const node = e.popup.getElement && e.popup.getElement();
      if (!node) return;
      node.querySelectorAll("img").forEach(img => img.addEventListener("load", () => e.popup.update()));
    });

    /* ---------- Πλαίσιο «Επίπεδα» ---------- */
    let panelEl = null, collapsed = stage.clientWidth < 600;

    function renderPanel() {
      panelEl.classList.toggle("collapsed", collapsed);
      panelEl.innerHTML = `
        <button type="button" class="xm-panel-toggle" aria-expanded="${!collapsed}">${ui("layers")} <span aria-hidden="true">${collapsed ? "▸" : "▾"}</span></button>
        <div class="xm-panel-body">
          <div class="xm-group">${BASES.map(b => `
            <label><input type="radio" name="xm-base" value="${b.id}"${b.id === baseId ? " checked" : ""}> ${esc(pick(b.label))}</label>`).join("")}
          </div>
          <div class="xm-group">${LAYERS.map(l => `
            <label><input type="checkbox" data-layer="${l.id}"${state[l.id] ? " checked" : ""}> <i class="xm-sw" style="background:${l.color}"></i> ${esc(pick(l.label))}</label>`).join("")}
          </div>
        </div>`;
    }

    const Panel = L.Control.extend({
      options: { position: "topright" },
      onAdd() {
        panelEl = L.DomUtil.create("div", "xm-panel");
        L.DomEvent.disableClickPropagation(panelEl);
        L.DomEvent.disableScrollPropagation(panelEl);
        panelEl.addEventListener("change", e => {
          const t = e.target;
          if (t.name === "xm-base") {
            map.removeLayer(baseLayers[baseId]);
            baseId = t.value;
            baseLayers[baseId].addTo(map);
          } else if (t.dataset.layer) {
            setLayer(t.dataset.layer, t.checked);
          }
        });
        panelEl.addEventListener("click", e => {
          if (e.target.closest(".xm-panel-toggle")) { collapsed = !collapsed; renderPanel(); }
        });
        renderPanel();
        return panelEl;
      }
    });
    new Panel().addTo(map);
    document.addEventListener("bralos-languagechange", () => { if (panelEl) renderPanel(); });

    L.control.scale({ metric: true, imperial: false, position: "bottomleft" }).addTo(map);

    fitOnce();
  }

  // Προσαρμογή της προβολής στη διαδρομή· μόνο όταν το πλαίσιο έχει πραγματικό μέγεθος
  function fitOnce() {
    if (!map || fitted) return;
    const c = map.getContainer();
    if (c.clientWidth > 0 && c.clientHeight > 0) {
      map.invalidateSize();
      map.fitBounds(routeBounds, { padding: [30, 30] });
      fitted = true;
    }
  }

  /* ---------- Σύνδεση με τη σελίδα ---------- */
  window.MAP_RENDERERS.enas = function (stage) {
    if (typeof bralosGeo === "undefined") {
      stage.innerHTML = `<div class="xm-placeholder"><div>${ui("nodata")}</div></div>`;
      return;
    }
    stage.innerHTML = `<div class="xm-placeholder"><div>${ui("loading")}</div></div>`;
    ensureLeaflet().then(() => build(stage, bralosGeo)).catch(() => {
      stage.innerHTML = `<div class="xm-placeholder"><div>${ui("fail")}</div></div>`;
    });
  };

  // Κάθε φορά που ανοίγει το κουμπί «Ενιαίος Χάρτης»
  window.MAP_ON_SHOW.enas = function () {
    if (!map) return;
    setTimeout(() => { map.invalidateSize(); fitOnce(); }, 0);
  };
})();
