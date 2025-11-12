// import react-router-dom
import { Link, useNavigate } from "react-router-dom";
// import react
import { useEffect, useRef, useState } from "react";

// import Api
import Api from "../../../services/Api";

//import LayoutAdmin
import LayoutAdmin from "../../../layouts/Admin";
// import toast js
import toast from "react-hot-toast";
// import Cookies js
import Cookies from "js-cookie";
import SelectGroupTwo from "../../../components/general/SelectGroupTwo";
import ReactQuillEditor from "../../../components/general/ReactQuillEditor";

export default function ExperiencesCreate() {
  //page title
  document.title = "Create Experience - Desa Digital";

  //navigate
  const navigate = useNavigate();

  const formRef = useRef(null);
  const quillRef = useRef(null);

  //define state for form
  const [profileId, setProfileId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [errors, setErrors] = useState([]);

  const [profiles, setProfiles] = useState([]);

  const [loadingProfiles, setLoadingProfiles] = useState(true);

  document.title = "Create Experience - My Portfolio";

  //token from cookies
  const token = Cookies.get("token");

  const fetchProfiles = async () => {
    try {
      const { data } = await Api.get("/api/admin/profiles", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // kalau data.data itu object (single profile), bungkus ke array
      const profilesArray = Array.isArray(data.data) ? data.data : [data.data];

      setProfiles(profilesArray);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoadingProfiles(false);
    }
  };

  //fucntion "storeExperience"
  const storeExperience = async (e) => {
    e.preventDefault();

    //define formData
    const formData = new FormData();

    //this send data must "sequentially" and same with "Backend"
    formData.append("image", image);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("profile_id", profileId);

    //sending data
    await Api.post("/api/admin/experiences", formData, {
      //headers
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data",
      },
    })
      .then((response) => {
        //show toast
        toast.success(response.data.message, {
          position: "top-center",
          duration: 6000,
        });

        //navigate
        navigate("/admin/experiences");
      })
      .catch((err) => {
        setErrors(err.response.data);
      });
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleReset = () => {
    if (formRef.current) formRef.current.reset();
    setName("");
    setDescription("");
    setImage("");
    setStartDate("");
    setEndDate("");
    setErrors([]);
  };

  return (
    <LayoutAdmin>
      <Link
        to="/admin/experiences/"
        className="inline-flex items-center justify-center rounded-md bg-meta-4 text-white py-2 px-6 text-sm font-medium hover:bg-lime-400 focus:outline-none"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-lg border bg-white shadow-md mt-8 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Create Experience
        </h3>
        <form ref={formRef} onSubmit={storeExperience}>
          {/* Experience Title */}
          <div className="grid grid-cols-2 gap-2 my-4 mb-6">
            <div className="basis-128">
              <label className="form-label text-sm font-bold">Job Title</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Experience Name.."
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              {errors.experience_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.experience_name[0]}
                </p>
              )}
            </div>

            <div className="basis-128">
              <label className="form-label text-sm font-bold">
                Select Profile
              </label>
              {loadingProfiles ? (
                <p>Loading profiles...</p>
              ) : (
                <SelectGroupTwo
                  value={profileId}
                  onChange={setProfileId}
                  options={
                    Array.isArray(profiles)
                      ? profiles.map((profile) => ({
                          value: profile.id,
                          label: profile.title,
                        }))
                      : []
                  }
                  placeholder="-- Select Profile --"
                />
              )}
            </div>
          </div>

          <div className="my-3">
            <div className="basis-128 col-span-2">
              <label className="form-label text-sm font-bold">
                Company Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-black dark:focus:border-primary"
              />
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image[0]}</p>
              )}
            </div>
          </div>

          {/* Start Date & End Date */}
          <div className="grid grid-cols-2 gap-2 my-4">
            <div className="basis-128">
              <label className="form-label text-sm font-bold">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              {errors.start_date && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.start_date[0]}
                </p>
              )}
            </div>

            <div className="basis-128">
              <label className="form-label text-sm font-bold">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              {errors.end_date && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.end_date[0]}
                </p>
              )}
            </div>
          </div>

          {/* // Content Editor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <ReactQuillEditor
              ref={quillRef}
              value={description}
              onChange={setDescription}
              placeholder="Enter Description..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description[0]}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex mt-5.5 items-center space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-500 focus:outline-none"
            >
              <i className="fa-solid fa-save mr-2"></i> Save
            </button>
            <button
              type="reset"
              onClick={handleReset}
              className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-400 focus:outline-none"
            >
              <i className="fa-solid fa-redo mr-2"></i> Reset
            </button>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
