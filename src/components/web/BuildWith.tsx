import { AiOutlineJavaScript } from "react-icons/ai";
import { FaReact } from "react-icons/fa";
import { RiTailwindCssFill } from "react-icons/ri";
import { SiTypescript } from "react-icons/si";

export default function BuildWith() {
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
      <span>Built with</span>
      <div className="flex space-x-1.5 items-center">
        <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
          <FaReact className="text-gray-700 dark:text-white" />
        </a>
        <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer">
          <RiTailwindCssFill className="text-gray-700 dark:text-white" />
        </a>
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AiOutlineJavaScript className="text-yellow-600" />
        </a>
        <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">
          <SiTypescript className="text-blue-600" />
        </a>
      </div>
    </div>
  );
}
