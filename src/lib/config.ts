export const serverApi: string = `${process.env.REACT_APP_API_URL || "http://localhost:9090"}`;
// Media fayllar uchun host (agar serverApi oxirida /api bo'lsa, olib tashlaymiz)
export const mediaApi: string = serverApi.replace(/\/api$/, "");

// Rasm/mediaga to'liq URL yasash helperi
export const getMediaUrl = (path?: string) => {
  if (!path) return undefined;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  const normalized = path
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/^api\//, "")
    .replace(/^uploads\/uploads\//, "uploads/");
  const withPrefix = normalized.startsWith("uploads/")
    ? normalized
    : `uploads/${normalized}`;
  return `${mediaApi}/${withPrefix}`;
};

export const Messages = {
    error1: "Something went wrong!",
    error2: "Please login first!",
    error3: "Please fullfill all inputs!",
    error4: "Message is empty!",
    error5: "Only images with .jpeg, .jpg, .png format allowed!",
};

// Default AI model used by the app/clients when no override is provided.
// This makes it easy to switch the default model per-environment with an env var
// (REACT_APP_DEFAULT_AI_MODEL) — if not set, we enable the preview model
// "raptor-mini-preview" as requested.
export const defaultAIModel: string = process.env.REACT_APP_DEFAULT_AI_MODEL || "raptor-mini-preview";
