//import react-router-dom
import { Link, useNavigate } from "react-router-dom";
//import useState
import { useRef, useState } from "react";

//import LayoutAdmin
import LayoutAdmin from "../../../layouts/Admin";

import Api from "../../../services/Api";

//import toast js
import toast from "react-hot-toast";
//import Cookies js
import Cookies from "js-cookie";

export default function CategoriesCreate() {
  //title page
  document.title = "Create Category - Desa Digital";

  const formRef = useRef(null);

  //const navigate
  const navigate = useNavigate();

  //define state for form
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState([]);

  //token from cookies
  const token = Cookies.get("token");

  //function "storeCategory"
  const storeCategory = async (e) => {
    e.preventDefault();

    //define formData
    const formData = new FormData();

    //this send data must "sequentially" and same with "Backend"
    formData.append("image", image);
    formData.append("name", name);

    //sending data
    await Api.post("/api/admin/categories", formData, {
      //headers
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        //show toast
        toast.success(response.data.message, {
          position: "top-center",
          duration: 5000,
        });

        //navigate
        navigate("/admin/categories");
      })
      .catch((err) => {
        console.log(err);
        
        setErrors(err.response.data);
      });
  };

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset(); // Reset form fields
    }
    setName(""); // Reset name state
    setImage(""); // Reset image state
    setErrors([]); // Clear errors
  };

  return (
    <LayoutAdmin className="dark:bg-boxdark">
      <Link
        to="/admin/categories/"
        type="submit"
        className="mx-2 my-3 inline-flex items-center justify-center rounded-md bg-lime-50 py-2 px-6 text-center text-sm font-medium text-black hover:bg-opacity-90 lg:px-6 xl:px-8 outline outline-2 outline-black"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Add Category
          </h3>
        </div>
        <div className="flex flex-col gap-5.5 p-6.5">
          <form onSubmit={storeCategory}>
            <div className="my-2">
              <label className="mb-3 block text-black dark:text-white">
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter role name.."
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.name && (
                <div className="w-full">
                  <p className="mb-3 text-sm font-semibold text-[#bd2929]">
                    {errors.name[0]}
                  </p>
                </div>
              )}
            </div>

            <div className="my-2">
              <label className="mb-3 block text-black dark:text-white">
                Icon file
              </label>
              <input
                type="file"
                id="file"
                accept="images/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-black dark:focus:border-primary"
              />
              {errors.image && (
                <div className="w-full">
                  <p className="mb-3 text-sm font-semibold text-[#bd2929]">
                    {errors.image[0]}
                  </p>
                </div>
              )}
            </div>

            <div className="flex my-4">
              <button
                type="submit"
                className="mx-2 inline-flex items-center justify-center rounded-md bg-blue-600 py-2 px-6 text-center text-sm font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-8"
              >
                <i className="fa-solid fa-plus mr-2"></i> Add
              </button>
              <button
                type="reset"
                onClick={handleReset}
                className="mx-2 inline-flex items-center justify-center rounded-md bg-slate-600 py-2 px-6 text-center text-sm font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-8"
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
