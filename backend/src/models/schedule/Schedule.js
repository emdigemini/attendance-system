import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  date: {
    type: Number,
    required: true
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Subject"
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Teacher"
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Class"
  },
  class_name: {
    type: String,
    required: true
  },
  timeFrom: {
    type: Date,
    required: true
  },
  timeTo: {
    type: Date,
    required: true
  },
});

scheduleSchema.index(
  { date: 1, subject_id: 1, teacher_id: 1, class_id: 1, class_name: 1, timeFrom: 1, timeTo: 1 },
  { unique: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule