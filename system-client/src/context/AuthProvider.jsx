import { useState } from "react"
import authContext from "./authContext";
import { apiAccount, apiStudent, apiTeacher } from "../lib/axios.js";
import toast from "react-hot-toast"
import { useEffect } from "react";

const AuthProvider = ({ children }) => {
  const [ user, setUser ] = useState(null);
  // authorization: 1 = student, 2 = teacher
  const [ authorization, setAuthorization ] = useState(null); 
  const [ authenticated, setAuthenticated ] = useState(false);
  const [ loading, setLoading ] = useState(true);
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  // for edit profile
  const [ fname, setFname ] = useState("");
  const [ lname, setLname ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ phoneNumber, setPhoneNumber ] = useState("");
  const [ course, setCourse ] = useState("");
  const [ year, setYear ] = useState("");
  const [ studentType, setStudentType ] = useState("");
  const [ specialization, setSpecialization ] = useState("");
  const [ graduatedAt, setGraduatedAt ] = useState("");
  const [ employmentType, setEmploymentType ] = useState("");

  const loginAccount = async () => {
    try {
      const res = await apiAccount.post("/login", { username, password });
      toast.success(res.data?.message);
      await checkAuth({ showLoading: true });
      setUsername("");
      setPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Server failed, please refresh the page");
    }
  }

  const logoutAccount = async () => {
    try {
      const res = await apiAccount.post("/logout");
      toast.success(res.data?.message);
      setAuthenticated(false);
      setUser(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  }

  const checkAuth = async ({ showLoading = false }) => {
    if(showLoading) setLoading(true);

    try {
      const res = await apiAccount.get("/my-account");
      setAuthenticated(true);
      setUser(res.data.user);
    } catch (err) {
      if (!err.response || err.response.status !== 401) {
        console.error("Unexpected error:", err);
      }
      setAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  const saveUserProfile = async (pfpUrl = null) => {
    let api = null;

    if (authorization === 1) api = apiStudent;
    else if (authorization === 2) api = apiTeacher;

    setLoading(true);

    try {
      const payload = {
        fname,
        lname,
        email,
        phoneNumber,
        course,
        year,
        studentType,
        specialization,
        graduatedAt,
        employmentType
      };

      if (pfpUrl) {
        payload.pfp = pfpUrl;
      }

      const res = await api.put(
        `/update-info/${user?.id}`,
        payload
      );

      await checkAuth({ showLoading: true });

      toast.success(res.data.message);

    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth({ showLoading: true });
  }, []);

  useEffect(() => {
    if(user?.accountType === "Teacher")
      setAuthorization(2);
    else if(user?.accountType === "Student")
      setAuthorization(1);
    else setAuthorization(null);
  }, [user]);

  return (
    <authContext.Provider value={{ loginAccount, logoutAccount, user, authenticated, loading, 
    checkAuth, setUsername, setPassword, username, password,
    authorization,
    setFname, setLname, setEmail, setPhoneNumber, setCourse, setYear, setStudentType, setSpecialization, setGraduatedAt, setEmploymentType, saveUserProfile }}>
      {children}
    </authContext.Provider>
  )
}

export default AuthProvider