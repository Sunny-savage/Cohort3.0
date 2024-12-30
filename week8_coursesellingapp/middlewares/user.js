
const jwt = require("jsonwebtoken");
function userMiddleware(req, res, next) {
  const token = req.headers.token;
  const decoded = jwt.verify(token, process.env.USER_JWT_PASSWORD);

  if (decoded) {
    req.userId = decoded.id;
    next();
  } else {
    res.status(403).json({ msg: "you are not signed in" });
  }
}

module.exports = {
  userMiddleware: userMiddleware,
};
