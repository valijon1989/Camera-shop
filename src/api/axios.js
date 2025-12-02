import axios from "axios";

const rawApiUrl = process.env.REACT_APP_API_URL || "http://localhost:9090";
const trimmedApiUrl = rawApiUrl.endsWith("/")
  ? rawApiUrl.slice(0, -1)
  : rawApiUrl;
const hasApiSuffix = trimmedApiUrl.endsWith("/api");
const base = hasApiSuffix ? trimmedApiUrl : `${trimmedApiUrl}/api`;

axios.defaults.baseURL = base;

export default axios;
