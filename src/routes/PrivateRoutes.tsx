//import Cookies
import Cookies from "js-cookie";
//import react-router-dom
import { Navigate } from "react-router-dom";

function PrivateRoutes({ children }) {
  //token react router dom
  const token = Cookies.get("token");

  //if from cookie
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default PrivateRoutes;
