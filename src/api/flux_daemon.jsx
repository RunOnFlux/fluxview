import axios from "axios";
const BASE_URL = "https://api.runonflux.io/daemon";

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
