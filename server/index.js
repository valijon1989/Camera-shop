const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PORT = Number(process.env.PORT) || 9091;
const API_PREFIX = '/api';
const HELP_LOG_FILE = path.join(__dirname, 'server.log');
const AUTH_COOKIE_NAME = 'accessToken';
const AUTH_COOKIE_OPTIONS = {
  httpOnly: false,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

const BRAND_ASSETS = {
  Sony: {
    logo: '/brands/sony.png',
    banner: '/brands/sony-banner.jpg',
    description:
      'Sony mirrorless bodies tuned for hybrid photo and video workflows.',
  },
  Canon: {
    logo: '/brands/canon.png',
    banner: '/brands/canon-banner.jpg',
    description:
      'Canon cameras with RF and DSLR coverage for creators at every level.',
  },
  Nikon: {
    logo: '/brands/nikon.png',
    banner: '/brands/nikon-banner.jpg',
    description:
      'Nikon bodies and lenses with strong optics and flagship performance.',
  },
  Fujifilm: {
    logo: '/brands/fuji.png',
    banner: '/brands/fuji-banner.jpg',
    description:
      'Fujifilm mirrorless cameras with distinct color science and compact designs.',
  },
  Panasonic: {
    logo: '/brands/panasonic.png',
    banner: '/brands/panasonic-banner.jpg',
    description:
      'Panasonic Lumix gear focused on hybrid shooters and video creators.',
  },
};

const DEMO_MEMBERS = [
  {
    _id: 'member-admin',
    memberType: 'ADMIN',
    memberStatus: 'ACTIVE',
    memberNick: 'Camera Shop Admin',
    memberPassword: 'admin123',
    memberPhone: '+82 10 1234 9091',
    memberAddress: 'Seoul, South Korea',
    memberDesc: 'Platform curator for featured listings and trusted sellers.',
    memberImage: '/img/banner.webp',
    memberPoints: 980,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-12-01T00:00:00.000Z',
  },
  {
    _id: 'member-agent-1',
    memberType: 'AGENT',
    memberStatus: 'ACTIVE',
    memberNick: 'Minji Lens Lab',
    memberPassword: 'agent123',
    memberPhone: '+82 10 2400 1133',
    memberAddress: 'Busan, South Korea',
    memberDesc: 'Mirrorless and cinema camera specialist.',
    memberImage: '/img/banner.webp',
    memberPoints: 840,
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-12-01T00:00:00.000Z',
  },
  {
    _id: 'member-agent-2',
    memberType: 'AGENT',
    memberStatus: 'ACTIVE',
    memberNick: 'Daehan Optics',
    memberPassword: 'agent123',
    memberPhone: '+82 10 7722 5500',
    memberAddress: 'Incheon, South Korea',
    memberDesc: 'Full-frame bodies, lenses, and creator rigs.',
    memberImage: '/img/banner.webp',
    memberPoints: 815,
    createdAt: '2025-03-01T00:00:00.000Z',
    updatedAt: '2025-12-01T00:00:00.000Z',
  },
];

store.getMembers(DEMO_MEMBERS);
store.getOrders([]);

function normalizeString(value) {
  return String(value || '').trim().toLowerCase();
}

function toSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toFiniteNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const separatorIndex = part.indexOf('=');
      if (separatorIndex === -1) return acc;
      const key = part.slice(0, separatorIndex).trim();
      const value = decodeURIComponent(part.slice(separatorIndex + 1).trim());
      acc[key] = value;
      return acc;
    }, {});
}

function sanitizeMember(member) {
  if (!member) return null;
  const { memberPassword, ...safeMember } = member;
  return safeMember;
}

function getAllMembers() {
  return store.getMembers(DEMO_MEMBERS);
}

function getAdminMember() {
  const members = getAllMembers();
  return members.find((member) => member.memberType === 'ADMIN') || members[0] || null;
}

function getAuthenticatedMember(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  const memberId = cookies[AUTH_COOKIE_NAME];
  if (!memberId) return null;
  return store.getMemberById(memberId, DEMO_MEMBERS) || null;
}

function requireAuthMember(req, res) {
  const member = getAuthenticatedMember(req);
  if (!member) {
    res.status(401).json({ message: 'Please login first!' });
    return null;
  }
  return member;
}

function setAuthCookie(res, memberId) {
  res.cookie(AUTH_COOKIE_NAME, memberId, AUTH_COOKIE_OPTIONS);
}

function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME, { path: '/' });
}

function enrichOrder(order) {
  if (!order) return null;
  const products = store.getProducts();
  const productMap = new Map(products.map((product) => [product._id, product]));
  const productData =
    Array.isArray(order.productData) && order.productData.length > 0
      ? order.productData
      : (order.orderItems || [])
          .map((item) => productMap.get(item.productId))
          .filter(Boolean);

  return {
    ...order,
    productData,
    prductData: productData,
  };
}

function paginateCollection(list, query) {
  const page = Math.max(toFiniteNumber(query.page) || 1, 1);
  const limit = Math.max(toFiniteNumber(query.limit) || list.length || 1, 1);
  const startIndex = (page - 1) * limit;
  return list.slice(startIndex, startIndex + limit);
}

function applyProductFilters(products, query) {
  let list = Array.isArray(products) ? [...products] : [];
  const search = normalizeString(query.search);
  const brand = normalizeString(query.brand);
  const category = normalizeString(query.category);
  const sensorType = normalizeString(query.sensorType);
  const mountType = normalizeString(query.mountType);
  const videoResolution = normalizeString(query.videoResolution);
  const isoRange = normalizeString(query.isoRange);
  const stabilization = normalizeString(query.stabilization);
  const resolutionMp = toFiniteNumber(query.resolutionMp);
  const minPrice = toFiniteNumber(query.minPrice);
  const maxPrice = toFiniteNumber(query.maxPrice);

  if (search) {
    list = list.filter((product) => {
      const haystack = [
        product.cameraModel,
        product.brand,
        product.description,
        product.category,
        product.location,
      ]
        .map(normalizeString)
        .join(' ');
      return haystack.includes(search);
    });
  }

  if (brand) {
    list = list.filter((product) => normalizeString(product.brand) === brand);
  }
  if (category) {
    list = list.filter((product) => normalizeString(product.category) === category);
  }
  if (sensorType) {
    list = list.filter(
      (product) => normalizeString(product.sensorType) === sensorType
    );
  }
  if (mountType) {
    list = list.filter((product) => normalizeString(product.mountType) === mountType);
  }
  if (videoResolution) {
    list = list.filter(
      (product) => normalizeString(product.videoResolution) === videoResolution
    );
  }
  if (isoRange) {
    list = list.filter((product) => normalizeString(product.isoRange) === isoRange);
  }
  if (stabilization) {
    list = list.filter(
      (product) => normalizeString(product.stabilization) === stabilization
    );
  }
  if (resolutionMp !== undefined) {
    list = list.filter(
      (product) => Number(product.resolutionMp) === resolutionMp
    );
  }
  if (minPrice !== undefined) {
    list = list.filter((product) => Number(product.price) >= minPrice);
  }
  if (maxPrice !== undefined) {
    list = list.filter((product) => Number(product.price) <= maxPrice);
  }

  const order = normalizeString(query.order);
  list.sort((left, right) => {
    if (order === 'price') {
      return Number(left.price || 0) - Number(right.price || 0);
    }
    if (order === 'views') {
      return Number(right.views || 0) - Number(left.views || 0);
    }

    const rightDate = new Date(right.createdAt || 0).getTime();
    const leftDate = new Date(left.createdAt || 0).getTime();
    return rightDate - leftDate;
  });

  const page = Math.max(toFiniteNumber(query.page) || 1, 1);
  const limit = Math.max(toFiniteNumber(query.limit) || list.length || 1, 1);
  const total = list.length;
  const startIndex = (page - 1) * limit;
  const items = list.slice(startIndex, startIndex + limit);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
  };
}

function getBrandPayload(products) {
  const productBrands = (Array.isArray(products) ? products : [])
    .map((product) => String(product.brand || '').trim())
    .filter(Boolean);
  const uniqueBrandNames = [...new Set([...Object.keys(BRAND_ASSETS), ...productBrands])];

  return uniqueBrandNames.map((name) => {
    const asset = BRAND_ASSETS[name] || {};
    return {
      name,
      slug: toSlug(name),
      logo: asset.logo || `/brands/${toSlug(name)}.png`,
      banner: asset.banner || '/img/all-camera-banner.svg',
      description:
        asset.description || `${name} cameras and accessories available in the catalog.`,
    };
  });
}

// Serve uploads statically
app.use('/uploads', express.static(UPLOADS_DIR));

app.get(`${API_PREFIX}/health`, (req, res) => {
  res.json({ ok: true, api: API_PREFIX, port: PORT });
});

// GET /api/cameras - list
app.get(`${API_PREFIX}/cameras`, (req, res) => {
  const products = store.getProducts();
  const result = applyProductFilters(products, req.query || {});
  return res.json({ data: result.items, meta: result.meta });
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
      sensorType: req.body.sensorType || '',
      resolutionMp: Number(req.body.resolutionMp) || undefined,
      mountType: req.body.mountType || '',
      videoResolution: req.body.videoResolution || '',
      isoRange: req.body.isoRange || '',
      stabilization: req.body.stabilization || '',
      price: Number(req.body.price) || 0,
      stock: Number(req.body.stock) || 0,
      description: req.body.description || '',
      condition: req.body.condition || '',
      location: req.body.location || '',
      images: images,
      views: Number(req.body.views) || 0,
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
      category: 'mirrorless',
      price: 2500,
      images: ['/img/sony-camera-product.jpg'],
      stock: 5,
      description: '33MP full-frame hybrid camera with strong autofocus and 4K video.',
      views: 284,
      createdAt: '2025-12-02T00:00:00.000Z',
    },
    {
      _id: 'demo-2',
      cameraModel: 'Canon R50',
      brand: 'Canon',
      category: 'mirrorless',
      price: 700,
      images: ['/img/canon-camera-product.jpg'],
      stock: 10,
      description: 'Compact APS-C mirrorless camera for everyday creators and new shooters.',
      views: 173,
      createdAt: '2025-12-02T00:00:00.000Z',
    },
    {
      _id: 'demo-3',
      cameraModel: 'Nikon Z9',
      brand: 'Nikon',
      category: 'dslr',
      price: 5499,
      images: ['/img/nikon-z9-product.jpg'],
      stock: 3,
      description: 'Flagship body with rugged build and pro-level autofocus for sports and wildlife.',
      views: 331,
      createdAt: '2025-12-04T00:00:00.000Z',
    },
    {
      _id: 'demo-4',
      cameraModel: 'Lumix 24-70 Pro',
      brand: 'Panasonic',
      category: 'lens',
      price: 1299,
      images: ['/img/panasonic-lumix-product.jpg'],
      stock: 6,
      description: 'Fast standard zoom lens built for hybrid creators and everyday professional work.',
      views: 142,
      createdAt: '2025-12-05T00:00:00.000Z',
    },
    {
      _id: 'demo-5',
      cameraModel: 'Mavic 3 Pro',
      brand: 'DJI',
      category: 'drone',
      price: 2199,
      images: ['/img/dji-mavic3pro.jpg'],
      stock: 4,
      description: 'Triple-camera drone system for cinematic aerial footage and commercial shoots.',
      views: 198,
      createdAt: '2025-12-06T00:00:00.000Z',
    },
    {
      _id: 'demo-6',
      cameraModel: 'Creator Rig Kit',
      brand: 'Sony',
      category: 'accessory',
      price: 349,
      images: ['/img/camera-deal.svg'],
      stock: 11,
      description: 'Accessory bundle with cage, handle, audio mount and quick-release support.',
      views: 89,
      createdAt: '2025-12-07T00:00:00.000Z',
    }
  ];
  store.replaceAll(demo);
  return res.json({ ok: true, count: demo.length });
});

app.get(`${API_PREFIX}/brands`, (req, res) => {
  const products = store.getProducts();
  const brands = getBrandPayload(products);
  return res.json({ data: brands });
});

app.get(`${API_PREFIX}/member/top-users`, (req, res) => {
  const topUsers = getAllMembers()
    .filter((member) => member.memberType !== 'ADMIN')
    .map(sanitizeMember);
  return res.json({ data: topUsers });
});

app.get(`${API_PREFIX}/member/admin`, (req, res) => {
  return res.json(sanitizeMember(getAdminMember()));
});

app.get(`${API_PREFIX}/member/restaurant`, (req, res) => {
  return res.json(sanitizeMember(getAdminMember()));
});

app.get(`${API_PREFIX}/member/detail`, (req, res) => {
  const member = getAuthenticatedMember(req);
  if (!member) {
    clearAuthCookie(res);
    return res.json(null);
  }
  return res.json(sanitizeMember(member));
});

app.post(`${API_PREFIX}/member/signup`, (req, res) => {
  const { memberNick, memberPhone, memberPassword } = req.body || {};
  if (!memberNick || !memberPhone || !memberPassword) {
    return res.status(400).json({ message: 'Please fullfill all inputs!' });
  }

  const existingMember = store.getMemberByNick(memberNick, DEMO_MEMBERS);
  if (existingMember) {
    return res.status(409).json({ message: 'Username already exists!' });
  }

  const now = new Date().toISOString();
  const member = {
    _id: `member-${uuidv4()}`,
    memberType: 'USER',
    memberStatus: 'ACTIVE',
    memberNick: String(memberNick).trim(),
    memberPhone: String(memberPhone).trim(),
    memberPassword: String(memberPassword),
    memberAddress: '',
    memberDesc: '',
    memberImage: '/icons/default-user.svg',
    memberPoints: 0,
    createdAt: now,
    updatedAt: now,
  };

  store.addMember(member, DEMO_MEMBERS);
  setAuthCookie(res, member._id);
  return res.status(201).json({ member: sanitizeMember(member) });
});

app.post(`${API_PREFIX}/member/login`, (req, res) => {
  const { memberNick, memberPassword } = req.body || {};
  if (!memberNick || !memberPassword) {
    return res.status(400).json({ message: 'Please fullfill all inputs!' });
  }

  const member = store.getMemberByNick(memberNick, DEMO_MEMBERS);
  if (!member || member.memberPassword !== memberPassword) {
    return res.status(401).json({ message: 'Invalid username or password!' });
  }

  setAuthCookie(res, member._id);
  return res.json({ member: sanitizeMember(member) });
});

app.post(`${API_PREFIX}/member/logout`, (req, res) => {
  clearAuthCookie(res);
  return res.json({ ok: true });
});

app.post(`${API_PREFIX}/member/update`, upload.single('memberImage'), (req, res) => {
  const authMember = requireAuthMember(req, res);
  if (!authMember) return;

  const updatedMember = store.updateMember(
    authMember._id,
    (current) => {
      const nextMember = { ...current, updatedAt: new Date().toISOString() };

      if (req.body.memberNick) nextMember.memberNick = String(req.body.memberNick).trim();
      if (req.body.memberPhone) nextMember.memberPhone = String(req.body.memberPhone).trim();
      if (req.body.memberAddress) nextMember.memberAddress = String(req.body.memberAddress).trim();
      if (req.body.memberDesc) nextMember.memberDesc = String(req.body.memberDesc).trim();
      if (req.file) {
        nextMember.memberImage = `uploads/${path.basename(req.file.path)}`;
      } else if (req.body.memberImage && String(req.body.memberImage).trim()) {
        nextMember.memberImage = String(req.body.memberImage).trim();
      }

      return nextMember;
    },
    DEMO_MEMBERS
  );

  return res.json(sanitizeMember(updatedMember));
});

app.post(`${API_PREFIX}/order/create`, (req, res) => {
  const authMember = requireAuthMember(req, res);
  if (!authMember) return;

  const inputItems = Array.isArray(req.body) ? req.body : [];
  if (inputItems.length === 0) {
    return res.status(400).json({ message: 'Basket is empty!' });
  }

  const productMap = new Map(
    store.getProducts().map((product) => [product._id, product])
  );
  const orderId = `order-${uuidv4()}`;
  const now = new Date().toISOString();
  const orderItems = [];
  const productData = [];
  let subtotal = 0;

  for (const item of inputItems) {
    const product = productMap.get(item.productId);
    if (!product) {
      return res.status(404).json({ message: `Product not found: ${item.productId}` });
    }

    const itemQuantity = Math.max(Number(item.itemQuantity) || 1, 1);
    const itemPrice = Number(item.itemPrice) || Number(product.price) || 0;
    subtotal += itemQuantity * itemPrice;

    orderItems.push({
      _id: `order-item-${uuidv4()}`,
      itemQuantity,
      itemPrice,
      orderId,
      productId: product._id,
      createdAt: now,
      updatedAt: now,
    });

    if (!productData.find((entry) => entry._id === product._id)) {
      productData.push(product);
    }
  }

  const orderDelivery = subtotal < 100 ? 5 : 0;
  const order = {
    _id: orderId,
    orderTotal: subtotal + orderDelivery,
    orderDelivery,
    orderStatus: 'PAUSE',
    memberId: authMember._id,
    createdAt: now,
    updatedAt: now,
    orderItems,
    productData,
    prductData: productData,
  };

  store.addOrder(order, []);
  return res.status(201).json(enrichOrder(order));
});

app.get(`${API_PREFIX}/order/all`, (req, res) => {
  const authMember = requireAuthMember(req, res);
  if (!authMember) return;

  const requestedStatus = normalizeString(req.query.orderStatus);
  const filteredOrders = store
    .getOrders([])
    .filter((order) => order.memberId === authMember._id)
    .filter((order) =>
      requestedStatus ? normalizeString(order.orderStatus) === requestedStatus : true
    )
    .sort(
      (left, right) =>
        new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime()
    );

  const pagedOrders = paginateCollection(filteredOrders, req.query || {}).map(enrichOrder);
  return res.json(pagedOrders);
});

app.post(`${API_PREFIX}/order/update`, (req, res) => {
  const authMember = requireAuthMember(req, res);
  if (!authMember) return;

  const { orderId, orderStatus } = req.body || {};
  if (!orderId || !orderStatus) {
    return res.status(400).json({ message: 'Order id and status are required!' });
  }

  const existingOrder = store.getOrderById(orderId, []);
  if (!existingOrder) {
    return res.status(404).json({ message: 'Order not found!' });
  }

  if (
    existingOrder.memberId !== authMember._id &&
    authMember.memberType !== 'ADMIN'
  ) {
    return res.status(403).json({ message: 'You cannot modify this order!' });
  }

  const updatedOrder = store.updateOrder(orderId, {
    orderStatus: String(orderStatus).trim().toUpperCase(),
    updatedAt: new Date().toISOString(),
  });

  return res.json(enrichOrder(updatedOrder));
});

app.post(`${API_PREFIX}/help`, (req, res) => {
  const entry = {
    createdAt: new Date().toISOString(),
    payload: req.body || {},
  };
  fs.appendFileSync(HELP_LOG_FILE, `${JSON.stringify(entry)}\n`, 'utf8');
  return res.status(201).json({ ok: true });
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}${API_PREFIX}`));
