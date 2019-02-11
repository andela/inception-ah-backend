import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import models from "@models";
import app from "@app";
import { logInUserDependencies } from "@dependencies";
import { articleData, category } from "@fixtures";
import { decodeJWT, getJWTConfigs } from "@helpers/jwt";

const { Articles, Categories } = models;

chai.use(chaiHttp);
const baseUrl = "/api/v1/articles";
beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

const favoriteDependency = async () => {
  const userLoginResponse = await logInUserDependencies(
    "obasajujoshua31@gmail.com",
    "make.meProud2"
  );

  const token = userLoginResponse.token;
  const { userId } = await decodeJWT(
    token,
    getJWTConfigs({ option: "authentication" })
  );

  const articleCategory = await Categories.create(category);
  const categoryId = articleCategory.get("id");
  const articleTemplate = Object.assign(articleData, {
    authorId: userId,
    categoryId
  });

  const article = await Articles.create(articleTemplate);
  const slug = article.get("slug");
  const title = article.get("title");

  return Promise.resolve({
    slug,
    title,
    token
  });
};

describe("Test to Favorite an article", () => {
  it("should disallow a user that is not signed to favorite an article", async () => {
    const { slug } = await favoriteDependency();
    const response = await chai
      .request(app)
      .post(`${baseUrl}/${slug}/favorite`)
      .set("authorization", "");
    expect(response.statusCode).to.equal(401);
  });

  it("should return a statusCode of 404 for an article that is not found", async () => {
    const { token } = await favoriteDependency();
    const response = await chai
      .request(app)
      .post(`${baseUrl}/unknown/favorite`)
      .set("authorization", token);
    expect(response.statusCode).to.equal(404);
  });

  it(`should favorite an article that is not already favorited by the same user
 and unfavorite that article when the same user favorite the article`, async () => {
    const { slug, token, title } = await favoriteDependency();
    const response = await chai
      .request(app)
      .post(`${baseUrl}/${slug}/favorite`)
      .set("authorization", token);
    expect(response.statusCode).to.equal(200);
    expect(response.body.message).to.eql(
      `${title} has been added as your favourite`
    );

    const unfavoriteResponse = await chai
      .request(app)
      .post(`${baseUrl}/${slug}/favorite`)
      .set("authorization", token);
    expect(unfavoriteResponse.statusCode).to.equal(200);
    expect(unfavoriteResponse.body.message).to.eql(
      `${title} was successfully removed from your favorite lists of articles`
    );
  });

  it("should return a statuscode of 500 for a malformed token", async () => {
    const { slug } = await favoriteDependency();
    const response = await chai
      .request(app)
      .post(`${baseUrl}/${slug}/favorite`)
      .set("authorization", "kdkkdkdkkdkdkkdkd");
    expect(response.statusCode).to.equal(500);
  });
});

after(async () => {
  await models.sequelize.drop();
});
