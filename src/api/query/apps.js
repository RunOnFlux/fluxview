import axios from "axios";

async function globalApps() {
  try {
    const res = await axios.get("https://api.runonflux.io/apps/globalappsspecifications");
    return res.data;
  } catch {
    console.log("error obtaining global app specs");
    return {};
  }
}

export { globalApps };
