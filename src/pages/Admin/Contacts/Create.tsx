// import react-router-dom
import { Link, useNavigate } from "react-router-dom";
// import react
import { useRef, useState } from "react";

// import Api
import Api from "../../../services/Api";

//import LayoutAdmin
import LayoutAdmin from "../../../layouts/Admin";
// import toast js
import toast from "react-hot-toast";
// import Cookies js
import Cookies from "js-cookie";

export default function ContactsCreate() {
  //page title
  document.title = "Create Contacts - Desa Digital";

  //navigate
  const navigate = useNavigate();

  const formRef = useRef(null);

  //define state for form
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");

  const [errors, setErrors] = useState([]);

  document.title = "Create Contacts - My Portfolio";

  //token from cookies
  const token = Cookies.get("token");

  //fucntion "storeContacts"
  const storeContacts = async (e) => {
    e.preventDefault();

    //define formData
    const formData = new FormData();

    //this send data must "sequentially" and same with "Backend"
    formData.append("name", name);
    formData.append("image", image);
    formData.append("link", link);

    //sending data
    await Api.post("/api/admin/contacts", formData, {
      //headers
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data",
      },
    })
      .then((response) => {
        //show toast
        toast.success(response.data.message, {
          position: "top-center",
          duration: 6000,
        });

        //navigate
        navigate("/admin/contacts");
      })
      .catch((err) => {
        console.log(err);

        setErrors(err.response.data);
      });
  };

  const handleReset = () => {
    if (formRef.current) formRef.current.reset();
    setName("");
    setImage("");
    setLink("");
    setErrors([]);
  };

  return (
    <LayoutAdmin>
      <Link
        to="/admin/contacts/"
        className="inline-flex items-center justify-center rounded-md bg-meta-4 text-white py-2 px-6 text-sm font-medium hover:bg-lime-400 focus:outline-none"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-lg border bg-white shadow-md mt-8 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Create Contacts
        </h3>
        <form ref={formRef} onSubmit={storeContacts}>
          {/* Contacts Title */}
          <div className="grid grid-cols-2 gap-2 my-4">
            <div className="basis-128">
              <label className="form-label text-sm font-bold">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Contacts Name.."
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
              )}
            </div>

            <div className="basis-128">
              <label className="form-label text-sm font-bold">URL</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Enter URL.."
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              {errors.link && (
                <p className="text-red-500 text-xs mt-1">{errors.link[0]}</p>
              )}
            </div>
          </div>

          <div className="my-3">
            <div className="">
              <label className="form-label text-sm font-bold">Image</label>
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
