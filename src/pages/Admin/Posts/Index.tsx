// src/pages/Admin/Posts/Index.tsx
import { useEffect, useState, ChangeEvent } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import { Link } from "react-router-dom";
import Pagination from "../../../components/general/Pagination";
import toast from "react-hot-toast";
import hasAnyPermissions from "../../../utils/Permissions";
import { postService } from "../../../services/postService";
import { Post, PaginationMeta } from "../../../types/post";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever, MdPersonSearch } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import { confirmAlert } from "react-confirm-alert";
import Loader from "@/components/general/Loader";

export default function PostsIndex() {
  document.title = "Posts - My Portfolio";

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false); // ✅ add loading
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
  });
  const [keywords, setKeywords] = useState("");

  const fetchData = async (page = 1, search = "") => {
    try {
      setLoading(true); // start loading
      const data = await postService.getAll(page, search);
      setPosts(data.data);
      setPagination({
        current_page: data.current_page,
        per_page: data.per_page,
        total: data.total,
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeywords(value);
    fetchData(1, value);
  };

  const handleDelete = (id: number) => {
    confirmAlert({
      title: "Are you sure?",
      message: "Want to delete this post?",
      buttons: [
        {
          label: "YES",
          onClick: async () => {
            setPosts((prev) => prev.filter((p) => p.id !== id));

            try {
              await postService.delete(id);
              toast.success("Post deleted successfully!");
              fetchData(pagination.current_page, keywords);
            } catch (err: any) {
              toast.error(err?.response?.data?.message || "Failed to delete post");
              fetchData(pagination.current_page, keywords);
            }
          },
        },
        { label: "NO" },
      ],
    });
  };

  return (
    <LayoutAdmin>
      <div className="mb-6 space-y-4">
        {/* ===== Title ===== */}
        <h4 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">
          Posts List
        </h4>

        {/* ===== Actions Row ===== */}
        <div className="grid grid-cols-12 items-center gap-3">
          {/* Search */}
          <div className="col-span-12 sm:col-span-8">
            <div className="relative w-full">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MdPersonSearch className="h-5 w-5 text-gray-500" />
              </span>

              <input
                type="text"
                placeholder="Search post..."
                value={keywords}
                onChange={handleSearch}
                className="h-11 w-full rounded-lg border border-stroke bg-transparent pl-10 pr-3 text-sm
            text-slate-800 dark:text-white dark:border-strokedark
            focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Add Button */}
          <div className="col-span-12 sm:col-span-4 flex justify-start sm:justify-end">
            {hasAnyPermissions(["posts.create"]) && (
              <Link
                to="/admin/posts/create"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-7 text-sm font-medium text-white hover:bg-opacity-90"
              >
                <FaCirclePlus className="mr-2 h-4 w-4" />
                Add
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Loading State */}
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="rounded-lg border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark p-4 sm:p-6 md:p-8">
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto rounded-lg border border-stroke dark:border-strokedark">
            <table className="w-full border-collapse text-sm text-center">
              <thead className="bg-gray-100 dark:bg-meta-4 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="p-3 font-semibold border-b">No.</th>
                  <th className="p-3 font-semibold border-b text-left">Title</th>
                  <th className="p-3 font-semibold border-b">Category</th>
                  <th className="p-3 font-semibold border-b">User</th>
                  <th className="p-3 font-semibold border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.length > 0 ? (
                  posts.map((post, index) => (
                    <tr
                      key={post.id}
                      className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-boxdark-2 transition-colors"
                    >
                      <td className="p-3">
                        {index + 1 + (pagination.current_page - 1) * pagination.per_page}
                      </td>
                      <td className="p-3 text-left font-medium text-slate-800 dark:text-gray-200">
                        <span className="line-clamp-1">{post.title}</span>
                      </td>
                      <td className="p-3">{post.category?.name || "-"}</td>
                      <td className="p-3">{post.user?.name || "-"}</td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/admin/posts/edit/${post.id}`}
                            className="inline-flex items-center justify-center rounded-md bg-primary text-white px-3 py-2 hover:bg-opacity-80"
                            aria-label="Edit post"
                          >
                            <FaUserEdit />
                          </Link>

                          {hasAnyPermissions(["posts.delete"]) && (
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="inline-flex items-center justify-center rounded-md bg-danger text-white px-3 py-2 hover:bg-opacity-80"
                              aria-label="Delete post"
                            >
                              <MdDeleteForever />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-red-500 font-semibold">
                      No Data Found!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid sm:hidden gap-4">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <div
                  key={post.id}
                  className="rounded-lg border border-stroke dark:border-strokedark bg-white dark:bg-boxdark p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        #{index + 1 + (pagination.current_page - 1) * pagination.per_page}
                      </p>
                      <h5 className="font-semibold text-slate-800 dark:text-gray-200 line-clamp-2">
                        {post.title}
                      </h5>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <Link
                        to={`/admin/posts/edit/${post.id}`}
                        className="inline-flex items-center justify-center rounded-md bg-primary text-white p-2"
                        aria-label="Edit post"
                      >
                        <FaUserEdit />
                      </Link>

                      {hasAnyPermissions(["posts.delete"]) && (
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="inline-flex items-center justify-center rounded-md bg-danger text-white p-2"
                          aria-label="Delete post"
                        >
                          <MdDeleteForever />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <p>
                      <span className="font-semibold">Category:</span> {post.category?.name || "-"}
                    </p>
                    <p className="text-right">
                      <span className="font-semibold">User:</span> {post.user?.name || "-"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-red-500 font-semibold py-10">No Data Found!</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center sm:justify-end mt-6">
            <Pagination
              currentPage={pagination.current_page}
              totalCount={pagination.total}
              pageSize={pagination.per_page}
              onPageChange={(page) => fetchData(page, keywords)}
            />
          </div>
        </div>
      )}
    </LayoutAdmin>
  );
}
