import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import SelectGroupTwo from "@/components/general/SelectGroupTwo";
import type { ValidationErrors } from "@/types/post";
import { postService } from "@/services";

import SunEditorField from "@/components/general/SunEditor";

type CategoryOption = { id: number; name: string };

export default function PostCreate() {
  document.title = "Create Post - My Portfolio";

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [title, setTitle] = useState("");
  const [categoryID, setCategoryID] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingCats, setLoadingCats] = useState(false);

  // Load categories
  useEffect(() => {
    let mounted = true;
    setLoadingCats(true);

    postService
      .getCategories()
      .then((data) => {
        if (!mounted) return;
        setCategories(data);
      })
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoadingCats(false));

    return () => {
      mounted = false;
    };
  }, []);

  // Preview URL (with cleanup)
  useEffect(() => {
    if (!image) {
      setImagePreview("");
      return;
    }

    const url = URL.createObjectURL(image);
    setImagePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: String(c.id), label: c.name })),
    [categories]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
  };

  const normalizeErrors = (err: any): ValidationErrors => {
    // support either { field: [] } or { errors: { field: [] } }
    return (err?.response?.data?.errors ?? err?.response?.data ?? {}) as ValidationErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // Basic frontend guard (better UX)
    if (!title.trim()) return toast.error("Title is required");
    if (!categoryID) return toast.error("Category is required");
    if (!content.trim()) return toast.error("Content is required");
    if (!image) return toast.error("Image is required");

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("category_id", categoryID); // keep as string
    formData.append("content", content);
    formData.append("image", image);

    try {
      setSubmitting(true);
      const res = await postService.create(formData);

      toast.success(res.message || "Post created successfully!", { position: "top-center" });
      navigate("/admin/posts");
      return;
    } catch (err: any) {
      const mapped = normalizeErrors(err);
      setErrors(mapped);
      toast.error(err?.response?.data?.message || "Failed to create post");
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
    setImagePreview("");
    setErrors({});
  };

  return (
    <LayoutAdmin>
      {/* Back */}
      <div className="mb-4">
        <Link
          to="/admin/posts"
          className="inline-flex items-center justify-center rounded-lg bg-meta-4 text-white py-2 px-5 text-sm font-medium hover:bg-opacity-90"
        >
          <i className="fa-solid fa-arrow-left mr-2" /> Back
        </Link>
      </div>

      <div className="rounded-lg border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
        {/* Header */}
        <div className="border-b border-stroke px-4 py-4 sm:px-6 dark:border-strokedark">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100">
            Add Post
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create a new post with category, image, and content.
          </p>
        </div>

        {/* Form */}
        <div className="p-4 sm:p-6 md:p-8">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                disabled={submitting}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent p-3 text-sm dark:text-white dark:border-strokedark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                placeholder="Enter post title..."
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
            </div>

            {/* Category + Image */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200 mb-2">
                  Category
                </label>

                <SelectGroupTwo
                  value={categoryID}
                  onChange={setCategoryID}
                  options={categoryOptions}
                  placeholder={loadingCats ? "Loading categories..." : "-- Select Category --"}
                />

                {errors.category_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.category_id[0]}</p>
                )}
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200 mb-2">
                  Image
                </label>

                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border border-stroke dark:border-strokedark"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border border-dashed border-stroke dark:border-strokedark flex items-center justify-center text-[11px] text-gray-400">
                      No preview
                    </div>
                  )}

                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={submitting}
                      onChange={handleFileChange}
                      className="w-full rounded-lg border border-stroke p-2 text-sm cursor-pointer dark:border-strokedark disabled:opacity-60"
                    />
                    <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                      Recommended: square image, max ~2MB.
                    </p>
                    {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image[0]}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200 mb-2">
                Content
              </label>

              <div className="rounded-lg border border-stroke dark:border-strokedark overflow-hidden">
                <SunEditorField
                  value={content}
                  onChange={setContent}
                  placeholder="Write content..."
                />
              </div>

              {errors.content && <p className="text-red-500 text-xs mt-2">{errors.content[0]}</p>}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-lg bg-primary text-white py-2.5 px-6 text-sm font-medium hover:bg-opacity-90 disabled:opacity-60"
              >
                <i className="fa-solid fa-plus mr-2" />
                {submitting ? "Saving..." : "Add"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-lg bg-gray-500 text-white py-2.5 px-6 text-sm font-medium hover:bg-opacity-90 disabled:opacity-60"
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
