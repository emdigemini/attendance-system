import { useState, useMemo, useContext } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FaRegCalendarPlus } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa";
import { LuCalendarCog } from "react-icons/lu";
import authContext from '../../context/authContext';
import scheduleContext from '../../context/Shedule/scheduleContext';
import CreateSchedule from './CreateSchedule';
import ScheduleManagement from './ScheduleManagement';
import { transformTimezone } from '../../lib/utils';

export const ClassSchedule = () => {
  const { user, authorization } = useContext(authContext);
  const [ isCreateOpen, setIsCreateOpen ] = useState(false);
  const [ isManageOpen, setIsManageOpen ] = useState(false);
  
  return (
    <div id="schedule" className="w-full animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end p-4 md:p-8 pt-8 md:pt-12 gap-4">
        <div className='flex flex-col gap-2'>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Schedule</h2>
          <p className="text-gray-500 text-sm">View and manage your weekly classes</p>
        </div>
        {authorization === 2 && (
          <div className='flex gap-4'>
            <ManageSchedule setIsManageOpen={setIsManageOpen} />
            <AddSchedule setIsCreateOpen={setIsCreateOpen} />
          </div>
        )}
      </div>

      <div className="border-b border-gray-200"></div>

      <div className="bg-white rounded-xl border-x-0 md:border md:mt-8 md:mx-8 border-gray-200 p-4 md:p-10 shadow-sm">
        <Calendar />
      </div>
      {isCreateOpen && (
        <CreateSchedule setIsCreateOpen={setIsCreateOpen} />
      )}
      {isManageOpen && (
        <ScheduleManagement setIsManageOpen={setIsManageOpen} setIsCreateOpen={setIsCreateOpen} />
      )}
    </div>
  );
};

const AddSchedule = ({ setIsCreateOpen }) => {
  return (
    <button className="flex items-center justify-center gap-2 px-4 py-3 md:px-5 md:py-4 bg-green-700 w-full md:w-max hover:bg-green-800 text-white font-medium rounded-xl transition-all active:scale-95 cursor-pointer"
    onClick={() => setIsCreateOpen(true)}>
      <FaRegCalendarPlus size={18} />
      <span>Add Schedule</span>
    </button>
  )
}

const ManageSchedule = ({ setIsManageOpen }) => {
  return (
    <button className="flex items-center justify-center gap-2 px-4 py-3 md:px-5 md:py-4 bg-gray-900 w-full md:w-max hover:bg-gray-800 text-white font-medium rounded-xl transition-all active:scale-95 cursor-pointer"
    onClick={() => setIsManageOpen(true)}>
      <LuCalendarCog size={18} />
      <span>Manage Schedule</span>
    </button>
  )
}

export const Calendar = ({ dashboard }) => {
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const navMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  return (
    <>
        <TopNavigation dashboard={dashboard} currentDate={currentDate} monthName={monthName} navMonth={navMonth} />

        <CalendarGrid currentDate={currentDate} />
      <div className="mt-10 pt-5 border-t border-gray-300 flex gap-5 text-xs font-medium">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Classes
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div> Today
        </div>
      </div>
    </>
  )
}

const TopNavigation = ({ dashboard, currentDate, monthName, navMonth }) => {
  return (
    <div className="flex flex-col gap-6 mb-8">
        {!dashboard
          && (
            <div className="flex justify-between items-center">
              <h3 className="text-lg md:text-2xl font-bold">Class Schedule</h3>
              <div className="text-xl md:text-2xl font-black text-gray-400">{currentDate.getFullYear()}</div>
            </div>
          )
        }

      {dashboard &&
        <div className="text-xl md:text-2xl font-black text-gray-400">  
          {new Date().toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
        }

        {!dashboard 
          && (
            <div className="flex items-center justify-center gap-6 bg-gray-50 py-2 rounded-lg">
                <button 
                  onClick={() => navMonth(-1)}
                  className="p-2 hover:bg-gray-200 rounded-full cursor-pointer transition-colors bg-white shadow-sm md:shadow-none"
                >
                  <ChevronLeft size={20} />
                </button>

                <span className="min-w-30 text-center font-bold text-lg md:text-xl uppercase tracking-wider">
                  {monthName}
                </span>
              
                <button 
                  onClick={() => navMonth(1)}
                  className="p-2 hover:bg-gray-200 rounded-full cursor-pointer transition-colors bg-white shadow-sm md:shadow-none"
                >
                  <ChevronRight size={20} />
                </button>
            </div>
          )}
    </div>
  )
}
export const CalendarGrid = ({ currentDate }) => {
  const { mySched } = useContext(scheduleContext);
  const [ viewSub, setViewSub ] = useState(null);
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, key: `empty-${i}` });
    }

    for (let d = 1; d <= totalDays; d++) {
      const current = new Date(year, month, d);
      current.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isToday = current.getTime() === today.getTime();
      const isPast = current.getTime() < today.getTime();

      const dayOfWeek = current.getDay();

      const checkIfHasClass = mySched?.some(s => s.date === dayOfWeek);
      const subPerClass = mySched?.filter(s => s.date === dayOfWeek);

      const hasClass = checkIfHasClass && !isPast;

      days.push({
        day: d,
        isToday,
        hasClass,
        subPerClass,
        key: `day-${d}`
      });
    }

    return days;
  }, [currentDate, mySched]);

  function isoToMinutes(isoString) {
    const date = new Date(isoString);

    return date.getHours() * 60 + date.getMinutes();
  }

  function getCurrentMinutes() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }

  return (
    <div className="grid grid-cols-7 text-center gap-y-6 md:gap-y-10">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="text-gray-400 font-bold text-[10px] md:text-sm uppercase">
          <span className="hidden md:inline">{day}</span>
          <span className="md:hidden">{day.charAt(0)}</span>
        </div>
      ))}
      
      {calendarDays.map((item) => {

        return (
          <div 
            key={item.key} 
            className={`relative py-3 md:py-4 font-semibold text-sm transition-all rounded-lg
              ${item.hasClass ? "group" : ""}
              ${item.isToday ? "text-green-600 bg-green-100" : "text-gray-800"}
              ${item.isToday && item.day ? "hover:bg-green-200 cursor-pointer" : ""}
              ${item.day ? "hover:bg-gray-50 cursor-pointer" : ""}
            `}
            onClick={(e) => {
              if(Number(e.target.textContent) !== item.day)
                return;
              setViewSub(item);
            }}
            onMouseEnter={(e) => {
              if(Number(e.target.textContent) !== item.day)
                return;
              setViewSub(item);
            }}
            onMouseLeave={() => setViewSub(null)}
          >
            {item.day}
            
            {/* Subject List */}
            {item.hasClass && viewSub?.day === item.day
              && 
            <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 mb-2 z-30 
              w-[35vw] max-w-55 p-3 rounded-xl border border-gray-100 
              bg-white/95 backdrop-blur-md shadow-2xl transition-all"
              >
              
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-b border-r border-gray-100"></div>
              
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 text-left">
                Your Schedule
              </p>
              
              <div className="max-h-40 overflow-y-auto pr-1 space-y-3 custom-scrollbar text-left">
                {viewSub?.subPerClass?.length === 0 && <p className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-800 leading-tight">No schedule for this date.</p>}
                {viewSub?.subPerClass?.map(s => {
                  const isFinish = getCurrentMinutes() > isoToMinutes(s.timeTo);

                  return (
                    <div 
                    className={`flex flex-col border-l-2 border-green-500 pl-3
                      ${isFinish 
                        ? "bg-transparent border-gray-200 opacity-30" 
                        : "bg-white border-green-500 shadow-sm hover:bg-green-50"
                      }`} 
                    key={s._id}>
                      <span className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-800 leading-tight">
                        {s.subject_id.name}
                        <span className='text-[10px] font-medium text-gray-500'>({s?.class_name} - {s.subject_id.room})</span>
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {transformTimezone(s.timeFrom)} - {transformTimezone(s.timeTo)}
                      </span>
                    </div> 
                  )
                })}
              </div>
            </div>
            }

            {/* Status Dots */}
            <div className="absolute bottom-1 md:bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {item.hasClass && <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-yellow-500 animate-pulse" />}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const TodayClasses = () => {
  const { todaySched } = useContext(scheduleContext);

  function isoToMinutes(isoString) {
    const date = new Date(isoString);

    return date.getHours() * 60 + date.getMinutes();
  }

  function getCurrentMinutes() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }

  return (
    <>
      {todaySched?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <div className="bg-green-100 p-3 rounded-full mb-3">
            <FaRegCalendarCheck className='text-green-600' />
          </div>
          <p className="text-gray-500 font-medium">No classes scheduled for today.</p>
          <p className="text-gray-400 text-sm">Enjoy your free time!</p>
        </div>
      )}
      {todaySched?.map(s => {
        const isFinish = getCurrentMinutes() > isoToMinutes(s.timeTo);

        return (
          <div 
            key={s._id} 
            className={`flex justify-between items-center w-full p-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl
            ${isFinish 
              ? "bg-transparent border-gray-200 opacity-30" 
              : "bg-white border-green-500 shadow-sm hover:bg-green-50"
            }`}
          >
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {transformTimezone(s.timeFrom)} – {transformTimezone(s.timeTo)}
              </p>
              
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {s.subject_id.name}
              </h3>
              
              <span className="text-sm text-gray-600">
                {s.class_name}
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="px-3 py-1 text-sm font-semibold text-green-700 bg-blue-50 rounded-full border border-blue-100">
                {s.subject_id.room}
              </span>
            </div>
          </div>
        )
      })}
    </>
  )
}