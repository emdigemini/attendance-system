import { useContext, useEffect } from "react";
import { generatePassword } from "../../lib/autoGenerate";
import accountContext from "../../context/userManagement/AccountContext";
import { ClipLoader } from "react-spinners";

const AccountList = () => {
  const { fetchUsers, loading, filteredUsers } = useContext(accountContext);

  useEffect(() => {
    fetchUsers()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white border-2 border-black/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="hidden xl:block h-175 overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50 border-b border-black/10">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">Type</th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">Email</th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">Name</th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">Username</th>
              <th className="text-center px-6 py-4 text-xs font-semibold uppercase text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-10 text-center">
                  <ClipLoader color="#FBBF24" size={40} />
                </td>
              </tr>
            ) : <AllListDesktop />}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="xl:hidden">
        {loading ? (
           <div className="p-10 text-center"><ClipLoader color="#FBBF24" size={40} /></div>
        ) : <AllListMobile />}
      </div>
    </div>
  )
}

const AllListDesktop = () => {
  const { setDelConfirm, setSelectedAcc, setResetConfirm, setPasswordReset, filteredUsers } = useContext(accountContext);

  return (
    <>
      {filteredUsers.length > 0 ? filteredUsers.map((user) => (
        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 text-sm">{user.accountType}</td>
          <td className="px-6 py-4 text-sm truncate max-w-37.5">{user.email}</td>
          <td className="px-6 py-4 text-sm font-medium">{user.fname} {user.lname}</td>
          <td className="px-6 py-4 text-sm text-gray-600">{user.username}</td>
          <td className="px-6 py-4">
            <div className="flex gap-2 justify-center">
               <button onClick={() => { setResetConfirm(true); setPasswordReset({...user, password: generatePassword()}) }} className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition cursor-pointer">Reset</button>
               <button onClick={() => { setSelectedAcc(user); setDelConfirm(true); }} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer">Delete</button>
            </div>
          </td>
        </tr>
      )) : (
        <tr><td colSpan={5} className="text-center py-10 text-gray-400">No accounts found.</td></tr>
      )}
    </>
  )
}

const AllListMobile = () => {
  const { setDelConfirm, setSelectedAcc, setResetConfirm, setPasswordReset, filteredUsers } = useContext(accountContext);

  if (filteredUsers.length === 0) return <div className="p-10 text-center text-gray-400">No accounts found.</div>

  return (
    <div className="divide-y divide-gray-100">
      {filteredUsers.map((user) => (
        <div key={user._id} className="p-4 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-lg">{user.fname} {user.lname}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">{user.accountType}</p>
            </div>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{user.username}</span>
          </div>
          <p className="text-sm text-gray-600 truncate">{user.email}</p>
          <div className="flex gap-2 mt-2">
            <button onClick={() => { setResetConfirm(true); setPasswordReset({...user, password: generatePassword()}) }} className="flex-1 py-2 bg-yellow-50 text-yellow-700 text-sm font-medium rounded-lg">Reset Password</button>
            <button onClick={() => { setSelectedAcc(user); setDelConfirm(true); }} className="flex-1 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-lg">Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AccountList;