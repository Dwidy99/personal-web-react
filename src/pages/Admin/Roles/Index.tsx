//import LayoutsAdmin
import { useEffect, useState } from "react";
//import LayoutsAdmin
import LayoutsAdmin from "../../../layouts/Admin";
//import Api
import Api from "../../../services/Api";
//import Cookies js
import Cookies from "js-cookie";
//import hasAnyPermissions
import hasAnyPermissions from "../../../utils/Permissions";
//import Pagination
import Pagination from "../../../components/general/Pagination";
import { Link } from "react-router-dom";

//import confirmAlert
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
//import toast js
import toast from "react-hot-toast";
import { MdPersonSearch } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";

export default function RolesIndex() {
  //title page
  document.title = "Roles - Desa Digital";

  //define state "Roles"
  const [roles, setRoles] = useState([]);

  //define state "pagination"
  const [pagination, setPagination] = useState({
    currentPage: 0,
    perPage: 0,
    total: 0,
  });

  //define state "keywords"
  const [keywords, setKeywords] = useState("");

  //token from user
  const token = Cookies.get("token");

  //function "fetchData"
  const fetchData = async (pageNumber = 1, keywords = "") => {
    //define variable "page"
    const page = pageNumber ? pageNumber : pagination.currentPage;

    await Api.get(`/api/admin/roles?search=${keywords}&page=${page}`, {
      //header
      headers: {
        //header Bearer + Token
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      //set data response to state "setRoles"
      setRoles(response.data.data.data);

      //set data pagination to state "pagination"
      setPagination({
        currentPage: response.data.data.current_page,
        perPage: response.data.data.per_page,
        total: response.data.data.total,
      });
    });
  };

  //useEffet
  useEffect(() => {
    //call fetch "fetchData"
    fetchData();
  }, []);

  //function "searchData"
  const searchData = async (e) => {
    //set value to state "keywords"
    setKeywords(e.target.value);

    //call fetch "fetchData"
    fetchData(1, e.target.value);
  };

  //function "deleteRole"
  const deleteRole = (id) => {
    //show confirm alert
    confirmAlert({
      title: "Are you sure?",
      message: "want to delete this data ?",
      buttons: [
        {
          label: "YES",
          onClick: async () => {
            await Api.delete(`/api/admin/roles/${id}`, {
              //header
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).then((response) => {
              //show toast
              toast.success(response.data.message, {
                position: "top-center",
                duration: 4000,
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
    <LayoutsAdmin>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Role Lists
        </h4>

        <div className="flex flex-row mb-4">
          <div className="w-full basis-1/4 sm:w-auto">
            {hasAnyPermissions(["roles.create"]) && (
              <Link
                to="/admin/roles/create"
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

        <table className="w-full text-center items-center table-auto border border-stroke border-collapse overflow-x-auto rounded-sm bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <thead>
            <tr className="bg-gray-200 dark:bg-meta-4">
              <th
                scope="col"
                className="py-4 px-4 dark:text-white dark:border-strokedark w-[5%]"
              >
                No.
              </th>
              <th
                scope="col"
                className="py-4 px-4 dark:text-white dark:border-strokedark w-[10%]"
              >
                Role
              </th>
              <th
                scope="col"
                className="py-4 px-4 dark:text-white dark:border-strokedark sm:table-cell w-[40%]"
              >
                Permissions
              </th>
              <th
                scope="col"
                className="py-4 px-4 dark:text-white dark:border-strokedark w-[10%]"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {roles.length > 0 ? (
              roles.map((role, index) => (
                <tr
                  key={role.id}
                  className="border border-stroke dark:border-strokedark"
                >
                  <td className="py-5 px-2 border border-stroke dark:text-white dark:border-strokedark">
                    {index + 1}
                  </td>
                  <td className="py-5 px-2 border border-stroke dark:text-white dark:border-strokedark">
                    {role.name}
                  </td>
                  <td className="py-5 px-2 border border-stroke dark:text-white dark:border-strokedark sm:table-cell">
                    {role.permissions.map((permission, index) => (
                      <span
                        className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-primary m-0.5"
                        key={index}
                      >
                        {permission.name}
                      </span>
                    ))}
                  </td>
                  <td className="py-5 px-2 border border-stroke dark:text-white dark:border-strokedark lg:table-cell">
                    <Link
                      to={`/admin/roles/edit/${role.id}`}
                      className="inline-flex mx-1.5"
                    >
                      <i className="fa fa-edit"></i>
                    </Link>
                    {hasAnyPermissions(["roles.delete"]) && (
                      <button
                        onClick={() => deleteRole(role.id)}
                        className="inline-flex mx-1.5"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="py-5 px-4 text-[#9D5425] border border-stroke dark:border-strokedark"
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
    </LayoutsAdmin>
  );
}
