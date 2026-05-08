import { useState } from "react";
import { Link } from "react-router-dom";
import ClickOutside from "@/components/general/ClickOutside";
import UserOne from "@/assets/admin/images/user/user-01.png";
import { FaRegUser } from "react-icons/fa6";
import { ImExit } from "react-icons/im";
import { IoChevronDown } from "react-icons/io5";

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
        className="group flex items-center gap-3 rounded-md px-2 py-1.5 transition hover:bg-gray-2 dark:hover:bg-meta-4"
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
      >
        <span className="hidden text-right sm:block">
          <span className="block max-w-40 truncate text-sm font-semibold text-black dark:text-white">
            {user?.name ?? "Guest"}
          </span>
          <span className="block max-w-44 truncate text-xs text-bodydark2">
            {user?.email ?? "guest@local"}
          </span>
        </span>

        <span className="h-11 w-11 overflow-hidden rounded-full border border-stroke bg-gray-2 dark:border-strokedark">
          <img src={UserOne} alt="User avatar" className="h-full w-full object-cover" />
        </span>

        <IoChevronDown
          className={`hidden text-sm text-bodydark2 transition duration-200 sm:block ${
            dropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 z-999 mt-3 flex w-64 flex-col overflow-hidden rounded-lg border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-5 py-4 dark:border-strokedark">
            <p className="truncate text-sm font-semibold text-black dark:text-white">
              {user?.name ?? "Guest"}
            </p>
            <p className="mt-0.5 truncate text-xs text-bodydark2">{user?.email ?? "guest@local"}</p>
          </div>

          <ul className="flex flex-col border-b border-stroke p-2 dark:border-strokedark">
            <li>
              <Link
                to="/admin/profiles"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-body transition hover:bg-gray-2 hover:text-primary dark:text-bodydark dark:hover:bg-meta-4"
              >
                <FaRegUser /> My Profile
              </Link>
            </li>
          </ul>

          <button
            onClick={() => {
              setDropdownOpen(false);
              logout();
            }}
            className="flex items-center gap-3 px-5 py-3.5 text-left text-sm font-medium text-body transition hover:bg-gray-2 hover:text-danger dark:text-bodydark dark:hover:bg-meta-4"
          >
            <ImExit /> Log Out
          </button>
        </div>
      )}
    </ClickOutside>
  );
}
