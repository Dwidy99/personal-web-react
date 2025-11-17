import { useEffect, useState } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import Cookies from "js-cookie";
import CardDataStats from "../../../components/admin/CardDataStats";
import { TbCategory2 } from "react-icons/tb";
import { LuSignpostBig } from "react-icons/lu";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { SlPicture } from "react-icons/sl";
import { Api } from "../../../services";

interface DashboardData {
  categories: number;
  posts: number;
  experiences: number;
  projects: number;
}

interface StatCard {
  title: string;
  total: number;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  icon: JSX.Element;
}

export default function DashboardIndex() {
  document.title = "Dashboard - My Portfolio";

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    categories: 0,
    posts: 0,
    experiences: 0,
    projects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = Cookies.get("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await Api.get("/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statsData: StatCard[] = [
    {
      title: "Total Categories",
      total: dashboardData.categories,
      rate: "+0.43%",
      levelUp: true,
      icon: <TbCategory2 className="text-3xl text-primary" />,
    },
    {
      title: "Total Posts",
      total: dashboardData.posts,
      rate: "+2.15%",
      levelUp: true,
      icon: <LuSignpostBig className="text-3xl text-primary" />,
    },
    {
      title: "Total Experiences",
      total: dashboardData.experiences,
      rate: "+2.59%",
      levelUp: true,
      icon: <MdOutlineProductionQuantityLimits className="text-3xl text-primary" />,
    },
    {
      title: "Total Projects",
      total: dashboardData.projects,
      rate: "-0.95%",
      levelDown: true,
      icon: <SlPicture className="text-3xl text-primary" />,
    },
  ];

  return (
    <LayoutAdmin>
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-6">
        {/* ===== HEADER ===== */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
              Dashboard Overview
            </h1>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
              Welcome back! Here’s what’s happening today 👋
            </p>
          </div>
        </div>

        {/* ===== DASHBOARD CARDS ===== */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500 dark:text-gray-300 font-medium">
              Loading dashboard data...
            </p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : (
          <div
            className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-2 
            lg:grid-cols-3 
            xl:grid-cols-4 
            gap-4 
            sm:gap-5 
            md:gap-6
          "
          >
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="
                flex items-center justify-between 
                rounded-xl 
                border border-stroke 
                bg-white 
                p-4 sm:p-5 md:p-6 
                shadow-sm hover:shadow-md 
                transition-all duration-200 
                dark:border-strokedark 
                dark:bg-boxdark
              "
              >
                {/* Left Content */}
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-semibold text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mt-1">
                    {stat.total}
                  </span>
                  <span
                    className={`mt-1 text-xs sm:text-sm font-medium ${
                      stat.levelUp
                        ? "text-green-500"
                        : stat.levelDown
                          ? "text-red-500"
                          : "text-gray-400"
                    }`}
                  >
                    {stat.rate}
                  </span>
                </div>

                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary/10 dark:bg-primary/20 shrink-0">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutAdmin>
  );
}
