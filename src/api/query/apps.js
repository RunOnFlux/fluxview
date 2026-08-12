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

// every running instance of every app on the network, in a single request
// (the per-app `location?appname=` endpoint would be one request per app)
async function globalAppLocations() {
  try {
    const res = await axios.get("https://api.runonflux.io/apps/locations");
    return res.data;
  } catch {
    console.log("error obtaining global app locations");
    return {};
  }
}

export { globalApps, globalAppLocations };
