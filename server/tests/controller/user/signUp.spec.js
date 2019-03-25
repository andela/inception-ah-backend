import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import app from "@app";
import models from "@models";
import { userData } from "@fixtures";
import { userSignUp } from "@controllers/user";

chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

afterEach(() => sinon.restore());

const { firstName, lastName, password } = userData[0];

describe("POST <API /api/v1/auth/signup>", () => {
  it("should not sign up a user if all required fields are not present", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/auth/signup")
      .send({});
    expect(res.statusCode).to.equal(400);
    expect(res.body).to.be.an("object");
    expect(res.body.errorMessages).to.have.any.keys(
      "firstName",
      "lastName",
      "email",
      "password"
    );
  });

  it("should sign up a user if all required fields are present", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/auth/signup")
      .send({
        firstName,
        lastName,
        email: "solo.biggie@gmail.com",
        password
      });
    expect(res.statusCode).to.equal(201);
    expect(res.body.success).to.equal(true);
    expect(res.body)
      .to.haveOwnProperty("message")
      .to.be.a("string");
  });

  it("should not sign up a user if email has been used", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/auth/signup")
      .send(userData[0]);
    expect(res.statusCode).to.equal(400);
    expect(res.body).to.be.an("object");
  });

  it("should return server error for userSignUp", async () => {
    const req = { body: {} };
    const res = {
      status() {},
      json() {}
    };
    sinon.stub(res, "status").returnsThis();
    sinon.stub(models.Users, "create").throws();
    await userSignUp(req, res);
    expect(res.status).to.have.been.calledWith(500);
  });
});
