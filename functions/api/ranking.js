// Ranking mundial de «Zombies en el set» · Cloudflare Pages Function + D1 (binding: DB)
// GET  /api/ranking          -> { all:[...10], today:[...10] }
// POST /api/ranking {n,s,k}  -> { ok:true, pos }
const H = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
const json = (o, st = 200) => new Response(JSON.stringify(o), { status: st, headers: H });
const day = () => new Date().toISOString().slice(0, 10);
const MAX_SCENE = 400;      // escena máxima creíble
const WAIT_MS = 20000;      // un récord cada 20 s por jugador

async function init(db) {
  await db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY AUTOINCREMENT, n TEXT NOT NULL, s INTEGER NOT NULL, k TEXT, day TEXT NOT NULL, t INTEGER NOT NULL, who TEXT NOT NULL)'),
    db.prepare('CREATE INDEX IF NOT EXISTS i_s ON scores (s DESC, t ASC)'),
    db.prepare('CREATE INDEX IF NOT EXISTS i_day ON scores (day, s DESC)'),
    db.prepare('CREATE INDEX IF NOT EXISTS i_who ON scores (who, t DESC)'),
  ]);
}
async function who(request) {
  const ip = request.headers.get('CF-Connecting-IP') || '0';
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('zes|' + ip));
  return [...new Uint8Array(d)].slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
}
async function tops(db) {
  const q = 'SELECT n, s, k, t FROM scores ';
  const [a, b] = await db.batch([
    db.prepare(q + 'ORDER BY s DESC, t ASC LIMIT 10'),
    db.prepare(q + 'WHERE day = ?1 ORDER BY s DESC, t ASC LIMIT 10').bind(day()),
  ]);
  return { all: a.results, today: b.results };
}

export async function onRequestGet({ env }) {
  if (!env.DB) return json({ error: 'no-db' }, 503);
  await init(env.DB);
  return json(await tops(env.DB));
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: 'no-db' }, 503);
  let b;
  try { b = await request.json(); } catch (e) { return json({ error: 'bad-json' }, 400); }
  const n = String(b && b.n || '').toUpperCase();
  const s = Number(b && b.s);
  const k = String(b && b.k || '').toLowerCase();
  if (!/^[A-Z]{3}$/.test(n)) return json({ error: 'name' }, 400);
  if (!Number.isInteger(s) || s < 1 || s > MAX_SCENE) return json({ error: 'score' }, 400);
  if (!/^[a-z_]{0,24}$/.test(k)) return json({ error: 'skin' }, 400);
  await init(env.DB);
  const w = await who(request), now = Date.now();
  const last = await env.DB.prepare('SELECT t FROM scores WHERE who = ?1 ORDER BY t DESC LIMIT 1').bind(w).first();
  if (last && now - last.t < WAIT_MS) return json({ error: 'slow-down' }, 429);
  await env.DB.prepare('INSERT INTO scores (n, s, k, day, t, who) VALUES (?1, ?2, ?3, ?4, ?5, ?6)').bind(n, s, k, day(), now, w).run();
  const r = await env.DB.prepare('SELECT COUNT(*) AS c FROM scores WHERE s > ?1').bind(s).first();
  return json({ ok: true, pos: (r ? r.c : 0) + 1, t: now, ...(await tops(env.DB)) });
}
