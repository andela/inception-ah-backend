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

const { Notification, Users } = models;

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
    const notificationStatus = userDetails.isNotifiable;
    const isNotifiable = !notificationStatus;
    await Users.update({ isNotifiable }, { where: { id: userDetails.id } });
    return httpResponse(res, {
      message: isNotifiable
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
    console.log("authhdlksfjklsdkjlsdfkjsdkjl", authorsFollowers);
    if (isEmpty(authorsFollowers)) {
      return;
    }
    const usersForEmailNotification = await getUsersForEmailNotification(
      authorsFollowers
    );
    console.log("===Notifiabla", await usersForEmailNotification);

    const [data, emailTemplate] = createNotificationMessage("article", options);
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

    usersForEmailNotification.map(user => {
      const { firstName, lastName, email } = user;
      const { text, intro, outro, color, subject } = emailTemplate;
      return sendEmail(firstName, lastName, email, subject, url, {
        intro,
        color,
        text,
        outro
      });
    });

    await Notification.bulkCreate(bulkNotification);
    pusher.triggerBatch(pusherBatchEvents);
    console.log("Notification notification notification");
  } catch (error) {
    return next(error);
  }
};
