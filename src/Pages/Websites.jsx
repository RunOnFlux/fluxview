import DedicatedSites from "../components/stats/DedicatedSites";
import usePageTitle from "../hooks/usePageTitle";

const Websites = () => {
  usePageTitle("Dedicated Websites");

  return <DedicatedSites />;
};

export default Websites;
