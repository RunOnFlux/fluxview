import PouwStats from "../components/stats/PouwStats";
import PouwLeaderboard from "../components/PouwLeaderboard";
import usePageTitle from "../hooks/usePageTitle";

const Core = () => {
  usePageTitle("FluxEdge");

  return (
    <div>
      <div>
        <PouwStats />
      </div>
      <div>
        <PouwLeaderboard />
      </div>
    </div>
  );
};

export default Core;
