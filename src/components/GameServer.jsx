import { useState } from "react";
import {
  BsCpu,
  BsDatabaseFillLock,
  BsDeviceSsd,
  BsEthernet,
  BsFilePersonFill,
  BsFillHddNetworkFill,
  BsGlobe,
  BsMemory,
  BsPersonBadge,
  BsServer,
  BsUsbPlugFill,
} from "react-icons/bs";
import Skeleton from "react-loading-skeleton";
import { getGameServerDetails } from "../api/query/apps";
import { useQuery } from "@tanstack/react-query";
import { parsePort } from "../helpers/util";

const GameServer = ({ game, type }) => {
  const [selected, setSelected] = useState(false);
  const getDetails = () => {
    setSelected(!selected);
  };

  const { error, data, isFetching } = useQuery({
    queryKey: ["serverDetails", game.name],
    queryFn: async () => {
      const getApps = await getGameServerDetails(game.masterIP, game.compose[0].ports[0], type);
      if (!getApps.data.name) throw new Error("error processing request");
      return getApps.data;
    },
    enabled: selected,
  });

  return (
    <div className="rounded-2xl flex flex-wrap justify-evenly items-center p-[2px] mb-10 bg-slate-800">
      <div className="ml-2 mr-2 mb-2 flex flex-col flex-wrap w-full">
        <div className="flex m-2 flex-wrap justify-around">
          <div className="m-1 flex flex-row flex-wrap">
            <BsPersonBadge className="icon-core-title" />
            <span className="text-core xs:text-[24px] sm:text-[32px]">{game.name || <Skeleton />}</span>
          </div>
          <div className="m-1 flex flex-row flex-wrap">
            <BsFillHddNetworkFill className="icon-core-title" />
            <span className="text-core text-[32px]">{game.masterIP || <Skeleton />}</span>
          </div>
        </div>
        <hr className="m-2 p-1" />
        <div className="flex m-2 flex-wrap justify-around">
          {game.compose[0].ports.map((port) => {
            return (
              <div key={port} className="game-card-container">
                <BsEthernet className="icon-core-card" />
                <span key={port} className="game-card-item">
                  {port}
                </span>
              </div>
            );
          })}
          <div className="game-card-container">
            <BsCpu className="icon-core-card" />
            <span className="game-card-item">{game.compose[0].cpu}</span>
          </div>
          <div className="game-card-container">
            <BsMemory className="icon-core-card" />
            <span className="game-card-item">{game.compose[0].ram}</span>
          </div>
          <div className="game-card-container">
            <BsDeviceSsd className="icon-core-card" />
            <span className="game-card-item">{game.compose[0].hdd}</span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center">
          <button
            style={{ width: "250px" }}
            className={`m-1 py-2 px-2 bg-blue-gradient font-poppins font-medium text-[18px] text-white outline-none rounded-[10px]`}
            onClick={() => getDetails()}
          >
            {selected ? "Hide Details" : "Show Details"}
          </button>
        </div>
        {selected && isFetching && <span className="text-white text-center">fetching data ...</span>}
        {selected && error && <span className="text-white text-center">error checking server!</span>}
        {selected && !error && data?.name && (
          <>
            <hr className="m-2 p-1" />
            <div className="flex flex-wrap justify-evenly">
              <div className="game-card-container">
                <BsServer className="icon-core-title m-2" />
                <span className="text-white xs:text-[18px] md:text-[24px]">{data?.name}</span>
              </div>
              {data?.map && (
                <div className="game-card-container">
                  <BsGlobe className="icon-core-title m-2" />
                  <span className="text-white xs:text-[18px] md:text-[24px]">{data?.map}</span>
                </div>
              )}
              <div className="game-card-container">
                <BsUsbPlugFill className="icon-core-title m-2" />
                <span className="text-white text-[24px]">{parsePort(data?.connect)}</span>
              </div>
              <div className="game-card-container">
                <BsDatabaseFillLock className="icon-core-title m-2" />
                <span className="text-white text-[24px]">{data?.password ? data.password.toString() : "false"}</span>
              </div>
              <div className="game-card-container">
                <BsFilePersonFill className="icon-core-title m-2" />
                <span className="text-white text-[24px]">
                  {data?.numplayers}/{data?.maxplayers}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GameServer;
