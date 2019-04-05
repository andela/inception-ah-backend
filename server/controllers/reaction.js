import models from "@models";
import { httpResponse, serverError } from "@helpers/http";
import { ARTICLE_REACTION, COMMENT_REACTION } from "@helpers/constants";
import { typeOfReaction } from "@helpers/reaction";

const { Reactions } = models;

export const likeOrDislikeAnArticle = async (req, res) => {
  const {
    article,
    user: { userId },
    body: { reaction },
    article: { title }
  } = req;
  try {
    const articleReaction = await Reactions.findOne({
      where: {
        articleId: article.id,
        userId
      }
    });
    if (!articleReaction) {
      const newReaction = await Reactions.create({
        articleId: article.id,
        sourceType: ARTICLE_REACTION,
        reaction,
        userId
      });
      await article.increment(`${typeOfReaction(reaction).count}`);
      const articleNumberOfLikes = article.get("numberOfLikes");
      const articleNumberOfDislikes = article.get("numberOfDislikes");
      return httpResponse(res, {
        statusCode: 201,
        message: `You have successfully added a ${
          typeOfReaction(reaction).type
        } reaction to ${title}`,
        reaction: newReaction,
        articleNumberOfLikes,
        articleNumberOfDislikes
      });
    }

    if (articleReaction.get("reaction") !== reaction) {
      await article.decrement(
        `${typeOfReaction(articleReaction.get("reaction")).count}`
      );
      await article.increment(`${typeOfReaction(reaction).count}`);

      articleReaction.reaction = reaction;
      await articleReaction.save();
      await articleReaction.reload();

      const articleNumberOfLikes = article.get("numberOfLikes");
      const articleNumberOfDislikes = article.get("numberOfDislikes");
      return httpResponse(res, {
        statusCode: 200,
        message: `You have successfully updated your ${
          typeOfReaction(articleReaction.get("reaction")).type
        } reaction to ${title}`,
        articleNumberOfLikes,
        articleNumberOfDislikes
      });
    }

    await article.decrement(
      `${typeOfReaction(articleReaction.get("reaction")).count}`
    );

    await Reactions.destroy({
      where: {
        id: articleReaction.id
      }
    });

    const articleNumberOfLikes = article.get("numberOfLikes");
    const articleNumberOfDislikes = article.get("numberOfDislikes");
    return httpResponse(res, {
      statusCode: 200,
      message: `You have successfully removed your ${
        typeOfReaction(articleReaction.get("reaction")).type
      } reaction to ${title}`,
      articleNumberOfLikes,
      articleNumberOfDislikes
    });
  } catch (error) {
    return serverError(res, error);
  }
};
export const likeOrDislikeACommment = async (req, res) => {
  const {
    comment,
    user: { userId },
    body: { reaction },
    comment: { content }
  } = req;
  try {
    const commentReaction = await Reactions.findOne({
      where: {
        commentId: comment.id,
        userId
      }
    });

    if (!commentReaction) {
      const newReaction = await Reactions.create({
        commentId: comment.id,
        sourceType: COMMENT_REACTION,
        reaction,
        userId
      });
      await comment.increment(`${typeOfReaction(reaction).count}`);
      const commentNumberOfLikes = comment.get("numberOfLikes");
      const commentNumberOfDislikes = comment.get("numberOfDislikes");
      return httpResponse(res, {
        statusCode: 201,
        message: `You have successfully added a ${
          typeOfReaction(reaction).type
        } reaction to ${content}`,
        reaction: newReaction,
        commentNumberOfLikes,
        commentNumberOfDislikes
      });
    }

    if (commentReaction.get("reaction") !== reaction) {
      await comment.decrement(
        `${typeOfReaction(commentReaction.get("reaction")).count}`
      );
      await comment.increment(`${typeOfReaction(reaction).count}`);
      commentReaction.reaction = reaction;
      await commentReaction.save();
      await commentReaction.reload();

      const commentNumberOfLikes = comment.get("numberOfLikes");
      const commentNumberOfDislikes = comment.get("numberOfDislikes");
      return httpResponse(res, {
        statusCode: 200,
        message: `You have successfully updated your ${
          typeOfReaction(commentReaction.get("reaction")).type
        } reaction to ${content}`,
        commentNumberOfLikes,
        commentNumberOfDislikes
      });
    }
    await Reactions.destroy({
      where: {
        id: commentReaction.id
      }
    });
    await comment.decrement(
      `${typeOfReaction(commentReaction.get("reaction")).count}`
    );

    const commentNumberOfLikes = comment.get("numberOfLikes");
    const commentNumberOfDislikes = comment.get("numberOfDislikes");
    return httpResponse(res, {
      statusCode: 200,
      message: `You have successfully removed your ${
        typeOfReaction(commentReaction.get("reaction")).type
      } reaction to ${content}`,
      commentNumberOfLikes,
      commentNumberOfDislikes
    });
  } catch (error) {
    return serverError(res, error);
  }
};
export const fetchAllArticleReactions = async (req, res) => {
  const {
    article: { id, title }
  } = req;
  const articleReactions = await Reactions.findAll({
    where: {
      articleId: id
    },
    include: [
      {
        model: models.Users,
        as: "userReactions"
      }
    ]
  });

  if (!articleReactions.length) {
    return httpResponse(res, {
      statusCode: 404,
      message: `There are no Reactions found for ${title}`
    });
  }
  return httpResponse(res, {
    statusCode: 200,
    message: "Reactions successfully retrieved",
    reactions: articleReactions
  });
};
export const fetchAllCommentReactions = async (req, res) => {
  const {
    comment: { id, content }
  } = req;
  const commentReactions = await Reactions.findAll({
    where: {
      commentId: id
    },
    include: [
      {
        model: models.Users,
        as: "userReactions"
      }
    ]
  });
  if (!commentReactions.length) {
    return httpResponse(res, {
      statusCode: 404,
      message: `There are no Reactions found for ${content}`
    });
  }
  return httpResponse(res, {
    statusCode: 200,
    message: "Reactions successfully retrieved",
    reactions: commentReactions
  });
};