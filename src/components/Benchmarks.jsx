import { useState, useEffect, useContext } from "react";
import axios from "axios";
import FeatureCard from "./FeatureCard";
import FeatureCardList from "./FeatureCardList";
import DataContext from "../context/DataContext";

const Benchmarks = ({ fluxip, rank }) => {
  const { daemonHeight } = useContext(DataContext);
  const { fluxVersion } = useContext(DataContext);
  const { totalCard, cumulusCard, nimbusCard, stratusCard } = useContext(DataContext);
  const { nodePrivacy } = useContext(DataContext);
  const { nodeApps } = useContext(DataContext);

  const [nodeTier, setNodeTier] = useState("");
  const [node_status, setNode_Status] = useState("");
  const [node_maint_window, setNode_Maint_Window] = useState("");
  const [node_daemon_sync_status, setNode_Daemon_Sync_Status] = useState("");

  const nodeIp = fluxip.split(":")[0];
  const nodePort = fluxip.split(":")[1] ? Number(fluxip.split(":")[1]) : 16127;

  // Build URL based on access method
  const newIP = `https://${nodeIp.replace(/\./g, "-")}-${nodePort}.node.api.runonflux.io`;

  const [benchmarks, setBenchmarks] = useState(null);
  const [benchmarksError, setBenchmarksError] = useState("");
  const [benchmarksLoading, setBenchmarksLoading] = useState(true);

  useEffect(() => {
    const fetchBenchmarks = async () => {
      try {
        setBenchmarksLoading(true);
        const response = await axios.get(`${newIP}/flux/info`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        setBenchmarks(response.data.data);
        setBenchmarksError("");
      } catch (err) {
        console.log(err.message);
        setBenchmarksError(err.message);
      } finally {
        setBenchmarksLoading(false);
      }
    };

    fetchBenchmarks();
  }, [newIP]);

  useEffect(() => {
    function updateConfirmed() {
      const benchStatus = benchmarks?.benchmark?.bench?.status;
      if (benchStatus == "CUMULUS" || benchStatus == "NIMBUS" || benchStatus == "STRATUS") {
        setNode_Status("PASSED");
        setNodeTier(benchStatus);
      } else {
        setNode_Status(benchStatus);
        setNodeTier("");
      }
    }
    updateConfirmed();
  }, [benchmarks?.benchmark?.bench?.status]);

  useEffect(() => {
    if (benchmarks?.daemon?.info.blocks) {
      setNode_Maint_Window(((480 - (benchmarks?.daemon?.info.blocks - benchmarks?.node?.status?.last_confirmed_height)) / 4).toFixed(0));
    } else {
      setNode_Maint_Window("N/A");
    }
  }, [benchmarks?.daemon?.info.blocks]);

  useEffect(() => {
    const nodeBlocks = benchmarks?.daemon?.info?.blocks;
    if (nodeBlocks) {
      const blocksBehind = daemonHeight - nodeBlocks;
      setNode_Daemon_Sync_Status(blocksBehind < 5 ? "SYNCED" : `NOT SYNCED ${blocksBehind} blocks behind`);
    } else {
      setNode_Daemon_Sync_Status("N/A");
    }
  }, [benchmarks?.daemon?.info?.blocks, daemonHeight]);

  const [card_clicked, setCard_clicked] = useState(false);

  return (
    <div className="ml-5 mr-5">
      <article>
        {benchmarksLoading && (
          <div className="flex flex-col">
            <div className={`feature-card-tile feature-card`}>{<FeatureCard title={"LOADING ..."} content={fluxip} />}</div>
          </div>
        )}
        {!benchmarksLoading && benchmarksError && (
          <div className="flex flex-col">
            <div className={`feature-card-tile feature-card`}>{<FeatureCard title={"BENCHMARKS UNAVAILABLE FOR IP ADDRESS"} content={fluxip} />}</div>
          </div>
        )}
        {benchmarks && (totalCard || (cumulusCard && nodeTier == "CUMULUS") || (nimbusCard && nodeTier == "NIMBUS") || (stratusCard && nodeTier == "STRATUS")) && (
          <div className="flex flex-col overflow-x-auto w-full">
            <div
              className={`feature-card-tile cursor-pointer ${card_clicked ? "feature-card-base" : "feature-card"}`}
              style={benchmarks?.benchmark?.bench?.status !== "failed" && node_daemon_sync_status === "SYNCED" ? {} : { backgroundColor: `maroon` }}
              onClick={() => setCard_clicked((prev) => !prev)}
            >
              {
                <FeatureCardList
                  features={[
                    {
                      title: "IP Address",
                      content: !nodePrivacy ? benchmarks?.benchmark?.bench?.ipaddress : "x.x.x.x",
                    },
                    { title: "Rank", content: rank ? rank : "N/A" },
                    {
                      title: "Tier",
                      content: nodeTier,
                      color: nodeTier == "CUMULUS" ? "text-confirmed" : nodeTier == "NIMBUS" ? "text-nimbus" : nodeTier == "STRATUS" ? "text-stratus" : "text-failed",
                    },
                    {
                      title: "Status",
                      content: node_status,
                      color: node_status == "PASSED" ? "text-confirmed" : "text-failed",
                    },
                    {
                      title: "Daemon",
                      content: node_daemon_sync_status,
                      color: node_daemon_sync_status === "SYNCED" ? "text-dimWhite" : "text-failed",
                    },
                    {
                      title: "FluxOS",
                      content: benchmarks?.flux?.version,
                      color: benchmarks?.flux?.version == fluxVersion ? "text-dimWhite" : "text-failed",
                    },
                    {
                      title: "Bench",
                      content: benchmarks?.benchmark?.info?.version,
                      color: "text-dimWhite",
                    },
                    {
                      title: "Maint",
                      content: node_maint_window.toString().concat(" mins"),
                      color: node_maint_window > 10 ? "text-confirmed" : "text-failed",
                    },
                  ]}
                />
              }
            </div>
            {card_clicked && (
              <>
                <div className={`feature-card-tile feature-card-node`}>
                  {
                    <FeatureCardList
                      features={[
                        {
                          title: "Cores",
                          content: benchmarks?.benchmark?.bench?.cores,
                        },
                        {
                          title: "EPS",
                          content: `${benchmarks?.benchmark?.bench?.eps}`.split(".")[0],
                        },
                        {
                          title: "RAM",
                          content: `${benchmarks?.benchmark?.bench?.ram}`.split(".")[0],
                        },
                        {
                          title: "SSD",
                          content: `${benchmarks?.benchmark?.bench?.ssd}`.split(".")[0],
                        },
                        {
                          title: "HDD",
                          content: `${benchmarks?.benchmark?.bench?.hdd}`.split(".")[0],
                        },
                        {
                          title: "DISK",
                          content: `${benchmarks?.benchmark?.bench?.ddwrite}`.split(".")[0],
                        },
                        {
                          title: "UP",
                          content: `${benchmarks?.benchmark?.bench?.upload_speed}`.split(".")[0],
                        },
                        {
                          title: "DOWN",
                          content: `${benchmarks?.benchmark?.bench?.download_speed}`.split(".")[0],
                        },
                      ]}
                    />
                  }
                </div>
                {nodeApps && (
                  <>
                    <div className={`feature-card-tile feature-card-node`}>
                      {
                        <FeatureCardList
                          features={[
                            {
                              title: "APPS CPU",
                              content: `${benchmarks?.apps?.resources?.appsCpusLocked} vCore`,
                            },
                            {
                              title: "APPS RAM",
                              content: `${benchmarks?.apps?.resources?.appsRamLocked} MB`,
                            },
                            {
                              title: "APPS STORAGE",
                              content: `${benchmarks?.apps?.resources?.appsHddLocked} GB`,
                            },
                            {
                              title: "Running Apps",
                              content: `${benchmarks.apps.runningapps.length ?? "0"}`,
                            },
                          ]}
                        />
                      }
                    </div>
                    {benchmarks?.apps?.runningapps.map((data, index) => {
                      return (
                        <div key={data.Id} className="flex flex-col">
                          <div className={`feature-card-tile feature-card-node`}>
                            <FeatureCard title={`App-${index} Image`} content={data.Image} />
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
                <div className={`feature-card-tile feature-card-node`}>
                  {
                    <FeatureCardList
                      features={[
                        {
                          title: "Continent",
                          content: benchmarks?.geolocation?.continent,
                        },
                        {
                          title: "Country",
                          content: benchmarks?.geolocation?.country,
                        },
                        {
                          title: "Region",
                          content: benchmarks?.geolocation?.regionName,
                        },
                      ]}
                    />
                  }
                </div>
              </>
            )}
          </div>
        )}
        {!benchmarks && !benchmarksLoading && !benchmarksError && totalCard && (
          <div className="flex flex-col">
            <div
              className={`feature-card-tile feature-card`}
              style={benchmarks?.benchmark?.bench?.status != "failed" && node_daemon_sync_status == "SYNCED" ? {} : { backgroundColor: `maroon` }}
            >
              {<FeatureCard title={"NO DATA AVAILABLE FOR IP"} content={fluxip} />}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default Benchmarks;
