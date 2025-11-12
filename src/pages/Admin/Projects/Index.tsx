//import react
import { useEffect, useState } from "react";
//import react-router-dom
import { Link } from "react-router-dom";

//import LayoutAdmin
import LayoutAdmin from "../../../layouts/Admin";

//import Api
import Api from "../../../services/Api";
//import Pagination
import Pagination from "../../../components/general/Pagination";

//import Cookies js
import Cookies from "js-cookie";
import hasAnyPermissions from "../../../utils/Permissions";

//import component create
import ProjectsCreate from "./Create";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import { MdDeleteForever, MdPersonSearch } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";

export default function ProjectsIndex() {
  //page title
  document.title = "Projects - My Portfolio";

  //define state "projects"
  const [projects, setProjects] = useState([]);

  //define state "pagination"
  const [pagination, setPagination] = useState({
    currentPage: 0,
    perPage: 0,
    total: 0,
  });

  //define state "keywords"
  const [keywords, setKeywords] = useState("");

  //token from Cookies
  const token = Cookies.get("token");

  //finction "fetchData"
  const fetchData = async (pageNumber = 1, keywords = "") => {
    const page = pageNumber ? pageNumber : pagination.currentPage;
    await Api.get(`/api/admin/projects?search${keywords}&page=${page}`, {
      //header
      headers: {
        //header + token
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      //set data response to state "setPosts"
      setProjects(response.data.data.data);

      //set data response to state "pagination"
      setPagination(() => ({
        currentPage: response.data.data.current_page,
        perPage: response.data.data.per_page,
        total: response.data.data.total,
      }));
    });
  };

  //useEffect
  useEffect(() => {
    //call "fetchData"
    fetchData();
  }, []);

  //function "searchData"
  const searchData = async (e) => {
    //set value to state "keywords"
    setKeywords(e.target.value);

    //call function "fetchData"
    fetchData(1, e.target.value);
  };

  //function "deleteData"
  const deletePhoto = async (id) => {
    confirmAlert({
      title: "Delete Photo ?",
      message: "Are You Sure Delete Data ?",
      buttons: [
        {
          label: "YES",
          onClick: async () => {
            await Api.delete(`/api/admin/projects/${id}`, {
              //header
              headers: {
                //header + token
                Authorization: `Bearer ${token}`,
              },
            }).then((response) => {
              //show toast
              toast.success(response.data.message, {
                position: "top-center",
                duration: 6000,
              });

              //fetchData
              fetchData();
            });
          },
        },
        {
          label: "NO",
          onClick: () => {},
        },
      ],
    });
  };

  // Pagination Handler
  const handlePageChange = (pageNumber) => {
    fetchData(pageNumber, keywords);
  };

  return (
    <LayoutAdmin>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div>
          {hasAnyPermissions(["projects.create"]) && (
            <ProjectsCreate fetchData={fetchData} />
          )}
        </div>

        <h4 className="mt-6 mb-1 text-xl font-semibold text-black dark:text-white">
          Project Lists
        </h4>

        <div className="w-full basis-1/2 my-4">
          <form action="#" method="POST">
            <div className="relative">
              <input
                type="text"
                onChange={(e) => searchData(e)}
                placeholder="Search here..."
                className="w-full bg-transparent pl-10 pr-4 py-2 text-black dark:text-white border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2"
              >
                <MdPersonSearch />
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-lg border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full text-center items-center table-auto border-collapse border border-stroke dark:border-strokedark">
              <thead>
                <tr className="bg-gray-200 dark:bg-meta-4">
                  <th className="min-w-[5px] py-4 px-4 dark:text-white">
                    <h5 className="uppercase">No.</h5>
                  </th>
                  <th className="min-w-[115px] py-4 px-4 dark:text-white">
                    <h5 className="uppercase">Image</h5>
                  </th>
                  <th className="min-w-[115px] py-4 px-4 dark:text-white">
                    <h5 className="uppercase">Actions</h5>
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.length > 0 ? (
                  projects.map((project, index) => (
                    <tr
                      className={`${
                        index === projects.length - 1
                          ? ""
                          : "border-b border-stroke dark:border-strokedark"
                      }`}
                      key={project.id}
                    >
                      <td className="py-5 px-4 pl-9 border border-stroke dark:border-strokedark xl:pl-11">
                        {index + 1}
                      </td>
                      <td className="py-5 px-4 pl-9 border border-stroke dark:border-strokedark xl:pl-11">
                        {/* Adjusted image styling */}
                        <img
                          src={project.image}
                          className="w-12 h-12 object-cover rounded-full mx-auto" // Smaller size and consistent scaling
                        />
                      </td>
                      <td className="py-5 px-4 pl-9 border border-stroke dark:border-strokedark xl:pl-11">
                        <Link
                          to={`/admin/projects/edit/${project.id}`}
                          className="inline-flex items-center justify-center rounded-md py-2 px-4  font-medium text-white"
                        >
                          <FaUserEdit className="mr-2 text-xl text-primary dark:text-white" />
                        </Link>
                        {/* Delete Button */}
                        {hasAnyPermissions(["projects.delete"]) && (
                          <button
                            onClick={() => deletePhoto(project.id)}
                            className="inline-flex rounded-md py-2 px-4  font-medium text-white"
                          >
                            <MdDeleteForever className="mr-2 text-xl text-danger dark:text-white" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="py-5 text-lg font-semibold text-red-500 dark:text-white border border-stroke dark:border-strokedark"
                    >
                      No Data Found!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Component */}
        <Pagination
          className="flex justify-end my-4"
          currentPage={pagination.currentPage}
          totalCount={pagination.total}
          pageSize={pagination.perPage}
          onPageChange={handlePageChange}
        />
      </div>
    </LayoutAdmin>
  );
}
