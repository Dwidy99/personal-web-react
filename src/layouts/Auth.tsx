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
      className="flex items-center justify-center h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      <div className="container flex justify-center">{children}</div>
    </div>
  );
}
