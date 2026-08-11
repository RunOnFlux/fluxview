import { useState, useRef, useEffect, useContext, useCallback, useMemo } from "react";
import FluxApps from "../components/FluxApps";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
import { layout } from "../style";
import { checkZel } from "../helpers/util";
import DataContext from "../context/DataContext";
import ReactSwitch from "react-switch";
import { flux_os } from "@/assets";
import usePageTitle from "../hooks/usePageTitle";

const ButtonApp = (props) => {
  usePageTitle("Apps");

  const { appZelID, setAppZelID } = useContext(DataContext);
  const { useName, setUseName } = useContext(DataContext);
  const navigate = useNavigate();
  const { userId } = useParams();
  const inputRef = useRef(null);

  // Consolidated stats state
  const [stats, setStats] = useState({
    totalApps: 0,
    userApps: 0,
    totalInstances: 0,
    totalRunning: 0,
  });

  const [showResults, setShowResults] = useState(false);

  // Memoize button text
  const buttonText = useMemo(() => {
    if (showResults) return "CLEAR RESULTS";
    return useName ? "SEARCH APP NAME" : "SEARCH APP ZELID";
  }, [showResults, useName]);

  // Validate input based on search mode
  const isValidInput = useCallback(
    (value) => {
      if (!value) return false;
      if (useName) {
        return value.length >= 2;
      }
      return checkZel(value);
    },
    [useName]
  );

  // Handle search/clear action
  const handleSearch = useCallback(() => {
    const inputValue = inputRef.current?.value;

    if (!inputValue) {
      setShowResults(false);
      return;
    }

    if (showResults) {
      // Clear results
      setShowResults(false);
      setStats({
        totalApps: 0,
        userApps: 0,
        totalInstances: 0,
        totalRunning: 0,
      });
      navigate("");
    } else {
      // Validate and show results
      if (!isValidInput(inputValue)) {
        if (!useName) {
          toast("Invalid ZEL ID");
        }
        return;
      }

      setAppZelID(inputValue);
      setShowResults(true);

      // Update URL if different from current
      if (userId !== inputValue) {
        navigate(inputValue);
      }
    }
  }, [showResults, isValidInput, useName, userId, navigate, setAppZelID]);

  // Handle switch toggle
  const handleModeChange = useCallback(
    (val) => {
      if (!showResults) {
        setUseName(val);
      }
    },
    [showResults, setUseName]
  );

  // Initialize from URL or context
  useEffect(() => {
    if (userId) {
      setAppZelID(userId);
      setUseName(!checkZel(userId)); // If not a valid ZelID, assume it's a name search
      if (inputRef.current) {
        inputRef.current.value = userId;
      }
    } else if (appZelID && inputRef.current) {
      inputRef.current.value = appZelID;
    }
  }, [userId, appZelID, setUseName, setAppZelID]);

  // Stats update callbacks - using useCallback for stable references
  const handleSetTotalApps = useCallback((value) => {
    setStats((prev) => ({ ...prev, totalApps: value }));
  }, []);

  const handleSetUserApps = useCallback((value) => {
    setStats((prev) => ({ ...prev, userApps: value }));
  }, []);

  const handleSetTotalInstances = useCallback((value) => {
    setStats((prev) => ({ ...prev, totalInstances: value }));
  }, []);

  const handleSetTotalRunning = useCallback((value) => {
    setStats((prev) => ({ ...prev, totalRunning: value }));
  }, []);

  return (
    <div id="apps" className="mt-5 mb-12">
      <h2 className="flex justify-center mb-2">
        <img src={flux_os} className="h-[60px]" alt="Flux OS" />
      </h2>

      <div className="mr-10 flex w-full flex-wrap justify-center items-center p-[2px] mt-5">
        <div className="ml-2 mr-2 mb-2 stat-box md:w-[250px] w-[280px]">
          <div className={`${layout.statBox} text-white text-[24px]`}>TOTAL APPS</div>
          <div className={`${layout.statBox} text-white text-[36px]`}>{stats.totalApps}</div>
        </div>
        <div className="ml-2 mr-2 mb-2 stat-box md:w-[250px] w-[280px]">
          <div className={`${layout.statBox} text-white text-[24px]`}>USER APPS</div>
          <div className={`${layout.statBox} text-white text-[36px]`}>{stats.userApps}</div>
        </div>
        <div className="ml-2 mr-2 mb-2 stat-box md:w-[250px] w-[280px]">
          <div className={`${layout.statBox} text-white text-[24px]`}>APP INSTANCES</div>
          <div className={`${layout.statBox} text-white text-[36px]`}>{stats.totalInstances}</div>
        </div>
        <div className="ml-2 mr-2 mb-2 stat-box md:w-[250px] w-[280px]">
          <div className={`${layout.statBox} text-white text-[24px]`}>APPS RUNNING</div>
          <div className={`${layout.statBox} text-white text-[36px]`}>{stats.totalRunning}</div>
        </div>
      </div>

      <div id="apps" className="flex flex-auto flex-wrap flex-row">
        <label htmlFor="wallet" className="sr-only">
          {useName ? "App name" : "Owner ZelID"}
        </label>
        <input
          ref={inputRef}
          defaultValue={appZelID}
          type="text"
          id="wallet"
          name="wallet"
          placeholder={useName ? "Enter app name..." : "Enter ZEL ID..."}
          className="focus-ring py-2 px-2 rounded-[10px] bg-[#14101d] border border-white/20 text-white placeholder:text-dimWhite ml-5 mr-2 mb-5 font-poppins font-medium xs:text-[14px] ss:text-[16px] md:text-[18px] mm:w-8/12 max-w-md"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <div className="flex">
          <button
            type="button"
            style={{ width: "250px" }}
            className={`focus-ring py-2 px-2 mb-5 bg-blue-gradient font-poppins ml-8 font-medium text-[18px] text-white ${props.styles} rounded-[10px]`}
            onClick={handleSearch}
          >
            {buttonText}
          </button>

          <label
            htmlFor="toggle-name"
            title={showResults ? "Clear the results to switch between ZelID and name" : undefined}
            className="flex w-20 flex-col ml-2 mr-2 mb-5 cursor-pointer py-1"
          >
            <span className="flex justify-center font-poppins ml-2 mr-2 font-medium text-[18px] text-white">Name</span>
            <div className="flex justify-center">
              <ReactSwitch id="toggle-name" checked={useName} onChange={handleModeChange} disabled={showResults} />
            </div>
          </label>
        </div>
      </div>

      <h1 className={`${layout.statBox} stat-box text-headers mm:text-[30px] xs:text-[40px] ss:text-[44px] sm:text-[48px] md:text-[52px] leading-[60px] ml-5 mr-5 mb-2`}>
        APP DETAILS
      </h1>

      {showResults && inputRef?.current?.value && (
        <FluxApps
          wallet={inputRef.current.value}
          SetTotalApps={handleSetTotalApps}
          SetUserApps={handleSetUserApps}
          SetTotalInstances={handleSetTotalInstances}
          SetTotalRunning={handleSetTotalRunning}
        />
      )}

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
    </div>
  );
};

export default ButtonApp;
