const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ["Pending", "In Progress", "Completed", "Delayed"], default: "Pending" },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  timeLogs: [{ date: Date, hours: Number }],
  isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Task", taskSchema);
