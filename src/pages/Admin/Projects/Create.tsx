import { useRef, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import ReactQuillEditor from "@/components/general/ReactQuillEditor";
import { projectService } from "@/services";
import type { ApiResponse } from "@/types/common";
import type { Project } from "@/types/project";

interface ProjectsCreateProps {
  fetchData: () => Promise<void>;
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
      fetchData();
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
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-bold text-black dark:text-white">Add New Project</h3>
      </div>

      <div className="flex flex-col gap-5.5 p-6.5">
        <form ref={formRef} onSubmit={handleSubmit}>
          {/* Title */}
          <div className="my-2">
            <label className="mb-2 font-semibold text-black">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title..."
              className="w-full rounded-lg border border-stroke py-3 px-5 outline-none transition focus:border-primary"
            />
            {errors.title && <p className="text-sm text-red-600">{errors.title[0]}</p>}
          </div>

          {/* Image & Link */}
          <div className="grid grid-cols-2 gap-4 my-4">
            <div>
              <label className="mb-2 font-semibold text-black">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full cursor-pointer rounded-lg border border-stroke py-3 px-5 file:mr-4 file:border-0 file:bg-whiter file:py-2 file:px-4 focus:border-primary"
              />
              {errors.image && <p className="text-sm text-red-600">{errors.image[0]}</p>}
            </div>
            <div>
              <label className="mb-2 font-semibold text-black">Link</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Enter project link..."
                className="w-full rounded-lg border border-stroke py-3 px-5 outline-none transition focus:border-primary"
              />
              {errors.link && <p className="text-sm text-red-600">{errors.link[0]}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="my-4">
            <label className="mb-2 font-semibold text-black">Description</label>
            <ReactQuillEditor
              ref={quillDescRef}
              value={description}
              onChange={setDescription}
              placeholder="Enter description..."
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description[0]}</p>}
          </div>

          {/* Caption */}
          <div className="my-4">
            <label className="mb-2 font-semibold text-black">Caption</label>
            <ReactQuillEditor
              ref={quillCaptionRef}
              value={caption}
              onChange={setCaption}
              placeholder="Enter caption..."
            />
            {errors.caption && <p className="text-sm text-red-600">{errors.caption[0]}</p>}
          </div>

          {/* Buttons */}
          <div className="flex mt-5">
            <button
              type="submit"
              className="mx-2 inline-flex items-center justify-center rounded-md bg-blue-600 py-2 px-6 text-sm font-medium text-white hover:bg-opacity-90"
            >
              <i className="fa-solid fa-plus mr-2"></i> Add
            </button>
            <button
              type="reset"
              onClick={handleReset}
              className="mx-2 inline-flex items-center justify-center rounded-md bg-slate-600 py-2 px-6 text-sm font-medium text-white hover:bg-opacity-90"
            >
              <i className="fa-solid fa-eraser mr-2"></i> Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
