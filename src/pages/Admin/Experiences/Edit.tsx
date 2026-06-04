import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import LayoutAdmin from "@/layouts/Admin";
import Loading from "@/components/admin/Loading";
import SubmitButton from "@/components/admin/SubmitButton";
import CKEditorField from "@/components/general/CKEditorField";
import experienceService from "@/services/experienceService";
import type {
  AdminExperienceForm,
  AdminExperienceFormErrors,
} from "@/features/admin/experiences/types";
import {
  getErrorMessage,
  getValidationErrors,
} from "@/features/admin/shared/utils/apiError";

const FORM_ID = "experience-edit-form";
const EXPERIENCE_EDITOR_UPLOAD_ENDPOINT = "/api/admin/experiences/editor-upload";

const initialForm: AdminExperienceForm = {
  name: "",
  description: "",
  start_date: "",
  end_date: "",
  image: null,
};

function toDateInput(value?: string | null) {
  if (!value) return "";
  return value.split("T")[0];
}

export default function ExperiencesEdit() {
  document.title = "Edit Experience - My Portfolio";

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<AdminExperienceForm>(initialForm);
  const [currentImage, setCurrentImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [errors, setErrors] = useState<AdminExperienceFormErrors>({});
  const [loadingExperience, setLoadingExperience] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [descriptionUploads, setDescriptionUploads] = useState(0);

  const isSaving = submitting || descriptionUploads > 0;

  const fetchExperience = useCallback(async () => {
    if (!id) return;

    setLoadingExperience(true);

    try {
      const data = await experienceService.getById(id);

      setForm({
        name: data.name ?? "",
        description: data.description ?? "",
        start_date: toDateInput(data.start_date),
        end_date: toDateInput(data.end_date),
        image: null,
      });
      setCurrentImage(data.image ?? "");
      setPreviewImage("");
      setErrors({});
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to load experience"));
    } finally {
      setLoadingExperience(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchExperience();
  }, [fetchExperience]);

  useEffect(() => {
    if (!form.image) {
      setPreviewImage("");
      return;
    }

    const url = URL.createObjectURL(form.image);
    setPreviewImage(url);

    return () => URL.revokeObjectURL(url);
  }, [form.image]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    setErrors({});

    if (descriptionUploads > 0) {
      toast.error("Tunggu upload gambar selesai sebelum menyimpan experience.");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("start_date", form.start_date);
    formData.append("end_date", form.end_date);
    if (form.image) formData.append("image", form.image);

    try {
      const response = await experienceService.update(id, formData);
      toast.success(response.message || "Experience updated successfully.");
      navigate("/admin/experiences");
    } catch (error: unknown) {
      setErrors(getValidationErrors(error));
      toast.error(getErrorMessage(error, "Failed to update experience"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    void fetchExperience();
    if (fileRef.current) fileRef.current.value = "";
  };

  const shownImage = previewImage || currentImage;
  const shownImageLabel = previewImage ? "New image preview" : "Current image";

  return (
    <LayoutAdmin>
      <div className="mb-4">
        <Link
          to="/admin/experiences"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-meta-4 px-4 text-sm font-medium text-white transition hover:bg-opacity-90"
        >
          <i className="fa-solid fa-arrow-left mr-2" /> Back
        </Link>
      </div>

      <div className="mx-auto max-w-6xl rounded-lg border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-4 py-4 dark:border-strokedark sm:px-6">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Edit Experience
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update timeline, image, and rich description.
          </p>
        </div>

        {loadingExperience ? (
          <Loading message="Loading experience..." variant="page" className="py-12" />
        ) : (
          <form id={FORM_ID} onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <section className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                    Experience Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    disabled={isSaving}
                    className="w-full rounded-lg border border-stroke bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 dark:border-strokedark dark:bg-transparent dark:text-white dark:placeholder-gray-500"
                    placeholder="Example: Frontend Developer"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.start_date}
                      onChange={(e) => setForm((prev) => ({ ...prev, start_date: e.target.value }))}
                      disabled={isSaving}
                      className="w-full rounded-lg border border-stroke bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 dark:border-strokedark dark:bg-transparent dark:text-white"
                    />
                    {errors.start_date && (
                      <p className="mt-1 text-xs text-red-500">{errors.start_date[0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.end_date}
                      onChange={(e) => setForm((prev) => ({ ...prev, end_date: e.target.value }))}
                      disabled={isSaving}
                      className="w-full rounded-lg border border-stroke bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 dark:border-strokedark dark:bg-transparent dark:text-white"
                    />
                    {errors.end_date && (
                      <p className="mt-1 text-xs text-red-500">{errors.end_date[0]}</p>
                    )}
                  </div>
                </div>
              </section>

              <aside className="space-y-3">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200">
                      Experience Image
                    </label>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {shownImageLabel}
                    </span>
                  </div>

                  <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-stroke bg-gray-50 dark:border-strokedark dark:bg-boxdark-2">
                    {shownImage ? (
                      <img
                        src={shownImage}
                        alt="Experience"
                        className="h-full w-full object-contain p-4"
                      />
                    ) : (
                      <div className="px-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        <i className="fa-regular fa-image mb-3 block text-3xl" />
                        No image
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    disabled={isSaving}
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setForm((prev) => ({ ...prev, image: file }));
                    }}
                    className="w-full cursor-pointer rounded-lg border border-stroke bg-transparent px-3 py-2.5 text-sm text-slate-800 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 hover:file:bg-gray-200 disabled:opacity-60 dark:border-strokedark dark:text-white dark:file:bg-boxdark-2 dark:hover:file:bg-boxdark"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Kosongkan file jika tidak ingin mengganti gambar.
                  </p>
                  {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image[0]}</p>}
                </div>
              </aside>
            </div>

            <div className="border-t border-stroke p-4 dark:border-strokedark sm:p-6">
              <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Description <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Drag the lower edge to resize the editor.
                </span>
              </div>

              <CKEditorField
                value={form.description}
                onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
                placeholder="Write experience description..."
                height="340px"
                minHeight="260px"
                uploadEndpoint={EXPERIENCE_EDITOR_UPLOAD_ENDPOINT}
                onPendingUploadsChange={setDescriptionUploads}
              />

              {descriptionUploads > 0 && (
                <p className="mt-2 text-xs text-sky-600">
                  Uploading {descriptionUploads} image{descriptionUploads > 1 ? "s" : ""}...
                </p>
              )}
              {errors.description && (
                <p className="mt-2 text-xs text-red-500">{errors.description[0]}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-stroke px-4 py-4 dark:border-strokedark sm:flex-row sm:justify-end sm:px-6">
              <SubmitButton
                form={FORM_ID}
                disabled={descriptionUploads > 0}
                loading={isSaving}
                loadingText={descriptionUploads > 0 ? "Uploading images..." : "Saving..."}
                icon={<i className="fa-solid fa-save" />}
                className="h-11 rounded-lg px-5 font-semibold"
              >
                Save Changes
              </SubmitButton>

              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-600 px-5 text-sm font-semibold text-white transition hover:bg-opacity-90 disabled:opacity-60"
              >
                <i className="fa-solid fa-rotate-left mr-2" /> Reset
              </button>
            </div>
          </form>
        )}
      </div>
    </LayoutAdmin>
  );
}
