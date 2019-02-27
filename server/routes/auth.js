import { Router } from "express";
import { socialAuthRouter } from "@routes/socialAuth";
import { userSignUp, verifyUserAccount, userLogin } from "@controllers/user";
import { validateInput, checkUniqueEmail } from "@middlewares";

const authRouter = Router();
/**
 * @description Route to sign in a registered user
 */
authRouter.post("/signin", validateInput, userLogin);

/**
 * @description Route to sign up/ register a new user
 */
authRouter.post("/signup", validateInput, checkUniqueEmail, userSignUp);

/**
 * @description Route to verify/confirm/activate a user registration
 */
authRouter.get("/verification/:token", verifyUserAccount);
authRouter.use("/", socialAuthRouter);

export { authRouter };
