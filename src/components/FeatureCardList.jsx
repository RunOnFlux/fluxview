const FeatureCardList = (props) => {
  const handleClick = (content) => {
    if (content) {
      let url;
      if (content.includes(":")) {
        const parts = content.split(":");
        if (parts.length === 2 && !isNaN(parseInt(parts[1]))) {
          const port = parseInt(parts[1]) - 1;
          url = `${parts[0]}:${port}`;
        }
      } else {
        url = `${content}:16126`;
      }
      if (url) {
        window.open(`http://${url}`, "_blank");
      }
    }
  };

  return (
    <div className={"flex-1 flex flex-row ml-2"}>
      {props?.features?.map((feature, index) => (
        <div key={index} className="feature-item mr-2 flex-col w-full">
          <p className="feature-card-title xs:text-[14px] ss:text-[16px] sm:text-[18px] md:text-[20px]">{feature.title.toUpperCase()}</p>
          <p
            className={`feature-card-data mr-2
          ${feature?.link ? "cursor-pointer" : ""}
          ${feature?.color ? feature.color : "text-dimWhite"} xs:text-[12px] ss:text-[14px] sm:text-[16px] md:text-[18px]`}
            onClick={feature.link ? handleClick : undefined}
          >
            {feature.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FeatureCardList;
