import mongoose from "mongoose";

const accSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: props => `${props.value} is not a valid email`
    }
  },
  phoneNumber: {
    type: Number,
    default: null
  },
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  pfp: {
    type: String,
    default: ""
  },
  accountType: {
    type: String,
    required: true
  }
}, { 
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

// ====== Virtuals for populate ====== //
accSchema.virtual("student", {
  ref: "Student",
  localField: "_id",
  foreignField: "student_id",
  justOne: true
});

accSchema.virtual("teacher", {
  ref: "Teacher",
  localField: "_id",
  foreignField: "teacher_id",
  justOne: true
});

const Account = mongoose.model("Account", accSchema);

export default Account