import mocha from "mocha";
import chai from "chai";
import database from "../../models/index";
import seeds from "./mode.fixtures";

const sequelize = database.sequelize;
const { assert } = chai;
const Article = database["Articles"];
const articleSeed = seeds.article;

describe("Article", () => {
  it("should create an instance of Article", async () => {
    const article = await Article.create(articleSeed);
    assert.instanceOf(article, Article);
    assert.lengthOf(Object.keys(article.dataValues), 11);
  });

  it("should delete an article table", async () => {
    const article = await Article.create(articleSeed);
    assert.instanceOf(article, Article);
    await Article.drop();
    let dropped = false;
    await Article.findOne({ where: { id: article.dataValues.id } }).catch(
      () => {
        dropped = true;
      }
    );
    assert.isTrue(dropped);
  });
});
