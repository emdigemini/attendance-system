import { useContext, useEffect, useState } from "react";
import { IoPersonCircleSharp } from "react-icons/io5";
import { IoPeople } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";
import { LiaTimesSolid } from "react-icons/lia";
import { PiDotsThreeBold } from "react-icons/pi";
import { CgPlayListRemove } from "react-icons/cg";
import subjectContext from "../../context/Subjects/subjectContext";
import { sliceToOne, transformFirstVal } from "../../lib/utils";
import authContext from "../../context/authContext";
import studentContext from "../../context/Students/studentContext";

const SubjectList = ({ setClassPrev, setStudentPrev }) => {
  const { authorization, user } = useContext(authContext);
  const { viewMode, setViewMode, mySubjects, allSubjects, setFilteredSubjects, fetchSubjectForStudent, editSubject, fetchAllSubject } = useContext(subjectContext);

  useEffect(() => {
  if (!user?.id) return;

  if (viewMode === 0) {
    if (authorization === 1) {
      fetchSubjectForStudent();
    } else if (authorization === 2) {
      // no fetch needed here
      setFilteredSubjects(mySubjects);
    }
  }

  if (viewMode === 1) {
    fetchAllSubject();
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [
  user?.id,
  viewMode,
]);

  return (
    <div className="flex flex-col gap-6 py-8 w-full">
      <div className="flex gap-2 mx-6 bg-gray-200/50 rounded-lg w-max p-1">
        <button className={`px-6 py-2 rounded-md 
          ${viewMode === 0 ? "text-black bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.25)]" : "text-gray-600"}
          ${viewMode !== 0 ? "hover:bg-white hover:shadow-[0px_0px_4px_rgba(0,0,0,0.25)]" : ""} font-medium transition-all cursor-pointer`}
          onClick={() => setViewMode(0)} >
          My Subjects
        </button>
        <button className={`px-6 py-2 rounded-md 
          ${viewMode !== 0 ? "text-black bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.25)]" : "text-gray-600"} 
          ${viewMode === 0 ? "hover:bg-white hover:shadow-[0px_0px_4px_rgba(0,0,0,0.25)]" : ""} font-medium transition-all cursor-pointer`}
          onClick={() => setViewMode(1)} >
          All Subjects
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 overflow-y-auto">
        <SubjectCard setClassPrev={setClassPrev} setStudentPrev={setStudentPrev} />
      </div>
    </div>
  )
}

const SubjectCard = ({ setClassPrev, setStudentPrev }) => {
  const { user, authorization } = useContext(authContext);
  const { student, removeSubjectForStudent } = useContext(studentContext);
  const { filteredSubjects, deleteSubject, editSubject, loading } = useContext(subjectContext);
  const [ overlay, setOverlay ] = useState(null);
  const [ enableMenu, setEnableMenu ] = useState(false);
  const [ isEditing, setIsEditing ] = useState(false);
  const [ delConfirm, setDelConfirm ] = useState(false);

  if(!filteredSubjects) return <p>Fetching subjects...</p>;

    return (
    <>
      {filteredSubjects?.length === 0 && 
      (authorization === 1
        ? <p>No subjects found. Add a subject or refresh the page.</p>
        : <p>No subjects found. Create a new subject or refresh the page.</p>)}
      {filteredSubjects?.map(s => {
        return (
          <div key={s._id} className="relative flex flex-col w-full h-max min-w-50 max-w-75 border border-gray-200 
          shadow-sm hover:shadow-md transition py-4 px-6 gap-3 rounded-xl bg-white overflow-hidden"
          >

            {overlay?.id === s._id
              ? <div className="absolute inset-0 z-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/35"></div>
                  <div className="relative bg-white rounded-2xl shadow-xl p-6 w-max m-6 text-center">
                    <h2 className="text-md font-semibold mb-2">Remove Subject</h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Are you sure you want to remove this <b>subject</b> from your list?
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
                          removeSubjectForStudent(s._id);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              : ""}

            <div className="flex gap-4 text-sm text-gray-500">
              <p>{sliceToOne(s.year)} - {sliceToOne(s.sem)}</p>
              <p>AY {s.acYear}</p>
            </div>

            <div className="flex flex-col gap-1">
              {isEditing.id === s._id
                ? <input type="text" value={isEditing.name}
                  autoFocus
                  onChange={(e) => setIsEditing(prev => ({...prev, name: e.target.value}))}
                  className="w-full border"
                   />
                : <h3 className="font-bold text-xl">{s.name}</h3>}
              <p className="text-sm text-gray-600 font-medium">
                {transformFirstVal(s.course)}
              </p>
            </div>

            <div className="flex flex-col gap-2 select-none">
              <div className="flex items-center gap-2">
                <div className="bg-Hnav/20 text-black/75 p-2 rounded-md">
                  <IoPersonCircleSharp size={18} />
                </div>
                <p className="text-sm text-[#666]">Prof: 
                  {s.teacher_id.fname} {s.teacher_id.lname}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-Hnav/20 text-black/75 p-2 rounded-md">
                  <IoPeople size={18} />
                </div>
                <p className="text-sm text-[#666]">Total Blk: 
                  {!s.totalClasses.length ? 0 : s.totalClasses.length}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-Hnav/20 text-black/75 p-2 rounded-md">
                  <FaLocationDot size={18} />
                </div>
                {isEditing.id === s._id
                  ? <input type="text" value={s.room}
                    onChange={(e) => setIsEditing(prev => ({...prev, room: e.target.value}))}
                    className="w-full border"
                     />
                  : <p className="text-sm text-[#666]">{s.room}</p>
                  }
              </div>
            </div>

            {authorization === 1
              ? (student?.mySubject?.includes(s._id)
                ? <AddSubject enable={true} id={s._id} setOverlay={setOverlay} />
                : <AddSubject enable={false} id={s._id} />
              )

              : (user.id === s.teacher_id._id
              ? (
                <>
                  {s._id === enableMenu && (
                    <div className="absolute top-10 right-2 flex gap-1 bg-white/80 backdrop-blur-sm p-1 rounded-md shadow-sm border select-none border-slate-200">
                      
                      {isEditing?.id === s._id ? (
                        <div className="flex flex-col gap-2">
                          <button className="flex items-center gap-2 p-1 bg-red-500 hover:bg-red-400 text-white font-medium rounded-full transition-all cursor-pointer duration-200 shadow-sm active:scale-95"
                          onClick={() => {
                            setIsEditing(false)
                          }}>
                            <LiaTimesSolid className="text-xs" />
                          </button>
                          <button className="flex items-center gap-2 p-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-all duration-200 shadow-sm active:scale-95 cursor-pointer">
                            <FaCheck className="text-xs" 
                            onClick={() => {
                              setIsEditing(false);
                              setEnableMenu(false);
                              editSubject(isEditing.id, {
                                name: isEditing.name,
                                room: isEditing.room
                              })
                            }}/>
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 cursor-pointer hover:bg-slate-100 rounded transition-colors"
                            onClick={() =>
                              setIsEditing({
                                id: s._id,
                                name: s.name,
                                room: s.room
                              })
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600 cursor-pointer hover:bg-red-50 rounded transition-colors"
                            onClick={() => setDelConfirm(s._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                      
                    </div>
                  )}
                  {delConfirm === s._id && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 rounded-lg text-white p-4 text-center">
                      <p className="mb-4 font-medium">Confirm delete subject?</p>
                      
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded text-sm transition"
                        onClick={() => setDelConfirm(false)}>
                          Cancel
                        </button>
                        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm cursor-pointer transition"
                        onClick={() => deleteSubject(delConfirm)}>
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}
                  <PiDotsThreeBold size={20} className="absolute right-4 cursor-pointer p-0.5 rounded-4xl hover:bg-black/10"
                  onClick={() => {
                    if (enableMenu === s._id) {
                      setEnableMenu(null);
                      setDelConfirm(false);
                      setIsEditing(false);
                    } else {
                      setEnableMenu(s._id);
                    }
                  }}
                  />
                  <ViewClasslist enable={false} setClassPrev={setClassPrev} subPrev={s} setStudentPrev={setStudentPrev} />
                </>
              )
              : <ViewClasslist enable={true} />)
              }
          </div>
        )
      })}
    </>
    
  )
}

const AddSubject = ({ enable, id, setOverlay }) => {
  const { user } = useContext(authContext);
  const { addSubjectForStudent, fetchStudentInfo } = useContext(studentContext);

  const addSubject = () => {
    if (enable) {
      null
    } else {
      fetchStudentInfo(user?.id);
      addSubjectForStudent(id);
    }
  }

  return (
    <>  
      {enable
        ? <RemoveSubject id={id} setOverlay={setOverlay} />
        : <button className={`active:scale-[0.98]
          transition text-white py-2 font-medium rounded-lg 
          ${enable ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"} cursor-pointer select-none`}
        onClick={() => addSubject()}
        >
          Add Subject
        </button>
      }
    </>
  )
}

const RemoveSubject = ({ id, setOverlay }) => {
  return (
    <button className="active:scale-[0.98]
      transition text-white py-2 font-medium rounded-lg 
      bg-red-600 hover:bg-red-700 cursor-pointer select-none"
    onClick={() => {
      setOverlay(prev => {
        return prev?.id === id
          ? null : ({id: id})
      })
    }}
    >
      Remove Subject
    </button>
  )
}

const ViewClasslist = ({ enable, setClassPrev, subPrev, setStudentPrev }) => {
  const { previewSubject } = useContext(subjectContext);

  return (
    <button className={`active:scale-[0.98]
      transition text-white py-2 font-medium rounded-lg 
      ${enable ? "bg-green-400/75 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 cursor-pointer select-none"}`}
    onClick={() => {
      previewSubject(subPrev)
      setStudentPrev(false);
      setClassPrev(true);
    }}
    disabled={enable}
    >
      View Classlist
    </button>
  )
}

export default SubjectList