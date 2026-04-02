import axios from "axios";
import { getApiUrl, serverApi } from "../lib/config";

const apiClient = axios.create({
  baseURL: serverApi,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const url = typeof config.url === "string" ? config.url.trim() : "";
  const isAbsoluteUrl = /^https?:\/\//.test(url);

  if (isAbsoluteUrl) {
    return config;
  }

  const normalizedPath =
    !url || url === "/" || url === "api" || url === "/api"
      ? "health"
      : url.replace(/^\/+/, "");

  config.baseURL = undefined;
  config.url = getApiUrl(normalizedPath);
  return config;
});

export default apiClient;
