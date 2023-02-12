// import section
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();
const connectDB = require('./config/db');
const { handleNotFound, handleError } = require("./utils/error");
const apiRoutes = require("./routes");


//DB connection

connectDB();

//import routes


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(helmet());
app.use(compression());

//router middleware
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
    return res.send({ message: "Welcome :))" });
});

app.use(handleNotFound);
app.use(handleError);
//server listening
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(` app listening on port ${port}`);
});