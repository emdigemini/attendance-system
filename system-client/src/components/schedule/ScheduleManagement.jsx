import { useContext } from "react";
import scheduleContext from "../../context/Shedule/scheduleContext";
import { BiSolidCalendarEdit } from "react-icons/bi";
import { PiCalendarXFill } from "react-icons/pi";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { AlertTriangle, X } from 'lucide-react';
import { useState } from "react";
import { transformTimezone } from "../../lib/utils";

const ScheduleManagement = ({ setIsManageOpen, setIsCreateOpen }) => {
  const { mySched, editSchedule, deleteSchedule } = useContext(scheduleContext);
  const [ edit, setEdit ] = useState(false);
  const [ deleteConfirm, setDeleteConfirm ] = useState(false);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const toTimestamp = (val) => {
    const [ hours, secs  ] = val.split(":").map(Number);

    const dateObj = new Date();
    return dateObj.setHours(hours, secs, 0, 0);
  }

  const toTimeInputValue = (timestamp) => {
    const date = new Date(timestamp);

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  const openEdit = ({ subName, subId, date, schedId, timeFrom, timeTo }) => {
    setEdit({ subName, subId, date, schedId, timeFrom, timeTo });
  }

  const saveEdit = () => {
    editSchedule({
      subject_id: edit.subId,
      date: edit.date,
      schedId: edit.schedId,
      timeFrom: edit.timeFrom,
      timeTo: edit.timeTo,
    })
    setEdit(false);
  }

  return (
    <div className="fixed inset-0 z-50 p-6 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity"
        onClick={() => setIsManageOpen(false)}
      ></div>
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 md:p-8 animate-in zoom-in duration-200 z-2">
        {deleteConfirm && (
          <DeleteConfirmation 
            isOpen={deleteConfirm} 
            onClose={() => setDeleteConfirm(false)} 
            onConfirm={() => {
              deleteSchedule(deleteConfirm.id);
              setDeleteConfirm(false)
            }} 
            subjectName={deleteConfirm.subName} 
            class_name={deleteConfirm.class_name} 
            day={days[deleteConfirm.date]} 
            timeFrom={deleteConfirm.timeFrom}
            timeTo={deleteConfirm.timeTo}
          />
        )}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Manage Your Schedule</h2>
          <button onClick={() => setIsManageOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-3">
          {mySched?.length === 0 && (
            <div className="flex flex-col items-center justify-center p-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl mt-4">

              <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                <svg 
                  className="w-8 h-8 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="box-archive" /> 
                  <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-700">No schedule yet</h3>
              <p className="text-gray-500 text-sm text-center max-w-65">
                It looks like your calendar is empty. Start adding your subjects!
              </p>

              <button className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 underline underline-offset-4 cursor-pointer"
              onClick={() => {
                setIsManageOpen(false);
                setIsCreateOpen(true);
              }}>
                + Add New Schedule
              </button>
            </div>
          )}
          {mySched?.map((sched) => {
            return (
              <div 
                key={sched._id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col items-start gap-2 text-gray-800 font-medium">
                  <div className="flex items-start md:items-center flex-col md:flex-row">
                    <span>{sched.subject_id.name} ({sched.class_name})</span>
                    <span className="mx-2 text-gray-400 hidden md:block">-</span>
                    {edit.schedId === sched._id
                      ? (
                        <select 
                          required
                          className="w-max h-max px-4 py-1 rounded-lg border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                          value={edit.date}
                          onChange={(e) => setEdit({...edit, date: e.target.value})}
                        >
                          <option value={null}>Select Date</option>
                          <option value={1}>Monday</option>
                          <option value={2}>Tuesday</option>
                          <option value={3}>Wednesday</option>
                          <option value={4}>Thursday</option>
                          <option value={5}>Friday</option>
                          <option value={6}>Saturday</option>
                          <option value={0}>Sunday</option>
                        </select>
                      )
                      : <span className="text-gray-600">{days[sched.date]}</span>}
                    </div>
                    <div>
                      {edit.schedId === sched._id
                        ? (
                          <div className="flex flex-col md:justify-between gap-2 items-start md:items-center md:flex-row">
                            <label htmlFor="timeFrom" className="text-xs">from</label>
                            <input type="time" 
                            className="p-2 rounded-lg text-xs border border-gray-300 bg-white 
                            hover:bg-gray-100 flex items-center justify-between focus:outline-none select-none w-full"
                            id="timeFrom" value={toTimeInputValue(edit.timeFrom)}
                            onChange={(e) => setEdit(prev => ({...prev, timeFrom: toTimestamp(e.target.value)}))}/>
                            <label htmlFor="timeTo" className="text-xs">to</label>
                            <input type="time" className="p-2 rounded-lg text-xs border border-gray-300 bg-white 
                            hover:bg-gray-100 flex items-center justify-between focus:outline-none select-none w-full"
                            id="timeTo" value={toTimeInputValue(edit.timeTo)}
                            onChange={(e) => setEdit(prev => ({...prev, timeTo: toTimestamp(e.target.value)}))}/>
                          </div>
                        )
                        : (
                        <span className="text-xs">
                          {transformTimezone(sched.timeFrom)} - {transformTimezone(sched.timeTo)}
                        </span>
                        )
                      }
                    </div>
                </div>

                <div className="flex gap-3 flex-col md:flex-row">
                  {edit.schedId === sched._id
                    ? (
                      <button 
                        className="bg-green-700 text-white py-2 px-3 rounded-lg hover:bg-green-800 text-sm font-semibold flex items-center gap-1 cursor-pointer"
                        onClick={() => saveEdit()}
                      >
                        <FaRegCalendarCheck size={16} /> Save
                      </button>
                    )
                    : (
                      <button 
                        className="bg-blue-900 text-white py-2 px-3 rounded-lg hover:bg-blue-800 text-sm font-semibold flex items-center gap-1 cursor-pointer"
                        onClick={() => openEdit({
                          subName: sched.subject_id.name,
                          subId: sched.subject_id._id,
                          date: sched.date,
                          schedId: sched._id,
                          timeFrom: sched.timeFrom,
                          timeTo: sched.timeTo,
                        })}
                      >
                        <BiSolidCalendarEdit size={16} /> Edit
                      </button>
                    )}
                  <button 
                    className="bg-red-800 text-white py-2 px-3 rounded-lg hover:bg-red-900 text-sm font-semibold flex items-center gap-1 cursor-pointer"
                    onClick={() => setDeleteConfirm({
                      id: sched._id,
                      subName: sched.subject_id.name,
                      date: sched.date,
                      class_name: sched.class_name,
                      timeFrom: sched.timeFrom,
                      timeTo: sched.timeTo,
                    })}
                  >
                    <PiCalendarXFill size={16} /> Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, subjectName, class_name, day, timeFrom, timeTo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">

      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Confirm Delete</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500 cursor-pointer" />
          </button>
        </div>

        <div className="p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <p className="text-gray-600 text-lg leading-relaxed">
            Are you sure you want to delete <br />
            <span className="flex flex-col items-center">
              <span className="font-bold text-gray-900 underline decoration-red-200">
                {subjectName} ({class_name}) - {day}
              </span>
              <span className="text-sm">{transformTimezone(timeFrom)} - {transformTimezone(timeTo)}</span>
            </span>
          </p>
          <p className="mt-2 text-sm text-gray-400">This action cannot be undone.</p>
        </div>

        <div className="flex gap-3 p-4 bg-gray-50 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 active:bg-red-800 shadow-sm shadow-red-200 transition-all cursor-pointer"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement