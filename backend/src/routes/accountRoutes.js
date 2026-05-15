import express from "express";
import { newAccount, getAccount, updateAccount, deleteAccount,
  loginAccount, logoutAccount
 } from "../controller/accounts/accountsController.js";
import authentication from "../middleware/authentication.js";
import Account from "../models/accounts/Account.js";
import Student from "../models/accounts/Student.js";
import Teacher from "../models/accounts/Teacher.js";

const router = express.Router();

/* for admin routes */
router.post("/user-accounts", newAccount);
router.get("/user-accounts", getAccount);
router.put("/user-accounts/:id", updateAccount);
router.delete("/user-accounts/:id", deleteAccount);
/* for client routes */
router.post("/login", loginAccount);
router.post("/logout", logoutAccount);
router.get("/my-account", authentication, async (req, res) => {
  try {
    let profile = null;
    const user = await Account.findById(req.user.id);

    if (user?.accountType === "Student") {
      profile = await Student.findOne({ student_id: user._id });
    } else if (user?.accountType === "Teacher") {
      profile = await Teacher.findOne({ teacher_id: user._id });
    }
    
    if(!user)
      return res.status(404).json({ message: "Account not found." });

    res.status(200).json({ 
      message: `Welcome to Dashboard ${user.fname} ${user.lname}`,
      user: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        username: user.username,
        accountType: user.accountType,
        pfp: user.pfp,
        profile
      },
    })

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router