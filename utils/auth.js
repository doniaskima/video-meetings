const jsonwebtoken = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const config = require("../config");

const generateNewToken = (data) =>
    jsonwebtoken.sign(data, config.jwt.secret, {
        expiresIn: "24h",
    });

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken.verify(token, config.jwt.secret, (err, payload) => {
            if (err) {
                reject(err);
            } else {
                resolve(payload);
            }
        });
    });
};

const generateRandomId = () => uuidv4();

module.exports = {
    generateNewToken,
    generateRandomId,
    verifyToken,
};