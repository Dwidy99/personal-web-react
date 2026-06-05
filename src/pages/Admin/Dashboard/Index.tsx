import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import { TbCategory2 } from "react-icons/tb";
import { LuSignpostBig } from "react-icons/lu";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { SlPicture } from "react-icons/sl";
import { FiArrowUpRight, FiGrid } from "react-icons/fi";
import Loading from "@/components/admin/Loading";
import { Api } from "@/services";
import { getErrorMessage } from "@/features/admin/shared/utils/apiError";

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
  description: string;
  href: string;
  icon: JSX.Element;
  tone: string;
  rateTone: string;
}

type DashboardResponse = {
  success?: boolean;
  status?: boolean;
  message?: string;
  data: DashboardData;
};

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

  const fetchDashboardData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const response = await Api.get<DashboardResponse>("/api/admin/dashboard");
      setDashboardData(response.data.data);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Failed to load dashboard data."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboardData();
  }, [fetchDashboardData]);

  const statsData: StatCard[] = useMemo(
    () => [
      {
        title: "Categories",
        total: dashboardData.categories,
        rate: "+0.43%",
        description: "Content taxonomy",
        href: "/admin/categories",
        icon: <TbCategory2 className="text-2xl" />,
        tone: "bg-primary/10 text-primary",
        rateTone: "bg-success/10 text-success",
      },
      {
        title: "Posts",
        total: dashboardData.posts,
        rate: "+2.15%",
        description: "Published writing",
        href: "/admin/posts",
        icon: <LuSignpostBig className="text-2xl" />,
        tone: "bg-secondary/20 text-primary",
        rateTone: "bg-success/10 text-success",
      },
      {
        title: "Experiences",
        total: dashboardData.experiences,
        rate: "+2.59%",
        description: "Career timeline",
        href: "/admin/experiences",
        icon: <MdOutlineProductionQuantityLimits className="text-2xl" />,
        tone: "bg-warning/10 text-warning",
        rateTone: "bg-success/10 text-success",
      },
      {
        title: "Projects",
        total: dashboardData.projects,
        rate: "-0.95%",
        description: "Portfolio showcase",
        href: "/admin/projects",
        icon: <SlPicture className="text-2xl" />,
        tone: "bg-success/10 text-success",
        rateTone: "bg-danger/10 text-danger",
      },
    ],
    [dashboardData]
  );

  const quickActions = [
    { label: "Add project", href: "/admin/projects/create" },
    { label: "Write post", href: "/admin/posts/create" },
    { label: "Manage categories", href: "/admin/categories" },
    { label: "Update profile", href: "/admin/profiles" },
  ];

  const totalItems = Object.values(dashboardData).reduce((total, value) => total + value, 0);

  return (
    <LayoutAdmin>
      <div className="space-y-6">
        <section className="rounded-lg border border-stroke bg-white p-5 shadow-sm dark:border-strokedark dark:bg-boxdark md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase text-primary">
                <FiGrid className="text-sm" />
                Admin Dashboard
              </span>
              <h1 className="text-title-sm font-bold text-black dark:text-white md:text-title-md">
                Dashboard Overview
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-body dark:text-bodydark">
                Pantau konten portfolio, publikasi, dan aktivitas utama dari satu halaman yang lebih
                ringkas.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex">
              <div className="rounded-md border border-stroke px-4 py-3 dark:border-strokedark">
                <p className="text-xs font-medium text-bodydark2">Tracked items</p>
                <p className="mt-1 text-2xl font-bold text-black dark:text-white">{totalItems}</p>
              </div>
              <div className="rounded-md border border-stroke px-4 py-3 dark:border-strokedark">
                <p className="text-xs font-medium text-bodydark2">Modules</p>
                <p className="mt-1 text-2xl font-bold text-black dark:text-white">4</p>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <Loading message="Loading dashboard data..." />
        ) : error ? (
          <div className="rounded-lg border border-danger/30 bg-danger/5 p-6 text-danger">
            <p className="font-semibold">{error}</p>
          </div>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statsData.map((stat) => (
                <Link
                  key={stat.title}
                  to={stat.href}
                  className="group rounded-lg border border-stroke bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-strokedark dark:bg-boxdark"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${stat.tone}`}
                    >
                      {stat.icon}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${stat.rateTone}`}
                    >
                      {stat.rate}
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-medium text-bodydark2">{stat.description}</p>
                    <div className="mt-2 flex items-end justify-between gap-3">
                      <div>
                        <h2 className="text-3xl font-bold text-black dark:text-white">
                          {stat.total}
                        </h2>
                        <p className="mt-1 text-base font-semibold text-black dark:text-white">
                          {stat.title}
                        </p>
                      </div>
                      <FiArrowUpRight className="mb-1 text-lg text-bodydark2 transition group-hover:text-primary" />
                    </div>
                  </div>
                </Link>
              ))}
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="rounded-lg border border-stroke bg-white p-5 shadow-sm dark:border-strokedark dark:bg-boxdark md:p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-black dark:text-white">Quick Actions</h2>
                    <p className="mt-1 text-sm text-bodydark2">
                      Akses cepat untuk pekerjaan admin yang paling sering dibuka.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {quickActions.map((action) => (
                    <Link
                      key={action.href}
                      to={action.href}
                      className="flex items-center justify-between rounded-md border border-stroke px-4 py-3 text-sm font-semibold text-black transition hover:border-primary hover:text-primary dark:border-strokedark dark:text-white"
                    >
                      {action.label}
                      <FiArrowUpRight className="text-base" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-stroke bg-white p-5 shadow-sm dark:border-strokedark dark:bg-boxdark md:p-6">
                <h2 className="text-lg font-bold text-black dark:text-white">Content Snapshot</h2>
                <div className="mt-5 space-y-4">
                  {statsData.map((stat) => (
                    <div key={stat.title}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-body dark:text-bodydark">
                          {stat.title}
                        </span>
                        <span className="font-semibold text-black dark:text-white">
                          {stat.total}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-2 dark:bg-meta-4">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{
                            width: `${Math.min(100, Math.max(8, (stat.total / Math.max(totalItems, 1)) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </LayoutAdmin>
  );
}
