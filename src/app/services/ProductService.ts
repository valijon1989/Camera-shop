import { Product, ProductCreate, ProductInquiry } from "./types/product";
import axios from "../../api/axios";
class ProductService {
    // --- IGNORE ---
     private readonly path: string;   

     constructor() {
        this.path = ""; // axios baseURL handles host (/api)
     }

     public async getProducts(input: ProductInquiry): Promise<Product[]> {
        try {
            const params = new URLSearchParams();
            if (input.order) params.append("order", input.order);
            if (input.page) params.append("page", String(input.page));
            if (input.limit) params.append("limit", String(input.limit));
            if (input.search) params.append("search", input.search);
            if (input.category) params.append("category", input.category);
            if (input.brand) params.append("brand", input.brand);
            if (input.minPrice !== undefined) params.append("minPrice", String(input.minPrice));
            if (input.maxPrice !== undefined) params.append("maxPrice", String(input.maxPrice));
            if (input.sensorType) params.append("sensorType", input.sensorType);
            if (input.resolutionMp !== undefined) params.append("resolutionMp", String(input.resolutionMp));
            if (input.mountType) params.append("mountType", input.mountType);
            if (input.videoResolution) params.append("videoResolution", input.videoResolution);
            if (input.isoRange) params.append("isoRange", input.isoRange);
            if (input.stabilization) params.append("stabilization", input.stabilization);
            const url = `${this.path}cameras?${params.toString()}`;

            const result = await axios.get(url);
            const data: any = result.data;

            // Backend turlicha struktura qaytarsa ham listni olish uchun kengaytirilgan tekshiruv
            const payload =
              (Array.isArray(data) && data) ||
              (Array.isArray(data?.data) && data.data) ||
              (Array.isArray(data?.products) && data.products) ||
              (Array.isArray(data?.cameras) && data.cameras) ||
              (Array.isArray(data?.items) && data.items) ||
              [];
            return payload;
        } catch (err) {
            throw err;
        }
     }

     public async getProduct(productId: string): Promise<Product> {
        try {
            const url = `${this.path}cameras/${productId}`;
            const result = await axios.get(url, {withCredentials: true});

            const data: any = result.data;
            const payload = data?.data ?? data?.product ?? data;
            return payload;
        } catch (err) {
            throw err;
        }
     }

    public async createProduct(input: ProductCreate): Promise<Product> {
       try {
           const url = `${this.path}cameras`;

           // If images contain File objects, send as multipart/form-data so
           // a typical Express/Multer backend can handle file uploads. When
           // images are strings (data URLs or server-side paths) we just send
           // JSON as before.
           const hasFiles = Array.isArray(input.images) && input.images.some(i => typeof i !== "string");

           if (hasFiles) {
               const form = new FormData();
               // Append all standard text fields
               const entries: any = { ...input };
               // images will be appended separately
               delete entries.images;
               Object.keys(entries).forEach((k) => {
                   const val = (entries as any)[k];
                   if (val !== undefined && val !== null) form.append(k, String(val));
               });

               (input.images as any[]).forEach((file: any, idx: number) => {
                   // If it's a File object (browser), append directly.
                   // If it's a blob-like or stream, axios still handles it.
                   form.append("images", file, (file && file.name) || `image-${idx}`);
               });

               const result = await axios.post(url, form, {
                   withCredentials: true,
                   headers: { "Content-Type": "multipart/form-data" },
               });
               return (result.data as any)?.data ?? result.data;
           }

           const result = await axios.post(url, input, { withCredentials: true });
           return (result.data as any)?.data ?? result.data;
       } catch (err) {
           throw err;
       }
    }

}



export default ProductService;
