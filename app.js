/* VS Moto site script: the kit builder and the Instagram feed. */

// ---------- Instagram posts shown in "Fresh off the bench" ----------
// Add or remove links here. Newest first. Any public post or reel link works.
const POSTS = [
  'https://www.instagram.com/reel/DfbLVyeMPoq/',
  'https://www.instagram.com/reel/DVttVepko6r/',
  'https://www.instagram.com/reel/DLAc7-OteT6/',
  'https://www.instagram.com/p/DKbOZUYMzRZ/',
  'https://www.instagram.com/reel/DKtUnZZta_R/',
  'https://www.instagram.com/p/DKGnwpqsJVV/',
];

// ---------- kit builder ----------
const BASES = [
  ['Asphalt', '#16121c'], ['White', '#f4f1f7'], ['Magenta', '#ff2e8b'],
  ['Volt', '#6d4bff'], ['Race red', '#e3262f'], ['Moto orange', '#ff6a13'],
  ['Teal', '#00b3a7'], ['Sand', '#d8c3a0'],
];
const ACCENTS = [
  ['Magenta', '#ff2e8b'], ['Volt', '#6d4bff'], ['Plate yellow', '#ffd60a'],
  ['Cyan', '#22d3ff'], ['Lime', '#b6ff2e'], ['White', '#f4f1f7'], ['Black', '#0d0a12'],
];
const PATTERNS = ['Stripes', 'Chevron', 'Shards', 'Splatter', 'Clean'];

const W = 1200;
// Kit pieces drawn as if laid flat on a table. Right-hand pieces mirror the left.
const PIECES = [
  { id: 'shroudL', d: 'M40,100 C140,46 330,44 440,84 L424,196 C352,222 270,272 172,292 L72,254 Z', label: [250, 175], kind: 'name' },
  { id: 'plate', d: 'M516,50 Q600,26 684,50 L708,196 Q600,280 492,196 Z', label: [600, 172], kind: 'number' },
  { id: 'fenderF', d: 'M470,318 C540,292 660,292 730,318 L718,374 C650,354 550,354 482,374 Z' },
  { id: 'panelL', d: 'M64,366 L384,342 C426,384 436,474 404,566 L154,588 C94,526 64,456 64,366 Z', label: [238, 478], kind: 'number' },
  { id: 'fenderR', d: 'M452,430 L748,430 C758,494 720,576 642,598 L558,598 C480,576 442,494 452,430 Z', label: [600, 520], kind: 'tag' },
];
const mirror = d => d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${W - +x},${y}`);
const ALL = PIECES.flatMap(p =>
  p.id.endsWith('L')
    ? [p, { ...p, id: p.id.replace(/L$/, 'R'), d: mirror(p.d), label: p.label && [W - p.label[0], p.label[1]] }]
    : [p]);

const state = { base: BASES[0][1], accent: ACCENTS[0][1], pattern: 'Stripes', number: '46', name: 'VS MOTO' };

const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs = {}, text) => {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (text != null) n.textContent = text;
  return n;
};

// Small seeded random so a pattern stays put while you change colours.
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}
let seed = 2046;

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => {
    v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const inkOn = hex => (luminance(hex) > 0.35 ? '#0d0a12' : '#f4f1f7');

function patternLayer(kind, accent) {
  const g = el('g');
  const r = rng(seed);
  if (kind === 'Stripes') {
    for (let x = -700; x < 1400; x += 120) {
      g.append(el('polygon', { points: `${x},0 ${x + 46},0 ${x + 46 + 420},640 ${x + 420},640`, fill: accent }));
    }
  } else if (kind === 'Chevron') {
    for (let y = -40; y < 700; y += 110) {
      g.append(el('polyline', {
        points: `-20,${y + 60} 300,${y} 600,${y + 60} 900,${y} 1220,${y + 60}`,
        fill: 'none', stroke: accent, 'stroke-width': 30, 'stroke-linejoin': 'miter',
      }));
    }
  } else if (kind === 'Shards') {
    for (let i = 0; i < 46; i++) {
      const cx = r() * W, cy = r() * 640, s = 30 + r() * 110, a = r() * Math.PI;
      const pts = [0, 1, 2].map(k => {
        const t = a + k * 2.1 + r() * 0.5;
        return `${cx + Math.cos(t) * s},${cy + Math.sin(t) * s * 0.55}`;
      }).join(' ');
      g.append(el('polygon', { points: pts, fill: accent, opacity: (0.55 + r() * 0.45).toFixed(2) }));
    }
  } else if (kind === 'Splatter') {
    for (let i = 0; i < 140; i++) {
      const big = r() < 0.12;
      g.append(el('circle', {
        cx: r() * W, cy: r() * 640, r: big ? 18 + r() * 26 : 2 + r() * 9, fill: accent,
      }));
    }
  }
  // Every pattern gets one sweeping band, so the kit reads as one design across pieces.
  g.append(el('path', { d: 'M-50,330 C300,240 900,520 1250,300 L1250,380 C900,600 300,320 -50,410 Z', fill: accent, opacity: kind === 'Clean' ? 1 : 0.9 }));
  return g;
}

function render() {
  const svg = document.getElementById('kit');
  [...svg.querySelectorAll(':scope > :not(title)')].forEach(n => n.remove());
  const defs = el('defs');
  svg.append(defs);
  const ink = inkOn(state.base);
  const accentInk = inkOn(state.accent);

  for (const p of ALL) {
    const cp = el('clipPath', { id: `cp-${p.id}` });
    cp.append(el('path', { d: p.d }));
    defs.append(cp);

    const g = el('g', { 'clip-path': `url(#cp-${p.id})` });
    g.append(el('rect', { x: 0, y: 0, width: W, height: 640, fill: state.base }));
    g.append(patternLayer(state.pattern, state.accent));

    if (p.label) {
      const [x, y] = p.label;
      if (p.kind === 'number') {
        // White race backgrounds behind numbers, like real plates.
        const isPlate = p.id === 'plate';
        g.append(el('rect', {
          x: x - (isPlate ? 120 : 110), y: y - (isPlate ? 120 : 92),
          width: isPlate ? 240 : 220, height: isPlate ? 180 : 150, fill: isPlate ? '#ffd60a' : '#f4f1f7',
        }));
        g.append(el('text', {
          x, y: y + (isPlate ? 28 : 34), 'text-anchor': 'middle',
          'font-family': 'Big Shoulders Display, Impact, sans-serif', 'font-weight': 900,
          'font-size': isPlate ? 150 : 130, fill: '#0d0a12',
        }, state.number || '00'));
      } else if (p.kind === 'name') {
        g.append(el('text', {
          x, y, 'text-anchor': 'middle', transform: `rotate(-9 ${x} ${y})`,
          'font-family': 'Big Shoulders Display, Impact, sans-serif', 'font-weight': 900,
          'font-size': 58, 'letter-spacing': 2, fill: ink, stroke: state.base, 'stroke-width': 8,
          'paint-order': 'stroke',
        }, (state.name || ' ').toUpperCase()));
      } else if (p.kind === 'tag') {
        g.append(el('text', {
          x, y, 'text-anchor': 'middle',
          'font-family': 'Big Shoulders Display, Impact, sans-serif', 'font-weight': 900,
          'font-size': 44, fill: accentInk, stroke: state.accent, 'stroke-width': 10, 'paint-order': 'stroke',
        }, 'VS/MOTO'));
      }
    }
    svg.append(g);
    svg.append(el('path', { d: p.d, fill: 'none', stroke: '#f4f1f7', 'stroke-opacity': .35, 'stroke-width': 2 }));
  }
  updateSend();
}

function nameOf(list, hex) { return (list.find(([, h]) => h === hex) || [hex])[0]; }

function summary() {
  return `Hi Vivek! Kit idea from the VS Moto site:
Base: ${nameOf(BASES, state.base)}
Accent: ${nameOf(ACCENTS, state.accent)}
Pattern: ${state.pattern}
Number: ${state.number || '-'}
Name: ${state.name || '-'}
My bike: `;
}
function updateSend() {
  document.getElementById('send').dataset.text = summary();
}

function buildControls() {
  const make = (field, items, isSwatch) => {
    const box = document.querySelector(`[data-field="${field}"]`);
    box.innerHTML = '';
    for (const it of items) {
      const [label, value] = isSwatch ? it : [it, it];
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-pressed', String(state[field] === value));
      if (isSwatch) { b.style.background = value; b.setAttribute('aria-label', label); b.title = label; }
      else b.textContent = label;
      b.addEventListener('click', () => {
        state[field] = value;
        box.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        render();
      });
      box.append(b);
    }
  };
  make('base', BASES, true);
  make('accent', ACCENTS, true);
  make('pattern', PATTERNS, false);

  const num = document.getElementById('f-number');
  const name = document.getElementById('f-name');
  num.addEventListener('input', () => { num.value = num.value.replace(/\D/g, ''); state.number = num.value; render(); });
  name.addEventListener('input', () => { state.name = name.value; render(); });

  document.getElementById('shuffle').addEventListener('click', () => {
    const pick = a => a[Math.floor(Math.random() * a.length)];
    state.base = pick(BASES)[1];
    do { state.accent = pick(ACCENTS)[1]; } while (state.accent === state.base);
    state.pattern = pick(PATTERNS.slice(0, 4));
    state.number = String(Math.floor(Math.random() * 99) + 1);
    num.value = state.number;
    seed = Math.floor(Math.random() * 1e9);
    buildControls();
    render();
  });

  document.getElementById('send').addEventListener('click', async e => {
    const hint = document.getElementById('send-hint');
    try {
      await navigator.clipboard.writeText(e.currentTarget.dataset.text);
      hint.textContent = 'Design details copied. Paste them into the message.';
      hint.classList.add('ok');
    } catch {
      hint.textContent = 'Tell Vivek: ' + e.currentTarget.dataset.text.replace(/\n/g, ' · ');
    }
  });
}

// ---------- Instagram feed (loads only when you scroll near it) ----------
function buildFeed() {
  const feed = document.getElementById('feed');
  feed.innerHTML = POSTS.map(u => `
    <blockquote class="instagram-media" data-instgrm-permalink="${u}?utm_source=ig_embed" data-instgrm-version="14">
      <a class="ph" href="${u}" target="_blank" rel="noopener">Loading post from @vs.moto_2046…</a>
    </blockquote>`).join('');
  const load = () => {
    if (window.instgrm) return window.instgrm.Embeds.process();
    const s = document.createElement('script');
    s.async = true; s.src = 'https://www.instagram.com/embed.js';
    document.body.append(s);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => {
      if (es.some(x => x.isIntersecting)) { io.disconnect(); load(); }
    }, { rootMargin: '600px' });
    io.observe(feed);
  } else load();
}

document.getElementById('year').textContent = new Date().getFullYear();
buildControls();
render();
buildFeed();
// Re-render once the display font arrives so numbers use it.
document.fonts && document.fonts.ready.then(render);
