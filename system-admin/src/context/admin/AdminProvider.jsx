    import axios from "axios";
import { useEffect, useState } from "react"
import adminContext from "./adminContext"
import { apiAdmin } from "../../lib/axios.js";
import toast from "react-hot-toast";

const AdminProvider = ({ children }) => {
  const [ authenticated, setAuthenticated ] = useState(false);
  const [ adminData, setAdminData ] = useState(null);
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ loading, setLoading ] = useState(true);

  const loginAdmin = async () => {
    setLoading(true);

    try {
      const res = await apiAdmin.post("/login-admin", { username, password });
      toast.success(res.data?.message);
      await checkAuth({ isLoading: true });
      setUsername("");
      setPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Server failed, please refresh the page");
    } finally {
      setLoading(false);
    }
  }

  const logoutAdmin = async () => {
    setLoading(true);

    try {
      const res = await apiAdmin.post("/logout-admin");
      toast.success(res.data.message);
      setAuthenticated(false);
      setAdminData(null);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data.message || "Server failed, please refresh the page");
    } finally {
      setLoading(false);
    }
  }

  const checkAuth = async ({ isLoading = false }) => {
    if(isLoading) setLoading(true);
    try {
      const res = await apiAdmin.get("/access-admin", 
        { withCredentials: true }
      );
      setAuthenticated(true);
      setAdminData(res.data?.admin);
    } catch (err) {
      if(err.response?.status !== 401){
        console.log("Unauthorized error", err);
      }
      setAuthenticated(false);
      setAdminData(null);
    } finally {
      setLoading(false);
    }
  }

  // const clearCookie = async () => {
  //   try {
  //     const res = await axios.post(
  //       "http://localhost:5002/api/clear-cookie",
  //       {},
  //       { withCredentials: true }
  //     );
  //     console.log(res.data.message); // "Cookie cleared/reset!"
  //   } catch (err) {
  //     console.error("Failed to clear cookie:", err);
  //   }
  // };

  useEffect(() => {
    checkAuth({ isLoading: true });
    // clearCookie()
  }, [])

  return (
    <adminContext.Provider value={{ authenticated, loading, checkAuth, setUsername, setPassword,
      loginAdmin, logoutAdmin, username, password, adminData
     }}>
      { children }
    </adminContext.Provider>
  )
}

export default AdminProvider