import { useContext } from "react";
import accountContext from "../../context/userManagement/AccountContext";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

export const DeleteConfirmation = () => {
  const { setDelConfirm, setDelConfirm2, selectedAcc } = useContext(accountContext);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    cancelButtonRef.current.focus();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/35 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-80 p-6 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-800">Delete Account</h2>
        <p className="text-gray-600">
          Are you sure you want to delete <span className="font-medium">{selectedAcc.fname} {selectedAcc.lname}</span>? 
          Deleting this account will permanently remove all data associated with this user. 
          This action <span className="font-medium">cannot be undone</span>.
        </p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setDelConfirm(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer focus:border-black"
            ref={cancelButtonRef}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setDelConfirm(false);
              setDelConfirm2(true);
            }}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition cursor-pointer focus:border-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export const ResetPasswordModal = () => {
  const { passwordReset, setPasswordReset } = useContext(accountContext);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 bg-opacity-50">
      {/* Modal card */}
      <div className="bg-white rounded-xl shadow-xl p-6 w-105 text-center relative">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Password has been reset successfully!
        </h2>
        <p className="text-gray-700 mb-2">
          The password for <span className="font-medium">{passwordReset.name}</span> has been reset.
        </p>
        <p>
          New Password: 
          <input type="text" value={passwordReset.password} readOnly
          className="bg-gray-100 font-mono rounded-lg p-2 ml-2 text-gray-900 text-lg inline-block mb-4" />
        </p>
        <button
          onClick={() => setPasswordReset({reset: false})}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export const ResetPasswordConfirmation = () => {
  const { setResetConfirm, passwordReset, setPasswordReset, updateAccount } = useContext(accountContext);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-96 text-center relative">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Confirm Password Reset
        </h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to reset the password for <span className="font-medium">{passwordReset.fname} {passwordReset.lname}</span>?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setPasswordReset(prev => ({ ...prev, reset: true}));
              setResetConfirm(false);
              updateAccount(passwordReset);
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
          >
            Confirm
          </button>
          <button
            onClick={() => setResetConfirm(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export const DeleteConfirmation2 = () => {
  const { setDelConfirm2, deleteAccount, selectedAcc } = useContext(accountContext);
  const [ confirmKey, setConfirmKey ] = useState("");

  const delAcc = () => {
    deleteAccount(selectedAcc.id);
    setConfirmKey("");
    setDelConfirm2(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-bold mb-4 text-red-600">Confirm Deletion</h3>
        <p className="text-gray-700 mb-4">
          Type <span className="font-medium">{selectedAcc.fname} {selectedAcc.lname}</span> to confirm deleting this account. 
          This action <span className="font-medium">cannot be undone</span>.
        </p>
        <input
          type="text"
          placeholder="Type it here to confirm"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
          onChange={(e) => setConfirmKey(e.target.value)}
          value={confirmKey}
        />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 cursor-pointer"
          onClick={() => {
            setDelConfirm2(false);
            setConfirmKey("");
          }}>
            Cancel
          </button>
          <button className={`px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white 
          ${confirmKey === (selectedAcc.fname + " " + selectedAcc.lname) ? "cursor-pointer" : "cursor-not-allowed"}`}
          onClick={() => delAcc()}
          disabled={confirmKey === (selectedAcc.fname + " " + selectedAcc.lname) ? false : true}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
