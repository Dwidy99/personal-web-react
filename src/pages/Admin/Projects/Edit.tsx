import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import { projectService } from "@/services";
import type { Project } from "@/types/project";
import Loading from "@/components/admin/Loading";
import SubmitButton from "@/components/admin/SubmitButton";

import SunEditorField from "@/components/general/SunEditor";

type FieldErrors = Record<string, string[]>;

export default function ProjectEdit() {
  document.title = "Edit Project - My Portfolio";

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const formRef = useRef<HTMLFormElement>(null);

  const [project, setProject] = useState<Project | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Preview for newly selected image
  useEffect(() => {
    if (!image) {
      setImagePreview("");
      return;
    }
    const url = URL.createObjectURL(image);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  // Fetch project detail
  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await projectService.getById(id);
        setProject(data);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to load project");
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const currentImage = useMemo(() => imagePreview || project?.image || "", [imagePreview, project]);

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !project) return;

    setErrors({});

    const formData = new FormData();
    formData.append("title", project.title ?? "");
    formData.append("link", project.link ?? "");
    formData.append("description", project.description ?? "");
    formData.append("caption", project.caption ?? "");
    if (image) formData.append("image", image);
    formData.append("_method", "PUT");

    try {
      setSubmitting(true);
      const res = await projectService.update(id, formData);
      toast.success(res.message || "Project updated successfully!");
      navigate("/admin/projects");
    } catch (err: any) {
      setErrors(err?.response?.data || {});
      toast.error(err?.response?.data?.message || "Failed to update project");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    // reset only local temp state (image, errors)
    formRef.current?.reset();
    setImage(null);
    setImagePreview("");
    setErrors({});
  };

  const handleChange = (key: keyof Project) => (value: string) => {
    setProject((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  return (
    <LayoutAdmin>
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/admin/projects"
          className="inline-flex w-fit items-center justify-center rounded-lg bg-meta-4 px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
        >
          <i className="fa-solid fa-arrow-left mr-2" /> Back
        </Link>

        <div className="text-left sm:text-right">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Edit Project</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Update title, link, image, description, and caption.
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="mx-auto max-w-5xl rounded-xl border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark sm:p-6 lg:p-8">
        {loading ? (
          <Loading message="Loading project data..." variant="page" className="py-16" />
        ) : !project ? (
          <div className="py-16 text-center text-gray-500 dark:text-gray-400">
            Project not found.
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleUpdate} className="space-y-6">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                Title
              </label>
              <input
                type="text"
                value={project.title ?? ""}
                onChange={(e) => handleChange("title")(e.target.value)}
                disabled={submitting}
                placeholder="Enter project title..."
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 dark:border-strokedark dark:text-white"
              />
              {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title[0]}</p>}
            </div>

            {/* Project Image */}
            <div className="rounded-xl border border-stroke p-4 dark:border-strokedark">
              <p className="text-sm font-semibold text-slate-700 dark:text-gray-200">
                Project Image
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Gunakan gambar yang jelas, disarankan rasio persegi atau landscape.
              </p>

              <div className="mt-4">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={project.title ?? "Project image"}
                    className="h-56 w-full rounded-xl border border-stroke object-cover dark:border-strokedark sm:h-72"
                  />
                ) : (
                  <div className="flex h-56 w-full items-center justify-center rounded-xl border border-dashed border-stroke text-xs text-gray-500 dark:border-strokedark dark:text-gray-400 sm:h-72">
                    No image
                  </div>
                )}
              </div>

              <div className="mt-4">
                <input
                  type="file"
                  accept="image/*"
                  disabled={submitting}
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="w-full cursor-pointer rounded-lg border border-stroke p-2 text-sm disabled:opacity-60 dark:border-strokedark"
                />
                {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image[0]}</p>}
              </div>
            </div>

            {/* Link */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                Project Link
              </label>
              <input
                type="text"
                value={project.link ?? ""}
                onChange={(e) => handleChange("link")(e.target.value)}
                disabled={submitting}
                placeholder="https://your-project-link.com"
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 dark:border-strokedark dark:text-white"
              />
              {errors.link && <p className="mt-1 text-xs text-red-600">{errors.link[0]}</p>}
            </div>

            {/* Editors */}
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Description
                </label>
                <div className="rounded-lg border border-stroke dark:border-strokedark">
                  <SunEditorField
                    value={project.description ?? ""}
                    onChange={handleChange("description")}
                    placeholder="Write description..."
                    height="320px"
                  />
                </div>
                {errors.description && (
                  <p className="mt-2 text-xs text-red-600">{errors.description[0]}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Caption
                </label>
                <div className="rounded-lg border border-stroke dark:border-strokedark">
                  <SunEditorField
                    value={project.caption ?? ""}
                    onChange={handleChange("caption")}
                    placeholder="Write caption..."
                    height="240px"
                  />
                </div>
                {errors.caption && <p className="mt-2 text-xs text-red-600">{errors.caption[0]}</p>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="reset"
                onClick={handleReset}
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-lg bg-gray-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
              >
                <i className="fa-solid fa-redo mr-2" /> Reset
              </button>

              <SubmitButton loading={submitting} icon={<i className="fa-solid fa-save" />}>
                Save Changes
              </SubmitButton>
            </div>
          </form>
        )}
      </div>
    </LayoutAdmin>
  );
}
