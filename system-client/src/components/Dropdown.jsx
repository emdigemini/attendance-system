import { useState, useContext, useEffect } from "react";
import classContext from "../context/Classrooms/classContext";
import subjectContext from "../context/Subjects/subjectContext";

const Dropdown = ({ type, dropdownType, position, stretch }) => {
  const { filterClass, setFilterList, filterList } = useContext(classContext);
  const { allSubs, setSubjectForm, filterSub, filterSubAtt, filterListSub, setFilterListSub } = useContext(subjectContext);

  const [dropdownList, setDropdownList] = useState(() => {
    const list = {};
    if (dropdownType.acYear) list.acYear = "Academic Year";
    if (dropdownType.sem) list.sem = "Semester";
    if (dropdownType.year) list.year = "Year";
    if (dropdownType.block) list.block = "BLK";
    if (dropdownType.course) list.course = "Course";
    return list;
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const selectList = (val) => {
    const updated = dropdownType.acYear ? { acYear: val }
      : dropdownType.sem ? { sem: val }
      : dropdownType.year ? { year: val }
      : dropdownType.block ? { block: val }
      : { course: val };
    
    setDropdownList(prev => ({ ...prev, ...updated }));

    if (type === "submit-subject") {
      setSubjectForm(prev => ({ ...prev, ...updated }));
    } else if (type === "filter-sub") {
      const newFilter = { ...filterListSub, ...updated };
      setFilterListSub(newFilter);
      filterSub(newFilter);
    } else if (type === "filter-subAtt") {
      const newFilter = { ...filterListSub, ...updated };
      setFilterListSub(newFilter);
      filterSubAtt(newFilter);
    } else {
      const newFilter = { ...filterList, ...updated };
      setFilterList(newFilter);
      filterClass(newFilter);
    }
    setDropdownOpen(false);
  };

  useEffect(() => {
    setDropdownList(list => {
      const newList = { ...list };
      if (dropdownType.acYear) newList.acYear = "Academic Year";
      if (dropdownType.sem) newList.sem = "Semester";
      if (dropdownType.year) newList.year = "Year";
      return newList;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSubs]);

  const currentLabel = dropdownType.acYear ? dropdownList.acYear 
    : dropdownType.sem ? dropdownList.sem 
    : dropdownType.year ? dropdownList.year 
    : dropdownType.block ? dropdownList.block 
    : dropdownList.course;

  const options = dropdownType.acYear || dropdownType.sem || dropdownType.year || dropdownType.block || dropdownType.course;

  return (
    <div className={`relative ${stretch ? "w-full" : "w-auto"}`}>
      <button
        onClick={toggleDropdown}
        /* Responsive Widths: 
           - Mobile: full width for easier tapping
           - Desktop (md:): min-widths based on content
        */
        className={`
          flex items-center justify-between p-2.5 rounded-lg border border-gray-300 bg-white 
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all select-none text-sm md:text-base
          w-full
          ${!stretch && dropdownType.acYear ? "md:min-w-40" : ""}
          ${!stretch && (dropdownType.sem || dropdownType.year) ? "md:min-w-32" : ""}
        `}
      >
        <span className="truncate mr-2">{currentLabel}</span>
        <span className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}>
          &#9662;
        </span>
      </button>

      {dropdownOpen && (
        <>
          {/* Overlay to close on mobile click-outside */}
          <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setDropdownOpen(false)} />
          
          <div className={`
            absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl overflow-auto max-h-60
            w-full
            ${position === "left" ? "left-0" : "right-0"}
            ${!stretch && dropdownType.acYear ? "lg:min-w-40" : ""}
          `}>
            <ul className="py-1">
              {options.map((val) => (
                <li
                  key={val}
                  onClick={() => selectList(val)}
                  className="px-4 py-3 md:py-2 hover:bg-yellow-50 active:bg-yellow-100 cursor-pointer select-none text-sm md:text-base border-b border-gray-50 last:border-none"
                >
                  {val}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Dropdown;