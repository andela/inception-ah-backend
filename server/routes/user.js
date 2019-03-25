import { Router } from "express";
import {
  passwordResetRequest,
  resetPassword,
  getUserProfile,
  updateUserProfile
} from "@controllers/user";
import {
  verifyToken,
  findUserById,
  validateInput,
  validateUuid
} from "@middlewares";

const userRouter = Router();

userRouter.post("/resetPassword", passwordResetRequest);
userRouter.put("/resetPassword", resetPassword);
userRouter.get("/:userId", validateUuid, findUserById, getUserProfile);
userRouter.put(
  "/:userId",
  validateUuid,
  findUserById,
  verifyToken,
  validateInput,
  updateUserProfile
);
export { userRouter };
