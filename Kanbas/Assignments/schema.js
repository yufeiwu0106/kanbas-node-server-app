import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: String,
    course: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModel" },
    description: String,
    availableDate: String,
    dueDate: String,
    untilDate: String,
    point: String,
  },
  { collection: "assignments" }
);

export default schema;
