const socketIo = require("socket.io");
const debug = require("debug")("io");
const RoomModel = require("./models/room");
const config = require("./config");

let io = null;

exports.io = function() {
    return io;
};

// ROOMS map keeps track of users connected to a room

const ROOMS = new Map();


exports.initialize = function(server) {
    io = socketIo(server);
    io.sockets.on("connection", socketioJwt.authorize({

    }));
}