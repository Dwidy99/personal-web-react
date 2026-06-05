import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaUserEdit } from "react-icons/fa";
import { MdCategory, MdDeleteForever, MdPersonSearch } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import { confirmAlert } from "react-confirm-alert";
import LayoutAdmin from "@/layouts/Admin";
import Pagination from "@/components/general/Pagination";
import Loading from "@/components/admin/Loading";
import hasAnyPermissions from "@/utils/Permissions";
import { postService } from "@/services/postService";
import type { AdminPost, AdminPostPagination } from "@/features/admin/posts/types";
import {
  getErrorMessage,
  getHttpStatus,
} from "@/features/admin/shared/utils/apiError";

function CategoryBadge({ category }: { category?: AdminPost["category"] }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!category) {
    return <span className="text-gray-400">-</span>;
  }

  return (
    <span className="inline-flex max-w-[220px] items-center gap-2 rounded-full border border-stroke bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-strokedark dark:bg-boxdark-2 dark:text-slate-200">
      {category.image && !imageFailed ? (
        <img
          src={category.image}
          alt=""
          className="h-6 w-6 rounded-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-500 dark:bg-boxdark">
          <MdCategory />
        </span>
      )}
      <span className="truncate">{category.name}</span>
    </span>
  );
}

export default function PostsIndex() {
  document.title = "Posts - Admin Panel";

  const navigate = useNavigate();

  const canView = hasAnyPermissions(["posts.index"]);
  const canCreate = hasAnyPermissions(["posts.store"]);
  const canEdit = hasAnyPermissions(["posts.update"]);
  const canDelete = hasAnyPermissions(["posts.delete"]);

  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [keywords, setKeywords] = useState("");

  const [pagination, setPagination] = useState<AdminPostPagination>({
    current_page: 1,
    per_page: 10,
    total: 0,
  });

  const fetchData = useCallback(async (page = 1, search = ""): Promise<void> => {
    if (!canView) return;

    setLoading(true);

    try {
      const data = await postService.getAll(page, search);

      setPosts(data.data);
      setPagination({
        current_page: data.current_page,
        per_page: data.per_page,
        total: data.total,
      });
    } catch (error: unknown) {
      if (getHttpStatus(error) === 403) {
        toast.error("You are not allowed to access Posts.");
        navigate("/forbidden");
        return;
      }

      toast.error(getErrorMessage(error, "Failed to load posts"));
    } finally {
      setLoading(false);
    }
  }, [canView, navigate]);

  useEffect(() => {
    if (!canView) navigate("/forbidden");
  }, [canView, navigate]);

  useEffect(() => {
    if (!canView) return;

    void fetchData(1, "");
  }, [canView, fetchData]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeywords(value);
    void fetchData(1, value);
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
              void fetchData(pagination.current_page, keywords);
            } catch (error: unknown) {
              if (getHttpStatus(error) === 403) {
                toast.error("You are not allowed to delete posts.");
                void fetchData(pagination.current_page, keywords);
                return;
              }

              toast.error(getErrorMessage(error, "Delete failed"));
              void fetchData(pagination.current_page, keywords);
            }
          },
        },
        { label: "Cancel" },
      ],
    });
  };

  return (
    <LayoutAdmin>
      <div className="mb-6 space-y-4">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-white">Posts Management</h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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

          {canCreate && (
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

      {loading ? (
        <Loading message="Loading posts..." variant="page" className="py-20" />
      ) : (
        <div className="rounded-lg border border-stroke bg-white p-4 sm:p-6 dark:border-strokedark dark:bg-boxdark">
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
                      <td className="p-3 text-center">
                        <CategoryBadge category={post.category} />
                      </td>
                      <td className="p-3 text-center">{post.user?.name || "-"}</td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          {canEdit && (
                            <Link
                              to={`/admin/posts/edit/${post.id}`}
                              className="rounded-md bg-sky-800 p-2 text-white"
                            >
                              <FaUserEdit />
                            </Link>
                          )}

                          {canDelete && (
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

          <div className="grid gap-4 md:hidden">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <div
                  key={post.id}
                  className="rounded-lg border border-stroke p-4 dark:border-strokedark dark:bg-boxdark"
                >
                  <p className="text-xs text-gray-500">
                    #{index + 1 + (pagination.current_page - 1) * pagination.per_page}
                  </p>

                  <h4 className="font-semibold text-slate-800 dark:text-white">{post.title}</h4>

                  <div className="mt-2 flex justify-between text-xs">
                    <CategoryBadge category={post.category} />
                    <span>{post.user?.name || "-"}</span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    {canEdit && (
                      <Link
                        to={`/admin/posts/edit/${post.id}`}
                        className="flex-1 rounded-md bg-sky-700 p-2 text-center text-white"
                      >
                        Edit
                      </Link>
                    )}

                    {canDelete && (
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="flex-1 rounded-md bg-danger p-2 text-white"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-stroke p-6 text-center text-sm text-red-500 dark:border-strokedark">
                No data found
              </div>
            )}
          </div>

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
