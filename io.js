const socketIo = require("socket.io");
const debug = require("debug")("io");
const RoomModel = require("./models/Room");
const socketioJwt = require("socketio-jwt");
const config = require("./config");

let io = null;

exports.io = function() {
    return io;
};

// ROOMS map keeps track of users connected to a room
const ROOMS = new Map();

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
        .on("authenticated", (socket) => {
            const user = socket.decoded_token;

            debug(`A user with '${user.identity}' identity connected`);

            socket.on("disconnecting", () => {
                debug(`A user with ${user.identity} identity disconnected`);

                const socketRooms = Object.keys(socket.rooms);

                socketRooms.forEach(async(room) => {
                    if (room === socket.id) return;

                    socket.to(room).emit("USER_DISCONNECTED", {
                        socketId: socket.id,
                        identity: user.identity,
                    });

                    if (!ROOMS.has(room)) return;

                    const roomUsers = ROOMS.get(room);
                    /*
                      There is about to be no users in that room, delete the record from DB
                      to allow other users to create a room with that name.
                    */
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

            socket.on("JOIN_ROOM_REQUEST", () => {
                const roomUsers = ROOMS.get(user.room);

                if (roomUsers && roomUsers.length >= 3) {
                    socket.emit("JOIN_ROOM_DECLINE");
                } else if (roomUsers && roomUsers.length > 0) {
                    io.to(roomUsers[0].socketId).emit("JOIN_ROOM_REQUEST", {
                        socketId: socket.id,
                        identity: user.identity,
                    });
                } else {
                    socket.emit("JOIN_ROOM_ACCEPT");
                }
            });

            socket.on("JOIN_ROOM_ACCEPT", ({ socketId }) => {
                io.to(socketId).emit("JOIN_ROOM_ACCEPT");
            });

            socket.on("JOIN_ROOM_DECLINE", ({ socketId }) => {
                io.to(socketId).emit("JOIN_ROOM_DECLINE");
            });

            socket.on("JOIN_ROOM", () => {
                debug(`JOIN_ROOM ${user.room} triggered for ${user.identity}`);

                socket.join(user.room);

                const newUser = { socketId: socket.id, identity: user.identity };

                if (ROOMS.has(user.room)) {
                    ROOMS.set(user.room, [...ROOMS.get(user.room), newUser]);
                } else {
                    ROOMS.set(user.room, [newUser]);
                }

                const roomUsers = ROOMS.get(user.room);

                if (roomUsers.length === 1) {
                    socket.emit("OWNER");
                }

                const recipients = roomUsers.filter(
                    (user) => user.socketId !== socket.id
                );

                if (recipients.length > 0) {
                    socket.emit("RECIPIENT", recipients);
                    socket.to(user.room).emit("USER_JOINED", {
                        socketId: socket.id,
                        identity: user.identity,
                    });
                }
            });

            socket.on("HANG_UP", () => {
                const roomUsers = ROOMS.get(user.room);
                const isOwner =
                    roomUsers && roomUsers[0] && roomUsers[0].socketId === socket.id;
                if (isOwner) {
                    socket.to(user.room).emit("HANG_UP");
                }
            });

            socket.on("OFFER", (payload) => {
                io.to(payload.target).emit("OFFER", payload);
            });

            socket.on("ANSWER", (payload) => {
                io.to(payload.target).emit("ANSWER", payload);
            });

            socket.on("NEW_ICE_CANDIDATE", (payload) => {
                io.to(payload.target).emit("NEW_ICE_CANDIDATE", payload);
            });
        });
};