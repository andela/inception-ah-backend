import models from "@models";
import { NOTIFICATION } from "./constants";

const { Users, Followers } = models;

/**
 * @description Gets all the users following an author
 *
 * @param {uuid} authorId Id the of the author being followed
 * @returns {Array} Array of users following an author
 */
export const getAuthorsFollowers = async authorId => {
  const followers = await Followers.findAll({
    where: { authorId },
    attributes: ["authorId", "followerId"]
  });
  return followers.map(follower => {
    return follower.dataValues;
  });
};

/**
 * @description Filter out users who have opted in for email notification
 *
 * @param {Array} followers Array of authors followers
 * @returns {Array} Array of users that opted in for email notification
 */
export const getUsersForEmailNotification = async followers => {
  const usersForEmailNotification = followers.map(async follower => {
    const user = await Users.findOne({
      where: { id: follower.followerId, isNotifiable: true },
      attributes: ["email", "firstName", "lastName"]
    });
    return user;
  });
  return Promise.all(usersForEmailNotification);
};

/**
 * @description Create the notification messages
 *
 * //@param {string} type Notification types: article, comment, like
 * @param {object} options {authorId, articleSlug, ...}
 * @returns {Array} Notification messages.
 */
export const createNotificationMessage = async options => {
  const author = await Users.findByPk(options.authorId);
  const authorName = await author.getFullName();
  const data = {
    action: NOTIFICATION.publishArticle,
    message: `${authorName} just pulished a new article 🚀`,
    link: options.articleSlug ? options.articleSlug : null
  };
  const emailTemplate = {
    subject: "Article Notification",
    text: "Read Article",
    intro: `${authorName} just pulished a new article`,
    outro: `Don't need the notification? You can opt out from your profile page`,
    color: "green"
  };
  return [data, emailTemplate];
};
