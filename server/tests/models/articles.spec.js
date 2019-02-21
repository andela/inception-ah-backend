import mocha from "mocha";
import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import models from "../../models";
import { userData } from "../fixtures/models/userData";
import article from "../fixtures/models/articleData";

chai.use(chaiAsPromise);
const { assert } = chai;
const { Articles, Users } = models;
const { expect } = chai;

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

const articleDependencies = async () => {
  const createdUser = await Users.create(userData);
  const userId = createdUser.get("id");
  const articleTemplate = Object.assign(article, { authorId: userId });
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
    const dependencies = await articleDependencies();
    assert.instanceOf(dependencies.article, Articles);
    assert.lengthOf(Object.keys(dependencies.article.dataValues), 12);
  });

  it("should delete an article table", async () => {
    const dependencies = await articleDependencies();
    assert.instanceOf(dependencies.article, Articles);
    await Articles.drop({ cascade: true });
    expect(
      Articles.findOne({ where: { id: dependencies.articleId } })
    ).to.rejectedWith(Error);
  });
});
