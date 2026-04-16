import { Link, useLocation } from "react-router-dom"
import { FiLogOut } from "react-icons/fi";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { MdSubject } from "react-icons/md";
import { AiFillSchedule } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { useContext } from "react";
import authContext from "../../context/authContext";
import { transformFirstVal } from "../../lib/utils";

const courseLabel = {
  BSIT: "Information Technology",
  BSBA_MM: "Marketing Management",
  BSBA_FM: "Financial Management",
  BSBA_HRDM: "Human Resource Management",
  BSCS: "Computer Science",
  BSAIS: "Accounting Technology",
  BSOA: "Office Administration",
  BTVTED_FSM: "Food Service Management",
  BTVTED_ET: "Electrical Technology",
}

const StudentSidebar = ({ close }) => {
  const { logoutAccount, user } = useContext(authContext);
  const location = useLocation();

  const handleClick = () => {
    if (close) close();
  };

  return (
    <>
      <header className="px-4 py-6 flex gap-3 items-center">
        <div className="h-18.75 w-18.75"> 
          <img className="h-full w-full" src="/image/escr-logo.png" alt="" draggable={false} />
        </div>
        <div className="flex flex-col">
          <h1 className="font-bold text-4xl">ESCR</h1>
          <p className="text-sm text-black/50">Attendance System</p>
        </div>
      </header>

      <div className="border border-gray-300"></div>

      <div className="flex bg-[#FDEEEA] p-2 m-4 rounded-md">
        <div className="h-10 w-10 overflow-hidden rounded-4xl bg-white">
          <img className="h-full w-full object-cover object-center" src={user?.pfp || null} alt="" />
        </div>
        <div className="flex flex-col pl-2">
          <p className="font-semibold">{(user?.fname + " " + user?.lname)}</p>
          <p className="text-[12px] text-[#666]">{courseLabel[transformFirstVal(user?.profile?.course)]}</p>
        </div>
      </div>

      <div className="border border-gray-300"></div>

      <nav className="mt-12 flex flex-col p-4 gap-4">
        <Link onClick={handleClick} to="/dashboard"
        className={`flex items-center border-red-500 gap-1 font-semibold text-xl text-black/80 rounded-xl py-2 pl-4
        cursor-pointer hover:bg-Hnav/25 ${location.pathname === "/dashboard" ? "bg-Hnav/25" : "bg-nav"}`}
        >
          <TbLayoutDashboardFilled /> Dashboard
        </Link>
        <Link onClick={handleClick} to="/classrooms"
        className={`flex items-center gap-1 font-semibold text-xl text-black/80 rounded-xl py-2 pl-4
        cursor-pointer hover:bg-Hnav/25 ${location.pathname === "/classrooms" ? "bg-Hnav/25" : "bg-nav"}`}
        >
          <SiGoogleclassroom /> Classrooms
        </Link>
        <Link onClick={handleClick} to="/subjects"
        className={`flex items-center gap-1 font-semibold text-xl text-black/80 rounded-xl py-2 pl-4
        cursor-pointer hover:bg-Hnav/25 ${location.pathname === "/subjects" ? "bg-Hnav/25" : "bg-nav"}`}
        >
          <MdSubject /> Subjects
        </Link>
        <Link onClick={handleClick} to="/schedule"
        className={`flex items-center gap-1 font-semibold text-xl text-black/80 rounded-xl py-2 pl-4
        cursor-pointer hover:bg-Hnav/25 ${location.pathname === "/schedule" ? "bg-Hnav/25" : "bg-nav"}`}
        >
          <AiFillSchedule /> Schedule
        </Link>
        <Link onClick={handleClick} to="/profile"
        className={`flex items-center gap-1 font-semibold text-xl text-black/80 rounded-xl py-2 pl-4
        cursor-pointer hover:bg-Hnav/25 ${location.pathname === "/profile" ? "bg-Hnav/25" : "bg-nav"}`}
        >
          <FaUser /> Profile
        </Link>
      </nav>
      <div className="mt-auto"> 
        <div className="border-b border-black/40"></div>
        <div className="p-4">
          <button className="flex items-center gap-2 w-full text-left font-semibold text-xl text-red-600 hover:bg-red-50 p-4 rounded-xl transition-colors cursor-pointer"
          onClick={() => logoutAccount()}
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </>
  )
}

export default StudentSidebar