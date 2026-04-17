import bcrypt from "bcryptjs";
import Account from "../../models/accounts/Account.js";
import Student from "../../models/accounts/Student.js";
import Teacher from "../../models/accounts/Teacher.js";
import sendWelcomeEmail from "../../lib/nodemailer.js";
import jwt from "jsonwebtoken";
import Subject from "../../models/subjects/Subject.js";
import { pascalCaseFormat } from "../../lib/utils.js";

export const newAccount = async (req, res) => {
  try {
    const status = "create";
    const { accountType = "Student", email, fname, lname, username, password } = req.body;

    if(!fname || !lname || !username || !password)
      return res.status(400).json({ message: "All fields are required." });

    const emailExists = await Account.findOne({ email });
    const usernameExists = await Account.findOne({ username });

    if(emailExists)
      return res.status(400).json({ message: "Email already exists." });

    if(usernameExists)
      return res.status(400).json({ message: `${username} already taken.` });

    const fnameFormat = pascalCaseFormat(fname);
    const lnameFormat = pascalCaseFormat(lname);
    const hashedPassword = await bcrypt.hash(password, 12);

    const newAcc = await Account.create({ accountType, email, fname: fnameFormat, lname: lnameFormat, username, password: hashedPassword  });
    sendWelcomeEmail(status, email, fnameFormat, lnameFormat, username, password);

    if(accountType === "Student") {
      await Student.create({ student_id: newAcc._id });
    } else if(accountType === "Teacher") {
      await Teacher.create({ teacher_id: newAcc._id });
    } else {
      return res.status(400).json({ message: "Invalid account type." });
    }

    res.status(201).json({
      message: "Account created successfully.",
      account: {
        _id: newAcc._id,
        accountType: newAcc.accountType,
        email: newAcc.email,
        fname: newAcc.fname,
        lname: newAcc.lname,
        username: newAcc.username,
      }
    });

  } catch (err) {
    console.log("Error in newAccount controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getAccount = async (_, res) => {
  try {
    const accounts = await Account.find()
                .sort({ createdAt: -1 })
                .select("_id accountType email fname lname username");
    res.status(200).json({ accounts });
  } catch (err) {
    console.log("Error in getAccount controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const updateAccount = async (req, res) => {
  try {
    const status = "update";
    const { email, fname, lname, password } = req.body;

    const fullName = fname + " " + lname;
    const nameFormat = pascalCaseFormat(fullName);
    const hashedPassword = await bcrypt.hash(password, 12);
    const account = await Account.findByIdAndUpdate(req.params.id, 
      { password: hashedPassword }, { new: true })

    if(!account) 
      return res.status(404).json({ message: "Account not found." });
    sendWelcomeEmail(status, email, nameFormat, account.username, password);
    res.status(200).json({ message: "Password updated" });
  
  } catch (err) {
    console.log("Error in updateAccount controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedAccount = await Account.findByIdAndDelete(id);
    if(!deletedAccount)
      return res.status(404).json({ message: "Account not found, might have been already deleted." });

      await Student.deleteOne({ account_id: id });
      await Teacher.deleteOne({ account_id: id });
      await Subject.deleteMany({ teacher_id: id });

    return res.status(200).json({ message: "Account deleted successfully."});

  } catch (err) {
    console.log("Error in getAccount controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const loginAccount = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if(!username || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await Account.findOne({ username });

    if(!user)
      return res.status(400).json({ message: "Username not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch)
      return res.status(400).json({ message: "Invalid password." });

    let profile = null;
    if (user?.accountType === "Student") {
      profile = await Student.findOne({ student_id: user._id });
    } else if (user?.accountType === "Teacher") {
      profile = await Teacher.findOne({ teacher_id: user._id });
    }

    const DAYS = 30;

    const token = jwt.sign(
      {id: user._id},
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRES_IN || `${DAYS}D`}
    );


    res.cookie("client_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: DAYS * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ 
      message: "Login successfully",
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
      }
    })

  } catch (err) {
    console.log("Error in loginAccount controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const logoutAccount = async (_, res) => {
  try {
    res.clearCookie("client_token", {
      httpOnly: true,
      secure: true,
      sameSite: "lax"
    });

    res.status(200).json({ message: "Logged out" });
  } catch (err) {
    console.log("Error in logoutAccount controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}