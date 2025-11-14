import { useEffect, useRef, useState, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import ReactQuillEditor from "@/components/general/ReactQuillEditor";
import { projectService } from "@/services";
import type { Project } from "@/types/project";

export default function ProjectEdit() {
  document.title = "Edit Project - My Portfolio";

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const formRef = useRef<HTMLFormElement>(null);
  const quillDescRef = useRef<any>(null);
  const quillCaptionRef = useRef<any>(null);

  const [project, setProject] = useState<Project | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // 🔹 Fetch data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!id) return;
        const data = await projectService.getById(id);
        setProject(data);
      } catch {
        toast.error("Failed to load project");
      }
    };
    fetchProject();
  }, [id]);

  // 🔹 Update Handler
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !project) return;

    const formData = new FormData();
    formData.append("title", project.title);
    formData.append("description", project.description);
    formData.append("caption", project.caption);
    formData.append("link", project.link);
    if (image) formData.append("image", image);
    formData.append("_method", "PUT");

    try {
      const res = await projectService.update(id, formData);
      toast.success(res.message || "Project updated successfully!");
      navigate("/admin/projects");
    } catch (err: any) {
      setErrors(err.response?.data || {});
      toast.error("Failed to update project");
    }
  };

  // 🔹 Reset
  const handleReset = () => {
    formRef.current?.reset();
    setImage(null);
    setErrors({});
  };

  return (
    <LayoutAdmin>
      <Link
        to="/admin/projects"
        className="inline-flex items-center justify-center rounded-md bg-meta-4 text-white py-2 px-6 text-sm font-medium hover:bg-lime-400"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-lg border bg-white shadow-md mt-8 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit Project</h3>

        {project ? (
          <form ref={formRef} onSubmit={handleUpdate}>
            {/* Title */}
            <div className="my-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={project.title}
                onChange={(e) => setProject({ ...project, title: e.target.value })}
                className="w-full rounded-lg border border-stroke py-3 px-5 text-black focus:border-primary"
              />
              {errors.title && <p className="text-sm text-red-600">{errors.title[0]}</p>}
            </div>

            {/* Image preview */}
            {project.image && (
              <div className="my-4">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-32 h-32 rounded-lg shadow-md object-cover"
                />
              </div>
            )}

            {/* Image upload */}
            <div className="my-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full cursor-pointer rounded-lg border border-stroke py-3 px-5"
              />
              {errors.image && <p className="text-sm text-red-600">{errors.image[0]}</p>}
            </div>

            {/* Link */}
            <div className="my-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Project Link</label>
              <input
                type="text"
                value={project.link}
                onChange={(e) => setProject({ ...project, link: e.target.value })}
                className="w-full rounded-lg border border-stroke py-3 px-5 text-black focus:border-primary"
              />
              {errors.link && <p className="text-sm text-red-600">{errors.link[0]}</p>}
            </div>

            {/* Description */}
            <div className="my-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <ReactQuillEditor
                ref={quillDescRef}
                value={project.description}
                onChange={(val) => setProject({ ...project, description: val })}
                placeholder="Enter description..."
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description[0]}</p>
              )}
            </div>

            {/* Caption */}
            <div className="my-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Caption</label>
              <ReactQuillEditor
                ref={quillCaptionRef}
                value={project.caption}
                onChange={(val) => setProject({ ...project, caption: val })}
                placeholder="Enter caption..."
              />
              {errors.caption && <p className="text-sm text-red-600">{errors.caption[0]}</p>}
            </div>

            {/* Buttons */}
            <div className="flex mt-6 space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-500"
              >
                <i className="fa-solid fa-save mr-2"></i> Save
              </button>
              <button
                type="reset"
                onClick={handleReset}
                className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-400"
              >
                <i className="fa-solid fa-redo mr-2"></i> Reset
              </button>
            </div>
          </form>
        ) : (
          <p className="text-gray-500">Loading project data...</p>
        )}
      </div>
    </LayoutAdmin>
  );
}
