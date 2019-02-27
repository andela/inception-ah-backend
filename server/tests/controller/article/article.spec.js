import chai, { expect } from "chai";
import chaiHttp from "chai-http";

import app from "@app";
import models from "@models";
import { generateJWT, getJWTConfigs } from "@helpers/jwt";

import { registerUser, articleSpec } from "@fixtures";

const jwtConfigs = getJWTConfigs({ option: "authentication" });

chai.use(chaiHttp);
const { Articles, Users } = models;

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

const userDependencies = async () => {
  const user = await Users.create(registerUser);
  return Promise.resolve({ userId: user.get("id") });
};

describe("CRUD Article Feature </api/v1/article>", done => {
  const slug = "the-man-of-man-that-man-1550835108565";
  it("should create an article", async () => {
    const user = await userDependencies();
    const token = generateJWT({ userId: user.userId }, jwtConfigs);
    const res = await chai
      .request(app)
      .post("/api/v1/articles")
      .send(articleSpec)
      .set({ Authorization: token });
    expect(res.statusCode).to.equal(201);
    expect(res.body.success).to.be.true;
  });

  it("should return all articles by an author", async () => {
    const user = await userDependencies();
    const token = generateJWT({ userId: user.userId }, jwtConfigs);
    articleSpec.authorId = user.userId;
    const article = await Articles.create(articleSpec);
    const res = await chai
      .request(app)
      .get("/api/v1/articles/feed")
      .set({ Authorization: token });
    expect(res.statusCode).to.equal(200);
  });

  it("should return 404 error if authors articles are not found", async () => {
    const user = await userDependencies();
    const token = generateJWT({ userId: user.userId }, jwtConfigs);
    articleSpec.authorId = user.userId;
    const res = await chai
      .request(app)
      .get("/api/v1/articles/feed")
      .set({ Authorization: token });
    expect(res.statusCode).to.equal(404);
  });

  it("should return all published articles", async () => {
    const user = await userDependencies();
    articleSpec.authorId = user.userId;
    let articles = await Articles.create(articleSpec);
    const update = await articles.update({
      isPublished: true
    });
    const res = await chai
      .request(app)
      .get("/api/v1/articles/?pageNumber=1&pageLimit=20");
    expect(res.statusCode).to.equal(200);
  });

  it("should return 404 error if no published articles are found", async () => {
    const user = await userDependencies();
    articleSpec.authorId = user.userId;
    let articles = await Articles.create(articleSpec);
    const res = await chai.request(app).get("/api/v1/articles");
    expect(res.statusCode).to.equal(404);
  });

  it("should return one article if the slug is valid", async () => {
    const user = await userDependencies();
    articleSpec.authorId = user.userId;
    const article = await Articles.create(articleSpec);
    const res = await chai.request(app).get(`/api/v1/articles/${article.slug}`);
    expect(res.statusCode).to.equal(200);
  });

  it("should return 404 if the article slug is invalid", async () => {
    const user = await userDependencies();
    articleSpec.authorId = user.userId;
    const article = await Articles.create(articleSpec);
    const res = await chai.request(app).get(`/api/v1/articles/${slug}`);
    expect(res.statusCode).to.equal(404);
  });

  it("should update an article", async () => {
    const user = await userDependencies();
    const token = generateJWT({ userId: user.userId }, jwtConfigs);
    articleSpec.authorId = user.userId;
    const article = await Articles.create(articleSpec);
    const res = await chai
      .request(app)
      .put(`/api/v1/articles/${article.slug}`)
      .send({ ...articleSpec, title: "man of man man" })
      .set({ Authorization: token });
    expect(res.statusCode).to.equal(200);
  });

  it("should return 404 error if article to update is not found", async () => {
    const user = await userDependencies();
    const token = generateJWT({ userId: user.userId }, jwtConfigs);
    articleSpec.authorId = user.userId;
    const article = await Articles.create(articleSpec);
    const res = await chai
      .request(app)
      .put(`/api/v1/articles/${slug}`)
      .send({ ...articleSpec, title: "man of man man" })
      .set({ Authorization: token });
    expect(res.statusCode).to.equal(404);
    expect(res.body.success).to.be.false;
  });

  it("should return articles based on their category", async () => {
    const user = await userDependencies();
    articleSpec.authorId = user.userId;
    let articles = await Articles.create(articleSpec);
    const res = await chai
      .request(app)
      .get(`/api/v1/categories/${articles.categoryId}/articles`);
    expect(res.statusCode).to.equal(200);
  });

  it("should publish an unpublished article", async () => {
    const user = await userDependencies();
    const token = generateJWT({ userId: user.userId }, jwtConfigs);
    articleSpec.authorId = user.userId;
    const article = await Articles.create(articleSpec);
    const res = await chai
      .request(app)
      .put(`/api/v1/articles/${article.slug}/publish`)
      .set({ Authorization: token });
    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
  });

  it("should return 404 error if article to publish is not found", async () => {
    const user = await userDependencies();
    const token = generateJWT({ userId: user.userId }, jwtConfigs);
    articleSpec.authorId = user.userId;
    const article = await Articles.create(articleSpec);
    const res = await chai
      .request(app)
      .put(`/api/v1/articles/${slug}/publish`)
      .set({ Authorization: token });
    expect(res.statusCode).to.equal(404);
    expect(res.body.success).to.be.false;
  });

  it("should delete an article", async () => {
    const user = await userDependencies();
    const token = generateJWT({ userId: user.userId }, jwtConfigs);
    articleSpec.authorId = user.userId;
    const article = await Articles.create(articleSpec);
    const res = await chai
      .request(app)
      .delete(`/api/v1/articles/${article.slug}`)
      .set({ Authorization: token });
    expect(res.statusCode).to.equal(200);
  });

  it("should return 404 error if article to delete is not found", async () => {
    const user = await userDependencies();
    const token = generateJWT({ userId: user.userId }, jwtConfigs);
    articleSpec.authorId = user.userId;
    const article = await Articles.create(articleSpec);
    const res = await chai
      .request(app)
      .put(`/api/v1/articles/${slug}`)
      .set({ Authorization: token });
    expect(res.statusCode).to.equal(404);
    expect(res.body.success).to.be.false;
  });
});
