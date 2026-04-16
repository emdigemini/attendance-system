import { useContext, useState } from "react";
import classContext from "../../context/Classrooms/classContext.jsx"
import { SearchBar } from "../controllers/Controllers";
import Dropdown from "../Dropdown.jsx";
import ClassList from "./ClassList.jsx";
import StudentPreview from "../subjects/StudentPreview.jsx";
/* Icons */
import { FaPlus } from "react-icons/fa6";
import { FiRefreshCcw } from "react-icons/fi";
/* Utility */
import { transformFirstVal } from "../../lib/utils.js";

const Classrooms = () => {
  const { studentPrev, setStudentPrev } = useContext(classContext);
  const [ classPrev, setClassPrev ] = useState(false);
  const [ classId, setClassId ] = useState("");

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="border border-gray-300"></div>
      <div className="flex flex-1 overflow-hidden">
        <ClassList setClassPrev={setClassPrev} setClassId={setClassId} />
        {studentPrev && <StudentPreview setStudentPrev={setStudentPrev} setClassPrev={setClassPrev} />}
      </div>
    </div>
  )
}

const Header = () => {
  return (
    <header className="flex flex-col md:flex-row justify-between p-4 md:p-8 pt-10 md:pt-12 pb-6 md:pb-8 gap-6 md:gap-0">
      
      <div className="flex flex-col gap-2 md:gap-4">
        <h1 className="font-bold text-2xl md:text-3xl">Class Management</h1>
        <p className="text-xs md:text-sm text-black/60">
          View and manage all added classes in the system.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 md:gap-6 md:mr-12.5">
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div 
            className="cursor-pointer hover:bg-gray-500/25 p-2.5 rounded-full border md:border-none border-gray-200"
            onClick={() => window.location.reload()}
          >
            <FiRefreshCcw size={18}/>
          </div>
          
          <div className="flex-1 md:flex-none">
            <SearchBar type="class" />
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="flex-1 md:flex-none">
            <Dropdown type="filter" dropdownType={{acYear: ["26/27", "25/26"]}} />
          </div>
          <div className="flex-1 md:flex-none">
            <Dropdown type="filter" dropdownType={{year: ["1st Year", "2nd Year", "3rd Year", "4th Year"]}} />
          </div>
        </div>

      </div>
    </header>
  )
}

export default Classrooms