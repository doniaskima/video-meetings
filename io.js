const socketIo = require("socket.io");
const debug = require("debug")("io");
const RoomModel = require("./models/room");
const config = require("./config");
const socketioJwt = require("socketio-jwt");

let io = null;

exports.io = function () {
  return io;
};

// ROOMS map keeps track of users connected to a room

const ROOMS = new Map();

exports.initialize = function (server) {
  io = socketIo(server);
  io.sockets
    .on(
      "connection",
      socketioJwt.authorize({
        secret: config.jwt.secret,
        callback: 15000,
      })
    )
    .on("authenticated", (socket) => {
      const user = socket.decoded_token;
      debug(`A user with '${user.identity}' identity connected`);
      socket.on("disconnecting", () => {
        debug(`A user with ${user.identity} identity disconnected`);
        const socketRooms = Object.keys(socket.rooms);
      });
    });
};
