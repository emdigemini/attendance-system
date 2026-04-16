import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true
  },
  block: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  sem: {
    type: String,
    required: true
  },
  acYear: {
    type: String,
    required: true
  },
  students: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Student",
    default: []
  }
}, { timestamps: true });

classSchema.index(
  { year: 1, block: 1, course: 1, sem: 1, acYear: 1 },
  { unique: true }
);

const Classes = mongoose.model("Classes", classSchema);

export default Classes