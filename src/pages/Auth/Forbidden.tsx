import LayoutAuth from "../../layouts/Auth";
import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <LayoutAuth>
      <div className="flex flex-col justify-center items-center h-[80vh] text-center">
        <img src="/images/no-touch.png" alt="Access Denied" width={180} className="mb-6" />
        <h2 className="text-2xl font-bold text-white mb-3">Access Denied</h2>
        <Link
          to="/admin/dashboard"
          className="bg-white text-black py-2 px-5 rounded-md font-medium hover:bg-gray-200 transition"
        >
          <i className="fa fa-arrow-left mr-2"></i> Back to Dashboard
        </Link>
      </div>
    </LayoutAuth>
  );
}
