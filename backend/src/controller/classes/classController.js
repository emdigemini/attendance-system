import Account from "../../models/accounts/Account.js";
import Student from "../../models/accounts/Student.js";
import Classes from "../../models/Class.js";
import Subject from "../../models/subjects/Subject.js";
import { currentSemester } from "../../lib/utils.js";

export const newClass = async (req, res) => {
  try {
    const { year, block, course, sem, acYear } = req.body;
    
    if(!year || !block || !course || !sem || !acYear)
      return res.status(400).json({ message: "All fields are required." });

    const classes = await Classes.create({ year, block, course, sem, acYear });
    
    const currentClasses = await Classes.find({
      year: classes.year,
      sem: classes.sem,
      acYear: classes.acYear,
      course: classes.course
    }).select('_id').lean();

    const currentClassIDs = currentClasses.map(c => c._id);

    await Subject.updateMany(
      { year, sem, acYear, course }, 
      { totalClasses: currentClassIDs }
    );

    res.status(201).json({
      message: "Class added successfully.",
      classes
    });
    
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "This class already exists."
      });
    }
    console.log("Error in newClass controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getClass = async (req, res) => {
  try {
    const { studentID, course, year } = req.query;
    const currentSem = currentSemester();

    let classes;
    if (studentID && course && year) {
      const student = await Student.findOne({ student_id: studentID });

      if (student.studentType.toLowerCase() === "irregular") {
        classes = await Classes.find({ course, sem: currentSem })
        .sort({ year: -1, block: 1 });
      } else {
        classes = await Classes.find({ course, year, sem: currentSem })
          .sort({ year: -1, block: 1 });
      }
    } else {
      classes = await Classes.find()
        .sort({ year: -1, block: 1 });
    }
    res.status(200).json({classes});
  } catch (err) {
    console.log("Error in getClass controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getRecentClass = async (_, res) => {
  try {
    const classes = await Classes.find()
    .sort({ createdAt: -1 })
    .limit(12);
    res.status(200).json({classes});
  } catch (err) {
    console.log("Error in getRecentClass controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteClass = async (req, res) => {
  try {
    const deletedClass = await Classes.findByIdAndDelete(req.params.id);
    if(!deletedClass)
      return res.status(404).json({ message: "Class not found." });

    res.status(200).json({ message: "Class deleted successfully." });
  } catch (err) {
    console.log("Error in newClass controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const joinClass = async (req, res) => {
  try {
    const { studentID } = req.body;
    const classID = req.params.id;
    const currentSem = currentSemester();

    const student = await Student.findOne({ student_id: studentID });

    if (!student)
      return res.status(404).json({ message: "Student not found." });

    const classDoc = await Classes.findById(classID);

    if (!classDoc)
      return res.status(404).json({ message: "Class not found." });

    if (student.studentType.toLowerCase() === "regular") {

      if (student.year !== classDoc.year) {
        return res.status(400).json({
          message: "Cannot join class: year level does not match."
        });
      }

      if (student.course !== classDoc.course) {
        return res.status(400).json({
          message: "Cannot join class: course does not match."
        });
      }

      const existingSemClass = await Classes.findOne({
        students: studentID,
        sem: currentSem
      });

      if (existingSemClass) {
        return res.status(400).json({
          message: "Regular students can only join one class per semester."
        });
      }
    }

    if (student.studentType.toLowerCase() === "irregular") {
      const existingYearClass = await Classes.findOne({
        students: studentID,
        year: classDoc.year
      });

      if (existingYearClass) {
        return res.status(400).json({
          message: `Irregular students can only join ONE class in ${classDoc.year}`
        });
      }
    }

    await Classes.findByIdAndUpdate(
      classID,
      { $addToSet: { students: studentID } }
    );

    return res.status(200).json({
      message: "Successfully joined this classroom"
    });

  } catch (err) {
    console.log("Error in joinClass controller", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getStudentsFromClass = async (req, res) => {
  try {
    const classes = await Classes.findById(req.params.id).select("students");

    if(!classes)
      return res.status(404).json({ message: "Class not found." })

    const classStudents = await Account.find({
      _id: { $in: classes.students }
    }).
    populate("student", "studentType").sort({ lname: 1 });

    res.status(200).json({
      classStudents
    });

  } catch (err) {
    console.log("Error in getStudentsFromClass controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const removeClassroom = async (req, res) => {
  try {
    const { studentID } = req.body;

    await Classes.findByIdAndUpdate(
      req.params.id,
      { $pull: { students: studentID } }
    )

    res.status(200).json({ message: "Classroom removed, please refresh the page." });

  } catch (err) {
    console.log("Error in removeClassroom controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getMyClass = async (req, res) => {
  try {
    const studentID = req.params.id;

    const myClass = await Classes.find({
      students: { $in: studentID }
    }).sort({ sem: -1, year: -1 });

    res.status(200).json({
      classes: myClass
    });

  } catch (err) {
    console.log("Error in getMyClass controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
} 
