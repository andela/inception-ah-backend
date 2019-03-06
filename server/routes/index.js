import { Router } from "express";
import { authRouter } from "@routes/auth";
import { userRouter } from "@routes/user";
import { articleRouter } from "@routes/article";
import { notificationRouter } from "@routes/notification";

const mainAppRouter = Router();
mainAppRouter.get("/", (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to Authors Haven API"
  });
});
mainAppRouter.use("/auth", authRouter);
mainAppRouter.use("/users", userRouter);
mainAppRouter.use("/", articleRouter);
mainAppRouter.use("/", notificationRouter);

export { mainAppRouter };
