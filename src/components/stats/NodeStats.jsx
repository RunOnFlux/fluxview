import daemonAxios from "../../api/flux_daemon";
import useAxios from "../../hooks/useAxios";
import { layout } from "../../style";
import flux_stats from "../../api/flux_stats_api";
import { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Tooltip } from "react-tooltip";
import flux_api_apps from "../../api/flux_api_apps";
import { flux_nodes } from "@/assets";

import { CUMULUS_PERCENTAGE, NIMBUS_PERCENTAGE, STRATUS_PERCENTAGE } from "../../constants";

function convertMinutes(minutes) {
  let days = Math.floor(minutes / 1440);
  let hours = Math.floor((minutes % 1440) / 60);
  if (days === 0) {
    return `${hours} hr`;
  }
  if (hours === 0) {
    return `${days} day`;
  }
  return `${days} day ${hours} hr`;
}

function estReward(numberNodes, blockReward, rewardTime) {
  let perDay = ((blockReward * 2880) / numberNodes).toFixed(4);

  return `${(perDay * 2 * rewardTime).toFixed(2)} `;
}

const NodeStats = () => {
  const apiRef1 = "cumulus-enabled";
  const apiRef2 = "nimbus-enabled";
  const apiRef3 = "stratus-enabled";

  const [arcaneCount, setArcaneCount] = useState(0);

  // eslint-disable-next-line no-unused-vars
  const [nodeCount, nodeError] = useAxios({
    axiosInstance: daemonAxios,
    method: "GET",
    url: "getzelnodecount",
    requestConfig: {
      headers: {
        "Content-Language": "en-US",
      },
    },
  });

  const [arcaneNodes, arcaneError, arcaneLoading] = useAxios({
    axiosInstance: flux_stats,
    method: "GET",
    url: "fluxinfo?projection=flux",
    requestConfig: {
      headers: {
        "Content-Language": "en-US",
      },
    },
  });

  // eslint-disable-next-line no-unused-vars
  const [blockReward, rewardError, rewardLoading] = useAxios({
    axiosInstance: daemonAxios,
    method: "GET",
    url: "getblocksubsidy",
    requestConfig: {
      headers: {
        "Content-Language": "en-US",
      },
    },
  });

  useEffect(() => {
    if (arcaneNodes?.data && Array.isArray(arcaneNodes.data)) {
      const count = arcaneNodes.data.filter((item) => item.flux?.arcaneVersion !== undefined).length;
      setArcaneCount(count);
    }
  }, [arcaneNodes?.data]);

  // derived during render: as locals reassigned inside an effect these never
  // reached the tooltips, which always showed the hardcoded fallbacks
  const minerSubsidy = blockReward?.data?.miner;
  const cumulusReward = minerSubsidy ? minerSubsidy * CUMULUS_PERCENTAGE : 1;
  const nimbusReward = minerSubsidy ? minerSubsidy * NIMBUS_PERCENTAGE : 3.5;
  const stratusReward = minerSubsidy ? minerSubsidy * STRATUS_PERCENTAGE : 9;

  return (
    <div className="mr-10 flex w-full flex-wrap justify-center items-center p-[2px] mt-2 node-tool-tip">
      <SkeletonTheme baseColor="#14101d" highlightColor="#444" width={200} height={36} count={1} duration={2}>
        <div className="ml-2 mr-2 mb-2 flex flex-col flex-wrap">
          <h2 className="flex flex-row justify-center mb-2">
            <img src={flux_nodes} alt="Flux Nodes" className="h-[60px]" />
          </h2>
          <div className="flex flex-row flex-wrap justify-center">
            <div className="ml-2 mr-2 mb-2 stat-box md:w-[250px] w-[280px]">
              <div className={`${layout.statBox} text-total text-[24px]`}>Total</div>
              <div className={`${layout.statBox} w-full h-full text-white text-[36px]`} data-tooltip-id="nodeCountTooltip" data-tooltip-variant="info">
                <Tooltip id="nodeCountTooltip" delayShow={500} place="bottom" className="tool-tip-extended">
                  <span>total nodes confirmed on the network</span>
                </Tooltip>
                {nodeCount?.data?.total || <Skeleton />}
              </div>
            </div>

            <div className="ml-2 mr-2 mb-2 stat-box md:w-[250px] w-[280px]">
              <div className={`${layout.statBox} text-confirmed text-[24px]`}>Cumulus</div>
              <div className={`${layout.statBox} w-full h-full text-white text-[36px]`} data-tooltip-id="cumulusCountTooltip">
                <Tooltip id="cumulusCountTooltip" delayShow={500} place="bottom" className="tool-tip-extended">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>Pay Period: {nodeCount?.data?.[apiRef1] ? convertMinutes(nodeCount?.data?.[apiRef1] * 0.5) : nodeCount?.data?.[apiRef1]}</span>
                    <span>1D - {nodeCount?.data?.[apiRef1] ? estReward(nodeCount?.data?.[apiRef1], cumulusReward, 1) : {}}</span>
                    <span>7D - {nodeCount?.data?.[apiRef1] ? estReward(nodeCount?.data?.[apiRef1], cumulusReward, 7) : {}}</span>
                    <span>30D - {nodeCount?.data?.[apiRef1] ? estReward(nodeCount?.data?.[apiRef1], cumulusReward, 30) : {}}</span>
                  </div>
                </Tooltip>
                {nodeCount?.data?.[apiRef1] || <Skeleton />}
              </div>
            </div>

            <div className="ml-2 mr-2 mb-2 stat-box md:w-[250px] w-[280px]">
              <div className={`${layout.statBox} text-nimbus text-[24px]`}>Nimbus</div>
              <div className={`${layout.statBox} w-full h-full text-white text-[36px]`} data-tooltip-id="nimbusCountTooltip" data-tooltip-variant="dark">
                <Tooltip id="nimbusCountTooltip" delayShow={500} place="bottom" className="tool-tip-extended">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>Pay Period: {nodeCount?.data?.[apiRef2] ? convertMinutes(nodeCount?.data?.[apiRef2] * 0.5) : nodeCount?.data?.[apiRef2]}</span>
                    <span>1D - {nodeCount?.data?.[apiRef2] ? estReward(nodeCount?.data?.[apiRef2], nimbusReward, 1) : {}}</span>
                    <span>7D - {nodeCount?.data?.[apiRef2] ? estReward(nodeCount?.data?.[apiRef2], nimbusReward, 7) : {}}</span>
                    <span>30D - {nodeCount?.data?.[apiRef2] ? estReward(nodeCount?.data?.[apiRef2], nimbusReward, 30) : {}}</span>
                  </div>
                </Tooltip>
                {nodeCount?.data?.[apiRef2] || <Skeleton />}
              </div>
            </div>

            <div className="ml-2 mr-2 mb-2 stat-box md:w-[250px] w-[280px]">
              <div className={`${layout.statBox} text-stratus text-[24px]`}>Stratus</div>
              <div className={`${layout.statBox} w-full h-full text-white text-[36px]`} data-tooltip-id="stratusCountTooltip">
                <Tooltip id="stratusCountTooltip" delayShow={500} place="bottom" className="tool-tip-extended">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>Pay Period: {nodeCount?.data?.[apiRef3] ? convertMinutes(nodeCount?.data?.[apiRef3] * 0.5) : nodeCount?.data?.[apiRef3]}</span>
                    <span>1D - {nodeCount?.data?.[apiRef3] ? estReward(nodeCount?.data?.[apiRef3], stratusReward, 1) : {}}</span>
                    <span>7D - {nodeCount?.data?.[apiRef3] ? estReward(nodeCount?.data?.[apiRef3], stratusReward, 7) : {}}</span>
                    <span>30D - {nodeCount?.data?.[apiRef3] ? estReward(nodeCount?.data?.[apiRef3], stratusReward, 30) : {}}</span>
                  </div>
                </Tooltip>
                {nodeCount?.data?.[apiRef3] || <Skeleton />}
              </div>
            </div>

            <div className="ml-2 mr-2 mb-2 stat-box md:w-[250px] w-[280px]">
              <div className={`${layout.statBox} text-enterprise text-[24px]`}>Arcane Nodes</div>
              <div className={`${layout.statBox} w-full h-full text-white text-[36px]`}>{`${arcaneCount}` || <Skeleton />}</div>
            </div>
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default NodeStats;
