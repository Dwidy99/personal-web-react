import { useEffect, useRef, useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import LayoutAdmin from "../../../layouts/Admin";
import ReactQuillEditor from "../../../components/general/ReactQuillEditor";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

// Service
import { profileService } from "../../../services";

export default function ProfilesIndex() {
  document.title = "Edit Profile - My Portfolio";

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);
  // const quillRef = useRef(null);

  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user") as string) : null;
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [form, setForm] = useState({
    name: "",
    title: "",
    image: null as File | null,
    about: "",
    caption: "",
    description: "",
    content: "",
    tech_description: "",
  });

  const [previewImage, setPreviewImage] = useState<string>("");

  // Fetch Profile
  const fetchProfile = async () => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const data = await profileService.getByUserId(user.id);
      setForm({
        name: data.name ?? "",
        title: data.title ?? "",
        image: null,
        about: data.about ?? "",
        caption: data.caption ?? "",
        description: data.description ?? "",
        content: data.content ?? "",
        tech_description: data.tech_description ?? "",
      });
      setPreviewImage(data.image ?? "");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.id) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value as string | Blob);
    });

    try {
      const res = await profileService.update(user.id, formData);
      toast.success(res.message || "Profile updated successfully!");
      navigate("/admin/profiles");
    } catch (error: any) {
      setErrors(error.response?.data || {});
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  // Reset
  const handleReset = () => {
    formRef.current?.reset();
    setErrors({});
    setForm({
      name: "",
      title: "",
      image: null,
      about: "",
      caption: "",
      description: "",
      content: "",
      tech_description: "",
    });
    setPreviewImage("");
  };

  return (
    <LayoutAdmin>
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center justify-center rounded-md bg-meta-4 text-white py-2 px-6 text-sm font-bold hover:bg-lime-400"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-lg border bg-white shadow-md mt-8 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit Profile</h3>

        <form ref={formRef} onSubmit={handleSubmit}>
          {/* Name + Title */}
          <div className="grid grid-cols-2 gap-2 my-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 border rounded-md"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-3 border rounded-md"
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title[0]}</p>}
            </div>
          </div>

          {/* Image */}
          {previewImage && (
            <img
              src={previewImage}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files ? e.target.files[0] : null })}
            className="w-full border p-2 rounded-md mb-4"
          />
          {errors.image && <p className="text-red-500 text-xs">{errors.image[0]}</p>}

          {/* Rich Text Fields */}
          {["about", "description", "content", "tech_description"].map((key) => (
            <div key={key} className="mb-6">
              <label className="block text-sm font-bold text-gray-700 capitalize">
                {key.replace("_", " ")}
              </label>
              <ReactQuillEditor
                // ref={quillRef}
                value={(form as any)[key]}
                onChange={(val) => setForm({ ...form, [key]: val })}
              />
              {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key][0]}</p>}
            </div>
          ))}

          {/* Buttons */}
          <div className="flex mt-5 space-x-4">
            <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md">
              <i className="fa-solid fa-save mr-2"></i> Save
            </button>
            <button
              type="reset"
              onClick={handleReset}
              className="bg-gray-500 text-white py-2 px-6 rounded-md"
            >
              <i className="fa-solid fa-redo mr-2"></i> Reset
            </button>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
