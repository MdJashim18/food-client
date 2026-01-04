import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import UseAxiosSecure from "./UseAxiosSecure";

const useRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = UseAxiosSecure()

  useEffect(() => {
    if (!user?.email) return;

    axiosSecure.get("/users")
      .then(res => {
        const matchedUser = res.data.find(
          u => u.email === user.email
        );
        setRole(matchedUser?.role || "user");
      })
      .catch(() => setRole("user"))
      .finally(() => setLoading(false));
  }, [user?.email]);

  return [role, loading];
};

export default useRole;
