import AccountList from "../userManagement/AccountList"
import accountContext from "../../context/userManagement/AccountContext"
import { useContext, useEffect, useState } from "react"
import { DeleteConfirmation, DeleteConfirmation2, ResetPasswordModal, ResetPasswordConfirmation } from "../userManagement/AccountActions"
import { SearchBar } from "../controllers/Controllers"
import classContext from "../../context/classManagement/ClassContext"
import ClassList from "../classManagement/ClassList.jsx"
import { thisYear } from "../../lib/utils.js"
import adminContext from "../../context/admin/adminContext.jsx"

const Dashboard = () => {
  const { delConfirm, delConfirm2, resetConfirm, passwordReset } = useContext(accountContext);
  const [active, setActive] = useState(0);

  return (
    /* Removed h-screen to prevent content overflow; added responsive padding */
    <div className="bg-[#F4F4F4] min-h-screen w-full flex flex-col items-center py-6 px-4 md:px-10 lg:px-24">
      <div className="w-full max-w-7xl flex flex-col gap-8">
        
        {/* Statistics Section */}
        <ModalCards />

        <div className="flex flex-col w-full">
          {/* Controls Header */}
          <div className="flex flex-col sm:flex-row gap-4 pb-6 justify-between items-start sm:items-center">
            <div className="flex gap-2 p-1 bg-black/5 rounded-xl">
              <button 
                className={`px-6 py-2 rounded-lg transition-all duration-200 font-medium cursor-pointer ${
                  active === 0 ? 'bg-white shadow-md text-black' : 'text-gray-500 hover:text-black'
                }`}
                onClick={() => setActive(0)}
              >
                Accounts
              </button>
              <button 
                className={`px-6 py-2 rounded-lg transition-all duration-200 font-medium cursor-pointer ${
                  active === 1 ? 'bg-white shadow-md text-black' : 'text-gray-500 hover:text-black'
                }`}
                onClick={() => setActive(1)}
              >
                Classes
              </button>
            </div>
            
            {active === 0 && (
              <div className="w-full sm:w-auto">
                <SearchBar type="account" />
              </div>
            )}
          </div>

          {/* List Section - Now grows with content instead of overlapping */}
          <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
            {active === 0 && <AccountList />}
            {active === 1 && <ClassList dashboard={true} />}
          </div>
        </div>
      </div>

      {/* Modals */}
      {delConfirm && <DeleteConfirmation />}
      {delConfirm2 && <DeleteConfirmation2 />}
      {resetConfirm && <ResetPasswordConfirmation />}
      {passwordReset.reset && <ResetPasswordModal />}
    </div>
  );
};

const ModalCards = () => {
  const { users } = useContext(accountContext);
  const { adminData } = useContext(adminContext);
  const { classList, fetchClasses } = useContext(classContext);

  useEffect(() => {
    if(adminData?.id){
      fetchClasses();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminData?.id]);

  const countTotal = (type) => {
    return (users ?? []).reduce((acc, user) => 
      user.accountType.toLowerCase() === type.toLowerCase() ? acc + 1 : acc, 0
    );
  };

  const countCourse = () => {
    const courses = (classList ?? []).map(classes => classes.course.split(" ")[0]);
    return new Set(courses).size;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
      <Card title="Total Class" value={classList?.length || 0} subtext={thisYear()} />
      <Card title="Total Courses" value={countCourse()} font-bold text-4xl subtext={thisYear()} />
      <Card title="Total Profs" value={countTotal("teacher")} subtext={thisYear()} />
      <Card title="Total Students" value={countTotal("student")} subtext="This Semester" />
    </div>
  );
};

/* Reusable Card component para malinis ang code at consistent ang padding */
const Card = ({ title, value, subtext }) => (
  <div className="flex flex-col items-center justify-center bg-white p-6 h-36 rounded-2xl shadow-sm border border-black/5 hover:border-yellow-400 transition-all duration-300">
    <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wider text-center">{title}</h3>
    <p className="font-bold text-3xl md:text-4xl my-1">{value}</p>
    <p className="text-xs text-gray-400">{subtext}</p>
  </div>
);

export default Dashboard