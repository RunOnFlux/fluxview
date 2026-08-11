import { useRef, useEffect, useState, useContext, useCallback, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
import { layout } from "../style";
import { UserNodes, NodeStats, FluxGetNodeListFunc } from "../components";
import DataContext from "../context/DataContext";
import ReactSwitch from "react-switch";
import { AddressDialog } from "../components/util/AddressDialog";

const Button = (props) => {
  const { nodeWallet, setNodeWallet } = useContext(DataContext);
  const { userNodeCount, setUserNodeCount } = useContext(DataContext);
  const { setNodeConfirmed } = useContext(DataContext);
  const { useZel, setUseZel } = useContext(DataContext);
  const { nodePrivacy, setNodePrivacy } = useContext(DataContext);
  const { nodeApps, setNodeApps } = useContext(DataContext);

  const navigate = useNavigate();
  const { userId } = useParams();
  const inputRef = useRef(null);

  const [showResults, setShowResults] = useState(false);

  // Consolidated node tier stats
  const [nodeTierStats, setNodeTierStats] = useState({
    cumulus: 0,
    nimbus: 0,
    stratus: 0,
  });

  // Memoize button text
  const buttonText = useMemo(() => {
    if (showResults) return "CLEAR RESULTS";
    return useZel ? "SEARCH NODE ZELID" : "SEARCH NODE WALLETS";
  }, [showResults, useZel]);

  // Handle search/clear action
  const handleSearch = useCallback(() => {
    const inputValue = inputRef.current?.value;

    if (!inputValue) {
      setShowResults(false);
      navigate("");
      return;
    }

    if (showResults) {
      // Clear results
      setShowResults(false);
      setNodeWallet(inputValue);
      setUserNodeCount(0);
      setNodeTierStats({ cumulus: 0, nimbus: 0, stratus: 0 });
      setNodeConfirmed(0);
      navigate("");
    } else {
      // Show results
      setNodeWallet(inputValue);
      setUserNodeCount(0);
      setNodeTierStats({ cumulus: 0, nimbus: 0, stratus: 0 });
      setNodeConfirmed(0);

      // Update URL if different from current
      if (userId !== inputValue) {
        navigate(inputValue);
      }

      setShowResults(true);
    }
  }, [showResults, userId, navigate, setNodeWallet, setUserNodeCount, setNodeConfirmed]);

  // Handle ZelID toggle
  const handleZelIdChange = useCallback(
    (val) => {
      if (!showResults) {
        setUseZel(val);
      }
    },
    [showResults, setUseZel]
  );

  // Initialize from URL or context
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = userId || nodeWallet;
    }
  }, [userId, nodeWallet]);

  // Node tier stat update callbacks - using useCallback for stable references
  const handleSetUserCumulus = useCallback((value) => {
    setNodeTierStats((prev) => ({ ...prev, cumulus: value }));
  }, []);

  const handleSetUserNimbus = useCallback((value) => {
    setNodeTierStats((prev) => ({ ...prev, nimbus: value }));
  }, []);

  const handleSetUserStratus = useCallback((value) => {
    setNodeTierStats((prev) => ({ ...prev, stratus: value }));
  }, []);

  return (
    <div id="nodes" className="mb-12">
      <NodeStats />
      <div className="flex flex-auto flex-wrap flex-row">
        <input
          hidden={nodePrivacy}
          ref={inputRef}
          defaultValue={userId || nodeWallet}
          type="text"
          id="wallet"
          name="wallet"
          placeholder={useZel ? "Enter ZelID..." : "Enter wallet address..."}
          className="py-2 px-2 ml-5 mr-2 mb-5 font-poppins font-medium xs:text-[14px] ss:text-[16px] md:text-[18px] mm:w-8/12 max-w-md"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <div className="flex flex-wrap">
          <AddressDialog />
          <button
            type="submit"
            style={{ width: "250px" }}
            className={`py-2 px-2 bg-blue-gradient font-poppins ml-4 mb-5 font-medium text-[18px] text-white outline-none ${props.styles} rounded-[10px]`}
            onClick={handleSearch}
          >
            {buttonText}
          </button>
        </div>

        <div className="flex flex-wrap">
          <label className="flex w-20 flex-col ml-2 mr-2 mb-5">
            <span className="flex justify-center font-poppins ml-2 mr-2 font-medium text-[18px] text-white">ZelID</span>
            <div className="flex justify-center">
              <ReactSwitch checked={useZel} onChange={handleZelIdChange} disabled={showResults} />
            </div>
          </label>

          <label className="flex w-20 flex-col ml-2 mr-2 mb-5">
            <span className="flex justify-center font-poppins ml-2 mr-2 font-medium text-[18px] text-white">Privacy</span>
            <div className="flex justify-center">
              <ReactSwitch checked={nodePrivacy} onChange={() => setNodePrivacy((prev) => !prev)} />
            </div>
          </label>

          <label className="flex w-20 flex-col ml-2 mr-2 mb-5">
            <span className="flex justify-center font-poppins ml-2 mr-2 font-medium text-[18px] text-white">Apps</span>
            <div className="flex justify-center">
              <ReactSwitch checked={nodeApps} onChange={() => setNodeApps((prev) => !prev)} />
            </div>
          </label>
        </div>
      </div>

      <div className={`${layout.statBox} nav-bar text-headers mm:text-[30px] xs:text-[40px] ss:text-[44px] sm:text-[48px] md:text-[52px] leading-[60px] ml-5 mr-5 mb-2`}>
        FLUX NODE LIST
      </div>

      {showResults && userNodeCount > 0 && <UserNodes userNimbus={nodeTierStats.nimbus} userCumulus={nodeTierStats.cumulus} userStratus={nodeTierStats.stratus} />}

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {showResults && (
        <div>
          <FluxGetNodeListFunc setUserCumulus={handleSetUserCumulus} setUserNimbus={handleSetUserNimbus} setUserStratus={handleSetUserStratus} />
        </div>
      )}
    </div>
  );
};

export default Button;
