const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 9090;
const API_PREFIX = '/api';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Ensure uploads dir exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Multer storage (unique filename)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '';
    cb(null, `${Date.now()}-${uuidv4()}${ext}`);
  }
});
const upload = multer({ storage });

const store = require('./lib/store');

// Serve uploads statically
app.use('/uploads', express.static(UPLOADS_DIR));

// GET /api/cameras - list
app.get(`${API_PREFIX}/cameras`, (req, res) => {
  const products = store.getProducts();
  return res.json(products);
});

// GET /api/cameras/:id
app.get(`${API_PREFIX}/cameras/:id`, (req, res) => {
  const p = store.getProductById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json(p);
});

// POST /api/cameras - create; supports multipart/form-data with files or JSON body with image paths
app.post(`${API_PREFIX}/cameras`, upload.array('images', 5), (req, res) => {
  try {
    const files = req.files || [];
    // Build images array: files -> uploads/<filename>. If JSON body had images (strings), use them too.
    const receivedAsFiles = Array.isArray(files) && files.length > 0;

    let images = [];
    if (receivedAsFiles) {
      images = files.map((f) => `uploads/${path.basename(f.path)}`);
    } else if (req.body.images) {
      // If body.images is JSON stringified array (when sending JSON), try parse or accept array
      if (typeof req.body.images === 'string') {
        try { images = JSON.parse(req.body.images); } catch (e) { images = [req.body.images]; }
      } else if (Array.isArray(req.body.images)) images = req.body.images;
    }

    // Accept other fields
    const product = {
      _id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      cameraModel: req.body.cameraModel || req.body.camera || 'Unknown Model',
      brand: req.body.brand || 'Unknown',
      category: req.body.category || 'mirrorless',
      price: Number(req.body.price) || 0,
      stock: Number(req.body.stock) || 0,
      description: req.body.description || '',
      images: images,
      createdAt: new Date().toISOString(),
    };

      // persist
      store.addProduct(product);
      return res.status(201).json({ data: product });
  } catch (err) {
    console.error('create camera error', err);
    return res.status(500).json({ error: String(err) });
  }
});

// small helper to pre-seed demo products
app.post(`${API_PREFIX}/seed-demo`, (req, res) => {
  const demo = [
    {
      _id: 'demo-1',
      cameraModel: 'Sony A7 IV',
      brand: 'Sony',
      price: 2500,
      images: ['uploads/demo-sony.jpg'],
      stock: 5,
    },
    {
      _id: 'demo-2',
      cameraModel: 'Canon R50',
      brand: 'Canon',
      price: 700,
      images: ['uploads/demo-canon.jpg'],
      stock: 10,
    }
  ];
  store.replaceAll(demo);
  return res.json({ ok: true, count: demo.length });
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}${API_PREFIX}`));
