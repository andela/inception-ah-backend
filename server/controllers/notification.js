import isEmpty from "lodash.isempty";

import models from "@models";
import { sendEmail } from "@emails/email";
import { pusher } from "@configs/pusher";
import { httpResponse, serverError } from "@helpers/http";
import { NOTIFICATION } from "@helpers/constants";
import {
  getAuthorsFollowers,
  getUsersForEmailNotification,
  createNotificationMessage
} from "@helpers/notification";

const { Notifications, Users } = models;

/**
 * @description Handles user opt in and out of notifications
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {object} Response object
 */
export const notificationOptInOut = async (req, res) => {
  try {
    const { userDetails } = req;
    await Users.update(
      {
        isNotifiable: !userDetails.isNotifiable
      },
      { where: { id: userDetails.id } }
    );
    return httpResponse(res, {
      message: !userDetails.isNotifiable
        ? "You have successfully opted in for email notification"
        : "You have successfully opted out for email notification"
    });
  } catch (error) {
    return serverError(res, error);
  }
};

/**
 * @description Send notification when user publishes an article
 *
 * @param {uuid} authorId Id of article's author
 * @param {string} articleSlug Article slug
 * @param {uuid} articleId Article ID
 * @param {string} url Article URL
 * @param {function} next express next function
 * @returns {void}
 */
export const sendPublishedArticleNotification = async (
  authorId,
  articleSlug,
  articleId,
  url,
  next
) => {
  try {
    const options = { authorId, articleSlug };
    const authorsFollowers = await getAuthorsFollowers(authorId);
    if (!isEmpty(authorsFollowers)) {
      const usersForEmailNotification = await getUsersForEmailNotification(
        authorsFollowers
      );
      const [data, emailTemplate] = await createNotificationMessage(options);
      const pusherBatchEvents = authorsFollowers.map(() => ({
        channel: NOTIFICATION.notificationChannel,
        name: NOTIFICATION.publishArticle,
        data
      }));
      const bulkNotification = authorsFollowers.map(follower => ({
        message: emailTemplate.intro,
        userId: follower.followerId,
        articleId
      }));

      usersForEmailNotification.map(async user => {
        const { firstName, lastName, email } = user;
        const { text, intro, outro, color, subject } = emailTemplate;
        await sendEmail(firstName, lastName, email, subject, url, {
          intro,
          color,
          text,
          outro
        });
      });
      await Notifications.bulkCreate(bulkNotification);
      pusher.triggerBatch(pusherBatchEvents);
    }
  } catch (error) {
    return next(error);
  }
};

/**
 * @description Send notification when article receives a comment
 *
 * @param {uuid} authorId Id of article's author
 * @param {uuid} articleId Article ID
 * @param {string} articleTitle Article slug
 * @returns {void}
 */
export const sendCommentNotification = async (
  authorId,
  articleId,
  articleTitle
) => {
  await Notifications.create({
    message: `Your article - ${articleTitle} - has a new comment 🎉`,
    userId: authorId,
    articleId
  });
  pusher.trigger(NOTIFICATION.notificationChannel, NOTIFICATION.comment, {
    message: `Your article - ${articleTitle} - has a new comment 🎉`
  });
};
