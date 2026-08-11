import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import FeatureCardList from "./FeatureCardList";
import { BsGpuCard, BsCpu, BsMemory, BsDeviceSsd, BsPersonBadge, BsAward, BsXDiamond, BsRobot, BsWrench, BsGlobe } from "react-icons/bs";
import { SiBlender, SiOpengl } from "react-icons/si";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Tooltip } from "react-tooltip";

const substringsToFilterOut = ["uhd", "hd", "microsoft", "unknown", "integrated", "xe", "display"];

const validRegions = ["ALL", "ASIA", "AFRICA", "NORTH AMERICA", "SOUTH AMERICA", "EUROPE", "AUSTRALIA"];

function ParseRegions({ list }) {
  return list?.map((region, index) => (
    <option className="bg-slate-800" key={index} value={index > 4 ? index : index - 1}>
      {region}
    </option>
  ));
}

function ParseGPUList({ list }) {
  return (
    <>
      <option className="bg-slate-800" key="ANY" value="ANY">
        ANY
      </option>
      {list?.map(
        (gpu, index) =>
          gpu && (
            <option className="bg-slate-800" key={index} value={gpu}>
              {gpu}
            </option>
          )
      )}
    </>
  );
}

const PouwLeaderboard = () => {
  const [benchmarkType, setBenchmarkType] = useState("Overall");
  const [fluxCoreLeaderboard, setfluxCoreLeaderboard] = useState([]);
  const [computerName, setComputerName] = useState("");
  const [gpuFilter, setGpuFilter] = useState("ANY");
  const [regionFilter, setRegionFilter] = useState(-1);
  const [search, setSearch] = useState(false);
  const [gpuList, setgpuList] = useState([]);
  // a ficha completa de cada maquina deixava a pagina com 8600px; passa a abrir por clique
  const [expanded, setExpanded] = useState(null);
  const inputRef = useRef(null);
  const gpuSelected = useRef(null);
  const regionSelected = useRef(null);

  const processClick = (type) => {
    setBenchmarkType(type);
    console.log(`Benchmark Filter ${type ?? "n/a"}`);
  };

  const updateRegionFilter = (region) => {
    console.log(region);
    setRegionFilter(region.current.value);
  };

  const updateGpuFilter = (gpuType) => {
    setGpuFilter(gpuType.current.value ?? "ANY");
    console.log(`GPU Filter ${gpuType.current.value ?? "n/a"}`);
  };

  async function machineSearch(value) {
    setComputerName(value.current.value ?? "");
  }

  function inputChange(value) {
    if (value.current.value.length >= 3) setSearch(true);
    else setSearch(false);
  }

  useEffect(() => {
    async function getCoreGPUs() {
      try {
        const getGPUs = await axios.get("https://service.fluxcore.ai/api/getGPUs");
        const filteredArray = getGPUs.data.map((item) => {
          if (substringsToFilterOut.some((substring) => item.model.toLowerCase().includes(substring))) return null;
          return item.model.toUpperCase();
        });
        setgpuList(filteredArray ?? []);
      } catch (error) {
        console.log(error.message ?? JSON.stringify(error));
      }
    }
    getCoreGPUs();
  }, []);

  useEffect(() => {
    async function updateStats() {
      try {
        console.log(regionFilter);
        let buildQuery = "https://service.fluxcore.ai/api/getLeaderBoard?";

        if (computerName.length >= 3) {
          buildQuery = buildQuery.concat(`computer_name=${computerName}`);
        } else {
          buildQuery = buildQuery.concat(`limit=10`);
        }

        if (benchmarkType != "Overall") buildQuery = buildQuery.concat(`&bench=${benchmarkType.toLowerCase()}`);

        if (gpuFilter != "" && gpuFilter != "ANY") buildQuery = buildQuery.concat(`&gpu=${gpuFilter}`);

        if (regionFilter != -1 && regionFilter != "") buildQuery = buildQuery.concat(`&region=${regionFilter}`);

        const leaderStats = await axios.get(buildQuery, { "Content-Type": "application/json", Accept: "application/json" });
        setfluxCoreLeaderboard(leaderStats.data ?? []);
        console.log(leaderStats);
      } catch (error) {
        setfluxCoreLeaderboard([]);
        console.log(error.message ?? JSON.stringify(error));
      }
    }
    updateStats();
  }, [benchmarkType, computerName, gpuFilter, regionFilter]);
  return (
    <div className="ml-10 mr-10 mb-16">
      <div className="p-2 flex justify-around bg-slate-800 rounded-2xl core-tool-tip">
        <div data-tooltip-id="overall" data-tooltip-content="Overall Benchmarks">
          <BsWrench className={benchmarkType == "Overall" ? "icon-core-nav-selected" : "icon-core-nav"} onClick={() => processClick("Overall")} />
          <Tooltip id="overall" className="tool-tip-core-icon" />
        </div>
        <div data-tooltip-id="ai" data-tooltip-content="AI Benchmarks">
          <BsRobot className={benchmarkType == "AI" ? "icon-core-nav-selected" : "icon-core-nav"} onClick={() => processClick("AI")} />
          <Tooltip id="ai" className="tool-tip-core-icon" />
        </div>
        <div data-tooltip-id="blender" data-tooltip-content="Blender Benchmarks">
          <SiBlender className={benchmarkType == "Blender" ? "icon-core-nav-selected" : "icon-core-nav"} onClick={() => processClick("Blender")} />
          <Tooltip id="blender" className="tool-tip-core-icon" />
        </div>
        <div data-tooltip-id="glmark" data-tooltip-content="GLmark2 Benchmarks">
          <SiOpengl className={benchmarkType == "GLmark2" ? "icon-core-nav-selected" : "icon-core-nav"} onClick={() => processClick("GLmark2")} />
          <Tooltip id="glmark" className="tool-tip-core-icon" />
        </div>
      </div>
      <h1 className="flex flex-wrap text-white text-[40px] justify-center">
        {computerName.length < 3 ? `Top 10 ${benchmarkType} ${computerName} Benchmarks` : `${benchmarkType} ${computerName} Benchmarks`}
      </h1>
      <div className="p-1 flex flex-wrap text-black text-[40px] justify-start">
        <label htmlFor="computerName" className="sr-only">
          Machine name
        </label>
        <input
          ref={inputRef}
          type="text"
          id="computerName"
          name="computerName"
          onChange={() => inputChange(inputRef)}
          placeholder="Filter by machine name..."
          className="focus-ring py-2 px-2 rounded-[10px] bg-[#14101d] border border-white/20 text-white placeholder:text-dimWhite mr-2 mb-5 font-poppins font-medium xs:text-[14px] ss:text-[16px] md:text-[18px] mm:w-8/12 max-w-md"
        />
        <button
          type="submit"
          style={{ width: "250px" }}
          className={`focus-ring py-2 px-2 ${search ? "bg-blue-gradient" : "search-disable cursor-default"} font-poppins mb-5 font-medium text-[18px] text-white rounded-[10px]`}
          onClick={async () => {
            await machineSearch(inputRef);
          }}
        >
          {search ? "Search Name" : "Enter Name"}
        </button>
        <div className="flex flex-row flex-wrap stat-box py-2 px-2 mb-5 ml-2 justify-start">
          <BsGpuCard className="text-core mr-5" />
          <select ref={gpuSelected} className="text-white rounded-xl font-poppins stat-box text-[18px] w-52" onChange={() => updateGpuFilter(gpuSelected)}>
            <ParseGPUList list={gpuList} />
          </select>
        </div>
        <div className="flex flex-row flex-wrap stat-box py-2 px-2 mb-5 ml-2 justify-start">
          <BsGlobe className="text-core mr-5" />
          <select ref={regionSelected} className="text-white rounded-xl font-poppins stat-box text-[18px] w-52" onChange={() => updateRegionFilter(regionSelected)}>
            <ParseRegions list={validRegions} />
          </select>
        </div>
      </div>
      {fluxCoreLeaderboard?.map((item, index) => {
        return (
          <div key={item.ComputerID} className="mr-10 rounded-2xl flex w-full flex-wrap justify-center items-center p-[2px] mb-10 bg-slate-800">
            <SkeletonTheme baseColor="#14101d" highlightColor="#444" width={200} height={36} count={1} duration={2}>
              <div className="ml-2 mr-2 mb-2 flex flex-col flex-wrap w-full">
                <button
                  type="button"
                  aria-expanded={expanded === item.ComputerID}
                  onClick={() => setExpanded((prev) => (prev === item.ComputerID ? null : item.ComputerID))}
                  className="focus-ring w-full flex flex-wrap justify-around items-center rounded-xl py-1"
                >
                  <div className="flex">
                    <BsAward className="icon-core-title" />
                    <span className="text-core text-[32px]">{`${index + 1 || <Skeleton />}`}</span>
                  </div>
                  <div className="flex">
                    <BsPersonBadge className="icon-core-title" />
                    <span className="text-core text-[32px]">{`${item.Computer.Name || <Skeleton />}`}</span>
                  </div>
                  <div className="flex">
                    <BsXDiamond className="icon-core-title" />
                    <span className="text-core text-[32px]">{`${
                      benchmarkType == "Overall"
                        ? item.Score.toFixed(0)
                        : benchmarkType == "AI" || benchmarkType == "Blender" || benchmarkType == "GLmark2"
                          ? item?.BenchmarkScore?.toFixed(0)
                          : "n/a" || <Skeleton />
                    }`}</span>
                  </div>
                  <span className="text-dimWhite text-[16px] font-poppins">{expanded === item.ComputerID ? "hide specs" : "show specs"}</span>
                </button>
                {expanded === item.ComputerID && (
                  <>
                    <hr className="m-2 p-1" />
                    <div className="flex flex-col flex-wrap w-full pr-4">
                      <div className="icon-core-card">
                        <BsCpu />
                      </div>
                      {item?.Computer?.cpus?.map((cpu, index) => {
                        return (
                          <div key={index} className="feature-card-core">
                            <FeatureCardList
                              features={[
                                {
                                  title: "Model",
                                  content: cpu?.model ?? "N/A",
                                },
                                {
                                  title: "Cores",
                                  content: cpu?.num_cores ?? "N/A",
                                },
                                {
                                  title: "Threads",
                                  content: cpu?.num_threads ?? "N/A",
                                },
                                {
                                  title: "Frequency",
                                  content: cpu?.frequency ?? "N/A",
                                },
                              ]}
                            />
                          </div>
                        );
                      })}
                      <div className="icon-core-card">
                        <BsGpuCard />
                      </div>
                      {item?.Computer?.gpus?.map((gpu, index) => {
                        return (
                          <div key={index} className="feature-card-core">
                            <FeatureCardList
                              features={[
                                {
                                  title: "GPU",
                                  content: gpu.model ?? "N/A",
                                },
                                {
                                  title: "vram",
                                  content: gpu.vram ?? "N/A",
                                },
                                {
                                  title: "Core Clock",
                                  content: gpu.core_clock ?? "N/A",
                                },
                                {
                                  title: "Memory Clock",
                                  content: gpu.memory_clock ?? "N/A",
                                },
                              ]}
                            />
                          </div>
                        );
                      })}
                      <div className="icon-core-card">
                        <BsMemory />
                      </div>
                      {item?.Computer?.rams?.map((ram, index) => {
                        return (
                          <div key={index} className="feature-card-core">
                            <FeatureCardList
                              features={[
                                {
                                  title: "Model",
                                  content: ram.model ?? "N/A",
                                },
                                {
                                  title: "Brand",
                                  content: ram.manufacturer ?? "N/A",
                                },
                                {
                                  title: "Size",
                                  content: ram.capacity ?? "N/A",
                                },
                                {
                                  title: "Speed",
                                  content: ram.max_speed ?? "N/A",
                                },
                              ]}
                            />
                          </div>
                        );
                      })}
                      <div className="icon-core-card">
                        <BsDeviceSsd />
                      </div>
                      {item?.Computer?.storages?.map((storage, index) => {
                        return (
                          <div key={index} className="feature-card-core">
                            <FeatureCardList
                              features={[
                                {
                                  title: "Storage Model",
                                  content: storage.model ?? "N/A",
                                },
                                {
                                  title: "Size",
                                  content: `${storage.capacity} GB` ?? "N/A",
                                },
                                {
                                  title: "Free",
                                  content: `${storage.free} GB` ?? "N/A",
                                },
                              ]}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </SkeletonTheme>
          </div>
        );
      })}
    </div>
  );
};

export default PouwLeaderboard;
