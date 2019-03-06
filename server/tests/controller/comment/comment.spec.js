import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "@app";
import models from "@models";
import { userData, registerUser } from "@fixtures";
import { commentDependencies } from "@dependencies";

chai.use(chaiHttp);
const { Comments } = models;

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

const createCommentDependencies = async () => {
  const user1 = await commentDependencies(userData[0], userData[1], "Tech");
  const user2 = await commentDependencies(userData[2], registerUser, "Fashion");
  return Promise.resolve({ user1, user2 });
};

const invalidCommentId = "9f432352-0d11-439c-842b-745f3a487d95";
const invalidSlug = "the-man-of-man-that-man-1550835108565";
const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ";

describe("CRUD Test for Article Comments", async () => {
  describe("POST </api/v1/articles/:slug/comments>", () => {
    it("should create a comment if valid details are passed in", async () => {
      const { user1 } = await createCommentDependencies();
      const res = await chai
        .request(app)
        .post(`/api/v1/articles/${user1.articleSlug}/comments`)
        .set("Authorization", user1.token)
        .send(user1.commentData);
      expect(res.statusCode).to.equal(201);
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.equal("Comment created successfully");
      expect(res.body.comment);
    });

    it("should return an error if invalid article slug is supplied", async () => {
      const { user1 } = await createCommentDependencies();
      const res = await chai
        .request(app)
        .post(`/api/v1/articles/${invalidSlug}/comments`)
        .set("Authorization", user1.token)
        .send(user1.commentData);
      expect(res.statusCode).to.equal(404);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal("Article is not found");
    });

    it("should return an error if token is not supplied", async () => {
      const { user1 } = await createCommentDependencies();
      const res = await chai
        .request(app)
        .post(`/api/v1/articles/${user1.articleSlug}/comments`)
        .send(user1.commentData);
      expect(res.statusCode).to.equal(401);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal("No valid token provided");
    });

    it("should return an error if the request body is invalid", async () => {
      const { user1 } = await createCommentDependencies();
      const res = await chai
        .request(app)
        .post(`/api/v1/articles/${user1.articleSlug}/comments`)
        .set("Authorization", user1.token)
        .send({ content: "    " });
      expect(res.statusCode).to.equal(400);
      expect(res.body.success).to.be.false;
      expect(res.body.errorMessages.content).to.equal(
        "Content is not allowed to be empty"
      );
    });

    it("should return an error if the token supplied is invalid", async () => {
      const { user1 } = await createCommentDependencies();
      const res = await chai
        .request(app)
        .post(`/api/v1/articles/${user1.articleSlug}/comments`)
        .set("Authorization", invalidToken)
        .send(user1.commentData);
      expect(res.statusCode).to.equal(500);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal("jwt malformed");
    });
  });

  describe("GET </api/v1/articles/:slug/comments>", () => {
    it("should return all comments on an article", async () => {
      const { user1 } = await createCommentDependencies();
      await Comments.create({
        userId: user1.userId,
        articleId: user1.articleId,
        content: user1.commentData.content
      });
      const res = await chai
        .request(app)
        .get(`/api/v1/articles/${user1.articleSlug}/comments`);
      expect(res.statusCode).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.equal("Comments retrieved successfully");
      expect(res.body.data);
    });

    it("should return an error if invalid article slug is supplied", async () => {
      const { user1 } = await createCommentDependencies();
      await Comments.create({
        userId: user1.userId,
        articleId: user1.articleId,
        content: user1.commentData.content
      });
      const res = await chai
        .request(app)
        .get(`/api/v1/articles/${invalidSlug}/comments`);
      expect(res.statusCode).to.equal(404);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal("Article is not found");
    });

    it("should return an error if the article has no comments", async () => {
      const { user2 } = await createCommentDependencies();
      const res = await chai
        .request(app)
        .get(`/api/v1/articles/${user2.articleSlug}/comments`);
      expect(res.statusCode).to.equal(404);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal("No Comments found");
    });
  });

  describe("DELETE </api/v1/articles/:slug/comments/:id>", () => {
    it("should delete a comment", async () => {
      const { user1 } = await createCommentDependencies();
      const newComment = await Comments.create({
        ...user1,
        content: user1.commentData.content
      });
      const commentId = newComment.dataValues.id;
      const res = await chai
        .request(app)
        .delete(`/api/v1/articles/${user1.articleSlug}/comments/${commentId}`)
        .set("Authorization", user1.token);
      expect(res.statusCode).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.equal("Comment deleted successfully");
    });

    it("should return an error if token is not supplied", async () => {
      const { user1 } = await createCommentDependencies();
      const newComment = await Comments.create({
        ...user1,
        content: user1.commentData.content
      });
      const commentId = newComment.dataValues.id;
      const res = await chai
        .request(app)
        .delete(`/api/v1/articles/${user1.articleSlug}/comments/${commentId}`);
      expect(res.statusCode).to.equal(401);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal("No valid token provided");
    });

    it("should return an error if invalid article slug is supplied", async () => {
      const { user1 } = await createCommentDependencies();
      const newComment = await Comments.create({
        ...user1,
        content: user1.commentData.content
      });
      const commentId = newComment.dataValues.id;
      const res = await chai
        .request(app)
        .delete(`/api/v1/articles/${invalidSlug}/comments/${commentId}`)
        .set("Authorization", user1.token);
      expect(res.statusCode).to.equal(404);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal("Article is not found");
    });

    it("should return an error if the comment does not exist", async () => {
      const { user2 } = await createCommentDependencies();
      const res = await chai
        .request(app)
        .delete(
          `/api/v1/articles/${user2.articleSlug}/comments/${invalidCommentId}`
        )
        .set("Authorization", user2.token);
      expect(res.statusCode).to.equal(404);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal("Comment is not found");
    });

    it("should return an error if the comment Id passed in is invalid", async () => {
      const { user2 } = await createCommentDependencies();
      const res = await chai
        .request(app)
        .delete(`/api/v1/articles/${user2.articleSlug}/comments/lllkhfreruj`)
        .set("Authorization", user2.token);
      expect(res.statusCode).to.equal(400);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal("Invalid comment Id");
    });

    it("should return an error if user tries to delete another user's comment", async () => {
      const { user1, user2 } = await createCommentDependencies();
      const newComment = await Comments.create({
        ...user1,
        content: user1.commentData.content
      });
      const commentId = newComment.dataValues.id;
      const res = await chai
        .request(app)
        .delete(`/api/v1/articles/${user1.articleSlug}/comments/${commentId}`)
        .set("Authorization", user2.token);
      expect(res.statusCode).to.equal(401);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal(
        "Unauthorized. Can not delete another user's comment"
      );
    });
  });

  describe("PUT </api/v1/articles/:slug/comments/:id>", () => {
    it("should update a comment if valid details are supplied", async () => {
      const { user1 } = await createCommentDependencies();
      const newComment = await Comments.create({
        ...user1,
        content: user1.commentData.content
      });
      const commentId = newComment.dataValues.id;
      const res = await chai
        .request(app)
        .put(`/api/v1/articles/${user1.articleSlug}/comments/${commentId}`)
        .set("Authorization", user1.token)
        .send({ content: "Nice writeup" });
      expect(res.statusCode).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.equal("Comment updated successfully");
      expect(res.body.comment);
    });

    it("should return an error if token is not supplied", async () => {
      const { user1 } = await createCommentDependencies();
      const newComment = await Comments.create({
        ...user1,
        content: user1.commentData.content
      });
      const commentId = newComment.dataValues.id;
      const res = await chai
        .request(app)
        .put(`/api/v1/articles/${user1.articleSlug}/comments/${commentId}`)
        .send({ content: "Nice writeup" });
      expect(res.statusCode).to.equal(401);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal("No valid token provided");
    });

    it("should return an error if invalid article slug is supplied", async () => {
      const { user1 } = await createCommentDependencies();
      const newComment = await Comments.create({
        ...user1,
        content: user1.commentData.content
      });
      const commentId = newComment.dataValues.id;
      const res = await chai
        .request(app)
        .put(`/api/v1/articles/${invalidSlug}/comments/${commentId}`)
        .set("Authorization", user1.token)
        .send({ content: "Nice writeup" });
      expect(res.statusCode).to.equal(404);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal("Article is not found");
    });

    it("should return an error if the comment does not exist", async () => {
      const { user2 } = await createCommentDependencies();
      const res = await chai
        .request(app)
        .put(
          `/api/v1/articles/${user2.articleSlug}/comments/${invalidCommentId}`
        )
        .set("Authorization", user2.token)
        .send({ content: "Nice writeup" });
      expect(res.statusCode).to.equal(404);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal("Comment is not found");
    });

    it("should return an error if the comment Id passed in is invalid", async () => {
      const { user2 } = await createCommentDependencies();
      const res = await chai
        .request(app)
        .put(`/api/v1/articles/${user2.articleSlug}/comments/hkkllhgk`)
        .set("Authorization", user2.token)
        .send({ content: "Nice writeup" });
      expect(res.statusCode).to.equal(400);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal("Invalid comment Id");
    });

    it("should return an error if user tries to update another user's comment", async () => {
      const { user1, user2 } = await createCommentDependencies();
      const newComment = await Comments.create({
        ...user1,
        content: user1.commentData.content
      });
      const commentId = newComment.dataValues.id;
      const res = await chai
        .request(app)
        .put(`/api/v1/articles/${user1.articleSlug}/comments/${commentId}`)
        .set("Authorization", user2.token)
        .send({ content: "Nice writeup" });
      expect(res.statusCode).to.equal(401);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal(
        "Unauthorized. Can not update another user's comment"
      );
    });
  });
});
