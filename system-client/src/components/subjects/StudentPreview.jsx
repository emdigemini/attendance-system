/* components */
import { useContext } from "react";
import { SearchBar } from "../controllers/Controllers";
import classContext from "../../context/Classrooms/classContext";
import Loading from "../Loading.jsx";

/* icons */
import { IoPersonCircleOutline } from "react-icons/io5";
import { getFirstWord, transformFirstVal } from "../../lib/utils.js";

const StudentPreview = ({ setStudentPrev, setClassPrev }) => {
  const { classStudentsFiltered, studentPrev, loading } = useContext(classContext);

  return (
    <div className="w-full md:w-2/3 absolute top-0 z-50 h-full md:relative">
      <header className="flex justify-between items-start bg-[#c43c2d] text-white px-6 py-4 shadow-sm">
        <div>
          <div className="flex gap-2 text-white text-sm font-medium">
            <p>
              {getFirstWord(studentPrev.course)} - {studentPrev.sem}
            </p>
            <p>|</p>
            <p>AY {studentPrev.acYear}</p>
          </div>

          <h3 className="text-xl font-bold tracking-wide">
            {transformFirstVal(getFirstWord(studentPrev.year))} YR - BLK {studentPrev.block}
          </h3>
        </div>

        <button className="p-2 rounded-lg text-white/80 hover:bg-white/15
      hover:text-white transition cursor-pointer"
        onClick={() => {
          setStudentPrev(false);
          setClassPrev(true);
        }}>
          ✕
        </button>
      </header>
      <main className="flex flex-col gap-4 bg-[#f6f7f9] h-full w-full p-2">
        <SearchBar type="student" />
        <div className="flex flex-col gap-2 overflow-y-auto py-2">
          {loading && (
            <Loading />
          )}
          {classStudentsFiltered?.length === 0 && (
            <p className="text-center text-gray-500 italic py-8 border-2 border-dashed border-gray-200 rounded-lg">
              No students found in this class.
            </p>
          )}
          {classStudentsFiltered?.map((s, index) => {
            return (
            <div key={s._id}>
              <StudentCard count={index+1} s={s} />
            </div>
          )})}
        </div>
      </main>
    </div>
  )
}

const StudentCard = ({ count, s }) => {
  return (
    <>
      <div className="flex items-center justify-between bg-Array.from({length: 12}) px-4 py-3 rounded-xl shadow-sm
      border border-gray-100 hover:shadow-md transition relative">
        <p className="absolute bottom-2 left-2 text-[11px] text-gray-500">{count}</p>
        <div className="flex pl-2 items-center gap-3">
          <div className="h-8 w-8 flex items-center justify-center text-3xl rounded-full overflow-hidden bg-yellow-400 text-yellow-500">
            {<img src={s.pfp} alt=""
              className="h-max w-max object-center object-cover" />
             || <IoPersonCircleOutline />}
          </div>
          <p className="font-medium text-gray-800">
            {s.fname} {s.lname}
          </p>
        </div>
        <p className="text-[#666]">{s.student.studentType}</p>
      </div>
    </>
  );
};

export default StudentPreview