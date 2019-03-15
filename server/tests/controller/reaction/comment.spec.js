import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "@app";
import models from "@models";
import {
  favoriteDependencies as commentWithNoReactionDependencies,
  commentDependencies,
  articleReactionsDependencies as usersCommentsReactionsDependencies
} from "@dependencies";

import { userData } from "@fixtures";
import { generateJWT, getJWTConfigs } from "@helpers/jwt";

const jwtConfigs = getJWTConfigs({ option: "authentication" });

chai.use(chaiHttp);
const { Comments } = models;

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});
const invalidCommentId = "9f432352-0d11-439c-842b-745f3a487d95";

const commentReactionDependencies = async () => {
  const { userId, articleId, token, articleSlug } = await commentDependencies(
    userData[0],
    userData[1],
    "Tech"
  );

  const commentInstance = await Comments.create({
    userId,
    articleId,
    content: "This is a comment"
  });
  const commentId = commentInstance.get("id");
  const content = commentInstance.get("content");
  return Promise.resolve({ commentId, token, articleSlug, content });
};

describe("Test to add Reactions to Comment", () => {
  it("should disallow a user that is not signed to like an comment", async () => {
    const { commentId } = await commentReactionDependencies();
    const res = await chai
      .request(app)
      .post(`/api/v1/comments/${commentId}/reaction`)
      .set("authorization", "");
    expect(res.statusCode).to.equal(401);
  });

  it("should return a statusCode of 404 for a comment that is not found", async () => {
    const { token } = await commentReactionDependencies();
    const response = await chai
      .request(app)
      .post(`/api/v1/comment/${invalidCommentId}/reaction`)
      .set("authorization", token);
    expect(response.statusCode).to.equal(404);
  });

  it(`should like a comment 
    and unlike the comment that was previously liked by the same user
    `, async () => {
    const { token, commentId, content } = await commentReactionDependencies();

    const res = await chai
      .request(app)
      .post(`/api/v1/comments/${commentId}/reaction`)
      .send({ reaction: true })
      .set({ authorization: token });
    expect(res.statusCode).to.equal(201);
    expect(res.body.message).to.eql(
      `You have successfully added a like reaction to ${content}`
    );

    const unlikeResponse = await chai
      .request(app)
      .post(`/api/v1/comments/${commentId}/reaction`)
      .set("authorization", token);
    expect(unlikeResponse.statusCode).to.equal(200);
    expect(unlikeResponse.body.message).to.eql(
      `You have successfully removed your like reaction to ${content}`
    );
  });
  it(`should dislike a comment 
    and remove the like on the comment that was 
    previously liked by the same user`, async () => {
    const { token, commentId, content } = await commentReactionDependencies();

    const res = await chai
      .request(app)
      .post(`/api/v1/comments/${commentId}/reaction`)
      .send({ reaction: false })
      .set({ authorization: token });
    expect(res.statusCode).to.equal(201);
    expect(res.body.message).to.eql(
      `You have successfully added a dislike reaction to ${content}`
    );

    const unlikeResponse = await chai
      .request(app)
      .post(`/api/v1/comments/${commentId}/reaction`)
      .set("authorization", token);
    expect(unlikeResponse.statusCode).to.equal(200);
    expect(unlikeResponse.body.message).to.eql(
      `You have successfully removed your dislike reaction to ${content}`
    );
  });

  it("should fetch all comment reactions given a correct commentId", async () => {
    const {
      usersTokens,
      commentId
    } = await usersCommentsReactionsDependencies();
    const response = await chai
      .request(app)
      .get(`/api/v1/comments/${commentId}/reaction`)
      .set({ authorization: usersTokens[0] });
    expect(response.statusCode).to.equal(200);
    expect(response.body.data.length).to.equal(2);
  });

  it("should return 404 for a comment that does not have any reactions", async () => {
    const {
      content,
      userId,
      commentId
    } = await commentWithNoReactionDependencies();
    const token = generateJWT({ userId }, jwtConfigs);
    const response = await chai
      .request(app)
      .get(`/api/v1/comments/${commentId}/reaction`)
      .set({ authorization: token });
    expect(response.statusCode).to.equal(404);
    expect(response.body.message).to.eql(
      `There are no Reactions found for ${content}`
    );
  });
});
