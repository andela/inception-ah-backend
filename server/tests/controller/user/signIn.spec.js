import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import app from "@app";
import models from "@models";
import { userData } from "@fixtures";
import { userLogin } from "@controllers/user";

chai.use(chaiHttp);
chai.use(sinonChai);
const { firstName, lastName, email, password } = userData[0];

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

afterEach(() => sinon.restore());

const signUp = async () => {
  const res = await chai
    .request(app)
    .post("/api/v1/auth/signup")
    .send({ firstName, lastName, email, password });
};

describe("POST <API /api/v1/auth/signin>", () => {
  it("should login a valid user", async () => {
    await signUp();
    const res = await chai
      .request(app)
      .post("/api/v1/auth/signin")
      .send({ email, password });
    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.not.be.null;
  });

  it("should not login an invalid user", async () => {
    await signUp();
    const res = await chai
      .request(app)
      .post("/api/v1/auth/signin")
      .send({ email, password: "bad password" });
    expect(res.statusCode).to.equal(401);
    expect(res.body.data).to.be.null;
    expect(res.body.success).to.be.false;
  });

  it("should return server error for userLogin", async () => {
    const req = { body: {} };
    const res = {
      status() {},
      json() {}
    };
    sinon.stub(res, "status").returnsThis();
    sinon.stub(models.Users, "findOne").throws();
    await userLogin(req, res);
    expect(res.status).to.have.been.calledWith(500);
  });
});
