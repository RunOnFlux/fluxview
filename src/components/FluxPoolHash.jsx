import useAxios from "../hooks/useAxios";
import FluxMinerHash from "../api/flux_miner_hash";
import FeatureHash from "./FeatureHash";
import FluxMinerPA from "../api/flux_miner_pa";
import FluxMiningInfo from "../api/flux_explorer";

const FluxPoolHash = ({ wallet }) => {
  var apiError = "";

  const [hashresults, error, loading] = useAxios({
    axiosInstance: FluxMinerHash,
    method: "GET",
    url: wallet,
    requestConfig: {
      headers: {
        "Content-Language": "en-US",
      },
    },
  });

  const [balanceresults, balerror, balloading] = useAxios({
    axiosInstance: FluxMinerHash,
    method: "GET",
    url: "balances/".concat(wallet),
    requestConfig: {
      headers: {
        "Content-Language": "en-US",
      },
    },
  });

  const [hash_history, historyerror, historyloading] = useAxios({
    axiosInstance: FluxMinerHash,
    method: "GET",
    url: "graph/".concat(wallet).concat(`/86400`),
    requestConfig: {
      headers: {
        "Content-Language": "en-US",
      },
    },
  });

  const [balancePA, balancePAerror, balancePAloading] = useAxios({
    axiosInstance: FluxMinerPA,
    method: "GET",
    url: "payments/".concat(wallet),
    requestConfig: {
      headers: {
        "Content-Language": "en-US",
      },
    },
  });

  const [mining, miningerror, miningloading] = useAxios({
    axiosInstance: FluxMiningInfo,
    method: "GET",
    url: "status?q=getMiningInfo",
    requestConfig: {
      headers: {
        "Content-Language": "en-US",
      },
    },
  });

  if (
    (!loading && !balancePAloading && !miningloading && !historyloading && !balloading && !mining?.miningInfo) ||
    hashresults?.error == "No miner data" ||
    !balanceresults?.immature ||
    !hash_history?.stats ||
    !balancePA?.total
  ) {
    apiError = "API RESPONSE INCOMPLETE";
  } else if (error || miningerror || balancePAerror || historyerror || balerror) {
    apiError = "API ERROR RESPONSE RECEIVED";
  } else {
    apiError = "";
  }

  return (
    <div>
      <article>
        {loading && (
          <div className="flex flex-col">
            <div className={`flex flex-row p-1 ml-5 mr-5 rounded-[20px] mb-2 feature-card`}>{<h2 className="font-poppins text-white">LOADING ...</h2>}</div>
          </div>
        )}

        {apiError != "" && (
          <div className="flex flex-col">
            <div className={`flex flex-row p-1 ml-5 mr-5 rounded-lg mb-2 feature-card`}>{<h2 className="font-poppins text-white">{apiError}</h2>}</div>
          </div>
        )}

        {hashresults?.error === "No miner data" && (
          <div className="flex flex-col">
            <div className={`flex flex-row p-1 ml-5 mr-5 rounded-lg mb-2 feature-card`}>{<h2 className="font-poppins text-white">ERROR GATHERING RIG INFO ...</h2>}</div>
          </div>
        )}

        {hashresults && balanceresults && !error && !loading && !balloading && !balerror && hash_history && !historyloading && !historyerror && (
          <FeatureHash miner_results={hashresults?.miner} balance_results={balanceresults} hash_history={hash_history} balance_pa={balancePA} mining_info={mining} />
        )}
      </article>
    </div>
  );
};
export default FluxPoolHash;
