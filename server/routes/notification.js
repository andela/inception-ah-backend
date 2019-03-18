import { Router } from "express";
import { notificationOptInOut } from "@controllers/notification";
import { verifyToken, findUserById } from "@middlewares";

const notificationRouter = Router();

/**
 * @description - Route to opt in and out for email notification
 * @returns - It returns reponse message
 */
notificationRouter.post(
  "/optInOut",
  verifyToken,
  findUserById,
  notificationOptInOut
);

export { notificationRouter };
