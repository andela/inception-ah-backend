import { logInUserDependencies, signUpDependencies } from "@dependencies";
import chai, { expect } from "chai";
import models from "@models";
import app from "@app";
import { articleSpec, category } from "@fixtures";

const createArticle = async accessToken => {
  const _category = await models.Categories.create(category);
  const articleData = Object.assign({}, articleSpec, {
    categoryId: _category.get("id")
  });
  const req = await chai
    .request(app)
    .post("/api/v1/articles")
    .send(articleData)
    .set({ Authorization: accessToken });
  return req.body;
};

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

describe("Rate Article", () => {
  it("should rate and article", async () => {
    const { email, password } = await signUpDependencies();
    const { token } = await logInUserDependencies(email, password);
    const { article } = await createArticle(token);
    const ratingRequest = await chai
      .request(app)
      .post(`/api/v1/articles/rate/${article.slug}`)
      .send({ score: 1 })
      .set({ Authorization: token });
    expect(ratingRequest.statusCode).equal(201);
    expect(ratingRequest.body.success).to.be.true;
    expect(ratingRequest.body.data.score).equal(1);
  });

  it(`should NOT create a new rating, but modify a users previous rating on subsequent rate`, async () => {
    const { email, password } = await signUpDependencies();
    const { token } = await logInUserDependencies(email, password);
    const { article } = await createArticle(token);
    const ratingAttempt1 = await chai
      .request(app)
      .post(`/api/v1/articles/rate/${article.slug}`)
      .send({ score: 1 })
      .set({ Authorization: token });
    expect(ratingAttempt1.statusCode).equal(201);
    expect(ratingAttempt1.body.success).to.be.true;
    expect(ratingAttempt1.body.data.score).equal(1);

    const ratingAttempt2 = await chai
      .request(app)
      .post(`/api/v1/articles/rate/${article.slug}`)
      .send({ score: 3 })
      .set({ Authorization: token });
    expect(ratingAttempt2.statusCode).equal(202);
    expect(ratingAttempt2.body.success).to.be.true;
    expect(ratingAttempt2.body.data.score).equal(3);
    const ratingCount = await models.Ratings.findAndCountAll();
    expect(ratingCount.count).equal(1);
  });

  it("should not allow a rating score less than 1", async () => {
    const { email, password } = await signUpDependencies();
    const { token } = await logInUserDependencies(email, password);
    const { article } = await createArticle(token);
    const ratingAttempt1 = await chai
      .request(app)
      .post(`/api/v1/articles/rate/${article.slug}`)
      .send({ score: 0 })
      .set({ Authorization: token });
    expect(ratingAttempt1.statusCode).equal(400);
    expect(ratingAttempt1.body.success).to.be.false;
    expect(ratingAttempt1.body.data).to.be.null;
  });

  it("should not allow a rating score greater than 5", async () => {
    const { email, password } = await signUpDependencies();
    const { token } = await logInUserDependencies(email, password);
    const { article } = await createArticle(token);
    const ratingAttempt1 = await chai
      .request(app)
      .post(`/api/v1/articles/rate/${article.slug}`)
      .send({ score: 6 })
      .set({ Authorization: token });
    expect(ratingAttempt1.statusCode).equal(400);
    expect(ratingAttempt1.body.success).to.be.false;
    expect(ratingAttempt1.body.data).to.be.null;
  });
});
