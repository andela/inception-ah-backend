import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../index";

chai.use(chaiHttp);
const expect = chai.expect;

describe("GET <API />", () => {
  it("should return successful connection", done => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it("should return a 404 error", done => {
    chai
      .request(app)
      .post("/api/blahblahblah")
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        done();
      });
  });
});
