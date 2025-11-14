import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, FormEvent } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import toast from "react-hot-toast";
import { ValidationErrors } from "../../../types/contact";

// Service
import { contactService } from "../../../services";

export default function ContactsCreate() {
  document.title = "Create Contact - My Portfolio";

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("link", link);
    if (image) formData.append("image", image);

    try {
      const res = await contactService.create(formData);
      toast.success(res.message || "Contact created successfully!", {
        position: "top-center",
      });
      navigate("/admin/contacts");
    } catch (err: any) {
      setErrors(err.response?.data ?? {});
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
      <Link
        to="/admin/contacts/"
        className="inline-flex items-center justify-center rounded-md bg-meta-4 text-white py-2 px-6 text-sm font-medium hover:bg-lime-400"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-lg border bg-white shadow-md mt-8 p-6">
        <h3 className="text-xl font-semibold mb-4">Create Contact</h3>

        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-md p-3"
                placeholder="Enter contact name..."
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">URL</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full border rounded-md p-3"
                placeholder="Enter link URL..."
              />
              {errors.link && <p className="text-xs text-red-500">{errors.link[0]}</p>}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">Image</label>
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
    </LayoutAdmin>
  );
}
