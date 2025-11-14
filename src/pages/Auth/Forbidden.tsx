import { Link } from "react-router-dom";
import LayoutAuth from "../../layouts/Auth";

export default function Forbidden() {
  return (
    <LayoutAuth>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <img src="/images/no-touch.png" alt="Access Denied" width={200} className="mb-6" />
        <h2 className="text-2xl font-semibold mb-2 text-white">Access Denied</h2>
        <p className="text-gray-300 mb-6">You don’t have permission to view this page.</p>
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center bg-yellow-500 text-white py-2 px-6 rounded-lg hover:bg-yellow-600"
        >
          <i className="fa fa-long-arrow-alt-left mr-2"></i> Back to Dashboard
        </Link>
      </div>
    </LayoutAuth>
  );
}
