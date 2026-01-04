// ExperiencesEdit.tsx
import { useEffect, useRef, useState, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import SunEditorField from "@/components/general/SunEditor";
import experienceService from "@/services/experienceService";
import type { Experience } from "@/types/experience";

type Errors = Record<string, string[]>;
const FORM_ID = "experience-edit-form";

function toDateInput(value?: string | null) {
  if (!value) return "";
  return value.split("T")[0];
}

export default function ExperiencesEdit() {
  document.title = "Edit Experience - My Portfolio";

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    image: null as File | null,
  });

  const [previewImage, setPreviewImage] = useState<string>("");

  const fetchExperience = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const data: Experience = await experienceService.getById(id);

      setForm({
        name: data.name ?? "",
        description: data.description ?? "",
        start_date: toDateInput(data.start_date),
        end_date: toDateInput(data.end_date),
        image: null,
      });

      setPreviewImage(data.image ?? "");
      setErrors({});
    } catch {
      toast.error("Failed to load experience");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSubmitting(true);
    setErrors({});

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("start_date", form.start_date);
    formData.append("end_date", form.end_date);

    if (form.image) formData.append("image", form.image);

    try {
      await experienceService.update(id, formData);
      toast.success("Experience updated successfully");
      navigate("/admin/experiences");
    } catch (err: any) {
      setErrors(err.response?.data?.errors || {});
      toast.error(err.response?.data?.message || "Failed to update experience");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    fetchExperience();
    if (fileRef.current) fileRef.current.value = "";
  };

  if (loading) {
    return (
      <LayoutAdmin>
        <div className="py-20 text-center text-gray-500">Loading...</div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <div className="flex flex-col  gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/admin/experiences"
          className="inline-flex items-center justify-center rounded-lg bg-meta-4 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
        >
          Back
        </Link>
      </div>

      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Edit Experience</h3>
          <p className="mt-1 text-sm text-gray-500">Update your experience details</p>
        </div>

        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div>
                <label className="block text-sm font-medium">Job Title</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={submitting}
                  className="mt-2 w-full rounded-lg border p-3 text-sm focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium">Start Date</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    disabled={submitting}
                    className="mt-2 w-full rounded-lg border p-3 text-sm disabled:bg-gray-50"
                  />
                  {errors.start_date && (
                    <p className="mt-1 text-xs text-red-500">{errors.start_date[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">End Date</label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    disabled={submitting}
                    className="mt-2 w-full rounded-lg border p-3 text-sm disabled:bg-gray-50"
                  />
                  {errors.end_date && (
                    <p className="mt-1 text-xs text-red-500">{errors.end_date[0]}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium">Image</label>

              {previewImage ? (
                <img
                  src={previewImage}
                  className="h-40 w-full rounded-lg object-cover"
                  alt="Preview"
                />
              ) : (
                <div className="flex h-40 w-full items-center justify-center rounded-lg border bg-gray-50 text-sm text-gray-500">
                  No image
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                disabled={submitting}
                onChange={(e) => setForm({ ...form, image: e.target.files?.[0] ?? null })}
                className="w-full rounded-lg border p-2 text-sm disabled:bg-gray-50"
              />
              {errors.image && <p className="text-xs text-red-500">{errors.image[0]}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <div className="mt-2">
              <SunEditorField
                value={form.description}
                onChange={(val) => setForm({ ...form, description: val })}
              />
            </div>
            {errors.description && (
              <p className="mt-2 text-xs text-red-500">{errors.description[0]}</p>
            )}
          </div>
          <div className="flex w-full justify-end flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              type="submit"
              form={FORM_ID}
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Update"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg bg-gray-600 px-5 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
