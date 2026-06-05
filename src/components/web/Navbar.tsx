import { useEffect, useRef, useState } from "react";
import { BsMoonStarsFill } from "react-icons/bs";
import { IoSunnySharp } from "react-icons/io5";
import useColorMode from "@/hooks/useColorMode";
import ClickOutside from "@/components/general/ClickOutside";
import TopToButton from "@/components/general/TopToButton";
import HandleScroll from "@/components/general/HandleScroll";
import { Link, NavLink } from "react-router-dom";
import { publicWebApi } from "@/features/web/shared/api/publicWebApi";
import { getPublicAssetUrl } from "@/features/web/shared/utils/assets";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default function Navbar(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isFixed, setIsFixed] = useState<boolean>(false);
  const toTopRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [colorMode, setColorMode] = useColorMode();
  const defaultIconUrl = `${apiBaseUrl}/storage/configurations/default-icon.png`;
  const [iconUrl, setIconUrl] = useState<string>(defaultIconUrl);
  const [iconLoaded, setIconLoaded] = useState(false);
  const [iconFailed, setIconFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchConfig = async () => {
      try {
        if (isMounted) {
          const config = await publicWebApi.getConfiguration();
          setIconUrl(getPublicAssetUrl(config?.icon) || defaultIconUrl);
        }
      } catch {
        if (isMounted) setIconUrl(defaultIconUrl);
      }
    };

    fetchConfig();

    return () => {
      isMounted = false;
    };
  }, [defaultIconUrl]);

  useEffect(() => {
    setIconLoaded(false);
    setIconFailed(false);
  }, [iconUrl]);

  /** Toggle menu (mobile) */
  const toggleMenu = (): void => {
    setIsOpen((prev) => !prev);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "group/link relative mx-8 inline-flex py-2 text-base transition-all duration-300 ease-out hover:-translate-y-0.5",
      "after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:-translate-x-1/2 after:rounded-full after:transition-all after:duration-300 after:ease-out",
      isActive
        ? "text-slate-950 after:w-8 after:bg-sky-400 dark:text-white dark:after:bg-white"
        : "text-slate-600 after:w-0 after:bg-sky-400 hover:text-slate-950 hover:after:w-8 dark:text-slate-300 dark:after:bg-white dark:hover:text-white",
    ].join(" ");

  return (
    <>
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 z-999 w-full border-b transition-all duration-300 ${
          isFixed
            ? "border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-[#202020]/80 dark:shadow-none"
            : "border-transparent bg-white/65 backdrop-blur-md dark:bg-[#202020]/65"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between relative font-bold lg:mx-25">
            <div className="my-5">
              <Link
                to="/"
                className="group flex items-center gap-3 text-lg text-slate-900 transition-colors duration-300 hover:text-black dark:text-white dark:hover:text-white"
              >
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white text-xs font-black not-italic leading-none text-slate-900 shadow-sm ring-1 ring-slate-200 transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:shadow-md dark:bg-white dark:text-slate-900 dark:ring-white/25">
                  {!iconFailed ? (
                    <img
                      src={iconUrl}
                      alt="DwiYulianto"
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity ${
                        iconLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() => setIconLoaded(true)}
                      onError={() => setIconFailed(true)}
                    />
                  ) : null}
                  {(!iconLoaded || iconFailed) && (
                    <span className="absolute inset-0 flex items-center justify-center font-black not-italic leading-none tracking-normal">
                      DY
                    </span>
                  )}
                </span>
                <span className="transition duration-300 group-hover:tracking-[0.01em]">DwiYulianto</span>
              </Link>
            </div>

            <div className="flex items-center px-4">
              {/* Hamburger Button */}
              <button
                ref={buttonRef}
                type="button"
                aria-label="hamburger"
                onClick={toggleMenu}
                className={`block absolute right-4 z-50 rounded-md p-1 lg:hidden ${
                  isOpen ? "hamburger-active" : ""
                }`}
              >
                <span className="hamburger-line transition duration-300 ease-in-out origin-top-left" />
                <span className="hamburger-line transition duration-300 ease-in-out" />
                <span className="hamburger-line transition duration-300 ease-in-out origin-bottom-left" />
              </button>

              {/* Navigation Menu */}
              <ClickOutside onClickOutside={() => setIsOpen(false)} excludeRef={buttonRef}>
                <nav
                  className={`absolute rounded-lg py-4 lg:static lg:block lg:max-w-full lg:rounded-none lg:bg-transparent lg:shadow-none lg:dark:bg-transparent ${
                    isOpen
                      ? "right-4 top-full block w-full max-w-[250px] border border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#202020]"
                      : "hidden"
                  }`}
                >
                  <ul className="block lg:flex">
                    <li className="group my-2">
                      <NavLink
                        to="/blog"
                        className={navLinkClass}
                      >
                        Blog
                      </NavLink>
                    </li>
                    <li className="group my-2">
                      <NavLink
                        to="/projects"
                        className={navLinkClass}
                      >
                        Projects
                      </NavLink>
                    </li>
                    <li className="group my-2">
                      <NavLink
                        to="/about"
                        className={navLinkClass}
                      >
                        About
                      </NavLink>
                    </li>

                    {/* Dark Mode Toggle */}
                    <li className="my-4 items-center pl-8 lg:mt-3">
                      <div className="flex items-center">
                        <span className="mr-2 text-sm text-slate-600 dark:text-white">
                          <IoSunnySharp />
                        </span>

                        <input
                          type="checkbox"
                          id="dark-toggle"
                          aria-label="dark-mode"
                          className="hidden"
                          checked={colorMode === "dark"}
                          onChange={() => setColorMode(colorMode === "dark" ? "light" : "dark")}
                        />

                        <label htmlFor="dark-toggle">
                          <div className="flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-900 p-1 dark:bg-white">
                            <div className="toggle-circle h-4 w-4 rounded-full bg-white transition duration-300 ease-in-out dark:bg-black"></div>
                          </div>
                        </label>

                        <span className="ml-2 text-sm text-slate-600 dark:text-white">
                          <BsMoonStarsFill />
                        </span>
                      </div>
                    </li>
                  </ul>
                </nav>
              </ClickOutside>
            </div>
          </div>
        </div>
      </header>

      {/* To-Top Button */}
      <TopToButton />

      {/* Handle Scroll */}
      <HandleScroll setIsFixed={setIsFixed} toTopRef={toTopRef} />
    </>
  );
}
