import { useContext, useEffect, useState } from "react";
import classContext from "./classContext";
import { apiClass } from "../../lib/axios.js";
import toast from "react-hot-toast";
import authContext from "../authContext.jsx";

const ClassProvider = ({ children }) => {
  const { user, authorization } = useContext(authContext);
  const [ loading, setLoading ] = useState(true);
  const [ classStudents, setClassStudents ] = useState(null);
  const [ classStudentsFiltered, setClassStudentsFiltered ] = useState(null);
  
  const [ classList, setClassList ] = useState(null);
  const [ filteredClass, setFilteredClass ] = useState(null);
  const [ searchClass, setSearchClass ] = useState("");
  const [ newClass, setNewClass ] = useState(false);
  const [ filterList, setFilterList ] = useState({});
  const [ form, setForm ] = useState({});
  const [ dropdownSelect, setDropdownSelect ] = useState({});

  /* To view the students/class for specific class */
  const [ studentPrev, setStudentPrev ] = useState(null);
  const [ classPrev, setClassPrev ] = useState(false);

  const fetchMyClassroom = async () => {
    if(user.accountType.toLowerCase() !== "student")
      return toast.error("StudentID invalid, Failed to join the classroom.");

    setLoading(true);

    try {
      const res = await apiClass.get(`/my-classroom/${user.id}`);
      setClassList(res.data.classes);
      setFilteredClass(res.data.classes);
    } catch (err) {
      toast.error(err?.response?.data.message);
    } finally {
      setLoading(false);
    }
  }

  const fetchClasses = async (body) => {
    setLoading(true);
    try {
      const classes = await apiClass.get("/class-management", {
        params: body
      });
      setClassList(classes.data.classes);
      setFilteredClass(classes.data.classes);
    } catch (err) {
      console.log("Error failed fetching classes", err);
      console.log(err);
      toast.error(err?.response?.data?.message)
    } finally {
      setLoading(false);
    }
  }

  const filterClass = (val) => {
    const filtered = classList;
    const results = filtered.filter(x => 
      (!val.acYear || x.acYear === val.acYear) &&
      (!val.sem || x.sem === val.sem) &&
      (!val.year || x.year === val.year) &&
      (!val.block || x.block === val.block) &&
      (!val.course || x.course === val.course)
    );
    setFilteredClass(results);
  }

  const joinClassroom = async (classID) => {
    if(user.accountType.toLowerCase() !== "student")
      return toast.error("StudentID invalid, Failed to join the classroom.");

    try {
      await apiClass.post(`/my-classroom/${classID}`, {studentID: user.id});
      window.location.reload();
    } catch (err) {
      toast.error(err?.response?.data.message);
    }
  }

  const removeClassroom = async (classID) => {
    if(user.accountType.toLowerCase() !== "student")
      return toast.error("StudentID invalid, Failed to join the classroom.");

    try {
      await apiClass.patch(`/my-classroom/${classID}/remove-student`, {studentID: user.id});
      window.location.reload();
    } catch (err) {
      toast.error(err?.response?.data.message);
    }
  }

  const fetchStudentsFromClass = async (classID) => {
    setClassStudents(null); 
    setLoading(true);
    try {
      const res = await apiClass.get(`/class-students/${classID}`);
      setClassStudents(res.data.classStudents);
      setClassStudentsFiltered(res.data.classStudents);
    } catch (err) {
      toast.error(err?.response?.data.message);
      setClassStudents([]);
      setClassStudentsFiltered([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(user?.id){
      if(authorization === 1){
        fetchMyClassroom()
      } else if(authorization === 2){
        fetchClasses();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, authorization]);

  return (
    <classContext.Provider value={{ classList, setClassList, filteredClass, setFilteredClass, newClass, setNewClass, form, setForm, fetchClasses, loading, searchClass, setSearchClass, dropdownSelect, setDropdownSelect, filterClass, setFilterList, filterList, joinClassroom, fetchMyClassroom, removeClassroom, fetchStudentsFromClass, classStudents, studentPrev, setStudentPrev, classStudentsFiltered, setClassStudentsFiltered, classPrev, setClassPrev
     }}>
      {children}
    </classContext.Provider>
  )
}

export default ClassProvider