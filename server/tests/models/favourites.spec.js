import { assert } from "chai";
import models from "@models";
import { favoriteDependencies } from "@dependencies";

const sequelize = models.sequelize;
const { Favorites, Articles, Users } = models;

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

describe("Favorites table model ", () => {
  it("should create a favourite table with valid userid and articleId", async () => {
    const { articleId, userId, articleSlug } = await favoriteDependencies();
    const favourites = await Favorites.create({
      articleId,
      userId,
      articleSlug
    });
    assert.equal(favourites.get("articleId"), articleId, "Has Association");
    assert.equal(favourites.get("userId"), userId, "Has Users");
  });

  it("should delete userId when it is deleted from Users Table", async () => {
    const { articleId, userId, articleSlug } = await favoriteDependencies();
    await Favorites.create({ articleId, userId, articleSlug });
    await Users.destroy({ where: { id: userId } });
    const isFavourites = await Favorites.findOne({ where: { userId } });
    assert.isNull(isFavourites);
  });

  it("should delete articleId when matching row is deleted from Articles Table", async () => {
    const { articleId, userId, articleSlug } = await favoriteDependencies();
    await Favorites.create({ articleId, userId, articleSlug });
    await Articles.destroy({ where: { id: articleId } });
    const isFavourites = await Favorites.findOne({ where: { articleId } });
    assert.isNull(isFavourites);
  });
});

after(async () => {
  sequelize.drop({ force: true });
});
