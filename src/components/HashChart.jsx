import { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);
import { Line } from "react-chartjs-2";

const HashChart = (props) => {
  const chartRef = useRef(null);
  var logDate = new Date();

  var convertedDates = [];

  props?.hashTime.map((index) => {
    logDate = new Date(index * 1000);
    convertedDates.push(
      logDate.toLocaleTimeString("en", {
        hour: "numeric",
        hourCycle: "h12",
      })
    );
  });

  // Create Data object from array of JSON objects
  const data = {
    labels: convertedDates,
    datasets: [
      {
        label: props.rigName.concat(" - Hash Rate"),
        data: props.hashData,
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
        ticks: {
          //display: false,
          autoSkip: true,
          maxTicksLimit: 12,
        },
        reverse: false,
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
          display: false,
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
    <div className="flex justify-center mb-10">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default HashChart;
