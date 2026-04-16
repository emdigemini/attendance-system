import { useContext } from "react";
import { CiSearch } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import accountContext from "../../context/userManagement/AccountContext";
import classContext from "../../context/classManagement/ClassContext";

export const SearchBar = ({ type }) => {
  const { searchAcc, setSearchAcc, selectedRole, users, setFilteredUsers } = useContext(accountContext);
  const { searchClass, setSearchClass, setFilteredClass, classList } = useContext(classContext);

  const searchAccount = (value) => {
    setSearchAcc(value);
    const name = value.toLowerCase();
    let filtered = users;
    if(selectedRole.toLowerCase() !== "all") {
      filtered = filtered.filter(user => user.type === selectedRole);
      setFilteredUsers(filtered);
    }
    const results = filtered.filter(user => user.fname.toLowerCase().includes(name) || user.lname.toLowerCase().includes(name));
    setFilteredUsers(results);
  }

  const searchClasses = (value) => {
    setSearchClass(value);
    const name = value.toLowerCase();
    let filtered = classList;

    const results = filtered.filter(classes => classes.course.toLowerCase().includes(name));
    setFilteredClass(results);
  }

  const clearSearchAcc = () => {
    setSearchAcc("");
    setFilteredUsers(users);
  }
  
  const clearSearchClass = () => {
    setSearchClass("");
    setFilteredClass(classList);
  }

  return (
    <div className="relative w-full md:w-72 lg:w-80">
      <CiSearch 
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="text"
        placeholder={`Search ${type === "account" ? "account" : "class"} by ${type === "account" ? "name" : "course"}...`}
        className="w-full px-4 py-2 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition select-none text-sm md:text-base shadow-sm bg-white"
        onChange={(e) => {
          const val = e.currentTarget.value;
          type === "account"
            ? searchAccount(val)
            : searchClasses(val);
        }}
        value={type === "account" ? searchAcc : searchClass}
      />
      
      {/* Clear Button */}
      {(type === "account" ? searchAcc.length > 0 : searchClass.length > 0) && (
        <IoIosClose 
          size={22} 
          className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 hover:scale-110 transition-all duration-200" 
          onClick={() => {
            type === "account" 
              ? clearSearchAcc()
              : clearSearchClass();
          }}
        />
      )}
    </div>
  )
}
