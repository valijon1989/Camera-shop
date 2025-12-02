import React, { useState } from "react";
import { Box, Button, Container, Stack } from "@mui/material";
import ProductService from "../../services/ProductService";
import { ProductCreate } from "../../services/types/product";
import { useGlobals } from "../../hooks/useGlobals";
import { MemberType } from "../../../lib/enums/member.enum";
import "../../../css/products.css";
import { useHistory } from "react-router-dom";

export default function AddProduct() {
  const { authMember } = useGlobals();
  const history = useHistory();
  const [form, setForm] = useState<ProductCreate>({
    cameraModel: "",
    brand: "",
    sensorType: "",
    resolutionMp: undefined,
    mountType: "",
    category: "mirrorless",
    price: 0,
    stock: 0,
    description: "",
    images: [],
    condition: "",
    location: "",
  });
  const [priceInput, setPriceInput] = useState<string>(""); // UI uchun, 0 ni ko'rsatmaslik
  // Keep both the actual File objects (to upload) and preview data URLs
  const [fileFiles, setFileFiles] = useState<File[]>([]);
  const [fileImages, setFileImages] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("");

  const handleSubmit = () => {
    if (!authMember || ![MemberType.ADMIN, MemberType.AGENT, MemberType.USER].includes(authMember.memberType as MemberType)) {
      setStatus("Only logged-in users (agent/admin) can add products.");
      return;
    }
    // When creating a product, prefer sending actual files if available so
    // the backend can persist them as uploads. Fall back to data URLs if any.
    const allImages = fileFiles.length > 0 ? [...fileFiles] : [...fileImages];
    if (!form.cameraModel || !form.brand || !priceInput.trim()) {
      setStatus("Please fill camera model, brand, and price.");
      return;
    }
    if (allImages.length < 3 || allImages.length > 5) {
      setStatus("Please add 3 to 5 images (uploads).");
      return;
    }
    const parsedPrice = Number(priceInput);
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setStatus("Enter a valid price greater than 0.");
      return;
    }
    const payload: ProductCreate = {
      ...form,
      price: parsedPrice,
      stock: Number(form.stock) || 0,
      images: allImages,
      condition: form.condition ? form.condition.toUpperCase() : undefined,
    };
    const service = new ProductService();
    service
      .createProduct(payload)
      .then(() => {
        setStatus("Product created. Redirecting to products...");
        setForm({
          cameraModel: "",
          brand: "",
          sensorType: "",
          resolutionMp: undefined,
          mountType: "",
          category: "mirrorless",
          price: 0,
          stock: 0,
          description: "",
          images: [],
          condition: "",
          location: "",
        });
        setPriceInput("");
        setFileImages([]);
        setTimeout(() => history.push("/cameras"), 800);
      })
      .catch(() => setStatus("Failed to create product. Please check required fields or auth."));
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const valid = Array.from(files).filter((f) =>
      ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(f.type)
    );
    const remaining = 5 - fileFiles.length;
    if (remaining <= 0) {
      setStatus("Max 5 images allowed.");
      return;
    }
    const slice = valid.slice(0, remaining);
    try {
      // Add the file objects to state, and also generate data URL previews
      const previews = await Promise.all(
      slice.map((file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
      )
    );
      setFileFiles((prev) => [...prev, ...slice]);
      setFileImages((prev) => [...prev, ...previews]);
      setStatus("");
    } catch (err) {
      console.error("Failed to generate previews:", err);
      setStatus("Failed to read image files");
    }
  };

  if (!authMember) {
    return (
      <div className="add-product-page">
        <Container>
          <Box className="add-product-title">Add Product</Box>
          <Box sx={{ mt: 2 }}>Please log in as agent/admin to add products.</Box>
        </Container>
      </div>
    );
  }

  return (
    <div className="add-product-page">
      <Container>
        <Stack spacing={2} className="add-product-form">
          <Box className="add-product-title">Add Product</Box>
          <Box className="add-helper">
            Fill required fields: model, brand/collection, price. Upload 3-5 images (jpg/png/webp).
          </Box>
          <Stack direction="row" spacing={2}>
            <div className="add-field">
              <label>Camera model*</label>
              <input
                className="add-input"
                placeholder="Sony A7 IV"
                value={form.cameraModel}
                onChange={(e) => setForm({ ...form, cameraModel: e.target.value })}
              />
            </div>
            <div className="add-field">
              <label>Brand*</label>
              <input
                className="add-input"
                placeholder="Sony"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              />
            </div>
          </Stack>
        <Stack direction="row" spacing={2}>
          <div className="add-field">
            <label>Price (USD)*</label>
            <input
              className="add-input"
              type="number"
              placeholder="0"
              value={priceInput}
              onChange={(e) => {
                const val = e.target.value;
                setPriceInput(val);
                setForm({ ...form, price: Number(val) || 0 });
              }}
            />
          </div>
        </Stack>
          <div className="add-field">
            <label>Description</label>
            <textarea
              className="add-textarea"
              placeholder="Hybrid 4K60, IBIS, 33MP stills..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="add-field">
            <label>Upload images* (jpg/png/webp, 3 to 5)</label>
            <input
              className="add-input"
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
            />
            <small className="add-hint">Add at least 3 images, max 5. If more than 5 are selected, extras are ignored.</small>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {fileImages.map((img, idx) => (
                <Stack key={idx} direction="row" spacing={1} alignItems="center">
                  <img src={img} alt={`upload-${idx}`} className="add-thumb" />
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      // remove both file preview and actual File
                      setFileImages((prev) => prev.filter((_, i) => i !== idx));
                      setFileFiles((prev) => prev.filter((_, i) => i !== idx));
                    }}
                  >
                    Remove
                  </Button>
                </Stack>
              ))}
            </Stack>
          </div>
          <Stack direction="row" spacing={2}>
            <div className="add-field">
              <label>Sensor type</label>
              <input
                className="add-input"
                placeholder="Full-frame"
                value={form.sensorType || ""}
                onChange={(e) => setForm({ ...form, sensorType: e.target.value })}
              />
            </div>
            <div className="add-field">
              <label>Resolution (MP)</label>
              <input
                className="add-input"
                type="number"
                placeholder="33"
                value={form.resolutionMp || ""}
                onChange={(e) => setForm({ ...form, resolutionMp: Number(e.target.value) })}
              />
            </div>
          </Stack>
          <Stack direction="row" spacing={2}>
            <div className="add-field">
              <label>Mount type</label>
              <input
                className="add-input"
                placeholder="Sony E-mount"
                value={form.mountType || ""}
                onChange={(e) => setForm({ ...form, mountType: e.target.value })}
              />
            </div>
            <div className="add-field">
              <label>Category</label>
              <select
                className="add-input"
                value={form.category || ""}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Select category</option>
                <option value="mirrorless">Mirrorless</option>
                <option value="dslr">DSLR</option>
                <option value="lens">Lens</option>
                <option value="drone">Drone</option>
                <option value="accessory">Accessory</option>
              </select>
            </div>
          </Stack>
          <Stack direction="row" spacing={2}>
            <div className="add-field">
              <label>Condition</label>
              <select
                className="add-input"
                value={form.condition || ""}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
              >
                <option value="">Select condition</option>
                <option value="NEW">New</option>
                <option value="USED">Used</option>
              </select>
            </div>
            <div className="add-field">
              <label>Location</label>
              <input
                className="add-input"
                placeholder="Seoul, Korea"
                value={form.location || ""}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </Stack>
          <Button variant="contained" onClick={handleSubmit} className="add-button">
            Add
          </Button>
          {status && <Box className="add-status">{status}</Box>}
        </Stack>
      </Container>
    </div>
  );
}
