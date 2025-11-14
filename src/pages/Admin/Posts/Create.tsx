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
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    postService.getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
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
    }
  };

  const handleReset = () => {
    formRef.current?.reset();
    setTitle("");
    setCategoryID("");
    setContent("");
    setImage(null);
    setErrors({});
  };

  return (
    <LayoutAdmin>
      <Link
        to="/admin/posts"
        className="inline-flex items-center justify-center rounded-md bg-lime-50 text-black py-2 px-6 text-sm font-medium hover:bg-opacity-90 outline outline-2 outline-black mb-4"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-lg border bg-white shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Add Post</h3>

        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-md p-3"
              placeholder="Enter post title..."
            />
            {errors.title && <p className="text-red-500 text-xs">{errors.title[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium mb-1">Category</label>
              <SelectGroupTwo
                value={categoryID}
                onChange={setCategoryID}
                options={categories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                }))}
                placeholder="-- Select Category --"
              />
              {errors.category_id && (
                <p className="text-red-500 text-xs">{errors.category_id[0]}</p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border rounded-md p-2 cursor-pointer"
              />
              {errors.image && <p className="text-red-500 text-xs">{errors.image[0]}</p>}
            </div>
          </div>

          <div className="mb-6">
            <label className="block font-medium mb-1">Content</label>
            <ReactQuillEditor
              ref={quillRef}
              value={content}
              onChange={setContent}
              placeholder="Write post content..."
            />
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content[0]}</p>}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-500"
            >
              <i className="fa-solid fa-plus mr-2"></i> Add
            </button>
            <button
              type="reset"
              onClick={handleReset}
              className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-400"
            >
              <i className="fa-solid fa-eraser mr-2"></i> Reset
            </button>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
