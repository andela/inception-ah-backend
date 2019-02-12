import { Router } from "express";
import {
  googleAuth,
  googleAuthRedirect,
  facebookAuth,
  facebookAuthRedirect
} from "../middlewares/passport/passportAuthentication";
import socialAuth from "../controllers/socialAuth";

const socialAuthRouter = Router();

socialAuthRouter.get("/google", googleAuth());
socialAuthRouter.get("/google/redirect", googleAuthRedirect(), socialAuth);

socialAuthRouter.get("/facebook", facebookAuth());

socialAuthRouter.get("/facebook/redirect", facebookAuthRedirect(), socialAuth);

export default socialAuthRouter;
