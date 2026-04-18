/* components */
import defaultPfp from "../../../../images/placeholder-user.webp";
import { useContext, useEffect, useState } from "react";
import { SearchBar } from "../controllers/Controllers";
import Loading from "../Loading.jsx"

/* icons */
import { FaCheck, FaTimes } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import subjectContext from "../../context/Subjects/subjectContext";
import { sliceToOne, transformFirstVal } from "../../lib/utils.js";
import attendanceContext from "../../context/Attendance/attendanceContext.jsx";

const CheckAttendance = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-10">
      <Header />
      <div className="border-b border-gray-200"></div>
      <AttendanceBox />
    </div>
  )
}

const Header = () => {
  const { checkAttendance, setCheckAttendance } = useContext(subjectContext);
  const { selectedDate, setSelectedDate, scanAttendance, attStudentsFilter } = useContext(attendanceContext);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    setSelectedDate(new Date().toISOString().slice(0, 10));
  }, [setSelectedDate]);

  const changeDate = (date) => {
    const s = attStudentsFilter?.map(s => s.student._id);
    setSelectedDate(date || today);
    scanAttendance({
      studentIDs: s,
      subID: checkAttendance.subID,
      date: date || today
    })
  }

  return (
    <header className="relative bg-white px-4 py-6 md:px-16 md:pt-12 md:pb-8 flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-center">
      <div className="flex items-start gap-4">
        <IoArrowBack 
          className="text-2xl cursor-pointer hover:bg-gray-100 rounded-full transition-colors shrink-0 mt-1" 
          onClick={() => setCheckAttendance(null)}
        />
        
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <h1 className="text-xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Check Attendance
            </h1>
            {selectedDate === today && (
              <span className="rounded-full bg-yellow-50 px-2.5 py-0.5 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-yellow-600 border border-yellow-200">
                Today
              </span>
            )}
          </div>
          
          <p className="text-sm md:text-lg text-gray-500">
            <span className="font-semibold text-gray-700">
              {new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" })}
            </span>
            <span className="mx-2 text-gray-300">|</span>
            {new Date(selectedDate).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        {/* Class Header */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl border border-gray-200 self-start md:self-auto">
          <div className="flex items-center gap-1.5 text-xs md:text-sm">
            <span className="font-bold text-gray-700 uppercase tracking-tight">
              {transformFirstVal(checkAttendance.course)}
            </span>
            <span className="text-gray-400 font-light text-lg">/</span>
            <span className="font-bold text-gray-700">
              {sliceToOne(checkAttendance.year)}{checkAttendance.block}
            </span>
          </div>
          <span className={`${selectedDate === today ? "text-green-500" : "text-gray-400"} text-xl`}>•</span>
          <span className="font-medium text-gray-600 text-sm truncate max-w-37.5">
            {checkAttendance.name}
          </span>
        </div>

        {/* Search and Date Input */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex-1">
            <SearchBar type="student" />
          </div>
          <input 
            type="date" 
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white shadow-sm hover:border-gray-400 transition-all cursor-pointer text-sm font-medium text-gray-600 outline-none w-35"
            onChange={(e) => changeDate(e.target.value)} 
          />
        </div>
      </div>
    </header>
  )
}

const AttendanceBox = () => {
  const { loading } = useContext(subjectContext);

  return (
    <div className="my-6 mx-4 md:my-12 md:mx-16">
      {loading ? (
        <div className="flex justify-center p-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <Loading val="students" />
        </div>
      ) : (
        <div className="overflow-hidden md:border md:border-gray-200 md:rounded-2xl md:shadow-sm md:bg-white">
          <table className="min-w-full block md:table">
            <thead className="hidden md:table-header-group bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-center px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Photo</th>
                <th className="text-center px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-center px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Yr/BLK</th>
                <th className="text-center px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
                <th className="text-center px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total Present</th>
                <th className="text-center px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total Absences</th>
                <th className="text-center px-4 py-4 text-green-500"><FaCheck className="inline" /></th>
                <th className="text-center px-4 py-4 text-red-500"><FaTimes className="inline" /></th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group space-y-4 md:space-y-0">
              <StudentList />
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const StudentList = () => {
  const { attStudentsFilter, newAttendance, scanAttendance, attResults, attCount, selectedDate, loading } = useContext(attendanceContext);
  const { checkAttendance } = useContext(subjectContext);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const s = attStudentsFilter?.map(s => s.student._id);
    if(attStudentsFilter){
      scanAttendance({
        studentIDs: s,
        subID: checkAttendance.subID,
        date: selectedDate
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attStudentsFilter]);

  if (loading) return <tr><td className="p-10 text-center"><Loading val="students" /></td></tr>;
  if (attStudentsFilter?.length === 0) return <tr><td className="p-10 text-center text-gray-500 italic">No students found.</td></tr>;

  return (
    <>
      {attStudentsFilter?.map(s => {
        const studentIDs = attStudentsFilter?.map(s => s.student._id);
        const isExists = attResults?.filter(scan => scan.student_id === s.student._id);
        const attID = isExists?.map(record => record._id);
        const count = attCount?.filter(count => count.student_id === s.student._id);
        const hasCount = attCount?.some(count => count.student_id === s.student._id);
        const isPresent = attResults?.some(scan => scan.student_id === s.student._id && scan.status === "present");
        const isAbsent = attResults?.some(scan => scan.student_id === s.student._id && scan.status === "absent");

        return (
          /* TR becomes a Card on mobile */
          <tr key={s._id} className="block md:table-row bg-white md:bg-transparent border border-gray-200 md:border-b md:border-gray-100 rounded-2xl md:rounded-none p-4 md:p-0 hover:bg-gray-50 transition-colors">
            
            {/* Photo & Name Wrapper for Mobile Layout */}
            <td className="block md:table-cell md:py-4">
              <div className="flex items-center md:justify-center gap-4 md:gap-0">
                <div className="h-12 w-12 md:h-10 md:w-10 bg-gray-200 rounded-full overflow-hidden shrink-0">
                  <img src={s.pfp|| defaultPfp} alt="" className="h-full w-full object-cover" />
                </div>
                {/* Visible only on mobile inside this cell */}
                <div className="md:hidden">
                  <p className="font-bold text-gray-900">{s.lname}, {s.fname}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">
                    {sliceToOne(s.student.year)}{checkAttendance.block} • {transformFirstVal(s.student.course)}
                  </p>
                </div>
              </div>
            </td>

            <td className="hidden md:table-cell text-center font-medium text-gray-800">{s.lname}, {s.fname}</td>
            <td className="hidden md:table-cell text-center text-gray-500">{sliceToOne(s.student.year)}{checkAttendance.block}</td>
            <td className="hidden md:table-cell text-center text-xs font-bold text-gray-400 uppercase">{transformFirstVal(s.student.course)}</td>
            
            {/* Stats Row for Mobile */}
            <td className="block md:table-cell py-4 md:py-0 border-y border-gray-50 md:border-none my-3 md:my-0">
              <div className="flex md:block justify-around items-center text-center">
                <div className="md:contents">
                   <p className="md:hidden text-[9px] uppercase font-bold text-gray-400">Present</p>
                   <p className="text-lg md:text-base font-semibold text-green-600">
                    {hasCount ? count?.[0]?.present || 0 : 0}
                   </p>
                </div>
                <div className="w-px h-8 bg-gray-100 md:hidden"></div>
                <div className="flex flex-col md:hidden">
                  <p className="block md:hidden text-[9px] uppercase font-bold text-gray-400">Absences</p>
                  <p className="text-lg md:text-base font-semibold text-red-500">
                    {hasCount ? count?.[0]?.absent || 0 : 0}
                  </p>
                </div>
              </div>
            </td>
            
            <td className="hidden md:table-cell text-center font-semibold text-red-500">
              {hasCount ? count?.[0]?.absent || 0 : 0}
            </td>

            {/* Action Buttons */}
            <td className="block md:table-cell md:text-center pt-2 md:pt-0">
              <div className="flex gap-2 w-full">
                {isPresent ? (
                  <span className="flex-1 md:inline-block text-center text-green-600 font-bold px-4 py-2.5 md:py-1 text-sm bg-green-50 rounded-xl md:rounded-lg border border-green-200">
                    ✓ Present
                  </span>
                ) : (
                  <button
                    className={`flex-1 md:inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 md:py-1 rounded-xl md:rounded-lg text-sm font-bold md:font-medium transition active:scale-95
                    ${selectedDate !== today ? "cursor-not-allowed" : "cursor-pointer"}`}
                    disabled={
                      selectedDate !== today
                      ? true : false
                    }
                    onClick={() => newAttendance(s.student._id, {
                        attId: attID?.join() || "",
                        studentIDs,
                        classID: checkAttendance.classID,
                        subjectID: checkAttendance.subID,
                        date: selectedDate,
                        acYear: checkAttendance.acYear,
                        status: "present",
                    })}
                  >
                    Present
                  </button>
                )}
                
                {isAbsent ? (
                  <span className="flex-1 md:inline-block text-center text-red-600 font-bold px-4 py-2.5 md:py-1 text-sm bg-red-50 rounded-xl md:rounded-lg border border-red-200">
                    ✕ Absent
                  </span>
                ) : (
                  <button 
                    className={`flex-1 md:inline-block bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 md:py-1 rounded-xl md:rounded-lg text-sm font-bold md:font-medium transition  active:scale-95
                    ${selectedDate !== today ? "cursor-not-allowed" : "cursor-pointer"}`}
                    disabled={
                      selectedDate !== today
                      ? true : false
                    }
                    onClick={() => newAttendance(s.student._id, {
                        attId: attID?.join() || "",
                        studentIDs,
                        classID: checkAttendance.classID,
                        subjectID: checkAttendance.subID,
                        date: selectedDate,
                        acYear: checkAttendance.acYear,
                        status: "absent",
                    })}
                  >
                    Absent
                  </button>
                )}
              </div>
            </td>
          </tr>
        )
      })}
    </>
  )
}

export default CheckAttendance