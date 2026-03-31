const rawApiUrl = process.env.REACT_APP_API_URL || "http://localhost:9091/api";
const trimmedApiUrl = rawApiUrl.endsWith("/")
  ? rawApiUrl.slice(0, -1)
  : rawApiUrl;

export const serverApi: string = trimmedApiUrl.endsWith("/api")
  ? trimmedApiUrl
  : `${trimmedApiUrl}/api`;
export const mediaApi: string = serverApi.replace(/\/api$/, "");
export const socketApi: string = mediaApi;

export const getApiUrl = (path = "") => {
  const normalizedPath = path.replace(/^\/+/, "");
  return normalizedPath ? `${serverApi}/${normalizedPath}` : serverApi;
};

// Rasm/mediaga to'liq URL yasash helperi
export const getMediaUrl = (path?: string) => {
  if (!path) return undefined;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  if (
    path.startsWith("/") &&
    !path.startsWith("/uploads/") &&
    !path.startsWith("/api/")
  ) {
    return path;
  }
  const normalized = path
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/^api\//, "")
    .replace(/^uploads\/uploads\//, "uploads/");
  if (
    normalized.startsWith("icons/") ||
    normalized.startsWith("img/") ||
    normalized.startsWith("brands/")
  ) {
    return `/${normalized}`;
  }
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
