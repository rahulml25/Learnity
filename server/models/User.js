import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "instructor"], required: true },

    goals: [String],
    skills: [String],
    location: String,
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],

    expertise: [String],
    experience: [
      {
        role: { type: String, required: true },
        company: { type: String, required: true },
        years: { type: Number, required: true },
      },
    ],
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
      website: String,
    },
    createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.models.User ?? mongoose.model("User", userSchema);
