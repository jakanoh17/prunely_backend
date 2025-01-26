const playlists = require("express").Router();

const { auth, adminAuth } = require("../middlewares/auth");
const { savePlaylistId, getPlaylistId } = require("../controllers/playlists");

playlists.post("/", auth, adminAuth, savePlaylistId);
playlists.get("/", auth, getPlaylistId);

module.exports = playlists;
