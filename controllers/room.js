const Room = require("../models/room");
const { ErrorHandler } = require("../utils/error");
const urlify = require("../utils/urlify");
const { generateNewToken, generateRandomId } = require("../utils/auth");

exports.joinRoom = async(req, res) => {
    if (!req.body.roomName) {
        throw new ErrorHandler(422, "Room name is required");
    }

    if (!req.body.identity) {
        throw new ErrorHandler(422, "Identity is required");
    }

    const { roomName, identity } = req.body;

    const doc = await Room.findOne({ name: roomName }).exec();

    if (!doc) {
        throw new ErrorHandler(404, `Room ${roomName} does not exists`);
    }

    const token = generateNewToken({
        room: roomName,
        identity,
        uid: generateRandomId(),
    });

    return res.json({ token, room: doc });
};

exports.createRoom = async(req, res) => {
    if (!req.body.roomName) {
        throw new ErrorHandler(422, "Room name is required");
    }

    if (!req.body.identity) {
        throw new ErrorHandler(422, "Identity is required");
    }

    const { roomName, identity } = req.body;

    const doc = await Room.findOne({ name: urlify(roomName) }).exec();

    if (doc) {
        throw new ErrorHandler(400, `Room ${roomName} already in use`);
    }

    const uid = generateRandomId();

    const room = await Room.create({ name: urlify(roomName), owner: uid });

    const token = generateNewToken({
        room: urlify(roomName),
        identity,
        uid,
    });

    return res.json({ token, room });
};