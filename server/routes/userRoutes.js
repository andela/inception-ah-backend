import { Router } from "express";
import {
  passwordResetRequest,
  resetPassword,
  getUserProfile,
  updateUserProfile
} from "../controllers/user";
import { verifyToken } from "../middlewares/authentications/verifyToken";
import { findUserById } from "../middlewares/findUser/findUser";
import { validateInput } from "../middlewares/validations/validations";

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

export default userRoutes;
