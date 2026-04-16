import SummaryCard from "./SummaryCard"
import { SearchBar } from "../controllers/Controllers";
import { useContext, useEffect, useState } from "react";
import subjectContext from "../../context/Subjects/subjectContext";
import { Calendar } from "../schedule/Schedule"
import AttendanceLeaderboard from "../attendance/AttendanceLeaderboard";
import studentContext from "../../context/Students/studentContext";
import classContext from "../../context/Classrooms/classContext";
import attendanceContext from "../../context/Attendance/attendanceContext";
import { useNavigate } from "react-router-dom";
import { TodayClasses } from "../schedule/Schedule";

const TeacherDashboard = () => {
  const { mySubjects } = useContext(subjectContext);
  const { classList } = useContext(classContext);
  const { users } = useContext(studentContext);
  const { attRate } = useContext(attendanceContext);
  const navigate = useNavigate();

  const studentCount = () => {
    return users?.filter(s => s.accountType === "Student").length;
  }

  return (
    <div className="flex flex-col 2xl:flex-row gap-6 w-full p-4 h-full lg:p-12 lg:py-20">
      <div className="flex flex-col gap-4 w-full flex-1 min-w-0">
        <div className="grid grid-cols-2 xl:flex gap-6 w-full">
          <SummaryCard count={mySubjects?.length} name="My Subjects" />
          <SummaryCard count={classList?.length} name="Total Class" />
          <SummaryCard count={studentCount()} name="Total Students" />
          <SummaryCard count={`${attRate || 0}%`} name="Attendance Rate" label="Today" />
        </div>
        <div className="flex items-center justify-between py-4">
          <SearchBar type="student" />
        </div>
        <div className="shadow-[0px_0px_4px_rgba(0,0,0,0.25)] rounded-xl h-auto overflow-hidden overflow-y-scroll">
          <AttendanceLeaderboard />
        </div>
      </div>
      <div className="flex flex-col justify-between shadow-[0px_0px_4px_rgba(0,0,0,0.25)] rounded-xl bg-white p-2 md:p-6 w-full 2xl:w-80 min-h-75 overflow-hidden overflow-y-auto">
        <div className="flex flex-col">
          <div className="px-4 md:px-6 py-4 border-b border-gray-100">
            <h2 className="flex flex-col gap-2 text-lg font-bold text-gray-800">
              <span className="text-[12px] font-medium text-gray-600 w-max border-b border-green-500 px-2">
                {new Date().toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  weekday: 'long',
                  year: 'numeric'
                })}
              </span>
              Today's Classes
            </h2>
          </div>
          <div className="flex flex-col gap-4 p-2">
            <TodayClasses />
          </div>
        </div>
        <button 
          onClick={() => navigate("/schedule")}
          className="w-full mt-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl shadow-sm hover:bg-gray-800 active:scale-[0.98] transition-all cursor-pointer"
        >
          View All Schedule
        </button>
      </div>

    </div>
  )
}

export default TeacherDashboard