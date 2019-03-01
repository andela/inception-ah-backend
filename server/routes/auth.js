/* eslint-disable import/no-unresolved */
import { Router } from "express";
import { socialAuthRouter } from "@routes/social";
import { userSignUp, verifyUserAccount, userLogin } from "@controllers/user";
import { validateInput, checkUniqueEmail } from "@middlewares";

const authsRouter = Router();
authsRouter.post("/signin", validateInput, userLogin);
authsRouter.post("/signup", validateInput, checkUniqueEmail, userSignUp);
authsRouter.get("/verification/:token", verifyUserAccount);
authsRouter.use("/", socialAuthRouter);

export { authsRouter };
