// Pedidos automáticos: Stripe (pago completado) -> Printful (pedido)
// POST /api/stripe-webhook   (evento de Stripe: checkout.session.completed)
//
// Variables secretas en Cloudflare Pages (Settings > Variables and Secrets):
//   STRIPE_WEBHOOK_SECRET   whsec_...   (Stripe > Desarrolladores > Webhooks)
//   PRINTFUL_TOKEN          token privado de developers.printful.com
//   PRINTFUL_STORE_ID       opcional, por defecto 19127198 (tienda "Lighting Crew Mallorca")
//   PRINTFUL_CONFIRM        opcional: "no" deja los pedidos como borrador en Printful
//
// El botón "Comprar" de la web abre el enlace de pago con
//   client_reference_id = <producto>_talla-<TALLA>   p. ej. crew-camiseta_talla-L

const PRODUCTS = {
  // referencia de la web -> nombre del producto en Printful y precio unitario (céntimos)
  'crew-camiseta': { name: 'Camiseta Lighting Crew Mallorca', unit: 2900 },
  'crew-sudadera': { name: 'Sudadera Lighting Crew Mallorca', unit: 4300 },
};
const SIZES = { S: 'S', M: 'M', L: 'L', XL: 'XL', XXL: '2XL', '2XL': '2XL', '3XL': '3XL' };
const TOLERANCE_S = 300; // firma válida durante 5 minutos

const txt = (s, st = 200) => new Response(s, { status: st, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');

async function verifyStripe(raw, header, secret) {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(header.split(',').map(p => p.split('=')).filter(p => p.length === 2).map(([k, v]) => [k, v]));
  const sigs = header.split(',').filter(p => p.startsWith('v1=')).map(p => p.slice(3));
  const t = parts.t;
  if (!t || !sigs.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > TOLERANCE_S) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(t + '.' + raw)));
  return sigs.some(s => s.length === mac.length && [...s].reduce((a, c, i) => a | (c.charCodeAt(0) ^ mac.charCodeAt(i)), 0) === 0);
}

async function pf(env, path, opts = {}) {
  const r = await fetch('https://api.printful.com' + path, {
    ...opts,
    headers: {
      Authorization: 'Bearer ' + env.PRINTFUL_TOKEN,
      'X-PF-Store-Id': String(env.PRINTFUL_STORE_ID || '19127198'),
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, j };
}

// busca la variante sincronizada "Nombre / TALLA" en la tienda de Printful
async function findVariant(env, productName, size) {
  const list = await pf(env, '/store/products?limit=100');
  if (!list.ok) throw new Error('printful-list ' + list.status + ' ' + JSON.stringify(list.j).slice(0, 200));
  const prod = (list.j.result || []).find(p => (p.name || '').trim().toLowerCase() === productName.toLowerCase());
  if (!prod) throw new Error('producto no encontrado en Printful: ' + productName);
  const det = await pf(env, '/store/products/' + prod.id);
  if (!det.ok) throw new Error('printful-product ' + det.status);
  const vars = det.j.result?.sync_variants || [];
  const want = size.toUpperCase();
  const v = vars.find(v => (v.size || '').toUpperCase() === want) ||
            vars.find(v => (v.name || '').toUpperCase().endsWith('/ ' + want));
  if (!v) throw new Error('talla ' + size + ' no encontrada en ' + productName);
  return v.id;
}

export async function onRequestPost({ request, env }) {
  const raw = await request.text();
  if (!(await verifyStripe(raw, request.headers.get('Stripe-Signature'), env.STRIPE_WEBHOOK_SECRET))) {
    return txt('firma no válida', 400);
  }
  let ev;
  try { ev = JSON.parse(raw); } catch { return txt('json no válido', 400); }
  if (ev.type !== 'checkout.session.completed' && ev.type !== 'checkout.session.async_payment_succeeded') {
    return txt('ignorado: ' + ev.type);
  }
  const s = ev.data?.object || {};
  if (s.payment_status !== 'paid') return txt('aún no pagado');

  // producto y talla desde la referencia de la web
  const m = /^([a-z0-9-]+)_talla-([A-Z0-9]+)$/i.exec(s.client_reference_id || '');
  const prod = m && PRODUCTS[m[1]];
  const size = m && SIZES[m[2].toUpperCase()];
  if (!prod || !size) {
    console.log('PEDIDO MANUAL: referencia no reconocida', s.id, s.client_reference_id);
    return txt('referencia no reconocida, pedido para hacer a mano'); // 200: Stripe no reintenta
  }
  // cantidad = importe / precio unitario (y comprueba que cuadra con el producto)
  const sub = s.amount_subtotal ?? s.amount_total;
  const qty = sub / prod.unit;
  if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
    console.log('PEDIDO MANUAL: importe no cuadra', s.id, s.client_reference_id, sub);
    return txt('importe no cuadra con el producto, pedido para hacer a mano');
  }

  const ship = s.collected_information?.shipping_details || s.shipping_details || {};
  const a = ship.address || s.customer_details?.address || {};
  const cd = s.customer_details || {};
  if (!a.line1 || !a.city || !a.postal_code) {
    console.log('PEDIDO MANUAL: falta dirección', s.id);
    return txt('falta dirección, pedido para hacer a mano');
  }

  let variantId;
  try { variantId = await findVariant(env, prod.name, size); }
  catch (e) { console.log('ERROR Printful', s.id, String(e)); return txt('error buscando producto', 500); }

  // external_id único por pago: evita pedidos duplicados si Stripe reenvía el aviso
  const extId = 'st' + hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s.id))).slice(0, 28);
  const order = {
    external_id: extId,
    shipping: 'STANDARD',
    recipient: {
      name: ship.name || cd.name || '',
      address1: a.line1,
      address2: a.line2 || '',
      city: a.city,
      state_code: ['US', 'CA', 'AU'].includes(a.country) ? a.state : undefined,
      country_code: a.country || 'ES',
      zip: a.postal_code,
      phone: cd.phone || '',
      email: cd.email || '',
    },
    items: [{ sync_variant_id: variantId, quantity: qty }],
    retail_costs: { currency: 'EUR', total: (s.amount_total / 100).toFixed(2) },
  };
  const confirm = String(env.PRINTFUL_CONFIRM || 'si').toLowerCase() !== 'no';
  const r = await pf(env, '/orders' + (confirm ? '?confirm=1' : ''), { method: 'POST', body: JSON.stringify(order) });
  if (r.ok) {
    console.log('PEDIDO OK', s.id, 'printful', r.j.result?.id, prod.name, size, 'x' + qty);
    return txt('pedido creado en Printful: ' + r.j.result?.id);
  }
  // ya existía (reenvío de Stripe): todo bien
  if (r.status === 400 && /external/i.test(JSON.stringify(r.j))) return txt('pedido ya creado');
  console.log('ERROR pedido Printful', s.id, r.status, JSON.stringify(r.j).slice(0, 500));
  return txt('error creando pedido en Printful', 502); // Stripe reintentará
}

export async function onRequestGet() {
  return txt('ok: webhook de pedidos activo');
}
