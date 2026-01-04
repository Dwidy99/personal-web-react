import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, FormEvent } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import toast from "react-hot-toast";
import { ValidationErrors } from "../../../types/category";
import { categoryService } from "../../../services";

const FORM_ID = "category-create-form";

export default function CategoriesCreate() {
  document.title = "Create Category - Desa Digital";

  const formRef = useRef<HTMLFormElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!image) {
      setPreviewImage("");
      return;
    }
    const url = URL.createObjectURL(image);
    setPreviewImage(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

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
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    formRef.current?.reset();
    if (fileRef.current) fileRef.current.value = "";
    setName("");
    setImage(null);
    setPreviewImage("");
    setErrors({});
  };

  return (
    <LayoutAdmin>
      <Link
        to="/admin/categories"
        className="inline-flex my-2 items-center justify-center h-11 px-5 rounded-lg bg-meta-4 text-white text-sm font-semibold hover:bg-opacity-90 transition disabled:opacity-60"
      >
        Back
      </Link>

      <div className="rounded-lg border border-stroke bg-white shadow-sm p-4 sm:p-6 dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
              Add Category
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create a category and upload an icon.
            </p>
          </div>
        </div>
        <form id={FORM_ID} ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-gray-200">
                  Category Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                  className="w-full border border-stroke rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-transparent dark:text-white dark:border-strokedark disabled:opacity-60"
                  placeholder="Enter category name..."
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-gray-200">
                Icon File
              </label>

              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Icon Preview"
                  className="h-40 w-full rounded-lg object-cover border border-stroke dark:border-strokedark"
                />
              ) : (
                <div className="h-40 w-full rounded-lg border border-dashed border-stroke dark:border-strokedark flex items-center justify-center text-sm text-gray-500">
                  No image
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                disabled={submitting}
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                className="w-full border border-stroke rounded-lg p-2 text-sm cursor-pointer dark:bg-transparent dark:text-white dark:border-strokedark disabled:opacity-60"
              />
              {errors.image && <p className="text-xs text-red-500">{errors.image[0]}</p>}
            </div>
          </div>

          <div className="flex justify-end w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              type="submit"
              form={FORM_ID}
              disabled={submitting}
              className="inline-flex items-center justify-center h-11 px-5 rounded-lg bg-blue-800 text-white text-sm font-semibold hover:bg-opacity-90 transition disabled:opacity-60"
            >
              {submitting && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
              )}
              {submitting ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={submitting}
              className="inline-flex items-center justify-center h-11 px-5 rounded-lg bg-gray-600 text-white text-sm font-semibold hover:bg-opacity-90 transition disabled:opacity-60"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
