import { Navigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const axiosSecure = UseAxiosSecure();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    axiosSecure.get("/users")
      .then(res => {
        const allUsers = res.data;

        const matchedUser = allUsers.find(
          u => u.email === user.email
        );

        setCurrentUser(matchedUser);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [user?.email, axiosSecure]);

  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const role = currentUser.role;


  if (role === "admin" && location.pathname !== "/dashboard/admin") {
    return <Navigate to="/dashboard/admin" replace />;
  }


  if (location.pathname !== "/dashboard/user") {
    return <Navigate to="/dashboard/user" replace />;
  }

  return null;
};

export default Dashboard;