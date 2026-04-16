import { useContext, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FiRefreshCcw } from "react-icons/fi";
import accountContext from "../../context/userManagement/AccountContext";
import AccountList from "./AccountList";
import { DeleteConfirmation, DeleteConfirmation2, ResetPasswordConfirmation, ResetPasswordModal } from "./AccountActions";
import { SearchBar } from "../controllers/Controllers";

const UserManagement = () => {
  const { users, setFilteredUsers, fetchUsers, delConfirm, delConfirm2, resetConfirm, passwordReset } = useContext(accountContext);

  return (
    <div className="bg-[#F4F4F4] min-h-screen pb-10">
      <Header users={users} setFilteredUsers={setFilteredUsers} fetchUsers={fetchUsers} />
      <div className="border border-black/10"></div>
      
      {/* Responsive Margins: Mobile: 4, Tablet: 10, Desktop: 20 */}
      <div className="mt-6 lg:mt-10 mx-4 lg:mx-10 xl:mx-20">
        <AccountList />
      </div>

      {delConfirm && <DeleteConfirmation />}
      {delConfirm2 && <DeleteConfirmation2 />}
      {resetConfirm && <ResetPasswordConfirmation />}
      {passwordReset.reset && <ResetPasswordModal />}
    </div>
  )
}

const Header = ({ users, setFilteredUsers }) => {
  const { setToggleCreate, selectedRole, setSelectedRole } = useContext(accountContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const selectRole = (role) => {
    setSelectedRole(role);
    setDropdownOpen(false);
    if(role.toLowerCase() === "all") return setFilteredUsers(users);
    const accountType = users.filter(user => user.accountType === role);
    setFilteredUsers(accountType);
  };

  return (
    <header className="flex flex-col lg:flex-row justify-between p-4 md:p-8 gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-2xl md:text-3xl">User Management</h1>
        <p className="text-sm text-black/60">View and manage all registered users in the system.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 md:gap-4 lg:self-end">
        <div 
          className="cursor-pointer hover:bg-gray-500/10 p-2 rounded-full transition-colors"
          onClick={() => window.location.reload()} 
        >
          <FiRefreshCcw size={18}/>
        </div>

        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-300 hover:bg-yellow-400 active:scale-95 transition-all font-medium shadow-sm cursor-pointer whitespace-nowrap"
          onClick={() => setToggleCreate(true)}
        >
          <span className="hidden sm:inline">Create Account</span>
          <span className="sm:hidden">Create</span>
          <FaPlus size={14} />
        </button>

        <div className="grow md:grow-0">
          <SearchBar type="account" />
        </div>

        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="min-w-25 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-between gap-2 focus:outline-none transition-all"
          >
            {selectedRole}
            <span className="text-[10px]">&#9662;</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-300 rounded-lg shadow-xl z-100 overflow-hidden">
              {["All", "Student", "Teacher"].map((role) => (
                <div
                  key={role}
                  onClick={() => selectRole(role)}
                  className="px-4 py-2 hover:bg-yellow-100 cursor-pointer text-sm"
                >
                  {role}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
export default UserManagement