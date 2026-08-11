import React from "react";
import { useRef, useState, useEffect, useContext } from "react";
import FluxPoolHash from "../components/FluxPoolHash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Hashrate from "../components/Hashrate";
import { useParams, useNavigate } from "react-router-dom";
import HashStats from "../components/stats/HashStats";
import styles, { layout } from "../style";
import DataContext from "../context/DataContext";

const Button = (props) => {
  const { miningWallet, setMiningWallet } = useContext(DataContext);

  const navigate = useNavigate();
  const { userId } = useParams();
  const inputRef = useRef(null);
  const [bench, setBench] = useState(false);
  const [buttontext, setButtontext] = useState("SEARCH MINING WALLET");

  function click() {
    if (inputRef?.current?.value) {
      if (`${inputRef.current.value}`.length == 35 && bench == true) {
        setMiningWallet(inputRef.current.value);
        navigate("");
        setBench(false);
        setButtontext("SEARCH MINING WALLET");
      } else if (`${inputRef.current.value}`.length == 35 && bench == false) {
        setMiningWallet(inputRef.current.value);
        if (userId != inputRef.current.value) {
          navigate(inputRef.current.value);
        }
        setBench(true);
        setButtontext("CLEAR RESULTS");
      } else if (`${inputRef.current.value}`.length != 35) {
        toast("Invalid Wallet Address");
        setBench(false);
        setButtontext("SEARCH MINING WALLET");
      } else {
        setBench(false);
      }
    } else {
      setBench(false);
      setButtontext("SEARCH MINING WALLET");
    }
  }

  useEffect(() => {
    if (bench == false) {
      click();
    }
  }, [inputRef.value]);

  /* useEffect(() => {
    if (!userId) {
      inputRef.value = props?.wallet
    }
    else
    {
      inputRef.value = userId
      props.setMiningWallet(userId)
    }
  },[]) */

  return (
    <div id="hash" className="flex-auto mb-12">
      <HashStats />
      <input
        ref={inputRef}
        defaultValue={userId ? userId : miningWallet}
        type="text"
        id="wallet"
        name="wallet"
        className={"py-2 px-2 ml-5 mr-2 mt-5 mb-5 font-poppins font-medium xs:text-[14px] ss:text-[16px] md:text-[18px] mm:w-8/12 max-w-md"}
      />
      <button
        type="button"
        style={{ width: "250px" }}
        className={`py-2 px-2 bg-blue-gradient font-poppins ml-8 font-medium text-[18px] text-white outline-none ${props.styles} rounded-[10px]`}
        onClick={() => {
          click();
        }}
      >
        {buttontext}
      </button>

      {bench && <FluxPoolHash wallet={miningWallet} />}

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

      <div className={`${layout.statBox} nav-bar text-headers mm:text-[30px] xs:text-[40px] ss:text-[44px] sm:text-[48px] md:text-[52px] leading-[60px] mr-5 ml-5 mb-2`}>
        NETWORK HASHRATE
      </div>

      <div className={`${styles.chartWidth} flex m-auto flex-col justify-center`}>
        <Hashrate />
      </div>
    </div>
  );
};

export default Button;
