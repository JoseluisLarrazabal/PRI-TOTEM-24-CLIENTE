import { Navigate, Outlet } from "react-router-dom";
const PrivateRoute = ({
  token,
  redirectTo = "/",
}) => {
  if (token === null) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
};

export default PrivateRoute;