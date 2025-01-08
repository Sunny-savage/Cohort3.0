"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _1 = require(".");
const checkAuth = async (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) {
            res
                .status(_1.ErrorStatus.ErrorInInputs)
                .json({ msg: "Authorization token is required" });
            return;
        }
        if (!process.env.JWT_SECRET) {
            console.log("env not linked");
        }
        else {
            const veify = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.userId = veify._id;
            next();
        }
    }
    catch (error) {
        console.error(error);
        res.status(_1.ErrorStatus.InternalError).json({ msg: "Server error" });
        return;
    }
};
exports.checkAuth = checkAuth;
