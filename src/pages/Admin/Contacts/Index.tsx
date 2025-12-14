import { useEffect, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import LayoutAdmin from "../../../layouts/Admin";
import toast from "react-hot-toast";
import type { Contact, PaginationMeta } from "../../../types/contact";
import { confirmAlert } from "react-confirm-alert";
import hasAnyPermissions from "../../../utils/Permissions";
import Pagination from "../../../components/general/Pagination";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever, MdPersonSearch } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";

// Service
import { contactService } from "../../../services";

export default function ContactsIndex() {
  document.title = "Contacts - My Portfolio";

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
  });
  const [keywords, setKeywords] = useState("");

  const fetchData = async (page = 1, search = "") => {
    try {
      const data = await contactService.getAll(page, search);
      setContacts(data.data || []);
      setPagination({
        current_page: data.current_page ?? 1,
        per_page: data.per_page ?? 10,
        total: data.total ?? 0,
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load contacts");
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
      title: "Delete Contact?",
      message: "Are you sure you want to delete this contact?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            // Optimistic UI
            setContacts((prev) => prev.filter((item) => item.id !== id));

            try {
              await contactService.delete(id);
              toast.success("Contact deleted successfully");

              // Refresh to keep pagination accurate
              setTimeout(() => {
                fetchData(pagination.current_page ?? 1, keywords);
              }, 0);
            } catch (error: any) {
              toast.error(error?.response?.data?.message || "Failed to delete contact");
              fetchData(pagination.current_page ?? 1, keywords);
            }
          },
        },
        { label: "No", onClick: () => {} },
      ],
    });
  };

  return (
    <LayoutAdmin>
      <div className="rounded-xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h4 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">
              Contacts List
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage contact links displayed on your portfolio.
            </p>
          </div>

          {hasAnyPermissions(["contacts.create"]) && (
            <Link
              to="/admin/contacts/create"
              className="inline-flex w-fit items-center justify-center rounded-lg bg-primary px-8 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              <FaCirclePlus className="mr-2" /> Add New
            </Link>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <MdPersonSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search contact..."
            value={keywords}
            onChange={handleSearch}
            className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-white dark:border-strokedark focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto rounded-lg border border-stroke dark:border-strokedark">
          <table className="w-full border-collapse text-sm text-center">
            <thead className="bg-gray-100 dark:bg-meta-4 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="p-3 font-semibold border-b">No.</th>
                <th className="p-3 font-semibold border-b">Name</th>
                <th className="p-3 font-semibold border-b">Image</th>
                <th className="p-3 font-semibold border-b">URL</th>
                <th className="p-3 font-semibold border-b">Actions</th>
              </tr>
            </thead>

            <tbody>
              {contacts.length > 0 ? (
                contacts.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-boxdark-2 transition-colors"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium text-slate-800 dark:text-gray-200">
                      {item.name}
                    </td>
                    <td className="p-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 mx-auto rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No Image</span>
                      )}
                    </td>
                    <td className="p-3">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline inline-block max-w-[260px] truncate"
                        title={item.link}
                      >
                        {item.link}
                      </a>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/admin/contacts/edit/${item.id}`}
                          className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-white hover:bg-opacity-90"
                        >
                          <FaUserEdit />
                        </Link>

                        {hasAnyPermissions(["contacts.delete"]) && (
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center justify-center rounded-md bg-danger px-3 py-2 text-white hover:bg-opacity-90"
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
          {contacts.length > 0 ? (
            contacts.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-stroke dark:border-strokedark bg-white dark:bg-boxdark p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full border border-dashed border-stroke dark:border-strokedark flex items-center justify-center text-xs text-gray-500">
                      No
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 dark:text-gray-200 truncate">
                      {item.name}
                    </p>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-600 hover:underline block truncate"
                      title={item.link}
                    >
                      {item.link}
                    </a>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <Link
                    to={`/admin/contacts/edit/${item.id}`}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-white hover:bg-opacity-90"
                  >
                    <FaUserEdit />
                  </Link>

                  {hasAnyPermissions(["contacts.delete"]) && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center justify-center rounded-md bg-danger px-3 py-2 text-white hover:bg-opacity-90"
                    >
                      <MdDeleteForever />
                    </button>
                  )}
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
    </LayoutAdmin>
  );
}
