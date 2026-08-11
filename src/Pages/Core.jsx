import PouwStats from "../components/stats/PouwStats";
import PouwLeaderboard from "../components/PouwLeaderboard";

const Core = () => {
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
