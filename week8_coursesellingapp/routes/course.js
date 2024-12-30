const { Router } = require("express");

const courseRouter = Router();
courseRouter.post("/purchase", function (req, res) {
  res.json({});
});
courseRouter.get("/preview", function (req, res) {
  res.json({});
});

module.exports = {
  courseRouter: courseRouter,
};
