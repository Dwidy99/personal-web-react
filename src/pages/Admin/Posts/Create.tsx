// Import dependencies
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../services/Api";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import "react-quill/dist/quill.snow.css";
import SelectGroupTwo from "../../../components/general/SelectGroupTwo";
import ReactQuillEditor from "../../../components/general/ReactQuillEditor";

export default function Create() {
  // Refs
  const formRef = useRef(null);
  const quillRef = useRef(null); // Simpan ref untuk ReactQuill

  // State
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [categoryID, setCategoryID] = useState("");
  const [content, setContent] = useState("");

  const [errors, setErrors] = useState({});

  const [categories, setCategories] = useState([]);

  // Token
  const token = Cookies.get("token");

  // Navigation
  const navigate = useNavigate();

  // Set Page Title
  useEffect(() => {
    document.title = "Create Posts - My Portfolio";
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchDataCategories = async () => {
      try {
        const { data } = await Api.get("/api/admin/categories/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(data.data);
      } catch (error) {
        toast.error(
          `Failed to fetch categories. Please try again later. ${error}`,
          {
            position: "top-center",
            duration: 5000,
          }
        );
      }
    };

    fetchDataCategories();
  }, [token]);

  // Handle image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // Store Post
  const storePosts = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category_id", categoryID);
    formData.append("content", content);

    try {
      await Api.post("/api/admin/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .then((response) => {
          toast.success(response.data.message, {
            position: "top-center",
            duration: 6000,
          });

          navigate("/admin/posts");
        })
        .catch((err) => {
          setErrors(err.response.data);
        });
    } catch (err) {
      setErrors(err.response?.data || {});
    }
  };

  // Reset form
  const handleReset = () => {
    if (formRef.current) formRef.current.reset();
    setTitle("");
    setImage(null);
    setContent("");
    setCategoryID("");
    setErrors({});
  };

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();

      // Hapus event listener lama dan gunakan event Quill yang benar
      editor.off("text-change");
      editor.on("text-change", () => {
        setContent(editor.root.innerHTML);
      });
    }
  }, []);

  return (
    <LayoutAdmin>
      {/* Back Button */}
      <Link
        to="/admin/posts/"
        className="mx-2 my-3 inline-flex items-center justify-center rounded-md bg-lime-50 py-2 px-6 text-sm font-medium text-black hover:bg-opacity-90 outline outline-2 outline-black"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <div className="border-b border-stroke py-4 px-6.5">
          <h3 className="font-medium text-black">Add Post</h3>
        </div>

        <div className="flex flex-col gap-5.5 p-6.5">
          <form ref={formRef} onSubmit={storePosts}>
            {/* Title Input */}
            <div className="my-2">
              <label className="mb-3 block text-black">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title.."
                className="w-full rounded-lg border border-stroke py-3 px-5 text-black outline-none transition focus:border-primary"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 my-4">
              {/* Category Select */}
              <div className="basis-128">
                <label className="text-black block">Category</label>
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
                  <p className="text-sm text-red-600">
                    {errors.category_id[0]}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div className="basis-128">
                <label className="block text-black">Image file</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full cursor-pointer rounded-lg border border-stroke file:mr-5 file:border-0 file:border-r file:border-solid file:bg-whiter file:py-3 file:px-5 file:hover:bg-gray-400 focus:border-primary"
                />
                {errors.image && (
                  <p className="text-sm text-red-600">{errors.image[0]}</p>
                )}
              </div>
            </div>

            {/* // Content Editor */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <ReactQuillEditor
                ref={quillRef}
                value={content}
                onChange={setContent}
                placeholder="Enter Description..."
              />
              {errors.content && (
                <p className="text-red-500 text-xs mt-1">{errors.content[0]}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex mt-5">
              <button
                type="submit"
                className="mx-2 inline-flex items-center justify-center rounded-md bg-blue-600 py-2 px-6 text-sm font-medium text-white hover:bg-opacity-90"
              >
                <i className="fa-solid fa-plus mr-2"></i> Add
              </button>
              <button
                type="reset"
                onClick={handleReset}
                className="mx-2 inline-flex items-center justify-center rounded-md bg-slate-600 py-2 px-6 text-sm font-medium text-white hover:bg-opacity-90"
              >
                <i className="fa-solid fa-eraser mr-2"></i> Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </LayoutAdmin>
  );
}
