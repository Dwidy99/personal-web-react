import React, { useState, useRef } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
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
        className={`w-full my-4 fixed top-0 left-0 transition-all duration-300 shadow-md dark:shadow-slate-700/40 ${
          isFixed ? "bg-transparent navbar-fixed dark:bg-transparent" : ""
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between relative font-bold lg:mx-25.5">
            <div className="my-6">
              <Link
                to="/"
                className="text-lg text-meta-12 flex items-center hover:text-primary dark:text-slate-300"
              >
                <DotLottieReact
                  src="https://lottie.host/2e6f2bd3-568d-48c9-ac85-2f837e3a35c5/DRkd0qtHGo.lottie"
                  loop
                  autoplay
                  style={{ width: "20%", height: "20%", lineHeight: "0" }}
                />
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
                  className={`absolute rounded-lg py-4 dark:text-slate-800 lg:static lg:block lg:max-w-full lg:rounded-none lg:bg-transparent lg:shadow-none lg:dark:bg-transparent ${
                    isOpen
                      ? "block bg-slate-100 drop-shadow-xl border-spacing-1 right-4 top-full w-full max-w-[250px]"
                      : "hidden"
                  }`}
                >
                  <ul className="block lg:flex">
                    <li className="group my-2">
                      <Link
                        to="/blog"
                        className="text-base text-slate-700 py-2 mx-8 group-hover:text-primary dark:text-slate-500"
                      >
                        Blog
                      </Link>
                    </li>
                    <li className="group my-2">
                      <Link
                        to="/projects"
                        className="text-base text-slate-700 py-2 mx-8 group-hover:text-primary dark:text-slate-500"
                      >
                        Projects
                      </Link>
                    </li>
                    <li className="group my-2">
                      <Link
                        to="/about"
                        className="text-base text-slate-700 py-2 mx-8 group-hover:text-primary dark:text-slate-500"
                      >
                        About
                      </Link>
                    </li>

                    {/* Dark Mode Toggle */}
                    <li className="my-4 items-center pl-8 lg:mt-3">
                      <div className="flex items-center">
                        <span className="mr-2 text-sm text-slate-500 dark:text-slate-500">
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
                          <div className="flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-500 p-1">
                            <div className="toggle-circle h-4 w-4 rounded-full bg-white transition duration-300 ease-in-out"></div>
                          </div>
                        </label>

                        <span className="ml-2 text-sm text-slate-500 dark:text-slate-500">
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
