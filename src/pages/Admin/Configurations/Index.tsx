import { useEffect, useRef, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../services/Api";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

// ===== Types =====
interface UserCookie {
  id: number;
  name?: string;
  email?: string;
}

interface ConfigData {
  abbreviation: string;
  tagline: string;
  about: string;
  description: string;
  website_url: string;
  email: string;
  backup_email: string;
  keywords: string;
  meta_text: string;
  google_map: string;
  encryption: string;
  link_text: string;
  link_website: string;
  summary: string;

  site_name: string;
  protocol: string;
  smtp_host: string;
  smtp_port: string;
  smtp_timeout: string;
  smtp_user: string;
  smtp_pass: string;
  pagination: string;

  logo: string;
  icon: string;
  banner: string;
}

type ValidationErrors = Partial<Record<keyof ConfigData, string[]>>;

export default function ConfigurationsIndex() {
  document.title = "Edit Configuration - My Portfolio";

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);
  const token = Cookies.get("token");

  const [form, setForm] = useState<ConfigData>({
    abbreviation: "",
    tagline: "",
    about: "",
    description: "",
    website_url: "",
    email: "",
    backup_email: "",
    keywords: "",
    meta_text: "",
    google_map: "",
    encryption: "",
    link_text: "",
    link_website: "",
    summary: "",
    site_name: "",
    protocol: "smtp",
    smtp_host: "",
    smtp_port: "",
    smtp_timeout: "",
    smtp_user: "",
    smtp_pass: "",
    pagination: "",
    logo: "",
    icon: "",
    banner: "",
  });

  const [files, setFiles] = useState<{
    logo: File | null;
    icon: File | null;
    banner: File | null;
  }>({ logo: null, icon: null, banner: null });

  const [preview, setPreview] = useState({
    logo: "",
    icon: "",
    banner: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const user: UserCookie | null = Cookies.get("user")
    ? JSON.parse(Cookies.get("user") as string)
    : null;

  // ===== Fetch configuration data =====
  const fetchDataConfiguration = async () => {
    if (!user?.id || !token) {
      toast.error("User authentication error!", { position: "top-center" });
      return;
    }

    try {
      const response = await Api.get<{ data: ConfigData }>(`/api/admin/configurations/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data.data;
      if (!data) {
        toast.error("Configuration data not found!", { position: "top-center" });
        return;
      }

      setForm(data);
      setPreview({
        logo: data.logo ?? "",
        icon: data.icon ?? "",
        banner: data.banner ?? "",
      });
    } catch (error) {
      toast.error("Failed to fetch configuration data", { position: "top-center" });
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataConfiguration();
  }, []);

  // ===== Update configuration =====
  const updateConfigurations = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.id || !token) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (files.logo) formData.append("logo", files.logo);
    if (files.icon) formData.append("icon", files.icon);
    if (files.banner) formData.append("banner", files.banner);

    formData.append("_method", "PUT");

    try {
      const response = await Api.post(`/api/admin/configurations/${user.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message, { position: "top-center", duration: 4000 });
      navigate("/admin/configurations");
    } catch (error: any) {
      console.error(error);
      setErrors(error.response?.data ?? {});
    }
  };

  // ===== Reset form =====
  const handleReset = () => {
    formRef.current?.reset();
    setForm((prev) => ({ ...prev, protocol: "smtp" }));
    setFiles({ logo: null, icon: null, banner: null });
    setPreview({ logo: "", icon: "", banner: "" });
    setErrors({});
  };

  // ===== Handle text input changes =====
  const handleChange = (key: keyof ConfigData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ===== Handle file uploads =====
  const handleFileChange = (name: keyof typeof files, file: File | null) => {
    setFiles((prev) => ({ ...prev, [name]: file }));
  };

  // ===== JSX =====
  return (
    <LayoutAdmin>
      <div className="rounded-lg border bg-white shadow-md mt-8 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit Configuration</h3>

        <form ref={formRef} onSubmit={updateConfigurations}>
          {/* Example input (Site Name & Protocol) */}
          <div className="grid grid-cols-2 gap-2 my-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">Site Name</label>
              <input
                type="text"
                value={form.site_name}
                onChange={(e) => handleChange("site_name", e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
                placeholder="Enter site name"
              />
              {errors.site_name && <p className="text-red-500 text-xs">{errors.site_name[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">
                Protocol / SMTP Mailer
              </label>
              <input
                type="text"
                value={form.protocol}
                onChange={(e) => handleChange("protocol", e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
              />
              {errors.protocol && <p className="text-red-500 text-xs">{errors.protocol[0]}</p>}
            </div>
          </div>

          {/* Upload logo, icon, banner */}
          {(["logo", "icon", "banner"] as const).map((key) => (
            <div key={key} className="mb-6">
              <label className="block text-sm font-bold text-gray-700">{key}</label>
              {preview[key] && (
                <img
                  src={preview[key]}
                  alt={key}
                  className="w-20 h-20 object-cover rounded-md mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(key, e.target.files?.[0] ?? null)}
                className="w-full border rounded px-3 py-2"
              />
              {errors[key] && <p className="text-red-500 text-xs">{errors[key]?.[0]}</p>}
            </div>
          ))}

          {/* Buttons */}
          <div className="flex mt-5 space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-500"
            >
              <i className="fa-solid fa-save mr-2"></i> Save
            </button>
            <button
              type="reset"
              onClick={handleReset}
              className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-400"
            >
              <i className="fa-solid fa-redo mr-2"></i> Reset
            </button>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
