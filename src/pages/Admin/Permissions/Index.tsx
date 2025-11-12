//import LayoutAdmin
import { useEffect, useState } from "react";
//import LayoutAdmin
import LayoutAdmin from "../../../layouts/Admin";
//import Api
import Api from "../../../services/Api";
//import js Cokoies
import Cookies from "js-cookie";
//import Layout
import Pagination from "../../../components/general/Pagination";
import { MdPersonSearch } from "react-icons/md";

export default function Index() {
  //title page
  document.title = "Permissions - Desa Digital";

  //define state "permissions"
  const [permissions, setPermissions] = useState([]);

  //define state "pagination"
  const [pagination, setPagination] = useState({
    currentPage: 0,
    perPage: 0,
    total: 0,
  });

  //define state "keywords"
  const [keywords, setKeywords] = useState("");

  //token from cookies
  const token = Cookies.get("token");

  //function fetchData
  const fetchData = async (pageNumber = 1, keywords = "") => {
    //define variabel "page"
    const page = pageNumber ? pageNumber : pagination.currentPage;

    await Api.get(`/api/admin/permissions?search=${keywords}&page=${page}`, {
      //header
      headers: {
        //header Bearer + token
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      //set Data response to state "pagination"
      setPermissions(response.data.data.data);

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
    //call method "fetchData"
    fetchData();
  }, []);

  //function "search Data"
  const searchData = async (e) => {
    //set value to state "keyword"
    setKeywords(e.target.value);

    //call method "fetchdate"
    fetchData(1, e.target.value);
  };

  // Pagination Handler
  const handlePageChange = (pageNumber) => {
    fetchData(pageNumber, keywords);
  };

  return (
    <LayoutAdmin>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Permission Lists
        </h4>

        <div className="flex flex-row mb-4">
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
                className="py-4 px-4 font-medium text-black dark:text-white border border-stroke dark:border-strokedark w-[5%]"
              >
                No.
              </th>
              <th
                scope="col"
                className="py-4 px-4 text-center font-medium text-black dark:text-white border border-stroke dark:border-strokedark sm:table-cell w-[40%]"
              >
                Permissions Name
              </th>
            </tr>
          </thead>
          <tbody>
            {permissions.length > 0 ? (
              permissions.map((permission, index) => (
                <tr
                  key={permission.id}
                  className="border border-stroke dark:border-strokedark"
                >
                  <td className="py-5 px-2 text-center text-sm font-medium text-black dark:text-white border border-stroke dark:border-strokedark">
                    {index + 1}
                  </td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-black dark:text-white border border-stroke dark:border-strokedark">
                    {permission.name}
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
