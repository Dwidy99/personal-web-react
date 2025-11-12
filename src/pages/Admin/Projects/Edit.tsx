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
import ReactQuillEditor from "../../../components/general/ReactQuillEditor";

export default function ProjectEdit() {
  document.title = "Edit Posts - My Portfolio";

  const navigate = useNavigate();
  const quillRef = useRef(null);
  const formRef = useRef(null);

  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [caption, setCaption] = useState("");

  const [errors, setErrors] = useState([]);

  const [projectImage, setProjectImage] = useState("");
  const token = Cookies.get("token");

  const fetchDataProject = async () => {
    await Api.get(`/api/admin/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      setTitle(response.data.data.title);
      setDescription(response.data.data.description);
      setCaption(response.data.data.caption);
      setProjectImage(response.data.data.image);
      setLink(response.data.data.link);
    });
  };

  useEffect(() => {
    fetchDataProject();
  }, []);

  const updateProjects = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("link", link);
    formData.append("caption", caption);
    formData.append("_method", "PUT");

    await Api.post(`/api/admin/projects/${id}`, formData, {
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
        navigate("/admin/projects");
      })
      .catch((error) => {
        setErrors(error.response.data);
      });
  };

  const handleReset = () => {
    if (formRef.current) formRef.current.reset();
    setTitle("");
    setDescription("");
    setCaption("");
    setImage("");
    setLink("");
    setErrors([]);
  };

  return (
    <LayoutAdmin>
      <Link
        to="/admin/projects/"
        className="inline-flex items-center justify-center rounded-md bg-meta-4 text-white py-2 px-6 text-sm font-medium hover:bg-lime-400 focus:outline-none"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-lg border bg-white shadow-md mt-8 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Edit Project
        </h3>
        <form ref={formRef} onSubmit={updateProjects}>
          <div className="my-2">
            <label className="my-3 block text-black">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter  title.."
              className="w-full rounded-lg border border-stroke py-3 px-5 text-black outline-none transition focus:border-primary"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title[0]}</p>
            )}
          </div>
          <div className="basis-64">
            {projectImage ? (
              <div className="relative">
                <img
                  src={projectImage}
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

          {/* Post Image */}
          <div className="grid grid-cols-2 gap-2">
            <div className="my-2">
              <label className="mb-3 block text-black">Project</label>
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

            <div className="my-2">
              <label className="mb-3 block text-black">Link</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Enter link.."
                className="w-full rounded-lg border border-stroke py-3 px-5 text-black outline-none transition focus:border-primary"
              />
              {errors.link && (
                <p className="text-sm text-red-600">{errors.link[0]}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <ReactQuillEditor
              ref={quillRef}
              value={description}
              onChange={setDescription}
              placeholder="Enter Caption..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description[0]}
              </p>
            )}
          </div>

          {/* Caption */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Caption
            </label>
            <ReactQuillEditor
              ref={quillRef}
              value={caption}
              onChange={setCaption}
              placeholder="Enter Caption..."
            />
            {errors.caption && (
              <p className="text-red-500 text-xs mt-1">{errors.caption[0]}</p>
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
