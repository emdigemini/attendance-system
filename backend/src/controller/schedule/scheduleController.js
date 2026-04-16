import Schedule from "../../models/schedule/Schedule.js";
import Class from "../../models/Class.js";
import Subject from "../../models/subjects/Subject.js";
import { sliceToOne } from "../../lib/utils.js";

export const newSchedule = async (req, res) => {
  try {
    const teacher_id = req.params.id;
    const { date, subject_id, class_id, timeFrom, timeTo } = req.body;

    const classes = await Class.findOne({_id: class_id});
    const mySub = await Subject.findOne({_id: subject_id});

    if(!classes)
      return res.status(404).json({ message: "Failed to create, class not found." });

    if(!mySub)
      return res.status(404).json({ message: "Failed to create, subject not found." });

    const class_name = `${sliceToOne(classes.year)}${classes.block}`;

    await Schedule.create({teacher_id, date, subject_id, class_id, class_name, timeFrom, timeTo});

    res.status(200).json({ message: "Schedule created successfully." })
  } catch (err) {
    console.log("Error in newSchedule controller", err);
    if (err?.code === 11000) {
      return res.status(409).json({
        message: "This schedule already exists"
      });
    }
    res.status(500).json({ message: "Something went wrong." });
  }
}

export const updateSchedule = async (req, res) => {
  try {
    const { subject_id, date, timeFrom, timeTo } = req.body;

    if (!date || !timeFrom || !timeTo)
      return res.status(400).json({ message: "All fields are required." });

    const schedule = await Schedule.findByIdAndUpdate(req.params.id, 
      { date, timeFrom, timeTo }, { afterDocument: true }
    );

    if(!schedule)
      return res.status(404).json({ message: "Failed to save changes, schedule not found." });

    res.status(200).json({ message: "Schedule updated successfully!" });
  } catch (err) {
    console.log("Error in updateSchedule controller", err);
    res.status(500).json({ message: "Something went wrong." });
  }
}

export const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);

    if(!schedule)
      return res.status(404).json({ message: "Unable to delete. The schedule may not exist or has already been deleted." });

    res.status(200).json({ message: "Schedule deleted successfully!" });
  } catch (err) {
    console.log("Error in deleteSchedule controller", err);
    res.status(500).json({ message: "Something went wrong." });
  }
}

export const getStudentSchedule = async (req, res) => {
  try {
    let classIDs = req.query['classIDs[]'];
    let subjectIDs = req.query['subIDs[]'];

    subjectIDs = Array.isArray(subjectIDs)
      ? subjectIDs : subjectIDs?.split(",") || [];

    classIDs = Array.isArray(subjectIDs)
      ? classIDs : classIDs?.split(",") || [];

    const schedule = await Schedule.find({
      subject_id: { $in: subjectIDs }, 
      class_id: { $in: classIDs }
    }).populate("subject_id").sort({ timeFrom: 1 });

    res.status(200).json({ schedule });
  } catch (err) {
    console.log("Error in getStudentSchedule controller", err);
    res.status(500).json({ message: "Something went wrong." });
  }
}

export const getTeacherSchedule = async (req, res) => {
  try {
    const teacher_id = req.params.id;
    let subjectIDs = req.query['subIDs[]'];

    subjectIDs = Array.isArray(subjectIDs)
      ? subjectIDs
      : subjectIDs?.split(",") || [];

    const schedule = await Schedule.find({
      teacher_id,
      subject_id: { $in: subjectIDs } 
    }).populate("subject_id").sort({ timeFrom: 1 });

    res.status(200).json({ schedule });
  } catch (err) {
    console.log("Error in getTeacherSchedule controller", err);
    res.status(500).json({ message: "Something went wrong." });
  }
}