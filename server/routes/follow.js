import { Router } from "express";
import {
  followOrUnfollowUser,
  getFollowedUsers,
  getFollowers
} from "@controllers/follow";
import { verifyToken, findUserById } from "@middlewares";

const followerRouter = Router();

/**
 * @description Router for user to follow or unfollow an author
 * @returns a response
 */
followerRouter.post(
  "/:userId/follow",
  verifyToken,
  findUserById,
  followOrUnfollowUser
);

/**
 * @description Router for user to get all authors followed
 * @returns an array of objects
 */
followerRouter.get("/follow", verifyToken, getFollowedUsers);

/**
 * @description Router for user to get all followers
 * @returns an array of objects
 */
followerRouter.get("/follower", verifyToken, getFollowers);

export { followerRouter };
