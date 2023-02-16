const socketIo = require("socket.io");
const debug = require("debug")("io");
const RoomModel = require("./Models/Room");
const config = require("./config");

let io = null;

exports.io = function() {
    return io;
};

//ROOMS map keeps  track of users connected to a room
const ROMMS = new Map();

exports.initialize = function(server) {
    io = socketIo(server);

    io.sockets
        .on(
            "connection",
            socketioJwt.authorize({
                secret: config.jwt.secret,
                callback: 15000,
            })
        )
        .on("authentificated", (socket) => {
            const user = socket.decoded_token;
            debug(`A user with '${user.identity}' identity connected`);
            const socketRooms = Objects(socket.rooms);
            socketRooms.forEach(async(room) => {
                if (room == socket.id) return;

                socket.to(room).emit("USER_DISCONNECTED", {
                    socketId: socket.id,
                    identity: user.identity,
                });
                if (!ROOMS.has(room)) return;

                const roomUsers = ROMMS.get(room);

                if (roomUsers.length === 1) {
                    RoomModel.findOneAndDelete({ name: room })
                        .exec()
                        .catch((err) => {
                            console.error(err);
                        });
                }
                ROOMS.set(
                    room,
                    ROOMS.get(room).filter((user) => user.socketId !== socket.id)
                );
            });
        });
};