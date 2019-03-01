import { Router } from "express";
import socialAuth from "@controllers/socialAuth";
import {
  googleAuth,
  googleAuthRedirect,
  facebookAuth,
  facebookAuthRedirect
} from "@middlewares";

const socialAuthRouter = Router();

socialAuthRouter.get("/google", googleAuth());
socialAuthRouter.get("/google/redirect", googleAuthRedirect(), socialAuth);

socialAuthRouter.get("/facebook", facebookAuth());

socialAuthRouter.get("/facebook/redirect", facebookAuthRedirect(), socialAuth);
export { socialAuthRouter };
