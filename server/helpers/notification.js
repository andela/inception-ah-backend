import models from "@models";
import { NOTIFICATION } from "./constants";

const { Users, Articles, Followers } = models;

/**
 * @description Gets all the users following an author
 *
 * @param {uuid} authorId Id the of the author being followed
 * @returns {Array} Array of users following an author
 */
export const getAuthorsFollowers = async authorId => {
  const followers = await Followers.findAll({
    where: { authorId },
    raw: true
  });
  return followers;
};

/**
 * @description Filter out users who have opted in for email notification
 *
 * @param {Array} followers Array of authors followers
 * @returns {Array} Array of users that opted in for email notification
 */
export const getUsersForEmailNotification = async followers => {
  console.log("tyhthhhfhfhfh", followers);
  const usersForEmailNotification = followers.map(async follower => {
    await Users.findOne({
      where: { id: follower.followerId, isNotifiable: true },
      raw: true,
      attributes: ["email", "firstName", "lastName"]
    });
  });
  return usersForEmailNotification;
};

/**
 * @description Create the notification messages
 *
 * @param {string} type Notification types: article, comment, like
 * @param {object} options {authorId, articleSlug, ...}
 * @returns {Array} Notification messages.
 */
export const createNotificationMessage = async (type, options) => {
  let data;
  let emailTemplate;
  const color = "green";

  const author = await Users.findByPk(options.authorId);
  const authorName = `${author.dataValues.firstName} ${
    author.dataValues.lastName
  }`;

  const article = await Articles.findOne({
    where: { slug: options.articleSlug, isPublished: true }
  });
  const articleTitle = `${article.dataValues.title}`;

  switch (type) {
    case "article":
      data = {
        action: NOTIFICATION.publishArticle,
        message: `${authorName} just pulished a new article 🚀`,
        link: options.articleSlug ? options.articleSlug : null
      };
      emailTemplate = {
        subject: "Article Notification",
        text: "Read Article",
        intro: `${authorName} just pulished a new article 🚀`,
        outro: `Don't need the notification? You can opt out from your profile page`,
        color
      };
      break;
    case "comment":
      data = {
        action: NOTIFICATION.comment,
        message: `${articleTitle} article has a new comment 🎉`,
        link: options.articleSlug ? options.articleSlug : null
      };
      emailTemplate = {
        subject: "Comment Notification",
        text: "View Comment",
        intro: `${articleTitle} article has a new comment 🎉`,
        outro: `Don't need the notification? You can opt out from your profile page`,
        color
      };
      break;
    case "like":
      data = {
        action: NOTIFICATION.like,
        message: `Article ${articleTitle} was just liked`
      };
      emailTemplate = {
        subject: "Like Notification",
        text: "View Article",
        intro: `${articleTitle} has a new like 🎉`,
        outro: `Don't need the notification? You can opt out from your profile page`,
        color
      };
      break;
    default:
      break;
  }
  return [data, emailTemplate];
};
