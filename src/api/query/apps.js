import axios from "axios";
/* eslint no-unused-vars: off */
async function globalApps() {
  try {
    const res = await axios.get("https://api.runonflux.io/apps/globalappsspecifications");
    return res.data;
  } catch (error) {
    console.log("error obtaining global app specs");
    return {};
  }
}

async function appScope(appName) {
  try {
    const appLower = appName.toLowerCase();
    const res = await axios.get(`https://${appLower}.app.runonflux.io/fluxstatistics?scope=${appName};json;norefresh`);
    return res.data ?? {};
  } catch (error) {
    console.log("error obtaining app scopre");
    return {};
  }
}

async function getGameServerDetails(ip, port, type) {
  const gameOptions = {
    options: {
      host: ip,
      port: port,
      type: type,
      attemptTimeout: 5000,
      portCache: true,
    },
  };
  try {
    const serverDetails = await axios.post("https://gamedig.app.runonflux.io/api/v1/gamedig/details", gameOptions);
    return serverDetails;
  } catch (error) {
    console.log(error);
    return {};
  }
}

export { globalApps, appScope, getGameServerDetails };
