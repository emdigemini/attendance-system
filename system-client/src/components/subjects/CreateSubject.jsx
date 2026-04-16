import { useContext, useEffect, useState } from "react"
import { IoIosClose } from "react-icons/io";
import Dropdown from "../Dropdown.jsx";
import subjectContext from "../../context/Subjects/subjectContext.jsx";

const course = [
  "BSIT - Information Technology",
  "BSCS - Computer Science",
  "BSBA - Business Administration",
  "BSAIS - Accounting Information System",
  "BSOA - Office Administration",
  "Food & Service Management",
  "Electech"
]

const room = [
  "Comlab 1",
  "Comlab 2",
  "Room 1N",
  "Room 2N",
  "Room 4N",
  "Room 7N",
]

const CreateSubject = ({ setCreateSubject }) => {
  const { addSubject, setSubjectForm, subjectForm } = useContext(subjectContext);
  const [ onConfirm, setOnConfirm ] = useState(false);

  useEffect(() => {
    // console.log(subjectForm);
  }, [subjectForm]);

  const submitForm = async () => {
    addSubject();
  }

  const closeCreation = () => {

    setCreateSubject(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-100 p-4">
      <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-6 relative">
        <IoIosClose size={24} className="absolute top-3 right-3 cursor-pointer active:scale-90 transition-all duration-200 ease-in-out" 
        onClick={() => closeCreation()}/>

        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Add New Class
        </h1>

        <div className="space-y-4">
          <div className="relative flex flex-col gap-0.5">
            <p>Select course:</p>
            <Dropdown type="submit-subject" dropdownType={{course}} position="left" />
          </div>

          <div className="flex gap-4 w-full items-center">
            <div className="relative flex flex-col gap-0.5 w-full">
              <p>Select year:</p>
              <Dropdown type="submit-subject" dropdownType={{year: ["1st Year", "2nd Year", "3rd Year", "4th Year"]}} position="left" stretch={true} />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative flex flex-col gap-0.5 w-full">
              <p>Select sem:</p>
              <Dropdown type="submit-subject" dropdownType={{sem: ["1st sem", "2nd sem"]}} position="left" stretch={true} />
            </div>
            <div className="relative flex flex-col gap-0.5 w-full">
              <p>Select academic year:</p>
              <Dropdown type="submit-subject" dropdownType={{acYear: ["25/26", "26/27"]}} position="left" stretch={true} />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative flex flex-col gap-0.5 w-full">
              <p>Enter your subject:</p>
              <input type="text" placeholder="Add your subject"
              className="p-2 rounded-lg border border-gray-300 bg-white 
            hover:bg-gray-100 flex items-center justify-between focus:outline-none select-none w-full"
              onChange={(e) => setSubjectForm(prev => ({...prev, name: e.target.value}))}/>
            </div>
            <div className="relative flex flex-col gap-0.5 w-full">
              <p>Enter room:</p>
              <input type="text" placeholder="Add a designated room"
              className="p-2 rounded-lg border border-gray-300 bg-white 
        hover:bg-gray-100 flex items-center justify-between focus:outline-none select-none w-full" 
        onChange={(e) => setSubjectForm(prev => ({...prev, room: e.target.value}))}/>
            </div>
          </div>
          

          <button className="w-full bg-yellow-400 hover:bg-yellow-500 active:scale-95 transition-all duration-200 text-white font-semibold py-2 rounded-lg shadow-md cursor-pointer"
          onClick={() => submitForm()}>
            Confirm
          </button>

        </div>

      </div>
      {onConfirm && <ConfirmClose setToggleCreate={setCreateSubject} setOnConfirm={setOnConfirm} />}
    </div>
  )
}

const ConfirmClose = ({ setNewClass, setOnConfirm }) => {
  const closeForm = () => {
    setNewClass(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
        <h2 className="text-lg font-bold mb-4 text-gray-800">
          Are you sure?
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Your current changes will be lost if you close this overlay.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={closeForm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all cursor-pointer"
          >
            Close Anyway
          </button>
          <button
            onClick={() => setOnConfirm(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSubject

