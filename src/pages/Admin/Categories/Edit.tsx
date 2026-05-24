import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState, type FormEvent } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import toast from "react-hot-toast";
import { categoryService } from "../../../services";
import { ValidationErrors } from "../../../types/category";
import SubmitButton from "@/components/admin/SubmitButton";
import Loading from "@/components/admin/Loading";

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
  const [previewImage, setPreviewImage] = useState("");
  const [initialName, setInitialName] = useState("");
  const [initialImageUrl, setInitialImageUrl] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;

      setLoadingCategory(true);

      try {
        const data = await categoryService.getById(Number(id));

        setName(data.name ?? "");
        setCategoryImage(data.image ?? "");
        setPreviewImage("");
        setInitialName(data.name ?? "");
        setInitialImageUrl(data.image ?? "");
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to load category");
      } finally {
        setLoadingCategory(false);
      }
    };

    fetchCategory();
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
  const shownImageLabel = previewImage ? "New icon preview" : "Current icon";

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
            Edit Category
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update the category name or replace its icon.
          </p>
        </div>

        {loadingCategory ? (
          <Loading message="Loading category..." variant="page" className="py-10" />
        ) : (
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
                  <p className="font-semibold text-slate-700 dark:text-gray-200">Current value</p>
                  <p className="mt-1">
                    Changes will update how this category appears in admin lists and public category sections.
                  </p>
                </div>
              </section>

              <aside className="space-y-3">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200">
                      Category Icon
                    </label>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{shownImageLabel}</span>
                  </div>

                  <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-stroke bg-gray-50 dark:border-strokedark dark:bg-boxdark-2">
                    {shownImage ? (
                      <img
                        src={shownImage}
                        alt="Category icon"
                        className="h-full w-full object-contain p-4"
                      />
                    ) : (
                      <div className="px-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        <i className="fa-regular fa-image mb-3 block text-3xl" />
                        No icon
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
                    Kosongkan file jika tidak ingin mengganti icon.
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
                icon={<i className="fa-solid fa-save" />}
                className="h-11 rounded-lg px-5 font-semibold"
              >
                Save Changes
              </SubmitButton>

              <button
                type="button"
                onClick={handleReset}
                disabled={submitting}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-600 px-5 text-sm font-semibold text-white transition hover:bg-opacity-90 disabled:opacity-60"
              >
                <i className="fa-solid fa-rotate-left mr-2" /> Reset
              </button>
            </div>
          </form>
        )}
      </div>
    </LayoutAdmin>
  );
}
