import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import models from "@models";
import { articleData, userData } from "@fixtures";

chai.use(chaiAsPromise);
const { assert, expect } = chai;
const { Articles, Users } = models;

beforeEach(async () => {
  await models.sequelize.sync({ force: true }).catch(() => {});
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
    const dependencies = await articleDependencies();
    assert.instanceOf(dependencies.article, Articles);
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
