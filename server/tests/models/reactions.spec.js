import chai, { assert } from "chai";
import chaiAsPromised from "chai-as-promised";
import models from "@models";
import { category, userData, articleData } from "@fixtures";
import { ARTICLE_REACTION, COMMENT_REACTION } from "@helpers/constants";

const { Reactions, sequelize, Articles, Users, Categories, Comments } = models;

chai.use(chaiAsPromised);

beforeEach(async () => {
  await sequelize.sync({ force: true });
});
const reactionsDependency = async () => {
  const createdUser = await Users.create(userData[0]);
  const userId = createdUser.get("id");
  const articleCategory = await Categories.create(category);
  const categoryId = articleCategory.get("id");

  const articleTemplate = Object.assign(articleData, {
    authorId: userId,
    categoryId
  });

  const articleInstance = await Articles.create(articleTemplate);
  const articleId = articleInstance.get("id");

  const commentId = await Comments.create({
    userId,
    articleId,
    content: "this is a comment"
  }).get("id");

  return Promise.resolve({
    userId,
    articleId,
    commentId
  });
};

describe("Reactions table model", () => {
  it("should create a Reaction table with with a length of 7", async () => {
    const { articleId, userId } = await reactionsDependency();
    const reactionInstance = await Reactions.create({
      articleId,
      userId,
      sourceType: ARTICLE_REACTION,
      reactions: true
    });
    assert.instanceOf(reactionInstance, Reactions);
    assert.lengthOf(Object.keys(reactionInstance.dataValues), "7");
  });

  it("should add a like reaction to an article", async () => {
    const { userId, articleId } = await reactionsDependency();
    const articleLikes = await Reactions.create({
      userId,
      articleId,
      reactions: true,
      sourceType: ARTICLE_REACTION
    });
    assert.equal(articleLikes.dataValues.reactions, true);
  });

  it("should add a dislike reaction to an article", async () => {
    const { userId, articleId } = await reactionsDependency();
    const createdArticleDislikes = await Reactions.create({
      userId,
      articleId,
      reactions: false,
      sourceType: ARTICLE_REACTION
    });
    assert.equal(createdArticleDislikes.dataValues.reactions, false);
  });

  it("should add a like reaction to a comment", async () => {
    const { userId, commentId } = await reactionsDependency();
    const createdCommentLikes = await Reactions.create({
      userId,
      commentId,
      reactions: true,
      sourceType: COMMENT_REACTION
    });
    assert.equal(createdCommentLikes.dataValues.reactions, true);
  });

  it("should add a dislike reaction to a comment", async () => {
    const { userId, commentId } = await reactionsDependency();
    const createdCommentDislikes = await Reactions.create({
      userId,
      commentId,
      reactions: false,
      sourceType: COMMENT_REACTION
    });
    assert.equal(createdCommentDislikes.dataValues.reactions, false);
  });

  it("should delete a Reaction column when the article is deleted", async () => {
    const { userId, articleId } = await reactionsDependency();
    const createdArticleLikes = await Reactions.create({
      userId,
      articleId,
      reactions: true,
      sourceType: ARTICLE_REACTION
    });
    await Articles.destroy({ where: { id: articleId } });
    const likeArticle = await Reactions.findByPk(createdArticleLikes.id);
    assert.isNull(likeArticle);
  });

  it("should delete Reaction column when the User Account is deleted", async () => {
    const { userId, articleId } = await reactionsDependency();
    const createdLikes = await Reactions.create({
      userId,
      articleId,
      reactions: true,
      sourceType: ARTICLE_REACTION
    });
    await Users.destroy({ where: { id: userId } });
    const likeArticle = await Reactions.findByPk(createdLikes.id);
    assert.isNull(likeArticle);
  });

  it("should delete Reaction column when the Comment is deleted", async () => {
    const { userId, commentId } = await reactionsDependency();

    const createdCommentReactions = await Reactions.create({
      userId,
      commentId,
      reactions: true,
      sourceType: COMMENT_REACTION
    });
    await Comments.destroy({ where: { id: commentId } });

    const likeComment = await Reactions.findByPk(createdCommentReactions.id);
    assert.isNull(likeComment);
  });
});

after(async () => {
  await sequelize.drop({ force: true });
});
