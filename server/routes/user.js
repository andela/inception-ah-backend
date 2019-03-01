import { Router } from "express";
import {
  passwordResetRequest,
  resetPassword,
  getUserProfile,
  updateUserProfile
} from "@controllers/user";
import { verifyToken, findUserById, validateInput } from "@middlewares";

const usersRouter = Router();

usersRouter.post("/resetPassword", passwordResetRequest);
usersRouter.put("/resetPassword/:token", resetPassword);
usersRouter.get("/:id", findUserById, getUserProfile);
usersRouter.put(
  "/:id/updateProfile",
  findUserById,
  verifyToken,
  validateInput,
  updateUserProfile
);

export { usersRouter };
