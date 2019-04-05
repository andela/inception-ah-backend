import models from "@models";
import { serverError, httpResponse } from "@helpers/http";

const { Followers, Users } = models;

/**
 * @description Follow or unfollow a user
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object} HTTP response
 */
export const followOrUnfollowUser = async (req, res) => {
  const {
    userDetails,
    user: { userId }
  } = req;
  const authorId = userDetails.id;
  const author = await userDetails.getFullName();
  try {
    if (userId === authorId) {
      return httpResponse(res, {
        statusCode: 403,
        success: false,
        message: "You cannot follow yourself"
      });
    }
    const follow = await Followers.findOrCreate({
      where: { authorId, followerId: userId }
    });
    const following = follow[1];
    if (following) {
      return httpResponse(res, {
        statusCode: 201,
        success: true,
        status: true,
        message: `You are now following ${author}`
      });
    }
    await Followers.destroy({
      where: { authorId, followerId: userId }
    });
    return httpResponse(res, {
      statusCode: 200,
      success: true,
      status: false,
      message: `You are no longer following ${author}`
    });
  } catch (error) {
    return serverError(res, error);
  }
};

/**
 * @description Fetch all authors followed by a user
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object} HTTP response
 */
export const getFollowedUsers = async (req, res) => {
  const { userId } = req.user;
  try {
    const followedUsers = await Followers.findAndCountAll({
      where: { followerId: userId },
      attributes: ["authorId", "followerId"],
      include: [
        {
          model: Users,
          as: "author",
          attributes: ["firstName", "lastName", "imageURL", "biography"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });
    if (followedUsers.count === 0) {
      return httpResponse(res, {
        statusCode: 404,
        success: false,
        message: "You are not following any author"
      });
    }
    return httpResponse(res, {
      statusCode: 200,
      success: true,
      message: "Followed authors retrieved",
      count: followedUsers.count,
      data: followedUsers.rows
    });
  } catch (error) {
    return serverError(res, error);
  }
};

/**
 * @description Fetch all user's followers
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object} HTTP response
 */
export const getFollowers = async (req, res) => {
  const { userId } = req.user;
  try {
    const followers = await Followers.findAndCountAll({
      where: { authorId: userId },
      attributes: ["authorId", "followerId"],
      include: [
        {
          model: Users,
          as: "follower",
          attributes: ["firstName", "lastName", "imageURL", "biography"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });
    if (followers.count === 0) {
      return httpResponse(res, {
        statusCode: 404,
        success: false,
        message: "You do not have followers"
      });
    }
    return httpResponse(res, {
      statusCode: 200,
      success: true,
      message: "Followers retrieved",
      count: followers.count,
      data: followers.rows
    });
  } catch (error) {
    return serverError(res, error);
  }
};

export const getFollower = async (req, res) => {
  const { userId } = req.user;
  const followerId = req.params.id;
  try {
    const follower = await Followers.findOne({
      where: { authorId: userId, followerId },
      attributes: ["authorId", "followerId"],
      include: [
        {
          model: Users,
          as: "follower",
          attributes: ["firstName", "lastName", "imageURL", "biography"]
        }
      ]
    });
    if (!follower) {
      return httpResponse(res, {
        statusCode: 404,
        success: false,
        message: "The user is not following you"
      });
    }
    return httpResponse(res, {
      statusCode: 200,
      success: true,
      message: "Follower retrieved",
      data: follower.rows
    });
  } catch (error) {
    return serverError(res, error);
  }
};

export const checkFollerStatus = async (req, res) => {
  const { authorId } = req.params;
  const { userId } = req.user;

  try {
    const followerStatus = await Followers.findOne({
      where: {
        authorId,
        followerId: userId
      }
    });
    if (!followerStatus) {
      return httpResponse(res, {
        success: true,
        status: false,
        message: "You are not following this author"
      });
    }

    return httpResponse(res, {
      success: true,
      status: true,
      message: "You are following this author"
    });
  } catch (error) {
    return serverError(res, error);
  }
};
