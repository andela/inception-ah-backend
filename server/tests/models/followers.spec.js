import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import database from "@models";
import { userData } from "@fixtures";

chai.use(chaiAsPromise);
const { Users, Followers, sequelize } = database;
const { expect } = chai;
const user1 = userData[0];

const followersDependencies = async () => {
  const authorsData = Object.assign({}, user1);
  authorsData.email = "obj@email.com";
  const author = await Users.create(authorsData);
  const follower = await Users.create(user1);
  const followerId = follower.get("id");
  const authorId = author.get("id");
  return Promise.resolve({
    follower,
    author,
    authorId,
    followerId
  });
};

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

describe("followers", () => {
  it("should create a followers table", async () => {
    const { followerId, authorId } = await followersDependencies();
    const follower = await Followers.create({ followerId, authorId });
    expect(follower).to.not.be.null;
  });

  it("should remove a follower when he is deleted in Users table", async () => {
    const { followerId, authorId, follower } = await followersDependencies();
    await Followers.create({ followerId, authorId });
    await follower.destroy();
    const isFollower = await Followers.findOne({ where: { followerId } });
    expect(isFollower).to.be.null;
  });

  it("should remove followers when the Author is deleted from Users", async () => {
    const { followerId, authorId, author } = await followersDependencies();
    await Followers.create({ followerId, authorId });
    await author.destroy();
    const isAuthor = await Followers.findOne({ where: { authorId } });
    expect(isAuthor).to.be.null;
  });
});
