import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Api from "../../../services/Api";

export default function CategoriesEdit() {
  // title page
  document.title = "Update Category - Desa Digital";

  const formRef = useRef(null);

  // navigate
  const navigate = useNavigate();

  // define params
  const { id } = useParams();

  // define state for form
  const [name, setName] = useState("");
  const [image, setImage] = useState(null); // state untuk menyimpan gambar
  const [errors, setErrors] = useState([]);
  const [categoryImage, setCategoryImage] = useState(""); // state untuk menyimpan image URL dari kategori

  // define from cookies
  const token = Cookies.get("token");

  // function fetchDataCategory
  const fetchDataCategory = async () => {
    await Api.get(`/api/admin/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setName(response.data.data.name);
      setCategoryImage(response.data.data.image); // set image URL dari API ke state
    });
  };

  // useEffect untuk fetch data kategori
  useEffect(() => {
    fetchDataCategory();
  }, []);

  // function updateCategory untuk mengedit kategori
  const updateCategory = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    if (image) {
      formData.append("image", image); // menambahkan file gambar ke form data
    }
    formData.append("_method", "PUT");

    await Api.post(`/api/admin/categories/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data", // pastikan type form-data
      },
    })
      .then((response) => {
        toast.success(response.data.message, {
          position: "top-center",
          duration: 5000,
        });
        navigate("/admin/categories");
      })
      .catch((err) => {
        setErrors(err.response.data);
      });
  };

  // function handle image change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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
    <LayoutAdmin>
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
            Edit Category
          </h3>
        </div>
        <div className="flex flex-col gap-5.5 p-6.5">
          <form onSubmit={updateCategory}>
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

            <div className="mt-4">
              <label className="block text-black dark:text-white">
                Icon file
              </label>

              {/* Display current image */}
              <div className="mb-3">
                <label className="form-label font-thin text-xs">
                  Current Icon
                </label>
                {categoryImage ? (
                  <div>
                    <img
                      src={categoryImage}
                      alt="Category Icon"
                      style={{ width: "150px", height: "150px" }}
                    />
                  </div>
                ) : (
                  <span>No icon available</span>
                )}
              </div>

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
