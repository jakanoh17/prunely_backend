const {
  badRequestError,
  notFoundError,
  forbiddenError,
} = require("../utils/errors");
const { reformatDataForFreqUsedLabels } = require("../utils/dataReformatter");
const StudySession = require("../models/studySession");

const createStudySession = async (req, res, next) => {
  const { sessionName, intervals, elapsedTime, overallTime } = req.body;

  if (!(sessionName || intervals || elapsedTime || overallTime))
    throw new Error(badRequestError.message);

  try {
    const newSession = await StudySession.create({
      sessionName,
      intervals,
      overallTime,
      owner: req.user._id,
    });
    res.status(201).send(newSession);
  } catch (err) {
    next(err);
  }
};

const getStudySessions = async (req, res, next) => {
  try {
    const sessions = await StudySession.find({ owner: req.user._id }).orFail(
      () => new Error(notFoundError.message)
    );
    res.status(200).json({
      data: sessions,
      freqLabels: reformatDataForFreqUsedLabels(sessions),
    });
  } catch (err) {
    next(err);
  }
};

const deleteStudySession = async (req, res, next) => {
  try {
    const foundSession = await StudySession.findById(
      req.params.sessionId
    ).orFail(new Error(notFoundError.message));
    if (req.user._id !== foundSession.owner.id.toString("hex")) {
      throw new Error(forbiddenError.message);
    }
    await StudySession.findByIdAndRemove(req.params.sessionId);
    res.send({
      message: `Session: "${foundSession.sessionName}" has been been deleted`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createStudySession, getStudySessions, deleteStudySession };
