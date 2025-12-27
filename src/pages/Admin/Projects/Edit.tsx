import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import { projectService } from "@/services";
import type { Project } from "@/types/project";

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
      const res = await projectService.update(id, formData);
      toast.success(res.message || "Project updated successfully!");
      navigate("/admin/projects");
    } catch (err: any) {
      setErrors(err?.response?.data || {});
      toast.error(err?.response?.data?.message || "Failed to update project");
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
      <div className="rounded-xl border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark sm:p-6 lg:p-8">
        {loading ? (
          <div className="py-16 text-center text-gray-500 dark:text-gray-400">Loading...</div>
        ) : !project ? (
          <div className="py-16 text-center text-gray-500 dark:text-gray-400">
            Project not found.
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleUpdate} className="space-y-6">
            {/* Top: Inputs + Image */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left */}
              <div className="lg:col-span-2 space-y-5">
                {/* Title */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                    Title
                  </label>
                  <input
                    type="text"
                    value={project.title ?? ""}
                    onChange={(e) => handleChange("title")(e.target.value)}
                    placeholder="Enter project title..."
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-slate-800 dark:border-strokedark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title[0]}</p>}
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
                    placeholder="https://your-project-link.com"
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-slate-800 dark:border-strokedark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.link && <p className="mt-1 text-xs text-red-600">{errors.link[0]}</p>}
                </div>
              </div>

              {/* Right: Image */}
              <div className="rounded-xl border border-stroke p-4 dark:border-strokedark">
                <p className="text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Project Image
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Recommended: square image.
                </p>

                <div className="mt-4 flex items-center justify-center">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt={project.title ?? "Project image"}
                      className="h-44 w-44 rounded-xl border border-stroke object-cover dark:border-strokedark"
                    />
                  ) : (
                    <div className="flex h-44 w-44 items-center justify-center rounded-xl border border-dashed border-stroke text-xs text-gray-500 dark:border-strokedark dark:text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="w-full cursor-pointer rounded-lg border border-stroke p-2 text-sm dark:border-strokedark"
                  />
                  {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image[0]}</p>}
                </div>
              </div>
            </div>

            {/* Editors */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Description */}
              <div className="rounded-xl border border-stroke p-4 dark:border-strokedark">
                <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Description
                </label>
                <div className="overflow-hidden rounded-lg border border-stroke dark:border-strokedark">
                  <SunEditorField
                    value={project.description ?? ""}
                    onChange={handleChange("description")}
                    placeholder="Write description..."
                  />
                </div>
                {errors.description && (
                  <p className="mt-2 text-xs text-red-600">{errors.description[0]}</p>
                )}
              </div>

              {/* Caption */}
              <div className="rounded-xl border border-stroke p-4 dark:border-strokedark">
                <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Caption
                </label>
                <div className="overflow-hidden rounded-lg border border-stroke dark:border-strokedark">
                  <SunEditorField
                    value={project.caption ?? ""}
                    onChange={handleChange("caption")}
                    placeholder="Write caption..."
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
                className="inline-flex items-center justify-center rounded-lg bg-gray-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
              >
                <i className="fa-solid fa-redo mr-2" /> Reset
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
              >
                <i className="fa-solid fa-save mr-2" /> Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </LayoutAdmin>
  );
}
