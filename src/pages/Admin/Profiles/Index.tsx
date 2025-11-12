//import react
import { useEffect, useRef, useState } from "react";
//import react-router-dom
import { Link, useNavigate } from "react-router-dom";
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

export default function ProfilesIndex() {
  document.title = "Edit Profile - My Portfolio";

  const navigate = useNavigate();
  const quillRef = useRef(null);
  const formRef = useRef(null);

  // const { id } = useParams();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [about, setAbout] = useState("");
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tech_description, setTechDescription] = useState("");
  const [errors, setErrors] = useState([]);

  const [profileImage, setProfileImage] = useState(""); // URL for the profile image
  const token = Cookies.get("token");

  const user = JSON.parse(Cookies.get("user"));

  const fetchDataProfile = async () => {
    // Pastikan user dan token tersedia sebelum melakukan request
    if (!user?.id || !token) {
      toast.error("User authentication error!", { position: "top-center" });
      return;
    }

    try {
      const response = await Api.get(`/api/admin/profiles/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Cek jika response sukses dan memiliki data
      const data = response?.data?.data;

      if (!data || Object.keys(data).length === 0) {
        toast.error("Profile data not found!", { position: "top-center" });
        setName("No profile name available");
        setTitle("No profile title available");
        setProfileImage(""); // Bisa diisi dengan placeholder image jika kosong
        setAbout("No about available.");
        setCaption("No caption available.");
        setDescription("No description available.");
        setContent("No content available.");
        setTechDescription("No tech available.");
        return;
      }

      // Set state dengan data yang tersedia
      setName(data.name || "Unknow");
      setTitle(data.title || "Untitled");
      setProfileImage(data.image || ""); // Bisa diisi dengan placeholder image jika kosong
      setAbout(data.about || "No about available.");
      setCaption(data.caption || "No caption available.");
      setDescription(data.description || "No description available.");
      setContent(data.content || "No content available.");
      setTechDescription(data.tech_description || "No tech available.");
    } catch (error) {
      // Tangani error dengan status yang lebih spesifik
      if (error.response) {
        if (error.response.status === 404) {
          toast.error("Profile not found!", { position: "top-center" });
        } else if (error.response.status === 401) {
          toast.error("Unauthorized access! Please log in again.", {
            position: "top-center",
          });
          navigate("/login"); // Redirect ke login jika token tidak valid
        } else {
          toast.error(
            `Error ${error.response.status}: ${error.response.data.message || "Something went wrong!"}`,
            {
              position: "top-center",
            }
          );
        }
      } else {
        toast.error("Failed to fetch profile data!", {
          position: "top-center",
        });
      }

      // Set state ke default agar tidak crash
      setName("No profile name available");
      setTitle("No profile available");
      setProfileImage("");
      setAbout("No about available.");
      setCaption("No caption available.");
      setDescription("No description available.");
      setContent("No content available.");
      setTechDescription("No tech available.");
    }
  };

  const updateProfiles = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("title", title);
    formData.append("image", image);
    formData.append("about", about);
    formData.append("caption", caption);
    formData.append("description", description);
    formData.append("content", content);
    formData.append("tech_description", tech_description);
    formData.append("_method", "PUT");

    await Api.post(`/api/admin/profiles/${user.id}`, formData, {
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

        navigate("/admin/profiles");
      })
      .catch((error) => {
        setErrors(error.response.data);
      });
  };

  const handleReset = () => {
    if (formRef.current) formRef.current.reset();
    setName("");
    setTitle("");
    setImage("");
    setAbout("");
    setCaption("");
    setDescription("");
    setContent("");
    setTechDescription("");

    setErrors([]);
  };

  useEffect(() => {
    fetchDataProfile();
    quillRef.current.getEditor();
  }, []);

  return (
    <LayoutAdmin>
      <Link
        to="/admin/profiles/"
        className="inline-flex items-center justify-center rounded-md bg-meta-4 text-white py-2 px-6 text-sm font-bold hover:bg-lime-400 focus:outline-none"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-lg border bg-white shadow-md mt-8 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Edit Profile
        </h3>
        <form ref={formRef} onSubmit={updateProfiles}>
          {/* Profile Title */}
          <div className="grid grid-cols-2 gap-2 my-4">
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                Profile Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Profile Title"
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name[0]}</p>
              )}
            </div>
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                Profile Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Profile Title"
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="text-red-500 text-xs">{errors.title[0]}</p>
              )}
            </div>
          </div>

          <div className="basis-64">
            {profileImage ? (
              <div className="relative">
                <img
                  src={profileImage}
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
          {/* Profile Image */}
          <div className="grid grid-cols-2 gap-2 my-4">
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-black dark:focus:border-primary"
              />
              {errors.image && (
                <p className="text-red-500 text-xs">{errors.image[0]}</p>
              )}
            </div>
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                Caption
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Enter Profile Title"
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              {errors.caption && (
                <p className="text-red-500 text-xs">{errors.caption[0]}</p>
              )}
            </div>
          </div>

          {/* About */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700">
              About
            </label>
            <ReactQuillEditor
              ref={quillRef}
              value={about}
              onChange={setAbout}
              placeholder="Enter Description..."
            />
            {errors.about && (
              <p className="text-red-500 text-xs mt-1">{errors.about[0]}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700">
              Description
            </label>
            <ReactQuillEditor
              ref={quillRef}
              value={description}
              onChange={setDescription}
              placeholder="Enter Description..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description[0]}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700">
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

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700">
              Tech Description
            </label>
            <ReactQuillEditor
              ref={quillRef}
              value={tech_description}
              onChange={setTechDescription}
              placeholder="Enter Tech Description..."
            />
            {errors.tech_description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.tech_description[0]}
              </p>
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
