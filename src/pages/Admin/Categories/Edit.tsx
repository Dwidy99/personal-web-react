import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState, FormEvent } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import toast from "react-hot-toast";
import { categoryService } from "../../../services/categoryService";
import { Category, ValidationErrors } from "../../../types/category";

export default function CategoriesEdit() {
  document.title = "Edit Category - Desa Digital";

  const formRef = useRef<HTMLFormElement | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [categoryImage, setCategoryImage] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      const data = await categoryService.getById(Number(id));
      setName(data.name);
      setCategoryImage(data.image);
    };
    fetch();
  }, [id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

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
    }
  };

  const handleReset = () => {
    formRef.current?.reset();
    setName("");
    setImage(null);
    setErrors({});
  };

  return (
    <LayoutAdmin>
      <Link
        to="/admin/categories/"
        className="mx-2 my-3 inline-flex items-center justify-center rounded-md bg-lime-50 py-2 px-6 text-sm font-medium text-black outline outline-2 outline-black hover:bg-opacity-90"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-lg border bg-white shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Edit Category</h3>

        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-md p-3"
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name[0]}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">Icon File</label>
            {categoryImage && (
              <div className="mb-2">
                <img
                  src={categoryImage}
                  alt="Category Icon"
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="w-full border rounded-md p-2 cursor-pointer"
            />
            {errors.image && <p className="text-xs text-red-600">{errors.image[0]}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-500"
            >
              <i className="fa-solid fa-floppy-disk mr-2"></i> Update
            </button>
            <button
              type="reset"
              onClick={handleReset}
              className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-400"
            >
              <i className="fa-solid fa-eraser mr-2"></i> Reset
            </button>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
