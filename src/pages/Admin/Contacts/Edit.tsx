import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "../../../layouts/Admin";
import toast from "react-hot-toast";
import type { ValidationErrors, Contact } from "../../../types/contact";
import { contactService } from "../../../services";

export default function ContactsEdit() {
  document.title = "Edit Contact - My Portfolio";

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [contact, setContact] = useState<Contact | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!image) {
      setImagePreview("");
      return;
    }
    const url = URL.createObjectURL(image);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const data = await contactService.getById(Number(id));
        setContact(data);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to load contact");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id]);

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
      const res = await contactService.update(Number(id), formData);
      toast.success(res.message || "Contact updated!");
      navigate("/admin/contacts");
    } catch (err: any) {
      setErrors(err.response?.data ?? {});
      toast.error(err?.response?.data?.message || "Failed to update contact");
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
        <div className="rounded-xl border border-stroke bg-white p-10 text-center text-gray-500 shadow-sm dark:border-strokedark dark:bg-boxdark">
          Loading contact data...
        </div>
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
                        onChange={(e) =>
                          setContact((prev) => (prev ? { ...prev, name: e.target.value } : prev))
                        }
                        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm dark:border-strokedark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
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
                        onChange={(e) =>
                          setContact((prev) => (prev ? { ...prev, link: e.target.value } : prev))
                        }
                        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm dark:border-strokedark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
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
                      onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                      className="w-full cursor-pointer rounded-lg border border-stroke p-2 text-sm dark:border-strokedark"
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
                  className="inline-flex items-center justify-center rounded-lg bg-gray-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
                >
                  <i className="fa-solid fa-redo mr-2"></i> Reset
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
                >
                  <i className="fa-solid fa-save mr-2"></i> Save
                </button>
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
