import { Router } from "express";
import socialAuthRouter from "./socialAuth";
import userRoute from "./userRoutes";

const authRouter = Router();
authRouter.use("/", socialAuthRouter);
authRouter.use("/login", userRoute);

export default authRouter;
