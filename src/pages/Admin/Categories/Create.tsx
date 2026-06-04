import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import LayoutAdmin from "@/layouts/Admin";
import SubmitButton from "@/components/admin/SubmitButton";
import { categoryService } from "@/services/categoryService";
import type { AdminCategoryFormErrors } from "@/features/admin/categories/types";
import {
  getErrorMessage,
  getValidationErrors,
} from "@/features/admin/shared/utils/apiError";

const FORM_ID = "category-create-form";

export default function CategoriesCreate() {
  document.title = "Create Category - Desa Digital";

  const formRef = useRef<HTMLFormElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [errors, setErrors] = useState<AdminCategoryFormErrors>({});
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
    formData.append("name", name);
    if (image) formData.append("image", image);

    try {
      const res = await categoryService.create(formData);
      toast.success(res.message || "Category created successfully!");
      navigate("/admin/categories");
    } catch (error: unknown) {
      setErrors(getValidationErrors(error));
      toast.error(getErrorMessage(error, "Failed to create category"));
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
      <div className="mb-4">
        <Link
          to="/admin/categories"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-meta-4 px-4 text-sm font-medium text-white transition hover:bg-opacity-90"
        >
          <i className="fa-solid fa-arrow-left mr-2" /> Back
        </Link>
      </div>

      <div className="mx-auto max-w-5xl rounded-lg border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-4 py-4 dark:border-strokedark sm:px-6">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Add New Category
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create a clean category entry with a readable name and icon.
          </p>
        </div>

        <form id={FORM_ID} ref={formRef} onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <section className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-lg border border-stroke bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 dark:border-strokedark dark:bg-transparent dark:text-white dark:placeholder-gray-500"
                  placeholder="Example: Web Development"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
              </div>

              <div className="rounded-lg border border-stroke bg-gray-50 px-4 py-3 text-sm text-slate-600 dark:border-strokedark dark:bg-boxdark-2 dark:text-gray-300">
                <p className="font-semibold text-slate-700 dark:text-gray-200">Tips</p>
                <p className="mt-1">
                  Gunakan nama yang pendek dan jelas agar mudah dibaca di halaman blog dan filter kategori.
                </p>
              </div>
            </section>

            <aside className="space-y-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Category Icon <span className="text-red-500">*</span>
                </label>

                <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-stroke bg-gray-50 dark:border-strokedark dark:bg-boxdark-2">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Category icon preview"
                      className="h-full w-full object-contain p-4"
                    />
                  ) : (
                    <div className="px-6 text-center text-sm text-gray-500 dark:text-gray-400">
                      <i className="fa-regular fa-image mb-3 block text-3xl" />
                      No icon selected
                    </div>
                  )}
                </div>
              </div>

              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  disabled={submitting}
                  onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                  className="w-full cursor-pointer rounded-lg border border-stroke bg-transparent px-3 py-2.5 text-sm text-slate-800 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 hover:file:bg-gray-200 disabled:opacity-60 dark:border-strokedark dark:text-white dark:file:bg-boxdark-2 dark:hover:file:bg-boxdark"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  PNG/JPG/JPEG, gunakan ikon yang jelas dengan background bersih.
                </p>
                {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image[0]}</p>}
              </div>
            </aside>
          </div>

          <div className="flex flex-col gap-3 border-t border-stroke px-4 py-4 dark:border-strokedark sm:flex-row sm:justify-end sm:px-6">
            <SubmitButton
              form={FORM_ID}
              loading={submitting}
              loadingText="Saving..."
              icon={<i className="fa-solid fa-plus" />}
              className="h-11 rounded-lg px-5 font-semibold"
            >
              Add Category
            </SubmitButton>

            <button
              type="button"
              onClick={handleReset}
              disabled={submitting}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-600 px-5 text-sm font-semibold text-white transition hover:bg-opacity-90 disabled:opacity-60"
            >
              <i className="fa-solid fa-eraser mr-2" /> Reset
            </button>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
