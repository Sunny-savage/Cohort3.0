const { Router } = require("express");
const { adminModel, courseModel } = require("../db");
const { adminMiddleware } = require("../middlewares/admin");

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

const adminRouter = Router();
adminRouter.post("/signup", async function (req, res) {
  const { email, password, firstName, lastName } = req.body;

  try {
    const { email, password, firstName, lastName } = userSchema.parse(req.body);

    // Encrypt the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user
    await adminModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    res.json({ msg: "Admin created successfully" });
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

adminRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;
  try {
    // Find user by email
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(403).json({ msg: "Incorrect credentials" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(403).json({ msg: "Incorrect credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id }, // Payload
      process.env.ADMIN_JWT_PASSWORD // Token expiration
    );

    // Optional: Cookie-based authentication
    // res.cookie("token", token, { httpOnly: true });

    res.json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "An error occurred while signing in" });
  }
});

adminRouter.post("/course", adminMiddleware, async function (req, res) {
  try {
    const adminId = req.userId;

    const { title, description, price, imageUrl } = req.body;

    const course = await courseModel.create({
      title,
      description,
      price,
      imageUrl,
      creatorId: adminId,
    });

    res.json({ msg: "course created ", courseId: course._id });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});
adminRouter.put("/course", adminMiddleware, async function (req, res) {
  try {
    const adminId = req.userId;
    const { title, description, price, imageUrl, courseId } = req.body;

    const course = await courseModel.updateOne(
      { creatorId: adminId, _id: courseId },
      { title, description, price, imageUrl }
    );

    if (!course.matchedCount) {
      return res.status(404).json({ msg: "Course not found" });
    }

    res.json({ msg: "Course updated", courseId: course._id });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

adminRouter.get("/course/bulk", adminMiddleware, async function (req, res) {
  try {
    const adminId = req.userId;
    const courses = await courseModel.find({ creatorId: adminId });

    if (courses.length === 0) {
      return res.status(404).json({ msg: "No courses found" });
    }

    res.json({ msg: "Course bulk", courses: courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = {
  adminRouter: adminRouter,
};
