import { Router } from "express";
import { authRouter } from "@routes/auth";
import { userRoutes } from "@routes/userRoutes";
import { articleRoutes } from "@routes/articleRoutes";

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
export { mainAppRouter };
