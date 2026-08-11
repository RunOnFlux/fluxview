import { useContext } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { layout } from "../style";
import DataContext from "../context/DataContext";

const TierFilter = ({ label, labelColor, value, active, onToggle }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onToggle}
    className={`focus-ring ml-2 mr-2 mb-2 ${active ? "user-node-selected" : "user-node"} md:w-[250px] w-[280px] cursor-pointer`}
  >
    <div className={`${layout.statBox} ${labelColor} text-[24px]`}>{label}</div>
    <div className={`${layout.statBox} w-full h-full text-white text-[36px]`}>{value}</div>
  </button>
);

const UserNodes = (props) => {
  const { userNodeCount, setTotalCard, setCumulusCard, setNimbusCard, setStratusCard } = useContext(DataContext);
  const { totalCard, cumulusCard, nimbusCard, stratusCard } = useContext(DataContext);

  return (
    <div className="mt-5">
      {/* the network-wide totals at the top of the page look exactly the same,
          so say whose numbers these are and that they filter the list */}
      <h2 className={`${layout.statBox} text-dimWhite text-[16px] font-poppins`}>Your nodes — select a tier to filter the list below</h2>
      <div className="mr-10 flex w-full flex-wrap justify-center items-center p-[2px]">
        <SkeletonTheme baseColor="#14101d" highlightColor="#444" width={200} height={36} count={1} duration={2}>
          <TierFilter label="Total" labelColor="text-total" value={userNodeCount || <Skeleton />} active={totalCard} onToggle={() => setTotalCard((prev) => !prev)} />
          <TierFilter label="Cumulus" labelColor="text-confirmed" value={props.userCumulus} active={cumulusCard} onToggle={() => setCumulusCard((prev) => !prev)} />
          <TierFilter label="Nimbus" labelColor="text-nimbus" value={props.userNimbus} active={nimbusCard} onToggle={() => setNimbusCard((prev) => !prev)} />
          <TierFilter label="Stratus" labelColor="text-stratus" value={props.userStratus} active={stratusCard} onToggle={() => setStratusCard((prev) => !prev)} />
        </SkeletonTheme>
      </div>
    </div>
  );
};
export default UserNodes;
