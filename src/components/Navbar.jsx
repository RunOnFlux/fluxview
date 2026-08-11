import { useState, useContext, useEffect, useRef } from "react";
import { close, flux_logo, menu } from "../assets";
import { navLinks } from "../constants";
import { Outlet, Link } from "react-router-dom";
import DataContext from "../context/DataContext";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const mobileNav = useRef(null);

  const { setHomeitem } = useContext(DataContext);

  function click(item) {
    setHomeitem(item);
    setToggle(false);
  }

  // the menu used to stay open until the X was pressed: neither a tap outside
  // nor Escape dismissed it, while it covered the content behind
  useEffect(() => {
    if (!toggle) return undefined;

    const closeOnOutside = (event) => {
      if (!mobileNav.current?.contains(event.target)) setToggle(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setToggle(false);
    };

    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("touchstart", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("touchstart", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [toggle]);

  return (
    <div>
      <nav className="w-full flex py-3 justify-between items-center p-[2px] nav-bar">
        <Link to={"/"} aria-label="Flux View home" className="focus-ring rounded-[10px]">
          <img src={flux_logo} alt="Flux View" className="nav-icon ml-5" />
        </Link>
        <ul className="list-none sm:flex hidden justify-end items-center flex-1">
          {navLinks.map((nav, index) => (
            <li key={nav.id} className={`font-poppins font-normal text-[16px] ${index === navLinks.length - 1 ? "mr-5" : "mr-10"} text-white`}>
              <Link to={nav.path ?? nav.title} title={nav.title} onClick={() => click(nav.id)} className="focus-ring flex rounded-[10px] p-1">
                {nav?.img ? <img src={nav?.img} alt={nav.title} className="nav-icon" /> : nav.title}
              </Link>
            </li>
          ))}
        </ul>

        <div ref={mobileNav} className="sm:hidden flex flex-1 justify-end items-center">
          <button
            type="button"
            aria-label={toggle ? "Close menu" : "Open menu"}
            aria-expanded={toggle}
            className="focus-ring rounded-[10px] p-2"
            onClick={() => setToggle((prev) => !prev)}
          >
            <img src={toggle ? close : menu} alt="" aria-hidden="true" className="w-[28px] h-[28px] object-contain" />
          </button>

          {toggle && (
            <div className="flex p-4 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[180px] rounded-xl sidebar z-20">
              <ul className="list-none flex flex-col w-full flex-1">
                {navLinks.map((nav) => (
                  <li key={nav.id} className="font-poppins font-normal text-[16px] text-white">
                    <Link to={nav.path ?? nav.title} onClick={() => click(nav.id)} className="focus-ring block w-full rounded-[10px] px-3 py-3 text-center">
                      {nav.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Navbar;
