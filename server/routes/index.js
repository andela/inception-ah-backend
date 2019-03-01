import { Router } from "express";
import { authsRouter } from "@routes/auth";
import { usersRouter } from "@routes/user";
import { articlesRouter } from "@routes/article";

const mainAppRouter = Router();
mainAppRouter.get("/", (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to Authors Haven API"
  });
});
mainAppRouter.use("/auth", authsRouter);
mainAppRouter.use("/users", usersRouter);
mainAppRouter.use("/", articlesRouter);

export { mainAppRouter };
