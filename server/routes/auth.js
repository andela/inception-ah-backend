import { Router } from "express";
import socialAuthRouter from "./socialAuth";

const authRouter = Router();

authRouter.use("/", socialAuthRouter);

export default authRouter;
