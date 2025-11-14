import { useEffect, useState, ChangeEvent } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import { Link } from "react-router-dom";
import Pagination from "../../../components/general/Pagination";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import hasAnyPermissions from "../../../utils/Permissions";
import { postService } from "../../../services/postService";
import { Post, PaginationMeta } from "../../../types/post";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever, MdPersonSearch } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";

export default function PostsIndex() {
  document.title = "Posts - My Portfolio";

  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
  });
  const [keywords, setKeywords] = useState("");

  const fetchData = async (page = 1, search = "") => {
    const data = await postService.getAll(page, search);
    setPosts(data.data);
    setPagination({
      current_page: data.current_page,
      per_page: data.per_page,
      total: data.total,
    });
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
            await postService.delete(id);
            toast.success("Post deleted successfully!");
            fetchData(pagination.current_page, keywords);
          },
        },
        { label: "NO" },
      ],
    });
  };

  return (
    <LayoutAdmin>
      <div className="rounded-lg border bg-white shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-semibold">Posts List</h4>
          {hasAnyPermissions(["posts.create"]) && (
            <Link
              to="/admin/posts/create"
              className="inline-flex items-center rounded-md bg-primary text-white py-2 px-4 hover:bg-opacity-90"
            >
              <FaCirclePlus className="mr-2" /> Add New
            </Link>
          )}
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search post..."
            value={keywords}
            onChange={handleSearch}
            className="w-full border rounded-md p-2 pl-10"
          />
          <MdPersonSearch className="absolute left-3 top-2.5 text-gray-500" />
        </div>

        <table className="w-full border border-stroke rounded-md text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-2">No.</th>
              <th className="py-3 px-2">Title</th>
              <th className="py-3 px-2">Category</th>
              <th className="py-3 px-2">User</th>
              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <tr key={post.id} className="border-t">
                  <td>{index + 1}</td>
                  <td>{post.title}</td>
                  <td>{post.category?.name || "-"}</td>
                  <td>{post.user?.name || "-"}</td>
                  <td className="flex justify-center gap-2 py-2">
                    <Link to={`/admin/posts/edit/${post.id}`}>
                      <FaUserEdit className="text-primary text-lg" />
                    </Link>
                    {hasAnyPermissions(["posts.delete"]) && (
                      <button onClick={() => handleDelete(post.id)}>
                        <MdDeleteForever className="text-danger text-lg" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-5 text-center text-sm text-[#9D5425] font-semibold border-t"
                >
                  No Data Found!
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <Pagination
          className="flex justify-end mt-4"
          currentPage={pagination.current_page}
          totalCount={pagination.total}
          pageSize={pagination.per_page}
          onPageChange={(page) => fetchData(page, keywords)}
        />
      </div>
    </LayoutAdmin>
  );
}
