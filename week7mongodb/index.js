const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Auth, JWT_SECRET } = require("./auth");
const { z } = require("zod");
const { UserModel, TodoModel } = require("./db");

mongoose.connect(
  "mongodb+srv://vishal200231:sunnymongodb@cluster0.i2ii7.mongodb.net/TodoApp"
);
const app = express();

app.use(express.json());

async function Signup(req, res) {
  const schema = z.object({
    email: z.string().min(4).max(100).email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    name: z.string().min(3).max(100),
  });

  const validated = schema.safeParse(req.body);
  if (!validated.success) {
    res.json({ msg: "invalid credentials", error: validated.error });
    return;
  }
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  try {
    const exit = await UserModel.findOne({ email });
    if (exit) {
      return res.json({ msg: "user already exists" });
    }

    const hashed_password = await bcrypt.hash(password, 5);

    await UserModel.create({
      name: username,
      email: email,
      password: hashed_password,
    });

    res.json({ msg: "user signed up" });
  } catch (error) {
    return res.json({ msg: "error occured" });
  }
}

async function Signin(req, res, next) {
  const password = req.body.password;
  const email = req.body.email;
  console.log(req.body);

  try {
    const ifexists = await UserModel.findOne({
      email: email,
    });

    if (!ifexists) {
      res.json({ msg: "user does not exist" });
      return;
    }

    const dehashedpass =  bcrypt.compare(password, ifexists.password);
    if (dehashedpass) {
      const token = jwt.sign({ userId: ifexists._id.toString() }, JWT_SECRET);
      res.json({ token: token });
    } else {
      res.json({ msg: "signup unsuccesful" });
    }
  } catch (error) {
    return res.json({ msg: "eroor ecjkjf" });
  }
}
async function PostTodo(req, res, next) {
  const userId = req.userId;
  const title = req.body.title;
  const done = req.body.done;

  try {
    await TodoModel.create({
      userId,
      title,
      done,
    });
    res.json({ msg: "creatd successfully" });
  } catch (error) {
    return res.json({ msg: "an error occured" });
  }
}

async function GetTodo(req, res, next) {
  const userId = req.userId;
  try {
    const todos = await TodoModel.find({ userId });
    if (todos.length > 0) {
      res.status(200).json({ data: todos, msf: "fetecged" });
    } else {
      res.status(200).json({ msg: "no todos found" });
    }
  } catch (error) {
    return res.json({
      msg: "internal server error",
    });
  }
}
async function updateTodo(req, res) {
  const todo_id = req.query.id;
  const done = req.body.done;
  console.log(todo_id);

  try {
    const ponse = await TodoModel.findOneAndUpdate(
      { _id: todo_id },
      {
        done: done,
      },
      { new: true }
    ).populate("userId");
    console.log(ponse);

    if (ponse) {
      res.json({ msg: "updated successfully", data: ponse });
    } else {
      res.json({ msg: "invalid id" });
    }
  } catch (error) {
    return res.json({ msg: "invalid idjkdfj" });
  }
}

app.post("/SignUp", Signup);
app.post("/SignIn", Signin);
app.post("/PostTodo", Auth, PostTodo);
app.put("/updatetodo", Auth, updateTodo);
app.post("/GetTodo", Auth, GetTodo);

app.listen(3000);
