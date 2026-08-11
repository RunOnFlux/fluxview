import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { layout } from "../../style";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { appScope, globalApps } from "../../api/query/apps";
import { parseIP } from "../../helpers/util";
import GameServer from "../GameServer";
import { enshrouded_logo, minecraft_logo, palworld_logo, valheim_logo, vrising_logo } from "../../assets";

const GameStats = () => {
  const [palworld, setPalWolrd] = useState([]);
  const [enshrouded, setEnshrouded] = useState([]);
  const [mineCraft, setMineCraft] = useState([]);
  const [valheim, setValheim] = useState([]);
  const [vrising, setVrising] = useState([]);
  const [selectionIndex, setSelectionIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const handleSelection = (index) => {
    setSelectionIndex(index);
  };

  const { isPending, error, data, isFetching, refetch } = useQuery({
    queryKey: ["repoData"],
    queryFn: async () => {
      const getApps = await globalApps();
      return getApps.data;
    },
    enabled: false,
  });

  useEffect(() => {
    let ignore = false;
    async function getServerData() {
      if (!ignore) {
        // Function to get app details and set masterIP
        const getAppDetailsAndSetMasterIP = async (app, setArray) => {
          try {
            const getAppDetails = await appScope(app.name);
            // first server row, "svname" field, holds "<ip>:<port>"
            const serverAddress = getAppDetails?.[0]?.[1]?.value?.value;
            if (!serverAddress) return;
            app.masterIP = parseIP(serverAddress);
            setArray((prevArray) => [...prevArray, app]);
          } catch (error) {
            console.log(`error obtaining master IP for ${app.name}`);
          }
        };

        // Filter data based on version and repotag
        // enterprise apps are version 4+ but ship an empty compose array
        const filteredData = data?.filter((app) => app.version >= 4);
        const byRepotag = (keyword) => filteredData?.filter((app) => app.compose?.[0]?.repotag?.includes(keyword)) ?? [];

        // Separate the data based on repotag
        const palWorldApps = byRepotag("palworld-server");
        const mineCraftApps = byRepotag("minecraft");
        const enshroudedApps = byRepotag("enshrouded");
        const valheimApps = byRepotag("valheim");
        const vrisingApps = byRepotag("vrising");

        // Set data for each category
        setPalWolrd(() => []);
        setMineCraft(() => []);
        setEnshrouded(() => []);
        setValheim(() => []);
        setVrising(() => []);

        palWorldApps?.forEach(async (app) => await getAppDetailsAndSetMasterIP(app, setPalWolrd));
        mineCraftApps?.forEach(async (app) => await getAppDetailsAndSetMasterIP(app, setMineCraft));
        enshroudedApps?.forEach(async (app) => await getAppDetailsAndSetMasterIP(app, setEnshrouded));
        valheimApps?.forEach(async (app) => await getAppDetailsAndSetMasterIP(app, setValheim));
        vrisingApps?.forEach(async (app) => await getAppDetailsAndSetMasterIP(app, setVrising));

        setIsLoading(false);
      }
    }
    getServerData();
    return () => {
      ignore = true;
    };
  }, [data]);

  useEffect(() => {
    data ? null : refetch();
  }, []);

  // if (isPending) return <span className="text-white text-center text-size[24px]">Loading...</span>;

  // if (isLoading) return <span className="text-white text-center text-size[24px]">Loading...</span>;

  // if (isFetching) return <span className="text-white text-center text-size[24px]">Fetching...</span>;

  // if (error) return <span className="text-white text-center text-size[24px]">An error has occurred: {error.message}</span>;

  const ShowServers = ({ game, type }) => {
    return game?.map((item, index) => {
      return <GameServer key={index} game={item} type={type} />;
    });
  };

  // the displayed list derives from the resolved arrays, so the cards always
  // match the counters above them
  const gamesByIndex = {
    1: { list: palworld, type: "palworld" },
    2: { list: mineCraft, type: "minecraft" },
    3: { list: enshrouded, type: "enshrouded" },
    4: { list: valheim, type: "valheim" },
    5: { list: vrising, type: "vrising" },
  };
  const selectedGame = gamesByIndex[selectionIndex] ?? gamesByIndex[1];

  return (
    <div className="ml-10 mr-10 mb-16">
      <div className="flex w-full flex-wrap justify-center items-center p-[2px] mt-2">
        <SkeletonTheme baseColor="#14101d" highlightColor="#444" width={200} height={36} count={1} duration={2}>
          <div className="ml-2 mr-2 mb-2 flex flex-col flex-wrap core-tool-tip">
            <div className="flex flex-row flex-wrap justify-center">
              <div className={`m-2 md:w-[250px] w-[280px] cursor-pointer ${selectionIndex === 1 ? "stat-box-selected" : "stat-box"}`} onClick={() => handleSelection(1)}>
                <div className={`${layout.statBox} mt-2 text-core text-[36px] h-20`}>
                  <img className="p-2" src={palworld_logo} />
                </div>
                <div className={`${layout.statBox} text-white text-[36px]`}>{palworld.length || <Skeleton />}</div>
              </div>
              <div className={`m-2 md:w-[250px] w-[280px] cursor-pointer ${selectionIndex === 2 ? "stat-box-selected" : "stat-box"}`} onClick={() => handleSelection(2)}>
                <div className={`${layout.statBox} mt-2 text-core text-[36px] h-20`}>
                  <img className="p-2" src={minecraft_logo} />
                </div>
                <div className={`${layout.statBox} text-white text-[36px]`}>{mineCraft.length || <Skeleton />}</div>
              </div>
              <div className={`m-2 md:w-[250px] w-[280px] cursor-pointer ${selectionIndex === 3 ? "stat-box-selected" : "stat-box"}`} onClick={() => handleSelection(3)}>
                <div className={`${layout.statBox} mt-2 text-core text-[36px] h-20`}>
                  <img className="p-2" src={enshrouded_logo} />
                </div>
                <div className={`${layout.statBox} text-white text-[36px]`}>{enshrouded.length || <Skeleton />}</div>
              </div>
              <div className={`m-2 md:w-[250px] w-[280px] cursor-pointer ${selectionIndex === 4 ? "stat-box-selected" : "stat-box"}`} onClick={() => handleSelection(4)}>
                <div className={`${layout.statBox} mt-2 text-core text-[36px] h-20`}>
                  <img className="p-2" src={valheim_logo} />
                </div>
                <div className={`${layout.statBox} text-white text-[36px]`}>{valheim.length || <Skeleton />}</div>
              </div>
              <div className={`m-2 md:w-[250px] w-[280px] cursor-pointer ${selectionIndex === 5 ? "stat-box-selected" : "stat-box"}`} onClick={() => handleSelection(5)}>
                <div className={`${layout.statBox} mt-2 text-core text-[36px] h-20`}>
                  <img className="p-2" src={vrising_logo} />
                </div>
                <div className={`${layout.statBox} text-white text-[36px]`}>{vrising.length || <Skeleton />}</div>
              </div>
            </div>
          </div>
        </SkeletonTheme>
      </div>
      {!isFetching && !isLoading && !isPending && !error && (
        <div className="flex flex-col w-full flex-wrap justify-around">
          <ShowServers game={selectedGame.list} type={selectedGame.type} />
        </div>
      )}
    </div>
  );
};

export default GameStats;
