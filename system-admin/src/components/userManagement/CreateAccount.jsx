import { useContext, useRef, useState } from "react"
import { IoIosClose } from "react-icons/io";
import accountContext from "../../context/userManagement/AccountContext.jsx";
import { generateUsername, generatePassword } from "../../lib/autoGenerate.js";

const CreateAccount = () => {
  const { setToggleCreate, createAccount } = useContext(accountContext);
  const [ onConfirm, setOnConfirm ] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("Student");
  const [ email, setEmail ] = useState("");
  const [ firstName, setFirstName ] = useState("");
  const [ lastName, setLastName ] = useState("");
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");

  const firstNameRef = useRef();
  const lastNameRef = useRef();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const selectType = (type) => {
    setSelectedType(type);
    setDropdownOpen(false);
  }

  const enterFirstName = (e) => {
    firstNameRef.current.style.borderColor = "";
    setFirstName(e.currentTarget.value)
  }

  const enterLastName = (e) => {
    lastNameRef.current.style.borderColor = "";
    setLastName(e.currentTarget.value)
  }

  const createUsername = () => {
    if (!firstName) {
      firstNameRef.current.focus();
      return firstNameRef.current.style.borderColor = "red";
    };
    if (!lastName) {
      lastNameRef.current.focus();
      return lastNameRef.current.style.borderColor = "red";
    };

    setUsername(generateUsername(firstName, lastName));
  };

  const submitForm = async () => {
    await createAccount({accountType: selectedType, email, fname: firstName, lname: lastName, username, password});
    setEmail("");
    setFirstName("");
    setLastName("");
    setUsername("");
    setPassword("");
  }

  const closeCreation = () => {
    if(firstName.length > 0 || username.length > 0 || password.length > 0) {
      setOnConfirm(true);
      return;
    }
    setToggleCreate(false);
  }
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-100 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative max-h-[95vh] overflow-y-auto">
        
        <IoIosClose 
          size={28} 
          className="absolute top-3 right-3 cursor-pointer active:scale-90 transition-all duration-200 ease-in-out text-gray-500 hover:text-gray-800"
          onClick={() => closeCreation()}
        />

        <h1 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 pr-8">
          Create Account
        </h1>

        <div className="space-y-4">
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <p className="font-semibold text-sm md:text-base">Select Account Type:</p>
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="w-full sm:w-32 px-4 py-1 border-b border-black bg-white hover:bg-gray-100 flex items-center justify-between gap-2 focus:outline-none transition-colors duration-200 cursor-pointer font-semibold"
                aria-expanded={dropdownOpen}
              >
                {selectedType}
                <span className="text-[10px]">▼</span>
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 sm:left-0 top-full mt-1 w-full sm:w-32 bg-white border border-gray-300 shadow-lg z-50 overflow-auto max-h-40 rounded-md">
                  <ul>
                    {["Student", "Teacher"].map((type) => (
                      <li
                        key={type}
                        onClick={() => selectType(type)}
                        className="px-4 py-2 hover:bg-yellow-100 cursor-pointer transition-colors duration-200 text-sm"
                      >
                        {type}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-base"
              onChange={(e) => setEmail(e.currentTarget.value)}
              value={email}
              autoComplete="off"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="fname" className="text-sm font-medium text-gray-600 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="fname"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                ref={firstNameRef}
                onChange={(e) => enterFirstName(e)}
                value={firstName}
                autoComplete="off"
              />
            </div>
             <div className="flex flex-col">
              <label htmlFor="lname" className="text-sm font-medium text-gray-600 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lname"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                ref={lastNameRef}
                onChange={(e) => enterLastName(e)}
                value={lastName}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="username" className="text-sm font-medium text-gray-600">
                Username
              </label>
              <button
                type="button"
                className="text-xs font-bold text-green-600 hover:text-green-700 py-1"
                onClick={() => createUsername()}
              >
                Generate
              </button>
            </div>
            <input
              type="text"
              id="username"
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
              onChange={(e) => setUsername(e.currentTarget.value)}
              value={username}
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-600">
                Password
              </label>
              <button
                type="button"
                className="text-xs font-bold text-yellow-600 hover:text-yellow-700 py-1"
                onClick={() => setPassword(generatePassword())}
              >
                Generate
              </button>
            </div>
            <input
              type="text"
              id="password"
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
              onChange={(e) => setPassword(e.currentTarget.value)}
              value={password}
            />
          </div>

          <button 
            className="w-full bg-yellow-400 hover:bg-yellow-500 active:scale-[0.98] transition-all duration-200 text-white font-bold py-3 mt-2 rounded-lg shadow-md cursor-pointer"
            onClick={() => submitForm()}
          >
            Add Account
          </button>

        </div>
      </div>
      {onConfirm && <ConfirmClose setToggleCreate={setToggleCreate} setOnConfirm={setOnConfirm} />}
    </div>
  )
}

const ConfirmClose = ({ setToggleCreate, setOnConfirm }) => {
  const closeForm = () => {
    setToggleCreate(false);
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

export default CreateAccount
