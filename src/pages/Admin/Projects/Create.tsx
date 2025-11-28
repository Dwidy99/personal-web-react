import { useRef, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import ReactQuillEditor from "@/components/general/ReactQuillEditor";
import { projectService } from "@/services";
import type { ApiResponse } from "@/types/common";
import type { Project } from "@/types/project";

interface ProjectsCreateProps {
  fetchData?: () => Promise<void>;
}

export default function ProjectsCreate({ fetchData }: ProjectsCreateProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const quillDescRef = useRef<any>(null);
  const quillCaptionRef = useRef<any>(null);

  // 🔹 State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [caption, setCaption] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // 🔹 Submit Handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("caption", caption);
    formData.append("link", link);
    if (image) formData.append("image", image);

    try {
      const res: ApiResponse<Project> = await projectService.create(formData);
      toast.success(res.message || "Project created successfully!", {
        position: "top-center",
      });
      fetchData?.();
      handleReset();
    } catch (err: any) {
      setErrors(err.response?.data || {});
      toast.error("Failed to create project");
    }
  };

  // 🔹 Reset Form
  const handleReset = () => {
    formRef.current?.reset();
    setTitle("");
    setDescription("");
    setCaption("");
    setLink("");
    setImage(null);
    setErrors({});
  };

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
      {/* Header */}
      <div className="border-b border-stroke px-4 py-3 sm:px-6 sm:py-4 dark:border-strokedark">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100">
          Add New Project
        </h3>
      </div>

      {/* Form */}
      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title..."
              className="w-full rounded-md border border-stroke bg-transparent px-4 py-2.5 text-slate-800 placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-strokedark dark:text-white dark:placeholder-gray-500"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title[0]}</p>}
          </div>

          {/* Image & Link */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Image */}
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full cursor-pointer rounded-md border border-stroke bg-transparent px-4 py-2.5 text-slate-800 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 hover:file:bg-gray-200 focus:border-primary focus:ring-1 focus:ring-primary dark:border-strokedark dark:text-white dark:file:bg-boxdark-2 dark:hover:file:bg-boxdark"
              />
              {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image[0]}</p>}
            </div>

            {/* Link */}
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                Link
              </label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-md border border-stroke bg-transparent px-4 py-2.5 text-slate-800 placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-strokedark dark:text-white dark:placeholder-gray-500"
              />
              {errors.link && <p className="mt-1 text-sm text-red-500">{errors.link[0]}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Description
            </label>
            <div className="min-h-[160px] sm:min-h-[200px] md:min-h-[100px]">
              <ReactQuillEditor
                ref={quillDescRef}
                value={description}
                onChange={setDescription}
                placeholder="Enter project description..."
              />
            </div>
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description[0]}</p>
            )}
          </div>

          {/* Caption */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Caption
            </label>
            <div className="min-h-[100px] sm:min-h-[160px] md:min-h-[100px]">
              <ReactQuillEditor
                ref={quillCaptionRef}
                value={caption}
                onChange={setCaption}
                placeholder="Enter short project caption..."
              />
            </div>
            {errors.caption && <p className="mt-1 text-sm text-red-500">{errors.caption[0]}</p>}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              className="flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm sm:text-base font-medium text-white hover:bg-opacity-90 transition-colors"
            >
              <i className="fa-solid fa-plus mr-2"></i> Add
            </button>
            <button
              type="reset"
              onClick={handleReset}
              className="flex items-center justify-center rounded-md bg-slate-600 px-5 py-2 text-sm sm:text-base font-medium text-white hover:bg-opacity-90 transition-colors"
            >
              <i className="fa-solid fa-eraser mr-2"></i> Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
