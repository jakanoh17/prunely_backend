const mongoose = require("mongoose");

const intervalSchema = new mongoose.Schema({
  labels: { type: [String], default: [] },
  elapsedTime: {
    type: Number,
    required: true,
  },
});

const studySessionSchema = new mongoose.Schema({
  sessionName: { type: String, required: true },
  intervals: {
    type: Map,
    of: intervalSchema,
  },
  overallTime: {
    type: Number,
    required: true,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  createdAt: { type: Date, default: Date.now, expires: 7776000 }, // 90 days
});

// Middleware to validate `overallTime` before saving
studySessionSchema.pre("save", function (next) {
  const intervalsArray = Array.from(this.intervals.values());
  const totalElapsedTime = intervalsArray.reduce(
    (total, interval) => total + interval.elapsedTime,
    0
  );

  if (this.overallTime < totalElapsedTime) {
    const err = new Error(
      `Overall time (${this.overallTime}) is smaller than the total elapsed time (${totalElapsedTime}).`
    );
    return next(err);
  }

  return next();
});

module.exports = mongoose.model("studySession", studySessionSchema);
