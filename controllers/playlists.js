const Playlist = require("../models/playlist");
const { notFoundError, badRequestError } = require("../utils/errors");

const savePlaylistId = async (req, res, next) => {
  const { playlistId, adminId } = req.body;

  if (!(playlistId || adminId)) {
    throw new Error(badRequestError.message);
  }

  try {
    // Update the playlist ID in the database
    const updatedPlaylist = await Playlist.findOneAndUpdate(
      {},
      { playlistId, updatedBy: adminId, updatedAt: Date.now() },
      { new: true, upsert: true } // Create record if it doesn't exist
    );

    res.status(200).json({
      message: "Playlist updated successfully",
      playlist: updatedPlaylist,
    });
  } catch (err) {
    next(err);
  }
};

const getPlaylistId = async (req, res, next) => {
  try {
    const playlist = await Playlist.findOne({});
    if (!playlist) {
      throw new Error(notFoundError.message);
    }
    res.status(200).json({ playlistId: playlist.playlistId });
  } catch (err) {
    next(err);
  }
};

module.exports = { savePlaylistId, getPlaylistId };
