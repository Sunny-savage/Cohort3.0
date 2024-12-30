const express = require("express");

const app = express();
let requests = {};

app.use(express.json());
let count_var = 0;

// setInterval(() => {
//   requests = {};
// }, 1000);

//succcessfully tested all the middlewares

function ratelimiter(req, res, next) {
  console.log(req.headers["userid"]);

  if (requests[req.headers["userid"]]) {
    requests[req.headers["userid"]]++;
    if (requests[req.headers["userid"]] < 6) {
      next();
    } else {
      res.json({ msg: "i stopped it" });
    }
  } else {
    requests[req.headers["userid"]] = 1;
    next();
  }
}

app.use(ratelimiter);

function count(req, res, next) {
  count_var++;
  console.log(req.url, req.method, req.hostname);
  next();
}

app.get("/getcount", function (req, res) {
  res.json({ count: count_var });
});

app.use(count);

app.get("/sum", function (req, res) {
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);
  console.log(requests);

  res.json({
    sum: a + b,
    count: count_var,
  });
});

app.listen(3000);
