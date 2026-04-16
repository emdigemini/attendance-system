import { useContext } from "react";
import authContext from "../../context/authContext";
import StudentSidebar from "./StudentSidebar";
import TeacherSidebar from "./TeacherSidebar";

const Sidebar = ({ close }) => {
  const { user } = useContext(authContext);

  return (
    <div className="bg-[#fdfdfd] flex flex-col h-full min-w-68.75 shadow-xl select-none">
      {user?.accountType === "Student" && <StudentSidebar close={close} />}
      {user?.accountType === "Teacher" && <TeacherSidebar close={close} />}
    </div>
  )
}

export default Sidebar