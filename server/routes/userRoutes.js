import { Router } from "express";

import { verifyToken, findUserById, validateInput } from "@middlewares";
import {
  getUserProfile,
  updateUserProfile,
  passwordResetRequest,
  resetPassword
} from "@controllers/user";

const userRoutes = Router();

userRoutes.post("/resetPassword", passwordResetRequest);
userRoutes.put("/resetPassword/:token", resetPassword);
userRoutes.get("/:id", findUserById, getUserProfile);
userRoutes.put(
  "/:id/updateProfile",
  findUserById,
  verifyToken,
  validateInput,
  updateUserProfile
);

export { userRoutes };
