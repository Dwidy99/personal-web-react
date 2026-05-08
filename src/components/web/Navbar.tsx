import { useState, useRef } from "react";
import { BsMoonStarsFill } from "react-icons/bs";
import { IoSunnySharp } from "react-icons/io5";
import useColorMode from "@/hooks/useColorMode";
import ClickOutside from "@/components/general/ClickOutside";
import TopToButton from "@/components/general/TopToButton";
import HandleScroll from "@/components/general/HandleScroll";
import { Link } from "react-router-dom";

export default function Navbar(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isFixed, setIsFixed] = useState<boolean>(false);
  const toTopRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [colorMode, setColorMode] = useColorMode();

  /** Toggle menu (mobile) */
  const toggleMenu = (): void => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 z-999 w-full my-4 transition-all duration-300 shadow-md dark:shadow-black ${
          isFixed ? "bg-transparent navbar-fixed dark:bg-black/80" : ""
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between relative font-bold lg:mx-25.5">
            <div className="my-6">
              <Link
                to="/"
                className="flex items-center gap-2 text-lg text-meta-12 hover:text-black dark:text-white dark:hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-black text-xs font-black text-white dark:bg-white dark:text-black">
                  DY
                </span>
                DwiYulianto
              </Link>
            </div>

            <div className="flex items-center px-4">
              {/* Hamburger Button */}
              <button
                ref={buttonRef}
                type="button"
                aria-label="hamburger"
                onClick={toggleMenu}
                className={`block absolute right-4 z-50 lg:hidden ${
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
                  className={`absolute rounded-lg py-4 dark:text-white lg:static lg:block lg:max-w-full lg:rounded-none lg:bg-transparent lg:shadow-none lg:dark:bg-transparent ${
                    isOpen
                      ? "right-4 top-full block w-full max-w-[250px] border border-gray-200 bg-white drop-shadow-xl dark:border-gray-800 dark:bg-black"
                      : "hidden"
                  }`}
                >
                  <ul className="block lg:flex">
                    <li className="group my-2">
                      <Link
                        to="/blog"
                        className="mx-8 py-2 text-base text-slate-700 group-hover:text-black dark:text-gray-300 dark:group-hover:text-white"
                      >
                        Blog
                      </Link>
                    </li>
                    <li className="group my-2">
                      <Link
                        to="/projects"
                        className="mx-8 py-2 text-base text-slate-700 group-hover:text-black dark:text-gray-300 dark:group-hover:text-white"
                      >
                        Projects
                      </Link>
                    </li>
                    <li className="group my-2">
                      <Link
                        to="/about"
                        className="mx-8 py-2 text-base text-slate-700 group-hover:text-black dark:text-gray-300 dark:group-hover:text-white"
                      >
                        About
                      </Link>
                    </li>

                    {/* Dark Mode Toggle */}
                    <li className="my-4 items-center pl-8 lg:mt-3">
                      <div className="flex items-center">
                        <span className="mr-2 text-sm text-slate-500 dark:text-gray-300">
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

                        <span className="ml-2 text-sm text-slate-500 dark:text-gray-300">
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
