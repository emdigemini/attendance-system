import { useEffect, useState } from "react";
import { apiAttendance, apiSubject } from "../../lib/axios.js";
import attendanceContext from "./attendanceContext";
import toast from "react-hot-toast";
import { useContext } from "react";
import subjectContext from "../Subjects/subjectContext.jsx";
import authContext from "../authContext.jsx";

const AttendanceProvider = ({ children }) => {
  const { user } = useContext(authContext);
  const { mySubjects } = useContext(subjectContext);

  const [ loading, setLoading ] = useState(true);
  const [ attLeaderboard, setAttLeaderboard ] = useState(null);
  const [ attLeaderboardFilter, setAttLeaderboardFilter ] = useState(null);

  const [ attResults, setAttResults ] = useState(null);
  const [ attRate, setAttRate ] = useState(null);
  const [ attCount, setAttCount ] = useState(null);
  const [ attStudents, setAttStudents ] = useState(null);
  const [ attStudentsFilter, setAttStudentsFilter ] = useState(null);
  const [ selectedDate, setSelectedDate ] = useState(() => {
    const formatted = new Date().toISOString().slice(0, 10);
    return formatted;
  });

  const fetchStudentsForAttendance = async (id) => {
    setLoading(true);
    try {
      const res = await apiSubject.get(`/attendance/${id}`);
      setAttStudents(res.data.students);
      setAttStudentsFilter(res.data.students);
    } catch (err) {
      toast.error(err.response?.data?.message);
      setAttStudents([]);
      setAttStudentsFilter([]);
    } finally {
      setLoading(false);
    }
  }

  const fetchAttendanceLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await apiAttendance.get(`/attendance-leaderboard`);
      setAttLeaderboard(res.data.attLeaderboard);
      setAttLeaderboardFilter(res.data.attLeaderboard);
    } catch (err) {
      toast.error(err.response?.data?.message);
      setAttLeaderboard([]);
      setAttLeaderboardFilter([]);
    } finally {
      setLoading(false);
    }
  }

  const newAttendance = async (id, body) => {
    let toastID;
    try {
      const res = await apiAttendance.post(`/new-attendance/${id}`, body);
      if(toastID) toast.dismiss(toastID);
      scanAttendance({
        studentIDs: body.studentIDs,
        subID: body.subjectID,
        date: body.date,
      });
      toastID = toast.success(res.data.message);
    } catch (err) {
      toast.error(err?.response?.data.message);
    } 
  }

  const scanAttendance = async (body) => {
    setLoading(true);
    try {
      const res = await apiAttendance.post(`/check-attendance`, body);
      setAttResults(res.data.attResults);
      setAttCount(res.data.attCount);
      fetchAttRate();
    } catch (err) {
      toast.error(err?.response?.data.message);
    } finally {
      setLoading(false);
    }
  }
  const fetchAttRate = async () => {
    const subIDs = mySubjects?.map(s => s._id);
    if (!subIDs) return;
    try {
      const res = await apiAttendance.post(`/attendance-rate`, { subIDs });
      setAttRate(res.data.attRate)
    } catch (err) {
      toast.error(err?.response?.data.message);
    }
  }

  useEffect(() => {
    if(user?.id){
      fetchAttRate()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <attendanceContext.Provider value={{ newAttendance, scanAttendance, attResults, setAttResults, selectedDate, setSelectedDate, attCount, setAttCount, fetchStudentsForAttendance, attStudents, attStudentsFilter, setAttStudentsFilter, loading, attRate, setAttRate,
    fetchAttendanceLeaderboard, attLeaderboard, attLeaderboardFilter, setAttLeaderboardFilter }}>
      { children }
    </attendanceContext.Provider>
  )
}

export default AttendanceProvider