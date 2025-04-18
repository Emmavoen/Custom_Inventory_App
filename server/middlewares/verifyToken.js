const jwt = require("jsonwebtoken");
const { config } = require("../config");

const verifyUserToken = (req, res, next) => {
    const token = req.cookies.userToken;

    if (!token) return res.status(401).json({ message: "User Token not found" });

    jwt.verify(token, config.JWT_SECRET_KEY, async (err, payload) => {
        if (err) return res.status(401).json({ message: "User Token not valid" });
        req.userId = payload.id;

        next();
    })
};


const verifyAdminToken = (req, res, next) => {
    const token = req.cookies.adminToken;

    if (!token) return res.status(401).json({ message: "Admin Token not found" });

    jwt.verify(token, config.JWT_SECRET_KEY, async (err, payload) => {
        if (err) return res.status(401).json({ message: "Admin Token not valid" });
        req.adminId = payload.id;

        next();
    })
};


const verifyAdminOrUserToken = (req, res, next) => {
    const token = req.cookies.adminToken || req.cookies.userToken;

    if (!token) return res.status(401).json({ message: "Token not found" });

    jwt.verify(token, config.JWT_SECRET_KEY, async (err, payload) => {
        if (err) return res.status(401).json({ message: "Token not valid" });
        req.adminId = payload.id;

        if (payload.type === 'admin') {
            req.adminId = payload.id;
        } else if (payload.type === 'user') {
            req.userId = payload.id;
        }

        next();
    })
};


module.exports = { verifyUserToken, verifyAdminToken, verifyAdminOrUserToken };
