import { Router } from "express";
import { userLogin } from "../controllers/userController";

const routeUser = Router();

routeUser.post("/", userLogin);

export default routeUser;
