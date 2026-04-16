import { useContext } from "react"
import StudentDashboard from "./StudentDashboard"
import TeacherDashboard from "./TeacherDashboard"
import authContext from "../../context/authContext"

const Dashboard = () => {
  const { authorization } = useContext(authContext);

  return (
    <div className="h-full w-full flex justify-center items-center px-4 md:px-24">
      {authorization === 1
        ? <StudentDashboard />
        : <TeacherDashboard />}
    </div>
  )
}

export default Dashboard