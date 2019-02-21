import mocha from "mocha";
import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import database from "../../models/index";
import user from "../fixtures/models/userData";
import article from "../fixtures/models/articleData";

chai.use(chaiAsPromise);
const { assert } = chai;
const { Articles, Users } = database;

const articleDependencies = async () => {
  const createdUser = await Users.create(user);
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
    assert.lengthOf(Object.keys(dependencies.article.dataValues), 11);
  });

  it("should delete an article table", async () => {
    const dependencies = await articleDependencies();
    assert.instanceOf(dependencies.article, Articles);
    await Articles.drop({ cascade: true });
    chai
      .expect(Articles.findOne({ where: { id: dependencies.articleId } }))
      .to.rejectedWith(Error);
  });
});
