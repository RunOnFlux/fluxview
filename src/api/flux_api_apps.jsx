import axios from "axios";
const NODE_LIST_URL = "https://api.runonflux.io/apps";

export default axios.create({
  baseURL: NODE_LIST_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
