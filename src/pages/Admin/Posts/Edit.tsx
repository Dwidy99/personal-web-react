import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import SubmitButton from "@/components/admin/SubmitButton";
import Loading from "@/components/admin/Loading";
import CKEditorField from "@/components/general/CKEditorField";
import CategoryIconSelect from "@/components/admin/CategoryIconSelect";
import type { ValidationErrors, Post } from "@/types/post";
import { postService } from "@/services/postService";

type CategoryOption = { id: number; name: string; image?: string };

const FORM_ID = "post-edit-form";
const POST_EDITOR_UPLOAD_ENDPOINT = "/api/admin/posts/editor-upload";
const POST_CONTENT_EDITOR_HEIGHT = "560px";

export default function PostEdit() {
  document.title = "Edit Post";

  const navigate = useNavigate();
  const { id } = useParams();
  const fileRef = useRef<HTMLInputElement>(null);

  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [contentUploads, setContentUploads] = useState(0);
  const isSaving = submitting || contentUploads > 0;

  useEffect(() => {
    Promise.all([postService.getCategories(), postService.getById(Number(id))])
      .then(([cats, data]) => {
        setCategories(cats);
        setPost(data);
      })
      .catch(() => toast.error("Failed to load post"));
  }, [id]);

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

  const currentImage = preview || post?.image || "";

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

  const handleReset = () => {
    setImage(null);
    setPreview("");
    setErrors({});
    if (fileRef.current) fileRef.current.value = "";
  };

  if (!post) {
    return (
      <LayoutAdmin>
        <Loading message="Loading post..." variant="page" className="py-20" />
      </LayoutAdmin>
    );
  }

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
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Edit Post</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Update title, category, cover image, and article content.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl rounded-xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col gap-3 border-b border-stroke px-4 py-4 dark:border-strokedark sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              Article Detail
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Metadata stays above the editor so long content gets the full writing width.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <SubmitButton
              form={FORM_ID}
              disabled={contentUploads > 0}
              loading={isSaving}
              loadingText={contentUploads > 0 ? "Uploading images..." : "Saving..."}
              icon={<i className="fa-solid fa-save" />}
              className="h-10 bg-sky-600 px-4"
            >
              Save
            </SubmitButton>

            <Link
              to="/admin/posts"
              className={`inline-flex h-10 items-center justify-center rounded-lg bg-gray-500 px-4 text-sm font-medium text-white hover:bg-opacity-90 ${
                isSaving ? "pointer-events-none opacity-60" : ""
              }`}
            >
              Cancel
            </Link>
          </div>
        </div>

        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6 lg:p-8">
          <section className="rounded-xl border border-stroke p-4 dark:border-strokedark sm:p-5">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-800 dark:text-white">
                Post Metadata
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update the title, category, and cover before editing the article body.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="grid content-start gap-5 md:grid-cols-2 lg:grid-cols-1">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                    Title
                  </label>
                  <input
                    value={post.title}
                    disabled={isSaving}
                    onChange={(e) => setPost({ ...post, title: e.target.value })}
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
                    value={String(post.category_id)}
                    onChange={(v) => setPost({ ...post, category_id: Number(v) })}
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
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt={post.title || "Post preview"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="px-4 text-center text-xs text-gray-500 dark:text-gray-400">
                      No image selected.
                    </div>
                  )}
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  disabled={isSaving}
                  onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                  className="w-full cursor-pointer rounded-lg border border-stroke p-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 dark:border-strokedark dark:text-white dark:file:bg-boxdark-2 disabled:opacity-60"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Upload a new image only when the cover needs to be replaced.
                </p>
                {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image[0]}</p>}

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isSaving}
                  className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-lg border border-stroke px-4 text-sm font-medium text-slate-700 transition hover:border-primary hover:text-primary disabled:opacity-60 dark:border-strokedark dark:text-slate-200"
                >
                  Reset local changes
                </button>
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
                  Full-width editor for comfortable long-form editing.
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Drag the lower edge to resize the editor.
              </span>
            </div>

            <div className="rounded-lg border border-stroke dark:border-strokedark">
              <CKEditorField
                value={post.content}
                onChange={(v) => setPost({ ...post, content: v })}
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
