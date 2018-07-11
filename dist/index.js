"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cors = _interopRequireDefault(require("cors"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _express = _interopRequireDefault(require("express"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _index = _interopRequireDefault(require("./models/index"));

_dotenv.default.config();

const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000; // Create global app object

const app = (0, _express.default)();
app.use((0, _cors.default)()); // Normal express config defaults

app.use(require("morgan")("dev"));
app.use(_express.default.urlencoded({
  extended: false
}));
app.use(_express.default.json());
app.use((0, _expressSession.default)({
  secret: "authorshaven",
  cookie: {
    maxAge: 60000
  },
  resave: false,
  saveUninitialized: false
}));

if (isProduction) {//
} else {//
  }

app.get("/", (req, res, next) => {
  res.send(`<h1>Welcome To Authors Heaven</h1>
            <p>For any more info please visit 
            <a href='https://github.com/andela/inception-ah-backend'>Our Github page</a></P>
            <h4>Thanks  &#x1F600;</h4>`);
}); // catch 404 and forward to error handler

app.use((error, req, res, next) => {
  if (error) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  }

  next();
}); // error handler

app.use((err, req, res, next) => {
  // development error handler
  // will print stacktrace
  if (!isProduction) {
    console.log(err.stack);
  }

  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: err
    }
  });
});
app.all("/api", (req, res) => {
  res.status("200").json({
    status: "Success",
    message: "Connection ok"
  });
}); // finally, let's start our server...

_index.default.sequelize.authenticate().then(() => {
  console.log("Connection to DB has been established successfully.");
}).catch(err => {
  console.error("Unable to connect to the database:", err);
});

const server = app.listen(port, () => {
  console.log(`Listening on port ${server.address().port}`);
});
var _default = app;
exports.default = _default;