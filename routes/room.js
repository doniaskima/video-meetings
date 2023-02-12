const router = require("express").Router();
const roomController = require("../controllers/room");

router.post("/join", roomController.joinRoom);

router.post("/create", roomController.createRoom);

module.exports = router;