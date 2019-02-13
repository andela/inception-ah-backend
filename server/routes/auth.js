import { Router } from "express";
import socialAuthRouter from "./socialAuth";
import { userLogin } from "../controllers/user";

const authRouter = Router();
authRouter.post("/login", userLogin);
authRouter.use("/", socialAuthRouter);

export default authRouter;
