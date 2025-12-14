import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, FormEvent } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import toast from "react-hot-toast";
import { ValidationErrors } from "../../../types/category";
import { categoryService } from "../../../services";

export default function CategoriesCreate() {
  document.title = "Create Category - Desa Digital";

  const formRef = useRef<HTMLFormElement | null>(null);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("name", name);

    try {
      const res = await categoryService.create(formData);
      toast.success(res.message || "Category created successfully!");
      navigate("/admin/categories");
    } catch (err: any) {
      setErrors(err.response?.data ?? {});
      toast.error(err.response?.data?.message || "Failed to create category");
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

          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Add Category</h3>
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
              placeholder="Enter category name..."
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-gray-200">
              Icon File
            </label>
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
              <i className="fa-solid fa-plus mr-2"></i> Add
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
