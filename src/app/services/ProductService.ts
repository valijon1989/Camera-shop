import { Product, ProductCreate, ProductInquiry } from "./types/product";
import axios from "../../api/axios";
import { getApiUrl } from "../../lib/config";
class ProductService {
     public async getProducts(input: ProductInquiry): Promise<Product[]> {
        try {
            const result = await axios.get(getApiUrl("cameras"), {
              params: {
                order: input.order,
                page: input.page,
                limit: input.limit,
                search: input.search,
                category: input.category,
                brand: input.brand,
                minPrice: input.minPrice,
                maxPrice: input.maxPrice,
                sensorType: input.sensorType,
                resolutionMp: input.resolutionMp,
                mountType: input.mountType,
                videoResolution: input.videoResolution,
                isoRange: input.isoRange,
                stabilization: input.stabilization,
              },
            });
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
            const result = await axios.get(getApiUrl(`cameras/${productId}`), {
              withCredentials: true,
            });

            const data: any = result.data;
            const payload = data?.data ?? data?.product ?? data;
            return payload;
        } catch (err) {
            throw err;
        }
     }

    public async createProduct(input: ProductCreate): Promise<Product> {
       try {
           const url = getApiUrl("cameras");

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
