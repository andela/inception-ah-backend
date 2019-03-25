import { Router } from "express";
import { authRouter } from "@routes/auth";
import { userRouter } from "@routes/user";
import { articleRouter } from "@routes/article";
import { commentsRouter } from "@routes/comment";
import { tagRouter } from "@routes/tag";
import { followerRouter } from "@routes/follow";
import { notificationRouter } from "@routes/notification";
import { categoryRouter } from "@routes/category";

const mainAppRouter = Router();
mainAppRouter.get("/", (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to Authors Haven API"
  });
});
mainAppRouter.use("/auth", authRouter);
mainAppRouter.use("/users", userRouter);
mainAppRouter.use("/articles", articleRouter);
mainAppRouter.use("/comments", commentsRouter);
mainAppRouter.use("/tags", tagRouter);
mainAppRouter.use("/profiles", followerRouter);
mainAppRouter.use("/notification", notificationRouter);
mainAppRouter.use("/categories", categoryRouter);

export { mainAppRouter };
