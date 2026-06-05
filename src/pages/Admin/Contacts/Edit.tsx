import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import Loading from "@/components/admin/Loading";
import SubmitButton from "@/components/admin/SubmitButton";
import type {
  AdminContact,
  AdminContactFormErrors,
} from "@/features/admin/contacts/types";
import { contactService } from "@/services";
import {
  getErrorMessage,
  getValidationErrors,
} from "@/features/admin/shared/utils/apiError";

export default function ContactsEdit() {
  document.title = "Edit Contact - My Portfolio";

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [contact, setContact] = useState<AdminContact | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<AdminContactFormErrors>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!image) {
      setImagePreview("");
      return;
    }
    const url = URL.createObjectURL(image);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const fetchContact = useCallback(async (): Promise<void> => {
    if (!id) return;

    setLoading(true);

    try {
      const data = await contactService.getById(Number(id));
      setContact(data);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to load contact"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchContact();
  }, [fetchContact]);

  const currentImage = useMemo(() => imagePreview || contact?.image || "", [imagePreview, contact]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !contact) return;

    const formData = new FormData();
    formData.append("name", contact.name || "");
    formData.append("link", contact.link || "");
    if (image) formData.append("image", image);
    formData.append("_method", "PUT");

    try {
      setSubmitting(true);
      const res = await contactService.update(Number(id), formData);
      toast.success(res.message || "Contact updated!");
      navigate("/admin/contacts");
    } catch (error: unknown) {
      setErrors(getValidationErrors(error));
      toast.error(getErrorMessage(error, "Failed to update contact"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    formRef.current?.reset();
    setImage(null);
    setImagePreview("");
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

      {loading ? (
        <Loading message="Loading contact data..." className="rounded-xl p-10" />
      ) : (
        <div className="rounded-xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark p-4 sm:p-6 lg:p-8">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
            Edit Contact
          </h3>

          {contact ? (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Fields */}
                <div className="lg:col-span-2 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        value={contact.name || ""}
                        disabled={submitting}
                        onChange={(e) =>
                          setContact((prev) => (prev ? { ...prev, name: e.target.value } : prev))
                        }
                        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm dark:border-strokedark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                      />
                      {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                        URL
                      </label>
                      <input
                        type="text"
                        value={contact.link || ""}
                        disabled={submitting}
                        onChange={(e) =>
                          setContact((prev) => (prev ? { ...prev, link: e.target.value } : prev))
                        }
                        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm dark:border-strokedark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                      />
                      {errors.link && <p className="mt-1 text-xs text-red-500">{errors.link[0]}</p>}
                    </div>
                  </div>
                </div>

                {/* Image Card */}
                <div className="rounded-xl border border-stroke p-4 dark:border-strokedark">
                  <p className="text-sm font-semibold text-slate-700 dark:text-gray-200">
                    Contact Image
                  </p>

                  <div className="mt-4 flex items-center justify-center">
                    {currentImage ? (
                      <img
                        src={currentImage}
                        alt={contact.name}
                        className="h-32 w-32 rounded-xl border border-stroke object-cover dark:border-strokedark"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-xl border border-dashed border-stroke dark:border-strokedark flex items-center justify-center text-xs text-gray-500">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={submitting}
                      onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                      className="w-full cursor-pointer rounded-lg border border-stroke p-2 text-sm dark:border-strokedark disabled:opacity-60"
                    />
                    {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image[0]}</p>}
                  </div>
                </div>
              </div>

              {/* Actions */}
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
          ) : (
            <div className="py-10 text-center text-gray-500 dark:text-gray-400">
              Contact not found.
            </div>
          )}
        </div>
      )}
    </LayoutAdmin>
  );
}
