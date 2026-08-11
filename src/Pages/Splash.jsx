import NodeStats from "../components/stats/NodeStats";
import PouwStats from "../components/stats/PouwStats";
import usePageTitle from "../hooks/usePageTitle";

const Splash = () => {
  usePageTitle("Flux network overview");

  return (
    <div className="pb-10">
      <h1 className="sr-only">Flux network overview</h1>
      <NodeStats />
      <PouwStats />
    </div>
  );
};

export default Splash;
