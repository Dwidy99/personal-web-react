import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "../../../layouts/Admin";
import toast from "react-hot-toast";
import SelectGroupTwo from "../../../components/general/SelectGroupTwo";
import type { ValidationErrors, Post } from "../../../types/post";
import { postService } from "../../../services/postService";

import SunEditorField from "@/components/general/SunEditor";

export default function PostEdit() {
  document.title = "Edit Post - My Portfolio";

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const fileRef = useRef<HTMLInputElement | null>(null);

  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ===== Preview file (safe, no memory leak)
  useEffect(() => {
    if (!image) {
      setImagePreview("");
      return;
    }
    const url = URL.createObjectURL(image);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  // ===== Fetch categories + post
  useEffect(() => {
    const fetchAll = async () => {
      if (!id) return;
      setLoading(true);

      try {
        const [cats, data] = await Promise.all([
          postService.getCategories(),
          postService.getById(Number(id)),
        ]);
        setCategories(cats);
        setPost(data);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to load post");
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c.id, label: c.name })),
    [categories]
  );

  const currentImage = useMemo(() => {
    if (imagePreview) return imagePreview;

    if (post?.image) {
      return `${post.image}`;
    }

    return "";
  }, [imagePreview, post?.image]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!post || !id) return;

    setSubmitting(true);
    setErrors({});

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("title", post.title);
    formData.append("category_id", String(post.category_id ?? ""));
    formData.append("content", post.content);
    formData.append("_method", "PUT");

    try {
      const res = await postService.update(Number(id), formData);
      toast.success(res.message || "Post updated successfully!");
      navigate("/admin/posts");
    } catch (err: any) {
      setErrors(err?.response?.data || {});
      toast.error(err?.response?.data?.message || "Failed to update post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setErrors({});
    setImage(null);
    setImagePreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  if (loading) {
    return (
      <LayoutAdmin>
        <div className="rounded-lg border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-4 py-4 sm:px-6 dark:border-strokedark">
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100">
              Edit Post
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Loading post data...</p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-center py-16 text-sm text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          </div>
        </div>
      </LayoutAdmin>
    );
  }

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

      {/* Card */}
      <div className="rounded-lg border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
        {/* Header */}
        <div className="border-b border-stroke px-4 py-4 sm:px-6 dark:border-strokedark">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100">
            Edit Post
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update title, category, image, and content.
          </p>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 md:p-8">
          {!post ? (
            <div className="py-10 text-center text-gray-500 dark:text-gray-400">
              Post not found.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title + Category */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                    Title
                  </label>
                  <input
                    type="text"
                    value={post.title}
                    disabled={submitting}
                    onChange={(e) => setPost((p) => (p ? { ...p, title: e.target.value } : p))}
                    className="w-full rounded-lg border border-stroke bg-transparent p-3 text-sm text-slate-800 dark:text-white dark:border-strokedark
                               focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                    placeholder="Enter title..."
                  />
                  {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title[0]}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                    Category
                  </label>
                  <SelectGroupTwo
                    value={String(post.category_id ?? "")}
                    onChange={(val) => setPost((p) => (p ? { ...p, category_id: Number(val) } : p))}
                    options={categoryOptions}
                    placeholder="-- Select Category --"
                  />
                  {errors.category_id && (
                    <p className="mt-1 text-xs text-red-500">{errors.category_id[0]}</p>
                  )}
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Image
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[120px_1fr]">
                  {/* Preview */}
                  <div className="w-28 h-28">
                    {currentImage ? (
                      <img
                        src={currentImage}
                        alt={post.title}
                        className="h-full w-full rounded-lg object-cover border border-stroke dark:border-strokedark"
                      />
                    ) : (
                      <div className="h-full w-full rounded-lg border border-dashed border-stroke dark:border-strokedark flex items-center justify-center text-xs text-gray-500">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      disabled={submitting}
                      onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                      className="w-full cursor-pointer rounded-lg border border-stroke p-2 text-sm dark:border-strokedark disabled:opacity-60"
                    />
                    <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                      Recommended: square image, max ~2MB.
                    </p>
                    {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image[0]}</p>}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Content
                </label>

                <div className="overflow-hidden rounded-lg border border-stroke dark:border-strokedark">
                  <SunEditorField
                    value={post.content}
                    onChange={(val) => setPost((p) => (p ? { ...p, content: val } : p))}
                    placeholder="Write content..."
                  />
                </div>

                {errors.content && <p className="mt-2 text-xs text-red-500">{errors.content[0]}</p>}
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-lg bg-primary text-white py-2.5 px-6 text-sm font-medium hover:bg-opacity-90 disabled:opacity-60"
                >
                  <i className="fa-solid fa-save mr-2" />
                  {submitting ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-lg bg-gray-500 text-white py-2.5 px-6 text-sm font-medium hover:bg-opacity-90 disabled:opacity-60"
                >
                  <i className="fa-solid fa-redo mr-2" /> Reset
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
}
