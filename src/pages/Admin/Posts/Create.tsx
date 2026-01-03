import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import SelectGroupTwo from "@/components/general/SelectGroupTwo";
import SunEditorField from "@/components/general/SunEditor";
import type { ValidationErrors } from "@/types/post";
import { postService } from "@/services";

type CategoryOption = { id: number; name: string };

export default function PostCreate() {
  document.title = "Create Post - My Portfolio";

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [title, setTitle] = useState("");
  const [categoryID, setCategoryID] = useState("");
  const [content, setContent] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    postService
      .getCategories()
      .then(setCategories)
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  /* ================= IMAGE PREVIEW ================= */
  useEffect(() => {
    if (!image) return setImagePreview("");
    const url = URL.createObjectURL(image);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: String(c.id), label: c.name })),
    [categories]
  );

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

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
    } catch (err: any) {
      setErrors(err?.response?.data || {});
      toast.error("Validation error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LayoutAdmin>
      <Link
        to="/admin/posts"
        className="inline-flex items-center rounded-lg bg-meta-4 text-white py-2 px-6 my-2 text-sm font-medium hover:bg-opacity-90"
      >
        ← Back
      </Link>
      <div className="rounded-xl border bg-white dark:bg-boxdark">
        {/* HEADER + ACTIONS */}
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Create New Post</h2>
            <p className="text-sm text-gray-500">Fill the form below</p>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              form="post-create-form"
              disabled={submitting}
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm text-white"
            >
              {submitting ? "Saving..." : "Create"}
            </button>

            <button
              type="reset"
              form="post-create-form"
              className="rounded-lg bg-gray-500 px-4 py-2 text-sm text-white"
            >
              Reset
            </button>
          </div>
        </div>

        {/* FORM */}
        <form
          id="post-create-form"
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6 p-4 sm:p-6"
        >
          {/* TITLE */}
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border p-3 text-sm"
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title[0]}</p>}
          </div>

          {/* CATEGORY + IMAGE */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Category</label>
              <SelectGroupTwo
                value={categoryID}
                onChange={setCategoryID}
                options={categoryOptions}
              />
              {errors.category_id && (
                <p className="mt-1 text-xs text-red-500">{errors.category_id[0]}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                className="w-full rounded-lg border p-2 text-sm"
              />
              {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image[0]}</p>}
            </div>
          </div>

          {/* CONTENT */}
          <div>
            <label className="mb-1 block text-sm font-medium">Content</label>
            <SunEditorField value={content} onChange={setContent} />
            {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content[0]}</p>}
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
