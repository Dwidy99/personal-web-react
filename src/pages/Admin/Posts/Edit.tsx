//import react
import { useEffect, useRef, useState } from "react";
//import react-router-dom
import { Link, useNavigate, useParams } from "react-router-dom";
//quill CSS
import "react-quill/dist/quill.snow.css";

//import LayoutAdmin
import LayoutAdmin from "../../../layouts/Admin";

//import Api
import Api from "../../../services/Api";

//import Cookies js
import Cookies from "js-cookie";
//import toast js
import toast from "react-hot-toast";
import SelectGroupTwo from "../../../components/general/SelectGroupTwo";
import ReactQuillEditor from "./../../../components/general/ReactQuillEditor";

export default function PostEdit() {
  document.title = "Edit Posts - Desa Digital";

  const navigate = useNavigate();
  const quillRef = useRef(null);
  const formRef = useRef(null);

  const { id } = useParams();
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [category_id, setCategory_id] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [postImage, setPostImage] = useState(""); // URL for the post image
  const [categories, setCategories] = useState([]);
  const token = Cookies.get("token");

  // Fetch categories and post details
  const fetchDataCategories = async () => {
    await Api.get(`/api/admin/categories/all`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      setCategories(response.data.data);
    });
  };

  const fetchDataPost = async () => {
    await Api.get(`/api/admin/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      setTitle(response.data.data.title);
      setPostImage(response.data.data.image);
      setCategory_id(response.data.data.category_id);
      setContent(response.data.data.content);
    });
  };

  useEffect(() => {
    fetchDataCategories();
    fetchDataPost();
    quillRef.current.getEditor();
  }, []);

  const updatePosts = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category_id", category_id);
    formData.append("content", content);
    formData.append("_method", "PUT");

    await Api.post(`/api/admin/posts/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data",
      },
    })
      .then((response) => {
        toast.success(response.data.message, {
          position: "top-center",
          duration: 6000,
        });
        navigate("/admin/posts");
      })
      .catch((error) => {
        setErrors(error.response.data);
      });
  };

  const handleReset = () => {
    if (formRef.current) formRef.current.reset();
    setTitle("");
    setImage("");
    setCategory_id("");
    setContent("");
    setErrors([]);
  };

  return (
    <LayoutAdmin>
      <Link
        to="/admin/posts/"
        className="inline-flex items-center justify-center rounded-md bg-meta-4 text-white py-2 px-6 text-sm font-medium hover:bg-lime-400 focus:outline-none"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-lg border bg-white shadow-md mt-8 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit Post</h3>
        <form ref={formRef} onSubmit={updatePosts}>
          {/* Post Title */}
          <div className="grid grid-cols-2 gap-2 my-4 mb-6">
            <div className="basis-128">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Post Title"
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>
              )}
            </div>

            <div className="basis-128">
              {/* Category Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <SelectGroupTwo
                  value={category_id}
                  onChange={(e) => setCategory_id(e)}
                  options={categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                  placeholder="-- Select Category --"
                />
                {errors.category_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.category_id[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Post Image */}
          <div className="grid grid-cols-4 gap-2 my-4 mb-6">
            <div className="basis-64">
              {postImage ? (
                <div className="relative">
                  <img
                    src={postImage}
                    alt={title}
                    className="w-full h-auto rounded-lg shadow-md object-cover"
                    style={{ maxWidth: "150px", maxHeight: "150px" }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 bg-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600">No icon available</p>
                </div>
              )}
            </div>

            <div className="basis-128 col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-black dark:focus:border-primary"
              />
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image[0]}</p>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Content
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
          <div className="flex mt-5.5 items-center space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-500 focus:outline-none"
            >
              <i className="fa-solid fa-save mr-2"></i> Save
            </button>
            <button
              type="reset"
              onClick={handleReset}
              className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-400 focus:outline-none"
            >
              <i className="fa-solid fa-redo mr-2"></i> Reset
            </button>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
