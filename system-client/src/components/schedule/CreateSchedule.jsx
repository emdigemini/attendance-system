import { useContext } from "react";
import scheduleContext from "../../context/Shedule/scheduleContext";
import subjectContext from "../../context/Subjects/subjectContext";
import { sliceToOne, transformFirstVal } from "../../lib/utils";
import { X } from 'lucide-react';

const CreateSchedule = ({ setIsCreateOpen }) => {
  const { mySubjects, getClassForSubject, classView } = useContext(subjectContext); 
  const { formData, setFormData, newSchedule } = useContext(scheduleContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    newSchedule();
    setIsCreateOpen(false);
  };

  const toTimestamp = (val) => {
    const [ hours, secs  ] = val.split(":").map(Number);

    const dateObj = new Date();
    return dateObj.setHours(hours, secs, 0, 0);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity"
        onClick={() => setIsCreateOpen(false)}
      ></div>

      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 md:p-8 animate-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Add New Class</h3>
          <button onClick={() => setIsCreateOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Date?
            </label>
            <select 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            >
              <option value="">Select Date</option>
              <option value={1}>Monday</option>
              <option value={2}>Tuesday</option>
              <option value={3}>Wednesday</option>
              <option value={4}>Thursday</option>
              <option value={5}>Friday</option>
              <option value={6}>Saturday</option>
              <option value={0}>Sunday</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Subject?
            </label>
            <select 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
              value={formData.subject_id}
              onChange={(e) => {
                getClassForSubject(e.target.value, )
                setFormData({...formData, subject_id: e.target.value});
              }}
            >
              <option value="">Select Subject</option>
              {mySubjects?.map(s => {
                return (
                  <option key={s._id} value={s._id}>{s.name} - {s.sem}</option>
                )
              })
              }
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Class?
            </label>
            <select 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
              value={formData.class_id}
              onChange={(e) => setFormData({...formData, class_id: e.target.value})}
            >
              <option value="">Select Class</option>
              {classView?.map(c => {
                return (
                  <option key={c._id} value={c._id}>{sliceToOne(c.year)}{c.block} - {transformFirstVal(c.course)}</option>
                )
              })
              } {classView?.length === 0 && (
                <option value="">
                  No Class List Found.
                </option>
              )}
            </select>
          </div>

          <div className="flex gap-4">
            <div className="relative flex flex-col gap-0.5 w-full">
              <p>Select time sched:</p>
              <div className="flex justify-between gap-2 items-center">
                <label htmlFor="timeFrom">from</label>
                <input type="time" 
                className="p-2 rounded-lg border border-gray-300 bg-white 
              hover:bg-gray-100 flex items-center justify-between focus:outline-none select-none w-full"
                id="timeFrom"
                onChange={(e) => setFormData(prev => ({...prev, timeFrom: toTimestamp(e.target.value)}))}/>
                <label htmlFor="timeTo">to</label>
                <input type="time" className="p-2 rounded-lg border border-gray-300 bg-white 
              hover:bg-gray-100 flex items-center justify-between focus:outline-none select-none w-full"
              id="timeTo"
              onChange={(e) => setFormData(prev => ({...prev, timeTo: toTimestamp(e.target.value)}))}/>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold cursor-pointer hover:bg-gray-800 active:scale-[0.98] transition-all"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateSchedule