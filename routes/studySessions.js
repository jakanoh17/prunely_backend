const studySessions = require("express").Router();

const { auth } = require("../middlewares/auth");
const {
  createStudySession,
  getStudySessions,
  deleteStudySession,
} = require("../controllers/studySessions");

studySessions.post("/", auth, createStudySession);
studySessions.get("/", auth, getStudySessions);
studySessions.delete("/:sessionId", auth, deleteStudySession);

module.exports = studySessions;
