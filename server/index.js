import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import passport from "passport";
import db from "@models";
import { mainAppRouter } from "@routes/index";
import { setPassportMiddleware } from "@passport";

dotenv.config();
const isTest = process.env.NODE_ENV === "test";
const port = process.env.PORT || 6000;

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
app.all("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Not Found"
  });
});
if (!isTest) {
  (async () => {
    try {
      await db.sequelize.sync();
    } catch (error) {
      console.log("eerr", error);
    }
  })();
}
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.db = db;

export default app;
