import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState, FormEvent } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import toast from "react-hot-toast";
import { categoryService } from "../../../services";
import { ValidationErrors } from "../../../types/category";

const FORM_ID = "category-edit-form";

export default function CategoriesEdit() {
  document.title = "Edit Category - Desa Digital";

  const formRef = useRef<HTMLFormElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [categoryImage, setCategoryImage] = useState("");
  const [previewImage, setPreviewImage] = useState<string>("");

  const [initialName, setInitialName] = useState("");
  const [initialImageUrl, setInitialImageUrl] = useState("");

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      try {
        const data = await categoryService.getById(Number(id));

        setName(data.name ?? "");
        setCategoryImage(data.image ?? "");
        setPreviewImage("");

        setInitialName(data.name ?? "");
        setInitialImageUrl(data.image ?? "");
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to load category");
      }
    };
    fetch();
  }, [id]);

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
    if (!id) return;

    setSubmitting(true);
    setErrors({});

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
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    formRef.current?.reset();
    if (fileRef.current) fileRef.current.value = "";

    setName(initialName);
    setImage(null);
    setCategoryImage(initialImageUrl);
    setPreviewImage("");
    setErrors({});
  };

  const shownImage = previewImage || categoryImage;

  return (
    <LayoutAdmin>
      <Link
        to="/admin/categories"
        className="inline-flex items-center justify-center my-2 h-11 px-5 rounded-lg bg-meta-4 text-white text-sm font-semibold hover:bg-opacity-90 transition"
      >
        Back
      </Link>

      <div className="rounded-lg border border-stroke bg-white shadow-sm p-4 sm:p-6 dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
              Edit Category
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Update category name and icon.
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
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-gray-200">
                Icon File
              </label>

              {shownImage ? (
                <img
                  src={shownImage}
                  alt="Category Icon"
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
