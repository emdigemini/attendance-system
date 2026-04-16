import { useContext, useState } from "react";
import classContext from "../../context/classManagement/ClassContext";
import { SearchBar } from "../controllers/Controllers";
import Dropdown from "../Dropdown";
import ClassList from "./ClassList.jsx";
/* Icons */
import { FaPlus } from "react-icons/fa6";
import { FiRefreshCcw } from "react-icons/fi";
/* Utility */
import { transformFirstVal } from "../../lib/utils.js";

const ClassManagement = () => {
  const [classPrev, setClassPrev] = useState(false);
  const [classId, setClassId] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F4F4]">
      <Header />
      <div className="border border-black/10"></div>
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden relative">
        {/* Main List Area */}
        <div className={`flex-1 overflow-y-auto ${classPrev ? 'hidden lg:block' : 'block'}`}>
          <ClassList setClassPrev={setClassPrev} setClassId={setClassId} />
        </div>
        
        {/* Responsive Preview Panel */}
        {classPrev && (
          <ClassPreview classId={classId} setClassPrev={setClassPrev} />
        )}
      </div>
    </div>
  )
}

const Header = () => {
  const { setNewClass } = useContext(classContext);

  return (
    <header className="flex flex-col md:flex-row justify-between p-6 md:p-8 gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-2xl md:text-3xl">Class Management</h1>
        <p className="text-sm text-black/60">View and manage all added classes in the system.</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 md:self-end">
        <div className="cursor-pointer hover:bg-gray-500/10 p-2 rounded-full transition-colors"
             onClick={() => window.location.reload()}>
          <FiRefreshCcw size={18}/>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-300 hover:bg-yellow-400 active:scale-95 transition-all font-medium shadow-sm cursor-pointer"
                onClick={() => setNewClass(true)}>
          <span className="hidden sm:inline">Add Class</span>
          <FaPlus size={14} />
        </button>

        <SearchBar />

        <div className="flex flex-wrap gap-2">
          <Dropdown type="filter" dropdownType={{acYear: ["26/27", "25/26"]}} />
          <Dropdown type="filter" dropdownType={{year: ["1st Year", "2nd Year", "3rd Year", "4th Year"]}} />
          <Dropdown type="filter" dropdownType={{sem: ["1st sem", "2nd sem"]}} />
        </div>
      </div>
    </header>
  )
}

const ClassPreview = ({ classId, setClassPrev }) => {
  const { classList, classStudents } = useContext(classContext);
  const viewClass = classList.find((classes) => classes._id === classId);

  if (!viewClass) return null;

  return (
    // Mobile: Full screen fixed | Desktop: 1/3 width sidebar
    <div className="fixed inset-0 z-40 lg:relative lg:inset-auto lg:w-1/3 bg-white border-l border-black/10 flex flex-col h-full">
      <header className="flex justify-between items-start bg-[#c43c2d] text-white px-6 py-5 shadow-sm">
        <div>
          <div className="flex gap-4 text-white/90 text-xs font-medium uppercase tracking-wider">
            <p>{transformFirstVal(viewClass.course)} - {viewClass.sem}</p>
            <p>{viewClass.acYear}</p>
          </div>
          <h3 className="text-xl font-bold mt-1">
            {transformFirstVal(viewClass.year)} YR - BLK {viewClass.block}
          </h3>
        </div>
        <button className="p-2 hover:bg-white/20 rounded-full transition cursor-pointer"
                onClick={() => setClassPrev(false)}>✕</button>
      </header>
      
      <main className="flex flex-col flex-1 bg-[#f6f7f9] p-4 overflow-hidden">
        <div className="mb-4">
          <SearchBar type="account" />
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto pb-10">
          {classStudents?.length === 0 ? (
            <p className="text-center py-10 text-gray-400 italic">No students found.</p>
          ) : (
            classStudents?.map((c, index) => (
              <StudentCard key={index} c={c} count={index+1} />
            ))
          )}
        </div>
      </main>
    </div>
  )
}
const StudentCard = ({ c, count }) => {
  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl shadow-sm
    border border-gray-100 hover:shadow-md transition relative">
      <p className="absolute bottom-2 left-2 text-[11px] text-gray-500">{count}</p>
      <div className="flex pl-2 items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-fullbg-[#c43c2d]/10 text-[#c43c2d]">
          <StudentIcon />
        </div>

        <p className="font-medium text-gray-800">
          {c.lname}, {c.fname}
        </p>
      </div>
      <p className="text-gray-500">{c.student.studentType}</p>
    </div>
  );
};

const StudentIcon = () => {
  return (
    <div className="p-2 bg-yellow-400 rounded-4xl">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
        <path fill="#404040" stroke="#404040" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M24 20a7 7 0 1 0 0-14a7 7 0 0 0 0 14M6 40.8V42h36v-1.2c0-4.48 0-6.72-.872-8.432a8 8 0 0 0-3.496-3.496C35.92 28 33.68 28 29.2 28H18.8c-4.48 0-6.72 0-8.432.872a8 8 0 0 0-3.496 3.496C6 34.08 6 36.32 6 40.8" />
      </svg>
    </div>
  )
}

export default ClassManagement