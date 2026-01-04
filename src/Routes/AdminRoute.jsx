
import { Navigate } from "react-router";
import useRole from "../Hooks/useRole";

const AdminRoute = ({ children }) => {
  const [role, loading] = useRole();

  if (loading) return <p>Loading...</p>;
  if (role !== 'admin') return <Navigate to="/" />;

  return children;
};

export default AdminRoute;
