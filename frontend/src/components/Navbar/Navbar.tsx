import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../../assets/logo.jpg";
import { useState } from "react";
function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <>
      <div className="nav w-full sticky   px-[4rem] py-4 shadow-lg	bg-white">
        <div className="nav-items-container flex justify-between items-center ">
          <div className="logo cursor-pointer flex gap-1 flex-nowrap">
            <img src={logo} alt="" className="w-[12rem] h-[5rem]" />
          </div>

          <div className="modal-nav  hidden max-md:block">
            <GiHamburgerMenu
              onClick={() => setNavOpen(!navOpen)}
              className="text-[1.5rem] cursor-pointer"
            />
            <div className="relative">
              {navOpen && (
                <div className="dropdown-nav absolute z-[500] text-[1.2rem] border-[2px] px-[1rem] py-2 gap-1   w-[10rem] bg-white left-[-8rem] shadow-lg top-2 flex flex-col ">
                  <div className="nav-link cursor-pointer hover:text-[var(--font-red-colour)] text-[var(--font-red-colour)]">
                    Home
                  </div>
                  <div className="nav-link cursor-pointer hover:text-[var(--font-red-colour)]">
                    About
                  </div>
                  <div className="nav-link cursor-pointer hover:text-[var(--font-red-colour)]">
                    Contact
                  </div>
                  <div className="nav-link cursor-pointer hover:text-[var(--font-red-colour)]">
                    Blog
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="nav-links flex gap-6 text-[1rem] max-md:hidden">
            <div className="nav-link cursor-pointer hover:text-[var(--font-red-colour)] text-[var(--font-red-colour)]">
              Home
            </div>
            <div className="nav-link cursor-pointer hover:text-[var(--font-red-colour)]">
              About
            </div>
            <div className="nav-link cursor-pointer hover:text-[var(--font-red-colour)]">
              Contact
            </div>
            <div className="nav-link cursor-pointer hover:text-[var(--font-red-colour)]">
              Blog
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
