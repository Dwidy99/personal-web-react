import { useEffect, useRef, useState, FormEvent, useCallback } from "react";
import { Link } from "react-router-dom";
import LayoutAdmin from "../../../layouts/Admin";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { profileService } from "../../../services";
import SunEditorField from "@/components/general/SunEditor";

type FieldErrors = Record<string, string[]>;

type ProfileForm = {
  name: string;
  title: string;
  image: File | null;
  about: string;
  caption: string;
  description: string;
  content: string;
  tech_description: string;
};

const EMPTY_FORM: ProfileForm = {
  name: "",
  title: "",
  image: null,
  about: "",
  caption: "",
  description: "",
  content: "",
  tech_description: "",
};

function parseFieldErrors(payload: any): FieldErrors {
  if (!payload) return {};
  if (payload.errors && typeof payload.errors === "object") return payload.errors as FieldErrors;
  if (typeof payload === "object" && !Array.isArray(payload)) return payload as FieldErrors;
  return {};
}

export default function ProfilesIndex() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user") as string) : null;

  const [profileId, setProfileId] = useState<number | null>(null);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
  const [initialForm, setInitialForm] = useState<ProfileForm>(EMPTY_FORM);

  const [previewImage, setPreviewImage] = useState<string>("");
  const [initialImageUrl, setInitialImageUrl] = useState<string>("");

  useEffect(() => {
    document.title = "Edit Profile - My Portfolio";
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      toast.error("User not authenticated");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await profileService.getByUserId(user.id);

      if (!data) {
        setProfileId(null);
        setForm(EMPTY_FORM);
        setInitialForm(EMPTY_FORM);
        setPreviewImage("");
        setInitialImageUrl("");
        setErrors({});
        toast.error("Profile not found");
        return;
      }

      setProfileId(Number(data.id));

      const mapped: ProfileForm = {
        name: data.name ?? "",
        title: data.title ?? "",
        image: null,
        about: data.about ?? "",
        caption: data.caption ?? "",
        description: data.description ?? "",
        content: data.content ?? "",
        tech_description: data.tech_description ?? "",
      };

      setForm(mapped);
      setInitialForm(mapped);

      const imgUrl = data.image ?? "";
      setPreviewImage(imgUrl);
      setInitialImageUrl(imgUrl);

      setErrors({});
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.id) return;

    if (!profileId) {
      toast.error("Profile ID not found");
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("title", form.title);
      formData.append("about", form.about);
      formData.append("description", form.description);
      formData.append("content", form.content);
      formData.append("caption", form.caption);
      formData.append("tech_description", form.tech_description);
      if (form.image) formData.append("image", form.image);

      const res = await profileService.update(profileId, formData);

      toast.success(res.message || "Profile updated");

      await fetchProfile();

      setForm((prev) => ({ ...prev, image: null }));
      if (fileRef.current) fileRef.current.value = "";
    } catch (error: any) {
      const payload = error?.response?.data;
      setErrors(parseFieldErrors(payload));
      toast.error(payload?.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!form.image) return;
    const url = URL.createObjectURL(form.image);
    setPreviewImage(url);
    return () => URL.revokeObjectURL(url);
  }, [form.image]);

  const handleReset = () => {
    setErrors({});
    setForm({ ...initialForm, image: null });
    if (fileRef.current) fileRef.current.value = "";
    setPreviewImage(initialImageUrl);
  };

  if (loading) {
    return (
      <LayoutAdmin>
        <div className="rounded-lg border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-4 py-4 sm:px-6 dark:border-strokedark">
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100">
              Edit Profile
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Loading profile...</p>
          </div>
          <div className="p-6">
            <div className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          </div>
        </div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <div className="mb-4">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center justify-center rounded-lg bg-meta-4 text-white py-2 px-5 text-sm font-medium hover:bg-opacity-90"
        >
          Back
        </Link>
      </div>

      <div className="rounded-lg border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-4 py-4 sm:px-6 dark:border-strokedark">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100">
            Edit Profile
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update your profile details and content.
          </p>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  disabled={submitting}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-stroke bg-transparent p-3 text-sm text-slate-800 dark:text-white dark:border-strokedark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  disabled={submitting}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-stroke bg-transparent p-3 text-sm text-slate-800 dark:text-white dark:border-strokedark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title[0]}</p>}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                Profile Image
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[120px_1fr]">
                <div className="w-28 h-28">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="h-full w-full rounded-full object-cover border border-stroke dark:border-strokedark"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full border border-dashed border-stroke dark:border-strokedark flex items-center justify-center text-xs text-gray-500">
                      No image
                    </div>
                  )}
                </div>

                <div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    disabled={submitting}
                    onChange={(e) => setForm({ ...form, image: e.target.files?.[0] ?? null })}
                    className="w-full cursor-pointer rounded-lg border border-stroke p-2 text-sm dark:border-strokedark disabled:opacity-60"
                  />
                  {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image[0]}</p>}
                </div>
              </div>
            </div>

            {[
              { key: "about", label: "About" },
              { key: "description", label: "Description" },
              { key: "content", label: "Content" },
              { key: "tech_description", label: "Tech Description" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                  {label}
                </label>

                <SunEditorField
                  value={(form as any)[key]}
                  onChange={(val) => setForm((prev) => ({ ...prev, [key]: val }))}
                />

                {(errors as any)[key] && (
                  <p className="mt-2 text-xs text-red-500">{(errors as any)[key][0]}</p>
                )}
              </div>
            ))}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={submitting}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-gray-500 px-5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </LayoutAdmin>
  );
}
