import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, FormEvent } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import toast from "react-hot-toast";
import SelectGroupTwo from "../../../components/general/SelectGroupTwo";
import ReactQuillEditor from "../../../components/general/ReactQuillEditor";
import { ValidationErrors } from "../../../types/post";
import { postService } from "../../../services";

export default function PostCreate() {
  document.title = "Create Post - My Portfolio";

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);
  const quillRef = useRef<any>(null);

  const [title, setTitle] = useState("");
  const [categoryID, setCategoryID] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    postService.getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("title", title);
    formData.append("category_id", categoryID);
    formData.append("content", content);

    try {
      const res = await postService.create(formData);
      toast.success(res.message || "Post created successfully!", { position: "top-center" });
      navigate("/admin/posts");
    } catch (err: any) {
      setErrors(err.response?.data || {});
      toast.error(err?.response?.data?.message || "Failed to create post");
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
      <Link
        to="/admin/posts"
        className="inline-flex items-center justify-center rounded-md bg-meta-4 text-white py-2 px-5 text-sm font-medium hover:bg-opacity-90 mb-4"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-lg border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-6 text-slate-800 dark:text-slate-100">
          Add Post
        </h3>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block font-semibold mb-1 text-sm text-slate-700 dark:text-gray-200">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent p-3 text-sm dark:text-white dark:border-strokedark focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter post title..."
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
          </div>

          {/* Category + Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-sm text-slate-700 dark:text-gray-200">
                Category
              </label>
              <SelectGroupTwo
                value={categoryID}
                onChange={setCategoryID}
                options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                placeholder="-- Select Category --"
              />
              {errors.category_id && (
                <p className="text-red-500 text-xs mt-1">{errors.category_id[0]}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-1 text-sm text-slate-700 dark:text-gray-200">
                Image
              </label>

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 rounded-lg object-cover border mb-2"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-lg border border-stroke p-2 text-sm cursor-pointer dark:border-strokedark"
              />
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image[0]}</p>}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block font-semibold mb-1 text-sm text-slate-700 dark:text-gray-200">
              Content
            </label>
            <ReactQuillEditor
              ref={quillRef}
              value={content}
              onChange={setContent}
              placeholder="Write post content..."
            />
            {errors.content && <p className="text-red-500 text-xs mt-2">{errors.content[0]}</p>}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-white py-2 px-6 text-sm font-medium hover:bg-opacity-90"
            >
              <i className="fa-solid fa-plus mr-2"></i> Add
            </button>
            <button
              type="reset"
              onClick={handleReset}
              className="inline-flex items-center justify-center rounded-lg bg-gray-500 text-white py-2 px-6 text-sm font-medium hover:bg-opacity-90"
            >
              <i className="fa-solid fa-eraser mr-2"></i> Reset
            </button>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
