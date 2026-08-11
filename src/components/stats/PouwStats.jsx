import { BsCpu, BsGpuCard, BsMemory, BsPc } from "react-icons/bs";
import { GrMemory } from "react-icons/gr";
import flux_core from "../../api/flux_core";
import { flux_edge } from "@/assets";
import useAxios from "../../hooks/useAxios";
import { layout } from "../../style";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Tooltip } from "react-tooltip";

const PouwStats = () => {
  const [fluxCoreInfo] = useAxios({
    axiosInstance: flux_core,
    method: "GET",
    url: "getLeaderBoardStats",
    requestConfig: {
      headers: {
        "Content-Language": "en-US",
      },
    },
  });
  return (
    <div className="mr-10 flex w-full flex-wrap justify-center items-center p-[2px] mt-2">
      <SkeletonTheme baseColor="#14101d" highlightColor="#444" width={200} height={36} count={1} duration={2}>
        <div className="ml-2 mr-2 mb-2 flex flex-col flex-wrap core-tool-tip">
          <div className="flex flex-row justify-center">
            <img src={flux_edge} className="h-[60px]" />
          </div>
          <div className="flex flex-row flex-wrap justify-center">
            <div className="m-2 stat-box md:w-[250px] w-[280px]">
              <div className={`${layout.statBox} mt-2 text-core text-[36px]`} data-tooltip-id="pcs" data-tooltip-content="MACHINE COUNT">
                <BsPc />
                <Tooltip id="pcs" className="tool-tip-core" />
              </div>
              <div className={`${layout.statBox} text-white text-[36px]`}>{fluxCoreInfo?.TotalMachine || <Skeleton />}</div>
            </div>

            <div className="m-2 stat-box md:w-[250px] w-[280px]">
              <div className={`${layout.statBox} mt-2 text-core text-[36px]`} data-tooltip-id="gpus" data-tooltip-content="GPU COUNT">
                <BsGpuCard />
                <Tooltip id="gpus" className="tool-tip-core" />
              </div>
              <div className={`${layout.statBox} text-white text-[36px]`}>{fluxCoreInfo?.TotalGPU || <Skeleton />}</div>
            </div>

            <div className="m-2 stat-box md:w-[250px] w-[280px]">
              <div className={`${layout.statBox} mt-2 text-core text-[36px]`} data-tooltip-id="vram" data-tooltip-content="VRAM-GB">
                <GrMemory />
                <Tooltip id="vram" className="tool-tip-core" />
              </div>
              <div className={`${layout.statBox} text-white text-[36px]`}>{fluxCoreInfo?.TotalVRAM || <Skeleton />}</div>
            </div>

            <div className="m-2 stat-box md:w-[250px] w-[280px]">
              <div className={`${layout.statBox} mt-2 text-core text-[36px]`} data-tooltip-id="ram" data-tooltip-content="RAM-GB">
                <BsMemory />
                <Tooltip id="ram" className="tool-tip-core" />
              </div>
              <div className={`${layout.statBox} text-white text-[36px]`}>{fluxCoreInfo?.TotalRAM || <Skeleton />}</div>
            </div>

            <div className="m-2 stat-box md:w-[250px] w-[280px]">
              <div className={`${layout.statBox} mt-2 text-core text-[36px]`} data-tooltip-id="cores" data-tooltip-content="CPU CORES">
                <BsCpu />
                <Tooltip id="cores" className="tool-tip-core" />
              </div>
              <div className={`${layout.statBox} text-white text-[36px]`}>{fluxCoreInfo?.TotalCore || <Skeleton />}</div>
            </div>
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default PouwStats;
