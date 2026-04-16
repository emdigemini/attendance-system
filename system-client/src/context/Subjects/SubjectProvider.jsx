import { useContext, useEffect, useState } from "react"
import subjectContext from "./subjectContext"
import toast from "react-hot-toast";
import { apiStudent, apiSubject } from "../../lib/axios.js";
import authContext from "../authContext.jsx";
import classContext from "../Classrooms/classContext.jsx";
import studentContext from "../Students/studentContext.jsx";


const SubjectProvider = ({ children }) => {
  const { user, authorization } = useContext(authContext);
  const { classList } = useContext(classContext);
  const [ attSubject, setAttSubject ] = useState([]);
  const [ attSubjectFilter, setAttSubjectFilter ] = useState([]);
  const [ filterListSub, setFilterListSub ] = useState({});
  
  const [ allSubs, setAllSubs ] = useState(0);
  const [ allSubjects, setAllSubjects ] = useState(null);
  const [ mySubjects, setMySubjects ] = useState(null);
  const [ filteredSubjects, setFilteredSubjects ] = useState(null);
  const [ subjectForm, setSubjectForm ] = useState({});
  const [ loading, setLoading ] = useState(true);
  const [ subInfo, setSubInfo ] = useState(null);
  const [ classView, setClassView ] = useState([]);

  const [ checkAttendance, setCheckAttendance ] = useState(null);
  const [isOpen, setIsOpen] = useState([]); // for toggling class for each subject in attendance page.

  /* for subject preview */
  const [ subPrev, setSubPrev ] = useState(false);

  const addSubject = async () => {
    setLoading(true);
    const toastId = toast.loading("Adding your subject");
    try {
      const res = await apiSubject.post(`/add-subject/${user.id}`, subjectForm);
      await fetchSubject();
      await fetchAllSubject();
      toast.success(res.data.message, {id: toastId});
    } catch (err) {
      toast.error(err.response?.data?.message, {id: toastId});
    } finally {
      setLoading(false);
    }
  }

  const deleteSubject = async (id) => {
    setLoading(true);
    const toastId = toast.loading("Deleting subject...");
    try {
      const res = await apiSubject.delete(`/delete-subject/${id}`);
      await fetchSubject();
      toast.success(res.data.message, {id: toastId});
    } catch (err) {
      toast.error(err.response?.data?.message, {id: toastId});
    } finally {
      setLoading(false);
    }
  }

  const editSubject = async (id, body) => {
    setLoading(true);
    const toastId = toast.loading("Updating subject...");
    try {
      const res = await apiSubject.put(`/edit-subject/${id}`, body);
      await fetchSubject();
      toast.success(res.data.message, {id: toastId});
    } catch (err) {
      toast.error(err.response?.data?.message, {id: toastId});
    } finally {
      setLoading(false);
    }
  }

  // for teacher subjects
  const fetchSubject = async () => {
    setLoading(true);
    try {
      const res = await apiSubject.get(`/all-subject/${user.id}/my-subject`);
      setFilteredSubjects(res.data.subject);
      setMySubjects(res.data.subject);
    } catch (err) {
      toast.error(err.response?.data?.message);
      setFilteredSubjects(null);
      setMySubjects(null);
    } finally {
      setLoading(false);
    }
  }

  // for studetn subjects
  const fetchSubjectForStudent = async () => {
    setLoading(true);
    try {
      const res = await apiStudent.get(`/student-subject/${user?.id}`);
      setFilteredSubjects(res.data.subject);
      setMySubjects(res.data.subject);
    } catch (err) {
      toast.error(err?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  const fetchAllSubject = async () => {
    setLoading(true);
    try {
      const res = await apiSubject.get(`/all-subject`);
      setAllSubjects(res.data.subject);
    } catch (err) {
      toast.error(err.response?.data?.message);
      setAllSubjects(null);
    } finally {
      setLoading(false);
    }
  }

  const getClassForSubject = async (id) => {
    setLoading(true);
    try {
      const res = await apiSubject.post(`/generate-class/${id}`, { classes: classList });
      setClassView(res.data.classes);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  const fetchSubForAttendance = async (id) => {
    setLoading(true);
    try {
      const res = await apiSubject.get(`/all-subject/${id}/attendance`);
      setAttSubject(res.data.myClass);
      setAttSubjectFilter(res.data.myClass);
    } catch (err) {
      toast.error(err.response?.data?.message);
      setAttSubject([]);
      setAttSubjectFilter([]);
    } finally {
      setLoading(false);
    }
  }

  const previewSubject = (val) => {
    setSubInfo(val);
    getClassForSubject(val._id);
  }
  
  /* Filtering Function */
  const filterSubAtt = (val) => {
    const filtered = attSubject;
    const results = filtered.filter(x => 
      (!val.acYear || x.acYear === val.acYear) &&
      (!val.sem || x.sem === val.sem) &&
      (!val.year || x.year.toLowerCase() === val.year.toLowerCase()) &&
      (!val.block || x.block === val.block) &&
      (!val.course || x.course === val.course)
    );
    setAttSubjectFilter(results);
  }

  const filterSub = (val) => {
    let filtered;
    if(allSubs === 0){
      filtered = mySubjects;
    } else {
      filtered = allSubjects;
    }

    const results = filtered.filter(x => 
      (!val.acYear || x.acYear === val.acYear) &&
      (!val.sem || x.sem === val.sem) &&
      (!val.year || x.year.toLowerCase() === val.year.toLowerCase()) &&
      (!val.block || x.block === val.block) &&
      (!val.course || x.course === val.course)
    );
    setFilteredSubjects(results);
  }
  
  useEffect(() => {
    if (user?.id) {
      fetchAllSubject();
      if(authorization === 1){
        fetchSubjectForStudent();
      }
      if(authorization === 2){
        fetchSubject();
        fetchSubForAttendance(user?.id);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authorization]);

  // useEffect(() => {
  //   console.log(mySubjects);
  // }, [mySubjects]);

  return (
    <subjectContext.Provider value={{ setMySubjects, setFilteredSubjects, setSubjectForm, addSubject,
    fetchSubject, previewSubject, getClassForSubject, fetchSubjectForStudent,
    loading, allSubjects, mySubjects, filteredSubjects, subjectForm, subInfo, classView, attSubject, isOpen, setIsOpen, checkAttendance, setCheckAttendance, attSubjectFilter, setAttSubjectFilter,
    filterSub, filterSubAtt, filterListSub, setFilterListSub, allSubs, setAllSubs, fetchSubForAttendance, deleteSubject, editSubject, subPrev, setSubPrev }}>
      {children}
    </subjectContext.Provider>
  )
}

export default SubjectProvider