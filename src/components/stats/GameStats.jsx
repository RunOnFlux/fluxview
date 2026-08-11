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
  const [selected, setSelected] = useState([]);
  const [selectionIndex, setSelectionIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const handleSelection = (gameArray, index) => {
    setSelectionIndex(index);
    setSelected(gameArray);
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
          const getAppDetails = await appScope(app.name);
          app.masterIP = parseIP(getAppDetails[0][1].value?.value);
          setArray((prevArray) => [...prevArray, app]);
        };

        // Filter data based on version and repotag
        const filteredData = data?.filter((app) => app.version >= 4);

        // Separate the data based on repotag
        const palWorldApps = filteredData?.filter((app) => app.compose[0].repotag.includes("palworld-server"));
        const mineCraftApps = filteredData?.filter((app) => app.compose[0].repotag.includes("minecraft"));
        const enshroudedApps = filteredData?.filter((app) => app.compose[0].repotag.includes("enshrouded"));
        const valheimApps = filteredData?.filter((app) => app.compose[0].repotag.includes("valheim"));
        const vrisingApps = filteredData?.filter((app) => app.compose[0].repotag.includes("vrising"));

        // Set data for each category
        setPalWolrd(() => []);
        setMineCraft(() => []);
        setEnshrouded(() => []);
        setValheim(() => []);

        palWorldApps?.forEach(async (app) => await getAppDetailsAndSetMasterIP(app, setPalWolrd));
        mineCraftApps?.forEach(async (app) => await getAppDetailsAndSetMasterIP(app, setMineCraft));
        enshroudedApps?.forEach(async (app) => await getAppDetailsAndSetMasterIP(app, setEnshrouded));
        valheimApps?.forEach(async (app) => await getAppDetailsAndSetMasterIP(app, setValheim));
        vrisingApps?.forEach(async (app) => await getAppDetailsAndSetMasterIP(app, setVrising));

        // Set selected based on selectionIndex
        const selectedArray =
          selectionIndex === 1
            ? palWorldApps
            : selectionIndex === 2
              ? mineCraftApps
              : selectionIndex === 3
                ? enshroudedApps
                : selectionIndex === 4
                  ? valheimApps
                  : selectionIndex === 5
                    ? vrisingApps
                    : [];
        setSelected(selectedArray);
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

  return (
    <div className="ml-10 mr-10 mb-16">
      <div className="flex w-full flex-wrap justify-center items-center p-[2px] mt-2">
        <SkeletonTheme baseColor="#14101d" highlightColor="#444" width={200} height={36} count={1} duration={2}>
          <div className="ml-2 mr-2 mb-2 flex flex-col flex-wrap core-tool-tip">
            <div className="flex flex-row flex-wrap justify-center">
              <div className={`m-2 md:w-[250px] w-[280px] cursor-pointer ${selectionIndex === 1 ? "stat-box-selected" : "stat-box"}`} onClick={() => handleSelection(palworld, 1)}>
                <div className={`${layout.statBox} mt-2 text-core text-[36px] h-20`}>
                  <img className="p-2" src={palworld_logo} />
                </div>
                <div className={`${layout.statBox} text-white text-[36px]`}>{palworld.length || <Skeleton />}</div>
              </div>
              <div className={`m-2 md:w-[250px] w-[280px] cursor-pointer ${selectionIndex === 2 ? "stat-box-selected" : "stat-box"}`} onClick={() => handleSelection(mineCraft, 2)}>
                <div className={`${layout.statBox} mt-2 text-core text-[36px] h-20`}>
                  <img className="p-2" src={minecraft_logo} />
                </div>
                <div className={`${layout.statBox} text-white text-[36px]`}>{mineCraft.length || <Skeleton />}</div>
              </div>
              <div
                className={`m-2 md:w-[250px] w-[280px] cursor-pointer ${selectionIndex === 3 ? "stat-box-selected" : "stat-box"}`}
                onClick={() => handleSelection(enshrouded, 3)}
              >
                <div className={`${layout.statBox} mt-2 text-core text-[36px] h-20`}>
                  <img className="p-2" src={enshrouded_logo} />
                </div>
                <div className={`${layout.statBox} text-white text-[36px]`}>{enshrouded.length || <Skeleton />}</div>
              </div>
              <div className={`m-2 md:w-[250px] w-[280px] cursor-pointer ${selectionIndex === 4 ? "stat-box-selected" : "stat-box"}`} onClick={() => handleSelection(valheim, 4)}>
                <div className={`${layout.statBox} mt-2 text-core text-[36px] h-20`}>
                  <img className="p-2" src={valheim_logo} />
                </div>
                <div className={`${layout.statBox} text-white text-[36px]`}>{valheim.length || <Skeleton />}</div>
              </div>
              <div className={`m-2 md:w-[250px] w-[280px] cursor-pointer ${selectionIndex === 5 ? "stat-box-selected" : "stat-box"}`} onClick={() => handleSelection(vrising, 5)}>
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
          <ShowServers
            game={selected}
            type={
              selectionIndex === 1
                ? "palworld"
                : selectionIndex === 2
                  ? "minecraft"
                  : selectionIndex === 3
                    ? "enshrouded"
                    : selectionIndex === 4
                      ? "valheim"
                      : selectionIndex === 5
                        ? "vrising"
                        : "palworld"
            }
          />
        </div>
      )}
    </div>
  );
};

export default GameStats;
