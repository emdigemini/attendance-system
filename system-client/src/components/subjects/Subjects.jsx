import { useContext, useEffect, useState } from "react";
/* components */
import { SearchBar } from "../controllers/Controllers.jsx";
import Dropdown from "../Dropdown.jsx";
import SubjectList from "./SubjectList.jsx";
import CreateSubject from "./CreateSubject.jsx";
import StudentPreview from "./StudentPreview.jsx";
import subjectContext from "../../context/Subjects/subjectContext.jsx";
import authContext from "../../context/authContext.jsx";
/* Icons */
import { RiAiGenerate } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { FiRefreshCcw } from "react-icons/fi";
import { FaListAlt } from "react-icons/fa";
/* Utility */
import { sliceToOne, transformFirstVal } from "../../lib/utils.js";
import classContext from "../../context/Classrooms/classContext.jsx";
import Loading from "../Loading.jsx";

const Subjects = () => {
  const { authorization } = useContext(authContext);
  const [ createSubject, setCreateSubject ] = useState(false);
  const {  studentPrev, setStudentPrev, classPrev, setClassPrev } = useContext(classContext);

  return (
    <div className="min-h-screen flex flex-col">
      <Header auth={authorization} setCreateSubject={setCreateSubject} />
      <div className="border border-gray-300"></div>
      <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">
        <SubjectList setClassPrev={setClassPrev} setStudentPrev={setStudentPrev} />
        {createSubject && <CreateSubject setCreateSubject={setCreateSubject} />}
        {classPrev && <ClassPreview setClassPrev={setClassPrev} setStudentPrev={setStudentPrev} />}
        {studentPrev && <StudentPreview setStudentPrev={setStudentPrev} setClassPrev={setClassPrev} />}
      </div>
    </div>
  )
}

const Header = ({ auth, setCreateSubject }) => {

  return (
    <header className="flex flex-col md:flex-row justify-between p-4 md:p-8 md:pt-12 gap-6">
      <div className="flex flex-col gap-2 md:gap-4">
        <h1 className="font-bold text-2xl md:text-3xl">Subjects</h1>
        <p className="text-xs md:text-sm text-black/60">
          {auth === 1 ? "View and organize subjects" : "Manage your teaching subjects"}
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 md:gap-6 md:mr-12.5">
        
        {/* SearchBar width control */}
        <div className="w-full flex gap-2 items-center md:w-auto">
            {auth !== 1 && <AddSubBtn setCreateSubject={setCreateSubject} />}
            <div className="cursor-pointer hover:bg-gray-500/25 p-2 rounded-3xl" onClick={() => window.location.reload()}>
            <FiRefreshCcw size={18}/>
          </div>
          <SearchBar type="subject" />
        </div>

        <div className="flex flex-wrap gap-2 md:gap-5 w-full md:w-auto">
          <Dropdown type="filter-sub" dropdownType={{acYear: ["26/27", "25/26"]}} />
          <Dropdown type="filter-sub" dropdownType={{year: ["1st year", "2nd year", "3rd year", "4th year"]}} />
          <Dropdown type="filter-sub" dropdownType={{sem: ["1st sem", "2nd sem"]}} />
        </div>
      </div>
    </header>
  )
}

const AddSubBtn = ({ setCreateSubject }) => {
  return (
    <button 
      className="flex items-center justify-center gap-2 px-4 py-2 min-w-max md:min-w-37.5 rounded-lg bg-yellow-300 hover:bg-yellow-400 active:scale-95 transition-all duration-200 font-medium shadow-sm cursor-pointer select-none"
      onClick={() => setCreateSubject(true)}
    >
      <span className="hidden md:block">Add Subject</span>
      
      <FaPlus size={16} />
    </button>
  )
}

const ClassPreview = ({ setClassPrev, setStudentPrev }) => {
  const { subInfo, classView, loading } = useContext(subjectContext);

  return (
    <div className="w-full absolute top-0 z-50 h-full md:relative md:w-2/3 border-t md:border-t-0 md:border-l border-gray-200 bg-white">
      <header className="flex justify-between items-start bg-[#c43c2d] text-white px-4 md:px-6 py-4 shadow-sm">
        <div>
          <div className="flex gap-2 text-white text-sm font-medium">
            <p>
              {sliceToOne(subInfo.year)} - {sliceToOne(subInfo.sem)}
            </p>
            <p>|</p>
            <p>{transformFirstVal(subInfo.course)}</p>
            <p>|</p>
            <p>AY {subInfo.acYear}</p>
          </div>

          <h3 className="text-xl font-bold tracking-wide">
            {subInfo.name}
          </h3>
        </div>

        <button className="p-2 rounded-lg text-white/80 hover:bg-white/15
      hover:text-white transition cursor-pointer"
        onClick={() => setClassPrev(false)}>
          ✕
        </button>
      </header>
      <main className="flex flex-col gap-4 bg-[#f6f7f9] min-h-[50vh] h-full p-4">
        <div className="flex flex-col gap-2 overflow-y-auto">
          {loading
            ? <Loading />
            : classView?.map((c, index) => {
              return (
                <div key={c._id}>
                  <ClassCard c={c} count={index+1} setStudentPrev={setStudentPrev} setClassPrev={setClassPrev} />
                </div>
              )
            })
          }
        </div>
      </main>
    </div>
  )
}

const ClassCard = ({ c, count, setStudentPrev, setClassPrev }) => {
  const { fetchStudentsFromClass } = useContext(classContext);

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl shadow-sm
    border border-gray-100 hover:shadow-md transition relative">
      <p className="absolute bottom-2 left-2 text-[11px] text-gray-500">{count}</p>
      <div className="flex pl-2 items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-fullbg-yellow-400 text-yellow-500">
          <FaListAlt />
        </div>

        <p className="font-medium text-gray-800 flex flex-col">
          {sliceToOne(c.year)}{c.block} - {c.sem}
          <span className="text-[#666] text-xs">Total Students: {c.students.length}</span>
        </p>
      </div>
      <button className="bg-green-500 hover:bg-green-600 active:scale-[0.98]
        transition text-white py-2 px-3 text-sm font-medium rounded-lg cursor-pointer"
        onClick={() => {
          setClassPrev(false);
          setStudentPrev({
            year: c.year,
            block: c.block,
            sem: c.sem,
            course: c.course,
            acYear: c.acYear
          });
          fetchStudentsFromClass(c._id)
        }}>
          View Students
        </button>
    </div>
  );
};

export default Subjects