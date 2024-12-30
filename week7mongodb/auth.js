const jwt = require("jsonwebtoken");
const JWT_SECRET = "jfdjsfkjdsfj343";

async function Auth(req, res, next) {

    const token = req.headers.authorization;
   
    
  try {
    const res = jwt.verify(token, JWT_SECRET);
    if (res) {
      req.userId = res.userId;
      next();
    } else {
      return res.status(403).json({ message: "user not authenticated" });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "user not authenticated" });
  }
}

module.exports = {
  Auth,
  JWT_SECRET,
};
