import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, FormEvent } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../services/Api";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface ValidationErrors {
  name?: string[];
  image?: string[];
  link?: string[];
  [key: string]: string[] | undefined;
}

export default function ContactsCreate() {
  document.title = "Create Contacts - My Portfolio";

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);
  const token = Cookies.get("token");

  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [link, setLink] = useState<string>("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  const storeContacts = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);
    formData.append("link", link);

    try {
      const response = await Api.post("/api/admin/contacts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message, { position: "top-center", duration: 4000 });
      navigate("/admin/contacts");
    } catch (err: any) {
      console.error(err);
      setErrors(err.response?.data ?? {});
    }
  };

  const handleReset = () => {
    formRef.current?.reset();
    setName("");
    setImage(null);
    setLink("");
    setErrors({});
  };

  return (
    <LayoutAdmin>
      <Link
        to="/admin/contacts/"
        className="inline-flex items-center justify-center rounded-md bg-meta-4 text-white py-2 px-6 text-sm font-medium hover:bg-lime-400 focus:outline-none"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-lg border bg-white shadow-md mt-8 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Contacts</h3>

        <form ref={formRef} onSubmit={storeContacts}>
          <div className="grid grid-cols-2 gap-2 my-4">
            <div>
              <label className="text-sm font-bold">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Contact Name.."
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
            </div>

            <div>
              <label className="text-sm font-bold">URL</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Enter URL.."
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              {errors.link && <p className="text-red-500 text-xs mt-1">{errors.link[0]}</p>}
            </div>
          </div>

          <div className="my-3">
            <label className="text-sm font-bold">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="w-full cursor-pointer rounded-lg border border-stroke bg-transparent file:mr-5 file:border-0 file:bg-whiter file:py-3 file:px-5 dark:border-form-strokedark"
            />
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image[0]}</p>}
          </div>

          <div className="flex mt-5 items-center space-x-4">
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
