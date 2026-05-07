import attendanceContext from "../../context/Attendance/attendanceContext";
import subjectContext from "../../context/Subjects/subjectContext";
import defaultPfp from "../../../../images/placeholder-user.webp";
import Loading from "../Loading";
import { TbSortAscendingNumbers, TbSortDescendingNumbers, TbSortAscendingLetters, TbSortDescendingLetters, TbSortAscendingShapesFilled, TbSortDescendingShapesFilled } from "react-icons/tb";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { sliceToOne, transformFirstVal } from "../../lib/utils";

const AttendanceLeaderboard = () => {
  const { attLeaderboardFilter, setAttLeaderboardFilter } = useContext(attendanceContext);
  const [ ascendSortName, setAscendSortName ] = useState(false);
  const [ ascendSortYear, setAscendSortYear ] = useState(false);
  const [ ascendSortCourse, setAscendSortCourse ] = useState(false);
  const [ ascendSortAbsent, setAscendSortAbsent ] = useState(false);

  const ascendFilter = (val) => {
    if(val === "name"){
      setAscendSortName(prev => !prev);
      if (ascendSortName) {
        const ascendResults = attLeaderboardFilter.sort((a, b) => a.lname.localeCompare(b.lname));
        setAttLeaderboardFilter(ascendResults);
      } else {
        const ascendResults = attLeaderboardFilter.sort((a, b) => b.lname.localeCompare(a.lname));
        setAttLeaderboardFilter(ascendResults);
      }
    } 
    else if(val === "year"){
      setAscendSortYear(prev => !prev);
      if (ascendSortYear) {
        const ascendResults = attLeaderboardFilter.sort((a, b) => Number(sliceToOne(a.student.year)) - Number(sliceToOne(b.student.year)));
        setAttLeaderboardFilter(ascendResults);
      } else {
        const ascendResults = attLeaderboardFilter.sort((a, b) => Number(sliceToOne(b.student.year)) - Number(sliceToOne(a.student.year)));
        setAttLeaderboardFilter(ascendResults);
      }
    }
    else if(val === "course"){
      setAscendSortCourse(prev => !prev);
      if (ascendSortCourse) {
        const ascendResults = attLeaderboardFilter.sort((a, b) => a.student.course.localeCompare(b.student.course));
        setAttLeaderboardFilter(ascendResults);
      } else {
        const ascendResults = attLeaderboardFilter.sort((a, b) => b.student.course.localeCompare(a.student.course));
        setAttLeaderboardFilter(ascendResults);
      }
    }
    else if(val === "absent"){
      setAscendSortAbsent(prev => !prev);
      if (ascendSortAbsent) {
         const ascendResults = attLeaderboardFilter.sort((a, b) => b.student.absent - a.student.absent);
        setAttLeaderboardFilter(ascendResults);
      } else {
       
        const ascendResults = attLeaderboardFilter.sort((a, b) => a.student.absent - b.student.absent);
        setAttLeaderboardFilter(ascendResults);
      }
    }
  }

  return (
    <table className="min-w-full block md:table">
      <thead className="hidden md:table-header-group bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="text-center px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Photo</th>
          <th className="text-center px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-default">
            <div className="flex items-center justify-center gap-4">
              <p>Name</p>
              <button className="cursor-pointer hover:bg-black/15"
              onClick={() => ascendFilter("name")}>
                {ascendSortName
                  ? <TbSortDescendingLetters size={16} />
                  : <TbSortAscendingLetters size={16} />
                }
                
              </button>
            </div>
          </th>
          <th className="text-center px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="flex items-center justify-center gap-4">
              <p>Yr/Blk</p>
              <button className="cursor-pointer hover:bg-black/15"
              onClick={() => ascendFilter("year")}>
                {ascendSortYear
                  ? <TbSortDescendingShapesFilled size={16} />
                  : <TbSortAscendingShapesFilled size={16} />
                }
                
              </button>
            </div>
          </th>
          <th className="text-center px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="flex items-center justify-center gap-4">
              <p>Course</p>
              <button className="cursor-pointer hover:bg-black/15"
              onClick={() => ascendFilter("course")}>
                {ascendSortYear
                  ? <TbSortDescendingShapesFilled size={16} />
                  : <TbSortAscendingShapesFilled size={16} />
                }
                
              </button>
            </div>
          </th>
          <th className="text-center px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="flex items-center justify-center gap-4">
              <p>Total Absences</p>
              <button className="cursor-pointer hover:bg-black/15"
              onClick={() => ascendFilter("absent")}>
                {ascendSortAbsent
                  ? <TbSortDescendingNumbers size={16} />
                  : <TbSortAscendingNumbers size={16} />
                }
                
              </button>
            </div>
          </th>
          <th className="text-center px-4 py-4 text-green-500"></th>
        </tr>
      </thead>
      <tbody className="block md:table-row-group space-y-4 md:space-y-0">
        <StudentList />
      </tbody>
    </table>
  )
}

const StudentList = () => {
  const { attLeaderboardFilter, newAttendance, fetchAttendanceLeaderboard, attResults, attCount, selectedDate, loading } = useContext(attendanceContext);
  const { checkAttendance } = useContext(subjectContext);

  useEffect(() => {
    fetchAttendanceLeaderboard()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <tr><td className="p-10 text-center"><Loading val="students" /></td></tr>;
  if (attLeaderboardFilter?.length === 0) return <tr><td className="p-10 text-center text-gray-500 italic">No students found.</td></tr>;

  return (
    <>
      {attLeaderboardFilter?.map((s, idx) => {

        return (
          <tr key={s._id} className="block md:table-row bg-white md:bg-transparent border border-gray-200 md:border-b md:border-gray-100 rounded-2xl md:rounded-none p-4 md:p-0 hover:bg-gray-50 transition-colors">
            
            {/* Photo & Name Wrapper for Mobile Layout */}
            <td className="block md:table-cell md:py-4">
              <div className="relative flex items-center md:justify-center gap-4 md:gap-0">
                
                <div className="
                  absolute left-4 -top-3 text-gray-400 text-[8px] font-mono font-bold
                  md:absolute md:left-0 md:text-[10px] md:bottom-0 md:font-normal
                ">
                  #{String(idx + 1).padStart(2, '0')}
                </div>

                {/* Avatar */}
                <div className="h-12 w-12 md:h-10 md:w-10 bg-gray-200 rounded-full overflow-hidden shrink-0 shadow-sm border border-gray-100">
                  <img src={s.pfp || defaultPfp} alt="" className="h-full w-full object-cover" />
                </div>

                {/* Visible only on mobile */}
                <div className="md:hidden flex-1">
                  <p className="font-bold text-gray-900 leading-tight">{s.lname}, {s.fname}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight mt-0.5">
                    {s?.student?.year || 'N/A'} | {s?.student?.course ? transformFirstVal(s?.student?.course) : 'N/A'}
                  </p>
                </div>
                <div className="flex md:block justify-around items-center text-center">
                  <div className="flex flex-col md:hidden">
                    <p className="block md:hidden text-[9px] uppercase font-bold text-gray-400">Absences</p>
                    <p className="text-lg md:text-base font-semibold text-red-500">
                      {s?.student?.absent || 0}
                    </p>
                  </div>
                </div>
              </div>
            </td>

            <td className="hidden md:table-cell text-center font-medium text-gray-800">{s.lname}, {s.fname}</td>
            <td className="hidden md:table-cell text-center uppercase text-gray-500">{s?.student?.year || null}</td>
            <td className="hidden md:table-cell text-center text-xs font-bold text-gray-400 uppercase">
              {s?.student?.course 
                ? transformFirstVal(s?.student?.course)
                : null
              }
            </td>
            
            <td className="hidden md:table-cell text-center font-semibold text-red-500">
              {s?.student?.absent || 0}
            </td>

          </tr>
        )
      })}
    </>
  )
}

export default AttendanceLeaderboard;