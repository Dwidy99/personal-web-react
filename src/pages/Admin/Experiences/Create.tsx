import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, FormEvent } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import toast from "react-hot-toast";

import SunEditorField from "@/components/general/SunEditor";
import { experienceService } from "@/services";

interface ValidationErrors {
  [key: string]: string[] | undefined;
}

export default function ExperiencesCreate() {
  document.title = "Create Experience - My Portfolio";

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // ======================
  // Submit
  // ======================
  const storeExperience = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);

    if (image) {
      formData.append("image", image);
    }

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
    setErrors({});
  };

  return (
    <LayoutAdmin>
      {/* Back */}
      <Link
        to="/admin/experiences"
        className="inline-flex items-center rounded-lg bg-meta-4 text-white py-2 px-6 text-sm font-medium hover:bg-opacity-90"
      >
        ← Back
      </Link>

      <div className="mt-8 rounded-lg border bg-white shadow-md p-6">
        <h3 className="text-xl font-semibold mb-6">Create Experience</h3>

        <form ref={formRef} onSubmit={storeExperience} className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold mb-1">Job Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              className="w-full rounded-lg border p-3 text-sm focus:ring-2 focus:ring-primary"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold mb-1">Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              disabled={submitting}
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="w-full rounded-lg border p-2 text-sm"
            />
            {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image[0]}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={submitting}
                className="w-full rounded-lg border p-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={submitting}
                className="w-full rounded-lg border p-3 text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <SunEditorField value={description} onChange={setDescription} />
            {errors.description && (
              <p className="text-xs text-red-500 mt-2">{errors.description[0]}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={submitting}
              className="inline-flex items-center rounded-lg bg-gray-500 px-6 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
