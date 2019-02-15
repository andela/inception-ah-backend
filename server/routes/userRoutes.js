import { Router } from "express";
import { userLogin } from "../controllers/user";

const userRoutes = Router();

userRoutes.post("/", userLogin);

export default userRoutes;
