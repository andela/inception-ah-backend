import { Router } from "express";
import {
  passwordResetRequest,
  resetPassword,
  getUserProfile,
  updateUserProfile
} from "@controllers/user";
import { verifyToken, findUserById, validateInput } from "@middlewares";

const userRouter = Router();

userRouter.post("/resetPassword", passwordResetRequest);
userRouter.put("/resetPassword", resetPassword);
userRouter.get("/:id", findUserById, getUserProfile);
userRouter.put(
  "/:id/updateProfile",
  findUserById,
  verifyToken,
  validateInput,
  updateUserProfile
);
export { userRouter };
