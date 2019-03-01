import chai, { expect } from "chai";
import chaiHttp from "chai-http";

import app from "@app";

chai.use(chaiHttp);

describe("Test for Article Pagination", () => {
  it("should return pagination error when pageNumber is negative", async () => {
    const res = await chai.request(app).get("/api/v1/articles/?pageNumber=-1");
    expect(res.statusCode).to.equal(400);
    expect(res.body.message).to.be.equal("Page number must not be negative");
  });

  it("should return pagination error when pageNumber is a string", async () => {
    const res = await chai
      .request(app)
      .get("/api/v1/articles/?pageNumber=kkkk");
    expect(res.statusCode).to.equal(400);
    expect(res.body.message).to.be.equal("Page number can only be an Integer");
  });

  it("should return pagination error when pageLimit is negative", async () => {
    const res = await chai.request(app).get("/api/v1/articles/?pageLimit=-1");
    expect(res.statusCode).to.equal(400);
    expect(res.body.message).to.be.equal("Page limit must not be negative");
  });

  it("should return pagination error when pageLimit is a string", async () => {
    const res = await chai.request(app).get("/api/v1/articles/?pageLimit=kkkk");
    expect(res.statusCode).to.equal(400);
    expect(res.body.message).to.be.equal("Page limit can only be an Integer");
  });
});
