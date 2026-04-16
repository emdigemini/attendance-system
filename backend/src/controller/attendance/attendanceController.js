import mongoose from "mongoose";
import Attendance from "../../models/attendance/Attendance.js";
import Student from "../../models/accounts/Student.js";
import Account from "../../models/accounts/Account.js";

export const newAttendance = async (req, res) => {
  try {
    const studentID = req.params.id;
    const { attId, classID, subjectID, date, acYear, status } = req.body;
    
    if(!["present", "absent"].includes(status)){
      res.status(400).json({ message: "Invalid status value." });
    }

    const student = await Student.findById(studentID)
    .populate("student_id", "fname lname email");

    if(!student)
      return res.status(404).json({ message: "Oops! Student not found." });

    const name = student.student_id.fname + " " + student.student_id.lname;

    if(attId){
      await Attendance.findByIdAndUpdate(
        attId, { status }, { returnDocument: 'after' }
      );

      return res.status(200).json({ message: `${name} Marked as ${status}` });;
    };

    await Attendance.create({
      student_id: studentID,
      class_id: classID,
      subject_id: subjectID,
      date: date,
      name, acYear, status
    });

    res.status(200).json({ message: `${name} Marked as ${status}` });
  } catch (err) {
    console.log("Error in newAttendance controller", err);
    res.status(500).json({ message: "Something went wrong." });
  }
}

export const checkAttendance = async (req, res) => {
  try {
    const { studentIDs, subID, date } = req.body;

    if (!studentIDs || !subID || !date) {
      return res.status(400).json({ message: "studentIDs, subID, and date are required." });
    }

    const subObjectID = new mongoose.Types.ObjectId(subID);
    const studentObjectIDs = studentIDs.map(id => new mongoose.Types.ObjectId(id));

    const attendanceResult = await Attendance.find({
      subject_id: subID,
      date
    });

    // count present and absent for each student - total for 1 specific subject
    const attCountRaw = await Attendance.aggregate([
      {
        $match: {
          subject_id: subObjectID,
          student_id: { $in: studentObjectIDs },
        }
      }, 
      {
        $group: {
          _id: "$student_id",
          present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } }
        }
      }
    ]);

    const attCount = attCountRaw.map(item => ({
      student_id: item._id,
      present: item.present,
      absent: item.absent
    }));

    const totalAttCountRaw = await Attendance.aggregate([
      { $match: { student_id: { $in: studentObjectIDs } } },
      {
        $group: {
          _id: "$student_id",
          totalPresent: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
          totalAbsent: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
        }
      }
    ]);

    const studentAttendanceUpdates = totalAttCountRaw.map(s => ({
      updateOne: {
        filter: { _id: s._id },
        update: {
          $set: {
            present: s.totalPresent,
            absent: s.totalAbsent
          }
        }
      }
    }));

    await Student.bulkWrite(studentAttendanceUpdates);

    res.status(200).json({
      attResults: attendanceResult,
      attCount,
    });

  } catch (err) {
    console.log("Error in checkAttendance controller", err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getAttRate = async (req, res) => {
  try {
    const { subIDs } = req.body;

    const subObjectID = subIDs.map(id => new mongoose.Types.ObjectId(id));
    const today = new Date().toISOString().slice(0, 10);

    // daily attendance rate
    const daily = await Attendance.aggregate([
      {
        $match: {
          subject_id: { $in: subObjectID },
          date: today
        }
      },
      {
        $group: {
          _id: null,
          present: {
            $sum: {
              $cond: [{ $eq: ["$status", "present"] }, 1, 0]
            }
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ["$status", "absent"] }, 1, 0]
            }
          }
        }
      }
    ]);

    const present = daily[0]?.present || 0;
    const absent = daily[0]?.absent || 0;

    const total = present + absent;
    const attRate = total === 0 ? 0 : ((present / total) * 100).toFixed(2);

    res.status(200).json({ attRate });
  } catch (err) {
    console.log("Error in getAttRate controller", err);
    res.status(500).json({ message: "Something went wrong." });
  }
}

export const getAttLeader = async (_, res) => {
  try {
    const studentIDs = await Student.find().select("_id");
    const ids = studentIDs.map(s => s._id);

    const totalAttCountRaw = await Attendance.aggregate([
      { $match: { student_id: { $in: ids } } },
      {
        $group: {
          _id: "$student_id",
          totalPresent: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1,0] } },
          totalAbsent: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } }
        }
      }
    ]);

    const studentAttendanceUpdates = totalAttCountRaw.map(s => ({
      updateOne: {
        filter: { _id: s._id },
        update: {
          $set: {
            present: s.totalPresent,
            absent: s.totalAbsent
          }
        }
      }
    }));

    await Student.bulkWrite(studentAttendanceUpdates);

    const attLeaderboard = await Account.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "student_id",
          as: "student"
        }
      },
      { $unwind: "$student" },
      { $sort: { "student.absent": -1 } },
      { $limit: 100 }
    ]);

    return res.status(200).json({ attLeaderboard });
  } catch (err) {
    console.log("Error in getAttLeader controller", err);
    res.status(500).json({ message: "Something went wrong." });
  }
}