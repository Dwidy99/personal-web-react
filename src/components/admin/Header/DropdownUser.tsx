import { useState } from "react";
import { Link } from "react-router-dom";
import ClickOutside from "@/components/general/ClickOutside";
import UserOne from "@/assets/admin/images/user/user-01.png";
import { FaRegUser } from "react-icons/fa6";
import { ImExit } from "react-icons/im";

interface DropdownUserProps {
  logout: () => void;
  user?: {
    name?: string;
    email?: string;
  } | null;
}

export default function DropdownUser({ logout, user }: DropdownUserProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <ClickOutside onClickOutside={() => setDropdownOpen(false)} className="relative">
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-4"
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
      >
        <span className="text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {user?.name ?? "Guest"}
          </span>
          <span className="block text-xs text-gray-500">{user?.email ?? "@guest"}</span>
        </span>

        <span className="h-12 w-12 rounded-full overflow-hidden">
          <img src={UserOne} alt="User avatar" className="object-cover" />
        </span>

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.41.91a.8.8 0 011.18 0L6 5.32l4.41-4.41a.8.8 0 011.18 1.18L6.59 7.09a.8.8 0 01-1.18 0L0.41 2.09a.8.8 0 010-1.18z"
          />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-4 flex w-62.5 flex-col rounded-md border border-stroke bg-white shadow-md dark:border-strokedark dark:bg-boxdark">
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                to="/"
                className="flex items-center gap-3.5 text-sm font-medium hover:text-primary"
              >
                <FaRegUser /> My Profile
              </Link>
            </li>
          </ul>
          <button
            onClick={logout}
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium hover:text-primary"
          >
            <ImExit /> Log Out
          </button>
        </div>
      )}
    </ClickOutside>
  );
}
