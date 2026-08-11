import axios from "axios";
const BASE_URL = "https://stats.runonflux.io/";

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
