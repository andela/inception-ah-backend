import chai from "chai";
import models from "@models";
import { userData, articleData, commentData, category } from "@fixtures";

const sequelize = models.sequelize;
const { assert } = chai;
const { Comments, Articles, Users, Categories } = models;

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

const commentDependencies = async () => {
  const user = userData[0];
  const commentUser = await Users.create(user);
  const articleAuthor = await Users.create(
    Object.assign(user, { email: "soloman@email.com" })
  );
  const authorId = articleAuthor.get("id");
  const userId = commentUser.get("id");
  const categoryInstance = await Categories.create(category);
  const categoryId = categoryInstance.get("id");
  const articleInstance = await Articles.create(
    Object.assign(articleData, { authorId, categoryId })
  );
  const articleId = articleInstance.get("id");
  const commentTemplate = Object.assign(commentData, { userId, articleId });

  return Promise.resolve({
    userId,
    articleId,
    content: commentTemplate.content,
    commentTemplate
  });
};

describe("Comments table model", () => {
  it("should create a 6-column row in the models", async () => {
    const { userId, articleId, content } = await commentDependencies();
    const comments = await Comments.create({ userId, articleId, content });
    assert.lengthOf(Object.keys(comments.dataValues), 6);
  });

  it("should create an instance of Comments", async () => {
    const comments = await new Comments();
    assert.instanceOf(comments, Comments);
  });

  it("should create comment instance with valid userId, articleId and content", async () => {
    const comments = await new Comments();
    assert.equal(comments.get("userId"), comments.userId, "Has a User");
    assert.equal(
      comments.get("articleId"),
      comments.articleId,
      "Has an Article"
    );
    assert.equal(comments.get("content"), comments.content, "Has Content");
  });

  it("should delete comment when articleData is deleted", async () => {
    const newUser = await Users.create({
      ...userData[0],
      email: "newemail@mail.test"
    });
    const userId = newUser.id;
    const categoryInstance = await Categories.create(category);
    const categoryId = categoryInstance.get("id");
    const newArticle = await Articles.create({
      ...articleData,
      authorId: userId,
      categoryId
    });
    const articleId = newArticle.id;
    const newComment = await Comments.create({
      content: "demo content",
      userId,
      articleId
    });
    await Articles.destroy({ where: { id: articleId } });
    const comments = await Comments.findByPk(newComment.id);
    assert.isNull(comments);
  });
});

after(async () => {
  sequelize.drop({ force: true });
});
