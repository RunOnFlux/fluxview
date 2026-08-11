import { useState, useContext } from "react";
import { close, flux_logo, menu } from "../assets";
import { navLinks } from "../constants";
import { Outlet, Link } from "react-router-dom";
import DataContext from "../context/DataContext";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);

  const { setHomeitem } = useContext(DataContext);

  function click(item) {
    setHomeitem(item);
  }

  return (
    <div>
      <nav className="w-full flex py-3 justify-between items-center p-[2px] nav-bar">
        <Link to={"/"}>
          <img src={flux_logo} alt="flux" className="nav-icon ml-5" />
        </Link>
        <ul className="list-none sm:flex hidden justify-end items-center flex-1">
          {navLinks.map((nav, index) => (
            <li
              key={nav.id}
              className={`font-poppins font-normal cursor-pointer text-[16px] ${index === navLinks.length - 1 ? "mr-5" : "mr-10"} text-white`}
              onClick={() => {
                click(nav.id);
              }}
            >
              <Link to={nav.title}> {nav?.img ? <img src={nav?.img} alt="flux2" className="nav-icon" title={nav.title} /> : nav.title} </Link>
            </li>
          ))}
        </ul>

        <div className="sm:hidden flex flex-1 justify-end items-center">
          <img src={toggle ? close : menu} alt="menu" className="w-[28px] h-[28px] object-contain" onClick={() => setToggle((prev) => !prev)} />

          {toggle && (
            <div className={`${toggle ? "flex" : "hidden"} p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}>
              <ul className="list-none flex flex-col justify-end items-center flex-1">
                {navLinks.map((nav, index) => (
                  <li
                    key={nav.id}
                    className={`font-poppins font-normal cursor-pointer text-[16px] ${index === navLinks.length - 1 ? "mr-0" : "mb-4"} text-white`}
                    onClick={() => {
                      click(nav.id);
                    }}
                  >
                    <Link to={nav.title}> {nav.title} </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Navbar;
