import mongoose from "mongoose"

const studentSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true
  }, 
  mySubject: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "Subject"
  },
  course: {
    type: String,
    default: ""
  },
  year: {
    type: String,
    default: ""
  },
  block: {
    type: String,
    default: ""
  },
  studentType: {
    type: String,
    default: ""
  },
  present: {
    type: Number,
    default: 0
  },
  absent: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

export default Student