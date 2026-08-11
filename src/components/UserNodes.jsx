import { useContext } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { layout } from "../style";
import DataContext from "../context/DataContext";

const UserNodes = (props) => {
  const { userNodeCount, setTotalCard, setCumulusCard, setNimbusCard, setStratusCard } = useContext(DataContext);
  const { totalCard, cumulusCard, nimbusCard, stratusCard } = useContext(DataContext);

  return (
    <div className="mr-10 flex w-full flex-wrap justify-center items-center p-[2px] mt-5">
      <SkeletonTheme baseColor="#14101d" highlightColor="#444" width={200} height={36} count={1} duration={2}>
        <div className={`ml-2 mr-2 mb-2 ${totalCard ? "user-node-selected" : "user-node"} md:w-[250px] w-[280px] cursor-pointer`} onClick={() => setTotalCard((prev) => !prev)}>
          <div className={`${layout.statBox} text-total text-[24px]`}>Total</div>
          <div className={`${layout.statBox} w-full h-full text-white text-[36px]`}>{userNodeCount || <Skeleton />}</div>
        </div>

        <div
          className={`ml-2 mr-2 mb-2 ${cumulusCard ? "user-node-selected" : "user-node"}  md:w-[250px] w-[280px] cursor-pointer`}
          onClick={() => setCumulusCard((prev) => !prev)}
        >
          <div className={`${layout.statBox} text-confirmed text-[24px]`}>Cumulus</div>
          <div className={`${layout.statBox} text-white text-[36px]`}>{props.userCumulus}</div>
        </div>

        <div className={`ml-2 mr-2 mb-2 ${nimbusCard ? "user-node-selected" : "user-node"} md:w-[250px] w-[280px] cursor-pointer`} onClick={() => setNimbusCard((prev) => !prev)}>
          <div className={`${layout.statBox} text-nimbus text-[24px]`}>Nimbus</div>
          <div className={`${layout.statBox} text-white text-[36px]`}>{props.userNimbus}</div>
        </div>

        <div className={`ml-2 mr-2 mb-2 ${stratusCard ? "user-node-selected" : "user-node"} md:w-[250px] w-[280px] cursor-pointer`} onClick={() => setStratusCard((prev) => !prev)}>
          <div className={`${layout.statBox} text-stratus text-[24px]`}>Stratus</div>
          <div className={`${layout.statBox} text-white text-[36px]`}>{props.userStratus}</div>
        </div>

        {/* <div className='ml-2 mr-2 mb-2 nav-bar md:w-[250px] w-[280px]'>
                    <div className={`${layout.statBox} text-white text-[24px]`}>
                        Confirmed
                    </div>
                    <div className={`${layout.statBox} text-white text-[36px]`}>
                        {nodeConfirmed}
                    </div>
                </div> */}
      </SkeletonTheme>
    </div>
  );
};
export default UserNodes;
