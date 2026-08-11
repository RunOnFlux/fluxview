import axios from "axios";
const BASE_URL = "https://raw.githubusercontent.com/RunOnFlux/flux/master/";

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
