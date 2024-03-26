import logo from "../../assets/logo.jpg";
function Navbar() {
  return (
    <>
      <div className="nav w-full sticky px-[4rem] py-4 shadow-lg	">
        <div className="nav-items-container flex justify-between items-center ">
          <div className="logo cursor-pointer flex gap-1 flex-nowrap">
            <img src={logo} alt="" className="w-[12rem] h-[5rem]" />
          </div>
          <div className="nav-links flex gap-6 text-[1.2rem]">
            <div className="nav-link cursor-pointer">Home</div>
            <div className="nav-link cursor-pointer">About</div>
            <div className="nav-link cursor-pointer">Contact</div>
            <div className="nav-link cursor-pointer">Blog</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
