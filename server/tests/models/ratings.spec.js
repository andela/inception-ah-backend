import { getRatingsDependencies } from "@dependencies";

import chai from "chai";
import db from "@models";
import chaiAsPromise from "chai-as-promised";

chai.use(chaiAsPromise);
const { expect } = chai;

beforeEach(async () => {
  await db.sequelize.sync({ force: true });
});

describe("Ratings Model", () => {
  it("should create Ratings model", async () => {
    const { rating } = await getRatingsDependencies();
    expect(rating).to.be.instanceOf(db.Ratings);
  });

  it("should not create rating if the rater does not exist in Users", async () => {
    let isError = false,
      errorMessage = false;
    await getRatingsDependencies({ raterId: 3 }).catch(err => {
      isError = true;
      errorMessage = err.message;
    });
    expect(isError).be.true;
    expect(errorMessage.endsWith("FOREIGN KEY constraint failed")).to.be.true;
  });

  it("should delete rating if the rater is no longer in Users table", async () => {
    const { rater } = await getRatingsDependencies();
    const raterId = rater.get("id");
    expect(rater).to.be.instanceOf(db.Users);
    await rater.destroy();
    const isRating = await db.Ratings.findOne({ where: { raterId } });
    expect(isRating).to.be.null;
  });

  it("should not create rating if the Article does not exist in Articles", async () => {
    let isError = false,
      errorMessage = false;
    await getRatingsDependencies({ articleId: 3 }).catch(err => {
      isError = true;
      errorMessage = err.message;
    });
    expect(isError).be.true;
    expect(errorMessage.endsWith("FOREIGN KEY constraint failed")).to.be.true;
  });

  it("should delete rating if the article is no longer in Articles table", async () => {
    const { articleInstance } = await getRatingsDependencies();
    const articleId = articleInstance.get("id");
    expect(articleInstance).to.be.instanceOf(db.Articles);
    await articleInstance.destroy();
    const isRating = await db.Ratings.findOne({
      where: { raterId: articleId }
    });
    expect(isRating).to.be.null;
  });
});
