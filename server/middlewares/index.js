import {
  googleAuth,
  facebookAuth,
  googleAuthRedirect,
  facebookAuthRedirect,
  setPassportMiddleware
} from "@passport";
import { validateInput, checkUniqueEmail } from "./validations/validations";

import { findArticle } from "./articles/findArticle";

import { verifyToken } from "./authentications/verifyToken";
import { findUserById } from "./findUser/findUser";

export {
  findUserById,
  verifyToken,
  findArticle,
  checkUniqueEmail,
  setPassportMiddleware,
  validateInput,
  googleAuth,
  facebookAuth,
  googleAuthRedirect,
  facebookAuthRedirect
};
