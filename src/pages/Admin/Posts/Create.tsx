import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import SubmitButton from "@/components/admin/SubmitButton";
import CKEditorField from "@/components/general/CKEditorField";
import CategoryIconSelect from "@/components/admin/CategoryIconSelect";
import { postService } from "@/services/postService";
import type {
  AdminPostCategoryOption,
  AdminPostFormErrors,
} from "@/features/admin/posts/types";
import {
  getErrorMessage,
  getValidationErrors,
} from "@/features/admin/shared/utils/apiError";

const POST_EDITOR_UPLOAD_ENDPOINT = "/api/admin/posts/editor-upload";
const POST_CONTENT_EDITOR_HEIGHT = "560px";

export default function PostCreate() {
  document.title = "Create Post - My Portfolio";

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [title, setTitle] = useState("");
  const [categoryID, setCategoryID] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [categories, setCategories] = useState<AdminPostCategoryOption[]>([]);
  const [errors, setErrors] = useState<AdminPostFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [contentUploads, setContentUploads] = useState(0);
  const isSaving = submitting || contentUploads > 0;

  const fetchCategories = useCallback(async (): Promise<void> => {
    try {
      const data = await postService.getCategories();
      setCategories(data);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to load categories"));
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const nextPreview = URL.createObjectURL(image);
    setPreview(nextPreview);

    return () => URL.revokeObjectURL(nextPreview);
  }, [image]);

  const categoryOptions = useMemo(
    () => categories.map((category) => ({
      value: String(category.id),
      label: category.name,
      image: category.image,
    })),
    [categories]
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (contentUploads > 0) {
      toast.error("Tunggu upload gambar selesai sebelum menyimpan post.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category_id", categoryID);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      setSubmitting(true);
      await postService.create(formData);
      toast.success("Post created");
      navigate("/admin/posts");
    } catch (error: unknown) {
      setErrors(getValidationErrors(error));
      toast.error(getErrorMessage(error, "Failed to create post"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    formRef.current?.reset();
    setTitle("");
    setCategoryID("");
    setContent("");
    setImage(null);
    setPreview("");
    setErrors({});
  };

  return (
    <LayoutAdmin>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/admin/posts"
          className="inline-flex w-fit items-center rounded-lg bg-meta-4 px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
        >
          <i className="fa-solid fa-arrow-left mr-2" /> Back
        </Link>

        <div className="text-left sm:text-right">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Create Post</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Arrange title, category, cover image, and article content.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl rounded-xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col gap-3 border-b border-stroke px-4 py-4 dark:border-strokedark sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              New Article Detail
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Keep metadata above the editor so the content area stays wide and comfortable.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <SubmitButton
              form="post-create-form"
              disabled={contentUploads > 0}
              loading={isSaving}
              loadingText={contentUploads > 0 ? "Uploading images..." : "Saving..."}
              icon={<i className="fa-solid fa-plus" />}
              className="h-10 bg-sky-600 px-4"
            >
              Create
            </SubmitButton>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-gray-500 px-4 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
            >
              Reset
            </button>
          </div>
        </div>

        <form
          id="post-create-form"
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6 p-4 sm:p-6 lg:p-8"
        >
          <section className="rounded-xl border border-stroke p-4 dark:border-strokedark sm:p-5">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-800 dark:text-white">
                Post Metadata
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Fill the title, category, and cover before writing the main content.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="grid content-start gap-5 md:grid-cols-2 lg:grid-cols-1">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                    Title
                  </label>
                  <input
                    value={title}
                    disabled={isSaving}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Write a clear post title..."
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 dark:border-strokedark dark:text-white"
                  />
                  {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title[0]}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                    Category
                  </label>
                  <CategoryIconSelect
                    value={categoryID}
                    onChange={setCategoryID}
                    options={categoryOptions}
                    disabled={isSaving}
                  />
                  {errors.category_id && (
                    <p className="mt-1 text-xs text-red-500">{errors.category_id[0]}</p>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-slate-50/70 p-3 ring-1 ring-stroke dark:bg-boxdark-2 dark:ring-strokedark">
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Cover Image
                </label>
                <div className="mb-3 flex h-36 items-center justify-center overflow-hidden rounded-lg border border-dashed border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                  {preview ? (
                    <img src={preview} alt="Post preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="px-4 text-center text-xs text-gray-500 dark:text-gray-400">
                      Image preview will appear here.
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isSaving}
                  onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                  className="w-full cursor-pointer rounded-lg border border-stroke p-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 dark:border-strokedark dark:text-white dark:file:bg-boxdark-2 disabled:opacity-60"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Use a landscape image for a cleaner card preview.
                </p>
                {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image[0]}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-stroke p-4 dark:border-strokedark sm:p-5">
            <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-white">
                  Content
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Full-width editor for long-form writing.
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Supports image upload, tables, font styles, and links.
              </span>
            </div>

            <div className="rounded-lg border border-stroke dark:border-strokedark">
              <CKEditorField
                value={content}
                onChange={setContent}
                placeholder="Write post content..."
                height={POST_CONTENT_EDITOR_HEIGHT}
                minHeight="360px"
                uploadEndpoint={POST_EDITOR_UPLOAD_ENDPOINT}
                onPendingUploadsChange={setContentUploads}
              />
            </div>

            {contentUploads > 0 && (
              <p className="mt-2 text-xs text-sky-600">
                Uploading {contentUploads} image{contentUploads > 1 ? "s" : ""}...
              </p>
            )}
            {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content[0]}</p>}
          </section>
        </form>
      </div>
    </LayoutAdmin>
  );
}
