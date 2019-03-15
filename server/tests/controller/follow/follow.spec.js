import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "@app";
import models from "@models";
import { followerDependencies } from "@dependencies";
import { generateJWT, getJWTConfigs } from "@helpers/jwt";

const jwtConfigs = getJWTConfigs({ option: "authentication" });

chai.use(chaiHttp);
const { Followers } = models;

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

describe("API Tests for users to follow each other", () => {
  describe("POST /api/v1/profiles/:userIdd/follow", () => {
    it("should follow an author that is not followed by a user", async () => {
      const { author, follower } = await followerDependencies();
      const token = generateJWT({ userId: follower.id }, jwtConfigs);
      const res = await chai
        .request(app)
        .post(`/api/v1/profiles/${author.id}/follow`)
        .set({ Authorization: token });
      expect(res.statusCode).to.equal(201);
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.equal("You are now following John Drew");
    });

    it("should return an error if a user wants to follow himself", async () => {
      const { author } = await followerDependencies();
      const token = generateJWT({ userId: author.id }, jwtConfigs);
      const res = await chai
        .request(app)
        .post(`/api/v1/profiles/${author.id}/follow`)
        .set({ Authorization: token });
      expect(res.statusCode).to.equal(403);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal("You cannot follow yourself");
    });

    it("should unfollow an author that is followed by a user", async () => {
      const { follower, author } = await followerDependencies();
      await Followers.create({ authorId: author.id, followerId: follower.id });
      const token = generateJWT({ userId: follower.id }, jwtConfigs);
      const res = await chai
        .request(app)
        .post(`/api/v1/profiles/${author.id}/follow`)
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
      const { follower, author } = await followerDependencies();
      await Followers.create({ authorId: author.id, followerId: follower.id });
      const token = generateJWT({ userId: follower.id }, jwtConfigs);
      const res = await chai
        .request(app)
        .get(`/api/v1/profiles/follow`)
        .set({ Authorization: token });
      expect(res.statusCode).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.equal("Followed authors retrieved");
      expect(res.body.count).to.equal(1);
      expect(res.body.data).to.be.an("array");
    });

    it("should return an error if no author is followed by the user", async () => {
      const { follower } = await followerDependencies();
      const token = generateJWT({ userId: follower.id }, jwtConfigs);
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
      const { follower, author } = await followerDependencies();
      await Followers.create({ authorId: author.id, followerId: follower.id });
      const token = generateJWT({ userId: author.id }, jwtConfigs);
      const res = await chai
        .request(app)
        .get(`/api/v1/profiles/follower`)
        .set({ Authorization: token });
      expect(res.statusCode).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.equal("Followers retrieved");
      expect(res.body.count).to.equal(1);
      expect(res.body.data).to.be.an("array");
    });

    it("should return an error if an author does not have followers", async () => {
      const { author } = await followerDependencies();
      const token = generateJWT({ userId: author.id }, jwtConfigs);
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
