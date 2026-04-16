import { useContext, useEffect, useState } from "react";
import classContext from "../../context/Classrooms/classContext.jsx";
import { transformFirstVal } from "../../lib/utils.js";
/* icons */
import { ClipLoader } from "react-spinners";
import { IoPeople } from "react-icons/io5";
import { CgPlayListRemove } from "react-icons/cg";
import authContext from "../../context/authContext.jsx";

const ClassList = () => {
  const { user } = useContext(authContext);
  const [ allClass, setAllClass ] = useState(0);
  const { loading, fetchClasses, fetchMyClassroom } = useContext(classContext);

  useEffect(() => {
    if(allClass === 0){
      fetchMyClassroom();
    } else if(allClass === 1){
      fetchClasses({
        studentID: user.id,
        year: user.profile.year,
        course: user.profile.course
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allClass]);

  return (
    <div className="flex flex-col gap-6 py-8 w-full">
      <div className="flex gap-2 mx-6 bg-gray-200/50 rounded-lg w-max">
        <button className={`px-6 py-2 rounded-md 
          ${allClass === 0 ? "text-black bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.25)]" : "text-gray-600"}
          ${allClass !== 0 ? "hover:bg-white hover:shadow-[0px_0px_4px_rgba(0,0,0,0.25)]" : ""} font-medium transition-all cursor-pointer`}
          onClick={() => setAllClass(0)} >
          My Classroom
        </button>
        <button className={`px-6 py-2 rounded-md 
          ${allClass !== 0 ? "text-black bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.25)]" : "text-gray-600"} 
          ${allClass === 0 ? "hover:bg-white hover:shadow-[0px_0px_4px_rgba(0,0,0,0.25)]" : ""} font-medium transition-all cursor-pointer`}
          onClick={() => setAllClass(1)} >
          All Classroom
        </button>
      </div>
      <div className="flex gap-6 px-6 flex-wrap h-max max-h-full w-full pr-8 overflow-y-auto">
        {loading 
        ? <ClipLoader className="relative top-3 left-3" color="#FBBF24" loading={loading} size={50} />
        : <ClassCard />} 
      </div>
    </div>
  )
}

const ClassCard = () => {
  const { user } = useContext(authContext);
  const { filteredClass, joinClassroom, removeClassroom, studentPrev, setStudentPrev, setClassPrev, fetchStudentsFromClass } = useContext(classContext);
  const [ overlay, setOverlay ] = useState(null);

  return (
    <>
      {
        filteredClass.length > 0 && filteredClass.map((classes) => {
          const myClassRoom = classes.students.filter(c => c === user.id).join();

          return (
            <div key={classes._id} className="relative flex flex-col w-full h-max min-w-50 max-w-75 border border-gray-200 
            shadow-sm hover:shadow-md transition py-5 px-6 gap-4 rounded-xl bg-white overflow-hidden">

              <div className="flex gap-6 text-sm text-gray-500">
                <p>{classes.sem}</p>
                <p>AY {classes.acYear}</p>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-xl">{transformFirstVal(classes.year)} YR - BLK {classes.block}</h3>
                <p className="text-sm text-gray-600 font-medium">
                  {classes.course}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-Hnav/20 text-black/75 p-2 rounded-md">
                  <IoPeople size={18} />
                </div>
                <p className="text-sm">Total Students: {!classes.students.length ? 0 : classes.students.length}</p>
              </div>
              
              {overlay?.id === classes._id 
                ? <div className="absolute inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/35"></div>
                    <div className="relative bg-white rounded-2xl shadow-xl p-6 w-max m-6 text-center">
                      <h2 className="text-md font-semibold mb-2">Remove Classroom</h2>
                      <p className="text-sm text-gray-500 mb-6">
                        Are you sure you want to remove this <b>classroom</b> from your list?
                      </p>

                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => setOverlay(null)}
                          className="px-4 py-2 text-xs rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                        >
                          Cancel
                        </button>

                        <button
                          className="px-4 py-2 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 transition shadow cursor-pointer"
                          onClick={() => {
                            setOverlay(null);
                            removeClassroom(classes._id);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div> 
                : ""}
              {myClassRoom === user.id
                ? <>
                    <CgPlayListRemove size={20} className="absolute right-4 text-gray-600 cursor-pointer p-0.5 rounded-4xl hover:bg-black/10"
                    onClick={() => setOverlay(prev => 
                      prev?.id === classes._id ? null
                      : ({ id: classes._id })
                    )}
                    />
                    <button className="bg-yellow-500 hover:bg-yellow-600 active:scale-[0.98]
                    transition text-white py-2 font-medium rounded-lg cursor-pointer outline-red-400"
                    onClick={() => {
                      setClassPrev(false);
                      setStudentPrev({
                        year: classes.year,
                        block: classes.block,
                        sem: classes.sem,
                        course: classes.course,
                        acYear: classes.acYear
                      });
                      fetchStudentsFromClass(classes._id)
                    }}
                      >
                      View Classroom
                    </button>
                  </>
                : <button className="bg-green-500 hover:bg-green-600 active:scale-[0.98]
                  transition text-white py-2 font-medium rounded-lg cursor-pointer outline-red-400"
                    onClick={() => joinClassroom(classes._id)}
                    >
                    Add Classroom
                  </button>
              }
            </div>
          )
        })
      }
      {filteredClass.length === 0 && <p className="text-center py-6 text-gray-500 italic">No class found.</p>}
    </>
  )
}

export default ClassList