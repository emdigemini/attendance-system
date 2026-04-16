import AuthProvider from './context/AuthProvider.jsx'
import ScheduleProvider from './context/Shedule/ScheduleProvider.jsx'
import ClassProvider from "./context/Classrooms/ClassProvider.jsx"
import SubjectProvider from './context/Subjects/SubjectProvider.jsx'
import TeacherProvider from './context/Teachers/TeacherProvider.jsx'
import StudentProvider from './context/Students/StudentProvider.jsx'
import AttendanceProvider from './context/Attendance/AttendanceProvider.jsx'

const Providers = ({ children }) => {
  return (
    <AuthProvider>
      <TeacherProvider>
        <StudentProvider>
          <ClassProvider>
            <SubjectProvider>
              <ScheduleProvider>
                <AttendanceProvider>
                  {children}
                </AttendanceProvider>
              </ScheduleProvider>
            </SubjectProvider>
          </ClassProvider>
        </StudentProvider>
      </TeacherProvider>
    </AuthProvider>
  )
}

export default Providers