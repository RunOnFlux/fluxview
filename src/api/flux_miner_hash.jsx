import axios from "axios";
const BASE_URL = "https://api-flux.fluxpools.net/api/miners/";

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
