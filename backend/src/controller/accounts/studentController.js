import Student from "../../models/accounts/Student.js";
import Account from "../../models/accounts/Account.js";
import Subject from "../../models/subjects/Subject.js";
import { pascalCaseFormat, currentSemester } from "../../lib/utils.js";

export const updateStudentInfo = async (req, res) => {
  try {
    const { fname, lname, email, phoneNumber, course, year, studentType } = req.body;
    const id = req.params.id;
    const updateData1 = {};
    const updateData2 = {};

    // for account model
    if(fname) updateData1.fname = pascalCaseFormat(fname);
    if(lname) updateData1.lname = pascalCaseFormat(lname);
    if(email) updateData1.email = email;
    if(phoneNumber) updateData1.phoneNumber = phoneNumber;

    // for student model
    if(course) updateData2.course = course;
    if(year) updateData2.year = year;
    if(studentType) updateData2.studentType = studentType;

    const account = await Account.findByIdAndUpdate(id,
      updateData1,
      { returnDocument: 'after' }
    )

    if (!account) {
      return res.status(404).json({ message: "Account not found." });
    }
    
    const profile = await Student.findOneAndUpdate(
      { student_id: id },
      updateData2,
      { returnDocument: 'after' }
    )

    if (!profile) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.status(200).json({ message: "Your profile has been saved!" });

  } catch (err) {
    console.log("Error in updateStudentInfo controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getStudentInfo = async (req, res) => {
  try {
    const studentID = req.params.id;

    if(!studentID) {
      return res.status(400).json({ message: "Student ID is required." });
    }

    const student = await Student.findOne({ student_id: studentID });

    if(!student)
      return res.status(404).json({ message: "No student information found for this account." });

    res.status(200).json({ student });

  } catch (err) {
    console.log("Error in getStudentInfo controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getStudentSubject = async (req, res) => {
  try {
    const studentID = req.params.id;

    if(!studentID) {
      return res.status(400).json({ message: "Student ID is required." });
    }

    const student = await Student.findOne({ student_id: studentID }).select("mySubject");

    if(!student)
      return res.status(404).json({ message: "No student information found for this account." });

    const getTeacherID = await Subject.find({ _id: { $in: student.mySubject } }).select("teacher_id");

    const teacherIDs = getTeacherID.map(s => s.teacher_id);

    const subject = await Subject.find({
      teacher_id: { $in: teacherIDs },
      _id: { $in: student.mySubject }
    }).populate("teacher_id", "fname lname").sort({ sem: -1 });

    res.status(200).json({ subject });
  } catch (err) {
    console.log("Error in getStudentSubject controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
} 

export const addSubjectForStudent = async (req, res) => {
  try {
    const { subjectID, year, course } = req.body;
    const studentID = req.params.id;
    const currentSem = currentSemester();

    if(!year)
      return res.status(400).json({ message: "Please provide your enrolled year level." });

    if(!course)
      return res.status(400).json({ message: "Course information is missing." });

    const studentDoc = await Student.findOne({ student_id: studentID });

    if (!studentDoc)
      return res.status(404).json({ message: "Student record not found." });

    const subject = await Subject.findOne({
      _id: subjectID,
      course
    });

    if(studentDoc.studentType.toLowerCase() === "regular"){
      const cannotAdd = await Subject.findOne({
        _id: subjectID,
        year,
        course
      });
      if(!cannotAdd)
        return res.status(404).json({ message: "Oops! does not match your year level or course." });
    }

    const subSem = subject.sem;

    if(subSem !== currentSem)
      return res.status(409).json({ message: "Subject is not available this semester." });

    const student = await Student.findOneAndUpdate(
      { student_id: studentID }, 
      { $addToSet: { mySubject:  subjectID} },
      { returnDocument: 'after' }
    );  

    res.status(200).json({
      message: "Subject has been successfully added.",
      student
    });

  } catch (err) {
    console.log("Error in addSubjectForStudent controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const removeSubjectForStudent = async (req, res) => {
  try {
    const { subjectID } = req.body;

    if(!subjectID) 
      return res.status(404).json({ message: "oops! subject not found." });

    await Student.findOneAndUpdate(
      { student_id: req.params.id },
      { $pull: { mySubject: subjectID } }
    );

    res.status(200).json({ message: "Subject has been removed from your list." });

  } catch (err) {
    console.log("Error in removeSubjectForStudent controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}