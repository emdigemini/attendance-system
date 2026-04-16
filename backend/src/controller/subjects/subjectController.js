import { currentSemester, currentAcYear } from "../../lib/utils.js";
import Account from "../../models/accounts/Account.js";
import Classes from "../../models/Class.js";
import Subject from "../../models/subjects/Subject.js";

export const newSubject = async (req, res) => {
  try {
    const { course, year, acYear, sem, room, name } = req.body;

    const clean_room = room?.trim();
    const clean_name = name?.trim();
    
    if(!course || !year || !acYear || !sem || !clean_room || !clean_name)
      return res.status(400).json({ message: "All fields are required" });

    await Subject.create({ teacher_id: req.params.id, course, year, acYear, sem, room: clean_room, name: clean_name });

    res.status(200).json({ 
      message: "Subject added successfully",
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "This class/subject already exists."
      });
    }
    console.log("Error in newSubject controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteSubject = async (req, res) => {
  try {
    const sub = await Subject.findByIdAndDelete(req.params.id);
    if(!sub)
      return res.status(404).json({ message: "Failed to delete subject: not found or already deleted." });

    res.status(200).json({ message: "Subject deleted succesfully." });
  } catch (err) {
    console.log("Error in deleteSubject controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const updateSubject = async (req, res) => {
  try {
    const { name, room } = req.body;

    const newSub = await Subject.findByIdAndUpdate(
      req.params.id,
      { name, room },
      { afterDocument: true }
    );

    if(!newSub)
      return res.status(404).json({ message: "Failed to update subject: not found." });

    res.status(200).json({ message: "Subject updated successfully." });

  } catch (err) {
    console.log("Error in updateSubject controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getMySubject = async (req, res) => {
  try {
    const subject = await Subject.find({ teacher_id: req.params.id })
    .sort({ year: -1, sem: -1, acYear: -1 }).populate("teacher_id", "fname lname");

    res.status(200).json({
      subject
    });
  } catch (err) {
    console.log("Error in getMySubject controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getAllSubject = async (_, res) => {
  try {
    const subject = await Subject.find().populate("teacher_id", "fname lname")
    .sort({ year: -1, sem: -1, acYear: -1 });
    res.status(200).json({
      subject
    });
  } catch (err) {
    console.log("Error in getAllSubject controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getClassForSubject = async (req, res) => {
  try {
    const { classes } = req.body;
    const id = req.params.id;

    const yourSub = await Subject.findById(id);

    if (!yourSub) {
      return res.status(404).json({ message: "Subject not found" });
    }
    
    const classIDs = classes.filter(c => c.year === yourSub.year && c.sem === yourSub.sem && c.acYear === yourSub.acYear && c.course === yourSub.course)
    .map(c => c._id);

    await Subject.findByIdAndUpdate(id, {
      totalClasses: classIDs
    });

    const classData = await Classes.find({ _id: {$in: classIDs} }).sort({ block: 1 });

    res.status(200).json({
      classes: classData
    });
  } catch (err) {
    console.log("Error in getClassForSubject controller", err);
    res.status(500).json({ message: "Unable to load classes. Please try again later." });
  }
}

export const getSubjectForAttendance = async (req, res) => {
  try {
    const mySubjectID = req.params.id;
    const currentSem = currentSemester();
    const currentACYear = currentAcYear();

    const subject = await Subject.find({ teacher_id: mySubjectID, sem: currentSem, acYear: currentACYear })
    .sort({ acYear: -1, sem: -1 })
    const allClassIDs = subject.flatMap(s => s.totalClasses);

    const classes = await Classes.find(
      { _id: { $in: allClassIDs } }
    ).sort({ block: 1 });

    const merged = subject.map(sub => {
      const myClasses = classes.filter(c => 
        sub.totalClasses.includes(c._id)
      )

      return {
        ...sub.toObject(),
        classes: myClasses
      }
    });

    res.status(200).json({
      myClass: merged
    });

  } catch (err) {
    console.log("Error in getSubjectForAttendance controller", err);
    res.status(500).json({ message: "Unable to load classes. Please try again later." });
  }
}

export const getStudentsForAttendance = async (req, res) => {
  try {
    const classes = await Classes.findById(req.params.id);

    if(!classes)
      return res.status(404).json({ message: "Class not found, try again later." });

    const students = await Account.find(
      { _id: { $in: classes.students } }
    ).populate("student").select("-password").sort({ lname: 1 });

    res.status(200).json({students});
  } catch (err) {
    console.log("Error in getStudentsForAttendance controller", err);
    res.status(500).json({ message: "Unable to load students. Please try again later." });
  }
}