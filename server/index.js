import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import passport from "passport";
import db from "./models";
import mainAppRouter from "./routes/index";
import setPassportMiddleware from "./middlewares/passport/passport";

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT;

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
setPassportMiddleware(passport);

app.use("/api/v1", mainAppRouter);

app.get("/", (req, res, next) => {
  res.send(`<h1>Welcome To Authors Heaven</h1>
            <p>For any more info please visit 
            <a href='https://github.com/andela/inception-ah-backend'>
            Our Github page</a></P>
            <h4>Thanks  &#x1F600;</h4>`);
});

// catch 404 and forward to error handler
app.use((error, req, res, next) => {
  if (error) {
    if (!isProduction) {
      console.log(error.stack);
    }
    res.status(404).json({
      errors: {
        message: "Something Went Wrong",
        error
      }
    });
  }
});

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
