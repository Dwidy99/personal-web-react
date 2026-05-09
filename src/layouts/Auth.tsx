import "@/assets/admin/css/tailwind.css";
import "@/assets/admin/css/satoshi.css";
import "@/assets/admin/css/style.css";

interface AuthLayoutProps {
  children: React.ReactNode;
  backgroundUrl?: string;
}

export default function AuthLayout({
  children,
  backgroundUrl = "/images/bg.png",
}: AuthLayoutProps) {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-8"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      <div className="container flex w-full justify-center">{children}</div>
    </div>
  );
}
