import NodeStats from "../components/stats/NodeStats";
import PouwStats from "../components/stats/PouwStats";

const Splash = () => {
  return (
    <div className="pb-10">
      <NodeStats />
      <PouwStats />
    </div>
  );
};

export default Splash;
