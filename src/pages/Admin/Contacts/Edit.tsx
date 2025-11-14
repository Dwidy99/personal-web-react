import { useEffect, useRef, useState, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "../../../layouts/Admin";
import toast from "react-hot-toast";
import { contactService } from "../../../services/contactService";
import { ValidationErrors, Contact } from "../../../types/contact";

export default function ContactsEdit() {
  document.title = "Edit Contact - My Portfolio";

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [contact, setContact] = useState<Contact | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      try {
        const data = await contactService.getById(Number(id));
        setContact(data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    const formData = new FormData();
    formData.append("name", contact?.name || "");
    formData.append("link", contact?.link || "");
    if (image) formData.append("image", image);
    formData.append("_method", "PUT");

    try {
      const res = await contactService.update(Number(id), formData);
      toast.success(res.message || "Contact updated!", { position: "top-center" });
      navigate("/admin/contacts");
    } catch (err: any) {
      setErrors(err.response?.data ?? {});
    }
  };

  const handleReset = () => {
    formRef.current?.reset();
    setImage(null);
    setErrors({});
  };

  return (
    <LayoutAdmin>
      <Link
        to="/admin/contacts/"
        className="inline-flex items-center justify-center rounded-md bg-meta-4 text-white py-2 px-6 text-sm font-medium hover:bg-lime-400"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600">Loading contact data...</p>
        </div>
      ) : (
        <div className="rounded-lg border bg-white shadow-md mt-8 p-6">
          <h3 className="text-xl font-semibold mb-4">Edit Contact</h3>

          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold mb-1">Contact Name</label>
                <input
                  type="text"
                  value={contact?.name || ""}
                  onChange={(e) => setContact((prev) => prev && { ...prev, name: e.target.value })}
                  className="w-full border rounded-md p-3"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">URL</label>
                <input
                  type="text"
                  value={contact?.link || ""}
                  onChange={(e) => setContact((prev) => prev && { ...prev, link: e.target.value })}
                  className="w-full border rounded-md p-3"
                />
                {errors.link && <p className="text-xs text-red-500">{errors.link[0]}</p>}
              </div>
            </div>

            <div className="mb-4">
              {contact?.image && (
                <img
                  src={contact.image}
                  alt={contact.name}
                  className="w-24 h-24 object-cover rounded-md mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                className="w-full border rounded-md p-2 cursor-pointer"
              />
              {errors.image && <p className="text-xs text-red-500">{errors.image[0]}</p>}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-500"
              >
                <i className="fa-solid fa-save mr-2"></i> Save
              </button>
              <button
                type="reset"
                onClick={handleReset}
                className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-400"
              >
                <i className="fa-solid fa-redo mr-2"></i> Reset
              </button>
            </div>
          </form>
        </div>
      )}
    </LayoutAdmin>
  );
}
