// ExperiencesCreate.tsx
import { useRef, useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import SunEditorField from "@/components/general/SunEditor";
import experienceService from "@/services/experienceService";

interface ValidationErrors {
  [key: string]: string[] | undefined;
}

const FORM_ID = "experience-create-form";

export default function ExperiencesCreate() {
  document.title = "Create Experience - My Portfolio";

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [previewImage, setPreviewImage] = useState<string>("");

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const storeExperience = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);

    if (image) formData.append("image", image);

    try {
      const res = await experienceService.create(formData);
      toast.success(res.message || "Experience created successfully");
      navigate("/admin/experiences");
    } catch (err: any) {
      const data = err.response?.data;
      setErrors(data?.errors || {});
      toast.error(data?.message || "Failed to save experience");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    formRef.current?.reset();
    setName("");
    setDescription("");
    setImage(null);
    setStartDate("");
    setEndDate("");
    setPreviewImage("");
    setErrors({});
    if (fileRef.current) fileRef.current.value = "";
  };

  const onFileChange = (file: File | null) => {
    setImage(file);
    if (!file) {
      setPreviewImage("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
  };

  return (
    <LayoutAdmin>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/admin/experiences"
          className="inline-flex items-center justify-center rounded-lg bg-meta-4 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
        >
          Back
        </Link>
      </div>

      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Create Experience</h3>
          <p className="mt-1 text-sm text-gray-500">Add a new experience to your profile</p>
        </div>

        <form id={FORM_ID} ref={formRef} onSubmit={storeExperience} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div>
                <label className="block text-sm font-medium">Job Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
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
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
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
                onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
                className="w-full rounded-lg border p-2 text-sm disabled:bg-gray-50"
              />
              {errors.image && <p className="text-xs text-red-500">{errors.image[0]}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <div className="mt-2">
              <SunEditorField value={description} onChange={setDescription} />
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
              {submitting ? "Saving..." : "Save"}
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
