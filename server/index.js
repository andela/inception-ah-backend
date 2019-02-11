import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import session from "express-session";
import db from "./models/index";

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "authorshaven",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

if (isProduction) {
  //
} else {
  //
}
app.get("/", (req, res, next) => {
  res.send(`<h1>Welcome To Authors Heaven</h1>
            <p>For any more info please visit 
            <a href='https://github.com/andela/inception-ah-backend'>Our Github page</a></P>
            <h4>Thanks  &#x1F600;</h4>`);
});

// catch 404 and forward to error handler
app.use((error, req, res, next) => {
  if (error) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  }
  next();
});

// error handler
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

(async () => {
  await db.sequelize.sync();
  const server = app.listen(port, () => {
    console.log(`Listening on port ${server.address().port}`);
  });
})();

app.db = db;
export default app;
