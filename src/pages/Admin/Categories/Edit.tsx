import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState, FormEvent } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Api from "../../../services/Api";

interface Category {
  id: number;
  name: string;
  image: string;
}

interface ValidationErrors {
  name?: string[];
  image?: string[];
}

export default function CategoriesEdit() {
  document.title = "Update Category - Desa Digital";

  const formRef = useRef<HTMLFormElement | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const token = Cookies.get("token");

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [categoryImage, setCategoryImage] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  const fetchCategory = async () => {
    if (!token || !id) return;
    try {
      const res = await Api.get<{ data: Category }>(`/api/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setName(res.data.data.name);
      setCategoryImage(res.data.data.image);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const updateCategory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !id) return;

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);
    formData.append("_method", "PUT");

    try {
      const res = await Api.post(`/api/admin/categories/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message, { position: "top-center", duration: 4000 });
      navigate("/admin/categories");
    } catch (err: any) {
      console.error(err);
      setErrors(err.response?.data ?? {});
    }
  };

  const handleReset = () => {
    formRef.current?.reset();
    setName("");
    setImage(null);
    setErrors({});
  };

  return (
    <LayoutAdmin>
      <Link
        to="/admin/categories/"
        className="mx-2 my-3 inline-flex items-center justify-center rounded-md bg-lime-50 py-2 px-6 text-sm font-medium text-black outline outline-2 outline-black hover:bg-opacity-90"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Edit Category</h3>
        </div>

        <div className="flex flex-col gap-5.5 p-6.5">
          <form ref={formRef} onSubmit={updateCategory}>
            <div className="my-2">
              <label className="mb-3 block text-black dark:text-white">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name.."
                className="w-full rounded-lg border border-stroke py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name[0]}</p>}
            </div>

            <div className="mt-4">
              <label className="block text-black dark:text-white">Icon file</label>

              <div className="mb-3">
                <label className="form-label font-thin text-xs">Current Icon</label>
                {categoryImage ? (
                  <img
                    src={categoryImage}
                    alt="Category Icon"
                    style={{ width: "150px", height: "150px" }}
                  />
                ) : (
                  <span>No icon available</span>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                className="w-full cursor-pointer rounded-lg border border-stroke outline-none transition file:mr-5 file:border-0 file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 dark:border-form-strokedark dark:bg-form-input dark:file:bg-white/30"
              />
              {errors.image && <p className="text-sm text-red-600">{errors.image[0]}</p>}
            </div>

            <div className="flex my-4">
              <button
                type="submit"
                className="mx-2 inline-flex items-center justify-center rounded-md bg-blue-600 py-2 px-6 text-sm font-medium text-white hover:bg-opacity-90"
              >
                <i className="fa-solid fa-floppy-disk mr-2"></i> Update
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
