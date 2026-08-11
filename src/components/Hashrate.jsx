import React from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);
import { Line } from "react-chartjs-2";
import useAxios from "../hooks/useAxios";
import fluxAxios from "../api/flux_hash";
import styles from "../style";
import { useState, useRef, useEffect } from "react";

// Create Chart component
const Hashchart = (props) => {
  const chartRef = useRef(null);
  // Create Data object from array of JSON objects
  const data = {
    labels: props.data.map((d) => d.date),
    datasets: [
      {
        label: props.datalabel,
        data: props.data.map((d) => d.sum / props.datafactor),
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
      },
    ],
  };
  const options = {
    scales: {
      x: {
        reverse: true,
        border: {
          width: 1,
          color: "#ffffff",
        },
      },
      y: {
        border: {
          width: 1,
          color: "#ffffff",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 18,
          },
          color: "rgb(0,128,128)",
        },
      },
      title: {
        display: true,
        text: props.title,
        font: {
          size: 15,
        },
      },
    },
    layout: {
      padding: {
        left: 25,
        right: 25,
      },
    },
  };

  useEffect(() => {
    const chart = chartRef.current;
    // eslint-disable-next-line no-unused-vars
    const redrawChart = (event) => {
      chart.resize();
    };

    window.addEventListener("resize", redrawChart);
    return () => {
      window.removeEventListener("resize", redrawChart);
    };
  }, []);

  return (
    <div className="w-full mb-10">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
};

const Hashrate = (props) => {
  const homeitem = props.homeitem;
  const [hashtime, Sethashtime] = useState(30);

  function updateHashTime(time) {
    Sethashtime(time);
    refetch();
    diffrefetch();
  }

  const [fluxhash, hasherror, hashloading, refetch] = useAxios({
    axiosInstance: fluxAxios,
    method: "GET",
    url: `network-hash?days=${hashtime}`,
    requestConfig: {
      headers: {
        "Content-Language": "en-US",
      },
    },
  });

  const [fluxdiff, differror, diffloading, diffrefetch] = useAxios({
    axiosInstance: fluxAxios,
    method: "GET",
    url: `difficulty?days=${hashtime}`,
    requestConfig: {
      headers: {
        "Content-Language": "en-US",
      },
    },
  });

  return (
    <div>
      {(hashloading || diffloading) && <p className="flex font-poppins text-white">Loading data ...</p>}
      {(hasherror || differror) && <p className="flex font-poppins text-white">Error Loading Data ... </p>}
      {fluxhash && (
        <div>
          <p className="flex font-poppins text-white justify-center w-full">
            <button
              type="button"
              className={`py-1 px-1 bg-blue-gradient font-poppins ml-8 font-medium text-[12px] text-white outline-none ${styles} rounded-[10px]`}
              onClick={() => {
                updateHashTime(30);
              }}
            >
              30 Day Hash
            </button>
            <button
              type="button"
              className={`py-1 px-1 bg-blue-gradient font-poppins ml-8 font-medium text-[12px] text-white outline-none ${styles} rounded-[10px]`}
              onClick={() => {
                updateHashTime(60);
              }}
            >
              60 Day Hash
            </button>
            <button
              type="button"
              className={`py-1 px-1 bg-blue-gradient font-poppins ml-8 font-medium text-[12px] text-white outline-none ${styles} rounded-[10px]`}
              onClick={() => {
                updateHashTime(180);
              }}
            >
              180 Day Hash
            </button>
            <button
              type="button"
              className={`py-1 px-1 bg-blue-gradient font-poppins ml-8 font-medium text-[12px] text-white outline-none ${styles} rounded-[10px]`}
              onClick={() => {
                updateHashTime(365);
              }}
            >
              1 Year Hash
            </button>
            <button
              type="button"
              className={`py-1 px-1 bg-blue-gradient font-poppins ml-8 font-medium text-[12px] text-white outline-none ${styles} rounded-[10px]`}
              onClick={() => {
                updateHashTime(730);
              }}
            >
              2 Year Hash
            </button>
          </p>
          <Hashchart data={fluxhash} hashtime={hashtime} title={"Network Hashrate MSol/s"} datalabel={`${hashtime} DAY HASH RATE`} datafactor={1000000} />
          <Hashchart data={fluxdiff} hashtime={hashtime} title={"Network Difficulty"} datalabel={`${hashtime} DAY DIFFICULTY`} datafactor={1} homeitem={homeitem} />
        </div>
      )}
    </div>
  );
};

export default Hashrate;
