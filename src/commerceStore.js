const VERSION_KEY = 'nexora_store_version';
export const STORE_VERSION = 3;

export const COMMERCE_KEYS = {
  coupons: 'nexora_coupons',
  addresses: 'nexora_addresses',
  reviews: 'nexora_reviews',
  recentlyViewed: 'nexora_recently_viewed',
  notifications: 'nexora_notifications',
  emails: 'nexora_demo_emails',
  activity: 'nexora_activity_log',
  returns: 'nexora_returns',
  settings: 'nexora_store_settings'
};

const demoCoupons = [
  { code: 'WELCOME10', type: 'percentage', value: 10, minimum: 0, expiresAt: '2027-12-31', usageLimit: 100, usageCount: 0, active: true },
  { code: 'SAVE20', type: 'percentage', value: 20, minimum: 150, expiresAt: '2027-12-31', usageLimit: 50, usageCount: 0, active: true },
  { code: 'FREESHIP', type: 'free_shipping', value: 0, minimum: 75, expiresAt: '2027-12-31', usageLimit: 100, usageCount: 0, active: true }
];

const defaults = {
  freeShippingThreshold: 100,
  standardShipping: 9,
  expressShipping: 24,
  estimatedDeliveryDays: '3–5',
  taxRate: 8
};

export function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const value = JSON.parse(raw);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function safeWrite(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event('nexora-data-change'));
  return value;
}

export function initCommerceStore() {
  const version = Number(localStorage.getItem(VERSION_KEY) || 0);
  if (version < STORE_VERSION) {
    if (!Array.isArray(safeRead(COMMERCE_KEYS.coupons, null))) safeWrite(COMMERCE_KEYS.coupons, demoCoupons);
    if (!Array.isArray(safeRead(COMMERCE_KEYS.reviews, null))) safeWrite(COMMERCE_KEYS.reviews, []);
    if (!Array.isArray(safeRead(COMMERCE_KEYS.recentlyViewed, null))) safeWrite(COMMERCE_KEYS.recentlyViewed, []);
    if (!Array.isArray(safeRead(COMMERCE_KEYS.notifications, null))) safeWrite(COMMERCE_KEYS.notifications, []);
    if (!Array.isArray(safeRead(COMMERCE_KEYS.emails, null))) safeWrite(COMMERCE_KEYS.emails, []);
    if (!Array.isArray(safeRead(COMMERCE_KEYS.activity, null))) safeWrite(COMMERCE_KEYS.activity, []);
    if (!Array.isArray(safeRead(COMMERCE_KEYS.returns, null))) safeWrite(COMMERCE_KEYS.returns, []);
    const settings = safeRead(COMMERCE_KEYS.settings, {});
    safeWrite(COMMERCE_KEYS.settings, { ...defaults, ...(settings && typeof settings === 'object' ? settings : {}) });
    localStorage.setItem(VERSION_KEY, String(STORE_VERSION));
  }
}

export function getSettings() { return { ...defaults, ...safeRead(COMMERCE_KEYS.settings, {}) }; }
export function saveSettings(settings) { return safeWrite(COMMERCE_KEYS.settings, { ...getSettings(), ...settings }); }

export function getCoupons() {
  const coupons = safeRead(COMMERCE_KEYS.coupons, demoCoupons);
  return Array.isArray(coupons) ? coupons : demoCoupons;
}
export function saveCoupons(coupons) { return safeWrite(COMMERCE_KEYS.coupons, Array.isArray(coupons) ? coupons : []); }

export function validateCoupon(code, subtotal) {
  const coupon = getCoupons().find(item => item.code === String(code || '').trim().toUpperCase());
  if (!coupon || !coupon.active) return { valid: false, message: 'That coupon code is not valid.' };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return { valid: false, message: 'That coupon has expired.' };
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return { valid: false, message: 'That coupon has reached its usage limit.' };
  if (subtotal < Number(coupon.minimum || 0)) return { valid: false, message: `Spend $${Number(coupon.minimum).toFixed(2)} to use this coupon.` };
  const discount = coupon.type === 'percentage' ? subtotal * Number(coupon.value || 0) / 100 : coupon.type === 'fixed' ? Math.min(subtotal, Number(coupon.value || 0)) : 0;
  return { valid: true, coupon, discount, freeShipping: coupon.type === 'free_shipping', message: `${coupon.code} applied successfully.` };
}

export function recordCouponUse(code) {
  const coupons = getCoupons().map(item => item.code === code ? { ...item, usageCount: Number(item.usageCount || 0) + 1 } : item);
  saveCoupons(coupons);
}

export function calculateAnalytics(orders, returns = getReturns(), range = 'all') {
  const now = Date.now();
  const days = range === 'today' ? 1 : range === '7' ? 7 : range === '30' ? 30 : range === '90' ? 90 : null;
  const filtered = (Array.isArray(orders) ? orders : []).filter(order => !days || now - new Date(order.createdAt).getTime() <= days * 86400000);
  const valid = filtered.filter(order => !['Cancelled', 'Failed'].includes(order.status));
  const sales = valid.filter(order => ['Paid', 'Refunded'].includes(order.paymentStatus));
  const gross = sales.reduce((sum, order) => sum + Number(order.subtotal || 0), 0);
  const discounts = sales.reduce((sum, order) => sum + Number(order.discount || 0), 0);
  const shipping = sales.reduce((sum, order) => sum + Number(order.shipping || 0), 0);
  const tax = sales.reduce((sum, order) => sum + Number(order.tax || 0), 0);
  const refunds = (Array.isArray(returns) ? returns : []).filter(item => item.status === 'Refunded' && (!days || now - new Date(item.createdAt || item.updatedAt || now).getTime() <= days * 86400000)).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const units = {};
  const categories = {};
  sales.forEach(order => (order.items || []).forEach(item => {
    units[item.name] = (units[item.name] || 0) + Number(item.qty || 0);
    categories[item.category] = (categories[item.category] || 0) + Number(item.qty || 0);
  }));
  const net = gross - discounts - refunds;
  return { orders: sales.length, gross, discounts, shipping, tax, refunds, net, average: sales.length ? net / sales.length : 0, units, categories, payments: filtered.reduce((out, order) => { out[order.paymentMethod] = (out[order.paymentMethod] || 0) + 1; return out; }, {}), statuses: filtered.reduce((out, order) => { const status = order.status || order.orderStatus || 'Pending'; out[status] = (out[status] || 0) + 1; return out; }, {}) };
}

export function getAddresses() { const value = safeRead(COMMERCE_KEYS.addresses, []); return Array.isArray(value) ? value : []; }
export function saveAddresses(addresses) { return safeWrite(COMMERCE_KEYS.addresses, Array.isArray(addresses) ? addresses : []); }

export function getReviews(productId) {
  const reviews = safeRead(COMMERCE_KEYS.reviews, []);
  return (Array.isArray(reviews) ? reviews : []).filter(review => String(review.productId) === String(productId));
}
export function saveReview(review) {
  const reviews = safeRead(COMMERCE_KEYS.reviews, []);
  return safeWrite(COMMERCE_KEYS.reviews, [...(Array.isArray(reviews) ? reviews : []), { ...review, id: `review-${Date.now()}`, createdAt: new Date().toISOString(), helpful: 0, demo: true }]);
}
export function markReviewHelpful(id) {
  const reviews = safeRead(COMMERCE_KEYS.reviews, []);
  const voted = safeRead('nexora_helpful_reviews', []);
  if (Array.isArray(voted) && voted.includes(id)) return reviews;
  safeWrite('nexora_helpful_reviews', [...(Array.isArray(voted) ? voted : []), id]);
  return safeWrite(COMMERCE_KEYS.reviews, (Array.isArray(reviews) ? reviews : []).map(review => review.id === id ? { ...review, helpful: Number(review.helpful || 0) + 1 } : review));
}

export function recordRecentlyViewed(productId, max = 6) {
  const current = safeRead(COMMERCE_KEYS.recentlyViewed, []);
  const next = [productId, ...(Array.isArray(current) ? current : []).filter(id => String(id) !== String(productId))].slice(0, max);
  return safeWrite(COMMERCE_KEYS.recentlyViewed, next);
}
export function getRecentlyViewed() { const value = safeRead(COMMERCE_KEYS.recentlyViewed, []); return Array.isArray(value) ? value : []; }

export function logActivity(action, entity, details = '') {
  const current = safeRead(COMMERCE_KEYS.activity, []);
  return safeWrite(COMMERCE_KEYS.activity, [{ id: `activity-${Date.now()}`, action, entity, details, admin: 'admin@nexora.com', createdAt: new Date().toISOString() }, ...(Array.isArray(current) ? current : [])].slice(0, 200));
}
export function notify(recipient, title, message, audience = 'customer') {
  const current = safeRead(COMMERCE_KEYS.notifications, []);
  const next = [{ id: `notification-${Date.now()}`, recipient, title, message, audience, read: false, createdAt: new Date().toISOString() }, ...(Array.isArray(current) ? current : [])];
  const result = safeWrite(COMMERCE_KEYS.notifications, next);
  window.dispatchEvent(new Event('nexora-notifications-change'));
  return result;
}
export function logDemoEmail(recipient, subject, event) {
  const current = safeRead(COMMERCE_KEYS.emails, []);
  return safeWrite(COMMERCE_KEYS.emails, [{ id: `email-${Date.now()}`, recipient, subject, event, status: 'Simulated', createdAt: new Date().toISOString() }, ...(Array.isArray(current) ? current : [])]);
}

export function markNotificationsRead(audience, id = null) {
  const current = safeRead(COMMERCE_KEYS.notifications, []);
  const next = (Array.isArray(current) ? current : []).map(item => (!audience || item.audience === audience) && (!id || item.id === id) ? { ...item, read: true } : item);
  const result = safeWrite(COMMERCE_KEYS.notifications, next);
  window.dispatchEvent(new Event('nexora-notifications-change'));
  return result;
}
export function getReturns() { const value = safeRead(COMMERCE_KEYS.returns, []); return Array.isArray(value) ? value : []; }
export function saveReturns(returns) { return safeWrite(COMMERCE_KEYS.returns, Array.isArray(returns) ? returns : []); }
export function createReturnRequest(order, items, reason, note = '') {
  const request = { id: `RET-${Date.now()}`, orderId: order.id, customerId: order.customerId || order.customer?.email, customer: order.customer, items, amount: items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0), reason, note, status: 'Return Requested', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  saveReturns([...getReturns(), request]);
  notify('admin', 'Return requested', `${request.id} was requested for ${order.id}.`, 'admin');
  logDemoEmail(order.customer?.email, `Return request ${request.id}`, 'Return Requested');
  logActivity('Return requested', request.id, `Order ${order.id}`);
  return request;
}

export function transitionReturn(id, status) {
  const next = getReturns().map(item => item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item);
  saveReturns(next);
  const request = next.find(item => item.id === id);
  if (request) {
    notify(request.customerId, `Return ${status.toLowerCase()}`, `${request.id} is now ${status}.`);
    logDemoEmail(request.customer?.email, `Return update ${request.id}`, status);
    logActivity('Return status updated', id, status);
  }
  return request;
}

export function csvValue(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}
export function downloadCsv(filename, rows) {
  const list = Array.isArray(rows) ? rows : [];
  const headers = [...new Set(list.flatMap(row => Object.keys(row || {})))];
  const csv = [headers, ...list.map(row => headers.map(header => row[header]))].map(row => row.map(csvValue).join(',')).join('\r\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.remove();
  }, 0);
}

export function validateDemoData(data) {
  const required = ['nexora-orders', 'nexora_product_overrides', 'nexora_payment_transactions', COMMERCE_KEYS.coupons, COMMERCE_KEYS.returns, COMMERCE_KEYS.reviews, COMMERCE_KEYS.addresses, COMMERCE_KEYS.notifications, COMMERCE_KEYS.activity];
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { valid: false, message: 'Invalid NEXORA demo data file.' };
  if (data.nexora_store_version && Number(data.nexora_store_version) > STORE_VERSION) return { valid: false, message: 'This demo data file requires a newer NEXORA version.' };
  if (required.some(key => data[key] !== undefined && !['object', 'string'].includes(typeof data[key]))) return { valid: false, message: 'Invalid NEXORA demo data file.' };
  return { valid: true };
}

export function exportDemoData() {
  const keys = ['nexora-orders', 'nexora-cart', 'nexora-wishlist', 'nexora_product_overrides', 'nexora_payment_transactions', ...Object.values(COMMERCE_KEYS), VERSION_KEY];
  return JSON.stringify(Object.fromEntries(keys.map(key => [key, safeRead(key, localStorage.getItem(key) || null)])), null, 2);
}
export function importDemoData(text) {
  const data = JSON.parse(text);
  const validation = validateDemoData(data);
  if (!validation.valid) throw new Error(validation.message);
  Object.entries(data).forEach(([key, value]) => {
    if (typeof key !== 'string' || value === undefined) throw new Error('Demo data contains an invalid entry.');
    if (value === null) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  });
  window.dispatchEvent(new Event('nexora-data-change'));
}

initCommerceStore();
