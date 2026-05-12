import { useEffect, useState } from "react";
import { useContext } from "react";
import classContext from "../context/classManagement/ClassContext";

const Dropdown = ({ type, dropdownType, position, stretch }) => {
  const { filterClass, setForm, setFilterList, filterList } = useContext(classContext);
  const [dropdownList, setDropdownList] = useState(() => {
    const list = {};

    if (dropdownType.acYear) list.acYear = "Academic Year";
    if (dropdownType.sem) list.sem = "Semester";
    if (dropdownType.year) list.year = "Year";
    if (dropdownType.block) list.block = "BLK";
    if (dropdownType.course) list.course = "Course";

    return list;
  });
  const [ dropdownOpen, setDropdownOpen ] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const selectList = (val) => {

    const updated =
      dropdownType.acYear ? { acYear: val }
      : dropdownType.sem ? { sem: val }
      : dropdownType.year ? { year: val }
      : dropdownType.block ? { block: val }
      : { course: val };
    setDropdownList(prev => ({ ...prev, ...updated }));

    if(type === "submit"){
      setForm(prev => ({ ...prev, ...updated }));
    } else {
      const newFilter = { ...filterList, ...updated };
      setFilterList(newFilter);
      filterClass(newFilter);
    }
    setDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className={`${dropdownType.acYear ? "min-w-26" : dropdownType.sem ? "min-w-30" : dropdownType.year ? "min-w-28" : "w-full" } p-2 rounded-lg border border-gray-300 bg-white 
        hover:bg-gray-100 flex items-center justify-between focus:outline-none select-none
        ${stretch ? "w-full" : ""}`}
      >
        {dropdownType.acYear ? dropdownList.acYear : dropdownType.sem ? dropdownList.sem : dropdownType.year 
        ? dropdownList.year : dropdownType.block ? dropdownList.block : dropdownList.course}
        <span className="ml-2">&#9662;</span>
      </button>

      {dropdownOpen && (
        <div className={`${dropdownType.acYear ? "w-full" : dropdownType.sem ? "w-30" : dropdownType.year ? "w-28" : "w-full" } max-h-30
        absolute ${position === "left" ? "left" : "right"}-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-100 overflow-auto
        ${stretch ? "w-full" : ""}`}>
          <ul>
            {(dropdownType.acYear || dropdownType.sem || dropdownType.year || dropdownType.block || dropdownType.course).map((val) => (
              <li
                key={val}
                onClick={() => selectList(val)}
                className="px-4 py-2 hover:bg-yellow-100 cursor-pointer select-none"
              >
                {val}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}


export default Dropdown;