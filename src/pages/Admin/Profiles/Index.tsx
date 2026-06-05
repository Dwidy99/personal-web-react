import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import profileService from "@/services/profileService";
import Loading from "@/components/admin/Loading";
import SubmitButton from "@/components/admin/SubmitButton";
import CKEditorField from "@/components/general/CKEditorField";
import type {
  AdminProfile,
  AdminProfileEditorKey,
  AdminProfileForm,
  AdminProfileFormErrors,
} from "@/types/admin/profiles";
import {
  getErrorMessage,
  getValidationErrors,
} from "@/features/admin/shared/utils/apiError";

const EMPTY_FORM: AdminProfileForm = {
  name: "",
  title: "",
  image: null,
  about: "",
  caption: "",
  description: "",
  content: "",
  tech_description: "",
};
const PROFILE_EDITOR_UPLOAD_ENDPOINT = "/api/admin/profiles/editor-upload";
const EMPTY_EDITOR_UPLOADS: Record<AdminProfileEditorKey, number> = {
  about: 0,
  description: 0,
  content: 0,
  tech_description: 0,
};

function mapProfileToForm(profile: AdminProfile): AdminProfileForm {
  return {
    name: profile.name ?? "",
    title: profile.title ?? "",
    image: null,
    about: profile.about ?? "",
    caption: profile.caption ?? "",
    description: profile.description ?? "",
    content: profile.content ?? "",
    tech_description: profile.tech_description ?? "",
  };
}

export default function ProfilesIndex() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [profileId, setProfileId] = useState<number | null>(null);
  const [errors, setErrors] = useState<AdminProfileFormErrors>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editorUploads, setEditorUploads] =
    useState<Record<AdminProfileEditorKey, number>>(EMPTY_EDITOR_UPLOADS);

  const [form, setForm] = useState<AdminProfileForm>(EMPTY_FORM);
  const [initialForm, setInitialForm] = useState<AdminProfileForm>(EMPTY_FORM);

  const [previewImage, setPreviewImage] = useState<string>("");
  const [initialImageUrl, setInitialImageUrl] = useState<string>("");
  const pendingEditorUploads = Object.values(editorUploads).reduce((total, count) => total + count, 0);
  const isSaving = submitting || pendingEditorUploads > 0;

  const setEditorUploadCount = (field: AdminProfileEditorKey) => (count: number) => {
    setEditorUploads((prev) => ({ ...prev, [field]: count }));
  };

  useEffect(() => {
    document.title = "Edit Profile - My Portfolio";
  }, []);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      try {
        const data = await profileService.getMe();

        if (!alive) return;

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

        const mapped = mapProfileToForm(data);

        setForm(mapped);
        setInitialForm(mapped);

        const imgUrl = data.image ?? "";
        setPreviewImage(imgUrl);
        setInitialImageUrl(imgUrl);

        setErrors({});
      } catch (error: unknown) {
        if (!alive) return;
        toast.error(getErrorMessage(error, "Failed to load profile"));
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!form.image) return;
    const url = URL.createObjectURL(form.image);
    setPreviewImage(url);
    return () => URL.revokeObjectURL(url);
  }, [form.image]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profileId) {
      toast.error("Profile ID not found");
      return;
    }

    if (pendingEditorUploads > 0) {
      toast.error("Tunggu upload gambar selesai sebelum menyimpan profile.");
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("title", form.title);
      formData.append("about", form.about);
      formData.append("caption", form.caption);
      formData.append("description", form.description);
      formData.append("content", form.content);
      formData.append("tech_description", form.tech_description);
      if (form.image) formData.append("image", form.image);

      const res = await profileService.update(profileId, formData);
      toast.success(res.message || "Profile updated");

      const refreshed = await profileService.getMe();
      if (refreshed) {
        setProfileId(Number(refreshed.id));

        const mapped = mapProfileToForm(refreshed);

        setForm(mapped);
        setInitialForm(mapped);

        const imgUrl = refreshed.image ?? "";
        setPreviewImage(imgUrl);
        setInitialImageUrl(imgUrl);

        setErrors({});
      }

      setForm((prev) => ({ ...prev, image: null }));
      if (fileRef.current) fileRef.current.value = "";
    } catch (error: unknown) {
      setErrors(getValidationErrors(error));
      toast.error(getErrorMessage(error, "Failed to update profile"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setErrors({});
    setForm({ ...initialForm, image: null });
    if (fileRef.current) fileRef.current.value = "";
    setPreviewImage(initialImageUrl);
  };

  if (loading) {
    return (
      <LayoutAdmin>
        <div className="p-6">
          <Loading message="Loading profile..." variant="page" className="py-16" />
        </div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <Link
        to="/admin/dashboard"
        className="inline-flex h-11 items-center justify-center rounded-lg bg-meta-4 px-5 my-2 text-sm font-medium text-white hover:bg-opacity-90"
      >
        Back
      </Link>

      <div className="rounded-lg border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-4 py-4 sm:px-6 dark:border-strokedark">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:px-2">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100">
                Edit Profile
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Update your profile details and content.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <SubmitButton
                form="profile-form"
                disabled={pendingEditorUploads > 0}
                loading={isSaving}
                loadingText={pendingEditorUploads > 0 ? "Uploading images..." : "Saving..."}
                className="h-11 bg-blue-800 px-5"
              >
                Save
              </SubmitButton>

              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-gray-500 px-5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  disabled={isSaving}
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
                  disabled={isSaving}
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
                <div className="h-28 w-28">
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
                    disabled={isSaving}
                    onChange={(e) => setForm({ ...form, image: e.target.files?.[0] ?? null })}
                    className="w-full cursor-pointer rounded-lg border border-stroke p-2 text-sm dark:border-strokedark disabled:opacity-60"
                  />
                  {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image[0]}</p>}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                About
              </label>
              <CKEditorField
                value={form.about}
                onChange={(val) => setForm((p) => ({ ...p, about: val }))}
                placeholder="Write profile about..."
                height="300px"
                minHeight="240px"
                uploadEndpoint={PROFILE_EDITOR_UPLOAD_ENDPOINT}
                onPendingUploadsChange={setEditorUploadCount("about")}
              />
              {editorUploads.about > 0 && (
                <p className="mt-2 text-xs text-sky-600">
                  Uploading {editorUploads.about} image{editorUploads.about > 1 ? "s" : ""}...
                </p>
              )}
              {errors.about && <p className="mt-2 text-xs text-red-500">{errors.about[0]}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                Description
              </label>
              <CKEditorField
                value={form.description}
                onChange={(val) => setForm((p) => ({ ...p, description: val }))}
                placeholder="Write profile description..."
                height="340px"
                minHeight="260px"
                uploadEndpoint={PROFILE_EDITOR_UPLOAD_ENDPOINT}
                onPendingUploadsChange={setEditorUploadCount("description")}
              />
              {editorUploads.description > 0 && (
                <p className="mt-2 text-xs text-sky-600">
                  Uploading {editorUploads.description} image
                  {editorUploads.description > 1 ? "s" : ""}...
                </p>
              )}
              {errors.description && (
                <p className="mt-2 text-xs text-red-500">{errors.description[0]}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                Content
              </label>
              <CKEditorField
                value={form.content}
                onChange={(val) => setForm((p) => ({ ...p, content: val }))}
                placeholder="Write profile content..."
                height="340px"
                minHeight="260px"
                uploadEndpoint={PROFILE_EDITOR_UPLOAD_ENDPOINT}
                onPendingUploadsChange={setEditorUploadCount("content")}
              />
              {editorUploads.content > 0 && (
                <p className="mt-2 text-xs text-sky-600">
                  Uploading {editorUploads.content} image
                  {editorUploads.content > 1 ? "s" : ""}...
                </p>
              )}
              {errors.content && <p className="mt-2 text-xs text-red-500">{errors.content[0]}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                Tech Description
              </label>
              <CKEditorField
                value={form.tech_description}
                onChange={(val) => setForm((p) => ({ ...p, tech_description: val }))}
                placeholder="Write tech description..."
                height="340px"
                minHeight="260px"
                uploadEndpoint={PROFILE_EDITOR_UPLOAD_ENDPOINT}
                onPendingUploadsChange={setEditorUploadCount("tech_description")}
              />
              {editorUploads.tech_description > 0 && (
                <p className="mt-2 text-xs text-sky-600">
                  Uploading {editorUploads.tech_description} image
                  {editorUploads.tech_description > 1 ? "s" : ""}...
                </p>
              )}
              {errors.tech_description && (
                <p className="mt-2 text-xs text-red-500">{errors.tech_description[0]}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </LayoutAdmin>
  );
}
