//import LayoutAdmin
import { useEffect, useState } from "react";
//import Link
import { Link } from "react-router-dom";
//import confirmAlert
import { confirmAlert } from "react-confirm-alert";

// import LayoutAdmin
import LayoutAdmin from "../../../layouts/Admin";

// import Api
import Api from "../../../services/Api";
//import hasAnyPermssions
import hasAnyPermissions from "../../../utils/Permissions";
//import Paination
import Pagination from "../../../components/general/Pagination";

//import Cookies js
import Cookies from "js-cookie";
//import toast js
import toast from "react-hot-toast";
import { MdPersonSearch } from "react-icons/md";
import { FaCirclePlus, FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

export default function UsersIndex() {
  // title page
  document.title = "Users - My Portfolio";

  //define state "users"
  const [users, setUsers] = useState("");

  //define state "pagination"
  const [pagination, setPagination] = useState({
    currentPage: 0,
    perPage: 0,
    total: 0,
  });

  //define state "keywords"
  const [keywords, setKeywords] = useState("");

  //define Cookies
  const token = Cookies.get("token");

  //function fetchData
  const fetchData = async (pageNumber = 1, keywords = "") => {
    //define variabel "page"
    const page = pageNumber ? pageNumber : pagination.currentPage;

    await Api.get(`/api/admin/users?search=${keywords}&page=${page}`, {
      //header
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      //set data response to state "setUsers"
      setUsers(response.data.data.data);

      //set data pagination to state "pagination"
      setPagination(() => ({
        currentPage: response.data.data.current_page,
        perPage: response.data.data.per_page,
        total: response.data.data.total,
      }));
    });
  };

  //useEffect
  useEffect(() => {
    //call fetchData
    fetchData();
  }, []);

  //function "search keywords"
  const searchData = async (e) => {
    //set value to state "keywords"
    setKeywords(e.target.value);

    //call function "fetchData"
    fetchData(1, e.target.value);
  };

  //function "deleteUser"
  const deleteUser = (id) => {
    //show confirm alert
    confirmAlert({
      title: "Are you sure?",
      message: "want to delete this data ?",
      buttons: [
        {
          label: "YES",
          onClick: async () => {
            await Api.delete(`/api/admin/users/${id}`, {
              //header
              headers: {
                //header + Bearer
                Authorization: `Bearer ${token}`,
              },
            }).then((response) => {
              toast.success(response.data.message, {
                position: "top-center",
                duration: 5000,
              });

              //function fetchData
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
          User Lists
        </h4>

        <div className="flex flex-row mb-4">
          <div className="w-full basis-1/4 sm:w-auto">
            {hasAnyPermissions(["roles.create"]) && (
              <Link
                to="/admin/users/create"
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
            <tr className="bg-gray-200 text-center dark:bg-meta-4">
              <th
                scope="col"
                className="py-4 px-4 font-medium text-black dark:text-white border border-stroke dark:border-strokedark w-[15%]"
              >
                No.
              </th>
              <th
                scope="col"
                className="py-4 px-4 font-medium text-black dark:text-white border border-stroke dark:border-strokedark w-[20%]"
              >
                Full Name
              </th>
              <th
                scope="col"
                className="py-4 px-4 font-medium text-black dark:text-white border border-stroke dark:border-strokedark sm:table-cell w-[35%]"
              >
                Address Email
              </th>
              <th
                scope="col"
                className="py-4 px-4 font-medium text-black dark:text-white border border-stroke dark:border-strokedark sm:table-cell w-[15%]"
              >
                Roles
              </th>
              <th
                scope="col"
                className="py-4 px-4 font-medium text-black dark:text-white border border-stroke dark:border-strokedark w-[20%]"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user.id}
                  className="border border-stroke dark:border-strokedark"
                >
                  <td className="py-5 px-2 text-center text-sm font-medium text-black dark:text-white border border-stroke dark:border-strokedark">
                    {index + 1}
                  </td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-black dark:text-white border border-stroke dark:border-strokedark">
                    {user.name}
                  </td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-black dark:text-white border border-stroke dark:border-strokedark">
                    {user.email}
                  </td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-black dark:text-white border border-stroke dark:border-strokedark sm:table-cell">
                    {user.roles.map((role) => (
                      <span
                        className="btn btn-warning btn-sm shadow-sm border-0 ms-2 mb-2 fw-normal"
                        key={index}
                      >
                        {role.name}
                      </span>
                    ))}
                  </td>
                  <td className="py-5 px-2 text-center text-lg font-medium text-black dark:text-white border border-stroke dark:border-strokedark lg:table-cell">
                    <div className="flex justify-center items-center">
                      <Link
                        to={`/admin/users/edit/${user.id}`}
                        className="inline-flex items-center justify-center text-blue-500 hover:text-blue-700 mr-2"
                        title="Edit"
                      >
                        <FaEdit className="h-5 w-5" />
                      </Link>
                      {hasAnyPermissions(["users.delete"]) && (
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="inline-flex items-center justify-center text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      )}
                    </div>
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
