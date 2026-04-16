import { useState } from "react"
import accountContext from "./AccountContext";
import { apiAccount } from "../../lib/axios.js"
import toast from "react-hot-toast";

const AccountProvider = ({ children }) => {
  const [ toggleCreate, setToggleCreate ] = useState(false);
  const [ users, setUsers ] = useState(null);
  const [ filteredUsers, setFilteredUsers ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ searchAcc, setSearchAcc ] = useState("");
  const [ selectedRole, setSelectedRole ] = useState("All");
  const [ delConfirm, setDelConfirm ] = useState(false);
  const [ delConfirm2, setDelConfirm2 ] = useState(false);
  const [ selectedAcc, setSelectedAcc ] = useState(null);
  const [ resetConfirm, setResetConfirm ] = useState(false);
  const [ passwordReset, setPasswordReset ] = useState({ reset: false, id:"", email: "", name:"", password: ""});


  const createAccount = async (cred) => {
    const toastId = toast.loading("Processing...");
    try {
      console.log(cred);
      await apiAccount.post("/user-accounts", cred);
      toast.dismiss(toastId);
      toast.success("Account created successfully");
      fetchUsers();
    } catch (err) {
      console.log("FAILED TO CREATE ACCOUNT", err);
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message);
    }
  }

  const updateAccount = async (cred) => {
    const toastId = toast.loading("Processing...");
    try {
      await apiAccount.put(`/user-accounts/${cred.id}`, cred);
      toast.dismiss(toastId);
      toast.success("Password has been reset successfully!");
      fetchUsers();
    } catch (err) {
      console.log("FAILED TO CREATE ACCOUNT", err);
      toast.dismiss(toastId);
      toast.error(err.message);
    }
  }

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiAccount.get("/user-accounts");
      setUsers(res.data.accounts);
      setFilteredUsers(res.data.accounts);
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (id) => {
    try {
      const res = await apiAccount.delete(`/user-accounts/${id}`);
      toast.success(res.data.message)
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  }

  return (
    <accountContext.Provider value={{ toggleCreate, setToggleCreate, createAccount, updateAccount, searchAcc,
    users, setUsers, filteredUsers, setFilteredUsers, fetchUsers, deleteAccount, loading, delConfirm, setSearchAcc,
    setDelConfirm, selectedAcc, setSelectedAcc, resetConfirm, setResetConfirm, passwordReset, setPasswordReset, setDelConfirm2, delConfirm2,
    selectedRole, setSelectedRole }}>
      {children}
    </accountContext.Provider>
  )
}

export default AccountProvider