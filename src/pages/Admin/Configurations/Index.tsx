import { useEffect, useRef, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import LayoutAdmin from "../../../layouts/Admin";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { ConfigData, FileInputs, ValidationErrors } from "../../../types/configuration";

// Service
import { configurationService } from "../../../services";

// Cookie type
interface UserCookie {
  id: number;
  name?: string;
  email?: string;
}

export default function ConfigurationsIndex() {
  document.title = "Edit Configuration - My Portfolio";

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);

  const user: UserCookie | null = Cookies.get("user")
    ? JSON.parse(Cookies.get("user") as string)
    : null;

  // 🧾 Form state
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

  const [files, setFiles] = useState<FileInputs>({
    logo: null,
    icon: null,
    banner: null,
  });

  const [preview, setPreview] = useState({
    logo: "",
    icon: "",
    banner: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  // 🧠 Fetch Config Data
  const fetchConfig = async () => {
    try {
      if (!user?.id) {
        toast.error("Invalid user session!", { position: "top-center" });
        return;
      }

      const data = await configurationService.getByUserId(user.id);
      setForm(data);
      setPreview({
        logo: data.logo ?? "",
        icon: data.icon ?? "",
        banner: data.banner ?? "",
      });
    } catch (err) {
      toast.error("Failed to load configuration", { position: "top-center" });
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // 📝 Update Configuration
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.id) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    Object.entries(files).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    formData.append("_method", "PUT");

    try {
      const res = await configurationService.update(user.id, formData);
      toast.success(res.message || "Configuration updated successfully!", {
        position: "top-center",
      });
      navigate("/admin/configurations");
    } catch (err: any) {
      console.error(err);
      setErrors(err.response?.data ?? {});
    }
  };

  // 🔁 Reset form
  const handleReset = () => {
    formRef.current?.reset();
    setForm((prev) => ({ ...prev, protocol: "smtp" }));
    setFiles({ logo: null, icon: null, banner: null });
    setPreview({ logo: "", icon: "", banner: "" });
    setErrors({});
  };

  // 🎯 Input handlers
  const handleChange = (key: keyof ConfigData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (name: keyof FileInputs, file: File | null) => {
    setFiles((prev) => ({ ...prev, [name]: file }));
  };

  return (
    <LayoutAdmin>
      <div className="rounded-lg border bg-white shadow-md mt-8 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit Configuration</h3>

        <form ref={formRef} onSubmit={handleSubmit}>
          {/* Basic Config */}
          <div className="grid grid-cols-2 gap-2 my-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">Site Name</label>
              <input
                type="text"
                value={form.site_name}
                onChange={(e) => handleChange("site_name", e.target.value)}
                className="w-full p-3 border rounded-md"
                placeholder="Enter site name..."
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
                className="w-full p-3 border rounded-md"
              />
              {errors.protocol && <p className="text-red-500 text-xs">{errors.protocol[0]}</p>}
            </div>
          </div>

          {/* Upload section */}
          {(["logo", "icon", "banner"] as const).map((key) => (
            <div key={key} className="mb-6">
              <label className="block text-sm font-bold text-gray-700 capitalize">{key}</label>
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
