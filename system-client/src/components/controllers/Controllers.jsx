import { useContext } from "react";
import { CiSearch } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import classContext from "../../context/Classrooms/classContext";
import subjectContext from "../../context/Subjects/subjectContext";
import { useState } from "react";
import attendanceContext from "../../context/Attendance/attendanceContext";
import authContext from "../../context/authContext";
import { useEffect } from "react";

export const SearchBar = ({ type }) => {
  const [ searchStudentAtt, setSearchStudentAtt ] = useState("");
  const [ searchSubAtt, setSearchSubAtt ] = useState("");
  const { authorization } = useContext(authContext);
  const { attStudents, setAttStudentsFilter, attLeaderboard, setAttLeaderboardFilter } = useContext(attendanceContext);
  const { searchClass, setSearchClass, setFilteredClass, filteredClass, classList, classStudents, setClassStudentsFiltered } = useContext(classContext);
  const { allSubs, allSubjects, mySubjects, setFilteredSubjects, attSubject, setAttSubjectFilter } = useContext(subjectContext);

  const searchStudentsAtt = (value) => {
    setSearchStudentAtt(value);
    const name = value.toLowerCase();

    let filtered = attStudents || [];
    let filtered2 = classStudents || [];
    let filteredLeaderboard = attLeaderboard || [];

    const results = filtered.filter(att => att.fname.toLowerCase().includes(name) || att.lname.toLowerCase().includes(name));
    const results2 = filtered2.filter(att => att.fname.toLowerCase().includes(name) || att.lname.toLowerCase().includes(name));
    const leaderboardRes = filteredLeaderboard.filter(att => att.fname.toLowerCase().includes(name) || att.lname.toLowerCase().includes(name));

    setAttStudentsFilter(results);
    setClassStudentsFiltered(results2)
    setAttLeaderboardFilter(leaderboardRes);
  }

  const searchClasses = (value) => {
    setSearchClass(value);
    const name = value.toLowerCase();
    let filtered = classList || filteredClass;
    const results = filtered.filter(classes => classes.course.toLowerCase().includes(name));
    setFilteredClass(results);
  }

  const searchAttSubjects = (value) => {
    setSearchSubAtt(value);
    const name = value.toLowerCase();

    if (type === "subject") {
      const source = allSubs === 0 ? mySubjects : allSubjects;
      const results = source.filter(sub =>
        sub.name.toLowerCase().includes(name)
      );
      setFilteredSubjects(results);
    } else {
      const results = attSubject.filter(sub =>
        sub.name.toLowerCase().includes(name)
      );
      setAttSubjectFilter(results);
    }
  };
  const clearSearchStudents = () => {
    setSearchStudentAtt("");
    setAttStudentsFilter(attStudents);
  }

  const clearSearchSubjects = () => {
    setSearchSubAtt("");
    setAttSubjectFilter(attStudents);
  }

  const clearSearchClass = () => {
    setSearchClass("");
    setFilteredClass(classList);
  }

  useEffect(() => {
    clearSearchSubjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSubs]);

  const labelMap = {
    student: "student",
    subject: "subject",
    att_subject: "subject",
    class: "class",
    course: "course"
  };

  const label = labelMap[type] || "student";

  return (
    <div className="relative w-full md:w-72 lg:w-96">
      <CiSearch 
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="text"
        placeholder={`Search ${label} by ${label === "class" ? "course" : "name"}...`}
        className="w-full px-4 py-2 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition select-none text-sm md:text-base shadow-sm"
        onChange={(e) => {
          const val = e.currentTarget.value;
          if(type === "student") return searchStudentsAtt(val);
          if(type === "att_subject" || type === "subject") return searchAttSubjects(val);
          searchClasses(val);
        }}
        value={
          type === "student" ? searchStudentAtt 
          : (type === "att_subject" || type === "subject") ? searchSubAtt
          : searchClass
        }
      />
      
      {/* Clear Button */}
      {(searchClass.length > 0 || searchStudentAtt.length > 0 || (searchSubAtt && searchSubAtt.length > 0)) && (
        <IoIosClose 
          size={22} 
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 hover:scale-110 transition-all duration-200" 
          onClick={() => {
            if(type === "student") return clearSearchStudents();
            if(type === "att_subject" || type === "subject") return clearSearchSubjects();
            clearSearchClass();
          }}
        />
      )}
    </div>
  )
}
