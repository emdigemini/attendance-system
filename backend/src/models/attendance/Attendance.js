import mongoose from "mongoose"

const attendanceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classes",
    required: true
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },
  date: {
    type: String,
    required: true
  },
  acYear: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    required: true
  }
}, { timestamps: true });

attendanceSchema.index(
  { student_id: 1, subject_id: 1, date: 1 },
  { unique: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance