import mongoose from "mongoose"

const teacherSchema = new mongoose.Schema({
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true
  },
  specialization: {
    type: String,
    default: ""
  },
  graduatedAt: {
    type: String,
    default: ""
  },
  employmentType: {
    type: String,
    default: ""
  },
  availability: {
    time: { type: String, default: "" },
    day: { type: String, default: "" }
  }
}, { timestamps: true });

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher