import { useContext, useEffect, useState } from "react"
import teacherContext from "./teacherContext"
import { apiAccount, apiStudent } from "../../lib/axios";
import authContext from "../authContext";


const TeacherProvider = ({ children }) => {
  const { user } = useContext(authContext);
  const [ teacher, setTeacher ] = useState(null);
  const [ loading, setLoading ] = useState(false);

  // const fetchTeacherInfo = async (teacherID) => {
  //   if(!teacherID) return;
  //   setLoading(true);
  //   try {
  //     const res = await apiStudent.get(`/student-info/${teacherID}`);
  //     setTeacher(res.data.student);
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // useEffect(() => {
  //   if(user?.id){
  //     fetchTeacherInfo(user?.id);
  //   }
  // }, [user]);

  return (
    <teacherContext.Provider value={{  }}>
      { children }
    </teacherContext.Provider>
  )
}

export default TeacherProvider