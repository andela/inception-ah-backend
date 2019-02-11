import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../index";

chai.use(chaiHttp);

describe("GET <API />", () => {
  it("should return successful connection", async () => {
    const res = await chai.request(app).get("/api/v1");
    expect(res.statusCode).to.equal(200);
  });

  it("should return a 404 error", async () => {
    const res = await chai.request(app).post("/api/blahblahblah");
    expect(res.statusCode).to.equal(404);
  });

  it("should return 200 as status code", async () => {
    const res = await chai.request(app).get("/");
    expect(res.statusCode).to.equal(200);
  });
});
