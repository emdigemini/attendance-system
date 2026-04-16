/* hooks */
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

/* components */
import Dropdown from "../Dropdown";
import { SearchBar } from "../controllers/Controllers";
import CheckAttendance from "./CheckAttendance";
import { transformFirstVal } from "../../lib/utils.js";

/* context */
import subjectContext from "../../context/Subjects/subjectContext";
import attendanceContext from "../../context/Attendance/attendanceContext.jsx";

/* icons */
import { ChessKing, ChevronDown, ChevronUp } from 'lucide-react';
import { FiRefreshCcw } from "react-icons/fi";
import Loading from "../Loading.jsx";
import authContext from "../../context/authContext.jsx";

const Attendance = () => {
  const { checkAttendance } = useContext(subjectContext);

  return (
    <div className="relative h-screen flex flex-col">
      {checkAttendance
        ? <CheckAttendance />
        : <ClassSubject />}
    </div>
  )
}


const Header = () => {
  return (
    <header className="flex flex-col md:flex-row justify-between p-4 sm:p-8 md:pt-12 md:pb-8 gap-6">
      <div className="flex flex-col gap-2 md:gap-4">
        <h1 className="font-bold text-2xl md:text-3xl">Attendance</h1>
        <p className="text-xs md:text-sm text-black/60">Manage attendance for each class.</p>
      </div>
      
      <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6">
        <div 
          className="cursor-pointer hover:bg-gray-500/10 p-2 rounded-full transition-colors"
          onClick={() => window.location.reload()}
        >
          <FiRefreshCcw size={18}/>
        </div>

        {/* Ensure SearchBar has w-full or responsive widths internally */}
        <div className="flex-1 md:flex-none">
          <SearchBar type="att_subject" />
        </div>
      </div>
    </header>
  )
}

const ClassSubject = () => {
  const { user, authorization } = useContext(authContext);
  const { fetchSubForAttendance } = useContext(subjectContext);

  useEffect(() => {
    fetchSubForAttendance(user?.id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorization]);

  return (
    <>
      <Header />
      <div className="border-t border-gray-200 mx-4 md:mx-0"></div>
      {/* Changed px-16 to responsive padding */}
      <div className="flex flex-col py-6 px-4 sm:px-8 md:px-12 lg:px-16 gap-6 overflow-y-auto flex-1">
        <ClassSubjectList />
      </div>
    </>
  )
}

const ClassSubjectList = () => {
  const { setCheckAttendance, attSubjectFilter, isOpen, setIsOpen, loading } = useContext(subjectContext);
  const { fetchStudentsForAttendance } = useContext(attendanceContext);
  const navigate = useNavigate();

  const toggleSubject = (id) => {
    setIsOpen((prev) => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]                   
    );
  };

  if (loading) return <Loading val="subjects"/>;

  return (
    <div className="w-full space-y-4">
      {attSubjectFilter?.length === 0 ? (
        <div className="flex flex-col items-center w-full justify-center p-6 sm:p-12 mt-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
          {/* ... SVG remains the same ... */}
          <h3 className="text-lg font-semibold text-gray-700">No Subjects Found</h3>
          <p className="text-gray-500 text-center max-w-xs mt-2 mb-6 text-sm">
            Please create a new subject or refresh the page to update the list.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button onClick={() => window.location.reload()} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Refresh Page
            </button>
            <button onClick={() => navigate("/subjects")} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
              Create Subject
            </button>
          </div>
        </div>
      ) : (
        attSubjectFilter?.map((sub) => (
          <div className="flex flex-col w-full border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm" key={sub._id}>
            {/* Subject Header */}
            <div 
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSubject(sub._id)}
            >
              <div className="flex flex-col pr-4">
                <h3 className="font-bold text-sm md:text-base text-gray-900 uppercase tracking-wide truncate">
                  {sub.name} - {sub.sem}
                </h3>
                <p className="text-[10px] md:text-xs text-gray-500">{sub.acYear}</p>
              </div>
              <div className="text-gray-400 shrink-0">
                {isOpen.includes(sub._id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>

            <div className={`transition-all duration-300 ease-in-out ${isOpen.includes(sub._id) ? 'max-h-250 border-t border-gray-100' : 'max-h-0'}`}>
              <div className="p-3 md:p-4 bg-gray-50 grid grid-cols-1 lg:grid-cols-2 gap-3">
                {sub?.classes?.map((c) => (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-white border border-gray-100 shadow-sm gap-4" key={c._id}>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {c.year.toUpperCase()} - {transformFirstVal(c.course)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800">Block {c.block}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                      </div>
                    </div>

                    <button 
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2.5 px-5 rounded-md transition-all active:scale-95"
                      onClick={() => {
                        setCheckAttendance({
                          classID: c._id,
                          subID: sub._id,
                          name: sub.name,
                          year: sub.year,
                          course: sub.course,
                          block: c.block,
                          sem: sub.sem,
                          acYear: sub.acYear
                        });
                        fetchStudentsForAttendance(c._id)
                      }}
                    >
                      Check Attendance
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Attendance