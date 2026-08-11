const FeatureCard = (props) => {
  const handleClick = () => {
    if (props.content) {
      let formattedUrl;
      if (props.content.includes(":")) {
        const parts = props.content.split(":");
        if (parts.length === 2 && !isNaN(parseInt(parts[1]))) {
          const ip = parts[0];
          const port = parseInt(parts[1]) - 1;
          // Convert IP dots to dashes and append port: 65.108.105.30:16167 -> 65-108-105-30-16166
          formattedUrl = `${ip.replace(/\./g, "-")}-${port}`;
        }
      } else {
        formattedUrl = `${props.content.replace(/\./g, "-")}-16126`;
      }
      if (formattedUrl) {
        window.open(`https://${formattedUrl}.node.home.runonflux.io`, "_blank");
      }
    }
  };
  return (
    <div className={"flex-1 flex flex-col ml-2"}>
      <p className="feature-card-title xs:text-[14px] ss:text-[16px] sm:text-[18px] md:text-[20px]">{props.title.toUpperCase()}</p>
      <p
        className={`feature-card-data 
            ${props?.link ? "cursor-pointer" : ""} 
            ${props?.color ? props.color : "text-dimWhite"} xs:text-[12px] ss:text-[14px] sm:text-[16px] md:text-[18px]`}
        onClick={props.link ? handleClick : undefined}
      >
        {props.content}
      </p>
    </div>
  );
};

export default FeatureCard;
