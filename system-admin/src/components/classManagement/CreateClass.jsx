import { useContext, useRef, useState } from "react"
import { IoIosClose } from "react-icons/io";
import classContext from "../../context/classManagement/ClassContext.jsx";
import Dropdown from "../Dropdown.jsx";

const course = [
  "BSIT - Information Technology",
  "BSCS - Computer Science",
  "BSBA_MM - major in Marketing Mngt",
  "BSBA_FM - major in Financial Mngt",
  "BSBA_HRDM - major in Human Resource Devt Mngt",
  "BSAIS - Accounting Information System",
  "BSOA - Office Administration",
  "BTVTED_FSM - Food & Service Management",
  "BTVTED_ET - Electrical Technology",  
]

const CreateClass = () => {
  const { form, setNewClass, createClass } = useContext(classContext);
  const [ onConfirm, setOnConfirm ] = useState(false);

  const submitForm = async () => {
    createClass();
  }

  const closeCreation = () => {
    if(form.length > 0) {
      setOnConfirm(true);
      return;
    }

    setNewClass(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-100 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
        <IoIosClose size={30} className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-black" 
                    onClick={closeCreation}/>

        <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Class</h1>

        <div className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-gray-600">Course</p>
            <Dropdown type="submit" dropdownType={{course}} position="left" stretch={true} />
          </div>

          {/* Grid for Year and Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-gray-600">Year Level</p>
              <Dropdown type="submit" dropdownType={{year: ["1st Year", "2nd Year", "3rd Year", "4th Year"]}} position="left" stretch={true} />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-gray-600">Block Section</p>
              <Dropdown type="submit" dropdownType={{block: ["A", "B", "C", "D", "E"]}} position="left" stretch={true} />
            </div>
          </div>

          {/* Grid for Sem and AY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-gray-600">Semester</p>
              <Dropdown type="submit" dropdownType={{sem: ["1st sem", "2nd sem"]}} position="left" stretch={true} />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-gray-600">Academic Year</p>
              <Dropdown type="submit" dropdownType={{acYear: ["25/26", "26/27"]}} position="left" stretch={true} />
            </div>
          </div>

          <button className="w-full bg-yellow-400 hover:bg-yellow-500 py-3 rounded-xl text-white font-bold shadow-md active:scale-95 transition-all mt-4 cursor-pointer"
                  onClick={submitForm}>
            Confirm Class
          </button>
        </div>
      </div>
      {onConfirm && <ConfirmClose setNewClass={setNewClass} setOnConfirm={setOnConfirm} />}
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

export default CreateClass

