# Local demo backend for burak-camera-shop

This is a tiny demo backend you can run locally to test uploading files and static serving.

How it works
- Runs an Express server at port 9091 by default. API lives under `/api`.
- POST `/api/cameras` accepts `multipart/form-data` with up to 5 images under field `images` and other camera fields.
- Uploaded files are stored in `server/uploads` and served at `/uploads/<filename>`.
- GET `/api/cameras` returns a list of created products persisted to disk in `server/data/products.json`.

Quick start

```bash
cd server
npm install
npm run start
```

Upload example with curl (multipart):

```bash
curl -X POST 'http://localhost:9091/api/cameras' \
  -F 'cameraModel=TestCam' \
  -F 'brand=DemoBrand' \
  -F 'price=123' \
  -F 'images=@/path/to/image1.jpg' \
  -F 'images=@/path/to/image2.png'
```

A simple GET to seed demo data:

```bash
curl -X POST 'http://localhost:9091/api/seed-demo'
curl 'http://localhost:9091/api/cameras'
```

Notes
- This demo now persists product data on-disk at `server/data/products.json`.
- Uploaded images are stored under `server/uploads` and will persist between server restarts as long as that directory isn't cleared.
- For production, consider using a proper DB and object storage (S3/Cloud Storage) for durability and scalability.
