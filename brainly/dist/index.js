"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorStatus = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const db_1 = require("./db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const middleware_1 = require("./middleware");
const utility_1 = require("./utility");
const mySchema = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string().min(6, { message: "this should be longer" }),
});
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
var ErrorStatus;
(function (ErrorStatus) {
    ErrorStatus[ErrorStatus["UserAlreadyExists"] = 403] = "UserAlreadyExists";
    ErrorStatus[ErrorStatus["ErrorInInputs"] = 411] = "ErrorInInputs";
    ErrorStatus[ErrorStatus["InternalError"] = 500] = "InternalError";
    ErrorStatus[ErrorStatus["SigneUP"] = 200] = "SigneUP";
})(ErrorStatus || (exports.ErrorStatus = ErrorStatus = {}));
app.use(express_1.default.json());
app.post("/api/v1/signup", async (req, res) => {
    console.log(req.body);
    try {
        const result = mySchema.safeParse(req.body);
        console.log(result, "this is result ");
        if (result.success) {
            const { username, password } = result.data;
            const already = await db_1.User.findOne({ username: username });
            if (already) {
                res.status(403).json({ msg: "already exists" });
            }
            else {
                const hashedPassword = await bcrypt_1.default.hash(password, 10);
                const user = await db_1.User.create({
                    username: username,
                    password: hashedPassword,
                });
                if (user) {
                    res.status(200).json({ user: user, msg: "userCreated" });
                }
                else {
                    res.status(500).json({ msg: "not created" });
                }
            }
        }
        else {
            res.status(400).json({ msg: "Invalid input" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(ErrorStatus.InternalError).json({ msg: "Server error" });
    }
});
app.post("/api/v1/signin", async (req, res) => {
    try {
        const result = mySchema.safeParse(req.body);
        if (result.success) {
            const { username, password } = result.data;
            const exist = await db_1.User.findOne({ username });
            if (!exist) {
                res.status(411).json({ msg: "please sign up" });
                return;
            }
            else if (!process.env.JWT_SECRET) {
                console.log("env is not linked");
            }
            else {
                const mached = await bcrypt_1.default.compare(password, exist.password);
                console.log(mached, exist, password);
                if (mached) {
                    const token = jsonwebtoken_1.default.sign({ _id: exist._id }, process.env.JWT_SECRET);
                    res.status(200).json({ token: token });
                }
                else {
                    res.status(411).json({ msg: "password does not match" });
                    return;
                }
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
        return;
    }
});
app.post("/api/v1/content", middleware_1.checkAuth, async (req, res) => {
    console.log("hey", req.body);
    const { link, type, title, tags } = req.body;
    const content = await db_1.Content.create({
        link,
        type,
        title,
        tags,
        userId: req.userId,
    });
    res.json({ content });
});
app.get("/api/v1/content", middleware_1.checkAuth, async (req, res) => {
    try {
        const id = req.userId;
        const content = await db_1.Content.find({ userId: id }).populate("userId", "username");
        res.status(ErrorStatus.SigneUP).json({ content });
    }
    catch (error) {
        res.status(ErrorStatus.InternalError).json({ msg: "fksjf" });
    }
});
app.delete("/api/v1/content", middleware_1.checkAuth, async (req, res) => {
    try {
        await db_1.Content.deleteOne({ _id: req.body.contentId, userId: req.userId });
        res.status(ErrorStatus.SigneUP).json({ msf: "jfsjf" });
    }
    catch (error) {
        res.json({ error });
    }
});
app.post("/api/v1/brain/share", middleware_1.checkAuth, async (req, res) => {
    try {
        const { share } = req.body;
        const hash = (0, utility_1.random)(20);
        const lin = await db_1.Link.findOne({ userId: req.userId });
        if (lin && share) {
            res
                .status(200)
                .json({ msg: "already true", link: "/share/" + lin.hash });
            return;
        }
        if (share) {
            const link = await db_1.Link.create({
                userId: req.userId,
                hash: hash,
            });
            res
                .json({ msf: "updated link", link: "/share/" + hash })
                .status(ErrorStatus.SigneUP);
        }
        else {
            await db_1.Link.deleteOne({ userId: req.userId });
            res.json({ msf: "cancelled link" }).status(ErrorStatus.SigneUP);
        }
    }
    catch (error) {
        res
            .status(ErrorStatus.InternalError)
            .json({ msg: "alerady true hai bhai " });
    }
});
app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    const link = await db_1.Link.findOne({ hash: hash });
    if (!link) {
        res
            .status(ErrorStatus.ErrorInInputs)
            .json({ msg: "Sorry incorrect input" });
        return;
    }
    const content = await db_1.Content.find({ userId: link.userId });
    const user = await db_1.User.findOne({ _id: link.userId });
    if (!user) {
        res.status(ErrorStatus.ErrorInInputs).json({
            msg: "Sorry incorrect input, control shouldn't have reached here",
        });
        return;
    }
    res.status(ErrorStatus.SigneUP).json({
        msg: "here is the content",
        user: user.username,
        content: content,
    });
});
async function main() {
    if (!process.env.MONOGOURI) {
        throw new Error("Environment variable MONOGOURI is not defined");
    }
    await mongoose_1.default.connect(process.env.MONOGOURI);
    app.listen(process.env.PORT, () => {
        console.log("connected", process.env.PORT);
    });
    console.log(typeof process.env.MONOGOURI);
}
main();
