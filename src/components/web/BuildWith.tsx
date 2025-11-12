import { AiOutlineJavaScript } from "react-icons/ai";
import { FaReact } from "react-icons/fa";
import { RiTailwindCssFill } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function BuildWith() {
  return (
    <div className="flex items-center space-x-1">
      <span className="mr-1 text-gray-500 dark:text-gray-400">Build with</span>

      <div className="flex space-x-1.5">
        <Link to="https://react.dev/">
          <FaReact style={{ color: "#2596be" }} />
        </Link>
        <Link to="https://tailwindcss.com/">
          <RiTailwindCssFill style={{ color: "#2587be" }} />
        </Link>
        <Link to="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
          <AiOutlineJavaScript
            style={{ color: "#1b1b1a" }}
            className="dark:bg-slate-500"
          />
        </Link>
      </div>
    </div>
  );
}
