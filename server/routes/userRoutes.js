import { Router } from "express";
import { passwordResetRequest, resetPassword } from "../controllers/user";

const userRoutes = Router();

userRoutes.post("/resetPassword", passwordResetRequest);
userRoutes.put("/resetPassword/:token", resetPassword);

export default userRoutes;
