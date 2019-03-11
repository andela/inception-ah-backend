import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "@app";
import models from "@models";
import { userDependencies } from "@fixtures";
import { generateJWT, getJWTConfigs } from "@helpers/jwt";

const jwtConfigs = getJWTConfigs({ option: "authentication" });

chai.use(chaiHttp);
const { Followers } = models;

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

describe("API Tests for users to follow each other", () => {
  describe("POST /api/v1/profiles/:id/follow", () => {
    it("should follow an author that is not followed by a user", async () => {
      const users = await userDependencies();
      const followerId = users[0].id;
      const authorId = users[1].id;
      const token = generateJWT({ userId: followerId }, jwtConfigs);
      const res = await chai
        .request(app)
        .post(`/api/v1/profiles/${authorId}/follow`)
        .set({ Authorization: token });
      expect(res.statusCode).to.equal(201);
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.equal("You are now following John Drew");
    });

    it("should return an error if a user wants to follow himself", async () => {
      const users = await userDependencies();
      const followerId = users[0].id;
      const token = generateJWT({ userId: followerId }, jwtConfigs);
      const res = await chai
        .request(app)
        .post(`/api/v1/profiles/${followerId}/follow`)
        .set({ Authorization: token });
      expect(res.statusCode).to.equal(403);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal("You cannot follow yourself");
    });

    it("should unfollow an author that is followed by a user", async () => {
      const users = await userDependencies();
      const followerId = users[0].id;
      const authorId = users[1].id;
      await Followers.create({ authorId, followerId });
      const token = generateJWT({ userId: followerId }, jwtConfigs);
      const res = await chai
        .request(app)
        .post(`/api/v1/profiles/${authorId}/follow`)
        .set({ Authorization: token });
      expect(res.statusCode).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.equal(
        "You are no longer following John Drew"
      );
    });
  });

  describe("GET /api/v1/profiles/follow", () => {
    it("should return all authors followed by a user", async () => {
      const users = await userDependencies();
      const followerId = users[0].id;
      const author1Id = users[1].id;
      const author2Id = users[2].id;
      await Followers.bulkCreate([
        { authorId: author1Id, followerId },
        { authorId: author2Id, followerId }
      ]);
      const token = generateJWT({ userId: followerId }, jwtConfigs);
      const res = await chai
        .request(app)
        .get(`/api/v1/profiles/follow`)
        .set({ Authorization: token });
      expect(res.statusCode).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.equal("Followed authors retrieved");
      expect(res.body.count).to.equal(2);
      expect(res.body.data).to.be.an("array");
    });

    it("should return an error if no author is followed by the user", async () => {
      const users = await userDependencies();
      const followerId = users[0].id;
      const token = generateJWT({ userId: followerId }, jwtConfigs);
      const res = await chai
        .request(app)
        .get(`/api/v1/profiles/follow`)
        .set({ Authorization: token });
      expect(res.statusCode).to.equal(404);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal("You are not following any author");
    });
  });

  describe("GET /api/v1/profiles/follower", () => {
    it("should return all users following an author", async () => {
      const users = await userDependencies();
      const userId = users[0].id;
      const follower1Id = users[1].id;
      const follower2Id = users[2].id;
      await Followers.bulkCreate([
        { authorId: userId, followerId: follower1Id },
        { authorId: userId, followerId: follower2Id }
      ]);
      const token = generateJWT({ userId }, jwtConfigs);
      const res = await chai
        .request(app)
        .get(`/api/v1/profiles/follower`)
        .set({ Authorization: token });
      expect(res.statusCode).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.equal("Followers retrieved");
      expect(res.body.count).to.equal(2);
      expect(res.body.data).to.be.an("array");
    });

    it("should return an error if an author does not have followers", async () => {
      const users = await userDependencies();
      const userId = users[0].id;
      const token = generateJWT({ userId }, jwtConfigs);
      const res = await chai
        .request(app)
        .get(`/api/v1/profiles/follower`)
        .set({ Authorization: token });
      expect(res.statusCode).to.equal(404);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal("You do not have followers");
    });
  });
});
