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
  const quillRef = useRef<any>(null);

  const [post, setPost] = useState<Post | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [cats, data] = await Promise.all([
          postService.getCategories(),
          postService.getById(Number(id)),
        ]);
        setCategories(cats);
        setPost(data);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!post) return;

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("title", post.title);
    formData.append("category_id", post.category_id.toString());
    formData.append("content", post.content);
    formData.append("_method", "PUT");

    try {
      const res = await postService.update(Number(id), formData);
      toast.success(res.message || "Post updated successfully!");
      navigate("/admin/posts");
    } catch (err: any) {
      setErrors(err.response?.data || {});
    }
  };

  const handleReset = () => {
    formRef.current?.reset();
    setImage(null);
    setErrors({});
  };

  if (loading) {
    return (
      <LayoutAdmin>
        <div className="flex justify-center items-center h-96">
          <p>Loading post data...</p>
        </div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <Link
        to="/admin/posts"
        className="inline-flex items-center justify-center rounded-md bg-meta-4 text-white py-2 px-6 text-sm font-medium hover:bg-lime-400 mb-4"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-lg border bg-white shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Edit Post</h3>

        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium mb-1">Title</label>
              <input
                type="text"
                value={post?.title || ""}
                onChange={(e) => setPost((prev) => prev && { ...prev, title: e.target.value })}
                className="w-full border rounded-md p-3"
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title[0]}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Category</label>
              <SelectGroupTwo
                value={post?.category_id?.toString() || ""}
                onChange={(val) => setPost((prev) => prev && { ...prev, category_id: Number(val) })}
                options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                placeholder="-- Select Category --"
              />
              {errors.category_id && (
                <p className="text-red-500 text-xs">{errors.category_id[0]}</p>
              )}
            </div>
          </div>

          {/* Image */}
          <div className="mb-6">
            {post?.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-24 h-24 object-cover mb-2 rounded-md"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="w-full border rounded-md p-2 cursor-pointer"
            />
            {errors.image && <p className="text-red-500 text-xs">{errors.image[0]}</p>}
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block font-medium mb-1">Content</label>
            <ReactQuillEditor
              ref={quillRef}
              value={post?.content || ""}
              onChange={(val) => setPost((prev) => prev && { ...prev, content: val })}
            />
            {errors.content && <p className="text-red-500 text-xs">{errors.content[0]}</p>}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-500"
            >
              <i className="fa-solid fa-save mr-2"></i> Save
            </button>
            <button
              type="reset"
              onClick={handleReset}
              className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-400"
            >
              <i className="fa-solid fa-redo mr-2"></i> Reset
            </button>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
