import { useState, useEffect, useContext } from "react";
import scheduleContext from "./scheduleContext";
import toast from "react-hot-toast";
import { apiSched } from "../../lib/axios.js";
import authContext from "../authContext";
import subjectContext from "../Subjects/subjectContext.jsx";
import classContext from "../Classrooms/classContext.jsx";

const ScheduleProvider = ({ children }) => {
  const { user, authorization } = useContext(authContext);
  const { classList } = useContext(classContext);
  const { mySubjects } = useContext(subjectContext);
  const [ loading, setLoading ] = useState(true);
  const [ formData, setFormData ] = useState({
    date: '',
    subject_id: '',
    class_id: '',
    timeFrom: null, timeTo: null
  });
  const [ mySched, setMySched ] = useState([]);
  const [ todaySched, setTodaySched ] = useState([]);

  const newSchedule = async () => {
    if (authorization !== 2)
      return toast.error("Invalid teacher's id");

    try {
      const res = await apiSched.post(`/new-schedule/${user.id}`, formData);
      toast.success(res?.data?.message);
      getTeacherSchedule();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setFormData({
        date: '',
        subject_id: '',
        class_id: '',
        timeFrom: null,
        timeTo: null,
      });
    }
  }

  const editSchedule = async (body) => {
    if (authorization !== 2)
      return toast.error("Invalid teacher's id");

    setLoading(true);
    const toastId = toast.loading("Saving...");
    try {
      const res = await apiSched.put(`/edit-schedule/${body.schedId}`, {
        date: body.date,
        subject_id: body.subId,
        timeFrom: body.timeFrom,
        timeTo: body.timeTo,
      });
      toast.success(res?.data?.message);
      getTeacherSchedule();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  }

  const deleteSchedule = async (id) => {
    if (authorization !== 2)
      return toast.error("Invalid teacher's id");

    setLoading(true);
    const toastId = toast.loading("Deleting...");
    try {
      const res = await apiSched.delete(`/delete-schedule/${id}`);
      toast.success(res?.data?.message);
      getTeacherSchedule();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  }

  const getStudentSchedule = async () => {
    if (authorization !== 1)
      return toast.error("Invalid student's id");

    const classIDs = classList?.map(c => c._id);
    const subjectIDs = mySubjects?.map(s => s._id);
    setLoading(true);

    try {
      const res = await apiSched.get(`/student-schedule`, {
        params: {
          classIDs,
          subIDs: subjectIDs
        }
      });
      setMySched(res.data.schedule);
    } catch (err) {
      toast.error(err.response?.data?.message);
      setMySched([]);
    } finally {
      setLoading(false);
    }
  }

  const getTeacherSchedule = async () => {
    if (authorization !== 2)
      return toast.error("Invalid teacher's id");

    const subjectIDs = mySubjects?.map(s => s._id);
    setLoading(true);

    try {
      const res = await apiSched.get(`/teacher-schedule/${user.id}`, {
        params: 
          {subIDs: subjectIDs}
      });

      setMySched(res.data.schedule);
    } catch (err) {
      toast.error(err.response?.data?.message);
      setMySched([]);
    } finally {
      setLoading(false);
    }
  }

  const getTodaySchedule = () => {
    if (mySched.length === 0) return;

    const today = new Date().getDay();
    const filterSched = mySched?.filter(s => s.date === today); 
    setTodaySched(filterSched);
  }

  useEffect(() => {
    if(user?.id){
      if(authorization === 1){
        if(!classList || !mySubjects) return
        getStudentSchedule();
      } else if(authorization === 2){
        console.log(mySubjects);
        if(!mySubjects) return
        getTeacherSchedule();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, authorization, classList, mySubjects]);

  useEffect(() => {
    if(authorization === 1 || authorization === 2){
      getTodaySchedule();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorization, mySched])

    return (
    <scheduleContext.Provider value={{ loading, formData, setFormData, newSchedule, mySched, editSchedule, deleteSchedule, todaySched }}>
      { children }
    </scheduleContext.Provider>
  )
}

export default ScheduleProvider