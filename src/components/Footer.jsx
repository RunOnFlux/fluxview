// __APP_VERSION__ is injected by vite from package.json, so the version shown
// here cannot drift from the one that was released
const Footer = () => {
  return (
    <div className="footer">
      <div className="flex flex-row justify-between">
        <a href="mailto:info@runonflux.io" className="focus-ring ml-2 rounded text-dimWhite font-poppins font-semibold text-[18px] hover:text-white">
          info@runonflux.io
        </a>
        <div className="ml-2 mr-2 text-dimWhite font-poppins font-semibold text-[18px]">FluxView {__APP_VERSION__}</div>
      </div>
    </div>
  );
};

export default Footer;
