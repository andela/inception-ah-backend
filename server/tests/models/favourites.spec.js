import { assert } from "chai";
import database from "../../models/index";
import user from "../fixtures/models/userData";
import article from "../fixtures/models/articleData";

const sequelize = database.sequelize;
const { Favourites, Articles, Users } = database;

beforeEach(async () => {
  await sequelize.sync({ force: true }).catch(() => {});
});

const favouriteDependencies = async () => {
  const createdUser = await Users.create(user);
  const userId = createdUser.get("id");
  const articleTemplate = Object.assign(article, { authorId: userId });
  const articleInstance = await Articles.create(articleTemplate);
  const articleId = articleInstance.get("id");

  return Promise.resolve({
    userId,
    articleId,
    users: createdUser,
    articles: articleInstance
  });
};

describe("Favourites table model ", () => {
  it("should create a favourite table with valid userid and articleId", async () => {
    const { articleId, userId } = await favouriteDependencies();
    const favourites = await Favourites.create({ articleId, userId });
    assert.equal(favourites.get("articleId"), articleId, "Has Association");
    assert.equal(favourites.get("userId"), userId, "Has Users");
  });

  it("should delete userId when it is deleted from Users Table", async () => {
    const { articleId, userId } = await favouriteDependencies();
    await Favourites.create({ articleId, userId });
    await Users.destroy({ where: { id: userId } });
    const isFavourites = await Favourites.findOne({ where: { userId } });
    assert.isNull(isFavourites);
  });

  it("should delete articleId when matching row is deleted from Articles Table", async () => {
    const { articleId, userId } = await favouriteDependencies();
    await Favourites.create({ articleId, userId });
    await Articles.destroy({ where: { id: articleId } });
    const isFavourites = await Favourites.findOne({ where: { articleId } });
    assert.isNull(isFavourites);
  });
});

after(async () => {
  sequelize.drop({ force: true });
  await sequelize.close();
});
