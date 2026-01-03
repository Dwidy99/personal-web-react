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
  document.title = "Posts - Admin Panel";

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState("");

  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
  });

  const fetchData = async (page = 1, search = "") => {
    try {
      setLoading(true);
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
      setLoading(false);
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
      title: "Delete Confirmation",
      message: "Are you sure you want to delete this post?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await postService.delete(id);
              toast.success("Post deleted successfully");
              fetchData(pagination.current_page, keywords);
            } catch (err: any) {
              toast.error(err?.response?.data?.message || "Delete failed");
            }
          },
        },
        { label: "Cancel" },
      ],
    });
  };

  return (
    <LayoutAdmin>
      {/* ===== Header ===== */}
      <div className="mb-6 space-y-4">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-white">Posts Management</h1>

        {/* ===== Action Bar ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <MdPersonSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={keywords}
              onChange={handleSearch}
              placeholder="Search post..."
              className="h-11 w-full rounded-lg border border-stroke bg-transparent pl-10 pr-3 text-sm
              text-slate-800 dark:text-white dark:border-strokedark
              focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Create */}
          {hasAnyPermissions(["posts.create"]) && (
            <Link
              to="/admin/posts/create"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg
              bg-sky-600 px-6 text-sm font-medium text-white hover:bg-opacity-90"
            >
              <FaCirclePlus />
              Create Post
            </Link>
          )}
        </div>
      </div>

      {/* ===== Content ===== */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      ) : (
        <div className="rounded-lg border border-stroke bg-white p-4 sm:p-6 dark:border-strokedark dark:bg-boxdark">
          {/* ===== Desktop Table ===== */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-meta-4">
                <tr>
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-center">Category</th>
                  <th className="p-3 text-center">Author</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {posts.length > 0 ? (
                  posts.map((post, index) => (
                    <tr
                      key={post.id}
                      className="border-b dark:border-strokedark hover:bg-gray-50 dark:hover:bg-boxdark-2"
                    >
                      <td className="p-3">
                        {index + 1 + (pagination.current_page - 1) * pagination.per_page}
                      </td>
                      <td className="p-3 font-medium">{post.title}</td>
                      <td className="p-3 text-center">{post.category?.name || "-"}</td>
                      <td className="p-3 text-center">{post.user?.name || "-"}</td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/admin/posts/edit/${post.id}`}
                            className="rounded-md bg-sky-800 p-2 text-white"
                          >
                            <FaUserEdit />
                          </Link>

                          {hasAnyPermissions(["posts.delete"]) && (
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="rounded-md bg-danger p-2 text-white"
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
                    <td colSpan={5} className="py-10 text-center text-red-500">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ===== Mobile Cards ===== */}
          <div className="grid gap-4 md:hidden">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="rounded-lg border border-stroke p-4 dark:border-strokedark dark:bg-boxdark"
              >
                <p className="text-xs text-gray-500">
                  #{index + 1 + (pagination.current_page - 1) * pagination.per_page}
                </p>

                <h4 className="font-semibold text-slate-800 dark:text-white">{post.title}</h4>

                <div className="mt-2 flex justify-between text-xs">
                  <span>{post.category?.name || "-"}</span>
                  <span>{post.user?.name || "-"}</span>
                </div>

                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/admin/posts/edit/${post.id}`}
                    className="flex-1 rounded-md bg-sky-700 p-2 text-center text-white"
                  >
                    Edit
                  </Link>

                  {hasAnyPermissions(["posts.delete"]) && (
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="flex-1 rounded-md bg-danger p-2 text-white"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ===== Pagination ===== */}
          <div className="mt-6 flex justify-center md:justify-end">
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
