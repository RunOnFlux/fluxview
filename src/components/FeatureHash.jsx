import { useState } from "react";
import styles from "../style";
import { layout } from "../style";
import HashChart from "./HashChart";
import FeatureCardList from "./FeatureCardList";

const FeatureHash = (props) => {
  const [total_clicked, setTotal_clicked] = useState(false);
  const [card_clicked, setCard_clicked] = useState("");
  const [checkPA, setCheckPA] = useState(false);

  function rigClick(name) {
    if (name == card_clicked) {
      setCard_clicked("");
    } else {
      setCard_clicked(name);
    }
  }

  var hashData = [];
  var hashTime = [];
  var totalData = [];
  var totalTime = [];
  var total = 0;

  props?.hash_history?.stats?.map((item) => {
    item.rigs?.map((subItem) => {
      total = total + subItem?.hashrate / 1000000;
      if (subItem.name == card_clicked) {
        hashTime.push(item?.time);
        hashData.push(subItem?.hashrate / 1000000);
      }
    });
    totalTime.push(item?.time);
    totalData.push(total);
    total = 0;
  });

  const estReward = ((props?.miner_results?.averages?.avg24h / 1000000 / props?.mining_info?.miningInfo?.networkhashps) * 13500).toFixed(2);

  return (
    <article className="ml-5 mr-5">
      <div className="flex flex-col p-1">
        <div className={`${layout.statBox} w-full nav-bar text-headers mm:text-[30px] xs:text-[40px] ss:text-[44px] sm:text-[48px] md:text-[52px] leading-[60px] mb-2`}>
          MINING BALANCE
        </div>
        <div className={`feature-card-tile cursor-pointer ${checkPA ? "feature-card-base" : "feature-card"}`} onClick={() => setCheckPA((prev) => !prev)}>
          {
            <FeatureCardList
              features={[
                { title: "24hr Reward", content: estReward },
                {
                  title: "Unconfirmed",
                  content: props?.balance_results ? props?.balance_results?.immature?.toFixed(2) : "N/A",
                },
                {
                  title: "Unpaid",
                  content: props?.balance_results ? props?.balance_results?.balance?.toFixed(2) : "N/A",
                },
                {
                  title: "Payout",
                  content: props?.balance_results ? props?.miner_results?.customPayout?.toFixed(2) : "N/A",
                },
                {
                  title: "Total Paid",
                  content: props?.balance_results ? props?.balance_results?.total?.toFixed(2) : "N/A",
                },
              ]}
            />
          }
        </div>
        {checkPA && (
          <div>
            <div className={`${layout.statBox} nav-bar text-dimWhite xs:text-[24px] ss:text-[28px] sm:text-[32px] md:text-[36px] leading-[42px] mb-2`}>PENDING PA BALANCE</div>
            <div className={`feature-card-tile feature-card-node`}>
              {
                <FeatureCardList
                  features={[
                    {
                      title: "KDA",
                      content: ((props?.balance_results?.balance / 10) * 0.92)?.toFixed(2),
                    },
                    {
                      title: "ETH",
                      content: ((props?.balance_results?.balance / 10) * 0.92)?.toFixed(2),
                    },
                    {
                      title: "BSC",
                      content: ((props?.balance_results?.balance / 10) * 0.92)?.toFixed(2),
                    },
                    {
                      title: "SOL",
                      content: ((props?.balance_results?.balance / 10) * 0.92)?.toFixed(2),
                    },
                    {
                      title: "TRON",
                      content: ((props?.balance_results?.balance / 10) * 0.92)?.toFixed(2),
                    },
                    {
                      title: "AVAX",
                      content: ((props?.balance_results?.balance / 10) * 0.92)?.toFixed(2),
                    },
                    {
                      title: "ERGO",
                      content: ((props?.balance_results?.balance / 10) * 0.92)?.toFixed(2),
                    },
                    {
                      title: "ALGO",
                      content: ((props?.balance_results?.balance / 10) * 0.92)?.toFixed(2),
                    },
                    {
                      title: "MATIC",
                      content: ((props?.balance_results?.balance / 10) * 0.92)?.toFixed(2),
                    },
                  ]}
                />
              }
            </div>
            <div className={`${layout.statBox} nav-bar text-dimWhite xs:text-[24px] ss:text-[28px] sm:text-[32px] md:text-[36px] leading-[42px] mb-2`}>TOTAL PA BALANCE</div>
            <div className={`feature-card-tile feature-card-node`}>
              {
                <FeatureCardList
                  features={[
                    {
                      title: "KDA",
                      content: props?.balance_pa?.total?.kda?.toFixed(2),
                    },
                    {
                      title: "ETH",
                      content: props?.balance_pa?.total?.eth?.toFixed(2),
                    },
                    {
                      title: "BSC",
                      content: props?.balance_pa?.total?.bsc?.toFixed(2),
                    },
                    {
                      title: "SOL",
                      content: props?.balance_pa?.total?.sol?.toFixed(2),
                    },
                    {
                      title: "TRON",
                      content: props?.balance_pa?.total?.tron?.toFixed(2),
                    },
                    {
                      title: "AVAX",
                      content: props?.balance_pa?.total?.avax?.toFixed(2),
                    },
                    {
                      title: "ERGO",
                      content: props?.balance_pa?.total?.erg?.toFixed(2),
                    },
                    {
                      title: "ALGO",
                      content: props?.balance_pa?.total?.algo?.toFixed(2),
                    },
                    {
                      title: "MATIC",
                      content: props?.balance_pa?.total?.matic?.toFixed(2),
                    },
                  ]}
                />
              }
            </div>
            <div className={`${layout.statBox} nav-bar text-dimWhite xs:text-[24px] ss:text-[28px] sm:text-[32px] md:text-[36px] leading-[42px] mb-2`}>LOYALTY</div>
            <div className={`feature-card-tile feature-card-node`}>
              {
                <FeatureCardList
                  features={[
                    {
                      title: "Avg Hash",
                      content: props?.miner_results?.loyalty?.hashrateString,
                    },
                    {
                      title: "Uptime",
                      content: `${(props?.miner_results?.loyalty?.uptime * 100)?.toFixed(0)}%`,
                    },
                    {
                      title: "Est Reward",
                      content: `${
                        props?.miner_results?.loyalty?.hashrate / 50000 < 1000
                          ? (props?.miner_results?.newLoyalty?.config?.loyalty?.reward * props?.miner_results?.loyalty?.uptime)?.toFixed(2)
                          : props?.miner_results?.newLoyalty?.config?.loyalty?.reward *
                            ((props?.miner_results?.loyalty?.hashrate / 500000 / 1000) * props?.miner_results?.loyalty?.uptime)?.toFixed(2)
                      }`,
                    },
                    {
                      title: "Total Paid",
                      content: (props?.miner_results?.newLoyalty?.details?.total / 100000000)?.toFixed(2),
                    },
                    {
                      title: "Duration",
                      content: `${props?.miner_results?.newLoyalty?.config?.loyalty?.duration} days`,
                    },
                  ]}
                />
              }
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center p-1">
        <div className={`${layout.statBox} w-full nav-bar text-headers mm:text-[30px] xs:text-[40px] ss:text-[44px] sm:text-[48px] md:text-[52px] leading-[60px] mb-2`}>
          TOTAL HASHRATE
        </div>
        <div className={`feature-card-tile cursor-pointer feature-card`} onClick={() => setTotal_clicked((prev) => !prev)}>
          {
            <FeatureCardList
              features={[
                {
                  title: "Total Hash",
                  content: props?.miner_results?.hashrateString,
                },
                {
                  title: "3hr",
                  content: (props?.miner_results?.averages?.avg3h / 1000000)?.toFixed(2),
                },
                {
                  title: "24hr",
                  content: (props?.miner_results?.averages?.avg24h / 1000000)?.toFixed(2),
                },
              ]}
            />
          }
        </div>
        <div className={`${styles.chartWidth} flex m-auto flex-col justify-center`}>
          {total_clicked && <HashChart hashTime={totalTime} hashData={totalData} rigName={"Total Hash"} />}
        </div>
      </div>
      <div className={`${layout.statBox} w-full nav-bar text-headers mm:text-[30px] xs:text-[40px] ss:text-[44px] sm:text-[48px] md:text-[52px] leading-[60px] mb-2`}>
        RIG HASHRATES
      </div>
      {props?.miner_results?.rigs.map((data) => {
        return (
          <div key={data.name} className="flex flex-col ml-1 mr-1">
            <div className={`feature-card-tile cursor-pointer ${card_clicked == data.name ? "feature-card-base" : "feature-card"}`} onClick={() => rigClick(data.name)}>
              {
                <FeatureCardList
                  features={[
                    { title: data.name, content: data.hashrateString },
                    { title: "Shares", content: data.shares?.toFixed(3) },
                    { title: "Luck", content: data.luckDays?.toFixed(2) },
                  ]}
                />
              }
            </div>
            <div className={`${styles.chartWidth} flex m-auto flex-col justify-center`}>
              {card_clicked == data.name && hashTime.length > 0 && <HashChart hashTime={hashTime} hashData={hashData} rigName={card_clicked} />}
            </div>
          </div>
        );
      })}
    </article>
  );
};

export default FeatureHash;
