const { Router } = require("express");
const { userMiddleware } = require("../middlewares/user");
const { purchaseModel, courseModel } = require("../db");

const courseRouter = Router();
courseRouter.post("/purchase", userMiddleware, async function (req, res) {
  const userId = req.userId;
  const courseId = req.body.courseId;

  const purchase = await purchaseModel.create({
    userId: userId,
    courseId: courseId,
  });

  res
    .status(200)
    .json({ message: "purchased successfully", purchase: purchase });
});
courseRouter.get("/preview", async function (req, res) {
  const courses = await courseModel.find({});

  res.json({ courses: courses, msg: "courses fetched" });
});

module.exports = {
  courseRouter: courseRouter,
};
