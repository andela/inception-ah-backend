import { signUp, login, createArticle, publishArticle } from "@dependencies";

import models from "@models";
import app from "@app";
import chai from "chai";

const expect = chai.expect;

const searchDependencies = async () => {
  await signUp();
  const token = await login();
  const { article } = await createArticle(token);
  await publishArticle(article, token);
  return { article, token };
};

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

describe("search article", () => {
  it("should find article that has query keyword in it title", async () => {
    const { article, token } = await searchDependencies();
    const titleWord = article.title.split(" ");
    const response = await chai
      .request(app)
      .get(`/api/v1/articles?search&query=${titleWord[0]}&pageLimit=1`)
      .set({ Authorization: token });
    expect(response.statusCode).equal(200);
    expect(response.body.data).lengthOf(1);
  });
});
