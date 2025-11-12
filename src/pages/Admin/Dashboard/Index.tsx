import { useEffect, useState } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../services/Api";
import Cookies from "js-cookie";
import CardDataStats from "../../../components/admin/CardDataStats";
import { TbCategory2 } from "react-icons/tb";
import { LuSignpostBig } from "react-icons/lu";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { SlPicture } from "react-icons/sl";

// ✅ Definisikan tipe data untuk dashboard
interface DashboardData {
  categories: number;
  posts: number;
  experiences: number;
  projects: number;
}

// ✅ Definisikan tipe data untuk tiap card
interface StatCard {
  title: string;
  total: number;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  icon: JSX.Element;
}

export default function DashboardIndex() {
  // ✅ Judul halaman
  document.title = "Dashboard - My Portfolio";

  // ✅ State data dashboard
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    categories: 0,
    posts: 0,
    experiences: 0,
    projects: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // ✅ Token dari cookies
  const token = Cookies.get("token");

  // ✅ Fetch API saat pertama kali halaman dimuat
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await Api.get("/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ✅ Data statistik untuk CardDataStats
  const statsData: StatCard[] = [
    {
      title: "Total Categories",
      total: dashboardData.categories,
      rate: "0.43%",
      levelUp: true,
      icon: <TbCategory2 className="text-xl text-primary dark:text-white" />,
    },
    {
      title: "Total Posts",
      total: dashboardData.posts,
      rate: "2.15%",
      levelUp: true,
      icon: <LuSignpostBig className="text-xl text-primary dark:text-white" />,
    },
    {
      title: "Total Experiences",
      total: dashboardData.experiences,
      rate: "2.59%",
      levelUp: true,
      icon: <MdOutlineProductionQuantityLimits className="text-xl text-primary dark:text-white" />,
    },
    {
      title: "Total Projects",
      total: dashboardData.projects,
      rate: "0.95%",
      levelDown: true,
      icon: <SlPicture className="text-xl text-primary dark:text-white" />,
    },
  ];

  return (
    <LayoutAdmin>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* ✅ Loading / Error / Data states */}
        {loading ? (
          <div className="col-span-4 text-center text-lg font-semibold text-gray-500 dark:text-gray-300">
            Loading...
          </div>
        ) : error ? (
          <div className="col-span-4 text-center text-red-500 font-medium">{error}</div>
        ) : (
          // ✅ Render CardDataStats
          statsData.map((stat, index) => (
            <CardDataStats
              key={index}
              title={stat.title}
              total={stat.total}
              rate={stat.rate}
              levelUp={stat.levelUp}
              levelDown={stat.levelDown}
            >
              {stat.icon}
            </CardDataStats>
          ))
        )}
      </div>
    </LayoutAdmin>
  );
}
