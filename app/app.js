// Leonida Legends — GTA VI trophy guide & tracker.
// Plain static app: loads app/data/trophies.json, saves checklist progress in
// localStorage, and never makes a network request of its own.
const KEY = 'gta6-trophy-guide-v1';
const params = new URLSearchParams(location.search);

const STAGES = [
  { n: 1, title: 'Stage 1 — Story first', text: 'Play Chapters 1–4 and the final mission, plus the named story missions along the way. This unlocks the map, the activities and the stranger strands everything else needs.' },
  { n: 2, title: 'Stage 2 — Side strands', text: 'Finish the stranger mission chains: Andy, Kenton, Billy, Randy and Tyrone each have a final mission, and 8 complete strands earns the silver. Strands unlock as the story progresses.' },
  { n: 3, title: 'Stage 3 — Activities', text: 'Shooting range golds, 250 stunts, races, fishing, the arcade, drone races, meditation spots and the hunt. The range and the races are the long grinds — start them early.' },
  { n: 4, title: 'Stage 4 — Collectibles & world', text: 'Cards, WAiNK photos, vehicle discoveries, all 52 areas, the 8 garages and Scooter Bros registrations. Explore thoroughly once instead of making separate trips.' },
  { n: 5, title: 'Stage 5 — Combat & chaos', text: 'Combat Focus, the airport, the Rhino, and the robbery chain: shops, trucks, vaults and one operation per gang. Bring armour and a getaway plan.' },
  { n: 6, title: 'Stage 6 — Money & lifestyle', text: 'Launder $250,000 of Marked Bills, spend $100,000 in the shops, and mop up the lifestyle trophies: bowling, cocktails, choices and the oddities.' },
  { n: 7, title: 'Stage 7 — Clean-up & platinum', text: 'Fifty challenges, then 100% completion — the game tells you what is missing in Stats — and the platinum pops right after.' },
];

const rowsEl = document.getElementById('rows');
const detailEl = document.getElementById('detail');
const progressEl = document.getElementById('progress');
const barEl = document.getElementById('barfill');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const spoilerEl = document.getElementById('spoiler');
const emptyEl = document.getElementById('empty');
const onlineNoteEl = document.getElementById('online-note');

let trophies = [];
let earned = new Set();
let kind = params.get('filter') ?? 'all';
let selected = null;

function loadEarned() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (Array.isArray(saved)) return new Set(saved.filter((x) => Number.isInteger(x)));
  } catch { /* corrupted save: start fresh */ }
  const fromUrl = (params.get('earned') ?? '')
    .split(',').map((s) => Number(s)).filter((n) => Number.isInteger(n) && n >= 1 && n <= 55);
  return new Set(fromUrl);
}
function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

function hidden(t) {
  return spoilerEl.checked && t.kind === 'story' && !earned.has(t.id);
}
function displayName(t) {
  return hidden(t) ? 'Hidden story trophy' : t.name;
}
function displayDesc(t) {
  return hidden(t) ? 'Hidden until earned — turn the spoiler setting off to see it.' : t.description;
}

function matches(t) {
  if (kind === 'missable' && !t.missable) return false;
  if (kind === 'online') return false; // the game lists no online trophies
  if (kind !== 'all' && kind !== 'missable' && t.kind !== kind) return false;
  if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
  const q = searchEl.value.trim().toLowerCase();
  if (q && !(t.name.toLowerCase().includes(q) || t.guide.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) return false;
  return true;
}

function render() {
  const list = trophies.filter(matches);
  onlineNoteEl.hidden = kind !== 'online';
  emptyEl.hidden = list.length > 0 || kind === 'online';
  rowsEl.replaceChildren();
  for (const t of list) {
    const li = document.createElement('li');
    li.className = 'row' + (earned.has(t.id) ? ' earned' : '') + (selected === t.id ? ' selected' : '');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Earned: ${t.name}`);
    box.addEventListener('change', (e) => {
      e.stopPropagation();
      if (box.checked) earned.add(t.id); else earned.delete(t.id);
      save(); render();
    });
    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = displayName(t);
    const desc = document.createElement('div');
    desc.className = 'desc';
    desc.textContent = displayDesc(t);
    const tags = document.createElement('div');
    tags.className = 'tags';
    const gradeTag = document.createElement('span');
    gradeTag.className = 'tag grade-' + t.grade;
    gradeTag.textContent = t.grade;
    tags.append(gradeTag);
    const kindTag = document.createElement('span');
    kindTag.className = 'tag';
    kindTag.textContent = t.kind;
    if (t.kind !== t.grade) tags.append(kindTag);
    if (t.missable) {
      const m = document.createElement('span');
      m.className = 'tag missable';
      m.textContent = 'Missable';
      tags.append(m);
    }
    if (t.count) {
      const c = document.createElement('span');
      c.className = 'tag';
      c.textContent = '×' + t.count;
      tags.append(c);
    }
    body.append(name, desc, tags);
    const pts = document.createElement('span');
    pts.className = 'tag';
    pts.textContent = { platinum: '300', gold: '90', silver: '30', bronze: '15' }[t.grade] + ' pts';
    li.append(box, body, pts);
    li.addEventListener('click', (e) => {
      if (e.target === box) return;
      selected = t.id;
      renderDetail();
      render();
    });
    rowsEl.append(li);
  }
  const pct = Math.round((earned.size / trophies.length) * 100);
  progressEl.textContent = `${earned.size} of ${trophies.length} earned · ${pct}%`;
  barEl.style.width = pct + '%';
  renderDetail();
}

function renderDetail() {
  const t = trophies.find((x) => x.id === selected);
  if (!t) {
    detailEl.innerHTML = '';
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'Select a trophy to see its guide, sources and roadmap stage.';
    detailEl.append(p);
    return;
  }
  detailEl.replaceChildren();
  const h = document.createElement('h2');
  h.textContent = displayName(t);
  const off = document.createElement('p');
  off.className = 'official';
  off.textContent = `"${displayDesc(t)}" — ${t.grade}, ${t.kind}${t.missable ? ', missable' : ''}${t.count ? ', ×' + t.count : ''}`;
  const gh = document.createElement('h3');
  gh.textContent = 'Guide';
  const g = document.createElement('p');
  g.textContent = hidden(t) ? 'Earn this trophy to reveal its guide.' : t.guide;
  const sh = document.createElement('h3');
  sh.textContent = 'Sources';
  const ul = document.createElement('ul');
  for (const s of (hidden(t) ? ['Official trophy description (PlayStation, via Exophase / PSNProfiles)'] : t.sources)) {
    const li = document.createElement('li');
    li.textContent = s;
    ul.append(li);
  }
  const rh = document.createElement('h3');
  rh.textContent = 'Roadmap';
  const r = document.createElement('p');
  r.textContent = STAGES[t.stage - 1].title + ' — ' + STAGES[t.stage - 1].text;
  detailEl.append(h, off, gh, g, sh, ul, rh, r);
}

function renderRoadmap() {
  const wrap = document.getElementById('stages');
  wrap.replaceChildren();
  for (const s of STAGES) {
    const div = document.createElement('div');
    div.className = 'stage';
    const h = document.createElement('h2');
    h.textContent = s.title;
    const p = document.createElement('p');
    p.textContent = s.text;
    const ul = document.createElement('ul');
    for (const t of trophies.filter((x) => x.stage === s.n)) {
      const li = document.createElement('li');
      li.className = earned.has(t.id) ? 'done' : '';
      li.textContent = (earned.has(t.id) ? '✓ ' : '○ ') + displayName(t) + ' — ' + t.grade + (t.missable ? ' · missable' : '');
      ul.append(li);
    }
    div.append(h, p, ul);
    wrap.append(div);
  }
}

function setView(view) {
  const checklist = view !== 'roadmap';
  document.getElementById('checklist-view').hidden = !checklist;
  document.getElementById('roadmap-view').hidden = checklist;
  document.getElementById('view-checklist').classList.toggle('active', checklist);
  document.getElementById('view-roadmap').classList.toggle('active', !checklist);
  if (!checklist) renderRoadmap();
}

document.getElementById('view-checklist').addEventListener('click', () => setView('checklist'));
document.getElementById('view-roadmap').addEventListener('click', () => setView('roadmap'));
document.querySelectorAll('#kindfilters .chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    kind = chip.dataset.kind;
    document.querySelectorAll('#kindfilters .chip').forEach((c) => c.classList.toggle('active', c === chip));
    render();
  });
});
searchEl.addEventListener('input', render);
gradeEl.addEventListener('change', render);
spoilerEl.addEventListener('change', render);

document.getElementById('export').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify([...earned].sort((x, y) => x - y), null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
});
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = (Array.isArray(data) ? data : data.earned ?? []).filter((n) => Number.isInteger(n) && n >= 1 && n <= 55);
    earned = new Set(ids);
    save(); render();
  } catch {
    alert('That file is not a valid progress export.');
  }
  e.target.value = '';
});

const doc = await (await fetch('data/trophies.json')).json();
trophies = doc.trophies;
earned = loadEarned();
save();
if (['story', 'missable', 'collectibles', 'activities', 'online', 'all'].includes(kind)) {
  document.querySelectorAll('#kindfilters .chip').forEach((c) => c.classList.toggle('active', c.dataset.kind === kind));
}
if (params.get('grade')) gradeEl.value = params.get('grade');
if (params.get('spoiler') === 'on') spoilerEl.checked = true;
const openId = Number(params.get('open'));
if (Number.isInteger(openId) && openId >= 1 && openId <= 55) selected = openId;
render();
setView(params.get('view') === 'roadmap' ? 'roadmap' : 'checklist');
