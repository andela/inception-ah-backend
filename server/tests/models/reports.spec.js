import { getReportDependencies } from "@dependencies";
import chai from "chai";
import db from "@models";
import chaiAsPromise from "chai-as-promised";

chai.use(chaiAsPromise);
const { expect } = chai;

beforeEach(async () => {
  await db.sequelize.sync({ force: true });
});

describe("Reports Model", () => {
  it("should create a Report model using valid article and userId", async () => {
    const { report } = await getReportDependencies();
    expect(report).to.be.instanceOf(db.Reports);
  });

  it("should not create report if user does not exist", async () => {
    let isError = false,
      errorMessage = false;
    await getReportDependencies({ reporterId: "123456789 " }).catch(err => {
      isError = true;
      errorMessage = err.message;
    });
    expect(isError).be.true;
    expect(errorMessage.endsWith("constraint failed")).to.be.true;
  });

  it("should not create report if reportedArticle is does not exist", async () => {
    let isError = false,
      errorMessage = false;
    await getReportDependencies({ reportedArticleId: "123456789 " }).catch(
      err => {
        isError = true;
        errorMessage = err.message;
      }
    );
    expect(isError).be.true;
    expect(errorMessage.endsWith("constraint failed")).to.be.true;
  });

  it("should not create report if message is not provided", async () => {
    let isError = false,
      errorMessage = false;
    await getReportDependencies({ message: null }).catch(err => {
      isError = true;
      errorMessage = err.message;
    });
    expect(isError).be.true;
    expect(errorMessage.endsWith("cannot be null")).to.be.true;
  });
});
