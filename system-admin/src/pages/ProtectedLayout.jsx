import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useState } from "react";
import { HiOutlineMenu } from "react-icons/hi";

const ProtectedLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden">

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`
          fixed md:static z-50 h-screen transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <SideBar close={() => setOpen(false)} />
      </div>

      <div className="flex flex-col flex-1 h-screen overflow-y-auto">

        <div className="md:hidden flex items-center p-4 border-b sticky top-0 bg-white z-10">
          <button onClick={() => setOpen(true)}>
            <HiOutlineMenu size={24} />
          </button>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;