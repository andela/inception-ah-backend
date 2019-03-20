/* eslint-disable import/no-unresolved */
import { Router } from "express";
import { socialAuthRouter } from "@routes/social";
import { userSignUp, verifyUserAccount, userLogin } from "@controllers/user";
import { validateInput, checkUniqueEmail } from "@middlewares";

const authRouter = Router();
authRouter.post("/signin", validateInput, userLogin);
authRouter.post("/signup", validateInput, checkUniqueEmail, userSignUp);
authRouter.get("/verification", verifyUserAccount);
authRouter.use("/", socialAuthRouter);

export { authRouter };
