"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const firebase_1 = require("../firebase");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "Missing or invalid token",
            });
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = await firebase_1.admin.auth().verifyIdToken(token);
        // attach user to request
        req.user = decodedToken;
        next();
    }
    catch (error) {
        return res.status(401).json({
            error: "Unauthorized",
            message: "Token verification failed",
        });
    }
};
exports.authenticate = authenticate;
