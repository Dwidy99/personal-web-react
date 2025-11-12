import React, { Suspense } from "react";
import BuildWith from "./BuildWith";

export default function Footer(): JSX.Element {
  return (
    <footer aria-label="Site footer" role="contentinfo">
      <div className="container">
        <hr className="mb-8.5 border-slate-300 dark:border-slate-700 my-4" />
        <div
          className="mx-16 mb-8.5 items-center justify-between space-y-4 md:mb-10 md:flex md:space-y-0"
          data-inert="until-found" // Tells browser this isn't critical
        >
          <Suspense fallback={null}>
            <BuildWith />
          </Suspense>
          <div className="my-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div>{`Copyright © ${new Date().getFullYear()}`}</div>
            <span aria-hidden="true"> • </span>
            <span>Dwi's Blog - Coding Adventure</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
