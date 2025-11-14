import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, FormEvent } from "react";
import LayoutAdmin from "../../../layouts/Admin";

import toast from "react-hot-toast";
import Cookies from "js-cookie";
import SelectGroupTwo from "../../../components/general/SelectGroupTwo";
import ReactQuillEditor from "../../../components/general/ReactQuillEditor";
import ReactQuill from "react-quill";

// service
import { Api } from "@/services";

interface ValidationErrors {
  [key: string]: string[] | undefined;
}

interface ProfileOption {
  id: number;
  title: string;
}

export default function ExperiencesCreate() {
  document.title = "Create Experience - My Portfolio";

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);

  const [profileId, setProfileId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [profiles, setProfiles] = useState<ProfileOption[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState<boolean>(true);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const token = Cookies.get("token");

  const fetchProfiles = async () => {
    try {
      const { data } = await Api.get("/api/admin/profiles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = Array.isArray(data.data) ? data.data : [data.data];
      setProfiles(list);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load profiles");
    } finally {
      setLoadingProfiles(false);
    }
  };

  const storeExperience = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("profile_id", profileId);

    try {
      const res = await Api.post("/api/admin/experiences", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message, { position: "top-center" });
      navigate("/admin/experiences");
    } catch (err: any) {
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

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <LayoutAdmin>
      <Link
        to="/admin/experiences/"
        className="inline-flex items-center justify-center rounded-md bg-meta-4 text-white py-2 px-6 text-sm font-medium hover:bg-lime-400"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-lg border bg-white shadow-md mt-8 p-6">
        <h3 className="text-xl font-semibold mb-4">Create Experience</h3>

        <form ref={formRef} onSubmit={storeExperience}>
          {/* Job Title & Profile */}
          <div className="grid grid-cols-2 gap-2 my-4">
            <div>
              <label className="font-bold text-sm">Job Title</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-md"
                placeholder="Enter Job Title..."
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name[0]}</p>}
            </div>

            <div>
              <label className="font-bold text-sm">Select Profile</label>
              {loadingProfiles ? (
                <p>Loading profiles...</p>
              ) : (
                <SelectGroupTwo
                  value={profileId}
                  onChange={setProfileId}
                  options={profiles.map((p) => ({ value: p.id, label: p.title }))}
                  placeholder="-- Select Profile --"
                />
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="my-3">
            <label className="font-bold text-sm">Company Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="w-full border rounded-md p-2 cursor-pointer"
            />
            {errors.image && <p className="text-red-500 text-xs">{errors.image[0]}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-2 my-4">
            <div>
              <label className="font-bold text-sm">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 border rounded-md"
              />
              {errors.start_date && <p className="text-red-500 text-xs">{errors.start_date[0]}</p>}
            </div>
            <div>
              <label className="font-bold text-sm">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 border rounded-md"
              />
              {errors.end_date && <p className="text-red-500 text-xs">{errors.end_date[0]}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-bold">Description</label>
            <ReactQuillEditor
              ref={quillRef}
              value={description}
              onChange={setDescription}
              placeholder="Enter Description..."
            />
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
