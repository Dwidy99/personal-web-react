import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, type FormEvent } from "react";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import SubmitButton from "@/components/admin/SubmitButton";
import type { AdminContactFormErrors } from "@/features/admin/contacts/types";
import { contactService } from "@/services";
import {
  getErrorMessage,
  getValidationErrors,
} from "@/features/admin/shared/utils/apiError";

export default function ContactsCreate() {
  document.title = "Create Contact - My Portfolio";

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<AdminContactFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("link", link);
    if (image) formData.append("image", image);

    try {
      setSubmitting(true);
      const res = await contactService.create(formData);
      toast.success(res.message || "Contact created successfully!");
      navigate("/admin/contacts");
    } catch (error: unknown) {
      setErrors(getValidationErrors(error));
      toast.error(getErrorMessage(error, "Failed to create contact"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    formRef.current?.reset();
    setName("");
    setLink("");
    setImage(null);
    setErrors({});
  };

  return (
    <LayoutAdmin>
      <div className="mb-4">
        <Link
          to="/admin/contacts"
          className="inline-flex items-center justify-center rounded-lg bg-meta-4 px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Back
        </Link>
      </div>

      <div className="rounded-xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark p-4 sm:p-6 lg:p-8">
        <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
          Create Contact
        </h3>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                Name
              </label>
              <input
                type="text"
                value={name}
                disabled={submitting}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm dark:border-strokedark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                placeholder="Enter contact name..."
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                URL
              </label>
              <input
                type="text"
                value={link}
                disabled={submitting}
                onChange={(e) => setLink(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm dark:border-strokedark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                placeholder="https://example.com"
              />
              {errors.link && <p className="mt-1 text-xs text-red-500">{errors.link[0]}</p>}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              disabled={submitting}
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="w-full cursor-pointer rounded-lg border border-stroke p-2 text-sm dark:border-strokedark disabled:opacity-60"
            />
            {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image[0]}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
            <button
              type="reset"
              onClick={handleReset}
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg bg-gray-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
            >
              <i className="fa-solid fa-redo mr-2"></i> Reset
            </button>
            <SubmitButton loading={submitting} icon={<i className="fa-solid fa-save" />}>
              Save
            </SubmitButton>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
