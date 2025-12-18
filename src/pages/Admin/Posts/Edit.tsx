import { useEffect, useRef, useState, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "../../../layouts/Admin";
import toast from "react-hot-toast";
import SelectGroupTwo from "../../../components/general/SelectGroupTwo";
import ReactQuillEditor from "../../../components/general/ReactQuillEditor";
import { ValidationErrors, Post } from "../../../types/post";
import { postService } from "../../../services/postService";

export default function PostEdit() {
  document.title = "Edit Post - My Portfolio";

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const formRef = useRef<HTMLFormElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const quillRef = useRef<any>(null);

  const [post, setPost] = useState<Post | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(true);

  // ✅ Fetch data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        if (!id) return;
        const [cats, data] = await Promise.all([
          postService.getCategories(),
          postService.getById(Number(id)),
        ]);
        setCategories(cats);
        setPost(data);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  // ✅ Safe preview (no memory leak)
  useEffect(() => {
    if (!image) {
      setImagePreview("");
      return;
    }
    const url = URL.createObjectURL(image);
    setImagePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!post || !id) return;

    setErrors({});

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("title", post.title);
    formData.append("category_id", String(post.category_id));
    formData.append("content", post.content);
    formData.append("_method", "PUT");

    try {
      const res = await postService.update(Number(id), formData);
      toast.success(res.message || "Post updated successfully!");
      navigate("/admin/posts");
    } catch (err: any) {
      setErrors(err.response?.data || {});
      toast.error(err?.response?.data?.message || "Failed to update post");
    }
  };

  const handleReset = () => {
    setErrors({});
    setImage(null);
    setImagePreview("");
    if (fileRef.current) fileRef.current.value = ""; // ✅ reset file input
  };

  if (loading) {
    return (
      <LayoutAdmin>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading post data...</p>
        </div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <div className="mb-4">
        <Link
          to="/admin/posts"
          className="inline-flex items-center justify-center rounded-lg bg-meta-4 text-white py-2 px-5 text-sm font-medium hover:bg-opacity-90"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Back
        </Link>
      </div>

      <div className="rounded-lg border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">
            Edit Post
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update title, category, image, and content.
          </p>
        </div>

        {!post ? (
          <div className="py-10 text-center text-gray-500">Post not found.</div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Title + Category */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-sm text-slate-700 dark:text-gray-200">
                  Title
                </label>
                <input
                  type="text"
                  value={post.title}
                  onChange={(e) => setPost((prev) => prev && { ...prev, title: e.target.value })}
                  className="w-full rounded-lg border border-stroke bg-transparent p-3 text-sm dark:text-white dark:border-strokedark focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter title..."
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
              </div>

              <div>
                <label className="block font-semibold mb-1 text-sm text-slate-700 dark:text-gray-200">
                  Category
                </label>
                <SelectGroupTwo
                  value={String(post.category_id ?? "")}
                  onChange={(val) =>
                    setPost((prev) => prev && { ...prev, category_id: Number(val) })
                  }
                  options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                  placeholder="-- Select Category --"
                />
                {errors.category_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.category_id[0]}</p>
                )}
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block font-semibold mb-2 text-sm text-slate-700 dark:text-gray-200">
                Image
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4 items-start">
                <div className="w-28 h-28 sm:w-30 sm:h-30">
                  {imagePreview || post.image ? (
                    <img
                      src={imagePreview || post.image}
                      alt={post.title}
                      className="w-full h-full rounded-lg object-cover border border-stroke dark:border-strokedark"
                    />
                  ) : (
                    <div className="w-full h-full rounded-lg border border-dashed border-stroke dark:border-strokedark flex items-center justify-center text-xs text-gray-500">
                      No image
                    </div>
                  )}
                </div>

                <div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                    className="w-full rounded-lg border border-stroke p-2 text-sm cursor-pointer dark:border-strokedark"
                  />
                  {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image[0]}</p>}
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: square image for best UI.
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block font-semibold mb-2 text-sm text-slate-700 dark:text-gray-200">
                Content
              </label>
              <ReactQuillEditor
                ref={quillRef}
                value={post.content}
                onChange={(val) => setPost((prev) => prev && { ...prev, content: val })}
              />
              {errors.content && <p className="text-red-500 text-xs mt-2">{errors.content[0]}</p>}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-primary text-white py-2.5 px-6 text-sm font-medium hover:bg-opacity-90"
              >
                <i className="fa-solid fa-save mr-2"></i> Save
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-lg bg-gray-500 text-white py-2.5 px-6 text-sm font-medium hover:bg-opacity-90"
              >
                <i className="fa-solid fa-redo mr-2"></i> Reset
              </button>
            </div>
          </form>
        )}
      </div>
    </LayoutAdmin>
  );
}
