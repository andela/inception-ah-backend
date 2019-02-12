import { Router } from "express";
import authRouter from "./auth";

const mainAppRouter = Router();
mainAppRouter.get("/", (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to Authors Haven API"
  });
});

mainAppRouter.use("/auth", authRouter);

export default mainAppRouter;
