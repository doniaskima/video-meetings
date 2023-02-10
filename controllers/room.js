const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  owner: {
    type: String,
  },
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
