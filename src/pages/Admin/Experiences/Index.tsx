//import react
import { useEffect, useState } from "react";
//import react-router-dom
import { Link } from "react-router-dom";

//import LayoutAdmin
import LayoutAdmin from "../../../layouts/Admin";

//import hasAnyPermission
import hasAnyPermissions from "../../../utils/Permissions";
//import Api
import Api from "../../../services/Api";
//import Pagination
import Pagination from "../../../components/general/Pagination";

//import Cookies js
import Cookies from "js-cookie";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever, MdPersonSearch } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";

export default function ExperiencesIndex() {
  //Page Title
  document.title = "Experience Page - Desa Digital";

  //define experiences state
  const [experiences, setExperiences] = useState("");

  //define Pagination
  const [pagination, setPagination] = useState({
    currentPage: 0,
    perPage: 0,
    total: 0,
  });

  //define keywords
  const [keywords, setKeywords] = useState("");

  //token
  const token = Cookies.get("token");

  //function "fetchData"
  const fetchData = async (pageNumber = 1, keywords = "") => {
    const page = pageNumber ? pageNumber : pagination.currentPage;

    await Api.get(`/api/admin/experiences?search=${keywords}&page=${page}`, {
      //headers
      headers: {
        //headers + token
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      //set response data to setExperiences
      setExperiences(response.data.data.data);

      //set state Pagination
      setPagination(() => ({
        currentPage: response.data.data.current_page,
        perPage: response.data.data.per_page,
        total: response.data.data.total,
      }));
    });
  };

  //useEffect
  useEffect(() => {
    //call function "fetchData"
    fetchData();
  }, []);

  //function "searchData"
  const searchData = (e) => {
    //set value to state "keyword"
    setKeywords(e.target.value);

    //call function "fetchData" with argument
    fetchData(1, e.target.value);
  };

  //function "deleteExperience"
  const deleteExperience = (id) => {
    confirmAlert({
      title: "Are you sure ?",
      message: "want to delete this data ?",
      buttons: [
        {
          label: "YES",
          onClick: async () => {
            await Api.delete(`/api/admin/experiences/${id}`, {
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

              //call function "fetchData"
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
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Experience Lists
        </h4>

        <div className="flex flex-row mb-4">
          <div className="w-full basis-1/4 sm:w-auto">
            {hasAnyPermissions(["experiences.create"]) && (
              <Link
                to="/admin/experiences/create"
                className="mx-2 inline-flex items-center justify-center rounded-md bg-meta-5 py-3.5 px-2 text-center text-md font-medium text-white hover:bg-opacity-90 sm:text-xs"
                type="button"
              >
                <FaCirclePlus className="text-white mr-2" /> Add New
              </Link>
            )}
          </div>

          <div className="w-full basis-2/2">
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
        </div>

        <table className="w-full table-auto border border-stroke border-collapse overflow-x-auto rounded-sm bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <thead>
            <tr className="bg-gray-200 text-left dark:bg-meta-4">
              <th
                scope="col"
                className="py-4 px-4 font-bold text-center text-black dark:text-white border border-stroke dark:border-strokedark w-[5%]"
              >
                No.
              </th>
              <th
                scope="col"
                className="py-4 px-4 font-bold text-center text-black dark:text-white border border-stroke dark:border-strokedark w-[15%]"
              >
                Job Title
              </th>
              <th
                scope="col"
                className="py-4 px-4 font-bold text-center text-black dark:text-white border border-stroke dark:border-strokedark w-[10%]"
              >
                Icon Company
              </th>
              <th
                scope="col"
                className="py-4 px-4 font-bold text-center text-black dark:text-white border border-stroke dark:border-strokedark w-[10%]"
              >
                Start Date
              </th>
              <th
                scope="col"
                className="py-4 px-4 font-bold text-center text-black dark:text-white border border-stroke dark:border-strokedark md:table-cell w-[10%]"
              >
                End Date
              </th>
              <th
                scope="col"
                className="py-4 px-4 font-bold text-center text-black dark:text-white border border-stroke dark:border-strokedark w-[10%]"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {experiences.length > 0 ? (
              experiences.map((experience, index) => (
                <tr
                  key={experience.id}
                  className="border border-stroke dark:border-strokedark"
                >
                  <td className="py-5 px-2 text-center text-sm font-medium text-black dark:text-white border border-stroke dark:border-strokedark">
                    {index + 1}
                  </td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-black dark:text-white border border-stroke dark:border-strokedark">
                    {experience.name}
                  </td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-black dark:text-white border border-stroke dark:border-strokedark">
                    {experience.image ? (
                      <img
                        src={experience.image}
                        alt="Company Icon"
                        className="w-10 h-10 object-cover mx-auto rounded-full"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-black dark:text-white border border-stroke dark:border-strokedark">
                    {new Date(experience.start_date).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-black dark:text-white border border-stroke dark:border-strokedark md:table-cell">
                    {new Date(experience.end_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-5 px-2 text-center text-lg font-medium text-black dark:text-white border border-stroke dark:border-strokedark lg:table-cell">
                    <Link
                      to={`/admin/experiences/edit/${experience.id}`}
                      className="inline-flex mx-1.5 items-center justify-center font-medium text-black"
                    >
                      <FaUserEdit className="text-xl text-primary dark:text-white mr-2" />
                    </Link>
                    {hasAnyPermissions(["experiences.delete"]) && (
                      <button
                        onClick={() => deleteExperience(experience.id)}
                        className="inline-flex mx-1.5 items-center justify-center font-medium text-black"
                      >
                        <MdDeleteForever className="text-xl text-danger dark:text-white mr-2" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="py-5 px-4 text-center text-sm text-[#9D5425] border border-stroke dark:border-strokedark"
                >
                  No Data Found!
                </td>
              </tr>
            )}
          </tbody>
        </table>

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
