import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import database from "../../models";
import { userData } from "../fixtures/models/userData";

chai.use(chaiAsPromise);
const { Users, Followers, sequelize } = database;
const { expect } = chai;

const fellowersDependencies = async () => {
  const authorsData = Object.assign({}, userData);
  authorsData.email = "obj@email.com";
  const author = await Users.create(authorsData);
  const fellow = await Users.create(userData);
  const followerId = fellow.get("id");

  const authorId = author.get("id");
  return Promise.resolve({
    fellow,
    author,
    authorId,
    followerId
  });
};

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

describe("Fellowers", () => {
  it("should create a fellowers table", async () => {
    const { followerId, authorId } = await fellowersDependencies();
    const fellowers = await Followers.create({ followerId, authorId });
    expect(fellowers).to.not.be.null;
  });

  it("should remove a follower when he is deleted in Users table", async () => {
    const { followerId, authorId, fellow } = await fellowersDependencies();
    await Followers.create({ followerId, authorId });
    await fellow.destroy();
    const isFollower = await Followers.findOne({ where: { followerId } });
    expect(isFollower).to.be.null;
  });

  it("should remove followers when the Author is deleted from Users", async () => {
    const { followerId, authorId, author } = await fellowersDependencies();
    await Followers.create({ followerId, authorId });
    await author.destroy();
    const isAuthor = await Followers.findOne({ where: { authorId } });
    expect(isAuthor).to.be.null;
  });
});
