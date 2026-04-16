import { useContext, useEffect, useRef, useState } from "react";
import classContext from "../../context/classManagement/ClassContext";
import { transformFirstVal } from "../../lib/utils.js";
/* icons */
import { ClipLoader } from "react-spinners";
import { IoPeople } from "react-icons/io5";
import { PiDotsThreeBold } from "react-icons/pi";
import { FaTrashAlt } from "react-icons/fa";

const ClassList = ({ dashboard, setClassPrev, setClassId }) => {
  const { loading, fetchClasses, fetchRecentClasses } = useContext(classContext);

  useEffect(() => {
    fetchClasses();
    fetchRecentClasses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(dashboard)
    return (
      <ClassListMini />
    )

  return (
    <>
      <div className="flex gap-6 px-6 py-8 flex-wrap h-max max-h-full w-full pr-8 overflow-y-auto">
        {loading 
        ? <ClipLoader className="relative top-3 left-3" color="#FBBF24" loading={loading} size={50} />
        : <ClassCard setClassPrev={setClassPrev} setClassId={setClassId} />} 
      </div>
    </>
  )
}

const ClassListMini = ({ loading }) => {
  const { recentClass } = useContext(classContext);

  return (
    <div className="flex flex-col gap-4 px-6 py-8 h-full max-h-150 
     bg-white border border-slate-200 shadow-sm rounded-2xl overflow-y-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-amber-400 rounded-full"></div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Recently Added
          </h2>
        </div>
        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
          Newest
        </span>
      </div>

      {/* Class List */}
      <div className="flex flex-wrap gap-6 py-4 justify-start items-start">
        {loading ? (
          <div className="flex w-full justify-center py-12">
            <ClipLoader color="#FBBF24" loading={loading} size={50} />
          </div>
        ) : (
          recentClass?.map((classes) => {
            return (
              <div key={classes._id} className="relative flex flex-col w-full h-max min-w-50 max-w-75 border border-gray-200 
              shadow-sm hover:shadow-md transition py-5 px-6 gap-4 rounded-xl bg-white overflow-hidden">
              <p className="absolute left-6.5 bottom-0.5 text-[8px] text-gray-400">
                created at: {new Date(classes.createdAt).toLocaleString("en-PH", {
                  timeZone: "Asia/Manila",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>

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
                  <p className="text-sm">Total Students: {classes?.students.length || 0}</p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

const ClassCard = ({ setClassPrev, setClassId, noButton }) => {
  const { filteredClass } = useContext(classContext);
  const [ delClass, setDelClass ] = useState({id: null}); 
  const [ confirmDelete, setConfirmDelete ] = useState({id: null});
  const { fetchStudentsFromClass } = useContext(classContext);

  return (
    <>
      {
        filteredClass?.length > 0 && filteredClass?.map((classes) => {
          return (
            <div key={classes._id} className="relative flex flex-col w-full h-max min-w-50 max-w-75 border border-gray-200 
            shadow-sm hover:shadow-md transition py-5 px-6 gap-4 rounded-xl bg-white overflow-hidden">
              <PiDotsThreeBold size={20} className="absolute right-4 cursor-pointer p-0.5 rounded-4xl hover:bg-black/10"
              onClick={(e) => {
                e.stopPropagation();
                setDelClass(prev => 
                  prev?.id === classes._id 
                  ? ({id: null}) : ({id: classes._id})
                );
              }} />

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
                <p className="text-sm">Total Students: {classes?.students.length || 0}</p>
              </div>
              {!noButton && 
                <button className="bg-green-500 hover:bg-green-600 active:scale-[0.98]
                  transition text-white py-2 font-medium rounded-lg cursor-pointer outline-red-400"
                  onClick={() => {
                    setClassPrev(true);
                    setClassId(classes._id);
                    fetchStudentsFromClass(classes._id);
                  }}>
                  View Students
                </button>
              }
              {delClass.id === classes._id && <DeleteClass id={classes._id} setConfirmDelete={setConfirmDelete} setDelClass={setDelClass} />}
              {confirmDelete.id === classes._id && <ConfirmDelete id={classes._id} setConfirmDelete={setConfirmDelete} />}
            </div>
          )
        })
      }
      {filteredClass?.length === 0 && <p className="text-center py-6 text-gray-500 italic">No class found.</p>}
    </>
  )
}

const DeleteClass = ({ id, setConfirmDelete, setDelClass }) => {
  const delRef = useRef(null);

  useEffect(() => {
    const removeDelete = (e) => {
      if(delRef.current && !delRef.current.contains(e.target))
        setDelClass({});
    }

    window.addEventListener('click', removeDelete);

    return () => window.removeEventListener('click', removeDelete);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex items-center gap-2 text-white bg-red-500 w-max p-2 rounded-md absolute
      top-11 right-4 cursor-pointer hover:bg-red-600 text-xs"
      ref={delRef}
      onClick={() => {
        setConfirmDelete({id});
        setDelClass({})
      }}>
        <FaTrashAlt />
        <p>Delete</p>
      </div>
    </>
  )
}

const ConfirmDelete = ({ id, setConfirmDelete }) => {
  const { deleteClass } = useContext(classContext);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
    flex flex-col items-center justify-center px-4 bg-black/50 h-full w-full z-10">
      <div className="bg-white p-4 rounded-lg flex flex-col gap-3">
        <h2 className="text-md font-semibold mb-2">Remove Classroom</h2>
        <p>Are you sure you want to delete this class? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => deleteClass(id)} 
          className="bg-red-500 p-2 rounded-sm text-white text-sm cursor-pointer hover:bg-red-600">Confirm</button>
          <button onClick={() => setConfirmDelete({})} 
          className="bg-gray-500/75 p-2 rounded-sm text-white text-sm cursor-pointer hover:bg-gray-600/75">Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default ClassList