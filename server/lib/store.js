const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function ensureProductsFile() {
  ensureDataDir();
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([]), 'utf8');
  }
}

function readProducts() {
  ensureProductsFile();
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('readProducts error', err);
    return [];
  }
}

function writeProducts(arr) {
  ensureProductsFile();
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(arr, null, 2), 'utf8');
  } catch (err) {
    console.error('writeProducts error', err);
  }
}

module.exports = {
  getProducts() {
    return readProducts();
  },

  getProductById(id) {
    const p = readProducts();
    return p.find((x) => x._id === id);
  },

  addProduct(obj) {
    const products = readProducts();
    products.push(obj);
    writeProducts(products);
    return obj;
  },

  replaceAll(list) {
    writeProducts(list || []);
  }
};
