import { useState } from "react";
import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function AdminLayout({ children, className }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`dark:bg-boxdark-2 dark:text-bodydark min-h-screen ${className ?? ""}`}>
      {/* ===== Page Wrapper ===== */}
      <div className="flex h-screen overflow-hidden">
        {/* ===== Sidebar ===== */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* ===== Content Area ===== */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* Header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Main Content */}
          <main className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
