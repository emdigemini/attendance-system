import { Link, useLocation } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { MdManageAccounts, MdSubject } from "react-icons/md";
import { useContext } from "react";
import adminContext from "../context/admin/adminContext";

const SideBar = ({ close }) => {
  const { logoutAdmin, adminData } = useContext(adminContext);
  const location = useLocation();

  const handleClick = () => {
    if (close) close();
  };

  const linkClass = (path) =>
    `flex items-center gap-2 font-semibold text-xl rounded-xl py-2 pl-4
     hover:bg-Hnav/25 transition-colors
     ${location.pathname === path ? "bg-Hnav/25" : "bg-nav"}`;

  return (
    <div className="bg-[#fdfdfd] flex flex-col h-full w-72 shadow-xl select-none">

      {/* Header */}
      <header className="px-4 py-6 flex gap-3 items-center">
        <div className="h-16 w-16">
          <img src="/image/escr-logo.png" className="h-full w-full" />
        </div>
        <div>
          <h1 className="font-bold text-3xl">ESCR</h1>
          <p className="text-sm text-black/50">System Administrator</p>
        </div>
      </header>

      <div className="border border-gray-300" />

      {/* Nav */}
      <div className="flex items-center p-6 gap-3">
        <h2 className="font-mono text-xl font-black uppercase tracking-widest text-slate-900">
          {adminData?.name}
        </h2>
      </div>
      <nav className="mt-10 flex flex-col p-4 gap-4">

        <Link to="/dashboard" onClick={handleClick} className={linkClass("/dashboard")}>
          <TbLayoutDashboardFilled /> Dashboard
        </Link>

        <Link to="/user-management" onClick={handleClick} className={linkClass("/user-management")}>
          <MdManageAccounts /> User Management
        </Link>

        <Link to="/class-management" onClick={handleClick} className={linkClass("/class-management")}>
          <MdSubject /> Class Management
        </Link>
      </nav>

      {/* Logout */}
      <div className="mt-auto p-4">
        <div className="border-b border-black/40"></div>
        <button
          onClick={logoutAdmin}
          className="flex items-center gap-2 w-full text-red-600 font-semibold text-xl p-4 rounded-xl hover:bg-red-50 cursor-pointer"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
};

export default SideBar;