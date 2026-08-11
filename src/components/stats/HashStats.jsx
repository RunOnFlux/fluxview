import { BsFileDiffFill, BsHexagon, BsSpeedometer } from "react-icons/bs";
import daemonAxios from "../../api/flux_daemon";
import useAxios from "../../hooks/useAxios";
import { layout } from "../../style";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Tooltip } from "react-tooltip";

const HashStats = () => {
  const [miningInfo] = useAxios({
    axiosInstance: daemonAxios,
    method: "GET",
    url: "getmininginfo",
    requstConfig: {
      headers: {
        "Content-Language": "en-US",
      },
    },
  });
  return (
    <div className="mr-10 flex w-full flex-wrap justify-center items-center p-[2px] mt-2">
      <SkeletonTheme baseColor="#14101d" highlightColor="#444" width={200} height={36} count={1} duration={2}>
        <div className="ml-2 mr-2 mb-2 flex flex-col flex-wrap">
          <div className="flex flex-row justify-center">
            <span className="text-mining" style={{ fontSize: "40px" }}>
              MINING
            </span>
          </div>
          <div className="flex flex-row flex-wrap justify-center mining-tool-tip">
            <div className="m-2 stat-box md:w-[250px] w-[280px]">
              <div className={`${layout.statBox} mt-2 text-mining text-[36px]`} data-tooltip-id="height" data-tooltip-content="BLOCK HEIGHT">
                <BsHexagon />
                <Tooltip id="height" className="tool-tip-mining" />
              </div>
              <div className={`${layout.statBox} text-white text-[36px]`}>{miningInfo?.data?.blocks || <Skeleton />}</div>
            </div>

            <div className="m-2 stat-box md:w-[250px] w-[280px]">
              <div className={`${layout.statBox} mt-2 text-mining text-[36px]`} data-tooltip-id="diff" data-tooltip-content="DIFFICULTY">
                <BsFileDiffFill />
                <Tooltip id="diff" className="tool-tip-mining" />
              </div>
              <div className={`${layout.statBox} text-white text-[36px]`}>{miningInfo?.data?.difficulty ? `${miningInfo?.data?.difficulty}`.split(".")[0] : <Skeleton />}</div>
            </div>

            <div className="m-2 stat-box md:w-[250px] w-[280px]">
              <div className={`${layout.statBox} mt-2 text-mining text-[36px]`} data-tooltip-id="hashrate" data-tooltip-content="HASHRATE">
                <BsSpeedometer />
                <Tooltip id="hashrate" className="tool-tip-mining" />
              </div>
              <div className={`${layout.statBox} text-white text-[36px]`}>
                {miningInfo?.data?.networkhashps ? (miningInfo?.data?.networkhashps / 1000000)?.toFixed(2).concat(" MSol") : <Skeleton />}
              </div>
            </div>
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default HashStats;
