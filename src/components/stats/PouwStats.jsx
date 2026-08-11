import { BsCpu, BsGpuCard, BsMemory, BsPc } from "react-icons/bs";
import { GrMemory } from "react-icons/gr";
import flux_core from "../../api/flux_core";
import { flux_edge } from "@/assets";
import useAxios from "../../hooks/useAxios";
import { layout } from "../../style";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// the meaning used to live in a tooltip only, which said nothing on touch
const stats = [
  { key: "TotalMachine", label: "Machines", Icon: BsPc },
  { key: "TotalGPU", label: "GPUs", Icon: BsGpuCard },
  { key: "TotalVRAM", label: "VRAM (GB)", Icon: GrMemory },
  { key: "TotalRAM", label: "RAM (GB)", Icon: BsMemory },
  { key: "TotalCore", label: "CPU Cores", Icon: BsCpu },
];

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
          <h2 className="flex flex-row justify-center">
            <img src={flux_edge} alt="FluxEdge" className="h-[60px]" />
          </h2>
          <div className="flex flex-row flex-wrap justify-center">
            {stats.map(({ key, label, Icon }) => (
              <div key={key} className="m-2 stat-box md:w-[250px] w-[280px]">
                <div className={`${layout.statBox} mt-2 text-core text-[28px]`}>
                  <Icon aria-hidden="true" />
                </div>
                <div className={`${layout.statBox} text-core text-[20px]`}>{label}</div>
                <div className={`${layout.statBox} text-white text-[36px]`}>{fluxCoreInfo?.[key] || <Skeleton />}</div>
              </div>
            ))}
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default PouwStats;
