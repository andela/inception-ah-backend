import mocha from "mocha";
import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import models from "../../models";
import { userData } from "../fixtures/models/userData";
import { articleData } from "../fixtures/models/articleData";

chai.use(chaiAsPromise);
const { assert } = chai;
const { Articles, Users } = models;
const { expect } = chai;

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

const articleDependencies = async () => {
  const createdUser = await Users.create(userData[0]);
  const userId = createdUser.get("id");
  const articleTemplate = Object.assign(articleData, { authorId: userId });
  const articleInstance = await Articles.create(articleTemplate);
  const articleId = articleInstance.get("id");

  return Promise.resolve({
    userId,
    articleId,
    user: createdUser,
    article: articleInstance
  });
};

describe("Articles", () => {
  it("should create an instance of Articles", async () => {
    const { article } = await articleDependencies();
    assert.instanceOf(article, Articles);
    assert.lengthOf(Object.keys(article.dataValues), 13);
  });

  it("should delete an article table", async () => {
    const { article } = await articleDependencies();
    await article.destroy();
    const foundArticle = await Articles.findOne({
      where: { id: article.get("id") }
    });
    expect(foundArticle).to.be.null;
  });
});
