import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import models from "@models";
import { tagDependencies } from "@dependencies";

chai.use(chaiAsPromise);
const { assert, expect } = chai;
const { Tags } = models;

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

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
