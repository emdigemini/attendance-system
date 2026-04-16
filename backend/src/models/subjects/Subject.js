import mongoose from "mongoose"

const subjectSchema = new mongoose.Schema({
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true
  },
  course: {
    type: String,
    required: true
  },
  acYear: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  sem: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  totalStudents: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  },
  totalClasses: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  }
}, { timestamps: true });

subjectSchema.index(
  { course: 1, year: 1, sem: 1, acYear: 1, name: 1 },
  { unique: true }
) 

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject