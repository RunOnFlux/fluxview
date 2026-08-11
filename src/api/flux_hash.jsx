import axios from "axios";
const BASE_URL = "https://explorer.runonflux.io/api/statistics";

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
