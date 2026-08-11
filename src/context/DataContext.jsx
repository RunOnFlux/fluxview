import { createContext, useEffect, useState } from "react";

const DataContext = createContext({});

// localStorage throws in some privacy modes, so every access is guarded
function readStored(key, fallback = "") {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function readStoredFlag(key) {
  return readStored(key) === "true";
}

export const DataProvider = ({ children }) => {
  const [homeitem, setHomeitem] = useState(() => readStored("homeitem", "nodes"));
  const [nodeWallet, setNodeWallet] = useState(() => readStored("nodewallet"));
  const [miningWallet, setMiningWallet] = useState(() => readStored("miningwallet"));
  const [appZelID, setAppZelID] = useState(() => readStored("appzelid"));
  const [userNodeCount, setUserNodeCount] = useState(0);
  const [nodeConfirmed, setNodeConfirmed] = useState(0);
  const [daemonHeight, setDaemonHeight] = useState("");
  const [fluxVersion, setFluxVersion] = useState("");
  const [benchVersion, setBenchVersion] = useState("");
  const [useZel, setUseZel] = useState(() => readStoredFlag("nodezelid"));
  const [useName, setUseName] = useState(() => readStoredFlag("appname"));
  const [nodePrivacy, setNodePrivacy] = useState(false);
  const [totalCard, setTotalCard] = useState(true);
  const [cumulusCard, setCumulusCard] = useState(false);
  const [nimbusCard, setNimbusCard] = useState(false);
  const [stratusCard, setStratusCard] = useState(false);
  const [nodeApps, setNodeApps] = useState(() => readStoredFlag("nodeapps"));

  // persisted as the values change: window.onbeforeunload never fires on
  // mobile or when the page is restored from the back/forward cache
  useEffect(() => {
    try {
      localStorage.setItem("nodewallet", nodeWallet ?? "");
      localStorage.setItem("miningwallet", miningWallet ?? "");
      localStorage.setItem("homeitem", homeitem ?? "nodes");
      localStorage.setItem("appzelid", appZelID ?? "");
      localStorage.setItem("nodezelid", useZel);
      localStorage.setItem("nodeapps", nodeApps);
      localStorage.setItem("appname", useName);
    } catch (error) {
      // storage unavailable: preferences simply are not persisted
    }
  }, [nodeWallet, miningWallet, homeitem, appZelID, useZel, nodeApps, useName]);

  return (
    <DataContext.Provider
      value={{
        homeitem,
        setHomeitem,
        nodeWallet,
        setNodeWallet,
        miningWallet,
        setMiningWallet,
        appZelID,
        setAppZelID,
        userNodeCount,
        setUserNodeCount,
        nodeConfirmed,
        setNodeConfirmed,
        daemonHeight,
        setDaemonHeight,
        fluxVersion,
        setFluxVersion,
        benchVersion,
        setBenchVersion,
        useZel,
        setUseZel,
        useName,
        setUseName,
        totalCard,
        setTotalCard,
        cumulusCard,
        setCumulusCard,
        nimbusCard,
        setNimbusCard,
        stratusCard,
        setStratusCard,
        nodePrivacy,
        setNodePrivacy,
        nodeApps,
        setNodeApps,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
