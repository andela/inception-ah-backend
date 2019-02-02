import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors";
import errorhandler from "errorhandler";
import db from "./models";

const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(require("morgan")("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require("method-override")());

app.use(
  session({
    secret: "authorshaven",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

if (!isProduction) {
  app.use(errorhandler());
}

/// catch 404 and forward to error handler
app.use((error, req, res, next) => {
  if (error) {
    const err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});

// development error handler, will print stacktrace

app.use((err, req, res, next) => {
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

// finally, let's start our server...
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connection to DB has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

app.listen(port, () => console.log(`Listening on port ${port}...`));

export default app;
