import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "@app";
import models from "@models";
import {
  favoriteDependencies as articleWithNoReactionsDependencies,
  articleReactionsDependencies
} from "@dependencies";
import { generateJWT, getJWTConfigs } from "@helpers/jwt";

const jwtConfigs = getJWTConfigs({ option: "authentication" });

chai.use(chaiHttp);
const baseUrl = "/api/v1/articles";

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

describe("Test to add Reactions to Article", () => {
  it("should disallow a user that is not signed to like an article", async () => {
    const { articleSlug } = await articleReactionsDependencies();
    const response = await chai
      .request(app)
      .post(`${baseUrl}/${articleSlug}/reaction`)
      .set("authorization", "");
    expect(response.statusCode).to.equal(401);
  });

  it("should return a statusCode of 404 for an article that is not found", async () => {
    const { usersTokens } = await articleReactionsDependencies();
    const response = await chai
      .request(app)
      .post(`${baseUrl}/unknown/reaction`)
      .set("authorization", usersTokens[0]);
    expect(response.statusCode).to.equal(404);
  });

  it(`should like an article that is published 
    and unlike an article that was previously liked by the same user
    `, async () => {
    const {
      articleSlug,
      usersTokens,
      title
    } = await articleReactionsDependencies();
    const response = await chai
      .request(app)
      .post(`${baseUrl}/${articleSlug}/reaction`)
      .send({ reaction: true })
      .set({ authorization: usersTokens[0] });
    expect(response.statusCode).to.equal(201);
    expect(response.body.message).to.eql(
      `You have successfully added a like reaction to ${title}`
    );

    const unlikeResponse = await chai
      .request(app)
      .post(`${baseUrl}/${articleSlug}/reaction`)
      .set("authorization", usersTokens[0]);
    expect(unlikeResponse.statusCode).to.equal(200);
    expect(unlikeResponse.body.message).to.eql(
      `You have successfully removed your like reaction to ${title}`
    );
  });

  it(`should dislike an article that is published
    and remove the dislike on an article that was previously 
    disliked by the same user`, async () => {
    const {
      articleSlug,
      usersTokens,
      title
    } = await articleReactionsDependencies();

    const response = await chai
      .request(app)
      .post(`${baseUrl}/${articleSlug}/reaction`)
      .send({ reaction: false })
      .set({ authorization: usersTokens[0] });
    expect(response.statusCode).to.equal(201);
    expect(response.body.message).to.eql(
      `You have successfully added a dislike reaction to ${title}`
    );

    const unlikeResponse = await chai
      .request(app)
      .post(`${baseUrl}/${articleSlug}/reaction`)
      .set("authorization", usersTokens[0]);
    expect(unlikeResponse.statusCode).to.equal(200);
    expect(unlikeResponse.body.message).to.eql(
      `You have successfully removed your dislike reaction to ${title}`
    );
  });

  it("should fetch all article reactions given a correct slug", async () => {
    const { articleSlug, usersTokens } = await articleReactionsDependencies();
    const response = await chai
      .request(app)
      .get(`${baseUrl}/${articleSlug}/reaction`)
      .set({ authorization: usersTokens[0] });
    expect(response.statusCode).to.equal(200);
    expect(response.body.data.length).to.equal(2);
  });

  it("should return 404 for an article that does not have any reactions", async () => {
    const {
      articleSlug,
      title,
      userId
    } = await articleWithNoReactionsDependencies();

    const token = generateJWT({ userId }, jwtConfigs);
    const response = await chai
      .request(app)
      .get(`${baseUrl}/${articleSlug}/reaction`)
      .set({ authorization: token });
    expect(response.statusCode).to.equal(404);
    expect(response.body.message).to.eql(
      `There are no Reactions found for ${title}`
    );
  });
});
