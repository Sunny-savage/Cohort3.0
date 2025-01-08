import dotenv from "dotenv";

import express, { Request, Response } from "express";
import cors from "cors"
import jwt from "jsonwebtoken";
import mongoose, { connect } from "mongoose";
import { z } from "zod";
import { Content, Link, User } from "./db";
import bcrypt, { hashSync } from "bcrypt";
import { checkAuth } from "./middleware";
import { random } from "./utility";

const mySchema = z.object({
  username: z.string(),
  password: z.string().min(6, { message: "this should be longer" }),
});

dotenv.config();

const app = express();
app.use(cors())

export enum ErrorStatus {
  UserAlreadyExists = 403,
  ErrorInInputs = 411,
  InternalError = 500,
  SigneUP = 200,
}

app.use(express.json());
app.post("/api/v1/signup", async (req, res) => {
  console.log(req.body);
  
  try {
    const result =  mySchema.safeParse(req.body);
    console.log(result, "this is result ");

    if (result.success) {
      const { username, password } = result.data;

      const already = await User.findOne({ username: username });
      if (already) {
        res.status(403).json({ msg: "already exists" });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
          username: username,
          password: hashedPassword,
        });
        if (user) {
          res.status(200).json({ user :user, msg:"userCreated"});
        } else {
          res.status(500).json({ msg: "not created" });
        }
      }
    } else {
      res.status(400).json({ msg: "Invalid input" });
    }
  } catch (error) {
    console.error(error);
    res.status(ErrorStatus.InternalError).json({ msg: "Server error" });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  try {
    const result = mySchema.safeParse(req.body);

    if (result.success) {
      const { username, password } = result.data;
      const exist = await User.findOne({ username });

      if (!exist) {
        res.status(411).json({ msg: "please sign up" });
        return;
      } else if (!process.env.JWT_SECRET) {
        console.log("env is not linked");
      } else {
        const mached = await bcrypt.compare(password, exist.password);
        console.log(mached, exist, password);

        if (mached) {
          const token = jwt.sign({ _id: exist._id }, process.env.JWT_SECRET);
          res.status(200).json({ token: token });
        } else {
          res.status(411).json({ msg: "password does not match" });
          return;
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
    return;
  }
});

app.post("/api/v1/content", checkAuth, async (req: Request, res: Response) => {
  console.log("hey", req.body);
  const { link, type, title, tags } = req.body;

  const content = await Content.create({
    link,
    type,
    title,
    tags,
    userId: req.userId,
  });
  res.json({ content });
});

app.get("/api/v1/content", checkAuth, async (req: Request, res: Response) => {
  try {
    const id = req.userId;
    const content = await Content.find({ userId: id }).populate(
      "userId",
      "username"
    );
    res.status(ErrorStatus.SigneUP).json({ content });
  } catch (error) {
    res.status(ErrorStatus.InternalError).json({ msg: "fksjf" });
  }
});

app.delete(
  "/api/v1/content",
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      await Content.deleteOne({ _id: req.body.contentId, userId: req.userId });
      res.status(ErrorStatus.SigneUP).json({ msf: "jfsjf" });
    } catch (error) {
      res.json({ error });
    }
  }
);

app.post(
  "/api/v1/brain/share",
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      const { share } = req.body;
      const hash = random(20);
      const lin = await Link.findOne({ userId: req.userId });
      if (lin && share) {
        res
          .status(200)
          .json({ msg: "already true", link: "/share/" + lin.hash });
        return;
      }
      if (share) {
        const link = await Link.create({
          userId: req.userId,
          hash: hash,
        });
        res
          .json({ msf: "updated link", link: "/share/" + hash })
          .status(ErrorStatus.SigneUP);
      } else {
        await Link.deleteOne({ userId: req.userId });
        res.json({ msf: "cancelled link" }).status(ErrorStatus.SigneUP);
      }
    } catch (error) {
      res
        .status(ErrorStatus.InternalError)
        .json({ msg: "alerady true hai bhai " });
    }
  }
);

app.get("/api/v1/brain/:shareLink", async (req: Request, res: Response) => {
  const hash = req.params.shareLink;
  const link = await Link.findOne({ hash: hash });
  if (!link) {
    res
      .status(ErrorStatus.ErrorInInputs)
      .json({ msg: "Sorry incorrect input" });
    return;
  }
  const content = await Content.find({ userId: link.userId });
  const user = await User.findOne({ _id: link.userId });
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
  await mongoose.connect(process.env.MONOGOURI);
  app.listen(process.env.PORT, () => {
    console.log("connected", process.env.PORT);
  });

  console.log(typeof process.env.MONOGOURI);
}
main();
