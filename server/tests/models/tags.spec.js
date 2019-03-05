import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import models from "@models";
import { tagData, articleData, userData, category } from "@fixtures";

chai.use(chaiAsPromise);
const { assert, expect } = chai;
const { Tags, Categories, Users, Articles } = models;

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

const tagDependencies = async () => {
  const tagInstance = await Tags.create(tagData[0]);
  const tagId = tagInstance.get("id");
  const userInstance = await Users.create(userData[0]);
  const categoryInstance = await Categories.create(category);
  const articleTemplate = Object.assign(articleData, {
    authorId: userInstance.get("id"),
    categoryId: categoryInstance.get("id")
  });
  const articleInstance = await Articles.create(articleTemplate);
  const articleId = articleInstance.get("id");

  return Promise.resolve({
    tagId,
    articleId,
    tagInstance,
    articleInstance
  });
};

describe("Tags model", () => {
  it("should create an instance of Tag", async () => {
    const { tagInstance } = await tagDependencies();
    assert.instanceOf(tagInstance, Tags);
    assert.containsAllKeys(tagInstance.dataValues, [
      "id",
      "tag",
      "createdAt",
      "updatedAt"
    ]);
  });

  it("should pesist a new instance of ArticleTags", async () => {
    const { tagInstance, articleInstance } = await tagDependencies();
    await tagInstance.addArticles(articleInstance);
    const result = await tagInstance.hasArticle(articleInstance);
    assert.isTrue(result);
  });

  it("should delete an instance of Tag", async () => {
    const dependencies = await tagDependencies();
    await Tags.drop({ cascade: true });
    expect(Tags.findOne({ where: { id: dependencies.tagId } })).to.rejectedWith(
      Error
    );
  });

  it("should delete an instance of ArticleTags", async () => {
    const { tagInstance, articleInstance } = await tagDependencies();
    await tagInstance.addArticles(articleInstance);
    await tagInstance.removeArticles(articleInstance);
    const result = await tagInstance.hasArticle(articleInstance);
    assert.isFalse(result);
  });
});
