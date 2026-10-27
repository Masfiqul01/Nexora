export const ADMIN_KEYS = {
  session: 'nexora_admin_session',
  orders: 'nexora-orders',
  overrides: 'nexora_product_overrides',
  transactions: 'nexora_payment_transactions',
  settings: 'nexora_store_settings'
};
export const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned', 'Refunded'];

const safeRead = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const demoPeople = [
  ['Rahim Ahmed', 'rahim@example.demo', '+880 1712-000001', 'Dhanmondi, Dhaka'],
  ['Nusrat Jahan', 'nusrat@example.demo', '+880 1812-000002', 'Banani, Dhaka'],
  ['Sabbir Hossain', 'sabbir@example.demo', '+880 1912-000003', 'Chattogram'],
  ['Mim Akter', 'mim@example.demo', '+880 1612-000004', 'Uttara, Dhaka'],
  ['Tanvir Hasan', 'tanvir@example.demo', '+880 1512-000005', 'Sylhet'],
  ['Farzana Karim', 'farzana@example.demo', '+880 1312-000006', 'Rajshahi']
];

export function getOverrides() {
  return safeRead(ADMIN_KEYS.overrides, {});
}

export function getAdminProducts(products) {
  const overrides = getOverrides();
  return products.map(product => ({
    ...product,
    stock: 24,
    lowStockThreshold: 5,
    sku: `NX-${String(product.id).padStart(3, '0')}`,
    status: 'active',
    featured: Boolean(product.tag === 'Bestseller' || product.tag === 'New'),
    ...overrides[product.id]
  }));
}

export function saveAdminProduct(product) {
  const overrides = getOverrides();
  overrides[product.id] = product;
  localStorage.setItem(ADMIN_KEYS.overrides, JSON.stringify(overrides));
  window.dispatchEvent(new Event('nexora-data-change'));
}

export function adjustProductStock(products, items, direction = -1) {
  const overrides = getOverrides();
  products.forEach(product => {
    const quantity = items.filter(item => item.id === product.id).reduce((sum, item) => sum + Number(item.qty || 0), 0);
    if (!quantity) return;
    const current = Number((overrides[product.id] || {}).stock ?? 24);
    overrides[product.id] = { ...(overrides[product.id] || {}), stock: Math.max(0, current + quantity * direction) };
  });
  localStorage.setItem(ADMIN_KEYS.overrides, JSON.stringify(overrides));
}

export function readAdminOrders() {
  const orders = safeRead(ADMIN_KEYS.orders, []);
  return Array.isArray(orders) ? orders : [];
}

export function saveAdminOrders(orders) {
  localStorage.setItem(ADMIN_KEYS.orders, JSON.stringify(orders));
  window.dispatchEvent(new Event('nexora-data-change'));
}

export function canTransitionOrder(from, to) {
  if (from === to) return true;
  if (['Cancelled', 'Refunded'].includes(from)) return false;
  if (from === 'Delivered' && ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery'].includes(to)) return false;
  return ORDER_STATUSES.includes(to);
}

export function updateOrderStatus(order, status, actor = 'Admin', note = '') {
  const current = order.orderStatus || order.status || 'Pending';
  if (!canTransitionOrder(current, status)) return order;
  const at = new Date().toISOString();
  return { ...order, status, orderStatus: status, updatedAt: at, timeline: [...(order.timeline || [{ status: current, at: order.createdAt, actor: 'System' }]), { status, at, actor, note }] };
}

export function ensureDemoOrders(products) {
  const current = localStorage.getItem(ADMIN_KEYS.orders);
  if (current) {
    const parsed = readAdminOrders();
    if (parsed.length || current === '[]') return parsed;
    localStorage.removeItem(ADMIN_KEYS.orders);
  }
  const statuses = ['Delivered', 'Processing', 'Shipped', 'Pending', 'Confirmed', 'Cancelled'];
  const payments = ['Paid', 'Paid', 'Paid', 'Pending', 'Paid', 'Failed'];
  const orders = Array.from({ length: 18 }, (_, index) => {
    const person = demoPeople[index % demoPeople.length];
    const product = products[index % products.length];
    const second = products[(index + 2) % products.length];
    const quantity = index % 3 + 1;
    const subtotal = product.price * quantity + (index % 2 ? second.price : 0);
    const createdAt = new Date(Date.UTC(2026, 9, 27 - index)).toISOString();
    const paymentStatus = payments[index % payments.length];
    return {
      id: `NX-${createdAt.slice(0, 10).replaceAll('-', '')}-${String(index + 1).padStart(3, '0')}`,
      customerId: `CUS-${String(index % demoPeople.length + 1).padStart(3, '0')}`,
      customer: { name: person[0], email: person[1], phone: person[2] },
      items: [{ ...product, qty: quantity }, ...(index % 2 ? [{ ...second, qty: 1 }] : [])],
      subtotal, shipping: subtotal > 100 ? 0 : 9, discount: 0,
      tax: subtotal * .08, total: subtotal + (subtotal > 100 ? 0 : 9) + subtotal * .08,
      paymentMethod: index % 3 === 0 ? 'Cash on Delivery' : 'SSLCommerz Demo',
      paymentStatus, transactionId: paymentStatus === 'Paid' ? `NEXORA-TXN-${String(index + 1).padStart(8, '0')}` : undefined,
      status: statuses[index % statuses.length], orderStatus: statuses[index % statuses.length],
      shippingAddress: person[3], createdAt, updatedAt: createdAt
    };
  });
  saveAdminOrders(orders);
  return orders;
}

export function createTransaction(status = 'Paid', orderId = null, amount = 0, method = 'SSLCommerz Demo') {
  const id = `NEXORA-TXN-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
  const transactions = safeRead(ADMIN_KEYS.transactions, []);
  transactions.push({ id, status, orderId, amount, method, paymentId: `PAY-${id.slice(-8)}`, createdAt: new Date().toISOString() });
  localStorage.setItem(ADMIN_KEYS.transactions, JSON.stringify(transactions));
  return id;
}

export function resetDemoData(products) {
  localStorage.removeItem(ADMIN_KEYS.orders);
  localStorage.removeItem(ADMIN_KEYS.overrides);
  localStorage.removeItem(ADMIN_KEYS.transactions);
  ['nexora_coupons', 'nexora_returns', 'nexora_reviews', 'nexora_addresses', 'nexora_notifications', 'nexora_demo_emails', 'nexora_activity_log'].forEach(key => localStorage.removeItem(key));
  ensureDemoOrders(products);
  window.dispatchEvent(new Event('nexora-data-change'));
}
