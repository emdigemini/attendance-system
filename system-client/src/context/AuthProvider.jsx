import { useCallback, useState } from "react"
import authContext from "./authContext";
import { BASE_URL, apiAccount, apiStudent, apiTeacher } from "../lib/axios.js";
import toast from "react-hot-toast"
import { useEffect } from "react";
import axios from "axios";

const AuthProvider = ({ children }) => {
  const [ user, setUser ] = useState(null);
  // authorization: 1 = student, 2 = teacher
  const [ authorization, setAuthorization ] = useState(null); 
  const [ authenticated, setAuthenticated ] = useState(false);
  const [ loading, setLoading ] = useState(true);
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  // for edit profile
  const [ localData, setLocalData ] = useState(() => localStorage.getItem("profile"));
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

  const [ isServerLoaded, setIsServerLoaded ] = useState(false);

  const loginAccount = async () => {
    setLoading(true);
    try {
      const res = await apiAccount.post("/login", { username, password });
      toast.success(res.data?.message);
      await checkAuth({ showLoading: true });
      setUsername("");
      setPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Server failed, please refresh the page");
    } finally {
      setLoading(false);
    }
  }

  const logoutAccount = async () => {
    setLoading(true);
    try {
      const res = await apiAccount.post("/logout");
      toast.success(res.data?.message);
      setAuthenticated(false);
      setUser(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  }

  const checkAuth = async ({ showLoading = false }) => {
    if(showLoading) setLoading(true);

    try {
      const res = await apiAccount.get("/my-account");

      if(res.data && res.data.user){
        setAuthenticated(true);
        setUser(res.data.user);
      } else {
        setAuthenticated(false);
        setUser(null);
      }
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

    const payload = {
      ...(fname && { fname }),
      ...(lname && { lname }),
      ...(email && { email }),
      ...(phoneNumber && { phoneNumber }),
      ...(course && { course }),
      ...(year && { year }),
      ...(studentType && { studentType }),
      ...(specialization && { specialization }),
      ...(graduatedAt && { graduatedAt }),
      ...(employmentType && { employmentType }),
    };

    if (JSON.stringify(payload) === JSON.stringify(localData)) return;
    setLoading(true);

    try {
      const res = await api.put(
        `/update-info/${user?.id}`,
        payload
      );

      await checkAuth({ showLoading: true });

      toast.success(res.data.message);
      getLocalData();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const getLocalData = () => {
    setLocalData({
      pfp: user?.pfp || undefined,
      fname: user?.fname || undefined,
      lname: user?.lname || undefined,
      email: user?.email || undefined,
      phoneNumber: user?.phoneNumber || undefined,
      course: user?.profile?.course || undefined,
      year: user?.profile?.year || undefined,
      studentType: user?.profile?.studentType || undefined,
      specialization: user?.profile?.specialization || undefined,
      graduatedAt: user?.profile?.graduatedAt || undefined,
      employmentType: user?.profile?.employmentType || undefined,
    });
  }

  useEffect(() => {
    const runServer = async () => {
      try {
        await axios.get(`${BASE_URL}/health`, {
          withCredentials: true,
        });
        setIsServerLoaded(true);
      } catch (err) {
        setIsServerLoaded(false);
      }
    };
    
    runServer();
  }, []);


  useEffect(() => {
    if(!authenticated){
      checkAuth({ showLoading: true });
    }
  }, [authenticated]);

  useEffect(() => {
    if(user?.accountType === "Teacher")
      setAuthorization(2);
    else if(user?.accountType === "Student"){
      setAuthorization(1);
    }
    else setAuthorization(null);
    setFname(user?.fname);
    setLname(user?.lname);
    setEmail(user?.email);
    setPhoneNumber(user?.phoneNumber);
    setCourse(user?.profile?.course);
    setYear(user?.profile?.year);
    setStudentType(user?.profile?.studentType);
    setSpecialization(user?.profile?.specialization);
    setGraduatedAt(user?.profile?.graduatedAt);
    setEmploymentType(user?.profile?.employmentType);
  }, [user]);



  return (
    <authContext.Provider value={{ loginAccount, logoutAccount, user, authenticated, loading, 
    checkAuth, setUsername, setPassword, username, password,
    authorization, isServerLoaded,
    setFname, setLname, setEmail, setPhoneNumber, setCourse, setYear, setStudentType, setSpecialization, setGraduatedAt, setEmploymentType, saveUserProfile, localData, setLocalData, getLocalData }}>
      {children}
    </authContext.Provider>
  )
}

export default AuthProvider