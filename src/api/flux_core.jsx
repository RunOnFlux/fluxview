import axios from "axios";
const FLUX_CORE = "https://service.fluxcore.ai/api";

export default axios.create({
  baseURL: FLUX_CORE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
