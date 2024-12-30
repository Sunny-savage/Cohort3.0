const { Router } = require("express");
const { userModel } = require("../db");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");

const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
});

const userRouter = Router();
userRouter.post("/signup", async function (req, res) {
  const { email, password, firstName, lastName } = req.body;

  try {
    const { email, password, firstName, lastName } = userSchema.parse(req.body);

    // Encrypt the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user
    await userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    res.json({ msg: "User created successfully" });
  } catch (e) {
    if (e instanceof z.ZodError) {
      // Handle validation errors
      return res
        .status(400)
        .json({ msg: "Validation failed", errors: e.errors });
    }
    console.error(e);
    res.status(500).json({ msg: "An error occurred while signing up" });
  }
});

userRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(403).json({ msg: "Incorrect credentials" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({ msg: "Incorrect credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id }, // Payload
      process.env.USER_JWT_PASSWORD // Token expiration
    );

    // Optional: Cookie-based authentication
    // res.cookie("token", token, { httpOnly: true });

    res.json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "An error occurred while signing in" });
  }
});

userRouter.get("/purchases", function (req, res) {
  res.json({});
});

module.exports = {
  userRouter: userRouter,
};
