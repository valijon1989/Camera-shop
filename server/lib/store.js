const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const MEMBERS_FILE = path.join(DATA_DIR, 'members.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function ensureJsonFile(filePath, fallback = []) {
  ensureDataDir();
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf8');
  }
}

function readJsonFile(filePath, fallback = []) {
  ensureJsonFile(filePath, fallback);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw || '[]');
    if (
      Array.isArray(parsed) &&
      parsed.length === 0 &&
      Array.isArray(fallback) &&
      fallback.length > 0
    ) {
      writeJsonFile(filePath, fallback);
      return fallback;
    }
    return parsed;
  } catch (err) {
    console.error(`readJsonFile error for ${path.basename(filePath)}`, err);
    return Array.isArray(fallback) ? fallback : [];
  }
}

function writeJsonFile(filePath, value) {
  ensureJsonFile(filePath);
  try {
    fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
  } catch (err) {
    console.error(`writeJsonFile error for ${path.basename(filePath)}`, err);
  }
}

module.exports = {
  getProducts() {
    return readJsonFile(PRODUCTS_FILE, []);
  },

  getProductById(id) {
    const p = readJsonFile(PRODUCTS_FILE, []);
    return p.find((x) => x._id === id);
  },

  addProduct(obj) {
    const products = readJsonFile(PRODUCTS_FILE, []);
    products.push(obj);
    writeJsonFile(PRODUCTS_FILE, products);
    return obj;
  },

  replaceAll(list) {
    writeJsonFile(PRODUCTS_FILE, list || []);
  },

  getMembers(seed = []) {
    return readJsonFile(MEMBERS_FILE, seed);
  },

  getMemberById(id, seed = []) {
    const members = readJsonFile(MEMBERS_FILE, seed);
    return members.find((member) => member._id === id);
  },

  getMemberByNick(memberNick, seed = []) {
    const normalized = String(memberNick || '').trim().toLowerCase();
    const members = readJsonFile(MEMBERS_FILE, seed);
    return members.find(
      (member) => String(member.memberNick || '').trim().toLowerCase() === normalized
    );
  },

  addMember(member, seed = []) {
    const members = readJsonFile(MEMBERS_FILE, seed);
    members.push(member);
    writeJsonFile(MEMBERS_FILE, members);
    return member;
  },

  updateMember(memberId, updater, seed = []) {
    const members = readJsonFile(MEMBERS_FILE, seed);
    const index = members.findIndex((member) => member._id === memberId);
    if (index === -1) return null;
    const current = members[index];
    const nextValue =
      typeof updater === 'function' ? updater(current) : { ...current, ...updater };
    members[index] = nextValue;
    writeJsonFile(MEMBERS_FILE, members);
    return nextValue;
  },

  getOrders(seed = []) {
    return readJsonFile(ORDERS_FILE, seed);
  },

  getOrderById(orderId, seed = []) {
    const orders = readJsonFile(ORDERS_FILE, seed);
    return orders.find((order) => order._id === orderId);
  },

  addOrder(order, seed = []) {
    const orders = readJsonFile(ORDERS_FILE, seed);
    orders.push(order);
    writeJsonFile(ORDERS_FILE, orders);
    return order;
  },

  updateOrder(orderId, updater, seed = []) {
    const orders = readJsonFile(ORDERS_FILE, seed);
    const index = orders.findIndex((order) => order._id === orderId);
    if (index === -1) return null;
    const current = orders[index];
    const nextValue =
      typeof updater === 'function' ? updater(current) : { ...current, ...updater };
    orders[index] = nextValue;
    writeJsonFile(ORDERS_FILE, orders);
    return nextValue;
  }
};
