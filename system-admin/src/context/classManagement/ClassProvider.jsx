import { useState } from "react";
import classContext from "./ClassContext";
import { apiClass } from "../../lib/axios.js";
import toast from "react-hot-toast";
import { useEffect } from "react";

const ClassProvider = ({ children }) => {
  const [ loading, setLoading ] = useState(true);
  const [ classList, setClassList ] = useState(null);
  const [ classStudents, setClassStudents ] = useState(null);
  const [ filteredClass, setFilteredClass ] = useState(null);  
  const [ searchClass, setSearchClass ] = useState("");
  const [ newClass, setNewClass ] = useState(false);
  const [ filterList, setFilterList ] = useState({});
  const [ form, setForm ] = useState({});
  const [ dropdownSelect, setDropdownSelect ] = useState({});

  /** this is for dashboard */
  const [ recentClass, setRecentClass ] = useState(null);

  const createClass = async () => {
    setLoading(true);
    const toastId = toast.loading("Uploading class...");
    try {
      const res = await apiClass.post("/class-management", form);
      fetchClasses();
      toast.dismiss(toastId);
      toast.success(res.data.message);
    } catch (err) {
      console.log("Error failed creating class", err);
      toast.dismiss(toastId);
      toast.error(err.response.data.message);
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  }

  const fetchRecentClasses = async () => {
    setLoading(true);
    try {
      const res = await apiClass.get("/class-management/recent");
      setRecentClass(res.data.classes);
    } catch (err) {
      console.log("Error failed fetching classes", err);
    } finally {
      setLoading(false);
    }
  }

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await apiClass.get("/class-management");
      setClassList(res.data.classes);
      setFilteredClass(res.data.classes);

    } catch (err) {
      console.log("Error failed fetching classes", err);
    } finally {
      setLoading(false);
    }
  }

  const fetchStudentsFromClass = async (classID) => {
      setClassStudents(null); 
      setLoading(true);
      try {
        const res = await apiClass.get(`/class-students/${classID}`);
        setClassStudents(res.data.classStudents);
      } catch (err) {
        toast.error(err?.response?.data.message);
        setClassStudents(null);
      } finally {
        setLoading(false);
      }
    }

  const deleteClass = async (id) => {
    try {
      const res = await apiClass.delete(`/class-management/${id}`);
      toast.success(res.data.message);
      fetchClasses();
    } catch (err) {
      console.log("Failed deleting class", err);
      toast.error(err.response.data.message);
    }
  }

  const filterClass = (val) => {
    const filtered = classList;
    const results = filtered.filter(x => 
      (!val.acYear || x.acYear === val.acYear) &&
      (!val.sem || x.sem === val.sem) &&
      (!val.year || x.year.toLowerCase() === val.year) &&
      (!val.block || x.block === val.block) &&
      (!val.course || x.course === val.course)
    );
    setFilteredClass(results);
  }

  return (
    <classContext.Provider value={{ classList, setClassList, filteredClass, setFilteredClass, newClass, setNewClass, form, setForm, createClass, fetchClasses, loading, searchClass, setSearchClass, dropdownSelect, setDropdownSelect, filterClass, deleteClass, setFilterList, filterList, fetchRecentClasses, recentClass, fetchStudentsFromClass, classStudents, setClassStudents
     }}>
      {children}
    </classContext.Provider>
  )
}

export default ClassProvider