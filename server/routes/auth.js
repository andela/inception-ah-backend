import { Router } from "express";
import socialAuthRouter from "./socialAuth";
import { userSignUp, verifyUserAccount, userLogin } from "../controllers/user";
import {
  validateInput,
  checkUniqueEmail
} from "../middlewares/validations/validations";

const authRouter = Router();
authRouter.post("/signin", validateInput, userLogin);
authRouter.post("/signup", validateInput, checkUniqueEmail, userSignUp);
authRouter.get("/verification/:token", verifyUserAccount);
authRouter.use("/", socialAuthRouter);

export default authRouter;
