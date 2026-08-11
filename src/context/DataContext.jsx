import { createContext, useState } from "react";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [homeitem, setHomeitem] = useState("nodes");
  const [nodeWallet, setNodeWallet] = useState("");
  const [miningWallet, setMiningWallet] = useState("");
  const [appZelID, setAppZelID] = useState("");
  const [userNodeCount, setUserNodeCount] = useState(0);
  const [nodeConfirmed, setNodeConfirmed] = useState(0);
  const [daemonHeight, setDaemonHeight] = useState("");
  const [fluxVersion, setFluxVersion] = useState("");
  const [benchVersion, setBenchVersion] = useState("");
  const [useZel, setUseZel] = useState(false);
  const [useName, setUseName] = useState(false);
  const [nodePrivacy, setNodePrivacy] = useState(false);
  const [totalCard, setTotalCard] = useState(true);
  const [cumulusCard, setCumulusCard] = useState(false);
  const [nimbusCard, setNimbusCard] = useState(false);
  const [stratusCard, setStratusCard] = useState(false);
  const [nodeApps, setNodeApps] = useState(false);

  window.onload = function () {
    const tempnodewallet = localStorage.getItem("nodewallet");
    tempnodewallet == null ? setNodeWallet("") : setNodeWallet(tempnodewallet);

    const tempMiningWallet = localStorage.getItem("miningwallet");
    tempMiningWallet == null ? setMiningWallet("") : setMiningWallet(tempMiningWallet);

    const tempHomeItem = localStorage.getItem("homeitem");
    tempHomeItem == null ? setHomeitem("nodes") : setHomeitem(tempHomeItem);

    const tempAppZelID = localStorage.getItem("appzelid");
    tempAppZelID == null ? setAppZelID("") : setAppZelID(tempAppZelID);

    const tempNodeZelID = localStorage.getItem("nodezelid") === "true";
    tempNodeZelID == null ? setUseZel(false) : setUseZel(tempNodeZelID);

    const tempNodeApps = localStorage.getItem("nodeapps") === "true";
    tempNodeApps == null ? setNodeApps(false) : setNodeApps(tempNodeApps);

    const tempAppName = localStorage.getItem("appname") === "true";
    tempAppName == null ? setUseName(false) : setUseName(tempAppName);
  };

  window.onbeforeunload = function () {
    nodeWallet !== null ? localStorage.setItem("nodewallet", nodeWallet) : localStorage.setItem("nodewallet", "");
    miningWallet !== null ? localStorage.setItem("miningwallet", miningWallet) : localStorage.setItem("miningwallet", "");
    homeitem !== null ? localStorage.setItem("homeitem", homeitem) : localStorage.setItem("homeitem", "nodes");
    appZelID !== null ? localStorage.setItem("appzelid", appZelID) : localStorage.setItem("appzelid", "");
    useZel !== null ? localStorage.setItem("nodezelid", useZel) : localStorage.setItem("nodezelid", false);
    nodeApps !== null ? localStorage.setItem("nodeapps", nodeApps) : localStorage.setItem("nodeapps", false);
    useName !== null ? localStorage.setItem("appname", useName) : localStorage.setItem("appname", false);
  };

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
