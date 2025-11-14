import { useEffect, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import LayoutAdmin from "../../../layouts/Admin";
import toast from "react-hot-toast";
import { Contact, PaginationMeta } from "../../../types/contact";
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
    const data = await contactService.getAll(page, search);
    setContacts(data.data);
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
      message: "Delete this contact?",
      buttons: [
        {
          label: "YES",
          onClick: async () => {
            await contactService.delete(id);
            toast.success("Contact deleted!");
            fetchData(pagination.current_page);
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
          <h4 className="text-xl font-semibold">Contacts List</h4>
          {hasAnyPermissions(["contacts.create"]) && (
            <Link
              to="/admin/contacts/create"
              className="inline-flex items-center rounded-md bg-primary text-white py-2 px-4 hover:bg-opacity-90"
            >
              <FaCirclePlus className="mr-2" /> Add New
            </Link>
          )}
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search contact..."
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
              <th className="py-3 px-2">Name</th>
              <th className="py-3 px-2">Image</th>
              <th className="py-3 px-2">URL</th>
              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 ? (
              contacts.map((item, index) => (
                <tr key={item.id} className="border-t">
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 mx-auto rounded-full"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </td>
                  <td>{item.link}</td>
                  <td className="flex justify-center gap-2 py-2">
                    <Link to={`/admin/contacts/edit/${item.id}`}>
                      <FaUserEdit className="text-primary text-lg" />
                    </Link>
                    {hasAnyPermissions(["contacts.delete"]) && (
                      <button onClick={() => handleDelete(item.id)}>
                        <MdDeleteForever className="text-danger text-lg" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-red-500 font-medium">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

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
