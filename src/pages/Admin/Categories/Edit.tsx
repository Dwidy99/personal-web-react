import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState, FormEvent } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import toast from "react-hot-toast";
import { categoryService } from "../../../services";
import { ValidationErrors } from "../../../types/category";

export default function CategoriesEdit() {
  document.title = "Edit Category - Desa Digital";

  const formRef = useRef<HTMLFormElement | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [categoryImage, setCategoryImage] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      try {
        const data = await categoryService.getById(Number(id));
        setName(data.name);
        setCategoryImage(data.image);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to load category");
      }
    };
    fetch();
  }, [id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);
    formData.append("_method", "PUT");

    try {
      const res = await categoryService.update(Number(id), formData);
      toast.success(res.message || "Category updated!");
      navigate("/admin/categories");
    } catch (err: any) {
      setErrors(err.response?.data ?? {});
      toast.error(err?.response?.data?.message || "Failed to update category");
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/categories"
            className=" inline-flex items-center justify-center h-11 px-10 rounded-lg bg-meta-4 text-white text-sm font-semibold hover:bg-opacity-90 transition focus:outline-none focus:ring-2 focus:ring-meta-4 focus:ring-offset-2"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back
          </Link>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Category</h3>
        </div>
      </div>

      <div className="rounded-lg border border-stroke bg-white shadow-sm p-4 sm:p-6 dark:border-strokedark dark:bg-boxdark">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-gray-200">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-stroke rounded-md px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-transparent dark:text-white dark:border-strokedark"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-gray-200">
              Icon File
            </label>

            {categoryImage && (
              <div className="mb-3 flex items-center gap-3">
                <img
                  src={categoryImage}
                  alt="Category Icon"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md border"
                />
                <div className="text-xs text-gray-500 dark:text-gray-400">Current icon preview</div>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="w-full border border-stroke rounded-md p-2 text-sm cursor-pointer dark:bg-transparent dark:text-white dark:border-strokedark"
            />
            {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image[0]}</p>}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 text-white py-2.5 px-6 rounded-md hover:bg-blue-500"
            >
              <i className="fa-solid fa-floppy-disk mr-2"></i> Update
            </button>

            <button
              type="reset"
              onClick={handleReset}
              className="w-full sm:w-auto bg-gray-500 text-white py-2.5 px-6 rounded-md hover:bg-gray-400"
            >
              <i className="fa-solid fa-eraser mr-2"></i> Reset
            </button>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
