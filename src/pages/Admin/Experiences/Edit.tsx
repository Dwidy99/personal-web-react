import { useEffect, useRef, useState, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import SunEditorField from "@/components/general/SunEditor";
import experienceService from "@/services/experienceService";
import type { Experience } from "@/types/experience";

type Errors = Record<string, string[]>;

function toDateInput(value?: string | null) {
  if (!value) return "";
  return value.split("T")[0]; // ambil YYYY-MM-DD
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

  // Load data
  const fetchExperience = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const data: Experience = await experienceService.getById(id);

      setForm({
        name: data.name,
        description: data.description,
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

  // Submit
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

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      await experienceService.update(id, formData);
      toast.success("Experience updated successfully");
      navigate("/admin/experiences");
    } catch (err: any) {
      setErrors(err.response?.data?.errors || {});
      toast.error("Failed to update experience");
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
        <div className="text-center py-20 text-gray-500">Loading...</div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <Link
        to="/admin/experiences"
        className="inline-flex items-center rounded-lg bg-meta-4 px-4 py-2 text-sm text-white"
      >
        ← Back
      </Link>

      <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-semibold">Edit Experience</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Job Title</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border p-3"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name[0]}</p>}
          </div>

          {/* Image */}
          <div>
            {previewImage && (
              <img src={previewImage} className="mb-3 h-32 w-32 rounded-md object-cover" />
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files?.[0] ?? null })}
              className="w-full rounded-lg border p-2"
            />
            {errors.image && <p className="text-xs text-red-500">{errors.image[0]}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="text-sm font-medium">End Date</label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="w-full rounded-lg border p-3"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <SunEditorField
              value={form.description}
              onChange={(val) => setForm({ ...form, description: val })}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description[0]}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button disabled={submitting} className="rounded-lg bg-primary px-5 py-2 text-white">
              {submitting ? "Saving..." : "Update"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg bg-gray-500 px-5 py-2 text-white"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
