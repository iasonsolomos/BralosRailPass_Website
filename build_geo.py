#!/usr/bin/env python3
"""
build_geo.py — μετατρέπει το TITH-BRA-LIAN.kml σε xartes-geo.js (για τη σελίδα Χάρτες).
Τρέξε:  python build_geo.py TITH-BRA-LIAN.kml xartes-geo.js
Μετά κάθε αλλαγή στο KML (π.χ. από το Google Earth), ξανατρέχεις την εντολή.
"""
import sys, re, json, html, os, math
import xml.etree.ElementTree as ET

SRC = sys.argv[1] if len(sys.argv) > 1 else 'TITH-BRA-LIAN.kml'
DST = sys.argv[2] if len(sys.argv) > 2 else 'xartes-geo.js'
PHOTO_DIR = 'img/xartes/'            # εκεί θα μπουν οι φωτογραφίες
K = '{http://www.opengis.net/kml/2.2}'

root = ET.parse(SRC).getroot()
top = root.find('.//' + K + 'Folder')

def tx(e, p):
    x = e.find(K + p)
    return (x.text or '').strip() if x is not None and x.text else ''

def fld(parent, name):
    for f in parent.findall(K + 'Folder'):
        if tx(f, 'name') == name:
            return f
    return None

def r6(v): return round(v, 6)

def pt(p):
    c = p.find('.//' + K + 'Point/' + K + 'coordinates')
    if c is None: return None
    a = c.text.strip().split(',')
    return [r6(float(a[1])), r6(float(a[0]))]          # [lat, lng]

def line(p, with_z=False):
    c = p.find('.//' + K + 'LineString/' + K + 'coordinates')
    if c is None: return None
    out = []
    for q in c.text.split():
        a = q.split(',')
        row = [r6(float(a[1])), r6(float(a[0]))]
        if with_z and len(a) > 2: row.append(round(float(a[2]), 1))
        out.append(row)
    return out

FACT = re.compile(r'^(Χιλιομετρική Θέση|Υψόμετρ\w*|Μήκος|Ύψος|Ανοίγματα|Μεσόβαθρα|Χ\.?Θ\.?|Κατασκευή Κτιρίου)\s*:\s*(\S.*)$')
LABEL = {'Υψόμετρ': 'Υψόμετρο', 'ΧΘ': 'Χ.Θ.', 'Χ.Θ.': 'Χ.Θ.', 'Χ.Θ': 'Χ.Θ.'}
photos_used = []

def parse_desc(raw, owner):
    """HTML/κείμενο του KML -> {facts, text, photos}"""
    if not raw: return {'facts': [], 'text': [], 'photos': []}
    photos = []
    for m in re.finditer(r'<img[^>]*src="([^"]+)"', raw, flags=re.I):
        base = os.path.basename(m.group(1).replace('\\', '/'))
        photos.append(PHOTO_DIR + base)
        photos_used.append((base, owner))
    s = re.sub(r'<img[^>]*>', '', raw, flags=re.I)
    s = re.sub(r'<br\s*/?>', '\n', s, flags=re.I)
    s = re.sub(r'</?p[^>]*>', '\n\n', s, flags=re.I)
    s = re.sub(r'<[^>]+>', '', s)
    s = html.unescape(s).replace('μ\'ετρα', 'μέτρα').replace('\u00a0', ' ')
    lines = [re.sub(r'[ \t]+', ' ', l).strip() for l in s.split('\n')]
    facts, body = [], []
    for l in lines:
        m = FACT.match(l)
        if m:
            lab = m.group(1)
            lab = LABEL.get(lab, 'Υψόμετρο' if lab.startswith('Υψόμετρ') else lab)
            facts.append([lab, m.group(2).strip()])
        else:
            body.append(l)
    paras, cur = [], []
    for l in body + ['']:
        if l: cur.append(l)
        elif cur:
            joiner = '<br>' if (len(cur) > 1 and max(len(x) for x in cur) <= 70) else ' '
            paras.append(joiner.join(cur)); cur = []
    # επικεφαλίδα που τελειώνει σε ':' ενώνεται με την επόμενη παράγραφο· αν δεν έχει επόμενη, αφαιρείται
    fixed, i = [], 0
    while i < len(paras):
        p = paras[i]
        if p.endswith(':'):
            if i + 1 < len(paras): fixed.append(p + '<br>' + paras[i + 1]); i += 2; continue
            i += 1; continue
        fixed.append(p); i += 1
    paras = []
    for p in fixed:                                   # ίδιες παράγραφοι δεν επαναλαμβάνονται
        if p not in paras: paras.append(p)
    photos = list(dict.fromkeys(photos))
    return {'facts': facts, 'text': paras, 'photos': photos}

def feat(p, owner=None):
    name = tx(p, 'name')
    d = parse_desc(tx(p, 'description'), owner or name)
    out = {'name': name}
    ll = pt(p)
    if ll: out['lat'], out['lng'] = ll
    for k in ('facts', 'text', 'photos'):
        if d[k]: out[k] = d[k]
    return out

def key(f): return (f['name'], f.get('lat'), f.get('lng'))

# --- Γενικές Πληροφορίες: καθαρότερες/πληρέστερες περιγραφές (υπερισχύουν) ---
gen = {}
g = fld(top, 'Γενικές Πληροφορίες')
for p in g.findall(K + 'Placemark'):
    if p.find('.//' + K + 'Point') is not None:
        f = feat(p); gen[key(f)] = f

def merged(p, owner=None):
    f = feat(p, owner)
    g = gen.get(key(f))
    if not g: return f
    out = dict(g)                                     # κείμενο/στοιχεία από τις «Γενικές Πληροφορίες»
    ph = list(dict.fromkeys(g.get('photos', []) + f.get('photos', [])))
    if ph: out['photos'] = ph                         # φωτογραφίες και από τις δύο εκδοχές
    return out

geo = {}

# --- Διαδρομή: TITH-BRA-LIAN, σπασμένη στον Μπράλο, με τις περιγραφές των δύο τμημάτων ---
diad = fld(top, 'Διαδρομή')
main = None; halves = {}
for p in diad.findall(K + 'Placemark'):
    n = tx(p, 'name')
    if n == 'TITH-BRA-LIAN': main = line(p)
    elif 'Μπράλος-Τιθορέα' in n: halves['tith'] = feat(p)
    elif 'Μπράλος-Λεινοκλάδι' in n: halves['lian'] = feat(p)
bral = None
for sub in fld(top, 'Σταθμοί-Στάσεις').findall(K + 'Folder'):
    if tx(sub, 'name') == 'Σ.Σ. Μπράλο':
        bral = pt(sub.find(K + 'Placemark'))
def dist2(a, b): return (a[0]-b[0])**2 + (a[1]-b[1])**2
split = min(range(len(main)), key=lambda i: dist2(main[i], bral))
seg_a = {'name': 'Τιθορέα – Μπράλος', 'coords': main[:split+1]}
seg_b = {'name': 'Μπράλος – Λειανοκλάδι', 'coords': main[split:]}
for seg, h in ((seg_a, halves.get('tith')), (seg_b, halves.get('lian'))):
    if h:
        for k in ('facts', 'text'):
            if h.get(k): seg[k] = h[k]
geo['route'] = [seg_a, seg_b]

# --- Σταθμοί / Στάσεις + παρακαμπτήρια ---
stations, sidings = [], []
ss = fld(top, 'Σταθμοί-Στάσεις')
for p in ss.findall(K + 'Placemark'):
    f = merged(p); f['kind'] = 'halt'; stations.append(f)
for sub in ss.findall(K + 'Folder'):
    kind = 'station' if tx(sub, 'name').startswith('Σ.Σ.') else 'halt'
    for p in sub.findall(K + 'Placemark'):
        if p.find('.//' + K + 'Point') is not None:
            f = merged(p); f['kind'] = kind; stations.append(f)
        elif p.find('.//' + K + 'LineString') is not None:
            sidings.append({'name': tx(p, 'name'), 'coords': line(p)})
geo['stations'] = stations
geo['sidings'] = sidings

# --- Τεχνικά έργα ---
te = fld(top, 'Τεχνικά Έργα')
def points_of(folder):
    return [merged(p) for p in folder.findall(K + 'Placemark') if p.find('.//' + K + 'Point') is not None]
for f in te.findall(K + 'Folder'):
    n = tx(f, 'name')
    if 'Σήραγγες' in n: geo['tunnels'] = points_of(f)
    elif 'Στοές' in n: geo['galleries'] = points_of(f)
    elif 'Γέφυρες' in n: geo['bridges'] = points_of(f)

# --- Χιλιομετρικές θέσεις ---
geo['kmposts'] = [{'name': tx(p, 'name'), 'lat': pt(p)[0], 'lng': pt(p)[1]}
                  for p in fld(top, 'Χιλιομετρικές Θέσεις').findall(K + 'Placemark')]

# --- Μονοπάτι ---
mon = fld(top, 'Μονοπάτι Σιδηροδρομικών')
tr = mon.find(K + 'Placemark')
geo['trail'] = {'name': 'Μονοπάτι Σιδηροδρομικών', 'coords': line(tr, with_z=True)}
tpts = []
for p in fld(mon, 'Σημεία').findall(K + 'Placemark'):
    f = {'name': tx(p, 'name'), 'lat': pt(p)[0], 'lng': pt(p)[1]}
    d = tx(p, 'description')
    if d and not re.fullmatch(r'[A-Z0-9_ ]+', d): f['text'] = [d]    # αγνοούμε κωδικούς GPS (π.χ. TUNNEL1)
    tpts.append(f)
geo['trailPoints'] = tpts

# --- Νέα χάραξη & γειτονικά ---
newl, other, towns = [], [], []
for p in top.findall(K + 'Placemark'):
    n = tx(p, 'name')
    if p.find('.//' + K + 'LineString') is not None:
        (newl if 'Νέα Χάραξη' in n else other).append({'name': n, 'coords': line(p)})
    elif p.find('.//' + K + 'Point') is not None and not re.match(r'^\d', n):
        ll = pt(p); towns.append({'name': n, 'lat': ll[0], 'lng': ll[1]})
geo['newLine'] = newl; geo['otherLines'] = other; geo['towns'] = towns

# --- Ανώνυμα σημεία ---
def anon(fname):
    fo = fld(top, fname)
    return [{'name': tx(p, 'name'), 'lat': pt(p)[0], 'lng': pt(p)[1]} for p in fo.findall(K + 'Placemark')]
geo['guardhouses'] = anon('Φυλάκια')
geo['houses']      = anon('Οικήματα')
geo['signals']     = anon('Φωτοσήματα')
geo['culverts']    = anon('Οχετοί')

# --- Έξοδος ---
def dump(o): return json.dumps(o, ensure_ascii=False, separators=(',', ':'))
with open(DST, 'w', encoding='utf-8') as fh:
    fh.write('/* xartes-geo.js — παράγεται αυτόματα από το %s με το build_geo.py. ΜΗΝ το επεξεργάζεσαι με το χέρι:\n'
             '   άλλαξε το KML και ξανατρέξε το build_geo.py. */\n' % os.path.basename(SRC))
    fh.write('const bralosGeo = {\n')
    keys = list(geo.keys())
    for i, k in enumerate(keys):
        fh.write('  %s: %s%s\n' % (json.dumps(k), dump(geo[k]), ',' if i < len(keys)-1 else ''))
    fh.write('};\n')

# λίστα φωτογραφιών που χρειάζονται
seen = {}
for base, owner in photos_used: seen.setdefault(base, owner)
with open(os.path.splitext(DST)[0] + '-photos.txt', 'w', encoding='utf-8') as fh:
    fh.write('Φωτογραφίες που αναφέρονται στο KML. Βάλτε τις στον φάκελο %s\n\n' % PHOTO_DIR)
    for base, owner in sorted(seen.items(), key=lambda x: x[1]):
        fh.write('%-22s  ->  %s\n' % (base, owner))

print('route', [len(s['coords']) for s in geo['route']], '| stations', len(stations), '| sidings', len(sidings),
      '| bridges', len(geo['bridges']), '| tunnels', len(geo['tunnels']), '| galleries', len(geo['galleries']),
      '| kmposts', len(geo['kmposts']), '| trail pts', len(geo['trail']['coords']), '| towns', [t['name'] for t in towns],
      '| photos', len(seen), '| size KB', os.path.getsize(DST)//1024)
