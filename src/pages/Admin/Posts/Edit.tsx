import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import SubmitButton from "@/components/admin/SubmitButton";
import SelectGroupTwo from "@/components/general/SelectGroupTwo";
import CKEditorField from "@/components/general/CKEditorField";
import type { ValidationErrors, Post } from "@/types/post";
import { postService } from "@/services/postService";

const POST_EDITOR_UPLOAD_ENDPOINT = "/api/admin/posts/editor-upload";

export default function PostEdit() {
  document.title = "Edit Post";

  const navigate = useNavigate();
  const { id } = useParams();
  const fileRef = useRef<HTMLInputElement>(null);

  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [contentUploads, setContentUploads] = useState(0);
  const isSaving = submitting || contentUploads > 0;

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    Promise.all([postService.getCategories(), postService.getById(Number(id))])
      .then(([cats, data]) => {
        setCategories(cats);
        setPost(data);
      })
      .catch(() => toast.error("Failed to load post"));
  }, [id]);

  /* ================= IMAGE PREVIEW ================= */
  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const options = useMemo(
    () => categories.map((c) => ({ value: String(c.id), label: c.name })),
    [categories]
  );

  const currentImage = preview || post?.image || "";

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!post) return;

    if (contentUploads > 0) {
      toast.error("Tunggu upload gambar selesai sebelum menyimpan post.");
      return;
    }

    setErrors({});

    const fd = new FormData();
    fd.append("_method", "PUT");
    fd.append("title", post.title);
    fd.append("category_id", String(post.category_id));
    fd.append("content", post.content);
    if (image) fd.append("image", image);

    try {
      setSubmitting(true);
      await postService.update(Number(id), fd);
      toast.success("Post updated successfully");
      navigate("/admin/posts");
    } catch (err: any) {
      setErrors(err?.response?.data || {});
      toast.error("Validation error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!post) return null;

  return (
    <LayoutAdmin>
      {/* BACK */}
      <Link
        to="/admin/posts"
        className="inline-flex items-center rounded-lg bg-meta-4 px-5 py-2 text-sm font-medium text-white hover:bg-opacity-90 mb-4"
      >
        ← Back
      </Link>

      <div className="rounded-xl border bg-white dark:bg-boxdark">
        {/* HEADER + ACTION */}
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Edit Post</h2>
            <p className="text-sm text-gray-500">Update title, category, image, and content</p>
          </div>

          <div className="flex gap-2">
            <SubmitButton
              form="post-edit-form"
              disabled={contentUploads > 0}
              loading={isSaving}
              loadingText={contentUploads > 0 ? "Uploading images..." : "Saving..."}
              className="bg-sky-600 px-4 py-2"
            >
              Save
            </SubmitButton>

            <Link
              to="/admin/posts"
              className={`rounded-lg bg-gray-500 px-4 py-2 text-sm text-white ${
                isSaving ? "pointer-events-none opacity-60" : ""
              }`}
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* FORM */}
        <form id="post-edit-form" onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6">
          {/* TITLE */}
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="w-full rounded-lg border p-3 text-sm"
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title[0]}</p>}
          </div>

          {/* CATEGORY + IMAGE */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* CATEGORY */}
            <div>
              <label className="mb-1 block text-sm font-medium">Category</label>
              <SelectGroupTwo
                value={String(post.category_id)}
                onChange={(v) => setPost({ ...post, category_id: Number(v) })}
                options={options}
              />
              {errors.category_id && (
                <p className="mt-1 text-xs text-red-500">{errors.category_id[0]}</p>
              )}
            </div>

            {/* IMAGE */}
            <div>
              <label className="mb-1 block text-sm font-medium">Image</label>

              <div className="flex items-center gap-4">
                <div className="h-40 w-full max-w-xs overflow-hidden rounded-lg border bg-gray-100 flex items-center justify-center">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt="preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                  className="w-full rounded-lg border p-2 text-sm"
                />
              </div>

              {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image[0]}</p>}
            </div>
          </div>

          {/* CONTENT */}
          <div>
            <label className="mb-1 block text-sm font-medium">Content</label>
            <CKEditorField
              value={post.content}
              onChange={(v) => setPost({ ...post, content: v })}
              uploadEndpoint={POST_EDITOR_UPLOAD_ENDPOINT}
              onPendingUploadsChange={setContentUploads}
            />
            {contentUploads > 0 && (
              <p className="mt-2 text-xs text-sky-600">
                Uploading {contentUploads} image{contentUploads > 1 ? "s" : ""}...
              </p>
            )}
            {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content[0]}</p>}
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
