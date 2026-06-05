import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import { projectService } from "@/services";
import SubmitButton from "@/components/admin/SubmitButton";
import CKEditorField from "@/components/general/CKEditorField";
import type { AdminProjectFormErrors } from "@/types/admin/projects";
import {
  getErrorMessage,
  getValidationErrors,
} from "@/features/admin/shared/utils/apiError";

const PROJECT_EDITOR_UPLOAD_ENDPOINT = "/api/admin/projects/editor-upload";

export default function ProjectsCreatePage() {
  document.title = "Create Project - My Portfolio";

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const [errors, setErrors] = useState<AdminProjectFormErrors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [descriptionUploads, setDescriptionUploads] = useState(0);
  const [captionUploads, setCaptionUploads] = useState(0);
  const pendingEditorUploads = descriptionUploads + captionUploads;
  const isSaving = submitting || pendingEditorUploads > 0;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (pendingEditorUploads > 0) {
      toast.error("Tunggu upload gambar selesai sebelum menyimpan project.");
      return;
    }

    setErrors({});
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("caption", caption);
    formData.append("link", link);
    if (image) formData.append("image", image);

    try {
      const res = await projectService.create(formData);
      toast.success(res.message || "Project created successfully!");

      formRef.current?.reset();
      navigate("/admin/projects");
    } catch (error: unknown) {
      setErrors(getValidationErrors(error));
      toast.error(getErrorMessage(error, "Failed to create project"));
    } finally {
      setSubmitting(false);
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files?.[0] ?? null);
  };

  return (
    <LayoutAdmin>
      <div className="mb-4">
        <Link
          to="/admin/projects"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-meta-4 px-4 text-sm font-medium text-white hover:bg-opacity-90"
        >
          <i className="fa-solid fa-arrow-left mr-2" /> Back
        </Link>
      </div>

      <div className="mx-auto max-w-5xl rounded-lg border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-4 py-3 sm:px-6 sm:py-4 dark:border-strokedark">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100">
            Add New Project
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Fill the form below to create a project.
          </p>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Title
              </label>
              <input
                type="text"
                value={title}
                disabled={isSaving}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title..."
                className="w-full rounded-md border border-stroke bg-transparent px-4 py-2.5 text-slate-800 placeholder-gray-400
                           focus:border-primary focus:ring-1 focus:ring-primary
                           dark:border-strokedark dark:text-white dark:placeholder-gray-500
                           disabled:opacity-60"
              />
              {errors.title?.[0] && <p className="mt-1 text-sm text-red-500">{errors.title[0]}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                disabled={isSaving}
                onChange={onFileChange}
                className="w-full cursor-pointer rounded-md border border-stroke bg-transparent px-4 py-2.5 text-slate-800
                           file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2
                           hover:file:bg-gray-200 focus:border-primary focus:ring-1 focus:ring-primary
                           dark:border-strokedark dark:text-white dark:file:bg-boxdark-2 dark:hover:file:bg-boxdark
                           disabled:opacity-60"
              />
              <p className="mt-1 text-xs text-bodydark2">
                Gunakan gambar yang jelas, disarankan rasio persegi atau landscape.
              </p>
              {errors.image?.[0] && <p className="mt-1 text-sm text-red-500">{errors.image[0]}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Link
              </label>
              <input
                type="url"
                value={link}
                disabled={isSaving}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-md border border-stroke bg-transparent px-4 py-2.5 text-slate-800 placeholder-gray-400
                           focus:border-primary focus:ring-1 focus:ring-primary
                           dark:border-strokedark dark:text-white dark:placeholder-gray-500
                           disabled:opacity-60"
              />
              {errors.link?.[0] && <p className="mt-1 text-sm text-red-500">{errors.link[0]}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Description
              </label>
              <div className="rounded-lg border border-stroke dark:border-strokedark">
                <CKEditorField
                  value={description}
                  onChange={setDescription}
                  placeholder="Write project description..."
                  height="320px"
                  uploadEndpoint={PROJECT_EDITOR_UPLOAD_ENDPOINT}
                  onPendingUploadsChange={setDescriptionUploads}
                />
              </div>
              {descriptionUploads > 0 && (
                <p className="mt-2 text-xs text-primary">
                  Uploading {descriptionUploads} description image{descriptionUploads > 1 ? "s" : ""}...
                </p>
              )}
              {errors.description?.[0] && (
                <p className="mt-1 text-sm text-red-500">{errors.description[0]}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Caption
              </label>
              <div className="rounded-lg border border-stroke dark:border-strokedark">
                <CKEditorField
                  value={caption}
                  onChange={setCaption}
                  placeholder="Write short caption..."
                  height="240px"
                  uploadEndpoint={PROJECT_EDITOR_UPLOAD_ENDPOINT}
                  onPendingUploadsChange={setCaptionUploads}
                />
              </div>
              {captionUploads > 0 && (
                <p className="mt-2 text-xs text-primary">
                  Uploading {captionUploads} caption image{captionUploads > 1 ? "s" : ""}...
                </p>
              )}
              {errors.caption?.[0] && (
                <p className="mt-1 text-sm text-red-500">{errors.caption[0]}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
              <SubmitButton
                disabled={pendingEditorUploads > 0}
                loading={isSaving}
                loadingText={pendingEditorUploads > 0 ? "Uploading images..." : "Saving..."}
                icon={<i className="fa-solid fa-plus" />}
                className="h-11 rounded-md px-5"
              >
                Add
              </SubmitButton>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => {
                  formRef.current?.reset();
                  setTitle("");
                  setDescription("");
                  setCaption("");
                  setLink("");
                  setImage(null);
                  setErrors({});
                }}
                className="inline-flex h-11 items-center justify-center rounded-md bg-slate-600 px-5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
              >
                <i className="fa-solid fa-eraser mr-2" /> Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </LayoutAdmin>
  );
}
