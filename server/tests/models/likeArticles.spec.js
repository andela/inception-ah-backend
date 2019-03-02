import chai, { assert, expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import models from "@models";
import { category, userData, articleData } from "@fixtures";

const { ArticleLikes, sequelize, Articles, Users, Categories } = models;

chai.use(chaiAsPromised);

beforeEach(async () => {
  await sequelize.sync({ force: true });
});
const articleLikesDependencies = async () => {
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

  return Promise.resolve({
    userId,
    articleId,
    user: createdUser,
    article: articleInstance
  });
};

describe("Like table model ", () => {
  it("should create a Article Likes table with with a length of 6 ", async () => {
    const articleLikes = await ArticleLikes.create();
    assert.instanceOf(articleLikes, ArticleLikes);
    assert.lengthOf(Object.keys(articleLikes.dataValues), "5");
  });

  it("should like an article an article ", async () => {
    const { userId, articleId } = await articleLikesDependencies();
    const createdLikes = await ArticleLikes.create({
      userId,
      articleId,
      like: true
    });
    assert.equal(createdLikes.dataValues.like, true);
  });

  it("should dislike an article an article ", async () => {
    const { userId, articleId } = await articleLikesDependencies();
    const createdDislikes = await ArticleLikes.create({
      userId,
      articleId,
      disLike: true
    });
    assert.equal(createdDislikes.dataValues.disLike, true);
  });

  it("should delete Like table when the article is deleted", async () => {
    const { userId, articleId } = await articleLikesDependencies();
    const createdLikes = await ArticleLikes.create({
      userId,
      articleId,
      disLike: true
    });
    await Articles.destroy({ where: { id: articleId } });
    const likeArticle = await ArticleLikes.findByPk(createdLikes.id);
    assert.isNull(likeArticle);
  });

  it("should delete Like table when the User Account is deleted", async () => {
    const { userId, articleId } = await articleLikesDependencies();
    const createdLikes = await ArticleLikes.create({
      userId,
      articleId,
      disLike: true
    });
    await Users.destroy({ where: { id: userId } });
    const likeArticle = await ArticleLikes.findByPk(createdLikes.id);
    assert.isNull(likeArticle);
  });
});

after(async () => {
  await sequelize.drop({ force: true });
});
