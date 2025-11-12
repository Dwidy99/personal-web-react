//import react
import { useEffect, useState } from "react";
//import LayoutAdmin
import LayoutAdmin from "../../../layouts/Admin";
//import react-router-dom
import { Link } from "react-router-dom";

//import Api
import Api from "../../../services/Api";
//import Api
import Pagination from "../../../components/general/Pagination";
//import hasAnyPermission
import hasAnyPermissions from "../../../utils/Permissions";

//import Cookies js
import Cookies from "js-cookie";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever, MdPersonSearch } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";

export default function PostsIndex() {
  //Page title
  document.title = "Posts - Desa Digital";

  //define state "posts"
  const [posts, setPosts] = useState([]);

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

  //function "fetchData"
  const fetchData = async (pageNumber = 1, keywords = "") => {
    //define variabel "page"
    const page = pageNumber ? pageNumber : pagination.currentPage;

    await Api.get(`/api/admin/posts?search=${keywords}&page=${page}`, {
      //header
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      //set data reponse to state "setposts"
      setPosts(response.data.data.data);

      console.log(response);

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
    //call function "fetchData"
    fetchData();
  }, []);

  //function "searchData"
  const searchData = (e) => {
    //set valeu to state "keywords"
    setKeywords(e.target.value);

    //call function "fetchData"
    fetchData(1, e.target.value);
  };

  //function "deletePosts"
  const deletePost = (id) => {
    //show confirm alert
    confirmAlert({
      title: "Are you sure?",
      message: "want to delete this data ?",
      buttons: [
        {
          label: "YES",
          onClick: async () => {
            await Api.delete(`/api/admin/posts/${id}`, {
              //headers
              headers: {
                //headers + token
                Authorization: `Bearer ${token}`,
              },
            }).then((response) => {
              //show toast
              toast.success(response.data.message, {
                position: "top-center",
                duration: 6000,
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
      <div className=" border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Post Lists
        </h4>

        <div className="flex flex-row mb-4">
          <div className="w-full basis-1/4 sm:w-auto">
            {hasAnyPermissions(["posts.create"]) && (
              <Link
                to="/admin/posts/create"
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

        <div className="rounded-lg border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="overflow-x-auto">
            <table className="min-w-full whitespace-nowrap">
              <thead>
                <tr className="bg-gray-200 dark:bg-meta-4">
                  <th className="min-w-[70px] py-4 px-4 dark:text-white">
                    <h5 className="uppercase">No.</h5>
                  </th>
                  <th className="min-w-[115px] py-4 px-4 dark:text-white">
                    <h5 className="uppercase">Title</h5>
                  </th>
                  <th className="min-w-[115px] py-4 px-4 dark:text-white">
                    <h5 className="uppercase">Category</h5>
                  </th>
                  <th className="min-w-[115px] py-4 px-4 dark:text-white">
                    <h5 className="uppercase">User</h5>
                  </th>
                  <th className="min-w-[115px] py-4 px-4 dark:text-white">
                    <h5 className="uppercase">Actions</h5>
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.length > 0 ? (
                  posts.map((post, index) => (
                    <tr
                      className={`${
                        index === posts.length - 1
                          ? ""
                          : "border-b border-stroke dark:border-strokedark"
                      }`}
                      key={post.id}
                    >
                      <td className="py-5 px-4 pl-9 border border-stroke dark:border-strokedark xl:pl-11">
                        {index + 1}
                      </td>
                      <td className="py-5 px-4 pl-9 border border-stroke dark:border-strokedark xl:pl-11">
                        <span className="font-medium">{post.title}</span>
                      </td>
                      <td className="py-5 px-4 pl-9 border border-stroke dark:border-strokedark xl:pl-11">
                        {/* Adjusted image styling */}
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-12 h-12 object-cover rounded-full mx-auto" // Smaller size and consistent scaling
                        />
                      </td>
                      <td className="py-5 px-4 pl-9 border border-stroke dark:border-strokedark xl:pl-11">
                        <span className="font-medium">{post.user.name}</span>
                      </td>
                      <td className="py-5 px-4 pl-9 border border-stroke dark:border-strokedark xl:pl-11">
                        {/* Edit Button */}
                        <Link
                          to={`/admin/posts/edit/${post.id}`}
                          className="inline-flex items-center justify-center rounded-md py-2 px-4  font-medium text-white"
                        >
                          <FaUserEdit className="mr-2 text-xl text-primary dark:text-white" />
                        </Link>

                        {/* Delete Button */}
                        {hasAnyPermissions(["posts.delete"]) && (
                          <button
                            onClick={() => deletePost(post.id)}
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
                      colSpan="5"
                      className="py-5 text-center text-lg font-semibold text-red-500 dark:text-white border border-stroke dark:border-strokedark"
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
