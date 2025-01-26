const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  playlistId: { type: String, required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin who updated
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Playlist", playlistSchema);
