import { useContext } from "react"
import SummaryCard from "./SummaryCard"
import studentContext from "../../context/Students/studentContext"
import { Calendar, TodayClasses } from "../schedule/Schedule"
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const { student } = useContext(studentContext);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full p-4 h-full lg:p-12 lg:py-20">
      
      <div className="flex flex-col gap-6 w-full flex-1 min-w-0">
        <div className="flex gap-2 md:grid-cols-3 md:grid md:gap-6 w-full">
          <SummaryCard count={student?.mySubject?.length} name="My Subjects" color="yellow" />
          <SummaryCard count={student?.present} name="MY Present" color="green" />
          <SummaryCard count={student?.absent} name="MY Absent" color="red" />
        </div>

        <div className="relative shadow-[0px_0px_4px_rgba(0,0,0,0.25)] rounded-xl h-auto p-4 bg-white">
          <Calendar dashboard={true} />
        </div>
      </div>

      <div className="flex flex-col justify-between shadow-[0px_0px_4px_rgba(0,0,0,0.25)] rounded-xl bg-white p-6 w-full xl:w-80 min-h-75 overflow-hidden overflow-y-auto">
        <div className="flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100">
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
  );
};

export default StudentDashboard