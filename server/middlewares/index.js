import {
  googleAuth,
  facebookAuth,
  googleAuthRedirect,
  facebookAuthRedirect,
  setPassportMiddleware
} from "@passport";
import {
  validateUuid,
  validateInput,
  checkUniqueEmail,
  validatePaginationParameters
} from "./validations/validations";

import { findArticle, findAuthorsArticle } from "./articles/findArticle";
import { findSingleComment, findAllComments } from "./comments/findComment";
import { verifyToken } from "./authentications/verifyToken";
import { findUserById } from "./findUser/findUser";

export {
  findUserById,
  verifyToken,
  findArticle,
  findSingleComment,
  findAllComments,
  checkUniqueEmail,
  setPassportMiddleware,
  validateInput,
  googleAuth,
  validateUuid,
  facebookAuth,
  googleAuthRedirect,
  facebookAuthRedirect,
  findAuthorsArticle,
  validatePaginationParameters
};
