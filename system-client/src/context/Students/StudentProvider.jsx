import { useContext, useEffect, useState } from "react"
import studentContext from "./studentContext"
import toast from "react-hot-toast";
import { apiAccount, apiStudent } from "../../lib/axios";
import authContext from "../authContext";

const StudentProvider = ({ children }) => {
  const { user, authorization } = useContext(authContext);
  const [ users, setUsers ] = useState(null);
  const [ student, setStudent ] = useState(null);
  const [ allStudents, setAllStudents ] = useState(null);
  const [ loading, setLoading ] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await apiAccount.get("/user-accounts");
      setUsers(res.data.accounts);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  const fetchStudentInfo = async (studentID) => {
    if(!studentID) return;
    setLoading(true);
    try {
      const res = await apiStudent.get(`/student-info/${studentID}`);
      setStudent(res.data.student);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const fetchStudentsForClass  =  async () => {
    setLoading(true);
    try {
      const res = await apiAccount.get("/students");
      setAllStudents(res.data.students);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }
  
  const addSubjectForStudent = async (subjectID) => {
    try {
      const res = await apiStudent.put(`/add-subject/${user?.id}`, 
        { subjectID, year: student.year, course: student?.course });
      setStudent(res.data.student);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  }

  const removeSubjectForStudent = async (subjectID) => {
    try {
      await apiStudent.patch(`/remove-subject/${user?.id}`, 
        { subjectID });
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  }

  useEffect(() => {
    if(user?.id){
      fetchStudents();
      if(authorization === 1){
        fetchStudentInfo(user?.id);
      }
    }
  }, [user?.id, authorization]);

    return (
    <studentContext.Provider value={{ users, fetchStudentsForClass, fetchStudentInfo, addSubjectForStudent, removeSubjectForStudent, student }}>
      {children}
    </studentContext.Provider>
  )
}

export default StudentProvider