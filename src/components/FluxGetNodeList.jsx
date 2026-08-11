import useAxios from "../hooks/useAxios";
import axios from "../api/flux_node_list";
import { useEffect, useContext, useState } from "react";
import daemonAxios from "../api/flux_daemon";
import flux_github from "../api/flux_github";
import Benchmarks from "./Benchmarks";
import DataContext from "../context/DataContext";
import { checkIp } from "@/helpers/util";

export function FluxGetNodeListFunc(props) {
  const { nodeWallet, setUserNodeCount, setDaemonHeight, setFluxVersion, useZel } = useContext(DataContext);
  const [loadError, setLoadError] = useState(false);
  const [ipResults, setIpResults] = useState([]);

  const getStatsList = async (wallets) => {
    try {
      // trim first: the list arrives comma separated, so entries carry spaces
      const validZelids = wallets.map((zelid) => zelid.trim()).filter((zelid) => zelid.length === 33 || zelid.length === 34);
      if (validZelids.length === 0) return [];

      const ipResponse = await axios.get("https://stats.runonflux.io/fluxinfo?projection=flux.zelid,flux.ip,node.status.last_confirmed_height,node.status.tier", {
        headers: {
          "Content-Language": "en-US",
        },
      });

      const nodeData = ipResponse?.data?.data || [];
      let statsList = [];

      for (let index = 0; index < validZelids.length; index++) {
        const walletAddress = validZelids[index];
        const walletResults = nodeData.filter((data) => data.flux.zelid === walletAddress);
        statsList = statsList.concat(walletResults);
      }
      return statsList;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const getDaemonList = async (wallets) => {
    let daemonList = [];
    try {
      for (let index = 0; index < wallets.length; index++) {
        const walletAddress = wallets[index].trim() || "";
        if (walletAddress && (walletAddress.length === 35 || checkIp(walletAddress))) {
          const ipResponse = await axios.get("https://api.runonflux.io/daemon/viewdeterministiczelnodelist?filter=".concat(walletAddress), {
            headers: {
              "Content-Language": "en-US",
            },
          });
          const ips = ipResponse?.data?.data || [];
          daemonList = daemonList.concat(ips);
        }
      }
      return daemonList;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    try {
      const checkIps = async () => {
        const walletList = nodeWallet.split(",");
        let ipList = [];
        useZel ? (ipList = await getStatsList(walletList)) : (ipList = await getDaemonList(walletList));
        setIpResults(ipList);
        ipList.length > 0 ? setLoadError(false) : setLoadError(true);
      };
      checkIps();
    } catch (error) {
      console.log(error);
      setLoadError(true);
    }
  }, [nodeWallet, useZel]);

  const [daemonheight, daemonError, daemonLoading] = useAxios({
    axiosInstance: daemonAxios,
    method: "GET",
    url: "getblockcount",
    requestConfig: {
      headers: {
        "Content-Language": "en-US",
      },
    },
  });

  const [fluxversion, fluxversionError] = useAxios({
    axiosInstance: flux_github,
    method: "GET",
    url: "package.json",
    requestConfig: {
      headers: {
        "Content-Language": "en-US",
      },
    },
  });

  useEffect(() => {
    let numNodes = 0;
    let cumulus = 0;
    let nimbus = 0;
    let stratus = 0;
    ipResults?.map((data) => {
      if (!useZel ? data?.tier === "CUMULUS" : data?.node?.status?.tier === "CUMULUS") {
        cumulus++;
        numNodes++;
      } else if (!useZel ? data?.tier === "NIMBUS" : data?.node?.status?.tier === "NIMBUS") {
        nimbus++;
        numNodes++;
      } else if (!useZel ? data?.tier === "STRATUS" : data?.node?.status?.tier === "STRATUS") {
        stratus++;
        numNodes++;
      }
    });
    props.setUserCumulus(cumulus);
    props.setUserNimbus(nimbus);
    props.setUserStratus(stratus);
    setUserNodeCount(numNodes);
  }, [ipResults, useZel, props.setUserCumulus, props.setUserNimbus, props.setUserStratus, setUserNodeCount]);

  useEffect(() => {
    if (daemonheight?.data != null) {
      setDaemonHeight(daemonheight?.data);
    }
  }, [daemonheight?.data, setDaemonHeight]);

  useEffect(() => {
    if (fluxversion?.version != null) {
      setFluxVersion(fluxversion?.version);
    }
  }, [fluxversion?.version, setFluxVersion]);

  return (
    <div>
      {loadError && !daemonLoading && !daemonError && ipResults.length === 0 && !fluxversionError && fluxversion && (
        <div className="text-white text-2xl text-center">No nodes found on network.</div>
      )}

      {!loadError &&
        !daemonLoading &&
        !daemonError &&
        ipResults.length !== 0 &&
        daemonheight?.data &&
        fluxversion &&
        !useZel &&
        ipResults.map((data) => {
          return <Benchmarks key={data?.ip.toString()} fluxip={data?.ip} rank={data?.rank} />;
        })}

      {!loadError &&
        !daemonLoading &&
        !daemonError &&
        ipResults.length !== 0 &&
        daemonheight?.data &&
        fluxversion &&
        useZel &&
        ipResults?.map((data) => {
          return <Benchmarks key={data?.flux?.ip.toString()} fluxip={data?.flux?.ip} />;
        })}
    </div>
  );
}

export default FluxGetNodeListFunc;
