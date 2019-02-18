import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import database from "../../models/index";
import { userData } from "../fixtures/models/userData";
import articleData from "../fixtures/models/articleData";

chai.use(chaiAsPromise);
const { Users, Articles, Notifications } = database;
const { expect } = chai;

const notificationDependencies = async () => {
  const createdUser = await Users.create(userData);
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

beforeEach(async () => {
  await database.sequelize.sync({ force: true });
});

describe("Notifications model", () => {
  it("should create a notification model with valid user and article", async () => {
    const { userId, articleId, user } = await notificationDependencies();
    const notification = await Notifications.create({
      userId,
      source: articleId,
      message: "An article is liked"
    });
    expect(notification.get("userId")).equals(userId);
    expect(notification.get("source")).equals(articleId);
  });

  it("should remove notification when user is not reachable", async () => {
    const { userId, articleId, user } = await notificationDependencies();
    await Notifications.create({
      userId,
      source: articleId,
      message: "An article is liked"
    });
    const notificationBefore = await Notifications.find({ Where: { userId } });
    expect(notificationBefore).to.not.be.null;
    await user.destroy();
    const notificationAfter = await Notifications.find({ Where: { userId } });
    expect(notificationAfter).to.be.null;
  });

  it("should remove notification when Article is not reachable", async () => {
    const { userId, articleId, article } = await notificationDependencies();
    await Notifications.create({
      userId,
      source: articleId,
      message: "An article is liked"
    });
    const notificationBefore = await Notifications.findOne({
      Where: { userId }
    });
    expect(notificationBefore).to.not.be.null;
    await article.destroy();
    const notificationAfter = await Notifications.find({
      Where: { source: articleId }
    });
    expect(notificationAfter).to.be.null;
  });
});
