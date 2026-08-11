import { useState, useEffect, useContext } from "react";
import useAxios from "../hooks/useAxios";
import FluxApiApp from "../api/flux_api_apps";
import flux_daemon from "../api/flux_daemon";
import FeatureCard from "./FeatureCard";
import DataContext from "../context/DataContext";
import FeatureCardList from "./FeatureCardList";

import { FORK_BLOCK_HEIGHT } from "../constants";

function calculateExpiresOnBlockheight(registerHeight, expire) {
  if (!registerHeight || registerHeight < 0) {
    return null;
  }
  const defaultExpire = 22000;
  const expireIn = expire || defaultExpire;
  const originalExpirationHeight = registerHeight + expireIn;

  // If app was registered before PON fork AND expiration extends past the fork,
  // the blocks AFTER the fork will be 4x faster, so multiply those by 4
  if (registerHeight < FORK_BLOCK_HEIGHT && originalExpirationHeight > FORK_BLOCK_HEIGHT) {
    const blocksAfterFork = originalExpirationHeight - FORK_BLOCK_HEIGHT;
    const adjustedBlocksAfterFork = blocksAfterFork * 4;
    const adjustedExpiration = FORK_BLOCK_HEIGHT + adjustedBlocksAfterFork;
    return adjustedExpiration;
  }
  return originalExpirationHeight;
}

function convertMinutesToDHM(registerHeight, expire, currentHeight) {
  const expiresOnBlockheight = calculateExpiresOnBlockheight(registerHeight, expire);

  if (!expiresOnBlockheight || currentHeight < 0) {
    return "Not available";
  }

  const blocksRemaining = expiresOnBlockheight - currentHeight;

  if (blocksRemaining < 1) {
    return "Application Expired";
  }

  let totalMinutes = 0;

  // Before fork: 2 minutes per block
  // After fork: 0.5 minutes per block (30 seconds)
  if (currentHeight < FORK_BLOCK_HEIGHT) {
    // We're currently before the fork
    if (expiresOnBlockheight <= FORK_BLOCK_HEIGHT) {
      // Expiration is before fork - all blocks at 2 min/block
      totalMinutes = blocksRemaining * 2;
    } else {
      // Expiration is after fork - split calculation
      const blocksUntilFork = FORK_BLOCK_HEIGHT - currentHeight;
      const blocksAfterFork = expiresOnBlockheight - FORK_BLOCK_HEIGHT;
      totalMinutes = blocksUntilFork * 2 + blocksAfterFork * 0.5;
    }
  } else {
    // We're currently after fork - all remaining blocks at 0.5 min/block
    totalMinutes = blocksRemaining * 0.5;
  }

  // Convert minutes to human-readable format
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = Math.floor(totalMinutes % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);

  return parts.join(" ");
}

const FluxApps = (props) => {
  // eslint-disable-next-line no-unused-vars
  const [appIndex, setAppIndex] = useState(-1);
  const [appClicked, setAppClicked] = useState("");
  const [updating, setUpdating] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const { useName, setUseName } = useContext(DataContext);
  const [ownerAppData, setOwnerAppData] = useState([]);
  const [numInstances, setNumInstances] = useState(0);
  const [numRunCount, setNumRunCount] = useState(0);

  async function returnAppIndex(name) {
    for (let i = 0; i < ownerAppData.length; i++) {
      if (ownerAppData[i].name === name) {
        return i;
      }
    }
  }

  async function getAppIndex() {
    if (appClicked) {
      setAppIndex(await returnAppIndex(appClicked));
    }
  }

  function appClick(name) {
    appClicked == name ? setAppClicked("") : setAppClicked(name);
  }

  async function getRunningInstances(name) {
    try {
      const response = await FluxApiApp.get(`location?appname=${name}`);
      const ipList = (response.data?.data || []).filter((item) => item.ip !== "").map((item) => item.ip);
      return { runningApps: ipList.length, IPList: ipList };
    } catch (error) {
      console.log(error);
      return { runningApps: 0, IPList: [] };
    }
  }

  function updateAppState(list) {
    setUpdating(true);
    const filteredList = list.data.filter((item) => (useName ? item.name.includes(props.wallet) : item.owner === props.wallet));

    const ownerData = filteredList.map(async (item) => {
      const { runningApps, IPList } = await getRunningInstances(item.name);

      return {
        name: item.name,
        instances: item.instances,
        runningApps: runningApps,
        height: item.height,
        expire: item.expire,
        repotag: item?.repotag || item?.compose?.[0]?.repotag || "enterprise",
        description: item.description,
        cpu: item.cpu || item.compose?.[0]?.cpu || "N/A",
        hdd: item.hdd || item.compose?.[0]?.hdd || "N/A",
        ram: item.ram || item.compose?.[0]?.ram || "N/A",
        ips: IPList,
      };
    });

    Promise.all(ownerData).then((data) => {
      setOwnerAppData(data);
      // totals recomputed from the resolved list: incrementing on each item
      // inflated the counts every time the app list refreshed
      setNumInstances(data.reduce((total, app) => total + (app.instances || 0), 0));
      setNumRunCount(data.reduce((total, app) => total + (app.runningApps || 0), 0));
      setUpdating(false);
    });
  }

  const [appList, error, loading] = useAxios({
    axiosInstance: FluxApiApp,
    method: "GET",
    url: "globalappsspecifications",
    requestConfig: {
      headers: {
        "Content-Language": "en-US",
      },
    },
  });
  // eslint-disable-next-line no-unused-vars
  const [blockHeight, blockHeighterror, blockHeightloading] = useAxios({
    axiosInstance: flux_daemon,
    method: "GET",
    url: "getblockcount",
    requestConfig: {
      headers: {
        "Content-Language": "en-US",
      },
    },
  });

  useEffect(() => {
    if (appList?.data && !loading && !error) {
      updateAppState(appList);
    }
  }, [appList, loading, error]);

  useEffect(() => {
    getAppIndex();
  }, [appClicked, ownerAppData]);

  useEffect(() => {
    props.SetTotalApps(appList?.data?.length || 0);
    props.SetTotalInstances(numInstances);
    props.SetTotalRunning(numRunCount);
    props.SetUserApps(ownerAppData?.length);
  }, [appList, ownerAppData, numInstances, numRunCount, props.SetTotalApps, props.SetTotalInstances, props.SetTotalRunning, props.SetUserApps]);

  return (
    <article className="ml-5 mr-5">
      {loading ? (
        <div className="flex flex-col">
          <div className={`feature-card-tile feature-card`}>
            <FeatureCard title={"LOADING ..."} content={props.wallet} />
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col">
          <div className={`feature-card-tile feature-card`}>
            <FeatureCard title={"APPS NOT AVAILABLE FOR ZEL ID"} content={props.wallet} />
          </div>
        </div>
      ) : updating ? (
        <div className="flex flex-col">
          <div className={`feature-card-tile feature-card`}>{<FeatureCard title={"Updating ..."} content={props.wallet} />}</div>
        </div>
      ) : ownerAppData.length === 0 ? (
        <div className="flex flex-col">
          <div className={`feature-card-tile feature-card`}>{<FeatureCard title={"No Apps Found ..."} content={props.wallet} />}</div>
        </div>
      ) : ownerAppData.length > 0 ? (
        <div>
          {ownerAppData.map((app, index) => {
            return (
              <div key={index} className="flex flex-col">
                <div className={`feature-card-tile cursor-pointer ${appClicked === app.name ? "feature-card-base" : "feature-card"}`} onClick={() => appClick(app.name)}>
                  {
                    <FeatureCardList
                      features={[
                        { title: "Name", content: app.name },
                        { title: "Instances", content: app.instances },
                        {
                          title: "Running",
                          content: app.runningApps > 0 ? app.runningApps : "N/A",
                        },
                        {
                          title: "Expire",
                          content:
                            app.height && app.expire && blockHeight?.data
                              ? convertMinutesToDHM(app.height, app.expire, blockHeight?.data)
                              : app.height && !app.expire && blockHeight?.data
                                ? convertMinutesToDHM(app.height, 88000, blockHeight?.data)
                                : "N/A",
                        },
                        {
                          title: "Repo",
                          content: app?.repotag || (app?.compose && app?.compose[0]?.repotag),
                        },
                      ]}
                    />
                  }
                </div>
                {appClicked === app.name && (
                  <div>
                    <div className={`feature-card-tile feature-card-node`}>
                      <FeatureCard title={"Description"} content={app.description} />
                    </div>
                    <div className={`feature-card-tile feature-card-node`}>
                      {
                        <FeatureCardList
                          features={[
                            {
                              title: "CPU",
                              content: app.cpu || app?.compose?.[0]?.cpu || "N/A",
                            },
                            {
                              title: "Storage",
                              content: app.hdd ? `${app.hdd}`.concat(" GB") : app?.compose?.[0]?.hdd ? `${app.compose[0].hdd}`.concat(" GB") : "N/A",
                            },
                            {
                              title: "RAM",
                              content: app.ram ? `${app.ram}`.concat(" MB") : app?.compose?.[0]?.ram ? `${app.compose[0].ram}`.concat(" MB") : "N/A",
                            },
                            {
                              title: "Height",
                              content: app.height || app?.compose?.[0]?.height || "N/A",
                            },
                          ]}
                        />
                      }
                    </div>
                    {app?.ips?.map((item) => {
                      return (
                        <div key={item} className={`feature-card-tile feature-card-node`}>
                          <FeatureCard title={"Visit Node"} color={"text-blue-400"} content={item ? item : "N/A"} link={"true"} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </article>
  );
};
export default FluxApps;
