import { Router } from "express";
import authRouter from "./auth";
import userRoutes from "./userRoutes";
import articleRoutes from "./article";

const mainAppRouter = Router();
mainAppRouter.get("/", (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to Authors Haven API"
  });
});
mainAppRouter.use("/auth", authRouter);
mainAppRouter.use("/users", userRoutes);
mainAppRouter.use("/", articleRoutes);

export default mainAppRouter;
