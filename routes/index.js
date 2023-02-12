const router = require("express").Router();
const roomRouter = require("./room");

router.use("/room", roomRouter);

module.exports = router;