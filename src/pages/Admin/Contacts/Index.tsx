import { useEffect, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../services/Api";
import Cookies from "js-cookie";
import hasAnyPermissions from "../../../utils/Permissions";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import Pagination from "../../../components/general/Pagination";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever, MdPersonSearch } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";

interface Contact {
  id: number;
  name: string;
  link: string;
  image: string;
}

interface PaginationMeta {
  currentPage: number;
  perPage: number;
  total: number;
}

export default function ContactsIndex() {
  document.title = "Contacts Page - My Portfolio";

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });
  const [keywords, setKeywords] = useState<string>("");

  const token = Cookies.get("token");

  const fetchData = async (pageNumber = 1, keywords = "") => {
    const page = pageNumber || pagination.currentPage;
    const response = await Api.get(`/api/admin/contacts?search=${keywords}&page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setContacts(response.data.data.data);
    setPagination({
      currentPage: response.data.data.current_page,
      perPage: response.data.data.per_page,
      total: response.data.data.total,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const searchData = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKeywords(val);
    fetchData(1, val);
  };

  const deleteContacts = (id: number) => {
    confirmAlert({
      title: "Are you sure?",
      message: "Want to delete this data?",
      buttons: [
        {
          label: "YES",
          onClick: async () => {
            const res = await Api.delete(`/api/admin/contacts/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            toast.success(res.data.message, { position: "top-center" });
            fetchData();
          },
        },
        { label: "NO" },
      ],
    });
  };

  return (
    <LayoutAdmin>
      <div className="rounded-sm border bg-white px-5 pt-6 pb-2.5 shadow-default dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Contacts Lists</h4>

        <div className="flex flex-row mb-4">
          {hasAnyPermissions(["contacts.create"]) && (
            <Link
              to="/admin/contacts/create"
              className="mx-2 inline-flex items-center justify-center rounded-md bg-meta-5 py-3 px-3 text-sm font-medium text-white hover:bg-opacity-90"
            >
              <FaCirclePlus className="text-white mr-2" /> Add New
            </Link>
          )}

          <div className="w-full">
            <form>
              <div className="relative">
                <input
                  type="text"
                  onChange={searchData}
                  placeholder="Search here..."
                  className="w-full bg-transparent pl-10 pr-4 py-2 text-black dark:text-white border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button type="submit" className="absolute left-0 top-1/2 -translate-y-1/2 p-2">
                  <MdPersonSearch />
                </button>
              </div>
            </form>
          </div>
        </div>

        <table className="w-full table-auto border border-stroke border-collapse rounded-sm dark:border-strokedark">
          <thead>
            <tr className="bg-gray-200 text-left dark:bg-meta-4">
              <th className="py-4 px-4 font-bold text-center text-black dark:text-white border w-[5%]">
                No.
              </th>
              <th className="py-4 px-4 font-bold text-center text-black dark:text-white border">
                Name
              </th>
              <th className="py-4 px-4 font-bold text-center text-black dark:text-white border">
                Image
              </th>
              <th className="py-4 px-4 font-bold text-center text-black dark:text-white border">
                URL
              </th>
              <th className="py-4 px-4 font-bold text-center text-black dark:text-white border">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 ? (
              contacts.map((contact, index) => (
                <tr key={contact.id} className="border dark:border-strokedark">
                  <td className="py-3 text-center">{index + 1}</td>
                  <td className="py-3 text-center">{contact.name}</td>
                  <td className="py-3 text-center">
                    {contact.image ? (
                      <img
                        src={contact.image}
                        alt={contact.name}
                        className="w-10 h-10 object-cover mx-auto rounded-full"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="py-3 text-center">{contact.link || "-"}</td>
                  <td className="py-3 text-center flex justify-center">
                    <Link
                      to={`/admin/contacts/edit/${contact.id}`}
                      className="inline-flex items-center justify-center"
                    >
                      <FaUserEdit className="text-primary text-lg mr-2" />
                    </Link>
                    {hasAnyPermissions(["contacts.delete"]) && (
                      <button
                        onClick={() => deleteContacts(contact.id)}
                        className="inline-flex items-center justify-center"
                      >
                        <MdDeleteForever className="text-danger text-lg" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-5 text-center text-[#9D5425]">
                  No Data Found!
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          className="flex justify-end my-4"
          currentPage={pagination.currentPage}
          totalCount={pagination.total}
          pageSize={pagination.perPage}
          onPageChange={(page) => fetchData(page, keywords)}
        />
      </div>
    </LayoutAdmin>
  );
}
