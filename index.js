// import section
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();


//DB connection
mongoose.connect(process.env.MONGO_DB_URI);
mongoose.connection.on("connected", () => {
    console.log("DB connected");
});
mongoose.connection.on("error", (err) => {
    console.log("mongodb failed with", err);
});

//import routes


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(helmet());
app.use(compression());

//router middleware

app.get("/", (req, res) => {
    return res.send({ message: "Welcome :))" });
});
//server listening
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});