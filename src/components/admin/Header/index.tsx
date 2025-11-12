import { Link, useNavigate } from "react-router-dom";
import DropdownUser from "./DropdownUser";
import LogoIcon from "../../../assets/admin/images/logo/logo.svg";
import { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import Api from "../../../services/Api";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user data from cookies only once on mount
  useEffect(() => {
    const userData = Cookies.get("user")
      ? JSON.parse(Cookies.get("user"))
      : null;
    setUser(userData);
  }, []);

  const logout = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await Api.post("/api/logout");
        Cookies.remove("user");
        Cookies.remove("token");
        Cookies.remove("permissions");
        toast.success("Logout Successfully!", {
          position: "top-center",
          duration: 4500,
        });
        navigate("/login");
      } catch (error) {
        toast.error(`Logout failed. Please try again because ${error}.`, {
          position: "top-center",
          duration: 4500,
        });
      }
    },
    [navigate]
  );

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-end px-4 py-4 shadow-2 sm:justify-between md:justify-end md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!w-full delay-300"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "delay-400 !w-full"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!w-full delay-500"
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!h-0 !delay-[0]"
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!h-0 !delay-200"
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className="block flex-shrink-0 lg:hidden" to="/">
            <img src={LogoIcon} alt="Logo" />
          </Link>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4"></ul>

          {/* <!-- User Area --> */}
          <DropdownUser logout={logout} user={user} />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

// Add Prop Types
Header.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};

export default Header;
