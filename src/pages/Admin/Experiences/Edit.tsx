import { useEffect, useRef, useState, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "../../../layouts/Admin";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
// import ReactQuillEditor from "../../../components/general/ReactQuillEditor";
import { Experience } from "@/types/experience";

// Service
import { Api } from "../../../services";

interface ValidationErrors {
  [key: string]: string[] | undefined;
}

export default function ExperiencesEdit() {
  document.title = "Edit Experience - My Portfolio";

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const formRef = useRef<HTMLFormElement | null>(null);
  // const quillRef = useRef<ReactQuill | null>(null);

  // ✅ State management
  const [image, setImage] = useState<File | null>(null);
  const [experienceImage, setExperienceImage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState<boolean>(true);

  const token = Cookies.get("token");

  // ✅ Fetch existing experience
  const fetchDataExperience = async () => {
    if (!token || !id) return;
    setLoading(true);

    try {
      const response = await Api.get<{ data: Experience }>(`/api/admin/experiences/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const exp = response.data.data;
      setName(exp.name);
      setDescription(exp.description);
      setExperienceImage(exp.image);
      setStartDate(new Date(exp.start_date).toISOString().slice(0, 10));
      setEndDate(new Date(exp.end_date).toISOString().slice(0, 10));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataExperience();
  }, [id]);

  // ✅ Update function
  const updateExperience = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !id) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    if (image) formData.append("image", image);
    formData.append("_method", "PUT");

    try {
      const res = await Api.post(`/api/admin/experiences/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message, { position: "top-center" });
      navigate("/admin/experiences");
    } catch (err: any) {
      console.error(err);
      setErrors(err.response?.data || {});
    }
  };

  const handleReset = () => {
    formRef.current?.reset();
    setName("");
    setDescription("");
    setImage(null);
    setStartDate("");
    setEndDate("");
    setErrors({});
  };

  return (
    <LayoutAdmin>
      <Link
        to="/admin/experiences/"
        className="inline-flex items-center justify-center rounded-md bg-meta-4 text-white py-2 px-6 text-sm font-medium hover:bg-lime-400"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Loading data, please wait...</p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border bg-white shadow-md mt-8 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit Experience</h3>

          <form ref={formRef} onSubmit={updateExperience}>
            {/* Name */}
            <div className="grid grid-cols-2 gap-2 my-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Experience Name..."
                  className="w-full p-3 border rounded-md"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
              </div>
            </div>

            {/* Image Preview + Upload */}
            <div className="my-3">
              {experienceImage ? (
                <div className="mb-3">
                  <img
                    src={experienceImage}
                    alt={name}
                    className="w-32 h-32 object-cover rounded-md border shadow-sm"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg mb-3">
                  <p className="text-sm text-gray-600">No image available</p>
                </div>
              )}

              <label className="block text-sm font-medium text-gray-700">Upload New Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                className="w-full border rounded-md p-2 cursor-pointer"
              />
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image[0]}</p>}
            </div>

            {/* Start & End Date */}
            <div className="grid grid-cols-2 gap-2 my-4">
              <div>
                <label className="font-bold text-sm">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 border rounded-md"
                />
                {errors.start_date && (
                  <p className="text-red-500 text-xs mt-1">{errors.start_date[0]}</p>
                )}
              </div>

              <div>
                <label className="font-bold text-sm">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 border rounded-md"
                />
                {errors.end_date && (
                  <p className="text-red-500 text-xs mt-1">{errors.end_date[0]}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              {/* <ReactQuillEditor
                // ref={quillRef}
                value={description}
                onChange={setDescription}
                placeholder="Enter Description..."
              /> */}
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex mt-5 items-center space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-500"
              >
                <i className="fa-solid fa-save mr-2"></i> Update
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
