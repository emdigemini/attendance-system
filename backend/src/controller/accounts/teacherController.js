import { pascalCaseFormat } from "../../lib/utils.js";
import Account from "../../models/accounts/Account.js";
import Teacher from "../../models/accounts/Teacher.js";

export const getTeacherInfo = async (req, res) => {
  try {
    const teacherID = req.params.id;

    if(!teacherID) {
      return res.status(400).json({ message: "Teacher ID is required." });
    }

    const teacher = await Teacher.findOne({ teacher_id: teacherID });

    if(!teacher)
      return res.status(404).json({ message: "No teacher information found for this account." });

    res.status(200).json({ teacher });

  } catch (err) {
    console.log("Error in getStudentInfo controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const updateTeacherInfo = async (req, res) => {
  try {
    const { fname, lname, email, phoneNumber, specialization, graduatedAt, employmentType } = req.body;
    const id = req.params.id;
    const updateData1 = {};
    const updateData2 = {};

    // for account model
    if(fname) updateData1.fname = pascalCaseFormat(fname);
    if(lname) updateData1.lname = pascalCaseFormat(lname);
    if(email) updateData1.email = email;
    if(phoneNumber) updateData1.phoneNumber = phoneNumber;

    // for teacher model
    if(specialization) updateData2.specialization = specialization;
    if(graduatedAt) updateData2.graduatedAt = graduatedAt;
    if(employmentType) updateData2.employmentType = employmentType;

    const account = await Account.findByIdAndUpdate(id,
      updateData1,
      { returnDocument: 'after' }
    )

    if (!account) {
      return res.status(404).json({ message: "Account not found." });
    }
    
    const profile = await Teacher.findOneAndUpdate(
      { teacher_id: id },
      updateData2,
      { returnDocument: 'after' }
    )

    if (!profile) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    res.status(200).json({ message: "Your profile has been saved!" });

  } catch (err) {
    console.log("Error in updateTeacherInfo controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
